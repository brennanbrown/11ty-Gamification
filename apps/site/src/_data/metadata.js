const fs = require('node:fs');
const path = require('node:path');

const CACHE_DIR = path.resolve(__dirname, '../.cache/metadata');
const CACHE_FILE = path.join(CACHE_DIR, 'enrichment.json');

function ensureDir(p) {
  try { fs.mkdirSync(p, { recursive: true }); } catch {}
}

function moonPhaseFor(dateStr) {
  // Simple approximate moon phase based on days since known new moon (2000-01-06)
  const ref = new Date('2000-01-06T18:14:00Z').getTime();
  const d = new Date(dateStr + 'T00:00:00Z').getTime();
  const synodic = 29.530588853 * 24 * 3600 * 1000; // ms
  const age = ((d - ref) % synodic + synodic) % synodic;
  const phase = age / synodic;
  // Map to rough names
  if (phase < 0.03 || phase > 0.97) return 'new';
  if (phase < 0.22) return 'waxing-crescent';
  if (phase < 0.28) return 'first-quarter';
  if (phase < 0.47) return 'waxing-gibbous';
  if (phase < 0.53) return 'full';
  if (phase < 0.72) return 'waning-gibbous';
  if (phase < 0.78) return 'last-quarter';
  return 'waning-crescent';
}

module.exports = function(eleventyData) {
  const enabled = String(process.env.METADATA_ENABLED || '').toLowerCase() === '1' || String(process.env.METADATA_ENABLED || '').toLowerCase() === 'true';
  // Ensure activity data loads even if Eleventy order differs
  const ensureActivity = () => {
    if (eleventyData.activity) return eleventyData.activity;
    try {
      const buildActivity = require('./activity.js');
      return buildActivity(eleventyData) || {};
    } catch {
      return {};
    }
  };
  const activity = ensureActivity();

  const enrichment = { enabled, itemsByDate: {} };
  if (!enabled) return { enrichment };

  const byDay = activity.byDay || {};
  const dates = Object.keys(byDay);
  for (const key of dates) {
    enrichment.itemsByDate[key] = {
      tz: 'UTC',
      moon: moonPhaseFor(key),
      weather: null,
    };
  }

  try {
    ensureDir(CACHE_DIR);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(enrichment, null, 2), 'utf8');
  } catch {}

  return { enrichment };
};
