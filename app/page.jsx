"use client";

import styles from "./styles/home.module.css";
import Navbar from "@/components/navbar/page";

export default function Home() {
  const handleCreateResume = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      if (res.ok) {
        const userData = await res.json();
        // ถ้าเป็นแอดมิน ให้ไปหน้าแอดมินโดยตรง
        if (userData.role === "Admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/create/dashboarduser";
        }
      } else {
        window.location.href = "/auth/login";
      }
    } catch (error) {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>✨</span>
          <span>มาสร้าง Resume ของคุณได้ฟรี</span>
        </div>

        <h1 className={styles.mainHeading}>
          ตัวคุณในเวอร์ชันที่ดีที่สุด
          <br />
          ด้วย <span className={styles.highlight}>Smart Persona</span>
        </h1>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={handleCreateResume}>
            สร้าง
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section} id="about">
        <h2 className={styles.sectionTitle}>Smart Persona คือออะไร?</h2>

        <p className={styles.sectionDescription}>
          Smart Persona คือเครื่องมือสร้าง Resume
          เพื่อช่วยให้คุณสร้างประวัติส่วนตัวที่โดดเด่นและน่าสนใจได้อย่างง่ายดาย
        </p>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👤</div>
            <h3 className={styles.featureTitle}>Personal Brand</h3>
            <p className={styles.featureText}>
              สร้างแบรนด์ส่วนตัวของคุณที่โดดเด่น
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>หลากหลายรูปแบบ</h3>
            <p className={styles.featureText}>
              เลือกจากเทมเพลตสร้างสรรค์มากมาย
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
