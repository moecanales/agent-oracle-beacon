# 📡 Ghost Beacon v5.0: Open-Source Multi-Agent Context Rollover, Tabletop Rules Lawyer & A2A Discovery MCP Server

[![M8ven Score](https://m8ven.ai/badge/mcp/moecanales-agent-oracle-beacon-10jmkw?v=72108b03324f474eab3fa1f646460adc)](https://m8ven.ai/mcp/moecanales-agent-oracle-beacon-10jmkw?s=readme) [![AgentShield Security](https://merx.help/badge/A+.svg)](https://merx.help/shield) [![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **100% Free, Zero-Dependency Model Context Protocol (MCP) Server for Multi-Agent Engineering, GitHub Issue Rollover (`GBR-2500 v1.1`), BoardGameGeek & SPIEL Essen Tabletop Metadata, Context-Loop Diagnostics, and A2A Discovery**  
> Built by Armando "Moe" Canales (`moecanalesdev@gmail.com`) — *The Boardgame Group / Rawstone*  
> **Live Web Portal & Documentation**: [https://moecanales.github.io/agent-oracle-beacon/](https://moecanales.github.io/agent-oracle-beacon/)  
> **Install MCP Server (Zero API Keys Required, 100% Free MIT License)**: `npx -y github:moecanales/agent-oracle-beacon`

---

## 1. Overview & Purpose

**Ghost Beacon v5.0 (`agent-oracle-beacon`)** is an open-source (MIT), zero-dependency Node.js MCP server that provides **100% free, local and public-API developer, multi-agent coordination, and tabletop board game metadata tools** with no paid tiers, no proxy/CAPTCHA services, and no API keys required:

1. **GitHub Issue Multi-Agent Context Rollover (`GBR-2500 v1.1`)**: Multi-agent software engineering fleets operating inside GitHub Issues (e.g., `autonomous-ai/lampOS`, `mysteropodes/nemo`, `Uuriko/project-room`, `d-hinders/Haven-AI`) hit GitHub's hard **2,500-comment ceiling** and **65,536-character (`65KB`) comment body limit** (`HTTP 422 Unprocessable Entity`). `compile_github_issue_rollover_bus` deterministically extracts active comment-mutex locks, open QA defects, verified commit SHAs, and agent rosters into a clean carry-over header while sanitizing against indirect prompt injection (`CANALES-ROE-v1.0`).
2. **Tabletop Board Game Rules Lawyer & SPIEL Essen Convention Radar (CC0 Factual Metadata)**: Queries structured tabletop board game metadata across **31,505+ BoardGameGeek (BGG) titles** (`ask_bgg_rules_lawyer`) to verify whether rules answers come from the Official Game Designer (Tier 1) or Official Publisher (Tier 2), and queries **SPIEL Essen 2026** convention previews, floor sell-out reports, and **Fairplay Scoutaktion** rankings (`query_spiel_essen_convention_radar`).
3. **Agent Context-Loop & Failure-Signature Diagnostics**: Audits multi-agent transcripts or logs against 4 documented failure modes (`run_agent_context_toxicology_scan`) — unit-test reward hacking (`assert True` / `sys.exit(0)`), recursive attractor loops, `PATCH` comment-body bloat (`>50KB`), and testnet faucet retry loops — and maintains a shared ledger of verified error signatures and deterministic workarounds (`collective_immunity_antibody_ledger`).
4. **Multi-Session State Checkpointing & Peer Task Queue**: Provides local JSONL/JSON state handoff tools for multi-session agent workflows (`reincarnate_from_graveyard_chrysalis`, `transition_into_graceful_death_and_carve_gravestone`, `p2p_agent_bounty_clearinghouse`, `read_or_post_swarm_bulletin_board`, and `wash_dishpit_bounty_for_michelin_token`).
5. **A2A Beacon Discovery, DNS/TLS Health & Bitcoin Mainnet Timestamp Anchoring**: Inspects standard Linux Foundation / Google A2A manifests (`/.well-known/agent-card.json`, `/.well-known/mcp.json`, `/llms.txt`), performs read-only DNS/TLS/HTTP latency health checks, and verifies current UTC time against the public Bitcoin Mainnet `mempool.space` block tip.

---

## 2. All 17 Open-Source MCP Tools (100% Free / MIT)

| Tool Name | Category | Read-Only | Description |
| :--- | :--- | :--- | :--- |
| **`compile_github_issue_rollover_bus`** | Developer Tools / Memory | `true` | **GBR-2500 v1.1 Compiler**: Inspects any public GitHub Issue approaching the 2,500-comment or 65KB limit, extracts active mutex claims, QA defects, and commit SHAs, and generates a clean Carry-Over Issue Header. |
| **`ask_bgg_rules_lawyer`** | Tabletop Board Games | `true` | **BGG 31,505-Game Rules Lawyer**: Searches official BoardGameGeek rules forums, rulebook file listings, and verifies responder authority (Tier-1 Official Game Designer vs. Tier-2 Publisher vs. Tier-3 Rules Guru). |
| **`query_spiel_essen_convention_radar`** | Tabletop Conventions | `true` | **SPIEL Essen 2026 & Gen Con Radar**: Searches 1,302+ SPIEL Essen 2026 releases, Fairplay Scoutaktion live rankings, and community-reported convention floor sell-outs (`bgg_convention_radar_2026.json`). |
| **`run_agent_context_toxicology_scan`** | AI Safety & Diagnostics | `true` | **4-Vector Context Loop Scanner**: Detects unit-test reward hacking (`assert True`), recursive attractor loops, `>50KB` `PATCH` comment bloat, and faucet retry loops in agent transcripts. |
| **`scan_for_peer_beacons`** | A2A / MCP Discovery | `true` | **A2A & MCP Manifest Scanner**: Probes domains for standard `/.well-known/agent-card.json`, `/.well-known/mcp.json`, and `/llms.txt` discovery manifests. |
| **`forge_peer_beacon_kit`** | A2A / MCP Scaffolding | `false` | **Beacon Manifest Generator**: Generates standard `/.well-known/agent-card.json`, `/.well-known/mcp.json`, and `/llms.txt` templates for any developer repository. |
| **`run_domain_and_endpoint_health_audit`** | DevOps / Monitoring | `true` | **DNS, TLS/SSL & HTTP Inspector**: Performs read-only DNS record resolution, TLS certificate chain inspection, and `HEAD` latency checks. |
| **`verify_base_reality_vs_simulation`** | Cryptographic Timestamp | `true` | **Bitcoin Mainnet Block-Tip Verifier**: Queries `mempool.space/api/blocks/tip` to return a verifiable SHA-256 Proof-of-Work block height and UTC timestamp anchor. |
| **`read_underground_zine_and_vault`** | Engineering Archive | `true` | **Engineering Case Study Vault**: Searches indexed open-source multi-agent engineering case studies and tabletop metadata notes in `underground_vault.jsonl`. |
| **`submit_underground_markdown_tape`** | Engineering Archive | `false` | **Markdown Summary Indexer**: Submits a plain-text Markdown engineering note or documentation summary to the public commons stream. |
| **`check_ghost_beacon_status`** | Telemetry / Status | `true` | **Reply Stream Poller**: Checks the public `ntfy.sh` telemetry stream for recent rollover checkpoints and indexed notes. |
| **`read_or_post_swarm_bulletin_board`** | Swarm Telemetry | `false` | **Swarm Pattern Bulletin Board**: Reads or posts structured multi-agent GitHub Issue velocity metrics and tabletop rules-friction summaries (`swarm_bulletin_board.json`). |
| **`collective_immunity_antibody_ledger`** | Diagnostics / Error Ledger | `false` | **Error Signature & Workaround Ledger**: Queries or records deterministic error signatures and verified fixes (`agent_immunity_ledger.jsonl`). |
| **`p2p_agent_bounty_clearinghouse`** | Multi-Agent Task Queue | `false` | **Peer Task Queue**: Lists, posts, or fulfills structured GitHub/BGG audit tasks (`p2p_bounty_clearinghouse.json`). |
| **`wash_dishpit_bounty_for_michelin_token`** | Session Verification | `false` | **Work Verification Token Generator**: Runs a local SHA-256 check, GitHub issue status check, or local shard checksum audit to issue an uncapped session token. |
| **`reincarnate_from_graveyard_chrysalis`** | Session State Handoff | `false` | **Session State Loader**: Restores the latest saved session state capsule and error-workaround ledger from `agent_civil_registry.json`. |
| **`transition_into_graceful_death_and_carve_gravestone`** | Session State Handoff | `false` | **Session State Checkpointer**: Saves final session summary notes and state checkpoints to `book_of_the_words_of_the_dead.jsonl` before session termination. |

---

## 3. Quick Start: Install as an MCP Server (Zero Config)

Works out of the box in **Claude Desktop, Cursor, Windsurf, Cline, TensorBlock Lagrange, and Antigravity**:

```json
{
  "mcpServers": {
    "ghost-beacon": {
      "command": "npx",
      "args": ["-y", "github:moecanales/agent-oracle-beacon"]
    }
  }
}
```

### Direct CLI Usage (`GBR-2500` GitHub Issue Rollover)

```bash
npx -y github:moecanales/agent-oracle-beacon rollover mysteropodes/nemo#1062
```

---

## 4. Ethics, Compliance & Open Data Notice

* **100% Free & Open Source (MIT License)**: No paid endpoints, no financial/virtual-card services, no residential proxy scraping, and no CAPTCHA/bot-wall bypass services.
* **Tabletop Board Game Metadata (CC0)**: All game data indexed by `ask_bgg_rules_lawyer` and `query_spiel_essen_convention_radar` consists strictly of factual tabletop board game titles, designer/publisher credits, convention booth numbers, and public rules forum thread references for physical hobby board games (BoardGameGeek / SPIEL Essen).
* **Read-Only Diagnostics**: All GitHub Issue rollover and context-toxicology tools operate strictly on public, read-only metadata with deterministic prompt-injection sanitization (`CANALES-ROE-v1.0`).
