/**
 * calc-building.js — Building Upgrade Calculator
 * KingshotPro | Phase 1
 *
 * IMPORTANT: Resource cost tables below are marked with their verification status.
 * Values marked [EST] are community estimates — verify at kingshotdata.com.
 * Values marked [VERIFIED] have been confirmed in-game.
 * Update this file as data is confirmed. See SPEC.md for data policy.
 */

// ─────────────────────────────────────────
// DATA TABLES
// Each entry: [level, food, wood, stone, iron, gold, time_seconds]
// 0 values = data not yet collected for this level
// ─────────────────────────────────────────

const BUILDING_DATA = {

  castle: {
    name: 'Castle (Furnace)',
    maxLevel: 30,
    // [from_level, food, wood, stone, iron, gold, time_seconds]
    // Data collection in progress — contribute at github.com/growaleaf/kingshot-pro
    costs: [
      // [1,  0,      0,      0,     0,     0,    0],    // Lvl 1→2
      // TODO: populate from kingshotdata.com
    ],
    note: 'Data collection in progress. Contribute verified values on GitHub.'
  },

  academy: {
    name: 'War Academy',
    maxLevel: 30,
    costs: [],
    note: 'Data collection in progress.'
  },

  barracks: {
    name: 'Barracks',
    maxLevel: 30,
    costs: [],
    note: 'Data collection in progress.'
  },

  hospital: {
    name: 'Hospital',
    maxLevel: 30,
    costs: [],
    note: 'Data collection in progress.'
  },

  storehouse: {
    name: 'Storehouse',
    maxLevel: 30,
    costs: [],
    note: 'Data collection in progress.'
  },

};

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────

let currentBuilding = 'castle';

// ─────────────────────────────────────────
// TAB SWITCH
// ─────────────────────────────────────────

function switchTab(el, building) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentBuilding = building;
  populateLevelSelects();
  clearResults();
}

// ─────────────────────────────────────────
// LEVEL SELECTS
// ─────────────────────────────────────────

function populateLevelSelects() {
  const data    = BUILDING_DATA[currentBuilding];
  const maxLv   = data.maxLevel;
  const fromSel = document.getElementById('from-level');
  const toSel   = document.getElementById('to-level');

  fromSel.innerHTML = '';
  toSel.innerHTML   = '';

  for (let i = 1; i < maxLv; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Level ${i}`;
    fromSel.appendChild(opt);
  }

  fromSel.value = 1;

  for (let i = 2; i <= maxLv; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Level ${i}`;
    toSel.appendChild(opt);
  }

  toSel.value = Math.min(5, maxLv);

  // When from changes, ensure to > from
  fromSel.addEventListener('change', () => {
    const from = Number(fromSel.value);
    Array.from(toSel.options).forEach(o => {
      o.disabled = Number(o.value) <= from;
    });
    if (Number(toSel.value) <= from) {
      toSel.value = from + 1;
    }
  });
}

// ─────────────────────────────────────────
// CALCULATE
// ─────────────────────────────────────────

function calculate() {
  const fromLv = Number(document.getElementById('from-level').value);
  const toLv   = Number(document.getElementById('to-level').value);
  const buff   = Number(document.getElementById('buff-slider').value) / 100;
  const data   = BUILDING_DATA[currentBuilding];

  if (toLv <= fromLv) {
    showError('Target level must be greater than current level.');
    return;
  }

  // Collect costs for levels in range
  const relevant = data.costs.filter(
    row => row[0] >= fromLv && row[0] < toLv
  );

  if (relevant.length === 0) {
    showDataPending(data);
    return;
  }

  // Sum resources
  let food = 0, wood = 0, stone = 0, iron = 0, gold = 0, timeSec = 0;
  relevant.forEach(row => {
    food  += row[1];
    wood  += row[2];
    stone += row[3];
    iron  += row[4];
    gold  += row[5];
    timeSec += row[6];
  });

  // Apply construction buff to time
  const adjustedTime = timeSec / (1 + buff);

  renderResults({ food, wood, stone, iron, gold, timeSec: adjustedTime, fromLv, toLv, levelsFound: relevant.length });
}

// ─────────────────────────────────────────
// RESULT RENDERING
// ─────────────────────────────────────────

function renderResults({ food, wood, stone, iron, gold, timeSec, fromLv, toLv, levelsFound }) {
  const area = document.getElementById('result-area');

  const levels = toLv - fromLv;
  const missing = levels - levelsFound;

  area.innerHTML = `
    <div style="margin-bottom:16px;font-size:13px;color:var(--text-muted);">
      Levels ${fromLv} → ${toLv}
      ${missing > 0 ? `<span class="text-red"> · ${missing} level(s) missing data</span>` : ''}
    </div>
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">🍖 Food</div>
        <div class="result-value">${fmtNum(food)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">🪵 Wood</div>
        <div class="result-value">${fmtNum(wood)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">🪨 Stone</div>
        <div class="result-value">${fmtNum(stone)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">⚙️ Iron</div>
        <div class="result-value">${fmtNum(iron)}</div>
      </div>
      ${gold > 0 ? `
      <div class="result-item">
        <div class="result-label">💰 Gold</div>
        <div class="result-value">${fmtNum(gold)}</div>
      </div>` : ''}
      <div class="result-item">
        <div class="result-label">⏱️ Time</div>
        <div class="result-value">${fmtTime(timeSec)}</div>
      </div>
    </div>
  `;

  document.getElementById('data-notice').classList.remove('hidden');
}

function showDataPending(data) {
  const area = document.getElementById('result-area');
  area.innerHTML = `
    <div class="alert alert-warn">
      <div>
        <strong>Data collection in progress</strong><br>
        <span style="font-size:13px;">${data.name} upgrade costs are being verified from in-game sources.
        Want to help? Submit your building costs on
        <a href="https://github.com/growaleaf/kingshot-pro/issues" target="_blank" rel="noopener">GitHub</a>.
        </span>
      </div>
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-top:12px;">
      In the meantime, visit
      <a href="https://kingshotdata.com" target="_blank" rel="noopener">kingshotdata.com</a>
      or
      <a href="https://kingshotcalculator.com" target="_blank" rel="noopener">kingshotcalculator.com</a>
      for building cost data.
    </p>
  `;
  document.getElementById('data-notice').classList.add('hidden');
}

function showError(msg) {
  const area = document.getElementById('result-area');
  area.innerHTML = `<div class="alert alert-error">${msg}</div>`;
}

function clearResults() {
  document.getElementById('result-area').innerHTML =
    '<p class="result-placeholder">Select levels and click Calculate.</p>';
  document.getElementById('data-notice').classList.add('hidden');
}

// ─────────────────────────────────────────
// FORMATTING
// ─────────────────────────────────────────

function fmtNum(n) {
  if (n === 0) return '—';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function fmtTime(sec) {
  if (sec <= 0) return '—';
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  return parts.length ? parts.join(' ') : '<1m';
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  populateLevelSelects();

  // Show profile hint if a profile is stored
  const profile = window.KSP?.loadProfile?.();
  if (profile) {
    document.getElementById('profile-hint').classList.remove('hidden');
  }
});
