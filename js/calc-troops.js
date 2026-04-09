/**
 * calc-troops.js — Troop Training Calculator
 * KingshotPro | Phase 1
 *
 * Data marked [EST] = community-estimated, verify in-game.
 * Data marked [VERIFIED] = confirmed from direct observation.
 *
 * Resource costs per single troop: [food, wood, stone, iron, time_seconds]
 * Event point defaults are adjustable by the user in the UI.
 */

// ─────────────────────────────────────────
// TROOP DATA
// per-troop cost: [food, wood, stone, iron, time_sec]
// ─────────────────────────────────────────

const TROOP_DATA = {
  infantry: {
    name: 'Infantry',
    tiers: {
      t1: { label: 'T1 Infantry', food: 80,   wood: 80,   stone: 0,    iron: 0,    timeSec: 12,   pts: { hog: 1,  kvk: 1,  tsg: 1  }, status: 'EST' },
      t2: { label: 'T2 Infantry', food: 150,  wood: 150,  stone: 60,   iron: 0,    timeSec: 45,   pts: { hog: 2,  kvk: 2,  tsg: 2  }, status: 'EST' },
      t3: { label: 'T3 Infantry', food: 400,  wood: 400,  stone: 200,  iron: 100,  timeSec: 180,  pts: { hog: 5,  kvk: 5,  tsg: 2  }, status: 'EST' },
      t4: { label: 'T4 Infantry', food: 1200, wood: 1200, stone: 600,  iron: 400,  timeSec: 600,  pts: { hog: 10, kvk: 10, tsg: 4  }, status: 'EST' },
      t5: { label: 'T5 Infantry', food: 3500, wood: 3500, stone: 2000, iron: 1500, timeSec: 1800, pts: { hog: 25, kvk: 25, tsg: 10 }, status: 'EST' },
    }
  },
  lancer: {
    name: 'Lancer',
    tiers: {
      t1: { label: 'T1 Lancer', food: 80,   wood: 0,    stone: 80,   iron: 0,    timeSec: 12,   pts: { hog: 1,  kvk: 1,  tsg: 1  }, status: 'EST' },
      t2: { label: 'T2 Lancer', food: 150,  wood: 60,   stone: 150,  iron: 0,    timeSec: 45,   pts: { hog: 2,  kvk: 2,  tsg: 2  }, status: 'EST' },
      t3: { label: 'T3 Lancer', food: 400,  wood: 100,  stone: 400,  iron: 200,  timeSec: 180,  pts: { hog: 5,  kvk: 5,  tsg: 2  }, status: 'EST' },
      t4: { label: 'T4 Lancer', food: 1200, wood: 400,  stone: 1200, iron: 600,  timeSec: 600,  pts: { hog: 10, kvk: 10, tsg: 4  }, status: 'EST' },
      t5: { label: 'T5 Lancer', food: 3500, wood: 1500, stone: 3500, iron: 2000, timeSec: 1800, pts: { hog: 25, kvk: 25, tsg: 10 }, status: 'EST' },
    }
  },
  marksman: {
    name: 'Marksman',
    tiers: {
      t1: { label: 'T1 Marksman', food: 80,   wood: 0,    stone: 0,    iron: 80,   timeSec: 12,   pts: { hog: 1,  kvk: 1,  tsg: 1  }, status: 'EST' },
      t2: { label: 'T2 Marksman', food: 150,  wood: 0,    stone: 60,   iron: 150,  timeSec: 45,   pts: { hog: 2,  kvk: 2,  tsg: 2  }, status: 'EST' },
      t3: { label: 'T3 Marksman', food: 400,  wood: 200,  stone: 100,  iron: 400,  timeSec: 180,  pts: { hog: 5,  kvk: 5,  tsg: 2  }, status: 'EST' },
      t4: { label: 'T4 Marksman', food: 1200, wood: 600,  stone: 400,  iron: 1200, timeSec: 600,  pts: { hog: 10, kvk: 10, tsg: 4  }, status: 'EST' },
      t5: { label: 'T5 Marksman', food: 3500, wood: 2000, stone: 1500, iron: 3500, timeSec: 1800, pts: { hog: 25, kvk: 25, tsg: 10 }, status: 'EST' },
    }
  }
};

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────

let currentType = 'infantry';

// ─────────────────────────────────────────
// TAB SWITCH
// ─────────────────────────────────────────

function switchType(el, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentType = type;
  updateTierInfo();
  calculate();
}

// ─────────────────────────────────────────
// TIER INFO CARD
// ─────────────────────────────────────────

function updateTierInfo() {
  const tier   = document.getElementById('troop-tier').value;
  const data   = TROOP_DATA[currentType];
  const troop  = data.tiers[tier];
  const infoEl = document.getElementById('tier-info');

  if (!troop) { infoEl.innerHTML = ''; return; }

  // Pre-fill event point rate fields with this tier's defaults
  document.getElementById('hog-rate').value = troop.pts.hog;
  document.getElementById('kvk-rate').value = troop.pts.kvk;
  document.getElementById('tsg-rate').value = troop.pts.tsg;

  infoEl.innerHTML = `
    <div style="font-size:13px;">
      <strong style="color:var(--text)">${troop.label}</strong>
      <span class="badge badge-${troop.status === 'VERIFIED' ? 'green' : 'gold'}" style="margin-left:8px;font-size:10px;">
        ${troop.status}
      </span>
      <div class="mt-8" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
        <span style="color:var(--text-muted)">Training time:</span>
        <span>${fmtTime(troop.timeSec)} per troop</span>
        <span style="color:var(--text-muted)">Default HoG pts:</span>
        <span>${troop.pts.hog} / troop</span>
        <span style="color:var(--text-muted)">Status:</span>
        <span>${troop.status === 'VERIFIED' ? '✓ Verified' : '⚠ Estimated — verify in-game'}</span>
      </div>
    </div>
  `;

  calculate();
}

// ─────────────────────────────────────────
// CALCULATE
// ─────────────────────────────────────────

function calculate() {
  const tier      = document.getElementById('troop-tier').value;
  const qty       = Math.max(1, Number(document.getElementById('troop-qty').value) || 0);
  const speedBuff = Number(document.getElementById('speed-buff').value) / 100;
  const hogRate   = Number(document.getElementById('hog-rate').value) || 0;
  const kvkRate   = Number(document.getElementById('kvk-rate').value) || 0;
  const tsgRate   = Number(document.getElementById('tsg-rate').value) || 0;

  const data  = TROOP_DATA[currentType];
  const troop = data.tiers[tier];

  if (!troop) return;

  const food  = troop.food  * qty;
  const wood  = troop.wood  * qty;
  const stone = troop.stone * qty;
  const iron  = troop.iron  * qty;
  const rawTime   = troop.timeSec * qty;
  const adjTime   = rawTime / (1 + speedBuff);

  const hogPts = hogRate * qty;
  const kvkPts = kvkRate * qty;
  const tsgPts = tsgRate * qty;
  const ptsPerHr = adjTime > 0 ? Math.round(hogPts / (adjTime / 3600)) : 0;

  // Render resource results
  const area = document.getElementById('result-area');
  area.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-muted);">
      Training ${qty.toLocaleString()} ${troop.label}
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
      <div class="result-item" style="grid-column:1/-1;">
        <div class="result-label">⏱️ Total Training Time</div>
        <div class="result-value large">${fmtTime(adjTime)}</div>
      </div>
    </div>
  `;

  // Render event points
  document.getElementById('hog-pts').textContent = fmtNum(hogPts);
  document.getElementById('kvk-pts').textContent = fmtNum(kvkPts);
  document.getElementById('tsg-pts').textContent = fmtNum(tsgPts);
  document.getElementById('pts-per-hr').textContent = fmtNum(ptsPerHr);
  document.getElementById('events-section').classList.remove('hidden');
}

// ─────────────────────────────────────────
// FORMATTING
// ─────────────────────────────────────────

function fmtNum(n) {
  if (n === 0) return '0';
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
  updateTierInfo();
  calculate();
});
