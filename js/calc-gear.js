/**
 * calc-gear.js — Governor Gear Calculator
 * KingshotPro | Phase 1
 *
 * [EST] = community-estimated. Verify at kingshotdata.com before relying on values.
 * Material names may vary by gear set — update when confirmed in-game.
 *
 * Cost structure per piece per level:
 * { satin, thread, vision, gems, other_mat, other_qty }
 * 'other_mat' is set-specific (e.g. hide for combat, ore for gathering)
 */

// ─────────────────────────────────────────
// GEAR DATA
// Costs per piece are approximate and shared across pieces at same level.
// In practice each piece has its own table — contribute verified data on GitHub.
// ─────────────────────────────────────────

const GEAR_LEVELS = 20; // typical max gear level — update when confirmed

const GEAR_SETS = {
  combat: {
    name: 'Combat Set',
    primaryMat: 'Hide',
    // [level, satin, thread, vision, hide, gems]  [EST]
    costs: [
      [1,   80,   60,  0,  40,   0],
      [2,  120,   90,  0,  60,   0],
      [3,  180,  135,  0,  90,   0],
      [4,  260,  200,  0, 130,   0],
      [5,  380,  285, 20, 190, 100],
      [6,  540,  400, 30, 270, 150],
      [7,  780,  580, 45, 390, 200],
      [8, 1100,  825, 65, 550, 300],
      [9, 1560, 1170, 90, 780, 420],
      [10,2200, 1650,125,1100, 600],
      // Levels 11-20: data collection in progress
    ],
    note: '[EST] Combat gear costs — verify in-game'
  },
  gathering: {
    name: 'Gathering Set',
    primaryMat: 'Ore',
    costs: [
      // Data collection in progress
    ],
    note: 'Data collection in progress for gathering set.'
  },
  construction: {
    name: 'Construction Set',
    primaryMat: 'Crystal',
    costs: [
      // Data collection in progress
    ],
    note: 'Data collection in progress for construction set.'
  }
};

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────

let currentSet = 'combat';

// ─────────────────────────────────────────
// SWITCH SET
// ─────────────────────────────────────────

function switchSet(el, set) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentSet = set;
  populateLevels();
  calculate();
}

// ─────────────────────────────────────────
// LEVEL SELECTS
// ─────────────────────────────────────────

function populateLevels() {
  const fromSel = document.getElementById('gear-from');
  const toSel   = document.getElementById('gear-to');

  fromSel.innerHTML = '';
  toSel.innerHTML   = '';

  for (let i = 0; i < GEAR_LEVELS; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i === 0 ? 'Unleveled (0)' : `Level ${i}`;
    fromSel.appendChild(opt);
  }

  for (let i = 1; i <= GEAR_LEVELS; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Level ${i}`;
    toSel.appendChild(opt);
  }

  fromSel.value = '0';
  toSel.value   = '5';

  fromSel.addEventListener('change', () => {
    const from = Number(fromSel.value);
    Array.from(toSel.options).forEach(o => {
      o.disabled = Number(o.value) <= from;
    });
    if (Number(toSel.value) <= from) toSel.value = from + 1;
    calculate();
  });
}

// ─────────────────────────────────────────
// CALCULATE
// ─────────────────────────────────────────

function calculate() {
  const fromLv = Number(document.getElementById('gear-from').value);
  const toLv   = Number(document.getElementById('gear-to').value);
  const setData = GEAR_SETS[currentSet];

  if (toLv <= fromLv) {
    showError('Target level must be greater than current level.');
    return;
  }

  const relevant = setData.costs.filter(row => row[0] >= fromLv && row[0] < toLv);

  if (relevant.length === 0) {
    showPending(setData);
    return;
  }

  let satin = 0, thread = 0, vision = 0, primary = 0, gems = 0;
  relevant.forEach(row => {
    satin   += row[1];
    thread  += row[2];
    vision  += row[3];
    primary += row[4];
    gems    += row[5];
  });

  const missing = (toLv - fromLv) - relevant.length;

  const area = document.getElementById('result-area');
  area.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-muted);">
      ${document.getElementById('gear-piece').options[document.getElementById('gear-piece').selectedIndex].text},
      Level ${fromLv} → ${toLv}
      ${missing > 0 ? `<span class="text-red"> · ${missing} level(s) missing data</span>` : ''}
    </div>
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">🧵 Satin</div>
        <div class="result-value">${fmtNum(satin)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">🪡 Thread</div>
        <div class="result-value">${fmtNum(thread)}</div>
      </div>
      ${vision > 0 ? `
      <div class="result-item">
        <div class="result-label">👁 Vision</div>
        <div class="result-value">${fmtNum(vision)}</div>
      </div>` : ''}
      <div class="result-item">
        <div class="result-label">${setData.primaryMat}</div>
        <div class="result-value">${fmtNum(primary)}</div>
      </div>
      ${gems > 0 ? `
      <div class="result-item">
        <div class="result-label">💎 Gems</div>
        <div class="result-value">${fmtNum(gems)}</div>
      </div>` : ''}
    </div>
    <p style="font-size:11px;color:var(--text-dim);margin-top:12px;">
      [EST] Values are per piece. Multiply by 6 for a full set upgrade.
    </p>
  `;
}

function showPending(setData) {
  document.getElementById('result-area').innerHTML = `
    <div class="alert alert-warn">
      <div>
        <strong>${setData.name} — data collection in progress</strong><br>
        <span style="font-size:13px;">${setData.note}<br><br>
        Visit <a href="https://kingshotdata.com" target="_blank" rel="noopener">kingshotdata.com</a>
        or <a href="https://github.com/growaleaf/kingshot-pro/issues" target="_blank" rel="noopener">contribute data on GitHub</a>.
        </span>
      </div>
    </div>
  `;
}

function showError(msg) {
  document.getElementById('result-area').innerHTML =
    `<div class="alert alert-error">${msg}</div>`;
}

function fmtNum(n) {
  if (n === 0) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
  populateLevels();
  calculate();
});
