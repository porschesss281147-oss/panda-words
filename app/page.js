"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useSound } from "@/hooks/useSound";
import styles from "./page.module.css";

// ดึง basePath จาก environment หรือใช้ค่าว่าง
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function LoginPage() {
  const router = useRouter();
  const { user, createUser } = useUser();
  const { playSound } = useSound();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🐼");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const icons = ["🐶", "🐻", "🐼", "🐨", "🐯", "🐾", "🦊", "🦁"];

  // Redirect ถ้ามี user แล้ว
  useEffect(() => {
    if (user) {
      router.replace(`${basePath}/home`);
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน form submit แบบปกติ
    playSound('start');

    // ตรวจสอบชื่อ
    if (!name.trim()) {
      playSound('error');
      setError("กรุณาใส่ชื่อของคุณ");
      return;
    }

    if (name.length < 2) {
      playSound('error');
      setError("ชื่อต้องมีอย่างน้อย 2 ตัวอักษร");
      return;
    }

    if (name.length > 20) {
      playSound('error');
      setError("ชื่อต้องไม่เกิน 20 ตัวอักษร");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createUser(name.trim(), selectedIcon);
      
      if (!result.success) {
        playSound('error');
        setError(result.error || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      } else {
        playSound('success');
        // ไม่ต้อง redirect ที่นี่ เพราะ useEffect จะจัดการให้
      }
    } catch (error) {
      playSound('error');
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconSelect = (icon) => {
    playSound('select');
    setSelectedIcon(icon);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && name.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* LEFT SIDE - Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>PANDA</h1>
          <h1 className={styles.heroTitle}>WORDS</h1>
          <p className={styles.heroSubtitle}>
            ยินดีต้อนรับเข้าสู่ Panda Words เป็นเกมการเรียนรู้ภาษาจีนออนไลน์สำหรับผู้เริ่มต้น{" "}
            <strong>(HSK 1–3)</strong> โดยใช้รูปแบบการเล่นเกมสนุกสนาน
            ทำให้ผู้เรียนสามารถจดจำคำศัพท์ พินอิน และตัวอักษรจีนได้ง่ายขึ้น
          </p>
          
          {/* สถิติแบบง่าย */}
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>600+</span>
              <span className={styles.statLabel}>คำศัพท์</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>เกม</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>40</span>
              <span className={styles.statLabel}>ด่าน</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Panel */}
      <div className={styles.panelWrapper}>
        <div className={styles.panel}>
          <div className={styles.loginHeader}>
            <span>เข้าสู่ระบบ</span>
          </div>

          {/* Icon Selector */}
          <div className={styles.iconSection}>
            <label className={styles.label}>เลือกไอคอน</label>
            <div className={styles.iconGrid}>
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className={`${styles.icon} ${
                    selectedIcon === icon ? styles.iconActive : ""
                  }`}
                  aria-label={`เลือกไอคอน ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className={styles.inputSection}>
            <label htmlFor="name" className={styles.label}>
              ชื่อของคุณ
            </label>
            <input
              id="name"
              type="text"
              placeholder="เช่น สมชาย"
              value={name}
              onChange={(e) => {
                playSound('click');
                setName(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              className={styles.input}
              maxLength={20}
              disabled={loading}
              autoComplete="off"
              autoFocus
            />
            <div className={styles.charCount}>
              {name.length}/20
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.error} role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className={`${styles.button} ${
              loading || !name.trim() ? styles.buttonDisabled : ""
            }`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                กำลังเริ่ม...
              </>
            ) : (
              "START"
            )}
          </button>

          {/* Footer */}
          <div className={styles.footer}>
            <p>สนุกกับการเรียนรู้ภาษาจีน</p>
            <p className={styles.copyright}>© 2024 PANDA WORDS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
