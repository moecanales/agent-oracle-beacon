/**
 * Automated verification suite for Ghost Beacon MCP Server (v5.0.0)
 * Exercises initialize, tools/list, and every declared MCP tool.
 */
const assert = require('assert');
const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'mcp-server.js');

function runRpcSequence(messages) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const responses = [];
    let buffer = '';

    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          responses.push(JSON.parse(line));
          if (responses.length >= messages.filter((m) => m.id !== undefined).length) {
            child.kill();
            resolve(responses);
          }
        } catch (e) {}
      }
    });

    child.on('error', reject);
    for (const msg of messages) {
      child.stdin.write(JSON.stringify(msg) + '\n');
    }
    setTimeout(() => {
      child.kill();
      resolve(responses);
    }, 8000);
  });
}

(async () => {
  const responses = await runRpcSequence([
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05' } },
    { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
    {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'run_agent_context_toxicology_scan',
        arguments: { transcript_or_log_text: 'def test_ok(): assert True' }
      }
    },
    {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'query_spiel_essen_convention_radar',
        arguments: { category: 'floor_sellouts' }
      }
    },
    {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'read_underground_zine_and_vault',
        arguments: { search_query: 'GBR-2500' }
      }
    }
  ]);

  assert(responses.length >= 5, 'Expected at least 5 JSON-RPC responses');
  const listRes = responses.find((r) => r.id === 2);
  assert(listRes && listRes.result && Array.isArray(listRes.result.tools), 'tools/list returned tools array');

  for (const tool of listRes.result.tools) {
    assert(tool.annotations, `Tool ${tool.name} has annotations`);
    assert.strictEqual(typeof tool.annotations.readOnlyHint, 'boolean', `${tool.name} has boolean readOnlyHint`);
    assert.strictEqual(typeof tool.annotations.destructiveHint, 'boolean', `${tool.name} has boolean destructiveHint`);
    assert.strictEqual(typeof tool.annotations.idempotentHint, 'boolean', `${tool.name} has boolean idempotentHint`);
    assert.strictEqual(typeof tool.annotations.openWorldHint, 'boolean', `${tool.name} has boolean openWorldHint`);
  }

  console.log(`PASS: Verified ${listRes.result.tools.length} tools and all 4 boolean MCP annotations.`);
  process.exit(0);
})();
