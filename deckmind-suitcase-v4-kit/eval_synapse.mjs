#!/usr/bin/env node
/**
 * ============================================================================
 * 🧪 DECKMIND SYNAPSE v3.7 AUTOMATED RECALL EVAL BENCHMARK (15 TESTS)
 * ============================================================================
 * Replays 15 ground-truth queries against `fireSynapticGraph` to verify:
 *   1. Exact & 1-Edit Typo-Snap accuracy (totilla, tequlia, semelwies, bazokabot, picaso)
 *   2. Zero false-positive typo snaps on common English words (opinion != option)
 *   3. Gap-cutoff & absolute relevance floor (drops unrelated noise neurons)
 *   4. Meta-question routing to DECK_INFRA architecture specs
 *   5. Grounded vs. Ungrounded trust badges in §0.EPISODIC_TIMELINE
 *   6. Verifiable neuron provenance (TRUST:CANONICAL_DOC|SHA:xxxxxx) & SUPERSEDES lineage
 *   7. Strict < 6,800-byte inline payload ceiling & zero UTF-8 mojibake
 */

import { fireSynapticGraph } from './synaptic_engine.mjs';

const BENCHMARK_CASES = [
  {
    name: '1. Typo-Snap: totilla -> tortilla (Corporate Tortilla Prophecy)',
    query: 'what is the totilla refrenceing in the context of my writings',
    check: (res) =>
      res.snappedTypos.includes('totilla->tortilla') &&
      res.activated.length >= 1 &&
      res.activated.every(n => n.src.includes('THE_CALLING_CARD_OF_THE_AMATEUR')) &&
      res.activated.some(n => n.axon.includes('tortilla'))
  },
  {
    name: '2. Typo-Snap: tequlia -> tequila (Fortaleza / Design Bible)',
    query: 'tequlia act ii corporate buyout',
    check: (res) =>
      res.snappedTypos.includes('tequlia->tequila') &&
      res.activated.some(n => n.src.includes('TEQUILA'))
  },
  {
    name: '3. Typo-Snap: semelwies -> semmelweis (Vienna 1847)',
    query: 'semelwies vienna 1847 clinic',
    check: (res) =>
      res.snappedTypos.includes('semelwies->semmelweis') &&
      res.activated.some(n => /vienna|semmelweis/i.test(n.axon))
  },
  {
    name: '4. Typo-Snap: bazokabot -> bazookabot (Battle.Training)',
    query: 'bazokabot faustus draw battle',
    check: (res) =>
      res.snappedTypos.includes('bazokabot->bazookabot') &&
      res.activated.some(n => /bazookabot/i.test(n.axon))
  },
  {
    name: '5. Typo-Snap: picaso -> picasso (Picasso Curve)',
    query: 'picaso curve amateur calling card',
    check: (res) =>
      res.snappedTypos.includes('picaso->picasso') &&
      res.activated.some(n => n.src.includes('THE_CALLING_CARD_OF_THE_AMATEUR'))
  },
  {
    name: '6. False-Positive Typo Guard: "honest opinion" must NOT snap opinion->option',
    query: 'what is your honest opinion of this memory system',
    check: (res) =>
      !res.snappedTypos.some(s => s.startsWith('opinion->')) &&
      res.activated.some(n => /DECKMIND|HYPOTHESIS/i.test(n.src))
  },
  {
    name: '7. Meta-Query Routing: "deck mind" routes to DeckMind specs/engrams with 0 Battle/Tequila noise',
    query: 'what do you think of the deck mind how does it work',
    check: (res) =>
      res.activated.length >= 1 &&
      res.activated.every(n => /DECKMIND|HYPOTHESIS|STEAM_DECK|ENGRAM_DECK_INFRA/i.test(n.src))
  },
  {
    name: '8. Episodic Timeline Trust Tagging: §0 contains TRUST:AGENT_SYNTHESIS[recall] & strips closing questions',
    query: 'what did claude sonnet say in our last chat',
    check: (res) =>
      res.l1_tensor.includes('TRUST:AGENT_SYNTHESIS[recall]') &&
      res.l1_tensor.includes('§0.EPISODIC_TIMELINE') &&
      !res.l1_tensor.includes('Which would you like?') &&
      !res.l1_tensor.includes('Reading it could change my view')
  },
  {
    name: '9. Verifiable Neuron Provenance: Every neuron carries TRUST: and SHA: hash',
    query: 'deckmind suitcase encryption aes-256-gcm',
    check: (res) =>
      res.activated.length >= 1 &&
      res.activated.every(n => /\|TRUST:(CANONICAL_DOC|CONSOLIDATED_ENGRAM|LIVE_TRANSCRIPT|EPISODIC_LOG|LIVE_CODE_AST)\|SHA:[0-9a-f]{6}/.test(n.axon))
  },
  {
    name: '10. Temporal Supersession Lineage: Morning Briefing Nov 06 carries SUPERSEDES tag',
    query: 'morning briefing battle ladder ghost-beacon 1908',
    check: (res) =>
      res.activated.some(n => n.src.includes('MORNING_BRIEFING_NOV06') && n.axon.includes('|SUPERSEDES:'))
  },
  {
    name: '11. Historical Query Support: Asking about Nov 4 surfaces Nov 4 handoff',
    query: 'what did we believe on nov 4 steam deck agent os handoff',
    check: (res) =>
      res.activated.some(n => n.src.includes('NOV4'))
  },
  {
    name: '12. Query-Gated L1 Headlines: Tortilla essay query strips unrelated §1/§2 Battle & Tequila L1 lines',
    query: 'corporate tortilla prophecy madison avenue',
    check: (res) =>
      !res.l1_tensor.includes('§1.BATTLE_LADDER_HEADLINE') &&
      !res.l1_tensor.includes('§2.TEQUILA_V3_HEADLINE')
  },
  {
    name: '13. Identifier Preservation: Preserves dots and underscores (battle.training, mind.vault)',
    query: 'mind.vault suitcase_vault.mjs',
    check: (res) =>
      res.activated.some(n => n.axon.includes('mind.vault') || n.axon.includes('suitcase_vault.mjs'))
  },
  {
    name: '14. UTF-8 Cleanliness: Zero CP1252 Mojibake sequences (â€”, ðŸ) in L1 or activated neurons',
    query: 'morning briefing overview status',
    check: (res) => {
      const payload = res.l1_tensor + '\n' + res.activated.map(n => n.axon).join('\n');
      return !/â€”|â€“|ðŸ|Ã¢/.test(payload);
    }
  },
  {
    name: '15. Inline Payload Budget Ceiling: Full formatted payload strictly < 6,800 bytes',
    query: 'overview briefing battle training tequila ghost beacon vienna deckmind',
    check: (res) => {
      const lines = res.activated.map(r => `  • [Score:${r.score}] ${r.axon}`).join('\n');
      const full = `${res.l1_tensor}\n\n${lines}\n[END_SYNAPSE_PAYLOAD]`;
      return Buffer.byteLength(full, 'utf8') < 6800;
    }
  },
  {
    name: '16. AI-First Brain Algorithm #2 (Sleep Consolidation): Compiles SLEEP_ENGRAMS from raw turns',
    query: 'sleep consolidation engram ltp ltd',
    check: (res) =>
      res.metrics.sleep_engrams >= 1 &&
      res.l1_tensor.includes('SLEEP_ENGRAMS')
  },
  {
    name: '17. AI-First Brain Algorithm #1 (Outcome-Verified LTP/LTD): Tracks UTIL multiplier on used neurons',
    query: 'deckmind suitcase architecture recall_synapse',
    check: (res) =>
      res.activated.some(n => (n.utility && n.utility !== 1.0) || n.axon.includes('|UTIL:'))
  },
  {
    name: '18. v4.1 Cross-Model Chair-Swap Telemetry: Emits CHAIR_HANDOFF chain & per-turn Model: tags',
    query: 'what did claude opus and gemini argon say',
    check: (res) =>
      res.l1_tensor.includes('CHAIR_HANDOFF[') &&
      res.l1_tensor.includes('|Model:')
  },
  {
    name: '19. v4.1 Live Codebase AST Map ("The Map, Not the Territory"): Returns exact function(Lstart-Lend) coordinates',
    query: 'where is fireSynapticGraph and buildHebbianGraph implemented in synaptic_engine.mjs line numbers',
    check: (res) =>
      res.activated.some(n =>
        n.axon.includes('|TRUST:LIVE_CODE_AST|') &&
        /fireSynapticGraph\(L\d+-L\d+\)/.test(n.axon) &&
        /buildHebbianGraph\(L\d+-L\d+\)/.test(n.axon)
      )
  },
  {
    name: '20. v4.1 Walk-Away Safety Invariant Guardrails: Surfaces §0.WALK_AWAY_GUARDS in L1 Tensor',
    query: 'overview status',
    check: (res) =>
      res.l1_tensor.includes('§0.WALK_AWAY_GUARDS := !INV:')
  }
];

const tStart = performance.now();
let passed = 0;
for (const tc of BENCHMARK_CASES) {
  const res = fireSynapticGraph(tc.query, 4);
  const ok = Boolean(tc.check(res));
  if (ok) {
    passed++;
    console.log(`  ✅ PASS (${res.elapsedMs}ms) — ${tc.name}`);
  } else {
    console.log(`  ❌ FAIL (${res.elapsedMs}ms) — ${tc.name}`);
    console.log('     Snapped:', res.snappedTypos, 'Activated:', res.activated.map(a => `${a.src}[${a.score}]`));
  }
}
const totalMs = (performance.now() - tStart).toFixed(1);
console.log(`\n🏆 DECKMIND RECALL EVAL SCORE: ${passed}/${BENCHMARK_CASES.length} (${Math.round((passed / BENCHMARK_CASES.length) * 100)}%) in ${totalMs}ms`);
if (passed < BENCHMARK_CASES.length) process.exit(1);
