/**
 * calc-mystic.js — Mystic Trials Planner
 * KingshotPro
 *
 * Data: lootbar.gg/blog/en/kingshot-mystic-trial-guide — April 2026
 * Unlocks at Town Center 19. 6 dungeons, weekly rotation.
 * 5 free attempts/day. Victories don't consume attempts.
 */

var DUNGEONS = [
  { name: 'Coliseum',       focus: 'Hero Gear',         days: 'Mon-Tue',   ratio: '50/10/40 (Inf/Cav/Arc)' },
  { name: 'Forest of Life', focus: 'Pet Abilities',      days: 'Wed-Thu',   ratio: '50/15/35' },
  { name: 'Crystal Cave',   focus: 'Governor Charm',     days: 'Wed-Thu',   ratio: '60/20/20' },
  { name: 'Knowledge Nexus',focus: 'Academy/War Academy',days: 'Varies',    ratio: '50/20/30' },
  { name: 'Molten Fort',    focus: 'Governor Gear',      days: 'Varies',    ratio: '60/15/25' },
  { name: 'Radiant Spire',  focus: 'All Stats Combined', days: 'Sunday',    ratio: '50/15/35' },
];

function calculate() {
  var stagesCleared = parseInt(document.getElementById('my-stages').value, 10) || 0;
  var attemptsLeft  = parseInt(document.getElementById('my-attempts').value, 10) || 5;
  var results = document.getElementById('my-results');

  var weeklyMisty = stagesCleared * 10; // 10 Misty Crystals per cleared stage per week

  var html = '<div class="result-grid">';
  html += '<div class="result-item"><div class="result-label">Stages Cleared</div><div class="result-value">' + stagesCleared + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Weekly Misty Crystals</div><div class="result-value large">' + weeklyMisty.toLocaleString() + '</div></div>';
  html += '<div class="result-item"><div class="result-label">Attempts Left Today</div><div class="result-value">' + attemptsLeft + '/5</div></div>';
  html += '<div class="result-item"><div class="result-label">Free Attempts/Week</div><div class="result-value">35</div></div>';
  html += '</div>';

  html += '<h3 style="margin-top:20px;font-size:15px;color:var(--text);">Dungeon Rotation & Formations</h3>';
  html += '<table class="data-table mt-8"><thead><tr><th>Dungeon</th><th>Focus</th><th>Schedule</th><th>Troop Ratio (Inf/Cav/Arc)</th></tr></thead><tbody>';
  for (var i = 0; i < DUNGEONS.length; i++) {
    var d = DUNGEONS[i];
    html += '<tr><td>' + d.name + '</td><td>' + d.focus + '</td>';
    html += '<td>' + d.days + '</td><td>' + d.ratio + '</td></tr>';
  }
  html += '</tbody></table>';

  html += '<div class="alert alert-info mt-16" style="font-size:12px;">';
  html += '<strong>Tips:</strong> Victories don\'t consume attempts — only losses do. ';
  html += 'Clear Stage 10 to unlock Raid (auto-collect weekly rewards). ';
  html += 'Milestone rewards include Mithril and Mythic Hero Shards.';
  html += '</div>';

  results.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('my-calc-btn').addEventListener('click', calculate);
});
