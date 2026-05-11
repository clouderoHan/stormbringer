const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const gameShell = document.getElementById("gameShell");
const overlay = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseMenu = document.getElementById("pauseMenu");
const resumeButton = document.getElementById("resumeButton");
const pauseRestartButton = document.getElementById("pauseRestartButton");
const pauseMenuTabs = document.getElementById("pauseMenuTabs");
const encyclopediaTabs = document.getElementById("encyclopediaTabs");
const encyclopediaBody = document.getElementById("encyclopediaBody");
const healthText = document.getElementById("health");
const scoreText = document.getElementById("score");
const streakText = document.getElementById("streak");
const streakFill = document.getElementById("streakFill");
const bestScoreText = document.getElementById("bestScore");
const lastScoreText = document.getElementById("lastScore");
const titleBestScoreText = document.getElementById("titleBestScore");
const titleLastScoreText = document.getElementById("titleLastScore");
const waveText = document.getElementById("wave");
const chargeText = document.getElementById("charge");
const shotgunMeter = document.getElementById("shotgunMeter");
const laserMeter = document.getElementById("laserMeter");
const missileMeter = document.getElementById("missileMeter");
const machineGunMeter = document.getElementById("machineGunMeter");
const debugPanel = document.getElementById("debugPanel");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const MAX_PLAYER_HITS = 5;
const MAX_ENERGY = 5;
const PLAYER_HIT_INVULN = 1;
const keys = new Set();
const pointer = {
  active: false,
  leftDown: false,
  rightDown: false,
  x: WIDTH / 2,
  y: HEIGHT - 90,
};

let lastTime = 0;
let state = "menu";
let player = null;
let bullets = [];
let playerShots = [];
let playerTrail = [];
let drones = [];
let boss = null;
let shards = [];
let powerups = [];
let missiles = [];
let missileTrails = [];
let particles = [];
let floatingTexts = [];
let shieldTransfers = [];
let muzzleBlasts = [];
let nukeEffects = [];
let missileSplashEffects = [];
let civilianShips = [];
let playerLaserBeam = null;
let supportShips = [];
let supportTrails = [];
let supportPathLanes = [];
let ultimateCue = null;
let circleUltimate = null;
let playerDeathSequence = null;
let score = 0;
let streakCharge = 0;
let streakDecayDelay = 0;
let inventoryUnlockFlash = 0;
let lastInventorySlotCount = 1;
let bestStreakLevel = 0;
let runStats = null;
let pauseMenuSection = "encyclopedia";
let encyclopediaTab = "enemies";
const { powerupInfo, killLabels, encyclopedia } = window.StormbringerData;
const { LAST_RUN_KEY, BEST_RUN_KEY, LEGACY_LAST_RUN_KEY, LEGACY_BEST_RUN_KEY, emptyKills, loadStoredSummary, storeSummary, formatSigned } = window.StormbringerRecords;
let lastRunSummary = loadStoredSummary(LAST_RUN_KEY) || loadStoredSummary(LEGACY_LAST_RUN_KEY);
let bestRunSummary = loadStoredSummary(BEST_RUN_KEY) || loadStoredSummary(LEGACY_BEST_RUN_KEY);
let nextBossWave = 10;
let wave = 1;
let announcedWave = 1;
let elapsed = 0;
let spawnTimer;
let formationTimer;
let minefieldTimer;
let breatherTimer;
let lootBreatherCooldown;
let pendingThreat = null;
let shotTimer;
let missileTimer;
let machineGunTimer;
let laserTickTimer;
let mothershipSpawnCooldown = 0;
let shake = 0;
let hitStop = 0;
let hitStopCooldown = 0;
let playerDamageFlash = 0;
let playerDamagePulse = 0;
let playerDamageKind = "bullet";
let playerHealFlash = 0;
let playerHealPulse = 0;
let magnetWasDown = false;
let magnetHoldTime = 0;
let debugVisible = false;
const ULTIMATE_CUE_DURATION = 0.55;
const SHIELD_COLOR = "#2667ff";
const FRENZY_AURA_COLOR = "#ffd166";
const MOTHERSHIP_FRENZY_RADIUS = 410;
const FRENZY_LINGER_DURATION = 3;
const MOTHERLAND_PASS_DRIFT = 20;
const MOTHERLAND_RADIUS = 122;
const PLANET_NAME_WORDS = ["Vesper", "Halcyon", "Ember", "Lumen", "Aster", "Cinder", "Meridian", "Obsidian", "Solace", "Tempest", "Auric", "Nocturne"];
const PLANET_PALETTES = [
  { light: "#8fa3b4", mid: "#41515c", dark: "#1d242b", band: "#8a7dff", accent: "#6df6d5" },
  { light: "#d2a66f", mid: "#8b5e2f", dark: "#342016", band: "#ffd166", accent: "#ff8c42" },
  { light: "#9cc9b6", mid: "#437765", dark: "#18332c", band: "#6df6d5", accent: "#edf7f5" },
  { light: "#b48396", mid: "#73475c", dark: "#2d1725", band: "#ff5b74", accent: "#ffd166" },
  { light: "#9e96d7", mid: "#524c8f", dark: "#211d44", band: "#8a7dff", accent: "#edf7f5" },
];
const UFO_PRE_FIRE_HOLD = 0.62;
const UFO_POST_FIRE_HOLD = 0.72;
const SPLITTER_MAX_ACTIVE = 4;
const SPLITTER_CHILDREN_PER_DEATH = 3;
const S_RANK_MISSILE_AOE = 96;
const MOTHERSHIP_SPAWN_SLOWDOWN = 1.14;
const FIGHTER_INITIAL_FIRE_DELAY = [0.55, 1.25];
const FIGHTER_FIRE_DELAY = [1.32, 2.12];
const FRENZIED_FIGHTER_FIRE_DELAY = [0.82, 1.22];
const FORMATION_SPAWN_DELAY = [3.4, 5.1];
const MINEFIELD_SPAWN_DELAY = [5.2, 8.0];
const MINE_MAX_ACTIVE = 18;
const MINE_BLAST_RADIUS = 116;
const MINE_BLAST_DAMAGE = 3.5;
const PLAYER_MOVE_SPEED = 500;
const ENEMY_FORWARD_DRIFT = {
  ship: 62,
  cargo: 40,
  splitter: 50,
  jet: 34,
  mine: 82,
};
const AUDIO_SETTINGS_KEY = "stormbringer-audio-settings-v1";
const DEFAULT_AUDIO_SETTINGS = {
  sfx: 0.55,
  music: 0.42,
};
const SUPPORT_TRAIL_COLORS = ["#ff5b74", "#ffd166", "#6df6d5"];
const SUPPORT_PATH_COLORS = ["#ff8aa0", "#ffe08a", "#a8ffd0", "#9bfff0", "#aaa2ff"];
const SUPPORT_TRAIL_LIMIT = 120;
const SUPPORT_TRAIL_INTERVAL = 0.055;
const MISSILE_TRAIL_LIMIT = 150;
const MISSILE_TRAIL_INTERVAL = 0.035;
const STREAK_LAYERS = [
  { grade: "D", color: "#6df6d5" },
  { grade: "C", color: "#7cf7a8" },
  { grade: "B", color: "#ffd166" },
  { grade: "A", color: "#ff8c42" },
  { grade: "S", color: "#ff5b74" },
];
const STREAK_CHARGE_PER_LAYER = 2.05;
const STREAK_DECAY_BY_LEVEL = [0, 0.18, 0.27, 0.38, 0.54, 0.78];
const WAVE_THEMES = [
  { key: "formation", label: "Fighter Formation", color: "#ffd166" },
  { key: "ufo", label: "UFO Crossfire", color: "#8a7dff" },
  { key: "mine", label: "Mine Corridor", color: "#ff5b74" },
  { key: "cargo", label: "Cargo Rush", color: "#ffd166" },
  { key: "jet", label: "Jet Ambush", color: "#edf7f5" },
  { key: "mixed", label: "Assault Mix", color: "#6df6d5" },
];
const WAVE_PACE_PRESETS = {
  current: {
    formation: 1,
    ufo: 2,
    minefield: 2,
    jet: 3,
    cargo: 3,
    planet: 1,
    splitter: 4,
    boss: 10,
  },
  staged: {
    formation: 1,
    ufo: 2,
    minefield: 3,
    cargo: 4,
    jet: 5,
    planet: 6,
    splitter: 7,
    boss: 10,
  },
};
const ACTIVE_WAVE_PACE = WAVE_PACE_PRESETS.staged;
const isWaveUnlocked = (type) => wave >= (ACTIVE_WAVE_PACE[type] || 1);
const debugKeyEntries = [
  { mark: "`", title: "Debug Overlay", text: "Show or hide live run stats.", tip: "Use this when tuning waves, drops, bullets, and boss state.", color: "#6df6d5" },
  { mark: "B", title: "Start Boss", text: "Immediately brings in the first boss if no boss is active.", tip: "Bosses normally arrive through the wave schedule.", color: "#ff5b74" },
  { mark: "M", title: "Planet Pack", text: "Summons a named planet with nearby fighters for aura testing.", tip: "Enemies and the player fire faster inside the gold frenzy aura.", color: "#ffd166" },
  { mark: "S", title: "S Rank", text: "Instantly fills the streak system to S rank.", tip: "Useful for testing weapon overdrives and high-rank energy flow.", color: "#ff5b74" },
  { mark: "1", title: "Shotgun Drop", text: "Spawns the shotgun main weapon powerup near the player.", tip: "Main weapon slot.", color: "#ffd166" },
  { mark: "2", title: "Laser Drop", text: "Spawns the laser main weapon powerup near the player.", tip: "Main weapon slot.", color: "#2fd46f" },
  { mark: "3", title: "Missile Drop", text: "Spawns the missile sub weapon powerup near the player.", tip: "Sub weapon slot.", color: "#8a7dff" },
  { mark: "4", title: "Machine Gun Drop", text: "Spawns the machine gun sub weapon powerup near the player.", tip: "Short range bullet-clearing weapon.", color: "#ff5b74" },
  { mark: "E", title: "Fill Energy", text: "Fills the ultimate energy units.", tip: "Triggers remain tied to normal energy logic.", color: "#2667ff" },
  { mark: "H", title: "Restore Hull", text: "Restores player hull to full.", tip: "Good for boss and wave endurance tests.", color: "#7cf7a8" },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => Math.random() * (max - min) + min;
const currentStreakLevel = () => (streakCharge > 0 ? clamp(Math.floor(streakCharge / STREAK_CHARGE_PER_LAYER) + 1, 1, STREAK_LAYERS.length) : 0);
const currentStreakLayer = () => STREAK_LAYERS[currentStreakLevel() - 1] || null;
const currentStreakProgress = () => {
  const level = currentStreakLevel();
  if (!level) return 0;
  return clamp((streakCharge - (level - 1) * STREAK_CHARGE_PER_LAYER) / STREAK_CHARGE_PER_LAYER, 0, 1);
};
const currentStreakDecayRate = () => STREAK_DECAY_BY_LEVEL[currentStreakLevel()] || 0;
const inventorySlotCount = () => (currentStreakLevel() >= 5 ? 4 : currentStreakLevel() >= 4 ? 3 : currentStreakLevel() >= 3 ? 2 : 1);
const currentWaveTheme = () => WAVE_THEMES[(wave - 1) % WAVE_THEMES.length];
const hasSStreak = () => currentStreakLevel() >= STREAK_LAYERS.length;
const minimumEnergy = () => (hasSStreak() ? 1 : 0);
const scoreMultiplier = () => (hasSStreak() ? 1.3 : currentStreakLevel() >= 4 ? 1.2 : 1);

function splitterStats(tier = "L") {
  if (tier === "S") return { tier: "S", next: null, radius: 12, hp: 1.6, speed: 130, cooldown: [1.45, 2.05], reward: 95, color: "#ff5b74" };
  if (tier === "M") return { tier: "M", next: "S", radius: 20, hp: 3.2, speed: 104, cooldown: [1.25, 1.8], reward: 165, color: "#c95cff" };
  return { tier: "L", next: "M", radius: 32, hp: 8.2, speed: 72, cooldown: [1.55, 2.25], reward: 360, color: "#9b56d9" };
}
const effectiveMainWeapon = () => (player ? player.mainWeapon : "normal");
const isLaserActive = () => player && (effectiveMainWeapon() === "laser" || player.laserUltimateTimer > 0);
const hasSOverdrive = () => hasSStreak();
const streakBenefitLevel = () => Math.max(0, currentStreakLevel() - 1);
const streakDamageMultiplier = () => 1 + streakBenefitLevel() * 0.04;
const isFrenziedEnemy = (drone) => {
  return Boolean(drone && drone.type !== "mothership" && drone.type !== "mine" && drone.hp > 0 && !drone.exiting && (drone.frenzyTimer || 0) > 0);
};
const isPlayerFrenzied = () => {
  return Boolean(player && (player.frenzyTimer || 0) > 0);
};
const isDroneSlowed = (drone) => Boolean(drone && drone.type !== "mothership" && (drone.slowTimer || 0) > 0);
const droneMoveScale = (drone) => (isDroneSlowed(drone) ? 0.38 : 1);

const isDroneOnPlayerScreen = (drone) => Boolean(
  drone &&
    drone.x + drone.r > 0 &&
    drone.x - drone.r < WIDTH &&
    drone.y + drone.r > 0 &&
    drone.y - drone.r < HEIGHT
);

const isMineArmed = (drone) => Boolean(drone && drone.type === "mine" && drone.mineState === "armed");
const isDroneVulnerable = (drone) => Boolean(drone && (drone.type !== "mine" || isMineArmed(drone)) && (drone.enteredScreen || isDroneOnPlayerScreen(drone)));

const planetEntryProgress = (drone) => {
  if (!drone || drone.type !== "mothership") return 1;
  return clamp((drone.y + drone.r) / (drone.r * 1.35), 0, 1);
};

const hasVulnerableNonPlanetEnemy = () => drones.some((drone) => drone.type !== "mothership" && !drone.exiting && drone.hp > 0 && isDroneVulnerable(drone));

const droneHitOrder = () => [...drones].sort((a, b) => (a.type === "mothership" ? 1 : 0) - (b.type === "mothership" ? 1 : 0));

function keepEnemyOffPlanet(drone, margin = 34) {
  const planet = activeMothership();
  if (!planet || !drone || drone.type === "mothership" || planetEntryProgress(planet) <= 0.12) return;
  const minDistance = planet.r + (drone.r || 16) + margin;
  const dx = drone.x - planet.x;
  const dy = drone.y - planet.y;
  const distance = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  if (distance >= minDistance) return;
  const push = minDistance - distance;
  const nx = dx / distance;
  const ny = dy / distance;
  drone.x = clamp(drone.x + nx * push, -40, WIDTH + 40);
  drone.y = clamp(drone.y + ny * push, -80, HEIGHT + 80);
  if (typeof drone.targetX === "number") drone.targetX = clamp(drone.targetX + nx * push, 24, WIDTH - 24);
  if (typeof drone.targetY === "number") drone.targetY = clamp(drone.targetY + ny * push, 70, HEIGHT - 34);
}
const randomUfoPerch = () => ({
  x: rand(WIDTH * 0.18, WIDTH * 0.82),
  y: rand(88, HEIGHT * 0.3),
});
const fighterHp = (base) => Math.max(1, Math.ceil(base * 0.5));
const dist2 = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};
const angleTowardPlayer = (entity, localForwardAngle = 0) => {
  const target = player || { x: entity.x + (entity.vx || 0), y: entity.y + (entity.vy || 1) };
  return Math.atan2(target.y - entity.y, target.x - entity.x) - localForwardAngle;
};
const magnetPull = (entity, weight, radius = 850) => {
  const distance = Math.sqrt(dist2(player, entity));
  const pull = Math.max(0, radius - distance) / radius;
  if (pull <= 0) return;
  entity.x += (player.x - entity.x) * pull * weight;
  entity.y += (player.y - entity.y) * pull * weight;
};
const magnetRamp = () => clamp(magnetHoldTime / 1.8, 0, 1);
const magnetDangerRamp = () => clamp(Math.max(0, magnetHoldTime - 0.25) / 1.45, 0, 1);
const mixColor = (from, to, t) => {
  const mix = (a, b) => Math.round(a + (b - a) * clamp(t, 0, 1));
  return `rgb(${mix(from[0], to[0])}, ${mix(from[1], to[1])}, ${mix(from[2], to[2])})`;
};
const magnetColor = (ramp) => {
  if (ramp < 0.55) return mixColor([109, 246, 213], [255, 209, 102], ramp / 0.55);
  return mixColor([255, 209, 102], [255, 91, 116], (ramp - 0.55) / 0.45);
};

function loadAudioSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || "{}");
    return {
      sfx: clamp(Number.isFinite(saved.sfx) ? saved.sfx : DEFAULT_AUDIO_SETTINGS.sfx, 0, 1),
      music: clamp(Number.isFinite(saved.music) ? saved.music : DEFAULT_AUDIO_SETTINGS.music, 0, 1),
    };
  } catch (error) {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

function saveAudioSettings(settings) {
  try {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    // Volume settings are convenience only; gameplay should continue if storage is blocked.
  }
}

function recordKill(type) {
  if (!runStats) return;
  const key = type || "ship";
  runStats.kills[key] = (runStats.kills[key] || 0) + 1;
}

function awardScore(base, x, y, color = "#ffd166") {
  const multiplier = scoreMultiplier();
  const amount = Math.round(base * multiplier);
  score += amount;
  if (Number.isFinite(x) && Number.isFinite(y)) {
    addFloatingText(x, y, `+${amount}`, color, multiplier > 1 ? { scoreMultiplier: `x${multiplier.toFixed(1).replace(".0", "")}` } : {});
  }
  return amount;
}

function addStreakCharge(amount, x = player ? player.x : WIDTH / 2, y = player ? player.y : HEIGHT / 2, canRankUp = false) {
  const before = currentStreakLevel();
  const beforeSlots = inventorySlotCount();
  let nextCharge = clamp(streakCharge + amount, 0, STREAK_LAYERS.length * STREAK_CHARGE_PER_LAYER);
  if (!canRankUp) {
    const capLevel = Math.max(1, before);
    const cap = Math.min(STREAK_LAYERS.length * STREAK_CHARGE_PER_LAYER, capLevel * STREAK_CHARGE_PER_LAYER - 0.01);
    nextCharge = Math.min(nextCharge, cap);
  }
  streakCharge = nextCharge;
  const after = currentStreakLevel();
  const afterSlots = inventorySlotCount();
  bestStreakLevel = Math.max(bestStreakLevel, after);
  if (after > before && after > 0) {
    const layer = STREAK_LAYERS[after - 1];
    addRingBurst(x, y, layer.color, 12 + after * 3, 8 + after * 2, 170 + after * 35, 2.5 + after * 0.25);
  }
  if (afterSlots > beforeSlots) {
    inventoryUnlockFlash = 0.75;
    lastInventorySlotCount = afterSlots;
  }
}

function refreshStreakDecay() {
  if (streakCharge > 0) {
    streakDecayDelay = 1;
  }
}

function registerStreakHit(kind = "normal", x, y) {
  const amount = kind === "shotgun" ? 0.019 : kind === "missile" ? 0.015 : kind === "machinegun" || kind === "lockdown" || kind === "sweeper" ? 0.004 : kind === "ultimate" ? 0.022 : kind === "laser" ? 0.01 : 0.01;
  addStreakCharge(amount, x, y, false);
}

function registerStreakKill(type, x, y) {
  const chunks = {
    ship: 0.14,
    jet: 0.38,
    splitter: 0.28,
    ufo: 0.36,
    mine: 0.12,
    cargo: 0.55,
    mothership: 0.82,
    bossCannon: 0.68,
    boss: 1.15,
  };
  addStreakCharge(chunks[type] || 0.32, x, y, true);
  refreshStreakDecay();
  const level = currentStreakLevel();
  if (level > 0) {
    awardScore(level * 20, x, y - 18, currentStreakLayer()?.color || "#ffd166");
  }
}

function triggerDroneImpact(drone, angle = -Math.PI / 2, strength = 1) {
  if (!drone || drone.type === "mothership") return;
  const next = clamp(0.08 + strength * 0.08, 0.06, 0.22);
  drone.impactSquash = Math.max(drone.impactSquash || 0, next);
  drone.impactAngle = Number.isFinite(angle) ? angle : -Math.PI / 2;
}

function projectileImpactAngle(source, target) {
  if (source && Number.isFinite(source.vx) && Number.isFinite(source.vy) && Math.hypot(source.vx, source.vy) > 0.01) {
    return Math.atan2(source.vy, source.vx);
  }
  if (source && target && Number.isFinite(source.x) && Number.isFinite(source.y)) {
    return Math.atan2(target.y - source.y, target.x - source.x);
  }
  return -Math.PI / 2;
}

function clearStreak() {
  const previousSlots = inventorySlotCount();
  streakCharge = 0;
  streakDecayDelay = 0;
  if (player && player.inventory && previousSlots > inventorySlotCount()) {
    const kept = player.inventory.slice(0, inventorySlotCount());
    const lost = player.inventory.slice(inventorySlotCount());
    player.inventory = kept;
    lost.forEach((type, index) => scatterInventoryPowerup(type, index, lost.length));
    if (lost.length) {
      addFloatingText(player.x, player.y - 54, "INVENTORY SPILL", "#ffd166");
      addRingBurst(player.x, player.y, "#ffd166", 20, 7, 230, 3);
    }
  }
}

function debugSetSStreak() {
  if (!player) return;
  streakCharge = STREAK_LAYERS.length * STREAK_CHARGE_PER_LAYER;
  streakDecayDelay = 1;
  inventoryUnlockFlash = 0.75;
  lastInventorySlotCount = inventorySlotCount();
  bestStreakLevel = STREAK_LAYERS.length;
  player.charge = Math.max(player.charge, minimumEnergy());
  if (debugVisible) {
    addFloatingText(player.x, player.y - 48, "S STREAK", STREAK_LAYERS[STREAK_LAYERS.length - 1].color);
  }
  addRingBurst(player.x, player.y, STREAK_LAYERS[STREAK_LAYERS.length - 1].color, 24, 18, 360, 3.5);
  updateHud();
}

const audio = {
  ctx: null,
  master: null,
  music: null,
  musicTimer: null,
  musicStep: 0,
  musicMode: "normal",
  musicVariant: "original",
  settings: loadAudioSettings(),
  last: {},
  get enabled() {
    return Boolean(this.ctx && this.master);
  },
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        const resume = this.ctx.resume();
        if (resume && resume.catch) resume.catch(() => {});
      }
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.music = this.ctx.createGain();
    this.master.gain.value = this.settings.sfx;
    this.music.gain.value = this.settings.music;
    this.music.connect(this.ctx.destination);
    this.master.connect(this.ctx.destination);
    if (this.ctx.state === "suspended") {
      const resume = this.ctx.resume();
      if (resume && resume.catch) resume.catch(() => {});
    }
  },
  connectToMusic(gain) {
    gain.connect(this.music || this.master);
  },
  setVolume(channel, value, persist = true) {
    const nextValue = clamp(value, 0, 1);
    if (channel !== "music" && channel !== "sfx") return;
    this.settings[channel] = nextValue;
    const target = channel === "music" ? this.music : this.master;
    if (target) {
      target.gain.value = nextValue;
    }
    if (persist) saveAudioSettings(this.settings);
  },
  applyVolumes(persist = false) {
    this.setVolume("sfx", this.settings.sfx, false);
    this.setVolume("music", this.settings.music, false);
    if (persist) saveAudioSettings(this.settings);
  },
  throttle(name, seconds) {
    if (!this.enabled) return false;
    const now = this.ctx.currentTime;
    if (this.last[name] && now - this.last[name] < seconds) return false;
    this.last[name] = now;
    return true;
  },
  variation(amount = 0.06) {
    return 1 + rand(-amount, amount);
  },
  tone({ type = "sine", frequency = 440, endFrequency = frequency, duration = 0.1, volume = 0.3, when = 0 }) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  },
  musicTone({ type = "sine", frequency = 220, duration = 0.2, volume = 0.12, when = 0, endFrequency = frequency }) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    this.connectToMusic(gain);
    osc.start(t);
    osc.stop(t + duration + 0.04);
  },
  setMusicMode(mode) {
    if (this.musicMode === mode && this.musicTimer) return;
    this.stopMusic();
    this.musicMode = mode;
    this.musicStep = 0;
    this.startMusic();
  },
  startMusic(mode = this.musicMode) {
    if (!this.enabled) return;
    this.musicMode = mode;
    if (this.musicTimer) return;
    const loop = () => {
      if (!this.enabled || state !== "playing") {
        this.musicTimer = null;
        return;
      }
      if (this.musicMode === "boss") {
        const roots = [73.42, 82.41, 65.41, 87.31];
        const alarms = [1, 1.19, 1.5, 1.78, 2, 1.78, 1.5, 1.19];
        const step = this.musicStep;
        const root = roots[Math.floor(step / 8) % roots.length];
        const pulse = step % 8;

        if (step % 2 === 0) {
          this.musicTone({ type: "sawtooth", frequency: root, endFrequency: root * 0.98, duration: 0.28, volume: pulse === 0 ? 0.2 : 0.13 });
        }
        if (step % 4 === 0) {
          this.musicTone({ type: "triangle", frequency: root * 0.5, duration: 0.44, volume: 0.16 });
          this.noise({ duration: 0.045, volume: 0.08, filterFrequency: 900, when: 0.015, destination: "music" });
        }
        if (step % 2 === 1) {
          const note = root * 4 * alarms[step % alarms.length];
          this.musicTone({ type: "square", frequency: note, endFrequency: note * 0.86, duration: 0.09, volume: 0.055, when: 0.02 });
        }
        if (step % 16 === 14) {
          this.musicTone({ type: "sawtooth", frequency: root * 6, endFrequency: root * 2.5, duration: 0.32, volume: 0.08 });
        }
        this.musicStep = (this.musicStep + 1) % 64;
        this.musicTimer = window.setTimeout(loop, 142);
        return;
      }
      if (this.musicVariant === "battle-anthem") {
        const roots = [110, 130.81, 98, 146.83, 87.31, 116.54, 130.81, 123.47];
        const heroic = [0, 3, 7, 10, 12, 10, 7, 3, 5, 8, 12, 15, 14, 10, 8, 7];
        const arp = [1, 1.5, 2, 2.38, 3, 2.38, 2, 1.5, 1.26, 1.89, 2.52, 3, 2.52, 1.89, 1.5, 2];
        const step = this.musicStep;
        const bar = Math.floor(step / 8);
        const phrase = Math.floor(step / 16) % 4;
        const climax = step >= 48;
        const root = roots[bar % roots.length];
        const accent = step % 16 === 0 || step % 16 === 8;

        if (step % 2 === 0) {
          const bassPattern = [1, 1, 1.5, 1, 0.75, 1, 1.5, 2];
          const bass = root * bassPattern[(step / 2) % bassPattern.length];
          this.musicTone({ type: "sawtooth", frequency: bass, endFrequency: bass * 0.985, duration: 0.24, volume: accent ? 0.16 : 0.1 });
          if (climax && step % 4 === 0) {
            this.musicTone({ type: "triangle", frequency: root * 0.5, duration: 0.38, volume: 0.07, when: 0.02 });
          }
        }

        if (step % 8 === 0) {
          this.musicTone({ type: "triangle", frequency: root * 2, duration: 0.95, volume: 0.052, when: 0.02 });
          this.musicTone({ type: "sine", frequency: root * (phrase % 2 ? 3.36 : 3), duration: 0.95, volume: 0.036, when: 0.04 });
          this.musicTone({ type: "sine", frequency: root * (climax ? 4.49 : 4), duration: 0.78, volume: 0.024, when: 0.08 });
        }

        if (step % 4 === 0) {
          this.noise({ duration: 0.045, volume: accent ? 0.064 : 0.046, filterFrequency: 850, destination: "music" });
        }
        if (step % 4 === 2 || step % 8 === 7) {
          this.noise({ duration: step % 8 === 7 ? 0.05 : 0.028, volume: step % 8 === 7 ? 0.046 : 0.03, filterFrequency: 2600, when: 0.02, destination: "music" });
        }

        if (step % 2 === 1 && ![15, 31, 47].includes(step)) {
          const note = root * arp[(step + phrase * 4) % arp.length];
          this.musicTone({ type: step % 6 === 1 ? "square" : "triangle", frequency: note * 2, endFrequency: note * 1.98, duration: 0.09, volume: climax ? 0.042 : 0.036, when: 0.015 });
        }

        if ([6, 10, 14].includes(step % 16) || (climax && step % 4 === 2)) {
          const degree = heroic[(step / 2 + phrase * 2) % heroic.length];
          const lead = root * Math.pow(2, degree / 12) * (climax ? 3 : 2);
          this.musicTone({ type: "triangle", frequency: lead, endFrequency: lead * (climax ? 1.04 : 0.92), duration: climax ? 0.28 : 0.22, volume: climax ? 0.06 : 0.052, when: 0.035 });
        }

        if (step >= 56) {
          const climb = root * Math.pow(2, heroic[(step - 56) % heroic.length] / 12) * 4;
          this.musicTone({ type: "sine", frequency: climb, endFrequency: climb * 1.06, duration: 0.22, volume: 0.036, when: 0.07 });
        }

        this.musicStep = (this.musicStep + 1) % 64;
        this.musicTimer = window.setTimeout(loop, 220);
        return;
      }
      if (this.musicVariant === "climax") {
        const roots = [110, 98, 130.81, 87.31, 146.83, 130.81, 98, 123.47];
        const arp = [1, 1.5, 2, 2.52, 2, 1.5, 1.26, 1.89, 2.38, 1.68, 1.33, 2.24, 1.78, 1.5, 2.67, 2];
        const counter = [3, 5, 8, 10, 7, 5, 12, 10, 8, 3, 7, 5, 10, 12, 8, 7];
        const lift = [12, 15, 19, 22, 24, 26, 24, 22, 19, 17, 15, 12, 10, 14, 17, 21];
        const step = this.musicStep;
        const root = roots[Math.floor(step / 8) % roots.length];
        const phrase = Math.floor(step / 16) % 4;
        const climax = step >= 48;

        if (step % 2 === 0) {
          const bass = step % 8 === 0 ? root : root * (step % 8 === 4 ? 0.75 : 1.5);
          this.musicTone({ type: "sine", frequency: bass, endFrequency: bass * 0.985, duration: climax ? 0.48 : 0.42, volume: step % 8 === 0 ? 0.2 : 0.115 });
          if (climax && step % 4 === 0) {
            this.musicTone({ type: "triangle", frequency: bass * 0.5, endFrequency: bass * 0.49, duration: 0.5, volume: 0.075, when: 0.015 });
          }
        }

        if (step % 8 === 0) {
          this.musicTone({ type: "triangle", frequency: root * 2, duration: 0.9, volume: climax ? 0.064 : 0.055, when: 0.02 });
          this.musicTone({ type: "sine", frequency: root * 3, duration: 1.05, volume: climax ? 0.046 : 0.04, when: 0.05 });
          this.musicTone({ type: "sine", frequency: root * (phrase % 2 ? 4.49 : 4), duration: 1.15, volume: climax ? 0.034 : 0.03, when: 0.08 });
        }

        if (![3, 11, 19, 27, 42, 55].includes(step % 64)) {
          const note = root * arp[(step + phrase * 3) % arp.length];
          this.musicTone({ type: step % 3 === 0 ? "triangle" : "sine", frequency: note, endFrequency: note * 1.006, duration: 0.12, volume: climax ? 0.047 : 0.045, when: 0.025 });
        }

        if (step % 16 === 10 || step % 16 === 14 || (climax && step % 4 === 2)) {
          const lead = root * Math.pow(2, counter[(step / 2) % counter.length] / 12) * (climax ? 2 : 3);
          this.musicTone({ type: "triangle", frequency: lead, endFrequency: lead * 0.9, duration: climax ? 0.28 : 0.22, volume: climax ? 0.062 : 0.07, when: 0.035 });
        }

        if (step % 4 === 2 || step % 16 === 15) {
          this.noise({ duration: step % 16 === 15 ? 0.07 : 0.03, volume: climax && step % 16 === 15 ? 0.046 : step % 16 === 15 ? 0.07 : 0.04, filterFrequency: step % 16 === 15 ? 2400 : 1800, when: 0.03, destination: "music" });
        }

        if (climax) {
          const high = root * Math.pow(2, lift[(step - 48) % lift.length] / 12) * 1.45;
          this.musicTone({ type: "sine", frequency: high, endFrequency: high * (step % 4 === 0 ? 1.04 : 0.96), duration: 0.32, volume: 0.032, when: 0.07 });
          if (step % 8 === 6) {
            this.musicTone({ type: "triangle", frequency: root * 2.5, endFrequency: root * 1.8, duration: 0.42, volume: 0.038, when: 0.03 });
          }
        }

        this.musicStep = (this.musicStep + 1) % 64;
        this.musicTimer = window.setTimeout(loop, 240);
        return;
      }
      const roots = [110, 98, 130.81, 87.31, 146.83, 130.81, 98, 123.47];
      const arp = [1, 1.5, 2, 2.52, 2, 1.5, 1.26, 1.89, 2.38, 1.68, 1.33, 2.24, 1.78, 1.5, 2.67, 2];
      const counter = [3, 5, 8, 10, 7, 5, 12, 10, 8, 3, 7, 5, 10, 12, 8, 7];
      const step = this.musicStep;
      const root = roots[Math.floor(step / 8) % roots.length];
      const phrase = Math.floor(step / 16) % 4;

      if (step % 2 === 0) {
        const bass = step % 8 === 0 ? root : root * (step % 8 === 4 ? 0.75 : 1.5);
        this.musicTone({ type: "sine", frequency: bass, endFrequency: bass * 0.985, duration: 0.42, volume: step % 8 === 0 ? 0.2 : 0.115 });
      }

      if (step % 8 === 0) {
        this.musicTone({ type: "triangle", frequency: root * 2, duration: 0.9, volume: 0.055, when: 0.02 });
        this.musicTone({ type: "sine", frequency: root * 3, duration: 1.05, volume: 0.04, when: 0.05 });
        this.musicTone({ type: "sine", frequency: root * (phrase % 2 ? 4.49 : 4), duration: 1.15, volume: 0.03, when: 0.08 });
      }

      if (![3, 11, 19, 27, 42, 55].includes(step % 64)) {
        const note = root * arp[(step + phrase * 3) % arp.length];
        this.musicTone({ type: step % 3 === 0 ? "triangle" : "sine", frequency: note, endFrequency: note * 1.006, duration: 0.12, volume: 0.045, when: 0.025 });
      }

      if (step % 16 === 10 || step % 16 === 14) {
        const lead = root * Math.pow(2, counter[(step / 2) % counter.length] / 12) * 3;
        this.musicTone({ type: "triangle", frequency: lead, endFrequency: lead * 0.88, duration: 0.22, volume: 0.07, when: 0.035 });
      }

      if (step % 4 === 2 || step % 16 === 15) {
        this.noise({ duration: step % 16 === 15 ? 0.07 : 0.035, volume: step % 16 === 15 ? 0.07 : 0.045, filterFrequency: step % 16 === 15 ? 3600 : 2200, when: 0.03, destination: "music" });
      }
      this.musicStep = (this.musicStep + 1) % 64;
      this.musicTimer = window.setTimeout(loop, 240);
    };
    loop();
  },
  stopMusic() {
    if (this.musicTimer) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  },
  noise({ duration = 0.16, volume = 0.25, when = 0, filterFrequency = 900, destination = "master" }) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime + when;
    const buffer = this.ctx.createBuffer(1, Math.max(1, Math.floor(this.ctx.sampleRate * duration)), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFrequency, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter);
    filter.connect(gain);
    if (destination === "music") {
      this.connectToMusic(gain);
    } else {
      gain.connect(this.master);
    }
    source.start(t);
  },
  shoot() {
    if (!this.throttle("shoot", 0.14)) return;
    const pitch = this.variation(0.055);
    const snap = this.variation(0.12);
    this.tone({ type: "triangle", frequency: 520 * pitch, endFrequency: 390 * pitch, duration: 0.042 * this.variation(0.16), volume: 0.052 * snap });
  },
  machineGun() {
    if (!this.throttle("machinegun", 0.035)) return;
    const pitch = this.variation(0.08);
    const bite = this.variation(0.16);
    this.noise({ duration: 0.024 * this.variation(0.18), volume: 0.055 * bite, filterFrequency: 1300 * this.variation(0.18) });
    this.tone({ type: "square", frequency: 220 * pitch, endFrequency: 150 * pitch, duration: 0.032 * this.variation(0.18), volume: 0.052 * bite });
  },
  shotgun() {
    if (!this.throttle("shotgun", 0.18)) return;
    const pitch = this.variation(0.05);
    const body = this.variation(0.12);
    this.noise({ duration: 0.17 * this.variation(0.12), volume: 0.34 * body, filterFrequency: 560 * this.variation(0.14) });
    this.noise({ duration: 0.045 * this.variation(0.18), volume: 0.09 * this.variation(0.16), filterFrequency: 1350 * this.variation(0.18), when: 0.018 * this.variation(0.3) });
    this.tone({ type: "triangle", frequency: 82 * pitch, endFrequency: 38 * pitch, duration: 0.22 * this.variation(0.08), volume: 0.36 * body });
    this.tone({ type: "square", frequency: 245 * pitch, endFrequency: 92 * pitch, duration: 0.1 * this.variation(0.12), volume: 0.12 * this.variation(0.14), when: 0.015 });
    this.tone({ type: "triangle", frequency: 180 * pitch, endFrequency: 115 * pitch, duration: 0.1 * this.variation(0.14), volume: 0.09 * this.variation(0.16), when: 0.04 });
  },
  missile() {
    if (!this.throttle("missile", 0.08)) return;
    const pitch = this.variation(0.07);
    this.tone({ type: "triangle", frequency: 260 * pitch, endFrequency: 720 * this.variation(0.08), duration: 0.18 * this.variation(0.12), volume: 0.16 * this.variation(0.14) });
  },
  laser() {
    if (!this.throttle("laser", 0.32)) return;
    const pitch = this.variation(0.025);
    this.noise({ duration: 0.34 * this.variation(0.08), volume: 0.026 * this.variation(0.12), filterFrequency: 1800 * this.variation(0.1) });
    this.tone({ type: "sawtooth", frequency: 132 * pitch, endFrequency: 126 * pitch, duration: 0.34 * this.variation(0.08), volume: 0.075 * this.variation(0.1) });
    this.tone({ type: "triangle", frequency: 390 * pitch, endFrequency: 420 * pitch, duration: 0.32 * this.variation(0.08), volume: 0.035 * this.variation(0.12), when: 0.01 });
  },
  laserTip(strength = 1) {
    if (!this.throttle("laser-tip", 0.065)) return;
    const pitch = this.variation(0.045);
    const bite = clamp(strength, 0.55, 1.25);
    this.tone({ type: "sine", frequency: 980 * pitch, endFrequency: 1480 * pitch, duration: 0.055, volume: 0.12 * bite });
    this.tone({ type: "triangle", frequency: 1960 * pitch, endFrequency: 1120 * pitch, duration: 0.07, volume: 0.065 * bite, when: 0.012 });
    this.noise({ duration: 0.028, volume: 0.045 * bite, filterFrequency: 5200 * this.variation(0.12), when: 0.006 });
  },
  mothershipAlert() {
    if (!this.throttle("mothership-alert", 2.5)) return;
    this.noise({ duration: 0.18, volume: 0.2, filterFrequency: 1900 });
    this.tone({ type: "square", frequency: 740, endFrequency: 520, duration: 0.18, volume: 0.22 });
    this.tone({ type: "square", frequency: 520, endFrequency: 740, duration: 0.18, volume: 0.2, when: 0.2 });
    this.tone({ type: "square", frequency: 740, endFrequency: 420, duration: 0.24, volume: 0.24, when: 0.4 });
  },
  enemyHit(kind = "normal", healthRatio = 1, layer = "health") {
    if (!this.throttle(`enemyHit-${kind}-${layer}`, kind === "missile" ? 0.055 : 0.025)) return;
    if (layer === "shield") {
      this.tone({ type: "sine", frequency: 680, endFrequency: 980, duration: 0.08, volume: 0.13 });
      this.tone({ type: "triangle", frequency: 1240, endFrequency: 760, duration: 0.07, volume: 0.07, when: 0.018 });
      this.noise({ duration: 0.035, volume: 0.045, filterFrequency: 3600, when: 0.012 });
      return;
    }
    if (layer === "armor") {
      this.tone({ type: "square", frequency: 190, endFrequency: 115, duration: 0.075, volume: 0.17 });
      this.tone({ type: "triangle", frequency: 360, endFrequency: 210, duration: 0.055, volume: 0.1, when: 0.01 });
      this.noise({ duration: 0.045, volume: 0.09, filterFrequency: 950, when: 0.006 });
      return;
    }
    const pitch = 0.82 + (1 - clamp(healthRatio, 0, 1)) * 0.32;
    if (kind === "critical") {
      this.tone({ type: "triangle", frequency: 720 * pitch, endFrequency: 380 * pitch, duration: 0.075, volume: 0.17 });
      this.tone({ type: "sine", frequency: 1280 * pitch, endFrequency: 760 * pitch, duration: 0.055, volume: 0.1, when: 0.012 });
      this.noise({ duration: 0.035, volume: 0.055, filterFrequency: 4200, when: 0.008 });
    } else if (kind === "shotgun") {
      this.noise({ duration: 0.055, volume: 0.18, filterFrequency: 1700 });
      this.tone({ type: "triangle", frequency: 190 * pitch, endFrequency: 82 * pitch, duration: 0.08, volume: 0.17 });
      this.tone({ type: "square", frequency: 430 * pitch, endFrequency: 190 * pitch, duration: 0.05, volume: 0.055, when: 0.015 });
    } else if (kind === "missile") {
      this.noise({ duration: 0.12, volume: 0.19, filterFrequency: 780 });
      this.tone({ type: "triangle", frequency: 125 * pitch, endFrequency: 48 * pitch, duration: 0.14, volume: 0.18 });
    } else if (kind === "machinegun" || kind === "lockdown" || kind === "sweeper") {
      this.tone({ type: "sine", frequency: 920 * pitch, endFrequency: 1180 * pitch, duration: 0.045, volume: kind === "lockdown" || kind === "sweeper" ? 0.07 : 0.055 });
      this.tone({ type: "triangle", frequency: 1380 * pitch, endFrequency: 840 * pitch, duration: 0.04, volume: 0.04, when: 0.012 });
    } else if (kind === "ultimate") {
      this.tone({ type: "triangle", frequency: 450 * pitch, endFrequency: 250 * pitch, duration: 0.075, volume: 0.16 });
      this.tone({ type: "sine", frequency: 680 * pitch, endFrequency: 390 * pitch, duration: 0.055, volume: 0.08, when: 0.015 });
    } else {
      this.tone({ type: "square", frequency: 245 * pitch, endFrequency: 170 * pitch, duration: 0.045, volume: 0.11 });
    }
  },
  explosion() {
    if (!this.throttle("explosion", 0.05)) return;
    this.noise({ duration: 0.25, volume: 0.34, filterFrequency: 520 });
    this.tone({ type: "sine", frequency: 120, endFrequency: 48, duration: 0.28, volume: 0.26 });
  },
  enemyDeath(type = "ship") {
    if (!this.throttle(`enemyDeath-${type}`, type === "ship" ? 0.045 : 0.08)) return;
    if (type === "ufo") {
      this.tone({ type: "sine", frequency: 720, endFrequency: 1240, duration: 0.12, volume: 0.15 });
      this.tone({ type: "triangle", frequency: 1380, endFrequency: 520, duration: 0.16, volume: 0.11, when: 0.025 });
      this.noise({ duration: 0.09, volume: 0.08, filterFrequency: 3800, when: 0.015 });
    } else if (type === "cargo") {
      this.noise({ duration: 0.2, volume: 0.22, filterFrequency: 820 });
      this.tone({ type: "square", frequency: 155, endFrequency: 72, duration: 0.22, volume: 0.24 });
      this.tone({ type: "triangle", frequency: 300, endFrequency: 135, duration: 0.12, volume: 0.12, when: 0.04 });
    } else if (type === "jet") {
      this.noise({ duration: 0.12, volume: 0.16, filterFrequency: 2200 });
      this.tone({ type: "sawtooth", frequency: 520, endFrequency: 130, duration: 0.18, volume: 0.16 });
      this.tone({ type: "triangle", frequency: 920, endFrequency: 420, duration: 0.08, volume: 0.08, when: 0.08 });
    } else if (type === "mothership") {
      this.noise({ duration: 0.42, volume: 0.38, filterFrequency: 600 });
      this.noise({ duration: 0.12, volume: 0.16, filterFrequency: 2600, when: 0.12 });
      this.tone({ type: "sawtooth", frequency: 120, endFrequency: 34, duration: 0.55, volume: 0.34 });
      this.tone({ type: "triangle", frequency: 620, endFrequency: 160, duration: 0.28, volume: 0.14, when: 0.1 });
    } else {
      this.noise({ duration: 0.08, volume: 0.11, filterFrequency: 1800 });
      this.tone({ type: "square", frequency: 280, endFrequency: 120, duration: 0.08, volume: 0.13 });
      this.tone({ type: "triangle", frequency: 780, endFrequency: 420, duration: 0.055, volume: 0.055, when: 0.018 });
    }
  },
  playerDeath() {
    if (!this.throttle("player-death", 1)) return;
    this.noise({ duration: 0.55, volume: 0.48, filterFrequency: 640 });
    this.noise({ duration: 0.18, volume: 0.2, filterFrequency: 2400, when: 0.08 });
    this.tone({ type: "sawtooth", frequency: 150, endFrequency: 28, duration: 0.72, volume: 0.34 });
    this.tone({ type: "square", frequency: 62, endFrequency: 34, duration: 0.5, volume: 0.22, when: 0.08 });
    this.tone({ type: "triangle", frequency: 720, endFrequency: 120, duration: 0.38, volume: 0.13, when: 0.16 });
  },
  pickup(type) {
    if (!this.throttle(`pickup-${type}`, 0.08)) return;
    const base = type === "missiles" ? 500 : type === "energy" ? 740 : 390;
    this.tone({ type: "sine", frequency: base, endFrequency: base * 1.5, duration: 0.13, volume: 0.2 });
    this.tone({ type: "triangle", frequency: base * 1.5, endFrequency: base * 2, duration: 0.11, volume: 0.12, when: 0.06 });
  },
  playerHeal() {
    if (!this.throttle("playerHeal", 0.16)) return;
    this.tone({ type: "sine", frequency: 392, endFrequency: 784, duration: 0.18, volume: 0.22 });
    this.tone({ type: "triangle", frequency: 523.25, endFrequency: 1046.5, duration: 0.22, volume: 0.18, when: 0.055 });
    this.tone({ type: "sine", frequency: 659.25, endFrequency: 1318.5, duration: 0.24, volume: 0.13, when: 0.12 });
    this.noise({ duration: 0.11, volume: 0.075, filterFrequency: 4200, when: 0.02 });
  },
  playerHit(kind = "bullet") {
    if (kind === "laser") {
      this.noise({ duration: 0.22, volume: 0.38, filterFrequency: 2200 });
      this.tone({ type: "sawtooth", frequency: 980, endFrequency: 150, duration: 0.24, volume: 0.26 });
      this.tone({ type: "square", frequency: 1480, endFrequency: 520, duration: 0.1, volume: 0.12 });
      this.tone({ type: "triangle", frequency: 240, endFrequency: 86, duration: 0.28, volume: 0.18, when: 0.02 });
    } else {
      this.noise({ duration: 0.24, volume: 0.42, filterFrequency: kind === "ram" ? 360 : 560 });
      this.tone({ type: "sawtooth", frequency: kind === "ram" ? 150 : 220, endFrequency: 58, duration: 0.27, volume: 0.3 });
      this.tone({ type: "square", frequency: 92, endFrequency: 44, duration: 0.32, volume: 0.22, when: 0.015 });
      this.tone({ type: "triangle", frequency: 720, endFrequency: 380, duration: 0.08, volume: 0.08, when: 0.035 });
    }
  },
  circleUltimateStart() {
    if (!this.throttle("circle-ultimate-start", 0.4)) return;
    this.noise({ duration: 0.28, volume: 0.2, filterFrequency: 1200 });
    this.tone({ type: "sine", frequency: 92, endFrequency: 44, duration: 0.75, volume: 0.3 });
    this.tone({ type: "triangle", frequency: 440, endFrequency: 660, duration: 0.42, volume: 0.16, when: 0.06 });
    this.tone({ type: "sine", frequency: 880, endFrequency: 1320, duration: 0.32, volume: 0.08, when: 0.18 });
  },
  circleUltimateRelease(success = true) {
    if (!this.throttle("circle-ultimate-release", 0.2)) return;
    if (!success) {
      this.tone({ type: "triangle", frequency: 260, endFrequency: 130, duration: 0.22, volume: 0.14 });
      this.noise({ duration: 0.08, volume: 0.08, filterFrequency: 900 });
      return;
    }
    this.noise({ duration: 0.34, volume: 0.34, filterFrequency: 700 });
    this.tone({ type: "sawtooth", frequency: 110, endFrequency: 36, duration: 0.5, volume: 0.34 });
    this.tone({ type: "triangle", frequency: 660, endFrequency: 1760, duration: 0.24, volume: 0.16, when: 0.03 });
    this.tone({ type: "sine", frequency: 1320, endFrequency: 520, duration: 0.36, volume: 0.12, when: 0.12 });
  },
  magnet(started = false, ramp = 0) {
    if (!this.throttle("magnet", started ? 0.22 : 0.16)) return;
    if (started) {
      this.noise({ duration: 0.08, volume: 0.12, filterFrequency: 1500 });
      this.tone({ type: "sine", frequency: 190, endFrequency: 460, duration: 0.22, volume: 0.26 });
      this.tone({ type: "triangle", frequency: 820, endFrequency: 560, duration: 0.16, volume: 0.13, when: 0.035 });
    } else {
      const base = 132 + ramp * 170;
      this.tone({ type: "sine", frequency: base, endFrequency: base + 28 + ramp * 90, duration: 0.16, volume: 0.085 + ramp * 0.075 });
      if (ramp > 0.62) {
        this.tone({ type: "triangle", frequency: 620 + ramp * 420, endFrequency: 460 + ramp * 260, duration: 0.08, volume: 0.055 + ramp * 0.045, when: 0.03 });
      }
      if (ramp > 0.86) {
        this.noise({ duration: 0.035, volume: 0.045, filterFrequency: 3200 + ramp * 1200, when: 0.02 });
      }
    }
  },
  start() {
    if (!this.throttle("start", 0.35)) return;
    this.tone({ type: "sine", frequency: 360, endFrequency: 720, duration: 0.16, volume: 0.22 });
    this.tone({ type: "triangle", frequency: 720, endFrequency: 960, duration: 0.18, volume: 0.16, when: 0.1 });
  },
  ultimateCharge(type) {
    if (!this.throttle("ultimate-charge", 0.2)) return;
    const high = type === "nuke" ? 760 : type === "missiles" ? 920 : type === "lockdown" ? 1120 : 860;
    this.tone({ type: "sine", frequency: 180, endFrequency: high, duration: 0.22, volume: 0.2 });
    this.tone({ type: "triangle", frequency: high * 0.52, endFrequency: high * 1.18, duration: 0.18, volume: 0.11, when: 0.08 });
    this.noise({ duration: 0.07, volume: 0.08, filterFrequency: 2600, when: 0.14 });
  },
  ultimate(type) {
    if (type === "nuke") {
      this.noise({ duration: 0.65, volume: 0.38, filterFrequency: 1000 });
      this.tone({ type: "sine", frequency: 90, endFrequency: 36, duration: 0.75, volume: 0.42 });
      this.tone({ type: "triangle", frequency: 620, endFrequency: 160, duration: 0.34, volume: 0.2, when: 0.04 });
    } else if (type === "missiles") {
      this.tone({ type: "sawtooth", frequency: 250, endFrequency: 900, duration: 0.42, volume: 0.26 });
      this.noise({ duration: 0.24, volume: 0.18, filterFrequency: 1600 });
    } else {
      this.tone({ type: "triangle", frequency: 240, endFrequency: 760, duration: 0.24, volume: 0.24 });
      this.tone({ type: "triangle", frequency: 320, endFrequency: 900, duration: 0.22, volume: 0.18, when: 0.08 });
      this.tone({ type: "triangle", frequency: 420, endFrequency: 1100, duration: 0.2, volume: 0.16, when: 0.16 });
    }
  },
};

function setPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.active = true;
  if (typeof event.buttons === "number") {
    pointer.leftDown = Boolean(event.buttons & 1);
    pointer.rightDown = Boolean(event.buttons & 2);
  }
  pointer.x = clamp(((event.clientX - rect.left) / rect.width) * WIDTH, 18, WIDTH - 18);
  pointer.y = clamp(((event.clientY - rect.top) / rect.height) * HEIGHT, 18, HEIGHT - 18);
}

function releasePointerControl() {
  pointer.active = false;
  pointer.leftDown = false;
  pointer.rightDown = false;
}

function resetGame() {
  audio.unlock();
  audio.start();
  player = {
    x: WIDTH / 2,
    y: HEIGHT - 120,
    r: 7,
    hits: MAX_PLAYER_HITS,
    invuln: 1.4,
    charge: 0,
    mainWeapon: "normal",
    mainTimer: 0,
    subWeapon: "none",
    subTimer: 0,
    inventory: [],
    rapidMissileTimer: 0,
    lockdownTimer: 0,
    laserUltimateTimer: 0,
    laserUltimateMax: 0,
    laserUltimateMode: "overdrive",
    laserWarmup: 0,
    frenzyTimer: 0,
  };
  pointer.x = player.x;
  pointer.y = player.y;
  bullets = [];
  playerShots = [];
  playerTrail = [];
  drones = [];
  boss = null;
  shards = [];
  powerups = [];
  missiles = [];
  missileTrails = [];
  particles = [];
  floatingTexts = [];
  shieldTransfers = [];
  muzzleBlasts = [];
  nukeEffects = [];
  missileSplashEffects = [];
  civilianShips = [];
  playerLaserBeam = null;
  supportShips = [];
  supportTrails = [];
  supportPathLanes = [];
  ultimateCue = null;
  circleUltimate = null;
  playerDeathSequence = null;
  score = 0;
  streakCharge = 0;
  streakDecayDelay = 0;
  inventoryUnlockFlash = 0;
  lastInventorySlotCount = 1;
  bestStreakLevel = 0;
  runStats = {
    startedAt: Date.now(),
    sRankTime: 0,
    kills: emptyKills(),
  };
  nextBossWave = ACTIVE_WAVE_PACE.boss;
  wave = 1;
  announcedWave = 1;
  elapsed = 0;
  spawnTimer = 1.05;
  formationTimer = 2.8;
  minefieldTimer = 5.0;
  breatherTimer = 1.2;
  lootBreatherCooldown = 0;
  pendingThreat = null;
  shotTimer = 0;
  missileTimer = 0.85;
  machineGunTimer = 0;
  laserTickTimer = 0;
  mothershipSpawnCooldown = 6;
  shake = 0;
  hitStop = 0;
  hitStopCooldown = 0;
  playerDamageFlash = 0;
  playerDamagePulse = 0;
  playerDamageKind = "bullet";
  playerHealFlash = 0;
  playerHealPulse = 0;
  magnetWasDown = false;
  magnetHoldTime = 0;
  state = "playing";
  startScreen.classList.add("hidden");
  gameShell.classList.remove("hidden");
  overlay.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  audio.setMusicMode("normal");
  updateHud();
}

function addFloatingText(x, y, text, color = "#edf7f5", options = {}) {
  floatingTexts.push({
    x,
    y,
    text,
    color,
    scoreMultiplier: options.scoreMultiplier || "",
    suffix: options.suffix || "",
    suffixColor: options.suffixColor || color,
    life: 0.85,
    maxLife: 0.85,
  });
}

function addMuzzleBlast(x, y, options = {}) {
  muzzleBlasts.push({
    x,
    y,
    angle: options.angle ?? -Math.PI / 2,
    color: options.color || "#ffd166",
    coreColor: options.coreColor || "#edf7f5",
    type: options.type || "cone",
    size: options.size || 1,
    life: options.life || 0.18,
    maxLife: options.life || 0.18,
  });
}

function updateHud() {
  const hits = Math.max(0, player.hits);
  if (healthText) {
    healthText.innerHTML = "";
    healthText.setAttribute("aria-label", `${hits} of ${MAX_PLAYER_HITS} hits remaining`);
    for (let i = 0; i < MAX_PLAYER_HITS; i += 1) {
      const pip = document.createElement("span");
      pip.className = i < hits ? "hit-pip filled" : "hit-pip";
      healthText.appendChild(pip);
    }
  }
  if (scoreText) scoreText.textContent = Math.round(score).toLocaleString();
  const layer = currentStreakLayer();
  let streakLabel = streakText.querySelector("span");
  let streakGrade = streakText.querySelector("b");
  if (!streakLabel || !streakGrade) {
    streakText.innerHTML = "<span>Streak</span><b>-</b>";
    streakLabel = streakText.querySelector("span");
    streakGrade = streakText.querySelector("b");
  }
  streakGrade.textContent = layer ? layer.grade : "-";
  streakText.style.color = layer ? layer.color : "#edf7f5";
  streakText.style.opacity = layer ? 1 : 0.55;
  streakText.classList.toggle("s-rank", hasSStreak());
  streakFill.style.width = `${currentStreakProgress() * 100}%`;
  streakFill.style.background = layer ? layer.color : "rgba(237, 247, 245, 0.28)";
  streakFill.style.color = layer ? layer.color : "rgba(237, 247, 245, 0.28)";
  streakFill.style.opacity = streakCharge > 0 ? (streakDecayDelay > 0 ? 1 : 0.64 + Math.sin(elapsed * 18) * 0.18) : 0.45;
  if (bestScoreText) bestScoreText.textContent = bestRunSummary ? bestRunSummary.score.toLocaleString() : "0";
  if (lastScoreText) lastScoreText.textContent = lastRunSummary ? lastRunSummary.score.toLocaleString() : "0";
  if (waveText) waveText.textContent = wave;
  const energy = Math.max(0, player.charge);
  if (chargeText) {
    chargeText.innerHTML = "";
    chargeText.setAttribute("aria-label", `${energy} of ${MAX_ENERGY} energy units`);
    for (let i = 0; i < MAX_ENERGY; i += 1) {
      const pip = document.createElement("span");
      pip.className = i < energy ? "energy-pip filled" : "energy-pip";
      chargeText.appendChild(pip);
    }
  }
  if (shotgunMeter) shotgunMeter.style.width = `${player.mainWeapon === "shotgun" ? clamp(player.mainTimer / 8, 0, 1) * 100 : 0}%`;
  if (laserMeter) laserMeter.style.width = `${player.mainWeapon === "laser" ? clamp(player.mainTimer / 8, 0, 1) * 100 : 0}%`;
  if (missileMeter) missileMeter.style.width = `${player.subWeapon === "missiles" ? clamp(player.subTimer / 10, 0, 1) * 100 : 0}%`;
  if (machineGunMeter) machineGunMeter.style.width = `${player.subWeapon === "machinegun" ? clamp(player.subTimer / 10, 0, 1) * 100 : 0}%`;
  updateDebugPanel();
}

function updateTitleRecords() {
  if (titleBestScoreText) titleBestScoreText.textContent = bestRunSummary ? bestRunSummary.score.toLocaleString() : "0";
  if (titleLastScoreText) titleLastScoreText.textContent = lastRunSummary ? lastRunSummary.score.toLocaleString() : "0";
}

function updateVolumeUi() {
  const volumeControls = document.querySelectorAll("[data-volume]");
  const volumeReadouts = document.querySelectorAll("[data-volume-readout]");
  volumeControls.forEach((control) => {
    const channel = control.dataset.volume;
    const value = Math.round((audio.settings[channel] ?? 0) * 100);
    control.value = String(value);
  });
  volumeReadouts.forEach((readout) => {
    const channel = readout.dataset.volumeReadout;
    readout.textContent = `${Math.round((audio.settings[channel] ?? 0) * 100)}%`;
  });
}

function formatDebugTime(value) {
  return Math.max(0, value).toFixed(1);
}

function updateDebugPanel() {
  if (!debugPanel) return;
  debugPanel.classList.toggle("hidden", !debugVisible);
  if (!debugVisible || !player) return;

  const activeCannons = boss ? boss.parts.filter((part) => part.alive).length : 0;
  const bossInfo = boss
    ? `${Math.max(0, Math.ceil(boss.hp))}/${boss.maxHp} | C ${activeCannons}/4`
    : "none";
  debugPanel.innerHTML = `
    <b>Debug</b>
    <div class="debug-grid">
      <span>Main</span><span>${player.mainWeapon} ${formatDebugTime(player.mainTimer)}</span>
      <span>Sub</span><span>${player.subWeapon} ${formatDebugTime(player.subTimer)}</span>
      <span>Hull/Energy</span><span>${player.hits}/${MAX_PLAYER_HITS} | ${player.charge}/${MAX_ENERGY}</span>
      <span>Streak</span><span>${currentStreakLayer() ? currentStreakLayer().grade : "-"} | S key</span>
      <span>Score</span><span>${Math.round(score)}</span>
      <span>Best</span><span>${bestRunSummary ? bestRunSummary.score.toLocaleString() : 0}</span>
      <span>Last</span><span>${lastRunSummary ? lastRunSummary.score.toLocaleString() : 0}</span>
      <span>Boss Wave</span><span>${nextBossWave}</span>
      <span>Boss</span><span>${bossInfo}</span>
      <span>Enemies</span><span>${drones.length}</span>
      <span>Bullets</span><span>${bullets.length}</span>
      <span>Drops</span><span>${shards.length}/${powerups.length}</span>
      <span>Music</span><span>${audio.musicMode}/${audio.musicVariant}</span>
    </div>`;
}

function renderEntryList(entries) {
  encyclopediaBody.innerHTML = entries
    .map((entry) => `
      <article class="encyclopedia-entry">
        <div class="entry-mark ${entry.shape}" style="background:${entry.color}">${entry.mark}</div>
        <div class="entry-copy">
          <h3>${entry.title}</h3>
          <p>${entry.text}</p>
          <small>${entry.tip}</small>
        </div>
      </article>`)
    .join("");
}

function renderSettingsMenu() {
  encyclopediaBody.innerHTML = `
      <section class="settings-menu" aria-label="Settings">
        <article class="settings-card">
          <div>
            <h3>Audio Mix</h3>
            <p>Separate the soundtrack from impact sounds, weapons, pickups, and warnings.</p>
          </div>
          <label>
            <b>Music</b>
            <input type="range" min="0" max="100" step="1" value="42" data-volume="music" aria-label="Background music volume">
            <em data-volume-readout="music">42%</em>
          </label>
          <label>
            <b>Effects</b>
            <input type="range" min="0" max="100" step="1" value="55" data-volume="sfx" aria-label="Sound effects volume">
            <em data-volume-readout="sfx">55%</em>
          </label>
        </article>
      </section>`;
  updateVolumeUi();
}

function renderPauseMenu(section = pauseMenuSection, tab = encyclopediaTab) {
  if (!encyclopediaBody || !encyclopediaTabs || !pauseMenuTabs) return;
  pauseMenuSection = section;
  pauseMenuTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.menu === section);
  });
  encyclopediaTabs.classList.toggle("submenu-hidden", section !== "encyclopedia");
  if (section === "settings") {
    renderSettingsMenu();
    return;
  }
  if (section === "help") {
    renderEntryList(encyclopedia.help || []);
    return;
  }
  encyclopediaTab = tab;
  encyclopediaTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  renderEntryList(tab === "debug" ? debugKeyEntries : encyclopedia[tab] || encyclopedia.enemies);
}

function openPauseMenu() {
  if (state !== "playing") return;
  state = "paused";
  keys.clear();
  pointer.leftDown = false;
  pointer.rightDown = false;
  audio.stopMusic();
  pauseMenu.classList.remove("hidden");
  renderPauseMenu();
}

function closePauseMenu() {
  if (state !== "paused") return;
  state = "playing";
  pauseMenu.classList.add("hidden");
  audio.startMusic();
  lastTime = performance.now();
}

function togglePauseMenu() {
  if (state === "playing") {
    openPauseMenu();
  } else if (state === "paused") {
    closePauseMenu();
  }
}

function addParticles(x, y, color, count = 10, speed = 150) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, Math.PI * 2);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * rand(25, speed),
      vy: Math.sin(angle) * rand(25, speed),
      life: rand(0.18, 0.65),
      maxLife: 0.65,
      color,
    });
  }
}

function addParticle(x, y, options = {}) {
  const angle = options.angle ?? rand(0, Math.PI * 2);
  const speed = rand(options.minSpeed ?? 25, options.speed ?? 150);
  particles.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: rand(options.minLife ?? 0.18, options.life ?? 0.65),
    maxLife: options.life ?? 0.65,
    color: options.color ?? "#ffd166",
    shape: options.shape ?? "spark",
    size: options.size ?? 3,
    spin: options.spin ?? rand(-8, 8),
    angle,
    drag: options.drag ?? 0.98,
    gravity: options.gravity ?? 0,
  });
}

function ejectShell(x, y, options = {}) {
  const side = options.side ?? (Math.random() < 0.5 ? -1 : 1);
  addParticle(x, y, {
    angle: options.angle ?? rand(0.25, 0.72) * Math.PI * side,
    color: options.color ?? "#c58b42",
    shape: options.shape ?? "shell",
    minSpeed: options.minSpeed ?? 60,
    speed: options.speed ?? 150,
    life: options.life ?? 0.72,
    minLife: options.minLife ?? 0.42,
    size: options.size ?? 5,
    spin: options.spin ?? rand(-18, 18),
    drag: options.drag ?? 0.988,
    gravity: options.gravity ?? 420,
  });
}

function addRingBurst(x, y, color, count, radius, speed, size = 4) {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    addParticle(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, {
      angle,
      color,
      shape: "dot",
      speed,
      minSpeed: speed * 0.75,
      life: 0.55,
      size,
      drag: 0.965,
    });
  }
}

function requestKillImpact(type = "ship") {
  const duration = type === "mothership" ? 0.09 : type === "cargo" || type === "jet" || type === "ufo" ? 0.055 : 0.035;
  hitStop = Math.max(hitStop, duration);
  shake = Math.max(shake, type === "mothership" ? 0.36 : type === "cargo" ? 0.18 : type === "jet" || type === "ufo" ? 0.15 : 0.1);
}

function addLootReleaseFlash(x, y, color = "#6df6d5", valuable = false) {
  addRingBurst(x, y, color, valuable ? 14 : 9, valuable ? 9 : 5, valuable ? 240 : 180, valuable ? 3 : 2.2);
  for (let i = 0; i < (valuable ? 10 : 6); i += 1) {
    addParticle(x, y, {
      color: i % 2 ? color : "#edf7f5",
      shape: valuable ? "shard" : "dot",
      speed: valuable ? 220 : 150,
      minSpeed: 45,
      life: valuable ? 0.42 : 0.28,
      size: valuable ? rand(3, 7) : rand(2, 4),
      drag: 0.95,
    });
  }
}

function applyMissileSplash(missile, primaryTarget = null) {
  if (!missile.aoe) return;
  const radius = missile.aoe;
  missileSplashEffects.push({
    x: missile.x,
    y: missile.y,
    radius,
    color: "#8a7dff",
    ringColor: "#edf7f5",
    life: 0.28,
    maxLife: 0.28,
  });
  addRingBurst(missile.x, missile.y, "#8a7dff", 28, 6, 340, 3.4);
  addRingBurst(missile.x, missile.y, "#edf7f5", 14, radius * 0.25, 220, 2.2);
  addParticles(missile.x, missile.y, "#8a7dff", 26, 260);
  drones.forEach((drone) => {
    if (drone === primaryTarget || drone.hp <= 0) return;
    if (dist2(missile, drone) <= radius * radius) {
      if (drone.type === "mothership") {
        triggerMotherlandEvacuation(drone, missile.x, missile.y);
        return;
      }
      if (!isDroneVulnerable(drone)) return;
      const result = damageDrone(drone, missile.power * 0.45 * streakDamageMultiplier(), "missile", projectileImpactAngle(missile, drone));
      addParticles(drone.x, drone.y, result.shieldHit ? SHIELD_COLOR : "#8a7dff", 8, 140);
      if (drone.hp <= 0) destroyDrone(drone);
    }
  });
  if (boss) {
    bossTargets().forEach((target) => {
      if (dist2(missile, target) <= radius * radius) {
        damageBossTarget(target, missile.power * 0.32 * streakDamageMultiplier());
      }
    });
  }
}

function applyMineBlast(mine) {
  if (!mine) return;
  const radius = MINE_BLAST_RADIUS;
  let enemyHits = 0;
  missileSplashEffects.push({
    x: mine.x,
    y: mine.y,
    radius,
    color: "#ff5b74",
    ringColor: "#ffd166",
    life: 0.24,
    maxLife: 0.24,
  });
  addRingBurst(mine.x, mine.y, "#ff5b74", 30, 8, 390, 3.8);
  addRingBurst(mine.x, mine.y, "#ffd166", 18, radius * 0.18, 260, 2.6);
  addParticles(mine.x, mine.y, "#ff5b74", 28, 290);

  [...drones].forEach((drone) => {
    if (drone === mine || drone.hp <= 0) return;
    if (dist2(mine, drone) <= radius * radius) {
      if (drone.type === "mothership") {
        triggerMotherlandEvacuation(drone, mine.x, mine.y);
        return;
      }
      if (!isDroneVulnerable(drone)) return;
      const result = damageDrone(drone, MINE_BLAST_DAMAGE, "mine", projectileImpactAngle(mine, drone));
      enemyHits += 1;
      drone.flash = Math.max(drone.flash, 0.16);
      addParticles(drone.x, drone.y, result.shieldHit ? SHIELD_COLOR : result.armorHit ? "#ffd166" : "#ff5b74", 10, 170);
      audio.enemyHit("missile", drone.hp / drone.maxHp, impactLayer(result));
      if (drone.hp <= 0) destroyDrone(drone);
    }
  });

  if (boss) {
    bossTargets().forEach((target) => {
      if (dist2(mine, target) <= radius * radius) {
        damageBossTarget(target, MINE_BLAST_DAMAGE * 0.55);
        enemyHits += 1;
      }
    });
  }
  if (enemyHits > 0) {
    addRingBurst(mine.x, mine.y, "#ffd166", 18 + enemyHits * 3, radius * 0.22, 260, 3);
  }
}

function damagePlayer({ kind = "bullet", label = "HULL HIT", knockbackAngle = null, knockback = 0, shakeAmount = 0.32 } = {}) {
  if (!player || player.invuln > 0) return false;
  player.hits -= 1;
  player.invuln = PLAYER_HIT_INVULN;
  if (knockbackAngle !== null && knockback > 0) {
    player.x = clamp(player.x + Math.cos(knockbackAngle) * knockback, 18, WIDTH - 18);
    player.y = clamp(player.y + Math.sin(knockbackAngle) * knockback, 18, HEIGHT - 18);
  }
  playerDamageKind = kind;
  playerDamageFlash = Math.max(playerDamageFlash, kind === "laser" ? 0.42 : 0.34);
  playerDamagePulse = Math.max(playerDamagePulse, 0.34);
  clearStreak();
  shake = Math.max(shake, shakeAmount);
  hitStop = Math.max(hitStop, kind === "laser" || kind === "ram" ? 0.145 : 0.12);
  addFloatingText(player.x, player.y - 28, label, "#ff5b74");
  addRingBurst(player.x, player.y, "#ff5b74", kind === "laser" ? 28 : 22, 9, kind === "ram" ? 330 : 280, 4);
  addRingBurst(player.x, player.y, "#ffd166", 12, 2, 210, 2.6);
  addParticles(player.x, player.y, "#ff5b74", kind === "laser" ? 34 : 28, kind === "ram" ? 330 : 280);
  addParticles(player.x, player.y, "#edf7f5", 10, 170);
  audio.playerHit(kind);
  updateHud();
  return true;
}

function healPlayer(amount = 1) {
  if (!player || amount <= 0 || player.hits >= MAX_PLAYER_HITS) return false;
  player.hits = Math.min(MAX_PLAYER_HITS, player.hits + amount);
  playerHealFlash = Math.max(playerHealFlash, 0.44);
  playerHealPulse = Math.max(playerHealPulse, 0.58);
  addFloatingText(player.x, player.y - 62, `+${amount} HULL`, "#7cf7a8");
  addRingBurst(player.x, player.y, "#7cf7a8", 30, 8, 260, 4);
  addRingBurst(player.x, player.y, "#edf7f5", 16, 2, 190, 2.7);
  addParticles(player.x, player.y, "#7cf7a8", 34, 260);
  addParticles(player.x, player.y, "#ffd166", 12, 160);
  audio.playerHeal();
  updateHud();
  return true;
}

function startPlayerDeathSequence() {
  if (!player || playerDeathSequence) return;
  state = "dying";
  audio.stopMusic();
  pointer.leftDown = false;
  pointer.rightDown = false;
  magnetWasDown = false;
  magnetHoldTime = 0;
  hitStop = 0;
  playerDeathSequence = {
    x: player.x,
    y: player.y,
    timer: 1.55,
    maxTimer: 1.55,
  };
  playerDamageFlash = Math.max(playerDamageFlash, 0.6);
  playerDamagePulse = Math.max(playerDamagePulse, 0.5);
  shake = Math.max(shake, 0.78);
  addFloatingText(player.x, player.y - 42, "SHIP LOST", "#ff5b74");
  addRingBurst(player.x, player.y, "#ff5b74", 38, 8, 430, 5);
  addRingBurst(player.x, player.y, "#ffd166", 28, 22, 360, 4);
  addRingBurst(player.x, player.y, "#edf7f5", 18, 3, 250, 3);
  for (let i = 0; i < 58; i += 1) {
    addParticle(player.x + rand(-8, 8), player.y + rand(-8, 8), {
      color: i % 3 === 0 ? "#ff5b74" : i % 3 === 1 ? "#ffd166" : "#edf7f5",
      shape: i % 2 ? "shard" : "spark",
      speed: 520,
      minSpeed: 80,
      life: rand(0.45, 1.05),
      size: rand(4, 11),
      drag: 0.965,
    });
  }
  audio.playerDeath();
}

function addDeathAnimation(drone) {
  const deathColor = drone.type === "ufo" ? "#8a7dff" : drone.type === "cargo" ? "#ffd166" : drone.type === "jet" ? "#edf7f5" : drone.type === "mothership" ? "#6df6d5" : "#ff8c42";
  addRingBurst(drone.x, drone.y, deathColor, drone.type === "mothership" ? 26 : 12, drone.r * 0.25, drone.type === "mothership" ? 420 : 260, drone.type === "mothership" ? 4.5 : 2.8);
  addRingBurst(drone.x, drone.y, "#edf7f5", drone.type === "mothership" ? 16 : 7, 1, drone.type === "mothership" ? 280 : 180, drone.type === "mothership" ? 3 : 2);
  if (drone.type === "ufo") {
    addRingBurst(drone.x, drone.y, "#8a7dff", 30, 14, 310, 3.5);
    addRingBurst(drone.x, drone.y, "#6df6d5", 22, 4, 230, 2.5);
    for (let i = 0; i < 28; i += 1) {
      addParticle(drone.x, drone.y, {
        color: i % 3 === 0 ? "#6df6d5" : i % 3 === 1 ? "#edf7f5" : "#8a7dff",
        shape: "slash",
        speed: 390,
        minSpeed: 130,
        life: 0.54,
        size: rand(8, 15),
      });
    }
    return;
  }

  if (drone.type === "cargo") {
    addRingBurst(drone.x, drone.y, "#ffd166", 32, 16, 330, 4.5);
    addRingBurst(drone.x, drone.y, "#ff5b74", 12, 5, 220, 3);
    for (let i = 0; i < 14; i += 1) {
      addParticle(drone.x + rand(-18, 18), drone.y + rand(-12, 12), {
        color: "#ffd166",
        shape: "plate",
        speed: 360,
        minSpeed: 130,
        life: 0.82,
        size: rand(8, 14),
        drag: 0.955,
      });
    }
    for (let i = 0; i < 30; i += 1) {
      addParticle(drone.x + rand(-16, 16), drone.y + rand(-12, 12), {
        color: i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#ff5b74" : "#edf7f5",
        shape: i % 2 ? "shard" : "spark",
        speed: 380,
        minSpeed: 70,
        life: 0.72,
        size: rand(4, 9),
      });
    }
    return;
  }

  if (drone.type === "splitter") {
    const stats = splitterStats(drone.splitterTier || "L");
    addRingBurst(drone.x, drone.y, "#ff5b74", stats.tier === "L" ? 32 : 22, drone.r * 0.38, 330, 3.2);
    addRingBurst(drone.x, drone.y, stats.color, stats.tier === "S" ? 8 : 14, 2, 230, 2.5);
    for (let i = 0; i < (stats.tier === "L" ? 36 : stats.tier === "M" ? 24 : 14); i += 1) {
      addParticle(drone.x, drone.y, {
        color: i % 3 === 0 ? stats.color : i % 3 === 1 ? "#ff5b74" : "#edf7f5",
        shape: i % 2 ? "shard" : "slash",
        speed: stats.tier === "L" ? 430 : 340,
        minSpeed: 90,
        life: 0.58,
        size: rand(stats.tier === "S" ? 3 : 4, stats.tier === "L" ? 14 : 10),
      });
    }
    return;
  }

  if (drone.type === "mine") {
    addRingBurst(drone.x, drone.y, "#ff5b74", 20, 7, 300, 3.2);
    addRingBurst(drone.x, drone.y, "#ffd166", 12, 2, 220, 2.4);
    for (let i = 0; i < 22; i += 1) {
      addParticle(drone.x, drone.y, {
        color: i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#ff5b74" : "#edf7f5",
        shape: i % 2 ? "spark" : "shard",
        speed: 330,
        minSpeed: 70,
        life: 0.5,
        size: rand(3, 8),
        drag: 0.96,
      });
    }
    return;
  }

  if (drone.type === "jet") {
    addRingBurst(drone.x, drone.y, "#edf7f5", 22, 9, 340, 3);
    addRingBurst(drone.x, drone.y + 16, "#ff5b74", 12, 4, 250, 2.5);
    const driftAngle = Math.PI / 2 + rand(-0.35, 0.35);
    for (let i = 0; i < 32; i += 1) {
      addParticle(drone.x, drone.y, {
        color: i % 2 ? "#ff5b74" : "#edf7f5",
        shape: i % 3 === 0 ? "slash" : "spark",
        angle: i < 16 ? driftAngle + rand(-0.55, 0.55) : undefined,
        speed: 410,
        minSpeed: 95,
        life: 0.64,
        size: rand(4, 10),
        drag: 0.962,
      });
    }
    return;
  }

  if (drone.type === "mothership") {
    addRingBurst(drone.x, drone.y, FRENZY_AURA_COLOR, 42, 46, 520, 5);
    addRingBurst(drone.x, drone.y, "#6df6d5", 40, 22, 430, 5);
    addRingBurst(drone.x, drone.y, "#ff5b74", 34, 64, 360, 4);
    for (let i = 0; i < 64; i += 1) {
      addParticle(drone.x + rand(-28, 28), drone.y + rand(-18, 22), {
        color: i % 3 === 0 ? "#6df6d5" : i % 3 === 1 ? "#ffd166" : "#ff5b74",
        shape: i % 2 ? "shard" : "spark",
        speed: 520,
        minSpeed: 90,
        life: rand(0.7, 1.1),
        size: rand(4, 12),
        drag: 0.972,
      });
    }
    return;
  }

  addRingBurst(drone.x, drone.y, "#ffd166", 16, 5, 240, 2.7);
  for (let i = 0; i < 34; i += 1) {
    addParticle(drone.x, drone.y, {
      color: i % 3 === 0 ? "#edf7f5" : i % 3 === 1 ? "#ffd166" : "#ff5b74",
      shape: i % 3 === 0 ? "shard" : "spark",
      speed: 330,
      minSpeed: 55,
      life: 0.58,
      size: rand(3, 8),
    });
  }
}

function addBossCannonDeath(x, y) {
  audio.enemyDeath("cargo");
  requestKillImpact("cargo");
  addRingBurst(x, y, "#ffd166", 24, 7, 360, 3.5);
  addRingBurst(x, y, "#edf7f5", 12, 2, 240, 2.4);
  for (let i = 0; i < 12; i += 1) {
    addParticle(x, y, {
      color: "#ffd166",
      shape: "plate",
      speed: 380,
      minSpeed: 120,
      life: 0.74,
      size: rand(7, 13),
      drag: 0.955,
    });
  }
  for (let i = 0; i < 24; i += 1) {
    addParticle(x, y, {
      color: i % 2 ? "#edf7f5" : "#ff5b74",
      shape: "slash",
      speed: 360,
      minSpeed: 80,
      life: 0.62,
      size: rand(8, 16),
    });
  }
}

function addBossTorsoDeath(x, y) {
  audio.enemyDeath("mothership");
  requestKillImpact("mothership");
  addRingBurst(x, y, "#ff5b74", 44, 22, 520, 5);
  addRingBurst(x, y, "#ffd166", 34, 44, 420, 4);
  addRingBurst(x, y, "#edf7f5", 24, 8, 300, 3);
  for (let i = 0; i < 70; i += 1) {
    addParticle(x + rand(-34, 34), y + rand(-24, 28), {
      color: i % 3 === 0 ? "#ff5b74" : i % 3 === 1 ? "#ffd166" : "#edf7f5",
      shape: i % 2 ? "shard" : "spark",
      speed: 560,
      minSpeed: 110,
      life: 1,
      size: rand(4, 11),
      drag: 0.968,
    });
  }
}

function keepLootInPlay(x, y, vx, vy, margin = 34) {
  const safeX = clamp(x, margin, WIDTH - margin);
  const safeY = clamp(y, margin, HEIGHT - margin);
  let nextVx = clamp(vx, -92, 92);
  let nextVy = clamp(vy, -70, 112);
  const leftPressure = clamp((margin * 1.8 - safeX) / (margin * 1.8), 0, 1);
  const rightPressure = clamp((safeX - (WIDTH - margin * 1.8)) / (margin * 1.8), 0, 1);
  const topPressure = clamp((margin * 1.5 - safeY) / (margin * 1.5), 0, 1);
  const bottomPressure = clamp((safeY - (HEIGHT - margin * 1.5)) / (margin * 1.5), 0, 1);
  if (leftPressure > 0) nextVx = Math.abs(nextVx) * 0.45 + 42 * leftPressure;
  if (rightPressure > 0) nextVx = -Math.abs(nextVx) * 0.45 - 42 * rightPressure;
  if (topPressure > 0) nextVy = Math.abs(nextVy) * 0.45 + 34 * topPressure;
  if (bottomPressure > 0) nextVy = -Math.abs(nextVy) * 0.45 - 34 * bottomPressure;
  return { x: safeX, y: safeY, vx: nextVx, vy: nextVy };
}

function spawnEnergyShard(x, y) {
  const angle = rand(-Math.PI * 0.88, -Math.PI * 0.12);
  const speed = rand(48, 106);
  const safe = keepLootInPlay(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed + 52, 38);
  addLootReleaseFlash(safe.x, safe.y, "#6df6d5", false);
  shards.push({
    x: safe.x,
    y: safe.y,
    r: 6,
    vx: safe.vx,
    vy: safe.vy,
    wobble: rand(0, Math.PI * 2),
    drift: rand(-22, 22),
    magnetWeight: 0.095,
    life: rand(8.4, 10.8),
  });
}

function spawnBullet(x, y, angle, speed, radius, color, turn = 0) {
  addMuzzleBlast(x, y, { angle, color, coreColor: "#ffd166", type: "danger", size: 0.95, life: 0.2 });
  bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    color,
    turn,
    angle,
    speed,
    magnetWeight: 1,
  });
}

function spawnMothershipShot(x, y, angle, index, count) {
  const spread = (index - (count - 1) / 2) * 0.055;
  spawnBullet(x, y, angle + spread, 175 + wave * 8, 5, "#ff8c42");
}

function spawnBossMissile(x, y, angle, ownerId = null) {
  addMuzzleBlast(x, y, { angle, color: "#ffd166", coreColor: "#ff5b74", type: "danger", size: 1.15, life: 0.24 });
  bullets.push({
    x,
    y,
    vx: Math.cos(angle) * 175,
    vy: Math.sin(angle) * 175,
    r: 7,
    color: "#ffd166",
    angle,
    speed: 175,
    homing: true,
    homingTime: 1.25,
    life: 4.2,
    turnRate: 1.25,
    magnetWeight: 1.15,
    bossOwnerPart: ownerId,
  });
}

function spawnLaser(x, y, angle) {
  audio.laser();
  addMuzzleBlast(x, y, { angle, color: "#ff5b2e", coreColor: "#ffd166", type: "laser", size: 1.2, life: 0.26 });
  bullets.push({
    x,
    y,
    vx: Math.cos(angle) * (318 + wave * 12),
    vy: Math.sin(angle) * (318 + wave * 12),
    r: 7,
    length: 34,
    color: "#ff5b2e",
    coreColor: "#ffd166",
    angle,
    speed: 318 + wave * 12,
    laser: true,
    magnetWeight: 0,
    magnetBoost: 1.45,
  });
}

function spawnJetBullet(x, y, angle) {
  bullets.push({
    x,
    y,
    vx: Math.cos(angle) * (280 + wave * 9),
    vy: Math.sin(angle) * (280 + wave * 9),
    r: 3.5,
    color: "#ff5b74",
    coreColor: "#ffd166",
    angle,
    speed: 280 + wave * 9,
    magnetWeight: 0.85,
  });
}

function randomPlanetName() {
  return `Planet ${PLANET_NAME_WORDS[Math.floor(rand(0, PLANET_NAME_WORDS.length))]}`;
}

function randomPlanetStyle() {
  const palette = PLANET_PALETTES[Math.floor(rand(0, PLANET_PALETTES.length))];
  const craterCount = Math.floor(rand(3, 7));
  return {
    ...palette,
    bandTilt: rand(-0.3, 0.3),
    bandOffset: rand(-0.16, 0.16),
    ringTilt: rand(-0.28, 0.28),
    ringPhase: rand(0, Math.PI * 2),
    craterAlpha: rand(0.26, 0.46),
    craters: Array.from({ length: craterCount }, () => ({
      x: rand(-26, 26),
      y: rand(-22, 22),
      r: rand(3.2, 7.2),
    })),
  };
}

function spawnMothership() {
  const fromLeft = Math.random() < 0.5;
  const mothership = {
    x: fromLeft ? MOTHERLAND_RADIUS * 0.38 : WIDTH - MOTHERLAND_RADIUS * 0.38,
    y: -MOTHERLAND_RADIUS - 28,
    vx: 0,
    targetY: -MOTHERLAND_RADIUS - 28,
    r: MOTHERLAND_RADIUS,
    type: "mothership",
    name: randomPlanetName(),
    planetStyle: randomPlanetStyle(),
    hp: 1,
    maxHp: 1,
    invulnerable: true,
    armor: 0,
    maxArmor: 0,
    armorFlash: 0,
    cooldown: 1.55,
    wobble: rand(0, Math.PI * 2),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(0.32, 0.48) * (Math.random() < 0.5 ? -1 : 1),
    flash: 0,
    hitShake: 0,
  };
  drones.push(mothership);
  return mothership;
}

function spawnDebugMothershipPack() {
  const mother = activeMothership() || spawnMothership();
  mother.name = mother.name || randomPlanetName();
  mother.x = Math.random() < 0.5 ? MOTHERLAND_RADIUS * 0.38 : WIDTH - MOTHERLAND_RADIUS * 0.38;
  mother.y = 90;
  mother.vx = 0;
  mother.targetY = 90;
  mothershipSpawnCooldown = 28;

  for (let i = 0; i < 6; i += 1) {
    const column = i % 3;
    const row = Math.floor(i / 3);
    const maxHp = fighterHp(3 + Math.floor(wave / 4));
    drones.push({
      x: WIDTH / 2 + (column - 1) * 96 + rand(-12, 12),
      y: 170 + row * 58 + rand(-10, 10),
      vx: rand(-24, 24),
      targetY: 170 + row * 58 + rand(-8, 8),
      r: 17,
      type: "ship",
      hp: maxHp,
      maxHp,
      cooldown: rand(0.55, 1.15),
      wobble: rand(0, Math.PI * 2),
      flash: 0,
    });
  }
  if (debugVisible) {
    addFloatingText(WIDTH / 2, 72, `${mother.name} TEST`, FRENZY_AURA_COLOR);
  }
}

function spawnFirstBoss() {
  audio.mothershipAlert();
  audio.setMusicMode("boss");
  drones.forEach((drone) => {
    drone.exiting = true;
    drone.cooldown = 99;
    drone.vx = drone.x < WIDTH / 2 ? -150 : 150;
    drone.targetY = drone.y;
  });
  boss = {
    x: WIDTH / 2,
    y: -120,
    targetY: 128,
    r: 62,
    hp: 190,
    maxHp: 190,
    armor: 20,
    maxArmor: 20,
    armorFlash: 0,
    flash: 0,
    fireTimer: 1.4,
    reinforcementTimer: 5.2,
    wobble: 0,
    parts: [
      { id: "leftTop", label: "CANNON", offsetX: -76, offsetY: -20, r: 18, hp: 42, maxHp: 42, alive: true, flash: 0, fireTimer: 1.15 },
      { id: "rightTop", label: "CANNON", offsetX: 76, offsetY: -20, r: 18, hp: 42, maxHp: 42, alive: true, flash: 0, fireTimer: 1.35 },
      { id: "leftBottom", label: "CANNON", offsetX: -58, offsetY: 42, r: 18, hp: 42, maxHp: 42, alive: true, flash: 0, fireTimer: 1.55 },
      { id: "rightBottom", label: "CANNON", offsetX: 58, offsetY: 42, r: 18, hp: 42, maxHp: 42, alive: true, flash: 0, fireTimer: 1.75 },
    ],
  };
  addFloatingText(WIDTH / 2, 92, "BOSS: CANNON WARDEN", "#ff5b74");
  shake = Math.max(shake, 0.28);
}

function spawnDrone() {
  const side = Math.random() < 0.5 ? -24 : WIDTH + 24;
  const maxHp = fighterHp(3 + Math.floor(wave / 4));
  drones.push({
    x: side,
    y: rand(135, HEIGHT * 0.38),
    vx: side < 0 ? rand(42, 78) : rand(-78, -42),
    targetY: rand(145, HEIGHT * 0.42),
    r: 17,
    type: "ship",
    hp: maxHp,
    maxHp,
    cooldown: rand(FIGHTER_INITIAL_FIRE_DELAY[0], FIGHTER_INITIAL_FIRE_DELAY[1]),
    wobble: rand(0, Math.PI * 2),
    flash: 0,
  });
}

function spawnFormationFighter(options) {
  const maxHp = fighterHp(2 + Math.floor(wave / 5));
  drones.push({
    x: options.x,
    y: options.y,
    vx: options.vx || 0,
    targetY: options.targetY || options.y,
    r: 16,
    type: "ship",
    hp: maxHp,
    maxHp,
    cooldown: rand(2.3, 3.4),
    wobble: rand(0, Math.PI * 2),
    flash: 0,
    formation: {
      pattern: options.pattern || "line",
      laneX: options.laneX,
      offsetX: options.offsetX || 0,
      speed: options.speed || 86,
      arcAmp: options.arcAmp || 0,
      arcPhase: options.arcPhase || 0,
      sway: options.sway || 0,
      sweep: options.sweep || 0,
      startY: options.y,
    },
  });
}

function spawnBossReinforcements() {
  if (!boss) return;
  const maxHp = fighterHp(3 + Math.floor(wave / 4));
  const slots = [
    { x: -52, y: 54, vx: -78, targetX: -96 },
    { x: -22, y: 70, vx: -34, targetX: -42 },
    { x: 22, y: 70, vx: 34, targetX: 42 },
    { x: 52, y: 54, vx: 78, targetX: 96 },
  ];
  slots.forEach((slot, index) => {
    const x = clamp(boss.x + slot.x, 28, WIDTH - 28);
    const y = boss.y + slot.y;
    drones.push({
      x,
      y,
      vx: slot.vx,
      targetY: y + 86 + index * 7,
      r: 16,
      type: "ship",
      hp: maxHp,
      maxHp,
      cooldown: rand(1.35, 2.2),
      wobble: rand(0, Math.PI * 2),
      flash: 0,
      enteredScreen: true,
      bossEscort: true,
    });
    addMuzzleBlast(x, y, { angle: Math.PI / 2, color: "#ff8c42", coreColor: "#ffd166", type: "danger", size: 0.72, life: 0.12 });
  });
  addFloatingText(boss.x, boss.y + 94, "ESCORTS DEPLOYED", "#ff8c42");
  addRingBurst(boss.x, boss.y + 74, "#ff8c42", 18, 14, 210, 2.8);
  shake = Math.max(shake, 0.08);
}

function spawnFighterFormation(themeKey = currentWaveTheme().key) {
  if (activeEnemyCount("ship") > 12) return false;
  const pattern = themeKey === "formation" ? Math.floor(rand(0, 4)) : Math.floor(rand(0, 3));
  const count = pattern === 1 ? 7 : 6;
  const laneX = clamp(player ? player.x : WIDTH / 2, WIDTH * 0.24, WIDTH * 0.76);
  const speed = rand(78, 98) + wave * 1.5;

  if (pattern === 0) {
    for (let i = 0; i < count; i += 1) {
      spawnFormationFighter({
        x: laneX,
        y: -48 - i * 34,
        laneX,
        speed,
        pattern: "line",
      });
    }
  } else if (pattern === 1) {
    for (let i = 0; i < count; i += 1) {
      const offset = i - (count - 1) / 2;
      spawnFormationFighter({
        x: laneX + offset * 30,
        y: -58 - Math.abs(offset) * 26,
        laneX,
        offsetX: offset * 30,
        speed: speed * 0.92,
        arcAmp: 16,
        arcPhase: offset * 0.18,
        pattern: "chevron",
      });
    }
  } else if (pattern === 2) {
    for (let i = 0; i < count; i += 1) {
      const offset = i - (count - 1) / 2;
      spawnFormationFighter({
        x: laneX + offset * 24,
        y: -48 - i * 28,
        laneX,
        offsetX: offset * 24,
        speed: speed * 0.96,
        arcAmp: 34,
        arcPhase: -Math.PI * 0.5 + i * 0.22,
        pattern: "arc",
      });
    }
  } else {
    const side = Math.random() < 0.5 ? -1 : 1;
    const startX = side < 0 ? WIDTH * 0.18 : WIDTH * 0.82;
    const sweep = side * rand(86, 128);
    for (let i = 0; i < 8; i += 1) {
      const offset = i - 3.5;
      spawnFormationFighter({
        x: startX + offset * 18,
        y: -52 - i * 26,
        laneX: startX,
        offsetX: offset * 18,
        speed: speed * 1.02,
        arcAmp: 22,
        arcPhase: i * 0.26,
        sweep,
        pattern: "sweep",
      });
    }
  }

  return true;
}

function spawnMine(x, y, options = {}) {
  const maxHp = options.hp || 5;
  const r = options.r || 9;
  const targetX = clamp(options.targetX ?? x + rand(-70, 70), r + 12, WIDTH - r - 12);
  const targetY = clamp(options.targetY ?? rand(82, HEIGHT * 0.46), r + 42, HEIGHT * 0.5 - r - 8);
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = rand(260, 360);
  drones.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    targetX,
    targetY,
    r,
    type: "mine",
    hp: maxHp,
    maxHp,
    cooldown: 99,
    wobble: rand(0, Math.PI * 2),
    spin: rand(0, Math.PI * 2),
    spinSpeed: rand(1.1, 1.8) * (Math.random() < 0.5 ? -1 : 1),
    mineState: "incoming",
    armingTimer: 0,
    armingMax: 0.58,
    arrivalFlash: 0,
    flash: 0,
  });
}

function spawnMinefield() {
  if (activeEnemyCount("mine") >= MINE_MAX_ACTIVE) return false;
  const pattern = Math.floor(rand(0, 3));
  const laneX = clamp(player ? player.x : WIDTH / 2, WIDTH * 0.22, WIDTH * 0.78);

  if (pattern === 0) {
    for (let i = -2; i <= 2; i += 1) {
      spawnMine(laneX + i * 58, -58 - Math.abs(i) * 18, { targetX: laneX + i * 42, targetY: rand(96, HEIGHT * 0.38) });
    }
  } else if (pattern === 1) {
    for (let i = 0; i < 7; i += 1) {
      const angle = -Math.PI * 0.85 + i * (Math.PI * 0.7 / 6);
      spawnMine(laneX + Math.cos(angle) * 148, -52 + Math.sin(angle) * 52, {
        targetX: laneX + Math.cos(angle) * 118,
        targetY: rand(88, HEIGHT * 0.42),
      });
    }
  } else {
    const columns = [-1, 0, 1];
    for (let row = 0; row < 3; row += 1) {
      columns.forEach((column) => {
        if (row === 1 && column === 0) return;
        spawnMine(laneX + column * 76 + (row % 2 ? 24 : 0), -58 - row * 54, {
          targetX: laneX + column * 58 + (row % 2 ? 18 : 0),
          targetY: rand(92 + row * 24, HEIGHT * 0.48),
        });
      });
    }
  }

  addFloatingText(WIDTH / 2, 58, "MINEFIELD", "#ff5b74");
  return true;
}

function spawnUfo() {
  const side = Math.random() < 0.5 ? -34 : WIDTH + 34;
  const maxHp = 4 + Math.floor(wave / 5);
  const maxShield = 2.6 + wave * 0.12;
  const perch = randomUfoPerch();
  drones.push({
    x: side,
    y: perch.y + rand(-26, 26),
    vx: side < 0 ? rand(38, 54) : rand(-54, -38),
    targetX: perch.x,
    targetY: perch.y,
    r: 22,
    type: "ufo",
    hp: maxHp,
    maxHp,
    shield: maxShield,
    maxShield,
    shieldDelay: 1,
    cooldown: 0.28,
    phase: "arrive",
    perchCount: 0,
    spin: rand(0, Math.PI * 2),
    spinSpeed: rand(4.4, 6.2) * (Math.random() < 0.5 ? -1 : 1),
    wobble: rand(0, Math.PI * 2),
    flash: 0,
  });
}

function spawnCargoShip() {
  if (activeEnemyCount("cargo") >= 1) return false;
  const side = Math.random() < 0.5 ? -42 : WIDTH + 42;
  const maxHp = 7 + Math.floor(wave / 4);
  drones.push({
    x: side,
    y: rand(155, HEIGHT * 0.4),
    vx: side < 0 ? rand(28, 44) : rand(-44, -28),
    targetY: rand(155, HEIGHT * 0.42),
    r: 25,
    type: "cargo",
    hp: maxHp,
    maxHp,
    armor: 10,
    maxArmor: 10,
    cooldown: rand(0.7, 1.2),
    wobble: rand(0, Math.PI * 2),
    flash: 0,
    armorFlash: 0,
  });
  return true;
}

function spawnFighterJet() {
  if (activeEnemyCount("jet") >= 2) return false;
  const side = Math.random() < 0.5 ? -44 : WIDTH + 44;
  const targetX = side < 0 ? rand(WIDTH * 0.18, WIDTH * 0.4) : rand(WIDTH * 0.6, WIDTH * 0.82);
  const targetY = rand(110, HEIGHT * 0.28);
  const maxHp = 5 + Math.floor(wave / 4);
  const maxShield = 1.8 + wave * 0.08;
  drones.push({
    x: side,
    y: targetY + rand(-24, 24),
    vx: side < 0 ? rand(160, 210) : rand(-210, -160),
    targetX,
    targetY,
    r: 19,
    type: "jet",
    hp: maxHp,
    maxHp,
    shield: maxShield,
    maxShield,
    shieldDelay: 1,
    armor: 3,
    maxArmor: 3,
    armorFlash: 0,
    cooldown: 0,
    lockTimer: 1.5,
    lockMax: 1.5,
    lockX: null,
    lockY: null,
    fireInterval: 0,
    burstShots: 0,
    burstAngle: 0,
    wobble: rand(0, Math.PI * 2),
    flash: 0,
  });
  return true;
}

function spawnSplitter() {
  if (activeEnemyCount("splitter") >= SPLITTER_MAX_ACTIVE) return false;
  const side = Math.random() < 0.5 ? -30 : WIDTH + 30;
  const stats = splitterStats("L");
  const maxHp = stats.hp + Math.floor(wave / 6);
  const maxShield = 3.8 + wave * 0.14;
  drones.push({
    x: side,
    y: rand(118, HEIGHT * 0.32),
    vx: side < 0 ? rand(145, 185) : rand(-185, -145),
    targetX: clamp(WIDTH / 2 + rand(-70, 70), 96, WIDTH - 96),
    targetY: rand(160, HEIGHT * 0.42),
    r: stats.radius,
    type: "splitter",
    splitterTier: "L",
    hp: maxHp,
    maxHp,
    shield: maxShield,
    maxShield,
    shieldDelay: 1,
    cooldown: rand(stats.cooldown[0], stats.cooldown[1]),
    wobble: rand(0, Math.PI * 2),
    flash: 0,
  });
  return true;
}

function spawnSplitterChildren(drone) {
  const parentStats = splitterStats(drone.splitterTier || "L");
  if (!parentStats.next) return;
  const childStats = splitterStats(parentStats.next);
  for (let i = 0; i < SPLITTER_CHILDREN_PER_DEATH; i += 1) {
    const angle = Math.PI / 2 + (i - 1) * 0.72 + rand(-0.08, 0.08);
    const speed = childStats.speed + rand(-12, 18);
    const maxHp = childStats.hp + (childStats.tier === "M" ? Math.floor(wave / 8) : 0);
    drones.push({
      x: clamp(drone.x + Math.cos(angle) * (drone.r * 0.48), 34, WIDTH - 34),
      y: clamp(drone.y + Math.sin(angle) * (drone.r * 0.48), 72, HEIGHT - 44),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.38,
      targetY: drone.y + rand(95, 165),
      r: childStats.radius,
      type: "splitter",
      splitterTier: childStats.tier,
      hp: maxHp,
      maxHp,
      cooldown: rand(childStats.cooldown[0], childStats.cooldown[1]),
      splitBirth: 0.42,
      wobble: rand(0, Math.PI * 2),
      flash: 0,
    });
    addRingBurst(drone.x, drone.y, childStats.color, 10 + i * 2, 6 + i * 3, 230 + i * 30, 2.4);
  }
  addFloatingText(drone.x, drone.y - drone.r - 10, `${parentStats.tier}->${childStats.tier} SPLIT`, "#ff5b74");
  addRingBurst(drone.x, drone.y, "#ff5b74", 26, drone.r * 0.55, 340, 4);
  addRingBurst(drone.x, drone.y, "#edf7f5", 12, 2, 210, 2.6);
}

function currentSpawnDelay() {
  return Math.max(0.48, 1.08 - wave * 0.062);
}

function startBreather(duration = 2.4) {
  breatherTimer = Math.max(breatherTimer || 0, duration);
  spawnTimer = Math.max(spawnTimer || 0, Math.min(duration, 1.1));
}

function scheduleThreat(type, delay, label, color, themeKey = currentWaveTheme().key) {
  pendingThreat = { type, timer: delay, themeKey };
  spawnTimer = Math.max(spawnTimer || 0, delay + 0.2);
  if (label) {
    addFloatingText(WIDTH / 2, 58, label, color);
  }
}

function executePendingThreat() {
  if (!pendingThreat) return false;
  const threat = pendingThreat;
  pendingThreat = null;
  if (threat.type === "formation") {
    const spawned = spawnFighterFormation(threat.themeKey);
    if (spawned) startBreather(2.4);
    return spawned;
  }
  if (threat.type === "minefield") {
    const spawned = spawnMinefield();
    if (spawned) startBreather(2.8);
    return spawned;
  }
  if (threat.type === "planet") {
    spawnMothership();
    startBreather(2.2);
    return true;
  }
  if (threat.type === "boss") {
    spawnFirstBoss();
    return true;
  }
  if (threat.type === "jet") return spawnFighterJet();
  if (threat.type === "splitter") {
    const spawned = spawnSplitter();
    if (spawned) startBreather(2.1);
    return spawned;
  }
  if (threat.type === "cargo") return spawnCargoShip();
  if (threat.type === "ufo") return spawnUfo();
  return false;
}

function randomPowerupType() {
  const roll = Math.random();
  if (roll < 0.28) return "shotgun";
  if (roll < 0.54) return "laser";
  if (roll < 0.78) return "missiles";
  return "machinegun";
}

function spawnPowerup(x, y, type = randomPowerupType()) {
  const safe = keepLootInPlay(x, y, rand(-58, 58), rand(-24, 58), 44);
  const info = powerupInfo[type] || powerupInfo.shotgun;
  addLootReleaseFlash(safe.x, safe.y, info.color, true);
  powerups.push({
    x: safe.x,
    y: safe.y,
    r: 11,
    type,
    vx: safe.vx,
    vy: safe.vy,
    drift: rand(-22, 22),
    pulse: 0,
    magnetWeight: 0.065,
    life: rand(9.4, 12.2),
  });
}

function scatterInventoryPowerup(type, index = 0, total = 1) {
  if (!player) return;
  const info = powerupInfo[type] || powerupInfo.shotgun;
  const spread = total > 1 ? (index - (total - 1) / 2) * 0.58 : 0;
  const angle = -Math.PI / 2 + spread + rand(-0.28, 0.28);
  const speed = rand(190, 260);
  const x = clamp(player.x + Math.cos(angle) * 18, 26, WIDTH - 26);
  const y = clamp(player.y + Math.sin(angle) * 18, 28, HEIGHT - 28);
  addLootReleaseFlash(x, y, info.color, true);
  powerups.push({
    x,
    y,
    r: 11,
    type,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 40,
    drift: rand(-34, 34),
    pulse: 0,
    magnetWeight: 0.065,
    collectDelay: 0.85,
    life: rand(8.6, 10.4),
  });
}

function spawnDebugPowerup(type) {
  if (!player) return;
  const x = clamp(player.x + rand(-28, 28), 28, WIDTH - 28);
  const y = clamp(player.y - 54 + rand(-16, 16), 28, HEIGHT - 28);
  spawnPowerup(x, y, type);
  if (debugVisible) {
    addFloatingText(x, y - 20, powerupInfo[type].letter, powerupInfo[type].color);
  }
}

function nearestDrone(x, y) {
  let best = null;
  let bestDist = Infinity;
  let planetFallback = null;
  drones.forEach((drone) => {
    if (drone.exiting || !isDroneVulnerable(drone)) return;
    if (drone.type === "mothership") {
      planetFallback = drone;
      return;
    }
    const d = dist2({ x, y }, drone);
    if (d < bestDist) {
      best = drone;
      bestDist = d;
    }
  });
  if (boss) {
    boss.parts.forEach((part) => {
      if (!part.alive) return;
      const target = { x: boss.x + part.offsetX, y: boss.y + part.offsetY };
      const d = dist2({ x, y }, target);
      if (d < bestDist) {
        best = boss;
        bestDist = d;
      }
    });
    const d = dist2({ x, y }, boss);
    if (d < bestDist) {
      best = boss;
      bestDist = d;
    }
  }
  return best || planetFallback;
}

function spawnMissile(offset, source = player, options = {}) {
  audio.missile();
  const target = nearestDrone(source.x, source.y);
  missiles.push({
    x: source.x + offset,
    y: source.y - 10,
    vx: options.vx ?? offset * 5,
    vy: options.vy ?? -280,
    r: options.r || 6,
    power: options.power || 2.7,
    aoe: hasSOverdrive() ? S_RANK_MISSILE_AOE : 0,
    kind: "missile",
    target,
    life: options.life || 2.6,
    turn: options.turn || 8,
    retargetTimer: options.retargetTimer ?? 0.18,
    retargetInterval: options.retargetInterval ?? 0.18,
    trailTimer: rand(0, MISSILE_TRAIL_INTERVAL),
  });
}

function callMissileSupport() {
  const fromLeft = Math.random() < 0.5;
  const startX = fromLeft ? -64 : WIDTH + 64;
  const startY = HEIGHT + 48;
  const vx = fromLeft ? 270 : -270;
  const vy = -420;
  supportShips = [];
  for (let i = 0; i < 5; i += 1) {
    const row = i % 2;
    const column = i - 2;
    const x = startX - column * (fromLeft ? 26 : -26);
    const y = startY + Math.abs(column) * 18 + row * 18;
    supportShips.push({
      x,
      y,
      vx,
      vy,
      offset: column,
      fireTimer: 0.12 + i * 0.08,
      trailTimer: rand(0, SUPPORT_TRAIL_INTERVAL),
      life: 2.4,
      maxLife: 2.4,
      wobble: rand(0, Math.PI * 2),
      color: "#8a7dff",
    });
    supportPathLanes.push({
      x1: x - vx * 0.2,
      y1: y - vy * 0.2,
      x2: x + vx * 2.45,
      y2: y + vy * 2.45,
      color: SUPPORT_PATH_COLORS[i],
      life: 3.05,
      maxLife: 3.05,
      width: 1.4 + (i === 2 ? 0.35 : 0),
      phase: rand(0, Math.PI * 2),
    });
  }
  addFloatingText(WIDTH / 2, HEIGHT - 120, "MISSILE SUPPORT", "#8a7dff");
  addRingBurst(WIDTH / 2, HEIGHT - 90, "#8a7dff", 26, 10, 280, 3.2);
  shake = Math.max(shake, 0.14);
}

function fireShot(x, y, angle, speed, radius, power, color, kind = "normal", life) {
  const shot = {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    power,
    color,
    kind,
  };
  if (typeof life === "number") shot.life = life;
  playerShots.push(shot);
}

function fireMachineGunUltimateShot(offset, spread = 0) {
  const originX = player.x + offset;
  const originY = player.y - 8;
  const angle = -Math.PI / 2 + spread;
  fireShot(originX, originY, angle, 880, 5, 0.05, "#ff5b74", "sweeper", 0.26);
  const shot = playerShots[playerShots.length - 1];
  shot.bounces = 3;
  shot.bounceRange = 190;
  addMuzzleBlast(originX, originY, { angle, color: "#ff5b74", coreColor: "#ffd166", type: "burst", size: 0.78, life: 0.08 });
}

function fireDefaultShot() {
  const critical = hasSOverdrive() && Math.random() < 0.15;
  const color = critical ? "#ffd166" : "#6df6d5";
  const power = critical ? 2.4 : 1.2;
  fireShot(player.x, player.y - 16, -Math.PI / 2, critical ? 660 : 620, critical ? 6 : 5, power, color, critical ? "critical" : "normal");
  addMuzzleBlast(player.x, player.y - 16, { angle: -Math.PI / 2, color, coreColor: "#edf7f5", type: "burst", size: critical ? 1.15 : 0.95, life: critical ? 0.13 : 0.105 });
  ejectShell(player.x + rand(-4, 4), player.y + 1, {
    side: Math.random() < 0.5 ? -1 : 1,
    color,
    size: critical ? 5.2 : 4.4,
    speed: critical ? 220 : 170,
    minSpeed: critical ? 96 : 72,
    life: critical ? 0.82 : 0.68,
    gravity: critical ? 520 : 450,
  });
  if (critical) {
    addParticles(player.x, player.y - 18, "#ffd166", 8, 170);
  }
}

function spawnRadialBlast() {
  audio.ultimate("burst");
  for (let waveIndex = 0; waveIndex < 3; waveIndex += 1) {
    const count = 30;
    const speed = 400 + waveIndex * 110;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + waveIndex * 0.12;
      fireShot(player.x, player.y, angle, speed, 5, 1.45, "#6df6d5", "ultimate", 0.92 + waveIndex * 0.18);
    }
  }
  addParticles(player.x, player.y, "#6df6d5", 48, 310);
  shake = Math.max(shake, 0.16);
}

function spawnSixfoldBlast() {
  audio.ultimate("burst");
  for (let waveIndex = 0; waveIndex < 6; waveIndex += 1) {
    const count = 34;
    const speed = 430 + waveIndex * 88;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + waveIndex * 0.18;
      fireShot(player.x, player.y, angle, speed, 5, 1.65, "#6df6d5", "ultimate", 1.15 + waveIndex * 0.13);
    }
  }
  addParticles(player.x, player.y, "#6df6d5", 86, 380);
  shake = Math.max(shake, 0.24);
}

function triggerMiniNuke() {
  audio.ultimate("nuke");
  const damage = 11;
  if (boss) {
    bossTargets().forEach((target) => {
      damageBossTarget(target, damage);
      addParticles(target.x, target.y, "#ffd166", 12, 220);
    });
  }
  drones.forEach((drone) => {
    if (drone.hp <= 0) return;
    if (drone.type === "mothership") {
      triggerMotherlandEvacuation(drone, player.x, player.y);
      return;
    }
    if (!isDroneVulnerable(drone)) return;
    damageDrone(drone, damage, "ultimate", projectileImpactAngle(player, drone));
    drone.flash = 0.2;
    addParticles(drone.x, drone.y, "#ffd166", 16, 220);
    if (drone.hp <= 0) {
      destroyDrone(drone, false);
    }
  });
  nukeEffects.push({
    x: player.x,
    y: player.y,
    life: 0.95,
    maxLife: 0.95,
  });
  addParticles(player.x, player.y, "#ffd166", 130, 520);
  addParticles(player.x, player.y, "#edf7f5", 60, 440);
  shake = Math.max(shake, 0.46);
  hitStop = Math.max(hitStop, 0.13);
}

function triggerBreachBlast() {
  audio.ultimate("nuke");
  for (let waveIndex = 0; waveIndex < 3; waveIndex += 1) {
    const count = 17 + waveIndex * 4;
    const spread = 0.9 + waveIndex * 0.1;
    const speed = 560 + waveIndex * 70;
    for (let i = 0; i < count; i += 1) {
      const ratio = count === 1 ? 0 : i / (count - 1) - 0.5;
      const angle = -Math.PI / 2 + ratio * spread + rand(-0.018, 0.018);
      const centerWeight = 1 - Math.min(1, Math.abs(ratio) * 2);
      const power = 2.15 + centerWeight * 1.05;
      const life = 0.48 + waveIndex * 0.07 - Math.abs(ratio) * 0.08;
      fireShot(player.x + rand(-4, 4), player.y - 18, angle, speed - Math.abs(ratio) * 90, 8, power, centerWeight > 0.55 ? "#edf7f5" : "#ffd166", "shotgun", life);
    }
  }
  for (let i = 0; i < 6; i += 1) {
    ejectShell(player.x + rand(-10, 10), player.y - 3 + rand(-3, 5), {
      side: i % 2 === 0 ? -1 : 1,
      color: "#ffd166",
      size: rand(6, 8),
      speed: 190,
      minSpeed: 90,
      life: 0.9,
      gravity: 520,
    });
  }
  addMuzzleBlast(player.x, player.y - 18, { angle: -Math.PI / 2, color: "#ffd166", coreColor: "#edf7f5", type: "cone", size: 2.25, life: 0.28 });
  addParticles(player.x, player.y - 20, "#ffd166", 58, 340);
  addParticles(player.x, player.y - 20, "#edf7f5", 22, 260);
  shake = Math.max(shake, 0.28);
  hitStop = Math.max(hitStop, 0.08);
}

function triggerRapidMissiles() {
  audio.ultimate("missiles");
  if (hasSOverdrive()) {
    callMissileSupport();
    addParticles(player.x, player.y, "#8a7dff", 40, 280);
    return;
  }
  player.rapidMissileTimer = 0.95;
  missileTimer = 0;
  addParticles(player.x, player.y, "#8a7dff", 34, 260);
  shake = Math.max(shake, 0.12);
}

function triggerBulletSweep() {
  audio.ultimate("missiles");
  player.lockdownTimer = 2;
  machineGunTimer = 0;
  addParticles(player.x, player.y, "#ff5b74", 52, 300);
  shake = Math.max(shake, 0.16);
}

function triggerLanceSweep() {
  audio.ultimate("burst");
  const sRank = hasSOverdrive();
  player.laserUltimateMode = sRank ? "prism" : "skyline";
  player.laserUltimateTimer = 3;
  player.laserUltimateMax = player.laserUltimateTimer;
  laserTickTimer = 0.24;
  addParticles(player.x, player.y - 24, "#2fd46f", 42, 260);
  addRingBurst(player.x, player.y - 20, sRank ? "#edf7f5" : "#8cff9a", sRank ? 36 : 30, 7, sRank ? 360 : 310, 3.2);
  shake = Math.max(shake, 0.16);
}

const ultimateInfo = {
  burst: { label: "3-FOLD SHOT", color: "#6df6d5", sound: "burst" },
  sixfold: { label: "6-FOLD SHOT", color: "#6df6d5", sound: "burst" },
  breach: { label: "BREACH BLAST", color: "#ffd166", sound: "nuke" },
  nuke: { label: "MINI NUKE", color: "#ffd166", sound: "nuke" },
  laser: { label: "SKYLINE LANCE", color: "#2fd46f", sound: "burst" },
  missiles: { label: "MISSILE STORM", color: "#8a7dff", sound: "missiles" },
  lockdown: { label: "RICOCHET SWEEP", color: "#ff5b74", sound: "lockdown" },
};

function ultimateDisplayInfo(type) {
  const info = ultimateInfo[type] || ultimateInfo.burst;
  if (type === "laser" && hasSOverdrive()) {
    return { ...info, label: "PRISM CROSS" };
  }
  return info;
}

function activeWeaponInSlot(slot) {
  return slot === "main" ? player.mainWeapon !== "normal" : player.subWeapon !== "none";
}

function activatePowerup(type, fromQueue = false) {
  const info = powerupInfo[type] || powerupInfo.shotgun;
  if (info.slot === "sub") {
    player.subWeapon = type;
    player.subTimer = 10;
    if (type === "missiles") missileTimer = 0.2;
    if (type === "machinegun") machineGunTimer = 0.05;
  } else {
    player.mainWeapon = type === "laser" ? "laser" : "shotgun";
    player.mainTimer = 8;
    if (type === "laser") {
      player.laserWarmup = 0.38;
      laserTickTimer = 0.16;
    }
  }
  const label = type === "machinegun" ? "MACHINE GUN" : type.toUpperCase();
  addFloatingText(player.x, player.y - (fromQueue ? 44 : 28), fromQueue ? `READY: ${label}` : label, info.color);
  audio.pickup(type);
}

function activateQueuedPowerup(slot) {
  if (!player.inventory || activeWeaponInSlot(slot)) return false;
  const index = player.inventory.findIndex((type) => (powerupInfo[type] || powerupInfo.shotgun).slot === slot);
  if (index < 0) return false;
  const [nextType] = player.inventory.splice(index, 1);
  activatePowerup(nextType, true);
  return true;
}

function collectPowerup(type) {
  const info = powerupInfo[type] || powerupInfo.shotgun;
  player.inventory ||= [];
  if (activeWeaponInSlot(info.slot)) {
    if (player.inventory.length < inventorySlotCount()) {
      player.inventory.push(type);
      const label = type === "machinegun" ? "MACHINE GUN" : type.toUpperCase();
      addFloatingText(player.x, player.y - 28, label, info.color, { suffix: "STORED", suffixColor: "rgba(237, 247, 245, 0.82)" });
      audio.pickup(type);
      return true;
    }
    const replaced = player.inventory.shift();
    player.inventory.push(type);
    const replacedInfo = powerupInfo[replaced] || powerupInfo.shotgun;
    addFloatingText(player.x, player.y - 28, `${replacedInfo.letter}->${info.letter}`, info.color);
    audio.pickup(type);
    return true;
  }
  activatePowerup(type);
  return true;
}

function queuedUltimateTypes() {
  const mainWeapon = effectiveMainWeapon();
  const types = [];
  if (mainWeapon === "shotgun") types.push(hasSOverdrive() ? "nuke" : "breach");
  else if (mainWeapon === "laser") types.push("laser");
  else types.push(hasSOverdrive() ? "sixfold" : "burst");
  if (player.subWeapon === "missiles") types.push("missiles");
  if (player.subWeapon === "machinegun") types.push("lockdown");
  return types;
}

function hasUltimateTargets() {
  if (boss && bossTargets().some((target) => target.kind === "torso" || (target.part && target.part.alive))) return true;
  return drones.some((drone) => drone.type !== "mothership" && !drone.exiting && drone.hp > 0 && isDroneVulnerable(drone));
}

function spawnUltimatePayoffWave() {
  if (boss || hasUltimateTargets()) return false;
  const laneX = clamp(player ? player.x : WIDTH / 2, WIDTH * 0.24, WIDTH * 0.76);
  for (let i = 0; i < 5; i += 1) {
    const offset = i - 2;
    spawnFormationFighter({
      x: laneX + offset * 28,
      y: -42 - Math.abs(offset) * 18,
      laneX,
      offsetX: offset * 28,
      speed: 104,
      arcAmp: 12,
      arcPhase: offset * 0.18,
      pattern: "chevron",
      targetY: 120 + Math.abs(offset) * 8,
    });
  }
  formationTimer = Math.max(formationTimer || 0, 2.6);
  spawnTimer = Math.max(spawnTimer || 0, 1.1);
  addFloatingText(WIDTH / 2, 72, "TARGETS INBOUND", "#ffd166");
  return true;
}

function fireQueuedUltimate(type) {
  if (type === "nuke") {
    triggerMiniNuke();
  } else if (type === "breach") {
    triggerBreachBlast();
  } else if (type === "sixfold") {
    spawnSixfoldBlast();
  } else if (type === "missiles") {
    triggerRapidMissiles();
  } else if (type === "lockdown") {
    triggerBulletSweep();
  } else if (type === "laser") {
    triggerLanceSweep();
  } else {
    spawnRadialBlast();
  }
}

function beginUltimateCue() {
  const types = queuedUltimateTypes();
  const info = ultimateDisplayInfo(types[types.length - 1]);
  const emptyScreen = !hasUltimateTargets();
  const holdForTargets = emptyScreen && spawnUltimatePayoffWave();
  player.charge = minimumEnergy();
  const healed = healPlayer(1);
  ultimateCue = {
    x: player.x,
    y: player.y,
    types,
    label: types.map((type) => ultimateDisplayInfo(type).label).join(" + "),
    color: info.color,
    timer: holdForTargets ? 0.9 : ULTIMATE_CUE_DURATION,
    life: (holdForTargets ? 1.55 : ULTIMATE_CUE_DURATION + 0.8),
    maxLife: (holdForTargets ? 1.55 : ULTIMATE_CUE_DURATION + 0.8),
    holdForTargets,
    holdTimer: holdForTargets ? 1.1 : 0,
    fired: false,
  };
  audio.ultimateCharge(info.sound);
  addFloatingText(player.x, player.y - 42, ultimateCue.label, info.color);
  addRingBurst(player.x, player.y, info.color, 20, 8, 210, 3);
  shake = Math.max(shake, 0.08);
}

function triggerChargeRelease() {
  if (!player || player.charge < MAX_ENERGY || ultimateCue) return;
  beginUltimateCue();
}

function startCircleUltimate() {
  if (!player || state !== "playing" || circleUltimate) return;
  circleUltimate = {
    timer: null,
    maxTimer: 3,
    points: [],
    drawing: false,
    resolved: false,
    resultText: "",
    resultLife: 0,
    flash: 0,
  };
  pointer.rightDown = false;
  magnetWasDown = false;
  magnetHoldTime = 0;
  player.invuln = Math.max(player.invuln, 3.25);
  hitStop = 0;
  shake = Math.max(shake, 0.18);
  addFloatingText(player.x, player.y - 48, "SEAL OF JUDGEMENT", "#edf7f5");
  audio.circleUltimateStart();
}

function polygonArea(points) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += a.x * b.y - b.x * a.y;
  }
  return Math.abs(area) * 0.5;
}

function pointInPolygon(point, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const a = points[i];
    const b = points[j];
    const intersects = a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 0.0001) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function applyCircleDamageToDrone(drone, amount = 200) {
  triggerDroneImpact(drone, projectileImpactAngle(player, drone), 1.7);
  let remaining = amount;
  if (remaining > 0 && drone.armor > 0) {
    const stripped = Math.min(drone.armor, Math.floor(remaining));
    drone.armor -= stripped;
    drone.armorFlash = 0.35;
    remaining -= stripped;
  }
  if (remaining > 0 && drone.shield > 0) {
    const absorbed = Math.min(drone.shield, remaining);
    drone.shield -= absorbed;
    drone.shieldDelay = 1;
    drone.shieldFlash = 0.35;
    remaining -= absorbed;
  }
  if (remaining > 0) {
    drone.hp -= remaining;
    drone.flash = 0.32;
  }
  addFloatingText(drone.x, drone.y - 28, "200", "#edf7f5");
  addRingBurst(drone.x, drone.y, "#edf7f5", 16, 7, 260, 3);
  addParticles(drone.x, drone.y, "#6df6d5", 20, 300);
  if (drone.hp <= 0) {
    destroyDrone(drone);
  }
}

function applyCircleDamageToBossTarget(target, amount = 200) {
  if (!boss || !target) return;
  if (target.kind === "part") {
    damageBossTarget(target, amount);
    addFloatingText(target.x, target.y - 24, "200", "#edf7f5");
    addRingBurst(target.x, target.y, "#edf7f5", 18, 7, 280, 3);
    return;
  }
  let remaining = amount;
  if (boss.armor > 0) {
    const stripped = Math.min(boss.armor, Math.floor(remaining));
    boss.armor -= stripped;
    boss.armorFlash = 0.35;
    remaining -= stripped;
  }
  if (remaining > 0) {
    damageBossTarget(target, remaining);
  } else {
    boss.flash = 0.14;
  }
  addFloatingText(target.x, target.y - 30, "200", "#edf7f5");
  addRingBurst(target.x, target.y, "#edf7f5", 22, 10, 300, 3.5);
}

function resolveCircleUltimate() {
  if (!circleUltimate || circleUltimate.resolved) return;
  const points = circleUltimate.points;
  if (points.length < 2) {
    circleUltimate.resolved = true;
    circleUltimate.resultText = "NO JUDGEMENT";
    circleUltimate.resultLife = 0.55;
    circleUltimate.flash = 0.08;
    addFloatingText(player.x, player.y - 48, "NO JUDGEMENT", "#ffd166");
    audio.circleUltimateRelease(false);
    return;
  }
  const start = points[0];
  const end = points[points.length - 1];
  const closed = points.length >= 16 && Math.sqrt(dist2(start, end)) < 72;
  const area = polygonArea(points);
  if (!closed || area < 2200) {
    circleUltimate.resolved = true;
    circleUltimate.resultText = "JUDGEMENT BROKEN";
    circleUltimate.resultLife = 0.55;
    circleUltimate.flash = 0.1;
    addFloatingText(player.x, player.y - 48, "JUDGEMENT BROKEN", "#ff5b74");
    audio.circleUltimateRelease(false);
    return;
  }

  let hits = 0;
  drones.forEach((drone) => {
    if (drone.hp <= 0) return;
    if (pointInPolygon(drone, points)) {
      if (drone.type === "mothership") {
        triggerMotherlandEvacuation(drone, drone.x, drone.y);
        return;
      }
      if (!isDroneVulnerable(drone)) return;
      applyCircleDamageToDrone(drone, 200);
      hits += 1;
    }
  });
  bossTargets().forEach((target) => {
    if (pointInPolygon(target, points)) {
      applyCircleDamageToBossTarget(target, 200);
      hits += 1;
    }
  });
  let erasedBullets = 0;
  bullets = bullets.filter((bullet) => {
    if (!pointInPolygon(bullet, points)) return true;
    erasedBullets += 1;
    const color = bullet.laser ? "#ff5b2e" : bullet.color || "#ff8c42";
    addFloatingText(bullet.x, bullet.y - 10, "BANISHED", "#edf7f5");
    addRingBurst(bullet.x, bullet.y, color, bullet.laser ? 14 : 9, bullet.r + 3, bullet.laser ? 210 : 170, bullet.laser ? 3.2 : 2.5);
    addParticles(bullet.x, bullet.y, color, bullet.laser ? 18 : 10, bullet.laser ? 250 : 180);
    addParticles(bullet.x, bullet.y, "#edf7f5", bullet.laser ? 8 : 5, 140);
    return false;
  });
  drones = drones.filter((drone) => drone.hp > 0);
  circleUltimate.resolved = true;
  circleUltimate.resultText = hits || erasedBullets ? `ENEMY JUDGED ${hits} / BANISHED ${erasedBullets}` : "EMPTY JUDGEMENT";
  circleUltimate.resultLife = 0.24;
  circleUltimate.flash = 0.14;
  shake = Math.max(shake, hits || erasedBullets ? 0.58 : 0.24);
  hitStop = Math.max(hitStop, 0.18);
  audio.circleUltimateRelease(hits > 0 || erasedBullets > 0);
  addFloatingText(player.x, player.y - 56, circleUltimate.resultText, hits || erasedBullets ? "#edf7f5" : "#ffd166");
}

function failCircleUltimate(reason = "JUDGEMENT BROKEN") {
  if (!circleUltimate || circleUltimate.resolved) return;
  circleUltimate.resolved = true;
  circleUltimate.resultText = reason;
  circleUltimate.resultLife = 0.55;
  circleUltimate.flash = 0.1;
  addFloatingText(player.x, player.y - 48, reason, "#ff5b74");
  audio.circleUltimateRelease(false);
}

function updateCircleUltimate(dt) {
  if (!circleUltimate) return;
  if (!circleUltimate.resolved) {
    player.invuln = Math.max(player.invuln, 0.12);
    if (pointer.leftDown) {
      const next = { x: pointer.active ? pointer.x : player.x, y: pointer.active ? pointer.y : player.y };
      const last = circleUltimate.points[circleUltimate.points.length - 1];
      if (!circleUltimate.drawing) {
        circleUltimate.timer = circleUltimate.maxTimer;
      }
      circleUltimate.drawing = true;
      circleUltimate.timer = Math.max(0, circleUltimate.timer - dt);
      if (!last || Math.sqrt(dist2(next, last)) > 5) {
        circleUltimate.points.push(next);
      }
      if (circleUltimate.points.length >= 16) {
        const start = circleUltimate.points[0];
        const closed = Math.sqrt(dist2(start, next)) < 72;
        if (closed && polygonArea(circleUltimate.points) >= 2200) {
          resolveCircleUltimate();
          return;
        }
      }
    } else if (circleUltimate.drawing) {
      failCircleUltimate("JUDGEMENT BROKEN");
      return;
    } else if (circleUltimate.points.length === 0) {
      circleUltimate.drawing = false;
    }
    if (circleUltimate.drawing && circleUltimate.timer <= 0) {
      resolveCircleUltimate();
    }
    return;
  }
  circleUltimate.resultLife -= dt;
  circleUltimate.flash = Math.max(0, circleUltimate.flash - dt);
  if (circleUltimate.resultLife <= 0) {
    circleUltimate = null;
  }
}

function updateUltimateCue(dt) {
  if (!ultimateCue) return;
  ultimateCue.x += (player.x - ultimateCue.x) * 0.32;
  ultimateCue.y += (player.y - ultimateCue.y) * 0.32;
  ultimateCue.timer -= dt;
  ultimateCue.life -= dt;
  if (ultimateCue.holdForTargets && !ultimateCue.fired) {
    ultimateCue.holdTimer = Math.max(0, (ultimateCue.holdTimer || 0) - dt);
    if (!hasUltimateTargets() && ultimateCue.holdTimer > 0) {
      ultimateCue.timer = Math.max(ultimateCue.timer, 0.08);
      ultimateCue.life = Math.max(ultimateCue.life, ultimateCue.timer + 0.55);
    } else {
      ultimateCue.timer = Math.min(ultimateCue.timer, 0);
    }
  }
  if (!ultimateCue.fired && ultimateCue.timer <= 0) {
    ultimateCue.fired = true;
    ultimateCue.types.forEach((type) => fireQueuedUltimate(type));
    hitStop = Math.max(hitStop, 0.055);
  }
  if (ultimateCue.life <= 0 && ultimateCue.fired) {
    ultimateCue = null;
  }
}

function addCharge(amount) {
  player.charge = clamp(Math.max(player.charge, minimumEnergy()) + amount, minimumEnergy(), MAX_ENERGY);
}

function activeMothership() {
  return drones.find((drone) => drone.type === "mothership" && drone.hp > 0) || null;
}

function activeEnemyCount(type) {
  return drones.filter((drone) => drone.type === type && drone.hp > 0).length;
}

function grantShield(drone, strength = 3) {
  if (!drone || drone.type === "mothership" || drone.hp <= 0) return;
  drone.maxShield = Math.max(drone.maxShield || 0, strength);
  drone.shield = Math.max(drone.shield || 0, drone.maxShield);
  drone.shieldDelay = 1;
  drone.shieldFlash = 0.28;
}

function addShieldTransfer(from, to) {
  shieldTransfers.push({
    fromX: from.x,
    fromY: from.y + 8,
    to,
    life: 0.45,
    maxLife: 0.45,
  });
}

function damageDrone(drone, amount, kind = "normal", impactAngle = -Math.PI / 2) {
    if (drone.type === "mothership" || drone.invulnerable) {
      triggerMotherlandEvacuation(drone, drone.x, drone.y);
      return { shieldHit: false, armorHit: false, hpHit: false, invulnerable: true };
    }
  if (drone.type === "mine" && drone.mineState !== "armed") {
    drone.flash = Math.max(drone.flash || 0, 0.08);
    return { shieldHit: false, armorHit: false, hpHit: false, invulnerable: true };
  }
  if (!isDroneVulnerable(drone)) {
    return { shieldHit: false, armorHit: false, hpHit: false, invulnerable: true };
  }
  let remaining = amount;
  let shieldHit = false;
  let armorHit = false;
  let hit = false;
  const armorBefore = drone.armor || 0;
  if (remaining > 0 && drone.armor > 0) {
    drone.armor = Math.max(0, drone.armor - 1);
    drone.armorFlash = 0.18;
    armorHit = true;
    hit = true;
    remaining = 0;
  }
  if (remaining > 0 && drone.shield > 0) {
    const shieldDamageMultiplier = kind === "machinegun" || kind === "lockdown" || kind === "sweeper" ? 0.35 : 1;
    const effectiveShieldDamage = remaining * shieldDamageMultiplier;
    const absorbed = Math.min(drone.shield, effectiveShieldDamage);
    const rawConsumed = shieldDamageMultiplier > 0 ? absorbed / shieldDamageMultiplier : remaining;
    drone.shield -= absorbed;
    remaining -= rawConsumed;
    drone.shieldDelay = 1;
    drone.shieldFlash = 0.18;
    shieldHit = true;
    hit = true;
  }
  if (remaining > 0) {
    drone.hp -= remaining;
    drone.flash = 0.13;
    hit = true;
  }
  if (hit) {
    if (drone.type === "cargo" && armorBefore > 0 && (drone.armor || 0) <= 0 && !drone.fleeing) {
      drone.fleeing = true;
      drone.fleeFlash = 0.75;
      drone.escapeDir = (drone.vx || 0) < 0 ? -1 : 1;
      drone.vx = drone.escapeDir * 178;
      drone.vy = Math.max(drone.vy || 0, 18);
      drone.targetY = drone.y;
      addFloatingText(drone.x, drone.y - 30, "CARGO FLEEING", "#ffd166");
      addRingBurst(drone.x, drone.y, "#ffd166", 18, 10, 230, 2.8);
    }
    const strength = kind === "shotgun" || kind === "mine" || kind === "ultimate" ? 1.55 : kind === "missile" ? 1.25 : kind === "machinegun" || kind === "lockdown" || kind === "sweeper" ? 0.55 : 1;
    triggerDroneImpact(drone, impactAngle, strength);
  }
  return { shieldHit, armorHit, hpHit: remaining > 0 };
}

function impactLayer(result) {
  if (result.shieldHit && !result.hpHit && !result.armorHit) return "shield";
  if (result.armorHit) return "armor";
  return "health";
}

function requestHitStop(kind) {
  if (kind === "missile" || kind === "machinegun" || kind === "lockdown" || kind === "sweeper" || kind === "ultimate") return;
  if (hitStopCooldown > 0) return;
  const duration = kind === "shotgun" ? 0.052 : 0.026;
  hitStop = Math.max(hitStop, duration);
  hitStopCooldown = kind === "shotgun" ? 0.13 : 0.085;
}

function suppressDrone(drone, duration = 0.85) {
  if (!drone || drone.hp <= 0) return;
  drone.suppressed = Math.max(drone.suppressed || 0, duration);
  drone.suppressionFlash = 0.14;
  if (hasSOverdrive() && (player.subWeapon === "machinegun" || player.lockdownTimer > 0)) {
    drone.slowTimer = Math.max(drone.slowTimer || 0, duration * 0.72);
  }
  if (drone.type === "jet" && drone.burstShots <= 0) {
    drone.lockTimer = Math.min(drone.lockMax || 3, drone.lockTimer + duration * 0.75);
    drone.lockX = null;
    drone.lockY = null;
    addFloatingText(drone.x, drone.y - 30, "LOCK JAMMED", "#ff5b74");
  }
}

function destroyDrone(drone, grantCharge = true) {
  audio.enemyDeath(drone.type);
  requestKillImpact(drone.type);
  recordKill(drone.type);
  registerStreakKill(drone.type, drone.x, drone.y);
  const reward = drone.type === "mothership" ? 1600 : drone.type === "cargo" ? 520 : drone.type === "jet" ? 420 : drone.type === "splitter" ? splitterStats(drone.splitterTier || "L").reward : drone.type === "mine" ? 120 : 250;
  const toughness = Math.max(0, drone.maxHp - 3);
  const energyChance = clamp(0.22 + toughness * 0.04 + (drone.type === "ufo" ? 0.06 : drone.type === "jet" ? 0.045 : 0), 0.2, 0.58);
  const powerupChance = clamp(0.12 + toughness * 0.018 + (drone.type === "ufo" ? 0.04 : drone.type === "jet" ? 0.03 : 0), 0.12, 0.27);
  awardScore(reward, drone.x, drone.y - 18, "#ffd166");
  if (drone.type === "splitter") {
    spawnSplitterChildren(drone);
  }
  if (drone.type === "mine" || (drone.type === "splitter" && (drone.splitterTier || "L") !== "L")) {
    // Cleanup threats should not flood the reward economy.
  } else if (drone.type === "cargo") {
    spawnEnergyShard(drone.x, drone.y);
    spawnPowerup(drone.x, drone.y);
  } else {
    if (grantCharge && drone.type !== "mothership" && Math.random() < energyChance) {
      spawnEnergyShard(drone.x, drone.y);
    }
    if (drone.type !== "mothership" && Math.random() < powerupChance) {
      spawnPowerup(drone.x, drone.y);
    }
  }
  if (drone.type === "mine" && !drone.mineDetonated) {
    drone.mineDetonated = true;
    applyMineBlast(drone);
    shake = Math.max(shake, 0.22);
  }
  addDeathAnimation(drone);
  shake = Math.max(shake, 0.1);
}

function bossCannonsAlive() {
  return boss ? boss.parts.some((part) => part.alive) : false;
}

function bossTargets() {
  if (!boss) return [];
  const targets = boss.parts
    .filter((part) => part.alive)
    .map((part) => ({
      kind: "part",
      part,
      x: boss.x + part.offsetX,
      y: boss.y + part.offsetY,
      r: part.r,
    }));
  targets.push({ kind: "torso", x: boss.x, y: boss.y + 12, r: boss.r });
  return targets;
}

function damageBossTarget(target, amount) {
  if (!boss || !target) return false;
  if (target.kind === "part" && target.part.alive) {
    target.part.hp -= amount;
    target.part.flash = 0.16;
    if (target.part.hp <= 0) {
      target.part.alive = false;
      target.part.hp = 0;
      recordKill("bossCannon");
      registerStreakKill("bossCannon", target.x, target.y);
      awardScore(600, target.x, target.y - 34, "#ffd166");
      addFloatingText(target.x, target.y - 18, "CANNON DOWN", "#ffd166");
      addBossCannonDeath(target.x, target.y);
      bullets = bullets.filter((bullet) => {
        const keep = bullet.bossOwnerPart !== target.part.id;
        if (!keep) {
          addParticles(bullet.x, bullet.y, "#ffd166", 10, 180);
          addRingBurst(bullet.x, bullet.y, "#ff5b74", 10, 5, 170, 2.2);
        }
        return keep;
      });
      boss.armor = boss.maxArmor;
      boss.armorFlash = 0.35;
      addFloatingText(boss.x, boss.y - 74, "ARMOR REFRESH", "#ffd166");
      spawnPowerup(target.x, target.y);
      for (let i = 0; i < 3; i += 1) {
        spawnEnergyShard(target.x + rand(-18, 18), target.y + rand(-10, 18));
      }
      shake = Math.max(shake, 0.18);
    }
    return { hit: true, layer: "health", healthRatio: target.part.hp / target.part.maxHp };
  }
  if (target.kind === "torso") {
    if (boss.armor > 0) {
      boss.armor = Math.max(0, boss.armor - 1);
      boss.armorFlash = 0.18;
      boss.flash = 0.08;
      return { hit: true, layer: "armor", healthRatio: boss.hp / boss.maxHp };
    }
    boss.hp -= amount;
    boss.flash = 0.14;
    if (boss.hp <= 0 && !bossCannonsAlive()) {
      const bossX = boss.x;
      const bossY = boss.y;
      recordKill("boss");
      registerStreakKill("boss", bossX, bossY);
      awardScore(2600, bossX, bossY - 76, "#ffd166");
      addFloatingText(bossX, bossY - 58, "BOSS DOWN", "#ff5b74");
      addBossTorsoDeath(bossX, bossY);
      boss = null;
      shake = Math.max(shake, 0.48);
      endGame("victory");
    } else if (boss.hp <= 0) {
      boss.hp = 1;
      addFloatingText(boss.x, boss.y - 48, "BREAK CANNONS", "#ffd166");
    }
    return { hit: true, layer: "health", healthRatio: boss ? boss.hp / boss.maxHp : 0 };
  }
  return { hit: false, layer: "health", healthRatio: 1 };
}

function hitBossWithProjectile(projectile, amount) {
  if (!boss) return false;
  for (const target of bossTargets()) {
    if (dist2(projectile, target) < (projectile.r + target.r) ** 2) {
      const result = damageBossTarget(target, amount * streakDamageMultiplier());
      registerStreakHit(projectile.kind || "normal", projectile.x, projectile.y);
      const color = result.layer === "armor" || target.kind === "part" ? "#ffd166" : "#ff5b74";
      addParticles(projectile.x, projectile.y, color, projectile.kind === "shotgun" ? 10 : 6, 150);
      audio.enemyHit(projectile.kind || "normal", result.healthRatio, result.layer);
      return true;
    }
  }
  return false;
}

function resolveBulletClearingShots() {
  const clearers = playerShots.filter((shot) => shot.kind === "machinegun" || shot.kind === "lockdown" || shot.kind === "sweeper");
  if (!clearers.length || !bullets.length) return;
  const erased = new Set();
  clearers.forEach((shot) => {
    bullets.forEach((bullet, index) => {
      if (erased.has(index)) return;
      const ultimateClear = shot.kind === "lockdown" || shot.kind === "sweeper";
      const radius = (shot.r || 4) + (bullet.r || 4) + (ultimateClear ? 8 : 3) + (bullet.laser ? 10 : 0);
      if (dist2(shot, bullet) <= radius * radius) {
        erased.add(index);
        const color = bullet.laser ? "#ffd166" : ultimateClear ? "#edf7f5" : "#ff5b74";
        addParticles(bullet.x, bullet.y, color, bullet.laser ? 16 : ultimateClear ? 9 : 7, bullet.laser ? 220 : 150);
        addParticles(bullet.x, bullet.y, "#edf7f5", bullet.laser ? 7 : 4, 120);
        addRingBurst(bullet.x, bullet.y, bullet.laser ? "#ffd166" : "#ff5b74", ultimateClear ? 14 : 10, bullet.laser ? 7 : 4, 190, 2.2);
      }
    });
  });
  if (erased.size) {
    bullets = bullets.filter((_, index) => !erased.has(index));
  }
}

function updatePlayerLaser(dt) {
  playerLaserBeam = null;
  if (!isLaserActive()) return;
  const ultimate = player.laserUltimateTimer > 0;
  const ultimateMode = player.laserUltimateMode || "overdrive";
  const skyline = ultimate && ultimateMode === "skyline";
  const prism = ultimate && ultimateMode === "prism";
  const overdrive = hasSOverdrive();
  const range = skyline ? HEIGHT + 80 : prism ? 270 : ultimate ? 620 : overdrive ? 300 : 270;
  const width = skyline ? 20 : prism ? 13 : ultimate ? 42 : overdrive ? 18 : 13;
  const angle = -Math.PI / 2;
  const x = player.x;
  const y1 = player.y - 25;
  const warmupProgress = ultimate ? 1 : 1 - clamp((player.laserWarmup || 0) / 0.38, 0, 1);
  const easedWarmup = warmupProgress * warmupProgress * (3 - 2 * warmupProgress);
  const currentRange = range * Math.max(0.08, easedWarmup);
  const prismDirections = [
    { angle: -Math.PI / 2, ox: 0, oy: -25, scale: 1 },
    { angle: Math.PI / 2, ox: 0, oy: 18, scale: 0.62 },
    { angle: Math.PI, ox: -15, oy: -4, scale: 0.66 },
    { angle: 0, ox: 15, oy: -4, scale: 0.66 },
    { angle: -Math.PI * 0.75, ox: -12, oy: -18, scale: 0.72 },
    { angle: -Math.PI * 0.25, ox: 12, oy: -18, scale: 0.72 },
    { angle: Math.PI * 0.75, ox: -12, oy: 10, scale: 0.56 },
    { angle: Math.PI * 0.25, ox: 12, oy: 10, scale: 0.56 },
  ];
  const hitSegments = prism
    ? prismDirections.map((direction) => {
        const sx = x + direction.ox;
        const sy = player.y + direction.oy;
        return {
          x1: sx,
          y1: sy,
          x2: sx + Math.cos(direction.angle) * currentRange * (direction.scale || 1),
          y2: sy + Math.sin(direction.angle) * currentRange * (direction.scale || 1),
          angle: direction.angle,
        };
      })
    : [{ x1: x, y1, x2: x + Math.cos(angle) * currentRange, y2: y1 + Math.sin(angle) * currentRange, angle }];
  const primarySegment = hitSegments[0];
  playerLaserBeam = {
    x,
    y1,
    x2: primarySegment.x2,
    y2: primarySegment.y2,
    segments: hitSegments,
    width,
    ultimate,
    skyline,
    prism,
    overdrive,
    warmup: easedWarmup,
    angle,
    pulse: 0.5 + Math.sin(elapsed * (ultimate ? 28 : 18)) * 0.5,
  };
  if (!ultimate && easedWarmup < 0.92) return;
  laserTickTimer -= dt;
  if (laserTickTimer > 0) return;
  laserTickTimer = skyline ? 0.045 : prism ? 0.058 : ultimate ? 0.035 : overdrive ? 0.045 : 0.058;
  const damage = skyline ? 0.95 : prism ? 0.42 : ultimate ? 2.6 : overdrive ? 0.58 : 0.42;
  const xPadding = width * 0.5;
  const hitColor = prism ? "#2fd46f" : ultimate ? "#edf7f5" : "#2fd46f";
  let hitSomething = false;

  const beamDistance2 = (target) => {
    let best = { d2: Infinity, px: x, py: y1, angle, tipFactor: 0 };
    hitSegments.forEach((segment) => {
      const ax = segment.x1;
      const ay = segment.y1;
      const bx = segment.x2;
      const by = segment.y2;
      const dx = bx - ax;
      const dy = by - ay;
      const length2 = dx * dx + dy * dy || 1;
      const t = clamp(((target.x - ax) * dx + (target.y - ay) * dy) / length2, 0, 1);
      const px = ax + dx * t;
      const py = ay + dy * t;
      const d2 = dist2(target, { x: px, y: py });
      const tipStart = overdrive && !ultimate ? 0.68 : 0.78;
      const tipFactor = clamp((t - tipStart) / (1 - tipStart), 0, 1);
      if (d2 < best.d2) best = { d2, px, py, angle: segment.angle || angle, tipFactor };
    });
    return best;
  };

  drones.forEach((drone) => {
    if (drone.hp <= 0) return;
    if (drone.type === "mothership") {
      if (skyline && !isDroneOnPlayerScreen(drone)) return;
      const beamHit = beamDistance2(drone);
      if (beamHit.d2 > (drone.r + xPadding) ** 2) return;
      triggerMotherlandEvacuation(drone, beamHit.px, beamHit.py);
      drone.hitShake = Math.max(drone.hitShake || 0, ultimate ? 0.22 : 0.12);
      addParticles(beamHit.px, beamHit.py, "#2fd46f", ultimate ? 8 : 4, 120);
      addRingBurst(beamHit.px, beamHit.py, "#2fd46f", ultimate ? 12 : 7, 3, 160, 2);
      hitSomething = true;
      return;
    }
    if (!isDroneVulnerable(drone)) return;
    const beamHit = beamDistance2(drone);
    if (beamHit.d2 > (drone.r + xPadding) ** 2) return;
    const tipBonus = 1 + beamHit.tipFactor * (prism ? 2.15 : overdrive && !ultimate ? 3.05 : 2.45);
    const result = damageDrone(drone, damage * tipBonus * streakDamageMultiplier(), "laser", beamHit.angle || angle);
    registerStreakHit("laser", drone.x, drone.y);
    drone.flash = Math.max(drone.flash, 0.08);
    const tipHit = beamHit.tipFactor > 0.55;
    addParticles(beamHit.px, beamHit.py, impactLayer(result) === "armor" ? "#ffd166" : tipHit ? "#edf7f5" : hitColor, ultimate || tipHit ? 7 : 3, tipHit ? 220 : 80);
    if (beamHit.tipFactor > 0.72) {
      addRingBurst(beamHit.px, beamHit.py, "#edf7f5", 11, 3, 230, 2.6);
      addRingBurst(beamHit.px, beamHit.py, "#2fd46f", 7, 8, 190, 2);
      audio.laserTip(beamHit.tipFactor);
    }
    audio.enemyHit("laser", drone.hp / drone.maxHp, impactLayer(result));
    hitSomething = true;
    if (drone.hp <= 0) destroyDrone(drone);
  });

  if (boss) {
    bossTargets().forEach((target) => {
      const beamHit = beamDistance2(target);
      if (beamHit.d2 > (target.r + xPadding) ** 2) return;
      const tipBonus = 1 + beamHit.tipFactor * (prism ? 2.15 : overdrive && !ultimate ? 3.05 : 2.45);
      damageBossTarget(target, damage * tipBonus * 0.82 * streakDamageMultiplier());
      addParticles(beamHit.px, beamHit.py, beamHit.tipFactor > 0.55 ? "#edf7f5" : hitColor, ultimate || beamHit.tipFactor > 0.55 ? 6 : 2, beamHit.tipFactor > 0.55 ? 220 : 80);
      if (beamHit.tipFactor > 0.72) {
        addRingBurst(beamHit.px, beamHit.py, "#edf7f5", 11, 3, 230, 2.6);
        addRingBurst(beamHit.px, beamHit.py, "#2fd46f", 7, 8, 190, 2);
        audio.laserTip(beamHit.tipFactor);
      }
      hitSomething = true;
    });
  }

  if (hitSomething) {
    shake = Math.max(shake, ultimate ? 0.055 : 0.025);
  }
  audio.laser();
}

function updatePlayerTrail(dt, previousX, previousY) {
  playerTrail.forEach((trail) => {
    trail.life -= dt;
  });
  playerTrail = playerTrail.filter((trail) => trail.life > 0);

  if (streakCharge <= 0) return;
  const dx = player.x - previousX;
  const dy = player.y - previousY;
  const speed = Math.hypot(dx, dy) / Math.max(dt, 0.001);
  if (speed < 70) return;

  const layer = currentStreakLayer();
  const level = currentStreakLevel();
  const intensity = clamp((level - 1 + currentStreakProgress()) / STREAK_LAYERS.length, 0.1, 1);
  playerTrail.push({
    x: previousX,
    y: previousY + 8,
    vx: -dx / Math.max(dt, 0.001),
    vy: -dy / Math.max(dt, 0.001),
    color: layer ? layer.color : "#6df6d5",
    life: 0.18 + intensity * 0.16,
    maxLife: 0.18 + intensity * 0.16,
    size: 4 + intensity * 8,
  });
  if (playerTrail.length > 18) {
    playerTrail.splice(0, playerTrail.length - 18);
  }
}

function movePlayerTowardPointer(dt) {
  if (!pointer.active) return;
  const follow = 0.64;
  player.x += (pointer.x - player.x) * follow;
  player.y += (pointer.y - player.y) * follow;
}

function updatePlayer(dt) {
  const previousX = player.x;
  const previousY = player.y;
  movePlayerTowardPointer(dt);

  player.invuln = Math.max(0, player.invuln - dt);
  if (circleUltimate && !circleUltimate.resolved) {
    playerLaserBeam = null;
    player.invuln = Math.max(player.invuln, 0.12);
    pointer.rightDown = false;
    player.x = clamp(player.x, 18, WIDTH - 18);
    player.y = clamp(player.y, 18, HEIGHT - 18);
    return;
  }
  player.mainTimer = Math.max(0, player.mainTimer - dt);
  if (player.mainTimer <= 0) {
    player.mainWeapon = "normal";
    activateQueuedPowerup("main");
  }
  player.subTimer = Math.max(0, player.subTimer - dt);
  player.rapidMissileTimer = Math.max(0, player.rapidMissileTimer - dt);
  player.lockdownTimer = Math.max(0, player.lockdownTimer - dt);
  player.laserUltimateTimer = Math.max(0, (player.laserUltimateTimer || 0) - dt);
  player.laserWarmup = Math.max(0, (player.laserWarmup || 0) - dt);
  if (player.subTimer <= 0) {
    player.subWeapon = "none";
    activateQueuedPowerup("sub");
  }

  player.x = clamp(player.x, 18, WIDTH - 18);
  player.y = clamp(player.y, 18, HEIGHT - 18);
  updatePlayerTrail(dt, previousX, previousY);
  updatePlayerLaser(dt);
  const frenzyScale = isPlayerFrenzied() ? 1.32 : 1;

  if (player.subWeapon === "missiles" || player.rapidMissileTimer > 0) {
    missileTimer -= dt * frenzyScale;
    if (missileTimer <= 0) {
      if (player.rapidMissileTimer > 0) {
        spawnMissile(Math.random() < 0.5 ? -12 : 12);
        missileTimer = 0.14 / frenzyScale;
      } else {
        spawnMissile(-12);
        spawnMissile(12);
        missileTimer = 1.15 / frenzyScale;
      }
    }
  }

  if (player.subWeapon === "machinegun" || player.lockdownTimer > 0) {
    machineGunTimer -= dt * frenzyScale;
    if (machineGunTimer <= 0) {
      if (player.lockdownTimer > 0) {
        [-18, -10, 10, 18].forEach((offset, index) => {
          const spread = (index - 1.5) * 0.075;
          fireMachineGunUltimateShot(offset, spread);
        });
      } else {
        fireShot(player.x - 12, player.y - 7, -Math.PI / 2, 800, 3, 0.05, "#ff5b74", "machinegun", 0.24);
        fireShot(player.x + 12, player.y - 7, -Math.PI / 2, 800, 3, 0.05, "#ff5b74", "machinegun", 0.24);
        addMuzzleBlast(player.x - 12, player.y - 7, { angle: -Math.PI / 2, color: "#ff5b74", coreColor: "#ffd166", type: "burst", size: 0.68, life: 0.075 });
        addMuzzleBlast(player.x + 12, player.y - 7, { angle: -Math.PI / 2, color: "#ff5b74", coreColor: "#ffd166", type: "burst", size: 0.68, life: 0.075 });
        ejectShell(player.x - 16, player.y + 2, { side: -1, color: "#ff5b74", size: 5.2, speed: 210, minSpeed: 95, life: 0.82, gravity: 520 });
        ejectShell(player.x + 16, player.y + 2, { side: 1, color: "#ff5b74", size: 5.2, speed: 210, minSpeed: 95, life: 0.82, gravity: 520 });
      }
      audio.machineGun();
      machineGunTimer = (player.lockdownTimer > 0 ? 0.03 : 0.045) / frenzyScale;
    }
  }

  shotTimer -= dt * frenzyScale;
  if (shotTimer <= 0) {
    const mainWeapon = effectiveMainWeapon();
    if (mainWeapon === "shotgun") {
      const overdrive = hasSOverdrive();
      for (let i = -4; i <= 4; i += 1) {
        const angle = -Math.PI / 2 + i * (overdrive ? 0.135 : 0.18);
        const speed = 500 - Math.abs(i) * (overdrive ? 20 : 28);
        const power = overdrive && Math.abs(i) <= 1 ? 3.45 : 3;
        fireShot(player.x, player.y - 16, angle, speed, 9, power, "#ffd166", "shotgun", overdrive ? 0.64 : 0.56);
      }
      if (overdrive) {
        [-1, 1].forEach((side) => {
          fireShot(player.x + side * 8, player.y - 14, -Math.PI / 2 + side * 0.28, 560, 4, 1.2, "#edf7f5", "shotgun", 0.38);
        });
      }
      addMuzzleBlast(player.x, player.y - 18, { angle: -Math.PI / 2, color: "#ffd166", coreColor: "#edf7f5", type: "cone", size: overdrive ? 1.46 : 1.32, life: 0.22 });
      addParticles(player.x, player.y - 18, overdrive ? "#edf7f5" : "#ffd166", overdrive ? 24 : 18, overdrive ? 230 : 190);
      for (let i = 0; i < 3; i += 1) {
        ejectShell(player.x + rand(-6, 6), player.y - 2 + rand(-2, 5), {
          side: i % 2 === 0 ? -1 : 1,
          color: overdrive ? "#edf7f5" : "#ffd166",
          size: rand(7.5, 10),
          speed: 290,
          minSpeed: 130,
          life: 1.08,
          gravity: 620,
        });
      }
      audio.shotgun();
      shotTimer = 0.58 / frenzyScale;
    } else if (mainWeapon === "laser") {
      addMuzzleBlast(player.x, player.y - 22, { angle: -Math.PI / 2, color: "#2fd46f", coreColor: "#edf7f5", type: "laser", size: hasSOverdrive() ? 0.82 : 0.62, life: 0.08 });
      shotTimer = 0.11 / frenzyScale;
    } else {
      if (hasSOverdrive()) {
        fireShot(player.x, player.y - 16, -Math.PI / 2, 630, 5, 1.2, "#6df6d5", "normal");
        fireShot(player.x - 4, player.y - 14, -Math.PI / 2 - 0.18, 610, 5, 1.2, "#6df6d5", "normal");
        fireShot(player.x + 4, player.y - 14, -Math.PI / 2 + 0.18, 610, 5, 1.2, "#6df6d5", "normal");
        addMuzzleBlast(player.x, player.y - 16, { angle: -Math.PI / 2, color: "#6df6d5", coreColor: "#edf7f5", type: "burst", size: 1.06, life: 0.11 });
        addMuzzleBlast(player.x - 4, player.y - 14, { angle: -Math.PI / 2 - 0.18, color: "#6df6d5", coreColor: "#edf7f5", type: "burst", size: 0.82, life: 0.095 });
        addMuzzleBlast(player.x + 4, player.y - 14, { angle: -Math.PI / 2 + 0.18, color: "#6df6d5", coreColor: "#edf7f5", type: "burst", size: 0.82, life: 0.095 });
        ejectShell(player.x - 8, player.y + 1, { side: -1, color: "#6df6d5", size: 4.5, speed: 170, minSpeed: 72, life: 0.68, gravity: 450 });
        ejectShell(player.x + 8, player.y + 1, { side: 1, color: "#6df6d5", size: 4.5, speed: 170, minSpeed: 72, life: 0.68, gravity: 450 });
        shotTimer = 0.18 / frenzyScale;
      } else {
        fireDefaultShot();
        shotTimer = 0.145 / frenzyScale;
      }
      audio.shoot();
    }
  }
}

function updateEnemies(dt) {
  if (!boss && isWaveUnlocked("boss") && wave >= nextBossWave && (!pendingThreat || pendingThreat.type !== "boss")) {
    scheduleThreat("boss", 1.15, "BOSS SIGNAL", "#ff5b74");
  }
  const theme = currentWaveTheme();
  const themeKey = theme.key;
  breatherTimer = Math.max(0, (breatherTimer || 0) - dt);
  lootBreatherCooldown = Math.max(0, (lootBreatherCooldown || 0) - dt);
  mothershipSpawnCooldown = Math.max(0, mothershipSpawnCooldown - dt);
  formationTimer = Math.max(0, formationTimer - dt);
  minefieldTimer = Math.max(0, minefieldTimer - dt);
  if (pendingThreat) {
    pendingThreat.timer -= dt;
    if (pendingThreat.timer <= 0) {
      executePendingThreat();
    }
  }
  spawnTimer -= dt;
  if (!boss && !pendingThreat && breatherTimer <= 0 && spawnTimer <= 0) {
    const canFormation = isWaveUnlocked("formation") && formationTimer <= 0 && !activeMothership() && activeEnemyCount("ship") <= 12;
    const canMinefield = isWaveUnlocked("minefield") && minefieldTimer <= 0 && activeEnemyCount("mine") <= 5;
    let didFormation = false;
    if ((themeKey === "formation" || (themeKey === "mixed" && Math.random() < 0.45) || Math.random() < 0.2) && canFormation) {
      didFormation = true;
      formationTimer = rand(FORMATION_SPAWN_DELAY[0], FORMATION_SPAWN_DELAY[1]);
      scheduleThreat("formation", 0.85, "", "#ffd166", themeKey);
    } else if ((themeKey === "mine" || (themeKey === "mixed" && Math.random() < 0.38) || Math.random() < 0.14) && canMinefield) {
      didFormation = true;
      minefieldTimer = rand(MINEFIELD_SPAWN_DELAY[0], MINEFIELD_SPAWN_DELAY[1]);
      scheduleThreat("minefield", 0.95, "MINEFIELD AHEAD", "#ff5b74", themeKey);
    } else if (isWaveUnlocked("planet") && mothershipSpawnCooldown <= 0 && !activeMothership() && Math.random() < 0.11) {
      scheduleThreat("planet", 1.0, "PLANETARY FIELD", FRENZY_AURA_COLOR, themeKey);
      mothershipSpawnCooldown = 24;
    } else if (isWaveUnlocked("jet") && activeEnemyCount("jet") < 2 && Math.random() < (themeKey === "jet" ? 0.58 : 0.28)) {
      scheduleThreat("jet", 0.7, "JET LOCKERS", "#edf7f5", themeKey);
    } else if (isWaveUnlocked("splitter") && activeEnemyCount("splitter") < SPLITTER_MAX_ACTIVE && Math.random() < (themeKey === "mixed" ? 0.52 : 0.42)) {
      scheduleThreat("splitter", 0.75, "SPLITTER CELL", "#ff5b74", themeKey);
    } else if (isWaveUnlocked("cargo") && activeEnemyCount("cargo") < 1 && Math.random() < (themeKey === "cargo" ? 0.62 : 0.25)) {
      spawnCargoShip();
    } else if (isWaveUnlocked("ufo") && Math.random() < (themeKey === "ufo" ? 0.68 : 0.50)) {
      spawnUfo();
    } else {
      spawnDrone();
    }
    if (!didFormation) {
      const mothershipPresent = Boolean(activeMothership());
      const extraChance = themeKey === "formation" ? 0.66 : themeKey === "mixed" ? 0.6 : mothershipPresent ? 0.3 : 0.52;
      if (isWaveUnlocked("ufo") && Math.random() < extraChance) {
        if (isWaveUnlocked("jet") && activeEnemyCount("jet") < 2 && Math.random() < (themeKey === "jet" ? 0.42 : 0.24)) {
          spawnFighterJet();
        } else if (isWaveUnlocked("splitter") && activeEnemyCount("splitter") < SPLITTER_MAX_ACTIVE && Math.random() < (themeKey === "mixed" ? 0.42 : 0.32)) {
          spawnSplitter();
        } else if (isWaveUnlocked("cargo") && activeEnemyCount("cargo") < 1 && Math.random() < (themeKey === "cargo" ? 0.42 : 0.2)) {
          spawnCargoShip();
        } else if (isWaveUnlocked("ufo") && Math.random() < (themeKey === "ufo" ? 0.55 : 0.38)) {
          spawnUfo();
        } else {
          spawnDrone();
        }
      }
      const baseSpawnDelay = currentSpawnDelay();
      spawnTimer = baseSpawnDelay * (activeMothership() ? MOTHERSHIP_SPAWN_SLOWDOWN : 1);
    }
  } else if (!boss && breatherTimer > 0) {
    spawnTimer = Math.max(spawnTimer, 0.35);
  }

  const activeThreatCount = drones.filter((drone) => !drone.exiting && drone.hp > 0 && drone.type !== "mothership").length;
  if (!boss && !pendingThreat && breatherTimer <= 0 && lootBreatherCooldown <= 0 && activeThreatCount <= 1 && (shards.length + powerups.length) >= 3) {
    lootBreatherCooldown = 8;
    startBreather(1.8);
  }

  drones.forEach((drone) => {
    if (isDroneOnPlayerScreen(drone)) {
      drone.enteredScreen = true;
    }
    if (!drone.exiting && drone.type !== "mothership" && drone.enteredScreen && drone.y - drone.r > HEIGHT + 6) {
      drone.exiting = true;
      drone.cooldown = 99;
      drone.vx = clamp(drone.vx || rand(-18, 18), -80, 80);
      drone.vy = Math.max(drone.vy || 0, 96);
      drone.targetY = drone.y + 120;
    }
    drone.wobble += dt * (drone.type === "ufo" ? 4.2 : drone.type === "mothership" ? 1.6 : drone.type === "cargo" ? 2.1 : drone.type === "splitter" ? 4.8 : 3);
    if (drone.type === "ufo") {
      drone.spin += dt * (drone.spinSpeed || 5);
    }
    if (drone.type === "mothership") {
      drone.rotation = (drone.rotation || 0) + dt * (drone.rotationSpeed || 0.5);
      drone.hitShake = Math.max(0, (drone.hitShake || 0) - dt);
    }
    if (drone.type === "mine") {
      drone.spin += dt * (drone.spinSpeed || 1.4);
      drone.arrivalFlash = Math.max(0, (drone.arrivalFlash || 0) - dt);
      if (drone.mineState === "arming") {
        drone.armingTimer = Math.max(0, (drone.armingTimer || 0) - dt);
        if (drone.armingTimer <= 0) {
          drone.mineState = "armed";
          addFloatingText(drone.x, drone.y - 20, "ARMED", "#ffd166");
          addRingBurst(drone.x, drone.y, "#ff5b74", 18, 7, 210, 2.8);
        }
      }
    }
    const moveScale = droneMoveScale(drone);
    if (!drone.exiting && ENEMY_FORWARD_DRIFT[drone.type] && (drone.type !== "mine" || drone.mineState === "armed")) {
      const driftSpeed = drone.type === "cargo" && drone.fleeing ? 10 : ENEMY_FORWARD_DRIFT[drone.type];
      const drift = driftSpeed * dt * moveScale;
      drone.y += drift;
      drone.targetY = Math.min(HEIGHT + 90, (drone.targetY || drone.y) + drift);
    }
    if (drone.exiting) {
      drone.x += drone.vx * dt;
      drone.y += (drone.vy || 96) * dt;
      drone.cooldown = 99;
    } else if (drone.type === "mothership") {
      drone.y += MOTHERLAND_PASS_DRIFT * dt;
      drone.targetY = drone.y;
    } else if (drone.type === "mine") {
      if (drone.mineState === "incoming") {
        const dx = (drone.targetX || drone.x) - drone.x;
        const dy = (drone.targetY || drone.y) - drone.y;
        const distance = Math.hypot(dx, dy);
        const dashSpeed = 330;
        if (distance <= Math.max(8, dashSpeed * dt)) {
          drone.x = drone.targetX;
          drone.y = drone.targetY;
          drone.vx = 0;
          drone.vy = 0;
          drone.mineState = "arming";
          drone.armingTimer = drone.armingMax || 0.58;
          drone.arrivalFlash = 0.28;
          addRingBurst(drone.x, drone.y, "#ffd166", 14, 5, 170, 2.2);
        } else {
          const nx = dx / distance;
          const ny = dy / distance;
          drone.vx = nx * dashSpeed;
          drone.vy = ny * dashSpeed;
          drone.x += drone.vx * dt * moveScale;
          drone.y += drone.vy * dt * moveScale;
        }
      }
    } else if (drone.type === "cargo" && drone.fleeing) {
      drone.vx += (drone.escapeDir || (drone.x < WIDTH / 2 ? -1 : 1)) * 230 * dt;
      drone.vx = clamp(drone.vx, -300, 300);
      drone.x += drone.vx * dt;
      drone.y += Math.sin(drone.wobble) * 0.45 + (drone.vy || 0) * dt;
      drone.cooldown = 99;
      if (drone.x < -48 || drone.x > WIDTH + 48) {
        drone.exiting = true;
      }
    } else if (drone.type === "jet") {
      drone.x += (drone.targetX - drone.x) * dt * 2.4 * moveScale;
      drone.y += (drone.targetY - drone.y) * dt * 2.4 * moveScale + Math.sin(drone.wobble) * 0.25 * moveScale;
      drone.vx *= 0.96;
    } else if (drone.formation) {
      const path = drone.formation;
      drone.y += path.speed * dt * moveScale;
      const progress = clamp((drone.y + 80) / (HEIGHT * 0.72), 0, 1);
      const arc = Math.sin(progress * Math.PI + path.arcPhase) * path.arcAmp;
      const sway = Math.sin(elapsed * 3.4 + drone.wobble) * path.sway;
      const sweep = (path.sweep || 0) * progress;
      const targetX = clamp(path.laneX + path.offsetX + arc + sweep + sway, 28, WIDTH - 28);
      drone.x += (targetX - drone.x) * Math.min(1, dt * 7 * moveScale);
      drone.vx = targetX - drone.x;
    } else if (drone.type === "ufo") {
      if (drone.phase === "exit") {
        drone.x += drone.vx * dt;
        drone.y += 84 * dt;
        drone.cooldown = 99;
      } else {
        const moveRate = drone.phase === "moving" || drone.phase === "arrive" ? 2.2 : 0.72;
        drone.x += (drone.targetX - drone.x) * dt * moveRate * moveScale;
        drone.y += (drone.targetY - drone.y) * dt * moveRate * moveScale + Math.sin(drone.wobble) * 0.28 * moveScale;
        drone.vx *= 0.94;
        const settled = Math.abs(drone.x - drone.targetX) < 9 && Math.abs(drone.y - drone.targetY) < 9;
        if ((drone.phase === "arrive" || drone.phase === "moving") && settled) {
          drone.phase = "firing";
          drone.cooldown = UFO_PRE_FIRE_HOLD;
        }
      }
    } else if (drone.type === "splitter") {
      drone.splitBirth = Math.max(0, (drone.splitBirth || 0) - dt);
      const tier = drone.splitterTier || "L";
      const verticalPull = tier === "L" ? 0.58 : tier === "M" ? 0.74 : 0.92;
      const drift = tier === "L" ? 1.05 : tier === "M" ? 1.4 : 1.8;
      drone.y += ((drone.targetY - drone.y) * dt * verticalPull + Math.sin(drone.wobble) * drift + (drone.vy || 0) * dt) * moveScale;
      if (tier === "L" && typeof drone.targetX === "number") {
        const approach = clamp(dt * 4.2, 0, 1);
        drone.x += ((drone.targetX - drone.x) * approach + drone.vx * dt * 0.36) * moveScale;
        drone.vx *= 0.955;
        if (Math.abs(drone.x - drone.targetX) < 14) {
          drone.targetX = clamp(WIDTH / 2 + Math.sin(drone.wobble) * 48, 86, WIDTH - 86);
        }
      } else {
        drone.x += drone.vx * dt * moveScale;
        drone.vx += Math.sin(drone.wobble * 0.7) * (tier === "L" ? 9 : 14) * dt * moveScale;
        drone.vx *= tier === "L" ? 0.998 : 0.992;
      }
      if (drone.y > HEIGHT + 80) drone.exiting = true;
    } else {
      drone.y += ((drone.targetY - drone.y) * dt * 0.75 + Math.sin(drone.wobble) * (drone.type === "cargo" ? 0.35 : 0.55)) * moveScale;
      drone.x += drone.vx * dt * moveScale;
    }
    keepEnemyOffPlanet(drone);
    drone.suppressed = Math.max(0, (drone.suppressed || 0) - dt);
    drone.suppressionFlash = Math.max(0, (drone.suppressionFlash || 0) - dt);
    drone.slowTimer = Math.max(0, (drone.slowTimer || 0) - dt);
    if (drone.suppressed <= 0 && drone.type !== "jet" && drone.type !== "mine") {
      drone.cooldown -= dt * (isFrenziedEnemy(drone) ? 1.35 : 1);
    }
    drone.shieldFlash = Math.max(0, (drone.shieldFlash || 0) - dt);
    if (drone.maxShield > 0) {
      drone.shieldDelay = Math.max(0, (drone.shieldDelay || 0) - dt);
      if (drone.shieldDelay <= 0) {
        drone.shield = Math.min(drone.maxShield, (drone.shield || 0) + dt * 1.65);
      }
    }
    drone.flash = Math.max(0, drone.flash - dt);
    drone.fleeFlash = Math.max(0, (drone.fleeFlash || 0) - dt);
    drone.impactSquash = Math.max(0, (drone.impactSquash || 0) - dt * 2.8);
    drone.armorFlash = Math.max(0, (drone.armorFlash || 0) - dt);
    if (drone.type === "jet") {
      if (drone.burstShots > 0) {
        drone.fireInterval -= dt;
        if (drone.fireInterval <= 0) {
          const offset = drone.burstShots % 2 === 0 ? -7 : 7;
          const px = Math.cos(drone.burstAngle + Math.PI / 2) * offset;
          const py = Math.sin(drone.burstAngle + Math.PI / 2) * offset;
          spawnJetBullet(drone.x + px, drone.y + py + 10, drone.burstAngle);
          if (drone.burstShots % 4 === 0) {
            addMuzzleBlast(drone.x + px, drone.y + py + 10, { angle: drone.burstAngle, color: "#ff5b74", coreColor: "#ffd166", type: "danger", size: 0.55, life: 0.06 });
          }
          drone.burstShots -= 1;
          drone.fireInterval = isFrenziedEnemy(drone) ? 0.038 : 0.055;
          drone.flash = Math.max(drone.flash, 0.05);
        }
      } else if (drone.cooldown > 0) {
        drone.cooldown -= dt * (isFrenziedEnemy(drone) ? 1.35 : 1);
      } else {
        const settled = Math.abs(drone.x - drone.targetX) < 10 && Math.abs(drone.y - drone.targetY) < 10;
        if (settled && drone.suppressed <= 0) {
          drone.lockTimer -= dt * (isFrenziedEnemy(drone) ? 1.45 : 1);
          drone.lockX = player.x;
          drone.lockY = player.y;
        }
        if (settled && drone.suppressed <= 0 && drone.lockTimer <= 0) {
          drone.burstAngle = Math.atan2(drone.lockY - drone.y, drone.lockX - drone.x);
          drone.burstShots = 24;
          drone.fireInterval = 0;
          drone.cooldown = isFrenziedEnemy(drone) ? 0.82 : 1.2;
          drone.lockTimer = drone.lockMax || 1.5;
          addFloatingText(drone.x, drone.y - 30, "LOCKED", "#ff5b74");
        }
      }
    } else if (drone.type !== "mine" && drone.cooldown <= 0) {
      const angle = Math.atan2(player.y - drone.y, player.x - drone.x);
      if (drone.type === "mothership") {
        drone.cooldown = 99;
      } else if (drone.type === "ufo") {
        if (drone.phase === "firing") {
          spawnLaser(drone.x, drone.y + 8, angle);
          drone.perchCount += 1;
          if (drone.perchCount >= 3) {
            drone.phase = "holdExit";
            drone.cooldown = UFO_POST_FIRE_HOLD;
          } else {
            drone.phase = "holdMove";
            drone.cooldown = UFO_POST_FIRE_HOLD;
          }
        } else if (drone.phase === "holdMove") {
          const perch = randomUfoPerch();
          drone.targetX = perch.x;
          drone.targetY = perch.y;
          drone.phase = "moving";
          drone.cooldown = 0.22;
        } else if (drone.phase === "holdExit") {
          drone.phase = "exit";
          drone.vx = drone.x < WIDTH / 2 ? -rand(22, 36) : rand(22, 36);
          drone.targetY = drone.y;
          drone.cooldown = 99;
        }
      } else if (drone.type === "cargo") {
        drone.cooldown = 99;
      } else if (drone.type === "splitter") {
        const tier = drone.splitterTier || "L";
        const stats = splitterStats(tier);
        const speed = (tier === "L" ? 145 : tier === "M" ? 158 : 172) + wave * 5;
        spawnBullet(drone.x, drone.y + drone.r * 0.28, angle, speed, tier === "S" ? 3 : 4, isFrenziedEnemy(drone) ? "#ff5b74" : stats.color);
        addMuzzleBlast(drone.x, drone.y + drone.r * 0.28, { angle, color: stats.color, coreColor: "#ffd166", type: "danger", size: tier === "L" ? 0.6 : 0.45, life: 0.07 });
        const cooldownScale = isFrenziedEnemy(drone) ? 0.72 : 1;
        drone.cooldown = rand(stats.cooldown[0], stats.cooldown[1]) * cooldownScale;
      } else {
        spawnBullet(drone.x, drone.y, angle, (172 + wave * 10) * (isFrenziedEnemy(drone) ? 1.16 : 1), 5, isFrenziedEnemy(drone) ? "#ff5b74" : "#ff8c42");
        drone.cooldown = isFrenziedEnemy(drone) ? rand(FRENZIED_FIGHTER_FIRE_DELAY[0], FRENZIED_FIGHTER_FIRE_DELAY[1]) : rand(FIGHTER_FIRE_DELAY[0], FIGHTER_FIRE_DELAY[1]);
      }
    }
  });

  drones = drones.filter((drone) => {
    if (drone.hp <= 0) return false;
    if (drone.exiting) return drone.x > -110 && drone.x < WIDTH + 110 && drone.y > -100 && drone.y < HEIGHT + 140;
    if (drone.type === "mothership") return drone.y < HEIGHT + drone.r + 80;
    return drone.x > -70 && drone.x < WIDTH + 70 && drone.y < HEIGHT + 110;
  });
}

function updateBoss(dt) {
  if (!boss) return;
  boss.wobble += dt * 1.6;
  boss.y += (boss.targetY - boss.y) * dt * 0.55;
  boss.x += Math.sin(boss.wobble) * 28 * dt;
  boss.x = clamp(boss.x, 120, WIDTH - 120);
  boss.flash = Math.max(0, boss.flash - dt);
  boss.armorFlash = Math.max(0, (boss.armorFlash || 0) - dt);
  boss.parts.forEach((part) => {
    part.flash = Math.max(0, (part.flash || 0) - dt);
    if (!part.alive || Math.abs(boss.y - boss.targetY) > 28) return;
    part.fireTimer = Math.max(0, (part.fireTimer || 0) - dt);
    if (part.fireTimer <= 0) {
      const x = boss.x + part.offsetX;
      const y = boss.y + part.offsetY;
      const baseAngle = Math.atan2(player.y - y, player.x - x);
      [-0.11, 0.11].forEach((spread) => {
        spawnBossMissile(x, y, baseAngle + spread, part.id);
      });
      part.fireTimer = rand(2.45, 3.15);
      part.flash = Math.max(part.flash || 0, 0.12);
    }
  });

  boss.fireTimer -= dt;
  if (boss.fireTimer <= 0) {
    const originY = boss.y + 42;
    for (let i = -4; i <= 4; i += 1) {
      const angle = Math.PI / 2 + i * 0.13;
      spawnBullet(boss.x, originY, angle, 150 + wave * 5, 5, "#ff8c42");
    }
    boss.fireTimer = rand(1.1, 1.45);
  }

  if (Math.abs(boss.y - boss.targetY) <= 28) {
    boss.reinforcementTimer = Math.max(0, (boss.reinforcementTimer || 0) - dt);
    if (boss.reinforcementTimer <= 0) {
      spawnBossReinforcements();
      boss.reinforcementTimer = rand(8.4, 11.2);
    }
  }

}

function updateProjectiles(dt) {
  bullets.forEach((bullet) => {
    if (typeof bullet.life === "number") {
      bullet.life -= dt;
    }
    if (bullet.homing && bullet.homingTime > 0) {
      bullet.homingTime -= dt;
      const desired = Math.atan2(player.y - bullet.y, player.x - bullet.x);
      let diff = desired - bullet.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      bullet.angle += clamp(diff, -bullet.turnRate * dt, bullet.turnRate * dt);
      bullet.vx = Math.cos(bullet.angle) * bullet.speed;
      bullet.vy = Math.sin(bullet.angle) * bullet.speed;
      if (bullet.homingTime <= 0) {
        bullet.homing = false;
      }
    } else if (bullet.homing) {
      bullet.homing = false;
    }
    if (bullet.turn) {
      bullet.angle += bullet.turn * dt;
      bullet.vx = Math.cos(bullet.angle) * bullet.speed;
      bullet.vy = Math.sin(bullet.angle) * bullet.speed;
    }
    if (pointer.rightDown) {
      const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
      const ramp = magnetRamp();
      const dangerRamp = magnetDangerRamp();
      if (bullet.magnetWeight > 0) {
        const angle = Math.atan2(player.y - bullet.y, player.x - bullet.x);
        const danger = 0.06 + dangerRamp * dangerRamp * 4.2;
        bullet.vx += Math.cos(angle) * 185 * bullet.magnetWeight * danger * dt;
        bullet.vy += Math.sin(angle) * 185 * bullet.magnetWeight * danger * dt;
        const nextSpeed = Math.hypot(bullet.vx, bullet.vy);
        const maxSpeed = 300 + wave * 9 + dangerRamp * dangerRamp * 560;
        if (nextSpeed > maxSpeed) {
          bullet.vx = (bullet.vx / nextSpeed) * maxSpeed;
          bullet.vy = (bullet.vy / nextSpeed) * maxSpeed;
        }
      } else if (bullet.laser) {
        const maxSpeed = 560 + wave * 12 + dangerRamp * 420;
        const nextSpeed = Math.min(maxSpeed, speed + 230 * (bullet.magnetBoost || 1) * (0.28 + dangerRamp) * dt);
        bullet.vx = (bullet.vx / speed) * nextSpeed;
        bullet.vy = (bullet.vy / speed) * nextSpeed;
      }
    }
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
  });

  playerShots.forEach((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    if (typeof shot.life === "number") {
      shot.life -= dt;
    }
  });

  supportShips.forEach((ship) => {
    ship.life -= dt;
    ship.wobble += dt * 7;
    ship.x += ship.vx * dt;
    ship.y += ship.vy * dt + Math.sin(ship.wobble) * 0.8;
    ship.trailTimer = (ship.trailTimer || 0) - dt;
    if (ship.trailTimer <= 0) {
      ship.trailTimer += SUPPORT_TRAIL_INTERVAL;
      const travelAngle = Math.atan2(ship.vy, ship.vx);
      const trailX = ship.x - Math.cos(travelAngle) * 18;
      const trailY = ship.y - Math.sin(travelAngle) * 18;
      SUPPORT_TRAIL_COLORS.forEach((color, index) => {
        supportTrails.push({
          x: trailX + (index - 1) * 3.8 + rand(-1.2, 1.2),
          y: trailY + rand(-1.5, 1.5),
          color,
          life: 0.36,
          maxLife: 0.36,
          size: 3.1 - Math.abs(index - 1) * 0.25,
        });
      });
      if (supportTrails.length > SUPPORT_TRAIL_LIMIT) {
        supportTrails.splice(0, supportTrails.length - SUPPORT_TRAIL_LIMIT);
      }
    }
    const canFireSupportMissiles = ship.y <= HEIGHT * 0.55;
    if (canFireSupportMissiles) {
      ship.fireTimer -= dt;
    }
    if (canFireSupportMissiles && ship.fireTimer <= 0) {
      spawnMissile(0, ship, {
        vx: ship.vx * 0.12 + rand(-55, 55),
        vy: -330 + rand(-40, 20),
        power: 2.1,
        life: 2.9,
        turn: 10.5,
        retargetTimer: 0.16,
        retargetInterval: 0.22,
      });
      const muzzleAngle = Math.atan2(ship.vy, ship.vx);
      addMuzzleBlast(ship.x + Math.cos(muzzleAngle) * 16, ship.y + Math.sin(muzzleAngle) * 16, {
        angle: muzzleAngle,
        color: "#8a7dff",
        coreColor: "#edf7f5",
        type: "burst",
        size: 1.02,
        life: 0.11,
      });
      ship.fireTimer = 0.24 + Math.random() * 0.08;
    }
  });
  supportShips = supportShips.filter((ship) => ship.life > 0 && ship.x > -140 && ship.x < WIDTH + 140 && ship.y > -160);
  supportTrails.forEach((trail) => {
    trail.life -= dt;
    trail.y += 36 * dt;
  });
  supportTrails = supportTrails.filter((trail) => trail.life > 0);
  if (supportTrails.length > SUPPORT_TRAIL_LIMIT) {
    supportTrails.splice(0, supportTrails.length - SUPPORT_TRAIL_LIMIT);
  }
  supportPathLanes.forEach((lane) => {
    lane.life -= dt;
    lane.phase += dt * 2.4;
  });
  supportPathLanes = supportPathLanes.filter((lane) => lane.life > 0);

  missiles.forEach((missile) => {
    missile.trailTimer = (missile.trailTimer || 0) - dt;
    if (missile.trailTimer <= 0) {
      missile.trailTimer += MISSILE_TRAIL_INTERVAL;
      const angle = Math.atan2(missile.vy, missile.vx);
      missileTrails.push({
        x: missile.x - Math.cos(angle) * 10 + rand(-1.2, 1.2),
        y: missile.y - Math.sin(angle) * 10 + rand(-1.2, 1.2),
        angle,
        life: 0.28,
        maxLife: 0.28,
        size: missile.r || 6,
        color: hasSOverdrive() ? "#8a7dff" : "#ffd166",
      });
      if (missileTrails.length > MISSILE_TRAIL_LIMIT) {
        missileTrails.splice(0, missileTrails.length - MISSILE_TRAIL_LIMIT);
      }
    }
    const targetIsBoss = missile.target === boss && boss;
    const shouldPreferEnemy = missile.target && missile.target.type === "mothership" && hasVulnerableNonPlanetEnemy();
    missile.retargetTimer = Math.max(0, (missile.retargetTimer || 0) - dt);
    const needsTarget = !missile.target || missile.target.hp <= 0 || shouldPreferEnemy || (!targetIsBoss && !drones.includes(missile.target));
    if (needsTarget && missile.retargetTimer <= 0) {
      missile.target = nearestDrone(missile.x, missile.y);
      missile.retargetTimer = missile.retargetInterval || 0.18;
    }
    if (missile.target) {
      const desired = Math.atan2(missile.target.y - missile.y, missile.target.x - missile.x);
      const current = Math.atan2(missile.vy, missile.vx);
      let diff = desired - current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const next = current + clamp(diff, -missile.turn * dt, missile.turn * dt);
      const speed = 330;
      missile.vx = Math.cos(next) * speed;
      missile.vy = Math.sin(next) * speed;
    }
    missile.x += missile.vx * dt;
    missile.y += missile.vy * dt;
    missile.life -= dt;
  });
  missileTrails.forEach((trail) => {
    trail.life -= dt;
    trail.y += 18 * dt;
  });
  missileTrails = missileTrails.filter((trail) => trail.life > 0);
  if (missileTrails.length > MISSILE_TRAIL_LIMIT) {
    missileTrails.splice(0, missileTrails.length - MISSILE_TRAIL_LIMIT);
  }

  bullets = bullets.filter((bullet) => (typeof bullet.life !== "number" || bullet.life > 0) && bullet.x > -36 && bullet.x < WIDTH + 36 && bullet.y > -36 && bullet.y < HEIGHT + 36);
  playerShots = playerShots.filter((shot) => shot.y > -30 && (typeof shot.life !== "number" || shot.life > 0));
  missiles = missiles.filter((missile) => missile.life > 0 && missile.x > -60 && missile.x < WIDTH + 60 && missile.y > -60 && missile.y < HEIGHT + 60);
}

function resolveCollisions() {
  const circleActive = circleUltimate && !circleUltimate.resolved;
  resolveBulletClearingShots();
  drones.forEach((drone) => {
    if (circleActive || drone.hp <= 0 || player.invuln > 0 || drone.type === "mothership") return;
    const hitRadius = player.r + drone.r - 1;
    if (dist2(player, drone) < hitRadius * hitRadius) {
      const angle = Math.atan2(player.y - drone.y, player.x - drone.x);
      const isMine = drone.type === "mine";
      drone.flash = Math.max(drone.flash, 0.16);
      damagePlayer({ kind: isMine ? "mine" : "ram", label: isMine ? "MINE HIT -1" : "RAMMED -1", knockbackAngle: angle, knockback: isMine ? 82 : 64, shakeAmount: isMine ? 0.52 : 0.4 });
      if (isMine) {
        drone.hp = 0;
        drone.mineDetonated = true;
        applyMineBlast(drone);
        addDeathAnimation(drone);
        audio.enemyDeath("mine");
        shake = Math.max(shake, 0.42);
      }
    }
  });

  if (!circleActive && boss && player.invuln <= 0) {
    const hitRadius = player.r + boss.r - 4;
    if (dist2(player, boss) < hitRadius * hitRadius) {
      const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
      damagePlayer({ kind: "ram", label: "CRUSHED -1", knockbackAngle: angle, knockback: 76, shakeAmount: 0.46 });
    }
  }

  bullets = bullets.filter((bullet) => {
    const hitRadius = player.r + bullet.r + (bullet.laser ? 6 : -1);
    if (!circleActive && player.invuln <= 0 && dist2(player, bullet) < hitRadius * hitRadius) {
      damagePlayer({
        kind: bullet.laser ? "laser" : "bullet",
        label: bullet.laser ? "LASER HIT -1" : "HULL HIT -1",
        shakeAmount: bullet.laser ? 0.42 : 0.34,
      });
      return false;
    }
    return true;
  });

  playerShots = playerShots.filter((shot) => {
    if (hitBossWithProjectile(shot, shot.power)) {
      return false;
    }
    for (const drone of droneHitOrder()) {
      if (drone.hp <= 0) continue;
      if (drone.type !== "mothership" && !isDroneVulnerable(drone)) continue;
      if (dist2(shot, drone) < (shot.r + drone.r) ** 2) {
        if (drone.type === "mothership") {
          if (shot.piercedPlanet) continue;
          triggerMotherlandEvacuation(drone, shot.x, shot.y);
          addParticles(shot.x, shot.y, "#edf7f5", 6, 110);
          if (Math.random() < 0.25) {
            shot.piercedPlanet = true;
            return true;
          }
          return false;
        }
        const result = damageDrone(drone, shot.power * streakDamageMultiplier(), shot.kind || "normal", projectileImpactAngle(shot, drone));
        registerStreakHit(shot.kind || "normal", shot.x, shot.y);
        if (shot.kind === "machinegun" && hasSOverdrive()) {
          drone.slowTimer = Math.max(drone.slowTimer || 0, 0.45);
        }
        requestHitStop(shot.kind || "normal");
        shake = Math.max(shake, shot.kind === "shotgun" ? 0.06 : 0.035);
        const hitColor = result.shieldHit ? SHIELD_COLOR : "#ffd166";
        addParticles(shot.x, shot.y, hitColor, shot.kind === "shotgun" ? 9 : 5, 130);
        audio.enemyHit(shot.kind || "normal", drone.hp / drone.maxHp, impactLayer(result));
        if (drone.hp <= 0) {
          destroyDrone(drone);
        }
        if (shot.kind === "sweeper" && (shot.bounces || 0) > 0) {
          const nextTarget = droneHitOrder().find((candidate) => candidate !== drone && candidate.hp > 0 && candidate.type !== "mothership" && isDroneVulnerable(candidate) && dist2(drone, candidate) < (shot.bounceRange || 190) ** 2);
          if (nextTarget) {
            const angle = Math.atan2(nextTarget.y - drone.y, nextTarget.x - drone.x);
            shot.x = drone.x;
            shot.y = drone.y;
            shot.vx = Math.cos(angle) * 880;
            shot.vy = Math.sin(angle) * 880;
            shot.bounces -= 1;
            shot.life = Math.max(shot.life || 0, 0.16);
            addRingBurst(drone.x, drone.y, "#ff5b74", 10, 3, 140, 1.8);
            return true;
          }
        }
        return false;
      }
    }
    return true;
  });

  missiles = missiles.filter((missile) => {
    if (hitBossWithProjectile(missile, missile.power)) {
      applyMissileSplash(missile);
      shake = Math.max(shake, 0.075);
      return false;
    }
    for (const drone of droneHitOrder()) {
      if (drone.hp <= 0) continue;
      if (drone.type !== "mothership" && !isDroneVulnerable(drone)) continue;
      if (dist2(missile, drone) < (missile.r + drone.r + 2) ** 2) {
        if (drone.type === "mothership") {
          if (missile.piercedPlanet) continue;
          if (hasVulnerableNonPlanetEnemy() || missile.target !== drone) continue;
          triggerMotherlandEvacuation(drone, missile.x, missile.y);
          applyMissileSplash(missile, drone);
          shake = Math.max(shake, 0.075);
          if (Math.random() < 0.25) {
            missile.piercedPlanet = true;
            return true;
          }
          return false;
        }
        const result = damageDrone(drone, missile.power * streakDamageMultiplier(), "missile", projectileImpactAngle(missile, drone));
        registerStreakHit("missile", missile.x, missile.y);
        drone.flash = Math.max(drone.flash, 0.16);
        shake = Math.max(shake, 0.075);
        applyMissileSplash(missile, drone);
        addParticles(missile.x, missile.y, result.shieldHit ? SHIELD_COLOR : "#ffd166", 18, 220);
        audio.enemyHit("missile", drone.hp / drone.maxHp, impactLayer(result));
        if (drone.hp <= 0) {
          destroyDrone(drone);
        }
        return false;
      }
    }
    return true;
  });

  shards = shards.filter((shard) => {
    const dropStep = circleActive ? 0.16 / 60 : breatherTimer > 0 ? 0.58 / 60 : 1 / 60;
    shard.life -= dropStep;
    shard.wobble += 0.045;
    shard.vy += 0.18 * (circleActive ? 0.16 : 1);
    shard.vx += Math.sin(shard.wobble) * 0.1 + (shard.drift || 0) * 0.0026;
    shard.vx *= 0.988;
    shard.vy *= 0.992;
    shard.x += shard.vx * dropStep;
    shard.y += shard.vy * dropStep;
    if (!circleActive && pointer.rightDown) {
      magnetPull(shard, (shard.magnetWeight || 0.095) * (0.25 + magnetRamp() * 0.75));
    }
    if (dist2(player, shard) < (player.r + shard.r + 2) ** 2) {
      addCharge(1);
      refreshStreakDecay();
      addParticles(shard.x, shard.y, "#6df6d5", 16, 180);
      audio.pickup("energy");
      return false;
    }
    return shard.life > 0 && shard.x > -12 && shard.x < WIDTH + 12 && shard.y > -24 && shard.y < HEIGHT + 18;
  });

  powerups = powerups.filter((powerup) => {
    const dropStep = circleActive ? 0.16 / 60 : breatherTimer > 0 ? 0.58 / 60 : 1 / 60;
    powerup.life -= dropStep;
    powerup.collectDelay = Math.max(0, (powerup.collectDelay || 0) - dropStep);
    powerup.vy += 0.16 * (circleActive ? 0.16 : 1);
    powerup.vx += Math.sin(powerup.pulse * 0.7) * 0.08 + (powerup.drift || 0) * 0.0024;
    powerup.vx *= 0.989;
    powerup.vy *= 0.992;
    powerup.x += powerup.vx * dropStep;
    powerup.y += powerup.vy * dropStep;
    powerup.pulse += 0.08;
    if (!circleActive && pointer.rightDown && !powerup.collectDelay) {
      magnetPull(powerup, (powerup.magnetWeight || 0.065) * (0.25 + magnetRamp() * 0.75));
    }
    if (!powerup.collectDelay && dist2(player, powerup) < (player.r + powerup.r + 3) ** 2) {
      refreshStreakDecay();
      collectPowerup(powerup.type);
      addParticles(powerup.x, powerup.y, powerupInfo[powerup.type].color, 20, 210);
      return false;
    }
    return powerup.life > 0 && powerup.x > -14 && powerup.x < WIDTH + 14 && powerup.y > -28 && powerup.y < HEIGHT + 22;
  });

  if (player.hits <= 0) {
    startPlayerDeathSequence();
  }
}

function endGame(outcome = "death") {
  playerDeathSequence = null;
  state = "gameover";
  audio.musicMode = "normal";
  audio.stopMusic();
  pauseMenu.classList.add("hidden");
  overlay.classList.remove("hidden");
  const summary = buildRunSummary(outcome);
  const previousSummary = lastRunSummary;
  const previousBest = bestRunSummary;
  lastRunSummary = summary;
  if (!bestRunSummary || summary.score > bestRunSummary.score) {
    bestRunSummary = summary;
  }
  storeSummary(LAST_RUN_KEY, lastRunSummary);
  storeSummary(BEST_RUN_KEY, bestRunSummary);
  updateTitleRecords();
  overlay.querySelector(".panel").classList.add("summary-panel");
  overlay.querySelector(".kicker").textContent = `${summary.outcome === "victory" ? "Demo complete" : "Run ended"} - Score ${summary.score.toLocaleString()} - Wave ${summary.wave}`;
  overlay.querySelector("h1").textContent = summary.outcome === "victory" ? "Demo complete." : "Signal lost.";
  overlay.querySelector(".copy").innerHTML = runSummaryHtml(summary, previousSummary, previousBest);
  restartButton.textContent = "Run It Back";
}

function buildRunSummary(outcome = "death") {
  return {
    score: Math.round(score),
    wave,
    outcome,
    bestStreak: bestStreakLevel,
    sRankTime: runStats ? runStats.sRankTime || 0 : 0,
    kills: { ...emptyKills(), ...(runStats ? runStats.kills : {}) },
    endedAt: Date.now(),
  };
}

function formatDuration(seconds = 0) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return minutes > 0 ? `${minutes}:${String(remaining).padStart(2, "0")}` : `${remaining}s`;
}

function runSummaryHtml(summary, previousSummary, previousBest) {
  const lastDelta = previousSummary ? summary.score - previousSummary.score : 0;
  const bestScore = previousBest ? Math.max(summary.score, previousBest.score) : summary.score;
  const bestDelta = previousBest ? summary.score - previousBest.score : 0;
  const bestStatus = !previousBest || summary.score > previousBest.score ? "New best" : formatSigned(bestDelta);
  const lastStatus = previousSummary ? formatSigned(lastDelta) : "First recorded";
  const killRows = Object.entries(killLabels)
    .map(([key, label]) => `
      <div class="kill-row">
        <span>${label}</span>
        <strong>${summary.kills[key] || 0}</strong>
      </div>`)
    .join("");

  return `
    <section class="run-summary">
      <p class="demo-thanks">Thank you for playing the Stormbringer demo.</p>
      <div class="summary-score">
        <span>Final Score</span>
        <strong>${summary.score.toLocaleString()}</strong>
      </div>
      <div class="summary-metrics">
        <div>
          <span>Wave</span>
          <strong>${summary.wave}</strong>
        </div>
        <div>
          <span>S Rank Time</span>
          <strong>${formatDuration(summary.sRankTime)}</strong>
        </div>
        <div>
          <span>Last Run</span>
          <strong>${previousSummary ? previousSummary.score.toLocaleString() : "-"}</strong>
          <em>${lastStatus}</em>
        </div>
        <div>
          <span>Best</span>
          <strong>${bestScore.toLocaleString()}</strong>
          <em>${bestStatus}</em>
        </div>
      </div>
      <div class="kills-title">Kills</div>
      <div class="kill-grid">${killRows}</div>
    </section>`;
}

function updateParticles(dt) {
  particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.angle += (particle.spin || 0) * dt;
    particle.vy += (particle.gravity || 0) * dt;
    particle.vx *= particle.drag || 0.98;
    particle.vy *= particle.drag || 0.98;
    particle.life -= dt;
  });
  particles = particles.filter((particle) => particle.life > 0);
}

function updateFloatingTexts(dt) {
  floatingTexts.forEach((text) => {
    text.y -= 42 * dt;
    text.life -= dt;
  });
  floatingTexts = floatingTexts.filter((text) => text.life > 0);
}

function updateShieldTransfers(dt) {
  shieldTransfers.forEach((transfer) => {
    transfer.life -= dt;
  });
  shieldTransfers = shieldTransfers.filter((transfer) => transfer.life > 0 && transfer.to && transfer.to.hp > 0);
}

function updateMuzzleBlasts(dt) {
  muzzleBlasts.forEach((blast) => {
    blast.life -= dt;
  });
  muzzleBlasts = muzzleBlasts.filter((blast) => blast.life > 0);
}

function updateNukeEffects(dt) {
  nukeEffects.forEach((effect) => {
    effect.life -= dt;
  });
  nukeEffects = nukeEffects.filter((effect) => effect.life > 0);
}

function updateMissileSplashEffects(dt) {
  missileSplashEffects.forEach((effect) => {
    effect.life -= dt;
  });
  missileSplashEffects = missileSplashEffects.filter((effect) => effect.life > 0);
}

function triggerMotherlandEvacuation(mother, hitX = mother.x, hitY = mother.y) {
  if (!mother) return;
  mother.flash = Math.max(mother.flash || 0, 0.18);
  mother.hitShake = Math.max(mother.hitShake || 0, 0.18);
  const visibleHitX = clamp(hitX, 26, WIDTH - 26);
  const visibleHitY = clamp(hitY, 34, HEIGHT - 34);
  const awayAngle = Math.atan2(visibleHitY - mother.y, visibleHitX - mother.x);
  const base = Number.isFinite(awayAngle) ? awayAngle : -Math.PI / 2;
  const count = 1;
  for (let i = 0; i < count; i += 1) {
    const angle = base + rand(-1.35, 1.35);
    const launch = rand(16, 46);
    const spawnX = clamp(visibleHitX + Math.cos(angle) * launch + rand(-10, 10), 18, WIDTH - 18);
    const spawnY = clamp(visibleHitY + Math.sin(angle) * launch + rand(-10, 10), 24, HEIGHT - 24);
    const speed = rand(135, 210);
    const life = rand(0.82, 1.18);
    civilianShips.push({
      x: spawnX,
      y: spawnY,
      vx: Math.cos(angle) * speed + rand(-24, 24),
      vy: Math.sin(angle) * speed + rand(-24, 24),
      angle,
      spin: rand(-0.18, 0.18),
      curve: Math.random() < 0.65 ? rand(-2.1, 2.1) : 0,
      life,
      maxLife: life,
      size: rand(0.42, 0.62),
      color: Math.random() < 0.5 ? "#8a9290" : "#b49b5d",
    });
  }
  addRingBurst(visibleHitX, visibleHitY, "#b49b5d", 7, 4, 140, 1.5);
  addParticles(visibleHitX, visibleHitY, "#8a9290", 4, 70);
}

function updateCivilianShips(dt) {
  civilianShips.forEach((ship) => {
    if (ship.curve) {
      const speed = Math.hypot(ship.vx, ship.vy);
      const angle = Math.atan2(ship.vy, ship.vx) + ship.curve * dt;
      ship.vx = Math.cos(angle) * speed;
      ship.vy = Math.sin(angle) * speed;
      ship.angle = angle;
      ship.curve *= 0.985;
    }
    ship.x += ship.vx * dt;
    ship.y += ship.vy * dt;
    if (!ship.curve) ship.angle += ship.spin * dt;
    ship.vx *= 0.999;
    ship.vy *= 0.999;
    ship.life -= dt;
  });
  civilianShips = civilianShips.filter((ship) => ship.life > 0 && ship.x > -360 && ship.x < WIDTH + 360 && ship.y > -420 && ship.y < HEIGHT + 420);
}

function updatePlayerDamageFeedback(dt) {
  playerDamageFlash = Math.max(0, playerDamageFlash - dt);
  playerDamagePulse = Math.max(0, playerDamagePulse - dt);
}

function updatePlayerHealFeedback(dt) {
  playerHealFlash = Math.max(0, playerHealFlash - dt);
  playerHealPulse = Math.max(0, playerHealPulse - dt);
}

function updateKillStreak(dt) {
  inventoryUnlockFlash = Math.max(0, inventoryUnlockFlash - dt);
  if (streakCharge <= 0) return;
  if (streakDecayDelay > 0) {
    streakDecayDelay = Math.max(0, streakDecayDelay - dt);
    return;
  }
  streakCharge = Math.max(0, streakCharge - dt * currentStreakDecayRate());
}

function updateRunTimers(dt) {
  if (!runStats) return;
  if (hasSStreak()) {
    runStats.sRankTime = (runStats.sRankTime || 0) + dt;
  }
}

function updateFrenzyTimers(dt) {
  if (player) {
    player.frenzyTimer = Math.max(0, (player.frenzyTimer || 0) - dt);
  }
  drones.forEach((drone) => {
    drone.frenzyTimer = Math.max(0, (drone.frenzyTimer || 0) - dt);
  });

  const mother = activeMothership();
  if (!mother) return;
  const entry = planetEntryProgress(mother);
  if (entry <= 0.05) return;
  const activeRadius = MOTHERSHIP_FRENZY_RADIUS * entry;
  const radiusSq = activeRadius * activeRadius;
  if (player && dist2(mother, player) < radiusSq) {
    player.frenzyTimer = FRENZY_LINGER_DURATION;
  }
  drones.forEach((drone) => {
    if (drone.type === "mothership" || drone.type === "mine" || drone.hp <= 0 || drone.exiting) return;
    if (dist2(mother, drone) < radiusSq) {
      drone.frenzyTimer = FRENZY_LINGER_DURATION;
    }
  });
}

function updateEnergyFloor() {
  if (!player || ultimateCue) return;
  player.charge = Math.max(player.charge, minimumEnergy());
}

function updatePlayerDeathSequence(dt) {
  if (!playerDeathSequence) return;
  playerDeathSequence.timer -= dt;
  const progress = 1 - clamp(playerDeathSequence.timer / playerDeathSequence.maxTimer, 0, 1);
  shake = Math.max(shake, 0.42 * (1 - progress));
  if (playerDeathSequence.timer > 0.9 && Math.random() < 0.65) {
    addParticle(playerDeathSequence.x + rand(-20, 20), playerDeathSequence.y + rand(-16, 16), {
      color: Math.random() < 0.5 ? "#ff5b74" : "#ffd166",
      shape: "spark",
      speed: 220,
      minSpeed: 40,
      life: 0.38,
      size: rand(3, 8),
    });
  }
  if (playerDeathSequence.timer <= 0) {
    endGame();
  }
}

function update(dt) {
  if (state === "dying") {
    elapsed += dt * 0.35;
    shake = Math.max(0, shake - dt * 0.45);
    updatePlayerDamageFeedback(dt);
    updatePlayerHealFeedback(dt);
    updatePlayerDeathSequence(dt);
    updateProjectiles(dt * 0.08);
    updateParticles(dt);
    updateFloatingTexts(dt);
    updateShieldTransfers(dt * 0.08);
    updateMuzzleBlasts(dt);
    updateNukeEffects(dt);
    updateCivilianShips(dt);
    return;
  }
  if (state !== "playing") return;

  hitStopCooldown = Math.max(0, hitStopCooldown - dt);
  if (hitStop > 0) {
    hitStop = Math.max(0, hitStop - dt);
    updatePlayerDamageFeedback(dt);
    updatePlayerHealFeedback(dt);
    updateFloatingTexts(dt);
    updateShieldTransfers(dt);
    updateMuzzleBlasts(dt);
    updateNukeEffects(dt);
    updateCivilianShips(dt);
    return;
  }

  elapsed += dt;
  wave = Math.max(wave, 1 + Math.floor(elapsed / 28));
  if (wave !== announcedWave) {
    announcedWave = wave;
  }
  shake = Math.max(0, shake - dt);
  updatePlayerDamageFeedback(dt);
  updatePlayerHealFeedback(dt);
  updateKillStreak(dt);
  updateRunTimers(dt);
  updateFrenzyTimers(dt);
  updateEnergyFloor();
  updateCircleUltimate(dt);
  const circleActive = circleUltimate && !circleUltimate.resolved;
  const worldDt = circleActive ? dt * 0.025 : dt;
  if (!circleActive && pointer.rightDown) {
    magnetHoldTime += dt;
    audio.magnet(!magnetWasDown, magnetRamp());
    magnetWasDown = true;
  } else {
    pointer.rightDown = false;
    magnetWasDown = false;
    magnetHoldTime = 0;
  }

  updatePlayer(dt);
  updateEnemies(worldDt);
  updateBoss(worldDt);
  updateProjectiles(worldDt);
  resolveCollisions();
  if (!circleActive) {
    triggerChargeRelease();
    updateUltimateCue(dt);
  }
  updateParticles(worldDt);
  updateFloatingTexts(dt);
  updateShieldTransfers(worldDt);
  updateMuzzleBlasts(worldDt);
  updateNukeEffects(worldDt);
  updateMissileSplashEffects(worldDt);
  updateCivilianShips(worldDt);
  updateHud();
}

function starNoise(seed) {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function drawStarLayer(count, speed, size, alpha, color, seedOffset, streak = 0) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const seed = i + seedOffset;
    const x = starNoise(seed) * WIDTH;
    const baseY = starNoise(seed + 97.13) * (HEIGHT + 80);
    const y = (baseY + elapsed * speed) % (HEIGHT + 80) - 40;
    const twinkle = 0.74 + Math.sin(elapsed * (1.4 + starNoise(seed + 11) * 2.6) + seed) * 0.26;
    ctx.globalAlpha = alpha * twinkle;
    if (streak > 0) {
      ctx.fillRect(x, y, size, size + streak * (0.65 + starNoise(seed + 29) * 0.7));
    } else {
      ctx.fillRect(x, y, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

function drawBackground() {
  const spaceGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  spaceGradient.addColorStop(0, "#03070f");
  spaceGradient.addColorStop(0.5, "#071014");
  spaceGradient.addColorStop(1, "#100b16");
  ctx.fillStyle = spaceGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const nebulaAOffset = (elapsed * 12) % (HEIGHT + 420);
  const nebulaBOffset = (elapsed * 8) % (HEIGHT + 380);
  const nebulaA = ctx.createRadialGradient(WIDTH * 0.22, (HEIGHT * 0.2 + nebulaAOffset) % (HEIGHT + 420) - 210, 20, WIDTH * 0.22, (HEIGHT * 0.2 + nebulaAOffset) % (HEIGHT + 420) - 210, 340);
  nebulaA.addColorStop(0, "rgba(38, 103, 255, 0.18)");
  nebulaA.addColorStop(0.46, "rgba(109, 246, 213, 0.045)");
  nebulaA.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = nebulaA;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const nebulaB = ctx.createRadialGradient(WIDTH * 0.84, (HEIGHT * 0.72 + nebulaBOffset) % (HEIGHT + 380) - 190, 30, WIDTH * 0.84, (HEIGHT * 0.72 + nebulaBOffset) % (HEIGHT + 380) - 190, 300);
  nebulaB.addColorStop(0, "rgba(255, 91, 116, 0.11)");
  nebulaB.addColorStop(0.55, "rgba(255, 209, 102, 0.035)");
  nebulaB.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = nebulaB;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  drawStarLayer(120, 36, 1, 0.36, "#edf7f5", 17, 1.5);
  drawStarLayer(82, 86, 1.4, 0.5, "#bfe9ff", 211, 7);
  drawStarLayer(34, 156, 2, 0.68, "#ffffff", 509, 18);

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#6df6d5";
  ctx.lineWidth = 1;
  const drift = (elapsed * 42) % 150;
  for (let i = -1; i < 7; i += 1) {
    const y = i * 150 + drift;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y - 76);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBar(x, y, w, h, value, max, color) {
  ctx.fillStyle = "rgba(237, 247, 245, 0.12)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * clamp(value / max, 0, 1), h);
}

function drawArmorPips(x, y, count, maxCount, flash = 0) {
  if (!maxCount || count <= 0) return;
  const gap = 2;
  const pip = 5;
  const total = maxCount * pip + (maxCount - 1) * gap;
  const startX = x - total / 2;
  for (let i = 0; i < maxCount; i += 1) {
    const px = startX + i * (pip + gap);
    ctx.fillStyle = "rgba(255, 209, 102, 0.14)";
    ctx.fillRect(px, y, pip, pip);
    if (i < count) {
      ctx.fillStyle = flash > 0 ? "#edf7f5" : "#ffd166";
      ctx.fillRect(px, y, pip, pip);
    }
  }
}

function drawDefenseMeters(drone, x, y, width) {
  drawBar(x - width / 2, y, width, 4, drone.hp, drone.maxHp, "#ff5b74");
  let nextY = y + 6;
  if (drone.maxShield) {
    drawBar(x - width / 2, nextY, width, 3, drone.shield || 0, drone.maxShield, SHIELD_COLOR);
    nextY += 5;
  }
  if (drone.maxArmor) {
    drawArmorPips(x, nextY, drone.armor || 0, drone.maxArmor, drone.armorFlash || 0);
  }
}

function drawSparkMarker(x, y, color, size = 1, angle = 0, pulse = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#071014";
  ctx.shadowColor = color;
  ctx.shadowBlur = 5 + pulse * 5;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -4.4 * size);
  ctx.lineTo(2.5 * size, 0);
  ctx.lineTo(0, 4.4 * size);
  ctx.lineTo(-2.5 * size, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.95 * size;
  ctx.globalAlpha = 0.54;
  for (let i = 0; i < 4; i += 1) {
    const ray = (Math.PI / 2) * i + pulse * 0.35;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ray) * 5.2 * size, Math.sin(ray) * 5.2 * size);
    ctx.lineTo(Math.cos(ray) * (7.5 + pulse * 2) * size, Math.sin(ray) * (7.5 + pulse * 2) * size);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayerHealth() {
  const x = 24;
  const y = HEIGHT - 50;
  const pipW = 24;
  const pipH = 12;
  const gap = 7;

  for (let i = 0; i < MAX_PLAYER_HITS; i += 1) {
    const pipX = x + i * (pipW + gap);
    ctx.fillStyle = "rgba(237, 247, 245, 0.12)";
    ctx.fillRect(pipX, y, pipW, pipH);
    ctx.strokeStyle = "rgba(237, 247, 245, 0.28)";
    ctx.strokeRect(pipX, y, pipW, pipH);

    if (i < player.hits) {
      ctx.fillStyle = player.invuln > 0 ? "#ffd166" : "#ff5b74";
      ctx.fillRect(pipX + 3, y + 3, pipW - 6, pipH - 6);
    }
  }
}

function drawEnergyPips() {
  const x = 24;
  const y = HEIGHT - 24;
  const pipW = 24;
  const pipH = 12;
  const gap = 7;
  const cuePulse = ultimateCue ? clamp(ultimateCue.life / ultimateCue.maxLife, 0, 1) : 0;

  for (let i = 0; i < MAX_ENERGY; i += 1) {
    const pipX = x + i * (pipW + gap);
    ctx.fillStyle = "rgba(109, 246, 213, 0.08)";
    ctx.fillRect(pipX, y, pipW, pipH);
    ctx.strokeStyle = cuePulse > 0 ? `rgba(255, 209, 102, ${0.25 + cuePulse * 0.55})` : "rgba(109, 246, 213, 0.36)";
    ctx.strokeRect(pipX, y, pipW, pipH);
    if (i < player.charge) {
      ctx.fillStyle = "#6df6d5";
      ctx.fillRect(pipX + 3, y + 3, pipW - 6, pipH - 6);
      if (i < minimumEnergy()) {
        const layer = currentStreakLayer();
        ctx.save();
        const lockColor = layer ? layer.color : "#ffd166";
        const lockX = pipX + pipW / 2;
        const lockY = y + pipH / 2 + 1;
        ctx.strokeStyle = "#071014";
        ctx.fillStyle = lockColor;
        ctx.shadowColor = lockColor;
        ctx.shadowBlur = 7;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(lockX - 7, lockY - 1, 14, 8, 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lockX, lockY - 1, 5, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#071014";
        ctx.font = "950 8px ui-monospace, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(layer ? layer.grade : "A", lockX, lockY + 3);
        ctx.restore();
      }
    } else if (cuePulse > 0) {
      ctx.globalAlpha = cuePulse * (0.28 + Math.sin(elapsed * 28 + i) * 0.12);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(pipX + 3, y + 3, pipW - 6, pipH - 6);
      ctx.globalAlpha = 1;
    }
  }
}

function drawPowerupInventory() {
  const slots = inventorySlotCount();
  const stored = player.inventory || [];
  const x = 24;
  const y = HEIGHT - 84;
  const size = 20;
  const gap = 7;
  const lockLetters = ["", "B", "A", "S"];
  const lockColors = ["", "#ffd166", "#ff8c42", "#ff5b74"];

  ctx.save();
  ctx.font = "900 10px ui-monospace, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 4; i += 1) {
    const slotX = x + i * (size + gap);
    const unlocked = i < slots;
    const type = stored[i];
    const info = type ? powerupInfo[type] || powerupInfo.shotgun : null;
    const justUnlocked = inventoryUnlockFlash > 0 && i === lastInventorySlotCount - 1;
    const flash = justUnlocked ? clamp(inventoryUnlockFlash / 0.75, 0, 1) : 0;
    ctx.fillStyle = unlocked ? "rgba(7, 16, 20, 0.42)" : "rgba(7, 16, 20, 0.20)";
    ctx.strokeStyle = unlocked
      ? `rgba(237, 247, 245, ${0.22 + flash * 0.42})`
      : "rgba(237, 247, 245, 0.11)";
    ctx.shadowColor = flash > 0 ? (lockColors[i] || "#edf7f5") : "transparent";
    ctx.shadowBlur = flash * 16;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(slotX, y, size, size, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (!unlocked) {
      ctx.fillStyle = lockColors[i] || "rgba(237, 247, 245, 0.34)";
      ctx.globalAlpha = 0.52;
      ctx.fillText(lockLetters[i] || "", slotX + size / 2, y + size / 2 + 0.5);
      ctx.globalAlpha = 1;
      continue;
    }
    if (!info) continue;
    ctx.save();
    ctx.translate(slotX + size / 2, y + size / 2);
    ctx.fillStyle = info.color;
    ctx.shadowColor = info.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    if (info.slot === "main") {
      ctx.moveTo(0, -8);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 8);
      ctx.lineTo(-8, 0);
      ctx.closePath();
    } else {
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#071014";
    ctx.fillText(info.letter, 0, 0.5);
    ctx.restore();
  }
  ctx.restore();
}

function drawTopScore() {
  const value = Math.round(score).toLocaleString();
  ctx.save();
  ctx.translate(WIDTH / 2, 24);
  ctx.fillStyle = "rgba(7, 16, 20, 0.48)";
  ctx.strokeStyle = "rgba(237, 247, 245, 0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-78, -15, 156, 30, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#91a4a0";
  ctx.font = "800 9px ui-monospace, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SCORE", 0, -6);

  ctx.fillStyle = "#edf7f5";
  ctx.shadowColor = "#6df6d5";
  ctx.shadowBlur = 8;
  ctx.font = "900 17px ui-monospace, Consolas, monospace";
  ctx.fillText(value, 0, 8);
  ctx.restore();
}

function drawStreakAura() {
  if (!player || streakCharge <= 0) return;
  const pulse = 0.5 + Math.sin(elapsed * 12) * 0.5;
  const level = currentStreakLevel();
  const progress = currentStreakProgress();
  const activeLayer = currentStreakLayer();
  const intensity = clamp((level - 1 + progress) / STREAK_LAYERS.length, 0.08, 1);
  const tailLength = 14 + intensity * 18;
  const tailWidth = 5 + intensity * 8;
  const flicker = 0.86 + pulse * 0.18;
  const color = activeLayer ? activeLayer.color : "#6df6d5";

  ctx.save();
  playerTrail.forEach((trail) => {
    const fade = clamp(trail.life / trail.maxLife, 0, 1);
    const angle = Math.atan2(trail.vy, trail.vx);
    ctx.save();
    ctx.translate(trail.x, trail.y);
    ctx.rotate(angle);
    ctx.globalAlpha = fade * 0.28;
    ctx.fillStyle = trail.color;
    ctx.shadowColor = trail.color;
    ctx.shadowBlur = 8 + fade * 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, trail.size * (0.7 + fade), trail.size * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.translate(player.x, player.y);

  const gradient = ctx.createLinearGradient(0, 6, 0, tailLength);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.48, color);
  gradient.addColorStop(1, "rgba(7, 16, 20, 0)");
  ctx.globalAlpha = 0.16 + intensity * 0.26;
  ctx.fillStyle = gradient;
  ctx.shadowColor = color;
  ctx.shadowBlur = 9 + intensity * 16;
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(tailWidth * 0.52 * flicker, 15, tailWidth * 0.42, tailLength * 0.52, 3 + pulse * 2, tailLength);
  ctx.bezierCurveTo(0, tailLength + 6 + pulse * 4, -3 - pulse * 2, tailLength, -tailWidth * 0.42, tailLength * 0.52);
  ctx.bezierCurveTo(-tailWidth * 0.52 * flicker, 15, 0, 6, 0, 6);
  ctx.fill();

  if (activeLayer) {
    const sparkCount = Math.max(1, Math.min(4, level));
    for (let i = 0; i < sparkCount; i += 1) {
      const travel = (elapsed * (1.8 + i * 0.16) + i / sparkCount) % 1;
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (3 + intensity * 5) * Math.sin(travel * Math.PI);
      const y = 10 + travel * tailLength;
      ctx.globalAlpha = (1 - travel) * (0.22 + intensity * 0.28);
      drawSparkMarker(x, y, activeLayer.color, 0.22 + intensity * 0.16, elapsed * (2.4 + i), pulse);
    }

  }
  ctx.restore();
}

function drawUltimateCue() {
  if (!ultimateCue || !player) return;
  const age = 1 - clamp(ultimateCue.life / ultimateCue.maxLife, 0, 1);
  const windup = clamp(1 - ultimateCue.timer / ULTIMATE_CUE_DURATION, 0, 1);
  const alpha = clamp(ultimateCue.life / ultimateCue.maxLife, 0, 1);
  const radius = 22 + windup * 44 + age * 34;
  const pulse = 0.5 + Math.sin(elapsed * 34) * 0.5;

  ctx.save();
  ctx.translate(ultimateCue.x, ultimateCue.y);
  ctx.globalAlpha = 0.18 + alpha * 0.38;
  ctx.strokeStyle = ultimateCue.color;
  ctx.shadowColor = ultimateCue.color;
  ctx.shadowBlur = 12 + pulse * 14;
  ctx.lineWidth = 2.5 + windup * 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, radius + i * 13, elapsed * (1.8 + i * 0.2), Math.PI * 1.5 + elapsed * (1.8 + i * 0.2));
    ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.fillStyle = ultimateCue.color;
  ctx.font = "900 16px ui-monospace, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.shadowBlur = 10;
  ctx.fillText(ultimateCue.label, 0, -48 - pulse * 5);
  ctx.restore();
}

function drawShieldLayer(drone) {
  if (!drone.maxShield || drone.shield <= 0) return;
  const pulse = 0.5 + Math.sin(elapsed * 14 + drone.x * 0.02) * 0.5;
  ctx.save();
  ctx.translate(drone.x, drone.y);
  ctx.globalAlpha = clamp(drone.shield / drone.maxShield, 0.18, 0.55) + (drone.shieldFlash || 0) * 0.9;
  ctx.strokeStyle = SHIELD_COLOR;
  ctx.shadowColor = SHIELD_COLOR;
  ctx.shadowBlur = 12 + pulse * 8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, drone.r + 8 + pulse * 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFrenzyEffect(drone) {
  if (!isFrenziedEnemy(drone)) return;
  const pulse = 0.5 + Math.sin(elapsed * 18 + drone.x * 0.03) * 0.5;
  ctx.save();
  ctx.translate(drone.x, drone.y);
  ctx.globalAlpha = 0.18 + pulse * 0.16;
  ctx.strokeStyle = "#ff5b74";
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 10 + pulse * 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, drone.r + 12 + pulse * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#ff5b74";
  ctx.beginPath();
  ctx.arc(0, 0, drone.r + 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerFrenzyCue() {
  if (!isPlayerFrenzied()) return;
  const pulse = 0.5 + Math.sin(elapsed * 24) * 0.5;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalAlpha = 0.22 + pulse * 0.16;
  ctx.strokeStyle = FRENZY_AURA_COLOR;
  ctx.shadowColor = FRENZY_AURA_COLOR;
  ctx.shadowBlur = 12 + pulse * 12;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, player.r + 15 + pulse * 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = FRENZY_AURA_COLOR;
  ctx.font = "900 10px ui-monospace, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FRENZY", 0, -34);
  ctx.restore();
}

function drawSuppressionEffect(drone) {
  if ((!drone.suppressed || drone.suppressed <= 0) && (!drone.slowTimer || drone.slowTimer <= 0)) return;
  const pulse = 0.5 + Math.sin(elapsed * 28 + drone.x) * 0.5;
  ctx.save();
  ctx.translate(drone.x, drone.y);
  ctx.globalAlpha = clamp(Math.max(drone.suppressed || 0, drone.slowTimer || 0) / 0.85, 0.18, 0.72);
  ctx.strokeStyle = "#ff5b74";
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 8 + pulse * 8;
  ctx.lineWidth = 2 + pulse;
  ctx.beginPath();
  ctx.arc(0, 0, drone.r + 11 + pulse * 3, -Math.PI * 0.2, Math.PI * 1.35);
  ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i += 1) {
    const y = i * 6;
    ctx.beginPath();
    ctx.moveTo(-drone.r - 8, y - 3);
    ctx.lineTo(-drone.r - 1, y + 3);
    ctx.moveTo(drone.r + 1, y - 3);
    ctx.lineTo(drone.r + 8, y + 3);
    ctx.stroke();
  }
  if (drone.slowTimer > 0) {
    ctx.globalAlpha = 0.35 + pulse * 0.2;
    ctx.lineWidth = 1.6;
    for (let i = -2; i <= 2; i += 1) {
      const y = drone.r + 8 + i * 3;
      ctx.beginPath();
      ctx.moveTo(-drone.r - 10 + Math.abs(i) * 3, y);
      ctx.lineTo(drone.r + 10 - Math.abs(i) * 3, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawShieldTransfers() {
  ctx.save();
  shieldTransfers.forEach((transfer) => {
    if (!transfer.to || transfer.to.hp <= 0) return;
    const progress = 1 - clamp(transfer.life / transfer.maxLife, 0, 1);
    const alpha = clamp(transfer.life / transfer.maxLife, 0, 1);
    const midX = transfer.fromX + (transfer.to.x - transfer.fromX) * progress;
    const midY = transfer.fromY + (transfer.to.y - transfer.fromY) * progress;
    ctx.globalAlpha = alpha * 0.55;
    ctx.strokeStyle = SHIELD_COLOR;
    ctx.shadowColor = SHIELD_COLOR;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(transfer.fromX, transfer.fromY);
    ctx.quadraticCurveTo((transfer.fromX + transfer.to.x) / 2, transfer.fromY - 42, transfer.to.x, transfer.to.y);
    ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#edf7f5";
    ctx.beginPath();
    ctx.arc(midX, midY, 5 + progress * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function applyDroneImpactTransform(drone) {
  const squash = drone.impactSquash || 0;
  if (squash <= 0) return;
  const t = clamp(squash, 0, 0.24);
  ctx.rotate(drone.impactAngle || 0);
  ctx.scale(1 - t, 1 + t * 0.62);
  ctx.rotate(-(drone.impactAngle || 0));
}

function drawDrone(drone) {
  if (drone.type === "mothership") {
    drawMothership(drone);
    return;
  }
  if (drone.type === "jet") {
    drawFighterJet(drone);
    return;
  }
  if (drone.type === "ufo") {
    drawUfo(drone);
    return;
  }
  if (drone.type === "cargo") {
    drawCargoShip(drone);
    return;
  }
  if (drone.type === "splitter") {
    drawSplitter(drone);
    return;
  }
  if (drone.type === "mine") {
    drawMine(drone);
    return;
  }
  drawShieldLayer(drone);
  drawFrenzyEffect(drone);
  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  ctx.rotate(angleTowardPlayer(drone));

  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : isFrenziedEnemy(drone) ? "#d94a42" : "#ff8c42";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(4, -15);
  ctx.lineTo(-18, -10);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-18, 10);
  ctx.lineTo(4, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-7, -5, 12, 10);
  ctx.fillStyle = "#ff5b74";
  ctx.beginPath();
  ctx.arc(14, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawDefenseMeters(drone, drone.x, drone.y + 22, 36);
  drawSuppressionEffect(drone);
}

function drawMine(drone) {
  const pulse = 0.5 + Math.sin(elapsed * 8 + drone.wobble) * 0.5;
  const armed = drone.mineState === "armed";
  const arming = drone.mineState === "arming";
  const incoming = drone.mineState === "incoming";
  const armingRatio = arming ? 1 - clamp((drone.armingTimer || 0) / (drone.armingMax || 0.58), 0, 1) : armed ? 1 : 0;
  const mineColor = armed ? "#ff5b74" : arming ? "#ffd166" : "#7b3038";
  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  ctx.rotate(drone.spin || 0);
  ctx.globalAlpha = incoming ? 0.24 : 0.16 + pulse * 0.12 + armingRatio * 0.1;
  ctx.strokeStyle = mineColor;
  ctx.shadowColor = mineColor;
  ctx.shadowBlur = incoming ? 4 : 12 + pulse * 10 + armingRatio * 8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, drone.r + 7 + pulse * 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : incoming ? "#202326" : "#2f3038";
  ctx.strokeStyle = "#071014";
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, drone.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = mineColor;
  ctx.shadowColor = mineColor;
  ctx.shadowBlur = incoming ? 3 : 8 + pulse * 8;
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * (drone.r - 2), Math.sin(angle) * (drone.r - 2));
    ctx.lineTo(Math.cos(angle) * (drone.r + 8), Math.sin(angle) * (drone.r + 8));
    ctx.stroke();
  }

  if (arming) {
    ctx.globalAlpha = 0.35 + armingRatio * 0.45;
    ctx.strokeStyle = "#ffd166";
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, drone.r + 13 + armingRatio * 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = incoming ? 0.42 : 1;
  ctx.fillStyle = armed ? "#ffd166" : arming ? "#edf7f5" : "#7b3038";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = incoming ? 3 : 8;
  ctx.beginPath();
  ctx.arc(0, 0, 5 + pulse * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (!armed) {
    ctx.save();
    ctx.globalAlpha = incoming ? 0.42 : 0.72;
    ctx.fillStyle = arming ? "#ffd166" : "#91a4a0";
    ctx.font = "800 8px ui-monospace, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(arming ? "ARMING" : "SAFE", drone.x, drone.y + drone.r + 16);
    ctx.restore();
  } else {
    drawDefenseMeters(drone, drone.x, drone.y + drone.r + 12, 34);
  }
}

function drawFighterJet(drone) {
  const lockActive = drone.lockX !== null && drone.burstShots <= 0 && drone.cooldown <= 0;
  if (lockActive) {
    const lockProgress = clamp(1 - drone.lockTimer / drone.lockMax, 0, 1);
    const pulse = 0.5 + Math.sin(elapsed * (10 + lockProgress * 18)) * 0.5;
    ctx.save();
    ctx.globalAlpha = 0.28 + lockProgress * 0.38;
    ctx.strokeStyle = lockProgress > 0.72 ? "#ff5b74" : "#ffd166";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10 + lockProgress * 14;
    ctx.lineWidth = 1.5 + lockProgress * 1.5;
    ctx.beginPath();
    ctx.moveTo(drone.x, drone.y + 14);
    ctx.lineTo(drone.lockX, drone.lockY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(drone.lockX, drone.lockY, 12 + pulse * 5 + lockProgress * 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(drone.lockX - 20, drone.lockY);
    ctx.lineTo(drone.lockX + 20, drone.lockY);
    ctx.moveTo(drone.lockX, drone.lockY - 20);
    ctx.lineTo(drone.lockX, drone.lockY + 20);
    ctx.stroke();
    ctx.restore();
  }

  drawShieldLayer(drone);
  drawFrenzyEffect(drone);
  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  ctx.rotate(angleTowardPlayer(drone, Math.PI / 2));
  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : isFrenziedEnemy(drone) ? "#efa2a0" : "#d7e4ee";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.lineTo(13, 3);
  ctx.lineTo(30, -2);
  ctx.lineTo(10, -8);
  ctx.lineTo(0, -22);
  ctx.lineTo(-10, -8);
  ctx.lineTo(-30, -2);
  ctx.lineTo(-13, 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ff5b74";
  ctx.fillRect(-5, -4, 10, 16);
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(-8, 10, 3, 0, Math.PI * 2);
  ctx.arc(8, 10, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (lockActive) {
    const lockProgress = clamp(1 - drone.lockTimer / drone.lockMax, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = lockProgress > 0.72 ? "#ff5b74" : "#ffd166";
    ctx.font = "800 10px ui-monospace, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText("LOCK", drone.x, drone.y - drone.r - 16);
    ctx.restore();
  }
  drawDefenseMeters(drone, drone.x, drone.y + 25, 40);
  drawSuppressionEffect(drone);
}

function drawUfo(drone) {
  drawShieldLayer(drone);
  drawFrenzyEffect(drone);
  const firingPose = drone.phase === "firing";
  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  ctx.rotate(firingPose ? Math.sin(elapsed * 4.5) * 0.035 : drone.spin || 0);
  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : isFrenziedEnemy(drone) ? "#c9577c" : "#8a7dff";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 4, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#6df6d5";
  ctx.beginPath();
  ctx.ellipse(0, -3, 15, 9, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 18, 5 + Math.sin(angle) * 5, 2.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ff5b74";
  ctx.beginPath();
  ctx.arc(0, 7, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawDefenseMeters(drone, drone.x, drone.y + 22, 44);
  drawSuppressionEffect(drone);
}

function drawCargoShip(drone) {
  drawShieldLayer(drone);
  drawFrenzyEffect(drone);
  const fleeing = Boolean(drone.fleeing);
  const fleePulse = 0.5 + Math.sin(elapsed * 16) * 0.5;
  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  const facingLeft = fleeing ? (drone.escapeDir || drone.vx) < 0 : drone.vx < 0;
  ctx.rotate(facingLeft ? Math.PI : 0);
  if (fleeing) {
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 10 + fleePulse * 10;
  }
  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : fleeing ? "#b86e32" : isFrenziedEnemy(drone) ? "#9d4e42" : "#8b5e2f";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(14, -20);
  ctx.lineTo(-20, -18);
  ctx.lineTo(-30, -8);
  ctx.lineTo(-30, 8);
  ctx.lineTo(-20, 18);
  ctx.lineTo(14, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = drone.armorFlash > 0 ? "#edf7f5" : "#ffd166";
  for (let i = -1; i <= 1; i += 1) {
    ctx.fillRect(-14 + i * 13, -10, 9, 8);
    ctx.fillRect(-14 + i * 13, 3, 9, 8);
  }
  ctx.fillStyle = "#ff5b74";
  ctx.beginPath();
  ctx.arc(20, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  if (fleeing) {
    ctx.fillStyle = "#ffd166";
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(-32, -7, 7 + fleePulse * 3, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(-32, 7, 7 + fleePulse * 3, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawDefenseMeters(drone, drone.x, drone.y + 28, 58);
  drawSuppressionEffect(drone);
}

function drawSplitter(drone) {
  drawShieldLayer(drone);
  drawFrenzyEffect(drone);
  const stats = splitterStats(drone.splitterTier || "L");
  const scale = drone.r / 22;
  const pulse = 0.5 + Math.sin(elapsed * 7 + drone.wobble) * 0.5;
  const birth = clamp((drone.splitBirth || 0) / 0.42, 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.16 + pulse * 0.12 + birth * 0.28;
  ctx.strokeStyle = "#ff5b74";
  ctx.shadowColor = stats.color;
  ctx.shadowBlur = 16 + pulse * 10 + birth * 18;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(drone.x, drone.y, drone.r + 9 + pulse * 4 + birth * 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(drone.x, drone.y);
  applyDroneImpactTransform(drone);
  ctx.rotate(angleTowardPlayer(drone) + Math.sin(drone.wobble) * 0.08);
  ctx.scale(scale, scale);
  ctx.fillStyle = drone.flash > 0 ? "#edf7f5" : isFrenziedEnemy(drone) ? "#d83f56" : stats.color;
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(8, -18);
  ctx.lineTo(-6, -9);
  ctx.lineTo(-21, -16);
  ctx.lineTo(-13, 0);
  ctx.lineTo(-21, 16);
  ctx.lineTo(-6, 9);
  ctx.lineTo(8, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#ff5b74";
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 8 + pulse * 8 + birth * 8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-7, -10);
  ctx.lineTo(1, -2);
  ctx.lineTo(-3, 9);
  ctx.moveTo(6, -13);
  ctx.lineTo(10, 0);
  ctx.lineTo(3, 12);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ffd166";
  ctx.font = "900 8px ui-monospace, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(stats.tier, -7, 0);
  ctx.beginPath();
  ctx.arc(12, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawDefenseMeters(drone, drone.x, drone.y + drone.r + 3, Math.max(28, drone.r * 1.9));
  drawSuppressionEffect(drone);
}

function drawMothership(drone) {
  const entry = planetEntryProgress(drone);
  const style = drone.planetStyle || PLANET_PALETTES[0];
  ctx.save();
  const hitShake = drone.hitShake || 0;
  ctx.translate(drone.x + rand(-4, 4) * hitShake * 10, drone.y + rand(-4, 4) * hitShake * 10);
  const planetScale = drone.r / 42;
  ctx.scale(planetScale, planetScale);
  ctx.globalAlpha = 0.45 + entry * 0.55;

  const planetGradient = ctx.createRadialGradient(-16, -18, 6, 0, 0, 48);
  planetGradient.addColorStop(0, drone.flash > 0 ? "#edf7f5" : style.light);
  planetGradient.addColorStop(0.38, drone.flash > 0 ? "#edf7f5" : style.mid);
  planetGradient.addColorStop(1, drone.flash > 0 ? "#edf7f5" : style.dark);
  ctx.fillStyle = planetGradient;
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.rotate(drone.rotation || 0);
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.78;
  ctx.strokeStyle = style.band;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(-4, -10 + (style.bandOffset || 0) * 40, 56, 13, style.bandTilt || -0.14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(2, 13 + (style.bandOffset || 0) * 24, 48, 9, -(style.bandTilt || 0.12), 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.42;
  ctx.strokeStyle = style.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(-10, 4, 42, 7, (style.bandTilt || 0) - 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#071014";
  ctx.globalAlpha = style.craterAlpha || 0.38;
  ctx.save();
  ctx.rotate(drone.rotation || 0);
  (style.craters || []).forEach((crater) => {
    ctx.beginPath();
    ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  ctx.globalAlpha = 1;

  const ringPulse = 0.5 + Math.sin(elapsed * 5.4) * 0.5;
  ctx.save();
  ctx.rotate((style.ringTilt || -0.18) + (drone.rotation || 0) * 0.16);
  ctx.globalAlpha = 0.72;
  ctx.strokeStyle = FRENZY_AURA_COLOR;
  ctx.shadowColor = FRENZY_AURA_COLOR;
  ctx.shadowBlur = 12 + ringPulse * 10;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, 0, 66, 18, 0, (style.ringPhase || 0) + Math.PI * 0.08, (style.ringPhase || 0) + Math.PI * 1.18);
  ctx.stroke();
  ctx.globalAlpha = 0.34;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 72, 22, 0, (style.ringPhase || 0) + Math.PI * 1.08, (style.ringPhase || 0) + Math.PI * 2.08);
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  ctx.save();
  const pulse = 0.5 + Math.sin(elapsed * 4.5) * 0.5;
  const auraRadius = MOTHERSHIP_FRENZY_RADIUS * (0.22 + entry * 0.78);
  ctx.globalAlpha = (0.045 + pulse * 0.035) * entry;
  ctx.fillStyle = FRENZY_AURA_COLOR;
  ctx.beginPath();
  ctx.arc(drone.x, drone.y, auraRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = (0.16 + pulse * 0.09) * entry;
  ctx.strokeStyle = FRENZY_AURA_COLOR;
  ctx.shadowColor = FRENZY_AURA_COLOR;
  ctx.shadowBlur = (5 + pulse * 5) * entry;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(drone.x, drone.y, auraRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.42 * entry;
  ctx.fillStyle = FRENZY_AURA_COLOR;
  ctx.font = "700 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(drone.name || "Planet Unknown", drone.x, drone.y + drone.r + 18);
  ctx.restore();
}

function drawBoss() {
  if (!boss) return;
  ctx.save();
  ctx.translate(boss.x, boss.y);
  const flash = boss.flash > 0;
  const hullGradient = ctx.createLinearGradient(0, -86, 0, 92);
  hullGradient.addColorStop(0, flash ? "#edf7f5" : "#51545f");
  hullGradient.addColorStop(0.42, flash ? "#edf7f5" : "#2f3038");
  hullGradient.addColorStop(1, flash ? "#edf7f5" : "#161b22");
  ctx.shadowColor = flash ? "#edf7f5" : "#ff5b74";
  ctx.shadowBlur = flash ? 18 : 8;
  ctx.fillStyle = hullGradient;
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -78);
  ctx.lineTo(78, -34);
  ctx.lineTo(96, 42);
  ctx.lineTo(44, 88);
  ctx.lineTo(-44, 88);
  ctx.lineTo(-96, 42);
  ctx.lineTo(-78, -34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#202832";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 3;
  [
    [-54, -40, -18, 82],
    [54, -40, 18, 82],
  ].forEach(([x, y, lean, h]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lean, y + h * 0.38);
    ctx.lineTo(x + lean * 0.45, y + h);
    ctx.lineTo(x - lean * 0.45, y + h * 0.76);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.strokeStyle = "#596773";
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.72;
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(side * 18, -58);
    ctx.lineTo(side * 52, -30);
    ctx.lineTo(side * 64, 38);
    ctx.lineTo(side * 28, 72);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 34, -18);
    ctx.lineTo(side * 74, 12);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#111820";
  ctx.strokeStyle = "#6df6d5";
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.68;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.rect(i * 14 - 3, -57, 6, 24);
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const corePulse = 0.5 + Math.sin(elapsed * 5.5) * 0.5;
  const coreGradient = ctx.createRadialGradient(0, 8, 4, 0, 10, 56);
  coreGradient.addColorStop(0, flash ? "#edf7f5" : "#ffd166");
  coreGradient.addColorStop(0.34, "#ff5b74");
  coreGradient.addColorStop(1, "#551c2a");
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 16 + corePulse * 10;
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.ellipse(0, 12, 38, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.55 + corePulse * 0.25;
  ctx.beginPath();
  ctx.ellipse(0, 12, 24, 35, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -37);
  ctx.lineTo(0, 66);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#ff8c42";
  ctx.shadowColor = "#ff8c42";
  ctx.shadowBlur = 12;
  [-28, 0, 28].forEach((x) => {
    ctx.beginPath();
    ctx.ellipse(x, 84, 7, 13 + corePulse * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  boss.parts.forEach((part) => {
    ctx.save();
    ctx.translate(part.offsetX, part.offsetY);
    const charge = part.alive ? clamp(1 - (part.fireTimer || 0) / 0.42, 0, 1) : 0;
    ctx.globalAlpha = part.alive ? 1 : 0.28;
    ctx.shadowColor = charge > 0 ? "#ffd166" : "transparent";
    ctx.shadowBlur = charge * 16;
    ctx.fillStyle = !part.alive ? "#33414a" : part.flash > 0 ? "#edf7f5" : "#414b54";
    ctx.strokeStyle = "#071014";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(-21, -17, 42, 34);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = part.alive ? "#ffd166" : "#1d252c";
    ctx.fillRect(-14, -10, 28, 8);
    ctx.fillStyle = part.alive ? "#ff8c42" : "#222b33";
    ctx.fillRect(-8, 10, 16, 28);
    ctx.fillStyle = part.alive ? "#071014" : "#13191f";
    ctx.fillRect(-4, 14, 8, 22);
    ctx.fillStyle = part.alive ? `rgba(255, 209, 102, ${0.22 + charge * 0.64})` : "rgba(7, 16, 20, 0.4)";
    ctx.beginPath();
    ctx.arc(0, 0, 10 + charge * 3, 0, Math.PI * 2);
    ctx.fill();
    if (!part.alive) {
      ctx.strokeStyle = "#ff5b74";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-13, -7);
      ctx.lineTo(10, 11);
      ctx.moveTo(8, -10);
      ctx.lineTo(-5, 15);
      ctx.stroke();
    }
    ctx.restore();
  });
  ctx.restore();

  boss.parts.forEach((part) => {
    if (!part.alive) return;
    drawBar(boss.x + part.offsetX - 22, boss.y + part.offsetY + 28, 44, 4, part.hp, part.maxHp, "#ffd166");
  });
  const bossHudY = 54;
  drawBar(WIDTH / 2 - 150, bossHudY + 12, 300, 9, boss.hp, boss.maxHp, bossCannonsAlive() ? "#ff8c42" : "#ff5b74");
  drawArmorPips(WIDTH / 2, bossHudY + 25, boss.armor || 0, boss.maxArmor || 0, boss.armorFlash || 0);
  ctx.save();
  ctx.fillStyle = "#edf7f5";
  ctx.font = "800 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(bossCannonsAlive() ? "CANNON WARDEN - BREAK CANNONS" : "CANNON WARDEN - TORSO EXPOSED", WIDTH / 2, bossHudY + 7);
  ctx.restore();
}

function drawFloatingTexts() {
  ctx.save();
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  floatingTexts.forEach((text) => {
    ctx.globalAlpha = clamp(text.life / text.maxLife, 0, 1);
    ctx.fillStyle = text.color;
    if (text.scoreMultiplier) {
      ctx.font = "800 18px system-ui, sans-serif";
      const mainWidth = ctx.measureText(text.text).width;
      const suffix = ` ${text.scoreMultiplier}`;
      ctx.fillText(text.text, text.x - 9, text.y);
      ctx.font = "800 11px system-ui, sans-serif";
      ctx.fillStyle = "#ffd166";
      ctx.fillText(suffix, text.x - 9 + mainWidth / 2 + 12, text.y + 2);
    } else if (text.suffix) {
      ctx.font = "800 18px system-ui, sans-serif";
      const mainWidth = ctx.measureText(text.text).width;
      ctx.fillText(text.text, text.x - 12, text.y);
      ctx.font = "800 10px system-ui, sans-serif";
      ctx.fillStyle = text.suffixColor;
      ctx.fillText(` ${text.suffix}`, text.x - 12 + mainWidth / 2 + 28, text.y + 3);
    } else {
      ctx.font = "700 18px system-ui, sans-serif";
      ctx.fillText(text.text, text.x, text.y);
    }
  });
  ctx.restore();
}

function drawPowerup(powerup) {
  const pulse = Math.sin(powerup.pulse) * 3;
  const info = powerupInfo[powerup.type] || powerupInfo.shotgun;
  const color = info.color;
  const isMain = info.slot === "main";
  const lockedRatio = clamp((powerup.collectDelay || 0) / 0.85, 0, 1);
  ctx.save();
  ctx.translate(powerup.x, powerup.y);
  if (lockedRatio > 0) {
    ctx.globalAlpha = 0.42 + (1 - lockedRatio) * 0.42;
  }
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (isMain) {
    ctx.rect(-20 - pulse, -20 - pulse, 40 + pulse * 2, 40 + pulse * 2);
  } else {
    ctx.arc(0, 0, 21 + pulse, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.save();
  ctx.rotate(isMain ? Math.PI / 4 + powerup.pulse * 0.35 : powerup.pulse * 0.7);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (isMain) {
    ctx.moveTo(0, -18 - pulse);
    ctx.lineTo(18 + pulse, 0);
    ctx.lineTo(0, 18 + pulse);
    ctx.lineTo(-18 - pulse, 0);
    ctx.closePath();
  } else {
    ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  if (!isMain) {
    ctx.strokeStyle = "#edf7f5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 7 + pulse * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  if (!isMain) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i += 1) {
      const angle = powerup.pulse * 1.2 + i * Math.PI;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 20, Math.sin(angle) * 20, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#071014";
  ctx.font = "900 19px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(info.letter, 0, 1);
  if (lockedRatio > 0) {
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "#edf7f5";
    ctx.shadowColor = "#edf7f5";
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 25 - lockedRatio * 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - lockedRatio));
    ctx.stroke();
  }
  ctx.restore();
}

function drawMissile(missile) {
  const angle = Math.atan2(missile.vy, missile.vx) + Math.PI / 2;
  ctx.save();
  ctx.translate(missile.x, missile.y);
  ctx.rotate(angle);
  ctx.fillStyle = "#8a7dff";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.lineTo(7, 8);
  ctx.lineTo(0, 4);
  ctx.lineTo(-7, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-3, 7, 6, 7);
  ctx.restore();
}

function drawSupportShip(ship) {
  const angle = Math.atan2(ship.vy, ship.vx) + Math.PI / 2;
  const fade = clamp(ship.life / ship.maxLife, 0, 1);
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(angle);
  ctx.globalAlpha = clamp(fade * 1.25, 0, 1);
  ctx.shadowColor = "#8a7dff";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#2b2750";
  ctx.strokeStyle = "#edf7f5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(13, 10);
  ctx.lineTo(4, 6);
  ctx.lineTo(0, 17);
  ctx.lineTo(-4, 6);
  ctx.lineTo(-13, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8a7dff";
  ctx.beginPath();
  ctx.arc(0, -4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-8, 9, 4, 7);
  ctx.fillRect(4, 9, 4, 7);
  ctx.restore();
}

function drawSupportPathLane(lane) {
  const t = clamp(lane.life / lane.maxLife, 0, 1);
  const intro = clamp((lane.maxLife - lane.life) / 0.34, 0, 1);
  const alpha = Math.min(intro, t) * 0.2;
  const dx = lane.x2 - lane.x1;
  const dy = lane.y2 - lane.y1;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);
  const pulse = (Math.sin(lane.phase) + 1) * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(lane.x1, lane.y1);
  ctx.rotate(angle);
  ctx.strokeStyle = lane.color;
  ctx.lineWidth = lane.width;
  ctx.globalAlpha = alpha;
  ctx.setLineDash([18, 18]);
  ctx.lineDashOffset = -lane.phase * 10;
  ctx.shadowColor = lane.color;
  ctx.shadowBlur = 8 + pulse * 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.45;
  ctx.lineWidth = lane.width + 5;
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.restore();
}

function drawMuzzleBlasts() {
  muzzleBlasts.forEach((blast) => {
    const t = clamp(blast.life / blast.maxLife, 0, 1);
    const size = blast.size || 1;
    ctx.save();
    ctx.translate(blast.x, blast.y);
    ctx.rotate((blast.angle || -Math.PI / 2) + Math.PI / 2);
    ctx.shadowColor = blast.color;
    ctx.shadowBlur = 8 * size;
    if (blast.type === "cone") {
      ctx.globalAlpha = t * 0.48;
      ctx.fillStyle = blast.color;
      ctx.beginPath();
      ctx.moveTo(0, 8 * size);
      ctx.lineTo(-42 * size * (1 - t * 0.15), -58 * size);
      ctx.lineTo(42 * size * (1 - t * 0.15), -58 * size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = t * 0.78;
      ctx.fillStyle = blast.coreColor;
      ctx.beginPath();
      ctx.moveTo(0, 4 * size);
      ctx.lineTo(-15 * size, -36 * size);
      ctx.lineTo(15 * size, -36 * size);
      ctx.closePath();
      ctx.fill();
    } else if (blast.type === "laser") {
      ctx.globalAlpha = t * 0.62;
      ctx.strokeStyle = blast.color;
      ctx.lineWidth = 3 * size;
      ctx.beginPath();
      ctx.arc(0, 0, (9 + (1 - t) * 9) * size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = t * 0.2;
      ctx.fillStyle = blast.color;
      ctx.beginPath();
      ctx.moveTo(0, 7 * size);
      ctx.lineTo(-11 * size, -52 * size);
      ctx.lineTo(11 * size, -52 * size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = t * 0.76;
      ctx.fillStyle = blast.coreColor;
      ctx.fillRect(-5 * size, -25 * size, 10 * size, 29 * size);
    } else if (blast.type === "danger") {
      const grow = 1 - t;
      ctx.globalAlpha = t * 0.2;
      ctx.fillStyle = blast.color;
      ctx.beginPath();
      ctx.moveTo(0, 9 * size);
      ctx.lineTo(-12 * size, -36 * size);
      ctx.lineTo(12 * size, -36 * size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = t * 0.62;
      ctx.strokeStyle = blast.color;
      ctx.lineWidth = 2 * size;
      ctx.beginPath();
      ctx.arc(0, 0, (8 + grow * 8) * size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = t * 0.86;
      ctx.fillStyle = blast.coreColor;
      ctx.beginPath();
      ctx.arc(0, 0, 3.5 * size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = blast.coreColor;
      ctx.lineWidth = 1.5 * size;
      ctx.beginPath();
      ctx.moveTo(0, 2 * size);
      ctx.lineTo(0, -28 * size);
      ctx.stroke();
    } else {
      ctx.globalAlpha = t * 0.62;
      ctx.fillStyle = blast.color;
      ctx.beginPath();
      ctx.arc(0, 0, (5 + (1 - t) * 6) * size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = blast.coreColor;
      ctx.fillRect(-2 * size, -16 * size, 4 * size, 17 * size);
      ctx.strokeStyle = blast.color;
      ctx.lineWidth = 1.5 * size;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -22 * size);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawNukeEffects() {
  nukeEffects.forEach((effect) => {
    const progress = 1 - clamp(effect.life / effect.maxLife, 0, 1);
    const alpha = clamp(effect.life / effect.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha * 0.38;
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = alpha * 0.95;
    ctx.strokeStyle = "#edf7f5";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 90 + progress * 760, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.72;
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 30 + progress * 980, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = "#ff5b74";
    ctx.lineWidth = 8;
    for (let i = 0; i < 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2 + progress * 0.5;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(effect.x + Math.cos(angle) * WIDTH, effect.y + Math.sin(angle) * WIDTH);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawMissileSplashEffects() {
  missileSplashEffects.forEach((effect) => {
    const t = clamp(effect.life / effect.maxLife, 0, 1);
    const progress = 1 - t;
    const radius = effect.radius * (0.35 + progress * 0.95);
    const color = effect.color || "#8a7dff";
    const ringColor = effect.ringColor || "#edf7f5";
    ctx.save();
    ctx.globalAlpha = t * 0.2;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = t * 0.72;
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.5 + progress * 2;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = t * 0.58;
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawCivilianShips() {
  civilianShips.forEach((ship) => {
    const alpha = clamp(ship.life / ship.maxLife, 0, 1) * 0.34;
    const size = ship.size || 1;
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle + Math.PI / 2);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = ship.color;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#242a2c";
    ctx.strokeStyle = "rgba(7, 16, 20, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -11 * size);
    ctx.lineTo(4.5 * size, 7 * size);
    ctx.lineTo(0, 4 * size);
    ctx.lineTo(-4.5 * size, 7 * size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ship.color;
    ctx.beginPath();
    ctx.moveTo(-2.5 * size, -1 * size);
    ctx.lineTo(-14 * size, 5 * size);
    ctx.lineTo(-2 * size, 4 * size);
    ctx.lineTo(2 * size, 4 * size);
    ctx.lineTo(14 * size, 5 * size);
    ctx.lineTo(2.5 * size, -1 * size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(237, 247, 245, 0.42)";
    ctx.beginPath();
    ctx.ellipse(0, -5 * size, 2.5 * size, 3.8 * size, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.46;
    ctx.strokeStyle = ship.color;
    ctx.shadowColor = ship.color;
    ctx.shadowBlur = 2;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1.5 * size, 7 * size);
    ctx.lineTo(-1.5 * size, 24 * size);
    ctx.moveTo(1.5 * size, 7 * size);
    ctx.lineTo(1.5 * size, 24 * size);
    ctx.stroke();
    ctx.restore();
  });
}

function drawPlayerDamageCue() {
  if (!player || playerDamagePulse <= 0) return;
  const t = clamp(playerDamagePulse / 0.34, 0, 1);
  const radius = 20 + (1 - t) * 42;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalAlpha = t * 0.82;
  ctx.strokeStyle = playerDamageKind === "laser" ? "#ffd166" : "#ff5b74";
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 18 * t;
  ctx.lineWidth = 3 + t * 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = t * 0.5;
  ctx.strokeStyle = "#edf7f5";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + (1 - t) * 0.6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 12, Math.sin(angle) * 12);
    ctx.lineTo(Math.cos(angle) * (radius + 12), Math.sin(angle) * (radius + 12));
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayerInvulnerability() {
  if (!player || player.invuln <= 0) return;
  const remaining = clamp(player.invuln / PLAYER_HIT_INVULN, 0, 1);
  const pulse = 0.5 + Math.sin(elapsed * 18) * 0.5;
  const radius = 26 + pulse * 3;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalAlpha = 0.18 + pulse * 0.1;
  ctx.fillStyle = "#6df6d5";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.86;
  ctx.strokeStyle = "#edf7f5";
  ctx.shadowColor = "#6df6d5";
  ctx.shadowBlur = 16;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remaining);
  ctx.stroke();
  ctx.globalAlpha = 0.58;
  ctx.strokeStyle = "#6df6d5";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, radius + 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#edf7f5";
  ctx.font = "700 10px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowBlur = 8;
  ctx.fillText("SAFE", 0, radius + 18);
  ctx.restore();
}

function drawPlayerHealCue() {
  if (!player || playerHealPulse <= 0) return;
  const t = clamp(playerHealPulse / 0.58, 0, 1);
  const progress = 1 - t;
  const pulse = 0.5 + Math.sin(elapsed * 22) * 0.5;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalAlpha = t * 0.82;
  ctx.strokeStyle = "#7cf7a8";
  ctx.shadowColor = "#7cf7a8";
  ctx.shadowBlur = 18 * t;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 22 + progress * 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = t * 0.62;
  ctx.strokeStyle = "#edf7f5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(7, 0);
  ctx.moveTo(0, -7);
  ctx.lineTo(0, 7);
  ctx.stroke();
  ctx.globalAlpha = t * 0.42;
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2 - progress * 1.8;
    const inner = 12 + pulse * 3;
    const outer = 36 + progress * 34;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayerDamageOverlay() {
  if (playerDamageFlash <= 0) return;
  const t = clamp(playerDamageFlash / (playerDamageKind === "laser" ? 0.42 : 0.34), 0, 1);
  ctx.save();
  ctx.globalAlpha = t * 0.16;
  ctx.fillStyle = playerDamageKind === "laser" ? "#ffd166" : "#ff5b74";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = t * 0.44;
  ctx.strokeStyle = "#ff5b74";
  ctx.lineWidth = 12 + t * 12;
  ctx.strokeRect(6, 6, WIDTH - 12, HEIGHT - 12);
  ctx.globalAlpha = t * 0.18;
  ctx.fillStyle = "#ff5b74";
  ctx.fillRect(0, 0, WIDTH, 22);
  ctx.fillRect(0, HEIGHT - 22, WIDTH, 22);
  ctx.restore();
}

function drawPlayerHealOverlay() {
  if (playerHealFlash <= 0) return;
  const t = clamp(playerHealFlash / 0.44, 0, 1);
  ctx.save();
  ctx.globalAlpha = t * 0.1;
  ctx.fillStyle = "#7cf7a8";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = t * 0.34;
  ctx.strokeStyle = "#7cf7a8";
  ctx.lineWidth = 8 + t * 8;
  ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);
  ctx.globalAlpha = t * 0.18;
  ctx.fillStyle = "#edf7f5";
  ctx.fillRect(0, HEIGHT - 18, WIDTH, 18);
  ctx.restore();
}

function drawCircleUltimate() {
  if (!circleUltimate) return;
  const points = circleUltimate.points;
  const active = !circleUltimate.resolved;
  const timeRatio = circleUltimate.drawing ? clamp(circleUltimate.timer / circleUltimate.maxTimer, 0, 1) : 1;
  ctx.save();
  ctx.globalAlpha = active ? 0.18 : 0.1 + circleUltimate.flash * 0.42;
  ctx.fillStyle = active ? "#0b1a24" : "#edf7f5";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = 1;

  if (points.length > 1) {
    const start = points[0];
    const end = points[points.length - 1];
    const closedDistance = Math.sqrt(dist2(start, end));
    const closeEnough = closedDistance < 72 && points.length >= 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = closeEnough ? "#7cf7a8" : "#edf7f5";
    ctx.shadowBlur = active ? 18 : 28;
    ctx.strokeStyle = closeEnough ? "#7cf7a8" : "#edf7f5";
    ctx.lineWidth = active ? 4 : 6;
    ctx.globalAlpha = active ? 0.9 : 0.72;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    if (!active && closeEnough) ctx.closePath();
    ctx.stroke();

    ctx.globalAlpha = active ? 0.24 : 0.18;
    ctx.fillStyle = closeEnough ? "#7cf7a8" : "#6df6d5";
    if (!active && closeEnough) {
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();
    }

    if (active) {
      ctx.globalAlpha = closeEnough ? 0.86 : 0.46;
      ctx.strokeStyle = closeEnough ? "#7cf7a8" : "#ffd166";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(start.x, start.y, closeEnough ? 17 : 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(end.x, end.y, 7 + Math.sin(elapsed * 24) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = active ? "#edf7f5" : "#071014";
  ctx.font = "800 18px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (active) {
    ctx.fillText(points.length ? "CLOSE JUDGEMENT" : "SEAL OF JUDGEMENT", WIDTH / 2, 56);
    ctx.font = "700 14px Inter, sans-serif";
    ctx.fillText(points.length ? `${timeRatio.toFixed(1)}s - do not release` : "hold left mouse to draw", WIDTH / 2, 80);
    ctx.strokeStyle = "#6df6d5";
    ctx.lineWidth = 5;
    if (circleUltimate.drawing) {
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(WIDTH / 2, 80, 28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timeRatio);
      ctx.stroke();
    }
  } else if (circleUltimate.resultText) {
    ctx.fillText(circleUltimate.resultText, WIDTH / 2, 58);
  }
  ctx.restore();
}

function drawPlayerDeathOverlay() {
  if (!playerDeathSequence) return;
  const progress = 1 - clamp(playerDeathSequence.timer / playerDeathSequence.maxTimer, 0, 1);
  const fadeIn = clamp(progress / 0.42, 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.18 + fadeIn * 0.34;
  ctx.fillStyle = "#ff5b74";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = 0.2 + fadeIn * 0.55;
  ctx.strokeStyle = progress < 0.55 ? "#edf7f5" : "#ff5b74";
  ctx.shadowColor = "#ff5b74";
  ctx.shadowBlur = 22;
  ctx.lineWidth = 8 + progress * 18;
  ctx.beginPath();
  ctx.arc(playerDeathSequence.x, playerDeathSequence.y, 36 + progress * 420, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = clamp((progress - 0.3) / 0.7, 0, 0.82);
  ctx.fillStyle = "#071014";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalAlpha = clamp((progress - 0.22) / 0.45, 0, 1);
  ctx.fillStyle = "#edf7f5";
  ctx.font = "900 22px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SIGNAL COLLAPSE", WIDTH / 2, HEIGHT / 2 - 12);
  ctx.font = "700 13px Inter, sans-serif";
  ctx.fillText("RUN DATA RECOVERING", WIDTH / 2, HEIGHT / 2 + 18);
  ctx.restore();
}

function drawMagnetField() {
  if (!pointer.rightDown || !player) return;
  const pulse = 0.5 + Math.sin(elapsed * 16) * 0.5;
  const ramp = magnetRamp();
  const color = magnetColor(ramp);
  const warningColor = ramp > 0.7 ? "#ff5b74" : "#edf7f5";
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.globalAlpha = 0.22 + pulse * 0.08 + ramp * 0.08;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 4 + ramp * 10;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i += 1) {
    const radius = 20 + i * 13 + pulse * 4 + ramp * 5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0.4 + elapsed * (1.6 + i * 0.35), Math.PI * 1.55 + elapsed * (1.6 + i * 0.35));
    ctx.stroke();
  }
  ctx.globalAlpha = 0.14 + ramp * 0.08;
  ctx.shadowBlur = 0;
  ctx.strokeStyle = warningColor;
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i += 1) {
    const angle = elapsed * 2.2 + (i / 10) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 14, Math.sin(angle) * 14);
    ctx.lineTo(Math.cos(angle) * 52, Math.sin(angle) * 52);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  const drawPullMarks = (entity, color, alpha, danger = 0, radius = 12, count = 3) => {
    const angleToPlayer = Math.atan2(player.y - entity.y, player.x - entity.x);
    const pulseOffset = (elapsed * (danger ? 28 : 16)) % 1;
    ctx.save();
    ctx.translate(entity.x, entity.y);
    ctx.rotate(angleToPlayer);
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = danger ? 12 + ramp * 10 : 7 + ramp * 6;
    ctx.lineWidth = danger ? 2 + ramp * 1.2 : 1.4;
    for (let i = 0; i < 3; i += 1) {
      const phase = ((i / 3) + pulseOffset) % 1;
      const start = radius + 8 + phase * (danger ? 28 : 20);
      const length = danger ? 11 : 8;
      ctx.globalAlpha = alpha * (1 - phase) * (danger ? 0.82 : 0.48);
      ctx.beginPath();
      ctx.moveTo(start, 0);
      ctx.lineTo(start + length, 0);
      ctx.stroke();
    }
    for (let i = 0; i < count; i += 1) {
      const phase = (i + pulseOffset) / count;
      const x = -radius - phase * (danger ? 18 : 14);
      const markAlpha = alpha * (1 - phase * 0.55);
      ctx.globalAlpha = markAlpha;
      ctx.beginPath();
      ctx.moveTo(x - 6, -5);
      ctx.lineTo(x, 0);
      ctx.lineTo(x - 6, 5);
      ctx.stroke();
    }
    ctx.globalAlpha = alpha * (danger ? 0.9 : 0.62);
    ctx.beginPath();
    ctx.arc(0, 0, radius + pulse * 3 + danger * 5, -0.65, 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius + 6 + pulse * 4 + danger * 7, Math.PI - 0.75, Math.PI + 0.75);
    ctx.stroke();
    ctx.restore();
  };

  bullets
    .filter((bullet) => bullet.magnetWeight > 0)
    .map((bullet) => ({ bullet, distance: Math.sqrt(dist2(player, bullet)) }))
    .filter(({ distance }) => distance <= 430)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 30)
    .forEach(({ bullet, distance }) => {
      const danger = clamp((430 - distance) / 430, 0, 1);
      const warningPulse = 0.5 + Math.sin(elapsed * (9 + ramp * 18) + bullet.x * 0.08) * 0.5;
      const alpha = clamp(0.1 + danger * 0.18 + ramp * 0.2 + warningPulse * 0.18, 0.08, 0.7);
      const warning = warningPulse > 0.45 || ramp > 0.72 ? "#ff5b74" : "#ffd166";
      drawPullMarks(bullet, warning, alpha, danger, bullet.r + 7 + warningPulse * 4, 4);
      ctx.globalAlpha = alpha * (0.55 + warningPulse * 0.45);
      ctx.strokeStyle = warning;
      ctx.shadowColor = warning;
      ctx.shadowBlur = 8 + ramp * 12 + warningPulse * 12;
      ctx.lineWidth = 1.2 + ramp * 1.5 + warningPulse * 0.8;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.r + 4 + ramp * 4 + warningPulse * 5, 0, Math.PI * 2);
      ctx.stroke();
    });
  ctx.shadowBlur = 0;
  [...shards.slice(0, 6), ...powerups.slice(0, 3)].forEach((item) => {
    const distance = Math.sqrt(dist2(player, item));
    if (distance > 340) return;
    const alpha = clamp((340 - distance) / 340, 0.08, 0.34);
    const itemColor = item.type ? (powerupInfo[item.type] || powerupInfo.shotgun).color : color;
    drawPullMarks(item, itemColor, alpha, 0, (item.r || 11) + 5, item.type ? 4 : 3);
  });
  ctx.restore();
}

function drawPlayerLaserBeam() {
  if (!playerLaserBeam) return;
  const beam = playerLaserBeam;
  const t = beam.pulse || 0;
  const color = beam.skyline ? "#8cff9a" : beam.prism ? "#2fd46f" : beam.ultimate ? "#edf7f5" : "#2fd46f";
  const core = beam.skyline ? "#edf7f5" : beam.prism ? "#edf7f5" : beam.ultimate ? "#2fd46f" : "#edf7f5";
  const segments = beam.segments || [{ x1: beam.x, y1: beam.y1, x2: beam.x2, y2: beam.y2, angle: beam.angle || -Math.PI / 2 }];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = beam.skyline ? 22 : beam.prism ? 18 : beam.ultimate ? 26 : 16;
  const drawSegment = (segment) => {
    ctx.globalAlpha = beam.skyline ? 0.2 : beam.prism ? 0.14 : beam.ultimate ? 0.24 : 0.16;
    ctx.strokeStyle = color;
    ctx.lineWidth = beam.width * (2.4 + t * 0.45);
    ctx.beginPath();
    ctx.moveTo(segment.x1, segment.y1);
    ctx.lineTo(segment.x2, segment.y2);
    ctx.stroke();
    ctx.globalAlpha = beam.skyline ? 0.5 : beam.prism ? 0.36 : beam.ultimate ? 0.58 : 0.42;
    ctx.lineWidth = beam.width * (1.08 + t * 0.18);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(segment.x1, segment.y1);
    ctx.lineTo(segment.x2, segment.y2);
    ctx.stroke();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(2.2, beam.width * 0.28);
    ctx.strokeStyle = core;
    ctx.beginPath();
    ctx.moveTo(segment.x1, segment.y1);
    ctx.lineTo(segment.x2, segment.y2);
    ctx.stroke();
  };
  segments.forEach(drawSegment);
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(beam.x, beam.y1, beam.width * (beam.prism ? 0.72 : 0.42) + t * 2, 0, Math.PI * 2);
  ctx.fill();
  const sparkSize = beam.width * (beam.ultimate ? 0.9 : 0.65) + t * 7;
  const sPassiveTip = beam.overdrive && !beam.ultimate;
  if (!beam.prism) {
    const tipZoneLength = Math.max(sPassiveTip ? 58 : 42, beam.width * (sPassiveTip ? 7.2 : 5.4));
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.globalAlpha = sPassiveTip ? 0.78 : 0.66;
    ctx.strokeStyle = "#edf7f5";
    ctx.shadowColor = "#edf7f5";
    ctx.shadowBlur = (sPassiveTip ? 20 : 14) + t * 10;
    ctx.lineWidth = Math.max(3, beam.width * 0.28);
    segments.forEach((segment) => {
      const angle = segment.angle || beam.angle || -Math.PI / 2;
      const dx = Math.cos(angle) * tipZoneLength;
      const dy = Math.sin(angle) * tipZoneLength;
      ctx.beginPath();
      ctx.moveTo(segment.x2 - dx, segment.y2 - dy);
      ctx.lineTo(segment.x2, segment.y2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();
  }
  ctx.globalAlpha = beam.skyline ? 0.82 : beam.prism ? 0.62 : beam.ultimate ? 0.9 : 0.72;
  ctx.shadowBlur = beam.skyline ? 20 : beam.prism ? 16 : beam.ultimate ? 24 : 14;
  ctx.strokeStyle = core;
  ctx.lineWidth = beam.skyline ? 2.5 : beam.prism ? 1.8 : beam.ultimate ? 3 : 2;
  segments.forEach((segment, segmentIndex) => {
    const tipX = segment.x2;
    const tipY = segment.y2;
    if (!beam.prism) {
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i += 1) {
        const spreadRatio = sparkCount > 1 ? i / (sparkCount - 1) - 0.5 : 0;
        const sparkAngle = (segment.angle || beam.angle || -Math.PI / 2) + spreadRatio * Math.PI * 0.92 + Math.sin(elapsed * 18 + i + segmentIndex) * 0.16;
        const inner = sparkSize * 0.24;
        const outer = sparkSize * (0.8 + ((i % 3) * 0.16)) + Math.sin(elapsed * 22 + i * 1.7) * 4;
        ctx.beginPath();
        ctx.moveTo(tipX + Math.cos(sparkAngle) * inner, tipY + Math.sin(sparkAngle) * inner);
        ctx.lineTo(tipX + Math.cos(sparkAngle) * outer, tipY + Math.sin(sparkAngle) * outer);
        ctx.stroke();
      }
    }
    const angle = segment.angle || beam.angle || -Math.PI / 2;
    ctx.globalAlpha = sPassiveTip ? 1 : beam.prism ? 0.82 : 0.98;
    ctx.strokeStyle = "#edf7f5";
    ctx.lineWidth = Math.max(2.5, beam.width * 0.26);
    ctx.beginPath();
    ctx.arc(tipX, tipY, Math.max(sPassiveTip ? 9 : 7, beam.width * (sPassiveTip ? 0.88 : 0.72) + t * 4), 0, Math.PI * 2);
    ctx.stroke();
    if (!beam.prism) {
      ctx.globalAlpha = 0.76;
      ctx.strokeStyle = "#2fd46f";
      ctx.lineWidth = Math.max(2, beam.width * 0.2);
      const crossLength = 10;
      const forwardLength = 12;
      const backwardLength = 7;
      ctx.beginPath();
      ctx.moveTo(tipX - Math.cos(angle + Math.PI / 2) * crossLength, tipY - Math.sin(angle + Math.PI / 2) * crossLength);
      ctx.lineTo(tipX + Math.cos(angle + Math.PI / 2) * crossLength, tipY + Math.sin(angle + Math.PI / 2) * crossLength);
      ctx.moveTo(tipX - Math.cos(angle) * forwardLength, tipY - Math.sin(angle) * forwardLength);
      ctx.lineTo(tipX + Math.cos(angle) * backwardLength, tipY + Math.sin(angle) * backwardLength);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.96;
    ctx.fillStyle = "#edf7f5";
    ctx.beginPath();
    ctx.arc(tipX, tipY, Math.max(4.5, beam.width * 0.36 + t * 2.8), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawPlayerShip({ ghost = false, scale = 1 } = {}) {
  const flicker = player.invuln > 0 && Math.floor(elapsed * 14) % 2;
  const hull = flicker ? "#edf7f5" : ghost ? "rgba(109, 246, 213, 0.22)" : "#6df6d5";
  const trim = ghost ? "rgba(237, 247, 245, 0.78)" : "#edf7f5";
  const core = ghost ? "rgba(255, 91, 116, 0.65)" : "#ff5b74";

  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.fillStyle = ghost ? "rgba(7, 16, 20, 0.25)" : "#213740";
  ctx.strokeStyle = "#071014";
  ctx.lineWidth = ghost ? 2 : 3;
  ctx.beginPath();
  ctx.moveTo(0, -21);
  ctx.lineTo(11, -3);
  ctx.lineTo(22, 14);
  ctx.lineTo(8, 9);
  ctx.lineTo(0, 18);
  ctx.lineTo(-8, 9);
  ctx.lineTo(-22, 14);
  ctx.lineTo(-11, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(9, -2);
  ctx.lineTo(5, 14);
  ctx.lineTo(0, 20);
  ctx.lineTo(-5, 14);
  ctx.lineTo(-9, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = trim;
  ctx.lineWidth = ghost ? 1.5 : 2;
  ctx.beginPath();
  ctx.moveTo(-15, 9);
  ctx.lineTo(-5, 4);
  ctx.moveTo(15, 9);
  ctx.lineTo(5, 4);
  ctx.moveTo(0, -18);
  ctx.lineTo(0, 13);
  ctx.stroke();

  ctx.fillStyle = core;
  ctx.shadowColor = core;
  ctx.shadowBlur = ghost ? 7 : 10;
  ctx.beginPath();
  ctx.ellipse(0, -3, 5.5, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = ghost ? 4 : 7;
  ctx.beginPath();
  ctx.arc(-10, 5, 2.5, 0, Math.PI * 2);
  ctx.arc(10, 5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerWeaponBars() {
  const bars = [];
  const height = 32;
  if (player.mainWeapon && player.mainWeapon !== "normal") {
    const info = powerupInfo[player.mainWeapon] || powerupInfo.shotgun;
    bars.push({ color: info.color, ratio: clamp(player.mainTimer / 8, 0, 1), x: -31 });
  }
  if (player.subWeapon && player.subWeapon !== "none") {
    const info = powerupInfo[player.subWeapon] || powerupInfo.missiles;
    bars.push({ color: info.color, ratio: clamp(player.subTimer / 10, 0, 1), x: 29 });
  }
  if (!bars.length) return;

  ctx.save();
  ctx.translate(0, -17);
  bars.forEach((bar) => {
    const w = 3;
    const h = height;
    const fillH = h * bar.ratio;
    ctx.fillStyle = "rgba(7, 16, 20, 0.62)";
    ctx.fillRect(bar.x, 0, w, h);
    ctx.strokeStyle = "rgba(237, 247, 245, 0.32)";
    ctx.lineWidth = 1;
    ctx.strokeRect(bar.x - 0.5, -0.5, w + 1, h + 1);
    ctx.fillStyle = bar.color;
    ctx.shadowColor = bar.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(bar.x, h - fillH, w, fillH);
  });
  ctx.restore();
}

function draw() {
  drawBackground();

  if (!player) {
    return;
  }

  drones
    .filter((drone) => drone.type === "mothership")
    .forEach((drone) => {
      drawDrone(drone);
    });
  drawCivilianShips();

  ctx.save();
  if (shake > 0) {
    ctx.translate(rand(-6, 6) * shake * 4, rand(-6, 6) * shake * 4);
  }

  drones.forEach((drone) => {
    if (drone.type === "mothership") return;
    drawDrone(drone);
  });
  drawBoss();
  drawShieldTransfers();

  drawNukeEffects();
  drawMissileSplashEffects();
  drawMuzzleBlasts();

  playerShots.forEach((shot) => {
    ctx.fillStyle = shot.color || (shot.power > 1 ? "#edf7f5" : "#6df6d5");
    if (shot.kind === "machinegun" || shot.kind === "lockdown" || shot.kind === "sweeper") {
      ctx.fillRect(shot.x - 2, shot.y - 9, 4, 14);
    } else if (shot.life) {
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const angle = Math.atan2(shot.vy, shot.vx) + Math.PI / 2;
      ctx.save();
      ctx.translate(shot.x, shot.y);
      ctx.rotate(angle);
      ctx.fillRect(-shot.r, -15, shot.r * 2, 24);
      ctx.restore();
    }
  });

  supportPathLanes.forEach((lane) => {
    drawSupportPathLane(lane);
  });

  missileTrails.forEach((trail) => {
    const t = clamp(trail.life / trail.maxLife, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = t * 0.36;
    ctx.translate(trail.x, trail.y);
    ctx.rotate(trail.angle);
    ctx.fillStyle = trail.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, trail.size * (1.45 + (1 - t) * 1.7), trail.size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#edf7f5";
    ctx.globalAlpha = t * 0.18;
    ctx.beginPath();
    ctx.ellipse(-trail.size * 0.25, 0, trail.size * 0.75, trail.size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  missiles.forEach((missile) => {
    drawMissile(missile);
  });

  supportTrails.forEach((trail) => {
    const t = clamp(trail.life / trail.maxLife, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = t * 0.42;
    ctx.fillStyle = trail.color;
    ctx.beginPath();
    ctx.ellipse(trail.x, trail.y, trail.size * (1.2 + (1 - t) * 2.2), trail.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  supportShips.forEach((ship) => {
    drawSupportShip(ship);
  });

  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    if (bullet.laser) {
      const angle = Math.atan2(bullet.vy, bullet.vx);
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(angle);
      ctx.shadowColor = bullet.color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#b92618";
      ctx.fillRect(-bullet.length * 0.54, -5, bullet.length * 1.08, 10);
      ctx.fillStyle = bullet.color;
      ctx.fillRect(-bullet.length * 0.5, -3, bullet.length, 6);
      ctx.fillStyle = bullet.coreColor || "#ffd166";
      ctx.fillRect(-bullet.length * 0.34, -1.5, bullet.length * 0.68, 3);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  shards.forEach((shard) => {
    const fade = clamp((shard.life || 0) / 1.4, 0.28, 1);
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.globalAlpha = fade;
    ctx.shadowColor = "#6df6d5";
    ctx.shadowBlur = 10 + fade * 12;
    ctx.fillStyle = "#6df6d5";
    ctx.strokeStyle = "#edf7f5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -shard.r - 4);
    ctx.lineTo(shard.r + 4, 0);
    ctx.lineTo(0, shard.r + 4);
    ctx.lineTo(-shard.r - 4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#071014";
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  });

  powerups.forEach((powerup) => {
    ctx.save();
    ctx.globalAlpha = clamp((powerup.life || 0) / 1.6, 0.32, 1);
    drawPowerup(powerup);
    ctx.restore();
  });

  particles.forEach((particle) => {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle || 0);
    if (particle.shape === "slash") {
      ctx.fillRect(-(particle.size || 8) * 0.5, -1, particle.size || 8, 2);
    } else if (particle.shape === "plate") {
      const size = particle.size || 8;
      ctx.fillStyle = particle.color;
      ctx.fillRect(-size * 0.55, -size * 0.28, size * 1.1, size * 0.56);
      ctx.strokeStyle = "rgba(7, 16, 20, 0.72)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-size * 0.55, -size * 0.28, size * 1.1, size * 0.56);
    } else if (particle.shape === "shard") {
      const size = particle.size || 5;
      ctx.beginPath();
      ctx.moveTo(size * 0.65, 0);
      ctx.lineTo(-size * 0.3, -size * 0.45);
      ctx.lineTo(-size * 0.55, size * 0.35);
      ctx.closePath();
      ctx.fill();
    } else if (particle.shape === "shell") {
      const size = particle.size || 5;
      ctx.fillStyle = particle.color || "#c58b42";
      ctx.shadowColor = particle.color || "#ffd166";
      ctx.shadowBlur = 8;
      ctx.fillRect(-size * 0.65, -size * 0.24, size * 1.3, size * 0.48);
      ctx.fillStyle = "rgba(237, 247, 245, 0.78)";
      ctx.fillRect(size * 0.12, -size * 0.24, size * 0.26, size * 0.48);
      ctx.fillStyle = "rgba(255, 241, 184, 0.72)";
      ctx.fillRect(-size * 0.42, -size * 0.18, size * 0.56, size * 0.14);
      ctx.strokeStyle = "rgba(7, 16, 20, 0.62)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-size * 0.65, -size * 0.24, size * 1.3, size * 0.48);
    } else if (particle.shape === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, (particle.size || 3) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const size = particle.size || 3;
      ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  });
  drawFloatingTexts();
  drawMagnetField();
  drawPlayerLaserBeam();
  drawUltimateCue();
  drawCircleUltimate();

  if (player.lockdownTimer > 0) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.globalAlpha = clamp(player.lockdownTimer / 1.5, 0, 0.45);
    ctx.strokeStyle = "#ff5b74";
    ctx.shadowColor = "#ff5b74";
    ctx.shadowBlur = 18;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 30 + Math.sin(elapsed * 32) * 4, -Math.PI * 0.95, -Math.PI * 0.05);
    ctx.stroke();
    ctx.restore();
  }

  if (state !== "dying") {
    drawStreakAura();
    drawPlayerInvulnerability();
    drawPlayerFrenzyCue();

    ctx.save();
    ctx.translate(player.x, player.y);
    drawPlayerShip();
    drawPlayerWeaponBars();
    ctx.restore();
  }

  drawPlayerHealth();
  drawEnergyPips();
  drawPowerupInventory();
  drawTopScore();
  drawPlayerHealCue();
  drawPlayerDamageCue();
  ctx.restore();
  drawPlayerHealOverlay();
  drawPlayerDamageOverlay();
  drawPlayerDeathOverlay();
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "escape" || key === "p") {
    togglePauseMenu();
    event.preventDefault();
    return;
  }
  if (state === "paused") return;
  if (key === "r") resetGame();
  if (event.key === "`") {
    debugVisible = !debugVisible;
    updateDebugPanel();
    event.preventDefault();
  }
  if (state !== "playing") return;
  if (key === "c") {
    startCircleUltimate();
    event.preventDefault();
    return;
  }
  if (key === "b" && !boss) {
    spawnFirstBoss();
  }
  if (key === "m") {
    spawnDebugMothershipPack();
    event.preventDefault();
    return;
  }
  if (key === "s") {
    debugSetSStreak();
    event.preventDefault();
    return;
  }
  if (key === "1") spawnDebugPowerup("shotgun");
  if (key === "2") spawnDebugPowerup("laser");
  if (key === "3") spawnDebugPowerup("missiles");
  if (key === "4") spawnDebugPowerup("machinegun");
  if (key === "e" && player) {
    player.charge = MAX_ENERGY;
    if (debugVisible) {
      addFloatingText(player.x, player.y - 44, "ENERGY", "#6df6d5");
    }
    updateHud();
  }
  if (key === "h" && player) {
    player.hits = MAX_PLAYER_HITS;
    if (debugVisible) {
      addFloatingText(player.x, player.y - 44, "HULL", "#7cf7a8");
    }
    updateHud();
  }
});

canvas.addEventListener("pointermove", setPointerPosition);
canvas.addEventListener("pointerenter", setPointerPosition);
canvas.addEventListener("pointerdown", (event) => {
  audio.unlock();
  setPointerPosition(event);
  if (event.button === 0) pointer.leftDown = true;
  if (event.button === 2) pointer.rightDown = true;
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();
});
canvas.addEventListener("pointerup", (event) => {
  if (event.button === 0) {
    pointer.leftDown = false;
    if (circleUltimate && !circleUltimate.resolved && circleUltimate.drawing) {
      failCircleUltimate("JUDGEMENT BROKEN");
    }
  }
  if (event.button === 2) pointer.rightDown = false;
  event.preventDefault();
});
canvas.addEventListener("pointerleave", () => {
  if (circleUltimate && !circleUltimate.resolved && circleUltimate.drawing) {
    failCircleUltimate("JUDGEMENT BROKEN");
  }
  releasePointerControl();
});
canvas.addEventListener("pointercancel", () => {
  if (circleUltimate && !circleUltimate.resolved && circleUltimate.drawing) {
    failCircleUltimate("JUDGEMENT BROKEN");
  }
  releasePointerControl();
});
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

startButton.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);
resumeButton.addEventListener("click", closePauseMenu);
pauseRestartButton.addEventListener("click", resetGame);
pauseMenuTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-menu]");
  if (!button) return;
  renderPauseMenu(button.dataset.menu);
});
encyclopediaTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tab]");
  if (!button) return;
  renderPauseMenu("encyclopedia", button.dataset.tab);
});
encyclopediaBody.addEventListener("input", (event) => {
  const control = event.target.closest("[data-volume]");
  if (!control) return;
  const channel = control.dataset.volume;
  audio.setVolume(channel, Number(control.value) / 100);
  updateVolumeUi();
});

renderPauseMenu();
updateTitleRecords();
audio.applyVolumes();
draw();
requestAnimationFrame(loop);

