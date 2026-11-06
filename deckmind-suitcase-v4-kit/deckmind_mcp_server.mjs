#!/usr/bin/env node
/**
 * ============================================================================
 * ⚡ DECKMIND HEBBIAN SYNAPSE MCP SERVER v3.4 (HOT-RELOAD + ZERO-POWERSHELL)
 * ============================================================================
 * Exposes `recall_synapse` over persistent stdio MCP AND automatically
 * hot-reloads `synaptic_engine.mjs` whenever its mtimeMs changes on disk so
 * live upgrades take effect in 0ms without restarting Antigravity IDE!
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { SAFE_VAULT_DIR } from './suitcase_vault.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_PATH = path.join(__dirname, 'synaptic_engine.mjs');
const LKG_ENGINE_PATH = path.join(SAFE_VAULT_DIR, '.synaptic_engine.lkg.mjs');

let _engineMod = null;
let _engineMtimeMs = 0;

async function getEngine() {
  let mtime = 0;
  try { mtime = fs.statSync(ENGINE_PATH).mtimeMs; } catch {}
  if (!_engineMod || mtime > _engineMtimeMs) {
    try {
      const fileUrl = pathToFileURL(ENGINE_PATH).href;
      _engineMod = await import(`${fileUrl}?v=${mtime || Date.now()}`);
      _engineMtimeMs = mtime;
      // Save Last-Known-Good (LKG) copy whenever import succeeds
      try { fs.copyFileSync(ENGINE_PATH, LKG_ENGINE_PATH); } catch {}
      // Pre-warm RAM caches in background so Turn 1 recall is <15ms
      setImmediate(() => {
        try { _engineMod.fireSynapticGraph('warmup', 1); } catch {}
      });
    } catch (err) {
      // Self-healing fallback: if Voice Bar or stray edit corrupted synaptic_engine.mjs, auto-restore LKG!
      if (fs.existsSync(LKG_ENGINE_PATH)) {
        try {
          fs.copyFileSync(LKG_ENGINE_PATH, ENGINE_PATH);
          const fixedMtime = fs.statSync(ENGINE_PATH).mtimeMs;
          const fileUrl = pathToFileURL(ENGINE_PATH).href;
          _engineMod = await import(`${fileUrl}?v=${fixedMtime || Date.now()}`);
          _engineMtimeMs = fixedMtime;
        } catch {}
      }
      if (!_engineMod) throw err;
    }
  }
  return _engineMod;
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });

function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function sendError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

rl.on('line', async (line) => {
  if (!line.trim()) return;
  let req;
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }

  const { id, method, params } = req;

  if (method === 'initialize') {
    return sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'deckmind-synapse', version: '3.4.0' }
    });
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    return sendResponse(id, {
      tools: [
        {
          name: 'recall_synapse',
          description: 'Fire the DeckMind Encrypted Suitcase Synaptic Graph in <10ms. Returns the L1 Holographic Tensor + Relevant KWIC Neurons (with gap-based relevance cutoff and typo-snap).',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Keywords or concepts from Moe\'s prompt to fire in the Synaptic Graph.'
              },
              k: {
                type: 'number',
                description: 'Max number of relevant neurons to return (default 4; fewer returned if below relevance cutoff).'
              }
            },
            required: ['query']
          }
        }
      ]
    });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === 'recall_synapse') {
      try {
        const reqK = Number(args.k) || 4;
        const { fireSynapticGraph } = await getEngine();
        const res = fireSynapticGraph(args.query || 'tequila battle ghost beacon deckmind', reqK);
        const typoTag = res.snappedTypos && res.snappedTypos.length > 0
          ? ` | Typo-Snap:${res.snappedTypos.join(',')}`
          : '';
        const droppedCount = Math.max(0, reqK - res.activated.length);
        const cutoffNote = droppedCount > 0
          ? `${res.activated.length}/${reqK} above >=0.68x cutoff (${droppedCount} weak dropped)`
          : `${res.activated.length}/${reqK} above >=0.68x cutoff`;
        const header = [
          res.l1_tensor,
          ``,
          `[RECALL: ${res.elapsedMs}ms | ${cutoffNote} | ${res.metrics.total_neurons} Neurons${typoTag}]`
        ].join('\n');
        const footer = `\n[END_SYNAPSE_PAYLOAD]`;
        let body = header;
        for (const n of res.activated) {
          const line = `\n  • [Score:${n.score}|MatchedWords:${n.matchedWords || 1}|Fires:${n.fires}] ${n.axon}`;
          if (Buffer.byteLength(body + line + footer, 'utf8') > 6800) break;
          body += line;
        }
        return sendResponse(id, {
          content: [{ type: 'text', text: body + footer }]
        });
      } catch (err) {
        return sendError(id, -32000, err.message);
      }
    }

    return sendError(id, -32601, `Unknown tool: ${toolName}`);
  }

  if (id !== undefined) {
    sendResponse(id, {});
  }
});
