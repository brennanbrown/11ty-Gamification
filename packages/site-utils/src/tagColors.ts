// Deterministic tag color utilities
// - tagColor(tag): returns hex background color
// - tagTextColor(hexOrHsl): returns '#000000' or '#ffffff' for contrast

export type HSL = { h: number; s: number; l: number };

function hashTag(str: string): number {
  // Simple FNV-1a
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function hueFromHash(tag: string): number {
  const h = hashTag(tag.toLowerCase());
  // Distribute across 0-360; jitter to avoid clustering
  return (h % 360 + ((h >>> 9) % 7)) % 360;
}

export function tagColorHsl(tag: string): HSL {
  const h = hueFromHash(tag);
  // Pastel yet vivid; tune S/L for accessibility in light mode
  return { h, s: 72, l: 55 };
}

export function hslToRgb({ h, s, l }: HSL): { r: number; g: number; b: number } {
  const S = s / 100;
  const L = l / 100;
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const Hp = h / 60;
  const X = C * (1 - Math.abs((Hp % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (0 <= Hp && Hp < 1) [r1, g1, b1] = [C, X, 0];
  else if (1 <= Hp && Hp < 2) [r1, g1, b1] = [X, C, 0];
  else if (2 <= Hp && Hp < 3) [r1, g1, b1] = [0, C, X];
  else if (3 <= Hp && Hp < 4) [r1, g1, b1] = [0, X, C];
  else if (4 <= Hp && Hp < 5) [r1, g1, b1] = [X, 0, C];
  else [r1, g1, b1] = [C, 0, X];
  const m = L - C / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function tagColor(tag: string): string {
  const hsl = tagColorHsl(tag);
  const { r, g, b } = hslToRgb(hsl);
  return rgbToHex(r, g, b);
}

export function tagTextColor(bg: string | HSL): string {
  let r: number, g: number, b: number;
  if (typeof bg === 'string') {
    // Expect #rrggbb
    const m = /^#([0-9a-f]{6})$/i.exec(bg);
    if (!m) return '#111111';
    const num = parseInt(m[1], 16);
    r = (num >> 16) & 0xff;
    g = (num >> 8) & 0xff;
    b = num & 0xff;
  } else {
    ({ r, g, b } = hslToRgb(bg));
  }
  // YIQ for contrast; threshold ~128
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#111111' : '#ffffff';
}
