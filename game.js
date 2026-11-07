'use strict';

/* ============================================================
 * 字母大冒险 —— 给小朋友的打字小游戏
 * 三种模式：字母 / 单词 / 汉字拼音，掉落消除玩法
 * ============================================================ */

/* ---------------- 词库 ---------------- */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WORDS = [
  'cat', 'dog', 'sun', 'hat', 'bus', 'fish', 'star', 'tree', 'book', 'cake',
  'milk', 'bird', 'frog', 'ball', 'kite', 'duck', 'ship', 'moon', 'rain', 'snow',
  'happy', 'smile', 'green', 'house', 'panda', 'tiger', 'apple', 'rabbit', 'monkey', 'orange',
  'flower', 'school', 'friend', 'summer', 'window', 'garden', 'purple', 'yellow', 'rocket', 'pencil',
  'castle',
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
  let w, h;

  if (mode === 'letter') {
    seq = choice(LETTERS).toLowerCase();
    ctx.font = FONT(42);
    w = Math.max(76, ctx.measureText(seq.toUpperCase()).width + 44);
    h = 76;
  } else if (mode === 'word') {
    seq = choice(WORDS);
    ctx.font = FONT(26);
    w = Math.max(90, ctx.measureText(seq).width + 40);
    h = 58;
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
  state.mode = mode;
  Object.assign(state, {
    items: [], particles: [], floats: [],
    shootingStars: [], shake: 0, flash: 0, hitCount: 0,
    score: 0, combo: 0, bestCombo: 0, lives: 3, level: 1,
    spawnTimer: 600, lockedId: null,
    running: true, paused: false, time: 0,
  });
  updateScore(false);
  updateCombo();
  updateLevel();
  renderHearts();
  $('btn-pause').textContent = '⏸️';
  $('pause-overlay').classList.add('hidden');
  showScreen('game');
  resize();
  addFloat(W / 2, H * 0.3, '开始吧！' + MODES[mode].emoji, '#ff8a3d', 30);
}

function gameOver() {
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
}

function quitToMenu() {
  state.running = false;
  state.paused = false;
  $('pause-overlay').classList.add('hidden');
  showScreen('start');
}

/* ---------------- 打字逻辑 ---------------- */
function handleKey(k) {
  // 已锁定的目标优先
  let target = state.items.find((it) => it.id === state.lockedId && it.typed < it.seq.length) || null;
  if (target && target.seq[target.typed] === k) { hit(target); return; }

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
    addFloat(W / 2, H * 0.32, `🎉 升到第 ${lv} 关！速度加快啦`, '#ff6b3d', 30);
    fireworks(3);
    flashScreen('255,255,255', 0.12);
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
    ctx.font = FONT(26);
    ctx.textAlign = 'left';
    const tx = x + 20;
    const ty = y + it.h / 2;
    ctx.fillStyle = '#37364e';
    ctx.fillText(it.seq, tx, ty);
    if (it.typed > 0) {
      ctx.fillStyle = '#12a35b';
      ctx.fillText(it.seq.slice(0, it.typed), tx, ty);
    }
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
  $('btn-mute').textContent = SFX.toggle() ? '🔇' : '🔊';
  e.currentTarget.blur();
});

/* ---------------- 启动 ---------------- */
window.addEventListener('resize', resize);
$('btn-mute').textContent = SFX.muted ? '🔇' : '🔊';
document.querySelectorAll('.speed-btn').forEach((b) => b.classList.toggle('active', b.dataset.speed === speedSetting));
updateModeBests();
requestAnimationFrame(frame);
