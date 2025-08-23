// Dynamic Badge Ideas (locked/unlocked state)
// Depends on analyzer.js and activity.js

function ensureActivity(eleventyData) {
  if (eleventyData && eleventyData.activity) return eleventyData.activity;
  try {
    const buildActivity = require('./activity.js');
    return buildActivity(eleventyData) || {};
  } catch {
    return {};
  }
}

function ensureAnalyzer(eleventyData) {
  if (eleventyData && eleventyData.analyzer) return eleventyData.analyzer;
  try {
    const buildAnalyzer = require('./analyzer.js');
    return buildAnalyzer(eleventyData) || { totals: { posts: 0, words: 0 } };
  } catch {
    return { totals: { posts: 0, words: 0 } };
  }
}

module.exports = function(eleventyData) {
  const activity = ensureActivity(eleventyData);
  const analyzer = ensureAnalyzer(eleventyData);

  const posts = analyzer?.totals?.posts || 0;
  const words = analyzer?.totals?.words || 0;
  const streak = activity?.streak || 0;

  // Weekend writer: any activity day that falls on Sat(6) or Sun(0)
  let weekend = false;
  if (activity && activity.byDay) {
    for (const dateStr of Object.keys(activity.byDay)) {
      const count = activity.byDay[dateStr] || 0;
      if (count > 0) {
        const d = new Date(dateStr + 'T00:00:00Z');
        const day = d.getUTCDay();
        if (day === 0 || day === 6) { weekend = true; break; }
      }
    }
  }

  const ideas = [
    { key: 'first-post', label: 'First Post', emoji: '🌱', earned: posts >= 1, requirement: 'Write your first post' },
    { key: 'five-posts', label: '5 Posts', emoji: '🖐️', earned: posts >= 5, requirement: 'Write 5 posts' },
    { key: 'ten-posts', label: '10 Posts', emoji: '🔟', earned: posts >= 10, requirement: 'Write 10 posts' },
    { key: '1k-words', label: '1k Words', emoji: '🔡', earned: words >= 1000, requirement: 'Reach 1,000 total words' },
    { key: '7-day-streak', label: '7-Day Streak', emoji: '🔥', earned: streak >= 7, requirement: 'Maintain a 7-day streak' },
    { key: 'weekend-writer', label: 'Weekend Writer', emoji: '🗓️', earned: weekend, requirement: 'Write on a weekend' },
  ];

  // Provide a tooltip string and aria label for accessibility
  for (const i of ideas) {
    i.state = i.earned ? 'Unlocked' : 'Locked';
    i.title = `${i.state}: ${i.label}${i.earned ? '' : ' — ' + i.requirement}`;
    i['aria-label'] = i.title;
  }

  return ideas;
};
