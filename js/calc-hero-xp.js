/**
 * calc-hero-xp.js — Hero XP Calculator
 * KingshotPro
 *
 * Data source: Perplexity citing kingshot-data.com — April 2026
 * Single-source data. Max hero level is 80, only 1-15 available.
 * Levels 16+ will be added when verified data is found.
 */

// [level, xp_to_reach_this_level, deployment_capacity]
var HERO_XP = [
  [1,  0,    65],
  [2,  480,  140],
  [3,  690,  220],
  [4,  920,  305],
  [5,  1200, 400],
  [6,  1500, 500],
  [7,  1800, 605],
  [8,  2200, 720],
  [9,  2600, 840],
  [10, 3100, 970],
  [11, 3800, 1100],
  [12, 4200, 1240],
  [13, 5100, 1390],
  [14, 5700, 1540],
  [15, 6800, 1700],
];

function populateSelects() {
  var from = document.getElementById('hx-from');
  var to   = document.getElementById('hx-to');
  for (var i = 0; i < HERO_XP.length; i++) {
    var lv = HERO_XP[i][0];
    from.innerHTML += '<option value="' + lv + '">Level ' + lv + '</option>';
    to.innerHTML   += '<option value="' + lv + '">Level ' + lv + '</option>';
  }
  from.value = '1';
  to.value = '15';
}

function calculate() {
  var fromLv  = parseInt(document.getElementById('hx-from').value, 10);
  var toLv    = parseInt(document.getElementById('hx-to').value, 10);
  var results = document.getElementById('hx-results');

  if (toLv <= fromLv) {
    results.innerHTML = '<p class="result-placeholder">Target must be higher than current level.</p>';
    return;
  }

  var totalXP = 0;
  var rows = [];

  for (var i = 0; i < HERO_XP.length; i++) {
    var d = HERO_XP[i];
    if (d[0] > fromLv && d[0] <= toLv) {
      totalXP += d[1];
      rows.push({ lv: d[0], xp: d[1], cap: d[2] });
    }
  }

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Total Hero XP Needed</div>';
  html += '<div class="result-value large">' + totalXP.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Levels</div>';
  html += '<div class="result-value">' + fromLv + ' → ' + toLv + '</div></div>';
  html += '</div>';

  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>Level</th><th>XP Needed</th><th>Deploy Capacity</th><th>Cumulative XP</th>';
  html += '</tr></thead><tbody>';
  var cumXP = 0;
  for (var j = 0; j < rows.length; j++) {
    cumXP += rows[j].xp;
    html += '<tr><td>' + rows[j].lv + '</td>';
    html += '<td>' + rows[j].xp.toLocaleString() + '</td>';
    html += '<td>' + rows[j].cap.toLocaleString() + '</td>';
    html += '<td>' + cumXP.toLocaleString() + '</td></tr>';
  }
  html += '</tbody></table>';

  html += '<div class="alert alert-warn mt-16" style="font-size:12px;">Hero max level is 80. Data for levels 16-80 is being collected. <a href="https://github.com/Kingshotpro/website/issues" target="_blank">Contribute data →</a></div>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  populateSelects();
  document.getElementById('hx-calc-btn').addEventListener('click', calculate);
});
