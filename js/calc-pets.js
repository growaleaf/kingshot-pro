/**
 * calc-pets.js — Pet Upgrade Calculator
 * KingshotPro | Phase 1
 *
 * [EST] All costs are community-estimated. Verify in-game.
 * Cost structure varies by rarity — higher rarity pets cost more per level.
 * 'special_mat' is a rarity-specific material (varies by pet type).
 */

// ─────────────────────────────────────────
// PET DATA
// [level, pet_feed, special_mat]  [EST]
// ─────────────────────────────────────────

const PET_MAX_LEVEL = 30;

const PET_COSTS = {
  common: {
    name: 'Common',
    specialMat: 'Common Essence',
    costs: [
      [1,  100,  1], [2,  150,  1], [3,  200,  1], [4,  280,  2], [5,  380,  2],
      [6,  500,  2], [7,  650,  3], [8,  840,  3], [9, 1080,  3], [10,1380,  4],
      // Levels 11-30: data collection in progress
    ]
  },
  rare: {
    name: 'Rare',
    specialMat: 'Rare Essence',
    costs: [
      [1,  200,  1], [2,  300,  1], [3,  420,  2], [4,  580,  2], [5,  800,  2],
      [6, 1080,  3], [7, 1440,  3], [8, 1920,  4], [9, 2560,  4], [10,3400,  5],
    ]
  },
  epic: {
    name: 'Epic',
    specialMat: 'Epic Essence',
    costs: [
      [1,   500,  1], [2,   750,  2], [3,  1050,  2], [4,  1450,  3], [5,  2000,  3],
      [6,  2750,  4], [7,  3750,  5], [8,  5100,  6], [9,  6900,  7], [10, 9300,  8],
      [11,12500,  9], [12,16800, 10], [13,22500, 12], [14,30000, 14], [15,40000, 16],
      // Levels 16-30: data collection in progress
    ]
  },
  legendary: {
    name: 'Legendary',
    specialMat: 'Legendary Essence',
    costs: [
      [1,  1200,  2], [2,  1800,  3], [3,  2600,  4], [4,  3600,  5], [5,  5000,  6],
      [6,  7000,  8], [7,  9800, 10], [8, 13500, 12], [9, 18500, 15], [10,25000, 18],
    ]
  }
};

// ─────────────────────────────────────────
// LEVEL SELECTS
// ─────────────────────────────────────────

function populateLevels() {
  const fromSel = document.getElementById('pet-from');
  const toSel   = document.getElementById('pet-to');

  fromSel.innerHTML = '';
  toSel.innerHTML   = '';

  for (let i = 1; i < PET_MAX_LEVEL; i++) {
    const o = document.createElement('option');
    o.value = i; o.textContent = `Level ${i}`;
    fromSel.appendChild(o);
  }

  for (let i = 2; i <= PET_MAX_LEVEL; i++) {
    const o = document.createElement('option');
    o.value = i; o.textContent = `Level ${i}`;
    toSel.appendChild(o);
  }

  fromSel.value = '1';
  toSel.value   = '10';

  fromSel.addEventListener('change', () => {
    const from = Number(fromSel.value);
    Array.from(toSel.options).forEach(o => { o.disabled = Number(o.value) <= from; });
    if (Number(toSel.value) <= from) toSel.value = from + 1;
    calculate();
  });
}

// ─────────────────────────────────────────
// CALCULATE
// ─────────────────────────────────────────

function calculate() {
  const rarity = document.getElementById('pet-rarity').value;
  const fromLv = Number(document.getElementById('pet-from').value);
  const toLv   = Number(document.getElementById('pet-to').value);
  const data   = PET_COSTS[rarity];

  if (toLv <= fromLv) {
    document.getElementById('result-area').innerHTML =
      '<div class="alert alert-error">Target level must be greater than current level.</div>';
    return;
  }

  const relevant = data.costs.filter(row => row[0] >= fromLv && row[0] < toLv);
  const missing  = (toLv - fromLv) - relevant.length;

  let feed = 0, special = 0;
  relevant.forEach(row => { feed += row[1]; special += row[2]; });

  const area = document.getElementById('result-area');

  if (relevant.length === 0) {
    area.innerHTML = `
      <div class="alert alert-warn">
        <strong>Data collection in progress</strong><br>
        <span style="font-size:13px;">
          Pet costs for levels ${fromLv}–${toLv} (${data.name}) have not yet been verified.
          Visit <a href="https://kingshotdata.com" target="_blank" rel="noopener">kingshotdata.com</a>
          or <a href="https://github.com/growaleaf/kingshot-pro/issues" target="_blank" rel="noopener">contribute on GitHub</a>.
        </span>
      </div>`;
    document.getElementById('cost-table-wrap').classList.add('hidden');
    return;
  }

  area.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-muted);">
      ${data.name} pet · Level ${fromLv} → ${toLv}
      ${missing > 0 ? `<span class="text-red"> · ${missing} level(s) missing data</span>` : ''}
    </div>
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">🍗 Pet Feed</div>
        <div class="result-value">${fmtNum(feed)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">${data.specialMat}</div>
        <div class="result-value">${special.toLocaleString()}</div>
      </div>
      <div class="result-item" style="grid-column:1/-1;">
        <div class="result-label">Levels with verified data</div>
        <div class="result-value" style="font-size:16px;">${relevant.length} / ${toLv - fromLv}</div>
      </div>
    </div>
  `;

  // Level breakdown table
  const tbody = document.getElementById('cost-tbody');
  tbody.innerHTML = '';
  relevant.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row[0]} → ${row[0]+1}</td>
      <td>${fmtNum(row[1])}</td>
      <td>${row[2]}</td>
    `;
    tbody.appendChild(tr);
  });

  if (missing > 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="3" style="color:var(--text-dim);font-size:12px;text-align:center;">
        + ${missing} level(s) — data pending verification
      </td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById('cost-table-wrap').classList.remove('hidden');
}

function fmtNum(n) {
  if (n === 0) return '0';
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+'M';
  if (n >= 1_000)     return (n/1_000).toFixed(1)+'K';
  return n.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
  populateLevels();
  calculate();
});
