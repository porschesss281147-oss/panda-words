// hooks/useSound.js
'use client';

import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioContextRef = useRef(null);

  // สร้าง Audio Context (ต้องรอ user interaction)
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  // เสียงคลิก (สั้น เร็ว)
  const playClick = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.log('Click sound error:', e);
    }
  }, [getAudioContext]);

  // เสียงสำเร็จ (ขึ้น-ลง)
  const playSuccess = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      const now = audioCtx.currentTime;
      
      // โน้ต C - E - G
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
        
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
      });
    } catch (e) {
      console.log('Success sound error:', e);
    }
  }, [getAudioContext]);

  // เสียงผิดพลาด (ต่ำลง)
  const playError = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.15;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
      oscillator.stop(audioCtx.currentTime + 0.4);
      
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Error sound error:', e);
    }
  }, [getAudioContext]);

  // เสียงหมดเวลา (ติ๊กๆ)
  const playTime = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'square';
          osc.frequency.value = 400 - i * 50;
          gain.gain.value = 0.1;
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.08);
        }, i * 150);
      }
    } catch (e) {
      console.log('Time sound error:', e);
    }
  }, [getAudioContext]);

  // เสียง tick (นาฬิกา)
  const playTick = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.05;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.03);
    } catch (e) {
      console.log('Tick sound error:', e);
    }
  }, [getAudioContext]);

  // เสียงเตือน
  const playWarning = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx || audioCtx.state === 'suspended') return;

      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.value = 300 + i * 100;
          gain.gain.value = 0.15;
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        }, i * 200);
      }
    } catch (e) {
      console.log('Warning sound error:', e);
    }
  }, [getAudioContext]);

  // ฟังก์ชันหลักสำหรับเรียกใช้เสียง
  const playSound = useCallback((soundName) => {
    if (typeof window === 'undefined') return;

    // ปลุก Audio Context (ต้องเกิดจาก user interaction)
    const audioCtx = getAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        // เล่นเสียงหลังจาก resume
        playSoundByName(soundName);
      }).catch(e => console.log('AudioContext resume error:', e));
      return;
    }

    playSoundByName(soundName);
  }, [getAudioContext]);

  // เลือกเล่นเสียงตามชื่อ
  const playSoundByName = useCallback((soundName) => {
    const soundMap = {
      'click': playClick,
      'success': playSuccess,
      'error': playError,
      'time': playTime,
      'achievement': playSuccess,
      'start': playClick,
      'tick': playTick,
      'warning': playWarning
    };

    const soundFn = soundMap[soundName];
    if (soundFn) {
      soundFn();
    } else {
      console.warn('⚠️ Sound not found:', soundName);
    }
  }, [playClick, playSuccess, playError, playTime, playTick, playWarning]);

  // ฟังก์ชันสำหรับปลดล็อกเสียง (เรียกจากปุ่ม)
  const unlockAudio = useCallback(async () => {
    const audioCtx = getAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      await audioCtx.resume();
      playClick(); // ทดสอบเสียง
    }
  }, [getAudioContext, playClick]);

  return { 
    playSound,
    unlockAudio
  };
};
