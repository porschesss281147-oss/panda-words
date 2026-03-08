'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSound } from '@/hooks/useSound';
import { games } from '@/data/games';
import { generateListeningQuestions } from '@/data/question-generators/hsk3';
import { Volume2, CheckCircle, XCircle, RotateCcw, Home, Clock } from 'lucide-react';

export default function ListeningGamePage() {
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
  }, [playSound]);
  
  // State หลัก
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '', correct: '' });
  const [answerHistory, setAnswerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  
  // State สำหรับเกมฟังเสียง
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [audioPermission, setAudioPermission] = useState(true);
  
  const timerRef = useRef(null);
  const game = games.find(g => g.id === 'listening');
  const unlockedLevel = user?.unlockedLevels?.listening || 1; // เปลี่ยนกลับเป็น unlockedLevel
  
  // เล่นเสียงตาม feedback
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
  
  try {
    console.log('🎮 Starting new game, level:', selectedLevel);
    
    // ทดสอบว่า hsk3 มีข้อมูลหรือไม่
    console.log('📚 Testing HSK3 data...');
    
    const newQuestions = generateListeningQuestions(selectedLevel, 10);
    console.log('📋 Generated questions:', newQuestions);
    
    // ถ้าไม่มีคำถาม ให้ใช้คำถามสำรอง
    if (!newQuestions || newQuestions.length === 0) {
      console.warn('⚠️ No questions generated, using fallback questions');
      
      const fallbackQuestions = [
        {
          id: 1,
          audio: '你好',
          chinese: '你好',
          pinyin: 'nǐ hǎo',
          meaning: 'สวัสดี',
          options: ['你好', '再见', '谢谢', '对不起'],
          correct: '你好',
          sentence: '你好吗？',
          sentence_pinyin: 'nǐ hǎo ma？',
          sentence_th: 'คุณสบายดีไหม'
        },
        {
          id: 2,
          audio: '再见',
          chinese: '再见',
          pinyin: 'zàijiàn',
          meaning: 'ลาก่อน',
          options: ['你好', '再见', '谢谢', '对不起'],
          correct: '再见',
          sentence: '明天见。',
          sentence_pinyin: 'míngtiān jiàn。',
          sentence_th: 'เจอกันพรุ่งนี้'
        },
        {
          id: 3,
          audio: '谢谢',
          chinese: '谢谢',
          pinyin: 'xièxiè',
          meaning: 'ขอบคุณ',
          options: ['你好', '再见', '谢谢', '对不起'],
          correct: '谢谢',
          sentence: '谢谢你。',
          sentence_pinyin: 'xièxiè nǐ。',
          sentence_th: 'ขอบคุณ'
        },
        {
          id: 4,
          audio: '对不起',
          chinese: '对不起',
          pinyin: 'duìbuqǐ',
          meaning: 'ขอโทษ',
          options: ['你好', '再见', '谢谢', '对不起'],
          correct: '对不起',
          sentence: '对不起，我错了。',
          sentence_pinyin: 'duìbuqǐ, wǒ cuò le。',
          sentence_th: 'ขอโทษ ฉันผิดเอง'
        },
        {
          id: 5,
          audio: '没关系',
          chinese: '没关系',
          pinyin: 'méiguānxi',
          meaning: 'ไม่เป็นไร',
          options: ['你好', '再见', '谢谢', '没关系'],
          correct: '没关系',
          sentence: '没关系。',
          sentence_pinyin: 'méiguānxi。',
          sentence_th: 'ไม่เป็นไร'
        },
        {
          id: 6,
          audio: '是',
          chinese: '是',
          pinyin: 'shì',
          meaning: 'ใช่',
          options: ['是', '不是', '好', '不好'],
          correct: '是',
          sentence: '我是学生。',
          sentence_pinyin: 'wǒ shì xuéshēng。',
          sentence_th: 'ฉันเป็นนักเรียน'
        },
        {
          id: 7,
          audio: '不是',
          chinese: '不是',
          pinyin: 'búshì',
          meaning: 'ไม่ใช่',
          options: ['是', '不是', '好', '不好'],
          correct: '不是',
          sentence: '我不是老师。',
          sentence_pinyin: 'wǒ búshì lǎoshī。',
          sentence_th: 'ฉันไม่ใช่ครู'
        },
        {
          id: 8,
          audio: '好',
          chinese: '好',
          pinyin: 'hǎo',
          meaning: 'ดี',
          options: ['好', '不好', '是', '不是'],
          correct: '好',
          sentence: '今天天气很好。',
          sentence_pinyin: 'jīntiān tiānqì hěn hǎo。',
          sentence_th: 'วันนี้อากาศดี'
        },
        {
          id: 9,
          audio: '不好',
          chinese: '不好',
          pinyin: 'bùhǎo',
          meaning: 'ไม่ดี',
          options: ['好', '不好', '是', '不是'],
          correct: '不好',
          sentence: '今天天气不好。',
          sentence_pinyin: 'jīntiān tiānqì bùhǎo。',
          sentence_th: 'วันนี้อากาศไม่ดี'
        },
        {
          id: 10,
          audio: '可以',
          chinese: '可以',
          pinyin: 'kěyǐ',
          meaning: 'ได้',
          options: ['可以', '不可以', '好', '不好'],
          correct: '可以',
          sentence: '我可以进来吗？',
          sentence_pinyin: 'wǒ kěyǐ jìnlái ma？',
          sentence_th: 'ฉันเข้าได้ไหม'
        }
      ];
      
      setQuestions(fallbackQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(30);
      setAnswerHistory([]);
      setGameCompleted(false);
      setShowResult(false);
      setFeedback({ show: false, message: '', type: '', correct: '' });
      setTimerActive(true);
      setSelectedAnswer(null);
      
      playSound('start');
      console.log('✅ Using fallback questions');
      setLoading(false);
      return;
    }
    
    // ถ้ามีคำถามจาก hsk3
    console.log('✅ Using HSK3 questions');
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setAnswerHistory([]);
    setGameCompleted(false);
    setShowResult(false);
    setFeedback({ show: false, message: '', type: '', correct: '' });
    setTimerActive(true);
    setSelectedAnswer(null);
    
    playSound('start');
    
  } catch (error) {
    console.error('❌ Error starting game:', error);
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

  // Timer effect
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

  // ฟังก์ชันอ่านออกเสียง
  const speak = (text) => {
    if (!window.speechSynthesis) {
      setAudioPermission(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setAudioPermission(false);
    };

    window.speechSynthesis.speak(utterance);
  };

const handlePlaySound = () => {
  if (!currentQuestion) return
  speak(currentQuestion.audio || currentQuestion.chinese)
}

  const handleSelectAnswer = (answer) => {
    if (feedback.show) return;
    playSound('click');
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      setFeedback({
        show: true,
        message: '⚠️ กรุณาเลือกคำตอบ',
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
    
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    setTimerActive(false);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({
        show: true,
        message: '✓ ถูกต้อง!',
        type: 'success',
        correct: currentQuestion.chinese
      });

      setAnswerHistory(prev => [...prev, {
        question: currentQuestion,
        userAnswer: selectedAnswer,
        correct: true
      }]);

      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '', correct: '' });
        moveToNextQuestion();
      }, 1500);
    } else {
      setFeedback({
        show: true,
        message: '✗ ผิด!',
        type: 'error',
        correct: currentQuestion.chinese
      });

      setAnswerHistory(prev => [...prev, {
        question: currentQuestion,
        userAnswer: selectedAnswer,
        correct: false
      }]);

      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '', correct: '' });
        moveToNextQuestion();
      }, 2000);
    }
  };

  const moveToNextQuestion = () => {
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(30);
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
      playSound('success');
    }

    addGameResult({
      gameId: 'listening',
      level: selectedLevel,
      score: finalScore,
      correct: score,
      total: totalQuestions,
      passed,
      details: answerHistory
    });

    if (passed && selectedLevel < 10) {
      unlockLevel('listening', selectedLevel + 1);
    }

    setTimeout(() => {
      setShowResult(true);
    }, 2000);
  };

  const playAgain = () => {
    startNewGame();
  };

  const startGame = (level) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setShowResult(false);
  };

  const goToLevelSelect = () => {
    setGameStarted(false);
    setShowResult(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center">
          <p className="text-blue-800 text-xl">ไม่พบข้อมูลเกม</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
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
        background: 'linear-gradient(135deg, #f89d25, #dfbcbbed 0%, #f89d25 100%)'
      }}
    >
      <header className="bg-white/80 backdrop-blur-md border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            <button
              onClick={() => router.push('/home')}
              className="text-gray-600 hover:text-gray-800 transition flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"
            >
              ← กลับ
            </button>

            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              {game?.title || 'เกมฟังเสียง'}
            </h1>

            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow">
              <span className="text-2xl">{user?.icon}</span>
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <span className="text-8xl mb-4 block animate-bounce">🎧</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">เกมฟังเสียง</h2>
          <p className="text-lg text-gray-600">ฟังเสียงแล้วเลือกคำศัพท์ที่ถูกต้อง</p>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          เลือกระดับด่าน
        </h3>

        <div className="grid grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
            const isUnlocked = level <= unlockedLevel;
            const isCurrent = level === unlockedLevel;

            return (
              <button
                key={level}
                onClick={() => isUnlocked && startGame(level)}
                disabled={!isUnlocked}
                className={`
                  aspect-square rounded-2xl text-3xl font-bold
                  flex flex-col items-center justify-center
                  transition-all duration-300 transform border-2
                  ${isUnlocked 
                    ? isCurrent
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl scale-105 ring-4 ring-orange-200 border-transparent'
                      : 'bg-white border-orange-300 text-orange-500 shadow hover:scale-110 hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <span>{level}</span>
                {!isUnlocked && <span className="text-2xl mt-2">🔒</span>}
              </button>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">ความคืบหน้า</span>
            <span className="text-orange-500 font-semibold">{unlockedLevel}/10 ด่าน</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-400 to-amber-500 h-3 rounded-full transition-all duration-500"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100">
        <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-blue-200/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToLevelSelect}
                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full"
              >
                ← กลับ
              </button>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ผลการเล่น
              </h1>
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-blue-700 font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/60">
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
                ด่านที่ {selectedLevel}
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">สรุปผลการเรียน</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
                  คำศัพท์ที่ได้เรียน
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {questions.map((q, index) => {
                    const historyItem = answerHistory[index] || {};
                    return (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
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
                            
                            <p className="text-2xl font-bold text-blue-700 mb-1">{q.chinese}</p>
                            <p className="text-purple-600 mb-1">{q.pinyin}</p>
                            <p className="text-gray-700">{q.meaning}</p>
                            
                            {q.sentence && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">ตัวอย่าง: {q.sentence}</p>
                                <p className="text-xs text-gray-500">{q.sentence_th}</p>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => speak(q.chinese)}
                            className="ml-4 p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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

  if (loading || questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-blue-800 text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{
        background: "#f4efe6",
      }}
    >
      {/* Background ภาพจาง */}
      <div className="absolute inset-0  opacity-80 flex justify-center items-center pointer-events-none">
        <img src="/4.png" alt="background" className="w-full h-full object-cover" />
      </div>
      
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-blue-200/50">
        <div className="w-full px-4 md:px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Exit Button */}
            <button
              onClick={goToLevelSelect}
              className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-700 hover:to-red-600 font-bold text-yellow-400 transition-all px-4 py-2 rounded-full text-sm md:text-base shadow-md border border-yellow-600"
            >
              ← ออกจากเกม
            </button>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg md:text-3xl font-bold text-black">
  เกมฟังเสียง
</h1>

            {/* Right Section */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Question Progress */}
              <div className="relative w-24 md:w-32 h-8 md:h-10 bg-blue-900/40 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md">
                <div 
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r  to-red-700 transition-all duration-1000 ease-linear ${
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

<div className="pt-15"></div>
      {/* Main Game Area */}
<div className="relative z-10 w-full max-w-4xl mx-auto">

  {/* Audio Section */}
<div className="text-center mb-12">

  <div className="relative inline-block p-6 bg-black/30 backdrop-blur-md rounded-full mb-6 border-2 border-yellow-500/40 shadow-xl">

    {/* ปุ่มเสียง */}
    <button
      onClick={handlePlaySound}
      disabled={isPlaying || !audioPermission}
      className={`
        w-28 h-28 md:w-36 md:h-36 rounded-full
        bg-gradient-to-br from-red-600 via-red-500 to-amber-400
        text-white text-5xl md:text-6xl
        shadow-[0_10px_25px_rgba(0,0,0,0.4)]
        transform transition-all duration-300
        ${isPlaying
          ? 'scale-110 ring-8 ring-yellow-300/60 animate-pulse'
          : 'hover:scale-105 hover:ring-4 hover:ring-yellow-300/40'}
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
      `}
    >
      {isPlaying ? '🔊' : '🔈'}
    </button>

    
    {isPlaying && (
      <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-10 bg-yellow-300 rounded-full animate-sound-wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )}
          
          {!audioPermission && (
            <div className="mt-4 p-4 bg-red-500/80 text-white rounded-xl">
              ⚠️ เบราว์เซอร์ของคุณไม่รองรับการอ่านออกเสียง
            </div>
          )}
        </div>

        {/* Options Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-Grey text-center mb-6 drop-shadow-lg">
            เลือกคำตอบที่ถูกต้อง:
          </h2>
          
         <div className="grid grid-cols-2 gap-5 md:gap-7">
  {currentQuestion.options.map((option, index) => (
    <button
      key={index}
      onClick={() => handleSelectAnswer(option)}
      disabled={feedback.show}
      className={`
        relative
        p-5 md:p-7
        rounded-xl
        text-3xl md:text-4xl
        font-bold
        transition-all duration-300
        transform

        ${
          selectedAnswer === option
            ? 'scale-105 ring-4 ring-yellow-300'
            : 'hover:scale-105 hover:-translate-y-1'
        }

        bg-gradient-to-br
        from-amber-900
        via-yellow-800
        to-amber-700

        text-yellow-100

        shadow-[0_12px_25px_rgba(0,0,0,0.5)]
        border-[5px] border-amber-950

        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >

      {/* texture ไม้ */}
      <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-30 mix-blend-overlay"></div>

      {/* ลายไม้เข้ม */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 rounded-xl"></div>

      {/* highlight ไม้ */}
      <div className="absolute top-0 left-0 w-full h-3 bg-white/10 rounded-t-xl"></div>

      {/* ตัวอักษร */}
      <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
        {option}
      </span>

      {/* ป้าย A B C D */}
      <div className="absolute top-2 right-2 w-7 h-7 bg-amber-950/80 rounded-full flex items-center justify-center text-sm font-bold text-yellow-300 border border-yellow-700">
        {String.fromCharCode(65 + index)}
      </div>

    </button>
  ))}
</div>
</div>

        {/* Check Button */}
        <div className="text-center">
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer || feedback.show}
            className={`
            px-16 py-5 text-2xl font-bold text-white rounded-[70px]
shadow-[0_8px_0_#7f1d1d] active:translate-y-2 active:shadow-[0_4px_0_#7f1d1d]
transition-all duration-150 border-4 border-yellow-600 tracking-wide
              ${!selectedAnswer 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
: 'bg-gradient-to-b from-red-800 via-red-600 to-yellow-500 hover:from-red-900 hover:to-yellow-600 shadow-[0_6px_0_#7f1d1d] active:translate-y-1 active:shadow-[0_3px_0_#7f1d1d]'
              }
            `}
          >
            ตรวจคำตอบ
          </button>
        </div>

        {/* Hint */}
        <div className="mt-8 text-center">
          <p className="text-/80 text-lg">
            💡 ฟังเสียงให้ดี แล้วเลือกคำตอบที่ถูกต้อง
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
          
          <div className={`
            relative max-w-2xl w-full p-8 sm:p-10 md:p-12 
            rounded-3xl shadow-2xl text-center
            transform animate-popIn
            ${feedback.type === 'success' 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-green-300' 
              : feedback.type === 'error'
                ? 'bg-gradient-to-br from-red-500 to-rose-600 border-4 border-red-300'
                : 'bg-gradient-to-br from-yellow-500 to-orange-500 border-4 border-yellow-300'
            }
          `}>
            <div className="mb-6">
              {feedback.type === 'success' ? (
                <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={64} className="text-white" />
                </div>
              ) : feedback.type === 'error' ? (
                <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <XCircle size={64} className="text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-6xl">⚠️</span>
                </div>
              )}
            </div>

            <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              {feedback.message}
            </p>

            {feedback.type === 'error' && feedback.correct && (
              <div className="mt-6 p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl text-white/90 mb-2">
                  คำตอบที่ถูกต้อง:
                </p>
                <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-yellow-300 drop-shadow-lg">
                  {feedback.correct}
                </p>
                <p className="text-xl sm:text-2xl text-white/80 mt-4">
                  {currentQuestion?.meaning}
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              {feedback.type === 'success' ? (
                <div className="space-y-2">
                  <div className="flex justify-center gap-2 text-4xl animate-bounce">
                    <span>🎉</span>
                    <span>⭐</span>
                    <span>🎉</span>
                  </div>
                  <p className="text-white/90 text-2xl font-bold">เก่งมาก! ยอดเยี่ยม!</p>
                </div>
              ) : feedback.type === 'error' ? (
                <div className="space-y-2">
                  <div className="flex justify-center gap-2 text-4xl">
                    <span>💪</span>
                    <span>✨</span>
                    <span>🌻</span>
                  </div>
                  <p className="text-white/90 text-2xl font-bold">ไม่เป็นไรนะ!</p>
                  <p className="text-white/70 text-lg">ครั้งหน้าต้องดีขึ้นแน่!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-white/90 text-2xl font-bold">กรุณาเลือกคำตอบก่อน</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Timer Bar */}
<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[100%] z-20">
    <div className="w-full h-6 bg-gray-800/70 rounded-full overflow-hidden border border-yellow-700 shadow-inner">
  <div
    className="h-full bg-gradient-to-r from-red-900 via-red-700 to-yellow-600 transition-all duration-1000"
    style={{ width: `${(timeLeft / 30) * 100}%` }}
  ></div>
</div>

    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white font-bold text-lg tracking-widest drop-shadow-lg">
        ⏳ {timeLeft} วินาที
      </span>
    
  </div>
</div>

      {/* CSS for sound wave animation */}
      <style jsx>{`
        @keyframes sound-wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
        
        .animate-sound-wave {
          animation: sound-wave 0.8s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-popIn {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  </div>
  );
}