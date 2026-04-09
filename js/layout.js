/**
 * layout.js — Sidebar + Topbar layout injection
 * KingshotPro | Phase 1
 *
 * Dynamically builds the sidebar nav and sticky topbar.
 * Include on every page BEFORE page-specific scripts.
 * Removes any existing <nav class="nav"> (old top-nav).
 */
(function () {
  'use strict';

  // ── Path prefix (pages in /calculators/ need ../) ──
  var loc = window.location.pathname;
  var inSub = /\/calculators\//.test(loc);
  var B = inSub ? '../' : '';

  // ── Navigation items ──────────────────────
  // cat  = category header
  // href = null → "Coming Soon"
  var NAV = [
    { icon: '\u{1F3E0}', label: 'Home',             href: B + 'index.html',                key: 'home' },
    { cat: 'COMMUNITY' },
    { icon: '\u{1F381}', label: 'Gift Codes',       href: B + 'codes.html',                key: 'codes',    badges: ['Popular'] },
    { icon: '\u{1F511}', label: 'Auto-Redeem',      href: null,                            badges: ['Pro'] },
    { cat: 'CALCULATORS' },
    { icon: '\u{1F3F0}', label: 'Building',         href: B + 'calculators/building.html', key: 'building', badges: ['Popular'] },
    { icon: '\u2694\uFE0F', label: 'Troop Training', href: B + 'calculators/troops.html',  key: 'troops',   badges: ['Popular'] },
    { icon: '\u{1F6E1}\uFE0F', label: 'Governor Gear', href: B + 'calculators/gear.html',  key: 'gear' },
    { icon: '\u2728',   label: 'Governor Charm',    href: null },
    { icon: '\u{1F9B8}', label: 'Hero Shards',      href: B + 'calculators/shards.html',   key: 'shards' },
    { icon: '\u{1F409}', label: 'Pets',             href: B + 'calculators/pets.html',      key: 'pets' },
    { icon: '\u{1F4CA}', label: 'Hero XP',          href: null,                            badges: ['New'] },
    { icon: '\u2694\uFE0F', label: 'Hero Gear',     href: null },
    { icon: '\u{1F4C8}', label: 'Hero Comparison',  href: null },
    { icon: '\u{1F3C6}', label: 'KvK Score',        href: null },
    { icon: '\u{1F52C}', label: 'War Academy',      href: null },
    { icon: '\u2B50',   label: 'VIP',               href: null },
    { icon: '\u{1F48E}', label: 'Truegold',         href: null },
    { cat: 'PLANNERS' },
    { icon: '\u{1F91D}', label: 'Alliance Mob.',    href: null,                            badges: ['New'] },
    { icon: '\u{1F528}', label: 'Forgehammer',      href: null },
    { icon: '\u{1F4E6}', label: 'Pack Value',       href: null,                            badges: ['Pro'] },
    { cat: 'EVENTS' },
    { icon: '\u2694\uFE0F', label: 'Viking Vengeance', href: null },
    { icon: '\u{1F43B}', label: 'Troop Split',      href: null },
    { icon: '\u{1F52E}', label: 'Mystic Trials',    href: null },
    { cat: 'TOOLS' },
    { icon: '\u{1F5FA}\uFE0F', label: 'Rally Planner', href: null },
    { icon: '\u{1F5FA}\uFE0F', label: 'Map Planner',   href: null },
    { icon: '\u{1F48A}', label: 'Healing Cost',     href: null },
  ];

  // ── Active page ───────────────────────────
  function isActive(item) {
    if (!item.key) return false;
    if (item.key === 'home') {
      return loc === '/' || loc.endsWith('/index.html') || loc.endsWith('/');
    }
    return loc.indexOf(item.key + '.html') !== -1;
  }

  // ── Build sidebar HTML ────────────────────
  function sidebarHTML() {
    var h = '<nav class="sb-scroll" role="navigation" aria-label="Main">';
    for (var i = 0; i < NAV.length; i++) {
      var it = NAV[i];
      if (it.cat) {
        h += '<div class="sb-cat">' + it.cat + '</div>';
        continue;
      }
      var active = isActive(it) ? ' active' : '';
      var dis    = !it.href ? ' disabled' : '';
      var bHTML  = '';
      if (it.badges) {
        for (var b = 0; b < it.badges.length; b++) {
          var t = it.badges[b];
          bHTML += '<span class="sb-badge ' + t.toLowerCase() + '">' + t + '</span>';
        }
      }
      if (!it.href) bHTML += '<span class="sb-badge soon">Soon</span>';
      var tag = it.href ? 'a' : 'span';
      var hr  = it.href ? ' href="' + it.href + '"' : '';
      h += '<' + tag + hr + ' class="sb-item' + active + dis + '">';
      h += '<span class="sb-icon">' + it.icon + '</span>';
      h += '<span class="sb-text">' + it.label + '</span>';
      h += bHTML;
      h += '</' + tag + '>';
    }
    // Ecosystem
    h += '<div class="sb-eco">';
    h += '<div class="sb-cat">ECOSYSTEM</div>';
    h += '<a href="https://kingshotdata.com" target="_blank" rel="noopener" class="sb-item ext">';
    h += '<span class="sb-icon">\u{1F4D6}</span><span class="sb-text">Game Wiki</span><span class="sb-arrow">\u2197</span></a>';
    h += '<a href="https://kingshotguides.com" target="_blank" rel="noopener" class="sb-item ext">';
    h += '<span class="sb-icon">\u{1F4DD}</span><span class="sb-text">Guides</span><span class="sb-arrow">\u2197</span></a>';
    h += '</div>';
    // Ad slot: sidebar bottom
    h += '<div class="ad-slot sb-ad" data-slot="sidebar-bottom"></div>';
    h += '</nav>';
    return h;
  }

  // ── Build topbar HTML ─────────────────────
  function topbarHTML() {
    var profileBit = '';
    try {
      var raw = sessionStorage.getItem('ksp_profile');
      if (raw) {
        var p = JSON.parse(raw);
        var ch = (p.nickname || '?').charAt(0).toUpperCase();
        profileBit =
          '<div class="tb-profile">' +
            '<span class="tb-av">' + ch + '</span>' +
            '<span class="tb-nick">' + (p.nickname || 'Player') + '</span>' +
            '<span class="tb-kid">K' + (p.kid || '?') + '</span>' +
          '</div>';
      }
    } catch (e) { /* private mode */ }
    if (!profileBit) {
      profileBit = '<a href="' + B + 'index.html#fid-form" class="btn btn-sm btn-outline tb-fid">Enter FID</a>';
    }
    return '<button class="tb-menu" id="sb-toggle" aria-label="Toggle navigation">' +
      '<span></span><span></span><span></span></button>' +
      '<a href="' + B + 'index.html" class="tb-brand">KingshotPro</a>' +
      '<div class="tb-spacer"></div>' + profileBit;
  }

  // ── Inject ────────────────────────────────
  function inject() {
    var old = document.querySelector('nav.nav');
    if (old) old.remove();

    var tb = document.createElement('header');
    tb.className = 'topbar';
    tb.id = 'topbar';
    tb.innerHTML = topbarHTML();
    document.body.prepend(tb);

    var sb = document.createElement('aside');
    sb.className = 'sidebar';
    sb.id = 'sidebar';
    sb.innerHTML = sidebarHTML();
    document.body.insertBefore(sb, tb.nextSibling);

    var ov = document.createElement('div');
    ov.className = 'sb-overlay';
    ov.id = 'sb-overlay';
    document.body.appendChild(ov);

    function toggle() {
      sb.classList.toggle('open');
      ov.classList.toggle('open');
    }
    document.getElementById('sb-toggle').addEventListener('click', toggle);
    ov.addEventListener('click', toggle);

    sb.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 && e.target.closest('a.sb-item')) {
        sb.classList.remove('open');
        ov.classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
