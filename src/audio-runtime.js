(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function ensureMusicElement(runtime, track) {
    if (!runtime || !track) return null;
    if (!runtime.audio) {
      runtime.audio = new Audio(track.src);
      runtime.audio.loop = true;
      runtime.audio.preload = "auto";
      runtime.trackId = track.id;
    } else if (runtime.trackId !== track.id) {
      runtime.playPromise = null;
      runtime.audio.pause();
      runtime.audio.currentTime = 0;
      runtime.audio.src = track.src;
      runtime.audio.load();
      runtime.trackId = track.id;
      runtime.blocked = false;
    }
    return runtime.audio;
  }

  function isWindowActive() {
    const focused = typeof document.hasFocus === "function" ? document.hasFocus() : true;
    return !document.hidden && focused;
  }

  function pauseAll(runtime) {
    if (!runtime) return false;

    let paused = false;
    if (runtime.audio && !runtime.audio.paused) {
      runtime.audio.pause();
      paused = true;
    }

    if (runtime.pools) {
      runtime.pools.forEach((pool) => {
        pool.forEach((audio) => {
          if (audio && !audio.paused) {
            audio.pause();
            paused = true;
          }
        });
      });
    }

    return paused;
  }

  function updateWindowActivity(runtime, options = {}) {
    if (!runtime) return isWindowActive();

    const active = isWindowActive();
    runtime.windowAudioActive = active;

    if (!active) {
      pauseAll(runtime);
      return false;
    }

    if (options.resume && runtime.lastMusicSyncOptions) {
      syncMusic(runtime, runtime.lastMusicSyncOptions);
    }

    return true;
  }

  function bindWindowActivity(runtime) {
    if (!runtime || runtime.windowAudioActivityBound) return;
    runtime.windowAudioActivityBound = true;

    const handleActivityChange = () => updateWindowActivity(runtime, { resume: true });
    const handlePageHide = () => {
      runtime.windowAudioActive = false;
      pauseAll(runtime);
    };
    document.addEventListener("visibilitychange", handleActivityChange);
    window.addEventListener("blur", handleActivityChange);
    window.addEventListener("focus", handleActivityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handleActivityChange);
    updateWindowActivity(runtime);
  }

  function syncMusic(runtime, options = {}) {
    const audio = options.audio || ensureMusicElement(runtime, options.track);
    if (!runtime || !audio) return null;
    bindWindowActivity(runtime);
    runtime.lastMusicSyncOptions = { ...options, audio };

    if (!isWindowActive()) {
      pauseAll(runtime);
      return null;
    }

    const volume = clamp01(options.volume ?? audio.volume);
    audio.volume = volume;
    if (volume <= 0 || options.enabled === false) {
      if (!audio.paused) audio.pause();
      return null;
    }

    const armed = options.armed ?? runtime.armed;
    if (!armed || !audio.paused || runtime.playPromise) return runtime.playPromise || null;

    const playPromise = audio
      .play()
      .then(() => {
        runtime.blocked = false;
        runtime.playPromise = null;
        if (typeof options.onStarted === "function") options.onStarted(audio);
      })
      .catch((error) => {
        runtime.blocked = true;
        runtime.playPromise = null;
        if (typeof options.onBlocked === "function") options.onBlocked(error);
      });

    runtime.playPromise = playPromise;
    return playPromise;
  }

  function pauseForHiddenTab(runtime, hidden = document.hidden) {
    if (!runtime?.audio) return false;
    bindWindowActivity(runtime);
    if (hidden || !isWindowActive()) return pauseAll(runtime);
    return false;
  }

  function poolFor(runtime, src, poolSize = 4) {
    if (!runtime || !src) return [];
    bindWindowActivity(runtime);
    if (!runtime.pools) runtime.pools = new Map();
    if (!runtime.next) runtime.next = new Map();
    if (!runtime.pools.has(src)) {
      runtime.pools.set(src, Array.from({ length: poolSize }, () => {
        const audio = new Audio(src);
        audio.preload = "auto";
        return audio;
      }));
    }
    return runtime.pools.get(src);
  }

  function playSfx(runtime, options = {}) {
    if (!runtime) return null;
    bindWindowActivity(runtime);
    if (!isWindowActive()) {
      pauseAll(runtime);
      return null;
    }
    if (!runtime.armed && !options.force) return null;
    const volume = clamp01(options.volume ?? 1);
    if (volume <= 0) return null;
    const pool = poolFor(runtime, options.src, options.poolSize ?? 4);
    if (!pool.length) return null;

    const index = runtime.next.get(options.src) || 0;
    runtime.next.set(options.src, (index + 1) % pool.length);
    const audio = pool[index];
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    audio.playbackRate = clamp(options.rate || 1, 0.5, 1.7);
    audio.play().catch(() => {});
    return audio;
  }

  window.FoodAnimalsAudioRuntime = {
    bindWindowActivity,
    ensureMusicElement,
    isWindowActive,
    pauseAll,
    pauseForHiddenTab,
    playSfx,
    poolFor,
    syncMusic,
  };
})();
