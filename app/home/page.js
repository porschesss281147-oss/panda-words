// app/home/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { useSound } from '@/hooks/useSound';
import { games, allHsk, hsk1, hsk2, hsk3 } from '@/data/games';
import { LogOut, Gamepad2, Trophy, Target, Volume2, Sparkles, Award, Users, X, HelpCircle, BookOpen, CheckCircle, Star, Zap, Crown } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { leaderboard, loading: leaderboardLoading, getUserRank } = useLeaderboard();
  const { playSound } = useSound();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordOfDay, setWordOfDay] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'hsk1', 'hsk2', 'hsk3'

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
        pinyin: word.pinyin,
        type: 'hsk'
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
    utterance.onerror = () => {
      setIsPlaying(false);
      alert('ไม่สามารถอ่านเสียงได้');
    };

    window.speechSynthesis.speak(utterance);
  };

  // คำนวณสถิติจริง
  const calculateStats = () => {
    if (!user) return { 
      gamesPlayed: 0, 
      totalScore: 0, 
      unlockedLevels: 0, 
      challengesCompleted: 0 
    };

    const gamesPlayed = user.gamesPlayed || 0;
    const totalScore = user.totalScore || 0;
    const unlockedLevels = Object.values(user.unlockedLevels || {}).reduce((a, b) => a + b, 0);
    const challengesCompleted = user.challengesCompleted || 0;

    return { gamesPlayed, totalScore, unlockedLevels, challengesCompleted };
  };

  const stats = calculateStats();
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => playSound('click')}
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 transform hover:scale-105 transition-all cursor-pointer hover:shadow-lg"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <Gamepad2 className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">เล่นไปแล้ว</p>
                <p className="text-2xl font-bold text-gray-800">{stats.gamesPlayed}</p>
                <p className="text-xs text-gray-400">เกม</p>
              </div>
            </div>

            <div 
              onClick={() => playSound('click')}
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 transform hover:scale-105 transition-all cursor-pointer hover:shadow-lg"
            >
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">ปลดล็อกแล้ว</p>
                <p className="text-2xl font-bold text-gray-800">{stats.unlockedLevels}</p>
                <p className="text-xs text-gray-400">ด่าน</p>
              </div>
            </div>

            <div 
              onClick={() => playSound('click')}
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 transform hover:scale-105 transition-all cursor-pointer hover:shadow-lg"
            >
              <div className="bg-purple-100 p-3 rounded-full">
                <Trophy className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">คะแนนรวม</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalScore}</p>
                <p className="text-xs text-gray-400">คะแนน</p>
              </div>
            </div>

            {/* ปุ่มวิธีการเล่น */}
            <div 
              onClick={() => {
                playSound('click');
                setShowHowToPlay(true);
              }}
              className="bg-gradient-to-br ffrom-red-500 to-red-600 rounded-xl shadow-md p-4 flex items-center space-x-4 transform hover:scale-105 transition-all cursor-pointer hover:shadow-lg"
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
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  playSound('start');
                  router.push(`/games/${game.id}`);
                }}
                className={`bg-gradient-to-r ${game.color} rounded-2xl shadow-lg p-6 
                  cursor-pointer transform hover:scale-105 transition-all duration-300
                  hover:shadow-xl relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-5xl">{game.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      {game.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                        {game.levels} ด่าน
                      </span>
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                        ด่านที่ {user.unlockedLevels[game.id] || 1} / {game.levels}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                          เล่น {player.gamesPlayed || 0} เกม • {player.challengesCompleted || 0} ดวงดาว
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          index === 2 ? 'text-amber-700' :
                          'text-gray-600'
                        }`}>
                          {player.totalScore?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-400">คะแนน</p>
                      </div>
                    </div>
                  ))}

                  {userRank > 5 && (
                    <>
                      <div className="text-center text-gray-400">...</div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300 hover:shadow-md transition-all">
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
                          <p className="font-bold text-purple-600">{stats.totalScore?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">คะแนน</p>
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
        </main>
      </div>

      {/* Modal วิธีการเล่น */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HelpCircle className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">วิธีการเล่น</h2>
                    <p className="text-gray-500">เรียนรู้วิธีเล่นเกมต่างๆ ใน Panda Words</p>
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

              {/* Tabs */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {[
                  { id: 'general', label: 'เกมเติมประโยค', icon: '🎴' },
                  { id: 'spelling', label: 'เกมเรียงประโยค', icon: '📝' },
                  { id: 'tone', label: 'เกมฟังเสียง', icon: '🎧' },
                  { id: 'match', label: 'เกมสะกดคำ', icon: '✍️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playSound('click');
                      setActiveTab(tab.id);
                    }}
                    className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Star className="text-yellow-500" size={20} />
                      🎴 เกมเติมประโยคให้ถูกต้อง
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span> ใช้คำศัพท์ระดับ HSK 1 จำนวน 150 คำศัพท์ </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>แต่ละเกมมี 10 ด่าน แต่ละด่านมี 10 คำถาม</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>ผ่านแต่ละด่านต้องตอบให้ถูกอย่างน้อย 8 ข้อ</span>
                      </li>
                       <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span> ในแต่ละข้อมี เวลาจำกัด 30 วินาที </span>
                      </li>
                        <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span> คะแนนข้อละ 10 คะแนน </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>เมื่อผ่านด่านจะปลดล็อกด่านถัดไป</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'spelling' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3"> 📝 เกมเรียงประโยคให้ถูกต้องและสมบูรณ์ </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800"> ใช้คำศัพท์ระดับ HSK 2 จำนวน 300 คำศัพท์ </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800"> เกมมี 10 ด่าน และในแต่ละด่านมี 10 ข้อคำถาม </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">ลากคำ</p>
                          <p className="text-gray-600">ให้ลากคำศัทพ์ภาษาจีนไปวางเรียงกันให้ถูกต้อง</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-semibold text-gray-800"> เวลา </p>
                          <p className="text-gray-600"> ในแต่ละข้อมี เวลาจำกัด 40 วินาที </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <p className="font-semibold text-gray-800">ตรวจสอบคำตอบ</p>
                          <p className="text-gray-600">กด "ตรวจสอบ" เพื่อดูว่าถูกหรือผิด</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tone' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3"> 🎧  เกมฟังเสียงเลือกคำตอบที่ถูกต้อง</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">ใช้คำศัพท์ระดับ HSK 3 จำนวน 600 คำศัพท์</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">ฟังเสียง</p>
                          <p className="text-gray-600">กดปุ่มเล่นเพื่อฟังเสียงคำศัพท์</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">เกมมี 10 ด่าน และในแต่ละด่านมี 10 ข้อคำถาม</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">ผ่านแต่ละด่านต้องตอบให้ถูกอย่างน้อย 8 ข้อ</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">เวลา</p>
                          <p className="text-gray-600">ในแต่ละข้อมี เวลาจำกัด 30 วินาที </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-semibold text-gray-800">ตรวจสอบ</p>
                          <p className="text-gray-600">กดตรวจสอบเพื่อดูว่าถูกต้องหรือไม่</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {activeTab === 'match' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">✍️ เกมสะกดคำภาษาจีนตัวเต็มให้ถูกต้อง</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">ใช้คำศัพท์ระดับ HSK1 – HSK3 จำนวน 600 คำศัพท์</p>
                        </div>
                      </div>
                       <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">เกมมี 10 ด่าน และในแต่ละด่านมี 10 ข้อคำถาม</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-semibold text-gray-800">ผ่านแต่ละด่านต้องตอบให้ถูกอย่างน้อย 8 ข้อ</p>
                        </div>
                      </div>
                       <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-semibold text-gray-800">ดูคำศัพท์หรือดูคำใบ้</p>
                          <p className="text-gray-600">จะมีคำศัพท์ภาษาไทยแสดงอยู่และบอกมีกี่ตัวอักษร</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-semibold text-gray-800">ให้พิมพ์ภาษาจีนตัวเต็มลงในช่อง</p>
                        </div>
                      </div>
                     <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-semibold text-gray-800">กดตรวจสอบเพื่อดูว่าถูกต้องหรือไม่</p>
                          <p className="text-gray-600">ถ้าตอบผิดจะมีเฉลยขึ้นให้พร้อมให้ตอบใหม่อีกครั้งเพื่อให้ทำได้</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl">
              <button
                onClick={() => {
                  playSound('click');
                  setShowHowToPlay(false);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
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
                    <p className="text-gray-500">จัดอันดับตามคะแนนรวม</p>
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
                          เล่น {player.gamesPlayed || 0} เกม • {player.challengesCompleted || 0} ดวงดาว
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">{player.totalScore?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-400">คะแนน</p>
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
