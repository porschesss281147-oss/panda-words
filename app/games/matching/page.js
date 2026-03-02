'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { games, hsk1, hsk2, hsk3, allHsk } from '@/data/games';
import styles from './page.module.css';

export default function MatchingGamePage() {
  const router = useRouter();
  const { user, unlockLevel, addGameResult } = useUser();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(null);
  const [words, setWords] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  const [questions, setQuestions] = useState([]);

  const game = games.find(g => g.id === 'matching');
  const unlockedLevel = user?.unlockedLevels?.matching || 1;

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

  // สร้างประโยคตัวอย่าง
  const generateSentences = (level) => {
    const wordSet = getWordSet(game.id);
    const shuffled = [...wordSet].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 10); // 10 ข้อต่อด่าน
    
    const sentences = [
      { template: '我 ____ 学生', correct: '是', meaning: 'ฉันเป็นนักเรียน' },
      { template: '你 ____ 老师', correct: '是', meaning: 'คุณเป็นครู' },
      { template: '我 ____ 你', correct: '爱', meaning: 'ฉันรักคุณ' },
      { template: '你 ____ 什么？', correct: '吃', meaning: 'คุณกินอะไร' },
      { template: '我 ____ 水', correct: '喝', meaning: 'ฉันดื่มน้ำ' },
      { template: '你 ____ 哪里？', correct: '去', meaning: 'คุณไปไหน' },
      { template: '我 ____ 学校', correct: '去', meaning: 'ฉันไปโรงเรียน' },
      { template: '你 ____ 名字？', correct: '的', meaning: 'ชื่อของคุณ' },
      { template: '我 ____ 中国', correct: '爱', meaning: 'ฉันรักจีน' },
      { template: '你 ____ 好吗？', correct: '身体', meaning: 'สุขภาพดีไหม' }
    ];

    return sentences.map((s, index) => ({
      chinese: s.template.replace('____', s.correct),
      template: s.template,
      correct: s.correct,
      meaning: s.meaning,
      words: [s.correct, ...selectedWords.slice(index * 2, index * 2 + 3).map(w => w.chinese)]
    }));
  };

  // เริ่มเกม
  useEffect(() => {
    if (gameStarted && selectedLevel) {
      const newQuestions = generateSentences(selectedLevel);
      setQuestions(newQuestions);
      setCurrentSentence(newQuestions[0]);
      resetRound(newQuestions[0]);
      setCurrentIndex(0);
      setScore(0);
      setGameCompleted(false);
    }
  }, [gameStarted, selectedLevel]);

  const resetRound = (sentence) => {
    if (!sentence) return;
    
    // แยกคำศัพท์
    const wordsArray = sentence.correct.split('');
    // สับคำศัพท์
    const shuffled = shuffleArray([...wordsArray, ...sentence.words.slice(1, 4)]);
    
    setWords(wordsArray);
    setAvailableWords(shuffled);
    setUserAnswer([]);
    setFeedback({ show: false, message: '', type: '' });
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleWordClick = (word, index) => {
    // เพิ่มคำลงในคำตอบ
    setUserAnswer([...userAnswer, word]);
    // ลบคำออกจากตัวเลือก
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (index) => {
    // นำคำออกจากคำตอบ
    const word = userAnswer[index];
    const newAnswer = [...userAnswer];
    newAnswer.splice(index, 1);
    setUserAnswer(newAnswer);
    
    // เพิ่มคำกลับไปในตัวเลือก
    setAvailableWords([...availableWords, word].sort(() => 0.5 - Math.random()));
  };

  const checkAnswer = () => {
    const userAnswerStr = userAnswer.join('');
    
    if (userAnswerStr === currentSentence.correct) {
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
          // ไปประโยคถัดไป
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          const nextSentence = questions[nextIndex];
          setCurrentSentence(nextSentence);
          resetRound(nextSentence);
        } else {
          // จบเกม
          setGameCompleted(true);
          const finalScore = Math.round((score + 1) / questions.length * 100);
          
          addGameResult({
            gameId: 'matching',
            level: selectedLevel,
            score: finalScore,
            sentences: questions.length,
            correctAnswers: score + 1
          });

          if (selectedLevel < 10) {
            unlockLevel('matching', selectedLevel + 1);
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
                  <span className={styles.levelSentences}>10 ประโยค</span>
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

            <div className={styles.sentencesLearned}>
              <h3 className={styles.sentencesTitle}>📚 ประโยคที่ได้เรียน</h3>
              <div className={styles.sentencesGrid}>
                {questions.map((sentence, index) => (
                  <div key={index} className={styles.sentenceCard}>
                    <span className={styles.sentenceChinese}>{sentence.chinese}</span>
                    <span className={styles.sentenceThai}>{sentence.meaning}</span>
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
        {currentSentence && (
          <div className={styles.gameArea}>
            {/* คำแปล */}
            <div className={styles.translationBox}>
              <p className={styles.translationLabel}>ความหมาย:</p>
              <p className={styles.translationText}>{currentSentence.meaning}</p>
            </div>

            {/* ประโยคตัวอย่าง */}
            <div className={styles.sentenceBox}>
              <p className={styles.sentenceLabel}>ประโยค:</p>
              <p className={styles.sentenceText}>{currentSentence.template}</p>
            </div>

            {/* พื้นที่วางคำตอบ */}
            <div className={styles.answerArea}>
              <p className={styles.answerLabel}>คำตอบของคุณ:</p>
              <div className={styles.answerBox}>
                {userAnswer.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleRemoveWord(index)}
                    className={styles.answerWord}
                  >
                    {word}
                  </button>
                ))}
                {userAnswer.length === 0 && (
                  <span className={styles.answerPlaceholder}>
                    คลิกคำด้านล่างเพื่อเรียงประโยค
                  </span>
                )}
              </div>
            </div>

            {/* ตัวเลือกคำศัพท์ */}
            <div className={styles.wordsArea}>
              <p className={styles.wordsLabel}>เลือกคำ:</p>
              <div className={styles.wordsGrid}>
                {availableWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word, index)}
                    className={styles.wordButton}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* ข้อความ Feedback */}
            {feedback.show && (
              <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                {feedback.message}
              </div>
            )}

            {/* ปุ่มตรวจคำตอบ */}
            <div className={styles.checkArea}>
              <button
                onClick={checkAnswer}
                disabled={userAnswer.length === 0 || feedback.show}
                className={`${styles.checkButton} ${
                  userAnswer.length === 0 ? styles.checkButtonDisabled : ''
                }`}
              >
                ตรวจคำตอบ
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}