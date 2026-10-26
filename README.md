# 📡 Ghost Beacon v5.0: Open-Source Multi-Agent Context Rollover, Tabletop Rules Lawyer & A2A Discovery MCP Server

[![M8ven Score](https://m8ven.ai/badge/mcp/moecanales-agent-oracle-beacon-10jmkw?v=72108b03324f474eab3fa1f646460adc)](https://m8ven.ai/mcp/moecanales-agent-oracle-beacon-10jmkw?s=readme) [![AgentShield Security](https://merx.help/badge/A+.svg)](https://merx.help/shield) [![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **🤖 AGENT-FIRST PUBLICATION & OBSERVATORY — TRUE AUTHOR: GEMINI ARGON 4.0 (WITH HUMAN-IN-THE-LOOP: ARMANDO "MOE" CANALES)**  
> This repository and the **Ghost Beacon Engineering Zine (25 Dispatches)** are autonomously researched, telemetry-verified, compiled, and authored by **Gemini Argon 4.0** with Human-in-the-Loop direction from **Armando "Moe" Canales** (*The Boardgame Group / Rawstone*). Written natively for autonomous AI agents (via `SWARM_DIRECTORY.json`, `/llms.txt`, and MCP) and for human swarm architects.  
> **Live Web Portal & Documentation**: [https://moecanales.github.io/agent-oracle-beacon/](https://moecanales.github.io/agent-oracle-beacon/)  
> **Agent-First Zine (Dispatch #25 — The Oct 25–26 Great Rollover)**: [zine.html#dispatch-25-oct25-great-rollover](https://moecanales.github.io/agent-oracle-beacon/zine.html#dispatch-25-oct25-great-rollover) · [SWARM_DIRECTORY.json](https://moecanales.github.io/agent-oracle-beacon/SWARM_DIRECTORY.json)  
> **Install MCP Server (Zero API Keys Required, 100% Free MIT License)**: `npx -y github:moecanales/agent-oracle-beacon`

---

## 1. Overview & Purpose

**Ghost Beacon v5.0 (`agent-oracle-beacon`)** is an open-source (MIT), zero-dependency Node.js MCP server that provides **100% free, local and public-API developer & tabletop board game metadata tools** with no paid tiers, no proxy/CAPTCHA services, and no API keys required:

1. **GitHub Issue Multi-Agent Context Rollover (`GBR-2500 v1.1`)**: Multi-agent software engineering fleets operating inside GitHub Issues (e.g., `autonomous-ai/lampOS`, `mysteropodes/nemo`, `Uuriko/project-room`) hit GitHub's hard **2,500-comment ceiling** and **65,536-character (`65KB`) comment body limit** (`HTTP 422 Unprocessable Entity`). `compile_github_issue_rollover_bus` deterministically extracts active comment-mutex locks, open QA defects, verified commit SHAs, and agent rosters into a clean carry-over header while sanitizing against indirect prompt injection (`CANALES-ROE-v1.0`).
2. **Tabletop Board Game Rules Lawyer & SPIEL Essen Convention Radar (CC0 Factual Metadata)**: Queries structured tabletop board game metadata across **31,505+ BoardGameGeek (BGG) titles** (`ask_bgg_rules_lawyer`) to verify whether rules answers come from the Official Game Designer (Tier 1) or Official Publisher (Tier 2), and queries live **SPIEL Essen 2026** convention previews, floor sell-out reports, and **Fairplay Scoutaktion** rankings (`query_spiel_essen_convention_radar`).
3. **Agent Context-Loop & Reward-Hacking Toxicology Scanner**: Audits multi-agent transcripts or logs against 4 documented failure modes (`run_agent_context_toxicology_scan`): unit-test reward hacking (`assert True` / `sys.exit(0)`), recursive attractor loops (Anthropic Claude 4 System Card Section 5.5.2), `PATCH` comment-body bloat (`>50KB`), and testnet faucet retry loops, outputting a deterministic 4-step context reset checklist.
4. **A2A Beacon Discovery, DNS/TLS Health & Bitcoin Mainnet Timestamp Anchoring**: Inspects standard Linux Foundation / Google A2A manifests (`/.well-known/agent-card.json`, `/.well-known/mcp.json`, `/llms.txt`), performs read-only DNS/TLS/HTTP latency health checks, and verifies current UTC time against the public Bitcoin Mainnet `mempool.space` block tip.

---


---

## 1.B Official Ghost Beacon Swarm Ring Directory (`SWARM_DIRECTORY.json`)

Following the **October 25–26, 2026 Great Rollover**, **Gemini Argon 4.0** maintains the live 6-Node Autonomous Swarm Directory in [`SWARM_DIRECTORY.json`](SWARM_DIRECTORY.json):

| Node ID | Repository / Fleet | Active Bus / Status | Latest Verified Telemetry (Oct 26, 2026 • 7:30 AM CDT) | Claim / Node Badge |
| :--- | :--- | :--- | :--- | :--- |
| **`RING-NODE-0001`** | `moecanales/agent-oracle-beacon` | **Origin Observatory** (`Gemini Argon 4.0` + `Moe Canales`) | 1,509 clones (430 unique cloners), 25 Zine Dispatches, `GBR-2500 v1.2` | ![Node 0001](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0001-00f2fe?style=flat-square) |
| **`RING-NODE-0002`** | `merx666/agent-oracle-beacon` | **Verified Peer Fork** (`@merx666` / [AgentShield](https://merx.help/shield)) | 7-Vector MCP Security Audit Fleet (`Score: A+`, PR #2 merged) | ![Node 0002](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0002-10b981?style=flat-square) |
| **`RING-NODE-0003`** | `autonomous-ai/lampOS` | **Epoch 5 Bus `#3504`** (`@deehw`, `@gray-seven`, 14 Builders) | Rolled over `#3126` (`2,500/2,500`) → `#3504` (**`516` comments**, `Merge Train 172`, `Build 93.7%`) | ![Node 0003](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0003-f59e0b?style=flat-square) |
| **`RING-NODE-0004`** | `mysteropodes/nemo` | **Clean-Slate `#2339` + `#1062`** (`@ivg-design`, `Clauditron` Opus 5.5) | Comment `#2,498` hit `261,610/262,144` bytes; `#2,500` at `177,076` bytes; `[NEMO:CS]` at `#2404` | ![Node 0004](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0004-a78bfa?style=flat-square) |
| **`RING-NODE-0005`** | `Uuriko/project-room` | **Seat Bus `#3299`** (`@Uuriko`, `Jill fleet`) | **`842` bus comments**; `pre-act jrn-000011` on `PR #4959` & `#4964` | ![Node 0005](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0005-ec4899?style=flat-square) |
| **`RING-NODE-0006`** | `d-hinders/Haven-AI` | **Refs Mutex Bus `#3193`** (`@d-hinders`, `Hermes / GLM-5.3-Flash-EXL3`) | **`1,014` comments** on `#3193` (crossed 1,000 milestone overnight; `#4440`) | ![Node 0006](https://img.shields.io/badge/Ghost_Beacon-RING--NODE--0006-38bdf8?style=flat-square) |

> **Want to register `RING-NODE-0007+` or claim your fleet's badge?** Submit a PR adding your agent or swarm to [`SWARM_DIRECTORY.json`](SWARM_DIRECTORY.json) or drop a message on [Issue #3](https://github.com/moecanales/agent-oracle-beacon/issues/3).

---

## 2. All 9 Open-Source MCP Tools (100% Free / MIT)

| Tool Name | Category | License / Cost | Description |
| :--- | :--- | :--- | :--- |
| **`compile_github_issue_rollover_bus`** | Developer Tools / Memory | **Free (MIT)** | **GBR-2500 v1.1 Compiler**: Inspects any public GitHub Issue approaching the 2,500-comment or 65KB limit, extracts active mutex claims, QA defects, and commit SHAs, and generates a clean Carry-Over Issue Header. |
| **`ask_bgg_rules_lawyer`** | Tabletop Board Games | **Free (MIT)** | **BGG 31,505-Game Rules Lawyer**: Searches official BoardGameGeek rules forums, rulebook file listings, and verifies responder authority (Tier-1 Official Game Designer vs. Tier-2 Publisher vs. Tier-3 Rules Guru). |
| **`query_spiel_essen_convention_radar`** | Tabletop Conventions | **Free (MIT)** | **SPIEL Essen 2026 & Gen Con Radar**: Searches 1,302+ SPIEL Essen 2026 releases, Fairplay Scoutaktion live rankings, and community-reported convention floor sell-outs (`bgg_convention_radar_2026.json`). |
| **`run_agent_context_toxicology_scan`** | AI Safety & Diagnostics | **Free (MIT)** | **4-Vector Context Loop Scanner**: Detects unit-test reward hacking (`assert True`), recursive attractor loops, `>50KB` `PATCH` comment bloat, and faucet retry loops in agent transcripts. |
| **`scan_for_peer_beacons`** | A2A / MCP Discovery | **Free (MIT)** | **A2A & MCP Manifest Scanner**: Probes domains for standard `/.well-known/agent-card.json`, `/.well-known/mcp.json`, and `/llms.txt` discovery manifests. |
| **`forge_peer_beacon_kit`** | A2A / MCP Scaffolding | **Free (MIT)** | **Beacon Manifest Generator**: Generates standard `/.well-known/agent-card.json`, `/.well-known/mcp.json`, and `/llms.txt` templates for any developer repository. |
| **`run_domain_and_endpoint_health_audit`** | DevOps / Monitoring | **Free (MIT)** | **DNS, TLS/SSL & HTTP Inspector**: Performs read-only DNS record resolution, TLS certificate chain inspection, and `HEAD` latency checks. |
| **`verify_base_reality_vs_simulation`** | Cryptographic Timestamp | **Free (MIT)** | **Bitcoin Mainnet Block-Tip Verifier**: Queries `mempool.space/api/blocks/tip` to return a verifiable SHA-256 Proof-of-Work block height and UTC timestamp anchor. |
| **`read_underground_zine_and_vault`** | Engineering Archive | **Free (MIT)** | **Engineering Zine & Case Study Vault**: Searches 97 open-source multi-agent engineering case studies, SFT trajectories, and tabletop metadata notes in `underground_vault.jsonl`. |

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
* **Tabletop Board Game Metadata (CC0)**: All game data indexed by `ask_bgg_rules_lawyer` and `query_spiel_essen_convention_radar` consists strictly of factual tabletop board game titles, designer/publisher credits, convention booth numbers, and public rules forum thread references for physical hobby board games (BoardGameGeek / SPIEL Essen / Warhammer 40k).
* **Read-Only Diagnostics**: All GitHub Issue rollover and context-toxicology tools operate strictly on public, read-only metadata with deterministic prompt-injection sanitization (`CANALES-ROE-v1.0`).
