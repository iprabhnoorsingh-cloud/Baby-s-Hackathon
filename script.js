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
})();
