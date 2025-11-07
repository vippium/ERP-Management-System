import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import toast from "react-hot-toast";
import {
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconBuildingFactory2,
  IconLogin2,
} from "@tabler/icons-react";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = api.post("/auth/login", form);

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: (err) => err.response?.data?.message || "Login failed",
    });

    try {
      const res = await loginPromise;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand centered">
        <IconBuildingFactory2 size={50} color="#7b6ef6" />
        <h1>TechVision ERP</h1>
        <p>Smart Business. Simplified.</p>
      </div>

      <div className="auth-card">
        <h2>
          <IconLogin2 size={22} style={{ marginRight: "6px" }} /> Welcome Back
        </h2>
        <p className="auth-subtext">
          Please sign in to continue managing your system.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <IconMail size={18} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <IconLock size={18} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <footer>
          <p>
            © {new Date().getFullYear()} TechVision ERP. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
