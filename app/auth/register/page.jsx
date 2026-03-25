"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // แยก state ต่างหาก
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const validateRegister = () => {
    const e = {};
    if (!username.trim()) e.username = "Please enter a username";
    if (!password.trim()) e.password = "Please enter a password";
    if (!confirmPassword.trim())
      e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const registerClick = () => {
    const e = validateRegister();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setIsLoading(true);

    // ✅ FIX: ยิงไป Next.js API route แทน localhost โดยตรง
    // ✅ FIX: ไม่ส่ง roleId จาก client (ให้ server กำหนดเอง)
    axios
      .post("/api/users/register", { username, password })
      .then(() => {
        alert("Registration successful!");
        router.push("/auth/login");
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 409) setErrors({ username: "Username already exists" });
        else setErrors({ form: "Registration failed. Please try again." });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-card">
      <div className="header-section">
        <h2>Create Account</h2>
      </div>

      {errors.form && <p className="error-form">{errors.form}</p>}

      <div className="field-group">
        <label>Username</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
          disabled={isLoading}
          placeholder="Enter a username"
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
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          disabled={isLoading}
          placeholder="Enter a password"
        />
        {/* ✅ FIX: ย้าย SHOW/HIDE มาอยู่ที่ field password ด้วย */}
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "HIDE" : "SHOW"}
        </button>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <div className="field-group">
        <label>Confirm Password</label>
        <br />
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          disabled={isLoading}
          placeholder="Confirm your password"
        />
        {/* ✅ FIX: แยก SHOW/HIDE ของ confirm password ออกมาต่างหาก */}
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? "HIDE" : "SHOW"}
        </button>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        className="btn-main"
        onClick={registerClick}
        disabled={isLoading}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        {isLoading ? "Please wait..." : "Sign Up"}
      </button>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        {"Already have an account? "}
        <Link href="/auth/login" style={{ color: "blue" }}>
          Log In
        </Link>
      </div>
    </div>
  );
}
