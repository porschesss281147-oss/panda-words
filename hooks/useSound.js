// hooks/useSound.js
import { useCallback } from 'react';

export const useSound = () => {
  const playSound = useCallback((type = 'click') => {
    // สร้าง audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // เลือกความถี่ตามประเภท
    const frequencies = {
      click: 800,      // เสียงคลิกทั่วไป
      success: 1200,   // เสียงสำเร็จ
      error: 400,      // เสียงผิดพลาด
      start: 600,      // เสียงเริ่มเกม
      select: 700      // เสียงเลือก
    };

    const frequency = frequencies[type] || frequencies.click;
    
    // สร้าง oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  return { playSound };
};