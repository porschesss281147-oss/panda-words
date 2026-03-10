'use client';
import { useCallback, useRef, useEffect } from 'react';

export const useSound = () => {
  const soundsRef = useRef({});
  const unlockedRef = useRef(false);

  // เปลี่ยนเป็นเสียงที่ browser รองรับแน่นอน
  const soundMap = {
    click: '/sounds/click.wav',      // หรือ .mp3 ถ้ามีไฟล์
    success: '/sounds/success.wav',
    error: '/sounds/error.wav',
    time: '/sounds/time.wav',
    achievement: '/sounds/success.wav',
    start: '/sounds/click.wav',
    tick: '/sounds/click.wav',
    warning: '/sounds/error.wav'
  };

  // Preload เสียง
  useEffect(() => {
    Object.entries(soundMap).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.5; // ลดเสียงลงนิดนึง
      soundsRef.current[key] = audio;
    });
  }, []);

  // Unlock เสียง (ต้องเรียกทันทีที่ user โต้ตอบ)
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;

    console.log('🔊 Unlocking audio...');
    Object.values(soundsRef.current).forEach((audio) => {
      try {
        audio.volume = 0;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0.5; // กลับไปที่音量เดิม
        }).catch(e => console.log('Unlock play failed:', e));
      } catch (e) {
        console.log('Unlock error:', e);
      }
    });

    unlockedRef.current = true;
  }, []);

  // เล่นเสียง
  const playSound = useCallback((soundName) => {
    if (typeof window === 'undefined') return;

    const audio = soundsRef.current[soundName];
    if (!audio) {
      console.warn('⚠️ Sound not found:', soundName);
      return;
    }

    try {
      // ถ้ายังไม่ unlock ให้ unlock ก่อน
      if (!unlockedRef.current) {
        unlockAudio();
      }

      // Clone เสียงเพื่อให้เล่นซ้อนกันได้
      const soundClone = audio.cloneNode();
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.log('Playback prevented until user interaction');
      });
    } catch (error) {
      console.error('❌ Sound error:', error);
    }
  }, [unlockAudio]);

  return { playSound, unlockAudio };
};
