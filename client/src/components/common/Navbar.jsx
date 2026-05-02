import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ user, onLogout }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center justify-between text-white shadow-lg">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 flex items-center justify-center shadow-md">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold tracking-wide">
            ChatFlow
          </h1>
          <p className="text-xs text-slate-400">
            Real-time conversations
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/10 transition">
          <Bell className="w-5 h-5 text-slate-300" />

          {/* badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl hover:bg-white/10 transition">
          <Settings className="w-5 h-5 text-slate-300" />
        </button>

        {/* USER MENU */}
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            {/* avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center font-semibold">
              {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* name */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">
                {user?.fullname || "User"}
              </p>
              <p className="text-xs text-green-400">
                ● Online
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 transition ${
                openMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <button className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm">
                  ⚙️ Settings
                </button>

                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-sm text-red-400 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;