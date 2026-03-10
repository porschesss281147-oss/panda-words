'use client';

import { useCallback, useRef, useEffect } from 'react';

export const useSound = () => {

  const soundsRef = useRef({});
  const unlockedRef = useRef(false);

  const soundMap = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    time: '/sounds/time.mp3',
    achievement: '/sounds/success.mp3',
    start: '/sounds/click.mp3',
    tick: '/sounds/click.mp3',
    warning: '/sounds/error.mp3'
  };

  // preload เสียง
  useEffect(() => {

    Object.entries(soundMap).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.7;

      soundsRef.current[key] = audio;
    });

  }, []);

  // unlock audio policy ของ browser
  const unlockAudio = () => {

    if (unlockedRef.current) return;

    const firstSound = soundsRef.current.click;

    if (firstSound) {
      firstSound.volume = 0;
      firstSound.play().catch(()=>{});
      unlockedRef.current = true;
    }

  };

  const playSound = useCallback((soundName) => {

    if (typeof window === 'undefined') return;

    const audio = soundsRef.current[soundName];

    if (!audio) {
      console.warn('⚠️ Sound not found:', soundName);
      return;
    }

    try {

      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio blocked by browser:', error);
        });
      }

    } catch (error) {
      console.error('❌ Sound system error:', error);
    }

  }, []);

  return { playSound, unlockAudio };

};
