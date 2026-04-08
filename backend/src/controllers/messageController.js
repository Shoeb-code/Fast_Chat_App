import Message from "../models/Message.js";


// ===============================
// Send Message
// ===============================
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    // validation
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Receiver ID and message content are required",
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send message",
      error: error.message,
    });
  }
};


// ===============================
// Get Messages (2-way chat)
// ===============================
export const getMessages = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID is required",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUserId,
        },
      ],
    })
      .populate(
        "sender",
        "fullname email photo"
      )
      .populate(
        "receiver",
        "fullname email photo"
      )
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch messages",
      error: error.message,
    });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId } = req.params
    const receiverId = req.user._id

    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        isSeen: false
      },
      {
        $set: { isSeen: true }
      }
    )

    return res.status(200).json({
      success: true,
      message: "Messages marked as seen"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}