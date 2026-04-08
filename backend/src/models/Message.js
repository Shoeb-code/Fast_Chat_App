import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    mediaUrl: {
      type: String,
      default: null,
    },

    isSeen: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    seenAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// compound index for chat queries
messageSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: -1,
});

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;