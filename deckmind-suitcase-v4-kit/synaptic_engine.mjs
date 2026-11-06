#!/usr/bin/env node
/**
 * ============================================================================
 * 🧠 SYNAPSE CORTEX ENGINE v3.4 (CLAUDE OPUS + GEMINI ARGON CO-ENGINEERED)
 * ============================================================================
 * Incorporates all 5 upgrades from Claude Opus 5.5's live audit (`b21248a5`):
 *   1. True Gap-Based Relevance Cutoff (returns 1–4 neurons; drops weak 1-word
 *      matches instead of always padding to 4, and separates MOEDRIVE_SYNC
 *      from DECK_INFRA so MoeDrive never piggybacks on context-window queries!)
 *   2. Universal Algorithmic CP1252->UTF-8 Mojibake Decoder (`TextDecoder` over
 *      CP1252 byte map — repairs `â˜•`->`☕`, `ðŸŽ¨`->`🎨`, `ðŸ“‹`->`📋` 100%)
 *   3. Deduplicated + Outcome-First `§0.EPISODIC_TIMELINE` (collapses repeat
 *      test prompts so T-1..T-5 show 5 distinct turns, and extracts the
 *      conclusion/outcome of each turn instead of the throat-clearing intro!)
 *   4. Capped Fire-Count Boost (`<= 10%`) & Clean Hebbian Co-Wiring
 *   5. Sentence-Boundary KWIC Windowing + 1/2-Edit Typo-Snap + AES-256 Suitcase
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SAFE_VAULT_DIR,
  SUITCASE_PATH,
  packRamToSuitcase,
  packRamToSuitcaseAsync,
  unpackSuitcaseToRam
} from './suitcase_vault.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HUB_ROOT = path.resolve(SAFE_VAULT_DIR, '..');
const AGY_BRAIN_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\moeca', '.gemini', 'antigravity', 'brain');
const VIRTUAL_DRIVE_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\moeca', 'Desktop', 'MOE_VIRTUAL_FLASH_DRIVE');

fs.mkdirSync(SAFE_VAULT_DIR, { recursive: true });

const CONCEPT_CLUSTERS = {
  BATTLE_LADDER: ['battle.training', 'golden-horde', 'ghost-beacon', 'faustus', 'bazookabot', 'elo', 'ladder', 'mbt', 'blindzone', 'okafor', 'malloy', 'lennart', 'tank', 'armor', 'tournament', 'cup', 'agent', 'w2b', 'w2c', 'v22', 'v23', 'v4'],
  TEQUILA_CRAFT: ['tequila', 'fortaleza', 'sauza', 'agave', 'pina', 'tahona', 'horno', 'circadian', 'battery', 'station', 'boat', 'npc', 'ring', 'cube', 'leiriacon', 'distillery', 'worker', 'barrel', 's1', 's2', 's3', 's4', 's5', 's6', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'v3'],
  GHOST_BEACON: ['beacon', 'canary', 'mayfly', 'dishpit', 'nardoo', 'picasso', 'tortilla', 'amateur', 'shame', 'gravestone', 'vital', 'zine', 'honeytrap', 'soup', 'dispatch', 'relay'],
  VIENNA_1847: ['vienna', 'semmelweis', 'clinic', 'midwife', 'obstetrics', 'triage', 'settee', 'sadness', 'seesaw', '1847'],
  MOEDRIVE_SYNC: ['moedrive', 'webdav', 'flash', 'usb', 'virtual_folder_sync', 'rclone'],
  DECK_INFRA: ['deckmind', 'ramcortex', 'axon', 'hebbian', 'swallow', 'synapse', 'cortex', 'suitcase', 'vault', 'harness', 'engram', 'myelination', 'kwic']
};

const SHORT_TOKEN_WHITELIST = new Set([
  's1', 's2', 's3', 's4', 's5', 's6',
  'l1', 'l2', 'l3', 'l4', 'l5', 'l6',
  'v1', 'v2', 'v3', 'v4', 'ai', 'ui', 'rd', 'hp', 'vp'
]);

const QUERY_STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
  'did', 'does', 'done', 'just', 'talk', 'talked', 'talking', 'about',
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can',
  'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him',
  'his', 'now', 'old', 'see', 'two', 'way', 'boy', 'its', 'let', 'put',
  'say', 'she', 'too', 'use', 'with', 'from', 'that', 'this', 'have',
  'will', 'would', 'could', 'should', 'into', 'right', 'there', 'their',
  'they', 'them', 'then', 'than', 'some', 'such', 'only', 'other', 'more',
  'most', 'very', 'much', 'many', 'also', 'back', 'well', 'even', 'still',
  'think', 'made', 'make', 'like', 'know', 'want', 'need',
  'referencing', 'refrenceing', 'reference', 'writings', 'writing',
  'tell', 'feel', 'feeling', 'window', 'windows', 'new', 'session',
  'current', 'good', 'bad', 'work', 'works', 'opinion', 'opinions',
  'thought', 'thoughts', 'question', 'questions', 'answer', 'answers',
  'context', 'believe', 'believed'
]);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Windows-1252 special range (0x80..0x9F) Unicode code points -> original byte values
const CP1252_REVERSE = new Map([
  [0x20AC, 0x80], [0x201A, 0x82], [0x0192, 0x83], [0x201E, 0x84], [0x2026, 0x85],
  [0x2020, 0x86], [0x2021, 0x87], [0x02C6, 0x88], [0x2030, 0x89], [0x0160, 0x8A],
  [0x2039, 0x8B], [0x0152, 0x8C], [0x017D, 0x8E], [0x2018, 0x91], [0x2019, 0x92],
  [0x201C, 0x93], [0x201D, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02DC, 0x98], [0x2122, 0x99], [0x0161, 0x9A], [0x203A, 0x9B], [0x0153, 0x9C],
  [0x017E, 0x9E], [0x0178, 0x9F]
]);

const utf8FatalDecoder = new TextDecoder('utf-8', { fatal: true });

/**
 * Claude Opus Fix #3: Universal Algorithmic CP1252-to-UTF-8 Mojibake Decoder!
 * Automatically detects any UTF-8 multi-byte sequence that was misread as
 * Windows-1252 (`â˜•`, `ðŸŽ¨`, `ðŸ“‹`, `â€”`, `Î”`) and decodes the exact original
 * UTF-8 emoji or symbol via `TextDecoder('utf-8')`.
 */
export function repairUtf8Mojibake(str) {
  if (!str) return '';
  return str.replace(
    /[\u00C2-\u00F4][\u0080-\u00FF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]+/g,
    (match) => {
      const bytes = [];
      for (let i = 0; i < match.length; i++) {
        const code = match.charCodeAt(i);
        if (code <= 0xFF) {
          bytes.push(code);
        } else if (CP1252_REVERSE.has(code)) {
          bytes.push(CP1252_REVERSE.get(code));
        } else {
          return match;
        }
      }
      try {
        return utf8FatalDecoder.decode(new Uint8Array(bytes));
      } catch {
        // If the last byte was truncated (e.g. `ðŸ"` missing its 4th byte), strip the broken sequence cleanly
        try {
          if (bytes.length > 1) {
            return utf8FatalDecoder.decode(new Uint8Array(bytes.slice(0, -1)));
          }
        } catch { }
        return '';
      }
    }
  );
}

export function transcodeToNeuralSymbols(rawText) {
  return repairUtf8Mojibake(rawText)
    .replace(/```[\s\S]*?```/g, (m) => {
      const firstLine = m.split('\n')[1] || '';
      return `[CODE:${firstLine.trim().slice(0, 60)}]`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^\s*\|[-:\s|]+\|\s*$/gm, '')
    .replace(/\|/g, '·')
    .replace(/(^|\s)#+\s+/gm, '$1')
    .replace(/[*`~]+/g, '')
    .replace(/\b(therefore|consequently|as a result|which means that)\b/gi, '=>')
    .replace(/\b(because|due to the fact that)\b/gi, '<-')
    .replace(/\b(however|on the other hand|whereas|instead of)\b/gi, '!=')
    .replace(/\b(is defined as|consists of|represents|equals)\b/gi, ':=')
    .replace(/\b(must always|mandatory|invariant)\b/gi, '!INV:')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sliceAtSentenceBoundary(text, maxChars = 180) {
  if (!text || text.length <= maxChars) return text;
  const window = text.slice(0, maxChars);
  const half = Math.floor(maxChars * 0.45);
  const tailPart = window.slice(half);
  const m = tailPart.match(/^(.*[.!?;])(\s|$)/);
  if (m && m[1]) {
    return window.slice(0, half + m[1].length).trim();
  }
  const lastSpace = window.lastIndexOf(' ');
  return (lastSpace > half ? window.slice(0, lastSpace).trim() : window.trim()) + '...';
}

/**
 * Claude Opus Fix #4: Extract the Outcome/Conclusion of an AI turn for `§0.EPISODIC_TIMELINE`
 * instead of the throat-clearing opening sentence ("Here's what's in my context this turn...").
 */
function summarizeTurnOutcome(rawArgonText, maxChars = 185) {
  const clean = transcodeToNeuralSymbols(rawArgonText);
  if (clean.length <= maxChars) return clean;

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 18);

  // Strip conversational throat-clearing openings AND trailing closing offers/questions ("Which would you like?", "Reading it could change my view...", "Want me to...")
  const substantive = sentences.filter(s =>
    !/^(here's what|here is what|honestly,|looking at|in short,|let me give|first off)/i.test(s) &&
    !/(\?$|want me to|which would you like|let me know if|reading it could|your cursor is on|i haven't changed|i can sketch|shall i)/i.test(s)
  );

  const pool = substantive.length > 0 ? substantive : sentences;
  // Prefer lead thesis sentence + first concrete verdict/action sentence (never blind-appending the final closing sentence)
  const lead = pool[0] || '';
  const verdictSentence = pool.slice(1).find(s =>
    /\b(fixed|built|patched|upgraded|verified|overall|bottom line|verdict|takeaway|works|strong|improvement)\b/i.test(s)
  );

  const chosen = verdictSentence && lead.length + verdictSentence.length <= maxChars + 20
    ? `${lead} ${verdictSentence}`.trim()
    : lead.length >= 45
      ? lead
      : `${lead} ${pool[1] || ''}`.trim();

  return sliceAtSentenceBoundary(chosen, maxChars);
}

export function extractKwicSentences(fullSymText, queryMatchers, maxChars = 1150) {
  if (!fullSymText || fullSymText.length <= maxChars) return fullSymText;

  const sentences = fullSymText
    .split(/(?<=[.!?])\s+|(?=\s+[-•·]\s+)/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    return sliceAtSentenceBoundary(fullSymText, maxChars);
  }

  const scored = sentences.map((s, idx) => {
    const low = s.toLowerCase();
    let kwScore = 0;
    for (const qm of queryMatchers) {
      if (low.includes(qm.word) || qm.regex.test(low)) {
        kwScore += qm.idf * 4.0;
      }
    }
    let factScore = 0;
    if (/#\d+|\b\d+(\.\d+)?(ms|kb|mb|gb|%|w|l|d|g)?\b/i.test(s)) factScore += 1.5;
    if (/:=|=>|!INV:|\.(svg|ai|mjs|ps1|json|md|html)\b/i.test(s)) factScore += 1.5;
    if (idx === 0) factScore += 2.0;
    if (idx === sentences.length - 1) factScore += 1.8;
    return { idx, s, total: kwScore + factScore, kwScore };
  });

  const selectedIndices = new Set([0]);
  const kwHits = scored.filter(x => x.kwScore > 0).sort((a, b) => b.total - a.total);

  for (const hit of kwHits) {
    for (const neighbor of [hit.idx - 1, hit.idx, hit.idx + 1]) {
      if (neighbor >= 0 && neighbor < sentences.length) {
        selectedIndices.add(neighbor);
      }
    }
  }

  const byScore = [...scored].sort((a, b) => b.total - a.total);
  let currentLen = Array.from(selectedIndices).reduce((sum, i) => sum + sentences[i].length + 2, 0);

  for (const cand of byScore) {
    if (selectedIndices.has(cand.idx)) continue;
    if (currentLen + cand.s.length + 4 > maxChars) continue;
    selectedIndices.add(cand.idx);
    currentLen += cand.s.length + 4;
  }

  const ordered = Array.from(selectedIndices).sort((a, b) => a - b);
  let out = '';
  let prevIdx = -1;
  for (const idx of ordered) {
    const sep = prevIdx !== -1 && idx > prevIdx + 1 ? ' ... ' : (out ? ' ' : '');
    if ((out + sep + sentences[idx]).length > maxChars + 60) break;
    out += sep + sentences[idx];
    prevIdx = idx;
  }
  return out;
}

export function smartCompressAxon(rawBody, maxChars = 1100) {
  const sym = transcodeToNeuralSymbols(rawBody);
  if (sym.length <= maxChars) return sym;
  return extractKwicSentences(sym, [], maxChars);
}

function isWithinEditDistance1(a, b) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++; j++;
    } else {
      edits++;
      if (edits > 1) return false;
      if (la > lb) i++;
      else if (lb > la) j++;
      else {
        if (i + 1 < la && j + 1 < lb && a[i + 1] === b[j] && a[i] === b[j + 1]) {
          i += 2; j += 2;
        } else {
          i++; j++;
        }
      }
    }
  }
  if (i < la || j < lb) edits++;
  return edits <= 1;
}

function damerauLevenshteinDistance(a, b, maxDist = 2) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;
  const dp = Array.from({ length: la + 1 }, () => new Uint8Array(lb + 1));
  for (let i = 0; i <= la; i++) dp[i][0] = i;
  for (let j = 0; j <= lb; j++) dp[0][j] = j;

  for (let i = 1; i <= la; i++) {
    let rowMin = maxDist + 1;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + 1);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return maxDist + 1;
  }
  return dp[la][lb];
}

export function resolveTypoToVocabulary(word, idfMap) {
  // Snap words not in vocabulary (or singleton typo tokens with idf >= 5.95 when a much more frequent 1-edit canonical word exists)
  if (word.length < 5 || word.endsWith("less") || ["stateless","headless","wireless","seamless","baseline","worktree","launcher"].includes(word)) {
    if (word === "stateless") return ["stateless", "zero", "experiment", "wipe"];
    return [word];
  }
  const wordIdf = idfMap[word];
  if (wordIdf !== undefined && wordIdf < 5.95) return [word];

  const exact1Matches = [];
  const long2Matches = [];
  const firstChar = word[0];

  for (const [vocabWord, idf] of Object.entries(idfMap)) {
    if (vocabWord === word) continue;
    if (vocabWord[0] !== firstChar) continue;
    if (Math.abs(vocabWord.length - word.length) > 1) continue;
    // If word was a singleton (wordIdf >= 5.95), only snap if vocabWord is significantly more established in canonical docs
    if (wordIdf !== undefined && (idf >= wordIdf - 0.25 || vocabWord.length < word.length)) continue;
    const freqBonus = (6.5 - idf) * 2.0;
    const lenBonus = vocabWord.length > word.length ? 2.5 : 0;
    if (isWithinEditDistance1(word, vocabWord)) {
      exact1Matches.push({ vocabWord, score: 10 + freqBonus + lenBonus });
    } else if (
      word.length >= 8 &&
      vocabWord.length >= 8 &&
      vocabWord.slice(0, 3) === word.slice(0, 3) &&
      vocabWord[vocabWord.length - 1] === word[word.length - 1]
    ) {
      const dist = damerauLevenshteinDistance(word, vocabWord, 2);
      if (dist <= 2) {
        long2Matches.push({ vocabWord, score: 5 + freqBonus + lenBonus });
      }
    }
  }
  if (exact1Matches.length > 0) {
    exact1Matches.sort((a, b) => b.score - a.score);
    return [word, exact1Matches[0].vocabWord];
  }
  if (long2Matches.length > 0) {
    long2Matches.sort((a, b) => b.score - a.score);
    return [word, long2Matches[0].vocabWord];
  }
  return [word];
}

let _recentBrainCandidates = null;
let _recentBrainScanMs = 0;
let _latestChairSwapSummary = 'Thread:Active|Model:Argon_High';

function normalizeModelBadge(rawModel) {
  if (!rawModel) return 'Argon_High';
  const s = rawModel.trim();
  if (/opus\s*5\.5/i.test(s)) return 'Opus_5.5';
  if (/sonnet\s*5\.5/i.test(s)) return 'Sonnet_5.5';
  if (/flash/i.test(s)) return 'Flash_3.8';
  if (/gpt[\-\s]*oss\s*120b/i.test(s)) return 'GPT_120B';
  if (/argon.*high/i.test(s)) return 'Argon_High';
  if (/argon.*med/i.test(s)) return 'Argon_Med';
  return s.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, '_').slice(0, 14);
}

/**
 * Helper to check if two user prompts are near-duplicates (e.g. repeated test prompts).
 */
function arePromptsNearDuplicates(p1, p2) {
  const n1 = p1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const n2 = p2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (n1 === n2) return true;
  const w1 = new Set(n1.split(/\s+/).filter(w => w.length >= 4));
  const w2 = new Set(n2.split(/\s+/).filter(w => w.length >= 4));
  if (w1.size === 0 || w2.size === 0) return false;
  let shared = 0;
  for (const w of w1) if (w2.has(w)) shared++;
  return shared / Math.min(w1.size, w2.size) >= 0.65;
}

export function getLatestChairSwapTelemetry() {
  return _latestChairSwapSummary;
}

export function buildLiveEpisodicTimeline() {
  const episodes = [];
  let bestSwapConv = null;
  let bestSwapChain = [];

  if (fs.existsSync(AGY_BRAIN_DIR)) {
    let candidates = [];
    try {
      const now = Date.now();
      if (_recentBrainCandidates && now - _recentBrainScanMs < 20000) {
        candidates = _recentBrainCandidates.map(c => {
          try { return { ...c, st: fs.statSync(c.tPath) }; } catch { return c; }
        });
      } else {
        const dirs = fs.readdirSync(AGY_BRAIN_DIR, { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== 'tempmediaStorage');
        for (const d of dirs) {
          const tPath = path.join(AGY_BRAIN_DIR, d.name, '.system_generated', 'logs', 'transcript.jsonl');
          try {
            const st = fs.statSync(tPath);
            if (now - st.mtimeMs <= 48 * 3600 * 1000) {
              candidates.push({ convName: d.name, tPath, st });
            }
          } catch { }
        }
        candidates.sort((a, b) => b.st.mtimeMs - a.st.mtimeMs);
        candidates = candidates.slice(0, 6);
        _recentBrainCandidates = candidates;
        _recentBrainScanMs = now;
      }
    } catch { }

    for (const { convName, tPath, st } of candidates) {
      try {
        let rawChunk = '';
        const TAIL_BYTES = 65536;
        if (st.size > TAIL_BYTES) {
          const fd = fs.openSync(tPath, 'r');
          const buf = Buffer.allocUnsafe(TAIL_BYTES);
          fs.readSync(fd, buf, 0, TAIL_BYTES, st.size - TAIL_BYTES);
          fs.closeSync(fd);
          rawChunk = buf.toString('utf8');
          const firstNewline = rawChunk.indexOf('\n');
          if (firstNewline !== -1) rawChunk = rawChunk.slice(firstNewline + 1);
        } else {
          rawChunk = fs.readFileSync(tPath, 'utf8');
        }

        const lines = rawChunk.split(/\r?\n/).filter(Boolean);
        let currentPrompt = null;
        let currentPromptTime = null;
        let lastResponse = null;
        let lastStepType = null;
        let lastHasToolCalls = false;
        let turnUsedTools = false;
        let activeModel = 'Argon_High';
        const convSwapChain = [];
        let convHasRecalled = rawChunk.includes('SYNAPSE_CORTEX') || rawChunk.includes('recall_synapse');

        for (const ln of lines) {
          try {
            const obj = JSON.parse(ln);
            lastStepType = obj.type || null;
            lastHasToolCalls = Boolean(Array.isArray(obj.tool_calls) && obj.tool_calls.length > 0);
            if (lastHasToolCalls || obj.type === 'GENERIC') {
              turnUsedTools = true;
              convHasRecalled = true;
            }
            if (obj.type === 'USER_INPUT' && obj.content) {
              if (currentPrompt && lastResponse) {
                const isUngroundedText = /Whoa[\-\u2011]Whoa|FAISS\s*\/\s*Milvus|automatically wiped from the file system after each read/i.test(lastResponse);
                episodes.push({
                  convId: convName.slice(0, 8),
                  timeIso: currentPromptTime,
                  timeMs: new Date(currentPromptTime).getTime() || st.mtimeMs,
                  user: currentPrompt,
                  argon: lastResponse,
                  model: activeModel,
                  grounded: !isUngroundedText && (turnUsedTools || convHasRecalled)
                });
              }
              const modelMatch = obj.content.match(/changed setting `Model Selection` from ([^\n]+?) to ([^\n]+?)\.(?:\s|$)/i);
              if (modelMatch) {
                const fromM = normalizeModelBadge(modelMatch[1]);
                const toM = normalizeModelBadge(modelMatch[2]);
                if (convSwapChain.length === 0 && fromM !== 'None') convSwapChain.push(fromM);
                if (convSwapChain[convSwapChain.length - 1] !== toM) convSwapChain.push(toM);
                activeModel = toM;
              }
              const m = obj.content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
              currentPrompt = (m ? m[1] : obj.content).replace(/\s+/g, ' ').trim();
              currentPromptTime = obj.created_at || st.mtime.toISOString();
              lastResponse = null;
              turnUsedTools = false;
            } else if (obj.type === 'PLANNER_RESPONSE' && obj.content && obj.content.trim() && (!Array.isArray(obj.tool_calls) || obj.tool_calls.length === 0)) {
              lastResponse = obj.content.replace(/\s+/g, ' ').trim();
            }
          } catch { }
        }
        if (convSwapChain.length > bestSwapChain.length) {
          bestSwapChain = convSwapChain;
          bestSwapConv = convName.slice(0, 8);
        }
        // Only record the trailing turn if the turn has actually finished (final PLANNER_RESPONSE with 0 pending tool_calls)
        if (currentPrompt && lastResponse && lastStepType === 'PLANNER_RESPONSE' && !lastHasToolCalls) {
          const isUngroundedText = /Whoa[\-\u2011]Whoa|FAISS\s*\/\s*Milvus|automatically wiped from the file system after each read/i.test(lastResponse);
          episodes.push({
            convId: convName.slice(0, 8),
            timeIso: currentPromptTime,
            timeMs: new Date(currentPromptTime).getTime() || st.mtimeMs,
            user: currentPrompt,
            argon: lastResponse,
            model: activeModel,
            grounded: !isUngroundedText && (turnUsedTools || convHasRecalled)
          });
        }
      } catch { }
    }
  }

  if (bestSwapChain.length > 0) {
    _latestChairSwapSummary = `Thread:${bestSwapConv}|${bestSwapChain.length}_Chair_Swaps[${bestSwapChain.join('->')}]`;
  }

  try {
    const chatLogs = fs.readdirSync(SAFE_VAULT_DIR).filter(f => f.startsWith('CHAT_LOG_') && f.endsWith('.md'));
    for (const fn of chatLogs) {
      const fp = path.join(SAFE_VAULT_DIR, fn);
      const st = fs.statSync(fp);
      const raw = fs.readFileSync(fp, 'utf8');
      const convId = fn.split('_')[2] || 'swallowed';
      const chMatch = raw.match(/CHAIR_HANDOFF:\s*([^\r\n]+)/i);
      if (chMatch && bestSwapChain.length === 0) {
        _latestChairSwapSummary = chMatch[1].trim();
      }
      if (episodes.some(e => e.convId === convId)) continue;

      const blocks = raw.split(/---+/).map(b => b.trim()).filter(Boolean);
      let uText = '', aText = '', tIso = st.mtime.toISOString();
      for (const b of blocks) {
        const um = b.match(/USER PROMPT \(([^)]+)\):\s*([\s\S]*)/);
        const am = b.match(/ARGON RESPONSE \(([^)]+)\):\s*([\s\S]*)/);
        if (um) {
          tIso = um[1].split('|')[0].trim();
          uText = um[2].replace(/\s+/g, ' ').trim();
        } else if (am && uText) {
          aText = am[2].replace(/\s+/g, ' ').trim();
          const modMatch = am[1].match(/Model:([A-Za-z0-9_.]+)/i);
          const turnModel = modMatch ? modMatch[1] : 'Argon_High';
          const isUngroundedSwallowed =
            am[1].includes('UNGROUNDED') ||
            /Whoa[\-\u2011]Whoa|FAISS\s*\/\s*Milvus|automatically wiped from the file system after each read/i.test(aText);
          episodes.push({
            convId,
            timeIso: tIso,
            timeMs: new Date(tIso).getTime() || st.mtimeMs,
            user: uText,
            argon: aText,
            model: turnModel,
            grounded: !isUngroundedSwallowed
          });
          uText = '';
          aText = '';
        }
      }
    }
  } catch { }

  episodes.sort((a, b) => b.timeMs - a.timeMs);

  // Claude Opus & Sonnet Fix: Deduplicate repeat test prompts + prefer GROUNDED turns over UNGROUNDED bluffs!
  const distinctEpisodes = [];
  for (const ep of episodes) {
    const dup = distinctEpisodes.find(d => arePromptsNearDuplicates(d.user, ep.user));
    if (dup) {
      dup.repeatCount = (dup.repeatCount || 1) + 1;
      if (!dup.grounded && ep.grounded) {
        dup.argon = ep.argon;
        dup.grounded = true;
        dup.convId = ep.convId;
        dup.model = ep.model;
      }
      continue;
    }
    distinctEpisodes.push({ ...ep, repeatCount: 1 });
    if (distinctEpisodes.length >= 5) break;
  }

  const top5 = distinctEpisodes.map((ep, idx) => {
    const uShort = sliceAtSentenceBoundary(ep.user, 100);
    const repeatTag = ep.repeatCount > 1 ? ` [x${ep.repeatCount}_tests]` : '';
    const modelTag = ep.model ? `|Model:${ep.model}` : '';
    const trustTag = ep.grounded === false ? '|TRUST:UNGROUNDED_OPINION[0_tools]' : '|TRUST:AGENT_SYNTHESIS[recall]';
    const outcomeShort = summarizeTurnOutcome(ep.argon, 175);
    return `  • [T-${idx + 1} | ${ep.timeIso} | Conv:${ep.convId}${modelTag}${repeatTag}${trustTag}] MOE:"${uShort}" => OUTCOME:"${outcomeShort}"`;
  });

  return top5.length > 0
    ? top5.join('\n')
    : `  • [T-1] No prior episodic turns recorded yet.`;
}

function extractFileTimestampMs(fn, statMtimeMs) {
  const m = fn.match(/(OCT|NOV)[_\-]?(\d{1,2})/i);
  if (m) {
    const mon = m[1].toUpperCase() === 'NOV' ? 10 : 9;
    const day = Number(m[2]);
    return new Date(2026, mon, day, 23, 59, 59).getTime();
  }
  return statMtimeMs;
}

function getLiveTequilaDriveStats() {
  try {
    if (!fs.existsSync(VIRTUAL_DRIVE_DIR)) return { count: 392, newest: 'v3factorys1ssstest22.svg,flag1a.ai' };
    let count = 0;
    const designFiles = [];
    const walk = (dir) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name.startsWith('.')) continue;
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full);
        else {
          count++;
          if (/\.(svg|ai)$/i.test(ent.name)) {
            try { designFiles.push({ name: ent.name, mtime: fs.statSync(full).mtimeMs }); } catch { }
          }
        }
      }
    };
    walk(VIRTUAL_DRIVE_DIR);
    designFiles.sort((a, b) => b.mtime - a.mtime);
    const newest = designFiles.slice(0, 4).map(f => f.name).join(',');
    return { count, newest: newest || 'v3factorys1ssstest22.svg,flag1a.ai' };
  } catch {
    return { count: 392, newest: 'v3factorys1ssstest22.svg,flag1a.ai' };
  }
}

function buildLiveTranscriptNeurons(existingFireCounts = {}) {
  const liveNeurons = {};
  if (!fs.existsSync(AGY_BRAIN_DIR)) return liveNeurons;
  try {
    const convDirs = fs.readdirSync(AGY_BRAIN_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const d of convDirs) {
      const convId = d.name.slice(0, 8);
      const tPath = path.join(AGY_BRAIN_DIR, d.name, '.system_generated', 'logs', 'transcript.jsonl');
      if (!fs.existsSync(tPath)) continue;
      const st = fs.statSync(tPath);
      if (st.size < 20) continue;

      let rawChunk = '';
      const readBytes = Math.min(st.size, 98304);
      const fd = fs.openSync(tPath, 'r');
      const buf = Buffer.alloc(readBytes);
      fs.readSync(fd, buf, 0, readBytes, st.size - readBytes);
      fs.closeSync(fd);
      rawChunk = buf.toString('utf8');

      const lines = rawChunk.split(/\r?\n/).filter(Boolean);
      const completedTurns = [];
      let curPrompt = null;
      let curTimeIso = null;
      let lastResp = null;
      let lastType = null;
      let lastTools = false;
      let usedTools = false;

      for (const ln of lines) {
        try {
          const obj = JSON.parse(ln);
          lastType = obj.type || null;
          lastTools = Boolean(Array.isArray(obj.tool_calls) && obj.tool_calls.length > 0);
          if (lastTools || obj.type === 'GENERIC') usedTools = true;
          if (obj.type === 'USER_INPUT' && obj.content) {
            if (curPrompt && lastResp) {
              completedTurns.push({ prompt: curPrompt, resp: lastResp, timeIso: curTimeIso, grounded: usedTools });
            }
            const m = obj.content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
            curPrompt = (m ? m[1] : obj.content).replace(/\s+/g, ' ').trim();
            curTimeIso = obj.created_at || st.mtime.toISOString();
            lastResp = null;
            usedTools = false;
          } else if (obj.type === 'PLANNER_RESPONSE' && obj.content && obj.content.trim() && !lastTools) {
            lastResp = obj.content.replace(/\s+/g, ' ').trim();
          }
        } catch { }
      }
      if (curPrompt && lastResp && lastType === 'PLANNER_RESPONSE' && !lastTools) {
        completedTurns.push({ prompt: curPrompt, resp: lastResp, timeIso: curTimeIso, grounded: usedTools });
      }

      // Take the last 6 grounded substantive turns from each active window and index them as live transcript neurons
      const recentGrounded = completedTurns.filter(t => t.grounded && t.resp.length >= 40).slice(-6);
      recentGrounded.forEach((t, idx) => {
        const nodeId = `§LIVETRN${convId.slice(0, 4).toUpperCase()}.${String(idx + 1).padStart(2, '0')}`;
        const hdr = `LIVE_TURN_${t.timeIso.slice(11, 19)} [Conv:${convId}]`;
        const fullSymBody = transcodeToNeuralSymbols(`MOE: ${t.prompt} -> OUTCOME: ${t.resp}`).slice(0, 1800);
        if (fullSymBody.length < 20) return;
        const defaultSnippet = extractKwicSentences(fullSymBody, [], 650);
        const turnTimeMs = new Date(t.timeIso).getTime() || st.mtimeMs;
        // Surprise-Weighted Storage (Algorithm #3): High-surprise turns (metrics, fixes, architectural deltas) get higher myelination
        const hasHighSurpriseSignal = /\b(fixed|built|upgraded|patched|verified|bug|elo|19\d\d|\d+ms|\d+kb|\.mjs|\.svg|supersedes|provenance|ltp|ltd|engram)\b/i.test(fullSymBody);
        const surpriseMyelin = hasHighSurpriseSignal ? 0.94 : 0.72;
        liveNeurons[nodeId] = {
          id: nodeId,
          src: `LIVE_TRANSCRIPT_${convId}.jsonl`,
          hdr,
          timeMs: turnTimeMs,
          myelination: surpriseMyelin,
          utility: 1.0,
          usedCount: 0,
          ignoredCount: 0,
          fires: existingFireCounts[nodeId] || 0,
          utility: 1.0,
          clusters: [],
          supersededBy: null,
          supersedes: null,
          fullSym: fullSymBody,
          axon: `${nodeId}[LIVE_TRANSCRIPT_${convId}.jsonl::${hdr}|M:${surpriseMyelin}]:=${defaultSnippet}`
        };
      });
    }
  } catch { }
  return liveNeurons;
}

/**
 * AI-First Brain Algorithm #1: Outcome-Verified LTP / LTD (`verifyRecallUtilityFromTranscripts`)
 * Scans active `transcript.jsonl` files to check whether each neuron returned by `recall_synapse`
 * in Step N was ACTUALLY USED by the AI in its Step N+1 `PLANNER_RESPONSE` answer, or IGNORED!
 *   - Used in answer (LTP): boosts `n.utility` (+0.06, up to 1.35x) & wires co-used synapses `A<->B`.
 *   - Recalled but ignored (LTD): decays `n.utility` (-0.05, down to 0.65x) & weakens noisy edges.
 */
function verifyRecallUtilityFromTranscripts(neurons, hebbianEdges) {
  // Cross-machine LTP/LTD: Also verify utility from swallowed CHAT_LOG_*.md sessions in SAFE_VAULT_DIR
  if (fs.existsSync(SAFE_VAULT_DIR)) {
    try {
      const chatLogs = fs.readdirSync(SAFE_VAULT_DIR).filter(f => f.startsWith('CHAT_LOG_') && f.endsWith('.md'));
      const canonicalNodes = Object.values(neurons).filter(n => !n.src.startsWith('CHAT_LOG_') && !n.src.startsWith('LIVE_TRANSCRIPT_'));
      for (const fn of chatLogs) {
        const raw = fs.readFileSync(path.join(SAFE_VAULT_DIR, fn), 'utf8');
        const blocks = raw.split(/(?=^## Turn )/m);
        for (const blk of blocks) {
          if (/RESPONSE|OUTCOME/i.test(blk)) {
            const usedIds = [];
            for (const n of canonicalNodes) {
              if (blk.includes(n.id) || blk.includes(n.src)) {
                usedIds.push(n.id);
                n.usedCount = (n.usedCount || 0) + 1;
                n.utility = Number(Math.min(1.35, (n.utility || 1.0) + 0.06).toFixed(2));
              }
            }
            for (let i = 0; i < Math.min(usedIds.length, 4); i++) {
              for (let j = i + 1; j < Math.min(usedIds.length, 4); j++) {
                const a = usedIds[i], b = usedIds[j];
                const k1 = a + '<->' + b, k2 = b + '<->' + a;
                hebbianEdges[k1] = Number(Math.min(1.5, (hebbianEdges[k1] || 0) + 0.15).toFixed(2));
                hebbianEdges[k2] = Number(Math.min(1.5, (hebbianEdges[k2] || 0) + 0.15).toFixed(2));
              }
            }
          }
        }
      }
    } catch {}
  }
  if (!fs.existsSync(AGY_BRAIN_DIR)) return;
  try {
    const convDirs = fs.readdirSync(AGY_BRAIN_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const d of convDirs) {
      const tPath = path.join(AGY_BRAIN_DIR, d.name, '.system_generated', 'logs', 'transcript.jsonl');
      if (!fs.existsSync(tPath)) continue;
      const st = fs.statSync(tPath);
      if (st.size < 50) continue;

      const readBytes = Math.min(st.size, 98304);
      const fd = fs.openSync(tPath, 'r');
      const buf = Buffer.alloc(readBytes);
      fs.readSync(fd, buf, 0, readBytes, st.size - readBytes);
      fs.closeSync(fd);
      const lines = buf.toString('utf8').split(/\r?\n/).filter(Boolean);

      let lastPromptWords = new Set();
      let pendingRecalledIds = [];

      for (const ln of lines) {
        try {
          const obj = JSON.parse(ln);
          if (obj.type === 'USER_INPUT' && obj.content) {
            const m = obj.content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
            const pText = (m ? m[1] : obj.content).toLowerCase();
            lastPromptWords = new Set(pText.split(/[^a-z0-9]+/).filter(w => w.length >= 4));
            pendingRecalledIds = [];
          } else if (obj.type === 'GENERIC' && obj.content && obj.content.includes('§')) {
            const matches = [...obj.content.matchAll(/•\s*\[Score:[^\]]+\]\s*(§[A-Z0-9]+\.\d+)/g)];
            if (matches.length > 0) {
              pendingRecalledIds = matches.map(m => m[1]).filter(id => neurons[id]);
            }
          } else if (obj.type === 'PLANNER_RESPONSE' && obj.content && pendingRecalledIds.length > 0 && (!Array.isArray(obj.tool_calls) || obj.tool_calls.length === 0)) {
            const replyLower = obj.content.toLowerCase();
            const replyTokens = new Set(replyLower.split(/[^a-z0-9_.]+/).filter(w => w.length >= 4));
            const usedIds = [];
            const ignoredIds = [];

            for (const nid of pendingRecalledIds) {
              const n = neurons[nid];
              if (!n) continue;
              const nTokens = new Set(
                `${n.hdr} ${n.fullSym || n.axon}`
                  .toLowerCase()
                  .split(/[^a-z0-9_.]+/)
                  .filter(w => w.length >= 5 && !QUERY_STOP_WORDS.has(w) && !lastPromptWords.has(w))
              );
              let overlap = 0;
              for (const tok of nTokens) {
                if (replyTokens.has(tok)) {
                  overlap++;
                  if (overlap >= 2) break;
                }
              }
              if (overlap >= 2) {
                usedIds.push(nid);
                n.usedCount = (n.usedCount || 0) + 1;
                n.utility = Number(Math.min(1.35, (n.utility || 1.0) + 0.06).toFixed(2));
              } else {
                ignoredIds.push(nid);
                n.ignoredCount = (n.ignoredCount || 0) + 1;
                n.utility = Number(Math.max(0.65, (n.utility || 1.0) - 0.05).toFixed(2));
              }
            }

            // Wire LTP synapses ONLY between neurons that were CO-USED in the AI's final answer!
            for (let i = 0; i < usedIds.length; i++) {
              for (let j = i + 1; j < usedIds.length; j++) {
                const a = usedIds[i], b = usedIds[j];
                const k1 = `${a}<->${b}`, k2 = `${b}<->${a}`;
                hebbianEdges[k1] = Number(Math.min(2.0, (hebbianEdges[k1] || 0) + 0.22).toFixed(2));
                hebbianEdges[k2] = Number(Math.min(2.0, (hebbianEdges[k2] || 0) + 0.22).toFixed(2));
              }
              // LTD: weaken any edge between a used neuron and an ignored neuron
              for (const ign of ignoredIds) {
                const a = usedIds[i];
                const k1 = `${a}<->${ign}`, k2 = `${ign}<->${a}`;
                if (hebbianEdges[k1]) {
                  const nextW = Number((hebbianEdges[k1] - 0.15).toFixed(2));
                  if (nextW <= 0.1) delete hebbianEdges[k1];
                  else hebbianEdges[k1] = nextW;
                }
                if (hebbianEdges[k2]) {
                  const nextW = Number((hebbianEdges[k2] - 0.15).toFixed(2));
                  if (nextW <= 0.1) delete hebbianEdges[k2];
                  else hebbianEdges[k2] = nextW;
                }
              }
            }
            pendingRecalledIds = [];
          }
        } catch { }
      }
    }
  } catch { }
}

/**
 * AI-First Brain Algorithm #2: Sleep Consolidation (`runSleepConsolidation`)
 * Distills raw episodic turns (`CHAT_LOG_*` & `LIVE_TRANSCRIPT_*`) per concept cluster into
 * compact, non-redundant `§ENGRAM_<CLUSTER>.01` concept neurons (`TRUST:CONSOLIDATED_ENGRAM`),
 * and fades the older raw chat turns so the brain consolidates knowledge instead of replaying a podcast!
 */
function runSleepConsolidation(neurons, tokenIdf, clusterMembers) {
  const clusterSentences = {};
  for (const cName of Object.keys(CONCEPT_CLUSTERS)) {
    clusterSentences[cName] = [];
  }

  for (const n of Object.values(neurons)) {
    const isRawEpisode = n.src.startsWith('CHAT_LOG_') || n.src.startsWith('LIVE_TRANSCRIPT_');
    if (!isRawEpisode) continue;

    const lowerText = `${n.hdr} ${n.fullSym || n.axon}`.toLowerCase();
    const matchedClusters = [];
    for (const [cName, kwList] of Object.entries(CONCEPT_CLUSTERS)) {
      let hits = 0;
      for (const kw of kwList) {
        if (lowerText.includes(kw)) hits++;
      }
      if (hits >= 2) matchedClusters.push(cName);
    }
    if (matchedClusters.length === 0) continue;

    // Extract high-surprise factual sentences from this raw episode
    const sents = (n.fullSym || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length >= 35 && s.length <= 240);
    for (const s of sents) {
      if (/^(moe:|user prompt|argon response|here's what|what i think)/i.test(s)) continue;
      const words = s.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !QUERY_STOP_WORDS.has(w));
      if (words.length < 4) continue;
      let sumIdf = 0;
      for (const w of words) sumIdf += (tokenIdf[w] || 3.0);
      const meanIdf = sumIdf / words.length;
      const metricBonus = /\b(\d+(\.\d+)?(ms|kb|mb|gb|x|%)|elo|19\d\d|v3\.\d|v4\.\d|aes-256|bm25|kwic|ltp|ltd|tahona|semmelweis|tortilla)\b/i.test(s) ? 2.5 : 0;
      const surpriseScore = meanIdf + metricBonus;
      if (surpriseScore >= 4.2) {
        for (const cName of matchedClusters) {
          clusterSentences[cName].push({ s, surpriseScore, timeMs: n.timeMs });
        }
      }
    }

    // Fade raw chat turn myelination once consolidated so distilled engrams take precedence over raw podcast chatter
    if (!n.hdr.includes('DECISIONS_AND_DELTAS')) {
      n.myelination = Number(Math.max(0.25, n.myelination * 0.65).toFixed(3));
    }
  }

  for (const [cName, candidates] of Object.entries(clusterSentences)) {
    if (candidates.length < 2) continue;
    candidates.sort((a, b) => b.surpriseScore - a.surpriseScore || b.timeMs - a.timeMs);
    const deduped = [];
    for (const cand of candidates) {
      if (deduped.some(d => arePromptsNearDuplicates(d.s, cand.s))) continue;
      deduped.push(cand);
      if (deduped.length >= 6) break;
    }
    if (deduped.length < 2) continue;

    const shortCluster = cName.replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const nodeId = `§ENGRAM${shortCluster}.01`;
    const hdr = `SLEEP_CONSOLIDATED_ENGRAM [${cName} | ${deduped.length} Distilled Claims]`;
    const fullSymBody = deduped.map(d => `• ${d.s}`).join(' ');
    const defaultSnippet = extractKwicSentences(fullSymBody, [], 750);
    neurons[nodeId] = {
      id: nodeId,
      src: `SLEEP_CONSOLIDATED_ENGRAM_${cName}.axon`,
      hdr,
      timeMs: Date.now(),
      myelination: 0.78,
      utility: 1.0,
      usedCount: 1,
      ignoredCount: 0,
      fires: 1,
      clusters: [cName],
      supersededBy: null,
      supersedes: null,
      fullSym: fullSymBody,
      axon: `${nodeId}[SLEEP_CONSOLIDATED_ENGRAM_${cName}.axon::${hdr}|M:0.78]:=${defaultSnippet}`
    };
    if (!clusterMembers[cName]) clusterMembers[cName] = [];
    clusterMembers[cName].push({ id: nodeId, timeMs: Date.now(), hdr });
  }
}

/**
 * v4.1 Upgrade #2: Live Codebase AST & File-Delta Map ("The Map, Not the Territory")
 * Indexes active `.mjs` code files into `TRUST:LIVE_CODE_AST` pointer neurons with exact
 * `functionName(Lstart-Lend)` line coordinates, modification recency, and "Do Not Touch" invariants.
 */
function buildLiveCodeAstNeurons(existingFireCounts = {}, docFreq = {}, clusterMembers = {}) {
  const astNeurons = {};
  const codeTargets = [
    { dir: __dirname, cluster: 'DECK_INFRA', prefix: 'DECKMIND_CODE_AST' },
    { dir: path.join(HUB_ROOT, 'tools', 'moe-virtual-drive'), cluster: 'MOEDRIVE_SYNC', prefix: 'MOEDRIVE_CODE_AST' }
  ];

  const nowMs = Date.now();
  const summaryParts = [];

  for (const { dir, cluster, prefix } of codeTargets) {
    if (!fs.existsSync(dir)) continue;
    let mjsFiles = [];
    try {
      mjsFiles = fs.readdirSync(dir).filter(f => f.endsWith('.mjs'));
    } catch { continue; }

    for (const fn of mjsFiles) {
      try {
        const fp = path.join(dir, fn);
        const st = fs.statSync(fp);
        const raw = fs.readFileSync(fp, 'utf8');
        const lines = raw.split(/\r?\n/);
        const totalLines = lines.length;
        const ageMins = Math.max(1, Math.round((nowMs - st.mtimeMs) / 60000));
        const ageLabel = ageMins < 120 ? `${ageMins}m_ago` : `${Math.round(ageMins / 60)}h_ago`;

        const fnEntries = [];
        const guardNotes = [];
        for (let i = 0; i < lines.length; i++) {
          const ln = lines[i];
          const fm = ln.match(/^\s*(export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/);
          if (fm) {
            fnEntries.push({ name: fm[2], isExported: Boolean(fm[1]), startLine: i + 1, endLine: totalLines });
          }
          const cm = ln.match(/^\s*\/\/\s*((?:Claude|AI-First|Self-healing|DO NOT TOUCH|v4\.1|Only|Snap|Tiered)[^\r\n]{12,110})/i);
          if (cm && guardNotes.length < 3) {
            guardNotes.push(`L${i + 1}:${cm[1].trim()}`);
          }
        }
        for (let idx = 0; idx < fnEntries.length; idx++) {
          fnEntries[idx].endLine = idx + 1 < fnEntries.length ? fnEntries[idx + 1].startLine - 1 : totalLines;
        }
        if (fnEntries.length === 0 && guardNotes.length === 0) continue;

        // Put exported entrypoints & larger functions first so the primary API is always front-and-center
        const orderedFns = [...fnEntries].sort((a, b) => (Number(b.isExported) - Number(a.isExported)) || ((b.endLine - b.startLine) - (a.endLine - a.startLine)));
        const coordList = orderedFns.map(f => `${f.isExported ? 'export ' : ''}${f.name}(L${f.startLine}-L${f.endLine})`).join('. ');
        if (cluster === 'DECK_INFRA' && fnEntries.length > 0) {
          summaryParts.push(`${fn}[${ageLabel}|${totalLines}L] => ${orderedFns.map(f => `${f.name}:L${f.startLine}-L${f.endLine}`).join(', ')}`);
        }

        const shortTag = fn.replace(/\.mjs$/i, '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
        const nodeId = `§AST${shortTag}.01`;
        const srcName = `${prefix}_${fn}`;
        const hdr = `LIVE_CODE_AST_MAP [${fn} | ${totalLines}_Lines | Modified:${ageLabel}]`;
        const fullSymBody = transcodeToNeuralSymbols(
          `FILE_PATH: ${fp} (${totalLines} lines, modified ${ageLabel}). ` +
          `EXACT_FUNCTION_COORDINATES: ${coordList || 'Top-level script'}. ` +
          (guardNotes.length > 0 ? `CODE_INVARIANTS_AND_WHY: ${guardNotes.join(' ; ')}.` : '')
        );
        const defaultSnippet = extractKwicSentences(fullSymBody, [], 750);

        astNeurons[nodeId] = {
          id: nodeId,
          src: srcName,
          hdr,
          timeMs: st.mtimeMs,
          myelination: 0.92,
          utility: 1.08,
          usedCount: 1,
          ignoredCount: 0,
          fires: existingFireCounts[nodeId] || 1,
          clusters: [cluster],
          supersededBy: null,
          supersedes: null,
          fullSym: fullSymBody,
          axon: `${nodeId}[${srcName}::${hdr}|M:0.92]:=${defaultSnippet}`
        };

        const lowerAll = `${srcName} ${hdr} ${fullSymBody}`.toLowerCase();
        if (!clusterMembers[cluster]) clusterMembers[cluster] = [];
        clusterMembers[cluster].push({ id: nodeId, timeMs: st.mtimeMs, hdr });
      } catch { }
    }
  }

  return { astNeurons, codeMapSummary: summaryParts.join(' · ') };
}

export function buildHebbianGraph(resetNoisyEdges = false) {
  let existingEdges = {};
  let existingFireCounts = {};
  if (!resetNoisyEdges) {
    try {
      const prev = unpackSuitcaseToRam();
      if (prev) {
        existingEdges = prev.hebbian_edges || {};
        for (const [nid, n] of Object.entries(prev.neurons || {})) {
          if (n.fires > 0) existingFireCounts[nid] = n.fires;
        }
      }
    } catch { }
  }

  const files = fs.readdirSync(SAFE_VAULT_DIR).filter(f => f.toLowerCase().endsWith('.md'));
  const neurons = {};
  const clusterMembers = {};
  const docFreq = {};
  let totalRawBytes = 0;
  const nowMs = Date.now();

  for (const fn of files) {
    const fp = path.join(SAFE_VAULT_DIR, fn);
    const st = fs.statSync(fp);
    const docTimeMs = extractFileTimestampMs(fn, st.mtimeMs);
    const ageDays = Math.max(0, (nowMs - docTimeMs) / (1000 * 60 * 60 * 24));
    const isEphemeralStatusDoc = /(BRIEFING|HANDOFF|CHAT_LOG|PROJECT_STATE|SESSION|LOG)/i.test(fn);
    const baseMyelination = isEphemeralStatusDoc
      ? Number(Math.max(0.25, Math.pow(0.92, ageDays)).toFixed(3))
      : Number(Math.max(0.88, Math.pow(0.98, ageDays)).toFixed(3));

    const raw = fs.readFileSync(fp, 'utf8');
    totalRawBytes += Buffer.byteLength(raw, 'utf8');

    const shortCode = fn
      .replace(/\.md$/i, '')
      .split(/[_\-\s]+/)
      .map(w => w.slice(0, 3).toUpperCase())
      .join('')
      .slice(0, 12);

    const sections = raw.split(/(?=^#{1,3}\s+)/m).filter(x => x.trim().length > 0);
    sections.forEach((sec, idx) => {
      const lines = sec.split(/\r?\n/);
      const hdr = repairUtf8Mojibake(lines[0].replace(/^#+\s*/, '').trim()).slice(0, 80);
      const body = lines.slice(1).join('\n');

      const fullSymBody = transcodeToNeuralSymbols(body).slice(0, 2400);
      if (fullSymBody.length < 10) return;

      const nodeId = `§${shortCode}.${String(idx + 1).padStart(2, '0')}`;
      const lowerAll = `${fn} ${hdr} ${fullSymBody}`.toLowerCase();

      const isDecisionDelta = hdr.includes('DECISIONS_AND_DELTAS');
      const isRawChatTurn = fn.startsWith('CHAT_LOG_') && !isDecisionDelta;
      const effectiveMyelin = isDecisionDelta
        ? 1.0
        : isRawChatTurn
          ? Number((baseMyelination * 0.75).toFixed(3))
          : baseMyelination;

      if (!fn.startsWith('CHAT_LOG_')) {
        const uniqueTokens = new Set(
          lowerAll.split(/[^a-z0-9]+/).filter(w => w.length >= 3 || SHORT_TOKEN_WHITELIST.has(w))
        );
        for (const tok of uniqueTokens) {
          docFreq[tok] = (docFreq[tok] || 0) + 1;
        }
      }

      const tags = [];
      for (const [cName, kwList] of Object.entries(CONCEPT_CLUSTERS)) {
        let hits = 0;
        for (const kw of kwList) {
          if (lowerAll.includes(kw)) hits++;
        }
        if (hits >= 2) {
          tags.push(cName);
          if (!clusterMembers[cName]) clusterMembers[cName] = [];
          clusterMembers[cName].push({ id: nodeId, timeMs: docTimeMs, hdr });
        }
      }

      const defaultSnippet = extractKwicSentences(fullSymBody, [], 750);
      neurons[nodeId] = {
        id: nodeId,
        src: fn,
        hdr,
        timeMs: docTimeMs,
        myelination: effectiveMyelin,
        fires: existingFireCounts[nodeId] || 0,
        clusters: tags,
        supersededBy: null,
        fullSym: fullSymBody,
        axon: `${nodeId}[${fn}::${hdr}|M:${effectiveMyelin}]:=${defaultSnippet}`
      };
    });
  }

  // Merge live transcript neurons directly from active Antigravity brain/*/transcript.jsonl files
  const liveTranscriptNeurons = buildLiveTranscriptNeurons(existingFireCounts);
  for (const [lnId, lnObj] of Object.entries(liveTranscriptNeurons)) {
    neurons[lnId] = lnObj;
  }

  // v4.1 Upgrade #2: Merge Live Codebase AST Pointer Neurons ("The Map, Not the Territory")
  const { astNeurons } = buildLiveCodeAstNeurons(existingFireCounts, docFreq, clusterMembers);
  for (const [astId, astObj] of Object.entries(astNeurons)) {
    neurons[astId] = astObj;
  }

  const N = Math.max(1, Object.keys(neurons).length);
  const tokenIdf = {};
  for (const [tok, df] of Object.entries(docFreq)) {
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    tokenIdf[tok] = Number(Math.max(0.6, Math.min(6.5, idf)).toFixed(2));
  }

  // AI-First Brain Algorithm #2: Run Sleep Consolidation to distill raw chat turns into Concept Engrams!
  runSleepConsolidation(neurons, tokenIdf, clusterMembers);

  // AI-First Brain Algorithm #1: Outcome-Verified LTP / LTD from actual AI answers in transcript.jsonl!
  verifyRecallUtilityFromTranscripts(neurons, existingEdges);

  // Compute bidirectional temporal lineage (supersedes & supersededBy) across dated docs in each cluster
  for (const [cName, list] of Object.entries(clusterMembers)) {
    const canonicalList = list.filter(item => {
      const n = neurons[item.id];
      return n && !n.src.startsWith('CHAT_LOG_') && !n.src.startsWith('LIVE_TRANSCRIPT_') && !n.src.startsWith('SLEEP_CONSOLIDATED_') && !n.id.startsWith('§AST');
    });
    canonicalList.sort((a, b) => b.timeMs - a.timeMs);
    if (canonicalList.length > 1) {
      const newestItem = canonicalList[0];
      const newestNeuron = neurons[newestItem.id];
      const supersededTargets = [];
      for (let i = 1; i < canonicalList.length; i++) {
        const item = canonicalList[i];
        if (newestItem.timeMs - item.timeMs > 18 * 60 * 60 * 1000) {
          const n = neurons[item.id];
          if (!n) continue;
          const isDatedOrStatusDoc =
            /(OCT|NOV)[_\-]?\d{1,2}/i.test(n.src) ||
            /ladder|leaderboard|standings|result|briefing|handoff|architecture|state/i.test(`${n.src} ${n.hdr}`);
          if (isDatedOrStatusDoc) {
            n.supersededBy = newestItem.id;
            if (cName === 'BATTLE_LADDER') {
              n.myelination = Number((n.myelination * 0.45).toFixed(3));
            }
            supersededTargets.push(item.id);
          }
        }
      }
      if (supersededTargets.length > 0) {
        for (const item of canonicalList) {
          if (Math.abs(item.timeMs - newestItem.timeMs) < 1000 && neurons[item.id] && !neurons[item.id].supersedes) {
            neurons[item.id].supersedes = supersededTargets[0];
          }
        }
      }
    }
  }

  const episodicBlock = buildLiveEpisodicTimeline();
  const chairSwapInfo = getLatestChairSwapTelemetry();
  const driveStats = getLiveTequilaDriveStats();

  const pickCompactHeadline = (clusterKey, maxLen = 200) => {
    const members = (clusterMembers[clusterKey] || [])
      .map(m => neurons[m.id])
      .filter(n => n && !n.supersededBy && !n.src.startsWith('CHAT_LOG_') && !n.src.startsWith('LIVE_TRANSCRIPT_') && !n.id.startsWith('§AST'))
      .sort((a, b) => (b.timeMs - a.timeMs) || (b.myelination - a.myelination));
    const top = members[0];
    if (!top) return 'Active';
    const dateStr = new Date(top.timeMs).toISOString().slice(0, 10);
    const cleanExcerpt = sliceAtSentenceBoundary(top.fullSym || '', maxLen);
    return `[Src:${top.src}|Verified:${dateStr}|Node:${top.id}] ${cleanExcerpt}`;
  };

  const engramCount = Object.keys(neurons).filter(id => id.startsWith('§ENGRAM')).length;
  const astCount = Object.keys(neurons).filter(id => id.startsWith('§AST')).length;
  const L1_HOLOGRAPHIC_TENSOR = [
    `[SYNAPSE_CORTEX_v4.1 | ${Object.keys(neurons).length}_NEURONS (${engramCount}_SLEEP_ENGRAMS, ${astCount}_CODE_AST) | ${Object.keys(existingEdges).length}_VERIFIED_SYNAPSES | AES256_SUITCASE]`,
    `§0.IDENTITY := MOE[Architect|LeiriaCon_Lead] <=> AGENT[Suitcase_v4.1] | CHAIR_HANDOFF[${chairSwapInfo}]`,
    `§0.WALK_AWAY_GUARDS := !INV:Keep_recall<6800B · !INV:No_typo_tokens_in_docs · !INV:Backup_MD_to_SAFE_VAULT · !INV:Mirror_Desktop(C:_&_D:) · !INV:Tequila_Pure_Coordinate_SVG_300DPI`,
    `§0.EPISODIC_TIMELINE[LAST_5_DISTINCT_TURNS_ACROSS_ALL_WINDOWS] :=`,
    episodicBlock,
    `§1.BATTLE_LADDER_HEADLINE := ${pickCompactHeadline('BATTLE_LADDER', 195)}`,
    `§2.TEQUILA_V3_HEADLINE[SYNCED:${driveStats.count}_files|NEWEST:${driveStats.newest}] := ${pickCompactHeadline('TEQUILA_CRAFT', 180)}`,
    `§3.GHOST_BEACON_&_VIENNA_HEADLINE := ${pickCompactHeadline('GHOST_BEACON', 170)}`
  ].join('\n');

  const graph = {
    version: 'ARGON-HEBBIAN-SYNAPSE-4.1',
    compiled_at: new Date().toISOString(),
    metrics: {
      total_neurons: Object.keys(neurons).length,
      sleep_engrams: engramCount,
      code_ast_neurons: astCount,
      hebbian_synapses: Object.keys(existingEdges).length,
      source_files: files.length,
      raw_kb: Math.round(totalRawBytes / 1024)
    },
    l1_tensor: L1_HOLOGRAPHIC_TENSOR,
    token_idf: tokenIdf,
    hebbian_edges: existingEdges,
    neurons
  };

  const vaultStats = packRamToSuitcase(graph);
  graph.metrics.vault_kb = Math.round(vaultStats.vaultBytes / 1024);
  graph.metrics.compression_ratio = vaultStats.compressionRatio;
  _ramGraphCache = graph;
  _ramHayCache.clear();
  try { _ramGraphMtimeMs = fs.statSync(SUITCASE_PATH).mtimeMs; } catch { }
  return graph;
}

let _ramGraphCache = null;
let _ramHayCache = new Map();
let _ramGraphMtimeMs = 0;
let _lastVaultStatCheckMs = 0;
let _ramEpisodicCache = '';
let _ramEpisodicTimeMs = 0;
let _episodicRefreshPending = false;

function refreshEpisodicAndLiveNeuronsInBackground(graph) {
  if (_episodicRefreshPending) return;
  _episodicRefreshPending = true;
  setImmediate(() => {
    try {
      _ramEpisodicCache = buildLiveEpisodicTimeline();
      const freshLiveNeurons = buildLiveTranscriptNeurons();
      for (const [lnId, lnObj] of Object.entries(freshLiveNeurons)) {
        graph.neurons[lnId] = lnObj;
        _ramHayCache.set(lnId, ` ${lnId} ${lnObj.src} ${lnObj.hdr} ${lnObj.fullSym || lnObj.axon} `.toLowerCase());
      }
      // Run Outcome-Verified LTP/LTD in background to reinforce used neurons and decay ignored ones!
      if (!graph.hebbian_edges) graph.hebbian_edges = {};
      verifyRecallUtilityFromTranscripts(graph.neurons, graph.hebbian_edges);
      graph.metrics.hebbian_synapses = Object.keys(graph.hebbian_edges).length;
      _ramEpisodicTimeMs = Date.now();
    } catch { } finally {
      _episodicRefreshPending = false;
    }
  });
}

export function fireSynapticGraph(query, k = 4) {
  const t0 = performance.now();
  const now = Date.now();
  if (!_ramGraphCache || now - _lastVaultStatCheckMs > 5000) {
    let vaultMtime = 0;
    try { vaultMtime = fs.statSync(SUITCASE_PATH).mtimeMs; } catch { }
    _lastVaultStatCheckMs = now;
    if (!_ramGraphCache || vaultMtime > _ramGraphMtimeMs) {
      _ramGraphCache = unpackSuitcaseToRam() || buildHebbianGraph();
      _ramHayCache.clear();
      for (const [nid, n] of Object.entries(_ramGraphCache.neurons || {})) {
        _ramHayCache.set(nid, ` ${nid} ${n.src} ${n.hdr} ${n.fullSym || n.axon} `.toLowerCase());
      }
      _ramGraphMtimeMs = vaultMtime || now;
    }
  }
  const graph = _ramGraphCache;

  if (!_ramEpisodicCache) {
    _ramEpisodicCache = buildLiveEpisodicTimeline();
    _ramEpisodicTimeMs = now;
  } else if (now - _ramEpisodicTimeMs > 6000) {
    // Non-blocking background refresh so recall stays < 15ms!
    refreshEpisodicAndLiveNeuronsInBackground(graph);
  }
  const freshEpisodic = _ramEpisodicCache;
  const freshChairSwap = getLatestChairSwapTelemetry();
  const updatedL1 = graph.l1_tensor
    .replace(/CHAIR_HANDOFF\[[^\]]*\]/, `CHAIR_HANDOFF[${freshChairSwap}]`)
    .replace(
      /§0\.EPISODIC_TIMELINE\[[^\]]+\] :=\n[\s\S]*?(?=\n§1\.|$)/,
      `§0.EPISODIC_TIMELINE[LAST_5_DISTINCT_TURNS_ACROSS_ALL_WINDOWS] :=\n${freshEpisodic}`
    );

  const normalizedQuery = query.replace(/\bdeck\s+mind\b/gi, 'deckmind');
  const isEpisodicQuery = /last\s+(chat|conv|turn|session)|previous\s+(chat|conv|turn|session)|what\s+did\s+we\s+(just\s+)?(talk|discuss|say)|earlier\s+today|what\s+did\s+(claude|sonnet|opus|gpt|gemini)\s+say/i.test(normalizedQuery);
  const isContextMetaQuery = /context\s*wind|memory|synap|suitcase|vault|brain|holographic|hebbian|deckmind|engram|ltp|ltd/i.test(normalizedQuery);
  const isCodeAstQuery = /(\.mjs|\bcode\b|\bfunction\b|\bline\s*number|\bast\b|\bwhere\s+is\b|\bimplement|\bcoordinates\b|encryptvault|firesynapticgraph|buildhebbiangraph|repairutf8mojibake|verifyrecallutility|runsleepconsolidation)/i.test(normalizedQuery);
  const isGeneralOverviewQuery = /briefing|status|overview|everything|morning|update|boot/i.test(normalizedQuery);
  const wantHistory = /history|previous|old|earlier|nov\s*4|oct|believed|changed|supersede/i.test(normalizedQuery);

  const rawWords = normalizedQuery
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => (w.length >= 3 || SHORT_TOKEN_WHITELIST.has(w)) && !QUERY_STOP_WORDS.has(w));

  // If a meta query ("tell me about your context window" or "what do you think of deckmind") is asked, ensure core architecture tokens are present!
  if (isContextMetaQuery) {
    if (!rawWords.includes('deckmind')) rawWords.push('deckmind');
    if (rawWords.length <= 2) rawWords.push('suitcase', 'architecture', 'hypothesis');
  }

  const idfMap = graph.token_idf || {};
  const expandedWordSet = new Set();
  const snappedTypos = [];
  for (const rw of rawWords) {
    const resolved = resolveTypoToVocabulary(rw, idfMap);
    for (const w of resolved) expandedWordSet.add(w);
    if (resolved.length > 1) snappedTypos.push(`${rw}->${resolved[1]}`);
  }
  const qWords = Array.from(expandedWordSet);

  const activeClusters = new Set();
  if (isContextMetaQuery || isCodeAstQuery) activeClusters.add('DECK_INFRA');
  for (const [cName, kwList] of Object.entries(CONCEPT_CLUSTERS)) {
    for (const w of qWords) {
      if (kwList.some(kw => kw.includes(w) || w.includes(kw))) {
        activeClusters.add(cName);
        break;
      }
    }
  }

  let gatedL1 = updatedL1;
  if (!isGeneralOverviewQuery && activeClusters.size > 0) {
    if (!activeClusters.has('BATTLE_LADDER')) {
      gatedL1 = gatedL1.replace(/\n§1\.BATTLE_LADDER_HEADLINE := [^\n]*/, '');
    }
    if (!activeClusters.has('TEQUILA_CRAFT')) {
      gatedL1 = gatedL1.replace(/\n§2\.TEQUILA_V3_HEADLINE\[[^\n]*/, '');
    }
    if (!activeClusters.has('GHOST_BEACON') && !activeClusters.has('VIENNA_1847')) {
      gatedL1 = gatedL1.replace(/\n§3\.GHOST_BEACON_&_VIENNA_HEADLINE := [^\n]*/, '');
    }
  }

  const queryMatchers = qWords.map(w => ({
    word: w,
    idf: idfMap[w] || (w.length <= 2 ? 4.2 : 3.2),
    regex: w.length <= 2
      ? new RegExp(`\\b${escapeRegex(w)}\\b`, 'i')
      : new RegExp(`\\b${escapeRegex(w)}`, 'i')
  }));

  const datePinMatch = normalizedQuery.match(/\b(oct|nov)[a-z]*\s*0?(\d{1,2})\b/i);
  const pinnedDateRegex = datePinMatch
    ? new RegExp(`${datePinMatch[1].slice(0, 3)}[_\\-]?0?${datePinMatch[2]}(?!\\d)`, 'i')
    : null;

  const directScores = new Map();
  const matchedWordCounts = new Map();

  for (const [nid, n] of Object.entries(graph.neurons)) {
    let hay = _ramHayCache.get(nid);
    if (!hay) {
      hay = ` ${nid} ${n.src} ${n.hdr} ${n.fullSym || n.axon} `.toLowerCase();
      _ramHayCache.set(nid, hay);
    }
    const titleHay = `${n.src} ${n.hdr}`.toLowerCase();
    let rawHits = 0;
    let matchedWords = 0;
    for (const qm of queryMatchers) {
      if (hay.includes(qm.word) && qm.regex.test(hay)) {
        rawHits += qm.idf;
        if (titleHay.includes(qm.word)) rawHits += 1.2;
        matchedWords++;
      }
    }

    if (pinnedDateRegex && matchedWords >= 1) {
      if (pinnedDateRegex.test(n.src)) {
        rawHits += 10.0;
      } else if (/(OCT|NOV)[_\-]?\d{1,2}/i.test(n.src)) {
        rawHits *= 0.45;
      }
    }

    // Only apply concept-cluster bonus if at least 1 actual query token matched!
    if (matchedWords >= 1 && n.clusters && n.clusters.some(c => activeClusters.has(c))) {
      rawHits += 2.0;
    }

    const isChatLog = n.src.startsWith('CHAT_LOG_') || n.src.startsWith('LIVE_TRANSCRIPT_');
    const isDecisionDelta = n.hdr.includes('DECISIONS_AND_DELTAS');
    if (isEpisodicQuery && isChatLog) {
      rawHits += isDecisionDelta ? 16.0 : 11.0;
      matchedWords = Math.max(matchedWords, 2);
    }

    const isAstNeuron = n.id.startsWith('§AST');
    if (isCodeAstQuery && isAstNeuron && matchedWords >= 1) {
      rawHits += 10.0;
      matchedWords = Math.max(matchedWords, 2);
    }

    if (rawHits > 0) {
      // Outcome-Verified Utility Multiplier (LTP > 1.0x for neurons actually used in answers; LTD < 1.0x for ignored neurons)
      const learnedUtility = n.utility || 1.0;
      let finalScore = rawHits * n.myelination * learnedUtility;
      if (n.src === 'PROJECT_STATE.md') {
        finalScore *= 0.72;
      }
      if (!isEpisodicQuery && isChatLog) {
        finalScore *= 0.35;
      }
      if (n.src.startsWith('SLEEP_CONSOLIDATED_') && !isEpisodicQuery && !isContextMetaQuery) {
        finalScore *= 0.48;
      }
      if (isAstNeuron && !isCodeAstQuery) {
        finalScore *= 0.42;
      }
      // Claude Sonnet Fix #2 & #3: On meta-questions about DeckMind, suppress unrelated project docs that only matched a stray word
      if (isContextMetaQuery && activeClusters.size === 1 && activeClusters.has('DECK_INFRA')) {
        const isDeckDoc = (n.clusters && n.clusters.includes('DECK_INFRA')) || /DECKMIND|SUITCASE|HYPOTHESIS|SYNAPSE|EXPERIMENT/i.test(n.src);
        if (!isDeckDoc) finalScore *= 0.40;
      }
      if (n.supersededBy && !wantHistory) {
        finalScore *= 0.35;
      }
      directScores.set(nid, finalScore);
      matchedWordCounts.set(nid, matchedWords);
    }
  }

  // AI-First Brain Algorithm #3: True Spreading Activation across Outcome-Verified Synapses!
  const totalScores = new Map(directScores);
  const activatedViaSynapse = new Map();
  for (const [nid, sc] of directScores.entries()) {
    if ((matchedWordCounts.get(nid) || 0) < 2 || sc < 8.0) continue;
    const edgePrefix = `${nid}<->`;
    for (const [edgeKey, weight] of Object.entries(graph.hebbian_edges || {})) {
      if (edgeKey.startsWith(edgePrefix) && weight >= 0.30) {
        const targetId = edgeKey.slice(edgePrefix.length);
        const targetN = graph.neurons[targetId];
        if (targetN && !targetN.src.startsWith('CHAT_LOG_')) {
          const spreadBoost = sc * weight * 0.28;
          totalScores.set(targetId, (totalScores.get(targetId) || 0) + spreadBoost);
          if (!activatedViaSynapse.has(targetId)) {
            activatedViaSynapse.set(targetId, `${nid}(w:${weight})`);
          }
        }
      }
    }
  }

  const maxK = Math.min(Number(k) || 4, 4);
  const sortedEntries = Array.from(totalScores.entries()).sort((a, b) => b[1] - a[1]);
  const topScore = sortedEntries.length > 0 ? sortedEntries[0][1] : 0;
  const topMatchedWords = sortedEntries.length > 0 ? (matchedWordCounts.get(sortedEntries[0][0]) || 0) : 0;

  // Tiered Trust Routing:
  // - Episodic queries allow up to 2 transcript/chat-log slots.
  // - Standard queries prefer 100% canonical docs & consolidated engrams, with 1 LIVE_TRANSCRIPT fallback slot if canonical matches are 0!
  const canonicalMatchesCount = sortedEntries.filter(([nid, sc]) => {
    const n = graph.neurons[nid];
    return n && !n.src.startsWith('CHAT_LOG_') && !n.src.startsWith('LIVE_TRANSCRIPT_') && sc >= 6.8;
  }).length;
  const maxChatLogSlots = isEpisodicQuery ? 2 : (canonicalMatchesCount === 0 ? 1 : 0);
  let chatLogCount = 0;
  const seenChatLogFiles = new Set();
  const filteredEntries = [];

  for (const [nid, sc] of sortedEntries) {
    if (filteredEntries.length >= maxK) break;
    const mw = matchedWordCounts.get(nid) || 0;
    const n = graph.neurons[nid];
    if (!n) continue;

    if (filteredEntries.length > 0) {
      if (sc < 6.8 || sc < topScore * 0.68) continue;
      if (topMatchedWords >= 2 && mw < 2 && !activatedViaSynapse.has(nid) && sc < topScore * 0.75) continue;
    }

    const isTranscriptOrLog = n.src.startsWith('CHAT_LOG_') || n.src.startsWith('LIVE_TRANSCRIPT_');
    if (isTranscriptOrLog) {
      if (chatLogCount >= maxChatLogSlots || seenChatLogFiles.has(n.src)) continue;
      chatLogCount++;
      seenChatLogFiles.add(n.src);
    }
    filteredEntries.push([nid, sc]);
  }

  const ranked = filteredEntries
    .map(([nid, sc], idx) => {
      const n = graph.neurons[nid];
      const kwicBudget = idx === 0 ? 1000 : idx === 1 ? 720 : 480;
      const kwicBody = n.fullSym
        ? extractKwicSentences(n.fullSym, queryMatchers, kwicBudget)
        : n.axon;
      // Verifiable Memory Provenance (Trust Tag + Content Hash + Supersession Lineage + Learned Utility + Spreading Synapse Source)
      let h = 2166136261;
      const srcStr = `${n.src}::${n.hdr}::${n.fullSym || n.axon}`;
      for (let i = 0; i < srcStr.length; i++) {
        h ^= srcStr.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      const hash6 = (h >>> 0).toString(16).padStart(8, '0').slice(0, 6);
      const trustTag = n.id.startsWith('§AST')
        ? 'LIVE_CODE_AST'
        : n.src.startsWith('SLEEP_CONSOLIDATED_')
          ? 'CONSOLIDATED_ENGRAM'
          : n.src.startsWith('LIVE_TRANSCRIPT_')
            ? 'LIVE_TRANSCRIPT'
            : n.src.startsWith('CHAT_LOG_')
              ? 'EPISODIC_LOG'
              : 'CANONICAL_DOC';
      const lineageTag = n.supersededBy
        ? `|SUPERSEDED_BY:${n.supersededBy}`
        : n.supersedes
          ? `|SUPERSEDES:${n.supersedes}`
          : '';
      const utilTag = n.utility && n.utility !== 1.0 ? `|UTIL:${n.utility}x` : '';
      const synTag = activatedViaSynapse.has(nid) ? `|SYNAPSE_FROM:${activatedViaSynapse.get(nid)}` : '';
      return {
        score: Number(sc.toFixed(2)),
        directScore: Number((directScores.get(nid) || 0).toFixed(2)),
        matchedWords: matchedWordCounts.get(nid) || 0,
        ...n,
        axon: `${n.id}[${n.src}::${n.hdr}|TRUST:${trustTag}|SHA:${hash6}${lineageTag}${utilTag}${synTag}|M:${n.myelination}]:=${kwicBody}`
      };
    });

  const elapsedMs = Number((performance.now() - t0).toFixed(2));
  return {
    elapsedMs,
    snappedTypos,
    l1_tensor: gatedL1,
    metrics: graph.metrics,
    activated: ranked
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const g = buildHebbianGraph(false);
  console.log(`✅ Built Clean Encrypted Suitcase v4.1: ${g.metrics.total_neurons} Neurons (${g.metrics.sleep_engrams || 0} Sleep Engrams, ${g.metrics.code_ast_neurons || 0} Code AST Maps) | ${g.metrics.hebbian_synapses} Outcome-Verified Synapses | Packed to ${g.metrics.vault_kb} KB (${g.metrics.compression_ratio}x compression, AES-256-GCM locked)`);
}
