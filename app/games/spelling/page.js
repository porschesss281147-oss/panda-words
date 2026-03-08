'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { games, hsk1, hsk2, hsk3, allHsk } from '@/data/games';
import styles from './page.module.css';

export default function SpellingGamePage() {
  const router = useRouter();
  const { user, unlockLevel, addGameResult } = useUser();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  const [questions, setQuestions] = useState([]);

  const game = games.find(g => g.id === 'spelling');
  const unlockedLevel = user?.unlockedLevels?.spelling || 1;

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
    
    return selectedWords.map(word => ({
      word: word.chinese,
      hint: word.thai,
      pinyin: word.pinyin,
      meaning: word.thai
    }));
  };

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      const newQuestions = generateQuestions(selectedLevel);
      setQuestions(newQuestions);
      setCurrentWord(newQuestions[0]);
      setCurrentIndex(0);
      setScore(0);
      setUserInput('');
      setShowHint(false);
      setGameCompleted(false);
    }
  }, [gameStarted, selectedLevel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentWord) return;
    
    // ตรวจคำตอบ (ไม่สนใจตัวพิมพ์เล็กใหญ่)
    if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      // ตอบถูก
      setFeedback({
        show: true,
        message: '✓ ถูกต้อง!',
        type: 'success'
      });
      
      setScore(score + 1);
      
      setTimeout(() => {
        setFeedback({ show: false, message: '', type: '' });
        
        if (currentIndex < questions.length - 1) {
          // ไปคำถัดไป
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setCurrentWord(questions[nextIndex]);
          setUserInput('');
          setShowHint(false);
        } else {
          // จบเกม
          setGameCompleted(true);
          const finalScore = Math.round((score + 1) / questions.length * 100);
          
          addGameResult({
            gameId: 'spelling',
            level: selectedLevel,
            score: finalScore,
            words: questions.length,
            correctAnswers: score + 1
          });

          if (selectedLevel < 10) {
            unlockLevel('spelling', selectedLevel + 1);
          }

          setTimeout(() => {
            setShowResult(true);
          }, 1500);
        }
      }, 1000);
    } else {
      // ตอบผิด
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

  const handleHint = () => {
    setShowHint(true);
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
                  <span className={styles.levelWords}>10 คำ</span>
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
                {questions.map((word, index) => (
                  <div key={index} className={styles.wordCard}>
                    <span className={styles.wordChinese}>{word.word}</span>
                    <span className={styles.wordPinyin}>{word.pinyin}</span>
                    <span className={styles.wordHint}>{word.meaning}</span>
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
        {currentWord && (
          <div className={styles.gameArea}>
            {/* คำใบ้ */}
            <div className={styles.hintBox}>
              <p className={styles.hintLabel}>คำใบ้:</p>
              {!showHint ? (
                <button onClick={handleHint} className={styles.showHintButton}>
                  ดูคำใบ้
                </button>
              ) : (
                <div>
                  <p className={styles.hintText}>{currentWord.meaning}</p>
                  <p className={styles.hintPinyin}>{currentWord.pinyin}</p>
                </div>
              )}
            </div>

            {/* พื้นที่แสดงตัวอักษร */}
            <div className={styles.spellingArea}>
              <div className={styles.wordLength}>
                {Array.from({ length: currentWord.word.length }).map((_, i) => (
                  <span key={i} className={styles.wordDash}>_</span>
                ))}
              </div>
              <p className={styles.wordLengthText}>
                {currentWord.word.length} ตัวอักษร
              </p>
            </div>

            {/* ฟอร์มป้อนคำตอบ */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="พิมพ์คำศัพท์ภาษาจีน"
                className={styles.input}
                autoFocus
                disabled={feedback.show}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || feedback.show}
                className={`${styles.submitButton} ${
                  !userInput.trim() ? styles.submitButtonDisabled : ''
                }`}
              >
                ตรวจสอบ
              </button>
            </form>

            {/* Feedback */}
            {feedback.show && (
              <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                {feedback.message}
                {feedback.type === 'error' && (
                  <p className={styles.correctAnswer}>
                    คำตอบที่ถูก: "{currentWord.word}"
                  </p>
                )}
              </div>
            )}

            {/* Keyboard hint */}
            <div className={styles.keyboardHint}>
              <p className={styles.keyboardHintText}>
                💡 พิมพ์คำศัพท์ภาษาจีน (ตัวเต็ม)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}