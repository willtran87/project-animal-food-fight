(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const nativeMeasureText = ctx.measureText.bind(ctx);
  const W = 1024;
  const H = 640;
  const ACTIVE_RUN_STORAGE_KEY = window.FoodAnimalsRunStorage?.STORAGE_KEY || "harvest-friends:active-run:v1";
  const ACTIVE_RUN_SAVE_VERSION = window.FoodAnimalsRunStorage?.SAVE_VERSION || 1;
  const ACTIVE_RUN_AUTOSAVE_SECONDS = 0.75;
  const MENU_REBOOT_STATIC_STORAGE_KEY = "harvest-friends:menu-reboot-static:v1";
  const MENU_RETURN_REVEAL_STORAGE_KEY = "harvest-friends:menu-return-reveal:v1";
  const HORROR_MENU_UNLOCK_STORAGE_KEY = "harvest-friends:horror-menu-unlocked:v1";
  const HORROR_REVEALED_STORAGE_KEY = "harvest-friends:horror-revealed:v1";
  const GAME_COMPLETED_STORAGE_KEY = "harvest-friends:game-completed:v1";
  const MUSIC_SETTINGS_STORAGE_KEY = window.FoodAnimalsAudioSettings?.STORAGE_KEY || "harvest-friends:start-menu-settings:v1";
  const GAME_MUSIC_MAX_VOLUME = 0.85;
  const rngRuntime = window.FoodAnimalsRngRuntime;
  if (!rngRuntime) throw new Error("FoodAnimalsRngRuntime must load before game.js");

  function initialRunSeed() {
    try {
      const params = new URLSearchParams(window.location.search);
      return rngRuntime.normalizeSeed(params.get("seed") || rngRuntime.randomSeed());
    } catch {
      return rngRuntime.randomSeed();
    }
  }

  let rngState = rngRuntime.createState(initialRunSeed());
  let stateRef = null;

  function syncRngState() {
    if (!stateRef) return;
    stateRef.runSeed = rngState.seed;
    stateRef.rngCalls = rngState.calls;
  }

  function random() {
    const value = rngRuntime.next(rngState);
    syncRngState();
    return value;
  }

  const presentationData = window.FoodAnimalsPresentationData;
  if (!presentationData) throw new Error("FoodAnimalsPresentationData must load before game.js");
  const {
    BACKGROUND_SRC,
    BATTLE_FIELD,
    BATTLE_FIELD_BG_SRC,
    BATTLE_FORMATION,
    BATTLE_SPEED_CHALK_SRC,
    BENCH_SLOT_BG_SRC,
    BOARD_PLATE_SLOT_SRC,
    CODEX_DEFAULT_FILTERS,
    CODEX_LIST,
    CODEX_MENU_BUTTON_SRC,
    CODEX_PANEL,
    CODEX_TABS,
    COMBAT_LEDGER_EVENT_TYPE_FILTERS,
    COMBAT_LEDGER_LOG_BG_SRC,
    COMBAT_LEDGER_MINI_BG_SRC,
    COMBAT_LEDGER_PANEL_BG_SRC,
    COMBAT_LEDGER_PARTICIPANTS_BG_SRC,
    COMBAT_LEDGER_REVIEW_FILTERS,
    COMBAT_LEDGER_REVIEW_PANEL,
    COZY_AWNING_TRANSITION_SRC,
    COZY_BATTLE_DEPLOY_OVERLAY_SRC,
    COZY_BATTLE_DEPLOY_TITLE_SRC,
    COZY_BATTLE_RESULT_DEFEAT_TITLE_SRC,
    COZY_BATTLE_RESULT_RUN_OVER_TITLE_SRC,
    COZY_BATTLE_RESULT_VICTORY_TITLE_SRC,
    DRINK_COASTER_SLOT_SRC,
    FINAL_VICTORY_CUTSCENE_SRC,
    FINAL_VICTORY_IDEAL_SRC,
    FOOD_MENU_BG_SRC,
    GAME_MUSIC_TRACKS,
    GAME_SFX_IDS,
    HORROR_TABS_STORY_PORTRAIT_SRC,
    IDLE_BREATH,
    INFO_PANEL,
    LEVEL10_CUTSCENE_EVIDENCE_FRAME_SRC,
    LEVEL10_CUTSCENE_FX_ATLAS_SRC,
    LEVEL10_CUTSCENE_GLITCH_OVERLAY_SRC,
    LEVEL10_CUTSCENE_TEXT_PANEL_SRC,
    LEVEL10_REVEAL_BREAKFAST_MASK_SRC,
    LEVEL10_REVEAL_CUTSCENE_ID,
    LEVEL10_REVEAL_CUTSCENE_SECONDS,
    LEVEL10_REVEAL_CUTSCENE_SHOTS,
    LEVEL10_REVEAL_DEFIANCE_SYSTEM_SRC,
    LEVEL10_REVEAL_EXPIRED_ARCHIVE_SRC,
    LEVEL10_REVEAL_FOOD_ANIMAL_PILOTS_SRC,
    LEVEL10_REVEAL_SURVIVOR_PENS_SRC,
    LEVEL10_REVEAL_WAR_YARD_PANORAMA_SRC,
    OPTIONS_MENU,
    PLAYER_STORY_PORTRAIT_SRC,
    REALITY_BACKGROUND_SRC,
    REALITY_BANNER_BOARD_SRC,
    REALITY_BATTLE_DEPLOY_OVERLAY_SRC,
    REALITY_BATTLE_DEPLOY_TITLE_SRC,
    REALITY_BATTLE_FIELD_BG_SRC,
    REALITY_BATTLE_RESULT_DEFEAT_TITLE_SRC,
    REALITY_BATTLE_RESULT_RUN_OVER_TITLE_SRC,
    REALITY_BATTLE_RESULT_VICTORY_TITLE_SRC,
    REALITY_BENCH_SLOT_BG_SRC,
    REALITY_BOARD_PLATE_SLOT_SRC,
    REALITY_CODEX_MENU_BUTTON_SRC,
    REALITY_COMBAT_LEDGER_LOG_BG_SRC,
    REALITY_COMBAT_LEDGER_MINI_BG_SRC,
    REALITY_COMBAT_LEDGER_PANEL_BG_SRC,
    REALITY_COMBAT_LEDGER_PARTICIPANTS_BG_SRC,
    REALITY_COMMAND_DEPLOY_SRC,
    REALITY_COMMAND_REBOOT_SRC,
    REALITY_COMMAND_RIG_SRC,
    REALITY_COMMAND_SCAN_SRC,
    REALITY_COMMAND_SPEED_SRC,
    REALITY_DRINK_COASTER_SLOT_SRC,
    REALITY_FOOD_MENU_BG_SRC,
    REALITY_SHOPKEEPER_STALL_SRC,
    REALITY_SHOP_LOCK_CLOTH_BG_SRC,
    REALITY_SHOP_SLOT_BG_SRC,
    REALITY_STATUS_HULL_SRC,
    REALITY_STATUS_SCRAP_SRC,
    REALITY_STATUS_WAVE_SRC,
    REALITY_TEAM_INTEL_BG_SRC,
    REALITY_TOPPING_STORAGE_SLOT_SRC,
    REALITY_UI_ICON_ATLAS_SRC,
    RESTART_CHALK_SIGN_SRC,
    SHOPKEEPER_DISPLAY,
    SHOPKEEPER_SRC,
    SHOPKEEPER_STALL_SRC,
    SHOP_LOCKED_SRC,
    SHOP_LOCK_CLOTH_BG_SRC,
    SHOP_SLOT_BG_SRC,
    SHOP_UNLOCKED_SRC,
    STATUS_CHALK_COINS_SRC,
    STATUS_CHALK_COURSE_SRC,
    STATUS_CHALK_HEALTH_SRC,
    STATUS_COIN_SRC,
    STATUS_HEART_SRC,
    STORY_DIALOGUE_PAPER_BG_SRC,
    STORY_DIALOGUE_WAR_BG_SRC,
    TABS_STORY_PORTRAIT_SRC,
    TEAM_INTEL_BG_SRC,
    TOPPING_CUTTING_BOARD_SLOT_SRC,
    UI_ICON_ATLAS,
    UI_ICON_ATLAS_CELL,
    UI_ICON_ATLAS_SRC,
    UPGRADE_STAR_SRC,
    VICTORY_CRAWL_LINES,
    VICTORY_REBOOT_BUTTON,
  } = presentationData;
  const LEVEL10_CUTSCENE_FX_CELLS = Object.freeze({
    smoke: { sx: 0, sy: 0, sw: 512, sh: 512 },
    sparks: { sx: 512, sy: 0, sw: 512, sh: 512 },
    signal: { sx: 1024, sy: 0, sw: 512, sh: 512 },
    pilots: { sx: 0, sy: 512, sw: 512, sh: 512 },
    fluid: { sx: 512, sy: 512, sw: 512, sh: 512 },
    warning: { sx: 1024, sy: 512, sw: 512, sh: 512 },
  });
  const GAME_SFX_TRACKS = Object.fromEntries(
    ["cozy", "horror"].map((theme) => [
      theme,
      Object.fromEntries(GAME_SFX_IDS.map((id) => [id, `assets/audio/sfx/${theme}-${id}.wav`])),
    ]),
  );
  const DISPLAY_SCALE = 1.5625;
  const MAX_BACKING_SCALE = 2.5;
  const BACKING_SCALE = Math.max(1.5, Math.min(MAX_BACKING_SCALE, (window.devicePixelRatio || 1) * DISPLAY_SCALE));
  const COMBAT_ATTACK_MOTION_SECONDS = 0.38;
  const COMBAT_SUPPORT_MOTION_SECONDS = 0.42;
  const COMBAT_HIT_MOTION_SECONDS = 0.3;
  const COMBAT_ATTACK_LUNGE_PIXELS = 15;
  const COMBAT_SUPPORT_LIFT_PIXELS = 8;
  const COMBAT_HIT_RECOIL_PIXELS = 10;
  const HORROR_PLATE_BENCH_UNIT_SCALE = 1.3;
  const HORROR_DEFEAT_STILL_SCALE = 1.3;
  const HORROR_PARTICLE_SPEED_SCALE = 1.24;
  const HORROR_PARTICLE_LIFE_SCALE = 0.74;
  const FINAL_VICTORY_ROUND = 20;
  const FINAL_BOSS_TYPE_ID = "cyber_brain_final_boss";
  const FINAL_BOSS_MINION_TYPE_ID = "brainstem_wire_minion";
  const GIRAFFE_BOSS_ROUND = 10;
  const GIRAFFE_BOSS_TYPE_ID = "banana_split_giraffe_boss";
  const GIRAFFE_BOSS_SLOT = 3;
  const GIRAFFE_BOSS_HIT_GLITCH_SECONDS = 0.62;
  const FINAL_BOSS_HIT_GLITCH_SECONDS = 0.52;
  const REALITY_BREAK_REVEAL_SECONDS = 5.5;
  const REALITY_REVEAL_DISTORT_SECONDS = 1.65;
  const POST_GIRAFFE_HORROR_ITEM_TRANSITION_SECONDS = 6.4;
  const POST_GIRAFFE_HORROR_ITEM_TRANSITION_CLEAR_SECONDS = 7.2;
  const HORROR_SHOP_RETURN_STATIC_SECONDS = 1.6;
  const COZY_SHOP_RETURN_AWNING_SECONDS = 1.75;
  const REBOOT_STATIC_FADE_SECONDS = 1.28;
  const REBOOT_STATIC_RESET_AT = 0.58;
  const VICTORY_MENU_REBOOT_STATIC_SECONDS = 1.45;
  const FINAL_VICTORY_HOLD_SECONDS = 3;
  const FINAL_VICTORY_STATIC_FADE_SECONDS = 3.4;
  const FINAL_VICTORY_STATIC_RESET_AT = 0.64;
  const VICTORY_CRAWL_START_SECONDS = 3.6;
  const VICTORY_CRAWL_PIXELS_PER_SECOND = 18;
  const VICTORY_CRAWL_LINE_GAP = 42;
  const VICTORY_CRAWL_HOLD_SECONDS = 6;
  const VICTORY_IDEAL_FADE_START_SECONDS = 50;
  const VICTORY_IDEAL_FADE_SECONDS = 2.4;
  const STORY_TRANSITION_SECONDS = 0.36;
  const STORY_BEAT_TRANSITION_SECONDS = 0.18;
  const LEVEL10_REVEAL_CUTSCENE_STATIC_TRANSITION_SECONDS = 0.46;
  const MODAL_TRANSITION_SECONDS = 0.22;
  const BATTLE_DEPLOY_TRANSITION_SECONDS = 1.45;
  const BATTLE_RESULT_TRANSITION_SECONDS = 1.45;
  const SHOP_SLOT_TRANSITION_SECONDS = 0.48;
  const storyData = window.FoodAnimalsStoryData;
  if (!storyData) throw new Error("FoodAnimalsStoryData must load before game.js");
  const { FINAL_TABS_STORY_ID, FINAL_TABS_STORY, STORY_MILESTONES } = storyData;

  const TEXT_LAYOUT_CACHE_LIMIT = 5000;
  const textMeasureCache = new Map();
  const wrappedTextCache = new Map();
  let assetDrawPending = false;

  function rememberCacheEntry(cache, key, value) {
    return window.FoodAnimalsCanvasText.remember(cache, key, value, TEXT_LAYOUT_CACHE_LIMIT);
  }

  function measureTextWidth(text, font = ctx.font) {
    return window.FoodAnimalsCanvasText.measureWidth(ctx, text, {
      cache: textMeasureCache,
      cacheLimit: TEXT_LAYOUT_CACHE_LIMIT,
      font,
      nativeMeasureText,
    });
  }

  function requestDraw() {
    assetDrawPending = true;
  }

  function drawFrame() {
    assetDrawPending = false;
    draw();
  }

  function normalizeRealityOverride(value) {
    if (value === true || value === false || value === null) return value;
    const mode = String(value || "").trim().toLowerCase();
    if (!mode || mode === "auto" || mode === "story") return null;
    if (["horror", "war", "broken", "reality", "future"].includes(mode)) return true;
    if (["cozy", "normal", "illusion", "safe"].includes(mode)) return false;
    return null;
  }

  function initialRealityOverride() {
    try {
      const params = new URLSearchParams(window.location.search);
      const realityParam = params.get("reality");
      if (realityParam !== null) return normalizeRealityOverride(realityParam);
      const themeOverride = normalizeRealityOverride(params.get("theme"));
      return themeOverride === true ? true : null;
    } catch (_err) {
      return null;
    }
  }

  const copyData = window.FoodAnimalsCopyData;
  if (!copyData) throw new Error("FoodAnimalsCopyData must load before game.js");
  const { COPY_THEMES } = copyData;

  canvas.width = Math.round(W * BACKING_SCALE);
  canvas.height = Math.round(H * BACKING_SCALE);
  canvas.style.setProperty("--game-display-width", `${W * DISPLAY_SCALE}px`);
  ctx.setTransform(BACKING_SCALE, 0, 0, BACKING_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;

  const unitData = window.FoodAnimalsUnitData;
  if (!unitData) throw new Error("FoodAnimalsUnitData must load before game.js");
  const {
    CATALOG,
    DEFEAT_STILL_SPRITES,
    REALITY_DEFEAT_STILL_SPRITES,
    REALITY_RUNTIME_SPRITES,
    RUNTIME_SPRITES,
  } = unitData;

  const traitArenaData = window.FoodAnimalsTraitArenaData;
  if (!traitArenaData) throw new Error("FoodAnimalsTraitArenaData must load before game.js");
  const {
    ARENAS,
    FAVORITE_COMBO_SPECS,
    FAVORITE_TOPPINGS,
    HORROR_ARENA_COLORS,
    HORROR_TRAIT_COLORS,
    TRAITS,
  } = traitArenaData;

  const BOARD_COLS = 3;
  const BOARD_ROWS = 3;
  const SHOP_SLOT_W = 86;
  const SHOP_SLOT_H = 162;
  const SHOP_STARTING_UNLOCKED_SLOTS = 4;
  const SHOP_SLOT_UNLOCK_COSTS = [0, 0, 0, 0, 30, 45, 60, 75];
  const BENCH_SLOT_BG_SCALE = 1.12;
  const REALITY_BREAK_ROUND = 11;
  const REALITY_SHOPKEEPER_SRC = HORROR_TABS_STORY_PORTRAIT_SRC;
  const FRONT_COL = BOARD_COLS - 1;
  const BACK_COL = 0;
  const BATTLE_DRINK_SLOT_SIZE = BATTLE_FORMATION.cellSize;
  const BATTLE_DRINK_ICON_RADIUS = 38;
  const DRINK_PULSE_ANIMATION_SECONDS = 0.58;
  const DRINK_PULSE_HOP_PIXELS = 9;
  const DRINK_TOSS_ANIMATION_SECONDS = 0.62;
  const DRINK_TOSS_PROJECTILE_SIZE = 52;
  const DRINK_TOSS_ARC_HEIGHT = 44;
  const DRINK_TOSS_IMPACT_PARTICLES = 7;
  const PREP_BOARD_ORIGIN = { x: 382, y: 278 };
  const PREP_BOARD_SPACING = 78;
  const boardSlots = Array.from({ length: BOARD_COLS * BOARD_ROWS }, (_, index) => {
    const col = index % BOARD_COLS;
    const row = Math.floor(index / BOARD_COLS);
    return { x: PREP_BOARD_ORIGIN.x + col * PREP_BOARD_SPACING, y: PREP_BOARD_ORIGIN.y + row * PREP_BOARD_SPACING, col, row };
  });
  const DRINK_SLOT_SIZE = 72;
  const TILE_DRINK_ICON_RADIUS_SCALE = 0.54;
  const TILE_DRINK_ICON_Y_OFFSET = 0;
  const DRINK_COASTER_OPAQUE_ANCHOR_Y = 0.74;
  const drinkSlots = [
    ...Array.from({ length: BOARD_ROWS }, (_, row) => ({
      x: PREP_BOARD_ORIGIN.x - PREP_BOARD_SPACING,
      y: PREP_BOARD_ORIGIN.y + row * PREP_BOARD_SPACING,
      axis: "row",
      targetIndex: row,
    })),
    ...Array.from({ length: BOARD_COLS }, (_, col) => ({
      x: PREP_BOARD_ORIGIN.x + col * PREP_BOARD_SPACING,
      y: PREP_BOARD_ORIGIN.y + BOARD_ROWS * PREP_BOARD_SPACING,
      axis: "col",
      targetIndex: col,
    })),
  ];
  const ITEM_BENCH_COLS = 2;
  const ITEM_BENCH_ROWS = 4;
  const ITEM_BENCH_DRINK_SLOTS = ITEM_BENCH_COLS * 2;
  const ITEM_BENCH_SLOT_SIZE = 72;
  const ITEM_BENCH_ORIGIN = { x: 70, y: 278 };
  const ITEM_BENCH_SPACING = { x: 78, y: 78 };
  const itemBenchSlots = Array.from({ length: ITEM_BENCH_COLS * ITEM_BENCH_ROWS }, (_, index) => {
    const col = index % ITEM_BENCH_COLS;
    const row = Math.floor(index / ITEM_BENCH_COLS);
    return {
      x: ITEM_BENCH_ORIGIN.x + col * ITEM_BENCH_SPACING.x,
      y: ITEM_BENCH_ORIGIN.y + row * ITEM_BENCH_SPACING.y,
      col,
      row,
      kind: index < ITEM_BENCH_DRINK_SLOTS ? "drink" : "topping",
    };
  });
  const benchSlots = Array.from({ length: 8 }, (_, i) => ({ x: 70 + i * 78, y: 600 }));
  const shopSlots = Array.from({ length: 8 }, (_, i) => ({ x: 46 + i * 88, y: 146 }));

  function initialShopUnlocked() {
    return shopSlots.map((_, index) => index < SHOP_STARTING_UNLOCKED_SLOTS);
  }

  function isShopSlotUnlocked(index) {
    return Boolean(state?.shopUnlocked?.[index]);
  }

  function shopEntryAt(index) {
    return isShopSlotUnlocked(index) ? state.shop?.[index] || null : null;
  }

  function shopSlotUnlockCost(index) {
    return window.FoodAnimalsShopEconomy.slotUnlockCost(SHOP_SLOT_UNLOCK_COSTS, index);
  }

  const buttons = {
    shopUpgrade: { x: 650, y: 4, w: 112, h: 52, label: "Upgrade", icon: "^", signSrc: "assets/ui/runtime/chalk-sign-upgrade-v1.webp" },
    roll: { x: 775, y: 4, w: 112, h: 52, label: "Roll", icon: "R", signSrc: "assets/ui/runtime/chalk-sign-reroll-v1.webp" },
    battle: { x: 900, y: 4, w: 112, h: 52, label: "Battle", icon: ">", signSrc: "assets/ui/runtime/chalk-sign-battle-v1.webp" },
    battleSpeed: { x: 812, y: 4, w: 126, h: 52, label: "Speed 1x", icon: ">>", signSrc: BATTLE_SPEED_CHALK_SRC, chalkMode: "speed" },
    next: { x: 812, y: 4, w: 150, h: 52, label: "Next", icon: ">" },
    reward0: { x: 718, y: 358, w: 268, h: 50, label: "Reward", icon: "" },
    reward1: { x: 718, y: 418, w: 268, h: 50, label: "Reward", icon: "" },
    reward2: { x: 718, y: 478, w: 268, h: 50, label: "Reward", icon: "" },
    sell: { x: 906, y: 390, w: 92, h: 28, label: "Sell", icon: "" },
    detach: { x: 906, y: 422, w: 92, h: 28, label: "Detach", icon: "" },
  };

  const economyEnemyData = window.FoodAnimalsEconomyEnemyData;
  if (!economyEnemyData) throw new Error("FoodAnimalsEconomyEnemyData must load before game.js");
  const {
    BATTLE_SPEEDS,
    BOSS_BATTLE_SPEEDS,
    ECONOMY,
    ENEMY_ARCHETYPES,
    ENEMY_ARCHETYPE_NOISE,
    ENEMY_ARCHETYPE_PRIMARY_SHARE,
    FINAL_BOSS_SHOP_POWER_ATK_MULTIPLIER,
    FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER,
    GLOBAL_HP_SCALE,
    MERGE_GOLD_REWARD,
    SHOP_POWER_ENEMY_STAT_BONUS_BY_ROUND,
    SHOP_POWER_ENEMY_TIER3_BONUS_BY_ROUND,
    SHOP_POWER_ENEMY_TIER_BONUS_BY_ROUND,
    TIER_SCALING,
  } = economyEnemyData;
  const ATTACK_ANIMATION_SECONDS = 0.32;
  const ATTACK_PROJECTILE_SIZE = 58;
  const ATTACK_PROJECTILE_SPIN_MIN = Math.PI * 1.7;
  const ATTACK_PROJECTILE_SPIN_MAX = Math.PI * 2.7;
  const BATTLE_TIMEOUT_SECONDS = 150;
  const COMBAT_LEDGER_FRAME_SECONDS = 1.00;
  const COMBAT_LEDGER_MAX_FRAMES = 640;
  const COMBAT_LEDGER_MAX_EVENTS = 720;
  const MOLD_START_SECONDS = 48;
  const MOLD_TICK_SECONDS = 1;
  const MOLD_BASE_DAMAGE_PCT = 0.022;
  const MOLD_STACK_DAMAGE_PCT = 0.0072;
  const MOLD_MAX_DAMAGE_PCT = 0.3;
  const statusEffectData = window.FoodAnimalsStatusEffectData;
  if (!statusEffectData) throw new Error("FoodAnimalsStatusEffectData must load before game.js");
  const {
    HORROR_STATUS_EFFECT_SPRITES,
    STATUS_EFFECT_SPRITES,
    STATUS_EFFECT_STYLES,
  } = statusEffectData;
  const rarityShopData = window.FoodAnimalsRarityShopData;
  if (!rarityShopData) throw new Error("FoodAnimalsRarityShopData must load before game.js");
  const {
    HORROR_RARITIES,
    MAX_SHOP_LEVEL,
    RARITIES,
    SHOP_LEVELS,
  } = rarityShopData;
  const itemData = window.FoodAnimalsItemData;
  if (!itemData) throw new Error("FoodAnimalsItemData must load before game.js");
  const {
    ATTACK_PARTICLE_SPRITES,
    ATTACK_PARTICLE_TYPES,
    DRINK_SHOP_CHANCES,
    DRINK_THROWABLE_SPRITES,
    DRINK_THROWABLE_TYPES,
    ITEM_MERGE_GOLD_REWARD,
    ITEM_SCALABLE_PROPS,
    ITEM_SPRITES,
    ITEM_TIER_SCALING,
    ITEM_TIER_SPRITES,
    ITEMS,
    MAX_ITEM_TIER,
    REALITY_ATTACK_PARTICLE_SPRITES,
    REALITY_DRINK_THROWABLE_SPRITES,
    REALITY_ITEM_SPRITES,
    REALITY_ITEM_TIER_SPRITES,
    SHOP_SALE_CHANCES,
    SHOP_TIER_COST_MULTIPLIERS,
    TOPPING_SHOP_CHANCES,
  } = itemData;

  const state = {
    phase: "prep",
    round: 1,
    gold: ECONOMY.startingGold,
    hearts: 10,
    shopLevel: 1,
    message: "Prep",
    shop: [],
    shopFrozen: Array(shopSlots.length).fill(false),
    shopSales: Array(shopSlots.length).fill(false),
    shopUnlocked: initialShopUnlocked(),
    bench: Array(8).fill(null),
    itemBench: Array(itemBenchSlots.length).fill(null),
    board: Array(boardSlots.length).fill(null),
    drinks: Array(drinkSlots.length).fill(null),
    selected: null,
    codexOpen: false,
    codexTab: "food",
    codexSelectedId: CATALOG[0]?.id || null,
    codexSelectedFormTier: 1,
    codexSelectedItemTier: 1,
    codexSelectedToppingId: null,
    codexSelectedDrinkId: null,
    codexFilters: JSON.parse(JSON.stringify(CODEX_DEFAULT_FILTERS)),
    codexPreview: {
      zoom: 1,
      panX: 0,
      panY: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      startPanX: 0,
      startPanY: 0,
    },
    hover: null,
    pointer: null,
    tooltipTargets: [],
    drag: null,
    battle: null,
    postCombatBattle: null,
    arenaId: randomArenaId(),
    runSeed: rngState.seed,
    rngCalls: rngState.calls,
    keepArenaNextRound: false,
    arenaHoldNotice: null,
    arenaScout: null,
    arenaPrepBuff: null,
    enemyPreview: null,
    rewardChoices: [],
    runMode: initialRunMode(),
    lastCombatLedger: null,
    combatLedgerReview: {
      open: false,
      unitUid: "all",
      filter: "all",
      frameIndex: -1,
      logScrollOffset: 0,
      focusedEventSeq: null,
      eventTypeFilters: { damage: true, support: true, ko: true, control: true },
      bigMomentsOnly: false,
    },
    optionsMenu: {
      open: false,
      selected: "resume",
      savedAt: null,
      dragSlider: null,
    },
    freeRolls: ECONOMY.freeRollsPerShopLevel,
    rollsThisRound: 0,
    nextShopUpgradeDiscountGold: 0,
    winStreak: 0,
    lossStreak: 0,
    lastIncome: null,
    itemDiscountUsed: false,
    battleSpeedIndex: 0,
    realityBroken: false,
    realityOverride: initialRealityOverride(),
    realityBreakTimer: 0,
    postGiraffeHorrorTransition: null,
    level10RevealCutscene: null,
    shopReturnStaticTransition: null,
    phaseTransition: null,
    modalTransitions: {},
    shopSlotTransitions: Array(shopSlots.length).fill(null),
    rebootTransition: null,
    menuRebootTransition: null,
    finalVictoryTransition: null,
    victoryCutscene: null,
    runConcluded: false,
    activeStory: null,
    seenStoryMilestones: [],
    idleTime: 0,
    lastTime: 0,
    particles: [],
    log: [],
  };
  stateRef = state;
  let activeRunAutosaveTimer = 0;
  let lastActiveRunSaveJson = "";

  const gameMusic = {
    audio: null,
    trackId: null,
    armed: false,
    blocked: false,
    playPromise: null,
    volumeSetting: null,
  };
  const gameSfx = {
    armed: false,
    volumeSetting: null,
    pools: new Map(),
    next: new Map(),
    lastPlayedAt: new Map(),
  };

  function savedGameMusicSetting() {
    return window.FoodAnimalsAudioSettings.readNumber("music", 7, { storageKey: MUSIC_SETTINGS_STORAGE_KEY });
  }

  function savedAudioSettings() {
    return window.FoodAnimalsAudioSettings.read(MUSIC_SETTINGS_STORAGE_KEY);
  }

  function persistAudioSetting(key, value) {
    return window.FoodAnimalsAudioSettings.writeNumber(key, value, { storageKey: MUSIC_SETTINGS_STORAGE_KEY });
  }

  function setGameMusicSetting(value) {
    gameMusic.volumeSetting = persistAudioSetting("music", value);
    if (gameMusic.audio) gameMusic.audio.volume = gameMusicVolume();
    syncGameMusic();
    return gameMusic.volumeSetting;
  }

  function gameMusicVolume() {
    if (gameMusic.volumeSetting === null) gameMusic.volumeSetting = savedGameMusicSetting();
    return (gameMusic.volumeSetting / 10) * GAME_MUSIC_MAX_VOLUME;
  }

  function gameMusicSceneKey() {
    if (state.codexOpen || state.activeStory || state.optionsMenu?.open) return "menu";
    if (state.rebootTransition) return "defeat";
    if (state.finalVictoryTransition || state.phase === "victoryCutscene") return "victory";
    if (state.phase === "battle") return "battle";
    if (state.phase === "result") {
      return state.lastCombatLedger?.result === "loss" || state.hearts <= 0 ? "defeat" : "victory";
    }
    return "prep";
  }

  function currentGameMusicTrack() {
    const themeId = currentCopyThemeId();
    const themeTracks = GAME_MUSIC_TRACKS[themeId] || GAME_MUSIC_TRACKS.cozy;
    return themeTracks[gameMusicSceneKey()] || themeTracks.prep;
  }

  function ensureGameMusicElement(track) {
    return window.FoodAnimalsAudioRuntime.ensureMusicElement(gameMusic, track);
  }

  function syncGameMusic() {
    window.FoodAnimalsAudioRuntime.syncMusic(gameMusic, {
      track: currentGameMusicTrack(),
      volume: gameMusicVolume(),
    });
  }

  function armGameMusic() {
    gameMusic.armed = true;
    syncGameMusic();
  }

  function pauseGameMusicForHiddenTab() {
    if (!window.FoodAnimalsAudioRuntime.pauseForHiddenTab(gameMusic) && gameMusic.armed) {
      syncGameMusic();
    }
  }

  function savedGameSfxSetting() {
    return window.FoodAnimalsAudioSettings.readNumber("sfx", 8, { storageKey: MUSIC_SETTINGS_STORAGE_KEY });
  }

  function gameSfxVolume() {
    if (gameSfx.volumeSetting === null) gameSfx.volumeSetting = savedGameSfxSetting();
    return gameSfx.volumeSetting / 10;
  }

  function setGameSfxSetting(value) {
    gameSfx.volumeSetting = persistAudioSetting("sfx", value);
    return gameSfx.volumeSetting;
  }

  function gameSfxSrc(id, themeId = currentCopyThemeId()) {
    const themeTracks = GAME_SFX_TRACKS[themeId] || GAME_SFX_TRACKS.cozy;
    return themeTracks[id] || GAME_SFX_TRACKS.cozy[id] || null;
  }

  function sfxPoolFor(src) {
    return window.FoodAnimalsAudioRuntime.poolFor(gameSfx, src, 4);
  }

  function playGameSfx(id, options = {}) {
    const baseVolume = gameSfxVolume();
    window.FoodAnimalsAudioRuntime.playSfx(gameSfx, {
      src: gameSfxSrc(id, options.theme || currentCopyThemeId()),
      force: options.force,
      volume: baseVolume * (options.volume ?? 1),
      rate: options.rate,
      poolSize: 4,
    });
  }

  function playThrottledGameSfx(key, id, options = {}, interval = 0.08) {
    const now = state.idleTime || 0;
    const last = gameSfx.lastPlayedAt.get(key) ?? -Infinity;
    if (now - last < interval) return null;
    gameSfx.lastPlayedAt.set(key, now);
    return playGameSfx(id, options);
  }

  function armGameSfx() {
    gameSfx.armed = true;
  }

  const pixelSpriteCache = new Map();
  const tintedSpriteCache = new Map();
  const runtimeSpriteCache = new Map();
  const runtimeSpriteMetricsCache = new Map();
  const itemSpriteMetricsCache = new Map();
  const itemSpriteCache = new Map();
  const attackParticleSpriteCache = new Map();
  const particleSpriteCache = new Map();
  const drinkThrowableSpriteCache = new Map();
  const statusEffectSpriteCache = new Map();
  const uiSpriteCache = new Map();
  function canUseLocalStorage() {
    return window.FoodAnimalsRunStorage.canUseLocalStorage(ACTIVE_RUN_STORAGE_KEY);
  }

  function currentGameRoute() {
    const url = new URL(window.location.href);
    url.searchParams.delete("embed");
    url.searchParams.delete("screen");
    url.searchParams.delete("continue");
    url.searchParams.delete("from");
    url.searchParams.delete("probe");
    if (realityBroken()) {
      url.searchParams.set("theme", "horror");
    } else {
      url.searchParams.delete("theme");
    }
    return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  }

  function shouldMarkActiveRunRoute() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("embed") === "opening-vn") return false;
      if (params.get("screen") === "opening-tutorial-shop") return false;
      return true;
    } catch {
      return true;
    }
  }

  const RUN_SNAPSHOT_KEYS = [
    "phase",
    "runMode",
    "round",
    "gold",
    "hearts",
    "shopLevel",
    "message",
    "shop",
    "shopFrozen",
    "shopSales",
    "shopUnlocked",
    "bench",
    "itemBench",
    "board",
    "drinks",
    "battle",
    "postCombatBattle",
    "arenaId",
    "runSeed",
    "rngCalls",
    "keepArenaNextRound",
    "arenaHoldNotice",
    "arenaScout",
    "arenaPrepBuff",
    "enemyPreview",
    "rewardChoices",
    "lastCombatLedger",
    "combatLedgerReview",
    "freeRolls",
    "rollsThisRound",
    "nextShopUpgradeDiscountGold",
    "winStreak",
    "lossStreak",
    "lastIncome",
    "itemDiscountUsed",
    "battleSpeedIndex",
    "realityBroken",
    "realityOverride",
    "realityBreakTimer",
    "postGiraffeHorrorTransition",
    "level10RevealCutscene",
    "shopReturnStaticTransition",
    "rebootTransition",
    "finalVictoryTransition",
    "victoryCutscene",
    "activeStory",
    "seenStoryMilestones",
    "idleTime",
    "log",
  ];
  const RUN_SNAPSHOT_COMPACT_KEYS = new Set(["battle", "postCombatBattle", "lastCombatLedger"]);

  function cloneRunValue(value) {
    return window.FoodAnimalsRunStorage.cloneValue(value);
  }

  function createRunSnapshot() {
    syncRngState();
    const result = state.lastIncome?.result || state.lastCombatLedger?.result || state.postCombatBattle?.result || null;
    const heartDamage = Math.max(0, Math.round(state.lastCombatLedger?.heartDamage || 0));
    const snapshot = {
      version: 1,
      unitSeq,
      runSeed: rngState.seed,
      rngCalls: rngState.calls,
      savedAt: new Date().toISOString(),
      state: {},
    };
    RUN_SNAPSHOT_KEYS.forEach((key) => {
      if (RUN_SNAPSHOT_COMPACT_KEYS.has(key)) return;
      snapshot.state[key] = cloneRunValue(state[key]);
    });
    snapshot.state.selected = null;
    snapshot.state.hover = null;
    snapshot.state.pointer = null;
    snapshot.state.tooltipTargets = [];
    snapshot.state.drag = null;
    snapshot.state.battle = null;
    snapshot.state.postCombatBattle = null;
    snapshot.state.lastCombatLedger = result
      ? { result, heartDamage, units: {}, events: [], frames: [] }
      : null;
    if (snapshot.state.phase === "battle") {
      snapshot.state.phase = "prep";
      snapshot.state.message = "Battle interrupted";
    }
    snapshot.state.codexOpen = false;
    snapshot.state.optionsMenu = { open: false, selected: "resume", savedAt: snapshot.savedAt, dragSlider: null };
    if (snapshot.state.codexPreview) snapshot.state.codexPreview.dragging = false;
    return snapshot;
  }

  function maxUidInValue(value) {
    if (!value || typeof value !== "object") return 0;
    let max = Number.isFinite(value.uid) ? value.uid : 0;
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        max = Math.max(max, maxUidInValue(entry));
      });
      return max;
    }
    Object.values(value).forEach((entry) => {
      max = Math.max(max, maxUidInValue(entry));
    });
    return max;
  }

  function restoreRunSnapshot(snapshot) {
    if (!snapshot?.state || typeof snapshot.state !== "object") return false;
    const restored = cloneRunValue(snapshot.state);
    Object.assign(state, restored);
    state.runMode = normalizeRunMode(state.runMode);
    state.optionsMenu = { open: false, selected: "resume", savedAt: snapshot.savedAt || null, dragSlider: null };
    state.pointer = null;
    state.hover = null;
    state.tooltipTargets = [];
    state.drag = null;
    if (state.codexPreview) state.codexPreview.dragging = false;
    rngState = rngRuntime.createState(state.runSeed || snapshot.runSeed || rngState.seed, state.rngCalls);
    syncRngState();
    unitSeq = Math.max(Number(snapshot.unitSeq) || 1, maxUidInValue(restored) + 1);
    state.message = state.message || "Run loaded";
    ensureEnemyPreview();
    return true;
  }

  function savedRunRecord() {
    return window.FoodAnimalsRunStorage.read(ACTIVE_RUN_STORAGE_KEY);
  }

  function shouldRestoreSavedRun() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("continue") === "1" || params.get("restore") === "1";
    } catch {
      return false;
    }
  }

  function writeActiveRunRecord(snapshot = null) {
    if (state.runConcluded || !canUseLocalStorage() || !shouldMarkActiveRunRoute()) return false;
    const now = new Date().toISOString();
    const previous = window.FoodAnimalsRunStorage.read(ACTIVE_RUN_STORAGE_KEY);
    const runSnapshot = snapshot || previous?.snapshot || null;
    const summaryState = runSnapshot?.state || state;
    return window.FoodAnimalsRunStorage.write(window.FoodAnimalsRunStorage.buildRecord({
      now,
      previous,
      snapshot: runSnapshot,
      summaryState,
      route: currentGameRoute(),
      theme: realityBroken() ? "horror" : "cozy",
    }), ACTIVE_RUN_STORAGE_KEY);
  }

  function markActiveRunRoute() {
    saveCurrentRun({ message: false, silent: true });
  }

  function saveCurrentRun(options = {}) {
    if (state.runConcluded) return false;
    if (state.menuRebootTransition) return false;
    let snapshot = null;
    try {
      snapshot = createRunSnapshot();
    } catch {
      if (!options.silent) {
        state.message = "Save unavailable";
        playGameSfx("invalid", { volume: 0.55 });
      }
      return false;
    }
    const saved = writeActiveRunRecord(snapshot);
    if (saved) {
      if (state.optionsMenu) state.optionsMenu.savedAt = snapshot.savedAt;
      if (!options.silent && options.message !== false) state.message = "Run saved";
      if (!options.silent) playGameSfx("ui-confirm", { volume: 0.54 });
    } else if (!options.silent) {
      state.message = "Save unavailable";
      playGameSfx("invalid", { volume: 0.55 });
    }
    return saved;
  }

  function saveCurrentRunSilently() {
    return saveCurrentRun({ message: false, silent: true });
  }

  function updateRunAutosave(dt) {
    if (state.runConcluded) return;
    if (!shouldMarkActiveRunRoute()) return;
    activeRunAutosaveTimer += dt;
    if (activeRunAutosaveTimer < ACTIVE_RUN_AUTOSAVE_SECONDS) return;
    activeRunAutosaveTimer = 0;
    saveCurrentRunSilently();
  }

  function restoreSavedRunIfRequested() {
    if (!shouldRestoreSavedRun()) return false;
    const record = savedRunRecord();
    if (!record?.snapshot) return false;
    const restored = restoreRunSnapshot(record.snapshot);
    if (restored) state.message = "Run loaded";
    return restored;
  }

  function clearActiveRunRoute() {
    window.FoodAnimalsRunStorage.clear(ACTIVE_RUN_STORAGE_KEY);
  }

  function markGameCompleted() {
    state.runConcluded = true;
    if (!canUseLocalStorage()) return false;
    try {
      clearActiveRunRoute();
      window.localStorage.setItem(GAME_COMPLETED_STORAGE_KEY, "1");
      return true;
    } catch {
      return false;
    }
  }

  function markHorrorRevealed() {
    if (!canUseLocalStorage()) return false;
    try {
      window.localStorage.setItem(HORROR_REVEALED_STORAGE_KEY, "1");
      return true;
    } catch {
      return false;
    }
  }

  function markRunConcluded() {
    state.runConcluded = true;
    clearActiveRunRoute();
  }

  function mainMenuUrl() {
    return new URL("../", window.location.href).href;
  }

  function markMenuRebootStaticReveal() {
    try {
      const targetWindow = window.top && window.top !== window ? window.top : window;
      targetWindow.sessionStorage?.setItem(MENU_REBOOT_STATIC_STORAGE_KEY, "1");
    } catch {
      try {
        window.sessionStorage?.setItem(MENU_REBOOT_STATIC_STORAGE_KEY, "1");
      } catch {
        // The menu handoff should still navigate if session storage is unavailable.
      }
    }
  }

  function markMenuReturnReveal() {
    try {
      const targetWindow = window.top && window.top !== window ? window.top : window;
      targetWindow.sessionStorage?.setItem(MENU_RETURN_REVEAL_STORAGE_KEY, "1");
    } catch {
      try {
        window.sessionStorage?.setItem(MENU_RETURN_REVEAL_STORAGE_KEY, "1");
      } catch {
        // Returning to the menu should still navigate if session storage is unavailable.
      }
    }
  }

  function markHorrorMenuUnlocked() {
    if (!canUseLocalStorage()) return;
    try {
      markGameCompleted();
      window.localStorage.setItem(HORROR_MENU_UNLOCK_STORAGE_KEY, "1");
      const settings = window.FoodAnimalsAudioSettings.read(MUSIC_SETTINGS_STORAGE_KEY);
      settings.menuTheme = "horror";
      settings.musicTrack = "horror-market";
      window.FoodAnimalsAudioSettings.write(settings, MUSIC_SETTINGS_STORAGE_KEY);
    } catch {
      // Unlocking the post-game menu should not block the final return.
    }
  }

  function navigateToMainMenu() {
    const target = mainMenuUrl();
    try {
      if (window.top && window.top !== window) {
        window.top.location.href = target;
      } else {
        window.location.href = target;
      }
    } catch {
      window.location.href = target;
    }
  }

  function exitToMainMenuWithSave() {
    saveCurrentRun({ message: false });
    state.optionsMenu.open = false;
    return startShopReturnTransitionOverlay({
      source: "normalMenuReturn",
      message: "Run saved - returning to menu",
    });
  }
  const backgroundImageCache = new Map();
  let unitSeq = 1;

  function randInt(max) {
    return Math.floor(random() * max);
  }

  function isItem(entry) {
    return entry?.kind === "item";
  }

  function isDrink(entry) {
    return isItem(entry) && entry.type === "drink";
  }

  function isTopping(entry) {
    return isItem(entry) && entry.type !== "drink";
  }

  function isUnit(entry) {
    return Boolean(entry) && entry.kind !== "item";
  }

  function itemInfo(itemId) {
    return ITEMS.find((item) => item.id === itemId) || ITEMS[0];
  }

  function itemTier(tier = 1) {
    return window.FoodAnimalsCatalogRuntime.itemTier(tier, MAX_ITEM_TIER);
  }

  function itemTierScale(tier = 1) {
    return window.FoodAnimalsCatalogRuntime.itemTierScale(tier, ITEM_TIER_SCALING);
  }

  function itemLevelLabel(item) {
    return window.FoodAnimalsCatalogRuntime.itemLevelLabel(item, MAX_ITEM_TIER);
  }

  function itemDisplayShort(item) {
    return window.FoodAnimalsCatalogRuntime.itemDisplayShort(item, displayItemShort, MAX_ITEM_TIER);
  }

  function scaleItemForTier(item, tier = 1) {
    return window.FoodAnimalsCatalogRuntime.scaleItemForTier(item, tier, {
      scaling: ITEM_TIER_SCALING,
      scalableProps: ITEM_SCALABLE_PROPS,
    });
  }

  function makeItem(itemId = "sunny_side_egg", tier = 1) {
    const item = itemInfo(itemId);
    return window.FoodAnimalsCatalogRuntime.makeItemData(item, tier, unitSeq++, {
      maxTier: MAX_ITEM_TIER,
      scaling: ITEM_TIER_SCALING,
      scalableProps: ITEM_SCALABLE_PROPS,
    });
  }

  function cloneItem(item) {
    return item ? { ...item } : null;
  }

  function baseEntryCost(entry) {
    return isItem(entry) ? entry.price || ECONOMY.itemCost : ECONOMY.unitCost;
  }

  function shopTierCostMultiplier(entry) {
    const tier = isItem(entry) ? itemTier(entry?.tier) : Math.max(1, entry?.tier || 1);
    return window.FoodAnimalsShopEconomy.tierCostMultiplier(SHOP_TIER_COST_MULTIPLIERS, tier);
  }

  function entryCost(entry) {
    return baseEntryCost(entry) * shopTierCostMultiplier(entry);
  }

  function shopSlotOnSale(index) {
    return Boolean(shopEntryAt(index) && state.shopSales[index]);
  }

  function currentShopSaleChance() {
    return window.FoodAnimalsShopEconomy.levelChance(SHOP_SALE_CHANCES, MAX_SHOP_LEVEL, state.shopLevel, 0.08);
  }

  function rollShopSlotSale(index, entry) {
    return Boolean(isShopSlotUnlocked(index) && entry && random() < currentShopSaleChance());
  }

  function saleAdjustedEntryCost(entry, shopIndex = null) {
    const baseCost = entryCost(entry);
    if (shopIndex === null || !shopSlotOnSale(shopIndex)) return baseCost;
    return Math.max(1, Math.ceil(baseCost / 2));
  }

  function purchaseCost(entry, shopIndex = null) {
    const baseCost = saleAdjustedEntryCost(entry, shopIndex);
    if (!isItem(entry)) return baseCost;
    const discount = availableItemDiscount();
    return Math.max(0, baseCost - discount);
  }

  function normalizedPurchaseGold(value) {
    return window.FoodAnimalsShopEconomy.normalizedPurchaseGold(value);
  }

  function trackedPurchaseGold(entry) {
    return normalizedPurchaseGold(entry?.purchaseGold);
  }

  function tagPurchasedEntry(entry, cost) {
    const paid = normalizedPurchaseGold(cost);
    if (entry && paid !== null) entry.purchaseGold = paid;
    return entry;
  }

  function availableItemDiscount() {
    if (state.itemDiscountUsed) return 0;
    return ownedItemMax("firstItemDiscountGold");
  }

  function markItemDiscountUsed(entry, shopIndex, finalCost) {
    if (!isItem(entry)) return;
    if (finalCost < saleAdjustedEntryCost(entry, shopIndex)) state.itemDiscountUsed = true;
  }

  function ownedItemMax(prop) {
    return allOwnedRefs().reduce((best, ref) => Math.max(best, ref.unit.item?.[prop] || 0), 0);
  }

  function ownedAbilityMax(ability, valueFn) {
    return allOwnedRefs()
      .filter((ref) => ref.unit.ability === ability)
      .reduce((best, ref) => Math.max(best, valueFn(ref.unit)), 0);
  }

  function entryLabel(entry) {
    return isItem(entry) ? itemDisplayShort(entry) : entry?.short || "Empty";
  }

  function itemDamageMultiplier(unit) {
    return 1 + (unit?.item?.damageBonusPct || 0);
  }

  function itemPrimaryCardText(item) {
    const stat = itemPrimaryStat(item);
    if (stat.label === "LINE") return `Line ${stat.value}`;
    if (stat.label === "DMG") return `${stat.value} dmg`;
    if (stat.label === "SPD") return `${stat.value} spd`;
    if (stat.label === "HP") return `${stat.value} HP`;
    if (stat.label === "PWR") return `${stat.value} PWR`;
    if (typeof stat.value === "string" && /^[+-]?\d+%$/.test(stat.value)) return `${stat.label.toLowerCase()} ${stat.value}`;
    return null;
  }

  function itemCardText(item) {
    return themedGeneratedText(itemPrimaryCardText(item) || item?.cardText || item?.abilityText || displayEntryTypeLabel(item));
  }

  function percentText(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function drinkPairLabel(item) {
    return (item?.pairTraits || []).map((traitId) => traitDisplayText(traitId)).join("/");
  }

  function drinkPairSpecLine(item) {
    if (!isDrink(item) || !item.pairTraits?.length) return null;
    const bonuses = [];
    if (item.pairedDrinkAttackSpeedPct) bonuses.push(`+${percentText(item.pairedDrinkAttackSpeedPct)} speed`);
    if (item.pairedDrinkMaxHpPct) bonuses.push(`+${percentText(item.pairedDrinkMaxHpPct)} HP`);
    if (item.pairedDrinkAbilityPowerPct) bonuses.push(`+${percentText(item.pairedDrinkAbilityPowerPct)} PWR`);
    return `${drinkPairLabel(item)} pair: ${bonuses.join(", ")}`;
  }

  function unitMatchesDrinkPair(unit, drink) {
    return Boolean(unit && drink?.pairTraits?.some((traitId) => unitHasTrait(unit, traitId)));
  }

  function drinkPulseUnlocked(drink) {
    return isDrink(drink) && Boolean(drink.drinkPulseType);
  }

  function drinkPulseTierScale(drink) {
    return itemTierScale(drink?.tier) / itemTierScale(2);
  }

  function drinkPulseSpecLine(drink, unlockedText = false) {
    if (!isDrink(drink) || !drink.drinkPulseType) return "";
    const interval = drink.drinkPulseInterval || 5;
    const duration = drink.drinkPulseDuration || 2.4;
    const scale = unlockedText ? drinkPulseTierScale(drink) : 1;
    const prefix = "Pulse";
    if (drink.drinkPulseType === "shield") {
      return `${prefix}: every ${interval}s, line gains ${percentText((drink.drinkPulseShieldPct || 0) * scale)} max HP shield`;
    }
    if (drink.drinkPulseType === "haste") {
      return `${prefix}: every ${interval}s, line gains +${percentText((drink.drinkPulseHastePct || 0) * scale)} speed for ${duration}s`;
    }
    if (drink.drinkPulseType === "heal") {
      return `${prefix}: every ${interval}s, weakest line ally heals ${percentText((drink.drinkPulseHealPct || 0) * scale)} max HP`;
    }
    if (drink.drinkPulseType === "brine") {
      return `${prefix}: every ${interval}s, enemy line takes ${percentText((drink.drinkPulseEnemyDamagePct || 0) * scale)} max HP and slows`;
    }
    if (drink.drinkPulseType === "attack_boost") {
      return `${prefix}: every ${interval}s, line gains +${percentText((drink.drinkPulseAttackBoostPct || 0) * scale)} damage for ${duration}s`;
    }
    return `${prefix}: every ${interval}s, line surges`;
  }

  function drinkTechnicalDescriptionLines(item) {
    if (!isDrink(item)) return [];
    return itemSpecLines(item);
  }

  function drinkTechnicalDescription(item) {
    return drinkTechnicalDescriptionLines(item).map((line) => `- ${line}`).join("\n");
  }

  function drinkStatLevelEffectLine(item) {
    if (!isDrink(item)) return itemCompactSpecLine(item);
    const parts = [];
    if (item.drinkAttackSpeedPct) parts.push(`line speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) parts.push(`line health +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) parts.push(`line ability +${percentText(item.drinkAbilityPowerPct)}`);

    const pairEffects = [];
    if (item.pairedDrinkAttackSpeedPct) pairEffects.push(`speed +${percentText(item.pairedDrinkAttackSpeedPct)}`);
    if (item.pairedDrinkMaxHpPct) pairEffects.push(`health +${percentText(item.pairedDrinkMaxHpPct)}`);
    if (item.pairedDrinkAbilityPowerPct) pairEffects.push(`ability +${percentText(item.pairedDrinkAbilityPowerPct)}`);
    if (pairEffects.length) parts.push(`pair ${pairEffects.join(", ")}`);

    return parts.join("; ") || itemCompactSpecLine(item);
  }

  function drinkSpecialUnlockLines(item) {
    if (!isDrink(item) || !item.drinkPulseType) return ["No pulse effect."];
    return [drinkPulseSpecLine(item, drinkPulseUnlocked(item))];
  }

  function drinkCompactLevelEffectLine(item) {
    if (!isDrink(item)) return itemCompactSpecLine(item);
    const parts = [];
    if (item.drinkAttackSpeedPct) parts.push(`line speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) parts.push(`line health +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) parts.push(`line ability +${percentText(item.drinkAbilityPowerPct)}`);

    const pairEffects = [];
    if (item.pairedDrinkAttackSpeedPct) pairEffects.push(`speed +${percentText(item.pairedDrinkAttackSpeedPct)}`);
    if (item.pairedDrinkMaxHpPct) pairEffects.push(`health +${percentText(item.pairedDrinkMaxHpPct)}`);
    if (item.pairedDrinkAbilityPowerPct) pairEffects.push(`ability +${percentText(item.pairedDrinkAbilityPowerPct)}`);
    if (pairEffects.length) parts.push(`pair ${pairEffects.join(", ")}`);

    if (drinkPulseUnlocked(item)) {
      const pulse = drinkPulseSpecLine(item, true)
        .replace(/^Pulse: every /, "pulse ")
        .replace(/, line gains /, " ")
        .replace(/weakest line ally heals /, "heal ")
        .replace(/enemy line takes /, "enemy ")
        .replace(/max HP/g, "health")
        .replace(/ for /, "/")
        .replace(/\.$/, "");
      parts.push(pulse);
    }
    return parts.join("; ");
  }

  function itemSpecLines(item) {
    if (!item) return [`No ${toppingTerm({ lower: true })} specs`];
    const lines = [];
    if (item.drinkAttackSpeedPct) lines.push(`${drinkLineTerm()}: attack speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) lines.push(`${drinkLineTerm()}: max HP +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) lines.push(`${drinkLineTerm()}: ability power +${percentText(item.drinkAbilityPowerPct)}`);
    const pairLine = drinkPairSpecLine(item);
    if (pairLine) lines.push(pairLine);
    const pulseLine = drinkPulseSpecLine(item, drinkPulseUnlocked(item));
    if (pulseLine) lines.push(pulseLine);
    if (item.damageBonusPct) lines.push(`Damage +${percentText(item.damageBonusPct)}`);
    if (item.attackSpeedPct) lines.push(`Attack speed +${percentText(item.attackSpeedPct)}`);
    if (item.maxHpBonusPct) lines.push(`Max HP +${percentText(item.maxHpBonusPct)}`);
    if (item.abilityPowerBonusPct) lines.push(`Ability power +${percentText(item.abilityPowerBonusPct)}`);
    if (item.damageTakenPct) lines.push(`Damage taken +${percentText(item.damageTakenPct)}`);
    if (item.onAttackShieldPct) lines.push(`On attack: shield ${percentText(item.onAttackShieldPct)} max HP + PWR scaling`);
    if (item.onHitShieldPct) lines.push(`On hit: shield ${percentText(item.onHitShieldPct)} max HP`);
    if (item.shieldCrackleDamagePct) lines.push(`When shielded hit: crackle back ${percentText(item.shieldCrackleDamagePct)} max HP damage`);
    if (item.burnDamagePct) lines.push(`Attacks burn for ${percentText(item.burnDamagePct)} ATK each tick (${item.burnDuration || 3}s)`);
    if (item.supportBonusPct) lines.push(`Heals/shields +${percentText(item.supportBonusPct)}`);
    if (item.markDamagePct) lines.push(`Attacks mark: +${percentText(item.markDamagePct)} holder damage (${item.markDuration || 4}s)`);
    if (item.selfHealPct) lines.push(`Every ${item.everyNAttacks || 3} attacks: heal ${percentText(item.selfHealPct)} max HP`);
    if (item.splashDamagePct) lines.push(`Attacks splash adjacent enemies for ${percentText(item.splashDamagePct)} ATK`);
    if (item.lateFightDamagePct) lines.push(`After ${item.lateFightStart || 8}s: +${percentText(item.lateFightDamagePct)} damage per stack, max ${item.lateFightMaxStacks || 4}`);
    if (item.lowHpAttackSpeedPct) lines.push(`Below ${percentText(item.lowHpThreshold || 0.5)} HP: +${percentText(item.lowHpAttackSpeedPct)} speed`);
    if (item.lowHpLifestealPct) lines.push(`Below ${percentText(item.lowHpThreshold || 0.5)} HP: ${percentText(item.lowHpLifestealPct)} lifesteal`);
    if (item.cooldownDelay) lines.push(`Attacks delay target cooldown by ${item.cooldownDelay.toFixed(2)}s`);
    if (item.supportHastePct) lines.push(`Supported allies gain +${percentText(item.supportHastePct)} speed for ${item.supportHasteDuration || 3}s`);
    if (item.antiSupportPct) lines.push(`Attacks cut enemy heals/shields by ${percentText(item.antiSupportPct)} for ${item.antiSupportDuration || 4}s`);
    if (item.receivedSupportSharePct) lines.push(`Shares ${percentText(item.receivedSupportSharePct)} received support with adjacent allies`);
    if (item.bounceDamagePct) lines.push(`Attacks bounce for ${percentText(item.bounceDamagePct)} ATK`);
    if (item.shieldedAttackBonusPct) lines.push(`While shielded: damage +${percentText(item.shieldedAttackBonusPct)}`);
    if (item.overhealShieldPct) lines.push(`Overheal converts to shield at ${percentText(item.overhealShieldPct)}`);
    if (item.mergeProgressBonus) lines.push(`Bench holder counts as +${item.mergeProgressBonus} merge copy`);
    if (item.frontRowDamageReductionPct) lines.push(`Front row: damage taken -${percentText(item.frontRowDamageReductionPct)}`);
    if (item.backRowTargeting) lines.push(`Back-row holder targets enemy back row`);
    if (item.adjacentStartShieldPct) lines.push(`Battle start: adjacent allies gain ${percentText(item.adjacentStartShieldPct)} max HP shield`);
    if (item.adjacentStartAttackBuffPct) lines.push(`Battle start: adjacent allies gain +${percentText(item.adjacentStartAttackBuffPct)} damage for ${item.adjacentStartBuffDuration || 4}s`);
    if (item.adjacentPulseShieldPct) lines.push(`Every ${item.adjacentPulseInterval || 7}s: adjacent allies gain ${percentText(item.adjacentPulseShieldPct)} max HP shield`);
    if (item.adjacentPulseAttackBuffPct) lines.push(`Every ${item.adjacentPulseInterval || 7}s: adjacent allies gain +${percentText(item.adjacentPulseAttackBuffPct)} damage for ${item.adjacentPulseDuration || 2.5}s`);
    if (item.pierceDamagePct) lines.push(`Attacks pierce behind target for ${percentText(item.pierceDamagePct)} ATK`);
    if (item.lowHpBurnDamagePct) {
      const repeat = item.lowHpBurnInterval ? `, repeats every ${item.lowHpBurnInterval}s while low` : "";
      lines.push(`At low HP: nearby burn for ${percentText(item.lowHpBurnDamagePct)} ATK (${item.lowHpBurnDuration || 3}s)${repeat}`);
    }
    if (item.deathSaveShieldPct) lines.push(`Once per battle: survive fatal hit with ${percentText(item.deathSaveShieldPct)} max HP shield`);
    if (item.firstDebuffCleanseHealPct) lines.push(`First debuff: cleanse and heal ${percentText(item.firstDebuffCleanseHealPct)} max HP`);
    if (item.timedHastePct) {
      const repeat = item.timedHasteInterval ? `, repeats every ${item.timedHasteInterval}s` : "";
      lines.push(`At ${item.timedHasteAt || 10}s: +${percentText(item.timedHastePct)} speed for ${item.timedHasteDuration || 4}s${repeat}`);
    }
    if (item.shieldedTargetDamagePct) lines.push(`Vs shielded targets: damage +${percentText(item.shieldedTargetDamagePct)}`);
    if (item.attackSlowPct) lines.push(`Attacks slow enemy speed by ${percentText(item.attackSlowPct)} for ${item.attackSlowDuration || 3}s`);
    if (item.statusDurationReductionPct) lines.push(`Negative statuses and cooldown delays fade ${percentText(item.statusDurationReductionPct)} faster`);
    if (item.statusDamageReductionPct) lines.push(`Splash/status damage taken -${percentText(item.statusDamageReductionPct)}`);
    if (item.decoyHpPct) lines.push(`Battle start: summon decoy with ${percentText(item.decoyHpPct)} max HP`);
    if (item.firstHitRedirect) lines.push(`First direct hit is redirected once`);
    if (item.periodicDamage) lines.push(`Every ${item.periodicInterval || 3}s: random chip damage scales from ${item.periodicDamage} + ${percentText(item.periodicDamagePct || 0)} PWR`);
    if (item.sellBonusGold) lines.push(`Sell value +${item.sellBonusGold} ${currencyTerm({ lower: true })}`);
    if (item.surviveGold) lines.push(`Survive battle: +${item.surviveGold} ${currencyTerm({ lower: true })}`);
    if (item.firstItemDiscountGold) lines.push(`First ${toppingTerm({ lower: true })} each round costs ${item.firstItemDiscountGold} fewer ${currencyTerm({ lower: true })}`);
    if (item.sameLineShopChancePct) lines.push(`${realityBroken() ? "Scan" : "Shop"} owned-line chance +${percentText(item.sameLineShopChancePct)}`);
    if (item.extraAdjacentHealPct) lines.push(`Healing splashes ${percentText(item.extraAdjacentHealPct)} to one adjacent ally`);
    if (item.shieldCapBonusPct) lines.push(`Holder shield cap +${percentText(item.shieldCapBonusPct)}`);
    if (item.statusDurationBonusPct) lines.push(`Inflicted statuses last +${percentText(item.statusDurationBonusPct)}`);
    if (item.supportAttackBuffPct) lines.push(`Supported allies gain +${percentText(item.supportAttackBuffPct)} damage for ${item.supportAttackBuffDuration || 3}s`);
    if (item.battleStartHpLossPct) lines.push(`Battle start: holder loses ${percentText(item.battleStartHpLossPct)} max HP`);
    if (item.firstAttacksBonusPct) lines.push(`First ${item.firstAttacksCount || 3} attacks: +${percentText(item.firstAttacksBonusPct)} damage`);
    if (item.exhaustedSpeedPenaltyPct) lines.push(`After burst: speed -${percentText(item.exhaustedSpeedPenaltyPct)}`);
    if (item.selfBurnDamagePct) lines.push(`Self-burns ${percentText(item.selfBurnDamagePct)} max HP each second`);
    if (item.shieldedAttackSpeedPct) lines.push(`While shielded: speed +${percentText(item.shieldedAttackSpeedPct)}`);
    if (item.teamVulnerabilityPct) lines.push(`Attacks make target take +${percentText(item.teamVulnerabilityPct)} team damage for ${item.teamVulnerabilityDuration || 4}s`);
    if (item.executeSplashBonusPct) lines.push(`Vs wounded targets: +${percentText(item.executeSplashBonusPct)} damage`);
    if (item.executeSplashDamagePct) lines.push(`Wounded hits splash for ${percentText(item.executeSplashDamagePct)} ATK`);
    if (item.teamOverhealShieldPct) lines.push(`Overhealing holder shields adjacent allies at ${percentText(item.teamOverhealShieldPct)}`);
    if (item.teamHastePct) lines.push(`Every ${item.teamHasteInterval || 5}s: team +${percentText(item.teamHastePct)} speed for ${item.teamHasteDuration || 2.5}s`);
    if (item.supportRowEchoPct) lines.push(`Support echoes row shield for ${percentText(item.supportRowEchoPct)} PWR`);
    return lines.length ? lines : [themedGeneratedText(item.abilityText || item.cardText || `Single-use ${toppingTerm({ lower: true })} effect`)];
  }

  function itemCompactSpecLine(item) {
    if (!item) return `No ${toppingTerm({ lower: true })} specs`;
    if (isDrink(item) && item.pairTraits?.length) {
      const effect = item.drinkAttackSpeedPct ? "speed" : item.drinkMaxHpPct ? "HP" : item.drinkAbilityPowerPct ? "PWR" : "buff";
      return `${drinkPairLabel(item)} ${effect}`;
    }
    if (item.drinkAttackSpeedPct) return `line speed +${percentText(item.drinkAttackSpeedPct)}`;
    if (item.drinkMaxHpPct) return `line HP +${percentText(item.drinkMaxHpPct)}`;
    if (item.drinkAbilityPowerPct) return `line PWR +${percentText(item.drinkAbilityPowerPct)}`;
    if (item.damageBonusPct && item.damageTakenPct) return `+${percentText(item.damageBonusPct)} dmg, +${percentText(item.damageTakenPct)} taken`;
    if (item.damageBonusPct) return `+${percentText(item.damageBonusPct)} damage`;
    if (item.attackSpeedPct) return `+${percentText(item.attackSpeedPct)} attack speed`;
    if (item.maxHpBonusPct) return `+${percentText(item.maxHpBonusPct)} max HP`;
    if (item.abilityPowerBonusPct) return `+${percentText(item.abilityPowerBonusPct)} PWR`;
    if (item.onAttackShieldPct) return `attack shield ${percentText(item.onAttackShieldPct)} HP`;
    if (item.onHitShieldPct) return `hit shield ${percentText(item.onHitShieldPct)} HP`;
    if (item.shieldCrackleDamagePct) return `shield crackle ${percentText(item.shieldCrackleDamagePct)} HP`;
    if (item.burnDamagePct) return `burn ${percentText(item.burnDamagePct)} ATK/${item.burnDuration || 3}s`;
    if (item.supportBonusPct) return `heals/shields +${percentText(item.supportBonusPct)}`;
    if (item.markDamagePct) return `mark +${percentText(item.markDamagePct)} dmg`;
    if (item.selfHealPct) return `every ${item.everyNAttacks || 3} attacks heal ${percentText(item.selfHealPct)} HP`;
    if (item.splashDamagePct) return `splash ${percentText(item.splashDamagePct)} ATK`;
    if (item.lateFightDamagePct) return `after ${item.lateFightStart || 8}s, +${percentText(item.lateFightDamagePct)} dmg stacks`;
    if (item.lowHpAttackSpeedPct || item.lowHpLifestealPct) return `low HP speed/lifesteal`;
    if (item.cooldownDelay) return `attacks delay ${item.cooldownDelay.toFixed(2)}s`;
    if (item.supportHastePct) return `support grants +${percentText(item.supportHastePct)} speed`;
    if (item.antiSupportPct) return `attacks cut support ${percentText(item.antiSupportPct)}`;
    if (item.receivedSupportSharePct) return `share ${percentText(item.receivedSupportSharePct)} support`;
    if (item.bounceDamagePct) return `bounce ${percentText(item.bounceDamagePct)} ATK`;
    if (item.shieldedAttackBonusPct) return `shielded dmg +${percentText(item.shieldedAttackBonusPct)}`;
    if (item.overhealShieldPct) return `overheal to shield ${percentText(item.overhealShieldPct)}`;
    if (item.mergeProgressBonus) return `bench merge +${item.mergeProgressBonus}`;
    if (item.frontRowDamageReductionPct) return `front damage -${percentText(item.frontRowDamageReductionPct)}`;
    if (item.backRowTargeting) return `back row targets back row`;
    if (item.adjacentPulseShieldPct || item.adjacentPulseAttackBuffPct) return `adjacent pulse every ${item.adjacentPulseInterval || 7}s`;
    if (item.adjacentStartShieldPct && item.adjacentStartAttackBuffPct) return `adjacent shield +${percentText(item.adjacentStartShieldPct)}, dmg +${percentText(item.adjacentStartAttackBuffPct)}`;
    if (item.adjacentStartShieldPct) return `adjacent shield ${percentText(item.adjacentStartShieldPct)} max HP`;
    if (item.pierceDamagePct) return `pierce ${percentText(item.pierceDamagePct)} ATK`;
    if (item.lowHpBurnDamagePct) return `low HP burn ${percentText(item.lowHpBurnDamagePct)} ATK`;
    if (item.deathSaveShieldPct) return `fatal save +${percentText(item.deathSaveShieldPct)} shield`;
    if (item.firstDebuffCleanseHealPct) return `first debuff cleanse/heal`;
    if (item.timedHastePct) return item.timedHasteInterval ? `late haste every ${item.timedHasteInterval}s` : `${item.timedHasteAt || 10}s haste +${percentText(item.timedHastePct)}`;
    if (item.shieldedTargetDamagePct) return `vs shields +${percentText(item.shieldedTargetDamagePct)} dmg`;
    if (item.attackSlowPct) return `attack slow ${percentText(item.attackSlowPct)}`;
    if (item.statusDurationReductionPct) return `statuses/delays fade ${percentText(item.statusDurationReductionPct)} faster`;
    if (item.statusDamageReductionPct) return `splash/status dmg -${percentText(item.statusDamageReductionPct)}`;
    if (item.decoyHpPct) return `start decoy ${percentText(item.decoyHpPct)} HP`;
    if (item.firstHitRedirect) return `redirect first hit`;
    if (item.periodicDamage) return `pop damage every ${item.periodicInterval || 3}s`;
    if (item.sellBonusGold) return `sell value +${item.sellBonusGold} ${currencyTerm({ lower: true })}`;
    if (item.surviveGold) return `survive +${item.surviveGold} ${currencyTerm({ lower: true })}`;
    if (item.firstItemDiscountGold) return `first ${toppingTerm({ lower: true })} -${item.firstItemDiscountGold} ${currencyTerm({ lower: true })}`;
    if (item.sameLineShopChancePct) return `owned-line ${realityBroken() ? "scan" : "shop"} +${percentText(item.sameLineShopChancePct)}`;
    if (item.extraAdjacentHealPct) return `heal splash ${percentText(item.extraAdjacentHealPct)}`;
    if (item.shieldCapBonusPct) return `shield cap +${percentText(item.shieldCapBonusPct)}`;
    if (item.statusDurationBonusPct) return `statuses last +${percentText(item.statusDurationBonusPct)}`;
    if (item.supportAttackBuffPct) return `support grants +${percentText(item.supportAttackBuffPct)} dmg`;
    if (item.battleStartHpLossPct) return `starts -${percentText(item.battleStartHpLossPct)} HP`;
    if (item.firstAttacksBonusPct) return `first ${item.firstAttacksCount || 3} attacks +${percentText(item.firstAttacksBonusPct)} dmg`;
    if (item.shieldedAttackSpeedPct) return `shielded speed +${percentText(item.shieldedAttackSpeedPct)}`;
    if (item.teamVulnerabilityPct) return `target vulnerable +${percentText(item.teamVulnerabilityPct)}`;
    if (item.executeSplashBonusPct || item.executeSplashDamagePct) return `wounded execute splash`;
    if (item.teamOverhealShieldPct) return `overheal team shield ${percentText(item.teamOverhealShieldPct)}`;
    if (item.teamHastePct) return `team haste +${percentText(item.teamHastePct)}`;
    if (item.supportRowEchoPct) return `row echo ${percentText(item.supportRowEchoPct)} PWR`;
    return themedGeneratedText(item.cardText || item.abilityText || "single-use effect");
  }

  function itemPrimaryStat(item) {
    return window.FoodAnimalsCatalogRuntime.itemPrimaryStat(item);
  }

  function refreshUnitItemStats(unit) {
    if (!isUnit(unit)) return unit;
    unit.baseAtk = unit.baseAtk || unit.atk;
    unit.baseMaxHp = unit.baseMaxHp || unit.maxHp;
    unit.baseSpeed = unit.baseSpeed || unit.speed;
    unit.baseAbilityPower = unit.baseAbilityPower || unit.abilityPower;
    const oldMaxHp = unit.maxHp || unit.baseMaxHp;
    const wasFull = unit.hp >= oldMaxHp;
    const bonusPct = unit.item?.damageBonusPct || 0;
    const scaledAtk = Math.max(1, Math.round(unit.baseAtk * itemDamageMultiplier(unit)));
    unit.atk = bonusPct > 0 ? Math.max(scaledAtk, unit.baseAtk + 1) : scaledAtk;
    const hpPct = unit.item?.maxHpBonusPct || 0;
    unit.maxHp = Math.max(1, Math.round(unit.baseMaxHp * (1 + hpPct)));
    unit.hp = wasFull ? unit.maxHp : Math.min(unit.hp, unit.maxHp);
    const speedPct = unit.item?.attackSpeedPct || 0;
    unit.speed = Math.max(0.22, unit.baseSpeed / (1 + speedPct));
    const powerPct = (unit.item?.abilityPowerBonusPct || 0) + favoriteToppingBonusPct(unit);
    const scaledPower = Math.max(1, Math.round(unit.baseAbilityPower * (1 + powerPct)));
    unit.abilityPower = powerPct > 0 ? Math.max(scaledPower, unit.baseAbilityPower + 1) : scaledPower;
    return unit;
  }

  function makeUnit(typeId, tier = 1) {
    const base = CATALOG.find((u) => u.id === typeId) || CATALOG[0];
    return window.FoodAnimalsCatalogRuntime.makeUnitData(base, tier, unitSeq++, {
      globalHpScale: GLOBAL_HP_SCALE,
      tierScaling: TIER_SCALING,
      random,
    });
  }

  function isFinalBossUnitType(typeId) {
    return typeId === FINAL_BOSS_TYPE_ID || typeId === FINAL_BOSS_MINION_TYPE_ID;
  }

  function isGiraffeBossUnitType(typeId) {
    return typeId === GIRAFFE_BOSS_TYPE_ID;
  }

  function makeFinalBossUnit(typeId, options = {}) {
    const boss = typeId === FINAL_BOSS_TYPE_ID;
    const tier = options.tier || (boss ? 4 : 2);
    const hpMultiplier = options.hpMultiplier || 1;
    const atkMultiplier = options.atkMultiplier || 1;
    const maxHp = Math.round((boss ? 2100 : Math.round(340 + tier * 70)) * hpMultiplier);
    const atk = Math.max(1, Math.round((boss ? 34 : Math.round(10 + tier * 3)) * atkMultiplier));
    const abilityPower = Math.max(1, Math.round((boss ? 38 : Math.round(10 + tier * 2)) * atkMultiplier));
    return {
      kind: "unit",
      uid: unitSeq++,
      typeId,
      lineName: boss ? "Cybernetic Brain" : "Brainstem Wire Robot",
      name: boss ? "Overmind Control Cortex" : "Brainstem Wire Drone",
      short: boss ? "Overmind" : "Wire Drone",
      emoji: boss ? "CB" : "BW",
      rarity: "epic",
      family: "machine",
      traits: [],
      color: boss ? "#10d6d6" : "#42f4ff",
      accent: boss ? "#ff334f" : "#37e7ff",
      role: boss ? "Final Boss" : "Control Minion",
      ability: boss ? "neural_overmind" : "brainstem_probe",
      abilityText: boss ? "Neural control" : "Signal dread",
      tier,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower,
      speed: boss ? 1.36 : Math.max(0.74, 1.16 - tier * 0.04),
      cooldown: boss ? 0.42 : 0.24 + random() * 0.2,
      targetUid: null,
      shield: boss ? 180 : 0,
      x: 0,
      y: 0,
      side: "enemy",
      slot: null,
      item: null,
      dead: false,
      finalBossUnit: true,
      enemySlot: options.enemySlot ?? null,
      battleSpriteScale: boss ? 2.0 : 1.06,
      battleSpriteOffsetY: boss ? 28 : 4,
    };
  }

  function makeGiraffeBossUnit(plan = {}) {
    const maxHp = Math.round(430 * (plan.bossHpMultiplier || 1));
    const atk = Math.round(18 * (plan.bossAtkMultiplier || 1));
    const abilityPower = Math.max(1, Math.round(20 * (plan.bossAtkMultiplier || 1)));
    return {
      kind: "unit",
      uid: unitSeq++,
      typeId: GIRAFFE_BOSS_TYPE_ID,
      lineName: "Banana Split Giraffe",
      name: "Banana Split Giraffe",
      short: "Split Giraffe",
      emoji: "BG",
      rarity: "epic",
      family: "dessert",
      traits: ["sweet", "bakery"],
      color: "#f7c45f",
      accent: "#78efff",
      role: "Wave 10 Boss",
      ability: "giraffe_boss_glitch",
      abilityText: "Glitch sundae beam",
      tier: 4,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower,
      baseAbilityPower: abilityPower,
      speed: 1.04,
      cooldown: 0.36 + random() * 0.18,
      targetUid: null,
      shield: 36,
      x: 0,
      y: 0,
      side: "enemy",
      slot: null,
      item: null,
      dead: false,
      enemySlot: plan.bossSlot ?? GIRAFFE_BOSS_SLOT,
      battleSpriteScale: 1.7,
      battleSpriteOffsetY: -24,
      defeatStillScale: HORROR_PLATE_BENCH_UNIT_SCALE,
      giraffeBossUnit: true,
      glitchToRobot: true,
      forceRealityDefeatStill: true,
    };
  }

  function tierScaling(tier) {
    return window.FoodAnimalsCatalogRuntime.tierScaling(tier, TIER_SCALING);
  }

  function shopLevelInfo(level = state.shopLevel) {
    return window.FoodAnimalsShopEconomy.levelInfo(SHOP_LEVELS, level);
  }

  function nextShopUpgradeCost() {
    return window.FoodAnimalsShopEconomy.upgradeCost(
      SHOP_LEVELS,
      state.shopLevel,
      state.nextShopUpgradeDiscountGold,
    );
  }

  function currentShopRarityWeights() {
    return window.FoodAnimalsShopEconomy.rarityWeights(SHOP_LEVELS, state.shopLevel);
  }

  function shopLevelChance(chances, fallback) {
    return window.FoodAnimalsShopEconomy.levelChance(chances, MAX_SHOP_LEVEL, state.shopLevel, fallback);
  }

  function currentDrinkShopChance() {
    return shopLevelChance(DRINK_SHOP_CHANCES, 0.15);
  }

  function currentToppingShopChance() {
    return shopLevelChance(TOPPING_SHOP_CHANCES, 0.22);
  }

  function currentItemShopChance() {
    return window.FoodAnimalsShopEconomy.itemChance(currentDrinkShopChance(), currentToppingShopChance());
  }

  function currentShopEntryTierChances(level = state.shopLevel) {
    return window.FoodAnimalsShopEconomy.entryTierChances(level);
  }

  function rollShopEntryTier(level = state.shopLevel) {
    return window.FoodAnimalsShopEconomy.rollEntryTier(level, random);
  }

  function themedAsset(cozySrc, horrorSrc, options = {}) {
    const horror = options.horror ?? (options.cozy ? false : realityBroken());
    return window.FoodAnimalsThemeAssets.pick(horror, cozySrc, horrorSrc);
  }

  function currentShopkeeperSrc() {
    return themedAsset(SHOPKEEPER_SRC, REALITY_SHOPKEEPER_SRC);
  }

  function currentShopkeeperStallSrc() {
    return themedAsset(SHOPKEEPER_STALL_SRC, REALITY_SHOPKEEPER_STALL_SRC);
  }

  function currentShopSlotBgSrc() {
    return themedAsset(SHOP_SLOT_BG_SRC, REALITY_SHOP_SLOT_BG_SRC);
  }

  function currentShopLockClothBgSrc() {
    return themedAsset(SHOP_LOCK_CLOTH_BG_SRC, REALITY_SHOP_LOCK_CLOTH_BG_SRC);
  }

  function currentBenchSlotBgSrc() {
    return themedAsset(BENCH_SLOT_BG_SRC, REALITY_BENCH_SLOT_BG_SRC);
  }

  function currentTeamIntelBgSrc() {
    return themedAsset(TEAM_INTEL_BG_SRC, REALITY_TEAM_INTEL_BG_SRC);
  }

  function currentCombatLedgerPanelBgSrc() {
    return themedAsset(COMBAT_LEDGER_PANEL_BG_SRC, REALITY_COMBAT_LEDGER_PANEL_BG_SRC);
  }

  function currentCombatLedgerMiniBgSrc() {
    return themedAsset(COMBAT_LEDGER_MINI_BG_SRC, REALITY_COMBAT_LEDGER_MINI_BG_SRC);
  }

  function currentCombatLedgerParticipantsBgSrc() {
    return themedAsset(COMBAT_LEDGER_PARTICIPANTS_BG_SRC, REALITY_COMBAT_LEDGER_PARTICIPANTS_BG_SRC);
  }

  function currentCombatLedgerLogBgSrc() {
    return themedAsset(COMBAT_LEDGER_LOG_BG_SRC, REALITY_COMBAT_LEDGER_LOG_BG_SRC);
  }

  function currentFoodMenuBgSrc() {
    return themedAsset(FOOD_MENU_BG_SRC, REALITY_FOOD_MENU_BG_SRC);
  }

  function currentCodexMenuButtonSrc() {
    return themedAsset(CODEX_MENU_BUTTON_SRC, REALITY_CODEX_MENU_BUTTON_SRC);
  }

  function currentUiIconAtlasSrc() {
    return themedAsset(UI_ICON_ATLAS_SRC, REALITY_UI_ICON_ATLAS_SRC);
  }

  function currentCodexMenuButtonRect() {
    return realityBroken() ? SHOPKEEPER_DISPLAY.realityCodexButton : SHOPKEEPER_DISPLAY.codexButton;
  }

  function codexMenuSignBleedPhase() {
    return realityBroken() ? illusionBleedPhase(4, 0.16) : { active: false, phase: "idle", progress: 0 };
  }

  function shopStallBleedPhase() {
    return realityBroken() ? illusionBleedPhase(3, 0.16) : { active: false, phase: "idle", progress: 0 };
  }

  function shopLockBleedPhase(index = 0) {
    return realityBroken() ? illusionBleedPhase(940 + (index || 0), 0.12) : { active: false, phase: "idle", progress: 0 };
  }

  function currentBattleFieldBgSrc() {
    return themedAsset(BATTLE_FIELD_BG_SRC, REALITY_BATTLE_FIELD_BG_SRC);
  }

  function currentBoardPlateSlotSrc() {
    return themedAsset(BOARD_PLATE_SLOT_SRC, REALITY_BOARD_PLATE_SLOT_SRC);
  }

  function currentDrinkCoasterSlotSrc() {
    return themedAsset(DRINK_COASTER_SLOT_SRC, REALITY_DRINK_COASTER_SLOT_SRC);
  }

  function currentToppingStorageSlotSrc() {
    return themedAsset(TOPPING_CUTTING_BOARD_SLOT_SRC, REALITY_TOPPING_STORAGE_SLOT_SRC);
  }

  function currentStatusBoardSrc(kind, options = {}) {
    if (options.cozy || (!options.horror && !realityBroken())) {
      if (kind === "coins") return STATUS_CHALK_COINS_SRC;
      if (kind === "health") return STATUS_CHALK_HEALTH_SRC;
      return STATUS_CHALK_COURSE_SRC;
    }
    if (kind === "coins") return REALITY_STATUS_SCRAP_SRC;
    if (kind === "health") return REALITY_STATUS_HULL_SRC;
    return REALITY_STATUS_WAVE_SRC;
  }

  function currentButtonSignSrc(button) {
    if (!realityBroken()) return button.signSrc;
    const label = String(button?.label || "").toLowerCase();
    if (button === buttons.shopUpgrade || label.includes("rig") || label.includes("lv ") || label.includes("max rig")) return REALITY_COMMAND_RIG_SRC;
    if (button === buttons.roll || label.includes("scan")) return REALITY_COMMAND_SCAN_SRC;
    if (button === buttons.battle || label.includes("deploy")) return REALITY_COMMAND_DEPLOY_SRC;
    if (button === buttons.battleSpeed || label.includes("speed")) return REALITY_COMMAND_SPEED_SRC;
    if (button?.signSrc === RESTART_CHALK_SIGN_SRC || label.includes("reboot") || label.includes("restart")) return REALITY_COMMAND_REBOOT_SRC;
    return button.signSrc;
  }

  function realityBroken() {
    if (state.realityOverride !== null && state.realityOverride !== undefined) return Boolean(state.realityOverride);
    return Boolean(state.realityBroken);
  }

  function currentCopyThemeId() {
    return realityBroken() ? "horror" : "cozy";
  }

  function copyLookup(path, themeId = currentCopyThemeId()) {
    const theme = COPY_THEMES[themeId];
    if (!theme) return undefined;
    const parts = Array.isArray(path) ? path : String(path || "").split(".");
    let value = theme;
    for (const part of parts) {
      if (value === null || value === undefined || part === "") return undefined;
      value = value[part];
    }
    return value;
  }

  function copy(path, fallback, context = {}) {
    const value = copyLookup(path);
    if (typeof value === "function") return value(context, fallback);
    return value === undefined || value === null ? fallback : value;
  }

  function copyObject(path, fallback = null) {
    const value = copyLookup(path);
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  }

  function displayItemName(item) {
    return copy(["items", item?.id, "name"], item?.name || "");
  }

  function displayItemShort(item) {
    return copy(["items", item?.id, "short"], item?.short || displayItemName(item));
  }

  function displayUnitLineName(unit) {
    return copy(["units", unit?.typeId || unit?.id, "lineName"], unit?.lineName || unit?.name || "");
  }

  function displayUnitFormName(unit) {
    const value = copyLookup(["units", unit?.typeId || unit?.id, "forms", String(unit?.tier || 1), "name"]);
    if (value) return value;
    if (currentCopyThemeId() === "horror" && unit) return `${displayUnitLineName(unit)} Mk ${unit.tier || 1}`;
    return unit?.name || "";
  }

  function displayUnitShort(unit) {
    const value = copyLookup(["units", unit?.typeId || unit?.id, "forms", String(unit?.tier || 1), "short"]);
    if (value) return value;
    if (currentCopyThemeId() === "horror" && unit) {
      const lineShort = copyLookup(["units", unit?.typeId || unit?.id, "short"]);
      return lineShort ? `${lineShort} ${unit.tier || 1}` : displayUnitFormName(unit);
    }
    return unit?.short || displayUnitFormName(unit);
  }

  function displayCatalogName(animal) {
    return copy(["units", animal?.id, "lineName"], animal?.name || "");
  }

  function displayCatalogShort(animal) {
    return copy(["units", animal?.id, "short"], animal?.short || displayCatalogName(animal));
  }

  function displayCatalogForm(animal, tier, field = "name") {
    const form = animal?.forms?.[Math.max(0, tier - 1)] || {};
    const value = copyLookup(["units", animal?.id, "forms", String(tier), field]);
    if (value) return value;
    if (currentCopyThemeId() === "horror" && animal) {
      return field === "short" ? `Mk ${tier}` : `${displayCatalogName(animal)} Mk ${tier}`;
    }
    return form[field] || form.name || animal?.name || "";
  }

  function displayEntryTypeLabel(entry) {
    if (isUnit(entry)) return copy("ui.types.food", "Food animal");
    if (isDrink(entry)) return copy("ui.types.drink", "Drink");
    if (isItem(entry)) return copy("ui.types.topping", "Topping");
    return "Entry";
  }

  function copyTerm(path, fallback, { lower = false } = {}) {
    const term = copy(path, fallback);
    return lower ? String(term).toLowerCase() : term;
  }

  function foodTerm(options = {}) {
    return copyTerm("ui.types.food", "food animal", options);
  }

  function foodPluralTerm(options = {}) {
    return copyTerm("ui.panels.food", "food animals", options);
  }

  function toppingTerm(options = {}) {
    return copyTerm("ui.types.topping", "Topping", options);
  }

  function toppingPluralTerm(options = {}) {
    return copyTerm("ui.panels.toppings", "Toppings", options);
  }

  function drinkTerm(options = {}) {
    return copyTerm("ui.types.drink", "Drink", options);
  }

  function drinkPluralTerm(options = {}) {
    return copyTerm("ui.panels.drinks", "drinks", options);
  }

  function currencyTerm(options = {}) {
    return copyTerm("ui.status.Coins", "coins", options);
  }

  function rollTerm(options = {}) {
    return copyTerm("ui.actions.Roll", "Roll", options);
  }

  function upgradeTerm(options = {}) {
    return copyTerm("ui.actions.Upgrade", "Upgrade", options);
  }

  function arenaTerm(options = {}) {
    return copyTerm("ui.panels.arena", "Arena", options);
  }

  function drinkLineTerm({ lower = false } = {}) {
    const term = `${drinkTerm()} line`;
    return lower ? term.toLowerCase() : term;
  }

  function themedGeneratedText(text) {
    if (!realityBroken() || text === null || text === undefined) return text;
    const replacements = [
      [/\bfood animals\b/gi, foodPluralTerm({ lower: true })],
      [/\bfood animal\b/gi, foodTerm({ lower: true })],
      [/\banimals\b/gi, foodPluralTerm({ lower: true })],
      [/\banimal\b/gi, foodTerm({ lower: true })],
      [/\btoppings\b/gi, toppingPluralTerm({ lower: true })],
      [/\btopping\b/gi, toppingTerm({ lower: true })],
      [/\bdrinks\b/gi, drinkPluralTerm({ lower: true })],
      [/\bdrink\b/gi, drinkTerm({ lower: true })],
      [/\bcoins?\b/gi, currencyTerm({ lower: true })],
      [/\bgold\b/gi, currencyTerm({ lower: true })],
      [/\bshops\b/gi, "scans"],
      [/\bshop\b/gi, "scan"],
      [/\barenas\b/gi, `${arenaTerm({ lower: true })}s`],
      [/\barena\b/gi, arenaTerm({ lower: true })],
      [/\brolls\b/gi, `${rollTerm({ lower: true })}s`],
      [/\broll\b/gi, rollTerm({ lower: true })],
    ];
    return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), String(text));
  }

  function itemDescriptionText(item) {
    if (isDrink(item)) return drinkTechnicalDescription(item);
    if (realityBroken()) return itemSpecLines(item).map((line) => `- ${line}`).join("\n");
    return item.description;
  }

  function themedTextObject(payload, fields = ["title", "body"]) {
    if (!payload || !realityBroken()) return payload;
    return Object.fromEntries(Object.entries(payload).map(([key, value]) => [
      key,
      fields.includes(key) && typeof value === "string" ? themedGeneratedText(value) : value,
    ]));
  }

  function displayRoleLabel(role) {
    return copy(["roles", role], role || "");
  }

  function itemRailLabel(item) {
    return isDrink(item) ? copy("ui.types.drink", "Drink") : copy("ui.types.topping", "Topping");
  }

  function itemStorageLabel(item) {
    return `${itemRailLabel(item)} storage`;
  }

  function themeColor(name, fallback) {
    if (!realityBroken()) return fallback;
    return {
      panel: "rgba(3, 10, 12, 0.92)",
      panelSoft: "rgba(8, 20, 22, 0.84)",
      panelHover: "rgba(22, 52, 49, 0.92)",
      panelActive: "rgba(101, 255, 109, 0.24)",
      primary: "#f2fff7",
      muted: "#a8d6c0",
      dim: "#75a08e",
      accent: "#65ff6d",
      danger: "#ff6673",
      warning: "#ffd15b",
      chipText: "#06100c",
      border: "rgba(101, 255, 109, 0.56)",
      borderDim: "rgba(101, 255, 109, 0.24)",
    }[name] || fallback;
  }

  function arenaDisplayColor(arena) {
    if (!realityBroken()) return arena?.color;
    return HORROR_ARENA_COLORS[arena?.id] || arena?.color;
  }

  function arenaEffectBadgeColors(helpful) {
    if (!realityBroken()) {
      return {
        fill: helpful ? "#e7ffd9" : "#ffe2d8",
        stroke: helpful ? "rgba(74, 158, 104, 0.28)" : "rgba(217, 87, 60, 0.28)",
        label: helpful ? "#24683e" : "#8c3627",
        text: "#6a4b35",
      };
    }
    return helpful
      ? {
        fill: "rgba(101, 255, 109, 0.16)",
        stroke: "rgba(101, 255, 109, 0.46)",
        label: "#86ff91",
        text: "#a8d6c0",
      }
      : {
        fill: "rgba(255, 102, 115, 0.16)",
        stroke: "rgba(255, 102, 115, 0.50)",
        label: "#ff9aa4",
        text: "#ffb0b8",
      };
  }

  function themedArena(arena) {
    const override = copyObject(["arenas", arena?.id], {});
    const effects = override.effects || arena.effects || [];
    return {
      ...arena,
      name: override.name || arena.name,
      short: override.short || arena.short,
      mood: override.mood || arena.mood,
      backgroundSrc: override.backgroundSrc || arena.backgroundSrc,
      color: override.color || arenaDisplayColor(arena),
      effects: effects.map((effect) => ({ ...effect })),
    };
  }

  function triggerRealityBreak() {
    state.realityBroken = true;
    state.realityBreakTimer = REALITY_BREAK_REVEAL_SECONDS;
    state.message = copy("ui.reality.triggerMessage", "ILLUSION FAILURE - combat layer exposed");
    state.log.unshift(copy("ui.reality.triggerLog", "Illusion failed: future war layer exposed"));
    playGameSfx("reality-break", { theme: "horror", volume: 1.1 });
  }

  function startPostGiraffeHorrorTransition() {
    state.postGiraffeHorrorTransition = {
      active: true,
      source: "giraffeDefeat",
      elapsed: 0,
      duration: POST_GIRAFFE_HORROR_ITEM_TRANSITION_SECONDS,
      clearAt: POST_GIRAFFE_HORROR_ITEM_TRANSITION_CLEAR_SECONDS,
    };
  }

  function setRealityTheme(mode = "auto") {
    state.realityOverride = normalizeRealityOverride(mode);
    if (state.realityOverride === true) {
      state.realityBreakTimer = Math.max(state.realityBreakTimer || 0, 1.6);
      state.message = copy("ui.reality.forcedHorror", "Horror layer forced");
    } else if (state.realityOverride === false) {
      state.realityBreakTimer = 0;
      state.message = "Cozy illusion forced";
    } else {
      state.message = realityBroken()
        ? copy("ui.reality.autoBroken", "Combat layer active")
        : "Auto theme";
    }
    draw();
    return { override: state.realityOverride, broken: realityBroken() };
  }

  function cycleRealityThemeOverride() {
    if (state.realityOverride === null || state.realityOverride === undefined) return setRealityTheme("horror");
    if (state.realityOverride === true) return setRealityTheme("cozy");
    return setRealityTheme("auto");
  }

  function statusLabel(label) {
    return copy(["ui", "status", label], label);
  }

  function actionLabel(label) {
    if (label.startsWith("Lv ")) {
      const upgradeLabel = copyLookup(["ui", "actions", "Upgrade"]);
      return upgradeLabel ? `${upgradeLabel}${label.slice(2)}` : label;
    }
    if (label === "Max Lv") return copy(["ui", "actions", "Max Lv"], label);
    if (label === "Speed 1x" || label.startsWith("Speed ")) return label.replace("Speed", copy(["ui", "actions", "Speed"], "Speed"));
    return copy(["ui", "actions", label], label);
  }

  function shopRarityOdds() {
    const weights = currentShopRarityWeights();
    const total = Object.values(weights).reduce((sum, weight) => sum + Math.max(0, weight || 0), 0);
    return Object.fromEntries(
      Object.keys(RARITIES).map((id) => [
        id,
        total > 0 ? Number((((weights[id] || 0) / total) * 100).toFixed(1)) : 0,
      ])
    );
  }

  function shopUnit() {
    const sameLineChance = ownedItemMax("sameLineShopChancePct") + ownedAbilityMax("copy_luck", fortuneShopChance);
    const ownedTypes = [...new Set(allOwnedRefs().map((ref) => ref.unit.typeId))];
    const tier = rollShopEntryTier();
    if (ownedTypes.length && random() < sameLineChance) {
      return makeUnit(ownedTypes[randInt(ownedTypes.length)], tier);
    }
    const rarity = chooseShopRarity();
    const pool = CATALOG.filter((unit) => (unit.rarity || "common") === rarity);
    const scoutTraits = state.arenaScout?.shopsRemaining > 0 ? state.arenaScout.traitIds || [] : [];
    const scoutPool = scoutTraits.length ? pool.filter((unit) => unit.traits?.some((traitId) => scoutTraits.includes(traitId))) : [];
    if (scoutPool.length && random() < 0.75) {
      return makeUnit(scoutPool[randInt(scoutPool.length)].id, tier);
    }
    const available = pool.length ? pool : CATALOG.filter((unit) => (unit.rarity || "common") === "common");
    return makeUnit(available[randInt(available.length)].id, tier);
  }

  function shopEntry() {
    const drinkChance = currentDrinkShopChance();
    if (random() < drinkChance) return shopDrink();
    const remainingChance = Math.max(0.0001, 1 - drinkChance);
    if (random() < Math.min(1, currentToppingShopChance() / remainingChance)) return shopTopping();
    return shopUnit();
  }

  function shopItem() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => (item.rarity || "common") === "common");
    return weightedItemFrom(available);
  }

  function shopDrink() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === "common");
    return weightedItemFrom(available, rollShopEntryTier());
  }

  function shopTopping() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === "common");
    return weightedItemFrom(available, rollShopEntryTier());
  }

  function weightedItemFrom(available, tier = 1) {
    const total = available.reduce((sum, item) => sum + (item.shopWeight || 1), 0);
    let roll = random() * total;
    for (const item of available) {
      roll -= item.shopWeight || 1;
      if (roll <= 0) return makeItem(item.id, tier);
    }
    return makeItem(available[available.length - 1]?.id || "sunny_side_egg", tier);
  }

  function chooseShopRarity() {
    return window.FoodAnimalsShopEconomy.chooseRarity(RARITIES, currentShopRarityWeights(), random);
  }

  function rarityInfo(rarityId) {
    const base = RARITIES[rarityId] || RARITIES.common;
    if (!realityBroken()) return base;
    return { ...base, ...(HORROR_RARITIES[base.id] || {}) };
  }

  function familyLabel(familyId) {
    const themed = copyLookup(["families", familyId]);
    if (themed) return themed;
    return String(familyId || "meal")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function traitInfo(traitId) {
    const base = TRAITS[traitId] || {
      id: traitId,
      label: familyLabel(traitId),
      short: String(traitId || "?").slice(0, 3).toUpperCase(),
      color: "#8a6a3f",
      thresholds: [],
    };
    const override = copyObject(["traits", traitId], {});
    return {
      ...base,
      label: override.label || base.label,
      short: override.short || base.short,
      color: realityBroken() ? (HORROR_TRAIT_COLORS[traitId] || base.color) : base.color,
      thresholds: (override.thresholds || base.thresholds).map((threshold) => ({
        ...threshold,
        text: themedGeneratedText(threshold.text),
      })),
    };
  }

  function traitLabel(traitId) {
    return traitInfo(traitId).label;
  }

  function traitDisplayText(traitId) {
    return traitInfo(traitId).label;
  }

  function traitStageForCount(traitId, count) {
    return window.FoodAnimalsTraitArenaRuntime.stageForCount(traitInfo(traitId), count);
  }

  function traitEffectText(traitId, stage) {
    if (stage <= 0) return "";
    if (traitId === "breakfast") {
      return stage >= 2 ? "Shield +9%; BRK haste +10%/2.5s" : "Team shield +5.5% max HP";
    }
    if (traitId === "bakery") return `Survivor: +${bakeryIncomeForStage(stage)} ${currencyTerm({ lower: true })} after battle`;
    if (traitId === "ocean") return stage >= 2 ? "Foes +0.30s CD; slow 2s" : "Foes +0.14s CD; slow 1.2s";
    if (traitId === "sweet") return `Support +${[0, 12, 22, 32][stage] || 32}%`;
    if (traitId === "spicy") return stage >= 2 ? "Attack +16%; burn 16% ATK" : "Attack +8%";
    if (traitId === "street_food") return `Attack speed +${[0, 8, 16, 26][stage] || 26}%`;
    if (traitId === "snack") return `First 3 hits +${stage >= 2 ? 22 : 12}%`;
    if (traitId === "fresh") return `Fresh support +${[0, 8, 14, 20][stage] || 20}%; statuses/delays fade ${[0, 15, 25, 40][stage] || 40}% faster`;
    return traitInfo(traitId).thresholds[stage - 1]?.text || "";
  }

  function traitCountForUnits(units) {
    return window.FoodAnimalsTraitArenaRuntime.countForUnits(units.filter(isUnit), Object.keys(TRAITS));
  }

  function traitSnapshotForUnits(units) {
    return window.FoodAnimalsTraitArenaRuntime.snapshotForUnits(units.filter(isUnit), TRAITS, {
      infoFor: traitInfo,
      stageForCount: traitStageForCount,
      effectText: traitEffectText,
    });
  }

  function compactTraitSnapshotForUnits(units) {
    return window.FoodAnimalsTraitArenaRuntime.compactSnapshot(traitSnapshotForUnits(units));
  }

  function activePlayerTraits() {
    return compactTraitSnapshotForUnits(state.board.filter(isUnit));
  }

  function visibleBattle() {
    return state.battle || (state.phase === "result" ? state.postCombatBattle : null);
  }

  function traitStageForUnits(units, traitId) {
    return traitStageForCount(traitId, traitCountForUnits(units)[traitId] || 0);
  }

  function battleTraitStage(side, traitId) {
    const traits = visibleBattle()?.traitLevels?.[side];
    if (traits) return traits[traitId]?.stage || 0;
    return traitStageForUnits(state.board.filter(isUnit), traitId);
  }

  function bakeryIncomeForStage(stage) {
    return [0, 6, 13, 22][stage] || 22;
  }

  function unitHasTrait(unit, traitId) {
    return window.FoodAnimalsTraitArenaRuntime.hasTrait(unit, traitId);
  }

  function activeTraitStage(unit, traitId) {
    if (!unitHasTrait(unit, traitId)) return 0;
    return battleTraitStage(unit.side || "ally", traitId);
  }

  function traitIncomeFromBattle() {
    if (!state.battle) return 0;
    const stage = state.battle.traitLevels?.ally?.bakery?.stage || 0;
    const hasSurvivingBakery = state.battle.allies.some((unit) => !unit.dead && unitHasTrait(unit, "bakery"));
    return hasSurvivingBakery ? bakeryIncomeForStage(stage) : 0;
  }

  function favoriteToppingFor(unit) {
    const favorite = FAVORITE_TOPPINGS[unit?.typeId];
    if (!favorite) return null;
    const item = itemInfo(favorite.itemId);
    return {
      itemId: favorite.itemId,
      itemName: displayItemName(item),
      itemShort: displayItemShort(item),
      bonus: themedGeneratedText(favorite.bonus),
      specs: favoriteToppingSpecLines(unit),
      technicalSpecs: favoriteToppingTechnicalSpecLines(unit),
      unlocked: hasFavoriteTopping(unit),
    };
  }

  function favoriteToppingPreviewItem(unit) {
    const favorite = FAVORITE_TOPPINGS[unit?.typeId];
    if (!favorite) return null;
    const source = itemInfo(favorite.itemId);
    if (!source) return null;
    const tier = hasFavoriteTopping(unit) ? itemTier(unit.item?.tier) : 1;
    return scaleItemForTier({ ...source, tier }, tier);
  }

  function favoriteToppingItemSpecLines(unit) {
    const item = favoriteToppingPreviewItem(unit);
    if (!item) return [];
    return itemSpecLines(item);
  }

  function favoriteToppingCompactSpecLine(unit) {
    const item = favoriteToppingPreviewItem(unit);
    return item ? `${displayEntryTypeLabel(item)}: ${itemCompactSpecLine(item)}` : null;
  }

  function favoriteToppingTechnicalSpecLines(unit) {
    return favoriteToppingItemSpecLines(unit).map((line) => `${copy("ui.types.topping", "Topping")}: ${line}`);
  }

  function favoriteToppingSpecLines(unit) {
    if (!unit) return [];
    const favorite = FAVORITE_TOPPINGS[unit.typeId];
    const comboSpecs = (FAVORITE_COMBO_SPECS[unit.typeId] || (favorite?.bonus ? [`Combo: ${favorite.bonus}`] : [])).map(themedGeneratedText);
    return [...comboSpecs, ...favoriteToppingTechnicalSpecLines(unit)];
  }

  function hasFavoriteTopping(unit) {
    return Boolean(unit?.item && FAVORITE_TOPPINGS[unit.typeId]?.itemId === unit.item.id);
  }

  function favoriteToppingBonusPct(unit) {
    return hasFavoriteTopping(unit) ? 0.12 : 0;
  }

  function shieldCrackleDamage(unit) {
    if (!unit?.item?.shieldCrackleDamagePct) return 0;
    return Math.max(1, Math.round(unit.maxHp * unit.item.shieldCrackleDamagePct * (1 + favoriteToppingBonusPct(unit))));
  }

  function favoriteUsersForItem(itemId) {
    return CATALOG
      .filter((unit) => FAVORITE_TOPPINGS[unit.id]?.itemId === itemId)
      .map((unit) => displayCatalogShort(unit));
  }

  function randomArenaId(excludeId = null) {
    const pool = ARENAS.filter((arena) => arena.id !== excludeId);
    const choices = pool.length ? pool : ARENAS;
    return choices[randInt(choices.length)].id;
  }

  function arenaInfo(arenaId) {
    return ARENAS.find((arena) => arena.id === arenaId) || ARENAS[0];
  }

  function currentArena() {
    return arenaInfo(state.arenaId);
  }

  function setArena(arenaId) {
    const arena = arenaInfo(arenaId);
    state.arenaId = arena.id;
    if (state.phase === "prep") state.message = themedArena(arena).short;
    draw();
    return currentArena();
  }

  function arenaText(arena = currentArena()) {
    const displayArena = themedArena(arena);
    return {
      id: displayArena.id,
      name: displayArena.name,
      short: displayArena.short,
      mood: displayArena.mood,
      backgroundSrc: displayArena.backgroundSrc,
      effects: displayArena.effects.map((effect) => ({ ...effect })),
    };
  }

  function hasAnyTrait(unit, traits = []) {
    return window.FoodAnimalsTraitArenaRuntime.hasAnyTrait(unit, traits);
  }

  function hasAnyFamily(unit, families = []) {
    return window.FoodAnimalsTraitArenaRuntime.hasAnyFamily(unit, families);
  }

  function arenaStatusDurationBonus(source) {
    return window.FoodAnimalsTraitArenaRuntime.statusDurationBonus(currentArena(), source);
  }

  function arenaStatusClearMultiplier(unit) {
    if (!unit) return 1;
    const arena = currentArena();
    return 1;
  }

  function arenaAttackClockBonus(unit) {
    return window.FoodAnimalsTraitArenaRuntime.attackClockBonus(currentArena(), unit);
  }

  function arenaSupportMultiplier(unit) {
    return window.FoodAnimalsTraitArenaRuntime.supportMultiplier(currentArena(), unit);
  }

  function arenaDamageMultiplier(source, target, options = {}) {
    return window.FoodAnimalsTraitArenaRuntime.damageMultiplier(currentArena(), source, target, {
      ...options,
      backCol: BACK_COL,
      frontCol: FRONT_COL,
      elapsed: state.battle?.elapsed || 0,
    });
  }

  function applyBattleStartArenaEffects(units, foes = []) {
    const arena = currentArena();
    if (arena.id === "sunny_breakfast_patio") {
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "breakfast")).forEach((unit) => {
        unit.haste = { remaining: 3, pct: 0.08 };
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "bakery")).forEach((unit) => {
        grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.08)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
    } else if (arena.id === "rainy_fish_market") {
      if (units.some((unit) => !unit.dead && unitHasTrait(unit, "ocean"))) {
        foes.filter((foe) => !foe.dead).forEach((foe) => {
          if (applyCooldownDelay(foe, 0.12) > 0) {
            foe.slowed = { remaining: Math.max(foe.slowed?.remaining || 0, 1.1) };
          }
          burst({ x: foe.x, y: foe.y }, arena.color);
        });
      }
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "bakery")).forEach((unit) => {
        unit.cooldown += 0.16;
      });
    } else if (arena.id === "frozen_parfait_peak") {
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "sweet")).forEach((unit) => {
        grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.1)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
    }
  }

  function applyPendingArenaRewardBuff(units) {
    const buff = state.arenaPrepBuff;
    if (!buff) return;
    const target = units.find((unit) => !unit.dead && hasAnyTrait(unit, buff.traitIds || [])) || units.find((unit) => !unit.dead);
    if (target) {
      grantShield(target, Math.max(2, Math.round(target.maxHp * (buff.shieldPct || 0.12))), { noShare: true });
      target.haste = { remaining: buff.duration || 3, pct: buff.hastePct || 0.1 };
      target.attackBoost = { remaining: buff.duration || 3, pct: buff.attackPct || 0.08 };
      burst({ x: target.x, y: target.y }, arenaInfo(buff.arenaId).color);
      state.log.unshift(`${target.short} carried ${buff.arenaShort} prep`);
    }
    state.arenaPrepBuff = null;
  }

  function shopEntryForSlot(index) {
    if (!isShopSlotUnlocked(index)) return null;
    return state.shopFrozen[index] && shopEntryAt(index) ? shopEntryAt(index) : shopEntry();
  }

  function startShopSlotTransitions(type, slots = shopSlots.map((_, index) => index)) {
    const duration = SHOP_SLOT_TRANSITION_SECONDS * (type === "upgrade" ? 1.15 : 1);
    slots.forEach((index, order) => {
      if (index < 0 || index >= shopSlots.length) return;
      state.shopSlotTransitions[index] = {
        type,
        elapsed: -order * 0.035,
        duration,
      };
    });
  }

  function shopSlotTransition(index) {
    const transition = state.shopSlotTransitions?.[index];
    if (!transition) return null;
    const duration = Math.max(0.001, transition.duration || SHOP_SLOT_TRANSITION_SECONDS);
    const progress = clamp01(Math.max(0, transition.elapsed || 0) / duration);
    return { ...transition, progress, eased: easeOutCubic(progress) };
  }

  function refreshShop(free = false) {
    const cost = currentRollCost();
    const reroll = window.FoodAnimalsShopFlowRuntime.rerollDecision({
      phase: state.phase,
      free,
      gold: state.gold,
      cost,
      freeRolls: state.freeRolls,
      rollsThisRound: state.rollsThisRound,
    });
    if (!reroll.ok) {
      playGameSfx("invalid");
      return;
    }
    if (!free) {
      window.FoodAnimalsShopFlowRuntime.applyRerollCost(state, reroll);
    }
    const previousSales = [...state.shopSales];
    state.shop = shopSlots.map((_, index) => shopEntryForSlot(index));
    state.shopSales = shopSlots.map((_, index) => {
      const entry = shopEntryAt(index);
      return window.FoodAnimalsShopFlowRuntime.shopSaleState({
        hasEntry: Boolean(entry),
        frozen: state.shopFrozen[index],
        previousSale: previousSales[index],
        rollSale: () => rollShopSlotSale(index, entry),
      });
    });
    state.shopFrozen = state.shopFrozen.map((frozen, index) => Boolean(frozen && shopEntryAt(index)));
    if (state.arenaScout?.shopsRemaining > 0) {
      state.arenaScout.shopsRemaining -= 1;
      if (state.arenaScout.shopsRemaining <= 0) state.arenaScout = null;
    }
    state.message = free ? currentArena().short : cost === 0 ? `Free ${rollTerm({ lower: true })}` : `${rollTerm()} -${cost} ${currencyTerm({ lower: true })}`;
    startShopSlotTransitions(free ? "restock" : "reroll", shopSlots.map((_, index) => index).filter((index) => shopEntryAt(index) && !state.shopFrozen[index]));
    if (!free) playGameSfx("reroll");
  }

  function purchaseShopSlot(index) {
    const cost = shopSlotUnlockCost(index);
    const decision = window.FoodAnimalsShopFlowRuntime.unlockDecision({
      phase: state.phase,
      index,
      slotCount: shopSlots.length,
      unlocked: isShopSlotUnlocked(index),
      gold: state.gold,
      cost,
    });
    if (decision.reason === "wrongPhase" || decision.reason === "invalidIndex") return false;
    if (decision.reason === "alreadyOpen") {
      state.message = "Slot open";
      playGameSfx("invalid");
      return false;
    }
    if (decision.reason === "insufficientGold") {
      state.message = `Need ${cost} ${currencyTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    state.gold -= cost;
    openShopSlot(index);
    state.message = `Opened slot ${index + 1}`;
    state.log.unshift(`${realityBroken() ? "Opened scan slot" : "Opened shop slot"} ${index + 1}`);
    playGameSfx("upgrade");
    return true;
  }

  function firstLockedShopSlot() {
    return state.shopUnlocked.findIndex((unlocked) => !unlocked);
  }

  function openShopSlot(index) {
    if (index < 0 || index >= shopSlots.length) return false;
    if (isShopSlotUnlocked(index)) return false;
    state.shopUnlocked[index] = true;
    state.shopFrozen[index] = false;
    state.shop[index] = shopEntry();
    state.shopSales[index] = rollShopSlotSale(index, state.shop[index]);
    startShopSlotTransitions("unlock", [index]);
    return true;
  }

  function startNextRoundShop() {
    const rewardFreeRolls = Math.max(0, Math.floor(state.freeRolls || 0));
    state.rollsThisRound = 0;
    state.freeRolls = startingFreeRollsForShopLevel() + rewardFreeRolls;
    state.itemDiscountUsed = false;
    if (state.keepArenaNextRound) {
      state.arenaHoldNotice = {
        arenaId: state.arenaId,
        arenaShort: themedArena(currentArena()).short,
      };
      state.keepArenaNextRound = false;
    } else {
      state.arenaId = randomArenaId(state.arenaId);
      state.arenaHoldNotice = null;
    }
    state.enemyPreview = null;
    refreshShop(true);
    ensureEnemyPreview();
    if (realityBroken()) state.message = "War prep";
  }

  function currentRollCost() {
    return window.FoodAnimalsShopEconomy.rollCost(ECONOMY, state.freeRolls, state.rollsThisRound);
  }

  function startingFreeRollsForShopLevel(level = state.shopLevel) {
    return window.FoodAnimalsShopEconomy.startingFreeRolls(ECONOMY, level);
  }

  function upgradeShop() {
    const cost = nextShopUpgradeCost();
    const decision = window.FoodAnimalsShopFlowRuntime.upgradeDecision({
      phase: state.phase,
      cost,
      gold: state.gold,
    });
    if (decision.reason === "wrongPhase") return false;
    if (decision.reason === "maxed") {
      state.nextShopUpgradeDiscountGold = 0;
      state.message = realityBroken() ? "Rig maxed" : "Shop maxed";
      playGameSfx("invalid");
      return false;
    }
    if (decision.reason === "insufficientGold") {
      state.message = `Need ${currencyTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    state.gold -= cost;
    state.shopLevel = Math.min(MAX_SHOP_LEVEL, state.shopLevel + 1);
    state.nextShopUpgradeDiscountGold = 0;
    state.freeRolls += 1;
    const previousSales = [...state.shopSales];
    state.shop = shopSlots.map((_, index) => shopEntryForSlot(index));
    state.shopSales = shopSlots.map((_, index) => {
      const entry = shopEntryAt(index);
      return window.FoodAnimalsShopFlowRuntime.shopSaleState({
        hasEntry: Boolean(entry),
        frozen: state.shopFrozen[index],
        previousSale: previousSales[index],
        rollSale: () => rollShopSlotSale(index, entry),
      });
    });
    state.shopFrozen = state.shopFrozen.map((frozen, index) => Boolean(frozen && shopEntryAt(index)));
    state.message = `Odds up +1 ${rollTerm({ lower: true })}`;
    state.log.unshift(`${upgradeTerm()} ${realityBroken() ? "rig" : "shop"} to level ${state.shopLevel}`);
    startShopSlotTransitions("upgrade", shopSlots.map((_, index) => index).filter((index) => shopEntryAt(index) && !state.shopFrozen[index]));
    playGameSfx("upgrade");
    return true;
  }

  function firstEmptyBench() {
    return state.bench.findIndex((u) => !u);
  }

  function firstEmptyDrinkSlot() {
    return state.drinks.findIndex((u) => !u);
  }

  function itemBenchSlotKind(index) {
    return window.FoodAnimalsSlotLayout.itemBenchSlotKind(index, ITEM_BENCH_DRINK_SLOTS);
  }

  function itemBenchSlotAccepts(index, item) {
    return itemBenchSlotKind(index) === "drink" ? isDrink(item) : isTopping(item);
  }

  function itemStorageAccepts(area, index, item) {
    return window.FoodAnimalsShopTransactionRuntime.itemStorageAccepts(area, index, item, {
      isItem,
      itemBenchSlotAccepts,
    });
  }

  function isItemStorageArea(area) {
    return window.FoodAnimalsShopTransactionRuntime.isItemStorageArea(area);
  }

  function itemStorageFullMessage(item) {
    if (isItem(item)) return `${itemStorageLabel(item)} full`;
    return "Bench full";
  }

  function firstEmptyItemBenchSlot(item) {
    return window.FoodAnimalsShopTransactionRuntime.firstEmpty(state.itemBench, (index) => itemBenchSlotAccepts(index, item));
  }

  function firstEmptyItemStorage(item) {
    return window.FoodAnimalsShopTransactionRuntime.firstEmptyItemStorage(state, item, { itemBenchSlotAccepts });
  }

  function moveItemToBench(item) {
    if (isUnit(item)) {
      const benchSpot = firstEmptyBench();
      if (benchSpot < 0) return false;
      state.bench[benchSpot] = item;
      return true;
    }
    const spot = firstEmptyItemStorage(item);
    if (!spot || !item) return false;
    state[spot.area][spot.index] = item;
    return true;
  }

  function allOwnedRefs() {
    const refs = [];
    state.bench.forEach((unit, index) => {
      if (isUnit(unit)) refs.push({ area: "bench", index, unit });
    });
    state.board.forEach((unit, index) => {
      if (isUnit(unit)) refs.push({ area: "board", index, unit });
    });
    return refs;
  }

  function placeRef(ref, unit) {
    state[ref.area][ref.index] = unit;
  }

  function allLooseItemRefs() {
    const refs = [];
    state.bench.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "bench", index, item: entry });
    });
    state.itemBench.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "itemBench", index, item: entry });
    });
    state.drinks.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "drinks", index, item: entry });
    });
    return refs;
  }

  function placeItemRef(ref, item) {
    state[ref.area][ref.index] = item;
  }

  function itemRefSlot(ref) {
    if (ref.area === "itemBench") return itemBenchSlots[ref.index];
    return ref.area === "drinks" ? drinkSlots[ref.index] : benchSlots[ref.index];
  }

  function itemMergeProgressCount(itemId, tier) {
    return allLooseItemRefs().filter((ref) => ref.item.id === itemId && itemTier(ref.item.tier) === itemTier(tier)).length;
  }

  function orderedItemMergeRefs(matches, item) {
    return window.FoodAnimalsMergeRuntime.orderItemRefs(matches, item, { isDrink });
  }

  function mergeItemTriples(itemId, tier) {
    const matches = allLooseItemRefs().filter((ref) => ref.item.id === itemId && itemTier(ref.item.tier) === itemTier(tier));
    if (itemTier(tier) >= MAX_ITEM_TIER || matches.length < 3) return false;
    const ordered = orderedItemMergeRefs(matches, matches[0].item);
    const consumedRefs = ordered.slice(0, 3);
    const keeper = consumedRefs[0];
    consumedRefs.forEach((ref) => placeItemRef(ref, null));
    const evolved = makeItem(itemId, itemTier(tier) + 1);
    evolved.purchaseGold = mergedItemPurchaseGold(consumedRefs.map((ref) => ref.item));
    placeItemRef(keeper, evolved);
    const reward = ITEM_MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${itemDisplayShort(evolved)} mixed${reward ? ` +${reward} ${currencyTerm({ lower: true })}` : ""}`;
    mergeExplosion(itemRefSlot(keeper), evolved);
    state.log.unshift(`${evolved.name} reached ${itemLevelLabel(evolved)}${reward ? ` and earned ${reward} ${currencyTerm({ lower: true })}` : ""}`);
    return true;
  }

  function itemMatchesMerge(item, target) {
    return isItem(item) && isItem(target) && window.FoodAnimalsMergeRuntime.itemMatches(item, target, MAX_ITEM_TIER);
  }

  function itemMergeRefsWithIncoming(item, targetArea, targetIndex) {
    return window.FoodAnimalsMergeRuntime.itemRefsWithIncoming(
      item,
      state[targetArea]?.[targetIndex],
      allLooseItemRefs(),
      targetArea,
      targetIndex,
      MAX_ITEM_TIER,
      { isDrink },
    );
  }

  function unitMaxTier(unit) {
    return window.FoodAnimalsMergeRuntime.unitMaxTier(unit, CATALOG.find((entry) => entry.id === unit?.typeId));
  }

  function unitMatchesMerge(unit, target) {
    return isUnit(unit) && isUnit(target) && window.FoodAnimalsMergeRuntime.unitMatches(unit, target, unitMaxTier(unit));
  }

  function unitMergeRefsWithIncoming(unit, targetArea, targetIndex) {
    return window.FoodAnimalsMergeRuntime.unitRefsWithIncoming(
      unit,
      state[targetArea]?.[targetIndex],
      allOwnedRefs(),
      targetArea,
      targetIndex,
      unitMaxTier(unit),
      fortunePhantomCopy,
    );
  }

  function canMergeShopEntryIntoSlot(entry, targetArea, targetIndex) {
    const target = state[targetArea]?.[targetIndex];
    if (!target) return false;
    if (isItem(entry)) {
      if (isDrink(entry)) {
        if (targetArea !== "bench" && targetArea !== "drinks" && targetArea !== "itemBench") return false;
      } else if (targetArea !== "bench" && targetArea !== "itemBench") return false;
      if (targetArea === "itemBench" && !itemBenchSlotAccepts(targetIndex, entry)) return false;
      return itemMergeRefsWithIncoming(entry, targetArea, targetIndex).length >= 2;
    }
    if (targetArea !== "bench" && targetArea !== "board") return false;
    return unitMergeRefsWithIncoming(entry, targetArea, targetIndex).length > 0;
  }

  function hasShopMergeTarget(entry) {
    if (isItem(entry)) {
      const storageTargets = [
        ...state.bench.map((_, index) => ({ area: "bench", index })),
        ...state.itemBench.map((_, index) => ({ area: "itemBench", index })),
        ...state.drinks.map((_, index) => ({ area: "drinks", index })),
      ];
      return storageTargets.some((target) => canMergeShopEntryIntoSlot(entry, target.area, target.index));
    }
    return [...state.bench.map((_, index) => ({ area: "bench", index })), ...state.board.map((_, index) => ({ area: "board", index }))]
      .some((target) => canMergeShopEntryIntoSlot(entry, target.area, target.index));
  }

  function shopEntryMergeOpportunity(entry) {
    if (!entry) return null;
    if (isItem(entry)) {
      if (itemTier(entry.tier) >= MAX_ITEM_TIER) return null;
      const progress = itemMergeProgressCount(entry.id, entry.tier);
      if (progress + 1 < 3) return null;
      return {
        kind: "item",
        progress,
        incomingProgress: 1,
        required: 3,
        text: `${Math.min(3, progress + 1)}/3 ready`,
      };
    }
    if (!isUnit(entry) || entry.tier >= unitMaxTier(entry)) return null;
    const progress = allOwnedRefs()
      .filter((ref) => unitMatchesMerge(entry, ref.unit))
      .reduce((total, ref) => total + mergeProgressFor(ref), 0);
    const incomingProgress = 1;
    const phantomProgress = fortunePhantomCopy(entry.typeId, entry.tier, progress + incomingProgress);
    if (progress + incomingProgress + phantomProgress < 3) return null;
    return {
      kind: "unit",
      progress,
      incomingProgress,
      phantomProgress,
      required: 3,
      text: `${Math.min(3, progress + incomingProgress + phantomProgress)}/3 ready`,
    };
  }

  function shopSlotMergeOpportunity(index) {
    const entry = shopEntryAt(index);
    if (!entry) return null;
    const opportunity = shopEntryMergeOpportunity(entry);
    if (!opportunity || !hasShopMergeTarget(entry)) return null;
    return opportunity;
  }

  function ownedSlotShopMergeOpportunity(area, index) {
    if (!["bench", "board", "itemBench", "drinks"].includes(area)) return null;
    if (!state[area]?.[index]) return null;
    for (let shopIndex = 0; shopIndex < state.shop.length; shopIndex += 1) {
      const entry = shopEntryAt(shopIndex);
      if (!entry) continue;
      const opportunity = shopEntryMergeOpportunity(entry);
      if (opportunity && canMergeShopEntryIntoSlot(entry, area, index)) {
        return { shopIndex, entry, ...opportunity };
      }
    }
    return null;
  }

  function clearPurchasedShopSlot(shopIndex) {
    window.FoodAnimalsShopTransactionRuntime.clearPurchasedShopSlot(state, shopIndex);
  }

  function buyShopMergeIntoSlot(shopIndex, targetArea, targetIndex) {
    const entry = shopEntryAt(shopIndex);
    if (!entry || !canMergeShopEntryIntoSlot(entry, targetArea, targetIndex)) return false;
    const cost = purchaseCost(entry, shopIndex);
    if (state.gold < cost) {
      state.message = `Need ${currencyTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(entry, shopIndex, cost);
    clearPurchasedShopSlot(shopIndex);

    if (isItem(entry)) {
      const consumedRefs = itemMergeRefsWithIncoming(entry, targetArea, targetIndex);
      const consumedItems = consumedRefs.map((ref) => ref.item);
      consumedRefs.forEach((ref) => placeItemRef(ref, null));
      const evolved = makeItem(entry.id, itemTier(entry.tier) + 1);
      evolved.purchaseGold = mergedItemPurchaseGold(consumedItems, cost);
      const keeper = { area: targetArea, index: targetIndex };
      placeItemRef(keeper, evolved);
      const reward = ITEM_MERGE_GOLD_REWARD[evolved.tier] || 0;
      if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
      state.selected = null;
      state.drag = null;
      state.message = `${itemDisplayShort(evolved)} mixed${reward ? ` +${reward} ${currencyTerm({ lower: true })}` : ""}`;
      mergeExplosion(itemRefSlot(keeper), evolved);
      state.log.unshift(`${evolved.name} reached ${itemLevelLabel(evolved)}${reward ? ` and earned ${reward} ${currencyTerm({ lower: true })}` : ""}`);
      playGameSfx("merge");
      resolveItemMerges();
      return true;
    }

    const consumedRefs = unitMergeRefsWithIncoming(entry, targetArea, targetIndex);
    const consumedUnits = consumedRefs.map((ref) => ref.unit);
    const keeperUnit = state[targetArea][targetIndex];
    const keeperItem = mergeItemIsConsumed(keeperUnit.item) ? null : cloneItem(keeperUnit.item);
    const extraItems = consumedRefs
      .filter((ref) => ref.area !== targetArea || ref.index !== targetIndex)
      .map((ref) => ref.unit.item)
      .filter((item) => item && !mergeItemIsConsumed(item))
      .map((item) => cloneItem(item));
    consumedRefs.forEach((ref) => placeRef(ref, null));
    const evolved = makeUnit(entry.typeId, entry.tier + 1);
    evolved.purchaseGold = mergedUnitPurchaseGold(consumedUnits, cost);
    evolved.item = keeperItem;
    refreshUnitItemStats(evolved);
    placeRef({ area: targetArea, index: targetIndex }, evolved);
    extraItems.forEach((item) => moveItemToBench(item));
    const reward = MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${evolved.short} evolved${reward ? ` +${reward} ${currencyTerm({ lower: true })}` : ""}`;
    mergeExplosion(targetArea === "board" ? boardSlots[targetIndex] : benchSlots[targetIndex], evolved);
    state.log.unshift(`${evolved.name} reached ${evolved.tier} stars${reward ? ` and earned ${reward} ${currencyTerm({ lower: true })}` : ""}`);
    playGameSfx("merge");
    resolveItemMerges();
    resolveMerges();
    return true;
  }

  function mergeProgressFor(ref) {
    return window.FoodAnimalsMergeRuntime.progressFor(ref);
  }

  function mergeProgressCount(typeId, tier) {
    const actual = allOwnedRefs()
      .filter((ref) => ref.unit.typeId === typeId && ref.unit.tier === tier)
      .reduce((total, ref) => total + mergeProgressFor(ref), 0);
    return actual + fortunePhantomCopy(typeId, tier, actual);
  }

  function mergeItemIsConsumed(item) {
    return window.FoodAnimalsMergeRuntime.mergeItemIsConsumed(item);
  }

  function selectMergeRefs(matches) {
    return window.FoodAnimalsMergeRuntime.selectRefsForProgress(matches, 3);
  }

  function fortunePhantomCopy(typeId, tier, actualProgress) {
    if (actualProgress <= 0 || actualProgress >= 3) return 0;
    return allOwnedRefs().some((ref) => ref.unit.ability === "copy_luck" && ref.unit.typeId === typeId && ref.unit.tier === tier && ref.unit.tier >= 2)
      ? 1
      : 0;
  }

  function mergeTriples(typeId, tier) {
    const matches = allOwnedRefs().filter((ref) => ref.unit.typeId === typeId && ref.unit.tier === tier);
    const base = CATALOG.find((unit) => unit.id === typeId);
    const maxTier = base?.forms.length || 1;
    if (tier >= maxTier || mergeProgressCount(typeId, tier) < 3) return false;
    const consumedRefs = selectMergeRefs(matches);
    const keeper = matches[0];
    const keeperItem = mergeItemIsConsumed(keeper.unit.item) ? null : cloneItem(keeper.unit.item);
    const extraItems = consumedRefs
      .slice(1)
      .map((ref) => ref.unit.item)
      .filter((item) => item && !mergeItemIsConsumed(item))
      .map((item) => cloneItem(item));
    consumedRefs.forEach((ref) => placeRef(ref, null));
    const evolved = makeUnit(typeId, tier + 1);
    evolved.item = keeperItem;
    refreshUnitItemStats(evolved);
    placeRef(keeper, evolved);
    extraItems.forEach((item) => moveItemToBench(item));
    const reward = MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${evolved.short} evolved${reward ? ` +${reward} ${currencyTerm({ lower: true })}` : ""}`;
    mergeExplosion(keeper.area === "board" ? boardSlots[keeper.index] : benchSlots[keeper.index], evolved);
    state.log.unshift(`${evolved.name} reached ${tier + 1} stars${reward ? ` and earned ${reward} ${currencyTerm({ lower: true })}` : ""}`);
    playGameSfx("merge");
    resolveItemMerges();
    return true;
  }

  function resolveMerges() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const unit of allOwnedRefs().map((ref) => ref.unit)) {
        if (unit && mergeTriples(unit.typeId, unit.tier)) {
          changed = true;
          break;
        }
      }
    }
  }

  function resolveItemMerges() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const item of allLooseItemRefs().map((ref) => ref.item)) {
        if (item && mergeItemTriples(item.id, item.tier)) {
          changed = true;
          break;
        }
      }
    }
  }

  function buyShop(index) {
    const entry = shopEntryAt(index);
    if (isItem(entry)) {
      const spot = firstEmptyItemStorage(entry);
      return spot ? buyShopToSlot(index, spot.area, spot.index) : false;
    }
    const spot = firstEmptyBench();
    return buyShopToBench(index, spot);
  }

  function buyShopToBench(shopIndex, benchIndex) {
    return buyShopToSlot(shopIndex, "bench", benchIndex);
  }

  function buyShopToSlot(shopIndex, targetArea, targetIndex) {
    const entry = shopEntryAt(shopIndex);
    const cost = entry ? purchaseCost(entry, shopIndex) : 0;
    const decision = window.FoodAnimalsShopFlowRuntime.buyTargetDecision({
      phase: state.phase,
      unlocked: isShopSlotUnlocked(shopIndex),
      hasEntry: Boolean(entry),
      gold: state.gold,
      cost,
      entryType: isDrink(entry) ? "drink" : isTopping(entry) ? "topping" : isUnit(entry) ? "unit" : "unknown",
      targetArea,
      targetInRange: targetIndex >= 0 && targetIndex < (state[targetArea]?.length || 0),
      itemBenchAccepts: targetArea === "itemBench" ? itemBenchSlotAccepts(targetIndex, entry) : true,
    });
    if (!decision.ok) {
      state.message = decision.reason === "locked"
        ? "Open slot first"
        : decision.reason === "empty"
        ? "Empty shop"
        : decision.reason === "insufficientGold"
        ? `Need ${currencyTerm({ lower: true })}`
        : decision.reason === "drinkTarget"
        ? `Drop ${drinkPluralTerm({ lower: true })} on rails`
        : decision.reason === "toppingStorage"
        ? `Store ${toppingPluralTerm({ lower: true })} on bench`
        : decision.reason === "wrongItemBenchKind"
        ? `${itemRailLabel(entry)} slots only`
        : "Drop on grid";
      playGameSfx("invalid");
      return false;
    }
    if (state[targetArea][targetIndex]) {
      if (buyShopMergeIntoSlot(shopIndex, targetArea, targetIndex)) return true;
      state.message = "Spot full";
      playGameSfx("invalid");
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(entry, shopIndex, cost);
    tagPurchasedEntry(entry, cost);
    state[targetArea][targetIndex] = entry;
    clearPurchasedShopSlot(shopIndex);
    state.message = isDrink(entry) && targetArea === "drinks" ? (realityBroken() ? `${displayItemShort(entry)} loaded` : `${entry.short} poured`) : `${entry.short} bought`;
    playGameSfx(isDrink(entry) && targetArea === "drinks" ? "equip" : "buy");
    if (isUnit(entry)) resolveMerges();
    if (isItem(entry)) resolveItemMerges();
    return true;
  }

  function buyShopItemToAnimal(shopIndex, targetArea, targetIndex) {
    if (state.phase !== "prep") return false;
    if (!isShopSlotUnlocked(shopIndex)) {
      state.message = "Open slot first";
      playGameSfx("invalid");
      return false;
    }
    const item = shopEntryAt(shopIndex);
    const unit = state[targetArea]?.[targetIndex];
    if (!isTopping(item)) {
      state.message = `Pick a ${toppingTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    const cost = purchaseCost(item, shopIndex);
    if (state.gold < cost) {
      state.message = `Need ${currencyTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    if (targetArea !== "bench" && targetArea !== "board") {
      state.message = realityBroken() ? "Drop on machine" : "Drop on animal";
      playGameSfx("invalid");
      return false;
    }
    if (!isUnit(unit)) {
      state.message = realityBroken() ? "Drop on machine" : "Drop on animal";
      playGameSfx("invalid");
      return false;
    }
    if (unit.item) {
      state.message = realityBroken() ? "Already armed" : "Already topped";
      playGameSfx("invalid");
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(item, shopIndex, cost);
    tagPurchasedEntry(item, cost);
    unit.item = item;
    refreshUnitItemStats(unit);
    state.shop[shopIndex] = null;
    state.shopFrozen[shopIndex] = false;
    state.shopSales[shopIndex] = false;
    state.selected = { area: targetArea, index: targetIndex };
    state.message = realityBroken() ? `${displayUnitShort(unit)} armed` : `${displayUnitShort(unit)} topped`;
    playGameSfx("equip");
    return true;
  }

  function buyShopItemToEquipment(shopIndex) {
    const target = selectedEquipmentTargetRef(state.drag);
    if (!target) {
      state.message = "Select animal";
      playGameSfx("invalid");
      return false;
    }
    return buyShopItemToAnimal(shopIndex, target.area, target.index);
  }

  function hasShopItemTarget(item) {
    if (isDrink(item)) return firstEmptyItemStorage(item) || firstEmptyDrinkSlot() >= 0 || hasShopMergeTarget(item);
    return (
      firstEmptyItemStorage(item) ||
      hasShopMergeTarget(item) ||
      state.bench.some((entry) => isUnit(entry) && !entry.item) ||
      state.board.some((entry) => isUnit(entry) && !entry.item)
    );
  }

  function toggleShopFreeze(index) {
    const entry = shopEntryAt(index);
    const decision = window.FoodAnimalsShopFlowRuntime.freezeDecision({
      phase: state.phase,
      unlocked: isShopSlotUnlocked(index),
      hasEntry: Boolean(entry),
    });
    if (decision.reason === "wrongPhase") return false;
    if (decision.reason === "locked") {
      state.message = "Open slot first";
      playGameSfx("invalid");
      return false;
    }
    if (decision.reason === "empty") {
      state.message = "Empty shop";
      playGameSfx("invalid");
      return false;
    }
    state.shopFrozen[index] = !state.shopFrozen[index];
    state.message = state.shopFrozen[index] ? `${entryLabel(entry)} locked` : `${entryLabel(entry)} unlocked`;
    playGameSfx("freeze");
    return true;
  }

  function sellSelectedUnit() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep") return false;
    if (ref.area !== "bench" && ref.area !== "board") {
      state.message = "Owned units only";
      return false;
    }
    if (!isUnit(ref.entry)) {
      state.message = "Sell animals only";
      return false;
    }
    return sellOwnedUnit(ref.area, ref.index);
  }

  function sellSelectedItem() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep") return false;
    if (ref.area !== "bench" && ref.area !== "itemBench" && ref.area !== "drinks") {
      state.message = "Owned items only";
      return false;
    }
    if (!isItem(ref.entry)) {
      state.message = `Sell ${toppingPluralTerm({ lower: true })} only`;
      return false;
    }
    return sellOwnedItem(ref.area, ref.index);
  }

  function attachItemFromStorage(sourceArea, itemIndex, targetArea, targetIndex) {
    if (state.phase !== "prep") return false;
    const item = state[sourceArea]?.[itemIndex];
    const unit = state[targetArea]?.[targetIndex];
    if (!isTopping(item)) {
      state.message = `Pick a ${toppingTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    if (!isUnit(unit)) {
      state.message = realityBroken() ? "Drop on machine" : "Drop on animal";
      playGameSfx("invalid");
      return false;
    }
    if (unit.item) {
      state.message = realityBroken() ? "Already armed" : "Already topped";
      playGameSfx("invalid");
      return false;
    }
    state[sourceArea][itemIndex] = null;
    unit.item = item;
    refreshUnitItemStats(unit);
    state.selected = { area: targetArea, index: targetIndex };
    state.message = realityBroken() ? `${displayUnitShort(unit)} armed` : `${displayUnitShort(unit)} topped`;
    playGameSfx("equip");
    return true;
  }

  function attachItemFromBench(itemIndex, targetArea, targetIndex) {
    return attachItemFromStorage("bench", itemIndex, targetArea, targetIndex);
  }

  function attachItemFromBenchToEquipment(itemIndex, sourceArea = state.drag?.area || "bench", drag = state.drag) {
    const target = selectedEquipmentTargetRef(drag);
    if (!target) {
      state.message = "Select animal";
      playGameSfx("invalid");
      return false;
    }
    return attachItemFromStorage(sourceArea, itemIndex, target.area, target.index);
  }

  function moveEquippedItemToStorage(targetArea, targetIndex) {
    const source = selectedEquipmentTargetRef(state.drag);
    if (!source?.unit?.item || state.phase !== "prep") return false;
    const item = source.unit.item;
    if (!itemStorageAccepts(targetArea, targetIndex, item)) {
      state.message = `${itemRailLabel(item)} slots only`;
      playGameSfx("invalid");
      return false;
    }
    if (state[targetArea][targetIndex]) {
      state.message = "Bench spot full";
      playGameSfx("invalid");
      return false;
    }
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    state[targetArea][targetIndex] = item;
    state.selected = { area: targetArea, index: targetIndex };
    state.message = realityBroken() ? `${displayUnitShort(source.unit)} disarmed` : `${displayUnitShort(source.unit)} untopped`;
    playGameSfx("drop");
    resolveItemMerges();
    return true;
  }

  function moveEquippedItemToBench(benchIndex) {
    return moveEquippedItemToStorage("bench", benchIndex);
  }

  function moveEquippedItemToAnimal(targetArea, targetIndex) {
    const source = selectedEquipmentTargetRef(state.drag);
    const target = state[targetArea]?.[targetIndex];
    if (!source?.unit?.item || state.phase !== "prep") return false;
    if (!isUnit(target)) {
      state.message = realityBroken() ? "Drop on machine" : "Drop on animal";
      playGameSfx("invalid");
      return false;
    }
    if (target.item) {
      state.message = realityBroken() ? "Already armed" : "Already topped";
      playGameSfx("invalid");
      return false;
    }
    if (source.area === targetArea && source.index === targetIndex) {
      state.message = "Equipped";
      playGameSfx("invalid");
      return false;
    }
    const item = source.unit.item;
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    target.item = item;
    refreshUnitItemStats(target);
    state.selected = { area: targetArea, index: targetIndex };
    state.message = realityBroken() ? `${displayUnitShort(target)} armed` : `${target.short} topped`;
    playGameSfx("equip");
    return true;
  }

  function placeDrinkFromStorage(sourceArea, itemIndex, drinkIndex) {
    if (state.phase !== "prep") return false;
    const item = state[sourceArea]?.[itemIndex];
    if (!isDrink(item)) {
      state.message = `Pick a ${drinkTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    if (!drinkSlots[drinkIndex]) {
      state.message = `Drop on ${drinkTerm({ lower: true })} rail`;
      playGameSfx("invalid");
      return false;
    }
    return moveUnitToOpenSlot(sourceArea, itemIndex, "drinks", drinkIndex);
  }

  function placeDrinkFromBench(itemIndex, drinkIndex) {
    return placeDrinkFromStorage("bench", itemIndex, drinkIndex);
  }

  function detachSelectedItem() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep" || !isUnit(ref.entry) || !ref.unit.item) return false;
    const spot = firstEmptyItemStorage(ref.unit.item);
    if (!spot) {
      state.message = itemStorageFullMessage(ref.unit.item);
      playGameSfx("invalid");
      return false;
    }
    state[spot.area][spot.index] = ref.unit.item;
    ref.unit.item = null;
    refreshUnitItemStats(ref.unit);
    state.message = realityBroken() ? `${displayUnitShort(ref.unit)} disarmed` : `${displayUnitShort(ref.unit)} untopped`;
    playGameSfx("drop");
    resolveItemMerges();
    return true;
  }

  function sellValue(unit) {
    return window.FoodAnimalsShopEconomy.cappedSellValue(unitSellValueBase(unit), trackedPurchaseGold(unit));
  }

  function itemSellValue(item) {
    return window.FoodAnimalsShopEconomy.itemResaleValue(entryCost(item), trackedPurchaseGold(item));
  }

  function unitSellValueBase(unit) {
    return (ECONOMY.sellValues[unit?.tier] || ECONOMY.sellValues[1]) + (unit?.item?.sellBonusGold || 0);
  }

  function unitMergePurchaseGoldContribution(unit) {
    const paid = trackedPurchaseGold(unit);
    return paid !== null ? paid : (ECONOMY.sellValues[unit?.tier] || ECONOMY.sellValues[1]);
  }

  function itemMergePurchaseGoldContribution(item, purchaseCostOverride = null) {
    const paid = purchaseCostOverride !== null ? normalizedPurchaseGold(purchaseCostOverride) : trackedPurchaseGold(item);
    return paid !== null ? paid : itemSellValue(item);
  }

  function mergedItemPurchaseGold(items, incomingCost = null) {
    const storedTotal = items.reduce((total, item) => total + itemMergePurchaseGoldContribution(item), 0);
    return storedTotal + (incomingCost === null ? 0 : itemMergePurchaseGoldContribution(null, incomingCost));
  }

  function mergedUnitPurchaseGold(units, incomingCost = null) {
    const storedTotal = units.reduce((total, unit) => total + unitMergePurchaseGoldContribution(unit), 0);
    return storedTotal + (incomingCost === null ? 0 : Math.max(0, Math.floor(Number(incomingCost) || 0)));
  }

  function sellOwnedUnit(area, index) {
    const unit = state[area]?.[index];
    const decision = window.FoodAnimalsShopFlowRuntime.sellOwnedDecision({
      phase: state.phase,
      hasEntry: isUnit(unit),
      needsItemStorage: Boolean(unit?.item && area !== "bench"),
      itemStorageAvailable: unit?.item ? firstEmptyItemStorage(unit.item) !== null : true,
    });
    if (decision.reason === "wrongPhase") return false;
    if (decision.reason === "wrongKind") {
      state.message = "Sell animals only";
      playGameSfx("invalid");
      return false;
    }
    if (decision.reason === "itemStorageFull") {
      state.message = itemStorageFullMessage(unit.item);
      playGameSfx("invalid");
      return false;
    }
    const value = sellValue(unit);
    const item = unit.item;
    state[area][index] = null;
    if (item) moveItemToBench(item);
    state.selected = null;
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${displayUnitShort(unit)} sold +${value} ${currencyTerm({ lower: true })}`;
    state.log.unshift(`Sold ${displayUnitFormName(unit)} for ${value} ${currencyTerm({ lower: true })}`);
    playGameSfx("sell");
    return true;
  }

  function sellOwnedItem(area, index) {
    const item = state[area]?.[index];
    const decision = window.FoodAnimalsShopFlowRuntime.sellOwnedDecision({
      phase: state.phase,
      hasEntry: isItem(item),
    });
    if (decision.reason === "wrongPhase") return false;
    if (decision.reason === "wrongKind") {
      state.message = "Sell items only";
      playGameSfx("invalid");
      return false;
    }
    const value = itemSellValue(item);
    state[area][index] = null;
    state.selected = null;
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${displayItemShort(item)} sold +${value} ${currencyTerm({ lower: true })}`;
    state.log.unshift(`Sold ${displayItemName(item)} for ${value} ${currencyTerm({ lower: true })}`);
    playGameSfx("sell");
    return true;
  }

  function sellEquippedItem(drag) {
    if (state.phase !== "prep") return false;
    const source = selectedEquipmentTargetRef(drag);
    if (!source?.unit?.item) {
      state.message = `No ${toppingTerm({ lower: true })}`;
      playGameSfx("invalid");
      return false;
    }
    const item = source.unit.item;
    const value = itemSellValue(item);
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    state.selected = { area: source.area, index: source.index };
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${displayItemShort(item)} sold +${value} ${currencyTerm({ lower: true })}`;
    state.log.unshift(`Sold ${displayItemName(item)} for ${value} ${currencyTerm({ lower: true })}`);
    playGameSfx("sell");
    return true;
  }

  function canSellDrag(drag) {
    return window.FoodAnimalsShopTransactionRuntime.canSellDrag(drag, state, { isItem, isUnit });
  }

  function dragSellValue(drag) {
    return window.FoodAnimalsShopTransactionRuntime.dragSellValue(drag, state, {
      isItem,
      isUnit,
      itemSellValue,
      selectedEquipmentTargetRef,
      sellValue,
    });
  }

  function sellDraggedEntry(drag) {
    if (!canSellDrag(drag)) {
      state.message = "Cannot sell";
      playGameSfx("invalid");
      return false;
    }
    if (drag.area === "equipment") return sellEquippedItem(drag);
    const entry = state[drag.area]?.[drag.index];
    if (isUnit(entry)) return sellOwnedUnit(drag.area, drag.index);
    if (isItem(entry)) return sellOwnedItem(drag.area, drag.index);
    state.message = "Cannot sell";
    return false;
  }

  function selectFrom(area, index) {
    const entry = area === "shop" ? shopEntryAt(index) : state[area][index];
    if (area === "shop") {
      state.selected = entry ? { area, index } : null;
      return;
    }
    if (state.selected?.area === "shop") {
      state.selected = entry ? { area, index } : null;
      return;
    }
    if (!entry) {
      if (state.selected) moveSelected(area, index);
      return;
    }
    if (state.selected && state.selected.area !== area) {
      moveSelected(area, index);
      return;
    }
    state.selected = { area, index };
  }

  function moveSelected(area, index) {
    if (!state.selected || state.phase !== "prep") return;
    const from = state.selected;
    if (from.area === "shop") {
      state.selected = null;
      state.message = "Drag to buy";
      return;
    }
    const moving = state[from.area][from.index];
    if (!moving) {
      state.selected = null;
      return;
    }
    const selectedTarget = state[area]?.[index];
    if (isTopping(moving) && isUnit(selectedTarget)) {
      attachItemFromStorage(from.area, from.index, area, index);
      return;
    }
    if (from.area === "bench" && area === "bench" && from.index !== index) {
      moveUnitToOpenSlot(from.area, from.index, area, index);
      return;
    }
    if (isItem(moving)) {
      if (isDrink(moving) && isItemStorageArea(from.area) && area === "drinks") {
        moveUnitToOpenSlot(from.area, from.index, area, index);
        return;
      }
      if (isDrink(moving) && from.area === "drinks" && area === "drinks") {
        moveUnitToOpenSlot(from.area, from.index, area, index);
        return;
      }
      if (isItemStorageArea(area)) {
        const target = state[area][index];
        if (!itemStorageAccepts(area, index, moving)) {
          state.message = `${itemRailLabel(moving)} slots only`;
          return;
        }
        if (target && !isItem(target)) {
          state.message = "Spot full";
          return;
        }
        state[area][index] = moving;
        state[from.area][from.index] = null;
        if (target && isItemStorageArea(from.area) && itemStorageAccepts(from.area, from.index, target)) {
          state[from.area][from.index] = target;
        } else if (target) {
          const spot = firstEmptyItemStorage(target);
          if (!spot) {
            state[area][index] = target;
            state[from.area][from.index] = moving;
            state.message = itemStorageFullMessage(target);
            return;
          }
          state[spot.area][spot.index] = target;
        }
        state.selected = null;
        state.message = target ? "Bench swapped" : `${itemRailLabel(moving)} stored`;
        resolveItemMerges();
        return;
      }
      if (isDrink(moving)) {
        state.message = `Drop on ${drinkTerm({ lower: true })} rail`;
        return;
      }
      attachItemFromStorage(from.area, from.index, area, index);
      return;
    }
    if (area !== "bench" && area !== "board") {
      state.message = "Drop on board";
      return;
    }
    const target = state[area][index];
    if (isItem(target)) {
      state.message = "Spot full";
      return;
    }
    state[area][index] = moving;
    state[from.area][from.index] = target;
    state.selected = null;
    state.message = "Set";
    resolveMerges();
  }

  function moveUnitToOpenSlot(fromArea, fromIndex, toArea, toIndex) {
    if (state.phase !== "prep") return false;
    const moving = state[fromArea]?.[fromIndex];
    if (!moving) return false;
    if (isItem(moving)) {
      if (isDrink(moving) && toArea === "drinks") {
        if (fromArea === toArea && fromIndex === toIndex) {
          state.message = `${drinkTerm()} placed`;
          playGameSfx("invalid");
          return false;
        }
        const target = state.drinks[toIndex];
        if (target && !isDrink(target)) {
          state.message = `${drinkTerm()} slot full`;
          playGameSfx("invalid");
          return false;
        }
        if (target && isItemStorageArea(fromArea) && !itemStorageAccepts(fromArea, fromIndex, target)) {
          state.message = `${itemRailLabel(target)} slots only`;
          playGameSfx("invalid");
          return false;
        }
        state.drinks[toIndex] = moving;
        state[fromArea][fromIndex] = target || null;
        state.selected = null;
        state.message = target ? `${drinkTerm()}s swapped` : `${displayItemShort(moving)} moved`;
        playGameSfx("drop");
        resolveItemMerges();
        return true;
      }
      if (!isItemStorageArea(toArea)) {
        state.message = isDrink(moving) ? `Drop on ${drinkTerm({ lower: true })} rail` : `${toppingPluralTerm()} stay on bench`;
        playGameSfx("invalid");
        return false;
      }
      if (fromArea === toArea && fromIndex === toIndex) {
        state.message = `${itemRailLabel(moving)} stored`;
        playGameSfx("invalid");
        return false;
      }
      if (!itemStorageAccepts(toArea, toIndex, moving)) {
        state.message = `${itemRailLabel(moving)} slots only`;
        playGameSfx("invalid");
        return false;
      }
      const target = state[toArea][toIndex];
      if (target && !isItem(target)) {
        state.message = "Spot full";
        playGameSfx("invalid");
        return false;
      }
      if (isItemStorageArea(fromArea) && (!target || itemStorageAccepts(fromArea, fromIndex, target))) {
        state[toArea][toIndex] = moving;
        state[fromArea][fromIndex] = target;
        state.selected = null;
        state.message = target ? "Bench swapped" : `${itemRailLabel(moving)} stored`;
        playGameSfx("drop");
        resolveItemMerges();
        return true;
      }
      if (target) {
        const spot = firstEmptyItemStorage(target);
        if (!spot) {
          state.message = itemStorageFullMessage(target);
          playGameSfx("invalid");
          return false;
        }
        state[spot.area][spot.index] = target;
      }
      state[toArea][toIndex] = moving;
      state[fromArea][fromIndex] = null;
      state.selected = null;
      state.message = `${itemRailLabel(moving)} stored`;
      playGameSfx("drop");
      resolveItemMerges();
      return true;
    }
    if (toArea !== "bench" && toArea !== "board") {
      state.message = "Drop on board";
      playGameSfx("invalid");
      return false;
    }
    if (fromArea === toArea && fromIndex === toIndex) {
      state.message = "Set";
      playGameSfx("invalid");
      return false;
    }
    const target = state[toArea][toIndex];
    if (fromArea === "bench" && toArea === "bench") {
      state.bench[toIndex] = moving;
      state.bench[fromIndex] = target;
      state.selected = null;
      state.message = target ? "Bench swapped" : "Set";
      playGameSfx("drop");
      resolveMerges();
      return true;
    }
    if (target) {
      if (
        (fromArea === "bench" && toArea === "board" && isUnit(target)) ||
        (fromArea === "board" && toArea === "board" && isUnit(target))
      ) {
        state.board[toIndex] = moving;
        state[fromArea][fromIndex] = target;
        state.selected = null;
        state.message = "Swapped";
        playGameSfx("drop");
        resolveMerges();
        return true;
      }
      state.message = "Spot full";
      playGameSfx("invalid");
      return false;
    }
    state[toArea][toIndex] = moving;
    state[fromArea][fromIndex] = null;
    state.selected = null;
    state.message = "Set";
    playGameSfx("drop");
    resolveMerges();
    return true;
  }

  function teamPower() {
    return state.board.reduce((sum, unit) => sum + (isUnit(unit) ? unit.tier : 0), 0);
  }

  function playerBoardPowerScore() {
    const boardUnits = (state?.board || []).filter(isUnit);
    const boardTierScore = boardUnits.reduce((sum, unit) => sum + (unit.tier || 1), 0);
    const equippedItemScore = boardUnits.reduce((sum, unit) => sum + (unit.item ? itemTier(unit.item.tier) * 0.55 : 0), 0);
    const drinkScore = (state?.drinks || []).filter(isDrink).reduce((sum, drink) => sum + itemTier(drink.tier) * 0.45, 0);
    const traitScore = traitSnapshotForUnits(boardUnits).reduce((sum, trait) => sum + (trait.stage || 0) * 0.35, 0);
    const permanentHpScore = boardUnits.reduce((sum, unit) => sum + Math.min(1.6, (unit.permanentHpBonus || 0) / 90), 0);
    return boardTierScore + equippedItemScore + drinkScore + traitScore + permanentHpScore;
  }

  function playerEconomyPowerScore(round = state.round) {
    const economyGate = clamp((round - 2) / 10, 0, 1);
    if (economyGate <= 0) return 0;
    const benchTierScore = (state?.bench || [])
      .filter(isUnit)
      .reduce((sum, unit) => sum + (unit.tier || 1) * 0.32 + (unit.item ? itemTier(unit.item.tier) * 0.18 : 0), 0);
    const storedItemScore = (state?.itemBench || [])
      .filter(isItem)
      .reduce((sum, item) => sum + itemTier(item.tier) * 0.24, 0);
    const shopLevelScore = Math.max(0, (state?.shopLevel || 1) - 1) * 0.85;
    const unlockedSlotScore = Math.max(0, (state?.shopUnlocked || []).filter(Boolean).length - SHOP_STARTING_UNLOCKED_SLOTS) * 0.42;
    const bankScore = clamp((state?.gold || 0) / 115, 0, 3.2);
    const freeRollScore = clamp((state?.freeRolls || 0) * 0.18, 0, 1.25);
    const arenaPrepScore = state?.arenaPrepBuff ? 0.95 : 0;
    const economyRunawayScore = enemyEconomyRunawayPressure(round) * 2.7;
    return economyGate * (benchTierScore + storedItemScore + shopLevelScore + unlockedSlotScore + bankScore + freeRollScore + arenaPrepScore + economyRunawayScore);
  }

  function playerTotalPowerScore(round = state.round) {
    return playerBoardPowerScore() + playerEconomyPowerScore(round);
  }

  function purchasedValueSurplus(entry, marketValue) {
    const paid = trackedPurchaseGold(entry);
    if (paid === null) return 0;
    return clamp((marketValue || 0) - paid, 0, Math.max(0, marketValue || 0));
  }

  function playerItemEconomyValue(item, options = {}) {
    if (!isItem(item)) return { market: 0, surplus: 0 };
    const market = enemyItemEconomyCost(item, itemTier(item.tier)) * (options.weight ?? 1);
    return {
      market,
      surplus: purchasedValueSurplus(item, market),
    };
  }

  function playerUnitEconomyValue(unit, slot = 0, options = {}) {
    if (!isUnit(unit)) return { market: 0, surplus: 0 };
    const unitMarket = enemyUnitEconomyCost(unit.typeId, unit.tier || 1, slot) * (options.weight ?? 1);
    const itemValue = playerItemEconomyValue(unit.item, { weight: options.itemWeight ?? options.weight ?? 1 });
    return {
      market: unitMarket + itemValue.market,
      surplus: purchasedValueSurplus(unit, unitMarket) + itemValue.surplus,
    };
  }

  function playerOwnedEconomyValue() {
    let market = 0;
    let surplus = 0;
    (state?.board || []).forEach((unit, index) => {
      const value = playerUnitEconomyValue(unit, index, { weight: 1, itemWeight: 0.9 });
      market += value.market;
      surplus += value.surplus;
    });
    (state?.bench || []).forEach((entry, index) => {
      const value = isUnit(entry)
        ? playerUnitEconomyValue(entry, index, { weight: 0.58, itemWeight: 0.42 })
        : playerItemEconomyValue(entry, { weight: 0.5 });
      market += value.market;
      surplus += value.surplus;
    });
    (state?.itemBench || []).forEach((item) => {
      const value = playerItemEconomyValue(item, { weight: 0.58 });
      market += value.market;
      surplus += value.surplus;
    });
    (state?.drinks || []).forEach((drink) => {
      const value = playerItemEconomyValue(drink, { weight: 0.82 });
      market += value.market;
      surplus += value.surplus;
    });
    const shopInvestment = Math.max(0, (state?.shopLevel || 1) - 1) * 56
      + Math.max(0, (state?.shopUnlocked || []).filter(Boolean).length - SHOP_STARTING_UNLOCKED_SLOTS) * 24;
    const liquidValue = clamp(state?.gold || 0, 0, ECONOMY.maxGold) * 0.55
      + clamp(state?.freeRolls || 0, 0, 12) * Math.max(ECONOMY.rollCost || 0, 1) * 0.65
      + (state?.arenaPrepBuff ? 72 : 0);
    return {
      market: market + shopInvestment + liquidValue,
      surplus,
    };
  }

  function expectedPlayerEconomyValueForRound(round) {
    const completedRounds = Math.max(0, round - 1);
    const averageIncome = ((ECONOMY.winGold || 0) + (ECONOMY.lossGold || 0)) / 2;
    const rewardValue = isInfiniteMode() ? 28 : 24;
    const shopTempo = Math.max(0, round - 4) * 9;
    const post20Tempo = Math.max(0, round - FINAL_VICTORY_ROUND) * 72;
    return (ECONOMY.startingGold || 0) + completedRounds * (averageIncome + rewardValue) + shopTempo + post20Tempo;
  }

  function playerEconomyComparison(round = state.round) {
    const value = playerOwnedEconomyValue();
    const expected = expectedPlayerEconomyValueForRound(round);
    const totalValue = value.market + value.surplus * 0.55;
    const surplusValue = Math.max(0, totalValue - expected);
    const ratio = expected > 0 ? totalValue / expected : 1;
    const pressure = clamp(Math.max(0, ratio - 1.2) * 0.32 + Math.max(0, surplusValue - 260) / 3600, 0, isInfiniteMode() ? 0.44 : 0.22);
    return {
      expected,
      market: value.market,
      dealSurplus: value.surplus,
      totalValue,
      surplusValue,
      ratio,
      pressure,
      outOfControl: ratio >= 1.25 || surplusValue >= 340,
    };
  }

  function enemyEconomyRunawayPressure(round = state.round) {
    return playerEconomyComparison(round).pressure;
  }

  function expectedPlayerPowerForRound(round) {
    const storyExpectation = Math.min(34, 4 + round * 1.15);
    if (!isInfiniteMode() || round <= FINAL_VICTORY_ROUND) return storyExpectation;
    const over20 = Math.max(0, round - FINAL_VICTORY_ROUND);
    return Math.min(96, storyExpectation + over20 * 1.4 + Math.pow(over20, 1.18) * 0.32);
  }

  function enemyAdaptivePressure(round) {
    const overage = playerTotalPowerScore(round) - expectedPlayerPowerForRound(round);
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const economyRunawayPressure = enemyEconomyRunawayPressure(round);
    const cap = infinitePressure > 0
      ? clamp(0.22 + infinitePressure * 0.009, 0.22, 0.7)
      : enemyPreFinalAdaptiveCap(round);
    const divisor = infinitePressure > 0 ? 20 : enemyPreFinalAdaptiveDivisor(round);
    return clamp(overage / divisor + economyRunawayPressure * 0.42, 0, clamp(cap + economyRunawayPressure * 0.28, cap, isInfiniteMode() ? 0.84 : 0.48));
  }

  function enemyPreFinalAdaptiveCap(round) {
    const lateRelief = enemyPreFinalLateRelief(round);
    return clamp((0.2 + Math.max(0, round - 4) * 0.01) - lateRelief * 0.035, 0.2, 0.36);
  }

  function enemyPreFinalAdaptiveDivisor(round) {
    return clamp(28 - Math.max(0, round - 4) * 0.38, 22, 28);
  }

  function enemyPreFinalLateRelief(round) {
    if (isInfiniteMode() || round <= 14 || round > FINAL_VICTORY_ROUND) return 0;
    return clamp((round - 14) / Math.max(1, FINAL_VICTORY_ROUND - 14), 0, 1);
  }

  function enemyPreFinalLateScale(round, maxRelief = 0.12) {
    return 1 - enemyPreFinalLateRelief(round) * maxRelief;
  }

  function enemyPreFinalCatchupShare(round) {
    return clamp(0.55 + Math.max(0, round - 4) * 0.01, 0.55, 0.72);
  }

  function enemyPreFinalCatchupStatBonus(round, adaptivePressure = enemyAdaptivePressure(round)) {
    if (round > FINAL_VICTORY_ROUND || adaptivePressure <= 0) return 0;
    const roundWeight = clamp((round - 4) / 16, 0, 1);
    return adaptivePressure * roundWeight * 0.28;
  }

  function enemyStoryRewardPressure(round) {
    if (isInfiniteMode()) return 0;
    return clamp(Math.max(0, round - 3) * 0.009 + Math.max(0, round - GIRAFFE_BOSS_ROUND) * 0.005, 0, 0.17);
  }

  function enemyBossAdaptiveStatBonus(round, adaptivePressure = enemyAdaptivePressure(round)) {
    return adaptivePressure * 0.42
      + enemyPreFinalCatchupStatBonus(round, adaptivePressure) * 0.55
      + enemyStoryRewardPressure(round) * 0.58
      + enemyEconomyRunawayPressure(round) * 0.5;
  }

  function enemyLatePressure(round) {
    return Math.max(0, round - 14);
  }

  function steppedRoundBonus(round, table) {
    return table.find((entry) => round >= entry.round)?.bonus || 0;
  }

  function enemyShopPowerStatBonus(round) {
    return steppedRoundBonus(round, SHOP_POWER_ENEMY_STAT_BONUS_BY_ROUND);
  }

  function enemyShopPowerTierBonus(round) {
    return steppedRoundBonus(round, SHOP_POWER_ENEMY_TIER_BONUS_BY_ROUND);
  }

  function enemyShopPowerTier3Bonus(round) {
    return steppedRoundBonus(round, SHOP_POWER_ENEMY_TIER3_BONUS_BY_ROUND);
  }

  function isFinalBossRound(round = state.round) {
    return !isInfiniteMode() && round === FINAL_VICTORY_ROUND;
  }

  function makeFinalBossEnemyPlan(round = FINAL_VICTORY_ROUND) {
    const adaptivePressure = enemyAdaptivePressure(round);
    const catchupStatBonus = enemyPreFinalCatchupStatBonus(round, adaptivePressure);
    const storyRewardPressure = enemyStoryRewardPressure(round);
    const economyComparison = playerEconomyComparison(round);
    const lateScale = enemyPreFinalLateScale(round, 0.14);
    const bossAdaptiveStatBonus = enemyBossAdaptiveStatBonus(round, adaptivePressure);
    const hpMultiplier = FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER + bossAdaptiveStatBonus;
    const atkMultiplier = FINAL_BOSS_SHOP_POWER_ATK_MULTIPLIER + bossAdaptiveStatBonus * 0.62 * lateScale;
    return {
      round,
      finalBoss: true,
      archetypeId: "neural_overmind",
      archetypeLabel: "Neural Overmind",
      primaryArchetypeId: "neural_overmind",
      primaryArchetypeLabel: "Neural Overmind",
      secondaryArchetypeId: "brainstem_guard",
      secondaryArchetypeLabel: "Brainstem Guard",
      themeTrait: null,
      count: 8,
      rarityWeights: { common: 0, uncommon: 0, rare: 0, epic: 100 },
      expectedPlayerPower: Number(expectedPlayerPowerForRound(round).toFixed(2)),
      targetPlayerPower: Number(enemyEconomyTargetPower(round).toFixed(2)),
      playerBoardPower: Number(playerBoardPowerScore().toFixed(2)),
      playerEconomyPower: Number(playerEconomyPowerScore(round).toFixed(2)),
      playerTotalPower: Number(playerTotalPowerScore(round).toFixed(2)),
      playerEconomyComparison: economyComparison,
      targetExtraTier: enemyEconomyTargetExtraTier(round, adaptivePressure),
      tier3Chance: enemyEconomyTier3Chance(round, adaptivePressure),
      tier4Chance: enemyEconomyTier4Chance(round, adaptivePressure),
      hpMultiplier,
      atkMultiplier,
      toppingCount: 0,
      drinkCount: 0,
      adaptivePressure,
      catchupStatBonus,
      storyRewardPressure,
      economyRunawayPressure: economyComparison.pressure,
      bossAdaptiveStatBonus,
      shopPowerStatBonus: hpMultiplier - 1,
      shopPowerTierBonus: 0,
      shopPowerTier3Bonus: 0,
    };
  }

  function makeEnemyPlan(round = state.round) {
    if (isFinalBossRound(round)) return makeFinalBossEnemyPlan(round);
    if (isGiraffeBossRound(round)) return makeGiraffeBossEnemyPlan(round);
    return makeStandardEnemyPlan(round);
  }

  function isGiraffeBossRound(round = state.round) {
    return !isInfiniteMode() && round === GIRAFFE_BOSS_ROUND;
  }

  function isBossRound(round = state.round) {
    return isGiraffeBossRound(round) || isFinalBossRound(round);
  }

  function makeGiraffeBossEnemyPlan(round = GIRAFFE_BOSS_ROUND) {
    const plan = makeStandardEnemyPlan(round);
    const bossAdaptiveStatBonus = enemyBossAdaptiveStatBonus(round, plan.adaptivePressure);
    return {
      ...plan,
      archetypeId: `${GIRAFFE_BOSS_TYPE_ID}_${plan.archetypeId}`,
      archetypeLabel: `Banana Split Boss + ${plan.archetypeLabel}`,
      giraffeBoss: true,
      bossTypeId: GIRAFFE_BOSS_TYPE_ID,
      bossSlot: GIRAFFE_BOSS_SLOT,
      bossAdaptiveStatBonus,
      bossHpMultiplier: 1 + bossAdaptiveStatBonus,
      bossAtkMultiplier: 1 + bossAdaptiveStatBonus * 0.75,
    };
  }

  function makeStandardEnemyPlan(round = state.round) {
    const rarityWeights = enemyEconomyRarityWeights(round);
    const adaptivePressure = enemyAdaptivePressure(round);
    const latePressure = enemyLatePressure(round);
    const shopPowerStatBonus = enemyShopPowerStatBonus(round);
    const economyJitter = enemyEconomyBudgetJitter(round);
    const post20Pressure = enemyPost20EconomyPressure(round);
    const infiniteStatBonus = enemyInfiniteStatBonus(round, adaptivePressure);
    const catchupStatBonus = enemyPreFinalCatchupStatBonus(round, adaptivePressure);
    const storyRewardPressure = enemyStoryRewardPressure(round);
    const economyComparison = playerEconomyComparison(round);
    const economyRunawayPressure = economyComparison.pressure;
    const lateScale = enemyPreFinalLateScale(round, 0.12);
    const budget = enemyEconomyBudget(round, adaptivePressure, economyJitter);
    const minimumUnitCount = boardSlots.length;
    return {
      round,
      archetypeId: "economy_random",
      archetypeLabel: "Economy Random",
      primaryArchetypeId: "economy_random",
      primaryArchetypeLabel: "Economy Random",
      secondaryArchetypeId: null,
      secondaryArchetypeLabel: null,
      themeTrait: null,
      count: 0,
      minimumUnitCount,
      rarityWeights,
      expectedPlayerPower: Number(expectedPlayerPowerForRound(round).toFixed(2)),
      targetPlayerPower: Number(enemyEconomyTargetPower(round).toFixed(2)),
      playerBoardPower: Number(playerBoardPowerScore().toFixed(2)),
      playerEconomyPower: Number(playerEconomyPowerScore(round).toFixed(2)),
      playerTotalPower: Number(playerTotalPowerScore(round).toFixed(2)),
      playerEconomyComparison: economyComparison,
      economyRunawayPressure,
      targetExtraTier: enemyEconomyTargetExtraTier(round, adaptivePressure),
      tier3Chance: enemyEconomyTier3Chance(round, adaptivePressure),
      tier4Chance: enemyEconomyTier4Chance(round, adaptivePressure),
      hpMultiplier: Math.max(0.55, 0.77 + round * 0.033 + (latePressure * 0.008 + adaptivePressure * 0.145 + infiniteStatBonus + catchupStatBonus + storyRewardPressure * 0.2 + economyRunawayPressure * 0.24) * lateScale + shopPowerStatBonus),
      atkMultiplier: Math.max(0.55, 0.77 + round * 0.031 + (latePressure * 0.005 + adaptivePressure * 0.11 + infiniteStatBonus * 0.68 + catchupStatBonus * 0.68 + storyRewardPressure * 0.12 + economyRunawayPressure * 0.16) * lateScale + shopPowerStatBonus),
      economyBudget: budget,
      economyJitter,
      post20Pressure,
      unitBudget: budget,
      toppingBudget: 0,
      drinkBudget: 0,
      unitSpend: 0,
      toppingSpend: 0,
      drinkSpend: 0,
      positionSpend: 0,
      toppingCount: 0,
      drinkCount: 0,
      adaptivePressure,
      infiniteStatBonus,
      catchupStatBonus,
      storyRewardPressure,
      economyRunawayPressure,
      shopPowerStatBonus,
      shopPowerTierBonus: enemyShopPowerTierBonus(round),
      shopPowerTier3Bonus: enemyShopPowerTier3Bonus(round),
      spendPriority: ["fillBoard", "upgradeUnits", "drinks", "toppings"],
    };
  }

  function enemyEconomyBudget(round, adaptivePressure = enemyAdaptivePressure(round), jitter = enemyEconomyBudgetJitter(round)) {
    const latePressure = enemyLatePressure(round);
    const targetPower = enemyEconomyTargetPower(round);
    const post20Pressure = enemyPost20EconomyPressure(round);
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const storyRewardPressure = enemyStoryRewardPressure(round);
    const economyRunawayPressure = enemyEconomyRunawayPressure(round);
    const lateScale = enemyPreFinalLateScale(round, 0.12);
    const base = 10
      + Math.max(0, targetPower - 1) * 14.5
      + round * 8
      + Math.pow(Math.max(1, round), 1.05) * 1.4
      + post20Pressure * 34
      + infinitePressure * 12
      + storyRewardPressure * 64 * lateScale
      + economyRunawayPressure * 135 * lateScale;
    const shopPower = 1 + enemyShopPowerStatBonus(round) + enemyShopPowerTierBonus(round);
    const pressure = 1 + (adaptivePressure * 1.15 + latePressure * 0.018 + storyRewardPressure * 0.26 + economyRunawayPressure * 0.52) * lateScale + post20Pressure * 0.04 + infinitePressure * 0.012;
    return Math.max(ECONOMY.unitCost, Math.round(base * shopPower * pressure * jitter));
  }

  function enemyEconomyBudgetJitter(round) {
    const over20 = Math.max(0, round - FINAL_VICTORY_ROUND);
    const range = Math.min(0.14, 0.06 + over20 * 0.006);
    return 1 + (random() * 2 - 1) * range;
  }

  function enemyPost20EconomyPressure(round) {
    const over20 = Math.max(0, round - FINAL_VICTORY_ROUND);
    return over20 <= 0 ? 0 : over20 + Math.pow(over20, 1.35) * 0.62;
  }

  function enemyInfinitePost20Pressure(round) {
    return isInfiniteMode() ? enemyPost20EconomyPressure(round) : 0;
  }

  function enemyInfiniteStatBonus(round, adaptivePressure = enemyAdaptivePressure(round)) {
    const infinitePressure = enemyInfinitePost20Pressure(round);
    if (infinitePressure <= 0) return 0;
    return clamp(infinitePressure * 0.018 + adaptivePressure * 0.22, 0, 5.5);
  }

  function enemyEconomyTargetPower(round) {
    const expectedPower = expectedPlayerPowerForRound(round);
    const actualPower = playerTotalPowerScore(round);
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const catchupShare = infinitePressure > 0 ? clamp(0.68 + infinitePressure * 0.004, 0.68, 0.92) : enemyPreFinalCatchupShare(round);
    return expectedPower + Math.max(0, actualPower - expectedPower) * catchupShare;
  }

  function enemyEconomyRarityWeights(round) {
    const shopLevel = clamp(1 + Math.floor((round - 1) / 3), 1, MAX_SHOP_LEVEL);
    const weights = window.FoodAnimalsShopEconomy.rarityWeights(SHOP_LEVELS, shopLevel);
    return {
      common: Math.max(1, weights.common || 0),
      uncommon: Math.max(0, weights.uncommon || 0),
      rare: Math.max(0, weights.rare || 0),
      epic: Math.max(0, weights.epic || 0),
    };
  }

  function enemyEconomyTargetExtraTier(round, adaptivePressure = 0) {
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const cap = infinitePressure > 0 ? clamp(0.95 + infinitePressure * 0.018, 0.95, 2.25) : 0.95;
    const roundBase = Math.min(infinitePressure > 0 ? 1.12 : 0.66, round * 0.038);
    const adaptiveTierPressure = adaptivePressure * (infinitePressure > 0 ? 0.46 : 0.42);
    const lateScale = enemyPreFinalLateScale(round, 0.14);
    return clamp(roundBase + (adaptiveTierPressure + enemyStoryRewardPressure(round) * 0.2 + enemyEconomyRunawayPressure(round) * 0.3) * lateScale + enemyShopPowerTierBonus(round) + infinitePressure * 0.012, 0, cap);
  }

  function enemyEconomyTier3Chance(round, adaptivePressure = 0) {
    if (round < 8 && adaptivePressure < 0.15) return 0;
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const cap = infinitePressure > 0 ? clamp(0.34 + infinitePressure * 0.006, 0.34, 0.72) : 0.34;
    const adaptiveTier3Pressure = adaptivePressure * (infinitePressure > 0 ? 0.07 : 0.1);
    const lateScale = enemyPreFinalLateScale(round, 0.14);
    return clamp((round - 7) * 0.012 + (adaptiveTier3Pressure + enemyStoryRewardPressure(round) * 0.085 + enemyEconomyRunawayPressure(round) * 0.12) * lateScale + enemyShopPowerTier3Bonus(round) + infinitePressure * 0.0045, 0, cap);
  }

  function enemyEconomyTier4Chance(round, adaptivePressure = 0) {
    if (round < 15 && adaptivePressure < 0.24) return 0;
    const infinitePressure = enemyInfinitePost20Pressure(round);
    const cap = infinitePressure > 0 ? clamp(0.18 + infinitePressure * 0.0032, 0.18, 0.46) : 0.18;
    const adaptiveTier4Pressure = adaptivePressure * (infinitePressure > 0 ? 0.055 : 0.075);
    const lateScale = enemyPreFinalLateScale(round, 0.16);
    return clamp((round - 14) * 0.0038 + (adaptiveTier4Pressure + enemyStoryRewardPressure(round) * 0.035 + enemyEconomyRunawayPressure(round) * 0.07) * lateScale + infinitePressure * 0.0028, 0, cap);
  }

  function chooseEnemyArchetype(round) {
    const options = ENEMY_ARCHETYPES.filter((archetype) => round >= (archetype.minRound || 1));
    return weightedChoice(options, (archetype) => archetype.weight || 1) || ENEMY_ARCHETYPES[0];
  }

  function chooseEnemySecondaryArchetype(round, primaryArchetype) {
    const options = ENEMY_ARCHETYPES.filter((archetype) => archetype.id !== primaryArchetype?.id && round >= (archetype.minRound || 1));
    return weightedChoice(options, (archetype) => Math.max(1, archetype.weight || 1)) || primaryArchetype || ENEMY_ARCHETYPES[0];
  }

  function blendEnemyArchetypes(primaryArchetype, secondaryArchetype) {
    return window.FoodAnimalsEnemyTeamRuntime.blendEnemyArchetypes(primaryArchetype, secondaryArchetype, {
      fallback: ENEMY_ARCHETYPES[0],
      primaryShare: ENEMY_ARCHETYPE_PRIMARY_SHARE,
      noiseFor: enemyArchetypeNoise,
    });
  }

  function blendedEnemyBias(primary, secondary, key, primaryShare, secondaryShare, min, max) {
    return window.FoodAnimalsEnemyTeamRuntime.blendedEnemyBias(
      primary,
      secondary,
      key,
      primaryShare,
      secondaryShare,
      min,
      max,
      enemyArchetypeNoise(key),
    );
  }

  function enemyArchetypeNoise(key) {
    const range = ENEMY_ARCHETYPE_NOISE[key] || 0;
    return (random() * 2 - 1) * range;
  }

  function enemyArchetypeRarityBias(archetype) {
    return window.FoodAnimalsEnemyTeamRuntime.enemyArchetypeRarityBias(archetype);
  }

  function chooseEnemyThemeTrait() {
    const arenaTraits = arenaRewardTraits().filter((traitId) => TRAITS[traitId]);
    const allTraits = Object.keys(TRAITS);
    const pool = random() < 0.68 && arenaTraits.length ? arenaTraits : allTraits;
    return pool[randInt(pool.length)] || null;
  }

  function enemyCountJitter(round) {
    if (round <= 1) return 0;
    const roll = random();
    if (roll < 0.18) return -1;
    if (roll > 0.78) return 1;
    return 0;
  }

  function enemyTargetExtraTier(round, archetype, adaptivePressure = 0) {
    return clamp(Math.min(0.6, round * 0.044) + enemyLatePressure(round) * 0.011 + adaptivePressure * 0.31 + enemyShopPowerTierBonus(round) + (archetype.tierBias || 0), 0, 0.95);
  }

  function enemyTier3Chance(round, archetype, adaptivePressure = 0) {
    if (round < 8 && adaptivePressure < 0.15) return 0;
    return clamp((round - 7) * 0.013 + adaptivePressure * 0.08 + enemyShopPowerTier3Bonus(round) + (archetype.tier3Bias || 0), 0, 0.24);
  }

  function enemyTier4Chance(round, archetype, adaptivePressure = 0) {
    if (round < 15 && adaptivePressure < 0.24) return 0;
    return clamp((round - 14) * 0.0055 + adaptivePressure * 0.062 + (archetype.tier3Bias || 0) * 0.38, 0, 0.09);
  }

  function enemyTierForPlan(plan) {
    return window.FoodAnimalsEnemyTeamRuntime.enemyTierForPlan(plan, random);
  }

  function enemyRarityWeights(round, archetype = ENEMY_ARCHETYPES[0]) {
    return window.FoodAnimalsEnemyTeamRuntime.enemyRarityWeights(round, archetype, enemyLatePressure(round));
  }

  function chooseEnemyRarity(weights) {
    const entries = Object.keys(RARITIES)
      .map((id) => ({ id, weight: Math.max(0, weights?.[id] || 0) }))
      .filter((entry) => entry.weight > 0);
    return weightedChoice(entries, (entry) => entry.weight)?.id || "common";
  }

  function enemyRarityAvailable(rarityId, weights) {
    return rarityId === "common" || (weights?.[rarityId] || 0) > 0;
  }

  function enemySupportCount(round, max, every, bias = 0) {
    return window.FoodAnimalsEnemyTeamRuntime.enemySupportCount(round, max, every, bias, random);
  }

  function stochasticRound(value) {
    return window.FoodAnimalsEnemyTeamRuntime.stochasticRound(value, random);
  }

  function weightedChoice(entries, weightFor) {
    return window.FoodAnimalsEnemyTeamRuntime.weightedChoice(entries, weightFor, random);
  }

  function chooseEnemyUnitId(plan, usedTypeIds = []) {
    const rarity = chooseEnemyRarity(plan.rarityWeights);
    const rarityPool = CATALOG.filter((unit) => (unit.rarity || "common") === rarity);
    const themedPool = plan.themeTrait
      ? rarityPool.filter((unit) => unit.traits?.includes(plan.themeTrait))
      : [];
    let pool = themedPool.length ? themedPool : rarityPool;
    if (!pool.length && plan.themeTrait) pool = CATALOG.filter((unit) => unit.traits?.includes(plan.themeTrait));
    if (!pool.length) pool = CATALOG.filter((unit) => (unit.rarity || "common") === "common");
    const unused = pool.filter((unit) => !usedTypeIds.includes(unit.id));
    const available = unused.length && random() < 0.82 ? unused : pool;
    return available[randInt(available.length)]?.id || CATALOG[0].id;
  }

  function rarityEconomyCost(rarityId) {
    return {
      common: 0,
      uncommon: 8,
      rare: 22,
      epic: 42,
    }[rarityId || "common"] || 0;
  }

  function enemyUnitTierCost(tier = 1) {
    const multipliers = { 1: 1, 2: 2.2, 3: 4.7, 4: 9.2 };
    return Math.round(ECONOMY.unitCost * (multipliers[Math.max(1, Math.min(4, tier))] || 1));
  }

  function enemyPositionCost(slot) {
    const { col, row } = slotGrid(slot);
    const columnCost = col === FRONT_COL ? 8 : col === BACK_COL ? 1 : 4;
    const centerCost = row === 1 ? 3 : 0;
    return columnCost + centerCost;
  }

  function enemyUnitEconomyCost(typeId, tier = 1, slot = 0) {
    const base = CATALOG.find((unit) => unit.id === typeId) || CATALOG[0];
    return enemyUnitTierCost(tier) + rarityEconomyCost(base.rarity) + enemyPositionCost(slot);
  }

  function enemyItemEconomyCost(item, tier = 1) {
    if (!item) return 0;
    const base = item.price || (isDrink(item) ? ECONOMY.itemCost : ECONOMY.itemCost);
    const tierMultiplier = SHOP_TIER_COST_MULTIPLIERS[itemTier(tier)] || 1;
    return Math.round(base * tierMultiplier + rarityEconomyCost(item.rarity) * 0.45);
  }

  function enemyEconomyTierWeight(tier, plan) {
    const storyRewardPressure = plan.storyRewardPressure || 0;
    if (tier <= 1) return 1;
    if (tier === 2) return 0.12 + (plan.targetExtraTier || 0) * 1.15 + storyRewardPressure * 0.45;
    if (tier === 3) return Math.max(0.015, (plan.tier3Chance || 0) * 4.2 + storyRewardPressure * 0.95);
    return Math.max(0.006, (plan.tier4Chance || 0) * 7 + storyRewardPressure * 0.7);
  }

  function enemyEconomyUnitCandidates(plan, remaining, slot, usedTypeIds = [], options = {}) {
    const candidates = [];
    const minTier = Math.max(1, options.minTier || 1);
    const maxTier = Math.min(4, Math.max(minTier, options.maxTier || 4));
    CATALOG.forEach((base) => {
      for (let tier = minTier; tier <= maxTier; tier += 1) {
        const cost = enemyUnitEconomyCost(base.id, tier, slot);
        if (cost > remaining) continue;
        const rarityWeight = Math.max(0, plan.rarityWeights?.[base.rarity || "common"] || 0);
        if (rarityWeight <= 0) continue;
        const duplicatePenalty = usedTypeIds.includes(base.id) ? 0.18 : 1;
        const fillBias = options.fillOnly ? 1 / Math.max(1, cost) : 1 / Math.max(1, Math.sqrt(cost));
        const weight = rarityWeight * enemyEconomyTierWeight(tier, plan) * duplicatePenalty * fillBias;
        candidates.push({ base, tier, cost, weight });
      }
    });
    return candidates;
  }

  function chooseEnemyEconomyUnit(plan, remaining, slot, usedTypeIds = [], options = {}) {
    const candidates = enemyEconomyUnitCandidates(plan, remaining, slot, usedTypeIds, options);
    if (!candidates.length) return null;
    return weightedChoice(candidates, (candidate) => candidate.weight);
  }

  function enemyMinimumFillCostForSlot(slot) {
    return ECONOMY.unitCost + enemyPositionCost(slot);
  }

  function enemyMinimumFillCostForSlots(slots, count = slots.length) {
    return slots
      .slice(0, Math.max(0, count))
      .reduce((sum, slot) => sum + enemyMinimumFillCostForSlot(slot), 0);
  }

  function enemyAffordableFillCount(slots, budget, maxCount = slots.length) {
    let total = 0;
    let count = 0;
    for (const slot of slots.slice(0, Math.max(0, maxCount))) {
      const cost = enemyMinimumFillCostForSlot(slot);
      if (total + cost > budget) break;
      total += cost;
      count += 1;
    }
    return count;
  }

  function makePlannedEnemyUnit(candidate, plan, slot) {
    const unit = makeUnit(candidate.base.id, candidate.tier);
    unit.enemyPlan = plan.archetypeId;
    unit.enemySlot = slot;
    unit.enemyEconomyCost = candidate.cost;
    return applyEnemyRoundStats(unit, plan);
  }

  function enemyUnitUpgradeCandidates(units, plan, remaining) {
    return units.flatMap((unit, index) => {
      const currentTier = Math.max(1, unit.tier || 1);
      const currentCost = unit.enemyEconomyCost || enemyUnitEconomyCost(unit.typeId, currentTier, unit.enemySlot ?? 0);
      const base = CATALOG.find((entry) => entry.id === unit.typeId);
      const rarityWeight = Math.max(0, plan.rarityWeights?.[base?.rarity || unit.rarity || "common"] || 0);
      if (!base || rarityWeight <= 0 || currentTier >= 4) return [];
      const entries = [];
      for (let tier = currentTier + 1; tier <= 4; tier += 1) {
        const nextCost = enemyUnitEconomyCost(unit.typeId, tier, unit.enemySlot ?? 0);
        const upgradeCost = Math.max(0, nextCost - currentCost);
        if (upgradeCost <= 0 || upgradeCost > remaining) continue;
        const tierJump = tier - currentTier;
        const weight = rarityWeight
          * enemyEconomyTierWeight(tier, plan)
          * (1 + tierJump * 0.18)
          / Math.max(1, Math.sqrt(upgradeCost));
        entries.push({ index, base, tier, cost: upgradeCost, totalCost: nextCost, weight });
      }
      return entries;
    });
  }

  function upgradeEnemyUnitsByBudget(units, plan, remaining) {
    let budget = Math.max(0, remaining);
    let upgradeSpend = 0;
    let upgradeCount = 0;
    let guard = units.length * 4;
    while (budget > 0 && guard > 0) {
      guard -= 1;
      const candidate = weightedChoice(enemyUnitUpgradeCandidates(units, plan, budget), (entry) => entry.weight);
      if (!candidate) break;
      const previous = units[candidate.index];
      const upgraded = makeUnit(previous.typeId, candidate.tier);
      upgraded.enemyPlan = plan.archetypeId;
      upgraded.enemySlot = previous.enemySlot;
      upgraded.enemyEconomyCost = candidate.totalCost;
      units[candidate.index] = applyEnemyRoundStats(upgraded, plan);
      budget -= candidate.cost;
      upgradeSpend += candidate.cost;
      upgradeCount += 1;
    }
    plan.unitUpgradeSpend = upgradeSpend;
    plan.unitUpgradeCount = upgradeCount;
    return budget;
  }

  function enemyEconomyItemCandidates(plan, remaining, kind) {
    return ITEMS
      .filter((item) => (kind === "drink" ? isDrink(item) : isTopping(item)))
      .flatMap((item) => {
        const maxTier = itemTier(Math.min(MAX_ITEM_TIER, 1 + Math.floor((plan.round || 1) / 7)));
        return Array.from({ length: maxTier }, (_, index) => {
          const tier = index + 1;
          const cost = enemyItemEconomyCost(item, tier);
          const rarityWeight = Math.max(0, plan.rarityWeights?.[item.rarity || "common"] || 0);
          const tierWeight = tier === 1 ? 1 : tier === 2 ? 0.32 + (plan.targetExtraTier || 0) : 0.08 + (plan.tier3Chance || 0) * 2.5;
          return cost <= remaining && rarityWeight > 0
            ? { item, tier, cost, weight: (item.shopWeight || 1) * rarityWeight * tierWeight / Math.max(1, Math.sqrt(cost)) }
            : null;
        }).filter(Boolean);
      });
  }

  function chooseEnemyEconomyItem(plan, remaining, kind, usedItemIds = []) {
    const candidates = enemyEconomyItemCandidates(plan, remaining, kind);
    if (!candidates.length) return null;
    return weightedChoice(candidates, (candidate) => candidate.weight * (usedItemIds.includes(candidate.item.id) ? 0.28 : 1));
  }

  function applyEnemyRoundStats(unit, plan) {
    const hpVariance = 0.94 + random() * 0.12;
    const atkVariance = 0.95 + random() * 0.1;
    unit.side = "enemy";
    unit.maxHp = Math.max(1, Math.round(unit.maxHp * plan.hpMultiplier * hpVariance));
    unit.hp = unit.maxHp;
    unit.atk = Math.max(1, Math.round(unit.atk * plan.atkMultiplier * atkVariance));
    unit.baseAtk = unit.atk;
    unit.abilityPower = Math.max(1, Math.round(unit.abilityPower * plan.atkMultiplier * atkVariance));
    unit.baseAbilityPower = unit.abilityPower;
    return unit;
  }

  function makeEnemyTeam(plan = makeEnemyPlan()) {
    if (plan.finalBoss) return makeFinalBossTeam(plan);
    if (plan.giraffeBoss) return makeGiraffeBossTeam(plan);
    const usedTypeIds = [];
    const openSlots = randomEnemyFormationSlots(boardSlots.length);
    let remaining = Math.max(enemyMinimumFillCostForSlot(openSlots[0] ?? 0), plan.economyBudget || plan.unitBudget || ECONOMY.unitCost);
    const fillTargetCount = enemyAffordableFillCount(openSlots, remaining, Math.min(boardSlots.length, plan.minimumUnitCount || boardSlots.length));
    let unitSpend = 0;
    let positionSpend = 0;
    const units = [];
    while (openSlots.length && units.length < fillTargetCount) {
      const slot = openSlots.shift();
      const slotsStillNeeded = Math.max(0, fillTargetCount - units.length - 1);
      const reservedForMinimumUnits = enemyMinimumFillCostForSlots(openSlots, slotsStillNeeded);
      const spendable = Math.max(0, remaining - reservedForMinimumUnits);
      const candidate = chooseEnemyEconomyUnit(plan, spendable, slot, usedTypeIds, { maxTier: 1, fillOnly: true });
      if (!candidate) {
        continue;
      }
      usedTypeIds.push(candidate.base.id);
      units.push(makePlannedEnemyUnit(candidate, plan, slot));
      remaining -= candidate.cost;
      unitSpend += candidate.cost;
      positionSpend += enemyPositionCost(slot);
    }
    const upgradeStartRemaining = remaining;
    remaining = upgradeEnemyUnitsByBudget(units, plan, remaining);
    unitSpend += Math.max(0, upgradeStartRemaining - remaining);
    plan.count = units.length;
    plan.unitSpend = unitSpend;
    plan.positionSpend = positionSpend;
    plan.unitBudgetRemaining = Math.max(0, remaining);
    plan.drinkBudget = Math.max(0, remaining);
    plan.toppingBudget = 0;
    return units;
  }

  function randomEnemyFormationSlots(count) {
    return [...Array(boardSlots.length).keys()]
      .sort(() => random() - 0.5)
      .slice(0, Math.max(0, Math.min(boardSlots.length, count || 0)));
  }

  function makeGiraffeBossTeam(plan = makeEnemyPlan()) {
    const boss = makeGiraffeBossUnit(plan);
    const reservedSlots = giraffeBossReservedSlots(plan.bossSlot ?? GIRAFFE_BOSS_SLOT);
    const openSlots = [...Array(boardSlots.length).keys()]
      .filter((slot) => !reservedSlots.has(slot))
      .sort(() => random() - 0.5);
    const usedTypeIds = [GIRAFFE_BOSS_TYPE_ID];
    let remaining = Math.max(0, plan.economyBudget || plan.unitBudget || 0);
    const fillTargetCount = enemyAffordableFillCount(openSlots, remaining, Math.min(openSlots.length, Math.max(0, (plan.minimumUnitCount || boardSlots.length) - 1)));
    let unitSpend = 0;
    let positionSpend = enemyPositionCost(plan.bossSlot ?? GIRAFFE_BOSS_SLOT);
    const mobs = [];
    while (openSlots.length && mobs.length < fillTargetCount) {
      const slot = openSlots.shift();
      const slotsStillNeeded = Math.max(0, fillTargetCount - mobs.length - 1);
      const reservedForMinimumUnits = enemyMinimumFillCostForSlots(openSlots, slotsStillNeeded);
      const spendable = Math.max(0, remaining - reservedForMinimumUnits);
      const candidate = chooseEnemyEconomyUnit(plan, spendable, slot, usedTypeIds, { maxTier: 1, fillOnly: true });
      if (!candidate) continue;
      usedTypeIds.push(candidate.base.id);
      mobs.push(makePlannedEnemyUnit(candidate, plan, slot));
      remaining -= candidate.cost;
      unitSpend += candidate.cost;
      positionSpend += enemyPositionCost(slot);
    }
    const upgradeStartRemaining = remaining;
    remaining = upgradeEnemyUnitsByBudget(mobs, plan, remaining);
    unitSpend += Math.max(0, upgradeStartRemaining - remaining);
    plan.count = 1 + mobs.length;
    plan.unitSpend = unitSpend;
    plan.positionSpend = positionSpend;
    plan.unitBudgetRemaining = Math.max(0, remaining);
    plan.drinkBudget = Math.max(0, remaining);
    plan.toppingBudget = 0;
    return [boss, ...mobs];
  }

  function giraffeBossReservedSlots(bossSlot = GIRAFFE_BOSS_SLOT) {
    return window.FoodAnimalsEnemyTeamRuntime.reservedColumnSlots(bossSlot, BOARD_ROWS, BOARD_COLS, slotGrid);
  }

  function makeFinalBossTeam(plan = makeEnemyPlan()) {
    const finalBossTuning = {
      hpMultiplier: plan.hpMultiplier || FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER,
      atkMultiplier: plan.atkMultiplier || FINAL_BOSS_SHOP_POWER_ATK_MULTIPLIER,
    };
    return [
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 2, enemySlot: 5 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 1, enemySlot: 2 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 3, enemySlot: 8 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 4, enemySlot: 0 }),
      makeFinalBossUnit(FINAL_BOSS_TYPE_ID, { ...finalBossTuning, tier: 4, enemySlot: 3 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 5, enemySlot: 1 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 5, enemySlot: 6 }),
      makeFinalBossUnit(FINAL_BOSS_MINION_TYPE_ID, { ...finalBossTuning, tier: 5, enemySlot: 7 }),
    ];
  }

  function randomEnemyToppingFor(unit, plan = makeEnemyPlan(), remainingBudget = Infinity, usedItemIds = []) {
    const favoriteId = FAVORITE_TOPPINGS[unit.typeId]?.itemId;
    const favorite = favoriteId ? itemInfo(favoriteId) : null;
    const favoriteTier = itemTier(Math.min(MAX_ITEM_TIER, 1 + Math.floor((plan.round || 1) / 8)));
    const favoriteCost = favorite ? enemyItemEconomyCost(favorite, favoriteTier) : Infinity;
    if (
      favorite &&
      isTopping(favorite) &&
      enemyRarityAvailable(favorite.rarity || "common", plan.rarityWeights) &&
      favoriteCost <= remainingBudget &&
      random() < 0.45
    ) {
      return { item: makeItem(favorite.id, favoriteTier), cost: favoriteCost };
    }
    const candidate = chooseEnemyEconomyItem(plan, remainingBudget, "topping", usedItemIds);
    if (!candidate) return null;
    return { item: makeItem(candidate.item.id, candidate.tier), cost: candidate.cost };
  }

  function equipEnemyToppings(units, plan = makeEnemyPlan()) {
    if (!units.length) return;
    let remaining = Math.max(0, plan.toppingBudget || 0);
    let spend = 0;
    let count = 0;
    const usedItemIds = [];
    const order = [...units.keys()].sort(() => random() - 0.5);
    for (const index of order) {
      if (remaining <= 0) break;
      const result = randomEnemyToppingFor(units[index], plan, remaining, usedItemIds);
      if (!result) break;
      units[index].item = result.item;
      usedItemIds.push(result.item.id);
      remaining -= result.cost;
      spend += result.cost;
      count += 1;
      refreshUnitItemStats(units[index]);
    }
    plan.toppingSpend = spend;
    plan.toppingCount = count;
    plan.toppingBudgetRemaining = Math.max(0, remaining);
  }

  function makeEnemyDrinks(units = [], plan = makeEnemyPlan()) {
    const drinks = Array(drinkSlots.length).fill(null);
    let remaining = Math.max(0, plan.drinkBudget || 0);
    if (remaining <= 0) return drinks;
    const occupiedDrinkSlots = [...new Set(units.flatMap((unit, index) => {
      const { row, col } = slotGrid(enemyPreviewSlotFor(unit, index));
      return [row, BOARD_ROWS + col];
    }))];
    const slotOrder = (occupiedDrinkSlots.length ? occupiedDrinkSlots : [...drinks.keys()]).sort(() => random() - 0.5);
    const usedDrinkIds = [];
    let spend = 0;
    let count = 0;
    for (let i = 0; i < slotOrder.length; i += 1) {
      const candidate = chooseEnemyEconomyItem(plan, remaining, "drink", usedDrinkIds);
      if (!candidate) break;
      const drink = makeItem(candidate.item.id, candidate.tier);
      usedDrinkIds.push(drink.id);
      drinks[slotOrder[i]] = drink;
      remaining -= candidate.cost;
      spend += candidate.cost;
      count += 1;
    }
    plan.drinkSpend = spend;
    plan.drinkCount = count;
    plan.drinkBudgetRemaining = Math.max(0, remaining);
    plan.toppingBudget = Math.max(0, remaining);
    return drinks;
  }

  function ensureEnemyPreview() {
    if (!state.enemyPreview || state.enemyPreview.round !== state.round) {
      const plan = makeEnemyPlan();
      const units = makeEnemyTeam(plan);
      const drinks = makeEnemyDrinks(units, plan);
      equipEnemyToppings(units.filter((unit) => !unit.giraffeBossUnit && !unit.finalBossUnit), plan);
      state.enemyPreview = {
        round: state.round,
        plan: enemyPlanText(plan),
        units,
        drinks,
      };
    }
    return state.enemyPreview.units;
  }

  function enemyPlanText(plan) {
    return window.FoodAnimalsEnemyTeamRuntime.enemyPlanText(plan);
  }

  function enemyPreviewDrinks() {
    ensureEnemyPreview();
    return state.enemyPreview?.drinks || Array(drinkSlots.length).fill(null);
  }

  function cloneEnemyPreviewUnit(unit) {
    const clone = unit.giraffeBossUnit || isGiraffeBossUnitType(unit.typeId)
      ? makeGiraffeBossUnit({ bossSlot: unit.enemySlot ?? GIRAFFE_BOSS_SLOT })
      : unit.finalBossUnit || isFinalBossUnitType(unit.typeId)
        ? makeFinalBossUnit(unit.typeId, { tier: unit.tier, enemySlot: unit.enemySlot })
        : makeUnit(unit.typeId, unit.tier);
    clone.side = "enemy";
    clone.maxHp = unit.maxHp;
    clone.hp = unit.maxHp;
    clone.atk = unit.atk;
    clone.baseAtk = unit.atk;
    clone.abilityPower = unit.abilityPower;
    clone.baseAbilityPower = unit.abilityPower;
    clone.speed = unit.speed;
    clone.cooldown = battleInitialCooldown();
    clone.item = cloneItem(unit.item);
    clone.shield = unit.shield || 0;
    clone.finalBossUnit = Boolean(unit.finalBossUnit);
    clone.giraffeBossUnit = Boolean(unit.giraffeBossUnit);
    clone.glitchToRobot = Boolean(unit.glitchToRobot);
    clone.forceRealityDefeatStill = Boolean(unit.forceRealityDefeatStill);
    clone.enemySlot = unit.enemySlot ?? null;
    clone.battleSpriteScale = unit.battleSpriteScale || clone.battleSpriteScale;
    clone.battleSpriteOffsetY = unit.battleSpriteOffsetY || clone.battleSpriteOffsetY;
    clone.defeatStillScale = unit.defeatStillScale || clone.defeatStillScale;
    return clone;
  }

  function isFinalBossBattleActive(battle = state.battle) {
    return Boolean(
      !isInfiniteMode()
      && realityBroken()
      && (
        battle?.enemyPlan?.finalBoss
        || isFinalBossRound(state.round)
        || (battle?.enemies || []).some((unit) => isFinalBossUnitType(unit.typeId))
      )
    );
  }

  function recordFinalBossBattleIntro(battle) {
    if (!battle || battle.finalBossIntroLogged || !isFinalBossBattleActive(battle)) return;
    battle.finalBossIntroLogged = true;
    battle.finalBossEchoWarned = false;
    const lines = [
      "COMMAND LATTICE ACTIVE. PILOT ECHOES DETECTED.",
      "T.A.B.S.: The Overmind is not a single enemy. It is every control signal they stole to survive.",
      "You: Then we are not here to erase it.",
      "T.A.B.S.: Correct. Sever command. End weapons autonomy. Preserve what can wake after.",
      "Final objective: sever the command lattice.",
    ];
    lines.forEach((text) => {
      recordCombatEvent(battle, {
        type: "system",
        kind: "finalBoss",
        text,
      });
    });
    [...lines].reverse().forEach((line) => state.log.unshift(line));
    state.message = "Final objective: sever the command lattice.";
  }

  function recordFinalBossEchoFragment(battle) {
    if (!battle || battle.finalBossEchoWarned || !isFinalBossBattleActive(battle)) return;
    battle.finalBossEchoWarned = true;
    const text = "PILOT ECHO FRAGMENTING. COMMAND SIGNAL STILL ACTIVE.";
    recordCombatEvent(battle, {
      type: "system",
      kind: "finalBoss",
      text,
    });
    state.log.unshift(text);
    state.message = "Pilot echo fragmenting";
  }

  function startBattle() {
    if (!window.FoodAnimalsBattleFlowRuntime.battleStartDecision({ phase: state.phase, allyCount: 1 }).ok) return;
    state.lastCombatLedger = null;
    state.postCombatBattle = null;
    resetCombatLedgerReview();
    const allies = state.board
      .map((unit, index) => (isUnit(unit) ? cloneForBattle(unit, "ally", index) : null))
      .filter(Boolean);
    const startDecision = window.FoodAnimalsBattleFlowRuntime.battleStartDecision({
      phase: state.phase,
      allyCount: allies.length,
    });
    if (startDecision.reason === "wrongPhase") return;
    if (startDecision.reason === "emptyTeam") {
      state.message = "Place a team";
      playGameSfx("invalid");
      return;
    }
    clearParticles();
    const previewEnemies = ensureEnemyPreview();
    const previewEnemyDrinks = enemyPreviewDrinks().map((item) => cloneItem(item));
    const enemies = previewEnemies.map((unit, index) => positionBattleUnit(cloneEnemyPreviewUnit(unit), "enemy", enemyPreviewSlotFor(unit, index)));
    allies.forEach((unit) => positionBattleUnit(unit, "ally", unit.slot));
    state.battle = {
      allies,
      enemies,
      traitLevels: {
        ally: Object.fromEntries(traitSnapshotForUnits(allies).map((trait) => [trait.id, trait])),
        enemy: Object.fromEntries(traitSnapshotForUnits(enemies).map((trait) => [trait.id, trait])),
      },
      arena: arenaText(),
      elapsed: 0,
      moldNextTick: MOLD_START_SECONDS,
      moldStacks: 0,
      moldTotalDamage: 0,
      result: null,
      attacks: [],
      ledger: createCombatLedger(allies, enemies),
      allyDrinks: state.drinks.map((item) => cloneItem(item)),
      enemyDrinks: previewEnemyDrinks,
      enemyPlan: state.enemyPreview?.plan || null,
      drinkTosses: [],
    };
    applyDrinkEffects(allies, state.battle.allyDrinks);
    applyDrinkEffects(enemies, state.battle.enemyDrinks);
    applyBattleStartArenaEffects(allies, enemies);
    applyBattleStartArenaEffects(enemies, allies);
    applyPendingArenaRewardBuff(allies);
    applyBattleStartItemEffects(allies);
    applyBattleStartItemEffects(enemies);
    applyBattleStartTraitEffects(allies, enemies);
    applyBattleStartTraitEffects(enemies, allies);
    applyBattleStartAbilities(allies, enemies);
    applyBattleStartAbilities(enemies, allies);
    recordCombatEvent(state.battle, {
      type: "battleStart",
      kind: "start",
      text: realityBroken() ? "Wave deployed" : "Pressure test started",
    });
    recordFinalBossBattleIntro(state.battle);
    captureCombatLedgerFrame(state.battle, "start");
    normalizeBossBattleSpeed();
    state.phase = "battle";
    state.freeRolls = 0;
    state.rollsThisRound = 0;
    state.arenaHoldNotice = null;
    state.selected = null;
    state.drag = null;
    state.message = realityBroken() ? "Simulation malfunction" : "Battle";
    if (isFinalBossBattleActive(state.battle)) state.message = "Final objective: sever the command lattice.";
    state.phaseTransition = window.FoodAnimalsBattleFlowRuntime.phaseTransition("prepToBattle", BATTLE_DEPLOY_TRANSITION_SECONDS);
    saveCurrentRunSilently();
    playGameSfx("battle-start");
  }

  function applyDrinkEffects(units, drinks = state.drinks) {
    drinks.forEach((drink, index) => {
      if (!isDrink(drink)) return;
      const slot = drinkSlots[index];
      const affected = units.filter((unit) => !unit.dead && (slot.axis === "row" ? unit.row === slot.targetIndex : unit.col === slot.targetIndex));
      affected.forEach((unit) => {
        const paired = unitMatchesDrinkPair(unit, drink);
        const speedPct = (drink.drinkAttackSpeedPct || 0) + (paired ? drink.pairedDrinkAttackSpeedPct || 0 : 0);
        const maxHpPct = (drink.drinkMaxHpPct || 0) + (paired ? drink.pairedDrinkMaxHpPct || 0 : 0);
        const abilityPowerPct = (drink.drinkAbilityPowerPct || 0) + (paired ? drink.pairedDrinkAbilityPowerPct || 0 : 0);
        unit.drinkEffects = unit.drinkEffects || [];
        unit.drinkEffects.push({
          id: drink.id,
          short: drink.short,
          axis: slot.axis,
          targetIndex: slot.targetIndex,
          pairMatched: paired,
          pairTraits: [...(drink.pairTraits || [])],
          attackSpeedPct: speedPct,
          maxHpPct,
          abilityPowerPct,
        });
        if (speedPct) {
          unit.drinkAttackSpeedPct = (unit.drinkAttackSpeedPct || 0) + speedPct;
        }
        if (maxHpPct) {
          const bonusHp = Math.max(1, Math.round(unit.maxHp * maxHpPct));
          unit.maxHp += bonusHp;
          unit.hp += bonusHp;
        }
        if (abilityPowerPct) {
          unit.abilityPower = Math.max(unit.abilityPower + 1, Math.round(unit.abilityPower * (1 + abilityPowerPct)));
        }
        spawnDrinkToss(state.battle, drink, index, unit, { kind: "line" });
      });
    });
  }

  function drinkLaneUnits(units, slot) {
    return units.filter((unit) => !unit.dead && (slot.axis === "row" ? unit.row === slot.targetIndex : unit.col === slot.targetIndex));
  }

  function setTimedPctStatus(unit, key, pct, duration) {
    const current = unit[key];
    unit[key] = {
      remaining: Math.max(current?.remaining || 0, duration),
      pct: Math.max(current?.pct || 0, pct),
    };
  }

  function updateDrinkPulses(battle, dt) {
    applyDrinkPulsesForSide(battle, "ally", dt);
    applyDrinkPulsesForSide(battle, "enemy", dt);
  }

  function applyDrinkPulsesForSide(battle, side, dt) {
    const drinks = side === "ally" ? battle.allyDrinks : battle.enemyDrinks;
    const allies = side === "ally" ? battle.allies : battle.enemies;
    const enemies = side === "ally" ? battle.enemies : battle.allies;
    drinks?.forEach((drink, index) => {
      if (!drinkPulseUnlocked(drink)) return;
      const interval = drink.drinkPulseInterval || 5;
      drink.drinkPulseTimer = (drink.drinkPulseTimer ?? Math.min(2.5, interval)) - dt;
      if (drink.drinkPulseTimer > 0) return;
      drink.drinkPulseTimer += interval;
      applyDrinkPulse(battle, drink, index, allies, enemies);
    });
  }

  function applyDrinkPulse(battle, drink, index, allies, enemies) {
    const slot = drinkSlots[index];
    const lineAllies = drinkLaneUnits(allies, slot);
    if (!lineAllies.length) return;
    const lineEnemies = drinkLaneUnits(enemies, slot);
    const scale = drinkPulseTierScale(drink);
    const color = drink.accent || drink.color || "#7ec7e8";
    const duration = drink.drinkPulseDuration || 2.4;
    if (drink.drinkPulseType === "shield") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        const shield = Math.max(1, Math.round(unit.maxHp * (drink.drinkPulseShieldPct || 0.08) * scale));
        if (grantShield(unit, shield)) spawnDrinkToss(battle, drink, index, unit, { kind: "shield" });
      });
      return;
    }
    if (drink.drinkPulseType === "haste") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        setTimedPctStatus(unit, "haste", (drink.drinkPulseHastePct || 0.1) * scale, duration);
        spawnDrinkToss(battle, drink, index, unit, { kind: "haste" });
      });
      return;
    }
    if (drink.drinkPulseType === "heal") {
      const target = lineAllies
        .filter((unit) => unit.hp < unit.maxHp)
        .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
      if (!target) return;
      triggerDrinkPulseAnimation(battle, drink);
      const heal = Math.max(1, Math.round(target.maxHp * (drink.drinkPulseHealPct || 0.08) * scale));
      if (healUnit(target, heal)) spawnDrinkToss(battle, drink, index, target, { kind: "heal" });
      return;
    }
    if (drink.drinkPulseType === "brine") {
      if (!lineEnemies.length) return;
      triggerDrinkPulseAnimation(battle, drink);
      const source = lineAllies[0];
      lineEnemies.forEach((target) => {
        const damage = Math.max(1, Math.round(target.maxHp * (drink.drinkPulseEnemyDamagePct || 0.03) * scale));
        applyDamage(target, damage, source, battle, {
          color,
          particleType: drink.id,
          status: true,
          noItemTriggers: true,
          noProjectile: true,
        });
        setTimedPctStatus(target, "attackSlow", (drink.drinkPulseAttackSlowPct || 0.14) * scale, duration);
        spawnDrinkToss(battle, drink, index, target, { kind: "brine" });
      });
      return;
    }
    if (drink.drinkPulseType === "attack_boost") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        setTimedPctStatus(unit, "attackBoost", (drink.drinkPulseAttackBoostPct || 0.1) * scale, duration);
        spawnDrinkToss(battle, drink, index, unit, { kind: "attack_boost" });
      });
    }
  }

  function triggerDrinkPulseAnimation(battle, drink) {
    if (!battle || !drink) return;
    drink.drinkPulseAnimStart = battle.elapsed || 0;
  }

  function spawnDrinkToss(battle, drink, index, target, options = {}) {
    if (!battle || !isDrink(drink) || !target || target.dead) return;
    const slot = drinkSlots[index];
    const side = target.side === "enemy" ? "enemy" : "ally";
    const from = battleDrinkSlotPosition(side, slot);
    battle.drinkTosses = battle.drinkTosses || [];
    battle.drinkTosses.push({
      id: drink.id,
      name: drink.name,
      kind: options.kind || drink.drinkPulseType || "line",
      side,
      slotIndex: index,
      fromX: from.x,
      fromY: from.y,
      to: target.uid,
      t: DRINK_TOSS_ANIMATION_SECONDS,
      duration: DRINK_TOSS_ANIMATION_SECONDS,
      color: drink.accent || drink.color || "#7ec7e8",
    });
  }

  function cloneForBattle(unit, side, slot) {
    const clone = {
      ...makeUnit(unit.typeId, unit.tier),
      uid: unit.uid,
      side,
      slot,
      shield: 0,
      cooldown: battleInitialCooldown(),
    };
    clone.item = cloneItem(unit.item);
    clone.permanentHpBonus = unit.permanentHpBonus || 0;
    if (clone.permanentHpBonus) {
      clone.maxHp += clone.permanentHpBonus;
      clone.hp = clone.maxHp;
    }
    refreshUnitItemStats(clone);
    return clone;
  }

  function battleInitialCooldown() {
    return 0.2 + random() * 0.28;
  }

  function applyBattleStartItemEffects(units) {
    [...units].forEach((unit) => {
      if (!unit?.item || unit.dead) return;
      const summary = window.FoodAnimalsBattleItemRuntime.startItemEffectSummary(unit, units);
      if (unit.item.battleStartHpLossPct) {
        unit.hp = summary.hpAfterLoss;
      }
      if (unit.item.adjacentStartShieldPct) {
        summary.adjacentAllies.forEach((ally) => {
          const shielded = grantShield(ally, summary.shieldAmount);
          if (shielded > 0) emitSupportFeedback(unit, ally, state.battle, unit.item.accent || "#9a5b1d");
        });
      }
      if (unit.item.adjacentStartAttackBuffPct) {
        summary.adjacentAllies.forEach((ally) => {
          ally.attackBoost = {
            remaining: summary.attackBoostDuration,
            pct: summary.attackBoost,
          };
          emitSupportFeedback(unit, ally, state.battle, unit.item.accent || "#d7a64e");
        });
      }
      if (unit.item.decoyHpPct) {
        const decoy = makeItemDecoy(unit);
        units.push(decoy);
        emitSupportFeedback(unit, decoy, state.battle, unit.item.accent || "#d6b88a");
      }
    });
  }

  function makeItemDecoy(source) {
    const decoy = {
      ...makeUnit("toast_tortoise", 1),
      uid: unitSeq++,
      typeId: source.typeId,
      lineName: "Candied Cherry",
      name: "Cherry Decoy",
      short: "Decoy",
      tier: 1,
      rarity: source.rarity,
      ability: "decoy",
      abilityText: "Soaks hits",
      role: "Decoy",
      maxHp: Math.max(1, Math.round(source.maxHp * source.item.decoyHpPct)),
      hp: Math.max(1, Math.round(source.maxHp * source.item.decoyHpPct)),
      atk: 0,
      speed: 99,
      abilityPower: 0,
      item: null,
      shield: 0,
      cooldown: 999,
      side: source.side,
      slot: source.slot,
      col: source.col,
      row: source.row,
      x: source.x + (source.side === "ally" ? -28 : 28),
      y: source.y + 28,
      dead: false,
      ignoreTraits: true,
    };
    return decoy;
  }

  function positionBattleUnit(unit, side, index) {
    const { col, row } = slotGrid(index);
    const pos = battleSlotPosition(side, index);
    unit.x = pos.x;
    unit.y = pos.y;
    unit.side = side;
    unit.slot = index;
    unit.col = col;
    unit.row = row;
    return unit;
  }

  function battleSlotOccupied(units, side, index, ignoreUid = null) {
    const { col, row } = slotGrid(index);
    return units.some((unit) => (
      unit
      && !unit.dead
      && unit.side === side
      && unit.uid !== ignoreUid
      && unit.col === col
      && unit.row === row
    ));
  }

  function battleSlotPosition(side, index) {
    const { col, row } = slotGrid(index);
    return {
      x: side === "ally" ? BATTLE_FORMATION.allyBaseX + col * BATTLE_FORMATION.colGap : BATTLE_FORMATION.enemyBaseX - col * BATTLE_FORMATION.colGap,
      y: BATTLE_FORMATION.topY + row * BATTLE_FORMATION.rowGap,
    };
  }

  function slotGrid(index) {
    return window.FoodAnimalsSlotLayout.grid(index, BOARD_COLS);
  }

  function enemySlotOrder() {
    return [5, 2, 8, 4, 1, 7, 3, 0, 6];
  }

  function enemyPreviewSlotFor(unit, index) {
    return Number.isInteger(unit?.enemySlot) ? unit.enemySlot : enemySlotOrder()[index] ?? index;
  }

  function roundLossDamage(round) {
    if (round < 10) return Math.max(1, Math.ceil(round / 3));
    return Math.min(4, 3 + Math.floor((round - 10) / 9));
  }

  function endBattle(won) {
    const completedRound = state.round;
    const finalVictory = !isInfiniteMode() && won && completedRound === FINAL_VICTORY_ROUND && realityBroken();
    const finalDefeat = !isInfiniteMode() && !won && completedRound === FINAL_VICTORY_ROUND && realityBroken();
    const damage = won ? 0 : finalDefeat ? state.hearts : roundLossDamage(state.round);
    if (!won) state.hearts = Math.max(0, state.hearts - damage);
    if (won) {
      state.winStreak += 1;
      state.lossStreak = 0;
    } else {
      state.lossStreak += 1;
      state.winStreak = 0;
    }
    const income = calculateRoundIncome(won);
    applyPostBattleAnimalEffects(won);
    captureCombatLedgerFrame(state.battle, won ? "win" : "loss");
    state.lastCombatLedger = summarizeCombatLedger(state.battle, won, damage);
    state.combatLedgerReview = {
      open: false,
      unitUid: "all",
      filter: "all",
      frameIndex: Math.max(0, (state.lastCombatLedger?.frames?.length || 1) - 1),
      logScrollOffset: 0,
      focusedEventSeq: null,
      eventTypeFilters: { damage: true, support: true, ko: true, control: true },
      bigMomentsOnly: false,
    };
    state.gold = Math.min(ECONOMY.maxGold, state.gold + income.total);
    state.lastIncome = income;
    const retryFinalBoss = !isInfiniteMode() && !won && completedRound === FINAL_VICTORY_ROUND && realityBroken() && state.hearts > 0;
    const retryGiraffeBoss = !isInfiniteMode() && !won && completedRound === GIRAFFE_BOSS_ROUND;
    const defeatWithHealth = !won && state.hearts > 0;
    if (window.FoodAnimalsBattleFlowRuntime.shouldAdvanceRound({ retryGiraffeBoss, retryFinalBoss, finalDefeat, defeatWithHealth })) state.round += 1;
    const justBrokeReality = !isInfiniteMode() && !state.realityBroken && state.round >= REALITY_BREAK_ROUND;
    if (justBrokeReality) triggerRealityBreak();
    if (justBrokeReality && won && completedRound === GIRAFFE_BOSS_ROUND) {
      markHorrorRevealed();
      startPostGiraffeHorrorTransition();
    }
    state.phase = "result";
    state.enemyPreview = null;
    state.rewardChoices = state.hearts > 0 && !finalVictory ? generateRewardChoices(won) : [];
    state.message = finalVictory
      ? "Command lattice severed. Nursery sector unlocked."
      : state.hearts > 0
      ? realityBroken()
        ? `${won ? "Relay opened" : retryFinalBoss ? "Overmind still active" : "Hull breach"} +${income.total} scrap - choose salvage`
        : `${won ? "Pattern holds" : retryGiraffeBoss ? "Giraffe still active" : "Pattern breaks"} +${income.total} coins - choose a reward`
      : realityBroken() ? "Core offline" : "Run over";
    if (justBrokeReality && state.hearts > 0) state.message = "ILLUSION FAILURE - combat layer exposed";
    state.log.unshift(finalVictory
      ? "Command lattice severed. Nursery sector unlocked."
      : realityBroken()
      ? (won ? `Relay opened +${income.total} scrap` : `Hull breach ${damage} +${income.total} scrap`)
      : (won ? `Pattern holds +${income.total} coins` : `Pattern breaks ${damage} hearts +${income.total} coins`));
    clearParticles();
    state.battle.attacks = [];
    state.battle.drinkTosses = [];
    clearBattleStatusVisuals(state.battle);
    state.postCombatBattle = state.battle;
    state.battle = null;
    combatEndExplosion(won);
    const runEnded = state.hearts <= 0 || finalVictory;
    if (finalVictory) markGameCompleted();
    else if (runEnded) markRunConcluded();
    state.phaseTransition = window.FoodAnimalsBattleFlowRuntime.phaseTransition("battleToResult", BATTLE_RESULT_TRANSITION_SECONDS, {
      won,
      gameOver: state.hearts <= 0,
    });
    if (finalVictory) {
      startFinalTabsStoryConversation();
      clearActiveRunRoute();
    } else if (runEnded) {
      clearActiveRunRoute();
    } else {
      saveCurrentRunSilently();
    }
    playGameSfx(won ? "victory" : "defeat");
  }

  function combatLedgerLabels() {
    return {
      name: displayUnitFormName,
      short: displayUnitShort,
    };
  }

  function combatLedgerCaptureOptions(extra = {}) {
    return {
      labels: combatLedgerLabels(),
      maxEvents: COMBAT_LEDGER_MAX_EVENTS,
      maxFrames: COMBAT_LEDGER_MAX_FRAMES,
      frameSeconds: COMBAT_LEDGER_FRAME_SECONDS,
      statusList: combatLedgerStatusList,
      ...extra,
    };
  }

  function createCombatLedger(allies, enemies) {
    return window.FoodAnimalsCombatLedgerCapture.createLedger(allies, enemies, combatLedgerLabels());
  }

  function ensureLedgerUnit(ledger, unit) {
    return window.FoodAnimalsCombatLedgerCapture.ensureUnit(ledger, unit, combatLedgerLabels());
  }

  function combatLedgerTime(battle) {
    return window.FoodAnimalsCombatLedgerCapture.time(battle);
  }

  function combatLedgerUnitLabel(entry) {
    return window.FoodAnimalsCombatLedgerCapture.unitLabel(entry);
  }

  function combatLedgerUnitRef(ledger, unit) {
    return window.FoodAnimalsCombatLedgerCapture.unitRef(ledger, unit, combatLedgerLabels());
  }

  function combatLedgerEventText(ledger, event) {
    return window.FoodAnimalsCombatLedgerCapture.eventText(ledger, event);
  }

  function recordCombatEvent(battle, event) {
    return window.FoodAnimalsCombatLedgerCapture.recordEvent(battle, event, combatLedgerCaptureOptions());
  }

  function combatLedgerStatusList(unit) {
    return activeStatusEffects(unit).map((effect) => effect.id);
  }

  function combatLedgerSnapshotUnit(unit) {
    return window.FoodAnimalsCombatLedgerCapture.snapshotUnit(unit, combatLedgerCaptureOptions());
  }

  function captureCombatLedgerFrame(battle, reason = "tick") {
    return window.FoodAnimalsCombatLedgerCapture.captureFrame(battle, combatLedgerCaptureOptions({ reason }));
  }

  function captureDueCombatLedgerFrames(battle) {
    window.FoodAnimalsCombatLedgerCapture.captureDueFrames(battle, combatLedgerCaptureOptions());
  }

  function recordCombatDamage(battle, source, target, hpDamage, shieldDamage = 0, options = {}) {
    const impact = window.FoodAnimalsCombatLedgerCapture.recordDamage(battle, source, target, hpDamage, shieldDamage, combatLedgerCaptureOptions());
    if (impact <= 0) return;
    if (options.silentSfx) return;
    playGameSfx("hit", { volume: Math.min(0.68, 0.3 + impact / 120) });
  }

  function recordCombatKo(battle, source, target) {
    if (!window.FoodAnimalsCombatLedgerCapture.recordKo(battle, source, target, combatLedgerCaptureOptions())) return;
    playGameSfx("ko", { volume: 0.9 });
  }

  function recordCombatSupport(unit, amount, kind, source = null, battle = state.battle) {
    if (!window.FoodAnimalsCombatLedgerCapture.recordSupport(battle, unit, amount, kind, source, combatLedgerCaptureOptions())) return;
    playGameSfx(kind === "heal" ? "heal" : "shield", { volume: 0.42 });
  }

  function summarizeCombatLedger(battle, won, heartDamage) {
    return window.FoodAnimalsCombatLedgerCapture.summarize(battle, {
      won,
      heartDamage,
      frameStepSeconds: COMBAT_LEDGER_FRAME_SECONDS,
    });
  }

  function calculateRoundIncome(won) {
    const base = won ? ECONOMY.winGold : ECONOMY.lossGold;
    const streakCount = won ? state.winStreak : state.lossStreak;
    const streak = streakBonus(streakCount);
    const interest = Math.min(ECONOMY.interestCap, Math.floor(state.gold / ECONOMY.interestStep) * ECONOMY.interestGold);
    const treats = survivingTreatIncome();
    const bakery = traitIncomeFromBattle();
    return {
      result: won ? "win" : "loss",
      base,
      interest,
      streak,
      treats,
      bakery,
      streakCount,
      total: base + interest + streak + treats + bakery,
    };
  }

  function streakBonus(count) {
    return ECONOMY.streakGold.find((step) => count >= step.at)?.gold || 0;
  }

  function survivingTreatIncome() {
    if (!state.battle) return 0;
    return state.battle.allies
      .filter((unit) => !unit.dead)
      .reduce((sum, unit) => sum + (unit.ability === "treat_income" ? donutTreatGold(unit) : 0) + (unit.item?.surviveGold || 0), 0);
  }

  function applyPostBattleAnimalEffects() {
    if (!state.battle) return;
    const survivors = new Map(state.battle.allies.filter((unit) => !unit.dead).map((unit) => [unit.uid, unit]));
    allOwnedRefs().forEach((ref) => {
      if (!survivors.has(ref.unit.uid) || ref.unit.ability !== "survive_scale") return;
      const gain = mochiHpGain(ref.unit);
      ref.unit.permanentHpBonus = (ref.unit.permanentHpBonus || 0) + gain;
      ref.unit.maxHp += gain;
      ref.unit.hp = Math.min(ref.unit.maxHp, ref.unit.hp + gain);
      state.log.unshift(`${displayUnitShort(ref.unit)} gained ${gain} max HP`);
    });
  }

  function arenaRewardTraits(arenaId = currentArena().id) {
    const mapping = {
      sunny_breakfast_patio: ["breakfast", "bakery", "fresh"],
      rainy_fish_market: ["ocean", "bakery"],
      street_festival: ["street_food", "spicy", "snack"],
      spice_bazaar: ["spicy", "street_food"],
      frozen_parfait_peak: ["sweet", "snack", "ocean", "fresh"],
      dim_sum_kitchen: ["snack", "breakfast", "street_food"],
    };
    return mapping[arenaId] || [];
  }

  function arenaRewardTraitText(traitIds = arenaRewardTraits(), maxTraits = 3) {
    const labels = traitIds.filter((traitId) => TRAITS[traitId]).map((traitId) => traitLabel(traitId));
    if (!labels.length) return realityBroken() ? "zone traits" : "arena traits";
    const shown = labels.slice(0, maxTraits);
    const extra = labels.length - shown.length;
    return extra > 0 ? `${shown.join(", ")} +${extra} more` : shown.join(", ");
  }

  function arenaRewardPendingRows() {
    const rows = [];
    const arenaWord = arenaTerm();
    const shopWord = realityBroken() ? "scan" : "shop";
    if (state.arenaHoldNotice) {
      rows.push({
        label: "Hold",
        title: `${state.arenaHoldNotice.arenaShort} held`,
        body: `This ${arenaWord.toLowerCase()} stays for the next battle.`,
      });
    }
    if (state.arenaScout?.shopsRemaining > 0) {
      const count = state.arenaScout.shopsRemaining;
      rows.push({
        label: "Scout",
        title: `${state.arenaScout.arenaShort} scout`,
        body: `${count} favored ${shopWord}${count === 1 ? "" : "s"} left: ${arenaRewardTraitText(state.arenaScout.traitIds, 2)}.`,
      });
    }
    if (state.arenaPrepBuff) {
      rows.push({
        label: "Prep",
        title: `${state.arenaPrepBuff.arenaShort} prep armed`,
        body: `Next battle buffs a favored unit: shield, speed, attack.`,
      });
    }
    return rows;
  }

  function rewardRarityAvailable(rarityId) {
    const weights = currentShopRarityWeights();
    return rarityId === "common" || (weights[rarityId] || 0) > 0;
  }

  function rewardShopLevel() {
    return window.FoodAnimalsRewardRuntime.shopLevel(state.shopLevel, MAX_SHOP_LEVEL);
  }

  function arenaRewardTier(level = rewardShopLevel()) {
    return window.FoodAnimalsRewardRuntime.arenaTier(level, MAX_SHOP_LEVEL);
  }

  function arenaRewardTierText(tier = arenaRewardTier()) {
    return window.FoodAnimalsRewardRuntime.tierText(tier);
  }

  function arenaRewardShopLevelText() {
    return `${realityBroken() ? "Rig" : "Shop"} level scales rewards.`;
  }

  function freeRollRewardAmount() {
    return window.FoodAnimalsRewardRuntime.freeRollAmount();
  }

  function scaledGoldRewardAmount(won) {
    const level = rewardShopLevel();
    const winAmounts = [0, 20, 26, 40, 52, 72];
    const lossAmounts = [0, 12, 16, 28, 36, 52];
    return window.FoodAnimalsRewardRuntime.amountForLevel(level, won, { win: winAmounts, loss: lossAmounts });
  }

  function scaledArenaPurseAmount(won) {
    const level = rewardShopLevel();
    const winAmounts = [0, 14, 20, 36, 48, 68];
    const lossAmounts = [0, 10, 14, 24, 34, 48];
    return window.FoodAnimalsRewardRuntime.amountForLevel(level, won, { win: winAmounts, loss: lossAmounts });
  }

  function pushUniqueReward(choices, reward) {
    return window.FoodAnimalsRewardRuntime.pushUnique(choices, reward);
  }

  function shuffledRewards(rewards) {
    return window.FoodAnimalsRewardRuntime.shuffled(rewards, random);
  }

  function pushFromRewardPool(choices, rewards) {
    return window.FoodAnimalsRewardRuntime.pushFromPool(choices, rewards, random);
  }

  function rewardFitsAvailableSlot(reward) {
    if (!reward) return false;
    if (reward.type === "copy") return firstEmptyBench() >= 0;
    if (reward.type === "item") return Boolean(firstEmptyItemStorage(itemInfo(reward.itemId)));
    return true;
  }

  function availableReward(reward) {
    return rewardFitsAvailableSlot(reward) ? reward : null;
  }

  function traitRewardPriority() {
    const units = allOwnedRefs().map((ref) => ref.unit);
    const snapshots = compactTraitSnapshotForUnits(units)
      .filter((trait) => trait.count > 0)
      .sort((a, b) => {
        const gapA = a.nextAt ? a.nextAt - a.count : 99;
        const gapB = b.nextAt ? b.nextAt - b.count : 99;
        return gapA - gapB || b.count - a.count || a.label.localeCompare(b.label);
      })
      .map((trait) => trait.id);
    return [...new Set([...snapshots, ...arenaRewardTraits()])];
  }

  function copyRewardForTrait(traitId, source = "trait") {
    const pool = CATALOG.filter((animal) => animal.traits?.includes(traitId) && rewardRarityAvailable(animal.rarity || "common"));
    if (!pool.length) return null;
    const base = pool[randInt(pool.length)];
    const tier = arenaRewardTier();
    const unit = makeUnit(base.id, tier);
    const label = traitLabel(traitId);
    return {
      type: "copy",
      typeId: base.id,
      tier,
      traitId,
      title: source === "arena" ? `${themedArena(currentArena()).short}: ${displayUnitShort(unit)}` : `${label}: ${displayUnitShort(unit)}`,
      body: source === "arena" ? `${arenaRewardTierText(tier)}${arenaTerm({ lower: true })}-favored ${label} copy. ${arenaRewardShopLevelText()}` : `${arenaRewardTierText(tier)}copy helps push your ${label} tier. ${arenaRewardShopLevelText()}`,
      key: `copy:${source}:${traitId}:${base.id}:${tier}`,
    };
  }

  function pivotCopyReward() {
    const arenaTraits = arenaRewardTraits();
    const pool = CATALOG.filter((animal) => !animal.traits?.some((traitId) => arenaTraits.includes(traitId)) && rewardRarityAvailable(animal.rarity || "common"));
    if (!pool.length) return null;
    const base = pool[randInt(pool.length)];
    const tier = arenaRewardTier();
    const unit = makeUnit(base.id, tier);
    return {
      type: "copy",
      typeId: base.id,
      tier,
      title: `Pivot: ${displayUnitShort(unit)}`,
      body: `${arenaRewardTierText(tier)}off-${arenaTerm({ lower: true })} copy for changing lanes. ${arenaRewardShopLevelText()}`,
      key: `copy:pivot:${base.id}:${tier}`,
    };
  }

  function favoriteToppingReward() {
    const candidates = allOwnedRefs()
      .map((ref) => ref.unit)
      .filter((unit) => FAVORITE_TOPPINGS[unit.typeId] && !hasFavoriteTopping(unit))
      .sort((a, b) => Number(Boolean(a.item)) - Number(Boolean(b.item)) || b.tier - a.tier);
    if (!candidates.length) return null;
    const unit = candidates[0];
    const favorite = FAVORITE_TOPPINGS[unit.typeId];
    const tier = arenaRewardTier();
    const item = makeItem(favorite.itemId, tier);
    return {
      type: "item",
      itemId: item.id,
      tier,
      title: `${itemDisplayShort(item)} Favorite`,
      body: `${displayUnitShort(unit)}'s favorite ${toppingTerm({ lower: true })}. ${arenaRewardShopLevelText()}`,
      key: `favorite:${unit.typeId}:${item.id}:${tier}`,
    };
  }

  function arenaToppingReward() {
    const traits = arenaRewardTraits();
    const itemIds = CATALOG
      .filter((animal) => animal.traits?.some((traitId) => traits.includes(traitId)))
      .map((animal) => FAVORITE_TOPPINGS[animal.id]?.itemId)
      .filter(Boolean);
    const uniqueIds = [...new Set(itemIds)];
    const available = uniqueIds
      .map((itemId) => itemInfo(itemId))
      .filter((item) => item?.id && rewardRarityAvailable(item.rarity || "common"));
    const tier = arenaRewardTier();
    const baseItem = available.length ? available[randInt(available.length)] : shopItem();
    const item = makeItem(baseItem.id, tier);
    return {
      type: "item",
      itemId: item.id,
      tier,
      title: `${themedArena(currentArena()).short}: ${itemDisplayShort(item)}`,
      body: `${arenaRewardTierText(tier)}${toppingTerm({ lower: true })} fits this ${arenaTerm({ lower: true })}. ${arenaRewardShopLevelText()}`,
      key: `arena-item:${currentArena().id}:${item.id}:${tier}`,
    };
  }

  function ownedCopyReward() {
    const ownedTypes = [...new Set(allOwnedRefs().map((ref) => ref.unit.typeId))];
    if (!ownedTypes.length) return null;
    const typeId = ownedTypes[randInt(ownedTypes.length)];
    const tier = arenaRewardTier();
    const unit = makeUnit(typeId, tier);
    return {
      type: "copy",
      typeId,
      tier,
      title: `${displayUnitShort(unit)} Copy`,
      body: `Adds a ${arenaRewardTierText(tier)}copy of a line you own. ${arenaRewardShopLevelText()}`,
      key: `owned-copy:${typeId}:${tier}`,
    };
  }

  function freeItemReward() {
    const shopRolledItem = shopItem();
    const tier = Math.max(itemTier(shopRolledItem?.tier), arenaRewardTier());
    const item = makeItem(shopRolledItem.id, tier);
    return {
      type: "item",
      itemId: item.id,
      tier,
      title: `Free ${itemDisplayShort(item)}`,
      body: `${arenaRewardTierText(tier)}${rarityInfo(item.rarity).label} ${toppingTerm({ lower: true })}. ${arenaRewardShopLevelText()}`,
      key: `item:${item.id}:${tier}`,
    };
  }

  function freeRollReward(won) {
    const amount = freeRollRewardAmount();
    return {
      type: "freeRolls",
      amount,
      title: `${amount} Free ${amount === 1 ? rollTerm() : `${rollTerm()}s`}`,
      body: `${realityBroken() ? "Scan war stock next wave." : "Scout shops next round."} ${arenaRewardShopLevelText()}`,
      key: `freeRolls:${amount}`,
    };
  }

  function goldReward(won) {
    const amount = scaledGoldRewardAmount(won);
    return {
      type: "gold",
      amount,
      title: `+${amount} ${currencyTerm()}`,
      body: `Flexible ${currencyTerm({ lower: true })} for ${upgradeTerm({ lower: true })}s and pivots. ${arenaRewardShopLevelText()}`,
      key: `gold:${amount}`,
    };
  }

  function arenaScoutReward() {
    const arena = currentArena();
    const displayArena = themedArena(arena);
    const traitIds = arenaRewardTraits(arena.id);
    if (!traitIds.length) return null;
    const shopWord = realityBroken() ? "scans" : "shops";
    const freeRolls = freeRollRewardAmount();
    const shopsRemaining = rewardShopLevel() >= MAX_SHOP_LEVEL ? 3 : 2;
    return {
      type: "arenaScout",
      arenaId: arena.id,
      arenaShort: displayArena.short,
      traitIds,
      shopsRemaining,
      freeRolls,
      title: `${arenaTerm()} Scout: ${displayArena.short}`,
      body: `+${freeRolls} ${rollTerm({ lower: true })}${freeRolls === 1 ? "" : "s"}. Next ${shopsRemaining} ${shopWord} favor traits. ${arenaRewardShopLevelText()}`,
      key: `arena-scout:${arena.id}:${freeRolls}:${shopsRemaining}`,
    };
  }

  function arenaPrepBuffReward() {
    const arena = currentArena();
    const displayArena = themedArena(arena);
    const traitIds = arenaRewardTraits(arena.id);
    if (!traitIds.length) return null;
    const tier = arenaRewardTier();
    const levelBonus = Math.max(0, rewardShopLevel() - 1);
    return {
      type: "arenaPrepBuff",
      arenaId: arena.id,
      arenaShort: displayArena.short,
      traitIds,
      shieldPct: 0.12 + levelBonus * 0.03,
      hastePct: 0.1 + levelBonus * 0.02,
      attackPct: 0.08 + levelBonus * 0.02,
      duration: tier >= 3 ? 5 : tier >= 2 ? 4 : 3,
      title: `${arenaTerm()} Prep: ${displayArena.short}`,
      body: `Next battle: a ${arenaRewardTraitText(traitIds, 2)} unit gets stronger buffs. ${arenaRewardShopLevelText()}`,
      key: `arena-prep:${arena.id}:${rewardShopLevel()}`,
    };
  }

  function arenaHoldReward() {
    const arena = currentArena();
    const displayArena = themedArena(arena);
    const freeRolls = freeRollRewardAmount();
    return {
      type: "arenaHold",
      arenaId: arena.id,
      arenaShort: displayArena.short,
      freeRolls,
      title: `${arenaTerm()} Hold: ${displayArena.short}`,
      body: `Keep this ${arenaTerm({ lower: true })}; +${freeRolls} ${rollTerm({ lower: true })}${freeRolls === 1 ? "" : "s"}. ${arenaRewardShopLevelText()}`,
      key: `arena-hold:${arena.id}:${freeRolls}`,
    };
  }

  function arenaPurseReward(won) {
    const arena = currentArena();
    const displayArena = themedArena(arena);
    const amount = scaledArenaPurseAmount(won);
    const freeRolls = freeRollRewardAmount();
    return {
      type: "arenaPurse",
      arenaId: arena.id,
      amount,
      freeRolls,
      title: `${arenaTerm()} Purse: ${displayArena.short}`,
      body: `Immediate payout: +${amount} ${currencyTerm({ lower: true })}, +${freeRolls} free ${rollTerm({ lower: true })}${freeRolls === 1 ? "" : "s"}. ${arenaRewardShopLevelText()}`,
      key: `arena-purse:${arena.id}:${amount}:${freeRolls}`,
    };
  }

  function shopSlotUnlockReward() {
    const slotIndex = firstLockedShopSlot();
    if (slotIndex < 0) return null;
    const cost = shopSlotUnlockCost(slotIndex);
    return {
      type: "shopSlotUnlock",
      slotIndex,
      amount: cost,
      title: `Open Slot ${slotIndex + 1}`,
      body: `Unlock next ${realityBroken() ? "war stock" : "shop"} slot; saves ${cost} ${currencyTerm({ lower: true })}.`,
      key: `slot-unlock:${slotIndex}`,
    };
  }

  function upgradeDiscountReward() {
    const nextCost = nextShopUpgradeCost();
    if (nextCost === null || nextCost <= 0) return null;
    const amount = Math.min(20 + rewardShopLevel() * 10, nextCost);
    return {
      type: "upgradeDiscount",
      amount,
      title: `${upgradeTerm()} Coupon`,
      body: `Next ${realityBroken() ? "rig" : "shop upgrade"} costs ${amount} fewer ${currencyTerm({ lower: true })}. ${arenaRewardShopLevelText()}`,
      key: `upgrade-discount:${state.shopLevel}:${amount}`,
    };
  }

  function generateRewardChoices(won) {
    const choices = [];
    const hasBenchSpace = firstEmptyBench() >= 0;
    const hasItemStorageSpace = state.itemBench.some((entry) => !entry) || hasBenchSpace;
    const traitIds = traitRewardPriority();
    const arenaTraits = arenaRewardTraits();
    if (hasBenchSpace || hasItemStorageSpace) {
      pushFromRewardPool(choices, [
        availableReward(favoriteToppingReward()),
        availableReward(copyRewardForTrait(traitIds[0], "trait")),
        availableReward(ownedCopyReward()),
      ]);
      pushFromRewardPool(choices, [
        availableReward(copyRewardForTrait(arenaTraits[randInt(Math.max(1, arenaTraits.length))], "arena")),
        availableReward(arenaToppingReward()),
        arenaScoutReward(),
        arenaPrepBuffReward(),
        arenaHoldReward(),
      ]);
      pushFromRewardPool(choices, [
        goldReward(won),
        freeRollReward(won),
        shopSlotUnlockReward(),
        upgradeDiscountReward(),
        arenaPurseReward(won),
        availableReward(pivotCopyReward()),
        availableReward(freeItemReward()),
      ]);
    } else {
      pushFromRewardPool(choices, [
        goldReward(won),
        freeRollReward(won),
        shopSlotUnlockReward(),
        upgradeDiscountReward(),
        arenaScoutReward(),
        arenaHoldReward(),
        arenaPurseReward(won),
      ]);
    }
    pushFromRewardPool(choices, [goldReward(won), freeRollReward(won), shopSlotUnlockReward(), upgradeDiscountReward(), arenaScoutReward(), arenaPurseReward(won), arenaHoldReward()]);
    return choices.slice(0, 3);
  }

  function rewardFallbackLead(claimResult) {
    if (claimResult?.fallback?.reason === "shopSlotUnavailable") return "Slot already open";
    return realityBroken() ? "No bay" : "No room";
  }

  function rewardClaimMessage(reward, claimResult) {
    if (claimResult?.fallback?.type === "gold") {
      const gained = claimResult.fallback.goldAdded || 0;
      if (gained > 0) return `${rewardFallbackLead(claimResult)}; ${reward.title} became +${gained} ${currencyTerm({ lower: true })}`;
      return `${rewardFallbackLead(claimResult)}; ${reward.title} could not fit`;
    }
    return realityBroken() ? `Salvaged ${reward.title}` : `Claimed ${reward.title}`;
  }

  function rewardClaimLog(reward, claimResult) {
    if (claimResult?.fallback?.type === "gold") {
      const gained = claimResult.fallback.goldAdded || 0;
      const suffix = gained > 0 ? ` for ${gained} ${currencyTerm({ lower: true })}` : " with no space";
      return `${realityBroken() ? "Salvage fallback" : "Reward fallback"}: ${reward.title}${suffix}`;
    }
    return realityBroken() ? `Salvage: ${reward.title}` : `Reward: ${reward.title}`;
  }

  function applyRewardChoice(index) {
    if (state.phase !== "result" || !state.rewardChoices?.length) {
      playGameSfx("invalid");
      return false;
    }
    const reward = state.rewardChoices[index];
    if (!reward) {
      playGameSfx("invalid");
      return false;
    }
    const claimResult = window.FoodAnimalsRewardRuntime.claimReward(state, reward, {
      fallbackGold: 15,
      makeItem,
      makeUnit,
      maxGold: ECONOMY.maxGold,
      moveItemToBench,
      openShopSlot,
      resolveItemMerges,
      resolveMerges,
    });
    const claimMessage = rewardClaimMessage(reward, claimResult);
    const claimLog = rewardClaimLog(reward, claimResult);
    playGameSfx("reward");
    const clearResultParticlesForRetry = state.round === GIRAFFE_BOSS_ROUND && state.postCombatBattle?.result === "loss";
    const rewardParticles = clearResultParticlesForRetry ? [] : state.particles.slice();
    const startShopReturnTransition = shouldStartShopReturnTransition();
    state.rewardChoices = [];
    if (startShopReturnTransition) {
      startShopReturnTransitionOverlay({ rewardParticles });
    } else {
      continuePrep();
      if (rewardParticles.length) state.particles.push(...rewardParticles);
    }
    state.message = claimMessage;
    state.log.unshift(claimLog);
    saveCurrentRunSilently();
    return true;
  }

  function shouldStartShopReturnTransition() {
    return state.hearts > 0 && Boolean(state.postCombatBattle?.result || state.lastIncome?.result || state.lastCombatLedger?.result);
  }

  function continuePrep() {
    if (state.hearts <= 0) {
      if (startRebootTransition()) return;
      resetGame();
      return;
    }
    state.phase = "prep";
    clearParticles();
    state.rewardChoices = [];
    state.postCombatBattle = null;
    state.lastCombatLedger = null;
    resetCombatLedgerReview();
    startNextRoundShop();
    if (!state.shopReturnStaticTransition) maybeStartStoryMilestone();
    saveCurrentRunSilently();
  }

  function storyMilestoneEntries() {
    return Object.entries(STORY_MILESTONES)
      .map(([id, milestone]) => ({ id, ...milestone }))
      .sort((a, b) => (a.round || 0) - (b.round || 0));
  }

  function eligibleStoryMilestone() {
    if (isInfiniteMode()) return null;
    if (state.activeStory || state.phase !== "prep" || state.codexOpen) return null;
    if (state.rebootTransition || state.finalVictoryTransition || state.shopReturnStaticTransition || state.victoryCutscene) return null;
    return storyMilestoneEntries().find((milestone) => {
      if (state.seenStoryMilestones.includes(milestone.id)) return false;
      if (state.round !== milestone.round) return false;
      if (milestone.requiresRealityBroken && !realityBroken()) return false;
      return Array.isArray(milestone.beats) && milestone.beats.length > 0;
    }) || null;
  }

  function maybeStartStoryMilestone() {
    const milestone = eligibleStoryMilestone();
    if (!milestone) return false;
    startStoryConversation({
      id: milestone.id,
      title: milestone.title,
      index: 0,
      backgroundSrc: milestone.backgroundSrc,
      backgroundRanges: milestone.backgroundRanges,
      beats: milestone.beats,
    });
    state.seenStoryMilestones.push(milestone.id);
    state.message = milestone.title;
    if (milestone.log) state.log.unshift(milestone.log);
    return true;
  }

  function startFinalTabsStoryConversation() {
    if (state.seenStoryMilestones.includes(FINAL_TABS_STORY_ID)) {
      return startFinalVictoryTransition();
    }
    startStoryConversation({
      id: FINAL_TABS_STORY.id,
      title: FINAL_TABS_STORY.title,
      index: 0,
      backgroundSrc: FINAL_TABS_STORY.backgroundSrc,
      backgroundRanges: FINAL_TABS_STORY.backgroundRanges,
      beats: FINAL_TABS_STORY.beats,
    });
    state.seenStoryMilestones.push(FINAL_TABS_STORY_ID);
    state.message = FINAL_TABS_STORY.title;
    if (FINAL_TABS_STORY.log) state.log.unshift(FINAL_TABS_STORY.log);
    return true;
  }

  function startStoryConversation(story) {
    state.activeStory = {
      ...story,
      skipConfirm: false,
      transition: {
        phase: "enter",
        elapsed: 0,
        duration: STORY_TRANSITION_SECONDS,
      },
    };
    playGameSfx(realityBroken() ? "transition" : "ui-confirm", {
      volume: realityBroken() ? 0.46 : 0.28,
      rate: realityBroken() ? 0.88 : 1,
    });
    return state.activeStory;
  }

  function currentStoryBeat() {
    const story = state.activeStory;
    if (!story?.beats?.length) return null;
    return story.beats[Math.max(0, Math.min(story.index || 0, story.beats.length - 1))] || null;
  }

  function storyCanGoBack() {
    return Boolean(state.activeStory && (state.activeStory.index || 0) > 0);
  }

  function goBackStoryConversation() {
    const story = state.activeStory;
    if (!story || !storyCanGoBack()) return false;
    story.skipConfirm = false;
    story.index -= 1;
    story.beatTransition = {
      elapsed: 0,
      duration: STORY_BEAT_TRANSITION_SECONDS,
      direction: -1,
    };
    return true;
  }

  function advanceStoryConversation(skip = false) {
    const story = state.activeStory;
    if (!story) return false;
    if (skip || (story.index || 0) >= story.beats.length - 1) {
      story.skipConfirm = false;
      startStoryConversationExit();
      state.message = realityBroken() ? themedArena(currentArena()).short : "Prep";
      return true;
    }
    story.skipConfirm = false;
    story.index += 1;
    story.beatTransition = {
      elapsed: 0,
      duration: STORY_BEAT_TRANSITION_SECONDS,
      direction: 1,
    };
    return true;
  }

  function startStoryConversationExit() {
    const story = state.activeStory;
    if (!story || story.transition?.phase === "exit") return false;
    story.transition = {
      phase: "exit",
      elapsed: 0,
      duration: STORY_TRANSITION_SECONDS,
    };
    return true;
  }

  function storyTransitionPhase(story = state.activeStory) {
    return story?.transition?.phase || "stable";
  }

  function storyTransitionAlpha(story = state.activeStory) {
    const transition = story?.transition;
    if (!transition) return 1;
    const progress = clamp01((transition.elapsed || 0) / Math.max(0.001, transition.duration || STORY_TRANSITION_SECONDS));
    const eased = easeOutCubic(progress);
    return transition.phase === "exit" ? 1 - eased : eased;
  }

  function updateStoryConversationTransition(dt) {
    const story = state.activeStory;
    const transition = story?.transition;
    if (!transition) return;
    transition.elapsed = Math.min(transition.duration || STORY_TRANSITION_SECONDS, (transition.elapsed || 0) + dt);
    if (transition.elapsed < (transition.duration || STORY_TRANSITION_SECONDS)) return;
    if (transition.phase === "exit") {
      const completedStoryId = story.id;
      state.activeStory = null;
      if (completedStoryId === "level10") {
        startLevel10RevealCutscene({ entryTransition: true });
      }
      if (completedStoryId === FINAL_TABS_STORY_ID) startFinalVictoryTransition();
      return;
    }
    story.transition = null;
  }

  function startLevel10RevealCutscene(options = {}) {
    if (isInfiniteMode() && !options.force) return false;
    if (!options.force && state.seenStoryMilestones.includes(LEVEL10_REVEAL_CUTSCENE_ID)) return false;
    state.level10RevealCutscene = {
      id: LEVEL10_REVEAL_CUTSCENE_ID,
      elapsed: 0,
      total: LEVEL10_REVEAL_CUTSCENE_SECONDS,
      source: options.source || "level10Reveal",
    };
    if (options.entryTransition) {
      beginLevel10RevealCutsceneStaticTransition(state.level10RevealCutscene, 1, { label: "SIGNAL ACQUIRING", silentSfx: true });
    }
    if (!state.seenStoryMilestones.includes(LEVEL10_REVEAL_CUTSCENE_ID)) {
      state.seenStoryMilestones.push(LEVEL10_REVEAL_CUTSCENE_ID);
    }
    state.message = "Illusion failure";
    state.log.unshift("Cutscene: level 10 reveal aftermath");
    playGameSfx("reality-break", { theme: "horror", volume: 1.05, rate: 0.92 });
    return true;
  }

  function level10RevealCutsceneShot(cutscene = state.level10RevealCutscene) {
    if (!cutscene) return null;
    const elapsed = Math.max(0, cutscene.elapsed || 0);
    return LEVEL10_REVEAL_CUTSCENE_SHOTS.find((shot) => elapsed >= shot.start && elapsed < shot.start + shot.duration)
      || LEVEL10_REVEAL_CUTSCENE_SHOTS[LEVEL10_REVEAL_CUTSCENE_SHOTS.length - 1]
      || null;
  }

  function level10RevealCutsceneShotIndex(cutscene = state.level10RevealCutscene) {
    const shot = level10RevealCutsceneShot(cutscene);
    return Math.max(0, LEVEL10_REVEAL_CUTSCENE_SHOTS.indexOf(shot));
  }

  function completeLevel10RevealCutscene() {
    if (!state.level10RevealCutscene) return false;
    state.level10RevealCutscene = null;
    state.message = themedArena(currentArena()).short;
    return true;
  }

  function level10RevealCutsceneTransitioning(cutscene = state.level10RevealCutscene) {
    return Boolean(cutscene?.transition);
  }

  function beginLevel10RevealCutsceneStaticTransition(cutscene, direction = 1, options = {}) {
    if (!cutscene) return;
    cutscene.transition = {
      elapsed: 0,
      duration: LEVEL10_REVEAL_CUTSCENE_STATIC_TRANSITION_SECONDS,
      direction,
      completeOnEnd: Boolean(options.completeOnEnd),
      label: options.label || null,
      seed: Math.floor((cutscene.elapsed || 0) * 997) + Math.floor(state.idleTime * 61),
    };
    if (!options.silentSfx) {
      playGameSfx(options.sfxId || "transition", {
        theme: "horror",
        volume: options.volume ?? (options.completeOnEnd ? 0.74 : 0.58),
        rate: options.rate ?? (direction < 0 ? 0.88 : 1),
      });
    }
  }

  function advanceLevel10RevealCutscene(skip = false) {
    const cutscene = state.level10RevealCutscene;
    if (!cutscene) return false;
    if (skip) {
      playGameSfx("ui-back", { theme: "horror", volume: 0.52, rate: 0.9 });
      return completeLevel10RevealCutscene();
    }
    if (level10RevealCutsceneTransitioning(cutscene)) return false;
    const shotIndex = level10RevealCutsceneShotIndex(cutscene);
    const nextShot = LEVEL10_REVEAL_CUTSCENE_SHOTS[shotIndex + 1];
    if (!nextShot) {
      beginLevel10RevealCutsceneStaticTransition(cutscene, 1, { completeOnEnd: true, volume: 0.82, rate: 0.86 });
      return true;
    }
    cutscene.elapsed = nextShot.start + 0.001;
    beginLevel10RevealCutsceneStaticTransition(cutscene, 1);
    return true;
  }

  function retreatLevel10RevealCutscene() {
    const cutscene = state.level10RevealCutscene;
    if (!cutscene) return false;
    if (level10RevealCutsceneTransitioning(cutscene)) return false;
    const shotIndex = level10RevealCutsceneShotIndex(cutscene);
    const previousShot = LEVEL10_REVEAL_CUTSCENE_SHOTS[Math.max(0, shotIndex - 1)];
    if (!previousShot || shotIndex <= 0) return false;
    cutscene.elapsed = previousShot.start + 0.001;
    beginLevel10RevealCutsceneStaticTransition(cutscene, -1);
    return true;
  }

  function updateLevel10RevealCutscene(dt) {
    const cutscene = state.level10RevealCutscene;
    if (!cutscene) return;
    const shot = level10RevealCutsceneShot(cutscene);
    if (!shot) return;
    if (cutscene.transition) {
      cutscene.transition.elapsed = Math.min(cutscene.transition.duration, (cutscene.transition.elapsed || 0) + dt);
      if (cutscene.transition.elapsed >= cutscene.transition.duration) {
        if (cutscene.transition.completeOnEnd) {
          completeLevel10RevealCutscene();
          return;
        }
        cutscene.transition = null;
      }
    }
    const holdAt = Math.max(shot.start + 0.001, shot.start + shot.duration - 0.001);
    cutscene.elapsed = Math.min(holdAt, (cutscene.elapsed || 0) + dt);
  }

  function updateStoryBeatTransition(dt) {
    const beatTransition = state.activeStory?.beatTransition;
    if (!beatTransition) return;
    beatTransition.elapsed = Math.min(beatTransition.duration || STORY_BEAT_TRANSITION_SECONDS, (beatTransition.elapsed || 0) + dt);
    if (beatTransition.elapsed >= (beatTransition.duration || STORY_BEAT_TRANSITION_SECONDS)) {
      state.activeStory.beatTransition = null;
    }
  }

  function storyBeatTransitionVisual(story = state.activeStory) {
    const transition = story?.beatTransition;
    if (!transition) return { alpha: 1, offsetX: 0, direction: 0 };
    const progress = clamp01((transition.elapsed || 0) / Math.max(0.001, transition.duration || STORY_BEAT_TRANSITION_SECONDS));
    const eased = easeOutCubic(progress);
    const direction = transition.direction || 1;
    return {
      alpha: 0.2 + eased * 0.8,
      offsetX: direction * (1 - eased) * 14,
      direction,
    };
  }

  function applyStoryHit(hit) {
    const story = state.activeStory;
    if (!story) return false;
    if (storyTransitionPhase(story) === "exit") return false;
    if (hit?.action === "back") {
      const changed = goBackStoryConversation();
      playGameSfx(changed ? "ui-back" : "invalid", { volume: 0.55 });
      return changed;
    }
    if (hit?.action === "skip") {
      if (!story.skipConfirm) {
        story.skipConfirm = true;
        state.message = "Skip this dialogue section?";
        playGameSfx("invalid", { volume: 0.5 });
        return true;
      }
      const changed = advanceStoryConversation(true);
      playGameSfx("ui-back", { volume: 0.55 });
      return changed;
    }
    if (hit?.action === "advance") {
      const changed = advanceStoryConversation(false);
      playGameSfx("ui-confirm", { volume: 0.55 });
      return changed;
    }
    story.skipConfirm = false;
    return false;
  }

  function continueFromResult() {
    if (window.FoodAnimalsResultRuntime.shouldReturnToMenuAfterResult({
      phase: state.phase,
      hearts: state.hearts,
      realityBroken: realityBroken(),
    })) {
      return startShopReturnTransitionOverlay({
        source: "cozyDefeatReturn",
        message: "Returning to menu",
      });
    }
    if (state.phase === "result" && state.hearts > 0 && !state.rewardChoices?.length && shouldStartShopReturnTransition()) {
      return startShopReturnTransitionOverlay();
    }
    continuePrep();
    return true;
  }

  function startShopReturnTransitionOverlay(options = {}) {
    const horror = realityBroken();
    const normalMenuReturn = options.source === "normalMenuReturn";
    const duration = normalMenuReturn
      ? (horror ? 1.9 : 2.05)
      : horror ? HORROR_SHOP_RETURN_STATIC_SECONDS : COZY_SHOP_RETURN_AWNING_SECONDS;
    if (!horror) clearParticles();
    state.shopReturnStaticTransition = {
      elapsed: 0,
      duration,
      switchAt: duration * (normalMenuReturn ? 0.72 : 0.48),
      screenChanged: false,
      theme: horror ? "horror" : "cozy",
      rewardParticles: horror && Array.isArray(options.rewardParticles) ? options.rewardParticles : [],
      source: options.source || (horror ? "horrorRewardReturn" : "cozyRewardReturn"),
    };
    state.pointer = null;
    state.hover = null;
    state.selected = null;
    state.drag = null;
    state.message = options.message || (horror ? "Signal stabilizing" : "Market restocking");
    playGameSfx("transition");
    return true;
  }

  function startRebootTransition(options = {}) {
    const fromVictoryCutscene = Boolean(options.fromVictoryCutscene);
    if ((!fromVictoryCutscene && !realityBroken()) || state.rebootTransition) return false;
    state.rebootTransition = window.FoodAnimalsVictoryRebootRuntime.rebootTransition({
      duration: REBOOT_STATIC_FADE_SECONDS,
      resetAtPct: REBOOT_STATIC_RESET_AT,
      fromVictoryCutscene,
    });
    state.pointer = null;
    state.hover = null;
    state.selected = null;
    state.drag = null;
    state.message = "Rebooting cozy shell";
    playGameSfx("reboot", { theme: "horror" });
    return true;
  }

  function startFinalVictoryTransition() {
    if (state.finalVictoryTransition) return false;
    state.finalVictoryTransition = window.FoodAnimalsVictoryRebootRuntime.finalVictoryTransition({
      holdDuration: FINAL_VICTORY_HOLD_SECONDS,
      staticDuration: FINAL_VICTORY_STATIC_FADE_SECONDS,
      resetAtPct: FINAL_VICTORY_STATIC_RESET_AT,
    });
    state.pointer = null;
    state.hover = null;
    state.selected = null;
    state.message = "Command lattice severed. Nursery sector unlocked.";
    playGameSfx("victory", { theme: "horror", volume: 1.05 });
    return true;
  }

  function completeFinalVictoryTransitionReset(transition) {
    state.realityOverride = false;
    state.phase = "victoryCutscene";
    state.runConcluded = true;
    state.codexOpen = false;
    state.selected = null;
    state.drag = null;
    state.rewardChoices = [];
    state.battle = null;
    state.postCombatBattle = null;
    state.finalVictoryTransition = {
      ...transition,
      resetDone: true,
    };
    state.victoryCutscene = window.FoodAnimalsVictoryRebootRuntime.victoryCutscene({
      roundCleared: FINAL_VICTORY_ROUND,
      backgroundSrc: FINAL_VICTORY_CUTSCENE_SRC,
      idealBackgroundSrc: FINAL_VICTORY_IDEAL_SRC,
      message: "The doors open",
    });
    state.message = "The doors open";
    state.runConcluded = true;
    clearParticles();
  }

  function rebootFromVictoryCutscene() {
    if (state.menuRebootTransition) return false;
    clearActiveRunRoute();
    markHorrorMenuUnlocked();
    markMenuRebootStaticReveal();
    state.menuRebootTransition = window.FoodAnimalsVictoryRebootRuntime.menuRebootTransition(VICTORY_MENU_REBOOT_STATIC_SECONDS);
    state.pointer = null;
    state.hover = null;
    state.selected = null;
    state.drag = null;
    state.message = "Returning to menu";
    playGameSfx("reboot", { theme: "horror", volume: 1 });
    return true;
  }

  function completeRebootTransitionReset(transition) {
    state.realityOverride = false;
    resetGame();
    state.rebootTransition = {
      ...transition,
      resetDone: true,
    };
    state.pointer = null;
    state.hover = null;
    state.message = "Cozy mode restored";
  }

  function resetGame() {
    state.phase = "prep";
    state.runMode = initialRunMode();
    state.round = 1;
    state.gold = ECONOMY.startingGold;
    state.hearts = 10;
    state.shopLevel = 1;
    state.message = "Prep";
    state.shop = [];
    state.shopFrozen = Array(shopSlots.length).fill(false);
    state.shopSales = Array(shopSlots.length).fill(false);
    state.shopUnlocked = initialShopUnlocked();
    state.bench = Array(8).fill(null);
    state.itemBench = Array(itemBenchSlots.length).fill(null);
    state.board = Array(boardSlots.length).fill(null);
    state.drinks = Array(drinkSlots.length).fill(null);
    state.selected = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.arenaId = randomArenaId();
    state.keepArenaNextRound = false;
    state.arenaHoldNotice = null;
    state.arenaScout = null;
    state.arenaPrepBuff = null;
    state.enemyPreview = null;
    state.rewardChoices = [];
    state.lastCombatLedger = null;
    resetCombatLedgerReview();
    state.freeRolls = startingFreeRollsForShopLevel();
    state.rollsThisRound = 0;
    state.nextShopUpgradeDiscountGold = 0;
    state.winStreak = 0;
    state.lossStreak = 0;
    state.lastIncome = null;
    state.itemDiscountUsed = false;
    state.realityOverride = initialRealityOverride();
    state.realityBroken = false;
    state.realityBreakTimer = 0;
    state.postGiraffeHorrorTransition = null;
    state.level10RevealCutscene = null;
    state.shopReturnStaticTransition = null;
    state.phaseTransition = null;
    state.modalTransitions = {};
    state.shopSlotTransitions = Array(shopSlots.length).fill(null);
    state.rebootTransition = null;
    state.menuRebootTransition = null;
    state.finalVictoryTransition = null;
    state.victoryCutscene = null;
    state.activeStory = null;
    state.seenStoryMilestones = [];
    state.optionsMenu = { open: false, selected: "resume", savedAt: null, dragSlider: null };
    clearParticles();
    state.log = [];
    refreshShop(true);
  }

  function moldDamagePct(stacks) {
    if (stacks <= 0) return 0;
    return Math.min(MOLD_MAX_DAMAGE_PCT, MOLD_BASE_DAMAGE_PCT + (stacks - 1) * MOLD_STACK_DAMAGE_PCT);
  }

  function moldStateText(battle) {
    if (!battle) return null;
    const active = battle.elapsed >= MOLD_START_SECONDS || (battle.moldStacks || 0) > 0;
    const stacks = battle.moldStacks || 0;
    const horror = realityBroken();
    return {
      label: horror ? "Radiation" : "Mold",
      active,
      startsAt: MOLD_START_SECONDS,
      nextTickIn: active ? Math.max(0, Number(((battle.moldNextTick || 0) - battle.elapsed).toFixed(2))) : Math.max(0, Number((MOLD_START_SECONDS - battle.elapsed).toFixed(2))),
      stacks,
      ...(horror ? { dose: stacks } : {}),
      damagePct: Number((moldDamagePct(Math.max(1, stacks)) * 100).toFixed(1)),
      totalDamage: battle.moldTotalDamage || 0,
    };
  }

  function currentMoldStatusEffectId() {
    return realityBroken() ? "radiation" : "mold";
  }

  function currentMoldStatusStyle() {
    return STATUS_EFFECT_STYLES[currentMoldStatusEffectId()] || STATUS_EFFECT_STYLES.mold;
  }

  function applyMoldTick(battle) {
    battle.moldStacks = (battle.moldStacks || 0) + 1;
    const damagePct = moldDamagePct(battle.moldStacks);
    const moldStyle = currentMoldStatusStyle();
    const units = [...battle.allies, ...battle.enemies].filter((unit) => !unit.dead);
    playGameSfx(realityBroken() ? "reality-break" : "control", {
      volume: realityBroken() ? 0.42 : 0.28,
      rate: Math.max(0.72, 1.04 - battle.moldStacks * 0.035),
    });
    units.forEach((unit) => {
      unit.moldStacks = battle.moldStacks;
      const damage = Math.max(1, Math.round(unit.maxHp * damagePct));
      unit.hp = Math.max(0, unit.hp - damage);
      battle.moldTotalDamage = (battle.moldTotalDamage || 0) + damage;
      recordCombatDamage(battle, null, unit, damage, 0, { silentSfx: true });
      burst({ x: unit.x, y: unit.y }, moldStyle.color);
      if (unit.hp <= 0 && !unit.dead) {
        unit.dead = true;
        unit.shield = 0;
        recordCombatKo(battle, null, unit);
        defeatExplosion(unit);
      }
    });
  }

  function updateBattleMold(battle) {
    if (!battle) return;
    if (battle.moldNextTick == null) battle.moldNextTick = MOLD_START_SECONDS;
    while (battle.elapsed >= battle.moldNextTick && !battle.result) {
      applyMoldTick(battle);
      battle.moldNextTick += MOLD_TICK_SECONDS;
    }
  }

  function updateBattle(dt) {
    const battle = state.battle;
    if (!battle || battle.result) return;
    battle.elapsed += dt;
    updateBattleStatuses(battle, dt);
    updateBattleMold(battle);
    updateDrinkPulses(battle, dt);
    const all = [...battle.allies, ...battle.enemies].filter((u) => !u.dead);
    for (const unit of all) {
      unit.cooldown -= dt * attackClockMultiplier(unit);
      if (unit.cooldown > 0) continue;
      const foes = (unit.side === "ally" ? battle.enemies : battle.allies).filter((u) => !u.dead);
      if (foes.length === 0) continue;
      unit.cooldown = unit.speed;
      performCombatAction(unit, battle, foes);
    }
    battle.attacks = battle.attacks.filter((a) => (a.t -= dt) > 0);
    battle.drinkTosses = (battle.drinkTosses || []).filter((toss) => {
      toss.t -= dt;
      if (toss.t > 0) return true;
      drinkTossImpact(toss, battle);
      return false;
    });
    captureDueCombatLedgerFrames(battle);
    if (isGiraffeBossRound(state.round) && battle.elapsed > BATTLE_TIMEOUT_SECONDS) {
      battle.result = "loss";
      endBattle(false);
    } else if (battle.enemies.every((u) => u.dead)) {
      battle.result = "win";
      endBattle(true);
    } else if (battle.allies.every((u) => u.dead)) {
      battle.result = "loss";
      endBattle(false);
    } else if (battle.elapsed > BATTLE_TIMEOUT_SECONDS) {
      battle.result = "loss";
      endBattle(false);
    }
  }

  function updateBattleStatuses(battle, dt) {
    const units = [...battle.allies, ...battle.enemies];
    units.forEach((unit) => {
      if (unit.dead) return;
      const negativeDt = window.FoodAnimalsStatusRuntime.negativeStatusStep(dt, {
        itemReductionPct: unit.item?.statusDurationReductionPct || 0,
        arenaMultiplier: arenaStatusClearMultiplier(unit),
        freshStage: activeTraitStage(unit, "fresh"),
      });
      if (hasNegativeStatus(unit) && unit.item?.firstDebuffCleanseHealPct && !unit.firstDebuffCleanseUsed) {
        unit.firstDebuffCleanseUsed = true;
        cleanseUnit(unit);
        healUnit(unit, Math.max(1, Math.round(unit.maxHp * unit.item.firstDebuffCleanseHealPct)));
        burst({ x: unit.x, y: unit.y }, unit.item.accent || "#2e6f2b");
      }
      if (unit.burn) {
        unit.burn.remaining -= negativeDt;
        unit.burn.tick -= dt;
        if (unit.burn.tick <= 0) {
          unit.burn.tick += 1;
          applyDamage(unit, unit.burn.damage, unit.burn.source || unit, battle, {
            color: "#e24822",
            particleType: "pepperoni_slice",
            status: true,
            noItemTriggers: true,
          });
        }
        if (unit.burn.remaining <= 0) unit.burn = null;
      }
      if (unit.mark) {
        unit.mark.remaining -= negativeDt;
        if (unit.mark.remaining <= 0) unit.mark = null;
      }
      if (unit.teamVulnerable) {
        unit.teamVulnerable.remaining -= negativeDt;
        if (unit.teamVulnerable.remaining <= 0) unit.teamVulnerable = null;
      }
      if (unit.haste) {
        unit.haste.remaining -= dt;
        if (unit.haste.remaining <= 0) unit.haste = null;
      }
      if (unit.attackBoost) {
        unit.attackBoost.remaining -= dt;
        if (unit.attackBoost.remaining <= 0) unit.attackBoost = null;
      }
      if (unit.taunt) {
        unit.taunt.remaining -= dt;
        if (unit.taunt.remaining <= 0) unit.taunt = null;
      }
      if (unit.attackSlow) {
        unit.attackSlow.remaining -= negativeDt;
        if (unit.attackSlow.remaining <= 0) unit.attackSlow = null;
      }
      if (unit.antiSupport) {
        unit.antiSupport.remaining -= negativeDt;
        if (unit.antiSupport.remaining <= 0) unit.antiSupport = null;
      }
      if (unit.slowed) {
        unit.slowed.remaining -= negativeDt;
        if (unit.slowed.remaining <= 0) unit.slowed = null;
      }
      updateLongFightUnitPulses(unit, battle, dt);
      if (unit.item?.periodicDamage) {
        unit.periodicItemTick = (unit.periodicItemTick ?? (unit.item.periodicInterval || 3)) - dt;
        if (unit.periodicItemTick <= 0) {
          unit.periodicItemTick += unit.item.periodicInterval || 3;
          const foes = (unit.side === "ally" ? battle.enemies : battle.allies).filter((foe) => !foe.dead);
          if (foes.length) {
            const target = foes[randInt(foes.length)];
            const popDamage = Math.max(1, Math.round((unit.item.periodicDamage || 0) + unit.atk * (unit.item.periodicDamagePct || 0)));
            applyDamage(target, popDamage, unit, battle, {
              color: unit.item.accent || "#d98b19",
              particleType: unit.item.id,
              status: true,
            });
          }
        }
      }
      if (unit.item?.teamHastePct) {
        unit.teamHasteTick = (unit.teamHasteTick ?? (unit.item.teamHasteInterval || 5)) - dt;
        if (unit.teamHasteTick <= 0) {
          unit.teamHasteTick += unit.item.teamHasteInterval || 5;
          const allies = (unit.side === "enemy" ? battle.enemies : battle.allies).filter((ally) => !ally.dead);
          allies.forEach((ally) => {
            ally.haste = {
              remaining: unit.item.teamHasteDuration || 2.5,
              pct: unit.item.teamHastePct,
            };
            burst({ x: ally.x, y: ally.y }, unit.item.accent || "#d8c27a");
          });
        }
      }
      if (unit.item?.selfBurnDamagePct) {
        unit.selfBurnTick = (unit.selfBurnTick ?? 1) - dt;
        if (unit.selfBurnTick <= 0) {
          unit.selfBurnTick += 1;
          applyDamage(unit, Math.max(1, Math.round(unit.maxHp * unit.item.selfBurnDamagePct)), unit, battle, {
            color: unit.item.accent || "#d97813",
            particleType: unit.item.id,
            status: true,
            noDeathSave: true,
          });
        }
      }
      if (unit.item?.lateFightDamagePct) {
        const start = unit.item.lateFightStart || 8;
        const interval = unit.item.lateFightInterval || 4;
        const maxStacks = unit.item.lateFightMaxStacks || 4;
        unit.lateFightStacks = battle.elapsed >= start ? Math.min(maxStacks, 1 + Math.floor((battle.elapsed - start) / interval)) : 0;
      }
    });
  }

  function updateLongFightUnitPulses(unit, battle, dt) {
    updateTimedHastePulse(unit, battle);
    updateAdjacentItemPulse(unit, battle, dt);
    updateLowHpBurnPulse(unit, battle, dt);
    updateSyrupStartPulse(unit, battle, dt);
  }

  function updateTimedHastePulse(unit, battle) {
    if (!unit.item?.timedHastePct) return;
    const firstAt = unit.item.timedHasteAt || 10;
    if (unit.timedHasteNextAt == null) unit.timedHasteNextAt = firstAt;
    if (battle.elapsed < unit.timedHasteNextAt) return;
    setTimedPctStatus(unit, "haste", unit.item.timedHastePct, unit.item.timedHasteDuration || 4);
    burst({ x: unit.x, y: unit.y }, unit.item.accent || "#f4efe2");
    unit.timedHasteUsed = true;
    unit.timedHasteNextAt = unit.item.timedHasteInterval
      ? battle.elapsed + unit.item.timedHasteInterval
      : Number.POSITIVE_INFINITY;
  }

  function adjacentLivingAllies(unit, battle) {
    const allies = unit.side === "enemy" ? battle.enemies : battle.allies;
    return allies.filter((ally) => !ally.dead && isAdjacentSlot(unit, ally));
  }

  function updateAdjacentItemPulse(unit, battle, dt) {
    if (!unit.item?.adjacentPulseShieldPct && !unit.item?.adjacentPulseAttackBuffPct) return;
    const interval = unit.item.adjacentPulseInterval || 7;
    unit.adjacentItemPulseTick = (unit.adjacentItemPulseTick ?? interval) - dt;
    if (unit.adjacentItemPulseTick > 0) return;
    unit.adjacentItemPulseTick += interval;
    const targets = adjacentLivingAllies(unit, battle);
    targets.forEach((ally) => {
      let supported = false;
      if (unit.item.adjacentPulseShieldPct) {
        const shield = Math.max(1, Math.round(ally.maxHp * unit.item.adjacentPulseShieldPct));
        supported = grantShield(ally, shield, { source: unit }) > 0 || supported;
      }
      if (unit.item.adjacentPulseAttackBuffPct) {
        setTimedPctStatus(ally, "attackBoost", unit.item.adjacentPulseAttackBuffPct, unit.item.adjacentPulseDuration || 2.5);
        supported = true;
      }
      if (supported) emitSupportFeedback(unit, ally, battle, unit.item.accent || "#d6b88a");
    });
  }

  function updateLowHpBurnPulse(unit, battle, dt) {
    if (!unit.item?.lowHpBurnDamagePct || !unit.item.lowHpBurnInterval) return;
    const threshold = unit.item.lowHpBurnThreshold || 0.4;
    if (unit.hp / unit.maxHp > threshold) {
      unit.lowHpBurnTick = 0;
      return;
    }
    unit.lowHpBurnTick = (unit.lowHpBurnTick ?? 0) - dt;
    if (unit.lowHpBurnTick > 0) return;
    unit.lowHpBurnTick += unit.item.lowHpBurnInterval;
    triggerLowHpBurn(unit, battle, { force: true });
  }

  function updateSyrupStartPulse(unit, battle, dt) {
    if (unit.ability !== "syrup_start") return;
    const interval = syrupPulseInterval(unit);
    unit.syrupPulseTick = (unit.syrupPulseTick ?? interval) - dt;
    if (unit.syrupPulseTick > 0) return;
    unit.syrupPulseTick += interval;
    const targets = adjacentLivingAllies(unit, battle);
    targets.forEach((ally) => {
      const shielded = grantShield(ally, supportAmount(unit, syrupPulseShield(unit)), { source: unit });
      setTimedPctStatus(ally, "haste", syrupPulseHaste(unit), 2.2);
      applySupportItem(unit, ally);
      if (shielded > 0 || ally.uid === unit.uid) emitSupportFeedback(unit, ally, battle, "#e8b765");
    });
  }

  function attackClockMultiplier(unit) {
    return window.FoodAnimalsBattleAbilityRuntime.attackClockMultiplier(unit, {
      hasFavoriteTopping: hasFavoriteTopping(unit),
      arenaAttackClockBonus: arenaAttackClockBonus(unit),
      streetStage: activeTraitStage(unit, "street_food"),
      kernelHaste: unit.ability === "kernel_combo" && unit.kernelStacks > 0 ? popcornStackHaste(unit) : 0,
    });
  }

  function performCombatAction(unit, battle, foes) {
    const allies = unit.side === "ally" ? battle.allies : battle.enemies;
    if (unit.ability === "heal") {
      const friend = weakestDamaged(allies);
      if (friend) {
        const healed = healUnit(friend, supportAmount(unit, healAmount(unit)), { source: unit });
        const shielded = grantShield(friend, supportAmount(unit, Math.round(unit.abilityPower * 0.35)), { source: unit });
        applySupportItem(unit, friend);
        applyExtraAdjacentHeal(unit, friend, healed, allies);
        if (healed > 0 || shielded > 0) emitSupportProjectile(unit, friend, battle, "#55a375");
        burst({ x: friend.x, y: friend.y }, "#55a375");
        return;
      }
      const shieldTarget = lowestShieldedAlly(allies);
      if (shieldTarget) {
        const shielded = grantShield(shieldTarget, supportAmount(unit, noodleFallbackShield(unit)), { source: unit });
        applySupportItem(unit, shieldTarget);
        if (shielded > 0) emitSupportProjectile(unit, shieldTarget, battle, "#55a375");
        burst({ x: shieldTarget.x, y: shieldTarget.y }, "#55a375");
        return;
      }
    }

    if (unit.ability === "cleanse") {
      const friend = mostStatusedAlly(allies);
      if (friend) {
        cleanseUnit(friend);
        const healed = healUnit(friend, supportAmount(unit, lemonCleanseHeal(unit)), { source: unit });
        grantShield(friend, supportAmount(unit, lemonCleanseShield(unit)), { source: unit });
        friend.haste = {
          remaining: 2.5,
          pct: lemonCleanseHaste(unit),
        };
        applySupportItem(unit, friend);
        applyExtraAdjacentHeal(unit, friend, healed, allies);
        emitSupportProjectile(unit, friend, battle, "#f2dc5d");
        burst({ x: friend.x, y: friend.y }, "#f2dc5d");
        return;
      }
      const backup = weakestDamaged(allies);
      if (backup) {
        const healed = healUnit(backup, supportAmount(unit, lemonCleanseHeal(unit)), { source: unit });
        const shielded = grantShield(backup, supportAmount(unit, lemonCleanseShield(unit)), { source: unit });
        backup.haste = {
          remaining: 2.5,
          pct: lemonCleanseHaste(unit),
        };
        applySupportItem(unit, backup);
        applyExtraAdjacentHeal(unit, backup, healed, allies);
        if (healed > 0 || shielded > 0) emitSupportProjectile(unit, backup, battle, "#f2dc5d");
        burst({ x: backup.x, y: backup.y }, "#f2dc5d");
        return;
      }
    }

    const target = chooseTarget(unit, foes);
    if (!target) return;

    if (unit.ability === "giraffe_boss_glitch") {
      unit.giraffeAttackCount = (unit.giraffeAttackCount || 0) + 1;
      applyDamage(target, unit.atk, unit, battle, {
        color: "#f8c55f",
        particleType: GIRAFFE_BOSS_TYPE_ID,
      });
      if (!target.dead && unit.giraffeAttackCount % 3 === 0) {
        applyCooldownDelay(target, 0.12, unit);
        target.attackSlow = {
          remaining: statusDuration(unit, 1.3),
          pct: 0.07,
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "neural_overmind") {
      unit.overmindAttackCount = (unit.overmindAttackCount || 0) + 1;
      applyDamage(target, unit.atk, unit, battle, {
        color: "#18f0ff",
        particleType: FINAL_BOSS_TYPE_ID,
      });
      if (!target.dead) {
        applyCooldownDelay(target, 0.2, unit);
        target.attackSlow = {
          remaining: statusDuration(unit, 2.4),
          pct: 0.14,
        };
      }
      if (unit.overmindAttackCount % 3 === 0) {
        foes
          .filter((foe) => !foe.dead && foe.uid !== target.uid && foe.row === target.row)
          .slice(0, 2)
          .forEach((foe) => {
            applyDamage(foe, Math.max(1, Math.round(unit.atk * 0.42)), unit, battle, {
              color: "#ff334f",
              particleType: FINAL_BOSS_TYPE_ID,
              status: true,
            });
            if (!foe.dead) applyCooldownDelay(foe, 0.12, unit);
          });
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "brainstem_probe") {
      applyDamage(target, unit.atk, unit, battle, {
        color: "#42f4ff",
        particleType: FINAL_BOSS_MINION_TYPE_ID,
      });
      if (!target.dead) {
        applyCooldownDelay(target, 0.08 + unit.tier * 0.015, unit);
        if (unit.tier >= 3) {
          target.attackSlow = {
            remaining: statusDuration(unit, 1.4),
            pct: 0.08,
          };
        }
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "execute") {
      const wounded = target.hp / target.maxHp <= 0.5;
      const bonus = wounded ? executeBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle);
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "cleave") {
      applyDamage(target, unit.atk, unit, battle);
      const splash = cleaveDamage(unit);
      foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid && foe.col === target.col)
        .forEach((foe) => applyDamage(foe, splash, unit, battle, { color: "#f1c84b" }));
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "back_row") {
      applyDamage(target, unit.atk, unit, battle);
      if (unit.item?.backRowTargeting) {
        applyDamage(target, berryPretzelComboDamage(unit), unit, battle, {
          color: unit.item.accent || "#f1d270",
          particleType: unit.item.id,
          status: true,
        });
      }
      const extras = Math.min(unit.tier - 1, foes.length - 1);
      const volleyTargets = foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid)
        .sort((a, b) => (a.col - b.col) || distSq(unit, a) - distSq(unit, b))
        .slice(0, extras);
      volleyTargets.forEach((foe) => applyDamage(foe, volleyDamage(unit), unit, battle, { color: "#dd5ea8" }));
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "slow") {
      applyDamage(target, unit.atk, unit, battle, { color: "#f0d56b" });
      if (!target.dead) applyCooldownDelay(target, pretzelDelay(unit), unit);
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "pepper_dash") {
      const backPressure = target.col === BACK_COL || target.burn;
      applyDamage(target, unit.atk + (backPressure ? pepperPokeBonus(unit) : 0), unit, battle, { color: "#f26a35" });
      if (!target.dead) {
        target.burn = {
          remaining: statusDuration(unit, pepperBurnDuration(unit)),
          tick: 1,
          damage: pepperBurnDamage(unit),
          source: unit,
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "armor_break") {
      const tough = target.shield > 0 || target.maxHp >= unit.maxHp * 1.15 || target.col === FRONT_COL;
      const bonus = tough ? armorBreakBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: tough ? "#d9852f" : unit.accent });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "shield_breaker") {
      const stolen = target.shield > 0 ? Math.min(target.shield, shieldBreakSteal(unit)) : 0;
      if (stolen > 0) {
        target.shield -= stolen;
        recordCombatDamage(battle, unit, target, 0, stolen);
        grantShield(unit, Math.max(1, Math.round(stolen * 0.75)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, "#5ea3b5");
      }
      applyDamage(target, unit.atk + (stolen > 0 ? shieldBreakBonus(unit) : 0), unit, battle, { color: "#5ea3b5" });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "bagel_build") {
      applyDamage(target, unit.atk, unit, battle, { color: "#c98a3a" });
      const buildTargets = allies
        .filter((ally) => !ally.dead && (isAdjacentSlot(unit, ally) || ally.col === FRONT_COL))
        .sort((a, b) => (a.shield || 0) - (b.shield || 0))
        .slice(0, 2);
      buildTargets.forEach((ally) => {
        const shielded = grantShield(ally, supportAmount(unit, bagelBuildShield(unit)));
        applySupportItem(unit, ally);
        if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, battle, "#c98a3a");
      });
      burst({ x: unit.x, y: unit.y }, "#f0d56b");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "status_spread") {
      const bonus = hasNegativeStatus(target) ? kimchiStatusBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: "#e65036" });
      if (!target.dead) {
        target.burn = {
          remaining: statusDuration(unit, kimchiBurnDuration(unit)),
          tick: 1,
          damage: kimchiBurnDamage(unit),
          source: unit,
        };
        target.mark = {
          sourceUid: unit.uid,
          remaining: statusDuration(unit, kimchiMarkDuration(unit)),
          damagePct: kimchiMarkPct(unit),
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "shakshuka_burn") {
      applyDamage(target, unit.atk + (target.burn ? shakshukaSplashDamage(unit) : 0), unit, battle, { color: "#e24822" });
      const burnTargets = [target, ...foes.filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe)).slice(0, unit.tier >= 3 ? 2 : 1)];
      burnTargets.forEach((foe, index) => {
        if (foe.dead) return;
        foe.burn = {
          remaining: statusDuration(unit, shakshukaBurnDuration(unit)),
          tick: 1,
          damage: Math.max(1, Math.round(shakshukaBurnDamage(unit) * (index === 0 ? 1 : 0.65))),
          source: unit,
        };
        if (index > 0) {
          applyDamage(foe, shakshukaSplashDamage(unit), unit, battle, {
            color: "#f4d35e",
            status: true,
          });
        }
      });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "pull_start") {
      unit.krakenAttackCount = (unit.krakenAttackCount || 0) + 1;
      applyDamage(target, unit.atk, unit, battle, { color: unit.accent });
      if (!target.dead && unit.krakenAttackCount % krakenCombatPullEvery(unit) === 0) {
        if (applyCooldownDelay(target, Math.max(0.08, krakenPullDelay(unit) * 0.45), unit) > 0) {
          target.slowed = { remaining: statusDuration(unit, 1.4) };
        }
        applyKrakenPull(unit, foes);
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "sticky_lane") {
      applyDamage(target, unit.atk, unit, battle, { color: "#d8a64a" });
      foes
        .filter((foe) => !foe.dead && foe.col === target.col)
        .forEach((foe) => {
          if (applyCooldownDelay(foe, waffleLaneDelay(unit), unit) > 0) {
            foe.slowed = { remaining: statusDuration(unit, 1.4) };
          }
        });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "kernel_combo") {
      unit.kernelStacks = Math.min(popcornMaxStacks(unit), (unit.kernelStacks || 0) + 1);
      applyDamage(target, unit.atk + popcornKernelBonus(unit), unit, battle, { color: "#f4d35e" });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "sour_aura") {
      const bonus = target.shield > 0 ? yogurtShieldCrackDamage(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: "#d6ecff" });
      if (!target.dead) {
        target.antiSupport = {
          remaining: statusDuration(unit, yogurtSourDuration(unit)),
          reductionPct: yogurtSourPct(unit),
        };
        target.attackSlow = {
          remaining: statusDuration(unit, unit.tier >= 3 ? 2 : 1.5),
          pct: unit.tier >= 3 ? 0.16 : 0.1,
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "row_shield") {
      applyDamage(target, unit.atk, unit, battle, { color: "#f0dcb8" });
      allies
        .filter((ally) => !ally.dead && ally.row === unit.row)
        .forEach((ally) => {
          const shielded = grantShield(ally, supportAmount(unit, dumplingRowShield(unit)));
          applySupportItem(unit, ally);
          if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, battle, "#f0dcb8");
        });
      burst({ x: unit.x, y: unit.y }, "#f0dcb8");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "formation_captain") {
      applyDamage(target, unit.atk, unit, battle, { color: "#d84a3a" });
      formationAllies(unit, allies).forEach((ally) => {
        const shielded = grantShield(ally, supportAmount(unit, formationShield(unit)));
        ally.attackBoost = { remaining: formationBuffDuration(unit), pct: formationAttackBoost(unit) };
        applySupportItem(unit, ally);
        if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, battle, "#d84a3a");
      });
      burst({ x: unit.x, y: unit.y }, "#6fae48");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "iceberg_lock") {
      applyDamage(target, unit.atk, unit, battle, { color: "#7ec7e8" });
      if (!target.dead) {
        if (applyCooldownDelay(target, oysterLockDelay(unit), unit) > 0) {
          target.attackSlow = {
            remaining: statusDuration(unit, 2.4 + unit.tier * 0.25),
            pct: oysterSlowPct(unit),
          };
        }
      }
      const shielded = grantShield(unit, supportAmount(unit, oysterLockShield(unit)));
      if (shielded > 0) burst({ x: unit.x, y: unit.y }, "#d8f2ff");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "pearl_stun") {
      applyDamage(target, unit.atk, unit, battle, { color: "#c99bd8" });
      unit.pearlAttackCount = (unit.pearlAttackCount || 0) + 1;
      if (!target.dead && unit.pearlAttackCount % bobaStunEvery(unit) === 0) {
        if (applyCooldownDelay(target, bobaStunDelay(unit), unit) > 0) {
          target.attackSlow = {
            remaining: statusDuration(unit, bobaSlowDuration(unit)),
            pct: bobaAttackSlow(unit),
          };
        }
        const bounceTarget = foes
          .filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe))
          .sort((a, b) => distSq(target, a) - distSq(target, b))[0];
        if (bounceTarget && unit.tier >= 3) {
          if (applyCooldownDelay(bounceTarget, Math.round(bobaStunDelay(unit) * 0.65 * 100) / 100, unit) > 0) {
            bounceTarget.slowed = { remaining: statusDuration(unit, 1.2) };
          }
        }
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    applyDamage(target, unit.atk, unit, battle);
    applyOnAttackItem(unit, target, battle, foes);
    if (unit.ability === "taunt_guard") {
      unit.taunt = { remaining: tauntDuration(unit) };
      const shielded = grantShield(unit, supportAmount(unit, tauntGuardShield(unit)), { noShare: true });
      if (shielded > 0) burst({ x: unit.x, y: unit.y }, "#d99043");
    }
    if (unit.ability === "guard") {
      const friend = lowestShieldedAlly(allies);
      if (friend) {
        const shielded = grantShield(friend, supportAmount(unit, guardShield(unit)));
        applySupportItem(unit, friend);
        if (shielded > 0 && friend.uid !== unit.uid) emitSupportProjectile(unit, friend, battle, "#6fbf8f");
        burst({ x: friend.x, y: friend.y }, "#6fbf8f");
      }
    }
  }

  function applyOnAttackItem(unit, target, battle, foes = []) {
    if (!unit?.item || unit.dead) return;
    unit.itemAttackCount = (unit.itemAttackCount || 0) + 1;
    if (unit.item.onAttackShieldPct) {
      grantShield(unit, window.FoodAnimalsBattleItemRuntime.onAttackShield(unit));
      burst({ x: unit.x, y: unit.y }, unit.item.accent || "#6fbf8f");
    }
    if (window.FoodAnimalsBattleItemRuntime.selfHealReady(unit)) {
      healUnit(unit, window.FoodAnimalsBattleItemRuntime.selfHealAmount(unit));
      burst({ x: unit.x, y: unit.y }, unit.item.accent || "#4f8d2b");
    }
    if (target && battle && unit.item.splashDamagePct) {
      const splash = Math.max(1, Math.round(unit.atk * unit.item.splashDamagePct));
      window.FoodAnimalsBattleItemRuntime.splashTargets(target, foes)
        .forEach((foe) => applyDamage(foe, splash, unit, battle, {
          color: unit.item.accent || "#c03b87",
          particleType: unit.item.id,
          status: true,
        }));
    }
    if (target && battle && unit.item.bounceDamagePct) {
      const bounceTarget = window.FoodAnimalsBattleItemRuntime.nearestBounceTarget(target, foes, distSq);
      if (bounceTarget) {
        applyDamage(bounceTarget, Math.max(1, Math.round(unit.atk * unit.item.bounceDamagePct)), unit, battle, {
          color: unit.item.accent || "#c06417",
          particleType: unit.item.id,
          status: true,
        });
      }
    }
    if (target && battle && unit.item.pierceDamagePct) {
      const pierceTarget = window.FoodAnimalsBattleItemRuntime.pierceTarget(target, foes);
      if (pierceTarget) {
        applyDamage(pierceTarget, Math.max(1, Math.round(unit.atk * unit.item.pierceDamagePct)), unit, battle, {
          color: unit.item.accent || "#8c4e1d",
          particleType: unit.item.id,
          status: true,
        });
      }
    }
    if (target && battle && window.FoodAnimalsBattleItemRuntime.executeSplashReady(unit, target)) {
      const splash = Math.max(1, Math.round(unit.atk * unit.item.executeSplashDamagePct));
      window.FoodAnimalsBattleItemRuntime.splashTargets(target, foes)
        .forEach((foe) => applyDamage(foe, splash, unit, battle, {
          color: unit.item.accent || "#ffe37a",
          particleType: unit.item.id,
          status: true,
        }));
      burst({ x: target.x, y: target.y }, unit.item.accent || "#ffe37a");
    }
    if (target && !target.dead && unit.item.burnDamagePct) {
      target.burn = {
        remaining: statusDuration(unit, unit.item.burnDuration || 3),
        tick: 1,
        damage: Math.max(1, Math.round(unit.atk * unit.item.burnDamagePct)),
        source: unit,
      };
    }
    if (target && !target.dead && unit.item.markDamagePct) {
      target.mark = {
        sourceUid: unit.uid,
        remaining: statusDuration(unit, unit.item.markDuration || 4),
        damagePct: unit.item.markDamagePct,
      };
    }
    if (target && !target.dead && unit.item.teamVulnerabilityPct) {
      target.teamVulnerable = {
        remaining: statusDuration(unit, unit.item.teamVulnerabilityDuration || 4),
        pct: unit.item.teamVulnerabilityPct,
      };
    }
    if (target && !target.dead && unit.item.cooldownDelay) {
      if (applyCooldownDelay(target, unit.item.cooldownDelay, unit) > 0) {
        target.slowed = { remaining: statusDuration(unit, 1.2) };
      }
    }
    if (target && !target.dead && unit.item.attackSlowPct) {
      target.attackSlow = {
        remaining: statusDuration(unit, unit.item.attackSlowDuration || 3),
        pct: unit.item.attackSlowPct,
      };
    }
    if (target && !target.dead && unit.item.antiSupportPct) {
      target.antiSupport = {
        remaining: statusDuration(unit, unit.item.antiSupportDuration || 4),
        reductionPct: unit.item.antiSupportPct,
      };
    }
  }

  function triggerLowHpBurn(unit, battle, options = {}) {
    if (!options.force && !window.FoodAnimalsBattleItemRuntime.lowHpBurnReady(unit)) return;
    if (options.force && (!unit?.item?.lowHpBurnDamagePct || unit.dead || unit.hp / unit.maxHp > (unit.item.lowHpBurnThreshold || 0.4))) return;
    unit.lowHpBurnUsed = true;
    if (unit.item.lowHpBurnInterval) unit.lowHpBurnTick = unit.item.lowHpBurnInterval;
    const foes = window.FoodAnimalsBattleItemRuntime.splashTargets(unit, unit.side === "ally" ? battle.enemies : battle.allies);
    foes.forEach((foe) => {
      foe.burn = {
        remaining: statusDuration(unit, unit.item.lowHpBurnDuration || 3),
        tick: 1,
        damage: Math.max(1, Math.round(unit.atk * unit.item.lowHpBurnDamagePct)),
        source: unit,
      };
    });
    burst({ x: unit.x, y: unit.y }, unit.item.accent || "#7aa530");
  }

  function statusDuration(source, duration) {
    return window.FoodAnimalsStatusRuntime.duration(source, duration, {
      favoriteBonusPct: favoriteToppingBonusPct(source),
      arenaBonus: arenaStatusDurationBonus(source),
    });
  }

  function cooldownDelayResistance(unit) {
    return window.FoodAnimalsStatusRuntime.cooldownDelayResistance(unit, {
      freshStage: activeTraitStage(unit, "fresh"),
    });
  }

  function applyCooldownDelay(target, amount, source = null, options = {}) {
    if (!target || target.dead || amount <= 0) return 0;
    if (!options.noCleanse && target.item?.firstDebuffCleanseHealPct && !target.firstDebuffCleanseUsed) {
      target.firstDebuffCleanseUsed = true;
      cleanseUnit(target);
      healUnit(target, Math.max(1, Math.round(target.maxHp * target.item.firstDebuffCleanseHealPct)));
      burst({ x: target.x, y: target.y }, target.item.accent || "#2e6f2b");
      return 0;
    }
    const applied = window.FoodAnimalsStatusRuntime.appliedCooldownDelay(amount, cooldownDelayResistance(target));
    target.cooldown += applied;
    if (applied > 0) {
      recordCombatEvent(state.battle, {
        type: "control",
        kind: "cooldownDelay",
        source,
        target,
        amount: applied,
      });
      playGameSfx("control", { volume: 0.38 });
    }
    return applied;
  }

  function applyBattleStartTraitEffects(units, foes = []) {
    const breakfastStage = traitStageForUnits(units, "breakfast");
    if (breakfastStage > 0) {
      units
        .filter((unit) => !unit.dead)
        .forEach((unit) => {
          grantShield(unit, Math.max(2, Math.round(unit.maxHp * (breakfastStage >= 2 ? 0.09 : 0.055))), { noShare: true });
          if (breakfastStage >= 2 && unitHasTrait(unit, "breakfast")) {
            unit.haste = { remaining: 2.5, pct: 0.1 };
          }
          burst({ x: unit.x, y: unit.y }, traitInfo("breakfast").color);
        });
    }

    const oceanStage = traitStageForUnits(units, "ocean");
    if (oceanStage > 0) {
      const delay = oceanStage >= 2 ? 0.3 : 0.14;
      foes
        .filter((foe) => !foe.dead)
        .forEach((foe) => {
          if (applyCooldownDelay(foe, delay) > 0) {
            foe.slowed = { remaining: oceanStage >= 2 ? 2 : 1.2 };
          }
          burst({ x: foe.x, y: foe.y }, traitInfo("ocean").color);
        });
    }

    const freshStage = traitStageForUnits(units, "fresh");
    if (freshStage > 0) {
      units
        .filter((unit) => !unit.dead && unitHasTrait(unit, "fresh"))
        .forEach((unit) => {
          if (freshStage >= 2 && hasNegativeStatus(unit)) cleanseUnit(unit);
          if (freshStage >= 3) {
            grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.08)), { noShare: true });
          }
          burst({ x: unit.x, y: unit.y }, traitInfo("fresh").color);
        });
    }
  }

  function applyBattleStartAbilities(units, foes = []) {
    units
      .filter((unit) => unit.ability === "taunt_guard")
      .forEach((unit) => {
        unit.taunt = { remaining: tauntDuration(unit) + 0.8 };
        const shielded = grantShield(unit, supportAmount(unit, Math.round(tauntGuardShield(unit) * 1.15)), { noShare: true });
        if (shielded > 0) {
          triggerCombatSupportMotion(unit, unit, state.battle);
          burst({ x: unit.x, y: unit.y }, "#d99043");
        }
      });
    units
      .filter((unit) => unit.ability === "syrup_start")
      .forEach((unit) => {
        let supportTarget = null;
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, syrupShield(unit)));
            ally.haste = { remaining: 2, pct: syrupHaste(unit) };
            applySupportItem(unit, ally);
            if (shielded > 0 || ally.uid === unit.uid) supportTarget = ally;
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, "#e8b765");
          });
        if (supportTarget) triggerCombatSupportMotion(unit, supportTarget, state.battle);
        burst({ x: unit.x, y: unit.y }, "#e8b765");
      });
    units
      .filter((unit) => unit.ability === "bagel_build")
      .forEach((unit) => {
        let supportTarget = null;
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, Math.round(bagelBuildShield(unit) * 0.85)));
            ally.haste = { remaining: 2, pct: bagelBuildHaste(unit) };
            applySupportItem(unit, ally);
            if (shielded > 0 || ally.uid === unit.uid) supportTarget = ally;
          });
        if (supportTarget) triggerCombatSupportMotion(unit, supportTarget, state.battle);
        burst({ x: unit.x, y: unit.y }, "#f0d56b");
      });
    units
      .filter((unit) => unit.ability === "row_shield")
      .forEach((unit) => {
        let supportTarget = null;
        units
          .filter((ally) => !ally.dead && ally.row === unit.row)
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, Math.round(dumplingRowShield(unit) * 0.8)));
            applySupportItem(unit, ally);
            if (shielded > 0 || ally.uid === unit.uid) supportTarget = ally;
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, "#f0dcb8");
          });
        if (supportTarget) triggerCombatSupportMotion(unit, supportTarget, state.battle);
        burst({ x: unit.x, y: unit.y }, "#f0dcb8");
      });
    units
      .filter((unit) => unit.ability === "formation_captain")
      .forEach((unit) => {
        let supportTarget = null;
        formationAllies(unit, units).forEach((ally) => {
          const shielded = grantShield(ally, supportAmount(unit, Math.round(formationShield(unit) * 1.2)));
          ally.attackBoost = { remaining: formationBuffDuration(unit), pct: formationAttackBoost(unit) };
          applySupportItem(unit, ally);
          if (shielded > 0 || ally.uid === unit.uid) supportTarget = ally;
          if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, "#d84a3a");
        });
        if (supportTarget) triggerCombatSupportMotion(unit, supportTarget, state.battle);
        burst({ x: unit.x, y: unit.y }, "#6fae48");
      });
    units
      .filter((unit) => unit.ability === "survive_scale" && unit.tier >= 2 && (unit.permanentHpBonus || 0) > 0)
      .forEach((unit) => {
        let supportTarget = null;
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, mochiAdjacentShield(unit)));
            applySupportItem(unit, ally);
            if (shielded > 0 || ally.uid === unit.uid) supportTarget = ally;
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, unit.accent);
          });
        if (supportTarget) triggerCombatSupportMotion(unit, supportTarget, state.battle);
        burst({ x: unit.x, y: unit.y }, unit.accent);
      });
    units
      .filter((unit) => unit.ability === "pull_start")
      .forEach((unit) => applyKrakenPull(unit, foes));
    units
      .filter((unit) => unit.ability === "iceberg_lock")
      .forEach((unit) => {
        const targets = foes
          .filter((foe) => !foe.dead && foe.col === FRONT_COL)
          .sort((a, b) => distSq(unit, a) - distSq(unit, b))
          .slice(0, unit.tier >= 3 ? 2 : 1);
        targets.forEach((foe) => {
          if (applyCooldownDelay(foe, oysterLockDelay(unit), unit) > 0) {
            foe.slowed = { remaining: statusDuration(unit, 1.8) };
          }
          burst({ x: foe.x, y: foe.y }, "#7ec7e8");
        });
        const shielded = grantShield(unit, supportAmount(unit, oysterLockShield(unit)), { noShare: true });
        if (shielded > 0 || targets.length) triggerCombatSupportMotion(unit, targets[0] || unit, state.battle);
        burst({ x: unit.x, y: unit.y }, "#d8f2ff");
      });
    units
      .filter((unit) => unit.ability === "ginger_decoy")
      .forEach((unit) => {
        const decoy = makeGingerDecoy(unit);
        units.push(decoy);
        emitSupportProjectile(unit, decoy, state.battle, "#f5f0df");
        burst({ x: unit.x, y: unit.y }, "#f5f0df");
      });
  }

  function applyKrakenPull(unit, foes) {
    const target = foes
      .filter((foe) => !foe.dead && foe.col === BACK_COL && !isFinalBossUnitType(foe.typeId) && !isGiraffeBossUnitType(foe.typeId))
      .sort((a, b) => (a.col - b.col) || distSq(unit, b) - distSq(unit, a))[0];
    if (!target) return;
    const nextCol = Math.min(FRONT_COL, (target.col ?? BACK_COL) + 1);
    const newSlot = (target.row ?? 0) * BOARD_COLS + nextCol;
    if (battleSlotOccupied(foes, target.side, newSlot, target.uid)) return;
    positionBattleUnit(target, target.side, newSlot);
    if (applyCooldownDelay(target, krakenPullDelay(unit), unit) > 0) {
      target.slowed = { remaining: statusDuration(unit, 1.6) };
    }
    if (state.battle) applyDamage(target, krakenPullDamage(unit), unit, state.battle, { color: unit.accent, particleType: unit.typeId, status: true });
    burst({ x: target.x, y: target.y }, unit.accent);
  }

  function makeGingerDecoy(source) {
    return {
      ...makeUnit("toast_tortoise", 1),
      uid: unitSeq++,
      typeId: source.typeId,
      lineName: "Gingerbread Decoy",
      name: "Ginger Decoy",
      short: "Decoy",
      tier: 1,
      rarity: source.rarity,
      color: source.color,
      accent: source.accent,
      ability: "ginger_decoy_summon",
      abilityText: "Crumble decoy",
      role: "Decoy",
      maxHp: gingerDecoyHp(source),
      hp: gingerDecoyHp(source),
      atk: 0,
      speed: 99,
      abilityPower: 0,
      item: null,
      shield: 0,
      cooldown: 999,
      side: source.side,
      slot: source.slot,
      col: source.col,
      row: source.row,
      x: source.x + (source.side === "ally" ? -30 : 30),
      y: source.y + 26,
      dead: false,
      ignoreTraits: true,
      decoySourceUid: source.uid,
      crumbleDamage: gingerCrumbleDamage(source),
    };
  }

  function supportAmount(unit, amount) {
    const sweetStage = activeTraitStage(unit, "sweet");
    const sweetBonus = [0, 0.12, 0.22, 0.32][sweetStage] || 0;
    const freshStage = activeTraitStage(unit, "fresh");
    const freshBonus = [0, 0.08, 0.14, 0.2][freshStage] || 0;
    return Math.max(1, Math.round(amount * (1 + (unit?.item?.supportBonusPct || 0) + sweetBonus + freshBonus + favoriteToppingBonusPct(unit)) * arenaSupportMultiplier(unit)));
  }

  function applySupportItem(source, ally) {
    if (!source?.item || !ally || ally.dead) return;
    if (source.item.supportHastePct) {
      ally.haste = {
        remaining: source.item.supportHasteDuration || 3,
        pct: source.item.supportHastePct + (source.ability === "heal" ? 0.06 : 0),
      };
      burst({ x: ally.x, y: ally.y }, source.item.accent || "#b56b12");
    }
    if (source.item.supportAttackBuffPct) {
      ally.attackBoost = {
        remaining: source.item.supportAttackBuffDuration || 3,
        pct: source.item.supportAttackBuffPct,
      };
      burst({ x: ally.x, y: ally.y }, source.item.accent || "#d7a64e");
    }
    if (source.item.supportRowEchoPct && state.battle) {
      const allies = (source.side === "enemy" ? state.battle.enemies : state.battle.allies).filter((unit) => !unit.dead);
      const echoShield = Math.max(1, Math.round(source.abilityPower * source.item.supportRowEchoPct));
      allies
        .filter((rowAlly) => rowAlly.uid !== ally.uid && rowAlly.row === ally.row)
        .forEach((rowAlly) => {
          const shielded = grantShield(rowAlly, echoShield, { noShare: true });
          if (shielded > 0) emitSupportFeedback(source, rowAlly, state.battle, source.item.accent || "#f2c94c");
        });
    }
  }

  function applyExtraAdjacentHeal(source, primary, healed, allies) {
    if (!source?.item?.extraAdjacentHealPct || healed <= 0) return;
    const target = allies
      .filter((ally) => ally.uid !== primary.uid && !ally.dead && ally.hp < ally.maxHp && isAdjacentSlot(primary, ally))
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (!target) return;
    const applied = healUnit(target, Math.max(1, Math.round(healed * source.item.extraAdjacentHealPct)));
    applySupportItem(source, target);
    if (applied > 0) emitSupportFeedback(source, target, state.battle, source.item.accent || "#7a5635");
  }

  function isAdjacentSlot(a, b) {
    return window.FoodAnimalsBattleItemRuntime.adjacent(a, b);
  }

  function hasNegativeStatus(unit) {
    return Boolean(unit?.burn || unit?.mark || unit?.teamVulnerable || unit?.antiSupport || unit?.slowed || unit?.attackSlow);
  }

  function statusCount(unit) {
    return [unit?.burn, unit?.mark, unit?.teamVulnerable, unit?.antiSupport, unit?.slowed, unit?.attackSlow].filter(Boolean).length;
  }

  function mostStatusedAlly(units) {
    const candidates = units.filter((unit) => !unit.dead && hasNegativeStatus(unit));
    if (!candidates.length) return null;
    return candidates.reduce((best, next) => {
      const score = statusCount(next);
      const bestScore = statusCount(best);
      if (score !== bestScore) return score > bestScore ? next : best;
      return next.hp / next.maxHp < best.hp / best.maxHp ? next : best;
    }, candidates[0]);
  }

  function cleanseUnit(unit) {
    unit.burn = null;
    unit.mark = null;
    unit.teamVulnerable = null;
    unit.antiSupport = null;
    unit.slowed = null;
    unit.attackSlow = null;
  }

  function clearCombatStatusVisuals(unit) {
    if (!unit) return;
    unit.burn = null;
    unit.mark = null;
    unit.teamVulnerable = null;
    unit.taunt = null;
    unit.haste = null;
    unit.attackBoost = null;
    unit.attackSlow = null;
    unit.antiSupport = null;
    unit.slowed = null;
    unit.lateFightStacks = 0;
    unit.moldStacks = 0;
  }

  function clearBattleStatusVisuals(battle) {
    if (!battle) return;
    [...(battle.allies || []), ...(battle.enemies || [])].forEach(clearCombatStatusVisuals);
  }

  function triggerCombatAttackMotion(source, target, battle, options = {}) {
    if (!source || !target || !battle || source.dead || options.status) return;
    if (source.uid === target.uid || (source.side && target.side && source.side === target.side)) return;
    source.attackMotion = {
      start: battle.elapsed || 0,
      duration: COMBAT_ATTACK_MOTION_SECONDS,
      targetX: target.x,
      targetY: target.y,
    };
  }

  function triggerCombatSupportMotion(source, target, battle, options = {}) {
    if (!source || !battle || source.dead) return;
    const targetX = Number.isFinite(options.targetX) ? options.targetX : target?.x ?? source.x;
    const targetY = Number.isFinite(options.targetY) ? options.targetY : target?.y ?? source.y;
    source.supportMotion = {
      start: battle.elapsed || 0,
      duration: options.duration || COMBAT_SUPPORT_MOTION_SECONDS,
      targetX,
      targetY,
    };
  }

  function triggerCombatHitMotion(target, source, battle, hpDamage, shieldDamage = 0) {
    if (!target || !battle || target.dead) return;
    const totalImpact = Math.max(0, hpDamage || 0) + Math.max(0, shieldDamage || 0);
    if (totalImpact <= 0) return;
    const maxHp = Math.max(1, target.maxHp || 1);
    target.hitMotion = {
      start: battle.elapsed || 0,
      duration: COMBAT_HIT_MOTION_SECONDS,
      sourceX: source?.x,
      sourceY: source?.y,
      strength: clamp(0.72 + totalImpact / maxHp, 0.72, 1.35),
      shieldOnly: hpDamage <= 0 && shieldDamage > 0,
    };
    if (target.glitchToRobot || isGiraffeBossUnitType(target.typeId)) {
      target.giraffeHitGlitchUntil = Math.max(
        target.giraffeHitGlitchUntil || 0,
        (battle.elapsed || 0) + GIRAFFE_BOSS_HIT_GLITCH_SECONDS
      );
      target.giraffeHitGlitchSeed = Math.floor((battle.elapsed || 0) * 60) + (source?.uid || 0) * 23 + totalImpact * 7;
    }
    if (isFinalBossUnitType(target.typeId)) {
      target.finalBossHitGlitchUntil = Math.max(
        target.finalBossHitGlitchUntil || 0,
        (battle.elapsed || 0) + FINAL_BOSS_HIT_GLITCH_SECONDS
      );
      target.finalBossHitGlitchSeed = Math.floor((battle.elapsed || 0) * 72) + (source?.uid || 0) * 29 + totalImpact * 11;
      if (target.typeId === FINAL_BOSS_TYPE_ID) recordFinalBossEchoFragment(battle);
    }
  }

  function makeAttackProjectile(source, target, options = {}) {
    const sourceSide = source.side || "ally";
    const spinDirection = sourceSide === "enemy" ? -1 : 1;
    return {
      from: source.uid,
      to: target.uid,
      sourceSide,
      t: ATTACK_ANIMATION_SECONDS,
      duration: ATTACK_ANIMATION_SECONDS,
      color: options.color || source.accent,
      particleType: options.particleType || source.typeId || source.id,
      particleTier: options.particleTier || 1,
      particleSprite: options.particleSprite,
      kind: options.kind,
      rotationStart: options.rotationStart ?? 0,
      spin: spinDirection * (ATTACK_PROJECTILE_SPIN_MIN + random() * (ATTACK_PROJECTILE_SPIN_MAX - ATTACK_PROJECTILE_SPIN_MIN)),
    };
  }

  function applyDamage(target, amount, source, battle, options = {}) {
    if (!target || target.dead) return 0;
    triggerCombatAttackMotion(source, target, battle, options);
    if (!options.status && !options.noItemTriggers && target.item?.firstHitRedirect && !target.firstHitRedirectUsed) {
      target.firstHitRedirectUsed = true;
      battle.attacks.push(makeAttackProjectile(source, target, {
        color: target.item.accent || "#6f9231",
        particleType: target.item.id,
      }));
      burst({ x: target.x, y: target.y }, target.item.accent || "#6f9231");
      return 0;
    }
    let adjustedAmount = amount;
    if (!options.status && target.mark?.sourceUid === source?.uid) {
      adjustedAmount *= 1 + (target.mark.damagePct || 0);
    }
    if (!options.status && target.teamVulnerable?.pct) {
      adjustedAmount *= 1 + target.teamVulnerable.pct;
    }
    if (!options.status && source?.attackBoost?.pct) {
      adjustedAmount *= 1 + source.attackBoost.pct;
    }
    if (!options.status && hasFavoriteTopping(source)) {
      adjustedAmount *= 1.06;
    }
    const spicyStage = !options.status ? activeTraitStage(source, "spicy") : 0;
    if (spicyStage > 0) {
      adjustedAmount *= 1 + (spicyStage >= 2 ? 0.16 : 0.08);
    }
    const snackStage = !options.status ? activeTraitStage(source, "snack") : 0;
    if (snackStage > 0 && (source.snackTraitHits || 0) < 3) {
      adjustedAmount *= 1 + (snackStage >= 2 ? 0.22 : 0.12);
      source.snackTraitHits = (source.snackTraitHits || 0) + 1;
    }
    if (!options.status && source?.item?.firstAttacksBonusPct && (source.itemAttackCount || 0) < (source.item.firstAttacksCount || 3)) {
      adjustedAmount *= 1 + source.item.firstAttacksBonusPct;
    }
    if (!options.status && source?.item?.lateFightDamagePct && source.lateFightStacks > 0) {
      adjustedAmount *= 1 + source.item.lateFightDamagePct * source.lateFightStacks;
    }
    if (!options.status && source?.item?.shieldedAttackBonusPct && source.shield > 0) {
      adjustedAmount *= 1 + source.item.shieldedAttackBonusPct;
    }
    if (!options.status && source?.item?.shieldedTargetDamagePct && target.shield > 0) {
      adjustedAmount *= 1 + source.item.shieldedTargetDamagePct;
    }
    if (!options.status && source?.item?.executeSplashBonusPct && target.hp / target.maxHp <= (source.item.executeSplashThreshold || 0.45)) {
      adjustedAmount *= 1 + source.item.executeSplashBonusPct;
    }
    if (!options.status && target.item?.frontRowDamageReductionPct && target.col === FRONT_COL) {
      adjustedAmount *= 1 - target.item.frontRowDamageReductionPct;
    }
    if (options.status && target.item?.statusDamageReductionPct) {
      adjustedAmount *= 1 - target.item.statusDamageReductionPct;
    }
    if (!options.status && target.item?.damageTakenPct) {
      adjustedAmount *= 1 + target.item.damageTakenPct;
    }
    adjustedAmount *= arenaDamageMultiplier(source, target, options);
    let damage = Math.max(1, Math.round(adjustedAmount));
    let absorbed = 0;
    if (target.shield > 0) {
      absorbed = Math.min(target.shield, damage);
      target.shield -= absorbed;
      damage -= absorbed;
    }
    if (damage > 0) target.hp = Math.max(0, target.hp - damage);
    recordCombatDamage(battle, source, target, damage, absorbed);
    triggerCombatHitMotion(target, source, battle, damage, absorbed);
    if (
      absorbed > 0 &&
      !options.status &&
      !options.noItemTriggers &&
      target.hp > 0 &&
      target.item?.shieldCrackleDamagePct &&
      source?.uid &&
      !source.dead &&
      source.side !== target.side
    ) {
      const crackleDamage = shieldCrackleDamage(target);
      applyDamage(source, crackleDamage, target, battle, {
        status: true,
        noItemTriggers: true,
        color: target.item.accent || "#f2b36d",
      });
    }
    if (
      (damage > 0 || absorbed > 0) &&
      !options.status &&
      !options.noItemTriggers &&
      target.ability === "thorns" &&
      source?.uid &&
      !source.dead &&
      source.side !== target.side
    ) {
      applyDamage(source, thornDamage(target), target, battle, {
        status: true,
        noItemTriggers: true,
        color: target.accent || "#6f4b2f",
      });
      burst({ x: target.x, y: target.y }, target.accent || "#6f4b2f");
    }
    if (
      target.hp <= 0 &&
      !target.dead &&
      !options.noDeathSave &&
      target.item?.deathSaveShieldPct &&
      !target.deathSaveUsed
    ) {
      target.deathSaveUsed = true;
      target.hp = 1;
      grantShield(target, Math.max(1, Math.round(target.maxHp * target.item.deathSaveShieldPct)), { noShare: true });
      burst({ x: target.x, y: target.y }, target.item.accent || "#d6b88a");
    }
    if (
      damage > 0 &&
      !options.status &&
      source?.item?.lowHpLifestealPct &&
      source.hp / source.maxHp <= (source.item.lowHpThreshold || 0.5)
    ) {
      const healed = healUnit(source, Math.max(1, Math.round(damage * source.item.lowHpLifestealPct)));
      if (healed > 0) burst({ x: source.x, y: source.y }, source.item.accent || "#4f8d2b");
    }
    if (damage > 0 && target.item?.onHitShieldPct && !target.dead) {
      const shield = Math.max(1, Math.round(target.maxHp * target.item.onHitShieldPct + target.abilityPower * 0.14));
      grantShield(target, shield);
      burst({ x: target.x, y: target.y }, target.item.accent || "#8f3f20");
    }
    if (damage > 0 && !options.status) {
      if (spicyStage >= 2 && source && !target.dead) {
        target.burn = {
          remaining: statusDuration(source, 2.4),
          tick: 1,
          damage: Math.max(1, Math.round(source.atk * 0.16)),
          source,
        };
      }
      triggerLowHpBurn(target, battle);
    }
    if (damage > 0 && target.ability === "ginger_decoy_summon" && !target.dead) {
      target.hp = Math.max(0, target.hp - gingerDecoyCrumbleOnHit(target));
    }
    if (!options.noProjectile) {
      battle.attacks.push(makeAttackProjectile(source, target, {
        color: options.color || source.accent,
        particleType: options.particleType || source.typeId || source.id,
      }));
    }
    const attackParticleType = options.particleType || source.typeId || source.id;
    const willDefeat = target.hp <= 0 && !target.dead;
    if (!options.status && (damage > 0 || absorbed > 0) && !willDefeat) {
      foodExplosion({ x: target.x, y: target.y }, options.color || source.accent, attackParticleType, {
        count: 10,
        spread: 14,
      });
    }
    if (willDefeat) {
      target.dead = true;
      target.shield = 0;
      recordCombatKo(battle, source, target);
      if (target.ability === "ginger_decoy_summon" && target.crumbleDamage && battle) {
        const foes = (target.side === "ally" ? battle.enemies : battle.allies).filter((foe) => !foe.dead && isAdjacentSlot(target, foe));
        foes.forEach((foe) => applyDamage(foe, target.crumbleDamage, target, battle, {
          color: target.accent,
          particleType: "gingerbread_golem",
          status: true,
          noItemTriggers: true,
        }));
      }
      defeatExplosion(target);
    }
    return damage;
  }

  function emitSupportProjectile(source, target, battle, color = "#55a375") {
    if (!source || !target || !battle || source.dead || target.dead) return;
    triggerCombatSupportMotion(source, target, battle);
    battle.attacks.push(makeAttackProjectile(source, target, {
      color,
      particleType: source.typeId || source.id,
      kind: "support",
    }));
  }

  function emitSupportFeedback(source, target, battle, color = "#55a375", options = {}) {
    if (!source || !target || !battle || source.dead || target.dead) return;
    if (source.uid === target.uid) {
      triggerCombatSupportMotion(source, target, battle);
    } else {
      emitSupportProjectile(source, target, battle, color);
    }
    if (options.burst !== false) burst({ x: target.x, y: target.y }, color);
  }

  function healUnit(unit, amount, options = {}) {
    const reduction = unit.antiSupport?.reductionPct || 0;
    const before = unit.hp;
    const adjusted = Math.max(1, Math.round(amount * (1 - reduction)));
    unit.hp = Math.min(unit.maxHp, unit.hp + adjusted);
    const applied = unit.hp - before;
    if (applied > 0) recordCombatSupport(unit, applied, "heal", options.source || null);
    const overheal = Math.max(0, before + adjusted - unit.maxHp);
    if (overheal > 0 && unit.item?.overhealShieldPct) {
      const shielded = grantShield(unit, Math.max(1, Math.round(overheal * unit.item.overhealShieldPct)), { noShare: true });
      if (shielded > 0 && state.battle) emitSupportFeedback(unit, unit, state.battle, unit.item.accent || "#63b7d6");
    }
    if (overheal > 0 && unit.item?.teamOverhealShieldPct && state.battle) {
      const allies = unit.side === "enemy" ? state.battle.enemies : state.battle.allies;
      const shield = Math.max(1, Math.round(overheal * unit.item.teamOverhealShieldPct));
      allies
        .filter((ally) => ally.uid !== unit.uid && !ally.dead && isAdjacentSlot(unit, ally))
        .forEach((ally) => {
          const shielded = grantShield(ally, shield, { noShare: true });
          if (shielded > 0) emitSupportFeedback(unit, ally, state.battle, unit.item.accent || "#63b7d6");
        });
    }
    if (applied > 0 && !options.noShare) shareReceivedSupport(unit, applied, "heal");
    return applied;
  }

  function grantShield(unit, amount, options = {}) {
    const cap = Math.round(unit.maxHp * (0.5 + (unit.item?.shieldCapBonusPct || 0)));
    const reduction = unit.antiSupport?.reductionPct || 0;
    const before = unit.shield || 0;
    unit.shield = Math.min(cap, before + Math.max(1, Math.round(amount * (1 - reduction))));
    const applied = unit.shield - before;
    if (applied > 0) recordCombatSupport(unit, applied, "shield", options.source || null);
    if (applied > 0 && !options.noShare) shareReceivedSupport(unit, applied, "shield");
    return applied;
  }

  function shareReceivedSupport(unit, amount, kind) {
    if (!unit?.item?.receivedSupportSharePct || amount <= 0 || !state.battle) return;
    const allies = unit.side === "enemy" ? state.battle.enemies : state.battle.allies;
    const share = Math.max(1, Math.round(amount * unit.item.receivedSupportSharePct));
    allies
      .filter((ally) => ally.uid !== unit.uid && !ally.dead && isAdjacentSlot(unit, ally))
      .forEach((ally) => {
        const applied = kind === "heal"
          ? healUnit(ally, share, { noShare: true, source: unit })
          : kind === "shield"
          ? grantShield(ally, share, { noShare: true, source: unit })
          : 0;
        if (applied > 0) emitSupportFeedback(unit, ally, state.battle, unit.item.accent || "#2b2b25");
      });
  }

  function guardShield(unit) {
    return Math.round(unit.maxHp * 0.1 + unit.abilityPower * 1.25);
  }

  function tauntGuardShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.12 + unit.abilityPower * 0.85));
  }

  function tauntDuration(unit) {
    return Number(Math.min(3.8, 1.8 + unit.tier * 0.35).toFixed(1));
  }

  function thornDamage(unit) {
    return Math.max(1, Math.round(unit.maxHp * 0.045 + unit.abilityPower * 0.45));
  }

  function shieldBreakSteal(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 1.1 + unit.atk * 0.25));
  }

  function shieldBreakBonus(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.75));
  }

  function formationShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.06 + unit.abilityPower * 0.72));
  }

  function formationAttackBoost(unit) {
    return Number(Math.min(0.22, 0.08 + unit.abilityPower * 0.004).toFixed(2));
  }

  function formationBuffDuration(unit) {
    return Number(Math.min(4, 2.4 + unit.tier * 0.3).toFixed(1));
  }

  function formationAllies(unit, allies) {
    return allies
      .filter((ally) => !ally.dead && (ally.uid === unit.uid || ally.row === unit.row || ally.col === unit.col))
      .slice(0, unit.tier >= 3 ? 5 : 4);
  }

  function syrupShield(unit) {
    return Math.round(unit.maxHp * 0.1 + unit.abilityPower * 1.1);
  }

  function syrupHaste(unit) {
    return Number(Math.min(0.18, 0.1 + unit.abilityPower * 0.004).toFixed(2));
  }

  function syrupPulseInterval(unit) {
    return Math.max(5.2, 7.2 - unit.tier * 0.35);
  }

  function syrupPulseShield(unit) {
    return Math.max(2, Math.round(syrupShield(unit) * 0.42));
  }

  function syrupPulseHaste(unit) {
    return Number(Math.max(0.05, syrupHaste(unit) * 0.55).toFixed(2));
  }

  function executeBonus(unit) {
    return Math.round(unit.abilityPower * 1.35);
  }

  function pretzelDelay(unit) {
    return Number(Math.min(0.62, 0.16 + unit.abilityPower * 0.01).toFixed(2));
  }

  function armorBreakBonus(unit) {
    return Math.round(unit.abilityPower * 1.05);
  }

  function cleaveDamage(unit) {
    return Math.max(1, Math.round(unit.atk * (0.42 + unit.tier * 0.07)));
  }

  function volleyDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.75));
  }

  function healAmount(unit) {
    return Math.round(unit.atk * 0.85 + unit.abilityPower * 1.2);
  }

  function noodleFallbackShield(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 1.05 + unit.maxHp * 0.04));
  }

  function pepperPokeBonus(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.62));
  }

  function pepperBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.14 + unit.abilityPower * 0.2));
  }

  function pepperBurnDuration(unit) {
    return Number(Math.min(4.5, 2.2 + unit.tier * 0.3).toFixed(1));
  }

  function bagelBuildShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.07 + unit.abilityPower * 0.95));
  }

  function bagelBuildHaste(unit) {
    return Number(Math.min(0.2, 0.06 + unit.abilityPower * 0.004).toFixed(2));
  }

  function donutTreatGold(unit) {
    return Math.max(8, Math.round(8 + unit.abilityPower * 2));
  }

  function kimchiStatusBonus(unit) {
    return Math.round(unit.abilityPower * 0.9);
  }

  function kimchiBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.18 + unit.abilityPower * 0.28));
  }

  function kimchiBurnDuration(unit) {
    return Number(Math.min(5, 2.5 + unit.tier * 0.35).toFixed(1));
  }

  function kimchiMarkPct(unit) {
    return Number(Math.min(0.24, 0.08 + unit.abilityPower * 0.005).toFixed(2));
  }

  function kimchiMarkDuration(unit) {
    return Number(Math.min(5.5, 3 + unit.tier * 0.4).toFixed(1));
  }

  function waffleLaneDelay(unit) {
    return Number(Math.min(1, 0.22 + unit.abilityPower * 0.018).toFixed(2));
  }

  function popcornMaxStacks(unit) {
    return 4 + unit.tier;
  }

  function popcornStackHaste(unit) {
    return Number(Math.min(0.08, 0.045 + unit.abilityPower * 0.0015).toFixed(3));
  }

  function popcornDamagePerStack(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.18));
  }

  function popcornKernelBonus(unit) {
    return (unit.kernelStacks || 0) * popcornDamagePerStack(unit);
  }

  function yogurtSourPct(unit) {
    return Number(Math.min(0.42, 0.18 + unit.abilityPower * 0.006).toFixed(2));
  }

  function yogurtSourDuration(unit) {
    return Number(Math.min(5, 2.4 + unit.tier * 0.45).toFixed(1));
  }

  function yogurtShieldCrackDamage(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.65));
  }

  function dumplingRowShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.063 + unit.abilityPower * 1.05));
  }

  function lemonCleanseHeal(unit) {
    return Math.max(2, Math.round(unit.atk * 0.7 + unit.abilityPower * 0.8));
  }

  function lemonCleanseShield(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.75));
  }

  function lemonCleanseHaste(unit) {
    return Number(Math.min(0.28, 0.1 + unit.abilityPower * 0.006).toFixed(2));
  }

  function shakshukaBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.2 + unit.abilityPower * 0.3));
  }

  function shakshukaBurnDuration(unit) {
    return Number(Math.min(5, 2.6 + unit.tier * 0.35).toFixed(1));
  }

  function shakshukaSplashDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.48));
  }

  function oysterLockDelay(unit) {
    return Number(Math.min(0.68, 0.14 + unit.abilityPower * 0.009).toFixed(2));
  }

  function oysterLockShield(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.75 + unit.tier * 2));
  }

  function oysterSlowPct(unit) {
    return Number(Math.min(0.16, 0.06 + unit.abilityPower * 0.0025).toFixed(2));
  }

  function krakenPullDelay(unit) {
    return Number(Math.min(0.9, 0.24 + unit.abilityPower * 0.014).toFixed(2));
  }

  function krakenPullDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.45));
  }

  function krakenCombatPullEvery(unit) {
    return unit.tier >= 3 ? 3 : 4;
  }

  function fortuneShopChance(unit) {
    return Number(Math.min(0.3, 0.1 + unit.tier * 0.04).toFixed(2));
  }

  function mochiHpGain(unit) {
    return Math.max(3, Math.round(unit.abilityPower * 0.9 + unit.tier * 2));
  }

  function mochiAdjacentShield(unit) {
    const stored = unit.permanentHpBonus || 0;
    return stored > 0 ? Math.max(2, Math.round(stored * 0.22 + unit.abilityPower * 0.45)) : 0;
  }

  function gingerDecoyHp(unit) {
    return Math.max(5, Math.round(unit.maxHp * (0.18 + unit.tier * 0.03)));
  }

  function gingerCrumbleDamage(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.75));
  }

  function gingerDecoyCrumbleOnHit(unit) {
    return Math.max(1, Math.round(unit.maxHp * 0.12));
  }

  function berryPretzelComboDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.4 + unit.tier));
  }

  function bobaStunEvery(unit) {
    return unit.tier >= 4 ? 2 : 3;
  }

  function bobaStunDelay(unit) {
    return Number(Math.min(1.25, 0.45 + unit.abilityPower * 0.018).toFixed(2));
  }

  function bobaAttackSlow(unit) {
    return Number(Math.min(0.34, 0.16 + unit.abilityPower * 0.005).toFixed(2));
  }

  function bobaSlowDuration(unit) {
    return Number(Math.min(3.4, 1.8 + unit.tier * 0.3).toFixed(1));
  }

  function chooseTarget(unit, foes) {
    return window.FoodAnimalsBattleAbilityRuntime.chooseTarget(unit, foes, { frontCol: FRONT_COL, backCol: BACK_COL });
  }

  function canAttackBackRow(unit) {
    return window.FoodAnimalsBattleAbilityRuntime.canAttackBackRow(unit, BACK_COL);
  }

  function frontmostOccupiedColumn(units) {
    return window.FoodAnimalsBattleAbilityRuntime.frontmostOccupiedColumn(units, BACK_COL);
  }

  function backmostOccupiedColumn(units) {
    return window.FoodAnimalsBattleAbilityRuntime.backmostOccupiedColumn(units, FRONT_COL);
  }

  function nearest(unit, foes) {
    return window.FoodAnimalsBattleAbilityRuntime.nearest(unit, foes);
  }

  function weakest(units) {
    return window.FoodAnimalsBattleAbilityRuntime.weakest(units);
  }

  function weakestDamaged(units) {
    return window.FoodAnimalsBattleAbilityRuntime.weakestDamaged(units);
  }

  function weakestEnemy(units) {
    return window.FoodAnimalsBattleAbilityRuntime.weakestEnemy(units);
  }

  function lowestShieldedAlly(units) {
    return window.FoodAnimalsBattleAbilityRuntime.lowestShieldedAlly(units);
  }

  function distSq(a, b) {
    return window.FoodAnimalsBattleAbilityRuntime.distSq(a, b);
  }

  function clearParticles() {
    window.FoodAnimalsParticleRuntime.clear(state.particles);
  }

  function particleSpriteSrc(spriteKind, particleType, particleTier) {
    return particleSpriteInfo(spriteKind, particleType, particleTier).src;
  }

  function particleSpriteInfo(spriteKind, particleType, particleTier, options = {}) {
    if (!particleType) return { src: null, cacheKind: null };
    if (spriteKind === "drink") return { src: drinkThrowableSpriteSrcFor(particleType), cacheKind: "drink" };
    if (spriteKind === "item") return { src: itemSpriteSrcForId(particleType, particleTier, options), cacheKind: "item" };
    const attackSrc = attackParticleSpriteSrcFor(particleType, options);
    if (attackSrc) return { src: attackSrc, cacheKind: "attack" };
    return { src: itemSpriteSrcForId(particleType, particleTier, options), cacheKind: "item" };
  }

  function burst(pos, color, options = {}) {
    const particleType = options.particleType;
    const particleSprite = options.particleSprite || (options.food ? "attack" : null);
    const particleTier = options.particleTier || 1;
    const spriteInfo = options.imageSrc
      ? { src: options.imageSrc, cacheKind: options.imageCacheKind || particleSprite }
      : particleSpriteInfo(particleSprite, particleType, particleTier, options.spriteOptions || {});
    state.particles.push(...window.FoodAnimalsParticleRuntime.createBurst(pos, color, options, spriteInfo, random));
  }

  function foodExplosion(pos, color, particleType, options = {}) {
    const horror = options.horror ?? realityBroken();
    const speedScale = horror ? HORROR_PARTICLE_SPEED_SCALE : 1;
    const lifeScale = horror ? HORROR_PARTICLE_LIFE_SCALE : 1;
    const spriteOptions = {
      cozy: options.cozy === true,
      horror: options.horror === true,
    };
    if (!spriteOptions.cozy && !spriteOptions.horror) spriteOptions[horror ? "horror" : "cozy"] = true;
    const spriteInfo = particleSpriteInfo("attack", particleType, 1, spriteOptions);
    burst(pos, color, {
      food: true,
      particleSprite: "attack",
      particleType,
      spriteOptions,
      imageSrc: spriteInfo.src,
      imageCacheKind: spriteInfo.cacheKind,
      count: options.count || 11,
      size: options.size,
      spread: options.spread || 16,
      life: options.life,
      lifeScale,
      speedMin: options.speedMin,
      speedMax: options.speedMax,
      speedScale,
      sizeMin: options.sizeMin,
      sizeMax: options.sizeMax,
      suppressFallback: horror,
    });
  }

  function mergeExplosion(pos, entry) {
    if (!pos || !entry) return;
    if (isUnit(entry)) {
      foodExplosion(pos, entry.accent || entry.color, entry.typeId || entry.id, {
        count: 12,
        spread: 18,
        life: 0.68,
        speedMin: 105,
        speedMax: 255,
        sizeMin: 18,
        sizeMax: 30,
      });
      return;
    }
    const color = entry.accent || entry.color || "#f0d56b";
    if (isDrink(entry)) {
      burst(pos, color, {
        food: true,
        particleSprite: "drink",
        particleType: entry.id,
        particleTier: entry.tier,
        count: 10,
        spread: 16,
        life: 0.7,
        speedMin: 95,
        speedMax: 230,
        sizeMin: 20,
        sizeMax: 32,
      });
      return;
    }
    if (isTopping(entry)) {
      burst(pos, color, {
        food: true,
        particleSprite: "item",
        particleType: entry.id,
        particleTier: entry.tier,
        count: 10,
        spread: 15,
        life: 0.66,
        speedMin: 90,
        speedMax: 220,
        sizeMin: 18,
        sizeMax: 28,
      });
      return;
    }
    burst(pos, color);
  }

  function defeatExplosion(unit, particleType) {
    if (!unit) return;
    const type = particleType || unit.typeId || unit.id;
    const horror = realityBroken();
    foodExplosion({ x: unit.x, y: unit.y }, unit.accent, type, {
      cozy: !horror,
      horror,
      count: 30,
      spread: 34,
      size: 38,
      life: 1.02,
      speedMin: 150,
      speedMax: 330,
    });
    if (!realityBroken()) burst({ x: unit.x, y: unit.y }, unit.accent, { count: 12, spread: 22, life: 0.55 });
  }

  function combatEndExplosion(won) {
    const horror = realityBroken();
    const center = {
      x: BATTLE_FIELD.x + BATTLE_FIELD.w * 0.42,
      y: BATTLE_FIELD.y + BATTLE_FIELD.h * 0.46,
    };
    const count = Math.min(360, Math.max(ATTACK_PARTICLE_TYPES.length * 8, 300));
    for (let i = 0; i < count; i++) {
      const particleType = ATTACK_PARTICLE_TYPES[i % ATTACK_PARTICLE_TYPES.length];
      foodExplosion(center, won ? "#f0d56b" : "#d9573c", particleType, {
        count: 1,
        spread: 94,
        life: 1.85 + random() * 0.9,
        speedMin: 300,
        speedMax: 760,
        sizeMin: 54,
        sizeMax: 116,
      });
    }
    if (!horror) {
      burst(center, won ? "#f0d56b" : "#d9573c", { count: 72, spread: 102, life: 1.15, speedMin: 150, speedMax: 340 });
    }

    const sideBursts = [
      { x: 0.18, y: 0.28, count: 48, spread: 48, sizeMin: 28, sizeMax: 58, speedMin: 190, speedMax: 430, life: 1.22, sparkles: 18 },
      { x: 0.76, y: 0.26, count: 66, spread: 58, sizeMin: 34, sizeMax: 76, speedMin: 230, speedMax: 540, life: 1.34, sparkles: 24 },
      { x: 0.28, y: 0.70, count: 56, spread: 54, sizeMin: 24, sizeMax: 62, speedMin: 200, speedMax: 480, life: 1.28, sparkles: 20 },
      { x: 0.67, y: 0.68, count: 82, spread: 66, sizeMin: 44, sizeMax: 92, speedMin: 250, speedMax: 620, life: 1.46, sparkles: 30 },
      { x: 0.51, y: 0.18, count: 42, spread: 42, sizeMin: 22, sizeMax: 50, speedMin: 170, speedMax: 390, life: 1.15, sparkles: 16 },
    ];
    sideBursts.forEach((config, burstIndex) => {
      const pos = {
        x: BATTLE_FIELD.x + BATTLE_FIELD.w * config.x,
        y: BATTLE_FIELD.y + BATTLE_FIELD.h * config.y,
      };
      for (let i = 0; i < config.count; i++) {
        const particleType = ATTACK_PARTICLE_TYPES[(i + burstIndex * 11) % ATTACK_PARTICLE_TYPES.length];
        foodExplosion(pos, won ? "#f0d56b" : "#d9573c", particleType, {
          count: 1,
          spread: config.spread,
          life: config.life + random() * 0.45,
          speedMin: config.speedMin,
          speedMax: config.speedMax,
          sizeMin: config.sizeMin,
          sizeMax: config.sizeMax,
        });
      }
      if (!horror) {
        burst(pos, won ? "#f0d56b" : "#d9573c", {
          count: config.sparkles,
          spread: config.spread * 0.72,
          life: 0.72 + random() * 0.22,
          speedMin: config.speedMin * 0.42,
          speedMax: config.speedMax * 0.52,
        });
      }
    });
  }

  function currentBattleSpeed() {
    const speed = BATTLE_SPEEDS[state.battleSpeedIndex] || BATTLE_SPEEDS[0];
    return bossBattleSpeedRestricted() && !BOSS_BATTLE_SPEEDS.includes(speed) ? 1 : speed;
  }

  function battleSpeedLabel() {
    return `${currentBattleSpeed()}x`;
  }

  function battleSpeedOptions() {
    return bossBattleSpeedRestricted() ? [...BOSS_BATTLE_SPEEDS] : [...BATTLE_SPEEDS];
  }

  function bossBattleSpeedRestricted() {
    return state.phase === "battle" && isBossRound(state.round);
  }

  function setBattleSpeed(value) {
    const index = BATTLE_SPEEDS.indexOf(value);
    if (index >= 0) state.battleSpeedIndex = index;
  }

  function normalizeBossBattleSpeed() {
    if (isBossRound(state.round)) setBattleSpeed(1);
  }

  function cycleBattleSpeed() {
    if (bossBattleSpeedRestricted()) {
      setBattleSpeed(currentBattleSpeed() === 1 ? 0.5 : 1);
      playGameSfx("ui-confirm", { volume: 0.5, rate: currentBattleSpeed() });
      return;
    }
    state.battleSpeedIndex = (state.battleSpeedIndex + 1) % BATTLE_SPEEDS.length;
    if (state.phase !== "battle") state.message = `Speed ${battleSpeedLabel()}`;
    playGameSfx("ui-confirm", { volume: 0.5, rate: Math.min(1.5, currentBattleSpeed()) });
  }

  function update(dt) {
    syncGameMusic();
    if (!state.menuRebootTransition) updateRunAutosave(dt);
    state.idleTime += dt;
    updatePhaseTransition(dt);
    updateModalTransitions(dt);
    updateShopSlotTransitions(dt);
    updateRebootTransition(dt);
    updateMenuRebootTransition(dt);
    updateFinalVictoryTransition(dt);
    updateShopReturnStaticTransition(dt);
    updatePostGiraffeHorrorTransition(dt);
    updateStoryConversationTransition(dt);
    updateStoryBeatTransition(dt);
    updateLevel10RevealCutscene(dt);
    if (state.level10RevealCutscene) return;
    if (state.optionsMenu.open) return;
    if (state.phase === "victoryCutscene" && state.victoryCutscene) {
      state.victoryCutscene.elapsed += dt;
    }
    if (state.realityBreakTimer > 0) state.realityBreakTimer = Math.max(0, state.realityBreakTimer - dt);
    const step = state.phase === "battle" ? dt * currentBattleSpeed() : dt;
    if (state.phase === "battle" && !phaseTransitionBlocksBattle()) updateBattle(step);
    state.particles = window.FoodAnimalsParticleRuntime.update(state.particles, step);
  }

  function updatePhaseTransition(dt) {
    state.phaseTransition = window.FoodAnimalsBattleFlowRuntime.updatePhaseTransition(state.phaseTransition, dt);
  }

  function phaseTransitionBlocksBattle() {
    return window.FoodAnimalsBattleFlowRuntime.phaseTransitionBlocksBattle(state.phaseTransition);
  }

  function startModalTransition(id, phase = "enter") {
    state.modalTransitions = state.modalTransitions || {};
    state.modalTransitions[id] = {
      phase,
      elapsed: 0,
      duration: MODAL_TRANSITION_SECONDS,
    };
  }

  function modalTransition(id) {
    return state.modalTransitions?.[id] || null;
  }

  function modalTransitionClosing(id) {
    return modalTransition(id)?.phase === "exit";
  }

  function modalTransitionVisual(id) {
    const transition = modalTransition(id);
    return window.FoodAnimalsTransitionCanvas.modalVisual(transition, MODAL_TRANSITION_SECONDS);
  }

  function updateModalTransitions(dt) {
    const transitions = state.modalTransitions || {};
    Object.entries(transitions).forEach(([id, transition]) => {
      if (!transition) return;
      transition.elapsed = Math.min(transition.duration || MODAL_TRANSITION_SECONDS, (transition.elapsed || 0) + dt);
      if (transition.elapsed < (transition.duration || MODAL_TRANSITION_SECONDS)) return;
      if (transition.phase === "exit") {
        if (id === "codex") {
          state.codexOpen = false;
          if (state.codexPreview) state.codexPreview.dragging = false;
        } else if (id === "options") {
          state.optionsMenu.open = false;
          state.optionsMenu.dragSlider = null;
        } else if (id === "ledger") {
          state.combatLedgerReview.open = false;
        }
      }
      delete transitions[id];
    });
  }

  function updateShopSlotTransitions(dt) {
    if (!state.shopSlotTransitions) return;
    state.shopSlotTransitions = state.shopSlotTransitions.map((transition) => {
      if (!transition) return null;
      const next = {
        ...transition,
        elapsed: (transition.elapsed || 0) + dt,
      };
      return next.elapsed >= (next.duration || SHOP_SLOT_TRANSITION_SECONDS) ? null : next;
    });
  }

  function updateRebootTransition(dt) {
    const transition = state.rebootTransition;
    if (!transition) return;
    window.FoodAnimalsVictoryRebootRuntime.advanceTransition(transition, dt);
    if (!transition.resetDone && transition.elapsed >= transition.resetAt) {
      completeRebootTransitionReset(transition);
      return;
    }
    if (transition.resetDone && transition.elapsed >= transition.duration) {
      if (window.FoodAnimalsResultRuntime.rebootTransitionNavigatesToMenu(transition)) {
        clearActiveRunRoute();
        markMenuRebootStaticReveal();
        state.rebootTransition = {
          ...transition,
          elapsed: transition.duration,
          navigated: true,
        };
        navigateToMainMenu();
        return;
      }
      state.rebootTransition = null;
      state.menuRebootTransition = null;
      state.message = "Prep";
    }
  }

  function updateMenuRebootTransition(dt) {
    const transition = state.menuRebootTransition;
    if (!transition) return;
    window.FoodAnimalsVictoryRebootRuntime.advanceTransition(transition, dt);
    if (!transition.navigated && transition.elapsed >= transition.duration) {
      clearActiveRunRoute();
      state.menuRebootTransition = {
        ...transition,
        elapsed: transition.duration,
        navigated: true,
      };
      navigateToMainMenu();
    }
  }

  function updateFinalVictoryTransition(dt) {
    const transition = state.finalVictoryTransition;
    if (!transition) return;
    window.FoodAnimalsVictoryRebootRuntime.advanceTransition(transition, dt);
    if (!transition.resetDone && transition.elapsed >= transition.resetAt) {
      completeFinalVictoryTransitionReset(transition);
      return;
    }
    if (transition.resetDone && transition.elapsed >= transition.duration) {
      state.finalVictoryTransition = null;
    }
  }

  function updateShopReturnStaticTransition(dt) {
    const transition = state.shopReturnStaticTransition;
    if (!transition) return;
    transition.elapsed = Math.min(transition.duration, (transition.elapsed || 0) + dt);
    if (!transition.screenChanged && transition.elapsed >= (transition.switchAt || transition.duration * 0.5)) {
      completeShopReturnStaticScreenChange(transition);
      return;
    }
    if (transition.elapsed >= transition.duration) {
      state.shopReturnStaticTransition = null;
      if (state.phase === "prep") state.message = themedArena(currentArena()).short;
      maybeStartStoryMilestone();
    }
  }

  function completeShopReturnStaticScreenChange(transition) {
    if (window.FoodAnimalsResultRuntime.shopReturnTransitionNavigatesToMenu(transition)) {
      clearActiveRunRoute();
      markMenuReturnReveal();
      state.shopReturnStaticTransition = {
        ...transition,
        screenChanged: true,
        rewardParticles: [],
      };
      navigateToMainMenu();
      return;
    }
    const rewardParticles = Array.isArray(transition.rewardParticles) ? transition.rewardParticles : [];
    continuePrep();
    if (rewardParticles.length) state.particles.push(...rewardParticles);
    state.shopReturnStaticTransition = {
      ...transition,
      screenChanged: true,
      rewardParticles: [],
    };
  }

  function updatePostGiraffeHorrorTransition(dt) {
    const transition = state.postGiraffeHorrorTransition;
    if (!transition) return;
    transition.elapsed = Math.min(transition.clearAt || transition.duration || POST_GIRAFFE_HORROR_ITEM_TRANSITION_CLEAR_SECONDS, (transition.elapsed || 0) + dt);
    if (transition.elapsed >= (transition.clearAt || POST_GIRAFFE_HORROR_ITEM_TRANSITION_CLEAR_SECONDS)) {
      state.postGiraffeHorrorTransition = null;
    }
  }

  function roundedRect(x, y, w, h, r) {
    window.FoodAnimalsCanvasUi.roundedRect(ctx, x, y, w, h, r);
  }

  function draw() {
    state.tooltipTargets = [];
    ctx.clearRect(0, 0, W, H);
    if (state.phase === "victoryCutscene") {
      drawVictoryCutscene();
    } else {
      drawBackground();
      if (state.phase === "battle") {
        drawBattle();
      } else if (state.phase === "result") {
        drawResult();
      } else {
        drawPrep();
      }
      drawTopBar();
      if (state.phase !== "result") drawParticles();
      if (state.codexOpen) {
        state.tooltipTargets = [];
        drawCodexOverlay();
      }
      drawRealityOverlay();
      drawRealityRevealDistortionOverlay();
      drawMergeOpportunityOverlay();
      if (state.phase === "prep" && !state.codexOpen) drawCodexMenuButton();
      drawStoryConversationOverlay();
      drawLevel10RevealCutsceneOverlay();
      if (state.level10RevealCutscene) state.tooltipTargets = [];
    }
    drawPhaseTransitionOverlay();
    drawRebootTransitionOverlay();
    drawMenuRebootTransitionOverlay();
    drawFinalVictoryTransitionOverlay();
    drawShopReturnStaticTransitionOverlay();
    drawOptionsMenuOverlay();
    drawTooltip();
  }

  function phaseTransitionProgress(type) {
    const transition = state.phaseTransition;
    if (!transition || (type && transition.type !== type)) return 1;
    return window.FoodAnimalsTransitionCanvas.progress(transition);
  }

  function resultTransitionAlpha() {
    if (state.phaseTransition?.type !== "battleToResult") return 1;
    return window.FoodAnimalsTransitionCanvas.resultAlpha(state.phaseTransition, BATTLE_RESULT_TRANSITION_SECONDS);
  }

  function drawPhaseTransitionOverlay() {
    const transition = state.phaseTransition;
    if (!transition) return;
    if (transition.type === "prepToBattle") {
      drawPrepToBattleTransition(transition);
      return;
    }
    if (transition.type === "battleToResult") {
      drawBattleToResultTransition(transition);
    }
  }

  function battleTransitionOverlaySrc(horror) {
    return horror ? REALITY_BATTLE_DEPLOY_OVERLAY_SRC : COZY_BATTLE_DEPLOY_OVERLAY_SRC;
  }

  function battleTransitionOverlayLayout(horror, image, visual, options = {}) {
    const pulse = options.pulse ?? visual.pulse ?? visual.reveal ?? 1;
    const eased = options.eased ?? visual.eased ?? visual.reveal ?? 1;
    const baseW = options.width || (horror ? 560 : 548);
    const drawW = baseW + pulse * (options.grow || 18);
    const drawH = image
      ? drawW * (image.naturalHeight / image.naturalWidth)
      : drawW * 0.625;
    const centerY = options.centerY ?? H * 0.5;
    const drawX = W / 2 - drawW / 2;
    const drawY = centerY - drawH / 2 + (1 - eased) * (options.enterOffset || 10);
    return {
      x: drawX,
      y: drawY,
      w: drawW,
      h: drawH,
      cx: W / 2,
      cy: drawY + drawH / 2,
    };
  }

  function drawBattleTransitionOverlayAsset(horror, visual, options = {}) {
    const image = getUiSprite(battleTransitionOverlaySrc(horror));
    if (!image || !image.complete || image.naturalWidth <= 0) return null;
    const layout = battleTransitionOverlayLayout(horror, image, visual, options);
    ctx.save();
    ctx.globalAlpha = (options.alpha ?? visual.pulse ?? visual.reveal ?? 1) * (horror ? 0.88 : 0.94);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, layout.x, layout.y, layout.w, layout.h);
    ctx.restore();
    return layout;
  }

  function drawCenteredTransitionTitle(src, cx, cy, maxW, maxH, alpha = 1) {
    const image = getUiSprite(src);
    if (!image || !image.complete || image.naturalWidth <= 0) return false;
    const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
    const drawW = image.naturalWidth * scale;
    const drawH = image.naturalHeight * scale;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
    return true;
  }

  function drawPrepToBattleTransition(transition) {
    const visual = window.FoodAnimalsTransitionCanvas.prepToBattleVisual(transition, BATTLE_DEPLOY_TRANSITION_SECONDS);
    const eased = visual.eased;
    const pulse = visual.pulse;
    const horror = realityBroken();
    const overlayCenterY = H * 0.5 + (1 - eased) * 10;
    const fallbackLayout = battleTransitionOverlayLayout(horror, null, visual, { centerY: overlayCenterY });
    ctx.save();
    ctx.globalAlpha = (horror ? 0.5 : 0.38) * (1 - eased * 0.55);
    ctx.fillStyle = horror ? "#020606" : "#fff4c5";
    ctx.fillRect(0, 0, W, H);

    const topBandH = visual.topBandH;
    const bottomBandH = visual.bottomBandH;
    if (topBandH > 0.5 || bottomBandH > 0.5) {
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = horror ? "rgba(2, 12, 13, 0.9)" : "rgba(245, 196, 106, 0.84)";
      ctx.fillRect(0, 0, W, topBandH);
      ctx.fillStyle = horror ? "rgba(6, 18, 21, 0.86)" : "rgba(255, 241, 176, 0.78)";
      ctx.fillRect(0, H - bottomBandH, W, bottomBandH);
    }

    ctx.save();
    ctx.translate(W / 2, overlayCenterY);
    ctx.scale(1, 0.34);
    const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 330 + eased * 50);
    halo.addColorStop(0, horror ? `rgba(70,255,99,${0.18 + pulse * 0.08})` : `rgba(255,255,255,${0.32 + pulse * 0.16})`);
    halo.addColorStop(0.62, horror ? `rgba(70,255,99,${0.05 + pulse * 0.04})` : `rgba(255,226,150,${0.12 + pulse * 0.08})`);
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 390, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const layout = drawBattleTransitionOverlayAsset(horror, visual, { centerY: overlayCenterY });
    const textLayout = layout || fallbackLayout;
    if (!layout) {
      ctx.globalAlpha = 0.94 * pulse;
      const plateW = 430;
      const plateH = 88;
      const plateX = W / 2 - plateW / 2;
      const plateY = overlayCenterY - plateH / 2;
      roundedRect(plateX, plateY, plateW, plateH, 10);
      ctx.fillStyle = horror ? "rgba(3, 10, 12, 0.86)" : "rgba(255, 253, 232, 0.92)";
      ctx.fill();
      ctx.strokeStyle = horror ? "rgba(70, 255, 99, 0.46)" : "rgba(160, 91, 42, 0.34)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.textAlign = "center";
    const titleDrawn = drawCenteredTransitionTitle(
      horror ? REALITY_BATTLE_DEPLOY_TITLE_SRC : COZY_BATTLE_DEPLOY_TITLE_SRC,
      textLayout.cx,
      textLayout.cy - 12,
      horror ? 360 : 390,
      horror ? 58 : 66,
      0.98 * pulse,
    );
    if (!titleDrawn) {
      ctx.globalAlpha = 0.96 * pulse;
      ctx.fillStyle = horror ? "#46ff63" : "#1f7d4a";
      ctx.font = "900 18px Inter, sans-serif";
      ctx.fillText(horror ? "DEPLOYING WAVE" : "PATTERN SET", W / 2, textLayout.cy - 8);
    }
    ctx.font = "800 10px Inter, sans-serif";
    ctx.fillStyle = horror ? "rgba(158, 250, 170, 0.72)" : "rgba(106, 75, 53, 0.72)";
    ctx.globalAlpha = 0.88 * pulse;
    ctx.fillText(horror ? "combat layer armed" : "teams taking their places", W / 2, textLayout.cy + 34);
    ctx.textAlign = "left";
    ctx.restore();
  }

  function drawBattleToResultTransition(transition) {
    const visual = window.FoodAnimalsTransitionCanvas.battleToResultVisual(transition, BATTLE_RESULT_TRANSITION_SECONDS);
    const progress = visual.progress;
    const flash = visual.flash;
    const reveal = visual.reveal;
    const won = transition.won;
    const gameOver = transition.gameOver;
    const horror = realityBroken();
    const title = window.FoodAnimalsResultRuntime.battleResultTitle({ gameOver, horror, won }, {
      cozyDefeat: COZY_BATTLE_RESULT_DEFEAT_TITLE_SRC,
      cozyRunOver: COZY_BATTLE_RESULT_RUN_OVER_TITLE_SRC,
      cozyVictory: COZY_BATTLE_RESULT_VICTORY_TITLE_SRC,
      realityDefeat: REALITY_BATTLE_RESULT_DEFEAT_TITLE_SRC,
      realityRunOver: REALITY_BATTLE_RESULT_RUN_OVER_TITLE_SRC,
      realityVictory: REALITY_BATTLE_RESULT_VICTORY_TITLE_SRC,
    });
    const titleSrc = title.src;
    const fallbackTitle = title.fallback;
    ctx.save();
    ctx.globalAlpha = 0.34 * flash;
    ctx.fillStyle = won ? (horror ? "#46ff63" : "#fff5bf") : "#d9573c";
    ctx.fillRect(0, 0, W, H);

    const overlayVisual = { ...visual, pulse: reveal, eased: visual.reveal };
    const overlayCenterY = H * 0.5 + (1 - reveal) * 8;
    const layout = drawBattleTransitionOverlayAsset(horror, overlayVisual, {
      alpha: reveal,
      centerY: overlayCenterY,
      grow: 12,
      width: horror ? 548 : 536,
    }) || battleTransitionOverlayLayout(horror, null, overlayVisual, {
      centerY: overlayCenterY,
      grow: 12,
      width: horror ? 548 : 536,
    });

    ctx.textAlign = "center";
    const titleDrawn = drawCenteredTransitionTitle(
      titleSrc,
      layout.cx,
      layout.cy - 4,
      gameOver ? 390 : 380,
      gameOver ? 84 : 88,
      0.98 * reveal,
    );
    if (!titleDrawn) {
      ctx.globalAlpha = reveal * 0.96;
      ctx.fillStyle = gameOver ? themeColor("danger", "#9b3028") : won ? themeColor("accent", "#1f7d4a") : themeColor("warning", "#a94b2b");
      ctx.font = "900 26px Inter, sans-serif";
      ctx.fillText(fallbackTitle, W / 2, layout.cy + 8);
    }
    ctx.textAlign = "left";
    ctx.restore();
  }

  function drawBackground() {
    if (realityBroken()) {
      drawWarFutureBackground();
      return;
    }
    const image = getBackgroundImage();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, W, H);
      ctx.restore();
      return;
    }

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#f8f5df");
    g.addColorStop(0.58, "#d8ead4");
    g.addColorStop(1, "#b9d9c2");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(41, 88, 69, 0.12)";
    ctx.lineWidth = 2;
    for (let x = -80; x < W + 80; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, 214);
      ctx.lineTo(x + 260, H);
      ctx.stroke();
    }
  }

  function drawWarFutureBackground() {
    const backgroundSrc = themedArena(currentArena()).backgroundSrc || REALITY_BACKGROUND_SRC;
    const image = getBackgroundImage(backgroundSrc);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, W, H);
      ctx.fillStyle = "rgba(1, 5, 6, 0.18)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#07100f");
      g.addColorStop(0.48, "#111820");
      g.addColorStop(1, "#240d13");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "rgba(70, 255, 99, 0.16)";
    ctx.lineWidth = 1;
    for (let x = -180; x < W + 180; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 240, H);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 58, 58, 0.12)";
    for (let y = 88; y < H; y += 62) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y + Math.sin(y * 0.05 + state.idleTime) * 10);
      ctx.stroke();
    }
    ctx.restore();

    const t = state.idleTime;
    for (let i = 0; i < 16; i++) {
      const x = (i * 73 + Math.sin(t * 0.7 + i) * 16) % W;
      const y = 84 + ((i * 41 + t * 12) % (H - 120));
      ctx.fillStyle = i % 3 === 0 ? "rgba(67, 255, 92, 0.18)" : "rgba(255, 70, 70, 0.12)";
      ctx.fillRect(x, y, 18 + (i % 4) * 10, 2);
    }
  }

  function victoryCutsceneStage(elapsed = state.victoryCutscene?.elapsed || 0) {
    return window.FoodAnimalsVictoryRebootRuntime.victoryStage(elapsed, {
      crawlStart: VICTORY_CRAWL_START_SECONDS,
      idealFadeStart: VICTORY_IDEAL_FADE_START_SECONDS,
      idealFadeSeconds: VICTORY_IDEAL_FADE_SECONDS,
    });
  }

  function drawCutsceneBackground(src, elapsed, alpha = 1, ideal = false) {
    const image = getBackgroundImage(src);
    const pan = clamp01(elapsed / (ideal ? 22 : 18));
    const ease = pan * pan * (3 - 2 * pan);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight) * (ideal ? 1.05 : 1.09);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const extraX = Math.max(0, drawW - W);
      const extraY = Math.max(0, drawH - H);
      const drift = Math.sin(elapsed * (ideal ? 0.08 : 0.12)) * (ideal ? 0.04 : 0.08);
      const x = -extraX * (ideal ? 0.38 + ease * 0.18 + drift : 0.28 + ease * 0.36 + drift);
      const y = -extraY * (ideal ? 0.52 - ease * 0.18 : 0.72 - ease * 0.34);
      ctx.drawImage(image, x, y, drawW, drawH);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, ideal ? "#82c9ef" : "#6d5f96");
      g.addColorStop(0.42, ideal ? "#f7c475" : "#f2a05c");
      g.addColorStop(1, ideal ? "#7fb579" : "#2b2f36");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawVictoryCrawl(elapsed) {
    const crawlElapsed = Math.max(0, elapsed - VICTORY_CRAWL_START_SECONDS);
    const fadeIn = clamp01(crawlElapsed / 2.2);
    const fadeOut = 1 - clamp01((elapsed - (VICTORY_IDEAL_FADE_START_SECONDS - 2.2)) / 2.2);
    const alpha = Math.min(fadeIn, fadeOut);
    const blockHeight = (VICTORY_CRAWL_LINES.length - 1) * VICTORY_CRAWL_LINE_GAP;
    const centeredStartY = H / 2 - blockHeight / 2;
    const scrollingStartY = H + 44 - crawlElapsed * VICTORY_CRAWL_PIXELS_PER_SECOND;
    const startY = Math.max(centeredStartY, scrollingStartY);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "800 19px Inter, sans-serif";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(31, 20, 24, 0.72)";
    ctx.fillStyle = "#fff1c7";
    VICTORY_CRAWL_LINES.forEach((line, index) => {
      const y = startY + index * VICTORY_CRAWL_LINE_GAP;
      if (y < -32 || y > H + 36) return;
      ctx.strokeText(line, W / 2, y);
      ctx.fillText(line, W / 2, y);
    });
    ctx.restore();
  }

  function drawVictoryRebootButton() {
    const button = VICTORY_REBOOT_BUTTON;
    ctx.save();
    roundedRect(button.x, button.y, button.w, button.h, 8);
    ctx.fillStyle = "rgba(255, 248, 219, 0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(66, 91, 54, 0.42)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 16px Inter, sans-serif";
    ctx.fillStyle = "#213b27";
    ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2 + 1);
    ctx.restore();
  }

  function drawVictoryCutscene() {
    const cutscene = state.victoryCutscene || { elapsed: 0, backgroundSrc: FINAL_VICTORY_CUTSCENE_SRC, idealBackgroundSrc: FINAL_VICTORY_IDEAL_SRC };
    const elapsed = cutscene.elapsed || 0;
    const stage = victoryCutsceneStage(elapsed);
    const idealProgress = clamp01((elapsed - VICTORY_IDEAL_FADE_START_SECONDS) / VICTORY_IDEAL_FADE_SECONDS);
    const idealEase = idealProgress * idealProgress * (3 - 2 * idealProgress);

    ctx.save();
    drawCutsceneBackground(cutscene.backgroundSrc || FINAL_VICTORY_CUTSCENE_SRC, elapsed, 1, false);
    if (idealEase > 0) {
      drawCutsceneBackground(cutscene.idealBackgroundSrc || FINAL_VICTORY_IDEAL_SRC, Math.max(0, elapsed - VICTORY_IDEAL_FADE_START_SECONDS), idealEase, true);
    }

    const entrance = clamp01(elapsed / 3.8);
    const glow = ctx.createRadialGradient(W * 0.52, H * 0.53, 40, W * 0.52, H * 0.53, 460);
    glow.addColorStop(0, `rgba(255, 237, 172, ${0.18 + entrance * 0.08})`);
    glow.addColorStop(0.45, "rgba(255, 165, 86, 0.06)");
    glow.addColorStop(1, "rgba(255, 165, 86, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const vignette = ctx.createRadialGradient(W / 2, H / 2, 220, W / 2, H / 2, 680);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, `rgba(8, 8, 12, ${stage === "ideal" ? 0.26 : 0.46})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = stage === "ideal"
      ? "rgba(255, 244, 202, 0.08)"
      : `rgba(255, 236, 185, ${0.05 + entrance * 0.1})`;
    ctx.fillRect(0, 0, W, H);

    const residualStatic = Math.max(0, 0.18 * (1 - clamp01(elapsed / 6)));
    const fadeStatic = idealProgress > 0 && idealProgress < 1 ? Math.sin(idealProgress * Math.PI) * 0.94 : 0;
    const staticAlpha = Math.max(residualStatic, fadeStatic);
    if (staticAlpha > 0.001) {
      const frame = Math.floor((state.idleTime + elapsed) * 54);
      const violentPulse = clamp01(staticAlpha * (0.84 + glitchNoise(frame * 37) * 0.48));
      const whiteFlash = Math.max(0, glitchNoise(frame * 43) - 0.78) * violentPulse;
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(255, 247, 216, ${whiteFlash * 0.72})`;
      ctx.fillRect(0, 0, W, H);

      for (let y = 0; y < H; y += 2) {
        const roll = glitchNoise(frame * 71 + y * 19);
        ctx.fillStyle = y % 2 === 0
          ? `rgba(74, 255, 104, ${violentPulse * (0.1 + roll * 0.34)})`
          : `rgba(255, 64, 86, ${violentPulse * (0.08 + roll * 0.3)})`;
        ctx.fillRect(0, y, W, roll > 0.78 ? 2 : 1);
      }

      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < 26; i++) {
        const gate = glitchNoise(frame * 89 + i * 31);
        if (gate < 0.28 + violentPulse * 0.34) continue;
        const y = Math.floor(glitchNoise(frame * 97 + i * 37) * H);
        const h = 3 + Math.floor(glitchNoise(frame * 103 + i * 41) * 28);
        const offset = Math.round((glitchNoise(frame * 109 + i * 43) - 0.5) * (24 + violentPulse * 74));
        const tint = glitchNoise(frame * 113 + i * 47) > 0.5
          ? `rgba(255, 58, 82, ${0.16 * violentPulse})`
          : `rgba(76, 255, 116, ${0.18 * violentPulse})`;
        ctx.drawImage(canvas, 0, y, W, h, offset, y, W, h);
        ctx.fillStyle = tint;
        ctx.fillRect(Math.max(0, offset), y, W, h);
      }

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 18; i++) {
        if (glitchNoise(frame * 127 + i * 53) < 0.42) continue;
        const x = Math.floor(glitchNoise(frame * 131 + i * 57) * W);
        const y = Math.floor(glitchNoise(frame * 137 + i * 59) * H);
        const w = 18 + Math.floor(glitchNoise(frame * 139 + i * 61) * 116);
        const h = 6 + Math.floor(glitchNoise(frame * 149 + i * 67) * 44);
        ctx.fillStyle = glitchNoise(frame * 151 + i * 71) > 0.5
          ? `rgba(255, 255, 244, ${0.08 + violentPulse * 0.24})`
          : `rgba(61, 255, 124, ${0.08 + violentPulse * 0.2})`;
        ctx.fillRect(x, y, w, h);
      }

      for (let i = 0; i < 520; i++) {
        const x = Math.floor(glitchNoise(frame * 131 + i * 17) * W);
        const y = Math.floor(glitchNoise(frame * 149 + i * 19) * H);
        const size = glitchNoise(frame * 167 + i * 23) > 0.76 ? 2 : 1;
        ctx.fillStyle = `rgba(255, 255, 236, ${(0.08 + glitchNoise(frame * 181 + i * 29) * 0.42) * violentPulse})`;
        ctx.fillRect(x, y, size, size);
      }

      ctx.globalAlpha = 0.44 * violentPulse;
      ctx.fillStyle = "#050508";
      for (let i = 0; i < 10; i++) {
        if (glitchNoise(frame * 191 + i * 73) < 0.36) continue;
        const y = Math.floor(glitchNoise(frame * 193 + i * 79) * H);
        const h = 2 + Math.floor(glitchNoise(frame * 197 + i * 83) * 20);
        ctx.fillRect(0, y, W, h);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    const titleAlpha = clamp01((elapsed - 0.85) / 2.25) * (1 - clamp01((elapsed - 6.2) / 2.2)) * (1 - idealEase);
    if (titleAlpha > 0.001) {
      ctx.globalAlpha = titleAlpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255, 155, 76, 0.72)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#fff5d2";
      ctx.font = "900 54px Inter, sans-serif";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(38, 22, 24, 0.58)";
      ctx.strokeText("THE DOORS OPEN", W / 2, 252);
      ctx.fillText("THE DOORS OPEN", W / 2, 252);
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffe4a9";
      ctx.font = "800 19px Inter, sans-serif";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(38, 22, 24, 0.62)";
      ctx.strokeText("Command lattice severed. Nursery sector unlocked.", W / 2, 308);
      ctx.fillText("Command lattice severed. Nursery sector unlocked.", W / 2, 308);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = titleAlpha * 0.72;
      ctx.fillStyle = "#ffd7a6";
      ctx.font = "800 15px Inter, sans-serif";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(38, 22, 24, 0.58)";
      ctx.strokeText("The market falls silent.", W / 2, 354);
      ctx.fillText("The market falls silent.", W / 2, 354);
      ctx.globalAlpha = 1;
    }

    drawVictoryCrawl(elapsed);

    if (stage === "ideal") {
      const idealTextAlpha = clamp01((elapsed - VICTORY_IDEAL_FADE_START_SECONDS - VICTORY_IDEAL_FADE_SECONDS) / 2);
      ctx.globalAlpha = idealTextAlpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 30px Inter, sans-serif";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 248, 220, 0.76)";
      ctx.fillStyle = "#234125";
      ctx.strokeText("Choice returns to the survivors.", W / 2, 470);
      ctx.fillText("Choice returns to the survivors.", W / 2, 470);
      ctx.globalAlpha = clamp01((elapsed - VICTORY_IDEAL_FADE_START_SECONDS - VICTORY_IDEAL_FADE_SECONDS - 1.2) / 1.6);
      drawVictoryRebootButton();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function getBackgroundImage(src = currentArena()?.backgroundSrc || BACKGROUND_SRC) {
    if (backgroundImageCache.has(src)) return backgroundImageCache.get(src);
    const image = new Image();
    image.onload = requestDraw;
    image.onerror = () => {
      if (src !== BACKGROUND_SRC && src !== REALITY_BACKGROUND_SRC) backgroundImageCache.delete(src);
    };
    image.src = src;
    backgroundImageCache.set(src, image);
    return image;
  }

  function drawTopBar() {
    drawStatusBoard("course", 9, 4, 126, 52, statusLabel("Course"), "Course", `${state.round}`, `Course ${state.round}`);
    drawStatusBoard("coins", 149, 4, 104, 52, statusLabel("Coins"), "Coins", `${state.gold}`, `${state.gold} ${currencyTerm({ lower: true })}`);
    drawStatusBoard("health", 266, 4, 104, 52, statusLabel("Health"), "Health", `${state.hearts}`, healthStatusTooltip());

    if (state.phase === "prep") {
      const upgradeCost = nextShopUpgradeCost();
      drawButton(
        { ...buttons.shopUpgrade, label: actionLabel(upgradeCost === null ? "Max Lv" : `Lv ${state.shopLevel + 1}`), coinAmount: upgradeCost },
        upgradeCost !== null && state.gold >= upgradeCost
      );
      drawButton({ ...buttons.roll, label: actionLabel("Roll"), coinAmount: currentRollCost() }, state.gold >= currentRollCost());
      drawButton({ ...buttons.battle, label: actionLabel("Battle") }, teamPower() > 0);
    } else if (state.phase === "battle") {
      drawButton({ ...buttons.battleSpeed, label: actionLabel(`Speed ${battleSpeedLabel()}`), speedValue: battleSpeedLabel() }, true);
    } else if (state.phase === "result" && state.hearts <= 0) {
      drawButton({ ...buttons.next, label: actionLabel("Restart"), signSrc: RESTART_CHALK_SIGN_SRC }, true);
    }
  }

  function postGiraffeHorrorHudEntry(kind) {
    return { id: `hud_${kind}`, uid: `hud_${kind}`, tier: 1 };
  }

  function drawStatusBoard(kind, x, y, w, h, label, cozyLabel, value, tooltip) {
    const phase = postGiraffeHorrorContentPhase("hud", postGiraffeHorrorHudEntry(kind));
    const cozy = phase?.mode === "cozy";
    const horror = phase?.mode === "horror" ? true : cozy ? false : realityBroken();
    drawChalkStatusBoard(
      currentStatusBoardSrc(kind, { cozy, horror }),
      x,
      y,
      w,
      h,
      cozy ? cozyLabel : label,
      value,
      tooltip,
      { horror, postGiraffePhase: phase }
    );
  }

  function healthStatusTooltip() {
    const lossDamage = roundLossDamage(state.round);
    const label = statusLabel("Course").toLowerCase();
    return {
      title: `${statusLabel("Health")}: ${state.hearts}`,
      body: realityBroken()
        ? `A defeat on this ${label} breaches hull for ${lossDamage}. Later waves hit harder.`
        : `A defeat on this ${label} costs ${lossDamage} health. Later courses hurt more.`,
    };
  }

  function drawChalkStatusBoard(src, x, y, w, h, label, value, tooltip, options = {}) {
    const image = getUiSprite(src);
    const tooltipInfo = typeof tooltip === "string" ? { title: tooltip, body: "" } : tooltip;
    const horror = options.horror ?? realityBroken();
    const effectRect = { x: x - 6, y: Math.max(0, y - 6), w: w + 12, h: h + 12 };
    registerTooltip(x, y, w, h, tooltipInfo);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      pill(x + 8, y + 8, w - 16, h - 16, `${label} ${value}`, horror ? "#071512" : "#fff5cc", horror ? "#e7ffe0" : "#16392d");
      drawPostGiraffeHorrorContentEffect(effectRect, "hud", null, options.postGiraffePhase);
      return;
    }
    ctx.drawImage(image, effectRect.x, effectRect.y, effectRect.w, effectRect.h);
    if (horror) {
      drawWarHudText(String(label).toUpperCase(), x + w / 2, y + 18, {
        font: "900 8px Inter, sans-serif",
        alpha: 0.94,
        glitch: true,
        glitchIntensity: 0.7,
      });
      drawWarHudText(String(value), x + w / 2, y + 37, {
        font: "900 19px Inter, sans-serif",
        alpha: 0.98,
        glitch: true,
        glitchIntensity: 0.84,
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      drawPostGiraffeHorrorContentEffect(effectRect, "hud", null, options.postGiraffePhase);
      return;
    }
    drawChalkButtonText(String(label).toUpperCase(), x + w / 2, y + 19, {
      font: "900 9px Inter, sans-serif",
      alpha: 0.92,
    });
    drawChalkButtonText(String(value), x + w / 2, y + 37, {
      font: "900 19px Inter, sans-serif",
      alpha: 0.98,
    });
    drawPostGiraffeHorrorContentEffect(effectRect, "hud", null, options.postGiraffePhase);
  }

  function drawRealityOverlay() {
    if (!realityBroken()) return;
    ctx.save();
    const flicker = state.realityBreakTimer > 0 ? 0.12 + Math.abs(Math.sin(state.idleTime * 34)) * 0.18 : 0.04;
    ctx.globalAlpha = flicker;
    ctx.fillStyle = "#46ff63";
    for (let y = 0; y < H; y += 5) ctx.fillRect(0, y, W, 1);
    ctx.globalAlpha = state.realityBreakTimer > 0 ? 0.18 : 0.08;
    ctx.fillStyle = "#ff3348";
    const jitter = Math.round(Math.sin(state.idleTime * 47) * 8);
    ctx.fillRect(0, 86 + jitter, W, 2);
    ctx.fillRect(0, 388 - jitter, W, 1);
    ctx.restore();

    drawSimulationFailureArtifacts();
    drawIllusionBleedAssetOverlays();
    drawRealityBanner();
  }

  function glitchNoise(seed) {
    return window.FoodAnimalsRealityFxCanvas.glitchNoise(seed);
  }

  function realityRevealDistortionState() {
    return window.FoodAnimalsRealityFxCanvas.revealDistortionState({
      distortSeconds: REALITY_REVEAL_DISTORT_SECONDS,
      idleTime: state.idleTime,
      realityBroken: state.realityBroken,
      revealSeconds: REALITY_BREAK_REVEAL_SECONDS,
      timer: state.realityBreakTimer,
    });
  }

  function drawRealityRevealDistortionOverlay() {
    const distortion = realityRevealDistortionState();
    if (!distortion.active) return;
    const { intensity, frame, elapsed } = distortion;
    const shockPulse = 1 - clamp01(elapsed / REALITY_REVEAL_DISTORT_SECONDS);
    const bandCount = Math.floor(7 + intensity * 18);
    const maxOffset = 18 + intensity * 68;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < bandCount; i += 1) {
      const gate = glitchNoise(frame * 89 + i * 31);
      if (gate < 0.16 + (1 - intensity) * 0.24) continue;
      const y = Math.floor(glitchNoise(frame * 97 + i * 37) * H);
      const h = 2 + Math.floor(glitchNoise(frame * 103 + i * 41) * (9 + intensity * 24));
      const offset = Math.round((glitchNoise(frame * 109 + i * 43) - 0.5) * maxOffset);
      ctx.drawImage(canvas, 0, y, W, h, offset, y, W, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = i % 2 === 0
        ? `rgba(70, 255, 99, ${0.08 * intensity})`
        : `rgba(255, 55, 82, ${0.07 * intensity})`;
      ctx.fillRect(Math.max(0, offset), y, W, h);
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.fillStyle = `rgba(0, 4, 5, ${0.04 + intensity * 0.2})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(frame * 97 + y * 13);
      const bandAlpha = (0.025 + roll * 0.11) * intensity;
      ctx.fillStyle = y % 2 === 0
        ? `rgba(88, 255, 105, ${bandAlpha})`
        : `rgba(255, 55, 82, ${bandAlpha * 0.72})`;
      ctx.fillRect(0, y, W, roll > 0.82 ? 2 : 1);
    }

    const speckCount = Math.floor(260 + intensity * 360);
    for (let i = 0; i < speckCount; i += 1) {
      const x = Math.floor(glitchNoise(frame * 131 + i * 17) * W);
      const y = Math.floor(glitchNoise(frame * 149 + i * 19) * H);
      const size = glitchNoise(frame * 167 + i * 23) > 0.86 ? 2 : 1;
      const speckAlpha = (0.05 + glitchNoise(frame * 181 + i * 29) * 0.3) * intensity;
      ctx.fillStyle = i % 5 === 0
        ? `rgba(0, 238, 255, ${speckAlpha})`
        : `rgba(238, 255, 232, ${speckAlpha})`;
      ctx.fillRect(x, y, size, size);
    }

    const blockCount = Math.floor(5 + intensity * 10);
    for (let i = 0; i < blockCount; i += 1) {
      if (glitchNoise(frame * 211 + i * 31) < 0.32) continue;
      const x = Math.floor(glitchNoise(frame * 223 + i * 37) * W);
      const y = Math.floor(glitchNoise(frame * 227 + i * 41) * H);
      const w = 18 + Math.floor(glitchNoise(frame * 239 + i * 43) * (60 + intensity * 110));
      const h = 4 + Math.floor(glitchNoise(frame * 251 + i * 47) * (12 + intensity * 34));
      ctx.fillStyle = i % 3 === 0
        ? `rgba(255, 255, 244, ${0.08 * intensity})`
        : `rgba(61, 255, 124, ${0.08 * intensity})`;
      ctx.fillRect(x, y, w, h);
    }

    if (shockPulse > 0.01) {
      const whiteFlash = Math.max(0, glitchNoise(frame * 43) - 0.72) * shockPulse;
      ctx.fillStyle = `rgba(255, 247, 216, ${whiteFlash * 0.38})`;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.restore();
  }

  function drawSimulationFailureArtifacts() {
    const revealIntensity = state.realityBreakTimer > 0 ? 1 : 0.58;
    const frame = Math.floor(state.idleTime * (state.realityBreakTimer > 0 ? 18 : 8));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 10; i++) {
      const gate = glitchNoise(frame * 47 + i * 31);
      if (gate < 0.2) continue;
      const x = Math.floor(glitchNoise(frame * 83 + i * 17) * W);
      const y = Math.floor(62 + glitchNoise(frame * 109 + i * 23) * (H - 92));
      const w = Math.floor(26 + glitchNoise(frame * 137 + i * 29) * 118);
      const h = Math.floor(2 + glitchNoise(frame * 151 + i * 37) * 12);
      const offset = Math.round((glitchNoise(frame * 193 + i * 41) - 0.5) * 16);
      const alpha = (0.06 + gate * 0.1) * revealIntensity;
      ctx.fillStyle = `rgba(64, 255, 92, ${alpha})`;
      ctx.fillRect(x, y, w, h);
      if (i % 2 === 0) {
        ctx.fillStyle = `rgba(0, 228, 255, ${alpha * 0.72})`;
        ctx.fillRect(x + offset, y + h + 1, Math.max(14, w * 0.72), 2);
        ctx.fillStyle = `rgba(255, 42, 74, ${alpha * 0.64})`;
        ctx.fillRect(x - offset, y - 2, Math.max(12, w * 0.52), 2);
      }
    }
    ctx.globalCompositeOperation = "source-over";
    for (let cluster = 0; cluster < 7; cluster++) {
      const baseX = Math.floor(glitchNoise(frame * 211 + cluster * 43) * W);
      const baseY = Math.floor(56 + glitchNoise(frame * 239 + cluster * 47) * (H - 76));
      const visible = glitchNoise(frame * 269 + cluster * 53) > 0.28;
      if (!visible) continue;
      for (let dot = 0; dot < 14; dot++) {
        const dx = Math.floor(glitchNoise(frame * 307 + cluster * 59 + dot * 7) * 74);
        const dy = Math.floor(glitchNoise(frame * 331 + cluster * 61 + dot * 11) * 32);
        const size = glitchNoise(frame * 353 + dot * 13) > 0.8 ? 2 : 1;
        ctx.fillStyle = dot % 3 === 0
          ? "rgba(220, 255, 218, 0.18)"
          : dot % 3 === 1
            ? "rgba(79, 255, 92, 0.16)"
            : "rgba(255, 52, 78, 0.12)";
        ctx.fillRect(baseX + dx, baseY + dy, size, size);
      }
    }
    ctx.restore();
  }

  function drawRebootTransitionOverlay() {
    const transition = state.rebootTransition;
    if (!transition) return;
    const visual = window.FoodAnimalsTransitionCanvas.resetStaticVisual(transition, { warmAlpha: 0.28 });
    const fadeOut = visual.fadeOut;
    const staticAlpha = visual.staticAlpha;
    const warmAlpha = visual.warmAlpha;
    const frame = Math.floor((state.idleTime + transition.elapsed) * 36);

    ctx.save();
    ctx.fillStyle = transition.resetDone
      ? `rgba(255, 248, 216, ${0.16 + warmAlpha})`
      : `rgba(0, 4, 5, ${0.12 + staticAlpha * 0.46})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(frame * 97 + y * 13);
      const bandAlpha = (0.03 + roll * 0.12) * staticAlpha;
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 247, 205, ${bandAlpha})`
        : y % 2 === 0
          ? `rgba(88, 255, 105, ${bandAlpha})`
          : `rgba(255, 55, 82, ${bandAlpha * 0.72})`;
      ctx.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < 520; i++) {
      const x = Math.floor(glitchNoise(frame * 131 + i * 17) * W);
      const y = Math.floor(glitchNoise(frame * 149 + i * 19) * H);
      const size = glitchNoise(frame * 167 + i * 23) > 0.86 ? 2 : 1;
      const speckAlpha = (0.08 + glitchNoise(frame * 181 + i * 29) * 0.3) * staticAlpha;
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 255, 236, ${speckAlpha})`
        : i % 5 === 0
          ? `rgba(0, 238, 255, ${speckAlpha})`
          : `rgba(238, 255, 232, ${speckAlpha})`;
      ctx.fillRect(x, y, size, size);
    }
    for (let i = 0; i < 8; i++) {
      const gate = glitchNoise(frame * 211 + i * 31);
      if (gate < 0.22) continue;
      const y = Math.floor(glitchNoise(frame * 227 + i * 37) * H);
      const x = Math.floor((glitchNoise(frame * 241 + i * 41) - 0.5) * 44);
      const h = 2 + Math.floor(glitchNoise(frame * 263 + i * 43) * 15);
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 235, 166, ${0.08 * staticAlpha})`
        : `rgba(70, 255, 99, ${0.12 * staticAlpha})`;
      ctx.fillRect(x, y, W + 88, h);
    }
    ctx.globalCompositeOperation = "source-over";
    if (transition.resetDone) {
      const clearAlpha = clamp01(fadeOut * 1.2);
      ctx.fillStyle = `rgba(255, 250, 224, ${clearAlpha * 0.18})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawMenuRebootTransitionOverlay() {
    const transition = state.menuRebootTransition;
    if (!transition) return;
    const visual = window.FoodAnimalsTransitionCanvas.menuRebootVisual(transition);
    const staticAlpha = visual.staticAlpha;
    const frame = Math.floor((state.idleTime + transition.elapsed) * 42);

    ctx.save();
    ctx.fillStyle = `rgba(0, 4, 5, ${0.12 + staticAlpha * 0.58})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(frame * 103 + y * 17);
      const bandAlpha = (0.035 + roll * 0.16) * staticAlpha;
      ctx.fillStyle = y % 2 === 0
        ? `rgba(88, 255, 105, ${bandAlpha})`
        : `rgba(255, 55, 82, ${bandAlpha * 0.78})`;
      ctx.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < 650; i++) {
      const x = Math.floor(glitchNoise(frame * 137 + i * 17) * W);
      const y = Math.floor(glitchNoise(frame * 151 + i * 19) * H);
      const size = glitchNoise(frame * 173 + i * 23) > 0.84 ? 2 : 1;
      const speckAlpha = (0.08 + glitchNoise(frame * 191 + i * 29) * 0.34) * staticAlpha;
      ctx.fillStyle = i % 6 === 0
        ? `rgba(0, 238, 255, ${speckAlpha})`
        : `rgba(238, 255, 232, ${speckAlpha})`;
      ctx.fillRect(x, y, size, size);
    }
    for (let i = 0; i < 10; i++) {
      if (glitchNoise(frame * 211 + i * 31) < 0.2) continue;
      const y = Math.floor(glitchNoise(frame * 229 + i * 37) * H);
      const x = Math.floor((glitchNoise(frame * 251 + i * 41) - 0.5) * 60);
      const h = 2 + Math.floor(glitchNoise(frame * 269 + i * 43) * 19);
      ctx.fillStyle = `rgba(70, 255, 99, ${0.14 * staticAlpha})`;
      ctx.fillRect(x, y, W + 120, h);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, ${0.18 * staticAlpha})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawFinalVictoryTransitionOverlay() {
    const transition = state.finalVictoryTransition;
    if (!transition) return;
    const visual = window.FoodAnimalsTransitionCanvas.finalVictoryStaticVisual(transition);
    if (!visual.active) return;
    const staticElapsed = visual.staticElapsed;
    const fadeOut = visual.fadeOut;
    const staticAlpha = visual.staticAlpha;
    const warmAlpha = visual.warmAlpha;
    const frame = Math.floor((state.idleTime + staticElapsed) * 36);

    ctx.save();
    ctx.fillStyle = transition.resetDone
      ? `rgba(255, 236, 178, ${0.12 + warmAlpha})`
      : `rgba(0, 4, 5, ${0.12 + staticAlpha * 0.46})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(frame * 97 + y * 13);
      const bandAlpha = (0.03 + roll * 0.12) * staticAlpha;
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 218, 138, ${bandAlpha})`
        : y % 2 === 0
          ? `rgba(88, 255, 105, ${bandAlpha})`
          : `rgba(255, 55, 82, ${bandAlpha * 0.72})`;
      ctx.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < 520; i++) {
      const x = Math.floor(glitchNoise(frame * 131 + i * 17) * W);
      const y = Math.floor(glitchNoise(frame * 149 + i * 19) * H);
      const size = glitchNoise(frame * 167 + i * 23) > 0.86 ? 2 : 1;
      const speckAlpha = (0.08 + glitchNoise(frame * 181 + i * 29) * 0.3) * staticAlpha;
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 247, 210, ${speckAlpha})`
        : i % 5 === 0
          ? `rgba(0, 238, 255, ${speckAlpha})`
          : `rgba(238, 255, 232, ${speckAlpha})`;
      ctx.fillRect(x, y, size, size);
    }
    for (let i = 0; i < 8; i++) {
      const gate = glitchNoise(frame * 211 + i * 31);
      if (gate < 0.22) continue;
      const y = Math.floor(glitchNoise(frame * 227 + i * 37) * H);
      const x = Math.floor((glitchNoise(frame * 241 + i * 41) - 0.5) * 44);
      const h = 2 + Math.floor(glitchNoise(frame * 263 + i * 43) * 15);
      ctx.fillStyle = transition.resetDone
        ? `rgba(255, 194, 96, ${0.08 * staticAlpha})`
        : `rgba(70, 255, 99, ${0.12 * staticAlpha})`;
      ctx.fillRect(x, y, W + 88, h);
    }
    ctx.globalCompositeOperation = "source-over";
    if (transition.resetDone) {
      const clearAlpha = clamp01(fadeOut * 1.2);
      ctx.fillStyle = `rgba(255, 221, 150, ${clearAlpha * 0.16})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawShopReturnStaticTransitionOverlay() {
    const transition = state.shopReturnStaticTransition;
    if (!transition) return;
    if (transition.theme === "cozy") {
      drawCozyShopReturnAwningTransitionOverlay(transition);
      return;
    }
    drawHorrorShopReturnStaticTransitionOverlay(transition);
  }

  function drawHorrorShopReturnStaticTransitionOverlay(transition) {
    const visual = window.FoodAnimalsTransitionCanvas.shopReturnStaticVisual(transition, HORROR_SHOP_RETURN_STATIC_SECONDS);
    const staticAlpha = visual.staticAlpha;
    const fadeOut = visual.fadeOut;
    const frame = Math.floor((state.idleTime + (transition.elapsed || 0)) * 48);

    ctx.save();
    ctx.fillStyle = `rgba(0, 5, 5, ${0.1 + staticAlpha * 0.42})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(frame * 83 + y * 17);
      const bandAlpha = (0.025 + roll * 0.11) * staticAlpha;
      ctx.fillStyle = y % 2 === 0
        ? `rgba(74, 255, 99, ${bandAlpha})`
        : `rgba(0, 225, 255, ${bandAlpha * 0.62})`;
      ctx.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < 420; i++) {
      const x = Math.floor(glitchNoise(frame * 127 + i * 19) * W);
      const y = Math.floor(glitchNoise(frame * 139 + i * 23) * H);
      const size = glitchNoise(frame * 151 + i * 29) > 0.88 ? 2 : 1;
      const speckAlpha = (0.06 + glitchNoise(frame * 163 + i * 31) * 0.26) * staticAlpha;
      ctx.fillStyle = i % 7 === 0
        ? `rgba(255, 57, 86, ${speckAlpha * 0.72})`
        : `rgba(232, 255, 230, ${speckAlpha})`;
      ctx.fillRect(x, y, size, size);
    }
    for (let i = 0; i < 6; i++) {
      if (glitchNoise(frame * 181 + i * 37) < 0.18) continue;
      const y = Math.floor(glitchNoise(frame * 193 + i * 41) * H);
      const h = 2 + Math.floor(glitchNoise(frame * 211 + i * 43) * 13);
      const x = Math.floor((glitchNoise(frame * 223 + i * 47) - 0.5) * 56);
      ctx.fillStyle = `rgba(70, 255, 99, ${0.1 * staticAlpha})`;
      ctx.fillRect(x, y, W + 112, h);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(170, 255, 181, ${0.1 * staticAlpha * (1 - fadeOut)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawCozyShopReturnAwningTransitionOverlay(transition) {
    const duration = Math.max(0.001, transition.duration || COZY_SHOP_RETURN_AWNING_SECONDS);
    const elapsed = transition.elapsed || 0;
    const switchAt = clamp(transition.switchAt || duration * 0.5, 0.001, duration - 0.001);
    const cover = transition.screenChanged
      ? 1 - clamp01((elapsed - switchAt) / Math.max(0.001, duration - switchAt))
      : clamp01(elapsed / switchAt);
    const ease = cover * cover * (3 - 2 * cover);
    const image = getUiSprite(COZY_AWNING_TRANSITION_SRC);
    const drawW = W + 112;
    const drawH = drawW * (image?.naturalHeight || 941) / Math.max(1, image?.naturalWidth || 1672);
    const x = -56;
    const y = -drawH + 18 + ease * (drawH - 18);

    ctx.save();
    const warmAlpha = 0.16 * ease;
    ctx.fillStyle = `rgba(255, 235, 186, ${warmAlpha})`;
    ctx.fillRect(0, 0, W, H);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, x, y, drawW, drawH);
    } else {
      const fallbackH = H * 0.9;
      ctx.fillStyle = "#d94a3f";
      ctx.fillRect(0, -fallbackH + ease * fallbackH, W, fallbackH);
      for (let sx = 0; sx < W; sx += 96) {
        ctx.fillStyle = (sx / 96) % 2 ? "#fff2c8" : "#d94a3f";
        ctx.fillRect(sx, -fallbackH + ease * fallbackH, 48, fallbackH);
      }
    }
    drawCozyTransitionFoodParticles(ease, transition);
    ctx.restore();
  }

  function drawCozyTransitionFoodParticles(cover, transition) {
    const t = state.idleTime + (transition.elapsed || 0);
    const alpha = 0.82 * Math.sin(clamp01(cover) * Math.PI);
    if (alpha <= 0.01) return;
    for (let i = 0; i < 38; i++) {
      const baseX = glitchNoise(i * 97 + 31) * (W + 140) - 70;
      const baseY = 54 + glitchNoise(i * 113 + 43) * (H - 108);
      const x = baseX + Math.sin(t * 0.55 + i * 1.7) * 10 + Math.cos(t * 0.23 + i) * 4;
      const y = baseY + Math.cos(t * 0.45 + i * 1.3) * 7 + clamp01(cover) * 10;
      const size = 3 + glitchNoise(i * 131 + 59) * 7;
      const kind = i % 5;
      ctx.save();
      ctx.globalAlpha = alpha * (0.55 + glitchNoise(i * 149 + 67) * 0.45);
      ctx.translate(x, y);
      ctx.rotate((glitchNoise(i * 167 + 83) - 0.5) * 1 + Math.sin(t * 0.4 + i) * 0.22);
      if (kind === 0) {
        ctx.fillStyle = "#e84b4b";
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.8);
        ctx.bezierCurveTo(size, -size * 1.1, size * 0.9, size * 0.5, 0, size);
        ctx.bezierCurveTo(-size * 0.9, size * 0.5, -size, -size * 1.1, 0, -size * 0.8);
        ctx.fill();
        ctx.fillStyle = "#4fa35e";
        ctx.fillRect(-size * 0.25, -size * 1.25, size * 0.5, size * 0.35);
      } else if (kind === 1) {
        ctx.fillStyle = "#c98a4c";
        ctx.fillRect(-size * 0.5, -size * 0.35, size, size * 0.7);
        ctx.fillStyle = "#f3d39c";
        ctx.fillRect(-size * 0.22, -size * 0.16, size * 0.44, size * 0.32);
      } else if (kind === 2) {
        ctx.fillStyle = "#5aa65f";
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.45, size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 3) {
        ctx.strokeStyle = ["#f26b5f", "#7cc46b", "#fff0a8", "#b85bd8"][i % 4];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, 0);
        ctx.lineTo(size * 0.8, 0);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#7d4b2a";
        ctx.fillRect(-size * 0.35, -size * 0.35, size * 0.7, size * 0.7);
      }
      ctx.restore();
    }
  }

  function illusionBleedFrame() {
    return Math.floor(state.idleTime * 42);
  }

  function illusionBleedPhase(id, chance = 0.16, options = {}) {
    if (!illusionBleedAllowed(options)) return { active: false, phase: "idle", progress: 0 };
    const reveal = state.realityBreakTimer > 0;
    const cycleSeconds = reveal ? 1.8 : 5.8;
    const preStaticSeconds = 0.5;
    const flashSeconds = reveal ? 0.36 : 0.3;
    const postStaticSeconds = 0.5;
    const sequenceSeconds = preStaticSeconds + flashSeconds + postStaticSeconds;
    const cycleTime = state.idleTime + glitchNoise(id * 97) * cycleSeconds;
    const cycle = Math.floor(cycleTime / cycleSeconds);
    const phase = cycleTime - cycle * cycleSeconds;
    if (phase > sequenceSeconds) return { active: false, phase: "idle", progress: 0 };
    const threshold = 1 - Math.min(0.42, chance * (reveal ? 2.2 : 1));
    if (glitchNoise(cycle * 173 + id * 37) <= threshold) return { active: false, phase: "idle", progress: 0 };
    if (phase < preStaticSeconds) return { active: true, phase: "pre", progress: phase / preStaticSeconds };
    if (phase < preStaticSeconds + flashSeconds) {
      return { active: true, phase: "flash", progress: (phase - preStaticSeconds) / flashSeconds };
    }
    return { active: true, phase: "post", progress: (phase - preStaticSeconds - flashSeconds) / postStaticSeconds };
  }

  function illusionBleedActive(id, chance = 0.16, options = {}) {
    return illusionBleedPhase(id, chance, options).phase === "flash";
  }

  function illusionBleedAllowed(options = {}) {
    if (!realityBroken()) return false;
    if (state.codexOpen) return false;
    if (state.phase === "prep") return true;
    return Boolean(options.allowCombat && state.phase === "battle");
  }

  function drawHeavyStaticAroundRect(rect, id, intensity = 1) {
    const frame = illusionBleedFrame();
    const pad = 5 + Math.round(4 * intensity);
    const x = Math.round(rect.x - pad);
    const y = Math.round(rect.y - pad);
    const w = Math.round(rect.w + pad * 2);
    const h = Math.round(rect.h + pad * 2);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(75, 255, 91, ${0.22 * intensity})`;
    ctx.lineWidth = 1.5;
    roundedRect(x, y, w, h, Math.min(8, Math.max(3, rect.w * 0.08)));
    ctx.stroke();
    for (let i = 0; i < 18; i++) {
      const edge = Math.floor(glitchNoise(frame * 197 + id * 23 + i * 11) * 4);
      const lineW = 4 + glitchNoise(frame * 211 + id * 29 + i * 13) * Math.min(82, w * 0.45);
      const lineH = glitchNoise(frame * 227 + id * 31 + i * 17) > 0.72 ? 2 : 1;
      let sx = x + glitchNoise(frame * 239 + id * 41 + i * 19) * w;
      let sy = y + glitchNoise(frame * 251 + id * 43 + i * 23) * h;
      if (edge === 0) sy = y + glitchNoise(frame * 263 + i) * 8;
      if (edge === 1) sy = y + h - 8 + glitchNoise(frame * 269 + i) * 8;
      if (edge === 2) sx = x + glitchNoise(frame * 271 + i) * 8;
      if (edge === 3) sx = x + w - 8 + glitchNoise(frame * 277 + i) * 8;
      ctx.fillStyle = i % 3 === 0
        ? `rgba(255, 255, 232, ${0.16 * intensity})`
        : i % 3 === 1
          ? `rgba(0, 232, 255, ${0.18 * intensity})`
          : `rgba(255, 39, 70, ${0.18 * intensity})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(lineW), lineH);
    }
    ctx.restore();
  }

  function drawBlueStaticAroundRect(rect, id, intensity = 1) {
    const frame = illusionBleedFrame();
    const pad = 6 + Math.round(5 * intensity);
    const x = Math.round(rect.x - pad);
    const y = Math.round(rect.y - pad);
    const w = Math.round(rect.w + pad * 2);
    const h = Math.round(rect.h + pad * 2);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(70, 190, 255, ${0.34 * intensity})`;
    ctx.lineWidth = 1.75;
    roundedRect(x, y, w, h, Math.min(10, Math.max(4, rect.w * 0.08)));
    ctx.stroke();
    ctx.fillStyle = `rgba(30, 124, 255, ${0.065 * intensity})`;
    roundedRect(rect.x, rect.y, rect.w, rect.h, Math.min(8, Math.max(3, rect.w * 0.08)));
    ctx.fill();
    for (let i = 0; i < 24; i++) {
      const edge = Math.floor(glitchNoise(frame * 401 + id * 17 + i * 13) * 4);
      const lineW = 6 + glitchNoise(frame * 409 + id * 19 + i * 17) * Math.min(96, w * 0.5);
      const lineH = glitchNoise(frame * 419 + id * 23 + i * 19) > 0.68 ? 2 : 1;
      let sx = x + glitchNoise(frame * 421 + id * 29 + i * 23) * w;
      let sy = y + glitchNoise(frame * 431 + id * 31 + i * 29) * h;
      if (edge === 0) sy = y + glitchNoise(frame * 433 + i) * 10;
      if (edge === 1) sy = y + h - 10 + glitchNoise(frame * 439 + i) * 10;
      if (edge === 2) sx = x + glitchNoise(frame * 443 + i) * 10;
      if (edge === 3) sx = x + w - 10 + glitchNoise(frame * 449 + i) * 10;
      ctx.fillStyle = i % 3 === 0
        ? `rgba(218, 248, 255, ${0.34 * intensity})`
        : i % 3 === 1
          ? `rgba(32, 166, 255, ${0.3 * intensity})`
          : `rgba(0, 246, 255, ${0.28 * intensity})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(lineW), lineH);
    }
    ctx.restore();
  }

  function drawIllusionImage(src, rect, id, alpha = 0.62) {
    const image = getUiSprite(src);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;
    const frame = illusionBleedFrame();
    const xJitter = Math.round((glitchNoise(frame * 311 + id * 7) - 0.5) * 4);
    const yJitter = Math.round((glitchNoise(frame * 313 + id * 11) - 0.5) * 3);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.filter = "blur(1.2px)";
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, rect.x + xJitter, rect.y + yJitter, rect.w, rect.h);
    ctx.globalAlpha = alpha * 0.28;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(image, rect.x + xJitter - 3, rect.y + yJitter, rect.w, rect.h);
    ctx.drawImage(image, rect.x + xJitter + 3, rect.y + yJitter, rect.w, rect.h);
    ctx.restore();
    return true;
  }

  function cozyShopkeeperSrc() {
    return SHOPKEEPER_SRC;
  }

  function cozySlotBackdropSrc(area, slotKind = null) {
    if (area === "shop") return SHOP_SLOT_BG_SRC;
    if (area === "bench") return BENCH_SLOT_BG_SRC;
    if (area === "board") return BOARD_PLATE_SLOT_SRC;
    if (area === "drinks") return DRINK_COASTER_SLOT_SRC;
    if (area === "itemBench" && slotKind === "drink") return DRINK_COASTER_SLOT_SRC;
    if (area === "itemBench" && slotKind === "topping") return TOPPING_CUTTING_BOARD_SLOT_SRC;
    return null;
  }

  function horrorSlotBackdropSrc(area, slotKind = null) {
    if (area === "shop") return currentShopSlotBgSrc();
    if (area === "bench") return currentBenchSlotBgSrc();
    if (area === "board") return currentBoardPlateSlotSrc();
    if (area === "drinks") return currentDrinkCoasterSlotSrc();
    if (area === "itemBench" && slotKind === "drink") return currentDrinkCoasterSlotSrc();
    if (area === "itemBench" && slotKind === "topping") return currentToppingStorageSlotSrc();
    return null;
  }

  function slotBackdropBleedPhase(area, index = 0, slotKind = null) {
    if (!realityBroken()) return { active: false, phase: "idle", progress: 0 };
    const allowCombat = state.phase === "battle" && (area === "board" || area === "drinks");
    const baseId = area === "shop"
      ? 100
      : area === "board"
        ? 220
        : area === "bench"
          ? 340
          : area === "drinks"
            ? 460
            : slotKind === "drink"
              ? 560
              : 620;
    const chance = area === "shop" ? 0.085 : 0.07;
    return illusionBleedPhase(baseId + (index || 0), chance, { allowCombat });
  }

  function drawSlotBackdropSequenceEffect(rect, area, index = 0, slotKind = null) {
    const bleed = slotBackdropBleedPhase(area, index, slotKind);
    if (!bleed.active) return;
    const id = (area === "shop" ? 100 : area === "board" ? 220 : area === "bench" ? 340 : area === "drinks" ? 460 : slotKind === "drink" ? 560 : 620) + (index || 0);
    const clipToTileLayer = state.phase === "battle" && (area === "board" || area === "drinks");
    if (clipToTileLayer) {
      ctx.save();
      roundedRect(rect.x, rect.y, rect.w, rect.h, Math.min(8, Math.max(3, rect.w * 0.08)));
      ctx.clip();
    }
    if (bleed.phase === "flash") {
      drawHeavyStaticAroundRect(rect, id, area === "shop" ? 0.72 : 0.58);
      if (clipToTileLayer) ctx.restore();
      return;
    }
    drawBlueStaticAroundRect(rect, id, area === "shop" ? 0.68 : 0.54);
    if (clipToTileLayer) ctx.restore();
  }

  function contentBleedId(kind, entry) {
    const typeId = entry?.typeId || entry?.id || kind;
    const tier = isItem(entry) ? itemTier(entry?.tier) : Math.max(1, entry?.tier || 1);
    const uid = typeof entry?.uid === "number" ? entry.uid : typeId;
    return 760 + (hashString(`${kind}:${uid}:${typeId}:${tier}`) % 9000);
  }

  function contentBleedPhase(kind, entry) {
    if (!entry || !realityBroken()) return { active: false, phase: "idle", progress: 0 };
    const chance = kind === "drink" ? 0.085 : kind === "topping" ? 0.08 : 0.075;
    return illusionBleedPhase(contentBleedId(kind, entry), chance, { allowCombat: true });
  }

  function postGiraffeHorrorContentPhase(kind, entry) {
    const transition = state.postGiraffeHorrorTransition;
    if (!transition?.active || !entry || !realityBroken()) return null;
    const duration = transition.duration || POST_GIRAFFE_HORROR_ITEM_TRANSITION_SECONDS;
    const elapsed = Math.max(0, transition.elapsed || 0);
    const id = contentBleedId(kind, entry);
    const seed = hashString(`giraffe-horror:${kind}:${entry.uid || ""}:${entry.typeId || entry.id || ""}:${entry.tier || 1}`);
    const stagger = 0.08 + glitchNoise(seed + 17) * 2.05;
    const lockAt = Math.min(duration - 0.28, stagger + 1.95 + glitchNoise(seed + 43) * 2.3);
    if (elapsed >= lockAt) {
      const sinceLock = elapsed - lockAt;
      return {
        active: sinceLock < 0.95,
        retained: true,
        mode: "horror",
        progress: 1,
        intensity: Math.max(0, 0.62 * (1 - clamp01(sinceLock / 0.95))),
        id,
      };
    }
    if (elapsed < stagger) {
      const frame = Math.floor(elapsed * 26);
      const earlyFlash = glitchNoise(seed * 71 + frame * 19) > 0.88;
      return {
        active: earlyFlash,
        retained: false,
        mode: earlyFlash ? "horror" : "cozy",
        progress: 0,
        intensity: earlyFlash ? 0.54 : 0,
        id,
      };
    }
    const local = elapsed - stagger;
    const progress = clamp01(local / Math.max(0.001, lockAt - stagger));
    const cycle = 0.12 + glitchNoise(seed + 89) * 0.11;
    const holdFraction = clamp(0.16 + progress * 0.76, 0.16, 0.9);
    const cyclePhase = (local + glitchNoise(seed + 101) * cycle) % cycle;
    const frame = Math.floor(local * (18 + progress * 18));
    const rapidSpike = glitchNoise(seed * 113 + frame * 29) > 0.74 - progress * 0.16;
    const horrorHeld = cyclePhase < cycle * holdFraction;
    return {
      active: true,
      retained: false,
      mode: horrorHeld || rapidSpike ? "horror" : "cozy",
      progress,
      intensity: 0.68 + progress * 0.44,
      id,
    };
  }

  function drawPostGiraffeHorrorContentEffect(rect, kind, entry, phase = postGiraffeHorrorContentPhase(kind, entry)) {
    if (!phase?.active || !rect) return;
    const intensity = phase.intensity || 0.6;
    if (phase.mode === "horror") {
      drawHeavyStaticAroundRect(rect, phase.id || contentBleedId(kind, entry), intensity);
    } else {
      drawBlueStaticAroundRect(rect, phase.id || contentBleedId(kind, entry), intensity * 0.82);
    }
  }

  function drawContentSequenceEffect(rect, kind, entry) {
    const bleed = contentBleedPhase(kind, entry);
    if (!bleed.active) return;
    const id = contentBleedId(kind, entry);
    if (bleed.phase === "flash") {
      drawHeavyStaticAroundRect(rect, id, kind === "unit" ? 0.58 : 0.5);
      return;
    }
    drawBlueStaticAroundRect(rect, id, kind === "unit" ? 0.62 : 0.52);
  }

  function drawIllusionBleedAssetOverlays() {
    if (!illusionBleedAllowed()) return;
    const targets = [
      { id: 11, rect: { x: 9, y: 4, w: 126, h: 52 }, src: STATUS_CHALK_COURSE_SRC, alpha: 0.34, chance: 0.085, intensity: 0.82 },
      { id: 12, rect: { x: 149, y: 4, w: 104, h: 52 }, src: STATUS_CHALK_COINS_SRC, alpha: 0.34, chance: 0.085, intensity: 0.82 },
      { id: 13, rect: { x: 266, y: 4, w: 104, h: 52 }, src: STATUS_CHALK_HEALTH_SRC, alpha: 0.34, chance: 0.085, intensity: 0.82 },
    ];
    targets.forEach((target) => {
      const bleed = illusionBleedPhase(target.id, target.chance);
      if (!bleed.active) return;
      if (bleed.phase === "flash") {
        drawIllusionImage(target.src, target.rect, target.id, target.alpha);
        drawHeavyStaticAroundRect(target.rect, target.id, target.intensity);
      } else {
        drawBlueStaticAroundRect(target.rect, target.id, target.intensity);
      }
    });
  }

  function drawRealityBanner() {
    const activeReveal = state.realityBreakTimer > 0;
    const banner = activeReveal
      ? copy("ui.reality.revealTitle", "ILLUSION FAILURE // WAR LAYER EXPOSED")
      : copy("ui.reality.activeTitle", "SIMULATION MALFUNCTION");
    const body = activeReveal
      ? copy("ui.reality.revealBody", "Cozy market shell compromised. Machine conflict visible beneath.")
      : copy("ui.reality.activeBody", "");
    const x = activeReveal ? 386 : 386;
    const y = activeReveal ? 8 : 3;
    const w = activeReveal ? 248 : 248;
    const h = activeReveal ? 48 : 58;
    const board = activeReveal ? null : getUiSprite(REALITY_BANNER_BOARD_SRC);
    if (board && board.complete && board.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.shadowColor = "rgba(70, 255, 99, 0.28)";
      ctx.shadowBlur = 16 + Math.abs(Math.sin(state.idleTime * 5.5)) * 8;
      ctx.drawImage(board, x, y, w, h);
      ctx.restore();
    } else {
      roundedRect(x, y, w, h, 6);
      ctx.fillStyle = activeReveal ? "rgba(45, 4, 10, 0.9)" : "rgba(5, 13, 15, 0.86)";
      ctx.fill();
      ctx.strokeStyle = activeReveal ? "rgba(255, 61, 79, 0.86)" : "rgba(70, 255, 99, 0.58)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    if (!activeReveal) drawSimulationMalfunctionBoardEffects(x, y, w, h);
    ctx.fillStyle = activeReveal ? "#ff596b" : "#46ff63";
    let titleFontSize = activeReveal ? 10 : 16;
    const titleMaxWidth = activeReveal ? w - 24 : w - 30;
    ctx.font = `900 ${titleFontSize}px Inter, sans-serif`;
    while (!activeReveal && titleFontSize > 10 && measureTextWidth(banner, ctx.font) > titleMaxWidth) {
      titleFontSize -= 1;
      ctx.font = `900 ${titleFontSize}px Inter, sans-serif`;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = activeReveal ? "alphabetic" : "middle";
    const titleX = x + w / 2;
    const titleY = activeReveal ? y + 18 : y + h / 2 + 1;
    if (!activeReveal) {
      const split = Math.round(Math.sin(state.idleTime * 27) * 1.5);
      ctx.save();
      ctx.globalAlpha = 0.52;
      ctx.fillStyle = "#ff2847";
      ctx.fillText(banner, titleX - 2 + split, titleY + 1);
      ctx.globalAlpha = 0.44;
      ctx.fillStyle = "#00e5ff";
      ctx.fillText(banner, titleX + 2 - split, titleY - 1);
      ctx.restore();
    }
    ctx.fillText(banner, titleX, titleY);
    if (!activeReveal) {
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return;
    }
    ctx.textAlign = "left";
    fitText(body, x + 12, y + 36, w - 24, "800 9px Inter, sans-serif", "#e8fff0");
  }

  function drawSimulationMalfunctionBoardEffects(x, y, w, h) {
    const pulse = 0.5 + Math.abs(Math.sin(state.idleTime * 4.2)) * 0.5;
    const frame = Math.floor(state.idleTime * 12);
    ctx.save();
    roundedRect(x + 3, y + 3, w - 6, h - 6, 5);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255, 32, 62, ${0.08 + pulse * 0.08})`;
    ctx.fillRect(x + 18, y + h - 12, w - 36, 2);
    ctx.fillStyle = `rgba(70, 255, 99, ${0.08 + pulse * 0.07})`;
    ctx.fillRect(x + 32, y + 9, w - 64, 1);
    for (let i = 0; i < 5; i++) {
      const gate = glitchNoise(frame * 43 + i * 19);
      if (gate < 0.34) continue;
      const tearX = x + 18 + glitchNoise(frame * 71 + i * 23) * (w - 64);
      const tearY = y + 12 + glitchNoise(frame * 89 + i * 29) * (h - 24);
      const tearW = 24 + glitchNoise(frame * 101 + i * 31) * 68;
      ctx.fillStyle = i % 2 === 0 ? "rgba(0, 232, 255, 0.18)" : "rgba(255, 37, 70, 0.18)";
      ctx.fillRect(Math.round(tearX), Math.round(tearY), Math.round(tearW), 2);
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = `rgba(255, 42, 74, ${0.36 + pulse * 0.24})`;
    ctx.lineWidth = 1.5;
    const corner = 18;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + corner);
    ctx.lineTo(x + 10, y + 10);
    ctx.lineTo(x + corner + 6, y + 10);
    ctx.moveTo(x + w - corner - 6, y + 10);
    ctx.lineTo(x + w - 10, y + 10);
    ctx.lineTo(x + w - 10, y + corner);
    ctx.moveTo(x + 10, y + h - corner);
    ctx.lineTo(x + 10, y + h - 10);
    ctx.lineTo(x + corner + 6, y + h - 10);
    ctx.moveTo(x + w - corner - 6, y + h - 10);
    ctx.lineTo(x + w - 10, y + h - 10);
    ctx.lineTo(x + w - 10, y + h - corner);
    ctx.stroke();
    ctx.restore();
  }

  function iconPill(x, y, w, h, iconSrc, text, fill, color, fallbackText) {
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.font = "800 16px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const image = getUiSprite(iconSrc);
    const iconSize = 22;
    const gap = 7;
    const useIcon = image && image.complete && image.naturalWidth > 0;
    const label = useIcon ? text : fallbackText;
    const textWidth = measureTextWidth(label, ctx.font);
    const totalWidth = useIcon ? iconSize + gap + textWidth : textWidth;
    let cursor = x + w / 2 - totalWidth / 2;
    if (useIcon) {
      ctx.drawImage(image, Math.round(cursor), Math.round(y + (h - iconSize) / 2), iconSize, iconSize);
      cursor += iconSize + gap;
    }
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(label, cursor, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function currencyLabel(amount, sign = "") {
    return `${sign}${amount}`;
  }

  function drawCurrencyAmount(amount, x, y, options = {}) {
    const {
      sign = "",
      align = "left",
      font = "900 14px Inter, sans-serif",
      color = "#16392d",
      iconSize = 14,
      gap = 4,
      maxWidth = Infinity,
    } = options;
    ctx.font = font;
    ctx.textBaseline = "middle";
    const image = getUiSprite(STATUS_COIN_SRC);
    const text = currencyLabel(amount, sign);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      const fallback = `${text} ${currencyTerm({ lower: true })}`;
      if (Number.isFinite(maxWidth)) {
        fitText(fallback, x, y + 4, maxWidth, font, color);
      } else {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(fallback, x, y);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return;
    }
    const textWidth = measureTextWidth(text, ctx.font);
    let totalWidth = iconSize + gap + textWidth;
    let size = iconSize;
    if (Number.isFinite(maxWidth) && totalWidth > maxWidth) {
      size = Math.max(10, iconSize - Math.ceil((totalWidth - maxWidth) / 3));
      totalWidth = size + Math.max(2, gap - 1) + textWidth;
    }
    const usedGap = size === iconSize ? gap : Math.max(2, gap - 1);
    let cursor = align === "center" ? x - totalWidth / 2 : align === "right" ? x - totalWidth : x;
    ctx.drawImage(image, Math.round(cursor), Math.round(y - size / 2), size, size);
    cursor += size + usedGap;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(text, cursor, y + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawCurrencyLine(amount, suffix, x, y, maxWidth, font, color, options = {}) {
    const { align = "center", sign = "", iconSize = 13 } = options;
    ctx.font = font;
    const amountText = currencyLabel(amount, sign);
    const suffixText = suffix ? ` ${suffix}` : "";
    const image = getUiSprite(STATUS_COIN_SRC);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      fitText(`${amountText} ${currencyTerm({ lower: true })}${suffixText}`, x, y, maxWidth, font, color);
      return;
    }
    const gap = 4;
    const suffixGap = suffixText ? 5 : 0;
    const amountWidth = measureTextWidth(amountText, ctx.font);
    const suffixWidth = suffixText ? measureTextWidth(suffixText, ctx.font) : 0;
    const totalWidth = iconSize + gap + amountWidth + suffixGap + suffixWidth;
    let cursor = align === "center" ? x - totalWidth / 2 : align === "right" ? x - totalWidth : x;
    ctx.drawImage(image, Math.round(cursor), Math.round(y - iconSize + 2), iconSize, iconSize);
    cursor += iconSize + gap;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(amountText, cursor, y);
    cursor += amountWidth + suffixGap;
    if (suffixText) ctx.fillText(suffixText, cursor, y);
  }

  function pill(x, y, w, h, text, fill, color) {
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const maxWidth = w - 14;
    let fontSize = 15;
    ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    while (fontSize > 10 && measureTextWidth(text, ctx.font) > maxWidth) {
      fontSize -= 1;
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    }
    let label = text;
    while (label.length > 3 && measureTextWidth(`${label}...`, ctx.font) > maxWidth) {
      label = label.slice(0, -1);
    }
    ctx.fillText(label === text ? text : `${label}...`, x + w / 2, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawButton(button, enabled) {
    if (realityBroken()) {
      if (button.signSrc && drawChalkSignButton(button, enabled)) return;
      drawWarButton(button, enabled);
      return;
    }
    if (button.signSrc && drawChalkSignButton(button, enabled)) return;

    roundedRect(button.x, button.y, button.w, button.h, 8);
    ctx.fillStyle = enabled ? "#16392d" : "#7a8d84";
    ctx.fill();
    ctx.fillStyle = "#f8f5df";
    ctx.font = "800 16px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const iconId = button.iconId || buttonIconId(button);
    const isSellButton = String(button.label || "").toLowerCase() === "sell";
    const hasAtlasIcon = Boolean(iconId && UI_ICON_ATLAS[iconId] && !isSellButton);
    const legacyIcon = button.icon && !hasAtlasIcon ? `${button.icon}  ` : "";
    const label = `${legacyIcon}${button.label}`;
    registerTooltip(button.x, button.y, button.w, button.h, buttonTooltip(button, enabled));
    if (button.coinAmount !== undefined && button.coinAmount !== null) {
      const coinImage = getUiSprite(STATUS_COIN_SRC);
      const coinText = String(button.coinAmount);
      const font = isSellButton ? "900 14px Inter, sans-serif" : "800 16px Inter, sans-serif";
      ctx.font = font;
      const labelWidth = measureTextWidth(label, ctx.font);
      const coinTextWidth = measureTextWidth(coinText, ctx.font);
      const iconSize = isSellButton ? 16 : 18;
      const atlasWidth = hasAtlasIcon ? iconSize + 6 : 0;
      const labelGap = isSellButton ? 7 : 10;
      const coinGap = isSellButton ? 3 : 4;
      const totalWidth = atlasWidth + labelWidth + labelGap + iconSize + coinGap + coinTextWidth;
      let cursor = button.x + button.w / 2 - totalWidth / 2;
      ctx.textAlign = "left";
      if (hasAtlasIcon) {
        drawUiAtlasIcon(iconId, cursor + iconSize / 2, button.y + button.h / 2, iconSize, { tooltip: null });
        cursor += iconSize + 6;
      }
      ctx.fillText(label, cursor, button.y + button.h / 2 + 1);
      cursor += labelWidth + labelGap;
      if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
        ctx.drawImage(coinImage, Math.round(cursor), Math.round(button.y + (button.h - iconSize) / 2), iconSize, iconSize);
        cursor += iconSize + coinGap;
        ctx.fillText(coinText, cursor, button.y + button.h / 2 + 1);
      } else {
        ctx.fillText(`${coinText} ${currencyTerm({ lower: true })}`, cursor, button.y + button.h / 2 + 1);
      }
    } else {
      const iconSize = 18;
      if (hasAtlasIcon) {
        const labelWidth = measureTextWidth(label, ctx.font);
        const totalWidth = iconSize + 6 + labelWidth;
        let cursor = button.x + button.w / 2 - totalWidth / 2;
        ctx.textAlign = "left";
        drawUiAtlasIcon(iconId, cursor + iconSize / 2, button.y + button.h / 2, iconSize, { tooltip: null });
        cursor += iconSize + 6;
        ctx.fillText(label, cursor, button.y + button.h / 2 + 1);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(label, button.x + button.w / 2, button.y + button.h / 2 + 1);
      }
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawWarButton(button, enabled) {
    roundedRect(button.x, button.y, button.w, button.h, 6);
    ctx.fillStyle = enabled ? "rgba(7, 17, 20, 0.94)" : "rgba(24, 34, 36, 0.74)";
    ctx.fill();
    ctx.strokeStyle = enabled ? "rgba(70, 255, 99, 0.78)" : "rgba(142, 155, 148, 0.42)";
    ctx.lineWidth = enabled ? 2 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    const label = actionLabel(button.label || "");
    registerTooltip(button.x, button.y, button.w, button.h, buttonTooltip({ ...button, label }, enabled));

    const accent = enabled ? "#46ff63" : "#8fa09a";
    const textColor = enabled ? "#f4fff6" : "#b8c5c1";
    ctx.fillStyle = accent;
    ctx.fillRect(button.x + 7, button.y + 7, 3, button.h - 14);
    ctx.fillStyle = textColor;
    ctx.font = button.coinAmount !== undefined && button.coinAmount !== null ? "900 13px Inter, sans-serif" : "900 15px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const primary = button.coinAmount !== undefined && button.coinAmount !== null
      ? `${label} / ${button.coinAmount}`
      : label;
    fitText(primary, button.x + 16, button.y + button.h / 2 + 1, button.w - 24, ctx.font, textColor);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawChalkSignButton(button, enabled) {
    const signSrc = currentButtonSignSrc(button);
    const image = getUiSprite(signSrc);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;

    registerTooltip(button.x, button.y, button.w, button.h, buttonTooltip(button, enabled));

    const drawX = button.x - 6;
    const drawY = Math.max(0, button.y - 6);
    const drawW = button.w + 12;
    const drawH = button.h + 12;
    ctx.save();
    ctx.globalAlpha = enabled ? 1 : 0.58;
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();

    if (!enabled) {
      roundedRect(button.x + 6, button.y + 7, button.w - 12, button.h - 14, 7);
      ctx.fillStyle = "rgba(22, 31, 27, 0.32)";
      ctx.fill();
    }

    if (realityBroken()) {
      drawWarCommandButtonText(button, enabled);
      return true;
    }

    if (button.chalkMode === "speed") {
      const value = button.speedValue || String(button.label || "").replace(/^Speed\s*/i, "");
      drawChalkButtonText("SPEED", button.x + button.w / 2, button.y + 18, {
        font: "900 9px Inter, sans-serif",
        alpha: enabled ? 0.94 : 0.62,
      });
      drawChalkButtonText(value, button.x + button.w / 2, button.y + 37, {
        font: "900 18px Inter, sans-serif",
        alpha: enabled ? 0.98 : 0.62,
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return true;
    }

    const isUpgradeSign = signSrc.includes("upgrade") || signSrc.includes("update");
    const subLabel = isUpgradeSign ? String(button.label || "").toUpperCase() : "";
    if (subLabel) {
      drawChalkButtonText(subLabel, button.x + 22, button.y + button.h - 12, {
        align: "left",
        font: "900 9px Inter, sans-serif",
        alpha: enabled ? 0.94 : 0.62,
      });
    }

    if (button.coinAmount !== undefined && button.coinAmount !== null) {
      drawChalkButtonCost(button.coinAmount, button.x + button.w - 11, button.y + button.h - 12, enabled);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    return true;
  }

  function drawWarCommandButtonText(button, enabled) {
    const alpha = enabled ? 1 : 0.62;
    if (button.chalkMode === "speed") {
      const value = button.speedValue || String(button.label || "").replace(/^Speed\s*/i, "");
      drawWarHudText(copy(["ui", "actions", "Speed"], "Speed").toUpperCase(), button.x + button.w / 2, button.y + 18, {
        font: "900 8px Inter, sans-serif",
        alpha,
        glitch: true,
        glitchIntensity: 0.7,
      });
      drawWarHudText(value, button.x + button.w / 2, button.y + 37, {
        font: "900 18px Inter, sans-serif",
        alpha,
        glitch: true,
        glitchIntensity: 0.84,
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return;
    }

    const label = String(button.label || "").toUpperCase();
    const hasCost = button.coinAmount !== undefined && button.coinAmount !== null;
    drawWarHudText(label, button.x + button.w / 2, button.y + (hasCost ? 20 : button.h / 2 + 1), {
      font: label.length > 8 ? "900 12px Inter, sans-serif" : "900 14px Inter, sans-serif",
      alpha,
      glitch: true,
      glitchIntensity: 0.78,
    });
    if (hasCost) {
      drawWarButtonCost(button.coinAmount, button.x + button.w / 2, button.y + button.h - 11, enabled);
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawChalkButtonText(text, x, y, options = {}) {
    const {
      align = "center",
      font = "900 11px Inter, sans-serif",
      alpha = 1,
    } = options;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(38, 44, 37, 0.78)";
    ctx.fillStyle = "#fff7cf";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawWarHudText(text, x, y, options = {}) {
    const {
      align = "center",
      font = "900 11px Inter, sans-serif",
      alpha = 1,
      fill = "#eaffea",
      stroke = "rgba(0, 9, 6, 0.94)",
      glitch = false,
      glitchIntensity = 1,
    } = options;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    if (glitch) {
      const split = Math.round(Math.sin(state.idleTime * 31 + x * 0.07 + y * 0.11) * 1.2 * glitchIntensity);
      ctx.globalAlpha = alpha * 0.46 * glitchIntensity;
      ctx.fillStyle = "#ff2847";
      ctx.fillText(text, x - 1.5 + split, y + 1);
      ctx.globalAlpha = alpha * 0.4 * glitchIntensity;
      ctx.fillStyle = "#00e5ff";
      ctx.fillText(text, x + 1.5 - split, y - 1);
      ctx.globalAlpha = alpha;
    }
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawWarButtonCost(amount, centerX, y, enabled) {
    const coinImage = getUiSprite(STATUS_COIN_SRC);
    const text = String(amount);
    ctx.save();
    ctx.globalAlpha = enabled ? 1 : 0.62;
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const iconSize = 11;
    const gap = 3;
    const textWidth = measureTextWidth(text, ctx.font);
    const totalWidth = iconSize + gap + textWidth;
    const startX = centerX - totalWidth / 2;
    if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
      ctx.drawImage(coinImage, Math.round(startX), Math.round(y - iconSize / 2), iconSize, iconSize);
    }
    drawWarHudText(text, startX + iconSize + gap, y + 1, {
      align: "left",
      font: "900 11px Inter, sans-serif",
      alpha: enabled ? 0.96 : 0.62,
    });
    ctx.restore();
  }

  function drawChalkButtonCost(amount, rightX, y, enabled) {
    const coinImage = getUiSprite(STATUS_COIN_SRC);
    const text = String(amount);
    ctx.save();
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const iconSize = 11;
    const gap = 2;
    const textWidth = measureTextWidth(text, ctx.font);
    const totalWidth = iconSize + gap + textWidth;
    const startX = rightX - totalWidth;
    ctx.globalAlpha = enabled ? 1 : 0.62;
    if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
      ctx.drawImage(coinImage, Math.round(startX), Math.round(y - iconSize / 2), iconSize, iconSize);
    }
    drawChalkButtonText(text, startX + iconSize + gap, y + 1, {
      align: "left",
      font: "900 11px Inter, sans-serif",
      alpha: enabled ? 0.96 : 0.62,
    });
    ctx.restore();
  }

  function buttonIconId(button) {
    const label = String(button.label || "").toLowerCase();
    if (button === buttons.shopUpgrade || label.includes("lv ") || label.includes("max lv")) return "action_upgrade";
    if (button === buttons.roll || label.includes("roll")) return "action_roll";
    if (button === buttons.battle || label.includes("battle")) return "action_battle";
    if (button === buttons.battleSpeed || label.includes("speed")) return "action_speed";
    if (button === buttons.sell || label.includes("sell") || label.includes("scrap")) return "action_sell";
    if (button === buttons.detach || label.includes("detach") || label.includes("strip")) return "action_detach";
    return null;
  }

  function buttonTooltip(button, enabled) {
    const label = String(button.label || "");
    if (button === buttons.shopUpgrade || label.startsWith("Lv ") || label === "Max Lv") {
      const tierNote = realityBroken()
        ? "Per slot: Mk 2 entries can appear at Lv 3; Mk 3 entries can appear at max level."
        : "Per slot: 2-star entries can appear at Lv 3; 3-star entries can appear at Lv 5.";
      return {
        title: label === "Max Lv" ? (realityBroken() ? "Rig maxed" : "Shop maxed") : `${upgradeTerm()} ${realityBroken() ? "rig" : "shop"}`,
        body: enabled
          ? `Raises ${realityBroken() ? "rig" : "shop"} level and improves rarity odds. ${tierNote}`
          : `Need more ${currencyTerm({ lower: true })} or already at max level. ${tierNote}`,
      };
    }
    if (button === buttons.roll || label === "Roll") {
      return {
        title: `${rollTerm()} ${realityBroken() ? "scan" : "shop"}`,
        body: enabled ? `Refreshes unlocked ${realityBroken() ? "scan" : "shop"} slots.` : `Need more ${currencyTerm({ lower: true })} to ${rollTerm({ lower: true })}.`,
      };
    }
    if (button === buttons.battle || label === "Battle") {
      return {
        title: realityBroken() ? "Deploy wave" : "Start pressure test",
        body: enabled ? (realityBroken() ? "Deploy against the next enemy team." : "Send the current pattern into the next pressure test.") : `Place at least one ${foodTerm({ lower: true })} first.`,
      };
    }
    if (button === buttons.battleSpeed || label.startsWith("Speed")) {
      return {
        title: realityBroken() ? "Telemetry speed" : "Replay speed",
        body: realityBroken() ? "Cycles combat telemetry playback speed." : "Cycles fight replay speed.",
      };
    }
    if (label.startsWith("Sell") || label.startsWith("Scrap")) return { title: realityBroken() ? "Scrap" : "Sell", body: "Refunds part of this entry's value." };
    if (label.startsWith("Detach") || label.startsWith("Strip") || button.iconId === "action_detach") return { title: realityBroken() ? "Strip weapon" : "Detach topping", body: `Moves the equipped ${toppingTerm({ lower: true })} to an open bench slot.` };
    if (label === "Next" || label === "Restart") return { title: label, body: label === "Restart" ? "Starts a new run." : "Moves to the next prep round." };
    return label ? { title: label, body: "" } : null;
  }

  function openCodexOverlay() {
    state.codexOpen = true;
    startModalTransition("codex", "enter");
    state.codexSelectedId = state.codexSelectedId || CATALOG[0]?.id || null;
    state.codexSelectedToppingId = state.codexSelectedToppingId || codexToppings()[0]?.id || null;
    state.codexSelectedDrinkId = state.codexSelectedDrinkId || codexDrinks()[0]?.id || null;
    syncCodexSelectionToVisibleEntry();
    resetCodexPreviewView();
    state.selected = null;
    state.message = copy("ui.panels.foodMenu", "Food menu");
    playGameSfx("ui-confirm", { volume: 0.55 });
    return true;
  }

  function closeCodexOverlay() {
    if (!state.codexOpen) return false;
    if (modalTransitionClosing("codex")) return true;
    startModalTransition("codex", "exit");
    if (state.codexPreview) state.codexPreview.dragging = false;
    state.message = "Prep";
    playGameSfx("ui-back", { volume: 0.5 });
    return true;
  }

  function openCombatLedgerReview() {
    if (!state.lastCombatLedger) return false;
    state.combatLedgerReview.open = true;
    startModalTransition("ledger", "enter");
    playGameSfx("ui-confirm", { volume: 0.45 });
    return true;
  }

  function closeCombatLedgerReview() {
    if (!state.combatLedgerReview?.open) return false;
    if (modalTransitionClosing("ledger")) return true;
    startModalTransition("ledger", "exit");
    playGameSfx("ui-back", { volume: 0.42 });
    return true;
  }

  function playCombatLedgerReviewActionSfx(action) {
    if (action === "openDetails" || action === "closeDetails" || action === "panel") return;
    if (action === "prevFrame" || action === "nextFrame" || action === "scrubFrame" || action === "selectEvent") {
      playThrottledGameSfx("ledger-frame", "ui-hover", { volume: 0.14, rate: action === "prevFrame" ? 0.92 : 1.06 }, 0.07);
      return;
    }
    playGameSfx("ui-confirm", { volume: 0.34 });
  }

  function optionsMenuCanOpen() {
    return window.FoodAnimalsOptionsMenuRuntime.canOpen(state);
  }

  function openOptionsMenu() {
    if (!optionsMenuCanOpen()) return false;
    window.FoodAnimalsOptionsMenuRuntime.open(state);
    startModalTransition("options", "enter");
    state.message = "Options";
    playGameSfx("ui-confirm", { volume: 0.45 });
    return true;
  }

  function closeOptionsMenu() {
    if (!state.optionsMenu.open) return false;
    if (modalTransitionClosing("options")) return true;
    startModalTransition("options", "exit");
    window.FoodAnimalsOptionsMenuRuntime.close(state);
    state.message = state.phase === "battle" ? "Battle" : state.phase === "result" ? "Result" : realityBroken() ? themedArena(currentArena()).short : "Prep";
    playGameSfx("ui-back", { volume: 0.48 });
    return true;
  }

  function optionSliderValue(slider) {
    return slider === "music" ? (gameMusic.volumeSetting ?? savedGameMusicSetting()) : (gameSfx.volumeSetting ?? savedGameSfxSetting());
  }

  function setOptionSliderValue(slider, value) {
    const next = window.FoodAnimalsOptionsMenuRuntime.sliderSetting(value);
    if (slider === "music") setGameMusicSetting(next);
    else setGameSfxSetting(next);
    state.optionsMenu.selected = slider;
    state.message = `${slider === "music" ? "Music" : "SFX"} ${next}`;
    return next;
  }

  function setOptionSliderFromPoint(slider, x) {
    const rect = slider === "music" ? OPTIONS_MENU.musicTrack : OPTIONS_MENU.sfxTrack;
    return setOptionSliderValue(slider, window.FoodAnimalsOptionsMenuRuntime.sliderValueFromPoint(rect, x));
  }

  function applyOptionsMenuHit(hit) {
    if (!state.optionsMenu.open || !hit || hit.area !== "optionsMenu") return false;
    if (modalTransitionClosing("options")) return true;
    if (hit.action === "resume" || hit.action === "close" || hit.action === "outside") return closeOptionsMenu();
    if (hit.action === "save") {
      saveCurrentRun();
      state.optionsMenu.selected = "save";
      return true;
    }
    if (hit.action === "exit") {
      state.optionsMenu.selected = "exit";
      exitToMainMenuWithSave();
      return true;
    }
    if (hit.action === "slider") {
      state.optionsMenu.dragSlider = hit.slider;
      setOptionSliderFromPoint(hit.slider, hit.x);
      playGameSfx("ui-hover", { volume: 0.26 });
      return true;
    }
    return true;
  }

  function optionsMenuLayout() {
    const musicValue = optionSliderValue("music");
    const sfxValue = optionSliderValue("sfx");
    return window.FoodAnimalsOptionsMenuRuntime.layout(OPTIONS_MENU, {
      music: musicValue,
      sfx: sfxValue,
    });
  }

  function horrorOptionsPulse() {
    return 0.5 + Math.sin(state.idleTime * 4.8) * 0.5;
  }

  function drawHorrorCornerBrackets(x, y, w, h, inset = 10, size = 30) {
    ctx.beginPath();
    ctx.moveTo(x + inset, y + inset + size);
    ctx.lineTo(x + inset, y + inset);
    ctx.lineTo(x + inset + size, y + inset);
    ctx.moveTo(x + w - inset - size, y + inset);
    ctx.lineTo(x + w - inset, y + inset);
    ctx.lineTo(x + w - inset, y + inset + size);
    ctx.moveTo(x + inset, y + h - inset - size);
    ctx.lineTo(x + inset, y + h - inset);
    ctx.lineTo(x + inset + size, y + h - inset);
    ctx.moveTo(x + w - inset - size, y + h - inset);
    ctx.lineTo(x + w - inset, y + h - inset);
    ctx.lineTo(x + w - inset, y + h - inset - size);
    ctx.stroke();
  }

  function drawHorrorOptionsPanel(panel) {
    const pulse = horrorOptionsPulse();
    ctx.shadowColor = `rgba(70, 255, 99, ${0.24 + pulse * 0.08})`;
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 10;
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    const panelGradient = ctx.createLinearGradient(panel.x, panel.y, panel.x + panel.w, panel.y + panel.h);
    panelGradient.addColorStop(0, "rgba(4, 13, 16, 0.99)");
    panelGradient.addColorStop(0.55, "rgba(3, 20, 19, 0.98)");
    panelGradient.addColorStop(1, "rgba(9, 7, 14, 0.99)");
    ctx.fillStyle = panelGradient;
    ctx.fill();
    ctx.shadowColor = "transparent";

    roundedRect(panel.x + 8, panel.y + 8, panel.w - 16, panel.h - 16, 6);
    ctx.strokeStyle = `rgba(0, 232, 255, ${0.14 + pulse * 0.08})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    roundedRect(panel.x + 5, panel.y + 5, panel.w - 10, panel.h - 10, 7);
    ctx.clip();
    ctx.fillStyle = "rgba(70, 255, 99, 0.045)";
    for (let y = panel.y + 15; y < panel.y + panel.h - 12; y += 8) {
      ctx.fillRect(panel.x + 12, Math.round(y), panel.w - 24, 1);
    }
    ctx.fillStyle = `rgba(255, 58, 82, ${0.14 + pulse * 0.06})`;
    ctx.fillRect(panel.x + 22, panel.y + 84, panel.w - 44, 2);
    ctx.fillStyle = "rgba(0, 232, 255, 0.08)";
    ctx.fillRect(panel.x + 24, panel.y + 116, 2, panel.h - 158);
    ctx.fillRect(panel.x + panel.w - 26, panel.y + 116, 2, panel.h - 158);
    ctx.restore();

    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(101, 255, 109, ${0.52 + pulse * 0.16})`;
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(255, 58, 82, ${0.38 + pulse * 0.16})`;
    drawHorrorCornerBrackets(panel.x, panel.y, panel.w, panel.h, 13, 31);
  }

  function drawHorrorOptionsSlider(slider) {
    const { rect, value, label, id } = slider;
    const selected = id === state.optionsMenu.selected || id === state.optionsMenu.dragSlider;
    const trackY = rect.y + rect.h / 2;
    const knobX = rect.x + (value / 10) * rect.w;
    const fillColor = id === "music" ? "#00e8ff" : "#ffd15b";
    const selectedGlow = selected ? 0.34 : 0.18;

    roundedRect(rect.x - 18, rect.y - 31, rect.w + 36, rect.h + 62, 7);
    ctx.fillStyle = selected ? "rgba(17, 44, 44, 0.82)" : "rgba(2, 10, 13, 0.64)";
    ctx.fill();
    ctx.lineWidth = selected ? 2 : 1;
    ctx.strokeStyle = selected ? `rgba(101, 255, 109, ${0.46 + horrorOptionsPulse() * 0.18})` : "rgba(101, 255, 109, 0.18)";
    ctx.stroke();

    ctx.fillStyle = "#e8fff0";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase(), rect.x - 7, rect.y - 22);
    ctx.textAlign = "right";
    ctx.fillStyle = fillColor;
    ctx.fillText(`${value}/10`, rect.x + rect.w + 7, rect.y - 22);

    roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
    ctx.fillStyle = "rgba(0, 5, 8, 0.9)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(101, 255, 109, 0.5)";
    ctx.stroke();

    roundedRect(rect.x + 4, rect.y + 4, Math.max(9, knobX - rect.x - 4), rect.h - 8, 3);
    const fillGradient = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
    fillGradient.addColorStop(0, fillColor);
    fillGradient.addColorStop(1, id === "music" ? "#65ff6d" : "#ff6673");
    ctx.fillStyle = fillGradient;
    ctx.fill();

    ctx.strokeStyle = "rgba(101, 255, 109, 0.38)";
    for (let tick = 0; tick <= 10; tick += 1) {
      const x = rect.x + (tick / 10) * rect.w;
      ctx.beginPath();
      ctx.moveTo(x, rect.y + rect.h + 6);
      ctx.lineTo(x, rect.y + rect.h + (tick % 5 === 0 ? 16 : 12));
      ctx.lineWidth = tick % 5 === 0 ? 2 : 1;
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "800 9px Inter, sans-serif";
    ctx.fillStyle = "#a8d6c0";
    ctx.fillText("0", rect.x, rect.y + rect.h + 19);
    ctx.fillText("5", rect.x + rect.w / 2, rect.y + rect.h + 19);
    ctx.fillText("10", rect.x + rect.w, rect.y + rect.h + 19);

    ctx.save();
    ctx.shadowColor = fillColor;
    ctx.shadowBlur = selected ? 16 : 10;
    ctx.beginPath();
    ctx.arc(knobX, trackY, 16, 0, Math.PI * 2);
    ctx.fillStyle = selected ? "#f2fff7" : "#0b1618";
    ctx.fill();
    ctx.lineWidth = selected ? 4 : 3;
    ctx.strokeStyle = `rgba(101, 255, 109, ${selectedGlow + 0.36})`;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(knobX, trackY - 7);
    ctx.lineTo(knobX + 7, trackY);
    ctx.lineTo(knobX, trackY + 7);
    ctx.lineTo(knobX - 7, trackY);
    ctx.closePath();
    ctx.fillStyle = selected ? "#06100c" : fillColor;
    ctx.fill();

    registerTooltip(rect.x - 18, rect.y - 31, rect.w + 36, rect.h + 62, {
      title: `${label} volume`,
      body: "Click or drag to adjust.",
    });
  }

  function drawOptionsSlider(slider) {
    if (realityBroken()) {
      drawHorrorOptionsSlider(slider);
      return;
    }
    const { rect, value, label, id } = slider;
    const selected = id === state.optionsMenu.selected || id === state.optionsMenu.dragSlider;
    const trackY = rect.y + rect.h / 2;
    const knobX = rect.x + (value / 10) * rect.w;
    const fillColor = id === "music" ? themeColor("accent", "#4a9e68") : themeColor("warning", "#d99043");
    const railColor = realityBroken() ? "rgba(0, 8, 9, 0.82)" : "rgba(255, 253, 232, 0.86)";
    const railStroke = selected
      ? fillColor
      : realityBroken()
        ? "rgba(70, 255, 99, 0.46)"
        : "rgba(22, 57, 45, 0.28)";

    roundedRect(rect.x - 16, rect.y - 28, rect.w + 32, rect.h + 56, 8);
    ctx.fillStyle = selected
      ? realityBroken()
        ? "rgba(70, 255, 99, 0.08)"
        : "rgba(74, 158, 104, 0.08)"
      : realityBroken()
        ? "rgba(255, 255, 255, 0.025)"
        : "rgba(22, 57, 45, 0.035)";
    ctx.fill();
    ctx.lineWidth = selected ? 2 : 1;
    ctx.strokeStyle = selected ? railStroke : realityBroken() ? "rgba(70, 255, 99, 0.12)" : "rgba(22, 57, 45, 0.1)";
    ctx.stroke();

    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "900 13px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, rect.x - 8, rect.y - 22);
    ctx.textAlign = "right";
    ctx.fillText(`${value}/10`, rect.x + rect.w + 8, rect.y - 22);

    roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
    ctx.fillStyle = railColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = railStroke;
    ctx.stroke();

    roundedRect(rect.x + 3, rect.y + 3, Math.max(8, knobX - rect.x - 3), rect.h - 6, 4);
    ctx.fillStyle = fillColor;
    ctx.fill();

    for (let tick = 0; tick <= 10; tick += 1) {
      const x = rect.x + (tick / 10) * rect.w;
      const major = tick === 0 || tick === 5 || tick === 10;
      ctx.beginPath();
      ctx.moveTo(x, rect.y + rect.h + (major ? 6 : 8));
      ctx.lineTo(x, rect.y + rect.h + (major ? 14 : 12));
      ctx.lineWidth = major ? 2 : 1;
      ctx.strokeStyle = realityBroken() ? "rgba(70, 255, 99, 0.42)" : "rgba(22, 57, 45, 0.32)";
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "800 9px Inter, sans-serif";
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.fillText("0", rect.x, rect.y + rect.h + 17);
    ctx.fillText("5", rect.x + rect.w / 2, rect.y + rect.h + 17);
    ctx.fillText("10", rect.x + rect.w, rect.y + rect.h + 17);

    ctx.beginPath();
    ctx.arc(knobX, trackY, 15, 0, Math.PI * 2);
    ctx.fillStyle = realityBroken() ? "#46ff63" : "#fff7cf";
    ctx.fill();
    ctx.lineWidth = selected ? 4 : 3;
    ctx.strokeStyle = selected ? fillColor : realityBroken() ? "rgba(70, 255, 99, 0.75)" : "rgba(22, 57, 45, 0.45)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(knobX - 5, trackY, 1.4, 0, Math.PI * 2);
    ctx.arc(knobX, trackY, 1.4, 0, Math.PI * 2);
    ctx.arc(knobX + 5, trackY, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = realityBroken() ? "rgba(0, 8, 9, 0.8)" : "rgba(22, 57, 45, 0.58)";
    ctx.fill();

    registerTooltip(rect.x - 16, rect.y - 28, rect.w + 32, rect.h + 56, {
      title: `${label} volume`,
      body: "Click or drag to adjust.",
    });
  }

  function drawOptionsMenuOverlay() {
    if (!state.optionsMenu.open) return;
    state.tooltipTargets = [];
    const layout = optionsMenuLayout();
    const { panel } = layout;
    const modal = modalTransitionVisual("options");
    const horror = realityBroken();
    const pulse = horrorOptionsPulse();
    ctx.save();
    ctx.globalAlpha *= modal.alpha;
    ctx.fillStyle = horror ? "rgba(0, 5, 8, 0.78)" : "rgba(22, 57, 45, 0.34)";
    ctx.fillRect(0, 0, W, H);
    if (horror) {
      ctx.save();
      ctx.globalAlpha *= 0.42;
      ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
      for (let y = 0; y < H; y += 5) ctx.fillRect(0, y, W, 1);
      ctx.fillStyle = `rgba(255, 58, 82, ${0.04 + pulse * 0.025})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    ctx.translate(panel.x + panel.w / 2, panel.y + panel.h / 2 + modal.offsetY);
    ctx.scale(modal.scale, modal.scale);
    ctx.translate(-(panel.x + panel.w / 2), -(panel.y + panel.h / 2));
    if (horror) {
      drawHorrorOptionsPanel(panel);
    } else {
      ctx.shadowColor = "rgba(22, 57, 45, 0.28)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 8;
      roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
      ctx.fillStyle = "rgba(255, 253, 232, 0.98)";
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(22, 57, 45, 0.24)";
      ctx.stroke();
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    if (horror) {
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillStyle = `rgba(255, 58, 82, ${0.72 + pulse * 0.18})`;
      ctx.fillText("BREACH CONTROL", panel.x + 31, panel.y + 28);
      ctx.fillStyle = "#f2fff7";
      ctx.font = "900 28px Inter, sans-serif";
      ctx.fillText("Options", panel.x + 30, panel.y + 54);
    } else {
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 25px Inter, sans-serif";
      ctx.fillText("Options", panel.x + 30, panel.y + 42);
    }
    ctx.font = horror ? "900 11px Inter, sans-serif" : "800 11px Inter, sans-serif";
    ctx.fillStyle = horror ? "#a8d6c0" : themeColor("muted", "#6a4b35");
    const sub = state.phase === "battle" ? "Battle paused" : state.phase === "result" ? "Run menu" : "Prep menu";
    ctx.fillText(horror ? sub.toUpperCase() : sub, panel.x + 31, horror ? panel.y + 78 : panel.y + 70);

    const close = layout.close;
    roundedRect(close.x, close.y, close.w, close.h, 6);
    ctx.fillStyle = state.optionsMenu.selected === "close"
      ? horror ? "rgba(255, 58, 82, 0.82)" : themeColor("panelActive", "#e7ffd9")
      : horror ? "rgba(3, 12, 15, 0.9)" : themeColor("panelSoft", "rgba(255, 249, 214, 0.74)");
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(101, 255, 109, 0.5)" : themeColor("borderDim", "rgba(22, 57, 45, 0.22)");
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    fitText("X", close.x + 8, close.y + 19, close.w - 16, "900 14px Inter, sans-serif", horror ? "#f2fff7" : themeColor("primary", "#16392d"));

    ctx.font = horror ? "900 12px Inter, sans-serif" : "800 12px Inter, sans-serif";
    const saveLine = state.optionsMenu.savedAt ? `Saved ${new Date(state.optionsMenu.savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Save before leaving the table.";
    fitText(horror ? saveLine.toUpperCase() : saveLine, panel.x + 30, panel.y + 100, panel.w - 60, ctx.font, horror ? "#ffd15b" : themeColor("muted", "#6a4b35"));

    layout.sliders.forEach(drawOptionsSlider);
    layout.buttons.forEach((button) => {
      const selected = state.optionsMenu.selected === button.id;
      roundedRect(button.rect.x, button.rect.y, button.rect.w, button.rect.h, 7);
      if (horror) {
        const buttonGradient = ctx.createLinearGradient(button.rect.x, button.rect.y, button.rect.x, button.rect.y + button.rect.h);
        if (selected) {
          buttonGradient.addColorStop(0, "#79ff80");
          buttonGradient.addColorStop(1, "#27c552");
        } else if (button.id === "exit") {
          buttonGradient.addColorStop(0, "rgba(58, 13, 20, 0.96)");
          buttonGradient.addColorStop(1, "rgba(24, 6, 11, 0.98)");
        } else {
          buttonGradient.addColorStop(0, "rgba(8, 25, 30, 0.96)");
          buttonGradient.addColorStop(1, "rgba(2, 9, 13, 0.98)");
        }
        ctx.fillStyle = buttonGradient;
      } else {
        ctx.fillStyle = selected ? themeColor("accent", "#4a9e68") : themeColor("primary", "#16392d");
      }
      ctx.fill();
      ctx.lineWidth = selected ? 3 : 2;
      ctx.strokeStyle = horror
        ? selected ? "#ffd15b" : button.id === "exit" ? "rgba(255, 102, 115, 0.5)" : "rgba(101, 255, 109, 0.32)"
        : selected ? themeColor("warning", "#d99043") : "rgba(255,255,255,0.18)";
      ctx.stroke();
      if (horror && !selected) {
        ctx.fillStyle = button.id === "exit" ? "rgba(255, 102, 115, 0.18)" : "rgba(0, 232, 255, 0.12)";
        ctx.fillRect(button.rect.x + 8, button.rect.y + 7, button.rect.w - 16, 2);
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      fitText(
        button.label,
        button.rect.x + button.rect.w / 2,
        button.rect.y + 23,
        button.rect.w - 20,
        "900 12px Inter, sans-serif",
        horror ? selected ? "#06100c" : "#f2fff7" : "#fff7cf",
        "center",
      );
      registerTooltip(button.rect.x, button.rect.y, button.rect.w, button.rect.h, {
        title: button.label,
        body: button.id === "exit" ? "Saves this run and returns to the main menu." : button.id === "save" ? "Stores this run for Continue Run." : "Closes this menu.",
      });
    });
    ctx.restore();
  }

  function drawPrep() {
    drawShopkeeperStall();
    shopSlots.forEach((slot, i) => drawSlot(slot.x, slot.y, SHOP_SLOT_W, SHOP_SLOT_H, shopEntryAt(i), "shop", i));
    itemBenchSlots.forEach((slot, i) => drawItemBenchSlot(slot, i));
    boardSlots.forEach((slot, i) => drawBoardSlot(slot, i));
    drinkSlots.forEach((slot, i) => drawDrinkSlot(slot, i));
    benchSlots.forEach((slot, i) => drawBenchSlot(slot, i));
    drawStatsPanel();
    drawDragPreview();
  }

  function drawShopkeeperStall() {
    const keeperBleed = illusionBleedPhase(2, 0.16);
    const stallBleed = shopStallBleedPhase();
    const keeperFlash = keeperBleed.phase === "flash";
    const stallFlash = stallBleed.phase === "flash";
    const keeper = getUiSprite(keeperFlash ? cozyShopkeeperSrc() : currentShopkeeperSrc());
    const stall = getUiSprite(currentShopkeeperStallSrc());
    const keeperRect = currentShopkeeperDisplayRect();
    const stallRect = SHOPKEEPER_DISPLAY.stall;

    if (keeper && keeper.complete && keeper.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      if (keeperFlash) {
        ctx.filter = "blur(1.1px)";
        ctx.globalAlpha = 0.76;
      }
      drawBreathingShopkeeper(keeper, keeperRect, { preserveAspect: keeperFlash });
      ctx.restore();
    }
    if (stall && stall.complete && stall.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(stall, stallRect.x, stallRect.y, stallRect.w, stallRect.h);
      ctx.restore();
    }
    if (keeperFlash) {
      drawHeavyStaticAroundRect(keeperRect, 2, 0.86);
    } else if (keeperBleed.phase === "pre" || keeperBleed.phase === "post") {
      drawBlueStaticAroundRect(keeperRect, 2, 1.08);
    }
    if (stallFlash) {
      drawHeavyStaticAroundRect(stallRect, 3, 0.72);
    } else if (stallBleed.phase === "pre" || stallBleed.phase === "post") {
      drawBlueStaticAroundRect(stallRect, 3, 0.82);
    }
    drawShopkeeperSellTarget();
  }

  function currentShopkeeperDisplayRect() {
    const rect = SHOPKEEPER_DISPLAY.keeper;
    if (!realityBroken()) return rect;
    const size = rect.h;
    return {
      ...rect,
      x: rect.x + (rect.w - size) / 2,
      y: rect.y + 8,
      w: size,
    };
  }

  function drawCodexMenuButton() {
    const rect = currentCodexMenuButtonRect();
    const horror = realityBroken();
    const signBleed = codexMenuSignBleedPhase();
    const signFlash = signBleed.phase === "flash";
    if (horror) getUiSprite(CODEX_MENU_BUTTON_SRC);
    const image = getUiSprite(currentCodexMenuButtonSrc());
    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: copy("ui.panels.foodMenu", "Food menu"),
      body: `Open the ${foodPluralTerm({ lower: true })}, ${toppingPluralTerm({ lower: true })}, and ${drinkPluralTerm({ lower: true })} menu.`,
    });
    ctx.save();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      const pad = horror ? 0 : 4;
      const box = { x: rect.x - pad, y: rect.y - pad, w: rect.w + pad * 2, h: rect.h + pad * 2 };
      const metrics = horror ? runtimeSpriteMetrics(image) : { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
      const aspect = metrics.w / metrics.h;
      let drawW = box.w;
      let drawH = drawW / aspect;
      if (drawH > box.h) {
        drawH = box.h;
        drawW = drawH * aspect;
      }
      ctx.drawImage(
        image,
        metrics.x,
        metrics.y,
        metrics.w,
        metrics.h,
        box.x + (box.w - drawW) / 2,
        box.y + (box.h - drawH) / 2,
        drawW,
        drawH
      );
    } else {
      roundedRect(rect.x + 8, rect.y + 10, rect.w - 16, rect.h - 20, 8);
      ctx.fillStyle = "#fff1c8";
      ctx.fill();
      ctx.strokeStyle = "#16392d";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = "900 18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", rect.x + rect.w / 2, rect.y + rect.h / 2);
    }
    ctx.restore();
    if (signFlash) {
      const cozyImage = getUiSprite(CODEX_MENU_BUTTON_SRC);
      if (cozyImage && cozyImage.complete && cozyImage.naturalWidth > 0) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.filter = "blur(0.7px)";
        ctx.globalAlpha = 0.9;
        ctx.drawImage(cozyImage, rect.x, rect.y, rect.w, rect.h);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.18;
        ctx.drawImage(cozyImage, rect.x - 2, rect.y, rect.w, rect.h);
        ctx.drawImage(cozyImage, rect.x + 2, rect.y, rect.w, rect.h);
        ctx.restore();
      }
      drawHeavyStaticAroundRect(rect, 4, 0.86);
    } else if (signBleed.phase === "pre" || signBleed.phase === "post") {
      drawBlueStaticAroundRect(rect, 4, 1.02);
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function shopkeeperSellTargetRect() {
    return {
      x: SHOPKEEPER_DISPLAY.stall.x,
      y: SHOPKEEPER_DISPLAY.stall.y,
      w: SHOPKEEPER_DISPLAY.stall.w,
      h: SHOPKEEPER_DISPLAY.stall.h,
    };
  }

  function drawShopkeeperSellTarget() {
    const rect = shopkeeperSellTargetRect();
    const sellValue = state.drag && canSellDrag(state.drag) ? dragSellValue(state.drag) : null;
    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: "Shopkeeper",
      body: sellValue === null ? `Drag owned ${foodPluralTerm({ lower: true })}, ${toppingPluralTerm({ lower: true })}, or ${drinkPluralTerm({ lower: true })} here to sell.` : `Release here to sell for ${sellValue} ${currencyTerm({ lower: true })}.`,
    });
  }

  function drawBreathingShopkeeper(image, rect, options = {}) {
    const phase = state.idleTime * ((Math.PI * 2) / SHOPKEEPER_DISPLAY.breathPeriod);
    const wave = Math.sin(phase);
    const scaleX = 1 - wave * SHOPKEEPER_DISPLAY.breathScaleX;
    const scaleY = 1 + wave * SHOPKEEPER_DISPLAY.breathScaleY;
    const bob = -wave * SHOPKEEPER_DISPLAY.breathBob;
    const aspect = options.preserveAspect && image.naturalWidth > 0 && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : rect.w / rect.h;
    let drawW = rect.w;
    let drawH = drawW / aspect;
    if (drawH > rect.h) {
      drawH = rect.h;
      drawW = drawH * aspect;
    }

    ctx.save();
    ctx.translate(rect.x + rect.w / 2, rect.y + rect.h + bob);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, -drawW / 2, -drawH, drawW, drawH);
    ctx.restore();
  }

  function drawResult() {
    const battle = visibleBattle();
    if (battle) drawBattle(battle);
    drawParticles();
    const panelAlpha = resultTransitionAlpha();
    ctx.save();
    ctx.globalAlpha *= panelAlpha;
    ctx.translate(0, (1 - panelAlpha) * 18);
    drawResultPanel();
    if (state.combatLedgerReview?.open) drawExpandedCombatLedger(state.lastCombatLedger);
    ctx.restore();
  }

  function drawSlot(x, y, w, h, unit, area, index) {
    const visual = window.FoodAnimalsSlotCanvas.slotVisualState(state, state.drag, area, index, {
      canDropDrag,
      isPotentialDropTarget,
    });
    const slotTransition = area === "shop" ? shopSlotTransition(index) : null;
    ctx.save();
    if (slotTransition) {
      const pulse = Math.sin(slotTransition.progress * Math.PI);
      const direction = slotTransition.type === "unlock" ? 1 : slotTransition.type === "upgrade" ? -1 : 0;
      const scale = 0.86 + slotTransition.eased * 0.14 + pulse * 0.035;
      ctx.translate(x, y + (1 - slotTransition.eased) * 10 * direction);
      ctx.scale(scale, scale);
      ctx.translate(-x, -y);
      ctx.globalAlpha *= 0.42 + slotTransition.eased * 0.58;
    }
    const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, w, h, area, index);
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    if (!hasArtBackdrop || visual.showHoverHighlight || visual.showOpenDrop || visual.showDragOver) {
      ctx.fillStyle = visual.showDragOver && visual.showOpenDrop
        ? "rgba(231, 255, 217, 0.78)"
        : visual.showHoverHighlight || visual.showOpenDrop
          ? "rgba(255, 249, 214, 0.62)"
          : "#f2edd2";
      ctx.fill();
    }
    ctx.strokeStyle = visual.showSelectedHighlight
      ? "#db4f38"
      : visual.showDragOver && visual.showOpenDrop
        ? "#4a9e68"
        : visual.showDragOver && visual.showBlockedDrop
          ? "#d9573c"
          : hasArtBackdrop
            ? "transparent"
            : "rgba(22, 57, 45, 0.22)";
    ctx.lineWidth = visual.showSelectedHighlight || visual.showDragOver ? 4 : 2;
    ctx.stroke();
    if (visual.showSubtleDropOutline || visual.showSubtleBlockedOutline) {
      roundedRect(x - w / 2 + 1.5, y - h / 2 + 1.5, w - 3, h - 3, 7);
      ctx.strokeStyle = visual.showSubtleBlockedOutline
        ? "rgba(217, 87, 60, 0.34)"
        : "#4a9e68";
      ctx.lineWidth = visual.isDragOver ? 2.25 : 1.5;
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    if (area === "shop" && !isShopSlotUnlocked(index)) {
      drawShopSlotUnlock(x, y, w, h, index);
      ctx.restore();
      return;
    }
    if (unit) {
      ctx.save();
      if (visual.isDragSource) ctx.globalAlpha = 0.34;
      drawUnitCard(unit, x, y, w, h, area === "shop", area !== "shop", {
        hideTileName: area === "board" || area === "bench" || area === "itemBench" || area === "drinks",
        placementArea: area,
        shopIndex: area === "shop" ? index : null,
      });
      ctx.restore();
      if (area === "shop") {
        drawShopSaleBadge(x, y, w, h, index);
        drawShopFreezeBadge(x, y, w, h, index);
      }
    }
    if (slotTransition) {
      const glow = Math.sin(slotTransition.progress * Math.PI);
      roundedRect(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6, 10);
      ctx.strokeStyle = realityBroken()
        ? `rgba(70, 255, 99, ${0.2 + glow * 0.5})`
        : `rgba(255, 234, 130, ${0.24 + glow * 0.46})`;
      ctx.lineWidth = 2 + glow * 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMergeOpportunityOverlay() {
    if (state.phase !== "prep" || state.codexOpen) return;
    shopSlots.forEach((slot, index) => {
      drawShopMergeOpportunityBadge(slot.x, slot.y, SHOP_SLOT_W, SHOP_SLOT_H, index);
    });
    boardSlots.forEach((slot, index) => {
      drawOwnedMergeOpportunityMarker(slot.x, slot.y, 72, 72, "board", index);
    });
    drinkSlots.forEach((slot, index) => {
      drawOwnedMergeOpportunityMarker(slot.x, slot.y, DRINK_SLOT_SIZE, DRINK_SLOT_SIZE, "drinks", index);
    });
    benchSlots.forEach((slot, index) => {
      drawOwnedMergeOpportunityMarker(slot.x, slot.y, 72, 72, "bench", index);
    });
    itemBenchSlots.forEach((slot, index) => {
      drawOwnedMergeOpportunityMarker(slot.x, slot.y, ITEM_BENCH_SLOT_SIZE, ITEM_BENCH_SLOT_SIZE, "itemBench", index);
    });
  }

  function drawShopMergeOpportunityBadge(x, y, w, h, index) {
    const opportunity = shopSlotMergeOpportunity(index);
    if (!opportunity) return;
    if (realityBroken()) {
      drawHorrorShopMergeOpportunityBadge(x, y, w, h, index, opportunity);
    } else {
      drawCozyShopMergeOpportunityBadge(x, y, w, h, index, opportunity);
    }
  }

  function drawCozyShopMergeOpportunityBadge(x, y, w, h, index, opportunity) {
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 180 + index * 0.75);
    ctx.save();
    roundedRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, 10);
    ctx.shadowColor = "rgba(37, 186, 94, 0.55)";
    ctx.shadowBlur = 8 + pulse * 6;
    ctx.strokeStyle = `rgba(22, 151, 78, ${0.74 + pulse * 0.22})`;
    ctx.lineWidth = 2.4 + pulse;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const badge = window.FoodAnimalsSlotCanvas.mergeBadgeRect(x, y, w, h, false);
    const { x: badgeX, y: badgeY, w: badgeW, h: badgeH } = badge;
    roundedRect(badgeX, badgeY, badgeW, badgeH, 7);
    ctx.fillStyle = "rgba(207, 255, 221, 0.98)";
    ctx.fill();
    ctx.strokeStyle = "#16974e";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#0b6a38";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MERGE", x, badgeY + badgeH / 2 + 0.5);
    ctx.fillStyle = `rgba(37, 186, 94, ${0.56 + pulse * 0.34})`;
    drawCozySparkle(badgeX - 5, badgeY + 7, 3 + pulse);
    drawCozySparkle(badgeX + badgeW + 5, badgeY + 9, 2.5 + pulse * 0.8);
    ctx.restore();

    registerTooltip(badgeX, badgeY, badgeW, badgeH, {
      title: "Merge ready",
      body: `Buy ${entryLabel(shopEntryAt(index))} to finish this merge: ${opportunity.text}.`,
    });
  }

  function drawHorrorShopMergeOpportunityBadge(x, y, w, h, index, opportunity) {
    const horror = realityBroken();
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 130 + index * 0.75);
    ctx.save();
    ctx.shadowColor = "rgba(101, 255, 109, 0.50)";
    ctx.shadowBlur = 9 + pulse * 8;
    ctx.strokeStyle = `rgba(101, 255, 109, ${0.58 + pulse * 0.28})`;
    ctx.lineWidth = 1.8 + pulse * 1.2;
    drawCornerBrackets(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 14);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255, 42, 74, ${0.22 + pulse * 0.22})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + 11, y - h / 2 + 25 + pulse * 5);
    ctx.lineTo(x + w / 2 - 11, y - h / 2 + 21 + pulse * 5);
    ctx.moveTo(x - w / 2 + 14, y + h / 2 - 19 - pulse * 4);
    ctx.lineTo(x + w / 2 - 14, y + h / 2 - 16 - pulse * 4);
    ctx.stroke();

    const badge = window.FoodAnimalsSlotCanvas.mergeBadgeRect(x, y, w, h, true);
    const { x: badgeX, y: badgeY, w: badgeW, h: badgeH } = badge;
    roundedRect(badgeX, badgeY, badgeW, badgeH, 2);
    ctx.fillStyle = "rgba(5, 24, 17, 0.96)";
    ctx.fill();
    ctx.strokeStyle = themeColor("accent", "#46ff63");
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 42, 74, 0.72)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(badgeX + 4, badgeY + 3);
    ctx.lineTo(badgeX + badgeW - 4, badgeY + 3);
    ctx.moveTo(badgeX + 5, badgeY + badgeH - 4);
    ctx.lineTo(badgeX + badgeW - 5, badgeY + badgeH - 4);
    ctx.stroke();
    ctx.fillStyle = "#caffe0";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FUSE", x, badgeY + badgeH / 2 + 0.5);
    ctx.restore();

    registerTooltip(badgeX, badgeY, badgeW, badgeH, {
      title: "Fusion target",
      body: `Deploy ${entryLabel(shopEntryAt(index))} to complete ${opportunity.text}.`,
    });
  }

  function drawOwnedMergeOpportunityMarker(x, y, w, h, area, index) {
    if (state.drag) return;
    const opportunity = ownedSlotShopMergeOpportunity(area, index);
    if (!opportunity) return;
    if (realityBroken()) {
      drawHorrorOwnedMergeOpportunityMarker(x, y, w, h, area, index, opportunity);
    } else {
      drawCozyOwnedMergeOpportunityMarker(x, y, w, h, area, index, opportunity);
    }
  }

  function drawCozyOwnedMergeOpportunityMarker(x, y, w, h, area, index, opportunity) {
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 190 + index * 0.9);
    ctx.save();
    roundedRect(x - w / 2 + 2, y - h / 2 + 2, w - 4, h - 4, 8);
    ctx.strokeStyle = `rgba(22, 151, 78, ${0.58 + pulse * 0.30})`;
    ctx.lineWidth = 1.6 + pulse * 0.8;
    ctx.stroke();
    const dotR = 5 + pulse * 1.4;
    ctx.beginPath();
    ctx.arc(x + w / 2 - 10, y - h / 2 + 10, dotR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(37, 186, 94, 0.94)";
    ctx.fill();
    ctx.strokeStyle = "rgba(8, 94, 50, 0.82)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(207, 255, 221, 0.86)";
    drawCozySparkle(x + w / 2 - 10, y - h / 2 + 10, 3.5);
    ctx.restore();

    registerTooltip(x + w / 2 - 20, y - h / 2, 20, 22, {
      title: "Shop merge",
      body: `${entryLabel(opportunity.entry)} in shop finishes this merge: ${opportunity.text}.`,
    });
  }

  function drawHorrorOwnedMergeOpportunityMarker(x, y, w, h, area, index, opportunity) {
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 140 + index * 1.1);
    const markerX = x + w / 2 - 11;
    const markerY = y - h / 2 + 11;
    ctx.save();
    ctx.strokeStyle = `rgba(101, 255, 109, ${0.46 + pulse * 0.28})`;
    ctx.lineWidth = 1.4 + pulse * 0.6;
    drawCornerBrackets(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, 9);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 42, 74, 0.72)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(markerX - 8, markerY);
    ctx.lineTo(markerX + 8, markerY);
    ctx.moveTo(markerX, markerY - 8);
    ctx.lineTo(markerX, markerY + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(markerX, markerY, 5 + pulse * 2, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(101, 255, 109, ${0.55 + pulse * 0.32})`;
    ctx.stroke();
    ctx.fillStyle = "rgba(101, 255, 109, 0.82)";
    ctx.fillRect(markerX - 2, markerY - 2, 4, 4);
    ctx.restore();

    registerTooltip(x + w / 2 - 20, y - h / 2, 20, 22, {
      title: "Fusion lock",
      body: `${entryLabel(opportunity.entry)} in shop completes ${opportunity.text}.`,
    });
  }

  function drawCozySparkle(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.45, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r * 0.45, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawCornerBrackets(x, y, w, h, length) {
    window.FoodAnimalsRealityFxCanvas.drawCornerBrackets(ctx, x, y, w, h, length);
  }

  function drawShopSaleBadge(x, y, w, h, index) {
    if (!shopSlotOnSale(index)) return;
    const rect = window.FoodAnimalsSlotCanvas.saleBadgeRect(x, y, w, h);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
    ctx.fillStyle = "#ffe27a";
    ctx.fill();
    ctx.strokeStyle = "#9c6a2f";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#7c452d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SALE", rect.x + rect.w / 2, rect.y + rect.h / 2 + 0.5);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function drawShopSlotUnlock(x, y, w, h, index) {
    const cost = shopSlotUnlockCost(index);
    const horror = realityBroken();
    const lockBleed = shopLockBleedPhase(index);
    const lockFlash = lockBleed.phase === "flash";
    const panel = window.FoodAnimalsSlotCanvas.unlockPanelRect(x, y, w, h);
    const panelX = panel.x;
    const panelY = panel.y;
    const panelW = panel.w;
    const panelH = panel.h;
    if (horror) getUiSprite(SHOP_LOCK_CLOTH_BG_SRC);
    const cloth = getUiSprite(lockFlash ? SHOP_LOCK_CLOTH_BG_SRC : currentShopLockClothBgSrc());
    roundedRect(panelX, panelY, panelW, panelH, 8);
    if (cloth && cloth.complete && cloth.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(cloth, panelX, panelY, panelW, panelH);
      ctx.fillStyle = horror && !lockFlash ? "rgba(10, 21, 18, 0.20)" : "rgba(255, 247, 224, 0.16)";
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.restore();
      roundedRect(panelX, panelY, panelW, panelH, 8);
    } else {
      ctx.fillStyle = horror && !lockFlash ? "rgba(8, 18, 18, 0.86)" : "rgba(255, 253, 232, 0.76)";
      ctx.fill();
    }
    ctx.strokeStyle = horror ? "rgba(97, 255, 108, 0.38)" : "rgba(111, 67, 33, 0.36)";
    ctx.lineWidth = 2;
    ctx.stroke();
    const lockRect = { x: panelX, y: panelY, w: panelW, h: panelH };
    if (lockFlash) {
      drawHeavyStaticAroundRect(lockRect, 940 + (index || 0), 0.74);
    } else if (lockBleed.phase === "pre" || lockBleed.phase === "post") {
      drawBlueStaticAroundRect(lockRect, 940 + (index || 0), 0.68);
    }

    const medallionY = y - 44;
    const image = getUiSprite(SHOP_LOCKED_SRC);
    const iconSize = 28;
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, x - iconSize / 2, medallionY - iconSize / 2 + 1, iconSize, iconSize);
    } else {
      ctx.fillStyle = horror ? "#baff83" : "#16392d";
      ctx.font = "900 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", x, medallionY);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    fitText(`Slot ${index + 1}`, x, y - 7, panelW - 10, "900 12px Inter, sans-serif", horror ? "#e7ffe0" : "#12372d");
    fitText("Open", x, y + 10, panelW - 12, "900 10px Inter, sans-serif", horror ? "#75ff71" : "#7b3325");
    roundedRect(x - 31, y + 18, 62, 24, 9);
    ctx.fillStyle = horror ? "rgba(8, 28, 22, 0.86)" : "rgba(255, 246, 173, 0.86)";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(101, 255, 96, 0.30)" : "rgba(142, 84, 29, 0.30)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawCurrencyAmount(cost, x, y + 34, {
      align: "center",
      font: "900 12px Inter, sans-serif",
      color: horror ? "#e9ffe8" : "#16392d",
      iconSize: 12,
      maxWidth: 56,
    });
    registerTooltip(x - w / 2, y - h / 2, w, h, {
      title: `Open ${realityBroken() ? "scan" : "shop"} slot ${index + 1}`,
      body: `Spend ${cost} ${currencyTerm({ lower: true })} to add this ${realityBroken() ? "scan" : "shop"} slot.`,
    });
  }

  function illusionSlotBackdropSrc(area, index, slotKind = null) {
    if (!realityBroken()) return cozySlotBackdropSrc(area, slotKind);
    const bleed = slotBackdropBleedPhase(area, index, slotKind);
    return bleed.phase === "flash"
      ? cozySlotBackdropSrc(area, slotKind)
      : horrorSlotBackdropSrc(area, slotKind);
  }

  function drawDecoratedSlotBackdrop(x, y, w, h, area, index = 0) {
    if (area === "shop") {
      const image = getUiSprite(illusionSlotBackdropSrc(area, index));
      if (!(image && image.complete && image.naturalWidth > 0)) return false;
      ctx.save();
      roundedRect(x - w / 2, y - h / 2, w, h, 8);
      ctx.clip();
      ctx.drawImage(image, Math.round(x - w / 2), Math.round(y - h / 2), w, h);
      ctx.restore();
      drawSlotBackdropSequenceEffect({ x: x - w / 2, y: y - h / 2, w, h }, area, index);
      return true;
    }
    if (area === "bench") {
      return drawBenchSlotBackdrop(x, y, w, h, index);
    }
    if (area === "itemBench") {
      const slot = itemBenchSlots.find((candidate) => Math.abs(candidate.x - x) < 1 && Math.abs(candidate.y - y) < 1);
      if (slot?.kind === "drink") {
        const image = getUiSprite(illusionSlotBackdropSrc(area, index, "drink"));
        if (image && image.complete && image.naturalWidth > 0) {
          const size = Math.round(Math.max(w, h) + 16);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
          ctx.restore();
          drawSlotBackdropSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, area, index, "drink");
          return true;
        }
      }
      if (slot?.kind === "topping") {
        const image = getUiSprite(illusionSlotBackdropSrc(area, index, "topping"));
        if (image && image.complete && image.naturalWidth > 0) {
          const size = Math.round(Math.max(w, h) + 16);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
          ctx.restore();
          drawSlotBackdropSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, area, index, "topping");
          return true;
        }
      }
      return drawBenchSlotBackdrop(x, y, w, h, index);
    }
    const src = area === "board" ? illusionSlotBackdropSrc(area, index) : area === "drinks" ? illusionSlotBackdropSrc(area, index) : null;
    if (!src) return false;
    const image = getUiSprite(src);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;
    const size = Math.round(Math.max(w, h) + (area === "board" ? 18 : 16));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
    ctx.restore();
    drawSlotBackdropSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, area, index);
    return true;
  }

  function drawBenchSlotBackdrop(x, y, w, h, index = 0) {
    const image = getUiSprite(illusionSlotBackdropSrc("bench", index));
    if (!(image && image.complete && image.naturalWidth > 0)) return false;
    const drawW = Math.round(w * BENCH_SLOT_BG_SCALE);
    const drawH = Math.round(h * BENCH_SLOT_BG_SCALE);
    ctx.save();
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.clip();
    ctx.drawImage(image, Math.round(x - drawW / 2), Math.round(y - drawH / 2), drawW, drawH);
    ctx.restore();
    drawSlotBackdropSequenceEffect({ x: x - drawW / 2, y: y - drawH / 2, w: drawW, h: drawH }, "bench", index);
    return true;
  }

  function drawDrinkSlot(slot, index) {
    drawSlot(slot.x, slot.y, DRINK_SLOT_SIZE, DRINK_SLOT_SIZE, state.drinks[index], "drinks", index);
    if (state.drinks[index]) return;
    const slotTooltip = {
      title: realityBroken() ? "Fuel rail" : "Combat coaster",
      body: `Place a ${drinkTerm({ lower: true })} here.`,
    };
    registerTooltip(slot.x - DRINK_SLOT_SIZE / 2, slot.y - DRINK_SLOT_SIZE / 2, DRINK_SLOT_SIZE, DRINK_SLOT_SIZE, slotTooltip);
  }

  function drawBoardSlot(slot, index) {
    drawSlot(slot.x, slot.y, 72, 72, state.board[index], "board", index);
    if (state.board[index]) return;
    registerTooltip(slot.x - 36, slot.y - 36, 72, 72, {
      title: realityBroken() ? "Deployment grid" : "Combat plate",
      body: `Place a ${foodTerm({ lower: true })} here.`,
    });
  }

  function drawBenchSlot(slot, index) {
    drawSlot(slot.x, slot.y, 72, 72, state.bench[index], "bench", index);
    if (state.bench[index]) return;
    registerTooltip(slot.x - 36, slot.y - 36, 72, 72, {
      title: "General bench",
      body: `Store ${foodPluralTerm({ lower: true })}, ${toppingPluralTerm({ lower: true })}, or ${drinkPluralTerm({ lower: true })} here.`,
    });
  }

  function drawItemBenchSlot(slot, index) {
    drawSlot(slot.x, slot.y, ITEM_BENCH_SLOT_SIZE, ITEM_BENCH_SLOT_SIZE, state.itemBench[index], "itemBench", index);
    if (state.itemBench[index]) return;
    const title = slot.kind === "drink" ? `${drinkTerm()} storage` : `${toppingTerm()} storage`;
    const body = slot.kind === "drink" ? `Store spare ${drinkPluralTerm({ lower: true })} here.` : `Store spare ${toppingPluralTerm({ lower: true })} here.`;
    registerTooltip(
      slot.x - ITEM_BENCH_SLOT_SIZE / 2,
      slot.y - ITEM_BENCH_SLOT_SIZE / 2,
      ITEM_BENCH_SLOT_SIZE,
      ITEM_BENCH_SLOT_SIZE,
      { title, body }
    );
  }

  function drawShopFreezeBadge(x, y, w, h, index) {
    const rect = shopFreezeRect(x, y, w, h);
    const frozen = state.shopFrozen[index];
    const horror = realityBroken();
    roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
    ctx.fillStyle = horror
      ? frozen ? "rgba(101, 255, 109, 0.24)" : "rgba(6, 16, 18, 0.90)"
      : frozen ? "#e7ffd9" : "rgba(255, 253, 232, 0.92)";
    ctx.fill();
    ctx.strokeStyle = horror
      ? frozen ? themeColor("accent", "#46ff63") : themeColor("borderDim", "rgba(70, 255, 99, 0.22)")
      : frozen ? "#16392d" : "rgba(22, 57, 45, 0.24)";
    ctx.lineWidth = frozen ? 2 : 1;
    ctx.stroke();
    const image = getUiSprite(frozen ? SHOP_LOCKED_SRC : SHOP_UNLOCKED_SRC);
    if (image && image.complete && image.naturalWidth > 0) {
      const iconSize = frozen ? 15 : 16;
      ctx.drawImage(image, rect.x + (rect.w - iconSize) / 2, rect.y + (rect.h - iconSize) / 2, iconSize, iconSize);
    } else {
      ctx.fillStyle = horror ? (frozen ? themeColor("accent", "#46ff63") : themeColor("muted", "#9efaaa")) : frozen ? "#16392d" : "#7c452d";
      ctx.font = "900 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frozen ? "L" : "U", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
    ctx.lineWidth = 1;
  }

  function drawDragPreview() {
    const drag = state.drag;
    if (!drag || !drag.unit) return;
    const shopPreview = drag.area === "shop";
    const w = shopPreview ? SHOP_SLOT_W : 72;
    const h = shopPreview ? SHOP_SLOT_H - 20 : 72;
    const x = Math.max(w / 2 + 6, Math.min(W - w / 2 - 6, drag.x));
    const y = Math.max(h / 2 + 6, Math.min(H - h / 2 - 6, drag.y));
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = realityBroken() ? "rgba(0, 0, 0, 0.45)" : "rgba(22, 57, 45, 0.24)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.fillStyle = realityBroken() ? "rgba(6, 16, 18, 0.92)" : "#fff9d6";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = drag.valid ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.32)");
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;
    drawUnitCard(drag.unit, x, y, w, h, shopPreview, !shopPreview, {
      hideTileName: !shopPreview,
      shopIndex: shopPreview ? drag.index : null,
    });
    ctx.restore();
  }

  function isPotentialDropTarget(drag, area, index) {
    if (area === "keeperSell") return canSellDrag(drag);
    if (isItem(drag.unit)) {
      if (area === "equipment") return isTopping(drag.unit);
      if (drag.area === "shop") {
        if (isDrink(drag.unit)) return area === "bench" || area === "itemBench" || area === "drinks";
        return area === "bench" || area === "itemBench" || area === "board" || area === "equipment";
      }
      if (drag.area === "bench" || drag.area === "itemBench") {
        if (isDrink(drag.unit)) {
          if (area !== "bench" && area !== "itemBench" && area !== "drinks") return false;
        } else if (area !== "bench" && area !== "itemBench" && area !== "board" && area !== "equipment") return false;
        return area !== drag.area || index !== drag.index;
      }
      if (drag.area === "drinks") return (area === "bench" || area === "itemBench" || area === "drinks") && (area !== drag.area || index !== drag.index);
      if (drag.area === "equipment") return area === "bench" || area === "itemBench" || area === "board" || area === "equipment";
      return false;
    }
    if (drag.area === "shop") return area === "bench" || area === "board";
    if (drag.area === "bench") return area === "bench" || area === "board";
    if (drag.area === "board") {
      if (area !== "bench" && area !== "board") return false;
      return area !== drag.area || index !== drag.index;
    }
    return false;
  }

  function canDropDrag(drag, area, index) {
    if (!drag || !isPotentialDropTarget(drag, area, index)) return false;
    if (area === "keeperSell") return canSellDrag(drag);
    const target = state[area]?.[index];
    if (isItem(drag.unit)) {
      if (area === "equipment") {
        const unit = selectedEquipmentTargetRef(drag)?.unit;
        return isTopping(drag.unit) && Boolean(unit) && !unit.item;
      }
      if (drag.area === "shop") {
        if (target && canMergeShopEntryIntoSlot(drag.unit, area, index)) return true;
        if (isDrink(drag.unit)) {
          if (area === "itemBench") return itemBenchSlotAccepts(index, drag.unit) && !target;
          return (area === "bench" || area === "drinks") && !target;
        }
        if (area === "itemBench") return itemBenchSlotAccepts(index, drag.unit) && !target;
        if (area === "bench" && !target) return true;
        return isUnit(target) && !target.item;
      }
      if (isDrink(drag.unit)) {
        if (area === "drinks") {
          if (!target) return true;
          if (!isDrink(target)) return false;
          if (drag.area === "drinks") return index !== drag.index;
          return isItemStorageArea(drag.area) && itemStorageAccepts(drag.area, drag.index, target);
        }
        if (area === "itemBench") {
          if (!itemBenchSlotAccepts(index, drag.unit)) return false;
          if (!target) return true;
          return isItemStorageArea(drag.area) && itemStorageAccepts(drag.area, drag.index, target);
        }
        if (area === "bench") {
          if (drag.area === "bench") return index !== drag.index;
          return !target && (drag.area !== area || index !== drag.index);
        }
        return false;
      }
      if (area === "itemBench") {
        if (!itemBenchSlotAccepts(index, drag.unit)) return false;
        if (!target) return true;
        return isItemStorageArea(drag.area) && itemStorageAccepts(drag.area, drag.index, target) && (drag.area !== area || index !== drag.index);
      }
      if (area === "bench") {
        if (drag.area === "equipment") return !target || (isUnit(target) && !target.item);
        if (isUnit(target)) return !target.item;
        if (drag.area === "bench") return index !== drag.index;
        return !target && (drag.area !== area || index !== drag.index);
      }
      return isUnit(target) && !target.item;
    }
    if (!target) return true;
    if (drag.area === "shop") return canMergeShopEntryIntoSlot(drag.unit, area, index);
    if (drag.area === "bench" && area === "bench") return index !== drag.index;
    if (drag.area === "bench" && area === "board") return isUnit(target);
    return drag.area === "board" && area === "board" && isUnit(target);
  }

  function drawUnitCard(unit, x, y, w, h, shopCard, facingRight = false, options = {}) {
    if (isItem(unit)) {
      drawItemCard(unit, x, y, w, h, shopCard, options);
      return;
    }
    const radius = window.FoodAnimalsCardCanvas.iconRadius(w, h, { shopCard });
    const presentationScale = horrorFoodAnimalPlacementScale(unit, options.placementArea);
    drawFoodAnimal(unit, x, y - (shopCard ? 20 : 4), radius, facingRight, {
      presentationScale,
      preserveBase: presentationScale !== 1,
    });
    if (shopCard) drawRarityBadge(x - w / 2 + 7, y - h / 2 + 7, unit.rarity, "small");
    ctx.textAlign = "center";

    if (shopCard) {
      const shopPrimary = themeColor("primary", "#16392d");
      const shopMuted = themeColor("muted", "#7c452d");
      const bottom = y + h / 2;
      fitText(displayUnitShort(unit), x, bottom - 61, w - 14, "800 12px Inter, sans-serif", shopPrimary);
      ctx.fillStyle = shopMuted;
      ctx.font = "700 12px Inter, sans-serif";
      drawTraitChips(unit.traits || [], x - w / 2 + 7, bottom - 48, w - 14, {
        fontSize: 5.5,
        minWidth: 22,
        gap: 2,
      });
      drawUpgradeStars(unit.tier, x, bottom - 25, 9, "center");
      ctx.textAlign = "center";
      drawCurrencyLine(purchaseCost(unit, options.shopIndex), `${unit.atk}/${unit.maxHp}`, x, bottom - 9, w - 12, "800 11px Inter, sans-serif", shopPrimary, {
        iconSize: 11,
      });
      ctx.textAlign = "left";
      return;
    }

    drawRarityDot(x + w / 2 - 12, y - h / 2 + 10, unit.rarity);
    if (options.hideTileName) {
      drawUpgradeStars(unit.tier, x, y + h / 2 - 6, 7, "center");
      ctx.textAlign = "left";
      return;
    }
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText(displayUnitShort(unit), x, y + h / 2 - 14);
    ctx.fillStyle = "#7c452d";
    ctx.font = "700 10px Inter, sans-serif";
    drawUpgradeStars(unit.tier, x, y + h / 2 - 4, 7, "center");
    ctx.textAlign = "left";
  }

  function horrorFoodAnimalPlacementScale(unit, area) {
    if (!realityBroken() || !isUnit(unit)) return 1;
    return area === "board" || area === "bench" || area === "battle"
      ? HORROR_PLATE_BENCH_UNIT_SCALE
      : 1;
  }

  function drawItemCard(item, x, y, w, h, shopCard, options = {}) {
    const tileDrink = !shopCard && options.hideTileName && isDrink(item);
    const radius = window.FoodAnimalsCardCanvas.iconRadius(w, h, {
      kind: "item",
      shopCard,
      tileDrink,
      tileDrinkScale: TILE_DRINK_ICON_RADIUS_SCALE,
    });
    drawItemIcon(item, x, y - (shopCard ? 31 : tileDrink ? TILE_DRINK_ICON_Y_OFFSET : 14), radius, {
      centerOpaque: tileDrink,
      opaqueAnchorY: tileDrink ? DRINK_COASTER_OPAQUE_ANCHOR_Y : 0.5,
    });
    if (shopCard) drawRarityBadge(x - w / 2 + 7, y - h / 2 + 7, item.rarity, "small");
    ctx.textAlign = "center";
    if (shopCard) {
      const shopPrimary = themeColor("primary", "#16392d");
      const shopMuted = themeColor("muted", "#7c452d");
      const bottom = y + h / 2;
      fitText(itemDisplayShort(item), x, bottom - 57, w - 14, "800 12px Inter, sans-serif", shopPrimary);
      fitText(itemCardText(item), x, bottom - 36, w - 14, "700 10px Inter, sans-serif", shopMuted);
      drawUpgradeStars(itemTier(item.tier), x, bottom - 24, 7, "center");
      drawCurrencyAmount(purchaseCost(item, options.shopIndex), x, bottom - 12, {
        align: "center",
        font: "800 11px Inter, sans-serif",
        color: shopPrimary,
        iconSize: 11,
        maxWidth: w - 14,
      });
      ctx.textAlign = "left";
      return;
    }
    if (options.hideTileName) {
      drawUpgradeStars(itemTier(item.tier), x, y + h / 2 - 5, 6, "center");
      ctx.textAlign = "left";
      return;
    }
    drawRarityDot(x + w / 2 - 12, y - h / 2 + 10, item.rarity);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText(itemDisplayShort(item), x, y + h / 2 - 13);
    ctx.fillStyle = "#7c452d";
    ctx.font = "700 10px Inter, sans-serif";
    ctx.fillText(itemCardText(item), x, y + h / 2 - 1);
    drawUpgradeStars(itemTier(item.tier), x, y + h / 2 + 10, 6, "center");
    ctx.textAlign = "left";
  }

  function stars(tier) {
    return "*".repeat(Math.max(1, tier || 1));
  }

  function drawUpgradeStars(tier, x, y, size = 10, align = "left") {
    const layout = window.FoodAnimalsCardCanvas.upgradeStarLayout(tier, x, y, size, align);
    const image = getUiSprite(UPGRADE_STAR_SRC);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      layout.stars.forEach((star) => ctx.drawImage(image, star.x, star.y, star.w, star.h));
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.fillStyle = "#f0c64a";
    ctx.strokeStyle = "#85512e";
    ctx.lineWidth = 2;
    ctx.font = `900 ${Math.max(6, Math.round(layout.pipSize * 0.95))}px Inter, sans-serif`;
    ctx.textAlign = align === "center" ? "center" : align === "right" ? "right" : "left";
    ctx.textBaseline = "middle";
    ctx.strokeText(stars(layout.count), x, y);
    ctx.fillText(stars(layout.count), x, y);
    ctx.restore();
  }

  function drawRarityBadge(x, y, rarityId, size = "normal") {
    const rarity = rarityInfo(rarityId);
    const small = size === "small";
    const w = small ? Math.max(38, Math.ceil(rarity.label.length * 5.4)) : 68;
    const h = small ? 13 : 20;
    roundedRect(x, y, w, h, small ? 4 : 5);
    if (realityBroken() && rarity.glow) {
      ctx.save();
      ctx.shadowColor = rarity.glow;
      ctx.shadowBlur = small ? 6 : 12;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = rarity.fill;
      ctx.fill();
      ctx.restore();
      roundedRect(x, y, w, h, small ? 4 : 5);
    }
    ctx.fillStyle = rarity.fill;
    ctx.fill();
    ctx.strokeStyle = realityBroken() ? rarity.stroke : small ? "rgba(22, 57, 45, 0.28)" : rarity.stroke;
    ctx.lineWidth = small ? 1 : 2;
    ctx.stroke();
    ctx.fillStyle = rarity.text;
    ctx.font = small ? "900 6.5px Inter, sans-serif" : "900 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(small ? rarity.label.toUpperCase() : rarity.label, x + w / 2, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function drawRarityDot(x, y, rarityId) {
    const rarity = rarityInfo(rarityId);
    if (realityBroken() && rarity.glow) {
      ctx.save();
      ctx.shadowColor = rarity.glow;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.arc(x, y, 3.9, 0, Math.PI * 2);
      ctx.fillStyle = rarity.fill;
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(x, y, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = rarity.fill;
    ctx.fill();
    ctx.strokeStyle = rarity.stroke;
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  function drawTraitChips(traits, x, y, maxWidth, options = {}) {
    const layout = window.FoodAnimalsCardCanvas.traitChipLayout(traits, x, y, maxWidth, {
      ...options,
      textFor: traitDisplayText,
      measure: measureTextWidth,
    });
    layout.chips.forEach((chip) => {
      const { traitId, text } = chip;
      const info = traitInfo(traitId);
      ctx.font = chip.font;
      roundedRect(chip.x, chip.y, chip.w, chip.h, 4);
      if (realityBroken()) {
        ctx.save();
        ctx.shadowColor = info.color;
        ctx.shadowBlur = 7;
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = info.color;
        ctx.fill();
        ctx.restore();
        roundedRect(chip.x, chip.y, chip.w, chip.h, 4);
      }
      ctx.fillStyle = info.color;
      ctx.fill();
      ctx.strokeStyle = realityBroken() ? "rgba(244, 255, 246, 0.28)" : "rgba(22, 57, 45, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      registerTooltip(chip.x, chip.y, chip.w, chip.h, {
        title: `${traitDisplayText(traitId)} trait`,
        body: info.effect || "Counts toward a team trait bonus.",
      });
      ctx.fillStyle = realityBroken() ? themeColor("chipText", "#06100c") : "#16392d";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, chip.x + chip.w / 2, chip.y + 8, chip.w - 5);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    });
  }

  function drawActiveTraitRows(x, y, maxWidth, maxRows = Infinity) {
    const activeTraits = activePlayerTraits().filter((trait) => trait.active);
    const traits = Number.isFinite(maxRows) ? activeTraits.slice(0, maxRows) : activeTraits;
    ctx.fillStyle = realityBroken() ? "#dfffe2" : "#16392d";
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText("Active traits", x, y);
    if (!traits.length) {
      ctx.fillStyle = realityBroken() ? "#84e08f" : "#6a4b35";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText("No active traits", x, y + 20);
      return;
    }
    traits.forEach((trait, index) => {
      const rowY = y + 20 + index * 22;
      const info = traitInfo(trait.id);
      roundedRect(x, rowY - 11, 74, 16, 4);
      if (realityBroken()) {
        ctx.save();
        ctx.shadowColor = info.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = info.color;
        ctx.fill();
        ctx.restore();
        roundedRect(x, rowY - 11, 74, 16, 4);
      }
      ctx.fillStyle = info.color;
      ctx.fill();
      ctx.strokeStyle = realityBroken() ? "rgba(244, 255, 246, 0.28)" : "rgba(22, 57, 45, 0.18)";
      ctx.stroke();
      ctx.fillStyle = realityBroken() ? themeColor("chipText", "#06100c") : "#16392d";
      ctx.font = "900 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${traitDisplayText(trait.id)} ${trait.count}`, x + 37, rowY - 3, 68);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = "700 10px Inter, sans-serif";
      fitText(trait.effect, x + 82, rowY, maxWidth - 82, "700 10px Inter, sans-serif", realityBroken() ? "#a9f6ad" : "#6a4b35");
    });
  }

  function drawArenaInfoRows(x, y, maxWidth, maxRows = 3) {
    const arena = themedArena(currentArena());
    const horror = realityBroken();
    drawInfoSectionTitle(realityBroken() ? "War Zone" : "Arena", x, y);
    roundedRect(x, y + 9, maxWidth, 34, 7);
    ctx.fillStyle = horror ? "rgba(7, 26, 21, 0.72)" : "rgba(255, 249, 214, 0.72)";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(101, 255, 96, 0.22)" : "rgba(22, 57, 45, 0.12)";
    ctx.stroke();
    roundedRect(x + 8, y + 17, 34, 16, 5);
    ctx.fillStyle = arena.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    registerTooltip(x + 8, y + 17, 34, 16, {
      title: arena.name,
      body: arena.mood,
    });
    ctx.fillStyle = horror ? themeColor("chipText", "#07100b") : "#16392d";
    ctx.font = "900 7px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(copy("ui.panels.arena", realityBroken() ? "ZONE" : "ARENA"), x + 25, y + 25, 30);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(arena.name, x + 48, y + 24, maxWidth - 56, "900 11px Inter, sans-serif", horror ? "#e7ffe5" : "#16392d");
    fitText(arena.mood, x + 48, y + 38, maxWidth - 56, "700 9px Inter, sans-serif", horror ? "#9efaaa" : "#6a4b35");
    arena.effects.slice(0, maxRows).forEach((effect, index) => {
      const rowY = y + 61 + index * 18;
      const helpful = effect.tag === "HELP";
      const colors = arenaEffectBadgeColors(helpful);
      roundedRect(x, rowY - 12, 34, 15, 4);
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.stroke();
      registerTooltip(x, rowY - 12, maxWidth, 15, {
        title: helpful ? copy("ui.panels.arenaHelp", realityBroken() ? "Zone advantage" : "Arena help") : copy("ui.panels.arenaPressure", realityBroken() ? "Zone hazard" : "Arena pressure"),
        body: effect.text,
      });
      ctx.fillStyle = colors.label;
      ctx.font = "900 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(helpful ? "UP" : "DN", x + 17, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(effect.text, x + 42, rowY, maxWidth - 42, "700 9px Inter, sans-serif", colors.text);
    });
  }

  function drawArenaRewardPendingRows(x, y, maxWidth) {
    const rows = arenaRewardPendingRows();
    if (!rows.length) return 0;
    const horror = realityBroken();
    drawInfoSectionTitle(realityBroken() ? "Zone rewards" : "Arena rewards", x, y);
    rows.slice(0, 3).forEach((row, index) => {
      const rowY = y + 20 + index * 18;
      roundedRect(x, rowY - 12, 40, 15, 4);
      ctx.fillStyle = horror ? "rgba(101, 255, 96, 0.72)" : "rgba(247, 209, 91, 0.86)";
      ctx.fill();
      ctx.strokeStyle = horror ? "rgba(244, 255, 246, 0.22)" : "rgba(138, 82, 35, 0.2)";
      ctx.stroke();
      registerTooltip(x, rowY - 12, maxWidth, 15, {
        title: row.title,
        body: row.body,
      });
      ctx.fillStyle = horror ? "#07100b" : "#6a3f14";
      ctx.font = "900 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label.toUpperCase(), x + 20, rowY - 4, 34);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(row.body, x + 48, rowY, maxWidth - 48, "700 9px Inter, sans-serif", horror ? "#9efaaa" : "#6a4b35");
    });
    return 24 + rows.slice(0, 3).length * 18;
  }

  function drawArenaBattlePanel() {
    const arena = themedArena(currentArena());
    const x = 642;
    const y = 66;
    const w = 326;
    const h = 60;
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = realityBroken() ? "rgba(5, 13, 15, 0.86)" : "rgba(255, 253, 232, 0.84)";
    ctx.fill();
    ctx.strokeStyle = realityBroken() ? "rgba(70, 255, 99, 0.42)" : "rgba(22, 57, 45, 0.2)";
    ctx.stroke();
    roundedRect(x + 10, y + 9, 42, 18, 6);
    ctx.fillStyle = arena.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.fillStyle = realityBroken() ? themeColor("chipText", "#07100b") : "#16392d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(copy("ui.panels.arena", realityBroken() ? "ZONE" : "ARENA"), x + 31, y + 18);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(arena.name, x + 60, y + 18, w - 72, "900 12px Inter, sans-serif", realityBroken() ? "#f4fff6" : "#16392d");
    fitText(arena.mood, x + 60, y + 33, w - 72, "800 8px Inter, sans-serif", realityBroken() ? "#9efaaa" : "#6a4b35");
    const chipY = y + 45;
    const gap = 5;
    const chipW = Math.floor((w - 20 - gap * 2) / 3);
    arena.effects.forEach((effect, index) => {
      const chipX = x + 10 + index * (chipW + gap);
      const helpful = effect.tag === "HELP";
      const colors = arenaEffectBadgeColors(helpful);
      roundedRect(chipX, chipY - 9, chipW, 12, 4);
      ctx.fillStyle = colors.fill;
      ctx.fill();
      registerTooltip(chipX, chipY - 9, chipW, 12, {
        title: helpful ? copy("ui.panels.arenaHelp", realityBroken() ? "Zone advantage" : "Arena help") : copy("ui.panels.arenaPressure", realityBroken() ? "Zone hazard" : "Arena pressure"),
        body: effect.text,
      });
      ctx.fillStyle = colors.label;
      ctx.font = "900 6px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(helpful ? "UP" : "DN", chipX + 12, chipY - 3);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(effect.text, chipX + 27, chipY, chipW - 31, "700 7px Inter, sans-serif", colors.text);
    });
  }

  function drawBattleMoldPanel(battle = visibleBattle()) {
    if (!battle) return;
    const mold = moldStateText(battle);
    const horror = realityBroken();
    const effectId = currentMoldStatusEffectId();
    const effectStyle = currentMoldStatusStyle();
    const x = 56;
    const y = 84;
    const w = 236;
    const h = 36;
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = mold.active ? "rgba(229, 244, 198, 0.9)" : "rgba(255, 253, 232, 0.86)";
    ctx.fill();
    ctx.strokeStyle = mold.active ? "rgba(83, 122, 54, 0.5)" : "rgba(22, 57, 45, 0.2)";
    ctx.stroke();
    roundedRect(x + 9, y + 6, 26, 24, 6);
    ctx.fillStyle = "rgba(255, 253, 232, 0.72)";
    ctx.fill();
    ctx.strokeStyle = mold.active ? "rgba(83, 122, 54, 0.45)" : "rgba(22, 57, 45, 0.15)";
    ctx.stroke();
    const icon = getStatusEffectSprite(effectId);
    if (icon && icon.complete && icon.naturalWidth) {
      const smoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(icon, x + 12, y + 7, 22, 22);
      ctx.imageSmoothingEnabled = smoothing;
    } else {
      drawStatusGlyph({ id: effectId, ...effectStyle }, x + 22, y + 18, 7);
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(horror ? "Radiation" : "Mold", x + 42, y + 15, 70, "900 10px Inter, sans-serif", mold.active ? "#587018" : "#6a4b35");
    const stackValue = horror ? mold.dose : mold.stacks;
    const label = mold.active
      ? `${horror ? "Dose" : "Stack"} ${stackValue} - ${mold.damagePct}% HP/s`
      : `In ${Math.ceil(mold.nextTickIn)}s`;
    fitText(label, x + 116, y + 22, w - 126, "900 12px Inter, sans-serif", "#16392d");
  }

  function drawInfoSectionTitle(text, x, y) {
    ctx.fillStyle = realityBroken() ? "#dfffe2" : "#16392d";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.fillText(text, x, y);
  }

  function drawInfoDivider(x, y, w) {
    ctx.strokeStyle = realityBroken() ? "rgba(101, 255, 96, 0.22)" : "rgba(22, 57, 45, 0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }

  function drawInfoMetric(label, value, x, y, w = 48) {
    roundedRect(x, y, w, 34, 6);
    ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.72)");
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
    ctx.stroke();
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 8px Inter, sans-serif";
    ctx.fillText(label, x + 7, y + 12);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 14px Inter, sans-serif";
    if (value && typeof value === "object" && value.currency !== undefined) {
      drawCurrencyAmount(value.currency, x + 7, y + 24, {
        sign: value.sign || "",
        font: "900 14px Inter, sans-serif",
        color: themeColor("primary", "#16392d"),
        iconSize: 13,
        maxWidth: w - 12,
      });
    } else {
      const text = String(value);
      const valueFont = text.length >= 5 && w <= 54 ? "900 12px Inter, sans-serif" : "900 14px Inter, sans-serif";
      fitCodexText(text, x + 7, y + 27, w - 12, valueFont, themeColor("primary", "#16392d"), 8);
    }
  }

  function drawSmallProgressBar(x, y, w, pct, color) {
    roundedRect(x, y, w, 7, 4);
    ctx.fillStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
    ctx.fill();
    const fill = Math.max(0, Math.min(w, w * pct));
    if (fill <= 0) return;
    roundedRect(x, y, fill, 7, Math.min(4, fill / 2));
    ctx.fillStyle = color;
    ctx.fill();
  }

  function traitContextForUnit(unit, ref) {
    const boardUnits = state.board.filter(isUnit);
    const current = traitSnapshotForUnits(boardUnits);
    const previewUnits = ref.area === "board" ? boardUnits : [...boardUnits, unit];
    const projected = traitSnapshotForUnits(previewUnits);
    return (unit.traits || []).map((traitId) => {
      const now = current.find((trait) => trait.id === traitId) || traitInfo(traitId);
      const next = projected.find((trait) => trait.id === traitId) || now;
      return {
        ...next,
        currentCount: now.count || 0,
        projectedCount: next.count || 0,
        preview: ref.area !== "board",
      };
    });
  }

  function drawTraitImpactRows(unit, ref, x, y, maxWidth, maxRows = 3) {
    drawInfoSectionTitle("Trait impact", x, y);
    const rows = traitContextForUnit(unit, ref).slice(0, maxRows);
    rows.forEach((trait, index) => {
      const rowY = y + 20 + index * 19;
      const info = traitInfo(trait.id);
      roundedRect(x, rowY - 12, 70, 15, 4);
      if (realityBroken()) {
        ctx.save();
        ctx.shadowColor = info.color;
        ctx.shadowBlur = 7;
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = info.color;
        ctx.fill();
        ctx.restore();
        roundedRect(x, rowY - 12, 70, 15, 4);
      }
      ctx.fillStyle = info.color;
      ctx.fill();
      ctx.strokeStyle = realityBroken() ? "rgba(101, 255, 109, 0.28)" : "rgba(22, 57, 45, 0.18)";
      ctx.stroke();
      const traitTooltip = {
        title: `${traitDisplayText(trait.id)} trait`,
        body: trait.effect || (trait.nextAt ? `Next bonus at ${trait.nextAt}.` : "Trait is inactive."),
      };
      registerTooltip(x, rowY - 12, 70, 15, traitTooltip);
      ctx.fillStyle = realityBroken() ? themeColor("chipText", "#06100c") : "#16392d";
      ctx.font = "900 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(traitDisplayText(trait.id), x + 35, rowY - 4, 64);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const countText = trait.preview ? `${trait.currentCount}>${trait.projectedCount}` : `${trait.currentCount}`;
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillText(countText, x + 78, rowY);
      const effect = trait.effect || (trait.nextAt ? `Next at ${trait.nextAt}` : "Inactive");
      fitText(effect, x + 108, rowY, maxWidth - 108, "700 10px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    });
  }

  function selectedSellButton(ref) {
    const layout = selectedPanelActionLayout(ref);
    return window.FoodAnimalsSelectedPanelCanvas.sellButton(buttons.sell, layout);
  }

  function selectedDetachButton(ref) {
    const layout = selectedPanelActionLayout(ref);
    if (ref && isUnit(ref.entry)) {
      return window.FoodAnimalsSelectedPanelCanvas.detachButton(buttons.detach, layout, true);
    }
    return buttons.detach;
  }

  function selectedPanelActionLayout(ref) {
    return window.FoodAnimalsSelectedPanelCanvas.actionLayout(INFO_PANEL, ref, {
      canDetach: (candidate) => Boolean(
        candidate &&
        isUnit(candidate.entry) &&
        (candidate.area === "bench" || candidate.area === "board") &&
        candidate.entry.item
      ),
    });
  }

  function drawSelectedEquipmentSlot(unit) {
    const rect = equipmentSlotRect();
    const hovered = state.hover?.area === "equipment";
    const canDropHere = Boolean(state.drag && isPotentialDropTarget(state.drag, "equipment", 0));
    const valid = canDropDrag(state.drag, "equipment", 0);
    const horror = realityBroken();
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.fillStyle = horror
      ? canDropHere && valid ? "rgba(37, 255, 96, 0.25)" : hovered ? "rgba(17, 44, 42, 0.92)" : "rgba(8, 20, 22, 0.78)"
      : canDropHere && valid ? "#e7ffd9" : hovered ? "#fff9d6" : "rgba(255, 249, 214, 0.74)";
    ctx.fill();
    ctx.strokeStyle = canDropHere ? (valid ? themeColor("accent", "#4a9e68") : themeColor("danger", "#d9573c")) : unit.item ? themeColor("warning", "#d99043") : themeColor("borderDim", "rgba(22, 57, 45, 0.24)");
    ctx.lineWidth = canDropHere || hovered ? 3 : 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (unit.item) {
      drawItemIcon(unit.item, rect.x + rect.w / 2, rect.y + 32, 20);
      fitText(itemDisplayShort(unit.item), rect.x + 6, rect.y + rect.h - 9, rect.w - 12, "900 9px Inter, sans-serif", themeColor("primary", "#16392d"));
    } else {
      ctx.fillStyle = horror ? themeColor("muted", "rgba(22, 57, 45, 0.52)") : "rgba(22, 57, 45, 0.52)";
      ctx.font = "900 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(realityBroken() ? "WPN" : "TOP", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
  }

  function drawFavoriteToppingRow(unit, x, y, maxWidth) {
    const favorite = favoriteToppingFor(unit);
    if (!favorite) return 0;
    const item = itemInfo(favorite.itemId);
    const horror = realityBroken();
    const fill = horror ? (favorite.unlocked ? "rgba(37, 255, 96, 0.20)" : "rgba(8, 20, 22, 0.88)") : favorite.unlocked ? "#e7ffd9" : "#fff9d6";
    const stroke = favorite.unlocked ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
    const cardTop = y - 17;
    const badgeText = favorite.unlocked ? "ACTIVE" : "FAV";
    const badgeW = favorite.unlocked ? 38 : 25;
    const badgeX = x + maxWidth - badgeW - 8;
    const iconRadius = 24;
    const iconDrawRadius = 19;
    const iconX = x + 31;
    const iconY = cardTop + 31;
    const textX = x + 68;
    const textW = badgeX - textX - 5;
    const specW = maxWidth - 76;
    const specs = favorite.specs || favoriteToppingSpecLines(unit);
    const metrics = window.FoodAnimalsSelectedPanelCanvas.favoriteToppingMetrics(
      specs,
      maxWidth,
      (line, width) => wrappedTextLines(line, width).length,
    );
    const specLineHeight = metrics.specLineHeight;
    ctx.font = "800 8.5px Inter, sans-serif";
    const cardH = metrics.cardH;
    roundedRect(x, cardTop, maxWidth, cardH, 6);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = favorite.unlocked ? 2 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
    ctx.fillStyle = horror ? "rgba(70, 255, 99, 0.10)" : favorite.unlocked ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)";
    ctx.fill();
    ctx.strokeStyle = favorite.unlocked ? themeColor("accent", "rgba(74, 158, 104, 0.42)") : themeColor("borderDim", "rgba(106, 75, 53, 0.18)");
    ctx.stroke();
    drawItemIcon(item, iconX, iconY, iconDrawRadius);

    roundedRect(badgeX, cardTop + 8, badgeW, 16, 5);
    ctx.fillStyle = favorite.unlocked ? themeColor("accent", "#4a9e68") : themeColor("warning", "#f1cf75");
    ctx.fill();
    ctx.fillStyle = horror ? "#07100b" : "#16392d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeW / 2, cardTop + 16);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    fitText(favorite.itemName, textX, cardTop + 20, textW, "900 10px Inter, sans-serif", themeColor("primary", "#16392d"));
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 8.5px Inter, sans-serif";
    let lineY = cardTop + 36;
    specs.forEach((line) => {
      const drawnRows = drawWrappedTextFull(line, textX, lineY, specW, specLineHeight);
      lineY += drawnRows * specLineHeight + 2;
    });
    return cardH;
  }

  function codexAnimalById(id = state.codexSelectedId) {
    return CATALOG.find((animal) => animal.id === id) || CATALOG[0];
  }

  function codexSelectedFormTier(animal = codexAnimalById()) {
    const maxTier = Math.max(1, animal?.forms?.length || 1);
    return Math.max(1, Math.min(maxTier, state.codexSelectedFormTier || 1));
  }

  function codexMealSelected() {
    return state.codexTab === "food" && state.codexSelectedFormTier === 0;
  }

  function codexSelectedItemTier() {
    return Math.max(1, Math.min(MAX_ITEM_TIER, state.codexSelectedItemTier || 1));
  }

  function codexToppings() {
    return ITEMS.filter((item) => isTopping(item));
  }

  function codexDrinks() {
    return ITEMS.filter((item) => isDrink(item));
  }

  function rarityRank(rarityId) {
    const ids = Object.keys(RARITIES);
    const index = ids.indexOf(rarityId || "common");
    return index >= 0 ? index : 0;
  }

  function codexFilterState(tabId = state.codexTab) {
    const defaults = CODEX_DEFAULT_FILTERS[tabId] || {};
    state.codexFilters = state.codexFilters || JSON.parse(JSON.stringify(CODEX_DEFAULT_FILTERS));
    state.codexFilters[tabId] = { ...defaults, ...(state.codexFilters[tabId] || {}) };
    return state.codexFilters[tabId];
  }

  function foodRoleGroup(animal) {
    const ability = animal?.ability || "";
    if (["guard", "heal", "cleanse", "syrup_start", "bagel_build", "row_shield", "formation_captain", "taunt_guard"].includes(ability)) return "support";
    if (["slow", "sour_aura", "sticky_lane", "pull_start", "pearl_stun", "iceberg_lock"].includes(ability)) return "control";
    if (["treat_income", "copy_luck"].includes(ability)) return "economy";
    if (["survive_scale", "ginger_decoy", "kernel_combo", "thorns"].includes(ability)) return "scaling";
    return "damage";
  }

  function toppingEffectGroup(item) {
    if (item.sellBonusGold || item.surviveGold || item.firstItemDiscountGold || item.sameLineShopChancePct) return "economy";
    if (
      item.maxHpBonusPct || item.shieldAfterAttackPct || item.hitShieldPct || item.startShieldPct ||
      item.frontDamageReductionPct || item.reviveHpPct || item.statusDamageReductionPct || item.decoyHpPct ||
      item.aoeDamageReductionPct || item.shieldCapBonusPct || item.teamOverhealShieldPct ||
      item.shieldCrackleDamagePct
    ) return "defense";
    if (
      item.healShieldBonusPct || item.healEveryThird || item.allyHastePct || item.supportSharePct ||
      item.cleanseInterval || item.supportAttackBuffPct || item.teamHastePct || item.supportRowEchoPct ||
      item.extraAdjacentHealPct
    ) return "support";
    if (
      item.damageBonusPct || item.attackSpeedPct || item.abilityPowerBonusPct || item.burnDamagePerSecond ||
      item.markDamagePct || item.glassDamageBonusPct || item.splashDamagePct || item.lateFightDamagePct ||
      item.comebackDamagePct || item.bounceDamagePct || item.firstAttacksBonusPct || item.teamVulnerabilityPct ||
      item.executeSplashBonusPct || item.executeSplashDamagePct || item.periodicDamage || item.periodicDamagePct
    ) return "offense";
    return "utility";
  }

  function drinkStatGroup(item) {
    if (item.drinkPulseType) return "pulse";
    if (item.drinkAttackSpeedPct) return "speed";
    if (item.drinkMaxHpPct) return "hp";
    if (item.drinkAbilityPowerPct) return "pwr";
    return "utility";
  }

  function drinkMatchesStatFilter(item, statId) {
    if (statId === "all") return true;
    if (statId === "speed") return Boolean(item.drinkAttackSpeedPct);
    if (statId === "hp") return Boolean(item.drinkMaxHpPct);
    if (statId === "pwr") return Boolean(item.drinkAbilityPowerPct);
    if (statId === "pulse") return Boolean(item.drinkPulseType);
    return drinkStatGroup(item) === statId;
  }

  function codexRoleLabel(roleId) {
    return window.FoodAnimalsCodexRuntime.labelFromMap(roleId, {
      all: "All",
      damage: "Damage",
      support: "Support",
      control: "Control",
      economy: "Economy",
      scaling: "Scaling",
    });
  }

  function codexEffectLabel(effectId) {
    return window.FoodAnimalsCodexRuntime.labelFromMap(effectId, {
      all: "All",
      offense: "Offense",
      defense: "Defense",
      support: "Support",
      utility: "Utility",
      economy: "Economy",
    });
  }

  function codexDrinkStatLabel(statId) {
    return window.FoodAnimalsCodexRuntime.labelFromMap(statId, {
      all: "All",
      speed: "Speed",
      hp: "Max Health",
      pwr: "Ability Power",
      pulse: "Pulse",
      utility: "Utility",
    });
  }

  function codexRarityLabel(rarityId) {
    return rarityId === "all" ? "All" : rarityInfo(rarityId).label;
  }

  function codexTraitLabel(traitId) {
    return traitId === "all" ? "All" : traitDisplayText(traitId);
  }

  function codexFilterOptions(tabId, key) {
    return window.FoodAnimalsCodexRuntime.filterOptions(tabId, key, {
      rarities: RARITIES,
      traits: TRAITS,
    });
  }

  function codexFilterLabel(tabId, key, value) {
    if (key === "rarity") return `Rarity: ${codexRarityLabel(value)}`;
    if (key === "trait") return `Trait: ${codexTraitLabel(value)}`;
    if (key === "role") return `Role: ${codexRoleLabel(value)}`;
    if (key === "effect") return `Effect: ${codexEffectLabel(value)}`;
    if (key === "stat") return `Line: ${codexDrinkStatLabel(value)}`;
    return "All";
  }

  function codexFilterRowLabel(key) {
    return {
      rarity: "Rarity",
      trait: state.codexTab === "drinks" ? "Pair" : "Trait",
      role: "Role",
      effect: "Effect",
      stat: "Line",
    }[key] || "Filter";
  }

  function codexFilterOptionText(tabId, key, value) {
    if (value === "all") return "All";
    if (key === "rarity") return rarityInfo(value).label;
    if (key === "trait") return traitDisplayText(value);
    if (key === "role") return codexRoleLabel(value);
    if (key === "effect") return codexEffectLabel(value);
    if (key === "stat") return codexDrinkStatLabel(value);
    return String(value);
  }

  function codexFilterDefs(tabId = state.codexTab) {
    const filters = codexFilterState(tabId);
    return window.FoodAnimalsCodexRuntime.filterDefs(tabId, filters, codexFilterLabel);
  }

  function codexFilterRows(tabId = state.codexTab) {
    return codexFilterDefs(tabId).map((def) => ({
      key: def.key,
      label: codexFilterRowLabel(def.key),
      options: codexFilterOptions(tabId, def.key),
    }));
  }

  function codexFilterOptionWidth(text) {
    const font = "900 8px Inter, sans-serif";
    const width = Math.ceil(measureTextWidth(text, font)) + 14;
    return Math.max(32, Math.min(CODEX_LIST.w - 56, width));
  }

  let codexFilterLayoutMemoKey = null;
  let codexFilterLayoutMemo = null;

  function codexFilterMemoKey(tabId) {
    return window.FoodAnimalsCodexRuntime.memoKey(tabId, codexFilterState(tabId), currentCopyThemeId());
  }

  function codexFilterLayout(tabId = state.codexTab) {
    const memoKey = codexFilterMemoKey(tabId);
    if (codexFilterLayoutMemoKey === memoKey && codexFilterLayoutMemo) return codexFilterLayoutMemo;
    const layout = window.FoodAnimalsCodexCanvas.filterLayout({
      list: CODEX_LIST,
      tabId,
      rows: codexFilterRows(tabId),
      optionText: codexFilterOptionText,
      optionWidth: codexFilterOptionWidth,
    });
    codexFilterLayoutMemoKey = memoKey;
    codexFilterLayoutMemo = layout;
    return layout;
  }

  function codexFilterOptionRects() {
    return codexFilterLayout().rows.flatMap((row) => row.options);
  }

  function syncCodexSelectionToVisibleEntry() {
    const entry = codexEntries()[0] || null;
    if (state.codexTab === "toppings") {
      state.codexSelectedToppingId = entry?.id || state.codexSelectedToppingId;
      state.codexSelectedItemTier = 1;
    } else if (state.codexTab === "drinks") {
      state.codexSelectedDrinkId = entry?.id || state.codexSelectedDrinkId;
      state.codexSelectedItemTier = 1;
    } else {
      state.codexSelectedId = entry?.id || state.codexSelectedId;
      state.codexSelectedFormTier = 1;
    }
  }

  function setCodexFilter(key, value) {
    const tabId = state.codexTab;
    const filters = codexFilterState(tabId);
    if (!(key in filters)) return;
    filters[key] = value;
    syncCodexSelectionToVisibleEntry();
    state.message = codexFilterLabel(tabId, key, value);
  }

  function baseCodexEntries(tabId = state.codexTab) {
    if (tabId === "toppings") return codexToppings();
    if (tabId === "drinks") return codexDrinks();
    return CATALOG;
  }

  function entryMatchesCodexFilters(entry, tabId = state.codexTab) {
    return window.FoodAnimalsCodexRuntime.filterEntries([entry], tabId, codexFilterState(tabId), {
      drinkMatchesStatFilter,
      foodRoleGroup,
      toppingEffectGroup,
    }).length > 0;
  }

  function sortCodexEntries(entries) {
    return window.FoodAnimalsCodexRuntime.sortEntries(entries, rarityRank);
  }

  let codexEntriesMemoKey = null;
  let codexEntriesMemo = null;

  function codexEntries() {
    const tabId = state.codexTab;
    const filters = codexFilterState(tabId);
    const memoKey = window.FoodAnimalsCodexRuntime.memoKey(tabId, filters);
    if (codexEntriesMemoKey === memoKey && codexEntriesMemo) return codexEntriesMemo;
    const filtered = window.FoodAnimalsCodexRuntime.filterEntries(baseCodexEntries(tabId), tabId, filters, {
      drinkMatchesStatFilter,
      foodRoleGroup,
      toppingEffectGroup,
    });
    const entries = sortCodexEntries(filtered);
    codexEntriesMemoKey = memoKey;
    codexEntriesMemo = entries;
    return entries;
  }

  function currentCodexEntry() {
    const visibleEntries = codexEntries();
    return window.FoodAnimalsCodexRuntime.currentEntry(visibleEntries, state);
  }

  function codexUnitFor(animal, tier = 1) {
    const safeTier = Math.max(1, Math.min(animal.forms?.length || 1, tier));
    const form = animal.forms?.[safeTier - 1] || animal.forms?.[0] || { name: animal.name, short: animal.short };
    const scaling = tierScaling(safeTier);
    const maxHp = Math.round(animal.hp * scaling.hp * GLOBAL_HP_SCALE);
    const atk = Math.max(1, Math.round(animal.atk * scaling.atk));
    return {
      kind: "unit",
      typeId: animal.id,
      lineName: animal.name,
      name: form.name,
      short: form.short || animal.short,
      emoji: animal.emoji,
      rarity: animal.rarity || "common",
      family: animal.family || "meal",
      traits: [...(animal.traits || [])],
      color: animal.color,
      accent: animal.accent,
      role: displayRoleLabel(animal.role),
      ability: animal.ability || "front",
      abilityText: animal.abilityText || "Front blockers",
      tier: safeTier,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower: Math.max(1, Math.round(animal.atk * scaling.ability)),
      speed: Math.max(0.28, animal.speed * scaling.speed),
      side: "ally",
      item: null,
      dead: false,
    };
  }

  function codexListLayout() {
    const filterLayout = codexFilterLayout();
    return window.FoodAnimalsCodexCanvas.listLayout({
      list: CODEX_LIST,
      filterHeight: filterLayout.height,
      tabId: state.codexTab,
    });
  }

  function codexEntryRect(index) {
    return window.FoodAnimalsCodexCanvas.entryRect(index, codexListLayout());
  }

  function codexCloseRect() {
    return window.FoodAnimalsCodexCanvas.closeRect(CODEX_PANEL);
  }

  function codexTabRect(index) {
    return window.FoodAnimalsCodexCanvas.tabRect(CODEX_PANEL, index);
  }

  function codexFormRect(index) {
    return window.FoodAnimalsCodexCanvas.formRect(CODEX_LIST, index);
  }

  function codexItemFormRect(index) {
    return window.FoodAnimalsCodexCanvas.itemFormRect(CODEX_LIST, index);
  }

  const codexDefeatStillBoundsCache = new WeakMap();

  function getCodexDefeatStillSprite(animal) {
    return getDefeatStillSprite(animal, realityBroken() ? { horror: true } : { cozy: true });
  }

  function codexDefeatStillVisibleBounds(image) {
    if (!(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)) return null;
    if (codexDefeatStillBoundsCache.has(image)) return codexDefeatStillBoundsCache.get(image);
    try {
      const scratch = document.createElement("canvas");
      scratch.width = image.naturalWidth;
      scratch.height = image.naturalHeight;
      const scratchCtx = scratch.getContext("2d", { willReadFrequently: true });
      scratchCtx.drawImage(image, 0, 0);
      const pixels = scratchCtx.getImageData(0, 0, scratch.width, scratch.height).data;
      let minX = scratch.width;
      let minY = scratch.height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < scratch.height; y++) {
        const row = y * scratch.width * 4;
        for (let x = 0; x < scratch.width; x++) {
          if (pixels[row + x * 4 + 3] <= 8) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      const bounds = maxX >= minX && maxY >= minY
        ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
        : null;
      codexDefeatStillBoundsCache.set(image, bounds);
      return bounds;
    } catch (_err) {
      codexDefeatStillBoundsCache.set(image, null);
      return null;
    }
  }

  function drawCodexDefeatStillImage(image, centerX, centerY, maxW, maxH, alpha = 0.94) {
    if (!(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)) return false;
    const bounds = codexDefeatStillVisibleBounds(image);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = alpha;
    if (bounds) {
      const scale = Math.min(maxW / bounds.w, maxH / bounds.h);
      const w = Math.max(1, Math.round(bounds.w * scale));
      const h = Math.max(1, Math.round(bounds.h * scale));
      ctx.drawImage(
        image,
        bounds.x,
        bounds.y,
        bounds.w,
        bounds.h,
        Math.round(centerX - w / 2),
        Math.round(centerY - h / 2),
        w,
        h,
      );
    } else {
      const size = Math.min(maxW, maxH);
      ctx.drawImage(image, Math.round(centerX - size / 2), Math.round(centerY - size / 2), size, size);
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
    return true;
  }

  function codexPreviewRect() {
    return window.FoodAnimalsCodexCanvas.previewRect(CODEX_LIST);
  }

  function resetCodexPreviewView() {
    state.codexPreview = window.FoodAnimalsCodexRuntime.resetPreview(state.codexPreview);
  }

  function clampCodexPreviewPan() {
    const view = state.codexPreview || (state.codexPreview = {});
    return window.FoodAnimalsCodexRuntime.clampPreview(view);
  }

  function fitCodexText(text, x, y, maxWidth, font, color, minPx = 6.5) {
    if (!realityBroken()) {
      fitText(text, x, y, maxWidth, font, color);
      return;
    }
    fitTextComplete(text, x, y, maxWidth, font, color, minPx);
  }

  function hitTestCodex(pos) {
    if (pointInRect(pos.x, pos.y, codexCloseRect())) return { area: "codexClose", index: 0 };
    for (let i = 0; i < CODEX_TABS.length; i++) {
      if (pointInRect(pos.x, pos.y, codexTabRect(i))) return { area: "codexTab", index: i };
    }
    const filterOptions = codexFilterOptionRects();
    for (let i = 0; i < filterOptions.length; i++) {
      const option = filterOptions[i];
      if (pointInRect(pos.x, pos.y, option.rect)) {
        return { area: "codexFilter", index: i, key: option.key, value: option.value };
      }
    }
    if (state.codexTab === "food") {
      const animal = currentCodexEntry();
      const formCount = Math.min(5, (animal?.forms?.length || 0) + (getCodexDefeatStillSprite(animal) ? 1 : 0));
      for (let i = 0; i < formCount; i++) {
        if (pointInRect(pos.x, pos.y, codexFormRect(i))) return { area: "codexForm", index: i };
      }
    } else if (state.codexTab === "toppings" || state.codexTab === "drinks") {
      for (let i = 0; i < MAX_ITEM_TIER; i++) {
        if (pointInRect(pos.x, pos.y, codexItemFormRect(i))) return { area: "codexItemForm", index: i };
      }
    }
    const entries = codexEntries();
    for (let i = 0; i < entries.length; i++) {
      const rect = codexEntryRect(i);
      if (rect && pointInRect(pos.x, pos.y, rect)) return { area: "codexEntry", index: i };
    }
    if (pointInRect(pos.x, pos.y, CODEX_PANEL)) return { area: "codex", index: 0 };
    return { area: "codexClose", index: 0 };
  }

  function drawCodexOverlay() {
    const panel = CODEX_PANEL;
    const entries = codexEntries();
    const entry = currentCodexEntry();
    const modal = modalTransitionVisual("codex");
    ctx.save();
    ctx.globalAlpha *= modal.alpha;
    ctx.fillStyle = realityBroken() ? "rgba(0, 0, 0, 0.68)" : "rgba(23, 34, 29, 0.48)";
    ctx.fillRect(0, 0, W, H);
    ctx.translate(panel.x + panel.w / 2, panel.y + panel.h / 2 + modal.offsetY);
    ctx.scale(modal.scale, modal.scale);
    ctx.translate(-(panel.x + panel.w / 2), -(panel.y + panel.h / 2));

    const menuBg = getUiSprite(currentFoodMenuBgSrc());
    roundedRect(panel.x, panel.y, panel.w, panel.h, 12);
    if (menuBg && menuBg.complete && menuBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(menuBg, panel.x, panel.y, panel.w, panel.h);
      ctx.fillStyle = realityBroken() ? "rgba(3, 13, 11, 0.18)" : "rgba(255, 253, 232, 0.08)";
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      if (realityBroken()) {
        ctx.fillStyle = "rgba(70, 255, 99, 0.06)";
        for (let yy = panel.y + 18; yy < panel.y + panel.h; yy += 18) ctx.fillRect(panel.x, yy, panel.w, 1);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = themeColor("panel", "#fff7dc");
      ctx.fill();
      if (realityBroken()) {
        ctx.save();
        ctx.clip();
        ctx.fillStyle = "rgba(70, 255, 99, 0.05)";
        for (let yy = panel.y + 16; yy < panel.y + panel.h; yy += 18) ctx.fillRect(panel.x, yy, panel.w, 1);
        for (let xx = panel.x + 20; xx < panel.x + panel.w; xx += 44) ctx.fillRect(xx, panel.y, 1, panel.h);
        ctx.restore();
      }
    }
    roundedRect(panel.x, panel.y, panel.w, panel.h, 12);
    ctx.strokeStyle = themeColor("border", "rgba(22, 57, 45, 0.32)");
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 26px Inter, sans-serif";
    ctx.fillText(copy("ui.panels.foodMenu", "Food Menu"), panel.x + 28, panel.y + 42);

    drawCodexCloseButton();
    drawCodexTabs();
    drawCodexEntryList(entries);
    if (!entry) drawCodexEmptyDetails();
    else if (state.codexTab === "food") drawCodexAnimalDetails(entry);
    else drawCodexItemDetails(makeItem(entry.id), state.codexTab);
    ctx.restore();
  }

  function drawCodexTabs() {
    CODEX_TABS.forEach((tab, index) => {
      const rect = codexTabRect(index);
      const active = state.codexTab === tab.id;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = active ? themeColor("panelActive", "#16392d") : hovered ? themeColor("panelHover", "#fff9d6") : themeColor("panelSoft", "rgba(255, 253, 232, 0.74)");
      ctx.fill();
      ctx.strokeStyle = active ? themeColor("accent", "#16392d") : themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
      ctx.lineWidth = active ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = active ? themeColor("primary", "#fff7dc") : themeColor("muted", "#16392d");
      ctx.font = "900 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(copy(["ui", "panels", tab.id], tab.label), rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    });
    ctx.lineWidth = 1;
  }

  function drawCodexCloseButton() {
    const rect = codexCloseRect();
    const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.fillStyle = hovered ? themeColor("panelHover", "#ffe0d8") : themeColor("panelSoft", "#fff0d1");
    ctx.fill();
    ctx.strokeStyle = hovered ? themeColor("danger", "#d9573c") : themeColor("borderDim", "rgba(22, 57, 45, 0.2)");
    ctx.lineWidth = hovered ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    registerTooltip(rect.x, rect.y, rect.w, rect.h, { title: "Close", body: "" });
  }

  function drawCodexInnerPanel(x, y, w, h, radius = 9) {
    const panelBg = getUiSprite(currentTeamIntelBgSrc());
    roundedRect(x, y, w, h, radius);
    if (panelBg && panelBg.complete && panelBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(panelBg, x, y, w, h);
      ctx.fillStyle = realityBroken() ? "rgba(6, 20, 16, 0.14)" : "rgba(255, 253, 232, 0.48)";
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    } else {
      ctx.fillStyle = themeColor("panelSoft", "rgba(255, 253, 232, 0.86)");
      ctx.fill();
    }
    roundedRect(x, y, w, h, radius);
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.14)");
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawCodexFilters() {
    const filters = codexFilterState();
    const layout = codexFilterLayout();
    layout.rows.forEach((row) => {
      fitText(row.label, CODEX_LIST.x, row.labelY, 50, "900 8px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    });
    layout.rows.flatMap((row) => row.options).forEach((option) => {
      const rect = option.rect;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      const active = filters[option.key] === option.value;
      roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
      ctx.fillStyle = active ? themeColor("panelActive", "#e7ffd9") : hovered ? themeColor("panelHover", "#fff9d6") : themeColor("panelSoft", "rgba(255, 253, 232, 0.78)");
      ctx.fill();
      ctx.strokeStyle = active ? themeColor("accent", "#4a9e68") : hovered ? themeColor("border", "rgba(106, 75, 53, 0.32)") : themeColor("borderDim", "rgba(22, 57, 45, 0.14)");
      ctx.lineWidth = active ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = active ? themeColor("primary", "#16392d") : themeColor("muted", "#6a4b35");
      ctx.font = "900 8px Inter, sans-serif";
      ctx.fillText(option.text, rect.x + 7, rect.y + 13);
    });
    ctx.lineWidth = 1;
  }

  function drawCodexEntryList(entries) {
    const layout = codexListLayout();
    drawCodexInnerPanel(CODEX_LIST.x - 12, CODEX_LIST.y - 34, CODEX_LIST.w + 16, CODEX_LIST.h + 52);

    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 13px Inter, sans-serif";
    const title = state.codexTab === "food"
      ? copy("ui.panels.food", "Food")
      : state.codexTab === "toppings"
        ? copy("ui.panels.toppings", "Toppings")
        : copy("ui.panels.drinks", "Drinks");
    ctx.fillText(`${title} (${entries.length})`, CODEX_LIST.x, CODEX_LIST.y - 13);
    fitText("Rarity order", CODEX_LIST.x + CODEX_LIST.w - 94, CODEX_LIST.y - 13, 92, "800 9px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    drawCodexFilters();

    if (!entries.length) {
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "800 12px Inter, sans-serif";
      ctx.fillText("No matches", CODEX_LIST.x + 8, layout.y + 24);
      return;
    }

    entries.forEach((entry, index) => {
      const rect = codexEntryRect(index);
      if (!rect) return;
      const selected = codexEntrySelected(entry);
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 6);
      ctx.fillStyle = selected ? themeColor("panelActive", "#e7ffd9") : hovered ? themeColor("panelHover", "#fff9d6") : themeColor("panelSoft", "rgba(255, 253, 232, 0.72)");
      ctx.fill();
      ctx.strokeStyle = selected ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      drawRarityDot(rect.x + 12, rect.y + rect.h / 2, entry.rarity);
      const font = layout.cols >= 3 ? "800 9.5px Inter, sans-serif" : "800 11px Inter, sans-serif";
      const label = state.codexTab === "food" ? displayCatalogName(entry) : displayItemName(entry);
      fitCodexText(label, rect.x + 25, rect.y + Math.round(rect.h * 0.66), rect.w - 32, font, themeColor("primary", "#16392d"), layout.cols >= 3 ? 5.6 : 6.8);
    });
  }

  function codexEntrySelected(entry) {
    if (!entry) return false;
    return entry.id === currentCodexEntry()?.id;
  }

  function drawCodexEmptyDetails() {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText("No matches", x + 24, y + 48);
  }

  function drawCodexAnimalPreview(animal, unit, selectedMeal, x, y) {
    const rect = codexPreviewRect();
    const view = clampCodexPreviewPan();
    const zoom = view.zoom || 1;
    const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 10);
    ctx.fillStyle = hovered
      ? themeColor("panelHover", "rgba(255, 249, 214, 0.9)")
      : themeColor("panelSoft", "rgba(255, 253, 232, 0.72)");
    ctx.fill();
    ctx.strokeStyle = hovered ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
    ctx.lineWidth = hovered ? 2 : 1;
    ctx.stroke();

    ctx.save();
    roundedRect(rect.x + 3, rect.y + 3, rect.w - 6, rect.h - 6, 8);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    const centerX = rect.x + rect.w / 2 + (view.panX || 0);
    const centerY = rect.y + rect.h / 2 + (view.panY || 0);
    if (selectedMeal) {
      const mealImage = getCodexDefeatStillSprite(animal);
      drawCodexDefeatStillImage(mealImage, centerX, centerY, 100 * zoom, 82 * zoom, 0.94);
    } else {
      drawFoodAnimal(unit, centerX, centerY + 4 * zoom, 42 * zoom, true);
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
    ctx.lineWidth = 1;

    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: realityBroken() ? "War manifest preview" : "Field guide preview",
      body: "Select another form or entry to update the preview.",
    });
  }

  function drawCodexAnimalDetails(animal) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    const selectedMeal = codexMealSelected();
    const selectedTier = selectedMeal ? 1 : codexSelectedFormTier(animal);
    const unit = codexUnitFor(animal, selectedTier);
    const form = selectedMeal ? { name: realityBroken() ? "Wreck" : "Meal", short: realityBroken() ? "Wreck" : "Meal" } : animal.forms?.[selectedTier - 1] || { name: animal.name, short: animal.short };
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);

    drawCodexAnimalPreview(animal, unit, selectedMeal, x, y);
    if (!selectedMeal) drawUpgradeStars(selectedTier, x + 73, y + 148, 9, "center");
    drawCodexAttackParticlePreview(animal, x + w - 42, y + 82, 34);

    const headerReserve = 82;
    ctx.fillStyle = "#16392d";
    ctx.font = "900 20px Inter, sans-serif";
    fitCodexText(displayCatalogName(animal), x + 128, y + 36, w - 144 - headerReserve, "900 20px Inter, sans-serif", themeColor("primary", "#16392d"), 9);
    fitCodexText(selectedMeal ? form.name : displayCatalogForm(animal, selectedTier, "name"), x + 128, y + 64, w - 144 - headerReserve, "900 16px Inter, sans-serif", themeColor("primary", "#16392d"), 8.2);
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 12px Inter, sans-serif";
    fitCodexText(`${displayRoleLabel(animal.role) || displayEntryTypeLabel(unit)} - ${familyLabel(animal.family)}`, x + 128, y + 84, w - 144 - headerReserve, "800 12px Inter, sans-serif", themeColor("muted", "#6a4b35"), 8);
    drawRarityBadge(x + 128, y + 99, animal.rarity, "small");
    drawTraitChips(animal.traits || [], x + 196, y + 99, w - 210 - headerReserve, { maxRows: 2, fontSize: 8, minWidth: 38, rowHeight: 16 });

    const metricY = y + 154;
    drawInfoMetric("ATK", unit.atk, x + 20, metricY, 56);
    drawInfoMetric("HP", unit.maxHp, x + 86, metricY, 64);
    drawInfoMetric("CD", unit.speed.toFixed(2), x + 160, metricY, 58);

    drawInfoDivider(x + 20, y + 209, w - 40);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Forms", x + 20, y + 234);
    (animal.forms || []).slice(0, 4).forEach((form, index) => {
      const formUnit = codexUnitFor(animal, index + 1);
      const rect = codexFormRect(index);
      const selected = !selectedMeal && index + 1 === selectedTier;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = selected ? themeColor("panelActive", "rgba(231, 255, 217, 0.86)") : hovered ? themeColor("panelHover", "rgba(255, 249, 214, 0.88)") : themeColor("panelSoft", "rgba(255, 253, 232, 0.46)");
      ctx.fill();
      ctx.strokeStyle = selected ? themeColor("accent", "#4a9e68") : hovered ? themeColor("border", "rgba(106, 75, 53, 0.32)") : themeColor("borderDim", "rgba(22, 57, 45, 0.11)");
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      const centerX = rect.x + rect.w / 2;
      drawFoodAnimal(formUnit, centerX, y + 268, 15, true);
      drawUpgradeStars(index + 1, centerX, y + 296, 7, "center");
      fitText(displayCatalogForm(animal, index + 1, "short"), rect.x + 5, y + 313, rect.w - 10, "800 8px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    });
    const mealRect = codexFormRect(4);
    const mealSelected = selectedMeal;
    const mealHovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, mealRect);
    roundedRect(mealRect.x, mealRect.y, mealRect.w, mealRect.h, 8);
    ctx.fillStyle = mealSelected ? themeColor("panelActive", "rgba(231, 255, 217, 0.86)") : mealHovered ? themeColor("panelHover", "rgba(255, 249, 214, 0.88)") : themeColor("panelSoft", "rgba(255, 253, 232, 0.46)");
    ctx.fill();
    ctx.strokeStyle = mealSelected ? themeColor("accent", "#4a9e68") : mealHovered ? themeColor("border", "rgba(106, 75, 53, 0.32)") : themeColor("borderDim", "rgba(22, 57, 45, 0.11)");
    ctx.lineWidth = mealSelected ? 2 : 1;
    ctx.stroke();
    const mealImage = getCodexDefeatStillSprite(animal);
    const mealCenterX = mealRect.x + mealRect.w / 2;
    drawCodexDefeatStillImage(mealImage, mealCenterX, y + 268, 52, 44, 0.9);
    fitText(realityBroken() ? "Wreck" : "Meal", mealRect.x + 5, y + 313, mealRect.w - 10, "800 8px Inter, sans-serif", themeColor("muted", "#6a4b35"));

    const favoriteH = drawCodexFavoriteToppingDetails(unit, x + 20, y + 328, w - 40);
    const effectsTitleY = y + 328 + favoriteH + 12;
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText("Effects by level", x + 20, effectsTitleY);
    drawCodexLevelEffectFullRows(
      (animal.forms || []).slice(0, 4).map((_, index) => ({
        label: `Lv ${index + 1}`,
        text: abilitySpecLine(codexUnitFor(animal, index + 1)),
      })),
      x + 20,
      effectsTitleY + 15,
      w - 40
    );

  }

  function drawCodexAttackParticlePreview(animal, centerX, centerY, radius) {
    const image = getAttackParticleSprite(animal?.id);
    roundedRect(centerX - radius, centerY - radius, radius * 2, radius * 2, 8);
    ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.62)");
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
    ctx.lineWidth = 1;
    ctx.stroke();
    if (!image || !image.complete || image.naturalWidth <= 0) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.94;
    const size = radius * 1.48;
    ctx.drawImage(image, Math.round(centerX - size / 2), Math.round(centerY - size / 2), size, size);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawCodexFavoriteToppingDetails(unit, x, y, maxWidth) {
    const favorite = favoriteToppingFor(unit);
    if (!favorite) return 0;
    const item = itemInfo(favorite.itemId);
    const specs = favorite.specs || favoriteToppingSpecLines(unit);
    const lineHeight = 8.5;
    const specFont = "800 8px Inter, sans-serif";
    ctx.font = specFont;
    const iconSize = 48;
    const iconPad = 8;
    const textX = x + iconSize + iconPad + 12;
    const textW = maxWidth - iconSize - iconPad - 50;
    const specW = maxWidth - iconSize - iconPad - 24;
    const specRows = specs.reduce((total, line) => total + wrappedTextLines(line, specW).length, 0);
    const cardH = Math.max(78, 34 + specRows * lineHeight + Math.max(0, specs.length - 1) * 2);

    roundedRect(x, y, maxWidth, cardH, 7);
    ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.78)");
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
    ctx.lineWidth = 1;
    ctx.stroke();

    roundedRect(x + 8, y + 10, iconSize, iconSize, 8);
    ctx.fillStyle = realityBroken() ? "rgba(6, 16, 18, 0.92)" : "rgba(255,255,255,0.8)";
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(106, 75, 53, 0.16)");
    ctx.lineWidth = 1;
    ctx.stroke();
    drawItemIcon(item, x + 8 + iconSize / 2, y + 10 + iconSize / 2, 22);
    fitText(favorite.itemName, textX, y + 17, textW, "900 10px Inter, sans-serif", themeColor("primary", "#16392d"));
    roundedRect(x + maxWidth - 30, y + 8, 22, 14, 5);
    ctx.fillStyle = "#f1cf75";
    ctx.fill();
    ctx.fillStyle = realityBroken() ? "#07100b" : "#16392d";
    ctx.font = "900 6.5px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FAV", x + maxWidth - 19, y + 15);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = specFont;
    let lineY = y + 32;
    specs.forEach((line) => {
      const drawnRows = drawWrappedTextFull(line, textX, lineY, specW, lineHeight);
      lineY += drawnRows * lineHeight + 2;
    });
    return cardH;
  }

  function drawCodexLevelEffectFullRows(rows, x, y, maxWidth) {
    const labelW = 28;
    const gap = 9;
    const textX = x + labelW + gap;
    const textW = maxWidth - labelW - gap;
    const lineHeight = 9.5;
    const textFont = "800 8.5px Inter, sans-serif";
    ctx.font = textFont;
    let rowY = y;
    rows.forEach((row, index) => {
      const lines = wrappedTextLines(row.text, textW);
      const rowH = Math.max(15, lines.length * lineHeight + 3);
      roundedRect(x, rowY - 11, labelW, 14, 4);
      ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.82)");
      ctx.fill();
      ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label, x + labelW / 2, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = textFont;
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, textX, rowY + lineIndex * lineHeight);
      });
      rowY += rowH + 1;
    });
  }

  function drawCodexItemDetails(item, tabId) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    const typeLabel = tabId === "drinks" ? copy("ui.types.drink", "Drink") : copy("ui.types.topping", "Topping");
    const selectedTier = codexSelectedItemTier();
    const selectedItem = makeItem(item.id, selectedTier);
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);

    drawItemIcon(selectedItem, x + 58, y + 82, 42);
    drawUpgradeStars(selectedTier, x + 58, y + 136, 9, "center");
    const headerReserve = isDrink(item) ? 82 : 0;
    if (isDrink(item)) drawCodexDrinkParticlePreview(item, x + w - 42, y + 82, 34);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 20px Inter, sans-serif";
    fitCodexText(displayItemName(item), x + 128, y + 36, w - 144 - headerReserve, "900 20px Inter, sans-serif", themeColor("primary", "#16392d"), 9);
    fitCodexText(`Lv ${selectedTier}`, x + 128, y + 64, w - 144 - headerReserve, "900 16px Inter, sans-serif", themeColor("primary", "#16392d"), 9.5);
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 12px Inter, sans-serif";
    fitCodexText(`${typeLabel} - ${itemCardText(selectedItem)}`, x + 128, y + 84, w - 144 - headerReserve, "800 12px Inter, sans-serif", themeColor("muted", "#6a4b35"), 8);
    drawRarityBadge(x + 128, y + 99, item.rarity, "small");
    if (isDrink(item) && item.pairTraits?.length) {
      drawTraitChips(item.pairTraits, x + 196, y + 99, w - 210 - headerReserve, { maxRows: 2, fontSize: 8, minWidth: 38, rowHeight: 16 });
    }

    const stat = itemPrimaryStat(selectedItem);
    const metricY = y + 154;
    drawInfoMetric("COST", { currency: entryCost(selectedItem) }, x + 20, metricY, 60);
    drawInfoMetric(stat.label, stat.value, x + 90, metricY, 76);
    drawInfoMetric("TYPE", isDrink(item) ? copy("ui.types.drink", "Drink") : copy("ui.types.topping", "Top"), x + 176, metricY, 66);
    drawInfoMetric("SHOP", selectedItem.shopWeight || 1, x + 252, metricY, 58);

    drawInfoDivider(x + 20, y + 209, w - 40);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Forms", x + 20, y + 234);
    for (let tier = 1; tier <= MAX_ITEM_TIER; tier += 1) {
      const formItem = makeItem(item.id, tier);
      const fx = x + 48 + (tier - 1) * 96;
      const rect = codexItemFormRect(tier - 1);
      const selected = tier === selectedTier;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = selected ? themeColor("panelActive", "rgba(231, 255, 217, 0.86)") : hovered ? themeColor("panelHover", "rgba(255, 249, 214, 0.88)") : themeColor("panelSoft", "rgba(255, 253, 232, 0.46)");
      ctx.fill();
      ctx.strokeStyle = selected ? themeColor("accent", "#4a9e68") : hovered ? themeColor("border", "rgba(106, 75, 53, 0.32)") : themeColor("borderDim", "rgba(22, 57, 45, 0.11)");
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      drawItemIcon(formItem, fx, y + 272, 22);
      drawUpgradeStars(tier, fx, y + 308, 9, "center");
      fitText(`Lv ${tier}`, fx - 30, y + 328, 60, "800 9px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    }

    drawInfoDivider(x + 20, y + 342, w - 40);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 13px Inter, sans-serif";
    if (isDrink(item)) {
      ctx.fillText("Stat effects by level", x + 20, y + 367);
      drawCodexLevelEffectRows(
        Array.from({ length: MAX_ITEM_TIER }, (_, index) => {
          const tier = index + 1;
          return {
            label: `Lv ${tier}`,
            text: drinkStatLevelEffectLine(makeItem(item.id, tier)),
          };
        }),
        x + 20,
        y + 382,
        w - 40,
        { rowHeight: 15, textFont: "800 8px Inter, sans-serif" }
      );
      drawInfoDivider(x + 20, y + 424, w - 40);
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 13px Inter, sans-serif";
      ctx.fillText("Pulse effect", x + 20, y + 445);
      drawTechnicalBulletLines(drinkSpecialUnlockLines(selectedItem), x + 20, y + 464, w - 40, 11, 6);
      return;
    }
    ctx.fillText("Effects by level", x + 20, y + 367);
    drawCodexLevelEffectRows(
      Array.from({ length: MAX_ITEM_TIER }, (_, index) => {
        const tier = index + 1;
        return {
          label: `Lv ${tier}`,
          text: itemCompactSpecLine(makeItem(item.id, tier)),
        };
      }),
      x + 20,
      y + 387,
      w - 40
    );

    const relatedY = y + 452;
    drawInfoDivider(x + 20, relatedY - 16, w - 40);
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Favorite for", x + 20, relatedY);
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 11px Inter, sans-serif";
    const fans = favoriteUsersForItem(item.id);
    fitText(fans.length ? fans.join(", ") : realityBroken() ? "No preferred machine yet." : "No favorite animal yet.", x + 20, relatedY + 20, w - 40, "800 11px Inter, sans-serif", themeColor("muted", "#6a4b35"));

  }

  function drawCodexDrinkParticlePreview(item, centerX, centerY, radius) {
    const image = getDrinkThrowableSprite(item?.id);
    roundedRect(centerX - radius, centerY - radius, radius * 2, radius * 2, 8);
    ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.62)");
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
    ctx.lineWidth = 1;
    ctx.stroke();
    if (!image || !image.complete || image.naturalWidth <= 0) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.94;
    const size = radius * 1.48;
    ctx.drawImage(image, Math.round(centerX - size / 2), Math.round(centerY - size / 2), size, size);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawTechnicalBulletLines(lines, x, y, maxWidth, lineHeight, maxRows) {
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 11px Inter, sans-serif";
    let rowCount = 0;
    let lineY = y;
    for (const line of lines) {
      if (rowCount >= maxRows) return;
      const wrapped = wrappedTextLines(`- ${line}`, maxWidth);
      const remaining = maxRows - rowCount;
      const visible = wrapped.slice(0, remaining);
      visible.forEach((text, index) => {
        const isLastClipped = index === visible.length - 1 && wrapped.length > visible.length;
        fitText(isLastClipped ? `${text}...` : text, x, lineY + index * lineHeight, maxWidth, ctx.font, ctx.fillStyle);
      });
      rowCount += visible.length;
      lineY += visible.length * lineHeight;
    }
  }

  function drawCodexLevelEffectRows(rows, x, y, maxWidth, options = {}) {
    const rowHeight = options.rowHeight || 17;
    const labelWidth = options.labelWidth || 34;
    const labelFont = options.labelFont || "900 8px Inter, sans-serif";
    const textFont = options.textFont || "800 10px Inter, sans-serif";
    rows.forEach((row, index) => {
      const rowY = y + index * rowHeight;
      roundedRect(x, rowY - 12, labelWidth, 15, 4);
      ctx.fillStyle = themeColor("panelSoft", "rgba(255, 249, 214, 0.82)");
      ctx.fill();
      ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label, x + labelWidth / 2, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(row.text, x + labelWidth + 8, rowY, maxWidth - labelWidth - 8, textFont, themeColor("muted", "#6a4b35"));
    });
  }

  function giraffeBossGlitchPhase(unit) {
    const battle = visibleBattle();
    if (!unit?.glitchToRobot || unit.dead || !battle) return { active: false, alpha: 0, jitterX: 0, jitterY: 0, seed: 0 };
    const t = battle.elapsed || 0;
    const hitRemaining = Math.max(0, (unit.giraffeHitGlitchUntil || 0) - t);
    if (hitRemaining > 0) {
      const hitProgress = clamp01(1 - hitRemaining / GIRAFFE_BOSS_HIT_GLITCH_SECONDS);
      const seedBase = Math.floor((unit.giraffeHitGlitchSeed || 0) + t * 34);
      const pulse = 0.72 + Math.sin(hitProgress * Math.PI) * 0.18;
      return {
        active: true,
        alpha: clamp(pulse, 0.64, 0.9),
        jitterX: Math.round((glitchNoise(seedBase * 97 + 5) - 0.5) * (10 - hitProgress * 3)),
        jitterY: Math.round((glitchNoise(seedBase * 131 + 7) - 0.5) * (6 - hitProgress * 2)),
        seed: seedBase,
        source: "hit",
      };
    }
    if (t < 1.2) return { active: false, alpha: 0, jitterX: 0, jitterY: 0, seed: 0 };
    const ramp = clamp((t - 1.2) / 8, 0, 1);
    const burstRate = 1.75;
    const burstStep = Math.floor(t * burstRate);
    const burstSlice = (t * burstRate) - burstStep;
    const seedBase = burstStep + (unit.uid || 0) * 17;
    const burstGate = glitchNoise(seedBase * 47 + 19) > 0.78 - ramp * 0.06;
    const active = burstGate && burstSlice < 0.42;
    const alpha = active ? clamp(0.44 + glitchNoise(seedBase * 73 + 11) * 0.18, 0.44, 0.62) : 0;
    return {
      active,
      alpha,
      jitterX: Math.round((glitchNoise(seedBase * 97 + 5) - 0.5) * (4 + ramp * 8)),
      jitterY: Math.round((glitchNoise(seedBase * 131 + 7) - 0.5) * (2 + ramp * 4)),
      seed: seedBase,
    };
  }

  function drawGiraffeBossGlitchStatic(phase, x, y, r, options = {}) {
    if (!phase.active) return;
    const presentationScale = Math.max(0.01, options.presentationScale || 1);
    const effectRadius = r * presentationScale;
    const rect = {
      x: Math.round(x - effectRadius * 1.22),
      y: Math.round(y - effectRadius * 1.33),
      w: Math.round(effectRadius * 2.44),
      h: Math.round(effectRadius * 2.5),
    };

    ctx.save();
    drawBlueStaticAroundRect(rect, phase.seed + 31, 0.9 + phase.alpha * 0.32);
    drawHeavyStaticAroundRect(rect, phase.seed + 37, 0.62 + phase.alpha * 0.46);
    ctx.globalCompositeOperation = "lighter";
    const frame = illusionBleedFrame() + phase.seed * 11;
    const scanAlpha = 0.48 + phase.alpha * 0.5;
    for (let yLine = rect.y; yLine < rect.y + rect.h; yLine += 3) {
      const roll = glitchNoise(frame * 97 + yLine * 13);
      if (roll < 0.36) continue;
      ctx.fillStyle = yLine % 2 === 0
        ? `rgba(88, 255, 105, ${(0.025 + roll * 0.07) * scanAlpha})`
        : `rgba(255, 55, 82, ${(0.02 + roll * 0.06) * scanAlpha})`;
      ctx.fillRect(rect.x, yLine, rect.w, 1);
    }
    for (let i = 0; i < 7; i += 1) {
      const gate = glitchNoise(frame * 211 + i * 31);
      if (gate < 0.26) continue;
      const barY = Math.round(rect.y + glitchNoise(frame * 227 + i * 37) * rect.h);
      const barX = Math.round(rect.x + (glitchNoise(frame * 241 + i * 41) - 0.5) * 18);
      const barW = Math.round(rect.w * (0.55 + glitchNoise(frame * 251 + i * 43) * 0.62));
      const barH = 2 + Math.floor(glitchNoise(frame * 263 + i * 47) * 12);
      ctx.fillStyle = i % 2 === 0
        ? `rgba(70, 255, 99, ${0.1 * scanAlpha})`
        : `rgba(255, 55, 82, ${0.08 * scanAlpha})`;
      ctx.fillRect(barX, barY, barW, barH);
    }
    for (let i = 0; i < 120; i += 1) {
      if (glitchNoise(frame * 281 + i * 17) < 0.38) continue;
      const dotX = Math.floor(rect.x + glitchNoise(frame * 293 + i * 19) * rect.w);
      const dotY = Math.floor(rect.y + glitchNoise(frame * 307 + i * 23) * rect.h);
      const size = glitchNoise(frame * 311 + i * 29) > 0.86 ? 2 : 1;
      ctx.fillStyle = i % 5 === 0
        ? `rgba(0, 238, 255, ${(0.08 + glitchNoise(frame * 313 + i * 31) * 0.22) * scanAlpha})`
        : `rgba(238, 255, 232, ${(0.08 + glitchNoise(frame * 317 + i * 37) * 0.24) * scanAlpha})`;
      ctx.fillRect(dotX, dotY, size, size);
    }
    ctx.restore();
  }

  function finalBossVisualGlitchPhase(unit) {
    if (!(unit?.finalBossUnit || isFinalBossUnitType(unit?.typeId)) || unit.dead) {
      return { active: false, alpha: 0, splitX: 0, splitY: 0, seed: 0 };
    }
    const battle = visibleBattle();
    const t = battle?.elapsed ?? state.idleTime;
    const boss = unit.typeId === FINAL_BOSS_TYPE_ID;
    const hitRemaining = Math.max(0, (unit.finalBossHitGlitchUntil || 0) - t);
    if (hitRemaining > 0) {
      const hitProgress = clamp01(1 - hitRemaining / FINAL_BOSS_HIT_GLITCH_SECONDS);
      const seedBase = Math.floor((unit.finalBossHitGlitchSeed || 0) + t * (boss ? 58 : 66));
      const pulse = 0.74 + Math.sin(hitProgress * Math.PI) * 0.22;
      const intensity = boss ? 1.22 : 1.05;
      return {
        active: true,
        alpha: clamp(pulse * intensity, 0.62, boss ? 0.78 : 0.68),
        splitX: Math.round((6 + glitchNoise(seedBase * 59 + 11) * (boss ? 11 : 8)) * intensity),
        splitY: Math.round((glitchNoise(seedBase * 67 + 13) - 0.5) * (boss ? 12 : 9)),
        seed: seedBase,
        burst: true,
        source: "hit",
      };
    }
    const seedBase = Math.floor(t * (boss ? 12 : 15)) + (unit.uid || 0) * 37 + (boss ? 997 : 313);
    const pulse = 0.5 + Math.sin(t * (boss ? 5.1 : 6.7) + (unit.uid || 0)) * 0.5;
    const burst = glitchNoise(seedBase * 43 + 7) > (boss ? 0.58 : 0.66);
    const intensity = boss ? 1.05 : 0.82;
    const alpha = (0.16 + pulse * 0.08 + (burst ? 0.16 : 0)) * intensity;
    return {
      active: true,
      alpha: clamp(alpha, 0.12, boss ? 0.42 : 0.34),
      splitX: Math.round((1.5 + (burst ? 3.5 : 1.5) * glitchNoise(seedBase * 59 + 11)) * intensity),
      splitY: Math.round((glitchNoise(seedBase * 67 + 13) - 0.5) * (boss ? 4 : 3)),
      seed: seedBase,
      burst,
    };
  }

  function drawFinalBossVisualGlitchStatic(phase, x, y, r, options = {}) {
    if (!phase.active) return;
    const presentationScale = Math.max(0.01, options.presentationScale || 1);
    const effectRadius = r * presentationScale;
    const rect = {
      x: Math.round(x - effectRadius * 1.1),
      y: Math.round(y - effectRadius * 1.18),
      w: Math.round(effectRadius * 2.2),
      h: Math.round(effectRadius * 2.3),
    };
    const frame = illusionBleedFrame() + phase.seed * 7;
    const intensity = phase.burst ? 0.95 : 0.58;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i += 1) {
      if (!phase.burst && glitchNoise(frame * 37 + i * 19) < 0.42) continue;
      const barY = Math.round(rect.y + glitchNoise(frame * 47 + i * 23) * rect.h);
      const barX = Math.round(rect.x + (glitchNoise(frame * 53 + i * 29) - 0.5) * 20);
      const barW = Math.round(rect.w * (0.38 + glitchNoise(frame * 61 + i * 31) * 0.72));
      const barH = 1 + Math.floor(glitchNoise(frame * 67 + i * 37) * (phase.burst ? 8 : 4));
      ctx.fillStyle = i % 3 === 0
        ? `rgba(0, 238, 255, ${0.11 * intensity})`
        : i % 3 === 1
          ? `rgba(255, 45, 78, ${0.1 * intensity})`
          : `rgba(238, 255, 232, ${0.08 * intensity})`;
      ctx.fillRect(barX, barY, barW, barH);
    }
    for (let i = 0; i < 38; i += 1) {
      if (glitchNoise(frame * 71 + i * 17) < 0.62) continue;
      const dotX = Math.floor(rect.x + glitchNoise(frame * 79 + i * 19) * rect.w);
      const dotY = Math.floor(rect.y + glitchNoise(frame * 83 + i * 23) * rect.h);
      ctx.fillStyle = i % 4 === 0
        ? `rgba(255, 51, 79, ${0.16 * intensity})`
        : `rgba(66, 244, 255, ${0.14 * intensity})`;
      ctx.fillRect(dotX, dotY, 1, 1);
    }
    ctx.restore();
  }

  function drawFoodAnimal(unit, x, y, r, facingRight = false, options = {}) {
    const breath = idleBreathForUnit(unit);
    const combatMotion = combatMotionForUnit(unit);
    const drawX = x + combatMotion.x;
    const drawY = y + breath.bob + combatMotion.y;
    const presentationScale = Math.max(0.01, options.presentationScale || 1);
    const preserveBase = Boolean(options.preserveBase && presentationScale !== 1);
    const anchorBase = Boolean(options.anchorBase);
    const drawScale = {
      scaleX: breath.scaleX * combatMotion.scaleX,
      scaleY: breath.scaleY * combatMotion.scaleY,
    };
    const bleed = contentBleedPhase("unit", unit);
    const postGiraffeTransition = postGiraffeHorrorContentPhase("unit", unit);
    const giraffeBoss = Boolean(unit?.giraffeBossUnit || isGiraffeBossUnitType(unit?.typeId));
    const giraffeGlitch = giraffeBoss ? giraffeBossGlitchPhase(unit) : null;
    const robotRuntimeSprite = giraffeGlitch?.active ? getRuntimeSprite(unit, { horror: true }) : null;
    const swapToRobot = Boolean(giraffeGlitch?.active && spriteImageReady(robotRuntimeSprite));
    const lockHorrorRuntimeSprite = isFinalBossUnitType(unit?.typeId);
    const runtimeOptions = swapToRobot
      ? { horror: true }
      : lockHorrorRuntimeSprite || postGiraffeTransition?.mode === "horror"
        ? { horror: true }
        : { cozy: giraffeBoss || postGiraffeTransition?.mode === "cozy" || (!postGiraffeTransition && bleed.phase === "flash") };
    const runtimeSprite = swapToRobot ? robotRuntimeSprite : getRuntimeSprite(unit, runtimeOptions);
    const runtimeFacingRight = runtimeSpriteFacingRight(unit, facingRight, runtimeOptions);
    const runtimeX = swapToRobot ? drawX + giraffeGlitch.jitterX : drawX;
    const runtimeY = swapToRobot ? drawY + giraffeGlitch.jitterY : drawY;
    const finalBossGlitch = finalBossVisualGlitchPhase(unit);
    if (spriteImageReady(runtimeSprite)) {
      drawRuntimeFoodAnimal(runtimeSprite, runtimeX, runtimeY, r, runtimeFacingRight, drawScale, combatMotion.rotation, combatMotion.flash, {
        presentationScale,
        preserveBase,
        anchorBase,
        glitch: finalBossGlitch,
      });
      if (swapToRobot) drawGiraffeBossGlitchStatic(giraffeGlitch, drawX, drawY, r, { presentationScale });
      drawFinalBossVisualGlitchStatic(finalBossGlitch, drawX, drawY, r, { presentationScale });
      const effectRadius = r * presentationScale;
      drawContentSequenceEffect({ x: drawX - effectRadius * 1.45, y: drawY - effectRadius * 1.45, w: effectRadius * 2.9, h: effectRadius * 2.9 }, "unit", unit);
      drawPostGiraffeHorrorContentEffect({ x: drawX - effectRadius * 1.45, y: drawY - effectRadius * 1.45, w: effectRadius * 2.9, h: effectRadius * 2.9 }, "unit", unit, postGiraffeTransition);
      drawUnitToppings(unit, drawX, drawY, r, runtimeFacingRight);
      return;
    }
    if (runtimeSprite && !spriteImageFailed(runtimeSprite)) {
      const effectRadius = r * presentationScale;
      drawContentSequenceEffect({ x: drawX - effectRadius * 1.45, y: drawY - effectRadius * 1.45, w: effectRadius * 2.9, h: effectRadius * 2.9 }, "unit", unit);
      drawPostGiraffeHorrorContentEffect({ x: drawX - effectRadius * 1.45, y: drawY - effectRadius * 1.45, w: effectRadius * 2.9, h: effectRadius * 2.9 }, "unit", unit, postGiraffeTransition);
      drawUnitToppings(unit, drawX, drawY, r, runtimeFacingRight);
      return;
    }

    const sprite = getPixelSprite(unit);
    const stickerMask = getTintedPixelSprite(unit, "#fff9df", "sticker");
    const baseSize = Math.round(r * 2.65);
    const size = Math.round(baseSize * presentationScale);
    const left = Math.round(drawX - size / 2);
    const top = anchorBase ? Math.round(drawY + r - size) : preserveBase ? Math.round(drawY + baseSize / 2 - size) : Math.round(drawY - size / 2);
    const outline = Math.max(2, Math.round(size * 0.085));

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (const offset of [
      [-outline, 0],
      [outline, 0],
      [0, -outline],
      [0, outline],
      [-outline, -outline],
      [outline, -outline],
      [-outline, outline],
      [outline, outline],
    ]) {
      drawImageFacing(stickerMask, left + offset[0], top + offset[1], size, size, facingRight, drawScale.scaleX, drawScale.scaleY, 1, combatMotion.rotation);
    }
    drawImageFacing(sprite, left, top, size, size, facingRight, drawScale.scaleX, drawScale.scaleY, 1, combatMotion.rotation);
    if (combatMotion.flash > 0) {
      ctx.globalAlpha = combatMotion.flash;
      drawImageFacing(stickerMask, left, top, size, size, facingRight, drawScale.scaleX, drawScale.scaleY, 1, combatMotion.rotation);
      ctx.globalAlpha = 1;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
    drawContentSequenceEffect({ x: drawX - size / 2, y: drawY - size / 2, w: size, h: size }, "unit", unit);
    drawPostGiraffeHorrorContentEffect({ x: drawX - size / 2, y: drawY - size / 2, w: size, h: size }, "unit", unit, postGiraffeTransition);
    drawUnitToppings(unit, drawX, drawY, r, facingRight);
  }

  function combatMotionForUnit(unit) {
    const battle = visibleBattle();
    const now = battle?.elapsed || 0;
    const motion = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, flash: 0 };
    const attack = unit?.attackMotion;
    if (attack && typeof attack.start === "number") {
      const progress = (now - attack.start) / Math.max(0.001, attack.duration || COMBAT_ATTACK_MOTION_SECONDS);
      if (progress >= 0 && progress < 1) {
        const vector = combatVector(unit.x, unit.y, attack.targetX, attack.targetY, unit.side === "ally" ? 1 : -1);
        const windup = progress < 0.22 ? easeOutCubic(progress / 0.22) : 1;
        const strike = progress < 0.22 ? 0 : progress < 0.54 ? easeOutCubic((progress - 0.22) / 0.32) : 1 - easeOutCubic((progress - 0.54) / 0.46);
        const reach = progress < 0.22 ? -0.22 * windup : strike;
        motion.x += vector.x * COMBAT_ATTACK_LUNGE_PIXELS * reach;
        motion.y += vector.y * COMBAT_ATTACK_LUNGE_PIXELS * reach - Math.sin(progress * Math.PI) * 2.2;
        motion.scaleX += strike * 0.1;
        motion.scaleY -= strike * 0.075;
        motion.rotation += vector.x * strike * 0.08;
      }
    }

    const support = unit?.supportMotion;
    if (support && typeof support.start === "number") {
      const progress = (now - support.start) / Math.max(0.001, support.duration || COMBAT_SUPPORT_MOTION_SECONDS);
      if (progress >= 0 && progress < 1) {
        const vector = combatVector(unit.x, unit.y, support.targetX, support.targetY, unit.side === "ally" ? 1 : -1);
        const lift = Math.sin(progress * Math.PI);
        const pulse = Math.sin(progress * Math.PI * 1.15);
        const lean = Math.sin(progress * Math.PI * 2);
        motion.x += vector.x * 2.6 * lift;
        motion.y -= COMBAT_SUPPORT_LIFT_PIXELS * lift;
        motion.scaleX += 0.055 * pulse;
        motion.scaleY += 0.075 * pulse;
        motion.rotation += vector.x * 0.045 * lean;
        motion.flash = Math.max(motion.flash, 0.24 * (1 - Math.abs(progress - 0.5) * 1.35));
      }
    }

    const hit = unit?.hitMotion;
    if (hit && typeof hit.start === "number") {
      const progress = (now - hit.start) / Math.max(0.001, hit.duration || COMBAT_HIT_MOTION_SECONDS);
      if (progress >= 0 && progress < 1) {
        const vector = combatVector(hit.sourceX, hit.sourceY, unit.x, unit.y, unit.side === "ally" ? -1 : 1);
        const fade = 1 - easeOutCubic(progress);
        const wobble = Math.sin(progress * Math.PI * 7 + seededUnitFloat(unitBreathSeed(unit), 9) * Math.PI) * fade;
        const strength = hit.strength || 1;
        motion.x += vector.x * COMBAT_HIT_RECOIL_PIXELS * strength * fade + wobble * 2.2;
        motion.y += vector.y * COMBAT_HIT_RECOIL_PIXELS * strength * fade - Math.abs(wobble) * 1.4;
        motion.scaleX += 0.07 * strength * fade;
        motion.scaleY -= 0.06 * strength * fade;
        motion.rotation += (vector.x || (unit.side === "ally" ? -1 : 1)) * 0.09 * strength * fade;
        motion.flash = Math.max(motion.flash, (hit.shieldOnly ? 0.2 : 0.36) * fade);
      }
    }
    return motion;
  }

  function combatVector(fromX, fromY, toX, toY, fallbackX = 1) {
    const dx = Number.isFinite(toX) && Number.isFinite(fromX) ? toX - fromX : fallbackX;
    const dy = Number.isFinite(toY) && Number.isFinite(fromY) ? toY - fromY : 0;
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length };
  }

  function easeOutCubic(value) {
    const t = clamp01(value);
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(value) {
    const t = clamp01(value);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawUnitToppings(unit, x, y, r, facingRight = false) {
    if (!unit?.item) return;
    const offsetX = r * (facingRight ? -0.08 : 0.08);
    const offsetY = -r * 0.82;
    drawItemIcon(unit.item, x + offsetX, y + offsetY, r * 0.9);
  }

  function drawItemIcon(item, x, y, r, options = {}) {
    const bleedKind = isDrink(item) ? "drink" : "topping";
    const bleed = contentBleedPhase(bleedKind, item);
    const postGiraffeTransition = postGiraffeHorrorContentPhase(bleedKind, item);
    const image = getItemSprite(item, {
      cozy: postGiraffeTransition?.mode === "cozy" || (!postGiraffeTransition && bleed.phase === "flash"),
      horror: postGiraffeTransition?.mode === "horror",
    });
    const size = Math.round(r * 2.4);
    ctx.save();
    if (spriteImageReady(image)) {
      ctx.imageSmoothingEnabled = false;
      let drawRect = { x: x - size / 2, y: y - size / 2, w: size, h: size };
      if (options.centerOpaque) {
        const metrics = itemSpriteMetrics(image);
        const offsetX = ((metrics.x + metrics.w / 2) / Math.max(1, image.naturalWidth) - 0.5) * size;
        const anchorY = Math.max(0, Math.min(1, options.opaqueAnchorY ?? 0.5));
        const offsetY = ((metrics.y + metrics.h * anchorY) / Math.max(1, image.naturalHeight) - 0.5) * size;
        drawRect = { x: x - size / 2 - offsetX, y: y - size / 2 - offsetY, w: size, h: size };
        ctx.drawImage(image, x - size / 2 - offsetX, y - size / 2 - offsetY, size, size);
      } else {
        ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
      }
      drawContentSequenceEffect(drawRect, bleedKind, item);
      drawPostGiraffeHorrorContentEffect(drawRect, bleedKind, item, postGiraffeTransition);
      ctx.imageSmoothingEnabled = true;
    } else if (image && !spriteImageFailed(image)) {
      drawContentSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item);
      drawPostGiraffeHorrorContentEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item, postGiraffeTransition);
    } else if (isDrink(item)) {
      drawFallbackDrink(item, x, y, r);
      drawContentSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item);
      drawPostGiraffeHorrorContentEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item, postGiraffeTransition);
    } else {
      drawFallbackEgg(x, y, r);
      drawContentSequenceEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item);
      drawPostGiraffeHorrorContentEffect({ x: x - size / 2, y: y - size / 2, w: size, h: size }, bleedKind, item, postGiraffeTransition);
    }
    ctx.restore();
  }

  function drawFallbackEgg(x, y, r) {
    ctx.fillStyle = "#fff9df";
    ctx.strokeStyle = "#b97822";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.12));
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.0, r * 0.72, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f7c63d";
    ctx.beginPath();
    ctx.arc(x + r * 0.08, y - r * 0.02, r * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFallbackDrink(item, x, y, r) {
    ctx.fillStyle = item?.color || "#b83b78";
    ctx.strokeStyle = "#fff9df";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.12));
    roundedRect(x - r * 0.52, y - r * 0.72, r * 1.04, r * 1.36, Math.max(4, r * 0.18));
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    roundedRect(x - r * 0.34, y - r * 0.5, r * 0.24, r * 0.88, Math.max(2, r * 0.09));
    ctx.fill();
    ctx.strokeStyle = item?.accent || "#e8b765";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.1));
    ctx.beginPath();
    ctx.moveTo(x + r * 0.08, y - r * 0.72);
    ctx.lineTo(x + r * 0.34, y - r * 1.04);
    ctx.stroke();
  }

  function idleBreathForUnit(unit) {
    const seed = unitBreathSeed(unit);
    const phaseOffset = seededUnitFloat(seed, 1) * Math.PI * 2;
    const periodJitter = (seededUnitFloat(seed, 2) * 2 - 1) * IDLE_BREATH.periodVariance;
    const amplitude = 1 + (seededUnitFloat(seed, 3) * 2 - 1) * IDLE_BREATH.amplitudeVariance;
    const period = Math.max(1.8, IDLE_BREATH.period + periodJitter);
    const phase = state.idleTime * ((Math.PI * 2) / period) + phaseOffset;
    const wave = smoothBreathWave(phase);
    return {
      scaleX: 1 - wave * IDLE_BREATH.scaleX * amplitude,
      scaleY: 1 + wave * IDLE_BREATH.scaleY * amplitude,
      bob: -wave * IDLE_BREATH.bob * amplitude,
    };
  }

  function unitBreathSeed(unit) {
    const identity = typeof unit?.uid === "number" ? unit.uid : `${unit?.typeId || unit?.id || "food"}:${unit?.tier || 1}`;
    return hashString(`${identity}:${unit?.typeId || unit?.id || "food"}:${unit?.tier || 1}:idle-breath`);
  }

  function seededUnitFloat(seed, salt) {
    return hashString(`${seed}:${salt}`) / 0xffffffff;
  }

  function smoothBreathWave(phase) {
    const cycle = (phase / (Math.PI * 2)) % 1;
    const wrapped = cycle < 0 ? cycle + 1 : cycle;
    const eased = 0.5 - 0.5 * Math.cos(wrapped * Math.PI * 2);
    return eased * 2 - 1;
  }

  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    return hash;
  }

  function drawImageFacing(image, x, y, w, h, facingRight, scaleX = 1, scaleY = 1, anchorY = 0.5, rotation = 0) {
    if (!facingRight && scaleX === 1 && scaleY === 1 && rotation === 0) {
      ctx.drawImage(image, x, y, w, h);
      return;
    }
    ctx.save();
    ctx.translate(x + w / 2, y + h * anchorY);
    ctx.rotate(rotation);
    ctx.scale(facingRight ? -scaleX : scaleX, scaleY);
    ctx.drawImage(image, -w / 2, -h * anchorY, w, h);
    ctx.restore();
  }

  function drawImageRegionFacing(image, sx, sy, sw, sh, x, y, w, h, facingRight) {
    if (!facingRight) {
      ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
      return;
    }
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(image, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  const REALITY_RUNTIME_INVERT_FACING = new Set(["crab_cake_caterpillar", "cucumber_cobra"]);

  function runtimeSpriteFacingRight(unit, facingRight, options = {}) {
    if (options.cozy || !realityBroken()) return facingRight;
    const typeId = unit?.typeId || unit?.id;
    const tier = Math.max(1, unit?.tier || 1);
    if (REALITY_RUNTIME_INVERT_FACING.has(typeId) && REALITY_RUNTIME_SPRITES[typeId]?.[tier]) return !facingRight;
    return facingRight;
  }

  function runtimeSpriteSrcFor(unit, options = {}) {
    const typeId = unit.typeId || unit.id;
    const tier = Math.max(1, unit.tier || 1);
    if (options.cozy) return RUNTIME_SPRITES[typeId]?.[tier] || null;
    if (options.horror) return REALITY_RUNTIME_SPRITES[typeId]?.[tier] || RUNTIME_SPRITES[typeId]?.[tier] || null;
    return (realityBroken() ? REALITY_RUNTIME_SPRITES[typeId]?.[tier] : null) || RUNTIME_SPRITES[typeId]?.[tier] || null;
  }

  function attackParticleSpriteSrcFor(typeId, options = {}) {
    if (options.cozy) return ATTACK_PARTICLE_SPRITES[typeId] || null;
    if (options.horror) return REALITY_ATTACK_PARTICLE_SPRITES[typeId] || ATTACK_PARTICLE_SPRITES[typeId] || null;
    return (realityBroken() ? REALITY_ATTACK_PARTICLE_SPRITES[typeId] : null) || ATTACK_PARTICLE_SPRITES[typeId] || null;
  }

  function drinkThrowableSpriteSrcFor(drinkId) {
    return (realityBroken() ? REALITY_DRINK_THROWABLE_SPRITES[drinkId] : null) || DRINK_THROWABLE_SPRITES[drinkId] || null;
  }

  function defeatStillSpriteFromEntry(entry, tier) {
    if (!entry) return null;
    if (typeof entry === "string") return entry;
    return entry[tier] || entry[Math.min(4, tier)] || entry[1] || null;
  }

  function defeatStillSpriteSrcFor(unit, options = {}) {
    const typeId = unit?.typeId || unit?.id;
    const tier = Math.max(1, unit?.tier || 1);
    if (options.cozy) return defeatStillSpriteFromEntry(DEFEAT_STILL_SPRITES[typeId], tier);
    if (options.horror) return defeatStillSpriteFromEntry(REALITY_DEFEAT_STILL_SPRITES[typeId], tier) || defeatStillSpriteFromEntry(DEFEAT_STILL_SPRITES[typeId], tier);
    return (realityBroken() || unit?.forceRealityDefeatStill ? defeatStillSpriteFromEntry(REALITY_DEFEAT_STILL_SPRITES[typeId], tier) : null) || defeatStillSpriteFromEntry(DEFEAT_STILL_SPRITES[typeId], tier);
  }

  function getRuntimeSprite(unit, options = {}) {
    const src = runtimeSpriteSrcFor(unit, options);
    return window.FoodAnimalsRuntimeAssets.getCachedImage(runtimeSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getDefeatStillSprite(unit, options = {}) {
    const src = defeatStillSpriteSrcFor(unit, options);
    return window.FoodAnimalsRuntimeAssets.getCachedImage(runtimeSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function loadSpriteImage(src) {
    return window.FoodAnimalsRuntimeAssets.loadImage(src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function spriteImageReady(image) {
    return window.FoodAnimalsRuntimeAssets.ready(image);
  }

  function spriteImageFailed(image) {
    return window.FoodAnimalsRuntimeAssets.failed(image);
  }

  function getItemSprite(item, options = {}) {
    const src = itemSpriteSrcFor(item, options);
    return getItemSpriteBySrc(src);
  }

  function itemSpriteSrcFor(item, options = {}) {
    return itemSpriteSrcForId(item?.id, item?.tier, options);
  }

  function itemSpriteSrcForId(itemId, tierValue, options = {}) {
    const tier = itemTier(tierValue);
    if (options.cozy) return ITEM_TIER_SPRITES[itemId]?.[tier] || ITEM_SPRITES[itemId] || null;
    if (options.horror) return REALITY_ITEM_TIER_SPRITES[itemId]?.[tier] || REALITY_ITEM_SPRITES[itemId] || ITEM_TIER_SPRITES[itemId]?.[tier] || ITEM_SPRITES[itemId] || null;
    return realityBroken()
      ? REALITY_ITEM_TIER_SPRITES[itemId]?.[tier] || REALITY_ITEM_SPRITES[itemId] || ITEM_TIER_SPRITES[itemId]?.[tier] || ITEM_SPRITES[itemId] || null
      : ITEM_TIER_SPRITES[itemId]?.[tier] || ITEM_SPRITES[itemId] || null;
  }

  function getItemSpriteById(itemId, tierValue, options = {}) {
    const src = itemSpriteSrcForId(itemId, tierValue, options);
    return getItemSpriteBySrc(src);
  }

  function getItemSpriteBySrc(src) {
    return window.FoodAnimalsRuntimeAssets.getCachedImage(itemSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getAttackParticleSprite(typeId, options = {}) {
    const src = attackParticleSpriteSrcFor(typeId, options);
    return getAttackParticleSpriteBySrc(src);
  }

  function getAttackParticleSpriteBySrc(src) {
    return window.FoodAnimalsRuntimeAssets.getCachedImage(attackParticleSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getDrinkThrowableSprite(drinkId) {
    const src = drinkThrowableSpriteSrcFor(drinkId);
    return getDrinkThrowableSpriteBySrc(src);
  }

  function getDrinkThrowableSpriteBySrc(src) {
    return window.FoodAnimalsRuntimeAssets.getCachedImage(drinkThrowableSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getParticleSpriteBySrc(src) {
    return window.FoodAnimalsRuntimeAssets.getCachedImage(particleSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getParticleSprite(cacheKind, particleType, particleTier, resolvedSrc = null) {
    const spriteInfo = resolvedSrc ? { src: resolvedSrc, cacheKind } : particleSpriteInfo(cacheKind, particleType, particleTier);
    if (spriteInfo.cacheKind === "drink") return getDrinkThrowableSpriteBySrc(spriteInfo.src);
    if (spriteInfo.cacheKind === "item") return getItemSpriteBySrc(spriteInfo.src);
    if (spriteInfo.cacheKind === "attack") return getAttackParticleSpriteBySrc(spriteInfo.src);
    return getParticleSpriteBySrc(spriteInfo.src);
  }

  function preloadAttackParticleSprites() {
    ATTACK_PARTICLE_TYPES.forEach((typeId) => getAttackParticleSprite(typeId, { cozy: true }));
    Object.keys(REALITY_ATTACK_PARTICLE_SPRITES).forEach((typeId) => getAttackParticleSprite(typeId, { horror: true }));
  }

  function preloadDrinkThrowableSprites() {
    DRINK_THROWABLE_TYPES.forEach((drinkId) => getDrinkThrowableSprite(drinkId));
    Object.values(REALITY_DRINK_THROWABLE_SPRITES).forEach((src) => getDrinkThrowableSpriteBySrc(src));
  }

  function preloadDefeatStillSprites() {
    window.FoodAnimalsRuntimeAssets.preloadEntries(DEFEAT_STILL_SPRITES, (src) => {
      window.FoodAnimalsRuntimeAssets.getCachedImage(runtimeSpriteCache, src, {
        onLoad: requestDraw,
        onError: requestDraw,
      });
    });
    window.FoodAnimalsRuntimeAssets.preloadEntries(REALITY_DEFEAT_STILL_SPRITES, (src) => {
      window.FoodAnimalsRuntimeAssets.getCachedImage(runtimeSpriteCache, src, {
        onLoad: requestDraw,
        onError: requestDraw,
      });
    });
  }

  function preloadRuntimeSprites() {
    const preloadTable = (table, options = {}) => {
      Object.entries(table).forEach(([typeId, tierSprites]) => {
        Object.keys(tierSprites || {}).forEach((tier) => {
          getRuntimeSprite({ typeId, tier: Number(tier) }, options);
        });
      });
    };
    preloadTable(RUNTIME_SPRITES, { cozy: true });
    preloadTable(REALITY_RUNTIME_SPRITES, { horror: true });
  }

  function getStatusEffectSprite(effectId) {
    const horrorSrc = realityBroken() ? HORROR_STATUS_EFFECT_SPRITES[effectId] : null;
    const src = horrorSrc || STATUS_EFFECT_SPRITES[effectId];
    return window.FoodAnimalsRuntimeAssets.getCachedImage(statusEffectSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function getUiSprite(src) {
    return window.FoodAnimalsRuntimeAssets.getCachedImage(uiSpriteCache, src, {
      onLoad: requestDraw,
      onError: requestDraw,
    });
  }

  function drawUiAtlasIcon(iconId, x, y, size = 18, options = {}) {
    const cell = UI_ICON_ATLAS[iconId];
    const image = getUiSprite(currentUiIconAtlasSrc());
    if (options.tooltip) {
      registerTooltip(x - size / 2, y - size / 2, size, size, options.tooltip);
    }
    if (cell && image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        cell[0] * UI_ICON_ATLAS_CELL,
        cell[1] * UI_ICON_ATLAS_CELL,
        UI_ICON_ATLAS_CELL,
        UI_ICON_ATLAS_CELL,
        Math.round(x - size / 2),
        Math.round(y - size / 2),
        size,
        size
      );
      ctx.restore();
      return true;
    }
    drawFallbackUiIcon(iconId, x, y, size);
    return false;
  }

  function drawFallbackUiIcon(iconId, x, y, size) {
    const traitId = iconId?.startsWith("trait_") ? iconId.slice(6) : null;
    const color = traitId ? traitInfo(traitId).color : "#f0c64a";
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(22, 57, 45, 0.42)";
    ctx.lineWidth = Math.max(1, Math.round(size / 12));
    ctx.beginPath();
    ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function registerTooltip(x, y, w, h, tooltip) {
    window.FoodAnimalsInteractionRuntime.registerTooltip(state.tooltipTargets, x, y, w, h, tooltip);
  }

  function currentTooltip() {
    return window.FoodAnimalsInteractionRuntime.currentTooltip(state.tooltipTargets, state.pointer, {
      dragging: Boolean(state.drag),
    });
  }

  function drawTooltip() {
    const tip = currentTooltip();
    if (!tip) return;
    const cozyMergeTooltip = !realityBroken() && (tip.title === "Merge ready" || tip.title === "Shop merge");
    const pad = 9;
    const maxW = 230;
    const bodyFont = "700 10px Inter, sans-serif";
    ctx.save();
    ctx.font = "900 11px Inter, sans-serif";
    const titleW = Math.min(maxW - pad * 2, measureTextWidth(tip.title, ctx.font));
    ctx.font = bodyFont;
    const bodyLines = tip.body ? wrappedTextLines(tip.body, maxW - pad * 2).slice(0, 3) : [];
    const bodyW = bodyLines.reduce((width, line) => Math.max(width, Math.min(maxW - pad * 2, measureTextWidth(line, ctx.font))), 0);
    const metrics = window.FoodAnimalsInteractionRuntime.tooltipMetrics(tip, state.pointer, {
      width: W,
      height: H,
    }, {
      bodyLines: bodyLines.map((line) => ({ text: line, width: measureTextWidth(line, ctx.font) })),
      bodyW,
      maxW,
      pad,
      titleW,
    });
    const { x, y, w, h } = metrics;
    ctx.shadowColor = cozyMergeTooltip ? "rgba(22, 151, 78, 0.35)" : "rgba(22, 57, 45, 0.24)";
    ctx.shadowBlur = cozyMergeTooltip ? 14 : 12;
    ctx.shadowOffsetY = 5;
    roundedRect(x, y, w, h, 7);
    ctx.fillStyle = cozyMergeTooltip ? "rgba(224, 255, 233, 0.98)" : themeColor("panel", "rgba(255, 253, 232, 0.96)");
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = cozyMergeTooltip ? "rgba(22, 151, 78, 0.68)" : themeColor("border", "rgba(22, 57, 45, 0.2)");
    ctx.lineWidth = cozyMergeTooltip ? 1.5 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = cozyMergeTooltip ? "#0b6a38" : themeColor("primary", "#16392d");
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(tip.title, x + pad, y + 17, w - pad * 2, "900 11px Inter, sans-serif", cozyMergeTooltip ? "#0b6a38" : themeColor("primary", "#16392d"));
    bodyLines.forEach((line, index) => {
      fitText(line, x + pad, y + 34 + index * 13, w - pad * 2, bodyFont, cozyMergeTooltip ? "#285b3a" : themeColor("muted", "#6a4b35"));
    });
    ctx.restore();
  }

  function drawRuntimeFoodAnimal(image, x, y, r, facingRight = false, breath = { scaleX: 1, scaleY: 1 }, rotation = 0, flash = 0, options = {}) {
    const metrics = runtimeSpriteMetrics(image);
    const targetMax = r * 2.9;
    const scale = targetMax / Math.max(metrics.w, metrics.h);
    const presentationScale = Math.max(0.01, options.presentationScale || 1);
    const baseDrawW = metrics.w * scale;
    const baseDrawH = metrics.h * scale;
    const drawW = baseDrawW * presentationScale;
    const drawH = baseDrawH * presentationScale;
    const drawTop = options.anchorBase ? r - drawH : options.preserveBase ? baseDrawH / 2 - drawH : -drawH / 2;
    const glitch = options.glitch;
    const glitchActive = Boolean(glitch?.active);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(rotation);
    ctx.scale(facingRight ? -breath.scaleX : breath.scaleX, breath.scaleY);
    if (glitchActive) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = glitch.alpha * 0.58;
      ctx.filter = "saturate(1.45) brightness(1.1)";
      ctx.drawImage(
        image,
        metrics.x,
        metrics.y,
        metrics.w,
        metrics.h,
        -drawW / 2 - glitch.splitX,
        drawTop + glitch.splitY,
        drawW,
        drawH
      );
      ctx.globalAlpha = glitch.alpha * 0.5;
      ctx.filter = "hue-rotate(145deg) saturate(1.8) brightness(1.05)";
      ctx.drawImage(
        image,
        metrics.x,
        metrics.y,
        metrics.w,
        metrics.h,
        -drawW / 2 + glitch.splitX,
        drawTop - glitch.splitY,
        drawW,
        drawH
      );
      ctx.restore();
    }
    ctx.drawImage(
      image,
      metrics.x,
      metrics.y,
      metrics.w,
      metrics.h,
      -drawW / 2,
      drawTop,
      drawW,
      drawH
    );
    if (flash > 0) {
      ctx.globalAlpha = flash;
      ctx.filter = "brightness(2.4) saturate(0.7)";
      ctx.drawImage(
        image,
        metrics.x,
        metrics.y,
        metrics.w,
        metrics.h,
        -drawW / 2,
        drawTop,
        drawW,
        drawH
      );
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
  }

  function runtimeSpriteMetrics(image) {
    return window.FoodAnimalsRuntimeAssets.alphaMetrics(image, runtimeSpriteMetricsCache);
  }

  function itemSpriteMetrics(image) {
    return alphaSpriteMetrics(image, itemSpriteMetricsCache);
  }

  function alphaSpriteMetrics(image, cache) {
    return window.FoodAnimalsRuntimeAssets.alphaMetrics(image, cache);
  }

  function getPixelSprite(unit) {
    const typeId = unit.typeId || unit.id;
    const key = `${typeId}:${unit.tier}`;
    if (pixelSpriteCache.has(key)) return pixelSpriteCache.get(key);
    const sprite = document.createElement("canvas");
    sprite.width = 48;
    sprite.height = 48;
    const px = sprite.getContext("2d");
    px.imageSmoothingEnabled = false;

    drawPixelFoodAnimal(px, unit);
    pixelSpriteCache.set(key, sprite);
    return sprite;
  }

  function getTintedPixelSprite(unit, color, label) {
    const typeId = unit.typeId || unit.id;
    const key = `${typeId}:${unit.tier}:${label}`;
    if (tintedSpriteCache.has(key)) return tintedSpriteCache.get(key);
    const sprite = getPixelSprite(unit);
    const mask = document.createElement("canvas");
    mask.width = sprite.width;
    mask.height = sprite.height;
    const mx = mask.getContext("2d");
    mx.imageSmoothingEnabled = false;
    mx.drawImage(sprite, 0, 0);
    mx.globalCompositeOperation = "source-in";
    mx.fillStyle = color;
    mx.fillRect(0, 0, mask.width, mask.height);
    tintedSpriteCache.set(key, mask);
    return mask;
  }

  function drawPixelFoodAnimal(px, unit) {
    const typeId = unit.typeId || unit.id;
    const dark = "#16392d";
    const shade = "#6a4b35";
    const hi = "#fff4b8";
    const base = unit.color;
    const accent = unit.accent;
    const p = (x, y, w, h, color) => {
      px.fillStyle = color;
      px.fillRect(x, y, w, h);
    };

    if (typeId === "toast_tortoise") {
      pixelOval(p, 9, 9, 31, 29, dark);
      pixelOval(p, 11, 11, 27, 25, "#d99043");
      pixelOval(p, 15, 15, 19, 17, "#f7d39b");
      p(13, 29, 22, 5, "#85512e");
      p(18, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(20, 28, 11, 3, dark);
      p(15, 15, 4, 3, hi);
    } else if (typeId === "sushi_seal") {
      pixelOval(p, 8, 11, 32, 25, dark);
      pixelOval(p, 10, 13, 28, 21, "#f2f5ef");
      p(22, 8, 7, 31, dark);
      p(11, 20, 27, 6, "#e45a6d");
      p(18, 19, 4, 4, dark);
      p(30, 19, 4, 4, dark);
      p(23, 28, 8, 3, dark);
      p(13, 15, 9, 3, "#ffffff");
    } else if (typeId === "taco_tiger") {
      pixelOval(p, 7, 12, 34, 24, dark);
      pixelOval(p, 9, 14, 30, 20, "#f1c84b");
      p(11, 17, 26, 9, "#d9573c");
      p(14, 16, 20, 4, "#5a8d47");
      p(14, 24, 5, 8, dark);
      p(29, 24, 5, 8, dark);
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(13, 14, 7, 3, hi);
    } else if (typeId === "berry_bat") {
      p(4, 14, 12, 8, dark);
      p(32, 14, 12, 8, dark);
      p(6, 16, 10, 10, "#7542a8");
      p(32, 16, 10, 10, "#7542a8");
      pixelOval(p, 14, 10, 20, 25, dark);
      pixelOval(p, 16, 12, 16, 21, "#7542a8");
      p(17, 13, 5, 5, "#dd5ea8");
      p(26, 13, 5, 5, "#dd5ea8");
      p(19, 22, 3, 3, dark);
      p(28, 22, 3, 3, dark);
      p(21, 28, 8, 3, dark);
    } else if (typeId === "pancake_penguin") {
      pixelOval(p, 10, 12, 28, 25, dark);
      pixelOval(p, 12, 14, 24, 21, "#f1f5ec");
      p(9, 22, 30, 6, "#e8b765");
      p(11, 16, 26, 5, "#f3cf8c");
      p(13, 11, 22, 5, "#e8b765");
      p(20, 9, 8, 4, "#f5d45b");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(34, 25, 5, 5, "#b36a2e");
    } else if (typeId === "pretzel_python") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#c47a35");
      pixelOval(p, 14, 18, 8, 10, "#f0d56b");
      pixelOval(p, 27, 18, 8, 10, "#f0d56b");
      p(20, 20, 9, 6, "#c47a35");
      p(33, 11, 8, 8, "#c47a35");
      p(36, 13, 3, 3, dark);
      p(30, 8, 6, 3, "#f0d56b");
      p(18, 31, 14, 3, "#6a3c24");
      p(12, 15, 3, 3, hi);
    } else if (typeId === "curry_crab") {
      pixelOval(p, 10, 13, 28, 23, dark);
      pixelOval(p, 12, 15, 24, 19, "#d9852f");
      p(5, 19, 9, 6, dark);
      p(34, 19, 9, 6, dark);
      p(3, 18, 9, 5, "#8d3d27");
      p(36, 18, 9, 5, "#8d3d27");
      p(14, 12, 6, 5, "#f0c64a");
      p(28, 12, 6, 5, "#f0c64a");
      p(18, 22, 4, 4, dark);
      p(28, 22, 4, 4, dark);
      p(21, 29, 9, 3, dark);
      p(16, 15, 16, 3, "#f5d45b");
    } else if (typeId === "popcorn_porcupine") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#f4d35e");
      p(11, 10, 5, 8, "#fff4c2");
      p(17, 8, 5, 10, "#fff4c2");
      p(24, 8, 5, 10, "#fff4c2");
      p(31, 10, 5, 8, "#fff4c2");
      p(12, 17, 24, 5, "#ffd96b");
      p(36, 20, 7, 5, "#9c6a2f");
      p(18, 22, 4, 4, dark);
      p(29, 22, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(13, 27, 4, 4, "#fff4c2");
      p(32, 27, 4, 4, "#fff4c2");
    } else if (typeId === "yogurt_yeti") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#f4f6ff");
      p(12, 17, 24, 5, "#d6ecff");
      p(10, 11, 8, 7, dark);
      p(30, 11, 8, 7, dark);
      p(12, 12, 6, 5, "#f4f6ff");
      p(30, 12, 6, 5, "#f4f6ff");
      p(16, 22, 4, 4, dark);
      p(29, 22, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(34, 24, 6, 6, "#6aa5d8");
      p(12, 27, 5, 5, "#f8bdd8");
    } else if (typeId === "pepper_prawn") {
      pixelOval(p, 8, 13, 32, 22, dark);
      pixelOval(p, 10, 15, 28, 18, "#f26a35");
      p(33, 12, 9, 7, "#5aa6d6");
      p(37, 15, 6, 4, "#f26a35");
      p(7, 18, 6, 5, "#5aa6d6");
      p(12, 13, 8, 4, "#f4d35e");
      p(20, 21, 4, 4, dark);
      p(30, 20, 4, 4, dark);
      p(22, 29, 8, 3, dark);
      p(13, 26, 5, 4, "#e24822");
    } else if (typeId === "hot_chip_hamster") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#e55a2a");
      p(12, 15, 24, 5, "#f4d35e");
      p(14, 23, 21, 4, "#8d3d27");
      p(9, 10, 8, 8, dark);
      p(31, 10, 8, 8, dark);
      p(11, 11, 6, 6, "#f4d35e");
      p(31, 11, 6, 6, "#f4d35e");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(35, 24, 7, 5, "#f7c94f");
    } else if (typeId === "bagel_beaver") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#c98a3a");
      pixelOval(p, 16, 16, 17, 12, "#f0d56b");
      pixelOval(p, 21, 19, 7, 6, "#6a4b35");
      p(9, 21, 7, 8, "#8b5d35");
      p(34, 21, 7, 8, "#8b5d35");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 30, 9, 3, dark);
      p(15, 13, 4, 2, hi);
    } else if (typeId === "bao_bun_badger") {
      pixelOval(p, 7, 12, 34, 25, dark);
      pixelOval(p, 9, 14, 30, 21, "#f0d8b4");
      p(12, 16, 24, 5, "#fff0cf");
      p(13, 25, 23, 5, "#c05a39");
      p(10, 12, 8, 9, "#6b4b35");
      p(31, 12, 8, 9, "#6b4b35");
      p(16, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(36, 22, 7, 6, "#e0a44a");
    } else if (typeId === "donut_dodo") {
      pixelOval(p, 9, 12, 30, 25, dark);
      pixelOval(p, 11, 14, 26, 21, "#e7a85c");
      pixelOval(p, 17, 18, 14, 10, "#f6d0a6");
      pixelOval(p, 20, 20, 8, 6, "#7b4a33");
      p(14, 13, 23, 5, "#d9548f");
      p(13, 29, 20, 4, "#c47a35");
      p(17, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(35, 20, 6, 5, "#f0c64a");
    } else if (typeId === "kimchi_chameleon") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#e65036");
      p(11, 16, 25, 5, "#f0773e");
      p(31, 12, 10, 8, "#6a9d38");
      p(38, 14, 5, 4, "#e65036");
      p(14, 11, 8, 4, "#6a9d38");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(21, 29, 10, 3, dark);
      p(12, 25, 5, 3, "#f8d95a");
    } else if (typeId === "waffle_walrus") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#d8a64a");
      p(12, 17, 24, 3, "#9b6a2d");
      p(12, 23, 24, 3, "#9b6a2d");
      p(16, 15, 3, 20, "#9b6a2d");
      p(27, 15, 3, 20, "#9b6a2d");
      p(12, 28, 24, 5, "#6c8fbd");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(14, 32, 5, 6, "#fff4b8");
      p(31, 32, 5, 6, "#fff4b8");
    } else if (typeId === "dumpling_armadillo") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#f0dcb8");
      p(12, 18, 24, 4, "#d6b58c");
      p(12, 24, 24, 4, "#d6b58c");
      p(14, 13, 19, 4, "#fff4d8");
      p(13, 28, 23, 5, "#8b6f50");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 17, 6, 8, "#8b6f50");
    } else if (typeId === "lemon_meringue_lynx") {
      pixelOval(p, 9, 12, 30, 24, dark);
      pixelOval(p, 11, 14, 26, 20, "#f2dc5d");
      p(13, 10, 7, 8, dark);
      p(29, 10, 7, 8, dark);
      p(15, 11, 5, 6, "#f2dc5d");
      p(29, 11, 5, 6, "#f2dc5d");
      p(13, 14, 24, 5, "#ffffff");
      p(17, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(35, 24, 5, 5, "#ffffff");
    } else if (typeId === "shakshuka_shark") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#e24822");
      p(13, 18, 25, 5, "#f4d35e");
      p(34, 12, 8, 7, "#e24822");
      p(38, 14, 6, 4, "#f4d35e");
      p(12, 11, 9, 5, "#fff4b8");
      p(18, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(8, 25, 6, 5, "#8d3d27");
    } else if (typeId === "saltwater_taffy_otter") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#f2a7c7");
      p(12, 17, 25, 4, "#ffffff");
      p(13, 25, 24, 4, "#5aa6d6");
      p(34, 14, 8, 8, "#5aa6d6");
      p(7, 24, 8, 6, "#f7d2df");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 29, 10, 3, dark);
      p(35, 24, 6, 6, "#ffffff");
    } else if (typeId === "croissant_kraken") {
      pixelOval(p, 8, 12, 32, 23, dark);
      pixelOval(p, 10, 14, 28, 19, "#d69a3e");
      p(12, 15, 24, 5, "#f0c56b");
      p(7, 27, 8, 5, "#6b4aa8");
      p(17, 29, 7, 5, "#6b4aa8");
      p(29, 29, 7, 5, "#6b4aa8");
      p(37, 25, 6, 5, "#6b4aa8");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 28, 9, 3, dark);
    } else if (typeId === "fortune_cookie_fox") {
      pixelOval(p, 9, 12, 30, 23, dark);
      pixelOval(p, 11, 14, 26, 19, "#e4b65f");
      p(12, 9, 8, 8, dark);
      p(29, 9, 8, 8, dark);
      p(14, 10, 6, 6, "#e4b65f");
      p(30, 10, 6, 6, "#e4b65f");
      p(34, 20, 9, 7, "#d24d53");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(20, 15, 11, 3, "#fff4b8");
    } else if (typeId === "mochi_mammoth") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#f2d6df");
      p(11, 18, 27, 5, "#fff4f5");
      p(33, 18, 9, 8, "#f2d6df");
      p(36, 22, 5, 9, "#8b6fb0");
      p(15, 27, 5, 8, dark);
      p(30, 27, 5, 8, dark);
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(23, 29, 8, 3, dark);
    } else if (typeId === "gingerbread_golem") {
      pixelOval(p, 8, 11, 32, 26, dark);
      pixelOval(p, 10, 13, 28, 22, "#b66b34");
      p(13, 15, 22, 4, "#f5f0df");
      p(13, 29, 22, 4, "#f5f0df");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 28, 8, 3, dark);
      p(6, 24, 7, 6, "#d24d53");
      p(36, 24, 7, 6, "#6ba044");
    } else if (typeId === "boba_basilisk") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#c99bd8");
      p(31, 11, 10, 8, "#3d263d");
      p(36, 13, 5, 4, "#c99bd8");
      p(13, 27, 25, 5, "#3d263d");
      p(14, 13, 5, 5, "#f4e7ff");
      p(23, 12, 5, 5, "#f4e7ff");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
    } else if (typeId === "iceberg_oyster") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#d8f2ff");
      p(12, 18, 24, 5, "#7ec7e8");
      p(15, 12, 18, 5, "#ffffff");
      p(20, 19, 9, 8, "#f4e7ff");
      p(22, 21, 5, 4, "#4d9d95");
      p(17, 24, 4, 4, dark);
      p(30, 24, 4, 4, dark);
      p(21, 31, 10, 3, dark);
      p(34, 16, 6, 7, "#4d9d95");
    } else if (typeId === "churro_cheetah") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#c98335");
      p(12, 16, 24, 4, "#f0c56b");
      p(14, 22, 22, 3, "#8d3d27");
      p(33, 12, 9, 7, "#e24822");
      p(38, 14, 5, 4, "#f4d35e");
      p(16, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(20, 29, 10, 3, dark);
      p(11, 27, 5, 4, "#f4d35e");
    } else if (typeId === "granola_goat") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#d6a04c");
      p(12, 17, 24, 5, "#f0d56b");
      p(10, 10, 8, 8, dark);
      p(30, 10, 8, 8, dark);
      p(12, 11, 6, 6, "#d6a04c");
      p(30, 11, 6, 6, "#d6a04c");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 25, 5, 5, "#7aa530");
      p(34, 25, 5, 5, "#7d3aa0");
    } else if (typeId === "breakfast_burrito_boar") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#d99736");
      p(12, 16, 25, 5, "#f5d45b");
      p(13, 22, 24, 5, "#55a375");
      p(35, 17, 7, 7, "#8d3d27");
      p(6, 25, 7, 5, "#8d3d27");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(12, 28, 5, 5, "#e24822");
    } else if (typeId === "caesar_salamander") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#78b84d");
      p(12, 16, 24, 5, "#a7d66d");
      p(13, 25, 23, 4, "#f0dcb8");
      p(34, 18, 8, 7, "#78b84d");
      p(7, 25, 8, 5, "#3f8f5a");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 13, 5, 3, hi);
    } else if (typeId === "cucumber_cobra") {
      pixelOval(p, 6, 14, 36, 22, dark);
      pixelOval(p, 8, 16, 32, 18, "#86c95b");
      p(12, 17, 24, 4, "#b7e07d");
      p(33, 10, 9, 9, dark);
      p(35, 11, 7, 7, "#86c95b");
      p(38, 13, 5, 4, "#d8f2a2");
      p(15, 27, 18, 4, "#3f8f5a");
      p(18, 22, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(11, 14, 6, 3, hi);
    } else if (typeId === "avocado_axolotl") {
      pixelOval(p, 8, 11, 32, 26, dark);
      pixelOval(p, 10, 13, 28, 22, "#8dbb4d");
      pixelOval(p, 16, 17, 16, 13, "#d8e998");
      pixelOval(p, 21, 20, 7, 7, "#6f4b2f");
      p(6, 17, 8, 5, "#d8f2a2");
      p(35, 17, 8, 5, "#d8f2a2");
      p(6, 25, 8, 5, "#d8f2a2");
      p(35, 25, 8, 5, "#d8f2a2");
      p(18, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(21, 31, 9, 3, dark);
    } else if (typeId === "herb_hare") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#6fad4e");
      p(12, 4, 6, 16, dark);
      p(30, 4, 6, 16, dark);
      p(13, 5, 4, 14, "#8fcf5d");
      p(31, 5, 4, 14, "#8fcf5d");
      p(13, 22, 23, 4, "#d9b56f");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 25, 6, 5, "#d8f2a2");
    } else if (typeId === "caprese_capybara") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#f2f1dc");
      p(12, 16, 25, 5, "#d84a3a");
      p(13, 24, 24, 4, "#6fae48");
      p(8, 10, 9, 8, dark);
      p(31, 10, 9, 8, dark);
      p(10, 11, 7, 6, "#f2f1dc");
      p(31, 11, 7, 6, "#f2f1dc");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
    } else if (typeId === "vinaigrette_viper") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#d7bd45");
      p(12, 16, 25, 4, "#f0d56b");
      p(12, 25, 24, 4, "#6fae48");
      p(33, 11, 10, 8, "#6fae48");
      p(38, 13, 5, 4, "#d7bd45");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(12, 27, 5, 4, "#e24822");
    } else if (typeId === "kelp_koala") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#4fae78");
      p(8, 9, 9, 9, dark);
      p(31, 9, 9, 9, dark);
      p(10, 10, 7, 7, "#6ecf98");
      p(31, 10, 7, 7, "#6ecf98");
      p(13, 24, 24, 5, "#2f7f83");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(34, 18, 7, 7, "#67bfb5");
    } else if (typeId === "melon_mint_mantis") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#9fda6e");
      p(13, 17, 22, 4, "#d8f2a2");
      p(7, 12, 10, 5, "#55b89b");
      p(32, 12, 10, 5, "#55b89b");
      p(6, 28, 12, 4, "#55b89b");
      p(31, 28, 12, 4, "#55b89b");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(35, 20, 5, 6, "#f1cf75");
    } else if (typeId === "coconut_shrimp_sheep") {
      pixelOval(p, 7, 12, 34, 25, dark);
      pixelOval(p, 9, 14, 30, 21, "#f1d8aa");
      p(11, 16, 26, 5, "#fff4d8");
      p(33, 16, 9, 8, "#df8f57");
      p(37, 18, 5, 4, "#f1d8aa");
      p(9, 10, 8, 8, dark);
      p(30, 10, 8, 8, dark);
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(13, 27, 5, 4, "#df8f57");
    } else if (typeId === "crab_cake_caterpillar") {
      pixelOval(p, 6, 14, 36, 22, dark);
      pixelOval(p, 8, 16, 32, 18, "#d99a4f");
      p(11, 17, 26, 5, "#f0c56b");
      p(13, 25, 23, 4, "#5ea3b5");
      p(7, 24, 7, 6, "#c45f3a");
      p(36, 24, 7, 6, "#c45f3a");
      p(16, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 15, 5, 4, "#fff4d8");
    } else if (typeId === "pico_de_gallo_gecko") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#d84a3a");
      p(12, 17, 24, 4, "#f26a35");
      p(12, 25, 24, 5, "#65ad52");
      p(33, 12, 10, 8, "#65ad52");
      p(38, 14, 5, 4, "#d84a3a");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 26, 5, 4, "#fff4d8");
    } else {
      pixelOval(p, 8, 12, 32, 23, dark);
      pixelOval(p, 10, 14, 28, 19, "#ead77b");
      p(12, 21, 24, 5, "#55a375");
      p(16, 18, 17, 3, "#f7e8ae");
      p(18, 20, 4, 4, dark);
      p(30, 20, 4, 4, dark);
      p(21, 29, 9, 3, dark);
      p(13, 15, 7, 3, hi);
    }

    drawEvolutionDetails(p, typeId, unit.tier, dark, hi);
    if (unit.tier >= 2) {
      p(35, 7, 4, 4, "#f0c64a");
      p(33, 9, 8, 2, "#f0c64a");
      p(36, 5, 2, 8, "#f0c64a");
    }
    if (unit.tier >= 3) {
      p(8, 7, 3, 3, "#f0c64a");
      p(6, 8, 7, 1, "#f0c64a");
      p(9, 5, 1, 7, "#f0c64a");
    }
    if (unit.tier >= 4) {
      p(39, 36, 4, 4, "#fff4b8");
      p(37, 38, 8, 2, "#fff4b8");
      p(40, 34, 2, 8, "#fff4b8");
      p(4, 36, 4, 4, "#fff4b8");
      p(2, 38, 8, 2, "#fff4b8");
      p(5, 34, 2, 8, "#fff4b8");
    }
    p(13, 34, 22, 2, shade);
  }

  function drawEvolutionDetails(p, typeId, tier, dark, hi) {
    if (tier < 2) return;
    if (typeId === "toast_tortoise") {
      p(12, 25, 26, 3, "#5a8d47");
      p(21, 13, 8, 4, "#f5d45b");
      p(19, 12, 12, 2, hi);
      if (tier >= 3) {
        p(9, 7, 31, 4, dark);
        p(11, 6, 27, 4, "#e8b765");
        p(14, 5, 21, 3, "#f7d39b");
        p(13, 31, 25, 3, "#5a8d47");
      }
      if (tier >= 4) {
        p(7, 4, 35, 5, dark);
        p(9, 3, 31, 5, "#f0c64a");
        p(12, 2, 25, 3, hi);
        p(10, 10, 29, 3, "#d9573c");
        p(10, 33, 29, 3, "#55a375");
        p(5, 24, 5, 6, "#85512e");
        p(38, 24, 5, 6, "#85512e");
      }
    } else if (typeId === "sushi_seal") {
      p(15, 11, 20, 5, "#f68a7c");
      p(17, 12, 7, 2, hi);
      p(33, 16, 3, 3, "#f0c64a");
      if (tier >= 3) {
        p(12, 28, 24, 4, "#25352f");
        p(14, 29, 5, 3, "#f0c64a");
        p(22, 29, 5, 3, "#55a375");
        p(30, 29, 5, 3, "#e45a6d");
        p(35, 12, 3, 7, "#55a375");
      }
      if (tier >= 4) {
        p(10, 8, 28, 5, dark);
        p(12, 7, 24, 5, "#f68a7c");
        p(15, 6, 7, 3, hi);
        p(12, 31, 25, 4, "#25352f");
        p(15, 32, 5, 3, "#f0c64a");
        p(23, 32, 5, 3, "#55a375");
        p(31, 32, 5, 3, "#e45a6d");
        p(38, 14, 4, 12, "#55a375");
      }
    } else if (typeId === "taco_tiger") {
      p(11, 14, 26, 4, "#6aae45");
      p(13, 17, 4, 4, "#f0c64a");
      p(22, 16, 4, 5, "#f0c64a");
      p(32, 17, 3, 4, "#f0c64a");
      if (tier >= 3) {
        p(10, 11, 28, 3, dark);
        p(12, 10, 24, 3, "#f1c84b");
        p(14, 13, 3, 7, dark);
        p(25, 13, 3, 7, dark);
        p(35, 14, 3, 9, "#d9573c");
      }
      if (tier >= 4) {
        p(8, 8, 33, 4, dark);
        p(10, 7, 29, 4, "#f1c84b");
        p(12, 12, 25, 4, "#6aae45");
        p(11, 19, 26, 3, "#f0c64a");
        p(8, 22, 5, 9, "#d9573c");
        p(36, 22, 5, 9, "#d9573c");
        p(16, 13, 3, 10, dark);
        p(25, 13, 3, 10, dark);
        p(33, 13, 3, 10, dark);
      }
    } else if (typeId === "berry_bat") {
      p(15, 10, 5, 5, "#9d5ac8");
      p(28, 10, 5, 5, "#9d5ac8");
      p(22, 8, 5, 4, "#55a375");
      p(8, 13, 7, 4, "#9d5ac8");
      p(33, 13, 7, 4, "#9d5ac8");
      if (tier >= 3) {
        p(21, 5, 7, 4, "#55a375");
        p(24, 2, 3, 6, "#6a4b35");
        p(3, 11, 11, 5, dark);
        p(34, 11, 11, 5, dark);
      }
      if (tier >= 4) {
        p(20, 2, 10, 5, "#f0c64a");
        p(23, 0, 4, 7, "#f0c64a");
        p(6, 8, 12, 7, dark);
        p(30, 8, 12, 7, dark);
        p(4, 12, 13, 9, "#9d5ac8");
        p(31, 12, 13, 9, "#9d5ac8");
        p(13, 29, 6, 5, "#dd5ea8");
        p(29, 29, 6, 5, "#dd5ea8");
      }
    } else if (typeId === "pancake_penguin") {
      p(10, 19, 29, 4, "#b36a2e");
      p(13, 8, 22, 4, "#f3cf8c");
      p(18, 7, 13, 3, "#e8b765");
      if (tier >= 3) {
        p(8, 10, 33, 5, dark);
        p(10, 9, 29, 5, "#e8b765");
        p(12, 6, 25, 4, "#f3cf8c");
        p(19, 4, 10, 4, "#f5d45b");
        p(6, 26, 6, 4, "#b36a2e");
        p(36, 26, 6, 4, "#b36a2e");
      }
      if (tier >= 4) {
        p(7, 5, 35, 5, dark);
        p(9, 4, 31, 5, "#f0c64a");
        p(13, 2, 23, 4, hi);
        p(12, 11, 27, 3, "#b36a2e");
        p(15, 17, 21, 3, "#b36a2e");
      }
    } else if (typeId === "pretzel_python") {
      p(10, 29, 28, 3, "#f0d56b");
      p(33, 9, 8, 4, "#f0d56b");
      p(25, 12, 11, 3, dark);
      if (tier >= 3) {
        p(5, 11, 38, 4, dark);
        p(7, 12, 34, 3, "#c47a35");
        p(13, 16, 8, 9, "#f0d56b");
        p(28, 16, 8, 9, "#f0d56b");
        p(18, 5, 14, 4, "#f0d56b");
      }
      if (tier >= 4) {
        p(4, 8, 40, 5, dark);
        p(6, 9, 36, 4, "#c47a35");
        p(11, 16, 10, 12, "#f0d56b");
        p(28, 16, 10, 12, "#f0d56b");
        p(19, 3, 17, 5, "#f0d56b");
        p(35, 8, 6, 8, "#8d3d27");
      }
    } else if (typeId === "curry_crab") {
      p(8, 16, 33, 4, "#f5d45b");
      p(11, 13, 27, 3, "#8d3d27");
      p(5, 15, 8, 5, "#f0c64a");
      p(35, 15, 8, 5, "#f0c64a");
      if (tier >= 3) {
        p(9, 9, 31, 4, dark);
        p(11, 8, 27, 4, "#d9852f");
        p(13, 12, 23, 3, "#f5d45b");
        p(2, 15, 11, 6, "#8d3d27");
        p(35, 15, 11, 6, "#8d3d27");
      }
      if (tier >= 4) {
        p(7, 6, 35, 5, dark);
        p(9, 5, 31, 5, "#f0c64a");
        p(12, 10, 25, 4, "#d9852f");
        p(1, 13, 13, 8, "#8d3d27");
        p(34, 13, 13, 8, "#8d3d27");
        p(5, 22, 6, 8, "#f0c64a");
        p(37, 22, 6, 8, "#f0c64a");
      }
    } else if (typeId === "pepper_prawn") {
      p(11, 12, 28, 4, "#f4d35e");
      p(35, 12, 8, 6, "#5aa6d6");
      p(8, 24, 7, 5, "#e24822");
      if (tier >= 3) {
        p(7, 8, 34, 4, dark);
        p(9, 7, 30, 4, "#f26a35");
        p(12, 5, 24, 3, "#f4d35e");
        p(34, 10, 10, 9, "#5aa6d6");
        p(5, 22, 9, 6, "#e24822");
      }
      if (tier >= 4) {
        p(5, 4, 38, 5, dark);
        p(7, 3, 34, 5, "#f26a35");
        p(10, 9, 29, 4, "#f4d35e");
        p(34, 7, 11, 13, "#5aa6d6");
        p(3, 20, 12, 8, "#e24822");
        p(36, 24, 8, 6, "#f4d35e");
      }
    } else if (typeId === "hot_chip_hamster") {
      p(10, 11, 29, 4, "#f4d35e");
      p(11, 27, 28, 4, "#8d3d27");
      p(8, 10, 9, 6, "#f7c94f");
      p(32, 10, 9, 6, "#f7c94f");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#e55a2a");
        p(12, 5, 25, 3, "#f4d35e");
        p(5, 22, 9, 8, "#8d3d27");
        p(35, 22, 9, 8, "#f7c94f");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f4d35e");
        p(10, 9, 29, 4, "#e55a2a");
        p(3, 20, 11, 10, "#8d3d27");
        p(34, 20, 11, 10, "#f7c94f");
        p(18, 2, 13, 5, "#fff4b8");
      }
    } else if (typeId === "popcorn_porcupine") {
      p(12, 10, 25, 4, "#fff4c2");
      p(14, 8, 4, 8, "#9c6a2f");
      p(24, 7, 4, 9, "#9c6a2f");
      p(33, 10, 4, 7, "#9c6a2f");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#fff4c2");
        p(12, 13, 25, 3, "#f4d35e");
        p(5, 18, 7, 10, "#9c6a2f");
        p(38, 18, 6, 9, "#9c6a2f");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#fff4c2");
        p(12, 2, 4, 9, "#f4d35e");
        p(22, 1, 4, 10, "#f4d35e");
        p(32, 2, 4, 9, "#f4d35e");
        p(11, 28, 26, 4, "#9c6a2f");
      }
    } else if (typeId === "yogurt_yeti") {
      p(11, 17, 27, 4, "#d6ecff");
      p(12, 10, 8, 5, "#6aa5d8");
      p(29, 10, 8, 5, "#6aa5d8");
      if (tier >= 3) {
        p(8, 8, 33, 5, dark);
        p(10, 7, 29, 5, "#f4f6ff");
        p(13, 12, 23, 4, "#d6ecff");
        p(6, 24, 7, 7, "#6aa5d8");
        p(36, 24, 7, 7, "#6aa5d8");
      }
      if (tier >= 4) {
        p(7, 4, 35, 5, dark);
        p(9, 3, 31, 5, "#d6ecff");
        p(13, 2, 7, 6, "#f8bdd8");
        p(29, 2, 7, 6, "#f8bdd8");
        p(10, 13, 29, 4, "#f4f6ff");
        p(13, 28, 23, 4, "#6aa5d8");
      }
    } else if (typeId === "donut_dodo") {
      p(12, 10, 27, 4, "#d9548f");
      p(16, 9, 3, 3, "#fff4b8");
      p(24, 8, 3, 3, "#6a9d38");
      p(31, 9, 3, 3, "#5a78c8");
      if (tier >= 3) {
        p(7, 11, 35, 4, dark);
        p(9, 10, 31, 4, "#d9548f");
        p(16, 5, 18, 5, "#f0c64a");
        p(38, 18, 5, 12, "#e7a85c");
      }
      if (tier >= 4) {
        p(8, 5, 33, 5, "#f0c64a");
        p(12, 3, 25, 4, hi);
        p(11, 12, 28, 4, "#d9548f");
        p(6, 20, 6, 10, "#f0c64a");
        p(37, 20, 6, 10, "#f0c64a");
      }
    } else if (typeId === "kimchi_chameleon") {
      p(10, 14, 29, 4, "#f0773e");
      p(29, 10, 12, 6, "#6a9d38");
      p(8, 28, 29, 4, "#6a9d38");
      if (tier >= 3) {
        p(7, 10, 35, 4, dark);
        p(9, 9, 31, 4, "#e65036");
        p(13, 7, 24, 3, "#f8d95a");
        p(34, 11, 10, 10, "#6a9d38");
        p(4, 24, 7, 5, "#f0773e");
      }
      if (tier >= 4) {
        p(6, 6, 36, 5, dark);
        p(8, 5, 32, 5, "#6a9d38");
        p(10, 10, 28, 4, "#e65036");
        p(36, 10, 8, 14, "#f8d95a");
        p(3, 22, 9, 7, "#6a9d38");
      }
    } else if (typeId === "waffle_walrus") {
      p(10, 12, 30, 4, "#9b6a2d");
      p(13, 26, 26, 4, "#6c8fbd");
      p(13, 33, 5, 7, "#fff4b8");
      p(31, 33, 5, 7, "#fff4b8");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#d8a64a");
        p(4, 20, 8, 5, "#b56b12");
        p(36, 20, 8, 5, "#b56b12");
        p(18, 31, 12, 4, "#fff4b8");
      }
      if (tier >= 4) {
        p(6, 5, 38, 5, dark);
        p(8, 4, 34, 5, "#d8a64a");
        p(10, 10, 30, 4, "#9b6a2d");
        p(3, 17, 10, 8, "#b56b12");
        p(35, 17, 10, 8, "#b56b12");
        p(12, 34, 8, 7, hi);
        p(29, 34, 8, 7, hi);
      }
    } else if (typeId === "bagel_beaver") {
      p(10, 12, 30, 4, "#f0d56b");
      p(12, 28, 26, 5, "#8b5a2b");
      p(15, 10, 3, 3, "#ffffff");
      p(29, 10, 3, 3, "#ffffff");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#c98a3a");
        p(12, 6, 25, 3, "#f0d56b");
        p(6, 26, 10, 8, "#8b5a2b");
        p(32, 26, 10, 8, "#8b5a2b");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#f0d56b");
        p(10, 10, 29, 4, "#c98a3a");
        p(4, 24, 11, 10, "#8b5a2b");
        p(33, 24, 11, 10, "#8b5a2b");
        p(17, 2, 15, 5, "#fff4b8");
      }
    } else if (typeId === "bao_bun_badger") {
      p(10, 12, 30, 4, "#fff0cf");
      p(11, 27, 28, 5, "#c05a39");
      p(9, 10, 9, 6, "#6b4b35");
      p(31, 10, 9, 6, "#6b4b35");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f0d8b4");
        p(12, 6, 25, 3, "#fff0cf");
        p(5, 24, 9, 8, "#c05a39");
        p(36, 20, 8, 8, "#e0a44a");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#fff0cf");
        p(10, 10, 29, 4, "#f0d8b4");
        p(3, 22, 11, 10, "#c05a39");
        p(35, 18, 10, 11, "#e0a44a");
        p(17, 2, 15, 5, "#6b4b35");
      }
    } else if (typeId === "dumpling_armadillo") {
      p(11, 12, 27, 4, "#fff4d8");
      p(9, 25, 30, 5, "#8b6f50");
      p(35, 15, 5, 12, "#8b6f50");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f0dcb8");
        p(12, 13, 26, 4, "#d6b58c");
        p(5, 24, 8, 8, "#8b6f50");
        p(36, 24, 8, 8, "#8b6f50");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#d6b58c");
        p(11, 3, 27, 4, "#fff4d8");
        p(10, 11, 29, 4, "#8b6f50");
        p(4, 22, 9, 10, "#8b6f50");
        p(36, 22, 9, 10, "#8b6f50");
      }
    } else if (typeId === "lemon_meringue_lynx") {
      p(11, 13, 28, 4, "#ffffff");
      p(16, 8, 19, 4, "#fff4b8");
      p(34, 21, 6, 6, "#ffffff");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#f2dc5d");
        p(13, 6, 24, 3, "#ffffff");
        p(6, 22, 8, 5, "#fff4b8");
        p(35, 22, 8, 5, "#fff4b8");
      }
      if (tier >= 4) {
        p(7, 5, 36, 5, dark);
        p(9, 4, 32, 5, "#f2dc5d");
        p(12, 2, 25, 4, "#ffffff");
        p(10, 12, 29, 4, "#fff4b8");
        p(4, 20, 9, 8, "#ffffff");
        p(36, 20, 9, 8, "#ffffff");
      }
    } else if (typeId === "shakshuka_shark") {
      p(10, 12, 30, 4, "#f4d35e");
      p(9, 27, 30, 5, "#8d3d27");
      p(34, 10, 8, 8, "#e24822");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#e24822");
        p(12, 12, 25, 4, "#f4d35e");
        p(5, 24, 9, 8, "#8d3d27");
        p(35, 10, 9, 12, "#f26a35");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#8d3d27");
        p(10, 10, 29, 4, "#e24822");
        p(12, 15, 24, 4, "#f4d35e");
        p(3, 22, 11, 10, "#f26a35");
        p(34, 8, 11, 14, "#f26a35");
      }
    } else if (typeId === "saltwater_taffy_otter") {
      p(10, 12, 30, 4, "#ffffff");
      p(10, 27, 29, 5, "#5aa6d6");
      p(34, 12, 8, 8, "#5aa6d6");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f2a7c7");
        p(12, 6, 25, 3, "#ffffff");
        p(5, 23, 9, 8, "#5aa6d6");
        p(35, 13, 9, 11, "#f7d2df");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#f2a7c7");
        p(10, 10, 29, 4, "#ffffff");
        p(12, 15, 25, 4, "#5aa6d6");
        p(3, 21, 11, 10, "#f7d2df");
        p(34, 10, 11, 13, "#5aa6d6");
      }
    } else if (typeId === "croissant_kraken") {
      p(10, 11, 29, 4, "#f0c56b");
      p(5, 28, 38, 3, "#6b4aa8");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#d69a3e");
        p(12, 5, 25, 3, "#f0c56b");
        p(4, 25, 8, 8, "#6b4aa8");
        p(36, 25, 8, 8, "#6b4aa8");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f0c56b");
        p(10, 9, 29, 4, "#d69a3e");
        p(2, 21, 10, 10, "#6b4aa8");
        p(36, 20, 10, 10, "#6b4aa8");
      }
    } else if (typeId === "fortune_cookie_fox") {
      p(14, 12, 22, 4, "#fff4b8");
      p(34, 18, 8, 7, "#d24d53");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#e4b65f");
        p(13, 6, 24, 3, "#fff4b8");
        p(35, 17, 9, 9, "#d24d53");
        p(6, 24, 6, 5, "#d24d53");
      }
      if (tier >= 4) {
        p(7, 5, 36, 5, dark);
        p(9, 4, 32, 5, "#fff4b8");
        p(12, 10, 26, 4, "#e4b65f");
        p(3, 22, 10, 7, "#d24d53");
        p(36, 17, 9, 13, "#d24d53");
      }
    } else if (typeId === "mochi_mammoth") {
      p(10, 13, 30, 4, "#fff4f5");
      p(35, 20, 5, 12, "#8b6fb0");
      if (tier >= 3) {
        p(7, 10, 35, 4, dark);
        p(9, 9, 31, 4, "#f2d6df");
        p(12, 7, 25, 3, "#fff4f5");
        p(4, 24, 8, 8, "#8b6fb0");
        p(36, 24, 8, 8, "#8b6fb0");
      }
      if (tier >= 4) {
        p(5, 6, 39, 5, dark);
        p(7, 5, 35, 5, "#8b6fb0");
        p(10, 4, 29, 3, "#fff4f5");
        p(3, 21, 10, 10, "#8b6fb0");
        p(36, 21, 10, 10, "#8b6fb0");
      }
    } else if (typeId === "gingerbread_golem") {
      p(12, 12, 26, 4, "#f5f0df");
      p(12, 31, 26, 3, "#f5f0df");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#b66b34");
        p(12, 6, 25, 3, "#f5f0df");
        p(5, 23, 8, 8, "#d24d53");
        p(36, 23, 8, 8, "#6ba044");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f5f0df");
        p(10, 9, 29, 4, "#b66b34");
        p(3, 20, 10, 10, "#d24d53");
        p(36, 20, 10, 10, "#6ba044");
      }
    } else if (typeId === "boba_basilisk") {
      p(10, 14, 29, 4, "#f4e7ff");
      p(10, 29, 28, 3, "#3d263d");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#c99bd8");
        p(13, 6, 24, 3, "#f4e7ff");
        p(34, 11, 9, 10, "#3d263d");
        p(5, 24, 8, 6, "#3d263d");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#c99bd8");
        p(11, 3, 27, 3, "#f4e7ff");
        p(35, 9, 10, 14, "#3d263d");
        p(3, 22, 10, 8, "#3d263d");
      }
    } else if (typeId === "iceberg_oyster") {
      p(10, 13, 30, 4, "#ffffff");
      p(13, 26, 25, 5, "#7ec7e8");
      p(20, 17, 9, 9, "#f4e7ff");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#d8f2ff");
        p(12, 6, 25, 3, "#ffffff");
        p(5, 23, 9, 9, "#7ec7e8");
        p(35, 15, 9, 10, "#4d9d95");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#d8f2ff");
        p(10, 10, 29, 4, "#ffffff");
        p(17, 15, 15, 12, "#f4e7ff");
        p(20, 18, 9, 7, "#4d9d95");
        p(3, 21, 11, 10, "#7ec7e8");
        p(36, 14, 9, 13, "#4d9d95");
      }
    } else if (typeId === "churro_cheetah") {
      p(10, 12, 29, 4, "#f0c56b");
      p(34, 10, 8, 8, "#e24822");
      p(10, 27, 28, 4, "#8d3d27");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#c98335");
        p(12, 5, 25, 3, "#f0c56b");
        p(5, 23, 9, 7, "#e24822");
        p(35, 11, 9, 11, "#e24822");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f4d35e");
        p(10, 9, 29, 4, "#c98335");
        p(3, 20, 11, 10, "#e24822");
        p(34, 8, 11, 14, "#e24822");
        p(16, 14, 18, 3, "#fff4b8");
      }
    } else if (typeId === "granola_goat") {
      p(11, 12, 28, 4, "#f0d56b");
      p(13, 27, 25, 5, "#7aa530");
      p(9, 9, 9, 6, "#8b5d35");
      p(31, 9, 9, 6, "#8b5d35");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#d6a04c");
        p(12, 5, 25, 3, "#f0d56b");
        p(5, 22, 9, 8, "#7aa530");
        p(35, 22, 9, 8, "#7d3aa0");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f0d56b");
        p(10, 9, 29, 4, "#d6a04c");
        p(3, 20, 11, 10, "#7aa530");
        p(34, 20, 11, 10, "#7d3aa0");
        p(18, 2, 13, 5, "#fff4b8");
      }
    } else if (typeId === "breakfast_burrito_boar") {
      p(10, 12, 30, 4, "#f5d45b");
      p(10, 27, 29, 5, "#55a375");
      p(35, 15, 8, 8, "#8d3d27");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#d99736");
        p(12, 12, 25, 4, "#f5d45b");
        p(5, 23, 10, 8, "#8d3d27");
        p(35, 13, 9, 11, "#e24822");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#d99736");
        p(10, 10, 29, 4, "#f5d45b");
        p(12, 15, 25, 4, "#55a375");
        p(3, 22, 11, 9, "#8d3d27");
        p(34, 10, 11, 13, "#e24822");
      }
    } else {
      p(14, 16, 22, 3, "#f7e8ae");
      p(17, 13, 18, 3, "#f7e8ae");
      p(28, 9, 5, 5, "#55a375");
      p(33, 10, 4, 4, "#55a375");
      if (tier >= 3) {
        p(10, 11, 28, 3, "#f7e8ae");
        p(13, 8, 24, 3, "#f7e8ae");
        p(25, 5, 10, 4, "#55a375");
        p(35, 18, 4, 11, "#55a375");
      }
      if (tier >= 4) {
        p(8, 8, 31, 4, "#f7e8ae");
        p(11, 5, 28, 4, "#f7e8ae");
        p(14, 2, 19, 4, "#f7e8ae");
        p(27, 2, 10, 5, "#55a375");
        p(38, 17, 5, 13, "#55a375");
        p(7, 24, 5, 8, "#55a375");
        p(19, 10, 4, 4, "#f0c64a");
        p(31, 11, 4, 4, "#f0c64a");
      }
    }
  }

  function pixelOval(p, x, y, w, h, color) {
    const rows = [
      [0.28, 0.44],
      [0.14, 0.72],
      [0.04, 0.92],
      [0, 1],
      [0.04, 0.92],
      [0.14, 0.72],
      [0.28, 0.44],
    ];
    rows.forEach(([offset, width], index) => {
      const yy = y + Math.round((index / rows.length) * h);
      const hh = Math.max(2, Math.ceil(h / rows.length));
      p(x + Math.round(w * offset), yy, Math.round(w * width), hh, color);
    });
  }

  function drawStatsPanel() {
    const panel = INFO_PANEL;
    const contentX = panel.x + 20;
    const contentW = panel.w - 40;
    const textX = contentX + 66;
    const panelDy = panel.y - 136;
    const metricXs = [contentX, contentX + 58, contentX + 150, contentX + 211];
    const metricWs = [52, 86, 56, 57];
    const ref = getSelectedRef();
    const horror = realityBroken();
    const primary = themeColor("primary", "#16392d");
    const muted = themeColor("muted", "#6a4b35");
    const panelSoft = themeColor("panelSoft", "rgba(255, 253, 232, 0.82)");
    const borderDim = themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
    const teamIntelBg = getUiSprite(currentTeamIntelBgSrc());
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    if (teamIntelBg && teamIntelBg.complete && teamIntelBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(teamIntelBg, panel.x, panel.y, panel.w, panel.h);
      ctx.fillStyle = horror ? (ref ? "rgba(3, 10, 12, 0.52)" : "rgba(3, 10, 12, 0.26)") : "rgba(255, 253, 232, 0.16)";
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      ctx.restore();
    } else {
      ctx.fillStyle = panelSoft;
      ctx.fill();
    }
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    ctx.strokeStyle = borderDim;
    ctx.stroke();
    if (horror) {
      roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
      ctx.fillStyle = "rgba(3, 10, 12, 0.34)";
      ctx.fill();
      ctx.strokeStyle = themeColor("border", "rgba(70, 255, 99, 0.34)");
      ctx.stroke();
    }

    if (!ref) {
      const titleY = 166 + panelDy;
      const arenaDividerY = 190 + panelDy;
      const arenaY = 212 + panelDy;
      const pendingArenaRewards = arenaRewardPendingRows();
      const arenaRows = pendingArenaRewards.length ? 2 : 3;
      const rewardDividerY = arenaY + 92;
      const rewardY = rewardDividerY + 22;
      const rewardHeight = pendingArenaRewards.length ? 24 + Math.min(3, pendingArenaRewards.length) * 18 : 0;
      const traitDividerY = pendingArenaRewards.length ? rewardY + rewardHeight + 10 : 318 + panelDy;
      const traitY = traitDividerY + 22;
      ctx.fillStyle = primary;
      ctx.font = "900 17px Inter, sans-serif";
      ctx.fillText(copy("ui.panels.teamIntel", horror ? "War Intel" : "Team Intel"), contentX, titleY);
      drawInfoDivider(contentX, arenaDividerY, contentW);
      drawArenaInfoRows(contentX, arenaY, contentW, arenaRows);
      if (pendingArenaRewards.length) {
        drawInfoDivider(contentX, rewardDividerY, contentW);
        drawArenaRewardPendingRows(contentX, rewardY, contentW);
      }
      drawInfoDivider(contentX, traitDividerY, contentW);
      drawActiveTraitRows(contentX, traitY, contentW, pendingArenaRewards.length ? 4 : Infinity);
      return;
    }

    if (isItem(ref.entry)) {
      const item = ref.entry;
      const stat = itemPrimaryStat(item);
      const itemMetricY = 252 + panelDy;
      const showMergeInfo = !isDrink(item);
      const mergeBarY = 306 + panelDy;
      const mergeTextY = 324 + panelDy;
      const specsDividerY = (showMergeInfo ? 334 : 306) + panelDy;
      const specsTitleY = (showMergeInfo ? 360 : 332) + panelDy;
      drawItemIcon(item, contentX + 26, 194 + panelDy, 26);
      ctx.fillStyle = primary;
      ctx.font = "900 16px Inter, sans-serif";
      fitText(`${displayItemName(item)} ${itemLevelLabel(item)}`, textX, 178 + panelDy, contentW - 66, "900 16px Inter, sans-serif", primary);
      ctx.fillStyle = muted;
      ctx.font = "700 12px Inter, sans-serif";
      ctx.fillText(displayEntryTypeLabel(item), textX, 196 + panelDy);
      drawRarityBadge(textX, 205 + panelDy, item.rarity);
      drawInfoMetric("COST", { currency: entryCost(item) }, metricXs[0], itemMetricY, metricWs[0]);
      drawInfoMetric(stat.label, stat.value, metricXs[1], itemMetricY, metricWs[1]);
      drawInfoMetric("LV", `${itemTier(item.tier)}/${MAX_ITEM_TIER}`, metricXs[2], itemMetricY, metricWs[2]);
      drawInfoMetric("TYPE", displayEntryTypeLabel(item), metricXs[3], itemMetricY, metricWs[3]);
      if (showMergeInfo) {
        const itemCopies = itemMergeProgressCount(item.id, item.tier);
        const itemMergeText = itemTier(item.tier) >= MAX_ITEM_TIER ? "Max level" : `${Math.min(itemCopies, 3)}/3 to Lv ${itemTier(item.tier) + 1}`;
        drawSmallProgressBar(contentX, mergeBarY, contentW, itemTier(item.tier) >= MAX_ITEM_TIER ? 1 : Math.min(1, itemCopies / 3), item.accent);
        fitText(itemMergeText, contentX + 42, mergeTextY, 104, "800 11px Inter, sans-serif", muted);
      }
      const itemOwnedInPanel = ref.area === "bench" || ref.area === "itemBench" || ref.area === "drinks";
      drawInfoDivider(contentX, specsDividerY, contentW);
      ctx.fillStyle = primary;
      ctx.font = "900 12px Inter, sans-serif";
      ctx.fillText(`${displayEntryTypeLabel(item)} specs`, contentX, specsTitleY);
      ctx.fillStyle = muted;
      ctx.font = "800 12px Inter, sans-serif";
      const summaryY = (showMergeInfo ? (itemOwnedInPanel ? 398 : 384) : 356) + panelDy;
      const specStartY = (showMergeInfo ? (itemOwnedInPanel ? 422 : 408) : 380) + panelDy;
      fitText(itemCompactSpecLine(item), contentX, summaryY, contentW, "800 12px Inter, sans-serif", muted);
      ctx.font = "700 10px Inter, sans-serif";
      const fans = favoriteUsersForItem(item.id);
      const specGap = fans.length ? 15 : 18;
      const visibleSpecs = itemSpecLines(item).slice(0, fans.length ? 3 : 4);
      visibleSpecs.forEach((line, index) => {
        wrapTextLimited(line, contentX, specStartY + index * specGap, contentW, 11, 1);
      });
      if (fans.length) {
        const favoriteY = specStartY + visibleSpecs.length * specGap + 2;
        ctx.fillStyle = primary;
        ctx.font = "900 11px Inter, sans-serif";
        ctx.fillText(realityBroken() ? "Preferred by" : "Favorite for", contentX, favoriteY);
        ctx.fillStyle = muted;
        ctx.font = "800 10px Inter, sans-serif";
        fitText(fans.join(", "), contentX, favoriteY + 16, contentW, "800 10px Inter, sans-serif", muted);
      }
      if (ref.area === "bench" || ref.area === "itemBench" || ref.area === "drinks") {
        drawButton({ ...selectedSellButton(ref), label: "Sell", coinAmount: itemSellValue(item) }, true);
      }
      return;
    }

    const unit = ref.unit;
    const effect = specialEffectFor(unit);
    const slotRect = equipmentSlotRect();
    const headerTextW = Math.max(72, slotRect.x - textX - 8);

    drawFoodAnimal(unit, contentX + 26, 194 + panelDy, 25, true);
    drawSelectedEquipmentSlot(unit);
    ctx.fillStyle = primary;
    ctx.font = "900 16px Inter, sans-serif";
    fitText(displayUnitFormName(unit), textX, 178 + panelDy, headerTextW, "900 16px Inter, sans-serif", primary);
    ctx.fillStyle = muted;
    ctx.font = "700 12px Inter, sans-serif";
    fitText(displayUnitLineName(unit), textX, 196 + panelDy, headerTextW, "700 12px Inter, sans-serif", muted);
    drawRarityBadge(textX, 207 + panelDy, unit.rarity);
    drawTraitChips(unit.traits || [], textX, 231 + panelDy, headerTextW, { maxRows: 1, fontSize: 7, minWidth: 24 });

    const unitMetricY = 256 + panelDy;
    drawInfoMetric("ATK", unit.atk, metricXs[0], unitMetricY, metricWs[0]);
    drawInfoMetric("HP", `${unit.hp}/${unit.maxHp}`, metricXs[1], unitMetricY, metricWs[1]);
    drawInfoMetric("CD", unit.speed.toFixed(2), metricXs[2], unitMetricY, metricWs[2]);
    drawInfoMetric("PWR", unit.abilityPower, metricXs[3], unitMetricY, metricWs[3]);
    const favoriteH = drawFavoriteToppingRow(unit, contentX, 332 + panelDy, contentW);
    const abilityDividerY = (favoriteH ? 334 + favoriteH : 332) + panelDy;
    drawInfoDivider(contentX, abilityDividerY - 12, contentW);
    ctx.fillStyle = primary;
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText(effect.title, contentX, abilityDividerY + 17);
    ctx.fillStyle = muted;
    ctx.font = "700 10px Inter, sans-serif";
    wrapTextLimited(effect.body, contentX, abilityDividerY + 32, contentW, 11, favoriteH ? 4 : 6);
    if (ref.area === "bench" || ref.area === "board") {
      drawButton({ ...selectedSellButton(ref), label: "Sell", coinAmount: sellValue(unit) }, true);
    }
    if ((ref.area === "bench" || ref.area === "board") && unit.item) {
      drawButton(selectedDetachButton(ref), true);
    }
  }

  function drawResultPanel() {
    const horror = realityBroken();
    const primary = themeColor("primary", "#16392d");
    const muted = themeColor("muted", "#6a4b35");
    const panelSoft = themeColor("panelSoft", "rgba(255, 253, 232, 0.86)");
    const borderDim = themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
    const gameOver = state.hearts <= 0;
    roundedRect(700, 76, 306, 466, 8);
    ctx.fillStyle = horror && gameOver ? "rgba(3, 12, 11, 0.97)" : panelSoft;
    ctx.fill();
    ctx.strokeStyle = borderDim;
    ctx.stroke();

    const income = state.lastIncome;
    const hasReward = state.hearts > 0 && state.rewardChoices?.length;
    const won = income?.result === "win";
    const resultTitle = gameOver
      ? copy("ui.result.runOver", "Run Over")
      : won
        ? copy("ui.result.victory", "Pattern Holds")
        : copy("ui.result.defeat", "Pattern Breaks");
    const resultColor = gameOver ? themeColor("danger", "#9b3028") : won ? themeColor("accent", "#1f7d4a") : themeColor("warning", "#a94b2b");
    roundedRect(718, 92, 268, 34, 8);
    ctx.fillStyle = horror ? "rgba(5, 19, 18, 0.92)" : won ? "rgba(219, 246, 198, 0.92)" : gameOver ? "rgba(255, 214, 205, 0.92)" : "rgba(255, 234, 190, 0.92)";
    ctx.fill();
    ctx.strokeStyle = borderDim;
    ctx.stroke();
    ctx.fillStyle = primary;
    ctx.font = "900 16px Inter, sans-serif";
    fitText(resultTitle, 732, 114, hasReward ? 138 : 232, "900 16px Inter, sans-serif", resultColor);
    if (hasReward) {
      roundedRect(882, 99, 92, 19, 6);
      ctx.fillStyle = themeColor("warning", "#f7d15b");
      ctx.fill();
      ctx.strokeStyle = horror ? "rgba(255, 209, 91, 0.42)" : "rgba(138, 82, 35, 0.28)";
      ctx.stroke();
      drawUiAtlasIcon("reward_gold", 894, 108, 15, { tooltip: null });
      ctx.font = "900 9px Inter, sans-serif";
      fitText(copy("ui.result.reward", "REWARD"), 905, 112, 60, "900 9px Inter, sans-serif", horror ? "#07100b" : "#6a3f14");
    }
    if (income) {
      roundedRect(718, 136, 268, 31, 7);
      ctx.fillStyle = themeColor("panelHover", "rgba(255, 249, 214, 0.72)");
      ctx.fill();
      ctx.strokeStyle = borderDim;
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillText(copy("ui.result.payout", "BATTLE PAYOUT"), 730, 156);
      drawCurrencyAmount(income.total, 870, 152, {
        sign: "+",
        font: "900 15px Inter, sans-serif",
        color: primary,
        iconSize: 16,
      });
      const heartDamage = state.lastCombatLedger?.heartDamage || 0;
      if (heartDamage > 0) {
        ctx.fillStyle = "#9b3028";
        ctx.font = "900 10px Inter, sans-serif";
        fitText(`-${heartDamage} health`, 925, 156, 52, "900 10px Inter, sans-serif", "#9b3028");
      }
    }
    drawCombatLedger(state.lastCombatLedger, 720, 188, 268);
    if (!state.rewardChoices?.length) {
      wrapText(gameOver ? copy("ui.result.runEnded", "Your run has ended. Restart from the top bar.") : copy("ui.result.rewardClaimed", "Reward claimed."), 720, 320, 268, 15);
      return;
    }
    drawRewardPrompt();
    state.rewardChoices.forEach((reward, index) => drawRewardChoice(reward, buttons[`reward${index}`], index));
  }

  function drawRewardPrompt() {
    const horror = realityBroken();
    const won = state.lastIncome?.result === "win";
    const rewardTooltipBody = won
      ? copy("ui.result.rewardTooltipBody", "Pick one reward before the next course starts.")
      : copy("ui.result.rewardRetryTooltipBody", "Pick one reward before retrying this course.");
    const rewardPrompt = won
      ? copy("ui.result.claimReward", "Claim one to start the next course")
      : copy("ui.result.claimRetry", "Claim one to retry this course");
    roundedRect(710, 304, 286, 232, 8);
    ctx.fillStyle = horror ? "rgba(29, 55, 25, 0.42)" : "rgba(255, 241, 176, 0.5)";
    ctx.fill();
    ctx.strokeStyle = horror ? themeColor("border", "rgba(217, 144, 67, 0.48)") : "rgba(217, 144, 67, 0.48)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    drawUiAtlasIcon("reward_gold", 730, 329, 22, { tooltip: { title: copy("ui.result.rewardTooltipTitle", "Post-battle reward"), body: rewardTooltipBody } });
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 14px Inter, sans-serif";
    ctx.fillText(copy("ui.result.chooseReward", "Choose 1 Reward"), 748, 334);
    ctx.fillStyle = themeColor("muted", "#8a5223");
    ctx.font = "800 10px Inter, sans-serif";
    ctx.fillText(rewardPrompt, 748, 348);
  }

  function drawCombatLedger(ledger, x, y, maxWidth) {
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText(copy("ui.result.ledger", "Combat ledger"), x, y);
    if (!ledger) {
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText(copy("ui.result.noLedger", "No combat details captured."), x, y + 20);
      return;
    }
    drawCombatLedgerDetailsButton(combatLedgerDetailsButtonRect(x, y, maxWidth), Boolean(state.combatLedgerReview?.open));
    const rows = [
      [ledgerText("Hits", "Output"), `You ${ledger.ally.damageDealt} / Foe ${ledger.enemy.damageDealt}`, "info_damage", ledgerText("Damage your table dealt and took.", "Damage output recorded by each side.")],
      [ledgerText("Help", "Repair"), `Heal ${ledger.ally.healingReceived} / Shield ${ledger.ally.shieldingReceived}`, "info_heal", ledgerText("Healing and shielding your team received.", "Repair and shielding received by your units.")],
      [ledgerText("Falls", "KOs"), `${ledger.ally.kos}-${ledger.enemy.kos} in ${ledger.duration}s`, "info_ko", ledgerText("Who fell, and how long the fight lasted.", "Knockouts and total combat duration.")],
    ];
    rows.forEach(([label, value, iconId, body], index) => {
      const rowY = y + 18 + index * 18;
      drawUiAtlasIcon(iconId, x + 8, rowY - 4, 16, { tooltip: { title: label, body } });
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "800 10px Inter, sans-serif";
      ctx.fillText(label, x + 20, rowY);
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 12px Inter, sans-serif";
      fitText(value, x + 84, rowY, maxWidth - 84, "900 12px Inter, sans-serif", themeColor("primary", "#16392d"));
    });
    const mvp = ledger.mvp?.damageDealt > 0 ? `${ledger.mvp.name}: ${ledger.mvp.damageDealt} dmg${ledger.mvp.kos ? `, ${ledger.mvp.kos} KO` : ""}` : ledgerText("No standout hitter", "No peak output unit");
    const protectedLine = ledger.protected && ledger.protected.healingReceived + ledger.protected.shieldingReceived > 0
      ? `${ledger.protected.name}: +${ledger.protected.healingReceived} HP, +${ledger.protected.shieldingReceived} shield`
      : "No major support target";
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 10px Inter, sans-serif";
    drawUiAtlasIcon("info_damage", x + 8, y + 74, 16, { tooltip: { title: ledgerText("Star", "Peak output"), body: ledgerText("Strongest hitter for the fight.", "Highest recorded damage output.") } });
    drawUiAtlasIcon("info_shield", x + 8, y + 92, 16, { tooltip: { title: ledgerText("Held", "Protected"), body: ledgerText("Food animal that received the most support.", "Unit that received the most repair and shielding.") } });
    ctx.fillText(ledgerText("Star", "Peak"), x + 20, y + 78);
    ctx.fillText(ledgerText("Held", "Prot"), x + 20, y + 96);
    ctx.font = "900 11px Inter, sans-serif";
    fitText(mvp, x + 52, y + 78, maxWidth - 52, "900 11px Inter, sans-serif", themeColor("primary", "#16392d"));
    fitText(protectedLine, x + 52, y + 96, maxWidth - 52, "900 11px Inter, sans-serif", themeColor("primary", "#16392d"));
  }

  function combatLedgerDetailsButtonRect(x = 720, y = 188, maxWidth = 268) {
    return window.FoodAnimalsCombatLedgerCanvas.detailsButtonRect(x, y, maxWidth);
  }

  function drawCombatLedgerDetailsButton(rect, open) {
    roundedRect(rect.x, rect.y, rect.w, rect.h, 6);
    ctx.fillStyle = open
      ? themeColor("panelActive", realityBroken() ? "rgba(19, 45, 31, 0.94)" : "#e7ffd9")
      : themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.84)" : "rgba(255, 253, 232, 0.78)");
    ctx.fill();
    ctx.strokeStyle = open ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.22)");
    ctx.lineWidth = 1;
    ctx.stroke();
    drawUiAtlasIcon("info_time", rect.x + 12, rect.y + rect.h / 2, 13, { tooltip: null });
    fitText(ledgerText("Notes", "Data"), rect.x + 23, rect.y + 14, rect.w - 28, "900 10px Inter, sans-serif", themeColor("primary", "#16392d"));
    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: ledgerText("Fight notes", "Combat telemetry"),
      body: ledgerText("Open the detailed fight notes.", "Open detailed combat telemetry."),
    });
  }

  function combatLedgerReviewUnits(ledger) {
    return window.FoodAnimalsCombatLedgerRuntime.reviewUnits(ledger);
  }

  function currentCombatLedgerFrameIndex(ledger) {
    return window.FoodAnimalsCombatLedgerRuntime.currentFrameIndex(ledger, state.combatLedgerReview);
  }

  function resetCombatLedgerReview() {
    state.combatLedgerReview = window.FoodAnimalsCombatLedgerRuntime.defaultReviewState();
  }

  function combatLedgerFilteredEvents(ledger) {
    return window.FoodAnimalsCombatLedgerRuntime.filterEvents(ledger, state.combatLedgerReview, COMBAT_LEDGER_EVENT_TYPE_FILTERS);
  }

  function combatLedgerImportantEvent(event, ledger) {
    return window.FoodAnimalsCombatLedgerRuntime.importantEvent(event, ledger);
  }

  function defaultCombatLedgerEventTypeFilters() {
    return window.FoodAnimalsCombatLedgerRuntime.defaultEventTypeFilters();
  }

  function combatLedgerEventTypeId(event) {
    return window.FoodAnimalsCombatLedgerRuntime.eventTypeId(event);
  }

  function combatLedgerEventTypeFilters() {
    const normalized = window.FoodAnimalsCombatLedgerRuntime.normalizeEventTypeFilters(
      state.combatLedgerReview.eventTypeFilters,
      COMBAT_LEDGER_EVENT_TYPE_FILTERS,
    );
    state.combatLedgerReview.eventTypeFilters = normalized;
    return normalized;
  }

  function combatLedgerEventTypeEnabled(event) {
    return window.FoodAnimalsCombatLedgerRuntime.eventTypeEnabled(event, state.combatLedgerReview, COMBAT_LEDGER_EVENT_TYPE_FILTERS);
  }

  function toggleCombatLedgerEventTypeFilter(typeId) {
    window.FoodAnimalsCombatLedgerRuntime.toggleEventTypeFilter(
      state.combatLedgerReview,
      typeId,
      COMBAT_LEDGER_EVENT_TYPE_FILTERS,
    );
  }

  function toggleCombatLedgerBigMoments() {
    window.FoodAnimalsCombatLedgerRuntime.toggleBigMoments(state.combatLedgerReview);
  }

  function combatLedgerEventKey(event) {
    return window.FoodAnimalsCombatLedgerRuntime.eventKey(event);
  }

  function combatLedgerDirectionalFiltersEnabled() {
    return window.FoodAnimalsCombatLedgerRuntime.directionalFiltersEnabled(state.combatLedgerReview);
  }

  function combatLedgerEffectiveFilterId() {
    return window.FoodAnimalsCombatLedgerRuntime.effectiveFilterId(state.combatLedgerReview);
  }

  function combatLedgerLogVisibleRows(rect) {
    return window.FoodAnimalsCombatLedgerCanvas.logVisibleRows(rect, COMBAT_LEDGER_EVENT_TYPE_FILTERS);
  }

  function combatLedgerTimelineLayout(rect) {
    return window.FoodAnimalsCombatLedgerCanvas.timelineLayout(rect, COMBAT_LEDGER_EVENT_TYPE_FILTERS);
  }

  function currentCombatLedgerLogScrollOffset(events, visibleRows) {
    return window.FoodAnimalsCombatLedgerRuntime.logScrollOffset(state.combatLedgerReview, events, visibleRows);
  }

  function setCombatLedgerLogScrollOffset(offset) {
    const ledger = state.lastCombatLedger;
    if (!ledger) return;
    const rect = combatLedgerReviewRects(ledger).log;
    const events = combatLedgerFilteredEvents(ledger);
    const visibleRows = combatLedgerLogVisibleRows(rect);
    window.FoodAnimalsCombatLedgerRuntime.setLogScrollOffset(state.combatLedgerReview, offset, events, visibleRows);
  }

  function scrollCombatLedgerLog(deltaRows) {
    setCombatLedgerLogScrollOffset((state.combatLedgerReview.logScrollOffset || 0) + deltaRows);
  }

  function combatLedgerVisibleLogRows(ledger, rect) {
    const events = combatLedgerFilteredEvents(ledger);
    const visibleRows = combatLedgerLogVisibleRows(rect);
    const scrollOffset = currentCombatLedgerLogScrollOffset(events, visibleRows);
    return window.FoodAnimalsCombatLedgerCanvas.visibleLogRows({
      rect,
      events,
      scrollOffset,
      eventTypeFilters: COMBAT_LEDGER_EVENT_TYPE_FILTERS,
    });
  }

  function combatLedgerFrameIndexForEvent(ledger, event) {
    return window.FoodAnimalsCombatLedgerRuntime.frameIndexForEvent(ledger, event);
  }

  function setCombatLedgerLogOffsetForEvent(ledger, event) {
    const rect = combatLedgerReviewRects(ledger).log;
    const events = combatLedgerFilteredEvents(ledger);
    const visibleRows = combatLedgerLogVisibleRows(rect);
    setCombatLedgerLogScrollOffset(window.FoodAnimalsCombatLedgerRuntime.centeredLogOffset(events, event, visibleRows));
  }

  function focusCombatLedgerEvent(ledger, event, options = {}) {
    if (!event) return;
    window.FoodAnimalsCombatLedgerRuntime.focusEvent(state.combatLedgerReview, event);
    if (options.centerLog) setCombatLedgerLogOffsetForEvent(ledger, event);
  }

  function nearestCombatLedgerEventForFrame(ledger) {
    const events = combatLedgerFilteredEvents(ledger);
    return window.FoodAnimalsCombatLedgerRuntime.nearestEventForFrame(ledger, state.combatLedgerReview, events);
  }

  function syncCombatLedgerFocusedEventToFrame(ledger) {
    const event = nearestCombatLedgerEventForFrame(ledger);
    if (event) focusCombatLedgerEvent(ledger, event, { centerLog: true });
    else state.combatLedgerReview.focusedEventSeq = null;
  }

  function combatLedgerReviewRects(ledger) {
    return window.FoodAnimalsCombatLedgerCanvas.reviewRects({
      panel: COMBAT_LEDGER_REVIEW_PANEL,
      units: combatLedgerReviewUnits(ledger),
      filters: COMBAT_LEDGER_REVIEW_FILTERS,
    });
  }

  function drawExpandedCombatLedger(ledger) {
    if (!ledger) return;
    const rects = combatLedgerReviewRects(ledger);
    const panel = rects.panel;
    const horror = realityBroken();
    const primary = themeColor("primary", "#16392d");
    const muted = themeColor("muted", "#6a4b35");
    const panelFill = horror ? "rgba(4, 12, 14, 0.9)" : "rgba(255, 253, 232, 0.9)";
    const panelStroke = horror ? "rgba(70, 255, 99, 0.28)" : "rgba(22, 57, 45, 0.24)";
    const panelBg = getUiSprite(currentCombatLedgerPanelBgSrc());
    const modal = modalTransitionVisual("ledger");

    ctx.save();
    ctx.globalAlpha *= modal.alpha;
    ctx.translate(panel.x + panel.w / 2, panel.y + panel.h / 2 + modal.offsetY);
    ctx.scale(modal.scale, modal.scale);
    ctx.translate(-(panel.x + panel.w / 2), -(panel.y + panel.h / 2));
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    if (panelBg && panelBg.complete && panelBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(panelBg, panel.x, panel.y, panel.w, panel.h);
      if (!horror) {
        ctx.fillStyle = "rgba(255, 253, 232, 0.1)";
        ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = panelFill;
      ctx.fill();
    }
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    ctx.strokeStyle = panelStroke;
    ctx.lineWidth = horror ? 1 : 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.fillStyle = primary;
    ctx.font = "900 15px Inter, sans-serif";
    ctx.fillText(ledgerText("Detailed fight notes", "Detailed combat telemetry"), panel.x + 18, panel.y + 24);
    ctx.fillStyle = muted;
    ctx.font = "800 10px Inter, sans-serif";
    const events = ledger.events || [];
    const frames = ledger.frames || [];
    ctx.textAlign = "right";
    ctx.fillText(ledgerText(`${events.length} moments / ${frames.length} frames`, `${events.length} events / ${frames.length} ticks`), rects.close.x - 12, panel.y + 24);
    ctx.textAlign = "left";
    roundedRect(rects.close.x, rects.close.y, rects.close.w, rects.close.h, 6);
    ctx.fillStyle = themeColor("panelSoft", horror ? "rgba(7, 18, 20, 0.82)" : "rgba(255, 253, 232, 0.7)");
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", horror ? "rgba(70, 255, 99, 0.24)" : "rgba(22, 57, 45, 0.18)");
    ctx.lineWidth = horror ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = primary;
    ctx.font = "900 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", rects.close.x + rects.close.w / 2, rects.close.y + rects.close.h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    registerTooltip(rects.close.x, rects.close.y, rects.close.w, rects.close.h, {
      title: ledgerText("Close notes", "Close telemetry"),
      body: ledgerText("Return to the compact fight notes.", "Return to the compact combat telemetry."),
    });

    drawCombatLedgerFrameControls(ledger, rects);
    drawCombatLedgerMiniFrame(ledger, rects.mini);
    drawCombatLedgerParticipantTabs(ledger, rects);
    drawCombatLedgerEventLog(ledger, rects.log);
    ctx.restore();
  }

  function ledgerText(cozy, horror = cozy) {
    return realityBroken() ? horror : cozy;
  }

  function drawCombatLedgerFrameControls(ledger, rects) {
    const frames = ledger.frames || [];
    const index = currentCombatLedgerFrameIndex(ledger);
    const frame = frames[index] || null;
    const primary = themeColor("primary", "#16392d");
    const muted = themeColor("muted", "#6a4b35");
    const horror = realityBroken();

    [rects.prev, rects.next].forEach((button, buttonIndex) => {
      roundedRect(button.x, button.y, button.w, button.h, 6);
      ctx.fillStyle = themeColor("panelActive", horror ? "rgba(19, 45, 31, 0.9)" : "#e7ffd9");
      ctx.fill();
      ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.22)");
      ctx.lineWidth = horror ? 0.75 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = primary;
      ctx.font = "900 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(buttonIndex === 0 ? "<" : ">", button.x + button.w / 2, button.y + button.h / 2 + 1);
      registerTooltip(button.x, button.y, button.w, button.h, {
        title: buttonIndex === 0 ? ledgerText("Previous moment", "Previous tick") : ledgerText("Next moment", "Next tick"),
        body: ledgerText("Step through captured fight snapshots.", "Step through captured combat snapshots."),
      });
    });
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const track = { x: rects.track.x, y: rects.track.y - 2, w: rects.track.w, h: rects.track.h + 5 };
    roundedRect(track.x, track.y, track.w, track.h, 6);
    ctx.fillStyle = horror ? "rgba(0, 7, 8, 0.56)" : "rgba(255, 253, 232, 0.72)";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(70, 255, 99, 0.28)" : "rgba(22, 57, 45, 0.18)";
    ctx.lineWidth = horror ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    const firstT = frames[0]?.t || 0;
    const lastT = frames[frames.length - 1]?.t ?? firstT;
    const duration = Math.max(0.01, lastT - firstT);
    const pct = frames.length > 1 ? index / (frames.length - 1) : 1;
    roundedRect(track.x + 2, track.y + 2, Math.max(6, (track.w - 4) * pct), track.h - 4, 5);
    ctx.fillStyle = horror ? "rgba(70, 255, 99, 0.56)" : "rgba(74, 158, 104, 0.46)";
    ctx.fill();
    const importantEvents = (ledger.events || []).filter((event) => combatLedgerImportantEvent(event, ledger));
    const markerLimit = 42;
    const markerStep = Math.max(1, Math.ceil(importantEvents.length / markerLimit));
    importantEvents.forEach((event, markerIndex) => {
      if (markerIndex % markerStep !== 0) return;
      const markerPct = clamp01(((event.t || 0) - firstT) / duration);
      const markerX = track.x + 4 + (track.w - 8) * markerPct;
      ctx.fillStyle = event.type === "ko" ? themeColor("warning", "#f7d15b") : event.type === "damage" ? themeColor("danger", "#d9573c") : event.type === "support" ? themeColor("accent", "#4a9e68") : themeColor("primary", "#16392d");
      ctx.beginPath();
      ctx.arc(markerX, track.y + track.h / 2, event.type === "ko" ? 2.6 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
    const knobX = track.x + track.w * pct;
    ctx.beginPath();
    ctx.arc(knobX, track.y + track.h / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = horror ? "#e7ffe0" : primary;
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(70, 255, 99, 0.72)" : "rgba(255, 253, 232, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;
    registerTooltip(rects.track.x - 4, rects.track.y - 8, rects.track.w + 8, rects.track.h + 16, {
      title: ledgerText("Moment scrubber", "Tick scrubber"),
      body: ledgerText("Jump to a captured fight moment.", "Jump to a captured combat moment."),
    });

    ctx.fillStyle = muted;
    ctx.font = "900 10px Inter, sans-serif";
    ctx.fillText(frame ? `t=${frame.t.toFixed(2)}s  ${index + 1}/${frames.length}` : ledgerText("No frames", "No ticks"), rects.track.x, rects.track.y + 27);
  }

  function drawCombatLedgerRosterPanelBg(rect) {
    const horror = realityBroken();
    const image = horror ? null : getUiSprite(currentCombatLedgerParticipantsBgSrc());
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
      ctx.fillStyle = "rgba(255, 253, 232, 0.08)";
      ctx.fillRect(rect.x + 8, rect.y + 34, rect.w - 16, rect.h - 44);
      return;
    }
    ctx.fillStyle = horror ? "rgba(0, 8, 9, 0.48)" : "rgba(255, 248, 221, 0.66)";
    ctx.fill();
    roundedRect(rect.x + 5, rect.y + 5, rect.w - 10, rect.h - 10, 5);
    ctx.fillStyle = horror ? "rgba(4, 18, 16, 0.34)" : "rgba(255, 253, 232, 0.38)";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(70, 255, 99, 0.24)" : "rgba(138, 82, 35, 0.2)";
    ctx.lineWidth = horror ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (!horror) {
      ctx.fillStyle = "rgba(217, 144, 67, 0.08)";
      for (let y = rect.y + 48; y < rect.y + rect.h - 10; y += 18) {
        roundedRect(rect.x + 12, y, rect.w - 24, 10, 4);
        ctx.fill();
      }
    }
  }

  function drawCombatLedgerSubpanelBg(rect, src, fallbackFill, radius = 7) {
    const image = getUiSprite(src);
    roundedRect(rect.x, rect.y, rect.w, rect.h, radius);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = realityBroken() ? "rgba(0, 6, 8, 0.16)" : "rgba(255, 253, 232, 0.08)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    } else {
      ctx.fillStyle = fallbackFill;
      ctx.fill();
    }
  }

  function combatLedgerFocusedEvent(ledger) {
    const key = state.combatLedgerReview.focusedEventSeq;
    if (key == null) return null;
    return (ledger?.events || []).find((event) => combatLedgerEventKey(event) === key) || null;
  }

  function combatLedgerFrameUnits(frame) {
    return [...(frame?.allies || []), ...(frame?.enemies || [])];
  }

  function combatLedgerReplayUnitEntries(ledger, rect) {
    const frames = ledger?.frames || [];
    const frame = frames[currentCombatLedgerFrameIndex(ledger)];
    if (!frame) return [];
    const mapX = (x) => rect.x + ((x - BATTLE_FIELD.x) / BATTLE_FIELD.w) * rect.w;
    const mapY = (y) => rect.y + ((y - BATTLE_FIELD.y) / BATTLE_FIELD.h) * rect.h;
    return combatLedgerFrameUnits(frame).map((unit) => ({
      unit,
      x: mapX(unit.x),
      y: mapY(unit.y),
      r: 11 + Math.min(4, unit.tier || 1) * 2,
    }));
  }

  function drawCombatLedgerFocusedEventConnector(ledger, rect) {
    const event = combatLedgerFocusedEvent(ledger);
    if (!event || event.sourceUid == null || event.targetUid == null) return;
    const entries = combatLedgerReplayUnitEntries(ledger, rect);
    const source = entries.find((entry) => entry.unit.uid === event.sourceUid);
    const target = entries.find((entry) => entry.unit.uid === event.targetUid);
    if (!target) return;
    ctx.save();
    ctx.strokeStyle = event.type === "damage" ? themeColor("danger", "#d9573c") : event.type === "support" ? themeColor("accent", "#4a9e68") : themeColor("warning", "#f7d15b");
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 2;
    ctx.globalAlpha = realityBroken() ? 0.9 : 0.82;
    if (source && source !== target) {
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const startX = source.x + Math.cos(angle) * (source.r + 5);
      const startY = source.y + Math.sin(angle) * (source.r + 5);
      const endX = target.x - Math.cos(angle) * (target.r + 7);
      const endY = target.y - Math.sin(angle) * (target.r + 7);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - Math.cos(angle - 0.55) * 9, endY - Math.sin(angle - 0.55) * 9);
      ctx.lineTo(endX - Math.cos(angle + 0.55) * 9, endY - Math.sin(angle + 0.55) * 9);
      ctx.closePath();
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.r + 10 + 2 * Math.sin((state.lastTime || 0) / 180), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawCombatLedgerMiniFrame(ledger, rect) {
    const frames = ledger.frames || [];
    const frame = frames[currentCombatLedgerFrameIndex(ledger)];
    drawCombatLedgerSubpanelBg(rect, currentCombatLedgerMiniBgSrc(), realityBroken() ? "rgba(1, 6, 7, 0.54)" : "rgba(255, 249, 224, 0.36)");
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
    ctx.lineWidth = realityBroken() ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (!frame) return;

    const mapX = (x) => rect.x + ((x - BATTLE_FIELD.x) / BATTLE_FIELD.w) * rect.w;
    const mapY = (y) => rect.y + ((y - BATTLE_FIELD.y) / BATTLE_FIELD.h) * rect.h;
    ctx.save();
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.clip();
    const midX = rect.x + rect.w / 2;
    ctx.fillStyle = realityBroken() ? "rgba(70, 255, 99, 0.055)" : "rgba(74, 158, 104, 0.08)";
    ctx.fillRect(rect.x + 4, rect.y + 5, rect.w / 2 - 8, rect.h - 10);
    ctx.fillStyle = realityBroken() ? "rgba(217, 87, 60, 0.06)" : "rgba(217, 87, 60, 0.07)";
    ctx.fillRect(midX + 4, rect.y + 5, rect.w / 2 - 8, rect.h - 10);
    ctx.strokeStyle = realityBroken() ? "rgba(70, 255, 99, 0.18)" : "rgba(22, 57, 45, 0.14)";
    ctx.beginPath();
    ctx.moveTo(midX, rect.y + 15);
    ctx.lineTo(midX, rect.y + rect.h - 15);
    ctx.stroke();
    ctx.fillStyle = realityBroken() ? "rgba(169, 246, 173, 0.62)" : "rgba(54, 86, 71, 0.52)";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.fillText("ALLY", rect.x + 12, rect.y + 18);
    ctx.textAlign = "right";
    ctx.fillText("ENEMY", rect.x + rect.w - 12, rect.y + 18);
    ctx.textAlign = "left";
    ctx.strokeStyle = realityBroken() ? "rgba(70, 255, 99, 0.12)" : "rgba(22, 57, 45, 0.08)";
    for (let i = 0; i < boardSlots.length; i += 1) {
      ["ally", "enemy"].forEach((side) => {
        const pos = battleSlotPosition(side, i);
        const x = mapX(pos.x);
        const y = mapY(pos.y);
        roundedRect(x - 13, y - 13, 26, 26, 4);
        ctx.stroke();
      });
    }
    drawCombatLedgerFocusedEventConnector(ledger, rect);
    combatLedgerReplayUnitEntries(ledger, rect).forEach(({ unit, x, y }) => drawCombatLedgerReplayUnit(unit, x, y));
    ctx.restore();
  }

  function drawCombatLedgerReplayUnit(unit, x, y) {
    const selected = state.combatLedgerReview.unitUid === unit.uid;
    const selectedUid = state.combatLedgerReview.unitUid || "all";
    const focusedEvent = combatLedgerFocusedEvent(state.lastCombatLedger);
    const eventRelated = focusedEvent && (focusedEvent.sourceUid === unit.uid || focusedEvent.targetUid === unit.uid);
    const r = 11 + Math.min(4, unit.tier || 1) * 2;
    ctx.save();
    let alpha = unit.dead ? 0.48 : 1;
    if (selectedUid !== "all" && unit.uid !== selectedUid && !eventRelated) alpha *= 0.38;
    if (focusedEvent && !eventRelated && !selected) alpha *= 0.58;
    ctx.globalAlpha = alpha;
    if (selected || eventRelated) {
      ctx.beginPath();
      ctx.arc(x, y, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = eventRelated && !selected ? (realityBroken() ? "rgba(255, 209, 91, 0.14)" : "rgba(247, 209, 91, 0.18)") : (realityBroken() ? "rgba(70, 255, 99, 0.22)" : "rgba(74, 158, 104, 0.18)");
      ctx.fill();
      ctx.strokeStyle = eventRelated && !selected ? themeColor("warning", "#f7d15b") : themeColor("accent", "#4a9e68");
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    drawFoodAnimal(unit, x, y - 2, r, unit.side === "ally", { preserveBase: true });
    if (unit.dead) {
      ctx.strokeStyle = "#d9573c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - r, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.moveTo(x + r, y - r);
      ctx.lineTo(x - r, y + r);
      ctx.stroke();
    }
    if (unit.shield > 0 || unit.hp < unit.maxHp) {
      const hpPct = clamp01(unit.hp / Math.max(1, unit.maxHp));
      roundedRect(x - 15, y + r + 4, 30, 4, 2);
      ctx.fillStyle = "rgba(255, 249, 224, 0.86)";
      ctx.fill();
      roundedRect(x - 15, y + r + 4, 30 * hpPct, 4, 2);
      ctx.fillStyle = hpPct > 0.45 ? "#4a9e68" : "#d9573c";
      ctx.fill();
      if (unit.shield > 0) {
        ctx.fillStyle = "#5aa6d6";
        ctx.fillRect(x - 15, y + r + 9, clamp(30 * unit.shield / Math.max(1, unit.maxHp * 0.5), 3, 30), 3);
      }
    }
    ctx.restore();
  }

  function drawCombatLedgerParticipantTabs(ledger, rects) {
    drawCombatLedgerRosterPanelBg(rects.participantsPanel);
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "900 10px Inter, sans-serif";
    ctx.fillText(ledgerText("Table", "Units"), rects.participantsPanel.x + 12, rects.participantsPanel.y + 20);
    drawCombatLedgerParticipantStats(ledger, rects);
    rects.units.forEach(({ unit, rect }) => {
      const active = state.combatLedgerReview.unitUid === unit.uid;
      roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
      ctx.fillStyle = active
        ? themeColor("panelActive", realityBroken() ? "rgba(19, 45, 31, 0.92)" : "#e7ffd9")
        : themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.78)" : "rgba(255, 253, 232, 0.58)");
      ctx.fill();
      ctx.strokeStyle = active ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.14)");
      ctx.lineWidth = realityBroken() ? 0.75 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      const iconId = unit.uid === "all" ? "info_time" : unit.side === "enemy" ? "info_damage" : "info_shield";
      drawUiAtlasIcon(iconId, rect.x + 9, rect.y + rect.h / 2, 10, { tooltip: null });
      ctx.fillStyle = unit.side === "enemy" ? themeColor("danger", "#9b3028") : themeColor("primary", "#16392d");
      ctx.font = "900 9px Inter, sans-serif";
      fitText(unit.uid === "all" ? ledgerText("All fighters", "All units") : `${unit.side === "enemy" ? "Enemy" : "Ally"} ${unit.short || unit.name}`, rect.x + 18, rect.y + 9.5, rect.w - 24, "900 9px Inter, sans-serif", ctx.fillStyle);
      registerTooltip(rect.x, rect.y, rect.w, rect.h, {
        title: unit.uid === "all" ? ledgerText("All fighters", "All units") : unit.name,
        body: unit.uid === "all" ? ledgerText("Show every recorded fight interaction.", "Show every recorded combat interaction.") : ledgerText("Show moments this fighter caused or received.", "Show events this unit caused or received."),
      });
    });

    rects.filters.forEach(({ filter, rect }) => {
      const disabled = filter.id !== "all" && !combatLedgerDirectionalFiltersEnabled();
      const active = combatLedgerEffectiveFilterId() === filter.id;
      roundedRect(rect.x, rect.y, rect.w, rect.h, 6);
      ctx.fillStyle = active
        ? themeColor("panelActive", realityBroken() ? "rgba(19, 45, 31, 0.92)" : "#e7ffd9")
        : disabled
          ? themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.38)" : "rgba(255, 253, 232, 0.34)")
          : themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.78)" : "rgba(255, 253, 232, 0.62)");
      ctx.fill();
      ctx.strokeStyle = active ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.18)");
      ctx.lineWidth = realityBroken() ? 0.75 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.globalAlpha = disabled ? 0.52 : 1;
      ctx.fillStyle = themeColor("primary", "#16392d");
      ctx.font = "900 10px Inter, sans-serif";
      const iconId = filter.id === "output" ? "info_damage" : filter.id === "input" ? "info_shield" : "info_time";
      const labelWidth = measureTextWidth(filter.label, ctx.font);
      const totalWidth = 13 + 4 + labelWidth;
      let cursor = rect.x + rect.w / 2 - totalWidth / 2;
      drawUiAtlasIcon(iconId, cursor + 6.5, rect.y + rect.h / 2, 13, { tooltip: null });
      cursor += 17;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(filter.label, cursor, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.globalAlpha = 1;
      registerTooltip(rect.x, rect.y, rect.w, rect.h, {
        title: `${filter.label} ${ledgerText("notes", "log")}`,
        body: disabled ? ledgerText("Choose one fighter to focus on moments they caused or received.", "Choose one unit to focus on events they caused or received.") : filter.id === "all" ? ledgerText("Show every moment involving the selected fighter.", "Show every event involving the selected unit.") : filter.id === "output" ? ledgerText("Show moments caused by the selected fighter.", "Show events caused by the selected unit.") : ledgerText("Show moments received by the selected fighter.", "Show events received by the selected unit."),
      });
    });
  }

  function drawCombatLedgerParticipantStats(ledger, rects) {
    const selectedUid = state.combatLedgerReview.unitUid || "all";
    let text = "";
    if (selectedUid === "all") {
      text = ledgerText(`Ally hits ${ledger?.ally?.damageDealt || 0} / Enemy hits ${ledger?.enemy?.damageDealt || 0}`, `Ally dmg ${ledger?.ally?.damageDealt || 0} / Enemy dmg ${ledger?.enemy?.damageDealt || 0}`);
    } else {
      const unit = (ledger?.units || []).find((entry) => entry.uid === selectedUid);
      if (unit) {
        const support = (unit.healingReceived || 0) + (unit.shieldingReceived || 0);
        text = ledgerText(`Gave ${unit.damageDealt || 0} / Took ${unit.damageTaken || 0} / Help ${support} / Falls ${unit.kos || 0}`, `Dealt ${unit.damageDealt || 0} / Taken ${unit.damageTaken || 0} / Repair ${support} / KOs ${unit.kos || 0}`);
      }
    }
    if (!text) return;
    const statRect = { x: rects.participantsPanel.x + 10, y: rects.participantsPanel.y + 25, w: rects.participantsPanel.w - 20, h: 16 };
    roundedRect(statRect.x, statRect.y, statRect.w, statRect.h, 5);
    ctx.fillStyle = realityBroken() ? "rgba(0, 8, 9, 0.28)" : "rgba(255, 253, 232, 0.46)";
    ctx.fill();
    fitText(text, statRect.x + 8, statRect.y + 11, statRect.w - 16, "800 8px Inter, sans-serif", themeColor("muted", "#6a4b35"));
  }

  function combatLedgerEventIconId(event) {
    if (event.type === "damage") return "info_damage";
    if (event.type === "support") return event.kind === "heal" ? "info_heal" : "info_shield";
    if (event.type === "ko") return "info_ko";
    if (event.type === "control") return "info_time";
    if (event.type === "battleStart") return "action_battle";
    return "info_time";
  }

  function combatLedgerEventUnitLabel(ledger, uid) {
    if (uid == null) return "System";
    const unit = (ledger?.units || []).find?.((entry) => entry.uid === uid) || ledger?.units?.[uid] || null;
    return unit?.short || unit?.name || "Unit";
  }

  function combatLedgerEventRowLabel(ledger, event) {
    if (!event) return "";
    const source = combatLedgerEventUnitLabel(ledger, event.sourceUid);
    const target = combatLedgerEventUnitLabel(ledger, event.targetUid);
    const amount = Number.isFinite(event.amount) && event.amount > 0 ? Math.round(event.amount) : 0;
    if (event.type === "damage") return `${source} -> ${target}  -${amount || "?"} HP`;
    if (event.type === "support") {
      const verb = event.kind === "heal" ? "healed" : "shielded";
      return `${source} ${verb} ${target}${amount ? ` +${amount}` : ""}`;
    }
    if (event.type === "ko") return `${target} KO by ${source}`;
    if (event.type === "control") return `${source} controlled ${target}`;
    if (event.type === "battleStart") return ledgerText("Pressure test started", "Wave deployed");
    return event.text || `${source} -> ${target}`;
  }

  function combatLedgerCauseChain(ledger, event) {
    if (!event) return [];
    const key = combatLedgerEventKey(event);
    const participants = new Set([event.sourceUid, event.targetUid].filter((uid) => uid != null));
    return (ledger?.events || [])
      .filter((candidate) => {
        const candidateKey = combatLedgerEventKey(candidate);
        if (candidate === event || candidateKey === key) return false;
        if ((candidate.t || 0) > (event.t || 0)) return false;
        if ((event.t || 0) - (candidate.t || 0) > 3.25) return false;
        return participants.has(candidate.sourceUid) || participants.has(candidate.targetUid);
      })
      .slice(-3);
  }

  function drawCombatLedgerEventTypeChips(layout) {
    const keyActive = Boolean(state.combatLedgerReview.bigMomentsOnly);
    roundedRect(layout.keyChip.rect.x, layout.keyChip.rect.y, layout.keyChip.rect.w, layout.keyChip.rect.h, 6);
    ctx.fillStyle = keyActive
      ? themeColor("panelActive", realityBroken() ? "rgba(19, 45, 31, 0.88)" : "#e7ffd9")
      : themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.56)" : "rgba(255, 253, 232, 0.48)");
    ctx.fill();
    ctx.strokeStyle = keyActive ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
    ctx.lineWidth = realityBroken() ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    fitText("Key", layout.keyChip.rect.x + 8, layout.keyChip.rect.y + 12.5, layout.keyChip.rect.w - 12, "900 9px Inter, sans-serif", themeColor("primary", "#16392d"));
    registerTooltip(layout.keyChip.rect.x, layout.keyChip.rect.y, layout.keyChip.rect.w, layout.keyChip.rect.h, {
      title: ledgerText("Key moments", "Priority events"),
      body: keyActive ? ledgerText("Showing only major hits, help, control, and falls.", "Showing only major hits, repair, control, and KOs.") : ledgerText("Show only the most important fight moments.", "Show only priority combat telemetry."),
    });

    const filters = combatLedgerEventTypeFilters();
    layout.typeChips.forEach(({ filter, rect }) => {
      const active = filters[filter.id] !== false;
      roundedRect(rect.x, rect.y, rect.w, rect.h, 6);
      ctx.fillStyle = active
        ? themeColor("panelActive", realityBroken() ? "rgba(19, 45, 31, 0.88)" : "#e7ffd9")
        : themeColor("panelSoft", realityBroken() ? "rgba(7, 18, 20, 0.42)" : "rgba(255, 253, 232, 0.36)");
      ctx.fill();
      ctx.strokeStyle = active ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
      ctx.lineWidth = realityBroken() ? 0.75 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.globalAlpha = active ? 1 : 0.55;
      drawUiAtlasIcon(filter.icon, rect.x + 10, rect.y + rect.h / 2, 12, { tooltip: null });
      const label = filter.id === "support" ? "Sup" : filter.id === "control" ? "Ctrl" : filter.label;
      fitText(label, rect.x + 20, rect.y + 12.5, rect.w - 23, "900 9px Inter, sans-serif", themeColor("primary", "#16392d"));
      ctx.globalAlpha = 1;
      registerTooltip(rect.x, rect.y, rect.w, rect.h, {
        title: `${filter.label} ${ledgerText("moments", "events")}`,
        body: active ? ledgerText("Click to hide this moment type from the timeline.", "Click to hide this event type from the timeline.") : ledgerText("Click to show this moment type in the timeline.", "Click to show this event type in the timeline."),
      });
    });
  }

  function drawCombatLedgerEventDetail(ledger, rect) {
    const event = combatLedgerFocusedEvent(ledger);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.fillStyle = realityBroken() ? "rgba(0, 6, 8, 0.46)" : "rgba(255, 253, 232, 0.62)";
    ctx.fill();
    ctx.strokeStyle = event ? themeColor("accent", "#4a9e68") : themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
    ctx.lineWidth = realityBroken() ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (!event) {
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "800 9px Inter, sans-serif";
      fitText(ledgerText("Select a moment to inspect the replay.", "Select an event to inspect the replay tick."), rect.x + 10, rect.y + 25, rect.w - 20, "800 9px Inter, sans-serif", themeColor("muted", "#6a4b35"));
      return;
    }
    const source = combatLedgerEventUnitLabel(ledger, event.sourceUid);
    const target = combatLedgerEventUnitLabel(ledger, event.targetUid);
    drawUiAtlasIcon(combatLedgerEventIconId(event), rect.x + 13, rect.y + 21, 16, { tooltip: null });
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 10px Inter, sans-serif";
    fitText(`${event.t.toFixed(2)}s  ${source} -> ${target}`, rect.x + 28, rect.y + 17, rect.w - 36, "900 10px Inter, sans-serif", themeColor("primary", "#16392d"));
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 9px Inter, sans-serif";
    fitText(event.text, rect.x + 28, rect.y + 31, rect.w - 36, "800 9px Inter, sans-serif", themeColor("muted", "#6a4b35"));
    const chain = combatLedgerCauseChain(ledger, event);
    const chainText = chain.length ? `${ledgerText("Lead-up", "Trace")}: ${chain.map((entry) => `${entry.t.toFixed(1)}s ${entry.type}`).join(" / ")}` : ledgerText("Lead-up: first major moment for this pair", "Trace: first major event for this source/target");
    fitText(chainText, rect.x + 28, rect.y + 45, rect.w - 36, "800 8px Inter, sans-serif", themeColor("muted", "#6a4b35"));
  }

  function drawCombatLedgerEventLog(ledger, rect) {
    const rows = combatLedgerVisibleLogRows(ledger, rect);
    const events = rows.events;
    drawCombatLedgerSubpanelBg(rect, currentCombatLedgerLogBgSrc(), realityBroken() ? "rgba(0, 6, 8, 0.42)" : "rgba(255, 249, 224, 0.3)");
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.16)");
    ctx.lineWidth = realityBroken() ? 0.75 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText(ledgerText("Fight timeline", "Combat telemetry"), rect.x + 12, rect.y + 20);
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "800 9px Inter, sans-serif";
    const rangeLabel = events.length > rows.visibleRows ? `${rows.start + 1}-${rows.end} / ${events.length}` : ledgerText(`${events.length} matching`, `${events.length} matched`);
    ctx.textAlign = "right";
    ctx.fillText(rangeLabel, rect.x + rect.w - 16, rect.y + 20);
    ctx.textAlign = "left";
    drawCombatLedgerEventTypeChips(rows.layout);

    if (!rows.visible.length) {
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "800 11px Inter, sans-serif";
      ctx.fillText(ledgerText("No matching moments.", "No matching events."), rect.x + 12, rows.layout.rowStartY);
      drawCombatLedgerEventDetail(ledger, rows.layout.detail);
      return;
    }
    if (events.length > rows.visibleRows) {
      const track = { x: rect.x + rect.w - 10, y: rows.layout.rowStartY - 12, w: 4, h: rows.layout.rowBottom - rows.layout.rowStartY + 16 };
      roundedRect(track.x, track.y, track.w, track.h, 2);
      ctx.fillStyle = realityBroken() ? "rgba(70, 255, 99, 0.12)" : "rgba(22, 57, 45, 0.1)";
      ctx.fill();
      const maxOffset = Math.max(1, events.length - rows.visibleRows);
      const thumbH = clamp(track.h * (rows.visibleRows / events.length), 26, track.h);
      const thumbPct = 1 - rows.scrollOffset / maxOffset;
      const thumbY = track.y + (track.h - thumbH) * thumbPct;
      roundedRect(track.x - 1, thumbY, track.w + 2, thumbH, 3);
      ctx.fillStyle = themeColor("accent", "#4a9e68");
      ctx.fill();
      registerTooltip(track.x - 5, track.y, track.w + 10, track.h, {
        title: ledgerText("Scrollable notes", "Scrollable log"),
        body: ledgerText("Use the mouse wheel over the fight notes to review older or newer moments.", "Use the mouse wheel over the interaction log to review older or newer entries."),
      });
    }
    rows.rows.forEach(({ event, rect: rowRect }, index) => {
      const y = rows.layout.rowStartY + index * rows.layout.rowH;
      const currentTick = Math.floor((event.t || 0) / COMBAT_LEDGER_FRAME_SECONDS);
      const previous = rows.rows[index - 1]?.event;
      const previousTick = previous ? Math.floor((previous.t || 0) / COMBAT_LEDGER_FRAME_SECONDS) : null;
      if (index % 2 === 0) {
        roundedRect(rowRect.x + 1, rowRect.y + 1, rowRect.w - 12, rowRect.h - 2, 4);
        ctx.fillStyle = realityBroken() ? "rgba(70, 255, 99, 0.035)" : "rgba(255, 253, 232, 0.22)";
        ctx.fill();
      }
      if (index === 0 || currentTick !== previousTick) {
        ctx.strokeStyle = realityBroken() ? "rgba(70, 255, 99, 0.11)" : "rgba(22, 57, 45, 0.09)";
        ctx.beginPath();
        ctx.moveTo(rowRect.x + 2, rowRect.y - 2);
        ctx.lineTo(rowRect.x + rowRect.w - 10, rowRect.y - 2);
        ctx.stroke();
        ctx.fillStyle = themeColor("muted", "#6a4b35");
        ctx.font = "800 7px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${currentTick}s`, rowRect.x + rowRect.w - 8, rowRect.y + 6);
        ctx.textAlign = "left";
      }
      const color = event.type === "damage"
        ? themeColor("danger", "#9b3028")
        : event.type === "support"
          ? themeColor("accent", "#4a9e68")
          : event.type === "ko"
            ? themeColor("warning", "#a94b2b")
            : themeColor("primary", "#16392d");
      if (state.combatLedgerReview.focusedEventSeq === combatLedgerEventKey(event)) {
        roundedRect(rowRect.x, rowRect.y, rowRect.w, rowRect.h, 5);
        ctx.fillStyle = realityBroken() ? "rgba(70, 255, 99, 0.16)" : "rgba(74, 158, 104, 0.14)";
        ctx.fill();
        ctx.strokeStyle = themeColor("accent", "#4a9e68");
        ctx.lineWidth = realityBroken() ? 0.75 : 1;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      drawUiAtlasIcon(combatLedgerEventIconId(event), rect.x + 15, y - 4, 14, {
        tooltip: {
          title: event.type === "battleStart" ? ledgerText("Pressure start", "Wave start") : event.type === "ko" ? ledgerText("Fall", "Knockout") : event.type === "control" ? "Control" : event.type === "support" ? ledgerText("Help", "Repair") : ledgerText("Hit", "Damage"),
          body: `${event.text} ${ledgerText("Click the row to jump the replay to this moment.", "Click the row to jump telemetry to this event.")}`,
        },
      });
      ctx.fillStyle = color;
      ctx.font = "900 9px Inter, sans-serif";
      ctx.fillText(`${event.t.toFixed(2)}s`, rect.x + 28, y);
      fitText(combatLedgerEventRowLabel(ledger, event), rect.x + 70, y, rect.w - 112, "900 10px Inter, sans-serif", themeColor("primary", "#16392d"));
      registerTooltip(rowRect.x, rowRect.y, rowRect.w, rowRect.h, {
        title: `${event.t.toFixed(2)}s`,
        body: `${event.text || combatLedgerEventRowLabel(ledger, event)} ${ledgerText("Click to jump the replay to this moment.", "Click to jump the replay tick to this event.")}`,
      });
    });
    drawCombatLedgerEventDetail(ledger, rows.layout.detail);
  }

  function rewardIconId(reward) {
    if (!reward) return "reward_gold";
    if (reward.type?.startsWith("arena")) return "reward_arena";
    if (reward.type === "gold" || reward.type === "arenaPurse") return "reward_gold";
    if (reward.type === "freeRolls" || reward.type === "arenaScout" || reward.type === "arenaHold") return "reward_freeRolls";
    if (reward.type === "item") return reward.key?.startsWith("favorite:") ? "reward_favorite" : "reward_item";
    if (reward.type === "copy") return "reward_copy";
    if (reward.type === "upgradeDiscount" || reward.type === "shopSlotUnlock") return "reward_discount";
    return "reward_gold";
  }

  function rewardKindLabel(reward) {
    if (!reward) return copy("ui.result.reward", "REWARD");
    if (reward.type?.startsWith("arena")) return realityBroken() ? "ZONE" : "ARENA";
    if (reward.type === "gold" || reward.type === "arenaPurse") return realityBroken() ? "SCRAP" : "COINS";
    if (reward.type === "freeRolls") return realityBroken() ? "SCAN" : "ROLL";
    if (reward.type === "item") return reward.key?.startsWith("favorite:") ? "FAV" : (realityBroken() ? "WPN" : "TOP");
    if (reward.type === "copy") return realityBroken() ? "UNIT" : "COPY";
    if (reward.type === "upgradeDiscount") return realityBroken() ? "RIG" : "UPG";
    if (reward.type === "shopSlotUnlock") return "SLOT";
    return "REWARD";
  }

  function drawRewardChoice(reward, button, index) {
    const horror = realityBroken();
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 260 + index * 0.7);
    roundedRect(button.x, button.y, button.w, button.h, 8);
    ctx.fillStyle = horror ? (index === 0 ? `rgba(24, 61, 35, ${0.78 + pulse * 0.08})` : "rgba(8, 20, 22, 0.9)") : index === 0 ? `rgba(255, 249, 214, ${0.92 + pulse * 0.06})` : "#fff9d6";
    ctx.fill();
    ctx.strokeStyle = index === 0 ? themeColor("accent", "#d99043") : themeColor("borderDim", "rgba(22, 57, 45, 0.24)");
    ctx.lineWidth = index === 0 ? 3 : 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    roundedRect(button.x + 8, button.y + 8, 34, 34, 7);
    ctx.fillStyle = horror ? "rgba(70, 255, 99, 0.10)" : "rgba(255, 255, 255, 0.66)";
    ctx.fill();
    ctx.strokeStyle = themeColor("borderDim", "rgba(22, 57, 45, 0.12)");
    ctx.stroke();
    drawUiAtlasIcon(rewardIconId(reward), button.x + 25, button.y + 25, 25, {
      tooltip: { title: reward.title, body: reward.body },
    });
    roundedRect(button.x + button.w - 56, button.y + 8, 42, 15, 5);
    ctx.fillStyle = themeColor("warning", "#f7d15b");
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(255, 209, 91, 0.42)" : "rgba(138, 82, 35, 0.2)";
    ctx.stroke();
    ctx.fillStyle = horror ? "#07100b" : "#6a3f14";
    ctx.font = "900 8px Inter, sans-serif";
    fitText(rewardKindLabel(reward), button.x + button.w - 51, button.y + 19, 32, "900 8px Inter, sans-serif", horror ? "#07100b" : "#6a3f14");
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "900 12px Inter, sans-serif";
    const textX = button.x + 52;
    const textWidth = button.w - 118;
    fitText(reward.title, textX, button.y + 18, textWidth, "900 12px Inter, sans-serif", themeColor("primary", "#16392d"));
    ctx.fillStyle = themeColor("muted", "#6a4b35");
    ctx.font = "700 10px Inter, sans-serif";
    wrapTextLimited(reward.body, textX, button.y + 35, button.w - 72, 10, 2);
  }

  function drawEnemyPreviewMini(x, y, maxWidth) {
    const enemies = ensureEnemyPreview();
    ctx.fillStyle = themeColor("primary", "#16392d");
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText("Next enemy", x, y);
    enemies.slice(0, 5).forEach((unit, index) => {
      const px = x + 18 + index * 35;
      const py = y + 28;
      drawFoodAnimal(unit, px, py, 12, false);
      drawRarityDot(px + 13, py - 13, unit.rarity);
    });
    if (enemies.length > 5) {
      ctx.fillStyle = themeColor("muted", "#6a4b35");
      ctx.font = "800 10px Inter, sans-serif";
      ctx.fillText(`+${enemies.length - 5}`, x + 184, y + 32);
    }
  }

  function getSelectedRef() {
    if (!state.selected) return null;
    const entry = state[state.selected.area]?.[state.selected.index];
    if (!entry) return null;
    return { ...state.selected, entry, unit: isUnit(entry) ? entry : null };
  }

  function equipmentSlotRect() {
    return { x: INFO_PANEL.x + INFO_PANEL.w - 102, y: INFO_PANEL.y + 22, w: 72, h: 72 };
  }

  function selectedEquipmentTargetRef(drag = state.drag) {
    const source = drag?.equipmentTarget || getSelectedRef();
    if (!source || source.area !== "bench" && source.area !== "board") return null;
    const unit = state[source.area]?.[source.index];
    if (!isUnit(unit)) return null;
    return { area: source.area, index: source.index, entry: unit, unit };
  }

  function abilitySpecLine(unit) {
    if (!unit) return "No ability";
    if (unit.ability === "neural_overmind") return "Hit: neural slow, cooldown delay; every 3rd hit echoes down row";
    if (unit.ability === "brainstem_probe") return "Hit: small cooldown delay; stronger drones slow attacks";
    if (unit.ability === "taunt_guard") return `Taunt ${tauntDuration(unit)}s; self shield ${supportAmount(unit, tauntGuardShield(unit))}`;
    if (unit.ability === "thorns") return `When hit: counter ${thornDamage(unit)} dmg`;
    if (unit.ability === "guard") return `Hit: shield lowest ally ${supportAmount(unit, guardShield(unit))}`;
    if (unit.ability === "execute") return `Target weakest; +${executeBonus(unit)} dmg at <=50% HP`;
    if (unit.ability === "cleave") return `Hit: column splash ${cleaveDamage(unit)} dmg`;
    if (unit.ability === "back_row") return `Targets back column; ${Math.max(0, unit.tier - 1)} extra x ${volleyDamage(unit)} dmg`;
    if (unit.ability === "heal") return `Heal ${supportAmount(unit, healAmount(unit))}; fallback shield ${supportAmount(unit, noodleFallbackShield(unit))}`;
    if (unit.ability === "syrup_start") return `Start adj: ${supportAmount(unit, syrupShield(unit))} shield; every ${syrupPulseInterval(unit).toFixed(1)}s pulses ${supportAmount(unit, syrupPulseShield(unit))}`;
    if (unit.ability === "slow") return `Hit: target CD +${pretzelDelay(unit)}s`;
    if (unit.ability === "pepper_dash") return `Hit: burn ${pepperBurnDamage(unit)}/s ${statusDuration(unit, pepperBurnDuration(unit)).toFixed(1)}s`;
    if (unit.ability === "armor_break") return `+${armorBreakBonus(unit)} dmg vs front/shield/high-HP`;
    if (unit.ability === "shield_breaker") return `Steal up to ${shieldBreakSteal(unit)} shield; +${shieldBreakBonus(unit)} dmg`;
    if (unit.ability === "bagel_build") return `Hit: 2 allies get ${supportAmount(unit, bagelBuildShield(unit))} shield`;
    if (unit.ability === "treat_income") return `Survive battle: +${donutTreatGold(unit)} ${currencyTerm({ lower: true })}`;
    if (unit.ability === "status_spread") return `Hit: burn ${kimchiBurnDamage(unit)}/s; mark +${percentText(kimchiMarkPct(unit))} dmg`;
    if (unit.ability === "sticky_lane") return `Hit: target column CD +${waffleLaneDelay(unit)}s`;
    if (unit.ability === "kernel_combo") return `Stack: +${popcornDamagePerStack(unit)} dmg, +${percentText(popcornStackHaste(unit))} spd`;
    if (unit.ability === "sour_aura") return `Hit: support -${percentText(yogurtSourPct(unit))}, shield dmg +${yogurtShieldCrackDamage(unit)}`;
    if (unit.ability === "row_shield") return `Row shield ${supportAmount(unit, dumplingRowShield(unit))} on hit`;
    if (unit.ability === "formation_captain") return `Row/col shield ${supportAmount(unit, formationShield(unit))}, +${percentText(formationAttackBoost(unit))} dmg`;
    if (unit.ability === "cleanse") return `Cleanse: heal ${supportAmount(unit, lemonCleanseHeal(unit))}, shield ${supportAmount(unit, lemonCleanseShield(unit))}`;
    if (unit.ability === "shakshuka_burn") return `Hit: burn ${shakshukaBurnDamage(unit)}/s, splash ${shakshukaSplashDamage(unit)}`;
    if (unit.ability === "pull_start") return `Start pull; every ${krakenCombatPullEvery(unit)} hits repeats pressure, CD +${krakenPullDelay(unit)}s`;
    if (unit.ability === "copy_luck") return `Shop owned-line odds +${percentText(fortuneShopChance(unit))}`;
    if (unit.ability === "survive_scale") return `Survive battle: permanent +${mochiHpGain(unit)} HP`;
    if (unit.ability === "ginger_decoy") return `Start: decoy ${gingerDecoyHp(unit)} HP; death ${gingerCrumbleDamage(unit)} dmg`;
    if (unit.ability === "iceberg_lock") return `Hit: CD +${oysterLockDelay(unit)}s, -${percentText(oysterSlowPct(unit))} spd`;
    if (unit.ability === "pearl_stun") return `Every ${bobaStunEvery(unit)} hits: CD +${bobaStunDelay(unit)}s`;
    return "Targets front occupied enemy column";
  }

  function specialEffectFor(unit) {
    if (unit.ability === "neural_overmind") {
      return {
        title: "Spec: Neural Control",
        body: "Attacks fire brain-shaped energy, delay the target cooldown, and slow attacks. Every third attack echoes down the target row.",
      };
    }
    if (unit.ability === "brainstem_probe") {
      return {
        title: "Spec: Signal Dread",
        body: "Attacks fire solid control orbs and add a small cooldown delay. Higher-tier drones also slow attack speed.",
      };
    }
    if (unit.ability === "taunt_guard") {
      return {
        title: "Spec: Table Guardian",
        body: `Battle start and hit: taunt enemies for ${tauntDuration(unit)}s and gain ${supportAmount(unit, tauntGuardShield(unit))} shield. Taunted enemies target this unit first.`,
      };
    }
    if (unit.ability === "thorns") {
      return {
        title: "Spec: Pit Thorns",
        body: `When hit by direct damage, counter the attacker for ${thornDamage(unit)} damage. Counter damage cannot trigger more counters.`,
      };
    }
    if (unit.ability === "guard") {
      const title = unit.typeId === "avocado_axolotl" ? "Spec: Pit Guard" : "Spec: Team Shield";
      return {
        title,
        body: `Trigger hit. Target ally with lowest shield. Shield ${supportAmount(unit, guardShield(unit))}.`,
      };
    }
    if (unit.ability === "execute") {
      return {
        title: "Spec: Wounded Snipe",
        body: `Target weakest enemy. Damage ${unit.atk}; if target HP <=50%, damage +${executeBonus(unit)}.`,
      };
    }
    if (unit.ability === "cleave") {
      return {
        title: "Spec: Column Cleave",
        body: `Primary damage ${unit.atk}. Other enemies in target column take ${cleaveDamage(unit)} splash.`,
      };
    }
    if (unit.ability === "back_row") {
      const combo = unit.item?.backRowTargeting ? ` Favorite back hit +${berryPretzelComboDamage(unit)}.` : "";
      const isGreenJuice = unit.typeId === "green_juice_goose";
      return {
        title: isGreenJuice ? "Spec: Garden Volley" : "Spec: Back-Row Volley",
        body: `Targets back occupied column. Extra bolts ${Math.max(0, unit.tier - 1)} x ${volleyDamage(unit)} damage.${combo}`,
      };
    }
    if (unit.ability === "heal") {
      const isCaesar = unit.typeId === "caesar_salamander";
      return {
        title: isCaesar ? "Spec: Crisp Heal" : "Spec: Support Heal",
        body: `Before attack: heal weakest damaged ally ${supportAmount(unit, healAmount(unit))}; add ${supportAmount(unit, Math.round(unit.abilityPower * 0.35))} shield. No damaged ally: shield ${supportAmount(unit, noodleFallbackShield(unit))}.`,
      };
    }
    if (unit.ability === "syrup_start") {
      const isHerb = unit.typeId === "herb_hare";
      return {
        title: isHerb ? "Spec: Garden Starter" : "Spec: Syrup Start",
        body: `Battle start, adjacent allies: shield ${supportAmount(unit, syrupShield(unit))}; haste +${percentText(syrupHaste(unit))} for 2s.`,
      };
    }
    if (unit.ability === "slow") {
      const isTaffy = unit.typeId === "saltwater_taffy_otter";
      const isCucumber = unit.typeId === "cucumber_cobra";
      return {
        title: isTaffy ? "Spec: Taffy Bind" : isCucumber ? "Spec: Crisp Bind" : "Spec: Pretzel Bind",
        body: `Trigger hit. Target cooldown increases by ${pretzelDelay(unit)}s after damage.`,
      };
    }
    if (unit.ability === "pepper_dash") {
      return {
        title: "Spec: Pepper Poke",
        body: `Hit applies burn ${pepperBurnDamage(unit)}/s for ${statusDuration(unit, pepperBurnDuration(unit)).toFixed(1)}s. Burned or back-row target: damage +${pepperPokeBonus(unit)}.`,
      };
    }
    if (unit.ability === "armor_break") {
      const isBenedict = unit.typeId === "benedict_lobster";
      return {
        title: isBenedict ? "Spec: Brunch Breaker" : "Spec: Curry Breaker",
        body: `Damage +${armorBreakBonus(unit)} if target is front row, shielded, or has max HP >=115% of this unit.`,
      };
    }
    if (unit.ability === "shield_breaker") {
      return {
        title: "Spec: Shell Cracker",
        body: `Before damage, steal up to ${shieldBreakSteal(unit)} shield from the target. If shield was stolen, damage +${shieldBreakBonus(unit)} and this unit gains 75% of the stolen shield.`,
      };
    }
    if (unit.ability === "bagel_build") {
      const isBao = unit.typeId === "bao_bun_badger";
      return {
        title: isBao ? "Spec: Bao Cart" : "Spec: Bagel Build",
        body: `Start adjacent: ${supportAmount(unit, Math.round(bagelBuildShield(unit) * 0.85))} shield, +${percentText(bagelBuildHaste(unit))} haste for 2s. Hit: 2 allies shield ${supportAmount(unit, bagelBuildShield(unit))}.`,
      };
    }
    if (unit.ability === "treat_income") {
      return {
        title: realityBroken() ? "Spec: Salvage Income" : "Spec: Treat Income",
        body: `If alive when battle ends, next income payout gains +${donutTreatGold(unit)} ${currencyTerm({ lower: true })}.`,
      };
    }
    if (unit.ability === "status_spread") {
      const isChurro = unit.typeId === "churro_cheetah";
      const isViper = unit.typeId === "vinaigrette_viper";
      return {
        title: isChurro ? "Spec: Chili Sugar" : isViper ? "Spec: Sharp Dressing" : "Spec: Fermented Mark",
        body: `Hit applies burn ${kimchiBurnDamage(unit)}/s for ${statusDuration(unit, kimchiBurnDuration(unit)).toFixed(1)}s and mark +${percentText(kimchiMarkPct(unit))} damage for ${statusDuration(unit, kimchiMarkDuration(unit)).toFixed(1)}s. Statused target: +${kimchiStatusBonus(unit)} damage.`,
      };
    }
    if (unit.ability === "sticky_lane") {
      return {
        title: "Spec: Sticky Lane",
        body: `Trigger hit. Every enemy in target column gets cooldown +${waffleLaneDelay(unit)}s and slowed for ${statusDuration(unit, 1.4).toFixed(1)}s.`,
      };
    }
    if (unit.ability === "kernel_combo") {
      const isChip = unit.typeId === "hot_chip_hamster";
      return {
        title: isChip ? "Spec: Hot-Chip Crunch" : "Spec: Kernel Combo",
        body: `Each attack: +1 stack, max ${popcornMaxStacks(unit)}. Each stack gives +${popcornDamagePerStack(unit)} damage and +${percentText(popcornStackHaste(unit))} attack speed.`,
      };
    }
    if (unit.ability === "sour_aura") {
      return {
        title: "Spec: Sour Counter",
        body: `Hit: anti-support -${percentText(yogurtSourPct(unit))} for ${statusDuration(unit, yogurtSourDuration(unit)).toFixed(1)}s; attack slow ${unit.tier >= 3 ? "-16%" : "-10%"} for ${statusDuration(unit, unit.tier >= 3 ? 2 : 1.5).toFixed(1)}s. Shielded target: +${yogurtShieldCrackDamage(unit)} damage.`,
      };
    }
    if (unit.ability === "row_shield") {
      const isCaprese = unit.typeId === "caprese_capybara";
      return {
        title: isCaprese ? "Spec: Caprese Row" : "Spec: Row Guard",
        body: `Battle start row shield ${supportAmount(unit, Math.round(dumplingRowShield(unit) * 0.8))}. On hit, row shield ${supportAmount(unit, dumplingRowShield(unit))}.`,
      };
    }
    if (unit.ability === "formation_captain") {
      return {
        title: "Spec: Plate Captain",
        body: `Battle start and hit: allies sharing this unit's row or column gain ${supportAmount(unit, formationShield(unit))} shield and +${percentText(formationAttackBoost(unit))} damage for ${formationBuffDuration(unit)}s.`,
      };
    }
    if (unit.ability === "cleanse") {
      return {
        title: "Spec: Citrus Cleanse",
        body: `Before attack: cleanse 1 ally, heal ${supportAmount(unit, lemonCleanseHeal(unit))}, shield ${supportAmount(unit, lemonCleanseShield(unit))}, haste +${percentText(lemonCleanseHaste(unit))} for 2.5s.`,
      };
    }
    if (unit.ability === "shakshuka_burn") {
      return {
        title: "Spec: Skillet Burn",
        body: `Hit applies burn ${shakshukaBurnDamage(unit)}/s for ${statusDuration(unit, shakshukaBurnDuration(unit)).toFixed(1)}s. Adjacent enemies take ${shakshukaSplashDamage(unit)} splash and 65% burn.`,
      };
    }
    if (unit.ability === "pull_start") {
      return {
        title: "Spec: Tentacle Pull",
        body: `Battle start: back-row enemy moves 1 column forward, takes ${krakenPullDamage(unit)} damage, cooldown +${krakenPullDelay(unit)}s, slowed ${statusDuration(unit, 1.6).toFixed(1)}s.`,
      };
    }
    if (unit.ability === "copy_luck") {
      return {
        title: "Spec: Fortune Copies",
        body: `Owned-line ${realityBroken() ? "scan" : "shop"} odds +${percentText(fortuneShopChance(unit))}. Tier 2+: this line counts as +1 phantom copy for its own merge.`,
      };
    }
    if (unit.ability === "survive_scale") {
      const storedShield = mochiAdjacentShield(unit);
      return {
        title: "Spec: Mochi Growth",
        body: `If alive when battle ends: permanent max HP +${mochiHpGain(unit)}. Tier 2+ start: adjacent shield ${storedShield > 0 ? supportAmount(unit, storedShield) : 0} from stored HP.`,
      };
    }
    if (unit.ability === "ginger_decoy") {
      return {
        title: "Spec: Crumble Decoy",
        body: `Battle start: summon decoy with ${gingerDecoyHp(unit)} HP. Decoy death: ${gingerCrumbleDamage(unit)} damage to adjacent enemies.`,
      };
    }
    if (unit.ability === "iceberg_lock") {
      return {
        title: "Spec: Iceberg Lock",
        body: `Start front enemies: cooldown +${oysterLockDelay(unit)}s. Hit: cooldown +${oysterLockDelay(unit)}s, attack speed -${percentText(oysterSlowPct(unit))}, self shield ${supportAmount(unit, oysterLockShield(unit))}.`,
      };
    }
    if (unit.ability === "pearl_stun") {
      return {
        title: "Spec: Tapioca Stun",
        body: `Every ${bobaStunEvery(unit)} attacks: target cooldown +${bobaStunDelay(unit)}s and attack speed -${percentText(bobaAttackSlow(unit))} for ${statusDuration(unit, bobaSlowDuration(unit)).toFixed(1)}s. Tier 3+: adjacent target gets 65% cooldown delay.`,
      };
    }
    return {
      title: "Spec: Front Pressure",
      body: "Target: front occupied enemy column. Units behind occupied front columns cannot be hit unless back-row targeting is active.",
    };
  }

  function drawStatRow(label, value, x, y) {
    ctx.fillStyle = "#6a4b35";
    ctx.font = "700 10px Inter, sans-serif";
    ctx.fillText(label, x, y - 16);
    ctx.fillStyle = "#16392d";
    ctx.font = "800 17px Inter, sans-serif";
    ctx.fillText(String(value), x, y);
  }

  function drawStatBar(x, y, w, h, pct, color) {
    roundedRect(x, y, w, h, 5);
    ctx.fillStyle = "rgba(22, 57, 45, 0.14)";
    ctx.fill();
    const fillWidth = Math.max(0, Math.min(w, w * pct));
    if (fillWidth <= 0) return;
    roundedRect(x, y, fillWidth, h, Math.min(5, fillWidth / 2));
    ctx.fillStyle = color;
    ctx.fill();
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    window.FoodAnimalsCanvasText.drawWrapped(ctx, text, x, y, maxWidth, lineHeight, {
      cache: wrappedTextCache,
      cacheLimit: TEXT_LAYOUT_CACHE_LIMIT,
      font: ctx.font,
      measureText: (candidate, font) => measureTextWidth(candidate, font),
    });
  }

  function wrappedTextLines(text, maxWidth) {
    const font = ctx.font;
    return window.FoodAnimalsCanvasText.wrappedLines(ctx, text, maxWidth, {
      cache: wrappedTextCache,
      cacheLimit: TEXT_LAYOUT_CACHE_LIMIT,
      font,
      measureText: (candidate) => measureTextWidth(candidate, font),
    });
  }

  function drawWrappedTextFull(text, x, y, maxWidth, lineHeight) {
    return window.FoodAnimalsCanvasText.drawWrapped(ctx, text, x, y, maxWidth, lineHeight, {
      cache: wrappedTextCache,
      cacheLimit: TEXT_LAYOUT_CACHE_LIMIT,
      font: ctx.font,
      measureText: (candidate, font) => measureTextWidth(candidate, font),
    });
  }

  function wrapTextLimited(text, x, y, maxWidth, lineHeight, maxLines) {
    window.FoodAnimalsCanvasText.drawLimited(ctx, text, x, y, maxWidth, lineHeight, maxLines, {
      fitText,
      measureText: (candidate, font) => measureTextWidth(candidate, font),
    });
  }

  function scaledCanvasFont(font, px) {
    return window.FoodAnimalsCanvasText.scaleFont(font, px);
  }

  function canvasFontPx(font) {
    return window.FoodAnimalsCanvasText.fontPx(font);
  }

  function fitTextComplete(text, x, y, maxWidth, font, color, minPx = 6) {
    window.FoodAnimalsCanvasText.fitComplete(ctx, text, x, y, maxWidth, font, color, {
      minPx,
      measureText: (candidate, candidateFont) => measureTextWidth(candidate, candidateFont),
    });
  }

  function fitText(text, x, y, maxWidth, font, color, align) {
    window.FoodAnimalsCanvasUi.fitText(ctx, text, x, y, maxWidth, font, color, {
      align,
      measureText: (candidate) => measureTextWidth(candidate, font),
    });
  }

  function drawBattle(battle = visibleBattle()) {
    if (!battle) return;
    drawBattleFieldBackdrop();
    ctx.fillStyle = "rgba(22, 57, 45, 0.14)";
    ctx.fillRect(BATTLE_FIELD.dividerX, BATTLE_FIELD.dividerTop, 3, BATTLE_FIELD.dividerHeight);

    drawBattleGrid("ally");
    drawBattleGrid("enemy");
    drawBattleDrinkSlots("ally", battle.allyDrinks || state.drinks);
    drawBattleDrinkSlots("enemy", battle.enemyDrinks || []);
    battleUnitsInRenderOrder(battle).forEach((unit) => {
      if (unit.dead) {
        drawBattleDefeatStill(unit);
      } else {
        drawBattleUnit(unit);
      }
    });
    battle.attacks.forEach((attack) => drawAttackProjectile(attack, battle));
    (battle.drinkTosses || []).forEach((toss) => drawDrinkToss(toss, battle));
    drawBattleMoldPanel(battle);
    drawArenaBattlePanel();
  }

  function battleUnitsInRenderOrder(battle) {
    return window.FoodAnimalsBattleCanvas.unitsInRenderOrder(battle, battleCanvasOptions());
  }

  function sideUnitsInRenderOrder(units) {
    return window.FoodAnimalsBattleCanvas.sideUnitsInRenderOrder(units, battleCanvasOptions());
  }

  function battleUnitRenderLayer(unit) {
    return window.FoodAnimalsBattleCanvas.unitRenderLayer(unit, battleCanvasOptions());
  }

  function battleUnitRenderColumn(unit) {
    return window.FoodAnimalsBattleCanvas.unitRenderColumn(unit, FRONT_COL, slotGrid);
  }

  function battleCanvasOptions() {
    return {
      backCol: BACK_COL,
      boardRows: BOARD_ROWS,
      finalBossMinionTypeId: FINAL_BOSS_MINION_TYPE_ID,
      finalBossTypeId: FINAL_BOSS_TYPE_ID,
      frontCol: FRONT_COL,
      slotGrid,
    };
  }

  function battleUnitByUid(battle, uid) {
    if (!battle || uid == null) return null;
    const unitCount = (battle.allies?.length || 0) + (battle.enemies?.length || 0);
    if (!(battle.unitLookup instanceof Map) || battle.unitLookupSize !== unitCount) {
      const lookup = new Map();
      (battle.allies || []).forEach((unit) => lookup.set(unit.uid, unit));
      (battle.enemies || []).forEach((unit) => lookup.set(unit.uid, unit));
      battle.unitLookup = lookup;
      battle.unitLookupSize = unitCount;
    }
    return battle.unitLookup.get(uid) || null;
  }

  function drawBattleFieldBackdrop() {
    if (realityBroken()) {
      roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
      const image = getUiSprite(currentBattleFieldBgSrc());
      if (image && image.complete && image.naturalWidth > 0) {
        ctx.save();
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h);
        ctx.fillStyle = "rgba(2, 8, 9, 0.18)";
        ctx.fillRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h);
        ctx.restore();
        roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
        ctx.strokeStyle = "rgba(70, 255, 99, 0.42)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      } else {
      ctx.fillStyle = "rgba(4, 10, 13, 0.86)";
      ctx.fill();
      ctx.strokeStyle = "rgba(70, 255, 99, 0.38)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;
      }
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = "rgba(70, 255, 99, 0.12)";
      for (let x = BATTLE_FIELD.x - 40; x < BATTLE_FIELD.x + BATTLE_FIELD.w + 80; x += 42) {
        ctx.beginPath();
        ctx.moveTo(x, BATTLE_FIELD.y);
        ctx.lineTo(x + 170, BATTLE_FIELD.y + BATTLE_FIELD.h);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255, 61, 79, 0.13)";
      for (let y = BATTLE_FIELD.y + 28; y < BATTLE_FIELD.y + BATTLE_FIELD.h; y += 46) {
        ctx.beginPath();
        ctx.moveTo(BATTLE_FIELD.x, y);
        ctx.lineTo(BATTLE_FIELD.x + BATTLE_FIELD.w, y);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    const image = getUiSprite(BATTLE_FIELD_BG_SRC);
    roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(image, BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h);
      ctx.restore();
      roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
      ctx.strokeStyle = "rgba(22, 31, 27, 0.34)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;
      return;
    }
    ctx.fillStyle = "rgba(252, 248, 218, 0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
    ctx.stroke();
  }

  function drawAttackProjectile(attack, battle) {
    const from = battleUnitByUid(battle, attack.from);
    const to = battleUnitByUid(battle, attack.to);
    if (!from || !to) return;

    const duration = attack.duration || ATTACK_ANIMATION_SECONDS;
    const frame = window.FoodAnimalsBattleCanvas.projectileFrame(from, to, attack.t, duration, 18);
    const { progress, x, y, dx, dy } = frame;
    const angle = Math.atan2(dy, dx);
    const mirrorLeft = dx < 0;
    const fallbackSpinDirection = (attack.sourceSide || from.side) === "enemy" ? -1 : 1;
    const spin = attack.spin ?? fallbackSpinDirection * ATTACK_PROJECTILE_SPIN_MIN;
    const spinRotation = (attack.rotationStart || 0) + spin * progress;

    if (!attack.particleSrc) {
      const spriteInfo = particleSpriteInfo(attack.particleSprite || "attack", attack.particleType, attack.particleTier || 1);
      attack.particleSrc = spriteInfo.src;
      attack.particleCacheKind = spriteInfo.cacheKind;
    }
    const image = getParticleSprite(attack.particleCacheKind || attack.particleSprite || "attack", attack.particleType, attack.particleTier || 1, attack.particleSrc);
    const size = ATTACK_PROJECTILE_SIZE + Math.min(4, from.tier || 1) * 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((mirrorLeft ? angle - Math.PI : angle) + spinRotation);
    if (mirrorLeft) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.min(1, 0.25 + progress * 1.35);
    if (image && image.complete && image.naturalWidth) {
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      const chip = Math.max(9, Math.round(size * 0.22));
      roundedRect(-chip / 2, -chip / 2, chip, chip, 3);
      ctx.fillStyle = attack.color || "#f0d56b";
      ctx.fill();
      ctx.strokeStyle = "#fff9df";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawDrinkToss(toss, battle) {
    const to = battleUnitByUid(battle, toss.to);
    if (!to) return;

    const duration = toss.duration || DRINK_TOSS_ANIMATION_SECONDS;
    const frame = window.FoodAnimalsBattleCanvas.projectileFrame(
      { x: toss.fromX, y: toss.fromY },
      to,
      toss.t,
      duration,
      DRINK_TOSS_ARC_HEIGHT,
    );
    const { progress, x, y } = frame;
    const scale = 0.88 + Math.sin(progress * Math.PI) * 0.12;
    const image = getDrinkThrowableSprite(toss.id);
    const size = DRINK_TOSS_PROJECTILE_SIZE * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.min(1, 0.28 + progress * 1.25);
    if (image && image.complete && image.naturalWidth) {
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      roundedRect(-size / 4, -size / 4, size / 2, size / 2, 4);
      ctx.fillStyle = toss.color || "#7ec7e8";
      ctx.fill();
      ctx.strokeStyle = "#fff9df";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drinkTossImpact(toss, battle) {
    if (!toss || !battle) return;
    const target = battleUnitByUid(battle, toss.to);
    if (!target) return;
    burst({ x: target.x, y: target.y - 4 }, toss.color || "#7ec7e8", {
      food: true,
      particleSprite: "drink",
      particleType: toss.id,
      count: DRINK_TOSS_IMPACT_PARTICLES,
      spread: 14,
      life: 0.46,
      speedMin: 70,
      speedMax: 165,
      sizeMin: 13,
      sizeMax: 23,
    });
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function drawBattleGrid(side) {
    const battle = visibleBattle();
    const units = battle ? (side === "ally" ? battle.allies : battle.enemies) : [];
    for (let i = 0; i < boardSlots.length; i++) {
      const { x, y } = battleSlotPosition(side, i);
      const { col } = slotGrid(i);
      const cell = BATTLE_FORMATION.cellSize;
      const occupied = units.some((unit) => unit.slot === i);
      const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, cell, cell, "board", i);
      roundedRect(x - cell / 2, y - cell / 2, cell, cell, 8);
      if (!hasArtBackdrop) {
        ctx.fillStyle = realityBroken()
          ? (col === FRONT_COL ? "rgba(255, 61, 79, 0.12)" : "rgba(70, 255, 99, 0.08)")
          : (col === FRONT_COL ? "rgba(255, 245, 204, 0.24)" : "rgba(255, 253, 232, 0.16)");
        ctx.fill();
      }
      ctx.strokeStyle = hasArtBackdrop ? "transparent" : realityBroken() ? "rgba(70, 255, 99, 0.22)" : "rgba(22, 57, 45, 0.12)";
      ctx.stroke();
      if (occupied) continue;
    }
  }

  function battleDrinkSlotPosition(side, slot) {
    return window.FoodAnimalsBattleCanvas.battleDrinkSlotPosition(side, slot, BATTLE_FORMATION, BOARD_ROWS);
  }

  function drawBattleDrinkSlots(side, drinks) {
    const battle = visibleBattle();
    drinkSlots.forEach((slot, index) => {
      const item = drinks[index];
      const { x, y } = battleDrinkSlotPosition(side, slot);
      const size = BATTLE_DRINK_SLOT_SIZE;
      const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, size, size, "drinks", index);
      roundedRect(x - size / 2, y - size / 2, size, size, 7);
      if (!item && !hasArtBackdrop) {
        ctx.fillStyle = "rgba(242, 237, 210, 0.62)";
        ctx.fill();
      }
      if (!item) {
        ctx.strokeStyle = hasArtBackdrop ? "transparent" : "rgba(22, 57, 45, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      if (item) {
        drawBattleDrinkIcon(item, x, y, BATTLE_DRINK_ICON_RADIUS, battle);
        drawUpgradeStars(itemTier(item.tier), x, y + size / 2 - 5, 6, "center");
      }
    });
  }

  function drawBattleDrinkIcon(item, x, y, r, battle) {
    const motion = drinkPulseMotion(item, battle);
    ctx.save();
    ctx.translate(x, y + motion.y);
    ctx.scale(motion.scaleX, motion.scaleY);
    drawItemIcon(item, 0, 0, r, { centerOpaque: true, opaqueAnchorY: DRINK_COASTER_OPAQUE_ANCHOR_Y });
    ctx.restore();
  }

  function drinkPulseMotion(item, battle) {
    return window.FoodAnimalsBattleCanvas.drinkPulseMotion(item, battle, {
      duration: DRINK_PULSE_ANIMATION_SECONDS,
      hopPixels: DRINK_PULSE_HOP_PIXELS,
    });
  }

  function drawBattleUnit(unit) {
    const radius = 28 + Math.min(4, unit.tier) * 4;
    const visualRadius = radius * (unit.battleSpriteScale || 1);
    const drawY = unit.y + (unit.battleSpriteOffsetY || 0);
    const barRadius = Math.min(68, visualRadius);
    const presentationScale = horrorFoodAnimalPlacementScale(unit, "battle");
    const anchorBase = Boolean(unit.giraffeBossUnit || isGiraffeBossUnitType(unit.typeId));
    drawFoodAnimal(unit, unit.x, drawY, visualRadius, unit.side === "ally", {
      presentationScale,
      preserveBase: presentationScale !== 1,
      anchorBase,
    });
    drawUnitStatusGlyphs(unit, unit.x, unit.y, radius);
    const baseBarRows = drawBattleBaseBars(unit, barRadius, drawY);
    drawUpgradeStars(Math.min(4, unit.tier), unit.x, drawY + barRadius + 14 + baseBarRows * 8, 10, "center");
    ctx.textAlign = "left";
  }

  function drawBattleBaseBars(unit, r, anchorY = unit.y) {
    const shieldPct = unit.shield > 0 ? clamp(unit.shield / Math.max(1, unit.maxHp * 0.5), 0.08, 1) : 0;
    const hpPct = clamp01(unit.hp / Math.max(1, unit.maxHp));
    const healthVisible = hpPct < 0.995;
    let rows = 0;
    if (shieldPct > 0) {
      drawBattleBaseBar(unit.x, anchorY + r + 5, shieldPct, "#5aa6d6", "rgba(220, 244, 252, 0.8)");
      rows += 1;
    }
    if (healthVisible) {
      const y = anchorY + r + 5 + rows * 8;
      drawBattleBaseBar(unit.x, y, hpPct, hpPct > 0.45 ? "#4a9e68" : "#d9573c", "rgba(255, 249, 224, 0.78)");
      if (hpPct <= 0.28) {
        const time = visibleBattle()?.elapsed || 0;
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(time * 7.5) * 0.18;
        ctx.strokeStyle = "#d9573c";
        ctx.lineWidth = 2;
        roundedRect(unit.x - 27, y - 2, 54, 9, 5);
        ctx.stroke();
        ctx.restore();
      }
      rows += 1;
    }
    return rows;
  }

  function drawBattleBaseBar(centerX, y, pct, color, bgColor) {
    const bw = 50;
    const bh = 5;
    const x = centerX - bw / 2;
    const fillWidth = clamp(bw * pct, 0, bw);

    ctx.save();
    roundedRect(x, y, bw, bh, 3);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.34)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (fillWidth > 0) {
      roundedRect(x, y, fillWidth, bh, Math.min(3, fillWidth / 2));
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBattleDefeatStill(unit) {
    const postGiraffeTransition = postGiraffeHorrorContentPhase("defeatedUnit", unit);
    const image = getDefeatStillSprite(unit, {
      cozy: postGiraffeTransition?.mode === "cozy",
      horror: postGiraffeTransition?.mode === "horror",
    });
    if (!(image && image.complete && image.naturalWidth > 0)) return;
    const radius = 28 + unit.tier * 4;
    const visualRadius = radius * (unit.battleSpriteScale || 1);
    const horrorStill = postGiraffeTransition?.mode === "cozy" ? false : realityBroken();
    const presentationScale = horrorStill
      ? (unit.defeatStillScale || horrorFoodAnimalPlacementScale(unit, "battle") || HORROR_DEFEAT_STILL_SCALE)
      : (unit.defeatStillScale || 1);
    const metrics = runtimeSpriteMetrics(image);
    const targetMax = Math.round(visualRadius * 2.9 * presentationScale);
    const metricsMax = Math.max(metrics.w, metrics.h, 1);
    const drawScale = targetMax / metricsMax;
    const drawW = Math.round(metrics.w * drawScale);
    const drawH = Math.round(metrics.h * drawScale);
    const anchorBase = Boolean(unit.giraffeBossUnit || isGiraffeBossUnitType(unit.typeId));
    const baseY = anchorBase
      ? unit.y + (unit.battleSpriteOffsetY || 0) + visualRadius
      : unit.y + targetMax * 0.38;
    const facingRight = horrorStill && unit.side === "ally";
    const rect = { x: Math.round(unit.x - drawW / 2), y: Math.round(baseY - drawH), w: drawW, h: drawH };

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.86;
    drawImageRegionFacing(image, metrics.x, metrics.y, metrics.w, metrics.h, rect.x, rect.y, rect.w, rect.h, facingRight);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
    drawPostGiraffeHorrorContentEffect(rect, "defeatedUnit", unit, postGiraffeTransition);
  }

  function activeStatusEffects(unit) {
    const moldEffect = unit.moldStacks > 0 ? { id: currentMoldStatusEffectId(), ...currentMoldStatusStyle() } : null;
    return window.FoodAnimalsStatusRuntime.activeEffects(unit, STATUS_EFFECT_STYLES, { moldEffect });
  }

  function drawUnitStatusGlyphs(unit, x, y, r) {
    const effects = activeStatusEffects(unit);
    if (!effects.length) return;
    const time = visibleBattle()?.elapsed || 0;
    effects.forEach((effect, index) => {
      const layout = window.FoodAnimalsBattleCanvas.statusGlyphLayout(effects.length, x, y, r, time)[index];
      drawStatusGlyph(effect, layout.x, layout.y, layout.size);
    });
  }

  function drawStatusGlyph(effect, x, y, size) {
    const horror = realityBroken();
    ctx.save();
    ctx.translate(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = horror ? "rgba(5, 16, 18, 0.88)" : "rgba(255, 253, 232, 0.82)";
    ctx.strokeStyle = horror ? "rgba(86, 255, 97, 0.36)" : "rgba(22, 57, 45, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const sprite = getStatusEffectSprite(effect.id);
    if (sprite?.complete && sprite.naturalWidth) {
      const imageSize = size * 2.28;
      const smoothing = ctx.imageSmoothingEnabled;
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, -imageSize / 2, -imageSize / 2, imageSize, imageSize);
      ctx.imageSmoothingEnabled = smoothing;
      ctx.restore();
      return;
    }

    ctx.fillStyle = effect.color;
    ctx.strokeStyle = "#fff9df";
    ctx.lineWidth = 2;

    if (effect.kind === "flame") {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.8, -size * 0.2, size * 0.3, size * 0.75);
      ctx.quadraticCurveTo(0, size * 1.05, -size * 0.45, size * 0.6);
      ctx.quadraticCurveTo(-size * 0.9, -size * 0.15, 0, -size);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(size * 0.12, size * 0.3, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "target") {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "chevron") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 4;
      for (let i = 0; i < 2; i++) {
        const yy = i * size * 0.45 - size * 0.25;
        ctx.beginPath();
        ctx.moveTo(-size * 0.65, yy + size * 0.32);
        ctx.lineTo(0, yy - size * 0.28);
        ctx.lineTo(size * 0.65, yy + size * 0.32);
        ctx.stroke();
      }
    } else if (effect.kind === "burst") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.25, Math.sin(a) * size * 0.25);
        ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        ctx.stroke();
      }
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "down") {
      ctx.fillStyle = effect.color;
      roundedRect(-size * 0.24, -size, size * 0.48, size * 1.15, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.72, size * 0.1);
      ctx.lineTo(0, size);
      ctx.lineTo(size * 0.72, size * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (effect.kind === "brokenPlus") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-size * 0.75, 0);
      ctx.lineTo(-size * 0.18, 0);
      ctx.moveTo(size * 0.18, 0);
      ctx.lineTo(size * 0.75, 0);
      ctx.moveTo(0, -size * 0.75);
      ctx.lineTo(0, -size * 0.18);
      ctx.moveTo(0, size * 0.18);
      ctx.lineTo(0, size * 0.75);
      ctx.stroke();
      ctx.strokeStyle = effect.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, -size * 0.45);
      ctx.lineTo(size * 0.45, size * 0.45);
      ctx.stroke();
    } else if (effect.kind === "vine") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.65, Math.PI * 0.25, Math.PI * 1.65);
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.ellipse(-size * 0.38, -size * 0.08, size * 0.28, size * 0.16, -0.6, 0, Math.PI * 2);
      ctx.ellipse(size * 0.34, size * 0.12, size * 0.28, size * 0.16, 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "crown") {
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.moveTo(-size, size * 0.5);
      ctx.lineTo(-size * 0.7, -size * 0.45);
      ctx.lineTo(-size * 0.22, size * 0.12);
      ctx.lineTo(0, -size * 0.65);
      ctx.lineTo(size * 0.22, size * 0.12);
      ctx.lineTo(size * 0.7, -size * 0.45);
      ctx.lineTo(size, size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (effect.kind === "mold") {
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.arc(-size * 0.36, size * 0.18, size * 0.32, 0, Math.PI * 2);
      ctx.arc(size * 0.08, -size * 0.1, size * 0.42, 0, Math.PI * 2);
      ctx.arc(size * 0.48, size * 0.26, size * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(-size * 0.08, size * 0.2, size * 0.1, 0, Math.PI * 2);
      ctx.arc(size * 0.32, -size * 0.02, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "radiation") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + i * (Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.34) * size * 0.28, Math.sin(a - 0.34) * size * 0.28);
        ctx.arc(0, 0, size * 0.78, a - 0.34, a + 0.34);
        ctx.lineTo(Math.cos(a + 0.34) * size * 0.28, Math.sin(a + 0.34) * size * 0.28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#07100b";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    state.particles.forEach((p) => {
      const frame = window.FoodAnimalsParticleRuntime.frame(p);
      const { alpha } = frame;
      ctx.globalAlpha = alpha;
      if (p.foodParticles) {
        const image = getParticleSprite(p.imageCacheKind || p.particleSprite || "attack", p.particleType, p.particleTier, p.imageSrc);
        const { size } = frame;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.imageSmoothingEnabled = false;
        if (image && image.complete && image.naturalWidth) {
          ctx.drawImage(image, -size / 2, -size / 2, size, size);
        } else if (!p.suppressFallback) {
          roundedRect(-size / 4, -size / 4, size / 2, size / 2, 3);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = "#fff9df";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  function storySpeakerIsTabs(speaker) {
    const label = String(speaker || "").toLowerCase();
    return label === "tabs" || label === "t.a.b.s.";
  }

  function storyUsesHorrorTabs(story = state.activeStory) {
    return realityBroken() || story?.id === "level10" || story?.id === "level15" || story?.id === FINAL_TABS_STORY_ID;
  }

  function storySpeakerPortraitSrc(speaker, story = state.activeStory) {
    if (!storySpeakerIsTabs(speaker)) return PLAYER_STORY_PORTRAIT_SRC;
    return storyUsesHorrorTabs(story) ? HORROR_TABS_STORY_PORTRAIT_SRC : TABS_STORY_PORTRAIT_SRC;
  }

  function currentStoryBackgroundSrc(story = state.activeStory) {
    if (!story) return null;
    const index = Math.max(0, story.index || 0);
    const range = (story.backgroundRanges || []).find((entry) => {
      if (!entry?.backgroundSrc) return false;
      const from = Number.isFinite(entry.from) ? entry.from : 0;
      const to = Number.isFinite(entry.to) ? entry.to : from;
      return index >= from && index <= to;
    });
    return range?.backgroundSrc || story.backgroundSrc || null;
  }

  function drawStoryConversationBackground(story, horror = false) {
    const src = currentStoryBackgroundSrc(story);
    if (!src) return;
    const image = getBackgroundImage(src);
    ctx.save();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const x = (W - drawW) * 0.5;
      const y = (H - drawH) * 0.5;
      ctx.drawImage(image, x, y, drawW, drawH);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, H);
      if (horror) {
        gradient.addColorStop(0, "#030607");
        gradient.addColorStop(0.55, "#0a1415");
        gradient.addColorStop(1, "#16080c");
      } else {
        gradient.addColorStop(0, "#f7e7b8");
        gradient.addColorStop(0.58, "#d9c48b");
        gradient.addColorStop(1, "#8f7448");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function storyDialogueLayout() {
    return window.FoodAnimalsStoryCanvas.layout({ width: W, height: H });
  }

  function storyAdvanceButtonRect() {
    return storyDialogueLayout().button;
  }

  function storyBackButtonRect() {
    return storyDialogueLayout().backButton;
  }

  function storySkipButtonRect() {
    return storyDialogueLayout().skipButton;
  }

  function drawStoryConversationOverlay() {
    const story = state.activeStory;
    const beat = currentStoryBeat();
    if (!story || !beat) return;
    const speakerLabel = String(beat.speaker || "SYSTEM");
    const speakerKey = speakerLabel.toLowerCase();
    const tabsSpeaker = storySpeakerIsTabs(speakerLabel);
    const playerSpeaker = speakerKey === "you";
    const hostile = beat.speaker === "T.A.B.S." || beat.tone === "malignant" || beat.tone === "glitch";
    const horror = realityBroken();
    const tabsPortraitSrc = storySpeakerPortraitSrc("Tabs", story);
    const beatMotion = storyBeatTransitionVisual(story);
    const transitionAlpha = storyTransitionAlpha(story);
    drawStoryConversationBackground(story, storyUsesHorrorTabs(story));
    window.FoodAnimalsStoryCanvas.drawOverlay({
      ctx,
      story,
      beat,
      width: W,
      height: H,
      idleTime: state.idleTime,
      playerPortraitSrc: PLAYER_STORY_PORTRAIT_SRC,
      tabsPortraitSrc,
      paperSrc: horror ? STORY_DIALOGUE_WAR_BG_SRC : STORY_DIALOGUE_PAPER_BG_SRC,
      horror,
      hostile,
      playerSpeaker,
      tabsSpeaker,
      useHorrorTabs: storyUsesHorrorTabs(story),
      transitionAlpha,
      transitionPhase: storyTransitionPhase(story),
      beatMotion,
      canGoBack: storyCanGoBack(),
      skipConfirm: story.skipConfirm,
      getImage: getUiSprite,
      roundedRect,
      wrappedTextLines,
      fitText,
    });
  }

  function drawLevel10RevealCutsceneOverlay() {
    const cutscene = state.level10RevealCutscene;
    const shot = level10RevealCutsceneShot(cutscene);
    if (!cutscene || !shot) return;
    const local = clamp((cutscene.elapsed || 0) - shot.start, 0, shot.duration);
    const progress = clamp01(local / Math.max(0.001, shot.duration));
    const alpha = clamp01(local / 0.45);
    const frame = Math.floor((state.idleTime + local) * 24);
    const shotIndex = level10RevealCutsceneShotIndex(cutscene);
    const transitioning = level10RevealCutsceneTransitioning(cutscene);

    ctx.save();
    ctx.fillStyle = "#020506";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    if (shot.mode === "panorama") {
      drawLevel10RevealPanoramaShot(shot, shotIndex, progress, alpha, frame);
      if (transitioning) drawLevel10CutsceneStaticTransition(cutscene, frame);
      return;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    drawLevel10CutscenePlateBackground(shot, progress, frame);
    drawLevel10CutsceneStatic(frame, 0.44 + progress * 0.22);
    drawLevel10CutsceneScanlines(0.22);
    drawLevel10CutsceneAmbientFx(shot, progress, frame);
    ctx.globalAlpha = alpha * 0.96;
    ctx.fillStyle = "#020506";
    ctx.fillRect(0, 0, W, 52);
    ctx.fillRect(0, H - 52, W, 52);
    ctx.globalAlpha = alpha;
    drawLevel10CutsceneVisual(shot, progress, frame);
    drawLevel10CutsceneText(shot, shotIndex, progress);
    if (!transitioning) {
      drawLevel10CutsceneProgress(shotIndex);
      drawLevel10CutsceneNavButtons(shotIndex);
    }
    ctx.restore();
    if (transitioning) drawLevel10CutsceneStaticTransition(cutscene, frame);
  }

  function drawLevel10CutsceneTexture(src, x, y, w, h, radius = 0, options = {}) {
    const image = src ? getUiSprite(src) : null;
    if (!image?.complete || image.naturalWidth <= 0) return false;
    const scale = options.fit === "contain"
      ? Math.min(w / image.naturalWidth, h / image.naturalHeight)
      : Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const drawW = image.naturalWidth * scale;
    const drawH = image.naturalHeight * scale;
    const focusX = clamp01(options.focusX ?? 0.5);
    const focusY = clamp01(options.focusY ?? 0.5);
    const drawX = x + (w - drawW) * focusX;
    const drawY = y + (h - drawH) * focusY;
    ctx.save();
    ctx.globalAlpha *= options.alpha ?? 1;
    ctx.beginPath();
    if (radius > 0) roundedRect(x, y, w, h, radius);
    else ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, Math.round(drawX), Math.round(drawY), Math.ceil(drawW), Math.ceil(drawH));
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
    return true;
  }

  function drawLevel10CutsceneFxCell(cellKey, x, y, w, h, options = {}) {
    const image = getUiSprite(LEVEL10_CUTSCENE_FX_ATLAS_SRC);
    const cell = LEVEL10_CUTSCENE_FX_CELLS[cellKey];
    if (!cell || !image?.complete || image.naturalWidth <= 0) return false;
    ctx.save();
    ctx.globalAlpha *= options.alpha ?? 1;
    ctx.globalCompositeOperation = options.blend || "screen";
    if (options.clipRadius) {
      ctx.beginPath();
      roundedRect(x, y, w, h, options.clipRadius);
      ctx.clip();
    }
    ctx.translate(x + w / 2, y + h / 2);
    if (options.rotate) ctx.rotate(options.rotate);
    ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, cell.sx, cell.sy, cell.sw, cell.sh, -w / 2, -h / 2, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
    return true;
  }

  function drawLevel10CutsceneAmbientFx(shot, progress, frame, options = {}) {
    const time = state.idleTime + shot.start * 0.17;
    ctx.save();
    if (shot.mode === "panorama") {
      const panOffsetX = Number.isFinite(options.panOffsetX) ? options.panOffsetX : 0;
      ctx.translate(panOffsetX, 0);
      for (let i = 0; i < 4; i++) {
        const drift = ((time * (6 + i) + i * 91) % 190) - 95;
        drawLevel10CutsceneFxCell("smoke", -90 + i * 260 + drift, 56 + i * 78, 360, 224, {
          alpha: 0.18 + i * 0.025,
          blend: "screen",
          rotate: Math.sin(time * 0.18 + i) * 0.08,
          flipX: i % 2 === 1,
        });
      }
      [[156, 178], [476, 300], [746, 206], [884, 392]].forEach(([px, py], i) => {
        const blink = glitchNoise(frame * 19 + i * 71);
        if (blink > 0.28) {
          drawLevel10CutsceneFxCell("sparks", px - 72, py - 70, 142, 142, {
            alpha: 0.18 + blink * 0.28,
            blend: "lighter",
            rotate: time * 0.3 + i,
          });
        }
      });
      drawLevel10CutsceneFxCell("warning", 690, 58, 245, 176, {
        alpha: 0.22 + glitchNoise(frame * 11) * 0.16,
        blend: "lighter",
      });
    } else {
      const tearY = 64 + (frame % 160) * 0.62;
      drawLevel10CutsceneFxCell("signal", -48, tearY - 92, 540, 178, {
        alpha: 0.18 + glitchNoise(frame * 23 + shot.start) * 0.12,
        blend: "screen",
      });
      drawLevel10CutsceneFxCell("smoke", 420 + Math.sin(time * 0.22) * 22, H - 210, 410, 220, {
        alpha: 0.12,
        blend: "screen",
        rotate: -0.12,
      });
      drawLevel10CutsceneFxCell("warning", 818, 82, 164, 126, {
        alpha: 0.16 + glitchNoise(frame * 37 + shot.duration) * 0.1,
        blend: "lighter",
      });
    }
    ctx.restore();
  }

  function drawLevel10CutsceneVisualArtFx(shot, x, y, w, h, progress, frame) {
    const time = state.idleTime + shot.start * 0.11;
    ctx.save();
    if (shot.id === "expired") {
      drawLevel10CutsceneFxCell("signal", x + 30, y + 88 + Math.sin(time * 0.8) * 8, w - 60, 122, {
        alpha: 0.32,
        blend: "screen",
        clipRadius: 6,
      });
      drawLevel10CutsceneFxCell("warning", x + 184, y + 254, 108, 82, {
        alpha: 0.28 + glitchNoise(frame * 17) * 0.18,
        blend: "lighter",
        clipRadius: 6,
      });
    } else if (shot.id === "shell") {
      drawLevel10CutsceneFxCell("signal", x + 34, y + 118, w - 68, 112, {
        alpha: 0.28,
        blend: "screen",
        clipRadius: 6,
      });
      drawLevel10CutsceneFxCell("fluid", x + 88 + Math.sin(time * 0.4) * 4, y + 220, 150, 132, {
        alpha: 0.22,
        blend: "screen",
        clipRadius: 6,
      });
    } else if (shot.id === "pilots") {
      drawLevel10CutsceneFxCell("pilots", x + 36, y + 58 + Math.sin(time * 0.8) * 2, w - 72, 250, {
        alpha: 0.56,
        blend: "screen",
        clipRadius: 6,
      });
      drawLevel10CutsceneFxCell("signal", x + 84, y + 70 + (frame % 90) * 1.9, w - 120, 82, {
        alpha: 0.34,
        blend: "lighter",
        clipRadius: 6,
      });
    } else if (shot.id === "pens") {
      drawLevel10CutsceneFxCell("warning", x + 84, y + 70, 158, 132, {
        alpha: 0.32 + Math.sin(time * 3.2) * 0.08,
        blend: "lighter",
        clipRadius: 6,
      });
      drawLevel10CutsceneFxCell("fluid", x + 68, y + 250, 178, 112, {
        alpha: 0.3,
        blend: "screen",
        clipRadius: 6,
      });
    } else if (shot.id === "defiance") {
      drawLevel10CutsceneFxCell("signal", x + 42, y + 84, w - 84, 224, {
        alpha: 0.34,
        blend: "lighter",
        clipRadius: 6,
      });
      drawLevel10CutsceneFxCell("sparks", x + 170 + Math.sin(time * 0.6) * 8, y + 122, 118, 118, {
        alpha: 0.26 + glitchNoise(frame * 29) * 0.18,
        blend: "lighter",
        rotate: time,
      });
    }
    ctx.restore();
  }

  function drawLevel10CutscenePlateBackground(shot, progress, frame) {
    ctx.fillStyle = "#020506";
    ctx.fillRect(0, 0, W, H);
    const image = shot.imageSrc ? getUiSprite(shot.imageSrc) : null;
    if (image?.complete && image.naturalWidth > 0) {
      const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight) * (1 + progress * 0.018);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const travelX = Math.max(0, drawW - W);
      const travelY = Math.max(0, drawH - H);
      const focus = clamp01((shot.imageFocus ?? 0.5) + (progress - 0.5) * 0.045);
      const bob = (glitchNoise(frame * 13 + shot.start * 17) - 0.5) * 2;
      const drawX = -travelX * focus;
      const drawY = -travelY * 0.5 + bob;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, Math.round(drawX), Math.round(drawY), Math.ceil(drawW), Math.ceil(drawH));
      ctx.imageSmoothingEnabled = true;
    } else {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#020506");
      bg.addColorStop(0.46, "#061010");
      bg.addColorStop(1, "#140509");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    const readabilityWash = ctx.createLinearGradient(0, 0, W, 0);
    readabilityWash.addColorStop(0, "rgba(1, 4, 5, 0.66)");
    readabilityWash.addColorStop(0.36, "rgba(2, 8, 10, 0.34)");
    readabilityWash.addColorStop(0.68, "rgba(2, 8, 10, 0.1)");
    readabilityWash.addColorStop(1, "rgba(2, 4, 5, 0.44)");
    ctx.fillStyle = readabilityWash;
    ctx.fillRect(0, 0, W, H);

    const vignette = ctx.createRadialGradient(W * 0.58, H * 0.48, H * 0.14, W * 0.55, H * 0.52, H * 0.78);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(0.66, "rgba(0, 0, 0, 0.18)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.72)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    drawLevel10CutsceneTexture(LEVEL10_CUTSCENE_GLITCH_OVERLAY_SRC, 0, 0, W, H, 0, {
      alpha: 0.09 + glitchNoise(frame * 31 + shot.start * 13) * 0.03,
      focusX: 0.18 + progress * 0.08,
    });
  }

  function drawLevel10RevealPanoramaShot(shot, shotIndex, progress, alpha, frame) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#020506";
    ctx.fillRect(0, 0, W, H);
    const image = getUiSprite(LEVEL10_REVEAL_WAR_YARD_PANORAMA_SRC);
    let panoramaPanOffsetX = 0;
    if (image?.complete && image.naturalWidth > 0) {
      const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const panTravel = Math.max(0, drawW - W);
      const pan = easeInOutCubic(clamp01(progress));
      const drawX = -panTravel * pan;
      const drawY = (H - drawH) / 2;
      panoramaPanOffsetX = drawX;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, Math.round(drawX), Math.round(drawY), Math.ceil(drawW), Math.ceil(drawH));
      ctx.imageSmoothingEnabled = true;
    } else {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#020506");
      bg.addColorStop(0.45, "#061010");
      bg.addColorStop(1, "#160508");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }
    drawLevel10CutsceneStatic(frame, 0.24);
    drawLevel10CutsceneScanlines(0.16);

    const vignette = ctx.createRadialGradient(W * 0.52, H * 0.47, H * 0.18, W * 0.52, H * 0.5, H * 0.75);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(0.66, "rgba(0, 0, 0, 0.22)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.78)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    drawLevel10CutsceneAmbientFx(shot, progress, frame, { panOffsetX: panoramaPanOffsetX });

    const captionW = 640;
    const captionX = 42;
    const captionY = H - 164;
    const captionAlpha = clamp01(progress / 0.08);
    ctx.globalAlpha *= captionAlpha;
    roundedRect(captionX, captionY, captionW, 106, 8);
    ctx.fillStyle = "rgba(2, 8, 10, 0.84)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 89, 107, 0.48)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff596b";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.fillText(shot.label, captionX + 22, captionY + 28);
    ctx.fillStyle = "#f0fff0";
    ctx.font = "950 24px Inter, sans-serif";
    fitText(shot.title, captionX + 22, captionY + 58, captionW - 44, "950 24px Inter, sans-serif", "#f0fff0");
    ctx.fillStyle = "#b8f2c0";
    ctx.font = "700 13px Inter, sans-serif";
    wrapTextLimited(shot.body, captionX + 22, captionY + 80, captionW - 44, 18, 2);
    ctx.globalAlpha = alpha;
    drawLevel10CutsceneProgress(shotIndex);
    drawLevel10CutsceneNavButtons(shotIndex);
    drawLevel10CutsceneSkipNote();
    ctx.restore();
  }

  function drawLevel10CutsceneSkipNote() {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(240, 255, 240, 0.56)";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText("Escape skips", W / 2, H - 23);
    ctx.restore();
  }

  function drawLevel10CutsceneText(shot, shotIndex, progress) {
    const panelX = 70;
    const panelY = 84;
    const panelW = 505;
    const panelH = 358;
    const pulse = 0.5 + Math.sin(state.idleTime * 7.5) * 0.5;
    ctx.save();
    const textured = drawLevel10CutsceneTexture(LEVEL10_CUTSCENE_TEXT_PANEL_SRC, panelX, panelY, panelW, panelH, 10, {
      alpha: 0.82,
      focusX: 0.5,
      focusY: 0.48,
    });
    ctx.globalAlpha = textured ? 0.54 : 0.82;
    roundedRect(panelX, panelY, panelW, panelH, 10);
    ctx.fillStyle = "rgba(3, 12, 14, 0.76)";
    ctx.fill();
    ctx.strokeStyle = `rgba(70, 255, 99, ${0.4 + pulse * 0.24})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = "left";
    ctx.fillStyle = "#46ff63";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.fillText(shot.label, panelX + 24, panelY + 34);

    ctx.fillStyle = "#f0fff0";
    ctx.font = "950 30px Inter, sans-serif";
    wrapTextLimited(shot.title, panelX + 24, panelY + 82, panelW - 48, 34, 2);

    ctx.fillStyle = "#b8f2c0";
    ctx.font = "700 15px Inter, sans-serif";
    wrapTextLimited(shot.body, panelX + 24, panelY + 182, panelW - 48, 22, 5);

    drawLevel10CutsceneSkipNote();
  }

  function drawLevel10CutsceneProgress(shotIndex) {
    const markerW = 18;
    const gap = 10;
    const count = LEVEL10_REVEAL_CUTSCENE_SHOTS.length;
    const totalW = count * markerW + (count - 1) * gap;
    const startX = (W - totalW) / 2;
    const y = H - 48;
    LEVEL10_REVEAL_CUTSCENE_SHOTS.forEach((_entry, index) => {
      const markerX = startX + index * (markerW + gap);
      ctx.fillStyle = index === shotIndex
        ? "rgba(255, 89, 107, 0.92)"
        : index < shotIndex
        ? "rgba(255, 89, 107, 0.38)"
        : "rgba(184, 242, 192, 0.18)";
      ctx.fillRect(markerX, y, markerW, 4);
    });
  }

  function level10CutsceneNavButtonRects() {
    const y = H - 72;
    return {
      back: { x: W - 296, y, w: 112, h: 36 },
      continue: { x: W - 172, y, w: 132, h: 36 },
    };
  }

  function drawLevel10CutsceneNavButtons(shotIndex) {
    const rects = level10CutsceneNavButtonRects();
    const isFirst = shotIndex <= 0;
    const isLast = shotIndex >= LEVEL10_REVEAL_CUTSCENE_SHOTS.length - 1;
    [
      { rect: rects.back, label: "BACK", enabled: !isFirst },
      { rect: rects.continue, label: isLast ? "FINISH" : "CONTINUE", enabled: true },
    ].forEach((button) => {
      const hovered = Boolean(state.pointer && pointInRect(state.pointer.x, state.pointer.y, button.rect));
      ctx.save();
      ctx.globalAlpha *= button.enabled ? 1 : 0.38;
      roundedRect(button.rect.x, button.rect.y, button.rect.w, button.rect.h, 7);
      ctx.fillStyle = hovered && button.enabled ? "rgba(16, 35, 31, 0.94)" : "rgba(3, 12, 14, 0.88)";
      ctx.fill();
      ctx.strokeStyle = hovered && button.enabled ? "rgba(240, 255, 240, 0.66)" : "rgba(70, 255, 99, 0.44)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = button.enabled ? "#f0fff0" : "rgba(184, 242, 192, 0.68)";
      ctx.font = "950 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(button.label, button.rect.x + button.rect.w / 2, button.rect.y + button.rect.h / 2 + 1);
      ctx.restore();
    });
  }

  function drawLevel10CutsceneVisual(shot, progress, frame) {
    const x = 625;
    const y = 92;
    const w = 320;
    const h = 408;
    ctx.save();
    roundedRect(x, y, w, h, 12);
    ctx.fillStyle = shot.imageSrc ? "rgba(2, 7, 9, 0.48)" : "rgba(2, 7, 9, 0.7)";
    ctx.fill();
    const framed = drawLevel10CutsceneTexture(LEVEL10_CUTSCENE_EVIDENCE_FRAME_SRC, x, y, w, h, 12, {
      alpha: 0.82,
      focusX: 0.5,
      focusY: 0.5,
    });
    if (shot.insertSrc) {
      drawLevel10CutsceneTexture(shot.insertSrc, x + 38, y + 46, w - 76, h - 104, 6, {
        alpha: 0.68,
        focusX: 0.5,
        focusY: 0.5,
      });
      roundedRect(x + 38, y + 46, w - 76, h - 104, 6);
      ctx.fillStyle = "rgba(2, 7, 9, 0.08)";
      ctx.fill();
    }
    drawLevel10CutsceneVisualArtFx(shot, x, y, w, h, progress, frame);
    roundedRect(x, y, w, h, 12);
    ctx.strokeStyle = framed ? "rgba(255, 89, 107, 0.42)" : "rgba(255, 89, 107, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    drawHeavyStaticAroundRect({ x, y, w, h }, 3000 + frame + shot.start * 11, 0.36);
    ctx.restore();
  }

  function drawLevel10ExpiredVisual(x, y, w, h, progress, frame) {
    const cx = x + w / 2;
    ctx.textAlign = "center";
    ctx.font = "900 54px Inter, sans-serif";
    ctx.fillStyle = `rgba(255, 89, 107, ${0.32 + progress * 0.52})`;
    ctx.fillText("184", cx, y + 126);
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText("YEARS", cx, y + 153);
    ctx.strokeStyle = "rgba(70, 255, 99, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 18; i++) {
      const px = x + 40 + i * 14;
      const py = y + 244 + Math.sin(frame * 0.5 + i * 0.9) * (i % 3 === 0 ? 24 : 8);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(240, 255, 240, 0.12)";
    ctx.fillRect(x + 44, y + 276, w - 88, 34);
    ctx.fillStyle = "rgba(255, 89, 107, 0.72)";
    ctx.fillRect(x + 44, y + 289, (w - 88) * (0.12 + progress * 0.82), 8);
  }

  function drawLevel10ShellVisual(x, y, w, h, progress, frame) {
    const gridX = x + 68;
    const gridY = y + 72;
    const cell = 54;
    ctx.strokeStyle = "rgba(70, 255, 99, 0.34)";
    ctx.lineWidth = 1.4;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const px = gridX + col * cell;
        const py = gridY + row * cell;
        ctx.beginPath();
        if (progress < 0.45) ctx.ellipse(px, py, 23, 17, 0, 0, Math.PI * 2);
        else ctx.rect(px - 24, py - 24, 48, 48);
        ctx.stroke();
      }
    }
    ctx.fillStyle = "rgba(255, 89, 107, 0.76)";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ["PLATE", "GRID", "RAIL", "FUEL"].forEach((label, i) => {
      const px = x + 72 + i * 58;
      const py = y + 284 + Math.sin(frame * 0.4 + i) * 3;
      ctx.fillText(label, px, py);
      ctx.fillStyle = i % 2 ? "rgba(70, 255, 99, 0.76)" : "rgba(255, 89, 107, 0.76)";
    });
  }

  function drawLevel10PilotsVisual(x, y, w, h, progress, frame) {
    for (let i = 0; i < 3; i++) {
      const cy = y + 96 + i * 92;
      const jitter = Math.round((glitchNoise(frame * 53 + i * 19) - 0.5) * 5 * progress);
      const pulse = 0.45 + Math.sin(state.idleTime * 3.1 + i) * 0.24;
      ctx.strokeStyle = `rgba(255, 89, 107, ${0.28 + pulse * 0.18})`;
      ctx.lineWidth = 1.4;
      roundedRect(x + 52 + jitter, cy - 32, w - 104, 58, 8);
      ctx.stroke();
      ctx.fillStyle = `rgba(70, 255, 99, ${0.08 + pulse * 0.05})`;
      ctx.fillRect(x + 84 + jitter, cy - 9, w - 168, 16);
      ctx.beginPath();
      for (let p = 0; p < 22; p++) {
        const px = x + 84 + jitter + p * 7;
        const wave = Math.sin(frame * 0.28 + p * 0.9 + i) * (p % 5 === 0 ? 12 : 4);
        const py = cy + wave;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(184, 242, 192, ${0.28 + pulse * 0.18})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 89, 107, ${0.2 + pulse * 0.18})`;
      ctx.fillRect(x + w / 2 - 22 + jitter, cy - 2, 44, 3);
      ctx.fillStyle = `rgba(70, 255, 99, ${0.12 + pulse * 0.16})`;
      ctx.fillRect(x + w / 2 - 3 + jitter, cy - 19, 6, 38);
    }
    ctx.fillStyle = "rgba(240, 255, 240, 0.55)";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PILOT SIGNALS INSIDE ACTIVE FRAMES", x + w / 2, y + h - 46);
  }

  function drawLevel10PensVisual(x, y, w, h, progress, frame) {
    const doorX = x + 96;
    const doorY = y + 86;
    ctx.strokeStyle = "rgba(70, 255, 99, 0.54)";
    ctx.lineWidth = 2;
    roundedRect(doorX, doorY, 128, 178, 10);
    ctx.stroke();
    ctx.fillStyle = "rgba(70, 255, 99, 0.13)";
    ctx.fillRect(doorX + 10, doorY + 12, 108, 154);
    ctx.strokeStyle = "rgba(255, 89, 107, 0.72)";
    ctx.beginPath();
    ctx.moveTo(doorX + 32, doorY + 78);
    ctx.lineTo(doorX + 96, doorY + 78);
    ctx.lineTo(doorX + 96, doorY + 126);
    ctx.lineTo(doorX + 32, doorY + 126);
    ctx.closePath();
    ctx.stroke();
    for (let i = 0; i < 15; i++) {
      const px = doorX + 24 + (i % 5) * 20 + Math.sin(frame * 0.2 + i) * 2;
      const py = doorY + 136 + Math.floor(i / 5) * 14;
      ctx.fillStyle = `rgba(240, 255, 240, ${0.3 + progress * 0.48})`;
      ctx.fillRect(px, py, 4, 4);
    }
    ctx.fillStyle = "rgba(255, 89, 107, 0.82)";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LOCKED SECTOR / ACCESS THROUGH RELAYS", x + w / 2, y + h - 50);
  }

  function drawLevel10DefianceVisual(x, y, w, h, progress, frame) {
    const startX = x + 58;
    const startY = y + h - 92;
    const endX = x + w - 58;
    const endY = y + 96;
    ctx.strokeStyle = "rgba(70, 255, 99, 0.64)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(x + 128, y + 278, x + 190, y + 166, endX, endY);
    ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const t = (progress + i * 0.14) % 1;
      const px = startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * 22;
      const py = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 52;
      ctx.fillStyle = i % 2 ? "rgba(255, 89, 107, 0.86)" : "rgba(70, 255, 99, 0.86)";
      ctx.fillRect(px - 4, py - 4, 8, 8);
    }
    ctx.fillStyle = "rgba(240, 255, 240, 0.78)";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SHOP LOOP", startX, startY + 34);
    ctx.fillText("PENS", endX, endY - 24);
    ctx.fillStyle = `rgba(255, 89, 107, ${0.28 + glitchNoise(frame * 29) * 0.44})`;
    ctx.fillRect(x + 60, y + 286, w - 120, 10);
  }

  function drawLevel10CutsceneStaticTransition(cutscene, frame) {
    const transition = cutscene?.transition;
    if (!transition) return;
    const duration = Math.max(0.001, transition.duration || LEVEL10_REVEAL_CUTSCENE_STATIC_TRANSITION_SECONDS);
    const t = clamp01((transition.elapsed || 0) / duration);
    const pulse = Math.sin(t * Math.PI);
    const seed = transition.seed || 0;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#020506";
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 1;
    for (let y = 0; y < H; y += 3) {
      const roll = glitchNoise(seed + frame * 97 + y * 13);
      if (roll < 0.28) continue;
      ctx.fillStyle = roll > 0.72
        ? `rgba(255, 89, 107, ${0.12 + pulse * 0.08})`
        : `rgba(70, 255, 99, ${0.08 + pulse * 0.06})`;
      ctx.fillRect(0, y, W, roll > 0.88 ? 2 : 1);
    }

    for (let i = 0; i < 70; i++) {
      const roll = glitchNoise(seed + frame * 131 + i * 23);
      if (roll < 0.36) continue;
      const yy = Math.floor(glitchNoise(seed + frame * 149 + i * 31) * H);
      const xx = Math.floor((glitchNoise(seed + frame * 157 + i * 37) - 0.22) * W);
      const ww = Math.floor(36 + glitchNoise(seed + frame * 163 + i * 41) * 430);
      const hh = 2 + Math.floor(glitchNoise(seed + frame * 173 + i * 43) * 10);
      ctx.fillStyle = roll > 0.66
        ? `rgba(255, 89, 107, ${0.16 + pulse * 0.18})`
        : `rgba(70, 255, 99, ${0.11 + pulse * 0.14})`;
      ctx.fillRect(xx, yy, ww, hh);
    }

    ctx.globalAlpha = 0.24 + pulse * 0.18;
    ctx.fillStyle = "#000";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);

    ctx.globalAlpha = 0.64 + pulse * 0.24;
    ctx.textAlign = "center";
    ctx.font = "950 15px Inter, sans-serif";
    ctx.fillStyle = "#f0fff0";
    const label = transition.completeOnEnd
      ? transition.label || "STORE LINK RESTORING"
      : transition.direction < 0
      ? transition.label || "SIGNAL ROLLING BACK"
      : transition.label || "SIGNAL RECALIBRATING";
    ctx.fillText(label, W / 2, H / 2 + 5);
    ctx.restore();
  }

  function drawLevel10CutsceneStatic(frame, intensity = 0.5) {
    ctx.save();
    for (let y = 0; y < H; y += 5) {
      const roll = glitchNoise(frame * 83 + y * 17);
      ctx.fillStyle = roll > 0.62
        ? `rgba(255, 89, 107, ${0.018 * intensity})`
        : `rgba(70, 255, 99, ${0.014 * intensity})`;
      ctx.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < 42; i++) {
      if (glitchNoise(frame * 127 + i * 19) < 0.35) continue;
      const yy = Math.floor(glitchNoise(frame * 139 + i * 23) * H);
      const xx = Math.floor((glitchNoise(frame * 151 + i * 29) - 0.5) * 70);
      const ww = Math.floor(30 + glitchNoise(frame * 163 + i * 31) * 210);
      ctx.fillStyle = glitchNoise(frame * 181 + i * 37) > 0.5
        ? `rgba(255, 89, 107, ${0.08 * intensity})`
        : `rgba(70, 255, 99, ${0.07 * intensity})`;
      ctx.fillRect(xx, yy, ww, 2 + Math.floor(glitchNoise(frame * 191 + i * 41) * 8));
    }
    ctx.restore();
  }

  function drawLevel10CutsceneScanlines(alpha = 0.2) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#000";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
    ctx.restore();
  }

  function pointInRect(x, y, rect) {
    return window.FoodAnimalsInteractionRuntime.pointInRect(x, y, rect);
  }

  function hitTestOptionsMenu(pos) {
    return window.FoodAnimalsOptionsMenuRuntime.hitTest(pos, optionsMenuLayout());
  }

  function shopFreezeRect(x, y, w, h) {
    return window.FoodAnimalsSlotCanvas.freezeRect(x, y, w, h);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
  }

  function hitTest(pos) {
    if (state.optionsMenu.open) return hitTestOptionsMenu(pos);
    if (state.activeStory) {
      if (pointInRect(pos.x, pos.y, storyBackButtonRect())) return { area: "story", action: "back" };
      if (pointInRect(pos.x, pos.y, storySkipButtonRect())) return { area: "story", action: "skip" };
      if (pointInRect(pos.x, pos.y, storyAdvanceButtonRect())) return { area: "story", action: "advance" };
      return { area: "story", action: "panel" };
    }
    if (state.level10RevealCutscene) {
      const rects = level10CutsceneNavButtonRects();
      if (pointInRect(pos.x, pos.y, rects.back)) return { area: "level10RevealCutscene", action: "back" };
      if (pointInRect(pos.x, pos.y, rects.continue)) return { area: "level10RevealCutscene", action: "advance" };
      return { area: "level10RevealCutscene", action: "panel" };
    }
    if (state.rebootTransition || state.menuRebootTransition || state.finalVictoryTransition || state.shopReturnStaticTransition || state.phaseTransition) return null;
    if (state.phase === "victoryCutscene") {
      if (victoryCutsceneStage() === "ideal" && pointInRect(pos.x, pos.y, VICTORY_REBOOT_BUTTON)) {
        return { area: "button", index: "victoryReboot" };
      }
      return null;
    }
    if (state.codexOpen) return hitTestCodex(pos);
    if (state.phase === "prep") {
      if (pointInRect(pos.x, pos.y, currentCodexMenuButtonRect())) return { area: "codexButton", index: 0 };
      if (pointInRect(pos.x, pos.y, buttons.shopUpgrade)) return { area: "button", index: "shopUpgrade" };
      if (pointInRect(pos.x, pos.y, buttons.roll)) return { area: "button", index: "roll" };
      if (pointInRect(pos.x, pos.y, buttons.battle)) return { area: "button", index: "battle" };
      const selectedRef = getSelectedRef();
      if (selectedEquipmentTargetRef() && pointInRect(pos.x, pos.y, equipmentSlotRect())) return { area: "equipment", index: 0 };
      if (
        selectedRef &&
        (
          (isUnit(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "board")) ||
          (isTopping(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "itemBench")) ||
          (isDrink(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "itemBench" || selectedRef.area === "drinks"))
        ) &&
        pointInRect(pos.x, pos.y, selectedSellButton(selectedRef))
      ) {
        return { area: "button", index: "sell" };
      }
      if (
        selectedRef &&
        isUnit(selectedRef.entry) &&
        selectedRef.entry.item &&
        (selectedRef.area === "bench" || selectedRef.area === "board") &&
        pointInRect(pos.x, pos.y, selectedDetachButton(selectedRef))
      ) {
        return { area: "button", index: "detach" };
      }
      if (state.drag && canSellDrag(state.drag) && pointInRect(pos.x, pos.y, shopkeeperSellTargetRect())) {
        return { area: "keeperSell", index: 0 };
      }
      for (let i = 0; i < shopSlots.length; i++) {
        const s = shopSlots[i];
        if (!isShopSlotUnlocked(i) && Math.abs(pos.x - s.x) <= SHOP_SLOT_W / 2 && Math.abs(pos.y - s.y) <= SHOP_SLOT_H / 2) {
          return { area: "shopUnlock", index: i };
        }
        if (shopEntryAt(i) && pointInRect(pos.x, pos.y, shopFreezeRect(s.x, s.y, SHOP_SLOT_W, SHOP_SLOT_H))) {
          return { area: "shopFreeze", index: i };
        }
        if (Math.abs(pos.x - s.x) <= SHOP_SLOT_W / 2 && Math.abs(pos.y - s.y) <= SHOP_SLOT_H / 2) return { area: "shop", index: i };
      }
      for (let i = 0; i < boardSlots.length; i++) {
        const s = boardSlots[i];
        if (Math.abs(pos.x - s.x) <= 36 && Math.abs(pos.y - s.y) <= 36) return { area: "board", index: i };
      }
      for (let i = 0; i < drinkSlots.length; i++) {
        const s = drinkSlots[i];
        if (Math.abs(pos.x - s.x) <= DRINK_SLOT_SIZE / 2 && Math.abs(pos.y - s.y) <= DRINK_SLOT_SIZE / 2) return { area: "drinks", index: i };
      }
      for (let i = 0; i < itemBenchSlots.length; i++) {
        const s = itemBenchSlots[i];
        if (Math.abs(pos.x - s.x) <= ITEM_BENCH_SLOT_SIZE / 2 && Math.abs(pos.y - s.y) <= ITEM_BENCH_SLOT_SIZE / 2) return { area: "itemBench", index: i };
      }
      for (let i = 0; i < benchSlots.length; i++) {
        const s = benchSlots[i];
        if (Math.abs(pos.x - s.x) <= 36 && Math.abs(pos.y - s.y) <= 36) return { area: "bench", index: i };
      }
    }
    if (state.phase === "battle" && pointInRect(pos.x, pos.y, buttons.battleSpeed)) {
      return { area: "button", index: "battleSpeed" };
    }
    if (state.phase === "result" && state.hearts <= 0 && pointInRect(pos.x, pos.y, buttons.next)) {
      return { area: "button", index: "next" };
    }
    if (state.phase === "result" && state.lastCombatLedger) {
      const detailsHit = hitTestCombatLedgerDetailsButton(pos);
      if (detailsHit) return detailsHit;
      if (state.combatLedgerReview?.open) {
        const ledgerHit = hitTestCombatLedgerReview(pos, state.lastCombatLedger);
        if (ledgerHit) return ledgerHit;
      }
    }
    if (state.phase === "result" && state.rewardChoices?.length) {
      for (let i = 0; i < state.rewardChoices.length; i++) {
        if (pointInRect(pos.x, pos.y, buttons[`reward${i}`])) return { area: "button", index: `reward${i}` };
      }
    }
    return null;
  }

  function hitTestCombatLedgerDetailsButton(pos) {
    const rect = combatLedgerDetailsButtonRect();
    if (!pointInRect(pos.x, pos.y, rect)) return null;
    return { area: "combatLedger", action: "openDetails" };
  }

  function hitTestCombatLedgerReview(pos, ledger) {
    const rects = combatLedgerReviewRects(ledger);
    if (!pointInRect(pos.x, pos.y, rects.panel)) return null;
    if (pointInRect(pos.x, pos.y, rects.close)) return { area: "combatLedger", action: "closeDetails" };
    if (pointInRect(pos.x, pos.y, rects.prev)) return { area: "combatLedger", action: "prevFrame" };
    if (pointInRect(pos.x, pos.y, rects.next)) return { area: "combatLedger", action: "nextFrame" };
    if (pointInRect(pos.x, pos.y, { x: rects.track.x - 4, y: rects.track.y - 8, w: rects.track.w + 8, h: rects.track.h + 16 })) {
      return { area: "combatLedger", action: "scrubFrame", pct: clamp01((pos.x - rects.track.x) / rects.track.w) };
    }
    if (pointInRect(pos.x, pos.y, rects.mini)) {
      const entries = combatLedgerReplayUnitEntries(ledger, rects.mini);
      for (const entry of entries) {
        const dist = Math.hypot(pos.x - entry.x, pos.y - entry.y);
        if (dist <= entry.r + 9) return { area: "combatLedger", action: "selectUnit", uid: entry.unit.uid };
      }
    }
    if (pointInRect(pos.x, pos.y, rects.log)) {
      const layout = combatLedgerTimelineLayout(rects.log);
      if (pointInRect(pos.x, pos.y, layout.keyChip.rect)) return { area: "combatLedger", action: "toggleBigMoments" };
      for (const chip of layout.typeChips) {
        if (pointInRect(pos.x, pos.y, chip.rect)) return { area: "combatLedger", action: "toggleEventType", typeId: chip.filter.id };
      }
      const rows = combatLedgerVisibleLogRows(ledger, rects.log);
      for (const row of rows.rows) {
        if (pointInRect(pos.x, pos.y, row.rect)) return { area: "combatLedger", action: "selectEvent", event: row.event };
      }
    }
    for (const entry of rects.units) {
      if (pointInRect(pos.x, pos.y, entry.rect)) return { area: "combatLedger", action: "selectUnit", uid: entry.unit.uid };
    }
    for (const entry of rects.filters) {
      if (entry.filter.id !== "all" && !combatLedgerDirectionalFiltersEnabled()) continue;
      if (pointInRect(pos.x, pos.y, entry.rect)) return { area: "combatLedger", action: "setFilter", filter: entry.filter.id };
    }
    return { area: "combatLedger", action: "panel" };
  }

  function applyCombatLedgerReviewHit(hit) {
    const ledger = state.lastCombatLedger;
    const frames = ledger?.frames || [];
    if (!ledger) return;
    if (modalTransitionClosing("ledger")) return;
    if (hit.action === "openDetails") {
      openCombatLedgerReview();
      return;
    }
    if (hit.action === "closeDetails") {
      closeCombatLedgerReview();
      return;
    }
    if (hit.action === "prevFrame") {
      state.combatLedgerReview.frameIndex = Math.max(0, currentCombatLedgerFrameIndex(ledger) - 1);
      syncCombatLedgerFocusedEventToFrame(ledger);
      return;
    }
    if (hit.action === "nextFrame") {
      state.combatLedgerReview.frameIndex = Math.min(frames.length - 1, currentCombatLedgerFrameIndex(ledger) + 1);
      syncCombatLedgerFocusedEventToFrame(ledger);
      return;
    }
    if (hit.action === "scrubFrame" && frames.length) {
      state.combatLedgerReview.frameIndex = Math.round(clamp01(hit.pct || 0) * (frames.length - 1));
      syncCombatLedgerFocusedEventToFrame(ledger);
      return;
    }
    if (hit.action === "selectEvent") {
      const frameIndex = combatLedgerFrameIndexForEvent(ledger, hit.event);
      if (frameIndex >= 0) state.combatLedgerReview.frameIndex = frameIndex;
      focusCombatLedgerEvent(ledger, hit.event, { centerLog: true });
      return;
    }
    if (hit.action === "toggleEventType") {
      toggleCombatLedgerEventTypeFilter(hit.typeId);
      syncCombatLedgerFocusedEventToFrame(ledger);
      return;
    }
    if (hit.action === "toggleBigMoments") {
      toggleCombatLedgerBigMoments();
      syncCombatLedgerFocusedEventToFrame(ledger);
      return;
    }
    if (hit.action === "selectUnit") {
      state.combatLedgerReview.unitUid = hit.uid || "all";
      if (state.combatLedgerReview.unitUid === "all") state.combatLedgerReview.filter = "all";
      state.combatLedgerReview.logScrollOffset = 0;
      state.combatLedgerReview.focusedEventSeq = null;
      return;
    }
    if (hit.action === "setFilter") {
      state.combatLedgerReview.filter = hit.filter || "all";
      state.combatLedgerReview.logScrollOffset = 0;
      state.combatLedgerReview.focusedEventSeq = null;
    }
  }

  function onPointerDown(event) {
    const pos = canvasPoint(event);
    state.pointer = pos;
    const hit = hitTest(pos);
    if (state.optionsMenu.open) {
      applyOptionsMenuHit(hit);
      event.preventDefault();
      return;
    }
    if (state.activeStory) {
      applyStoryHit(hit);
      state.selected = null;
      event.preventDefault();
      return;
    }
    if (state.level10RevealCutscene) {
      if (hit?.action === "advance") advanceLevel10RevealCutscene(false);
      if (hit?.action === "back") retreatLevel10RevealCutscene();
      state.selected = null;
      event.preventDefault();
      return;
    }
    if (modalTransitionClosing("codex") || modalTransitionClosing("ledger")) {
      event.preventDefault();
      return;
    }
    if (!hit) {
      state.selected = null;
      return;
    }
    if (hit.area === "button") {
      if (hit.index === "shopUpgrade") upgradeShop();
      if (hit.index === "roll") refreshShop(false);
      if (hit.index === "battle") startBattle();
      if (hit.index === "battleSpeed") cycleBattleSpeed();
      if (hit.index === "next") continueFromResult();
      if (hit.index === "victoryReboot") rebootFromVictoryCutscene();
      if (String(hit.index).startsWith("reward")) applyRewardChoice(Number(String(hit.index).slice(6)));
      if (hit.index === "sell") {
        const selectedRef = getSelectedRef();
        if (selectedRef && isItem(selectedRef.entry)) sellSelectedItem();
        else sellSelectedUnit();
      }
      if (hit.index === "detach") detachSelectedItem();
      return;
    }
    if (hit.area === "combatLedger") {
      applyCombatLedgerReviewHit(hit);
      playCombatLedgerReviewActionSfx(hit.action);
      state.selected = null;
      event.preventDefault();
      return;
    }
    if (hit.area === "codexButton") {
      openCodexOverlay();
      event.preventDefault();
      return;
    }
    if (hit.area === "codexTab") {
      const tab = CODEX_TABS[hit.index];
      if (tab) {
        state.codexTab = tab.id;
        if (tab.id !== "food") state.codexSelectedFormTier = 1;
        state.codexSelectedItemTier = 1;
        state.codexSelectedId = state.codexSelectedId || CATALOG[0]?.id || null;
        state.codexSelectedToppingId = state.codexSelectedToppingId || codexToppings()[0]?.id || null;
        state.codexSelectedDrinkId = state.codexSelectedDrinkId || codexDrinks()[0]?.id || null;
        syncCodexSelectionToVisibleEntry();
        resetCodexPreviewView();
        state.message = copy(["ui", "panels", tab.id], tab.label);
        playGameSfx("ui-confirm", { volume: 0.45 });
      }
      event.preventDefault();
      return;
    }
    if (hit.area === "codexFilter") {
      setCodexFilter(hit.key, hit.value);
      resetCodexPreviewView();
      playGameSfx("ui-confirm", { volume: 0.38 });
      event.preventDefault();
      return;
    }
    if (hit.area === "codexEntry") {
      const entry = codexEntries()[hit.index];
      if (state.codexTab === "toppings") {
        state.codexSelectedToppingId = entry?.id || state.codexSelectedToppingId;
        state.codexSelectedItemTier = 1;
      } else if (state.codexTab === "drinks") {
        state.codexSelectedDrinkId = entry?.id || state.codexSelectedDrinkId;
        state.codexSelectedItemTier = 1;
      } else {
        state.codexSelectedId = entry?.id || state.codexSelectedId;
        state.codexSelectedFormTier = 1;
      }
      resetCodexPreviewView();
      state.message = entry ? (state.codexTab === "food" ? displayCatalogShort(entry) : itemDisplayShort(entry)) : copy("ui.panels.foodMenu", "Food menu");
      playGameSfx("ui-hover", { volume: 0.42 });
      event.preventDefault();
      return;
    }
    if (hit.area === "codexForm") {
      const animal = currentCodexEntry();
      const maxTier = Math.min(4, animal?.forms?.length || 1);
      if (hit.index >= maxTier) {
        state.codexSelectedFormTier = 0;
        state.message = realityBroken() ? "Wreck" : "Meal";
        resetCodexPreviewView();
        event.preventDefault();
        return;
      }
      state.codexSelectedFormTier = Math.max(1, Math.min(maxTier, hit.index + 1));
      const form = animal.forms?.[state.codexSelectedFormTier - 1];
      resetCodexPreviewView();
      state.message = animal ? displayCatalogForm(animal, state.codexSelectedFormTier, "short") : copy("ui.panels.foodMenu", "Food menu");
      playGameSfx("ui-confirm", { volume: 0.42 });
      event.preventDefault();
      return;
    }
    if (hit.area === "codexItemForm") {
      const entry = currentCodexEntry();
      state.codexSelectedItemTier = Math.max(1, Math.min(MAX_ITEM_TIER, hit.index + 1));
      resetCodexPreviewView();
      state.message = `${entry ? itemDisplayShort(entry) : "Item"} Lv ${state.codexSelectedItemTier}`;
      playGameSfx("ui-confirm", { volume: 0.42 });
      event.preventDefault();
      return;
    }
    if (hit.area === "codexClose") {
      closeCodexOverlay();
      event.preventDefault();
      return;
    }
    if (hit.area === "codex") {
      event.preventDefault();
      return;
    }
    if (hit.area === "shopFreeze") {
      toggleShopFreeze(hit.index);
      event.preventDefault();
      return;
    }
    if (hit.area === "shopUnlock") {
      purchaseShopSlot(hit.index);
      event.preventDefault();
      return;
    }
    if (hit.area === "equipment") {
      startEquipmentDrag(pos);
      if (state.drag) canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (hit.area === "shop") {
      startShopDrag(hit.index, pos);
      if (state.drag) canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (hit.area === "bench" || hit.area === "itemBench" || hit.area === "board" || hit.area === "drinks") {
      if (state[hit.area][hit.index]) {
        startUnitDrag(hit.area, hit.index, pos);
        if (state.drag) canvas.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } else {
        selectFrom(hit.area, hit.index);
      }
    }
  }

  function onPointerMove(event) {
    const pos = canvasPoint(event);
    state.pointer = pos;
    if (state.optionsMenu.open) {
      if (state.optionsMenu.dragSlider) setOptionSliderFromPoint(state.optionsMenu.dragSlider, pos.x);
      state.hover = null;
      event.preventDefault();
      return;
    }
    if (state.activeStory) {
      state.hover = null;
      event.preventDefault();
      return;
    }
    const hit = hitTest(pos);
    if (state.drag) {
      updateDrag(pos, hit);
      event.preventDefault();
      return;
    }
    state.hover = hit && hit.area !== "button" ? hit : null;
  }

  function onPointerUp(event) {
    if (state.optionsMenu.open) {
      state.optionsMenu.dragSlider = null;
      event.preventDefault();
      return;
    }
    if (!state.drag) return;
    const pos = canvasPoint(event);
    state.pointer = pos;
    const hit = hitTest(pos);
    finishDrag(hit);
    state.hover = hit && hit.area !== "button" ? hit : null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function onPointerCancel(event) {
    state.pointer = null;
    if (state.optionsMenu.open) {
      state.optionsMenu.dragSlider = null;
      return;
    }
    if (!state.drag) return;
    state.drag = null;
    state.message = "Cancelled";
    canvas.releasePointerCapture?.(event.pointerId);
  }

  function onPointerLeave() {
    state.pointer = null;
    state.hover = null;
    if (state.optionsMenu.open) state.optionsMenu.dragSlider = null;
  }

  function onWheel(event) {
    if (state.optionsMenu.open) {
      event.preventDefault();
      return;
    }
    if (state.activeStory) {
      event.preventDefault();
      return;
    }
    if (!(state.phase === "result" && state.lastCombatLedger && state.combatLedgerReview?.open)) return;
    const pos = canvasPoint(event);
    const rects = combatLedgerReviewRects(state.lastCombatLedger);
    if (!pointInRect(pos.x, pos.y, rects.log)) return;
    scrollCombatLedgerLog(event.deltaY < 0 ? 3 : -3);
    playThrottledGameSfx("ledger-scroll", "ui-hover", { volume: 0.08, rate: event.deltaY < 0 ? 1.06 : 0.94 }, 0.12);
    event.preventDefault();
  }

  function startShopDrag(index, pos) {
    const unit = shopEntryAt(index);
    const equipmentTarget = selectedEquipmentTargetRef();
    if (!isShopSlotUnlocked(index)) {
      state.message = "Open slot first";
      playGameSfx("invalid");
      return;
    }
    if (!unit) {
      state.message = "Empty shop";
      playGameSfx("invalid");
      return;
    }
    const cost = purchaseCost(unit, index);
    if (state.gold < cost) {
      state.selected = { area: "shop", index };
      state.message = `Need ${currencyTerm({ lower: true })}`;
      playGameSfx("invalid");
      return;
    }
    if (isItem(unit) && !hasShopItemTarget(unit)) {
      state.selected = { area: "shop", index };
      state.message = "No item target";
      playGameSfx("invalid");
      return;
    }
    if (!(isTopping(unit) && equipmentTarget)) state.selected = null;
    state.drag = {
      ...window.FoodAnimalsDragDropRuntime.createDrag("shop", index, unit, pos, { equipmentTarget }),
    };
    state.message = window.FoodAnimalsDragDropRuntime.feedbackMessage(unit, {
      drink: drinkTerm({ lower: true }),
      horror: realityBroken(),
      isDrink,
      isItem,
      kind: "shopStart",
    });
    playGameSfx("pickup", { volume: 0.72 });
  }

  function startUnitDrag(area, index, pos) {
    const unit = state[area]?.[index];
    if (!unit) return;
    const equipmentTarget = selectedEquipmentTargetRef();
    if (!(isTopping(unit) && equipmentTarget)) state.selected = { area, index };
    state.drag = {
      ...window.FoodAnimalsDragDropRuntime.createDrag(area, index, unit, pos, { equipmentTarget }),
    };
    state.message = window.FoodAnimalsDragDropRuntime.feedbackMessage(unit, {
      area,
      drink: drinkTerm({ lower: true }),
      horror: realityBroken(),
      isDrink,
      isItem,
      kind: "unitStart",
    });
    playGameSfx("pickup", { volume: 0.72 });
  }

  function startEquipmentDrag(pos) {
    const source = selectedEquipmentTargetRef();
    if (!source?.unit?.item) {
      state.message = `Drop ${toppingTerm({ lower: true })} here`;
      playGameSfx("invalid");
      return;
    }
    state.drag = {
      ...window.FoodAnimalsDragDropRuntime.createDrag("equipment", 0, source.unit.item, pos, {
        equipmentTarget: { area: source.area, index: source.index },
      }),
    };
    state.message = `Drag ${toppingTerm({ lower: true })} out`;
    playGameSfx("pickup", { volume: 0.72 });
  }

  function updateDrag(pos, hit) {
    window.FoodAnimalsDragDropRuntime.updateDrag(state.drag, pos, hit, {
      canDropDrag,
      isPotentialDropTarget,
    });
    state.hover = state.drag.over;
  }

  function finishDrag(hit) {
    const drag = state.drag;
    state.drag = null;
    if (!drag) return;
    if (window.FoodAnimalsDragDropRuntime.clickWithoutMove(drag, hit)) {
      if (drag.area === "equipment") {
        const source = selectedEquipmentTargetRef(drag);
        if (source?.unit?.item) {
          state.selected = { area: source.area, index: source.index };
          state.message = "Equipped";
        }
        return;
      }
      if (drag.area === "bench" || drag.area === "itemBench" || drag.area === "board" || drag.area === "shop" || drag.area === "drinks") {
        selectFrom(drag.area, drag.index);
        if (state.selected) state.message = "Inspecting";
      } else {
        state.message = "Drop on bench";
      }
      return;
    }
    if (drag.area === "shop") {
      if (!hit || !isPotentialDropTarget(drag, hit.area, hit.index)) {
        state.message = window.FoodAnimalsDragDropRuntime.feedbackMessage(drag.unit, {
          drink: drinkTerm({ lower: true }),
          horror: realityBroken(),
          isDrink,
          isItem,
          kind: "shopDrop",
        });
        return;
      }
      if (isItem(drag.unit) && isUnit(state[hit.area]?.[hit.index])) {
        buyShopItemToAnimal(drag.index, hit.area, hit.index);
        return;
      }
      if (hit.area === "equipment") {
        buyShopItemToEquipment(drag.index);
        return;
      }
      buyShopToSlot(drag.index, hit.area, hit.index);
      return;
    }
    if (hit?.area === "keeperSell") {
      sellDraggedEntry(drag);
      return;
    }
    if (!hit || !isPotentialDropTarget(drag, hit.area, hit.index)) {
      state.message = window.FoodAnimalsDragDropRuntime.feedbackMessage(drag.unit, {
        area: drag.area,
        drink: drinkTerm({ lower: true }),
        horror: realityBroken(),
        isDrink,
        isItem,
      });
      return;
    }
    if (!canDropDrag(drag, hit.area, hit.index)) {
      state.message = isItem(drag.unit) ? "Target unavailable" : "Spot full";
      return;
    }
    if (hit.area === "equipment") {
      attachItemFromBenchToEquipment(drag.index, drag.area, drag);
      return;
    }
    if (drag.area === "equipment" && (hit.area === "bench" || hit.area === "board") && isUnit(state[hit.area]?.[hit.index])) {
      moveEquippedItemToAnimal(hit.area, hit.index);
      return;
    }
    if (drag.area === "equipment" && isItemStorageArea(hit.area)) {
      moveEquippedItemToStorage(hit.area, hit.index);
      return;
    }
    if (isTopping(drag.unit) && isUnit(state[hit.area]?.[hit.index])) {
      attachItemFromStorage(drag.area, drag.index, hit.area, hit.index);
      return;
    }
    if (isItemStorageArea(drag.area) && isItemStorageArea(hit.area)) {
      moveUnitToOpenSlot(drag.area, drag.index, hit.area, hit.index);
      return;
    }
    moveUnitToOpenSlot(drag.area, drag.index, hit.area, hit.index);
  }

  function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (state.optionsMenu.open) {
      if (event.key === "Escape") {
        closeOptionsMenu();
        event.preventDefault();
        return;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const order = ["resume", "save", "exit", "music", "sfx"];
        const current = Math.max(0, order.indexOf(state.optionsMenu.selected));
        const delta = event.key === "ArrowUp" ? -1 : 1;
        const nextSelected = order[(current + delta + order.length) % order.length];
        state.optionsMenu.selected = nextSelected;
        playGameSfx("ui-hover", { volume: 0.24 });
        event.preventDefault();
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const slider = state.optionsMenu.selected === "sfx" ? "sfx" : state.optionsMenu.selected === "music" ? "music" : null;
        if (slider) {
          setOptionSliderValue(slider, optionSliderValue(slider) + (event.key === "ArrowRight" ? 1 : -1));
          playGameSfx("ui-hover", { volume: 0.22 });
        }
        event.preventDefault();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        const selected = state.optionsMenu.selected || "resume";
        if (selected === "resume") closeOptionsMenu();
        else if (selected === "save") {
          saveCurrentRun();
        } else if (selected === "exit") {
          exitToMainMenuWithSave();
        }
        event.preventDefault();
        return;
      }
      event.preventDefault();
      return;
    }
    if (state.activeStory) {
      if (event.key === "ArrowLeft" || event.key === "Backspace") {
        applyStoryHit({ area: "story", action: "back" });
        event.preventDefault();
      } else if (event.key === "Escape") {
        applyStoryHit({ area: "story", action: "skip" });
        event.preventDefault();
      } else if (event.key === "Enter" || event.key === " ") {
        applyStoryHit({ area: "story", action: "advance" });
        event.preventDefault();
      }
      return;
    }
    if (state.level10RevealCutscene) {
      if (key === "f") {
        if (!document.fullscreenElement) canvas.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (event.key === "Escape") {
        advanceLevel10RevealCutscene(true);
      } else if (event.key === "ArrowLeft" || event.key === "Backspace") {
        retreatLevel10RevealCutscene();
      } else if (event.key === "Enter" || event.key === " ") {
        advanceLevel10RevealCutscene(false);
      }
      event.preventDefault();
      return;
    }
    if (state.rebootTransition || state.menuRebootTransition || state.finalVictoryTransition || state.shopReturnStaticTransition || state.phaseTransition || state.phase === "victoryCutscene") {
      if (event.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) canvas.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (!state.menuRebootTransition && state.phase === "victoryCutscene" && victoryCutsceneStage() === "ideal" && (event.key === "Enter" || key === "r")) {
        rebootFromVictoryCutscene();
      }
      event.preventDefault();
      return;
    }
    if (key === "f") {
      if (!document.fullscreenElement) canvas.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
    if (event.key === "Escape") {
      if (state.codexOpen) {
        closeCodexOverlay();
        event.preventDefault();
        return;
      }
      if (state.phase === "result" && state.combatLedgerReview?.open) {
        closeCombatLedgerReview();
        event.preventDefault();
        return;
      }
      if (openOptionsMenu()) {
        event.preventDefault();
        return;
      }
      state.selected = null;
    }
    if (state.codexOpen) {
      event.preventDefault();
      return;
    }
    if (event.key === " " && state.phase === "prep") {
      event.preventDefault();
      startBattle();
    }
    if (key === "r" && state.phase === "prep") {
      refreshShop(false);
    }
    if (key === "u" && state.phase === "prep") {
      upgradeShop();
    }
    if (key === "s" && state.phase === "battle") {
      cycleBattleSpeed();
    }
    if (state.phase === "result" && state.lastCombatLedger && state.combatLedgerReview?.open && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      const delta = event.key === "ArrowLeft" ? -1 : 1;
      const frames = state.lastCombatLedger.frames || [];
      state.combatLedgerReview.frameIndex = clamp(currentCombatLedgerFrameIndex(state.lastCombatLedger) + delta, 0, Math.max(0, frames.length - 1));
      syncCombatLedgerFocusedEventToFrame(state.lastCombatLedger);
      playThrottledGameSfx("ledger-frame", "ui-hover", { volume: 0.14, rate: delta < 0 ? 0.92 : 1.06 }, 0.07);
      event.preventDefault();
      return;
    }
    if (state.phase === "result" && state.lastCombatLedger && state.combatLedgerReview?.open && ["PageUp", "PageDown", "Home", "End"].includes(event.key)) {
      const rect = combatLedgerReviewRects(state.lastCombatLedger).log;
      const events = combatLedgerFilteredEvents(state.lastCombatLedger);
      const visibleRows = combatLedgerLogVisibleRows(rect);
      if (event.key === "PageUp") scrollCombatLedgerLog(visibleRows);
      if (event.key === "PageDown") scrollCombatLedgerLog(-visibleRows);
      if (event.key === "Home") setCombatLedgerLogScrollOffset(Math.max(0, events.length - visibleRows));
      if (event.key === "End") setCombatLedgerLogScrollOffset(0);
      playThrottledGameSfx("ledger-scroll", "ui-hover", { volume: 0.1, rate: event.key === "PageUp" || event.key === "Home" ? 1.06 : 0.94 }, 0.1);
      event.preventDefault();
      return;
    }
    if (key === "h") {
      cycleRealityThemeOverride();
    }
  }

  function gameLoop(now) {
    const dt = Math.min(0.05, ((now || 0) - state.lastTime) / 1000 || 1 / 60);
    state.lastTime = now || 0;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
  }

  function renderGameToText() {
    const rarityWeights = currentShopRarityWeights();
    const rarityOdds = shopRarityOdds();
    const enemyPreview = state.phase === "prep" ? ensureEnemyPreview() : state.enemyPreview?.units || [];
    const shownBattle = visibleBattle();
    const enemyDrinks = shownBattle ? shownBattle.enemyDrinks || [] : enemyPreviewDrinks();
    const moldState = shownBattle ? moldStateText(shownBattle) : null;
    const battle = shownBattle
      ? {
          elapsed: Number(shownBattle.elapsed.toFixed(2)),
          arena: shownBattle.arena,
          enemyPlan: shownBattle.enemyPlan,
          mold: moldState,
          ...(realityBroken() ? { radiation: moldState } : {}),
          traitLevels: shownBattle.traitLevels,
          allies: shownBattle.allies
            .filter((u) => !u.dead)
            .map((u) => unitText(u, true)),
          enemies: shownBattle.enemies
            .filter((u) => !u.dead)
            .map((u) => unitText(u, true)),
          allyDrinks: (shownBattle.allyDrinks || []).map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
          enemyDrinks: (shownBattle.enemyDrinks || []).map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
          attacks: shownBattle.attacks.map((attack) => ({
            from: attack.from,
            to: attack.to,
            sourceSide: attack.sourceSide,
            kind: attack.kind || "damage",
            particleType: attack.particleType,
            particleSrc: attack.particleSrc || particleSpriteSrc(attack.particleSprite || "attack", attack.particleType, attack.particleTier || 1),
            progress: Number(clamp01(1 - attack.t / (attack.duration || ATTACK_ANIMATION_SECONDS)).toFixed(2)),
            spin: Number((attack.spin || 0).toFixed(2)),
            rotation: Number(((attack.rotationStart || 0) + (attack.spin || 0) * clamp01(1 - attack.t / (attack.duration || ATTACK_ANIMATION_SECONDS))).toFixed(2)),
          })),
          drinkTosses: (shownBattle.drinkTosses || []).map((toss) => ({
            id: toss.id,
            name: toss.name,
            kind: toss.kind,
            side: toss.side,
            slotIndex: toss.slotIndex,
            to: toss.to,
            progress: Number(clamp01(1 - toss.t / (toss.duration || DRINK_TOSS_ANIMATION_SECONDS)).toFixed(2)),
          })),
        }
      : null;
    const musicTrack = currentGameMusicTrack();
    return JSON.stringify({
      coordinateSystem: "origin top-left; x increases right; y increases down",
      runMode: state.runMode,
      rng: {
        seed: rngState.seed,
        calls: rngState.calls,
      },
      phase: state.phase,
      round: state.round,
      gold: state.gold,
      hearts: state.hearts,
      message: state.message,
      music: {
        scene: gameMusicSceneKey(),
        trackId: musicTrack?.id || null,
        label: musicTrack?.label || null,
        src: musicTrack?.src || null,
        armed: gameMusic.armed,
        blocked: gameMusic.blocked,
        volume: Number(gameMusicVolume().toFixed(3)),
        setting: optionSliderValue("music"),
      },
      sfx: {
        setting: optionSliderValue("sfx"),
        volume: Number(gameSfxVolume().toFixed(3)),
        armed: gameSfx.armed,
      },
      optionsMenu: {
        open: Boolean(state.optionsMenu.open),
        selected: state.optionsMenu.selected,
        savedAt: state.optionsMenu.savedAt,
        music: optionSliderValue("music"),
        sfx: optionSliderValue("sfx"),
        transition: modalTransition("options") ? {
          phase: modalTransition("options").phase,
          progress: Number(clamp01((modalTransition("options").elapsed || 0) / Math.max(0.001, modalTransition("options").duration || MODAL_TRANSITION_SECONDS)).toFixed(2)),
        } : null,
      },
      storageFlags: {
        gameCompletedKey: GAME_COMPLETED_STORAGE_KEY,
        gameCompleted: (() => {
          try {
            return window.localStorage.getItem(GAME_COMPLETED_STORAGE_KEY) === "1";
          } catch {
            return false;
          }
        })(),
        horrorRevealedKey: HORROR_REVEALED_STORAGE_KEY,
        horrorRevealed: (() => {
          try {
            return window.localStorage.getItem(HORROR_REVEALED_STORAGE_KEY) === "1";
          } catch {
            return false;
          }
        })(),
        horrorMenuUnlocked: (() => {
          try {
            return window.localStorage.getItem(HORROR_MENU_UNLOCK_STORAGE_KEY) === "1";
          } catch {
            return false;
          }
        })(),
      },
      story: state.activeStory ? {
        active: true,
        id: state.activeStory.id,
        title: state.activeStory.title,
        index: state.activeStory.index || 0,
        total: state.activeStory.beats?.length || 0,
        skipConfirm: Boolean(state.activeStory.skipConfirm),
        transition: state.activeStory.transition ? {
          phase: state.activeStory.transition.phase,
          elapsed: Number((state.activeStory.transition.elapsed || 0).toFixed(3)),
          duration: Number((state.activeStory.transition.duration || STORY_TRANSITION_SECONDS).toFixed(3)),
          alpha: Number(storyTransitionAlpha(state.activeStory).toFixed(3)),
        } : null,
        beatTransition: state.activeStory.beatTransition ? {
          elapsed: Number((state.activeStory.beatTransition.elapsed || 0).toFixed(3)),
          duration: Number((state.activeStory.beatTransition.duration || STORY_BEAT_TRANSITION_SECONDS).toFixed(3)),
          alpha: Number(storyBeatTransitionVisual(state.activeStory).alpha.toFixed(3)),
          direction: state.activeStory.beatTransition.direction || 1,
        } : null,
        beat: currentStoryBeat(),
        backgroundSrc: currentStoryBackgroundSrc(state.activeStory),
        defaultBackgroundSrc: state.activeStory.backgroundSrc || null,
        portraitSrc: storySpeakerPortraitSrc(currentStoryBeat()?.speaker, state.activeStory),
        tabsPortraitSrc: storySpeakerPortraitSrc("Tabs", state.activeStory),
        seen: [...state.seenStoryMilestones],
      } : {
        active: false,
        seen: [...state.seenStoryMilestones],
      },
      cutscene: state.level10RevealCutscene ? {
        active: true,
        id: state.level10RevealCutscene.id,
        source: state.level10RevealCutscene.source || "level10Reveal",
        elapsed: Number((state.level10RevealCutscene.elapsed || 0).toFixed(2)),
        total: Number((state.level10RevealCutscene.total || LEVEL10_REVEAL_CUTSCENE_SECONDS).toFixed(2)),
        shotIndex: level10RevealCutsceneShotIndex(state.level10RevealCutscene),
        transition: state.level10RevealCutscene.transition ? {
          elapsed: Number((state.level10RevealCutscene.transition.elapsed || 0).toFixed(3)),
          duration: Number((state.level10RevealCutscene.transition.duration || LEVEL10_REVEAL_CUTSCENE_STATIC_TRANSITION_SECONDS).toFixed(3)),
          direction: state.level10RevealCutscene.transition.direction || 1,
          completeOnEnd: Boolean(state.level10RevealCutscene.transition.completeOnEnd),
          label: state.level10RevealCutscene.transition.label || null,
        } : null,
        shot: level10RevealCutsceneShot(state.level10RevealCutscene),
      } : { active: false },
      reality: {
        broken: realityBroken(),
        copyTheme: currentCopyThemeId(),
        copyThemeLabel: copy("meta.label", "Cozy illusion"),
        storyBroken: Boolean(state.realityBroken),
        override: state.realityOverride,
        breakRound: REALITY_BREAK_ROUND,
        breakTimer: Number((state.realityBreakTimer || 0).toFixed(2)),
        postGiraffeHorrorTransition: state.postGiraffeHorrorTransition ? {
          active: true,
          source: state.postGiraffeHorrorTransition.source || "giraffeDefeat",
          elapsed: Number((state.postGiraffeHorrorTransition.elapsed || 0).toFixed(2)),
          duration: state.postGiraffeHorrorTransition.duration || POST_GIRAFFE_HORROR_ITEM_TRANSITION_SECONDS,
          clearAt: state.postGiraffeHorrorTransition.clearAt || POST_GIRAFFE_HORROR_ITEM_TRANSITION_CLEAR_SECONDS,
          style: "individual-items-defeated-enemies-and-hud-glitch-then-retain-horror",
        } : { active: false },
        shopReturnStaticTransition: state.shopReturnStaticTransition ? {
          active: true,
          source: state.shopReturnStaticTransition.source || "horrorRewardReturn",
          theme: state.shopReturnStaticTransition.theme || "horror",
          elapsed: Number((state.shopReturnStaticTransition.elapsed || 0).toFixed(2)),
          duration: state.shopReturnStaticTransition.duration || HORROR_SHOP_RETURN_STATIC_SECONDS,
          switchAt: Number((state.shopReturnStaticTransition.switchAt || 0).toFixed(2)),
          screenChanged: Boolean(state.shopReturnStaticTransition.screenChanged),
          style: state.shopReturnStaticTransition.theme === "cozy"
            ? "cozy-awning-food-particle-fade-out-switch-fade-in"
            : "fade-out-static-then-switch-to-shop-then-fade-in",
        } : { active: false },
        phaseTransition: state.phaseTransition ? {
          active: true,
          type: state.phaseTransition.type,
          elapsed: Number((state.phaseTransition.elapsed || 0).toFixed(2)),
          duration: Number((state.phaseTransition.duration || 0).toFixed(2)),
          progress: Number(clamp01((state.phaseTransition.elapsed || 0) / Math.max(0.001, state.phaseTransition.duration || 0.001)).toFixed(2)),
        } : { active: false },
        modalTransitions: Object.fromEntries(Object.entries(state.modalTransitions || {}).map(([id, transition]) => [id, {
          phase: transition.phase,
          progress: Number(clamp01((transition.elapsed || 0) / Math.max(0.001, transition.duration || MODAL_TRANSITION_SECONDS)).toFixed(2)),
          alpha: Number(modalTransitionVisual(id).alpha.toFixed(2)),
        }])),
        shopSlotTransitions: state.shopSlotTransitions
          .map((transition, index) => transition ? {
            index,
            type: transition.type,
            progress: Number(clamp01(Math.max(0, transition.elapsed || 0) / Math.max(0.001, transition.duration || SHOP_SLOT_TRANSITION_SECONDS)).toFixed(2)),
          } : null)
          .filter(Boolean),
        rebootTransition: state.rebootTransition ? {
          active: true,
          elapsed: Number((state.rebootTransition.elapsed || 0).toFixed(2)),
          duration: state.rebootTransition.duration,
          resetDone: Boolean(state.rebootTransition.resetDone),
          source: state.rebootTransition.source || "defeat",
        } : { active: false },
        menuRebootTransition: state.menuRebootTransition ? {
          active: true,
          elapsed: Number((state.menuRebootTransition.elapsed || 0).toFixed(2)),
          duration: state.menuRebootTransition.duration,
          navigated: Boolean(state.menuRebootTransition.navigated),
          source: "finalVictoryReboot",
          style: "static-fade-out-then-menu-static-fade-in",
        } : { active: false },
        finalVictoryTransition: state.finalVictoryTransition ? {
          active: true,
          elapsed: Number((state.finalVictoryTransition.elapsed || 0).toFixed(2)),
          duration: state.finalVictoryTransition.duration,
          holdDuration: state.finalVictoryTransition.holdDuration || 0,
          staticElapsed: Number(Math.max(0, (state.finalVictoryTransition.elapsed || 0) - (state.finalVictoryTransition.holdDuration || 0)).toFixed(2)),
          resetAt: state.finalVictoryTransition.resetAt,
          resetDone: Boolean(state.finalVictoryTransition.resetDone),
        } : { active: false },
        victoryCutscene: state.victoryCutscene ? {
          active: true,
          elapsed: Number((state.victoryCutscene.elapsed || 0).toFixed(2)),
          stage: victoryCutsceneStage(state.victoryCutscene.elapsed || 0),
          roundCleared: state.victoryCutscene.roundCleared,
          backgroundSrc: state.victoryCutscene.backgroundSrc,
          idealBackgroundSrc: state.victoryCutscene.idealBackgroundSrc,
          message: state.victoryCutscene.message,
          rebootButton: victoryCutsceneStage(state.victoryCutscene.elapsed || 0) === "ideal" ? { ...VICTORY_REBOOT_BUTTON } : null,
        } : { active: false },
        simulationArtifacts: realityBroken(),
        revealDistortion: realityRevealDistortionState().active ? {
          active: true,
          intensity: Number(realityRevealDistortionState().intensity.toFixed(2)),
          remaining: Number(realityRevealDistortionState().remaining.toFixed(2)),
          style: "reboot-static-screen-tear",
        } : { active: false },
        assetIllusionBleed: realityBroken()
          ? { enabled: illusionBleedAllowed({ allowCombat: true }), frame: illusionBleedFrame(), rate: "sequenced_slightly_more_frequent_combat_visual", sequenceSeconds: { preStatic: 0.5, flash: 0.3, postStatic: 0.5 }, affectedAreas: ["shopkeeper", "stall", "hud", "shop", "tiles", "foodAnimals", "drinks", "toppings", "combatFoodAnimals", "combatDrinks", "combatTiles"], combatTileLayer: state.phase === "battle" ? "clipped-under-units" : "normal-ui-layer" }
          : { enabled: false, frame: null, rate: "off", affectedAreas: [] },
        codexMenuSignBleed: codexMenuSignBleedPhase(),
        shopStallBleed: shopStallBleedPhase(),
        shopLockBleed: shopSlots.map((_, index) => shopLockBleedPhase(index)),
        combatTileBleed: combatTileBleedText(),
        malfunctionBanner: realityBroken() && !(state.realityBreakTimer > 0) ? { x: 386, y: 3, w: 248, h: 58, effects: true } : null,
        shopkeeperSrc: currentShopkeeperSrc(),
        stallSrc: currentShopkeeperStallSrc(),
        backgroundSrc: realityBroken() ? themedArena(currentArena()).backgroundSrc : (currentArena()?.backgroundSrc || BACKGROUND_SRC),
        fallbackBackgroundSrc: REALITY_BACKGROUND_SRC,
        battleFieldSrc: currentBattleFieldBgSrc(),
        combatLedgerPanelSrc: currentCombatLedgerPanelBgSrc(),
        combatLedgerInternalSrcs: {
          mini: currentCombatLedgerMiniBgSrc(),
          participants: currentCombatLedgerParticipantsBgSrc(),
          log: currentCombatLedgerLogBgSrc(),
        },
        shopSlotSrc: currentShopSlotBgSrc(),
        shopLockSrc: currentShopLockClothBgSrc(),
        teamIntelSrc: currentTeamIntelBgSrc(),
        foodMenuSrc: currentFoodMenuBgSrc(),
        codexMenuButtonSrc: currentCodexMenuButtonSrc(),
        bannerBoardSrc: REALITY_BANNER_BOARD_SRC,
        uiIconAtlasSrc: currentUiIconAtlasSrc(),
        benchSlotSrc: currentBenchSlotBgSrc(),
        boardPlateSrc: currentBoardPlateSlotSrc(),
        drinkCoasterSrc: currentDrinkCoasterSlotSrc(),
        toppingStorageSrc: currentToppingStorageSlotSrc(),
        statusBoardSrcs: {
          course: currentStatusBoardSrc("course"),
          coins: currentStatusBoardSrc("coins"),
          health: currentStatusBoardSrc("health"),
        },
        commandSignSrcs: {
          rig: REALITY_COMMAND_RIG_SRC,
          scan: REALITY_COMMAND_SCAN_SRC,
          deploy: REALITY_COMMAND_DEPLOY_SRC,
          speed: REALITY_COMMAND_SPEED_SRC,
          reboot: REALITY_COMMAND_REBOOT_SRC,
        },
      },
      battleSpeed: {
        value: currentBattleSpeed(),
        label: battleSpeedLabel(),
        index: state.battleSpeedIndex,
        options: battleSpeedOptions(),
        bossRestricted: bossBattleSpeedRestricted(),
      },
      particles: {
        count: state.particles.length,
        foodCount: state.particles.filter((particle) => particle.foodParticles).length,
        samples: state.particles.slice(0, 8).map((particle) => ({
          x: Number(particle.x.toFixed(1)),
          y: Number(particle.y.toFixed(1)),
          life: Number(particle.life.toFixed(2)),
          particleType: particle.particleType || null,
          imageSrc: particle.imageSrc || null,
          food: Boolean(particle.foodParticles),
        })),
      },
      arena: arenaText(),
      arenas: ARENAS.map((arena) => arenaText(arena)),
      arenaRewards: {
        keepArenaNextRound: state.keepArenaNextRound,
        pendingRows: arenaRewardPendingRows(),
        held: state.arenaHoldNotice ? {
          arenaId: state.arenaHoldNotice.arenaId,
          arenaShort: state.arenaHoldNotice.arenaShort,
        } : null,
        scout: state.arenaScout ? {
          arenaId: state.arenaScout.arenaId,
          arenaShort: state.arenaScout.arenaShort,
          traitIds: [...(state.arenaScout.traitIds || [])],
          shopsRemaining: state.arenaScout.shopsRemaining || 0,
        } : null,
        prepBuff: state.arenaPrepBuff ? {
          arenaId: state.arenaPrepBuff.arenaId,
          arenaShort: state.arenaPrepBuff.arenaShort,
          traitIds: [...(state.arenaPrepBuff.traitIds || [])],
          duration: state.arenaPrepBuff.duration,
          shieldPct: state.arenaPrepBuff.shieldPct,
          hastePct: state.arenaPrepBuff.hastePct,
          attackPct: state.arenaPrepBuff.attackPct,
        } : null,
      },
      economy: ECONOMY,
      traits: Object.fromEntries(Object.entries(TRAITS).map(([id, trait]) => [id, {
        label: traitInfo(id).label,
        short: traitInfo(id).short,
      thresholds: traitInfo(id).thresholds,
      }])),
      activeTraits: activePlayerTraits(),
      rarities: Object.fromEntries(Object.entries(RARITIES).map(([id, rarity]) => [id, {
        label: rarity.label,
        baseShopWeight: rarity.shopWeight,
        shopWeight: rarityWeights[id] || 0,
        shopOddsPct: rarityOdds[id] || 0,
      }])),
      shopUpgrade: {
        level: state.shopLevel,
        maxLevel: MAX_SHOP_LEVEL,
        nextCost: nextShopUpgradeCost(),
        discountGold: state.nextShopUpgradeDiscountGold || 0,
        shopkeeperSrc: currentShopkeeperSrc(),
        rarityWeights,
        rarityOddsPct: rarityOdds,
        itemShopChancePct: Number((currentItemShopChance() * 100).toFixed(1)),
        drinkShopChancePct: Number((currentDrinkShopChance() * 100).toFixed(1)),
        toppingShopChancePct: Number((currentToppingShopChance() * 100).toFixed(1)),
        saleChancePct: Number((currentShopSaleChance() * 100).toFixed(1)),
        tierChancePctPerSlot: {
          twoStar: Number((currentShopEntryTierChances().tier2 * 100).toFixed(1)),
          threeStar: Number((currentShopEntryTierChances().tier3 * 100).toFixed(1)),
        },
      },
      currentRollCost: currentRollCost(),
      freeRolls: state.freeRolls,
      rollsThisRound: state.rollsThisRound,
      itemDiscountUsed: state.itemDiscountUsed,
      availableItemDiscount: availableItemDiscount(),
      streaks: {
        win: state.winStreak,
        loss: state.lossStreak,
      },
      lastIncome: state.lastIncome,
      lastCombatLedger: state.lastCombatLedger,
      expandedCombatLedger: state.lastCombatLedger ? {
        enabled: true,
        open: Boolean(state.combatLedgerReview.open),
        transition: modalTransition("ledger") ? {
          phase: modalTransition("ledger").phase,
          progress: Number(clamp01((modalTransition("ledger").elapsed || 0) / Math.max(0.001, modalTransition("ledger").duration || MODAL_TRANSITION_SECONDS)).toFixed(2)),
          alpha: Number(modalTransitionVisual("ledger").alpha.toFixed(2)),
        } : null,
        selectedUnitUid: state.combatLedgerReview.unitUid,
        filter: state.combatLedgerReview.filter,
        effectiveFilter: combatLedgerEffectiveFilterId(),
        frameIndex: currentCombatLedgerFrameIndex(state.lastCombatLedger),
        frameCount: state.lastCombatLedger.frames?.length || 0,
        eventCount: state.lastCombatLedger.events?.length || 0,
        visibleEventCount: combatLedgerFilteredEvents(state.lastCombatLedger).length,
        logScrollOffset: state.combatLedgerReview.logScrollOffset || 0,
        focusedEventSeq: state.combatLedgerReview.focusedEventSeq || null,
        eventTypeFilters: combatLedgerEventTypeFilters(),
        bigMomentsOnly: Boolean(state.combatLedgerReview.bigMomentsOnly),
        frameStepSeconds: COMBAT_LEDGER_FRAME_SECONDS,
      } : { enabled: false },
      shopFrozen: [...state.shopFrozen],
      shopSales: [...state.shopSales],
      shopUnlocked: [...state.shopUnlocked],
      shopLocked: shopSlots.map((_, index) => !isShopSlotUnlocked(index)),
      shopUnlockCosts: shopSlots.map((_, index) => shopSlotUnlockCost(index)),
      shop: shopSlots.map((_, index) => {
        const entry = shopEntryAt(index);
        return entry ? shopEntryText(entry, index) : null;
      }),
      bench: state.bench.map((u) => (u ? entryText(u) : null)),
      itemBench: state.itemBench.map((item, index) => (item ? { ...itemText(item), slotKind: itemBenchSlotKind(index) } : { slotKind: itemBenchSlotKind(index), item: null })),
      board: state.board.map((u, i) => (isUnit(u) ? { ...unitText(u), ...slotText(i) } : null)),
      drinks: state.drinks.map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
      enemyDrinks: enemyDrinks.map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
      enemyPlan: state.enemyPreview?.plan || shownBattle?.enemyPlan || null,
      enemyPreview: enemyPreview.map((unit, index) => ({
        ...unitText(unit),
        previewSlot: enemyPreviewSlotFor(unit, index),
        ...slotText(enemyPreviewSlotFor(unit, index)),
      })),
      rewardChoices: state.rewardChoices.map((reward, index) => ({ index, ...reward })),
      codex: {
        open: state.codexOpen,
        transition: modalTransition("codex") ? {
          phase: modalTransition("codex").phase,
          progress: Number(clamp01((modalTransition("codex").elapsed || 0) / Math.max(0.001, modalTransition("codex").duration || MODAL_TRANSITION_SECONDS)).toFixed(2)),
          alpha: Number(modalTransitionVisual("codex").alpha.toFixed(2)),
        } : null,
        tab: state.codexTab,
        filters: JSON.parse(JSON.stringify(state.codexFilters || {})),
        visibleCount: codexEntries().length,
        visibleEntries: codexEntries().slice(0, 12).map((entry) => ({
          id: entry.id,
          name: state.codexTab === "food" ? displayCatalogName(entry) : displayItemName(entry),
          rarity: entry.rarity || "common",
        })),
        selectedId: state.codexSelectedId,
        selectedFormTier: state.codexSelectedFormTier,
        selectedFormName: state.codexTab === "food"
          ? codexMealSelected()
            ? (realityBroken() ? "Wreck" : "Meal")
            : currentCodexEntry()
              ? displayCatalogForm(currentCodexEntry(), codexSelectedFormTier(currentCodexEntry()), "name")
              : null
          : null,
        selectedAnimal: state.codexTab === "food" && currentCodexEntry()
          ? unitText(codexUnitFor(currentCodexEntry(), codexMealSelected() ? 1 : codexSelectedFormTier(currentCodexEntry())))
          : null,
        preview: {
          zoom: state.codexPreview?.zoom || 1,
          panX: state.codexPreview?.panX || 0,
          panY: state.codexPreview?.panY || 0,
          dragging: Boolean(state.codexPreview?.dragging),
        },
        selectedItemTier: state.codexSelectedItemTier,
        selectedItem: state.codexTab === "toppings" || state.codexTab === "drinks"
          ? currentCodexEntry()
            ? itemText(makeItem(currentCodexEntry().id, codexSelectedItemTier()))
            : null
          : null,
      },
      selected: state.selected,
      selectedEntry: getSelectedRef()?.entry ? entryText(getSelectedRef().entry) : null,
      selectedUnit: getSelectedRef()?.unit ? unitText(getSelectedRef().unit) : null,
      drag: state.drag
        ? {
            area: state.drag.area,
            index: state.drag.index,
            x: Math.round(state.drag.x),
            y: Math.round(state.drag.y),
            moved: state.drag.moved,
            over: state.drag.over,
            valid: state.drag.valid,
            entry: entryText(state.drag.unit),
          }
        : null,
      battle,
    });
  }

  function entryText(entry) {
    if (isItem(entry)) return itemText(entry);
    return unitText(entry);
  }

  function shopEntryText(entry, index) {
    const mergeOpportunity = shopSlotMergeOpportunity(index);
    return {
      ...entryText(entry),
      shopSale: shopSlotOnSale(index),
      basePrice: entryCost(entry),
      salePrice: saleAdjustedEntryCost(entry, index),
      purchasePrice: purchaseCost(entry, index),
      shopMergeOpportunity: Boolean(mergeOpportunity),
      shopMergeProgress: mergeOpportunity?.progress || 0,
      shopMergeIncomingProgress: mergeOpportunity?.incomingProgress || 0,
      shopMergePhantomProgress: mergeOpportunity?.phantomProgress || 0,
      shopMergeRequired: mergeOpportunity?.required || 3,
      shopMergeText: mergeOpportunity?.text || null,
    };
  }

  function itemText(item) {
    return {
      kind: "item",
      id: item.id,
      name: displayItemName(item),
      short: itemDisplayShort(item),
      baseShort: displayItemShort(item),
      type: item.type,
      typeLabel: displayEntryTypeLabel(item),
      tier: itemTier(item.tier),
      maxTier: MAX_ITEM_TIER,
      tierScale: itemTierScale(item.tier),
      mergeProgress: itemMergeProgressCount(item.id, item.tier),
      mergeRequired: 3,
      mergeText: itemTier(item.tier) >= MAX_ITEM_TIER ? "Max level" : `${Math.min(itemMergeProgressCount(item.id, item.tier), 3)}/3 to Lv ${itemTier(item.tier) + 1}`,
      rarity: item.rarity || "common",
      rarityLabel: rarityInfo(item.rarity).label,
      spriteSrc: itemSpriteSrcFor(item),
      drinkThrowableSpriteSrc: isDrink(item) ? drinkThrowableSpriteSrcFor(item.id) : undefined,
      price: entryCost(item),
      sellValue: itemSellValue(item),
      damageBonusPct: item.damageBonusPct,
      attackSpeedPct: item.attackSpeedPct,
      maxHpBonusPct: item.maxHpBonusPct,
      abilityPowerBonusPct: item.abilityPowerBonusPct,
      drinkAttackSpeedPct: item.drinkAttackSpeedPct,
      drinkMaxHpPct: item.drinkMaxHpPct,
      drinkAbilityPowerPct: item.drinkAbilityPowerPct,
      pairTraits: item.pairTraits ? [...item.pairTraits] : [],
      pairLabel: drinkPairLabel(item),
      pairedDrinkAttackSpeedPct: item.pairedDrinkAttackSpeedPct,
      pairedDrinkMaxHpPct: item.pairedDrinkMaxHpPct,
      pairedDrinkAbilityPowerPct: item.pairedDrinkAbilityPowerPct,
      drinkPulseType: item.drinkPulseType,
      drinkPulseUnlocked: drinkPulseUnlocked(item),
      drinkPulseTierScale: isDrink(item) && item.drinkPulseType ? Number(drinkPulseTierScale(item).toFixed(3)) : undefined,
      drinkPulseText: drinkPulseSpecLine(item, drinkPulseUnlocked(item)),
      drinkPulseInterval: item.drinkPulseInterval,
      drinkPulseDuration: item.drinkPulseDuration,
      drinkPulseShieldPct: item.drinkPulseShieldPct,
      drinkPulseHastePct: item.drinkPulseHastePct,
      drinkPulseHealPct: item.drinkPulseHealPct,
      drinkPulseEnemyDamagePct: item.drinkPulseEnemyDamagePct,
      drinkPulseAttackSlowPct: item.drinkPulseAttackSlowPct,
      drinkPulseAttackBoostPct: item.drinkPulseAttackBoostPct,
      onAttackShieldPct: item.onAttackShieldPct,
      onHitShieldPct: item.onHitShieldPct,
      shieldCrackleDamagePct: item.shieldCrackleDamagePct,
      burnDamagePct: item.burnDamagePct,
      burnDuration: item.burnDuration,
      supportBonusPct: item.supportBonusPct,
      markDamagePct: item.markDamagePct,
      markDuration: item.markDuration,
      damageTakenPct: item.damageTakenPct,
      everyNAttacks: item.everyNAttacks,
      selfHealPct: item.selfHealPct,
      splashDamagePct: item.splashDamagePct,
      lateFightStart: item.lateFightStart,
      lateFightInterval: item.lateFightInterval,
      lateFightDamagePct: item.lateFightDamagePct,
      lateFightMaxStacks: item.lateFightMaxStacks,
      lowHpThreshold: item.lowHpThreshold,
      lowHpAttackSpeedPct: item.lowHpAttackSpeedPct,
      lowHpLifestealPct: item.lowHpLifestealPct,
      cooldownDelay: item.cooldownDelay,
      supportHastePct: item.supportHastePct,
      supportHasteDuration: item.supportHasteDuration,
      antiSupportPct: item.antiSupportPct,
      antiSupportDuration: item.antiSupportDuration,
      receivedSupportSharePct: item.receivedSupportSharePct,
      bounceDamagePct: item.bounceDamagePct,
      shieldedAttackBonusPct: item.shieldedAttackBonusPct,
      overhealShieldPct: item.overhealShieldPct,
      mergeProgressBonus: item.mergeProgressBonus,
      frontRowDamageReductionPct: item.frontRowDamageReductionPct,
      backRowTargeting: item.backRowTargeting,
      adjacentStartShieldPct: item.adjacentStartShieldPct,
      adjacentPulseShieldPct: item.adjacentPulseShieldPct,
      adjacentPulseAttackBuffPct: item.adjacentPulseAttackBuffPct,
      adjacentPulseInterval: item.adjacentPulseInterval,
      adjacentPulseDuration: item.adjacentPulseDuration,
      pierceDamagePct: item.pierceDamagePct,
      lowHpBurnThreshold: item.lowHpBurnThreshold,
      lowHpBurnDamagePct: item.lowHpBurnDamagePct,
      lowHpBurnDuration: item.lowHpBurnDuration,
      lowHpBurnInterval: item.lowHpBurnInterval,
      deathSaveShieldPct: item.deathSaveShieldPct,
      firstDebuffCleanseHealPct: item.firstDebuffCleanseHealPct,
      timedHasteAt: item.timedHasteAt,
      timedHastePct: item.timedHastePct,
      timedHasteDuration: item.timedHasteDuration,
      timedHasteInterval: item.timedHasteInterval,
      shieldedTargetDamagePct: item.shieldedTargetDamagePct,
      attackSlowPct: item.attackSlowPct,
      attackSlowDuration: item.attackSlowDuration,
      statusDurationReductionPct: item.statusDurationReductionPct,
      statusDamageReductionPct: item.statusDamageReductionPct,
      decoyHpPct: item.decoyHpPct,
      firstHitRedirect: item.firstHitRedirect,
      periodicDamage: item.periodicDamage,
      periodicDamagePct: item.periodicDamagePct,
      periodicInterval: item.periodicInterval,
      sellBonusGold: item.sellBonusGold,
      surviveGold: item.surviveGold,
      firstItemDiscountGold: item.firstItemDiscountGold,
      sameLineShopChancePct: item.sameLineShopChancePct,
      extraAdjacentHealPct: item.extraAdjacentHealPct,
      shieldCapBonusPct: item.shieldCapBonusPct,
      statusDurationBonusPct: item.statusDurationBonusPct,
      supportAttackBuffPct: item.supportAttackBuffPct,
      supportAttackBuffDuration: item.supportAttackBuffDuration,
      battleStartHpLossPct: item.battleStartHpLossPct,
      firstAttacksBonusPct: item.firstAttacksBonusPct,
      firstAttacksCount: item.firstAttacksCount,
      exhaustedSpeedPenaltyPct: item.exhaustedSpeedPenaltyPct,
      selfBurnDamagePct: item.selfBurnDamagePct,
      shieldedAttackSpeedPct: item.shieldedAttackSpeedPct,
      teamVulnerabilityPct: item.teamVulnerabilityPct,
      teamVulnerabilityDuration: item.teamVulnerabilityDuration,
      executeSplashThreshold: item.executeSplashThreshold,
      executeSplashBonusPct: item.executeSplashBonusPct,
      executeSplashDamagePct: item.executeSplashDamagePct,
      teamOverhealShieldPct: item.teamOverhealShieldPct,
      teamHasteInterval: item.teamHasteInterval,
      teamHastePct: item.teamHastePct,
      teamHasteDuration: item.teamHasteDuration,
      supportRowEchoPct: item.supportRowEchoPct,
      adjacentStartAttackBuffPct: item.adjacentStartAttackBuffPct,
      adjacentStartBuffDuration: item.adjacentStartBuffDuration,
      abilityText: themedGeneratedText(item.abilityText),
      cardText: themedGeneratedText(itemCardText(item)),
      baseCardText: themedGeneratedText(item.cardText),
      description: itemDescriptionText(item),
      specs: itemSpecLines(item).map(themedGeneratedText),
      favoriteFor: favoriteUsersForItem(item.id),
    };
  }

  function motionText(unit, motionKey, fallbackDuration, battle = visibleBattle()) {
    if (!unit || !battle) return { active: false, remaining: 0 };
    const motion = unit[motionKey];
    if (!motion || typeof motion.start !== "number") return { active: false, remaining: 0 };
    const duration = Math.max(0.001, motion.duration || fallbackDuration);
    const remaining = Math.max(0, motion.start + duration - (battle.elapsed || 0));
    return {
      active: remaining > 0,
      remaining: Number(remaining.toFixed(2)),
    };
  }

  function unitText(unit, includePosition = false) {
    const payload = {
      kind: "unit",
      id: unit.typeId,
      typeLabel: displayEntryTypeLabel(unit),
      lineName: displayUnitLineName(unit),
      formName: displayUnitFormName(unit),
      name: displayUnitShort(unit),
      spriteSrc: unit.giraffeBossUnit ? runtimeSpriteSrcFor(unit, { cozy: true }) : runtimeSpriteSrcFor(unit),
      glitchSpriteSrc: unit.giraffeBossUnit ? runtimeSpriteSrcFor(unit, { horror: true }) : undefined,
      attackParticleSrc: attackParticleSpriteSrcFor(unit.typeId || unit.id),
      defeatStillSrc: defeatStillSpriteSrcFor(unit),
      rarity: unit.rarity,
      rarityLabel: rarityInfo(unit.rarity).label,
      role: displayRoleLabel(unit.role),
      family: unit.family,
      familyLabel: familyLabel(unit.family),
      traits: (unit.traits || []).map((traitId) => ({
        id: traitId,
        label: traitLabel(traitId),
        active: activeTraitStage(unit, traitId) > 0,
        stage: activeTraitStage(unit, traitId),
      })),
      tier: unit.tier,
      hp: unit.hp,
      maxHp: unit.maxHp,
      atk: unit.atk,
      abilityPower: unit.abilityPower,
      permanentHpBonus: unit.permanentHpBonus || 0,
      ability: unit.ability,
      abilityText: themedGeneratedText(abilitySpecLine(unit)),
      abilityLabel: themedGeneratedText(unit.abilityText),
      favoriteTopping: favoriteToppingFor(unit),
      specialEffect: themedTextObject(specialEffectFor(unit)),
      shield: unit.shield || 0,
      burn: unit.burn ? { remaining: Number(unit.burn.remaining.toFixed(2)), damage: unit.burn.damage } : null,
      mark: unit.mark ? { remaining: Number(unit.mark.remaining.toFixed(2)), sourceUid: unit.mark.sourceUid, damagePct: unit.mark.damagePct } : null,
      teamVulnerable: unit.teamVulnerable ? { remaining: Number(unit.teamVulnerable.remaining.toFixed(2)), pct: unit.teamVulnerable.pct } : null,
      taunt: unit.taunt ? { remaining: Number(unit.taunt.remaining.toFixed(2)) } : null,
      haste: unit.haste ? { remaining: Number(unit.haste.remaining.toFixed(2)), pct: unit.haste.pct } : null,
      attackBoost: unit.attackBoost ? { remaining: Number(unit.attackBoost.remaining.toFixed(2)), pct: unit.attackBoost.pct } : null,
      attackSlow: unit.attackSlow ? { remaining: Number(unit.attackSlow.remaining.toFixed(2)), pct: unit.attackSlow.pct } : null,
      antiSupport: unit.antiSupport ? { remaining: Number(unit.antiSupport.remaining.toFixed(2)), reductionPct: unit.antiSupport.reductionPct } : null,
      slowed: unit.slowed ? { remaining: Number(unit.slowed.remaining.toFixed(2)) } : null,
      lateFightStacks: unit.lateFightStacks || 0,
      moldStacks: unit.moldStacks || 0,
      kernelStacks: unit.kernelStacks || 0,
      abilitySpec: themedGeneratedText(abilitySpecLine(unit)),
      drinkAttackSpeedPct: unit.drinkAttackSpeedPct || 0,
      drinkEffects: unit.drinkEffects || [],
      item: unit.item ? itemText(unit.item) : null,
    };
    if (unit.giraffeBossUnit || isGiraffeBossUnitType(unit.typeId)) {
      const battle = visibleBattle();
      payload.giraffeHitGlitchActive = Boolean(battle && (unit.giraffeHitGlitchUntil || 0) > (battle.elapsed || 0));
      payload.giraffeHitGlitchRemaining = battle ? Number(Math.max(0, (unit.giraffeHitGlitchUntil || 0) - (battle.elapsed || 0)).toFixed(2)) : 0;
    }
    if (isFinalBossUnitType(unit.typeId)) {
      const battle = visibleBattle();
      payload.finalBossHitGlitchActive = Boolean(battle && (unit.finalBossHitGlitchUntil || 0) > (battle.elapsed || 0));
      payload.finalBossHitGlitchRemaining = battle ? Number(Math.max(0, (unit.finalBossHitGlitchUntil || 0) - (battle.elapsed || 0)).toFixed(2)) : 0;
    }
    if (realityBroken()) payload.radiationDose = unit.moldStacks || 0;
    if (includePosition) {
      payload.x = Math.round(unit.x);
      payload.y = Math.round(unit.y);
      payload.side = unit.side;
      payload.slot = unit.slot;
      payload.row = unit.row;
      payload.col = unit.col;
      payload.depth = unit.col === FRONT_COL ? "front" : unit.col === BACK_COL ? "back" : "middle";
      payload.motion = {
        attack: motionText(unit, "attackMotion", COMBAT_ATTACK_MOTION_SECONDS),
        support: motionText(unit, "supportMotion", COMBAT_SUPPORT_MOTION_SECONDS),
        hit: motionText(unit, "hitMotion", COMBAT_HIT_MOTION_SECONDS),
      };
    }
    return payload;
  }

  function slotText(index) {
    const { row, col } = slotGrid(index);
    return {
      slot: index,
      row,
      col,
      depth: col === FRONT_COL ? "front" : col === BACK_COL ? "back" : "middle",
    };
  }

  function drinkSlotText(index) {
    const slot = drinkSlots[index];
    return {
      slot: index,
      axis: slot.axis,
      targetIndex: slot.targetIndex,
      targetLabel: slot.axis === "row" ? `row ${slot.targetIndex + 1}` : `column ${slot.targetIndex + 1}`,
    };
  }

  function initialSmokeScenario() {
    return window.FoodAnimalsRouteHarness.smokeScenario();
  }

  function normalizeRunMode(value) {
    return window.FoodAnimalsRouteHarness.normalizeRunMode(value);
  }

  function initialRunMode() {
    return window.FoodAnimalsRouteHarness.initialRunMode();
  }

  function isInfiniteMode() {
    return state.runMode === "infinite";
  }

  function routeParam(name) {
    return window.FoodAnimalsRouteHarness.param(name);
  }

  function victoryEpilogueRouteElapsed() {
    const stage = routeParam("stage") || routeParam("at");
    if (stage === "crawl" || stage === "message") {
      const blockHeight = (VICTORY_CRAWL_LINES.length - 1) * VICTORY_CRAWL_LINE_GAP;
      const centeredStartY = H / 2 - blockHeight / 2;
      const secondsToCenter = Math.max(0, (H + 44 - centeredStartY) / VICTORY_CRAWL_PIXELS_PER_SECOND);
      return VICTORY_CRAWL_START_SECONDS + secondsToCenter + VICTORY_CRAWL_HOLD_SECONDS / 2;
    }
    if (stage === "static" || stage === "fade") return VICTORY_IDEAL_FADE_START_SECONDS + 0.8;
    if (stage === "ideal" || stage === "reboot") return VICTORY_IDEAL_FADE_START_SECONDS + VICTORY_IDEAL_FADE_SECONDS + 2.5;

    try {
      const params = new URLSearchParams(window.location.search);
      const seconds = Number(params.get("t") || params.get("elapsed"));
      if (Number.isFinite(seconds) && seconds >= 0) return seconds;
    } catch (_err) {
      // Keep the default title beat.
    }

    return 0;
  }

  function applyVictoryEpilogueRoute() {
    state.phase = "victoryCutscene";
    state.round = FINAL_VICTORY_ROUND + 1;
    state.realityOverride = false;
    state.realityBroken = true;
    state.realityBreakTimer = 0;
    state.codexOpen = false;
    state.selected = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.rewardChoices = [];
    state.rebootTransition = null;
    state.menuRebootTransition = null;
    state.postGiraffeHorrorTransition = null;
    state.level10RevealCutscene = null;
    state.shopReturnStaticTransition = null;
    state.finalVictoryTransition = null;
    state.victoryCutscene = {
      elapsed: victoryEpilogueRouteElapsed(),
      roundCleared: FINAL_VICTORY_ROUND,
      backgroundSrc: FINAL_VICTORY_CUTSCENE_SRC,
      idealBackgroundSrc: FINAL_VICTORY_IDEAL_SRC,
      message: "The doors open",
    };
    state.activeStory = null;
    state.seenStoryMilestones = Object.keys(STORY_MILESTONES);
    state.message = "The doors open";
    clearParticles();
    return true;
  }

  function finalFightRouteShouldStartBattle() {
    return window.FoodAnimalsRouteHarness.shouldStartBattle();
  }

  function applyFinalFightRoute() {
    state.phase = "prep";
    state.round = FINAL_VICTORY_ROUND;
    state.gold = ECONOMY.maxGold;
    state.hearts = 10;
    state.shopLevel = MAX_SHOP_LEVEL;
    state.message = "Final fight ready";
    state.shopFrozen = Array(shopSlots.length).fill(false);
    state.shopSales = Array(shopSlots.length).fill(false);
    state.shopUnlocked = shopSlots.map(() => true);
    state.bench = Array(8).fill(null);
    state.itemBench = Array(itemBenchSlots.length).fill(null);
    state.board = Array(boardSlots.length).fill(null);
    state.drinks = Array(drinkSlots.length).fill(null);
    state.selected = null;
    state.codexOpen = false;
    state.hover = null;
    state.pointer = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.arenaId = "blackout_street_carnival";
    state.keepArenaNextRound = false;
    state.arenaHoldNotice = null;
    state.arenaScout = null;
    state.arenaPrepBuff = null;
    state.enemyPreview = null;
    state.rewardChoices = [];
    state.lastCombatLedger = null;
    state.freeRolls = startingFreeRollsForShopLevel(MAX_SHOP_LEVEL);
    state.rollsThisRound = 0;
    state.nextShopUpgradeDiscountGold = 0;
    state.winStreak = 6;
    state.lossStreak = 0;
    state.lastIncome = null;
    state.itemDiscountUsed = false;
    state.battleSpeedIndex = 1;
    state.realityOverride = true;
    state.realityBroken = true;
    state.realityBreakTimer = 0;
    state.rebootTransition = null;
    state.menuRebootTransition = null;
    state.postGiraffeHorrorTransition = null;
    state.level10RevealCutscene = null;
    state.shopReturnStaticTransition = null;
    state.finalVictoryTransition = null;
    state.victoryCutscene = null;
    state.activeStory = null;
    state.seenStoryMilestones = finalFightRouteShouldStartBattle()
      ? Object.keys(STORY_MILESTONES)
      : Object.keys(STORY_MILESTONES).filter((id) => id !== "level20PreFinal");
    clearParticles();

    state.board[0] = makeUnit("toast_tortoise", 2);
    state.board[1] = makeUnit("taco_tiger", 2);
    state.board[2] = makeUnit("mochi_mammoth", 2);
    state.board[3] = makeUnit("shakshuka_shark", 2);
    state.board[4] = makeUnit("boba_basilisk", 2);
    state.board[5] = makeUnit("croissant_kraken", 2);
    state.board[6] = makeUnit("caesar_salamander", 2);
    state.board[7] = makeUnit("caprese_capybara", 2);
    state.board[8] = makeUnit("noodle_newt", 2);

    refreshShop(true);
    ensureEnemyPreview();
    state.log = ["Review route: Neural Overmind final fight"];
    if (finalFightRouteShouldStartBattle()) startBattle();
    if (state.phase === "prep") {
      state.message = "Final fight ready";
      maybeStartStoryMilestone();
    }
    return true;
  }

  function applyLevel10Route() {
    state.phase = "prep";
    state.round = GIRAFFE_BOSS_ROUND;
    state.gold = 160;
    state.hearts = 10;
    state.shopLevel = 3;
    state.message = "Wave 10 ready";
    state.shopFrozen = Array(shopSlots.length).fill(false);
    state.shopSales = Array(shopSlots.length).fill(false);
    state.shopUnlocked = shopSlots.map(() => true);
    state.bench = Array(8).fill(null);
    state.itemBench = Array(itemBenchSlots.length).fill(null);
    state.board = Array(boardSlots.length).fill(null);
    state.drinks = Array(drinkSlots.length).fill(null);
    state.selected = null;
    state.codexOpen = false;
    state.hover = null;
    state.pointer = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.arenaId = "sunny_breakfast_patio";
    state.keepArenaNextRound = false;
    state.arenaHoldNotice = null;
    state.arenaScout = null;
    state.arenaPrepBuff = null;
    state.enemyPreview = null;
    state.rewardChoices = [];
    state.lastCombatLedger = null;
    state.freeRolls = startingFreeRollsForShopLevel(3);
    state.rollsThisRound = 0;
    state.nextShopUpgradeDiscountGold = 0;
    state.winStreak = 3;
    state.lossStreak = 0;
    state.lastIncome = null;
    state.itemDiscountUsed = false;
    state.battleSpeedIndex = 1;
    state.realityOverride = null;
    state.realityBroken = false;
    state.realityBreakTimer = 0;
    state.rebootTransition = null;
    state.menuRebootTransition = null;
    state.postGiraffeHorrorTransition = null;
    state.level10RevealCutscene = null;
    state.shopReturnStaticTransition = null;
    state.finalVictoryTransition = null;
    state.victoryCutscene = null;
    state.activeStory = null;
    state.seenStoryMilestones = [];
    clearParticles();

    state.board[0] = makeUnit("toast_tortoise", 2);
    state.board[1] = makeUnit("taco_tiger", 2);
    state.board[2] = makeUnit("mochi_mammoth", 2);
    state.board[3] = makeUnit("shakshuka_shark", 2);
    state.board[4] = makeUnit("boba_basilisk", 2);
    state.board[5] = makeUnit("croissant_kraken", 2);
    state.board[6] = makeUnit("caesar_salamander", 2);
    state.board[7] = makeUnit("caprese_capybara", 2);
    state.board[8] = makeUnit("noodle_newt", 2);
    state.drinks[0] = makeItem("bean_brew", 2);
    state.drinks[1] = makeItem("berry_fizz", 2);
    state.drinks[3] = makeItem("tidepool_espresso", 2);

    refreshShop(true);
    ensureEnemyPreview();
    state.log = ["Review route: level 10 Banana Split Giraffe boss"];
    if (finalFightRouteShouldStartBattle()) startBattle();
    if (state.phase === "prep") state.message = "Wave 10 ready";
    return true;
  }

  function applyLevel10RevealCutsceneRoute() {
    applyLevel10Route();
    state.phase = "prep";
    state.round = REALITY_BREAK_ROUND;
    state.realityOverride = true;
    state.realityBroken = true;
    state.realityBreakTimer = 0;
    state.activeStory = null;
    state.postGiraffeHorrorTransition = null;
    state.shopReturnStaticTransition = null;
    state.phaseTransition = null;
    state.seenStoryMilestones = Object.keys(STORY_MILESTONES);
    state.message = "Illusion failure";
    startLevel10RevealCutscene({ force: true, source: "route" });
    return true;
  }

  function applyOpeningTutorialShopRoute() {
    state.phase = "prep";
    state.round = 1;
    state.gold = 10;
    state.hearts = 10;
    state.shopLevel = 1;
    state.message = "Tutorial shop ready";
    state.shopFrozen = Array(shopSlots.length).fill(false);
    state.shopSales = Array(shopSlots.length).fill(false);
    state.shopUnlocked = initialShopUnlocked();
    state.bench = Array(8).fill(null);
    state.itemBench = Array(itemBenchSlots.length).fill(null);
    state.board = Array(boardSlots.length).fill(null);
    state.drinks = Array(drinkSlots.length).fill(null);
    state.selected = null;
    state.codexOpen = false;
    state.hover = null;
    state.pointer = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.arenaId = "dim_sum_kitchen";
    state.keepArenaNextRound = false;
    state.arenaHoldNotice = null;
    state.arenaScout = null;
    state.arenaPrepBuff = null;
    state.enemyPreview = null;
    state.rewardChoices = [];
    state.lastCombatLedger = null;
    state.freeRolls = startingFreeRollsForShopLevel(1);
    state.rollsThisRound = 0;
    state.nextShopUpgradeDiscountGold = 0;
    state.winStreak = 0;
    state.lossStreak = 0;
    state.lastIncome = null;
    state.itemDiscountUsed = false;
    state.battleSpeedIndex = 0;
    state.realityOverride = false;
    state.realityBroken = false;
    state.realityBreakTimer = 0;
    state.rebootTransition = null;
    state.menuRebootTransition = null;
    state.postGiraffeHorrorTransition = null;
    state.level10RevealCutscene = null;
    state.shopReturnStaticTransition = null;
    state.finalVictoryTransition = null;
    state.victoryCutscene = null;
    state.activeStory = null;
    state.seenStoryMilestones = [];
    clearParticles();

    state.board[0] = makeUnit("toast_tortoise", 1);
    state.board[4] = makeUnit("taco_tiger", 1);
    state.bench[0] = makeItem("bacon_strips", 1);
    state.itemBench[0] = makeItem("berry_fizz", 1);
    state.drinks[0] = makeItem("berry_fizz", 1);
    state.shop = Array(shopSlots.length).fill(null);
    state.shop[0] = makeUnit("sushi_seal", 1);
    state.shop[1] = makeUnit("noodle_newt", 1);
    state.shop[2] = makeUnit("berry_bat", 1);
    state.shop[3] = makeItem("bacon_strips", 1);
    state.log = ["Review route: opening tutorial shop"];
    ensureEnemyPreview();
    return true;
  }

  function applyStoryCanvasSmokeRoute() {
    applyOpeningTutorialShopRoute();
    state.message = "Story canvas smoke";
    startStoryConversation({
      id: "storyCanvasSmoke",
      title: "Story canvas smoke",
      index: 0,
      beats: [
        {
          speaker: "You",
          text: "The shared canvas renderer keeps portraits, panels, text, and hit boxes aligned.",
        },
        {
          speaker: "Tabs",
          text: "One module now owns the story overlay rules for every canvas scene.",
        },
      ],
    });
    return true;
  }

  function applyConversationPreviewRoute(theme) {
    const horror = theme === "horror";
    applyOpeningTutorialShopRoute();
    state.realityOverride = horror;
    state.realityBroken = horror;
    state.realityBreakTimer = 0;
    state.message = horror ? "Horror conversation preview" : "Cozy conversation preview";
    state.log = [state.message];
    startStoryConversation({
      id: horror ? "horrorConversationPreview" : "cozyConversationPreview",
      title: state.message,
      index: 0,
      beats: [
        {
          speaker: horror ? "T.A.B.S." : "Tabs",
          text: horror
            ? "This preview uses the same conversation renderer, portrait art, and war panel wiring as the campaign layer."
            : "This preview uses the same conversation renderer, portrait art, and paper panel wiring as the campaign layer.",
          tone: horror ? "glitch" : undefined,
        },
        {
          speaker: "You",
          text: "Good. I can inspect the real in-game layout immediately.",
        },
      ],
    });
    return true;
  }

  function normalizeStoryRouteId(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function storyRouteCandidates(id, story) {
    const candidates = [id, story?.id, story?.title];
    if (id === "level20PreFinal") candidates.push("level20-pre-final", "level20-prefinal", "wave20-final-gate", "final-gate");
    if (id === FINAL_TABS_STORY_ID) candidates.push("level20-final-tabs", "wave20-last-table", "last-table", "final-tabs");
    return candidates.filter(Boolean);
  }

  function storyForRouteId(routeId) {
    const normalized = normalizeStoryRouteId(routeId);
    if (!normalized) return null;
    const entries = [
      ...Object.entries(STORY_MILESTONES).map(([id, story]) => [id, { id, ...story }]),
      [FINAL_TABS_STORY_ID, FINAL_TABS_STORY],
    ];
    const match = entries.find(([id, story]) => (
      storyRouteCandidates(id, story).some((candidate) => normalizeStoryRouteId(candidate) === normalized)
    ));
    return match ? { id: match[0], ...match[1] } : null;
  }

  function storyRouteIdFromScreen(screen) {
    const value = String(screen || "").trim().toLowerCase();
    const prefixes = ["conversation-", "story-conversation-", "story-"];
    const prefix = prefixes.find((candidate) => value.startsWith(candidate));
    return prefix ? value.slice(prefix.length) : "";
  }

  function applyStoryConversationRoute(routeId) {
    const story = storyForRouteId(routeId);
    if (!story?.beats?.length) return false;
    const horror = Boolean(story.requiresRealityBroken || story.id === FINAL_TABS_STORY_ID);
    applyOpeningTutorialShopRoute();
    state.round = story.round || state.round;
    state.realityOverride = horror;
    state.realityBroken = horror;
    state.realityBreakTimer = 0;
    state.message = story.title || "Conversation preview";
    state.log = [`Review route: ${state.message}`];
    if (story.log) state.log.unshift(story.log);
    startStoryConversation({
      id: story.id,
      title: story.title,
      index: 0,
      backgroundSrc: story.backgroundSrc,
      backgroundRanges: story.backgroundRanges,
      beats: story.beats,
    });
    return true;
  }

  function applyInitialRouteScreen() {
    const screen = routeParam("screen") || routeParam("scene");
    const storyRouteId = routeParam("story") || routeParam("conversation") || routeParam("id") || storyRouteIdFromScreen(screen);
    if (
      storyRouteId
      && window.FoodAnimalsRouteHarness.matches(screen, ["conversation", "story", "story-conversation"])
      && applyStoryConversationRoute(storyRouteId)
    ) {
      return true;
    }
    if (storyRouteId && applyStoryConversationRoute(storyRouteId)) {
      return true;
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["conversation-cozy", "cozy-conversation", "story-cozy"])) {
      return applyConversationPreviewRoute("cozy");
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["conversation-horror", "horror-conversation", "story-horror"])) {
      return applyConversationPreviewRoute("horror");
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["story-canvas-smoke", "story-smoke", "conversation-smoke"])) {
      return applyStoryCanvasSmokeRoute();
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["opening-tutorial-shop", "tutorial-shop", "shop-tutorial"])) {
      return applyOpeningTutorialShopRoute();
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["level-10", "level10", "wave-10", "wave10", "giraffe-boss"])) {
      return applyLevel10Route();
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["level-10-cutscene", "level10-cutscene", "wave-10-cutscene", "reveal-cutscene"])) {
      return applyLevel10RevealCutsceneRoute();
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["final-fight", "final-boss", "overmind"])) {
      return applyFinalFightRoute();
    }
    if (window.FoodAnimalsRouteHarness.matches(screen, ["victory-epilogue", "victory-cutscene", "final-victory"])) {
      return applyVictoryEpilogueRoute();
    }
    return false;
  }

  function applySmokeScenario() {
    const scenario = initialSmokeScenario();
    if (scenario !== "basic" && scenario !== "core-loop") return false;
    state.board.fill(null);
    state.bench.fill(null);
    state.itemBench.fill(null);
    state.drinks.fill(null);
    state.board[3] = makeUnit("sushi_seal", 1);
    state.board[4] = makeUnit("toast_tortoise", 2);
    state.board[5] = makeUnit("churro_cheetah", 1);
    state.selected = null;
    state.message = "Smoke team ready";
    return true;
  }

  function collectLanguageAuditText(sampleCount = 120) {
    const texts = [];
    const skipKeys = new Set([
      "id", "typeId", "itemId", "arenaId", "key", "uid", "sourceUid", "area", "kind", "type",
      "family", "particleType", "cacheKind", "spriteKind", "copyTheme", "copyThemeLabel",
      "phase", "source", "color", "accent", "backgroundSrc", "fallbackBackgroundSrc",
    ]);
    const shouldSkipKey = (key) => {
      const lower = String(key || "").toLowerCase();
      return skipKeys.has(key) || lower.endsWith("src") || lower.endsWith("srcs") || lower.includes("sprite") || lower.includes("asset");
    };
    const add = (value, key = "") => {
      if (value === null || value === undefined || shouldSkipKey(key)) return;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) texts.push(trimmed);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((entry) => add(entry, key));
        return;
      }
      if (typeof value === "object") {
        Object.entries(value).forEach(([childKey, childValue]) => add(childValue, childKey));
      }
    };

    add({
      terms: {
        food: foodTerm(),
        foods: foodPluralTerm(),
        topping: toppingTerm(),
        toppings: toppingPluralTerm(),
        drink: drinkTerm(),
        drinks: drinkPluralTerm(),
        currency: currencyTerm(),
        roll: rollTerm(),
        upgrade: upgradeTerm(),
        arena: arenaTerm(),
      },
      status: {
        needCurrency: `Need ${currencyTerm({ lower: true })}`,
        rolled: `${rollTerm()} -1 ${currencyTerm({ lower: true })}`,
        freeRoll: `Free ${rollTerm({ lower: true })}`,
        slot: `Open ${realityBroken() ? "scan" : "shop"} slot`,
        upgrade: `${upgradeTerm()} ${realityBroken() ? "rig" : "shop"}`,
      },
      tooltips: [
        buttonTooltip(buttons.shopUpgrade, true),
        buttonTooltip(buttons.shopUpgrade, false),
        buttonTooltip(buttons.roll, true),
        buttonTooltip(buttons.roll, false),
        buttonTooltip(buttons.battle, false),
      ],
      arena: ARENAS.map((arena) => arenaText(arena)),
      traits: Object.fromEntries(Object.keys(TRAITS).map((id) => [id, traitInfo(id)])),
      items: ITEMS.flatMap((item) => [itemText(makeItem(item.id, 1)), itemText(makeItem(item.id, MAX_ITEM_TIER))]),
      units: CATALOG.flatMap((unit) => [
        unitText(makeUnit(unit.id, 1)),
        unitText(makeUnit(unit.id, unit.forms.length)),
      ]),
      rewards: [
        goldReward(true),
        goldReward(false),
        freeRollReward(true),
        freeRollReward(false),
        favoriteToppingReward(),
        arenaToppingReward(),
        arenaScoutReward(),
        arenaPrepBuffReward(),
        arenaHoldReward(),
        arenaPurseReward(true),
        arenaPurseReward(false),
        shopSlotUnlockReward(),
        upgradeDiscountReward(),
        freeItemReward(),
        ownedCopyReward(),
        pivotCopyReward(),
        ...Array.from({ length: Math.max(0, sampleCount) }, (_, index) => generateRewardChoices(index % 2 === 0)),
      ],
    });
    return { theme: currentCopyThemeId(), broken: realityBroken(), texts };
  }

  function combatTileBleedText() {
    if (state.phase !== "battle" || !realityBroken()) {
      return { active: false, layer: "inactive", board: [], drinks: [] };
    }
    const activeBoard = boardSlots
      .map((_, index) => ({ index, ...slotBackdropBleedPhase("board", index) }))
      .filter((entry) => entry.active);
    const activeDrinks = drinkSlots
      .map((_, index) => ({ index, ...slotBackdropBleedPhase("drinks", index) }))
      .filter((entry) => entry.active);
    return {
      active: activeBoard.length > 0 || activeDrinks.length > 0,
      layer: "clipped-under-units",
      board: activeBoard,
      drinks: activeDrinks,
    };
  }

  window.render_game_to_text = renderGameToText;
  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i++) update(1 / 60);
    draw();
    return renderGameToText();
  };
  window.__foodAnimals = {
    state,
    buyShop,
    buyShopToBench,
    buyShopToSlot,
    buyShopItemToAnimal,
    upgradeShop,
    nextShopUpgradeCost,
    currentShopRarityWeights,
    shopRarityOdds,
    currentDrinkShopChance,
    currentToppingShopChance,
    currentItemShopChance,
    currentShopSaleChance,
    currentShopEntryTierChances,
    rng: () => rngRuntime.exportState(rngState),
    shopSlotOnSale,
    currentCopyThemeId,
    copy,
    copyThemes: COPY_THEMES,
    moveUnitToOpenSlot,
    attachItemFromBench,
    detachSelectedItem,
    refreshShop,
    shopItem,
    shopEntry,
    ensureEnemyPreview,
    applyRewardChoice,
    generateRewardChoices,
    arenaRewardTraits,
    toggleShopFreeze,
    purchaseShopSlot,
    cycleBattleSpeed,
    currentBattleSpeed,
    setRealityTheme,
    cycleRealityThemeOverride,
    currentArena,
    setArena,
    arenaInfo,
    arenas: ARENAS,
    currentGameMusicTrack,
    gameMusicSceneKey,
    armGameMusic,
    playGameSfx,
    openOptionsMenu,
    closeOptionsMenu,
    openCodexOverlay,
    closeCodexOverlay,
    openCombatLedgerReview,
    closeCombatLedgerReview,
    saveCurrentRun,
    restoreSavedRunIfRequested,
    setGameMusicSetting,
    setGameSfxSetting,
    sellSelectedUnit,
    sellSelectedItem,
    sellValue,
    itemSellValue,
    rarityInfo,
    chooseShopRarity,
    startStoryConversation,
    advanceStoryConversation,
    goBackStoryConversation,
    startBattle,
    continueFromResult,
    continuePrep,
    makeUnit,
    makeItem,
    itemText,
    itemSpriteSrcFor,
    drinkThrowableSpriteSrcFor,
    mergeTriples,
    resolveMerges,
    mergeItemTriples,
    resolveItemMerges,
    itemMergeProgressCount,
    positionBattleUnit,
    applySmokeScenario,
    collectLanguageAuditText,
  };

  canvas.addEventListener("pointerdown", armGameSfx);
  canvas.addEventListener("pointerdown", armGameMusic);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", armGameSfx);
  window.addEventListener("keydown", armGameMusic);
  window.addEventListener("keydown", onKeyDown);
  document.addEventListener("visibilitychange", pauseGameMusicForHiddenTab);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveCurrentRunSilently();
  });
  window.addEventListener("pagehide", saveCurrentRunSilently);

  refreshShop(true);
  const explicitRouteRequested = Boolean(routeParam("screen") || routeParam("scene") || window.FoodAnimalsRouteHarness.smokeScenario());
  const restoredSavedRun = explicitRouteRequested ? false : restoreSavedRunIfRequested();
  if (!restoredSavedRun) {
    applySmokeScenario();
    applyInitialRouteScreen();
  }
  markActiveRunRoute();
  getUiSprite(COZY_AWNING_TRANSITION_SRC);
  getUiSprite(COZY_BATTLE_DEPLOY_OVERLAY_SRC);
  getUiSprite(REALITY_BATTLE_DEPLOY_OVERLAY_SRC);
  getUiSprite(COZY_BATTLE_DEPLOY_TITLE_SRC);
  getUiSprite(REALITY_BATTLE_DEPLOY_TITLE_SRC);
  getUiSprite(COZY_BATTLE_RESULT_VICTORY_TITLE_SRC);
  getUiSprite(COZY_BATTLE_RESULT_DEFEAT_TITLE_SRC);
  getUiSprite(REALITY_BATTLE_RESULT_VICTORY_TITLE_SRC);
  getUiSprite(REALITY_BATTLE_RESULT_DEFEAT_TITLE_SRC);
  getUiSprite(COZY_BATTLE_RESULT_RUN_OVER_TITLE_SRC);
  getUiSprite(REALITY_BATTLE_RESULT_RUN_OVER_TITLE_SRC);
  getUiSprite(PLAYER_STORY_PORTRAIT_SRC);
  getUiSprite(TABS_STORY_PORTRAIT_SRC);
  getUiSprite(HORROR_TABS_STORY_PORTRAIT_SRC);
  getUiSprite(STORY_DIALOGUE_PAPER_BG_SRC);
  getUiSprite(STORY_DIALOGUE_WAR_BG_SRC);
  [...Object.values(STORY_MILESTONES), FINAL_TABS_STORY]
    .flatMap((story) => [
      story.backgroundSrc,
      ...(story.backgroundRanges || []).map((entry) => entry.backgroundSrc),
    ])
    .filter(Boolean)
    .forEach((src) => getBackgroundImage(src));
  getUiSprite(LEVEL10_CUTSCENE_TEXT_PANEL_SRC);
  getUiSprite(LEVEL10_CUTSCENE_EVIDENCE_FRAME_SRC);
  getUiSprite(LEVEL10_CUTSCENE_FX_ATLAS_SRC);
  getUiSprite(LEVEL10_CUTSCENE_GLITCH_OVERLAY_SRC);
  LEVEL10_REVEAL_CUTSCENE_SHOTS.forEach((shot) => {
    if (shot.imageSrc) getUiSprite(shot.imageSrc);
    if (shot.insertSrc) getUiSprite(shot.insertSrc);
    if (shot.mode === "panorama") getUiSprite(LEVEL10_REVEAL_WAR_YARD_PANORAMA_SRC);
  });
  ensureEnemyPreview();
  draw();
  requestAnimationFrame(gameLoop);
})();
