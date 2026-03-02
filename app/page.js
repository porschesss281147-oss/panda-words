"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useSound } from "@/hooks/useSound";  // import hook
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, createUser } = useUser();
  const { playSound } = useSound();  // เรียกใช้ hook

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🐼");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const icons = ["🐶", "🐻", "🐼", "🐨", "🐯", "🐾"];

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  const handleSubmit = async () => {
    playSound('start');  // เสียงเริ่มเกม
    if (!name.trim()) {
      playSound('error');  // เสียง error
      setError("กรุณาใส่ชื่อของคุณ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createUser(name.trim(), selectedIcon);
      if (!result.success) {
        playSound('error');
        setError(result.error || "เกิดข้อผิดพลาด");
      } else {
        playSound('success');  // เสียงสำเร็จ
      }
    } catch {
      playSound('error');
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleIconSelect = (icon) => {
    playSound('select');  // เสียงเลือกไอคอน
    setSelectedIcon(icon);
  };

  return (
    <div className="home-page"> 
    <div className={styles.wrapper}>
      {/* LEFT SIDE */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>PANDA</h1>
          <h1 className={styles.heroTitle}>WORDS</h1>
          <p className={styles.heroSubtitle}>
            ยินดีต้อนรับเข้าสู่ Panda Words เป็นเกมการเรียนรู้ภาษาจีนออนไลน์สำหรับผู้เริ่มต้น{" "}
            <strong>(HSK 1–3)</strong> โดยใช้รูปแบบการเล่นเกมสนุกสนาน
            ทำให้ผู้เรียนสามารถจดจำคำศัพท์ พินอิน และตัวอักษรจีนได้ง่ายขึ้น
          </p>
        </div>
      </div>
  </div>

      {/* RIGHT SIDE */}
      <div className={styles.panelWrapper}>
        <div className={styles.panel}>    
          <div className={styles.loginHeader}>LOGIN</div>
          <div className={styles.iconGrid}>
            {icons.map((icon) => (
              <button
                key={icon}
                onClick={() => {
                  playSound('click');  // เสียงคลิก
                  handleIconSelect(icon);
                }}
                className={`${styles.icon} ${
                  selectedIcon === icon ? styles.iconActive : ""
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              playSound('click');  // เสียงคลิก (optional)
              setName(e.target.value);
            }}
            className={styles.input}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className={styles.button}
          >
            {loading ? "..." : "START"}
          </button>

          {error && (
            <div className={styles.error}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
