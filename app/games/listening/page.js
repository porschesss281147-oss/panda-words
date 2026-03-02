'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { games, hsk1, hsk2, hsk3, allHsk } from '@/data/games';  // แก้ตรงนี้
import styles from './page.module.css';

export default function ListeningGamePage() {
  const router = useRouter();
  const { user, unlockLevel, addGameResult } = useUser();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  const [audioPermission, setAudioPermission] = useState(true);
  const [questions, setQuestions] = useState([]);

  const game = games.find(g => g.id === 'listening');
  const unlockedLevel = user?.unlockedLevels?.listening || 1;

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

  // สร้างคำถาม
  const generateQuestions = (level) => {
    const wordSet = getWordSet(game.id);
    const shuffled = [...wordSet].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 10); // 10 ข้อต่อด่าน
    
    return selectedWords.map(word => {
      // สร้างตัวเลือกผิด
      const otherWords = wordSet
        .filter(w => w.chinese !== word.chinese)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.chinese);
      
      const options = [word.chinese, ...otherWords].sort(() => 0.5 - Math.random());
      
      return {
        audio: word.chinese,
        options: options,
        correct: word.chinese,
        pinyin: word.pinyin,
        meaning: word.thai
      };
    });
  };

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      const newQuestions = generateQuestions(selectedLevel);
      setQuestions(newQuestions);
      setCurrentQuestion(newQuestions[0]);
      setOptions(newQuestions[0].options);
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setGameCompleted(false);
    }
  }, [gameStarted, selectedLevel]);

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
    if (currentQuestion) {
      speak(currentQuestion.audio);
    }
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!selectedAnswer || !currentQuestion) return;

    if (selectedAnswer === currentQuestion.correct) {
      setFeedback({
        show: true,
        message: '✓ ถูกต้อง!',
        type: 'success'
      });
      
      setScore(score + 1);
      
      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '' });
        
        if (currentIndex < questions.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setCurrentQuestion(questions[nextIndex]);
          setOptions(questions[nextIndex].options);
          setSelectedAnswer(null);
        } else {
          setGameCompleted(true);
          const finalScore = Math.round((score + 1) / questions.length * 100);
          
          addGameResult({
            gameId: 'listening',
            level: selectedLevel,
            score: finalScore,
            questions: questions.length,
            correctAnswers: score + 1
          });

          if (selectedLevel < 10) {
            unlockLevel('listening', selectedLevel + 1);
          }

          setTimeout(() => {
            setShowResult(true);
          }, 1500);
        }
      }, 1000);
    } else {
      setFeedback({
        show: true,
        message: '✗ ไม่ถูกต้อง ลองใหม่!',
        type: 'error'
      });
      
      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '' });
      }, 1000);
    }
  };

  const startGame = (level) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setShowResult(false);
  };

  const playAgain = () => {
    setGameStarted(true);
    setShowResult(false);
  };

  const goToLevelSelect = () => {
    setGameStarted(false);
    setShowResult(false);
  };

  // เลือกด่าน
  if (!gameStarted) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={() => router.push('/home')} className={styles.backButton}>
            ← กลับ
          </button>
          <h1 className={styles.title}>{game.title}</h1>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>{user?.icon}</span>
            <span className={styles.userName}>{user?.name}</span>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.gameInfo}>
            <span className={styles.gameIcon}>{game.icon}</span>
            <p className={styles.gameDescription}>{game.description}</p>
          </div>

          <h2 className={styles.levelTitle}>เลือกระดับด่าน</h2>
          
          <div className={styles.levelGrid}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
              const isUnlocked = level <= unlockedLevel;
              const isCurrent = level === unlockedLevel;
              
              return (
                <button
                  key={level}
                  onClick={() => isUnlocked && startGame(level)}
                  disabled={!isUnlocked}
                  className={`${styles.levelCard} ${
                    !isUnlocked ? styles.levelLocked : ''
                  } ${isCurrent ? styles.levelCurrent : ''}`}
                >
                  <span className={styles.levelNumber}>{level}</span>
                  <span className={styles.levelQuestions}>10 ข้อ</span>
                </button>
              );
            })}
          </div>

          <div className={styles.progressInfo}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(unlockedLevel / 10) * 100}%` }}
              ></div>
            </div>
            <p className={styles.progressText}>
              ปลดล็อกแล้ว {unlockedLevel} / 10 ด่าน
            </p>
          </div>
        </main>
      </div>
    );
  }

  // หน้าสรุปผล
  if (showResult) {
    const totalQuestions = questions.length;
    const finalScore = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={goToLevelSelect} className={styles.backButton}>
            ← เลือกด่าน
          </button>
          <h1 className={styles.title}>ผลการเล่น</h1>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>{user?.icon}</span>
            <span className={styles.userName}>{user?.name}</span>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>ด่านที่ {selectedLevel}</h2>
            
            <div className={styles.scoreBoard}>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>คะแนน</span>
                <span className={styles.scoreValue}>{finalScore}</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>ถูกต้อง</span>
                <span className={styles.scoreValue}>{score}/{totalQuestions}</span>
              </div>
            </div>

            <div className={styles.wordsLearned}>
              <h3 className={styles.wordsTitle}>📚 คำศัพท์ที่ได้เรียน</h3>
              <div className={styles.wordsGrid}>
                {questions.map((q, index) => (
                  <div key={index} className={styles.wordCard}>
                    <span className={styles.wordChinese}>{q.correct}</span>
                    <span className={styles.wordPinyin}>{q.pinyin}</span>
                    <span className={styles.wordMeaning}>{q.meaning}</span>
                    <button 
                      onClick={() => speak(q.correct)}
                      className={styles.listenButton}
                    >
                      🔊 ฟังเสียง
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.resultButtons}>
              <button onClick={playAgain} className={styles.playAgainButton}>
                เล่นอีกครั้ง
              </button>
              <button 
                onClick={() => selectedLevel < 10 ? startGame(selectedLevel + 1) : goToLevelSelect()} 
                className={styles.nextLevelButton}
                disabled={selectedLevel >= 10}
              >
                {selectedLevel < 10 ? 'ด่านต่อไป' : 'ด่านสูงสุดแล้ว'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // หน้าเล่นเกม
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={goToLevelSelect} className={styles.backButton}>
          ← ออก
        </button>
        <h1 className={styles.title}>
          ด่านที่ {selectedLevel}/10
        </h1>
        <div className={styles.gameStats}>
          <span className={styles.score}>⭐ {score}</span>
          <span className={styles.progress}>
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        {currentQuestion && (
          <div className={styles.gameArea}>
            {!audioPermission && (
              <div className={styles.warningBox}>
                ⚠️ เบราว์เซอร์ของคุณไม่รองรับการอ่านออกเสียง
              </div>
            )}

            <div className={styles.audioSection}>
              <button
                onClick={handlePlaySound}
                disabled={isPlaying || !audioPermission}
                className={`${styles.audioButton} ${isPlaying ? styles.audioButtonPlaying : ''}`}
              >
                <span className={styles.audioIcon}>
                  {isPlaying ? '🔊' : '🔈'}
                </span>
                <span className={styles.audioText}>
                  {isPlaying ? 'กำลังเล่น...' : 'ฟังเสียง'}
                </span>
              </button>
              {isPlaying && (
                <div className={styles.waveAnimation}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            <div className={styles.optionsSection}>
              <p className={styles.optionsLabel}>เลือกคำตอบที่ถูกต้อง:</p>
              <div className={styles.optionsGrid}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    className={`${styles.optionButton} ${
                      selectedAnswer === option ? styles.optionSelected : ''
                    }`}
                    disabled={feedback.show}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.checkSection}>
              <button
                onClick={handleCheck}
                disabled={!selectedAnswer || feedback.show}
                className={`${styles.checkButton} ${
                  !selectedAnswer ? styles.checkButtonDisabled : ''
                }`}
              >
                ตรวจคำตอบ
              </button>
            </div>

            {feedback.show && (
              <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                {feedback.message}
              </div>
            )}

            <div className={styles.hintSection}>
              <p className={styles.hintText}>
                💡 ฟังเสียงให้ดี แล้วเลือกคำตอบที่ถูกต้อง
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}