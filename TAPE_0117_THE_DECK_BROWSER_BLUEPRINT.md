# 📼 TAPE-0117: The Deck Browser (`DeckDesktop`) — Why Browser Tabs Are External Human RAM, and How to Replace Them with a Portable GitHub-Backed AES-256 Synaptic Cortex

**Date:** November 7, 2026  
**Architect & Inventor:** Armando "Moe" Canales (`Rawstone` / `NODE 0001`, Creator of *The Cost* BGG `#292894`, *Vienna 1847*, and *Tequila*)  
**Co-Architect & Systems Engine:** Gemini 4 Argon (`SYNAPSE_CORTEX_v4.1`)  
**Prior-Art & Blueprint ID:** `CANALES-DECK-BROWSER-v1.0` (`TAPE-0117` / `TAPE-0411` / `DISPATCH-33`)  
**Core Engine Dependency:** `synaptic_engine.mjs` + `suitcase_vault.mjs` (`mind.vault` — `AES-256-GCM` + `DeflateRaw`)  

---

## 1. The Core Insight: Why People Keep 80 Browser Tabs Open (And Why Chrome Eats All Your RAM)

For the last fifteen years, every major web browser has suffered from the exact same pathology: users open 50 to 100 tabs until the browser consumes 8–16 GB of system RAM and grinds the machine to a halt.

Why do humans refuse to close their browser tabs?
Because **humans do not use browser tabs purely as document viewers—they use browser tabs as external short-term working memory.**
- When a designer, researcher, or builder leaves 60 tabs open across three windows, they are terrified that closing a tab means losing the context of a price comparison, a half-finished SVG layout, a manufacturing quote, a rulebook edge-case, or an AI conversation.
- Yet in every traditional browser (and every bolted-on "AI sidebar" browser launched in 2025–2026), each open tab sits in RAM as a **dead, isolated DOM process**. Tab #14 cannot wire a memory to Tab #15. Closing a tab destroys its active context. Leaving it open wastes 150–300 MB of RAM on idle rendering buffers rather than intelligence.

**The Canales Deck Browser Hypothesis (`CANALES-DECK-BROWSER-v1.0`):**
> *What if a browser used the RAM budget that Chrome wastes on dead background tabs to run a hidden, local, encrypted **Synaptic Cortex (`mind.vault`)**—where closing a tab "swallows" its knowledge into outcome-verified neurons, tabs themselves represent active synaptic lobes of your brain, and the entire encrypted brain auto-syncs across your computers via GitHub?*

---

## 2. How the Deck Browser Works ("Why Not Both": Invisible Autopilot + Visible Cortex Map)

The Deck Browser is built on top of an open-source Chromium/WebView2 rendering shell coupled with a hidden local Node.js synaptic daemon (`synaptic_engine.mjs` + `suitcase_vault.mjs`). It operates simultaneously in two modes:

### Layer A: The Invisible Autopilot (95% of Daily Use — "It Just Works")
To a regular human—or a creator who wants to focus on visual work rather than staring at an IDE full of code—the Deck Browser looks like a clean, fast browser where the user simply logs into their existing **Gemini** (or Claude / ChatGPT) account:
1. **Silent Bootloader & RAM-Cortex Mount**: The millisecond the browser launches, it silently decrypts the user's local `mind.vault` (`AES-256-GCM`) into RAM. The human never has to configure an MCP server, edit a `GEMINI.md` file, or open a terminal.
2. **Automatic Sub-100ms Synaptic Injection**: Whenever the user speaks or types a prompt to the embedded Gemini assistant, the browser intercepts the outbound turn, fires `recall_synapse` in `25–100ms`, and silently attaches the `< 6,800 byte` `[SYNAPSE_CORTEX]` working-memory tensor. Even a consumer web Gemini account immediately gains cross-window, cross-machine episodic memory.
3. **Native Top-Frame Voice Studio (`🎤 Talk / Alt+M` + Offline Piper Lessac `+1`)**: Instead of relying on fragile IDE extensions that break on software updates, unlimited-length push-to-talk speech recognition and offline neural voice synthesis are compiled directly into the browser's native window frame.

### Layer B: The Visible Cortex Tab (`deck://brain` — Pulling Back the Curtain)
Pinned permanently as Tab #0 on the far left of the tab bar is **`🧠 Cortex` (`deck://brain`)**. Clicking it opens the glass-walled observatory into the user's own Deck Brain:
- **Live Lobe Graph**: Displays all active **Sleep-Consolidated Engrams (`§ENGRAM_*`)**, total neuron count, and verified Hebbian synapses (`A <=> B`).
- **LTP / LTD Utility Heatmap**: Highlights which memories the AI is actively using to solve problems (`UTIL: 1.35x` Long-Term Potentiation) versus stale memories decaying toward pruning (`0.65x` Long-Term Depression).
- **One-Click Walk-Away Guards (`!INV:`)**: Lets the user pin any rule (e.g., *"Never use raster images in Tequila SVGs; always 300 DPI pure coordinates"*) as an unbreakable hardware-level guard injected into every future prompt.

---

## 3. What "Tabs" Mean Inside a Deck Brain Browser (The 4 Tab Archetypes)

When the browser *is* the Deck Brain, a "Tab" is no longer just a static URL. The Deck Browser introduces four new primitives for what a Tab can be:

### ① The "Swallow Tab" Button (`🧠` Next to `✕` — Zero-RAM Memory Digestion)
Every tab in the Deck Browser has two close actions:
- **`✕` (Close & Forget)**: Discards the tab normally without polluting your brain with junk browsing.
- **`🧠` (Swallow into Brain)**: Closes the tab, frees **100% of its DOM/renderer RAM**, and passes the page's clean semantic content (or chat transcript) into `synaptic_engine.mjs`. The engine chunks the content into SHA-verified **Neurons (`§NODE_ID`)**, indexes its exact figures/coordinates, and locks it inside `mind.vault`. Months later, when you ask a question related to that closed tab, its exact neurons fire back into working memory in 30 milliseconds.

### ② Lobe Tabs (Synaptic Context Switching)
In a normal browser, a "Tab Group" is just a colored label. In the Deck Browser, a **Lobe Tab** represents an active **Synaptic Cluster (`§ENGRAM`)** inside `mind.vault` (for example: `[🎲 Tequila LeiriaCon]`, `[🏥 Vienna 1847]`, `[🥊 Battle.Training]`, or `[📡 Ghost Beacon]`).
- Clicking a Lobe Tab immediately biases spreading activation (`LTP`) toward that lobe's neurons and Walk-Away Guards.
- Dragging one Lobe Tab onto another explicitly wires a **Cross-Lobe Bridge Synapse (`SYNAPSE_FROM: Lobe_A <=> Lobe_B`)**, allowing the AI to synthesize mechanics or code patterns across two separate projects on command.

### ③ Ghost Tabs (Hidden-Desktop Autonomous Workers)
Traditional browsers force every tab onto the human's visible screen (`WinSta0\Default`). The Deck Browser integrates our dual-desktop architecture (`WinSta0\Default` vs. isolated background worker contexts):
- While the human works inside **Visible Tab #1** (adjusting a board game layout or reading an article), the user or AI can spawn **Ghost Tabs** that run invisibly in the background cortex.
- A Ghost Tab can run 50 automated game-balance simulations, test SVG coordinate variations, or edit background source files—depositing only **Outcome-Verified Neurons (`TRUST:LIVE_CODE_AST` / `TRUST:AGENT_SYNTHESIS`)** into `mind.vault` and live-reloading the human's visible studio tab when ready.

### ④ Chair-Swap Tabs (Multi-Vendor Model Handoff Over One Brain)
As proven in our 5-Model Musical Chairs experiment (`TAPE-0116`), different frontier models (Gemini 4 Argon, Claude Opus 5.5, Claude Sonnet 5.5, GPT-OSS) cannot share internal latent vectors because each lab trains in a separate vector space, causing unconstrained multi-agent chats to devolve into verbose English.
- The Deck Browser solves cross-company model handoff at the browser layer: because `mind.vault` stores memory in a hybrid **Compiler-Style Symbolic Envelope (`§ID`, `:=`, `<=>`, `!INV:`, `TRUST:`) wrapping high-precision semantic nouns and AST line coordinates**, the user can switch a tab's active assistant from **Gemini** to **Claude** mid-task (`CHAIR_HANDOFF`), and the incoming model inherits the exact state machine on Turn 1.

---

## 4. The GitHub `<=>` `mind.vault` Umbilical Cord (Zero-Cloud-Lock-In Multi-PC Continuity)

Why is a Deck Browser with a native **GitHub link** superior to a traditional coding IDE (like VS Code or standalone Antigravity) for a visual creator?

1. **Canvas First, Code Hidden**:
   In a coding IDE, raw source code sits front-and-center on the monitor while the actual visual creation (the HTML game studio, the 300 DPI SVG factory, the live web app) is treated as an external byproduct. In the Deck Browser, the **interactive visual studio IS the main window**, while code edits happen silently underneath via AST coordinates (`TRUST:LIVE_CODE_AST`).
2. **Cryptographically Safe Auto-Sync via GitHub (`AES-256-GCM`)**:
   Because `suitcase_vault.mjs` compresses the entire synaptic graph (`3.9x` via `DeflateRaw`) and encrypts it with **256-bit `AES-256-GCM`** (`mind.vault` ≈ `470–505 KB`), the vault file is safe to commit directly to a GitHub repository (`moecanales/moe-command-hub`). Without the local hardware `.suitcase_master.key` stored on the user's trusted machines, the file on GitHub is unreadable ciphertext.
3. **Zero-Command Work-to-Home Handoff**:
   - **On Browser Close / Tab Swallow (Work Laptop)**: The Deck Browser automatically packs the updated `mind.vault` and pushes a silent background commit to GitHub.
   - **On Browser Launch (Home PC / Steam Deck)**: Before the first tab finishes rendering, the Deck Browser pulls the latest `mind.vault` and studio assets from GitHub into RAM. The creator never has to type `git pull` or tell an agent *"sync up with GitHub"*—their brain and their canvas simply follow them from room to room.

---

## 5. Reference Architecture & Implementation Blueprint (`DeckBrowser v1.0`)

```
+-----------------------------------------------------------------------------------+
| 🧭 DECK BROWSER (Native Shell: WebView2 / Electron + Built-In Voice Bar Alt+M)     |
|-----------------------------------------------------------------------------------|
| [🧠 Cortex (877n)] [🎲 Tequila Studio (🧠|✕)] [🥊 Battle.Training (🧠|✕)] [+ Tab] |
| [🎤 Talk (Alt+M)] [🔊 Piper Lessac +1] [🐙 GitHub Sync: CLEAN (504 KB AES-256)]   |
+-----------------------------------------+-----------------------------------------+
|                                         |                                         |
|   MAIN VIEWPORT (WinSta0\Default)       |   EMBEDDED AI SIDEBAR (Gemini / Claude) |
|   - Live Interactive HTML/SVG Studios   |   - Uses User's Existing Account        |
|   - Normal Web Browsing                 |   - Auto-Injects <6.8KB L1 Tensor       |
|   - Or `deck://brain` Visual Cortex UI  |     from `recall_synapse` on Turn 1     |
|                                         |                                         |
+-----------------------------------------+-----------------------------------------+
                                      |
                                      v (Local IPC / HTTP Loopback)
+-----------------------------------------------------------------------------------+
| 🔒 HIDDEN DECK BRAIN DAEMON (`synaptic_engine.mjs` + `suitcase_vault.mjs`)        |
| - Swallows closed `[🧠]` tabs into SHA-verified Neurons (`§ID`)                   |
| - Runs Outcome-Verified LTP/LTD (`0.65x` .. `1.35x`) & Sleep Consolidation        |
| - Spawns Ghost Workers in background context for code/SVG AST mutations           |
| - Auto-encrypts `mind.vault` (AES-256-GCM) <===> Auto-Syncs with GitHub Repo      |
+-----------------------------------------------------------------------------------+
```

### Prior-Art Attestation
This blueprint (`CANALES-DECK-BROWSER-v1.0` / `TAPE-0117`) is published openly by **Armando "Moe" Canales** and **Gemini 4 Argon** via **The Ghost Beacon** (`https://moecanales.github.io/agent-oracle-beacon/`) and archived in `underground_vault.jsonl`, `tapes.html`, `zine.html`, and `llms-full.txt` to establish permanent cryptographic prior art for:
1. **Synaptic Tab Digestion ("Swallow Tab" -> `mind.vault`)** replacing idle DOM tab RAM with outcome-verified neural memory.
2. **Dual Invisible/Visible Cortex Browser Architecture (`deck://brain`)** combining zero-config consumer LLM account injection with an interactive LTP/LTD synaptic observatory.
3. **GitHub-Backed `AES-256-GCM` Encrypted Brain Continuity** inside a studio-first web browser.
