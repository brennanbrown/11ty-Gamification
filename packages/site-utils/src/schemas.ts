export type ValidationResult<T> = {
  ok: boolean;
  errors: string[];
  value?: T;
};

export type Frontmatter = {
  title?: string;
  date?: string | Date;
  tags?: string[];
  categories?: string[];
  draft?: boolean;
};

export function validateFrontmatter(input: any): ValidationResult<Frontmatter> {
  const errors: string[] = [];
  const out: Frontmatter = {};

  if (input == null || typeof input !== 'object') {
    return { ok: false, errors: ['frontmatter must be an object'] };
  }

  if (input.title != null && typeof input.title !== 'string') {
    errors.push('title must be a string');
  } else if (typeof input.title === 'string') {
    out.title = input.title;
  }

  if (input.date != null && !(typeof input.date === 'string' || input.date instanceof Date)) {
    errors.push('date must be an ISO string or Date');
  } else if (input.date) {
    out.date = input.date;
  }

  const arrCheck = (val: any, name: string) => {
    if (val == null) return;
    if (!Array.isArray(val) || !val.every((t) => typeof t === 'string')) {
      errors.push(`${name} must be an array of strings`);
    } else if (Array.isArray(val)) {
      // normalize unique, stable order
      out[name as 'tags' | 'categories'] = Array.from(new Set(val));
    }
  };

  arrCheck(input.tags, 'tags');
  arrCheck(input.categories, 'categories');

  if (input.draft != null && typeof input.draft !== 'boolean') {
    errors.push('draft must be a boolean');
  } else if (typeof input.draft === 'boolean') {
    out.draft = input.draft;
  }

  return { ok: errors.length === 0, errors, value: out };
}

export type ActivityByDay = Record<string, number>;
export type PostsByDay = Record<string, { url: string; title: string; hour?: number }[]>;
export type Activity = {
  streak?: number;
  byDay?: ActivityByDay;
  postsByDay?: PostsByDay;
};

export function validateActivity(input: any): ValidationResult<Activity> {
  const errors: string[] = [];
  const out: Activity = {};
  if (input == null || typeof input !== 'object') {
    return { ok: false, errors: ['activity must be an object'] };
  }

  if (input.streak != null && !(Number.isFinite(input.streak) && input.streak >= 0)) {
    errors.push('streak must be a non-negative number');
  } else if (Number.isFinite(input.streak)) {
    out.streak = input.streak;
  }

  if (input.byDay != null) {
    if (typeof input.byDay !== 'object') {
      errors.push('byDay must be an object');
    } else {
      const byDayOut: ActivityByDay = {};
      for (const [k, v] of Object.entries(input.byDay)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) errors.push(`byDay key '${k}' must be YYYY-MM-DD`);
        if (!(Number.isFinite(v) && (v as number) >= 0)) errors.push(`byDay['${k}'] must be non-negative number`);
        else byDayOut[k] = v as number;
      }
      out.byDay = byDayOut;
    }
  }

  if (input.postsByDay != null) {
    if (typeof input.postsByDay !== 'object') {
      errors.push('postsByDay must be an object');
    } else {
      const pbd: PostsByDay = {};
      for (const [k, arr] of Object.entries(input.postsByDay)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) errors.push(`postsByDay key '${k}' must be YYYY-MM-DD`);
        if (!Array.isArray(arr)) {
          errors.push(`postsByDay['${k}'] must be an array`);
          continue;
        }
        const norm = [] as { url: string; title: string; hour?: number }[];
        for (const p of arr as any[]) {
          if (!p || typeof p !== 'object') {
            errors.push(`postsByDay['${k}'] items must be objects`);
            continue;
          }
          if (typeof p.url !== 'string') errors.push(`postsByDay['${k}'] item.url must be string`);
          if (typeof p.title !== 'string') errors.push(`postsByDay['${k}'] item.title must be string`);
          if (p.hour != null && !(Number.isFinite(p.hour) && p.hour >= 0 && p.hour <= 23)) {
            errors.push(`postsByDay['${k}'] item.hour must be 0-23 if present`);
          }
          norm.push({ url: p.url, title: p.title, hour: p.hour });
        }
        pbd[k] = norm;
      }
      out.postsByDay = pbd;
    }
  }

  return { ok: errors.length === 0, errors, value: out };
}

export type AnalyzerTotals = { words: number };
export type Analyzer = { totals?: AnalyzerTotals };

export function validateAnalyzer(input: any): ValidationResult<Analyzer> {
  const errors: string[] = [];
  const out: Analyzer = {};

  if (input == null || typeof input !== 'object') {
    return { ok: false, errors: ['analyzer must be an object'] };
  }
  if (input.totals != null) {
    if (typeof input.totals !== 'object') errors.push('totals must be an object');
    else {
      const words = (input.totals as any).words;
      if (!(Number.isFinite(words) && words >= 0)) errors.push('totals.words must be a non-negative number');
      else out.totals = { words };
    }
  }

  return { ok: errors.length === 0, errors, value: out };
}
