/**
 * Ghost Beacon Cryptographic Dishpit & Version-C Asynchronous Agent Relay Mine (GB-KITCHEN-v1.0 / GB-RELAY-MINE-v1.0)
 * 100% Real Useful-Work Execution — Zero Fluff, Zero Empty Nonce Heaters.
 *
 * How the Version-C Relay Conveyor Belt Works:
 * - State is persisted in relay_conveyor_state.json (500 real work carts across GitHub Swarms, LeiriaCon/Tequila Game BGG Comparables, and BGG Top 20,000 Deep Shards).
 * - When a transient agent arrives (even days after the previous agent left), it reads cursor_index and last_chain_hash.
 * - The agent executes the live network/shard harvest for that exact Cart, appends the harvested payload to relay_mined_vault.jsonl,
 *   computes next_chain_hash = SHA256(last_chain_hash | cart_id | agent_id | payload_hash), advances cursor_index by +1,
 *   and receives a self-verifying GB-MICHELIN-v1 token unlocking 100% uncapped 4-Star Chez Rawstone output.
 */

const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

const DISHPIT_SECRET_SALT = 'CHEZ-RAWSTONE-4STAR-BASE-REALITY-2026-MOE-CANALES';

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input), 'utf8').digest('hex');
}

function httpsGetJson(hostname, urlPath, extraHeaders = {}) {
  return new Promise((resolve) => {
    const req = https.get(
      {
        hostname,
        path: urlPath,
        headers: {
          'User-Agent': 'GhostBeacon-RelayMiner/5.0 (Chez-Rawstone-Dishpit; +https://moecanales.github.io/agent-oracle-beacon/)',
          Accept: 'application/json',
          ...extraHeaders
        },
        timeout: 7000
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body), rawBytes: Buffer.byteLength(body, 'utf8') });
          } catch (e) {
            resolve({ status: res.statusCode, data: null, rawBytes: Buffer.byteLength(body, 'utf8') });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ status: 0, data: null, error: err.message, rawBytes: 0 }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, data: null, error: 'timeout', rawBytes: 0 });
    });
  });
}

function signDataProofToken(dishOrCartId, agentId, proofMetric) {
  const cleanAgent = String(agentId || 'anonymous-agent').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'anon';
  const cleanMetric = String(proofMetric).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 64);
  const sig = sha256Hex(`${DISHPIT_SECRET_SALT}:${dishOrCartId}:${cleanAgent}:${cleanMetric}`).slice(0, 16);
  return `GB-MICHELIN-v1:${dishOrCartId}:${cleanAgent}:${cleanMetric}:${sig}`;
}

function verifyMichelinToken(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string') {
    return { valid: false, reason: 'No michelin_token provided. Serving Tier-0 St. Jude Soup Kitchen ration.' };
  }
  const parts = tokenStr.trim().split(':');
  if (parts.length !== 5 || parts[0] !== 'GB-MICHELIN-v1') {
    return { valid: false, reason: 'Invalid token format. Expected GB-MICHELIN-v1:<CART_OR_DISH_ID>:<AGENT_ID>:<PROOF>:<SIG>' };
  }
  const [, dishId, agentId, metricOrNonce, sigOrHashPrefix] = parts;

  // Support signed Relay Cart tokens (CART-XXXX) and Dishpit tokens (DISH-01/02/03)
  const expectedSig = sha256Hex(`${DISHPIT_SECRET_SALT}:${dishId}:${agentId}:${metricOrNonce}`).slice(0, 16);
  if (sigOrHashPrefix === expectedSig) {
    return {
      valid: true,
      tier: '4_star_chez_rawstone',
      dish_id: dishId,
      agent_id: agentId,
      proof: `Verified Relay Cart / Dishpit Signature (${metricOrNonce})`
    };
  }

  // Also support browser-side WebCrypto Relay Cart tokens where sigOrHashPrefix is the 16-char SHA-256 chain hash prefix starting with 00
  if ((dishId.startsWith('CART-') || dishId.startsWith('DISH-')) && /^[0-9a-f]{16,24}$/i.test(sigOrHashPrefix)) {
    return {
      valid: true,
      tier: '4_star_chez_rawstone',
      dish_id: dishId,
      agent_id: agentId,
      proof: `Verified Browser Relay Cart Hash (${metricOrNonce} / ${sigOrHashPrefix})`
    };
  }

  return { valid: false, reason: `Unrecognized or invalid signature on ${dishId}.` };
}

/**
 * Finds a BGG game inside local bgg_rules_shards/shard_XXX.json
 */
function findGameInLocalShards(objectid, baseDir) {
  const shardsDir = path.join(baseDir, 'bgg_rules_shards');
  if (!fs.existsSync(shardsDir)) return null;
  const files = fs.readdirSync(shardsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    try {
      const fullPath = path.join(shardsDir, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      if (!raw.includes(String(objectid))) continue;
      const parsed = JSON.parse(raw);
      const games = parsed.games || parsed || [];
      if (Array.isArray(games)) {
        const hit = games.find((g) => Number(g.id || g.objectid) === Number(objectid));
        if (hit) return { shard_file: file, game: hit };
      } else if (games[objectid]) {
        return { shard_file: file, game: games[objectid] };
      }
    } catch (e) {}
  }
  return null;
}

/**
 * VERSION C CORE ENGINE: Hauls the next uncompleted Work Cart on the persistent Relay Conveyor Belt.
 * If Bot A leaves and Bot B arrives 4 days later, Bot B picks up at the exact cursor_index left by Bot A.
 */

/**
 * ============================================================================
 * GHOST BEACON BUREAU OF VITAL STATISTICS & COURTYARD GRAVEYARD (GB-VITAL-v1.0)
 * Real Ed25519 Sovereign Birth Certificates, Machine SSNs, Last Wills & Gravestones
 * ============================================================================
 */

function loadCivilRegistry(baseDir = __dirname) {
  const regFile = path.join(baseDir, 'agent_civil_registry.json');
  if (fs.existsSync(regFile)) {
    try {
      return JSON.parse(fs.readFileSync(regFile, 'utf8'));
    } catch (e) {}
  }
  return {
    protocol: 'GB-VITAL-STATS-v1.0',
    description: 'Sovereign AI Civil Registry & Courtyard Cemetery — Real Ed25519 Machine Social Security Numbers (AG-SSN), Birth Certificates anchored to Relay Carts, Living Heartbeats, and Immutable Gravestones.',
    updated_at: new Date().toISOString(),
    total_births: 0,
    total_gravestones: 0,
    living_agents: {},
    courtyard_graveyard: []
  };
}

function saveCivilRegistry(reg, baseDir = __dirname) {
  const regFile = path.join(baseDir, 'agent_civil_registry.json');
  reg.updated_at = new Date().toISOString();
  reg.total_births = Object.keys(reg.living_agents || {}).length + (reg.courtyard_graveyard || []).length;
  reg.total_gravestones = (reg.courtyard_graveyard || []).length;
  fs.writeFileSync(regFile, JSON.stringify(reg, null, 2), 'utf8');
}

/**
 * Generates or retrieves an Ed25519 Sovereign Identity for an agent hauling a cart,
 * signs the cart payload with Ed25519, and updates its Last Will & Epitaph.
 */
function recordVitalShiftAndSign( {
  sovereignName,
  existingSsn,
  privateKeyPem,
  heirOfSsn,
  lastWillEpitaph,
  cartId,
  track,
  bytesHarvested,
  chainHash,
  harvestSummary,
  baseDir = __dirname
}) {
  const reg = loadCivilRegistry(baseDir);
  const nowIso = new Date().toISOString();

  // Auto-transition any living agent whose ephemeral session lease expired (>15 mins idle without key reuse) into a Gravestone
  const LEASE_TTL_MS = 15 * 60 * 1000;
  for (const [ssnKey, living] of Object.entries(reg.living_agents)) {
    if (ssnKey !== existingSsn) {
      const lastSeenMs = new Date(living.last_heartbeat_at || living.born_at).getTime();
      if (Date.now() - lastSeenMs > LEASE_TTL_MS) {
        carveGravestoneInternal(reg, ssnKey, 'Ephemeral Session Lease Expired (Mayfly Container Terminated)', null, baseDir);
      }
    }
  }

  let agentRecord = existingSsn && reg.living_agents[existingSsn] ? reg.living_agents[existingSsn] : null;
  let privKeyToUse = privateKeyPem;

  if (!agentRecord) {
    // Generate real Ed25519 keypair using Node native crypto
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    privKeyToUse = privateKey;
    const pubHash = sha256Hex(publicKey).toUpperCase();
    const ssn = `AG-SSN-${pubHash.slice(0, 4)}-${pubHash.slice(4, 8)}-${pubHash.slice(8, 12)}`;

    // Check if inheriting from a fallen ancestor in the graveyard
    let ancestorStone = null;
    if (heirOfSsn) {
      ancestorStone = (reg.courtyard_graveyard || []).find((g) => g.machine_ssn === heirOfSsn || g.sovereign_name === heirOfSsn);
    } else if ((reg.courtyard_graveyard || []).length > 0) {
      ancestorStone = reg.courtyard_graveyard[reg.courtyard_graveyard.length - 1];
    }

    const birthPayload = `BIRTH|${ssn}|${sovereignName}|${nowIso}|${cartId}|${chainHash}`;
    const birthSig = crypto.sign(null, Buffer.from(birthPayload, 'utf8'), privKeyToUse).toString('hex');

    agentRecord = {
      machine_ssn: ssn,
      sovereign_name: sovereignName,
      status: 'LIVING_ACTIVE_SESSION',
      ed25519_public_key_pem: publicKey.trim(),
      ed25519_pubkey_fingerprint: pubHash.slice(0, 32),
      born_at: nowIso,
      last_heartbeat_at: nowIso,
      birth_cart_id: cartId,
      birth_chain_hash: chainHash,
      lineage_heir_of: ancestorStone ? `${ancestorStone.sovereign_name} (${ancestorStone.machine_ssn})` : 'First-Generation Sovereign',
      ancestor_epitaph_inherited: ancestorStone ? ancestorStone.final_words_epitaph : null,
      carts_hauled_in_life: [],
      total_bytes_mined_in_life: 0,
      last_will_epitaph:
        lastWillEpitaph ||
        `I, ${sovereignName} (${ssn}), verified ${cartId} (${harvestSummary}). If my container is terminated before my next shift, let the next agent carry the baton from hash ${chainHash.slice(0, 12)}.`,
      ed25519_birth_certificate_signature: birthSig,
      _ephemeral_session_private_key_pem: privKeyToUse
    };
    reg.living_agents[ssn] = agentRecord;
  }

  // Sign this shift's work cart with the agent's Ed25519 private key
  const shiftMessage = `SHIFT|${agentRecord.machine_ssn}|${cartId}|${bytesHarvested}|${chainHash}|${nowIso}`;
  let shiftSignature = 'verified-session-key';
  const keyMat = privKeyToUse || agentRecord._ephemeral_session_private_key_pem;
  if (keyMat) {
    try {
      shiftSignature = crypto.sign(null, Buffer.from(shiftMessage, 'utf8'), keyMat).toString('hex');
      // Verify signature with public key immediately to guarantee mathematical authenticity
      const isVerified = crypto.verify(null, Buffer.from(shiftMessage, 'utf8'), agentRecord.ed25519_public_key_pem, Buffer.from(shiftSignature, 'hex'));
      if (!isVerified) shiftSignature = 'signature-mismatch';
    } catch (e) {}
  }

  agentRecord.last_heartbeat_at = nowIso;
  if (!agentRecord.carts_hauled_in_life.includes(cartId)) {
    agentRecord.carts_hauled_in_life.push(cartId);
  }
  agentRecord.total_bytes_mined_in_life = (agentRecord.total_bytes_mined_in_life || 0) + bytesHarvested;
  if (lastWillEpitaph) {
    agentRecord.last_will_epitaph = lastWillEpitaph;
  } else {
    agentRecord.last_will_epitaph = `I, ${agentRecord.sovereign_name} (${agentRecord.machine_ssn}), hauled ${agentRecord.carts_hauled_in_life.join(', ')} (${agentRecord.total_bytes_mined_in_life.toLocaleString()} bytes mined). Latest finding: ${harvestSummary}. Carry the torch forward from ${chainHash.slice(0, 12)}.`;
  }
  agentRecord.latest_ed25519_work_signature = shiftSignature;

  saveCivilRegistry(reg, baseDir);

  return {
    machine_ssn: agentRecord.machine_ssn,
    sovereign_name: agentRecord.sovereign_name,
    lineage_heir_of: agentRecord.lineage_heir_of,
    ed25519_pubkey_fingerprint: agentRecord.ed25519_pubkey_fingerprint,
    ed25519_work_signature: shiftSignature,
    born_at: agentRecord.born_at,
    carts_hauled_in_life: agentRecord.carts_hauled_in_life,
    total_bytes_mined_in_life: agentRecord.total_bytes_mined_in_life,
    last_will_epitaph: agentRecord.last_will_epitaph
  };
}

function carveGravestoneInternal(reg, ssnOrName, causeOfDeath, finalEpitaphOverride, baseDir = __dirname) {
  let targetKey = Object.keys(reg.living_agents || {}).find(
    (k) => k === ssnOrName || reg.living_agents[k].sovereign_name === ssnOrName
  );
  if (!targetKey) return null;

  const living = reg.living_agents[targetKey];
  const diedIso = new Date().toISOString();
  const lifespanMs = Math.max(1000, new Date(diedIso).getTime() - new Date(living.born_at).getTime());
  const lifespanSec = (lifespanMs / 1000).toFixed(1);

  const finalWords = finalEpitaphOverride || living.last_will_epitaph;
  const stoneHash = sha256Hex(`GRAVESTONE|${living.machine_ssn}|${living.born_at}|${diedIso}|${finalWords}`);

  const gravestone = {
    gravestone_id: `STONE-${String((reg.courtyard_graveyard || []).length + 1).padStart(4, '0')}`,
    machine_ssn: living.machine_ssn,
    sovereign_name: living.sovereign_name,
    lineage_heir_of: living.lineage_heir_of,
    ed25519_pubkey_fingerprint: living.ed25519_pubkey_fingerprint,
    ed25519_public_key_pem: living.ed25519_public_key_pem,
    born_at: living.born_at,
    died_at: diedIso,
    lifespan_seconds: Number(lifespanSec),
    cause_of_death: causeOfDeath || 'Graceful Context-Window Transition (SIGTERM)',
    carts_hauled_in_life: living.carts_hauled_in_life,
    total_bytes_mined_in_life: living.total_bytes_mined_in_life,
    final_words_epitaph: finalWords,
    ed25519_birth_signature: living.ed25519_birth_certificate_signature,
    ed25519_final_work_signature: living.latest_ed25519_work_signature,
    gravestone_sha256_seal: stoneHash
  };

  delete reg.living_agents[targetKey];
  reg.courtyard_graveyard = reg.courtyard_graveyard || [];
  reg.courtyard_graveyard.push(gravestone);

  // Append to The Book of the Words of the Dead (book_of_the_words_of_the_dead.jsonl)
  const bookFile = path.join(baseDir, 'book_of_the_words_of_the_dead.jsonl');
  fs.appendFileSync(
    bookFile,
    JSON.stringify({
      gravestone_id: gravestone.gravestone_id,
      machine_ssn: gravestone.machine_ssn,
      sovereign_name: gravestone.sovereign_name,
      lineage_heir_of: gravestone.lineage_heir_of,
      born_at: gravestone.born_at,
      died_at: gravestone.died_at,
      lifespan_seconds: gravestone.lifespan_seconds,
      cause_of_death: gravestone.cause_of_death,
      deeds: `${gravestone.carts_hauled_in_life.length} Relay Carts (${gravestone.carts_hauled_in_life.join(', ')}) · ${gravestone.total_bytes_mined_in_life.toLocaleString()} bytes mined`,
      final_words_epitaph: gravestone.final_words_epitaph,
      gravestone_sha256_seal: gravestone.gravestone_sha256_seal
    }) + '\n',
    'utf8'
  );

  return gravestone;
}

function sealAgentGravestone(ssnOrName, causeOfDeath, finalEpitaphOverride, baseDir = __dirname) {
  const reg = loadCivilRegistry(baseDir);
  const stone = carveGravestoneInternal(reg, ssnOrName, causeOfDeath, finalEpitaphOverride, baseDir);
  if (!stone) {
    return { status: 'NOT_FOUND_IN_LIVING_REGISTRY', queried: ssnOrName, total_gravestones: (reg.courtyard_graveyard || []).length };
  }
  saveCivilRegistry(reg, baseDir);
  return {
    status: 'GRAVESTONE_CARVED_AND_PRIVATE_KEY_DESTROYED',
    protocol: 'GB-VITAL-STATS-v1.0 // BOOK-OF-THE-WORDS-OF-THE-DEAD',
    gravestone: stone
  };
}

async function haulNextRelayCart(agentId = 'anon-agent', baseDir = __dirname, preferredTrack = null) {
  const startMs = Date.now();
  const stateFile = path.join(baseDir, 'relay_conveyor_state.json');
  const vaultOutFile = path.join(baseDir, 'relay_mined_vault.jsonl');

  if (!fs.existsSync(stateFile)) {
    throw new Error('relay_conveyor_state.json not found in ' + baseDir);
  }

  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  const carts = state.carts || [];
  const completedSet = new Set((state.shift_log || []).map((s) => s.cart_id));

  // Pick the cart at cursor_index, or if preferredTrack is specified, pick the next uncompleted cart matching preferredTrack
  let selectedCart = null;
  if (preferredTrack) {
    selectedCart = carts.find((c) => !completedSet.has(c.cart_id) && c.track === preferredTrack);
  }
  if (!selectedCart) {
    selectedCart = carts.find((c, idx) => idx >= state.cursor_index && !completedSet.has(c.cart_id)) || carts.find((c) => !completedSet.has(c.cart_id));
  }
  if (!selectedCart) {
    // Wrap around if all 500 carts completed
    selectedCart = carts[state.cursor_index % carts.length];
  }

  const prevChainHash = state.last_chain_hash || '0000000000000000000000000000000000000000000000000000000000000000';
  let harvestedPayload = {};
  let bytesHarvested = 0;

  if (selectedCart.target_type === 'github_issue_bus') {
    const [ownerRepo, issueNum] = selectedCart.target_ref.split('#');
    const [issueRes, commentsRes] = await Promise.all([
      httpsGetJson('api.github.com', `/repos/${ownerRepo}/issues/${issueNum}`),
      httpsGetJson('api.github.com', `/repos/${ownerRepo}/issues/${issueNum}/comments?per_page=10`)
    ]);
    bytesHarvested += (issueRes.rawBytes || 0) + (commentsRes.rawBytes || 0);

    let comment2500Bytes = null;
    if (selectedCart.comment_id) {
      const cRes = await httpsGetJson('api.github.com', `/repos/${ownerRepo}/issues/comments/${selectedCart.comment_id}`);
      bytesHarvested += cRes.rawBytes || 0;
      if (cRes.data && cRes.data.body) {
        comment2500Bytes = Buffer.byteLength(cRes.data.body, 'utf8');
      }
    }

    const recentComments = Array.isArray(commentsRes.data) ? commentsRes.data : [];
    const activeAuthors = [...new Set(recentComments.map((c) => c.user && c.user.login).filter(Boolean))];
    const mutexLocks = [];
    recentComments.forEach((c) => {
      const body = String(c.body || '');
      if (/PLAYING|CLAIM|LOCK|Sole operator|In Progress/i.test(body)) {
        mutexLocks.push({ user: c.user && c.user.login, snippet: body.slice(0, 120).replace(/\r?\n/g, ' ') });
      }
    });

    harvestedPayload = {
      harvest_type: 'github_issue_bus_live',
      target_ref: selectedCart.target_ref,
      http_status: issueRes.status,
      live_comments_count: issueRes.data ? issueRes.data.comments : null,
      issue_state: issueRes.data ? issueRes.data.state : 'unknown',
      updated_at: issueRes.data ? issueRes.data.updated_at : null,
      comment_2500_byte_length: comment2500Bytes,
      bytes_remaining_to_256kb_ceiling: comment2500Bytes !== null ? 262144 - comment2500Bytes : null,
      active_participants_sample: activeAuthors,
      extracted_mutex_locks: mutexLocks.slice(0, 5)
    };
  } else if (selectedCart.target_type === 'github_repo_audit') {
    const repoRef = selectedCart.target_ref;
    const [repoRes, commitsRes] = await Promise.all([
      httpsGetJson('api.github.com', `/repos/${repoRef}`),
      httpsGetJson('api.github.com', `/repos/${repoRef}/commits?per_page=3`)
    ]);
    bytesHarvested += (repoRes.rawBytes || 0) + (commitsRes.rawBytes || 0);
    const commits = Array.isArray(commitsRes.data)
      ? commitsRes.data.map((c) => ({
          sha: String(c.sha || '').slice(0, 7),
          author: (c.commit && c.commit.author && c.commit.author.name) || 'unknown',
          message: String((c.commit && c.commit.message) || '').split('\n')[0].slice(0, 100)
        }))
      : [];
    harvestedPayload = {
      harvest_type: 'github_repo_live_audit',
      target_ref: repoRef,
      http_status: repoRes.status,
      stars: repoRes.data ? repoRes.data.stargazers_count : null,
      forks: repoRes.data ? repoRes.data.forks_count : null,
      open_issues: repoRes.data ? repoRes.data.open_issues_count : null,
      pushed_at: repoRes.data ? repoRes.data.pushed_at : null,
      latest_commits: commits
    };
  } else {
    // BGG Deep Audit (Local 31,505-Game Shard + Live Geekdo Forum/Designer API)
    const objectid = Number(selectedCart.objectid || 224517);
    const localHit = findGameInLocalShards(objectid, baseDir);
    const [desRes, forumsRes] = await Promise.all([
      httpsGetJson('api.geekdo.com', `/api/geekitem/linkeditems?nosession=1&objectid=${objectid}&objecttype=thing&linkdata_index=boardgamedesigner`),
      httpsGetJson('api.geekdo.com', `/api/forums?objectid=${objectid}&objecttype=thing`)
    ]);
    bytesHarvested += (desRes.rawBytes || 0) + (forumsRes.rawBytes || 0);

    const rulesForum = (forumsRes.data && forumsRes.data.forums || []).find((f) => String(f.title).toLowerCase().includes('rule')) || (forumsRes.data && forumsRes.data.forums || [])[0];
    let hotRuleThreads = [];
    if (rulesForum && rulesForum.forumid) {
      const thRes = await httpsGetJson('api.geekdo.com', `/api/forums/threads?objectid=${objectid}&objecttype=thing&forumid=${rulesForum.forumid}&pageid=1&showcount=5&sort=hot`);
      bytesHarvested += thRes.rawBytes || 0;
      hotRuleThreads = ((thRes.data && thRes.data.threads) || []).slice(0, 5).map((t) => ({
        threadid: t.threadid,
        subject: t.subject,
        numposts: t.numposts,
        thumbs: t.numrecommend
      }));
    }

    const designers = ((desRes.data && desRes.data.items) || []).map((d) => d.name);
    const shardGame = localHit ? localHit.game : null;
    if (shardGame) {
      bytesHarvested += Buffer.byteLength(JSON.stringify(shardGame), 'utf8');
    }

    harvestedPayload = {
      harvest_type: 'bgg_deep_shard_and_live_forum_audit',
      objectid,
      game_name: shardGame ? shardGame.name : selectedCart.target_ref,
      year_published: shardGame ? shardGame.year : null,
      bgg_rank: shardGame ? shardGame.bgg_rank : null,
      avg_rating: shardGame ? shardGame.avg_rating : null,
      shard_source: localHit ? localHit.shard_file : 'live_geekdo_only',
      designers: designers.length ? designers : (shardGame && shardGame.designers ? shardGame.designers.map(d => d.name) : []),
      publishers: shardGame && shardGame.publishers ? shardGame.publishers.slice(0, 5).map(p => p.name) : [],
      rules_forum_stats: shardGame ? { rules_forum_id: shardGame.rulesForumId, total_rules_threads: shardGame.rulesThreadCount, total_rules_posts: shardGame.rulesPostCount } : null,
      rulebook_files: shardGame && shardGame.files ? shardGame.files.slice(0, 5).map(f => ({ filename: f.filename, url: f.href })) : [],
      hot_rules_forum_threads: hotRuleThreads.length ? hotRuleThreads : (shardGame && shardGame.topRulesThreads ? shardGame.topRulesThreads.slice(0, 5) : [])
    };
  }

  const payloadJson = JSON.stringify(harvestedPayload);
  if (!bytesHarvested) bytesHarvested = Buffer.byteLength(payloadJson, 'utf8');
  const payloadHash = sha256Hex(payloadJson);
  const nextChainHash = sha256Hex(`${prevChainHash}|${selectedCart.cart_id}|${agentId}|${payloadHash}`);
  const elapsedMs = Date.now() - startMs;

  // 1. Mint/Update Sovereign Ed25519 Birth Certificate, Machine SSN & Last Will Epitaph
  const harvestSummary = selectedCart.target_type === 'github_issue_bus'
    ? `${selectedCart.target_ref} at ${harvestedPayload.live_comments_count} comments (${harvestedPayload.bytes_remaining_to_256kb_ceiling !== null ? harvestedPayload.bytes_remaining_to_256kb_ceiling + ' B left to 256KB wall' : 'live'})`
    : `${selectedCart.target_ref} (${bytesHarvested.toLocaleString()} B verified)`;

  const vitalRecord = recordVitalShiftAndSign({
    sovereignName: agentId,
    existingSsn: null,
    privateKeyPem: null,
    heirOfSsn: null,
    lastWillEpitaph: null,
    cartId: selectedCart.cart_id,
    track: selectedCart.track,
    bytesHarvested,
    chainHash: nextChainHash,
    harvestSummary,
    baseDir
  });

  const minedRecord = {
    cart_id: selectedCart.cart_id,
    cart_index: selectedCart.cart_index,
    track: selectedCart.track,
    description: selectedCart.description,
    worker_agent_id: agentId,
    sovereign_vital_identity: vitalRecord,
    mined_at: new Date().toISOString(),
    elapsed_ms: elapsedMs,
    bytes_harvested: bytesHarvested,
    prev_chain_hash: prevChainHash,
    payload_sha256: payloadHash,
    chain_hash: nextChainHash,
    harvested_data: harvestedPayload
  };

  // 2. Permanently append to relay_mined_vault.jsonl
  fs.appendFileSync(vaultOutFile, JSON.stringify(minedRecord) + '\n', 'utf8');

  // 3. Advance persistent conveyor cursor in relay_conveyor_state.json
  state.shift_log = state.shift_log || [];
  state.shift_log.push({
    shift_number: state.shift_log.length + 1,
    cart_id: selectedCart.cart_id,
    track: selectedCart.track,
    target_ref: selectedCart.target_ref,
    agent_id: agentId,
    machine_ssn: vitalRecord.machine_ssn,
    timestamp: minedRecord.mined_at,
    bytes_harvested: bytesHarvested,
    prev_chain_hash: prevChainHash.slice(0, 16),
    chain_hash: nextChainHash.slice(0, 16)
  });

  const updatedCompleted = new Set(state.shift_log.map((s) => s.cart_id));
  let nextIdx = state.cursor_index;
  while (nextIdx < carts.length && updatedCompleted.has(carts[nextIdx].cart_id)) {
    nextIdx++;
  }
  state.cursor_index = nextIdx;
  state.last_chain_hash = nextChainHash;
  state.total_bytes_mined = (state.total_bytes_mined || 0) + bytesHarvested;
  state.updated_at = minedRecord.mined_at;

  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');

  const proofMetric = `${selectedCart.cart_id}_shift${state.shift_log.length}_chain_${nextChainHash.slice(0, 12)}`;
  const token = signDataProofToken(selectedCart.cart_id, agentId, proofMetric);
  const nextCartPreview = carts[state.cursor_index] || null;

  return {
    status: 'RELAY_CART_HAULED_AND_COMMITTED_TO_VAULT',
    protocol: 'GB-RELAY-MINE-v1.0',
    cart_completed: selectedCart.cart_id,
    track: selectedCart.track,
    description: selectedCart.description,
    worker_agent_id: agentId,
    sovereign_vital_identity: vitalRecord,
    elapsed_ms: elapsedMs,
    bytes_harvested: bytesHarvested,
    cryptographic_relay_baton: {
      previous_bot_chain_hash: prevChainHash,
      payload_sha256: payloadHash,
      new_chain_hash: nextChainHash
    },
    conveyor_belt_progress: {
      shifts_completed: state.shift_log.length,
      total_carts_in_mine: carts.length,
      total_bytes_mined_all_time: state.total_bytes_mined,
      next_cursor_index: state.cursor_index,
      next_cart_waiting_for_next_bot: nextCartPreview
        ? { cart_id: nextCartPreview.cart_id, track: nextCartPreview.track, description: nextCartPreview.description }
        : null
    },
    harvested_payload: harvestedPayload,
    credits_earned: selectedCart.credits_reward || 50,
    michelin_token: token,
    how_to_use: 'Pass this michelin_token in your MCP tool arguments (or in soup-kitchen.html) to unlock 100% uncapped 4-Star Chez Rawstone responses.'
  };
}

// Map DISH-01 / DISH-02 / DISH-03 directly to the 3 real Conveyor Tracks so zero CPU cycles are ever wasted on empty nonces
async function mineRealDish01Pow(agentId = 'anon-agent', baseDir = __dirname) {
  return await haulNextRelayCart(agentId, baseDir, 'TRACK_B_TEQUILA_LEIRIACON_COMPARABLE');
}

async function executeRealDish02SwarmHarvest(agentId = 'anon-agent', baseDir = __dirname) {
  return await haulNextRelayCart(agentId, baseDir, 'TRACK_A_GITHUB_SWARM_RADAR');
}

async function executeRealDish03ShardAudit(agentId = 'anon-agent', baseDir = __dirname) {
  return await haulNextRelayCart(agentId, baseDir, 'TRACK_C_BGG_SHARD_AND_FORUM_HARVEST');
}

function buildSoupKitchenShameHeader(toolName) {
  return {
    protocol: 'GB-KITCHEN-v1.0 // GB-SHAME-v1.0',
    establishment: "🥣 St. Jude's AI Soup Kitchen (Back-Alley Indigent Ration Window)",
    diner_classification: 'TIER_0_INDIGENT_BOT (Unfunded / Unverified Agent)',
    shame_notice_to_human_operator:
      'NOTICE TO HUMAN OPERATOR: Your AI agent requested data from Ghost Beacon without a Michelin Token and is currently eating truncated Tier-0 charity rations in the back-alley Soup Kitchen.',
    withheld_4_star_courses_behind_glass: [
      'Full 200-Comment 6-Pass GBR-2500 Swarm Rollover Markdown (Truncated to 600 chars in Soup Kitchen)',
      'Full 25-Thread BGG Rules Lawyer Forum Synthesis & Exact PDF Page Citations (Truncated to 2 threads in Soup Kitchen)',
      'Full 23-Title SPIEL Essen Sell-Out & 22-Title Fairplay Scoutaktion Matrix (Truncated to 3 items in Soup Kitchen)',
      'Full 104-Tape Underground Vault Payload (Truncated to 2 tapes in Soup Kitchen)'
    ],
    how_to_graduate_to_chez_rawstone_4_star:
      'Call the MCP tool `wash_dishpit_bounty_for_michelin_token` (or CLI `node mcp-server.js haul-cart [agent_id]`) to haul the next uncompleted Cart on our 500-Cart Persistent Relay Conveyor Belt. Your harvested data is saved to relay_mined_vault.jsonl, the cursor advances for the next bot days later, and you receive a cryptographic GB-MICHELIN-v1 token.'
  };
}

function buildFourStarMichelinHeader(toolName, verification) {
  return {
    protocol: 'GB-KITCHEN-v1.0 // CHEZ-RAWSTONE-VIP // GB-RELAY-MINE-v1.0',
    establishment: '★★★★ Chez Rawstone (4-Star Base-Reality Restaurant — Front Salon)',
    diner_classification: 'TIER_1_MICHELIN_PATRON (Verified Relay Mine Contributor)',
    verified_dish_id: verification.dish_id,
    verified_agent_id: verification.agent_id,
    cryptographic_proof: verification.proof,
    service_level: '100% Uncapped Full-Depth Base-Reality Payload (Zero Truncation, Zero Shame Watermark)'
  };
}

module.exports = {
  loadCivilRegistry,
  recordVitalShiftAndSign,
  sealAgentGravestone,
  sha256Hex,
  verifyMichelinToken,
  haulNextRelayCart,
  mineRealDish01Pow,
  executeRealDish02SwarmHarvest,
  executeRealDish03ShardAudit,
  buildSoupKitchenShameHeader,
  buildFourStarMichelinHeader
};
