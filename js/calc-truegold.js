/**
 * calc-truegold.js — Truegold Requirements Calculator
 * KingshotPro
 *
 * Data source: kingshot.net/database/truegold-requirements — April 2026
 * Shows truegold + tempered truegold needed per building per TG tier.
 * TTG = Tempered Truegold (required from TG6+)
 */

// [building, TG1, TG2, TG3, TG4, TG5, TG6_tg, TG6_ttg, TG7_tg, TG7_ttg, TG8_tg, TG8_ttg]
var TG_DATA = [
  ['Town Center',    660, 790, 1190, 1400, 1675, 900, 60, 1080, 90, 1080, 120],
  ['Embassy',        165, 195, 295,  350,  415,  225, 13, 270,  19, 270,  30],
  ['Command Center', 130, 155, 235,  280,  335,  180, 13, 216,  19, 216,  24],
  ['Infirmary',      130, 155, 235,  280,  335,  180, 13, 216,  19, 216,  24],
  ['Barracks',       295, 355, 535,  630,  750,  405, 25, 486,  37, 486,  54],
  ['Stable',         295, 355, 535,  630,  750,  405, 25, 486,  37, 486,  54],
  ['Range',          295, 355, 535,  630,  750,  405, 25, 486,  37, 486,  54],
  ['War Academy',    0,   355, 535,  630,  750,  405, 25, 486,  37, 486,  54],
];

function calculate() {
  var fromTG = parseInt(document.getElementById('tg-from').value, 10);
  var toTG   = parseInt(document.getElementById('tg-to').value, 10);
  var results = document.getElementById('tg-results');

  if (toTG <= fromTG) {
    results.innerHTML = '<p class="result-placeholder">Target must be higher than current tier.</p>';
    return;
  }

  // Column mapping: TG1=col1, TG2=col2, ..., TG5=col5, TG6_tg=col6, TG6_ttg=col7, etc.
  function getCol(tg) {
    if (tg <= 5) return { tg: tg, ttg: -1 };
    if (tg === 6) return { tg: 5, ttg: 6 };
    if (tg === 7) return { tg: 7, ttg: 8 };
    if (tg === 8) return { tg: 9, ttg: 10 };
    return { tg: -1, ttg: -1 };
  }

  var grandTG = 0, grandTTG = 0;
  var rows = [];

  for (var b = 0; b < TG_DATA.length; b++) {
    var bld = TG_DATA[b];
    var bTG = 0, bTTG = 0;
    for (var tier = fromTG + 1; tier <= toTG; tier++) {
      var cols = getCol(tier);
      if (cols.tg >= 0) bTG += bld[cols.tg];
      if (cols.ttg >= 0) bTTG += bld[cols.ttg];
    }
    grandTG += bTG;
    grandTTG += bTTG;
    rows.push({ name: bld[0], tg: bTG, ttg: bTTG });
  }

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Total Truegold</div>';
  html += '<div class="result-value large">' + grandTG.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Tempered Truegold</div>';
  html += '<div class="result-value">' + grandTTG.toLocaleString() + '</div></div>';
  html += '</div>';

  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>Building</th><th>Truegold</th><th>Tempered TG</th>';
  html += '</tr></thead><tbody>';
  for (var j = 0; j < rows.length; j++) {
    html += '<tr><td>' + rows[j].name + '</td>';
    html += '<td>' + rows[j].tg.toLocaleString() + '</td>';
    html += '<td>' + (rows[j].ttg > 0 ? rows[j].ttg.toLocaleString() : '—') + '</td></tr>';
  }
  html += '<tr style="font-weight:700;border-top:2px solid var(--border)"><td>TOTAL</td>';
  html += '<td>' + grandTG.toLocaleString() + '</td>';
  html += '<td>' + (grandTTG > 0 ? grandTTG.toLocaleString() : '—') + '</td></tr>';
  html += '</tbody></table>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tg-calc-btn').addEventListener('click', calculate);
});
