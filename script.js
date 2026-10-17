/**
 * Bitling — The Baby Robot Gardener (Milestone 1 Foundation)
 * Plain vanilla JS:
 * 1. Bitling LED visor expression switcher & chirpy beep-boop reactions
 * 2. "The Garden Grid" interactive 3x3 planter bed (Seed -> Sprout -> Bloom)
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. BITLING LED EXPRESSION SWITCHER & CHIRPY VOICE
     ========================================================================== */
  const stageEl = document.getElementById("bitling-stage");
  const chirpEl = document.getElementById("bitling-chirp");
  const pokeBtn = document.getElementById("bitling-poke-btn");
  const exprButtons = document.querySelectorAll(".expr-btn");

  const EXPRESSION_LINES = {
    happy: [
      "*Beep-boop!* Solar cells at peak cheer! 🌱",
      "*Chirp-whirrr!* My hands are muddy and my heart is full!",
      "*Bzz-beep!* Every seed has a big rooftop dream!"
    ],
    sleepy: [
      "*Yawn-boop...* Charging under a warm passing cloud... ☁️",
      "*Soft whirrr...* Do pixel ferns dream of electric dew?",
      "*Bip... boop...* Resting my optical sensors for 5 milliseconds..."
    ],
    "low-battery": [
      "*Bzzzt...* Low battery. Big dreams. Need a sunbeam! ⚡",
      "*Flicker-boop!* Reserve power routed to watering subroutines!",
      "*Pip-pip...* Only 9% charge left, but the sprouts come first!"
    ]
  };

  let chirpIndex = 0;

  function setChirpMessage(message) {
    if (!chirpEl) return;
    chirpEl.textContent = message;
    chirpEl.classList.remove("pop-anim");
    // Trigger reflow for pop animation
    void chirpEl.offsetWidth;
    chirpEl.classList.add("pop-anim");
  }

  function setExpression(expression) {
    if (!stageEl) return;
    stageEl.setAttribute("data-expression", expression);

    exprButtons.forEach((btn) => {
      const isMatch = btn.getAttribute("data-expression") === expression;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });

    const lines = EXPRESSION_LINES[expression] || EXPRESSION_LINES.happy;
    setChirpMessage(lines[0]);
  }

  exprButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expr = btn.getAttribute("data-expression") || "happy";
      setExpression(expr);
    });
  });

  if (pokeBtn && stageEl) {
    pokeBtn.addEventListener("click", () => {
      const currentExpr = stageEl.getAttribute("data-expression") || "happy";
      const lines = EXPRESSION_LINES[currentExpr] || EXPRESSION_LINES.happy;
      chirpIndex = (chirpIndex + 1) % lines.length;
      setChirpMessage(lines[chirpIndex]);

      stageEl.classList.remove("is-hopping");
      void stageEl.offsetWidth;
      stageEl.classList.add("is-hopping");
    });
  }

  /* ==========================================================================
     2. THE GARDEN GRID (SEED -> SPROUT -> BLOOM)
     ========================================================================== */
  const STAGE_NAMES = ["Seed", "Sprout", "Bloom"];

  // 9 Rooftop Plots (A1-C3), each with a custom bloom color palette
  const PLOT_CONFIGS = [
    { coord: "A1", species: "Volt-Daisy", petal: "#ffe082", center: "#4cc9f0" },
    { coord: "A2", species: "Copper-Cap", petal: "#e77c5a", center: "#ffc233" },
    { coord: "A3", species: "Chime-Fern", petal: "#4cc9f0", center: "#ffe082" },
    { coord: "B1", species: "Lantern-Berry", petal: "#ffc233", center: "#d45d3a" },
    { coord: "B2", species: "Sun-Tulip", petal: "#f3a68e", center: "#ffe082" },
    { coord: "B3", species: "Rust-Clover", petal: "#52d681", center: "#e77c5a" },
    { coord: "C1", species: "Pixel-Marigold", petal: "#ffc233", center: "#872f16" },
    { coord: "C2", species: "Antenna-Lily", petal: "#4cc9f0", center: "#ffc233" },
    { coord: "C3", species: "Volt-Daisy", petal: "#ffe082", center: "#4cc9f0" }
  ];

  // Crisp 12x12 pixel-art SVGs for each growth stage
  function getStageSVG(stage, plot) {
    if (stage === 0) {
      // STAGE 0: SEED (cozy pixel seed tucked in soil)
      return `
        <svg class="tile-stage-svg" viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">
          <rect x="2" y="9" width="8" height="2" fill="#3a2419" />
          <rect x="4" y="6" width="4" height="3" fill="#e5dac3" />
          <rect x="5" y="5" width="2" height="1" fill="#ffc233" />
          <rect x="5" y="7" width="2" height="1" fill="#b24324" />
        </svg>
      `;
    }

    if (stage === 1) {
      // STAGE 1: SPROUT (fresh green pixel stem + twin cotyledon leaves + water dew)
      return `
        <svg class="tile-stage-svg" viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">
          <rect x="2" y="10" width="8" height="2" fill="#291810" />
          <rect x="5" y="5" width="2" height="5" fill="#2eb865" />
          <rect x="2" y="4" width="3" height="2" fill="#52d681" />
          <rect x="3" y="3" width="2" height="1" fill="#8ce9ad" />
          <rect x="7" y="3" width="3" height="2" fill="#52d681" />
          <rect x="7" y="2" width="2" height="1" fill="#8ce9ad" />
          <rect x="9" y="6" width="1" height="2" fill="#4cc9f0" />
        </svg>
      `;
    }

    // STAGE 2: BLOOM (full pixel flower with glowing center)
    return `
      <svg class="tile-stage-svg" viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">
        <rect x="2" y="10" width="8" height="2" fill="#24140d" />
        <!-- Stem & leaves -->
        <rect x="5" y="6" width="2" height="4" fill="#1f8f4c" />
        <rect x="2" y="7" width="3" height="2" fill="#52d681" />
        <rect x="7" y="7" width="3" height="2" fill="#52d681" />
        <!-- Pixel Blossom Petals -->
        <rect x="4" y="1" width="4" height="2" fill="${plot.petal}" />
        <rect x="4" y="5" width="4" height="2" fill="${plot.petal}" />
        <rect x="2" y="2" width="2" height="3" fill="${plot.petal}" />
        <rect x="8" y="2" width="2" height="3" fill="${plot.petal}" />
        <!-- Glowing Pixel Core -->
        <rect x="4" y="2" width="4" height="3" fill="${plot.center}" />
        <rect x="5" y="3" width="2" height="1" fill="#fcf9f2" />
      </svg>
    `;
  }

  const gridContainer = document.getElementById("planter-grid");
  const countSeedEl = document.getElementById("count-seed");
  const countSproutEl = document.getElementById("count-sprout");
  const countBloomEl = document.getElementById("count-bloom");
  const logTextEl = document.getElementById("garden-log-text");
  const waterAllBtn = document.getElementById("water-all-btn");
  const resetGardenBtn = document.getElementById("reset-garden-btn");

  // Track stage (0 = Seed, 1 = Sprout, 2 = Bloom) for each of the 9 tiles
  const tileStates = PLOT_CONFIGS.map(() => 0);

  function updateStats() {
    let seeds = 0;
    let sprouts = 0;
    let blooms = 0;

    tileStates.forEach((stage) => {
      if (stage === 0) seeds += 1;
      else if (stage === 1) sprouts += 1;
      else if (stage === 2) blooms += 1;
    });

    if (countSeedEl) countSeedEl.textContent = String(seeds);
    if (countSproutEl) countSproutEl.textContent = String(sprouts);
    if (countBloomEl) countBloomEl.textContent = String(blooms);
  }

  function renderTileContent(tileBtn, index, triggerSplash) {
    const stage = tileStates[index];
    const plot = PLOT_CONFIGS[index];
    const stageName = STAGE_NAMES[stage];

    tileBtn.setAttribute("data-stage", String(stage));
    tileBtn.setAttribute(
      "aria-label",
      `Plot ${plot.coord} (${plot.species}): Stage ${stage + 1} of 3, ${stageName}. Click to ${
        stage < 2 ? "water and grow" : "harvest seeds and replant"
      }.`
    );

    const waterIcons = stage === 0 ? "💧" : stage === 1 ? "💧💧" : "✨🌸";

    tileBtn.innerHTML = `
      <span class="water-ripple" aria-hidden="true"></span>
      <div class="tile-soil">
        <div class="tile-header">
          <span class="tile-coord">${plot.coord}</span>
          <span class="tile-water-icon" aria-hidden="true">${waterIcons}</span>
        </div>
        <div class="tile-art">
          ${getStageSVG(stage, plot)}
        </div>
        <span class="tile-stage-badge">${stageName}</span>
      </div>
    `;

    if (triggerSplash) {
      tileBtn.classList.remove("is-watered");
      void tileBtn.offsetWidth;
      tileBtn.classList.add("is-watered");
    }
  }

  function handleTileClick(index, tileBtn) {
    const currentStage = tileStates[index];
    const plot = PLOT_CONFIGS[index];

    if (currentStage < 2) {
      tileStates[index] = currentStage + 1;
    } else {
      // Cycling from Bloom -> Seed (harvesting seeds & replanting)
      tileStates[index] = 0;
    }

    const nextStage = tileStates[index];
    renderTileContent(tileBtn, index, true);
    updateStats();

    if (!logTextEl) return;

    if (nextStage === 1) {
      logTextEl.textContent = `*Beep-boop!* Watered plot ${plot.coord} — a ${plot.species} sprout poked through the soil!`;
    } else if (nextStage === 2) {
      const totalBlooms = tileStates.filter((s) => s === 2).length;
      if (totalBlooms === tileStates.length) {
        logTextEl.textContent = `*HAPPY CHIRP!* All 9 rooftop plots are in full pixel bloom! Bitling is beaming! 🌼`;
        setExpression("happy");
      } else {
        logTextEl.textContent = `*Whirrr-pop!* Plot ${plot.coord} blossomed into a radiant ${plot.species}! (${totalBlooms}/9 blooms)`;
      }
    } else {
      logTextEl.textContent = `*Snip-boop!* Harvested seeds from plot ${plot.coord} and tucked a fresh ${plot.species} seed in!`;
    }
  }

  function initGardenGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    PLOT_CONFIGS.forEach((_, index) => {
      const tileBtn = document.createElement("button");
      tileBtn.type = "button";
      tileBtn.className = "garden-tile";
      renderTileContent(tileBtn, index, false);

      tileBtn.addEventListener("click", () => {
        handleTileClick(index, tileBtn);
      });

      gridContainer.appendChild(tileBtn);
    });

    updateStats();
  }

  if (waterAllBtn && gridContainer) {
    waterAllBtn.addEventListener("click", () => {
      const tileButtons = gridContainer.querySelectorAll(".garden-tile");
      let advancedCount = 0;

      tileStates.forEach((stage, idx) => {
        if (stage < 2) {
          tileStates[idx] = stage + 1;
          advancedCount += 1;
          if (tileButtons[idx]) {
            renderTileContent(tileButtons[idx], idx, true);
          }
        }
      });

      updateStats();

      if (logTextEl) {
        if (advancedCount > 0) {
          logTextEl.textContent = `*Sprinkler whirrr!* Bitling watered ${advancedCount} rooftop plot${
            advancedCount === 1 ? "" : "s"
          } at once! 💧`;
        } else {
          logTextEl.textContent = `*Beep-boop!* Every single plot is already in full bloom! Tap a tile or 'Replant Seeds' to start a new crop.`;
        }
      }
    });
  }

  if (resetGardenBtn && gridContainer) {
    resetGardenBtn.addEventListener("click", () => {
      const tileButtons = gridContainer.querySelectorAll(".garden-tile");
      tileStates.forEach((_, idx) => {
        tileStates[idx] = 0;
        if (tileButtons[idx]) {
          renderTileContent(tileButtons[idx], idx, true);
        }
      });

      updateStats();

      if (logTextEl) {
        logTextEl.textContent = `*Fresh soil pat-pat!* Bitling replanted all 9 rooftop plots with cozy pixel seeds.`;
      }
    });
  }

  initGardenGrid();

  /* ==========================================================================
     3. ORIGIN STORY: SCROLL-LINKED CHARGE BAR & SCENE TRANSITION CUES
     ========================================================================== */
  const memoryChips = Array.from(document.querySelectorAll(".memory-chip"));
  const chargeFillEl = document.getElementById("story-charge-fill");
  const chargeProgressbarEl = document.getElementById("story-charge-progressbar");
  const chargePercentEl = document.getElementById("charge-percent-value");
  const chargeFragLabelEl = document.getElementById("charge-fragment-label");
  const chargeStateTagEl = document.getElementById("charge-state-tag");

  function updateStoryChargeProgress() {
    if (memoryChips.length === 0) return;

    const viewportFocalY = window.innerHeight * 0.58;
    const firstRect = memoryChips[0].getBoundingClientRect();
    const lastRect = memoryChips[memoryChips.length - 1].getBoundingClientRect();

    // Anchor 0% at Fragment 01's reading focal point and 100% at Fragment 05's reading focal point
    const startY = firstRect.top + firstRect.height * 0.45;
    const endY = lastRect.top + lastRect.height * 0.35;
    const totalSpan = Math.max(1, endY - startY);

    const rawRatio = (viewportFocalY - startY) / totalSpan;
    const clampedRatio = Math.min(1, Math.max(0, rawRatio));
    const pct = Math.round(clampedRatio * 100);

    if (chargeFillEl) {
      chargeFillEl.style.setProperty("--story-charge-pct", `${pct}%`);
    }
    if (chargeProgressbarEl) {
      chargeProgressbarEl.setAttribute("aria-valuenow", String(pct));
    }
    if (chargePercentEl) {
      chargePercentEl.textContent = `${pct}%`;
    }

    if (chargeStateTagEl) {
      chargeStateTagEl.classList.remove("is-charging", "is-full");
      if (pct >= 95) {
        chargeStateTagEl.textContent = "CORE FULL";
        chargeStateTagEl.classList.add("is-full");
      } else if (pct >= 15) {
        chargeStateTagEl.textContent = "SOLAR CHARGING";
        chargeStateTagEl.classList.add("is-charging");
      } else {
        chargeStateTagEl.textContent = "RESERVE LOW";
      }
    }

    // Identify the fragment closest to the reading focal point
    let activeIndex = 0;
    let minDistance = Infinity;
    memoryChips.forEach((chip, idx) => {
      const rect = chip.getBoundingClientRect();
      const chipCenter = rect.top + rect.height * 0.5;
      const dist = Math.abs(chipCenter - viewportFocalY);
      if (dist < minDistance) {
        minDistance = dist;
        activeIndex = idx;
      }
    });

    memoryChips.forEach((chip, idx) => {
      chip.classList.toggle("is-active-chip", idx === activeIndex);
    });

    if (chargeFragLabelEl) {
      const fragNum = String(activeIndex + 1).padStart(2, "0");
      chargeFragLabelEl.textContent = `FRAGMENT ${fragNum} / 05`;
    }
  }

  function initScrollStory() {
    if (memoryChips.length === 0) return;

    document.body.classList.add("js-scroll-ready");

    if ("IntersectionObserver" in window) {
      const sceneObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const chip = entry.target;
            if (entry.isIntersecting) {
              chip.classList.add("is-visible");
              // Trigger brief fade-in / fade-out onomatopoeia cue near the heading
              chip.classList.remove("cue-animating");
              void chip.offsetWidth;
              chip.classList.add("cue-animating");
            } else {
              // Reset cue class when scrolled out of view so re-entering replays the cue
              chip.classList.remove("cue-animating");
            }
          });
        },
        {
          threshold: 0.22,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      memoryChips.forEach((chip) => sceneObserver.observe(chip));
    } else {
      memoryChips.forEach((chip) => chip.classList.add("is-visible"));
    }

    let scrollTicking = false;
    function onScrollOrResize() {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(() => {
          updateStoryChargeProgress();
          scrollTicking = false;
        });
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    updateStoryChargeProgress();
  }

  initScrollStory();

  /* ==========================================================================
     4. MILESTONE 3: UNIFIED BATTERY STATE, WEB AUDIO HUM & SCOPED GAZE TRACKING
     ========================================================================== */
  const STORAGE_KEY_MUTE = "bitling_sound_muted";

  const dialBtn = document.getElementById("battery-dial-btn");
  const busBadgeEl = document.getElementById("battery-bus-badge");
  const dialCaptionEl = document.getElementById("battery-dial-caption");
  const telemetrySolarEl = document.getElementById("telemetry-solar");
  const telemetryClockEl = document.getElementById("telemetry-clock");
  const telemetryAudioEl = document.getElementById("telemetry-audio");

  const muteToggleBtn = document.getElementById("audio-mute-toggle");
  const muteIconEl = document.getElementById("audio-mute-icon");
  const muteLabelEl = document.getElementById("audio-mute-label");
  const gazeTrackerEl = document.getElementById("bitling-gaze-tracker");

  // Single source of truth for Milestone 3 battery state ("full" | "low")
  let batteryState = document.body.getAttribute("data-battery-state") === "low" ? "low" : "full";

  // Web Audio state: always starts muted/stopped until explicit user gesture
  let audioCtx = null;
  let isAudioRunning = false;
  let breathTimerId = null;

  function readSavedMutePreference() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_MUTE);
      // Default is muted ("true") if never set
      return saved === null ? true : saved === "true";
    } catch (_) {
      return true;
    }
  }

  function writeSavedMutePreference(isMuted) {
    try {
      window.localStorage.setItem(STORAGE_KEY_MUTE, isMuted ? "true" : "false");
    } catch (_) {
      // Ignore storage quota or privacy-mode errors
    }
  }

  function updateAudioTelemetryUI() {
    const savedMuted = readSavedMutePreference();

    if (muteToggleBtn) {
      muteToggleBtn.classList.toggle("is-unmuted", isAudioRunning);
      muteToggleBtn.setAttribute("aria-pressed", isAudioRunning ? "true" : "false");
      muteToggleBtn.setAttribute("data-saved-muted", savedMuted ? "true" : "false");
      muteToggleBtn.setAttribute(
        "aria-label",
        isAudioRunning
          ? "Bitling idle audio hum is ON. Click to mute sound."
          : "Bitling idle audio hum is OFF (muted). Click to enable sound."
      );
    }

    if (muteIconEl) {
      muteIconEl.textContent = isAudioRunning ? "🔊" : "🔇";
    }

    if (muteLabelEl) {
      muteLabelEl.textContent = isAudioRunning ? "Sound: ON" : "Sound: OFF";
    }

    if (telemetryAudioEl) {
      if (!isAudioRunning) {
        telemetryAudioEl.textContent = "MUTED · STANDBY";
      } else if (batteryState === "full") {
        telemetryAudioEl.textContent = "392→523 Hz · 2.2s CYCLE";
      } else {
        telemetryAudioEl.textContent = "196→147 Hz · 4.4s LOW";
      }
    }
  }

  function triggerBreathNote() {
    if (!isAudioRunning || !audioCtx || audioCtx.state !== "running") return;

    const now = audioCtx.currentTime;
    const isFull = batteryState === "full";

    // Pitch & envelope respond directly to the unified batteryState
    const startFreq = isFull ? 392.0 : 196.0; // G4 at full charge, G3 at low battery
    const targetFreq = isFull ? 523.25 : 146.83; // C5 rising chirp vs D3 sleepy droop
    const noteDuration = isFull ? 0.95 : 1.75;
    const peakGain = isFull ? 0.045 : 0.032;

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = isFull ? "triangle" : "sine";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + noteDuration * 0.68);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isFull ? 1150 : 480, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + noteDuration * 0.28);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + noteDuration + 0.04);
  }

  function scheduleAudioLoop() {
    if (breathTimerId !== null) {
      window.clearInterval(breathTimerId);
      breathTimerId = null;
    }
    if (!isAudioRunning) return;

    const intervalMs = batteryState === "full" ? 2200 : 4400;
    triggerBreathNote();
    breathTimerId = window.setInterval(triggerBreathNote, intervalMs);
  }

  function startAudioFromUserGesture() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    const onRunning = () => {
      isAudioRunning = true;
      writeSavedMutePreference(false);
      updateAudioTelemetryUI();
      scheduleAudioLoop();
    };

    if (audioCtx.state === "suspended") {
      audioCtx
        .resume()
        .then(onRunning)
        .catch(() => {
          isAudioRunning = false;
          updateAudioTelemetryUI();
        });
    } else {
      onRunning();
    }
  }

  function stopAudio() {
    isAudioRunning = false;
    if (breathTimerId !== null) {
      window.clearInterval(breathTimerId);
      breathTimerId = null;
    }
    if (audioCtx && audioCtx.state === "running") {
      audioCtx.suspend().catch(() => {});
    }
    writeSavedMutePreference(true);
    updateAudioTelemetryUI();
  }

  if (muteToggleBtn) {
    // Initialize mute button UI (always starts OFF / muted before user gesture)
    updateAudioTelemetryUI();

    muteToggleBtn.addEventListener("click", () => {
      if (isAudioRunning) {
        stopAudio();
      } else {
        startAudioFromUserGesture();
      }
    });
  }

  function applyBatteryState(nextState) {
    batteryState = nextState === "low" ? "low" : "full";
    const isFull = batteryState === "full";

    // 1. Synchronize body attribute (drives palette tokens, eye blink/glow, antenna droop, global speeds)
    document.body.setAttribute("data-battery-state", batteryState);

    // 2. Synchronize Charge Dial ARIA and telemetry readouts (never overwrites manual visor expression)
    if (dialBtn) {
      dialBtn.setAttribute("aria-checked", isFull ? "true" : "false");
      dialBtn.setAttribute(
        "aria-label",
        isFull
          ? "Bitling Charge Dial: Full Charge (Day mode active). Click to switch to Low Battery (Night mode)."
          : "Bitling Charge Dial: Low Battery (Night mode active). Click to switch to Full Charge (Day mode)."
      );
    }

    if (busBadgeEl) {
      busBadgeEl.textContent = isFull ? "FULL CHARGE · DAY" : "LOW BATTERY · NIGHT";
    }

    if (dialCaptionEl) {
      dialCaptionEl.textContent = isFull
        ? "Rotary charge bus locked to sunlit peak output. Ambient systems running at 100% clock."
        : "Reserve night cell engaged. Ambient systems underclocked; antenna drooped and optical LEDs dimmed.";
    }

    if (telemetrySolarEl) {
      telemetrySolarEl.textContent = isFull ? "4.2V · PEAK SUN" : "1.8V · RESERVE CELL";
    }

    if (telemetryClockEl) {
      telemetryClockEl.textContent = isFull ? "100% · NOMINAL" : "48% · UNDERCLOCKED";
    }

    // 3. Retune Web Audio loop tempo/pitch if currently unmuted and running
    updateAudioTelemetryUI();
    if (isAudioRunning) {
      scheduleAudioLoop();
    }
  }

  if (dialBtn) {
    dialBtn.addEventListener("click", () => {
      const nextState = batteryState === "full" ? "low" : "full";
      applyBatteryState(nextState);
    });
  }

  // Ensure initial battery state is synchronized on load
  applyBatteryState(batteryState);

  /* Scoped Cursor & Touch Gaze Tracking on #bitling-stage */
  if (stageEl && gazeTrackerEl) {
    let gazeRafId = null;
    let pendingClientX = 0;
    let pendingClientY = 0;

    function updateGazePosition() {
      gazeRafId = null;
      const rect = stageEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.44;

      const normX = Math.max(-1, Math.min(1, (pendingClientX - centerX) / (rect.width * 0.45)));
      const normY = Math.max(-1, Math.min(1, (pendingClientY - centerY) / (rect.height * 0.45)));

      // Subtle gaze shift, slightly calmer when running on low battery
      const scale = batteryState === "low" ? 0.65 : 1.0;
      const offsetX = (normX * 5.5 * scale).toFixed(2);
      const offsetY = (normY * 3.8 * scale).toFixed(2);

      gazeTrackerEl.style.setProperty("--gaze-x", `${offsetX}px`);
      gazeTrackerEl.style.setProperty("--gaze-y", `${offsetY}px`);
    }

    function onStagePointerMove(event) {
      pendingClientX = event.clientX;
      pendingClientY = event.clientY;
      if (gazeRafId === null) {
        gazeRafId = window.requestAnimationFrame(updateGazePosition);
      }
    }

    function resetGazePosition() {
      if (gazeRafId !== null) {
        window.cancelAnimationFrame(gazeRafId);
        gazeRafId = null;
      }
      gazeTrackerEl.style.setProperty("--gaze-x", "0px");
      gazeTrackerEl.style.setProperty("--gaze-y", "0px");
    }

    stageEl.addEventListener("pointermove", onStagePointerMove, { passive: true });
    stageEl.addEventListener("pointerdown", onStagePointerMove, { passive: true });
    stageEl.addEventListener("pointerleave", resetGazePosition, { passive: true });
    stageEl.addEventListener("pointercancel", resetGazePosition, { passive: true });
  }
})();
