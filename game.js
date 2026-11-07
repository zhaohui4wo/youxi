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
function burst(x, y, color, n, power) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = power * (0.35 + Math.random() * 0.65);
    state.particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 60,
      size: 3 + Math.random() * 4,
      color,
      life: 0.5 + Math.random() * 0.4,
      max: 0.9,
    });
  }
}

function addFloat(x, y, text, color, size) {
  state.floats.push({
    x: Math.min(Math.max(x, 60), Math.max(61, W - 60)),
    y,
    text,
    color,
    size,
    life: 1.4,
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
  state.combo++;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  updateCombo();

  state.score += 10;
  SFX.correct(state.combo);
  burst(it.x + it.w / 2, it.y + it.h / 2, PALETTE[it.color][1], 6, 120);

  if (state.combo % 5 === 0) {
    state.score += 25;
    addFloat(it.x + it.w / 2, it.y - 8, `🔥 ${state.combo} 连击 +25`, '#ff6b3d', 22);
    SFX.cheer();
  }

  if (it.typed >= it.seq.length) {
    removeItem(it);
    state.lockedId = null;
    state.score += 20;
    addFloat(it.x + it.w / 2, it.y + it.h / 2, '+30 ⭐', '#12a35b', 24);
    burst(it.x + it.w / 2, it.y + it.h / 2, PALETTE[it.color][1], 16, 260);
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
  if (target) target.shake = 0.3;
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
  addFloat(it.x + it.w / 2, H - 80, '💔 溜走了…', '#e05656', 20);
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
    if (it.y + it.h >= H - 6) {
      state.items.splice(i, 1);
      loseLife(it);
    }
  }

  // 粒子
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.vy += 520 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) state.particles.splice(i, 1);
  }

  // 飘字
  for (let i = state.floats.length - 1; i >= 0; i--) {
    const f = state.floats[i];
    f.y -= 42 * dt;
    f.life -= dt;
    if (f.life <= 0) state.floats.splice(i, 1);
  }

  // 云朵飘动
  for (const c of state.clouds) {
    c.x += c.s * dt;
    if (c.x > W + 120) {
      c.x = -120;
      c.y = rand(30, H * 0.45);
    }
  }
}

function drawItem(it) {
  const wob = Math.sin(state.time * 2.2 + it.wob) * 4;
  const shakeX = it.shake > 0 ? Math.sin(it.shake * 45) * 7 * (it.shake / 0.3) : 0;
  const x = it.x + wob + shakeX;
  const y = it.y;
  const locked = state.lockedId === it.id;
  const [bg, edge] = PALETTE[it.color];

  ctx.save();
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
  ctx.restore();
}

function draw() {
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 太阳
  const sx = W - 84;
  const sy = 88;
  const glow = ctx.createRadialGradient(sx, sy, 12, sx, sy, 70);
  glow.addColorStop(0, 'rgba(255, 224, 102, 0.9)');
  glow.addColorStop(1, 'rgba(255, 224, 102, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sx - 70, sy - 70, 140, 140);
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.arc(sx, sy, 34, 0, Math.PI * 2);
  ctx.fill();

  // 云朵
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.9;
  for (const c of state.clouds) {
    ctx.font = `${Math.round(46 * c.scale)}px serif`;
    ctx.fillText('☁️', c.x, c.y);
  }
  ctx.globalAlpha = 1;

  // 小星星（一闪一闪）
  for (const s of state.stars) {
    ctx.globalAlpha = 0.35 + 0.35 * Math.sin(state.time * 2 + s.phase);
    ctx.font = '16px serif';
    ctx.fillText('⭐', s.x, s.y);
  }
  ctx.globalAlpha = 1;

  // 底部危险线
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.strokeStyle = 'rgba(255, 107, 107, 0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H - 6);
  ctx.lineTo(W, H - 6);
  ctx.stroke();
  ctx.restore();

  for (const it of state.items) drawItem(it);

  // 粒子
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 飘字
  for (const f of state.floats) {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life));
    ctx.font = FONT(f.size);
    ctx.textAlign = 'center';
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
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

  bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#9ee7ff');
  bgGrad.addColorStop(0.6, '#d7f4ff');
  bgGrad.addColorStop(1, '#f2fbff');

  // 装饰重新布点
  state.clouds = [];
  for (let i = 0; i < 5; i++) {
    state.clouds.push({ x: rand(0, W), y: rand(30, H * 0.45), s: rand(8, 20), scale: rand(0.7, 1.4) });
  }
  state.stars = [];
  for (let i = 0; i < 7; i++) {
    state.stars.push({ x: rand(20, W - 20), y: rand(20, H * 0.7), phase: rand(0, 6.28) });
  }

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
