window.StormbringerRecords = {
  LAST_RUN_KEY: "stormbringer-last-run",
  BEST_RUN_KEY: "stormbringer-best-run",
  LEGACY_LAST_RUN_KEY: "neon-null-last-run",
  LEGACY_BEST_RUN_KEY: "neon-null-best-run",
  emptyKills: () => ({
    ship: 0,
    jet: 0,
    ufo: 0,
    cargo: 0,
    splitter: 0,
    splitterShard: 0,
    mine: 0,
    mothership: 0,
    bossCannon: 0,
    boss: 0,
  }),
  loadStoredSummary(key) {
    try {
      const raw = window.localStorage ? window.localStorage.getItem(key) : null;
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  },
  storeSummary(key, summary) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(summary));
      }
    } catch (error) {
      // Stats are nice-to-have; storage can be blocked in private contexts.
    }
  },
  formatSigned(value) {
    if (value > 0) return `+${value.toLocaleString()}`;
    return value.toLocaleString();
  },
};
