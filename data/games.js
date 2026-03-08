export const games = [
  {
    id: 'sentence',
    title: 'เกมเติมประโยค',
    description: 'เติมคำศัพท์ให้เป็นประโยคที่ถูกต้อง',
    icon: '🎴',
    levels: 10,
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 'matching',
    title: 'เกมเรียงประโยค',
    description: 'เรียงคำศัพท์ให้เป็นประโยคที่ถูกต้อง',
    icon: '📝',
    levels: 10,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'listening',
    title: 'เกมฟังเสียง',
    description: 'ฟังเสียงแล้วเลือกคำศัพท์ที่ถูกต้อง',
    icon: '🎧',
    levels: 10,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'spelling',
    title: 'เกมสะกดคำ', 
    description: 'สะกดคำศัพท์ภาษาจีนให้ถูกต้อง',
    icon: '✍️',
    levels: 10,
    color: 'from-orange-400 to-red-500'
  }
]; 

export const hsk1 = [
  { 
    id: 1,
    chinese: '爱', 
    pinyin: 'ài', 
    thai: 'รัก',
    sentence: '妈妈，我爱你。',
    sentence_th: 'แม่ครับ/คะ ฉันรักคุณ'
  },
  { 
    id: 2,
    chinese: '八', 
    pinyin: 'bā', 
    thai: 'แปด',
    sentence: '他儿子今年八岁了。',
    sentence_th: 'ลูกชายของเขาปีนี้แปดขวบแล้ว'
  },
  { 
    id: 3,
    chinese: '爸爸', 
    pinyin: 'bàba', 
    thai: 'พ่อ',
    sentence: '我爸爸是医生。',
    sentence_th: 'พ่อของฉันเป็นหมอ'
  },
  { 
    id: 4,
    chinese: '杯子', 
    pinyin: 'bēizi', 
    thai: 'แก้ว',
    sentence: '杯子里有茶。',
    sentence_th: 'ในแก้วมีชา'
  },
  { 
    id: 5,
    chinese: '北京', 
    pinyin: 'běijīng', 
    thai: 'ปักกิ่ง',
    sentence: '我住在北京。',
    sentence_th: 'ฉันอาศัยอยู่ที่ปักกิ่ง'
  },
  { 
    id: 6,
    chinese: '本', 
    pinyin: 'běn', 
    thai: 'เล่ม',
    sentence: '桌子上有一本书。',
    sentence_th: 'บนโต๊ะมีหนังสือหนึ่งเล่ม'
  },
  { 
    id: 7,
    chinese: '不客气', 
    pinyin: 'bú kèqi', 
    thai: 'ไม่เป็นไร',
    sentence: '甲：谢谢你！乙：不客气。',
    sentence_th: 'คนที่ 1: ขอบคุณ! คนที่ 2: ไม่เป็นไร'
  },
  { 
    id: 8,
    chinese: '不', 
    pinyin: 'bù', 
    thai: 'ไม่',
    sentence: '我不是学生。',
    sentence_th: 'ฉันไม่ใช่นักเรียน'
  },
  { 
    id: 9,
    chinese: '菜', 
    pinyin: 'cài', 
    thai: 'กับข้าว, ผัก',
    sentence: '今天我做了三个菜。',
    sentence_th: 'วันนี้ฉันทำกับข้าวสามอย่าง'
  },
  { 
    id: 10,
    chinese: '茶', 
    pinyin: 'chá', 
    thai: 'ชา',
    sentence: '请喝杯茶吧。',
    sentence_th: 'เชิญดื่มชาสักแก้วเถอะ'
  },
  { 
    id: 11,
    chinese: '吃', 
    pinyin: 'chī', 
    thai: 'กิน',
    sentence: '请吃点儿米饭。',
    sentence_th: 'เชิญกินข้าวหน่อย'
  },
  { 
    id: 12,
    chinese: '出租车', 
    pinyin: 'chūzūchē', 
    thai: 'แท็กซี่',
    sentence: '我们坐出租车去火车站。',
    sentence_th: 'เรานั่งแท็กซี่ไปสถานีรถไฟ'
  },
  { 
    id: 13,
    chinese: '打电话', 
    pinyin: 'dǎ diànhuà', 
    thai: 'โทรศัพท์',
    sentence: '他在打电话呢。',
    sentence_th: 'เขากำลังโทรศัพท์อยู่'
  },
  { 
    id: 14,
    chinese: '大', 
    pinyin: 'dà', 
    thai: 'ใหญ่',
    sentence: '这个苹果很大。',
    sentence_th: 'แอปเปิ้ลลูกนี้ใหญ่'
  },
  { 
    id: 15,
    chinese: '的', 
    pinyin: 'de', 
    thai: 'ของ',
    sentence: '这是我的书。',
    sentence_th: 'นี่คือหนังสือของฉัน'
  },
  { 
    id: 16,
    chinese: '点', 
    pinyin: 'diǎn', 
    thai: 'จุด, นาฬิกา',
    sentence: '现在是下午3点20。',
    sentence_th: 'ตอนนี้บ่าย 3 โมง 20 นาที'
  },
  { 
    id: 17,
    chinese: '电脑', 
    pinyin: 'diànnǎo', 
    thai: 'คอมพิวเตอร์',
    sentence: '我买了个电脑。',
    sentence_th: 'ฉันซื้อคอมพิวเตอร์เครื่องหนึ่ง'
  },
  { 
    id: 18,
    chinese: '电视', 
    pinyin: 'diànshì', 
    thai: 'โทรทัศน์',
    sentence: '妈妈在看电视。',
    sentence_th: 'แม่กำลังดูทีวี'
  },
  { 
    id: 19,
    chinese: '电影', 
    pinyin: 'diànyǐng', 
    thai: 'ภาพยนตร์',
    sentence: '我喜欢看电影。',
    sentence_th: 'ฉันชอบดูหนัง'
  },
  { 
    id: 20,
    chinese: '东西', 
    pinyin: 'dōngxi', 
    thai: 'สิ่งของ',
    sentence: '我在商店买了很多东西。',
    sentence_th: 'ฉันซื้อของหลายอย่างที่ร้าน'
  },
  { 
    id: 21,
    chinese: '都', 
    pinyin: 'dōu', 
    thai: 'ทั้งหมด',
    sentence: '我们都来了。',
    sentence_th: 'เรามากันทั้งหมดแล้ว'
  },
  { 
    id: 22,
    chinese: '读', 
    pinyin: 'dú', 
    thai: 'อ่าน',
    sentence: '你会读这个汉字吗？',
    sentence_th: 'คุณอ่านอักษรจีนตัวนี้ออกไหม'
  },
  { 
    id: 23,
    chinese: '对不起', 
    pinyin: 'duìbuqǐ', 
    thai: 'ขอโทษ',
    sentence: '对不起，我错了。',
    sentence_th: 'ขอโทษ ฉันผิดเอง'
  },
  { 
    id: 24,
    chinese: '多', 
    pinyin: 'duō', 
    thai: 'มาก',
    sentence: '这里的人很多。',
    sentence_th: 'คนที่นี่เยอะ'
  },
  { 
    id: 25,
    chinese: '多少', 
    pinyin: 'duōshǎo', 
    thai: 'เท่าไหร่',
    sentence: '你们学校有多少学生？',
    sentence_th: 'โรงเรียนพวกคุณมีนักเรียนกี่คน'
  },
  { 
    id: 26,
    chinese: '儿子', 
    pinyin: 'érzi', 
    thai: 'ลูกชาย',
    sentence: '我儿子三岁了。',
    sentence_th: 'ลูกชายฉันสามขวบแล้ว'
  },
  { 
    id: 27,
    chinese: '二', 
    pinyin: 'èr', 
    thai: 'สอง',
    sentence: '现在十二点了。',
    sentence_th: 'ตอนนี้สิบสองนาฬิกา'
  },
  { 
    id: 28,
    chinese: '饭店', 
    pinyin: 'fàndiàn', 
    thai: 'ร้านอาหาร',
    sentence: '中午我们去饭店吃吧。',
    sentence_th: 'ตอนเที่ยงเราไปกินที่ร้านอาหารกันเถอะ'
  },
  { 
    id: 29,
    chinese: '飞机', 
    pinyin: 'fēijī', 
    thai: 'เครื่องบิน',
    sentence: '我坐飞机去北京。',
    sentence_th: 'ฉันนั่งเครื่องบินไปปักกิ่ง'
  },
  { 
    id: 30,
    chinese: '分钟', 
    pinyin: 'fēnzhōng', 
    thai: 'นาที',
    sentence: '等二十分钟。',
    sentence_th: 'รอ 20 นาที'
  },
  { 
    id: 31,
    chinese: '高兴', 
    pinyin: 'gāoxìng', 
    thai: 'ดีใจ',
    sentence: '今天我很高兴。',
    sentence_th: 'วันนี้ฉันดีใจมาก'
  },
  { 
    id: 32,
    chinese: '个', 
    pinyin: 'gè', 
    thai: 'อัน, คน',
    sentence: '我是一个学生。',
    sentence_th: 'ฉันเป็นนักเรียนหนึ่งคน'
  },
  { 
    id: 33,
    chinese: '工作', 
    pinyin: 'gōngzuò', 
    thai: 'ทำงาน',
    sentence: '我很喜欢现在的工作。',
    sentence_th: 'ฉันชอบงานปัจจุบันมาก'
  },
  { 
    id: 34,
    chinese: '汉语', 
    pinyin: 'hànyǔ', 
    thai: 'ภาษาจีน',
    sentence: '他在学习汉语。',
    sentence_th: 'เขากำลังเรียนภาษาจีน'
  },
  { 
    id: 35,
    chinese: '好', 
    pinyin: 'hǎo', 
    thai: 'ดี',
    sentence: '今天天气很好。',
    sentence_th: 'วันนี้อากาศดีมาก'
  },
  { 
    id: 36,
    chinese: '号', 
    pinyin: 'hào', 
    thai: 'วันที่',
    sentence: '今天是2002年1月1号。',
    sentence_th: 'วันนี้วันที่ 1 มกราคม 2002'
  },
  { 
    id: 37,
    chinese: '喝', 
    pinyin: 'hē', 
    thai: 'ดื่ม',
    sentence: '我想喝水。',
    sentence_th: 'ฉันอยากดื่มน้ำ'
  },
  { 
    id: 38,
    chinese: '和', 
    pinyin: 'hé', 
    thai: 'และ',
    sentence: '爸爸和妈妈都在家。',
    sentence_th: 'พ่อและแม่อยู่บ้านทั้งคู่'
  },
  { 
    id: 39,
    chinese: '很', 
    pinyin: 'hěn', 
    thai: 'มาก',
    sentence: '李小姐很漂亮。',
    sentence_th: 'คุณหนูหลี่สวยมาก'
  },
  { 
    id: 40,
    chinese: '后面', 
    pinyin: 'hòumiàn', 
    thai: 'ข้างหลัง',
    sentence: '商店在学校后面。',
    sentence_th: 'ร้านค้าอยู่ข้างหลังโรงเรียน'
  },
  { 
    id: 41,
    chinese: '回', 
    pinyin: 'huí', 
    thai: 'กลับ',
    sentence: '我八点回家。',
    sentence_th: 'ฉันกลับบ้าน 8 โมง'
  },
  { 
    id: 42,
    chinese: '会', 
    pinyin: 'huì', 
    thai: 'สามารถ',
    sentence: '我会开车。',
    sentence_th: 'ฉันขับรถเป็น'
  },
  { 
    id: 43,
    chinese: '几', 
    pinyin: 'jǐ', 
    thai: 'กี่',
    sentence: '你有一个儿子？',
    sentence_th: 'คุณมีลูกชายกี่คน'
  },
  { 
    id: 44,
    chinese: '家', 
    pinyin: 'jiā', 
    thai: 'บ้าน',
    sentence: '我家在北京。',
    sentence_th: 'บ้านฉันอยู่ปักกิ่ง'
  },
  { 
    id: 45,
    chinese: '叫', 
    pinyin: 'jiào', 
    thai: 'เรียก',
    sentence: '我的名字叫李明。',
    sentence_th: 'ชื่อของฉันหลี่หมิง'
  },
  { 
    id: 46,
    chinese: '今天', 
    pinyin: 'jīntiān', 
    thai: 'วันนี้',
    sentence: '今天我去北京。',
    sentence_th: 'วันนี้ฉันไปปักกิ่ง'
  },
  { 
    id: 47,
    chinese: '九', 
    pinyin: 'jiǔ', 
    thai: 'เก้า',
    sentence: '现在九点了。',
    sentence_th: 'ตอนนี้ 9 โมงแล้ว'
  },
  { 
    id: 48,
    chinese: '开', 
    pinyin: 'kāi', 
    thai: 'ขับ, เปิด',
    sentence: '我开了三年出租车了。',
    sentence_th: 'ฉันขับแท็กซี่มาสามปีแล้ว'
  },
  { 
    id: 49,
    chinese: '看', 
    pinyin: 'kàn', 
    thai: 'ดู, อ่าน',
    sentence: '我在看书呢。',
    sentence_th: 'ฉันกำลังอ่านหนังสือ'
  },
  { 
    id: 50,
    chinese: '看见', 
    pinyin: 'kànjiàn', 
    thai: 'เห็น',
    sentence: '我没看见他。',
    sentence_th: 'ฉันไม่เห็นเขา'
  },
  { 
    id: 51,
    chinese: '块', 
    pinyin: 'kuài', 
    thai: 'หยวน',
    sentence: '这本书三十块钱。',
    sentence_th: 'หนังสือเล่มนี้ 30 หยวน'
  },
  { 
    id: 52,
    chinese: '来', 
    pinyin: 'lái', 
    thai: 'มา',
    sentence: '他是昨天来这儿的。',
    sentence_th: 'เขามาที่นี่เมื่อวาน'
  },
  { 
    id: 53,
    chinese: '老师', 
    pinyin: 'lǎoshī', 
    thai: 'ครู',
    sentence: '他就是我们的汉语老师。',
    sentence_th: 'เขาคือครูภาษาจีนของเรา'
  },
  { 
    id: 54,
    chinese: '了', 
    pinyin: 'le', 
    thai: 'แล้ว',
    sentence: '昨天下雨了。',
    sentence_th: 'เมื่อวานฝนตกแล้ว'
  },
  { 
    id: 55,
    chinese: '冷', 
    pinyin: 'lěng', 
    thai: 'หนาว',
    sentence: '今天太冷了。',
    sentence_th: 'วันนี้หนาวเกินไป'
  },
  { 
    id: 56,
    chinese: '里', 
    pinyin: 'lǐ', 
    thai: 'ใน',
    sentence: '我们都在学校里。',
    sentence_th: 'พวกเราทุกคนอยู่ในโรงเรียน'
  },
  { 
    id: 57,
    chinese: '零', 
    pinyin: 'líng', 
    thai: 'ศูนย์',
    sentence: '今年是二零一二年。',
    sentence_th: 'ปีนี้คือ 2012'
  },
  { 
    id: 58,
    chinese: '六', 
    pinyin: 'liù', 
    thai: 'หก',
    sentence: '现在六点了。',
    sentence_th: 'ตอนนี้ 6 โมงแล้ว'
  },
  { 
    id: 59,
    chinese: '妈妈', 
    pinyin: 'māma', 
    thai: 'แม่',
    sentence: '我妈妈不在家。',
    sentence_th: 'แม่ฉันไม่อยู่บ้าน'
  },
  { 
    id: 60,
    chinese: '吗', 
    pinyin: 'ma', 
    thai: 'ไหม',
    sentence: '你是中国人吗？',
    sentence_th: 'คุณเป็นคนจีนไหม'
  },
  { 
    id: 61,
    chinese: '买', 
    pinyin: 'mǎi', 
    thai: 'ซื้อ',
    sentence: '我买了一些苹果。',
    sentence_th: 'ฉันซื้อแอปเปิ้ลมาบ้าง'
  },
  { 
    id: 62,
    chinese: '没关系', 
    pinyin: 'méiguānxi', 
    thai: 'ไม่เป็นไร',
    sentence: '甲：对不起！乙：没关系。',
    sentence_th: 'คนที่1:ขอโทษ! คนที่2:ไม่เป็นไร'
  },
  { 
    id: 63,
    chinese: '没有', 
    pinyin: 'méiyǒu', 
    thai: 'ไม่มี',
    sentence: '我家里没有人。',
    sentence_th: 'ที่บ้านฉันไม่มีคน'
  },
  { 
    id: 64,
    chinese: '米饭', 
    pinyin: 'mǐfàn', 
    thai: 'ข้าวสวย',
    sentence: '我爱吃米饭。',
    sentence_th: 'ฉันชอบกินข้าว'
  },
  { 
    id: 65,
    chinese: '名字', 
    pinyin: 'míngzi', 
    thai: 'ชื่อ',
    sentence: '我的名字叫李明。',
    sentence_th: 'ชื่อของฉันคือหลี่หมิง'
  },
  { 
    id: 66,
    chinese: '明天', 
    pinyin: 'míngtiān', 
    thai: 'พรุ่งนี้',
    sentence: '明天是星期一。',
    sentence_th: 'พรุ่งนี้วันจันทร์'
  },
  { 
    id: 67,
    chinese: '哪', 
    pinyin: 'nǎ', 
    thai: 'ไหน',
    sentence: '哪个杯子是你的？',
    sentence_th: 'แก้วใบไหนเป็นของคุณ'
  },
  { 
    id: 68,
    chinese: '哪儿', 
    pinyin: 'nǎr', 
    thai: 'ที่ไหน',
    sentence: '你家在哪儿？',
    sentence_th: 'บ้านคุณอยู่ที่ไหน'
  },
  { 
    id: 69,
    chinese: '那', 
    pinyin: 'nà', 
    thai: 'นั้น',
    sentence: '我不认识那个人。',
    sentence_th: 'ฉันไม่รู้จักคนนั้น'
  },
  { 
    id: 70,
    chinese: '那儿', 
    pinyin: 'nàr', 
    thai: 'ที่นั่น',
    sentence: '我们的车在那儿。',
    sentence_th: 'รถของเราอยู่ที่นั่น'
  },
  { 
    id: 71,
    chinese: '呢', 
    pinyin: 'ne', 
    thai: 'ล่ะ',
    sentence: '你们家有几个人呢？',
    sentence_th: 'ที่บ้านคุณมีคนกี่คนล่ะ'
  },
  { 
    id: 72,
    chinese: '能', 
    pinyin: 'néng', 
    thai: 'สามารถ',
    sentence: '我能坐在这儿吗？',
    sentence_th: 'ฉันนั่งตรงนี้ได้ไหม'
  },
  { 
    id: 73,
    chinese: '你', 
    pinyin: 'nǐ', 
    thai: 'คุณ',
    sentence: '你认识这个人吗？',
    sentence_th: 'คุณรู้จักคนนี้ไหม'
  },
  { 
    id: 74,
    chinese: '年', 
    pinyin: 'nián', 
    thai: 'ปี',
    sentence: '我在中国住了三年。',
    sentence_th: 'ฉันอยู่จีนสามปี'
  },
  { 
    id: 75,
    chinese: '女儿', 
    pinyin: "nǚ'ér", 
    thai: 'ลูกสาว',
    sentence: '我有两个女儿。',
    sentence_th: 'ฉันมีลูกสาวสองคน'
  },
  { 
    id: 76,
    chinese: '朋友', 
    pinyin: 'péngyou', 
    thai: 'เพื่อน',
    sentence: '他是我的好朋友。',
    sentence_th: 'เขาเป็นเพื่อนที่ดีของฉัน'
  },
  { 
    id: 77,
    chinese: '漂亮', 
    pinyin: 'piàoliang', 
    thai: 'สวย',
    sentence: '你的衣服真漂亮。',
    sentence_th: 'เสื้อผ้าคุณสวยจัง'
  },
  { 
    id: 78,
    chinese: '苹果', 
    pinyin: 'píngguǒ', 
    thai: 'แอปเปิ้ล',
    sentence: '你想不想吃个苹果？',
    sentence_th: 'คุณอยากกินแอปเปิ้ลไหม'
  },
  { 
    id: 79,
    chinese: '七', 
    pinyin: 'qī', 
    thai: 'เจ็ด',
    sentence: '一个星期有七天。',
    sentence_th: 'หนึ่งสัปดาห์มีเจ็ดวัน'
  },
  { 
    id: 80,
    chinese: '钱', 
    pinyin: 'qián', 
    thai: 'เงิน',
    sentence: '一个苹果三块钱。',
    sentence_th: 'แอปเปิ้ลหนึ่งผลสามหยวน'
  },
  { 
    id: 81,
    chinese: '前面', 
    pinyin: 'qiánmiàn', 
    thai: 'ข้างหน้า',
    sentence: '前面那个人是我的同学。',
    sentence_th: 'คนข้างหน้าคนนั้นคือเพื่อนร่วมชั้นฉัน'
  },
  { 
    id: 82,
    chinese: '请', 
    pinyin: 'qǐng', 
    thai: 'เชิญ',
    sentence: '请坐在椅子上。',
    sentence_th: 'เชิญนั่งบนเก้าอี้'
  },
  { 
    id: 83,
    chinese: '去', 
    pinyin: 'qù', 
    thai: 'ไป',
    sentence: '我星期三去中国。',
    sentence_th: 'ฉันวันพุธไปจีน'
  },
  { 
    id: 84,
    chinese: '热', 
    pinyin: 'rè', 
    thai: 'ร้อน',
    sentence: '今天很热。',
    sentence_th: 'วันนี้ร้อนมาก'
  },
  { 
    id: 85,
    chinese: '人', 
    pinyin: 'rén', 
    thai: 'คน',
    sentence: '商店里有很多人。',
    sentence_th: 'ในร้านค้ามีคนมากมาย'
  },
  { 
    id: 86,
    chinese: '认识', 
    pinyin: 'rènshi', 
    thai: 'รู้จัก',
    sentence: '认识你很高兴。',
    sentence_th: 'ดีใจที่ได้รู้จักคุณ'
  },
  { 
    id: 87,
    chinese: '三', 
    pinyin: 'sān', 
    thai: 'สาม',
    sentence: '我有三本书。',
    sentence_th: 'ฉันมีหนังสือสามเล่ม'
  },
  { 
    id: 88,
    chinese: '商店', 
    pinyin: 'shāngdiàn', 
    thai: 'ร้านค้า',
    sentence: '她去商店买东西了。',
    sentence_th: 'เธอไปซื้อของที่ร้านค้า'
  },
  { 
    id: 89,
    chinese: '上', 
    pinyin: 'shàng', 
    thai: 'ด้านบน',
    sentence: '水果在桌子上。',
    sentence_th: 'ผลไม่อยู่บนโต๊ะ'
  },
  { 
    id: 90,
    chinese: '上午', 
    pinyin: 'shàngwǔ', 
    thai: 'ช่วงเช้า',
    sentence: '现在是上午10点。',
    sentence_th: 'ตอนนี้ 10 โมงเช้า'
  },
  { 
    id: 91,
    chinese: '少', 
    pinyin: 'shǎo', 
    thai: 'น้อย',
    sentence: '杯子里的水很少。',
    sentence_th: 'น้ำในแก้วน้อยมาก'
  },
  { 
    id: 92,
    chinese: '谁', 
    pinyin: 'shéi', 
    thai: 'ใคร',
    sentence: '那个人是谁？',
    sentence_th: 'คนนั้นคือใคร'
  },
  { 
    id: 93,
    chinese: '什么', 
    pinyin: 'shénme', 
    thai: 'อะไร',
    sentence: '你看见了什么？',
    sentence_th: 'คุณเห็นอะไร'
  },
  { 
    id: 94,
    chinese: '十', 
    pinyin: 'shí', 
    thai: 'สิบ',
    sentence: '现在是十月。',
    sentence_th: 'ตอนนี้เดือนตุลาคม'
  },
  { 
    id: 95,
    chinese: '时候', 
    pinyin: 'shíhou', 
    thai: 'ตอนที่',
    sentence: '我回家的时候，他在睡觉。',
    sentence_th: 'ตอนที่ฉันกลับบ้าน เขากำลังนอน'
  },
  { 
    id: 96,
    chinese: '是', 
    pinyin: 'shì', 
    thai: 'เป็น, ใช่',
    sentence: '他是学生。',
    sentence_th: 'เขาเป็นนักเรียน'
  },
  { 
    id: 97,
    chinese: '书', 
    pinyin: 'shū', 
    thai: 'หนังสือ',
    sentence: '我喜欢读书。',
    sentence_th: 'ฉันชอบอ่านหนังสือ'
  },
  { 
    id: 98,
    chinese: '水', 
    pinyin: 'shuǐ', 
    thai: 'น้ำ',
    sentence: '杯子里还有水吗？',
    sentence_th: 'ในแก้วยังมีน้ำไหม'
  },
  { 
    id: 99,
    chinese: '水果', 
    pinyin: 'shuǐguǒ', 
    thai: 'ผลไม้',
    sentence: '我想去商店买水果。',
    sentence_th: 'ฉันอยากไปซื้อผลไม้ที่ร้าน'
  },
  { 
    id: 100,
    chinese: '睡觉', 
    pinyin: 'shuìjiào', 
    thai: 'นอน',
    sentence: '儿子在睡觉呢。',
    sentence_th: 'ลูกชายกำลังนอน'
  },
  { 
    id: 101,
    chinese: '说', 
    pinyin: 'shuō', 
    thai: 'พูด',
    sentence: '你在说什么？',
    sentence_th: 'คุณพูดอะไรอยู่'
  },
  { 
    id: 102,
    chinese: '说话', 
    pinyin: 'shuōhuà', 
    thai: 'พูดคุย',
    sentence: '他们在说话。',
    sentence_th: 'พวกเขากำลังคุยกัน'
  },
  { 
    id: 103,
    chinese: '四', 
    pinyin: 'sì', 
    thai: 'สี่',
    sentence: '我们四个人去看电影。',
    sentence_th: 'พวกเราสี่คนไปดูหนัง'
  },
  { 
    id: 104,
    chinese: '岁', 
    pinyin: 'suì', 
    thai: 'ขวบ',
    sentence: '李医生今年40岁。',
    sentence_th: 'คุณหมอหลี่ปีนี้อายุ 40 ปี'
  },
  { 
    id: 105,
    chinese: '他', 
    pinyin: 'tā', 
    thai: 'เขา',
    sentence: '他是我的同学。',
    sentence_th: 'เขาเป็นเพื่อนร่วมชั้นฉัน'
  },
  { 
    id: 106,
    chinese: '她', 
    pinyin: 'tā', 
    thai: 'เธอ',
    sentence: '她是我妹妹。',
    sentence_th: 'เธอคือน้องสาวฉัน'
  },
  { 
    id: 107,
    chinese: '太', 
    pinyin: 'tài', 
    thai: 'เกินไป',
    sentence: '这个苹果太大了。',
    sentence_th: 'แอปเปิ้ลลูกนี้ใหญ่เกินไป'
  },
  { 
    id: 108,
    chinese: '天气', 
    pinyin: 'tiānqì', 
    thai: 'อากาศ',
    sentence: '今天天气很好。',
    sentence_th: 'วันนี้อากาศดีมาก'
  },
  { 
    id: 109,
    chinese: '听', 
    pinyin: 'tīng', 
    thai: 'ฟัง',
    sentence: '我喜欢听音乐。',
    sentence_th: 'ฉันชอบฟังเพลง'
  },
  { 
    id: 110,
    chinese: '同学', 
    pinyin: 'tóngxué', 
    thai: 'เพื่อนร่วมชั้น',
    sentence: '他是我的同学。',
    sentence_th: 'เขาเป็นเพื่อนร่วมชั้นฉัน'
  },
  { 
    id: 111,
    chinese: '玩', 
    pinyin: 'wán', 
    thai: 'เล่น',
    sentence: '孩子们在玩。',
    sentence_th: 'เด็กๆกำลังเล่น'
  },
  { 
    id: 112,
    chinese: '晚上', 
    pinyin: 'wǎnshang', 
    thai: 'ตอนเย็น',
    sentence: '晚上我去看电影。',
    sentence_th: 'ตอนเย็นฉันไปดูหนัง'
  },
  { 
    id: 113,
    chinese: '我', 
    pinyin: 'wǒ', 
    thai: 'ฉัน',
    sentence: '我是学生。',
    sentence_th: 'ฉันเป็นนักเรียน'
  },
  { 
    id: 114,
    chinese: '我们', 
    pinyin: 'wǒmen', 
    thai: 'พวกเรา',
    sentence: '我们是朋友。',
    sentence_th: 'พวกเราเป็นเพื่อนกัน'
  },
  { 
    id: 115,
    chinese: '喜欢', 
    pinyin: 'xǐhuān', 
    thai: 'ชอบ',
    sentence: '我喜欢吃苹果。',
    sentence_th: 'ฉันชอบกินแอปเปิ้ล'
  },
  { 
    id: 116,
    chinese: '下', 
    pinyin: 'xià', 
    thai: 'ข้างล่าง',
    sentence: '书在桌子下。',
    sentence_th: 'หนังสืออยู่ใต้โต๊ะ'
  },
  { 
    id: 117,
    chinese: '下午', 
    pinyin: 'xiàwǔ', 
    thai: 'ตอนบ่าย',
    sentence: '下午我去商店。',
    sentence_th: 'ตอนบ่ายฉันไปร้านค้า'
  },
  { 
    id: 118,
    chinese: '下雨', 
    pinyin: 'xiàyǔ', 
    thai: 'ฝนตก',
    sentence: '今天下雨了。',
    sentence_th: 'วันนี้ฝนตก'
  },
  { 
    id: 119,
    chinese: '先生', 
    pinyin: 'xiānsheng', 
    thai: 'คุณ (ผู้ชาย)',
    sentence: '王先生是老师。',
    sentence_th: 'คุณหวังเป็นครู'
  },
  { 
    id: 120,
    chinese: '现在', 
    pinyin: 'xiànzài', 
    thai: 'ตอนนี้',
    sentence: '现在几点？',
    sentence_th: 'ตอนนี้กี่โมง'
  },
  { 
    id: 121,
    chinese: '想', 
    pinyin: 'xiǎng', 
    thai: 'คิดถึง, อยาก',
    sentence: '我想妈妈了。',
    sentence_th: 'ฉันคิดถึงแม่'
  },
  { 
    id: 122,
    chinese: '小', 
    pinyin: 'xiǎo', 
    thai: 'เล็ก',
    sentence: '这个杯子很小。',
    sentence_th: 'แก้วใบนี้เล็กมาก'
  },
  { 
    id: 123,
    chinese: '小姐', 
    pinyin: 'xiǎojiě', 
    thai: 'คุณหญิง',
    sentence: '李小姐很漂亮。',
    sentence_th: 'คุณหนูหลี่สวยมาก'
  },
  { 
    id: 124,
    chinese: '些', 
    pinyin: 'xiē', 
    thai: 'บาง',
    sentence: '我买了一些水果。',
    sentence_th: 'ฉันซื้อผลไม้บางส่วน'
  },
  { 
    id: 125,
    chinese: '写', 
    pinyin: 'xiě', 
    thai: 'เขียน',
    sentence: '我会写汉字。',
    sentence_th: 'ฉันเขียนตัวอักษรจีนได้'
  },
  { 
    id: 126,
    chinese: '谢谢', 
    pinyin: 'xièxie', 
    thai: 'ขอบคุณ',
    sentence: '谢谢你！',
    sentence_th: 'ขอบคุณ!'
  },
  { 
    id: 127,
    chinese: '星期', 
    pinyin: 'xīngqī', 
    thai: 'สัปดาห์',
    sentence: '今天是期几？',
    sentence_th: 'วันนี้วันอะไร'
  },
  { 
    id: 128,
    chinese: '学生', 
    pinyin: 'xuésheng', 
    thai: 'นักเรียน',
    sentence: '我是学生。',
    sentence_th: 'ฉันเป็นนักเรียน'
  },
  { 
    id: 129,
    chinese: '学习', 
    pinyin: 'xuéxí', 
    thai: 'เรียน',
    sentence: '我学习汉语。',
    sentence_th: 'ฉันเรียนภาษาจีน'
  },
  { 
    id: 130,
    chinese: '学校', 
    pinyin: 'xuéxiào', 
    thai: 'โรงเรียน',
    sentence: '学校很大。',
    sentence_th: 'โรงเรียนใหญ่มาก'
  },
  { 
    id: 131,
    chinese: '一', 
    pinyin: 'yī', 
    thai: 'หนึ่ง',
    sentence: '我有一个苹果。',
    sentence_th: 'ฉันมีแอปเปิ้ลหนึ่งผล'
  },
  { 
    id: 132,
    chinese: '一点儿', 
    pinyin: 'yìdiǎnr', 
    thai: 'นิดหน่อย',
    sentence: '我吃一点儿米饭。',
    sentence_th: 'ฉันกินข้าวนิดหน่อย'
  },
  { 
    id: 133,
    chinese: '衣服', 
    pinyin: 'yīfu', 
    thai: 'เสื้อผ้า',
    sentence: '这件衣服很漂亮。',
    sentence_th: 'เสื้อผ้าตัวนี้สวยมาก'
  },
  { 
    id: 134,
    chinese: '医生', 
    pinyin: 'yīshēng', 
    thai: 'หมอ',
    sentence: '我爸爸是医生。',
    sentence_th: 'พ่อฉันเป็นหมอ'
  },
  { 
    id: 135,
    chinese: '医院', 
    pinyin: 'yīyuàn', 
    thai: 'โรงพยาบาล',
    sentence: '医院很大。',
    sentence_th: 'โรงพยาบาลใหญ่มาก'
  },
  { 
    id: 136,
    chinese: '椅子', 
    pinyin: 'yǐzi', 
    thai: 'เก้าอี้',
    sentence: '请坐在椅子上。',
    sentence_th: 'เชิญนั่งบนเก้าอี้'
  },
  { 
    id: 137,
    chinese: '有', 
    pinyin: 'yǒu', 
    thai: 'มี',
    sentence: '我有一个妹妹。',
    sentence_th: 'ฉันมีน้องสาวหนึ่งคน'
  },
  { 
    id: 138,
    chinese: '月', 
    pinyin: 'yuè', 
    thai: 'เดือน',
    sentence: '现在是十月。',
    sentence_th: 'ตอนนี้เดือนตุลาคม'
  },
  { 
    id: 139,
    chinese: '再见', 
    pinyin: 'zàijiàn', 
    thai: 'ลาก่อน',
    sentence: '再见，明天见！',
    sentence_th: 'ลาก่อน เจอกันพรุ่งนี้!'
  },
  { 
    id: 140,
    chinese: '在', 
    pinyin: 'zài', 
    thai: 'อยู่ที่',
    sentence: '我在学校。',
    sentence_th: 'ฉันอยู่ที่โรงเรียน'
  },
  { 
    id: 141,
    chinese: '怎么', 
    pinyin: 'zěnme', 
    thai: 'อย่างไร',
    sentence: '你怎么去学校？',
    sentence_th: 'คุณไปโรงเรียนอย่างไร'
  },
  { 
    id: 142,
    chinese: '怎么样', 
    pinyin: 'zěnmeyàng', 
    thai: 'เป็นอย่างไร',
    sentence: '你最近怎么样？',
    sentence_th: 'ช่วงนี้คุณเป็นอย่างไรบ้าง'
  },
  { 
    id: 143,
    chinese: '这', 
    pinyin: 'zhè', 
    thai: 'นี้',
    sentence: '这是我的书。',
    sentence_th: 'นี่คือหนังสือของฉัน'
  },
  { 
    id: 144,
    chinese: '这儿', 
    pinyin: 'zhèr', 
    thai: 'ที่นี่',
    sentence: '我住在这儿。',
    sentence_th: 'ฉันอยู่ที่นี่'
  },
  { 
    id: 145,
    chinese: '中国', 
    pinyin: 'zhōngguó', 
    thai: 'ประเทศจีน',
    sentence: '我去中国。',
    sentence_th: 'ฉันไปจีน'
  },
  { 
    id: 146,
    chinese: '中午', 
    pinyin: 'zhōngwǔ', 
    thai: 'ตอนเที่ยง',
    sentence: '中午我们一起吃饭。',
    sentence_th: 'ตอนเที่ยงเรากินข้าวด้วยกัน'
  },
  { 
    id: 147,
    chinese: '住', 
    pinyin: 'zhù', 
    thai: 'พักอาศัย',
    sentence: '我住在中国。',
    sentence_th: 'ฉันอาศัยอยู่ที่จีน'
  },
  { 
    id: 148,
    chinese: '桌子', 
    pinyin: 'zhuōzi', 
    thai: 'โต๊ะ',
    sentence: '桌子上有书。',
    sentence_th: 'บนโต๊ะมีหนังสือ'
  },
  { 
    id: 149,
    chinese: '字', 
    pinyin: 'zì', 
    thai: 'ตัวอักษร',
    sentence: '我会写这个字。',
    sentence_th: 'ฉันเขียนตัวอักษรตัวนี้ได้'
  },
  { 
    id: 150,
    chinese: '昨天', 
    pinyin: 'zuótiān', 
    thai: 'เมื่อวาน',
    sentence: '昨天下雨了。',
    sentence_th: 'เมื่อวานฝนตก'
  },
];

export const hsk2 = [
  { 
    id: 151,
    chinese: '吧', 
    pinyin: 'ba', 
    thai: 'เถอะ, นะ',
    sentence: '我们走吧。',
    sentence_th: 'พวกเราไปกันเถอะ'
  },
  { 
    id: 152,
    chinese: '白', 
    pinyin: 'bái', 
    thai: 'ขาว',
    sentence: '这件衣服是白色的。',
    sentence_th: 'เสื้อผ้าตัวนี้สีขาว'
  },
  { 
    id: 153,
    chinese: '百', 
    pinyin: 'bǎi', 
    thai: 'ร้อย',
    sentence: '这本书一百块钱。',
    sentence_th: 'หนังสือเล่มนี้หนึ่งร้อยหยวน'
  },
  { 
    id: 154,
    chinese: '帮助', 
    pinyin: 'bāngzhù', 
    thai: 'ช่วยเหลือ',
    sentence: '他经常帮助我。',
    sentence_th: 'เขาช่วยเหลือฉันบ่อยๆ'
  },
  { 
    id: 155,
    chinese: '报纸', 
    pinyin: 'bàozhǐ', 
    thai: 'หนังสือพิมพ์',
    sentence: '爸爸在看报纸。',
    sentence_th: 'พ่อกำลังอ่านหนังสือพิมพ์'
  },
  { 
    id: 156,
    chinese: '比', 
    pinyin: 'bǐ', 
    thai: 'กว่า',
    sentence: '我比他高。',
    sentence_th: 'ฉันสูงกว่าเขา'
  },
  { 
    id: 157,
    chinese: '别', 
    pinyin: 'bié', 
    thai: 'อย่า',
    sentence: '别说话。',
    sentence_th: 'อย่าพูด'
  },
  { 
    id: 158,
    chinese: '长', 
    pinyin: 'cháng', 
    thai: 'ยาว',
    sentence: '这条路很长。',
    sentence_th: 'ถนนเส้นนี้ยาวมาก'
  },
  { 
    id: 159,
    chinese: '唱歌', 
    pinyin: 'chànggē', 
    thai: 'ร้องเพลง',
    sentence: '我喜欢唱歌。',
    sentence_th: 'ฉันชอบร้องเพลง'
  },
  { 
    id: 160,
    chinese: '出', 
    pinyin: 'chū', 
    thai: 'ออก',
    sentence: '请出来。',
    sentence_th: 'เชิญออกมา'
  },
  { 
    id: 161,
    chinese: '穿', 
    pinyin: 'chuān', 
    thai: 'ใส่, สวม',
    sentence: '她穿着红衣服。',
    sentence_th: 'เธอใส่เสื้อสีแดง'
  },
  { 
    id: 162,
    chinese: '次', 
    pinyin: 'cì', 
    thai: 'ครั้ง',
    sentence: '我去过一次北京。',
    sentence_th: 'ฉันไปปักกิ่งครั้งหนึ่ง'
  },
  { 
    id: 163,
    chinese: '从', 
    pinyin: 'cóng', 
    thai: 'จาก',
    sentence: '我从泰国来。',
    sentence_th: 'ฉันมาจากไทย'
  },
  { 
    id: 164,
    chinese: '错', 
    pinyin: 'cuò', 
    thai: 'ผิด',
    sentence: '这个答案错了。',
    sentence_th: 'คำตอบนี้ผิด'
  },
  { 
    id: 165,
    chinese: '打篮球', 
    pinyin: 'dǎ lánqiú', 
    thai: 'เล่นบาสเกตบอล',
    sentence: '他喜欢打篮球。',
    sentence_th: 'เขาชอบเล่นบาส'
  },
  { 
    id: 166,
    chinese: '大家', 
    pinyin: 'dàjiā', 
    thai: 'ทุกคน',
    sentence: '大家好。',
    sentence_th: 'สวัสดีทุกคน'
  },
  { 
    id: 167,
    chinese: '但是', 
    pinyin: 'dànshì', 
    thai: 'แต่',
    sentence: '我想去，但是没时间。',
    sentence_th: 'ฉันอยากไป แต่ไม่มีเวลา'
  },
  { 
    id: 168,
    chinese: '到', 
    pinyin: 'dào', 
    thai: 'ถึง',
    sentence: '我们到学校了。',
    sentence_th: 'เรามาถึงโรงเรียนแล้ว'
  },
  { 
    id: 169,
    chinese: '得', 
    pinyin: 'de', 
    thai: 'ได้',
    sentence: '他跑得很快。',
    sentence_th: 'เขาวิ่งได้เร็ว'
  },
  { 
    id: 170,
    chinese: '等', 
    pinyin: 'děng', 
    thai: 'รอ',
    sentence: '请等一下。',
    sentence_th: 'กรุณารอสักครู่'
  },
  { 
    id: 171,
    chinese: '弟弟', 
    pinyin: 'dìdi', 
    thai: 'น้องชาย',
    sentence: '我弟弟十岁。',
    sentence_th: 'น้องชายฉันสิบขวบ'
  },
  { 
    id: 172,
    chinese: '第一', 
    pinyin: 'dì-yī', 
    thai: 'ที่หนึ่ง',
    sentence: '他是第一名。',
    sentence_th: 'เขาเป็นที่หนึ่ง'
  },
  { 
    id: 173,
    chinese: '懂', 
    pinyin: 'dǒng', 
    thai: 'เข้าใจ',
    sentence: '我听懂了。',
    sentence_th: 'ฉันฟังเข้าใจแล้ว'
  },
  { 
    id: 174,
    chinese: '对', 
    pinyin: 'duì', 
    thai: 'ถูก, คู่',
    sentence: '你的答案对。',
    sentence_th: 'คำตอบของคุณถูก'
  },
  { 
    id: 175,
    chinese: '房间', 
    pinyin: 'fángjiān', 
    thai: 'ห้อง',
    sentence: '这个房间很大。',
    sentence_th: 'ห้องนี้ใหญ่'
  },
  { 
    id: 176,
    chinese: '非常', 
    pinyin: 'fēicháng', 
    thai: 'มาก, ยิ่ง',
    sentence: '非常感谢。',
    sentence_th: 'ขอบคุณมาก'
  },
  { 
    id: 177,
    chinese: '服务员', 
    pinyin: 'fúwùyuán', 
    thai: 'พนักงานบริการ',
    sentence: '服务员，请来一下。',
    sentence_th: 'พนักงานคะ/ครับ ขอมาหน่อย'
  },
  { 
    id: 178,
    chinese: '告诉', 
    pinyin: 'gàosu', 
    thai: 'บอก',
    sentence: '请告诉我。',
    sentence_th: 'กรุณาบอกฉัน'
  },
  { 
    id: 179,
    chinese: '哥哥', 
    pinyin: 'gēge', 
    thai: 'พี่ชาย',
    sentence: '我哥哥是老师。',
    sentence_th: 'พี่ชายฉันเป็นครู'
  },
  { 
    id: 180,
    chinese: '给', 
    pinyin: 'gěi', 
    thai: 'ให้',
    sentence: '我给你一本书。',
    sentence_th: 'ฉันให้หนังสือคุณหนึ่งเล่ม'
  },
  { 
    id: 181,
    chinese: '公共汽车', 
    pinyin: 'gōnggòng qìchē', 
    thai: 'รถเมล์',
    sentence: '我坐公共汽车上班。',
    sentence_th: 'ฉันนั่งรถเมล์ไปทำงาน'
  },
  { 
    id: 182,
    chinese: '公司', 
    pinyin: 'gōngsī', 
    thai: 'บริษัท',
    sentence: '我在公司工作。',
    sentence_th: 'ฉันทำงานที่บริษัท'
  },
  { 
    id: 183,
    chinese: '贵', 
    pinyin: 'guì', 
    thai: 'แพง',
    sentence: '这个东西太贵了。',
    sentence_th: 'สิ่งนี้แพงเกินไป'
  },
  { 
    id: 184,
    chinese: '过', 
    pinyin: 'guò', 
    thai: 'ผ่าน',
    sentence: '我去过中国。',
    sentence_th: 'ฉันเคยไปจีน'
  },
  { 
    id: 185,
    chinese: '还', 
    pinyin: 'hái', 
    thai: 'ยัง',
    sentence: '我还没吃饭。',
    sentence_th: 'ฉันยังไม่ได้กินข้าว'
  },
  { 
    id: 186,
    chinese: '还是', 
    pinyin: 'háishì', 
    thai: 'หรือ',
    sentence: '你去还是我去？',
    sentence_th: 'คุณไปหรือฉันไป'
  },
  { 
    id: 187,
    chinese: '孩子', 
    pinyin: 'háizi', 
    thai: 'เด็ก',
    sentence: '孩子们在玩。',
    sentence_th: 'เด็กๆกำลังเล่น'
  },
  { 
    id: 188,
    chinese: '好吃', 
    pinyin: 'hǎochī', 
    thai: 'อร่อย',
    sentence: '这个菜很好吃。',
    sentence_th: 'อาหารจานนี้อร่อย'
  },
  { 
    id: 189,
    chinese: '黑', 
    pinyin: 'hēi', 
    thai: 'ดำ',
    sentence: '他穿着黑衣服。',
    sentence_th: 'เขาใส่เสื้อสีดำ'
  },
  { 
    id: 190,
    chinese: '红', 
    pinyin: 'hóng', 
    thai: 'แดง',
    sentence: '我喜欢红苹果。',
    sentence_th: 'ฉันชอบแอปเปิ้ลสีแดง'
  },
  { 
    id: 191,
    chinese: '火车站', 
    pinyin: 'huǒchēzhàn', 
    thai: 'สถานีรถไฟ',
    sentence: '火车站在那边。',
    sentence_th: 'สถานีรถไฟอยู่ทางโน้น'
  },
  { 
    id: 192,
    chinese: '机场', 
    pinyin: 'jīchǎng', 
    thai: 'สนามบิน',
    sentence: '我去机场送朋友。',
    sentence_th: 'ฉันไปส่งเพื่อนที่สนามบิน'
  },
  { 
    id: 193,
    chinese: '鸡蛋', 
    pinyin: 'jīdàn', 
    thai: 'ไข่',
    sentence: '早上我吃鸡蛋。',
    sentence_th: 'ตอนเช้าฉันกินไข่'
  },
  { 
    id: 194,
    chinese: '件', 
    pinyin: 'jiàn', 
    thai: 'ชิ้น, ตัว',
    sentence: '这件衣服很漂亮。',
    sentence_th: 'เสื้อตัวนี้สวยมาก'
  },
  { 
    id: 195,
    chinese: '教室', 
    pinyin: 'jiàoshì', 
    thai: 'ห้องเรียน',
    sentence: '我们在教室学习。',
    sentence_th: 'เราเรียนในห้องเรียน'
  },
  { 
    id: 196,
    chinese: '姐姐', 
    pinyin: 'jiějie', 
    thai: 'พี่สาว',
    sentence: '我姐姐是医生。',
    sentence_th: 'พี่สาวฉันเป็นหมอ'
  },
  { 
    id: 197,
    chinese: '介绍', 
    pinyin: 'jièshào', 
    thai: 'แนะนำ',
    sentence: '我介绍一下。',
    sentence_th: 'ฉันขอแนะนำ'
  },
  { 
    id: 198,
    chinese: '进', 
    pinyin: 'jìn', 
    thai: 'เข้า',
    sentence: '请进来。',
    sentence_th: 'เชิญเข้ามา'
  },
  { 
    id: 199,
    chinese: '近', 
    pinyin: 'jìn', 
    thai: 'ใกล้',
    sentence: '学校很近。',
    sentence_th: 'โรงเรียนใกล้มาก'
  },
  { 
    id: 200,
    chinese: '就', 
    pinyin: 'jiù', 
    thai: 'ก็',
    sentence: '我马上就来了。',
    sentence_th: 'ฉันจะมาเดี๋ยวนี้'
  },
  { 
    id: 201,
    chinese: '觉得', 
    pinyin: 'juéde', 
    thai: 'รู้สึก',
    sentence: '我觉得很冷。',
    sentence_th: 'ฉันรู้สึกหนาว'
  },
  { 
    id: 202,
    chinese: '咖啡', 
    pinyin: 'kāfēi', 
    thai: 'กาแฟ',
    sentence: '我喜欢喝咖啡。',
    sentence_th: 'ฉันชอบดื่มกาแฟ'
  },
  { 
    id: 203,
    chinese: '开始', 
    pinyin: 'kāishǐ', 
    thai: 'เริ่ม',
    sentence: '现在开始上课。',
    sentence_th: 'ตอนนี้เริ่มเรียน'
  },
  { 
    id: 204,
    chinese: '考试', 
    pinyin: 'kǎoshì', 
    thai: 'สอบ',
    sentence: '明天有考试。',
    sentence_th: 'พรุ่งนี้มีการสอบ'
  },
  { 
    id: 205,
    chinese: '可能', 
    pinyin: 'kěnéng', 
    thai: 'อาจจะ',
    sentence: '他可能不来。',
    sentence_th: 'เขาอาจจะไม่มา'
  },
  { 
    id: 206,
    chinese: '可以', 
    pinyin: 'kěyǐ', 
    thai: 'ได้',
    sentence: '我可以进来吗？',
    sentence_th: 'ฉันเข้าได้ไหม'
  },
  { 
    id: 207,
    chinese: '快', 
    pinyin: 'kuài', 
    thai: 'เร็ว',
    sentence: '他跑得很快。',
    sentence_th: 'เขาวิ่งเร็ว'
  },
  { 
    id: 208,
    chinese: '快乐', 
    pinyin: 'kuàilè', 
    thai: 'มีความสุข',
    sentence: '生日快乐！',
    sentence_th: 'สุขสันต์วันเกิด'
  },
  { 
    id: 209,
    chinese: '累', 
    pinyin: 'lèi', 
    thai: 'เหนื่อย',
    sentence: '今天我很累。',
    sentence_th: 'วันนี้ฉันเหนื่อยมาก'
  },
  { 
    id: 210,
    chinese: '离开', 
    pinyin: 'líkāi', 
    thai: 'จากไป',
    sentence: '他离开了这里。',
    sentence_th: 'เขาจากไปจากที่นี่'
  },
  { 
    id: 211,
    chinese: '两', 
    pinyin: 'liǎng', 
    thai: 'สอง',
    sentence: '我有两个苹果。',
    sentence_th: 'ฉันมีแอปเปิ้ลสองผล'
  },
  { 
    id: 212,
    chinese: '零', 
    pinyin: 'líng', 
    thai: 'ศูนย์',
    sentence: '现在是零点。',
    sentence_th: 'ตอนนี้เวลา 0 นาฬิกา'
  },
  { 
    id: 213,
    chinese: '路', 
    pinyin: 'lù', 
    thai: 'ถนน',
    sentence: '这条路很长。',
    sentence_th: 'ถนนเส้นนี้ยาว'
  },
  { 
    id: 214,
    chinese: '旅游', 
    pinyin: 'lǚyóu', 
    thai: 'ท่องเที่ยว',
    sentence: '我喜欢旅游。',
    sentence_th: 'ฉันชอบท่องเที่ยว'
  },
  { 
    id: 215,
    chinese: '卖', 
    pinyin: 'mài', 
    thai: 'ขาย',
    sentence: '这个商店卖水果。',
    sentence_th: 'ร้านนี้ขายผลไม้'
  },
  { 
    id: 216,
    chinese: '慢', 
    pinyin: 'màn', 
    thai: 'ช้า',
    sentence: '他走得很慢。',
    sentence_th: 'เขาเดินช้ามาก'
  },
  { 
    id: 217,
    chinese: '忙', 
    pinyin: 'máng', 
    thai: 'ยุ่ง',
    sentence: '我今天很忙。',
    sentence_th: 'วันนี้ฉันยุ่งมาก'
  },
  { 
    id: 218,
    chinese: '每', 
    pinyin: 'měi', 
    thai: 'ทุก',
    sentence: '我每天去学校。',
    sentence_th: 'ฉันไปโรงเรียนทุกวัน'
  },
  { 
    id: 219,
    chinese: '妹妹', 
    pinyin: 'mèimei', 
    thai: 'น้องสาว',
    sentence: '我妹妹很可爱。',
    sentence_th: 'น้องสาวฉันน่ารัก'
  },
  { 
    id: 220,
    chinese: '门', 
    pinyin: 'mén', 
    thai: 'ประตู',
    sentence: '请关门。',
    sentence_th: 'กรุณาปิดประตู'
  },
  { 
    id: 221,
    chinese: '面包', 
    pinyin: 'miànbāo', 
    thai: 'ขนมปัง',
    sentence: '早上我吃面包。',
    sentence_th: 'ตอนเช้าฉันกินขนมปัง'
  },
  { 
    id: 222,
    chinese: '牛奶', 
    pinyin: 'niúnǎi', 
    thai: 'นม',
    sentence: '我喝牛奶。',
    sentence_th: 'ฉันดื่มนม'
  },
  { 
    id: 223,
    chinese: '男', 
    pinyin: 'nán', 
    thai: 'ชาย',
    sentence: '他是男的。',
    sentence_th: 'เขาเป็นผู้ชาย'
  },
  { 
    id: 224,
    chinese: '难', 
    pinyin: 'nán', 
    thai: 'ยาก',
    sentence: '这个考试很难。',
    sentence_th: 'การสอบนี้ยาก'
  },
  { 
    id: 225,
    chinese: '鸟', 
    pinyin: 'niǎo', 
    thai: 'นก',
    sentence: '天上有鸟在飞。',
    sentence_th: 'นกกำลังบินบนฟ้า'
  },
  { 
    id: 226,
    chinese: '女', 
    pinyin: 'nǚ', 
    thai: 'หญิง',
    sentence: '她是女的。',
    sentence_th: 'เธอเป็นผู้หญิง'
  },
  { 
    id: 227,
    chinese: '旁边', 
    pinyin: 'pángbiān', 
    thai: 'ข้างๆ',
    sentence: '学校旁边有商店。',
    sentence_th: 'ข้างๆโรงเรียนมีร้านค้า'
  },
  { 
    id: 228,
    chinese: '跑步', 
    pinyin: 'pǎobù', 
    thai: 'วิ่ง',
    sentence: '他每天跑步。',
    sentence_th: 'เขาวิ่งทุกวัน'
  },
  { 
    id: 229,
    chinese: '便宜', 
    pinyin: 'piányi', 
    thai: 'ถูก',
    sentence: '这个很便宜。',
    sentence_th: 'อันนี้ถูกมาก'
  },
  { 
    id: 230,
    chinese: '票', 
    pinyin: 'piào', 
    thai: 'ตั๋ว',
    sentence: '我买了一张电影票。',
    sentence_th: 'ฉันซื้อตั๋วหนังหนึ่งใบ'
  },
  { 
    id: 231,
    chinese: '妻子', 
    pinyin: 'qīzi', 
    thai: 'ภรรยา',
    sentence: '他妻子是老师。',
    sentence_th: 'ภรรยาเขาเป็นครู'
  },
  { 
    id: 232,
    chinese: '起床', 
    pinyin: 'qǐchuáng', 
    thai: 'ตื่นนอน',
    sentence: '我每天六点起床。',
    sentence_th: 'ฉันตื่นนอนทุกวัน 6 โมง'
  },
  { 
    id: 233,
    chinese: '千', 
    pinyin: 'qiān', 
    thai: 'พัน',
    sentence: '这本书一千块钱。',
    sentence_th: 'หนังสือเล่มนี้หนึ่งพันหยวน'
  },
  { 
    id: 234,
    chinese: '铅笔', 
    pinyin: 'qiānbǐ', 
    thai: 'ดินสอ',
    sentence: '我用铅笔写字。',
    sentence_th: 'ฉันใช้ดินสอเขียนหนังสือ'
  },
  { 
    id: 235,
    chinese: '晴', 
    pinyin: 'qíng', 
    thai: 'แดดออก',
    sentence: '今天天气晴。',
    sentence_th: 'วันนี้อากาศแจ่มใส'
  },
  { 
    id: 236,
    chinese: '去年', 
    pinyin: 'qùnián', 
    thai: 'ปีที่แล้ว',
    sentence: '去年我去过中国。',
    sentence_th: 'ปีที่แล้วฉันเคยไปจีน'
  },
  { 
    id: 237,
    chinese: '让', 
    pinyin: 'ràng', 
    thai: 'ให้',
    sentence: '让我看看。',
    sentence_th: 'ให้ฉันดูหน่อย'
  },
  { 
    id: 238,
    chinese: '日', 
    pinyin: 'rì', 
    thai: 'วัน',
    sentence: '今日是星期一。',
    sentence_th: 'วันนี้วันจันทร์'
  },
  { 
    id: 239,
    chinese: '上班', 
    pinyin: 'shàngbān', 
    thai: 'ไปทำงาน',
    sentence: '我八点上班。',
    sentence_th: 'ฉันไปทำงาน 8 โมง'
  },
  { 
    id: 240,
    chinese: '身体', 
    pinyin: 'shēntǐ', 
    thai: 'ร่างกาย',
    sentence: '你要注意身体。',
    sentence_th: 'คุณต้องดูแลร่างกาย'
  },
  { 
    id: 241,
    chinese: '生病', 
    pinyin: 'shēngbìng', 
    thai: 'ป่วย',
    sentence: '他生病了。',
    sentence_th: 'เขาป่วย'
  },
  { 
    id: 242,
    chinese: '生日', 
    pinyin: 'shēngrì', 
    thai: 'วันเกิด',
    sentence: '今天是我的生日。',
    sentence_th: 'วันนี้เป็นวันเกิดฉัน'
  },
  { 
    id: 243,
    chinese: '时间', 
    pinyin: 'shíjiān', 
    thai: 'เวลา',
    sentence: '现在是什么时间？',
    sentence_th: 'ตอนนี้เวลาเท่าไหร่'
  },
  { 
    id: 244,
    chinese: '事情', 
    pinyin: 'shìqing', 
    thai: 'เรื่อง',
    sentence: '我有一件事情告诉你。',
    sentence_th: 'ฉันมีเรื่องจะบอกคุณ'
  },
  { 
    id: 245,
    chinese: '手表', 
    pinyin: 'shǒubiǎo', 
    thai: 'นาฬิกาข้อมือ',
    sentence: '我的手表很漂亮。',
    sentence_th: 'นาฬิกาของฉันสวยมาก'
  },
  { 
    id: 246,
    chinese: '手机', 
    pinyin: 'shǒujī', 
    thai: 'มือถือ',
    sentence: '我用手机打电话。',
    sentence_th: 'ฉันใช้มือถือโทรศัพท์'
  },
  { 
    id: 247,
    chinese: '送', 
    pinyin: 'sòng', 
    thai: 'ส่ง',
    sentence: '我送你去机场。',
    sentence_th: 'ฉันส่งคุณไปสนามบิน'
  },
  { 
    id: 248,
    chinese: '虽然', 
    pinyin: 'suīrán', 
    thai: 'ถึงแม้',
    sentence: '虽然很累，但是我很高兴。',
    sentence_th: 'ถึงแม้จะเหนื่อย แต่ฉันก็ดีใจ'
  },
  { 
    id: 249,
    chinese: '所以', 
    pinyin: 'suǒyǐ', 
    thai: 'ดังนั้น',
    sentence: '下雨了，所以我不去了。',
    sentence_th: 'ฝนตก ดังนั้นฉันไม่ไปแล้ว'
  },
  { 
    id: 250,
    chinese: '踢足球', 
    pinyin: 'tī zúqiú', 
    thai: 'เตะฟุตบอล',
    sentence: '他喜欢踢足球。',
    sentence_th: 'เขาชอบเตะฟุตบอล'
  },
  { 
    id: 251,
    chinese: '题', 
    pinyin: 'tí', 
    thai: 'โจทย์, คำถาม',
    sentence: '这道题很难。',
    sentence_th: 'โจทย์ข้อนี้ยาก'
  },
  { 
    id: 252,
    chinese: '跳舞', 
    pinyin: 'tiàowǔ', 
    thai: 'เต้นรำ',
    sentence: '她喜欢跳舞。',
    sentence_th: 'เธอชอบเต้นรำ'
  },
  { 
    id: 253,
    chinese: '外', 
    pinyin: 'wài', 
    thai: 'นอก',
    sentence: '他在外面。',
    sentence_th: 'เขาอยู่ข้างนอก'
  },
  { 
    id: 254,
    chinese: '完', 
    pinyin: 'wán', 
    thai: 'เสร็จ',
    sentence: '我做完了。',
    sentence_th: 'ฉันทำเสร็จแล้ว'
  },
  { 
    id: 255,
    chinese: '晚', 
    pinyin: 'wǎn', 
    thai: 'สาย',
    sentence: '今天我来晚了。',
    sentence_th: 'วันนี้ฉันมาสาย'
  },
  { 
    id: 256,
    chinese: '为什么', 
    pinyin: 'wèishénme', 
    thai: 'ทำไม',
    sentence: '你为什么不来？',
    sentence_th: 'ทำไมคุณไม่มา'
  },
  { 
    id: 257,
    chinese: '问', 
    pinyin: 'wèn', 
    thai: 'ถาม',
    sentence: '我问你一个问题。',
    sentence_th: 'ฉันถามคุณ一个问题'
  },
  { 
    id: 258,
    chinese: '问题', 
    pinyin: 'wèntí', 
    thai: 'ปัญหา',
    sentence: '没问题。',
    sentence_th: 'ไม่มีปัญหา'
  },
  { 
    id: 259,
    chinese: '西瓜', 
    pinyin: 'xīguā', 
    thai: 'แตงโม',
    sentence: '我想吃西瓜。',
    sentence_th: 'ฉันอยากกินแตงโม'
  },
  { 
    id: 260,
    chinese: '希望', 
    pinyin: 'xīwàng', 
    thai: 'หวัง',
    sentence: '我希望你快乐。',
    sentence_th: 'ฉันหวังให้คุณมีความสุข'
  },
  { 
    id: 261,
    chinese: '洗', 
    pinyin: 'xǐ', 
    thai: 'ล้าง',
    sentence: '我在洗手。',
    sentence_th: 'ฉันกำลังล้างมือ'
  },
  { 
    id: 262,
    chinese: '小时', 
    pinyin: 'xiǎoshí', 
    thai: 'ชั่วโมง',
    sentence: '我等了两个小时。',
    sentence_th: 'ฉันรอสองชั่วโมง'
  },
  { 
    id: 263,
    chinese: '笑', 
    pinyin: 'xiào', 
    thai: 'ยิ้ม, หัวเราะ',
    sentence: '她笑了。',
    sentence_th: 'เธอยิ้ม'
  },
  { 
    id: 264,
    chinese: '新', 
    pinyin: 'xīn', 
    thai: 'ใหม่',
    sentence: '我买了一辆新车。',
    sentence_th: 'ฉันซื้อรถใหม่คันหนึ่ง'
  },
  { 
    id: 265,
    chinese: '姓', 
    pinyin: 'xìng', 
    thai: 'นามสกุล',
    sentence: '我姓王。',
    sentence_th: 'ฉันนามสกุลหวัง'
  },
  { 
    id: 266,
    chinese: '休息', 
    pinyin: 'xiūxi', 
    thai: 'พักผ่อน',
    sentence: '我们休息一下。',
    sentence_th: 'เราพักผ่อนกันหน่อย'
  },
  { 
    id: 267,
    chinese: '雪', 
    pinyin: 'xuě', 
    thai: 'หิมะ',
    sentence: '今天下雪了。',
    sentence_th: 'วันนี้หิมะตก'
  },
  { 
    id: 268,
    chinese: '颜色', 
    pinyin: 'yánsè', 
    thai: 'สี',
    sentence: '我喜欢这个颜色。',
    sentence_th: 'ฉันชอบสีนี้'
  },
  { 
    id: 269,
    chinese: '眼睛', 
    pinyin: 'yǎnjīng', 
    thai: 'ตา',
    sentence: '她的眼睛很大。',
    sentence_th: 'ดวงตาเธอใหญ่'
  },
  { 
    id: 270,
    chinese: '羊肉', 
    pinyin: 'yángròu', 
    thai: 'เนื้อแกะ',
    sentence: '我不吃羊肉。',
    sentence_th: 'ฉันไม่กินเนื้อแกะ'
  },
  { 
    id: 271,
    chinese: '药', 
    pinyin: 'yào', 
    thai: 'ยา',
    sentence: '我吃药了。',
    sentence_th: 'ฉันกินยาแล้ว'
  },
  { 
    id: 272,
    chinese: '要', 
    pinyin: 'yào', 
    thai: 'ต้องการ',
    sentence: '我要去商店。',
    sentence_th: 'ฉันต้องการไปร้านค้า'
  },
  { 
    id: 273,
    chinese: '也', 
    pinyin: 'yě', 
    thai: 'ก็',
    sentence: '我也想去。',
    sentence_th: 'ฉันก็อยากไป'
  },
  { 
    id: 274,
    chinese: '爷爷', 
    pinyin: 'yéye', 
    thai: 'ปู่, ตา',
    sentence: '我爷爷七十岁了。',
    sentence_th: 'ปู่ฉันอายุเจ็ดสิบ'
  },
  { 
    id: 275,
    chinese: '一样', 
    pinyin: 'yíyàng', 
    thai: 'เหมือนกัน',
    sentence: '我们一样高。',
    sentence_th: 'เราสูงเท่ากัน'
  },
  { 
    id: 276,
    chinese: '已经', 
    pinyin: 'yǐjīng', 
    thai: 'แล้ว',
    sentence: '他已经来了。',
    sentence_th: 'เขามาแล้ว'
  },
  { 
    id: 277,
    chinese: '意思', 
    pinyin: 'yìsi', 
    thai: 'ความหมาย',
    sentence: '这个字是什么意思？',
    sentence_th: 'ตัวอักษรนี้หมายความว่าอะไร'
  },
  { 
    id: 278,
    chinese: '因为', 
    pinyin: 'yīnwèi', 
    thai: 'เพราะว่า',
    sentence: '因为下雨，所以我不去了。',
    sentence_th: 'เพราะว่าฝนตก ดังนั้นฉันไม่ไป'
  },
  { 
    id: 279,
    chinese: '阴', 
    pinyin: 'yīn', 
    thai: 'เมฆครึ้ม',
    sentence: '今天阴天。',
    sentence_th: 'วันนี้เมฆครึ้ม'
  },
  { 
    id: 280,
    chinese: '游泳', 
    pinyin: 'yóuyǒng', 
    thai: 'ว่ายน้ำ',
    sentence: '我会游泳。',
    sentence_th: 'ฉันว่ายน้ำเป็น'
  },
  { 
    id: 281,
    chinese: '右边', 
    pinyin: 'yòubiān', 
    thai: 'ขวา',
    sentence: '商店在右边。',
    sentence_th: 'ร้านค้าอยู่ทางขวา'
  },
  { 
    id: 282,
    chinese: '鱼', 
    pinyin: 'yú', 
    thai: 'ปลา',
    sentence: '我喜欢吃鱼。',
    sentence_th: 'ฉันชอบกินปลา'
  },
  { 
    id: 283,
    chinese: '远', 
    pinyin: 'yuǎn', 
    thai: 'ไกล',
    sentence: '学校很远。',
    sentence_th: 'โรงเรียนไกลมาก'
  },
  { 
    id: 284,
    chinese: '运动', 
    pinyin: 'yùndòng', 
    thai: 'ออกกำลังกาย',
    sentence: '我每天运动。',
    sentence_th: 'ฉันออกกำลังกายทุกวัน'
  },
  { 
    id: 285,
    chinese: '再', 
    pinyin: 'zài', 
    thai: 'อีกครั้ง',
    sentence: '请再说一遍。',
    sentence_th: 'กรุณาพูดอีกครั้ง'
  },
  { 
    id: 286,
    chinese: '早上', 
    pinyin: 'zǎoshang', 
    thai: 'ตอนเช้า',
    sentence: '早上好。',
    sentence_th: 'อรุณสวัสดิ์'
  },
  { 
    id: 287,
    chinese: '丈夫', 
    pinyin: 'zhàngfu', 
    thai: 'สามี',
    sentence: '她丈夫是老师。',
    sentence_th: 'สามีเธอเป็นครู'
  },
  { 
    id: 288,
    chinese: '找', 
    pinyin: 'zhǎo', 
    thai: 'หา',
    sentence: '我在找我的书。',
    sentence_th: 'ฉันกำลังหาหนังสือของฉัน'
  },
  { 
    id: 289,
    chinese: '着', 
    pinyin: 'zhe', 
    thai: 'กำลัง',
    sentence: '他看着电视。',
    sentence_th: 'เขากำลังดูทีวี'
  },
  { 
    id: 290,
    chinese: '真', 
    pinyin: 'zhēn', 
    thai: 'จริง',
    sentence: '你真漂亮。',
    sentence_th: 'คุณสวยจริงๆ'
  },
  { 
    id: 291,
    chinese: '正在', 
    pinyin: 'zhèngzài', 
    thai: 'กำลัง',
    sentence: '我正在吃饭。',
    sentence_th: 'ฉันกำลังกินข้าว'
  },
  { 
    id: 292,
    chinese: '知道', 
    pinyin: 'zhīdào', 
    thai: 'รู้',
    sentence: '我知道这件事。',
    sentence_th: 'ฉันรู้เรื่องนี้'
  },
  { 
    id: 293,
    chinese: '准备', 
    pinyin: 'zhǔnbèi', 
    thai: 'เตรียม',
    sentence: '我正在准备考试。',
    sentence_th: 'ฉันกำลังเตรียมสอบ'
  },
  { 
    id: 294,
    chinese: '走', 
    pinyin: 'zǒu', 
    thai: 'เดิน',
    sentence: '我走路去学校。',
    sentence_th: 'ฉันเดินไปโรงเรียน'
  },
  { 
    id: 295,
    chinese: '最', 
    pinyin: 'zuì', 
    thai: 'ที่สุด',
    sentence: '我最喜欢苹果。',
    sentence_th: 'ฉันชอบแอปเปิ้ลที่สุด'
  },
  { 
    id: 296,
    chinese: '昨天', 
    pinyin: 'zuótiān', 
    thai: 'เมื่อวาน',
    sentence: '昨天下雨了。',
    sentence_th: 'เมื่อวานฝนตก'
  },
  { 
    id: 297,
    chinese: '左边', 
    pinyin: 'zuǒbiān', 
    thai: 'ซ้าย',
    sentence: '商店在左边。',
    sentence_th: 'ร้านค้าอยู่ทางซ้าย'
  },
  { 
    id: 298,
    chinese: '座位', 
    pinyin: 'zuòwèi', 
    thai: 'ที่นั่ง',
    sentence: '请坐你的座位。',
    sentence_th: 'กรุณานั่งที่นั่งของคุณ'
  },
  { 
    id: 299,
    chinese: '把', 
    pinyin: 'bǎ', 
    thai: 'คำช่วย',
    sentence: '请把书给我。',
    sentence_th: 'กรุณาเอาหนังสือให้ฉัน'
  },
  { 
    id: 300,
    chinese: '被', 
    pinyin: 'bèi', 
    thai: 'ถูก',
    sentence: '杯子被他打破了。',
    sentence_th: 'แก้วถูกเขาทำแตก'
  }
  ];

  
export const hsk3 = [
  { 
    id: 301,
    chinese: '啊', 
    pinyin: 'a', 
    thai: 'อ้า, คำอุทาน',
    sentence: '啊！原来是你！',
    sentence_th: 'อ้า! ที่แท้ก็คุณนี่เอง'
  },
  { 
    id: 302,
    chinese: '阿姨', 
    pinyin: 'āyí', 
    thai: 'ป้า',
    sentence: '阿姨在做饭。',
    sentence_th: 'ป้ากำลังทำอาหาร'
  },
  { 
    id: 303,
    chinese: '矮', 
    pinyin: 'ǎi', 
    thai: 'เตี้ย',
    sentence: '他比我矮。',
    sentence_th: 'เขาเตี้ยกว่าฉัน'
  },
  { 
    id: 304,
    chinese: '爱好', 
    pinyin: 'àihào', 
    thai: 'งานอดิเรก',
    sentence: '你的爱好是什么？',
    sentence_th: 'งานอดิเรกของคุณคืออะไร'
  },
  { 
    id: 305,
    chinese: '安静', 
    pinyin: 'ānjìng', 
    thai: 'เงียบ',
    sentence: '请安静。',
    sentence_th: 'กรุณาเงียบๆ'
  },
  { 
    id: 306,
    chinese: '把', 
    pinyin: 'bǎ', 
    thai: 'คำช่วย',
    sentence: '请把书给我。',
    sentence_th: 'กรุณาเอาหนังสือให้ฉัน'
  },
  { 
    id: 307,
    chinese: '班', 
    pinyin: 'bān', 
    thai: 'ชั้น, ห้อง',
    sentence: '我们班有二十个学生。',
    sentence_th: 'ห้องเรามีนักเรียนยี่สิบคน'
  },
  { 
    id: 308,
    chinese: '搬', 
    pinyin: 'bān', 
    thai: 'ย้าย',
    sentence: '我搬家了。',
    sentence_th: 'ฉันย้ายบ้านแล้ว'
  },
  { 
    id: 309,
    chinese: '办法', 
    pinyin: 'bànfǎ', 
    thai: 'วิธี',
    sentence: '我有办法解决这个问题。',
    sentence_th: 'ฉันมีวิธีแก้ปัญหานี้'
  },
  { 
    id: 310,
    chinese: '办公室', 
    pinyin: 'bàngōngshì', 
    thai: 'ห้องทำงาน',
    sentence: '他在办公室工作。',
    sentence_th: 'เขาทำงานในห้องทำงาน'
  },
  { 
    id: 311,
    chinese: '半', 
    pinyin: 'bàn', 
    thai: 'ครึ่ง',
    sentence: '现在是八点半。',
    sentence_th: 'ตอนนี้แปดโมงครึ่ง'
  },
  { 
    id: 312,
    chinese: '帮忙', 
    pinyin: 'bāngmáng', 
    thai: 'ช่วยเหลือ',
    sentence: '请帮个忙。',
    sentence_th: 'กรุณาช่วยหน่อย'
  },
  { 
    id: 313,
    chinese: '包', 
    pinyin: 'bāo', 
    thai: 'ห่อ, ถุง',
    sentence: '我买了一包糖。',
    sentence_th: 'ฉันซื้อขนมหนึ่งห่อ'
  },
  { 
    id: 314,
    chinese: '饱', 
    pinyin: 'bǎo', 
    thai: 'อิ่ม',
    sentence: '我吃饱了。',
    sentence_th: 'ฉันอิ่มแล้ว'
  },
  { 
    id: 315,
    chinese: '北方', 
    pinyin: 'běifāng', 
    thai: 'ภาคเหนือ',
    sentence: '北京在中国北方。',
    sentence_th: 'ปักกิ่งอยู่ทางเหนือของจีน'
  },
  { 
    id: 316,
    chinese: '被', 
    pinyin: 'bèi', 
    thai: 'ถูก',
    sentence: '杯子被他打破了。',
    sentence_th: 'แก้วถูกเขาทำแตก'
  },
  { 
    id: 317,
    chinese: '鼻子', 
    pinyin: 'bízi', 
    thai: 'จมูก',
    sentence: '他的鼻子很高。',
    sentence_th: 'จมูกเขาสูง'
  },
  { 
    id: 318,
    chinese: '比较', 
    pinyin: 'bǐjiào', 
    thai: 'ค่อนข้าง',
    sentence: '今天比较冷。',
    sentence_th: 'วันนี้ค่อนข้างหนาว'
  },
  { 
    id: 319,
    chinese: '比赛', 
    pinyin: 'bǐsài', 
    thai: 'แข่งขัน',
    sentence: '明天有足球比赛。',
    sentence_th: 'พรุ่งนี้มีการแข่งขันฟุตบอล'
  },
  { 
    id: 320,
    chinese: '必须', 
    pinyin: 'bìxū', 
    thai: 'ต้อง',
    sentence: '你必须来。',
    sentence_th: 'คุณต้องมา'
  },
  { 
    id: 321,
    chinese: '变化', 
    pinyin: 'biànhuà', 
    thai: 'เปลี่ยนแปลง',
    sentence: '这里变化很大。',
    sentence_th: 'ที่นี่เปลี่ยนแปลงมาก'
  },
  { 
    id: 322,
    chinese: '表示', 
    pinyin: 'biǎoshì', 
    thai: 'แสดง',
    sentence: '我表示同意。',
    sentence_th: 'ฉันแสดงความเห็นด้วย'
  },
  { 
    id: 323,
    chinese: '表演', 
    pinyin: 'biǎoyǎn', 
    thai: 'แสดง',
    sentence: '她表演得很好。',
    sentence_th: 'เธอแสดงได้ดีมาก'
  },
  { 
    id: 324,
    chinese: '别', 
    pinyin: 'bié', 
    thai: 'อื่น, อย่า',
    sentence: '别人都来了。',
    sentence_th: 'คนอื่นมากันหมดแล้ว'
  },
  { 
    id: 325,
    chinese: '别人', 
    pinyin: 'biérén', 
    thai: 'คนอื่น',
    sentence: '别人怎么说？',
    sentence_th: 'คนอื่นพูดว่าอย่างไร'
  },
  { 
    id: 326,
    chinese: '宾馆', 
    pinyin: 'bīnguǎn', 
    thai: 'โรงแรม',
    sentence: '我们住在宾馆里。',
    sentence_th: 'เราพักในโรงแรม'
  },
  { 
    id: 327,
    chinese: '冰箱', 
    pinyin: 'bīngxiāng', 
    thai: 'ตู้เย็น',
    sentence: '冰箱里有水果。',
    sentence_th: 'ในตู้เย็นมีผลไม้'
  },
  { 
    id: 328,
    chinese: '才', 
    pinyin: 'cái', 
    thai: 'เพิ่งจะ',
    sentence: '他才来。',
    sentence_th: 'เขาเพิ่งมา'
  },
  { 
    id: 329,
    chinese: '菜单', 
    pinyin: 'càidān', 
    thai: 'เมนู',
    sentence: '请给我菜单。',
    sentence_th: 'กรุณาเอาเมนูให้ฉัน'
  },
  { 
    id: 330,
    chinese: '参加', 
    pinyin: 'cānjiā', 
    thai: 'เข้าร่วม',
    sentence: '我想参加比赛。',
    sentence_th: 'ฉันอยากเข้าร่วมการแข่งขัน'
  },
  { 
    id: 331,
    chinese: '草', 
    pinyin: 'cǎo', 
    thai: 'หญ้า',
    sentence: '草是绿色的。',
    sentence_th: 'หญ้าเป็นสีเขียว'
  },
  { 
    id: 332,
    chinese: '层', 
    pinyin: 'céng', 
    thai: 'ชั้น',
    sentence: '我住在三层。',
    sentence_th: 'ฉันอยู่ชั้นสาม'
  },
  { 
    id: 333,
    chinese: '差', 
    pinyin: 'chà', 
    thai: 'ขาด',
    sentence: '差五分八点。',
    sentence_th: 'อีกห้านาทีจะแปดโมง'
  },
  { 
    id: 334,
    chinese: '超市', 
    pinyin: 'chāoshì', 
    thai: 'ซูเปอร์มาร์เก็ต',
    sentence: '我去超市买东西。',
    sentence_th: 'ฉันไปซื้อของที่ซูเปอร์'
  },
  { 
    id: 335,
    chinese: '衬衫', 
    pinyin: 'chènshān', 
    thai: 'เสื้อเชิ้ต',
    sentence: '这件衬衫很漂亮。',
    sentence_th: 'เสื้อเชิ้ตตัวนี้สวยมาก'
  },
  { 
    id: 336,
    chinese: '成绩', 
    pinyin: 'chéngjì', 
    thai: 'ผลการเรียน',
    sentence: '他的成绩很好。',
    sentence_th: 'ผลการเรียนของเขาดีมาก'
  },
  { 
    id: 337,
    chinese: '城市', 
    pinyin: 'chéngshì', 
    thai: 'เมือง',
    sentence: '上海是个大城市。',
    sentence_th: 'เซี่ยงไฮ้เป็นเมืองใหญ่'
  },
  { 
    id: 338,
    chinese: '迟到', 
    pinyin: 'chídào', 
    thai: 'มาสาย',
    sentence: '我迟到了。',
    sentence_th: 'ฉันมาสาย'
  },
  { 
    id: 339,
    chinese: '除了', 
    pinyin: 'chúle', 
    thai: 'ยกเว้น',
    sentence: '除了他，都来了。',
    sentence_th: 'ยกเว้นเขา มากันหมดแล้ว'
  },
  { 
    id: 340,
    chinese: '船', 
    pinyin: 'chuán', 
    thai: 'เรือ',
    sentence: '我们坐船去。',
    sentence_th: 'เรานั่งเรือไป'
  },
  { 
    id: 341,
    chinese: '春', 
    pinyin: 'chūn', 
    thai: 'ฤดูใบไม้ผลิ',
    sentence: '春天来了。',
    sentence_th: 'ฤดูใบไม้ผลิมาแล้ว'
  },
  { 
    id: 342,
    chinese: '词典', 
    pinyin: 'cídiǎn', 
    thai: 'พจนานุกรม',
    sentence: '这本词典很有用。',
    sentence_th: 'พจนานุกรมเล่มนี้มีประโยชน์มาก'
  },
  { 
    id: 343,
    chinese: '聪明', 
    pinyin: 'cōngming', 
    thai: 'ฉลาด',
    sentence: '他很聪明。',
    sentence_th: 'เขาฉลาดมาก'
  },
  { 
    id: 344,
    chinese: '打扫', 
    pinyin: 'dǎsǎo', 
    thai: 'ทำความสะอาด',
    sentence: '我在打扫房间。',
    sentence_th: 'ฉันกำลังทำความสะอาดห้อง'
  },
  { 
    id: 345,
    chinese: '打算', 
    pinyin: 'dǎsuàn', 
    thai: 'วางแผน',
    sentence: '我打算去中国。',
    sentence_th: 'ฉันวางแผนจะไปจีน'
  },
  { 
    id: 346,
    chinese: '带', 
    pinyin: 'dài', 
    thai: 'นำ, พา',
    sentence: '请带书来。',
    sentence_th: 'กรุณานำหนังสือมา'
  },
  { 
    id: 347,
    chinese: '担心', 
    pinyin: 'dānxīn', 
    thai: 'กังวล',
    sentence: '别担心。',
    sentence_th: 'ไม่ต้องกังวล'
  },
  { 
    id: 348,
    chinese: '蛋糕', 
    pinyin: 'dàngāo', 
    thai: 'เค้ก',
    sentence: '我喜欢吃蛋糕。',
    sentence_th: 'ฉันชอบกินเค้ก'
  },
  { 
    id: 349,
    chinese: '当然', 
    pinyin: 'dāngrán', 
    thai: 'แน่นอน',
    sentence: '我当然去。',
    sentence_th: 'ฉันไปแน่นอน'
  },
  { 
    id: 350,
    chinese: '地', 
    pinyin: 'de', 
    thai: 'อย่าง',
    sentence: '他高兴地笑了。',
    sentence_th: 'เขายิ้มอย่างมีความสุข'
  },
  { 
    id: 351,
    chinese: '灯', 
    pinyin: 'dēng', 
    thai: 'โคมไฟ',
    sentence: '请开灯。',
    sentence_th: 'กรุณาเปิดไฟ'
  },
  { 
    id: 352,
    chinese: '地铁', 
    pinyin: 'dìtiě', 
    thai: 'รถไฟฟ้า',
    sentence: '我坐地铁上班。',
    sentence_th: 'ฉันนั่งรถไฟฟ้าไปทำงาน'
  },
  { 
    id: 353,
    chinese: '地图', 
    pinyin: 'dìtú', 
    thai: 'แผนที่',
    sentence: '请给我一张地图。',
    sentence_th: 'กรุณาเอาแผนที่ให้ฉัน'
  },
  { 
    id: 354,
    chinese: '电梯', 
    pinyin: 'diàntī', 
    thai: 'ลิฟต์',
    sentence: '我们坐电梯上去。',
    sentence_th: 'เราขึ้นลิฟต์ไปข้างบน'
  },
  { 
    id: 355,
    chinese: '电子邮件', 
    pinyin: 'diànzǐ yóujiàn', 
    thai: 'อีเมล',
    sentence: '我发了一封电子邮件。',
    sentence_th: 'ฉันส่งอีเมลแล้ว'
  },
  { 
    id: 356,
    chinese: '东', 
    pinyin: 'dōng', 
    thai: 'ตะวันออก',
    sentence: '太阳从东方升起。',
    sentence_th: 'พระอาทิตย์ขึ้นทางตะวันออก'
  },
  { 
    id: 357,
    chinese: '冬', 
    pinyin: 'dōng', 
    thai: 'ฤดูหนาว',
    sentence: '冬天很冷。',
    sentence_th: 'ฤดูหนาวหนาวมาก'
  },
  { 
    id: 358,
    chinese: '动物', 
    pinyin: 'dòngwù', 
    thai: 'สัตว์',
    sentence: '我喜欢动物。',
    sentence_th: 'ฉันชอบสัตว์'
  },
  { 
    id: 359,
    chinese: '短', 
    pinyin: 'duǎn', 
    thai: 'สั้น',
    sentence: '这条裙子太短了。',
    sentence_th: 'กระโปรงตัวนี้สั้นเกินไป'
  },
  { 
    id: 360,
    chinese: '段', 
    pinyin: 'duàn', 
    thai: 'ช่วง',
    sentence: '这段时间我很忙。',
    sentence_th: 'ช่วงนี้ฉันยุ่งมาก'
  },
  { 
    id: 361,
    chinese: '对', 
    pinyin: 'duì', 
    thai: 'คู่',
    sentence: '他们是一对。',
    sentence_th: 'พวกเขาเป็นคู่กัน'
  },
  { 
    id: 362,
    chinese: '对话', 
    pinyin: 'duìhuà', 
    thai: 'บทสนทนา',
    sentence: '我们对话吧。',
    sentence_th: 'เราคุยกันเถอะ'
  },
  { 
    id: 363,
    chinese: '饿', 
    pinyin: 'è', 
    thai: 'หิว',
    sentence: '我饿了。',
    sentence_th: 'ฉันหิว'
  },
  { 
    id: 364,
    chinese: '而且', 
    pinyin: 'érqiě', 
    thai: 'และ',
    sentence: '他很聪明而且很努力。',
    sentence_th: 'เขาฉลาดและขยัน'
  },
  { 
    id: 365,
    chinese: '耳朵', 
    pinyin: 'ěrduo', 
    thai: 'หู',
    sentence: '他的耳朵很大。',
    sentence_th: 'หูเขาใหญ่'
  },
  { 
    id: 366,
    chinese: '发', 
    pinyin: 'fā', 
    thai: 'ส่ง',
    sentence: '我发了一封信。',
    sentence_th: 'ฉันส่งจดหมายแล้ว'
  },
  { 
    id: 367,
    chinese: '发烧', 
    pinyin: 'fāshāo', 
    thai: 'เป็นไข้',
    sentence: '我发烧了。',
    sentence_th: 'ฉันเป็นไข้'
  },
  { 
    id: 368,
    chinese: '发现', 
    pinyin: 'fāxiàn', 
    thai: 'ค้นพบ',
    sentence: '我发现了一个秘密。',
    sentence_th: 'ฉันค้นพบความลับ'
  },
  { 
    id: 369,
    chinese: '方便', 
    pinyin: 'fāngbiàn', 
    thai: 'สะดวก',
    sentence: '这里交通很方便。',
    sentence_th: 'ที่นี่การคมนาคมสะดวกมาก'
  },
  { 
    id: 370,
    chinese: '放', 
    pinyin: 'fàng', 
    thai: 'วาง',
    sentence: '请放这里。',
    sentence_th: 'กรุณาวางที่นี่'
  },
  { 
    id: 371,
    chinese: '放心', 
    pinyin: 'fàngxīn', 
    thai: 'วางใจ',
    sentence: '你放心，我会来的。',
    sentence_th: 'คุณวางใจได้ ฉันจะมา'
  },
  { 
    id: 372,
    chinese: '分', 
    pinyin: 'fēn', 
    thai: 'นาที',
    sentence: '现在三点五分。',
    sentence_th: 'ตอนนี้สามโมงห้านาที'
  },
  { 
    id: 373,
    chinese: '附近', 
    pinyin: 'fùjìn', 
    thai: 'ใกล้ๆ',
    sentence: '学校在附近。',
    sentence_th: 'โรงเรียนอยู่ใกล้ๆ'
  },
  { 
    id: 374,
    chinese: '复习', 
    pinyin: 'fùxí', 
    thai: 'ทบทวน',
    sentence: '我在复习功课。',
    sentence_th: 'ฉันกำลังทบทวนบทเรียน'
  },
  { 
    id: 375,
    chinese: '干净', 
    pinyin: 'gānjìng', 
    thai: 'สะอาด',
    sentence: '房间很干净。',
    sentence_th: 'ห้องสะอาดมาก'
  },
  { 
    id: 376,
    chinese: '感冒', 
    pinyin: 'gǎnmào', 
    thai: 'เป็นหวัด',
    sentence: '我感冒了。',
    sentence_th: 'ฉันเป็นหวัด'
  },
  { 
    id: 377,
    chinese: '刚才', 
    pinyin: 'gāngcái', 
    thai: 'เมื่อกี้',
    sentence: '他刚才来了。',
    sentence_th: 'เขาเพิ่งมาเมื่อกี้'
  },
  { 
    id: 378,
    chinese: '高', 
    pinyin: 'gāo', 
    thai: 'สูง',
    sentence: '他很高。',
    sentence_th: 'เขาสูง'
  },
  { 
    id: 379,
    chinese: '告诉', 
    pinyin: 'gàosu', 
    thai: 'บอก',
    sentence: '请告诉我。',
    sentence_th: 'กรุณาบอกฉัน'
  },
  { 
    id: 380,
    chinese: '哥哥', 
    pinyin: 'gēge', 
    thai: 'พี่ชาย',
    sentence: '我哥哥是老师。',
    sentence_th: 'พี่ชายฉันเป็นครู'
  },
  { 
    id: 381,
    chinese: '歌', 
    pinyin: 'gē', 
    thai: 'เพลง',
    sentence: '我喜欢这首歌。',
    sentence_th: 'ฉันชอบเพลงนี้'
  },
  { 
    id: 382,
    chinese: '故事', 
    pinyin: 'gùshi', 
    thai: 'เรื่องราว',
    sentence: '讲个故事吧。',
    sentence_th: 'เล่าเรื่องหน่อย'
  },
  { 
    id: 383,
    chinese: '刮风', 
    pinyin: 'guāfēng', 
    thai: 'ลมพัด',
    sentence: '今天刮风了。',
    sentence_th: 'วันนี้ลมพัด'
  },
  { 
    id: 384,
    chinese: '关', 
    pinyin: 'guān', 
    thai: 'ปิด',
    sentence: '请关门。',
    sentence_th: 'กรุณาปิดประตู'
  },
  { 
    id: 385,
    chinese: '关系', 
    pinyin: 'guānxi', 
    thai: 'ความสัมพันธ์',
    sentence: '我们关系很好。',
    sentence_th: 'เรามีความสัมพันธ์ที่ดี'
  },
  { 
    id: 386,
    chinese: '关心', 
    pinyin: 'guānxīn', 
    thai: 'ใส่ใจ',
    sentence: '谢谢你的关心。',
    sentence_th: 'ขอบคุณที่ใส่ใจ'
  },
  { 
    id: 387,
    chinese: '关于', 
    pinyin: 'guānyú', 
    thai: 'เกี่ยวกับ',
    sentence: '关于这个问题，我们讨论一下。',
    sentence_th: 'เกี่ยวกับปัญหานี้ เรามาคุยกัน'
  },
  { 
    id: 388,
    chinese: '国家', 
    pinyin: 'guójiā', 
    thai: 'ประเทศ',
    sentence: '我爱我的国家。',
    sentence_th: 'ฉันรักประเทศของฉัน'
  },
  { 
    id: 389,
    chinese: '过去', 
    pinyin: 'guòqù', 
    thai: 'อดีต',
    sentence: '过去的事情不要再想。',
    sentence_th: 'เรื่องในอดีตอย่าคิดถึงอีก'
  },
  { 
    id: 390,
    chinese: '还', 
    pinyin: 'hái', 
    thai: 'ยัง',
    sentence: '他还没来。',
    sentence_th: 'เขายังไม่มา'
  },
  { 
    id: 391,
    chinese: '还是', 
    pinyin: 'háishì', 
    thai: 'หรือ',
    sentence: '你去还是我去？',
    sentence_th: 'คุณไปหรือฉันไป'
  },
  { 
    id: 392,
    chinese: '害怕', 
    pinyin: 'hàipà', 
    thai: 'กลัว',
    sentence: '我害怕狗。',
    sentence_th: 'ฉันกลัวหมา'
  },
  { 
    id: 393,
    chinese: '好吃', 
    pinyin: 'hǎochī', 
    thai: 'อร่อย',
    sentence: '这个菜很好吃。',
    sentence_th: 'อาหารจานนี้อร่อย'
  },
  { 
    id: 394,
    chinese: '黑', 
    pinyin: 'hēi', 
    thai: 'ดำ',
    sentence: '他穿着黑衣服。',
    sentence_th: 'เขาใส่เสื้อสีดำ'
  },
  { 
    id: 395,
    chinese: '红', 
    pinyin: 'hóng', 
    thai: 'แดง',
    sentence: '我喜欢红玫瑰。',
    sentence_th: 'ฉันชอบกุหลาบแดง'
  },
  { 
    id: 396,
    chinese: '花', 
    pinyin: 'huā', 
    thai: 'ดอกไม้',
    sentence: '这些花很漂亮。',
    sentence_th: 'ดอกไม้เหล่านี้สวยมาก'
  },
  { 
    id: 397,
    chinese: '画', 
    pinyin: 'huà', 
    thai: 'วาด',
    sentence: '他在画一幅画。',
    sentence_th: 'เขากำลังวาดรูป'
  },
  { 
    id: 398,
    chinese: '坏', 
    pinyin: 'huài', 
    thai: 'เสีย',
    sentence: '我的手机坏了。',
    sentence_th: 'มือถือฉันเสีย'
  },
  { 
    id: 399,
    chinese: '欢迎', 
    pinyin: 'huānyíng', 
    thai: 'ต้อนรับ',
    sentence: '欢迎来中国。',
    sentence_th: 'ยินดีต้อนรับสู่จีน'
  },
  { 
    id: 400,
    chinese: '还', 
    pinyin: 'huán', 
    thai: 'คืน',
    sentence: '请还我书。',
    sentence_th: 'กรุณาคืนหนังสือฉัน'
  },
  { 
    id: 401,
    chinese: '换', 
    pinyin: 'huàn', 
    thai: 'เปลี่ยน',
    sentence: '我想换座位。',
    sentence_th: 'ฉันอยากเปลี่ยนที่นั่ง'
  },
  { 
    id: 402,
    chinese: '黄河', 
    pinyin: 'huánghé', 
    thai: 'แม่น้ำเหลือง',
    sentence: '黄河是中国第二长河。',
    sentence_th: 'แม่น้ำเหลืองเป็นแม่น้ำยาวอันดับสองของจีน'
  },
  { 
    id: 403,
    chinese: '回答', 
    pinyin: 'huídá', 
    thai: 'ตอบ',
    sentence: '请回答我的问题。',
    sentence_th: 'กรุณาตอบคำถามฉัน'
  },
  { 
    id: 404,
    chinese: '回忆', 
    pinyin: 'huíyì', 
    thai: 'ความทรงจำ',
    sentence: '回忆过去。',
    sentence_th: 'ระลึกถึงอดีต'
  },
  { 
    id: 405,
    chinese: '会', 
    pinyin: 'huì', 
    thai: 'จะ',
    sentence: '明天会下雨。',
    sentence_th: 'พรุ่งนี้ฝนจะตก'
  },
  { 
    id: 406,
    chinese: '或者', 
    pinyin: 'huòzhě', 
    thai: 'หรือ',
    sentence: '你或者我都可以。',
    sentence_th: 'คุณหรือฉันก็ได้'
  },
  { 
    id: 407,
    chinese: '机场', 
    pinyin: 'jīchǎng', 
    thai: 'สนามบิน',
    sentence: '我去机场送朋友。',
    sentence_th: 'ฉันไปส่งเพื่อนที่สนามบิน'
  },
  { 
    id: 408,
    chinese: '机会', 
    pinyin: 'jīhuì', 
    thai: 'โอกาส',
    sentence: '这是个好机会。',
    sentence_th: 'นี่เป็นโอกาสดี'
  },
  { 
    id: 409,
    chinese: '机器', 
    pinyin: 'jīqì', 
    thai: 'เครื่องจักร',
    sentence: '这台机器很好用。',
    sentence_th: 'เครื่องจักรนี้ใช้ดี'
  },
  { 
    id: 410,
    chinese: '鸡蛋', 
    pinyin: 'jīdàn', 
    thai: 'ไข่',
    sentence: '早上我吃鸡蛋。',
    sentence_th: 'ตอนเช้าฉันกินไข่'
  },
  { 
    id: 411,
    chinese: '极了', 
    pinyin: 'jíle', 
    thai: 'ที่สุด',
    sentence: '好极了！',
    sentence_th: 'ดีที่สุด!'
  },
  { 
    id: 412,
    chinese: '集合', 
    pinyin: 'jíhé', 
    thai: 'รวมตัว',
    sentence: '我们八点集合。',
    sentence_th: 'เรารวมตัวกันแปดโมง'
  },
  { 
    id: 413,
    chinese: '几', 
    pinyin: 'jǐ', 
    thai: 'กี่',
    sentence: '你有几个孩子？',
    sentence_th: 'คุณมีลูกกี่คน'
  },
  { 
    id: 414,
    chinese: '计划', 
    pinyin: 'jìhuà', 
    thai: 'แผนการ',
    sentence: '我有一个计划。',
    sentence_th: 'ฉันมีแผน'
  },
  { 
    id: 415,
    chinese: '记者', 
    pinyin: 'jìzhě', 
    thai: 'นักข่าว',
    sentence: '他是一名记者。',
    sentence_th: 'เขาเป็นนักข่าว'
  },
  { 
    id: 416,
    chinese: '季节', 
    pinyin: 'jìjié', 
    thai: 'ฤดูกาล',
    sentence: '我最喜欢的季节是春天。',
    sentence_th: 'ฤดูที่ฉันชอบที่สุดคือฤดูใบไม้ผลิ'
  },
  { 
    id: 417,
    chinese: '家', 
    pinyin: 'jiā', 
    thai: 'บ้าน',
    sentence: '我家在上海。',
    sentence_th: 'บ้านฉันอยู่เซี่ยงไฮ้'
  },
  { 
    id: 418,
    chinese: '坚持', 
    pinyin: 'jiānchí', 
    thai: 'อดทน',
    sentence: '坚持就是胜利。',
    sentence_th: 'ความอดทนนำไปสู่ชัยชนะ'
  },
  { 
    id: 419,
    chinese: '检查', 
    pinyin: 'jiǎnchá', 
    thai: 'ตรวจสอบ',
    sentence: '请检查一下。',
    sentence_th: 'กรุณาตรวจสอบหน่อย'
  },
  { 
    id: 420,
    chinese: '简单', 
    pinyin: 'jiǎndān', 
    thai: 'ง่าย',
    sentence: '这个问题很简单。',
    sentence_th: 'ปัญหานี้ง่ายมาก'
  },
  { 
    id: 421,
    chinese: '见', 
    pinyin: 'jiàn', 
    thai: 'พบ',
    sentence: '明天见。',
    sentence_th: 'เจอกันพรุ่งนี้'
  },
  { 
    id: 422,
    chinese: '件', 
    pinyin: 'jiàn', 
    thai: 'ชิ้น',
    sentence: '一件衣服',
    sentence_th: 'เสื้อผ้าหนึ่งตัว'
  },
  { 
    id: 423,
    chinese: '健康', 
    pinyin: 'jiànkāng', 
    thai: 'สุขภาพ',
    sentence: '祝你健康。',
    sentence_th: 'ขอให้คุณสุขภาพดี'
  },
  { 
    id: 424,
    chinese: '将来', 
    pinyin: 'jiānglái', 
    thai: 'อนาคต',
    sentence: '将来我想去中国。',
    sentence_th: 'อนาคตฉันอยากไปจีน'
  },
  { 
    id: 425,
    chinese: '讲', 
    pinyin: 'jiǎng', 
    thai: 'พูด',
    sentence: '讲一个故事。',
    sentence_th: 'เล่าเรื่องหน่อย'
  },
  { 
    id: 426,
    chinese: '饺子', 
    pinyin: 'jiǎozi', 
    thai: 'เกี๊ยว',
    sentence: '我喜欢吃饺子。',
    sentence_th: 'ฉันชอบกินเกี๊ยว'
  },
  { 
    id: 427,
    chinese: '脚', 
    pinyin: 'jiǎo', 
    thai: 'เท้า',
    sentence: '我的脚疼。',
    sentence_th: 'เท้าฉันเจ็บ'
  },
  { 
    id: 428,
    chinese: '叫', 
    pinyin: 'jiào', 
    thai: 'เรียก',
    sentence: '我叫李明。',
    sentence_th: 'ฉันชื่อหลี่หมิง'
  },
  { 
    id: 429,
    chinese: '教室', 
    pinyin: 'jiàoshì', 
    thai: 'ห้องเรียน',
    sentence: '我们在教室上课。',
    sentence_th: 'เราเรียนในห้องเรียน'
  },
  { 
    id: 430,
    chinese: '接', 
    pinyin: 'jiē', 
    thai: 'รับ',
    sentence: '我去机场接你。',
    sentence_th: 'ฉันไปรับคุณที่สนามบิน'
  },
  { 
    id: 431,
    chinese: '街道', 
    pinyin: 'jiēdào', 
    thai: 'ถนน',
    sentence: '这条街道很热闹。',
    sentence_th: 'ถนนเส้นนี้คึกคัก'
  },
  { 
    id: 432,
    chinese: '结婚', 
    pinyin: 'jiéhūn', 
    thai: 'แต่งงาน',
    sentence: '他们结婚了。',
    sentence_th: 'พวกเขาแต่งงานกัน'
  },
  { 
    id: 433,
    chinese: '结束', 
    pinyin: 'jiéshù', 
    thai: 'จบ',
    sentence: '会议结束了。',
    sentence_th: 'การประชุมจบแล้ว'
  },
  { 
    id: 434,
    chinese: '节日', 
    pinyin: 'jiérì', 
    thai: 'เทศกาล',
    sentence: '春节是重要的节日。',
    sentence_th: 'ตรุษจีนเป็นเทศกาลสำคัญ'
  },
  { 
    id: 435,
    chinese: '节目', 
    pinyin: 'jiémù', 
    thai: 'รายการ',
    sentence: '我喜欢这个节目。',
    sentence_th: 'ฉันชอบรายการนี้'
  },
  { 
    id: 436,
    chinese: '姐姐', 
    pinyin: 'jiějie', 
    thai: 'พี่สาว',
    sentence: '我姐姐是医生。',
    sentence_th: 'พี่สาวฉันเป็นหมอ'
  },
  { 
    id: 437,
    chinese: '解决', 
    pinyin: 'jiějué', 
    thai: 'แก้ไข',
    sentence: '解决问题',
    sentence_th: 'แก้ปัญหา'
  },
  { 
    id: 438,
    chinese: '借', 
    pinyin: 'jiè', 
    thai: 'ยืม',
    sentence: '我可以借你的书吗？',
    sentence_th: 'ฉันขอยืมหนังสือคุณได้ไหม'
  },
  { 
    id: 439,
    chinese: '介绍', 
    pinyin: 'jièshào', 
    thai: 'แนะนำ',
    sentence: '我介绍一下自己。',
    sentence_th: 'ฉันขอแนะนำตัวเอง'
  },
  { 
    id: 440,
    chinese: '今天', 
    pinyin: 'jīntiān', 
    thai: 'วันนี้',
    sentence: '今天天气很好。',
    sentence_th: 'วันนี้อากาศดี'
  },
  { 
    id: 441,
    chinese: '紧张', 
    pinyin: 'jǐnzhāng', 
    thai: 'ตื่นเต้น',
    sentence: '我有点紧张。',
    sentence_th: 'ฉันตื่นเต้นนิดหน่อย'
  },
  { 
    id: 442,
    chinese: '进', 
    pinyin: 'jìn', 
    thai: 'เข้า',
    sentence: '请进。',
    sentence_th: 'เชิญเข้า'
  },
  { 
    id: 443,
    chinese: '近', 
    pinyin: 'jìn', 
    thai: 'ใกล้',
    sentence: '学校很近。',
    sentence_th: 'โรงเรียนใกล้'
  },
  { 
    id: 444,
    chinese: '经过', 
    pinyin: 'jīngguò', 
    thai: 'ผ่าน',
    sentence: '经过努力，他成功了。',
    sentence_th: 'ผ่านความพยายาม เขาก็ประสบความสำเร็จ'
  },
  { 
    id: 445,
    chinese: '经济', 
    pinyin: 'jīngjì', 
    thai: 'เศรษฐกิจ',
    sentence: '中国经济很好。',
    sentence_th: 'เศรษฐกิจจีนดีมาก'
  },
  { 
    id: 446,
    chinese: '经验', 
    pinyin: 'jīngyàn', 
    thai: 'ประสบการณ์',
    sentence: '他有很多经验。',
    sentence_th: 'เขามีประสบการณ์มาก'
  },
  { 
    id: 447,
    chinese: '久', 
    pinyin: 'jiǔ', 
    thai: 'นาน',
    sentence: '好久不见。',
    sentence_th: 'ไม่ได้เจอกันนาน'
  },
  { 
    id: 448,
    chinese: '酒', 
    pinyin: 'jiǔ', 
    thai: 'เหล้า',
    sentence: '我不喝酒。',
    sentence_th: 'ฉันไม่ดื่มเหล้า'
  },
  { 
    id: 449,
    chinese: '旧', 
    pinyin: 'jiù', 
    thai: 'เก่า',
    sentence: '这件衣服很旧了。',
    sentence_th: 'เสื้อผ้าตัวนี้เก่าแล้ว'
  },
  { 
    id: 450,
    chinese: '就', 
    pinyin: 'jiù', 
    thai: 'ก็',
    sentence: '我马上就来了。',
    sentence_th: 'ฉันจะมาเดี๋ยวนี้'
  },
  { 
    id: 451,
    chinese: '橘子', 
    pinyin: 'júzi', 
    thai: 'ส้ม',
    sentence: '我喜欢吃橘子。',
    sentence_th: 'ฉันชอบกินส้ม'
  },
  { 
    id: 452,
    chinese: '觉得', 
    pinyin: 'juéde', 
    thai: 'รู้สึก',
    sentence: '我觉得很累。',
    sentence_th: 'ฉันรู้สึกเหนื่อย'
  },
  { 
    id: 453,
    chinese: '决定', 
    pinyin: 'juédìng', 
    thai: 'ตัดสินใจ',
    sentence: '我决定了。',
    sentence_th: 'ฉันตัดสินใจแล้ว'
  },
  { 
    id: 454,
    chinese: '咖啡', 
    pinyin: 'kāfēi', 
    thai: 'กาแฟ',
    sentence: '我喜欢喝咖啡。',
    sentence_th: 'ฉันชอบดื่มกาแฟ'
  },
  { 
    id: 455,
    chinese: '开始', 
    pinyin: 'kāishǐ', 
    thai: 'เริ่ม',
    sentence: '开始上课。',
    sentence_th: 'เริ่มเรียน'
  },
  { 
    id: 456,
    chinese: '考试', 
    pinyin: 'kǎoshì', 
    thai: 'สอบ',
    sentence: '明天有考试。',
    sentence_th: 'พรุ่งนี้มีการสอบ'
  },
  { 
    id: 457,
    chinese: '可能', 
    pinyin: 'kěnéng', 
    thai: 'อาจจะ',
    sentence: '他可能不来了。',
    sentence_th: 'เขาอาจจะไม่มา'
  },
  { 
    id: 458,
    chinese: '可是', 
    pinyin: 'kěshì', 
    thai: 'แต่',
    sentence: '我想去，可是没时间。',
    sentence_th: 'ฉันอยากไป แต่ไม่มีเวลา'
  },
  { 
    id: 459,
    chinese: '可以', 
    pinyin: 'kěyǐ', 
    thai: 'ได้',
    sentence: '我可以进来吗？',
    sentence_th: 'ฉันเข้าได้ไหม'
  },
  { 
    id: 460,
    chinese: '渴', 
    pinyin: 'kě', 
    thai: 'กระหาย',
    sentence: '我渴了。',
    sentence_th: 'ฉันกระหายน้ำ'
  },
  { 
    id: 461,
    chinese: '刻', 
    pinyin: 'kè', 
    thai: 'นาฬิกา',
    sentence: '三点一刻。',
    sentence_th: 'สามโมงสิบห้านาที'
  },
  { 
    id: 462,
    chinese: '课', 
    pinyin: 'kè', 
    thai: 'บทเรียน',
    sentence: '我们有一节课。',
    sentence_th: 'เรามีหนึ่งคาบเรียน'
  },
  { 
    id: 463,
    chinese: '空调', 
    pinyin: 'kōngtiáo', 
    thai: 'เครื่องปรับอากาศ',
    sentence: '开空调。',
    sentence_th: 'เปิดแอร์'
  },
  { 
    id: 464,
    chinese: '口', 
    pinyin: 'kǒu', 
    thai: 'ปาก',
    sentence: '他张开嘴。',
    sentence_th: 'เขาอ้าปาก'
  },
  { 
    id: 465,
    chinese: '哭', 
    pinyin: 'kū', 
    thai: 'ร้องไห้',
    sentence: '孩子哭了。',
    sentence_th: 'เด็กร้องไห้'
  },
  { 
    id: 466,
    chinese: '裤子', 
    pinyin: 'kùzi', 
    thai: 'กางเกง',
    sentence: '这条裤子很漂亮。',
    sentence_th: 'กางเกงตัวนี้สวย'
  },
  { 
    id: 467,
    chinese: '快', 
    pinyin: 'kuài', 
    thai: 'เร็ว',
    sentence: '他跑得快。',
    sentence_th: 'เขาวิ่งเร็ว'
  },
  { 
    id: 468,
    chinese: '快乐', 
    pinyin: 'kuàilè', 
    thai: 'มีความสุข',
    sentence: '祝你快乐。',
    sentence_th: 'ขอให้คุณมีความสุข'
  },
  { 
    id: 469,
    chinese: '筷子', 
    pinyin: 'kuàizi', 
    thai: 'ตะเกียบ',
    sentence: '我会用筷子。',
    sentence_th: 'ฉันใช้ตะเกียบเป็น'
  },
  { 
    id: 470,
    chinese: '蓝', 
    pinyin: 'lán', 
    thai: 'น้ำเงิน',
    sentence: '天空是蓝色的。',
    sentence_th: 'ท้องฟ้าเป็นสีฟ้า'
  },
  { 
    id: 471,
    chinese: '老', 
    pinyin: 'lǎo', 
    thai: 'แก่',
    sentence: '他老了。',
    sentence_th: 'เขาแก่แล้ว'
  },
  { 
    id: 472,
    chinese: '老师', 
    pinyin: 'lǎoshī', 
    thai: 'ครู',
    sentence: '他是我的老师。',
    sentence_th: 'เขาเป็นครูของฉัน'
  },
  { 
    id: 473,
    chinese: '了', 
    pinyin: 'le', 
    thai: 'แล้ว',
    sentence: '我吃饭了。',
    sentence_th: 'ฉันกินข้าวแล้ว'
  },
  { 
    id: 474,
    chinese: '累', 
    pinyin: 'lèi', 
    thai: 'เหนื่อย',
    sentence: '我很累。',
    sentence_th: 'ฉันเหนื่อย'
  },
  { 
    id: 475,
    chinese: '冷', 
    pinyin: 'lěng', 
    thai: 'หนาว',
    sentence: '今天很冷。',
    sentence_th: 'วันนี้หนาว'
  },
  { 
    id: 476,
    chinese: '离', 
    pinyin: 'lí', 
    thai: 'ห่าง',
    sentence: '学校离我家很远。',
    sentence_th: 'โรงเรียนห่างจากบ้านฉันไกล'
  },
  { 
    id: 477,
    chinese: '离开', 
    pinyin: 'líkāi', 
    thai: 'จากไป',
    sentence: '他离开了。',
    sentence_th: 'เขาจากไปแล้ว'
  },
  { 
    id: 478,
    chinese: '里', 
    pinyin: 'lǐ', 
    thai: 'ใน',
    sentence: '房间里有人。',
    sentence_th: 'ในห้องมีคน'
  },
  { 
    id: 479,
    chinese: '礼物', 
    pinyin: 'lǐwù', 
    thai: 'ของขวัญ',
    sentence: '这是给你的礼物。',
    sentence_th: 'นี่คือของขวัญสำหรับคุณ'
  },
  { 
    id: 480,
    chinese: '历史', 
    pinyin: 'lìshǐ', 
    thai: 'ประวัติศาสตร์',
    sentence: '我喜欢历史。',
    sentence_th: 'ฉันชอบประวัติศาสตร์'
  },
  { 
    id: 481,
    chinese: '脸', 
    pinyin: 'liǎn', 
    thai: 'หน้า',
    sentence: '她的脸很漂亮。',
    sentence_th: 'หน้าเธอสวย'
  },
  { 
    id: 482,
    chinese: '练习', 
    pinyin: 'liànxí', 
    thai: 'ฝึกฝน',
    sentence: '练习汉语',
    sentence_th: 'ฝึกภาษาจีน'
  },
  { 
    id: 483,
    chinese: '两', 
    pinyin: 'liǎng', 
    thai: 'สอง',
    sentence: '我有两个苹果。',
    sentence_th: 'ฉันมีแอปเปิ้ลสองผล'
  },
  { 
    id: 484,
    chinese: '辆', 
    pinyin: 'liàng', 
    thai: 'คัน',
    sentence: '一辆车',
    sentence_th: 'รถหนึ่งคัน'
  },
  { 
    id: 485,
    chinese: '聊天', 
    pinyin: 'liáotiān', 
    thai: 'คุย',
    sentence: '我们聊聊天吧。',
    sentence_th: 'เรามาคุยกันเถอะ'
  },
  { 
    id: 486,
    chinese: '了解', 
    pinyin: 'liǎojiě', 
    thai: 'เข้าใจ',
    sentence: '我了解你。',
    sentence_th: 'ฉันเข้าใจคุณ'
  },
  { 
    id: 487,
    chinese: '零', 
    pinyin: 'líng', 
    thai: 'ศูนย์',
    sentence: '温度零下十度。',
    sentence_th: 'อุณหภูมิติดลบสิบองศา'
  },
  { 
    id: 488,
    chinese: '领导', 
    pinyin: 'lǐngdǎo', 
    thai: 'ผู้นำ',
    sentence: '他是我们的领导。',
    sentence_th: 'เขาเป็นผู้นำของเรา'
  },
  { 
    id: 489,
    chinese: '留', 
    pinyin: 'liú', 
    thai: 'อยู่',
    sentence: '请留在这里。',
    sentence_th: 'กรุณาอยู่ที่นี่'
  },
  { 
    id: 490,
    chinese: '流利', 
    pinyin: 'liúlì', 
    thai: 'คล่อง',
    sentence: '他说汉语很流利。',
    sentence_th: 'เขาพูดจีนได้คล่อง'
  },
  { 
    id: 491,
    chinese: '六', 
    pinyin: 'liù', 
    thai: 'หก',
    sentence: '六点了。',
    sentence_th: 'หกโมงแล้ว'
  },
  { 
    id: 492,
    chinese: '楼', 
    pinyin: 'lóu', 
    thai: 'ตึก',
    sentence: '我住在五楼。',
    sentence_th: 'ฉันอยู่ชั้นห้า'
  },
  { 
    id: 493,
    chinese: '路', 
    pinyin: 'lù', 
    thai: 'ถนน',
    sentence: '这条路很长。',
    sentence_th: 'ถนนเส้นนี้ยาว'
  },
  { 
    id: 494,
    chinese: '旅行', 
    pinyin: 'lǚxíng', 
    thai: 'เดินทาง',
    sentence: '我喜欢旅行。',
    sentence_th: 'ฉันชอบเดินทาง'
  },
  { 
    id: 495,
    chinese: '妈妈', 
    pinyin: 'māma', 
    thai: 'แม่',
    sentence: '妈妈在家。',
    sentence_th: 'แม่อยู่บ้าน'
  },
  { 
    id: 496,
    chinese: '马', 
    pinyin: 'mǎ', 
    thai: 'ม้า',
    sentence: '我喜欢骑马。',
    sentence_th: 'ฉันชอบขี่ม้า'
  },
  { 
    id: 497,
    chinese: '马上', 
    pinyin: 'mǎshàng', 
    thai: 'ทันที',
    sentence: '我马上来。',
    sentence_th: 'ฉันจะมาตอนนี้'
  },
  { 
    id: 498,
    chinese: '吗', 
    pinyin: 'ma', 
    thai: 'ไหม',
    sentence: '你好吗？',
    sentence_th: 'คุณสบายดีไหม'
  },
  { 
    id: 499,
    chinese: '买', 
    pinyin: 'mǎi', 
    thai: 'ซื้อ',
    sentence: '我买书。',
    sentence_th: 'ฉันซื้อหนังสือ'
  },
  { 
    id: 500,
    chinese: '慢', 
    pinyin: 'màn', 
    thai: 'ช้า',
    sentence: '他走得很慢。',
    sentence_th: 'เขาเดินช้า'
  },
  { 
    id: 501,
    chinese: '忙', 
    pinyin: 'máng', 
    thai: 'ยุ่ง',
    sentence: '我今天很忙。',
    sentence_th: 'วันนี้ฉันยุ่ง'
  },
  { 
    id: 502,
    chinese: '猫', 
    pinyin: 'māo', 
    thai: 'แมว',
    sentence: '我有一只猫。',
    sentence_th: 'ฉันมีแมวหนึ่งตัว'
  },
  { 
    id: 503,
    chinese: '没', 
    pinyin: 'méi', 
    thai: 'ไม่',
    sentence: '我没去。',
    sentence_th: 'ฉันไม่ได้ไป'
  },
  { 
    id: 504,
    chinese: '没关系', 
    pinyin: 'méiguānxi', 
    thai: 'ไม่เป็นไร',
    sentence: '没关系，别担心。',
    sentence_th: 'ไม่เป็นไร ไม่ต้องกังวล'
  },
  { 
    id: 505,
    chinese: '没事儿', 
    pinyin: 'méishìr', 
    thai: 'ไม่มีอะไร',
    sentence: '没事儿，你走吧。',
    sentence_th: 'ไม่มีอะไร คุณไปเถอะ'
  },
  { 
    id: 506,
    chinese: '每', 
    pinyin: 'měi', 
    thai: 'ทุก',
    sentence: '我每天都学习。',
    sentence_th: 'ฉันเรียนทุกวัน'
  },
  { 
    id: 507,
    chinese: '妹妹', 
    pinyin: 'mèimei', 
    thai: 'น้องสาว',
    sentence: '我妹妹很可爱。',
    sentence_th: 'น้องสาวฉันน่ารัก'
  },
  { 
    id: 508,
    chinese: '门', 
    pinyin: 'mén', 
    thai: 'ประตู',
    sentence: '请关门。',
    sentence_th: 'กรุณาปิดประตู'
  },
  { 
    id: 509,
    chinese: '米', 
    pinyin: 'mǐ', 
    thai: 'ข้าว',
    sentence: '我喜欢吃米。',
    sentence_th: 'ฉันชอบกินข้าว'
  },
  { 
    id: 510,
    chinese: '米饭', 
    pinyin: 'mǐfàn', 
    thai: 'ข้าวสวย',
    sentence: '吃米饭。',
    sentence_th: 'กินข้าว'
  },
  { 
    id: 511,
    chinese: '面包', 
    pinyin: 'miànbāo', 
    thai: 'ขนมปัง',
    sentence: '吃面包。',
    sentence_th: 'กินขนมปัง'
  },
  { 
    id: 512,
    chinese: '面条', 
    pinyin: 'miàntiáo', 
    thai: 'ก๋วยเตี๋ยว',
    sentence: '吃面条。',
    sentence_th: 'กินก๋วยเตี๋ยว'
  },
  { 
    id: 513,
    chinese: '名字', 
    pinyin: 'míngzi', 
    thai: 'ชื่อ',
    sentence: '你叫什么名字？',
    sentence_th: 'คุณชื่ออะไร'
  },
  { 
    id: 514,
    chinese: '明白', 
    pinyin: 'míngbái', 
    thai: 'เข้าใจ',
    sentence: '我明白了。',
    sentence_th: 'ฉันเข้าใจแล้ว'
  },
  { 
    id: 515,
    chinese: '明年', 
    pinyin: 'míngnián', 
    thai: 'ปีหน้า',
    sentence: '明年我去中国。',
    sentence_th: 'ปีหน้าฉันไปจีน'
  },
  { 
    id: 516,
    chinese: '明天', 
    pinyin: 'míngtiān', 
    thai: 'พรุ่งนี้',
    sentence: '明天见。',
    sentence_th: 'เจอกันพรุ่งนี้'
  },
  { 
    id: 517,
    chinese: '母亲', 
    pinyin: 'mǔqīn', 
    thai: 'แม่',
    sentence: '我的母亲很漂亮。',
    sentence_th: 'แม่ฉันสวย'
  },
  { 
    id: 518,
    chinese: '拿', 
    pinyin: 'ná', 
    thai: 'ถือ',
    sentence: '拿书来。',
    sentence_th: 'เอาหนังสือมา'
  },
  { 
    id: 519,
    chinese: '哪', 
    pinyin: 'nǎ', 
    thai: 'ไหน',
    sentence: '你去哪？',
    sentence_th: 'คุณไปไหน'
  },
  { 
    id: 520,
    chinese: '哪儿', 
    pinyin: 'nǎr', 
    thai: 'ที่ไหน',
    sentence: '你去哪儿？',
    sentence_th: 'คุณไปที่ไหน'
  },
  { 
    id: 521,
    chinese: '那', 
    pinyin: 'nà', 
    thai: 'นั้น',
    sentence: '那个人是我朋友。',
    sentence_th: 'คนนั้นคือเพื่อนฉัน'
  },
  { 
    id: 522,
    chinese: '奶奶', 
    pinyin: 'nǎinai', 
    thai: 'ยาย',
    sentence: '我奶奶很慈祥。',
    sentence_th: 'ยายฉันใจดี'
  },
  { 
    id: 523,
    chinese: '男', 
    pinyin: 'nán', 
    thai: 'ชาย',
    sentence: '他是男的。',
    sentence_th: 'เขาเป็นผู้ชาย'
  },
  { 
    id: 524,
    chinese: '南', 
    pinyin: 'nán', 
    thai: 'ใต้',
    sentence: '广州在中国的南方。',
    sentence_th: 'กว่างโจวอยู่ทางใต้ของจีน'
  },
  { 
    id: 525,
    chinese: '难', 
    pinyin: 'nán', 
    thai: 'ยาก',
    sentence: '这个考试很难。',
    sentence_th: 'การสอบนี้ยาก'
  },
  { 
    id: 526,
    chinese: '呢', 
    pinyin: 'ne', 
    thai: 'ล่ะ',
    sentence: '你呢？',
    sentence_th: 'คุณล่ะ'
  },
  { 
    id: 527,
    chinese: '内', 
    pinyin: 'nèi', 
    thai: 'ภายใน',
    sentence: '请在室内等候。',
    sentence_th: 'กรุณารอภายในห้อง'
  },
  { 
    id: 528,
    chinese: '能', 
    pinyin: 'néng', 
    thai: 'สามารถ',
    sentence: '我能帮助你。',
    sentence_th: 'ฉันสามารถช่วยคุณได้'
  },
  { 
    id: 529,
    chinese: '你', 
    pinyin: 'nǐ', 
    thai: 'คุณ',
    sentence: '你好。',
    sentence_th: 'สวัสดี'
  },
  { 
    id: 530,
    chinese: '年', 
    pinyin: 'nián', 
    thai: 'ปี',
    sentence: '今年是2024年。',
    sentence_th: 'ปีนี้คือปี 2024'
  },
  { 
    id: 531,
    chinese: '年级', 
    pinyin: 'niánjí', 
    thai: 'ชั้นปี',
    sentence: '我在大学三年级。',
    sentence_th: 'ฉันอยู่ปีสามที่มหาวิทยาลัย'
  },
  { 
    id: 532,
    chinese: '年轻', 
    pinyin: 'niánqīng', 
    thai: 'หนุ่มสาว',
    sentence: '他很年轻。',
    sentence_th: 'เขายังหนุ่ม'
  },
  { 
    id: 533,
    chinese: '鸟', 
    pinyin: 'niǎo', 
    thai: 'นก',
    sentence: '天上有很多鸟。',
    sentence_th: 'บนฟ้ามีนกมากมาย'
  },
  { 
    id: 534,
    chinese: '您', 
    pinyin: 'nín', 
    thai: 'คุณ',
    sentence: '您好吗？',
    sentence_th: 'คุณสบายดีไหม'
  },
  { 
    id: 535,
    chinese: '牛奶', 
    pinyin: 'niúnǎi', 
    thai: 'นม',
    sentence: '喝牛奶。',
    sentence_th: 'ดื่มนม'
  },
  { 
    id: 536,
    chinese: '努力', 
    pinyin: 'nǔlì', 
    thai: 'พยายาม',
    sentence: '努力学习。',
    sentence_th: 'พยายามเรียน'
  },
  { 
    id: 537,
    chinese: '女', 
    pinyin: 'nǚ', 
    thai: 'หญิง',
    sentence: '她是女的。',
    sentence_th: 'เธอเป็นผู้หญิง'
  },
  { 
    id: 538,
    chinese: '女儿', 
    pinyin: "nǚ'ér", 
    thai: 'ลูกสาว',
    sentence: '我女儿很可爱。',
    sentence_th: 'ลูกสาวฉันน่ารัก'
  },
  { 
    id: 539,
    chinese: '暖和', 
    pinyin: 'nuǎnhuo', 
    thai: 'อบอุ่น',
    sentence: '今天很暖和。',
    sentence_th: 'วันนี้อบอุ่น'
  },
  { 
    id: 540,
    chinese: '怕', 
    pinyin: 'pà', 
    thai: 'กลัว',
    sentence: '我怕狗。',
    sentence_th: 'ฉันกลัวหมา'
  },
  { 
    id: 541,
    chinese: '旁边', 
    pinyin: 'pángbiān', 
    thai: 'ข้างๆ',
    sentence: '学校旁边有商店。',
    sentence_th: 'ข้างๆโรงเรียนมีร้านค้า'
  },
  { 
    id: 542,
    chinese: '胖', 
    pinyin: 'pàng', 
    thai: 'อ้วน',
    sentence: '他有点胖。',
    sentence_th: 'เขาค่อนข้างอ้วน'
  },
  { 
    id: 543,
    chinese: '跑步', 
    pinyin: 'pǎobù', 
    thai: 'วิ่ง',
    sentence: '他每天跑步。',
    sentence_th: 'เขาวิ่งทุกวัน'
  },
  { 
    id: 544,
    chinese: '朋友', 
    pinyin: 'péngyou', 
    thai: 'เพื่อน',
    sentence: '他是我的朋友。',
    sentence_th: 'เขาเป็นเพื่อนฉัน'
  },
  { 
    id: 545,
    chinese: '便宜', 
    pinyin: 'piányi', 
    thai: 'ถูก',
    sentence: '这个很便宜。',
    sentence_th: 'อันนี้ถูก'
  },
  { 
    id: 546,
    chinese: '票', 
    pinyin: 'piào', 
    thai: 'ตั๋ว',
    sentence: '买票。',
    sentence_th: 'ซื้อตั๋ว'
  },
  { 
    id: 547,
    chinese: '漂亮', 
    pinyin: 'piàoliang', 
    thai: 'สวย',
    sentence: '你真漂亮。',
    sentence_th: 'คุณสวยจัง'
  },
  { 
    id: 548,
    chinese: '苹果', 
    pinyin: 'píngguǒ', 
    thai: 'แอปเปิ้ล',
    sentence: '吃苹果。',
    sentence_th: 'กินแอปเปิ้ล'
  },
  { 
    id: 549,
    chinese: '葡萄', 
    pinyin: 'pútao', 
    thai: 'องุ่น',
    sentence: '吃葡萄。',
    sentence_th: 'กินองุ่น'
  },
  { 
    id: 550,
    chinese: '七', 
    pinyin: 'qī', 
    thai: 'เจ็ด',
    sentence: '七点了。',
    sentence_th: 'เจ็ดโมงแล้ว'
  },
  { 
    id: 551,
    chinese: '期', 
    pinyin: 'qī', 
    thai: 'ระยะเวลา',
    sentence: '学期结束了。',
    sentence_th: 'เทอมเรียนจบแล้ว'
  },
  { 
    id: 552,
    chinese: '奇怪', 
    pinyin: 'qíguài', 
    thai: 'แปลก',
    sentence: '真奇怪。',
    sentence_th: 'แปลกจริง'
  },
  { 
    id: 553,
    chinese: '起床', 
    pinyin: 'qǐchuáng', 
    thai: 'ตื่นนอน',
    sentence: '我六点起床。',
    sentence_th: 'ฉันตื่นนอนหกโมง'
  },
  { 
    id: 554,
    chinese: '千', 
    pinyin: 'qiān', 
    thai: 'พัน',
    sentence: '一千块钱。',
    sentence_th: 'หนึ่งพันหยวน'
  },
  { 
    id: 555,
    chinese: '铅笔', 
    pinyin: 'qiānbǐ', 
    thai: 'ดินสอ',
    sentence: '用铅笔写字。',
    sentence_th: 'เขียนด้วยดินสอ'
  },
  { 
    id: 556,
    chinese: '钱', 
    pinyin: 'qián', 
    thai: 'เงิน',
    sentence: '多少钱？',
    sentence_th: 'เท่าไหร่'
  },
  { 
    id: 557,
    chinese: '前面', 
    pinyin: 'qiánmiàn', 
    thai: 'ข้างหน้า',
    sentence: '前面有人。',
    sentence_th: 'ข้างหน้ามีคน'
  },
  { 
    id: 558,
    chinese: '墙', 
    pinyin: 'qiáng', 
    thai: 'กำแพง',
    sentence: '墙是白色的。',
    sentence_th: 'กำแพงสีขาว'
  },
  { 
    id: 559,
    chinese: '巧克力', 
    pinyin: 'qiǎokèlì', 
    thai: 'ช็อกโกแลต',
    sentence: '我喜欢吃巧克力。',
    sentence_th: 'ฉันชอบกินช็อกโกแลต'
  },
  { 
    id: 560,
    chinese: '亲戚', 
    pinyin: 'qīnqi', 
    thai: 'ญาติ',
    sentence: '他有很多亲戚。',
    sentence_th: 'เขามีญาติมากมาย'
  },
  { 
    id: 561,
    chinese: '轻松', 
    pinyin: 'qīngsōng', 
    thai: 'สบาย',
    sentence: '工作很轻松。',
    sentence_th: 'งานสบาย'
  },
  { 
    id: 562,
    chinese: '情况', 
    pinyin: 'qíngkuàng', 
    thai: 'สถานการณ์',
    sentence: '情况怎么样？',
    sentence_th: 'สถานการณ์เป็นอย่างไร'
  },
  { 
    id: 563,
    chinese: '请', 
    pinyin: 'qǐng', 
    thai: 'เชิญ',
    sentence: '请进。',
    sentence_th: 'เชิญเข้า'
  },
  { 
    id: 564,
    chinese: '请假', 
    pinyin: 'qǐngjià', 
    thai: 'ลางาน',
    sentence: '我想请假一天。',
    sentence_th: 'ฉันอยากลาหนึ่งวัน'
  },
  { 
    id: 565,
    chinese: '秋', 
    pinyin: 'qiū', 
    thai: 'ฤดูใบไม้ร่วง',
    sentence: '秋天很凉快。',
    sentence_th: 'ฤดูใบไม้ร่วงเย็นสบาย'
  },
  { 
    id: 566,
    chinese: '去', 
    pinyin: 'qù', 
    thai: 'ไป',
    sentence: '我去学校。',
    sentence_th: 'ฉันไปโรงเรียน'
  },
  { 
    id: 567,
    chinese: '去年', 
    pinyin: 'qùnián', 
    thai: 'ปีที่แล้ว',
    sentence: '去年我去了中国。',
    sentence_th: 'ปีที่แล้วฉันไปจีน'
  },
  { 
    id: 568,
    chinese: '让', 
    pinyin: 'ràng', 
    thai: 'ให้',
    sentence: '让我看看。',
    sentence_th: 'ให้ฉันดูหน่อย'
  },
  { 
    id: 569,
    chinese: '热', 
    pinyin: 'rè', 
    thai: 'ร้อน',
    sentence: '今天很热。',
    sentence_th: 'วันนี้ร้อน'
  },
  { 
    id: 570,
    chinese: '热情', 
    pinyin: 'rèqíng', 
    thai: 'กระตือรือร้น',
    sentence: '他非常热情。',
    sentence_th: 'เขากระตือรือร้นมาก'
  },
  { 
    id: 571,
    chinese: '人', 
    pinyin: 'rén', 
    thai: 'คน',
    sentence: '很多人来了。',
    sentence_th: 'คนมามากมาย'
  },
  { 
    id: 572,
    chinese: '认识', 
    pinyin: 'rènshi', 
    thai: 'รู้จัก',
    sentence: '我认识他。',
    sentence_th: 'ฉันรู้จักเขา'
  },
  { 
    id: 573,
    chinese: '认真', 
    pinyin: 'rènzhēn', 
    thai: 'จริงจัง',
    sentence: '认真学习。',
    sentence_th: 'เรียนอย่างจริงจัง'
  },
  { 
    id: 574,
    chinese: '日', 
    pinyin: 'rì', 
    thai: 'วัน',
    sentence: '星期日',
    sentence_th: 'วันอาทิตย์'
  },
  { 
    id: 575,
    chinese: '容易', 
    pinyin: 'róngyì', 
    thai: 'ง่าย',
    sentence: '这个很容易。',
    sentence_th: 'อันนี้ง่าย'
  },
  { 
    id: 576,
    chinese: '如果', 
    pinyin: 'rúguǒ', 
    thai: 'ถ้า',
    sentence: '如果明天下雨，我不去。',
    sentence_th: 'ถ้าพรุ่งนี้ฝนตก ฉันไม่ไป'
  },
  { 
    id: 577,
    chinese: '三', 
    pinyin: 'sān', 
    thai: 'สาม',
    sentence: '三点了。',
    sentence_th: 'สามโมงแล้ว'
  },
  { 
    id: 578,
    chinese: '伞', 
    pinyin: 'sǎn', 
    thai: 'ร่ม',
    sentence: '下雨了，带伞。',
    sentence_th: 'ฝนตก เอาร่มไปด้วย'
  },
  { 
    id: 579,
    chinese: '商店', 
    pinyin: 'shāngdiàn', 
    thai: 'ร้านค้า',
    sentence: '去商店买东西。',
    sentence_th: 'ไปซื้อของที่ร้าน'
  },
  { 
    id: 580,
    chinese: '上', 
    pinyin: 'shàng', 
    thai: 'บน',
    sentence: '书在桌子上。',
    sentence_th: 'หนังสืออยู่บนโต๊ะ'
  },
  { 
    id: 581,
    chinese: '上班', 
    pinyin: 'shàngbān', 
    thai: 'ไปทำงาน',
    sentence: '我八点上班。',
    sentence_th: 'ฉันไปทำงานแปดโมง'
  },
  { 
    id: 582,
    chinese: '上网', 
    pinyin: 'shàngwǎng', 
    thai: 'เล่นเน็ต',
    sentence: '他喜欢上网。',
    sentence_th: 'เขาชอบเล่นเน็ต'
  },
  { 
    id: 583,
    chinese: '上午', 
    pinyin: 'shàngwǔ', 
    thai: 'เช้า',
    sentence: '上午九点。',
    sentence_th: 'เก้าโมงเช้า'
  },
  { 
    id: 584,
    chinese: '少', 
    pinyin: 'shǎo', 
    thai: 'น้อย',
    sentence: '人很少。',
    sentence_th: 'คนน้อย'
  },
  { 
    id: 585,
    chinese: '社会', 
    pinyin: 'shèhuì', 
    thai: 'สังคม',
    sentence: '社会很复杂。',
    sentence_th: 'สังคมซับซ้อน'
  },
  { 
    id: 586,
    chinese: '谁', 
    pinyin: 'shéi', 
    thai: 'ใคร',
    sentence: '他是谁？',
    sentence_th: 'เขาเป็นใคร'
  },
  { 
    id: 587,
    chinese: '身体', 
    pinyin: 'shēntǐ', 
    thai: 'ร่างกาย',
    sentence: '注意身体。',
    sentence_th: 'ดูแลร่างกาย'
  },
  { 
    id: 588,
    chinese: '什么', 
    pinyin: 'shénme', 
    thai: 'อะไร',
    sentence: '这是什么？',
    sentence_th: 'นี่คืออะไร'
  },
  { 
    id: 589,
    chinese: '生病', 
    pinyin: 'shēngbìng', 
    thai: 'ป่วย',
    sentence: '他生病了。',
    sentence_th: 'เขาป่วย'
  },
  { 
    id: 590,
    chinese: '生气', 
    pinyin: 'shēngqì', 
    thai: 'โกรธ',
    sentence: '别生气。',
    sentence_th: 'อย่าโกรธ'
  },
  { 
    id: 591,
    chinese: '生日', 
    pinyin: 'shēngrì', 
    thai: 'วันเกิด',
    sentence: '生日快乐！',
    sentence_th: 'สุขสันต์วันเกิด'
  },
  { 
    id: 592,
    chinese: '声音', 
    pinyin: 'shēngyīn', 
    thai: 'เสียง',
    sentence: '声音很大。',
    sentence_th: 'เสียงดัง'
  },
  { 
    id: 593,
    chinese: '十', 
    pinyin: 'shí', 
    thai: 'สิบ',
    sentence: '十点了。',
    sentence_th: 'สิบโมงแล้ว'
  },
  { 
    id: 594,
    chinese: '时候', 
    pinyin: 'shíhou', 
    thai: 'เวลา',
    sentence: '什么时候？',
    sentence_th: 'เมื่อไหร่'
  },
  { 
    id: 595,
    chinese: '时间', 
    pinyin: 'shíjiān', 
    thai: 'เวลา',
    sentence: '没时间了。',
    sentence_th: 'ไม่มีเวลาแล้ว'
  },
  { 
    id: 596,
    chinese: '事情', 
    pinyin: 'shìqing', 
    thai: 'เรื่อง',
    sentence: '有事情要告诉你。',
    sentence_th: 'มีเรื่องจะบอก'
  },
  { 
    id: 597,
    chinese: '是', 
    pinyin: 'shì', 
    thai: 'เป็น',
    sentence: '我是学生。',
    sentence_th: 'ฉันเป็นนักเรียน'
  },
  { 
    id: 598,
    chinese: '试', 
    pinyin: 'shì', 
    thai: 'ลอง',
    sentence: '试一下。',
    sentence_th: 'ลองดู'
  },
  { 
    id: 599,
    chinese: '收', 
    pinyin: 'shōu', 
    thai: 'รับ',
    sentence: '收到礼物。',
    sentence_th: 'ได้รับของขวัญ'
  },
  { 
    id: 600,
    chinese: '手', 
    pinyin: 'shǒu', 
    thai: 'มือ',
    sentence: '请举手。',
    sentence_th: 'กรุณายกมือ'
  }
];

export const allHsk = [...hsk1, ...hsk2, ...hsk3];

// ฟังก์ชันสุ่มคำศัพท์
export const getRandomWords = (level, count = 10) => {
  let source = [];
  switch(level) {
    case 'hsk1':
      source = hsk1;
      break;
    case 'hsk2':
      source = hsk2;
      break;
    case 'hsk3':
      source = hsk3;
      break;
    case 'hskmix':
      source = allHsk;
      break;
    default:
      source = allHsk;
  }
  
  // สุ่มคำศัพท์
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ฟังก์ชันสร้างคำถามแบบเติมคำ
export const generateSentenceQuestions = (words, count = 10) => {
  const questions = [];
  const selectedWords = words.length >= count ? words : [...words, ...allHsk].slice(0, count);
  
  selectedWords.forEach(word => {
    // สร้างตัวเลือก
    const allOptions = allHsk.map(w => w.chinese);
    const otherOptions = allOptions
      .filter(w => w !== word.chinese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [word.chinese, ...otherOptions].sort(() => 0.5 - Math.random());
    
    questions.push({
      sentence: `____ ${word.thai}`,
      options: options,
      correct: word.chinese,
      pinyin: word.pinyin,
      meaning: word.thai,
      word: word
    });
  });
  
  return questions;
};

// ฟังก์ชันสร้างคำถามแบบเลือกคำศัพท์
export const generateVocabularyQuestions = (words, count = 10) => {
  const questions = [];
  const selectedWords = words.length >= count ? words : [...words, ...allHsk].slice(0, count);
  
  selectedWords.forEach(word => {
    // สร้างตัวเลือก
    const otherWords = allHsk
      .filter(w => w.chinese !== word.chinese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [word, ...otherWords].sort(() => 0.5 - Math.random());
    
    questions.push({
      chinese: word.chinese,
      pinyin: word.pinyin,
      thai: word.thai,
      options: options.map(w => w.chinese),
      correct: word.chinese
    });
  });
  
  return questions;
};

// ข้อมูลสำหรับแต่ละเกม
export const gameQuestions = {
  hsk1: {
    levels: 10,
    getQuestions: (level) => {
      const words = getRandomWords('hsk1', 20);
      return generateSentenceQuestions(words, 10);
    }
  },
  hsk2: {
    levels: 10,
    getQuestions: (level) => {
      const words = getRandomWords('hsk2', 20);
      return generateSentenceQuestions(words, 10);
    }
  },
  hsk3: {
    levels: 10,
    getQuestions: (level) => {
      const words = getRandomWords('hsk3', 20);
      return generateSentenceQuestions(words, 10);
    }
  },
  hskmix: {
    levels: 10,
    getQuestions: (level) => {
      const words = getRandomWords('hskmix', 20);
      return generateSentenceQuestions(words, 10);
    }
  }
};