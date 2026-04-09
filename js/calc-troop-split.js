/**
 * calc-troop-split.js — Troop Split Calculator
 * KingshotPro | Pure math, no game data needed
 *
 * Splits troops optimally across marches for events like
 * Bear Hunt, Viking Vengeance, etc.
 */

function calculate() {
  var total   = parseInt(document.getElementById('ts-total').value, 10) || 0;
  var marches = parseInt(document.getElementById('ts-marches').value, 10) || 1;
  var mode    = document.getElementById('ts-mode').value;
  var results = document.getElementById('ts-results');

  if (total < 1 || marches < 1) {
    results.innerHTML = '<p class="result-placeholder">Enter troop count and number of marches.</p>';
    return;
  }

  marches = Math.min(marches, 10);
  var splits = [];

  if (mode === 'even') {
    var base = Math.floor(total / marches);
    var remainder = total % marches;
    for (var i = 0; i < marches; i++) {
      splits.push(base + (i < remainder ? 1 : 0));
    }
  } else if (mode === 'main-heavy') {
    // First march gets 40%, rest split evenly
    var mainCount = Math.round(total * 0.4);
    var rest = total - mainCount;
    var restPer = marches > 1 ? Math.floor(rest / (marches - 1)) : 0;
    var restRem = marches > 1 ? rest % (marches - 1) : 0;
    splits.push(mainCount);
    for (var j = 1; j < marches; j++) {
      splits.push(restPer + (j - 1 < restRem ? 1 : 0));
    }
  } else if (mode === 'decoy') {
    // 1 troop per decoy march, rest in main
    splits.push(total - (marches - 1));
    for (var k = 1; k < marches; k++) {
      splits.push(1);
    }
  }

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Total Troops</div>';
  html += '<div class="result-value">' + total.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Marches</div>';
  html += '<div class="result-value">' + marches + '</div></div>';
  html += '</div>';

  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>March</th><th>Troops</th><th>% of Total</th>';
  html += '</tr></thead><tbody>';
  for (var m = 0; m < splits.length; m++) {
    var pct = total > 0 ? ((splits[m] / total) * 100).toFixed(1) : '0';
    html += '<tr><td>March ' + (m + 1) + (m === 0 && mode !== 'even' ? ' (Main)' : '') + '</td>';
    html += '<td>' + splits[m].toLocaleString() + '</td>';
    html += '<td>' + pct + '%</td></tr>';
  }
  html += '</tbody></table>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('ts-calc-btn').addEventListener('click', calculate);
});
