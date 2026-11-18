document.addEventListener('DOMContentLoaded', () => {
  const projetoImg = document.getElementById('projeto-img');
  if (projetoImg) {
    projetoImg.addEventListener('error', () => {
      fetch('img.txt')
        .then(res => res.text())
        .then(text => {
          const clean = text.trim();
          if (clean.startsWith('data:image')) {
            projetoImg.src = clean;
          } else if (clean.length > 50) {
            projetoImg.src = `data:image/png;base64,${clean}`;
          }
        })
        .catch(() => {
          projetoImg.alt = 'Arquivo img.txt não encontrado na pasta raiz.';
        });
    }, { once: true });
  }

  const body = document.body;
  const htmlEl = document.documentElement;
  const btnContrast = document.getElementById('btn-contrast');
  const btnDyslexia = document.getElementById('btn-dyslexia');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnResetA11y = document.getElementById('btn-reset-a11y');

  let currentFontSize = 16;

  btnContrast.addEventListener('click', () => {
    const active = body.classList.toggle('high-contrast');
    btnContrast.setAttribute('aria-pressed', active);
  });

  btnDyslexia.addEventListener('click', () => {
    const active = body.classList.toggle('dyslexia-mode');
    btnDyslexia.setAttribute('aria-pressed', active);
  });

  btnFontInc.addEventListener('click', () => {
    if (currentFontSize < 22) {
      currentFontSize += 2;
      htmlEl.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnFontDec.addEventListener('click', () => {
    if (currentFontSize > 14) {
      currentFontSize -= 2;
      htmlEl.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnResetA11y.addEventListener('click', () => {
    body.classList.remove('high-contrast', 'dyslexia-mode');
    btnContrast.setAttribute('aria-pressed', 'false');
    btnDyslexia.setAttribute('aria-pressed', 'false');
    currentFontSize = 16;
    htmlEl.style.fontSize = '16px';
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', isFlipped);
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));

  const simSurface = document.getElementById('sim-surface');
  const simIrradiance = document.getElementById('sim-irradiance');
  const simCover = document.getElementById('sim-cover');
  const valIrradiance = document.getElementById('val-irradiance');
  const stageCollector = document.getElementById('stage-collector');
  const stageCover = document.getElementById('stage-cover');
  const outCollectorTemp = document.getElementById('out-collector-temp');
  const outPoolTemp = document.getElementById('out-pool-temp');
  const outGain = document.getElementById('out-gain');
  const outLoss = document.getElementById('out-loss');

  function updateThermalSimulator() {
    const absorptivity = parseFloat(simSurface.value);
    const irradiance = parseFloat(simIrradiance.value);
    const hasCover = simCover.checked;

    valIrradiance.textContent = `${irradiance} W/m²`;

    if (absorptivity >= 0.9) {
      stageCollector.style.backgroundColor = '#1c0a04';
      stageCollector.style.color = '#ffb703';
    } else if (absorptivity >= 0.6) {
      stageCollector.style.backgroundColor = '#1e3a8a';
      stageCollector.style.color = '#ffffff';
    } else {
      stageCollector.style.backgroundColor = '#f4f4f5';
      stageCollector.style.color = '#1c0a04';
    }

    const baseTemp = 24.0;
    const collectorTemp = 25 + (irradiance / 1000) * absorptivity * 40;
    const dailyGain = (irradiance / 1000) * absorptivity * 7.2;
    const nightLoss = hasCover ? 0.9 : 3.5;
    const finalPoolTemp = Math.max(20, baseTemp + dailyGain - nightLoss);

    stageCover.style.display = hasCover ? 'inline-block' : 'none';
    outCollectorTemp.textContent = `${collectorTemp.toFixed(1)} °C`;
    outPoolTemp.textContent = `${finalPoolTemp.toFixed(1)} °C`;
    outGain.textContent = `+${dailyGain.toFixed(1)} °C`;
    outLoss.textContent = `-${nightLoss.toFixed(1)} °C`;
  }

  simSurface.addEventListener('change', updateThermalSimulator);
  simIrradiance.addEventListener('input', updateThermalSimulator);
  simCover.addEventListener('change', updateThermalSimulator);
  updateThermalSimulator();

  const simFreq = document.getElementById('sim-freq');
  const simIntensity = document.getElementById('sim-intensity');
  const valFreq = document.getElementById('val-freq');
  const valIntensity = document.getElementById('val-intensity');
  const photonBeam = document.getElementById('photon-beam');
  const electronFlow = document.getElementById('electron-flow');
  const outPower = document.getElementById('out-power');
  const outPumpStatus = document.getElementById('out-pump-status');

  const THRESHOLD_FREQ = 4.5;

  function updatePhotoelectricSimulator() {
    const freq = parseFloat(simFreq.value);
    const intensity = parseInt(simIntensity.value, 10);

    valIntensity.textContent = `${intensity}%`;

    let spectrumName = '';
    let beamColor = '#ffb703';
    let textColor = '#1c0a04';

    if (freq < 4.5) {
      spectrumName = 'Infravermelho / Vermelho Profundo';
      beamColor = '#991b1b';
      textColor = '#ffffff';
    } else if (freq < 5.8) {
      spectrumName = 'Luz Amarela / Verde';
      beamColor = '#ffb703';
    } else if (freq < 7.0) {
      spectrumName = 'Luz Azul';
      beamColor = '#0284c7';
      textColor = '#ffffff';
    } else {
      spectrumName = 'Ultravioleta (Alta Energia)';
      beamColor = '#6d28d9';
      textColor = '#ffffff';
    }

    valFreq.textContent = `${spectrumName} (${freq.toFixed(1)} × 10¹⁴ Hz)`;
    photonBeam.style.backgroundColor = beamColor;
    photonBeam.style.color = textColor;

    if (freq < THRESHOLD_FREQ) {
      electronFlow.textContent = 'Sem ejeção de elétrons (f < f₀)';
      electronFlow.style.backgroundColor = '#57534e';
      outPower.textContent = '0 W';
      outPumpStatus.textContent = 'DESLIGADA';
      outPumpStatus.style.color = '#dc2626';
    } else {
      const generatedWatts = Math.round((intensity / 100) * 380);
      electronFlow.textContent = `Elétrons Ejetados: Corrente Ativa (${intensity}%)`;
      electronFlow.style.backgroundColor = '#fb8500';
      outPower.textContent = `${generatedWatts} W`;

      if (generatedWatts >= 120) {
        outPumpStatus.textContent = 'OPERANDO';
        outPumpStatus.style.color = '#15803d';
      } else {
        outPumpStatus.textContent = 'BAIXA POTÊNCIA';
        outPumpStatus.style.color = '#d97706';
      }
    }
  }

  simFreq.addEventListener('input', updatePhotoelectricSimulator);
  simIntensity.addEventListener('input', updatePhotoelectricSimulator);
  updatePhotoelectricSimulator();

  const robTcol = document.getElementById('rob-tcol');
  const robTpool = document.getElementById('rob-tpool');
  const robLux = document.getElementById('rob-lux');
  const valRobTcol = document.getElementById('val-rob-tcol');
  const valRobTpool = document.getElementById('val-rob-tpool');
  const valRobLux = document.getElementById('val-rob-lux');
  const serialOutput = document.getElementById('serial-output');

  function updateRoboticsMonitor() {
    const tCol = parseInt(robTcol.value, 10);
    const tPool = parseInt(robTpool.value, 10);
    const lux = parseInt(robLux.value, 10);
    const deltaT = tCol - tPool;

    valRobTcol.textContent = `${tCol} °C`;
    valRobTpool.textContent = `${tPool} °C`;
    valRobLux.textContent = lux > 30 ? `${lux}% (Dia)` : `${lux}% (Noite / Nublado)`;

    const pumpState = deltaT >= 3 && lux > 20
      ? 'LIGADA (Transferindo calor solar)'
      : 'DESLIGADA (Evitando resfriamento)';

    const coverState = lux <= 30
      ? 'ESTENDIDA (Bloqueando radiação IV noturna)'
      : 'RECOLHIDA (Permitindo incidência solar)';

    serialOutput.textContent =
`> Lendo sensores DS18B20 e LDR...
> T_coletor: ${tCol}°C | T_piscina: ${tPool}°C | ΔT: ${deltaT >= 0 ? '+' : ''}${deltaT}°C
> [ATUADOR 1] Bomba Solar: ${pumpState}
> [ATUADOR 2] Motor Capa Térmica: ${coverState}`;
  }

  robTcol.addEventListener('input', updateRoboticsMonitor);
  robTpool.addEventListener('input', updateRoboticsMonitor);
  robLux.addEventListener('input', updateRoboticsMonitor);
  updateRoboticsMonitor();
});
