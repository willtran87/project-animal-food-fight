const MENU_THEME_ALIASES = window.FoodAnimalsThemeAssets?.MENU_THEME_ALIASES || {
  cozy: "cozy",
  picnic: "cozy",
  harvest: "cozy",
  horror: "horror",
  war: "horror",
  broken: "horror",
  reality: "horror",
  future: "horror",
};

const MENU_REBOOT_STATIC_STORAGE_KEY = "harvest-friends:menu-reboot-static:v1";
const MENU_RETURN_REVEAL_STORAGE_KEY = "harvest-friends:menu-return-reveal:v1";
const HORROR_MENU_UNLOCK_STORAGE_KEY = "harvest-friends:horror-menu-unlocked:v1";
const HORROR_REVEALED_STORAGE_KEY = "harvest-friends:horror-revealed:v1";
const GAME_COMPLETED_STORAGE_KEY = "harvest-friends:game-completed:v1";
const DEFAULT_MENU_THEME = "cozy";
const FINAL_VICTORY_ROUND = 20;
const FINAL_TABS_STORY_ID = "level20FinalTabs";

const state = {
  phase: "menu",
  theme: initialMenuTheme(),
  selectedIndex: 0,
  lastAction: "none",
  optionsOpen: false,
  purgeConfirm: false,
  runModeOpen: false,
  selectedRunMode: "story",
  fieldGuideOpen: false,
  fieldGuideClosing: false,
  startingGame: false,
  startTransitionPhase: "idle",
  startMode: "start",
  activeRun: null,
  fieldGuideIndex: 0,
  fieldGuideDirection: "next",
  fieldGuideView: {
    zoom: 1,
    panX: 0,
    panY: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  },
  settings: {
    music: 7,
    musicTrack: "market",
    sfx: 8,
    motion: true,
  },
  audio: {
    musicStarted: false,
    musicBlocked: false,
  },
  rebootStaticReveal: false,
  menuLoadReveal: false,
  menuLoadRevealKind: "load",
  activeLobs: 0,
  lobSpawnCount: 0,
  lobExplosionCount: 0,
  lastLobSize: 0,
};

const SETTINGS_STORAGE_KEY = window.FoodAnimalsAudioSettings?.STORAGE_KEY || "harvest-friends:start-menu-settings:v1";
const ACTIVE_RUN_STORAGE_KEY = window.FoodAnimalsRunStorage?.STORAGE_KEY || "harvest-friends:active-run:v1";
const DEFAULT_MUSIC_TRACK = "market";
const DEFAULT_HORROR_MUSIC_TRACK = "horror-market";
const MENU_MUSIC_MAX_VOLUME = 0.85;
const MENU_SFX_IDS = ["ui-hover", "ui-confirm", "ui-back", "invalid", "transition", "signal-static"];
const MENU_SFX_TRACKS = Object.fromEntries(
  ["cozy", "horror"].map((theme) => [
    theme,
    Object.fromEntries(MENU_SFX_IDS.map((id) => [id, `assets/audio/sfx/${theme}-${id}.wav`])),
  ]),
);
const MUSIC_TRACKS = [
  {
    id: "market",
    label: "Sunny Market",
    src: "assets/audio/cozy-market-menu-loop-v1.mp3",
  },
  {
    id: "prep",
    label: "Prep Counter",
    src: "assets/audio/cozy-prep-counter-loop-v1.mp3",
  },
  {
    id: "battle",
    label: "Picnic Skirmish",
    src: "assets/audio/cozy-picnic-skirmish-loop-v1.mp3",
  },
  {
    id: "victory",
    label: "Little Victory",
    src: "assets/audio/cozy-little-victory-loop-v1.mp3",
  },
  {
    id: "defeat",
    label: "Soft Defeat",
    src: "assets/audio/cozy-soft-defeat-loop-v1.mp3",
  },
  {
    id: "horror-market",
    label: "Ruined Market",
    src: "assets/audio/horror-ruined-market-loop-v1.mp3",
  },
  {
    id: "horror-prep",
    label: "Cold Prep Table",
    src: "assets/audio/horror-cold-prep-table-loop-v1.mp3",
  },
  {
    id: "horror-battle",
    label: "Midnight Skirmish",
    src: "assets/audio/horror-midnight-skirmish-loop-v1.mp3",
  },
  {
    id: "horror-victory",
    label: "False Victory",
    src: "assets/audio/horror-false-victory-loop-v1.mp3",
  },
  {
    id: "horror-defeat",
    label: "Last Defeat",
    src: "assets/audio/horror-last-defeat-loop-v1.mp3",
  },
];

const hasSavedSettings = loadSettings();
if (!hasSavedSettings) {
  state.settings.musicTrack = defaultMusicTrackForTheme(state.theme);
}

const FOOD_LOB_PARTICLES = [
  "assets/start-menu/runtime/food-lobs-v1/toast-square-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/taco-chip-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/sushi-bite-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/noodle-bundle-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/grape-cluster-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/pancake-bite-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/dumpling-v1.webp",
  "assets/start-menu/runtime/food-lobs-v1/popcorn-cluster-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-01-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-02-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-03-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-04-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-05-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-06-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-07-v1.webp",
  "assets/start-menu/runtime/food-lobs-v2/food-lob-extra-08-v1.webp",
];

const FIELD_GUIDE_ASSET_BASE = "assets/start-menu/field-guide";
const FIELD_GUIDE_SLUGS = [
  "toast-tortoise",
  "sushi-seal",
  "taco-tiger",
  "berry-bat",
  "noodle-newt",
  "pancake-penguin",
  "popcorn-porcupine",
  "pretzel-python",
  "avocado-axolotl",
  "bagel-beaver",
  "bao-bun-badger",
  "benedict-lobster",
  "boba-basilisk",
  "breakfast-burrito-boar",
  "caesar-salamander",
  "caprese-capybara",
  "churro-cheetah",
  "coconut-shrimp-sheep",
  "crab-cake-caterpillar",
  "croissant-kraken",
  "cucumber-cobra",
  "curry-crab",
  "donut-dodo",
  "dumpling-armadillo",
  "fortune-cookie-fox",
  "gingerbread-golem",
  "granola-goat",
  "green-juice-goose",
  "herb-hare",
  "hot-chip-hamster",
  "iceberg-oyster",
  "kelp-koala",
  "kimchi-chameleon",
  "lemon-meringue-lynx",
  "banana-split-giraffe-boss",
  "melon-mint-mantis",
  "mochi-mammoth",
  "pepper-prawn",
  "pico-de-gallo-gecko",
  "saltwater-taffy-otter",
  "shakshuka-shark",
  "vinaigrette-viper",
  "waffle-walrus",
  "yogurt-yeti",
];

const FIELD_GUIDE_PAGES = [
  {
    slug: "field-guide-cover",
    plate: null,
    label: "Field Guide",
    src: "assets/start-menu/field-guide-cover-v4.webp",
    alt: "Field Guide journal cover",
    isCover: true,
  },
  ...FIELD_GUIDE_SLUGS.map((slug, index) => ({
    slug,
    plate: index + 12,
    label: slug === "banana-split-giraffe-boss" ? "Banana Split Giraffe" : titleCaseSlug(slug),
    src:
      slug === "bao-bun-badger"
        ? `${FIELD_GUIDE_ASSET_BASE}/cozy/bao-bun-badger-anatomy-journal-v2-hd-pixel-transparent.webp`
        : `${FIELD_GUIDE_ASSET_BASE}/cozy/${slug}-anatomy-journal-v1-hd-pixel-transparent.webp`,
  })),
];

const SPECIFICATIONS_PAGES = [
  {
    slug: "specifications-cover",
    plate: null,
    label: "Specifications",
    src: "assets/start-menu/specifications-cover-v5.webp",
    alt: "Specifications engineering dossier cover",
    isCover: true,
  },
  ...FIELD_GUIDE_SLUGS.map((slug, index) => {
    const plate = index + 12;
    const label = slug === "banana-split-giraffe-boss" ? "Banana Split Giraffe" : titleCaseSlug(slug);
    return {
      slug,
      plate,
      label,
      src: horrorFieldGuideSrc(slug, plate),
      alt: `${label} specifications page`,
      chromaKey: true,
    };
  }),
];

const FOOD_LOB_SPAWN_DELAY = {
  min: 1150,
  max: 2300,
  initial: 800,
};
const FOOD_LOB_COMPANION = {
  chance: 0.58,
  delayMin: 260,
  delayMax: 680,
};
const FOOD_LOB_MAX_ACTIVE = {
  desktop: 5,
  mobile: 3,
};
const FOOD_LOB_MOVEMENT_DURATION = {
  min: 3900,
  max: 7800,
};
const FOOD_LOB_SPIN_DEGREES = {
  min: 260,
  max: 1480,
};
const START_TABLE_SCENE_MS = 1500;
const START_RUN_EXIT_MS = 560;
const START_TRANSITION_MS = START_TABLE_SCENE_MS + START_RUN_EXIT_MS;
const FIELD_GUIDE_CLOSE_MS = 380;
const LOCAL_TEST_PAGE_DIR = "local-test-pages";
const START_MENU_TEST_URL = `${LOCAL_TEST_PAGE_DIR}/start-menu.html`;
const START_TARGET_BASE_URL = `${LOCAL_TEST_PAGE_DIR}/opening-vn.html`;
const GAME_TARGET_BASE_URL = `${LOCAL_TEST_PAGE_DIR}/game.html`;

function appUrl(path) {
  return new URL(path, document.baseURI || window.location.href);
}
const HORROR_START_BG_SRC = "assets/start-menu/horror-start-bg-v1.webp";
const FIELD_GUIDE_ZOOM_MIN = 1;
const FIELD_GUIDE_ZOOM_MAX = 2.75;
const FIELD_GUIDE_ZOOM_STEP = 1.14;
const FIELD_GUIDE_TAP_MAX_PX = 9;
const FIELD_GUIDE_SWIPE_MIN_PX = 46;
const FIELD_GUIDE_SWIPE_AXIS_BIAS = 1.25;
const FIELD_GUIDE_CONTROL_ICONS = {
  cozy: {
    close: "assets/start-menu/runtime/field-guide-icon-close-v1.webp",
    prev: "assets/start-menu/runtime/field-guide-icon-prev-v1.webp",
    next: "assets/start-menu/runtime/field-guide-icon-next-v1.webp",
  },
  horror: {
    close: "assets/start-menu/runtime/field-guide-icon-close-horror-v1.webp",
    prev: "assets/start-menu/runtime/field-guide-icon-prev-horror-v1.webp",
    next: "assets/start-menu/runtime/field-guide-icon-next-horror-v1.webp",
  },
};

const actions = Array.from(document.querySelectorAll(".menu-action"));
const startMenu = document.querySelector(".start-menu");
const lobLayer = document.querySelector(".food-lob-layer");
const optionsPanel = document.querySelector(".options-panel");
const runModePanel = document.querySelector(".run-mode-panel");
const runModeButtons = Array.from(document.querySelectorAll("[data-run-mode]"));
const themeOptionRow = document.querySelector(".option-row-theme");
const themeButtons = Array.from(document.querySelectorAll("[data-menu-theme-option]"));
const musicSlider = document.querySelector("#music-volume");
const musicTrackSelect = document.querySelector("#music-track");
const sfxSlider = document.querySelector("#sfx-volume");
const purgeGameDataButton = document.querySelector('[data-action="purgeGameData"]');
const fieldGuide = document.querySelector(".field-guide");
const fieldGuidePageArt = document.querySelector(".field-guide-page-art");
const fieldGuideViewport = document.querySelector(".field-guide-page-viewport");
const fieldGuideImage = document.querySelector(".field-guide-page-image");
const fieldGuideTitle = document.querySelector(".field-guide-page-title");
const fieldGuideCount = document.querySelector(".field-guide-page-count");
const fieldGuideButtons = Array.from(document.querySelectorAll("[data-guide-action]"));
const fieldGuideActionLabel = document.querySelector('[data-action="fieldGuide"] .button-label');
const continueRunAction = document.querySelector('[data-action="continue"]');
const optionsAction = document.querySelector('[data-action="options"]');
const startTransition = document.querySelector(".start-transition");
const campaignFrame = document.querySelector(".campaign-frame");
const rebootStaticOverlay = document.querySelector(".menu-reboot-static-overlay");
const menuLoadTransitionOverlay = document.querySelector(".menu-load-transition-overlay");
const menuMusic = new Audio(getSelectedMusicTrack().src);
const menuSfx = {
  armed: false,
  pools: new Map(),
  next: new Map(),
};
let nextLobTimer = null;
let lobAnimationFrame = null;
let lastLobFrameTime = 0;
let currentMusicTrackId = getSelectedMusicTrack().id;
let menuMusicPlayPromise = null;
let nextLobFromLeft = Math.random() > 0.5;
let startTableTimer = null;
let startRunTimer = null;
let fieldGuideCloseTimer = null;
let rebootStaticTimer = null;
let menuLoadRevealTimer = null;
let fieldGuideImageLoadToken = 0;
let campaignFrameLoadToken = 0;
const activeLobs = [];
const chromaKeyImageCache = new Map();

menuMusic.loop = true;
menuMusic.preload = "auto";

function render() {
  coerceLockedMenuState();
  state.activeRun = getActiveRun();
  document.body.dataset.startMenuTheme = state.theme;
  startMenu.dataset.theme = state.theme;
  startMenu.setAttribute(
    "aria-label",
    state.theme === "horror" ? "Harvest Friends horror start menu" : "Harvest Friends start menu",
  );

  if (continueRunAction) continueRunAction.hidden = !state.activeRun;
  normalizeSelectedIndex();
  const visible = visibleMenuActions();
  actions.forEach((button) => {
    button.classList.toggle("is-selected", button === visible[state.selectedIndex]);
  });

  optionsPanel.hidden = !state.optionsOpen;
  if (runModePanel) runModePanel.hidden = !state.runModeOpen;
  runModeButtons.forEach((button) => {
    const active = button.dataset.runMode === state.selectedRunMode;
    button.classList.toggle("is-selected", active);
    button.tabIndex = active ? 0 : -1;
  });
  if (themeOptionRow) themeOptionRow.hidden = false;
  themeButtons.forEach((button) => {
    const theme = normalizeMenuTheme(button.dataset.menuThemeOption);
    const available = isMenuThemeAvailable(theme);
    const active = theme === state.theme;
    button.hidden = !available;
    button.disabled = !available;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", String(active));
    button.setAttribute("aria-disabled", String(!available));
    button.tabIndex = active ? 0 : -1;
  });
  if (rebootStaticOverlay) {
    rebootStaticOverlay.hidden = !state.rebootStaticReveal;
    rebootStaticOverlay.classList.toggle("is-active", state.rebootStaticReveal);
  }
  if (menuLoadTransitionOverlay) {
    menuLoadTransitionOverlay.hidden = !state.menuLoadReveal;
    menuLoadTransitionOverlay.dataset.kind = state.menuLoadRevealKind;
    menuLoadTransitionOverlay.classList.toggle("is-active", state.menuLoadReveal);
  }
  renderPurgeGameDataButton();
  const fieldGuideVisible = state.fieldGuideOpen || state.fieldGuideClosing;
  fieldGuide.hidden = !fieldGuideVisible;
  fieldGuide.dataset.theme = state.theme;
  fieldGuide.classList.toggle("is-closing", state.fieldGuideClosing);
  fieldGuide.setAttribute(
    "aria-label",
    state.theme === "horror" ? "War-machine Specifications" : "Food Animal Field Guide",
  );
  if (fieldGuideActionLabel) {
    fieldGuideActionLabel.textContent = fieldGuideDisplayName();
  }
  renderFieldGuideControlIcons();
  startMenu.classList.toggle("is-field-guide-open", fieldGuideVisible);
  startMenu.classList.toggle("is-field-guide-closing", state.fieldGuideClosing);
  startMenu.classList.toggle("is-starting", state.startingGame);
  startTransition.hidden = !state.startingGame;
  startTransition.dataset.phase = state.startTransitionPhase;
  startTransition.classList.toggle("is-entering-run", state.startTransitionPhase === "enteringRun");
  actions.forEach((button) => {
    button.disabled = state.startingGame || state.runModeOpen;
  });
  musicSlider.value = String(state.settings.music);
  renderMusicTrackOptions();
  musicTrackSelect.value = getSelectedMusicTrack().id;
  sfxSlider.value = String(state.settings.sfx);
  updateMenuMusicVolume();
  renderFieldGuide();
}

function chooseAction(action) {
  if (state.startingGame) return;

  state.lastAction = action;
  if (action !== "options") state.purgeConfirm = false;
  playMenuSfx(action === "start" || action === "continue" ? "transition" : "ui-confirm");

  if (action === "start") {
    openRunModeSelect();
  } else if (action === "continue") {
    beginStartTransition("continue");
  } else if (action === "fieldGuide") {
    clearFieldGuideCloseTimer();
    state.phase = "fieldGuide";
    state.optionsOpen = false;
    state.runModeOpen = false;
    state.fieldGuideOpen = true;
    state.fieldGuideClosing = false;
    resetFieldGuideView();
    preloadFieldGuideNeighbors();
  } else if (action === "options") {
    clearFieldGuideCloseTimer();
    state.phase = "options";
    state.optionsOpen = !state.optionsOpen;
    if (!state.optionsOpen) state.purgeConfirm = false;
    state.runModeOpen = false;
    state.fieldGuideOpen = false;
    state.fieldGuideClosing = false;
  } else {
    clearFieldGuideCloseTimer();
    state.phase = "menu";
    state.optionsOpen = false;
    state.runModeOpen = false;
    state.fieldGuideOpen = false;
    state.fieldGuideClosing = false;
  }

  render();
}

function openRunModeSelect() {
  clearActiveRun();
  clearFieldGuideCloseTimer();
  state.phase = "runMode";
  state.optionsOpen = false;
  state.purgeConfirm = false;
  state.runModeOpen = true;
  state.fieldGuideOpen = false;
  state.fieldGuideClosing = false;
  state.selectedRunMode = "story";
  render();
  runModeButtons.find((button) => button.dataset.runMode === state.selectedRunMode)
    ?.focus({ preventScroll: true });
}

function closeRunModeSelect() {
  if (!state.runModeOpen) return false;
  state.runModeOpen = false;
  state.phase = "menu";
  render();
  visibleMenuActions()[state.selectedIndex]?.focus({ preventScroll: true });
  return true;
}

function closeOptionsPanel() {
  if (!state.optionsOpen) return false;
  state.optionsOpen = false;
  state.purgeConfirm = false;
  state.phase = "menu";
  render();
  visibleMenuActions()[state.selectedIndex]?.focus({ preventScroll: true });
  return true;
}

function chooseRunMode(mode) {
  const normalized = mode === "infinite" ? "infinite" : "story";
  state.selectedRunMode = normalized;
  state.runModeOpen = false;
  clearActiveRun();
  beginStartTransition(normalized === "infinite" ? "infinite" : "story");
}

function handleRunModeOutsidePointerDown(event) {
  if (!state.runModeOpen || state.startingGame) return;
  if (runModePanel?.contains(event.target)) return;
  if (closeRunModeSelect()) {
    playMenuSfx("ui-back", { volume: 0.65 });
    event.preventDefault();
    event.stopPropagation();
  }
}

function handleOptionsOutsidePointerDown(event) {
  if (!state.optionsOpen || state.startingGame) return;
  if (optionsPanel?.contains(event.target) || optionsAction?.contains(event.target)) return;
  if (closeOptionsPanel()) {
    playMenuSfx("ui-back", { volume: 0.65 });
    event.preventDefault();
    event.stopPropagation();
  }
}

function selectIndex(index) {
  const visible = visibleMenuActions();
  if (!visible.length) return;
  state.selectedIndex = (index + visible.length) % visible.length;
  visible[state.selectedIndex].focus({ preventScroll: true });
  render();
}

actions.forEach((button) => {
  button.addEventListener("pointerenter", () => {
    const visibleIndex = visibleMenuActions().indexOf(button);
    if (visibleIndex >= 0) state.selectedIndex = visibleIndex;
    playMenuSfx("ui-hover", { volume: 0.45 });
    render();
  });
  button.addEventListener("focus", () => {
    const visibleIndex = visibleMenuActions().indexOf(button);
    if (visibleIndex >= 0) state.selectedIndex = visibleIndex;
    render();
  });
  button.addEventListener("click", () => chooseAction(button.dataset.action));
});

runModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedRunMode = button.dataset.runMode === "infinite" ? "infinite" : "story";
    playMenuSfx("transition", { volume: 0.7 });
    chooseRunMode(state.selectedRunMode);
  });
  button.addEventListener("pointerenter", () => {
    state.selectedRunMode = button.dataset.runMode === "infinite" ? "infinite" : "story";
    playMenuSfx("ui-hover", { volume: 0.45 });
    render();
  });
  button.addEventListener("focus", () => {
    state.selectedRunMode = button.dataset.runMode === "infinite" ? "infinite" : "story";
    render();
  });
});

fieldGuideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.guideAction;
    if (action === "close") {
      closeFieldGuide();
      playMenuSfx("ui-back");
    } else if (action === "prev") {
      turnFieldGuidePage(-1);
      playMenuSfx("ui-back", { volume: 0.7 });
    } else if (action === "next") {
      turnFieldGuidePage(1);
      playMenuSfx("ui-confirm", { volume: 0.7 });
    }
  });
});

purgeGameDataButton?.addEventListener("click", () => {
  ensureMenuMusicPlaying();
  state.lastAction = "purgeGameData";
  if (!state.purgeConfirm) {
    state.purgeConfirm = true;
    playMenuSfx("invalid", { volume: 0.48 });
    render();
    return;
  }
  const purged = purgeGameData();
  playMenuSfx(purged ? "ui-confirm" : "invalid", { volume: 0.7 });
  render();
});

fieldGuide?.addEventListener("pointerdown", (event) => {
  if (event.target === fieldGuide) closeFieldGuide();
});

fieldGuidePageArt?.addEventListener("pointerdown", (event) => {
  if (!state.fieldGuideOpen || event.button !== 0) return;
  ensureMenuMusicPlaying();
  const view = state.fieldGuideView || (state.fieldGuideView = {});
  view.dragging = true;
  view.pointerId = event.pointerId;
  view.startX = event.clientX;
  view.startY = event.clientY;
  view.startPanX = view.panX || 0;
  view.startPanY = view.panY || 0;
  fieldGuidePageArt.setPointerCapture?.(event.pointerId);
  applyFieldGuideView();
  event.preventDefault();
});

fieldGuidePageArt?.addEventListener("pointermove", (event) => {
  const view = state.fieldGuideView;
  if (!state.fieldGuideOpen || !view?.dragging) return;
  if (view.pointerId != null && event.pointerId !== view.pointerId) return;
  view.panX = (view.startPanX || 0) + event.clientX - (view.startX || event.clientX);
  view.panY = (view.startPanY || 0) + event.clientY - (view.startY || event.clientY);
  applyFieldGuideView();
  event.preventDefault();
});

function stopFieldGuidePan(event) {
  const view = state.fieldGuideView;
  if (!view?.dragging) return;
  if (view.pointerId != null && event?.pointerId != null && event.pointerId !== view.pointerId) return;
  const pageTurnDelta = fieldGuidePageTurnFromPointer(event, view);
  view.dragging = false;
  view.pointerId = null;
  applyFieldGuideView();
  if (event?.pointerId != null) fieldGuidePageArt?.releasePointerCapture?.(event.pointerId);
  if (pageTurnDelta !== 0) {
    turnFieldGuidePage(pageTurnDelta);
    playMenuSfx(pageTurnDelta < 0 ? "ui-back" : "ui-confirm", { volume: 0.7 });
  }
  event?.preventDefault?.();
}

fieldGuidePageArt?.addEventListener("pointerup", stopFieldGuidePan);
fieldGuidePageArt?.addEventListener("pointercancel", stopFieldGuidePan);
fieldGuidePageArt?.addEventListener("lostpointercapture", () => {
  if (state.fieldGuideView?.dragging) {
    state.fieldGuideView.dragging = false;
    applyFieldGuideView();
  }
});

fieldGuidePageArt?.addEventListener("wheel", (event) => {
  if (!state.fieldGuideOpen) return;
  ensureMenuMusicPlaying();
  if (zoomFieldGuideView(event.deltaY, event.clientX, event.clientY)) {
    event.preventDefault();
  }
}, { passive: false });

musicSlider.addEventListener("input", () => {
  state.purgeConfirm = false;
  state.settings.music = Number(musicSlider.value);
  saveSettings();
  updateMenuMusicVolume();
  ensureMenuMusicPlaying();
});

musicTrackSelect.addEventListener("change", () => {
  state.purgeConfirm = false;
  setMusicTrack(musicTrackSelect.value);
  playMenuSfx("ui-confirm", { volume: 0.65 });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = setStartMenuTheme(button.dataset.menuThemeOption);
    playMenuSfx(nextTheme === "horror" ? "transition" : "ui-confirm", { volume: 0.7 });
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const themes = availableMenuThemes();
    const currentIndex = Math.max(0, themes.indexOf(state.theme));
    const nextIndex =
      event.key === "Home" ? 0 :
      event.key === "End" ? themes.length - 1 :
      event.key === "ArrowLeft" ? currentIndex - 1 :
      currentIndex + 1;
    const nextTheme = setStartMenuTheme(themes[(nextIndex + themes.length) % themes.length]);
    themeButtons.find((themeButton) => normalizeMenuTheme(themeButton.dataset.menuThemeOption) === nextTheme)
      ?.focus({ preventScroll: true });
    playMenuSfx("ui-hover", { volume: 0.5 });
  });
});

sfxSlider.addEventListener("input", () => {
  state.purgeConfirm = false;
  state.settings.sfx = Number(sfxSlider.value);
  saveSettings();
  playMenuSfx("ui-hover", { force: true, volume: 0.65 });
});

window.addEventListener("keydown", (event) => {
  armMenuSfx();
  ensureMenuMusicPlaying();

  if (state.startingGame) {
    event.preventDefault();
    return;
  }

  if (state.runModeOpen) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "s" || event.key === "S" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      state.selectedRunMode = state.selectedRunMode === "story" ? "infinite" : "story";
      runModeButtons.find((button) => button.dataset.runMode === state.selectedRunMode)
        ?.focus({ preventScroll: true });
      playMenuSfx("ui-hover", { volume: 0.45 });
      render();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "w" || event.key === "W" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      state.selectedRunMode = state.selectedRunMode === "story" ? "infinite" : "story";
      runModeButtons.find((button) => button.dataset.runMode === state.selectedRunMode)
        ?.focus({ preventScroll: true });
      playMenuSfx("ui-hover", { volume: 0.45 });
      render();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playMenuSfx("transition", { volume: 0.7 });
      chooseRunMode(state.selectedRunMode);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeRunModeSelect();
      playMenuSfx("ui-back", { volume: 0.65 });
    }
    return;
  }

  if (state.fieldGuideOpen || state.fieldGuideClosing) {
    if (state.fieldGuideClosing) {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      turnFieldGuidePage(-1);
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      turnFieldGuidePage(1);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      const rect = fieldGuidePageArt?.getBoundingClientRect();
      if (rect) zoomFieldGuideView(-1, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      const rect = fieldGuidePageArt?.getBoundingClientRect();
      if (rect) zoomFieldGuideView(1, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (event.key === "0") {
      event.preventDefault();
      resetFieldGuideView();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeFieldGuide();
    }
    return;
  }

  if (state.optionsOpen && optionsPanel?.contains(event.target)) {
    if (event.key === "Escape") {
      event.preventDefault();
      state.optionsOpen = false;
      state.purgeConfirm = false;
      state.phase = "menu";
      playMenuSfx("ui-back");
      render();
    }
    return;
  }

  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    event.preventDefault();
    selectIndex(state.selectedIndex + 1);
    playMenuSfx("ui-hover", { volume: 0.45 });
  } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    event.preventDefault();
    selectIndex(state.selectedIndex - 1);
    playMenuSfx("ui-hover", { volume: 0.45 });
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    chooseAction(visibleMenuActions()[state.selectedIndex]?.dataset.action);
  } else if (event.key === "Escape" && state.optionsOpen) {
    state.optionsOpen = false;
    state.purgeConfirm = false;
    state.phase = "menu";
    playMenuSfx("ui-back");
    render();
  }
});

window.addEventListener("pointerdown", armMenuSfx, { capture: true });
window.addEventListener("pointerdown", () => ensureMenuMusicPlaying(), { capture: true });
window.addEventListener("pointerdown", handleRunModeOutsidePointerDown, { capture: true });
window.addEventListener("pointerdown", handleOptionsOutsidePointerDown, { capture: true });
window.addEventListener("pointerdown", handleLobPointerDown);
window.addEventListener("keydown", armMenuSfx, { capture: true });
document.addEventListener("visibilitychange", syncMenuAudioForWindowActivity);
window.addEventListener("blur", syncMenuAudioForWindowActivity);
window.addEventListener("focus", syncMenuAudioForWindowActivity);
window.addEventListener("pageshow", syncMenuAudioForWindowActivity);
window.addEventListener("storage", (event) => {
  if (![ACTIVE_RUN_STORAGE_KEY, GAME_COMPLETED_STORAGE_KEY, HORROR_MENU_UNLOCK_STORAGE_KEY, HORROR_REVEALED_STORAGE_KEY].includes(event.key)) return;
  state.activeRun = getActiveRun();
  render();
});
window.addEventListener("pageshow", () => {
  state.activeRun = getActiveRun();
  render();
});

window.render_game_to_text = () =>
  JSON.stringify({
    screen: "standalone-start-menu",
    coordinateSystem: "DOM screen; origin top-left, x right, y down",
    phase: state.phase,
    campaignShell: campaignFrame
      ? {
          active: !campaignFrame.hidden,
          screen: document.body.dataset.campaignScreen || "menu",
          ready: document.body.dataset.campaignFrameReady === "true",
          frameSrc: campaignFrame.getAttribute("src") || "",
          visibleUrlPolicy: "root-url-stays-stable-for-gameplay",
        }
      : null,
    selectedAction: visibleMenuActions()[state.selectedIndex]?.dataset.action || "none",
    menuActions: visibleMenuActions().map((button) => button.dataset.action),
    lastAction: state.lastAction,
    activeRun: state.activeRun ? {
      available: true,
      route: state.activeRun.route,
      theme: state.activeRun.theme,
      startedAt: state.activeRun.startedAt || null,
      updatedAt: state.activeRun.updatedAt || null,
    } : { available: false, storageKey: ACTIVE_RUN_STORAGE_KEY },
    optionsOpen: state.optionsOpen,
    purgeConfirm: state.purgeConfirm,
    purgeButtonLabel: purgeGameDataButton?.textContent?.trim() || null,
    runModeOpen: state.runModeOpen,
    selectedRunMode: state.selectedRunMode,
    fieldGuideClosing: state.fieldGuideClosing,
    fieldGuideCloseMs: FIELD_GUIDE_CLOSE_MS,
    startingGame: state.startingGame,
    menuLoadReveal: {
      active: state.menuLoadReveal,
      kind: state.menuLoadRevealKind,
    },
    rebootStaticReveal: state.rebootStaticReveal,
    startTransitionPhase: state.startTransitionPhase,
    startTransitionMs: START_TRANSITION_MS,
    startTransitionTiming: {
      tableSceneMs: START_TABLE_SCENE_MS,
      runExitMs: START_RUN_EXIT_MS,
    },
    startTargetUrl: startTargetUrl(),
    continueTargetUrl: state.activeRun ? startTargetUrl("continue") : null,
    theme: state.theme,
    themeRoute: `${START_MENU_TEST_URL}?theme=${state.theme}`,
    themeScope: "start-menu-only-look-field-guide-specifications",
    horrorMenuUnlocked: isHorrorMenuUnlocked(),
    gameCompleted: (() => {
      try {
        return window.localStorage.getItem(GAME_COMPLETED_STORAGE_KEY) === "1";
      } catch {
        return false;
      }
    })(),
    gameCompletedKey: GAME_COMPLETED_STORAGE_KEY,
    horrorRevealed: (() => {
      try {
        return window.localStorage.getItem(HORROR_REVEALED_STORAGE_KEY) === "1";
      } catch {
        return false;
      }
    })(),
    horrorRevealedKey: HORROR_REVEALED_STORAGE_KEY,
    themeOptionsVisible: Boolean(themeOptionRow && !themeOptionRow.hidden),
    availableThemes: availableMenuThemes(),
    themeToggleApi: isHorrorMenuUnlocked() ? "window.setStartMenuTheme('horror'|'cozy')" : "locked-to-cozy",
    horrorAsset: HORROR_START_BG_SRC,
    horrorTitleScreen:
      state.theme === "horror"
        ? {
            route: `${START_MENU_TEST_URL}?theme=horror`,
            effects: [
              "simulation-malfunction-static",
              "css-only-illusion-bleed-no-asset-swap",
              "overhead-cable-flicker",
            ],
            overlays: {
              overhead: "assets/start-menu/runtime/horror-overhead-cables-v1.webp",
              brokenRelics: "assets/start-menu/runtime/horror-broken-relics-v1.webp",
              transitionPlaque: "assets/start-menu/runtime/horror-transition-plaque-v1.webp",
            },
          }
        : null,
    settings: { ...state.settings },
    fieldGuide: {
      open: state.fieldGuideOpen,
      closing: state.fieldGuideClosing,
      title: fieldGuideDisplayName(),
      backgroundSrc:
        state.theme === "horror"
          ? "assets/start-menu/horror-field-guide-bg-v1.webp"
          : "assets/start-menu/field-guide-bg-v1.webp",
      pageCount: currentFieldGuidePages().length,
      selectedIndex: state.fieldGuideIndex,
      selectedSlug: currentFieldGuidePage().slug,
      selectedPlate: currentFieldGuidePage().plate,
      selectedTitle: currentFieldGuidePage().label,
      selectedSrc: currentFieldGuidePage().src,
      controls: FIELD_GUIDE_CONTROL_ICONS[state.theme],
      view: {
        zoom: Number((state.fieldGuideView?.zoom || 1).toFixed(3)),
        panX: Math.round(state.fieldGuideView?.panX || 0),
        panY: Math.round(state.fieldGuideView?.panY || 0),
        dragging: Boolean(state.fieldGuideView?.dragging),
      },
    },
    settingsPersistence: {
      storageKey: SETTINGS_STORAGE_KEY,
      enabled: canUseLocalStorage(),
    },
    audio: {
      musicTrack: getSelectedMusicTrack().id,
      musicTrackLabel: getSelectedMusicTrack().label,
      musicSource: getSelectedMusicTrack().src,
      availableTracks: Array.from(musicTrackSelect.options)
        .filter((option) => !option.hidden && !option.disabled)
        .map((option) => option.value),
      musicStarted: state.audio.musicStarted,
      musicBlocked: state.audio.musicBlocked,
      musicVolume: Number(menuMusic.volume.toFixed(3)),
      musicLooping: menuMusic.loop,
    },
    foodLobs: {
      active: state.activeLobs,
      spawned: state.lobSpawnCount,
      latestSize: state.lastLobSize,
      sizeRange: "desktop 90-138px, mobile 77-119px",
      motionEnabled: state.settings.motion,
      travelMode: "edge-to-edge-offscreen",
      spawnCadence: `${FOOD_LOB_SPAWN_DELAY.min}-${FOOD_LOB_SPAWN_DELAY.max}ms`,
      companionChance: FOOD_LOB_COMPANION.chance,
      movementDurationRange: `${FOOD_LOB_MOVEMENT_DURATION.min}-${FOOD_LOB_MOVEMENT_DURATION.max}ms`,
      spinRange: `${FOOD_LOB_SPIN_DEGREES.min}-${FOOD_LOB_SPIN_DEGREES.max}deg`,
      maxConcurrent: maxActiveFoodLobs(),
      activeSpeedSamples: activeLobs.slice(0, 5).map((lob) => ({
        movementMs: Math.round(lob.duration),
        spinDeg: Math.round(Math.abs(lob.spin)),
      })),
      explosions: state.lobExplosionCount,
      particles: FOOD_LOB_PARTICLES.length,
      artSet: "static-start-menu-food-lobs-v1-v2",
    },
  });

window.advanceTime = (ms = 1000 / 60) => {
  updateFoodLobs(ms);
  render();
};

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function titleCaseSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function horrorFieldGuideSrc(slug, plate) {
  if (slug === "toast-tortoise") {
    return `${FIELD_GUIDE_ASSET_BASE}/horror/toast-tortoise-invasive-pilot-brain-war-machine-journal-v3-hd-pixel-chromakey-clean.webp`;
  }
  if (slug === "sushi-seal") {
    return `${FIELD_GUIDE_ASSET_BASE}/horror/sushi-seal-invasive-pilot-brain-war-machine-journal-v1-hd-pixel-chromakey-clean.webp`;
  }
  if (slug === "cucumber-cobra") {
    return `${FIELD_GUIDE_ASSET_BASE}/horror/cucumber-cobra-horror-engineering-field-journal-plate-32-v2-hd-pixel-transparent.webp`;
  }
  return `${FIELD_GUIDE_ASSET_BASE}/horror/${slug}-horror-engineering-field-journal-plate-${plate}-v1-hd-pixel-chromakey.webp`;
}

function currentFieldGuidePages() {
  return window.FoodAnimalsFieldGuideRuntime.pagesForTheme(state.theme, FIELD_GUIDE_PAGES, SPECIFICATIONS_PAGES);
}

function fieldGuideDisplayName() {
  return window.FoodAnimalsFieldGuideRuntime.displayName(state.theme);
}

function currentFieldGuidePage() {
  return window.FoodAnimalsFieldGuideRuntime.currentPage(
    state.theme,
    state.fieldGuideIndex,
    FIELD_GUIDE_PAGES,
    SPECIFICATIONS_PAGES,
  );
}

function resetFieldGuideView() {
  state.fieldGuideView = window.FoodAnimalsFieldGuideRuntime.resetView(state.fieldGuideView);
  applyFieldGuideView();
}

function fieldGuideRuntimeConfig() {
  return {
    zoomMin: FIELD_GUIDE_ZOOM_MIN,
    zoomMax: FIELD_GUIDE_ZOOM_MAX,
    zoomStep: FIELD_GUIDE_ZOOM_STEP,
    tapMaxPx: FIELD_GUIDE_TAP_MAX_PX,
    swipeMinPx: FIELD_GUIDE_SWIPE_MIN_PX,
    swipeAxisBias: FIELD_GUIDE_SWIPE_AXIS_BIAS,
  };
}

function clampFieldGuideView() {
  const view = state.fieldGuideView || (state.fieldGuideView = {});
  return window.FoodAnimalsFieldGuideRuntime.clampView(
    view,
    fieldGuidePageArt?.getBoundingClientRect(),
    fieldGuideRuntimeConfig(),
  );
}

function applyFieldGuideView() {
  if (!fieldGuideViewport || !fieldGuidePageArt) return;
  const view = clampFieldGuideView();
  window.FoodAnimalsFieldGuideRuntime.applyView(fieldGuideViewport, fieldGuidePageArt, view);
}

function zoomFieldGuideView(deltaY, clientX, clientY) {
  if (!state.fieldGuideOpen || !fieldGuidePageArt) return false;
  const rect = fieldGuidePageArt.getBoundingClientRect();
  const view = state.fieldGuideView || (state.fieldGuideView = {});
  const result = window.FoodAnimalsFieldGuideRuntime.zoomView(
    view,
    rect,
    deltaY,
    clientX,
    clientY,
    fieldGuideRuntimeConfig(),
  );
  if (!result.changed) return false;
  applyFieldGuideView();
  return true;
}

function fieldGuidePageTurnFromPointer(event, view) {
  return window.FoodAnimalsFieldGuideRuntime.pageTurnFromPointer(
    event,
    view,
    fieldGuidePageArt?.getBoundingClientRect(),
    { open: state.fieldGuideOpen, closing: state.fieldGuideClosing },
    fieldGuideRuntimeConfig(),
  );
}

function renderFieldGuide() {
  if (!fieldGuideImage || !fieldGuideTitle || !fieldGuideCount) return;

  const pages = currentFieldGuidePages();
  const page = currentFieldGuidePage();
  const pageKey = `${state.theme}:${page.slug}`;
  if (fieldGuideImage.dataset.pageKey !== pageKey) {
    const loadToken = ++fieldGuideImageLoadToken;
    fieldGuideImage.alt =
      page.alt ||
      (state.theme === "horror"
        ? `${page.label} specifications page`
        : `${page.label} anatomy journal page`);
    fieldGuideImage.dataset.slug = page.slug;
    fieldGuideImage.dataset.pageKey = pageKey;
    fieldGuideImage.style.visibility = page.chromaKey ? "hidden" : "";
    resolveFieldGuideImageSrc(page).then((src) => {
      if (loadToken !== fieldGuideImageLoadToken || fieldGuideImage.dataset.pageKey !== pageKey) return;
      fieldGuideImage.src = src;
      fieldGuideImage.style.visibility = "";
    });
    restartFieldGuideFlip();
  }

  fieldGuide.classList.toggle("is-cover-page", page.isCover === true);
  fieldGuidePageArt.classList.toggle("is-cover-art", page.isCover === true);
  fieldGuideImage.classList.toggle("is-cover-art", page.isCover === true);
  fieldGuideTitle.textContent = page.label;
  fieldGuideCount.textContent =
    page.isCover === true
      ? `${pages.length - 1} ${state.theme === "horror" ? "specifications" : "plates"}`
      : `Plate ${page.plate} - ${state.fieldGuideIndex} / ${pages.length - 1}`;
  applyFieldGuideView();
}

function renderFieldGuideControlIcons() {
  const icons = FIELD_GUIDE_CONTROL_ICONS[state.theme] || FIELD_GUIDE_CONTROL_ICONS.cozy;
  fieldGuideButtons.forEach((button) => {
    const action = button.dataset.guideAction;
    const icon = icons[action];
    const image = button.querySelector(".field-guide-control-icon");
    if (!image || !icon || image.getAttribute("src") === icon) return;
    image.src = icon;
  });
}

function resolveFieldGuideImageSrc(page) {
  return window.FoodAnimalsFieldGuideRuntime.resolveImageSrc(page, chromaKeyImageCache);
}

function connectedChromaKeyPixels(data, width, height, keyColor) {
  return window.FoodAnimalsFieldGuideRuntime.connectedChromaKeyPixels(data, width, height, keyColor);
}

function beginStartTransition(mode = "start") {
  clearStartTransitionTimers();
  clearFieldGuideCloseTimer();
  state.phase = "startingGame";
  state.optionsOpen = false;
  state.fieldGuideOpen = false;
  state.fieldGuideClosing = false;
  state.startingGame = true;
  state.startTransitionPhase = "settingTable";
  state.startMode = mode;
  clearFoodLobTimer();
  window.dispatchEvent(new CustomEvent("food-animals:start-menu:start"));
  render();

  startTableTimer = window.setTimeout(() => {
    startTableTimer = null;
    state.phase = "enteringRun";
    state.startTransitionPhase = "enteringRun";
    window.dispatchEvent(new CustomEvent("food-animals:start-menu:enter-run"));
    render();

    startRunTimer = window.setTimeout(() => {
      startRunTimer = null;
      window.dispatchEvent(new CustomEvent("food-animals:start-menu:navigate-run"));
      openCampaignTarget(startTargetUrl(mode), mode === "continue" || mode === "infinite" ? "game" : "opening");
    }, START_RUN_EXIT_MS);
  }, START_TABLE_SCENE_MS);
}

function clearStartTransitionTimers() {
  if (startTableTimer !== null) {
    window.clearTimeout(startTableTimer);
    startTableTimer = null;
  }
  if (startRunTimer !== null) {
    window.clearTimeout(startRunTimer);
    startRunTimer = null;
  }
}

function clearFieldGuideCloseTimer() {
  if (fieldGuideCloseTimer !== null) {
    window.clearTimeout(fieldGuideCloseTimer);
    fieldGuideCloseTimer = null;
  }
}

function clearRebootStaticTimer() {
  if (rebootStaticTimer !== null) {
    window.clearTimeout(rebootStaticTimer);
    rebootStaticTimer = null;
  }
}

function clearMenuLoadRevealTimer() {
  if (menuLoadRevealTimer !== null) {
    window.clearTimeout(menuLoadRevealTimer);
    menuLoadRevealTimer = null;
  }
}

function beginMenuRebootStaticReveal() {
  if (!rebootStaticOverlay || !consumeMenuRebootStaticReveal()) return;
  clearRebootStaticTimer();
  consumeMenuReturnReveal();
  state.rebootStaticReveal = true;
  playMenuSfx("signal-static", { force: true, volume: 0.82, rate: 0.86 });
  rebootStaticTimer = window.setTimeout(() => {
    rebootStaticTimer = null;
    state.rebootStaticReveal = false;
    render();
  }, 1500);
}

function beginMenuLoadReveal() {
  if (!menuLoadTransitionOverlay || state.rebootStaticReveal) return;
  clearMenuLoadRevealTimer();
  state.menuLoadRevealKind = consumeMenuReturnReveal() ? "return" : "load";
  state.menuLoadReveal = true;
  if (state.menuLoadRevealKind === "return") {
    playMenuSfx("signal-static", { force: true, volume: 0.48, rate: 1.08 });
  }
  const duration = state.menuLoadRevealKind === "return" ? 1100 : 900;
  menuLoadRevealTimer = window.setTimeout(() => {
    menuLoadRevealTimer = null;
    state.menuLoadReveal = false;
    render();
  }, duration);
}

function fieldGuideCloseDuration() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? 1 : FIELD_GUIDE_CLOSE_MS;
}

function finishFieldGuideClose() {
  clearFieldGuideCloseTimer();
  state.fieldGuideClosing = false;
  state.phase = state.optionsOpen ? "options" : "menu";
  visibleMenuActions()[state.selectedIndex]?.focus({ preventScroll: true });
  render();
}

window.addEventListener("pagehide", () => {
  menuMusic.pause();
  window.FoodAnimalsAudioRuntime.pauseAll(menuSfx);
  clearStartTransitionTimers();
  clearFieldGuideCloseTimer();
  clearRebootStaticTimer();
  clearMenuLoadRevealTimer();
});

function navigateToRunNow() {
  clearStartTransitionTimers();
  window.dispatchEvent(new CustomEvent("food-animals:start-menu:navigate-run"));
  openCampaignTarget(startTargetUrl(state.startMode || "start"), state.startMode === "continue" || state.startMode === "infinite" ? "game" : "opening");
}

window.startMenuNavigateToRunNow = () => {
  if (!state.startingGame) {
    beginStartTransition();
    return;
  }
  navigateToRunNow();
};

function restartFieldGuideFlip() {
  if (!fieldGuideImage || !state.fieldGuideOpen) return;
  fieldGuideImage.classList.remove("is-flipping-next", "is-flipping-prev");
  void fieldGuideImage.offsetWidth;
  fieldGuideImage.classList.add(
    state.fieldGuideDirection === "prev" ? "is-flipping-prev" : "is-flipping-next",
  );
}

function turnFieldGuidePage(delta) {
  const pages = currentFieldGuidePages();
  const nextIndex = (state.fieldGuideIndex + delta + pages.length) % pages.length;
  state.fieldGuideDirection = delta < 0 ? "prev" : "next";
  state.fieldGuideIndex = nextIndex;
  resetFieldGuideView();
  preloadFieldGuideNeighbors();
  render();
}

function closeFieldGuide() {
  if (state.fieldGuideClosing) return;
  if (state.fieldGuideView) state.fieldGuideView.dragging = false;
  if (!state.fieldGuideOpen) {
    finishFieldGuideClose();
    return;
  }
  state.fieldGuideOpen = false;
  state.fieldGuideClosing = true;
  state.phase = "fieldGuideClosing";
  fieldGuideCloseTimer = window.setTimeout(finishFieldGuideClose, fieldGuideCloseDuration());
  render();
}

function preloadFieldGuideNeighbors() {
  const pages = currentFieldGuidePages();
  [-1, 0, 1].forEach((offset) => {
    const page = pages[(state.fieldGuideIndex + offset + pages.length) % pages.length];
    if (page.chromaKey) {
      resolveFieldGuideImageSrc(page);
      return;
    }
    const img = new Image();
    img.src = page.src;
  });
}

function maxActiveFoodLobs(width = window.innerWidth) {
  return window.FoodAnimalsFoodLobRuntime.maxActive(width, FOOD_LOB_MAX_ACTIVE);
}

function normalizeMenuTheme(value) {
  return window.FoodAnimalsThemeAssets.normalizeMenuTheme(value, DEFAULT_MENU_THEME);
}

function isHorrorMenuUnlocked() {
  try {
    return (
      window.localStorage.getItem(HORROR_REVEALED_STORAGE_KEY) === "1" ||
      window.localStorage.getItem(HORROR_MENU_UNLOCK_STORAGE_KEY) === "1" ||
      window.localStorage.getItem(GAME_COMPLETED_STORAGE_KEY) === "1"
    );
  } catch {
    return false;
  }
}

function allowedMenuTheme(theme) {
  const normalized = normalizeMenuTheme(theme);
  return normalized === "horror" && !isHorrorMenuUnlocked() ? "cozy" : normalized;
}

function isMenuThemeAvailable(theme) {
  const normalized = normalizeMenuTheme(theme);
  return normalized === "cozy" || isHorrorMenuUnlocked();
}

function availableMenuThemes() {
  return ["cozy", "horror"].filter(isMenuThemeAvailable);
}

function isHorrorMusicTrack(trackId) {
  return String(trackId || "").startsWith("horror-");
}

function musicTrackTheme(trackId) {
  return isHorrorMusicTrack(trackId) ? "horror" : "cozy";
}

function isMusicTrackAllowedForTheme(trackId, theme = state.theme) {
  return musicTrackTheme(trackId) === normalizeMenuTheme(theme);
}

function coerceMusicTrackToTheme(theme = state.theme) {
  const normalizedTheme = normalizeMenuTheme(theme);
  const selectedTrack = getMusicTrack(state.settings.musicTrack);
  if (isMusicTrackAllowedForTheme(selectedTrack.id, normalizedTheme)) return false;
  state.settings.musicTrack = defaultMusicTrackForTheme(normalizedTheme);
  return true;
}

function coerceLockedMenuState() {
  const horrorMenuUnlocked = isHorrorMenuUnlocked();
  state.theme = horrorMenuUnlocked ? normalizeMenuTheme(state.theme) : "cozy";
  coerceMusicTrackToTheme(state.theme);
  return horrorMenuUnlocked;
}

function renderMusicTrackOptions() {
  Array.from(musicTrackSelect.options).forEach((option) => {
    const mismatchedTheme = !isMusicTrackAllowedForTheme(option.value, state.theme);
    option.hidden = mismatchedTheme;
    option.disabled = mismatchedTheme;
  });
}

function renderPurgeGameDataButton() {
  if (!purgeGameDataButton) return;
  purgeGameDataButton.textContent = state.purgeConfirm ? "Confirm Purge Game Data" : "Purge Game Data";
  purgeGameDataButton.classList.toggle("is-confirming", state.purgeConfirm);
  purgeGameDataButton.setAttribute("aria-pressed", String(state.purgeConfirm));
}

function hasExplicitMenuThemeParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    return ["menuTheme", "theme", "reality", "startTheme"].some((key) => params.has(key));
  } catch {
    return false;
  }
}

function initialMenuTheme() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!hasExplicitMenuThemeParam()) return DEFAULT_MENU_THEME;
    return allowedMenuTheme(
      params.get("menuTheme") ||
        params.get("theme") ||
        params.get("reality") ||
        params.get("startTheme"),
    );
  } catch {
    return DEFAULT_MENU_THEME;
  }
}

function startTargetUrl(mode = "start") {
  if (mode === "continue" && state.activeRun?.route) {
    return activeRunTargetUrl(state.activeRun);
  }
  const targetBase = mode === "infinite" ? GAME_TARGET_BASE_URL : START_TARGET_BASE_URL;
  const url = appUrl(targetBase);
  url.searchParams.set("from", "start-menu");
  if (mode === "infinite") {
    url.searchParams.set("mode", "infinite");
    url.searchParams.set("reality", state.theme === "horror" ? "horror" : "cozy");
  }
  return url.href;
}

function visibleMenuActions() {
  return actions.filter((button) => !button.hidden);
}

function normalizeSelectedIndex() {
  const visible = visibleMenuActions();
  if (!visible.length) {
    state.selectedIndex = 0;
    return;
  }
  state.selectedIndex = Math.max(0, Math.min(state.selectedIndex, visible.length - 1));
}

function activeRunTargetUrl(run) {
  return window.FoodAnimalsRunStorage.targetUrl(run, {
    appUrl,
    baseURI: document.baseURI || window.location.href,
    gameTarget: GAME_TARGET_BASE_URL,
  });
}

function getActiveRun() {
  const run = window.FoodAnimalsRunStorage.activeRecord(ACTIVE_RUN_STORAGE_KEY);
  if (savedRunLooksCleared(run)) {
    clearActiveRun();
    return null;
  }
  return run;
}

function clearActiveRun() {
  window.FoodAnimalsRunStorage.clear(ACTIVE_RUN_STORAGE_KEY);
  state.activeRun = null;
}

function savedRunLooksCleared(run) {
  const savedState = run?.snapshot?.state;
  if (!savedState || typeof savedState !== "object") return false;
  if (savedState.runConcluded === true || savedState.campaignCleared === true) return true;
  if (Number(savedState.hearts) <= 0) return true;
  if (savedState.phase === "victoryCutscene" || savedState.finalVictoryTransition || savedState.victoryCutscene) return true;
  if (savedState.activeStory?.id === FINAL_TABS_STORY_ID) return true;
  const clearedFinalResult =
    savedState.runMode !== "infinite" &&
    savedState.realityBroken === true &&
    Number(savedState.round) >= FINAL_VICTORY_ROUND &&
    Array.isArray(savedState.rewardChoices) &&
    savedState.rewardChoices.length === 0 &&
    (savedState.message === "Final objective secured" || savedState.message === "Hope returns");
  return clearedFinalResult;
}

function purgeGameData() {
  let purged = false;
  try {
    window.localStorage.removeItem(ACTIVE_RUN_STORAGE_KEY);
    window.localStorage.removeItem(GAME_COMPLETED_STORAGE_KEY);
    window.localStorage.removeItem(HORROR_MENU_UNLOCK_STORAGE_KEY);
    window.localStorage.removeItem(HORROR_REVEALED_STORAGE_KEY);
    purged = true;
  } catch {
    purged = false;
  }
  try {
    window.sessionStorage.removeItem(MENU_REBOOT_STATIC_STORAGE_KEY);
  } catch {
    // Purging saved progression should still work when session storage is blocked.
  }
  state.activeRun = null;
  state.purgeConfirm = false;
  coerceLockedMenuState();
  setMusicTrack(getSelectedMusicTrack().id);
  saveSettings();
  return purged;
}

function markCampaignFrameReady(loadToken = campaignFrameLoadToken) {
  window.requestAnimationFrame(() => {
    if (loadToken === campaignFrameLoadToken) {
      document.body.dataset.campaignFrameReady = "true";
    }
  });
}

function pauseMenuAudioForCampaign() {
  menuMusic.pause();
  menuMusicPlayPromise = null;
  window.FoodAnimalsAudioRuntime.pauseAll(menuSfx);
}

function openCampaignTarget(url, screen = "opening") {
  if (!campaignFrame) {
    window.location.href = url;
    return;
  }
  pauseMenuAudioForCampaign();
  const loadToken = ++campaignFrameLoadToken;
  delete document.body.dataset.campaignFrameReady;
  document.body.dataset.campaignScreen = screen;
  campaignFrame.hidden = false;
  campaignFrame.addEventListener("load", () => {
    if (loadToken !== campaignFrameLoadToken) return;
    markCampaignFrameReady(loadToken);
  }, { once: true });
  campaignFrame.src = url;
}

window.addEventListener("message", (event) => {
  if (!campaignFrame || event.source !== campaignFrame.contentWindow) return;
  if (event.origin !== window.location.origin) return;
  const data = event.data || {};
  if (data.type === "food-animals:opening-vn:ready") {
    markCampaignFrameReady();
    return;
  }
  if (data.type !== "food-animals:opening-vn:complete") return;
  openCampaignTarget(data.targetUrl || appUrl(GAME_TARGET_BASE_URL).href, "game");
});

function clearActiveFoodLobs() {
  clearFoodLobTimer();
  while (activeLobs.length > 0) {
    removeLobAt(activeLobs.length - 1);
  }
}

function setStartMenuTheme(theme) {
  const nextTheme = allowedMenuTheme(theme);
  if (nextTheme === state.theme) {
    render();
    return state.theme;
  }
  state.theme = nextTheme;
  state.fieldGuideIndex = Math.min(state.fieldGuideIndex, currentFieldGuidePages().length - 1);
  resetFieldGuideView();
  coerceMusicTrackToTheme(state.theme);
  if (state.theme === "horror") {
    clearActiveFoodLobs();
  } else {
    scheduleNextFoodLob(FOOD_LOB_SPAWN_DELAY.initial);
  }
  saveSettings();
  render();
  return state.theme;
}

function clearFoodLobTimer() {
  if (nextLobTimer) {
    window.clearTimeout(nextLobTimer);
    nextLobTimer = null;
  }
}

function scheduleNextFoodLob(delay = randomBetween(FOOD_LOB_SPAWN_DELAY.min, FOOD_LOB_SPAWN_DELAY.max)) {
  clearFoodLobTimer();
  if (!state.settings.motion || state.theme === "horror") return;
  nextLobTimer = window.setTimeout(() => {
    spawnFoodLob({ automatic: true });
    if (state.settings.motion && activeLobs.length < maxActiveFoodLobs() && Math.random() < FOOD_LOB_COMPANION.chance) {
      window.setTimeout(
        () => spawnFoodLob({ automatic: true }),
        randomBetween(FOOD_LOB_COMPANION.delayMin, FOOD_LOB_COMPANION.delayMax),
      );
    }
    scheduleNextFoodLob();
  }, delay);
}

function spawnFoodLob(options = {}) {
  if (!state.settings.motion || state.theme === "horror" || !lobLayer) return null;

  const bounds = lobLayer.getBoundingClientRect();
  const maxActive = maxActiveFoodLobs(bounds.width);
  if (options.automatic && activeLobs.length >= maxActive) return null;

  const fromLeft = typeof options.fromLeft === "boolean" ? options.fromLeft : nextLobFromLeft;
  nextLobFromLeft = !fromLeft;
  const mobileScale = bounds.width < 600 ? 0.86 : 1;
  const size = Math.round(randomBetween(90, 138) * mobileScale);
  const menuRect = document.querySelector(".primary-menu")?.getBoundingClientRect();
  const menuBottom = menuRect ? clamp(menuRect.bottom - bounds.top, 0, bounds.height) : bounds.height * 0.34;
  const path = window.FoodAnimalsFoodLobRuntime.planPath({
    activeLobs,
    bounds,
    durationRange: FOOD_LOB_MOVEMENT_DURATION,
    fromLeft,
    menuBottom,
    randomBetween,
    size,
    spinDegrees: FOOD_LOB_SPIN_DEGREES,
  });
  const img = document.createElement("img");
  const src = FOOD_LOB_PARTICLES[Math.floor(Math.random() * FOOD_LOB_PARTICLES.length)];
  const lob = {
    el: img,
    age: 0,
    duration: path.duration,
    startX: path.startX,
    endX: path.endX,
    startY: path.startY,
    endY: path.endY,
    arcHeight: path.arcHeight,
    drift: path.drift,
    spin: path.spin,
    size,
    src,
  };

  img.className = "food-lob";
  img.alt = "";
  img.decoding = "async";
  img.loading = "eager";
  img.src = src;
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;

  state.activeLobs += 1;
  state.lobSpawnCount += 1;
  state.lastLobSize = size;
  activeLobs.push(lob);
  lobLayer.appendChild(img);
  applyLobFrame(lob, 0);
  ensureLobAnimation();

  return img;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampSetting(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function canUseLocalStorage() {
  return window.FoodAnimalsAudioSettings.canUseLocalStorage(SETTINGS_STORAGE_KEY);
}

function canUseSessionStorage() {
  try {
    const key = `${MENU_REBOOT_STATIC_STORAGE_KEY}:probe`;
    window.sessionStorage.setItem(key, "1");
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function consumeMenuRebootStaticReveal() {
  if (!canUseSessionStorage()) return false;
  try {
    const active = window.sessionStorage.getItem(MENU_REBOOT_STATIC_STORAGE_KEY) === "1";
    window.sessionStorage.removeItem(MENU_REBOOT_STATIC_STORAGE_KEY);
    return active;
  } catch {
    return false;
  }
}

function consumeMenuReturnReveal() {
  if (!canUseSessionStorage()) return false;
  try {
    const active = window.sessionStorage.getItem(MENU_RETURN_REVEAL_STORAGE_KEY) === "1";
    window.sessionStorage.removeItem(MENU_RETURN_REVEAL_STORAGE_KEY);
    return active;
  } catch {
    return false;
  }
}

function loadSettings() {
  try {
    const savedSettings = window.FoodAnimalsAudioSettings.read(SETTINGS_STORAGE_KEY);
    if (!Object.keys(savedSettings).length) return false;
    state.settings.music = clampSetting(savedSettings.music, 0, 10, state.settings.music);
    state.settings.sfx = clampSetting(savedSettings.sfx, 0, 10, state.settings.sfx);
    state.settings.musicTrack = getMusicTrack(savedSettings.musicTrack).id;
    if (!hasExplicitMenuThemeParam() && typeof savedSettings.menuTheme === "string") {
      state.theme = allowedMenuTheme(savedSettings.menuTheme);
    }
    coerceLockedMenuState();

    if (typeof savedSettings.motion === "boolean") {
      state.settings.motion = savedSettings.motion;
    }
    return true;
  } catch {
    // Keep defaults if storage is unavailable or contains malformed data.
    return false;
  }
}

function saveSettings() {
  window.FoodAnimalsAudioSettings.patch({
    music: state.settings.music,
    musicTrack: getSelectedMusicTrack().id,
    sfx: state.settings.sfx,
    motion: state.settings.motion,
    menuTheme: state.theme,
  }, SETTINGS_STORAGE_KEY);
}

function menuSfxVolume() {
  return clamp01(state.settings.sfx / 10);
}

function menuSfxSrc(id) {
  const themeTracks = MENU_SFX_TRACKS[state.theme] || MENU_SFX_TRACKS.cozy;
  return themeTracks[id] || MENU_SFX_TRACKS.cozy[id] || null;
}

function menuSfxPoolFor(src) {
  return window.FoodAnimalsAudioRuntime.poolFor(menuSfx, src, 3);
}

function playMenuSfx(id, options = {}) {
  window.FoodAnimalsAudioRuntime.playSfx(menuSfx, {
    src: menuSfxSrc(id),
    force: options.force,
    volume: menuSfxVolume() * (options.volume ?? 1),
    rate: options.rate,
    poolSize: 3,
  });
}

function armMenuSfx() {
  menuSfx.armed = true;
}

function getMusicTrack(trackId) {
  return MUSIC_TRACKS.find((track) => track.id === trackId) || MUSIC_TRACKS[0];
}

function defaultMusicTrackForTheme(theme) {
  return theme === "horror" ? DEFAULT_HORROR_MUSIC_TRACK : DEFAULT_MUSIC_TRACK;
}

function getSelectedMusicTrack() {
  const track = getMusicTrack(state.settings.musicTrack || defaultMusicTrackForTheme(state.theme));
  return isMusicTrackAllowedForTheme(track.id, state.theme)
    ? track
    : getMusicTrack(defaultMusicTrackForTheme(state.theme));
}

function setMusicTrack(trackId) {
  const requestedTrack = getMusicTrack(trackId);
  const track = isMusicTrackAllowedForTheme(requestedTrack.id, state.theme)
    ? requestedTrack
    : getMusicTrack(defaultMusicTrackForTheme(state.theme));
  const wasPlaying = !menuMusic.paused || Boolean(menuMusicPlayPromise);
  state.settings.musicTrack = track.id;
  saveSettings();

  if (currentMusicTrackId !== track.id) {
    menuMusicPlayPromise = null;
    currentMusicTrackId = track.id;
    menuMusic.pause();
    menuMusic.currentTime = 0;
    menuMusic.src = track.src;
    menuMusic.load();
    state.audio.musicStarted = false;
    state.audio.musicBlocked = false;
  }

  updateMenuMusicVolume();
  if (wasPlaying || state.settings.music > 0) {
    ensureMenuMusicPlaying();
  }
  render();
}

function updateMenuMusicVolume() {
  const volume = clamp01(state.settings.music / 10) * MENU_MUSIC_MAX_VOLUME;
  menuMusic.volume = volume;
  if (volume === 0 && !menuMusic.paused) {
    menuMusic.pause();
  }
}

function ensureMenuMusicPlaying() {
  updateMenuMusicVolume();

  if (!window.FoodAnimalsAudioRuntime.isWindowActive()) {
    if (!menuMusic.paused) menuMusic.pause();
    return;
  }

  if (state.settings.music <= 0 || !menuMusic.paused || menuMusicPlayPromise) return;

  menuMusicPlayPromise = menuMusic
    .play()
    .then(() => {
      state.audio.musicStarted = true;
      state.audio.musicBlocked = false;
      menuMusicPlayPromise = null;
    })
    .catch(() => {
      state.audio.musicBlocked = true;
      menuMusicPlayPromise = null;
    });
}

function syncMenuAudioForWindowActivity() {
  if (!window.FoodAnimalsAudioRuntime.isWindowActive()) {
    menuMusic.pause();
    window.FoodAnimalsAudioRuntime.pauseAll(menuSfx);
    return;
  }

  if (state.settings.music > 0 && (state.audio.musicStarted || state.audio.musicBlocked || menuMusicPlayPromise)) {
    ensureMenuMusicPlaying();
  }
}

function applyLobFrame(lob, t) {
  window.FoodAnimalsFoodLobRuntime.applyFrame(lob, t);
}

function removeLobAt(index) {
  const [lob] = activeLobs.splice(index, 1);
  if (!lob) return;
  lob.el.remove();
  state.activeLobs = Math.max(0, state.activeLobs - 1);
}

function handleLobPointerDown(event) {
  if (state.fieldGuideOpen || state.runModeOpen || !lobLayer || event.target.closest("button, input, label")) return;

  const index = window.FoodAnimalsFoodLobRuntime.hitIndex(activeLobs, event);
  if (index >= 0) explodeLobAt(index);
}

function explodeLobAt(index) {
  const lob = activeLobs[index];
  if (!lob || !lobLayer) return false;

  const rect = lob.el.getBoundingClientRect();
  const layerRect = lobLayer.getBoundingClientRect();
  const centerX = rect.left - layerRect.left + rect.width / 2;
  const centerY = rect.top - layerRect.top + rect.height / 2;
  const src = lob.src || lob.el.currentSrc || lob.el.src;
  const size = lob.size;
  removeLobAt(index);
  createFoodExplosion(centerX, centerY, src, size);
  return true;
}

function createFoodExplosion(centerX, centerY, src, size) {
  const ring = document.createElement("span");
  const ringSize = Math.round(size * 1.65);
  ring.className = "food-burst-ring";
  ring.style.setProperty("--burst-left", `${(centerX - ringSize / 2).toFixed(2)}px`);
  ring.style.setProperty("--burst-top", `${(centerY - ringSize / 2).toFixed(2)}px`);
  ring.style.setProperty("--burst-ring-size", `${ringSize}px`);
  lobLayer.appendChild(ring);
  ring.addEventListener("animationend", () => ring.remove(), { once: true });

  const pieceCount = 8;
  const pieceSize = Math.round(Math.max(40, Math.min(72, size * 0.48)));
  const baseAngle = randomBetween(0, Math.PI * 2);

  for (let i = 0; i < pieceCount; i += 1) {
    const angle = baseAngle + (i / pieceCount) * Math.PI * 2 + randomBetween(-0.18, 0.18);
    const distance = randomBetween(size * 0.5, size * 1.08);
    const startJitter = randomBetween(-5, 5);
    const piece = document.createElement("img");
    piece.className = "food-burst-piece";
    piece.alt = "";
    piece.decoding = "async";
    piece.src = src;
    piece.style.setProperty("--burst-size", `${pieceSize}px`);
    piece.style.setProperty("--burst-start-x", `${(centerX - pieceSize / 2 + startJitter).toFixed(2)}px`);
    piece.style.setProperty("--burst-start-y", `${(centerY - pieceSize / 2 - startJitter).toFixed(2)}px`);
    piece.style.setProperty("--burst-end-x", `${(centerX - pieceSize / 2 + Math.cos(angle) * distance).toFixed(2)}px`);
    piece.style.setProperty("--burst-end-y", `${(centerY - pieceSize / 2 + Math.sin(angle) * distance).toFixed(2)}px`);
    piece.style.setProperty("--burst-rotate", `${Math.round(randomBetween(-240, 240))}deg`);
    piece.style.animationDelay = `${Math.round(randomBetween(0, 40))}ms`;
    lobLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }

  state.lobExplosionCount += 1;
}

function updateFoodLobs(deltaMs) {
  for (let index = activeLobs.length - 1; index >= 0; index -= 1) {
    const lob = activeLobs[index];
    lob.age += deltaMs;
    const t = lob.age / lob.duration;
    if (t >= 1) {
      removeLobAt(index);
    } else {
      applyLobFrame(lob, t);
    }
  }

  if (activeLobs.length === 0 && lobAnimationFrame) {
    window.cancelAnimationFrame(lobAnimationFrame);
    lobAnimationFrame = null;
    lastLobFrameTime = 0;
  }
}

function ensureLobAnimation() {
  if (lobAnimationFrame) return;

  const tick = (timestamp) => {
    const delta = lastLobFrameTime ? Math.min(50, timestamp - lastLobFrameTime) : 1000 / 60;
    lastLobFrameTime = timestamp;
    updateFoodLobs(delta);
    if (activeLobs.length > 0) {
      lobAnimationFrame = window.requestAnimationFrame(tick);
    } else {
      lobAnimationFrame = null;
      lastLobFrameTime = 0;
    }
  };

  lobAnimationFrame = window.requestAnimationFrame(tick);
}

window.spawnFoodLob = spawnFoodLob;
window.explodeFirstFoodLob = () => explodeLobAt(activeLobs.length - 1);
window.setStartMenuTheme = setStartMenuTheme;

beginMenuRebootStaticReveal();
beginMenuLoadReveal();
render();
scheduleNextFoodLob(FOOD_LOB_SPAWN_DELAY.initial);
