// hooks/useSound.js
'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

export const useSound = () => {
  const audioContextRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // สร้าง Audio Context
  const initAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.log('❌ Web Audio API not supported');
        return null;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
        console.log('🎵 AudioContext created:', audioContextRef.current.state);
      }
      return audioContextRef.current;
    } catch (e) {
      console.error('Error creating AudioContext:', e);
      return null;
    }
  }, []);

  // ฟังก์ชันปลดล็อกเสียง
  const unlockAudio = useCallback(async () => {
    const ctx = audioContextRef.current || initAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
          console.log('✅ AudioContext resumed');
          setIsAudioReady(true);
          return true;
        } catch (e) {
          console.error('Failed to resume:', e);
          return false;
        }
      } else if (ctx.state === 'running') {
        setIsAudioReady(true);
        return true;
      }
    }
    return false;
  }, [initAudioContext]);

  // ปลดล็อกอัตโนมัติเมื่อ user คลิก
  useEffect(() => {
    const handleUserInteraction = async () => {
      await unlockAudio();
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [unlockAudio]);

  // 🎮 เสียงคลิก - เสียงนุ่มๆ เหมาะกับเกม
  const playClick = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 400;
      gain.gain.value = 0.15;
      
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      
      return true;
    } catch (e) {
      console.error('❌ playClick error:', e);
      return false;
    }
  }, []);

  // 🎉 เสียงสำเร็จ - เสียงจังหวะสนุกๆ สไตล์จีน
  const playSuccess = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const now = ctx.currentTime;
      // ทำนองสไตล์จีน (Do Re Mi Sol)
      const notes = [
        { freq: 523.25, time: 0, dur: 0.15 }, // Do
        { freq: 587.33, time: 0.2, dur: 0.15 }, // Re
        { freq: 659.25, time: 0.4, dur: 0.15 }, // Mi
        { freq: 783.99, time: 0.6, dur: 0.25 }  // Sol
      ];
      
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        gain.gain.value = 0.2;
        
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.dur);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur);
      });

      // เพิ่มฮาร์โมนี
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = 392.00; // Sol
        gain2.gain.value = 0.1;
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.4);
        osc2.stop(now + 0.8);
      }, 0);
      
      return true;
    } catch (e) {
      console.error('❌ playSuccess error:', e);
      return false;
    }
  }, []);

  // ❌ เสียงผิด - เสียงโทนต่ำ เศร้าๆ
  const playError = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.value = 220;
      gain.gain.value = 0.15;
      
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      
      return true;
    } catch (e) {
      console.error('❌ playError error:', e);
      return false;
    }
  }, []);

  // ⏰ เสียงเวลาหมด - เสียง "กิ่งๆๆๆ" เหมือนนาฬิกาปลุก
  const playTime = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const now = ctx.currentTime;
      
      // เสียง "กิ่ง" 5 ครั้ง
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // เสียงแรกดังสุด
        if (i === 0) {
          osc.type = 'square';
          osc.frequency.value = 880; // สูง
          gain.gain.value = 0.25;
        } 
        // เสียงถัดไปลดหลั่น
        else if (i === 1) {
          osc.type = 'square';
          osc.frequency.value = 740;
          gain.gain.value = 0.2;
        }
        else if (i === 2) {
          osc.type = 'square';
          osc.frequency.value = 660;
          gain.gain.value = 0.18;
        }
        else {
          osc.type = 'square';
          osc.frequency.value = 523;
          gain.gain.value = 0.15;
        }
        
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.1);
      }

      // เสียง "กิ่ง" ทีละ 2 ครั้งเร็วๆ
      for (let i = 0; i < 2; i++) {
        const oscFast = ctx.createOscillator();
        const gainFast = ctx.createGain();
        
        oscFast.type = 'square';
        oscFast.frequency.value = 660;
        gainFast.gain.value = 0.2;
        
        gainFast.gain.exponentialRampToValueAtTime(0.01, now + 1.2 + i * 0.15 + 0.08);
        
        oscFast.connect(gainFast);
        gainFast.connect(ctx.destination);
        
        oscFast.start(now + 1.2 + i * 0.15);
        oscFast.stop(now + 1.2 + i * 0.15 + 0.08);
      }
      
      console.log('⏰ หมดเวลา: กิ่งๆๆๆ');
      return true;
    } catch (e) {
      console.error('❌ playTime error:', e);
      return false;
    }
  }, []);

  // 🏆 เสียงได้คะแนน
  const playScore = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.15;
        
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.1);
      });
      
      return true;
    } catch (e) {
      console.error('❌ playScore error:', e);
      return false;
    }
  }, []);

  // 🎵 เสียงขึ้นด่านใหม่
  const playLevelUp = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const now = ctx.currentTime;
      // ทำนองขึ้นๆ
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = 400 + i * 150;
        gain.gain.value = 0.2;
        
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.1);
      }
      
      return true;
    } catch (e) {
      console.error('❌ playLevelUp error:', e);
      return false;
    }
  }, []);

  // 🔔 เสียงเตือน (นาฬิกาเดิน)
  const playTick = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      if (ctx.state !== 'running') await ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 600;
      gain.gain.value = 0.1;
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
      
      return true;
    } catch (e) {
      console.error('❌ playTick error:', e);
      return false;
    }
  }, []);

  // ฟังก์ชันหลัก
  const playSound = useCallback(async (soundName) => {
    console.log(`🎵 เล่นเสียง: ${soundName}`);
    
    await unlockAudio();
    
    const soundMap = {
      'click': playClick,
      'success': playSuccess,
      'error': playError,
      'time': playTime,
      'score': playScore,
      'levelUp': playLevelUp,
      'tick': playTick,
      'start': playClick,
      'correct': playSuccess,
      'wrong': playError,
      'timeout': playTime,
      'achievement': playSuccess,
      'warning': playError
    };

    const soundFn = soundMap[soundName];
    if (soundFn) {
      try {
        await soundFn();
      } catch (e) {
        console.error(`Error playing ${soundName}:`, e);
      }
    } else {
      console.warn('⚠️ ไม่พบเสียง:', soundName);
    }
  }, [playClick, playSuccess, playError, playTime, playScore, playLevelUp, playTick, unlockAudio]);

  // ทดสอบเสียง
  const testSound = useCallback(async () => {
    console.log('🔊 ทดสอบเสียงทั้งหมด...');
    await unlockAudio();
    
    console.log('1. คลิก');
    await playClick();
    await new Promise(r => setTimeout(r, 500));
    
    console.log('2. ถูกต้อง');
    await playSuccess();
    await new Promise(r => setTimeout(r, 800));
    
    console.log('3. ผิด');
    await playError();
    await new Promise(r => setTimeout(r, 800));
    
    console.log('4. หมดเวลา (กิ่งๆๆๆ)');
    await playTime();
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('5. ได้คะแนน');
    await playScore();
    await new Promise(r => setTimeout(r, 500));
    
    console.log('6. ขึ้นด่าน');
    await playLevelUp();
  }, [playClick, playSuccess, playError, playTime, playScore, playLevelUp, unlockAudio]);

  return { 
    playSound,
    testSound,
    unlockAudio,
    isAudioReady
  };
};
