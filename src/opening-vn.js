const beats = [
  {
    speaker: "SYSTEM",
    mood: "cryo",
    text: "Cold light presses through your eyelids. Somewhere above you, greenhouse fans turn with the patience of old machinery.",
  },
  {
    speaker: "You",
    mood: "cryo",
    inner: true,
    text: "My lungs remember breathing before I remember my name.",
  },
  {
    speaker: "Tabs",
    mood: "cryo",
    text: "Welcome back, Pattern Coordinator. I am extremely confident this is the right moment for calm, oxygen-friendly panic management.",
  },
  {
    speaker: "You",
    mood: "cryo",
    text: "That is a cat.",
  },
  {
    speaker: "Tabs",
    mood: "counter",
    text: "Correct. Tabs, specifically. Shopkeeper, inventory manager, morale officer, and the only person here who stayed awake on purpose. Reassuring credentials, yes?",
  },
  {
    speaker: "You",
    mood: "counter",
    inner: true,
    text: "The room smells like wet soil and antiseptic. My hands know the cold rail of the pod, but not how I got inside it, and the cat is acting like that is a minor scheduling detail.",
  },
  {
    speaker: "Tabs",
    mood: "counter",
    text: "Project Green Ark. A buried agricultural lab. You were in cryosleep longer than anyone wrote down neatly. My explanation is already cleaner than the records, makes perfect sense, right?",
  },
  {
    speaker: "You",
    mood: "counter",
    text: "No. It does not make perfect sense. I do not remember agreeing to this.",
  },
  {
    speaker: "Tabs",
    mood: "terminal",
    text: "Memory thaw is messy, which I say with professional certainty. Also, several records are damaged in ways I am choosing to describe as time-related.",
  },
  {
    speaker: "Tabs",
    mood: "terminal",
    text: "Surface telemetry is also quiet in several boring, survivable ways. No current human channels, no civilian pings, no dates I enjoy saying aloud.",
  },
  {
    speaker: "Tabs",
    mood: "terminal",
    text: "Keep that objection close. It is probably load-bearing. Follow me; the explanation works better in the room with the presentation wall.",
  },
  {
    speaker: "SYSTEM",
    mood: "presentation",
    text: "Tabs pads through the sealed door. The cryo chamber gives way to a brighter briefing room, where warm projectors wait over a stack of cheerful scientific documents.",
  },
  {
    speaker: "Tabs",
    mood: "terminal",
    text: "Humanity's food systems collapsed. Green Ark was built to grow a backup supply that could keep renewing itself. Elegant, grim, surprisingly well-labeled.",
  },
  {
    speaker: "You",
    mood: "terminal",
    text: "And the backup is animals made of food. I want you to hear how insane that sounds when a person says it slowly.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "Food animals. Living recipes with instincts. Arrange compatible ones, and they self-order into stable herds. Beautifully direct system logic.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "Unlike livestock, food animals are wholly editable. Flavor, growth, yield, temperament: all tunable, which is why one stable herd can outproduce an old-world pasture.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "The old world loved teaching animals to recognize shapes. Green Ark inherited that research because every terrible archive survives if someone labels it useful.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "Each herd is a tiny food web. If left alone, they overfeed, spoil, split, and starve in every direction at once. Obvious problem, obvious stakes.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "The contests create pressure. Stable patterns hold together. Unstable ones break down into clean biomatter. Makes perfect sense, right?",
  },
  {
    speaker: "You",
    mood: "animals",
    inner: true,
    text: "He says it like certainty is a blanket he can throw over the horror. I hear hunger with better paperwork.",
  },
  {
    speaker: "You",
    mood: "animals",
    text: "No. Again. That sounds like a careful way to say they eat each other.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "It is. Also, it is the accurate way. The Ark is not breeding pets; it is testing renewable food cycles. Precision reduces screaming.",
  },
  {
    speaker: "You",
    mood: "animals",
    text: "You keep saying that like confidence makes this less alarming.",
  },
  {
    speaker: "Tabs",
    mood: "animals",
    text: "I am aiming for cozy clarity over existential dread, and I would rate myself very successful so far.",
  },
  {
    speaker: "SYSTEM",
    mood: "paddock",
    text: "Something thumps beyond the paddock door. Tiny voices answer in a frightened chorus.",
  },
  {
    speaker: "Tabs",
    mood: "paddock",
    text: "The experiment broke pattern. If the herds keep tangling, the vats stay empty. No vats, no food; no food, no future. Very sturdy chain of reasoning.",
  },
  {
    speaker: "You",
    mood: "paddock",
    inner: true,
    text: "Broken pattern. Empty vats. A job title waiting for me before I even know whether I had a choice. I hate that the chain of reasoning is sturdy.",
  },
  {
    speaker: "Tabs",
    mood: "paddock",
    text: "You do not have to trust me yet. You only have to look at the paddock. Evidence first, outrage after; perfectly civilized.",
  },
  {
    speaker: "You",
    mood: "paddock",
    text: "Looking is not trusting. It is barely cooperating.",
  },
  {
    speaker: "Tabs",
    mood: "lesson",
    text: "Excellent survival instincts. First lesson: place compatible food animals together, let them settle, then collect what they produce. Simple enough to resent efficiently.",
  },
  {
    speaker: "You",
    mood: "lesson",
    inner: true,
    text: "If I refuse, the door stays closed, the answers stay behind him, and the hungry little chorus keeps panicking. If I cooperate, at least the lab has to show me its shape.",
  },
  {
    speaker: "You",
    mood: "lesson",
    text: "Fine. I do not buy this, I do not trust you, and I am furious that the immediate math checks out. I will stabilize one paddock. Then we talk about the rest.",
  },
  {
    speaker: "Tabs",
    mood: "lesson",
    text: "There we are. One stable paddock, one small mercy, one door opening because you chose correctly. Come along, Coordinator; the Ark learns very quickly.",
  },
];

const tutorialBeats = [
  {
    speaker: "SYSTEM",
    step: "shop-intro",
    text: "The paddock door seals behind you. A shop console wakes, already stocked, already waiting.",
  },
  {
    speaker: "Tabs",
    step: "shop-intro",
    text: "Before combat, we plan. I have frozen the shop loadout so nothing changes while your memory is being dramatic.",
  },
  {
    speaker: "You",
    step: "shop-intro",
    inner: true,
    text: "The shelves are staged. The animals are calm. Somehow that makes this feel more rehearsed, not less dangerous.",
  },
  {
    speaker: "Tabs",
    step: "hud",
    text: "Top first. Course tells you which test you are on, hearts are how many failures humanity can politely absorb, and coins are what you can spend right now.",
  },
  {
    speaker: "You",
    step: "hud",
    text: "Humanity has a failure budget. Comforting.",
  },
  {
    speaker: "You",
    step: "hud",
    text: "Wait. Why are there coins? If this is an emergency agriculture project, why am I buying anything?",
  },
  {
    speaker: "Tabs",
    step: "hud",
    text: "Because value keeps decisions honest. When every rescue has a cost, the coordinator learns which lives are truly necessary to the pattern.",
  },
  {
    speaker: "You",
    step: "hud",
    text: "That sounds less like accounting and more like the shop deciding what I am allowed to save.",
  },
  {
    speaker: "Tabs",
    step: "shop",
    text: "Like the shop. Yes. Excellent transition. The shelf is the shop. These four offers are preplanned: three food animals and one topping. Later, the shelf changes when you reroll.",
  },
  {
    speaker: "Tabs",
    step: "shop",
    text: "The important part is simple: spend with intent, place with care, and do not let the cheerful numbers distract you from the shape they are forcing.",
  },
  {
    speaker: "Tabs",
    step: "locked-slot",
    text: "Point of interest: Slot 5 costs 30 coins to open. You do not have that. The counter is teaching patience, appetite, and future dependency.",
  },
  {
    speaker: "Tabs",
    step: "stall",
    text: "Also, that stall is mine. Original awning, brass corner bells, produce drawers older than your cryosleep pod. I am extremely proud of it.",
  },
  {
    speaker: "You",
    step: "stall",
    text: "You remember the history of your stall, but not why I woke up in a sealed agriculture bunker?",
  },
  {
    speaker: "Tabs",
    step: "stall",
    text: "I remember many things. I simply prioritize the beautiful ones before the legally alarming ones.",
  },
  {
    speaker: "You",
    step: "reflection",
    inner: true,
    text: "A price, a role, a place in the pattern. The system is trying very hard to become a board game in my head.",
  },
  {
    speaker: "Tabs",
    step: "storage-cluster",
    text: "Storage sits in that little cluster under the shop. Bought animals, toppings, and drinks can wait there until you know where they belong.",
  },
  {
    speaker: "Tabs",
    step: "board",
    text: "The paddock pattern is your active team. Place food animals here before battle. Position matters because neighbors create the first stable loop.",
  },
  {
    speaker: "You",
    step: "board",
    text: "So I am not buying power. I am arranging consequences.",
  },
  {
    speaker: "Tabs",
    step: "traits",
    text: "Pattern Intel summarizes what your team is becoming. Two matching traits wake up a bonus; more matches deepen it.",
  },
  {
    speaker: "You",
    step: "traits",
    inner: true,
    text: "The console rewards categories. Snack. Street. Anchor. Cute words for a machine that wants tidy instincts.",
  },
  {
    speaker: "Tabs",
    step: "freeze",
    text: "Freeze locks shop offers for the next visit. Useful when the right animal appears and your wallet is making tragic little noises.",
  },
  {
    speaker: "Tabs",
    step: "reroll",
    text: "Reroll spends a coin to replace the shelf. It is a search tool, not a panic button, although I respect panic as a motivator.",
  },
  {
    speaker: "Tabs",
    step: "upgrade",
    text: "Upgrade improves future shop quality. Not now. This lesson is about understanding the counter before trying to outsmart it.",
  },
  {
    speaker: "Tabs",
    step: "battle",
    text: "Battle sends the current pattern into the pressure test. Once that begins, the shop is closed and your arrangement has to speak for itself.",
  },
  {
    speaker: "You",
    step: "battle",
    inner: true,
    text: "The button waits like a door handle. I still do not trust the cat, but I understand the room now.",
  },
  {
    speaker: "Tabs",
    step: "handoff",
    text: "That is all the information you need to do your job: read the counter, spend deliberately, arrange the pattern, and send it through the pressure test.",
  },
  {
    speaker: "You",
    step: "handoff",
    text: "That is a very precise definition of all.",
  },
  {
    speaker: "Tabs",
    step: "handoff",
    text: "Precision is how a respectable shop survives history, catastrophe, and customers who ask very reasonable questions at inconvenient times.",
  },
  {
    speaker: "You",
    step: "handoff",
    text: "After this, we talk about the coins, the locked slots, and the legally alarming things.",
  },
  {
    speaker: "Tabs",
    step: "battle",
    text: "Naturally. After the first pressure test. My stall and I will be here, gleaming heroically, pretending this is normal.",
  },
];

const state = {
  phase: "opening",
  index: 0,
  tutorialIndex: 0,
  lastAction: "none",
  skipConfirm: false,
};

const visualBoards = {
  cryo: {
    src: "assets/ui/runtime/tutorial-cryo-awakening-diagram-transparent-v2.png",
    alt: "Diagram of cryosleep thawing into greenhouse lab reorientation",
  },
  greenArk: {
    id: "greenArk",
    src: "assets/opening-vn/runtime/green-ark-renewal-doc-v2.webp?v=position-1",
    alt: "Cozy science document showing Project Green Ark as a renewable food supply cycle",
  },
  livingRecipe: {
    id: "livingRecipe",
    src: "assets/opening-vn/runtime/living-recipe-editing-doc-v2.webp?v=position-1",
    alt: "Cozy science document showing Food Animals as editable living recipes",
  },
  yieldComparison: {
    id: "yieldComparison",
    src: "assets/opening-vn/runtime/yield-comparison-doc-v2.webp?v=position-1",
    alt: "Cozy science document comparing Food Animal yields against ordinary livestock",
  },
  foodWeb: {
    id: "foodWeb",
    src: "assets/opening-vn/runtime/food-web-diagnostics-doc-v2.webp?v=position-1",
    alt: "Cozy science document showing Food Animal food-web failure modes",
  },
  stabilityPressure: {
    id: "stabilityPressure",
    src: "assets/opening-vn/runtime/stability-pressure-doc-v2.webp?v=position-1",
    alt: "Cozy science document comparing stable and unstable pressure-test patterns",
  },
  brokenPattern: {
    id: "brokenPattern",
    src: "assets/opening-vn/runtime/broken-pattern-vats-doc-v2.webp?v=position-1",
    alt: "Cozy science document showing broken herd patterns leading to empty vats",
  },
  paddock: {
    id: "paddock",
    src: "assets/opening-vn/runtime/tutorial-paddock-placement-doc-v2.webp?v=position-1",
    alt: "Cozy science document showing Food Animals arranged into a stable tutorial paddock pattern",
  },
};

const stage = document.querySelector(".vn-stage");
const dialoguePanel = document.querySelector(".dialogue-panel");
const speakerLabel = document.querySelector(".speaker-label");
const dialogueText = document.querySelector(".dialogue-text");
const beatProgress = document.querySelector(".beat-progress");
const skipConfirm = document.querySelector(".skip-confirm");
const nextButton = document.querySelector("[data-action='next']");
const backButton = document.querySelector("[data-action='back']");
const skipButton = document.querySelector("[data-action='skip']");
const sceneTransitionCurtain = document.querySelector(".scene-transition-curtain");
const paddockPreview = document.querySelector(".paddock-preview");
const visualImage = paddockPreview.querySelector("img");
const tutorialShop = document.querySelector(".tutorial-shop");
const tutorialShopFrame = document.querySelector(".actual-shop-frame");
const playerStandee = document.querySelector(".player-standee");
const tabsCounter = document.querySelector(".tabs-counter");
const SCENE_TRANSITION_MS = 640;
const TUTORIAL_ENTER_TRANSITION_MS = 720;
const TUTORIAL_COMPLETE_TRANSITION_MS = 760;
const BOARD_DOCUMENT_DELAY_MS = 320;
const DOCUMENT_SWAP_DELAY_MS = 170;
const BOARD_REVEAL_MS = 520;
const BOARD_DISMISS_MS = 380;
const OPENING_READY_MESSAGE = "food-animals:opening-vn:ready";
const SETTINGS_STORAGE_KEY = window.FoodAnimalsAudioSettings?.STORAGE_KEY || "harvest-friends:start-menu-settings:v1";
const VN_SFX_TRACKS = {
  next: "assets/audio/sfx/cozy-ui-confirm.wav",
  back: "assets/audio/sfx/cozy-ui-back.wav",
  skip: "assets/audio/sfx/cozy-invalid.wav",
  transition: "assets/audio/sfx/cozy-transition.wav",
};
const vnSfx = {
  armed: false,
  pools: new Map(),
  next: new Map(),
};
const DOCUMENT_REVEAL_MS = 280;
const TUTORIAL_COMPLETE_TARGET_URL = "local-test-pages/game.html";
const TUTORIAL_SHOP_ROUTE = "local-test-pages/game.html?screen=opening-tutorial-shop&embed=opening-vn";
let desiredBoardHref = "";
let displayedBoardHref = "";
let visualTransitionToken = 0;
let visualTransitionTimers = [];
let sceneTransitionTimer = null;
let tutorialCompleteNavigationTimer = null;
let tutorialCompletionDispatched = false;
let openingReadySignaled = false;
const warmImageCache = [];

function appUrl(path) {
  return new URL(path, document.baseURI || window.location.href);
}

const CRITICAL_READY_IMAGE_SOURCES = [
  "assets/opening-vn/runtime/awakening-greenhouse-lab-bg-v1.webp",
  "assets/player/runtime/player-tutorial-dialogue-cutout-v6.png",
  "assets/shopkeeper/runtime/tabs-dialogue-cutout-v1.png",
  "assets/ui/runtime/conversation-paper-bg-v1.webp",
];

const DEFERRED_OPENING_IMAGE_SOURCES = [
  "assets/opening-vn/runtime/presentation-briefing-room-bg-v1.webp",
  "assets/opening-vn/runtime/display-corkboard-bg-v2.webp",
  visualBoards.greenArk.src,
  visualBoards.livingRecipe.src,
  visualBoards.yieldComparison.src,
  visualBoards.foodWeb.src,
  visualBoards.stabilityPressure.src,
  visualBoards.brokenPattern.src,
  visualBoards.paddock.src,
  "assets/backgrounds/arena-dim-sum-kitchen-v1.webp",
];

function imageReady(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = resolve;
    image.onerror = resolve;
    image.src = appUrl(src).href;
    if (image.decode) {
      image.decode().then(resolve, resolve);
    }
  });
}

function warmImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = appUrl(src).href;
  warmImageCache.push(image);
}

function scheduleDeferredOpeningImageWarmup() {
  const warmQueue = () => {
    DEFERRED_OPENING_IMAGE_SOURCES.forEach((src, index) => {
      window.setTimeout(() => warmImage(src), index * 220);
    });
  };
  if (window.requestIdleCallback) {
    window.requestIdleCallback(warmQueue, { timeout: 1400 });
    return;
  }
  window.setTimeout(warmQueue, 700);
}

function signalOpeningReady() {
  if (openingReadySignaled || !isCampaignEmbedded()) return;
  openingReadySignaled = true;
  window.parent.postMessage(
    { type: OPENING_READY_MESSAGE, href: window.location.href },
    window.location.origin,
  );
}

function signalOpeningReadyWhenStable() {
  if (!isCampaignEmbedded()) return;
  const criticalImagesReady = Promise.all(CRITICAL_READY_IMAGE_SOURCES.map(imageReady));
  const fallbackReady = new Promise((resolve) => window.setTimeout(resolve, 1800));
  Promise.race([criticalImagesReady, fallbackReady]).then(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(signalOpeningReady);
    });
  });
}

function currentBeat() {
  if (state.phase !== "opening") {
    return tutorialBeats[Math.max(0, Math.min(tutorialBeats.length - 1, state.tutorialIndex))];
  }
  return beats[Math.max(0, Math.min(beats.length - 1, state.index))];
}

function currentTutorialStep() {
  return state.phase !== "opening" ? currentBeat().step || "map" : "briefing";
}

function boardForBeat(beat, index) {
  if (state.phase !== "opening") return null;
  if (index <= 10) return null;
  if (index <= 12) return visualBoards.greenArk;
  if (index === 13) return visualBoards.livingRecipe;
  if (index === 14) return visualBoards.yieldComparison;
  if (index === 15) return visualBoards.foodWeb;
  if (beat.mood === "animals") return visualBoards.stabilityPressure;
  if (beat.mood === "paddock") return visualBoards.brokenPattern;
  if (beat.mood === "lesson") return visualBoards.paddock;
  return null;
}

function openingSceneForIndex(index) {
  return index <= 9 ? "awakening" : "presentation";
}

function ensureTutorialShopLoaded() {
  if (!tutorialShopFrame || tutorialShopFrame.getAttribute("src")) return;
  tutorialShopFrame.src = tutorialShopFrame.dataset.src || TUTORIAL_SHOP_ROUTE;
}

function triggerOpeningSceneTransition(fromScene, toScene) {
  if (!fromScene || !toScene || fromScene === toScene) return;
  window.clearTimeout(sceneTransitionTimer);
  sceneTransitionCurtain.dataset.fromScene = fromScene;
  sceneTransitionCurtain.classList.remove("is-transitioning", "is-tutorial-entering");
  void sceneTransitionCurtain.offsetWidth;
  sceneTransitionCurtain.classList.add("is-transitioning");
  sceneTransitionTimer = window.setTimeout(() => {
    sceneTransitionCurtain.classList.remove("is-transitioning");
  }, SCENE_TRANSITION_MS);
}

function triggerTutorialEnterTransition() {
  window.clearTimeout(sceneTransitionTimer);
  sceneTransitionCurtain.dataset.fromScene = "presentation";
  sceneTransitionCurtain.classList.remove("is-transitioning", "is-tutorial-entering");
  void sceneTransitionCurtain.offsetWidth;
  sceneTransitionCurtain.classList.add("is-tutorial-entering");
  sceneTransitionTimer = window.setTimeout(() => {
    sceneTransitionCurtain.classList.remove("is-tutorial-entering");
  }, TUTORIAL_ENTER_TRANSITION_MS);
}

function clearVisualTransitionTimers() {
  visualTransitionTimers.forEach((timer) => window.clearTimeout(timer));
  visualTransitionTimers = [];
}

function queueVisualTransition(callback, delay) {
  const timer = window.setTimeout(() => {
    visualTransitionTimers = visualTransitionTimers.filter((queuedTimer) => queuedTimer !== timer);
    callback();
  }, delay);
  visualTransitionTimers.push(timer);
}

function revealVisualDocument(board, token) {
  if (token !== visualTransitionToken) return;
  const targetHref = new URL(board.src, window.location.href).href;
  if (visualImage.src !== targetHref) {
    visualImage.src = board.src;
  }
  visualImage.alt = board.alt;
  displayedBoardHref = targetHref;
  window.requestAnimationFrame(() => {
    if (token !== visualTransitionToken) return;
    visualImage.classList.remove("is-doc-hidden");
    visualImage.classList.add("is-doc-entering");
    queueVisualTransition(() => {
      if (token === visualTransitionToken) visualImage.classList.remove("is-doc-entering");
    }, DOCUMENT_REVEAL_MS);
  });
}

function updateVisualBoard(board) {
  if (!board) {
    clearVisualTransitionTimers();
    visualTransitionToken += 1;
    const token = visualTransitionToken;
    desiredBoardHref = "";
    if (paddockPreview.hidden) {
      displayedBoardHref = "";
      paddockPreview.dataset.board = "";
      paddockPreview.classList.remove("is-board-entering", "is-board-exiting");
      visualImage.classList.add("is-doc-hidden");
      visualImage.classList.remove("is-doc-entering");
      return;
    }

    visualImage.classList.add("is-doc-hidden");
    visualImage.classList.remove("is-doc-entering");
    paddockPreview.classList.remove("is-board-entering");
    queueVisualTransition(() => {
      if (token !== visualTransitionToken) return;
      paddockPreview.classList.add("is-board-exiting");
    }, DOCUMENT_SWAP_DELAY_MS);
    queueVisualTransition(() => {
      if (token !== visualTransitionToken) return;
      displayedBoardHref = "";
      paddockPreview.hidden = true;
      paddockPreview.dataset.board = "";
      paddockPreview.classList.remove("is-board-exiting");
    }, DOCUMENT_SWAP_DELAY_MS + BOARD_DISMISS_MS);
    return;
  }

  const targetHref = new URL(board.src, window.location.href).href;
  const previousDesiredHref = desiredBoardHref;
  const wasHidden = paddockPreview.hidden;
  desiredBoardHref = targetHref;
  paddockPreview.hidden = false;
  paddockPreview.classList.remove("is-board-exiting");
  paddockPreview.dataset.board = board.id || "";
  visualImage.alt = board.alt;

  if (wasHidden) {
    clearVisualTransitionTimers();
    visualTransitionToken += 1;
    const token = visualTransitionToken;
    paddockPreview.classList.remove("is-board-entering", "is-board-exiting");
    void paddockPreview.offsetWidth;
    paddockPreview.classList.add("is-board-entering");
    visualImage.classList.add("is-doc-hidden");
    visualImage.classList.remove("is-doc-entering");
    queueVisualTransition(() => {
      if (token === visualTransitionToken) paddockPreview.classList.remove("is-board-entering");
    }, BOARD_REVEAL_MS);
    queueVisualTransition(() => revealVisualDocument(board, token), BOARD_DOCUMENT_DELAY_MS);
    return;
  }

  if (previousDesiredHref !== targetHref) {
    clearVisualTransitionTimers();
    visualTransitionToken += 1;
    const token = visualTransitionToken;
    visualImage.classList.add("is-doc-hidden");
    visualImage.classList.remove("is-doc-entering");
    queueVisualTransition(() => revealVisualDocument(board, token), DOCUMENT_SWAP_DELAY_MS);
    return;
  }

  if (displayedBoardHref === targetHref) {
    visualImage.classList.remove("is-doc-hidden");
  }
}

function render() {
  const beat = currentBeat();
  const board = boardForBeat(beat, state.index);
  speakerLabel.textContent = beat.inner ? "You" : beat.speaker;
  speakerLabel.classList.toggle("you", beat.speaker === "You");
  speakerLabel.classList.toggle("thought", beat.inner === true);
  speakerLabel.classList.toggle("objective", beat.speaker === "OBJECTIVE");
  dialoguePanel.classList.toggle("inner-monologue", beat.inner === true);
  dialogueText.textContent = beat.text;
  beatProgress.value = state.phase !== "opening"
    ? `Tutorial ${state.tutorialIndex + 1} / ${tutorialBeats.length}`
    : `${state.index + 1} / ${beats.length}`;
  nextButton.textContent = state.phase !== "opening" && state.tutorialIndex >= tutorialBeats.length - 1
    ? "End Tutorial"
    : state.phase === "opening" && state.index >= beats.length - 1
      ? "Enter Paddock"
      : "Continue";
  skipButton.textContent = state.skipConfirm ? "Confirm Skip" : "Skip";
  skipButton.classList.toggle("is-confirming", state.skipConfirm);
  skipButton.hidden = state.phase === "complete";
  skipConfirm.hidden = !state.skipConfirm;
  backButton.disabled = !canGoBack();
  updateVisualBoard(board);
  if (state.phase !== "opening" || state.index >= beats.length - 3) {
    ensureTutorialShopLoaded();
  }
  tutorialShop.hidden = state.phase === "opening";
  playerStandee.classList.toggle("is-speaking", beat.speaker === "You");
  tabsCounter.classList.toggle("is-speaking", beat.speaker === "Tabs");
  stage.dataset.phase = state.phase === "opening" ? "opening" : "tutorial";
  stage.dataset.mood = beat.mood || "tutorial";
  stage.dataset.openingScene = state.phase === "opening" ? openingSceneForIndex(state.index) : "tutorial";
  stage.dataset.tutorialStep = currentTutorialStep();
}

function canGoBack() {
  if (state.phase === "opening") return state.index > 0;
  return true;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function savedSfxVolume() {
  return window.FoodAnimalsAudioSettings.sfxVolume(0.8, SETTINGS_STORAGE_KEY);
}

function vnSfxPoolFor(src) {
  return window.FoodAnimalsAudioRuntime.poolFor(vnSfx, src, 3);
}

function playVnSfx(id, options = {}) {
  window.FoodAnimalsAudioRuntime.playSfx(vnSfx, {
    src: VN_SFX_TRACKS[id],
    force: options.force,
    volume: savedSfxVolume() * (options.volume ?? 1),
    rate: options.rate,
    poolSize: 3,
  });
}

function armVnSfx() {
  vnSfx.armed = true;
}

function goBack() {
  if (!canGoBack()) return;
  playVnSfx("back", { volume: 0.7 });
  state.lastAction = "back";
  state.skipConfirm = false;
  if (state.phase === "complete") {
    state.phase = "tutorial";
    state.tutorialIndex = tutorialBeats.length - 1;
    render();
    return;
  }
  if (state.phase === "tutorial") {
    if (state.tutorialIndex > 0) {
      state.tutorialIndex -= 1;
    } else {
      state.phase = "opening";
      state.index = beats.length - 1;
    }
    render();
    return;
  }
  const previousScene = openingSceneForIndex(state.index);
  state.index = Math.max(0, state.index - 1);
  render();
  triggerOpeningSceneTransition(previousScene, openingSceneForIndex(state.index));
}

function dispatchTutorialCompletion() {
  if (state.phase !== "complete" || tutorialCompletionDispatched) return false;
  tutorialCompletionDispatched = true;
  tutorialCompleteNavigationTimer = null;
  const targetUrl = appUrl(TUTORIAL_COMPLETE_TARGET_URL).href;
  window.dispatchEvent(new CustomEvent("food-animals:opening-vn:complete", {
    detail: { targetUrl },
  }));
  if (isCampaignEmbedded()) {
    window.parent.postMessage(
      { type: "food-animals:opening-vn:complete", targetUrl },
      window.location.origin,
    );
    return true;
  }
  window.location.href = targetUrl;
  return true;
}

function scheduleTutorialCompletion(delay = TUTORIAL_COMPLETE_TRANSITION_MS) {
  window.clearTimeout(tutorialCompleteNavigationTimer);
  tutorialCompleteNavigationTimer = window.setTimeout(dispatchTutorialCompletion, Math.max(0, delay));
}

function completeTutorial() {
  playVnSfx("transition");
  state.phase = "complete";
  state.skipConfirm = false;
  tutorialCompletionDispatched = false;
  sceneTransitionCurtain.classList.remove("is-transitioning", "is-completing");
  void sceneTransitionCurtain.offsetWidth;
  sceneTransitionCurtain.classList.add("is-completing");
  render();
  scheduleTutorialCompletion();
}

function advance() {
  if (state.phase === "complete") {
    tutorialCompletionDispatched = false;
    scheduleTutorialCompletion(0);
    return;
  }
  playVnSfx("next", { volume: 0.7 });
  state.lastAction = "next";
  state.skipConfirm = false;
  if (state.phase === "opening" && state.index >= beats.length - 1) {
    state.phase = "tutorial";
    state.tutorialIndex = 0;
    render();
    triggerTutorialEnterTransition();
    return;
  }
  if (state.phase === "opening") {
    const previousScene = openingSceneForIndex(state.index);
    state.index += 1;
    render();
    triggerOpeningSceneTransition(previousScene, openingSceneForIndex(state.index));
    return;
  }
  if (state.phase === "tutorial" && state.tutorialIndex >= tutorialBeats.length - 1) {
    completeTutorial();
    return;
  }
  if (state.phase === "tutorial") state.tutorialIndex += 1;
  render();
}

function skipSection() {
  if (state.phase === "complete") return;
  if (!state.skipConfirm) {
    playVnSfx("skip", { volume: 0.55 });
    state.lastAction = "skip-request";
    state.skipConfirm = true;
    render();
    return;
  }
  state.lastAction = "skip-confirm";
  playVnSfx("back", { volume: 0.7 });
  state.skipConfirm = false;
  if (state.phase === "opening") {
    state.phase = "tutorial";
    state.tutorialIndex = 0;
    render();
    triggerTutorialEnterTransition();
    return;
  }
  if (state.phase === "tutorial") {
    completeTutorial();
  }
}

function isCampaignEmbedded() {
  return window.parent && window.parent !== window;
}

nextButton.addEventListener("click", () => {
  armVnSfx();
  advance();
});
backButton.addEventListener("click", () => {
  armVnSfx();
  goBack();
});
skipButton.addEventListener("click", () => {
  armVnSfx();
  skipSection();
});

window.addEventListener("pagehide", () => {
  if (tutorialCompleteNavigationTimer !== null) {
    window.clearTimeout(tutorialCompleteNavigationTimer);
    tutorialCompleteNavigationTimer = null;
  }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted && state.phase === "complete" && !tutorialCompletionDispatched) {
    scheduleTutorialCompletion(0);
  }
});

window.addEventListener("keydown", (event) => {
  armVnSfx();
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    advance();
  }
});

window.render_game_to_text = () =>
  JSON.stringify({
    screen: "standalone-opening-vn",
    coordinateSystem: "DOM screen; origin top-left, x right, y down",
    phase: state.phase,
    index: state.index,
    count: beats.length,
    tutorialIndex: state.tutorialIndex,
    tutorialCount: tutorialBeats.length,
    progress: state.phase !== "opening"
      ? `Tutorial ${state.tutorialIndex + 1} / ${tutorialBeats.length}`
      : `${state.index + 1} / ${beats.length}`,
    speaker: currentBeat().speaker,
    text: currentBeat().text,
    mood: currentBeat().mood || "tutorial",
    openingScene: state.phase === "opening" ? openingSceneForIndex(state.index) : null,
    tutorialStep: currentTutorialStep(),
    completeTargetUrl: TUTORIAL_COMPLETE_TARGET_URL,
    skipConfirm: state.skipConfirm,
    completionTransition: {
      active: sceneTransitionCurtain.classList.contains("is-completing"),
      durationMs: TUTORIAL_COMPLETE_TRANSITION_MS,
      targetUrl: TUTORIAL_COMPLETE_TARGET_URL,
    },
    tutorialEnterTransition: {
      active: sceneTransitionCurtain.classList.contains("is-tutorial-entering"),
      durationMs: TUTORIAL_ENTER_TRANSITION_MS,
    },
    innerMonologue: currentBeat().inner === true,
    visualBoard: boardForBeat(currentBeat(), state.index)?.src || null,
    tutorialShop: {
      visible: state.phase !== "opening",
      screen: "Actual frozen tutorial shop",
      route: TUTORIAL_SHOP_ROUTE,
      loaded: Boolean(tutorialShopFrame?.getAttribute("src")),
      highlightedStep: currentTutorialStep(),
      plannedInteractions: [
        "review the fixed shop shelf",
        "notice the 30-coin locked slot",
        "place a food animal beside the Taco Cub",
        "review the trait panel",
        "start the first pressure test",
      ],
      hud: { course: 1, hearts: 10, coins: 10 },
      shopLoadout: [
        { name: "Maki Pup", cost: 3, role: "Stable neighbor" },
        { name: "Noodle Newt", cost: 3, role: "Support loop" },
        { name: "Berry Bat", cost: 3, role: "Back pressure" },
        { name: "Bacon Strips", cost: 2, role: "Topping" },
      ],
      lockedSlots: [
        { name: "Slot 5", cost: 30, role: "Future shop unlock" },
      ],
      inventory: [
        { name: "Maki Pup", type: "food animal" },
        { name: "Bacon Strips", type: "topping" },
        { name: "Berry Fizz", type: "drink" },
      ],
    },
    playerStandee: {
      visible: true,
      side: "left",
      speaking: currentBeat().speaker === "You",
    },
    tabsStandee: {
      visible: true,
      side: "right",
      speaking: currentBeat().speaker === "Tabs",
      asset: "assets/shopkeeper/runtime/tabs-dialogue-cutout-v1.png",
    },
    lastAction: state.lastAction,
  });

window.advanceTime = () => {
  render();
  return window.render_game_to_text();
};

render();
signalOpeningReadyWhenStable();
scheduleDeferredOpeningImageWarmup();
