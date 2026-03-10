'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

export const useSound = () => {
  const soundsRef = useRef({});
  const unlockedRef = useRef(false);
  const [audioReady, setAudioReady] = useState(false);

  // ใช้เฉพาะไฟล์ .mp3
  const soundMap = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    time: '/sounds/time.mp3',
  };

  // Preload และตรวจสอบไฟล์เสียง
  useEffect(() => {
    const loadSounds = async () => {
      const loadedSounds = {};
      
      for (const [key, src] of Object.entries(soundMap)) {
        try {
          const audio = new Audio();
          
          // ตรวจสอบว่าไฟล์มีอยู่จริง
          audio.addEventListener('canplaythrough', () => {
            console.log(`✅ Sound loaded: ${key}`);
          }, { once: true });

          audio.addEventListener('error', (e) => {
            console.error(`❌ Failed to load sound: ${key} from ${src}`, e);
          });

          audio.src = src;
          audio.preload = 'auto';
          audio.volume = 0.6; // ปรับระดับเสียง
          
          // บังคับโหลด
          await audio.load();
          
          loadedSounds[key] = audio;
        } catch (error) {
          console.error(`Error loading sound ${key}:`, error);
        }
      }
      
      soundsRef.current = loadedSounds;
      setAudioReady(true);
      console.log('🎵 Sound system ready with MP3 files');
    };

    loadSounds();

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Unlock audio สำหรับ browser
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current || !audioReady) return;

    console.log('🔊 Unlocking audio system...');
    
    // สร้าง audio context ชั่วคราวเพื่อ unlock
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    // พยายามเล่นเสียงทั้งหมดด้วย volume 0
    Object.values(soundsRef.current).forEach((audio) => {
      if (audio) {
        try {
          audio.volume = 0;
          audio.play()
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.volume = 0.6; // คืนค่า volume
            })
            .catch(e => console.log('Silent play for unlock:', e));
        } catch (e) {
          console.log('Unlock attempt:', e);
        }
      }
    });

    unlockedRef.current = true;
    console.log('✅ Audio system unlocked');
  }, [audioReady]);

  // เล่นเสียง
  const playSound = useCallback((soundName, options = {}) => {
    const { volume = 0.6, loop = false } = options;

    if (typeof window === 'undefined') {
      console.warn('Window not available');
      return;
    }

    if (!audioReady) {
      console.warn('Audio system not ready yet');
      return;
    }

    const audio = soundsRef.current[soundName];
    if (!audio) {
      console.warn(`⚠️ Sound not found: ${soundName}`);
      console.log('Available sounds:', Object.keys(soundsRef.current));
      return;
    }

    try {
      // ถ้ายังไม่ unlock ให้ unlock ก่อน
      if (!unlockedRef.current) {
        unlockAudio();
        // รอสักครู่ก่อนเล่น
        setTimeout(() => {
          playSound(soundName, options);
        }, 100);
        return;
      }

      // สร้าง instance ใหม่เพื่อให้เล่นซ้อนกันได้
      const soundClone = new Audio(audio.src);
      soundClone.volume = volume;
      soundClone.loop = loop;

      // จัดการ promise
      const playPromise = soundClone.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // console.log(`🔊 Playing: ${soundName}`);
          })
          .catch(error => {
            if (error.name === 'NotAllowedError') {
              console.log('⏳ Browser blocking audio - waiting for user interaction');
              unlockedRef.current = false; // รีเซ็ตเพื่อลองใหม่
            } else {
              console.error(`Error playing ${soundName}:`, error);
            }
          });
      }

      // ลบ instance เมื่อเล่นจบ
      soundClone.addEventListener('ended', () => {
        soundClone.remove();
      });

    } catch (error) {
      console.error('❌ Sound system error:', error);
    }
  }, [audioReady, unlockAudio]);

  // หยุดเสียงทั้งหมด
  const stopAllSounds = useCallback(() => {
    Object.values(soundsRef.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, []);

  // ปรับระดับเสียงทั้งหมด
  const setMasterVolume = useCallback((volume) => {
    const validVolume = Math.max(0, Math.min(1, volume));
    Object.values(soundsRef.current).forEach(audio => {
      if (audio) {
        audio.volume = validVolume;
      }
    });
  }, []);

  return { 
    playSound, 
    unlockAudio,
    stopAllSounds,
    setMasterVolume,
    audioReady 
  };
};
