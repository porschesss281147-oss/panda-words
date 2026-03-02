'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSound } from '@/hooks/useSound';
import { games, hsk1, hsk2, hsk3, allHsk } from '@/data/games';
import { Volume2, Clock, CheckCircle, XCircle, Award, RotateCcw, Home } from 'lucide-react';

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
  
  const timerRef = useRef(null);
  const game = games.find(g => g.id === 'sentence');
  const unlockedLevel = user?.unlockedLevels?.sentence || 1;

  // เลือกชุดคำศัพท์ตามเกม
  const getWordSet = (gameId) => {
    switch(gameId) {
      case 'hsk1': return hsk1;
      case 'hsk2': return hsk2;
      case 'hsk3': return hsk3;
      case 'hskmix': return allHsk;
      default: return allHsk;
    }
  };

  // สร้างคำถามแบบเติมคำ
  const generateQuestions = (level) => {
    const wordSet = getWordSet(game.id);
    const shuffled = [...wordSet].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 20); // สุ่ม 20 คำ
    
    // สร้างประโยคตัวอย่าง
    const sentenceTemplates = [
      { template: '我 ____ 学生', correct: '是', meaning: 'ฉันเป็นนักเรียน' },
      { template: '你 ____ 老师', correct: '是', meaning: 'คุณเป็นครู' },
      { template: '我 ____ 你', correct: '爱', meaning: 'ฉันรักคุณ' },
      { template: '你 ____ 什么？', correct: '吃', meaning: 'คุณกินอะไร' },
      { template: '我 ____ 水', correct: '喝', meaning: 'ฉันดื่มน้ำ' },
      { template: '你 ____ 哪里？', correct: '去', meaning: 'คุณไปไหน' },
      { template: '我 ____ 学校', correct: '去', meaning: 'ฉันไปโรงเรียน' },
      { template: '你 ____ 名字？', correct: '的', meaning: 'ชื่อของคุณ' },
      { template: '我 ____ 中国', correct: '爱', meaning: 'ฉันรักจีน' },
      { template: '你 ____ 好吗？', correct: '身体', meaning: 'สุขภาพดีไหม' },
      { template: '我 ____ 两岁', correct: '今年', meaning: 'ฉันอายุ 2 ขวบปีนี้' },
      { template: '你 ____ 吃饭了吗？', correct: '中午', meaning: 'กินข้าวเที่ยงหรือยัง' },
      { template: '我 ____ 去中国', correct: '想', meaning: 'ฉันอยากไปจีน' },
      { template: '你 ____ 说中文吗？', correct: '会', meaning: 'คุณพูดจีนได้ไหม' },
      { template: '我 ____ 一点中文', correct: '会', meaning: 'ฉันพูดจีนได้นิดหน่อย' },
      { template: '你 ____ 多少钱？', correct: '这个', meaning: 'อันนี้เท่าไหร่' },
      { template: '我 ____ 要这个', correct: '就', meaning: 'ฉันขอเอาอันนี้' },
      { template: '你 ____ 再见', correct: '说', meaning: 'คุณพูดลาก่อน' },
      { template: '我 ____ 工作', correct: '在', meaning: 'ฉันทำงาน' },
      { template: '你 ____ 住哪里', correct: '在', meaning: 'คุณอยู่ที่ไหน' }
    ];

    // สุ่มเลือก 10 ข้อ
    const shuffledTemplates = [...sentenceTemplates].sort(() => 0.5 - Math.random());
    const selectedTemplates = shuffledTemplates.slice(0, 10);
    
    return selectedTemplates.map((temp, index) => {
      // สร้างตัวเลือกผิด
      const otherWords = selectedWords
        .filter(w => w.chinese !== temp.correct)
        .map(w => w.chinese)
        .slice(0, 3);
      
      const options = [temp.correct, ...otherWords].sort(() => 0.5 - Math.random());
      
      return {
        sentence: temp.template,
        options: options,
        correct: temp.correct,
        meaning: temp.meaning,
        pinyin: selectedWords.find(w => w.chinese === temp.correct)?.pinyin || ''
      };
    });
  };

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      startNewGame();
    }
  }, [gameStarted, selectedLevel]);

  const startNewGame = () => {
    setLoading(true);
    
    try {
      const newQuestions = generateQuestions(selectedLevel);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(30);
      setAnswerHistory([]);
      setGameCompleted(false);
      setShowResult(false);
      setFeedback({ show: false, message: '', type: '', correct: '' });
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
    if (gameStarted && !gameCompleted && !showResult && !feedback.show && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
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
  }, [gameStarted, currentQuestionIndex, gameCompleted, showResult, feedback.show, questions.length]);

  const handleTimeOut = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) return;
    
    playSound('error');
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
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const handleAnswer = (answer) => {
    if (feedback.show || gameCompleted || !questions.length || currentQuestionIndex >= questions.length) return;
    
    playSound('click');
    setSelectedAnswer(answer);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correct;
    
    clearInterval(timerRef.current);
    
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
        message: `✗ ผิด! คำตอบที่ถูกคือ "${currentQuestion.correct || ''}"`,
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
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = () => {
    setGameCompleted(true);
    
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
    }, 1500);
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

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <p className="text-white text-xl">ไม่พบข้อมูลเกม</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-4 bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <header className="bg-white/10 backdrop-blur-md shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/home')}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                ← กลับ
              </button>
              <h1 className="text-2xl font-bold text-white">{game.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-white">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <span className="text-8xl mb-4 block animate-bounce">{game.icon}</span>
            <h2 className="text-3xl font-bold text-white mb-4">{game.title}</h2>
            <p className="text-xl text-white/80">{game.description}</p>
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
                    aspect-square rounded-2xl text-3xl font-bold
                    flex flex-col items-center justify-center
                    transition-all duration-300 transform
                    ${isUnlocked 
                      ? isCurrent
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl scale-105 ring-4 ring-yellow-300'
                        : 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg hover:scale-110 hover:shadow-xl'
                      : 'bg-gray-500/50 text-gray-300 cursor-not-allowed backdrop-blur-sm'
                    }
                  `}
                >
                  <span>{level}</span>
                  {!isUnlocked && <span className="text-2xl mt-2">🔒</span>}
                </button>
              );
            })}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-white">ความคืบหน้า</span>
              <span className="text-white">{unlockedLevel}/10 ด่าน</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-3 transition-all duration-500"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <header className="bg-white/10 backdrop-blur-md shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToLevelSelect}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                ← เลือกด่าน
              </button>
              <h1 className="text-2xl font-bold text-white">ผลการเล่น</h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{user?.icon}</span>
                <span className="text-white">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              ด่านที่ {selectedLevel}
            </h2>

            <div className="text-center mb-8">
              <div className="inline-block relative">
                <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  {finalScore}
                </span>
                <span className="text-2xl text-white/60 ml-2">คะแนน</span>
              </div>
              
              {passed ? (
                <div className="mt-4 bg-green-500/20 text-green-300 px-6 py-3 rounded-full inline-flex items-center gap-2">
                  <CheckCircle size={24} />
                  <span className="text-xl font-semibold">ผ่าน! ✅</span>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="bg-red-500/20 text-red-300 px-6 py-3 rounded-full inline-flex items-center gap-2 mb-3">
                    <XCircle size={24} />
                    <span className="text-xl font-semibold">ไม่ผ่าน! ต้องได้ 80 คะแนนขึ้นไป</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-300">{score}</div>
                <div className="text-white/60">ถูกต้อง</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-300">{totalQuestions - score}</div>
                <div className="text-white/60">ผิด</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-green-300">{totalQuestions}</div>
                <div className="text-white/60">ทั้งหมด</div>
              </div>
            </div>

            {answerHistory.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award size={24} />
                  รายละเอียดแต่ละข้อ
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {answerHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        item.correct
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">
                            ข้อ {index + 1}: {item.question?.sentence || ''}
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-white/60">คำตอบของคุณ</p>
                              <p className={`font-bold ${item.correct ? 'text-green-300' : 'text-red-300'}`}>
                                {item.userAnswer || '(ไม่ได้ตอบ)'}
                              </p>
                            </div>
                            {!item.correct && (
                              <div>
                                <p className="text-white/60">คำตอบที่ถูก</p>
                                <p className="font-bold text-green-300">{item.question?.correct || ''}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-white/60">คำศัพท์</p>
                              <button
                                onClick={() => speak(item.question?.correct || '')}
                                className="flex items-center gap-1 text-yellow-300 hover:text-yellow-400"
                              >
                                <Volume2 size={16} />
                                ฟังเสียง
                              </button>
                            </div>
                          </div>
                        </div>
                        <span className={`text-2xl ${item.correct ? 'text-green-300' : 'text-red-300'}`}>
                          {item.correct ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">📚 คำศัพท์ที่ได้เรียน</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {questions.map((q, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-lg">{q?.correct || ''}</p>
                      <p className="text-yellow-300 text-sm">{q?.pinyin || ''}</p>
                      <p className="text-white/60 text-xs mt-1">{q?.meaning || ''}</p>
                      <button
                        onClick={() => speak(q?.correct || '')}
                        className="mt-2 text-white/40 hover:text-white transition-colors"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={playAgain}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                เล่นอีกครั้ง
              </button>
              {passed && selectedLevel < 10 && (
                <button
                  onClick={() => startGame(selectedLevel + 1)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  ด่านต่อไป
                </button>
              )}
              <button
                onClick={goToLevelSelect}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
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

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">เกิดข้อผิดพลาด</div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <header className="bg-white/10 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goToLevelSelect}
              className="text-white hover:text-yellow-300 transition-colors"
            >
              ← ออกจากเกม
            </button>
            <h1 className="text-2xl font-bold text-white">
              ด่านที่ {selectedLevel}/10
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Clock size={20} className="text-yellow-300" />
                <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{user?.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-3 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
          <div className="text-center mb-6">
            <span className="text-white/60">ข้อที่ {currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          
          <p className="text-white text-3xl text-center mb-8 font-medium">
            {currentQuestion.sentence || ''}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {(currentQuestion.options || []).map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={feedback.show || selectedAnswer !== null}
                className={`
                  p-6 rounded-xl text-2xl font-bold
                  transition-all duration-300 transform
                  ${feedback.show && option === currentQuestion.correct
                    ? 'bg-green-500 text-white scale-105 ring-4 ring-green-300'
                    : feedback.show && option === selectedAnswer && option !== currentQuestion.correct
                    ? 'bg-red-500 text-white scale-95'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                  }
                  ${selectedAnswer === option ? 'ring-2 ring-yellow-400' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback.show && (
            <div className={`mt-6 p-4 rounded-xl text-center animate-bounce ${
              feedback.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <p className={`text-2xl font-bold ${
                feedback.type === 'success' ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback.message}
              </p>
              {feedback.type === 'error' && feedback.correct && (
                <p className="text-white/80 mt-2">
                  คำตอบที่ถูกต้อง: "{feedback.correct}"
                </p>
              )}
            </div>
          )}
        </div>

        {currentQuestion && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60">คำศัพท์ในข้อนี้</span>
              <button
                onClick={() => speak(currentQuestion.correct)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <Volume2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white font-bold">{currentQuestion.correct || ''}</p>
                <p className="text-yellow-300 text-sm">{currentQuestion.pinyin || ''}</p>
              </div>
              <div className="col-span-2">
                <p className="text-white">{currentQuestion.meaning || ''}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}