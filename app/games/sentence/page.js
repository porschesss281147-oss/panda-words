'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSound } from '@/hooks/useSound';
import { games } from '@/data/games';
import { generateSentenceQuestions } from '@/data/question-generators/hsk1';
import { Volume2, CheckCircle, XCircle, RotateCcw, Home, Clock } from 'lucide-react';

export default function SentenceGamePage() {
  const router = useRouter();
  const { user, unlockLevel, addGameResult } = useUser();
  const { playSound } = useSound();
  
  // State หลัก
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '', correct: '' });
  const [answerHistory, setAnswerHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  
  const timerRef = useRef(null);
  const game = games.find(g => g.id === 'sentence');
  const unlockedLevel = user?.unlockedLevels?.sentence || 1;

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      startNewGame();
    }
  }, [gameStarted, selectedLevel]);

  const startNewGame = () => {
    setLoading(true);
    
    try {
      const newQuestions = generateSentenceQuestions(selectedLevel, 10);
      console.log('Generated questions:', newQuestions);
      
      if (!newQuestions || newQuestions.length === 0) {
        throw new Error('No questions generated');
      }
      
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(30);
      setAnswerHistory([]);
      setGameCompleted(false);
      setShowResult(false);
      setFeedback({ show: false, message: '', type: '', correct: '' });
      setSelectedAnswer(null);
      setTimerActive(true);
      playSound('start');
    } catch (error) {
      console.error('Error starting game:', error);
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

  // จับเวลา
  useEffect(() => {
    if (timerActive && !gameCompleted && !showResult && !feedback.show && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 3) {
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
  }, [timerActive, currentQuestionIndex, gameCompleted, showResult, feedback.show, questions.length]);

  const handleTimeOut = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) return;
    
    playSound('error');
    setTimerActive(false);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    setFeedback({
      show: true,
      message: '⏰ หมดเวลา!',
      type: 'error',
      correct: currentQuestion.correct || ''
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

  const handleAnswer = (answer) => {
    if (feedback.show || gameCompleted || !questions.length || currentQuestionIndex >= questions.length) return;
    
    playSound('click');
    setTimerActive(false);
    setSelectedAnswer(answer);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correct;
    
    if (isCorrect) {
      playSound('success');
      setScore(prev => prev + 1);
      setFeedback({
        show: true,
        message: '✓ ถูกต้อง!',
        type: 'success',
        correct: currentQuestion.correct
      });
    } else {
      playSound('error');
      setFeedback({
        show: true,
        message: '✗ ผิด!',
        type: 'error',
        correct: currentQuestion.correct || ''
      });
    }

    setAnswerHistory(prev => [...prev, {
      question: currentQuestion,
      userAnswer: answer,
      correct: isCorrect
    }]);

    setTimeout(() => {
      setFeedback({ show: false, message: '', type: '', correct: '' });
      moveToNextQuestion();
    }, 2500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
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
      playSound('achievement');
    }

    addGameResult({
      gameId: 'sentence',
      level: selectedLevel,
      score: finalScore,
      correct: score,
      total: totalQuestions,
      passed,
      details: answerHistory
    });

    if (passed && selectedLevel < 10) {
      unlockLevel('sentence', selectedLevel + 1);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4efe6" }}>
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
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
      <div className="min-h-screen" style={{ background: "#f4efe6" }}>
        <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-purple-200/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/home')}
                className="text-black font-semibold hover:text-gray-700 transition-colors flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full"
              >
                ← กลับ
              </button>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {game.title}
              </h1>
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-black font-semibold">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <span className="text-8xl mb-4 block animate-bounce">{game.icon}</span>
            <h2 className="text-3xl font-bold text-purple-800 mb-4">{game.title}</h2>
            <p className="text-xl text-black">{game.description}</p>
          </div>

          <h3 className="text-2xl font-bold text-pink-500 text-center mb-6">เลือกระดับด่าน</h3>
          
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
                    aspect-square rounded-2xl text-3xl font-bold
                    flex flex-col items-center justify-center
                    transition-all duration-300 transform
                    ${isUnlocked 
                      ? isCurrent
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl scale-105 ring-4 ring-purple-300'
                        : 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg hover:scale-110 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              <span className="text-purple-800">ความคืบหน้า</span>
              <span className="text-purple-600">{unlockedLevel}/10 ด่าน</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3 transition-all duration-500"
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
      <div className="min-h-screen" style={{ background: "#f4efe6" }}>
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
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
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
                  คำศัพท์ที่ได้เรียน
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
                            
                            <p className="text-2xl font-bold text-purple-700 mb-1">{q.correct}</p>
                            <p className="text-pink-600 mb-1">{q.pinyin}</p>
                            <p className="text-gray-700">{q.meaning}</p>
                            
                            {historyItem.userAnswer && !historyItem.correct && (
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">คุณตอบ: </span>
                                <span className="text-red-600">{historyItem.userAnswer}</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => speak(q.correct)}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4efe6" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4efe6" }}>
        <div className="text-center">
          <p className="text-red-500 text-xl">ไม่พบคำถาม</p>
          <button
            onClick={goToLevelSelect}
            className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
          >
            กลับไปเลือกด่าน
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4efe6" }}>
        <div className="text-center">
          <p className="text-red-500 text-xl">ข้อผิดพลาด</p>
          <button
            onClick={goToLevelSelect}
            className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
          >
            กลับไปเลือกด่าน
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
  <div 
    className="min-h-screen flex flex-col items-center relative px-4 sm:px-6"
    style={{
      background: "#f4efe6",
      paddingTop: "15px"
    }}
  >
   
<div className="fixed inset-0 -z-50">
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
    style={{ backgroundImage: `url('/panda-words/3.png')` }}
  />

  <div className="absolute inset-0 bg-white/30" />
</div>

    {/* Header */}
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToLevelSelect}
            className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 bg-white/80 px-4 sm:px-5 py-2 rounded-full text-base sm:text-lg shadow-sm font-medium"
          >
            ← ออกจากเกม
          </button>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold 
text-transparent bg-clip-text 
bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400">
  เกมเติมประโยค
</h1>

          <div className="flex items-center gap-3 sm:gap-4">
  {/* Question Progress */}
  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full shadow-md border border-purple-200">
    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm shadow-inner">
      {currentQuestionIndex + 1}
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">ข้อที่</span>
      <span className="text-sm font-bold text-gray-800">/{questions.length}</span>
    </div>
  </div>


            {/* User */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-2xl sm:text-3xl">{user?.icon}</span>
              <span className="hidden sm:inline text-gray-700 font-medium text-base sm:text-lg">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Timer - ใหญ่ขึ้น */}
    <div className="w-full max-w-5xl mt-20 sm:mt-24 px-4">
      <div className="relative w-full h-4 sm:h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 transition-all duration-1000"
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        >
          <div className="absolute top-0 right-0 w-4 h-full bg-white/30 blur-sm"></div>
        </div>
      </div>
      <div className="flex justify-end items-center mt-2 text-gray-700 text-base sm:text-lg font-semibold">
        <span className="bg-white/60 px-4 py-1.5 rounded-full shadow-sm">
          ⏳ {timeLeft} วินาที
        </span>
      </div>
    </div>

    {/* Main Content */}
    <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4">
      <div className="w-full -mt-8 sm:-mt-10">
        {/* Question */}
        <div className="text-center mb-8 sm:mb-10">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
            {currentQuestion.sentenceWithBlank}
          </h1>

          {currentQuestion.sentencePinyin && (
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-500 mb-4 sm:mb-5 font-medium">
              {currentQuestion.sentencePinyin}
            </p>
          )}

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 italic border-t border-gray-200 pt-4 mt-4">
            {currentQuestion.fullMeaning}
          </p>
        </div>

        {/* Options - ใหญ่ขึ้น */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {currentQuestion.options.map((option, index) => {
            const colors = [
              'from-teal-500 to-emerald-600',
              'from-sky-500 to-cyan-600',
              'from-indigo-500 to-purple-600',
              'from-pink-500 to-rose-600'
            ];

            const isCorrectOption = feedback.show && option === currentQuestion.correct;
            const isWrongOption = feedback.show && option === selectedAnswer && option !== currentQuestion.correct;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={feedback.show || selectedAnswer !== null}
                className={`
                  py-5 sm:py-6 md:py-7 px-3
                  text-xl sm:text-2xl md:text-3xl lg:text-4xl
                  font-bold
                  rounded-2xl sm:rounded-3xl
                  text-white
                  bg-gradient-to-r ${colors[index % colors.length]}
                  shadow-lg
                  transform transition-all duration-200
                  hover:scale-105 hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${isCorrectOption ? 'ring-4 ring-green-400 ring-offset-2' : ''}
                  ${isWrongOption ? 'ring-4 ring-red-400 ring-offset-2' : ''}
                  ${selectedAnswer === option && !feedback.show ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
                `}
              >
                {option}
              </button>
            );
          })}
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

      </div>
    </main>
  </div>
);
}
