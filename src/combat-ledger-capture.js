(function () {
  function unitName(unit, labels = {}) {
    return labels.name ? labels.name(unit) : unit?.name || unit?.typeId || "Unit";
  }

  function unitShort(unit, labels = {}) {
    return labels.short ? labels.short(unit) : unit?.short || unitName(unit, labels);
  }

  function ledgerUnit(unit, labels = {}) {
    return {
      uid: unit.uid,
      side: unit.side,
      name: unitName(unit, labels),
      short: unitShort(unit, labels),
      typeId: unit.typeId,
      tier: unit.tier,
      damageDealt: 0,
      damageTaken: 0,
      healingReceived: 0,
      shieldingReceived: 0,
      kos: 0,
      defeated: false,
    };
  }

  function emptySide() {
    return { damageDealt: 0, damageTaken: 0, healingReceived: 0, shieldingReceived: 0, kos: 0 };
  }

  function ensureSide(ledger, side) {
    const id = side || "enemy";
    ledger.sides[id] = ledger.sides[id] || emptySide();
    return ledger.sides[id];
  }

  function createLedger(allies, enemies, labels = {}) {
    const units = {};
    [...(allies || []), ...(enemies || [])].forEach((unit) => {
      units[unit.uid] = ledgerUnit(unit, labels);
    });
    return {
      sides: {
        ally: emptySide(),
        enemy: emptySide(),
      },
      units,
      events: [],
      frames: [],
      nextFrameAt: 0,
      seq: 0,
    };
  }

  function ensureUnit(ledger, unit, labels = {}) {
    if (!ledger || !unit) return null;
    if (!ledger.units[unit.uid]) ledger.units[unit.uid] = ledgerUnit(unit, labels);
    return ledger.units[unit.uid];
  }

  function time(battle) {
    return Number(Math.max(0, battle?.elapsed || 0).toFixed(2));
  }

  function unitLabel(entry) {
    if (!entry) return "System";
    return entry.short || entry.name || "Unit";
  }

  function unitRef(ledger, unit, labels = {}) {
    if (!unit) return null;
    const entry = ensureUnit(ledger, unit, labels);
    return entry
      ? {
          uid: entry.uid,
          side: entry.side,
          name: entry.name,
          short: entry.short,
        }
      : null;
  }

  function eventText(ledger, event) {
    if (event.text) return event.text;
    const source = event.sourceUid != null ? ledger.units[event.sourceUid] : null;
    const target = event.targetUid != null ? ledger.units[event.targetUid] : null;
    const sourceName = unitLabel(source);
    const targetName = unitLabel(target);
    if (event.type === "damage") {
      const parts = [];
      if (event.hpDamage > 0) parts.push(`${event.hpDamage} HP`);
      if (event.shieldDamage > 0) parts.push(`${event.shieldDamage} shield`);
      const amount = parts.length ? parts.join(" + ") : `${event.amount || 0}`;
      return `${source ? sourceName : "Environment"} hit ${targetName} for ${amount}${event.kind === "status" ? " over time" : ""}`;
    }
    if (event.type === "support") {
      const supportText = event.kind === "heal" ? "healing" : "shield";
      return source ? `${sourceName} gave ${targetName} ${event.amount} ${supportText}` : `${targetName} received ${event.amount} ${supportText}`;
    }
    if (event.type === "ko") return `${source ? sourceName : "Environment"} defeated ${targetName}`;
    if (event.type === "control") return `${source ? sourceName : "Effect"} delayed ${targetName} by ${event.amount}s`;
    return `${event.kind || event.type || "Event"} ${target ? targetName : ""}`.trim();
  }

  function recordEvent(battle, event, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger || !event) return null;
    const labels = options.labels || {};
    const entry = {
      id: ledger.seq++,
      t: time(battle),
      type: event.type || "event",
      kind: event.kind || event.type || "event",
      sourceUid: event.source?.uid ?? event.sourceUid ?? null,
      source: event.source ? unitRef(ledger, event.source, labels) : event.source || null,
      targetUid: event.target?.uid ?? event.targetUid ?? null,
      target: event.target ? unitRef(ledger, event.target, labels) : event.target || null,
      amount: event.amount || 0,
      hpDamage: event.hpDamage || 0,
      shieldDamage: event.shieldDamage || 0,
      text: event.text || "",
    };
    entry.text = eventText(ledger, entry);
    ledger.events.push(entry);
    if (options.maxEvents && ledger.events.length > options.maxEvents) ledger.events.shift();
    return entry;
  }

  function snapshotUnit(unit, options = {}) {
    const labels = options.labels || {};
    const statusList = options.statusList || (() => []);
    return {
      uid: unit.uid,
      side: unit.side,
      name: unitName(unit, labels),
      short: unitShort(unit, labels),
      typeId: unit.typeId,
      tier: unit.tier,
      slot: unit.slot,
      x: Math.round(unit.x),
      y: Math.round(unit.y),
      hp: Math.max(0, Math.round(unit.hp || 0)),
      maxHp: Math.max(1, Math.round(unit.maxHp || 1)),
      shield: Math.max(0, Math.round(unit.shield || 0)),
      cooldown: Number(Math.max(0, unit.cooldown || 0).toFixed(2)),
      dead: Boolean(unit.dead),
      statuses: statusList(unit),
    };
  }

  function captureFrame(battle, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger) return null;
    const frame = {
      index: ledger.frames.length,
      t: time(battle),
      reason: options.reason || "tick",
      allies: (battle.allies || []).map((unit) => snapshotUnit(unit, options)),
      enemies: (battle.enemies || []).map((unit) => snapshotUnit(unit, options)),
    };
    ledger.frames.push(frame);
    if (options.maxFrames && ledger.frames.length > options.maxFrames) {
      ledger.frames.shift();
      ledger.frames.forEach((entry, index) => {
        entry.index = index;
      });
    }
    ledger.nextFrameAt = Math.max(ledger.nextFrameAt || 0, (battle.elapsed || 0) + (options.frameSeconds || 1));
    return frame;
  }

  function captureDueFrames(battle, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger) return;
    if (!ledger.frames.length) captureFrame(battle, { ...options, reason: "start" });
    while ((battle.elapsed || 0) >= (ledger.nextFrameAt || 0) && ledger.frames.length < (options.maxFrames || Infinity)) {
      captureFrame(battle, { ...options, reason: "tick" });
    }
  }

  function recordDamage(battle, source, target, hpDamage, shieldDamage = 0, options = {}) {
    const ledger = battle?.ledger;
    const impact = Math.max(0, hpDamage || 0) + Math.max(0, shieldDamage || 0);
    if (!ledger || impact <= 0 || !target) return 0;
    const targetSide = target.side || "enemy";
    const targetEntry = ensureUnit(ledger, target, options.labels);
    if (targetEntry) targetEntry.damageTaken += impact;
    ensureSide(ledger, targetSide).damageTaken += impact;
    if (source) {
      const sourceSide = source.side || (targetSide === "ally" ? "enemy" : "ally");
      const sourceEntry = ensureUnit(ledger, source, options.labels);
      if (sourceEntry) sourceEntry.damageDealt += impact;
      ensureSide(ledger, sourceSide).damageDealt += impact;
    }
    recordEvent(battle, {
      type: "damage",
      kind: options.kind || (options.status ? "status" : source ? "damage" : "environment"),
      source,
      target,
      amount: impact,
      hpDamage: Math.max(0, hpDamage || 0),
      shieldDamage: Math.max(0, shieldDamage || 0),
    }, options);
    return impact;
  }

  function recordKo(battle, source, target, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger || !target) return false;
    const targetEntry = ensureUnit(ledger, target, options.labels);
    if (targetEntry) targetEntry.defeated = true;
    if (source) {
      const sourceSide = source.side || "ally";
      const sourceEntry = ensureUnit(ledger, source, options.labels);
      if (sourceEntry) sourceEntry.kos += 1;
      ensureSide(ledger, sourceSide).kos += 1;
    }
    recordEvent(battle, { type: "ko", kind: "ko", source: source || null, target, amount: 1 }, options);
    return true;
  }

  function recordSupport(battle, unit, amount, kind, source = null, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger || !unit || amount <= 0) return false;
    const side = unit.side || "ally";
    const entry = ensureUnit(ledger, unit, options.labels);
    if (kind === "heal") {
      ensureSide(ledger, side).healingReceived += amount;
      if (entry) entry.healingReceived += amount;
    } else {
      ensureSide(ledger, side).shieldingReceived += amount;
      if (entry) entry.shieldingReceived += amount;
    }
    recordEvent(battle, { type: "support", kind, source, target: unit, amount }, options);
    return true;
  }

  function summarize(battle, options = {}) {
    const ledger = battle?.ledger;
    if (!ledger) return null;
    const units = Object.values(ledger.units);
    const allyUnits = units.filter((unit) => unit.side === "ally");
    const enemyUnits = units.filter((unit) => unit.side === "enemy");
    const topDamage = allyUnits.reduce((best, unit) => (unit.damageDealt > (best?.damageDealt || 0) ? unit : best), null);
    const topProtected = allyUnits.reduce((best, unit) => {
      const score = unit.healingReceived + unit.shieldingReceived;
      const bestScore = (best?.healingReceived || 0) + (best?.shieldingReceived || 0);
      return score > bestScore ? unit : best;
    }, null);
    return {
      result: options.won ? "win" : "loss",
      duration: Math.max(0.1, Number((battle.elapsed || 0).toFixed(1))),
      heartDamage: options.heartDamage,
      ally: { ...ensureSide(ledger, "ally"), losses: allyUnits.filter((unit) => unit.defeated).length },
      enemy: { ...ensureSide(ledger, "enemy"), losses: enemyUnits.filter((unit) => unit.defeated).length },
      units: units.map((unit) => ({ ...unit })),
      events: (ledger.events || []).map((event) => ({ ...event })),
      frames: (ledger.frames || []).map((frame) => ({
        ...frame,
        allies: frame.allies.map((unit) => ({ ...unit })),
        enemies: frame.enemies.map((unit) => ({ ...unit })),
      })),
      frameStepSeconds: options.frameStepSeconds || 1,
      mvp: topDamage
        ? {
            name: topDamage.short || topDamage.name,
            damageDealt: topDamage.damageDealt,
            kos: topDamage.kos,
          }
        : null,
      protected: topProtected
        ? {
            name: topProtected.short || topProtected.name,
            healingReceived: topProtected.healingReceived,
            shieldingReceived: topProtected.shieldingReceived,
          }
        : null,
    };
  }

  window.FoodAnimalsCombatLedgerCapture = {
    captureDueFrames,
    captureFrame,
    createLedger,
    ensureUnit,
    eventText,
    recordDamage,
    recordEvent,
    recordKo,
    recordSupport,
    snapshotUnit,
    summarize,
    time,
    unitLabel,
    unitRef,
  };
})();
