// app/home/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { useSound } from '@/hooks/useSound';
import { games, allHsk } from '@/data/games';
import { 
  LogOut, Gamepad2, Trophy, Target, Volume2, Sparkles, Award, 
  Users, X, HelpCircle, BookOpen, CheckCircle, Star, Zap, Crown, 
  Clock, Layout, Pencil, Repeat, Headphones, GripHorizontal 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, logout, getGameStats, getLatestScore, getAverageScore, forceRefreshUser } = useUser();
  const { leaderboard, loading: leaderboardLoading, getUserRank } = useLeaderboard();
  const { playSound } = useSound();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordOfDay, setWordOfDay] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeTab, setActiveTab] = useState('game1');
  
  // ✅ State สำหรับเก็บสถิติ
  const [gameStats, setGameStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [latestScores, setLatestScores] = useState({});

  // ข้อมูลเกมทั้ง 4 เกม
  const gamesInfo = [
    {
      id: 'sentence',
      name: 'เกมเติมประโยค',
      icon: '🎴',
      color: 'from-blue-500 to-blue-600',
      hskLevel: 'HSK 1',
      words: 150,
      description: 'เติมคำศัพท์ในประโยคให้ถูกต้อง',
      rules: [
        'ใช้คำศัพท์ระดับ HSK 1 จำนวน 150 คำ',
        'มีทั้งหมด 10 ด่าน ด่านละ 10 ข้อ',
        'แต่ละข้อมีเวลา 30 วินาที',
        'คะแนนข้อละ 10 คะแนน (เต็ม 100 คะแนนต่อด่าน)',
        'ต้องได้ 80 คะแนนขึ้นไปถึงจะปลดล็อกด่านถัดไป'
      ],
      howToPlay: [
        'อ่านประโยคภาษาไทยหรือพินอินที่ให้มา',
        'เลือกคำศัพท์ภาษาจีนที่ถูกต้องจากตัวเลือก',
        'ถ้าตอบผิดจะเห็นคำตอบที่ถูกต้อง'
      ],
      tips: 'จำคำศัพท์ HSK 1 ให้แม่นยำ เพราะเป็นพื้นฐานสำคัญ'
    },
    {
      id: 'matching',
      name: 'เกมเรียงประโยค',
      icon: '📝',
      color: 'from-green-500 to-green-600',
      hskLevel: 'HSK 2',
      words: 300,
      description: 'ลากคำศัพท์มาเรียงเป็นประโยค',
      rules: [
        'ใช้คำศัพท์ระดับ HSK 2 จำนวน 300 คำ',
        'มีทั้งหมด 10 ด่าน ด่านละ 10 ข้อ',
        'แต่ละข้อมีเวลา 40 วินาที',
        'คะแนนข้อละ 10 คะแนน (เต็ม 100 คะแนนต่อด่าน)',
        'ต้องได้ 80 คะแนนขึ้นไปถึงจะปลดล็อกด่านถัดไป'
      ],
      howToPlay: [
        'ดูประโยคภาษาไทยต้นแบบ',
        'ลากคำศัพท์ภาษาจีนด้านล่างมาเรียง',
        'เรียงให้ถูกต้องตามหลักไวยากรณ์',
        'กดตรวจสอบเมื่อเรียงเสร็จ'
      ],
      tips: 'สังเกตโครงสร้างประโยคภาษาจีน ประธาน-กริยา-กรรม'
    },
    {
      id: 'listening',
      name: 'เกมฟังเสียง',
      icon: '🎧',
      color: 'from-orange-500 to-orange-600',
      hskLevel: 'HSK 3',
      words: 600,
      description: 'ฟังเสียงแล้วเลือกคำตอบที่ถูกต้อง',
      rules: [
        'ใช้คำศัพท์ระดับ HSK 3 จำนวน 600 คำ',
        'มีทั้งหมด 10 ด่าน ด่านละ 10 ข้อ',
        'แต่ละข้อมีเวลา 30 วินาที',
        'คะแนนข้อละ 10 คะแนน (เต็ม 100 คะแนนต่อด่าน)',
        'ต้องได้ 80 คะแนนขึ้นไปถึงจะปลดล็อกด่านถัดไป'
      ],
      howToPlay: [
        'กดปุ่มเล่นเพื่อฟังเสียงคำศัพท์',
        'ฟังให้ดีแล้วเลือกคำตอบที่ถูกต้อง',
        'สามารถฟังซ้ำได้ถ้าต้องการ',
        'กดตรวจสอบเพื่อดูผลลัพธ์'
      ],
      tips: 'ฝึกแยกแยะเสียงวรรณยุกต์ให้แม่นยำ'
    },
    {
      id: 'spelling',
      name: 'เกมสะกดคำ',
      icon: '✍️',
      color: 'from-pink-500 to-pink-600',
      hskLevel: 'HSK 1-3',
      words: 600,
      description: 'พิมพ์คำศัพท์ภาษาจีนให้ถูกต้อง',
      rules: [
        'ใช้คำศัพท์ระดับ HSK 1-3 จำนวน 600 คำ',
        'มีทั้งหมด 10 ด่าน ด่านละ 10 ข้อ',
        'แต่ละข้อไม่มีจำกัดเวลา',
        'ตอบผิดสามารถตอบใหม่ได้เพื่อให้ทบทวนและจำคำศัพท์ได้ดียิ่งขึ้น',
        'คะแนนข้อละ 10 คะแนน (เต็ม 100 คะแนนต่อด่าน)',
        'ต้องได้ 80 คะแนนขึ้นไปถึงจะปลดล็อกด่านถัดไป'
      ],
      howToPlay: [
        'กด "ดูคำใบ้" เพื่อดูความหมายภาษาไทย',
        '"ดูคำใบ้" จำนวนตัวอักษร',
        'พิมพ์คำศัพท์ภาษาจีนตัวเต็มให้ถูกต้อง',
        'กดตรวจสอบ ถ้าผิดจะแสดงคำตอบที่ถูกต้อง'
      ],
      tips: 'ฝึกเขียนตัวอักษรจีนให้ถูกต้องตามลำดับขีด'
    }
  ];

 // ✅ โหลดสถิติทั้งหมด
  useEffect(() => {
    const loadAllStats = async () => {
      if (user) {
        setLoadingStats(true);
        try {
          // ดึงสถิติแยกตามเกม
          const stats = await getGameStats();
          setGameStats(stats);
          
          // คำนวณคะแนนล่าสุดจาก gameResults
          if (user.gameResults) {
            const sorted = [...user.gameResults].sort((a, b) => 
              new Date(b.date) - new Date(a.date)
            );
            
            const scores = {};
            sorted.forEach(result => {
              if (!scores[result.gameId]) {
                scores[result.gameId] = result.score;
              }
            });
            setLatestScores(scores);
          }
          
          console.log('✅ Stats loaded:', { stats, latestScores: scores });
          
        } catch (error) {
          console.error('❌ Error loading stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    };
    
    loadAllStats();
  }, [user, getGameStats]);

  // ถ้าไม่มี user ให้กลับไปหน้า login
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // สุ่มคำศัพท์เมื่อโหลดหน้า
  useEffect(() => {
    if (user) {
      generateNewWord();
    }
  }, [user]);

  // ฟังก์ชันสุ่มคำศัพท์ใหม่
  const generateNewWord = () => {
    playSound('click');
    
    if (allHsk && allHsk.length > 0) {
      const randomIndex = Math.floor(Math.random() * allHsk.length);
      const word = allHsk[randomIndex];
      setWordOfDay({
        chinese: word.chinese,
        thai: word.thai,
        pinyin: word.pinyin
      });
    }
  };

  // ฟังก์ชันอ่านออกเสียง
  const speak = (text) => {
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
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // คำนวณสถิติรวม
  const calculateTotalStats = () => {
    if (!user) return { 
      gamesPlayed: 0, 
      totalAverageScore: 0,
      totalLatestScore: 0,
      unlockedLevels: 0 
    };

    // จำนวนเกมที่เล่น
    const gamesPlayed = user.gamesPlayed || 0;
    
    // คะแนนเฉลี่ยรวม (จาก user.totalScore)
    const totalAverageScore = user.totalScore || 0;
    
    // คะแนนล่าสุดรวม
    const totalLatestScore = Object.values(latestScores).reduce((a, b) => a + b, 0);
    
    // จำนวนด่านที่ปลดล็อกรวม
    const unlockedLevels = Object.values(user.unlockedLevels || {}).reduce((a, b) => a + b, 0);

    return { gamesPlayed, totalAverageScore, totalLatestScore, unlockedLevels };
  };

  const stats = calculateTotalStats();
  const userRank = getUserRank(user?.id);

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/panda-words/home.png')` }} 
      />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{user.icon}</span>
                <div>
                  <p className="text-sm text-gray-500">ยินดีต้อนรับ</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                PANDA WORDS
              </h1>

              <button
                onClick={() => {
                  playSound('click');
                  logout();
                  router.push('/');
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats Cards - 5 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {/* เล่นไปแล้ว */}
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Gamepad2 className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">เล่นไปแล้ว</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingStats ? '...' : stats.gamesPlayed}
                </p>
                <p className="text-xs text-gray-400">เกม</p>
              </div>
            </div>

            {/* ปลดล็อกแล้ว */}
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">ปลดล็อกแล้ว</p>
                <p className="text-2xl font-bold text-gray-800">{stats.unlockedLevels}</p>
                <p className="text-xs text-gray-400">ด่าน</p>
              </div>
            </div>

            {/* คะแนนเฉลี่ย (ใช้จัดอันดับ) */}
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingStats ? '...' : stats.totalAverageScore}
                </p>
                <p className="text-xs text-gray-400">ใช้จัดอันดับ</p>
              </div>
            </div>

            {/* คะแนนล่าสุด */}
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Zap className="text-pink-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">คะแนนล่าสุด</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingStats ? '...' : stats.totalLatestScore}
                </p>
                <p className="text-xs text-gray-400">คะแนน</p>
              </div>
            </div>

            {/* วิธีการเล่น */}
            <div 
              onClick={() => {
                playSound('click');
                setShowHowToPlay(true);
              }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-4 flex items-center space-x-4 transform hover:scale-105 transition-all cursor-pointer"
            >
              <div className="bg-white/20 p-3 rounded-full">
                <HelpCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-white/80">เรียนรู้</p>
                <p className="text-2xl font-bold text-white">วิธีการเล่น</p>
                <p className="text-xs text-white/60">คลิกเพื่อดูคำแนะนำ</p>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎮</span> เลือกเกมที่อยากเล่น
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const gameId = game.id;
              const gameStat = gameStats[gameId] || { played: 0, averageScore: 0 };
              const latestScore = latestScores[gameId] || 0;
              
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    playSound('start');
                    router.push(`/games/${game.id}`);
                  }}
                  className={`bg-gradient-to-r ${gamesInfo[index].color} rounded-2xl shadow-lg p-6 
                    cursor-pointer transform hover:scale-105 transition-all duration-300
                    hover:shadow-xl relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{gamesInfo[index].icon}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {game.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        {gamesInfo[index].description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          {gamesInfo[index].hskLevel}
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          {gamesInfo[index].words} คำ
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          10 ด่าน
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          ด่านที่ {user.unlockedLevels?.[game.id] || 1} / 10
                        </span>
                      </div>
                      
                      {/* แสดงสถิติเฉพาะเกม */}
                      {gameStat.played > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-white/90">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full">
                              เล่นแล้ว {gameStat.played} ครั้ง
                            </span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full">
                              เฉลี่ย {gameStat.averageScore} คะแนน
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-yellow-300 font-bold">⭐ ล่าสุด:</span>
                            <span className="text-white font-bold">{latestScore} คะแนน</span>
                          </div>
                        </div>
                      )}
                      
                      {/* ถ้ายังไม่เคยเล่น */}
                      {gameStat.played === 0 && (
                        <div className="mt-3">
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                            ยังไม่เคยเล่น
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* อันดับผู้เล่นและคำศัพท์สุ่ม */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* อันดับผู้เล่น */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Crown className="text-yellow-500" size={24} />
                อันดับผู้เล่น
              </h3>

              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-500">กำลังโหลด...</p>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${
                        player.id === user.id
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300'
                          : index === 0
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                          : index === 2
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                          : 'bg-white border border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-md ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                        {player.icon || '😊'}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          player.id === user.id ? 'text-purple-700' : 'text-gray-800'
                        }`}>
                          {player.name}
                          {player.id === user.id && ' (คุณ)'}
                        </p>
                        <p className="text-xs text-gray-500">
                          เล่น {player.gamesPlayed || 0} เกม
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          index === 2 ? 'text-amber-700' :
                          'text-gray-600'
                        }`}>
                          {player.totalScore || 0}
                        </p>
                        <p className="text-xs text-gray-400">คะแนนเฉลี่ย</p>
                      </div>
                    </div>
                  ))}

                  {userRank > 5 && (
                    <>
                      <div className="text-center text-gray-400">...</div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {userRank}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                          {user.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-purple-700">{user.name}</p>
                          <p className="text-xs text-purple-500">อันดับ {userRank}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{stats.totalAverageScore}</p>
                          <p className="text-xs text-gray-400">คะแนนเฉลี่ย</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>ยังไม่มีผู้เล่นอื่น</p>
                  <p className="text-sm">มาเป็นคนแรกเลย! 🎉</p>
                </div>
              )}

              <button
                onClick={() => {
                  playSound('click');
                  setShowLeaderboard(true);
                }}
                className="mt-4 w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl py-3 text-gray-600 font-semibold hover:from-gray-100 hover:to-gray-200 transition-all hover:shadow-md"
              >
                ดูอันดับทั้งหมด 🏆
              </button>
            </div>

            {/* คำศัพท์สุ่ม */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <BookOpen size={24} />
                  คำศัพท์สุ่ม
                </h3>
                <button
                  onClick={generateNewWord}
                  className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <Sparkles size={16} />
                  สุ่มคำใหม่
                </button>
              </div>

              {wordOfDay && (
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-2">
                      คำศัพท์ HSK สุ่ม
                    </p>
                    <p className="text-white text-5xl font-bold mb-2">{wordOfDay.chinese}</p>
                    {wordOfDay.pinyin && (
                      <p className="text-white/90 text-xl mb-1">{wordOfDay.pinyin}</p>
                    )}
                    <p className="text-white/80 text-lg mb-6">{wordOfDay.thai}</p>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => speak(wordOfDay.chinese)}
                        disabled={isPlaying}
                        className={`bg-white/20 text-white px-6 py-3 rounded-full font-semibold 
                          transition-all flex items-center gap-2 backdrop-blur-sm
                          ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                      >
                        <Volume2 size={20} />
                        {isPlaying ? 'กำลังเล่น...' : 'ฟังเสียง'}
                      </button>
                      <button
                        onClick={generateNewWord}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-all"
                      >
                        คำต่อไป
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

    {/* ✅ ปุ่มรีเฟรช - อยู่ภายใน <main> */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={async () => {
                await forceRefreshUser();  // โหลดข้อมูลจาก Firebase ใหม่
                window.location.reload();   // รีโหลดหน้า
              }}
              className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-50"
            >
              🔄 รีเฟรชข้อมูล
            </button>
          )}
        </main>
      </div>

      {/* Modal วิธีการเล่น */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full">
                    <HelpCircle className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">วิธีการเล่น</h2>
                    <p className="text-gray-500">เลือกเกมที่ต้องการดูคำแนะนำ</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound('click');
                    setShowHowToPlay(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Game Selection Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
                {gamesInfo.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      playSound('click');
                      setActiveTab(game.id);
                    }}
                    className={`relative overflow-hidden rounded-xl p-4 transition-all ${
                      activeTab === game.id
                        ? `bg-gradient-to-r ${game.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                      <span className="text-3xl mb-2 block">{game.icon}</span>
                      <h3 className="font-bold text-sm">{game.name}</h3>
                      <p className="text-xs opacity-80 mt-1">{game.hskLevel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {gamesInfo.map((game) => (
                activeTab === game.id && (
                  <div key={game.id} className="space-y-6">
                    {/* Game Header */}
                    <div className={`bg-gradient-to-r ${game.color} rounded-2xl p-6 text-white`}>
                      <div className="flex items-center gap-4">
                        <span className="text-6xl">{game.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                          <p className="text-white/90">{game.description}</p>
                          <div className="flex gap-3 mt-3">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                              {game.hskLevel}
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                              {game.words} คำศัพท์
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rules & How to Play */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* กติกา */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Target className="text-blue-500" size={20} />
                          กติกา
                        </h4>
                        <ul className="space-y-3">
                          {game.rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* วิธีการเล่น */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Gamepad2 className="text-purple-500" size={20} />
                          วิธีการเล่น
                        </h4>
                        <ul className="space-y-3">
                          {game.howToPlay.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <div className="bg-purple-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* รายละเอียดเพิ่มเติม */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="text-yellow-500" size={20} />
                        รายละเอียดเพิ่มเติม
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">10</div>
                          <p className="text-xs text-gray-500">ด่านทั้งหมด</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">10</div>
                          <p className="text-xs text-gray-500">ข้อต่อด่าน</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">100</div>
                          <p className="text-xs text-gray-500">คะแนนเต็ม</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">80</div>
                          <p className="text-xs text-gray-500">คะแนนผ่าน</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 flex items-start gap-2">
                          <Sparkles className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                          <span className="font-medium">เคล็ดลับ: </span>
                          {game.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl">
              <button
                onClick={() => {
                  playSound('click');
                  setShowHowToPlay(false);
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                เข้าใจแล้ว ไปเล่นกันเลย! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal อันดับทั้งหมด */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Trophy className="text-yellow-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">อันดับผู้เล่นทั้งหมด</h2>
                    <p className="text-gray-500">จัดอันดับตามคะแนนเฉลี่ย</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound('click');
                    setShowLeaderboard(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {leaderboardLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-500">กำลังโหลดอันดับ...</p>
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        player.id === user.id
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-md ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                        {player.icon || '😊'}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          player.id === user.id ? 'text-purple-700' : 'text-gray-800'
                        }`}>
                          {player.name}
                          {player.id === user.id && ' (คุณ)'}
                        </p>
                        <p className="text-sm text-gray-500">
                          เล่น {player.gamesPlayed || 0} เกม
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">{player.totalScore || 0}</p>
                        <p className="text-xs text-gray-400">คะแนนเฉลี่ย</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">ยังไม่มีผู้เล่น</p>
                  <p className="text-gray-400">มาเป็นคนแรกและสร้างตำนานกันเถอะ! 🎉</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl">
              <button
                onClick={() => {
                  playSound('click');
                  setShowLeaderboard(false);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
