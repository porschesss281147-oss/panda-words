// hooks/useSound.js
'use client';

import { useCallback } from 'react';

export const useSound = () => {
  
  const playSound = useCallback((soundName) => {
    // เช็คว่าอยู่ใน browser หรือไม่
    if (typeof window === 'undefined') return;
    
    console.log('🎵 Playing sound:', soundName);
    
    try {
      const audio = new Audio();
      
      // Map ชื่อเสียงกับไฟล์
      const soundMap = {
        'click': '/sounds/click.mp3',
        'success': '/sounds/success.mp3',
        'error': '/sounds/error.mp3',
        'time': '/sounds/time.mp3',      // เสียงเวลาหมด
        'achievement': '/sounds/success.mp3', // ใช้เสียง success แทน achievement
        'start': '/sounds/click.mp3',     // ใช้เสียง click แทน start
        'tick': '/sounds/click.mp3',      // ใช้เสียง click แทน tick
        'warning': '/sounds/error.mp3'    // ใช้เสียง error แทน warning
      };
      
      const soundFile = soundMap[soundName];
      
      if (soundFile) {
        audio.src = soundFile;
        audio.volume = 0.7; // ลดความดังลงเล็กน้อย
        
        // เล่นเสียง
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // จัดการ error ที่เกิดจาก browser บังคับให้ user interact ก่อน
            console.log('Audio play failed (user interaction needed):', error);
          });
        }
      } else {
        console.warn('⚠️ Sound not found:', soundName);
      }
      
    } catch (error) {
      console.error('❌ Sound system error:', error);
    }
  }, []);
  
  return { playSound };
};
