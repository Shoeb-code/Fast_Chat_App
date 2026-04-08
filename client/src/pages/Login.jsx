import { useState } from "react";
import { Eye, EyeOff, MessageCircle, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      navigate("/chat");
    } else {
      setError(result.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl text-white p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg mb-4">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-slate-300 mt-2">Sign in to continue your conversations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-200 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 h-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 px-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 px-3 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="rounded"
              />
              Remember me
            </label>
            <button type="button" className="text-slate-300 hover:text-white">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg bg-white text-slate-900 hover:bg-slate-200 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
