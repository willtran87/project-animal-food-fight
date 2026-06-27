(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ledgerUnits(ledger) {
    return Array.isArray(ledger?.units) ? ledger.units : Object.values(ledger?.units || {});
  }

  function defaultEventTypeFilters() {
    return { damage: true, support: true, ko: true, control: true };
  }

  function defaultReviewState() {
    return {
      open: false,
      unitUid: "all",
      filter: "all",
      frameIndex: -1,
      logScrollOffset: 0,
      focusedEventSeq: null,
      eventTypeFilters: defaultEventTypeFilters(),
      bigMomentsOnly: false,
    };
  }

  function reviewUnits(ledger) {
    return [
      { uid: "all", side: "all", short: "All", name: "All participants" },
      ...ledgerUnits(ledger).slice().sort((a, b) => {
        const sideDelta = (a.side === "ally" ? 0 : 1) - (b.side === "ally" ? 0 : 1);
        return sideDelta || String(a.short || a.name).localeCompare(String(b.short || b.name));
      }),
    ];
  }

  function currentFrameIndex(ledger, review) {
    const frames = ledger?.frames || [];
    if (!frames.length) return -1;
    if (!Number.isInteger(review.frameIndex) || review.frameIndex < 0) review.frameIndex = frames.length - 1;
    review.frameIndex = clamp(review.frameIndex, 0, frames.length - 1);
    return review.frameIndex;
  }

  function eventTypeId(event) {
    if (event?.type === "damage") return "damage";
    if (event?.type === "support") return "support";
    if (event?.type === "ko") return "ko";
    return "control";
  }

  function normalizeEventTypeFilters(filters, definitions = []) {
    const normalized = defaultEventTypeFilters();
    definitions.forEach((filter) => {
      normalized[filter.id] = filters?.[filter.id] !== false;
    });
    return Object.values(normalized).some(Boolean) ? normalized : defaultEventTypeFilters();
  }

  function eventTypeEnabled(event, review, definitions) {
    return normalizeEventTypeFilters(review.eventTypeFilters, definitions)[eventTypeId(event)] !== false;
  }

  function importantEvent(event, ledger) {
    if (!event) return false;
    if (event.type === "ko" || event.type === "control") return true;
    if (event.type === "damage") {
      const amount = (event.hpDamage || 0) + (event.shieldDamage || 0) + (event.amount || 0);
      const target = event.targetUid != null ? ledgerUnits(ledger).find((unit) => unit.uid === event.targetUid) : null;
      const scale = Math.max(18, Math.round((target?.damageTaken || target?.maxHp || 60) * 0.18));
      return amount >= scale;
    }
    if (event.type === "support") return (event.amount || 0) >= 20;
    return event.type === "battleStart";
  }

  function directionalFiltersEnabled(review) {
    return (review.unitUid || "all") !== "all";
  }

  function effectiveFilterId(review) {
    if (!directionalFiltersEnabled(review) && review.filter !== "all") return "all";
    return review.filter || "all";
  }

  function filterEvents(ledger, review, definitions = []) {
    const selectedUid = review.unitUid || "all";
    const filter = effectiveFilterId(review);
    review.eventTypeFilters = normalizeEventTypeFilters(review.eventTypeFilters, definitions);
    return (ledger?.events || []).filter((event) => {
      if (!eventTypeEnabled(event, review, definitions)) return false;
      if (review.bigMomentsOnly && !importantEvent(event, ledger)) return false;
      if (selectedUid === "all") return true;
      if (filter === "output") return event.sourceUid === selectedUid;
      if (filter === "input") return event.targetUid === selectedUid;
      return event.sourceUid === selectedUid || event.targetUid === selectedUid;
    });
  }

  function toggleEventTypeFilter(review, typeId, definitions) {
    const filters = { ...normalizeEventTypeFilters(review.eventTypeFilters, definitions) };
    if (!(typeId in filters)) return filters;
    filters[typeId] = !filters[typeId];
    review.eventTypeFilters = Object.values(filters).some(Boolean) ? filters : defaultEventTypeFilters();
    review.logScrollOffset = 0;
    review.focusedEventSeq = null;
    return review.eventTypeFilters;
  }

  function toggleBigMoments(review) {
    review.bigMomentsOnly = !review.bigMomentsOnly;
    review.logScrollOffset = 0;
    review.focusedEventSeq = null;
    return review.bigMomentsOnly;
  }

  function eventKey(event) {
    return event?.id ?? event?.seq ?? null;
  }

  function logScrollOffset(review, events, visibleRows) {
    const maxOffset = Math.max(0, (events?.length || 0) - visibleRows);
    const raw = Number.isFinite(review.logScrollOffset) ? review.logScrollOffset : 0;
    review.logScrollOffset = clamp(Math.round(raw), 0, maxOffset);
    return review.logScrollOffset;
  }

  function setLogScrollOffset(review, offset, events, visibleRows) {
    const maxOffset = Math.max(0, (events?.length || 0) - visibleRows);
    review.logScrollOffset = clamp(Math.round(offset || 0), 0, maxOffset);
    return review.logScrollOffset;
  }

  function frameIndexForEvent(ledger, event) {
    const frames = ledger?.frames || [];
    if (!frames.length || !event) return -1;
    let bestIndex = 0;
    let bestDelta = Infinity;
    frames.forEach((frame, index) => {
      const delta = Math.abs((frame.t || 0) - (event.t || 0));
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function centeredLogOffset(events, event, visibleRows) {
    const index = events.findIndex((entry) => eventKey(entry) === eventKey(event));
    if (index < 0 || events.length <= visibleRows) return 0;
    const end = clamp(index + Math.ceil(visibleRows / 2), visibleRows, events.length);
    return events.length - end;
  }

  function focusEvent(review, event) {
    review.focusedEventSeq = eventKey(event);
    return review.focusedEventSeq;
  }

  function nearestEventForFrame(ledger, review, events) {
    const frames = ledger?.frames || [];
    const frame = frames[currentFrameIndex(ledger, review)];
    if (!frame || !events?.length) return null;
    let best = events[0];
    let bestDelta = Infinity;
    events.forEach((event) => {
      const delta = Math.abs((event.t || 0) - (frame.t || 0));
      if (delta < bestDelta) {
        best = event;
        bestDelta = delta;
      }
    });
    return best;
  }

  window.FoodAnimalsCombatLedgerRuntime = {
    centeredLogOffset,
    currentFrameIndex,
    defaultEventTypeFilters,
    defaultReviewState,
    directionalFiltersEnabled,
    effectiveFilterId,
    eventKey,
    eventTypeEnabled,
    eventTypeId,
    filterEvents,
    focusEvent,
    frameIndexForEvent,
    importantEvent,
    logScrollOffset,
    nearestEventForFrame,
    normalizeEventTypeFilters,
    reviewUnits,
    setLogScrollOffset,
    toggleBigMoments,
    toggleEventTypeFilter,
  };
})();
