/**
 * calc-vip.js — VIP Level Calculator
 * KingshotPro | Phase 1
 *
 * Data source: kingshot.net/vip-calculator — April 2026
 * 1 VIP point = 2 gems
 */

// XP required PER LEVEL (to go from level N-1 to N)
// VIP 1 is starting level (0 XP needed)
const VIP_DATA = [
  // [level, xp_to_reach, gems_equivalent]
  [1,  0,          0],
  [2,  2500,       5000],
  [3,  5000,       10000],
  [4,  12500,      25000],
  [5,  30000,      60000],
  [6,  40000,      80000],
  [7,  60000,      120000],
  [8,  100000,     200000],
  [9,  350000,     700000],
  [10, 600000,     1200000],
  [11, 1200000,    2400000],
  [12, 2400000,    4800000],
];

const MAX_VIP = VIP_DATA.length;

function populateSelects() {
  var from = document.getElementById('vip-from');
  var to   = document.getElementById('vip-to');
  if (!from || !to) return;
  for (var i = 0; i < MAX_VIP; i++) {
    var lv = VIP_DATA[i][0];
    from.innerHTML += '<option value="' + lv + '">VIP ' + lv + '</option>';
    to.innerHTML   += '<option value="' + lv + '">VIP ' + lv + '</option>';
  }
  from.value = '1';
  to.value   = '6';
}

function calculate() {
  var fromLv = parseInt(document.getElementById('vip-from').value, 10);
  var toLv   = parseInt(document.getElementById('vip-to').value, 10);
  var results = document.getElementById('vip-results');
  if (!results) return;

  if (toLv <= fromLv) {
    results.innerHTML = '<p class="result-placeholder">Target must be higher than current level.</p>';
    return;
  }

  var totalXP = 0;
  var totalGems = 0;
  var breakdown = [];

  for (var i = 0; i < VIP_DATA.length; i++) {
    var lv = VIP_DATA[i][0];
    if (lv > fromLv && lv <= toLv) {
      totalXP   += VIP_DATA[i][1];
      totalGems += VIP_DATA[i][2];
      breakdown.push({
        level: lv,
        xp: VIP_DATA[i][1],
        gems: VIP_DATA[i][2],
      });
    }
  }

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Total VIP XP</div>';
  html += '<div class="result-value">' + fmt(totalXP) + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Gem Cost</div>';
  html += '<div class="result-value">' + fmt(totalGems) + ' <span class="result-unit">gems</span></div></div>';
  html += '<div class="result-item"><div class="result-label">VIP Points</div>';
  html += '<div class="result-value">' + fmt(totalXP) + ' <span class="result-unit">points</span></div></div>';
  html += '<div class="result-item"><div class="result-label">Levels</div>';
  html += '<div class="result-value">' + (toLv - fromLv) + '</div></div>';
  html += '</div>';

  // Breakdown table
  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>Level</th><th>XP Needed</th><th>Gems</th><th>Cumulative XP</th>';
  html += '</tr></thead><tbody>';
  var cumXP = 0;
  for (var j = 0; j < breakdown.length; j++) {
    cumXP += breakdown[j].xp;
    html += '<tr><td>VIP ' + breakdown[j].level + '</td>';
    html += '<td>' + fmt(breakdown[j].xp) + '</td>';
    html += '<td>' + fmt(breakdown[j].gems) + '</td>';
    html += '<td>' + fmt(cumXP) + '</td></tr>';
  }
  html += '</tbody></table>';

  results.innerHTML = html;
}

function fmt(n) {
  return n.toLocaleString();
}

document.addEventListener('DOMContentLoaded', function () {
  populateSelects();
  var btn = document.getElementById('vip-calc-btn');
  if (btn) btn.addEventListener('click', calculate);
});
