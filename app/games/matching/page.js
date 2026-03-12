'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSound } from '@/hooks/useSound';
import { games } from '@/data/games';
import { generateMatchingQuestions } from '@/data/question-generators/hsk2';  
import { Volume2, CheckCircle, XCircle, RotateCcw, Home, Clock } from 'lucide-react';

export default function MatchingGamePage() {
  const router = useRouter();
  const { user, unlockLevel, addGameResult } = useUser();
  const { playSound } = useSound();

   console.log('🎵 Sound hook loaded:', { playSound: !!playSound });
  
  const testSound = () => {
    console.log('🔊 Testing sound...');
    playSound('click');
    setTimeout(() => playSound('success'), 300);
    setTimeout(() => playSound('error'), 600);
    setTimeout(() => playSound('time'), 900);
  };

 useEffect(() => {
    console.log('🎵 Sound hook check in useEffect:', { playSound: !!playSound });
    const unlockAudioOnLoad = async () => {
      await playSound('click');
    };
    unlockAudioOnLoad();
  }, [playSound]);

  
  
  // State หลัก
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '', correct: '' });
  const [answerHistory, setAnswerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  
  // State สำหรับเกมลากวาง
  const [availableWords, setAvailableWords] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  
  const timerRef = useRef(null);
  const game = games.find(g => g.id === 'matching');
  const unlockedLevel = user?.unlockedLevels?.matching || 1;

  useEffect(() => {
     useEffect(() => {
    if (feedback.show) {
      if (feedback.type === 'success') {
        playSound('success');
      } else if (feedback.type === 'error') {
        playSound('error');
      } else if (feedback.type === 'warning') {
        playSound('warning');
      }
    }
  }, [feedback.show, feedback.type, playSound]);

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      startNewGame();
    }
  }, [gameStarted, selectedLevel]);

  const startNewGame = () => {
    setLoading(true);
     playSound('start');
    
    try {
      // สุ่มประโยค 10 ข้อ
      const newQuestions = generateMatchingQuestions(selectedLevel, 10);
    console.log('Generated questions:', newQuestions);
    
    if (!newQuestions || newQuestions.length === 0) {
      throw new Error('No questions generated');
    }
     setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(40);
    setAnswerHistory([]);
    setGameCompleted(false);
    setShowResult(false);
    setFeedback({ show: false, message: '', type: '', correct: '' });
    setTimerActive(true);
    playSound('start');
      
      initializeRound(newQuestions[0]);
  } catch (error) {
    console.error('Error starting game:', error);
   playSound('error');
    setFeedback({
      show: true,
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
      type: 'error',
      correct: ''
    });
  } finally {
    setLoading(false);
  }
};

  // เริ่มรอบใหม่
  const initializeRound = (question) => {
  if (!question) return;
  
  // ตรวจสอบว่า question มี words หรือไม่
  if (!question.words || question.words.length === 0) {
    console.error('Question has no words:', question);
    return;
  }
  
    // ใช้ shuffledWords ที่เตรียมไว้สำหรับแสดงให้ลาก
  setAvailableWords(question.shuffledWords.map((item, index) => ({
    id: `word-${index}`,
    word: item.word,
    pinyin: item.pinyin,
    isUsed: false
  })));

  // สร้างช่องวางตามจำนวนคำที่ถูกต้อง
  const zones = question.words.map((_, index) => ({
    id: index,
    word: null,
    pinyin: null,
    isCorrect: false
  }));
  setDropZones(zones);

  
  // สร้างคำศัพท์ให้ลาก (สับตำแหน่ง) พร้อมพินอิน
  const wordPairs = question.words.map((word, idx) => ({
    word: word,
    pinyin: question.wordsPinyin?.[idx] || ''
  }));
  
  const shuffled = [...wordPairs].sort(() => 0.5 - Math.random());
  setAvailableWords(shuffled.map((item, index) => ({
    id: `word-${index}`,
    word: item.word,
    pinyin: item.pinyin,
    isUsed: false
  })));
};

   useEffect(() => {
    if (timerActive && !gameCompleted && !showResult && !feedback.show && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 5 && prev > 0) {
            playSound('tick');
          }
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [timerActive, currentQuestionIndex, gameCompleted, showResult, feedback.show, questions.length, playSound]);

   const handleTimeOut = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) return;
    
    // เล่นเสียงเวลาหมด
    playSound('time');
    setTimerActive(false);
    
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    setFeedback({
      show: true,
      message: '⏰ หมดเวลา!',
      type: 'error',
      correct: currentQuestion.chinese
    });

    setAnswerHistory(prev => [...prev, {
      question: currentQuestion,
      userAnswer: null,
      correct: false,
      timeOut: true
    }]);

    setTimeout(() => {
      setFeedback({ show: false, message: '', type: '', correct: '' });
      moveToNextQuestion();
    }, 2000);
  };

   const handleDragStart = (e, wordItem) => {
    if (wordItem.isUsed) return;
    setDraggedItem(wordItem);
    e.dataTransfer.setData('text/plain', wordItem.word);
    playSound('click'); // เสียงลาก
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneIndex) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.isUsed) return;
    
    playSound('click');
    
     // เช็คว่าช่องนี้ว่างหรือไม่
    if (dropZones[zoneIndex].word !== null) {
      playSound('error'); // เสียงเตือนเมื่อวางไม่ได้
      return;
    }

    playSound('click'); // เสียงวางสำเร็จ

    
        // อัพเดทช่องวาง
    const newZones = [...dropZones];
    newZones[zoneIndex] = {
      ...newZones[zoneIndex],
      word: draggedItem.word,
      pinyin: draggedItem.pinyin
    };
    setDropZones(newZones);


     // ทำเครื่องหมายว่าคำนี้ถูกใช้แล้ว
    const newAvailable = availableWords.map(item => 
      item.id === draggedItem.id ? { ...item, isUsed: true } : item
    );
    setAvailableWords(newAvailable);
    
    setDraggedItem(null);
  };

  const handleRemoveWord = (zoneIndex) => {
    const zone = dropZones[zoneIndex];
    if (!zone.word) return;

    playSound('click'); // เสียงลบคำ

    // คืนคำศัพท์กลับไปให้ลากใหม่
    const wordItem = availableWords.find(item => item.word === zone.word && item.isUsed);
    if (wordItem) {
      const newAvailable = availableWords.map(item =>
        item.id === wordItem.id ? { ...item, isUsed: false } : item
      );
      setAvailableWords(newAvailable);
    }

    // ลบออกจากช่องวาง
    const newZones = [...dropZones];
    newZones[zoneIndex] = {
      ...newZones[zoneIndex],
      word: null,
      pinyin: null
    };
    setDropZones(newZones);
  };

  const checkAnswer = () => {
  // ตรวจสอบว่าวางครบทุกช่องหรือยัง
  if (dropZones.some(zone => !zone.word)) {
    playSound('warning');
    setFeedback({
      show: true,
      message: '⚠️ วางคำศัพท์ให้ครบทุกช่องก่อน',
      type: 'warning',
      correct: ''
    });
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: '', correct: '' });
    }, 2000);
    return;
  }

    const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return;
  
   const userSentence = dropZones.map(zone => zone.word).join('');
  const isCorrect = userSentence === currentQuestion.chinese;
  
console.log('User sentence:', userSentence);
  console.log('Correct sentence:', currentQuestion.chinese);
  console.log('Is correct:', isCorrect);
  console.log('Words:', dropZones.map(zone => zone.word));

  setTimerActive(false);
  
  if (isCorrect) {
    playSound('success');
    setScore(prev => prev + 1);
    setFeedback({
      show: true,
      message: '✓ ถูกต้อง!',
      type: 'success',
      correct: currentQuestion.chinese
    });

    setAnswerHistory(prev => [...prev, {
      question: currentQuestion,
      userAnswer: userSentence,
      correct: true
    }]);

    setTimeout(() => {
      setFeedback({ show: false, message: '', type: '', correct: '' });
      moveToNextQuestion();
    }, 1500); // ลดจาก 3000 เป็น 1500
  } else {
    playSound('error');
    setFeedback({
      show: true,
      message: '✗ ผิด!',
      type: 'error',
      correct: currentQuestion.chinese
    });

    setAnswerHistory(prev => [...prev, {
      question: currentQuestion,
      userAnswer: userSentence,
      correct: false
    }]);

    setTimeout(() => {
      setFeedback({ show: false, message: '', type: '', correct: '' });
      moveToNextQuestion();
      setTimeLeft(40);
      setTimerActive(true);
    }, 2000);
  }
};

  const moveToNextQuestion = () => {
  if (currentQuestionIndex < questions.length - 1) {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    initializeRound(questions[nextIndex]);
    setTimeLeft(40);
    setTimerActive(true);
  } else {
    finishGame();
  }
};

  const finishGame = () => {
  setGameCompleted(true);
  setTimerActive(false);
  
  const totalQuestions = questions.length;
  const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = finalScore >= 80;
  
  if (passed) {
      playSound('success'); // ✅ เสียงผ่าน
      playSound('achievement'); // ✅ เสียงพิเศษ
    } else {
      playSound('error'); // ✅ เสียงไม่ผ่าน
    }

  addGameResult({
    gameId: 'matching',
    level: selectedLevel,
    score: finalScore,
    correct: score,
    total: totalQuestions,
    passed,
    details: answerHistory
  });

  if (passed && selectedLevel < 10) {
    unlockLevel('matching', selectedLevel + 1);
  }

  setTimeout(() => {
    setShowResult(true);
  }, 2000);
};

  const playAgain = () => {
    playSound('click');
    startNewGame();
  };

  const startGame = (level) => {
    playSound('click');
    setSelectedLevel(level);
    setGameStarted(true);
    setShowResult(false);
  };

  const goToLevelSelect = () => {
    playSound('click');
    setGameStarted(false);
    setShowResult(false);
  };

  const speak = (text) => {
    if (!text) return;
    
    playSound('click');
    
    if (!window.speechSynthesis) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการอ่านออกเสียง');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <p className="text-purple-800 text-xl">ไม่พบข้อมูลเกม</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }
  
  // เลือกด่าน
  if (!gameStarted) {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          background: 'linear-gradient(135deg, #ff9a9e 10%, #fad0c4 100%)'
        }}
      >
        <header className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/home')}
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full"
              >
                ← กลับ
              </button>
              <h1 className="text-2xl font-bold">
                {game?.title || 'เกมเรียงประโยค'}
              </h1>
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <span className="text-8xl mb-4 block animate-bounce">📝</span>
            <h2 className="text-3xl font-bold text-white mb-4">เกมเรียงประโยค</h2>
            <p className="text-xl text-white">ลากคำศัพท์ไปวางเรียงให้เป็นประโยคที่ถูกต้อง</p>
          </div>

          <h3 className="text-2xl font-bold text-white text-center mb-6">เลือกระดับด่าน</h3>
          
          <div className="grid grid-cols-5 gap-4 mb-8">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
              const isUnlocked = level <= unlockedLevel;
              const isCurrent = level === unlockedLevel;
              
              return (
  <button
    key={level}
    onClick={() => isUnlocked && startGame(level)}
    disabled={!isUnlocked}
    className={`
      aspect-square rounded-4xl text-4xl font-bold
      flex flex-col items-center justify-center
      transition-all duration-300 transform border-4
      ${isUnlocked 
        ? isCurrent
          ? 'bg-white border-yellow-400 text-pink-500 shadow-xl scale-105 ring-4 ring-yellow-200'
          : 'bg-white border-yellow-300 text-pink-500 shadow-md hover:scale-110 hover:shadow-lg'
        : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
      }
    `}
  >
    <span>{level}</span>
    {!isUnlocked && <span className="text-2xl mt-2">🔒</span>}
  </button>
);
            })}
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6">
  <div className="flex items-center justify-between">
    <span className="text-yellow-800 font-semibold">ความคืบหน้า</span>
    <span className="text-yellow-600">{unlockedLevel}/10 ด่าน</span>
  </div>

  <div className="w-full bg-yellow-100 rounded-full h-3 mt-2 overflow-hidden">
    <div 
      className="bg-gradient-to-r from-white to-yellow-400 rounded-full h-3 transition-all duration-500 shadow-sm"
      style={{ width: `${(unlockedLevel / 10) * 100}%` }}
    ></div>
  </div>
</div>
        </main>
      </div>
    );
  }

  // หน้าสรุปผล
  if (showResult) {
    const totalQuestions = questions.length;
    const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = finalScore >= 80;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100">
        <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-purple-200/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToLevelSelect}
                className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full"
              >
                ← กลับ
              </button>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                ผลการเล่น
              </h1>
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-purple-700 font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/60">
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
                ด่านที่ {selectedLevel}
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">สรุปผลการเรียน</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {finalScore}
              </div>
              <div className="text-xl text-gray-600 mt-2">คะแนน</div>
            </div>

            <div className="text-center mb-8">
              {passed ? (
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-8 py-3 rounded-full shadow-lg">
                  <CheckCircle size={28} />
                  <span className="text-xl font-semibold">ผ่าน! ยอดเยี่ยม! 🎉</span>
                </div>
              ) : (
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2">
                    <XCircle size={28} />
                    <span className="text-xl font-semibold">ไม่ผ่าน</span>
                  </div>
                  <p className="text-gray-600">ต้องได้ 80 คะแนนขึ้นไป</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center shadow-md border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{score}</div>
                <div className="text-blue-500 text-sm">ถูกต้อง</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center shadow-md border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">{totalQuestions - score}</div>
                <div className="text-orange-500 text-sm">ผิด</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center shadow-md border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{totalQuestions}</div>
                <div className="text-green-500 text-sm">ทั้งหมด</div>
              </div>
            </div>

            {questions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  ประโยคที่ได้เรียน
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {questions.map((q, index) => {
                    const historyItem = answerHistory[index] || {};
                    return (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                ข้อ {index + 1}
                              </span>
                              {historyItem.correct ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                  <CheckCircle size={12} /> ถูกต้อง
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                  <XCircle size={12} /> ผิด
                                </span>
                              )}
                            </div>
                            
                            <p className="text-2xl font-bold text-purple-700 mb-1">{q.chinese}</p>
                            <p className="text-pink-600 mb-1">{q.pinyin}</p>
                            <p className="text-gray-700">{q.thai}</p>
                            
                            {historyItem.userAnswer && !historyItem.correct && (
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">คุณเรียง: </span>
                                <span className="text-red-600">{historyItem.userAnswer}</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => speak(q.chinese)}
                            className="ml-4 p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                            title="ฟังเสียง"
                          >
                            <Volume2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={playAgain}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                เล่นอีกครั้ง
              </button>
              {passed && selectedLevel < 10 && (
                <button
                  onClick={() => startGame(selectedLevel + 1)}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  ด่านต่อไป
                </button>
              )}
              <button
                onClick={goToLevelSelect}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-xl font-bold text-lg hover:from-gray-500 hover:to-gray-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Home size={20} />
                เลือกด่าน
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading || questions.length === 0 || !questions[currentQuestionIndex]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
        <div className="text-purple-800 text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden">

    {/* Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/panda-words/rr.png')` }} 
    />
    <div className="absolute inset-0 bg-white/20" />

      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-purple-200/50">
  <div className="w-full px-4 md:px-6 lg:px-10 py-4">
    <div className="flex items-center justify-between">

      {/* Exit Button */}
      <button
        onClick={goToLevelSelect}
        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 font-bold text-yellow-300 transition-all px-4 py-2 rounded-full text-sm md:text-base shadow-md border border-yellow-500"
      >
        ← ออกจากเกม
      </button>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500">
    เกมเรียงประโยค
  </h1>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Question Progress */}
        <div className="relative w-24 md:w-32 h-8 md:h-10 bg-red-900/40 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md">

  <div 
    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 transition-all duration-1000 ease-linear ${
      timeLeft <= 5 ? 'animate-pulse' : ''
    }`}
    style={{ width: `${progress}%` }}
  >
    <div className="absolute top-0 right-0 w-8 h-full bg-yellow-200/30 blur-sm"></div>
  </div>

  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-xs md:text-sm font-bold text-yellow-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
      ข้อที่ {currentQuestionIndex + 1}/{questions.length}
    </span>
  </div>
</div>

        {/* User */}
        <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
          <span className="text-xl md:text-2xl">{user?.icon}</span>
          <span className="hidden md:block text-gray-700 font-medium">
            {user?.name}
          </span>
        </div>
      </div>
    </div>
  </div>
</header>

     <div className="relative z-10 pt-24 sm:pt-28 md:pt-32"> {/* เพิ่ม padding-top ให้ห่างจาก header */}

    {/* คำถาม - จัดให้อยู่ตรงกลาง */}
    <div className="flex justify-center px-4 mb-8 sm:mb-10 md:mb-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center max-w-4xl bg-white/80 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-xl border border-purple-200">
        {currentQuestion.thai}
      </h1>
    </div>

    {/* คำศัพท์ให้ลาก - จัดให้อยู่ตรงกลาง */}
    <div className="flex justify-center px-4 mb-12 sm:mb-14 md:mb-16">
      <div className="flex flex-wrap gap-4 justify-center max-w-5xl">
        {availableWords.filter(item => !item.isUsed).map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="
              px-8 py-4 sm:px-9 sm:py-5 rounded-3xl sm:rounded-4xl 
              text-3xl sm:text-4xl font-bold shadow-2xl cursor-move 
              transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
              bg-gradient-to-br from-rose-700 via-red-700 to-red-800
              text-white border-2 border-rose-400/30
              relative overflow-hidden group
            "
            style={{
              boxShadow: '0 25px 30px -12px rgba(153, 27, 27, 0.5)'
            }}
          >
            {/* ลวดลายด้านใน */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
            
            {/* เอฟเฟกต์แสงเวลา hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* ขอบเรืองแสง */}
            <div className="absolute inset-0 rounded-3xl sm:rounded-4xl border border-red-200/20 group-hover:border-red-200/40 transition-colors duration-300"></div>
            
            <div className="relative z-10 font-black tracking-wider text-center">
              <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">{item.word}</div>
              <div className="text-xs sm:text-sm text-rose-200 mt-1 font-light tracking-wider drop-shadow-md">
                {item.pinyin}
              </div>
            </div>
            
            {/* จุดมุม */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-rose-300/50 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-rose-300/50 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>

    {/* ช่องวางคำตอบ - จัดให้อยู่ตรงกลาง */}
    <div className="flex justify-center px-4 mb-12 sm:mb-14 md:mb-16">
      <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
        {dropZones.map((zone, index) => (
          <div
            key={index}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onClick={() => handleRemoveWord(index)}
            className={`
              w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
              rounded-xl sm:rounded-2xl flex flex-col items-center justify-center
              text-xl sm:text-2xl md:text-2xl font-bold transition-all duration-300 cursor-pointer
              transform hover:scale-105 hover:shadow-xl
              ${zone.word 
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg border-2 border-emerald-300 animate-pulse-soft" 
                : "bg-white/90 backdrop-blur-sm border-3 border-dashed border-amber-300 text-amber-400/70 hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-500 shadow-md"
              }
              relative overflow-hidden group
            `}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            </div>
            
            {zone.word ? (
              <>
                <span className="relative z-10 drop-shadow-lg text-center">{zone.word}</span>
                <span className="text-[10px] sm:text-xs md:text-sm opacity-80 mt-1 font-light text-center">{zone.pinyin}</span>
                <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">
                  ✕
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl md:text-5xl mb-1 animate-bounce-slow">?</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-light">วางที่นี่</span>
              </div>
            )}
            
            {/* Slot number */}
            <div className="absolute top-1 left-1 text-[8px] sm:text-xs font-bold opacity-30">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ปุ่มตรวจคำตอบ - จัดให้อยู่ตรงกลาง */}
    <div className="flex justify-center px-4 pb-12 sm:pb-16 md:pb-20">
      <button
        onClick={checkAnswer}
        disabled={dropZones.some(zone => !zone.word)}
        className="
          relative px-12 sm:px-14 py-4 sm:py-5 
          text-xl sm:text-2xl font-bold text-white 
          rounded-[50px] sm:rounded-[70px]
          bg-gradient-to-b from-red-500 via-red-600 to-red-800 
          shadow-[0_6px_0_#7f1d1d] sm:shadow-[0_8px_0_#7f1d1d]
          active:translate-y-1 sm:active:translate-y-2 
          active:shadow-[0_3px_0_#7f1d1d] sm:active:shadow-[0_4px_0_#7f1d1d]
          transition-all duration-150 
          border-2 sm:border-4 border-yellow-500 tracking-wide
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
          disabled:active:shadow-[0_6px_0_#7f1d1d] sm:disabled:active:shadow-[0_8px_0_#7f1d1d]
        "
      >
        ตรวจคำตอบ
      </button>
  </div>
</div>

    {/* Feedback - ใหญ่ตรงกลาง */}
{feedback.show && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    {/* Overlay สีดำโปร่งแสง */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
    
    {/* กล่อง Feedback */}
    <div className={`
      relative max-w-2xl w-full p-8 sm:p-10 md:p-12 
      rounded-3xl shadow-2xl text-center
      transform animate-popIn
      ${feedback.type === 'success' 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-green-300' 
        : 'bg-gradient-to-br from-red-500 to-rose-600 border-4 border-red-300'
      }
    `}>
      {/* ไอคอนขนาดใหญ่ */}
      <div className="mb-6">
        {feedback.type === 'success' ? (
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle size={64} className="text-white" />
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <XCircle size={64} className="text-white" />
          </div>
        )}
      </div>

      {/* ข้อความ Feedback */}
      <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
        {feedback.message}
      </p>

      {/* คำตอบที่ถูกต้อง (กรณีผิด) */}
      {feedback.type === 'error' && feedback.correct && (
        <div className="mt-6 p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
          <p className="text-2xl sm:text-3xl text-white/90 mb-2">
            คำตอบที่ถูกต้อง:
          </p>
          <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-yellow-300 drop-shadow-lg">
            {feedback.correct}
          </p>
          <p className="text-xl sm:text-2xl text-white/80 mt-4">
            {currentQuestion?.fullMeaning || currentQuestion?.meaning}
          </p>
        </div>
      )}
{/* ตัวจับเวลา (ถ้าต้องการ) */}
<div className="mt-8 text-center">
  {feedback.type === 'success' ? (
    <div className="space-y-2">
      <div className="flex justify-center gap-2 text-4xl animate-bounce">
        <span>🎉</span>
        <span>⭐</span>
        <span>🎉</span>
      </div>
      <p className="text-white/90 text-2xl font-bold">เก่งมาก! ยอดเยี่ยม!</p>
      <p className="text-white/70 text-lg">เตรียมไปข้อต่อไป...</p>
    </div>
  ) : (
    <div className="space-y-2">
      <div className="flex justify-center gap-2 text-4xl">
        <span>💪</span>
        <span>✨</span>
        <span>🌻</span>
      </div>
      <p className="text-white/90 text-2xl font-bold">ไม่เป็นไรนะ!</p>
      <p className="text-white/70 text-lg">ครั้งหน้าต้องดีขึ้นแน่!</p>
    </div>
  )}
</div>
    </div>
  </div>
)}
       
      {/* Bottom Timer Bar */}
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] z-20">
  
  {/* กรอบไม้แดง */}
  <div className="relative bg-gradient-to-b from-red-700 via-red-800 to-red-900 
                  p-3 rounded-[30px] shadow-[0_8px_0_#7f1d1d] 
                  border-4 border-yellow-500">
    
    {/* แถบเวลา */}
    <div className="w-full h-6 bg-red-950/60 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-linear
                   bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300
                   animate-pulse"
        style={{ width: `${(timeLeft / 40) * 100}%` }}
      />
    </div>

    {/* ตัวเลขเวลา */}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white font-bold text-lg tracking-widest drop-shadow-lg">
        ⏳ {timeLeft} วินาที
      </span>
    </div>
  </div>
</div>
</div>
  );
}
