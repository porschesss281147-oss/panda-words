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

  // ปลดล็อกอัตโนมัติเมื่อ user คลิก
  useEffect(() => {
    const handleUserInteraction = async () => {
      const ctx = initAudioContext();
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
          console.log('✅ AudioContext resumed by user');
          setIsAudioReady(true);
        } catch (e) {
          console.error('Failed to resume:', e);
        }
      } else if (ctx && ctx.state === 'running') {
        setIsAudioReady(true);
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initAudioContext]);

  // เสียงคลิก
  const playClick = useCallback(() => {
    console.log('🎯 playClick called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx) {
        console.log('❌ No AudioContext');
        return false;
      }
      
      if (ctx.state !== 'running') {
        console.log('⏸️ AudioContext not running, state:', ctx.state);
        return false;
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
  const playSuccess = useCallback(() => {
    console.log('🎯 playSuccess called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return false;

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
  const playError = useCallback(() => {
    console.log('🎯 playError called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return false;

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
  const playTime = useCallback(() => {
    console.log('🎯 playTime called');
    
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return false;

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'square';
          osc.frequency.value = 500 - i * 50;
          gain.gain.value = 0.15;
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
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
  const playSound = useCallback((soundName) => {
    console.log(`🎵 Attempting to play: ${soundName}`);
    
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
      const result = soundFn();
      if (!result) {
        console.log(`⚠️ Failed to play ${soundName}`);
        
        // Fallback: ลอง resume AudioContext
        const ctx = audioContextRef.current;
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log('✅ AudioContext resumed, trying again...');
            soundFn();
          });
        }
      }
    } else {
      console.warn('⚠️ Sound not found:', soundName);
    }
  }, [playClick, playSuccess, playError, playTime]);

  // ทดสอบเสียง
  const testSound = useCallback(() => {
    console.log('🔊 Testing sounds...');
    playClick();
    setTimeout(() => playSuccess(), 500);
    setTimeout(() => playError(), 1000);
    setTimeout(() => playTime(), 1500);
  }, [playClick, playSuccess, playError, playTime]);

  return { 
    playSound,
    testSound,
    isAudioReady
  };
};
