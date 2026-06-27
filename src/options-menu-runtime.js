(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  function canOpen(state) {
    if (state.activeStory || state.codexOpen || state.rebootTransition || state.finalVictoryTransition || state.shopReturnStaticTransition || state.phaseTransition) return false;
    if (state.phase === "victoryCutscene") return false;
    return state.phase === "prep" || state.phase === "battle" || state.phase === "result";
  }

  function open(state) {
    state.optionsMenu.open = true;
    state.optionsMenu.selected = "resume";
    state.optionsMenu.dragSlider = null;
    state.selected = null;
    state.drag = null;
    state.hover = null;
  }

  function close(state) {
    state.optionsMenu.dragSlider = null;
  }

  function sliderSetting(value) {
    return clamp(Math.round(value), 0, 10);
  }

  function sliderValueFromPoint(rect, x) {
    return ((x - rect.x) / rect.w) * 10;
  }

  function layout(rects, values) {
    return {
      panel: rects.panel,
      close: rects.close,
      buttons: [
        { id: "resume", label: "Resume", rect: rects.resume },
        { id: "save", label: "Save Run", rect: rects.save },
        { id: "exit", label: "Main Menu", rect: rects.exit },
      ],
      sliders: [
        { id: "music", label: "Music", value: values.music, rect: rects.musicTrack },
        { id: "sfx", label: "SFX", value: values.sfx, rect: rects.sfxTrack },
      ],
    };
  }

  function sliderHitRect(rect) {
    return { x: rect.x - 16, y: rect.y - 28, w: rect.w + 32, h: rect.h + 56 };
  }

  function hitTest(pos, menuLayout) {
    if (pointInRect(pos.x, pos.y, menuLayout.close)) return { area: "optionsMenu", action: "close" };
    for (const button of menuLayout.buttons) {
      if (pointInRect(pos.x, pos.y, button.rect)) return { area: "optionsMenu", action: button.id };
    }
    for (const slider of menuLayout.sliders) {
      if (pointInRect(pos.x, pos.y, sliderHitRect(slider.rect))) {
        return { area: "optionsMenu", action: "slider", slider: slider.id, x: pos.x };
      }
    }
    return pointInRect(pos.x, pos.y, menuLayout.panel)
      ? { area: "optionsMenu", action: "panel" }
      : { area: "optionsMenu", action: "outside" };
  }

  window.FoodAnimalsOptionsMenuRuntime = {
    canOpen,
    close,
    hitTest,
    layout,
    open,
    sliderHitRect,
    sliderSetting,
    sliderValueFromPoint,
  };
})();
