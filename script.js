document.addEventListener("DOMContentLoaded", () => {
  // 1. Acessibilidade CEP
  const body = document.body;
  const btnContrast = document.getElementById("btn-contrast");
  const btnDyslexia = document.getElementById("btn-dyslexia");
  const btnFontInc = document.getElementById("btn-font-inc");
  const btnFontDec = document.getElementById("btn-font-dec");
  const btnResetA11y = document.getElementById("btn-reset-a11y");
  let fontSizePercent = 100;

  btnContrast?.addEventListener("click", () => {
    const active = body.classList.toggle("high-contrast");
    btnContrast.setAttribute("aria-pressed", String(active));
  });

  btnDyslexia?.addEventListener("click", () => {
    const active = body.classList.toggle("dyslexia-mode");
    btnDyslexia.setAttribute("aria-pressed", String(active));
  });

  btnFontInc?.addEventListener("click", () => {
    if (fontSizePercent < 130) {
      fontSizePercent += 10;
      document.documentElement.style.fontSize = `${fontSizePercent}%`;
    }
  });

  btnFontDec?.addEventListener("click", () => {
    if (fontSizePercent > 80) {
      fontSizePercent -= 10;
      document.documentElement.style.fontSize = `${fontSizePercent}%`;
    }
  });

  btnResetA11y?.addEventListener("click", () => {
    body.classList.remove("high-contrast", "dyslexia-mode");
    btnContrast?.setAttribute("aria-pressed", "false");
    btnDyslexia?.setAttribute("aria-pressed", "false");
    fontSizePercent = 100;
    document.documentElement.style.fontSize = "100%";
  });

  // 2. Menu Mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // 3. Simulador 1: Corpo Negro & Capa Térmica
  const simSurface = document.getElementById("sim-surface");
  const simIrradiance = document.getElementById("sim-irradiance");
  const valIrradiance = document.getElementById("val-irradiance");
  const simCover = document.getElementById("sim-cover");
  const stageCollector = document.getElementById("stage-collector");
  const stageCover = document.getElementById("stage-cover");
  const outCollectorTemp = document.getElementById("out-collector-temp");
  const outPoolTemp = document.getElementById("out-pool-temp");
  const outGain = document.getElementById("out-gain");
  const outLoss = document.getElementById("out-loss");

  const surfaceColors = {
    "0.95": { bg: "#1c0a04", text: "#ffb703" },
    "0.65": { bg: "#1e3a8a", text: "#fef08a" },
    "0.20": { bg: "#e2e8f0", text: "#1f0d05" }
  };

  function updateSim1() {
    const abs = parseFloat(simSurface.value);
    const irr = parseFloat(simIrradiance.value);
    const hasCover = simCover.checked;

    valIrradiance.textContent = `${irr} W/m²`;

    const palette = surfaceColors[simSurface.value] || surfaceColors["0.95"];
    stageCollector.style.backgroundColor = palette.bg;
    stageCollector.style.color = palette.text;

    const collectorTemp = 24 + irr * abs * 0.0412;
    const gain = irr * abs * 0.0072;
    const loss = hasCover ? -0.9 : -3.6;
    const poolTemp = 24.9 + gain + loss;

    outCollectorTemp.textContent = `${collectorTemp.toFixed(1)} °C`;
    outPoolTemp.textContent = `${poolTemp.toFixed(1)} °C`;
    outGain.textContent = `+${gain.toFixed(1)} °C`;
    outLoss.textContent = `${loss.toFixed(1)} °C`;

    if (hasCover) {
      stageCover.textContent = "Capa Térmica Ativa (Retendo IV)";
      stageCover.style.backgroundColor = "#ffb703";
      stageCover.style.color = "#1c0a04";
    } else {
      stageCover.textContent = "Sem Capa Térmica (Perda Alta de IV)";
      stageCover.style.backgroundColor = "#dc2626";
      stageCover.style.color = "#ffffff";
    }
  }

  simSurface?.addEventListener("change", updateSim1);
  simIrradiance?.addEventListener("input", updateSim1);
  simCover?.addEventListener("change", updateSim1);

  // 4. Simulador 2: Efeito Fotoelétrico & Bomba
  const simFreq = document.getElementById("sim-freq");
  const simIntensity = document.getElementById("sim-intensity");
  const valIntensity = document.getElementById("val-intensity");
  const stagePhoton = document.getElementById("stage-photon");
  const stageElectron = document.getElementById("stage-electron");
  const outElectrons = document.getElementById("out-electrons");
  const outPower = document.getElementById("out-power");
  const outPump = document.getElementById("out-pump");
  const cutoffFreq = 4.5;

  const photonColors = {
    "4.3": { bg: "#ef4444", text: "#ffffff" },
    "5.5": { bg: "#22c55e", text: "#052e16" },
    "6.4": { bg: "#3b82f6", text: "#ffffff" },
    "7.5": { bg: "#8b5cf6", text: "#ffffff" }
  };

  function updateSim2() {
    const freq = parseFloat(simFreq.value);
    const intensity = parseInt(simIntensity.value, 10);

    valIntensity.textContent = `${intensity}%`;

    const color = photonColors[simFreq.value] || photonColors["6.4"];
    stagePhoton.style.backgroundColor = color.bg;
    stagePhoton.style.color = color.text;

    if (freq >= cutoffFreq && intensity > 0) {
      const power = Math.round(380 * (intensity / 100));
      outElectrons.textContent = "Corrente Ativa";
      stageElectron.style.backgroundColor = "#16a34a";
      outPower.textContent = `${power} W`;
      outPump.textContent = "OPERANDO";
    } else {
      outElectrons.textContent = freq < cutoffFreq ? "Bloqueado (f < f₀)" : "Sem Luz (0%)";
      stageElectron.style.backgroundColor = "#dc2626";
      outPower.textContent = "0 W";
      outPump.textContent = "DESLIGADA";
    }
  }

  simFreq?.addEventListener("change", updateSim2);
  simIntensity?.addEventListener("input", updateSim2);

  // 5. Flashcards Interativos
  document.querySelectorAll(".flashcard").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
  });

  // 6. Bancada Interativa ESP32
  const espTcol = document.getElementById("esp-tcol");
  const valEspTcol = document.getElementById("val-esp-tcol");
  const espTpool = document.getElementById("esp-tpool");
  const valEspTpool = document.getElementById("val-esp-tpool");
  const espLdr = document.getElementById("esp-ldr");
  const valEspLdr = document.getElementById("val-esp-ldr");
  const espSerialOutput = document.getElementById("esp-serial-output");

  function updateEsp32() {
    const tCol = parseFloat(espTcol.value);
    const tPool = parseFloat(espTpool.value);
    const ldr = parseInt(espLdr.value, 10);
    const deltaT = tCol - tPool;

    valEspTcol.textContent = `${tCol} °C`;
    valEspTpool.textContent = `${tPool} °C`;
    valEspLdr.textContent = `${ldr}%`;

    const pumpState = deltaT >= 3 ? "LIGADO (ΔT >= 3°C)" : "DESLIGADO (ΔT < 3°C)";
    const coverState = ldr < 25 ? "ESTENDIDA (Retendo IV Noturno)" : "RECOLHIDA (Período Diurno)";

    espSerialOutput.textContent =
      `[ESP32] Lendo sensores DS18B20 e LDR...\n` +
      `T_coletor: ${tCol.toFixed(1)} °C | T_piscina: ${tPool.toFixed(1)} °C | ΔT = ${deltaT >= 0 ? "+" : ""}${deltaT.toFixed(1)} °C\n` +
      `Luminosidade LDR: ${ldr}%\n` +
      `>> RELÉ BOMBA: ${pumpState}\n` +
      `>> MOTOR CAPA: ${coverState}`;
  }

  espTcol?.addEventListener("input", updateEsp32);
  espTpool?.addEventListener("input", updateEsp32);
  espLdr?.addEventListener("input", updateEsp32);

  // Inicializar valores
  if (simSurface) updateSim1();
  if (simFreq) updateSim2();
  if (espTcol) updateEsp32();
});
