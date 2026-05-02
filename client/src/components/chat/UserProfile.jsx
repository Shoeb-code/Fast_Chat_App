import React from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Phone, Info, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfile() {
  const navigate = useNavigate();
  const { selectedUser } = useChat();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res.success) navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-[22%] min-w-[300px] h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white border-l border-gray-800 flex flex-col shadow-2xl">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-wide">
          Profile
        </h2>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">

        <div>

          {/* AVATAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative group">
              <img
                src={
                  selectedUser?.photo ||
                  `https://ui-avatars.com/api/?name=${
                    selectedUser?.fullname || "User"
                  }`
                }
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-violet-600 shadow-xl group-hover:scale-105 transition"
              />

              {/* online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full" />
            </div>

            <h1 className="text-2xl font-bold mt-4">
              {selectedUser?.fullname || "Select User"}
            </h1>

            <p className="text-sm text-gray-400 mt-1 px-4">
              {selectedUser?.status || "Hey there! I'm using ChatFlow"}
            </p>
          </motion.div>

          {/* INFO CARDS */}
          <div className="mt-10 space-y-4">

            {/* PHONE */}
            <div className="group bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-gray-700 hover:border-violet-500 transition-all shadow-md hover:shadow-violet-500/10">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Phone className="text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium">
                  {selectedUser?.phone || "Not available"}
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <div className="group bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-gray-700 hover:border-blue-500 transition-all shadow-md hover:shadow-blue-500/10">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">About</p>
                <p className="text-sm font-medium">
                  {selectedUser?.about || "Available for chat"}
                </p>
              </div>
            </div>
          </div>

          {/* MEDIA */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-violet-400" />
              <h3 className="text-lg font-semibold">Media</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  className="h-20 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer flex items-center justify-center text-gray-500 border border-gray-700"
                >
                  +
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="mt-10 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 px-4 py-3 rounded-xl font-semibold shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </div>
  );
}