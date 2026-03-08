// data/question-generators/hsk1.js
import { hsk1 } from '../hsk-words';

// ฟังก์ชันสุ่มคำศัพท์แบบไม่ซ้ำ
const getRandomUniqueWords = (count = 10) => {
  // สลับคำศัพท์ทั้งหมดแล้วเลือกมา count คำ
  const shuffled = [...hsk1].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// สร้างตัวเลือกแบบสุ่ม
const generateOptions = (correctWord, allWords, count = 3) => {
  // สุ่มคำศัพท์อื่นๆ ที่ไม่ใช่คำตอบ
  const otherWords = allWords
    .filter(w => w.chinese !== correctWord.chinese)
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(w => w.chinese);
  
  // รวมคำตอบกับตัวเลือกอื่น แล้วสับ
  return [correctWord.chinese, ...otherWords].sort(() => 0.5 - Math.random());
};

// สร้างคำถามสำหรับเกมเติมประโยค
export const generateSentenceQuestions = (level = 1, count = 10) => {
  // แบ่งคำศัพท์ตามระดับ (10 ด่าน ด่านละ 15 คำ)
  const startIdx = (level - 1) * 15;
  const endIdx = startIdx + 15;
  const levelWords = hsk1.slice(startIdx, endIdx);
  
  // ถ้าไม่พอ ให้สุ่มเพิ่ม แต่ยังคงไม่ซ้ำในรอบนี้
  let words = [];
  if (levelWords.length >= count) {
    // สุ่มจากคำศัพท์ในระดับนี้
    words = [...levelWords].sort(() => 0.5 - Math.random()).slice(0, count);
  } else {
    // ถ้าไม่พอ ให้สุ่มจากทั้งหมด แต่ยังสุ่มใหม่ทุกครั้ง
    words = getRandomUniqueWords(count);
  }
  
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const word = words[i];
    
    // ตรวจสอบว่ามีประโยคตัวอย่างหรือไม่
    if (!word.sentence) {
      // ถ้าไม่มีประโยค ให้สุ่มคำใหม่
      const backupWords = getRandomUniqueWords(1);
      if (backupWords.length > 0) {
        words[i] = backupWords[0];
      }
      continue;
    }
    
    // สร้างประโยคที่มีช่องว่าง
    const sentenceWithBlank = word.sentence.replace(word.chinese, '____');
    
    // สร้างพินอินที่มีช่องว่าง
    let sentencePinyin = '';
    if (word.sentence_pinyin) {
      sentencePinyin = word.sentence_pinyin.replace(word.chinese, '____');
    }
    
    // สร้างตัวเลือก (สุ่มใหม่ทุกครั้ง)
    const otherWords = words.filter(w => w.chinese !== word.chinese);
    const options = generateOptions(word, otherWords.length > 0 ? otherWords : hsk1.slice(0, 10), 3);
    
    questions.push({
      id: i + 1,
      sentenceWithBlank: sentenceWithBlank,
      sentencePinyin: sentencePinyin,
      fullMeaning: word.sentence_th || word.thai,
      originalSentence: word.sentence,
      options: options,
      correct: word.chinese,
      pinyin: word.pinyin,
      meaning: word.thai,
      example: word.sentence,
      example_th: word.sentence_th,
      word: word
    });
  }
  
  return questions;
};