# KingshotPro — Master Task List
*Last updated: April 9, 2026*

Status key: [ ] not started · [~] in progress · [x] done · [!] blocked

---

## TRACK A — LAYOUT REBUILD ← START HERE

- [ ] Implement fixed left sidebar + sticky topbar (mirror kingshot.net structure)
- [ ] Sidebar categories with icons: Home, Community, Calculators, Planners, Events, Tools
- [ ] Collapsible sub-sections within sidebar categories
- [ ] "New" and "Popular" badge labels on relevant sidebar items
- [ ] Active/current page highlight state in sidebar
- [ ] Mobile: hamburger button → drawer overlay for sidebar
- [ ] Main content area fills right of sidebar at all breakpoints
- [ ] AdSense placeholder slots integrated into layout at build time (see Track F)

---

## TRACK B — NAMING RESEARCH (separate Claude, spec written)

- [ ] Spawn naming research Claude with NAMING_RESEARCH_SPEC.md
- [ ] Advisor character name decision (working name: "The Vizier")
- [ ] Spending tier labels decision (replace "Low Spender" etc. with non-insulting alternatives)
- [ ] Approve naming results before building Track C

---

## TRACK C — AI ADVISOR HOOK (blocked on Track B)

- [ ] Design advisor avatar (SVG, gold/royal theme, fits medieval aesthetic)
- [ ] Persistent widget: fixed bottom-right corner, collapsed to avatar bubble by default
- [ ] Expand on click → chat panel slides up
- [ ] Phase 1: rule-based scripted responses from advice tree (no API cost)
- [ ] Greeting by in-game name after FID lookup: "Welcome back, [name]..."
- [ ] 9 scripted advice paths: 3 spend tiers × 3 server stages
- [ ] Phase 2 placeholder CTA inside widget: "Unlock full AI analysis — Pro"
- [ ] Widget persists and remembers profile across page navigations (sessionStorage)

---

## TRACK D — CALCULATORS

### Tier 1 — Build First (highest cross-site demand)
- [ ] Building Upgrade Calculator
- [ ] Troop Training Calculator (must include HoG / KvK / TSG event points — competitors miss this)
- [ ] Governor Gear Calculator
- [ ] Governor Charm Calculator
- [ ] Pet Upgrade Calculator
- [ ] Hero Shard Calculator

### Tier 2 — Build Next
- [ ] Hero XP Calculator
- [ ] Hero Gear / Enhancement Calculator
- [ ] Hero Stat Comparison Tool ("best time to replace your hero")
- [ ] KvK Score Calculator
- [ ] War Academy Calculator
- [ ] VIP Calculator
- [ ] Tempered Truegold / Truegold Calculator

### Tier 3 — Differentiation (unique or rare across competitors)
- [ ] Alliance Mobilization Calculator
- [ ] Forgehammer Calculator
- [ ] Forgehammer Set Calculator
- [ ] Pack Value Calculator (personalized to player profile — our unique version)
- [ ] Viking Vengeance Calculator
- [ ] Troop Split Calculator (Bear Hunt / Vikings)
- [ ] Mystic Trials Optimizer
- [ ] Healing Cost Calculator
- [ ] Rally Planner
- [ ] Map Planner

### Tier 4 — Phase 3 (complex, deprioritized)
- [ ] Battle & Bear Hunt Simulator
- [ ] Castle Battle Scheduler
- [ ] Appointment Planner (ministry rotations)

### Calculator infrastructure (applies to all)
- [ ] FID profile stored in sessionStorage, shared to all calculator pages
- [ ] Calculators pre-fill relevant fields from profile (furnace level, server stage, spend tier)
- [ ] Accuracy note displayed on all calculators: "Verify values in-game — data sourced from kingshotdata.com"

---

## TRACK E — GIFT CODES & AUTO-APPLY

- [ ] Gift codes page: active codes list, manually maintained, free tier
- [ ] Free tier: display codes, one-click copy, link to in-game redeem screen
- [ ] Pro tier: auto-apply — store player FID, POST each new code to Century Games API on their behalf
- [ ] Legal disclaimer: "Auto-apply depends on Century Games API availability. If the service is interrupted, billing pauses automatically. No refunds for API-side failures."
- [ ] Pricing: $0.99/month standalone OR included in higher Pro tier bundle (decision pending)
- [ ] Infrastructure: webhook or scheduled job fires when new code is added → POSTs to API for all Pro FIDs
- [ ] Handle API failures gracefully: log, notify player, do not silently fail

---

## TRACK F — MONETIZATION INFRASTRUCTURE

### AdSense Placeholders (build into layout from day one)
- [ ] Sidebar bottom slot (below nav links, above footer)
- [ ] Calculator pages: below result, above fold on mobile
- [ ] Gift codes page: between code listings
- [ ] Homepage: below advisor section, above tools grid
- [ ] All placeholders sized to standard AdSense units (300×250, 728×90, 320×50 mobile)
- [ ] Placeholder divs use class `ad-slot` with data attributes — swap real ad code in when approved

### Rewarded Ad Pathway (F2P access to paywalled content)
- [ ] Identify which Pro features are "watch an ad to unlock temporarily":
  - Suggested: Pack Value Advisor (1 free analysis per ad watch)
  - Suggested: Extended advisor response (deeper analysis, 24hr unlock)
  - Suggested: One server intelligence lookup per ad watch (when that feature exists)
- [ ] "Watch a short ad to unlock" button on paywalled sections (free alternative to subscribing)
- [ ] Session-based unlock: ad watched → feature unlocked for current session only
- [ ] Integration: Google AdSense rewarded ads or equivalent (requires AdSense approval first)
- [ ] Do NOT gate calculators behind ads — calculators must always be free, no friction

### Subscription Tiers (to define, not yet built)
- [ ] Define tier structure: Free / Pro / ? 
  - Free: all calculators, gift code page, basic advisor, ad-supported
  - Pro ($X/month): auto-apply gift codes ($0.99 standalone or bundled), AI advisor, pack value advisor, event optimizer, ad-free
- [ ] Stripe integration (Phase 2)
- [ ] FID stored server-side for Pro subscribers (requires minimal backend — Netlify Functions or similar)

---

## TRACK G — FID SYSTEM (core infrastructure)

- [x] FID lookup form on homepage
- [ ] Manual entry fallback (CORS failure or API down)
- [ ] sessionStorage profile: nickname, furnace level, kid (server), spend tier, server age estimate
- [ ] Profile card display after lookup
- [ ] Profile accessible across all pages without re-entry
- [ ] "Update my FID" link in sidebar for returning players

---

## DECISIONS PENDING (not blocked, but need answer before building)

1. **Advisor character name** — waiting on naming research (Track B)
2. **Spending tier labels** — waiting on naming research (Track B)
3. **Pro tier price and structure** — $0.99 standalone gift code auto-apply, or what does the full Pro bundle cost?
4. **Backend for Pro subscribers** — Netlify Functions sufficient for FID storage + auto-apply, or do we need something more?
5. **AdSense application** — needs to be submitted once site has real content (do this after Tier 1 calculators are live)

---

## SEQUENCE

```
Track A (layout) → Track D Tier 1 (calculators) → Submit AdSense application
Track B (naming) → Track C (advisor hook)
Track E (gift codes) runs parallel after layout done
Track F placeholders built during Track A, real ads after AdSense approved
```
