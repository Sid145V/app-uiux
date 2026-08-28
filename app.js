/* ==========================================================================
   Miror Symptom Tracker — Core Application
   Complete state management, navigation, event system, and primary screens
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. APP STATE
   -------------------------------------------------------------------------- */
const AppState = {
  currentTab: 'home',
  screenStack: [],
  hasOnboarded: false, // Default to false so onboarding launches immediately on app load
  user: { name: 'Priya', streak: 4, bloomDay: 4, totalPoints: 1250, monthPoints: 120, wellnessScore: 72 },
  userOnboarding: {
    name: '',
    age: '',
    journeyStage: null,
    symptoms: [],
    primaryFocus: null, // Sleep | Energy | Mood | Brain fog | Weight | Understanding what’s happening
    supportGoals: [],
    currentCare: null
  },
  todayReminders: [
    { id: 'rem-1', text: '', time: '8:00 PM', completed: false },
    { id: 'rem-2', text: 'Daily Symptom & Wellness Log', time: '9:00 PM', completed: false },
    { id: 'rem-3', text: 'Hydration & Cooling Break', time: '2:30 PM', completed: true }
  ],
  todayCheckin: { completed: false, mood: null, symptoms: [], severities: {}, wellness: { sleep: 0, water: 0, stress: 0, activity: 0, nutrition: 0, hrt: false, supplements: false }, reflection: '' },
  onboarding: { goals: [], symptoms: [] },
  history: [
    { date: '2026-07-29', mood: 'good', symptoms: ['fatigue','brain-fog'], severities: {fatigue:'mild','brain-fog':'moderate'}, wellness: {sleep:6,water:5,stress:3,activity:4,nutrition:6} },
    { date: '2026-07-30', mood: 'okay', symptoms: ['hot-flashes','poor-sleep','fatigue'], severities: {'hot-flashes':'high','poor-sleep':'moderate',fatigue:'moderate'}, wellness: {sleep:4,water:6,stress:7,activity:2,nutrition:5} },
    { date: '2026-07-31', mood: 'low', symptoms: ['hot-flashes','mood-swings','joint-pain','poor-sleep'], severities: {'hot-flashes':'severe','mood-swings':'high','joint-pain':'moderate','poor-sleep':'high'}, wellness: {sleep:3,water:4,stress:8,activity:1,nutrition:4} },
    { date: '2026-08-01', mood: 'okay', symptoms: ['brain-fog','fatigue','stress'], severities: {'brain-fog':'moderate',fatigue:'mild',stress:'moderate'}, wellness: {sleep:5,water:7,stress:5,activity:3,nutrition:6} },
    { date: '2026-08-02', mood: 'good', symptoms: ['fatigue'], severities: {fatigue:'mild'}, wellness: {sleep:7,water:8,stress:3,activity:5,nutrition:7} },
    { date: '2026-08-03', mood: 'amazing', symptoms: [], severities: {}, wellness: {sleep:8,water:8,stress:2,activity:6,nutrition:8} },
    { date: '2026-08-04', mood: 'good', symptoms: ['brain-fog','headache'], severities: {'brain-fog':'mild',headache:'mild'}, wellness: {sleep:7,water:6,stress:4,activity:4,nutrition:7} }
  ],
  insightTab: 'today',
  communityTab: 'all'
};
window.AppState = AppState;

/* --------------------------------------------------------------------------
   2. CONSTANTS
   -------------------------------------------------------------------------- */
const MOODS = [
  { id: 'amazing', emoji: '🌟', label: 'Amazing', color: '#10B981' },
  { id: 'good', emoji: '😊', label: 'Good', color: '#34D399' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#F59E0B' },
  { id: 'low', emoji: '😔', label: 'Low', color: '#F97316' },
  { id: 'rough', emoji: '😣', label: 'Rough', color: '#EF4444' }
];

const SYMPTOM_CATEGORIES = [
  { id: 'temperature', icon: '🌡️', name: 'Temperature', symptoms: [
    { id: 'hot-flashes', name: 'Hot flashes' }, { id: 'night-sweats', name: 'Night sweats' }, { id: 'cold-sensitivity', name: 'Cold sensitivity' }
  ]},
  { id: 'mind', icon: '🧠', name: 'Mind', symptoms: [
    { id: 'brain-fog', name: 'Brain fog' }, { id: 'forgetfulness', name: 'Forgetfulness' }, { id: 'poor-focus', name: 'Poor focus' }
  ]},
  { id: 'mood', icon: '😟', name: 'Mood', symptoms: [
    { id: 'stress', name: 'Stress' }, { id: 'anxiety', name: 'Anxiety' }, { id: 'mood-swings', name: 'Mood swings' }
  ]},
  { id: 'sleep', icon: '😴', name: 'Sleep', symptoms: [
    { id: 'poor-sleep', name: 'Poor sleep' }, { id: 'restless-sleep', name: 'Restless sleep' }
  ]},
  { id: 'energy', icon: '⚡', name: 'Energy', symptoms: [
    { id: 'fatigue', name: 'Fatigue' }, { id: 'low-energy', name: 'Low energy' }
  ]},
  { id: 'body', icon: '🦴', name: 'Body', symptoms: [
    { id: 'joint-pain', name: 'Joint pain' }, { id: 'headache', name: 'Headache' }, { id: 'breast-tenderness', name: 'Breast tenderness' }
  ]},
  { id: 'digestion', icon: '🫁', name: 'Digestion', symptoms: [
    { id: 'bloating', name: 'Bloating' }, { id: 'nausea', name: 'Nausea' }
  ]},
  { id: 'skin-hair', icon: '✨', name: 'Skin & Hair', symptoms: [
    { id: 'dry-skin', name: 'Dry skin' }, { id: 'hair-thinning', name: 'Hair thinning' }
  ]},
  { id: 'heart', icon: '💓', name: 'Heart', symptoms: [
    { id: 'palpitations', name: 'Palpitations' }, { id: 'racing-heart', name: 'Racing heart' }
  ]}
];

const SEVERITY_LEVELS = [
  { id: 'none', label: 'None', color: '#D1D5DB', glow: 'transparent' },
  { id: 'mild', label: 'Mild', color: '#10B981', glow: 'rgba(16,185,129,0.3)' },
  { id: 'moderate', label: 'Moderate', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
  { id: 'high', label: 'High', color: '#F97316', glow: 'rgba(249,115,22,0.3)' },
  { id: 'severe', label: 'Severe', color: '#EF4444', glow: 'rgba(239,68,68,0.4)' }
];
window.SEVERITY_LEVELS = SEVERITY_LEVELS;

const WELLNESS_FACTORS = [
  { id: 'sleep', icon: '😴', label: 'Sleep', unit: 'hrs', max: 12 },
  { id: 'water', icon: '💧', label: 'Water', unit: 'glasses', max: 12 },
  { id: 'stress', icon: '😰', label: 'Stress', unit: 'level', max: 10 },
  { id: 'activity', icon: '🏃‍♀️', label: 'Activity', unit: 'mins', max: 120 }
];
window.WELLNESS_FACTORS = WELLNESS_FACTORS;

/* --------------------------------------------------------------------------
   3. SCREEN MANAGER
   -------------------------------------------------------------------------- */
class ScreenManager {
  constructor() {
    this.container = document.getElementById('screenContainer');
    this.screens = {};
    this.transitioning = false;
  }

  register(id, fn) { this.screens[id] = fn; }

  show(id, params = {}, anim = 'fade') {
    if (this.transitioning || !this.screens[id]) return;
    this.transitioning = true;
    AppState.screenStack = [{ id, params }];
    this._render(id, params, anim);
  }

  render() {
    if (AppState.screenStack && AppState.screenStack.length > 0) {
      const cur = AppState.screenStack[AppState.screenStack.length - 1];
      this._render(cur.id, cur.params || {}, 'fade');
    } else {
      this._render(AppState.currentTab || 'home', {}, 'fade');
    }
  }

  push(id, params = {}) {
    if (this.transitioning || !this.screens[id]) return;
    this.transitioning = true;
    AppState.screenStack.push({ id, params });
    this._render(id, params, 'slide-right');
  }

  pop() {
    if (this.transitioning) return;
    if (AppState.screenStack.length > 1) {
      this.transitioning = true;
      AppState.screenStack.pop();
      const prev = AppState.screenStack[AppState.screenStack.length - 1];
      if (['home', 'insights', 'community', 'activities', 'care-plus', 'explore', 'shop', 'tracking', 'profile'].includes(prev.id)) {
        AppState.currentTab = prev.id;
        this._updateNav();
      }
      this._render(prev.id, prev.params || {}, 'slide-left');
    } else {
      this.switchTab('community');
    }
  }

  switchTab(tab) {
    if (this.transitioning) return;
    AppState.currentTab = tab;
    this._updateNav();
    const rootScreen = tab === 'track' ? (AppState.todayCheckin.completed ? 'track-done-today' : 'track-mood') : tab;
    this.show(rootScreen, {}, 'fade');
  }

  replace(id, params = {}) {
    if (AppState.screenStack.length > 0) AppState.screenStack.pop();
    AppState.screenStack.push({ id, params });
    this._render(id, params, 'fade');
  }

  _render(id, params, anim) {
    this.transitioning = false;
    const html = this.screens[id](params);
    const el = document.createElement('div');
    el.className = 'screen active';
    el.id = 'screen-' + id;
    el.innerHTML = html;
    restructureScreenLayout(el);

    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      bottomNav.style.display = id === 'onboarding' ? 'none' : 'flex';
    }

    if (anim === 'slide-right') el.style.animation = 'slideInRight 300ms ease forwards';
    else if (anim === 'slide-left') el.style.animation = 'slideInLeft 300ms ease forwards';
    else el.style.animation = 'fadeIn 250ms ease forwards';

    this.container.innerHTML = '';
    this.container.appendChild(el);
    initCarousels(el);

    // Floating Create Post / Ask Doctor button
    if (typeof window.updateCommunityFabState === 'function') {
      window.updateCommunityFabState(window.currentCommunityTab);
    } else {
      const careFab = document.getElementById('care-fab-btn');
      if (careFab) {
        const showOnCarePlusFeed = id === 'care-plus' && window.isMirorCarePlusSubscribed && !window.showCarePlusSubscriptionPreview && window.currentCarePlusView === 'feed';
        const showOnGroup = id === 'community-group';
        const showOnCommunity = id === 'community' && (window.currentCommunityTab !== 'trending' && window.currentCommunityTab !== 'groups');
        if (showOnCarePlusFeed || showOnGroup || showOnCommunity) {
          careFab.style.display = 'flex';
          careFab.style.bottom = '84px';
        } else {
          careFab.style.display = 'none';
        }
      }
    }

    // Toggle Care+ Floating Paywall Dock (Contained 100% inside mobile frame)
    if (typeof window.updateCareFloatingDockVisibility === 'function') {
      window.updateCareFloatingDockVisibility(id);
    }

    setTimeout(() => { this.transitioning = false; }, 310);
  }

  _updateNav() {
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.tab === AppState.currentTab);
    });

    if (typeof window.updateCommunityFabState === 'function') {
      window.updateCommunityFabState(window.currentCommunityTab);
    } else {
      const careFab = document.getElementById('care-fab-btn');
      if (careFab) {
        const cur = AppState.screenStack && AppState.screenStack.length ? AppState.screenStack[AppState.screenStack.length - 1].id : AppState.currentTab;
        const showOnCarePlusFeed = cur === 'care-plus' && window.isMirorCarePlusSubscribed && !window.showCarePlusSubscriptionPreview && window.currentCarePlusView === 'feed';
        const showOnGroup = cur === 'community-group';
        const showOnCommunity = cur === 'community' && (window.currentCommunityTab !== 'trending' && window.currentCommunityTab !== 'groups');
        if (showOnCarePlusFeed || showOnGroup || showOnCommunity) {
          careFab.style.display = 'flex';
          careFab.style.bottom = '84px';
        } else {
          careFab.style.display = 'none';
        }
      }
    }

    if (typeof window.updateCareFloatingDockVisibility === 'function') {
      window.updateCareFloatingDockVisibility(AppState.currentTab);
    }
  }

  toast(msg, duration = 3000) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = msg;
    t.style.cssText = 'position:absolute;top:60px;left:50%;transform:translateX(-50%);background:white;padding:12px 24px;border-radius:50px;box-shadow:0 8px 32px rgba(0,0,0,0.12);z-index:999;font-size:14px;font-weight:500;animation:fadeInUp 300ms ease;white-space:nowrap;';
    (document.getElementById('app') || document.body).appendChild(t);
    setTimeout(() => { t.style.animation = 'fadeIn 200ms ease reverse'; setTimeout(() => t.remove(), 200); }, duration);
  }

  sheet(html) {
    const overlay = document.createElement('div');
    overlay.className = 'bottom-sheet-overlay active';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.35);z-index:900;animation:fadeIn 200ms ease;';
    const sheet = document.createElement('div');
    sheet.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:white;border-radius:28px 28px 0 0;padding:20px 20px 40px;z-index:901;animation:slideUp 350ms cubic-bezier(0.4,0,0.2,1);max-height:85%;overflow-y:auto;';
    sheet.innerHTML = '<div style="width:40px;height:5px;background:#E5E7EB;border-radius:3px;margin:0 auto 20px;"></div>' + html;
    const close = () => { overlay.style.animation = 'fadeIn 200ms ease reverse'; sheet.style.animation = 'slideUp 250ms ease reverse'; setTimeout(() => { overlay.remove(); sheet.remove(); }, 250); };
    overlay.onclick = close;
    (document.getElementById('app') || document.body).appendChild(overlay);
    (document.getElementById('app') || document.body).appendChild(sheet);
    return close;
  }
}

const SM = new ScreenManager();
window.SM = SM;
window.MOODS = MOODS;
window.SYMPTOM_CATEGORIES = SYMPTOM_CATEGORIES;

/* --------------------------------------------------------------------------
   4. RENDER HELPERS
   -------------------------------------------------------------------------- */
function topBar(title, opts = {}) {
  const back = opts.back !== false ? `<button class="back-button" data-action="back">‹</button>` : '<div style="width:44px"></div>';
  const action = opts.action || '<div style="width:44px"></div>';
  // opts.roomy: the generous "Miror Care+"-style header spacing (large gap
  // above the title, consistent gap below it before tabs/content). Used by
  // the primary tab screens (Activities, Care, Tracking, Shop) that share
  // this layout rhythm; other headers keep the compact default.
  const roomyClass = opts.roomy ? ' top-bar--roomy' : '';
  return `<div class="top-bar screen-fixed-header${roomyClass}"><div>${back}</div><span class="top-bar-title">${title}</span><div>${action}</div></div>`;
}
window.topBar = topBar;

/* Shared screen layout architecture: every screen's rendered HTML is split into
   a non-scrolling header region (any direct-child element marked with
   .screen-fixed-header — the title bar, and any tab/segmented-control bar
   right under it) and a single scrollable content region holding everything
   else. This keeps headers structurally outside the scroll flow instead of
   faking fixed position with position:sticky inside the scrolling content. */
function restructureScreenLayout(screenEl) {
  if (!screenEl) return;
  const children = Array.from(screenEl.children);
  const headerNodes = children.filter(c => c.classList && c.classList.contains('screen-fixed-header'));
  const contentNodes = children.filter(c => !(c.classList && c.classList.contains('screen-fixed-header')));

  if (headerNodes.length) {
    const headerWrap = document.createElement('div');
    headerWrap.className = 'screen-header-fixed';
    headerNodes.forEach(n => headerWrap.appendChild(n));
    screenEl.appendChild(headerWrap);
  }

  let scrollWrap;
  if (contentNodes.length === 1 && contentNodes[0].classList && contentNodes[0].classList.contains('screen-scroll')) {
    scrollWrap = contentNodes[0];
  } else {
    scrollWrap = document.createElement('div');
    scrollWrap.className = 'screen-scroll';
    contentNodes.forEach(n => scrollWrap.appendChild(n));
  }
  screenEl.appendChild(scrollWrap);
}
window.restructureScreenLayout = restructureScreenLayout;

function progressBar(step, total) {
  const pct = (step / total) * 100;
  return `<div class="screen-fixed-header" style="background:#FFFFFF;padding:4px 20px 10px;border-bottom:1px solid #F1F5F9;"><div class="progress-bar" style="height:5px;background:#F1F5F9;border-radius:3px;overflow:hidden;margin-top:10px;"><div class="progress-fill" style="width:${pct}%;height:100%;background:linear-gradient(135deg, #EC5DAA 0%, #B14AC8 50%, #7A3FD1 100%);border-radius:3px;"></div></div><p class="text-caption text-muted text-center" style="margin-top:6px;font-family:'Montserrat',sans-serif;font-size:11.5px;font-weight:500;color:#94A3B8;margin-bottom:0;">Step ${step} of ${total}</p></div>`;
}
window.progressBar = progressBar;

function moodEmoji(moodId) { return (MOODS.find(m => m.id === moodId) || {}).emoji || '😐'; }
function moodLabel(moodId) { return (MOODS.find(m => m.id === moodId) || {}).label || 'Unknown'; }
window.moodEmoji = moodEmoji;
window.moodLabel = moodLabel;

function card(content, cls = '') { return `<div class="card ${cls}">${content}</div>`; }
window.card = card;
function section(title, content, viewAll, marginB = '24px') {
  let va = '';
  if (viewAll) {
    if (viewAll === 'open-today-insights') {
      va = `<button class="btn-ghost text-caption" data-action="open-today-insights" style="color:var(--miror-pink);font-weight:600;font-size:13px;">View all →</button>`;
    } else {
      va = `<button class="btn-ghost text-caption" data-action="push" data-screen="${viewAll}" style="color:var(--miror-pink);font-weight:600;font-size:13px;">View all →</button>`;
    }
  }
  return `<div style="margin-bottom:${marginB};"><div class="flex-between" style="padding:0 20px;margin-bottom:12px;"><h3 class="text-h3">${title}</h3>${va}</div>${content}</div>`;
}

function initCarousels(root = document) {
  setTimeout(() => {
    const carousels = root.querySelectorAll('.insights-carousel, .scroll-h');
    carousels.forEach(c => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasMoved = false;

      c.addEventListener('mousedown', (e) => {
        isDown = true;
        hasMoved = false;
        startX = e.pageX - c.offsetLeft;
        scrollLeft = c.scrollLeft;
        c.style.scrollSnapType = 'none';
      });

      const onMouseUp = () => {
        if (isDown) {
          isDown = false;
          c.style.scrollSnapType = 'x mandatory';
        }
      };

      window.addEventListener('mouseup', onMouseUp);

      c.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - c.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) {
          hasMoved = true;
        }
        c.scrollLeft = scrollLeft - walk;
      });

      c.addEventListener('click', (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);

      // Pagination dot syncing
      const wrapper = c.closest('.insights-carousel-wrapper');
      if (wrapper) {
        const dots = wrapper.querySelectorAll('.carousel-dot');
        if (dots.length) {
          const updateDots = () => {
            const cards = c.querySelectorAll('.insights-card');
            if (!cards.length) return;
            const cardWidth = cards[0].offsetWidth + 14;
            const idx = Math.min(dots.length - 1, Math.max(0, Math.round(c.scrollLeft / cardWidth)));
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          };
          c.addEventListener('scroll', updateDots, { passive: true });

          dots.forEach((d, idx) => {
            d.addEventListener('click', (e) => {
              e.stopPropagation();
              const cards = c.querySelectorAll('.insights-card');
              if (cards[idx]) {
                cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }
            });
          });
        }
      }
    });
  }, 50);
}

function chipBtn(text, active, action, data = '') {
  const cls = active ? 'chip active' : 'chip';
  return `<button class="${cls}" data-action="${action}" ${data} style="font-size:14px;">${text}</button>`;
}

function symptomName(id) {
  for (const cat of SYMPTOM_CATEGORIES) { const s = cat.symptoms.find(s => s.id === id); if (s) return s.name; }
  return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
window.symptomName = symptomName;

function symptomIcon(id) {
  for (const cat of SYMPTOM_CATEGORIES) { if (cat.symptoms.find(s => s.id === id)) return cat.icon; }
  return '•';
}
window.symptomIcon = symptomIcon;

function severityColor(level) { return (SEVERITY_LEVELS.find(s => s.id === level) || {}).color || '#D1D5DB'; }
window.severityColor = severityColor;

function miniBarChart(data, height = 60) {
  const max = Math.max(...data.map(d => d.value), 1);
  return `<div style="display:flex;align-items:flex-end;gap:4px;height:${height}px;">
    ${data.map(d => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:100%;height:${(d.value/max)*height*0.8}px;background:${d.color || 'var(--miror-gradient)'};border-radius:4px;min-height:4px;background:linear-gradient(180deg,${d.color || '#FF6B9D'},${d.color ? d.color+'99' : '#C471ED'});"></div>
      <span style="font-size:9px;color:var(--miror-text-muted);">${d.label}</span>
    </div>`).join('')}
  </div>`;
}
window.miniBarChart = miniBarChart;

function miniLineChart(values, color = '#FF6B9D', h = 50) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 80}`).join(' ');
  return `<svg viewBox="0 0 100 100" style="height:${h}px;width:100%;" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="0,100 ${pts} 100,100" fill="url(#chartGrad)" opacity="0.15"/>
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  </svg>`;
}
window.miniLineChart = miniLineChart;

function confetti() {
  const colors = ['#FF6B9D', '#C471ED', '#34D399', '#F59E0B', '#60A5FA'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.style.cssText = `position:fixed;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[i%colors.length]};border-radius:${Math.random()>0.5?'50%':'2px'};left:${Math.random()*100}vw;top:-10px;z-index:999;pointer-events:none;animation:confettiFall ${1.5+Math.random()*2}s ease-out ${Math.random()*0.5}s forwards;`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}
window.confetti = confetti;

// Inject confetti keyframe if not exists
if (!document.getElementById('miror-extra-css')) {
  const style = document.createElement('style');
  style.id = 'miror-extra-css';
  style.textContent = `
    @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
    @keyframes bloomPulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,107,157,0.3)} 50%{transform:scale(1.08);box-shadow:0 0 20px 8px rgba(255,107,157,0.15)} }
    @keyframes scoreReveal { 0%{stroke-dashoffset:283} 100%{stroke-dashoffset:var(--score-offset)} }
    @keyframes floatUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
    .stagger > *:nth-child(1){animation-delay:0ms} .stagger > *:nth-child(2){animation-delay:60ms} .stagger > *:nth-child(3){animation-delay:120ms} .stagger > *:nth-child(4){animation-delay:180ms} .stagger > *:nth-child(5){animation-delay:240ms} .stagger > *:nth-child(6){animation-delay:300ms} .stagger > *:nth-child(7){animation-delay:360ms} .stagger > *:nth-child(8){animation-delay:420ms} .stagger > *:nth-child(9){animation-delay:480ms}
    .float-item { animation: floatUp 400ms ease both; }
    .nav-item-center { position:relative; }
    .nav-icon-center { width:52px;height:52px;border-radius:50%;background:var(--miror-gradient);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(255,107,157,0.35);margin-bottom:4px;margin-top:-20px; }
    .nav-item-center .nav-label { margin-top:2px; }
    .nav-item-center.active .nav-icon-center { box-shadow:0 4px 24px rgba(255,107,157,0.5); }
    .nav-item-center::after { display:none !important; }
    .severity-bloom { width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;border:2px solid #E5E7EB;background:white;color:var(--miror-text-secondary); }
    .severity-bloom.active { color:white;border-color:transparent;transform:scale(1.15); }
    .severity-bloom:hover { transform:scale(1.05); }
    .wellness-range { -webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:#E5E7EB;outline:none; }
    .wellness-range::-webkit-slider-thumb { -webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--miror-gradient);cursor:pointer;box-shadow:0 2px 8px rgba(255,107,157,0.3); }
    .scroll-h { display:flex;overflow-x:auto;gap:12px;padding:0 20px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch; }
    .scroll-h::-webkit-scrollbar { display:none; }
    .scroll-h > * { scroll-snap-align:start;flex-shrink:0; }
    .home-indicator { width:134px;height:5px;background:#1A1A2E;border-radius:3px;margin:8px auto;opacity:0.2; }
    .toggle-switch { width:48px;height:28px;border-radius:14px;background:#E5E7EB;position:relative;cursor:pointer;transition:background 0.2s; }
    .toggle-switch.on { background:var(--miror-pink); }
    .toggle-switch::after { content:'';width:24px;height:24px;border-radius:50%;background:white;position:absolute;top:2px;left:2px;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15); }
    .toggle-switch.on::after { transform:translateX(20px); }
    .calendar-dot { width:6px;height:6px;border-radius:50%;display:inline-block; }
    .body-map-zone { padding:14px 20px;border-radius:16px;border:1.5px solid var(--miror-border);background:white;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:12px; }
    .body-map-zone:active,.body-map-zone.active { border-color:var(--miror-pink);background:var(--miror-pink-lighter); }
    .miror-rate-row { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:white;border-radius:16px;border:1px solid var(--miror-border);box-shadow:0 1px 4px rgba(0,0,0,0.02); }
    .miror-rate-btn { width:38px;height:38px;border-radius:11px;border:none;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .miror-rate-btn[data-value="0"] { background:#F3F4F6;color:#6B7280; }
    .miror-rate-btn[data-value="1"] { background:#FFF0F5;color:#FF6B9D; }
    .miror-rate-btn[data-value="2"] { background:#F5EEF8;color:#9B59B6; }
    .miror-rate-btn[data-value="3"] { background:#FCE7F3;color:#DB2777; }
    .miror-rate-btn.active[data-value="0"] { background:#9CA3AF !important;color:white !important;box-shadow:0 2px 8px rgba(0,0,0,0.15);transform:scale(1.05); }
    .miror-rate-btn.active[data-value="1"] { background:#FF6B9D !important;color:white !important;box-shadow:0 4px 14px rgba(255,107,157,0.4) !important;transform:scale(1.08); }
    .miror-rate-btn.active[data-value="2"] { background:#9B59B6 !important;color:white !important;box-shadow:0 4px 14px rgba(155,89,182,0.4) !important;transform:scale(1.08); }
    .miror-rate-btn.active[data-value="3"] { background:linear-gradient(135deg,#FF6B9D,#9B59B6) !important;color:white !important;box-shadow:0 4px 16px rgba(255,107,157,0.5) !important;transform:scale(1.1); }
  `;
  document.head.appendChild(style);
}

/* --------------------------------------------------------------------------
   5. EVENT SYSTEM
   -------------------------------------------------------------------------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;

  switch (a) {
    case 'switchTab': SM.switchTab(t.dataset.tab); break;
    case 'push': SM.push(t.dataset.screen, t.dataset); break;
    case 'back': SM.pop(); break;
    case 'replace': SM.replace(t.dataset.screen, t.dataset); break;
    case 'goHome': SM.switchTab('community'); break;
    case 'open-ask-miror':
      window.currentCommunityTab = 'ask-miror';
      SM.switchTab('community');
      break;
    case 'open-today-insights':
      AppState.insightTab = 'today';
      SM.switchTab('insights');
      break;

    // Onboarding
    case 'toggle-goal':
      t.classList.toggle('selected');
      t.style.borderColor = t.classList.contains('selected') ? 'var(--miror-pink)' : '';
      t.style.background = t.classList.contains('selected') ? 'var(--miror-pink-lighter)' : '';
      break;
    case 'toggle-onboard-symptom':
      t.classList.toggle('active');
      break;
    case 'finish-onboarding':
      localStorage.setItem('miror_onboarded', 'true');
      AppState.hasOnboarded = true;
      confetti();
      setTimeout(() => SM.switchTab('community'), 800);
      break;

    // Mood selection
    case 'select-overall-mood':
      const oMood = t.dataset.mood;
      AppState.todayCheckin.mood = oMood;
      document.querySelectorAll('.overall-mood-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.borderColor = 'var(--miror-border)';
        btn.style.background = 'white';
        btn.style.boxShadow = '';
        btn.style.transform = '';
      });
      const mItem = MOODS.find(m => m.id === oMood);
      if (mItem) {
        t.classList.add('active');
        t.style.borderColor = mItem.color;
        t.style.background = mItem.color + '15';
        t.style.boxShadow = `0 4px 14px ${mItem.color}30`;
        t.style.transform = 'scale(1.04)';
      }
      break;

    case 'select-mood':
      document.querySelectorAll('.mood-card').forEach(el => { el.classList.remove('selected'); el.style.borderColor = ''; el.style.background = ''; el.style.boxShadow = ''; });
      t.classList.add('selected');
      const moodData = MOODS.find(m => m.id === t.dataset.mood);
      t.style.borderColor = moodData.color;
      t.style.background = moodData.color + '10';
      t.style.boxShadow = `0 4px 20px ${moodData.color}25`;
      t.style.transform = 'scale(1.08)';
      setTimeout(() => { t.style.transform = ''; }, 200);
      AppState.todayCheckin.mood = t.dataset.mood;
      const nb = document.getElementById('mood-next-btn');
      if (nb) { nb.disabled = false; nb.style.opacity = '1'; }
      break;

    // Symptom & Mood Rating
    case 'rate-symptom-num':
      const sId = t.dataset.symptom;
      const numVal = parseInt(t.dataset.value);
      const isMoodType = t.dataset.type === 'mood';
      const numRow = t.closest('.symptom-rate-row, .mood-rate-row');
      if (numRow) {
        numRow.querySelectorAll('.miror-rate-btn').forEach(btn => {
          btn.classList.remove('active');
        });
      }
      t.classList.add('active');

      if (isMoodType) {
        if (!AppState.todayCheckin.wellness) AppState.todayCheckin.wellness = {};
        AppState.todayCheckin.wellness[sId] = numVal;
        if (sId === 'overall-mood') {
          const moodMap = { 0: 'okay', 1: 'good', 2: 'good', 3: 'amazing' };
          AppState.todayCheckin.mood = moodMap[numVal] || 'good';
        }
      } else {
        const levelMap = { 0: 'none', 1: 'mild', 2: 'moderate', 3: 'severe' };
        if (numVal === 0) {
          AppState.todayCheckin.symptoms = AppState.todayCheckin.symptoms.filter(s => s !== sId);
          delete AppState.todayCheckin.severities[sId];
        } else {
          if (!AppState.todayCheckin.symptoms.includes(sId)) {
            AppState.todayCheckin.symptoms.push(sId);
          }
          AppState.todayCheckin.severities[sId] = levelMap[numVal];
        }
      }
      break;

    case 'toggle-symptom':
      t.classList.toggle('active');
      const sym = t.dataset.symptom;
      if (AppState.todayCheckin.symptoms.includes(sym)) {
        AppState.todayCheckin.symptoms = AppState.todayCheckin.symptoms.filter(s => s !== sym);
        delete AppState.todayCheckin.severities[sym];
      } else {
        AppState.todayCheckin.symptoms.push(sym);
        AppState.todayCheckin.severities[sym] = 'mild';
      }
      break;
    case 'skip-symptoms':
      AppState.todayCheckin.symptoms = [];
      AppState.todayCheckin.severities = {};
      SM.push('track-wellness');
      break;

    // Severity bloom
    case 'set-severity':
      const sev = t.dataset.level;
      const symSev = t.dataset.symptom;
      AppState.todayCheckin.severities[symSev] = sev;
      const row = t.closest('.severity-row');
      row.querySelectorAll('.severity-bloom').forEach(b => {
        b.classList.remove('active');
        b.style.background = '';
        b.style.boxShadow = '';
      });
      const lvl = SEVERITY_LEVELS.find(l => l.id === sev);
      t.classList.add('active');
      t.style.background = lvl.color;
      t.style.boxShadow = `0 0 20px ${lvl.glow}`;
      break;

    // Wellness toggles
    case 'toggle-wellness':
      const wf = t.dataset.factor;
      AppState.todayCheckin.wellness[wf] = !AppState.todayCheckin.wellness[wf];
      t.classList.toggle('on');
      break;

    // Finish check-in
    case 'finish-checkin':
      AppState.todayCheckin.completed = true;
      AppState.user.totalPoints += 10;
      AppState.user.streak++;
      confetti();
      SM.push('track-complete');
      break;

    // Insight tab switching
    case 'insight-tab':
      AppState.insightTab = t.dataset.tab;
      document.querySelectorAll('.insight-tab-btn').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      SM.replace('insights');
      break;

    // Calendar day
    case 'view-day':
      SM.push('insights-day', { date: t.dataset.date });
      break;

    // Community tab
    case 'community-tab':
      AppState.communityTab = t.dataset.tab;
      document.querySelectorAll('.comm-tab').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      break;

    // Body zone
    case 'body-zone':
      const zone = t.dataset.zone;
      const zoneSymptoms = {
        head: ['brain-fog', 'headache', 'forgetfulness', 'poor-focus'],
        chest: ['palpitations', 'racing-heart', 'breast-tenderness'],
        core: ['bloating', 'nausea', 'hot-flashes'],
        joints: ['joint-pain'],
        legs: ['restless-sleep', 'fatigue']
      };
      const zs = zoneSymptoms[zone] || [];
      const recent = AppState.history.flatMap(h => h.symptoms);
      const matching = zs.filter(s => recent.includes(s));
      SM.sheet(`
        <h3 class="text-h2" style="margin-bottom:16px;">${zone.charAt(0).toUpperCase() + zone.slice(1)} Symptoms</h3>
        ${matching.length ? matching.map(s => `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--miror-border);">
          <span style="font-size:20px;">${symptomIcon(s)}</span>
          <div><div class="text-body" style="font-weight:500;">${symptomName(s)}</div>
          <div class="text-caption text-muted">Logged ${recent.filter(r => r === s).length} times this week</div></div>
        </div>`).join('') : '<p class="text-body text-muted" style="padding:20px 0;">No symptoms logged for this area recently.</p>'}
      `);
      break;

    // Share report
    case 'share-report':
      SM.sheet(`
        <h3 class="text-h2" style="margin-bottom:20px;">Share Report</h3>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <button class="btn btn-ghost" style="justify-content:flex-start;gap:12px;">📧 Email to Doctor</button>
          <button class="btn btn-ghost" style="justify-content:flex-start;gap:12px;">📱 WhatsApp</button>
          <button class="btn btn-ghost" style="justify-content:flex-start;gap:12px;">📥 Download PDF</button>
          <button class="btn btn-ghost" style="justify-content:flex-start;gap:12px;">📋 Copy Link</button>
          <button class="btn btn-ghost" style="justify-content:flex-start;gap:12px;">🖨️ Print</button>
        </div>
      `);
      break;

    // Start checkin from home
    case 'start-checkin':
      if (AppState.todayCheckin.completed) SM.push('track-done-today');
      else SM.push('track-mood');
      break;
  }
});

// Slider & input events
document.addEventListener('input', e => {
  if (e.target.id === 'symptom-search-input' || e.target.id === 'mood-search-input') {
    const q = e.target.value.toLowerCase().trim();
    const selector = e.target.id === 'mood-search-input' ? '.mood-rate-row' : '.symptom-rate-row';
    document.querySelectorAll(selector).forEach(row => {
      const name = (row.dataset.name || '').toLowerCase();
      row.style.display = name.includes(q) ? 'flex' : 'none';
    });
  }
  if (e.target.dataset.wellness) {
    const f = e.target.dataset.wellness;
    AppState.todayCheckin.wellness[f] = parseInt(e.target.value);
    const lbl = document.getElementById('val-' + f);
    if (lbl) lbl.textContent = e.target.value;
  }
  if (e.target.id === 'reflection-input') {
    AppState.todayCheckin.reflection = e.target.value;
  }
});

/* --------------------------------------------------------------------------
   6. ONBOARDING SCREENS
   -------------------------------------------------------------------------- */
SM.register('welcome', () => `
  <div class="container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:40px 32px;">
    <div style="font-size:80px;margin-bottom:32px;animation:bloomPulse 2s ease infinite;">🌸</div>
    <h1 class="text-display gradient-text" style="margin-bottom:12px;animation:floatUp 600ms ease both;">Welcome to Miror</h1>
    <p class="text-body text-secondary" style="margin-bottom:48px;max-width:280px;animation:floatUp 600ms ease 150ms both;">Your personal menopause wellness companion. Understand your body, track your journey.</p>
    <button class="btn btn-primary w-full" data-action="push" data-screen="onboarding-goals" style="animation:floatUp 600ms ease 300ms both;">Begin Your Journey</button>
    <p class="text-caption text-muted" style="margin-top:16px;animation:floatUp 600ms ease 400ms both;">Takes less than 1 minute</p>
  </div>
`);

SM.register('onboarding-goals', () => `
  ${progressBar(1, 3)}
  <div class="container" style="padding:24px 20px;">
    <h2 class="text-h1" style="margin-bottom:8px;">What matters most?</h2>
    <p class="text-body text-secondary" style="margin-bottom:24px;">Select all that apply</p>
    <div class="stagger" style="display:flex;flex-direction:column;gap:12px;">
      ${[
        { id: 'understand', icon: '🔍', title: 'Understand my symptoms', desc: 'Track patterns and find clarity' },
        { id: 'doctor', icon: '📋', title: 'Share with my doctor', desc: 'Generate reports for better care' },
        { id: 'better', icon: '💪', title: 'Feel better every day', desc: 'Get personalized wellness tips' }
      ].map(g => `
        <button class="card card-interactive float-item" data-action="toggle-goal" data-goal="${g.id}" style="display:flex;gap:16px;align-items:center;padding:16px 20px;border:1.5px solid var(--miror-border);transition:all 0.2s;">
          <span style="font-size:28px;">${g.icon}</span>
          <div style="text-align:left;"><div class="text-h3">${g.title}</div><div class="text-caption text-muted">${g.desc}</div></div>
        </button>
      `).join('')}
    </div>
    <button class="btn btn-primary w-full" data-action="push" data-screen="onboarding-symptoms" style="margin-top:32px;">Continue</button>
  </div>
`);

SM.register('onboarding-symptoms', () => `
  ${progressBar(2, 3)}
  <div class="container" style="padding:24px 20px;">
    <h2 class="text-h1" style="margin-bottom:8px;">What are you experiencing?</h2>
    <p class="text-body text-secondary" style="margin-bottom:24px;">Select all that apply — you can change these later</p>
    <div style="display:flex;flex-direction:column;gap:20px;">
      ${SYMPTOM_CATEGORIES.slice(0, 6).map(cat => `
        <div>
          <div class="text-label text-muted" style="margin-bottom:8px;">${cat.icon} ${cat.name}</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${cat.symptoms.map(s => `<button class="chip" data-action="toggle-onboard-symptom" data-symptom="${s.id}">${s.name}</button>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`);

/* --------------------------------------------------------------------------
   ONBOARDING SYSTEM & DYNAMIC HOME PERSONALIZATION
   -------------------------------------------------------------------------- */

window.onboardingDraftState = {
  step: 1,
  name: '',
  age: '',
  journeyStage: null,
  symptoms: [],
  primaryFocus: null, // Sleep | Energy | Mood | Brain fog | Weight | Understanding what’s happening
  supportGoals: [],
  currentCare: null
};

window.startOnboarding = function(startStep = 1) {
  const current = AppState.userOnboarding || {};
  if (startStep === 1) {
    window.onboardingDraftState = {
      step: 1,
      name: '',
      age: '',
      journeyStage: null,
      symptoms: [],
      primaryFocus: null,
      supportGoals: [],
      currentCare: null
    };
  } else {
    window.onboardingDraftState = {
      step: startStep,
      name: current.name || '',
      age: current.age || '',
      journeyStage: current.journeyStage || null,
      symptoms: Array.isArray(current.symptoms) ? [...current.symptoms] : [],
      primaryFocus: current.primaryFocus || null,
      supportGoals: Array.isArray(current.supportGoals) ? [...current.supportGoals] : [],
      currentCare: current.currentCare || null
    };
  }
  if (typeof SM !== 'undefined') {
    SM.show('onboarding');
  }
};

window.setDraftOption = function(key, val) {
  window.onboardingDraftState[key] = val;
  SM.render();
};

window.toggleDraftMultiOption = function(key, val) {
  if (!Array.isArray(window.onboardingDraftState[key])) {
    window.onboardingDraftState[key] = [];
  }
  const arr = window.onboardingDraftState[key];
  const idx = arr.indexOf(val);
  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    arr.push(val);
  }
  SM.render();
};

window.nextOnboardingStep = function() {
  if (window.onboardingDraftState.step < 8) {
    window.onboardingDraftState.step += 1;
    SM.render();
  }
};

window.prevOnboardingStep = function() {
  if (window.onboardingDraftState.step > 1) {
    window.onboardingDraftState.step -= 1;
    SM.render();
  } else {
    SM.switchTab('home');
  }
};

window.completeOnboarding = function() {
  AppState.userOnboarding = { ...window.onboardingDraftState };
  if (AppState.userOnboarding.name && AppState.userOnboarding.name.trim()) {
    AppState.user.name = AppState.userOnboarding.name.trim();
  }
  AppState.hasOnboarded = true;
  SM.toast('Your personalised home screen is ready! ✨');
  SM.switchTab('home');
};

window.toggleHomeReminder = function(id, e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (!AppState.todayReminders || AppState.todayReminders.length === 0) {
    const p = typeof getPersonalisedHomeData === 'function' ? getPersonalisedHomeData() : { reminderItem: 'Magnesium Glycinate (400mg) & Sleep Log' };
    AppState.todayReminders = [
      { id: 'rem-1', text: p.reminderItem || 'Magnesium Glycinate (400mg) & Sleep Log', time: '8:00 PM', completed: false },
      { id: 'rem-2', text: 'Daily Symptom & Wellness Log', time: '9:00 PM', completed: false },
      { id: 'rem-3', text: 'Hydration & Cooling Break', time: '2:30 PM', completed: true }
    ];
  }

  const rem = AppState.todayReminders.find(r => r.id === id);
  if (!rem) return;

  rem.completed = !rem.completed;

  // Immediate DOM update for instantaneous click feedback
  const itemEl = document.getElementById('home-rem-item-' + id);
  if (itemEl) {
    itemEl.style.background = rem.completed ? '#F8FAFC' : '#FFF5F8';
    itemEl.style.borderColor = rem.completed ? '#E2E8F0' : '#FCE7F3';
    
    const checkEl = itemEl.querySelector('.home-rem-checkbox');
    if (checkEl) {
      checkEl.style.border = rem.completed ? 'none' : '1.8px solid #CBD5E1';
      checkEl.style.background = rem.completed ? '#10B981' : '#FFFFFF';
      checkEl.style.boxShadow = rem.completed ? '0 2px 6px rgba(16,185,129,0.3)' : 'none';
      checkEl.innerHTML = rem.completed ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
    }

    const textEl = itemEl.querySelector('.home-rem-text');
    if (textEl) {
      textEl.style.color = rem.completed ? '#94A3B8' : '#0F172A';
      textEl.style.fontWeight = rem.completed ? '500' : '600';
      textEl.style.textDecoration = rem.completed ? 'line-through' : 'none';
    }

    const timeEl = itemEl.querySelector('.home-rem-time');
    if (timeEl) {
      timeEl.style.color = rem.completed ? '#CBD5E1' : '#64748B';
      timeEl.style.textDecoration = rem.completed ? 'line-through' : 'none';
    }
  }

  const counterPill = document.getElementById('home-rem-counter-pill');
  if (counterPill) {
    const total = AppState.todayReminders.length;
    const count = AppState.todayReminders.filter(r => r.completed).length;
    counterPill.textContent = `${count}/${total} Done${count === total ? ' 🎉' : ''}`;
  }
};

function getPersonalisedHomeData() {
  const o = AppState.userOnboarding || {};

  // Resolve primary topic dynamically from user onboarding inputs (NOT hardcoded)
  let focus = o.primaryFocus;

  // Infer focus if primaryFocus was skipped but symptoms were selected
  if (!focus && Array.isArray(o.symptoms) && o.symptoms.length > 0) {
    if (o.symptoms.includes('Sleep issues')) focus = 'Sleep';
    else if (o.symptoms.includes('Low energy')) focus = 'Energy';
    else if (o.symptoms.includes('Mood changes')) focus = 'Mood';
    else if (o.symptoms.includes('Brain fog')) focus = 'Brain fog';
    else if (o.symptoms.includes('Hot flashes') || o.symptoms.includes('Irregular periods')) focus = 'Understanding what’s happening';
  }

  if (!focus) focus = 'Sleep';

  const userName = (o.name && o.name.trim()) ? o.name.trim() : (AppState.user && AppState.user.name ? AppState.user.name : 'Friend');
  const userAge = (o.age && o.age.trim()) ? o.age.trim() : null;

  const themeGradient = 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)';

  const configs = {
    'Sleep': {
      focusTitle: 'Better Sleep',
      focusSub: 'Poor sleep can affect your daytime energy, mood and hormonal balance.',
      badgeIcon: '🌙',
      gradient: themeGradient,
      nextStepTitle: 'How did you sleep last night?',
      nextStepSub: 'Track your sleep patterns & night wakes.',
      nextStepIcon: '🌙',
      programTitle: '7-Day Sleep Reset 🌙',
      programSub: 'Fall asleep faster and wake up refreshed with 15-minute gentle nightly rituals.',
      articleTitle: 'Why am I waking up at 3 AM?',
      articleSub: 'Understand the hormonal reasons behind midlife sleep disruption.',
      articleImg: 'article_sleep_cat.png',
      communityTitle: 'Women are talking about disrupted sleep',
      communitySub: 'Join 174+ members sharing nightly sleep routines & relief tips.',
      reminderItem: 'Magnesium Glycinate (400mg) & Sleep Log',
      recommendedPrograms: [
        {
          id: 'prog-sleep-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '7-Day Sleep Reset 🌙',
          desc: 'Fall asleep faster and wake up refreshed with 15-minute gentle nightly rituals.',
          duration: '7 Days',
          dailyTime: '15 min / day',
          members: '3,206 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.70) 0%, rgba(13, 148, 136, 0.90) 100%)',
          img: 'feed_sleep_routine.jpg'
        },
        {
          id: 'prog-sleep-2',
          tag: 'POPULAR CHOICE ✨',
          badge: 'CARE+ PREMIUM',
          title: '21-Day Night Wakes & Cooling Protocol ❄️',
          desc: 'Target hot flashes, night sweats, and early 3 AM awakenings with expert guidance.',
          duration: '21 Days',
          dailyTime: '20 min / day',
          members: '1,840 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%)',
          img: 'community_yoga_reset.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-sleep-1',
          title: 'Why am I waking up at 3 AM?',
          tag: 'Sleep & Rest',
          author: 'Dr. Sarah Jenkins',
          time: '4 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: false
        },
        {
          id: 'art-sleep-2',
          title: 'Magnesium & Progesterone: Nightly Sleep Protocol',
          tag: 'Sleep & HRT',
          author: 'Dr. Anjali Sharma',
          time: '5 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: false
        },
        {
          id: 'art-sleep-3',
          title: 'Cooling Bedtime Routines for Night Sweats',
          tag: '🔒 CARE+',
          author: 'Midlife Wellness Team',
          time: '4 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: true
        }
      ]
    },
    'Energy': {
      focusTitle: 'Better Energy & Vitality',
      focusSub: 'Combat midlife fatigue and maintain steady stamina throughout your day.',
      badgeIcon: '⚡',
      gradient: themeGradient,
      nextStepTitle: 'How is your energy level today?',
      nextStepSub: 'Log your energy to identify daily peaks & dips.',
      nextStepIcon: '⚡',
      programTitle: '14-Day Energy & Vitality Boost ⚡',
      programSub: 'Recharge your cellular stamina with micro-movements & adrenal support.',
      articleTitle: 'Combatting Midlife Fatigue & Energy Slumps',
      articleSub: 'Science-backed ways to maintain cellular energy throughout the day.',
      articleImg: 'article_morning_reset.jpg',
      communityTitle: 'Sharing tips on boosting afternoon energy',
      communitySub: 'Discover daily energy hacks & natural vitality boosters from the community.',
      reminderItem: 'B-Complex & Afternoon Energy Reset',
      recommendedPrograms: [
        {
          id: 'prog-energy-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '14-Day Energy & Vitality Boost ⚡',
          desc: 'Recharge your cellular stamina with micro-movements & adrenal support.',
          duration: '14 Days',
          dailyTime: '15 min / day',
          members: '4,150 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(255, 107, 139, 0.75) 0%, rgba(245, 158, 11, 0.90) 100%)',
          img: 'article_morning_reset.jpg'
        },
        {
          id: 'prog-energy-2',
          tag: 'TOP RATED 🌟',
          badge: 'CARE+ PREMIUM',
          title: '21-Day Fatigue Recovery & Nutrition 🥗',
          desc: 'Beat afternoon energy slumps with hormone-friendly nutrition & mitochondrial support.',
          duration: '21 Days',
          dailyTime: '20 min / day',
          members: '2,490 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(236, 93, 170, 0.85) 0%, rgba(124, 58, 237, 0.95) 100%)',
          img: 'community_yoga_reset.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-energy-1',
          title: 'Combatting Midlife Fatigue & Energy Slumps',
          tag: 'Energy & Vitality',
          author: 'Dr. Anjali Sharma',
          time: '4 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: false
        },
        {
          id: 'art-energy-2',
          title: 'Mitochondrial Health & Cortisol Management',
          tag: 'Hormone Science',
          author: 'Endocrinology Team',
          time: '6 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: false
        },
        {
          id: 'art-energy-3',
          title: 'Adrenal Support & B-Vitamin Nutrition Guide',
          tag: '🔒 CARE+',
          author: 'Dr. Sarah Jenkins',
          time: '5 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: true
        }
      ]
    },
    'Mood': {
      focusTitle: 'Emotional Calm & Mood Balance',
      focusSub: 'Soothe mood swings, anxiety and hormonal emotional shifts.',
      badgeIcon: '🧘',
      gradient: themeGradient,
      nextStepTitle: 'How are you feeling right now?',
      nextStepSub: 'Log your mood to track emotional shifts across your cycle.',
      nextStepIcon: '😄',
      programTitle: '21-Day Mindfulness & Emotional Calm 🧘',
      programSub: 'Guided breathing & nervous system regulation to soothe anxiety & mood swings.',
      articleTitle: 'Hormones & Emotional Balance Explained',
      articleSub: 'Why mood changes happen during menopause and how to regain calm.',
      articleImg: 'article_cooling_herbs.jpg',
      communityTitle: 'Community support for mood swings & anxiety',
      communitySub: 'A safe space to share emotional ups and downs with women who get it.',
      reminderItem: '5-Min Nervous System Breathing & Journaling',
      recommendedPrograms: [
        {
          id: 'prog-mood-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '21-Day Mindfulness & Emotional Calm 🧘',
          desc: 'Guided breathing & nervous system regulation to soothe anxiety & mood swings.',
          duration: '21 Days',
          dailyTime: '10 min / day',
          members: '5,820 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.80) 0%, rgba(236, 93, 170, 0.90) 100%)',
          img: 'community_yoga_reset.jpg'
        },
        {
          id: 'prog-mood-2',
          tag: 'EXPERT LED 👩‍⚕️',
          badge: 'CARE+ PREMIUM',
          title: '14-Day Stress & Cortisol Balance 🌿',
          desc: 'Regulate stress hormones and restore emotional equilibrium with daily guided practices.',
          duration: '14 Days',
          dailyTime: '15 min / day',
          members: '3,110 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(13, 148, 136, 0.90) 100%)',
          img: 'feed_sleep_routine.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-mood-1',
          title: 'Hormones & Emotional Balance Explained',
          tag: 'Mood & Mind',
          author: 'Dr. Priya Nair',
          time: '5 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: false
        },
        {
          id: 'art-mood-2',
          title: 'Calming Anxiety & Palpitations in Midlife',
          tag: 'Nervous System',
          author: 'Dr. Sarah Jenkins',
          time: '4 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: false
        },
        {
          id: 'art-mood-3',
          title: 'Mindfulness & Cortisol Regulation Masterclass',
          tag: '🔒 CARE+',
          author: 'Wellness Therapy Team',
          time: '6 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: true
        }
      ]
    },
    'Brain fog': {
      focusTitle: 'Clearer Thinking & Focus',
      focusSub: 'Sharpen focus, support memory and clear mental fog.',
      badgeIcon: '🧠',
      gradient: themeGradient,
      nextStepTitle: 'How clear is your focus today?',
      nextStepSub: 'Track cognitive clarity & brain fog episodes.',
      nextStepIcon: '🧠',
      programTitle: '7-Day Focus & Cognitive Clarity 🧠',
      programSub: 'Targeted brain exercises, nutritional support & focus strategies.',
      articleTitle: 'Overcoming Brain Fog: Estrogen & Cognitive Health',
      articleSub: 'How hormonal fluctuations impact memory and how to sharpen focus.',
      articleImg: 'article_sleep_cat.png',
      communityTitle: 'Navigating brain fog at work & home',
      communitySub: 'Practical strategies members use to stay organized and clear-headed.',
      reminderItem: 'Cognitive Clarity Break & Hydration',
      recommendedPrograms: [
        {
          id: 'prog-brain-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '7-Day Focus & Cognitive Clarity 🧠',
          desc: 'Targeted brain exercises, nutritional support & focus strategies.',
          duration: '7 Days',
          dailyTime: '12 min / day',
          members: '2,940 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.80) 0%, rgba(59, 130, 246, 0.90) 100%)',
          img: 'article_morning_reset.jpg'
        },
        {
          id: 'prog-brain-2',
          tag: 'SCIENCE BACKED 🧪',
          badge: 'CARE+ PREMIUM',
          title: '14-Day Mental Sharpness & Memory Boost ✨',
          desc: 'Clear brain fog and improve daily concentration with evidence-based cognitive protocols.',
          duration: '14 Days',
          dailyTime: '15 min / day',
          members: '1,960 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(13, 148, 136, 0.90) 100%)',
          img: 'community_yoga_reset.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-brain-1',
          title: 'Overcoming Brain Fog: Estrogen & Cognitive Health',
          tag: 'Brain & Focus',
          author: 'Dr. Elena Rostova',
          time: '5 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: false
        },
        {
          id: 'art-brain-2',
          title: 'Memory, Concentration & Menopause Hormones',
          tag: 'Cognitive Health',
          author: 'Dr. Anjali Sharma',
          time: '4 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: false
        },
        {
          id: 'art-brain-3',
          title: 'Nootropics & Hormone Therapy for Mental Clarity',
          tag: '🔒 CARE+',
          author: 'Endocrinology Team',
          time: '6 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: true
        }
      ]
    },
    'Weight': {
      focusTitle: 'Metabolic & Weight Balance',
      focusSub: 'Adapt to midlife metabolic shifts with hormone-friendly routines.',
      badgeIcon: '🏃‍♀️',
      gradient: themeGradient,
      nextStepTitle: 'Log your movement & activity today',
      nextStepSub: 'Track active minutes & daily nutrition goals.',
      nextStepIcon: '🏃‍♀️',
      programTitle: '21-Day Metabolic & Active Lifestyle 🏃‍♀️',
      programSub: 'Strength training, metabolic mobility & hormone-friendly nutrition.',
      articleTitle: 'Managing Weight & Metabolic Shifts in Menopause',
      articleSub: 'Understanding why midlife metabolism changes and how to adapt.',
      articleImg: 'article_morning_reset.jpg',
      communityTitle: 'Lifestyle & nutrition routines that work',
      communitySub: 'Share body-positive fitness & balanced nutrition tips with peers.',
      reminderItem: 'Daily Protein Log & Active Movement',
      recommendedPrograms: [
        {
          id: 'prog-weight-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '21-Day Metabolic & Active Lifestyle 🏃‍♀️',
          desc: 'Strength training, metabolic mobility & hormone-friendly nutrition.',
          duration: '21 Days',
          dailyTime: '20 min / day',
          members: '4,890 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.80) 0%, rgba(249, 115, 22, 0.90) 100%)',
          img: 'article_morning_reset.jpg'
        },
        {
          id: 'prog-weight-2',
          tag: 'MOST POPULAR 🌟',
          badge: 'CARE+ PREMIUM',
          title: '14-Day Midlife Strength & Body Reset 💪',
          desc: 'Adapt to midlife metabolic shifts with hormone-safe strength and nutrition routines.',
          duration: '14 Days',
          dailyTime: '18 min / day',
          members: '3,120 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(236, 93, 170, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%)',
          img: 'community_yoga_reset.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-weight-1',
          title: 'Managing Weight & Metabolic Shifts in Menopause',
          tag: 'Metabolism & Fitness',
          author: 'Dr. Maya Lin',
          time: '5 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: false
        },
        {
          id: 'art-weight-2',
          title: 'Insulin Resistance, Estrogen & Midlife Weight',
          tag: 'Nutrition Science',
          author: 'Dr. Anjali Sharma',
          time: '6 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: false
        },
        {
          id: 'art-weight-3',
          title: 'Hormone-Safe Strength Training & Muscle Health',
          tag: '🔒 CARE+',
          author: 'Fitness & Metabolism Team',
          time: '5 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: true
        }
      ]
    },
    'Understanding what’s happening': {
      focusTitle: 'Understanding Your Journey',
      focusSub: 'Learn how hormonal changes affect your body, mind and long-term health.',
      badgeIcon: '💡',
      gradient: themeGradient,
      nextStepTitle: 'Explore your personalized symptom guide',
      nextStepSub: 'Learn what your symptoms mean and track daily changes.',
      nextStepIcon: '📖',
      programTitle: '10-Day Menopause Essentials & Insights 📚',
      programSub: 'A comprehensive medical guide to perimenopause, HRT & wellness.',
      articleTitle: 'Understanding Perimenopause & Menopause Signals',
      articleSub: 'Key signs, hormonal timelines & what to expect in every phase.',
      articleImg: 'article_cooling_herbs.jpg',
      communityTitle: 'First time navigating menopause? Ask the group',
      communitySub: 'Connect with members & doctors answering top beginner questions.',
      reminderItem: 'Cooling Routine & Daily Symptom Tracking',
      recommendedPrograms: [
        {
          id: 'prog-und-1',
          tag: 'RECOMMENDED FOR YOU 🔥',
          badge: 'FREE',
          title: '10-Day Menopause Essentials & Insights 📚',
          desc: 'A comprehensive medical guide to perimenopause, HRT & wellness.',
          duration: '10 Days',
          dailyTime: '15 min / day',
          members: '5,240 joined',
          cta: 'JOIN PROGRAM',
          bgGradient: 'linear-gradient(135deg, rgba(126, 34, 206, 0.80) 0%, rgba(236, 93, 170, 0.90) 100%)',
          img: 'article_cooling_herbs.jpg'
        },
        {
          id: 'prog-und-2',
          tag: 'DOCTOR GUIDED 🩺',
          badge: 'CARE+ PREMIUM',
          title: '21-Day Symptoms & Hormone Masterclass 💡',
          desc: 'Understand your body\'s signals, lab tests, and treatment options with medical experts.',
          duration: '21 Days',
          dailyTime: '20 min / day',
          members: '2,680 joined',
          cta: 'Unlock now',
          bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(124, 58, 237, 0.95) 100%)',
          img: 'community_yoga_reset.jpg'
        }
      ],
      healthArticles: [
        {
          id: 'art-und-1',
          title: 'Understanding Perimenopause & Menopause Signals',
          tag: 'Medical Guide',
          author: 'Dr. Sarah Jenkins',
          time: '5 min read',
          img: 'article_cooling_herbs.jpg',
          isCarePlus: false
        },
        {
          id: 'art-und-2',
          title: 'Estrogen Dominance vs Deficit: Reading Body Signals',
          tag: 'Clinical Guide',
          author: 'Endocrinology Team',
          time: '5 min read',
          img: 'article_morning_reset.jpg',
          isCarePlus: false
        },
        {
          id: 'art-und-3',
          title: 'Understanding HRT: Benefits, Window of Opportunity & Safety',
          tag: '🔒 CARE+',
          author: 'Dr. Sarah Jenkins',
          time: '4 min read',
          img: 'article_sleep_cat.png',
          isCarePlus: true
        }
      ]
    }
  };

  const selectedConfig = configs[focus] || configs['Sleep'];

  // Construct Supporting Areas Chips dynamically from onboarding inputs
  let supportingChips = [];

  // Check support goals selected in Step 6
  if (Array.isArray(o.supportGoals) && o.supportGoals.length > 0) {
    if (o.supportGoals.includes('Speaking with experts')) supportingChips.push({ icon: '👩‍⚕️', label: 'Expert Support' });
    if (o.supportGoals.includes('Tracking my health')) supportingChips.push({ icon: '📊', label: 'Health Tracking' });
    if (o.supportGoals.includes('Improving my lifestyle')) supportingChips.push({ icon: '🌿', label: 'Lifestyle Balance' });
    if (o.supportGoals.includes('Understanding my symptoms')) supportingChips.push({ icon: '💡', label: 'Symptom Insights' });
    if (o.supportGoals.includes('Treatment options')) supportingChips.push({ icon: '💊', label: 'Care Options' });
  }

  // Check symptoms selected in Step 4
  if (Array.isArray(o.symptoms) && o.symptoms.length > 0) {
    if (o.symptoms.includes('Irregular periods') && !supportingChips.some(c => c.label === 'Cycle Tracking')) supportingChips.push({ icon: '🩸', label: 'Cycle Tracking' });
    if (o.symptoms.includes('Hot flashes') && !supportingChips.some(c => c.label === 'Cooling Support')) supportingChips.push({ icon: '🔥', label: 'Cooling Support' });
    if (o.symptoms.includes('Sleep issues') && focus !== 'Sleep' && !supportingChips.some(c => c.label === 'Sleep Support')) supportingChips.push({ icon: '🌙', label: 'Sleep Support' });
    if (o.symptoms.includes('Low energy') && focus !== 'Energy' && !supportingChips.some(c => c.label === 'Energy Boost')) supportingChips.push({ icon: '⚡', label: 'Energy Boost' });
    if (o.symptoms.includes('Mood changes') && focus !== 'Mood' && !supportingChips.some(c => c.label === 'Mood Balance')) supportingChips.push({ icon: '😄', label: 'Mood Balance' });
    if (o.symptoms.includes('Brain fog') && focus !== 'Brain fog' && !supportingChips.some(c => c.label === 'Cognitive Clarity')) supportingChips.push({ icon: '🧠', label: 'Cognitive Clarity' });
  }

  // Fallbacks if onboarding selections were minimal
  if (supportingChips.length === 0) {
    supportingChips = [
      { icon: '🧘', label: 'Stress Relief' },
      { icon: '✨', label: 'Daily Habits' },
      { icon: '📊', label: 'Cycle Tracking' }
    ];
  }

  // Limit to top 3 chips max for visual harmony
  supportingChips = supportingChips.slice(0, 3);

  return { ...selectedConfig, userName, userAge, supportingChips, onboarding: o };
}

/* --- ONBOARDING SCREEN REGISTER --- */
SM.register('onboarding', () => {
  const d = window.onboardingDraftState || { step: 1 };
  const step = d.step || 1;

  const journeyOptions = [
    'I think I may be experiencing perimenopause',
    'I have been diagnosed with perimenopause',
    'I am in menopause',
    'I am not sure'
  ];

  const symptomOptions = [
    { label: 'Irregular periods', icon: '🩸' },
    { label: 'Hot flashes', icon: '🌡️' },
    { label: 'Sleep issues', icon: '🌙' },
    { label: 'Brain fog', icon: '🧠' },
    { label: 'Low energy', icon: '⚡' },
    { label: 'Mood changes', icon: '😟' }
  ];

  const focusOptions = [
    { label: 'Sleep', icon: '🌙', desc: 'Trouble falling or staying asleep' },
    { label: 'Energy', icon: '⚡', desc: 'Daytime fatigue & energy slumps' },
    { label: 'Mood', icon: '😟', desc: 'Mood swings, anxiety or emotional fatigue' },
    { label: 'Brain fog', icon: '🧠', desc: 'Forgetfulness & concentration difficulties' },
    { label: 'Weight', icon: '🏋️', desc: 'Metabolic shifts & lifestyle balance' },
    { label: 'Understanding what’s happening', icon: '💡', desc: 'Learning about symptoms & hormonal shifts' }
  ];

  const goalOptions = [
    'Understanding my symptoms',
    'Treatment options',
    'Speaking with experts',
    'Tracking my health',
    'Improving my lifestyle'
  ];

  const careOptions = [
    'Yes, and I need more support',
    'No, but I would like to',
    'No, I’m just trying to understand'
  ];

  // Helper styles for option cards with Pink -> Purple gradient selected state and smooth micro-animations
  const getCardStyle = (isSel) => `
    background: ${isSel ? 'linear-gradient(135deg, #FFF5F8 0%, #FAF5FF 100%)' : '#FFFFFF'};
    border: 1.8px solid ${isSel ? '#EC5DAA' : '#F1F5F9'};
    border-radius: 20px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    box-shadow: ${isSel ? '0 6px 20px rgba(236,93,170,0.16)' : '0 4px 14px rgba(40,30,70,0.02)'};
    transform: ${isSel ? 'translateY(-2px) scale(1.015)' : 'translateY(0) scale(1)'};
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  const getCheckBadgeStyle = (isSel) => `
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid ${isSel ? 'transparent' : '#CBD5E1'};
    background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #EC5DAA 40%, #B14AC8 75%, #7A3FD1 100%)' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 13px;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: ${isSel ? '0 2px 8px rgba(236,93,170,0.3)' : 'none'};
    transition: all 0.2s ease;
  `;

  return `
    <style>
      @keyframes onboardingStepFadeIn {
        0% { opacity: 0; transform: translateY(14px) scale(0.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
    </style>
    <div style="min-height: 100vh; background: #FAF9FB; padding-bottom: 40px; display: flex; flex-direction: column;">
      
      <!-- Top Navigation & Progress Bar -->
      <div style="position: sticky; top: 0; z-index: 50; background: #FFFFFF; border-bottom: 1px solid #F1F5F9; padding: 14px 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <button onclick="window.prevOnboardingStep()" style="border: none; background: none; font-size: 15px; font-weight: 700; color: #0F172A; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family:'Montserrat',sans-serif;">
            ‹ Back
          </button>
          <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 800; color: #EC5DAA; letter-spacing: 0.8px;">
            STEP ${step} OF 8
          </span>
          <button onclick="SM.switchTab('home')" style="border: none; background: none; font-size: 13px; font-weight: 600; color: #94A3B8; cursor: pointer; font-family:'Montserrat',sans-serif;">
            Skip
          </button>
        </div>
        
        <!-- Smooth Gradient Progress Bar -->
        <div style="height: 6px; width: 100%; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
          <div style="height: 100%; width: ${(step / 8) * 100}%; background: linear-gradient(135deg, #F7B6D2 0%, #EC5DAA 40%, #B14AC8 75%, #7A3FD1 100%); transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 999px;"></div>
        </div>
      </div>

      <!-- STEP CONTENT CONTAINER WITH FADE-IN ANIMATION -->
      <div style="flex: 1; padding: 24px 20px; max-width: 480px; margin: 0 auto; width: 100%; animation: onboardingStepFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;">

        ${step === 1 ? `
          <!-- Step 1: Welcome -->
          <div style="text-align: center; padding-top: 20px;">
            <div style="width: 84px; height: 84px; border-radius: 50%; background: linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%); border: 2.5px solid #FCE7F3; display: flex; align-items: center; justify-content: center; font-size: 42px; margin: 0 auto 24px; box-shadow: 0 10px 28px rgba(236,93,170,0.18);">
              🌸
            </div>
            <h1 style="font-family:'Montserrat',sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.4px;">
              Welcome to Miror
            </h1>
            <p style="font-family:'Montserrat',sans-serif; font-size: 14.5px; color: #64748B; line-height: 1.5; margin: 0 0 32px;">
              Your personal menopause & midlife wellness companion. We’ll ask a few quick questions to customize your daily home screen and health recommendations.
            </p>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer; transition: all 0.2s ease;">
              Let’s Begin →
            </button>
          </div>
        ` : ''}

        ${step === 2 ? `
          <!-- Step 2: About You -->
          <div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Tell us about yourself
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 24px;">
              We use this to personalize your greetings and daily health recommendations.
            </p>

            <div style="margin-bottom: 20px;">
              <label style="display: block; font-family:'Montserrat',sans-serif; font-size: 12.5px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
                Preferred Name
              </label>
              <input type="text" value="${d.name || ''}" oninput="window.onboardingDraftState.name = this.value" placeholder="Enter your name" style="width: 100%; height: 52px; border-radius: 18px; border: 1.5px solid #E2E8F0; padding: 0 18px; font-family:'Montserrat',sans-serif; font-size: 15px; font-weight: 600; color: #0F172A; background: #FFFFFF; outline: none; transition: border-color 0.2s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.02);" onfocus="this.style.borderColor='#EC5DAA'" onblur="this.style.borderColor='#E2E8F0'">
            </div>

            <div style="margin-bottom: 32px;">
              <label style="display: block; font-family:'Montserrat',sans-serif; font-size: 12.5px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
                Your Age
              </label>
              <input type="number" value="${d.age || ''}" oninput="window.onboardingDraftState.age = this.value" placeholder="Enter your age" style="width: 100%; height: 52px; border-radius: 18px; border: 1.5px solid #E2E8F0; padding: 0 18px; font-family:'Montserrat',sans-serif; font-size: 15px; font-weight: 600; color: #0F172A; background: #FFFFFF; outline: none; transition: border-color 0.2s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.02);" onfocus="this.style.borderColor='#EC5DAA'" onblur="this.style.borderColor='#E2E8F0'">
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Continue →
            </button>
          </div>
        ` : ''}

        ${step === 3 ? `
          <!-- Step 3: Your Journey -->
          <div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Your Journey
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 20px;">
              Which best describes where you are right now?
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
              ${journeyOptions.map(opt => {
                const isSel = d.journeyStage === opt;
                return `
                  <div onclick="window.setDraftOption('journeyStage', '${opt.replace(/'/g, "\\'")}')" class="card-interactive" style="${getCardStyle(isSel)}">
                    <span style="font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.35;">${opt}</span>
                    <div style="${getCheckBadgeStyle(isSel)}">
                      ${isSel ? '✓' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Continue →
            </button>
          </div>
        ` : ''}

        ${step === 4 ? `
          <!-- Step 4: Symptoms -->
          <div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Symptoms
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 20px;">
              Select all symptoms you have noticed recently:
            </p>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 28px;">
              ${symptomOptions.map(opt => {
                const isSel = Array.isArray(d.symptoms) && d.symptoms.includes(opt.label);
                return `
                  <div onclick="window.toggleDraftMultiOption('symptoms', '${opt.label}')" class="card-interactive" style="${getCardStyle(isSel)} padding: 14px 14px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                      <span style="font-size: 20px;">${opt.icon}</span>
                      <span style="font-family:'Montserrat',sans-serif; font-size: 13px; font-weight: 600; color: #0F172A;">${opt.label}</span>
                    </div>
                    <div style="${getCheckBadgeStyle(isSel)}">
                      ${isSel ? '✓' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Continue →
            </button>
          </div>
        ` : ''}

        ${step === 5 ? `
          <!-- Step 5: What Affects You Most? -->
          <div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="background: #FDF2F8; color: #EC5DAA; font-size: 10px; font-weight: 800; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 12px; font-family:'Montserrat',sans-serif;">PRIMARY PERSONALISATION</span>
            </div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              What Affects You Most?
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 20px;">
              Select the main area you want Miror to help you improve.
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
              ${focusOptions.map(opt => {
                const isSel = d.primaryFocus === opt.label;
                return `
                  <div onclick="window.setDraftOption('primaryFocus', '${opt.label.replace(/'/g, "\\'")}')" class="card-interactive" style="${getCardStyle(isSel)} padding: 14px 16px;">
                    <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                      <div style="width: 42px; height: 42px; border-radius: 50%; background: ${isSel ? '#FDF2F8' : '#F8FAFC'}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                        ${opt.icon}
                      </div>
                      <div>
                        <div style="font-family:'Montserrat',sans-serif; font-size: 14.5px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">${opt.label}</div>
                        <div style="font-size: 12px; color: #64748B; font-weight: 400;">${opt.desc}</div>
                      </div>
                    </div>
                    <div style="${getCheckBadgeStyle(isSel)}">
                      ${isSel ? '✓' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Continue →
            </button>
          </div>
        ` : ''}

        ${step === 6 ? `
          <!-- Step 6: Support & Goals -->
          <div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Support & Goals
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 20px;">
              Select all areas where you want guidance:
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
              ${goalOptions.map(opt => {
                const isSel = Array.isArray(d.supportGoals) && d.supportGoals.includes(opt);
                return `
                  <div onclick="window.toggleDraftMultiOption('supportGoals', '${opt.replace(/'/g, "\\'")}')" class="card-interactive" style="${getCardStyle(isSel)}">
                    <span style="font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 600; color: #0F172A;">${opt}</span>
                    <div style="${getCheckBadgeStyle(isSel)}">
                      ${isSel ? '✓' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Continue →
            </button>
          </div>
        ` : ''}

        ${step === 7 ? `
          <!-- Step 7: Current Care -->
          <div>
            <h2 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Current Care
            </h2>
            <p style="font-family:'Montserrat',sans-serif; font-size: 13.5px; color: #64748B; margin: 0 0 20px;">
              Are you currently seeking a doctor or receiving care?
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
              ${careOptions.map(opt => {
                const isSel = d.currentCare === opt;
                return `
                  <div onclick="window.setDraftOption('currentCare', '${opt.replace(/'/g, "\\'")}')" class="card-interactive" style="${getCardStyle(isSel)}">
                    <span style="font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 600; color: #0F172A;">${opt}</span>
                    <div style="${getCheckBadgeStyle(isSel)}">
                      ${isSel ? '✓' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <button onclick="window.nextOnboardingStep()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Generate My Experience ✨
            </button>
          </div>
        ` : ''}

        ${step === 8 ? `
          <!-- Step 8: Personalised Outcome Confirmation -->
          <div style="text-align: center; padding-top: 10px;">
            
            <div style="background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; border-radius: 24px; padding: 26px 20px; margin-bottom: 24px; box-shadow: 0 12px 32px rgba(122,63,209,0.28);">
              <div style="font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; display: inline-block; margin-bottom: 14px; font-family:'Montserrat',sans-serif;">
                PERSONALISED FOR YOU
              </div>
              <h2 style="font-family:'Montserrat',sans-serif; font-size: 24px; font-weight: 800; margin: 0 0 10px; color: #FFFFFF;">
                We understand you, ${d.name || 'Friend'}.
              </h2>
              <p style="font-family:'Montserrat',sans-serif; font-size: 14px; color: rgba(255,255,255,0.92); margin: 0 0 20px; line-height: 1.45;">
                Here’s your personalized health experience focused on <strong style="color:#FFF;">${d.primaryFocus || (d.symptoms && d.symptoms[0]) || 'Wellness'}</strong>.
              </p>

              <!-- Selections Summary Chips -->
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${d.name ? `<span style="background: rgba(255,255,255,0.22); color: white; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700;">Name: ${d.name}</span>` : ''}
                ${d.age ? `<span style="background: rgba(255,255,255,0.22); color: white; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700;">Age: ${d.age}</span>` : ''}
                ${d.primaryFocus ? `<span style="background: rgba(255,255,255,0.22); color: white; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700;">Focus: ${d.primaryFocus}</span>` : ''}
                ${(d.symptoms || []).length > 0 ? `<span style="background: rgba(255,255,255,0.22); color: white; padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 700;">${d.symptoms.length} Symptoms Tracked</span>` : ''}
              </div>
            </div>

            <button onclick="window.completeOnboarding()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; height: 54px; border-radius: 27px; width: 100%; border: none; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; box-shadow: 0 8px 24px rgba(122,63,209,0.28); cursor: pointer;">
              Explore My Personalised Home ✨
            </button>
          </div>
        ` : ''}

      </div>
    </div>
  `;
});

/* --- DYNAMIC HOME SCREEN REGISTER --- */
SM.register('home', () => {
  const p = getPersonalisedHomeData();
  const o = p.onboarding;

  return `
    <!-- Sticky Header Bar -->
    <div class="screen-fixed-header" style="position:sticky;top:0;z-index:40;background:#FFFFFF;border-bottom:1px solid #F1F5F9;box-shadow:0 1px 4px rgba(0,0,0,0.02);padding:14px 20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
        
        <!-- Left: Calendar Icon + Date Title & Greeting Group -->
        <div style="display:flex;align-items:center;gap:12px;cursor:pointer;" data-action="push" data-screen="history">
          <!-- Clean Vector Calendar Icon Badge -->
          <div style="width:38px;height:38px;min-width:38px;min-height:38px;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#0F172A;transition:all 0.15s ease;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2.5" ry="2.5"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>

          <!-- Date & Greeting Stack -->
          <div style="display:flex;flex-direction:column;justify-content:center;">
            <div style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.3px;display:flex;align-items:center;line-height:1.2;">
              August 26 <span style="font-size:11px;color:#EC5DAA;font-weight:800;margin-left:4px;display:inline-block;vertical-align:middle;">▾</span>
            </div>
            <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#64748B;font-weight:500;margin-top:3px;line-height:1.2;">
              Good morning, ${p.userName} 👋
            </div>
          </div>
        </div>

        <!-- Right: Utility Controls Group (Search + Notification) -->
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="btn-icon card-interactive" data-action="push" data-screen="search" style="width:38px;height:38px;min-width:38px;min-height:38px;max-width:38px;max-height:38px;aspect-ratio:1/1;flex-shrink:0;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#0F172A;transition:all 0.15s ease;" title="Search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button class="btn-icon card-interactive" data-action="push" data-screen="notifications" style="width:38px;height:38px;min-width:38px;min-height:38px;max-width:38px;max-height:38px;aspect-ratio:1/1;flex-shrink:0;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#0F172A;position:relative;transition:all 0.15s ease;" title="Notifications" aria-label="Notifications">
            <span style="font-size:17px;">🔔</span>
            <span style="position:absolute;top:7px;right:7px;width:7px;height:7px;background:#EC5DAA;border-radius:50%;border:1.5px solid white;"></span>
          </button>
        </div>

      </div>
    </div>

    <!-- MAIN SCROLL CONTAINER -->
    <div style="padding-top: 10px; padding-bottom: 120px; background: #FAF9FB;">

      <!-- Horizontal Week Calendar Strip -->
      <div style="padding: 10px 16px 20px;">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; align-items: center;">
          
          <!-- Sun -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 800; color: #475569;">S</span>
            <div style="width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid #E9D5FF; background: #FAF5FF; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <span style="font-family:'Montserrat',sans-serif; font-size: 16px; font-weight: 900; color: #7E22CE; line-height: 1; margin-bottom: 2px;">22</span>
              <span style="width: 4px; height: 4px; background: #7E22CE; border-radius: 50%;"></span>
            </div>
          </div>

          <!-- Mon -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 800; color: #475569;">M</span>
            <div style="width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid #E9D5FF; background: #FAF5FF; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <span style="font-family:'Montserrat',sans-serif; font-size: 16px; font-weight: 900; color: #7E22CE; line-height: 1; margin-bottom: 2px;">23</span>
              <span style="width: 4px; height: 4px; background: #7E22CE; border-radius: 50%;"></span>
            </div>
          </div>

          <!-- Tue -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 800; color: #475569;">T</span>
            <div style="width: 42px; height: 42px; border-radius: 50%; border: 1.5px dashed #CBD5E1; display: flex; align-items: center; justify-content: center;">
              <span style="font-family:'Montserrat',sans-serif; font-size: 16px; font-weight: 800; color: #94A3B8;">24</span>
            </div>
          </div>

          <!-- Wed -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 800; color: #475569;">W</span>
            <div style="width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid #E9D5FF; background: #FAF5FF; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <span style="font-family:'Montserrat',sans-serif; font-size: 16px; font-weight: 900; color: #7E22CE; line-height: 1; margin-bottom: 2px;">25</span>
              <span style="width: 4px; height: 4px; background: #7E22CE; border-radius: 50%;"></span>
            </div>
          </div>

          <!-- Thu (TODAY) -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 10px; font-weight: 800; color: #EC5DAA; letter-spacing: 0.5px;">TODAY</span>
            <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FFFFFF; font-family:'Montserrat',sans-serif; font-size: 15px; font-weight: 800; box-shadow: 0 6px 18px rgba(122,63,209,0.3); position: relative;">
              <span>26</span>
              <span style="width: 3.5px; height: 3.5px; background: #FFFFFF; border-radius: 50%; margin-top: 1px;"></span>
            </div>
          </div>

          <!-- Fri -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #64748B;">F</span>
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #334155; font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 700;">
              <span>27</span>
            </div>
          </div>

          <!-- Sat -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #64748B;">S</span>
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #334155; font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 700;">
              <span>28</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Start Today's Check-in CTA Pill Button -->
      <div style="padding: 6px 20px 18px;">
        <button class="btn btn-primary w-full card-interactive" style="height: 54px; font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 700; border-radius: 27px; background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); box-shadow: 0 8px 24px rgba(122,63,209,0.28); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;" data-action="start-checkin">
          <span>Start Today's Check-in</span>
          <span style="font-size: 17px;">✨</span>
        </button>
      </div>

      <!-- 1. MY HEALTH JOURNEY (COMPACT PERSONALISED CARD) -->
      <div style="padding: 0 20px 18px;">
        <div class="card" style="background: ${p.gradient || 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)'}; border-radius: 22px; padding: 16px 20px; box-shadow: 0 10px 26px rgba(217,59,159,0.22); color: #FFFFFF; display: flex; flex-direction: column; position: relative; overflow: hidden;">
          
          <!-- Layered Atmospheric Backdrop Visual Glow & Theme Motif -->
          <div style="position: absolute; top: -15px; right: -15px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%); pointer-events: none;"></div>
          <div style="position: absolute; top: 10px; right: 14px; z-index: 1; opacity: 0.95; filter: drop-shadow(0 4px 14px rgba(255,255,255,0.3)); pointer-events: none;">
            <span style="font-size: 44px; display: block; line-height: 1; transform: rotate(-5deg);">${p.badgeIcon || '🌙'}</span>
          </div>

          <!-- TOP SECTION: HERO FOCUS COMPOSITION -->
          <div style="z-index: 2; position: relative; padding-right: 50px;">
            <!-- Primary Subsection Label (Matching Subhead Properties) -->
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.9px; color: rgba(255, 255, 255, 0.85); text-transform: uppercase; margin-bottom: 4px;">
              YOUR MAIN FOCUS
            </div>

            <!-- Dominant Hero Focus Title -->
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: clamp(19px, 5.5vw, 25px); font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: -0.4px; line-height: 1.25; word-break: break-word; text-shadow: 0 2px 10px rgba(0,0,0,0.15);">
              ${p.focusTitle}
            </h2>
          </div>

          <!-- SUBTLE HORIZONTAL DIVIDER -->
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.22); margin: 12px 0 8px; z-index: 2;"></div>

          <!-- SECOND SECTION: OTHER AREAS WE'RE SUPPORTING -->
          <div style="z-index: 2;">
            <!-- Secondary Subsection Label -->
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.9px; color: rgba(255, 255, 255, 0.85); text-transform: uppercase; margin-bottom: 8px;">
              OTHER AREAS WE’RE SUPPORTING
            </div>

            <!-- Premium Glassmorphic Supporting Chips -->
            <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
              ${(p.supportingChips || []).map(chip => `
                <span style="background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.28); color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 14px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                  <span>${chip.icon}</span> ${chip.label}
                </span>
              `).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- 2. PERSONALISED "YOUR NEXT STEP" CARD -->
      <div style="padding: 0 20px 22px;">
        <div class="card card-interactive" style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 22px; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: 0 6px 20px rgba(40,30,70,0.04);" data-action="start-checkin">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: #FDF2F8; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; color: #EC5DAA;">
              ${p.nextStepIcon}
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.8px; color: #EC5DAA; text-transform: uppercase; font-family:'Montserrat',sans-serif; margin-bottom: 2px;">YOUR NEXT STEP</div>
              <div style="font-family:'Montserrat',sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">${p.nextStepTitle}</div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 400;">${p.nextStepSub}</div>
            </div>
          </div>
          <button style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #EC5DAA 0%, #D93B9F 100%); border: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(236,93,170,0.3);" aria-label="Start action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- 3. TODAY'S CHECK-IN TILES (FIGMA WHITE CARD WITH STROKE & DROP SHADOW - 12PX CORNER RADIUS) -->
      <div style="padding: 0 20px 28px;">
        <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 14px;">Today's Check-in</h3>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <!-- Mood -->
          <div class="card card-interactive" style="background: #FFFFFF; border: 0.5px solid #FFFFFF; border-radius: 12px; padding: 14px 6px; text-align: center; box-shadow: inset 0 0 0 0.5px #FFFFFF, 0px 20px 25px -5px rgba(0, 0, 0, 0.07); display: flex; flex-direction: column; align-items: center; gap: 4px;" data-action="push" data-screen="track-mood">
            <span style="font-size: 22px;">😄</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 600; color: #0F172A;">Mood</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #10B981;">Good</span>
          </div>

          <!-- Energy -->
          <div class="card card-interactive" style="background: #FFFFFF; border: 0.5px solid #FFFFFF; border-radius: 12px; padding: 14px 6px; text-align: center; box-shadow: inset 0 0 0 0.5px #FFFFFF, 0px 20px 25px -5px rgba(0, 0, 0, 0.07); display: flex; flex-direction: column; align-items: center; gap: 4px;" data-action="push" data-screen="track-wellness">
            <span style="font-size: 22px;">⚡</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 600; color: #0F172A;">Energy</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #F59E0B;">Medium</span>
          </div>

          <!-- Sleep -->
          <div class="card card-interactive" style="background: #FFFFFF; border: 0.5px solid #FFFFFF; border-radius: 12px; padding: 14px 6px; text-align: center; box-shadow: inset 0 0 0 0.5px #FFFFFF, 0px 20px 25px -5px rgba(0, 0, 0, 0.07); display: flex; flex-direction: column; align-items: center; gap: 4px;" data-action="push" data-screen="track-wellness">
            <span style="font-size: 22px;">🌙</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 600; color: #0F172A;">Sleep</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #94A3B8;">_</span>
          </div>

          <!-- Symptoms -->
          <div class="card card-interactive" style="background: #FFFFFF; border: 0.5px solid #FFFFFF; border-radius: 12px; padding: 14px 6px; text-align: center; box-shadow: inset 0 0 0 0.5px #FFFFFF, 0px 20px 25px -5px rgba(0, 0, 0, 0.07); display: flex; flex-direction: column; align-items: center; gap: 4px;" data-action="push" data-screen="track-symptoms">
            <div style="position: relative; display: inline-block;">
              <span style="font-size: 22px;">👤</span>
              <span style="position: absolute; top: -3px; right: -7px; background: #EC5DAA; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 9.5px; font-weight: 800; display: flex; align-items: center; justify-content: center;">${(o.symptoms || []).length}</span>
            </div>
            <span style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 600; color: #0F172A;">Symptoms</span>
            <span style="font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 700; color: #0F172A;">Tracked</span>
          </div>
        </div>
      </div>

      <!-- 4. ASK MIROR CARD (SAVER PASS / REFERENCE IMAGE CARD FORMAT) -->
      <div style="padding: 0 20px 22px;">
        <div class="card card-interactive" style="background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%); border: 1px solid #E9D5FF; border-radius: 22px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 8px 24px rgba(126,34,206,0.07); position: relative; overflow: hidden;" data-action="open-ask-miror">
          
          <!-- LEFT COLUMN: Vertical Stack of Eyebrow, Headline, Copy, and Bottom CTA -->
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start;">
            <!-- Eyebrow Pill Badge -->
            <div style="background: rgba(126, 34, 206, 0.12); color: #7E22CE; font-family:'Montserrat',sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 10px; border-radius: 12px; margin-bottom: 10px; display: inline-block;">
              ASK MIROR
            </div>

            <!-- Primary Headline -->
            <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 800; color: #0F172A; line-height: 1.25; margin: 0 0 6px; letter-spacing: -0.3px;">
              Have a health question?
            </h3>

            <!-- Supporting Copy -->
            <p style="font-size: 12px; color: #64748B; font-weight: 500; font-family:'Montserrat',sans-serif; line-height: 1.35; margin: 0 0 16px;">
              Get personalised guidance for your health questions.
            </p>

            <!-- Bottom Left CTA Pill Button -->
            <button style="background: linear-gradient(135deg, #8B5CF6 0%, #7E22CE 100%); color: #FFFFFF; border: none; border-radius: 24px; padding: 10px 18px; font-family:'Montserrat',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 16px rgba(126,34,206,0.28); white-space: nowrap;" data-action="open-ask-miror">
              <span>Ask Now</span>
              <span style="font-size: 14px; line-height: 1;">→</span>
            </button>
          </div>

          <!-- RIGHT COLUMN: Chat Visual Illustration -->
          <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(126,34,206,0.12); border: 1.5px solid rgba(233,213,255,0.8);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>

        </div>
      </div>

      <!-- 5. TODAY'S REMINDERS SECTION (TITLE OUTSIDE CARD WITH GENEROUS SPACING) -->
      <div style="padding: 0 20px 28px;">
        ${(() => {
          const remList = (AppState.todayReminders && AppState.todayReminders.length > 0)
            ? AppState.todayReminders
            : [
                { id: 'rem-1', text: p.reminderItem, time: '8:00 PM', completed: false },
                { id: 'rem-2', text: 'Daily Symptom & Wellness Log', time: '9:00 PM', completed: false },
                { id: 'rem-3', text: 'Hydration & Cooling Break', time: '2:30 PM', completed: true }
              ];
          if (remList[0]) remList[0].text = p.reminderItem || 'Magnesium Glycinate (400mg) & Sleep Log';
          const completedCount = remList.filter(r => r.completed).length;

          return `
            <!-- Header Row Outside Card -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; cursor: pointer;" data-action="switchTab" data-tab="reminders">
                Today's Reminders
              </h3>
              
              <!-- Dynamic Counter Pill -->
              <div id="home-rem-counter-pill" style="background: #ECFDF5; color: #059669; border-radius: 14px; padding: 4px 12px; font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 700; transition: all 0.2s ease;">
                ${completedCount}/${remList.length} Done${completedCount === remList.length ? ' 🎉' : ''}
              </div>
            </div>

            <!-- Interactive List Items -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${remList.map(r => `
                <div id="home-rem-item-${r.id}" onclick="window.toggleHomeReminder('${r.id}', event)" class="card-interactive" style="background: ${r.completed ? '#F8FAFC' : '#FFFFFF'}; border: 1px solid ${r.completed ? '#E2E8F0' : '#F1F5F9'}; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 14px rgba(40,30,70,0.03);">
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    <div class="home-rem-checkbox" style="width: 20px; height: 20px; border-radius: 6px; border: ${r.completed ? 'none' : '1.8px solid #CBD5E1'}; background: ${r.completed ? '#10B981' : '#FFFFFF'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s ease; box-shadow: ${r.completed ? '0 2px 6px rgba(16,185,129,0.3)' : 'none'};">
                      ${r.completed ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    </div>
                    <span class="home-rem-text" style="font-family:'Montserrat',sans-serif; font-size: 13.5px; font-weight: ${r.completed ? '500' : '600'}; color: ${r.completed ? '#94A3B8' : '#0F172A'}; text-decoration: ${r.completed ? 'line-through' : 'none'}; transition: all 0.2s ease;">
                      ${r.text}
                    </span>
                  </div>
                  <span class="home-rem-time" style="font-family:'Montserrat',sans-serif; font-size: 12px; font-weight: 500; color: ${r.completed ? '#CBD5E1' : '#64748B'}; text-decoration: ${r.completed ? 'line-through' : 'none'}; flex-shrink: 0; margin-left: 8px; transition: all 0.2s ease;">
                    ${r.time}
                  </span>
                </div>
              `).join('')}
            </div>
          `;
        })()}
      </div>

      <!-- 6. PERSONALISED RECOMMENDED PROGRAMS SECTION -->
      <div style="padding: 0 20px 28px;">
        <div class="flex-between" style="margin-bottom: 14px; align-items: center;">
          <h3 class="text-h3" style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">Recommended Programs</h3>
          <button class="btn-ghost text-caption" style="color:#EC5DAA; font-weight:700; font-size:13px; font-family:'Montserrat',sans-serif;" data-action="push" data-screen="all-programs">View all →</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${(p.recommendedPrograms || []).map((prog, idx) => {
            const isCarePlus = (prog.badge && prog.badge.includes('CARE+')) || prog.isCarePlus;
            const safeTitle = (prog.title || 'Guided Health Program').replace(/'/g, "\\'");
            const cardTarget = isCarePlus 
              ? `onclick="if(window.openProgramPaywall){ window.openProgramPaywall('${safeTitle}'); } else { SM.switchTab('care-plus'); }"` 
              : 'data-action="push" data-screen="program-detail"';
            const ctaLabel = isCarePlus ? 'UNLOCK NOW' : (prog.cta || 'JOIN PROGRAM');

            const cardStyle = isCarePlus
              ? `background: ${prog.bgGradient} padding-box, linear-gradient(135deg, #FFE89C 0%, #F2C94C 35%, #F2994A 70%, #E5A93C 100%) border-box; border: 2.5px solid transparent; color: white; border-radius: 24px; padding: 22px 20px; position: relative; overflow: hidden; box-shadow: 0 10px 28px rgba(122, 67, 160, 0.28); cursor: pointer;`
              : `background: ${prog.bgGradient}; border: 1px solid rgba(255, 255, 255, 0.35); color: white; border-radius: 24px; padding: 22px 20px; position: relative; overflow: hidden; box-shadow: 0 10px 28px rgba(0,0,0,0.15); cursor: pointer;`;

            return `
              <div class="card card-interactive" style="${cardStyle}" ${cardTarget}>
                
                <!-- Full Cover Photo Background Layer -->
                <img src="${prog.img}" alt="${prog.title}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.22; z-index: 0; filter: contrast(1.08) brightness(0.92);">

                <!-- Gradient Overlay Layer -->
                <div style="position: absolute; inset: 0; background: ${prog.bgGradient}; z-index: 1;"></div>

                <!-- Top Tags Row -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 16px; position: relative; z-index: 2;">
                  <span style="${window.getTagPillStyle ? window.getTagPillStyle(prog.tag) : 'background:#F59E0B;color:#FFF;padding:4px 12px;border-radius:12px;font-size:10px;font-weight:800;text-transform:uppercase;'}">
                    ${prog.tag}
                  </span>
                  <span style="${window.getTagPillStyle ? window.getTagPillStyle(prog.badge) : 'background:#10B981;color:#FFF;padding:4px 12px;border-radius:12px;font-size:10px;font-weight:800;text-transform:uppercase;'}">
                    ${prog.badge}
                  </span>
                </div>

                <!-- Middle Title & Description -->
                <div style="position: relative; z-index: 2; margin-bottom: 16px;">
                  <h3 style="font-family:'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 0 0 6px; line-height: 1.25; letter-spacing: -0.2px;">
                    ${prog.title}
                  </h3>
                  <p style="font-family:'Montserrat',sans-serif; font-size: 13px; color: rgba(255,255,255,0.92); margin: 0; line-height: 1.4; font-weight: 500;">
                    ${prog.desc}
                  </p>
                </div>

                <!-- Meta Info Row -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 18px; position: relative; z-index: 2; font-family:'Montserrat',sans-serif; font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.95); white-space: nowrap; width: 100%;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span>📅 ${prog.duration}</span>
                    <span>⏱️ ${prog.dailyTime}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                    <div style="display: flex; align-items: center;">
                      <img src="profile_avatar.jpg" alt="Member" style="width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid white; object-fit: cover;">
                      <img src="feed_dr_anjali.jpg" alt="Member" style="width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid white; object-fit: cover; margin-left: -5px;">
                    </div>
                    <span style="font-size: 11px; font-weight: 700; color: #FFFFFF;">${prog.members}</span>
                  </div>
                </div>

                <!-- Solid White CTA Button -->
                <button style="background: #FFFFFF; color: ${isCarePlus ? '#8B1E9B' : '#0D9488'}; border: none; box-shadow: 0 4px 14px rgba(0,0,0,0.18); width: 100%; border-radius: 18px; padding: 13px; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; text-align: center; position: relative; z-index: 2;" ${cardTarget}>
                  ${ctaLabel}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 7. PERSONALISED HEALTH ARTICLES SECTION (SHARED MENO INTEL CARD RENDERER) -->
      <div style="padding: 0 0 10px;">
        <!-- Header Row -->
        <div class="flex-between" style="padding: 0 20px; margin-bottom: 12px; align-items: center;">
          <h3 class="text-h3" style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">For Your Health</h3>
          <button class="btn-ghost text-caption" style="color:#EC5DAA; font-weight:700; font-size:13px; font-family:'Montserrat',sans-serif;" data-action="switchTab" data-tab="explore">See all →</button>
        </div>

        <!-- Horizontal Scrollable Articles Carousel (Directly Generated from Meno Intel Renderer) -->
        <div style="display: flex; gap: 14px; overflow-x: auto; padding: 4px 20px 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
          ${(window.renderSingleArticleCardHtml && (p.healthArticles || []).length > 0 ? (p.healthArticles || []).map(a => window.renderSingleArticleCardHtml(a)).join('') : '')}
        </div>
      </div>

      <!-- 8. PERSONALISED COMMUNITY CONVERSATION (REFERENCE CARD FORMAT) -->
      <div style="padding: 0 20px 14px;">
        <div class="flex-between" style="margin-bottom: 10px; align-items: center;">
          <h3 class="text-h3" style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">From Your Community</h3>
        </div>

        <div class="card card-interactive" style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 22px; padding: 20px 108px 20px 20px; position: relative; overflow: hidden; box-shadow: 0 8px 24px rgba(40,30,70,0.06);" data-action="switchTab" data-tab="community">
          
          <!-- LEFT COLUMN: Vertical Stack of Eyebrow, Headline, Subtext, and Bottom CTA -->
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <!-- Eyebrow Pill Badge -->
            <div style="background: rgba(236, 93, 170, 0.1); color: #EC5DAA; font-family:'Montserrat',sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 10px; border-radius: 12px; margin-bottom: 10px; display: inline-block;">
              COMMUNITY TOPIC
            </div>

            <!-- Primary Headline -->
            <h3 style="font-family:'Montserrat',sans-serif; font-size: 17px; font-weight: 800; color: #0F172A; line-height: 1.25; margin: 0 0 6px; letter-spacing: -0.3px;">
              ${p.communityTitle}
            </h3>

            <!-- Supporting Copy -->
            <p style="font-size: 12px; color: #64748B; font-weight: 500; font-family:'Montserrat',sans-serif; line-height: 1.35; margin: 0 0 16px;">
              ${p.communitySub}
            </p>

            <!-- Bottom Left CTA Pill Button -->
            <button style="background: linear-gradient(135deg, #EC5DAA 0%, #D93B9F 50%, #B14AC8 100%); color: #FFFFFF; border: none; border-radius: 24px; padding: 10px 18px; font-family:'Montserrat',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 16px rgba(236,93,170,0.28); white-space: nowrap;">
              <span>Join Group</span>
              <span style="font-size: 14px; line-height: 1;">→</span>
            </button>
          </div>

          <!-- RIGHT COLUMN: Scrolling Logos Track (Just Logos, Full Height, No Inner Rectangle) -->
          <div style="position: absolute; top: 0; bottom: 0; right: 0; width: 92px; background: #F8FAFC; border-left: 1px solid #E2E8F0; padding: 10px 0; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            
            <!-- Top & Bottom Soft Fade Overlays -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 24px; background: linear-gradient(to bottom, #F8FAFC 0%, rgba(248,250,252,0) 100%); z-index: 2; pointer-events: none;"></div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 24px; background: linear-gradient(to top, #F8FAFC 0%, rgba(248,250,252,0) 100%); z-index: 2; pointer-events: none;"></div>

            <!-- Animated Scrolling Logos Track -->
            <div class="cards-vertical-scroll-track" style="align-items: center; gap: 14px;">
              <!-- Logo 1: Miror Mingle -->
              <img src="icon_miror_mingle.jpg" alt="Miror Mingle" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">

              <!-- Logo 2: Bloom Club -->
              <img src="icon_bloom.jpg" alt="Bloom Club" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">

              <!-- Logo 3: 21-Day Reset -->
              <img src="icon_detox_21.jpg" alt="21-Day Reset" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">

              <!-- Logo 4: Morning Reset -->
              <img src="icon_morning_reset.jpg" alt="Morning Reset" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">

              <!-- Logo 5: Miror Beauties -->
              <img src="icon_miror_beautie.jpg" alt="Miror Beauties" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">

              <!-- Duplicate Set for Seamless Infinite Loop -->
              <img src="icon_miror_mingle.jpg" alt="Miror Mingle" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">
              <img src="icon_bloom.jpg" alt="Bloom Club" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">
              <img src="icon_detox_21.jpg" alt="21-Day Reset" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">
              <img src="icon_morning_reset.jpg" alt="Morning Reset" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">
              <img src="icon_miror_beautie.jpg" alt="Miror Beauties" style="width: 52px; height: 52px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 4px 14px rgba(40,30,70,0.08);">
            </div>

          </div>

        </div>
      </div>

    </div>
  `;
});


/* --------------------------------------------------------------------------
   8. TRACK TAB
   -------------------------------------------------------------------------- */
SM.register('track-landing', (params) => {
  if (AppState.todayCheckin.completed) return SM.screens['track-done-today'](params);
  return SM.screens['track-mood'](params);
});

SM.register('track-mood', () => {
  const overallMoods = [
    { id: 'amazing', label: 'Great', emoji: '😁', color: '#10B981' },
    { id: 'good', label: 'Good', emoji: '😊', color: '#34D399' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: '#F59E0B' },
    { id: 'low', label: 'Low', emoji: '😔', color: '#F97316' },
    { id: 'rough', label: 'Very Low', emoji: '😢', color: '#EF4444' }
  ];

  const activeMood = AppState.todayCheckin.mood || 'good';

  return `
    ${topBar('Log mood & emotions', { back: true, action: '<button data-action="goHome" style="font-size:20px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">✕</button>' })}
    ${progressBar(1, 4)}

    <div class="container" style="padding:24px 20px;background:var(--miror-bg);">
      <!-- Overall Mood Card -->
      <div class="card card-outline float-item" style="padding:28px 16px;margin-bottom:24px;background:white;border-radius:24px;box-shadow:0 6px 20px rgba(0,0,0,0.04);">
        <h3 class="text-h2 text-center" style="margin-bottom:22px;font-size:18px;color:var(--miror-text-primary);font-weight:600;">How are you feeling overall today?</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Row 1: 3 Items -->
          <div style="display:flex;gap:10px;">
            ${overallMoods.slice(0, 3).map(m => {
              const isSel = activeMood === m.id;
              return `
                <button class="overall-mood-btn ${isSel ? 'active' : ''}" data-action="select-overall-mood" data-mood="${m.id}" style="width:calc((100% - 20px) / 3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px 4px;border-radius:18px;border:2px solid ${isSel ? m.color : 'var(--miror-border)'};background:${isSel ? m.color + '15' : 'white'};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;${isSel ? `box-shadow:0 6px 16px ${m.color}35;transform:scale(1.04);` : ''}">
                  <span style="font-size:32px;line-height:1;">${m.emoji}</span>
                  <span style="font-size:12.5px;font-weight:600;color:${isSel ? m.color : 'var(--miror-text-secondary)'};white-space:nowrap;">${m.label}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Row 2: 2 Items (Same width as row 1, centered) -->
          <div style="display:flex;gap:10px;justify-content:center;">
            ${overallMoods.slice(3, 5).map(m => {
              const isSel = activeMood === m.id;
              return `
                <button class="overall-mood-btn ${isSel ? 'active' : ''}" data-action="select-overall-mood" data-mood="${m.id}" style="width:calc((100% - 20px) / 3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px 4px;border-radius:18px;border:2px solid ${isSel ? m.color : 'var(--miror-border)'};background:${isSel ? m.color + '15' : 'white'};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;${isSel ? `box-shadow:0 6px 16px ${m.color}35;transform:scale(1.04);` : ''}">
                  <span style="font-size:32px;line-height:1;">${m.emoji}</span>
                  <span style="font-size:12.5px;font-weight:600;color:${isSel ? m.color : 'var(--miror-text-secondary)'};white-space:nowrap;">${m.label}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Action Button directly below content -->
      <div style="margin-top:8px;">
        <button class="btn btn-primary w-full" data-action="push" data-screen="track-symptoms" style="height:52px;font-size:16px;border-radius:26px;background:var(--miror-gradient);box-shadow:var(--shadow-glow-pink);font-weight:600;">
          Save mood & continue 🌸
        </button>
      </div>
    </div>
  `;
});

SM.register('track-symptoms', () => {
  const allSymptomsList = [
    { id: 'incontinence', name: 'Incontinence' },
    { id: 'breathing', name: 'Breathing problems' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'weight-gain', name: 'Weight gain' },
    { id: 'memory', name: 'Memory problems' },
    { id: 'womb-cramps', name: 'Womb cramps' },
    { id: 'palpitations', name: 'Heart palpitations' },
    { id: 'hot-flashes', name: 'Hot flashes' },
    { id: 'night-sweats', name: 'Night sweats' },
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'brain-fog', name: 'Brain fog' },
    { id: 'joint-pain', name: 'Joint pain' },
    { id: 'headache', name: 'Headache' },
    { id: 'poor-sleep', name: 'Poor sleep' },
    { id: 'mood-swings', name: 'Mood swings' },
    { id: 'bloating', name: 'Bloating' },
    { id: 'dry-skin', name: 'Dry skin' }
  ];

  return `
    ${topBar('Add symptoms', { back: true, action: '<button data-action="goHome" style="font-size:20px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">✕</button>' })}
    ${progressBar(2, 4)}

    <div class="container" style="padding:16px 20px;background:var(--miror-bg);min-height:calc(100vh - 120px);">
      <!-- Search Bar -->
      <div style="display:flex;align-items:center;gap:10px;background:white;border:1.5px solid var(--miror-pink-light);border-radius:24px;padding:0 16px;height:46px;margin-bottom:20px;box-shadow:0 2px 8px rgba(255,107,157,0.06);">
        <span style="color:var(--miror-pink);font-size:18px;">🔍</span>
        <input type="text" id="symptom-search-input" placeholder="Search symptoms" style="border:none;outline:none;flex:1;font-size:15px;color:var(--miror-text-primary);background:transparent;">
      </div>

      <!-- Rating Column Headers -->
      <div style="display:flex;justify-content:flex-end;padding:0 16px;margin-bottom:10px;">
        <div style="display:flex;gap:8px;width:176px;justify-content:space-between;">
          <span style="width:38px;text-align:center;font-size:10px;font-weight:600;color:var(--miror-text-secondary);white-space:nowrap;display:inline-block;">None</span>
          <span style="width:38px;text-align:center;font-size:10px;font-weight:600;color:var(--miror-text-secondary);white-space:nowrap;display:inline-block;">A little</span>
          <span style="width:38px;text-align:center;font-size:10px;font-weight:600;color:var(--miror-text-secondary);white-space:nowrap;display:inline-block;">Moderate</span>
          <span style="width:38px;text-align:center;font-size:10px;font-weight:600;color:var(--miror-text-secondary);white-space:nowrap;display:inline-block;">A lot</span>
        </div>
      </div>

      <!-- Symptom List Rows -->
      <div style="display:flex;flex-direction:column;gap:10px;padding-bottom:16px;">
        ${allSymptomsList.map(s => {
          const currentSev = AppState.todayCheckin.severities[s.id];
          const sevNum = currentSev === 'mild' ? 1 : currentSev === 'moderate' ? 2 : currentSev === 'severe' ? 3 : 0;
          return `
            <div class="symptom-rate-row miror-rate-row" data-name="${s.name}">
              <span style="font-size:15px;color:var(--miror-text-primary);font-weight:500;flex:1;padding-right:12px;">${s.name}</span>
              <div style="display:flex;gap:8px;align-items:center;">
                ${[0, 1, 2, 3].map(n => `
                  <button class="miror-rate-btn ${sevNum === n ? 'active' : ''}" data-action="rate-symptom-num" data-symptom="${s.id}" data-value="${n}">
                    ${n}
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Action Button directly below content -->
      <div style="margin:16px 0 32px;">
        <button class="btn btn-primary w-full" data-action="push" data-screen="track-wellness" style="height:52px;font-size:16px;border-radius:26px;background:var(--miror-gradient);box-shadow:var(--shadow-glow-pink);font-weight:600;">
          Add rated symptoms 🌸
        </button>
      </div>
    </div>
  `;
});

SM.register('track-wellness', () => `
  ${topBar('Track wellness', { back: true, action: '<button data-action="goHome" style="font-size:20px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">✕</button>' })}
  ${progressBar(3, 4)}
  <div class="container" style="padding:16px 20px;background:var(--miror-bg);">
    <div class="stagger" style="display:flex;flex-direction:column;gap:6px;">
      ${WELLNESS_FACTORS.map(f => `
        <div class="card card-outline float-item" style="padding:10px 14px;background:white;border-radius:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">${f.icon}</span>
              <span class="text-body" style="font-weight:600;font-size:14.5px;">${f.label}</span>
            </div>
            <span id="val-${f.id}" class="text-h3" style="color:var(--miror-pink);font-size:15px;font-weight:700;">${AppState.todayCheckin.wellness[f.id] || Math.round(f.max * 0.5)} ${f.unit}</span>
          </div>
          <input type="range" class="wellness-range" min="0" max="${f.max}" value="${AppState.todayCheckin.wellness[f.id] || Math.round(f.max * 0.5)}" data-wellness="${f.id}" style="width:100%;">
          <div style="display:flex;justify-content:space-between;margin-top:2px;">
            <span class="text-caption text-muted" style="font-size:10px;">0</span>
            <span class="text-caption text-muted" style="font-size:10px;">${f.max} ${f.unit}</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:24px;margin-bottom:32px;">
      <button class="btn btn-primary w-full" data-action="push" data-screen="track-reflection" style="height:52px;font-size:16px;border-radius:26px;background:var(--miror-gradient);box-shadow:var(--shadow-glow-pink);font-weight:600;">Next 🌸</button>
    </div>
  </div>
`);

SM.register('track-reflection', () => `
  ${topBar('Reflection', { back: true, action: '<button data-action="goHome" style="font-size:20px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">✕</button>' })}
  ${progressBar(4, 4)}
  <div class="container" style="padding:24px 20px;background:var(--miror-bg);">
    <p class="text-caption text-muted" style="margin-bottom:16px;">This is your private space — completely optional</p>
    <div class="card card-outline" style="padding:16px;">
      <textarea id="reflection-input" placeholder="Write anything on your mind..." style="width:100%;min-height:120px;border:none;outline:none;resize:none;font-family:inherit;font-size:15px;line-height:1.6;color:var(--miror-text-primary);background:transparent;"></textarea>
    </div>

    <div style="margin-top:32px;display:flex;gap:12px;">
      <button class="btn" data-action="finish-checkin" style="flex:1;background:white;color:#D93B9F;border:1.5px solid #F7B6D2;box-shadow:0 4px 14px rgba(217,59,159,0.1);font-weight:700;">Skip</button>
      <button class="btn btn-primary" data-action="finish-checkin" style="flex:2;">Complete ✨</button>
    </div>
  </div>
`);

SM.register('track-complete', () => `
  <div class="container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;padding:40px 32px;">
    <div style="font-size:72px;margin-bottom:20px;animation:bloomPulse 2s ease infinite;">🌸</div>
    <h1 class="text-h1 gradient-text" style="margin-bottom:8px;">Check-in Complete!</h1>
    <div style="display:inline-flex;align-items:center;gap:6px;background:var(--miror-success-light);padding:8px 20px;border-radius:50px;margin-bottom:24px;">
      <span style="font-size:16px;">🌟</span>
      <span class="text-body" style="font-weight:600;color:#065F46;">+10 Bloom Points</span>
    </div>

    <div class="card" style="border-left:4px solid var(--miror-purple);padding:16px 20px;text-align:left;width:100%;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span>✨</span><span class="text-label" style="color:var(--miror-purple);">QUICK INSIGHT</span>
      </div>
      <p class="text-body">Based on today's check-in, your energy levels correlate with sleep quality. Getting 7+ hours tonight could help.</p>
    </div>

    <button class="btn btn-secondary w-full" data-action="push" data-screen="ai-summary" style="margin-bottom:12px;">View Full Insights</button>
    <button class="btn btn-primary w-full" data-action="goHome" style="height:56px;font-size:17px;border-radius:28px !important;background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);box-shadow:0 8px 22px rgba(122,63,209,0.25);">Done 🌸</button>
  </div>
`);

SM.register('track-done-today', () => {
  const c = AppState.todayCheckin;
  return `
    ${topBar('Today\'s Log')}
    <div class="container" style="padding:20px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:8px;">✅</div>
        <h2 class="text-h2">Already checked in today</h2>
        <p class="text-caption text-muted">Tomorrow's check-in unlocks at midnight</p>
      </div>
      ${c.mood ? `
        <div class="card card-outline" style="padding:16px 20px;margin-bottom:12px;">
          <div class="text-label text-muted" style="margin-bottom:8px;">MOOD</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:28px;">${moodEmoji(c.mood)}</span>
            <span class="text-h3">${moodLabel(c.mood)}</span>
          </div>
        </div>
      ` : ''}
      ${c.symptoms.length ? `
        <div class="card card-outline" style="padding:16px 20px;margin-bottom:12px;">
          <div class="text-label text-muted" style="margin-bottom:8px;">SYMPTOMS</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${c.symptoms.map(s => `<span class="chip active" style="font-size:13px;">${symptomIcon(s)} ${symptomName(s)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      <button class="btn btn-secondary w-full" data-action="push" data-screen="insights" style="margin-top:16px;">View Insights</button>
    </div>
  `;
});

/* --------------------------------------------------------------------------
   LIVE VIDEO SESSION INTERACTION
   -------------------------------------------------------------------------- */
AppState.liveComments = [
  { id: 1, user: 'Reeva Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', badge: 'Member 6m', time: 'Just now', text: 'The 4-7-8 rhythm is calming my morning pulse already! 🧘‍♀️' },
  { id: 2, user: 'Shalini K.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', badge: 'Daily Streaker', time: '1m ago', text: 'Good morning from Mumbai! Joining right before my morning walk.' },
  { id: 3, user: 'Jaswi M.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', badge: 'New Member', time: '1m ago', text: 'Is it better to do this before breakfast or after?' },
  { id: 4, user: 'Dr. Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80', badge: 'Host • Clinical Lead', isHost: true, time: '2m ago', text: 'Before breakfast is ideal so cortisol stabilizes before food, Jaswi! ✨' },
  { id: 5, user: 'Meera B.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', badge: 'Top Contributor', time: '2m ago', text: 'Day 5 of this live series! My resting heart rate is down 4 bpm.' },
  { id: 6, user: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', badge: 'Yoga Coach', time: '3m ago', text: 'Remember to keep your diaphragm soft on the inhale.' }
];

window.submitLiveComment = function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('liveChatInput');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const newComment = {
    id: Date.now(),
    user: (AppState.user && AppState.user.name) ? AppState.user.name + ' Menon' : 'Ananya Menon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'You',
    isYou: true,
    time: 'Just now',
    text: text
  };

  AppState.liveComments.unshift(newComment);

  const container = document.getElementById('liveCommentsFeed');
  if (container) {
    const msgEl = document.createElement('div');
    msgEl.className = 'live-chat-message-bubble';
    msgEl.style.cssText = 'display:flex;gap:10px;margin-bottom:12px;background:#FDF2F8;border:1px solid rgba(236,72,153,0.18);padding:10px 14px;border-radius:18px;box-shadow:0 2px 8px rgba(236,72,153,0.06);';
    msgEl.innerHTML = `
      <img src="${newComment.avatar}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1.5px solid #EC5DAA;">
      <div style="flex:1;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:700;color:#0F172A;">${newComment.user}</span>
            <span style="font-size:9.5px;font-weight:700;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;padding:1px 6px;border-radius:8px;">YOU</span>
          </div>
          <span style="font-size:11px;color:#94A3B8;">${newComment.time}</span>
        </div>
        <div style="font-size:13px;color:#1E293B;line-height:1.4;">${newComment.text}</div>
      </div>
    `;
    container.insertBefore(msgEl, container.firstChild);
  }

  // Trigger floating reaction heart as well
  window.sendLiveReaction('❤️');
};

window.sendLiveReaction = function(emoji) {
  const container = document.getElementById('liveReactionCanvas') || document.body;
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'live-floating-emoji';
  el.textContent = emoji || '❤️';
  
  // Randomize horizontal offset slightly
  const offset = (Math.random() * 60) - 30;
  el.style.right = (24 + offset) + 'px';
  
  container.appendChild(el);
  setTimeout(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, 2300);
};

/* --------------------------------------------------------------------------
   9. INITIALIZATION
   -------------------------------------------------------------------------- */
function initApp() {
  const now = new Date();
  const timeEl = document.getElementById('statusTime');
  if (timeEl) timeEl.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  // Launch onboarding automatically if user has not completed onboarding
  if (typeof SM !== 'undefined') {
    if (!AppState.hasOnboarded) {
      window.startOnboarding(1);
    } else {
      SM.switchTab(AppState.currentTab || 'home');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
