import React from 'react';
import { MessageCircle, Bell, Settings, LogOut } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">ChatFlow</h1>
          <p className="text-xs text-slate-400">Real-time conversations</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl hover:bg-white/10 transition">
          <Bell className="w-5 h-5 text-slate-300" />
        </button>

        <button className="p-2 rounded-xl hover:bg-white/10 transition">
          <Settings className="w-5 h-5 text-slate-300" />
        </button>

        <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-semibold">
            {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.fullname || 'User'}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 rounded-xl hover:bg-red-500/20 transition"
        >
          <LogOut className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
