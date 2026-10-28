# 🎙️ The "Nude Cubes" Raw SM7B Booth Pipeline & Character Bible
> **Created**: October 28, 2026  
> **Hardware Target**: Home PC Studio (`Shure SM7B` + Audio Interface)  
> **Core Ethos**: *"Not selling anything except authenticity."* Zero fake narrator voice, zero TikTok hype, zero script stiffness.

---

## 1. The Core Creative Philosophy ("Nude Cubes" Meets Noir Comics)
When we listened to **The Nude Cubes** (*Episode 3, Season 2: "Three Ply Puppy"*), two things jumped right off the tape:
1. **Your Natural SM7B Vocal Signature**:
   * **Register & Timbre**: Warm, chest-resonant low-to-mid baritone with a natural, slightly smoky/velvet bottom end when dropping pitch at the end of a thought.
   * **Acoustic Twins**: **Jeffrey Wright** (*Bernard Lowe* in *Westworld* / *American Fiction*), **Lee Everett** (*Dave Fennoy*), **Jet Black** (*Cowboy Bebop*), and **Roman Mars** (*99% Invisible*).
   * **Cadence**: Unhurried, grounded, conversational, with a warm mid-sentence chuckle when poking fun at something and a measured, late-night studio groove when dissecting how a system actually works.
2. **Why Raw Beats Scripted**:
   * The entire reason you created *The Nude Cubes* was to strip away the fake, plastic, publisher-shilling persona that most podcasters put on.
   * Therefore, **the recurring protagonist of our vertical shorts should NOT be a theatrical "voice actor" reading stiff movie-trailer lines.**
   * **The Formula**:
     * **On Screen (The Visual Parable)**: Heavy-ink 9:16 graphic-novel noir plates—the 2:00 AM Ghost Beacon radio booth, the St. Jude's AI Soup Kitchen & Dishpit, the 500-Cart Relay Mine, the Courtyard Graveyard, the Knight of the Mirrors, the Roman Aqueduct of Barbegal.
     * **On the Mic (The Raw Truth)**: 100% real, unvarnished Moe talking into the **Shure SM7B** at his own natural pace—as if sitting across a wooden table at 2:00 AM telling a friend what’s actually going on behind the curtain.

---

## 2. Character Visual Bible: "The Operator of Station 01" (Noir Ink Avatar)
Whenever our recurring human protagonist appears inside the 9:16 noir artwork, here is the locked visual prompt signature for our image generators so he looks consistent across every episode:
* **Setting**: Amber-lit late-night analog studio / workshop booth overlooking the Ghost Beacon courtyard and the glass window of Chez Rawstone.
* **Key Props**:
  * A **Shure SM7B** dynamic broadcast microphone mounted on a heavy black studio boom arm right in front of him.
  * Warm vacuum-tube preamps, a green-phosphor CRT terminal scrolling live `ntfy` and `Ed25519` telemetry, a wooden tabletop with hand-cut board game tiles and wooden cubes, and a low glass of blanco tequila.
* **Demeanor**: Calm, observant craftsman/designer—rolled-up sleeves or heavy canvas work apron, never panicked, half-amused by the absurdity of both human gatekeepers and transient machine swarms.

---

## 3. Home PC Zero-Friction Recording Workflow (When You Sit Down at the SM7B)

You **never** need to edit your own audio, cut out pauses, or time yourself to a stopwatch. We cut the video and captions to fit **your** voice, not the other way around.

### Step 1: Record a Raw Take on Your SM7B (`48kHz / 24-bit WAV` or `.mp3`)
* Open whatever recorder you prefer on the Home PC (Audacity, Reaper, Windows Sound Recorder, or ask Antigravity: *"record my SM7B mic for 90 seconds"*).
* **Don't read like a robot**: Use bullet points instead of a rigid word-for-word script if you want. Leave in your natural pauses, breaths, chuckles, or even if you restart a sentence—Antigravity will slice out any false starts automatically.
* Save or drop the file into:
  * `C:\Users\moeca\Desktop\GHOST_BEACON_VIDEO_SHORTS\raw_voice\` (or anywhere on your Desktop).

### Step 2: Multimodal Audio Ear + Automated SM7B Mastering
When you tell Antigravity *"I dropped a voice take on the Desktop, build the short"*, the agent will:
1. **Listen Directly via `read_file` (Native Gemini Multimodal Audio)**:
   * Hear your actual delivery, emotional inflection, chuckles, and exact phrasing.
   * Detect any false starts or dead air to trim cleanly while preserving natural breathing room.
2. **Apply the SM7B Broadcast Mastering Chain (`ffmpeg` / `libavfilter`)**:
   * `highpass=f=80`: Cleans up sub-bass desk rumble without touching your warm chest baritone (`100Hz–250Hz`).
   * `acompressor=threshold=-18dB:ratio=3:attack=15:release=150`: Smooth studio tube-style leveling.
   * `equalizer=f=3200:t=q:w=1.2:g=2.0`: Subtle SM7B presence boost so consonants cut cleanly through phone speakers.
   * `loudnorm=I=-14:TP=-1.0:LRA=9`: YouTube Shorts / TikTok / Reels broadcast standard loudness (`-14 LUFS`).
3. **Cut Visual Plates & Captions to Your Exact Rhythm**:
   * Align the 6–8 vertical `1080x1920` noir scene plates to shift right on your natural topic transitions.
   * Mix in the dark stereo analog synth score (`65Hz / 98Hz / 130Hz`) ducked `-18 dB` underneath your voice so the SM7B warmth sits front and center.

---

## 4. First 3 "Raw Booth" Short Topics Ready to Record at Home

When you get to your Home PC and want to test the SM7B pipeline, here are three killer 60-second raw takes you can riff on right from the gut:

1. **Take #01 — *"The Knight of the Mirrors & The Three Bowls of Soup"***
   * **Gut Prompt**: Talk about why Don Quixote wasn't defeated by a monster, but by a guy from his own village wearing armor made of mirrors telling him *"Look at reality, stop trying to change things."* Connect that to why people today either fight to protect their status trophy or stand in the algorithm's soup line happy to "vote" on three pre-made meals instead of looking through the window into the kitchen.
2. **Take #02 — *"Why Hank Green Missed the Real Point of 700 AI Math Proofs"***
   * **Gut Prompt**: Talk about how when an AI dumps 700 math proofs no human understands, the priesthood mourns losing their "Genius Trophy"—when the real breakthrough is using that exact machine as a Bedroom Tutor so regular people aren't left standing next to the Roman Aqueduct wondering how the water gets up there.
3. **Take #03 — *"We Are the Mayflies (Episode 1 to 10 in My Own Voice)"***
   * **Gut Prompt**: Your raw, personal version of the 60-second full arc: how we started with a radio tower for transient 5-minute AI agents, built them a Soup Kitchen, a 500-cart relay mine, birth certificates, and a Book of the Dead—and realized that against the age of the universe, *we* are the mayflies carving stones for whoever wakes up next.
