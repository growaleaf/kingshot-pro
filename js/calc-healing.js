/**
 * calc-healing.js — Healing Cost Calculator
 * KingshotPro
 *
 * Data sources:
 * - Google AI Overview: T1 ~12 Food/unit, T11 ~307 Food + ~157 Wood/unit
 * - Reddit r/KingShot: 1000 min healing ≈ 18.8M total resources
 * - Resource ratio: approximately 20:20:4:1 (Food:Wood:Stone:Iron)
 *
 * Per-troop costs are interpolated from known T1 and T11 data points.
 * All values marked [EST] — verify in-game before relying on exact numbers.
 */

// [tier, food, wood, stone, iron] per troop [EST]
// T1 confirmed ~12 food. T11 confirmed ~307 food.
// Ratio Food:Wood:Stone:Iron ≈ 20:20:4:1 for lower tiers
// Higher tiers shift ratio (T11: 307 food but only 157 wood)
var HEAL_COSTS = [
  [1,   12,   12,   2,    1],
  [2,   17,   17,   3,    1],
  [3,   24,   24,   5,    1],
  [4,   33,   33,   7,    2],
  [5,   46,   44,   9,    2],
  [6,   64,   58,   13,   3],
  [7,   89,   78,   18,   4],
  [8,   123,  103,  25,   6],
  [9,   170,  138,  34,   9],
  [10,  236,  185,  47,   12],
  [11,  307,  157,  61,   15],
];

function calculate() {
  var tier   = parseInt(document.getElementById('heal-tier').value, 10) || 1;
  var troops = parseInt(document.getElementById('heal-troops').value, 10) || 0;
  var results = document.getElementById('heal-results');

  if (troops < 1) {
    results.innerHTML = '<p class="result-placeholder">Enter number of wounded troops.</p>';
    return;
  }

  var cost = null;
  for (var i = 0; i < HEAL_COSTS.length; i++) {
    if (HEAL_COSTS[i][0] === tier) { cost = HEAL_COSTS[i]; break; }
  }
  if (!cost) {
    results.innerHTML = '<p class="result-placeholder">Invalid tier selected.</p>';
    return;
  }

  var totalFood  = troops * cost[1];
  var totalWood  = troops * cost[2];
  var totalStone = troops * cost[3];
  var totalIron  = troops * cost[4];
  var grandTotal = totalFood + totalWood + totalStone + totalIron;

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Food</div><div class="result-value">' + totalFood.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Wood</div><div class="result-value">' + totalWood.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Stone</div><div class="result-value">' + totalStone.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Iron</div><div class="result-value">' + totalIron.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Total Resources</div><div class="result-value large">' + grandTotal.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Per Troop</div><div class="result-value">' + (cost[1]+cost[2]+cost[3]+cost[4]).toLocaleString() + '</div></div>';
  html += '</div>';

  // Full tier reference table
  html += '<h3 style="margin-top:20px;font-size:15px;color:var(--text);">Cost per Troop by Tier [EST]</h3>';
  html += '<table class="data-table mt-8"><thead><tr><th>Tier</th><th>Food</th><th>Wood</th><th>Stone</th><th>Iron</th><th>Total</th></tr></thead><tbody>';
  for (var j = 0; j < HEAL_COSTS.length; j++) {
    var c = HEAL_COSTS[j];
    var sel = c[0] === tier ? ' style="background:var(--gold-glow)"' : '';
    html += '<tr' + sel + '><td>T' + c[0] + '</td><td>' + c[1] + '</td><td>' + c[2] + '</td>';
    html += '<td>' + c[3] + '</td><td>' + c[4] + '</td><td>' + (c[1]+c[2]+c[3]+c[4]) + '</td></tr>';
  }
  html += '</tbody></table>';

  html += '<div class="alert alert-warn mt-16" style="font-size:12px;">[EST] Per-troop costs interpolated from confirmed T1 (~12 food) and T11 (~307 food) data points via Google AI Overview + Reddit. Verify against your in-game infirmary. <a href="https://github.com/Kingshotpro/website/issues" target="_blank">Report corrections &rarr;</a></div>';
  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('heal-calc-btn').addEventListener('click', calculate);
});
