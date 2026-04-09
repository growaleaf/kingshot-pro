/**
 * calc-charm.js — Governor Charm Calculator
 * KingshotPro
 *
 * Data source: kingshot.net/database/governor-charm — April 2026
 * Cross-verified: Perplexity confirms levels 1-11. Levels 12-22 single-source.
 * Materials: Charm Guides + Charm Designs
 */

// [level, charm_guides, charm_designs, stat_increase_pct, power_gained]
var CHARM_DATA = [
  [1,   5,    5,     9,   205700],
  [2,   40,   15,    3,   82300],
  [3,   60,   40,    4,   82000],
  [4,   80,   100,   3,   82000],
  [5,   100,  200,   6,   124000],
  [6,   120,  300,   5,   124000],
  [7,   140,  400,   5,   124000],
  [8,   200,  400,   5,   124000],
  [9,   300,  400,   5,   124000],
  [10,  420,  420,   5,   124000],
  [11,  560,  420,   5,   124000],
  [12,  580,  600,   4,   96000],
  [13,  610,  780,   4,   96000],
  [14,  645,  960,   4,   96000],
  [15,  685,  1140,  4,   96000],
  [16,  730,  1320,  4,   96000],
  [17,  780,  1500,  4,   96000],
  [18,  835,  1680,  4,   96000],
  [19,  895,  1860,  4,   96000],
  [20,  960,  2040,  4,   96000],
  [21,  1030, 2220,  4,   96000],
  [22,  1105, 2400,  4,   96000],
];

function populateSelects() {
  var from = document.getElementById('ch-from');
  var to   = document.getElementById('ch-to');
  from.innerHTML = '<option value="0">Not started</option>';
  to.innerHTML = '';
  for (var i = 0; i < CHARM_DATA.length; i++) {
    var lv = CHARM_DATA[i][0];
    from.innerHTML += '<option value="' + lv + '">Level ' + lv + '</option>';
    to.innerHTML   += '<option value="' + lv + '">Level ' + lv + '</option>';
  }
  from.value = '0';
  to.value = '11';
}

function calculate() {
  var fromLv  = parseInt(document.getElementById('ch-from').value, 10);
  var toLv    = parseInt(document.getElementById('ch-to').value, 10);
  var results = document.getElementById('ch-results');

  if (toLv <= fromLv) {
    results.innerHTML = '<p class="result-placeholder">Target must be higher than current level.</p>';
    return;
  }

  var totalGuides = 0, totalDesigns = 0, totalStat = 0, totalPower = 0;
  var rows = [];

  for (var i = 0; i < CHARM_DATA.length; i++) {
    var d = CHARM_DATA[i];
    if (d[0] > fromLv && d[0] <= toLv) {
      totalGuides  += d[1];
      totalDesigns += d[2];
      totalStat    += d[3];
      totalPower   += d[4];
      rows.push({ lv: d[0], guides: d[1], designs: d[2], stat: d[3], power: d[4] });
    }
  }

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Charm Guides</div>';
  html += '<div class="result-value">' + totalGuides.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Charm Designs</div>';
  html += '<div class="result-value">' + totalDesigns.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Total Stat Boost</div>';
  html += '<div class="result-value">+' + totalStat + '%</div></div>';
  html += '<div class="result-item"><div class="result-label">Total Power</div>';
  html += '<div class="result-value">+' + totalPower.toLocaleString() + '</div></div>';
  html += '</div>';

  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>Level</th><th>Guides</th><th>Designs</th><th>Stat +</th><th>Power +</th>';
  html += '</tr></thead><tbody>';
  for (var j = 0; j < rows.length; j++) {
    html += '<tr><td>' + rows[j].lv + '</td><td>' + rows[j].guides.toLocaleString() + '</td>';
    html += '<td>' + rows[j].designs.toLocaleString() + '</td>';
    html += '<td>+' + rows[j].stat + '%</td>';
    html += '<td>+' + rows[j].power.toLocaleString() + '</td></tr>';
  }
  html += '</tbody></table>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  populateSelects();
  document.getElementById('ch-calc-btn').addEventListener('click', calculate);
});
