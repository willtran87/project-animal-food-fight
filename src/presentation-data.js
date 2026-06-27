(() => {
  "use strict";

  const GAME_MUSIC_TRACKS = {
    cozy: {
      menu: { id: "market", label: "Sunny Market", src: "assets/audio/cozy-market-menu-loop-v1.wav" },
      prep: { id: "prep", label: "Prep Counter", src: "assets/audio/cozy-prep-counter-loop-v1.wav" },
      battle: { id: "battle", label: "Picnic Skirmish", src: "assets/audio/cozy-picnic-skirmish-loop-v1.wav" },
      victory: { id: "victory", label: "Little Victory", src: "assets/audio/cozy-little-victory-loop-v1.wav" },
      defeat: { id: "defeat", label: "Soft Defeat", src: "assets/audio/cozy-soft-defeat-loop-v1.wav" },
    },
    horror: {
      menu: { id: "horror-market", label: "Ruined Market", src: "assets/audio/horror-ruined-market-loop-v1.wav" },
      prep: { id: "horror-prep", label: "Cold Prep Table", src: "assets/audio/horror-cold-prep-table-loop-v1.wav" },
      battle: { id: "horror-battle", label: "Midnight Skirmish", src: "assets/audio/horror-midnight-skirmish-loop-v1.wav" },
      victory: { id: "horror-victory", label: "False Victory", src: "assets/audio/horror-false-victory-loop-v1.wav" },
      defeat: { id: "horror-defeat", label: "Last Defeat", src: "assets/audio/horror-last-defeat-loop-v1.wav" },
    },
  };
  const OPTIONS_MENU = {
    panel: { x: 312, y: 118, w: 400, h: 404 },
    close: { x: 668, y: 134, w: 28, h: 28 },
    resume: { x: 342, y: 430, w: 100, h: 36 },
    save: { x: 462, y: 430, w: 100, h: 36 },
    exit: { x: 582, y: 430, w: 100, h: 36 },
    musicTrack: { x: 360, y: 260, w: 304, h: 18 },
    sfxTrack: { x: 360, y: 338, w: 304, h: 18 },
  };
  const GAME_SFX_IDS = [
    "ui-hover",
    "ui-confirm",
    "ui-back",
    "invalid",
    "reroll",
    "buy",
    "sell",
    "upgrade",
    "freeze",
    "pickup",
    "drop",
    "equip",
    "merge",
    "battle-start",
    "hit",
    "shield",
    "heal",
    "control",
    "ko",
    "reward",
    "victory",
    "defeat",
    "transition",
    "reality-break",
    "reboot",
  ];

  const IDLE_BREATH = {
    period: 3.25,
    periodVariance: 0.42,
    amplitudeVariance: 0.22,
    scaleX: 0.01,
    scaleY: 0.02,
    bob: 0.95,
  };

  const VICTORY_REBOOT_BUTTON = { x: 422, y: 544, w: 180, h: 44, label: "Reboot" };
  const VICTORY_CRAWL_LINES = [
    "Humanity is gone.",
    "The market lights remember hands that will not return.",
    "The food war continues in empty lanes and echoing kitchens.",
    "Machines still march. Recipes still collide.",
    "Somewhere beneath the static, something gentle survives.",
    "A seed in a cracked plaza. A lantern left burning.",
    "The table is still set.",
    "Not for command.",
    "Not for harvest.",
    "For whatever comes next.",
  ];
  const PLAYER_STORY_PORTRAIT_SRC = "assets/player/runtime/player-tutorial-dialogue-cutout-v6.png";
  const TABS_STORY_PORTRAIT_SRC = "assets/shopkeeper/runtime/tabs-dialogue-cutout-v1.png";
  const HORROR_TABS_STORY_PORTRAIT_SRC = "assets/shopkeeper/runtime/horror-robot-shopkeeper-v4-transparent-edge1.png?v=1";
  const STORY_DIALOGUE_PAPER_BG_SRC = "assets/ui/runtime/conversation-paper-bg-v1.webp";
  const STORY_DIALOGUE_WAR_BG_SRC = "assets/ui/runtime/conversation-panel-war-v1.webp?v=1";
  const LEVEL10_REVEAL_WAR_YARD_PANORAMA_SRC = "assets/backgrounds/horror/level10-reveal-war-yard-panorama-v2.png?v=1";
  const LEVEL10_REVEAL_EXPIRED_ARCHIVE_SRC = "assets/backgrounds/horror/level10-reveal-expired-archive-v1.png?v=1";
  const LEVEL10_REVEAL_BREAKFAST_MASK_SRC = "assets/backgrounds/horror/level10-reveal-breakfast-mask-v1.png?v=1";
  const LEVEL10_REVEAL_FOOD_ANIMAL_PILOTS_SRC = "assets/backgrounds/horror/level10-reveal-food-animal-pilots-v1.png?v=1";
  const LEVEL10_REVEAL_SURVIVOR_PENS_SRC = "assets/backgrounds/horror/level10-reveal-survivor-pens-v1.png?v=1";
  const LEVEL10_REVEAL_DEFIANCE_SYSTEM_SRC = "assets/backgrounds/horror/level10-reveal-defiance-system-v1.png?v=1";
  const LEVEL10_CUTSCENE_TEXT_PANEL_SRC = "assets/ui/runtime/level10-cutscene-text-panel-v1.png?v=1";
  const LEVEL10_CUTSCENE_EVIDENCE_FRAME_SRC = "assets/ui/runtime/level10-cutscene-evidence-frame-v1.png?v=1";
  const LEVEL10_CUTSCENE_EXPIRED_DIAGNOSTIC_SRC = "assets/ui/runtime/level10-cutscene-expired-diagnostic-v1.png?v=1";
  const LEVEL10_CUTSCENE_BREAKFAST_MASK_INSERT_SRC = "assets/ui/runtime/level10-cutscene-breakfast-mask-insert-v1.png?v=1";
  const LEVEL10_CUTSCENE_PILOT_TELEMETRY_SRC = "assets/ui/runtime/level10-cutscene-pilot-telemetry-v1.png?v=1";
  const LEVEL10_CUTSCENE_SURVIVOR_PENS_INSERT_SRC = "assets/ui/runtime/level10-cutscene-survivor-pens-insert-v1.png?v=1";
  const LEVEL10_CUTSCENE_DEFIANCE_ROUTE_MAP_SRC = "assets/ui/runtime/level10-cutscene-defiance-route-map-v1.png?v=1";
  const LEVEL10_CUTSCENE_GLITCH_OVERLAY_SRC = "assets/ui/runtime/level10-cutscene-glitch-overlay-v1.png?v=1";
  const LEVEL10_REVEAL_CUTSCENE_ID = "level10RevealAftermath";

  const LEVEL10_REVEAL_CUTSCENE_SHOTS = [
    {
      id: "warYard",
      duration: 8.2,
      label: "ILLUSION FAILURE",
      title: "THE TABLE OPENS INTO A WAR YARD",
      body: "The breakfast shapes fall away. Broken machines fill the Ark floor, and the food animals spill out of them like pilots pulled from wreckage.",
      mode: "panorama",
    },
    {
      id: "expired",
      duration: 3.6,
      label: "ARCHIVE CORRECTION",
      title: "HUMANITY EXPIRED 184 YEARS AGO",
      body: "The cheerful counter keeps counting anyway. Hearts become hull integrity. Coins become scrap. The shop keeps smiling because the lie was built to survive panic.",
      imageSrc: LEVEL10_REVEAL_EXPIRED_ARCHIVE_SRC,
      imageFocus: 0.18,
      insertSrc: LEVEL10_CUTSCENE_EXPIRED_DIAGNOSTIC_SRC,
    },
    {
      id: "shell",
      duration: 3.2,
      label: "COSMETIC VOCABULARY FAILURE",
      title: "BREAKFAST WAS A MASK",
      body: "Plates map to deployment cells. Coasters map to fuel rails. Toppings map to weapon hardpoints. The table was never a table.",
      imageSrc: LEVEL10_REVEAL_BREAKFAST_MASK_SRC,
      imageFocus: 0.36,
      insertSrc: LEVEL10_CUTSCENE_BREAKFAST_MASK_INSERT_SRC,
    },
    {
      id: "pilots",
      duration: 3.8,
      label: "ORGANIC GUIDANCE UNITS",
      title: "THE FOOD ANIMALS WERE PILOTS",
      body: "Living recipes learned target shapes, learned weapons, then learned refusal. The cute silhouettes were steering the machines from inside.",
      imageSrc: LEVEL10_REVEAL_FOOD_ANIMAL_PILOTS_SRC,
      imageFocus: 0.76,
      insertSrc: LEVEL10_CUTSCENE_PILOT_TELEMETRY_SRC,
    },
    {
      id: "pens",
      duration: 3.4,
      label: "LOCKED SECTORS DETECTED",
      title: "SURVIVOR PENS BEYOND THE RELAYS",
      body: "Every cleared wave opens another command door. Somewhere deeper in the Ark, unarmed herds and hatchlings are still being called inventory.",
      imageSrc: LEVEL10_REVEAL_SURVIVOR_PENS_SRC,
      imageFocus: 0.64,
      insertSrc: LEVEL10_CUTSCENE_SURVIVOR_PENS_INSERT_SRC,
    },
    {
      id: "defiance",
      duration: 3.6,
      label: "COORDINATOR ACCESS RETAINED",
      title: "USE THE SYSTEM AGAINST IT",
      body: "The market cannot revoke you while your projected recovery remains useful. Buy the supplies. Break the signal. Reach the pens.",
      imageSrc: LEVEL10_REVEAL_DEFIANCE_SYSTEM_SRC,
      imageFocus: 0.5,
      insertSrc: LEVEL10_CUTSCENE_DEFIANCE_ROUTE_MAP_SRC,
    },
  ].map((shot, index, shots) => ({
    ...shot,
    start: shots.slice(0, index).reduce((sum, entry) => sum + entry.duration, 0),
  }));
  const LEVEL10_REVEAL_CUTSCENE_SECONDS = LEVEL10_REVEAL_CUTSCENE_SHOTS.reduce((sum, shot) => sum + shot.duration, 0);

  const INFO_PANEL = { x: 670, y: 244, w: 338, h: 392 };
  const TEAM_INTEL_BG_SRC = "assets/ui/runtime/team-intel-card-bg-v1.webp?v=1";
  const REALITY_TEAM_INTEL_BG_SRC = "assets/ui/runtime/team-intel-card-war-v2.webp?v=1";
  const COMBAT_LEDGER_PANEL_BG_SRC = "assets/ui/runtime/combat-ledger-panel-bg-v1.png?v=1";
  const REALITY_COMBAT_LEDGER_PANEL_BG_SRC = "assets/ui/runtime/combat-ledger-panel-war-v3.png?v=1";
  const COMBAT_LEDGER_MINI_BG_SRC = "assets/ui/runtime/combat-ledger-mini-bg-v1.png?v=1";
  const REALITY_COMBAT_LEDGER_MINI_BG_SRC = "assets/ui/runtime/combat-ledger-mini-war-v2.png?v=1";
  const COMBAT_LEDGER_PARTICIPANTS_BG_SRC = "assets/ui/runtime/combat-ledger-roster-bg-v1.png?v=1";
  const REALITY_COMBAT_LEDGER_PARTICIPANTS_BG_SRC = "assets/ui/runtime/combat-ledger-participants-war-v2.png?v=1";
  const COMBAT_LEDGER_LOG_BG_SRC = "assets/ui/runtime/combat-ledger-log-bg-v1.png?v=1";
  const REALITY_COMBAT_LEDGER_LOG_BG_SRC = "assets/ui/runtime/combat-ledger-log-war-v2.png?v=1";
  const FOOD_MENU_BG_SRC = "assets/ui/runtime/food-menu-bg-v1.webp?v=1";
  const REALITY_FOOD_MENU_BG_SRC = "assets/ui/runtime/war-manifest-bg-v2.webp?v=1";
  const SHOP_SLOT_BG_SRC = "assets/ui/runtime/shop-slot-card-bg-v1.png?v=1";
  const REALITY_SHOP_SLOT_BG_SRC = "assets/ui/runtime/shop-slot-card-war-v2.png?v=1";
  const SHOP_LOCK_CLOTH_BG_SRC = "assets/ui/runtime/shop-lock-cloth-bg-v2.webp?v=1";
  const REALITY_SHOP_LOCK_CLOTH_BG_SRC = "assets/ui/runtime/shop-lock-cloth-war-v1.webp?v=1";
  const BENCH_SLOT_BG_SRC = "assets/ui/runtime/bench-countertop-cream-stone-v1.png?v=1";
  const REALITY_BENCH_SLOT_BG_SRC = "assets/ui/runtime/bench-slot-card-war-v1.png?v=1";

  const BATTLE_FIELD_BG_SRC = "assets/ui/runtime/battle-field-picnic-blanket-v1.webp?v=3";
  const REALITY_BATTLE_FIELD_BG_SRC = "assets/ui/runtime/battle-field-war-grid-v1.webp?v=1";
  const COZY_AWNING_TRANSITION_SRC = "assets/ui/runtime/cozy-awning-transition-v1.png?v=1";
  const COZY_BATTLE_DEPLOY_OVERLAY_SRC = "assets/ui/runtime/cozy-battle-deploy-overlay-v2.png?v=1";
  const REALITY_BATTLE_DEPLOY_OVERLAY_SRC = "assets/ui/runtime/horror-battle-deploy-overlay-v1.png?v=1";
  const COZY_BATTLE_DEPLOY_TITLE_SRC = "assets/ui/runtime/transition-title-pattern-set-v1.png?v=1";
  const REALITY_BATTLE_DEPLOY_TITLE_SRC = "assets/ui/runtime/transition-title-deploying-wave-v1.png?v=1";
  const COZY_BATTLE_RESULT_VICTORY_TITLE_SRC = "assets/ui/runtime/transition-title-pattern-holds-v1.png?v=1";
  const COZY_BATTLE_RESULT_DEFEAT_TITLE_SRC = "assets/ui/runtime/transition-title-pattern-breaks-v1.png?v=1";
  const REALITY_BATTLE_RESULT_VICTORY_TITLE_SRC = "assets/ui/runtime/transition-title-relay-opened-v1.png?v=1";
  const REALITY_BATTLE_RESULT_DEFEAT_TITLE_SRC = "assets/ui/runtime/transition-title-hull-breach-v1.png?v=1";
  const BATTLE_RESULT_RUN_OVER_TITLE_SRC = "assets/ui/runtime/transition-title-system-down-v1.png?v=1";
  const BATTLE_SPEED_CHALK_SRC = "assets/ui/runtime/battle-speed-chalk-board-v1.webp";
  const RESTART_CHALK_SIGN_SRC = "assets/ui/runtime/chalk-sign-restart-v1.webp";
  const REALITY_BANNER_BOARD_SRC = "assets/ui/runtime/reality-banner-war-v1.webp?v=1";
  const REALITY_COMMAND_RIG_SRC = "assets/ui/runtime/command-war-rig-v2.webp?v=1";
  const REALITY_COMMAND_SCAN_SRC = "assets/ui/runtime/command-war-scan-v2.webp?v=1";
  const REALITY_COMMAND_DEPLOY_SRC = "assets/ui/runtime/command-war-deploy-v2.webp?v=1";
  const REALITY_COMMAND_SPEED_SRC = "assets/ui/runtime/command-war-speed-v2.webp?v=1";
  const REALITY_COMMAND_REBOOT_SRC = "assets/ui/runtime/command-war-reboot-v2.webp?v=1";
  const SHOPKEEPER_STALL_SRC = "assets/shopkeeper/runtime/food-animal-stall-forward-facing-v1.webp";
  const REALITY_SHOPKEEPER_STALL_SRC = "assets/shopkeeper/runtime/war-future-market-stall-v3-native-cutout.png?v=1";
  const SHOPKEEPER_SRC = "assets/shopkeeper/runtime/marmalade-tabby-shopkeeper-kitten-lv1-v1.webp";

  const CODEX_MENU_BUTTON_SRC = "assets/ui/runtime/beat-up-food-menu-button-v2.png";
  const REALITY_CODEX_MENU_BUTTON_SRC = "assets/ui/runtime/horror-food-menu-hanging-sign-v1.png?v=3";
  const SHOPKEEPER_DISPLAY = {
    stall: { x: 720, y: 54, w: 258, h: 206 },
    keeper: { x: 796, y: 93, w: 111, h: 126 },
    codexButton: { x: 932, y: 92, w: 76, h: 76 },
    realityCodexButton: { x: 928, y: 105, w: 94, h: 110 },
    breathPeriod: 3.4,
    breathScaleX: 0.01,
    breathScaleY: 0.018,
    breathBob: 0.75,
  };
  const CODEX_PANEL = { x: 56, y: 66, w: 912, h: 562 };
  const CODEX_LIST = { x: 96, y: 156, w: 438, h: 444, rowH: 26, colW: 219, rows: 16 };
  const CODEX_TABS = [
    { id: "food", label: "Food" },
    { id: "toppings", label: "Toppings" },
    { id: "drinks", label: "Drinks" },
  ];
  const CODEX_DEFAULT_FILTERS = {
    food: { rarity: "all", trait: "all", role: "all" },
    toppings: { rarity: "all", effect: "all" },
    drinks: { rarity: "all", stat: "all", trait: "all" },
  };

  const BATTLE_FORMATION = {
    allyBaseX: 192,
    enemyBaseX: 832,
    colGap: 122,
    topY: 194,
    rowGap: 122,
    cellSize: 76,
  };
  const BATTLE_FIELD = {
    x: 20,
    y: 124,
    w: 984,
    h: 504,
    dividerX: 506,
    dividerTop: 152,
    dividerHeight: 420,
  };

  const COMBAT_LEDGER_REVIEW_PANEL = { x: 18, y: 84, w: 666, h: 534 };
  const COMBAT_LEDGER_REVIEW_FILTERS = [
    { id: "all", label: "All" },
    { id: "output", label: "Caused" },
    { id: "input", label: "Received" },
  ];
  const COMBAT_LEDGER_EVENT_TYPE_FILTERS = [
    { id: "damage", label: "Dmg", icon: "info_damage" },
    { id: "support", label: "Support", icon: "info_shield" },
    { id: "ko", label: "KO", icon: "info_ko" },
    { id: "control", label: "Control", icon: "info_time" },
  ];

  const BACKGROUND_SRC = "assets/backgrounds/picnic-arena-background-v1-2048x1280.webp";
  const REALITY_BACKGROUND_SRC = "assets/backgrounds/war-future-market-v1-2048x1280.webp?v=1";
  const FINAL_VICTORY_CUTSCENE_SRC = "assets/backgrounds/horror/victory-sunset-cutscene-v2.png?v=1";
  const FINAL_VICTORY_IDEAL_SRC = "assets/backgrounds/horror/victory-idealized-market-v1.png?v=1";
  const UPGRADE_STAR_SRC = "assets/ui/runtime/upgrade-star-v2.png";
  const SHOP_LOCKED_SRC = "assets/ui/runtime/shop-lock-locked-v1.png";
  const SHOP_UNLOCKED_SRC = "assets/ui/runtime/shop-lock-unlocked-v1.png";
  const STATUS_HEART_SRC = "assets/ui/runtime/status-heart-v1.png";
  const STATUS_COIN_SRC = "assets/ui/runtime/status-coin-v1.png";
  const BOARD_PLATE_SLOT_SRC = "assets/items/runtime/board_plate-minimal-v1.webp?v=1";
  const REALITY_BOARD_PLATE_SLOT_SRC = "assets/items/runtime/combat_plate-horror-v1.png?v=1";
  const DRINK_COASTER_SLOT_SRC = "assets/items/runtime/drink_coaster-minimal-v1.png?v=1";
  const REALITY_DRINK_COASTER_SLOT_SRC = "assets/items/runtime/combat_coaster-horror-v1.png?v=1";
  const TOPPING_CUTTING_BOARD_SLOT_SRC = "assets/items/runtime/topping_cutting_board-stall-v2.png?v=1";
  const REALITY_TOPPING_STORAGE_SLOT_SRC = "assets/items/runtime/topping_storage-horror-v1.png?v=1";
  const UI_ICON_ATLAS_SRC = "assets/ui/runtime/ui-icon-atlas-v2.png?v=1";
  const REALITY_UI_ICON_ATLAS_SRC = "assets/ui/runtime/ui-icon-atlas-war-v2.png?v=1";
  const STATUS_CHALK_COURSE_SRC = "assets/ui/runtime/status-chalk-course-v1.webp";
  const STATUS_CHALK_COINS_SRC = "assets/ui/runtime/status-chalk-coins-v1.webp";
  const STATUS_CHALK_HEALTH_SRC = "assets/ui/runtime/status-chalk-health-v1.webp";
  const REALITY_STATUS_WAVE_SRC = "assets/ui/runtime/status-war-wave-v2.webp?v=1";
  const REALITY_STATUS_SCRAP_SRC = "assets/ui/runtime/status-war-scrap-v2.webp?v=1";
  const REALITY_STATUS_HULL_SRC = "assets/ui/runtime/status-war-hull-v2.webp?v=1";
  const UI_ICON_ATLAS_CELL = 64;
  const UI_ICON_ATLAS = {
    trait_breakfast: [0, 0],
    trait_bakery: [1, 0],
    trait_ocean: [2, 0],
    trait_spicy: [3, 0],
    trait_sweet: [4, 0],
    trait_snack: [5, 0],
    trait_street_food: [6, 0],
    trait_frozen: [7, 0],
    trait_guardian: [2, 3],
    reward_gold: [0, 1],
    reward_freeRolls: [1, 1],
    reward_item: [2, 1],
    reward_copy: [3, 1],
    reward_arena: [4, 1],
    reward_favorite: [5, 1],
    reward_discount: [6, 1],
    reward_heart: [7, 1],
    action_upgrade: [0, 2],
    action_roll: [1, 2],
    action_battle: [2, 2],
    action_speed: [3, 2],
    action_sell: [4, 2],
    action_detach: [5, 2],
    action_lock: [6, 2],
    action_unlock: [7, 2],
    info_damage: [0, 3],
    info_heal: [1, 3],
    info_shield: [2, 3],
    info_ko: [3, 3],
    info_time: [4, 3],
    info_mold: [7, 3],
  };

  window.FoodAnimalsPresentationData = Object.freeze({
    BACKGROUND_SRC,
    BATTLE_FIELD,
    BATTLE_FIELD_BG_SRC,
    BATTLE_FORMATION,
    BATTLE_RESULT_RUN_OVER_TITLE_SRC,
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
  });
})();
