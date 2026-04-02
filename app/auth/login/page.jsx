"use client";

import { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const usernameRef = useRef();
  const router = useRouter();

  // ✅ FIX: ลบ `res` ที่ declare แต่ไม่ได้ใช้ออก

  const validateLogin = () => {
    const e = {};
    if (!username.trim()) e.username = "Please enter your username";
    if (!password.trim()) e.password = "Please enter your password";
    return e;
  };

  const loginClick = () => {
    const e = validateLogin();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      usernameRef.current?.focus();
      return;
    }
    setErrors({});
    setIsLoading(true);
    axios
      .post("/api/auth/login", { username, password })
      .then(() => {
        // ✅ FIX: ไม่เก็บ token ใน sessionStorage แล้ว (server ใช้ httpOnly cookie แทน)
        router.push(from);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404) setErrors({ username: "Username not found" });
        else if (status === 403) setErrors({ password: "Incorrect password" });
        else setErrors({ form: "Something went wrong." });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-card">
      <h2>Welcome Back</h2>

      {errors.form && <p className="error-form">{errors.form}</p>}

      <div className="field-group">
        <label>Username</label>
        <br />
        <input
          type="text"
          value={username}
          ref={usernameRef}
          onChange={(e) => {
            setUsername(e.target.value);
            // ✅ FIX: clear error เมื่อพิมพ์ใหม่ (เหมือน Register)
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
          disabled={isLoading}
          placeholder="Enter your username"
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>

      <div className="field-group">
        <label>Password</label>
        <br />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            // ✅ FIX: clear error เมื่อพิมพ์ใหม่ (เหมือน Register)
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          disabled={isLoading}
          placeholder="Enter your password"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "HIDE" : "SHOW"}
        </button>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <button
        className="btn-main"
        onClick={loginClick}
        disabled={isLoading}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        {isLoading ? "Please wait..." : "Sign In"}
      </button>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        {"Don't have an account? "}
        <Link href="/auth/register" style={{ color: "blue" }}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
