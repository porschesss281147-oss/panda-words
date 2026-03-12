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

  // ฟังก์ชันปลดล็อกเสียง (ต้องเรียกก่อนเล่น)
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

  // เสียงคลิก
  const playClick = useCallback(async () => {
    console.log('🎯 playClick called');
    
    try {
      // ตรวจสอบและ resume AudioContext ทุกครั้ง
      const ctx = audioContextRef.current;
      if (!ctx) {
        console.log('❌ No AudioContext');
        return false;
      }
      
      if (ctx.state !== 'running') {
        console.log('⏸️ AudioContext not running, resuming...');
        await ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 600;
      gain.gain.value = 0.2;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      
      console.log('✅ Click sound played');
      return true;
    } catch (e) {
      console.error('❌ playClick error:', e);
      return false;
    }
  }, []);

  // เสียงสำเร็จ
  const playSuccess = useCallback(async () => {
    console.log('🎯 playSuccess called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      
      if (ctx.state !== 'running') await ctx.resume();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C, E, G
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.15;
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.3);
      });
      
      console.log('✅ Success sound played');
      return true;
    } catch (e) {
      console.error('❌ playSuccess error:', e);
      return false;
    }
  }, []);

  // เสียงผิด
  const playError = useCallback(async () => {
    console.log('🎯 playError called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      
      if (ctx.state !== 'running') await ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.value = 300;
      gain.gain.value = 0.2;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.4);
      
      console.log('✅ Error sound played');
      return true;
    } catch (e) {
      console.error('❌ playError error:', e);
      return false;
    }
  }, []);

  // เสียงเวลาหมด
  const playTime = useCallback(async () => {
    console.log('🎯 playTime called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return false;
      
      if (ctx.state !== 'running') await ctx.resume();

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.value = 500 - i * 50;
            gain.gain.value = 0.15;
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
          } catch (e) {
            console.log('Timeout sound error:', e);
          }
        }, i * 200);
      }
      
      console.log('✅ Time sound played');
      return true;
    } catch (e) {
      console.error('❌ playTime error:', e);
      return false;
    }
  }, []);

  // ฟังก์ชันหลัก
  const playSound = useCallback(async (soundName) => {
    console.log(`🎵 Attempting to play: ${soundName}`);
    
    // ปลดล็อกก่อนเล่นทุกครั้ง
    await unlockAudio();
    
    const soundMap = {
      'click': playClick,
      'success': playSuccess,
      'error': playError,
      'time': playTime,
      'achievement': playSuccess,
      'start': playClick,
      'tick': playClick,
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
      console.warn('⚠️ Sound not found:', soundName);
    }
  }, [playClick, playSuccess, playError, playTime, unlockAudio]);

  // ทดสอบเสียง
  const testSound = useCallback(async () => {
    console.log('🔊 Testing sounds...');
    await unlockAudio();
    await playClick();
    setTimeout(() => playSuccess(), 500);
    setTimeout(() => playError(), 1000);
    setTimeout(() => playTime(), 1500);
  }, [playClick, playSuccess, playError, playTime, unlockAudio]);

  return { 
    playSound,
    testSound,
    unlockAudio,
    isAudioReady
  };
};
