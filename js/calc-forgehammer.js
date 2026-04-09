/**
 * calc-forgehammer.js — Forgehammer Gear Mastery Calculator
 * KingshotPro | Data: kingshot.net/forgehammer-calculator — April 2026
 *
 * Each gear piece can be mastered 1-20. Per level:
 *   Forgehammers: level × 10
 *   Mythic Gears:  0 for levels 1-10, (level - 10) for 11-20
 */

var FH_MAX = 20;

function fhCost(level) {
  return {
    hammers: level * 10,
    mythic: level > 10 ? level - 10 : 0,
  };
}

function populateSelects() {
  var from = document.getElementById('fh-from');
  var to   = document.getElementById('fh-to');
  var pcs  = document.getElementById('fh-pieces');
  for (var i = 0; i <= FH_MAX; i++) {
    from.innerHTML += '<option value="' + i + '">' + (i === 0 ? 'Not started' : 'Level ' + i) + '</option>';
    if (i > 0) to.innerHTML += '<option value="' + i + '">Level ' + i + '</option>';
  }
  from.value = '0';
  to.value = '10';
}

function calculate() {
  var fromLv  = parseInt(document.getElementById('fh-from').value, 10);
  var toLv    = parseInt(document.getElementById('fh-to').value, 10);
  var pieces  = parseInt(document.getElementById('fh-pieces').value, 10) || 1;
  var results = document.getElementById('fh-results');

  if (toLv <= fromLv) {
    results.innerHTML = '<p class="result-placeholder">Target must be higher than current level.</p>';
    return;
  }

  var totalH = 0, totalM = 0;
  var rows = [];
  for (var lv = fromLv + 1; lv <= toLv; lv++) {
    var c = fhCost(lv);
    totalH += c.hammers;
    totalM += c.mythic;
    rows.push({ lv: lv, h: c.hammers, m: c.mythic, bonus: lv * 10 });
  }

  var grandH = totalH * pieces;
  var grandM = totalM * pieces;

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Forgehammers (per piece)</div>';
  html += '<div class="result-value">' + totalH.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Mythic Gears (per piece)</div>';
  html += '<div class="result-value">' + totalM.toLocaleString() + '</div></div>';
  if (pieces > 1) {
    html += '<div class="result-item"><div class="result-label">Total Forgehammers (' + pieces + ' pcs)</div>';
    html += '<div class="result-value large">' + grandH.toLocaleString() + '</div></div>';
    html += '<div class="result-item"><div class="result-label">Total Mythic Gears (' + pieces + ' pcs)</div>';
    html += '<div class="result-value large">' + grandM.toLocaleString() + '</div></div>';
  }
  html += '</div>';

  html += '<table class="data-table mt-16"><thead><tr>';
  html += '<th>Level</th><th>Hammers</th><th>Mythic Gears</th><th>Stat Bonus</th>';
  html += '</tr></thead><tbody>';
  for (var j = 0; j < rows.length; j++) {
    html += '<tr><td>' + rows[j].lv + '</td><td>' + rows[j].h + '</td>';
    html += '<td>' + (rows[j].m || '—') + '</td>';
    html += '<td>+' + rows[j].bonus + '%</td></tr>';
  }
  html += '</tbody></table>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  populateSelects();
  document.getElementById('fh-calc-btn').addEventListener('click', calculate);
});
