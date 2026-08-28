/* ==========================================================================
   Miror Symptom Tracker — Extended Screens
   Insights, Community, Profile, Reports, Shop, Consultations, Rewards, Search
   ========================================================================== */

window.MIROR_PRIMARY_GRADIENT = 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)';

/* --------------------------------------------------------------------------
   INSIGHTS TAB (Today AI Summary, Weekly, Monthly, Calendar)
   -------------------------------------------------------------------------- */
SM.register('insights', () => {
  const tab = AppState.insightTab || 'today';
  const tabBar = `
    <div style="display:flex;gap:0;padding:0 20px;margin-bottom:20px;border-bottom:1px solid #F1F5F9;">
      ${['today','weekly','monthly','calendar'].map(t => `
        <button class="insight-tab-btn ${tab === t ? 'active' : ''}" data-action="insight-tab" data-tab="${t}" style="flex:1;padding:10px 4px;font-size:13.5px;font-weight:${tab === t ? '700' : '500'};color:${tab === t ? 'var(--miror-pink)' : 'var(--miror-text-muted)'};border:none;background:none;border-bottom:2.5px solid ${tab === t ? 'var(--miror-pink)' : 'transparent'};cursor:pointer;transition:all 0.2s;">
          ${t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      `).join('')}
    </div>`;

  if (tab === 'today') return insightsToday(tabBar);
  if (tab === 'calendar') return insightsCalendar(tabBar);
  if (tab === 'monthly') return insightsMonthly(tabBar);
  return insightsWeekly(tabBar);
});

function insightsToday(tabBar) {
  const checkin = AppState.todayCheckin;
  const mood = MOODS.find(m => m.id === (checkin.mood || 'good')) || MOODS[1];
  const loggedSymptoms = (checkin.symptoms && checkin.symptoms.length > 0) ? checkin.symptoms : ['fatigue', 'brain-fog'];
  const wellness = checkin.wellness || { sleep: 4.5, water: 7, stress: 3, activity: 25 };
  return `
    ${topBar('Insights', { back: true })}
    ${tabBar}
    <div class="container" style="padding:0 20px 20px;">
      
      <!-- Summary Card (Standard Miror Gradient Soft) -->
      <div class="card" style="background:var(--miror-gradient-soft);padding:20px;margin-bottom:16px;">
        <div class="text-overline text-muted" style="margin-bottom:8px;">TODAY • AUG 12, 2026</div>
        <p class="text-body" style="line-height:1.6;">
          Today is a <strong>steady day</strong>. Your mood is recorded as <em>${mood.label}</em> ${mood.emoji}. Fatigue was slightly elevated due to shorter sleep duration, but hydration and low stress are supporting recovery.
        </p>
      </div>

      <!-- Today's Wellness Snapshot (Card Outline) -->
      <div class="card card-outline" style="padding:20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:16px;">TODAY'S WELLNESS METRICS</div>
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;text-align:center;">
          <div style="background:#F8FAFC;padding:12px 6px;border-radius:14px;border:1px solid #F1F5F9;">
            <div style="font-size:18px;margin-bottom:2px;">😴</div>
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${wellness.sleep || 4.5}h</div>
            <div style="font-size:10px;color:#94A3B8;">Sleep</div>
          </div>
          <div style="background:#F8FAFC;padding:12px 6px;border-radius:14px;border:1px solid #F1F5F9;">
            <div style="font-size:18px;margin-bottom:2px;">💧</div>
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${wellness.water || 7} gl</div>
            <div style="font-size:10px;color:#94A3B8;">Water</div>
          </div>
          <div style="background:#F8FAFC;padding:12px 6px;border-radius:14px;border:1px solid #F1F5F9;">
            <div style="font-size:18px;margin-bottom:2px;">🧘‍♀️</div>
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${wellness.stress || 3}/10</div>
            <div style="font-size:10px;color:#94A3B8;">Stress</div>
          </div>
          <div style="background:#F8FAFC;padding:12px 6px;border-radius:14px;border:1px solid #F1F5F9;">
            <div style="font-size:18px;margin-bottom:2px;">🏃‍♀️</div>
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${wellness.activity || 25}m</div>
            <div style="font-size:10px;color:#94A3B8;">Activity</div>
          </div>
        </div>
      </div>

      <!-- Today's Logged Symptoms (Card Outline) -->
      <div class="card card-outline" style="padding:16px 20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:12px;">TODAY'S LOGGED SYMPTOMS</div>
        ${loggedSymptoms.map(s => {
          const sev = (checkin.severities && checkin.severities[s]) || (s === 'fatigue' ? 'moderate' : 'mild');
          const lvl = SEVERITY_LEVELS.find(l => l.id === sev) || SEVERITY_LEVELS[1];
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F8FAFC;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:20px;">${symptomIcon(s)}</span>
                <span class="text-body" style="font-weight:500;">${symptomName(s)}</span>
              </div>
              <span class="tag" style="background:${lvl.color}20;color:${lvl.color};font-weight:600;font-size:11px;padding:3px 10px;border-radius:12px;">
                ${lvl.label}
              </span>
            </div>
          `;
        }).join('')}
      </div>

      <!-- AI Insights Section (Consistent Tag & Left Border System) -->
      <div class="text-label text-muted" style="margin-bottom:12px;">AI INSIGHTS ✨</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
        
        <!-- Pattern Detected Card -->
        <div class="card" style="border-left:4px solid #8B5CF6;padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="tag" style="background:#EDE9FE;color:#7C3AED;font-size:11px;font-weight:600;">🔗 Pattern Detected</span>
          </div>
          <div class="text-body" style="font-weight:600;margin-bottom:4px;color:#0F172A;">Poor sleep → increased fatigue today</div>
          <p class="text-caption text-secondary" style="margin-bottom:12px;">
            Your fatigue was 40% worse today following less than 5 hours of sleep last night.
          </p>
          
          <!-- Bar Chart embedded cleanly -->
          <div style="display:flex;flex-direction:column;gap:4px;background:#F8FAFC;padding:10px 12px;border-radius:12px;">
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;align-items:flex-end;height:32px;">
              <div style="display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
                <div style="width:100%;height:28px;background:#EF4444;border-radius:4px;"></div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
                <div style="width:100%;height:18px;background:#F59E0B;border-radius:4px;"></div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
                <div style="width:100%;height:10px;background:#10B981;border-radius:4px;"></div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
                <div style="width:100%;height:4px;background:#059669;border-radius:4px;"></div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;text-align:center;">
              <span style="font-size:10px;color:#EF4444;font-weight:600;">&lt;5h (Today)</span>
              <span style="font-size:10px;color:#94A3B8;font-weight:500;">5-6h</span>
              <span style="font-size:10px;color:#94A3B8;font-weight:500;">6-7h</span>
              <span style="font-size:10px;color:#94A3B8;font-weight:500;">7+h</span>
            </div>
          </div>
        </div>

        <!-- Positive Trend Card -->
        <div class="card" style="border-left:4px solid var(--miror-success);padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="tag" style="background:var(--miror-success-light);color:#065F46;font-size:11px;font-weight:600;">📈 Positive Trend</span>
          </div>
          <div class="text-body" style="font-weight:600;margin-bottom:4px;color:#0F172A;">Energy improved 18% this afternoon</div>
          <p class="text-caption text-secondary" style="margin-bottom:8px;">
            Consistent hydration and a morning walk helped sustain your energy through the afternoon.
          </p>
          <div style="height:40px;width:100%;position:relative;overflow:hidden;border-radius:8px;">
            <svg viewBox="0 0 300 40" style="width:100%;height:100%;display:block;" preserveAspectRatio="none">
              <defs>
                <linearGradient id="aiTodayGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M0,32 C50,30 90,26 150,18 C210,12 250,8 300,5 L300,40 L0,40 Z" fill="url(#aiTodayGreen)"/>
              <path d="M0,32 C50,30 90,26 150,18 C210,12 250,8 300,5" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Observation Card -->
        <div class="card" style="border-left:4px solid var(--miror-warning);padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="tag" style="background:var(--miror-warning-light);color:#92400E;font-size:11px;font-weight:600;">🌡️ Observation</span>
          </div>
          <div class="text-body" style="font-weight:600;margin-bottom:4px;color:#0F172A;">Low stress kept symptoms in check</div>
          <p class="text-caption text-secondary">
            With stress recorded at 3/10 today, zero severe hot flash episodes were noted. Consider evening relaxation techniques.
          </p>
        </div>

      </div>

      <button class="btn btn-secondary w-full" data-action="push" data-screen="report-generate">Generate Doctor Report 📋</button>
      <p class="text-caption text-muted text-center" style="margin-top:12px;">These insights are generated from your tracking data and are not medical advice.</p>
    </div>
  `;
}

SM.register('ai-summary', () => {
  AppState.insightTab = 'today';
  return SM.screens['insights']();
});

function insightsWeekly(tabBar) {
  const hist = AppState.history.slice(-7);
  const symptomCounts = {};
  hist.forEach(h => h.symptoms.forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; }));
  const topS = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return `
    ${topBar('Insights', { back: true })}
    ${tabBar}
    <div class="container" style="padding:0 20px 20px;">
      <!-- Summary Card -->
      <div class="card" style="background:var(--miror-gradient-soft);padding:20px;margin-bottom:16px;">
        <div class="text-overline text-muted" style="margin-bottom:8px;">THIS WEEK • Jul 29 – Aug 4</div>
        <p class="text-body" style="line-height:1.6;">This was a <strong>moderate week</strong>. You experienced ${Object.keys(symptomCounts).length} different symptoms across ${hist.filter(h => h.symptoms.length > 0).length} days. Your mood averaged between <em>Okay</em> and <em>Good</em>.</p>
      </div>

      <!-- Mood Trend -->
      <div class="card card-outline" style="padding:20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:24px;">MOOD TREND</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:90px;">
          ${hist.map((h, i) => {
            const m = MOODS.find(m => m.id === h.mood);
            const heights = { amazing: 55, good: 44, okay: 33, low: 22, rough: 11 };
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
              <span style="font-size:16px;line-height:1;margin-bottom:2px;">${m.emoji}</span>
              <div style="width:100%;height:${heights[h.mood]}px;background:linear-gradient(180deg,${m.color}40,${m.color}15);border-radius:6px;"></div>
              <span style="font-size:9px;color:var(--miror-text-muted);margin-top:4px;">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Top Symptoms -->
      <div class="card card-outline" style="padding:16px 20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:12px;">MOST FREQUENT SYMPTOMS</div>
        ${topS.map(([s, count]) => `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span style="font-size:20px;">${symptomIcon(s)}</span>
            <div style="flex:1;">
              <div class="text-body" style="font-weight:500;">${symptomName(s)}</div>
              <div class="progress-bar" style="margin-top:4px;"><div class="progress-fill" style="width:${(count/7)*100}%;"></div></div>
            </div>
            <span class="text-caption text-muted">${count}/7 days</span>
          </div>
        `).join('')}
      </div>

      <!-- AI Insights -->
      <div class="text-label text-muted" style="margin-bottom:12px;">AI INSIGHTS ✨</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
        <div class="card" style="border-left:4px solid #8B5CF6;padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;"><span class="tag" style="background:#EDE9FE;color:#7C3AED;font-size:11px;">🔗 Pattern</span></div>
          <p class="text-body">Poor sleep may be increasing your fatigue. Your energy was 40% lower on nights with less than 5 hours of sleep.</p>
        </div>
        <div class="card" style="border-left:4px solid var(--miror-success);padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;"><span class="tag" style="background:var(--miror-success-light);color:#065F46;font-size:11px;">📈 Trend</span></div>
          <p class="text-body">Energy improved <strong>18%</strong> compared to last week. Your consistent tracking is helping!</p>
        </div>
        <div class="card" style="border-left:4px solid var(--miror-warning);padding:16px 20px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;"><span class="tag" style="background:var(--miror-warning-light);color:#92400E;font-size:11px;">🌡️ Observation</span></div>
          <p class="text-body">Hot flashes tend to occur after high-stress days. Consider stress-reduction techniques.</p>
        </div>
      </div>

      <button class="btn btn-secondary w-full" data-action="push" data-screen="report-generate">Generate Doctor Report 📋</button>
    </div>
  `;
}

function insightsMonthly(tabBar) {
  return `
    ${topBar('Insights', { back: true })}
    ${tabBar}
    <div class="container" style="padding:0 20px 20px;">
      <h3 class="text-h2" style="margin-bottom:4px;">August 2026</h3>
      <p class="text-caption text-muted" style="margin-bottom:20px;">15 days tracked • Average mood: Good</p>

      <!-- Symptom Frequency -->
      <div class="card card-outline" style="padding:16px 20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:16px;">SYMPTOM FREQUENCY</div>
        ${[
          { name: 'Fatigue', count: 10, total: 15, color: '#F97316' },
          { name: 'Hot flashes', count: 8, total: 15, color: '#EF4444' },
          { name: 'Brain fog', count: 6, total: 15, color: '#8B5CF6' },
          { name: 'Poor sleep', count: 5, total: 15, color: '#3B82F6' },
          { name: 'Joint pain', count: 3, total: 15, color: '#10B981' }
        ].map(s => `
          <div style="margin-bottom:14px;">
            <div class="flex-between" style="margin-bottom:4px;">
              <span class="text-body" style="font-weight:500;">${s.name}</span>
              <span class="text-caption text-muted">${s.count}/${s.total} days</span>
            </div>
            <div style="height:8px;background:#F3F4F6;border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${(s.count/s.total)*100}%;background:${s.color};border-radius:4px;transition:width 0.6s ease;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Mood Distribution -->
      <div class="card card-outline" style="padding:20px;margin-bottom:16px;">
        <div class="text-label text-muted" style="margin-bottom:24px;">MOOD DISTRIBUTION</div>
        <div style="display:flex;gap:8px;align-items:flex-end;height:95px;">
          ${[
            { mood: 'Amazing', emoji: '🌟', count: 3, color: '#10B981' },
            { mood: 'Good', emoji: '😊', count: 5, color: '#34D399' },
            { mood: 'Okay', emoji: '😐', count: 4, color: '#F59E0B' },
            { mood: 'Low', emoji: '😔', count: 2, color: '#F97316' },
            { mood: 'Rough', emoji: '😣', count: 1, color: '#EF4444' }
          ].map(m => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
              <span class="text-caption" style="font-weight:600;color:${m.color};font-size:12px;margin-bottom:2px;">${m.count}</span>
              <div style="width:100%;height:${(m.count/5)*55}px;background:${m.color}35;border-radius:6px;min-height:8px;"></div>
              <span style="font-size:18px;margin-top:4px;">${m.emoji}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sleep Trend -->
      <div class="card card-outline" style="padding:16px 20px;margin-bottom:16px;">
        <div class="flex-between" style="margin-bottom:12px;">
          <div class="text-label text-muted">SLEEP TREND</div>
          <span class="text-caption" style="color:var(--miror-success);">↑ Improving</span>
        </div>
        ${miniLineChart([4, 5, 3, 5, 7, 8, 7], '#8B5CF6', 60)}
        <div style="display:flex;justify-content:space-between;margin-top:6px;">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<span style="font-size:9px;color:var(--miror-text-muted);">${d}</span>`).join('')}
        </div>
      </div>

      <!-- Correlations -->
      <div class="text-label text-muted" style="margin-bottom:12px;">CORRELATIONS</div>
      <div class="card" style="border-left:4px solid #EC4899;padding:16px 20px;margin-bottom:12px;">
        <div class="text-body" style="font-weight:500;margin-bottom:4px;">Sleep ↔ Fatigue</div>
        <p class="text-caption text-secondary">Strong correlation — when sleep drops below 5hrs, fatigue increases by 60%</p>
      </div>
      <div class="card" style="border-left:4px solid #F59E0B;padding:16px 20px;margin-bottom:12px;">
        <div class="text-body" style="font-weight:500;margin-bottom:4px;">Stress ↔ Hot Flashes</div>
        <p class="text-caption text-secondary">Moderate correlation — stress levels above 7 preceded hot flashes 70% of the time</p>
      </div>
      <div class="card" style="border-left:4px solid #10B981;padding:16px 20px;">
        <div class="text-body" style="font-weight:500;margin-bottom:4px;">Activity ↔ Mood</div>
        <p class="text-caption text-secondary">Positive correlation — days with 30+ min activity had 45% better mood scores</p>
      </div>
    </div>
  `;
}

function insightsCalendar(tabBar) {
  const days = [];
  const moodColors = { amazing: '#10B981', good: '#34D399', okay: '#F59E0B', low: '#F97316', rough: '#EF4444' };
  for (let i = 1; i <= 31; i++) {
    const dateStr = `2026-08-${String(i).padStart(2, '0')}`;
    const entry = AppState.history.find(h => h.date === dateStr);
    const color = entry ? (moodColors[entry.mood] || '#E5E7EB') : '#E5E7EB';
    const hasData = !!entry;
    const isToday = i === 5;
    days.push({ day: i, color, hasData, isToday, date: dateStr });
  }
  // Fill July entries
  const julyDays = [];
  for (let i = 29; i <= 31; i++) {
    const dateStr = `2026-07-${i}`;
    const entry = AppState.history.find(h => h.date === dateStr);
    julyDays.push({ day: i, color: entry ? (moodColors[entry.mood] || '#E5E7EB') : '#E5E7EB', hasData: !!entry, date: dateStr });
  }
  return `
    ${topBar('Insights', { back: true })}
    ${tabBar}
    <div class="container" style="padding:0 20px 20px;">
      <div class="flex-between" style="margin-bottom:16px;">
        <h3 class="text-h2">August 2026</h3>
        <div style="display:flex;gap:12px;">
          <button style="font-size:18px;opacity:0.5;">‹</button>
          <button style="font-size:18px;">›</button>
        </div>
      </div>

      <div class="card card-outline" style="padding:16px;">
        <!-- Weekday headers -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;">
          ${['S','M','T','W','T','F','S'].map(d => `<div class="text-label text-muted text-center">${d}</div>`).join('')}
        </div>
        <!-- Days grid (Aug 1 = Saturday, offset 6) -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
          ${Array(5).fill(null).map(() => '<div></div>').join('')}
          ${days.map(d => `
            <button style="aspect-ratio:1;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:13px;font-weight:${d.isToday ? '700' : '400'};border:${d.isToday ? '2px solid var(--miror-pink)' : 'none'};background:${d.hasData ? d.color + '20' : 'transparent'};color:var(--miror-text-primary);cursor:${d.hasData ? 'pointer' : 'default'};" ${d.hasData ? `data-action="view-day" data-date="${d.date}"` : ''}>
              ${d.day}
              ${d.hasData ? `<div style="width:5px;height:5px;border-radius:50%;background:${d.color};margin-top:1px;"></div>` : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Legend -->
      <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;">
        ${[{l:'Amazing',c:'#10B981'},{l:'Good',c:'#34D399'},{l:'Okay',c:'#F59E0B'},{l:'Low',c:'#F97316'},{l:'Rough',c:'#EF4444'}].map(i => `
          <div style="display:flex;align-items:center;gap:4px;"><div class="calendar-dot" style="background:${i.c};"></div><span style="font-size:10px;color:var(--miror-text-muted);">${i.l}</span></div>
        `).join('')}
      </div>
    </div>
  `;
}



SM.register('insights-day', (params) => {
  const date = params.date || '2026-08-04';
  const entry = AppState.history.find(h => h.date === date);
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const d = new Date(date);
  const dayName = dayNames[d.getDay()];
  const dateDisplay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (!entry) return `${topBar(dateDisplay, { back: true })}<div class="container" style="padding:40px 20px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">📝</div><h3 class="text-h2">No data for this day</h3><p class="text-body text-muted" style="margin-top:8px;">You didn't check in on ${dayName}.</p></div>`;

  return `
    ${topBar(dateDisplay, { back: true })}
    <div class="container" style="padding:16px 20px;">
      <h3 class="text-h2" style="margin-bottom:20px;">${dayName}'s Summary</h3>

      <!-- Mood -->
      <div class="card card-outline" style="padding:16px 20px;margin-bottom:12px;">
        <div class="text-label text-muted" style="margin-bottom:8px;">MOOD</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">${moodEmoji(entry.mood)}</span>
          <span class="text-h2">${moodLabel(entry.mood)}</span>
        </div>
      </div>

      <!-- Symptoms -->
      ${entry.symptoms.length ? `
        <div class="card card-outline" style="padding:16px 20px;margin-bottom:12px;">
          <div class="text-label text-muted" style="margin-bottom:12px;">SYMPTOMS</div>
          ${entry.symptoms.map(s => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;${s !== entry.symptoms[entry.symptoms.length-1] ? 'border-bottom:1px solid var(--miror-border);' : ''}">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:18px;">${symptomIcon(s)}</span>
                <span class="text-body">${symptomName(s)}</span>
              </div>
              <span class="tag" style="font-size:11px;padding:4px 10px;border-radius:20px;background:${severityColor(entry.severities[s])}20;color:${severityColor(entry.severities[s])};">${entry.severities[s] || 'mild'}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Wellness -->
      ${entry.wellness ? `
        <div class="card card-outline" style="padding:16px 20px;">
          <div class="text-label text-muted" style="margin-bottom:12px;">WELLNESS FACTORS</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            ${[
              { icon: '😴', label: 'Sleep', val: entry.wellness.sleep + 'h' },
              { icon: '💧', label: 'Water', val: entry.wellness.water },
              { icon: '😰', label: 'Stress', val: entry.wellness.stress + '/10' },
              { icon: '🏃‍♀️', label: 'Activity', val: (entry.wellness.activity || 0) },
              { icon: '🥗', label: 'Nutrition', val: (entry.wellness.nutrition || 0) + '/10' }
            ].map(w => `
              <div style="text-align:center;">
                <div style="font-size:22px;margin-bottom:4px;">${w.icon}</div>
                <div class="text-body" style="font-weight:600;">${w.val}</div>
                <div class="text-caption text-muted">${w.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
});

/* --------------------------------------------------------------------------
   AI SUMMARY
   -------------------------------------------------------------------------- */
SM.register('ai-summary', () => `
  ${topBar('AI Summary ✨', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <h3 class="text-h2" style="margin-bottom:4px;">This Week's Insights</h3>
    <p class="text-caption text-muted" style="margin-bottom:20px;">Powered by your tracking data</p>

    <div style="display:flex;flex-direction:column;gap:16px;">
      <!-- Correlation -->
      <div class="card" style="border-left:4px solid #8B5CF6;padding:20px;">
        <span class="tag" style="background:#EDE9FE;color:#7C3AED;font-size:11px;padding:4px 10px;border-radius:12px;margin-bottom:8px;display:inline-block;">🔗 Pattern Detected</span>
        <h4 class="text-h3" style="margin-bottom:6px;">Poor sleep → increased fatigue</h4>
        <p class="text-body text-secondary" style="margin-bottom:12px;">Your fatigue was 40% worse on nights with less than 5 hours of sleep. This pattern appeared 4 times this week.</p>
        ${miniBarChart([
          { label: '<5h', value: 8, color: '#EF4444' },
          { label: '5-6h', value: 5, color: '#F59E0B' },
          { label: '6-7h', value: 3, color: '#34D399' },
          { label: '7+h', value: 1, color: '#10B981' }
        ], 40)}
        <p class="text-caption text-muted" style="margin-top:8px;">Fatigue severity by sleep hours</p>
      </div>

      <!-- Trend -->
      <div class="card" style="border-left:4px solid var(--miror-success);padding:20px;">
        <span class="tag" style="background:var(--miror-success-light);color:#065F46;font-size:11px;padding:4px 10px;border-radius:12px;margin-bottom:8px;display:inline-block;">📈 Positive Trend</span>
        <h4 class="text-h3" style="margin-bottom:6px;">Energy improved 18% this month</h4>
        <p class="text-body text-secondary" style="margin-bottom:12px;">Your consistent tracking is helping you understand patterns. Keep going!</p>
        ${miniLineChart([3, 4, 3, 5, 6, 7, 7], '#10B981', 40)}
      </div>

      <!-- Observation -->
      <div class="card" style="border-left:4px solid var(--miror-warning);padding:20px;">
        <span class="tag" style="background:var(--miror-warning-light);color:#92400E;font-size:11px;padding:4px 10px;border-radius:12px;margin-bottom:8px;display:inline-block;">🌡️ Observation</span>
        <h4 class="text-h3" style="margin-bottom:6px;">Hot flashes follow high-stress days</h4>
        <p class="text-body text-secondary">When stress was above 7/10, hot flashes occurred the next day 70% of the time. Consider evening relaxation techniques.</p>
      </div>

      <!-- Summary -->
      <div class="card" style="background:var(--miror-gradient-soft);padding:20px;">
        <h4 class="text-h3" style="margin-bottom:6px;">Weekly Summary</h4>
        <p class="text-body">Your symptoms have become more stable compared to last week. The biggest improvement was in sleep quality (+2 hours average). Continue focusing on stress management for best results.</p>
      </div>
    </div>

    <button class="btn btn-secondary w-full" style="margin-top:20px;" data-action="push" data-screen="report-generate">Share with Doctor 📋</button>
    <p class="text-caption text-muted text-center" style="margin-top:12px;">These insights are generated from your tracking data and are not medical advice.</p>
  </div>
`);

/* --------------------------------------------------------------------------
   COMMUNITY GROUPS DATA & INTERACTIVE LOGIC
   -------------------------------------------------------------------------- */
window.MIROR_COMMUNITY_GROUPS = [
  // Circle Groups Matching UI Design
  { id: '30s-hormones', cat: 'wellness', unread: true, trending: true, icon: '🌸', name: '30s Hormones & Fertility', sub: 'Hormonal balance & fertility', members: '3.4k members', active: '+24 active', bg: '#FDF2F8', av1: '👩🏻', av2: '👩🏽' },
  { id: 'postpartum-moms', cat: 'wellness', unread: false, trending: true, icon: '🤱', name: 'Postpartum & New Moms', sub: 'Motherhood & recovery', members: '2.8k members', active: '+18 active', bg: '#FAF5FF', av1: '👱🏻‍♀️', av2: '👩🏾' },
  { id: 'calm-collective', cat: 'wellness', unread: false, trending: true, icon: '🧘', name: 'Calm Collective', sub: 'Mental wellbeing & mindfulness', members: '2.1k members', active: '+15 active', bg: '#F0FDF4', av1: '👩🏼', av2: '👩🏻' },
  { id: '50-menopause', cat: 'wellness', unread: true, trending: false, icon: '🌺', name: '50+ Menopause', sub: 'Menopause transition & vitality', members: '4.6k members', active: '+32 active', bg: '#EFF6FF', av1: '👩🏽', av2: '👩🏼' },
  { id: 'beautie', cat: 'wellness', unread: false, trending: true, icon: '✨', iconImg: 'icon_miror_beautie.jpg', name: 'Beautie', sub: 'Skin & holistic beauty', members: '1.5k members', active: '+22 active', bg: '#FFFBEB', av1: '👩🏻', av2: '👩🏽' },

  // Section 1: Wellness
  { id: 'mingle', cat: 'wellness', unread: true, trending: true, icon: '🪷', iconImg: 'icon_miror_mingle.jpg', name: 'Miror@Mingle', sub: 'General social/community', members: '1.2k members', active: '+12 active', bg: '#FAF5FF', av1: '👩🏻', av2: '👩🏽' },
  { id: 'fit', cat: 'wellness', unread: false, trending: true, icon: '🧘‍♀️', iconImg: 'icon_morning_reset.jpg', name: 'Miror Fit Circle', sub: 'Fitness', members: '850 members', active: '+5 active', bg: '#FDF2F8', av1: '👱🏻‍♀️', av2: '👩🏾' },
  { id: 'nourish', cat: 'wellness', unread: true, trending: false, icon: '🥗', name: 'Miror Nourish', sub: 'Nutrition', members: '940 members', active: '+8 active', bg: '#F0FDF4', av1: '👩🏻', av2: '👩🏼' },
  { id: 'books', cat: 'wellness', unread: false, trending: false, icon: '📚', iconImg: 'icon_book_lovers.png', name: 'Book Lovers@Miror', sub: 'Hobbies / lifestyle', members: '620 members', active: '+15 active', bg: '#EFF6FF', av1: '👩🏽', av2: '👱🏻‍♀️' },
  { id: 'bloom', cat: 'wellness', unread: true, trending: true, icon: '🌸', iconImg: 'icon_bloom.jpg', name: 'Miror Bloom', sub: "Women's wellness", members: '2.8k members', active: '+30 active', bg: '#FDF2F8', av1: '👩🏼', av2: '👩🏻' },
  { id: 'hrt', cat: 'wellness', unread: false, trending: true, icon: '💊', name: 'HRT@Miror', sub: 'HRT-focused', members: '1.8k members', active: '+14 active', bg: '#FAF5FF', av1: '👩🏽', av2: '👩🏼' },
  { id: 'sizzle', cat: 'wellness', unread: true, trending: false, icon: '🔥', name: 'Miror Sizzle', sub: 'Active lifestyle / discussions', members: '780 members', active: '+9 active', bg: '#FFF7ED', av1: '👩🏽', av2: '👩🏻' },
  { id: 'calm', cat: 'wellness', unread: false, trending: true, icon: '💍', iconImg: 'icon_morning_reset.jpg', name: 'Calm Collective', sub: 'Mental wellbeing', members: '2.1k members', active: '+18 active', bg: '#FAF5FF', av1: '👱🏻‍♀️', av2: '👩🏻' },

  // Section 2: City Circles
  { id: 'bangalore', cat: 'cities', unread: true, trending: true, icon: '🌳', name: 'Bangalore', sub: 'City circle & meetups', members: '1.6k members', active: '+20 active', bg: '#F0FDF4', av1: '👩🏻', av2: '👩🏼' },
  { id: 'mumbai', cat: 'cities', unread: true, trending: true, icon: '🌊', name: 'Mumbai', sub: 'City circle & meetups', members: '2.4k members', active: '+28 active', bg: '#EFF6FF', av1: '👩🏽', av2: '👱🏻‍♀️' },
  { id: 'chennai', cat: 'cities', unread: false, trending: false, icon: '🏖️', name: 'Chennai', sub: 'City circle & meetups', members: '1.1k members', active: '+11 active', bg: '#FFFBEB', av1: '👩🏼', av2: '👩🏽' },
  { id: 'delhi', cat: 'cities', unread: true, trending: true, icon: '🏛️', name: 'Delhi', sub: 'City circle & meetups', members: '1.9k members', active: '+16 active', bg: '#FEF2F2', av1: '👩🏻', av2: '👩🏾' },
  { id: 'hyderabad', cat: 'cities', unread: false, trending: false, icon: '💎', name: 'Hyderabad', sub: 'City circle & meetups', members: '1.3k members', active: '+14 active', bg: '#FAF5FF', av1: '👩🏻', av2: '👱🏻‍♀️' },

  // Section 3: Challenges
  { id: 'detox', cat: 'challenges', unread: true, trending: true, icon: '🍵', iconImg: 'icon_detox_21.jpg', name: '21 Day Detox Challenge', sub: 'Body cleanse & renewal', members: '5.2k members', active: '+45 active', bg: '#ECFDF5', av1: '👩🏻', av2: '👩🏾' },
  { id: 'morning-yoga', cat: 'challenges', unread: true, trending: true, icon: '🧘', iconImg: 'icon_morning_reset.jpg', name: '14-Day Morning Reset', sub: 'Morning stretch & energy', members: '3.8k members', active: '+32 active', bg: '#FAF5FF', av1: '👩🏼', av2: '👩🏻' },
  { id: 'sugar-free', cat: 'challenges', unread: false, trending: false, icon: '🍎', name: 'Sugar-Free Sprint', sub: 'Clean nutrition sprint', members: '2.9k members', active: '+19 active', bg: '#FEF2F2', av1: '👩🏽', av2: '👱🏻‍♀️' },
  { id: 'sleep-reset', cat: 'challenges', unread: false, trending: true, icon: '🌙', name: 'Deep Sleep 7-Day', sub: 'Hormonal rest & recovery', members: '4.1k members', active: '+27 active', bg: '#EFF6FF', av1: '👩🏻', av2: '👩🏽' },

  // Section 4: Community
  { id: 'comm1', cat: 'community', unread: true, trending: true, icon: '💬', name: 'Community 1', sub: 'Peer support & open talks', members: '3.4k members', active: '+35 active', bg: '#FAF5FF', av1: '👩🏻', av2: '👩🏽' },
  { id: 'comm2', cat: 'community', unread: false, trending: true, icon: '🪞', name: 'Community 2', sub: 'Daily check-ins & stories', members: '2.2k members', active: '+18 active', bg: '#FDF2F8', av1: '👱🏻‍♀️', av2: '👩🏾' },
  { id: 'comm3', cat: 'community', unread: true, trending: false, icon: '🤝', name: 'Community 3', sub: 'Ask an expert & AMA', members: '1.9k members', active: '+24 active', bg: '#EFF6FF', av1: '👩🏼', av2: '👩🏻' }
];

window.renderCommunityGroupCard = function(g) {
  return `
    <div class="card card-interactive" style="width:166px;min-width:166px;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:28px;padding:20px 18px 18px;border:1px solid rgba(255,255,255,0.7);box-shadow:0 14px 34px rgba(15,23,42,0.07), 0 4px 12px rgba(15,23,42,0.025);display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;cursor:pointer;transition:all 0.2s ease;" data-action="push" data-screen="community-group" data-group-id="${g.id}">
      <div style="width:44px;height:44px;border-radius:14px;background:${g.bg};display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        ${g.iconImg ? `<img src="${g.iconImg}" alt="${g.name}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<span style="font-size:22px;">${g.icon}</span>`}
      </div>
      <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0 0 4px;letter-spacing:-0.2px;line-height:1.25;min-height:38px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;">
        ${g.name}
      </h4>
      <p style="font-size:11.5px;font-weight:600;color:var(--miror-pink);margin:0 0 4px;letter-spacing:0.1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:16px;">
        ${g.sub}
      </p>
      <p style="font-size:12.5px;color:#64748B;margin:0;font-weight:500;">
        ${g.members}
      </p>
    </div>
  `;
};

window.filterCommunityCircles = function(filterMode, btn) {
  const chips = document.querySelectorAll('.community-filter-chip');
  chips.forEach(c => {
    c.style.background = '#F1F5F9';
    c.style.color = '#64748B';
    c.style.boxShadow = 'none';
    c.classList.remove('active');
  });

  if (btn) {
    btn.style.background = 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)';
    btn.style.color = '#FFFFFF';
    btn.style.boxShadow = '0 4px 12px rgba(122,63,209,0.2)';
    btn.classList.add('active');
  }

  const sections = document.querySelectorAll('.community-category-section');
  sections.forEach(sec => {
    const secCat = sec.getAttribute('data-category');
    let matching = window.MIROR_COMMUNITY_GROUPS.filter(g => g.cat === secCat);
    
    if (filterMode === 'unread') {
      matching = matching.filter(g => g.unread);
    } else if (filterMode === 'trending') {
      matching = matching.filter(g => g.trending);
    }

    const track = sec.querySelector('.community-section-track');
    if (matching.length > 0) {
      sec.style.display = 'block';
      if (track) track.innerHTML = matching.map(window.renderCommunityGroupCard).join('');
    } else {
      sec.style.display = 'none';
    }
  });
};

window.searchCommunityCircles = function(query) {
  const q = (query || '').toLowerCase().trim();
  const sections = document.querySelectorAll('.community-category-section');

  sections.forEach(sec => {
    const secCat = sec.getAttribute('data-category');
    const matching = window.MIROR_COMMUNITY_GROUPS.filter(g => 
      g.cat === secCat && (
        g.name.toLowerCase().includes(q) || 
        (g.sub && g.sub.toLowerCase().includes(q)) || 
        g.members.toLowerCase().includes(q)
      )
    );

    const track = sec.querySelector('.community-section-track');
    if (matching.length > 0) {
      sec.style.display = 'block';
      if (track) track.innerHTML = matching.map(window.renderCommunityGroupCard).join('');
    } else {
      if (q === '') {
        sec.style.display = 'block';
        const allSecGroups = window.MIROR_COMMUNITY_GROUPS.filter(g => g.cat === secCat);
        if (track) track.innerHTML = allSecGroups.map(window.renderCommunityGroupCard).join('');
      } else {
        sec.style.display = 'none';
      }
    }
  });
};

window.toggleCommunitySearchBar = function() {
  const searchRow = document.getElementById('community-expandable-search');
  if (!searchRow) return;
  const isHidden = searchRow.style.display === 'none';
  searchRow.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    const input = document.getElementById('community-header-search-input');
    if (input) input.focus();
  } else {
    window.searchCommunityFeedAndGroups('');
  }
};

window.searchCommunityFeedAndGroups = function(query) {
  const q = (query || '').toLowerCase().trim();
  window.searchCommunityCircles(query);
  
  const container = document.getElementById('care-feed-container');
  if (container) {
    if (!q) {
      container.innerHTML = window.renderCareFeedStream();
    } else {
      const filtered = window.MIROR_CARE_FEED.filter(item => {
        return (item.caption && item.caption.toLowerCase().includes(q)) ||
               (item.title && item.title.toLowerCase().includes(q)) ||
               (item.body && item.body.toLowerCase().includes(q)) ||
               (item.author && item.author.name && item.author.name.toLowerCase().includes(q)) ||
               (item.hashtags && item.hashtags.some(h => h.toLowerCase().includes(q)));
      });
      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px 20px;background:#FFF;border-radius:24px;border:1px solid #F1F5F9;margin:0 16px;">
            <div style="font-size:36px;margin-bottom:10px;">🔍</div>
            <h4 style="font-size:16px;font-weight:600;color:#0F172A;margin:0 0 6px;">No posts found for "${query}"</h4>
            <p style="font-size:13px;color:#64748B;margin:0;">Try searching for symptoms, topics, or doctor names.</p>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(window.renderCareFeedCard).join('');
      }
    }
  }
};

/* --------------------------------------------------------------------------
   WELLNESS PROGRAM STORIES DATA & VIEWER (INSTAGRAM STICKER STYLES)
   -------------------------------------------------------------------------- */
window.MIROR_WELLNESS_USER_STORIES = [
  {
    id: 'your-story',
    username: 'priya_menon',
    name: 'Your Story',
    avatar: 'profile_avatar.jpg',
    isUser: true,
    hasStory: false,
    slides: [] // Initial no-story state
  },
  {
    id: 'todays-tip',
    username: 'todays_tip',
    name: "Today's Tip",
    avatar: 'article_morning_reset.jpg',
    isUser: false,
    hasStory: true,
    slides: [
      {
        image: 'article_morning_reset.jpg',
        time: '2h',
        caption: 'soaking in sunlight like a happy plant 🌿☀️',
        stickerCss: 'top:18%;left:12%;transform:rotate(-2deg);background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#FFFFFF;font-size:15px;font-weight:600;padding:9px 18px;border-radius:20px;box-shadow:0 6px 20px rgba(0,0,0,0.45);',
        link: null
      },
      {
        image: 'article_cooling_herbs.jpg',
        time: '1h',
        caption: 'chamomile & cozy vibes on repeat 🍵✨',
        stickerCss: 'top:20%;right:12%;transform:rotate(2deg);background:#D97706;color:#FFFFFF;font-size:15px;font-weight:600;padding:8px 16px;border-radius:10px;box-shadow:0 8px 22px rgba(217,119,6,0.45);',
        link: {
          type: 'GROUP',
          label: 'Miror@Mingle',
          icon: '👥',
          actionText: 'VISIT',
          groupId: 'mingle'
        }
      }
    ]
  },
  {
    id: 'shalini',
    username: 'shalini_mobility',
    name: 'Shalini',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    isUser: false,
    hasStory: true,
    slides: [
      {
        image: 'story_shalini_mobility.jpg',
        time: '5h',
        caption: 'hips unlocked & ready to conquer 🌸💃',
        stickerCss: 'top:18%;left:12%;transform:rotate(2.5deg);background:#EA580C;color:#FFFFFF;font-size:15.5px;font-weight:600;padding:8px 16px;border-radius:10px;box-shadow:0 8px 22px rgba(234,88,12,0.45);',
        link: {
          type: 'GROUP',
          label: 'Miror Fit Circle',
          icon: '👥',
          actionText: 'VISIT',
          groupId: 'fit'
        }
      },
      {
        image: 'story_shalini_lemon.jpg',
        time: '4h',
        caption: 'good energy is officially contagious ✨💫',
        stickerCss: 'top:22%;right:12%;transform:rotate(-2deg);background:#FACC15;color:#0F172A;font-size:15.5px;font-weight:600;padding:8px 18px;border-radius:10px;box-shadow:0 8px 22px rgba(250,204,21,0.45);',
        link: null
      }
    ]
  },
  {
    id: 'jaanvi',
    username: 'jaanvi_vibe',
    name: 'Jaanvi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    isUser: false,
    hasStory: true,
    slides: [
      {
        image: 'community_live_pulse.jpg',
        time: '6h',
        caption: 'pelvic power & core vibes only 💪🎯',
        stickerCss: 'top:18%;left:12%;transform:rotate(-2deg);background:#7C3AED;color:#FFFFFF;font-size:15.5px;font-weight:600;padding:8px 18px;border-radius:10px;box-shadow:0 8px 24px rgba(124,58,237,0.45);',
        link: {
          type: 'CHALLENGE',
          label: '21 Days of Detox Challenge',
          icon: '🎯',
          actionText: 'JOIN',
          id: 'detox-21'
        }
      }
    ]
  },
  {
    id: 'shreya',
    username: 'shreya_nutrition',
    name: 'Shreya',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    isUser: false,
    hasStory: true,
    slides: [
      {
        image: 'story_shreya_salad.jpg',
        time: '8h',
        caption: 'feeding my glow with green goodness 🥑🥗✨',
        stickerCss: 'top:19%;right:12%;transform:rotate(2.5deg);background:#059669;color:#FFFFFF;font-size:15.5px;font-weight:600;padding:8px 18px;border-radius:10px;box-shadow:0 8px 22px rgba(5,150,105,0.45);',
        link: null
      }
    ]
  }
];

window.currentStoryUserIndex = 0;
window.currentStorySlideIndex = 0;
window.wellnessStoryTimer = null;
window.wellnessStoryProgressInterval = null;

window.openCreateStoryModal = function() {
  const modal = document.createElement('div');
  modal.id = 'create-story-modal';
  modal.style.position = 'absolute';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.7)';
  modal.style.backdropFilter = 'blur(10px)';
  modal.style.webkitBackdropFilter = 'blur(10px)';
  modal.style.zIndex = '950';
  modal.style.display = 'flex';
  modal.style.alignItems = 'flex-end';
  modal.style.justifyContent = 'center';
  modal.style.fontFamily = "'Montserrat', sans-serif";

  modal.innerHTML = `
    <div style="background:#FFFFFF;width:100%;border-radius:32px 32px 0 0;padding:24px 20px 36px;box-shadow:0 -10px 40px rgba(0,0,0,0.25);">
      <div style="width:40px;height:4px;background:#E2E8F0;border-radius:2px;margin:0 auto 18px;"></div>
      
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="font-size:17px;font-weight:600;color:#0F172A;margin:0;">Add to Your Story</h3>
        <button onclick="document.getElementById('create-story-modal').remove()" style="border:none;background:#F1F5F9;width:32px;height:32px;border-radius:50%;color:#64748B;font-size:14px;font-weight:600;cursor:pointer;">✕</button>
      </div>

      <p style="font-size:13px;color:#64748B;margin-bottom:16px;">Capture a photo or select an image from your device to share with your circle.</p>

      <!-- Hidden file inputs for Camera & Gallery -->
      <input type="file" id="story-camera-file-input" accept="image/*" capture="environment" style="display:none;" onchange="window.handleStoryFileUpload(event)">
      <input type="file" id="story-gallery-file-input" accept="image/*" style="display:none;" onchange="window.handleStoryFileUpload(event)">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        
        <!-- Open Camera Option -->
        <div onclick="window.triggerStoryCamera()" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:130px;background:linear-gradient(135deg, #FFF0F5 0%, #FAF5FF 100%);border:1.5px dashed #F472B6;border-radius:20px;cursor:pointer;transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.transform='scale(1.02)';this.style.borderColor='#EC5DAA'" onmouseout="this.style.transform='scale(1)';this.style.borderColor='#F472B6'">
          <div style="width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 4px 14px rgba(236,93,170,0.35);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <div style="text-align:center;">
            <div style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin-bottom:2px;">Open Camera</div>
            <div style="font-size:11px;color:#94A3B8;">Take snapshot</div>
          </div>
        </div>

        <!-- Open Gallery Option -->
        <div onclick="window.triggerStoryGallery()" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:130px;background:#F8FAFC;border:1.5px dashed #CBD5E1;border-radius:20px;cursor:pointer;transition:transform 0.15s ease, border-color 0.15s ease;" onmouseover="this.style.transform='scale(1.02)';this.style.borderColor='#7C3AED'" onmouseout="this.style.transform='scale(1)';this.style.borderColor='#CBD5E1'">
          <div style="width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg, #A855F7 0%, #7C3AED 100%);display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 4px 14px rgba(124,58,237,0.3);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <div style="text-align:center;">
            <div style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin-bottom:2px;">Open Gallery</div>
            <div style="font-size:11px;color:#94A3B8;">Choose photo</div>
          </div>
        </div>

      </div>

      <button onclick="window.triggerStoryCamera()" style="width:100%;height:48px;border-radius:24px;font-family:'Montserrat',sans-serif;font-weight:600;font-size:15px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(236,93,170,0.35);letter-spacing:0.3px;">
        Share
      </button>
    </div>
  `;

  (document.getElementById('app') || document.body).appendChild(modal);
};

window.triggerStoryCamera = function() {
  const input = document.getElementById('story-camera-file-input');
  if (input && window.navigator && window.navigator.mediaDevices) {
    input.click();
  } else {
    window.publishUserStory('story_priya_streak.jpg', '5-Day Streak! Energy is high 🔥💅');
  }
};

window.triggerStoryGallery = function() {
  const input = document.getElementById('story-gallery-file-input');
  if (input) {
    input.click();
  } else {
    window.publishUserStory('community_yoga_reset.jpg', 'bending so I don’t snap today 🌸🧘‍♀️');
  }
};

window.handleStoryFileUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.publishUserStory(e.target.result, 'Daily wellness snapshot 🌸✨');
    };
    reader.readAsDataURL(file);
  } else {
    window.publishUserStory('story_priya_streak.jpg', '5-Day Streak! Energy is high 🔥💅');
  }
};

window.publishUserStory = function(image, caption) {
  const modal = document.getElementById('create-story-modal');
  if (modal) modal.remove();

  const userStory = window.MIROR_WELLNESS_USER_STORIES.find(s => s.isUser);
  if (userStory) {
    userStory.hasStory = true;
    userStory.slides = [
      {
        image: image,
        time: 'Just now',
        caption: caption,
        stickerCss: 'top:18%;left:12%;transform:rotate(-2.5deg);background:#FFFFFF;color:#0F172A;font-size:15.5px;font-weight:600;padding:8px 16px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.35);',
        link: null
      }
    ];
  }
  confetti();
  SM.toast('✨ Story posted to your circle!');
  SM.render();
};

window.openWellnessStory = function(userIndex = 0, slideIndex = 0) {
  const user = window.MIROR_WELLNESS_USER_STORIES[userIndex];
  if (!user || !user.slides || user.slides.length === 0) {
    window.openCreateStoryModal();
    return;
  }

  window.currentStoryUserIndex = userIndex;
  window.currentStorySlideIndex = slideIndex;
  
  let modal = document.getElementById('wellness-story-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wellness-story-modal';
    modal.style.position = 'absolute';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = '#000000';
    modal.style.zIndex = '990';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.borderRadius = '32px';
    modal.style.overflow = 'hidden';
    modal.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  window.renderWellnessStorySlide();
};

window.closeWellnessStory = function() {
  if (window.wellnessStoryTimer) clearTimeout(window.wellnessStoryTimer);
  if (window.wellnessStoryProgressInterval) clearInterval(window.wellnessStoryProgressInterval);
  const modal = document.getElementById('wellness-story-modal');
  if (modal) {
    modal.remove();
  }
};

window.nextWellnessStory = function() {
  const user = window.MIROR_WELLNESS_USER_STORIES[window.currentStoryUserIndex];
  if (user && user.slides && window.currentStorySlideIndex < user.slides.length - 1) {
    window.currentStorySlideIndex++;
    window.renderWellnessStorySlide();
  } else {
    // Find next user with active slides
    let nextUserIdx = window.currentStoryUserIndex + 1;
    while (nextUserIdx < window.MIROR_WELLNESS_USER_STORIES.length && (!window.MIROR_WELLNESS_USER_STORIES[nextUserIdx].slides || window.MIROR_WELLNESS_USER_STORIES[nextUserIdx].slides.length === 0)) {
      nextUserIdx++;
    }
    if (nextUserIdx < window.MIROR_WELLNESS_USER_STORIES.length) {
      window.currentStoryUserIndex = nextUserIdx;
      window.currentStorySlideIndex = 0;
      window.renderWellnessStorySlide();
    } else {
      window.closeWellnessStory();
    }
  }
};

window.prevWellnessStory = function() {
  if (window.currentStorySlideIndex > 0) {
    window.currentStorySlideIndex--;
    window.renderWellnessStorySlide();
  } else {
    // Find prev user with active slides
    let prevUserIdx = window.currentStoryUserIndex - 1;
    while (prevUserIdx >= 0 && (!window.MIROR_WELLNESS_USER_STORIES[prevUserIdx].slides || window.MIROR_WELLNESS_USER_STORIES[prevUserIdx].slides.length === 0)) {
      prevUserIdx--;
    }
    if (prevUserIdx >= 0) {
      window.currentStoryUserIndex = prevUserIdx;
      const prevUser = window.MIROR_WELLNESS_USER_STORIES[prevUserIdx];
      window.currentStorySlideIndex = prevUser.slides.length - 1;
      window.renderWellnessStorySlide();
    }
  }
};

window.reactWellnessStory = function(emoji) {
  const container = document.getElementById('wellness-story-reactions-float');
  if (container) {
    const el = document.createElement('div');
    el.innerText = emoji;
    el.style.position = 'absolute';
    el.style.bottom = '80px';
    el.style.right = '24px';
    el.style.fontSize = '38px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '1000';
    el.style.animation = 'floatEmojiUp 1.2s ease-out forwards';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
  SM.toast(`Liked story! ❤️`);
};

window.handleStoryLinkClick = function(linkDataStr) {
  try {
    const link = typeof linkDataStr === 'string' ? JSON.parse(decodeURIComponent(linkDataStr)) : linkDataStr;
    if (!link) return;
    
    if (link.type === 'GROUP') {
      window.closeWellnessStory();
      SM.push('community-group', { groupId: link.groupId });
      SM.toast(`Opened ${link.label}! 👥`);
    } else if (link.type === 'CHALLENGE') {
      confetti();
      SM.toast(`🎉 You joined the ${link.label}!`);
    }
  } catch (e) {
    console.error(e);
  }
};

window.renderWellnessStorySlide = function() {
  const user = window.MIROR_WELLNESS_USER_STORIES[window.currentStoryUserIndex];
  if (!user || !user.slides || user.slides.length === 0) {
    window.closeWellnessStory();
    return;
  }
  const slide = user.slides[window.currentStorySlideIndex];
  const modal = document.getElementById('wellness-story-modal');
  if (!modal) return;

  if (window.wellnessStoryTimer) clearTimeout(window.wellnessStoryTimer);
  if (window.wellnessStoryProgressInterval) clearInterval(window.wellnessStoryProgressInterval);

  modal.innerHTML = `
    <style>
      @keyframes floatEmojiUp {
        0% { transform: translateY(0) scale(0.8); opacity: 1; }
        100% { transform: translateY(-160px) scale(1.4); opacity: 0; }
      }
      .wellness-story-input::placeholder {
        color: rgba(255, 255, 255, 0.88) !important;
        opacity: 1 !important;
        font-weight: 500;
      }
      .wellness-story-input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.88) !important;
        opacity: 1 !important;
        font-weight: 500;
      }
    </style>
    <div style="position:relative;width:100%;height:100%;background:#000000;overflow:hidden;display:flex;flex-direction:column;">
      
      <!-- Full-Screen Image Posted by User -->
      <img src="${slide.image}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
      
      <!-- Subtle Gradient Shadows for Header and Footer Readability -->
      <div style="position:absolute;top:0;left:0;width:100%;height:160px;background:linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%);pointer-events:none;z-index:5;"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:180px;background:linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%);pointer-events:none;z-index:5;"></div>

      <!-- User-Specific Story Progress Bars (Positioned Safely Below Status Bar & Notch) -->
      <div style="position:relative;z-index:20;display:flex;gap:4px;padding:calc(var(--status-bar-height, 36px) + 8px) 14px 8px;">
        ${user.slides.map((_, i) => `
          <div style="flex:1;height:2.5px;background:rgba(255,255,255,0.35);border-radius:2px;overflow:hidden;">
            <div id="story-prog-${i}" style="height:100%;width:${i < window.currentStorySlideIndex ? '100%' : (i === window.currentStorySlideIndex ? '0%' : '0%')};background:#FFFFFF;border-radius:2px;"></div>
          </div>
        `).join('')}
      </div>

      <!-- Top Story Header: User Avatar, Username, Time & Close Button -->
      <div style="position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:4px 14px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;border:1.5px solid #FFFFFF;overflow:hidden;flex-shrink:0;">
            <img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;display:block;">
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;font-weight:600;color:#FFFFFF;letter-spacing:-0.2px;">
              ${user.username}
            </span>
            <span style="font-size:12px;color:rgba(255,255,255,0.75);font-weight:500;">
              ${slide.time}
            </span>
          </div>
        </div>

        <button onclick="window.closeWellnessStory()" style="border:none;background:none;color:#FFFFFF;font-size:22px;cursor:pointer;padding:4px 8px;display:flex;align-items:center;justify-content:center;line-height:1;">
          ✕
        </button>
      </div>

      <!-- Invisible Tap Zones for Next / Prev Navigation -->
      <div style="position:absolute;top:95px;bottom:100px;left:0;width:35%;z-index:15;cursor:pointer;" onclick="window.prevWellnessStory()"></div>
      <div style="position:absolute;top:95px;bottom:100px;right:0;width:65%;z-index:15;cursor:pointer;" onclick="window.nextWellnessStory()"></div>

      <!-- Instagram Floating Text Sticker (Custom Placement, Color & Tilt per Story) -->
      <div style="position:absolute;z-index:14;pointer-events:none;display:inline-block;${slide.stickerCss || 'top:18%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#FFF;padding:8px 16px;border-radius:14px;'}">
        ${slide.caption}
      </div>

      <!-- Optional Group / Challenge Link Sticker (Placed at the bottom) -->
      ${slide.link ? `
        <div style="position:absolute;bottom:90px;left:0;width:100%;display:flex;justify-content:center;z-index:22;pointer-events:none;">
          <div onclick="window.handleStoryLinkClick('${encodeURIComponent(JSON.stringify(slide.link))}')" style="background:#FFFFFF;color:#0F172A;border-radius:24px;padding:8px 18px;font-size:13px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.35);display:inline-flex;align-items:center;gap:6px;cursor:pointer;pointer-events:auto;transition:transform 0.15s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <span>${slide.link.icon} ${slide.link.label}</span>
            <span style="font-size:10px;background:#F1F5F9;padding:2px 6px;border-radius:8px;color:#64748B;font-weight:600;">${slide.link.actionText || 'JOIN'}</span>
          </div>
        </div>
      ` : ''}

      <!-- Emoji Floating Spawner Container -->
      <div id="wellness-story-reactions-float" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:30;"></div>

      <!-- Bottom Interactive Action / Reply Bar -->
      <div style="position:relative;z-index:25;margin-top:auto;padding:10px 16px 20px;display:flex;align-items:center;gap:12px;">
        <input type="text" class="wellness-story-input" placeholder="Send message..." style="flex:1;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.55);border-radius:24px;height:42px;padding:0 16px;font-size:13.5px;color:#FFFFFF;outline:none;" onkeydown="if(event.key==='Enter'){SM.toast('Message sent to ${user.username}! 💬');this.value='';}">
        
        <button onclick="window.reactWellnessStory('❤️')" style="background:none;border:none;font-size:26px;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          ❤️
        </button>
      </div>

    </div>
  `;

  // Start progress animation
  const progBar = document.getElementById(`story-prog-${window.currentStorySlideIndex}`);
  let start = Date.now();
  const duration = 5000; // 5 seconds

  window.wellnessStoryProgressInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min((elapsed / duration) * 100, 100);
    if (progBar) progBar.style.width = `${pct}%`;
    if (elapsed >= duration) {
      clearInterval(window.wellnessStoryProgressInterval);
      window.nextWellnessStory();
    }
  }, 50);
};

/* --------------------------------------------------------------------------
   MIROR CARE+ INSTAGRAM-STYLE COMMUNITY FEED DATA & LOGIC
   -------------------------------------------------------------------------- */
window.currentCareFeedFilter = 'all';

window.MIROR_CARE_FEED = [
  // Peanut Post 1: Patricia in Hormonal Health
  {
    id: 'peanut-1',
    type: 'peanut',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Patricia',
      username: 'patricia',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      bg: '#FDF2F8'
    },
    timestamp: '5 days ago',
    title: 'New to Miror',
    caption: "I am looking for guidance, laughter, and genuine friendships. I'm a 55-year-old empty nester with 7 kids and 20 grandkids. Reclaiming my wellness, morning mobility, and peace here in this warm sisterhood! 🌸🧘‍♀️",
    photos: ['feed_sleep_routine.jpg', 'icon_bloom.jpg', 'icon_morning_reset.jpg'],
    likes: 4,
    isLiked: false,
    commentsCount: 11,
    hashtags: ['#MirorCommunity', '#Perimenopause101', '#PelvicFloorHealth'],
    comments: [
      { author: 'Kavita S.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80', text: 'Welcome Patricia! We see you and we are all in this together ❤️' },
      { author: 'Sunita P.', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&auto=format&fit=crop&q=80', text: 'You have so much wisdom to share. Glad to have you here!' }
    ],
    trending: true
  },

  // Peanut Post 2: Helen in Menopause
  {
    id: 'peanut-2',
    type: 'peanut',
    groupId: '50-menopause',
    groupName: '50+ Menopause',
    author: {
      name: 'Helen',
      username: 'helen_uk',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      bg: '#EFF6FF'
    },
    timestamp: '2 days ago',
    title: 'Menopause & Surgical Recovery',
    caption: "I'm 34 and navigating surgical menopause post-op while awaiting a full hysterectomy for severe endometriosis and adenomyosis. Would love to connect with sisters who walked a similar recovery path and found their hormonal balance.",
    photos: ['feed_dr_anjali.jpg', 'feed_sleep_routine.jpg'],
    likes: 8,
    isLiked: false,
    commentsCount: 8,
    hashtags: ['#HRTJourney', '#EstrogenDominance', '#MirorCommunity'],
    comments: [
      { author: 'Meera', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80', text: 'Sending you massive love Helen. The surgical menopause journey has a learning curve, but hormone therapy gave me my life back.' }
    ],
    trending: false
  },

  // Peanut Post 3: Jazlyn in Miror@Mingle (Multi-Photo Meetup Gallery)
  {
    id: 'peanut-3',
    type: 'peanut',
    groupId: 'mingle',
    groupName: 'Miror@Mingle',
    author: {
      name: 'Jazlyn',
      username: 'jazlyn_m',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      bg: '#FAF5FF'
    },
    timestamp: '3 days ago',
    title: 'I found my bliss!',
    caption: "I had such an uplifting time at our Miror meetup event last night! Meeting women who truly understand the ups and downs of hormonal transitions, laughing, sharing tea, and leaving with lifelong sister friends was everything I needed.",
    photos: ['feed_sleep_routine.jpg', 'feed_dr_anjali.jpg', 'icon_bloom.jpg', 'icon_morning_reset.jpg'],
    likes: 48,
    isLiked: false,
    commentsCount: 15,
    hashtags: ['#MirorCommunity', '#Perimenopause101'],
    comments: [
      { author: 'Tara N.', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80', text: 'It was so wonderful meeting you in person Jazlyn! The energy was unmatched ✨' },
      { author: 'Shreya', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80', text: 'Loved seeing all the smiles! Cannot wait for the next city meetup.' }
    ],
    trending: true
  },

  // Card 1: Doctor Educational Carousel Post
  {
    id: 'care-1',
    type: 'instagram',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Dr. Anjali Sharma',
      username: 'dr.anjali_sharma',
      role: 'Doctor',
      roleClass: 'care-role-doctor',
      roleIcon: '🩺',
      avatar: 'feed_dr_anjali.jpg',
      verified: true
    },
    timestamp: '2h ago',
    title: '5 Things Every Woman Should Know',
    cover: {
      title: '5 things every woman should know about perimenopause',
      sub: 'Understanding your body is the first step to feeling like yourself again.',
      image: 'feed_dr_anjali.jpg',
      currentSlide: 1,
      totalSlides: 5
    },
    caption: 'Perimenopause is about much more than periods. It impacts your restorative sleep, neurochemistry, body composition, and skin barrier. Swipe through to learn the 5 foundational shifts every woman should know.',
    hashtags: ['#Perimenopause101', '#HRTJourney', '#EstrogenDominance'],
    photos: ['feed_dr_anjali.jpg', 'feed_sleep_routine.jpg', 'icon_bloom.jpg'],
    likes: 128,
    isLiked: false,
    commentsCount: 18,
    comments: [
      { author: 'Sunita P.', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&auto=format&fit=crop&q=80', text: 'This was so eye-opening, especially point 3 on progesterone!' },
      { author: 'Ritu M.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80', text: 'Thank you doctor! Sharing this with my sister right now.' }
    ],
    isBookmarked: false,
    canShare: true,
    trending: true
  },

  // Card 2: Ask Doctor Card (Sleep Disturbance)
  {
    id: 'care-2',
    type: 'ask-doctor',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Meena',
      username: 'meena_k',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
      bg: '#FDF2F8'
    },
    timestamp: '1h ago',
    status: 'answered',
    title: 'Waking up at 3–4 AM every night',
    caption: 'Waking up at 3–4 AM every night with a racing heart and sudden warmth. Dr. Anjali explained how progesterone drops affect GABA receptors and recommended timed Magnesium Glycinate.',
    question: {
      title: 'Waking up at 3–4 am every night. Is this perimenopause?',
      body: 'I am 44 and for the past 2 months I wake up every night around 3 or 4 am and can’t go back to sleep. I feel tired all day.'
    },
    attachment: null,
    photos: ['feed_sleep_routine.jpg'],
    doctorAnswer: {
      doctor: 'Dr. Anjali Sharma',
      badge: 'Verified doctor',
      avatar: 'feed_dr_anjali.jpg',
      answer: 'Yes, this is a hallmark symptom of perimenopause. Sudden progesterone drops in your 40s reduce GABA relaxation neurotransmitters in the brain, triggering sudden 3 AM waking. Combining timed Magnesium Glycinate (300mg) with cooling sleep hygiene resets your circadian rhythm.'
    },
    followUps: [
      { author: 'Meena', text: 'Thank you Dr. Anjali! Should I take the magnesium with warm water before bed?' },
      { author: 'Dr. Anjali Sharma', isDoctor: true, text: 'Yes, 30-45 minutes before sleep with warm water or herbal chamomile tea.' }
    ],
    likes: 24,
    isLiked: false,
    commentsCount: 6,
    hashtags: ['#SleepRoutine', '#MagnesiumGlycinate', '#NightSweatsRelief'],
    comments: [
      { author: 'Kavita S.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80', text: 'Same here! Cutting off caffeine after 3 PM made a huge difference for me.' }
    ],
    isBookmarked: false,
    canShare: false,
    trending: true
  },

  // Card 2B: Ask Doctor Card (Brain Fog & Estrogen)
  {
    id: 'care-doc-2',
    type: 'ask-doctor',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Shreya M.',
      username: 'shreya_m',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
      bg: '#FAF5FF'
    },
    timestamp: '4h ago',
    status: 'answered',
    title: 'Severe afternoon brain fog and word-recall lag',
    caption: 'Experiencing sudden afternoon brain fog and difficulty finding words during team meetings. Dr. Anjali broke down estrogen receptors in the hippocampus and outlined a targeted mitochondrial protocol.',
    question: {
      title: 'Severe brain fog and word-finding difficulty at work at age 46. Is this normal?',
      body: 'I lead product reviews at work and recently I keep forgetting basic words or losing my train of thought around 3 PM. It is terrifying. Could this be perimenopause?'
    },
    attachment: null,
    photos: ['feed_dr_anjali.jpg'],
    doctorAnswer: {
      doctor: 'Dr. Anjali Sharma',
      badge: 'Verified OB-GYN',
      avatar: 'feed_dr_anjali.jpg',
      answer: 'This is extremely common and not early dementia. Estrogen acts as a master regulator of glucose metabolism in the frontal cortex and hippocampus. When estrogen levels fluctuate erratically, brain energy drops by up to 25%. A protocol combining Creatine Monohydrate (5g), Phosphatidylserine (300mg), and stabilizing midday blood glucose restores cognitive clarity rapidly.'
    },
    followUps: [
      { author: 'Shreya M.', text: 'Is creatine safe to take without doing heavy bodybuilding workouts?' },
      { author: 'Dr. Anjali Sharma', isDoctor: true, text: 'Absolutely. For women over 40, creatine is primarily a cellular energy booster for the brain and neural mitochondria.' }
    ],
    likes: 42,
    isLiked: false,
    commentsCount: 8,
    hashtags: ['#BrainFogHacks', '#EstrogenDominance', '#Perimenopause101'],
    comments: [
      { author: 'Neelam T.', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=160&auto=format&fit=crop&q=80', text: 'I cried reading this, thought I was losing my mind.' }
    ],
    isBookmarked: false,
    canShare: false,
    trending: true
  },

  // Peanut Post 4: Pooja in Postpartum
  {
    id: 'peanut-4',
    type: 'peanut',
    groupId: 'postpartum-moms',
    groupName: 'Postpartum & New Moms',
    author: {
      name: 'Pooja V.',
      username: 'pooja_v',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      bg: '#FAF5FF'
    },
    timestamp: '1 day ago',
    title: '4 months postpartum: Hair shedding and low energy',
    caption: '4 months postpartum and the hair shedding peaked around week 14. Doctor evaluated my ferritin and thyroid, and we customized my meals with moringa and iron. Baby hair regrowth has officially begun! Hang in there new moms.',
    photos: ['icon_bloom.jpg', 'icon_detox_21.jpg'],
    likes: 31,
    isLiked: false,
    commentsCount: 9,
    hashtags: ['#ThyroidVsPerimenopause', '#MirorCommunity'],
    comments: [
      { author: 'Radhika', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&auto=format&fit=crop&q=80', text: 'Needed this encouragement today. Week 12 here and seeing clumps in shower.' }
    ],
    trending: true
  },

  // Card 3: Doctor Clinical Insight (HRT vs Lifestyle)
  {
    id: 'care-text-1',
    type: 'text',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Dr. Anjali Sharma',
      username: 'dr.anjali_sharma',
      role: 'Doctor',
      roleClass: 'care-role-doctor',
      roleIcon: '🩺',
      avatar: 'feed_dr_anjali.jpg',
      verified: true
    },
    timestamp: '2h ago',
    title: 'HRT vs Lifestyle: What really moves the needle in your 40s?',
    caption: "A question I answer every day in clinic: 'Can nutrition and strength training replace HRT, or do we need both?' The clinical truth is that lifestyle builds your metabolic foundation, while targeted hormone therapy addresses severe vasomotor symptoms. They work together in harmony.",
    body: `A question I get every day in clinic: "Doctor, can diet and exercise replace HRT, or do I need both?"

Here is the straightforward clinical truth:
1. Lifestyle (strength training + protein 1.2g/kg + circadian sleep hygiene) builds your metabolic foundation and protects bone density.
2. For severe vasomotor symptoms (night sweats, intense brain fog, vaginal dryness), targeted medical hormone therapy provides relief that diet alone rarely achieves.

They work in tandem. Always consult your gynecologist to review your individual profile.`,
    photos: ['feed_dr_anjali.jpg', 'icon_morning_reset.jpg'],
    hashtags: ['#HRTJourney', '#StrengthTrainingAfter40', '#Perimenopause101'],
    likes: 95,
    isLiked: false,
    commentsCount: 12,
    comments: [
      { author: 'Meera Rao', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80', text: 'This clarity is so helpful! So many myths online.' },
      { author: 'Pooja J.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80', text: 'Starting strength training at 45 has been life changing for my joints.' }
    ],
    isBookmarked: false,
    canShare: true,
    trending: true
  },

  // Card 4: Member Sleep Routine
  {
    id: 'care-3',
    type: 'instagram',
    groupId: 'calm-collective',
    groupName: 'Calm Collective',
    author: {
      name: 'Ritu',
      username: 'ritu_wellness',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
      bg: '#EDE9FE'
    },
    timestamp: '3h ago',
    title: 'My sleep routine that actually helped me',
    cover: {
      title: 'My sleep routine that actually helped me',
      sub: 'Sharing what worked for me after struggling with sleepless nights for months.',
      image: 'feed_sleep_routine.jpg',
      currentSlide: 1,
      totalSlides: 4
    },
    caption: 'Sharing what worked for me after struggling with restless nights for months: 15 minutes of gentle floor stretches, chamomile tea, magnesium, and dimming all room lights at 9 PM. My sleep tracker score went from 58 to 86! 🧘‍♀️✨',
    hashtags: ['#SleepRoutine', '#MagnesiumGlycinate', '#PelvicFloorHealth'],
    photos: ['feed_sleep_routine.jpg', 'icon_morning_reset.jpg', 'icon_bloom.jpg'],
    likes: 36,
    isLiked: false,
    commentsCount: 7,
    comments: [
      { author: 'Priya M.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80', text: 'Which stretching sequence do you do before bed?' }
    ],
    isBookmarked: false,
    canShare: false,
    trending: false
  },

  // Peanut Post 5: Maya in Nutrition Circle
  {
    id: 'peanut-5',
    type: 'peanut',
    groupId: 'nourish',
    groupName: 'Nutrition Circle',
    author: {
      name: 'Maya K.',
      username: 'maya_nourish',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      bg: '#ECFDF5'
    },
    timestamp: '6h ago',
    title: 'Hormone balancing seed cycling smoothie recipe 🥑',
    caption: 'My go-to hormone balancing seed cycling smoothie recipe! Pumpkin and flax seeds in the first 14 days, sunflower and sesame in the second half. Blended with avocado and cinnamon to stabilize midday cortisol and keep energy steady.',
    photos: ['icon_detox_21.jpg', 'icon_morning_reset.jpg'],
    likes: 56,
    isLiked: false,
    commentsCount: 14,
    hashtags: ['#GutHormoneAxis', '#EstrogenDominance'],
    comments: [
      { author: 'Anjali D.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80', text: 'Trying this recipe tomorrow morning! Thanks for sharing Maya.' }
    ],
    trending: true
  },

  // Card 5: Member Cold Water Therapy
  {
    id: 'care-text-2',
    type: 'text',
    groupId: '50-menopause',
    groupName: '50+ Menopause',
    author: {
      name: 'Kavita Roy',
      username: 'kavita_roy',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
      bg: '#FEF3C7'
    },
    timestamp: '4h ago',
    title: 'Cold water therapy for morning hot flushes',
    caption: 'I started taking a 30-second cold rinse at the end of my morning shower, and strangely my sudden 10 AM heat surges have dialed down significantly over the last two weeks. Has anyone else experienced this vagus nerve effect? ❄️🚿',
    photos: ['icon_detox_21.jpg'],
    hashtags: ['#NightSweatsRelief', '#Perimenopause101'],
    likes: 42,
    isLiked: false,
    commentsCount: 8,
    comments: [
      { author: 'Tara N.', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80', text: 'Yes! Cold splash on wrists and back of neck aborts my flush within 30 seconds.' },
      { author: 'Shalini K.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80', text: 'Cold showers took some getting used to but energy levels are unmatched.' }
    ],
    isBookmarked: false,
    canShare: false,
    trending: true
  },

  // Card 6: Ask Doctor Card 2 (Palpitations & ECG)
  {
    id: 'care-5',
    type: 'ask-doctor',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Priya Verma',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
      bg: '#F1F5F9'
    },
    timestamp: '5h ago',
    status: 'answered',
    question: {
      title: 'Sudden heart flutter / palpitations after morning coffee in late 40s?',
      body: 'I noticed mild palpitations for 10-15 seconds after having my morning espresso. Resting heart rate seems normal otherwise. Attaching my recent ECG summary.'
    },
    attachment: {
      name: 'Sleep_ECG_Summary.pdf',
      size: '1.2 MB'
    },
    doctorAnswer: {
      doctor: 'Dr. Priya Patel',
      badge: 'Verified Cardiologist & OB-GYN',
      avatar: 'feed_dr_anjali.jpg',
      answer: 'Fluctuating estrogen levels increase autonomic nervous sensitivity, making your heart more reactive to caffeine and epinephrine surges. We recommend switching to decaf or green tea, monitoring resting HRV, and checking serum electrolytes.'
    },
    followUps: [],
    hashtags: ['#ThyroidVsPerimenopause', '#Perimenopause101'],
    likes: 18,
    isLiked: false,
    commentsCount: 4,
    comments: [
      { author: 'Dr. Priya Patel', avatar: 'feed_dr_anjali.jpg', text: 'Please ensure you also get your serum TSH and thyroid panel checked.' }
    ],
    isBookmarked: false,
    canShare: false,
    trending: false
  },

  // Card 8: Interactive Doctor Poll Post
  {
    id: 'care-6',
    type: 'instagram',
    groupId: '30s-hormones',
    groupName: 'Hormonal Health',
    author: {
      name: 'Dr. Anjali Sharma',
      role: 'Doctor',
      roleClass: 'care-role-doctor',
      roleIcon: '🩺',
      avatar: 'feed_dr_anjali.jpg',
      verified: true
    },
    timestamp: '7h ago',
    poll: {
      question: 'What is your most frustrating perimenopause symptom right now?',
      options: [
        { text: 'Sleep disturbance & 3 AM waking', votes: 142 },
        { text: 'Hot flashes & sudden night sweats', votes: 98 },
        { text: 'Brain fog & memory slips', votes: 76 },
        { text: 'Unexplained mood shifts & anxiety', votes: 64 }
      ],
      userVoted: null,
      totalVotes: 380
    },
    caption: 'We are designing our upcoming clinical masterclass series. Vote below to tell us what matters to you most! 👇',
    hashtags: ['#Perimenopause101', '#NightSweatsRelief', '#BrainFogHacks'],
    likes: 84,
    isLiked: false,
    commentsCount: 16,
    comments: [
      { author: 'Rekha K.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80', text: 'Brain fog has been the hardest for work presentations.' }
    ],
    isBookmarked: false,
    canShare: true,
    trending: true
  },

  // Card 9: Admin Announcement Card
  {
    id: 'care-4',
    type: 'announcement',
    groupId: 'mingle',
    groupName: 'Miror@Mingle',
    author: {
      name: 'Miror Admin',
      role: 'Admin',
      roleClass: 'care-role-admin',
      avatar: 'tiara_logo.png',
      isLogo: true
    },
    timestamp: '8h ago',
    announcement: {
      title: 'Live session with Dr. Anjali Sharma',
      date: 'Sat, 7 PM IST',
      topic: 'Managing weight in perimenopause & hormonal metabolism',
      banner: 'feed_event_banner.jpg',
      isRsvp: false,
      rsvpCount: 142
    },
    hashtags: ['#Perimenopause101', '#MirorCommunity'],
    likes: 52,
    isLiked: false,
    commentsCount: 10,
    comments: [
      { author: 'Ananya D.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80', text: 'Will a recording be available if we miss it live?' }
    ],
    isBookmarked: false,
    canShare: true,
    trending: true
  }
];

/* --- Filter Feed --- */
window.filterCareFeed = function(filterKey, btn) {
  window.currentCareFeedFilter = filterKey;
  
  const chips = document.querySelectorAll('.care-filter-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const container = document.getElementById('care-feed-container');
  if (container) {
    container.innerHTML = window.renderCareFeedStream();
  }

  // Update FAB title & label based on active tab
  const fab = document.getElementById('care-fab-btn');
  if (fab && typeof fab.setAttribute === 'function') {
    if (filterKey === 'ask-doctor') {
      fab.setAttribute('title', 'Post a question in Ask Doctor');
      fab.setAttribute('aria-label', 'Post a question in Ask Doctor');
    } else if (filterKey === 'posts') {
      fab.setAttribute('title', 'Add a post in Community');
      fab.setAttribute('aria-label', 'Add a post in Community');
    } else {
      fab.setAttribute('title', 'Add a post or ask a doctor');
      fab.setAttribute('aria-label', 'Add a post or ask a doctor');
    }
  }
};

/* --- Dynamic FAB Handler on Right Bottom Corner --- */
window.updateCommunityFabState = function(tabName) {
  const tab = tabName || window.currentCommunityTab || 'for-you';
  const fab = document.getElementById('care-fab-btn');
  if (!fab) return;

  const curScreen = (typeof AppState !== 'undefined' && AppState.screenStack && AppState.screenStack.length) ? AppState.screenStack[AppState.screenStack.length - 1].id : (typeof AppState !== 'undefined' ? AppState.currentTab : 'community');

  if (curScreen === 'community') {
    if (tab === 'for-you') {
      fab.classList.remove('care-fab--compact');
      fab.style.display = 'flex';
      fab.style.bottom = '84px';
      fab.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Create post</span>
      `;
      if (typeof fab.setAttribute === 'function') {
        fab.setAttribute('title', 'Create post');
        fab.setAttribute('aria-label', 'Create post');
      }
    } else {
      fab.classList.remove('care-fab--compact');
      fab.style.display = 'none';
    }
  } else {
    fab.style.display = 'none';
  }
};

window.handleCommunityFabClick = function() {
  window.openCareComposerChoice();
};

/* --- Render Feed Stream --- */
window.renderCareFeedStream = function() {
  const filter = window.currentCareFeedFilter || 'all';
  let list = window.MIROR_CARE_FEED;

  if (filter === 'all') {
    list = list.filter(item => item.type !== 'ask-doctor');
  } else if (filter === 'posts') {
    list = list.filter(item => item.type === 'instagram' || item.type === 'text');
  } else if (filter === 'ask-doctor') {
    list = list.filter(item => item.type === 'ask-doctor');
  } else if (filter === 'announcements') {
    list = list.filter(item => item.type === 'announcement');
  }

  if (list.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;background:#FFF;border-radius:24px;border:1px solid #F1F5F9;margin:0 16px;">
        <div style="font-size:36px;margin-bottom:10px;">📋</div>
        <h4 style="font-size:16px;font-weight:600;color:#0F172A;margin:0 0 6px;">No posts in this category</h4>
        <p style="font-size:13px;color:#64748B;margin:0;">Switch to "All" to explore the full community stream.</p>
      </div>
    `;
  }

  return list.map(window.renderCareFeedCard).join('');
};

/* --- For You Caption Truncation Helper & Toggle --- */
window.renderForYouCaption = function(postId, fullText) {
  if (!fullText) return '';
  
  const text = fullText.trim();
  const CHAR_LIMIT = 125;
  
  if (text.length <= CHAR_LIMIT) {
    return `
      <div style="font-size:13.5px;line-height:1.55;color:#334155;font-weight:400;margin-bottom:6px;white-space:pre-line;">
        ${text}
      </div>
    `;
  }

  let truncated = text.substring(0, CHAR_LIMIT);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 70) {
    truncated = truncated.substring(0, lastSpace);
  }
  truncated = truncated.trim();

  const elementId = `foryou-cap-${postId}`;
  
  return `
    <div style="font-size:13.5px;line-height:1.55;color:#334155;font-weight:400;margin-bottom:6px;">
      <span id="${elementId}-short">
        ${truncated}... 
        <button onclick="event.stopPropagation();window.toggleForYouCaption('${postId}', true)" style="border:none;background:none;padding:0;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#EC5DAA;cursor:pointer;display:inline;margin-left:2px;">Read more</button>
      </span>
      <span id="${elementId}-full" style="display:none;">
        <span style="white-space:pre-line;">${text}</span> 
        <button onclick="event.stopPropagation();window.toggleForYouCaption('${postId}', false)" style="border:none;background:none;padding:0;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#EC5DAA;cursor:pointer;display:inline;margin-left:4px;">Read less</button>
      </span>
    </div>
  `;
};

window.toggleForYouCaption = function(postId, showFull) {
  const shortEl = document.getElementById(`foryou-cap-${postId}-short`);
  const fullEl = document.getElementById(`foryou-cap-${postId}-full`);
  if (shortEl && fullEl) {
    if (showFull) {
      shortEl.style.display = 'none';
      fullEl.style.display = 'inline';
    } else {
      shortEl.style.display = 'inline';
      fullEl.style.display = 'none';
    }
  }
};

/* --- Master Card Router --- */
window.renderCareFeedCard = function(item, options = {}) {
  if (item.type === 'ask-doctor') {
    return window.renderAskDoctorCard(item, options);
  } else if (item.type === 'announcement') {
    return window.renderAnnouncementCard(item, options);
  } else if (item.type === 'text') {
    return window.renderTextPostCard(item, options);
  } else if (item.type === 'instagram') {
    return window.renderInstagramCard(item, options);
  } else {
    return window.renderPeanutPostCard(item, options);
  }
};

/* --- Card Type 1: Instagram/Doctor Educational Carousel Card --- */
window.renderInstagramCard = function(item, options = {}) {
  const isForYou = options && options.isForYou;
  const authorUsername = item.author?.username || (item.id === 'care-1' ? 'dr.anjali_sharma' : item.id === 'care-3' ? 'ritu_wellness' : item.author?.name ? item.author.name.toLowerCase().replace(/\s+/g, '_') : 'miror_user');
  const captionText = item.caption || item.body || '';

  const showTopCaption = isForYou || (captionText && item.id !== 'care-1' && item.id !== 'care-3');

  return `
    <div class="care-feed-card" id="care-card-${item.id}">
      
      <!-- Card Header: Avatar + Username + Role + Subtitle/Audio + Options -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;background:${item.author.bg || '#F1F5F9'};display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid rgba(0,0,0,0.06);">
            ${item.author.avatar.includes('.') ? `<img src="${item.author.avatar}" alt="${item.author.name}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<span style="font-weight:600;color:#475569;">${item.author.avatar}</span>`}
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;letter-spacing:-0.1px;">
                ${authorUsername}
              </span>
              <span class="care-role-pill ${item.author.roleClass || (item.author.role === 'Doctor' ? 'care-role-doctor' : 'care-role-member')}" style="display:inline-flex;align-items:center;gap:3px;">
                ${item.author.role === 'Doctor' ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;"><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"></path><path d="M9 12.5V16.5a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-2"></path><circle cx="16.5" cy="14.5" r="2.2" fill="#7E22CE"></circle></svg>Doctor` : item.author.role}
              </span>
            </div>
            <span style="font-size:11.5px;color:#64748B;font-weight:400;margin-top:1px;">
              ${item.id === 'care-1' ? '♫ Original audio · Perimenopause 101' : item.id === 'care-3' ? '♫ Gentle Evening Stretch · Rest' : item.timestamp}
            </span>
          </div>
        </div>

        <button onclick="SM.toast('Post options •••')" style="border:none;background:none;font-size:18px;color:#0F172A;cursor:pointer;padding:4px;line-height:1;">•••</button>
      </div>

      <!-- Caption Text (ABOVE the media) -->
      ${showTopCaption && captionText ? `
        <div style="padding:0 16px 10px;">
          ${isForYou ? window.renderForYouCaption(item.id, captionText) : `
            <div style="font-size:13.5px;line-height:1.55;color:#334155;font-weight:400;margin-bottom:6px;">
              ${captionText}
            </div>
          `}
          ${item.hashtags && item.hashtags.length > 0 ? `
            <div style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#B14AC8;display:flex;flex-wrap:wrap;gap:8px;">
              ${item.hashtags.map(h => `<span style="cursor:pointer;color:#B14AC8;transition:color 0.15s ease;" onmouseover="this.style.color='#EC5DAA'" onmouseout="this.style.color='#B14AC8'" onclick="window.clickCommunityHashtag('${h}')">${h}</span>`).join(' ')}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Media Block (Edge-to-Edge Full-Bleed Canvas) -->
      ${item.poll ? `
        <div style="padding:6px 16px 12px;">
          <div style="background:#FFF9FC;border-radius:16px;padding:14px;border:1.5px solid rgba(244,114,182,0.2);">
            <h4 style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;color:#0F172A;margin:0 0 10px;line-height:1.35;">
              ${item.poll.question}
            </h4>
            <div>
              ${item.poll.options.map((opt, optIdx) => {
                const total = item.poll.totalVotes || 1;
                const pct = Math.round((opt.votes / total) * 100);
                const isSelected = item.poll.userVoted === optIdx;
                return `
                  <div class="care-poll-option" onclick="window.voteCarePoll('${item.id}', ${optIdx})" style="${isSelected ? 'border-color:#EC5DAA;background:#FFF;' : ''}">
                    <div class="care-poll-fill" style="width:${item.poll.userVoted !== null ? pct : 0}%;"></div>
                    <div class="care-poll-content">
                      <span style="font-size:13px;">${opt.text}</span>
                      ${item.poll.userVoted !== null ? `<span style="font-weight:600;color:#EC5DAA;font-size:12.5px;">${pct}%</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="font-size:11px;color:#94A3B8;font-weight:600;margin-top:4px;text-align:right;">
              ${item.poll.totalVotes} total votes
            </div>
          </div>
        </div>
      ` : item.id === 'care-1' ? `
        <!-- Doctor Educational Post Carousel Slide (1/5) -->
        <div style="position:relative;width:100%;height:330px;background:#EBF1F6;overflow:hidden;display:flex;align-items:stretch;">
          
          <!-- Slide Indicator Badge (1/5) -->
          <div style="position:absolute;top:12px;right:12px;z-index:10;background:rgba(15,23,42,0.72);color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;padding:3px 9px;border-radius:12px;backdrop-filter:blur(6px);letter-spacing:0.4px;">
            1/5
          </div>

          <!-- Left Headline Column -->
          <div style="flex:1.25;padding:26px 18px 22px;display:flex;flex-direction:column;justify-content:center;z-index:2;">
            <h3 style="font-family:'Montserrat',sans-serif;font-size:19px;font-weight:600;color:#0F172A;line-height:1.25;margin:0 0 10px;letter-spacing:-0.3px;">
              5 things every woman should know about perimenopause
            </h3>
            <p style="font-size:12.5px;color:#475569;line-height:1.45;margin:0 0 16px;font-weight:400;">
              Understanding your body is the first step to feeling like yourself again.
            </p>
            <div style="display:flex;align-items:center;gap:5px;">
              <span style="width:6px;height:6px;border-radius:50%;background:#0095F6;"></span>
              <span style="width:5px;height:5px;border-radius:50%;background:#94A3B8;"></span>
              <span style="width:5px;height:5px;border-radius:50%;background:#94A3B8;"></span>
              <span style="width:5px;height:5px;border-radius:50%;background:#94A3B8;"></span>
              <span style="width:5px;height:5px;border-radius:50%;background:#94A3B8;"></span>
            </div>
          </div>

          <!-- Right Doctor Portrait Column -->
          <div style="flex:0.85;position:relative;overflow:hidden;">
            <img src="feed_dr_anjali.jpg" alt="Dr. Anjali Sharma" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">
            <div style="position:absolute;top:0;left:0;bottom:0;width:35px;background:linear-gradient(90deg, #EBF1F6 0%, rgba(235,241,246,0) 100%);"></div>
          </div>

          <!-- Tag and Audio Overlay Icons -->
          <div style="position:absolute;bottom:12px;left:12px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(15,23,42,0.75);color:white;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;" onclick="SM.toast('Tagged: @dr.anjali_sharma')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div style="position:absolute;bottom:12px;right:12px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(15,23,42,0.75);color:white;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;" onclick="SM.toast('Audio: Perimenopause 101')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>

        </div>
      ` : item.id === 'care-3' ? `
        <!-- Member Routine Carousel Post (1/4) -->
        <div style="position:relative;width:100%;height:330px;overflow:hidden;background:#0F172A;">
          
          <div style="position:absolute;top:12px;right:12px;z-index:10;background:rgba(15,23,42,0.72);color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;padding:3px 9px;border-radius:12px;backdrop-filter:blur(6px);letter-spacing:0.4px;">
            1/4
          </div>

          <img src="feed_sleep_routine.jpg" alt="Sleep Routine" style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.92;">
          <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%);"></div>

          <div style="position:absolute;bottom:0;left:0;width:100%;padding:20px 16px;box-sizing:border-box;z-index:5;">
            <h3 style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:600;color:#FFFFFF;margin:0 0 4px;line-height:1.25;">
              My sleep routine that actually helped me
            </h3>
            <p style="font-size:12.5px;color:rgba(255,255,255,0.92);line-height:1.35;margin:0 0 8px;font-weight:400;">
              Sharing what worked for me after struggling with sleepless nights for months.
            </p>
            <div style="font-size:11.5px;color:#FDE68A;font-weight:600;">Swipe →</div>
          </div>

          <div style="position:absolute;bottom:12px;left:12px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(15,23,42,0.75);color:white;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;" onclick="SM.toast('Tagged: @ritu_wellness')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div style="position:absolute;bottom:12px;right:12px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(15,23,42,0.75);color:white;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;" onclick="SM.toast('Audio: Gentle Evening Stretch')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>

        </div>
      ` : item.photos && item.photos.length > 0 ? `
        <!-- Image / Carousel Container -->
        <div style="padding:0 16px 4px;">
          ${window.renderImageCarousel(item.id, item.photos)}
        </div>
      ` : ''}

      <!-- Exact Social Post Footer (Like, Comment, Share, Bookmark, Collapsible Comments) -->
      ${window.renderSocialPostFooter(item)}

    </div>
  `;
};

/* --- Card Type 4: Text-Based Feed Post (Doctor / Member Clinical Discussion) --- */
window.renderTextPostCard = function(item, options = {}) {
  const isForYou = options && options.isForYou;
  const authorUsername = item.author?.username || (item.author?.name ? item.author.name.toLowerCase().replace(/\s+/g, '_') : 'dr.anjali_sharma');
  const defaultHashtags = item.hashtags && item.hashtags.length > 0 ? item.hashtags : ['#HormoneHealth', '#EvidenceBased'];
  const bodyText = item.body || item.caption || '';

  return `
    <div class="care-feed-card" id="care-card-${item.id}">
      
      <!-- Card Header: Avatar + Username + Role + Subtitle + Options -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;background:${item.author.bg || '#F1F5F9'};display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid rgba(0,0,0,0.06);">
            ${item.author.avatar.includes('.') ? `<img src="${item.author.avatar}" alt="${item.author.name}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<span style="font-weight:600;color:#475569;">${item.author.avatar}</span>`}
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;letter-spacing:-0.1px;">
                ${authorUsername}
              </span>
              <span class="care-role-pill ${item.author.roleClass || (item.author.role === 'Doctor' ? 'care-role-doctor' : 'care-role-member')}" style="display:inline-flex;align-items:center;gap:3px;">
                ${item.author.role === 'Doctor' ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;"><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"></path><path d="M9 12.5V16.5a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-2"></path><circle cx="16.5" cy="14.5" r="2.2" fill="#7E22CE"></circle></svg>Doctor` : item.author.role}
              </span>
            </div>
            <span style="font-size:11.5px;color:#64748B;font-weight:400;margin-top:1px;">
              ${item.timestamp} · Discussion
            </span>
          </div>
        </div>

        <button onclick="SM.toast('Post options •••')" style="border:none;background:none;font-size:18px;color:#0F172A;cursor:pointer;padding:4px;line-height:1;">•••</button>
      </div>

      <!-- Text Body Card (Clean White Surface) -->
      <div style="padding:0 16px 8px;">
        ${!isForYou && item.title ? `<h4 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;line-height:1.35;margin:0 0 8px;letter-spacing:-0.2px;">${item.title}</h4>` : ''}
        ${isForYou ? window.renderForYouCaption(item.id, bodyText) : `
          <div style="font-size:13.5px;color:#334155;line-height:1.55;margin:0 0 8px;font-weight:400;white-space:pre-line;">${bodyText}</div>
        `}
        <div style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#B14AC8;display:flex;flex-wrap:wrap;gap:8px;">
          ${defaultHashtags.map(h => `<span style="cursor:pointer;color:#B14AC8;transition:color 0.15s ease;" onmouseover="this.style.color='#EC5DAA'" onmouseout="this.style.color='#B14AC8'" onclick="window.clickCommunityHashtag('${h}')">${h}</span>`).join(' ')}
        </div>
      </div>

      <!-- Exact Social Post Footer (Like, Comment, Share, Bookmark, Collapsible Comments) -->
      ${window.renderSocialPostFooter(item)}

    </div>
  `;
};

/* --- Card Type 5: Peanut Member Post with Image Carousel & Poll --- */
window.renderPeanutPostCard = function(item, options = {}) {
  const isForYou = options && options.isForYou;
  const authorUsername = item.author?.username || (item.author?.name ? item.author.name.toLowerCase().replace(/\s+/g, '_') : 'miror_member');
  const captionText = item.caption || item.body || '';
  const defaultHashtags = item.hashtags && item.hashtags.length > 0 
    ? item.hashtags 
    : ['#MirorCommunity', '#WomensHealth'];

  return `
    <div class="care-feed-card" id="care-card-${item.id}">
      
      <!-- Card Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;background:${item.author.bg || '#F1F5F9'};display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid rgba(0,0,0,0.06);">
            ${item.author.avatar.includes('.') ? `<img src="${item.author.avatar}" alt="${item.author.name}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<span style="font-weight:600;color:#475569;">${item.author.avatar}</span>`}
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;letter-spacing:-0.1px;">
                ${authorUsername}
              </span>
              <span class="care-role-pill ${item.author.roleClass || 'care-role-member'}" style="display:inline-flex;align-items:center;gap:3px;">
                ${item.author.role === 'Doctor' ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7E22CE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;"><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"></path><path d="M9 12.5V16.5a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-2"></path><circle cx="16.5" cy="14.5" r="2.2" fill="#7E22CE"></circle></svg>Doctor` : (item.author.role || 'Member')}
              </span>
            </div>
            <span style="font-size:11.5px;color:#64748B;font-weight:400;margin-top:1px;">
              ${item.timestamp}${item.groupName ? ` · in <span style="color:#EC5DAA;font-weight:600;cursor:pointer;transition:color 0.15s ease;" onmouseover="this.style.color='#D93B9F'" onmouseout="this.style.color='#EC5DAA'" onclick="SM.show('community-group', {id: '${item.groupId || '30s-hormones'}'})">${item.groupName}</span>` : ''}
            </span>
          </div>
        </div>

        <button onclick="SM.toast('Post options •••')" style="border:none;background:none;font-size:18px;color:#0F172A;cursor:pointer;padding:4px;line-height:1;">•••</button>
      </div>

      <!-- Caption & Text Body (ABOVE the image as requested) -->
      <div style="padding:0 16px 10px;">
        ${!isForYou && item.title ? `
          <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0 0 6px;line-height:1.35;">
            ${item.title}
          </h4>
        ` : ''}
        ${captionText ? (isForYou ? window.renderForYouCaption(item.id, captionText) : `
          <div style="font-size:13.5px;line-height:1.55;color:#334155;font-weight:400;margin-bottom:6px;">
            ${captionText}
          </div>
        `) : ''}
        ${defaultHashtags && defaultHashtags.length > 0 ? `
          <div style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#B14AC8;display:flex;flex-wrap:wrap;gap:8px;line-height:1.4;">
            ${defaultHashtags.map(h => `<span style="cursor:pointer;color:#B14AC8;transition:color 0.15s ease;" onmouseover="this.style.color='#EC5DAA'" onmouseout="this.style.color='#B14AC8'" onclick="window.clickCommunityHashtag('${h}')">${h}</span>`).join(' ')}
          </div>
        ` : ''}
      </div>

      <!-- Carousel Image Slider (BELOW caption) -->
      ${item.photos && item.photos.length > 0 ? `
        <div style="padding:0 16px 10px;">
          ${window.renderImageCarousel(item.id, item.photos)}
        </div>
      ` : ''}

      <!-- Interactive Poll (if any) -->
      ${item.poll ? `
        <div style="padding:0 16px 12px;">
          <div style="background:#FFF9FC;border-radius:16px;padding:12px 14px;border:1.5px solid rgba(244,114,182,0.2);">
            <h4 style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin:0 0 8px;">${item.poll.question}</h4>
            <div>
              ${item.poll.options.map((opt, optIdx) => {
                const total = item.poll.totalVotes || 1;
                const pct = Math.round((opt.votes / total) * 100);
                const isSelected = item.poll.userVoted === optIdx;
                return `
                  <div class="care-poll-option" onclick="window.voteCarePoll('${item.id}', ${optIdx})" style="${isSelected ? 'border-color:#EC5DAA;background:#FFF;' : ''};padding:10px 12px;margin-bottom:6px;">
                    <div class="care-poll-fill" style="width:${item.poll.userVoted !== null ? pct : 0}%;"></div>
                    <div class="care-poll-content">
                      <span style="font-size:12.5px;font-weight:500;">${opt.text}</span>
                      ${item.poll.userVoted !== null ? `<span style="font-weight:600;color:#EC5DAA;font-size:12px;">${pct}%</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="font-size:10.5px;color:#94A3B8;font-weight:500;text-align:right;margin-top:4px;">${item.poll.totalVotes} total votes</div>
          </div>
        </div>
      ` : ''}

      <!-- Exact Social Post Footer (Like, Comment, Share, Bookmark, Collapsible Comments) -->
      ${window.renderSocialPostFooter(item)}

    </div>
  `;
};

/* --- Doctor Answer Component: the reply shown in full, right there in the card.
   No truncation, no "read more" link — nested follow-up replies still stay out
   of the main card so the feed reads as a quick Q&A, not a medical article. */
window.renderDoctorAnswerPaywall = function(ans, item) {
  if (!ans) return '';

  return `
    <div style="background:#FAF5FF;border:1.5px solid #E9D5FF;border-radius:18px;padding:14px;margin-top:10px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid #DDD6FE;flex-shrink:0;">
          <img src="${ans.avatar}" alt="${ans.doctor}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div>
          <div style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#0F172A;">
            ${ans.doctor}
          </div>
          <div style="font-size:10.5px;font-weight:600;color:#7E22CE;display:flex;align-items:center;gap:3px;">
            <span>🩺</span>
            <span>${ans.badge || 'Verified Specialist'}</span>
          </div>
        </div>
      </div>
      <p style="font-size:13.5px;color:#334155;line-height:1.55;margin:0;font-weight:400;">
        ${ans.answer}
      </p>
    </div>
  `;
};

/* --- Card Type 2: Ask Doctor Q&A Card with 30% Visible / 70% Blurred Paywall --- */
window.renderAskDoctorCard = function(item) {
  const isSubscribed = window.isMirorCarePlusSubscribed && !window.showCarePlusSubscriptionPreview;
  const q = item.question || { title: item.title, body: item.body || item.caption };
  const ans = item.doctorAnswer;

  return `
    <div class="care-feed-card" id="care-card-${item.id}">
      
      <!-- Patient Question Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;background:${item.author.bg || '#FDF2F8'};display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid rgba(0,0,0,0.06);">
            ${item.author.avatar.includes('.') ? `<img src="${item.author.avatar}" alt="${item.author.name}" style="width:100%;height:100%;object-fit:cover;display:block;">` : item.author.avatar}
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;">
                ${item.author.name}
              </span>
              <span style="font-size:11.5px;color:#64748B;font-weight:500;">asked</span>
            </div>
            <span style="font-size:11.5px;color:#94A3B8;font-weight:400;margin-top:1px;">
              ${item.timestamp}
            </span>
          </div>
        </div>

        <span style="background:#ECFDF5;color:#059669;font-size:11px;font-weight:600;padding:3px 9px;border-radius:10px;border:1px solid #A7F3D0;display:inline-flex;align-items:center;gap:3px;">
          <span>✓</span> Answered
        </span>
      </div>

      <!-- Question (short, quoted — the long explanatory paragraph lives behind "Read full answer") -->
      <div style="padding:4px 16px 8px;">
        <p style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0;line-height:1.4;">
          “${q.title}”
        </p>
      </div>

      <!-- Attachment if any -->
      ${item.attachment ? `
        <div style="margin:0 16px 8px;background:#F1F5F9;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#475569;">
          <span>📎</span>
          <span style="font-weight:600;flex:1;">${item.attachment.name}</span>
          <span style="color:#94A3B8;">${item.attachment.size}</span>
        </div>
      ` : ''}

      <!-- Doctor Answer Paywall (30% Visible, 70% Blurred + Lock Icon & Pay to Unlock) -->
      <div style="padding:0 16px 10px;">
        ${window.renderDoctorAnswerPaywall(ans, item, isSubscribed)}
      </div>

      <!-- Social Post Footer -->
      ${window.renderSocialPostFooter(item)}

    </div>
  `;
};

/* --- Card Type 3: Admin Announcement Card --- */
window.renderAnnouncementCard = function(item) {
  const ann = item.announcement;

  return `
    <div class="care-feed-card" id="care-card-${item.id}">
      
      <!-- Card Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;background:#FEF3C7;border:1px solid #FDE68A;display:flex;align-items:center;justify-content:center;padding:3px;flex-shrink:0;">
            <img src="${item.author.avatar}" alt="Admin Logo" style="width:100%;height:100%;object-fit:contain;display:block;">
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:5px;">
              <span style="font-size:13.5px;font-weight:600;color:#0F172A;">
                miror_official
              </span>
              <span class="care-role-pill care-role-admin">Admin</span>
            </div>
            <span style="font-size:11.5px;color:#737373;margin-top:1px;">
              ${item.timestamp} · Masterclass Update
            </span>
          </div>
        </div>

        <button onclick="SM.toast('Announcement options •••')" style="border:none;background:none;font-size:18px;color:#0F172A;cursor:pointer;padding:4px;line-height:1;">•••</button>
      </div>

      <!-- Event Poster Banner (Edge-to-Edge inside card) -->
      <div style="position:relative;width:100%;height:280px;overflow:hidden;background:#0F172A;color:white;">
        <img src="${ann.banner}" alt="Event Banner" style="width:100%;height:100%;object-fit:cover;opacity:0.78;display:block;">
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.88) 100%);"></div>

        <div style="position:absolute;bottom:0;left:0;width:100%;padding:18px 16px;box-sizing:border-box;">
          <div style="display:inline-flex;align-items:center;gap:5px;font-family:'Montserrat',sans-serif;font-size:10.5px;font-weight:600;color:#FDE68A;letter-spacing:0.6px;text-transform:uppercase;margin-bottom:4px;">
            <span>📢</span> LIVE MASTERCLASS
          </div>
          <h3 style="font-family:'Montserrat',sans-serif;font-size:17.5px;font-weight:600;color:#FFFFFF;margin:0 0 4px;line-height:1.25;">
            ${ann.title}
          </h3>
          <div style="font-size:12px;color:#FDE68A;font-weight:600;margin-bottom:2px;">
            ${ann.date}
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.92);font-weight:400;margin-bottom:10px;line-height:1.35;">
            ${ann.topic}
          </div>

          <!-- RSVP Button -->
          <button onclick="window.toggleAnnouncementRsvp('${item.id}')" style="width:100%;height:38px;border-radius:19px;background:${ann.isRsvp ? '#10B981' : 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)'};color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
            <span>${ann.isRsvp ? '✓ Attending' : '🎟️ RSVP'}</span>
            <span style="font-size:11.5px;opacity:0.9;">(${ann.rsvpCount} going)</span>
          </button>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 4px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="display:flex;align-items:center;gap:5px;cursor:pointer;" onclick="window.toggleCareLike('${item.id}')">
            ${item.isLiked ? `
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ED4956" stroke="#ED4956" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            ` : `
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            `}
            <span style="font-size:13.5px;font-weight:600;color:#0F172A;">${item.likes}</span>
          </div>

          <div style="display:flex;align-items:center;gap:5px;cursor:pointer;" onclick="window.openCareComments('${item.id}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span style="font-size:13.5px;font-weight:600;color:#0F172A;">${item.comments.length}</span>
          </div>

          <div style="cursor:pointer;display:flex;align-items:center;" onclick="window.shareCarePost('${item.id}')" title="Share">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>
        </div>

        <div style="cursor:pointer;" onclick="window.toggleCareBookmark('${item.id}')" title="Bookmark">
          ${item.isBookmarked ? `
            <svg width="23" height="23" viewBox="0 0 24 24" fill="#0F172A" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          ` : `
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          `}
        </div>
      </div>

      <!-- Liked By -->
      <div style="padding:2px 14px 4px;font-size:12.5px;color:#0F172A;">
        Liked by <strong>ananya_d</strong> and <strong>51 others</strong>
      </div>

      <!-- Caption -->
      <div style="padding:0 14px 2px;font-size:13.5px;line-height:1.45;color:#0F172A;">
        <strong style="font-weight:600;color:#0F172A;margin-right:5px;">miror_official</strong>
        <span>Join us live this Saturday at 7 PM IST as Dr. Anjali discusses metabolism and weight management in perimenopause. RSVP to receive calendar invite & reminder! 🎟️✨</span>
      </div>

      <div style="padding:2px 14px 14px;font-size:11px;color:#737373;text-transform:uppercase;letter-spacing:0.2px;">
        ${item.timestamp}
      </div>

    </div>
  `;
};

/* --- Interactive Action Handlers --- */
window.toggleCareLike = function(postId) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post) return;

  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post, { isForYou: window.currentCommunityTab === 'for-you' });
    card.replaceWith(temp.firstElementChild);
  }
};

window.toggleCareBookmark = function(postId) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post) return;

  post.isBookmarked = !post.isBookmarked;
  SM.toast(post.isBookmarked ? 'Post saved to bookmarks 🔖' : 'Post removed from bookmarks');

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post, { isForYou: window.currentCommunityTab === 'for-you' });
    card.replaceWith(temp.firstElementChild);
  }
};

window.shareCarePost = function(postId) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  const title = post ? post.author.name : 'Miror Care+ Post';
  if (navigator.share) {
    navigator.share({ title: title, url: window.location.href }).catch(() => {});
  } else {
    SM.toast('Post link copied to clipboard! ↗️');
  }
};

window.voteCarePoll = function(postId, optionIdx) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post || !post.poll) return;

  if (post.poll.userVoted === null) {
    post.poll.options[optionIdx].votes += 1;
    post.poll.totalVotes += 1;
    post.poll.userVoted = optionIdx;
    SM.toast('Vote recorded! 📊');
  }

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post, { isForYou: window.currentCommunityTab === 'for-you' });
    card.replaceWith(temp.firstElementChild);
  }
};

window.toggleAnnouncementRsvp = function(postId) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post || !post.announcement) return;

  post.announcement.isRsvp = !post.announcement.isRsvp;
  post.announcement.rsvpCount += post.announcement.isRsvp ? 1 : -1;

  if (post.announcement.isRsvp) {
    SM.toast('RSVP Confirmed! See you there 🎟️✨');
  }

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post, { isForYou: window.currentCommunityTab === 'for-you' });
    card.replaceWith(temp.firstElementChild);
  }
};

window.submitDoctorReply = function(postId) {
  const input = document.getElementById(`doctor-reply-input-${postId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post) return;

  if (!post.followUps) post.followUps = [];
  post.followUps.push({
    author: 'You',
    isDoctor: false,
    text: text
  });

  input.value = '';
  SM.toast('Reply sent to Doctor thread! 💬');

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post);
    card.replaceWith(temp.firstElementChild);
  }
};

/* --- Comments Drawer Bottom Sheet --- */
window.openCareComments = function(postId) {
  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post) return;

  let sheet = document.getElementById('care-comments-sheet');
  if (!sheet) {
    sheet = document.createElement('div');
    sheet.id = 'care-comments-sheet';
    (document.getElementById('app') || document.body).appendChild(sheet);
  }

  sheet.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeCareComments()" style="opacity:1;pointer-events:auto;z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:901;max-height:80vh;border-radius:28px 28px 0 0;padding:20px;">
      
      <div class="bottom-sheet-handle"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:17px;font-weight:600;color:#0F172A;margin:0;">Comments (${post.comments.length})</h3>
        <button onclick="window.closeCareComments()" style="border:none;background:none;font-size:20px;color:#94A3B8;cursor:pointer;">✕</button>
      </div>

      <div id="care-comments-list" style="overflow-y:auto;max-height:45vh;display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
        ${post.comments.length === 0 ? `
          <div style="text-align:center;padding:30px;color:#94A3B8;font-size:13.5px;">No comments yet. Be the first to share your thoughts! 💬</div>
        ` : post.comments.map(c => `
          <div style="display:flex;gap:10px;align-items:flex-start;">
            <div style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;overflow:hidden;">
              ${(c.avatar && (c.avatar.includes('.') || c.avatar.includes('http')))
                ? `<img src="${c.avatar}" alt="${c.author}" style="width:100%;height:100%;object-fit:cover;display:block;">`
                : `<img src="profile_avatar.jpg" alt="${c.author}" style="width:100%;height:100%;object-fit:cover;display:block;">`}
            </div>
            <div style="flex:1;background:#F8FAFC;border-radius:14px;padding:8px 12px;">
              <div style="font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:600;color:#0F172A;margin-bottom:2px;">${c.author}</div>
              <div style="font-size:13px;color:#334155;line-height:1.4;">${c.text}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid #F1F5F9;">
        <input type="text" id="care-new-comment-input" placeholder="Add a comment..." style="flex:1;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:24px;height:44px;padding:0 16px;font-size:13.5px;color:#0F172A;outline:none;" onkeydown="if(event.key==='Enter') window.addCareComment('${postId}')">
        <button onclick="window.addCareComment('${postId}')" style="height:44px;padding:0 18px;border-radius:22px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFFFFF;font-weight:600;font-size:13px;border:none;cursor:pointer;">
          Post
        </button>
      </div>

    </div>
  `;
};

window.closeCareComments = function() {
  const sheet = document.getElementById('care-comments-sheet');
  if (sheet) sheet.innerHTML = '';
};

window.addCareComment = function(postId) {
  const input = document.getElementById('care-new-comment-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const post = window.MIROR_CARE_FEED.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({
    author: 'Priya Menon',
    avatar: 'profile_avatar.jpg',
    text: text
  });

  input.value = '';
  SM.toast('Comment posted! 💬');

  window.openCareComments(postId);

  const card = document.getElementById(`care-card-${postId}`);
  if (card) {
    const temp = document.createElement('div');
    temp.innerHTML = window.renderCareFeedCard(post);
    card.replaceWith(temp.firstElementChild);
  }
};

/* --- Creator Composer Direct Entry (Create & Connect Choice Sheet) --- */
window.openCareComposerChoice = function() {
  let modal = document.getElementById('care-composer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'care-composer-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeCareComposerChoice()" style="opacity:1;pointer-events:auto;z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:901;border-radius:32px 32px 0 0;padding:20px 20px 28px;background:#FFFFFF;">
      
      <div class="bottom-sheet-handle" style="margin-bottom:16px;"></div>

      <!-- Header Title -->
      <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;color:#0F172A;text-align:center;margin:0 0 22px;letter-spacing:-0.3px;">
        Create & Connect
      </h3>

      <!-- Option 1: Ask a Doctor -->
      <div onclick="window.openAskDoctorComposer()" style="background:#FFF5F9;border:1.5px solid #FCE7F3;border-radius:22px;padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg, #EC4899 0%, #A855F7 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(236,72,153,0.3);flex-shrink:0;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            <line x1="12" y1="9" x2="12" y2="15"></line>
            <line x1="9" y1="12" x2="15" y2="12"></line>
          </svg>
        </div>
        <div style="flex:1;">
          <h4 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;color:#0F172A;margin:0 0 3px;letter-spacing:-0.2px;">
            Ask a Doctor
          </h4>
          <p style="font-size:13px;color:#64748B;line-height:1.35;margin:0;font-weight:500;">
            Ask verified menopause specialists & get clinical guidance
          </p>
        </div>
        <div style="color:#94A3B8;font-size:18px;font-weight:600;margin-left:4px;">›</div>
      </div>

      <!-- Option 2: Create Community Post -->
      <div onclick="window.openCreatePostComposer()" style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:22px;padding:16px 18px;margin-bottom:22px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(139,92,246,0.3);flex-shrink:0;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <div style="flex:1;">
          <h4 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;color:#0F172A;margin:0 0 3px;letter-spacing:-0.2px;">
            Create Community Post
          </h4>
          <p style="font-size:13px;color:#64748B;line-height:1.35;margin:0;font-weight:500;">
            Share experiences, tips, daily routines, or start a poll
          </p>
        </div>
        <div style="color:#94A3B8;font-size:18px;font-weight:600;margin-left:4px;">›</div>
      </div>

      <!-- Cancel Button -->
      <button onclick="window.closeCareComposerChoice()" style="width:100%;height:48px;border-radius:24px;background:#F1F5F9;border:none;color:#475569;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:background 0.15s ease;">
        Cancel
      </button>

    </div>
  `;
};

window.closeCareComposerChoice = function() {
  const modal = document.getElementById('care-composer-modal');
  if (modal) modal.innerHTML = '';
};

/* --- Ask Doctor Composer Flow (Page 6 of PDF) --- */
window.openAskDoctorComposer = function(context) {
  window.currentComposerContext = context || (window.currentCommunityTab === 'ask-miror' ? 'ask-miror' : 'expert-answers');
  window.closeCareComposerChoice();

  let modal = document.getElementById('care-composer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'care-composer-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeCareComposerChoice()" style="opacity:1;pointer-events:auto;z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:901;border-radius:28px 28px 0 0;padding:24px 20px;max-height:88vh;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Top Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <button onclick="window.closeCareComposerChoice()" style="border:none;background:none;font-size:22px;color:#0F172A;cursor:pointer;padding:0;">‹</button>
          <h3 style="font-family:'Montserrat',sans-serif;font-size:17px;font-weight:600;color:#0F172A;margin:0;">Ask a Doctor</h3>
        </div>
        <button onclick="window.closeCareComposerChoice()" style="border:none;background:none;font-size:20px;color:#94A3B8;cursor:pointer;">✕</button>
      </div>

      <div style="overflow-y:auto;max-height:68vh;padding-right:2px;">
        
        <!-- Info Banner -->
        <div style="background:#FFF9FC;border:1px solid #FCE7F3;border-radius:16px;padding:12px 14px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px;">
          <div style="width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              <line x1="12" y1="8" x2="12" y2="14"></line>
              <line x1="9" y1="11" x2="15" y2="11"></line>
            </svg>
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:2px;">Ask a question to our doctors</div>
            <div style="font-size:12px;color:#64748B;line-height:1.4;">Our verified doctors will reply directly here. Your question will be visible to the community.</div>
          </div>
        </div>

        <!-- Question Textarea -->
        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px;">Your Question</label>
          <textarea id="ask-doc-question-input" rows="4" placeholder="Type your health question here (e.g. Waking up at 3 AM every night. Is this perimenopause?)..." style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:16px;padding:12px 14px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;resize:none;line-height:1.45;"></textarea>
          <div style="text-align:right;font-size:11px;color:#94A3B8;margin-top:4px;">0/1000</div>
        </div>

        <!-- Add Symptoms Tags -->
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:6px;">Add Symptoms (optional)</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${['Sleep issues', 'Fatigue', 'Hot flashes', 'Brain fog', 'Mood swings', 'Weight gain'].map(sym => `
              <button type="button" class="symptom-tag-btn" onclick="this.classList.toggle('active');this.style.background=this.classList.contains('active')?'#FDF2F8':'#F1F5F9';this.style.color=this.classList.contains('active')?'#DB2777':'#64748B';this.style.borderColor=this.classList.contains('active')?'#F472B6':'transparent';" style="padding:6px 14px;border-radius:16px;border:1px solid transparent;background:#F1F5F9;color:#64748B;font-size:12px;font-weight:600;cursor:pointer;">
                ${sym}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Attachments Row (Page 6 of PDF) -->
        <div style="margin-bottom:18px;">
          <label style="display:block;font-size:13px;font-weight:600;color:#0F172A;margin-bottom:8px;">Attach (optional)</label>
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;">
            <button type="button" onclick="SM.toast('Camera opened 📷')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-size:11px;font-weight:600;color:#475569;">
              <span style="font-size:18px;">📷</span> Photo
            </button>
            <button type="button" onclick="SM.toast('Gallery opened 🖼️')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-size:11px;font-weight:600;color:#475569;">
              <span style="font-size:18px;">🖼️</span> Gallery
            </button>
            <button type="button" onclick="SM.toast('Lab Report attached (Sleep_Report.pdf) 📄')" style="background:#FDF2F8;border:1px solid #FBCFE8;border-radius:14px;padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-size:11px;font-weight:600;color:#DB2777;">
              <span style="font-size:18px;">📄</span> Lab Report
            </button>
            <button type="button" onclick="SM.toast('Docs picker opened 📑')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-size:11px;font-weight:600;color:#475569;">
              <span style="font-size:18px;">📑</span> Other Docs
            </button>
          </div>
        </div>

        <!-- Post as Anonymous Toggle (Page 6 of PDF) -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:#F8FAFC;border-radius:16px;margin-bottom:20px;border:1px solid #E2E8F0;">
          <div>
            <div style="font-size:13.5px;font-weight:600;color:#0F172A;">Post as Anonymous</div>
            <div style="font-size:11.5px;color:#64748B;">Your identity will not be shown to others</div>
          </div>
          <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
            <input type="checkbox" id="ask-doc-anon-toggle" style="opacity:0;width:0;height:0;">
            <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#CBD5E1;border-radius:24px;transition:0.2s;" onclick="this.style.backgroundColor = this.previousElementSibling.checked ? '#CBD5E1' : '#EC5DAA';"></span>
          </label>
        </div>

        <!-- Submit Button -->
        <button onclick="window.submitNewDoctorQuestion()" style="width:100%;height:50px;border-radius:25px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(122,63,209,0.3);margin-bottom:10px;">
          Submit Question
        </button>

      </div>

    </div>
  `;
};

window.openDoctor1on1ChatModal = function(opts = {}) {
  const doctorName = opts.doctorName || 'Dr. Anjali Sharma';
  const doctorRole = opts.doctorRole || 'Senior Gynecologist & Hormone Specialist';
  const doctorAvatar = opts.doctorAvatar || 'feed_dr_anjali.jpg';

  let modal = document.getElementById('doctor-1on1-chat-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'doctor-1on1-chat-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  window.doctorChatMessages = window.doctorChatMessages || [
    {
      sender: 'doctor',
      name: doctorName,
      avatar: doctorAvatar,
      time: 'Just now',
      text: `Hello! I'm ${doctorName}. I've received your request for 1:1 confidential medical guidance. Please share details about your symptoms or medical history—everything discussed here is strictly private.`
    }
  ];

  function renderMessages() {
    return window.doctorChatMessages.map(m => {
      const isDoc = m.sender === 'doctor';
      return `
        <div style="display:flex; gap:10px; margin-bottom:14px; flex-direction:${isDoc ? 'row' : 'row-reverse'};">
          ${isDoc ? `<img src="${m.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid #F472B6; flex-shrink:0;">` : ''}
          <div style="max-width:82%;">
            <div style="font-size:11px; font-weight:700; color:#64748B; margin-bottom:3px; text-align:${isDoc ? 'left' : 'right'}; font-family:'Montserrat',sans-serif;">
              ${m.name} • ${m.time}
            </div>
            <div style="background:${isDoc ? '#FFFFFF' : 'linear-gradient(145deg, #EC5DAA, #7A3FD1)'}; color:${isDoc ? '#0F172A' : '#FFFFFF'}; border:${isDoc ? '1px solid #E2E8F0' : 'none'}; border-radius:${isDoc ? '18px 18px 18px 4px' : '18px 18px 4px 18px'}; padding:12px 16px; font-size:13.5px; line-height:1.45; font-family:'Montserrat',sans-serif; box-shadow:0 3px 12px rgba(0,0,0,0.04);">
              ${m.text}
              ${m.attachment ? `
                <div style="margin-top:8px; padding:6px 10px; background:${isDoc ? '#F8FAFC' : 'rgba(255,255,255,0.2)'}; border-radius:10px; font-size:11.5px; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                  ${m.attachment}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeDoctor1on1ChatModal()" style="opacity:1; pointer-events:auto; z-index:998;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:999; border-radius:28px 28px 0 0; padding:0; height:92vh; max-height:92vh; background:#FAF9FB; display:flex; flex-direction:column;">
      
      <!-- Doctor Chat Header -->
      <div style="background:#FFFFFF; border-bottom:1px solid #F1F5F9; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; border-radius:28px 28px 0 0; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="position:relative;">
            <img src="${doctorAvatar}" onerror="this.onerror=null;this.src='profile_avatar.jpg';" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid #FCE7F3;">
            <span style="position:absolute; bottom:1px; right:1px; width:11px; height:11px; border-radius:50%; background:#10B981; border:2px solid white;"></span>
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:15.5px; font-weight:800; color:#0F172A; display:flex; align-items:center; gap:6px;">
              ${doctorName} <span style="color:#059669; font-size:12px;">✓ Verified</span>
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:600; color:#7E22CE;">
              ${doctorRole}
            </div>
          </div>
        </div>
        <button onclick="window.closeDoctor1on1ChatModal()" style="border:none; background:#F1F5F9; border-radius:50%; width:34px; height:34px; font-size:16px; color:#64748B; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
      </div>

      <!-- Confidential Shield Notice Banner -->
      <div style="background:#FFF0F6; border-bottom:1px solid #FCE7F3; padding:8px 20px; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; color:#EC5DAA; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span>🔒 1:1 Encrypted & Confidential Doctor Chat</span>
      </div>

      <!-- Messages Feed Container -->
      <div id="doctor-1on1-messages-feed" style="flex:1; overflow-y:auto; padding:18px 18px 10px;">
        ${renderMessages()}
      </div>

      <!-- Input & Actions Footer -->
      <div style="background:#FFFFFF; border-top:1px solid #F1F5F9; padding:12px 16px 24px; display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="text" id="doctor-1on1-input" placeholder="Type your confidential health question..." style="flex:1; height:46px; border-radius:23px; background:#F8FAFC; border:1.5px solid #E2E8F0; padding:0 16px; font-size:13.5px; color:#0F172A; outline:none; font-family:'Montserrat',sans-serif;" onkeydown="if(event.key==='Enter') window.sendDoctor1on1Message();">
          <button onclick="window.sendDoctor1on1Message()" style="width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg, #F7B6D2 0%, #EC5DAA 40%, #7A3FD1 100%); color:white; border:none; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(122,63,209,0.3); flex-shrink:0;">
            ➔
          </button>
        </div>
        <div style="display:flex; gap:12px; font-size:12px; color:#64748B; font-weight:600; padding-left:8px;">
          <span style="cursor:pointer;" onclick="SM.toast('Camera opened 📷')">📷 Photo</span>
          <span style="cursor:pointer;" onclick="SM.toast('Lab report attached 📄')">📄 Attach Lab Report</span>
          <span style="cursor:pointer;" onclick="SM.toast('Voice note feature ready 🎙️')">🎙️ Voice Note</span>
        </div>
      </div>

    </div>
  `;
};

window.closeDoctor1on1ChatModal = function() {
  const modal = document.getElementById('doctor-1on1-chat-modal');
  if (modal) modal.remove();
};

window.sendDoctor1on1Message = function() {
  const input = document.getElementById('doctor-1on1-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';

  window.doctorChatMessages.push({
    sender: 'user',
    name: 'You',
    avatar: 'profile_avatar.jpg',
    time: 'Just now',
    text: text
  });

  const feed = document.getElementById('doctor-1on1-messages-feed');
  if (feed) {
    feed.innerHTML = window.doctorChatMessages.map(m => {
      const isDoc = m.sender === 'doctor';
      return `
        <div style="display:flex; gap:10px; margin-bottom:14px; flex-direction:${isDoc ? 'row' : 'row-reverse'};">
          ${isDoc ? `<img src="${m.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid #F472B6; flex-shrink:0;">` : ''}
          <div style="max-width:82%;">
            <div style="font-size:11px; font-weight:700; color:#64748B; margin-bottom:3px; text-align:${isDoc ? 'left' : 'right'}; font-family:'Montserrat',sans-serif;">
              ${m.name} • ${m.time}
            </div>
            <div style="background:${isDoc ? '#FFFFFF' : 'linear-gradient(145deg, #EC5DAA, #7A3FD1)'}; color:${isDoc ? '#0F172A' : '#FFFFFF'}; border:${isDoc ? '1px solid #E2E8F0' : 'none'}; border-radius:${isDoc ? '18px 18px 18px 4px' : '18px 18px 4px 18px'}; padding:12px 16px; font-size:13.5px; line-height:1.45; font-family:'Montserrat',sans-serif; box-shadow:0 3px 12px rgba(0,0,0,0.04);">
              ${m.text}
              ${m.attachment ? `
                <div style="margin-top:8px; padding:6px 10px; background:${isDoc ? '#F8FAFC' : 'rgba(255,255,255,0.2)'}; border-radius:10px; font-size:11.5px; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                  ${m.attachment}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    feed.scrollTop = feed.scrollHeight;
  }

  setTimeout(() => {
    window.doctorChatMessages.push({
      sender: 'doctor',
      name: 'Dr. Anjali Sharma',
      avatar: 'feed_dr_anjali.jpg',
      time: 'Just now',
      text: 'Thank you for sharing. I am reviewing your query and medical notes right now to provide personalized recommendations.'
    });
    if (feed) {
      feed.innerHTML = window.doctorChatMessages.map(m => {
        const isDoc = m.sender === 'doctor';
        return `
          <div style="display:flex; gap:10px; margin-bottom:14px; flex-direction:${isDoc ? 'row' : 'row-reverse'};">
            ${isDoc ? `<img src="${m.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid #F472B6; flex-shrink:0;">` : ''}
            <div style="max-width:82%;">
              <div style="font-size:11px; font-weight:700; color:#64748B; margin-bottom:3px; text-align:${isDoc ? 'left' : 'right'}; font-family:'Montserrat',sans-serif;">
                ${m.name} • ${m.time}
              </div>
              <div style="background:${isDoc ? '#FFFFFF' : 'linear-gradient(145deg, #EC5DAA, #7A3FD1)'}; color:${isDoc ? '#0F172A' : '#FFFFFF'}; border:${isDoc ? '1px solid #E2E8F0' : 'none'}; border-radius:${isDoc ? '18px 18px 18px 4px' : '18px 18px 4px 18px'}; padding:12px 16px; font-size:13.5px; line-height:1.45; font-family:'Montserrat',sans-serif; box-shadow:0 3px 12px rgba(0,0,0,0.04);">
                ${m.text}
                ${m.attachment ? `
                  <div style="margin-top:8px; padding:6px 10px; background:${isDoc ? '#F8FAFC' : 'rgba(255,255,255,0.2)'}; border-radius:10px; font-size:11.5px; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                    ${m.attachment}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
      feed.scrollTop = feed.scrollHeight;
    }
  }, 1200);
};

window.openDoctor1on1ChatWithContext = function(question, docName, docReply, docAvatar) {
  const dName = docName || 'Dr. Anjali Sharma';
  const dAvatar = docAvatar || 'feed_dr_anjali.jpg';

  if (dName.includes('Anjali')) {
    window.doctorChatMessages = [
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '2 days ago',
        text: 'I saw the group discussion on 3 AM night wakes. Is HRT safe for me given my thyroid history?'
      },
      {
        sender: 'doctor',
        name: dName,
        avatar: dAvatar,
        time: '1 day ago',
        text: 'Hello! Thanks for reaching out. Based on your profile & thyroid history, bioidentical HRT is generally safe and very effective when properly balanced with progesterone. Have you had your TSH checked recently?'
      },
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '1 day ago',
        text: 'Yes! My TSH was 2.4 and free T4 was normal in my last blood test. I attached the PDF here.',
        attachment: '📄 Sleep_Thyroid_Panel_Aug2026.pdf'
      },
      {
        sender: 'doctor',
        name: dName,
        avatar: dAvatar,
        time: '18 hours ago',
        text: 'That\'s excellent! Those levels are well within optimal range. I\'ve logged a personalized HRT regimen for you in your Care Vault. Let\'s schedule a 15-min follow-up check in 2 weeks.'
      },
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '2 hours ago',
        text: 'Thank you so much Dr. Anjali! That gives me so much peace of mind.'
      }
    ];
  } else if (dName.includes('Sarah')) {
    window.doctorChatMessages = [
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '3 days ago',
        text: 'Can I safely combine Magnesium Glycinate with my daily prescription supplements?'
      },
      {
        sender: 'doctor',
        name: dName,
        avatar: dAvatar,
        time: '2 days ago',
        text: 'Hello! Yes, Magnesium Glycinate (200-400mg) is safe to combine with your daily regimen. Take it 30-45 minutes before sleep for optimal muscle & nervous system relaxation.'
      },
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: 'Yesterday',
        text: 'Should I take it with food or on an empty stomach?'
      },
      {
        sender: 'doctor',
        name: dName,
        avatar: dAvatar,
        time: 'Yesterday',
        text: 'Glycinate is gentle on the stomach, so either works well! Taking it with a small evening snack or warm water works best.'
      }
    ];
  } else {
    window.doctorChatMessages = [
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '4 days ago',
        text: 'What tests should I request from my endocrinologist for midlife memory lapses?'
      },
      {
        sender: 'doctor',
        name: dName,
        avatar: dAvatar,
        time: '3 days ago',
        text: 'Hi there! I recommend requesting Thyroid (TSH, Free T3/T4), Vitamin B12, Vitamin D3, and Fasting Insulin. I\'ve prepared a downloadable lab checklist for your next visit.'
      },
      {
        sender: 'user',
        name: 'You',
        avatar: 'profile_avatar.jpg',
        time: '3 days ago',
        text: 'Thank you Doctor! I will ask my physician for these exact panels.'
      }
    ];
  }

  window.openDoctor1on1ChatModal({ doctorName: dName, doctorAvatar: dAvatar });
};

window.openConfidentialQuestionFlow = function() {
  if (!window.isMirorCarePlusSubscribed) {
    window.openCarePlusPaywallModal({
      title: '1:1 Confidential Doctor Consultation',
      subtitle: 'Route your medical question directly to certified gynecologists for private 1-on-1 guidance.',
      singleOptionTitle: 'Single Confidential Question Pass',
      singlePrice: '₹199',
      singleLabel: 'Unlock 1:1 Consultation ₹199',
      carePlusPrice: '₹599 / mo',
      carePlusLabel: 'Join Care+ for Unlimited 1:1 Doctor Q&A',
      highlights: [
        '✓ Direct 1:1 confidential chat with senior gynecologists',
        '✓ Unlimited follow-up questions for 7 days',
        '✓ Doctor report & prescription analysis included',
        '✓ Access to all guided health programs'
      ],
      onSinglePay: () => {
        window.isMirorCarePlusSubscribed = true;
        if (typeof SM !== 'undefined') SM.toast('1:1 Doctor Consultation Unlocked! 👩‍⚕️');
        window.closeCarePlusPaywallModal();
        setTimeout(() => window.openDoctor1on1ChatModal(), 350);
      },
      onCarePlusJoin: () => {
        window.isMirorCarePlusSubscribed = true;
        if (typeof SM !== 'undefined') SM.toast('Care+ Unlocked! 1:1 Doctor Chat ready 👩‍⚕️');
        window.closeCarePlusPaywallModal();
        setTimeout(() => window.openDoctor1on1ChatModal(), 350);
      }
    });
  } else {
    window.openDoctor1on1ChatModal();
  }
};

/* --------------------------------------------------------------------------
   GLOBAL CONTEXTUAL CARE+ CONVERSION & PAYMENT PAYWALL COMPONENT
   -------------------------------------------------------------------------- */
window.openCarePlusPaywallModal = function(opts = {}) {
  const {
    title = 'Unlock Miror Care+ Feature',
    subtitle = 'Get personalized clinical support and unlimited access to expert health features.',
    singleOptionTitle = 'Single Item Access',
    singlePrice = '₹299',
    singleLabel = 'Pay Once',
    carePlusPrice = '₹599 / month',
    carePlusLabel = 'Join Miror Care+',
    badgeText = 'BEST VALUE • CANCEL ANYTIME',
    highlights = [
      '✓ Unlimited confidential 1:1 Doctor Q&A',
      '✓ Access all guided 21-Day & 7-Day programs',
      '✓ AI Lab Report Interpretation & Vault',
      '✓ Member discounts on clinical consultations'
    ],
    onSinglePay = null,
    onCarePlusJoin = null
  } = opts;

  let modal = document.getElementById('careplus-paywall-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'careplus-paywall-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeCarePlusPaywallModal()" style="opacity:1; pointer-events:auto; z-index:990;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:991; border-radius:28px 28px 0 0; padding:24px 20px; max-height:90vh; background:#FFFFFF;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Top Close & Care+ Badge Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
        <div style="font-family:'Montserrat',sans-serif; font-size:10.5px; font-weight:800; letter-spacing:1.2px; color:#EC5DAA; text-transform:uppercase; background:#FFF0F6; border:1px solid #FCE7F3; padding:4px 12px; border-radius:14px;">
          MIROR CARE+
        </div>
        <button onclick="window.closeCarePlusPaywallModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:32px; height:32px; font-size:16px; color:#64748B; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
      </div>

      <div style="overflow-y:auto; max-height:74vh; padding-right:2px;">
        
        <!-- Header Title & Subtitle -->
        <h2 style="font-family:'Montserrat',sans-serif; font-size:20px; font-weight:800; color:#0F172A; margin:0 0 6px; letter-spacing:-0.4px;">
          ${title}
        </h2>
        <p style="font-family:'Montserrat',sans-serif; font-size:13px; color:#64748B; margin:0 0 20px; line-height:1.45;">
          ${subtitle}
        </p>

        <!-- Option 1: MIROR CARE+ MEMBERSHIP (Highlighted Best Value Card) -->
        <div class="card card-interactive" onclick="window.confirmCarePlusSubscribe()" style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 2px solid #EC5DAA; border-radius: 22px; padding: 20px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(236,93,170,0.12); cursor:pointer;">
          
          <!-- Top Badge Row -->
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <span style="background: linear-gradient(135deg, #EC5DAA 0%, #7A3FD1 100%); color: white; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; box-shadow: 0 2px 8px rgba(122,63,209,0.25); display:inline-flex; align-items:center; gap:4px;">
              ✨ ${badgeText}
            </span>
          </div>

          <!-- Title & Price Block -->
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px;">
            <div style="flex:1; min-width:0;">
              <h3 style="font-family:'Montserrat',sans-serif; font-size:17px; font-weight:800; color:#0F172A; margin:0 0 4px; line-height:1.25; letter-spacing:-0.3px;">
                Miror Care+ Membership
              </h3>
              <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#7A3FD1; font-weight:700;">
                Unlimited Clinical & Health Access
              </div>
            </div>

            <!-- Clean Single-Line Price Badge -->
            <div style="text-align:right; flex-shrink:0; background:#FFFFFF; border:1px solid #FCE7F3; border-radius:14px; padding:6px 12px; box-shadow:0 2px 8px rgba(236,93,170,0.08);">
              <div style="font-family:'Montserrat',sans-serif; font-size:17px; font-weight:800; color:#EC5DAA; line-height:1.1; white-space:nowrap;">
                ${carePlusPrice.replace(/\s*\/\s*/, ' <span style="font-size:11px; font-weight:700; color:#94A3B8;">/</span> ')}
              </div>
            </div>
          </div>

          <!-- Care+ Benefits Checklist Box -->
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:18px; background:rgba(255,255,255,0.65); border-radius:16px; padding:12px 14px; border:1px solid #FCE7F3;">
            ${highlights.map(h => `
              <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#334155; font-weight:600; display:flex; align-items:center; gap:8px; line-height:1.35;">
                <span style="width:18px; height:18px; border-radius:50%; background:#FCE7F3; color:#EC5DAA; font-weight:800; font-size:11px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">✓</span>
                <span>${h.replace(/^✓\s*/, '')}</span>
              </div>
            `).join('')}
          </div>

          <!-- CTA Button -->
          <button style="width:100%; height:50px; border-radius:25px; background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:#FFFFFF; font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(122,63,209,0.28);">
            ${carePlusLabel}
          </button>
        </div>

        <!-- Option 2: Pay for Single Feature (If applicable) -->
        ${singlePrice ? `
          <div class="card card-interactive" onclick="window.confirmSinglePay()" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:16px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:12px; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,0.02);">
            <div style="flex:1; min-width:0;">
              <div style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; color:#0F172A; margin-bottom:2px;">
                ${singleOptionTitle}
              </div>
              <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B; line-height:1.35;">
                One-time payment for this request
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <button style="border:none; background:linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); border:1.5px solid #CBD5E1; color:#0F172A; border-radius:18px; padding:8px 16px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <span>${singleLabel}</span>
              </button>
            </div>
          </div>
        ` : ''}

        <div style="text-align:center; font-family:'Montserrat',sans-serif; font-size:11.5px; color:#94A3B8; font-weight:600; margin-bottom:10px;">
          🔒 Secure 256-bit encrypted checkout • Cancel anytime in Settings
        </div>

      </div>

    </div>
  `;

  window._activePaywallOnSingle = onSinglePay;
  window._activePaywallOnCarePlus = onCarePlusJoin;
};

window.closeCarePlusPaywallModal = function() {
  const modal = document.getElementById('careplus-paywall-modal');
  if (modal) modal.innerHTML = '';
};

window.confirmCarePlusSubscribe = function() {
  window.closeCarePlusPaywallModal();
  window.isMirorCarePlusSubscribed = true;
  SM.toast('Welcome to Miror Care+ 🎉 All premium features unlocked!');
  if (typeof window._activePaywallOnCarePlus === 'function') {
    window._activePaywallOnCarePlus();
  } else {
    SM.render();
  }
};

window.confirmSinglePay = function() {
  window.closeCarePlusPaywallModal();
  SM.toast('Payment successful! Feature unlocked ✨');
  if (typeof window._activePaywallOnSingle === 'function') {
    window._activePaywallOnSingle();
  } else {
    SM.render();
  }
};

/* --- Clinical Doctor Booking Modal (Requirement 6) --- */
window.openBookConsultModal = function(specialistTitle = 'Gynaecologist') {
  let modal = document.getElementById('book-consult-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'book-consult-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  const doctorName = 'Dr. Anjali Sharma, MD';
  const role = specialistTitle || 'Reproductive Endocrinologist & Gynecologist';

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeBookConsultModal()" style="opacity:1; pointer-events:auto; z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:901; border-radius:28px 28px 0 0; padding:24px 20px; max-height:88vh;">
      
      <div class="bottom-sheet-handle"></div>

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <span style="background:#FFF0F6; border:1px solid #FCE7F3; color:#EC5DAA; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:14px;">
          CLINICAL CARE CONSULTATION
        </span>
        <button onclick="window.closeBookConsultModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:32px; height:32px; font-size:16px; color:#64748B; cursor:pointer;">✕</button>
      </div>

      <div style="overflow-y:auto; max-height:72vh; padding-right:2px;">
        
        <!-- Doctor Info Header -->
        <div style="display:flex; align-items:center; gap:14px; background:#FAF5FF; border:1px solid #F3E8FF; border-radius:20px; padding:16px; margin-bottom:18px;">
          <div style="width:52px; height:52px; border-radius:50%; overflow:hidden; border:2px solid #FCE7F3; flex-shrink:0;">
            <img src="feed_dr_anjali.jpg" alt="Dr. Anjali" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:16px; font-weight:800; color:#0F172A; margin-bottom:2px;">
              ${doctorName}
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
              ${role} • 14 yrs exp
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#059669; font-weight:700; margin-top:2px;">
              Available Today, 4:00 PM
            </div>
          </div>
        </div>

        <!-- Pricing Comparison Banner (Requirement 6) -->
        <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:20px; padding:18px; margin-bottom:20px;">
          <div style="font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.8px; color:#64748B; text-transform:uppercase; margin-bottom:10px;">
            CONSULTATION PRICING & MEMBER BENEFITS
          </div>
          
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:12px; border-bottom:1px solid #F1F5F9; margin-bottom:12px;">
            <div>
              <div style="font-family:'Montserrat',sans-serif; font-size:14px; font-weight:700; color:#0F172A;">
                Standard Consultation Fee
              </div>
              <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
                30 min 1:1 Video Consultation
              </div>
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:16px; font-weight:800; color:#0F172A;">
              ₹1,499
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; background:#FFF0F6; border:1px solid #FCE7F3; border-radius:14px; padding:12px 14px;">
            <div>
              <div style="font-family:'Montserrat',sans-serif; font-size:14px; font-weight:800; color:#EC5DAA;">
                Miror Care+ Member Price ✨
              </div>
              <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#7A3FD1; font-weight:700;">
                Save ₹500 instantly on every visit
              </div>
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:#EC5DAA;">
              ₹999
            </div>
          </div>
        </div>

        <!-- Action CTAs (Does NOT block non-members) -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button onclick="window.closeBookConsultModal(); window.openCarePlusPaywallModal({ title: 'Join Care+ & Save ₹500', subtitle: 'Get ₹999 consultation pricing + unlimited doctor Q&A and programs.', singlePrice: '', carePlusPrice: '₹599 / mo', onCarePlusJoin: () => { SM.toast('Consultation booked at Care+ rate (₹999)! 📅'); } })" style="width:100%; height:48px; border-radius:24px; background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:#FFFFFF; font-family:'Montserrat',sans-serif; font-size:14px; font-weight:700; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(122,63,209,0.28);">
            Join Care+ & Book at ₹999 (Save ₹500)
          </button>
          <button onclick="window.closeBookConsultModal(); SM.toast('Consultation booked at standard rate (₹1,499)! 📅');" style="width:100%; height:46px; border-radius:23px; background:#FFFFFF; border:1.5px solid #CBD5E1; color:#0F172A; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:700; cursor:pointer;">
            Book Standard Consultation at ₹1,499
          </button>
        </div>

      </div>

    </div>
  `;
};

window.closeBookConsultModal = function() {
  const modal = document.getElementById('book-consult-modal');
  if (modal) modal.innerHTML = '';
};

/* --- Paywall Triggers for Guided Programs, Masterclasses & Insights --- */
window.openProgramPaywall = function(programName) {
  window.openCarePlusPaywallModal({
    title: `Unlock ${programName || 'Guided Program'}`,
    subtitle: 'Get full day-by-day guided protocols, habit tracking, and doctor Q&A.',
    singleOptionTitle: 'Individual Program Pass',
    singlePrice: '₹399',
    singleLabel: 'Unlock ₹399',
    carePlusPrice: '₹599 / mo',
    carePlusLabel: 'Join Care+ for Unlimited Programs',
    highlights: [
      '✓ Access ALL 21-Day & 7-Day guided health programs',
      '✓ Daily protocol tracking & reminder integrations',
      '✓ Unlimited 1:1 Doctor Q&A',
      '✓ Member discounts on consultation calls'
    ],
    onSinglePay: () => { SM.push('community-group'); },
    onCarePlusJoin: () => { SM.push('community-group'); }
  });
};

window.openMasterclassPaywall = function(title) {
  window.openCarePlusPaywallModal({
    title: `Unlock Expert Masterclass Pass`,
    subtitle: 'Watch evidence-based video guides and live Q&As from leading specialists.',
    singleOptionTitle: 'Single Masterclass Pass',
    singlePrice: '₹199',
    singleLabel: 'Watch Pass ₹199',
    carePlusPrice: '₹599 / mo',
    carePlusLabel: 'Join Care+ for All Masterclasses',
    highlights: [
      '✓ Free access to all live & recorded masterclasses',
      '✓ Direct Q&A with guest specialists',
      '✓ Unlimited doctor questions & guided programs'
    ],
    onSinglePay: () => { SM.toast('Masterclass pass activated! 🎬'); },
    onCarePlusJoin: () => { SM.toast('Care+ Masterclasses unlocked! 🎬'); }
  });
};

window.openAdvancedInsightsPaywall = function() {
  window.openCarePlusPaywallModal({
    title: 'Advanced Health Insights & Trends',
    subtitle: 'Unlock deep AI symptom correlations, cycle phase analysis, and hormonal trend forecasting.',
    singleOptionTitle: 'Single Monthly Insights Report',
    singlePrice: '₹149',
    singleLabel: 'Unlock Report',
    carePlusPrice: '₹599 / mo',
    carePlusLabel: 'Join Care+ for Unlimited Insights',
    highlights: [
      '✓ Real-time symptom correlation & phase tracking',
      '✓ Exportable clinical reports for your doctor',
      '✓ Unlimited 1:1 Doctor Q&A'
    ],
    onSinglePay: () => { SM.toast('Advanced Health Insights Unlocked! 🧠'); },
    onCarePlusJoin: () => { SM.toast('Care+ Advanced Insights Unlocked! 🧠'); }
  });
};

window.submitNewDoctorQuestion = function() {
  const textarea = document.getElementById('ask-doc-question-input');
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    SM.toast('Please write your question first!');
    return;
  }

  const isAskMiror = window.currentComposerContext === 'ask-miror' || window.currentCommunityTab === 'ask-miror';

  if (isAskMiror) {
    // Contextual Paywall ONLY for Ask Miror 1:1 personal questions
    window.openCarePlusPaywallModal({
      title: 'Submit Personal Question to Doctor',
      subtitle: 'Get verified 1:1 clinical guidance from Miror doctors.',
      singleOptionTitle: 'Pay for This Question',
      singlePrice: '₹299',
      singleLabel: 'Pay ₹299',
      carePlusPrice: '₹599 / mo',
      carePlusLabel: 'Join Care+ for ₹599/mo',
      highlights: [
        '✓ Unlimited confidential doctor Q&A',
        '✓ Priority response within 24 hours',
        '✓ Access to all guided health programs',
        '✓ Encrypted lab report summaries'
      ],
      onSinglePay: () => { window.finishSubmittingDoctorQuestion(text); },
      onCarePlusJoin: () => { window.finishSubmittingDoctorQuestion(text); }
    });
  } else {
    // FREE submission for Expert Answers & General Community Q&A!
    window.finishSubmittingDoctorQuestion(text);
  }
};

window.finishSubmittingDoctorQuestion = function(text) {
  const isAnon = document.getElementById('ask-doc-anon-toggle')?.checked || false;

  const newCard = {
    id: `care-user-${Date.now()}`,
    type: 'ask-doctor',
    author: {
      name: isAnon ? 'Anonymous Member' : 'Priya Menon',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'profile_avatar.jpg',
      bg: isAnon ? '#F1F5F9' : '#FDF2F8'
    },
    timestamp: 'Just now',
    status: 'unanswered',
    question: {
      title: text.length > 50 ? text.substring(0, 50) + '...' : text,
      body: text
    },
    attachment: {
      name: 'Sleep_Report.pdf',
      size: '1.4 MB'
    },
    doctorAnswer: null,
    followUps: [],
    likes: 1,
    isLiked: false,
    comments: [],
    isBookmarked: false,
    canShare: false
  };

  window.MIROR_CARE_FEED.unshift(newCard);
  window.closeCareComposerChoice();

  if (window.switchCommunityTab) {
    window.switchCommunityTab('ask-doctor');
  } else {
    const container = document.getElementById('care-feed-container');
    if (container) {
      container.innerHTML = window.renderCareFeedStream();
    }
  }

  // Celebration
  if (window.confetti) {
    window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }
  SM.toast('Your question is live! Doctors will review and answer soon 🩺✨');
};

/* --- Mandatory Group Selector & Create Post Composer Flow --- */
window.composerSelectedGroupId = window.composerSelectedGroupId || null;

/* --- Open Group Selector Modal (Mandatory group picker) --- */
window.openPostGroupPickerModal = function() {
  const groups = window.MIROR_COMMUNITY_GROUPS || [];
  const selectedId = window.composerSelectedGroupId;

  let pickerModal = document.getElementById('post-group-picker-modal');
  if (!pickerModal) {
    pickerModal = document.createElement('div');
    pickerModal.id = 'post-group-picker-modal';
    (document.getElementById('app') || document.body).appendChild(pickerModal);
  }

  pickerModal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closePostGroupPickerModal()" style="opacity:1;pointer-events:auto;z-index:960;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:961;border-radius:28px 28px 0 0;padding:22px 20px 28px;max-height:80vh;display:flex;flex-direction:column;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <div>
          <h3 style="font-family:'Montserrat',sans-serif;font-size:17px;font-weight:600;color:#0F172A;margin:0 0 2px;">
            Select a Group <span style="color:#E11D48;">*</span>
          </h3>
          <div style="font-size:12px;color:#64748B;font-weight:500;">
            Mandatory: Choose where your post will land
          </div>
        </div>
        <button onclick="window.closePostGroupPickerModal()" style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;border:none;color:#64748B;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button>
      </div>

      <!-- Search Filter -->
      <div style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:14px;padding:8px 12px;display:flex;align-items:center;gap:8px;margin-bottom:14px;">
        <span style="font-size:14px;">🔍</span>
        <input type="text" id="group-picker-search-input" placeholder="Search groups..." oninput="window.filterPostGroupPicker(this.value)" style="border:none;outline:none;background:transparent;width:100%;font-family:'Montserrat',sans-serif;font-size:13px;color:#0F172A;">
      </div>

      <!-- Group List -->
      <div id="post-group-picker-list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;padding-bottom:10px;">
        ${groups.map(g => {
          const isSelected = selectedId === g.id;
          return `
            <div class="post-group-option-item" onclick="window.selectPostGroup('${g.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:16px;background:${isSelected ? '#FDF2F8' : '#FFFFFF'};border:1.5px solid ${isSelected ? '#EC5DAA' : '#F1F5F9'};cursor:pointer;transition:all 0.15s ease;">
              <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
                <div style="width:38px;height:38px;border-radius:12px;background:${g.bg || '#FAF5FF'};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;overflow:hidden;">
                  ${g.iconImg ? `<img src="${g.iconImg}" style="width:100%;height:100%;object-fit:cover;">` : g.icon}
                </div>
                <div style="min-width:0;flex:1;">
                  <h4 style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${g.name}
                  </h4>
                  <div style="font-size:11.5px;color:#64748B;font-weight:500;">
                    ${g.members || '1.2k members'}
                  </div>
                </div>
              </div>
              <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${isSelected ? '#EC5DAA' : '#CBD5E1'};display:flex;align-items:center;justify-content:center;background:${isSelected ? '#EC5DAA' : 'transparent'};color:white;font-size:12px;font-weight:600;flex-shrink:0;margin-left:10px;">
                ${isSelected ? '✓' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
};

window.closePostGroupPickerModal = function() {
  const pickerModal = document.getElementById('post-group-picker-modal');
  if (pickerModal) pickerModal.innerHTML = '';
};

window.filterPostGroupPicker = function(query) {
  const q = (query || '').toLowerCase().trim();
  const groups = window.MIROR_COMMUNITY_GROUPS || [];
  const selectedId = window.composerSelectedGroupId;
  const filtered = groups.filter(g => g.name.toLowerCase().includes(q) || (g.sub && g.sub.toLowerCase().includes(q)));

  const container = document.getElementById('post-group-picker-list');
  if (!container) return;

  container.innerHTML = filtered.map(g => {
    const isSelected = selectedId === g.id;
    return `
      <div class="post-group-option-item" onclick="window.selectPostGroup('${g.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:16px;background:${isSelected ? '#FDF2F8' : '#FFFFFF'};border:1.5px solid ${isSelected ? '#EC5DAA' : '#F1F5F9'};cursor:pointer;transition:all 0.15s ease;">
        <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
          <div style="width:38px;height:38px;border-radius:12px;background:${g.bg || '#FAF5FF'};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;overflow:hidden;">
            ${g.iconImg ? `<img src="${g.iconImg}" style="width:100%;height:100%;object-fit:cover;">` : g.icon}
          </div>
          <div style="min-width:0;flex:1;">
            <h4 style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${g.name}
            </h4>
            <div style="font-size:11.5px;color:#64748B;font-weight:500;">
              ${g.members || '1.2k members'}
            </div>
          </div>
        </div>
        <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${isSelected ? '#EC5DAA' : '#CBD5E1'};display:flex;align-items:center;justify-content:center;background:${isSelected ? '#EC5DAA' : 'transparent'};color:white;font-size:12px;font-weight:600;flex-shrink:0;margin-left:10px;">
          ${isSelected ? '✓' : ''}
        </div>
      </div>
    `;
  }).join('');
};

window.selectPostGroup = function(groupId) {
  window.composerSelectedGroupId = groupId;
  window.closePostGroupPickerModal();

  // Save current text if typed
  const textarea = document.getElementById('create-post-text-input');
  const currentText = textarea ? textarea.value : '';

  // Re-render the composer with the selected group
  window.openCreatePostComposer(currentText);
};

/* --- Create Post Composer (Page 7 of PDF) --- */
window.openCreatePostComposer = function(savedText = '') {
  window.closeCareComposerChoice();

  let modal = document.getElementById('care-composer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'care-composer-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  const selectedGroup = window.composerSelectedGroupId 
    ? (window.MIROR_COMMUNITY_GROUPS || []).find(g => g.id === window.composerSelectedGroupId)
    : null;

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeCareComposerChoice()" style="opacity:1;pointer-events:auto;z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:901;border-radius:28px 28px 0 0;padding:24px 20px;max-height:85vh;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Top Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:17px;font-weight:600;color:#0F172A;margin:0;">Create Post</h3>
        <button onclick="window.closeCareComposerChoice()" style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;border:none;color:#64748B;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button>
      </div>

      <!-- Author Row + Mandatory Group Selector Trigger -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:42px;height:42px;border-radius:50%;overflow:hidden;border:1.5px solid #E2E8F0;flex-shrink:0;">
          <img src="profile_avatar.jpg" alt="Priya Menon" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div style="flex:1;">
          <div style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;color:#0F172A;line-height:1.2;">
            Priya Menon
          </div>
          
          <!-- Mandatory Group Picker Trigger -->
          <div onclick="window.openPostGroupPickerModal()" style="display:inline-flex;align-items:center;gap:6px;background:${selectedGroup ? '#FDF2F8' : '#FFF1F2'};border:1.5px solid ${selectedGroup ? '#FCE7F3' : '#FECDD3'};color:${selectedGroup ? '#BE185D' : '#E11D48'};padding:4px 10px;border-radius:14px;font-size:12px;font-weight:600;cursor:pointer;margin-top:3px;box-shadow:0 1px 4px rgba(0,0,0,0.03);">
            <span>${selectedGroup ? (selectedGroup.iconImg ? `<img src="${selectedGroup.iconImg}" style="width:13px;height:13px;border-radius:3px;vertical-align:-1px;">` : selectedGroup.icon) + ' Posting in ' + selectedGroup.name : '⚠️ Select Group (Mandatory) ▾'}</span>
            <span style="font-size:10px;opacity:0.8;">▼</span>
          </div>
        </div>
      </div>

      <!-- Textarea -->
      <textarea id="create-post-text-input" rows="5" placeholder="What do you want to talk about? Share an experience, recipe, or question with the community..." style="width:100%;box-sizing:border-box;border:none;outline:none;font-family:'Montserrat',sans-serif;font-size:14.5px;color:#0F172A;resize:none;line-height:1.5;margin-bottom:18px;">${savedText}</textarea>

      <!-- Add to your post buttons -->
      <div style="border-top:1px solid #F1F5F9;padding-top:14px;">
        <label style="display:block;font-size:12.5px;font-weight:600;color:#64748B;margin-bottom:10px;">Add to your post</label>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
          <button type="button" onclick="SM.toast('Photo / Video picker attached 📷')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:11px 6px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;color:#334155;cursor:pointer;">
            <span style="font-size:16px;">📷</span> Photo/Video
          </button>
          <button type="button" onclick="SM.toast('GIF library opened 🎞️')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:11px 6px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;color:#334155;cursor:pointer;">
            <span style="font-size:16px;">🎞️</span> GIF
          </button>
          <button type="button" onclick="SM.toast('Poll template added 📊')" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:11px 6px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;color:#334155;cursor:pointer;">
            <span style="font-size:16px;">📊</span> Poll
          </button>
        </div>
      </div>

      <!-- Primary Post CTA Button -->
      <button onclick="window.submitNewMemberPost()" style="width:100%;margin-top:16px;height:46px;border-radius:23px;background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;border:none;cursor:pointer;box-shadow:0 6px 18px rgba(122,63,209,0.32);display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease;">
        Post
      </button>

    </div>
  `;
};

window.submitNewMemberPost = function() {
  if (!window.composerSelectedGroupId) {
    SM.toast('⚠️ Mandatory: Please select a community group for your post!');
    window.openPostGroupPickerModal();
    return;
  }

  const textarea = document.getElementById('create-post-text-input');
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    SM.toast('Please write something before posting!');
    return;
  }

  const selectedGroup = (window.MIROR_COMMUNITY_GROUPS || []).find(g => g.id === window.composerSelectedGroupId) || { id: '30s-hormones', name: '30s Hormones & Fertility' };

  const newPost = {
    id: `care-post-${Date.now()}`,
    type: 'peanut',
    groupId: selectedGroup.id,
    groupName: selectedGroup.name,
    author: {
      name: 'Priya Menon',
      username: 'priya_menon',
      role: 'Member',
      roleClass: 'care-role-member',
      avatar: 'profile_avatar.jpg'
    },
    timestamp: 'Just now',
    title: text.length > 40 ? text.substring(0, 38) + '...' : '',
    caption: text,
    hashtags: ['#MirorCommunity', '#' + selectedGroup.name.replace(/[^a-zA-Z0-9]/g, '')],
    likes: 1,
    isLiked: false,
    commentsCount: 0,
    comments: [],
    isBookmarked: false,
    canShare: false,
    trending: true
  };

  window.MIROR_CARE_FEED.unshift(newPost);
  window.closeCareComposerChoice();
  window.composerSelectedGroupId = null;

  if (typeof SM !== 'undefined') {
    SM.render();
  }

  if (window.confetti) {
    window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }
  SM.toast(`🎉 Your post is live in ${selectedGroup.name}! ✨`);
};

/* --------------------------------------------------------------------------
   MIROR CIRCLE & CARE+ DUAL PARTITION DATA & STATE
   -------------------------------------------------------------------------- */
window.currentCommunityPartition = window.currentCommunityPartition || 'circle';
window.isMirorCarePlusSubscribed = window.isMirorCarePlusSubscribed || false;
window.currentCircleFilter = window.currentCircleFilter || 'all';
window.showCarePlusSubscriptionPreview = window.showCarePlusSubscriptionPreview || false;

window.MIROR_CIRCLE_CHATS = [
  {
    id: 'community-miror',
    groupId: 'mingle',
    title: 'Community@Miror',
    lastMessage: 'Doctor tips, meal plans & community discussions',
    subtext: 'Doctor tips, meal plans & community discussions',
    time: '12:45 PM',
    unreadCount: 13,
    unread: true,
    trending: true,
    avatarHtml: `<div style="width:48px;height:48px;border-radius:50%;background:#000000;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#FFFFFF;flex-shrink:0;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.12);">
      <span style="font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#EC5DAA;line-height:0.9;margin-top:2px;">1</span>
      <span style="font-family:'Montserrat',sans-serif;font-size:9.5px;font-weight:600;color:#FFFFFF;letter-spacing:-0.4px;line-height:1;">miror</span>
    </div>`
  },
  {
    id: 'pcos-support',
    groupId: '30s-hormones',
    title: 'PCOS Support Circle',
    lastMessage: 'Hormonal balance, nutrition tips & symptom tracking',
    subtext: 'Hormonal balance, nutrition tips & symptom tracking',
    time: 'Yesterday',
    unreadCount: 0,
    unread: false,
    trending: true,
    avatarHtml: `<div style="width:48px;height:48px;border-radius:50%;background:#FDF2F8;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #FCE7F3;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DB2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 11l-4-4-6 6a4 4 0 0 0 6 6l4-4"/>
        <path d="M6 13l4 4 6-6a4 4 0 0 0-6-6l-4 4"/>
      </svg>
    </div>`
  },
  {
    id: 'fertility-journey',
    groupId: '30s-hormones',
    title: 'Fertility Journey (Global)',
    lastMessage: 'Conception guide, doctor AMAs & peer advice',
    subtext: 'Conception guide, doctor AMAs & peer advice',
    time: 'Monday',
    unreadCount: 0,
    unread: false,
    trending: true,
    avatarHtml: `<div style="width:48px;height:48px;border-radius:50%;background:#FAF5FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #F3E8FF;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="3.5" fill="#9333EA"/>
        <path d="M8 12c0-2 2-3 4-3s4 1 4 3c0 3-1 7-4 7s-4-4-4-7z" fill="#EC5DAA"/>
        <circle cx="12" cy="14" r="2" fill="#FAF5FF"/>
      </svg>
    </div>`
  },
  {
    id: 'postpartum-recovery',
    groupId: 'postpartum-moms',
    title: 'Postpartum Recovery',
    lastMessage: 'Pelvic floor health, recovery & daily yoga flows',
    subtext: 'Pelvic floor health, recovery & daily yoga flows',
    time: 'Nov 12',
    unreadCount: 1,
    unread: true,
    trending: false,
    avatarHtml: `<div style="width:48px;height:48px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #DBEAFE;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="6" r="3"/>
        <path d="M4 18c0-3 3-5 5-5s5 2 5 5"/>
        <circle cx="17" cy="11" r="2.2" fill="#EC5DAA" stroke="none"/>
        <path d="M15 17c0-2 2-3 3.5-3"/>
      </svg>
    </div>`
  },
  {
    id: 'new-mom-connect',
    groupId: 'postpartum-moms',
    title: 'New Mom Connect',
    lastMessage: 'Safe space for first-year moms & baby sleep routines',
    subtext: 'Safe space for first-year moms & baby sleep routines',
    time: 'Nov 10',
    unreadCount: 0,
    unread: false,
    trending: true,
    avatarHtml: `<div style="width:48px;height:48px;border-radius:50%;background:#FEF3C7;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #FDE68A;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="7" r="3"/>
        <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/>
        <circle cx="17" cy="10" r="2" fill="#EC5DAA" stroke="none"/>
      </svg>
    </div>`
  }
];

window.MIROR_DISCOVER_CIRCLES = [
  {
    id: 'fitness-journey',
    groupId: 'fit',
    title: 'Miror Fitness Journey',
    members: '600 members',
    img: 'story_shalini_mobility.jpg',
    joined: false
  },
  {
    id: 'nourish',
    groupId: 'nourish',
    title: 'Miror Nourish',
    members: '500 members',
    img: 'story_shreya_salad.jpg',
    joined: false
  },
  {
    id: 'mingle-circle',
    groupId: 'mingle',
    title: 'Miror Mingle circle',
    members: '250 members',
    img: 'icon_miror_mingle.jpg',
    joined: false
  },
  {
    id: 'book-lovers',
    groupId: 'books',
    title: 'Book Lovers',
    members: '300 members',
    img: 'icon_book_lovers.png',
    joined: false
  },
  {
    id: 'miror-beauty',
    groupId: 'beautie',
    title: 'Miror Beauty',
    members: '230 members',
    img: 'icon_miror_beautie.jpg',
    joined: false
  }
];

window.toggleJoinCircle = function(circleId, event) {
  if (event) event.stopPropagation();
  const c = window.MIROR_DISCOVER_CIRCLES.find(x => x.id === circleId);
  if (!c) return;
  c.joined = !c.joined;
  if (c.joined) {
    if (window.confetti) {
      window.confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }
    SM.toast(`🎉 You joined ${c.title}!`);
  } else {
    SM.toast(`Left ${c.title}`);
  }
  const container = document.getElementById('circle-chats-list-container');
  if (container) {
    container.innerHTML = window.renderCircleChatsList();
  }
};

window.switchCommunityPartition = function(partitionKey) {
  const fab = document.getElementById('care-fab-btn');
  if (fab) {
    fab.style.display = 'none';
  }

  // If user clicks Miror Care+ tab in Community, navigate directly to Care+ tab
  if (partitionKey === 'care-plus') {
    if (typeof SM !== 'undefined' && SM.switchTab) {
      SM.switchTab('care-plus');
      return;
    }
  }

  window.currentCommunityPartition = 'circle';

  // If switching to circle from another tab, switch tab to community
  if (typeof AppState !== 'undefined' && AppState.currentTab !== 'community') {
    if (typeof SM !== 'undefined' && SM.switchTab) {
      SM.switchTab('community');
      return;
    }
  }

  // Hide Care+ Floating Dock when on circle / community
  if (typeof window.updateCareFloatingDockVisibility === 'function') {
    window.updateCareFloatingDockVisibility('community');
  }

  SM.render();
};

window.filterCircleChats = function(filterKey, btn) {
  window.currentCircleFilter = filterKey;
  const chips = document.querySelectorAll('.circle-filter-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const listContainer = document.getElementById('circle-chats-list-container');
  if (listContainer) {
    listContainer.innerHTML = window.renderCircleChatsList();
  }
};

window.joinMirorCarePlus = function() {
  window.isMirorCarePlusSubscribed = true;
  window.showCarePlusSubscriptionPreview = false;
  
  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }
  SM.toast('🎉 Unlocked! All doctor answers & clinical protocols are now visible.');
  
  // Hide floating paywall dock immediately
  const dock = document.getElementById('care-floating-dock-container');
  if (dock) {
    dock.style.display = 'none';
    dock.innerHTML = '';
  }

  // Re-render active screen so user immediately sees all answers unlocked
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

window.toggleCarePlusSubscriptionPreview = function() {
  window.showCarePlusSubscriptionPreview = !window.showCarePlusSubscriptionPreview;
  if (typeof window.updateCareFloatingDockVisibility === 'function') {
    window.updateCareFloatingDockVisibility('care-plus');
  }
  SM.render();
};

/* --- Render Chat List for Miror Circle --- */
window.renderCircleChatsList = function() {
  let list = window.MIROR_CIRCLE_CHATS;
  if (window.currentCircleFilter === 'unread') {
    list = list.filter(c => c.unreadCount > 0);
  } else if (window.currentCircleFilter === 'trending') {
    list = list.filter(c => c.trending);
  }

  const showDiscover = window.currentCircleFilter === 'all';

  return `
    <!-- Top Active / Joined Group Chat Rows -->
    <div style="background:#FFFFFF;">
      ${list.map(c => `
        <div class="circle-chat-row" data-action="push" data-screen="community-group" data-group-id="${c.groupId}" style="display:flex;align-items:center;gap:14px;padding:14px 20px;background:#FFFFFF;cursor:pointer;border-bottom:1px solid #F1F5F9;transition:background 0.15s ease;" onmouseover="this.style.background='#FAF5FF'" onmouseout="this.style.background='#FFFFFF'">
          <div style="width:48px;height:48px;flex-shrink:0;">
            ${c.avatarHtml}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
              <h4 style="font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;color:#0F172A;margin:0;letter-spacing:-0.2px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${c.title}
              </h4>
              <span style="font-family:'Inter',sans-serif;font-size:12px;color:#94A3B8;font-weight:500;flex-shrink:0;">
                ${c.time}
              </span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <p style="font-family:'Inter',sans-serif;font-size:13px;color:#64748B;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:400;line-height:1.35;">
                ${c.subtext || c.lastMessage}
              </p>
              ${c.unreadCount > 0 ? `
                <span class="circle-unread-pill" style="min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(122,63,209,0.3);">
                  ${c.unreadCount}
                </span>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    ${showDiscover ? `
      <!-- Section Header: GROUPS YOU CAN JOIN (Matching Home Page Section Hierarchy) -->
      <div style="font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;color:#64748B;letter-spacing:0.8px;padding:18px 20px 8px;background:#FFFFFF;text-transform:uppercase;">
        GROUPS YOU CAN JOIN
      </div>

      <!-- Discoverable Group Rows -->
      <div style="background:#FFFFFF;">
        ${window.MIROR_DISCOVER_CIRCLES.map(d => `
          <div class="circle-discover-row" data-action="push" data-screen="community-group" data-group-id="${d.groupId}" style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 20px;background:#FFFFFF;cursor:pointer;border-bottom:1px solid #F1F5F9;transition:background 0.15s ease;" onmouseover="this.style.background='#FAF5FF'" onmouseout="this.style.background='#FFFFFF'">
            <div style="display:flex;align-items:center;gap:14px;min-width:0;flex:1;">
              <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#F1F5F9;border:1px solid rgba(0,0,0,0.06);">
                <img src="${d.img}" alt="${d.title}" style="width:100%;height:100%;object-fit:cover;display:block;">
              </div>
              <div style="min-width:0;flex:1;">
                <h4 style="font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;color:#0F172A;margin:0 0 3px;letter-spacing:-0.2px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${d.title}
                </h4>
                <div style="font-family:'Inter',sans-serif;font-size:13px;color:#94A3B8;font-weight:500;">
                  ${d.members}
                </div>
              </div>
            </div>
            <button onclick="window.toggleJoinCircle('${d.id}', event)" style="border:none;background:${d.joined ? '#F1F5F9' : 'linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)'};color:${d.joined ? '#16A34A' : '#FFFFFF'};font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;padding:7px 20px;border-radius:20px;cursor:pointer;flex-shrink:0;box-shadow:${d.joined ? 'none' : '0 4px 14px rgba(122,63,209,0.28)'};transition:all 0.2s ease;">
              ${d.joined ? 'Joined ✓' : 'Join'}
            </button>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
};

/* --- Render Miror Circle Tab Partition --- */
window.renderMirorCirclePartition = function() {
  return `
    <div style="background:#FFFFFF;padding-bottom:140px;">
      <!-- Group Chat Rows & Discover Sections -->
      <div id="circle-chats-list-container">
        ${window.renderCircleChatsList()}
      </div>
    </div>
  `;
};

/* --- Interactive Minimalist Plan Selection & Timer State --- */
window.currentCareBilling = window.currentCareBilling || 'yearly';

window.renderCareFloatingDockContent = function() {
  const isYearly = window.currentCareBilling === 'yearly';
  return `
    <div class="care-dock-plans">
      <!-- Monthly Option -->
      <div id="care-dock-plan-monthly" class="care-dock-plan-card ${!isYearly ? 'selected' : ''}" onclick="window.selectMinimalPlan('monthly')">
        <div class="care-dock-plan-header">
          <span class="care-dock-plan-title">Monthly</span>
          <div id="care-dock-radio-monthly" class="care-dock-radio" style="${!isYearly ? 'background:#16A34A;border-color:#16A34A;' : ''}">
            ${!isYearly ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
        </div>
        <div class="care-dock-plan-price">
          ₹399 <span>/month</span>
        </div>
        <div style="font-size:9.5px;color:#94A3B8;font-weight:600;margin-top:2px;">
          Billed monthly
        </div>
      </div>

      <!-- Yearly Option (Selected by Default - Best Value) -->
      <div id="care-dock-plan-yearly" class="care-dock-plan-card ${isYearly ? 'selected' : ''}" onclick="window.selectMinimalPlan('yearly')">
        <div class="care-dock-plan-header">
          <span class="care-dock-plan-title">
            Yearly <span class="care-dock-discount-pill">-60%</span>
          </span>
          <div id="care-dock-radio-yearly" class="care-dock-radio" style="${isYearly ? 'background:#16A34A;border-color:#16A34A;' : ''}">
            ${isYearly ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
        </div>
        <div class="care-dock-plan-price">
          ₹249 <span>/mo</span>
        </div>
        <div style="font-size:9.5px;color:#7A3FD1;font-weight:600;margin-top:2px;">
          ₹2,999 / year
        </div>
      </div>
    </div>

    <!-- High-Converting Primary Gradient CTA Button -->
    <button id="care-dock-cta-btn" class="care-dock-cta-btn" onclick="window.joinMirorCarePlus()">
      ${isYearly ? 'Join Yearly • Save 60% 🚀' : 'Join Monthly (₹399/mo) 🚀'}
    </button>

    <!-- Trust Links -->
    <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:8px;font-size:10px;color:#94A3B8;">
      <span style="color:#64748B;cursor:pointer;font-weight:500;" onclick="SM.toast('Subscription Restored')">Restore subscription</span>
      <span>•</span>
      <span style="color:#64748B;cursor:pointer;font-weight:500;" onclick="SM.toast('Privacy Policy')">Privacy Policy</span>
      <span>•</span>
      <span style="color:#64748B;cursor:pointer;font-weight:500;" onclick="SM.toast('Terms of Service')">Terms of Service</span>
    </div>
  `;
};

window.updateCareFloatingDockVisibility = function(targetScreen) {
  const dock = document.getElementById('care-floating-dock-container');
  if (!dock) return;
  dock.style.display = 'none';
  dock.innerHTML = '';
};

window.selectMinimalPlan = function(planKey) {
  window.currentCareBilling = planKey;
  const yearlyCard = document.getElementById('care-dock-plan-yearly');
  const monthlyCard = document.getElementById('care-dock-plan-monthly');
  const yearlyRadio = document.getElementById('care-dock-radio-yearly');
  const monthlyRadio = document.getElementById('care-dock-radio-monthly');
  const ctaBtn = document.getElementById('care-dock-cta-btn');

  if (yearlyCard && monthlyCard) {
    if (planKey === 'yearly') {
      yearlyCard.classList.add('selected');
      monthlyCard.classList.remove('selected');
      if (yearlyRadio) {
        yearlyRadio.style.background = '#16A34A';
        yearlyRadio.style.borderColor = '#16A34A';
        yearlyRadio.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      }
      if (monthlyRadio) {
        monthlyRadio.style.background = '#FFFFFF';
        monthlyRadio.style.borderColor = '#CBD5E1';
        monthlyRadio.innerHTML = '';
      }
    } else {
      monthlyCard.classList.add('selected');
      yearlyCard.classList.remove('selected');
      if (monthlyRadio) {
        monthlyRadio.style.background = '#16A34A';
        monthlyRadio.style.borderColor = '#16A34A';
        monthlyRadio.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      }
      if (yearlyRadio) {
        yearlyRadio.style.background = '#FFFFFF';
        yearlyRadio.style.borderColor = '#CBD5E1';
        yearlyRadio.innerHTML = '';
      }
    }
  }

  if (ctaBtn) {
    ctaBtn.textContent = planKey === 'yearly' ? 'Join Yearly • Save 60% 🚀' : 'Join Monthly (₹399/mo) 🚀';
  }
};

// Live Urgency Countdown Timer
if (!window._careTimerInterval) {
  window._careTimerSeconds = 12 * 3600 + 45 * 60 + 18;
  window._careTimerInterval = setInterval(() => {
    if (window._careTimerSeconds > 0) {
      window._careTimerSeconds--;
      const hrs = Math.floor(window._careTimerSeconds / 3600);
      const mins = Math.floor((window._careTimerSeconds % 3600) / 60);
      const secs = window._careTimerSeconds % 60;
      const hEl = document.getElementById('care-timer-h');
      const mEl = document.getElementById('care-timer-m');
      const sEl = document.getElementById('care-timer-s');
      if (hEl) hEl.textContent = hrs < 10 ? '0' + hrs : hrs;
      if (mEl) mEl.textContent = mins < 10 ? '0' + mins : mins;
      if (sEl) sEl.textContent = secs < 10 ? '0' + secs : secs;
    }
  }, 1000);
}

/* --- Render Minimalist Miror Care+ Subscription Screen --- */
window.renderMirorCarePlusSubscriptionScreen = function(options = {}) {
  return `
    <div style="min-height:100%;background:linear-gradient(180deg, #FFF7FB 0%, #FAF5FF 30%, #FFFFFF 100%);font-family:'Montserrat',sans-serif;padding-bottom:230px;position:relative;">
      
      <!-- Minimalist Hero Header Section (Clean & Direct) -->
      <div style="text-align:left;padding:24px 20px 14px;">
        <h1 style="font-family:'Montserrat',sans-serif;font-size:28px;font-weight:600;color:#0F172A;margin:0 0 8px;line-height:1.18;letter-spacing:-0.5px;">
          Unlock<br>
          <span style="background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Miror care+</span>
        </h1>

        <p style="font-size:12.5px;color:#475569;line-height:1.5;margin:0 0 18px;font-weight:500;">
          Comprehensive medical guidance, report reviews, masterclasses & member perks built for your hormonal health.
        </p>

        <!-- Clean Feature Checklist (Matching Reference Layout) -->
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:18px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:20px;height:20px;border-radius:50%;background:#F0FDF4;color:#16A34A;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;margin-top:1px;">✓</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:#0F172A;line-height:1.3;">Unlimited doctor support</div>
              <div style="font-size:11.5px;color:#64748B;">Direct 1-on-1 chats with certified women's health doctors</div>
            </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:20px;height:20px;border-radius:50%;background:#F0FDF4;color:#16A34A;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;margin-top:1px;">✓</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:#0F172A;line-height:1.3;">Medical report & scan reviews</div>
              <div style="font-size:11.5px;color:#64748B;">Fast specialist interpretation for bloodwork, DEXA & ultrasound</div>
            </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:20px;height:20px;border-radius:50%;background:#F0FDF4;color:#16A34A;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;margin-top:1px;">✓</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:#0F172A;line-height:1.3;">Exclusive expert masterclasses</div>
              <div style="font-size:11.5px;color:#64748B;">Live clinical sessions with menopause & hormone specialists</div>
            </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:20px;height:20px;border-radius:50%;background:#F0FDF4;color:#16A34A;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;margin-top:1px;">✓</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:#0F172A;line-height:1.3;">Partner benefits included</div>
              <div style="font-size:11.5px;color:#64748B;">Swiggy One, Spotify, Tata 1mg & 10% off Miror supplements</div>
            </div>
          </div>
        </div>

        <!-- Limited Time Offer Urgency Ticker -->
        <div style="background:linear-gradient(135deg, #FFF5F9 0%, #FAF5FF 100%);border:1.5px solid #F472B6;border-radius:16px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:13px;">🔥</span>
            <span style="font-size:11px;font-weight:600;color:#BE185D;letter-spacing:0.3px;">LIMITED TIME OFFER</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <div class="care-timer-unit">
              <div id="care-timer-h" class="care-timer-val">12</div>
              <div class="care-timer-lbl">Hrs</div>
            </div>
            <span style="color:#7A3FD1;font-weight:600;font-size:12px;">:</span>
            <div class="care-timer-unit">
              <div id="care-timer-m" class="care-timer-val">45</div>
              <div class="care-timer-lbl">Min</div>
            </div>
            <span style="color:#7A3FD1;font-weight:600;font-size:12px;">:</span>
            <div class="care-timer-unit">
              <div id="care-timer-s" class="care-timer-val">18</div>
              <div class="care-timer-lbl">Sec</div>
            </div>
          </div>
        </div>

        <!-- Section: Included Partner Perks -->
        <div style="background:#FFFFFF;border:1.5px solid #F3E8FF;border-radius:18px;padding:12px 14px;margin-bottom:12px;">
          <div style="font-size:12px;font-weight:600;color:#0F172A;margin-bottom:8px;">Included Partner Perks</div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
            <div style="border:1px solid #F3E8FF;border-radius:10px;padding:6px 2px;text-align:center;background:#FAF5FF;">
              <div style="font-size:15px;">🛍️</div>
              <div style="font-size:10.5px;font-weight:600;color:#0F172A;">Swiggy One</div>
            </div>
            <div style="border:1px solid #F3E8FF;border-radius:10px;padding:6px 2px;text-align:center;background:#FAF5FF;">
              <div style="font-size:15px;">🎵</div>
              <div style="font-size:10.5px;font-weight:600;color:#0F172A;">Spotify</div>
            </div>
            <div style="border:1px solid #F3E8FF;border-radius:10px;padding:6px 2px;text-align:center;background:#FAF5FF;">
              <div style="font-size:15px;">💊</div>
              <div style="font-size:10.5px;font-weight:600;color:#0F172A;">Tata 1mg</div>
            </div>
          </div>
        </div>

        <!-- Section: Clinical Masterclass Preview -->
        <div style="background:#FFFFFF;border:1.5px solid #F3E8FF;border-radius:18px;padding:12px 14px;margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:10.5px;font-weight:600;color:#EC5DAA;">Upcoming Clinical Masterclass</span>
            <span style="font-size:10.5px;color:#64748B;">12 Aug • 8 PM</span>
          </div>
          <div style="font-size:13.5px;font-weight:600;color:#0F172A;">The truth about HRT after 40</div>
          <div style="font-size:11.5px;color:#64748B;">with Dr. Louise Newson</div>
        </div>

        <!-- Section: Member Discounts (Care+ Savings) -->
        <div style="background:#FFFFFF;border:1.5px solid #E2E8F0;border-radius:22px;padding:16px 14px;margin-bottom:18px;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
          
          <!-- Header: Title + Care+ Savings Pill Badge -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0;letter-spacing:-0.2px;">
              Member discounts
            </h4>
            <span style="background:#E0F2FE;color:#0284C7;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;padding:3px 10px;border-radius:12px;letter-spacing:0.2px;">
              Care+ savings
            </span>
          </div>

          <!-- Card 1: Miror Supplements -->
          <div style="background:#FFFFFF;border:1.5px solid #F1F5F9;border-radius:16px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.02);">
            <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
              <!-- 10% Off Badge Icon -->
              <div style="width:46px;height:44px;border-radius:12px;background:#F0F9FF;border:1px solid #BAE6FD;color:#0369A1;font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;flex-shrink:0;">
                <span>10%</span>
                <span style="font-size:9.5px;font-weight:600;letter-spacing:0.2px;">off</span>
              </div>
              <div style="min-width:0;flex:1;">
                <div style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;line-height:1.25;">
                  Miror Supplements
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:11.5px;color:#64748B;margin-top:2px;font-weight:400;">
                  Applied automatically at checkout
                </div>
              </div>
            </div>
            <div style="color:#94A3B8;display:flex;align-items:center;margin-left:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          <!-- Card 2: HRT Programme -->
          <div style="background:#FFFFFF;border:1.5px solid #F1F5F9;border-radius:16px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.02);">
            <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
              <!-- 10% Off Badge Icon -->
              <div style="width:46px;height:44px;border-radius:12px;background:#F0F9FF;border:1px solid #BAE6FD;color:#0369A1;font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;flex-shrink:0;">
                <span>10%</span>
                <span style="font-size:9.5px;font-weight:600;letter-spacing:0.2px;">off</span>
              </div>
              <div style="min-width:0;flex:1;">
                <div style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;line-height:1.25;">
                  HRT Programme
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:11.5px;color:#64748B;margin-top:2px;font-weight:400;">
                  Ongoing, for as long as you're a member
                </div>
              </div>
            </div>
            <div style="color:#94A3B8;display:flex;align-items:center;margin-left:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          <!-- Card 3: Included Programmes & Additional Discounts (Grouped) -->
          <div style="background:#FFFFFF;border:1.5px solid #F1F5F9;border-radius:16px;padding:14px;box-shadow:0 1px 4px rgba(0,0,0,0.02);">
            
            <!-- Row 3A: 3 health programmes included every year -->
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:40px;height:40px;border-radius:12px;background:#F0F9FF;border:1px solid #E0F2FE;color:#0284C7;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z"/>
                </svg>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;line-height:1.3;">
                  3 health programmes included every year
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:11.5px;color:#64748B;margin-top:3px;line-height:1.4;font-weight:400;">
                  Choose any 3 eligible Miror health programmes at no additional cost
                </div>
              </div>
            </div>

            <!-- Subtle Inner Divider -->
            <div style="border-bottom:1px solid #F1F5F9;margin:12px 0;"></div>

            <!-- Row 3B: Additional programme discounts -->
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="width:40px;height:40px;border-radius:12px;background:#F0F9FF;border:1px solid #E0F2FE;color:#0284C7;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19"></line>
                  <circle cx="6.5" cy="6.5" r="2.5"></circle>
                  <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;line-height:1.3;">
                  Additional programme discounts
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-size:11.5px;color:#64748B;margin-top:3px;line-height:1.4;font-weight:400;">
                  Member pricing available on all other Miror health programmes
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  `;
};

/* --------------------------------------------------------------------------
   PEANUT-INSPIRED 4-TAB COMMUNITY DASHBOARD (FOR YOU, TRENDING, ASK DOCTOR, GROUPS)
   -------------------------------------------------------------------------- */
window.currentCommunityTab = window.currentCommunityTab || 'for-you';
window.joinedGroupIds = window.joinedGroupIds || ['30s-hormones', 'mingle', 'calm-collective', '50-menopause', 'postpartum-moms', 'nourish'];
window.communitySearchQuery = '';

window.switchCommunityTab = function(tabName) {
  window.currentCommunityTab = tabName;
  const container = document.getElementById('community-tab-content-container');
  if (container) {
    container.innerHTML = window.renderCommunityActiveTab(tabName);
  } else {
    SM.render();
  }
  
  // Update active state on tab buttons
  document.querySelectorAll('.community-top-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`community-tab-btn-${tabName}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update FAB visibility & text dynamically
  if (typeof window.updateCommunityFabState === 'function') {
    window.updateCommunityFabState(tabName);
  }
};

window.toggleJoinGroup = function(groupId, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  window.joinedGroupIds = window.joinedGroupIds || [];
  const idx = window.joinedGroupIds.indexOf(groupId);
  const grp = (window.MIROR_COMMUNITY_GROUPS || []).find(g => g.id === groupId);
  const grpName = grp ? grp.name : 'Group';
  
  if (idx >= 0) {
    window.joinedGroupIds.splice(idx, 1);
    SM.toast(`Left ${grpName}`);
  } else {
    window.joinedGroupIds.push(groupId);
    SM.toast(`Joined ${grpName}! Relevant posts added to For You feed 🎉`);
  }
  
  const container = document.getElementById('community-tab-content-container');
  if (container) {
    container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab);
  }
};

window.submitCommunityInlineReply = function(postId, inputEl) {
  if (!inputEl) return;
  const text = inputEl.value ? inputEl.value.trim() : '';
  if (!text) {
    SM.toast('Please write a reply');
    return;
  }
  const post = (window.MIROR_CARE_FEED || []).find(p => p.id === postId);
  if (post) {
    post.comments = post.comments || [];
    post.comments.push({
      author: 'You',
      avatar: '👩🏻',
      text: text,
      time: 'Just now'
    });
    post.commentsCount = (post.commentsCount || post.comments.length) + 1;
    SM.toast('Reply posted! ✨');
    inputEl.value = '';
    const container = document.getElementById('community-tab-content-container');
    if (container) {
      container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab);
    }
  }
};

window.expandedComments = window.expandedComments || {};

window.togglePostComments = function(postId) {
  window.expandedComments[postId] = !window.expandedComments[postId];
  const commentsWrap = document.getElementById(`comments-wrap-${postId}`);
  const toggleLink = document.getElementById(`view-comments-toggle-${postId}`);
  const post = (window.MIROR_CARE_FEED || []).find(p => p.id === postId);
  
  if (commentsWrap && toggleLink && post) {
    if (window.expandedComments[postId]) {
      commentsWrap.style.display = 'block';
      toggleLink.innerText = 'Hide comments';
    } else {
      commentsWrap.style.display = 'none';
      const cCount = (post.comments ? post.comments.length : 0) + (post.commentsCount || 0);
      toggleLink.innerText = `View all ${cCount} comments`;
    }
  } else {
    const container = document.getElementById('community-tab-content-container') || document.getElementById('care-feed-container');
    if (container && typeof window.renderCommunityActiveTab === 'function') {
      container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab || 'for-you');
    }
  }
};

window.toggleCareBookmark = function(postId) {
  const post = (window.MIROR_CARE_FEED || []).find(p => p.id === postId);
  if (!post) return;
  post.isBookmarked = !post.isBookmarked;
  SM.toast(post.isBookmarked ? '🔖 Saved to your bookmarks' : 'Removed from bookmarks');
  
  const container = document.getElementById('community-tab-content-container') || document.getElementById('care-feed-container');
  if (container && typeof window.renderCommunityActiveTab === 'function') {
    container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab || 'for-you');
  }
};

window.toggleCommunityLike = function(postId, btn) {
  const post = (window.MIROR_CARE_FEED || []).find(p => p.id === postId);
  if (!post) return;
  post.isLiked = !post.isLiked;
  post.likes = (post.likes || 0) + (post.isLiked ? 1 : -1);
  if (post.likes < 0) post.likes = 0;
  
  const container = document.getElementById('community-tab-content-container') || document.getElementById('care-feed-container');
  if (container && typeof window.renderCommunityActiveTab === 'function') {
    container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab || 'for-you');
  }
};

window.openCommunityFilterModal = function() {
  SM.toast('Showing all active joined groups');
};

window.searchCommunityContent = function(query) {
  window.communitySearchQuery = (query || '').toLowerCase().trim();
  const container = document.getElementById('community-tab-content-container');
  if (container) {
    container.innerHTML = window.renderCommunityActiveTab(window.currentCommunityTab);
  }
};

window.toggleCommunitySearchBar = function() {
  const bar = document.getElementById('community-expandable-search');
  if (!bar) return;
  if (bar.style.display === 'none' || !bar.style.display) {
    bar.style.display = 'block';
    const inp = document.getElementById('community-header-search-input');
    if (inp) inp.focus();
  } else {
    bar.style.display = 'none';
    window.searchCommunityContent('');
  }
};

/* --------------------------------------------------------------------------
   IMAGE CAROUSEL COMPONENT WITH SWIPE & SLIDE DOTS
   -------------------------------------------------------------------------- */
window.renderImageCarousel = function(postId, photos) {
  if (!photos || photos.length === 0) return '';

  if (photos.length === 1) {
    return `
      <div style="position:relative;width:100%;height:300px;border-radius:16px;overflow:hidden;background:#F8FAFC;margin:4px 0 12px;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <img src="${photos[0]}" alt="Post image" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">
      </div>
    `;
  }

  const carouselId = `carousel-${postId}`;
  const total = photos.length;

  return `
    <div style="position:relative;width:100%;margin:4px 0 12px;" class="post-carousel-container">
      
      <!-- Slide Badge Indicator (e.g. 1/3) -->
      <div id="${carouselId}-badge" style="position:absolute;top:10px;right:12px;z-index:10;background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;letter-spacing:0.3px;pointer-events:none;">
        1/${total}
      </div>

      <!-- Horizontal Scroll Track -->
      <div id="${carouselId}" class="post-carousel-track" onscroll="window.handleCarouselScroll('${carouselId}', ${total})" style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;border-radius:16px;height:300px;background:#F8FAFC;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        ${photos.map((src, idx) => `
          <div style="flex:0 0 100%;width:100%;height:100%;scroll-snap-align:start;scroll-snap-stop:always;position:relative;">
            <img src="${src}" alt="Photo ${idx + 1}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">
          </div>
        `).join('')}
      </div>

      <!-- Navigation Arrows -->
      <button onclick="window.scrollCarouselSlide('${carouselId}', -1)" style="position:absolute;top:50%;left:8px;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.88);backdrop-filter:blur(4px);border:none;display:flex;align-items:center;justify-content:center;color:#0F172A;font-size:14px;font-weight:600;cursor:pointer;z-index:10;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
        ‹
      </button>
      <button onclick="window.scrollCarouselSlide('${carouselId}', 1)" style="position:absolute;top:50%;right:8px;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.88);backdrop-filter:blur(4px);border:none;display:flex;align-items:center;justify-content:center;color:#0F172A;font-size:14px;font-weight:600;cursor:pointer;z-index:10;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
        ›
      </button>

      <!-- Pagination Dots (Bottom Center) -->
      <div id="${carouselId}-dots" style="position:absolute;bottom:10px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:5px;z-index:10;pointer-events:none;">
        ${photos.map((_, idx) => `
          <span class="carousel-dot" id="${carouselId}-dot-${idx}" style="width:${idx === 0 ? '7px' : '5px'};height:${idx === 0 ? '7px' : '5px'};border-radius:50%;background:${idx === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.55)'};transition:all 0.2s ease;box-shadow:0 1px 2px rgba(0,0,0,0.25);"></span>
        `).join('')}
      </div>

    </div>
  `;
};

window.scrollCarouselSlide = function(carouselId, direction) {
  const el = document.getElementById(carouselId);
  if (!el) return;
  const slideWidth = el.offsetWidth;
  el.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
};

window.handleCarouselScroll = function(carouselId, total) {
  const el = document.getElementById(carouselId);
  if (!el) return;
  const slideWidth = el.offsetWidth;
  const current = Math.round(el.scrollLeft / slideWidth) + 1;
  const safeCurrent = Math.max(1, Math.min(total, current));
  
  const badge = document.getElementById(`${carouselId}-badge`);
  if (badge) badge.innerText = `${safeCurrent}/${total}`;

  for (let i = 0; i < total; i++) {
    const dot = document.getElementById(`${carouselId}-dot-${i}`);
    if (dot) {
      if (i === safeCurrent - 1) {
        dot.style.background = '#FFFFFF';
        dot.style.width = '7px';
        dot.style.height = '7px';
      } else {
        dot.style.background = 'rgba(255,255,255,0.55)';
        dot.style.width = '5px';
        dot.style.height = '5px';
      }
    }
  }
};

/* --- Refined Post Footer (Action Bar, Liked By, Comments on Icon Click Only) --- */
window.renderSocialPostFooter = function(item) {
  const isLiked = item.isLiked || false;
  const likesCount = item.likes || 0;
  const isBookmarked = item.isBookmarked || false;
  const comments = item.comments || [];
  const commentsCount = item.commentsCount !== undefined ? item.commentsCount : comments.length;
  const isExpanded = window.expandedComments && window.expandedComments[item.id];
  
  // Liked by user
  const likedByUser = item.likedBy || (item.id === 'care-text-1' ? 'meera_rao' : item.id === 'care-1' ? 'sunita_p' : 'meera_rao');

  return `
    <div class="social-post-footer-exact" style="padding:4px 16px 14px;">
      
      <!-- Action Bar (Thin stroke-width 1.6 SVG Icons) -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:18px;">
          
          <!-- Heart / Like (Thin Stroke) -->
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="window.toggleCommunityLike('${item.id}', this)" title="Like">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${isLiked ? '#ED4956' : 'none'}" stroke="${isLiked ? '#ED4956' : '#1E293B'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.15s ease;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;" class="peanut-like-count">${likesCount}</span>
          </div>

          <!-- Comment Bubble (Thin Stroke - Clicking reveals/toggles comments section) -->
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="window.togglePostComments('${item.id}')" title="Comments">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E293B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;">${commentsCount}</span>
          </div>

          <!-- Share Icon (3-Node Connected Share) -->
          <div style="cursor:pointer;display:flex;align-items:center;" onclick="SM.toast('Link copied to clipboard ↗')" title="Share">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1E293B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>
        </div>

        <!-- Bookmark Ribbon (Thin Stroke) -->
        <div style="cursor:pointer;display:flex;align-items:center;" onclick="window.toggleCareBookmark('${item.id}')" title="Save post">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="${isBookmarked ? '#0F172A' : 'none'}" stroke="#1E293B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>

      <!-- Liked by line -->
      <div style="font-size:13px;color:#0F172A;margin-bottom:6px;font-weight:400;">
        Liked by <strong style="font-weight:600;color:#0F172A;">${likedByUser}</strong> and <strong style="font-weight:600;color:#0F172A;">others</strong>
      </div>

      <!-- Collapsible Comments List & Inline Reply Input (ONLY visible after clicking comment icon) -->
      <div id="comments-wrap-${item.id}" style="display:${isExpanded ? 'block' : 'none'};margin-top:10px;animation:fadeIn 0.2s ease;">
        <!-- Comments List -->
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
          ${comments.map(c => `
            <div style="background:#F8FAFC;border-radius:12px;padding:8px 12px;font-size:12.5px;color:#334155;display:flex;align-items:flex-start;gap:8px;">
              <span style="font-weight:600;color:#0F172A;white-space:nowrap;">${c.author}:</span>
              <span style="flex:1;color:#475569;line-height:1.4;font-weight:400;">${c.text}</span>
            </div>
          `).join('')}
        </div>

        <!-- Inline Reply Field -->
        <div class="peanut-reply-box" style="margin-top:6px;">
          <div style="width:26px;height:26px;border-radius:50%;background:#FDF2F8;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;border:1px solid #FCE7F3;">👩🏻</div>
          <input type="text" class="peanut-reply-input" id="reply-input-${item.id}" placeholder="Add a reply..." onkeydown="if(event.key==='Enter') window.submitCommunityInlineReply('${item.id}', this)">
          <button class="peanut-reply-send-btn" onclick="window.submitCommunityInlineReply('${item.id}', document.getElementById('reply-input-${item.id}'))">Post</button>
        </div>
      </div>

    </div>
  `;
};

/* --- Master Community Active Tab Router --- */
window.renderCommunityActiveTab = function(activeTab) {
  if (activeTab === 'for-you') {
    return window.renderCommunityForYouTab();
  } else if (activeTab === 'trending') {
    return window.renderCommunityTrendingTab();
  } else if (activeTab === 'ask-doctor') {
    return window.renderCommunityAskDoctorTab();
  } else if (activeTab === 'groups') {
    return window.renderCommunityGroupsTab();
  } else if (activeTab === 'ask-miror') {
    return window.renderCommunityAskMirorTab();
  }
  return window.renderCommunityForYouTab();
};

/* --- Tab 5: Ask Miror Contextual Care Route Tab --- */
window.renderCommunityAskMirorTab = function() {
  return `
    <div style="background:#FAF9FB; min-height:70vh; padding: 16px 20px 100px; display:flex; flex-direction:column; gap:16px;">
      
      <!-- Ask Miror Hero Banner -->
      <div class="card" style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 1.5px solid #FCE7F3; border-radius: 24px; padding: 22px 20px; box-shadow: 0 8px 24px rgba(236,93,170,0.08);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <div style="width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg, #F7B6D2 0%, #EC5DAA 40%, #B14AC8 75%, #7A3FD1 100%); display:flex; align-items:center; justify-content:center; font-size:22px; color:white; box-shadow:0 4px 14px rgba(122,63,209,0.3); flex-shrink:0;">
            💬
          </div>
          <div>
            <div style="font-size:10.5px; font-weight:800; letter-spacing:1px; color:#EC5DAA; text-transform:uppercase; font-family:'Montserrat',sans-serif;">CONTEXTUAL CARE ROUTE</div>
            <h3 style="font-family:'Montserrat',sans-serif; font-size:20px; font-weight:800; color:#0F172A; margin:0; letter-spacing:-0.4px;">Ask Miror Privately</h3>
          </div>
        </div>
        <p style="font-family:'Montserrat',sans-serif; font-size:13.5px; color:#475569; margin:0 0 18px; line-height:1.5;">
          When a public community thread raises questions specific to your medical history, route it directly to Miror’s health team for 1:1 confidential guidance.
        </p>

        <button onclick="window.openConfidentialQuestionFlow()" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; width:100%; height:50px; border-radius:25px; border:none; font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:700; box-shadow:0 6px 20px rgba(122,63,209,0.28); cursor:pointer;">
          Ask a Confidential Question ✨
        </button>
      </div>

      <!-- Section Title -->
      <div style="font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.8px; color:#EC5DAA; text-transform:uppercase; margin-top:8px; margin-bottom:12px;">
        RECENT DOCTOR CHATS
      </div>

      <!-- Chat Box Row 1: Dr. Anjali Sharma -->
      <div class="card card-interactive" onclick="window.openDoctor1on1ChatWithContext('I saw the group discussion on 3 AM night wakes. Is HRT safe for me given my thyroid history?', 'Dr. Anjali Sharma', 'Based on your thyroid panel & health profile, HRT can be safely structured with bioidentical progesterone. I have saved detailed notes to your Care Vault.', 'feed_dr_anjali.jpg')" style="background:#FFFFFF; border:1px solid #F1F5F9; border-radius:20px; padding:14px 16px; box-shadow:0 4px 16px rgba(40,30,70,0.03); cursor:pointer; display:flex; align-items:center; gap:14px; margin-bottom:10px; transition:transform 0.15s ease;">
        <!-- Doctor Avatar with Online Status -->
        <div style="position:relative; flex-shrink:0;">
          <img src="feed_dr_anjali.jpg" onerror="this.onerror=null;this.src='profile_avatar.jpg';" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:1.5px solid #FCE7F3; display:block;">
          <span style="position:absolute; bottom:1px; right:1px; width:11px; height:11px; border-radius:50%; background:#10B981; border:2px solid #FFFFFF;"></span>
        </div>
        <!-- Chat Details (Middle Column) -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
            <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              Dr. Anjali Sharma
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:600; color:#94A3B8; flex-shrink:0;">
              2h ago
            </div>
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#64748B; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            Click to open 1:1 confidential chat
          </div>
        </div>
        <!-- Right Chevron Arrow -->
        <div style="font-size:18px; color:#CBD5E1; font-weight:600; flex-shrink:0; margin-left:4px;">
          ›
        </div>
      </div>

      <!-- Chat Box Row 2: Dr. Sarah Jenkins -->
      <div class="card card-interactive" onclick="window.openDoctor1on1ChatWithContext('Can I safely combine Magnesium Glycinate with my daily prescription supplements?', 'Dr. Sarah Jenkins', 'Yes, Magnesium Glycinate (200-400mg) pairs well with your nightly routine. Take it 30 mins before sleep.', 'story_sarah_doctor.jpg')" style="background:#FFFFFF; border:1px solid #F1F5F9; border-radius:20px; padding:14px 16px; box-shadow:0 4px 16px rgba(40,30,70,0.03); cursor:pointer; display:flex; align-items:center; gap:14px; margin-bottom:10px; transition:transform 0.15s ease;">
        <!-- Doctor Avatar with Online Status -->
        <div style="position:relative; flex-shrink:0;">
          <img src="story_sarah_doctor.jpg" onerror="this.onerror=null;this.src='profile_avatar.jpg';" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:1.5px solid #FCE7F3; display:block;">
          <span style="position:absolute; bottom:1px; right:1px; width:11px; height:11px; border-radius:50%; background:#10B981; border:2px solid #FFFFFF;"></span>
        </div>
        <!-- Chat Details (Middle Column) -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
            <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              Dr. Sarah Jenkins
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:600; color:#94A3B8; flex-shrink:0;">
              Yesterday
            </div>
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#64748B; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            Click to open 1:1 confidential chat
          </div>
        </div>
        <!-- Right Chevron Arrow -->
        <div style="font-size:18px; color:#CBD5E1; font-weight:600; flex-shrink:0; margin-left:4px;">
          ›
        </div>
      </div>

      <!-- Chat Box Row 3: Dr. Elena Rostova -->
      <div class="card card-interactive" onclick="window.openDoctor1on1ChatWithContext('What tests should I request from my endocrinologist for midlife memory lapses?', 'Dr. Elena Rostova', 'I have prepared a complete lab panel checklist including Thyroid, B12, Vitamin D & Hormonal markers.', 'article_sleep_cat.png')" style="background:#FFFFFF; border:1px solid #F1F5F9; border-radius:20px; padding:14px 16px; box-shadow:0 4px 16px rgba(40,30,70,0.03); cursor:pointer; display:flex; align-items:center; gap:14px; margin-bottom:10px; transition:transform 0.15s ease;">
        <!-- Doctor Avatar with Online Status -->
        <div style="position:relative; flex-shrink:0;">
          <img src="article_sleep_cat.png" onerror="this.onerror=null;this.src='profile_avatar.jpg';" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:1.5px solid #FCE7F3; display:block;">
          <span style="position:absolute; bottom:1px; right:1px; width:11px; height:11px; border-radius:50%; background:#10B981; border:2px solid #FFFFFF;"></span>
        </div>
        <!-- Chat Details (Middle Column) -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
            <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              Dr. Elena Rostova
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:600; color:#94A3B8; flex-shrink:0;">
              3 days ago
            </div>
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#64748B; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            Click to open 1:1 confidential chat
          </div>
        </div>
        <!-- Right Chevron Arrow -->
        <div style="font-size:18px; color:#CBD5E1; font-weight:600; flex-shrink:0; margin-left:4px;">
          ›
        </div>
      </div>

    </div>
  `;
};

/* --- Community Groups Horizontal Tray Component for For You Tab --- */
window.renderWellnessStoriesTray = function() {
  const joined = window.joinedGroupIds || ['beautie', 'bloom'];

  const groups = [
    { id: 'beautie', name: 'Beautie', icon: '✨', iconImg: 'icon_miror_beautie.jpg', bg: '#FFFBEB' },
    { id: 'bloom', name: 'Miror Bloom', icon: '🌸', iconImg: 'icon_bloom.jpg', bg: '#FDF2F8' },
    { id: 'mingle', name: 'Miror@Mingle', icon: '🪷', iconImg: 'icon_miror_mingle.jpg', bg: '#FAF5FF' },
    { id: 'fit', name: 'Miror Fit', icon: '🧘‍♀️', iconImg: 'icon_morning_reset.jpg', bg: '#FDF2F8' },
    { id: 'detox', name: '21-Day Detox', icon: '🍵', iconImg: 'icon_detox_21.jpg', bg: '#ECFDF5' },
    { id: 'books', name: 'Book Lovers', icon: '📚', iconImg: 'icon_book_lovers.png', bg: '#EFF6FF' },
    { id: '30s-hormones', name: 'Hormones', icon: '🌸', iconImg: null, bg: '#FDF2F8' },
    { id: 'postpartum-moms', name: 'Postpartum', icon: '🤱', iconImg: null, bg: '#FAF5FF' },
    { id: 'calm-collective', name: 'Calm Collective', icon: '🧘', iconImg: null, bg: '#F0FDF4' },
    { id: '50-menopause', name: '50+ Menopause', icon: '🌺', iconImg: null, bg: '#EFF6FF' }
  ];

  return `
    <div class="scroll-h" style="padding: 14px 20px; gap: 16px; background: #FFFFFF; border-bottom: 1px solid #F1F5F9; margin-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none; display: flex; align-items: flex-start; overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-padding-left: 20px;">
      ${groups.map((g, idx) => {
        const isJoined = idx < 2 || (window.joinedGroupIds && window.joinedGroupIds.includes(g.id));
        const iconHtml = g.iconImg 
          ? `<img src="${g.iconImg}" alt="${g.name}" style="width:100%;height:100%;object-fit:cover;display:block;">`
          : `<span style="font-size:26px;">${g.icon}</span>`;

        return `
          <div onclick="SM.navigate('community-group', { groupId: '${g.id}' })" style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;flex-shrink:0;">
            <div style="position:relative;width:65px;height:65px;">
              <div style="padding:2.5px;background:linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #8B5CF6 100%);border-radius:50%;box-shadow:0 3px 10px rgba(236,72,153,0.22);width:100%;height:100%;box-sizing:border-box;">
                <div style="background:${g.bg || '#FFFFFF'};width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #FFFFFF;box-sizing:border-box;">
                  ${iconHtml}
                </div>
              </div>
              ${!isJoined ? `
                <div onclick="window.toggleJoinGroup('${g.id}', event)" style="position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);border:2.5px solid #FFFFFF;display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-size:14px;font-weight:700;box-shadow:0 3px 8px rgba(236,72,153,0.35);z-index:2;" title="Join ${g.name}">
                  +
                </div>
              ` : ''}
            </div>
            <span style="font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;color:#0F172A;letter-spacing:-0.2px;margin-top:2px;text-align:center;max-width:72px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${g.name}
            </span>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

/* --- Groups You Might Like Discovery Module Component --- */
window.renderGroupsYouMightLikeTray = function() {
  const allGroups = window.MIROR_COMMUNITY_GROUPS || [];
  const joined = window.joinedGroupIds || [];

  // Filter groups not yet joined by user
  let recommended = allGroups.filter(g => !joined.includes(g.id));

  // Fallback to top curated groups if all joined or list is small
  if (recommended.length === 0) {
    recommended = allGroups;
  }

  // Limit to top 6 recommended cards
  const displayGroups = recommended.slice(0, 6);

  return `
    <!-- Groups You Might Like Discovery Module -->
    <div style="margin: 16px 0 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin: 0 16px 10px; padding: 0 2px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0; letter-spacing: -0.2px;">
          Groups you might like
        </h3>
        <button onclick="window.switchCommunityTab('groups')" style="border: none; background: none; color: #EC4899; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; padding: 0;">
          See all &rarr;
        </button>
      </div>

      <!-- Horizontal Carousel (peek 2-2.5 cards on mobile) -->
      <div style="display: flex; gap: 12px; overflow-x: auto; padding: 4px 16px 12px; scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;">
        ${displayGroups.map(g => {
          const isJoined = joined.includes(g.id);
          const iconContent = g.iconImg 
            ? `<img src="${g.iconImg}" alt="${g.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : `<span style="font-size: 24px;">${g.icon || '🌸'}</span>`;

          const cleanSub = (g.sub || '').replace('General ', '').replace('Hormones & fertility', 'Hormones');
          const categoryText = `${cleanSub} · ${g.members || '1.2k members'}`;

          return `
            <div onclick="SM.navigate('community-group', { groupId: '${g.id}' })" style="width: 210px; min-width: 210px; background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 45%, #EFF6FF 100%); border-radius: 20px; border: 1px solid rgba(243, 232, 255, 0.9); padding: 14px; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02); display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease;" onmouseover="this.style.boxShadow='0 14px 34px rgba(15, 23, 42, 0.075)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 10px 28px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02)';this.style.transform='translateY(0)'">
              <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.9); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);">
                    ${iconContent}
                  </div>
                  <div style="overflow: hidden; flex: 1;">
                    <h4 style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 700; color: #0F172A; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${g.name}
                    </h4>
                    <div style="font-size: 11.5px; color: #64748B; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${categoryText}
                    </div>
                  </div>
                </div>
              </div>

              <button onclick="window.toggleJoinGroup('${g.id}', event)" style="width: 100%; background: ${isJoined ? 'rgba(255,255,255,0.9)' : '#FFFFFF'}; border: ${isJoined ? '1px solid #E2E8F0' : '1px solid #FCE7F3'}; color: ${isJoined ? '#0F172A' : '#7C3AED'}; border-radius: 9999px; padding: 7px 12px; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                ${isJoined ? '<span>Joined ✓</span>' : '<span>+ Join</span>'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

/* --- Tab 1: For You Tab (Doctor split carousels, discussions, member stories) --- */
window.renderCommunityForYouTab = function() {
  const query = window.communitySearchQuery || '';
  const joined = window.joinedGroupIds || [];
  
  let list = (window.MIROR_CARE_FEED || []).filter(item => {
    // Show posts from joined groups or general posts (including Ask Doctor posts)
    const inJoined = !item.groupId || joined.includes(item.groupId);
    if (!inJoined) return false;
    if (query) {
      const matchTitle = item.title && item.title.toLowerCase().includes(query);
      const matchBody = (item.body || item.caption || (item.question && item.question.body) || '').toLowerCase().includes(query);
      const matchAuthor = item.author && item.author.name.toLowerCase().includes(query);
      const matchGroup = item.groupName && item.groupName.toLowerCase().includes(query);
      return matchTitle || matchBody || matchAuthor || matchGroup;
    }
    return true;
  });

  const storiesTrayHtml = window.renderWellnessStoriesTray();

  if (list.length === 0) {
    return storiesTrayHtml + `
      <div style="text-align:center;padding:36px 20px;background:#FFF;border-radius:24px;border:1px solid #F1F5F9;margin:0 16px;">
        <div style="font-size:40px;margin-bottom:12px;">🌸</div>
        <h4 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:0 0 6px;">Your feed is quiet</h4>
        <p style="font-size:13px;color:#64748B;margin:0 0 16px;line-height:1.4;">Join community groups to see discussions and stories tailored for you!</p>
        <button onclick="window.switchCommunityTab('groups')" style="background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFF;border:none;border-radius:20px;padding:8px 20px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(225,29,72,0.25);">
          Explore Groups &rarr;
        </button>
      </div>
    `;
  }

  return storiesTrayHtml + list.map(item => window.renderCareFeedCard(item, { isForYou: true })).join('');
};

/* --- Tab 2: Twitter-style Trending Topics & Hashtags Feed --- */
window.MIROR_TRENDING_TOPICS = [
  { id: 't1', rank: 1, tag: '#Perimenopause101', category: "Trending in Women's Health", postCount: '18.4K', cat: 'hormones', summary: 'Top discussions & doctor protocols on early hormonal symptoms' },
  { id: 't2', rank: 2, tag: '#HRTJourney', category: 'Trending in Hormone Therapy', postCount: '14.2K', cat: 'hormones', summary: 'Member experiences with bio-identical progesterone and estrogen patches' },
  { id: 't3', rank: 3, tag: '#NightSweatsRelief', category: 'Trending in Symptoms', postCount: '9.8K', cat: 'symptoms', summary: 'Cooling bamboo sheets, evening routines, and clinical fixes' },
  { id: 't4', rank: 4, tag: '#GutHormoneAxis', category: 'Trending in Nutrition', postCount: '8.5K', cat: 'nutrition', summary: 'How microbiome health influences estrogen metabolism' },
  { id: 't5', rank: 5, tag: '#SleepRoutine', category: 'Trending in Mental Health', postCount: '7.9K', cat: 'mental-health', summary: 'Evening stretching, deep breathing, and insomnia hacks' },
  { id: 't6', rank: 6, tag: '#MagnesiumGlycinate', category: 'Trending in Supplements', postCount: '6.3K', cat: 'nutrition', summary: 'Why magnesium glycinate is the gold standard for perimenopause rest' },
  { id: 't7', rank: 7, tag: '#BrainFogHacks', category: 'Trending in Mental Health', postCount: '5.7K', cat: 'mental-health', summary: 'Nutrition, omega-3s, and cognitive focus routines' },
  { id: 't8', rank: 8, tag: '#StrengthTrainingAfter40', category: 'Trending in Fitness', postCount: '4.9K', cat: 'fitness', summary: 'Preserving lean muscle and bone density through perimenopause' },
  { id: 't9', rank: 9, tag: '#ThyroidVsPerimenopause', category: 'Trending in Clinical Desk', postCount: '4.1K', cat: 'hormones', summary: 'How to distinguish between thyroid fluctuations and estrogen decline' },
  { id: 't10', rank: 10, tag: '#PelvicFloorHealth', category: 'Trending in Fitness', postCount: '3.8K', cat: 'fitness', summary: 'Core strength, bladder health, and daily restorative exercises' },
  { id: 't11', rank: 11, tag: '#EstrogenDominance', category: 'Trending in Hormone Health', postCount: '3.2K', cat: 'hormones', summary: 'Recognizing luteal phase irregularities and managing symptoms' },
  { id: 't12', rank: 12, tag: '#MirorCommunity', category: 'Trending in Community', postCount: '2.9K', cat: 'hormones', summary: 'Safe, doctor-moderated open conversations and daily check-ins' }
];

window.communityTrendingActiveCat = window.communityTrendingActiveCat || 'all';
window.communityTrendingActiveTag = window.communityTrendingActiveTag || null;

window.clickCommunityHashtag = function(tag) {
  if (!tag) return;
  window.communityTrendingActiveTag = tag.startsWith('#') ? tag : `#${tag}`;
  window.switchCommunityTab('trending');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const appContainer = document.getElementById('app') || document.querySelector('.phone-frame') || document.querySelector('.screen-container');
  if (appContainer) {
    appContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.filterTrendingCategory = function(cat) {
  window.communityTrendingActiveCat = cat;
  window.communityTrendingActiveTag = null;
  const container = document.getElementById('community-tab-content-container') || document.getElementById('community-tab-content');
  if (container) {
    container.innerHTML = window.renderCommunityTrendingTab();
  }
};

window.exploreTrendingTag = function(tag) {
  window.communityTrendingActiveTag = tag.startsWith('#') ? tag : `#${tag}`;
  const container = document.getElementById('community-tab-content-container') || document.getElementById('community-tab-content');
  if (container) {
    container.innerHTML = window.renderCommunityTrendingTab();
  }
};

window.clearTrendingTag = function() {
  window.communityTrendingActiveTag = null;
  const container = document.getElementById('community-tab-content-container') || document.getElementById('community-tab-content');
  if (container) {
    container.innerHTML = window.renderCommunityTrendingTab();
  }
};

window.renderCommunityTrendingTab = function() {
  const topics = window.MIROR_TRENDING_TOPICS || [];
  const activeCat = window.communityTrendingActiveCat || 'all';
  const activeTag = window.communityTrendingActiveTag;

  // If a tag is selected, show Twitter-style filtered search feed
  if (activeTag) {
    const rawTag = activeTag.replace('#', '').toLowerCase().trim();
    const matchingPosts = (window.MIROR_CARE_FEED || []).filter(item => {
      const hashtags = item.hashtags || [];
      const matchTag = hashtags.some(h => {
        const cleanH = h.toLowerCase().replace('#', '').trim();
        return cleanH === rawTag || cleanH.includes(rawTag) || rawTag.includes(cleanH);
      });
      const textToSearch = ((item.title || '') + ' ' + (item.body || '') + ' ' + (item.caption || '') + ' ' + (item.groupName || '')).toLowerCase();
      const matchText = textToSearch.includes(rawTag);
      return matchTag || matchText;
    });

    return `
      <div>
        <!-- Twitter-like Header for Tag Exploration -->
        <div style="background:#FFFFFF;border-bottom:1px solid #F1F5F9;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;">
          <div style="display:flex;align-items:center;gap:10px;">
            <button onclick="window.clearTrendingTag()" style="border:1.5px solid #E9D5FF;background:#FAF5FF;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#7E22CE;font-size:16px;font-weight:600;" title="Back to Trends">
              ←
            </button>
            <div>
              <h3 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0;">
                ${activeTag}
              </h3>
              <div style="font-size:11.5px;color:#64748B;font-weight:500;">
                ${matchingPosts.length} post${matchingPosts.length === 1 ? '' : 's'} found
              </div>
            </div>
          </div>

          <button onclick="window.clearTrendingTag()" style="border:1.5px solid #E9D5FF;background:#FAF5FF;border-radius:16px;padding:5px 14px;font-size:12px;font-weight:600;color:#7E22CE;font-family:'Montserrat',sans-serif;cursor:pointer;">
            Clear ✕
          </button>
        </div>

        <div style="padding-top:4px;">
          ${matchingPosts.length > 0 ? matchingPosts.map(item => window.renderCareFeedCard(item)).join('') : `
            <div style="text-align:center;padding:40px 20px;background:#FFF;margin:16px;border-radius:24px;border:1px solid #F1F5F9;box-shadow:0 6px 20px rgba(15,23,42,0.035);">
              <div style="font-size:36px;margin-bottom:8px;">✨</div>
              <h4 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:0 0 6px;">Be the first to post in ${activeTag}!</h4>
              <p style="font-size:13px;color:#64748B;margin:0 0 16px;">Share your story or clinical insights with the community.</p>
              <button onclick="window.openCreatePostComposer()" style="background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;border:none;border-radius:22px;padding:10px 24px;font-weight:600;font-size:13.5px;font-family:'Montserrat',sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(122,63,209,0.3);">
                Create Post
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Filter topics by subcategory
  const filteredTopics = activeCat === 'all' 
    ? topics 
    : topics.filter(t => t.cat === activeCat);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'hormones', label: 'Hormones' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'mental-health', label: 'Mental Health' },
    { id: 'fitness', label: 'Fitness' }
  ];

  return `
    <div style="background:#FFFFFF;min-height:70vh;">
      
      <!-- Twitter-style Sub-navigation Tabs / Category Chips (Themed with Miror gradients & fonts) -->
      <div style="display:flex;align-items:center;gap:8px;padding:10px 16px 14px;overflow-x:auto;border-bottom:1px solid #F1F5F9;scrollbar-width:none;-webkit-overflow-scrolling:touch;background:#FFFFFF;">
        ${categories.map(c => {
          const isActive = activeCat === c.id;
          return `
            <button onclick="window.filterTrendingCategory('${c.id}')" style="flex-shrink:0;border:${isActive ? 'none' : '1.5px solid #E9D5FF'};border-radius:20px;padding:7px 16px;font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:${isActive ? '800' : '700'};background:${isActive ? 'linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FAF5FF'};color:${isActive ? '#FFFFFF' : '#7E22CE'};box-shadow:${isActive ? '0 3px 12px rgba(122,63,209,0.25)' : 'none'};cursor:pointer;transition:all 0.15s ease;">
              ${c.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Twitter-style Trending Topic Rows -->
      <div class="twitter-trending-container">
        ${filteredTopics.map((t, idx) => {
          return `
            <div class="twitter-trending-row" onclick="window.exploreTrendingTag('${t.tag}')" style="padding:14px 18px;border-bottom:1px solid #F1F5F9;cursor:pointer;display:flex;align-items:flex-start;justify-content:space-between;">
              
              <div style="flex:1;min-width:0;">
                <!-- Category / Rank line -->
                <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#64748B;font-weight:600;margin-bottom:3px;">
                  ${t.rank || idx + 1} · ${t.category}
                </div>

                <!-- Trending Hashtag Name (Bold Montserrat typography) -->
                <div style="font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;color:#0F172A;margin-bottom:3px;letter-spacing:-0.1px;line-height:1.3;">
                  ${t.tag}
                </div>

                <!-- Posts volume count -->
                <div style="font-size:12px;color:#64748B;font-weight:500;">
                  ${t.postCount} posts
                </div>
              </div>

              <!-- More options button (•••) -->
              <button onclick="event.stopPropagation();SM.toast('More options for ${t.tag}')" style="border:none;background:none;color:#94A3B8;font-size:18px;cursor:pointer;padding:4px 6px;line-height:1;border-radius:50%;margin-left:8px;" title="Options">
                •••
              </button>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
};

/* --------------------------------------------------------------------------
   EXPERT ANSWERS FEED DATASET & COMPONENT
   -------------------------------------------------------------------------- */
window.MIROR_EXPERT_ANSWERS = [
  {
    id: 'ea-sleep-1',
    topic: 'Sleep Issues',
    icon: '🌙',
    userQuestion: 'I keep waking up at 3:15 AM every single night with a racing heart. Is this normal during perimenopause?',
    askedBy: 'Ananya M., 44',
    timeAgo: '2 hours ago',
    doctorName: 'Dr. Anjali Sharma, MD',
    doctorRole: 'Reproductive Endocrinologist & Sleep Specialist',
    doctorAvatar: 'feed_dr_anjali.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Yes, sudden nighttime wakenings around 3 AM are very common. Estrogen drop triggers cortisol surges and slight temperature spikes during REM sleep cycles.',
    fullAnswer: `Waking up consistently between 2 AM and 4 AM is one of the classic hallmark signs of perimenopausal hormonal shift. 

Here is what is happening physiologically: Estrogen plays a vital role in regulating your core body temperature and cortisol rhythm. As estrogen fluctuates, your brain's hypothalamus perceives a slight shift in temperature, triggering a burst of adrenaline and cortisol to wake you up.

**Recommended Immediate Protocol:**
1. Keep room temperature between 65-68°F (18-20°C).
2. Take 200-300mg Magnesium Glycinate 45 minutes before bedtime.
3. Avoid checking the clock or phone screen if you wake up—instead, try a 4-7-8 breathing exercise in the dark.
4. Schedule a routine blood panel to check progesterone levels if night wakes persist.`,
    likes: 142,
    bookmarks: 89
  },
  {
    id: 'ea-hotflashes-1',
    topic: 'Hot Flashes',
    icon: '🌡️',
    userQuestion: 'How can I stop sudden daytime hot flashes without immediately jumping to full HRT prescription?',
    askedBy: 'Sunita R., 47',
    timeAgo: '5 hours ago',
    doctorName: 'Dr. Priya Mehta, MD',
    doctorRole: 'OB-GYN & Menopause Specialist',
    doctorAvatar: 'story_sarah_doctor.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Phytoestrogen-rich nutrition, black cohosh supplementation, and non-hormonal nerve modulators offer great non-pharmacological relief.',
    fullAnswer: `Hot flashes stem from a narrowed thermoregulatory zone in the hypothalamus. Small temperature fluctuations that wouldn't normally bother your body suddenly trigger intense flushing and sweating.

**Non-Hormonal Evidence-Based Approaches:**
- **Dietary Phytoestrogens:** Flaxseed powder (1-2 tbsp daily) and organic soy yields gentle natural plant compounds that bind softly to estrogen receptors.
- **Cooling Breathwork:** Paced respiration (slow, deep breaths at 6 breaths per minute) for 15 minutes when a flash begins can reduce severity by up to 50%.
- **Targeted Supplements:** Evening Primrose Oil (1000mg) and Vitamin E (400 IU) have shown clinical benefit in lowering flash frequency.`,
    likes: 198,
    bookmarks: 134
  },
  {
    id: 'ea-brainfog-1',
    topic: 'Brain Fog',
    icon: '🧠',
    userQuestion: 'I keep forgetting words in meetings and dropping tasks. Could perimenopause brain fog be the cause?',
    askedBy: 'Meera K., 42',
    timeAgo: 'Yesterday',
    doctorName: 'Dr. Anjali Sharma, MD',
    doctorRole: 'Reproductive Endocrinologist',
    doctorAvatar: 'feed_dr_anjali.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Estrogen receptors are heavily concentrated in the hippocampus—the brain center for memory and recall. Sudden dips cause transient brain fog.',
    fullAnswer: `It is completely normal to feel alarmed when experiencing cognitive lapses, but please rest assured this is extremely common and usually temporary.

Estrogen acts as a primary fuel source for brain glucose metabolism. When estrogen levels fluctuate sharply, your brain temporarily experiences energy dips, leading to word-finding difficulties, short-term memory lapses, and fatigue.

**Key Recovery Interventions:**
1. **Omega-3 Fatty Acids:** High-DHA fish oil or algal oil (1200mg daily) supports neuronal cell membrane fluidity.
2. **Creatine Monohydrate:** 3-5g daily has shown clinical promise for female brain energy metabolism during hormonal shifts.
3. **Prioritize Deep Rest:** Sleep consolidation directly restores hippocampal function.`,
    likes: 215,
    bookmarks: 176
  },
  {
    id: 'ea-mood-1',
    topic: 'Mood Changes',
    icon: '🧘‍♀️',
    userQuestion: 'Why am I suddenly feeling unexplainable irritability and emotional swings right before my period?',
    askedBy: 'Ritu V., 45',
    timeAgo: '1 day ago',
    doctorName: 'Dr. Kavita Nair',
    doctorRole: 'Integrative Women’s Health Specialist',
    doctorAvatar: 'story_sarah_doctor.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Progesterone is your brain’s natural calming hormone. During perimenopause, anovulatory cycles lead to progesterone deficiency and mood swings.',
    fullAnswer: `During normal cycles, progesterone produces a breakdown product called allopregnanolone, which acts on GABA receptors in the brain to create a feeling of calm and grounding.

In perimenopause, you may experience cycles where you don't ovulate (anovulatory cycles). Without ovulation, your body doesn't produce sufficient progesterone, leaving estrogen unopposed—leading to anxiety, irritability, and sudden emotional vulnerability.

**Soothing Protocols:**
- **Ashwagandha KSM-66 (300mg):** Helps balance the HPA stress axis and stabilizes cortisol.
- **L-Theanine (200mg):** Promotes alpha brain waves for calm focus without sedation.
- **Cycle-Aware Exercise:** Switch to gentle restorative yoga, walking, and light Pilates during the luteal phase.`,
    likes: 167,
    bookmarks: 112
  },
  {
    id: 'ea-energy-1',
    topic: 'Low Energy',
    icon: '⚡',
    userQuestion: 'I feel completely exhausted by 2 PM no matter how much caffeine I drink. How can I boost cellular energy?',
    askedBy: 'Deepa S., 43',
    timeAgo: '2 days ago',
    doctorName: 'Dr. Priya Mehta, MD',
    doctorRole: 'OB-GYN & Menopause Specialist',
    doctorAvatar: 'story_sarah_doctor.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Mid-afternoon energy crashes are tied to mitochondrial efficiency, thyroid shifts, and blood sugar spikes rather than pure sleep deficit.',
    fullAnswer: `Relying on afternoon caffeine often compounds exhaustion by triggering adrenal spikes followed by hard crashes.

**Mitochondrial & Energy Protocols:**
1. **CoQ10 (Ubiquinol 100mg):** Directly fuels cellular ATP production in mitochondria.
2. **Protein-First Lunch:** Ensure 25-30g of protein at lunch to prevent blood glucose spikes and subsequent insulin crashes.
3. **10-Minute Sunlight Walk:** Natural blue light exposure between 1 PM - 3 PM signals your circadian clock to sustain alertness without caffeine jitter.`,
    likes: 154,
    bookmarks: 98
  },
  {
    id: 'ea-periods-1',
    topic: 'Irregular Periods',
    icon: '🩸',
    userQuestion: 'My period was 2 weeks late last month, and now it came twice in 30 days. When should I get evaluated?',
    askedBy: 'Kavita B., 46',
    timeAgo: '3 days ago',
    doctorName: 'Dr. Anjali Sharma, MD',
    doctorRole: 'Reproductive Endocrinologist',
    doctorAvatar: 'feed_dr_anjali.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Cycle length variance of 7+ days is the clinical definition of early perimenopause transition. Here is when to track vs consult.',
    fullAnswer: `As ovarian follicle supply declines, follicle-stimulating hormone (FSH) fluctuates unpredictably. This creates shortened cycles (e.g. 21 days) alternating with skipped or extended cycles (e.g. 45 days).

**When to Track:**
Irregularity in timing and flow volume is expected during perimenopause.

**When to Consult a Doctor:**
- Heavy bleeding requiring pad change every 1-2 hours.
- Bleeding or spotting after intercourse.
- Periods lasting longer than 8 consecutive days.
- Severe pelvic cramping not relieved by standard care.`,
    likes: 230,
    bookmarks: 184
  },
  {
    id: 'ea-hormonal-1',
    topic: 'Hormonal Changes',
    icon: '🌸',
    userQuestion: 'What core hormone tests should I request from my gynaecologist to understand where I am in perimenopause?',
    askedBy: 'Pooja T., 41',
    timeAgo: '4 days ago',
    doctorName: 'Dr. Kavita Nair',
    doctorRole: 'Integrative Women’s Health Specialist',
    doctorAvatar: 'story_sarah_doctor.jpg',
    badgeText: 'Verified Clinical Answer',
    answerPreview: 'Key markers include Day 3 FSH, Estradiol, Serum Progesterone (Day 21), Thyroid Panel (TSH, Free T3/T4), and Ferritin levels.',
    fullAnswer: `Single spot hormone tests can fluctuate day-to-day during perimenopause, but a comprehensive panel evaluated alongside your symptom log provides clear insight.

**Essential Lab Panel Checklist:**
1. **FSH & Estradiol (Day 2-4 of cycle):** Evaluates ovarian reserve and estrogen output.
2. **Day 21 Progesterone:** Confirms whether ovulation occurred in that cycle.
3. **Full Thyroid Panel (TSH, Free T3, Free T4, TPO Antibodies):** Thyroid dysfunction closely mirrors perimenopause symptoms.
4. **Serum Ferritin & Vitamin D3:** Low iron storage causes fatigue and hair thinning often misattributed to hormones alone.`,
    likes: 289,
    bookmarks: 245
  }
];

window.expertAnswersFilter = window.expertAnswersFilter || 'all';

window.filterExpertAnswersTopic = function(topicId) {
  window.expertAnswersFilter = topicId;
  const container = document.getElementById('community-tab-content-container') || document.getElementById('community-tab-content');
  if (container) {
    container.innerHTML = window.renderCommunityAskDoctorTab();
  }
};

/* --- Tab 3: Expert Answers Tab --- */
window.renderCommunityAskDoctorTab = function() {
  const activeTopic = window.expertAnswersFilter || 'all';
  const answers = window.MIROR_EXPERT_ANSWERS || [];

  const filteredAnswers = activeTopic === 'all'
    ? answers
    : answers.filter(a => a.topic.toLowerCase().replace(/\s+/g, '') === activeTopic.replace(/\s+/g, '') || a.id.includes(activeTopic));

  const topics = [
    { id: 'all', label: 'All Topics' },
    { id: 'sleep', label: '🌙 Sleep Issues' },
    { id: 'hotflashes', label: '🌡️ Hot Flashes' },
    { id: 'brainfog', label: '🧠 Brain Fog' },
    { id: 'mood', label: '🧘‍♀️ Mood Changes' },
    { id: 'energy', label: '⚡ Low Energy' },
    { id: 'periods', label: '🩸 Irregular Periods' },
    { id: 'hormonal', label: '🌸 Hormonal Changes' }
  ];

  return `
    <div style="background:#FAF9FB; min-height:75vh; padding: 12px 16px 120px; display:flex; flex-direction:column; gap:16px;">
      
      <!-- Top Banner: Trust & Community Guidance -->
      <div class="card" style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 1.5px solid #FCE7F3; border-radius: 22px; padding: 18px 16px; box-shadow: 0 6px 20px rgba(236,93,170,0.06); display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="flex:1;">
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #EC5DAA; text-transform: uppercase; font-family:'Montserrat',sans-serif; margin-bottom: 3px;">VERIFIED CLINICAL Q&A</div>
          <h3 style="font-family:'Montserrat',sans-serif; font-size: 16.5px; font-weight: 800; color: #0F172A; margin: 0 0 4px;">Expert Answers from Miror Doctors</h3>
          <p style="font-family:'Montserrat',sans-serif; font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.4;">Real community questions answered by certified gynecologists and endocrinologists.</p>
        </div>
        <button onclick="window.openAskDoctorComposer ? window.openAskDoctorComposer() : SM.toast('Opening Ask Doctor...')" class="card-interactive" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; border: none; border-radius: 20px; padding: 10px 16px; font-family:'Montserrat',sans-serif; font-size: 12.5px; font-weight: 700; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 14px rgba(122,63,209,0.25);">
          Ask a Doctor ✍️
        </button>
      </div>

      <!-- Horizontal Topic Filter Strip -->
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
        ${topics.map(t => {
          const isActive = activeTopic === t.id;
          return `
            <button onclick="window.filterExpertAnswersTopic('${t.id}')" style="flex-shrink:0; border:${isActive ? 'none' : '1.5px solid #F1F5F9'}; border-radius:18px; padding:7px 14px; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:${isActive ? '800' : '700'}; background:${isActive ? 'linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; color:${isActive ? '#FFFFFF' : '#64748B'}; box-shadow:${isActive ? '0 3px 12px rgba(122,63,209,0.25)' : '0 2px 6px rgba(0,0,0,0.02)'}; cursor:pointer; transition:all 0.15s ease;">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Feed of Expert Answer Cards -->
      <div style="display:flex; flex-direction:column; gap:14px;">
        ${filteredAnswers.map(item => `
          <div class="card card-interactive" style="background:#FFFFFF; border:1px solid #F1F5F9; border-radius:22px; padding:18px; box-shadow:0 6px 20px rgba(40,30,70,0.035); transition:transform 0.15s ease, box-shadow 0.15s ease;" onclick="window.openExpertAnswerModal('${item.id}')">
            
            <!-- Card Header: Topic Chip + Time -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
              <span style="background:#FFF0F6; border:1px solid #FCE7F3; color:#EC5DAA; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; padding:3px 10px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;">
                ${item.icon} ${item.topic}
              </span>
              <span style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#94A3B8; font-weight:600;">
                ${item.timeAgo}
              </span>
            </div>

            <!-- User Question -->
            <h4 style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; color:#0F172A; margin:0 0 6px; line-height:1.4; letter-spacing:-0.2px;">
              “${item.userQuestion}”
            </h4>
            <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#64748B; font-weight:600; margin-bottom:14px;">
              Asked by ${item.askedBy}
            </div>

            <!-- Divider line -->
            <div style="height:1px; background:#F8FAFC; margin-bottom:14px;"></div>

            <!-- Expert Doctor Box -->
            <div style="background:#FAF5FF; border:1px solid #F3E8FF; border-radius:18px; padding:16px; margin-bottom:16px;">
              
              <!-- Structured Header: Avatar + Info + Badge -->
              <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                
                <!-- Left: Avatar + Doctor Info -->
                <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                  <div style="width:42px; height:42px; border-radius:50%; overflow:hidden; background:#FFFFFF; border:2px solid #FCE7F3; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <img src="${item.doctorAvatar}" alt="${item.doctorName}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null;this.src='feed_dr_anjali.jpg';">
                  </div>
                  <div style="flex:1; min-width:0;">
                    <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:800; color:#0F172A; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${item.doctorName}
                    </div>
                    <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#64748B; font-weight:600; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${item.doctorRole}
                    </div>
                  </div>
                </div>

                <!-- Right: Expert Answer Badge -->
                <span style="font-family:'Montserrat',sans-serif; font-size:10px; font-weight:800; color:#059669; background:#ECFDF5; border:1px solid #A7F3D0; padding:4px 10px; border-radius:12px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0; display:inline-flex; align-items:center; gap:3px;">
                  ✓ Expert Answer
                </span>
              </div>

              <!-- Answer Preview Text (Aligned to same left margin as doctor info) -->
              <div style="padding-left:54px;">
                <p style="font-family:'Montserrat',sans-serif; font-size:13px; color:#334155; margin:0; line-height:1.55; font-weight:500;">
                  ${item.answerPreview}
                </p>
              </div>

            </div>

            <!-- Footer: Read Answer CTA & Social Signals -->
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:12px; font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B; font-weight:600;">
                <span>❤️ ${item.likes} helpful</span>
                <span>📌 ${item.bookmarks} saved</span>
              </div>

              <div style="font-family:'Montserrat',sans-serif; font-size:13px; font-weight:800; color:#EC5DAA; display:flex; align-items:center; gap:3px;">
                Read Answer <span style="font-size:14px; transition:transform 0.15s ease;">→</span>
              </div>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
};

window.openExpertAnswerModal = function(answerId) {
  const item = (window.MIROR_EXPERT_ANSWERS || []).find(a => a.id === answerId);
  if (!item) return;

  let modal = document.getElementById('expert-answer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'expert-answer-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeExpertAnswerModal()" style="opacity:1; pointer-events:auto; z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:901; border-radius:28px 28px 0 0; padding:24px 20px; max-height:88vh;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Top Navigation Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <span style="background:#FFF0F6; border:1px solid #FCE7F3; color:#EC5DAA; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:14px;">
          ${item.icon} ${item.topic}
        </span>
        <button onclick="window.closeExpertAnswerModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:32px; height:32px; font-size:16px; color:#64748B; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
      </div>

      <div style="overflow-y:auto; max-height:72vh; padding-right:2px;">
        
        <!-- User Question Banner -->
        <div style="background:#FAF5FF; border:1px solid #F3E8FF; border-radius:20px; padding:18px; margin-bottom:20px;">
          <div style="font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.8px; color:#7E22CE; text-transform:uppercase; margin-bottom:4px;">
            COMMUNITY QUESTION
          </div>
          <h3 style="font-family:'Montserrat',sans-serif; font-size:16.5px; font-weight:800; color:#0F172A; margin:0 0 6px; line-height:1.4;">
            “${item.userQuestion}”
          </h3>
          <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B; font-weight:600;">
            Asked by ${item.askedBy} • ${item.timeAgo}
          </div>
        </div>

        <!-- Doctor Profile Card -->
        <div style="display:flex; align-items:center; justify-content:space-between; background:#FFFFFF; border:1px solid #F1F5F9; border-radius:18px; padding:14px; margin-bottom:18px; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; border:2px solid #FCE7F3; flex-shrink:0;">
              <img src="${item.doctorAvatar}" alt="${item.doctorName}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null;this.src='feed_dr_anjali.jpg';">
            </div>
            <div>
              <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:700; color:#0F172A;">
                ${item.doctorName}
              </div>
              <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#64748B;">
                ${item.doctorRole}
              </div>
            </div>
          </div>
          <span style="font-family:'Montserrat',sans-serif; font-size:10px; font-weight:800; color:#059669; background:#ECFDF5; border:1px solid #A7F3D0; padding:4px 10px; border-radius:12px; text-transform:uppercase;">
            Verified Doctor
          </span>
        </div>

        <!-- Detailed Clinical Answer Content -->
        <div style="font-family:'Montserrat',sans-serif; font-size:14px; color:#334155; line-height:1.6; whitespace:pre-line; margin-bottom:24px;">
          ${item.fullAnswer.replace(/\n\n/g, '<br><br>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0F172A;">$1</strong>')}
        </div>

        <!-- Interactive Action Bar -->
        <div style="display:flex; gap:12px; border-top:1px solid #F1F5F9; padding-top:16px;">
          <button onclick="SM.toast('Marked as helpful ❤️'); item.likes++; this.innerHTML='❤️ Useful (' + item.likes + ')';" style="flex:1; background:#FFF0F6; border:1px solid #FCE7F3; color:#EC5DAA; border-radius:20px; height:46px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; cursor:pointer;">
            ❤️ Useful (${item.likes})
          </button>
          <button onclick="SM.toast('Saved to your Health Vault 📌')" style="flex:1; background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:white; border:none; border-radius:20px; height:46px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(122,63,209,0.25);">
            📌 Save to Care Vault
          </button>
        </div>

      </div>

    </div>
  `;
};

window.closeExpertAnswerModal = function() {
  const modal = document.getElementById('expert-answer-modal');
  if (modal) modal.innerHTML = '';
};

/* --- Tab 4: Groups Tab (Groups List with Join Toggle) --- */
window.renderCommunityGroupsTab = function() {
  const groups = window.MIROR_COMMUNITY_GROUPS || [];
  const joined = window.joinedGroupIds || [];

  return `
    <div style="padding-top:2px;">
      ${groups.map(g => {
        const isJoined = joined.includes(g.id);
        return `
          <div class="peanut-group-row-card" onclick="SM.show('community-group', { id: '${g.id}' })" style="cursor:pointer;">
            <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
              <div class="peanut-group-cover-thumb" style="background:${g.bg || '#FAF5FF'};">
                ${g.iconImg ? `<img src="${g.iconImg}" style="width:100%;height:100%;object-fit:cover;">` : g.icon}
              </div>
              <div style="min-width:0;flex:1;">
                <h4 style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;margin:0 0 3px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${g.name}
                </h4>
                <div style="font-size:11.5px;color:#64748B;font-weight:500;">
                  ${g.members || '1.2k members'}
                </div>
              </div>
            </div>
            <button class="peanut-group-join-btn ${isJoined ? 'joined' : ''}" onclick="window.toggleJoinGroup('${g.id}', event)">
              ${isJoined ? 'Joined ✓' : 'Join'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

/* --- Top Community Screen Registration --- */
SM.register('community', () => {
  const activeTab = window.currentCommunityTab || 'for-you';

  return `
  <!-- Clean Community Top Navigation Bar (Themed with Homepage Blur & Palette) -->
  <div class="home-header-sticky screen-fixed-header" style="background:#FFFFFF;border-bottom:1px solid #F1F5F9;box-shadow:0 1px 4px rgba(0,0,0,0.02);">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px 6px;">
      
      <!-- Left: Header Title -->
      <h1 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.4px;color:#0F172A;margin:0;">
        Community
      </h1>

      <!-- Right: Search Icon -->
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="btn-icon" onclick="window.toggleCommunitySearchBar()" style="width:36px;height:36px;min-width:36px;min-height:36px;max-width:36px;max-height:36px;aspect-ratio:1/1;flex-shrink:0;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#0F172A;transition:all 0.15s ease;" title="Search" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Expandable Search Input -->
    <div id="community-expandable-search" style="display:none;padding:2px 16px 12px;animation:fadeIn 0.2s ease;">
      <div style="display:flex;align-items:center;gap:10px;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:24px;padding:0 14px;height:42px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="community-header-search-input" placeholder="Search posts, doctors, groups..." oninput="window.searchCommunityContent(this.value)" style="border:none;outline:none;flex:1;font-size:13.5px;background:transparent;color:#0F172A;font-family:'Montserrat',sans-serif;font-weight:500;">
        <button onclick="window.toggleCommunitySearchBar()" style="border:none;background:none;color:#94A3B8;font-size:15px;cursor:pointer;padding:4px;">✕</button>
      </div>
    </div>

    <!-- Sticky Sub-Navigation Bar matching requirements -->
    <div class="community-top-tabs-bar" style="background:#FFFFFF;display:flex;overflow-x:auto;padding:0 12px;border-bottom:1px solid #F1F5F9;scrollbar-width:none;">
      <button id="community-tab-btn-for-you" class="community-top-tab-btn ${activeTab === 'for-you' ? 'active' : ''}" onclick="window.switchCommunityTab('for-you')">
        For You
      </button>
      <button id="community-tab-btn-groups" class="community-top-tab-btn ${activeTab === 'groups' ? 'active' : ''}" onclick="window.switchCommunityTab('groups')">
        Groups
      </button>
      <button id="community-tab-btn-trending" class="community-top-tab-btn ${activeTab === 'trending' ? 'active' : ''}" onclick="window.switchCommunityTab('trending')">
        Trending
      </button>
      <button id="community-tab-btn-ask-doctor" class="community-top-tab-btn ${activeTab === 'ask-doctor' ? 'active' : ''}" onclick="window.switchCommunityTab('ask-doctor')">
        Expert Answers
      </button>
      <button id="community-tab-btn-ask-miror" class="community-top-tab-btn ${activeTab === 'ask-miror' ? 'active' : ''}" onclick="window.switchCommunityTab('ask-miror')">
        Ask Miror 💬
      </button>
    </div>
  </div>

  <!-- Active Tab Dynamic Content Container -->
  <div id="community-tab-content-container" style="padding-top:14px;padding-bottom:140px;background:#FFFFFF;">
    <!-- Ask Miror Banner Card inside Community -->
    <div style="padding:0 20px 14px;">
      <div class="card card-interactive" style="background:linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);border:1px solid #E9D5FF;border-radius:20px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 4px 16px rgba(126,34,206,0.06);" onclick="SM.switchTab('care-plus')">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:20px;color:#7E22CE;box-shadow:0 2px 8px rgba(0,0,0,0.04);">💬</div>
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:0.8px;color:#7E22CE;text-transform:uppercase;font-family:'Montserrat',sans-serif;">ASK MIROR</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:700;color:#0F172A;">Have a question about your health?</div>
            <div style="font-size:12px;color:#64748B;">Get guidance from our health team</div>
          </div>
        </div>
        <button style="background:#7E22CE;color:white;border:none;border-radius:18px;padding:8px 14px;font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;flex-shrink:0;">
          Ask Now
        </button>
      </div>
    </div>

    ${window.renderCommunityActiveTab(activeTab)}
  </div>
  `;
});

/* --------------------------------------------------------------------------
   MIROR CARE+ — VECTOR SVG ICON SYSTEM
   -------------------------------------------------------------------------- */
const CARE_SVGS = {
  stethoscope: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  clipboardCheck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 13 11 15 15 11"/></svg>`,
  videoWebinar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="3" ry="3"/></svg>`,
  giftPerks: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  sparkle: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  flame: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`,
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  users: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  trophy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>`,
  checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  share: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
  lock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  lotus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-9 9c0 7 9 9 9 9s9-2 9-9a9 9 0 0 0-9-9Z"/><path d="M12 3v18"/></svg>`,
  mingle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  postpartum: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  nutrition: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  swiggy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5V11c0-.55.45-1 1-1h2c1.1 0 2 .9 2 2v1c0 .74-.4 1.38-1 1.72v1.78z"/></svg>`,
  spotify: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.115.294.18.386.562.207.855zm1.224-2.72c-.226.367-.707.482-1.074.256-2.69-1.653-6.79-2.133-9.97-1.167-.413.125-.85-.106-.975-.52-.125-.413.106-.85.52-.975 3.632-1.102 8.147-.568 11.243 1.332.367.226.482.707.256 1.074zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.13-1.168-.624-.15-.493.13-1.018.624-1.168 3.532-1.072 9.404-.87 13.115 1.332.443.263.59.84.327 1.283-.263.444-.84.59-1.283.328z"/></svg>`,
  tata1mg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/><path d="M12 8v8"/><path d="M8 12h8"/><circle cx="19" cy="19" r="3"/></svg>`,
  prime: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  cult: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  assessmentDoc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  microscope: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/></svg>`,
  sleepMoon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
};

/* --------------------------------------------------------------------------
   MIROR CARE+ — MEMBER DASHBOARD DATA STORE
   -------------------------------------------------------------------------- */
window.currentCarePlusView = window.currentCarePlusView || 'dashboard'; // 'dashboard' | 'feed'

window.careDashboardData = {
  status: 'active', // 'active' | 'grace' | 'paused' | 'cancelled'
  planName: 'Care+ Member',
  billingFrequency: 'Monthly',
  priceFormatted: '₹399/month',
  memberSince: 'Aug 2026',
  renewalDate: '24 Sep 2026',
  gracePeriodDaysLeft: 3,
  
  sectionOrder: [
    'care-access',
    'benefits',
    'discounts',
    'resume-activity',
    'for-you-today',
    'trending',
    'care-groups',
    'events',
    'next-unlock',
    'care-history',
    'membership-details'
  ],
  
  hiddenSections: {},
  
  // Section 2: Complete Care Access
  careAccess: {
    isDismissed: false,
    eyebrow: 'Your complete care access',
    title: 'Everything included in your membership',
    subtitle: 'Full clinical access, unlimited guidance, and everyday member perks.',
    benefits: [
      { id: 'b1', title: 'Unlimited doctor support', sub: '24/7 specialist chat & Q&A', iconSvg: CARE_SVGS.stethoscope, bg: '#EFF6FF', color: '#2563EB' },
      { id: 'b2', title: 'Report & scan review', sub: 'Clinical review in < 2 hrs', iconSvg: CARE_SVGS.clipboardCheck, bg: '#FAF5FF', color: '#9333EA' },
      { id: 'b3', title: 'Expert webinars', sub: 'Live weekly doctor sessions', iconSvg: CARE_SVGS.videoWebinar, bg: '#FDF2F8', color: '#DB2777' },
      { id: 'b4', title: 'Member benefits', sub: 'Partner perks & discounts', iconSvg: CARE_SVGS.giftPerks, bg: '#FFFBEB', color: '#D97706' }
    ]
  },

  // Section 3: Lifestyle Partner Benefits
  partnerBenefits: [
    { id: 'swiggy', name: 'Swiggy One', status: 'active', statusLabel: 'Active', iconSvg: CARE_SVGS.swiggy, bg: '#FFF7ED', border: '#FFEDD5', color: '#EA580C' },
    { id: 'spotify', name: 'Spotify', status: 'claim', statusLabel: 'Claim now', iconSvg: CARE_SVGS.spotify, bg: '#ECFDF5', border: '#A7F3D0', color: '#059669' },
    { id: '1mg', name: 'Tata 1mg', status: 'active', statusLabel: 'Active', iconSvg: CARE_SVGS.tata1mg, bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
    { id: 'prime', name: 'Amazon Prime', status: 'locked', statusLabel: 'Month 6', unlockText: 'Unlocks at month 6', iconSvg: CARE_SVGS.prime, bg: '#F0F9FF', border: '#BAE6FD', color: '#0284C7' },
    { id: 'cult', name: 'Cult.fit Pass', status: 'locked', statusLabel: 'Month 3', unlockText: 'Unlocks at month 3', iconSvg: CARE_SVGS.cult, bg: '#FAF5FF', border: '#E9D5FF', color: '#7E22CE' }
  ],

  // Section 4: Member Discounts
  discounts: [
    { id: 'd1', type: 'tappable', discount: '20% OFF', title: 'Doctor consultations', sub: 'Member pricing · Instant scheduling', terms: '20% off all 1-on-1 OB-GYN, endocrinologist & nutrition video consults.' },
    { id: 'd2', type: 'tappable', discount: '30% OFF', title: 'Diagnostic lab tests & panels', sub: 'Home sample pickup · Full hormonal panel', terms: '30% discount on comprehensive thyroid, estrogen, progesterone and lipid profiles.' },
    { id: 'd3', type: 'tappable', discount: '15% OFF', title: 'Miror Wellness Store supplements', sub: 'Auto-applied at checkout · Free delivery', terms: '15% instant savings on all Miror Bliss, Mily, Revive & Thrive formulations.' },
    { id: 'd4', type: 'informational', title: 'Free Annual Hormone Health Scan', sub: 'Included with active annual renewal · No co-pay required' }
  ],

  // Section 5: Pick Up Where You Left Off
  resumeActivities: [
    { id: 'a1', iconSvg: CARE_SVGS.assessmentDoc, title: 'Complete your health assessment', progress: 'Day 12 of 28', isProgress: true, screen: 'assessment' },
    { id: 'a2', iconSvg: CARE_SVGS.microscope, title: 'Review your latest thyroid scan report', progress: 'Dr. Sharma reviewed · Continue', isProgress: false, screen: 'report-preview' },
    { id: 'a3', iconSvg: CARE_SVGS.sleepMoon, title: 'Deep Sleep 7-Day Habit Sprint', progress: 'Day 4 of 7', isProgress: true, screen: 'bloom-journey' }
  ],

  // Section 6: Trending in Community
  trending: {
    status: 'live',
    title: 'How are you managing your sleep changes?',
    context: '128 women actively sharing evening routines, magnesium tips & cooling habits.',
    viewersCount: '128 people viewing',
    groupId: 'mingle'
  },

  // Section 7: Care Groups
  careGroups: [
    { id: '30s-hormones', name: 'Hormonal Health', sub: 'Support & discussions', iconSvg: CARE_SVGS.lotus, locked: false },
    { id: 'mingle', name: 'Miror@Mingle', sub: 'Daily wellness & Q&As', iconSvg: CARE_SVGS.mingle, locked: false },
    { id: 'postpartum-moms', name: 'Postpartum Care', sub: 'Recovery & motherhood', iconSvg: CARE_SVGS.postpartum, locked: false },
    { id: 'advanced-clinical', name: 'Advanced Clinical Care', sub: 'Unlocks at month 6', iconSvg: CARE_SVGS.lock, locked: true, unlockMilestone: 'Month 6' },
    { id: 'nourish', name: 'Nutrition Circle', sub: 'Hormone recipes', iconSvg: CARE_SVGS.nutrition, locked: false }
  ],

  // Section 8: This Month at Miror
  events: [
    { id: 'ev-1', date: '24 AUG', time: '7:00 PM', title: 'Ask the Expert: Hormonal Transitions', host: 'Hosted by Dr. Anjali Sharma, Senior OB-GYN', attendees: '340 attending' },
    { id: 'ev-2', date: '29 AUG', time: '6:30 PM', title: 'Live Yoga & Pelvic Floor Mobility', host: 'Hosted by Shalini Rao, Certified Yoga Therapist', attendees: '215 attending' }
  ],

  // Section 9: For You Today
  forYouToday: {
    category: 'MOST RELEVANT',
    readTime: '5 MIN READ',
    title: 'Understanding your changing energy levels',
    summary: 'Why progesterone fluctuations cause afternoon dips and 3 dietary micro-habits that stabilize midday cortisol.',
    screen: 'article-sleep-detail'
  },

  // Section 10: Next Unlock
  nextUnlock: {
    rewardName: 'Amazon Prime',
    rewardDuration: '3 months free',
    rewardIconSvg: CARE_SVGS.trophy,
    condition: 'Complete your next milestone to unlock.',
    pct: 72,
    status: 'in-progress'
  },

  // Section 11: Care History
  careHistory: [
    { id: 'h1', status: 'completed', statusIcon: CARE_SVGS.checkCircle, statusColor: '#059669', statusBg: '#ECFDF5', title: 'Consultation completed', date: '12 Aug', doctor: 'Dr. Anjali Sharma' },
    { id: 'h2', status: 'awaiting', statusIcon: CARE_SVGS.clock, statusColor: '#D97706', statusBg: '#FEF3C7', title: 'Report awaiting interpretation', date: '10 Aug', doctor: 'Miror Care Team' },
    { id: 'h3', status: 'specialist', statusIcon: CARE_SVGS.share, statusColor: '#7C3AED', statusBg: '#FAF5FF', title: 'Shared for specialist review', date: '05 Aug', doctor: 'Specialist Team' }
  ],

  // Section 12: Membership Details
  membershipDetails: {
    plan: 'Care+ Member',
    billing: 'Monthly',
    nextPayment: '₹399',
    memberSince: 'Aug 2026',
    renewalDate: '24 Sep 2026'
  }
};

/* --- Global Reusable CarePlusCard Component --- */
window.renderCarePlusCard = function({
  id,
  title,
  eyebrow = '',
  eyebrowIconSvg = '',
  tag = '',
  tagClass = '',
  actionText = '',
  onAction = '',
  contentHtml = '',
  footerHtml = '',
  extraStyle = '',
  className = ''
}) {
  return `
    <div class="care-plus-card ${className}" id="care-card-${id}" style="${extraStyle}">
      <div class="care-card-header">
        <div class="care-card-title-wrap">
          ${eyebrow ? `<div class="care-card-eyebrow">${eyebrowIconSvg ? `<span style="display:inline-flex;align-items:center;margin-right:3px;">${eyebrowIconSvg}</span>` : ''}${eyebrow}</div>` : ''}
          <h3 class="care-card-title">${title}</h3>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
          ${tag ? `<span class="care-card-tag ${tagClass}">${tag}</span>` : ''}
          ${actionText ? `<button class="care-card-action-link" onclick="${onAction || ''}">${actionText} &rarr;</button>` : ''}
        </div>
      </div>
      <div class="care-card-content">
        ${contentHtml}
      </div>
      ${footerHtml ? `<div class="care-card-footer" style="margin-top:14px;padding-top:12px;border-top:1px solid #F1F5F9;">${footerHtml}</div>` : ''}
    </div>
  `;
};

/* --- Section 1: Fixed Status Header (Home Aligned Soft Luxury Pearl) --- */
window.renderCarePlusStatusHeader = function() {
  const d = window.careDashboardData;
  const status = d.status || 'active';

  let statusText = 'Active membership';
  let statusColor = '#059669';
  let bannerAlertHtml = '';

  if (status === 'grace') {
    statusText = 'Payment attention needed';
    statusColor = '#D97706';
    bannerAlertHtml = `
      <div style="margin-top:12px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:14px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-size:12px;color:#B45309;font-weight:600;">⚠️ Grace period ends in ${d.gracePeriodDaysLeft || 3} days</span>
        <button onclick="window.openManageMembershipModal()" style="background:#D97706;color:#FFFFFF;border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;">Update</button>
      </div>
    `;
  } else if (status === 'paused') {
    statusText = 'Membership paused';
    statusColor = '#64748B';
    bannerAlertHtml = `
      <div style="margin-top:12px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-size:12px;color:#475569;font-weight:500;">Paused until next billing cycle</span>
        <button onclick="window.setCareDashboardStatus('active')" style="background:#0F172A;color:#FFFFFF;border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;">Resume</button>
      </div>
    `;
  } else if (status === 'cancelled') {
    statusText = `Cancelled · Ends ${d.renewalDate}`;
    statusColor = '#DC2626';
    bannerAlertHtml = `
      <div style="margin-top:12px;background:#FEF2F2;border:1px solid #FECACA;border-radius:14px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-size:12px;color:#B91C1C;font-weight:500;">Benefits active until ${d.renewalDate}</span>
        <button onclick="window.setCareDashboardStatus('active')" style="background:#DC2626;color:#FFFFFF;border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;">Reactivate</button>
      </div>
    `;
  }

  return `
    <div class="care-status-header-fixed">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;position:relative;z-index:2;">
        <div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <h2 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:600;color:#0F172A;margin:0;letter-spacing:-0.4px;">
              Miror Care
            </h2>
            <span style="background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFF;font-size:10px;font-weight:600;padding:2px 6px;border-radius:6px;letter-spacing:0.5px;">VIP</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12.5px;color:${statusColor};font-weight:600;">
            <span class="care-status-dot" style="background:${statusColor};box-shadow:0 0 6px ${statusColor};"></span>
            <span>${statusText}</span>
          </div>
        </div>

        <div class="care-status-badge-chip">
          <span>${d.priceFormatted || '₹399/month'}</span>
        </div>
      </div>

      ${bannerAlertHtml}
    </div>
  `;
};

/* --- Section 2: Your Complete Care Access --- */
window.renderCareAccessCard = function() {
  const d = window.careDashboardData.careAccess;
  if (d.isDismissed) {
    return window.renderCarePlusCard({
      id: 'care-access',
      title: 'Your complete care access',
      eyebrow: 'YOUR COMPLETE CARE ACCESS',
      eyebrowIconSvg: CARE_SVGS.stethoscope,
      tag: 'Included',
      tagClass: 'included',
      actionText: 'Expand',
      onAction: 'window.dismissCareAccessCard()',
      contentHtml: `<p style="font-size:13px;color:#64748B;margin:0;">4 core clinical & lifestyle benefits active in your plan.</p>`
    });
  }

  const gridHtml = `
    <p style="font-size:13px;color:#64748B;margin:0 0 16px;line-height:1.45;">
      ${d.subtitle}
    </p>
    <div class="care-access-grid">
      ${d.benefits.map(b => `
        <div class="care-access-item">
          <div class="care-access-icon-wrap" style="background:${b.bg};color:${b.color};">
            ${b.iconSvg}
          </div>
          <div>
            <h4 style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin:0 0 4px;line-height:1.25;">
              ${b.title}
            </h4>
            <p style="font-size:11.5px;color:#64748B;margin:0;line-height:1.35;">
              ${b.sub}
            </p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'care-access',
    eyebrow: 'YOUR COMPLETE CARE ACCESS',
    eyebrowIconSvg: CARE_SVGS.stethoscope,
    title: d.title,
    actionText: 'Collapse',
    onAction: 'window.dismissCareAccessCard()',
    contentHtml: gridHtml
  });
};

/* --- Section 3: Member Benefits --- */
window.renderMemberBenefitsCard = function() {
  const benefits = window.careDashboardData.partnerBenefits || [];
  
  const tilesHtml = `
    <div class="care-benefits-row">
      ${benefits.map(b => {
        let badgeHtml = '';
        if (b.status === 'active') {
          badgeHtml = `<span style="font-size:10px;font-weight:600;color:#059669;background:#ECFDF5;padding:2px 6px;border-radius:6px;border:1px solid #A7F3D0;">Active</span>`;
        } else if (b.status === 'claim') {
          badgeHtml = `<button onclick="window.claimPartnerBenefit('${b.id}')" style="font-size:10px;font-weight:600;color:#FFF;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);padding:2px 8px;border-radius:6px;border:none;cursor:pointer;">Claim</button>`;
        } else {
          badgeHtml = `<span style="font-size:10px;font-weight:600;color:#64748B;background:#F1F5F9;padding:2px 6px;border-radius:6px;display:inline-flex;align-items:center;gap:3px;"><span style="display:inline-flex;">${CARE_SVGS.lock}</span>${b.statusLabel}</span>`;
        }

        return `
          <div class="care-benefit-tile ${b.status}" onclick="window.claimPartnerBenefit('${b.id}')" style="cursor:pointer;">
            <div style="width:40px;height:40px;border-radius:12px;background:${b.bg};border:1px solid ${b.border || '#E2E8F0'};color:${b.color};display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
              ${b.iconSvg}
            </div>
            <span style="font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;color:#0F172A;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:96px;">
              ${b.name}
            </span>
            ${badgeHtml}
          </div>
        `;
      }).join('')}
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'benefits',
    eyebrow: 'PARTNER PERKS',
    eyebrowIconSvg: CARE_SVGS.giftPerks,
    title: 'Member benefits',
    tag: 'Included',
    tagClass: 'included',
    contentHtml: tilesHtml
  });
};

/* --- Section 4: Member Discounts --- */
window.renderMemberDiscountsCard = function() {
  const discounts = window.careDashboardData.discounts || [];
  
  const listHtml = discounts.map(d => {
    if (d.type === 'tappable') {
      return `
        <div class="care-discount-row tappable" onclick="window.showDiscountTerms('${d.id}')">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <span class="care-discount-badge">${d.discount}</span>
            <div style="min-width:0;">
              <h4 style="font-family:'Montserrat',sans-serif;font-size:13.5px;font-weight:600;color:#0F172A;margin:0 0 2px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${d.title}
              </h4>
              <p style="font-size:11.5px;color:#64748B;margin:0;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${d.sub}
              </p>
            </div>
          </div>
          <span style="color:#94A3B8;font-size:16px;margin-left:8px;font-weight:600;">&rsaquo;</span>
        </div>
      `;
    } else {
      return `
        <div class="care-discount-row" style="background:#FAF5FF;border:1px dashed #DDD6FE;">
          <div style="min-width:0;">
            <h4 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#7E22CE;margin:0 0 2px;line-height:1.2;display:flex;align-items:center;gap:4px;">
              <span>${CARE_SVGS.sparkle}</span>
              <span>${d.title}</span>
            </h4>
            <p style="font-size:11.5px;color:#6B21A8;margin:0;line-height:1.2;">
              ${d.sub}
            </p>
          </div>
        </div>
      `;
    }
  }).join('');

  return window.renderCarePlusCard({
    id: 'discounts',
    eyebrow: 'SAVINGS PROGRAM',
    eyebrowIconSvg: CARE_SVGS.giftPerks,
    title: 'Member discounts',
    tag: 'Care+ savings',
    tagClass: 'savings',
    contentHtml: listHtml
  });
};

/* --- Section 5: Pick Up Where You Left Off --- */
window.renderContinueActivityCard = function() {
  const activities = window.careDashboardData.resumeActivities || [];
  
  if (activities.length === 0) {
    return window.renderCarePlusCard({
      id: 'resume-activity',
      eyebrow: 'HEALTH SPRINT',
      eyebrowIconSvg: CARE_SVGS.sparkle,
      title: 'Pick up where you left off',
      actionText: 'Explore',
      onAction: "SM.switchTab('insights')",
      contentHtml: `
        <div style="text-align:center;padding:12px 6px;">
          <p style="font-size:13px;color:#64748B;margin:0 0 8px;">No pending health tasks right now.</p>
          <button onclick="SM.show('assessment')" style="background:#0F172A;color:#FFF;border:none;border-radius:12px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;">Start Health Assessment</button>
        </div>
      `
    });
  }

  const rowsHtml = activities.map(a => `
    <div class="care-activity-row" onclick="window.resumeActivity('${a.id}')">
      <div style="display:flex;align-items:center;gap:12px;min-width:0;">
        <span style="width:36px;height:36px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;color:#7A3FD1;flex-shrink:0;">
          ${a.iconSvg}
        </span>
        <div style="min-width:0;">
          <h4 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#0F172A;margin:0 0 2px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${a.title}
          </h4>
          <span style="font-size:11.5px;color:${a.isProgress ? '#EC5DAA' : '#64748B'};font-weight:${a.isProgress ? '700' : '500'};line-height:1.2;">
            ${a.progress}
          </span>
        </div>
      </div>
      <span style="color:#94A3B8;font-size:16px;margin-left:8px;font-weight:600;">&rsaquo;</span>
    </div>
  `).join('');

  return window.renderCarePlusCard({
    id: 'resume-activity',
    eyebrow: 'ACTIVE TRACKING',
    eyebrowIconSvg: CARE_SVGS.sparkle,
    title: 'Pick up where you left off',
    actionText: 'See all',
    onAction: "SM.toast('Viewing all active routines')",
    contentHtml: rowsHtml
  });
};

/* --- Section 6: Trending in the Community --- */
window.renderTrendingCommunityCard = function() {
  const t = window.careDashboardData.trending;
  if (!t) return '';

  const bodyHtml = `
    <div style="margin-bottom:12px;">
      <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0 0 6px;line-height:1.35;">
        ${t.title}
      </h4>
      <p style="font-size:13px;color:#475569;margin:0 0 10px;line-height:1.45;">
        ${t.context}
      </p>
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#EC5DAA;font-weight:600;">
        <span style="display:inline-flex;">${CARE_SVGS.users}</span>
        <span>${t.viewersCount}</span>
      </div>
    </div>
    <button onclick="SM.show('community-group', { id: '${t.groupId || 'mingle'}' })" style="width:100%;height:40px;border-radius:12px;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFFFFF;border:none;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(236,93,170,0.25);display:flex;align-items:center;justify-content:center;gap:6px;">
      <span>Join chat</span>
      <span>&rarr;</span>
    </button>
  `;

  return window.renderCarePlusCard({
    id: 'trending',
    className: 'care-trending-card',
    eyebrow: 'COMMUNITY BUZZ',
    eyebrowIconSvg: CARE_SVGS.flame,
    title: 'Live Discussion',
    tag: '● LIVE NOW',
    tagClass: 'savings',
    contentHtml: bodyHtml
  });
};

/* --- Section 7: Your Care Groups --- */
window.renderCareGroupsCard = function() {
  const groups = window.careDashboardData.careGroups || [];
  
  const gridHtml = `
    <div class="care-groups-2col">
      ${groups.map(g => {
        if (g.locked) {
          return `
            <div class="care-group-box" style="background:#F1F5F9;opacity:0.75;">
              <div>
                <div style="width:36px;height:36px;border-radius:10px;background:#E2E8F0;display:flex;align-items:center;justify-content:center;color:#64748B;margin-bottom:8px;">
                  ${g.iconSvg}
                </div>
                <h4 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#64748B;margin:0 0 2px;line-height:1.2;">
                  ${g.name}
                </h4>
                <p style="font-size:11px;color:#94A3B8;margin:0;line-height:1.2;">
                  ${g.sub}
                </p>
              </div>
              <button onclick="SM.toast('🔒 Unlocks at ${g.unlockMilestone}')" style="width:100%;padding:5px 0;border-radius:10px;background:#E2E8F0;color:#64748B;font-family:'Montserrat',sans-serif;font-size:10.5px;font-weight:600;border:none;cursor:not-allowed;">
                Locked
              </button>
            </div>
          `;
        }

        return `
          <div class="care-group-box">
            <div>
              <div style="width:36px;height:36px;border-radius:10px;background:#FAF5FF;border:1px solid #E9D5FF;display:flex;align-items:center;justify-content:center;color:#7A3FD1;margin-bottom:8px;">
                ${g.iconSvg}
              </div>
              <h4 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#0F172A;margin:0 0 2px;line-height:1.2;">
                ${g.name}
              </h4>
              <p style="font-size:11px;color:#64748B;margin:0;line-height:1.2;">
                ${g.sub}
              </p>
            </div>
            <button class="care-group-cta" onclick="SM.show('community-group', { id: '${g.id}' })">
              Join conversation
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'care-groups',
    eyebrow: 'TOPIC CIRCLES',
    eyebrowIconSvg: CARE_SVGS.users,
    title: 'Your care groups',
    tag: 'All included',
    tagClass: 'included',
    contentHtml: gridHtml
  });
};

/* --- Section 8: This Month at Miror --- */
window.renderEventsCard = function() {
  const events = window.careDashboardData.events || [];
  if (events.length === 0) {
    return window.renderCarePlusCard({
      id: 'events',
      eyebrow: 'LIVE SESSIONS',
      eyebrowIconSvg: CARE_SVGS.calendar,
      title: 'This month at Miror',
      tag: 'Calendar',
      contentHtml: `<p style="font-size:13px;color:#64748B;margin:0;">Nothing scheduled for this month. Check back soon!</p>`
    });
  }

  const ev = events[0];
  const eventHtml = `
    <div style="background:#F8FAFC;border:1px solid #F1F5F9;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFF;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;padding:3px 8px;border-radius:8px;letter-spacing:0.3px;display:inline-flex;align-items:center;gap:4px;">
          <span>${CARE_SVGS.calendar}</span>
          <span>${ev.date} · ${ev.time}</span>
        </span>
        <span style="font-size:11.5px;color:#64748B;font-weight:600;">
          ${ev.attendees}
        </span>
      </div>
      <h4 style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;color:#0F172A;margin:2px 0 0;line-height:1.3;">
        ${ev.title}
      </h4>
      <p style="font-size:12px;color:#64748B;margin:0;line-height:1.3;">
        ${ev.host}
      </p>
      <button onclick="window.addEventToCalendar('${ev.id}')" style="margin-top:6px;width:100%;height:36px;border-radius:10px;background:#0F172A;color:#FFFFFF;border:none;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
        <span>Add to calendar</span>
        <span>&rarr;</span>
      </button>
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'events',
    eyebrow: 'LIVE WEBINARS',
    eyebrowIconSvg: CARE_SVGS.videoWebinar,
    title: 'This month at Miror',
    tag: 'Monthly',
    contentHtml: eventHtml
  });
};

/* --- Section 9: For You Today --- */
window.renderPersonalizedContentCard = function() {
  const item = window.careDashboardData.forYouToday;
  if (!item) return '';

  const cardHtml = `
    <div style="background:#FAF5FF;border:1px solid #E9D5FF;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:6px;cursor:pointer;" onclick="window.readPersonalizedArticle()">
      <div style="display:flex;align-items:center;gap:6px;font-family:'Montserrat',sans-serif;font-size:10.5px;font-weight:600;color:#7E22CE;letter-spacing:0.5px;">
        <span style="display:inline-flex;align-items:center;gap:2px;">${CARE_SVGS.sparkle} ${item.category}</span>
        <span>·</span>
        <span>${item.readTime}</span>
      </div>
      <h4 style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;color:#0F172A;margin:2px 0 0;line-height:1.35;">
        ${item.title}
      </h4>
      <p style="font-size:12.5px;color:#475569;margin:0;line-height:1.45;">
        ${item.summary}
      </p>
      <div style="display:flex;align-items:center;gap:4px;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;color:#EC5DAA;margin-top:4px;">
        <span>Read article</span>
        <span>&rarr;</span>
      </div>
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'for-you-today',
    eyebrow: 'DAILY RECOMMENDATION',
    eyebrowIconSvg: CARE_SVGS.sparkle,
    title: 'For you today',
    contentHtml: cardHtml
  });
};

/* --- Section 10: Your Next Unlock --- */
window.renderNextUnlockCard = function() {
  const u = window.careDashboardData.nextUnlock;
  if (!u) return '';

  const isUnlocked = u.status === 'unlocked';
  const isClaimed = u.status === 'claimed';

  const bodyHtml = `
    <div style="background:#F8FAFC;border:1px solid #F1F5F9;border-radius:16px;padding:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:10px;background:#FEF3C7;color:#D97706;display:flex;align-items:center;justify-content:center;">
            ${u.rewardIconSvg}
          </div>
          <div>
            <h4 style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;margin:0;line-height:1.2;">
              ${u.rewardName}
            </h4>
            <span style="font-size:11.5px;color:#64748B;font-weight:500;">${u.rewardDuration}</span>
          </div>
        </div>
        ${isUnlocked ? `
          <button onclick="window.claimMilestoneReward()" style="background:#10B981;color:#FFF;border:none;border-radius:10px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;">Claim 🎉</button>
        ` : isClaimed ? `
          <span style="font-size:11px;color:#059669;font-weight:600;">Claimed ✓</span>
        ` : ''}
      </div>

      <p style="font-size:12px;color:#64748B;margin:0 0 10px;line-height:1.35;">
        ${u.condition}
      </p>

      <!-- Progress Bar -->
      <div style="width:100%;height:8px;border-radius:4px;background:#E2E8F0;overflow:hidden;position:relative;">
        <div style="width:${u.pct}%;height:100%;background:linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);border-radius:4px;transition:width 0.5s ease;"></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;font-size:11.5px;font-weight:600;color:#64748B;">
        <span style="color:#EC5DAA;">${u.pct}% completed</span>
        <span>Next milestone</span>
      </div>
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'next-unlock',
    eyebrow: 'MILESTONES',
    eyebrowIconSvg: CARE_SVGS.trophy,
    title: 'Your next unlock',
    tag: `${u.pct}% complete`,
    tagClass: 'savings',
    contentHtml: bodyHtml
  });
};

/* --- Section 11: Your Care History --- */
window.renderCareHistoryCard = function() {
  const history = window.careDashboardData.careHistory || [];

  const timelineHtml = history.map(item => `
    <div class="care-history-item" onclick="window.openCareHistoryDetails('${item.id}')" style="cursor:pointer;">
      <div class="care-history-icon-circle" style="background:${item.statusBg};color:${item.statusColor};">
        ${item.statusIcon}
      </div>
      <div style="flex:1;min-width:0;">
        <h4 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#0F172A;margin:0 0 2px;line-height:1.25;">
          ${item.title}
        </h4>
        <p style="font-size:11.5px;color:#64748B;margin:0;line-height:1.2;">
          ${item.date} · ${item.doctor}
        </p>
      </div>
      <span style="color:#94A3B8;font-size:16px;margin-left:6px;font-weight:600;">&rsaquo;</span>
    </div>
  `).join('');

  return window.renderCarePlusCard({
    id: 'care-history',
    eyebrow: 'MEDICAL TIMELINE',
    eyebrowIconSvg: CARE_SVGS.clipboardCheck,
    title: 'Your care history',
    actionText: 'View all',
    onAction: "window.openCareHistoryModal()",
    contentHtml: timelineHtml
  });
};

/* --- Section 12: Membership Details --- */
window.renderMembershipDetailsCard = function() {
  const m = window.careDashboardData.membershipDetails;

  const detailsHtml = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9;font-size:13px;">
        <span style="color:#64748B;font-weight:500;">Plan</span>
        <span style="font-family:'Montserrat',sans-serif;font-weight:600;color:#0F172A;">${m.plan}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9;font-size:13px;">
        <span style="color:#64748B;font-weight:500;">Billing</span>
        <span style="font-weight:600;color:#0F172A;">${m.billing}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9;font-size:13px;">
        <span style="color:#64748B;font-weight:500;">Next payment</span>
        <span style="font-family:'Montserrat',sans-serif;font-weight:600;color:#0F172A;">${m.nextPayment}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:13px;">
        <span style="color:#64748B;font-weight:500;">Member since</span>
        <span style="font-weight:600;color:#0F172A;">${m.memberSince}</span>
      </div>
    </div>
  `;

  return window.renderCarePlusCard({
    id: 'membership-details',
    eyebrow: 'BILLING & PLAN',
    eyebrowIconSvg: CARE_SVGS.giftPerks,
    title: 'Membership details',
    tag: `Renews ${m.renewalDate}`,
    contentHtml: detailsHtml
  });
};

/* --- Section: HRT (Hormone Replacement Therapy) Hero Card (Matching Challenge Card Style & Font) --- */
window.renderHrtCard = function() {
  return `
    <!-- HRT Featured Care Program Card (Challenge Card Style & Proportions) -->
    <div onclick="window.openHrtProtocolModal()" style="margin: 0 16px 20px; background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); border-radius: 24px; padding: 22px 20px 20px; color: #FFFFFF; position: relative; overflow: hidden; box-shadow: 0 6px 20px rgba(217, 70, 239, 0.22); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease;">
      
      <!-- 1. Tag Line: 🌸 HRT CARE PROGRAM -->
      <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.95); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
        <span>🌸</span>
        <span>HRT CARE PROGRAM</span>
      </div>

      <!-- 2. Primary Title Focus -->
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 21px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px; line-height: 1.25; letter-spacing: -0.3px;">
        Combined Continuous HRT
      </h3>

      <!-- 3. Description -->
      <div style="font-size: 13px; color: rgba(255,255,255,0.92); line-height: 1.45; margin-bottom: 12px;">
        Clinician-guided hormone care with specialist support and symptom tracking throughout your care journey.
      </div>

      <!-- 4. Compact Metadata Row -->
      <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.85); margin-bottom: 16px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
        <span>Specialist-led</span>
        <span>·</span>
        <span>Personalised care</span>
        <span>·</span>
        <span>Ongoing support</span>
      </div>

      <!-- 5. Prominent White CTA Button (Matching Challenge Card Button) -->
      <button onclick="event.stopPropagation(); window.openHrtProtocolModal();" style="width: 100%; background: #FFFFFF; color: #0F172A; border-radius: 9999px; height: 48px; padding: 12px 20px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.12); transition: transform 0.15s ease;">
        <span>Join the program →</span>
      </button>

    </div>
  `;
};

window.toggleHrtDose = function(idx) {
  if (!window.userHrtData) {
    window.userHrtData = {
      active: true,
      protocol: 'Combined Continuous HRT',
      dayOfCycle: 18,
      totalCycleDays: 28,
      streak: 14,
      medications: [
        { name: 'Estrogel (Estradiol)', dose: '2 pumps', taken: true },
        { name: 'Progesterone', dose: '100mg', taken: false }
      ]
    };
  }
  window.userHrtData.medications[idx].taken = !window.userHrtData.medications[idx].taken;
  const med = window.userHrtData.medications[idx];
  if (med.taken && window.confetti) {
    window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.4 } });
  }
  if (typeof SM !== 'undefined') {
    SM.render();
    SM.toast(med.taken ? `✓ Logged: ${med.name} taken!` : `Dose unlogged for ${med.name}`);
  }
};

window.openHrtProtocolModal = function() {
  alert('🌸 Hormone Replacement Therapy (HRT) Protocol\n\n• Protocol: Combined Continuous Estrogen + Micronized Progesterone\n• Estrogel 0.06%: 2 pumps applied to arms/shoulders daily in AM\n• Micronized Progesterone: 100mg orally before bed\n• Active Streak: 14 consecutive days\n• Next Specialist Review: Scheduled in 22 days');
};

/* --- Section: Miror Health Drive (Digital Health Records Vault) --- */
window.userHealthDriveFiles = window.userHealthDriveFiles || [
  {
    id: 'rec-1',
    name: 'Comprehensive_Hormone_Panel_July2026.pdf',
    title: 'Complete Hormone Panel (FSH, E2, LH, TSH)',
    category: 'lab',
    icon: '🧪',
    badge: 'PDF · 2.4 MB',
    issuer: 'Dr. Lal PathLabs',
    date: '14 Jul 2026',
    status: 'Normal Post-HRT',
    statusColor: '#059669',
    summary: 'Estradiol (E2): 84 pg/mL (Optimal), FSH: 28 mIU/mL, LH: 22 mIU/mL, TSH: 1.8 μIU/mL. Confirmed stable hormonal balance on current protocol.',
    doctorNote: 'Dr. Anjali Sharma: Optimal response to 2 pumps Estrogel daily. Maintain current dosage.'
  },
  {
    id: 'rec-2',
    name: 'DEXA_Bone_Density_Scan_May2026.pdf',
    title: 'DEXA Bone Mineral Density (Spine & Hip)',
    category: 'scan',
    icon: '🦴',
    badge: 'Scan · 5.1 MB',
    issuer: 'Apollo Diagnostics',
    date: '02 May 2026',
    status: 'T-Score -1.1 (Mild)',
    statusColor: '#D97706',
    summary: 'Lumbar Spine T-score: -1.1 (borderline osteopenia). Femoral Neck T-score: -0.8. HRT estrogen support is recommended to preserve bone mass.',
    doctorNote: 'Dr. Anjali Sharma: Estrogen protection recommended alongside 1200mg Calcium + 2000IU Vit D3.'
  },
  {
    id: 'rec-3',
    name: 'HRT_Clinical_Prescription_Protocol.pdf',
    title: 'HRT Prescription & Clinical Chart',
    category: 'rx',
    icon: '💊',
    badge: 'Rx · 850 KB',
    issuer: 'Dr. Anjali Sharma',
    date: '01 Aug 2026',
    status: 'Active Protocol',
    statusColor: '#7C3AED',
    summary: '1. Estrogel 0.06% (Estradiol) - 2 pumps topically each AM.\n2. Micronized Progesterone 100mg - 1 oral capsule at bedtime.\nNext Review: 90 days.',
    doctorNote: 'Valid for refill at any registered pharmacy.'
  },
  {
    id: 'rec-4',
    name: 'Fasting_Metabolic_Lipid_Panel_Mar2026.pdf',
    title: 'Lipid & Metabolic Cardiovascular Panel',
    category: 'lab',
    icon: '❤️',
    badge: 'PDF · 1.8 MB',
    issuer: 'Metropolis Healthcare',
    date: '20 Mar 2026',
    status: 'Optimal Range',
    statusColor: '#059669',
    summary: 'Total Cholesterol: 188 mg/dL, HDL: 62 mg/dL, LDL: 98 mg/dL, Triglycerides: 110 mg/dL, HbA1c: 5.3%. Low cardiovascular risk profile.',
    doctorNote: 'Cardiovascular profile is strong. Continue Mediterranean diet and weekly zone 2 cardio.'
  }
];

window.currentDriveFolder = window.currentDriveFolder || 'all';

window.filterHealthDrive = function(category) {
  window.currentDriveFolder = category;
  const listEl = document.getElementById('drive-files-list-container');
  if (listEl) {
    listEl.innerHTML = window.renderHealthDriveFileList();
  }
  const chips = document.querySelectorAll('.drive-folder-chip');
  chips.forEach(c => {
    if (c.getAttribute('data-cat') === category) {
      c.style.background = '#0F172A';
      c.style.color = '#FFFFFF';
      c.style.border = 'none';
    } else {
      c.style.background = '#F8FAFC';
      c.style.color = '#64748B';
      c.style.border = '1px solid #F1F5F9';
    }
  });
};

window.renderHealthDriveFileList = function() {
  const cat = window.currentDriveFolder || 'all';
  let files = window.userHealthDriveFiles || [];
  if (cat !== 'all') {
    files = files.filter(f => f.category === cat);
  }

  if (files.length === 0) {
    return `
      <div style="padding: 20px 0; text-align: center; color: #94A3B8; font-size: 13px;">
        No files in this category yet. Click "+ Upload" to add a report.
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column;">
      ${files.map((f, idx) => {
        const isLast = idx === files.length - 1;
        return `
          <div onclick="window.openDriveFileViewer('${f.id}')" style="padding: 12px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; border-bottom: ${isLast ? 'none' : '1px solid #F8FAFC'}; transition: background 0.15s ease;">
            <div style="display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1;">
              <!-- 44x44px Rounded Icon Container -->
              <div style="width: 44px; height: 44px; min-width: 44px; border-radius: 12px; background: #F8FAFC; border: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                ${f.icon}
              </div>
              <div style="min-width: 0; flex: 1;">
                <!-- Primary Dark Navy Filename Vertically Centered -->
                <h4 style="font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; color: #0F172A; margin: 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${f.title}
                </h4>
              </div>
            </div>

            <!-- Tappable Chevron -->
            <span style="font-size: 16px; color: #94A3B8; font-weight: 600; flex-shrink: 0;">→</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

window.renderHealthDriveCard = function(opts = {}) {
  const cat = window.currentDriveFolder || 'all';
  const totalDocs = (window.userHealthDriveFiles || []).length;
  const marginStyle = opts.noMargin ? 'margin: 0; height: 100%; box-sizing: border-box;' : 'margin: 0 16px 14px;';

  return `
    <!-- ONE SINGLE UNIFIED HEALTH RECORDS STORAGE CONTAINER -->
    <div style="${marginStyle} background: #FFFFFF; border-radius: 26px; padding: 22px 20px; border: 1px solid #F1F5F9; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.035); position: relative; overflow: hidden;">
      
      <!-- 1. Integrated Upload Health Reports Header (No nested card wrapper) -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; cursor: pointer;" onclick="window.uploadToHealthDrive()">
        <div style="display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: #EFF6FF; border: 1px solid #DBEAFE; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #2563EB; flex-shrink: 0;">
            📤
          </div>
          <div style="min-width: 0; flex: 1;">
            <h4 style="font-family: 'Montserrat', sans-serif; font-size: 15.5px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">
              Upload Health Reports
            </h4>
            <div style="font-size: 12px; color: #64748B; line-height: 1.35;">
              Keep your lab tests, DEXA scans &amp; prescriptions in one secure place.
            </div>
          </div>
        </div>
        <button style="background: #2563EB; color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 600; padding: 8px 16px; border-radius: 9999px; border: none; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px rgba(37,99,235,0.22); transition: all 0.15s ease;">
          + Upload
        </button>
      </div>

      <!-- Clean Internal Section Divider -->
      <div style="margin: 18px 0 16px; border-top: 1px solid #F1F5F9;"></div>

      <!-- 2. Medical Records Heading & Count -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0; letter-spacing: -0.2px;">
          Medical Records
        </h3>
        <span style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; color: #64748B;">
          ${totalDocs} files
        </span>
      </div>

      <!-- 3. Horizontal Filter Pills -->
      <div class="scroll-h" style="gap: 8px; padding: 0 0 14px; scrollbar-width: none;">
        <button class="drive-folder-chip" data-cat="all" onclick="window.filterHealthDrive('all')" style="padding: 7px 14px; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 600; border: ${cat === 'all' ? 'none' : '1px solid #F1F5F9'}; cursor: pointer; background: ${cat === 'all' ? '#0F172A' : '#F8FAFC'}; color: ${cat === 'all' ? '#FFFFFF' : '#64748B'}; transition: all 0.15s ease;">
          All Files
        </button>
        <button class="drive-folder-chip" data-cat="lab" onclick="window.filterHealthDrive('lab')" style="padding: 7px 14px; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 600; border: ${cat === 'lab' ? 'none' : '1px solid #F1F5F9'}; cursor: pointer; background: ${cat === 'lab' ? '#0F172A' : '#F8FAFC'}; color: ${cat === 'lab' ? '#FFFFFF' : '#64748B'}; transition: all 0.15s ease;">
          🧪 Lab Tests
        </button>
        <button class="drive-folder-chip" data-cat="scan" onclick="window.filterHealthDrive('scan')" style="padding: 7px 14px; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 600; border: ${cat === 'scan' ? 'none' : '1px solid #F1F5F9'}; cursor: pointer; background: ${cat === 'scan' ? '#0F172A' : '#F8FAFC'}; color: ${cat === 'scan' ? '#FFFFFF' : '#64748B'}; transition: all 0.15s ease;">
          🦴 Scans &amp; DEXA
        </button>
        <button class="drive-folder-chip" data-cat="rx" onclick="window.filterHealthDrive('rx')" style="padding: 7px 14px; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 600; border: ${cat === 'rx' ? 'none' : '1px solid #F1F5F9'}; cursor: pointer; background: ${cat === 'rx' ? '#0F172A' : '#F8FAFC'}; color: ${cat === 'rx' ? '#FFFFFF' : '#64748B'}; transition: all 0.15s ease;">
          💊 Prescriptions
        </button>
      </div>

      <!-- 4. File List (Directly rendered inside container) -->
      <div id="drive-files-list-container">
        ${window.renderHealthDriveFileList()}
      </div>

      <!-- 5. Integrated Subtle Security Footer -->
      <div style="text-align: center; font-size: 12px; color: #94A3B8; font-weight: 500; margin-top: 14px; padding-top: 12px; border-top: 1px solid #F8FAFC;">
        🔒 Private &amp; secure
      </div>
    </div>
  `;
};

window.renderCombinedBalanceModule = function() {
  const videoItems = [
    {
      id: 'bal-v1',
      title: 'Mental health and hormones',
      category: '🔒 CARE+',
      type: 'video',
      author: 'Dr Louise Newson',
      meta: '6 min',
      img: 'feed_event_banner.jpg',
      isCarePlus: true
    },
    {
      id: 'bal-v2',
      title: 'Sleep and relaxation',
      category: 'FREE VIDEO',
      type: 'video',
      author: 'Balance',
      meta: '8 min',
      img: 'feed_sleep_routine.jpg',
      isCarePlus: false
    },
    {
      id: 'bal-v3',
      title: 'HRT Window of Opportunity: Myths vs Evidence',
      category: '🔒 CARE+',
      type: 'video',
      author: 'Dr. Sarah Jenkins',
      meta: '6 min',
      img: 'article_cooling_herbs.jpg',
      isCarePlus: true
    },
    {
      id: 'bal-v4',
      title: 'Understanding Perimenopause & DEXA Bone Scans',
      category: '🔒 CARE+',
      type: 'video',
      author: 'Dr. Ramesh Gupta',
      meta: '8 min',
      img: 'article_sleep_cat.png',
      isCarePlus: true
    }
  ];

  const videoCardsHtml = videoItems.map(item => {
    const isLocked = item.isCarePlus && !window.isMirorCarePlusSubscribed;
    return `
      <div onclick="${isLocked ? `window.openMasterclassPaywall('${item.title.replace(/'/g, "\\'")}')` : `window.openBalanceContentModal('${item.title.replace(/'/g, "\\'")}', '${item.author.replace(/'/g, "\\'")}', '${item.type}', '${item.meta}')`}" style="min-width: 270px; max-width: 270px; scroll-snap-align: start; background: linear-gradient(180deg, #0F4C5C 0%, #0D3B48 100%); border-radius: 20px; border: 1px solid rgba(20, 184, 166, 0.25); overflow: hidden; box-shadow: 0 6px 20px rgba(15, 76, 92, 0.16); display: flex; flex-direction: column; cursor: pointer; transition: transform 0.18s ease;">
        <div style="position: relative; width: 100%; height: 130px; background: #082F37; overflow: hidden;">
          <img src="${item.img}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block; ${isLocked ? 'filter: blur(6px) brightness(0.85); transform: scale(1.08);' : 'filter: brightness(0.92);'}">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,47,55,0.12) 0%, rgba(8,47,55,0.65) 100%);"></div>
          
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 3;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${isLocked ? 'linear-gradient(135deg, #B14AC8 0%, #7A3FD1 100%)' : 'rgba(8, 47, 55, 0.78)'}; backdrop-filter: blur(6px); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: ${isLocked ? '16px' : '13px'}; padding-left: ${isLocked ? '0' : '2px'}; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 1.5px solid #FFFFFF;">
              ${isLocked ? '🔒' : '▶'}
            </div>
          </div>

          <div style="position: absolute; top: 10px; left: 10px; background: ${isLocked ? 'rgba(255,255,255,0.92)' : 'rgba(8, 47, 55, 0.88)'}; backdrop-filter: blur(8px); color: ${isLocked ? '#7A3FD1' : '#E0F2FE'}; font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; padding: 3.5px 9px; border-radius: 7px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid ${isLocked ? '#F3E8FF' : 'rgba(153, 246, 228, 0.22)'}; z-index: 2;">
            <span>${item.category}</span>
          </div>
        </div>

        <div style="padding: 14px 14px 16px; display: flex; flex-direction: column; justify-content: space-between; flex: 1; min-height: 125px; box-sizing: border-box;">
          <h4 style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; line-height: 1.35; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; letter-spacing: -0.2px;">
            ${item.title}
          </h4>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #99F6E4; font-weight: 600; display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px;">
              By ${item.author} · ${item.meta}
            </span>
            <span style="font-size: 13px; font-weight: 700;">${isLocked ? '🔒' : '&rarr;'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const articleItems = [
    {
      id: 'bal-a1',
      title: 'Understanding HRT: Benefits, risks & the window of opportunity',
      category: 'ARTICLE',
      type: 'article',
      author: 'Balance',
      meta: '6 min read',
      img: 'article_morning_reset.jpg',
      isCarePlus: false
    },
    {
      id: 'bal-a2',
      title: 'HRT and breast cancer risk: what you need to know',
      category: '🔒 CARE+',
      type: 'article',
      author: 'Balance',
      meta: '5 min read',
      img: 'article_cooling_herbs.jpg',
      isCarePlus: true
    },
    {
      id: 'bal-a3',
      title: 'How hormones can affect your mental health',
      category: 'ARTICLE',
      type: 'article',
      author: 'Balance',
      meta: '7 min read',
      img: 'feed_event_banner.jpg',
      isCarePlus: false
    },
    {
      id: 'bal-a4',
      title: 'Sleep, hormones and the menopause transition',
      category: 'EXPERT GUIDE',
      type: 'article',
      author: 'Balance',
      meta: '5 min read',
      img: 'article_sleep_cat.png',
      isCarePlus: false
    }
  ];

  const articleCardsHtml = articleItems.map(item => {
    const isLocked = item.isCarePlus && !window.isMirorCarePlusSubscribed;
    return `
      <div onclick="${isLocked ? `window.openMasterclassPaywall('${item.title.replace(/'/g, "\\'")}')` : `window.openBalanceContentModal('${item.title.replace(/'/g, "\\'")}', '${item.author.replace(/'/g, "\\'")}', '${item.type}', '${item.meta}')`}" style="min-width: 270px; max-width: 270px; scroll-snap-align: start; background: linear-gradient(180deg, #0F4C5C 0%, #0D3B48 100%); border-radius: 20px; border: 1px solid rgba(20, 184, 166, 0.25); overflow: hidden; box-shadow: 0 6px 20px rgba(15, 76, 92, 0.16); display: flex; flex-direction: column; cursor: pointer; transition: transform 0.18s ease;">
        <div style="position: relative; width: 100%; height: 130px; background: #082F37; overflow: hidden;">
          <img src="${item.img}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block; ${isLocked ? 'filter: blur(5px) brightness(0.85); transform: scale(1.08);' : 'filter: brightness(0.92);'}">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,47,55,0.12) 0%, rgba(8,47,55,0.65) 100%);"></div>
          
          ${isLocked ? `
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 3;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #B14AC8 0%, #7A3FD1 100%); border: 1.5px solid #FFFFFF; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.35);">
                🔒
              </div>
            </div>
          ` : ''}

          <div style="position: absolute; top: 10px; left: 10px; background: ${isLocked ? 'rgba(255,255,255,0.92)' : 'rgba(8, 47, 55, 0.88)'}; backdrop-filter: blur(8px); color: ${isLocked ? '#7A3FD1' : '#E0F2FE'}; font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; padding: 3.5px 9px; border-radius: 7px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid ${isLocked ? '#F3E8FF' : 'rgba(153, 246, 228, 0.22)'}; z-index: 2;">
            <span>${item.category}</span>
          </div>
        </div>
        <div style="padding: 14px 14px 16px; display: flex; flex-direction: column; justify-content: space-between; flex: 1; min-height: 125px; box-sizing: border-box;">
          <h4 style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; line-height: 1.35; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; letter-spacing: -0.2px;">
            ${item.title}
          </h4>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #99F6E4; font-weight: 600; display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px;">
              By ${item.author} · ${item.meta}
            </span>
            <span style="font-size: 13px; font-weight: 700;">${isLocked ? '🔒' : '&rarr;'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- Combined Balance Video Articles & Read Articles Module (Zero Gap Together) -->
    <div style="margin: 0; padding: 20px 0; background: linear-gradient(180deg, #F0FDFA 0%, #E6F7F5 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 18px;">
      
      <!-- 1. From Balance Video Articles Row -->
      <div>
        <div style="padding: 0 20px; margin-bottom: 14px;">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 21px; font-weight: 800; color: #0F3A47; margin: 0 0 4px; letter-spacing: -0.3px;">
            From Balance
          </h3>
          <div style="font-size: 13.5px; color: #115E59; font-weight: 600; margin-bottom: 4px;">
            Expert-led videos & conversations
          </div>
          <div style="font-size: 12px; color: #0D9488; font-weight: 500; opacity: 0.9;">
            In partnership with Balance
          </div>
        </div>
        <div class="scroll-h" style="padding: 0 20px 4px; gap: 14px; scroll-padding: 0 20px; scrollbar-width: none; -webkit-overflow-scrolling: touch; display: flex; overflow-x: auto;">
          ${videoCardsHtml}
        </div>
      </div>

      <!-- 2. Balance Read Articles Row (Directly Together!) -->
      <div>
        <div style="padding: 0 20px; margin-bottom: 12px;">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 19px; font-weight: 800; color: #0F3A47; margin: 0 0 4px; letter-spacing: -0.3px;">
            Balance Articles
          </h3>
          <div style="font-size: 13px; color: #115E59; font-weight: 600;">
            Expert clinical guides & evidence-based reading
          </div>
        </div>
        <div class="scroll-h" style="padding: 0 20px 4px; gap: 14px; scroll-padding: 0 20px; scrollbar-width: none; -webkit-overflow-scrolling: touch; display: flex; overflow-x: auto;">
          ${articleCardsHtml}
        </div>
      </div>

    </div>
  `;
};

window.renderBalanceVideosSection = function() {
  return window.renderCombinedBalanceModule();
};

window.renderBalanceArticlesSection = function() {
  return '';
};

window.renderArticleSection = function(title, cardsHtml) {
  return `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="padding: 0 16px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16.5px; font-weight: 700; color: #0F172A; margin: 0; letter-spacing: -0.3px;">
          ${title}
        </h3>
      </div>
      <div class="scroll-h" style="padding: 0 8px 8px; gap: 16px; scroll-padding: 0 8px; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
        <div style="width: 8px; flex-shrink: 0; margin-right: -16px; pointer-events: none;" aria-hidden="true"></div>
        ${cardsHtml}
        <div style="width: 8px; flex-shrink: 0; margin-left: -16px; pointer-events: none;" aria-hidden="true"></div>
      </div>
    </div>
  `;
};

window.renderSingleArticleCardHtml = function(a) {
  const isLocked = a.isCarePlus && !window.isMirorCarePlusSubscribed;
  return `
    <div onclick="${isLocked ? `window.openMasterclassPaywall('${a.title}')` : `window.readPersonalizedArticle('${a.title}')`}" style="min-width: 235px; max-width: 235px; flex-shrink: 0; scroll-snap-align: start; background: #FFFFFF; border-radius: 22px; border: 1px solid #F1F5F9; overflow: hidden; box-shadow: 0 6px 20px rgba(15,23,42,0.04); display: flex; flex-direction: column; cursor: pointer; transition: transform 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
      <div style="position: relative; width: 100%; height: 122px; background: #F1F5F9; overflow: hidden;">
        <img src="${a.img}" alt="${a.title}" style="width: 100%; height: 100%; object-fit: cover; display: block; ${isLocked ? 'filter: blur(5px) brightness(0.85); transform: scale(1.08);' : ''}">
        
        ${isLocked ? `
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg, #B14AC8 0%, #7A3FD1 100%); border:2px solid #FFFFFF; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 4px 14px rgba(122,63,209,0.4); z-index:3;">
            🔒
          </div>
        ` : ''}

        <span style="position: absolute; top: 10px; left: 10px; background: ${isLocked ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.75)'}; backdrop-filter: blur(6px); color: ${isLocked ? '#7A3FD1' : '#FFFFFF'}; font-size: 9.5px; font-weight: 800; padding: 3px 8px; border-radius: 8px; z-index:2;">
          ${a.tag}
        </span>
      </div>
      <div style="padding: 14px 14px 16px; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
        <div>
          <h4 style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 700; color: #0F172A; line-height: 1.35; margin: 0 0 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${a.title}
          </h4>
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 12px; font-weight: 500;">
            ${a.author} · ${a.time}
          </div>
        </div>
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; color: ${isLocked ? '#7A3FD1' : '#EC5DAA'}; display: flex; align-items: center; gap: 4px;">
          <span>${isLocked ? 'Unlock 🔒' : 'Read Article'}</span>
          <span>&rarr;</span>
        </div>
      </div>
    </div>
  `;
};

window.renderCareArticlesCarousel = function() {
  // Section 1: Hormone & Clinical Articles Data
  const hormoneArticles = [
    {
      id: 'h-1',
      title: 'Understanding HRT: Benefits, Window of Opportunity & Safety',
      tag: '🔒 CARE+',
      author: 'Dr. Sarah Jenkins',
      time: '4 min read',
      img: 'article_cooling_herbs.jpg',
      isCarePlus: true
    },
    {
      id: 'h-2',
      title: 'Estrogen Dominance vs Deficit: Reading Your Body Signals',
      tag: 'Clinical Guide',
      author: 'Endocrinology Team',
      time: '5 min read',
      img: 'article_morning_reset.jpg',
      isCarePlus: false
    },
    {
      id: 'h-3',
      title: 'Thyroid vs Perimenopause: Decoding Fatigue & Weight Shifts',
      tag: 'Hormone Health',
      author: 'Dr. Anjali Sharma',
      time: '4 min read',
      img: 'article_sleep_cat.png',
      isCarePlus: false
    }
  ];

  // Section 2: Lifestyle, Nutrition & Recovery Data
  const lifestyleArticles = [
    {
      id: 'l-1',
      title: '5 Morning Rituals to Balance Cortisol & Energy',
      tag: 'Daily Habits',
      author: 'Clinical Nutrition Team',
      time: '3 min read',
      img: 'article_morning_reset.jpg',
      isCarePlus: false
    },
    {
      id: 'l-2',
      title: 'Deep Rest: Nutritional Strategies for Night Sweats',
      tag: 'Sleep & Rest',
      author: 'Dr. Anjali Sharma',
      time: '5 min read',
      img: 'article_sleep_cat.png',
      isCarePlus: false
    },
    {
      id: 'l-3',
      title: 'Bone Density & Strength After 40: The DEXA Guide',
      tag: 'Longevity',
      author: 'Dr. Ramesh Gupta',
      time: '4 min read',
      img: 'article_cooling_herbs.jpg',
      isCarePlus: false
    }
  ];

  const hormoneCardsHtml = hormoneArticles.map(a => window.renderSingleArticleCardHtml(a)).join('');
  const lifestyleCardsHtml = lifestyleArticles.map(a => window.renderSingleArticleCardHtml(a)).join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 16px;">
      ${window.renderBalanceVideosSection()}
      ${window.renderBalanceArticlesSection()}
      ${window.renderArticleSection('Hormone & Clinical Guides', hormoneCardsHtml)}
      ${window.renderArticleSection('Lifestyle, Nutrition & Recovery', lifestyleCardsHtml)}
    </div>
  `;
};

/* --- Drive File Viewer & Uploader Handlers --- */
window.openDriveFileViewer = function(fileId) {
  const f = (window.userHealthDriveFiles || []).find(x => x.id === fileId);
  if (!f) return;
  alert(`📁 Miror Health Drive — Document Viewer\n\n📄 File: ${f.name}\n🏥 Provider: ${f.issuer}\n📅 Date: ${f.date}\n📊 Status: ${f.status}\n\n🔍 Clinical Findings:\n${f.summary}\n\n🩺 Specialist Annotation:\n${f.doctorNote}\n\n🔒 This document is end-to-end encrypted.`);
};

window.uploadToHealthDrive = function() {
  const fileTitle = prompt('Enter report name or test title to add to your Health Drive:', 'Complete Blood Count (CBC) & Vitamin D');
  if (fileTitle) {
    const newDoc = {
      id: 'rec-' + Date.now(),
      name: fileTitle.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf',
      title: fileTitle,
      category: 'lab',
      icon: '📄',
      badge: 'PDF · 1.5 MB',
      issuer: 'Uploaded by Patient',
      date: 'Today',
      status: 'Uploaded ✓',
      statusColor: '#059669',
      summary: 'Patient uploaded lab document. Ready for doctor consultation review.',
      doctorNote: 'Awaiting clinical review in next consultation.'
    };
    window.userHealthDriveFiles.unshift(newDoc);
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    SM.render();
    SM.toast(`🎉 File "${fileTitle}" added to your Health Drive!`);
  }
};

window.currentReminderCategory = window.currentReminderCategory || 'Important';

window.switchReminderCategory = function(catName) {
  window.currentReminderCategory = catName;
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

window.completedRemindersState = window.completedRemindersState || { rem1: false, rem2: false, rem3: false };

window.toggleReminderComplete = function(id) {
  window.completedRemindersState[id] = !window.completedRemindersState[id];
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

window.currentReminderDateIndex = window.currentReminderDateIndex || 2; // Thursday Aug 20

window.shiftReminderDate = function(delta) {
  window.currentReminderDateIndex = (window.currentReminderDateIndex + delta + 7) % 7;
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

/* --- Section: Reminders Screen (Lightweight Date Strip, Today Timeline & Upcoming Section) --- */
window.renderRemindersCard = function() {
  const dates = [
    { day: 18, weekday: 'Tue', hasDot: true },
    { day: 19, weekday: 'Wed', hasDot: false },
    { day: 20, weekday: 'Thu', isToday: true, hasDot: true },
    { day: 21, weekday: 'Fri', hasDot: true },
    { day: 22, weekday: 'Sat', hasDot: false },
    { day: 23, weekday: 'Sun', hasDot: true },
    { day: 24, weekday: 'Mon', hasDot: false }
  ];

  const todayReminders = [
    { id: 'rem1', time: '08:30 AM', icon: '💊', title: 'Estrogen Morning Application', category: 'Medication' },
    { id: 'rem2', time: '10:45 AM', icon: '🩺', title: 'Doctor Consultation', category: 'Consultation' },
    { id: 'rem3', time: '03:00 PM', icon: '🌿', title: 'Cortisol & Adaptogen Tea', category: 'Wellness' }
  ];

  const upcomingReminders = [
    { id: 'rem4', time: '09:00 AM', icon: '🩺', title: 'Follow-up consultation', category: 'Consultation' },
    { id: 'rem5', time: '06:30 PM', icon: '🌙', title: 'Evening wind-down routine', category: 'Routine' }
  ];

  const completedMap = window.completedRemindersState || {};

  return `
    <!-- 1. Compact Premium Date Navigation Card -->
    <div style="margin: 0 16px 14px; background: linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%); border-radius: 22px; padding: 16px 16px 14px; border: 1px solid #E9D5FF; box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);">
      
      <!-- 2-Column Compact Header Row -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 21px; font-weight: 700; color: #0F172A; margin: 0; letter-spacing: -0.4px; line-height: 1.15; flex: 1; min-width: 0;">
          Upcoming<br>reminders
        </h2>

        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <button onclick="window.shiftReminderDate(-1)" style="background: #FFFFFF; border: 1px solid #E2E8F0; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #0F172A; font-size: 14px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: all 0.15s ease;">‹</button>
            <button onclick="window.shiftReminderDate(1)" style="background: #FFFFFF; border: 1px solid #E2E8F0; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #0F172A; font-size: 14px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: all 0.15s ease;">›</button>
          </div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 600; color: #64748B; white-space: nowrap; text-align: right;">
            Thu, Aug 20
          </div>
        </div>
      </div>

      <!-- 7-Day Vertical Pill Date Strip with Tight Dot Indicators -->
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center;">
        ${dates.map(d => `
          <div onclick="SM.toast('Selected Aug ${d.day}')" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 100%; max-width: 42px; height: 58px; border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; background: ${d.isToday ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; color: ${d.isToday ? '#FFFFFF' : '#0F172A'}; border: ${d.isToday ? 'none' : '1px solid #E2E8F0'}; box-shadow: ${d.isToday ? '0 4px 14px rgba(236,72,153,0.3)' : '0 2px 6px rgba(15,23,42,0.02)'}; transform: ${d.isToday ? 'translateY(-2px)' : 'none'}; transition: all 0.15s ease; position: relative;">
              <span style="font-size: 15px; font-weight: 700; font-family: 'Montserrat', sans-serif; line-height: 1.1;">${d.day}</span>
              <span style="font-size: 10.5px; opacity: ${d.isToday ? '0.9' : '0.75'}; font-weight: 600; line-height: 1.1;">${d.weekday}</span>
              ${d.hasDot ? `<span style="width: 4px; height: 4px; border-radius: 50%; background: ${d.isToday ? '#FFFFFF' : '#EC4899'}; display: inline-block; margin-top: 2px;"></span>` : `<span style="height: 4px; margin-top: 2px;"></span>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Today Reminders Container -->
    <div style="margin: 0 16px 20px;">
      
      <!-- Today Section Header + Gradient +Add reminder CTA Button -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding: 0 2px;">
        <div>
          <h2 style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; letter-spacing: -0.3px;">
            Today
          </h2>
          <div style="font-size: 12px; color: #64748B; font-weight: 500; margin-top: 1px;">
            Thursday, Aug 20 · ${todayReminders.length} reminders
          </div>
        </div>

        <button onclick="window.openAddReminderModal()" style="background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 700; padding: 8px 16px; border-radius: 9999px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.28); transition: all 0.15s ease; display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
          <span>+ Add reminder</span>
        </button>
      </div>

      <!-- Today Reminder Cards List -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${todayReminders.map(item => {
          const isDone = completedMap[item.id];
          return `
            <div onclick="window.toggleReminderComplete('${item.id}')" style="background: #FFFFFF; border: 1px solid ${isDone ? '#E2E8F0' : '#E2E8F0'}; border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.025); opacity: ${isDone ? '0.65' : '1'};">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
                
                <!-- Interactive Checkbox Control -->
                <div style="width: 22px; height: 22px; border-radius: 50%; background: ${isDone ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; border: ${isDone ? 'none' : '2px solid #CBD5E1'}; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all 0.15s ease;">
                  ${isDone ? '✓' : ''}
                </div>

                <!-- Icon Container -->
                <div style="width: 36px; height: 36px; border-radius: 12px; background: #F8FAFC; border: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;">
                  ${item.icon}
                </div>

                <!-- Text & Time Block -->
                <div style="min-width: 0; flex: 1;">
                  <div style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 700; color: #0F172A; line-height: 1.3; text-decoration: ${isDone ? 'line-through' : 'none'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.title}
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">
                    <span style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; color: #7C3AED;">${item.time}</span>
                    <span style="font-size: 11px; color: #94A3B8;">·</span>
                    <span style="font-size: 11px; color: #64748B; font-weight: 500;">${item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 3. Upcoming Section -->
      <div style="margin-top: 24px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px; letter-spacing: -0.2px; padding: 0 2px;">
          Upcoming
        </h3>
        <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 8px; padding: 0 2px;">
          Tomorrow · Fri, Aug 21
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${upcomingReminders.map(item => {
            const isDone = completedMap[item.id];
            return `
              <div onclick="window.toggleReminderComplete('${item.id}')" style="background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 18px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; transition: all 0.15s ease; opacity: ${isDone ? '0.65' : '1'};">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
                  <div style="width: 20px; height: 20px; border-radius: 50%; background: ${isDone ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; border: ${isDone ? 'none' : '2px solid #CBD5E1'}; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 11px; font-weight: 700; flex-shrink: 0;">
                    ${isDone ? '✓' : ''}
                  </div>
                  <div style="width: 34px; height: 34px; border-radius: 10px; background: #FFFFFF; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                    ${item.icon}
                  </div>
                  <div style="min-width: 0; flex: 1;">
                    <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #0F172A; text-decoration: ${isDone ? 'line-through' : 'none'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${item.title}
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <span style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; color: #64748B;">${item.time}</span>
                      <span style="font-size: 10.5px; color: #94A3B8;">·</span>
                      <span style="font-size: 10.5px; color: #64748B;">${item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

window.selectedSpecialistTile = window.selectedSpecialistTile || null;

window.selectSpecialistTile = function(title) {
  if (window.selectedSpecialistTile === title) {
    window.selectedSpecialistTile = null;
  } else {
    window.selectedSpecialistTile = title;
  }
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

/* --- Section: Consultations Card (Richer Pink-Lavender Gradient & Compact 2x2 Grid) --- */
window.renderConsultationsCard = function(opts = {}) {
  const marginStyle = opts.noMargin ? 'margin: 0; height: 100%; box-sizing: border-box;' : 'margin: 0 16px 14px; box-sizing: border-box;';
  
  const specialists = [
    { title: 'Gynaecologist', subtitle: "Women's health", icon: '♀️' },
    { title: 'Dietitian', subtitle: 'Nutrition & diet', icon: '🍎' },
    { title: 'Menopause Specialist', subtitle: 'Hormonal health', icon: '🩺' },
    { title: 'Psychologist', subtitle: 'Mental wellbeing', icon: '🧠' }
  ];

  const selectedTitle = window.selectedSpecialistTile;
  const ctaLabel = selectedTitle ? `Continue with ${selectedTitle} →` : 'Start Consultation →';

  return `
    <div style="${marginStyle} background: linear-gradient(135deg, #FFF8FC 0%, #F8F3FF 100%); border: 1px solid rgba(218, 190, 245, 0.45); border-radius: 28px; padding: 22px 16px; color: #0F172A; position: relative; overflow: hidden; box-shadow: 0px 12px 32px rgba(70, 40, 100, 0.06); display: flex; flex-direction: column; justify-content: space-between; max-width: 100%;">
      
      <!-- 1. Header Row with Title and Canonical Miror Gradient Status Badge -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; position: relative; z-index: 2;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; margin: 0; color: #0F172A; letter-spacing: -0.3px; line-height: 1.2;">
          Talk to a Specialist
        </h3>
        <span style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(90deg, #F38DBE 0%, #EC5DAA 40%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; padding: 4px 14px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(217, 59, 159, 0.22); flex-shrink: 0;">
          Available now
        </span>
      </div>

      <!-- 2. Subtitle -->
      <p style="font-size: 13px; color: #64748B; line-height: 1.35; margin: 0 0 16px; width: 100%; position: relative; z-index: 2;">
        Connect with certified experts through your free first consultation.
      </p>

      <!-- 3. 2x2 Soft Miror Theme Specialist Option Tiles -->
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 16px; position: relative; z-index: 2;">
        ${specialists.map(s => {
          const isSelected = selectedTitle === s.title;
          return `
            <div onclick="window.selectSpecialistTile('${s.title}')" style="width: 100%; min-width: 0; box-sizing: border-box; background: ${isSelected ? '#FCE7F3' : '#FDF4F8'}; border: ${isSelected ? '1.5px solid #EC5DAA' : '1px solid #FCE7F3'}; border-radius: 16px; padding: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.15s ease; box-shadow: ${isSelected ? '0 4px 14px rgba(236,93,170,0.15)' : '0 2px 6px rgba(0,0,0,0.02)'}; position: relative;">
              <div style="width: 36px; height: 36px; min-width: 36px; border-radius: 50%; background: #FFFFFF; border: 1px solid ${isSelected ? '#FBCFE8' : '#FCE7F3'}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(236, 93, 170, 0.08);">
                ${s.icon}
              </div>
              <div style="min-width: 0; flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${s.title}
                </div>
                <div style="font-size: 10px; color: #64748B; margin-top: 1px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${s.subtitle}
                </div>
              </div>
              ${isSelected ? `<span style="font-size: 11px; font-weight: 700; color: #EC5DAA; margin-right: 4px;">✓</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- 4. Prominent Miror Theme Canonical Gradient CTA Button -->
      <button onclick="window.openBookConsultModal('${selectedTitle || ''}')" class="btn-tap-feedback" style="width: 100%; height: 50px; box-sizing: border-box; background: linear-gradient(90deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; border-radius: 9999px; padding: 0 18px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 6px 18px rgba(217, 59, 159, 0.28); transition: transform 0.18s ease, box-shadow 0.18s ease; position: relative; z-index: 2;">
        <span>${ctaLabel}</span>
      </button>
    </div>
  `;
};

/* --- Section 2: 1:1 Doctor Chat Card --- */
window.renderDoctorChatCard = function(opts = {}) {
  const marginStyle = opts.noMargin ? 'margin: 0; height: 100%; box-sizing: border-box;' : 'margin: 16px 16px 14px; box-sizing: border-box;';

  return `
    <div style="${marginStyle} background: linear-gradient(135deg, #FFF8FC 0%, #F8F3FF 100%); border: 1px solid rgba(218, 190, 245, 0.45); border-radius: 28px; padding: 22px 16px; color: #0F172A; position: relative; overflow: hidden; box-shadow: 0px 12px 32px rgba(70, 40, 100, 0.06); display: flex; flex-direction: column; justify-content: space-between; max-width: 100%;">
      
      <!-- Eyebrow Header with Doctor Icon -->
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <div style="width: 36px; height: 36px; min-width: 36px; border-radius: 50%; background: #FFFFFF; border: 1px solid #FCE7F3; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(236, 93, 170, 0.08);">
          🩺
        </div>
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; color: #DB2777; letter-spacing: 1.2px; text-transform: uppercase;">
          1:1 DOCTOR CHAT
        </div>
      </div>

      <!-- Headline -->
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; margin: 0 0 6px; color: #0F172A; letter-spacing: -0.3px; line-height: 1.2;">
        Chat with a Doctor
      </h3>

      <!-- Description -->
      <p style="font-size: 13px; color: #64748B; line-height: 1.45; margin: 0 0 20px; width: 100%;">
        Get personalised guidance from a doctor, right when you need it.
      </p>

      <!-- CTA Button -->
      <button onclick="window.openAskDoctorComposer()" class="btn-tap-feedback" style="width: 100%; height: 50px; box-sizing: border-box; background: linear-gradient(90deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; border-radius: 9999px; padding: 0 18px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 6px 18px rgba(217, 59, 159, 0.28); transition: transform 0.18s ease, box-shadow 0.18s ease;">
        <span>Start conversation →</span>
      </button>

    </div>
  `;
};

window.currentCareTab = window.currentCareTab || 'consultation';

window.switchCareTab = function(tabKey) {
  window.currentCareTab = tabKey;
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

window.careTabFilter = window.careTabFilter || 'all';

window.setCareTabFilter = function(filterKey) {
  window.careTabFilter = filterKey;
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

/* --- Helper Functions for Program Cards & Tags --- */
window.getTagPillStyle = function(tagText) {
  const t = (tagText || '').toUpperCase();
  if (t.includes('MOST POPULAR') || t.includes('POPULAR')) {
    return 'background: #F59E0B; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else if (t.includes('FREE')) {
    return 'background: #10B981; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else if (t.includes('SPOTS') || t.includes('LIMITED') || t.includes('3 SPOTS')) {
    return 'background: #E11D48; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else if (t.includes('NEW PROGRAM') || t.includes('NEW')) {
    return 'background: #F97316; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else if (t.includes('50% OFF') || t.includes('OFF') || t.includes('249')) {
    return 'background: #0D9488; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else if (t.includes('CARE+') || t.includes('599')) {
    return 'background: #EC4899; border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  } else {
    return 'background: rgba(255, 255, 255, 0.28); border: 1px solid rgba(255, 255, 255, 0.5); color: #FFFFFF; font-family: \'Montserrat\', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
  }
};

window.renderProgramCardMetaHtml = function(prog) {
  if (prog.metaType === 'doctor') {
    return `
      <div style="display:flex; align-items:center; gap:8px;">
        <img src="${prog.doctorAvatar || 'feed_dr_anjali.jpg'}" style="width:28px; height:28px; border-radius:50%; border:1.5px solid #FFFFFF; object-fit:cover;">
        <div>
          <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:800; color:#FFFFFF; line-height:1.2;">
            ${prog.doctorName || 'Dr. Ananya Sharma'}
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:9.5px; font-weight:600; color:rgba(255,255,255,0.88);">
            ${prog.doctorRole || 'OB-GYN & Wellness Specialist'}
          </div>
        </div>
      </div>
    `;
  } else if (prog.metaType === 'text') {
    return `
      <span style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; color:#FFFFFF;">
        ${prog.enrolled || 'Over 2,100+ active completions this month'}
      </span>
    `;
  } else if (prog.metaType === 'schedule') {
    return `
      <div style="display:flex; align-items:center; gap:12px; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; color:#FFFFFF;">
        <span>📅 ${prog.duration || '7 Days'}</span>
        <span>⏱️ ${prog.dailyTime || '15 min / day'}</span>
      </div>
    `;
  } else {
    // Default 'avatars' stack
    return `
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="display:flex; align-items:center; margin-right:2px;">
          <img src="feed_dr_anjali.jpg" style="width:20px; height:20px; border-radius:50%; border:1.5px solid #FFFFFF; margin-right:-5px; object-fit:cover;">
          <img src="profile_avatar.jpg" style="width:20px; height:20px; border-radius:50%; border:1.5px solid #FFFFFF; margin-right:-5px; object-fit:cover;">
          <img src="story_priya_streak.jpg" style="width:20px; height:20px; border-radius:50%; border:1.5px solid #FFFFFF; object-fit:cover;">
        </div>
        <span style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; color:#FFFFFF;">
          ${prog.enrolled || '4,200+ women joined'}
        </span>
      </div>
    `;
  }
};

/* --- Full Care Member Dashboard Assembler with Top 3-Tab Navigation (Consultation, Tracking, Records) --- */
window.renderCarePlusDashboard = function() {
  const curFilter = window.careTabFilter || 'all';
  const showJourney = curFilter === 'all';
  const showHrt = curFilter === 'all' || curFilter === 'mustknow';
  const showDoctors = curFilter === 'all' || curFilter === 'doctors';
  const showPrograms = curFilter === 'all' || curFilter === 'programs';
  const showWebinars = curFilter === 'all' || curFilter === 'webinars';

  return `
    <div style="padding: 16px 20px 100px; background: #FAF9FB; display: flex; flex-direction: column; gap: 18px;">
      
      <!-- 1. MY HEALTH JOURNEY (SIMPLIFIED PERSONALISED SUMMARY BANNER) -->
      <div class="card" style="background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); border-radius: 24px; padding: 22px; box-shadow: 0 10px 28px rgba(217,59,159,0.22); color: #FFFFFF; display: ${showJourney ? 'flex' : 'none'}; flex-direction: column; gap: 14px; position: relative; overflow: hidden;">
        
        <!-- Subtle Ambient Glow Decoration -->
        <div style="position: absolute; top: -30px; right: -20px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%); pointer-events: none;"></div>

        <!-- Top Header & Integrated Wellness Visual Row -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; z-index: 2;">
          <div style="flex: 1;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.1px; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; margin-bottom: 6px;">
              MY HEALTH JOURNEY
            </div>
            
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.25;">
              Your main focus: Better Sleep
            </h2>
          </div>

          <!-- Small Supporting Wellness Visual Icon -->
          <div style="font-size: 28px; opacity: 0.95; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));">
            🌙
          </div>
        </div>

        <!-- Full-width Personalised Copy -->
        <p style="font-family: 'Montserrat', sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.92); margin: 0; line-height: 1.45; font-weight: 500; z-index: 2; width: 100%;">
          We’re helping you improve your sleep quality, manage stress, and build healthier habits.
        </p>

        <!-- Sleek Inline Focus Chips -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; z-index: 2; padding-top: 2px;">
          <span style="background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 14px; display: inline-flex; align-items: center; gap: 5px;">
            <span>🧘</span> Stress Relief
          </span>
          <span style="background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 14px; display: inline-flex; align-items: center; gap: 5px;">
            <span>✨</span> Daily Habits
          </span>
          <span style="background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 14px; display: inline-flex; align-items: center; gap: 5px;">
            <span>📊</span> Cycle Tracking
          </span>
        </div>

      </div>

      <!-- 2. EXPLORE HRT CARE PROGRAM -->
      <div class="card card-interactive" style="background: #FAF9FC; border: 1.5px solid #F3E8FF; border-radius: 24px; padding: 20px; box-shadow: 0 4px 20px rgba(122,63,209,0.06); display: ${showHrt ? 'flex' : 'none'}; flex-direction: column; gap: 14px; position: relative; overflow: hidden; cursor: pointer;" onclick="SM.push('community-group')">
        
        <!-- Top Badges Row -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: nowrap;">
          <span style="background: #FFE4E6; border: 1px solid #FECDD3; color: #E11D48; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; display: inline-flex; align-items: center; flex-shrink: 0;">
            EXPLORE HRT
          </span>
          <span style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 800; color: #7A3FD1; background: #FAF5FF; border: 1px solid #F3E8FF; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.6px; text-transform: uppercase; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;">
            <span>🏥</span> CARE PROGRAM
          </span>
        </div>

        <!-- Middle Content Row: Text on Left & HRT Icon Badge Aligned to Top Headline -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
          <div style="flex: 1; min-width: 0;">
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: 18.5px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.3px; line-height: 1.3;">
              Is Hormone Therapy Right For You?
            </h2>
            <p style="font-family: 'Montserrat', sans-serif; font-size: 12.5px; color: #475569; margin: 0; line-height: 1.45; font-weight: 500;">
              Doctor-led bioidentical HRT evaluation, titration & personalized symptom management.
            </p>
          </div>

          <!-- HRT Bioidentical Hormone Icon Badge (Right Positioned Aligned to Headline Top) -->
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; border: 1.5px solid #F3E8FF; display: flex; align-items: center; justify-content: center; font-size: 21px; box-shadow: 0 4px 12px rgba(122,63,209,0.08); flex-shrink: 0; margin-top: 2px;" title="Bioidentical Hormones & HRT">
            🧬
          </div>
        </div>

        <!-- Footer Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(236,93,170,0.15);">
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #7A3FD1; font-weight: 800; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span>⏱️</span> 3-Month Care Program
            </div>
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10.5px; color: #64748B; font-weight: 600; white-space: nowrap;">
              Doctor Supervised
            </div>
          </div>

          <button style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: white; border: none; border-radius: 16px; padding: 7px 13px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(236,93,170,0.25); flex-shrink: 0; white-space: nowrap;">
            Explore Program →
          </button>
        </div>

      </div>

      <!-- 3. MY RECORDS -->
      <div class="card card-interactive" style="background:linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%);border:1px solid #DBEAFE;border-radius:22px;padding:18px;display:${curFilter === 'all' ? 'flex' : 'none'};align-items:center;justify-content:space-between;box-shadow:0 6px 20px rgba(37,99,235,0.06);" onclick="SM.push('health-records')">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:44px;height:44px;border-radius:14px;background:#FFFFFF;border:1px solid #BFDBFE;display:flex;align-items:center;justify-content:center;font-size:20px;color:#2563EB;box-shadow:0 2px 8px rgba(37,99,235,0.08);">📁</div>
          <div>
            <div style="font-size:10.5px;font-weight:800;letter-spacing:0.8px;color:#2563EB;text-transform:uppercase;font-family:'Montserrat',sans-serif;">MY RECORDS</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;color:#0F172A;">Lab Reports & Clinical Summary</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#64748B;">2 documents encrypted</div>
          </div>
        </div>
        <span style="font-size:18px;color:#2563EB;font-weight:800;">›</span>
      </div>

      <!-- 4. ASK MIROR -->
      <div class="card card-interactive" style="background:linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);border:1px solid #E9D5FF;border-radius:22px;padding:18px;display:${showDoctors ? 'flex' : 'none'};align-items:center;justify-content:space-between;gap:12px;box-shadow:0 6px 20px rgba(126,34,206,0.06);" onclick="window.openAskDoctorComposer ? window.openAskDoctorComposer() : SM.toast('Opening Ask Miror...')">
        <div style="display:flex;align-items:center;gap:14px;flex:1;">
          <div style="width:44px;height:44px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:20px;color:#7E22CE;box-shadow:0 2px 8px rgba(0,0,0,0.04);">💬</div>
          <div>
            <div style="font-size:10.5px;font-weight:800;letter-spacing:0.8px;color:#7E22CE;text-transform:uppercase;font-family:'Montserrat',sans-serif;">ASK MIROR</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;color:#0F172A;">Ask an Expert Doctor</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#64748B;">Get personalized health answers</div>
          </div>
        </div>
        <button style="background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;border:none;border-radius:20px;padding:9px 16px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0;box-shadow:0 4px 14px rgba(122,63,209,0.25);">
          Ask Now
        </button>
      </div>

      <!-- 5. BOOK A DOCTOR -->
      <div style="display: ${showDoctors ? 'block' : 'none'};">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">Book a Doctor</h3>
          <span style="font-family:'Montserrat',sans-serif;font-size:12px;color:#EC5DAA;font-weight:700;cursor:pointer;" onclick="SM.toast('Viewing all certified doctors')">See all →</span>
        </div>

        <div class="card card-interactive" style="background:#FFFFFF;border:1px solid #F1F5F9;border-radius:22px;padding:18px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 20px rgba(40,30,70,0.04);" onclick="SM.toast('Opening doctor consultation calendar...')">
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;background:#F1F5F9;flex-shrink:0;border:2px solid #FCE7F3;">
              <img src="feed_dr_anjali.jpg" alt="Dr. Anjali" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div>
              <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;color:#0F172A;">Dr. Anjali Sharma, MD</div>
              <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#64748B;">Reproductive Endocrinologist • 14 yrs exp</div>
              <div style="font-family:'Montserrat',sans-serif;font-size:11.5px;color:#059669;font-weight:700;margin-top:2px;">Available Today, 4:00 PM</div>
            </div>
          </div>
          <button style="background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;border:none;border-radius:18px;padding:8px 16px;font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;flex-shrink:0;box-shadow:0 4px 12px rgba(236,93,170,0.25);">
            Book 📅
          </button>
        </div>
      </div>

      <!-- 6. HEALTH PROGRAMS -->
      <div style="display: ${showPrograms ? 'block' : 'none'};">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">Care Programs</h3>
          <span style="font-family:'Montserrat',sans-serif;font-size:12px;color:#EC5DAA;font-weight:700;cursor:pointer;" onclick="SM.push('all-programs')">View all →</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px;">
          
          <!-- Card 1: 21-Day Hormone Reset (Full Cover Photo + Gradient 1 + Gold Stroke + Tag Pills) -->
          <div class="card card-interactive" onclick="window.handleProgramAction('prog-1')" style="background: linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%) padding-box, linear-gradient(135deg, #FFE89C 0%, #F2C94C 35%, #F2994A 70%, #E5A93C 100%) border-box; border: 2.5px solid transparent; border-radius: 24px; padding: 20px; box-shadow: 0 8px 24px rgba(122, 67, 160, 0.25); transition: transform 0.18s ease, box-shadow 0.18s ease; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; position: relative; overflow: hidden; min-height: 220px;">
            
            <!-- Full Cover Photo Background Layer -->
            <img src="community_yoga_reset.jpg" alt="21-Day Hormone Reset" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.28; z-index: 0; filter: contrast(1.08) brightness(0.92);">
            
            <!-- Gradient Overlay Layer -->
            <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%); z-index: 1;"></div>

            <!-- Top Tags Row: Left Tag Pill & Right Tag Pill -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; z-index: 2;">
              <span style="${window.getTagPillStyle('STARTS MON')}">
                STARTS MON
              </span>
              <span style="${window.getTagPillStyle('3 SPOTS LEFT')}">
                3 SPOTS LEFT
              </span>
            </div>

            <!-- Middle Content: Title, Description & Social Proof -->
            <div style="display: flex; flex-direction: column; gap: 6px; z-index: 2;">
              <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.25; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                21-Day Hormone Reset
              </h3>
              <p style="font-family: 'Montserrat', sans-serif; font-size: 12.5px; color: rgba(255, 255, 255, 0.92); margin: 0; line-height: 1.4; font-weight: 500;">
                Transform your body & mind from the comfort of your home with guided protocols.
              </p>

              <!-- Social Proof Meta Row -->
              ${window.renderProgramCardMetaHtml({ metaType: 'avatars', enrolled: '4,200+ women joined' })}
            </div>

            <!-- Full-Width Bottom CTA Button -->
            <button style="background: #FFFFFF; color: #7A3FD1; border: none; box-shadow: 0 4px 14px rgba(0,0,0,0.18); width: 100%; border-radius: 18px; padding: 13px; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; text-align: center; z-index: 2;">
              Unlock now
            </button>

          </div>

          <!-- Card 2: 7-Day Sleep Reset (Full Cover Photo + Gradient 3 + Tag Pills) -->
          <div class="card card-interactive" onclick="window.handleProgramAction('prog-2')" style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.60) 0%, rgba(13, 148, 136, 0.90) 100%); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 24px; padding: 20px; box-shadow: 0 8px 24px rgba(13, 148, 136, 0.25); transition: transform 0.18s ease, box-shadow 0.18s ease; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; position: relative; overflow: hidden; min-height: 220px;">
            
            <!-- Full Cover Photo Background Layer -->
            <img src="feed_sleep_routine.jpg" alt="7-Day Sleep Reset" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.18; z-index: 0; filter: contrast(1.08) brightness(0.92);">
            
            <!-- Gradient Overlay Layer -->
            <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(167, 139, 250, 0.60) 0%, rgba(13, 148, 136, 0.90) 100%); z-index: 1;"></div>

            <!-- Top Tags Row: Left Tag Pill & Right Tag Pill -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; z-index: 2;">
              <span style="${window.getTagPillStyle('MOST POPULAR 🔥')}">
                MOST POPULAR 🔥
              </span>
              <span style="${window.getTagPillStyle('FREE')}">
                FREE
              </span>
            </div>

            <!-- Middle Content: Title, Description & Social Proof -->
            <div style="display: flex; flex-direction: column; gap: 6px; z-index: 2;">
              <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.25; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                7-Day Sleep Reset
              </h3>
              <p style="font-family: 'Montserrat', sans-serif; font-size: 12.5px; color: rgba(255, 255, 255, 0.92); margin: 0; line-height: 1.4; font-weight: 500;">
                Wake up energized and set the perfect tone for your day with deep restorative sleep.
              </p>

              <!-- Meta Info Pill -->
              ${window.renderProgramCardMetaHtml({ metaType: 'schedule', duration: '7 Days', dailyTime: '15 min / day' })}
            </div>

            <!-- Full-Width Bottom CTA Button -->
            <button style="background: #FFFFFF; color: #0D9488; border: none; box-shadow: 0 4px 14px rgba(0,0,0,0.18); width: 100%; border-radius: 18px; padding: 13px; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; text-align: center; z-index: 2;">
              Start Now
            </button>

          </div>

        </div>
      </div>

      <!-- 8. WEBINARS & MASTERCLASSES SECTION -->
      <div style="display: ${showWebinars ? 'block' : 'none'}; margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="font-family:'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0;">Webinars & Masterclasses</h3>
          <span style="font-family:'Montserrat',sans-serif;font-size:12px;color:#EC5DAA;font-weight:700;cursor:pointer;" onclick="window.currentIntelFilter='webinars'; SM.push('explore');">View all →</span>
        </div>

        <div style="display:flex; gap:14px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
          ${window.MIROR_WEBINARS.slice(0, 3).map(web => {
            const isLocked = !web.isFree && !window.isMirorCarePlusSubscribed;
            return `
              <div class="card card-interactive" onclick="window.handleWebinarClick('${web.id}')" style="flex-shrink:0; width:260px; background:#FFFFFF; border:1.5px solid #F1F5F9; border-radius:22px; padding:12px; box-shadow:0 6px 20px rgba(40,30,70,0.035); display:flex; flex-direction:column; gap:10px;">
                <div style="position:relative; width:100%; height:110px; border-radius:16px; overflow:hidden; background:#0F172A;">
                  <img src="${web.thumbnail}" alt="${web.title}" style="width:100%; height:100%; object-fit:cover; display:block; ${isLocked ? 'filter: blur(5px) brightness(0.85); transform: scale(1.08);' : ''}" onerror="this.onerror=null;this.src='feed_sleep_routine.jpg';">
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:38px; height:38px; border-radius:50%; background:${isLocked ? 'linear-gradient(135deg, #B14AC8 0%, #7A3FD1 100%)' : 'rgba(236,93,170,0.88)'}; border:2px solid #FFFFFF; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 4px 14px rgba(0,0,0,0.3); z-index:3;">
                    ${isLocked ? '🔒' : '▶'}
                  </div>
                  <span style="position:absolute; top:8px; left:8px; background:${web.isFree ? '#ECFDF5' : 'rgba(255,255,255,0.92)'}; backdrop-filter:blur(8px); border:1px solid ${web.isFree ? '#A7F3D0' : '#F3E8FF'}; color:${web.isFree ? '#059669' : '#7A3FD1'}; font-family:'Montserrat',sans-serif; font-size:9.5px; font-weight:800; padding:3px 8px; border-radius:10px; text-transform:uppercase; z-index:2;">
                    ${isLocked ? '🔒 CARE+' : web.badgeText}
                  </span>
                </div>

                <div>
                  <h4 style="font-family:'Montserrat',sans-serif; font-size:14px; font-weight:800; color:#0F172A; margin:0 0 3px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                    ${web.title}
                  </h4>
                  <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; color:#64748B;">
                    ${web.speaker} • ⏱️ ${web.duration}
                  </div>
                </div>

                <button style="${isLocked ? 'background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:white; border:none; box-shadow:0 4px 14px rgba(236,93,170,0.25);' : 'border:1.8px solid #EC5DAA; color:#EC5DAA; background:transparent;'} border-radius:16px; padding:6px 14px; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; cursor:pointer; width:100%; text-align:center;">
                  ${isLocked ? 'Unlock 🔒' : 'Watch Now'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
};

/* --------------------------------------------------------------------------
   ALL HEALTH PROGRAMS DEDICATED SCREEN ROUTER & DATASET
   -------------------------------------------------------------------------- */
window.MIROR_ALL_PROGRAMS = [
  {
    id: 'prog-1',
    name: '21-Day Hormone Reset',
    desc: 'Transform your body & mind from the comfort of your home with guided protocols.',
    image: 'prog_hormone_reset.svg',
    bgImage: 'community_yoga_reset.jpg',
    duration: '21 Days',
    enrolled: '4,200+ women joined',
    isFree: false,
    hasJoined: true,
    progress: '21 Days',
    leftTag: 'STARTS MON',
    rightTag: '3 SPOTS LEFT',
    metaType: 'avatars',
    gradient: 'linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%)'
  },
  {
    id: 'prog-2',
    name: '7-Day Sleep Reset',
    desc: 'Circadian rhythm, core body temperature regulation & melatonin alignment.',
    image: 'prog_sleep_reset.svg',
    bgImage: 'feed_sleep_routine.jpg',
    duration: '7 Days',
    dailyTime: '15 min / day',
    enrolled: '2,890 enrolled',
    isFree: true,
    hasJoined: false,
    progress: null,
    leftTag: 'MOST POPULAR 🔥',
    rightTag: 'FREE',
    metaType: 'schedule',
    gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.60) 0%, rgba(13, 148, 136, 0.90) 100%)'
  },
  {
    id: 'prog-3',
    name: '14-Day Brain Fog & Focus Protocol',
    desc: 'Neuro-support nutrition, DHA cellular hydration & memory recall exercises.',
    image: 'prog_brain_fog.svg',
    bgImage: 'community_live_pulse.jpg',
    duration: '14 Days',
    enrolled: '980 enrolled',
    isFree: false,
    hasJoined: false,
    progress: null,
    leftTag: 'NEW PROGRAM ✨',
    rightTag: '₹599',
    metaType: 'doctor',
    doctorName: 'Dr. Ananya Sharma',
    doctorRole: 'OB-GYN & Wellness Specialist',
    doctorAvatar: 'feed_dr_anjali.jpg',
    gradient: 'linear-gradient(135deg, rgba(252, 165, 165, 0.80) 0%, rgba(107, 33, 168, 0.90) 100%)'
  },
  {
    id: 'prog-4',
    name: 'Pelvic Floor & Core Strength',
    desc: 'Targeted physical therapy exercises for bladder control & core stability.',
    image: 'prog_pelvic_core.svg',
    bgImage: 'story_shalini_mobility.jpg',
    duration: '10 Days',
    enrolled: 'Over 2,100+ active completions this month',
    isFree: true,
    hasJoined: true,
    progress: 'Day 3 of 10',
    leftTag: '⭐ 4.9 RATING',
    rightTag: '50% OFF — ₹249',
    metaType: 'text',
    gradient: 'linear-gradient(135deg, rgba(253, 186, 116, 0.80) 0%, rgba(219, 39, 119, 0.95) 100%)'
  },
  {
    id: 'prog-5',
    name: 'Cardiovascular & Metabolic Protection',
    desc: 'Heart health, lipid panel optimization & arterial inflammation reduction.',
    image: 'prog_cardio_protection.svg',
    bgImage: 'feed_event_banner.jpg',
    duration: '21 Days',
    enrolled: '1,800+ enrolled',
    isFree: false,
    hasJoined: false,
    progress: null,
    leftTag: 'STARTS IN 2 DAYS! ⏰',
    rightTag: '<span style="opacity:0.75;text-decoration:line-through;margin-right:4px;">₹999</span> ₹399',
    metaType: 'avatars',
    gradient: 'linear-gradient(135deg, rgba(248, 97, 123, 0.90) 0%, rgba(255, 135, 52, 0.95) 100%)'
  },
  {
    id: 'prog-6',
    name: 'Cooling Breathwork & Vasomotor Relief',
    desc: 'Instant vagus nerve stimulation exercises to stop daytime hot flashes.',
    image: 'prog_cooling_breathwork.svg',
    bgImage: 'article_cooling_herbs.jpg',
    duration: '5 Days',
    dailyTime: '10 min / day',
    enrolled: '3,410 enrolled',
    isFree: true,
    hasJoined: false,
    progress: null,
    leftTag: 'INSTANT RELIEF ❄️',
    rightTag: 'FREE',
    metaType: 'schedule',
    gradient: 'linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%)'
  }
];

window.currentProgramFilter = 'all';

window.filterAllPrograms = function(filterKey) {
  window.currentProgramFilter = filterKey;
  SM.render();
};

window.MIROR_PROGRAM_DETAILS = {
  'prog-yoga': {
    id: 'prog-yoga',
    name: '5-Day Wellness Experience for International Yoga Day',
    category: 'Yoga & Mindfulness',
    startsIn: 'STARTS IN 5 DAYS',
    coverImg: 'hero_yoga_day.jpg',
    date: 'June 17–21',
    time: '6 PM–7 PM',
    platform: 'Zoom Live',
    forWhom: 'Women Only',
    about: 'Celebrate International Yoga Day with our exclusive 5-day wellness journey designed for women. Each session blends guided yoga, breathwork, and mindfulness practices led by certified instructors. Whether you are a beginner or experienced practitioner, this program will help you build strength, flexibility, and inner calm.',
    learnList: [
      'Morning Sun Salutation Flow',
      'Pranayama & Breathing Techniques',
      'Stress Relief & Relaxation Yoga',
      'Meditation & Mindfulness Practice',
      'Yoga for Hormonal Balance'
    ],
    instructor: {
      name: 'Dr. Ananya Sharma',
      role: 'Certified Yoga Therapist - 12 yrs exp',
      avatar: 'feed_dr_anjali.jpg',
      bio: 'Dr. Ananya specializes in women’s hormonal health, therapeutic yoga, and somatic mindfulness. She has guided over 10,000 women globally toward physical and emotional balance.'
    },
    schedule: [
      { day: 'DAY 1', title: 'Foundation & Sun Salutations' },
      { day: 'DAY 2', title: 'Pranayama & Breath Control' },
      { day: 'DAY 3', title: 'Strength & Flexibility' },
      { day: 'DAY 4', title: 'Stress Relief & Relaxation' },
      { day: 'DAY 5', title: 'Integration & Meditation' }
    ],
    pricing: {
      isFree: false,
      price: '₹499',
      originalPrice: '₹999',
      discount: '50% OFF',
      tag: 'SPECIAL PRICING',
      offerBadge: 'LIMITED TIME OFFER',
      included: [
        'All 5 live interactive sessions',
        'Session recordings access (lifetime)',
        'Certificate of completion',
        'Private community group access'
      ]
    }
  },
  'prog-1': {
    id: 'prog-1',
    name: '21-Day Hormone Reset Protocol',
    category: 'Hormonal & Metabolic Health',
    startsIn: '21 DAYS PROTOCOL',
    coverImg: 'prog_hormone_reset.svg',
    date: 'June 17–21',
    time: '15 min / day',
    platform: 'In-App Guided',
    forWhom: 'Women Only',
    about: 'Restore hormonal harmony, reduce perimenopausal inflammation, and stabilize energy levels with our specialist-designed 21-day protocol combining nutrition, circadian alignment, and gentle movement.',
    learnList: [
      'Circadian Light & Cortisol Reset',
      'Anti-Inflammatory Seed Cycling',
      'Estrogen & Progesterone Balance',
      'Pelvic Circulation & Somatic Movements',
      'Sustained Energy & Sleep Optimization'
    ],
    instructor: {
      name: 'Dr. Ananya Sharma',
      role: 'Certified Yoga Therapist - 12 yrs exp',
      avatar: 'feed_dr_anjali.jpg',
      bio: 'Dr. Ananya specializes in women’s hormonal health, therapeutic yoga, and somatic mindfulness. She has guided over 10,000 women globally toward physical and emotional balance.'
    },
    schedule: [
      { day: 'DAY 1', title: 'Foundation & Sun Salutations' },
      { day: 'DAY 2', title: 'Pranayama & Breath Control' },
      { day: 'DAY 3', title: 'Strength & Flexibility' },
      { day: 'DAY 4', title: 'Stress Relief & Relaxation' },
      { day: 'DAY 5', title: 'Integration & Meditation' }
    ],
    pricing: {
      isFree: false,
      price: '₹499',
      originalPrice: '₹999',
      discount: '50% OFF',
      tag: 'SPECIAL PRICING',
      offerBadge: 'LIMITED TIME OFFER',
      included: [
        'All 5 live interactive sessions',
        'Session recordings access (lifetime)',
        'Certificate of completion',
        'Private community group access'
      ]
    }
  },
  'prog-2': {
    id: 'prog-2',
    name: '7-Day Sleep Reset Protocol',
    category: 'Sleep & Nervous System',
    startsIn: 'STARTS IN 5 DAYS',
    coverImg: 'prog_sleep_reset.svg',
    date: 'June 17–21',
    time: '6 PM–7 PM',
    platform: 'Zoom Live',
    forWhom: 'Women Only',
    about: 'Fall asleep faster and wake up deeply refreshed. This 7-day evidence-based evening ritual guides you through somatic wind-downs, nervous system de-excitation, and thermal sleep prep.',
    learnList: [
      'Morning Sun Salutation Flow',
      'Pranayama & Breathing Techniques',
      'Stress Relief & Relaxation Yoga',
      'Meditation & Mindfulness Practice',
      'Yoga for Hormonal Balance'
    ],
    instructor: {
      name: 'Dr. Ananya Sharma',
      role: 'Certified Yoga Therapist - 12 yrs exp',
      avatar: 'feed_dr_anjali.jpg',
      bio: 'Dr. Ananya specializes in women’s hormonal health, therapeutic yoga, and somatic mindfulness. She has guided over 10,000 women globally toward physical and emotional balance.'
    },
    schedule: [
      { day: 'DAY 1', title: 'Foundation & Sun Salutations' },
      { day: 'DAY 2', title: 'Pranayama & Breath Control' },
      { day: 'DAY 3', title: 'Strength & Flexibility' },
      { day: 'DAY 4', title: 'Stress Relief & Relaxation' },
      { day: 'DAY 5', title: 'Integration & Meditation' }
    ],
    pricing: {
      isFree: true,
      price: 'FREE',
      originalPrice: '₹999',
      discount: '100% FREE',
      tag: 'SPECIAL PRICING',
      offerBadge: 'LIMITED TIME OFFER',
      included: [
        'All 5 live interactive sessions',
        'Session recordings access (lifetime)',
        'Certificate of completion',
        'Private community group access'
      ]
    }
  }
};

window.handleProgramAction = function(progId) {
  window.currentSelectedProgramId = progId || 'prog-yoga';
  const item = (window.MIROR_ALL_PROGRAMS && window.MIROR_ALL_PROGRAMS.find(p => p.id === progId)) || (window.MIROR_PROGRAM_DETAILS && window.MIROR_PROGRAM_DETAILS[progId]);
  
  const isFree = item ? item.isFree : false;
  const itemName = item ? (item.name || item.title) : '21-Day Hormone Reset';

  if (!isFree && !window.isMirorCarePlusSubscribed) {
    window.openProgramPaywall(itemName);
  } else {
    SM.push('program-detail');
  }
};

window.handleJoinProgramFromDetail = function(progId) {
  const details = (window.MIROR_PROGRAM_DETAILS && window.MIROR_PROGRAM_DETAILS[progId]) || window.MIROR_PROGRAM_DETAILS['prog-yoga'];
  if (details && !details.pricing.isFree && !window.isMirorCarePlusSubscribed) {
    window.openProgramPaywall(details.name);
  } else {
    SM.toast(`Enrolled in ${details.name}! 🎉`);
    SM.push('community-group');
  }
};

SM.register('program-detail', () => {
  const pId = window.currentSelectedProgramId || 'prog-yoga';
  const prog = window.MIROR_PROGRAM_DETAILS[pId] || window.MIROR_PROGRAM_DETAILS['prog-yoga'];

  return `
    <div style="background: #FAF9FB; min-height: 100vh; position: relative;">
      
      <!-- Top Cover Header Image with Floating Nav -->
      <div style="position: relative; width: 100%; height: 260px; background: #2A1A3A;">
        <img src="${prog.coverImg}" onerror="this.onerror=null;this.src='article_morning_reset.jpg';" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.88);">
        
        <!-- Gradient Overlay -->
        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(15,23,42,0.85) 100%);"></div>

        <!-- Top Floating Controls -->
        <div style="position: absolute; top: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
          <button onclick="SM.pop()" style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer;">
            ‹
          </button>
          <div style="display: flex; gap: 10px;">
            <button onclick="SM.toast('Link copied! 🔗')" style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">
              🔗
            </button>
            <button onclick="SM.toast('Saved to favorites! ❤️')" style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">
              ❤️
            </button>
          </div>
        </div>

        <!-- Bottom Badges inside Banner -->
        <div style="position: absolute; bottom: 20px; left: 18px; right: 18px; display: flex; justify-content: space-between; align-items: center; z-index: 5;">
          <span style="background: rgba(244, 114, 182, 0.25); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.6); color: #FFF; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 12px; letter-spacing: 0.8px; text-transform: uppercase;">
            ${prog.startsIn}
          </span>
          <span style="color: #F7B6D2; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700;">
            ${prog.category}
          </span>
        </div>
      </div>

      <!-- Screen Body Content Container -->
      <div style="padding: 20px 18px 120px; display: flex; flex-direction: column; gap: 18px; border-radius: 28px 28px 0 0; margin-top: -20px; background: #FAF9FB; position: relative; z-index: 10;">
        
        <!-- Title Header -->
        <div>
          <h1 style="font-family: 'Montserrat', sans-serif; font-size: 21px; font-weight: 800; color: #0F172A; margin: 0 0 6px; line-height: 1.3; letter-spacing: -0.3px;">
            ${prog.name}
          </h1>
        </div>

        <!-- 2x2 Matrix Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #FDF2F8; color: #DB2777; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">📅</div>
            <div>
              <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family:'Montserrat',sans-serif; letter-spacing: 0.5px;">DATE</div>
              <div style="font-size: 12px; font-weight: 700; color: #0F172A; font-family:'Montserrat',sans-serif;">${prog.date}</div>
            </div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #F0F9FF; color: #0284C7; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">⏰</div>
            <div>
              <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family:'Montserrat',sans-serif; letter-spacing: 0.5px;">TIME</div>
              <div style="font-size: 12px; font-weight: 700; color: #0F172A; font-family:'Montserrat',sans-serif;">${prog.time}</div>
            </div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #FAF5FF; color: #7E22CE; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">📹</div>
            <div>
              <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family:'Montserrat',sans-serif; letter-spacing: 0.5px;">PLATFORM</div>
              <div style="font-size: 12px; font-weight: 700; color: #0F172A; font-family:'Montserrat',sans-serif;">${prog.platform}</div>
            </div>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #F0FDF4; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">👥</div>
            <div>
              <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase; font-family:'Montserrat',sans-serif; letter-spacing: 0.5px;">FOR</div>
              <div style="font-size: 12px; font-weight: 700; color: #0F172A; font-family:'Montserrat',sans-serif;">${prog.forWhom}</div>
            </div>
          </div>
        </div>

        <!-- About the Program Card -->
        <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 20px; padding: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">About the Program</h3>
          <p style="font-family: 'Montserrat', sans-serif; font-size: 13px; color: #475569; line-height: 1.55; margin: 0; font-weight: 400;">
            ${prog.about}
          </p>
        </div>

        <!-- What You'll Learn Card -->
        <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 20px; padding: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 12px;">What You'll Learn</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${prog.learnList.map(item => `
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 22px; height: 22px; border-radius: 50%; background: #FCE7F3; color: #DB2777; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">✓</div>
                <span style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #334155;">${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Meet Your Instructor Card -->
        <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 20px; padding: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 14px;">Meet Your Instructor</h3>
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
            <img src="${prog.instructor.avatar}" onerror="this.onerror=null;this.src='profile_avatar.jpg';" alt="${prog.instructor.name}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid #FCE7F3;">
            <div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 800; color: #0F172A;">${prog.instructor.name}</div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; color: #9333EA; margin-top: 2px;">${prog.instructor.role}</div>
            </div>
          </div>
          <p style="font-family: 'Montserrat', sans-serif; font-size: 12.5px; color: #475569; line-height: 1.5; margin: 0;">
            ${prog.instructor.bio}
          </p>
        </div>

        <!-- Program Schedule Card -->
        <div style="background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 20px; padding: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 14px;">Program Schedule</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${prog.schedule.map((item, idx) => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; ${idx < prog.schedule.length - 1 ? 'border-bottom: 1px solid #F1F5F9;' : ''}">
                <span style="background: #FAF5FF; color: #7E22CE; font-family: 'Montserrat', sans-serif; font-size: 10.5px; font-weight: 800; padding: 4px 10px; border-radius: 10px; border: 1px solid #F3E8FF;">${item.day}</span>
                <span style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #1E293B; flex: 1; margin-left: 14px;">${item.title}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Special Pricing / Offer Card -->
        <div style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 1.5px solid #FCE7F3; border-radius: 22px; padding: 18px; box-shadow: 0 6px 20px rgba(236,93,170,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 10px; font-weight: 800; letter-spacing: 0.8px; color: #EC5DAA; text-transform: uppercase; font-family:'Montserrat',sans-serif;">${prog.pricing.tag}</span>
            <span style="background: rgba(236,93,170,0.1); color: #DB2777; font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 800; padding: 3px 8px; border-radius: 8px; text-transform: uppercase;">${prog.pricing.offerBadge}</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px;">
            <span style="font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 900; color: #0F172A;">${prog.pricing.price}</span>
            ${prog.pricing.originalPrice ? `<span style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: #94A3B8; text-decoration: line-through;">${prog.pricing.originalPrice}</span>` : ''}
            ${prog.pricing.discount ? `<span style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; color: #059669;">(${prog.pricing.discount})</span>` : ''}
          </div>

          <div style="border-top: 1px dashed #FBCFE8; padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
            ${prog.pricing.included.map(inc => `
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #DB2777; font-size: 12px; font-weight: 800;">✓</span>
                <span style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; color: #475569;">${inc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Primary Action CTA Button (In-Page) -->
        <div style="margin-top: 4px; margin-bottom: 24px;">
          <button onclick="window.handleJoinProgramFromDetail('${prog.id}')" style="background: linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; border: none; box-shadow: 0 8px 24px rgba(236,93,170,0.38); width: 100%; border-radius: 24px; padding: 16px; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            JOIN PROGRAM ${prog.pricing && prog.pricing.price ? `- ${prog.pricing.price}` : ''} →
          </button>
        </div>

      </div>

    </div>
  `;
});

SM.register('all-programs', () => {
  const activeFilter = window.currentProgramFilter || 'all';
  let filtered = window.MIROR_ALL_PROGRAMS;
  if (activeFilter === 'joined') {
    filtered = filtered.filter(p => p.hasJoined);
  } else if (activeFilter === 'free') {
    filtered = filtered.filter(p => p.isFree);
  } else if (activeFilter === 'paid') {
    filtered = filtered.filter(p => !p.isFree);
  }

  const filters = [
    { key: 'all', label: 'All Programs' },
    { key: 'joined', label: 'In Progress' },
    { key: 'free', label: 'FREE' },
    { key: 'paid', label: 'CARE+' }
  ];

  return `
    ${topBar('All Programs', { back: true })}
    <div style="background:#FAF9FB; min-height:85vh; padding:16px 16px 100px; display:flex; flex-direction:column; gap:16px;">
      
      <!-- Top Banner -->
      <div style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 1.5px solid #FCE7F3; border-radius: 22px; padding: 18px 16px; box-shadow: 0 6px 20px rgba(236,93,170,0.06);">
        <div style="font-size: 10.5px; font-weight: 800; letter-spacing: 1px; color: #EC5DAA; text-transform: uppercase; font-family:'Montserrat',sans-serif; margin-bottom: 4px;">SPECIALIST-LED WELLNESS PROTOCOLS</div>
        <h2 style="font-family:'Montserrat',sans-serif; font-size: 19px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.3px;">Guided Health Programs</h2>
        <p style="font-family:'Montserrat',sans-serif; font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.45;">Step-by-step 5 to 21 day protocols tailored for hormonal health, sleep, energy, and cognition.</p>
      </div>

      <!-- Filter Chips -->
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
        ${filters.map(f => {
          const isActive = activeFilter === f.key;
          return `
            <button onclick="window.filterAllPrograms('${f.key}')" style="flex-shrink:0; border:${isActive ? 'none' : '1.5px solid #F1F5F9'}; border-radius:18px; padding:7px 14px; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:${isActive ? '800' : '700'}; background:${isActive ? 'linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; color:${isActive ? '#FFFFFF' : '#64748B'}; box-shadow:${isActive ? '0 3px 12px rgba(122,63,209,0.22)' : '0 2px 6px rgba(0,0,0,0.02)'}; cursor:pointer; transition:all 0.15s ease;">
              ${f.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- List of Program Cards -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${filtered.map((prog, idx) => {
          const gradients = [
            'linear-gradient(135deg, rgba(249, 118, 149, 0.85) 0%, rgba(122, 67, 160, 0.95) 100%)',
            'linear-gradient(135deg, rgba(252, 165, 165, 0.80) 0%, rgba(107, 33, 168, 0.90) 100%)',
            'linear-gradient(135deg, rgba(167, 139, 250, 0.60) 0%, rgba(13, 148, 136, 0.90) 100%)',
            'linear-gradient(135deg, rgba(253, 186, 116, 0.80) 0%, rgba(219, 39, 119, 0.95) 100%)',
            'linear-gradient(135deg, rgba(248, 97, 123, 0.90) 0%, rgba(255, 135, 52, 0.95) 100%)'
          ];
          const currentGradient = prog.gradient || gradients[idx % gradients.length];
          const isCarePlus = !prog.isFree;
          const isProgramLocked = !prog.isFree && !window.isMirorCarePlusSubscribed;
          const ctaText = prog.isFree ? 'Start Now' : 'Unlock now';
          const leftTag = prog.leftTag || (isProgramLocked ? '🔒 CARE+' : 'STARTS MON');
          const rightTag = prog.rightTag || (prog.isFree ? 'FREE' : '3 SPOTS LEFT');
          const bgImg = prog.bgImage || 'community_yoga_reset.jpg';

          const cardBorderStyle = isCarePlus
            ? `background: ${currentGradient} padding-box, linear-gradient(135deg, #FFE89C 0%, #F2C94C 35%, #F2994A 70%, #E5A93C 100%) border-box; border: 2.5px solid transparent; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);`
            : `background: ${currentGradient}; border: 1px solid rgba(255, 255, 255, 0.35); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);`;

          const bgOpacity = (prog.id === 'prog-2' || prog.id === 'prog-3') ? 0.18 : 0.28;

          const ctaTextColors = ['#8B1E9B', '#00A389', '#6B21A8', '#D91E5B', '#E65C00'];
          const ctaTextColor = ctaTextColors[idx % ctaTextColors.length];

          return `
            <div class="card card-interactive" onclick="window.handleProgramAction('${prog.id}')" style="${cardBorderStyle} border-radius: 24px; padding: 20px; transition: transform 0.18s ease, box-shadow 0.18s ease; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; position: relative; overflow: hidden; min-height: 220px;">
              
              <!-- Full Cover Photo Background Layer -->
              <img src="${bgImg}" alt="${prog.name}" onerror="this.onerror=null;this.src='community_yoga_reset.jpg';" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: ${bgOpacity}; z-index: 0; filter: contrast(1.08) brightness(0.92);">
              
              <!-- Gradient Overlay Layer -->
              <div style="position: absolute; inset: 0; background: ${currentGradient}; z-index: 1;"></div>

              <!-- Top Tags Row: Left Tag Pill & Right Tag Pill -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; z-index: 2;">
                <span style="${window.getTagPillStyle(leftTag)}">
                  ${leftTag}
                </span>
                <span style="${window.getTagPillStyle(rightTag)}">
                  ${rightTag}
                </span>
              </div>

              <!-- Middle Content: Title, Description & Social Proof -->
              <div style="display: flex; flex-direction: column; gap: 6px; z-index: 2;">
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.25; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                  ${prog.name}
                </h3>
                <p style="font-family: 'Montserrat', sans-serif; font-size: 12.5px; color: rgba(255, 255, 255, 0.92); margin: 0; line-height: 1.4; font-weight: 500;">
                  ${prog.desc}
                </p>

                <!-- Dynamic Varied Social Proof Meta Row -->
                ${window.renderProgramCardMetaHtml(prog)}
              </div>

              <!-- Full-Width Bottom CTA Button -->
              <button style="background: #FFFFFF; color: ${ctaTextColor}; border: none; box-shadow: 0 4px 14px rgba(0,0,0,0.18); width: 100%; border-radius: 18px; padding: 13px; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; text-align: center; z-index: 2;">
                ${ctaText}
              </button>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
});

/* --------------------------------------------------------------------------
   WEBINARS & MASTERCLASSES DEDICATED SYSTEM
   -------------------------------------------------------------------------- */
window.MIROR_WEBINARS = [
  {
    id: 'web-1',
    title: 'Navigating Estrogen Shifts & Perimenopause Brain Fog',
    desc: 'Clinical breakdown of bioidentical HRT options, neuro-protection, and foggy memory resets.',
    speaker: 'Dr. Sarah Jenkins',
    role: 'Senior Endocrinologist & Menopause Specialist',
    avatar: 'story_sarah_doctor.jpg',
    thumbnail: 'community_live_pulse.jpg',
    duration: '42 mins',
    views: '3.4k views',
    isFree: false,
    badgeText: 'CARE+ PREMIUM',
    category: 'Hormone Health'
  },
  {
    id: 'web-2',
    title: 'Circadian Temperature Drops & Deep REM Sleep',
    desc: 'Step-by-step evening protocol to eliminate night sweats, hot flashes & midnight awakenings.',
    speaker: 'Dr. Anjali Sharma',
    role: 'Sleep & Circadian Rhythm Specialist',
    avatar: 'feed_dr_anjali.jpg',
    thumbnail: 'feed_sleep_routine.jpg',
    duration: '28 mins',
    views: '5.1k views',
    isFree: true,
    badgeText: 'FREE WEBINAR',
    category: 'Sleep & Recovery'
  },
  {
    id: 'web-3',
    title: 'Pelvic Core Stability & Bladder Control After 40',
    desc: 'Targeted physical therapy exercises and neuromuscular techniques to rebuild pelvic core strength.',
    speaker: 'Dr. Kavita Rao',
    role: 'Women\'s Physical Therapy Director',
    avatar: 'story_sarah_doctor.jpg',
    thumbnail: 'community_yoga_reset.jpg',
    duration: '35 mins',
    views: '2.8k views',
    isFree: false,
    badgeText: 'CARE+ PREMIUM',
    category: 'Physical Therapy'
  },
  {
    id: 'web-4',
    title: 'Cardiovascular Vitality & Cholesterol in Perimenopause',
    desc: 'How declining estrogen impacts lipid panels, vascular inflammation, and heart health.',
    speaker: 'Dr. Priya Mehta',
    role: 'Preventive Cardiology & Women\'s Health Specialist',
    avatar: 'feed_dr_anjali.jpg',
    thumbnail: 'story_shreya_salad.jpg',
    duration: '30 mins',
    views: '4.2k views',
    isFree: true,
    badgeText: 'FREE WEBINAR',
    category: 'Heart Health'
  }
];

window.handleWebinarClick = function(webinarId) {
  const item = window.MIROR_WEBINARS.find(w => w.id === webinarId);
  if (!item) return;

  if (item.isFree || window.isMirorCarePlusSubscribed) {
    window.openWebinarPlayerModal(item);
  } else {
    window.openMasterclassPaywall(item.title);
  }
};

window.openWebinarPlayerModal = function(webinar) {
  let modal = document.getElementById('webinar-player-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'webinar-player-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeWebinarPlayerModal()" style="opacity:1; pointer-events:auto; z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:901; border-radius:28px 28px 0 0; padding:20px; max-height:90vh; display:flex; flex-direction:column;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Header Row -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
        <span style="background:${webinar.isFree ? '#ECFDF5' : '#FAF5FF'}; border:1px solid ${webinar.isFree ? '#A7F3D0' : '#F3E8FF'}; color:${webinar.isFree ? '#059669' : '#7A3FD1'}; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; padding:4px 12px; border-radius:14px; text-transform:uppercase;">
          ${webinar.isFree ? 'FREE WEBINAR' : 'CARE+ MASTERCLASS'}
        </span>
        <button onclick="window.closeWebinarPlayerModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:34px; height:34px; font-size:16px; color:#64748B; cursor:pointer;">✕</button>
      </div>

      <!-- Video Screen Frame Container -->
      <div style="position:relative; width:100%; height:200px; border-radius:20px; overflow:hidden; background:#0F172A; margin-bottom:16px; box-shadow:0 8px 24px rgba(15,23,42,0.15);">
        <img src="${webinar.thumbnail}" alt="${webinar.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.85;">
        
        <!-- Video Play Overlay Button -->
        <button onclick="SM.toast('Playing webinar stream... 🎬');" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:60px; height:60px; border-radius:50%; background:rgba(236,93,170,0.92); border:3px solid #FFFFFF; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 6px 20px rgba(236,93,170,0.5); cursor:pointer;">
          ▶
        </button>

        <!-- Video Duration & Views Overlay -->
        <div style="position:absolute; bottom:12px; left:12px; right:12px; display:flex; align-items:center; justify-content:space-between; z-index:2;">
          <span style="background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); color:#FFFFFF; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; padding:4px 10px; border-radius:10px;">
            ⏱️ ${webinar.duration}
          </span>
          <span style="background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); color:#FFFFFF; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; padding:4px 10px; border-radius:10px;">
            👁️ ${webinar.views}
          </span>
        </div>
      </div>

      <!-- Scrollable Content Details -->
      <div style="overflow-y:auto; max-height:55vh; padding-right:2px;">
        <h2 style="font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:#0F172A; margin:0 0 8px; letter-spacing:-0.3px;">
          ${webinar.title}
        </h2>
        <p style="font-family:'Montserrat',sans-serif; font-size:13px; color:#475569; margin:0 0 16px; line-height:1.5;">
          ${webinar.desc}
        </p>

        <!-- Speaker Info Header Card -->
        <div style="background:#FFF0F6; border:1px solid #FCE7F3; border-radius:18px; padding:14px; display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <img src="${webinar.avatar}" alt="${webinar.speaker}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid #EC5DAA;" onerror="this.onerror=null;this.src='story_sarah_doctor.jpg';">
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:800; color:#0F172A;">
              ${webinar.speaker}
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#EC5DAA; font-weight:700;">
              ${webinar.role}
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div style="display:flex; gap:10px;">
          <button onclick="SM.toast('Playing webinar full video... 🎬');" style="flex:1; background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:#FFFFFF; border:none; border-radius:18px; padding:12px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:800; cursor:pointer; box-shadow:0 4px 14px rgba(236,93,170,0.3);">
            ▶ Watch Webinar
          </button>
          <button onclick="window.closeWebinarPlayerModal(); openAskDoctorComposer('expert-answers');" style="flex:1; border:1.8px solid #EC5DAA; color:#EC5DAA; background:transparent; border-radius:18px; padding:12px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:800; cursor:pointer;">
            💬 Ask Speaker
          </button>
        </div>
      </div>

    </div>
  `;
};

window.closeWebinarPlayerModal = function() {
  const modal = document.getElementById('webinar-player-modal');
  if (modal) modal.remove();
};

window.renderWebinarsFeedSection = function() {
  return `
    <div style="padding:0 20px 20px; display:flex; flex-direction:column; gap:16px;">
      
      <!-- Top Banner Card (Includes Webinars & Articles) -->
      <div style="background: linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 100%); border: 1.5px solid #FCE7F3; border-radius: 22px; padding: 18px 16px; box-shadow: 0 6px 20px rgba(236,93,170,0.06);">
        <div style="font-size: 10.5px; font-weight: 800; letter-spacing: 1px; color: #EC5DAA; text-transform: uppercase; font-family:'Montserrat',sans-serif; margin-bottom: 4px;">EXPERT GUIDES, WEBINARS & ARTICLES</div>
        <h2 style="font-family:'Montserrat',sans-serif; font-size: 19px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.3px;">Webinars & Articles</h2>
        <p style="font-family:'Montserrat',sans-serif; font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.45;">Watch evidence-based specialist presentations, clinical deep-dives, and read expert guides.</p>
      </div>

      <!-- Webinars & Masterclasses Section Header -->
      <div style="margin-top:4px;">
        <h3 style="font-family:'Montserrat',sans-serif; font-size:16px; font-weight:800; color:#0F172A; margin:0;">
          Webinars & Masterclasses
        </h3>
      </div>

      <!-- Horizontal Scrollable Webinars Carousel -->
      <div style="display:flex; gap:14px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
        ${window.MIROR_WEBINARS.map(web => {
          const isLocked = !web.isFree && !window.isMirorCarePlusSubscribed;
          const badgeBg = web.isFree ? '#ECFDF5' : '#FAF5FF';
          const badgeBorder = web.isFree ? '#A7F3D0' : '#F3E8FF';
          const badgeColor = web.isFree ? '#059669' : '#7A3FD1';

          return `
            <div class="card card-interactive" onclick="window.handleWebinarClick('${web.id}')" style="flex-shrink:0; width:275px; background:#FFFFFF; border:1.5px solid #F1F5F9; border-radius:24px; padding:14px; box-shadow:0 8px 24px rgba(40,30,70,0.04); transition:transform 0.18s ease; display:flex; flex-direction:column; justify-content:space-between; gap:12px;">
              
              <!-- Video Thumbnail Container -->
              <div style="position:relative; width:100%; height:135px; border-radius:18px; overflow:hidden; background:#0F172A;">
                <img src="${web.thumbnail}" alt="${web.title}" style="width:100%; height:100%; object-fit:cover; display:block; ${isLocked ? 'filter: blur(6px) brightness(0.85); transform: scale(1.08);' : ''}" onerror="this.onerror=null;this.src='feed_sleep_routine.jpg';">
                
                <!-- Play Overlay Button -->
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; border-radius:50%; background:${isLocked ? 'linear-gradient(135deg, #B14AC8 0%, #7A3FD1 100%)' : 'rgba(236,93,170,0.88)'}; border:2.5px solid #FFFFFF; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 16px rgba(0,0,0,0.3); z-index:3;">
                  ${isLocked ? '🔒' : '▶'}
                </div>

                <!-- Top Badges Overlay -->
                <div style="position:absolute; top:10px; left:10px; right:10px; display:flex; align-items:center; justify-content:space-between; z-index:2;">
                  <span style="background:${badgeBg}; border:1px solid ${badgeBorder}; color:${badgeColor}; font-family:'Montserrat',sans-serif; font-size:9.5px; font-weight:800; padding:3px 9px; border-radius:12px; letter-spacing:0.6px; text-transform:uppercase; box-shadow:0 2px 8px rgba(0,0,0,0.12);">
                    ${isLocked ? '🔒 CARE+ PREMIUM' : web.badgeText}
                  </span>
                  <span style="background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); color:#FFFFFF; font-family:'Montserrat',sans-serif; font-size:10.5px; font-weight:700; padding:3px 8px; border-radius:10px;">
                    ⏱️ ${web.duration}
                  </span>
                </div>
              </div>

              <!-- Title & Description -->
              <div style="flex:1;">
                <h3 style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:800; color:#0F172A; margin:0 0 4px; letter-spacing:-0.3px; line-height:1.35; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                  ${web.title}
                </h3>
                <p style="font-family:'Montserrat',sans-serif; font-size:12px; color:#475569; margin:0; line-height:1.4; font-weight:500; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                  ${web.desc}
                </p>
              </div>

              <!-- Speaker Footer Row -->
              <div style="display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid #F8FAFC; margin-top:auto;">
                <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0; padding-right:6px;">
                  <img src="${web.avatar}" alt="${web.speaker}" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:1.5px solid #FCE7F3; flex-shrink:0;" onerror="this.onerror=null;this.src='story_sarah_doctor.jpg';">
                  <div style="min-width:0;">
                    <div style="font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${web.speaker}
                    </div>
                  </div>
                </div>

                <button style="${isLocked ? 'background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color:white; border:none;' : 'border:1.8px solid #EC5DAA; color:#EC5DAA; background:transparent;'} border-radius:16px; padding:6px 14px; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:700; cursor:pointer; flex-shrink:0;">
                  ${isLocked ? 'Unlock 🔒' : 'Watch Now'}
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
};

/* --- Standalone Explore Tab Screen (Educational & Content Hub) --- */
window.renderExploreScreen = function() {
  const activeIntelFilter = window.currentIntelFilter || 'all';

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'webinars', label: 'Webinars 🎥' },
    { id: 'must-know', label: 'Must Know' },
    { id: 'new-intel', label: 'New Intel' },
    { id: 'from-experts', label: 'From the Experts' },
    { id: 'live', label: 'Live' },
    { id: 'in-focus', label: 'In Focus' },
    { id: 'watch-this', label: 'Watch This' },
    { id: 'take-action', label: 'Take Action' }
  ];

  return `
    <div class="screen-header screen-fixed-header" style="background:#FFFFFF; border-bottom:1px solid #F1F5F9; padding: 10px 20px 8px; box-shadow:0 2px 10px rgba(0,0,0,0.02);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <h1 style="font-family:'Montserrat',sans-serif; font-size:20px; font-weight:800; color:#0F172A; margin:0; letter-spacing:-0.4px;">Meno Intel</h1>
        
        <button class="btn-icon card-interactive" onclick="SM.push('search')" style="width:36px;height:36px;min-width:36px;min-height:36px;max-width:36px;max-height:36px;aspect-ratio:1/1;flex-shrink:0;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#0F172A;transition:all 0.15s ease;" title="Search" aria-label="Search Meno Intel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <!-- Horizontal Scrollable Category Filter Strip -->
      <div style="display:flex; gap:10px; overflow-x:auto; padding:4px 0 10px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
        ${filters.map(f => {
          const isActive = activeIntelFilter === f.id;
          return `
            <button onclick="window.currentIntelFilter='${f.id}'; SM.render();" style="flex-shrink:0; border-radius:9999px; padding:8px 20px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:${isActive ? '800' : '600'}; white-space:nowrap; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border:${isActive ? 'none' : '1.5px solid #CBD5E1'}; background:${isActive ? 'linear-gradient(135deg, #EC5DAA 0%, #D93B9F 40%, #B14AC8 75%, #7A3FD1 100%)' : '#FFFFFF'}; color:${isActive ? '#FFFFFF' : '#475569'}; box-shadow:${isActive ? '0 4px 16px rgba(212,78,147,0.38)' : '0 1px 3px rgba(0,0,0,0.02)'}; transform:${isActive ? 'translateY(-1px)' : 'none'};">
              ${f.label}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <div class="care-dashboard-wrapper" style="padding: 16px 0 120px; background: #F4F4F6;">
      ${activeIntelFilter === 'all' ? `
        ${window.renderWebinarsFeedSection()}
        ${window.renderCareArticlesCarousel()}
      ` : activeIntelFilter === 'webinars' ? `
        ${window.renderWebinarsFeedSection()}
      ` : `
        ${window.renderCareArticlesCarousel()}
      `}
    </div>
  `;
};

SM.register('explore', () => window.renderExploreScreen());

/* --------------------------------------------------------------------------
   MIROR CARE DEDICATED SCREEN ROUTER
   -------------------------------------------------------------------------- */
SM.register('care-plus', () => {
  return `
    <!-- Sticky Top Navigation Bar & Filter Bar -->
    <div class="home-header-sticky screen-fixed-header" style="position:sticky;top:0;z-index:40;background:#FFFFFF;border-bottom:1px solid #F1F5F9;box-shadow:0 1px 4px rgba(0,0,0,0.02);">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px 4px;">
        
        <!-- Left: Header Title -->
        <h1 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.4px;color:#0F172A;margin:0;">
          Miror Care
        </h1>

        <!-- Right: Search Icon -->
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="btn-icon card-interactive" onclick="SM.push('search')" style="width:36px;height:36px;min-width:36px;min-height:36px;max-width:36px;max-height:36px;aspect-ratio:1/1;flex-shrink:0;border-radius:50%;background:#F8FAFC;border:1px solid #E2E8F0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#0F172A;transition:all 0.15s ease;" title="Search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

      </div>

      <!-- Sticky Horizontal Filter Bar (Matching Meno Intel Size & Spacing) -->
      <div style="display: flex; gap: 10px; overflow-x: auto; padding: 4px 20px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
        ${[
          { id: 'all', label: 'All' },
          { id: 'programs', label: 'Care Programs 🏥' },
          { id: 'doctors', label: 'Doctors 🩺' },
          { id: 'webinars', label: 'Webinars 🎥' },
          { id: 'mustknow', label: 'Must Know 💡' }
        ].map(f => {
          const curFilter = window.careTabFilter || 'all';
          const active = curFilter === f.id;
          return `
            <button class="care-filter-btn" data-filter="${f.id}" onclick="window.setCareTabFilter('${f.id}')" style="flex-shrink:0; border-radius:9999px; padding:8px 20px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:${active ? '800' : '600'}; white-space:nowrap; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border:${active ? 'none' : '1.5px solid #CBD5E1'}; background:${active ? 'linear-gradient(135deg, #EC5DAA 0%, #D93B9F 40%, #B14AC8 75%, #7A3FD1 100%)' : '#FFFFFF'}; color:${active ? '#FFFFFF' : '#475569'}; box-shadow:${active ? '0 4px 16px rgba(212,78,147,0.38)' : '0 1px 3px rgba(0,0,0,0.02)'}; transform:${active ? 'translateY(-1px)' : 'none'};">
              ${f.label}
            </button>
          `;
        }).join('')}
      </div>

    </div>
    ${window.renderCarePlusDashboard()}
  `;
});

/* --------------------------------------------------------------------------
   HEALTH RECORDS DEDICATED SCREEN ROUTER & VAULT LOGIC
   -------------------------------------------------------------------------- */
window.healthRecordsList = window.healthRecordsList || [
  {
    id: 'rec-1',
    title: 'Complete Hormone Panel (FSH, E2, LH, TSH)',
    category: 'Lab Tests',
    icon: '🧪',
    iconBg: '#F0FDF4',
    iconBorder: '#DCFCE7',
    date: 'Aug 14, 2026',
    size: '1.8 MB PDF',
    doctor: 'Dr. Anjali Sharma',
    lab: 'Thyrocare Clinical Labs',
    notes: 'Estradiol level: 48 pg/mL. FSH: 24.6 mIU/mL (indicates perimenopause transition).'
  },
  {
    id: 'rec-2',
    title: 'DEXA Bone Mineral Density (Spine & Hip)',
    category: 'Scans & DEXA',
    icon: '🦴',
    iconBg: '#F8FAFC',
    iconBorder: '#E2E8F0',
    date: 'Jul 28, 2026',
    size: '3.2 MB PDF',
    doctor: 'Dr. Ramesh Gupta',
    lab: 'Apex Diagnostic Imaging',
    notes: 'T-score: -0.8 (Normal bone density). Re-scan recommended in 2 years.'
  },
  {
    id: 'rec-3',
    title: 'HRT Prescription & Clinical Chart',
    category: 'Prescriptions',
    icon: '💊',
    iconBg: '#FFF0F6',
    iconBorder: '#FCE7F3',
    date: 'Aug 02, 2026',
    size: '650 KB PDF',
    doctor: 'Dr. Priya Mehta',
    lab: 'Miror Telehealth Clinic',
    notes: 'Prometrium 100mg nightly + Estradiol 0.05mg patch twice weekly.'
  },
  {
    id: 'rec-4',
    title: 'Lipid & Metabolic Cardiovascular Panel',
    category: 'Lab Tests',
    icon: '❤️',
    iconBg: '#FEF2F2',
    iconBorder: '#FEE2E2',
    date: 'Jun 15, 2026',
    size: '2.1 MB PDF',
    doctor: 'Dr. Anjali Sharma',
    lab: 'Suburban Diagnostics',
    notes: 'HDL: 62 mg/dL, LDL: 110 mg/dL, Fasting Glucose: 88 mg/dL. Excellent metabolic profile.'
  }
];

window.healthRecordsFilter = window.healthRecordsFilter || 'all';

window.filterHealthRecords = function(catId) {
  window.healthRecordsFilter = catId;
  SM.render();
};

window.openUploadOptionsModal = function() {
  let modal = document.getElementById('upload-records-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'upload-records-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeUploadOptionsModal()" style="opacity:1; pointer-events:auto; z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:901; border-radius:28px 28px 0 0; padding:24px 20px;">
      
      <div class="bottom-sheet-handle"></div>

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
        <h3 style="font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:#0F172A; margin:0;">
          Upload Health Report
        </h3>
        <button onclick="window.closeUploadOptionsModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:32px; height:32px; font-size:16px; color:#64748B; cursor:pointer;">✕</button>
      </div>

      <p style="font-family:'Montserrat',sans-serif; font-size:13px; color:#64748B; margin:0 0 20px;">
        Choose how you would like to upload your medical documents to your encrypted vault.
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
        
        <!-- Option 1: Take Photo / Open Camera -->
        <div class="card card-interactive" onclick="window.simulateNewUpload('camera')" style="background:#FFFFFF; border:1.5px solid #F1F5F9; border-radius:20px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div style="width:44px; height:44px; border-radius:14px; background:#EFF6FF; border:1px solid #DBEAFE; display:flex; align-items:center; justify-content:center; font-size:22px; color:#2563EB; flex-shrink:0;">
            📷
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; color:#0F172A;">
              Take Photo / Open Camera
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
              Snap a clear picture of lab test or prescription
            </div>
          </div>
        </div>

        <!-- Option 2: Choose from Photos -->
        <div class="card card-interactive" onclick="window.simulateNewUpload('photos')" style="background:#FFFFFF; border:1.5px solid #F1F5F9; border-radius:20px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div style="width:44px; height:44px; border-radius:14px; background:#FFF0F6; border:1px solid #FCE7F3; display:flex; align-items:center; justify-content:center; font-size:22px; color:#EC5DAA; flex-shrink:0;">
            🖼️
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; color:#0F172A;">
              Choose from Photo Library
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
              Select saved image or scan from photo gallery
            </div>
          </div>
        </div>

        <!-- Option 3: Choose from Files / PDF -->
        <div class="card card-interactive" onclick="window.simulateNewUpload('files')" style="background:#FFFFFF; border:1.5px solid #F1F5F9; border-radius:20px; padding:16px; display:flex; align-items:center; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div style="width:44px; height:44px; border-radius:14px; background:#FAF5FF; border:1px solid #E9D5FF; display:flex; align-items:center; justify-content:center; font-size:22px; color:#7E22CE; flex-shrink:0;">
            📁
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; color:#0F172A;">
              Browse Files / PDF
            </div>
            <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
              Upload PDF reports directly from iCloud or Drive
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
};

window.closeUploadOptionsModal = function() {
  const modal = document.getElementById('upload-records-modal');
  if (modal) modal.innerHTML = '';
};

window.simulateNewUpload = function(type) {
  window.closeUploadOptionsModal();

  const newDoc = {
    id: `rec-${Date.now()}`,
    title: type === 'camera' ? 'Scanned Clinical Prescription' : type === 'photos' ? 'Mammogram & Breast Ultrasound Scan' : 'Comprehensive Vitamin & Thyroid Panel',
    category: type === 'camera' ? 'Prescriptions' : type === 'photos' ? 'Scans & DEXA' : 'Lab Tests',
    icon: type === 'camera' ? '💊' : type === 'photos' ? '🦴' : '🧪',
    iconBg: type === 'camera' ? '#FFF0F6' : type === 'photos' ? '#F8FAFC' : '#F0FDF4',
    iconBorder: type === 'camera' ? '#FCE7F3' : type === 'photos' ? '#E2E8F0' : '#DCFCE7',
    date: 'Today',
    size: '1.4 MB PDF',
    doctor: 'Dr. Anjali Sharma',
    lab: 'Miror Patient Portal Vault',
    notes: 'Encrypted document uploaded successfully and integrated into your clinical summary.'
  };

  window.healthRecordsList.unshift(newDoc);
  SM.toast('Health report encrypted & saved to vault! 🔒');
  SM.render();
};

window.viewHealthRecordDetail = function(recId) {
  const item = (window.healthRecordsList || []).find(r => r.id === recId);
  if (!item) return;

  let modal = document.getElementById('record-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'record-detail-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bottom-sheet-overlay open" onclick="window.closeRecordDetailModal()" style="opacity:1; pointer-events:auto; z-index:900;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0); z-index:901; border-radius:28px 28px 0 0; padding:24px 20px; max-height:85vh;">
      
      <div class="bottom-sheet-handle"></div>

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <span style="background:${item.iconBg}; border:1px solid ${item.iconBorder}; color:#0F172A; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:14px; display:inline-flex; align-items:center; gap:4px;">
          ${item.icon} ${item.category}
        </span>
        <button onclick="window.closeRecordDetailModal()" style="border:none; background:#F8FAFC; border-radius:50%; width:32px; height:32px; font-size:16px; color:#64748B; cursor:pointer;">✕</button>
      </div>

      <div style="overflow-y:auto; max-height:68vh; padding-right:2px;">
        
        <h3 style="font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:#0F172A; margin:0 0 6px;">
          ${item.title}
        </h3>
        
        <div style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#64748B; margin-bottom:18px;">
          ${item.lab} • ${item.date} • ${item.size}
        </div>

        <!-- Encrypted Preview Card -->
        <div style="background:#F8FAFC; border:1.5px dashed #CBD5E1; border-radius:20px; padding:28px 20px; text-align:center; margin-bottom:20px;">
          <div style="font-size:36px; margin-bottom:8px;">📄</div>
          <div style="font-family:'Montserrat',sans-serif; font-size:14px; font-weight:700; color:#0F172A; margin-bottom:4px;">
            Encrypted Document Stream
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
            AES-256 Bit Encryption Verified ✓
          </div>
        </div>

        <!-- Clinical Notes Box -->
        <div style="background:#FAF5FF; border:1px solid #F3E8FF; border-radius:18px; padding:16px; margin-bottom:20px;">
          <div style="font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; color:#7E22CE; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:4px;">
            DOCTOR & CLINICAL SUMMARY
          </div>
          <div style="font-family:'Montserrat',sans-serif; font-size:13px; color:#334155; line-height:1.45;">
            ${item.notes}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button onclick="window.closeRecordDetailModal(); window.openCarePlusPaywallModal({ title: 'Clinical Lab Report Interpretation', subtitle: 'Get your medical reports, DEXA scans, and blood panels analyzed by certified doctors.', singleOptionTitle: 'Single Report Interpretation', singlePrice: '₹499', singleLabel: 'Analyze ₹499', carePlusPrice: '₹599 / mo', carePlusLabel: 'Join Care+ for Unlimited Summaries', highlights: ['✓ Unlimited medical & lab report interpretations', '✓ Encrypted Vault storage & doctor sharing', '✓ Unlimited 1:1 Doctor Q&A'], onSinglePay: () => { SM.toast('Report sent for clinical interpretation! 📄'); }, onCarePlusJoin: () => { SM.toast('Report sent for clinical interpretation! 📄'); } });" style="width:100%; background:linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%); border:1.5px solid #BFDBFE; color:#2563EB; border-radius:20px; height:46px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; cursor:pointer;">
            ✨ Request Clinical Doctor Summary
          </button>
          <div style="display:flex; gap:10px;">
            <button onclick="SM.toast('Preparing document for doctor sharing...')" style="flex:1; background:#FFFFFF; border:1.5px solid #CBD5E1; color:#0F172A; border-radius:20px; height:44px; font-family:'Montserrat',sans-serif; font-size:12.5px; font-weight:700; cursor:pointer;">
              Share Document
            </button>
            <button onclick="SM.toast('Downloading encrypted PDF...')" style="flex:1; background:#2563EB; color:white; border:none; border-radius:20px; height:44px; font-family:'Montserrat',sans-serif; font-size:12.5px; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(37,99,235,0.25);">
              Download PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  `;
};

window.closeRecordDetailModal = function() {
  const modal = document.getElementById('record-detail-modal');
  if (modal) modal.innerHTML = '';
};

window.renderHealthRecordsScreen = function() {
  const activeFilter = window.healthRecordsFilter || 'all';
  const records = window.healthRecordsList || [];

  const filtered = activeFilter === 'all'
    ? records
    : records.filter(r => {
        if (activeFilter === 'lab') return r.category === 'Lab Tests';
        if (activeFilter === 'scans') return r.category === 'Scans & DEXA';
        if (activeFilter === 'rx') return r.category === 'Prescriptions';
        return true;
      });

  return `
    <div style="background:#FAF9FB; min-height:85vh; padding: 16px 20px 100px;">
      
      <!-- Single White Vault Card (Matching Reference Screen layout) -->
      <div style="background:#FFFFFF; border-radius:28px; border:1px solid #F1F5F9; padding:22px 20px; box-shadow:0 10px 30px rgba(15,23,42,0.05);">
        
        <!-- Top Upload Health Reports Box -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:14px; flex:1;">
            <div style="width:48px; height:48px; border-radius:16px; background:#EFF6FF; border:1px solid #DBEAFE; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div>
              <h3 style="font-family:'Montserrat',sans-serif; font-size:16px; font-weight:700; color:#0F172A; margin:0 0 3px;">
                Upload Health Reports
              </h3>
              <p style="font-family:'Montserrat',sans-serif; font-size:12.5px; color:#64748B; margin:0; line-height:1.35;">
                Keep your lab tests, DEXA scans & prescriptions in one secure place.
              </p>
            </div>
          </div>

          <button onclick="window.openUploadOptionsModal()" class="card-interactive" style="background:#2563EB; color:#FFFFFF; border:none; border-radius:22px; padding:10px 18px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:700; cursor:pointer; flex-shrink:0; box-shadow:0 4px 14px rgba(37,99,235,0.28); display:flex; align-items:center; gap:4px;">
            + Upload
          </button>
        </div>

        <!-- Divider -->
        <div style="height:1px; background:#F1F5F9; margin-bottom:20px;"></div>

        <!-- Medical Records Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <h3 style="font-family:'Montserrat',sans-serif; font-size:17px; font-weight:700; color:#0F172A; margin:0;">
            Medical Records
          </h3>
          <span style="font-family:'Montserrat',sans-serif; font-size:13px; font-weight:600; color:#64748B;">
            ${records.length} files
          </span>
        </div>

        <!-- Horizontal Filter Chips (Matching Reference Image) -->
        <div style="display:flex; gap:10px; overflow-x:auto; padding:4px 0 10px; margin-bottom:14px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
          <button onclick="window.filterHealthRecords('all')" style="border:${activeFilter === 'all' ? 'none' : '1.5px solid #CBD5E1'}; border-radius:9999px; padding:8px 20px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:${activeFilter === 'all' ? '800' : '600'}; background:${activeFilter === 'all' ? 'linear-gradient(135deg, #EC5DAA 0%, #D93B9F 40%, #B14AC8 75%, #7A3FD1 100%)' : '#FFFFFF'}; color:${activeFilter === 'all' ? '#FFFFFF' : '#475569'}; box-shadow:${activeFilter === 'all' ? '0 4px 16px rgba(212,78,147,0.38)' : '0 1px 3px rgba(0,0,0,0.02)'}; cursor:pointer; whitespace:nowrap; flex-shrink:0; transform:${activeFilter === 'all' ? 'translateY(-1px)' : 'none'};">
            All Files
          </button>

          <button onclick="window.filterHealthRecords('lab')" style="border:${activeFilter === 'lab' ? 'none' : '1.5px solid #CBD5E1'}; border-radius:9999px; padding:8px 20px; font-family:'Montserrat',sans-serif; font-size:13.5px; font-weight:${activeFilter === 'lab' ? '800' : '600'}; background:${activeFilter === 'lab' ? 'linear-gradient(135deg, #EC5DAA 0%, #D93B9F 40%, #B14AC8 75%, #7A3FD1 100%)' : '#FFFFFF'}; color:${activeFilter === 'lab' ? '#FFFFFF' : '#475569'}; box-shadow:${activeFilter === 'lab' ? '0 4px 16px rgba(212,78,147,0.38)' : '0 1px 3px rgba(0,0,0,0.02)'}; cursor:pointer; whitespace:nowrap; flex-shrink:0; display:flex; align-items:center; gap:6px; transform:${activeFilter === 'lab' ? 'translateY(-1px)' : 'none'};">
            <span>🧪</span> Lab Tests
          </button>

          <button onclick="window.filterHealthRecords('scans')" style="border:${activeFilter === 'scans' ? 'none' : '1px solid #E2E8F0'}; border-radius:18px; padding:8px 16px; font-family:'Montserrat',sans-serif; font-size:12.5px; font-weight:700; background:${activeFilter === 'scans' ? '#0F172A' : '#FFFFFF'}; color:${activeFilter === 'scans' ? '#FFFFFF' : '#64748B'}; cursor:pointer; whitespace:nowrap; flex-shrink:0; display:flex; align-items:center; gap:6px;">
            <span>🦴</span> Scans & DEXA
          </button>

          <button onclick="window.filterHealthRecords('rx')" style="border:${activeFilter === 'rx' ? 'none' : '1px solid #E2E8F0'}; border-radius:18px; padding:8px 16px; font-family:'Montserrat',sans-serif; font-size:12.5px; font-weight:700; background:${activeFilter === 'rx' ? '#0F172A' : '#FFFFFF'}; color:${activeFilter === 'rx' ? '#FFFFFF' : '#64748B'}; cursor:pointer; whitespace:nowrap; flex-shrink:0; display:flex; align-items:center; gap:6px;">
            <span>💊</span> Prescriptions
          </button>
        </div>

        <!-- Records List Rows -->
        <div style="display:flex; flex-direction:column;">
          ${filtered.map((item, idx) => `
            <div class="card-interactive" onclick="window.viewHealthRecordDetail('${item.id}')" style="display:flex; align-items:center; justify-content:space-between; padding:14px 4px; border-bottom:${idx === filtered.length - 1 ? 'none' : '1px solid #F8FAFC'}; cursor:pointer;">
              <div style="display:flex; align-items:center; gap:14px; flex:1; min-width:0;">
                <div style="width:44px; height:44px; border-radius:14px; background:${item.iconBg}; border:1px solid ${item.iconBorder}; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
                  ${item.icon}
                </div>
                <div style="flex:1; min-width:0;">
                  <h4 style="font-family:'Montserrat',sans-serif; font-size:14.5px; font-weight:700; color:#0F172A; margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${item.title}
                  </h4>
                  <div style="font-family:'Montserrat',sans-serif; font-size:12px; color:#64748B;">
                    ${item.date} • ${item.size}
                  </div>
                </div>
              </div>

              <span style="font-size:18px; color:#94A3B8; margin-left:12px; flex-shrink:0;">→</span>
            </div>
          `).join('')}
        </div>

        <!-- Bottom Security Indicator (Matching Reference Image) -->
        <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:24px; padding-top:16px; border-top:1px solid #F8FAFC; color:#64748B; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:600;">
          <span>🔒</span> Private & secure
        </div>

      </div>

    </div>
  `;
};

SM.register('health-records', () => {
  return `
    ${topBar('Health Records', { back: true })}
    ${window.renderHealthRecordsScreen()}
  `;
});

/* --------------------------------------------------------------------------
   ACTIVITIES TAB: CHALLENGES & WEBINARS
   -------------------------------------------------------------------------- */
window.currentActivitiesFilter = window.currentActivitiesFilter || 'all';

window.userChallengesData = window.userChallengesData || [
  {
    id: 'ch-1',
    title: '21-Day Hormone Reset Challenge',
    subtitle: 'Balance cortisol, stabilize adrenaline & restore circadian vitality',
    category: 'Active',
    day: 8,
    totalDays: 21,
    progressPct: 38,
    streak: 8,
    participants: 1420,
    points: 500,
    checkedInToday: false,
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C471ED 50%, #12C2E9 100%)',
    taskToday: 'Morning sunlight exposure (10 mins) + 500ml room temp water before caffeine.',
    benefits: ['✓ Lowers morning cortisol', '✓ Reduces brain fog', '✓ Optimizes melatonin timing']
  },
  {
    id: 'ch-2',
    title: '7-Day Deep Hydration & Cellular Glow',
    subtitle: 'Electrolyte protocols & skin barrier nourishment',
    category: 'Upcoming',
    startDate: 'Starts Aug 24',
    participants: 890,
    joined: false,
    points: 200,
    icon: '💧'
  },
  {
    id: 'ch-3',
    title: '14-Day Pelvic Floor & Core Stability',
    subtitle: 'Gentle clinical mobility flows with Dr. Sarah',
    category: 'Upcoming',
    startDate: 'Starts Aug 28',
    participants: 640,
    joined: false,
    points: 350,
    icon: '🧘‍♀️'
  },
  {
    id: 'ch-4',
    title: '10-Day Sleep Sanctuary & Circadian Reset',
    subtitle: 'Evidence-based wind-down rituals for deep REM rest',
    category: 'Self-Paced',
    startDate: 'Start Anytime',
    participants: 1120,
    joined: true,
    points: 300,
    icon: '🌙'
  }
];

window.userWebinarsData = window.userWebinarsData || [
  {
    id: 'web-1',
    isLiveNow: true,
    liveTime: 'Tonight @ 7:00 PM IST',
    title: 'Navigating Perimenopause: Evidence-Based Hormone Therapy & Safe Alternatives',
    speaker: 'Dr. Sarah Mitchell, MD',
    speakerRole: 'Lead Gynecological Lead & Author',
    speakerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    attendees: 934,
    rsvp: true,
    desc: 'Deep clinical breakdown of bioidentical HRT, progesterone windows, bone density protection, and managing hot flashes naturally.'
  },
  {
    id: 'web-2',
    isLiveNow: false,
    liveTime: 'Saturday, Aug 23 · 6:00 PM IST',
    title: 'Deciphering Your Hormone Panel: How to Read FSH, E2, Thyroid & DEXA Scans',
    speaker: 'Dr. Anjali Sharma, MD',
    speakerRole: 'Senior Reproductive Endocrinologist',
    speakerAvatar: 'https://images.unsplash.com/photo-1594824813589-32cfb94043b3?w=120&auto=format&fit=crop&q=80',
    attendees: 720,
    rsvp: false,
    desc: 'Learn what your lab values actually mean, optimal ranges vs standard lab reference ranges, and questions to ask your doctor.'
  },
  {
    id: 'web-3',
    isLiveNow: false,
    liveTime: 'Wednesday, Aug 27 · 7:30 PM IST',
    title: 'Nutritional Protocols for Hot Flashes, Blood Sugar Spikes & Midsection Weight',
    speaker: 'Shreya Sen, M.Sc.',
    speakerRole: 'Functional Clinical Dietician',
    speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    attendees: 512,
    rsvp: false,
    desc: 'Proven insulin-sensitizing meal structures, seed cycling, and adapting proteins in menopause.'
  }
];

window.filterActivities = function(filterKey) {
  window.currentActivitiesFilter = filterKey;
  const container = document.getElementById('activities-feed-content');
  if (container) {
    container.innerHTML = window.renderActivitiesFeedContent();
  }
  const chips = document.querySelectorAll('.activities-filter-chip');
  chips.forEach(c => {
    if (c.getAttribute('data-filter') === filterKey) {
      c.style.background = '#0F172A';
      c.style.color = '#FFFFFF';
    } else {
      c.style.background = '#FFFFFF';
      c.style.color = '#64748B';
    }
  });
};

window.checkinChallenge = function(challengeId) {
  const ch = (window.userChallengesData || []).find(c => c.id === challengeId) || window.userChallengesData[0];
  if (ch) {
    ch.checkedInToday = true;
    ch.streak = (ch.streak || 0) + 1;
    if (window.AppState && window.AppState.user) {
      window.AppState.user.totalPoints = (window.AppState.user.totalPoints || 1250) + 50;
    }
    if (window.confetti) {
      window.confetti({ particleCount: 75, spread: 80, origin: { y: 0.4 } });
    }
    if (typeof SM !== 'undefined') {
      SM.render();
      SM.toast('🎉 Day 8 Completed! +50 Bloom Points earned!');
    }
  }
};

window.joinChallenge = function(challengeId) {
  const ch = (window.userChallengesData || []).find(c => c.id === challengeId);
  if (ch) {
    ch.joined = !ch.joined;
    if (ch.joined) {
      ch.participants = (ch.participants || 0) + 1;
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
      if (typeof SM !== 'undefined') {
        SM.render();
        SM.toast(`🎉 You joined the "${ch.title}"!`);
      }
    } else {
      ch.participants = Math.max(0, (ch.participants || 1) - 1);
      if (typeof SM !== 'undefined') {
        SM.render();
        SM.toast(`Left "${ch.title}"`);
      }
    }
  }
};

window.rsvpWebinar = function(webinarId) {
  const web = (window.userWebinarsData || []).find(w => w.id === webinarId);
  if (web) {
    web.rsvp = !web.rsvp;
    if (web.rsvp) {
      web.attendees = (web.attendees || 0) + 1;
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
      if (typeof SM !== 'undefined') {
        SM.render();
        SM.toast(`✓ RSVP Confirmed for "${web.title}"! Added to calendar.`);
      }
    } else {
      web.attendees = Math.max(0, (web.attendees || 1) - 1);
      if (typeof SM !== 'undefined') {
        SM.render();
        SM.toast(`RSVP cancelled.`);
      }
    }
  }
};

window.renderChallengesCard = function() {
  const activeCh = window.userChallengesData[0];
  const otherChs = window.userChallengesData.slice(1);

  return `
      <!-- Refined Featured Challenge Hero Card -->
      <div style="margin: 0 16px 26px; background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); border-radius: 24px; padding: 22px 20px 20px; color: #FFFFFF; position: relative; overflow: hidden; box-shadow: 0 6px 20px rgba(217, 70, 239, 0.22);">
        
        <!-- 1. Tag Line: 🚀 NEW CHALLENGE -->
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.95); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span>🚀</span>
          <span>NEW CHALLENGE</span>
        </div>

        <!-- 2. Primary Title Focus -->
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px; line-height: 1.25; letter-spacing: -0.3px;">
          21 Days of Detox Challenge
        </h3>

        <!-- 3. Description -->
        <div style="font-size: 13px; color: rgba(255,255,255,0.92); line-height: 1.45; margin-bottom: 14px;">
          A 21-day guided reset to build healthier daily habits, improve energy, and feel more balanced.
        </div>

        <!-- 4. Compact Metadata Row -->
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.85); margin-bottom: 16px; display: flex; align-items: center; gap: 6px;">
          <span>Starts today</span>
          <span>·</span>
          <span>21 days</span>
          <span>·</span>
          <span>1.4k joined</span>
        </div>

        <!-- 5. Prominent CTA Button -->
        <button onclick="window.joinChallenge('${activeCh.id}')" style="width: 100%; background: #FFFFFF; color: ${activeCh.joined ? '#059669' : '#1E1B4B'}; border-radius: 9999px; padding: 12px 20px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.12); transition: all 0.18s ease;">
          <span>${activeCh.joined ? '✓ Challenge Joined (You\'re In!)' : 'Join Challenge →'}</span>
        </button>
      </div>

      <!-- Explore Challenges Section Header -->
      <div style="margin: 0 16px 14px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 3px; letter-spacing: -0.2px;">
          Explore Challenges
        </h3>
        <div style="font-size: 11.5px; color: #64748B; font-weight: 400;">
          Build healthy habits, one challenge at a time.
        </div>
      </div>

      <!-- Clean Challenge Cards List (No Points) -->
      <div style="padding: 0 16px; display: flex; flex-direction: column; gap: 12px;">
        ${otherChs.map(c => `
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 16px; box-shadow: 0 4px 16px rgba(15,23,42,0.04); display: flex; flex-direction: column; gap: 12px;">
            <!-- Top Row: Icon + Title & Subtitle -->
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <!-- Soft Rounded-Square Icon Container -->
              <div style="width: 40px; height: 40px; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                ${c.icon}
              </div>
              <div style="min-width: 0; flex: 1;">
                <h4 style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 3px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${c.title}
                </h4>
                <div style="font-size: 12px; color: #64748B; line-height: 1.35;">
                  ${c.subtitle || 'Build better hydration & metabolic habits'}
                </div>
              </div>
            </div>

            <!-- Bottom Row: Metadata Left + Clean Action Button Right (No Points) -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 6px; border-top: 1px solid #F8FAFC;">
              <div style="font-size: 11.5px; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${c.startDate} · 👥 ${c.participants} joined
              </div>
              <button onclick="window.joinChallenge('${c.id}')" style="background: ${c.joined ? '#ECFDF5' : '#0F172A'}; color: ${c.joined ? '#059669' : '#FFFFFF'}; border: ${c.joined ? '1px solid #A7F3D0' : 'none'}; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 12px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;">
                ${c.joined ? '✓ Joined' : 'Join →'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
  `;
};

window.renderWebinarsCard = function() {
  const liveWeb = window.userWebinarsData[0];
  const upcomingWebs = window.userWebinarsData.slice(1);
  const timeText = (liveWeb.liveTime || '').replace(' @ ', ' · ');

  // Featured Webinar Hero Primary CTA Button
  let ctaText = 'Reserve my spot →';
  let ctaOnClick = `window.rsvpWebinar('${liveWeb.id}')`;
  let ctaColor = '#1E1B4B';
  if (liveWeb.isLiveNow) {
    ctaText = 'Join Live Room →';
    ctaOnClick = `SM.push('live-session')`;
  } else if (liveWeb.rsvp) {
    ctaText = '✓ Spot reserved';
    ctaColor = '#059669';
  }

  return `
      <!-- Featured Webinar Hero Card -->
      <div style="margin: 0 16px 26px; background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); border-radius: 24px; padding: 22px 18px 20px; color: #FFFFFF; position: relative; overflow: hidden; box-shadow: 0 6px 20px rgba(217, 70, 239, 0.22);">
        
        <!-- Subtle Decorative Background Glow Overlay -->
        <div style="position: absolute; top: -10px; right: -10px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(20px); pointer-events: none;"></div>

        <!-- 1. Tag Line: LIVE / UPCOMING Indicator -->
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.95); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; position: relative; z-index: 2;">
          ${liveWeb.isLiveNow ? `
            <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.22);padding:3px 8px;border-radius:6px;font-size:10.5px;font-weight:700;color:#FFFFFF;flex-shrink:0;">
              <span style="width:6px;height:6px;border-radius:50%;background:#FFFFFF;display:inline-block;animation:liveDotPulse 1.4s ease infinite;"></span>
              LIVE
            </span>
          ` : `
            <span style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.18);padding:3px 8px;border-radius:6px;font-size:10.5px;font-weight:700;color:#FFFFFF;flex-shrink:0;">
              UPCOMING
            </span>
          `}
          <span>·</span>
          <span>${timeText}</span>
        </div>

        <!-- 2. Primary Title Focus -->
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px; line-height: 1.25; letter-spacing: -0.3px; position: relative; z-index: 2;">
          ${liveWeb.title}
        </h3>

        <!-- 3. Translucent Doctor Glassmorphism Panel (Matching Reference Image) -->
        <div style="display: flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(8px); border-radius: 18px; padding: 10px 14px; margin: 12px 0 14px; position: relative; z-index: 2;">
          <img src="${liveWeb.speakerAvatar}" alt="${liveWeb.speaker}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1.5px solid rgba(255, 255, 255, 0.85); flex-shrink: 0;">
          <div style="min-width: 0; flex: 1;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.2px;">
              ${liveWeb.speaker}
            </div>
            <div style="font-size: 11.5px; color: rgba(255, 255, 255, 0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
              ${liveWeb.speakerRole}
            </div>
          </div>
        </div>

        <!-- 4. Registration Status -->
        <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.82); margin-bottom: 16px; position: relative; z-index: 2; display: flex; align-items: center; gap: 6px;">
          ${liveWeb.rsvp ? `<span>✓ You're registered</span>` : `<span>👥 ${liveWeb.attendees} registered</span>`}
        </div>

        <!-- 5. Primary White Pill CTA Button -->
        <button onclick="${ctaOnClick}" style="width: 100%; background: #FFFFFF; color: ${ctaColor}; border-radius: 9999px; padding: 12px 20px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.12); transition: all 0.18s ease; position: relative; z-index: 2;">
          <span>${ctaText}</span>
        </button>
      </div>

      <!-- Upcoming Webinars Section Header -->
      <div style="margin: 0 16px 14px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 3px; letter-spacing: -0.2px;">
          Upcoming Webinars
        </h3>
        <div style="font-size: 11.5px; color: #64748B; font-weight: 400;">
          Learn from clinicians and experts through live, practical sessions.
        </div>
      </div>

      <!-- Upcoming Webinars Cards List -->
      <div style="padding: 0 16px; display: flex; flex-direction: column; gap: 12px;">
        ${upcomingWebs.map(w => {
          const parts = (w.liveTime || '').split(' · ');
          const datePart = parts[0] || 'SATURDAY, AUG 23';
          const timePart = parts[1] || '6:00 PM IST';
          return `
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 16px; box-shadow: 0 4px 16px rgba(15,23,42,0.04); display: flex; flex-direction: column; gap: 12px;">
              <!-- 1. Soft Date Pill & Time Row -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #F5F3FF; color: #7C3AED; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.3px; text-transform: uppercase;">
                  ${datePart}
                </span>
                <span style="font-size: 12px; color: #64748B; font-weight: 500;">${timePart}</span>
              </div>

              <!-- 2. Event Title -->
              <h4 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${w.title}
              </h4>

              <!-- 3. Speaker Line -->
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">
                ${w.speaker}
              </div>

              <!-- 4. Bottom Row: Metadata & CTA Button -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 6px; border-top: 1px solid #F8FAFC;">
                <div style="font-size: 11.5px; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  👥 ${w.attendees} registered
                </div>
                <button onclick="window.rsvpWebinar('${w.id}')" style="background: ${w.rsvp ? '#ECFDF5' : '#0F172A'}; color: ${w.rsvp ? '#059669' : '#FFFFFF'}; border: ${w.rsvp ? '1px solid #A7F3D0' : 'none'}; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 12px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;">
                  ${w.rsvp ? '✓ Spot reserved' : 'Reserve my spot →'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
  `;
};

window.currentActivitiesTab = window.currentActivitiesTab || 'challenges';

window.switchActivitiesTab = function(tabKey) {
  window.currentActivitiesTab = tabKey;
  if (typeof SM !== 'undefined') {
    SM.render();
  }
};

window.renderActivitiesScreen = function() {
  const activeTab = window.currentActivitiesTab || 'challenges';

  let contentHtml = '';
  if (activeTab === 'challenges') {
    contentHtml = window.renderChallengesCard();
  } else {
    contentHtml = window.renderWebinarsCard();
  }

  return `
    ${topBar('Activities', { back: false, roomy: true })}

    <!-- Sticky 2-Tab Top Navigation Bar (Challenges vs Webinars matching Care screen theme) -->
    <div class="sub-nav-sticky screen-fixed-header">
      <div>
        <button id="act-tab-btn-challenges" class="${activeTab === 'challenges' ? 'active' : ''}" onclick="window.switchActivitiesTab('challenges')">
          Challenges
        </button>
        <button id="act-tab-btn-webinars" class="${activeTab === 'webinars' ? 'active' : ''}" onclick="window.switchActivitiesTab('webinars')">
          Webinars
        </button>
      </div>
    </div>

    <!-- Active Tab Content Container -->
    <div style="padding: 16px 0 120px; background: #F4F4F6;">
      ${contentHtml}
    </div>
  `;
};

SM.register('activities', () => {
  return window.renderActivitiesScreen();
});

/* --------------------------------------------------------------------------
   MIROR TRACKING EXPERIENCE: DAILY LOG & OVERVIEW (Symptom, Mood, Sleep)
   -------------------------------------------------------------------------- */
window.currentTrackingTab = window.currentTrackingTab || 'daily-log';
window.currentTrackingDateOffset = window.currentTrackingDateOffset || 0; // 0 = today
window.expandedTrackingCategory = window.expandedTrackingCategory || null;
window.overviewTimeRange = window.overviewTimeRange || 'monthly';
window.selectedOverviewCalendarDay = window.selectedOverviewCalendarDay || 21;

// Realistic tracking database state keyed by date string
window.userTrackingData = window.userTrackingData || {
  '2026-08-21': {
    mood: { score: 8, label: 'Feeling good', timestamp: '10:33 am' },
    symptoms: [
      { id: 'fatigue', name: 'Fatigue', severity: 2 },
      { id: 'hot-flashes', name: 'Hot flashes', severity: 1 }
    ],
    otherFactors: { stress: 'Moderate', exercise: 'Light', caffeine: '1 cup' },
    sleep: { durationHours: 7, durationMinutes: 20, quality: 'Good' },
    energy: 7,
    measurements: { weight: '64.2 kg', bloodPressure: '118 / 76' }
  },
  '2026-08-20': {
    mood: { score: 7, label: 'Balanced', timestamp: '09:15 am' },
    symptoms: [
      { id: 'brain-fog', name: 'Brain fog', severity: 1 }
    ],
    otherFactors: { stress: 'Low', exercise: 'Moderate' },
    sleep: { durationHours: 7, durationMinutes: 0, quality: 'Good' },
    energy: 6,
    measurements: { weight: '64.3 kg' }
  },
  '2026-08-19': {
    mood: { score: 8, label: 'Great', timestamp: '08:45 am' },
    symptoms: [],
    otherFactors: { exercise: 'Moderate', nutrition: 'Balanced' },
    sleep: { durationHours: 8, durationMinutes: 10, quality: 'Excellent' },
    energy: 8,
    measurements: {}
  },
  '2026-08-18': {
    mood: { score: 6, label: 'Neutral', timestamp: '11:20 am' },
    symptoms: [
      { id: 'fatigue', name: 'Fatigue', severity: 3 }
    ],
    otherFactors: { stress: 'High' },
    sleep: { durationHours: 6, durationMinutes: 15, quality: 'Fair' },
    energy: 5,
    measurements: {}
  },
  '2026-08-17': {
    mood: { score: 7, label: 'Good', timestamp: '09:00 am' },
    symptoms: [
      { id: 'hot-flashes', name: 'Hot flashes', severity: 2 }
    ],
    otherFactors: { exercise: 'Light' },
    sleep: { durationHours: 7, durationMinutes: 45, quality: 'Good' },
    energy: 7,
    measurements: { weight: '64.5 kg' }
  }
};

window.getTrackingDateObject = function(offset) {
  const d = new Date(2026, 7, 21); // Aug 21, 2026 base
  d.setDate(d.getDate() + offset);
  return d;
};

window.getTrackingDateKey = function(offset) {
  const d = window.getTrackingDateObject(offset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

window.getTrackingDateTitle = function(offset) {
  const d = window.getTrackingDateObject(offset);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = d.getDate();
  if (offset === 0) return `Today, ${dayNum} ${monthName}`;
  return `${dayName}, ${dayNum} ${monthName}`;
};

window.switchTrackingTab = function(tabKey) {
  window.currentTrackingTab = tabKey;
  if (typeof SM !== 'undefined') SM.render();
};

window.selectTrackingDateOffset = function(offset) {
  window.currentTrackingDateOffset = offset;
  if (typeof SM !== 'undefined') SM.render();
};

window.toggleTrackingCard = function(catKey) {
  if (window.expandedTrackingCategory === catKey) {
    window.expandedTrackingCategory = null;
  } else {
    window.expandedTrackingCategory = catKey;
  }
  if (typeof SM !== 'undefined') SM.render();
};

/* --- Render Individual Collapsible Tracking Cards --- */
window.renderMoodCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'mood';
  const moodScore = data.mood ? data.mood.score : null;

  return `
    <div onclick="window.toggleTrackingCard('mood')" style="margin: 0 16px 12px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #FDF2F8; border: 1px solid #FCE7F3; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            🧠
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Mood</h3>
            <div style="font-size: 12.5px; color: ${moodScore ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9;">
          <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">
            How are you feeling today?
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 10px; overflow-x: auto;">
            ${[1,2,3,4,5,6,7,8,9,10].map(val => {
              const isSel = moodScore === val;
              const labels = ['', 'Very low', '', '', 'Neutral', '', '', 'Good', '', 'Great'];
              const label = labels[val-1] || 'Rating ' + val;
              return `
                <button onclick="window.logDailyMood(${val}, '${label}')" style="width: 30px; height: 40px; border-radius: 10px; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#0F172A'}; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: ${isSel ? '0 4px 10px rgba(236, 72, 153, 0.3)' : 'none'};">
                  ${val}
                </button>
              `;
            }).join('')}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 600; color: #94A3B8; padding: 0 2px;">
            <span>Very low</span>
            <span>Neutral</span>
            <span>Great</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

window.renderSymptomsCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'symptoms';
  const tracked = data.symptoms || [];

  const defaultSymptoms = [
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'brain-fog', name: 'Brain fog' },
    { id: 'hot-flashes', name: 'Hot flashes' }
  ];

  return `
    <div onclick="window.toggleTrackingCard('symptoms')" style="margin: 0 16px 12px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #F0FDF4; border: 1px solid #DCFCE7; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            📋
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Symptoms</h3>
            <div style="font-size: 12.5px; color: ${tracked.length > 0 ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9;">
          <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">
            How were your symptoms today?
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
            ${defaultSymptoms.map(symp => {
              const activeSymp = tracked.find(s => s.id === symp.id);
              const currentSev = activeSymp ? activeSymp.severity : 0;

              return `
                <div style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; border-radius: 14px; padding: 10px 14px; border: 1px solid #F1F5F9;">
                  <span style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #0F172A;">${symp.name}</span>

                  <div style="display: flex; gap: 4px;">
                    ${[0, 1, 2, 3, 4].map(sev => {
                      const isSel = currentSev === sev;
                      return `
                        <button onclick="window.updateSymptomSeverity('${symp.id}', '${symp.name}', ${sev})" style="width: 28px; height: 28px; border-radius: 8px; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; color: ${isSel ? '#FFFFFF' : '#64748B'}; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: ${isSel ? '0 2px 8px rgba(236,72,153,0.25)' : 'none'};">
                          ${sev}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <button onclick="window.openAddSymptomsModal()" style="border: none; background: #F3E8FF; color: #7C3AED; border-radius: 12px; padding: 8px 14px; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>+ Add symptom</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;
};

window.renderOtherFactorsCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'otherFactors';
  const factors = data.otherFactors || {};

  return `
    <div onclick="window.toggleTrackingCard('otherFactors')" style="margin: 0 16px 12px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #EFF6FF; border: 1px solid #DBEAFE; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            🧭
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Other Factors</h3>
            <div style="font-size: 12.5px; color: ${Object.keys(factors).length > 0 ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9; display: flex; flex-direction: column; gap: 12px;">
          <!-- Stress -->
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 6px;">Stress</div>
            <div style="display: flex; gap: 6px;">
              ${['Low', 'Moderate', 'High'].map(val => {
                const isSel = factors.stress === val;
                return `
                  <button onclick="window.toggleOtherFactorChip('stress', '${val}')" style="background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#334155'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; padding: 6px 14px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer;">
                    ${val}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Exercise -->
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 6px;">Exercise</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${['None', 'Light', 'Moderate', 'Intense'].map(val => {
                const isSel = factors.exercise === val;
                return `
                  <button onclick="window.toggleOtherFactorChip('exercise', '${val}')" style="background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#334155'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; padding: 6px 14px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer;">
                    ${val}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Caffeine -->
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 6px;">Caffeine</div>
            <div style="display: flex; gap: 6px;">
              ${['None', '1 cup', '2+ cups'].map(val => {
                const isSel = factors.caffeine === val;
                return `
                  <button onclick="window.toggleOtherFactorChip('caffeine', '${val}')" style="background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#334155'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; padding: 6px 14px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer;">
                    ${val}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

window.renderSleepCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'sleep';
  const sleepObj = data.sleep || {};

  return `
    <div onclick="window.toggleTrackingCard('sleep')" style="margin: 0 16px 12px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #F3E8FF; border: 1px solid #E9D5FF; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            🌙
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Sleep</h3>
            <div style="font-size: 12.5px; color: ${sleepObj.quality ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9;">
          <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">
            Duration &amp; Quality
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            ${[
              { hrs: 6, mins: 0 },
              { hrs: 7, mins: 20 },
              { hrs: 8, mins: 0 },
              { hrs: 8, mins: 30 }
            ].map(dur => {
              const isSel = sleepObj.durationHours === dur.hrs && sleepObj.durationMinutes === dur.mins;
              return `
                <button onclick="window.logDailySleep(${dur.hrs}, ${dur.mins}, '${sleepObj.quality || 'Good'}')" style="background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#334155'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; padding: 8px 14px; border-radius: 14px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;">
                  ${dur.hrs}h ${dur.mins > 0 ? dur.mins + 'm' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 6px;">Sleep Quality</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${['Poor', 'Fair', 'Good', 'Excellent'].map(q => {
              const isSel = sleepObj.quality === q;
              return `
                <button onclick="window.logDailySleep(${sleepObj.durationHours || 7}, ${sleepObj.durationMinutes || 20}, '${q}')" style="background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#334155'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; padding: 6px 14px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer;">
                  ${q}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

window.renderEnergyCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'energy';
  const energyVal = data.energy || null;

  return `
    <div onclick="window.toggleTrackingCard('energy')" style="margin: 0 16px 12px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #FEF3C7; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            🔋
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Energy Levels</h3>
            <div style="font-size: 12.5px; color: ${energyVal ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9;">
          <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">
            How was your energy today?
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 10px;">
            ${[1,2,3,4,5,6,7,8,9,10].map(val => {
              const isSel = energyVal === val;
              return `
                <button onclick="window.logDailyEnergy(${val})" style="width: 30px; height: 40px; border-radius: 10px; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#F8FAFC'}; color: ${isSel ? '#FFFFFF' : '#0F172A'}; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: ${isSel ? '0 4px 10px rgba(236, 72, 153, 0.3)' : 'none'};">
                  ${val}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

window.renderMeasurementsCard = function(data, statusText) {
  const isExpanded = window.expandedTrackingCategory === 'measurements';
  const meas = data.measurements || {};

  return `
    <div onclick="window.toggleTrackingCard('measurements')" style="margin: 0 16px 20px; background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03); cursor: pointer; transition: all 0.15s ease;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 11px; background: #ECFDF5; border: 1px solid #A7F3D0; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            🩺
          </div>
          <div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">Health Measurements</h3>
            <div style="font-size: 12.5px; color: ${Object.keys(meas).length > 0 ? '#10B981' : '#94A3B8'}; font-weight: 600;">
              ${statusText}
            </div>
          </div>
        </div>
        <span style="font-size: 14px; color: #94A3B8; font-weight: 700;">${isExpanded ? '▲' : '▼'}</span>
      </div>

      ${isExpanded ? `
        <div onclick="event.stopPropagation();" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="meas-input-weight" placeholder="Weight (e.g. 64.2)" value="${(meas.weight || '').replace(' kg', '')}" style="flex: 1; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px 12px; font-family: 'Montserrat', sans-serif; font-size: 13px; outline: none;">
            <span style="font-size: 12px; font-weight: 600; color: #64748B;">kg</span>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="meas-input-bp" placeholder="Blood Pressure (e.g. 118/76)" value="${meas.bloodPressure || ''}" style="flex: 1; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px 12px; font-family: 'Montserrat', sans-serif; font-size: 13px; outline: none;">
            <span style="font-size: 12px; font-weight: 600; color: #64748B;">mmHg</span>
          </div>

          <button onclick="window.saveDailyMeasurements(document.getElementById('meas-input-weight').value, document.getElementById('meas-input-bp').value)" style="background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; border: none; border-radius: 9999px; padding: 10px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 4px;">
            Save Measurements
          </button>
        </div>
      ` : ''}
    </div>
  `;
};

/* --- Render Daily Log Tab View --- */
window.renderTrackingDailyLogView = function() {
  const offset = window.currentTrackingDateOffset;
  const dateKey = window.getTrackingDateKey(offset);
  const dateTitle = window.getTrackingDateTitle(offset);
  const data = window.userTrackingData[dateKey] || {};

  const dayOffsets = [-3, -2, -1, 0, 1, 2, 3];

  const dateStripHtml = dayOffsets.map(o => {
    const isSel = o === offset;
    const d = window.getTrackingDateObject(o);
    const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNum = d.getDate();
    const dKey = window.getTrackingDateKey(o);
    const hasData = (window.userTrackingData[dKey] && (window.userTrackingData[dKey].mood || (window.userTrackingData[dKey].symptoms && window.userTrackingData[dKey].symptoms.length > 0)));

    return `
      <div onclick="window.selectTrackingDateOffset(${o})" style="display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex: 1;">
        <span style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; color: ${isSel ? '#EC4899' : '#94A3B8'}; text-transform: uppercase;">${dayLetter}</span>
        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isSel ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : '#FFFFFF'}; color: ${isSel ? '#FFFFFF' : '#0F172A'}; border: ${isSel ? 'none' : '1px solid #E2E8F0'}; display: flex; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 700; position: relative; box-shadow: ${isSel ? '0 4px 12px rgba(236, 72, 153, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'}; transition: all 0.15s ease;">
          ${dayNum}
          ${hasData && !isSel ? `<span style="position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%; background: #EC4899;"></span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const moodStateText = data.mood && data.mood.score ? `${data.mood.score}/10 · ${data.mood.label}` : 'Tap to log';
  
  const symptomsCount = data.symptoms ? data.symptoms.length : 0;
  const symptomsStateText = symptomsCount > 0 ? `${symptomsCount} symptom${symptomsCount > 1 ? 's' : ''} logged` : 'Add symptoms';

  const factorKeys = data.otherFactors ? Object.keys(data.otherFactors) : [];
  const factorsStateText = factorKeys.length > 0 ? factorKeys.map(k => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${data.otherFactors[k]}`).slice(0, 2).join(' · ') : 'Add factors';

  const sleepStateText = data.sleep && (data.sleep.durationHours || data.sleep.quality) ? `${data.sleep.durationHours || 0}h ${data.sleep.durationMinutes || 0}m · ${data.sleep.quality || 'Good'}` : 'Add last night\'s sleep';

  return `
    <!-- Selected Date Label & 7-Day Calendar Strip -->
    <div style="margin: 0 16px 14px; background: #FFFFFF; border-radius: 20px; padding: 14px 14px 16px; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(15,23,42,0.03);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; margin: 0;">
          ${dateTitle}
        </h3>
        <button onclick="window.openPeriodCalendarModal()" style="border: none; background: none; color: #EC4899; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          <span>Calendar</span>
          <span>📅</span>
        </button>
      </div>

      <!-- 7-Day Horizontal Strip -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
        ${dateStripHtml}
      </div>
    </div>

    <!-- 1. MOOD CARD -->
    ${window.renderMoodCard(data, moodStateText)}

    <!-- 2. SYMPTOMS CARD -->
    ${window.renderSymptomsCard(data, symptomsStateText)}

    <!-- 3. OTHER FACTORS CARD -->
    ${window.renderOtherFactorsCard(data, factorsStateText)}

    <!-- 4. SLEEP CARD -->
    ${window.renderSleepCard(data, sleepStateText)}
  `;
};

/* --- Render Overview Tab View --- */
window.renderTrackingOverviewView = function() {
  const selectedDay = window.selectedOverviewCalendarDay || 21;
  const selectedDateKey = `2026-08-${String(selectedDay).padStart(2, '0')}`;
  const dayData = window.userTrackingData[selectedDateKey] || {};

  return `
    <!-- Insights Calendar Card -->
    <div style="margin: 0 16px 16px; background: #FFFFFF; border-radius: 24px; padding: 20px 18px; border: 1px solid #F1F5F9; box-shadow: 0 6px 20px rgba(15,23,42,0.035);">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;">
        <div>
          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 3px;">
            Insights Calendar
          </h3>
          <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">
            See how your mood, symptoms and wellbeing change over time.
          </div>
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #EC4899; font-family: 'Montserrat', sans-serif;">
          August 2026
        </div>
      </div>

      <!-- Calendar Visualization Header -->
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 8px;">
        ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `
          <span style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; color: #94A3B8;">${d}</span>
        `).join('')}
      </div>

      <!-- August 2026 Calendar Grid (Aug 1 = Saturday) -->
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 0;">
        <div style="height: 36px;"></div>
        <div style="height: 36px;"></div>
        <div style="height: 36px;"></div>
        <div style="height: 36px;"></div>
        <div style="height: 36px;"></div>
        
        ${Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
          const dKey = `2026-08-${String(dayNum).padStart(2, '0')}`;
          const dayLog = window.userTrackingData[dKey];
          const isSelected = selectedDay === dayNum;
          const hasData = dayLog && (dayLog.mood || (dayLog.symptoms && dayLog.symptoms.length > 0));

          return `
            <div onclick="window.selectedOverviewCalendarDay = ${dayNum}; SM.render();" style="height: 36px; border-radius: 12px; background: ${isSelected ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : hasData ? '#FAF5FF' : '#F8FAFC'}; color: ${isSelected ? '#FFFFFF' : '#0F172A'}; border: ${isSelected ? 'none' : hasData ? '1px solid #E9D5FF' : '1px solid #F1F5F9'}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; position: relative; transition: all 0.15s ease;">
              <span>${dayNum}</span>
              ${hasData && !isSelected ? `<span style="position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%; background: #EC4899;"></span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Your Month at a Glance (2x2 Grid) -->
    <div style="margin: 0 16px 16px;">
      <h4 style="font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 10px; padding: 0 4px;">
        Your month at a glance
      </h4>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <div style="background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #F1F5F9; box-shadow: 0 4px 14px rgba(15,23,42,0.025);">
          <div style="font-size: 12px; font-weight: 600; color: #64748B;">Mood (Average)</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #10B981; margin: 4px 0 2px;">7.4 / 10</div>
          <div style="font-size: 11px; color: #10B981; font-weight: 600;">↑ 12% vs last month</div>
        </div>

        <div style="background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #F1F5F9; box-shadow: 0 4px 14px rgba(15,23,42,0.025);">
          <div style="font-size: 12px; font-weight: 600; color: #64748B;">Sleep (Average)</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #7C3AED; margin: 4px 0 2px;">6h 52m</div>
          <div style="font-size: 11px; color: #7C3AED; font-weight: 600;">Consistent rhythm</div>
        </div>

        <div style="background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #F1F5F9; box-shadow: 0 4px 14px rgba(15,23,42,0.025);">
          <div style="font-size: 12px; font-weight: 600; color: #64748B;">Symptoms</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #EC4899; margin: 4px 0 2px;">↓ 18%</div>
          <div style="font-size: 11px; color: #EC4899; font-weight: 600;">Reduced severity</div>
        </div>

        <div style="background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #F1F5F9; box-shadow: 0 4px 14px rgba(15,23,42,0.025);">
          <div style="font-size: 12px; font-weight: 600; color: #64748B;">Active Streak</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #EC4899; margin: 4px 0 2px;">18 Days</div>
          <div style="font-size: 11px; color: #EC4899; font-weight: 600;">🔥 Consistent check-ins</div>
        </div>
      </div>
    </div>

    <!-- Prominent Health Report Card (Miror Styling) -->
    <div style="margin: 0 16px 24px; background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 50%, #E0F2FE 100%); border-radius: 24px; padding: 22px 20px; border: 1px solid #E9D5FF; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.08);">
      <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 800; color: #EC4899; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">
        DOCTOR APPOINTMENT READY
      </div>
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 19px; font-weight: 700; color: #0F172A; margin: 0 0 6px;">
        Your Health Report
      </h3>
      <p style="font-size: 13px; color: #475569; line-height: 1.45; margin: 0 0 14px;">
        A clear, evidence-based summary of your symptom patterns, mood, and sleep to help you prepare for your next healthcare appointment.
      </p>

      <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; font-size: 12.5px; font-weight: 600; color: #334155;">
        <div>✓ Logged Symptoms Summary</div>
        <div>✓ Mood &amp; Well-being Trends</div>
        <div>✓ Sleep Patterns &amp; Duration</div>
      </div>

      <button onclick="window.generateHealthReportModal()" style="width: 100%; background: linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%); color: #FFFFFF; border: none; border-radius: 9999px; padding: 14px 20px; font-family: 'Montserrat', sans-serif; font-size: 14.5px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 20px rgba(236,72,153,0.3); display: flex; align-items: center; justify-content: center; gap: 6px;">
        <span>Generate health report →</span>
      </button>
    </div>
  `;
};

/* --- Main Tracking Screen Entrypoint --- */
window.renderTrackingScreen = function() {
  const isDailyLog = (window.currentTrackingTab || 'daily-log') === 'daily-log';

  return `
    <div style="padding: 12px 0 8px;">
      <!-- Segmented 2-Tab Switcher Bar (Daily Log vs Insights) -->
      <div style="margin: 0 16px 16px; background: #E2E8F0; padding: 4px; border-radius: 9999px; display: flex; align-items: center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);">
        <button onclick="window.switchTrackingTab('daily-log')" style="flex: 1; height: 38px; border-radius: 9999px; border: none; background: ${isDailyLog ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : 'transparent'}; color: ${isDailyLog ? '#FFFFFF' : '#475569'}; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: ${isDailyLog ? '700' : '600'}; cursor: pointer; transition: all 0.18s ease; box-shadow: ${isDailyLog ? '0 4px 12px rgba(236,72,153,0.28)' : 'none'};">
          Daily Log
        </button>
        <button onclick="window.switchTrackingTab('overview')" style="flex: 1; height: 38px; border-radius: 9999px; border: none; background: ${!isDailyLog ? 'linear-gradient(135deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%)' : 'transparent'}; color: ${!isDailyLog ? '#FFFFFF' : '#475569'}; font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: ${!isDailyLog ? '700' : '600'}; cursor: pointer; transition: all 0.18s ease; box-shadow: ${!isDailyLog ? '0 4px 12px rgba(236,72,153,0.28)' : 'none'};">
          Insights
        </button>
      </div>

      <!-- Active Sub-Tab View Content -->
      <div style="padding-bottom: 20px;">
        ${isDailyLog ? window.renderTrackingDailyLogView() : window.renderTrackingOverviewView()}
      </div>
    </div>
  `;
};

SM.register('tracking', () => {
  return window.renderTrackingScreen();
});

SM.register('live-session', () => {
  const comments = AppState.liveComments || [];
  
  return `
    <!-- Top Floating Header over Video Player -->
    <div style="position:relative;background:#0B0F19;color:white;padding-top:env(safe-area-inset-top, 8px);">
      
      <!-- Video Player Viewport -->
      <div class="live-video-player-container" style="position:relative;width:100%;height:260px;background:#000;overflow:hidden;">
        
        <!-- Video Stream Asset / Background -->
        <img src="community_live_pulse.jpg" alt="Morning Mindfulness Live Stream" style="width:100%;height:100%;object-fit:cover;opacity:0.92;filter:contrast(105%);display:block;">
        
        <!-- Ambient Stream Gradient Overlays -->
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg, rgba(11,15,25,0.7) 0%, rgba(11,15,25,0.05) 45%, rgba(11,15,25,0.85) 100%);pointer-events:none;"></div>
        
        <!-- Floating Reaction Animation Canvas -->
        <div id="liveReactionCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:90;"></div>

        <!-- Top Navigation Overlay -->
        <div style="position:absolute;top:12px;left:14px;right:14px;display:flex;align-items:center;justify-content:space-between;z-index:10;">
          
          <!-- Back button -->
          <button data-action="back" style="width:36px;height:36px;border-radius:50%;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);color:white;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;">
            ←
          </button>

          <!-- Status Pill: 🔴 LIVE • 1.4k -->
          <div style="display:flex;align-items:center;gap:6px;background:rgba(239,68,68,0.9);backdrop-filter:blur(8px);padding:4px 10px;border-radius:20px;color:white;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(239,68,68,0.35);">
            <span style="width:6px;height:6px;border-radius:50%;background:white;animation:bloomPulse 1.6s infinite;"></span>
            <span>LIVE</span>
            <span style="opacity:0.6;margin:0 2px;">•</span>
            <span style="font-weight:600;">1.4k watching</span>
          </div>

          <!-- Audio & Share Action buttons -->
          <div style="display:flex;align-items:center;gap:8px;">
            <button id="liveMuteBtn" onclick="this.textContent = this.textContent === '🔊' ? '🔇' : '🔊'" style="width:36px;height:36px;border-radius:50%;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);color:white;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;">
              🔊
            </button>
            <button onclick="navigator.clipboard && navigator.clipboard.writeText(window.location.href);alert('Live Session Link Copied! 🌸');" style="width:36px;height:36px;border-radius:50%;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);color:white;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">
              ↗
            </button>
          </div>

        </div>

        <!-- Video Center Play / Live Pulsing Soundwaves Overlay -->
        <div style="position:absolute;bottom:14px;left:16px;right:16px;display:flex;align-items:flex-end;justify-content:space-between;z-index:10;">
          
          <!-- Host Speaking Badge & Stream Title -->
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#34D399;box-shadow:0 0 8px #34D399;display:inline-block;"></span>
              <span style="font-family:'Montserrat',sans-serif;font-size:11.5px;font-weight:600;color:#F1F5F9;letter-spacing:0.3px;">Dr. Sarah Mitchell speaking</span>
            </div>
            <h2 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#FFFFFF;line-height:1.25;text-shadow:0 2px 6px rgba(0,0,0,0.5);">Morning Mindfulness Rituals</h2>
          </div>

          <!-- Quality Badge -->
          <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(6px);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;letter-spacing:0.5px;color:white;border:1px solid rgba(255,255,255,0.2);">
            1080p HD
          </div>

        </div>

      </div>
    </div>

    <!-- Main Live Body & Comments Stream -->
    <div class="container" style="padding:14px 16px 88px;background:var(--miror-bg);min-height:calc(100vh - 260px);display:flex;flex-direction:column;">
      
      <!-- Live Chat Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:0 4px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;">Live Discussion</span>
          <span class="tag" style="background:#F1F5F9;color:#64748B;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;">${comments.length} comments</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11.5px;color:#10B981;font-weight:600;">
          <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span>
          Chat Active
        </div>
      </div>

      <!-- Real-time Comments Feed List -->
      <div id="liveCommentsFeed" style="display:flex;flex-direction:column;gap:8px;flex:1;">
        ${comments.map(c => `
          <div class="live-chat-message-bubble" style="display:flex;gap:10px;background:#FFFFFF;border:1px solid ${c.isHost ? 'rgba(236,72,153,0.3)' : '#F1F5F9'};padding:10px 14px;border-radius:18px;box-shadow:0 2px 8px rgba(15,23,42,0.02);${c.isHost ? 'background:#FFF5F9;' : ''}">
            <img src="${c.avatar}" alt="${c.user}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1.5px solid ${c.isHost ? '#EC5DAA' : '#E2E8F0'};">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-family:'Montserrat',sans-serif;font-size:12.5px;font-weight:600;color:#0F172A;">${c.user}</span>
                  ${c.isHost ? `
                    <span style="font-size:9.5px;font-weight:600;background:linear-gradient(135deg, #EC5DAA, #7A3FD1);color:white;padding:1px 6px;border-radius:8px;">HOST</span>
                  ` : `
                    <span style="font-size:9.5px;font-weight:600;background:#F1F5F9;color:#64748B;padding:1px 6px;border-radius:8px;">${c.badge}</span>
                  `}
                </div>
                <span style="font-size:11px;color:#94A3B8;">${c.time}</span>
              </div>
              <div style="font-size:13px;color:#1E293B;line-height:1.45;">${c.text}</div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>

    <!-- Sticky Bottom Comment Input & Reaction Emoji Bar -->
    <div style="position:fixed;bottom:0;left:0;right:0;max-width:430px;margin:0 auto;background:rgba(255,255,255,0.94);backdrop-filter:blur(16px);border-top:1px solid #F1F5F9;padding:8px 16px 14px;box-shadow:0 -8px 24px rgba(15,23,42,0.06);z-index:95;">
      
      <!-- Quick Floating Reaction Emojis Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding:0 6px;">
        <span style="font-size:11px;font-weight:600;color:#94A3B8;letter-spacing:0.3px;">REACT LIVE</span>
        <div style="display:flex;align-items:center;gap:10px;">
          ${['❤️', '👏', '🌸', '🧘‍♀️', '✨', '🔥'].map(emoji => `
            <button onclick="window.sendLiveReaction('${emoji}')" style="background:none;border:none;font-size:19px;cursor:pointer;padding:2px;transform:scale(1);transition:transform 0.15s ease;" onmousedown="this.style.transform='scale(1.35)'" onmouseup="this.style.transform='scale(1)'">
              ${emoji}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Comment Text Input Bar -->
      <form onsubmit="window.submitLiveComment(event)" style="display:flex;align-items:center;gap:10px;margin:0;">
        <input id="liveChatInput" type="text" placeholder="Say something or ask Dr. Sarah..." style="flex:1;height:44px;border-radius:22px;background:#F8FAFC;border:1px solid #E2E8F0;padding:0 16px;font-size:13.5px;color:#0F172A;outline:none;" autocomplete="off" />
        <button type="submit" style="width:44px;height:44px;border-radius:50%;background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:white;border:none;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;box-shadow:0 4px 12px rgba(122,63,209,0.25);">
          ➤
        </button>
      </form>

    </div>
  `;
});

/* --------------------------------------------------------------------------
   INSTAGRAM-STYLE COMMUNITY GROUP FEED SCREEN (White Background Theme)
   -------------------------------------------------------------------------- */
window.MIROR_GROUP_POSTS = window.MIROR_GROUP_POSTS || {};

/* --------------------------------------------------------------------------
   COMMUNITY GROUP INSTAGRAM-STYLE FEED (Image, Video, Poll, Text)
   -------------------------------------------------------------------------- */
window.MIROR_GROUP_POSTS = window.MIROR_GROUP_POSTS || {};
window.currentGroupComposerType = window.currentGroupComposerType || 'image';

window.getGroupPosts = function(groupId) {
  if (window.MIROR_GROUP_POSTS[groupId]) return window.MIROR_GROUP_POSTS[groupId];
  
  const g = window.MIROR_COMMUNITY_GROUPS.find(item => item.id === groupId) || window.MIROR_COMMUNITY_GROUPS[0];

  window.MIROR_GROUP_POSTS[groupId] = [
    // 1. TEXT POST (Anita Roy - with Member tag and 2h ago)
    {
      id: `${groupId}-p1`,
      type: 'text',
      user: 'anita_roy',
      username: 'anita_roy',
      role: 'Member',
      avatarImg: 'story_shreya_salad.jpg',
      category: 'Perimenopause',
      timeAgo: '2h ago',
      likes: 1,
      liked: false,
      saved: false,
      body: `I’m 49 and have an IUD. This makes taking my cycle very difficult and I don’t think these apps accommodate for not knowing exactly what your cycle is up to if you can’t tell by bleeding....`,
      comments: [
        { id: 'c1', user: 'dr_sarah_mitchell', text: 'Tracking waking body temperature, sleep patterns, and cervical changes is the gold standard when bleeding is absent!', time: '1h ago' },
        { id: 'c2', user: 'priya_m', text: 'I had the exact same issue! Focus on energy levels and hot flash frequency instead.', time: '30m ago' }
      ]
    },

    // 2. TEXT POST (kavita_roy - with Member tag and 4h ago)
    {
      id: `${groupId}-p2`,
      type: 'text',
      user: 'kavita_roy',
      username: 'kavita_roy',
      role: 'Member',
      avatarImg: 'story_shalini_mobility.jpg',
      category: 'Discussion',
      timeAgo: '4h ago',
      likes: 44,
      liked: true,
      saved: false,
      body: `I have 57 songs in my playlist. Pick a number between 1 and 57, and I’ll tell you the song.`,
      comments: [
        { id: 'c3', user: 'sunita_m', text: '23! 🎶', time: '2h ago' },
        { id: 'c4', user: 'bettinaedwin', text: 'Number 7 please! Need something uplifting today.', time: '1h ago' }
      ]
    },

    // 3. POLLING POST (Priya Fitness - with Member tag and 6h ago)
    {
      id: `${groupId}-p3`,
      type: 'poll',
      user: 'priya_fitness',
      username: 'priya_fitness',
      role: 'Member',
      avatarImg: 'story_priya_streak.jpg',
      category: 'Sports & exercise',
      timeAgo: '6h ago',
      likes: 64,
      liked: false,
      saved: false,
      poll: {
        question: 'Which type of exercise do you like the most?',
        options: [
          { text: 'Strength & resistance training', votes: 84 },
          { text: 'Yoga & Pilates flow', votes: 112 },
          { text: 'Brisk walking / outdoor running', votes: 68 },
          { text: 'Swimming & mobility stretching', votes: 42 }
        ],
        userVoted: 1,
        totalVotes: 306
      },
      comments: [
        { id: 'c5', user: 'priya_m', text: 'Pilates has saved my lower back and core strength lately.', time: '3h ago' }
      ]
    },

    // 4. PHOTO POST (Dr. Sarah Mitchell - with Doctor role tag and 1d ago)
    {
      id: `${groupId}-p4`,
      type: 'image',
      user: 'dr_sarah_mitchell',
      username: 'dr_sarah_mitchell',
      role: 'Doctor',
      avatarImg: 'feed_dr_anjali.jpg',
      category: 'Wellness',
      timeAgo: '1d ago',
      image: g.id === 'fit' ? 'community_yoga_reset.jpg' : (g.cat === 'cities' ? 'community_live_pulse.jpg' : 'article_morning_reset.jpg'),
      likes: 142,
      liked: true,
      saved: true,
      caption: `Gentle daily reminder for our ${g.name} circle: Small 10-minute micro-habits compound into lasting hormonal balance. Start your morning with hydration, light stretches, and mindful breathing. 🧘‍♀️✨`,
      comments: [
        { id: 'c6', user: 'bettinaedwin', text: 'Needed this reminder today doctor! 🙌', time: '1d ago' },
        { id: 'c7', user: 'anita_rao', text: 'The morning stretches made a huge difference to my lower back.', time: '18h ago' }
      ]
    }
  ];

  return window.MIROR_GROUP_POSTS[groupId];
};

window.toggleGroupJoin = function(groupId, btn) {
  const isJoined = btn.getAttribute('data-joined') === 'true';
  if (isJoined) {
    btn.setAttribute('data-joined', 'false');
    btn.style.background = '#0095F6';
    btn.style.color = '#FFFFFF';
    btn.innerHTML = 'Follow';
    SM.toast('Unfollowed circle');
  } else {
    btn.setAttribute('data-joined', 'true');
    btn.style.background = '#E2E8F0';
    btn.style.color = '#0F172A';
    btn.innerHTML = 'Following ✓';
    if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
    SM.toast('Following circle 🎉');
  }
};

window.togglePostLike = function(groupId, postId, btn) {
  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;

  const countEl = document.getElementById(`likes-count-${postId}`);
  const heartSvg = btn.querySelector('.heart-svg');
  
  if (post.liked) {
    if (heartSvg) {
      heartSvg.setAttribute('fill', '#ED4956');
      heartSvg.setAttribute('stroke', '#ED4956');
      heartSvg.style.transform = 'scale(1.3)';
      setTimeout(() => { heartSvg.style.transform = 'scale(1)'; }, 200);
    }
  } else {
    if (heartSvg) {
      heartSvg.setAttribute('fill', 'none');
      heartSvg.setAttribute('stroke', '#000000');
    }
  }

  if (countEl) {
    countEl.innerText = `${post.likes}`;
  }
};

window.doubleTapPostLike = function(groupId, postId, container) {
  const floatingHeart = container.querySelector('.double-tap-heart');
  if (floatingHeart) {
    floatingHeart.style.opacity = '1';
    floatingHeart.style.transform = 'translate(-50%, -50%) scale(1.3)';
    setTimeout(() => {
      floatingHeart.style.opacity = '0';
      floatingHeart.style.transform = 'translate(-50%, -50%) scale(0.6)';
    }, 650);
  }

  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (post && !post.liked) {
    const likeBtn = document.getElementById(`like-btn-${postId}`);
    if (likeBtn) window.togglePostLike(groupId, postId, likeBtn);
  }
};

window.togglePostSave = function(groupId, postId, btn) {
  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.saved = !post.saved;
  const bookmarkSvg = btn.querySelector('svg');
  if (bookmarkSvg) {
    bookmarkSvg.setAttribute('fill', post.saved ? '#000000' : 'none');
  }
  SM.toast(post.saved ? 'Saved to collection 🔖' : 'Removed from saved collection');
};

window.shareGroupPost = function(groupId, postId) {
  navigator.clipboard?.writeText(window.location.href);
  SM.toast('Post link copied! 📋');
};

window.toggleCommentsView = function(postId) {
  const container = document.getElementById(`comments-thread-${postId}`);
  if (!container) return;
  const isHidden = container.style.display === 'none';
  container.style.display = isHidden ? 'block' : 'none';
};

window.addNewComment = function(groupId, postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const newC = {
    id: 'c-' + Date.now(),
    user: 'priya_m',
    text: text,
    time: 'Just now',
    likes: 0,
    liked: false
  };

  post.comments.push(newC);
  input.value = '';

  const thread = document.getElementById(`comments-list-${postId}`);
  if (thread) {
    const commentEl = document.createElement('div');
    commentEl.style.cssText = 'padding:3px 0;font-size:13px;line-height:1.4;color:#000000;display:flex;align-items:flex-start;justify-content:space-between;gap:8px;animation:fadeIn 0.25s ease;';
    commentEl.innerHTML = `
      <div>
        <strong style="font-weight:600;margin-right:4px;">${newC.user}</strong>
        <span>${newC.text}</span>
      </div>
      <button style="border:none;background:none;cursor:pointer;padding:0;color:#8E8E8E;font-size:12px;">♡</button>
    `;
    thread.appendChild(commentEl);
  }

  const commentCountEl = document.getElementById(`comment-count-${postId}`);
  if (commentCountEl) {
    commentCountEl.innerText = `${post.comments.length}`;
  }

  const commentThread = document.getElementById(`comments-thread-${postId}`);
  if (commentThread) commentThread.style.display = 'block';

  SM.toast('Comment posted! 💬');
};

window.voteGroupPoll = function(groupId, postId, optionIndex) {
  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (!post || !post.poll) return;

  if (post.poll.userVoted === optionIndex) return;

  if (post.poll.userVoted !== null) {
    post.poll.options[post.poll.userVoted].votes--;
  } else {
    post.poll.totalVotes++;
  }

  post.poll.options[optionIndex].votes++;
  post.poll.userVoted = optionIndex;

  if (window.confetti) window.confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  SM.toast('Vote recorded! 📊');

  const pollBox = document.getElementById(`poll-box-${postId}`);
  if (pollBox) {
    const total = post.poll.totalVotes || 1;
    pollBox.innerHTML = post.poll.options.map((opt, optIdx) => {
      const pct = Math.round((opt.votes / total) * 100);
      const isSelected = post.poll.userVoted === optIdx;
      return `
        <div class="care-poll-option" onclick="window.voteGroupPoll('${groupId}', '${postId}', ${optIdx})" style="${isSelected ? 'border-color:#EC5DAA;background:#FFF;' : ''}">
          <div class="care-poll-fill" style="width:${pct}%;"></div>
          <div class="care-poll-content">
            <span style="font-size:13px;font-weight:${isSelected ? '700' : '500'};color:#0F172A;">
              ${isSelected ? '✓ ' : ''}${opt.text}
            </span>
            <span style="font-weight:600;color:#EC5DAA;font-size:12.5px;">${pct}%</span>
          </div>
        </div>
      `;
    }).join('') + `
      <div style="font-size:11px;color:#94A3B8;font-weight:600;margin-top:4px;text-align:right;">
        ${post.poll.totalVotes} total votes
      </div>
    `;
  }
};

window.toggleGroupVideoPlay = function(groupId, postId) {
  const posts = window.getGroupPosts(groupId);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.isPlaying = !post.isPlaying;
  const playBtn = document.getElementById(`video-play-btn-${postId}`);
  const overlay = document.getElementById(`video-overlay-${postId}`);
  
  if (post.isPlaying) {
    SM.toast(`Playing video: "${post.videoTitle}" 🎬`);
    if (playBtn) playBtn.innerHTML = '❚❚';
    if (overlay) overlay.style.background = 'rgba(0,0,0,0.15)';
  } else {
    if (playBtn) playBtn.innerHTML = '▶';
    if (overlay) overlay.style.background = 'rgba(0,0,0,0.35)';
  }
};

/* --- Group Post Modal System (Instagram-Style Bottom Pop-Up) --- */
window.activeGroupModalType = window.activeGroupModalType || 'image';
window.selectedModalPhoto = window.selectedModalPhoto || 'community_yoga_reset.jpg';
window.selectedModalVideo = window.selectedModalVideo || 'feed_event_banner.jpg';

window.openGroupPostModal = function(groupId) {
  const g = window.MIROR_COMMUNITY_GROUPS.find(item => item.id === groupId) || window.MIROR_COMMUNITY_GROUPS[0];
  window.activeGroupModalId = groupId;

  let modal = document.getElementById('group-composer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'group-composer-modal';
    (document.getElementById('app') || document.body).appendChild(modal);
  }

  modal.innerHTML = window.renderGroupPostModalContent(g);
};

window.closeGroupPostModal = function() {
  const modal = document.getElementById('group-composer-modal');
  if (modal) modal.innerHTML = '';
};

window.setModalPostType = function(type, groupId) {
  window.activeGroupModalType = type;
  const g = window.MIROR_COMMUNITY_GROUPS.find(item => item.id === groupId) || window.MIROR_COMMUNITY_GROUPS[0];
  const modal = document.getElementById('group-composer-modal');
  if (modal) {
    modal.innerHTML = window.renderGroupPostModalContent(g);
  }
};

window.selectModalPhoto = function(photoSrc, btn) {
  window.selectedModalPhoto = photoSrc;
  const img = document.getElementById('modal-photo-preview-img');
  if (img) img.src = photoSrc;
  document.querySelectorAll('.modal-photo-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
};

window.selectModalVideo = function(videoSrc, title, btn) {
  window.selectedModalVideo = videoSrc;
  const img = document.getElementById('modal-video-preview-img');
  if (img) img.src = videoSrc;
  const titleInput = document.getElementById('modal-post-video-title');
  if (titleInput) titleInput.value = title;
  document.querySelectorAll('.modal-photo-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
};

window.renderGroupPostModalContent = function(g) {
  const type = window.activeGroupModalType || 'image';
  const selectedPhoto = window.selectedModalPhoto || 'community_yoga_reset.jpg';
  const selectedVideo = window.selectedModalVideo || 'feed_event_banner.jpg';

  return `
    <div class="bottom-sheet-overlay open" onclick="window.closeGroupPostModal()" style="opacity:1;pointer-events:auto;z-index:950;"></div>
    <div class="bottom-sheet open" style="transform:translateY(0);z-index:951;border-radius:28px 28px 0 0;padding:20px 20px 24px;max-height:85vh;overflow-y:auto;background:#FFFFFF;font-family:'Montserrat',sans-serif;box-sizing:border-box;">
      
      <div class="bottom-sheet-handle"></div>

      <!-- Modal Header Bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;border:2px solid #FCE7F3;flex-shrink:0;">
            <img src="profile_avatar.jpg" style="width:100%;height:100%;object-fit:cover;display:block;">
          </div>
          <div>
            <h3 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:0;">Create Post</h3>
            <div style="font-size:12px;color:#7A3FD1;font-weight:600;">in ${g.name}</div>
          </div>
        </div>
        <button onclick="window.closeGroupPostModal()" style="width:32px;height:32px;border-radius:50%;background:#F1F5F9;border:none;color:#64748B;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button>
      </div>

      <!-- 3 Post Type Selector Tabs (Text, Photo, Poll) -->
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px;background:#F1F5F9;padding:4px;border-radius:16px;">
        <button class="modal-type-btn ${type === 'text' ? 'active' : ''}" onclick="window.setModalPostType('text', '${g.id}')">
          ✍️ Text
        </button>
        <button class="modal-type-btn ${type === 'image' ? 'active' : ''}" onclick="window.setModalPostType('image', '${g.id}')">
          📷 Photo
        </button>
        <button class="modal-type-btn ${type === 'poll' ? 'active' : ''}" onclick="window.setModalPostType('poll', '${g.id}')">
          📊 Poll
        </button>
      </div>

      <!-- Type-Specific Form Body -->
      ${type === 'image' ? `
        <!-- Image Post Form -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <textarea id="modal-post-caption" rows="3" placeholder="Share a photo caption, recipe, or wellness routine..." style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:16px;padding:12px 14px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;resize:none;line-height:1.45;"></textarea>

          <!-- Photo Selection Chips -->
          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:6px;">Select Photo:</div>
            <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;">
              <button class="modal-photo-chip ${selectedPhoto === 'community_yoga_reset.jpg' ? 'active' : ''}" onclick="window.selectModalPhoto('community_yoga_reset.jpg', this)">
                🧘‍♀️ Yoga Reset
              </button>
              <button class="modal-photo-chip ${selectedPhoto === 'story_shreya_salad.jpg' ? 'active' : ''}" onclick="window.selectModalPhoto('story_shreya_salad.jpg', this)">
                🥗 Fresh Salad
              </button>
              <button class="modal-photo-chip ${selectedPhoto === 'story_shalini_lemon.jpg' ? 'active' : ''}" onclick="window.selectModalPhoto('story_shalini_lemon.jpg', this)">
                🍋 Detox Lemon
              </button>
              <button class="modal-photo-chip ${selectedPhoto === 'article_morning_reset.jpg' ? 'active' : ''}" onclick="window.selectModalPhoto('article_morning_reset.jpg', this)">
                🌸 Morning Bloom
              </button>
            </div>
          </div>

          <!-- Photo Preview Box -->
          <div style="position:relative;border-radius:16px;overflow:hidden;height:160px;background:#0F172A;">
            <img id="modal-photo-preview-img" src="${selectedPhoto}" style="width:100%;height:100%;object-fit:cover;">
            <div style="position:absolute;bottom:8px;left:10px;background:rgba(0,0,0,0.6);padding:3px 8px;border-radius:8px;font-size:10.5px;color:#FFFFFF;font-weight:600;">
              📷 Photo Attached
            </div>
          </div>
        </div>
      ` : type === 'video' ? `
        <!-- Video Post Form -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:4px;">Video Title:</div>
            <input type="text" id="modal-post-video-title" placeholder="e.g. 5-Minute Morning Mobility Flow" value="5-Minute Morning Mobility Flow" style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;height:40px;padding:0 12px;font-size:13px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;font-weight:600;">
          </div>

          <textarea id="modal-post-caption" rows="2" placeholder="Video description or notes for the circle..." style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:16px;padding:12px 14px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;resize:none;line-height:1.45;">Sharing my daily mobility flow that helps with pelvic stiffness!</textarea>

          <!-- Video Clip Selector Chips -->
          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:6px;">Select Video Clip:</div>
            <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;">
              <button class="modal-photo-chip ${selectedVideo === 'feed_event_banner.jpg' ? 'active' : ''}" onclick="window.selectModalVideo('feed_event_banner.jpg', '5-Minute Morning Mobility Flow', this)">
                🎬 Mobility Flow (1:15)
              </button>
              <button class="modal-photo-chip ${selectedVideo === 'community_live_pulse.jpg' ? 'active' : ''}" onclick="window.selectModalVideo('community_live_pulse.jpg', 'Evening Calm Breathing Reset', this)">
                🎬 Breathing Reset (0:45)
              </button>
            </div>
          </div>

          <!-- Video Cover Preview -->
          <div style="position:relative;border-radius:16px;overflow:hidden;height:140px;background:#0F172A;">
            <img id="modal-video-preview-img" src="${selectedVideo}" style="width:100%;height:100%;object-fit:cover;opacity:0.85;">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:linear-gradient(145deg, #F7B6D2 0%, #EC5DAA 40%, #7A3FD1 100%);display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 4px 14px rgba(122,63,209,0.35);">▶</div>
          </div>
        </div>
      ` : type === 'poll' ? `
        <!-- Poll Post Form -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:4px;">Poll Question:</div>
            <textarea id="modal-post-poll-q" rows="2" placeholder="Ask your circle a question (e.g. Best time for taking magnesium?)..." style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:14px;padding:10px 12px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;resize:none;line-height:1.4;font-weight:600;">What time of day do your hot flashes or flushes usually peak?</textarea>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="font-size:11.5px;font-weight:600;color:#64748B;">Options:</div>
            <input type="text" id="modal-post-poll-opt1" value="🌙 Late Night (2 AM - 5 AM)" style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;height:38px;padding:0 12px;font-size:13px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;font-weight:600;">
            <input type="text" id="modal-post-poll-opt2" value="☀️ Afternoon (12 PM - 4 PM)" style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;height:38px;padding:0 12px;font-size:13px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;font-weight:600;">
            <input type="text" id="modal-post-poll-opt3" placeholder="Option 3: 🌅 Early Morning (Optional)" value="🌅 Early Morning (6 AM - 9 AM)" style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;height:38px;padding:0 12px;font-size:13px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;font-weight:600;">
          </div>
        </div>
      ` : `
        <!-- Text Post Form -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:4px;">Discussion Headline:</div>
            <input type="text" id="modal-post-text-title" placeholder="Headline (e.g. My 30-day experience with sleep routine)" value="My 3-week experience with cooling chamomile & magnesium" style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;height:40px;padding:0 12px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;font-weight:600;">
          </div>

          <div>
            <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:4px;">Body Copy:</div>
            <textarea id="modal-post-caption" rows="4" placeholder="Share your story, experience, or question with the circle..." style="width:100%;box-sizing:border-box;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:16px;padding:12px 14px;font-size:13.5px;color:#0F172A;outline:none;font-family:'Montserrat',sans-serif;resize:none;line-height:1.45;">After struggling with 3 AM wakeups, taking magnesium glycinate together with cooling herbal tea 45 mins before bedtime made a noticeable difference. Has anyone else noticed this combination working?</textarea>
          </div>

          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:11px;font-weight:600;color:#7A3FD1;background:#FAF5FF;padding:3px 8px;border-radius:8px;">#Hormones</span>
            <span style="font-size:11px;font-weight:600;color:#7A3FD1;background:#FAF5FF;padding:3px 8px;border-radius:8px;">#SleepCare</span>
            <span style="font-size:11px;font-weight:600;color:#7A3FD1;background:#FAF5FF;padding:3px 8px;border-radius:8px;">#Menopause</span>
          </div>
        </div>
      `}

      <!-- Publish Button -->
      <button onclick="window.submitGroupPostFromModal('${g.id}')" style="width:100%;height:48px;border-radius:24px;background:linear-gradient(145deg, #F7B6D2 0%, #F38DBE 20%, #EC5DAA 40%, #D93B9F 60%, #B14AC8 80%, #7A3FD1 100%);color:#FFFFFF;font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;border:none;cursor:pointer;box-shadow:0 8px 22px rgba(122,63,209,0.28);letter-spacing:0.2px;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:6px;">
        Publish to ${g.name} 🚀
      </button>

    </div>
  `;
};

window.submitGroupPostFromModal = function(groupId) {
  const type = window.activeGroupModalType || 'image';
  const posts = window.getGroupPosts(groupId);
  const g = window.MIROR_COMMUNITY_GROUPS.find(item => item.id === groupId) || window.MIROR_COMMUNITY_GROUPS[0];

  let newPost;
  if (type === 'image') {
    const captionEl = document.getElementById('modal-post-caption');
    const musicEl = document.getElementById('modal-post-music');
    const text = captionEl ? captionEl.value.trim() : 'Sharing my routine today!';
    const photo = window.selectedModalPhoto || 'community_yoga_reset.jpg';
    const music = musicEl && musicEl.value.trim() ? musicEl.value.trim() : "Frank Sativa • THAT'S MY GIRL";

    newPost = {
      id: `${groupId}-p-${Date.now()}`,
      type: 'image',
      user: AppState.user.name + ' Menon',
      username: 'priya_m',
      role: 'Member',
      roleClass: 'care-role-member',
      verified: false,
      avatar: 'profile_avatar.jpg',
      avatarImg: 'profile_avatar.jpg',
      music: music,
      timeAgo: 'Just now',
      image: photo,
      likes: 1,
      liked: true,
      saved: false,
      caption: text || 'Sharing my wellness routine with the circle ✨',
      hashtags: ['#PhotoPost', '#MirorCircle'],
      comments: []
    };
  } else if (type === 'video') {
    const titleEl = document.getElementById('modal-post-video-title');
    const captionEl = document.getElementById('modal-post-caption');
    const title = titleEl && titleEl.value.trim() ? titleEl.value.trim() : '5-Minute Morning Mobility Flow';
    const text = captionEl && captionEl.value.trim() ? captionEl.value.trim() : title;
    const video = window.selectedModalVideo || 'feed_event_banner.jpg';

    newPost = {
      id: `${groupId}-p-${Date.now()}`,
      type: 'video',
      user: AppState.user.name + ' Menon',
      username: 'priya_m',
      role: 'Member',
      roleClass: 'care-role-member',
      verified: false,
      avatar: 'profile_avatar.jpg',
      avatarImg: 'profile_avatar.jpg',
      music: 'Acoustic Flow • Deep Relaxation',
      timeAgo: 'Just now',
      videoCover: video,
      videoTitle: title,
      duration: '1:15',
      views: '1 view',
      isPlaying: false,
      likes: 1,
      liked: true,
      saved: false,
      caption: text,
      hashtags: ['#MyRoutine', '#CircleVideo'],
      comments: []
    };
  } else if (type === 'poll') {
    const qEl = document.getElementById('modal-post-poll-q');
    const opt1El = document.getElementById('modal-post-poll-opt1');
    const opt2El = document.getElementById('modal-post-poll-opt2');
    const opt3El = document.getElementById('modal-post-poll-opt3');
    
    const question = qEl && qEl.value.trim() ? qEl.value.trim() : 'What routine works best for you?';
    const opt1 = opt1El && opt1El.value.trim() ? opt1El.value.trim() : '🌙 Late Night (2 AM - 5 AM)';
    const opt2 = opt2El && opt2El.value.trim() ? opt2El.value.trim() : '☀️ Afternoon (12 PM - 4 PM)';
    const opt3 = opt3El && opt3El.value.trim() ? opt3El.value.trim() : null;

    const options = [
      { text: opt1, votes: 1 },
      { text: opt2, votes: 0 }
    ];
    if (opt3) options.push({ text: opt3, votes: 0 });

    newPost = {
      id: `${groupId}-p-${Date.now()}`,
      type: 'poll',
      user: AppState.user.name + ' Menon',
      username: 'priya_m',
      role: 'Member',
      roleClass: 'care-role-member',
      verified: false,
      avatar: 'profile_avatar.jpg',
      avatarImg: 'profile_avatar.jpg',
      timeAgo: 'Just now',
      likes: 1,
      liked: true,
      saved: false,
      caption: question,
      hashtags: ['#CirclePoll'],
      poll: {
        question: question,
        options: options,
        userVoted: 0,
        totalVotes: 1
      },
      comments: []
    };
  } else {
    // Text Post
    const titleEl = document.getElementById('modal-post-text-title');
    const captionEl = document.getElementById('modal-post-caption');
    const title = titleEl && titleEl.value.trim() ? titleEl.value.trim() : '';
    const text = captionEl && captionEl.value.trim() ? captionEl.value.trim() : 'Sharing my experience with the community.';

    newPost = {
      id: `${groupId}-p-${Date.now()}`,
      type: 'text',
      user: AppState.user.name + ' Menon',
      username: 'priya_m',
      role: 'Member',
      roleClass: 'care-role-member',
      verified: false,
      avatar: 'profile_avatar.jpg',
      avatarImg: 'profile_avatar.jpg',
      timeAgo: 'Just now',
      likes: 1,
      liked: true,
      saved: false,
      title: title,
      body: text,
      hashtags: ['#Discussion', '#CircleShare'],
      comments: []
    };
  }

  posts.unshift(newPost);
  window.closeGroupPostModal();
  
  if (window.confetti) window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  SM.toast(`🎉 Post shared to ${g.name}!`);

  const container = document.getElementById('screen-community-group');
  if (container) {
    container.innerHTML = SM.screens['community-group']({ groupId: groupId });
    window.restructureScreenLayout(container);
  }
};

/* --- Register Clean Instagram-Style Group Screen (Image, Video, Poll, Text) --- */
SM.register('community-group', (params = {}) => {
  const groupId = params.groupId || (params.dataset && params.dataset.groupId) || '30s-hormones';
  window.currentCommunityGroupId = groupId;
  const g = window.MIROR_COMMUNITY_GROUPS.find(item => item.id === groupId) || window.MIROR_COMMUNITY_GROUPS[0];
  const posts = window.getGroupPosts(groupId);

  return `
    <!-- Top Header Bar (Clean White Style Matching Home Page) -->
    <div class="screen-fixed-header" style="background:#FFFFFF;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;padding:8px 16px;height:48px;">
      <button class="back-button" data-action="back" style="border:none;background:none;font-size:26px;color:#0F172A;cursor:pointer;padding:0;display:flex;align-items:center;line-height:1;">
        ‹
      </button>

      <div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="SM.toast('${g.name}')">
        <span style="font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;color:#0F172A;">
          ${g.name}
        </span>
      </div>

      <div style="display:flex;align-items:center;gap:10px;">
        <button onclick="SM.toast('Group options •••')" style="border:none;background:none;font-size:18px;color:#64748B;cursor:pointer;padding:0;letter-spacing:1px;">
          •••
        </button>
      </div>
    </div>
    
    <div class="container" style="padding:0 0 90px;background:#FAFAFA;font-family:'Montserrat',sans-serif;position:relative;">

      <!-- Community Posts Stream (Flo-Inspired Text, Polling & Photo Format) -->
      <div style="display:flex;flex-direction:column;gap:0;">
        ${posts.map(p => {
          const isPoll = p.type === 'poll' || p.poll;
          const isPhoto = p.type === 'image' || p.image;
          const isText = !isPoll && !isPhoto;

          return `
            <div style="background:#FFFFFF;border-bottom:8px solid #F1F5F9;padding:14px 16px 12px;" id="group-post-${p.id}">
              
              <!-- Post Header: Avatar Profile Picture + User Name + Member Tag + TimeAgo Subtext -->
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px;">
                <div style="display:flex;align-items:flex-start;gap:9px;min-width:0;">
                  <div style="width:32px;height:32px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#F8FAFC;border:1px solid #E2E8F0;margin-top:1px;">
                    <img src="${p.avatarImg || 'profile_avatar.jpg'}" alt="${p.username || p.user}" style="width:100%;height:100%;object-fit:cover;display:block;">
                  </div>
                  <div style="min-width:0;line-height:1.1;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <span style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#0F172A;letter-spacing:-0.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.1;">
                        ${p.username || p.user}
                      </span>
                      <span style="background:#EFF6FF;border:1px solid #DBEAFE;color:#475569;font-family:'Inter',sans-serif;font-size:10.5px;font-weight:500;padding:1px 6px;border-radius:5px;display:inline-flex;align-items:center;line-height:1.1;">
                        ${p.role || 'Member'}
                      </span>
                    </div>
                    <div style="font-family:'Inter',sans-serif;font-size:11px;color:#64748B;font-weight:400;margin-top:1px;line-height:1.1;">
                      ${p.timeAgo || '4h ago'}
                    </div>
                  </div>
                </div>

                <button onclick="SM.toast('Post options •••')" style="border:none;background:none;font-size:16px;color:#94A3B8;cursor:pointer;padding:0;letter-spacing:1px;line-height:1;">
                  •••
                </button>
              </div>

              <!-- 1. TEXT POST -->
              ${isText ? `
                <div style="margin:0 0 8px;">
                  ${p.title ? `
                    <h4 style="font-family:'Montserrat',sans-serif;font-size:14.5px;font-weight:600;color:#0F172A;margin:0 0 2px;line-height:1.3;">
                      ${p.title}
                    </h4>
                  ` : ''}
                  <p style="font-family:'Inter',sans-serif;font-size:14px;line-height:1.42;color:#0F172A;margin:0;font-weight:400;white-space:pre-line;">
                    ${p.body || p.caption}
                  </p>
                </div>
              ` : ''}

              <!-- 2. PHOTO POST -->
              ${isPhoto ? `
                <div style="margin:0 0 8px;">
                  ${p.caption ? `
                    <p style="font-family:'Inter',sans-serif;font-size:14px;line-height:1.4;color:#0F172A;margin:0 0 6px;font-weight:400;white-space:pre-line;">
                      ${p.caption}
                    </p>
                  ` : ''}
                  <div style="width:100%;max-height:380px;border-radius:14px;overflow:hidden;background:#F8FAFC;border:1px solid #F1F5F9;">
                    <img src="${p.image}" alt="Post Photo" style="width:100%;max-height:380px;object-fit:cover;display:block;">
                  </div>
                </div>
              ` : ''}

              <!-- 3. POLLING POST -->
              ${isPoll ? `
                <div style="margin-top:8px;margin-bottom:8px;">
                  <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin:0 0 10px;line-height:1.35;">
                    ${p.poll.question}
                  </h4>
                  <div id="poll-box-${p.id}">
                    ${p.poll.options.map((opt, optIdx) => {
                      const total = p.poll.totalVotes || 1;
                      const pct = Math.round((opt.votes / total) * 100);
                      const isSelected = p.poll.userVoted === optIdx;
                      return `
                        <div class="care-poll-option" onclick="window.voteGroupPoll('${g.id}', '${p.id}', ${optIdx})" style="${isSelected ? 'border-color:#EC5DAA;background:#FFF;' : ''};border-radius:12px;margin-bottom:8px;">
                          <div class="care-poll-fill" style="width:${p.poll.userVoted !== null ? pct : 0}%;"></div>
                          <div class="care-poll-content" style="padding:10px 14px;">
                            <span style="font-family:'Inter',sans-serif;font-size:13.5px;font-weight:${isSelected ? '700' : '500'};color:#0F172A;">
                              ${opt.text}
                            </span>
                            ${p.poll.userVoted !== null ? `<span style="font-family:'Montserrat',sans-serif;font-weight:600;color:#EC5DAA;font-size:12.5px;">${pct}%</span>` : ''}
                          </div>
                        </div>
                      `;
                    }).join('')}
                    <div style="font-family:'Inter',sans-serif;font-size:11.5px;color:#94A3B8;font-weight:500;margin-top:4px;text-align:right;">
                      ${p.poll.totalVotes} total votes
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Category Tag Pill (Flo-Style) -->
              <div style="margin-bottom:12px;">
                <span style="background:#F1F5F9;color:#64748B;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;padding:4px 12px;border-radius:14px;display:inline-block;">
                  ${p.category || 'Perimenopause'}
                </span>
              </div>

              <!-- Action Bar (Heart, Comment, Share, Save) -->
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #F8FAFC;">
                <div style="display:flex;align-items:center;gap:20px;">
                  
                  <!-- Like Button with Counter -->
                  <button id="like-btn-${p.id}" onclick="window.togglePostLike('${g.id}', '${p.id}', this)" style="border:none;background:none;display:flex;align-items:center;gap:6px;cursor:pointer;padding:0;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="${p.liked ? '#EC5DAA' : 'none'}" stroke="${p.liked ? '#EC5DAA' : '#475569'}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="heart-svg" style="transition:transform 0.15s ease;">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span id="likes-count-${p.id}" style="font-family:'Inter',sans-serif;font-size:13.5px;font-weight:600;color:#475569;">${p.likes}</span>
                  </button>

                  <!-- Comment Button with Counter -->
                  <button onclick="window.toggleCommentsView('${p.id}')" style="border:none;background:none;display:flex;align-items:center;gap:6px;cursor:pointer;padding:0;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8.5z"></path>
                    </svg>
                    <span id="comment-count-${p.id}" style="font-family:'Inter',sans-serif;font-size:13.5px;font-weight:600;color:#475569;">${p.comments ? p.comments.length : 0}</span>
                  </button>

                  <!-- Share Direct Button -->
                  <button onclick="window.shareGroupPost('${g.id}', '${p.id}')" style="border:none;background:none;display:flex;align-items:center;cursor:pointer;padding:0;">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>

                <!-- Bookmark / Save Button -->
                <button id="save-btn-${p.id}" onclick="window.togglePostSave('${g.id}', '${p.id}', this)" style="border:none;background:none;cursor:pointer;padding:0;">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="${p.saved ? '#0F172A' : 'none'}" stroke="${p.saved ? '#0F172A' : '#475569'}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>

              <!-- Inline Comments Drawer Section -->
              <div id="comments-box-${p.id}" style="display:none;margin-top:10px;background:#F8FAFC;border-radius:12px;padding:10px 12px;">
                <div id="comments-list-${p.id}">
                  ${p.comments ? p.comments.map(c => `
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;font-size:12.5px;">
                      <div>
                        <span style="font-family:'Montserrat',sans-serif;font-weight:600;color:#0F172A;margin-right:5px;">${c.user}</span>
                        <span style="font-family:'Inter',sans-serif;color:#334155;">${c.text}</span>
                      </div>
                      <button onclick="this.innerHTML = this.innerHTML === '❤️' ? '♡' : '❤️'; this.style.color = this.innerHTML === '❤️' ? '#ED4956' : '#8E8E8E';" style="border:none;background:none;font-size:12px;color:#8E8E8E;cursor:pointer;padding:0;">
                        ♡
                      </button>
                    </div>
                  `).join('') : ''}
                </div>

                <!-- Quick Comment Input Row -->
                <div style="display:flex;align-items:center;gap:8px;margin-top:8px;border-top:1px solid #E2E8F0;padding-top:6px;">
                  <input type="text" id="comment-input-${p.id}" placeholder="Add a comment as ${AppState.user.name}..." style="flex:1;border:none;background:none;padding:4px 0;font-size:13px;color:#0F172A;outline:none;font-family:'Inter',sans-serif;" onkeydown="if(event.key==='Enter') window.addNewComment('${g.id}', '${p.id}')">
                  <button onclick="window.addNewComment('${g.id}', '${p.id}')" style="border:none;background:none;color:#EC5DAA;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;cursor:pointer;padding:0;">
                    Post
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
});

/* --------------------------------------------------------------------------
   PROFILE TAB
   -------------------------------------------------------------------------- */
SM.register('profile', () => {
  const u = AppState.user || { name: 'Priya', streak: 8, totalPoints: 1250 };

  return `
  ${topBar('You', { back: false })}
  
  <div class="container" style="padding:16px 20px 96px;background:var(--miror-bg);">
    
    <!-- 1. My Profile Hero Card -->
    <div class="card" style="background:linear-gradient(145deg, #F7B6D2 0%, #EC5DAA 40%, #D93B9F 70%, #7A3FD1 100%);color:white;padding:22px 20px;border-radius:24px;position:relative;overflow:hidden;box-shadow:0 10px 28px rgba(122,63,209,0.22);margin-bottom:16px;">
      
      <div style="display:flex;align-items:center;gap:16px;">
        <!-- Avatar Ring -->
        <div style="width:72px;height:72px;border-radius:50%;background:white;padding:3px;box-shadow:0 6px 16px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:#F1F5F9;">
            <img src="profile_avatar.jpg" alt="${u.name} Sharma" style="width:100%;height:100%;object-fit:cover;display:block;">
          </div>
        </div>

        <!-- User Details -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:10.5px;font-weight:800;letter-spacing:1px;color:rgba(255,255,255,0.9);text-transform:uppercase;font-family:'Montserrat',sans-serif;margin-bottom:2px;">MY PROFILE</div>
          <h2 style="font-family:'Montserrat',sans-serif;font-size:22px;font-weight:700;color:white;margin:0 0 4px;letter-spacing:-0.4px;line-height:1.2;">
            ${u.name} Sharma
          </h2>
          <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;font-weight:500;">
            Perimenopause Phase • Tracking since July 2026
          </p>
        </div>
      </div>

    </div>

    <!-- 3-Column Stats Row -->
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:20px;">
      ${[
        { val: `${u.streak || 8} Days`, label: 'Active Streak', icon: '🔥' },
        { val: '15 Days', label: 'Logged', icon: '📊' },
        { val: `${(u.totalPoints || 1250).toLocaleString()}`, label: 'Points', icon: '✨' }
      ].map(s => `
        <div class="card" style="background:#FFFFFF;border-radius:18px;padding:12px 10px;text-align:center;border:1px solid #F1F5F9;box-shadow:0 4px 14px rgba(15,23,42,0.03);">
          <div style="font-size:18px;margin-bottom:2px;">${s.icon}</div>
          <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;color:#0F172A;margin-bottom:1px;">${s.val}</div>
          <div style="font-size:10.5px;font-weight:600;color:#64748B;">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- MY HEALTH & CONTENT SECTIONS -->
    <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#94A3B8;margin:0 0 10px 4px;font-family:'Montserrat',sans-serif;">
      YOUR DASHBOARD
    </div>
    
    <div class="card" style="background:#FFFFFF;border-radius:22px;border:1px solid #F1F5F9;box-shadow:0 4px 16px rgba(15,23,42,0.035);padding:4px 0;margin-bottom:20px;">
      ${[
        { icon: '🌸', label: 'Re-take Health Onboarding', sub: 'Personalize your Home focus & goals', customClick: 'window.startOnboarding(1)' },
        { icon: '📈', label: 'Health Insights & Trends', sub: 'Pattern recognition & daily analytics', screen: 'insights' },
        { icon: '📁', label: 'My Records', sub: 'Encrypted lab reports & doctor notes', action: "switchTab", tab: "care-plus" },
        { icon: '🔔', label: 'My Reminders', sub: 'Supplements & upcoming appointments', action: "switchTab", tab: "reminders" },
        { icon: '🎯', label: 'My Health Programs', sub: '21-Day Reset & 7-Day Sleep Reset', screen: 'community-group' },
        { icon: '💬', label: 'My Groups', sub: 'Sleep & Recovery Circle discussions', action: "switchTab", tab: "community" },
        { icon: '🛡️', label: 'Care+', sub: 'Active premium consultation plan', action: "switchTab", tab: "care-plus" },
        { icon: '🛍️', label: 'Shop & Orders', sub: 'Order history & wellness store', action: "switchTab", tab: "shop" },
        { icon: '⚙️', label: 'Settings', sub: 'Account, privacy & notification controls', screen: 'notification-settings' }
      ].map((m, idx, arr) => `
        <button class="card-interactive" ${m.customClick ? `onclick="${m.customClick}"` : m.action ? `data-action="${m.action}" data-tab="${m.tab}"` : `data-action="push" data-screen="${m.screen}"`} style="display:flex;align-items:center;gap:14px;padding:14px 18px;width:100%;background:none;border:none;border-bottom:${idx === arr.length - 1 ? 'none' : '1px solid #F8FAFC'};cursor:pointer;text-align:left;">
          <div style="width:38px;height:38px;border-radius:12px;background:#FAF5FF;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
            ${m.icon}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#0F172A;line-height:1.25;margin-bottom:2px;">${m.label}</div>
            <div style="font-size:12px;color:#64748B;font-weight:500;">${m.sub}</div>
          </div>
          <span style="color:#CBD5E1;font-size:18px;font-weight:600;">›</span>
        </button>
      `).join('')}
    </div>

    <!-- Log Out Button -->
    <button onclick="SM.toast('Logged out successfully');" style="width:100%;height:48px;border-radius:18px;border:1px solid #FEE2E2;background:#FEF2F2;color:#DC2626;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;transition:transform 0.15s ease;margin-bottom:14px;">
      <span>Log Out</span>
    </button>

    <!-- Version Footer -->
    <p style="text-align:center;font-size:11.5px;color:#94A3B8;font-weight:600;margin:0;">
      Miror Health v2.1.0 • Clinically Backed
    </p>

  </div>
  `;
});

SM.register('notification-settings', () => `
  ${topBar('Notifications', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${[
        { label: 'Daily check-in reminder', desc: '9:00 AM', on: true },
        { label: 'Weekly summary', desc: 'Every Sunday', on: true },
        { label: 'Expert recommendations', desc: 'Personalized tips', on: true },
        { label: 'Community replies', desc: 'When someone responds', on: false },
        { label: 'Product offers', desc: 'Deals & new arrivals', on: false }
      ].map(n => `
        <div class="card card-outline" style="padding:14px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div><div class="text-body" style="font-weight:500;">${n.label}</div><div class="text-caption text-muted">${n.desc}</div></div>
            <div class="toggle-switch ${n.on ? 'on' : ''}" data-action="toggle-wellness" data-factor="notif"></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card" style="background:var(--miror-gradient-soft);padding:16px;margin-top:20px;">
      <div class="text-label text-muted" style="margin-bottom:4px;">REMINDER PREVIEW</div>
      <p class="text-body">"Ready for today's check-in? 🌸"</p>
    </div>
  </div>
`);

SM.register('tracking-preferences', () => `
  ${topBar('What to Track', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <p class="text-body text-secondary" style="margin-bottom:20px;">Customize which symptoms and factors you want to track daily.</p>
    ${SYMPTOM_CATEGORIES.map(cat => `
      <div style="margin-bottom:20px;">
        <div class="text-label text-muted" style="margin-bottom:8px;">${cat.icon} ${cat.name}</div>
        ${cat.symptoms.map(s => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--miror-border);">
            <span class="text-body">${s.name}</span>
            <div class="toggle-switch on" data-action="toggle-wellness" data-factor="pref"></div>
          </div>
        `).join('')}
      </div>
    `).join('')}
    <button class="btn btn-primary w-full" style="margin-top:16px;">Save Preferences</button>
  </div>
`);

SM.register('data-export', () => `
  ${topBar('Your Data', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <div style="font-size:48px;text-align:center;margin-bottom:16px;">🔐</div>
    <h3 class="text-h2 text-center" style="margin-bottom:4px;">Your data belongs to you</h3>
    <p class="text-body text-secondary text-center" style="margin-bottom:24px;">Export your complete health tracking history in your preferred format.</p>
    ${['CSV Spreadsheet','PDF Report','JSON Data'].map(f => `
      <div class="card card-outline card-interactive" style="padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;">
        <span style="font-size:24px;">${f.includes('CSV') ? '📊' : f.includes('PDF') ? '📄' : '💾'}</span>
        <div style="flex:1;"><div class="text-body" style="font-weight:500;">${f}</div><div class="text-caption text-muted">Complete history</div></div>
        <span class="text-caption" style="color:var(--miror-pink);font-weight:600;">Export</span>
      </div>
    `).join('')}
  </div>
`);

/* --------------------------------------------------------------------------
   REPORTS
   -------------------------------------------------------------------------- */
SM.register('report-generate', () => `
  ${topBar('Doctor Report', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <h3 class="text-h2" style="margin-bottom:4px;">Create a summary for your doctor</h3>
    <p class="text-body text-secondary" style="margin-bottom:20px;">Choose what to include in your report</p>

    <div class="text-label text-muted" style="margin-bottom:8px;">DATE RANGE</div>
    <div style="display:flex;gap:8px;margin-bottom:20px;">
      ${['Last 7 days','Last 30 days','Custom'].map((r,i) => `<button class="chip ${i===0?'active':''}" data-action="toggle-onboard-symptom">${r}</button>`).join('')}
    </div>

    <div class="text-label text-muted" style="margin-bottom:8px;">INCLUDE IN REPORT</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:24px;">
      ${[
        { label: 'Symptoms & Severity', on: true },
        { label: 'Mood Trends', on: true },
        { label: 'Wellness Factors', on: true },
        { label: 'Sleep Patterns', on: true },
        { label: 'Reflection Notes', on: false },
        { label: 'Treatment Log', on: false }
      ].map(s => `
        <div class="card card-outline" style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">
          <span class="text-body">${s.label}</span>
          <div class="toggle-switch ${s.on ? 'on' : ''}" data-action="toggle-wellness" data-factor="report"></div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary w-full" data-action="push" data-screen="report-preview">Generate Report 📋</button>
  </div>
`);

SM.register('report-preview', () => `
  ${topBar('Report Preview', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <div class="card" style="padding:0;overflow:hidden;">
      <!-- Report header -->
      <div style="background:var(--miror-gradient);padding:20px;color:white;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="font-size:24px;">🌸</span>
          <span class="text-h2">Miror Health Report</span>
        </div>
        <div class="text-caption" style="color:rgba(255,255,255,0.8);">
          Patient: ${AppState.user.name} Menon<br>
          Period: July 29 – August 4, 2026<br>
          Generated: August 5, 2026
        </div>
      </div>
      <div style="padding:20px;">
        <!-- Symptoms -->
        <div style="margin-bottom:16px;">
          <div class="text-label text-muted" style="margin-bottom:8px;">SYMPTOM SUMMARY</div>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr style="border-bottom:1px solid var(--miror-border);"><th style="text-align:left;padding:6px 0;font-weight:500;">Symptom</th><th style="text-align:center;padding:6px 0;font-weight:500;">Frequency</th><th style="text-align:right;padding:6px 0;font-weight:500;">Avg Severity</th></tr>
            ${[
              { name: 'Fatigue', freq: '5/7', sev: 'Mild-Moderate' },
              { name: 'Brain Fog', freq: '3/7', sev: 'Mild' },
              { name: 'Hot Flashes', freq: '2/7', sev: 'High' },
              { name: 'Poor Sleep', freq: '3/7', sev: 'Moderate' }
            ].map(s => `<tr style="border-bottom:1px solid var(--miror-border);"><td style="padding:6px 0;">${s.name}</td><td style="text-align:center;padding:6px 0;">${s.freq}</td><td style="text-align:right;padding:6px 0;">${s.sev}</td></tr>`).join('')}
          </table>
        </div>
        <!-- Mood -->
        <div style="margin-bottom:16px;">
          <div class="text-label text-muted" style="margin-bottom:8px;">MOOD TIMELINE</div>
          ${miniLineChart([7, 5, 3, 5, 7, 9, 7], '#8B5CF6', 40)}
        </div>
        <!-- Wellness -->
        <div>
          <div class="text-label text-muted" style="margin-bottom:8px;">WELLNESS AVERAGES</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${[{l:'Sleep',v:'5.7h'},{l:'Water',v:'6.3'},{l:'Stress',v:'4.6/10'}].map(w => `<div style="text-align:center;padding:8px;background:var(--miror-bg);border-radius:8px;"><div class="text-h3">${w.v}</div><div class="text-caption text-muted">${w.l}</div></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button class="btn" style="flex:1;background:white;color:#D93B9F;border:1.5px solid #F7B6D2;box-shadow:0 4px 14px rgba(217,59,159,0.1);font-weight:600;" data-action="share-report">Share</button>
      <button class="btn btn-primary" style="flex:1;">Export PDF</button>
    </div>
  </div>
`);

/* --------------------------------------------------------------------------
   CONSULTATIONS
   -------------------------------------------------------------------------- */
SM.register('consultations', () => `
  ${topBar('Specialists', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <div class="card" style="background:var(--miror-gradient-soft);padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span>🎁</span>
        <span class="text-body" style="font-weight:500;">Your first consultation is complimentary</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${[
        { icon: '👩‍⚕️', title: 'Menopause Doctor', desc: 'Hormone specialists & gynecologists', avail: '3 available' },
        { icon: '🥗', title: 'Nutritionist', desc: 'Diet, supplements & gut health', avail: '5 available' },
        { icon: '🧠', title: 'Psychologist', desc: 'Mental wellness & cognitive health', avail: '2 available' },
        { icon: '🌸', title: 'Menopause Coach', desc: 'Lifestyle, exercise & daily routines', avail: '4 available' }
      ].map(s => `
        <div class="card card-outline card-interactive" style="padding:16px;display:flex;gap:16px;align-items:center;" data-action="push" data-screen="specialist-profile">
          <div style="width:52px;height:52px;border-radius:16px;background:var(--miror-gradient-soft);display:flex;align-items:center;justify-content:center;font-size:28px;">${s.icon}</div>
          <div style="flex:1;">
            <div class="text-h3">${s.title}</div>
            <div class="text-caption text-secondary">${s.desc}</div>
            <div class="text-caption" style="color:var(--miror-success);margin-top:2px;">🟢 ${s.avail}</div>
          </div>
          <span style="color:var(--miror-text-muted);">›</span>
        </div>
      `).join('')}
    </div>
  </div>
`);

SM.register('specialist-profile', () => `
  ${topBar('Specialist', { back: true })}
  <div class="container" style="padding:16px 20px;text-align:center;">
    <div style="width:88px;height:88px;border-radius:50%;background:var(--miror-gradient);display:flex;align-items:center;justify-content:center;font-size:44px;margin:0 auto 16px;">👩‍⚕️</div>
    <h2 class="text-h1" style="margin-bottom:4px;">Dr. Sarah Mitchell</h2>
    <p class="text-body text-secondary">Menopause Specialist • 15 yrs experience</p>
    <div style="display:flex;justify-content:center;align-items:center;gap:4px;margin:8px 0 16px;">
      <span style="color:#F59E0B;">⭐</span>
      <span class="text-body" style="font-weight:600;">4.9</span>
      <span class="text-caption text-muted">(128 reviews)</span>
    </div>
    <p class="text-body text-secondary text-center" style="margin-bottom:20px;">Specialized in perimenopause and menopause management. Focuses on hormone therapy, symptom management, and holistic wellness approaches.</p>

    <div class="text-label text-muted" style="text-align:left;margin-bottom:8px;">AVAILABLE SLOTS</div>
    <div class="scroll-h" style="margin-bottom:20px;">
      ${['Today 2:00 PM','Today 4:30 PM','Tomorrow 10:00 AM','Tomorrow 2:00 PM','Aug 7 9:00 AM'].map((t,i) => `
        <button class="chip ${i === 0 ? 'active' : ''}" data-action="toggle-onboard-symptom" style="white-space:nowrap;">${t}</button>
      `).join('')}
    </div>

    <div class="card" style="background:var(--miror-gradient-soft);padding:14px;margin-bottom:20px;">
      <div class="flex-between"><span class="text-body">Session fee</span><span class="text-h3">₹1,500</span></div>
      <div class="text-caption text-muted" style="margin-top:2px;">First session free with Miror Premium</div>
    </div>
    <button class="btn btn-primary w-full" data-action="push" data-screen="booking-confirmation">Book Consultation</button>
  </div>
`);

SM.register('booking-confirmation', () => `
  <div class="container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;text-align:center;padding:40px 32px;">
    <div style="font-size:64px;margin-bottom:20px;">✅</div>
    <h1 class="text-h1" style="margin-bottom:8px;">Booking Confirmed!</h1>
    <p class="text-body text-secondary" style="margin-bottom:24px;">Your session is scheduled</p>
    <div class="card card-outline" style="padding:20px;width:100%;margin-bottom:24px;text-align:left;">
      <div class="flex-between" style="margin-bottom:8px;"><span class="text-caption text-muted">Specialist</span><span class="text-body" style="font-weight:500;">Dr. Sarah Mitchell</span></div>
      <div class="flex-between" style="margin-bottom:8px;"><span class="text-caption text-muted">Date</span><span class="text-body" style="font-weight:500;">Aug 6, 2026</span></div>
      <div class="flex-between"><span class="text-caption text-muted">Time</span><span class="text-body" style="font-weight:500;">2:00 PM</span></div>
    </div>
    <button class="btn btn-secondary w-full" style="margin-bottom:12px;">Add to Calendar 📅</button>
    <button class="btn btn-primary w-full" data-action="goHome">Done</button>
    <p class="text-caption text-muted" style="margin-top:12px;">You'll receive a reminder 30 minutes before</p>
  </div>
`);

/* --------------------------------------------------------------------------
   SHOP
   -------------------------------------------------------------------------- */
const MIROR_SHOP_CATALOG = {
  revive: {
    id: 'revive',
    name: 'míror REVIVE',
    tagline: 'DAILY VITALITY & LONGEVITY',
    category: 'Daily Energy & Gut',
    badge: 'CLINICALLY TESTED',
    badgeColor: '#EC4899',
    badgeBg: '#FDF2F8',
    subtext: 'Trans-Resveratrol • Glutathione • Omega-3 ++',
    reason: 'Because you logged Fatigue & Energy Dips',
    price: '₹999',
    origPrice: '₹1,600',
    discount: '37% OFF',
    rating: '4.9',
    reviews: 428,
    img: 'product_revive.png',
    tabletColor: '#F472B6',
    pillDesc: 'Pink Oval Vitality Tablet (30 Tablets)',
    ingredients: ['Trans-Resveratrol (99% Pure)', 'L-Glutathione Active', 'Micro-Encapsulated Omega-3++', 'CoQ10 Ubiquinol', 'Natural Prebiotics'],
    benefits: ['Ignites cellular mitochondrial ATP', 'Protects against oxidative oxidative stress', 'Supports deep gut microbiome balance', 'Zero sugar, 100% clean absorption'],
    description: 'Clinically formulated daily longevity supplement designed specifically for women in their 30s, 40s and beyond. Combines bioavailable Trans-Resveratrol, master antioxidant Glutathione, and essential fatty acids for sustainable all-day energy.'
  },
  bliss: {
    id: 'bliss',
    name: 'míror BLISS',
    tagline: 'TOTAL PERIMENOPAUSE CARE',
    category: 'Perimenopause Care',
    badge: '18 BOTANICAL ACTIVES',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    subtext: 'Hormonal Health • Deep Sleep • Hot Flashes Relief',
    reason: 'Because you tracked Hot Flashes & Poor Sleep',
    price: '₹799',
    origPrice: '₹999',
    discount: '20% OFF',
    rating: '4.9',
    reviews: 612,
    img: 'product_bliss.png',
    tabletColor: '#10B981',
    pillDesc: 'Green Herbal Botanical Tablet (30 Tablets)',
    ingredients: ['Magnesium Glycinate', 'Shatavari Extract', 'Lodhra Bark', 'KSM-66 Ashwagandha', 'Vitamin B6 Complex'],
    benefits: ['Cools night sweats and sudden hot flashes', 'Promotes deep restorative REM sleep', 'Stabilizes emotional mood swings', 'Eases menstrual discomfort'],
    description: 'A breakthrough full-spectrum perimenopause care formula with 18 botanical actives that gently balance fluctuating estrogen levels, relieve night sweats, and restore deep, uninterrupted sleep.'
  },
  mily: {
    id: 'mily',
    name: 'míror MILY',
    tagline: 'MOM, I LOVE YOU ~ WOMEN 65+',
    category: 'Senior Longevity 65+',
    badge: 'SUPER SUPPLEMENT',
    badgeColor: '#D97706',
    badgeBg: '#FFFBEB',
    subtext: 'Joint Pain • Memory & Energy • Bone & Muscle',
    reason: 'Targeted Longevity for Joint & Bone Health',
    price: '₹799',
    origPrice: '₹1,499',
    discount: '46% OFF',
    rating: '4.8',
    reviews: 350,
    img: 'product_mily.png',
    tabletColor: '#FBBF24',
    pillDesc: 'Gold Longevity Tablet (30 Tablets)',
    ingredients: ['Curcumin 95% Extract', 'Calcium Citrate Malate', 'Vitamin D3 & K2-7', 'Ginkgo Biloba', 'Boswellia Serrata'],
    benefits: ['Restores smooth joint flexibility and mobility', 'Enhances memory recall and mental sharpness', 'Strengthens bone density and muscle mass', 'Boosts natural daily stamina'],
    description: 'An advanced senior care formulation crafted specifically for mothers and women 65+. Delivers synergistic joint relief, cognitive sharpness, and skeletal support to live freely and comfortably.'
  },
  thrive: {
    id: 'thrive',
    name: 'míror THRIVE',
    tagline: 'MENOPAUSE CARE & BEYOND',
    category: 'Post-Menopause Care',
    badge: '28 POWER INGREDIENTS',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    subtext: 'Hormonal Therapy • Heart • Brain • Bone & Joint',
    reason: 'Because you tracked Mood Swings & Hormonal Shifts',
    price: '₹799',
    origPrice: '₹999',
    discount: '20% OFF',
    rating: '4.8',
    reviews: 518,
    img: 'product_thrive.png',
    tabletColor: '#3B82F6',
    pillDesc: 'Blue Menopause Tablet (30 Tablets)',
    ingredients: ['Pueraria Mirifica', 'Magnesium Bisglycinate', 'Bio-Calcium ++', 'B-Complex Vitamins', 'Marine Collagen Peptides'],
    benefits: ['Supports cardiovascular and brain wellness', 'Maintains optimal bone density post-menopause', 'Soothes nervous system and reduces anxiety', '15+ additional restorative benefits'],
    description: 'A comprehensive multi-nutrient therapy for post-menopausal women. Features 28 clinical actives to safeguard heart vitality, protect bone strength, and maintain vibrant cognitive sharpness.'
  }
};

SM.register('shop', () => {
  const showBack = AppState.screenStack.length > 1 && AppState.currentTab !== 'shop';
  const products = Object.values(MIROR_SHOP_CATALOG);

  return `
  ${topBar('Shop Miror Wellness', { back: showBack, roomy: true })}
  
  <div class="container" style="padding:16px 20px 88px;background:var(--miror-bg);">
    
    <!-- Category Filter Chips -->
    <div class="scroll-h" style="padding:0 0 16px;gap:8px;margin-bottom:4px;">
      <button class="chip active" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;">All Products (4)</button>
      <button class="chip" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;background:white;border:1px solid #E2E8F0;color:#64748B;">⚡ Energy & Gut</button>
      <button class="chip" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;background:white;border:1px solid #E2E8F0;color:#64748B;">🌸 Perimenopause</button>
      <button class="chip" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;background:white;border:1px solid #E2E8F0;color:#64748B;">👵 Senior 65+</button>
      <button class="chip" style="font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;background:white;border:1px solid #E2E8F0;color:#64748B;">💙 Menopause 45+</button>
    </div>

    <!-- Landscape Products List (Compact Spacing) -->
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${products.map(p => `
        <div class="card card-interactive" style="background:#FFFFFF;border-radius:18px;padding:10px 12px;border:1px solid #F1F5F9;box-shadow:0 4px 14px rgba(15,23,42,0.03);display:flex;gap:12px;align-items:center;position:relative;" data-action="push" data-screen="product-detail" data-product="${p.id}">
          
          <!-- Left: Product Image Container (Balanced Aspect & Alignment) -->
          <div style="width:100px;height:110px;background:radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F8FAFC 100%);border-radius:14px;border:1px solid #F1F5F9;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;flex-shrink:0;">
            
            <!-- Top-Left Discount Badge -->
            <span style="position:absolute;top:5px;left:5px;background:#DCFCE7;color:#15803D;font-size:9.5px;font-weight:600;padding:2px 5px;border-radius:5px;letter-spacing:0.2px;z-index:2;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
              ${p.discount}
            </span>

            <!-- Zoomed & Centered Product Image -->
            <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;transform:scale(1.2);transform-origin:center center;">
          </div>

          <!-- Right: Product Information & Compact Action -->
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;height:114px;padding:1px 0;">
            
            <!-- Row 1: Category Tag & Star Rating -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <span style="font-size:10px;font-weight:600;color:${p.badgeColor};text-transform:uppercase;letter-spacing:0.4px;">
                ${p.category}
              </span>
              <div style="display:flex;align-items:center;gap:2px;">
                <span style="color:#F59E0B;font-size:11px;">⭐</span>
                <span style="font-size:11.5px;font-weight:600;color:#0F172A;">${p.rating}</span>
              </div>
            </div>

            <!-- Row 2: Title & 2-Line Benefit Description -->
            <div>
              <h4 style="font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;color:#0F172A;margin:0 0 2px;letter-spacing:-0.3px;line-height:1.2;">
                ${p.name}
              </h4>
              <p style="font-size:11px;color:#64748B;margin:0;line-height:1.35;font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                ${p.subtext}
              </p>
            </div>

            <!-- Row 3: Price & Low-Profile CTA Row -->
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:baseline;gap:4px;">
                <span style="font-family:'Montserrat',sans-serif;font-size:16.5px;font-weight:600;color:#0F172A;">${p.price}</span>
                <span style="font-size:11.5px;color:#94A3B8;text-decoration:line-through;font-weight:500;">${p.origPrice}</span>
              </div>

              <!-- Compact Ultra-Sleek CTA Button -->
              <button onclick="event.stopPropagation();SM.toast('Added ${p.name} to Cart! 🛍️');" style="height:22px;min-height:22px;max-height:22px;line-height:22px;padding:0 10px;background:var(--miror-gradient);color:white;border:none;border-radius:11px;font-family:'Montserrat',sans-serif;font-size:10.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:3px;cursor:pointer;box-shadow:0 2px 6px rgba(236,93,170,0.22);transition:transform 0.15s ease;">
                <span style="font-size:11px;margin-top:-1px;">+</span>
                <span>Add</span>
              </button>
            </div>

          </div>

        </div>
      `).join('')}
    </div>

  </div>
  `;
});

SM.register('product-detail', (params) => {
  const pId = (params && params.product) || 'revive';
  const p = MIROR_SHOP_CATALOG[pId] || MIROR_SHOP_CATALOG.revive;

  return `
  ${topBar('Product Details', { back: true })}
  
  <div class="container" style="padding:0 0 96px;background:var(--miror-bg);">
    
    <!-- Hero Product Presentation Banner -->
    <div style="background:linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);padding:24px 20px 28px;text-align:center;border-bottom:1px solid #F1F5F9;position:relative;">
      
      <!-- Top Badge -->
      <div style="display:inline-flex;align-items:center;gap:6px;background:${p.badgeBg};color:${p.badgeColor};font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.6px;padding:4px 12px;border-radius:20px;margin-bottom:16px;">
        <span>✨</span> ${p.badge}
      </div>

      <!-- High-Res Product Image Container -->
      <div style="width:240px;height:240px;margin:0 auto 16px;background:#FFFFFF;border-radius:24px;border:1px solid #F1F5F9;box-shadow:0 12px 32px rgba(15,23,42,0.06);display:flex;align-items:center;justify-content:center;padding:12px;position:relative;">
        <img src="${p.img}" alt="${p.name}" style="max-width:100%;max-height:100%;object-fit:contain;">
      </div>

      <!-- Tablet Pill Indicator -->
      <div style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;padding:6px 14px;border-radius:20px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-size:12px;color:#334155;font-weight:600;">
        <span style="width:12px;height:12px;border-radius:50%;background:${p.tabletColor};display:inline-block;box-shadow:0 0 6px ${p.tabletColor};"></span>
        <span>${p.pillDesc}</span>
      </div>

    </div>

    <!-- Product Details Content -->
    <div style="padding:20px 20px 0;">
      
      <!-- Category & Rating -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:12px;font-weight:600;color:var(--miror-pink);text-transform:uppercase;letter-spacing:0.5px;">${p.category}</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="color:#F59E0B;font-size:13px;">⭐</span>
          <span style="font-size:13px;font-weight:600;color:#0F172A;">${p.rating}</span>
          <span style="font-size:12px;color:#94A3B8;font-weight:600;">(${p.reviews} verified reviews)</span>
        </div>
      </div>

      <!-- Main Title & Tagline -->
      <h1 style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:600;color:#0F172A;margin-bottom:4px;letter-spacing:-0.4px;">${p.name}</h1>
      <div style="font-size:13px;font-weight:600;color:#64748B;letter-spacing:0.3px;margin-bottom:14px;">${p.tagline}</div>

      <!-- Price Block -->
      <div class="card" style="background:#FFFFFF;border-radius:20px;padding:16px 18px;border:1px solid #F1F5F9;box-shadow:0 6px 20px rgba(15,23,42,0.03);margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:11.5px;color:#94A3B8;font-weight:600;margin-bottom:2px;">SPECIAL BUNDLE PRICE</div>
          <div style="display:flex;align-items:baseline;gap:8px;">
            <span style="font-family:'Montserrat',sans-serif;font-size:26px;font-weight:600;color:#0F172A;">${p.price}</span>
            <span style="font-size:15px;color:#94A3B8;text-decoration:line-through;font-weight:600;">${p.origPrice}</span>
            <span style="font-size:12px;font-weight:600;color:#16A34A;background:#DCFCE7;padding:3px 8px;border-radius:8px;">${p.discount}</span>
          </div>
        </div>
        <span class="tag" style="background:#FDF2F8;color:#EC5DAA;font-weight:600;font-size:11.5px;padding:6px 12px;border-radius:12px;">In Stock (Ships Today)</span>
      </div>

      <!-- Overview -->
      <div style="margin-bottom:20px;">
        <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin-bottom:8px;">Clinical Overview</h4>
        <p style="font-size:13.5px;color:#475569;line-height:1.55;margin:0;font-weight:400;">${p.description}</p>
      </div>

      <!-- Key Benefits -->
      <div style="margin-bottom:20px;">
        <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin-bottom:10px;">Targeted Health Benefits</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${p.benefits.map(b => `
            <div style="display:flex;align-items:center;gap:10px;background:#FFFFFF;padding:10px 14px;border-radius:14px;border:1px solid #F1F5F9;">
              <span style="width:20px;height:20px;border-radius:50%;background:#DCFCE7;color:#16A34A;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;">✓</span>
              <span style="font-size:13px;color:#1E293B;font-weight:600;">${b}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Key Ingredients Chips -->
      <div style="margin-bottom:24px;">
        <h4 style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#0F172A;margin-bottom:10px;">Active Botanical Ingredients</h4>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${p.ingredients.map(i => `
            <span class="chip" style="font-size:12.5px;padding:7px 14px;background:#FFFFFF;border:1px solid #E2E8F0;font-weight:600;color:#334155;border-radius:12px;">🌿 ${i}</span>
          `).join('')}
        </div>
      </div>

      <!-- How to Take -->
      <div class="card" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:20px;padding:16px 18px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:8px;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#166534;margin-bottom:4px;">
          <span>🥛</span> Recommended Daily Usage
        </div>
        <p style="font-size:12.5px;color:#15803D;line-height:1.45;margin:0;font-weight:500;">
          Take 1 tablet daily after breakfast or your first meal with water. For optimal cellular benefits, maintain consistent daily use for at least 60-90 days.
        </p>
      </div>

    </div>

    <!-- Sticky Bottom Bar -->
    <div style="position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:14px 20px 20px;border-top:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 -6px 24px rgba(0,0,0,0.06);z-index:90;">
      <div>
        <div style="font-size:11px;color:#94A3B8;font-weight:600;">TOTAL PRICE</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#0F172A;">${p.price}</div>
      </div>
      <button class="btn btn-primary" onclick="SM.toast('Added ${p.name} to Cart! 🛍️');" style="flex:1;height:50px;border-radius:25px;font-family:'Montserrat',sans-serif;font-size:15.5px;font-weight:600;background:var(--miror-gradient);box-shadow:0 6px 20px rgba(236,93,170,0.3);display:flex;align-items:center;justify-content:center;gap:8px;">
        <span>Add to Cart 🛒</span>
      </button>
    </div>

  </div>
`;
});

/* --------------------------------------------------------------------------
   REWARDS
   -------------------------------------------------------------------------- */
SM.register('achievements', () => `
  ${topBar('Achievements', { back: true })}
  <div class="container" style="padding:16px 20px;">
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${[
        { icon: '🌸', title: '7-Day Reflection', desc: 'Checked in for a full week', progress: 4, total: 7, earned: false },
        { icon: '🌿', title: 'Consistency', desc: 'Track 3 weeks in a row', progress: 1, total: 3, earned: false },
        { icon: '🧠', title: 'Understanding My Body', desc: 'Discover 5 correlations', progress: 3, total: 5, earned: false },
        { icon: '💪', title: 'Wellness Warrior', desc: 'Log wellness factors 14 days', progress: 10, total: 14, earned: false },
        { icon: '📊', title: 'Data Storyteller', desc: 'Generate your first report', progress: 0, total: 1, earned: false },
        { icon: '🌺', title: 'Bloom Master', desc: 'Complete 4 bloom journeys', progress: 1, total: 4, earned: false }
      ].map(a => `
        <div class="card ${a.earned ? '' : 'card-outline'}" style="padding:16px;${a.progress === a.total ? 'background:var(--miror-gradient-soft);' : ''}">
          <div style="display:flex;gap:14px;align-items:center;">
            <div style="width:48px;height:48px;border-radius:14px;background:${a.progress === a.total ? 'var(--miror-gradient)' : '#F3F4F6'};display:flex;align-items:center;justify-content:center;font-size:24px;${a.progress === a.total ? 'color:white;' : ''}">${a.progress === a.total ? '✓' : a.icon}</div>
            <div style="flex:1;">
              <div class="text-body" style="font-weight:600;">${a.title}</div>
              <div class="text-caption text-muted">${a.desc}</div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                <div class="progress-bar" style="flex:1;"><div class="progress-fill" style="width:${(a.progress/a.total)*100}%;"></div></div>
                <span class="text-caption text-muted">${a.progress}/${a.total}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`);

SM.register('bloom-journey', () => `
  ${topBar('Bloom Journey', { back: true })}
  <div class="container" style="padding:20px;text-align:center;">
    <div style="font-size:72px;margin-bottom:16px;animation:bloomPulse 3s ease infinite;">🌸</div>
    <h2 class="text-h1 gradient-text" style="margin-bottom:4px;">Day ${AppState.user.bloomDay} of 7</h2>
    <p class="text-body text-secondary" style="margin-bottom:32px;">${7 - AppState.user.bloomDay} more days to full bloom!</p>
    <div style="display:flex;flex-direction:column;gap:0;align-items:center;">
      ${[
        { day: 1, name: 'Seed planted', icon: '🌱' },
        { day: 2, name: 'First sprout', icon: '🌿' },
        { day: 3, name: 'Growing leaves', icon: '🍃' },
        { day: 4, name: 'Budding', icon: '🌷' },
        { day: 5, name: 'Blooming', icon: '🌼' },
        { day: 6, name: 'Full bloom', icon: '🌸' },
        { day: 7, name: 'Radiant flower', icon: '🌺' }
      ].map(s => {
        const done = s.day <= AppState.user.bloomDay;
        const current = s.day === AppState.user.bloomDay;
        return `
          <div style="display:flex;align-items:center;gap:16px;width:100%;max-width:280px;padding:12px 0;">
            <div style="width:44px;height:44px;border-radius:50%;${done ? 'background:var(--miror-gradient);' : 'background:#F3F4F6;'}${current ? 'animation:bloomPulse 2s ease infinite;box-shadow:0 0 0 4px rgba(255,107,157,0.2);' : ''}display:flex;align-items:center;justify-content:center;font-size:20px;">${done ? '✓' : s.icon}</div>
            <div style="text-align:left;flex:1;">
              <div class="text-body" style="font-weight:${done ? '600' : '400'};color:${done ? 'var(--miror-text-primary)' : 'var(--miror-text-muted)'};">Day ${s.day}: ${s.name}</div>
              ${done ? `<div class="text-caption" style="color:var(--miror-success);">+10 pts earned</div>` : ''}
            </div>
          </div>
          ${s.day < 7 ? `<div style="width:2px;height:20px;background:${done ? 'var(--miror-pink)' : '#E5E7EB'};margin-left:22px;"></div>` : ''}
        `;
      }).join('')}
    </div>
  </div>
`);

/* --------------------------------------------------------------------------
   SEARCH
   -------------------------------------------------------------------------- */
SM.register('search', () => `
  <div style="padding:16px 20px;">
    <div style="display:flex;align-items:center;gap:10px;background:white;border:1.5px solid var(--miror-border);border-radius:50px;padding:0 16px;height:48px;margin-bottom:20px;">
      <span style="color:var(--miror-text-muted);">🔍</span>
      <input type="text" placeholder="Search symptoms, articles, experts..." style="border:none;outline:none;flex:1;font-size:15px;background:transparent;" id="search-input">
    </div>

    <div class="text-label text-muted" style="margin-bottom:10px;">RECENT SEARCHES</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
      ${['Hot flashes','Sleep','Brain fog'].map(s => `<button class="chip" style="font-size:13px;">${s}</button>`).join('')}
    </div>

    <div class="text-label text-muted" style="margin-bottom:10px;">POPULAR</div>
    <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:24px;">
      ${[
        { icon: '🔥', text: 'Hot flashes management' },
        { icon: '😴', text: 'Better sleep during menopause' },
        { icon: '🧠', text: 'Brain fog remedies' },
        { icon: '💪', text: 'Exercise for menopause' },
        { icon: '🥗', text: 'Best supplements for perimenopause' }
      ].map(p => `
        <button class="card-interactive" data-action="push" data-screen="search-results" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;width:100%;background:none;border:none;cursor:pointer;">
          <span style="font-size:18px;">${p.icon}</span>
          <span class="text-body" style="flex:1;text-align:left;">${p.text}</span>
          <span style="color:var(--miror-text-muted);font-size:14px;">›</span>
        </button>
      `).join('')}
    </div>

    <div class="text-label text-muted" style="margin-bottom:10px;">BROWSE BY</div>
    <div style="display:flex;gap:8px;">
      ${['Symptoms','Articles','Communities','Experts'].map(c => `<button class="chip" style="font-size:12px;">${c}</button>`).join('')}
    </div>
  </div>
`);

SM.register('search-results', () => `
  ${topBar('Search', { back: true })}
  <div style="padding:8px 20px 16px;">
    <div style="display:flex;align-items:center;gap:10px;background:white;border:1.5px solid var(--miror-pink);border-radius:50px;padding:0 16px;height:44px;box-shadow:0 0 0 3px rgba(255,107,157,0.1);">
      <span>🔍</span>
      <span class="text-body">hot flashes</span>
    </div>
  </div>
  <div class="container" style="padding:0 20px;">
    ${[
      { cat: 'Symptoms', items: [{ icon: '🌡️', text: 'Hot flashes' }, { icon: '💦', text: 'Night sweats' }] },
      { cat: 'Articles', items: [{ icon: '📖', text: 'Managing hot flashes naturally' }, { icon: '📖', text: 'Cooling strategies that work' }] },
      { cat: 'Communities', items: [{ icon: '👥', text: 'Hot Flash Support Circle' }] },
      { cat: 'Experts', items: [{ icon: '👩‍⚕️', text: 'Dr. Sarah Mitchell — Menopause Specialist' }] }
    ].map(g => `
      <div class="text-label text-muted" style="margin-bottom:8px;margin-top:16px;">${g.cat.toUpperCase()}</div>
      ${g.items.map(i => `
        <div class="card card-outline card-interactive" style="padding:12px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:20px;">${i.icon}</span>
          <span class="text-body" style="flex:1;">${i.text}</span>
          <span style="color:var(--miror-text-muted);">›</span>
        </div>
      `).join('')}
    `).join('')}
  </div>
`);

/* --------------------------------------------------------------------------
   ERROR / OFFLINE
   -------------------------------------------------------------------------- */
SM.register('error-offline', () => `
  <div class="container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;text-align:center;padding:40px 32px;">
    <div style="font-size:56px;margin-bottom:20px;">📡</div>
    <h2 class="text-h1" style="margin-bottom:8px;">No connection</h2>
    <p class="text-body text-secondary" style="margin-bottom:32px;max-width:260px;">We'll save your data and sync when you're back online.</p>
    <button class="btn btn-secondary w-full" style="margin-bottom:12px;max-width:260px;">Try Again</button>
    <button class="btn btn-ghost" style="max-width:260px;">Continue Offline</button>
  </div>
`);

SM.register('notifications', () => `
  ${topBar('Notifications', { back: true })}
  <div class="container" style="padding:20px;">
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${[
        { icon: '🌸', title: 'Daily Check-in Reminder', desc: 'Time for your evening wellness check-in', time: '10 mins ago', unread: true },
        { icon: '💡', title: 'New Insight Available', desc: 'Your weekly symptom pattern summary is ready', time: '2 hours ago', unread: true },
        { icon: '👩‍⚕️', title: 'Doctor Consultation Confirmed', desc: 'Appointment with Dr. Ananya Sharma on Aug 8', time: '1 day ago', unread: false },
        { icon: '💬', title: 'Community Reply', desc: 'Sarah replied to your post in Menopause Journey', time: '2 days ago', unread: false }
      ].map(n => `
        <div class="card card-outline float-item" style="padding:16px;background:${n.unread ? 'var(--miror-pink-lighter)' : 'white'};border-color:${n.unread ? 'var(--miror-pink-light)' : 'var(--miror-border)'};">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <span style="font-size:22px;">${n.icon}</span>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="text-body" style="font-weight:600;font-size:14.5px;">${n.title}</span>
                <span class="text-caption text-muted" style="font-size:10px;">${n.time}</span>
              </div>
              <p class="text-caption text-secondary" style="line-height:1.4;">${n.desc}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`);

SM.register('article-sleep-detail', () => `
  ${topBar('Article', { back: true })}
  <div class="container" style="padding-bottom:40px;">
    <div style="width:100%;height:220px;overflow:hidden;background:#F1F5F9;position:relative;">
      <img src="article_sleep_cat.png" alt="Sleep problems in Menopause" style="width:100%;height:100%;object-fit:cover;display:block;">
    </div>
    <div style="padding:20px 20px 0;">
      <h1 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:600;color:#0F172A;line-height:1.35;margin-bottom:12px;">Sleep problems in Menopause Explained: 5 surprising reasons you wake up at 3 AM</h1>
      
      <div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-top:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;margin-bottom:20px;">
        <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#EC4899,#7A3FD1);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px;">EV</div>
        <div>
          <div style="font-weight:600;font-size:14px;color:#0F172A;">Dr. Elena Vance</div>
          <div style="font-size:12px;color:#64748B;">Board Certified Endocrinologist • 4 min read</div>
        </div>
      </div>

      <div style="font-size:15px;line-height:1.7;color:#334155;">
        <p style="margin-bottom:16px;">Waking up abruptly at 3:00 AM drenched in sweat or with your heart racing is one of the most frustrating and common symptoms of perimenopause and menopause. You are not alone—over <strong>61% of women</strong> experience disrupted sleep patterns during this hormonal transition.</p>

        <h3 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:20px 0 8px;">1. The 3 AM Cortisol Surge</h3>
        <p style="margin-bottom:16px;">As estrogen levels decline, the body’s sensitivity to cortisol (the primary stress hormone) increases. Around 3 AM, your natural circadian cortisol rhythm begins its ascent. When estrogen is lower, this natural shift can trigger a sudden alertness adrenaline spike, waking you instantly.</p>

        <h3 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:20px 0 8px;">2. Thermoregulatory Hypothalamus Reset</h3>
        <p style="margin-bottom:16px;">Estrogen plays a key role in regulating your brain’s internal thermostat—the hypothalamus. A sudden drop in nighttime core temperature triggers a vasomotor response (hot flash or night sweat), jarring you awake before you even feel warm.</p>

        <h3 style="font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;color:#0F172A;margin:20px 0 8px;">3. Progesterone & GABA Decline</h3>
        <p style="margin-bottom:16px;">Progesterone stimulates GABA receptors in the brain, which acts as nature's natural calming agent. Reduced progesterone levels lead to lighter sleep phases (REM fragmentation) and fewer hours of deep restorative slow-wave sleep.</p>

        <div class="card" style="background:#FAF5FF;border:1px solid #E9D5FF;border-radius:16px;padding:16px;margin:24px 0;">
          <div style="font-weight:600;color:#7A3FD1;margin-bottom:6px;font-size:14px;">💡 Doctor's Tip for Tonight:</div>
          <p style="font-size:13.5px;color:#4C1D95;margin:0;line-height:1.5;">Keep your bedroom temperature between 18°C–20°C (65°F–68°F), avoid refined carbs after 7 PM, and try 200mg Magnesium Glycinate 45 minutes before sleep.</p>
        </div>
      </div>
    </div>
  </div>
`);

/* --- Reminders Screen Registration --- */
SM.register('reminders', () => {
  return `
    <div class="screen-content" style="padding-bottom: 120px; background: #FAF5FF; min-height: 100vh;">
      
      <!-- Top Sticky Header -->
      <div class="home-header-sticky screen-fixed-header" style="background: #FFFFFF; border-bottom: 1px solid #F1F5F9; padding: 14px 20px;">
        <div>
          <h1 style="font-family: 'Montserrat', sans-serif; font-size: 19px; font-weight: 700; color: #0F172A; margin: 0 0 2px;">
            Reminders & Routines 🔔
          </h1>
          <div style="font-size: 12px; color: #64748B; font-weight: 500;">
            Stay on track with daily health habits & supplements
          </div>
        </div>
      </div>

      <div style="padding-top: 14px;">
        ${window.renderRemindersCard()}
      </div>
    </div>
  `;
});

