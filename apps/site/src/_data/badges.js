// Badge Engine (Phase 1): streak, spirit (total days), wordcount
// Uses existing data builders: activity.js and analyzer.js

// Extended tiers (subset of full spec for practicality in tests/UI)
const STREAK_THRESHOLDS = [3, 5, 10, 30, 100, 200, 365];
const WORD_MILESTONES = [750, 5000, 10000, 50000, 100000, 250000, 500000, 750000, 1000000];

const STREAK_LABELS = {
  3: { emoji: '🌱', name: 'Seedling' },
  5: { emoji: '🌿', name: 'Herb' },
  10: { emoji: '🍀', name: 'Four Leaf Clover' },
  30: { emoji: '🌸', name: 'Cherry Blossom' },
  100: { emoji: '🌻', name: 'Sunflower' },
  200: { emoji: '🌳', name: 'Deciduous Tree' },
  365: { emoji: '🌲', name: 'Evergreen Tree' },
};

const WORD_LABELS = {
  750: { emoji: '✨', name: 'Sparkles' },
  5000: { emoji: '✍️', name: 'Scribe' },
  10000: { emoji: '⭐', name: 'Star' },
  50000: { emoji: '🌟', name: 'Glowing Star' },
  100000: { emoji: '🌙', name: 'Crescent Moon' },
  250000: { emoji: '🌕', name: 'Full Moon' },
  500000: { emoji: '☄️', name: 'Comet' },
  750000: { emoji: '🪐', name: 'Saturn' },
  1000000: { emoji: '🌌', name: 'Milky Way' },
};

module.exports = function(eleventyData) {
  // Ensure dependencies are available even if Eleventy load order differs
  const ensureActivity = () => {
    if (eleventyData.activity) return eleventyData.activity;
    try {
      const buildActivity = require('./activity.js');
      return buildActivity(eleventyData) || {};
    } catch {
      return {};
    }
  };
  const ensureAnalyzer = () => {
    if (eleventyData.analyzer) return eleventyData.analyzer;
    try {
      const buildAnalyzer = require('./analyzer.js');
      return buildAnalyzer(eleventyData) || { totals: { words: 0 } };
    } catch {
      return { totals: { words: 0 } };
    }
  };

  const activity = ensureActivity();
  const analyzer = ensureAnalyzer();

  const streak = activity.streak || 0;
  const totalActiveDays = activity.byDay
    ? Object.values(activity.byDay).filter((c) => (c || 0) > 0).length
    : 0;
  const words = analyzer.totals?.words || 0;

  // Determine if today had activity (UTC date string YYYY-MM-DD)
  const todayUtc = new Date().toISOString().slice(0, 10);
  const todayActive = !!(activity.byDay && activity.byDay[todayUtc] && activity.byDay[todayUtc] > 0);

  const earnedStreak = STREAK_THRESHOLDS.filter((t) => streak >= t).map((t) => ({
    key: `streak-${t}`,
    category: 'streak',
    threshold: t,
    ...STREAK_LABELS[t],
  }));
  const nextStreak = STREAK_THRESHOLDS.find((t) => streak < t) || null;

  const earnedSpirit = STREAK_THRESHOLDS.filter((t) => totalActiveDays >= t).map((t) => ({
    key: `spirit-${t}`,
    category: 'spirit',
    threshold: t,
    ...STREAK_LABELS[t],
  }));
  const nextSpirit = STREAK_THRESHOLDS.find((t) => totalActiveDays < t) || null;

  const earnedWord = WORD_MILESTONES.filter((t) => words >= t).map((t) => ({
    key: `word-${t}`,
    category: 'wordcount',
    threshold: t,
    ...WORD_LABELS[t],
  }));
  const nextWord = WORD_MILESTONES.find((t) => words < t) || null;

  // Full tier lists with earned flags for UI (locked placeholders can use these)
  const tiers = {
    streak: STREAK_THRESHOLDS.map((t) => ({
      key: `streak-${t}`,
      category: 'streak',
      threshold: t,
      earned: streak >= t,
      recent: todayActive && streak === t,
      ...STREAK_LABELS[t],
    })),
    spirit: STREAK_THRESHOLDS.map((t) => ({
      key: `spirit-${t}`,
      category: 'spirit',
      threshold: t,
      earned: totalActiveDays >= t,
      recent: todayActive && totalActiveDays === t,
      ...STREAK_LABELS[t],
    })),
    wordcount: WORD_MILESTONES.map((t) => ({
      key: `word-${t}`,
      category: 'wordcount',
      threshold: t,
      earned: words >= t,
      // For now, we don't compute recent for wordcount due to lack of per-day word delta here
      recent: false,
      ...WORD_LABELS[t],
    })),
  };

  // Behavior badges (minimal): Early Bird (any post <09:00 UTC today), Night Owl (any post >=22:00 UTC today)
  const todayKey = new Date().toISOString().slice(0, 10);
  const postsToday = (activity.postsByDay && activity.postsByDay[todayKey]) || [];
  const hoursToday = Array.isArray(postsToday) ? postsToday.map(p => (typeof p.hour === 'number' ? p.hour : null)).filter(h => h !== null) : [];
  const earlyBird = hoursToday.some(h => h >= 0 && h < 9);
  const nightOwl = hoursToday.some(h => h >= 22 && h <= 23);

  return {
    streak,
    totalActiveDays,
    words,
    earned: {
      streak: earnedStreak,
      spirit: earnedSpirit,
      wordcount: earnedWord,
    },
    next: {
      streak: nextStreak,
      spirit: nextSpirit,
      wordcount: nextWord,
    },
    tiers,
    behavior: [
      { key: 'early-bird', name: 'Early Bird', emoji: '🐦', earned: earlyBird },
      { key: 'night-owl', name: 'Night Owl', emoji: '🦉', earned: nightOwl },
    ],
  };
};
