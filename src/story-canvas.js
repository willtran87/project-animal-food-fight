(() => {
  "use strict";

  const BASE_W = 1024;
  const BASE_H = 640;
  const DEFAULT_FONT_FAMILY = "Inter, sans-serif";

  function scaledRect(rect, scale, offsetX, offsetY) {
    return {
      x: offsetX + rect.x * scale,
      y: offsetY + rect.y * scale,
      w: rect.w * scale,
      h: rect.h * scale,
    };
  }

  function layout(options = {}) {
    const width = Number(options.width) || BASE_W;
    const height = Number(options.height) || BASE_H;
    const scale = Math.min(width / BASE_W, height / BASE_H);
    const offsetX = (width - BASE_W * scale) * 0.5;
    const offsetY = (height - BASE_H * scale) * 0.5;
    const panel = scaledRect({ x: 155, y: 463, w: 713, h: 158 }, scale, offsetX, offsetY);
    return {
      stage: { x: 0, y: 0, w: width, h: height },
      scale,
      panel,
      player: scaledRect({ x: -145, y: 134, w: 448, h: 672 }, scale, offsetX, offsetY),
      tabs: scaledRect({ x: 839, y: 426, w: 216, h: 324 }, scale, offsetX, offsetY),
      horrorTabs: scaledRect({ x: 790, y: 420, w: 292, h: 292 }, scale, offsetX, offsetY),
      label: {
        x: panel.x + 24 * scale,
        y: panel.y - 16 * scale,
        w: 138 * scale,
        h: 37 * scale,
      },
      progress: {
        x: panel.x + panel.w - 67 * scale,
        y: panel.y + 25 * scale,
        w: 46 * scale,
        h: 21 * scale,
      },
      text: {
        x: panel.x + 24 * scale,
        y: panel.y + 50 * scale,
        w: panel.w - 85 * scale,
      },
      button: {
        x: panel.x + panel.w - 136 * scale,
        y: panel.y + panel.h - 48 * scale,
        w: 112 * scale,
        h: 32 * scale,
      },
      backButton: {
        x: panel.x + panel.w - 386 * scale,
        y: panel.y + panel.h - 48 * scale,
        w: 112 * scale,
        h: 32 * scale,
      },
      skipButton: {
        x: panel.x + panel.w - 261 * scale,
        y: panel.y + panel.h - 48 * scale,
        w: 112 * scale,
        h: 32 * scale,
      },
    };
  }

  function buttonRects(options = {}) {
    const storyLayout = options.layout || layout(options);
    return {
      advance: storyLayout.button,
      back: storyLayout.backButton,
      skip: storyLayout.skipButton,
    };
  }

  function pointInRect(x, y, rect) {
    if (window.FoodAnimalsCanvasUi?.pointInRect) return window.FoodAnimalsCanvasUi.pointInRect(x, y, rect);
    return Boolean(rect) && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  function speakerIsTabs(speaker) {
    const label = String(speaker || "").toLowerCase();
    return label === "tabs" || label === "t.a.b.s.";
  }

  function fallbackRoundedRect(ctx, x, y, w, h, r) {
    if (window.FoodAnimalsCanvasUi?.roundedRect) {
      window.FoodAnimalsCanvasUi.roundedRect(ctx, x, y, w, h, r);
      return;
    }
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function fallbackWrappedTextLines(ctx, text, maxWidth) {
    if (window.FoodAnimalsCanvasUi?.wrappedTextLines) {
      return window.FoodAnimalsCanvasUi.wrappedTextLines(ctx, text, maxWidth);
    }
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function fallbackFitText(ctx, text, x, y, maxWidth, font, color, align = "left") {
    if (window.FoodAnimalsCanvasUi?.fitText) {
      window.FoodAnimalsCanvasUi.fitText(ctx, text, x, y, maxWidth, font, color, { align });
      return;
    }
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const label = String(text || "");
    if (ctx.measureText(label).width <= maxWidth) {
      ctx.fillText(label, x, y);
      ctx.restore();
      return;
    }
    let truncated = label;
    while (truncated.length > 1 && ctx.measureText(`${truncated}...`).width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    ctx.fillText(`${truncated}...`, x, y);
    ctx.restore();
  }

  function drawStandee(options) {
    const {
      ctx,
      rect,
      src,
      active,
      fallbackLabel,
      idleTime = 0,
      getImage,
      roundedRect,
      scale = 1,
    } = options;
    const image = typeof getImage === "function" ? getImage(src) : null;
    const drawRoundedRect = typeof roundedRect === "function"
      ? roundedRect
      : (x, y, w, h, r) => fallbackRoundedRect(ctx, x, y, w, h, r);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.filter = `${active ? "saturate(1.04) brightness(1.03)" : "saturate(1) brightness(1)"} drop-shadow(0 ${12 * scale}px ${14 * scale}px rgba(37, 51, 30, 0.3))`;
    const breath = active ? (1 - Math.cos(idleTime * (Math.PI * 2) / 2.8)) * 0.5 : 0;
    const bob = active ? -1.8 * scale * breath : 0;
    const scaleX = active ? 1 + 0.006 * breath : 1;
    const scaleY = active ? 1 + 0.012 * breath : 1;
    ctx.translate(rect.x + rect.w * 0.5, rect.y + rect.h);
    ctx.scale(scaleX, scaleY);
    const drawX = -rect.w * 0.5;
    const drawY = -rect.h + bob;
    if (image && image.complete && image.naturalWidth > 0) {
      const imageAspect = image.naturalWidth / Math.max(1, image.naturalHeight);
      const rectAspect = rect.w / Math.max(1, rect.h);
      let drawW = rect.w;
      let drawH = rect.h;
      if (imageAspect > rectAspect) {
        drawH = rect.w / imageAspect;
      } else {
        drawW = rect.h * imageAspect;
      }
      const imageX = -drawW * 0.5;
      const imageY = -drawH + bob;
      ctx.drawImage(image, imageX, imageY, drawW, drawH);
    } else {
      ctx.filter = "none";
      drawRoundedRect(drawX + rect.w * 0.24, drawY + rect.h * 0.16, rect.w * 0.52, rect.h * 0.36, 8 * scale);
      ctx.fillStyle = "rgba(255, 248, 221, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(49, 66, 38, 0.72)";
      ctx.lineWidth = 3 * scale;
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = `900 ${30 * scale}px ${DEFAULT_FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fallbackLabel, 0, drawY + rect.h * 0.34);
    }
    ctx.restore();
  }

  function drawProgressDots(ctx, story, x, y, horror = false, scale = 1) {
    const total = story.beats?.length || 0;
    const active = story.index || 0;
    const visible = Math.min(total, 12);
    const gap = 11 * scale;
    for (let i = 0; i < visible; i++) {
      const sourceIndex = total <= visible ? i : Math.round((i / Math.max(1, visible - 1)) * (total - 1));
      ctx.beginPath();
      ctx.arc(x + i * gap, y, (sourceIndex <= active ? 3.4 : 2.3) * scale, 0, Math.PI * 2);
      ctx.fillStyle = horror
        ? sourceIndex <= active ? "rgba(92, 255, 111, 0.86)" : "rgba(92, 255, 111, 0.22)"
        : sourceIndex <= active ? "rgba(255, 241, 176, 0.92)" : "rgba(255, 241, 176, 0.28)";
      ctx.fill();
    }
  }

  function drawOverlay(options = {}) {
    const {
      ctx,
      story,
      beat,
      width = BASE_W,
      height = BASE_H,
      idleTime = 0,
      playerPortraitSrc,
      tabsPortraitSrc,
      paperSrc,
      horror = false,
      hostile = false,
      playerSpeaker = false,
      tabsSpeaker = false,
      transitionAlpha = 1,
      transitionPhase = "stable",
      beatMotion = { alpha: 1, offsetX: 0 },
      canGoBack = false,
      skipConfirm = Boolean(story?.skipConfirm),
      getImage,
      roundedRect,
      wrappedTextLines,
      fitText,
      labels = {},
    } = options;
    if (!ctx || !story || !beat || transitionAlpha <= 0) return null;

    const storyLayout = options.layout || layout({ width, height });
    const { panel, button, backButton, skipButton } = storyLayout;
    const scale = storyLayout.scale || 1;
    const drawRoundedRect = typeof roundedRect === "function"
      ? roundedRect
      : (x, y, w, h, r) => fallbackRoundedRect(ctx, x, y, w, h, r);
    const makeLines = typeof wrappedTextLines === "function"
      ? wrappedTextLines
      : (text, maxWidth) => fallbackWrappedTextLines(ctx, text, maxWidth);
    const drawFitText = typeof fitText === "function"
      ? fitText
      : (text, x, y, maxWidth, font, color, align) => fallbackFitText(ctx, text, x, y, maxWidth, font, color, align);
    const getSprite = typeof getImage === "function" ? getImage : () => null;
    const speakerLabel = String(beat.speaker || "SYSTEM");
    const activeTabsRect = options.tabsRect || (options.useHorrorTabs ? storyLayout.horrorTabs : storyLayout.tabs);
    const transitionOffsetY = transitionPhase === "exit"
      ? (1 - transitionAlpha) * -8 * scale
      : (1 - transitionAlpha) * 12 * scale;

    ctx.save();
    ctx.globalAlpha *= transitionAlpha;
    ctx.fillStyle = horror ? "rgba(0, 0, 0, 0.34)" : hostile ? "rgba(0, 0, 0, 0.2)" : "rgba(12, 31, 23, 0.12)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha *= transitionAlpha;
    ctx.translate(0, transitionOffsetY);

    drawStandee({
      ctx,
      src: playerPortraitSrc,
      rect: {
        ...storyLayout.player,
        x: storyLayout.player.x + (playerSpeaker ? (beatMotion.offsetX || 0) * 0.45 * scale : 0),
      },
      active: playerSpeaker,
      fallbackLabel: "Y",
      idleTime,
      getImage: getSprite,
      roundedRect: drawRoundedRect,
      scale,
    });
    drawStandee({
      ctx,
      src: tabsPortraitSrc,
      rect: {
        ...activeTabsRect,
        x: activeTabsRect.x + (tabsSpeaker ? (beatMotion.offsetX || 0) * 0.45 * scale : 0),
      },
      active: tabsSpeaker,
      fallbackLabel: "T",
      idleTime,
      getImage: getSprite,
      roundedRect: drawRoundedRect,
      scale,
    });

    drawRoundedRect(panel.x, panel.y, panel.w, panel.h, 8 * scale);
    ctx.save();
    ctx.clip();
    const paper = getSprite(paperSrc);
    ctx.fillStyle = horror ? "#071214" : "#fff7d7";
    ctx.fill();
    if (paper && paper.complete && paper.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(paper, panel.x, panel.y, panel.w, panel.h);
    }
    const gloss = ctx.createLinearGradient(0, panel.y, 0, panel.y + panel.h);
    if (horror) {
      gloss.addColorStop(0, "rgba(92, 255, 111, 0.08)");
      gloss.addColorStop(0.52, "rgba(0, 0, 0, 0)");
      gloss.addColorStop(1, "rgba(0, 0, 0, 0.22)");
    } else {
      gloss.addColorStop(0, "rgba(255, 255, 255, 0.2)");
      gloss.addColorStop(1, "rgba(255, 247, 215, 0.08)");
    }
    ctx.fillStyle = gloss;
    ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
    ctx.restore();

    drawRoundedRect(panel.x, panel.y, panel.w, panel.h, 8 * scale);
    ctx.strokeStyle = horror ? "rgba(92, 255, 111, 0.46)" : "#6f7546";
    ctx.lineWidth = horror ? 1.5 * scale : 3 * scale;
    ctx.stroke();
    drawRoundedRect(panel.x + 4 * scale, panel.y + 4 * scale, panel.w - 8 * scale, panel.h - 8 * scale, 6 * scale);
    ctx.strokeStyle = horror ? "rgba(20, 218, 231, 0.16)" : "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = horror ? 1 * scale : 3 * scale;
    ctx.stroke();

    ctx.strokeStyle = horror ? "rgba(92, 255, 111, 0.38)" : "rgba(111, 117, 70, 0.72)";
    ctx.lineWidth = horror ? 1.5 * scale : 3 * scale;
    ctx.beginPath();
    ctx.moveTo(panel.x + 12 * scale, panel.y + panel.h - 32 * scale);
    ctx.lineTo(panel.x + 12 * scale, panel.y + panel.h - 12 * scale);
    ctx.lineTo(panel.x + 32 * scale, panel.y + panel.h - 12 * scale);
    ctx.moveTo(panel.x + panel.w - 12 * scale, panel.y + 32 * scale);
    ctx.lineTo(panel.x + panel.w - 12 * scale, panel.y + 12 * scale);
    ctx.lineTo(panel.x + panel.w - 32 * scale, panel.y + 12 * scale);
    ctx.stroke();

    drawRoundedRect(storyLayout.label.x, storyLayout.label.y, storyLayout.label.w, storyLayout.label.h, 8 * scale);
    ctx.fillStyle = horror
      ? playerSpeaker ? "rgba(81, 12, 22, 0.94)" : "rgba(8, 25, 20, 0.94)"
      : playerSpeaker ? "#8d2434" : "#314226";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(92, 255, 111, 0.58)" : "#fff9d6";
    ctx.lineWidth = horror ? 1.5 * scale : 3 * scale;
    ctx.stroke();
    ctx.fillStyle = horror ? "#9effaa" : "#fff8d7";
    ctx.font = `900 ${17 * scale}px ${DEFAULT_FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    drawFitText(speakerLabel, storyLayout.label.x + 24 * scale, storyLayout.label.y + storyLayout.label.h / 2 + 1 * scale, storyLayout.label.w - 44 * scale, `900 ${17 * scale}px ${DEFAULT_FONT_FAMILY}`, ctx.fillStyle);

    drawRoundedRect(storyLayout.progress.x, storyLayout.progress.y, storyLayout.progress.w, storyLayout.progress.h, 8 * scale);
    ctx.fillStyle = horror ? "rgba(4, 15, 14, 0.86)" : "rgba(255, 251, 234, 0.72)";
    ctx.fill();
    ctx.strokeStyle = horror ? "rgba(20, 218, 231, 0.26)" : "rgba(111, 117, 70, 0.34)";
    ctx.lineWidth = horror ? 1 * scale : 2 * scale;
    ctx.stroke();
    ctx.fillStyle = horror ? "rgba(158, 255, 170, 0.82)" : "rgba(49, 66, 38, 0.82)";
    ctx.font = `900 ${12 * scale}px ${DEFAULT_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${(story.index || 0) + 1} / ${story.beats?.length || 1}`, storyLayout.progress.x + storyLayout.progress.w / 2, storyLayout.progress.y + storyLayout.progress.h / 2 + 1 * scale);

    const textX = storyLayout.text.x;
    const textW = storyLayout.text.w;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = horror ? (hostile ? "#ff9aa4" : "#d7ffe0") : hostile ? "#243f2f" : "#1b2617";
    ctx.font = `900 ${17 * scale}px ${DEFAULT_FONT_FAMILY}`;
    const lines = makeLines(beat.text, textW).slice(0, 4);
    ctx.save();
    ctx.globalAlpha *= beatMotion.alpha ?? 1;
    ctx.translate((beatMotion.offsetX || 0) * scale, 0);
    lines.forEach((line, index) => ctx.fillText(line, textX, storyLayout.text.y + index * 23 * scale));
    ctx.restore();

    drawProgressDots(ctx, story, textX, panel.y + panel.h - 22 * scale, horror, scale);

    if (skipConfirm) {
      const confirmW = Math.min(340 * scale, panel.w - 56 * scale);
      const confirmH = 40 * scale;
      const confirmX = panel.x + panel.w - confirmW - 26 * scale;
      const confirmY = panel.y - 50 * scale;
      drawRoundedRect(confirmX, confirmY, confirmW, confirmH, 8 * scale);
      ctx.fillStyle = horror ? "rgba(5, 14, 15, 0.94)" : "rgba(255, 251, 234, 0.9)";
      ctx.fill();
      ctx.strokeStyle = horror ? "rgba(255, 102, 115, 0.52)" : "rgba(141, 36, 52, 0.42)";
      ctx.lineWidth = horror ? 1.5 * scale : 2 * scale;
      ctx.stroke();
      ctx.fillStyle = horror ? "#ff9aa4" : "#8d2434";
      ctx.font = `900 ${11 * scale}px ${DEFAULT_FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels.skipPrompt || "Skip this dialogue section?", confirmX + confirmW / 2, confirmY + 15 * scale);
      ctx.fillText(labels.skipInstruction || "Click Skip again to confirm.", confirmX + confirmW / 2, confirmY + 28 * scale);
    }

    const drawStoryButton = (rect, label, buttonOptions = {}) => {
      const enabled = buttonOptions.enabled !== false;
      drawRoundedRect(rect.x, rect.y, rect.w, rect.h, 8 * scale);
      ctx.fillStyle = horror
        ? buttonOptions.primary ? "rgba(15, 54, 34, 0.94)" : buttonOptions.confirming ? "rgba(95, 16, 28, 0.94)" : "rgba(4, 15, 14, 0.88)"
        : buttonOptions.primary ? "#16392d" : buttonOptions.confirming ? "#8d2434" : "rgba(255, 251, 234, 0.86)";
      ctx.fill();
      ctx.strokeStyle = horror ? "rgba(92, 255, 111, 0.32)" : "rgba(111, 117, 70, 0.22)";
      ctx.lineWidth = horror ? 1 * scale : 0;
      if (horror) ctx.stroke();
      ctx.fillStyle = horror ? (buttonOptions.confirming ? "#ffb0b8" : "#d7ffe0") : buttonOptions.primary || buttonOptions.confirming ? "#fff9df" : "#16392d";
      ctx.globalAlpha = enabled ? 1 : 0.42;
      ctx.font = `900 ${13 * scale}px ${DEFAULT_FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      drawFitText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1 * scale, rect.w - 18 * scale, `900 ${13 * scale}px ${DEFAULT_FONT_FAMILY}`, ctx.fillStyle, "center");
      ctx.globalAlpha = 1;
    };

    drawStoryButton(backButton, labels.back || "Back", { enabled: canGoBack });
    drawStoryButton(skipButton, skipConfirm ? labels.confirmSkip || "Confirm Skip" : labels.skip || "Skip", { confirming: skipConfirm });
    const done = (story.index || 0) >= (story.beats?.length || 1) - 1;
    drawStoryButton(button, done ? labels.close || "Close" : labels.next || "Next", { primary: true });
    ctx.restore();

    return storyLayout;
  }

  window.FoodAnimalsStoryCanvas = Object.freeze({
    layout,
    buttonRects,
    pointInRect,
    speakerIsTabs,
    drawOverlay,
    drawStandee,
    drawProgressDots,
  });
})();
