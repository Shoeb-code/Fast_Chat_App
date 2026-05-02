import React, { useEffect, useMemo, useState } from "react";
import {
  EllipsisVertical,
  Search,
  X,
  MessageCircle,
} from "lucide-react";

import { useChat } from "../../context/ChatContext.jsx";
import axios from "../../api/axiosConfig.js";
import EditProfile from "../common/EditProfile.jsx";
import { motion } from "framer-motion";

function ChatList({ onSelectUser }) {
  const { setSelectedUser, selectedUser } = useChat();

  const [users, setUsers] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/auth/users");

      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUser = (user) => {
    setSelectedUser(user);
    onSelectUser && onSelectUser(); // 🔥 mobile support
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="relative w-full md:w-[28%] lg:w-[24%] h-screen bg-gray-950 border-r border-gray-800 flex flex-col">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-gray-950 border-b border-gray-800 px-5 py-4 backdrop-blur-xl">
        <div className="flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Fast<span className="text-violet-500">Chat</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Conversations
            </p>
          </div>

          <button
            onClick={() => setShowDrawer(true)}
            className="p-2 rounded-xl hover:bg-gray-800 transition active:scale-90"
          >
            <EllipsisVertical size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="mt-4 flex items-center gap-3 border border-gray-800 px-4 py-3 rounded-2xl bg-gray-900/80 focus-within:border-violet-500 transition">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* USERS */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">

        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center gap-3 p-3 rounded-2xl bg-gray-900"
            >
              <div className="w-10 h-10 rounded-full bg-gray-800"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((u) => {
            const isActive = selectedUser?._id === u._id;

            return (
              <motion.div
                whileTap={{ scale: 0.97 }}
                key={u._id}
                onClick={() => handleUser(u)}
                className={`
                  flex items-center gap-3 p-3 rounded-2xl cursor-pointer
                  border transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-violet-900/40 to-gray-900 border-violet-500 shadow-lg"
                      : "bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-violet-400"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      u.photo ||
                      `https://ui-avatars.com/api/?name=${u.fullname}`
                    }
                    alt={u.fullname}
                    className="w-11 h-11 rounded-full object-cover border border-gray-700"
                  />

                  <span
                    className={`
                      absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-950
                      ${u.isOnline ? "bg-green-500" : "bg-gray-500"}
                    `}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-medium truncate">
                    {u.fullname}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {u.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageCircle size={40} />
            <p className="mt-3 text-sm">
              No users found
            </p>
          </div>
        )}
      </div>

      {/* BACKDROP */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-[400px]
          bg-gray-950 border-l border-gray-800
          shadow-2xl z-50
          transform transition-transform duration-300
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            Edit Profile
          </h2>

          <button
            onClick={() => setShowDrawer(false)}
            className="p-2 rounded-xl hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 overflow-y-auto h-full">
          <EditProfile onClose={() => setShowDrawer(false)} />
        </div>
      </div>
    </div>
  );
}

export default ChatList;