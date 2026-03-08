// data/question-generators/hsk3.js
import { hsk3 } from '../hsk-words';

// ฟังก์ชันสุ่มคำศัพท์จาก hsk3
const getRandomWords = (count = 10) => {
  if (!hsk3 || hsk3.length === 0) {
    console.error('⚠️ hsk3 data not found');
    return [];
  }
  
  console.log(`📚 hsk3 has ${hsk3.length} words`);
  const shuffled = [...hsk3].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, hsk3.length));
};

// สร้างตัวเลือกแบบสุ่มจาก hsk3
const generateOptions = (correctWord, count = 3) => {
  if (!hsk3 || hsk3.length === 0) {
    return [correctWord.chinese];
  }
  
  // กรองคำอื่นๆ ที่ไม่ใช่คำตอบ
  const otherWords = hsk3
    .filter(w => w && w.chinese && w.chinese !== correctWord.chinese)
    .map(w => w.chinese)
    .filter((value, index, self) => self.indexOf(value) === index); // ตัดซ้ำ
  
  // ถ้ามีคำอื่นไม่พอ ให้สุ่มซ้ำได้
  if (otherWords.length < count) {
    const availableWords = [...otherWords];
    while (availableWords.length < count) {
      availableWords.push(otherWords[Math.floor(Math.random() * otherWords.length)]);
    }
    const selected = availableWords.sort(() => 0.5 - Math.random()).slice(0, count);
    return [correctWord.chinese, ...selected].sort(() => 0.5 - Math.random());
  }
  
  // สุ่มคำอื่นๆ
  const selectedOthers = otherWords
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  return [correctWord.chinese, ...selectedOthers].sort(() => 0.5 - Math.random());
};

// ฟังก์ชันหลักสร้างคำถามสำหรับเกมฟังเสียง
export const generateListeningQuestions = (level = 1, count = 10) => {
  try {
    console.log(`🎧 Generating listening questions for level ${level}, count ${count}`);
    
    const words = getRandomWords(count);
    
    if (!words || words.length === 0) {
      console.error('❌ No words generated');
      return [];
    }
    
    const questions = words.map((word, index) => {
      if (!word) return null;
      
      const options = generateOptions(word, 3);
      
      return {
        id: index + 1,
        audio: word.chinese || '',
        chinese: word.chinese || '',
        pinyin: word.pinyin || '',
        thai: word.thai || '',
        meaning: word.thai || '',
        options: options,
        correct: word.chinese || '',
        sentence: word.sentence || '',
        sentence_pinyin: word.sentence_pinyin || '',
        sentence_th: word.sentence_th || ''
      };
    }).filter(q => q !== null);
    
    console.log(`✅ Generated ${questions.length} questions`);
    return questions;
  } catch (error) {
    console.error('❌ Error generating listening questions:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับ GameResult
export const getGameData = (level = 1, questionCount = 10) => {
  const questions = generateListeningQuestions(level, questionCount);
  
  return {
    gameId: 'listening',
    level: level,
    title: 'HSK 3 - เกมฟังเสียง',
    description: 'ฟังเสียงแล้วเลือกคำศัพท์ที่ถูกต้อง',
    questions: questions,
    totalQuestions: questions.length,
    timePerQuestion: 30,
    passingScore: 80
  };
};

// ฟังก์ชันทดสอบ
export const testHSK3 = () => {
  console.log('🔍 Testing HSK3 data:');
  console.log('Total words:', hsk3?.length || 0);
  if (hsk3 && hsk3.length > 0) {
    console.log('Sample word:', hsk3[0]);
  }
  return {
    exists: !!hsk3,
    count: hsk3?.length || 0,
    sample: hsk3?.slice(0, 3) || []
  };
};

