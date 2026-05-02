import React, { useEffect, useRef, useState } from "react";
import { Send, Phone, Video } from "lucide-react";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocketChat } from "../../hooks/useSocketChat";
import { motion } from "framer-motion";

function ChatWindow() {
  const { user, loading } = useAuth();
  const { selectedUser } = useChat();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [fetching, setFetching] = useState(false);

  const bottomRef = useRef(null);

  // ================= FETCH MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id || !user?._id) {
        setMessages([]);
        return;
      }

      try {
        setFetching(true);
        const { data } = await axios.get(`/message/${selectedUser._id}`);

        if (data.success) {
          setMessages(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  // ================= MARK SEEN =================
  useEffect(() => {
    const markSeen = async () => {
      if (!selectedUser?._id || !user?._id) return;

      try {
        await axios.put(`/message/seen/${selectedUser._id}`);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender?._id === selectedUser._id ||
            msg.sender === selectedUser._id
              ? { ...msg, isSeen: true }
              : msg
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    markSeen();
  }, [selectedUser, user]);

  // ================= SOCKET =================
  const { sendMessage } = useSocketChat({
    userId: user?._id,
    onReceiveMessage: (msg) =>
      setMessages((prev) => [...prev, msg]),
    onOnlineUsers: (users) => setOnlineUsers(users),
  });

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages]);

  // ================= SEND =================
  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser?._id) return;

    const payload = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: message.trim(),
      isSeen: false,
      createdAt: new Date(),
    };

    sendMessage(payload);

    setMessages((prev) => [
      ...prev,
      { ...payload, sender: user._id },
    ]);

    setMessage("");
  };

  // ================= LOADING =================
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
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-gray-900/70 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                selectedUser?.photo ||
                `https://ui-avatars.com/api/?name=${selectedUser?.fullname || "User"}`
              }
              className="w-12 h-12 rounded-full border border-violet-500"
            />

            {onlineUsers.includes(selectedUser?._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-ping" />
            )}
          </div>

          <div>
            <h2 className="text-white font-semibold">
              {selectedUser?.fullname || "Select User"}
            </h2>
            <p className="text-xs text-gray-400">
              {onlineUsers.includes(selectedUser?._id)
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
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {fetching ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded w-2/3" />
            ))}
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMe =
              msg.sender?._id === user?._id ||
              msg.sender === user?._id;

            const prev = messages[index - 1];
            const isSameSender =
              prev?.sender === msg.sender;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } ${!isSameSender ? "mt-4" : "mt-1"}`}
              >
                <div
                  className={`max-w-[65%] px-4 py-2 rounded-2xl shadow-md ${
                    isMe
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>

                  <div className="flex justify-end gap-1 mt-1 text-[10px]">
                    <span>
                      {new Date(
                        msg.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isMe && (
                      <span
                        className={
                          msg.isSeen
                            ? "text-blue-400"
                            : "text-gray-400"
                        }
                      >
                        ✔✔
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-10">
            💬 Start the conversation
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3 bg-gray-950 px-4 py-2 rounded-full border border-gray-700 focus-within:border-violet-500">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedUser
                ? "Type a message..."
                : "Select user first"
            }
            disabled={!selectedUser}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!selectedUser}
            className="bg-violet-600 hover:bg-violet-700 active:scale-90 transition-all p-2 rounded-full"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;