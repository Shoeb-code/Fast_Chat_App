import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Send,
  Phone,
  Video,
} from "lucide-react";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocketChat } from "../../hooks/useSocketChat";

function ChatWindow() {
  const { user, loading } =
    useAuth();
  const { selectedUser } =
    useChat();

  const [message, setMessage] =
    useState("");
  const [messages, setMessages] =
    useState([]);
  const [onlineUsers, setOnlineUsers] =
    useState([]);
  const [fetching, setFetching] =
    useState(false);

  const bottomRef = useRef(null);

  // =========================
  // Fetch old messages
  // =========================
  useEffect(() => {
    const fetchMessages =
      async () => {
        if (
          !selectedUser?._id ||
          !user?._id
        ) {
          setMessages([]);
          return;
        }

        try {
          setFetching(true);

          const { data } =
            await axios.get(
              `/message/${selectedUser._id}`
            );

          if (data.success) {
            setMessages(
              data.data || []
            );
          }
        } catch (error) {
          console.error(
            "Fetch messages error:",
            error
          );
        } finally {
          setFetching(false);
        }
      };

    fetchMessages();
  }, [selectedUser, user]);

  // =========================
  // Mark messages as seen
  // =========================
  useEffect(() => {
    const markSeen =
      async () => {
        if (
          !selectedUser?._id ||
          !user?._id
        )
          return;

        try {
          await axios.put(
            `/message/seen/${selectedUser._id}`
          );

          setMessages(
            (prev) =>
              prev.map((msg) =>
                msg.sender?._id ===
                  selectedUser._id ||
                msg.sender ===
                  selectedUser._id
                  ? {
                      ...msg,
                      isSeen: true,
                    }
                  : msg
              )
          );
        } catch (error) {
          console.error(
            "Seen update failed",
            error
          );
        }
      };

    markSeen();
  }, [selectedUser, user]);

  // =========================
  // Socket chat
  // =========================
  const { sendMessage } =
    useSocketChat({
      userId: user?._id,

      onReceiveMessage: (
        newMessage
      ) => {
        setMessages((prev) => [
          ...prev,
          newMessage,
        ]);
      },

      onOnlineUsers: (
        users
      ) => {
        setOnlineUsers(users);
      },
    });

  // =========================
  // Auto scroll
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  // =========================
  // Send message
  // =========================
  const handleSendMessage = () => {
    if (
      !message.trim() ||
      !selectedUser?._id ||
      !user?._id
    )
      return;

    const payload = {
      senderId: user._id,
      receiverId:
        selectedUser._id,
      content:
        message.trim(),
      isSeen: false,
      createdAt:
        new Date(),
    };

    sendMessage(payload);

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        sender: user._id,
      },
    ]);

    setMessage("");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                selectedUser?.photo ||
                `https://ui-avatars.com/api/?name=${
                  selectedUser?.fullname ||
                  "User"
                }`
              }
              alt="user"
              className="w-12 h-12 rounded-full object-cover border border-violet-500"
            />

            {selectedUser &&
              onlineUsers.includes(
                selectedUser._id
              ) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
              )}
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg">
              {selectedUser?.fullname ||
                "Select User"}
            </h2>

            <p className="text-xs text-gray-400">
              {selectedUser &&
              onlineUsers.includes(
                selectedUser._id
              )
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-gray-300">
          <Phone className="cursor-pointer hover:text-white" />
          <Video className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {fetching ? (
          <p className="text-center text-gray-400">
            Loading messages...
          </p>
        ) : messages.length >
          0 ? (
          messages.map(
            (msg, index) => {
              const isMe =
                msg.sender?._id ===
                  user?._id ||
                msg.sender ===
                  user?._id ||
                msg.senderId ===
                  user?._id;

              return (
                <div
                  key={index}
                  className={`flex ${
                    isMe
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${
                      isMe
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-gray-800 text-white rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">
                      {
                        msg.content
                      }
                    </p>

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-[10px] text-gray-300">
                        {new Date(
                          msg.createdAt ||
                            Date.now()
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </p>

                      {isMe && (
                        <span className="text-[10px]">
                          {msg.isSeen
                            ? "✓✓"
                            : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )
        ) : (
          <p className="text-center text-gray-500">
            No messages yet
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-3 bg-gray-900">
        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder={
            selectedUser
              ? "Type a message"
              : "Select user first"
          }
          disabled={
            !selectedUser
          }
          className="flex-1 bg-gray-950 text-white rounded-full px-5 py-3 outline-none border border-gray-700 focus:border-violet-500 disabled:opacity-50"
        />

        <button
          onClick={
            handleSendMessage
          }
          disabled={
            !selectedUser
          }
          className="bg-violet-600 hover:bg-violet-700 transition-all p-3 rounded-full shadow-lg disabled:opacity-50"
        >
          <Send
            className="text-white"
            size={18}
          />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;