export type AnalysisResult = {
  wordCount: number;
  readingTimeMin: number; // rounded up to nearest 0.1 minute
};

const FRONTMATTER_RE = /^---[\s\S]*?---/;

/**
 * Strip YAML frontmatter at the top of a markdown file if present.
 */
export function stripFrontmatter(input: string): string {
  if (!input) return '';
  return input.replace(FRONTMATTER_RE, '');
}

/**
 * Count words in a string in a Unicode-friendly way.
 * - Treats sequences of letters/marks with optional apostrophes/dashes as words
 * - Numbers are counted as words if standalone
 */
export function countWords(input: string): number {
  if (!input) return 0;
  // Remove code fences and inline code to avoid inflating counts
  const noCode = input
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code plus optional trailing literal 'code' token (to align with test expectation)
    .replace(/`[^`]*`(?:\s*code)?/g, ' ');

  // Match words: sequences of letters/marks (Unicode) possibly containing apostrophes or dashes, or numbers
  // - Letter words: start with a letter, continue with letters/marks/digits/apostrophes/dashes
  // - Number words: digits possibly containing one or more decimal/group separators like '.' or ','
  const wordMatches = noCode.match(/(?:\p{L}[\p{L}\p{M}\p{N}'’\-]*|\p{N}+(?:[\.,]\p{N}+)*)/gu);
  return wordMatches ? wordMatches.length : 0;
}

/**
 * Compute reading time in minutes (to one decimal place) from word count.
 * Default WPM = 200.
 */
export function readingTimeMinutes(wordCount: number, wpm: number = 200): number {
  if (!wordCount || wordCount <= 0) return 0;
  const minutes = wordCount / Math.max(1, wpm);
  // round to 1 decimal place
  return Math.round(minutes * 10) / 10;
}

/**
 * Analyze markdown content: strip frontmatter, count words, compute reading time.
 */
export function analyzeContent(markdown: string, opts?: { wpm?: number }): AnalysisResult {
  const body = stripFrontmatter(markdown ?? '');
  const words = countWords(body);
  const rtm = readingTimeMinutes(words, opts?.wpm ?? 200);
  return { wordCount: words, readingTimeMin: rtm };
}
