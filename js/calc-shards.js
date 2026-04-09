/**
 * calc-shards.js — Hero Shard Calculator
 * KingshotPro | Phase 1
 *
 * [EST] Shard costs per star level are community-estimated.
 * Verify against in-game shard requirements before making spending decisions.
 * Hero-specific variations (some heroes cost more shards) not yet accounted for.
 */

// ─────────────────────────────────────────
// SHARD TABLES
// [from_stars → to_stars]: shards required
// ─────────────────────────────────────────

const SHARD_COSTS = {
  epic: {
    label: 'Epic Hero Shards',
    // [to_star, shards_needed]  [EST]
    tiers: [
      [1,   10],
      [2,   20],
      [3,   40],
      [4,   80],
      [5,  160],
      [6,  320],
      [7,  600],
      [8, 1000],
      [9, 1500],
      [10,2500],
    ]
  },
  legendary: {
    label: 'Legendary Hero Shards',
    tiers: [
      [1,   15],
      [2,   30],
      [3,   60],
      [4,  120],
      [5,  240],
      [6,  480],
      [7,  900],
      [8, 1500],
      [9, 2200],
      [10,3500],
    ]
  },
  mythic: {
    label: 'Mythic Hero Shards',
    tiers: [
      [1,   20],
      [2,   50],
      [3,  100],
      [4,  200],
      [5,  400],
      [6,  800],
      [7, 1500],
      [8, 2500],
      [9, 4000],
      [10,6500],
    ]
  }
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function updateShardType() {
  const rarity = document.getElementById('hero-rarity').value;
  const data   = SHARD_COSTS[rarity];
  const note   = document.getElementById('shard-type-note');
  note.textContent = `Using ${data.label}. Adjust if your hero uses a different shard type.`;
}

function calculate() {
  const rarity       = document.getElementById('hero-rarity').value;
  const currentStars = Number(document.getElementById('current-stars').value);
  const targetStars  = Number(document.getElementById('target-stars').value);
  const ownedShards  = Number(document.getElementById('current-shards').value) || 0;
  const gemPerShard  = Number(document.getElementById('gem-per-shard').value) || 50;

  if (targetStars <= currentStars) {
    document.getElementById('result-area').innerHTML =
      '<div class="alert alert-error">Target stars must be higher than current stars.</div>';
    document.getElementById('progression-table').classList.add('hidden');
    return;
  }

  const data   = SHARD_COSTS[rarity];
  const tiers  = data.tiers;

  // Sum shards from current → target
  let totalShards = 0;
  for (let s = currentStars + 1; s <= targetStars; s++) {
    const tier = tiers.find(t => t[0] === s);
    if (tier) totalShards += tier[1];
  }

  const needed     = Math.max(0, totalShards - ownedShards);
  const gemCost    = needed * gemPerShard;
  const pctOwned   = totalShards > 0 ? Math.min(100, Math.round((ownedShards / totalShards) * 100)) : 0;

  // Render result
  const area = document.getElementById('result-area');
  area.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-muted);">
      ${currentStars}★ → ${targetStars}★ · ${data.label}
    </div>
    <div class="result-grid">
      <div class="result-item" style="grid-column:1/-1;">
        <div class="result-label">Total Shards Needed</div>
        <div class="result-value large">${totalShards.toLocaleString()}</div>
      </div>
      <div class="result-item">
        <div class="result-label">You own</div>
        <div class="result-value text-green">${ownedShards.toLocaleString()}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Still needed</div>
        <div class="result-value ${needed > 0 ? 'text-red' : 'text-green'}">${needed.toLocaleString()}</div>
      </div>
      <div class="result-item" style="grid-column:1/-1;">
        <div class="result-label">Gem cost to buy missing shards</div>
        <div class="result-value">${gemCost.toLocaleString()} 💎</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="margin-top:16px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
        <span>Progress</span>
        <span>${pctOwned}%</span>
      </div>
      <div style="background:var(--surface-2);border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:var(--gold);height:100%;width:${pctOwned}%;border-radius:4px;transition:width 0.3s;"></div>
      </div>
    </div>
  `;

  // Render star progression table
  renderProgressionTable(rarity, currentStars, targetStars);
}

function renderProgressionTable(rarity, currentStars, targetStars) {
  const data   = SHARD_COSTS[rarity];
  const tbody  = document.getElementById('star-tbody');
  const table  = document.getElementById('progression-table');

  let cumulative = 0;
  tbody.innerHTML = '';

  data.tiers.forEach(([star, cost]) => {
    if (star > targetStars) return;
    cumulative += cost;

    const inRange = star > currentStars && star <= targetStars;
    const tr = document.createElement('tr');
    tr.style.opacity = inRange ? '1' : '0.4';
    tr.innerHTML = `
      <td>${'★'.repeat(star)} <span style="color:var(--text-dim);font-size:12px;">(to ${star}★)</span></td>
      <td>${cost.toLocaleString()}</td>
      <td>${cumulative.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });

  table.classList.remove('hidden');
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  updateShardType();
  calculate();
});
