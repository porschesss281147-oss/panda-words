// data/question-generators/hsk2.js
import { hsk2Sentences } from '../hsk2-sentences';

// ฟังก์ชันสุ่มประโยคตามระดับ
const getSentencesByLevel = (level = 1, count = 10) => {
  // แบ่งระดับละ 15 ประโยค
  const startIdx = (level - 1) * 15;
  const endIdx = startIdx + 15;
  const levelSentences = hsk2Sentences.slice(startIdx, endIdx);
  
  // ถ้ามีประโยคไม่พอในระดับนั้น ให้สุ่มจากทั้งหมด
  if (levelSentences.length < count) {
    const shuffled = [...hsk2Sentences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // สุ่มประโยคจากระดับนั้น
  const shuffled = [...levelSentences].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ฟังก์ชันสร้างตัวเลือกแบบสุ่ม
const generateOptions = (correctWord, sentences, count = 3) => {
  const otherWords = sentences
    .filter(s => s.mainWord !== correctWord)
    .map(s => s.mainWord)
    .filter(w => w && w !== correctWord)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  // ถ้ามีตัวเลือกไม่พอ ให้สุ่มเพิ่มจากประโยคอื่น
  while (otherWords.length < count) {
    const randomSentence = hsk2Sentences[Math.floor(Math.random() * hsk2Sentences.length)];
    if (randomSentence.mainWord !== correctWord && !otherWords.includes(randomSentence.mainWord)) {
      otherWords.push(randomSentence.mainWord);
    }
  }
  
  return [correctWord, ...otherWords].sort(() => 0.5 - Math.random());
};

// สร้างคำถามสำหรับเกมเรียงประโยค (แบบลากวาง)
export const generateMatchingQuestions = (level = 1, count = 10) => {
  const sentences = getSentencesByLevel(level, count);
  
  const questions = sentences.map((sentence, index) => {
    // สร้างชุดคำศัพท์สำหรับลาก (สับตำแหน่ง)
    const wordPairs = sentence.words.map((word, idx) => ({
      word: word,
      pinyin: sentence.wordsPinyin[idx] || ''
    }));
    
    // สับตำแหน่งคำศัพท์
    const shuffledWords = [...wordPairs].sort(() => 0.5 - Math.random());
    
    return {
      id: index + 1,
      chinese: sentence.chinese,
      pinyin: sentence.pinyin,
      thai: sentence.thai,
      words: sentence.words, // คำที่เรียงถูกต้อง (รวมเครื่องหมาย)
      wordsPinyin: sentence.wordsPinyin,
      shuffledWords: shuffledWords, // คำที่สับตำแหน่งสำหรับให้ลาก
      correct: sentence.chinese,
      mainWord: sentence.mainWord,
      fullSentence: sentence.chinese
    };
  });
  
  // สับลำดับคำถาม
  return questions.sort(() => 0.5 - Math.random());
};

// สร้างคำถามสำหรับเกมเรียงประโยค (แบบเติมคำ)
export const generateSentenceQuestions = (level = 1, count = 10) => {
  const sentences = getSentencesByLevel(level, count);
  
  const questions = sentences.map((sentence, index) => {
    const mainWord = sentence.mainWord;
    
    // กรองเอาเฉพาะคำที่ไม่ใช่เครื่องหมายวรรคตอน
    const wordsWithoutPunct = sentence.words.filter(w => w !== '。' && w !== '？' && w !== '！' && w !== '，');
    const wordsWithBlank = [...wordsWithoutPunct];
    
    // หาตำแหน่งคำหลัก
    const mainWordIndex = wordsWithoutPunct.findIndex(w => w === mainWord);
    if (mainWordIndex !== -1) {
      wordsWithBlank[mainWordIndex] = '____';
    }
    
    const sentenceWithBlank = wordsWithBlank.join('');
    
    // สร้างพินอินที่มีช่องว่าง
    const pinyinParts = sentence.pinyin.split(' ');
    const mainWordPinyinIndex = sentence.words.findIndex(w => w === mainWord);
    const pinyinWithBlank = pinyinParts.map((p, i) => 
      i === mainWordPinyinIndex ? '____' : p
    ).join(' ');
    
    // สร้างตัวเลือก
    const options = generateOptions(mainWord, sentences, 3);
    
    return {
      id: index + 1,
      sentenceWithBlank: sentenceWithBlank,
      sentencePinyin: pinyinWithBlank,
      fullMeaning: sentence.thai,
      originalSentence: sentence.chinese,
      options: options,
      correct: mainWord,
      pinyin: mainWord,
      meaning: sentence.thai,
      example: sentence.chinese,
      word: mainWord
    };
  });
  
  return questions.sort(() => 0.5 - Math.random());
};

// ฟังก์ชันสำหรับ GameResult
export const getGameData = (level = 1, questionCount = 10) => {
  const questions = generateMatchingQuestions(level, questionCount);
  
  return {
    gameId: 'matching',
    level: level,
    title: `HSK 2 - เกมเรียงประโยค ด่านที่ ${level}`,
    description: 'ลากคำศัพท์ไปวางเรียงให้เป็นประโยคที่ถูกต้อง',
    questions: questions,
    totalQuestions: questions.length,
    timePerQuestion: 40,
    passingScore: 80
  };
};