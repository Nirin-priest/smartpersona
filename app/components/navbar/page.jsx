"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../styles/navbar.module.css";

const Navbar = () => {
  const [language, setLanguage] = useState("TH");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUserName(data.name || "");
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserName("");
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLanguageChange = () => {
    // TODO: Implement language change logic
    console.log("Change language");
  };

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
      window.location.href = "/";
    }
  };

  if (isLoadingAuth) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Smart Persona</span>
          </Link>
        </div>
        <div className={styles.right}>
          <button className={styles.loginBtn} disabled>
            กำลังโหลด...
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Smart Persona</span>
        </Link>

        <ul className={styles.navMenu}>
          <li>
            <Link href="/" className={`${styles.navLink} ${styles.active}`}>
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link href="#about" className={styles.navLink}>
              เกี่ยวกับ Smart Persona
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.right}>
        <button
          className={styles.languageSelector}
          onClick={handleLanguageChange}
          title="เปลี่ยนภาษา"
        >
          {language}
          <span className={styles.dropdownArrow}>▼</span>
        </button>

        {isLoggedIn && userName ? (
          <span className={styles.userGreeting}>สวัสดี, {userName}</span>
        ) : null}

        {isLoggedIn ? (
          <button className={styles.loginBtn} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={handleLogin}>
            เข้าสู่ระบบ
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
