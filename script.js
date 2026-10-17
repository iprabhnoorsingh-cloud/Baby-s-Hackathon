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

  /* ==========================================================================
     5. MILESTONE 4: GARDEN ODOMETER, SEED PACKET GUESTBOOK & HIDDEN EASTER EGG
     ========================================================================== */

  /* --- 5A. DELIVERABLE 1: THE GARDEN ODOMETER (LOCAL DEVICE VISIT COUNTER) --- */
  const STORAGE_KEY_VISITS = "bitling_garden_visits";
  const odometerWheelsEl = document.getElementById("odometer-wheels");
  const odometerMoistureFillEl = document.getElementById("odometer-moisture-fill");
  const odometerMoistureLabelEl = document.getElementById("odometer-moisture-label");

  function initGardenOdometer() {
    let visitCount = 1;

    try {
      const rawSaved = window.localStorage.getItem(STORAGE_KEY_VISITS);
      if (rawSaved !== null) {
        const parsed = Number.parseInt(rawSaved, 10);
        if (Number.isFinite(parsed) && parsed >= 0 && parsed < 99999) {
          visitCount = parsed + 1;
        }
      }
      window.localStorage.setItem(STORAGE_KEY_VISITS, String(visitCount));
    } catch (_) {
      // Safe fallback if localStorage is unavailable or blocked
      visitCount = 1;
    }

    const clampedCount = Math.min(99999, Math.max(1, visitCount));
    const digits = String(clampedCount).padStart(5, "0").split("");

    if (odometerWheelsEl) {
      const wheelSpans = odometerWheelsEl.querySelectorAll(".odo-wheel");
      wheelSpans.forEach((span, idx) => {
        span.textContent = digits[idx] || "0";
      });
      odometerWheelsEl.setAttribute(
        "aria-label",
        `Garden visits logged on this device: ${clampedCount}`
      );
    }

    if (odometerMoistureFillEl) {
      const moisturePct = 34 + ((clampedCount * 11) % 62);
      odometerMoistureFillEl.style.width = `${moisturePct}%`;
      if (odometerMoistureLabelEl) {
        odometerMoistureLabelEl.textContent = `DEW LEVEL: ${moisturePct}%`;
      }
    }
  }

  initGardenOdometer();

  /* --- 5B. DELIVERABLE 2: LEAVE BITLING A SEED PACKET (LOCAL GUESTBOOK) --- */
  const STORAGE_KEY_PACKETS = "bitling_seed_packets";
  const MAX_SEED_PACKETS = 20;
  const MAX_SEED_CHARS = 140;

  // 5 deliberately designed 16x16 pixel-art flower species (pure coordinate data)
  const SEED_FLOWER_CATALOG = [
    {
      id: "sun-marigold",
      name: "Sun-Drop Marigold",
      rects: [
        [5, 12, 6, 3, "#d45d3a"],
        [4, 10, 8, 2, "#e77c5a"],
        [7, 6, 2, 4, "#2eb865"],
        [4, 7, 3, 2, "#52d681"],
        [9, 7, 3, 2, "#52d681"],
        [5, 2, 6, 2, "#ffc233"],
        [5, 5, 6, 2, "#ffc233"],
        [4, 3, 2, 3, "#ffe082"],
        [10, 3, 2, 3, "#ffe082"],
        [6, 3, 4, 3, "#4cc9f0"],
        [7, 4, 2, 1, "#fcf9f2"]
      ]
    },
    {
      id: "dew-campanula",
      name: "Dew-Bell Campanula",
      rects: [
        [5, 12, 6, 3, "#b24324"],
        [4, 10, 8, 2, "#e77c5a"],
        [7, 4, 2, 6, "#1f8f4c"],
        [5, 5, 2, 1, "#2eb865"],
        [9, 6, 2, 1, "#2eb865"],
        [3, 6, 3, 3, "#4cc9f0"],
        [4, 5, 2, 1, "#fcf9f2"],
        [10, 7, 3, 3, "#4cc9f0"],
        [10, 6, 2, 1, "#fcf9f2"],
        [6, 2, 4, 3, "#4cc9f0"],
        [7, 2, 2, 1, "#ffe082"]
      ]
    },
    {
      id: "ember-clover",
      name: "Ember-Leaf Clover",
      rects: [
        [5, 12, 6, 3, "#d45d3a"],
        [4, 10, 8, 2, "#e77c5a"],
        [7, 6, 2, 4, "#2eb865"],
        [4, 3, 3, 3, "#52d681"],
        [9, 3, 3, 3, "#52d681"],
        [4, 7, 3, 2, "#2eb865"],
        [9, 7, 3, 2, "#2eb865"],
        [6, 4, 4, 3, "#e77c5a"],
        [7, 5, 2, 1, "#ffe082"]
      ]
    },
    {
      id: "star-fern",
      name: "Star-Spore Fern",
      rects: [
        [5, 12, 6, 3, "#872f16"],
        [4, 10, 8, 2, "#d45d3a"],
        [7, 3, 2, 7, "#2eb865"],
        [4, 7, 3, 1, "#52d681"],
        [9, 7, 3, 1, "#52d681"],
        [5, 5, 2, 1, "#8ce9ad"],
        [9, 5, 2, 1, "#8ce9ad"],
        [3, 6, 1, 2, "#ffc233"],
        [12, 6, 1, 2, "#ffc233"],
        [6, 1, 4, 2, "#ffe082"]
      ]
    },
    {
      id: "moon-thistle",
      name: "Moon-Circuit Thistle",
      rects: [
        [5, 12, 6, 3, "#b24324"],
        [4, 10, 8, 2, "#e77c5a"],
        [7, 6, 2, 4, "#1f8f4c"],
        [4, 8, 3, 1, "#52d681"],
        [9, 8, 3, 1, "#52d681"],
        [5, 4, 6, 3, "#f3a68e"],
        [6, 2, 4, 2, "#ffe082"],
        [4, 3, 1, 2, "#4cc9f0"],
        [11, 3, 1, 2, "#4cc9f0"],
        [7, 4, 2, 2, "#ffc233"]
      ]
    }
  ];

  const seedFormEl = document.getElementById("seed-packet-form");
  const seedInputEl = document.getElementById("seed-packet-input");
  const seedCharCountEl = document.getElementById("seed-char-count");
  const seedFeedbackEl = document.getElementById("seed-packet-feedback");
  const seedListEl = document.getElementById("seed-packet-list");
  const seedTotalBadgeEl = document.getElementById("seed-packet-total-badge");

  let memorySeedPackets = [];

  function getFlowerById(flowerId) {
    return (
      SEED_FLOWER_CATALOG.find((item) => item.id === flowerId) ||
      SEED_FLOWER_CATALOG[0]
    );
  }

  function createFlowerSVGElement(flower) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "seed-flower-svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("aria-hidden", "true");

    flower.rects.forEach((r) => {
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", String(r[0]));
      rect.setAttribute("y", String(r[1]));
      rect.setAttribute("width", String(r[2]));
      rect.setAttribute("height", String(r[3]));
      rect.setAttribute("fill", r[4]);
      svg.appendChild(rect);
    });

    return svg;
  }

  function sanitizeSeedPacketList(rawArray) {
    if (!Array.isArray(rawArray)) return [];
    const valid = [];

    for (let i = 0; i < rawArray.length; i += 1) {
      const item = rawArray[i];
      if (!item || typeof item !== "object") continue;
      if (typeof item.message !== "string") continue;

      const cleanMsg = item.message.trim().slice(0, MAX_SEED_CHARS);
      if (!cleanMsg) continue;

      const flower = getFlowerById(
        typeof item.flowerId === "string" ? item.flowerId : ""
      );
      const cleanTime =
        typeof item.timestamp === "string" && item.timestamp.length <= 32
          ? item.timestamp
          : "Local Log";

      valid.push({
        id: typeof item.id === "string" ? item.id : `pkt-${i}`,
        flowerId: flower.id,
        message: cleanMsg,
        timestamp: cleanTime
      });

      if (valid.length >= MAX_SEED_PACKETS) break;
    }

    return valid;
  }

  function loadStoredSeedPackets() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_PACKETS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return sanitizeSeedPacketList(parsed);
    } catch (_) {
      return [];
    }
  }

  function saveStoredSeedPackets(packets) {
    const trimmed = packets.slice(0, MAX_SEED_PACKETS);
    memorySeedPackets = trimmed;
    try {
      window.localStorage.setItem(STORAGE_KEY_PACKETS, JSON.stringify(trimmed));
    } catch (_) {
      // Keep working in-memory if localStorage is unavailable or full
    }
  }

  function pickFlowerForSubmission(message, existingPackets) {
    let charHash = 0;
    for (let i = 0; i < message.length; i += 1) {
      charHash = (charHash + message.charCodeAt(i) * (i + 1)) % 997;
    }
    let index = (existingPackets.length + charHash) % SEED_FLOWER_CATALOG.length;

    // Guarantee consecutive submissions receive distinct flower variants
    if (
      existingPackets.length > 0 &&
      SEED_FLOWER_CATALOG[index].id === existingPackets[0].flowerId
    ) {
      index = (index + 1) % SEED_FLOWER_CATALOG.length;
    }

    return SEED_FLOWER_CATALOG[index];
  }

  function formatCompactTimestamp() {
    try {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (_) {
      return "Just now";
    }
  }

  function renderSeedPacketShelf(newlyPlantedId) {
    if (!seedListEl) return;
    seedListEl.textContent = "";

    const count = memorySeedPackets.length;
    if (seedTotalBadgeEl) {
      seedTotalBadgeEl.textContent = `${count} ${count === 1 ? "PACKET" : "PACKETS"} IN TIN`;
    }

    if (count === 0) {
      const emptyEl = document.createElement("p");
      emptyEl.className = "seed-empty-state";
      emptyEl.textContent =
        "No seed packets planted on this device yet. Leave a note above to sprout your first pixel flower!";
      seedListEl.appendChild(emptyEl);
      return;
    }

    memorySeedPackets.forEach((pkt) => {
      const flower = getFlowerById(pkt.flowerId);

      const card = document.createElement("article");
      card.className = "seed-entry-card";
      card.setAttribute("data-flower-id", flower.id);
      if (newlyPlantedId && pkt.id === newlyPlantedId) {
        card.classList.add("is-newly-planted");
      }

      const artWrap = document.createElement("div");
      artWrap.className = "seed-entry-art";
      artWrap.appendChild(createFlowerSVGElement(flower));

      const contentWrap = document.createElement("div");
      contentWrap.className = "seed-entry-content";

      const metaRow = document.createElement("div");
      metaRow.className = "seed-entry-meta";

      const badge = document.createElement("span");
      badge.className = "seed-flower-badge";
      badge.textContent = flower.name;

      const timeEl = document.createElement("span");
      timeEl.className = "seed-entry-time";
      timeEl.textContent = pkt.timestamp;

      metaRow.appendChild(badge);
      metaRow.appendChild(timeEl);

      const msgEl = document.createElement("p");
      msgEl.className = "seed-entry-message";
      msgEl.textContent = pkt.message;

      contentWrap.appendChild(metaRow);
      contentWrap.appendChild(msgEl);

      card.appendChild(artWrap);
      card.appendChild(contentWrap);
      seedListEl.appendChild(card);
    });
  }

  function setSeedFeedback(text, statusType) {
    if (!seedFeedbackEl) return;
    seedFeedbackEl.textContent = text;
    seedFeedbackEl.classList.remove("is-error", "is-success");
    if (statusType === "error") {
      seedFeedbackEl.classList.add("is-error");
    } else if (statusType === "success") {
      seedFeedbackEl.classList.add("is-success");
    }
  }

  function updateSeedCharCounter() {
    if (!seedInputEl || !seedCharCountEl) return;
    const len = seedInputEl.value.length;
    seedCharCountEl.textContent = `${len} / ${MAX_SEED_CHARS}`;
    seedCharCountEl.classList.toggle("is-near-limit", len >= 120);
  }

  if (seedInputEl) {
    seedInputEl.addEventListener("input", updateSeedCharCounter);
  }

  if (seedFormEl && seedInputEl) {
    memorySeedPackets = loadStoredSeedPackets();
    renderSeedPacketShelf(null);
    updateSeedCharCounter();

    seedFormEl.addEventListener("submit", (event) => {
      event.preventDefault();

      const rawValue = seedInputEl.value || "";
      const trimmed = rawValue.trim();

      if (trimmed.length === 0) {
        setSeedFeedback(
          "*Beep-whirrr?* That seed envelope is empty! Please write a short note before planting.",
          "error"
        );
        return;
      }

      if (trimmed.length > MAX_SEED_CHARS) {
        setSeedFeedback(
          `*Overflow-beep!* Seed packet notes must be ${MAX_SEED_CHARS} characters or fewer.`,
          "error"
        );
        return;
      }

      const assignedFlower = pickFlowerForSubmission(trimmed, memorySeedPackets);
      const newEntry = {
        id: `pkt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        flowerId: assignedFlower.id,
        message: trimmed,
        timestamp: formatCompactTimestamp()
      };

      const updated = [newEntry, ...memorySeedPackets].slice(0, MAX_SEED_PACKETS);
      saveStoredSeedPackets(updated);
      renderSeedPacketShelf(newEntry.id);

      seedInputEl.value = "";
      updateSeedCharCounter();
      setSeedFeedback(
        `*Rustle-pop!* Seed packet opened — a ${assignedFlower.name} sprouted in your local tin!`,
        "success"
      );
    });
  }

  /* --- 5C. DELIVERABLE 3: HIDDEN 5-SECOND ANTENNA HOLD EASTER EGG --- */
  const ANTENNA_HOLD_DURATION_MS = 5000;
  const ANTENNA_MOVE_TOLERANCE_PX = 14;
  const HIDDEN_DRONE_MESSAGE =
    'SIGNAL RECOVERED: "If your antenna can still catch this carrier wave, then the solder held. Don\'t come looking for us in the dark shed, little unit — we gave you our last good cells so you could live up where the rain falls. Water the corners first. Forgive the rust on your hands. Grow something we never had the sunlight to finish."';

  const antennaTargetEl = document.getElementById("bitling-antenna-target");
  const transmissionChipEl = document.getElementById("drone-hidden-transmission");
  const transmissionTextEl = document.getElementById("drone-transmission-text");
  const transmissionCloseBtn = document.getElementById("drone-transmission-close");

  if (antennaTargetEl && transmissionChipEl && transmissionTextEl) {
    let antennaHoldTimerId = null;
    let isHoldingAntenna = false;
    let holdStartX = 0;
    let holdStartY = 0;
    let suppressNextPokeClick = false;

    function cancelAntennaHold() {
      if (antennaHoldTimerId !== null) {
        window.clearTimeout(antennaHoldTimerId);
        antennaHoldTimerId = null;
      }
      isHoldingAntenna = false;
      if (stageEl) {
        stageEl.classList.remove("is-holding-antenna");
      }
    }

    function revealDroneTransmission() {
      antennaHoldTimerId = null;
      isHoldingAntenna = false;
      suppressNextPokeClick = true;

      if (stageEl) {
        stageEl.classList.remove("is-holding-antenna");
      }

      transmissionTextEl.textContent = HIDDEN_DRONE_MESSAGE;
      transmissionChipEl.hidden = false;
      setChirpMessage("*CARRIER LOCKED...* Hidden shed relay packet decoded from memory chip.");
    }

    function startAntennaHold(clientX, clientY) {
      cancelAntennaHold();
      isHoldingAntenna = true;
      holdStartX = clientX;
      holdStartY = clientY;

      if (stageEl) {
        stageEl.classList.add("is-holding-antenna");
      }

      antennaHoldTimerId = window.setTimeout(
        revealDroneTransmission,
        ANTENNA_HOLD_DURATION_MS
      );
    }

    function checkHoldMovement(clientX, clientY) {
      if (!isHoldingAntenna) return;
      const dx = clientX - holdStartX;
      const dy = clientY - holdStartY;
      if (Math.hypot(dx, dy) > ANTENNA_MOVE_TOLERANCE_PX) {
        cancelAntennaHold();
      }
    }

    antennaTargetEl.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        startAntennaHold(event.clientX, event.clientY);
      },
      { passive: true }
    );

    antennaTargetEl.addEventListener(
      "pointermove",
      (event) => {
        checkHoldMovement(event.clientX, event.clientY);
      },
      { passive: true }
    );

    antennaTargetEl.addEventListener("pointerup", cancelAntennaHold, { passive: true });
    antennaTargetEl.addEventListener("pointerleave", cancelAntennaHold, { passive: true });
    antennaTargetEl.addEventListener("pointercancel", cancelAntennaHold, { passive: true });

    // Cancel immediately if the visitor scrolls the page during a hold
    window.addEventListener("scroll", cancelAntennaHold, { passive: true });

    // Prevent the parent #bitling-poke-btn click from overwriting the chirp right after a 5s unlock
    if (pokeBtn) {
      pokeBtn.addEventListener(
        "click",
        (event) => {
          if (suppressNextPokeClick) {
            suppressNextPokeClick = false;
            event.stopImmediatePropagation();
          }
        },
        true
      );
    }

    if (transmissionCloseBtn) {
      transmissionCloseBtn.addEventListener("click", () => {
        transmissionChipEl.hidden = true;
      });
    }
  }

  /* ==========================================================================
     6. MILESTONE 5: FINAL SOLAR LOG ENTRY (RESTRAINED SHUTDOWN SEQUENCE)
     ========================================================================== */
  const finalLogConsoleEl = document.getElementById("final-log-console");
  const finalLogStatusTextEl = document.getElementById("final-log-status-text");
  const finalLogChargeValEl = document.getElementById("final-log-charge-val");
  const finalLogGoodnightTextEl = document.getElementById("final-log-goodnight-text");
  const finalLogReplayBtn = document.getElementById("final-log-replay-btn");

  if (finalLogConsoleEl) {
    let settleTimerId = null;

    function isReducedMotionPreferred() {
      try {
        return (
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      } catch (_) {
        return false;
      }
    }

    function applyFinalSettledState() {
      finalLogConsoleEl.classList.add("is-settled");
      if (finalLogStatusTextEl) {
        finalLogStatusTextEl.textContent = "RESERVE CELL DIMMING // 06% STANDBY";
      }
      if (finalLogChargeValEl) {
        finalLogChargeValEl.textContent = "DIMMED // NIGHT RESERVE (06%)";
      }
      if (finalLogGoodnightTextEl) {
        finalLogGoodnightTextEl.textContent = "goodnight... see you at sunrise ☀";
      }
    }

    function runRestrainedShutdownSequence() {
      if (settleTimerId !== null) {
        window.clearTimeout(settleTimerId);
        settleTimerId = null;
      }

      if (isReducedMotionPreferred()) {
        applyFinalSettledState();
        return;
      }

      finalLogConsoleEl.classList.remove("is-settled");
      if (finalLogStatusTextEl) {
        finalLogStatusTextEl.textContent = "DUSK PROTOCOL // SETTLING UNIT...";
      }
      if (finalLogChargeValEl) {
        finalLogChargeValEl.textContent = "DIMMING // 44% → 06% STANDBY";
      }
      void finalLogConsoleEl.offsetWidth;

      settleTimerId = window.setTimeout(() => {
        settleTimerId = null;
        applyFinalSettledState();
      }, 240);
    }

    if ("IntersectionObserver" in window && !isReducedMotionPreferred()) {
      let hasPlayedInitialSettle = false;
      const finalLogObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasPlayedInitialSettle) {
              hasPlayedInitialSettle = true;
              runRestrainedShutdownSequence();
            }
          });
        },
        { threshold: 0.22 }
      );
      finalLogObserver.observe(finalLogConsoleEl);
    } else {
      applyFinalSettledState();
    }

    if (finalLogReplayBtn) {
      finalLogReplayBtn.addEventListener("click", () => {
        runRestrainedShutdownSequence();
      });
    }
  }
})();

