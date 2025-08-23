// Activity data builder: daily post counts, per-day words, streak, and heatmap weeks.
// Deterministic shaping based on collections.all dates.

function startOfDay(date) {
  const d = new Date(date);
  // Normalize to UTC day start to avoid timezone shifts in static builds
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return utc;
}

function dateKey(d) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}

const fs = require('node:fs');
const path = require('node:path');

module.exports = function(eleventyData) {
  const all = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  let posts = all.filter(p => p.url && p.url.startsWith('/posts/'));

  // Filesystem fallback if collections are empty or missing posts
  if (!posts.length) {
    try {
      const postsDir = path.join(__dirname, '..', 'posts');
      const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
      posts = files.map(file => {
        const full = path.join(postsDir, file);
        const raw = fs.readFileSync(full, 'utf8');
        const titleMatch = raw.match(/^\s*title:\s*(.+)\s*$/m);
        const dateMatch = raw.match(/^\s*date:\s*(\d{4}-\d{2}-\d{2})\s*$/m);
        const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, '');
        const date = dateMatch ? new Date(dateMatch[1]) : new Date();
        const slug = file.replace(/\.md$/, '');
        return { url: `/posts/${slug}/`, date, data: { title } };
      });
    } catch {
      // ignore fallback errors, leave posts empty
    }
  }

  // Count posts per calendar day and capture post refs
  const byDay = new Map();
  const postsByDay = new Map();
  const wordsByDay = new Map();

  // Pull analyzer data to get per-post word counts
  let analyzer;
  try {
    const buildAnalyzer = require('./analyzer.js');
    analyzer = buildAnalyzer(eleventyData) || { perPost: {} };
  } catch (_) {
    analyzer = { perPost: {} };
  }
  for (const p of posts) {
    const d = startOfDay(p.date || new Date());
    const key = dateKey(d);
    byDay.set(key, (byDay.get(key) || 0) + 1);
    const arr = postsByDay.get(key) || [];
    // Capture UTC hour if available from original date for behavior badges
    const postDate = p.date instanceof Date ? p.date : new Date(p.date || Date.now());
    const hour = Number.isFinite(postDate.getUTCHours?.()) ? postDate.getUTCHours() : 12;
    arr.push({ url: p.url, title: (p.data && p.data.title) || p.url, hour });
    postsByDay.set(key, arr);

    const words = (analyzer && analyzer.perPost && analyzer.perPost[p.url] && analyzer.perPost[p.url].words) || 0;
    wordsByDay.set(key, (wordsByDay.get(key) || 0) + words);
  }

  // Build recent window (e.g., last 28 days)
  const today = startOfDay(new Date());
  const windowDays = 28;
  const recent = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    recent.push({ date: key, count: byDay.get(key) || 0, words: wordsByDay.get(key) || 0 });
  }

  // Streak: consecutive days up to today with count>0
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const n = byDay.get(key) || 0;
    if (n > 0) streak += 1; else break;
  }

  // Group recent into weeks (arrays of 7)
  const weeks = [];
  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7));
  }

  // Build a calendar grid for the current month, padded to complete weeks (Sun-Sat)
  const firstOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const lastOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
  const start = new Date(firstOfMonth);
  // back to Sunday (UTC)
  start.setUTCDate(firstOfMonth.getUTCDate() - firstOfMonth.getUTCDay());
  const end = new Date(lastOfMonth);
  // forward to Saturday (UTC)
  end.setUTCDate(lastOfMonth.getUTCDate() + (6 - lastOfMonth.getUTCDay()));

  const calendarDays = [];
  const calendarWeeks = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    const key = dateKey(cursor);
    const dayObj = {
      date: key,
      count: byDay.get(key) || 0,
      words: wordsByDay.get(key) || 0,
      posts: postsByDay.get(key) || [],
      isCurrentMonth: cursor.getUTCMonth() === today.getUTCMonth(),
      dayOfMonth: cursor.getUTCDate(),
      weekday: cursor.getUTCDay(),
    };
    calendarDays.push(dayObj);
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate() + 1));
  }
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }
  const calendarMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  const postDays = Array.from(postsByDay.keys()).sort();

  // Build month keys spanning from earliest post month to latest among today/posts
  const getMonthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;
  let minDate = today;
  let maxDate = today;
  for (const p of posts) {
    const dd = startOfDay(p.date || today);
    if (dd < minDate) minDate = dd;
    if (dd > maxDate) maxDate = dd;
  }
  // Normalize to first day of month (UTC)
  minDate = new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1));
  maxDate = new Date(Date.UTC(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), 1));
  const months = [];
  const monthCalendars = {};
  const stepMonth = (d, delta) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+delta, 1));
  for (let d = new Date(minDate); d <= maxDate; d = stepMonth(d, 1)) {
    const key = getMonthKey(d);
    months.push(key);
    // Build calendar for this month
    const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+1, 0));
    const s = new Date(first); s.setUTCDate(first.getUTCDate() - first.getUTCDay());
    const e = new Date(last); e.setUTCDate(last.getUTCDate() + (6 - last.getUTCDay()));
    const days = []; const weeksX = [];
    let c = new Date(s);
    while (c <= e) {
      const k = dateKey(c);
      days.push({
        date: k,
        count: byDay.get(k) || 0,
        words: wordsByDay.get(k) || 0,
        posts: postsByDay.get(k) || [],
        isCurrentMonth: c.getUTCMonth() === d.getUTCMonth(),
        dayOfMonth: c.getUTCDate(),
        weekday: c.getUTCDay(),
      });
      c = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()+1));
    }
    for (let i = 0; i < days.length; i += 7) weeksX.push(days.slice(i, i+7));
    const label = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toLocaleString('default', { month: 'long', year: 'numeric' });
    const prev = getMonthKey(stepMonth(d, -1));
    const next = getMonthKey(stepMonth(d, 1));
    monthCalendars[key] = { calendarWeeks: weeksX, calendarDays: days, calendarMonth: label, prev, next };
  }

  // Ensure at least a rolling 12-month window up to current month, even with zero posts
  const ensureMonths = (countBack) => {
    const startMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    for (let i = countBack - 1; i >= 0; i--) {
      const d = stepMonth(startMonth, -i);
      const key = getMonthKey(d);
      if (!months.includes(key)) months.push(key);
      if (!monthCalendars[key]) {
        // Build empty calendar scaffold for month
        const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
        const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+1, 0));
        const s = new Date(first); s.setUTCDate(first.getUTCDate() - first.getUTCDay());
        const e = new Date(last); e.setUTCDate(last.getUTCDate() + (6 - last.getUTCDay()));
        const days = []; const weeksX = [];
        let c = new Date(s);
        while (c <= e) {
          const k = dateKey(c);
          days.push({
            date: k,
            count: byDay.get(k) || 0,
            words: wordsByDay.get(k) || 0,
            posts: postsByDay.get(k) || [],
            isCurrentMonth: c.getUTCMonth() === d.getUTCMonth(),
            dayOfMonth: c.getUTCDate(),
            weekday: c.getUTCDay(),
          });
          c = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()+1));
        }
        for (let i2 = 0; i2 < days.length; i2 += 7) weeksX.push(days.slice(i2, i2+7));
        const label = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toLocaleString('default', { month: 'long', year: 'numeric' });
        const prev = getMonthKey(stepMonth(d, -1));
        const next = getMonthKey(stepMonth(d, 1));
        monthCalendars[key] = { calendarWeeks: weeksX, calendarDays: days, calendarMonth: label, prev, next };
      }
    }
  };
  ensureMonths(12);

  // Sort months in ascending order (YYYY-MM)
  months.sort();

  return {
    byDay: Object.fromEntries(byDay.entries()),
    wordsByDay: Object.fromEntries(wordsByDay.entries()),
    postsByDay: Object.fromEntries(postsByDay.entries()),
    postDays,
    months,
    monthCalendars,
    recent,
    weeks,
    streak,
    calendarWeeks,
    calendarDays,
    calendarMonth,
  };
};
