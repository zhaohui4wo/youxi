'use strict';

/* ============================================================
 * 字母大冒险 —— 给小朋友的打字小游戏
 * 三种模式：字母 / 单词 / 汉字拼音，掉落消除玩法
 * ============================================================ */

/* ---------------- 词库 ---------------- */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/* 字母名称的读音写法，避免语音引擎把单个字母读成单词 */
const LETTER_NAMES = {
  a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'eff',
  g: 'gee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'ell',
  m: 'em', n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'ar',
  s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you',
  x: 'ex', y: 'why', z: 'zee',
};

/* 小学 1～6 年级常见单词 + 中文意思（[英文, 中文]） */
const WORDS = [
  // 动物
  ['cat', '猫'], ['dog', '狗'], ['fish', '鱼'], ['bird', '鸟'],
  ['frog', '青蛙'], ['duck', '鸭子'], ['panda', '熊猫'], ['tiger', '老虎'],
  ['rabbit', '兔子'], ['monkey', '猴子'], ['horse', '马'], ['sheep', '绵羊'],
  ['bear', '熊'], ['lion', '狮子'], ['mouse', '老鼠'], ['elephant', '大象'],
  ['pig', '猪'], ['cow', '奶牛'],
  // 自然
  ['sun', '太阳'], ['star', '星星'], ['tree', '树'], ['moon', '月亮'],
  ['rain', '雨'], ['snow', '雪'], ['cloud', '云'], ['wind', '风'],
  ['river', '河流'], ['mountain', '山'], ['flower', '花'],
  // 食物
  ['cake', '蛋糕'], ['milk', '牛奶'], ['apple', '苹果'], ['orange', '橙子'],
  ['bread', '面包'], ['rice', '米饭'], ['egg', '鸡蛋'], ['water', '水'],
  ['noodles', '面条'], ['banana', '香蕉'], ['grape', '葡萄'], ['juice', '果汁'],
  // 学校
  ['book', '书'], ['school', '学校'], ['pencil', '铅笔'], ['ruler', '尺子'],
  ['eraser', '橡皮'], ['desk', '课桌'], ['chair', '椅子'], ['teacher', '老师'],
  ['student', '学生'], ['bag', '书包'], ['pen', '钢笔'], ['music', '音乐'],
  // 颜色
  ['green', '绿色'], ['purple', '紫色'], ['yellow', '黄色'], ['red', '红色'],
  ['blue', '蓝色'], ['black', '黑色'], ['white', '白色'], ['pink', '粉色'],
  ['brown', '棕色'],
  // 家庭
  ['house', '房子'], ['friend', '朋友'], ['family', '家庭'], ['mother', '妈妈'],
  ['father', '爸爸'], ['sister', '姐妹'], ['brother', '兄弟'], ['grandpa', '爷爷'],
  ['grandma', '奶奶'], ['baby', '宝宝'],
  // 季节与天气
  ['summer', '夏天'], ['winter', '冬天'], ['spring', '春天'], ['autumn', '秋天'],
  ['sunny', '晴朗的'], ['windy', '有风的'], ['cloudy', '多云的'], ['rainy', '下雨的'],
  ['cold', '寒冷的'], ['warm', '温暖的'], ['hot', '炎热的'],
  // 动作
  ['happy', '开心的'], ['smile', '微笑'], ['run', '跑'], ['jump', '跳'],
  ['swim', '游泳'], ['walk', '走路'], ['read', '阅读'], ['write', '写'],
  ['sing', '唱歌'], ['dance', '跳舞'], ['draw', '画画'], ['play', '玩'],
  ['eat', '吃'], ['drink', '喝'], ['sleep', '睡觉'], ['study', '学习'],
  // 物品
  ['hat', '帽子'], ['bus', '公交车'], ['ball', '球'], ['kite', '风筝'],
  ['ship', '轮船'], ['rocket', '火箭'], ['castle', '城堡'], ['window', '窗户'],
  ['garden', '花园'], ['bike', '自行车'], ['car', '小汽车'], ['train', '火车'],
  ['plane', '飞机'], ['phone', '电话'], ['clock', '时钟'], ['door', '门'],
  ['bed', '床'],
  // 其他常用词
  ['toy', '玩具'], ['gift', '礼物'], ['birthday', '生日'], ['holiday', '假期'],
  ['weekend', '周末'], ['morning', '早上'], ['evening', '傍晚'], ['tomorrow', '明天'],
  ['big', '大的'], ['small', '小的'], ['long', '长的'], ['short', '短的'],
  ['tall', '高的'], ['young', '年轻的'], ['old', '年老的'], ['new', '新的'],
];

/* 常用汉字 + 无声调拼音（一二年级常见字） */
const PINYIN_CHARS = [
  ['人', 'ren'], ['口', 'kou'], ['大', 'da'], ['小', 'xiao'], ['山', 'shan'],
  ['水', 'shui'], ['火', 'huo'], ['木', 'mu'], ['土', 'tu'], ['金', 'jin'],
  ['月', 'yue'], ['日', 'ri'], ['天', 'tian'], ['地', 'di'], ['花', 'hua'],
  ['草', 'cao'], ['树', 'shu'], ['鸟', 'niao'], ['鱼', 'yu'], ['马', 'ma'],
  ['牛', 'niu'], ['羊', 'yang'], ['虫', 'chong'], ['猫', 'mao'], ['狗', 'gou'],
  ['上', 'shang'], ['下', 'xia'], ['左', 'zuo'], ['右', 'you'], ['中', 'zhong'],
  ['云', 'yun'], ['风', 'feng'], ['雨', 'yu'], ['电', 'dian'], ['星', 'xing'],
  ['光', 'guang'], ['春', 'chun'], ['夏', 'xia'], ['秋', 'qiu'], ['冬', 'dong'],
  ['门', 'men'], ['开', 'kai'], ['飞', 'fei'], ['走', 'zou'], ['吃', 'chi'],
  ['看', 'kan'], ['听', 'ting'], ['书', 'shu'], ['米', 'mi'], ['瓜', 'gua'],
  ['果', 'guo'], ['手', 'shou'], ['足', 'zu'], ['耳', 'er'], ['目', 'mu'],
];

/* ---------------- 配置 ---------------- */
const MODES = {
  letter: { name: '字母模式', emoji: '🔤', baseSpeed: 0.055, baseInterval: 2600, minInterval: 1300 },
  word:   { name: '单词模式', emoji: '🐱', baseSpeed: 0.038, baseInterval: 3600, minInterval: 1700 },
  pinyin: { name: '拼音模式', emoji: '🀄', baseSpeed: 0.032, baseInterval: 4000, minInterval: 1900 },
};

/* 掉落卡片的配色：[底色, 边框色] */
const PALETTE = [
  ['#fff6d9', '#f5a623'],
  ['#e3f9e5', '#2fb457'],
  ['#ffe9ec', '#ff5e7e'],
  ['#e5f1ff', '#3e8bff'],
  ['#f3e8ff', '#9b5de5'],
  ['#fff3e6', '#ff8a3d'],
];

const ITEM_EMOJIS = ['⭐', '🎈', '🍭', '🌈', '🍀', '✨', '🎨', '🍎'];

const PRAISES = ['太棒了！', '真厉害！', '好样的！', '超级棒！', '厉害了！', '你真聪明！', '满分操作！'];
const OVER_TITLES = ['🎉 玩得开心！', '💪 越战越勇！', '🌟 表现很棒！', '🚀 下次更快！'];

const FONT = (s) => `bold ${s}px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`;

const TAU = Math.PI * 2;

/* ---------------- 盲打指法 ----------------
 * 每个字母由哪只手的哪根手指负责（标准 QWERTY 指法）
 */
const KEY_FINGER = {
  q: 'l-pinky', a: 'l-pinky', z: 'l-pinky',
  w: 'l-ring', s: 'l-ring', x: 'l-ring',
  e: 'l-middle', d: 'l-middle', c: 'l-middle',
  r: 'l-index', f: 'l-index', v: 'l-index',
  t: 'l-index', g: 'l-index', b: 'l-index',
  y: 'r-index', h: 'r-index', n: 'r-index',
  u: 'r-index', j: 'r-index', m: 'r-index',
  i: 'r-middle', k: 'r-middle',
  o: 'r-ring', l: 'r-ring',
  p: 'r-pinky',
};

const FINGER_INFO = {
  'l-pinky':  { hand: 'left',  name: '左手小指',   color: '#f78fb3' },
  'l-ring':   { hand: 'left',  name: '左手无名指', color: '#a29bfe' },
  'l-middle': { hand: 'left',  name: '左手中指',   color: '#74b9ff' },
  'l-index':  { hand: 'left',  name: '左手食指',   color: '#00b894' },
  'r-index':  { hand: 'right', name: '右手食指',   color: '#fdcb6e' },
  'r-middle': { hand: 'right', name: '右手中指',   color: '#e17055' },
  'r-ring':   { hand: 'right', name: '右手无名指', color: '#ff7675' },
  'r-pinky':  { hand: 'right', name: '右手小指',   color: '#6c5ce7' },
};

function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* 命中特效配色 */
const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#b983ff', '#ff9f43', '#ff8fab', '#00c2a8'];
const HIT_EMOJIS = ['✨', '⭐', '💫', '🌟', '🎈', '🍬', '🌈', '🍀'];
const BIG_EMOJIS = ['🎉', '🎊', '⭐', '✨', '🌈', '🎈', '🏆', '💖'];
const BALLOON_COLORS = [
  ['#ff8fab', '#ffd166'],
  ['#7db9ff', '#b983ff'],
  ['#6bcb77', '#ffd93d'],
  ['#ff9f43', '#ff6b6b'],
  ['#b983ff', '#7db9ff'],
];

/* 三种模式各自的背景主题 */
const THEMES = {
  letter: {
    sky: ['#63c8ff', '#9fe3ff', '#d8f6ff', '#fff2cf'],
    orb: { type: 'sun', x: 0.85, y: 0.16, r: 34, color: '#ffe066', glow: 'rgba(255,224,102,0.85)' },
    cloud: 'rgba(255,255,255,0.95)',
    cloudCount: 6,
    cloudAlpha: [0.45, 0.85],
    starCount: 10,
    starColor: 'rgba(255,255,255,0.9)',
    birdCount: 4,
    balloonCount: 2,
    fireflyCount: 0,
    lanternCount: 0,
    rainbow: true,
    hills: [
      { color: '#c8edd4', base: 0.80, amp: 24, freq: 1.2, phase: 0.2, alpha: 0.9 },
      { color: '#a3e0b8', base: 0.87, amp: 20, freq: 1.7, phase: 2.0, alpha: 0.9 },
      { color: '#7fd09d', base: 0.94, amp: 14, freq: 2.2, phase: 4.1, alpha: 0.95 },
    ],
    birdColor: 'rgba(70,110,130,0.65)',
    flowerColors: ['#ff8fab', '#ffd93d', '#ffffff', '#c9a7ff'],
    danger: 'rgba(255,107,107,0.6)',
  },
  word: {
    sky: ['#ff8f6b', '#ffb98a', '#ffe1b0', '#fff7e2'],
    orb: { type: 'sun', x: 0.76, y: 0.42, r: 44, color: '#ffcf5c', glow: 'rgba(255,190,90,0.8)' },
    cloud: 'rgba(255,240,225,0.9)',
    cloudCount: 5,
    cloudAlpha: [0.35, 0.75],
    starCount: 6,
    starColor: 'rgba(255,255,255,0.8)',
    birdCount: 5,
    balloonCount: 2,
    fireflyCount: 0,
    lanternCount: 0,
    rainbow: false,
    hills: [
      { color: '#f0c0a6', base: 0.80, amp: 28, freq: 1.1, phase: 1.1, alpha: 0.85 },
      { color: '#d5967d', base: 0.87, amp: 22, freq: 1.6, phase: 3.0, alpha: 0.9 },
      { color: '#b46f5c', base: 0.94, amp: 16, freq: 2.0, phase: 5.0, alpha: 0.95 },
    ],
    birdColor: 'rgba(110,70,70,0.55)',
    flowerColors: ['#ffd166', '#ff8fab', '#fff0d0'],
    danger: 'rgba(255,90,90,0.65)',
  },
  pinyin: {
    sky: ['#121a38', '#26315e', '#46588f', '#8fa6ce'],
    orb: { type: 'moon', x: 0.83, y: 0.17, r: 30, color: '#fff3c4', glow: 'rgba(255,243,196,0.45)' },
    cloud: 'rgba(130,150,200,0.28)',
    cloudCount: 5,
    cloudAlpha: [0.25, 0.5],
    starCount: 55,
    starColor: 'rgba(255,255,255,0.95)',
    birdCount: 0,
    balloonCount: 0,
    fireflyCount: 20,
    lanternCount: 5,
    rainbow: false,
    hills: [
      { color: '#1a2648', base: 0.80, amp: 26, freq: 1.2, phase: 0.7, alpha: 0.9 },
      { color: '#223258', base: 0.87, amp: 20, freq: 1.7, phase: 2.6, alpha: 0.95 },
      { color: '#2b3f6c', base: 0.94, amp: 14, freq: 2.2, phase: 4.5, alpha: 1 },
    ],
    birdColor: 'rgba(180,200,240,0.4)',
    flowerColors: ['#ffd166', '#ff8fab', '#9ad1ff'],
    danger: 'rgba(255,120,120,0.7)',
  },
};

/* localStorage 有时在 file:// 下被禁，包一层保护 */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 忽略 */ } },
};

/* 速度档位（开始界面可选，自动记住） */
const SPEEDS = {
  slow:   { speed: 0.65, intervalFactor: 1.45 },
  normal: { speed: 1,    intervalFactor: 1 },
  fast:   { speed: 1.45, intervalFactor: 0.72 },
};
let speedSetting = store.get('youxi-speed');
if (!SPEEDS[speedSetting]) speedSetting = 'normal';

/* ---------------- 音效（Web Audio 现场合成，无音频文件） ---------------- */
const SFX = {
  ctx: null,
  muted: store.get('youxi-muted') === '1',
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(freq, dur, type = 'sine', vol = 0.15, when = 0) {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  },
  correct(combo) { this.tone(620 + Math.min(combo, 24) * 22, 0.14, 'triangle', 0.16); },
  cheer() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.14, i * 0.07)); },
  levelUp() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.15, 'triangle', 0.15, i * 0.08)); },
  wrong() { this.tone(140, 0.2, 'square', 0.06); },
  lifeLost() { [392, 311, 262].forEach((f, i) => this.tone(f, 0.22, 'sine', 0.15, i * 0.12)); },
  gameOver() { [523, 440, 349, 262].forEach((f, i) => this.tone(f, 0.3, 'sine', 0.14, i * 0.16)); },
  toggle() {
    this.muted = !this.muted;
    store.set('youxi-muted', this.muted ? '1' : '0');
    return this.muted;
  },
};

/* ---------------- 正确读音（浏览器自带语音合成） ---------------- */
let speakTimer = null;

function cancelSpeech() {
  if (speakTimer) {
    clearTimeout(speakTimer);
    speakTimer = null;
  }
  if ('speechSynthesis' in window) {
    try { speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
  }
}

function voiceFor(lang) {
  if (!('speechSynthesis' in window)) return null;
  let voices = [];
  try { voices = speechSynthesis.getVoices(); } catch (e) { return null; }
  const prefix = lang.slice(0, 2).toLowerCase();
  const matched = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  if (!matched.length) return null;
  const preferred = /natural|neural|google|samantha|ava|allison|susan|karen|daniel|moira|tessa|fiona|aria|jenny|zira|tingting|meijia|yaoyao|xiaoxiao|yunxi/i;
  const novelty = /bad news|bahh|bells|boing|bubbles|cellos|wobble|jester|organ|superstar|trinoids|whisper|zarvox|albert|ralph|fred|kathy|grandma|grandpa|rocko|shelley|flo|junior|pipe organ|good news/i;
  return matched.find((v) => preferred.test(v.name)) ||
    matched.find((v) => !novelty.test(v.name)) ||
    matched[0];
}

function speakText(text, lang, rate) {
  if (SFX.muted || !text || !('speechSynthesis' in window)) return;
  if (state.screen !== 'game' || !state.running || state.paused) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.05;
    const voice = voiceFor(lang);
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  } catch (e) { /* 忽略不支持的环境 */ }
}

function speakAfterExplosion(text, lang, rate) {
  if (speakTimer) clearTimeout(speakTimer);
  // 等爆炸特效和音效放完再读，听感更清楚
  speakTimer = setTimeout(() => {
    speakTimer = null;
    speakText(text, lang, rate);
  }, 450);
}

/* ---------------- 状态 ---------------- */
const state = {
  screen: 'start',      // start | game | over
  mode: 'letter',
  running: false,
  paused: false,
  items: [],            // 掉落物
  particles: [],
  floats: [],           // 飘字
  clouds: [],
  stars: [],
  birds: [],
  balloons: [],
  fireflies: [],
  lanterns: [],
  shootingStars: [],
  flowers: [],
  shake: 0,             // 屏幕震动
  flash: 0,             // 全屏闪光
  flashColor: '255,255,255',
  hitCount: 0,
  shootTimer: 4,
  score: 0,
  combo: 0,
  bestCombo: 0,
  lives: 3,
  level: 1,
  nextRocket: 3600,     // 第 12 关后，下一次火箭庆祝的分数
  rocketCount: 0,
  spawnTimer: 0,        // 毫秒
  lockedId: null,       // 当前锁定的掉落物
  nextId: 1,
  time: 0,              // 游戏内累计秒数
};

/* ---------------- DOM ---------------- */
const $ = (id) => document.getElementById(id);
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
const stage = $('stage');

const keyboardPanel = $('keyboard-panel');
const fxLayer = $('level-fx');
const guideDot = $('guide-dot');
const guideLabel = $('guide-label');
const guideKey = $('guide-key');
const handEls = {
  left: document.querySelector('.hand-left'),
  right: document.querySelector('.hand-right'),
};
const keyEls = new Map();
const fingerEls = new Map();
const keyFlashTimers = new Map();
let lastGuideSig = null;

let W = 0;
let H = 0;
let bgGrad = null;

/* ---------------- 小工具 ---------------- */
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (n) => Math.floor(Math.random() * n);
const choice = (arr) => arr[randInt(arr.length)];

function popEl(el) {
  el.classList.remove('pop-anim');
  void el.offsetWidth; // 重新触发动画
  el.classList.add('pop-anim');
}

function rr(x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------------- 虚拟键盘与手指指导 ---------------- */
function buildKeyboard() {
  document.querySelectorAll('.kb-key').forEach((btn) => {
    const k = (btn.dataset.key || '').toLowerCase();
    if (!k) return;
    keyEls.set(k, btn);
    btn.tabIndex = -1;
    btn.title = `按 ${k.toUpperCase()}`;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (state.screen !== 'game' || !state.running || state.paused) return;
      SFX.ensure();
      flashKey(k);
      handleKey(k);
      if (btn.blur) btn.blur();
    });
  });

  document.querySelectorAll('.finger').forEach((el) => {
    const finger = el.dataset.finger;
    if (finger) fingerEls.set(finger, el);
  });
}

function flashKey(k) {
  const el = keyEls.get(k);
  if (!el) return;
  el.classList.add('pressed');
  const old = keyFlashTimers.get(k);
  if (old) clearTimeout(old);
  keyFlashTimers.set(k, setTimeout(() => {
    el.classList.remove('pressed');
    keyFlashTimers.delete(k);
  }, 130));
}

function updateKeyboardGuidance() {
  if (!keyEls.size) return;

  let primary = null;
  const nextKeys = new Set();
  for (const it of state.items) {
    if (it.typed >= it.seq.length) continue;
    const ch = it.seq[it.typed].toLowerCase();
    if (!KEY_FINGER[ch]) continue;
    nextKeys.add(ch);
    if (!primary || it.y > primary.y) primary = it;
  }

  // 已经锁定的目标优先，让提示跟着正在输入的词走
  if (state.lockedId != null) {
    const locked = state.items.find((it) => it.id === state.lockedId && it.typed < it.seq.length);
    if (locked) primary = locked;
  }

  const primaryKey = primary ? primary.seq[primary.typed].toLowerCase() : '';
  const primaryFinger = (primaryKey && KEY_FINGER[primaryKey]) || '';
  const sig = `${[...nextKeys].sort().join('')}|${primaryKey}|${primaryFinger}|${primary ? primary.id : ''}|${state.items.length}`;
  if (sig === lastGuideSig) return;
  lastGuideSig = sig;

  for (const [k, el] of keyEls) {
    el.classList.toggle('next', nextKeys.has(k));
    el.classList.toggle('primary', k === primaryKey);
  }

  for (const [finger, el] of fingerEls) {
    el.classList.toggle('active', finger === primaryFinger);
  }
  if (handEls.left) handEls.left.classList.toggle('active', primaryFinger.startsWith('l-'));
  if (handEls.right) handEls.right.classList.toggle('active', primaryFinger.startsWith('r-'));

  const info = FINGER_INFO[primaryFinger];
  if (info && primaryKey) {
    const color = info.color;
    guideLabel.textContent = info.name;
    guideLabel.style.color = '';
    guideKey.textContent = primaryKey.toUpperCase();
    guideKey.style.setProperty('--guide-color', color);
    guideDot.style.background = color;
    guideDot.style.boxShadow = `0 0 0 5px ${rgba(color, 0.18)}`;
    keyboardPanel.classList.add('guiding');
  } else {
    guideLabel.textContent = state.items.length ? '准备下一张卡片…' : '等待卡片…';
    guideLabel.style.color = '';
    guideKey.textContent = '';
    guideKey.style.removeProperty('--guide-color');
    guideDot.style.background = '';
    guideDot.style.boxShadow = '';
    keyboardPanel.classList.remove('guiding');
  }
}

/* ---------------- 难度曲线 ---------------- */
const speedMult = () => Math.min(2.3, 1 + (state.level - 1) * 0.13);
const interval = () => {
  const f = SPEEDS[speedSetting].intervalFactor;
  return Math.max(
    MODES[state.mode].minInterval * f,
    MODES[state.mode].baseInterval * f * Math.pow(0.92, state.level - 1)
  );
};

/* ---------------- 掉落物 ---------------- */
function buildCandidate() {
  const mode = state.mode;
  let seq = '';
  let hanzi = '';
  let trans = '';
  let w, h;

  if (mode === 'letter') {
    seq = choice(LETTERS).toLowerCase();
    ctx.font = FONT(42);
    w = Math.max(76, ctx.measureText(seq.toUpperCase()).width + 44);
    h = 76;
  } else if (mode === 'word') {
    const pair = choice(WORDS);
    seq = pair[0];
    trans = pair[1];
    ctx.font = FONT(26);
    const w1 = ctx.measureText(seq).width;
    ctx.font = FONT(15);
    const w2 = ctx.measureText(trans).width;
    w = Math.max(100, w1 + 44, w2 + 44);
    h = 76;
  } else {
    const pair = choice(PINYIN_CHARS);
    hanzi = pair[0];
    seq = pair[1];
    ctx.font = FONT(38);
    const w1 = ctx.measureText(hanzi).width;
    ctx.font = FONT(15);
    const w2 = ctx.measureText(seq).width;
    w = Math.max(96, w1 + 40, w2 + 44);
    h = 92;
  }

  return {
    id: state.nextId++,
    kind: mode,
    seq,
    hanzi,
    trans,
    typed: 0,
    x: 0,
    y: -h - 12,
    w,
    h,
    color: randInt(PALETTE.length),
    emoji: choice(ITEM_EMOJIS),
    wob: Math.random() * Math.PI * 2,
    shake: 0,
    vy: 0,
    flash: 0,
    scale: 1,
  };
}

function spawnItem() {
  let it = null;
  for (let t = 0; t < 12 && !it; t++) {
    const cand = buildCandidate();
    if (state.items.some((o) => o.seq === cand.seq && o.kind === cand.kind)) continue;
    it = cand;
  }
  if (!it) it = buildCandidate();

  // 顶部区域尽量不重叠，避免看不清
  let x = 8;
  for (let t = 0; t < 10; t++) {
    x = rand(8, Math.max(9, W - it.w - 8));
    const clash = state.items.some(
      (o) => o.y < H * 0.35 && x < o.x + o.w + 12 && o.x < x + it.w + 12
    );
    if (!clash) break;
  }
  it.x = x;
  state.items.push(it);
}

/* ---------------- 特效 ---------------- */
function pushParticle(p) {
  if (state.particles.length > 360) state.particles.shift();
  state.particles.push(p);
}

function burst(x, y, color, n, power) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const s = power * (0.35 + Math.random() * 0.65);
    pushParticle({
      type: 'dot',
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 60,
      size: 2.5 + Math.random() * 3.5,
      color,
      life: 0.45 + Math.random() * 0.35,
      max: 0.8,
      gravity: 480,
      drag: 0.6,
    });
  }
}

function sparkBurst(x, y, colors, n, power) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const s = power * (0.5 + Math.random() * 0.7);
    pushParticle({
      type: 'spark',
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      size: 2 + Math.random() * 2,
      color: choice(colors),
      life: 0.28 + Math.random() * 0.22,
      max: 0.5,
      gravity: 320,
      drag: 1.2,
    });
  }
}

function starBurst(x, y, colors, n, power) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const s = power * (0.35 + Math.random() * 0.75);
    pushParticle({
      type: 'star',
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 40,
      size: 5 + Math.random() * 6,
      color: choice(colors),
      rot: Math.random() * TAU,
      vrot: rand(-6, 6),
      life: 0.65 + Math.random() * 0.45,
      max: 1.1,
      gravity: 260,
      drag: 0.7,
    });
  }
}

function confettiBurst(x, y, n, power) {
  for (let i = 0; i < n; i++) {
    const a = rand(-Math.PI * 0.85, -Math.PI * 0.15);
    const s = power * (0.4 + Math.random() * 0.8);
    pushParticle({
      type: 'confetti',
      x, y,
      vx: Math.cos(a) * s + rand(-40, 40),
      vy: Math.sin(a) * s,
      w: 4 + Math.random() * 5,
      h: 8 + Math.random() * 7,
      color: choice(CONFETTI_COLORS),
      rot: Math.random() * TAU,
      vrot: rand(-8, 8),
      life: 0.9 + Math.random() * 0.6,
      max: 1.5,
      gravity: 360,
      drag: 0.5,
    });
  }
}

function emojiBurst(x, y, emojis, n, power) {
  for (let i = 0; i < n; i++) {
    const a = rand(-Math.PI * 0.9, -Math.PI * 0.1);
    const s = power * (0.35 + Math.random() * 0.65);
    pushParticle({
      type: 'emoji',
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 20,
      size: 16 + Math.random() * 12,
      text: choice(emojis),
      rot: rand(-0.5, 0.5),
      vrot: rand(-2.5, 2.5),
      life: 0.7 + Math.random() * 0.5,
      max: 1.2,
      gravity: -20,
      drag: 0.8,
    });
  }
}

function ring(x, y, color, radius, width, grow = 160) {
  pushParticle({
    type: 'ring',
    x, y,
    r: radius * 0.25,
    maxR: radius,
    grow,
    color,
    lineWidth: width,
    life: 0.42,
    max: 0.42,
  });
}

function flashScreen(color, alpha) {
  state.flash = Math.max(state.flash, alpha);
  state.flashColor = color;
}

function shakeScreen(amount) {
  state.shake = Math.max(state.shake, amount);
}

/* 每次敲对键时的随机小特效 */
function hitEffects(it) {
  const cx = it.x + it.w / 2;
  const cy = it.y + it.h / 2;
  const color = PALETTE[it.color][1];
  const style = state.hitCount % 5;
  state.hitCount++;

  burst(cx, cy, color, 3 + randInt(3), 100);

  if (style === 0) {
    sparkBurst(cx, cy, [color, '#ffd93d', '#ffffff'], 7, 240);
    ring(cx, cy, color, 34, 2.5, 150);
  } else if (style === 1) {
    starBurst(cx, cy, [color, '#ffd93d', '#ffffff'], 5, 200);
  } else if (style === 2) {
    confettiBurst(cx, cy, 7, 180);
  } else if (style === 3) {
    emojiBurst(cx, cy, HIT_EMOJIS, 2, 120);
    ring(cx, cy, '#ffd93d', 30, 2, 140);
  } else {
    ring(cx, cy, color, 24, 2.5, 130);
    ring(cx, cy, '#ffffff', 40, 1.5, 170);
  }
}

/* 整个词/字母被消灭时的大特效 */
function completeEffects(it) {
  const cx = it.x + it.w / 2;
  const cy = it.y + it.h / 2;
  const color = PALETTE[it.color][1];

  burst(cx, cy, color, 14, 260);
  starBurst(cx, cy, [color, '#ffd93d', '#ffffff', '#ff8fab'], 9, 280);
  confettiBurst(cx, cy, 16, 280);
  emojiBurst(cx, cy, BIG_EMOJIS, 3, 200);
  ring(cx, cy, color, 70, 4, 240);
  ring(cx, cy, '#ffd93d', 100, 2, 300);

  // 字母模式每次按键都会消灭一张卡，闪光和震动轻一点，避免太晃眼
  const isLetter = it.kind === 'letter';
  flashScreen('255,255,255', isLetter ? 0.09 : 0.16);
  shakeScreen(isLetter ? 2 : 5);
}

/* 5 连击的庆祝烟花 */
function milestoneEffects() {
  const x = rand(W * 0.2, W * 0.8);
  const y = rand(H * 0.18, H * 0.45);
  const colors = [choice(CONFETTI_COLORS), '#ffd93d', '#ffffff'];
  starBurst(x, y, colors, 10, 260);
  sparkBurst(x, y, colors, 8, 300);
  ring(x, y, '#ffd93d', 80, 3, 260);
  flashScreen('255,215,0', 0.1);
  shakeScreen(4);
}

function fireworks(n) {
  for (let i = 0; i < n; i++) {
    const x = rand(W * 0.15, W * 0.85);
    const y = rand(H * 0.15, H * 0.5);
    const colors = [choice(CONFETTI_COLORS), choice(CONFETTI_COLORS), '#ffffff'];
    starBurst(x, y, colors, 10, 280);
    sparkBurst(x, y, colors, 10, 340);
    ring(x, y, choice(CONFETTI_COLORS), 60, 2.5, 240);
  }
  flashScreen('255,255,255', 0.12);
  shakeScreen(6);
}

/* ---------------- 升级全屏庆祝动画 ---------------- */
const LEVEL_FX = [
  { name: '彩虹冲击波', emoji: '🌈', ink: '#ff5e7e', tint: 'radial-gradient(circle at 50% 34%, rgba(255,255,255,0.8), rgba(255,190,120,0.32) 42%, rgba(255,150,220,0.22) 70%, transparent 85%)' },
  { name: '太阳花绽放', emoji: '🌻', ink: '#f08c00', tint: 'radial-gradient(circle at 50% 34%, rgba(255,246,180,0.88), rgba(255,200,60,0.32) 48%, transparent 78%)' },
  { name: '气球升空', emoji: '🎈', ink: '#e84393', tint: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,120,160,0.24))' },
  { name: '星星雨', emoji: '🌟', ink: '#4d7cff', tint: 'linear-gradient(180deg, rgba(70,110,255,0.3), rgba(160,120,255,0.12) 60%, transparent)' },
  { name: '动物狂欢节', emoji: '🎪', ink: '#e8590c', tint: 'linear-gradient(120deg, rgba(255,90,140,0.28), rgba(255,210,70,0.2) 25%, rgba(80,220,160,0.22) 50%, rgba(80,150,255,0.24) 75%, rgba(190,100,255,0.28))' },
  { name: '爱心海洋', emoji: '💖', ink: '#ff4d8d', tint: 'radial-gradient(circle at 50% 34%, rgba(255,230,240,0.7), rgba(255,110,160,0.26) 55%, transparent 80%)' },
  { name: '彩带瀑布', emoji: '🎀', ink: '#e84393', tint: 'linear-gradient(180deg, rgba(255,215,240,0.45), rgba(255,170,215,0.18) 55%, transparent)' },
  { name: '彩虹音符', emoji: '🎹', ink: '#7b61ff', tint: 'linear-gradient(120deg, rgba(255,90,170,0.3), rgba(255,210,70,0.22) 30%, rgba(70,220,160,0.24) 55%, rgba(80,150,255,0.26) 78%, rgba(180,100,255,0.3))' },
  { name: '泡泡海洋', emoji: '🫧', ink: '#0096c7', tint: 'linear-gradient(180deg, rgba(120,220,255,0.22), rgba(200,245,255,0.12) 60%, transparent)' },
  { name: '彩虹喷泉', emoji: '⛲', ink: '#0ea5e9', tint: 'linear-gradient(180deg, rgba(120,220,255,0.22), rgba(180,140,255,0.22) 40%, rgba(255,150,210,0.2) 70%, rgba(80,200,180,0.24))' },
  { name: '彩虹万花筒', emoji: '🔮', ink: '#8e44ad', tint: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.42), rgba(255,120,220,0.22) 35%, rgba(80,180,255,0.2) 60%, rgba(120,80,255,0.18) 80%, transparent)' },
  { name: '冠军庆典', emoji: '🏆', ink: '#c98a00', tint: 'radial-gradient(circle at 50% 34%, rgba(255,240,160,0.8), rgba(255,190,40,0.3) 50%, rgba(255,150,0,0.1) 80%)' },
];

let fxCleanupTimer = null;
let fxStartTimer = null;
const FX_SLOW = 1.7; // 庆祝动画整体放慢倍率
const fxRand = (a, b) => a + Math.random() * (b - a);
// 从庆祝中心（屏幕上方 34%）到四角的最大距离，用来让特效铺满全屏
const fxMaxRadius = () => Math.hypot(window.innerWidth / 2, window.innerHeight * 0.66);

function fxClear() {
  if (fxCleanupTimer) { clearTimeout(fxCleanupTimer); fxCleanupTimer = null; }
  if (fxStartTimer) { clearTimeout(fxStartTimer); fxStartTimer = null; }
  if (!fxLayer) return;
  try {
    if (fxLayer.getAnimations) {
      for (const anim of fxLayer.getAnimations({ subtree: true })) {
        try { anim.cancel(); } catch (e) { /* 忽略 */ }
      }
    }
  } catch (e) { /* 忽略 */ }
  fxLayer.replaceChildren();
}

function fxAdd(el) {
  fxLayer.appendChild(el);
  return el;
}

function fxRun(el, frames, duration, delay = 0, easing = 'ease-out') {
  const anim = el.animate(frames, { duration: duration * FX_SLOW, delay: delay * FX_SLOW, easing, fill: 'both' });
  anim.onfinish = () => el.remove();
  return anim;
}

function fxEmoji(char, xVw, yVh, size, frames, duration, delay = 0, easing = 'ease-out') {
  const el = document.createElement('span');
  el.className = 'fx-particle';
  el.textContent = char;
  el.style.left = xVw + 'vw';
  el.style.top = yVh + 'vh';
  el.style.fontSize = size + 'px';
  fxAdd(el);
  fxRun(el, frames, duration, delay, easing);
  return el;
}

/* 单朵烟花：一圈彩色粒子 + 中心光环 */
function fxFireworkBurst(xVw, yVh, delay = 0) {
  const colors = [choice(CONFETTI_COLORS), choice(CONFETTI_COLORS), '#ffd93d', '#ffffff'];
  const min = Math.min(window.innerWidth, window.innerHeight) / 100;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU;
    const dist = fxRand(8, 24) * min;
    const dot = document.createElement('div');
    dot.className = 'fx-dot';
    dot.style.width = dot.style.height = fxRand(5, 9) + 'px';
    dot.style.background = choice(colors);
    dot.style.left = xVw + 'vw';
    dot.style.top = yVh + 'vh';
    fxAdd(dot);
    fxRun(dot, [
      { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) scale(0.2)`, opacity: 0 },
    ], fxRand(650, 950), delay + fxRand(0, 90), 'cubic-bezier(.15,.7,.3,1)');
  }
  const ring = document.createElement('div');
  ring.className = 'fx-ring';
  ring.style.width = ring.style.height = '70px';
  ring.style.borderWidth = '5px';
  ring.style.borderColor = choice(colors);
  ring.style.left = xVw + 'vw';
  ring.style.top = yVh + 'vh';
  fxAdd(ring);
  fxRun(ring, [
    { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.9 },
    { transform: 'translate(-50%, -50%) scale(1.8)', opacity: 0 },
  ], 520, delay, 'ease-out');
}

/* 1. 彩虹冲击波 */
function fxRainbow(vw, vh) {
  ['#ff6b6b', '#ffd93d', '#41d39f', '#4dabf7', '#b983ff'].forEach((color, i) => {
    const ring = document.createElement('div');
    ring.className = 'fx-ring';
    ring.style.borderColor = color;
    ring.style.left = '50%';
    ring.style.top = '34%';
    fxAdd(ring);
    fxRun(ring, [
      { transform: 'translate(-50%, -50%) scale(0.15)', opacity: 0.95 },
      { transform: 'translate(-50%, -50%) scale(6.5)', opacity: 0 },
    ], 1500, i * 110, 'cubic-bezier(.15,.65,.25,1)');
  });
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * TAU + fxRand(-0.08, 0.08);
    const dist = fxRand(18, 48) * vw;
    const shard = document.createElement('div');
    shard.className = 'fx-shard';
    shard.style.width = fxRand(6, 12) + 'px';
    shard.style.height = fxRand(10, 18) + 'px';
    shard.style.background = choice(CONFETTI_COLORS);
    shard.style.left = '50%';
    shard.style.top = '34%';
    fxAdd(shard);
    const mid = dist * 0.45;
    fxRun(shard, [
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * mid}px, ${Math.sin(a) * mid}px) rotate(${fxRand(120, 300)}deg)`, opacity: 1, offset: 0.25 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) rotate(${fxRand(360, 900)}deg)`, opacity: 0 },
    ], fxRand(1200, 1700), fxRand(0, 220), 'cubic-bezier(.2,.6,.4,1)');
  }
}

/* 2. 太阳花绽放 */
function fxSunflower(vw, vh) {
  for (let i = 0; i < 28; i++) {
    const ray = document.createElement('div');
    ray.className = 'fx-ray';
    ray.style.left = '50%';
    ray.style.top = '34%';
    ray.style.height = fxRand(24, 58) * vh + 'px';
    ray.style.background = 'linear-gradient(180deg, rgba(255,217,61,0), #ffd93d)';
    fxAdd(ray);
    const base = i * (360 / 28);
    fxRun(ray, [
      { transform: `translate(-50%, 0) rotate(${base}deg) scaleY(0)`, opacity: 0 },
      { transform: `translate(-50%, 0) rotate(${base}deg) scaleY(1)`, opacity: 0.85, offset: 0.38 },
      { transform: `translate(-50%, 0) rotate(${base + 16}deg) scaleY(1.1)`, opacity: 0 },
    ], fxRand(1300, 1700), fxRand(0, 180), 'cubic-bezier(.2,.7,.3,1)');
  }
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * TAU;
    fxEmoji('🌼', 50 + Math.cos(a) * fxRand(18, 42), 34 + Math.sin(a) * fxRand(16, 38), fxRand(24, 46), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(-90deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.1) rotate(0deg)', opacity: 1, offset: 0.45 },
      { transform: 'translate(-50%, -50%) scale(1.35) rotate(50deg)', opacity: 0 },
    ], fxRand(1100, 1600), fxRand(0, 260), 'ease-out');
  }
  for (let i = 0; i < 10; i++) {
    fxEmoji(choice(['🌻', '🌼', '🌸']), fxRand(4, 96), fxRand(5, 92), fxRand(30, 62), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(-60deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.95, offset: 0.4 },
      { transform: 'translate(-50%, -50%) scale(1.25) rotate(25deg)', opacity: 0 },
    ], fxRand(1600, 2300), fxRand(0, 600), 'ease-out');
  }
  fxEmoji('🌻', 50, 34, 96, [
    { transform: 'translate(-50%, -50%) scale(0) rotate(-120deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.25) rotate(10deg)', opacity: 1, offset: 0.38 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1, offset: 0.75 },
    { transform: 'translate(-50%, -50%) scale(1.5) rotate(25deg)', opacity: 0 },
  ], 1700, 0, 'ease-out');
}

/* 3. 气球升空 */
function fxBalloons(vw, vh) {
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('span');
    el.className = 'fx-particle';
    el.textContent = '🎈';
    el.style.left = fxRand(3, 97) + 'vw';
    el.style.top = '112vh';
    el.style.fontSize = fxRand(26, 56) + 'px';
    el.style.filter = `hue-rotate(${fxRand(0, 360)}deg) saturate(1.15)`;
    fxAdd(el);
    const drift = fxRand(-80, 80);
    const rise = fxRand(85, 135);
    fxRun(el, [
      { transform: 'translate(-50%, -50%) translate(0, 0) rotate(-8deg)', opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: `translate(-50%, -50%) translate(${drift * 0.45}px, -${rise * 0.55}vh) rotate(7deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(-50%, -50%) translate(${drift}px, -${rise}vh) rotate(-4deg)`, opacity: 0 },
    ], fxRand(1500, 2300), fxRand(0, 420), 'cubic-bezier(.25,.5,.4,1)');
  }
}

/* 4. 星星雨 */
function fxStarRain(vw, vh) {
  for (let i = 0; i < 48; i++) {
    fxEmoji(choice(['⭐', '✨', '🌟', '💫']), fxRand(0, 100), -8, fxRand(16, 40), [
      { transform: 'translate(-50%, -50%) translateY(0) rotate(0deg)', opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-90, 90)}px, 120vh) rotate(${fxRand(180, 720)}deg)`, opacity: 0.9 },
    ], fxRand(1300, 2100), fxRand(0, 780), 'cubic-bezier(.2,.35,.45,1)');
  }
}

/* 5. 动物狂欢节 */
function fxAnimalParade(vw, vh) {
  const animals = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐷', '🐮', '🦄', '🐧', '🐻', '🐹'];

  // 左右两边进场、横穿整个屏幕的小动物
  for (let i = 0; i < 40; i++) {
    const fromLeft = i % 2 === 0;
    const startX = fromLeft ? -10 : 110;
    const endX = fromLeft ? 110 : -10;
    const at = (t) => startX + (endX - startX) * t;
    const el = document.createElement('span');
    el.className = 'fx-particle';
    el.textContent = animals[i % animals.length];
    el.style.left = '0';
    el.style.top = fxRand(6, 94) + 'vh';
    el.style.fontSize = fxRand(38, 78) + 'px';
    el.style.zIndex = '2';
    el.style.filter = 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.16))';
    fxAdd(el);
    fxRun(el, [
      { transform: `translate(-50%, -50%) translateX(${startX}vw) scale(0.7)`, opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { transform: `translate(-50%, calc(-50% - ${fxRand(10, 22)}px)) translateX(${at(0.34)}vw) rotate(${fromLeft ? 5 : -5}deg) scale(1)`, opacity: 1, offset: 0.36 },
      { transform: `translate(-50%, calc(-50% + ${fxRand(10, 22)}px)) translateX(${at(0.64)}vw) rotate(${fromLeft ? -4 : 4}deg) scale(1.04)`, opacity: 1, offset: 0.66 },
      { transform: `translate(-50%, -50%) translateX(${endX}vw) scale(0.85)`, opacity: 0 },
    ], fxRand(1900, 2700), fxRand(0, 500), 'linear');
  }

  // 彩色纸屑从天上落下，铺满全屏
  for (let i = 0; i < 26; i++) {
    const shard = document.createElement('div');
    shard.className = 'fx-shard';
    shard.style.width = fxRand(6, 12) + 'px';
    shard.style.height = fxRand(10, 20) + 'px';
    shard.style.background = choice(CONFETTI_COLORS);
    shard.style.left = fxRand(0, 100) + 'vw';
    shard.style.top = '-8vh';
    fxAdd(shard);
    fxRun(shard, [
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 0 },
      { opacity: 0.95, offset: 0.1 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-70, 70)}px, 115vh) rotate(${fxRand(360, 900)}deg)`, opacity: 0.85 },
    ], fxRand(1700, 2400), fxRand(0, 500), 'cubic-bezier(.2,.4,.45,1)');
  }

  // 散落全屏的小脚印
  for (let i = 0; i < 20; i++) {
    fxEmoji('🐾', fxRand(3, 97), fxRand(8, 92), fxRand(18, 36), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(-25deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.9, offset: 0.4 },
      { transform: 'translate(-50%, -50%) scale(0.6) rotate(20deg)', opacity: 0 },
    ], fxRand(1000, 1500), fxRand(0, 900), 'ease-out');
  }

  // 中间的马戏团大帐篷
  fxEmoji('🎪', 50, 34, 120, [
    { transform: 'translate(-50%, -50%) scale(0) rotate(-15deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.1) rotate(3deg)', opacity: 1, offset: 0.35 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.95, offset: 0.7 },
    { transform: 'translate(-50%, -50%) scale(1.3) rotate(8deg)', opacity: 0 },
  ], 1900, 0, 'ease-out');
}

/* 6. 爱心海洋 */
function fxHearts(vw, vh) {
  const maxR = fxMaxRadius();

  // 从中心向整屏炸开的爱心
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * TAU + fxRand(-0.09, 0.09);
    const dist = fxRand(0.5, 1.18) * maxR;
    fxEmoji(choice(['💖', '💕', '💗', '❤️', '💛', '💘', '💝']), 50, 34, fxRand(22, 54), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(-15deg)', opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist * 0.42}px, ${Math.sin(a) * dist * 0.42}px) scale(1.15) rotate(10deg)`, opacity: 1, offset: 0.34 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) scale(0.55) rotate(-8deg)`, opacity: 0 },
    ], fxRand(1400, 2100), fxRand(0, 260), 'cubic-bezier(.2,.6,.4,1)');
  }

  // 从屏幕底部升起的爱心，铺满下半屏
  for (let i = 0; i < 42; i++) {
    const el = document.createElement('span');
    el.className = 'fx-particle';
    el.textContent = choice(['💖', '💕', '💗', '❤️', '💛', '💘', '💝']);
    el.style.left = fxRand(1, 99) + 'vw';
    el.style.top = '112vh';
    el.style.fontSize = fxRand(22, 52) + 'px';
    fxAdd(el);
    const drift = fxRand(-80, 80);
    const rise = fxRand(98, 140);
    fxRun(el, [
      { transform: 'translate(-50%, -50%) scale(0.3) rotate(-12deg)', opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { transform: `translate(-50%, -50%) translate(${drift * 0.5}px, -${rise * 0.55}vh) scale(1.05) rotate(9deg)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(-50%, -50%) translate(${drift}px, -${rise}vh) scale(1.25) rotate(-6deg)`, opacity: 0 },
    ], fxRand(1600, 2400), fxRand(0, 550), 'ease-in-out');
  }

  // 中心大爱心
  fxEmoji('💖', 50, 34, 110, [
    { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.3)', opacity: 1, offset: 0.3 },
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.7 },
    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
  ], 1600, 0, 'ease-out');
}

/* 7. 彩带瀑布 */
function fxRibbons(vw, vh) {
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#b983ff', '#ff9f43', '#ff8fab', '#00c2a8'];
  for (let i = 0; i < 44; i++) {
    const el = document.createElement('div');
    el.className = 'fx-ribbon';
    const w = fxRand(8, 20);
    el.style.width = w + 'px';
    el.style.height = fxRand(16, 34) + 'vh';
    el.style.left = fxRand(-2, 100) + 'vw';
    el.style.top = '-45vh';
    el.style.background = `linear-gradient(180deg, ${choice(colors)}, ${choice(colors)})`;
    el.style.borderRadius = w / 2 + 'px';
    el.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.28)';
    fxAdd(el);
    const sway = fxRand(40, 150) * (i % 2 ? 1 : -1);
    const rot = fxRand(-45, 45);
    const fall = fxRand(150, 185);
    fxRun(el, [
      { transform: 'translate(-50%, 0) rotate(0deg)', opacity: 0 },
      { transform: `translate(-50%, 12vh) rotate(${rot * 0.4}deg)`, opacity: 0.95, offset: 0.12 },
      { transform: `translate(calc(-50% + ${sway}px), ${fall * 0.55}vh) rotate(${rot}deg)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(calc(-50% - ${sway * 0.6}px), ${fall}vh) rotate(${-rot}deg)`, opacity: 0.85 },
    ], fxRand(2000, 2600), fxRand(0, 500), 'ease-in-out');
  }

  // 满屏闪粉
  for (let i = 0; i < 30; i++) {
    fxEmoji(choice(['✨', '⭐', '💫']), fxRand(0, 100), fxRand(0, 100), fxRand(14, 32), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1) rotate(60deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(-50%, -50%) scale(0.2) rotate(150deg)', opacity: 0 },
    ], fxRand(1000, 1600), fxRand(0, 900), 'ease-out');
  }
}

/* 8. 彩虹音符 */
function fxMusicNotes(vw, vh) {
  const palette = ['#ff4d8d', '#ff8a3d', '#ffd93d', '#41d39f', '#4dabf7', '#b983ff', '#ff5ecb', '#00d4ff'];
  const glyphs = ['♪', '♫', '♬', '♩'];
  const glow = (el, color) => {
    el.style.color = color;
    el.style.fontFamily = '"Arial Black", "PingFang SC", system-ui, sans-serif';
    el.style.textShadow = `0 0 10px ${color}, 0 0 26px ${color}, 0 0 48px ${color}`;
  };

  // 从底部升起的彩色音符
  for (let i = 0; i < 52; i++) {
    const color = palette[i % palette.length];
    const x1 = fxRand(-90, 90);
    const x2 = fxRand(-130, 130);
    const y1 = fxRand(55, 82);
    const y2 = fxRand(112, 150);
    const el = fxEmoji(choice(glyphs), fxRand(3, 97), 112, fxRand(30, 64), [
      { transform: 'translate(-50%, -50%) rotate(-20deg) scale(0.6)', opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { transform: `translate(-50%, -50%) translate(${x1}px, -${y1}vh) rotate(${fxRand(-25, 25)}deg) scale(1)`, opacity: 1, offset: 0.6 },
      { transform: `translate(-50%, -50%) translate(${x2}px, -${y2}vh) rotate(${fxRand(-35, 35)}deg) scale(1.15)`, opacity: 0 },
    ], fxRand(1600, 2400), fxRand(0, 550), 'ease-in-out');
    glow(el, color);
  }

  // 从中心向四周绽放的音符
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU + fxRand(-0.1, 0.1);
    const dist = fxRand(0.35, 1.05) * fxMaxRadius();
    const color = palette[(i + 3) % palette.length];
    const el = fxEmoji(choice(glyphs), 50, 34, fxRand(28, 56), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(-30deg)', opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist * 0.45}px, ${Math.sin(a) * dist * 0.45}px) scale(1.2) rotate(20deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) scale(0.5) rotate(-10deg)`, opacity: 0 },
    ], fxRand(1400, 2000), fxRand(0, 220), 'cubic-bezier(.2,.6,.4,1)');
    glow(el, color);
  }

  // 彩色乐器一起摇摆
  const instruments = ['🎸', '🎺', '🎷', '🎹', '🥁', '🎤', '🪕', '🎻'];
  for (let i = 0; i < 14; i++) {
    const el = fxEmoji(instruments[i % instruments.length], fxRand(4, 96), 112, fxRand(30, 56), [
      { transform: 'translate(-50%, -50%) rotate(-12deg) scale(0.7)', opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-60, 60)}px, -${fxRand(60, 86)}vh) rotate(${fxRand(-18, 18)}deg) scale(1)`, opacity: 1, offset: 0.6 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-100, 100)}px, -${fxRand(105, 135)}vh) rotate(${fxRand(-25, 25)}deg) scale(1.1)`, opacity: 0 },
    ], fxRand(1700, 2400), fxRand(0, 600), 'ease-in-out');
    el.style.filter = `hue-rotate(${fxRand(0, 40)}deg) drop-shadow(0 0 12px rgba(255, 255, 255, 0.65))`;
  }

  // 底部的彩色音浪条
  for (let i = 0; i < 28; i++) {
    const color = palette[i % palette.length];
    const bar = document.createElement('div');
    bar.className = 'fx-eq';
    bar.style.left = ((i + 0.5) / 28) * 100 + 'vw';
    bar.style.width = '3.6vw';
    bar.style.height = fxRand(6, 20) + 'vh';
    bar.style.background = `linear-gradient(180deg, ${color}, ${palette[(i + 3) % palette.length]})`;
    bar.style.boxShadow = `0 0 18px ${color}`;
    bar.style.opacity = '0';
    fxAdd(bar);
    fxRun(bar, [
      { transform: 'translate(-50%, 100%) scaleY(0.2)', opacity: 0 },
      { transform: 'translate(-50%, 0) scaleY(1)', opacity: 0.85, offset: 0.25 },
      { transform: `translate(-50%, 0) scaleY(${fxRand(0.35, 0.9)})`, opacity: 0.8, offset: 0.55 },
      { transform: 'translate(-50%, 0) scaleY(1.1)', opacity: 0.85, offset: 0.75 },
      { transform: 'translate(-50%, 30%) scaleY(0.1)', opacity: 0 },
    ], fxRand(1200, 1800), i * 40, 'ease-in-out');
  }

  // 满屏闪粉
  for (let i = 0; i < 26; i++) {
    fxEmoji(choice(['✨', '💫']), fxRand(0, 100), fxRand(0, 100), fxRand(14, 30), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.1) rotate(90deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(-50%, -50%) scale(0.2) rotate(180deg)', opacity: 0 },
    ], fxRand(1000, 1500), fxRand(0, 900), 'ease-out');
  }
}

/* 9. 泡泡海洋 */
function fxBubbles(vw, vh) {
  for (let i = 0; i < 38; i++) {
    const size = fxRand(12, 66);
    const el = document.createElement('div');
    el.className = 'fx-bubble';
    el.style.width = el.style.height = size + 'px';
    el.style.left = fxRand(2, 98) + 'vw';
    el.style.top = '112vh';
    fxAdd(el);
    const drift = fxRand(-60, 60);
    const y1 = fxRand(55, 78);
    const y2 = fxRand(108, 145);
    fxRun(el, [
      { transform: 'translate(-50%, -50%) scale(0.35)', opacity: 0 },
      { opacity: 0.9, offset: 0.15 },
      { transform: `translate(-50%, -50%) translate(${drift * 0.5}px, -${y1}vh) scale(1)`, opacity: 0.85, offset: 0.6 },
      { transform: `translate(-50%, -50%) translate(${drift}px, -${y2}vh) scale(1.15)`, opacity: 0 },
    ], fxRand(1800, 2600), fxRand(0, 500), 'ease-in-out');
  }
}

/* 10. 彩虹喷泉 */
function fxFountain(vw, vh) {
  const palette = ['#ff4d8d', '#ff8a3d', '#ffd93d', '#41d39f', '#4dabf7', '#b983ff', '#ff5ecb', '#00d4ff'];
  const sources = [12, 30, 50, 70, 88];

  // 底部的彩虹光池
  const base = document.createElement('div');
  base.className = 'fx-fountain-base';
  base.style.background = 'linear-gradient(90deg, #ff4d8d, #ff8a3d, #ffd93d, #41d39f, #4dabf7, #b983ff, #ff5ecb)';
  fxAdd(base);
  fxRun(base, [
    { transform: 'translateX(-50%) scaleY(0.4)', opacity: 0 },
    { transform: 'translateX(-50%) scaleY(1)', opacity: 0.85, offset: 0.2 },
    { transform: 'translateX(-50%) scaleY(0.9)', opacity: 0.7, offset: 0.7 },
    { transform: 'translateX(-50%) scaleY(0.5)', opacity: 0 },
  ], 2000, 0, 'ease-out');

  // 五个喷泉一起喷出彩色水珠，铺满整个屏幕
  sources.forEach((sx, si) => {
    for (let i = 0; i < 24; i++) {
      const color = palette[(i + si * 3) % palette.length];
      const drift = fxRand(-16, 16);
      const h = fxRand(34, 72);
      const size = fxRand(6, 14);
      const dot = document.createElement('div');
      dot.className = 'fx-dot';
      dot.style.width = dot.style.height = size + 'px';
      dot.style.background = color;
      dot.style.boxShadow = `0 0 ${size}px ${color}, 0 0 ${size * 2.2}px ${color}`;
      dot.style.left = sx + 'vw';
      dot.style.top = '102vh';
      fxAdd(dot);
      fxRun(dot, [
        { transform: 'translate(-50%, -50%) translate(0, 0) scale(0.5)', opacity: 0 },
        { opacity: 1, offset: 0.1 },
        { transform: `translate(-50%, -50%) translate(${drift * 0.4}vw, -${h}vh) scale(1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(-50%, -50%) translate(${drift * 0.8}vw, -${h * 0.55}vh) scale(0.8)`, opacity: 0.9, offset: 0.75 },
        { transform: `translate(-50%, -50%) translate(${drift}vw, -2vh) scale(0.4)`, opacity: 0 },
      ], fxRand(1500, 2100), fxRand(0, 900), 'cubic-bezier(.25,.5,.5,1)');
    }
  });

  // 跟着水花升起的小星星和水滴
  for (let i = 0; i < 28; i++) {
    const sx = choice(sources);
    const drift = fxRand(-14, 14);
    const h = fxRand(36, 70);
    fxEmoji(choice(['✨', '💧', '💎', '⭐']), sx, 102, fxRand(16, 34), [
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { transform: `translate(calc(-50% + ${drift * 0.4}vw), calc(-50% - ${h}vh)) scale(1) rotate(40deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${drift}vw), calc(-50% - 2vh)) scale(0.4) rotate(120deg)`, opacity: 0 },
    ], fxRand(1500, 2100), fxRand(0, 900), 'cubic-bezier(.25,.5,.5,1)');
  }

  // 中间的大彩虹
  fxEmoji('🌈', 50, 30, 130, [
    { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.05)', opacity: 0.95, offset: 0.35 },
    { transform: 'translate(-50%, -50%) scale(0.95)', opacity: 0.9, offset: 0.72 },
    { transform: 'translate(-50%, -50%) scale(1.25)', opacity: 0 },
  ], 2000, 0, 'ease-out');
}

/* 11. 彩虹万花筒 */
function fxKaleidoscope(vw, vh) {
  const palette = ['#ff4d8d', '#ff8a3d', '#ffd93d', '#41d39f', '#4dabf7', '#b983ff', '#ff5ecb', '#00d4ff'];
  const seg = 360 / 16;
  const stops = [];
  for (let i = 0; i < 16; i++) {
    const c = palette[i % palette.length];
    stops.push(`${c} ${i * seg}deg ${(i + 1) * seg}deg`);
  }
  const wheel = `conic-gradient(from 0deg, ${stops.join(', ')})`;

  // 巨型彩色万花筒圆盘
  for (let i = 0; i < 7; i++) {
    const disc = document.createElement('div');
    disc.className = 'fx-kaleido';
    disc.style.width = disc.style.height = fxRand(40, 95) + 'vw';
    disc.style.left = fxRand(10, 90) + 'vw';
    disc.style.top = fxRand(12, 88) + 'vh';
    disc.style.background = wheel;
    disc.style.filter = `blur(${fxRand(0, 2)}px) saturate(1.3)`;
    fxAdd(disc);
    const dir = i % 2 ? -1 : 1;
    fxRun(disc, [
      { transform: 'translate(-50%, -50%) rotate(0deg) scale(0.3)', opacity: 0 },
      { opacity: 0.8, offset: 0.22 },
      { transform: `translate(-50%, -50%) rotate(${dir * 220}deg) scale(1)`, opacity: 0.7, offset: 0.62 },
      { transform: `translate(-50%, -50%) rotate(${dir * 400}deg) scale(1.2)`, opacity: 0 },
    ], fxRand(2400, 2800), i * 80, 'linear');
  }

  // 向四周飞散的棱镜碎片
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * TAU + fxRand(-0.06, 0.06);
    const dist = fxRand(0.3, 1.1) * fxMaxRadius();
    const size = fxRand(14, 36);
    const el = document.createElement('div');
    el.className = 'fx-prism';
    el.style.width = el.style.height = size + 'px';
    el.style.background = `linear-gradient(135deg, ${choice(palette)}, ${choice(palette)})`;
    el.style.left = '50%';
    el.style.top = '34%';
    fxAdd(el);
    fxRun(el, [
      { transform: 'translate(-50%, -50%) rotate(0deg) scale(0)', opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist * 0.4}px, ${Math.sin(a) * dist * 0.4}px) rotate(${fxRand(60, 160)}deg) scale(1)`, opacity: 0.95, offset: 0.35 },
      { transform: `translate(-50%, -50%) translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) rotate(${fxRand(220, 480)}deg) scale(0.5)`, opacity: 0 },
    ], fxRand(1600, 2200), fxRand(0, 300), 'cubic-bezier(.2,.6,.4,1)');
  }

  // 满屏钻石和闪光
  for (let i = 0; i < 44; i++) {
    fxEmoji(choice(['✨', '💎', '💫', '⭐']), fxRand(2, 98), fxRand(4, 96), fxRand(16, 40), [
      { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.15) rotate(90deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(-50%, -50%) scale(0.3) rotate(200deg)', opacity: 0 },
    ], fxRand(1200, 1800), fxRand(0, 900), 'ease-out');
  }

  // 中心的彩虹星芒
  fxEmoji('🔮', 50, 34, 110, [
    { transform: 'translate(-50%, -50%) scale(0) rotate(-20deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.15) rotate(4deg)', opacity: 1, offset: 0.35 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0.95, offset: 0.72 },
    { transform: 'translate(-50%, -50%) scale(1.4) rotate(10deg)', opacity: 0 },
  ], 1900, 0, 'ease-out');
}

/* 12. 冠军庆典 */
function fxChampion(vw, vh) {
  ['#ffd93d', '#fff3b0', '#ffb300'].forEach((color, i) => {
    const ring = document.createElement('div');
    ring.className = 'fx-ring';
    ring.style.borderColor = color;
    ring.style.left = '50%';
    ring.style.top = '34%';
    fxAdd(ring);
    fxRun(ring, [
      { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.95 },
      { transform: 'translate(-50%, -50%) scale(5.2)', opacity: 0 },
    ], 1400, i * 150, 'cubic-bezier(.2,.65,.3,1)');
  });
  for (let i = 0; i < 80; i++) {
    const shard = document.createElement('div');
    shard.className = 'fx-shard';
    shard.style.width = fxRand(5, 11) + 'px';
    shard.style.height = fxRand(9, 18) + 'px';
    shard.style.background = choice(['#ffd93d', '#ffe066', '#ffb300', '#fff3b0', '#ff8a3d']);
    shard.style.left = fxRand(0, 100) + 'vw';
    shard.style.top = '-10vh';
    fxAdd(shard);
    fxRun(shard, [
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-80, 80)}px, 120vh) rotate(${fxRand(360, 900)}deg)`, opacity: 0.9 },
    ], fxRand(1600, 2400), fxRand(0, 600), 'cubic-bezier(.2,.4,.45,1)');
  }
  [[22, 22], [78, 22], [30, 46], [70, 46]].forEach(([x, y], i) => fxFireworkBurst(x, y, 180 + i * 180));
  fxEmoji('🏆', 50, 34, 120, [
    { transform: 'translate(-50%, -50%) scale(0) rotate(-20deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.3) rotate(6deg)', opacity: 1, offset: 0.3 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1, offset: 0.68 },
    { transform: 'translate(-50%, -50%) scale(1.25) rotate(10deg)', opacity: 0 },
  ], 2000, 0, 'ease-out');
  fxEmoji('👑', 50, 20, 54, [
    { transform: 'translate(-50%, -50%) scale(0) rotate(-30deg)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.2) rotate(8deg)', opacity: 1, offset: 0.4 },
    { transform: 'translate(-50%, -50%) scale(1) rotate(-6deg)', opacity: 0.95, offset: 0.8 },
    { transform: 'translate(-50%, -50%) scale(1.3) rotate(0deg)', opacity: 0 },
  ], 2000, 150, 'ease-out');
}

function fxBanner(emoji, title, sub, ink) {
  const banner = document.createElement('div');
  banner.className = 'fx-banner';
  banner.style.setProperty('--fx-ink', ink);
  banner.innerHTML = `<div class="fx-banner-emoji">${emoji}</div><div class="fx-banner-title">${title}</div><div class="fx-banner-sub">${sub}</div>`;
  fxAdd(banner);
  return banner;
}

function playLevelCelebration(level) {
  if (!fxLayer) return;
  fxClear();
  const idx = Math.max(0, Math.min(LEVEL_FX.length - 1, level - 1));
  const cfg = LEVEL_FX[idx];
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;

  const tint = document.createElement('div');
  tint.className = 'fx-tint';
  tint.style.background = cfg.tint;
  fxAdd(tint);
  const tintAnim = tint.animate(
    [{ opacity: 0 }, { opacity: 1, offset: 0.16 }, { opacity: 0 }],
    { duration: 1500 * FX_SLOW, easing: 'ease-out', fill: 'both' }
  );
  tintAnim.onfinish = () => tint.remove();

  fxBanner(cfg.emoji, `第 ${level} 关`, cfg.name, cfg.ink);

  const builders = [fxRainbow, fxSunflower, fxBalloons, fxStarRain, fxAnimalParade, fxHearts, fxRibbons, fxMusicNotes, fxBubbles, fxFountain, fxKaleidoscope, fxChampion];
  builders[idx](vw, vh);

  // 每一关在原有动画的基础上，再额外发射一枚火箭
  spawnRocketFX();

  fxCleanupTimer = setTimeout(() => {
    fxCleanupTimer = null;
    fxClear();
  }, 5800);
}

/* 火箭穿屏动画：可单独使用，也可叠加在关卡庆祝上 */
function spawnRocketFX() {
  const Wpx = window.innerWidth;
  const Hpx = window.innerHeight;
  const startX = -0.2 * Wpx;
  const startY = 1.15 * Hpx;
  const endX = 1.12 * Wpx;
  const endY = -0.28 * Hpx;

  // 大火箭本体：从左下角斜穿整个屏幕飞到右上角
  const rocket = document.createElement('span');
  rocket.className = 'fx-particle';
  rocket.textContent = '🚀';
  rocket.style.left = '0';
  rocket.style.top = '0';
  rocket.style.fontSize = Math.max(140, Math.min(340, Math.min(Wpx, Hpx) * 0.34)) + 'px';
  rocket.style.zIndex = '4';
  rocket.style.filter = 'drop-shadow(0 10px 24px rgba(0,0,0,0.25))';
  fxAdd(rocket);
  fxRun(rocket, [
    { transform: `translate(-50%, -50%) translate(${startX}px, ${startY}px) scale(0.7) rotate(-8deg)`, opacity: 0 },
    { transform: `translate(-50%, -50%) translate(${startX + (endX - startX) * 0.12}px, ${startY + (endY - startY) * 0.12}px) scale(0.9) rotate(0deg)`, opacity: 1, offset: 0.12 },
    { transform: `translate(-50%, -50%) translate(${startX + (endX - startX) * 0.55}px, ${startY + (endY - startY) * 0.55}px) scale(1.05) rotate(0deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate(-50%, -50%) translate(${endX}px, ${endY}px) scale(1.2) rotate(6deg)`, opacity: 0.95 },
  ], 2200, 0, 'cubic-bezier(.35,.1,.65,.9)');

  // 火焰和烟雾尾迹
  for (let i = 0; i < 60; i++) {
    const t = Math.random();
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    const dot = document.createElement('div');
    dot.className = 'fx-dot';
    const size = fxRand(6, 22) * (0.7 + t * 0.8);
    dot.style.width = dot.style.height = size + 'px';
    dot.style.background = choice(['#ffd93d', '#ffb347', '#ff6b3d', '#fff3b0', 'rgba(255,255,255,0.9)']);
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.zIndex = '3';
    fxAdd(dot);
    fxRun(dot, [
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { opacity: 0.95, offset: 0.16 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-55, 25)}px, ${fxRand(20, 100)}px) scale(${fxRand(0.5, 1.1)})`, opacity: 0 },
    ], fxRand(600, 1100), t * 2200, 'ease-out');
  }

  // 尾部的火苗和小星星
  for (let i = 0; i < 22; i++) {
    const t = Math.random();
    const xVw = (startX + (endX - startX) * t) / Wpx * 100;
    const yVh = (startY + (endY - startY) * t) / Hpx * 100;
    fxEmoji(choice(['🔥', '💨', '✨']), xVw, yVh, fxRand(24, 54), [
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.95, offset: 0.2 },
      { transform: `translate(-50%, -50%) translate(${fxRand(-70, 10)}px, ${fxRand(30, 110)}px) scale(0.2) rotate(${fxRand(-30, 30)}deg)`, opacity: 0 },
    ], fxRand(700, 1200), t * 2200, 'ease-out');
  }

  // 起飞点冲击波
  const launchRing = document.createElement('div');
  launchRing.className = 'fx-ring';
  launchRing.style.left = '10vw';
  launchRing.style.top = '90vh';
  launchRing.style.borderColor = '#ffb347';
  fxAdd(launchRing);
  fxRun(launchRing, [
    { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.9 },
    { transform: 'translate(-50%, -50%) scale(3.6)', opacity: 0 },
  ], 900, 0, 'ease-out');
}

/* 12 关之后：每多 300 分发射一次大火箭 */
function playRocketCelebration(count = 1) {
  if (!fxLayer) return;
  fxClear();
  const sub = count > 1 ? `+300 分 · 第 ${count} 次发射` : '+300 分 · 继续冲！';

  const tint = document.createElement('div');
  tint.className = 'fx-tint';
  tint.style.background = 'radial-gradient(circle at 30% 80%, rgba(255,190,90,0.55), rgba(255,110,80,0.25) 40%, rgba(120,160,255,0.12) 75%, transparent)';
  fxAdd(tint);
  const tintAnim = tint.animate(
    [{ opacity: 0 }, { opacity: 1, offset: 0.18 }, { opacity: 0 }],
    { duration: 2200 * FX_SLOW, easing: 'ease-out', fill: 'both' }
  );
  tintAnim.onfinish = () => tint.remove();

  fxBanner('🚀', '火箭发射！', sub, '#ff6b3d');

  spawnRocketFX();

  flashScreen('255,200,120', 0.16);
  shakeScreen(5);
  SFX.cheer();

  fxCleanupTimer = setTimeout(() => {
    fxCleanupTimer = null;
    fxClear();
  }, 6800);
}

function scheduleOpeningCelebration() {
  if (fxStartTimer) clearTimeout(fxStartTimer);
  fxStartTimer = setTimeout(() => {
    fxStartTimer = null;
    if (state.screen === 'game' && state.running && !state.paused) playLevelCelebration(1);
  }, 520);
}

function addFloat(x, y, text, color, size) {
  state.floats.push({
    x: Math.min(Math.max(x, 60), Math.max(61, W - 60)),
    y,
    text,
    color,
    size,
    life: 1.4,
    age: 0,
  });
}

/* ---------------- HUD ---------------- */
function updateScore(pop = true) {
  $('score').textContent = state.score;
  if (pop) popEl($('chip-score'));
}
function updateCombo() {
  const chip = $('chip-combo');
  if (state.combo >= 2) {
    chip.classList.remove('hidden');
    $('combo').textContent = state.combo;
    popEl(chip);
  } else {
    chip.classList.add('hidden');
  }
}
function updateLevel() { $('level').textContent = state.level; }
function renderHearts() {
  $('lives').textContent = '❤️'.repeat(state.lives) + '🖤'.repeat(Math.max(0, 3 - state.lives));
}
function updateModeBests() {
  for (const m of ['letter', 'word', 'pinyin']) {
    const el = document.querySelector(`[data-best="${m}"]`);
    if (el) el.textContent = `🏆 最高分 ${+(store.get('youxi-best-' + m) || 0)}`;
  }
}

/* ---------------- 界面切换 ---------------- */
function showScreen(name) {
  state.screen = name;
  $('screen-start').classList.toggle('hidden', name !== 'start');
  $('screen-game').classList.toggle('hidden', name !== 'game');
  $('screen-over').classList.toggle('hidden', name !== 'over');
  if (name === 'start') updateModeBests();
}

/* ---------------- 游戏流程 ---------------- */
function startGame(mode) {
  cancelSpeech();
  fxClear();
  state.mode = mode;
  Object.assign(state, {
    items: [], particles: [], floats: [],
    shootingStars: [], shake: 0, flash: 0, hitCount: 0,
    score: 0, combo: 0, bestCombo: 0, lives: 3, level: 1,
    nextRocket: 3600, rocketCount: 0,
    spawnTimer: 600, lockedId: null,
    running: true, paused: false, time: 0,
  });
  updateScore(false);
  updateCombo();
  updateLevel();
  renderHearts();
  $('btn-pause').textContent = '⏸️';
  $('pause-overlay').classList.add('hidden');
  keyboardPanel.classList.remove('paused');
  lastGuideSig = null;
  showScreen('game');
  resize();
  updateKeyboardGuidance();
  scheduleOpeningCelebration();
}

function gameOver() {
  cancelSpeech();
  fxClear();
  state.running = false;
  const key = 'youxi-best-' + state.mode;
  const old = +(store.get(key) || 0);
  const isBest = state.score > old;
  if (isBest) store.set(key, String(state.score));

  $('over-title').textContent = isBest ? '🏆 新纪录！' : choice(OVER_TITLES);
  $('over-score').textContent = state.score;
  $('over-newbest').classList.toggle('hidden', !isBest);
  $('over-stats').textContent = `最高连击 ${state.bestCombo} · 闯到第 ${state.level} 关`;
  $('over-best').textContent = `${MODES[state.mode].name}最高分：${Math.max(old, state.score)}`;
  showScreen('over');
  SFX.gameOver();
}

function togglePause() {
  if (state.screen !== 'game' || !state.running) return;
  state.paused = !state.paused;
  $('pause-overlay').classList.toggle('hidden', !state.paused);
  $('btn-pause').textContent = state.paused ? '▶️' : '⏸️';
  keyboardPanel.classList.toggle('paused', state.paused);
  if (!state.paused) updateKeyboardGuidance();
  else {
    cancelSpeech();
    fxClear();
  }
}

function quitToMenu() {
  cancelSpeech();
  fxClear();
  state.running = false;
  state.paused = false;
  $('pause-overlay').classList.add('hidden');
  keyboardPanel.classList.remove('paused');
  showScreen('start');
}

/* ---------------- 打字逻辑 ---------------- */
function handleKey(k) {
  // 已锁定的目标优先
  let target = state.items.find((it) => it.id === state.lockedId && it.typed < it.seq.length) || null;
  if (target && target.seq[target.typed] === k) {
    hit(target);
    updateKeyboardGuidance();
    return;
  }

  // 换新目标：优先位置最低（最危险）的那个
  let best = null;
  for (const it of state.items) {
    if (it.seq[it.typed] === k && (!best || it.y > best.y)) best = it;
  }
  if (best) {
    state.lockedId = best.id;
    hit(best);
  } else {
    miss(target);
  }
  updateKeyboardGuidance();
}

function hit(it) {
  it.typed++;
  it.flash = 1;
  it.scale = 1.12;
  state.combo++;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  updateCombo();

  state.score += 10;
  SFX.correct(state.combo);
  hitEffects(it);

  if (state.combo % 5 === 0) {
    state.score += 25;
    addFloat(it.x + it.w / 2, it.y - 8, `🔥 ${state.combo} 连击 +25`, '#ff6b3d', 22);
    SFX.cheer();
    milestoneEffects();
  }

  if (it.typed >= it.seq.length) {
    completeEffects(it);
    removeItem(it);
    state.lockedId = null;
    state.score += 20;
    addFloat(it.x + it.w / 2, it.y + it.h / 2, '+30 ⭐', '#12a35b', 24);
    if (Math.random() < 0.35) addFloat(it.x + it.w / 2, it.y - 30, choice(PRAISES), '#ff8a3d', 20);
    SFX.cheer();
    if (it.kind === 'word') speakAfterExplosion(it.seq, 'en-US', 0.8);
    else if (it.kind === 'letter') speakAfterExplosion(LETTER_NAMES[it.seq] || it.seq, 'en-US', 0.8);
    else if (it.kind === 'pinyin') speakAfterExplosion(it.hanzi, 'zh-CN', 0.8);
  } else {
    addFloat(it.x + it.w / 2, it.y - 8, '+10', '#12a35b', 18);
  }
  updateScore();
}

function miss(target) {
  state.combo = 0;
  updateCombo();
  SFX.wrong();
  if (target) {
    target.shake = 0.3;
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    burst(cx, cy, '#ff8a8a', 4, 90);
    ring(cx, cy, '#ff6b6b', 30, 2, 120);
  }
  shakeScreen(1.5);
}

function removeItem(it) {
  const i = state.items.findIndex((o) => o.id === it.id);
  if (i >= 0) state.items.splice(i, 1);
}

function loseLife(it) {
  if (state.lockedId === it.id) state.lockedId = null;
  state.lives--;
  state.combo = 0;
  renderHearts();
  updateCombo();

  const cx = it.x + it.w / 2;
  const cy = Math.min(H - 24, it.y + it.h / 2);
  burst(cx, cy, '#ff5e7e', 12, 180);
  emojiBurst(cx, cy, ['💔', '💧'], 2, 100);
  ring(cx, cy, '#ff5e7e', 60, 3, 180);
  flashScreen('255,80,100', 0.16);
  shakeScreen(4);

  addFloat(cx, H - 80, '💔 溜走了…', '#e05656', 20);
  SFX.lifeLost();
  if (state.lives <= 0) gameOver();
}

/* ---------------- 主循环 ---------------- */
function update(dt) {
  state.time += dt;

  // 升级检测：每 300 分升一关
  const lv = Math.min(12, 1 + Math.floor(state.score / 300));
  if (lv > state.level) {
    state.level = lv;
    updateLevel();
    SFX.levelUp();
    fireworks(2);
    flashScreen('255,255,255', 0.12);
    playLevelCelebration(lv);
  }

  // 第 12 关之后，每多 300 分发射一次大火箭
  if (state.level >= 12 && state.score >= state.nextRocket) {
    state.rocketCount++;
    state.nextRocket = (Math.floor(state.score / 300) + 1) * 300;
    playRocketCelebration(state.rocketCount);
  }

  // 生成掉落物
  state.spawnTimer -= dt * 1000;
  if (state.spawnTimer <= 0) {
    if (state.items.length < 7) {
      spawnItem();
      state.spawnTimer = interval() * (0.85 + Math.random() * 0.3);
    } else {
      state.spawnTimer = 500;
    }
  }

  // 掉落物下落
  const vy = H * MODES[state.mode].baseSpeed * speedMult() * SPEEDS[speedSetting].speed;
  for (let i = state.items.length - 1; i >= 0; i--) {
    const it = state.items[i];
    it.vy = vy;
    it.y += it.vy * dt;
    if (it.shake > 0) it.shake -= dt;
    if (it.flash > 0) it.flash = Math.max(0, it.flash - dt * 5);
    it.scale += (1 - it.scale) * Math.min(1, dt * 14);
    if (it.y + it.h >= H - 6) {
      state.items.splice(i, 1);
      loseLife(it);
    }
  }

  // 粒子（圆点 / 星星 / 火花 / 彩纸 / 表情 / 冲击环）
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life -= dt;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
      continue;
    }
    if (p.type === 'ring') {
      p.r = Math.min(p.maxR, p.r + p.grow * dt);
      continue;
    }
    if (p.gravity) p.vy += p.gravity * dt;
    if (p.drag) {
      const f = Math.max(0, 1 - p.drag * dt);
      p.vx *= f;
      p.vy *= f;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.vrot) p.rot += p.vrot * dt;
  }

  // 飘字
  for (let i = state.floats.length - 1; i >= 0; i--) {
    const f = state.floats[i];
    f.age += dt;
    f.y -= 42 * dt;
    f.life -= dt;
    if (f.life <= 0) state.floats.splice(i, 1);
  }

  // 背景装饰
  const theme = currentTheme();
  for (const c of state.clouds) {
    c.x += c.s * dt;
    if (c.x > W + 160) {
      c.x = -160;
      c.y = rand(30, H * 0.5);
    }
  }
  for (const b of state.birds) {
    b.x += b.vx * dt;
    if (b.vx > 0 && b.x > W + 40) b.x = -40;
    if (b.vx < 0 && b.x < -40) b.x = W + 40;
  }
  for (const b of state.balloons) {
    b.x += b.vx * dt;
    b.phase += dt * b.bobSpeed;
    if (b.vx > 0 && b.x > W + 80) b.x = -80;
    if (b.vx < 0 && b.x < -80) b.x = W + 80;
  }
  for (const l of state.lanterns) {
    l.y -= l.vy * dt;
    l.x += Math.sin(state.time * 0.8 + l.phase) * 6 * dt;
    l.phase += dt;
    if (l.y < -40) {
      l.y = H + rand(20, 120);
      l.x = rand(0, W);
    }
  }
  for (const f of state.fireflies) f.phase += dt * f.speed;

  state.shootTimer -= dt;
  if (theme.starCount > 30 && state.shootTimer <= 0) {
    state.shootTimer = rand(5, 10);
    state.shootingStars.push({
      x: rand(W * 0.1, W * 0.8),
      y: rand(H * 0.05, H * 0.35),
      vx: rand(260, 420),
      vy: rand(90, 160),
      life: 1,
      max: 1,
    });
  }
  for (let i = state.shootingStars.length - 1; i >= 0; i--) {
    const s = state.shootingStars[i];
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life -= dt * 1.2;
    if (s.life <= 0) state.shootingStars.splice(i, 1);
  }

  // 震动 / 闪光衰减
  state.shake *= Math.exp(-dt * 7);
  if (state.shake < 0.05) state.shake = 0;
  state.flash = Math.max(0, state.flash - dt * 1.6);

  updateKeyboardGuidance();
}

function drawItem(it) {
  const wob = Math.sin(state.time * 2.2 + it.wob) * 4;
  const shakeX = it.shake > 0 ? Math.sin(it.shake * 45) * 7 * (it.shake / 0.3) : 0;
  const x = it.x + wob + shakeX;
  const y = it.y;
  const cx = x + it.w / 2;
  const cy = y + it.h / 2;
  const locked = state.lockedId === it.id;
  const [bg, edge] = PALETTE[it.color];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(it.scale, it.scale);
  ctx.translate(-cx, -cy);

  // 卡片阴影
  ctx.save();
  ctx.shadowColor = 'rgba(30, 90, 160, 0.2)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = bg;
  rr(x, y, it.w, it.h, 16);
  ctx.fill();
  ctx.restore();

  // 卡片本体
  if (locked) {
    ctx.shadowColor = 'rgba(255, 179, 0, 0.9)';
    ctx.shadowBlur = 18;
  }
  ctx.fillStyle = bg;
  rr(x, y, it.w, it.h, 16);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = locked ? 4 : 3;
  ctx.strokeStyle = locked ? '#ffb300' : edge;
  rr(x, y, it.w, it.h, 16);
  ctx.stroke();

  // 顶部高光
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 3);
  ctx.lineTo(x + it.w - 14, y + 3);
  ctx.stroke();

  // 锁定目标：转动的虚线框
  if (locked) {
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.lineDashOffset = -state.time * 36;
    ctx.strokeStyle = 'rgba(255, 179, 0, 0.85)';
    ctx.lineWidth = 2.5;
    rr(x - 5, y - 5, it.w + 10, it.h + 10, 20);
    ctx.stroke();
    ctx.restore();
  }

  // 右上角小装饰
  ctx.font = '13px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.85;
  ctx.fillText(it.emoji, x + it.w - 13, y + 14);
  ctx.globalAlpha = 1;

  ctx.textBaseline = 'middle';
  if (it.kind === 'letter') {
    ctx.font = FONT(42);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#37364e';
    ctx.fillText(it.seq.toUpperCase(), x + it.w / 2, y + it.h / 2 + 2);
  } else if (it.kind === 'word') {
    const tx = x + 20;
    const ty = y + it.h * 0.38;
    ctx.font = FONT(26);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#37364e';
    ctx.fillText(it.seq, tx, ty);
    if (it.typed > 0) {
      ctx.fillStyle = '#12a35b';
      ctx.fillText(it.seq.slice(0, it.typed), tx, ty);
    }
    // 中文意思
    ctx.font = FONT(15);
    ctx.fillStyle = 'rgba(70, 80, 105, 0.78)';
    ctx.fillText(it.trans, tx, y + it.h * 0.76);
  } else {
    // 汉字 + 拼音进度
    ctx.textAlign = 'center';
    ctx.font = FONT(38);
    ctx.fillStyle = '#37364e';
    ctx.fillText(it.hanzi, x + it.w / 2, y + it.h * 0.4);
    ctx.font = FONT(15);
    const tw = ctx.measureText(it.seq).width;
    const px = x + it.w / 2 - tw / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9aa5b5';
    ctx.fillText(it.seq, px, y + it.h * 0.78);
    if (it.typed > 0) {
      ctx.fillStyle = '#12a35b';
      ctx.fillText(it.seq.slice(0, it.typed), px, y + it.h * 0.78);
    }
  }

  // 命中白闪
  if (it.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${0.55 * it.flash})`;
    rr(x, y, it.w, it.h, 16);
    ctx.fill();
  }
  ctx.restore();
}

function currentTheme() {
  return THEMES[state.mode] || THEMES.letter;
}

function starPath(x, y, r, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawSky() {
  const theme = currentTheme();
  if (!bgGrad) {
    bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    theme.sky.forEach((c, i) => bgGrad.addColorStop(i / (theme.sky.length - 1), c));
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-30, -30, W + 60, H + 60);
}

function drawStars() {
  const theme = currentTheme();
  for (const s of state.stars) {
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(state.time * s.twinkle + s.phase));
    ctx.globalAlpha = s.alpha * twinkle;
    ctx.fillStyle = theme.starColor;
    if (s.big) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot + state.time * 0.15);
      starPath(0, 0, s.size * 2.4, 4);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, TAU);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawShootingStars() {
  for (const s of state.shootingStars) {
    const a = Math.max(0, Math.min(1, s.life));
    const tailX = s.x - s.vx * 0.12;
    const tailY = s.y - s.vy * 0.12;
    const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255,255,255,${a})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }
}

function drawRainbow() {
  if (!currentTheme().rainbow) return;
  const cx = W * 0.16;
  const cy = H * 0.84;
  const radius = Math.min(W, H) * 0.58;
  const colors = ['#ff6b6b', '#ffb703', '#ffd93d', '#6bcb77', '#4d96ff', '#9b5de5'];
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.lineWidth = 12;
  colors.forEach((c, i) => {
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - i * 12, Math.PI, TAU);
    ctx.stroke();
  });
  ctx.restore();
}

function drawOrb() {
  const theme = currentTheme();
  const o = theme.orb;
  const x = W * o.x;
  const y = H * o.y;
  const r = o.r;

  const glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
  glow.addColorStop(0, o.glow);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 3.2, 0, TAU);
  ctx.fill();

  if (o.type === 'sun') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(state.time * 0.12);
    ctx.strokeStyle = 'rgba(255,235,140,0.55)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12;
      const r1 = r * 1.35;
      const r2 = r * (1.65 + 0.12 * Math.sin(state.time * 2 + i));
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = o.color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.35, 0, TAU);
    ctx.fill();
  } else {
    const moonGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
    moonGrad.addColorStop(0, '#fffbe0');
    moonGrad.addColorStop(1, o.color);
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();

    ctx.fillStyle = 'rgba(210,200,160,0.35)';
    [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.13], [-0.05, 0.4, 0.1], [0.35, -0.35, 0.08]].forEach(([dx, dy, cr]) => {
      ctx.beginPath();
      ctx.arc(x + dx * r, y + dy * r, cr * r, 0, TAU);
      ctx.fill();
    });
  }
}

function drawCloud(c) {
  const theme = currentTheme();
  const s = c.scale;
  ctx.save();
  ctx.globalAlpha = c.alpha;
  ctx.fillStyle = theme.cloud;
  ctx.beginPath();
  ctx.arc(c.x, c.y, 24 * s, 0, TAU);
  ctx.arc(c.x + 26 * s, c.y - 12 * s, 20 * s, 0, TAU);
  ctx.arc(c.x + 54 * s, c.y - 2 * s, 22 * s, 0, TAU);
  ctx.arc(c.x + 30 * s, c.y + 10 * s, 26 * s, 0, TAU);
  ctx.fill();

  ctx.globalAlpha = c.alpha * 0.22;
  ctx.fillStyle = theme.orb.type === 'moon' ? '#8fa6ce' : '#9fc9e8';
  ctx.beginPath();
  ctx.ellipse(c.x + 27 * s, c.y + 30 * s, 38 * s, 8 * s, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawBird(b) {
  const theme = currentTheme();
  const flap = Math.sin(state.time * 7 + b.phase);
  ctx.save();
  ctx.translate(b.x, b.y + Math.sin(state.time * 1.5 + b.phase) * 4);
  ctx.scale(b.vx < 0 ? -b.scale : b.scale, b.scale);
  ctx.strokeStyle = theme.birdColor;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-10, flap * 5);
  ctx.quadraticCurveTo(-5, -5, 0, 0);
  ctx.quadraticCurveTo(5, -5, 10, flap * 5);
  ctx.stroke();
  ctx.restore();
}

function drawBalloon(b) {
  const y = b.y + Math.sin(b.phase) * 8;
  ctx.save();
  ctx.translate(b.x, y);
  ctx.scale(b.scale, b.scale);
  ctx.globalAlpha = b.alpha;

  const envelope = () => {
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.bezierCurveTo(26, -34, 30, -6, 0, 26);
    ctx.bezierCurveTo(-30, -6, -26, -34, 0, -34);
  };

  envelope();
  ctx.fillStyle = b.color;
  ctx.fill();

  ctx.save();
  envelope();
  ctx.clip();
  ctx.fillStyle = b.color2;
  ctx.fillRect(-10, -36, 7, 70);
  ctx.fillRect(7, -36, 7, 70);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(-24, -36, 6, 70);
  ctx.restore();

  ctx.strokeStyle = 'rgba(120,90,60,0.8)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-10, 22);
  ctx.lineTo(-5, 34);
  ctx.moveTo(10, 22);
  ctx.lineTo(5, 34);
  ctx.stroke();

  ctx.fillStyle = '#9a6238';
  rr(-7, 32, 14, 10, 3);
  ctx.fill();
  ctx.strokeStyle = 'rgba(90,55,25,0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function drawLantern(l) {
  const y = l.y + Math.sin(state.time * 1.2 + l.phase) * 4;
  const flicker = 0.75 + 0.25 * Math.sin(state.time * 4 + l.phase * 2);
  ctx.save();
  ctx.translate(l.x, y);
  ctx.scale(l.scale, l.scale);

  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
  glow.addColorStop(0, `rgba(255,200,110,${0.5 * flicker})`);
  glow.addColorStop(1, 'rgba(255,200,110,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, TAU);
  ctx.fill();

  ctx.fillStyle = '#ffb347';
  rr(-8, -12, 16, 24, 6);
  ctx.fill();
  ctx.fillStyle = `rgba(255,245,200,${0.7 * flicker})`;
  rr(-5, -8, 10, 16, 4);
  ctx.fill();

  ctx.fillStyle = '#d9822b';
  ctx.fillRect(-9, -14, 18, 3);
  ctx.fillRect(-9, 11, 18, 3);

  ctx.strokeStyle = 'rgba(255,220,150,0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(0, 20);
  ctx.stroke();
  ctx.restore();
}

function hillY(layer, x) {
  const t = x / Math.max(1, W);
  return H * layer.base + Math.sin(t * TAU * layer.freq + layer.phase + state.time * 0.03) * layer.amp;
}

function drawHills() {
  const theme = currentTheme();
  for (const layer of theme.hills) {
    ctx.save();
    ctx.globalAlpha = layer.alpha;
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(-30, H + 30);
    for (let x = -30; x <= W + 30; x += 24) {
      ctx.lineTo(x, hillY(layer, x));
    }
    ctx.lineTo(W + 30, H + 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const near = theme.hills[theme.hills.length - 1];
  ctx.save();
  for (const f of state.flowers) {
    const y = hillY(near, f.x) - 2;
    ctx.strokeStyle = 'rgba(50,100,70,0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(f.x, y);
    ctx.lineTo(f.x, y - 8);
    ctx.stroke();
    ctx.fillStyle = f.color;
    for (let i = 0; i < 5; i++) {
      const a = (i * TAU) / 5;
      ctx.beginPath();
      ctx.arc(f.x + Math.cos(a) * 3, y - 8 + Math.sin(a) * 3, 2.4, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(f.x, y - 8, 1.8, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawFireflies() {
  for (const f of state.fireflies) {
    const blink = 0.4 + 0.6 * Math.abs(Math.sin(f.phase));
    const x = f.x + Math.sin(state.time * 0.8 + f.phase) * 10;
    const y = f.y + Math.cos(state.time * 0.6 + f.phase * 1.3) * 8;
    ctx.fillStyle = 'rgba(255,240,150,1)';
    ctx.globalAlpha = blink * 0.18;
    ctx.beginPath();
    ctx.arc(x, y, f.size * 3.5, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = blink;
    ctx.beginPath();
    ctx.arc(x, y, f.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawDangerLine() {
  const theme = currentTheme();
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.lineDashOffset = -state.time * 40;
  ctx.strokeStyle = theme.danger;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H - 6);
  ctx.lineTo(W, H - 6);
  ctx.stroke();
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    const a = Math.max(0, Math.min(1, p.life / p.max));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    if (p.type === 'dot') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TAU);
      ctx.fill();
    } else if (p.type === 'star') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      starPath(0, 0, p.size, 5);
      ctx.fill();
    } else if (p.type === 'spark') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
      ctx.stroke();
    } else if (p.type === 'confetti') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else if (p.type === 'emoji') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${Math.round(p.size)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, 0, 0);
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.5, p.lineWidth * a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawFloats() {
  for (const f of state.floats) {
    const a = Math.max(0, Math.min(1, f.life));
    const p = Math.min(1, f.age / 0.16);
    const s = 0.6 + 0.4 * (1 - Math.pow(1 - p, 3)) + 0.12 * Math.sin(p * Math.PI);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(f.x, f.y);
    ctx.scale(s, s);
    ctx.font = FONT(f.size);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function draw() {
  ctx.save();
  if (state.shake > 0.1) {
    ctx.translate(rand(-1, 1) * state.shake, rand(-1, 1) * state.shake);
  }

  drawSky();
  drawStars();
  drawShootingStars();
  drawRainbow();
  drawOrb();
  for (const c of state.clouds) drawCloud(c);
  for (const b of state.birds) drawBird(b);
  for (const b of state.balloons) drawBalloon(b);
  for (const l of state.lanterns) drawLantern(l);
  drawHills();
  drawFireflies();
  drawDangerLine();

  for (const it of state.items) drawItem(it);
  drawParticles();
  drawFloats();

  ctx.restore();

  if (state.flash > 0) {
    ctx.fillStyle = `rgba(${state.flashColor},${state.flash})`;
    ctx.fillRect(0, 0, W, H);
  }
}

let lastTs = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  const dt = Math.min((ts - lastTs) / 1000 || 0, 0.05);
  lastTs = ts;
  if (state.screen !== 'game') return;
  if (!state.paused && state.running) update(dt);
  draw();
}

/* ---------------- 背景布置 ---------------- */
function initScenery() {
  const theme = currentTheme();

  state.clouds = [];
  for (let i = 0; i < theme.cloudCount; i++) {
    state.clouds.push({
      x: rand(-100, W + 100),
      y: rand(30, H * 0.5),
      scale: rand(0.55, 1.25),
      s: rand(4, 12),
      alpha: rand(theme.cloudAlpha[0], theme.cloudAlpha[1]),
    });
  }

  state.stars = [];
  for (let i = 0; i < theme.starCount; i++) {
    state.stars.push({
      x: rand(10, W - 10),
      y: rand(10, H * (theme.orb.type === 'moon' ? 0.7 : 0.55)),
      size: rand(0.8, 2.2),
      alpha: rand(0.4, 1),
      phase: rand(0, TAU),
      twinkle: rand(1.2, 3),
      big: Math.random() < 0.22,
      rot: rand(0, TAU),
    });
  }

  state.birds = [];
  for (let i = 0; i < theme.birdCount; i++) {
    state.birds.push({
      x: rand(0, W),
      y: rand(50, H * 0.4),
      vx: rand(16, 32) * (Math.random() < 0.5 ? 1 : -1),
      scale: rand(0.7, 1.2),
      phase: rand(0, TAU),
    });
  }

  state.balloons = [];
  for (let i = 0; i < theme.balloonCount; i++) {
    const colors = choice(BALLOON_COLORS);
    state.balloons.push({
      x: rand(W * 0.1, W * 0.9),
      y: rand(H * 0.22, H * 0.5),
      vx: rand(4, 9) * (Math.random() < 0.5 ? 1 : -1),
      scale: rand(0.65, 1.05),
      alpha: rand(0.55, 0.8),
      phase: rand(0, TAU),
      bobSpeed: rand(0.8, 1.4),
      color: colors[0],
      color2: colors[1],
    });
  }

  state.fireflies = [];
  for (let i = 0; i < theme.fireflyCount; i++) {
    state.fireflies.push({
      x: rand(0, W),
      y: rand(H * 0.55, H * 0.95),
      size: rand(1.2, 2.4),
      phase: rand(0, TAU),
      speed: rand(1.5, 3),
    });
  }

  state.lanterns = [];
  for (let i = 0; i < theme.lanternCount; i++) {
    state.lanterns.push({
      x: rand(0, W),
      y: rand(0, H),
      vy: rand(6, 14),
      scale: rand(0.6, 1.1),
      phase: rand(0, TAU),
    });
  }

  state.flowers = [];
  for (let i = 0; i < 14; i++) {
    state.flowers.push({
      x: rand(10, W - 10),
      color: choice(theme.flowerColors),
      phase: rand(0, TAU),
    });
  }

  state.shootingStars = [];
  state.shootTimer = rand(2, 6);
}

/* ---------------- 画布尺寸 ---------------- */
function resize() {
  const rect = stage.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;
  const dpr = window.devicePixelRatio || 1;
  W = rect.width;
  H = rect.height;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const theme = currentTheme();
  bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  theme.sky.forEach((c, i) => bgGrad.addColorStop(i / (theme.sky.length - 1), c));

  // HUD 区域和画布顶部同色，避免出现一条突兀的浅色横条
  $('screen-game').style.background = theme.sky[0];

  initScenery();

  // 掉落物留在画面内
  for (const it of state.items) it.x = Math.min(it.x, Math.max(8, W - it.w - 8));
}

/* ---------------- 输入 ---------------- */
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  const k = e.key.toLowerCase();

  if (state.screen === 'over') {
    if (e.key === 'Enter') startGame(state.mode);
    return;
  }
  if (state.screen !== 'game') return;

  if (e.key === ' ') {
    e.preventDefault();
    togglePause();
    return;
  }
  if (state.paused) {
    if (e.key === 'Enter') togglePause();
    return;
  }
  if (!/^[a-z]$/.test(k)) return;
  e.preventDefault();
  SFX.ensure();
  flashKey(k);
  handleKey(k);
});

// 切走窗口自动暂停，避免回来时手忙脚乱
window.addEventListener('blur', () => {
  if (state.screen === 'game' && state.running && !state.paused) togglePause();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.screen === 'game' && state.running && !state.paused) togglePause();
});

/* ---------------- 按钮 ---------------- */
document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    SFX.ensure();
    startGame(btn.dataset.mode);
    e.currentTarget.blur();
  });
});
document.querySelectorAll('.speed-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    speedSetting = btn.dataset.speed;
    store.set('youxi-speed', speedSetting);
    document.querySelectorAll('.speed-btn').forEach((b) => b.classList.toggle('active', b === btn));
    btn.blur();
  });
});
$('btn-home').addEventListener('click', (e) => { quitToMenu(); e.currentTarget.blur(); });
$('btn-resume').addEventListener('click', (e) => { togglePause(); e.currentTarget.blur(); });
$('btn-quit').addEventListener('click', (e) => { quitToMenu(); e.currentTarget.blur(); });
$('btn-retry').addEventListener('click', (e) => { startGame(state.mode); e.currentTarget.blur(); });
$('btn-menu').addEventListener('click', (e) => { showScreen('start'); e.currentTarget.blur(); });
$('btn-pause').addEventListener('click', (e) => { togglePause(); e.currentTarget.blur(); });
$('btn-mute').addEventListener('click', (e) => {
  if (SFX.toggle()) cancelSpeech();
  $('btn-mute').textContent = SFX.muted ? '🔇' : '🔊';
  e.currentTarget.blur();
});

/* ---------------- 启动 ---------------- */
window.addEventListener('resize', resize);
buildKeyboard();
$('btn-mute').textContent = SFX.muted ? '🔇' : '🔊';
document.querySelectorAll('.speed-btn').forEach((b) => b.classList.toggle('active', b.dataset.speed === speedSetting));
updateModeBests();
requestAnimationFrame(frame);
