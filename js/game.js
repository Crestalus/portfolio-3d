/*
 * STATUS: INCOMPLETE — extraction note (not part of the original generated code)
 * This file was cut off mid-generation. The outer (function(){ ... immediately
 * above is never closed, and the Three.js scene/camera/render-loop code that
 * was supposed to follow (originally planned as game_b.js / game_c.js) was
 * never written. See PLANNING.md in the project root for the full plan.
 * Everything below this comment, down to the end of the file, is the verbatim
 * content that was generated: content data (zones/quests/achievements),
 * app state, XP/leveling, audio toggle, confetti, and modal rendering
 * (quest log, achievements, help, full-clear).
 */
(function(){
'use strict';
var $ = function(s){ return document.querySelector(s); };
var TAU = Math.PI*2;
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

/* ==================== ICONS ==================== */
var ICONS = {
  nexus:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5 19.5c1.6-3.5 4-4.8 7-4.8s5.4 1.3 7 4.8"/></svg>',
  lab:'<svg viewBox="0 0 24 24"><path d="M9.5 3h5M10 3v5.2L4.8 17.6A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.8-3.4L14 8.2V3"/><path d="M7.6 14.5h8.8"/></svg>',
  arena:'<svg viewBox="0 0 24 24"><path d="M4 4l10.5 10.5M4 4h3.2M4 4v3.2"/><path d="M20 4L9.5 14.5M20 4h-3.2M20 4v3.2"/><path d="M7 14l3 3-3.5 3.5L3 17z"/><path d="M17 14l-3 3 3.5 3.5L21 17z"/></svg>',
  stage:'<svg viewBox="0 0 24 24"><path d="M9 18.5V5l10-2v12.5"/><circle cx="6.4" cy="18.5" r="2.6"/><circle cx="16.4" cy="15.5" r="2.6"/></svg>',
  guild:'<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="2.8"/><path d="M3.5 19c1.2-2.8 3.2-4 5.5-4s4.3 1.2 5.5 4"/><circle cx="16.7" cy="8" r="2.2"/><path d="M15.6 14.6c2 .3 3.7 1.5 4.8 3.9"/></svg>',
  academy:'<svg viewBox="0 0 24 24"><path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.8V16c0 1.5 2.5 2.9 5.5 2.9s5.5-1.4 5.5-2.9v-4.2"/><path d="M21.5 9.5v5.5"/></svg>',
  vault:'<svg viewBox="0 0 24 24"><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 5.5H4.7c0 2.8 1.3 4.3 2.9 4.8M16.5 5.5h2.8c0 2.8-1.3 4.3-2.9 4.8"/><path d="M12 13.5v3M8.7 20.5h6.6M10 17.5h4"/></svg>'
};

/* ==================== CONTENT ==================== */
function quest(o){
  var tags = '';
  (o.tags||[]).forEach(function(t){ tags += '<span class="tag '+t[1]+'">'+t[0]+'</span>'; });
  var loot = '';
  if(o.loot){ loot = '<div class="loot"><em>LOOT</em>'+o.loot.map(function(c){return '<span class="chip">'+c+'</span>';}).join('')+'</div>'; }
  return '<div class="card" style="--d:'+(o.d||0)+'s">'
    + (tags?'<div class="c-tags">'+tags+'</div>':'')
    + (o.title?'<div class="c-title">'+o.title+'</div>':'')
    + (o.org?'<div class="c-org">'+o.org+'</div>':'')
    + (o.date?'<div class="c-date">'+o.date+'</div>':'')
    + '<div class="c-body">'+o.body+'</div>'
    + loot + '</div>';
}

var ZONES = {
  nexus:{ name:'THE NEXUS', sub:'PLAYER PROFILE', color:'#cdd8ff', tag:'EVERY RUN STARTS HERE', dock:'NEXUS', obj:'Inspect the player profile' },
  lab:{ name:'THE LAB', sub:'RESEARCH & ENGINEERING', color:'#22d3ee', tag:'WHERE HYPOTHESES BECOME HARDWARE', dock:'LAB', obj:'Survey the research facilities' },
  arena:{ name:'THE ARENA', sub:'COMPETITION MATHEMATICS', color:'#fb7185', tag:'BOSS FIGHTS, BUT MAKE THEM THEOREMS', dock:'ARENA', obj:'Review the tournament record' },
  stage:{ name:'THE STAGE', sub:'MUSIC & PERFORMANCE', color:'#a78bfa', tag:'A MAX-CHARISMA BUILD', dock:'STAGE', obj:'Visit the concert hall' },
  guild:{ name:'THE GUILD', sub:"FOUNDER'S HALL", color:'#34d399', tag:'CO-OP MODE: COMMUNITIES', dock:'GUILD', obj:'Enter the founder hall' },
  academy:{ name:'THE ACADEMY', sub:'EDUCATION ROUTE', color:'#60a5fa', tag:'THE MAIN STORYLINE', dock:'ACADEMY', obj:'Trace the education route' },
  vault:{ name:'THE VAULT', sub:'HONORS & ARTIFACTS', color:'#fbbf24', tag:'LEGENDARY DROPS ONLY', dock:'VAULT', obj:'Unseal the honors vault' }
};
var ORDER = ['lab','arena','stage','guild','academy','vault'];
var ALL = ['nexus'].concat(ORDER);

ZONES.lab.body = function(){ return [
  quest({tags:[['MAIN QUEST','main'],['ACTIVE','live']], title:'MACHINE MINDS',
    org:'Nanyang Technological University — Student Researcher', date:'APR 2026 → PRESENT • SINGAPORE', d:0,
    body:'Researching how <b>machine learning and AI systems</b> can power robotics in real-world use cases — teaching machines to sense, decide and act outside the lab.',
    loot:['Machine Learning','Robotics','Academic Research']}),
  quest({tags:[['SIDE QUEST','main'],['CLEARED','done']], title:'THE CRYSTAL FORGE',
    org:'Chiang Mai University — Laboratory Assistant', date:'JAN 2026 – FEB 2026 • CHIANG MAI, THAILAND', d:.07,
    body:'<ul><li>Synthesized <b>lanthanide-based Metal–Organic Frameworks</b> with Nd and Eu nodes; verified crystal structures via <b>single-crystal X-ray diffraction</b>.</li><li>Turned <b>water hyacinth</b> — an invasive species harvested from Ang Kaew Reservoir — into a fibrous, paper-like substrate hosting MOFs for <b>water trace detection</b>.</li><li>Ran solvent stability testing across substrate materials; kept rigorous experimental records and analyzed structural data.</li></ul>',
    loot:['Materials Chemistry','XRD Analysis','Sustainability']}),
  quest({tags:[['SIDE QUEST','main'],['CLEARED','done']], title:'FORGE PROTOCOL +117%',
    org:'CNCTech Industrial (CIS) — Computer Aided Design Engineer', date:'NOV 2025 – DEC 2025 • PHU THO, VIETNAM', d:.14,
    body:'<ul><li>Proposed a <b>torque-optimization</b> tweak to a metalworking process that raised production efficiency by <b>117%</b>.</li><li>Operated CNC machines with precision measuring tools for quality control.</li><li>Modeled 2D/3D parts in <b>AutoCAD &amp; Siemens NX</b>, supporting a successful plastic mould for a motorbike part.</li></ul>',
    loot:['AutoCAD','Siemens NX','CNC Machining']})
].join(''); };

ZONES.arena.body = function(){
  var data = [
    ['TrinMac NYC Spring 2025','1ST PLACE TEAM · PERFECT SCORE','leg',true],
    ['Singapore Math Global Finals 2025','GOLD','goldm',false],
    ['World Mathematics Invitational 2025','SILVER','silverm',false],
    ['SASMO 2025 · 2024','GOLD · SILVER','goldm',false],
    ['Singapore Math Kangaroo 2024 · 2025','GOLD ×2','goldm',false],
    ['Australian Intermediate Mathematical Olympiad','DISTINCTION','epic',false],
    ['Australian Mathematics Competition','HIGH DISTINCTION','epic',false]
  ];
  var rows = data.map(function(r){
    return '<div class="mrow'+(r[3]?' legend':'')+'"><span class="mn">'+r[0]+'</span><span class="tag '+r[2]+'">'+r[1]+'</span></div>';
  }).join('');
  return quest({tags:[['MAIN QUEST','main'],['CLEARED','done']], title:'GUILDMASTER OF PROOFS',
      org:'Math Competition Team, ACS(I) — Executive Committee', date:'AUG 2024 – AUG 2025 • SINGAPORE', d:0,
      body:'Represented the school across national and international arenas, and <b>curated &amp; vetted rigorous problems</b> for the school&rsquo;s annual Math Challenge — guarding academic standards and logical depth.',
      loot:['Problem Setting','Proof Writing','Team Strategy']})
    + '<div class="card" style="--d:.08s"><div class="c-tags"><span class="tag main">BOSS FIGHTS CLEARED</span></div><div class="medals">'+rows+'</div></div>';
};

ZONES.stage.body = function(){ return [
  quest({tags:[['MAIN QUEST','main'],['CLEARED','done']], title:'THE CONDUCTOR&rsquo;S GAMBIT',
    org:'Choir, ACS(I) — Club President', date:'SEP 2024 – SEP 2025 • SINGAPORE', d:0,
    body:'<ul><li>Led the choir to <b>Distinction</b> — the competition&rsquo;s highest accolade — at the <b>Singapore Youth Festival</b>, among <b>112 competing choirs</b>.</li><li>Drove advertising for the Festival of Arts concert: <b>~500 tickets sold</b> and <b>$7,500 in revenue</b>.</li><li>Produced <b>3 promotional videos</b> screened at school assemblies, setting a new bar for club production quality; designed posters and boarding-community outreach.</li><li>Planned and ran <b>3 themed bonding camps</b> — custom lore, props, water games and night games.</li><li>Grew recruitment to <b>50+ members</b>, the club&rsquo;s strongest roster in recent years.</li></ul>',
    loot:['Leadership','Stagecraft','Video Production','Event Ops']})
].join(''); };

ZONES.guild.body = function(){ return [
  quest({tags:[['MAIN QUEST','main'],['ACTIVE','live']], title:'SIGMA ACADEMY',
    org:'Founder &amp; Executive Director — Non-profit', date:'NOV 2024 → PRESENT • SINGAPORE + VIETNAM', d:0,
    body:'<ul><li>Founded a non-profit <b>democratizing competitive mathematics</b> for underprivileged children and passionate students — backed by ACS(I)&rsquo;s Math Competition Team.</li><li>Partnered with <b>Muhammadiyah Welfare Home</b> to deliver local educational support in Singapore.</li><li>Scaled to <b>24 active members across 3 countries</b>; opened a Vietnam branch running weekly classes for <b>20 students</b>.</li><li>Authored an independent <b>mathematics book + curriculum in LaTeX</b>, aligned with the Singapore Mathematical Junior Olympiad and MOE G3 — published free online and continuously updated from student feedback.</li></ul>',
    loot:['EdTech','Curriculum Design','Org Building']}),
  quest({tags:[['SIDE QUEST','main'],['ACTIVE','live']], title:'SEIA: NEW VENTURE UNLOCKED',
    org:'Founder, Student Entrepreneurship &amp; Innovation Association — Vinschool', date:'NOV 2025 → PRESENT • HANOI (REMOTE)', d:.07,
    body:'<ul><li>Founded and launched SEIA to seed a culture of <b>innovation and business strategy</b> across the student body.</li><li>Managed the organization&rsquo;s <b>budget and resource allocation</b>, keeping every initiative funded and operationally lean; now provides remote strategic oversight and curated training resources.</li><li>Supported the core team to a <b>Regional Round Victory</b> and qualification for the <b>National Finals in Ho Chi Minh City</b>.</li></ul>',
    loot:['Entrepreneurship','Strategy','Mentorship']}),
  quest({tags:[['SIDE QUEST','main'],['CLEARED','done']], title:'TIDECALLER',
    org:'Aqualium Project, People&rsquo;s Association — Student Volunteer', date:'JAN 2024 – DEC 2025 • SINGAPORE', d:.14,
    body:'Two years of <b>beach cleanups</b> across Singapore&rsquo;s coasts — East Coast Park, Pulau Ubin and Tanah Merah — defending the shoreline one sweep at a time.',
    loot:['Environment','Community Service']})
].join(''); };

ZONES.academy.body = function(){ return [
  quest({tags:[['ACT III','main'],['IN PROGRESS','live']], title:'VICTORIA JUNIOR COLLEGE',
    org:'Singapore-Cambridge GCE A-Level', date:'JAN 2026 – DEC 2027 • SINGAPORE', d:0,
    body:'Current save point. Studying on the A-Level track as an <b>MOE ASEAN Pre-University Scholar</b>.'}),
  quest({tags:[['ACT II','main'],['CLEARED','done']], title:'ANGLO-CHINESE SCHOOL (INDEPENDENT)',
    org:'GCE O-Level Programme', date:'NOV 2023 – NOV 2025 • SINGAPORE', d:.07,
    body:'Placed <b>1st in the Year 3 Express cohort</b> across all subjects, and <b>top scorer in Physics and Advanced Mathematics</b>.'}),
  quest({tags:[['ACT I','main'],['CLEARED','done']], title:'HANOI-AMSTERDAM HIGH SCHOOL FOR THE GIFTED',
    org:'Cambridge IGCSE Diploma', date:'SEP 2020 – NOV 2023 • HANOI, VIETNAM', d:.14,
    body:'Origin story — where the mathematics obsession first leveled up.'})
].join(''); };

ZONES.vault.body = function(){ return [
  quest({tags:[['LEGENDARY','leg']], title:'ASEAN SCHOLARSHIP (SINGAPORE)',
    org:'Singapore Ministry of Education', date:'AWARDED NOV 2023', d:0,
    body:'<b>Full-ride scholarship</b> covering full tuition, boarding expenses and quarterly allowances for Upper Secondary and Junior College studies in Singapore.'}),
  quest({tags:[['EPIC','epic']], title:'1ST IN YEAR 3 EXPRESS COHORT',
    org:'Anglo-Chinese School (Independent)', date:'JAN 2025', d:.07,
    body:'Ranked <b>1st across all subjects</b> in the Class of 2025 cohort; <b>top scorer in Physics and Advanced Mathematics</b>.'}),
  quest({tags:[['EPIC','epic']], title:'HARVARD VENTURE-TECH SUMMER PROGRAM',
    org:'Technology &amp; Entrepreneurship Center at Harvard', date:'FEB 2025', d:.14,
    body:'Accepted to the international summer program with a <b>US$2,000 scholarship grant</b>.'}),
  quest({tags:[['RARE','rare']], title:'INTRO TO DEEP LEARNING WITH PYTORCH',
    org:'DataCamp — Certification', date:'ISSUED MAR 2026', d:.21,
    body:'Certified in deep-learning fundamentals and PyTorch. <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/5c105407cba847847f2bd8d969dc4ed8b26d84bd" target="_blank" rel="noopener">View credential ↗</a>'})
].join(''); };

ZONES.nexus.body = function(){
  var stats = [['INTELLECT',96],['LEADERSHIP',93],['RESEARCH',90],['IMPACT',92],['CREATIVITY',88],['HARMONY',86]];
  var sHtml = stats.map(function(s){
    return '<div class="stat"><div class="srow"><span>'+s[0]+'</span><b>'+s[1]+'</b></div><div class="strack"><div class="sfill" data-w="'+s[1]+'"></div></div></div>';
  }).join('');
  var inv = ['Machine Learning','PyTorch','Python','Academic Research','Educational Outreach','AutoCAD','Siemens NX','LaTeX','Strategy & Ops','Choral Music']
    .map(function(c){return '<span class="chip">'+c+'</span>';}).join('');
  return '<div class="card" style="--d:0s">'
    + '<div class="prof-top"><div class="prof-av">Q</div><div><div class="prof-n">LE VIET QUANG</div><div class="prof-r">MOE ASEAN PRE-UNIVERSITY SCHOLAR</div></div></div>'
    + '<dl class="kv" style="margin-top:14px">'
    + '<dt>CLASS</dt><dd>Aspiring Sustainability Engineer</dd>'
    + '<dt>SPEC</dt><dd>Mathematics × Machine Learning / AI</dd>'
    + '<dt>ORIGIN</dt><dd>Hanoi, Vietnam → Singapore</dd>'
    + '<dt>GUILD</dt><dd>Victoria Junior College</dd>'
    + '</dl></div>'
    + '<div class="card" style="--d:.07s"><div class="c-tags"><span class="tag main">LORE</span></div>'
    + '<div class="c-body">Aspiring sustainability engineer running a <b>mathematics core build</b> with heavy investment in the <b>ML / AI skill tree</b>. Committed musician and leader, on a long-running quest to leave every community better than he found it.</div></div>'
    + '<div class="card" style="--d:.14s"><div class="c-tags"><span class="tag main">BASE STATS</span></div>'+sHtml+'</div>'
    + '<div class="card" style="--d:.21s"><div class="c-tags"><span class="tag main">INVENTORY</span></div><div class="loot" style="margin-top:0;padding-top:0;border:0">'+inv+'</div></div>'
    + '<div class="card" style="--d:.28s"><div class="c-tags"><span class="tag main">OPEN A PARTY INVITE</span></div>'
    + '<div class="contact"><a class="cbtn" href="mailto:lvietquang11@gmail.com">✉ &nbsp;EMAIL</a><a class="cbtn alt" href="https://www.linkedin.com/in/quang-le-54239b1bb" target="_blank" rel="noopener">LINKEDIN ↗</a></div>'
    + '<div class="c-date" style="margin:10px 0 0">PREFER THE FORMAL VERSION? IT LIVES ON LINKEDIN.</div></div>';
};

/* ==================== ACHIEVEMENTS / STATE ==================== */
var ACHS = {
  boot:{n:'BOOT SEQUENCE', d:'Press start.', xp:10},
  first:{n:'FIRST CONTACT', d:'Discover your first zone.', xp:25},
  soul:{n:'KNOW THYSELF', d:'Open the Nexus profile.', xp:25},
  carto:{n:'CARTOGRAPHER', d:'Discover all six islands.', xp:50},
  orbs:{n:'TREASURE HUNTER', d:'Collect all 8 energy orbs.', xp:50},
  full:{n:'FULL CLEAR', d:'Reach 100% world completion.', xp:100},
  konami:{n:'DEV MODE', d:'↑ ↑ ↓ ↓ ← → ← → B A', xp:30, secret:true}
};
var ACH_ORDER = ['boot','first','soul','carto','orbs','full','konami'];

var S = {
  started:false, xp:0, level:1, visited:{}, nVisited:0,
  orbs:0, ach:{}, nAch:0, sound:true, current:null,
  playSec:0, full:false, evolved:false, modal:null, idle:0
};
var TITLES = ['NOVICE','WANDERER','APPRENTICE','SCHOLAR','STRATEGIST','MAESTRO','VANGUARD','POLYMATH'];
var TOTAL_ORBS = 8;
function needFor(l){ return 80 + (l-1)*60; }

/* ==================== AUDIO ==================== */
var AC = null;
function audio(){
  if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(f, dur, type, vol, slide, delay){
  if(!S.sound) return; var ctx = audio(); if(!ctx) return;
  var t0 = ctx.currentTime + (delay||0);
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type||'sine'; o.frequency.setValueAtTime(f, t0);
  if(slide) o.frequency.exponentialRampToValueAtTime(slide, t0+dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol||0.07, t0+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0+dur+0.02);
}
var sfx = {
  click:function(){ tone(300,.07,'square',.04); },
  open:function(){ tone(420,.1,'sine',.06,640); },
  close:function(){ tone(520,.1,'sine',.05,330); },
  collect:function(){ tone(620,.12,'sine',.08,1100); tone(930,.16,'sine',.05,1400,.06); },
  xp:function(){ tone(880,.09,'triangle',.05); },
  ach:function(){ tone(660,.12,'triangle',.07); tone(990,.18,'triangle',.07,null,.1); },
  level:function(){ [523,659,784,1047].forEach(function(f,i){ tone(f,.16,'triangle',.075,null,i*0.09); }); },
  start:function(){ tone(220,.25,'sawtooth',.04,440); tone(440,.3,'triangle',.06,880,.12); }
};

/* ==================== TOASTS / CONFETTI ==================== */
function toast(html, cls, life){
  var box = $('#toasts');
  var el = document.createElement('div');
  el.className = 'toast ' + (cls||'');
  el.innerHTML = html;
  box.appendChild(el);
  while(box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ el.remove(); }, 420); }, life||2600);
}
var CF_COLORS = ['#22d3ee','#a78bfa','#fb7185','#34d399','#fbbf24','#60a5fa'];
function confetti(n){
  var num = n||30;
  if(RM) num = Math.min(num, 8);
  var layer = $('#confetti');
  for(var i=0;i<num;i++){
    var c = document.createElement('span');
    c.className = 'cf';
    c.style.left = (Math.random()*100)+'vw';
    c.style.background = CF_COLORS[(Math.random()*CF_COLORS.length)|0];
    c.style.setProperty('--rz', (360+Math.random()*720)+'deg');
    c.style.animationDuration = (1.8+Math.random()*1.6)+'s';
    c.style.animationDelay = (Math.random()*0.4)+'s';
    c.style.width = (5+Math.random()*6)+'px';
    c.style.height = (8+Math.random()*8)+'px';
    layer.appendChild(c);
    (function(el){ setTimeout(function(){ el.remove(); }, 4400); })(c);
  }
}

/* ==================== XP / LEVELS / ACHIEVEMENTS ==================== */
function levelFromXP(xp){
  var l = 1, acc = 0;
  while(l < TITLES.length && xp >= acc + needFor(l)){ acc += needFor(l); l++; }
  return {level:l, into:xp-acc, need: l<TITLES.length ? needFor(l) : 0};
}
function pct(){
  return Math.round((S.nVisited/ALL.length)*70 + (S.orbs/TOTAL_ORBS)*30);
}
function updateHUD(){
  var L = levelFromXP(S.xp);
  $('#pLv').textContent = 'LV '+L.level;
  $('#pTitle').textContent = S.evolved ? 'POLYMATH' : TITLES[Math.min(L.level,TITLES.length)-1];
  var fp = L.need ? Math.round(L.into/L.need*100) : 100;
  $('#pXpFill').style.width = fp+'%';
  $('#pXpText').textContent = L.need ? (L.into+' / '+L.need+' XP') : 'MAX LEVEL';
  $('#pPct').textContent = 'WORLD '+pct()+'%';
  $('#achBub').textContent = S.nAch;
}
function addXP(n, label){
  S.xp += n;
  if(label) toast(label+' <b>+'+n+' XP</b>','xp');
  var L = levelFromXP(S.xp);
  if(L.level > S.level){
    S.level = L.level;
    sfx.level();
    var t = S.evolved ? 'POLYMATH' : TITLES[S.level-1];
    toast('▲ LEVEL UP — <b>LV '+S.level+' '+t+'</b>','lvl',3200);
    confetti(26);
    var lv = $('#pLv'); lv.classList.remove('pop'); void lv.offsetWidth; lv.classList.add('pop');
  } else if(!label){ sfx.xp(); }
  updateHUD();
}
function unlock(id){
  if(S.ach[id]) return;
  S.ach[id] = true; S.nAch++;
  var a = ACHS[id];
  sfx.ach();
  toast('★ ACHIEVEMENT — <b>'+a.n+'</b>','ach',3000);
  addXP(a.xp);
}
function checkFull(){
  if(S.full) return;
  if(S.nVisited === ALL.length && S.orbs === TOTAL_ORBS){
    S.full = true;
    S.evolved = true;
    unlock('full');
    toast('◈ CLASS EVOLVED → <b>POLYMATH</b>','lvl',3600);
    sfx.level();
    confetti(70);
    updateHUD();
    setTimeout(openComplete, 1100);
  }
}

/* ==================== MODALS ==================== */
var mback = $('#mback');
function openModal(title, html, fest){
  S.modal = title;
  $('#mTitle').textContent = title;
  $('#mBody').innerHTML = html;
  $('#mcard').classList.toggle('fest', !!fest);
  mback.classList.add('on');
  sfx.open();
}
function closeModal(){
  if(!S.modal) return;
  S.modal = null;
  mback.classList.remove('on');
  sfx.close();
}
function fmtTime(s){ var m=(s/60)|0, ss=s%60; return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss; }
function openQuests(){
  var rows = ALL.map(function(id){
    var z = ZONES[id], done = !!S.visited[id];
    return '<div class="qrow'+(done?' done':'')+'" style="--zc:'+z.color+'">'
      +'<div class="qic">'+ICONS[id]+'</div>'
      +'<div class="qt"><div class="qn">'+z.name+'</div><div class="qd">'+z.obj.toUpperCase()+'</div></div>'
      +'<div class="qs">'+(done?'CLEARED':'OPEN')+'</div></div>';
  }).join('');
  var prog = '<div class="mprog">'
    +'<div class="mpr"><span>WORLD COMPLETION</span><span>'+pct()+'%</span></div>'
    +'<div class="xpwrap"><div class="xpfill" style="width:'+pct()+'%"></div></div>'
    +'<div class="mpr"><span>ENERGY ORBS</span><span>'+S.orbs+' / '+TOTAL_ORBS+'</span></div>'
    +'<div class="mpr"><span>PLAYTIME</span><span>'+fmtTime(S.playSec)+'</span></div>'
    +'</div>';
  openModal('QUEST LOG', prog+rows);
}
function openAch(){
  var rows = ACH_ORDER.map(function(id){
    var a = ACHS[id], un = !!S.ach[id];
    var name = (un || !a.secret) ? a.n : '???';
    var desc = un ? a.d : (a.secret ? 'HIDDEN ACHIEVEMENT' : a.d);
    return '<div class="qrow '+(un?'aun':'locked')+'" style="--zc:#fbbf24">'
      +'<div class="qic"><svg viewBox="0 0 24 24"><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z"/><path d="M12 13.5v3M8.7 20.5h6.6"/></svg></div>'
      +'<div class="qt"><div class="qn">'+name+'</div><div class="qd">'+desc.toUpperCase()+'</div></div>'
      +'<div class="qs">'+(un?('+'+a.xp+' XP'):'LOCKED')+'</div></div>';
  }).join('');
  openModal('ACHIEVEMENTS — '+S.nAch+' / '+ACH_ORDER.length, rows);
}
function openHelp(){
  var h = '<div class="helpRow"><code>DRAG</code><span>Orbit the archipelago</span></div>'
    +'<div class="helpRow"><code>SCROLL / PINCH</code><span>Zoom in and out</span></div>'
    +'<div class="helpRow"><code>CLICK ISLAND</code><span>Open that zone&rsquo;s quest file</span></div>'
    +'<div class="helpRow"><code>GLOWING ORBS</code><span>Click to collect — every orb counts toward 100%</span></div>'
    +'<div class="helpRow"><code>ESC</code><span>Close panels</span></div>'
    +'<div class="helpRow"><code>???</code><span>Old-school players know a certain code…</span></div>';
  openModal('HOW TO PLAY', h);
}
function openComplete(){
  var h = '<div class="complete"><div class="star">★</div>'
    +'<h3>WORLD 100% CLEARED</h3>'
    +'<p>You&rsquo;ve explored every island of this portfolio. The real quest starts here — say hi and let&rsquo;s build something together.</p>'
    +'<div class="contact" style="width:100%"><a class="cbtn" href="mailto:lvietquang11@gmail.com">✉ &nbsp;EMAIL QUANG</a><a class="cbtn alt" href="https://www.linkedin.com/in/quang-le-54239b1bb" target="_blank" rel="noopener">LINKEDIN ↗</a></div></div>';
  openModal('FULL CLEAR', h, true);
}

/* ==================== CHUNK 4 — THREE.JS WORLD ==================== */
var THREE = window.THREE;
var renderer, scene, camera, raycaster, ndc;
var composer = null, bloomPass = null;
var LOW = (window.innerWidth < 740) || ((window.devicePixelRatio || 1) < 1);
var islands = {};        // zone id -> { group, label, dockBtn, baseY, phase, spin, crystal, light }
var islandPicks = [];    // meshes/groups carrying userData.zone (raycast targets)
var orbs = [];           // { mesh, glow, base, alive, phase }
var stars = null;
var center = null;       // THREE.Vector3 archipelago center
var clock = 0;

/* spherical orbit camera state */
var cam = { theta: 0.7, phi: 0.95, radius: 18, tTheta: 0.7, tPhi: 0.95, tRadius: 18 };
var PHI_MIN = 0.32, PHI_MAX = 1.42, R_MIN = 8, R_MAX = 30;

function webglOK(){
  if(!THREE) return false;
  try {
    var c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch(e){ return false; }
}

/* soft radial glow texture (no external assets) */
function glowTexture(){
  var s = 128, cv = document.createElement('canvas'); cv.width = cv.height = s;
  var g = cv.getContext('2d');
  var rg = g.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
  rg.addColorStop(0, 'rgba(255,255,255,1)');
  rg.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, s, s);
  var t = new THREE.Texture(cv); t.needsUpdate = true; return t;
}
var GLOW = null;

function makeIsland(id, pos, scale){
  var z = ZONES[id], col = new THREE.Color(z.color), grp = new THREE.Group();
  scale = scale || 1;

  // floating top platform
  var topMat = new THREE.MeshStandardMaterial({ color: 0x141a30, roughness: 0.85, metalness: 0.1, emissive: col, emissiveIntensity: 0.18 });
  var top = new THREE.Mesh(new THREE.CylinderGeometry(2.2*scale, 1.95*scale, 0.55*scale, 7), topMat);
  top.userData.zone = id; grp.add(top);

  // glowing rim disc on the surface
  var rimMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  var rim = new THREE.Mesh(new THREE.RingGeometry(1.7*scale, 2.25*scale, 32), rimMat);
  rim.rotation.x = -Math.PI/2; rim.position.y = 0.31*scale; rim.userData.zone = id; grp.add(rim);

  // downward rock spike
  var rockMat = new THREE.MeshStandardMaterial({ color: 0x0e1224, roughness: 1, metalness: 0, flatShading: true });
  var spike = new THREE.Mesh(new THREE.ConeGeometry(1.9*scale, 3.6*scale, 7), rockMat);
  spike.position.y = -2.05*scale; spike.rotation.x = Math.PI; spike.userData.zone = id; grp.add(spike);

  // hovering crystal beacon (zone-colored, spins)
  var cryMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9, roughness: 0.25, metalness: 0.3 });
  var crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6*scale, 0), cryMat);
  crystal.position.y = 1.5*scale; crystal.userData.zone = id; grp.add(crystal);

  // beacon glow sprite
  if(GLOW){
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: col, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.scale.set(3.4*scale, 3.4*scale, 1); sp.position.y = 1.5*scale; grp.add(sp);
  }

  // accent point light
  var pl = new THREE.PointLight(col, 0.9, 12*scale, 2);
  pl.position.y = 1.2*scale; grp.add(pl);

  grp.position.copy(pos);
  scene.add(grp);

  // HTML label
  var lab = document.createElement('div');
  lab.className = 'isl-label'; lab.style.setProperty('--zc', z.color);
  lab.innerHTML = '<span class="lname">'+z.dock+'</span><span class="qmark">!</span>';
  lab.setAttribute('data-id', id);
  lab.addEventListener('click', function(){ if(S.started) openZone(id); });
  $('#labels').appendChild(lab);

  islands[id] = { group: grp, label: lab, crystal: crystal, baseY: pos.y, phase: Math.random()*TAU, spin: 0.15 + Math.random()*0.15 };
  islandPicks.push(grp);
}

function makeOrb(pos, idx){
  var col = new THREE.Color(0x9fe8ff);
  var mat = new THREE.MeshBasicMaterial({ color: 0xd6f4ff });
  var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), mat);
  mesh.position.copy(pos); mesh.userData = { orb: true, idx: idx };
  scene.add(mesh);
  var glow = null;
  if(GLOW){
    glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: col, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.set(2.0, 2.0, 1); glow.position.copy(pos); scene.add(glow);
  }
  orbs.push({ mesh: mesh, glow: glow, base: pos.clone(), alive: true, phase: Math.random()*TAU });
}

function buildWorld(){
  GLOW = glowTexture();
  scene = new THREE.Scene();
  center = new THREE.Vector3(0, 0.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  $('#world').appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(52, window.innerWidth/window.innerHeight, 0.1, 400);
  raycaster = new THREE.Raycaster();
  ndc = new THREE.Vector2();

  // lighting
  scene.add(new THREE.AmbientLight(0x3a4268, 0.9));
  var key = new THREE.DirectionalLight(0xbfd0ff, 0.7); key.position.set(6, 12, 8); scene.add(key);
  var fill = new THREE.PointLight(0x6e8bff, 0.5, 80); fill.position.set(-10, 6, -8); scene.add(fill);

  // starfield
  var SN = 2600, sg = new THREE.BufferGeometry(), sp = new Float32Array(SN*3);
  for(var i=0;i<SN;i++){
    var r = 90 + Math.random()*160, a = Math.random()*TAU, b = Math.acos(2*Math.random()-1);
    sp[i*3] = r*Math.sin(b)*Math.cos(a); sp[i*3+1] = r*Math.cos(b); sp[i*3+2] = r*Math.sin(b)*Math.sin(a);
  }
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xcdd8ff, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
  scene.add(stars);

  // nebula glow sprites
  if(GLOW){
    var neb = [[0x4658c8, -38, 6, -60, 70], [0x7c4bd6, 44, -8, -54, 64], [0xc04b78, 8, 20, -78, 80]];
    neb.forEach(function(n){
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: n[0], transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.position.set(n[1], n[2], n[3]); s.scale.set(n[4], n[4], 1); scene.add(s);
    });
  }

  // islands: nexus at center, six zones on a ring
  makeIsland('nexus', new THREE.Vector3(0, 0.6, 0), 1.25);
  var R = 9.2;
  ORDER.forEach(function(id, i){
    var a = (i/ORDER.length)*TAU - Math.PI/2;
    var p = new THREE.Vector3(Math.cos(a)*R, -0.4 + Math.sin(i*1.7)*0.8, Math.sin(a)*R);
    makeIsland(id, p, 1);
  });

  // 8 orbs scattered between/around islands
  for(var o=0;o<TOTAL_ORBS;o++){
    var ang = (o/TOTAL_ORBS)*TAU + 0.4, rr = 4.5 + (o%3)*2.4;
    makeOrb(new THREE.Vector3(Math.cos(ang)*rr, 1.4 + Math.sin(o*2.1)*1.6, Math.sin(ang)*rr), o);
  }

  // post-processing: UnrealBloom
  composer = new THREE.EffectComposer(renderer);
  composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  composer.addPass(new THREE.RenderPass(scene, camera));
  bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    LOW ? 0.6 : 0.95,   // strength
    0.55,               // radius
    0.2                 // threshold
  );
  composer.addPass(bloomPass);

  window.addEventListener('resize', onResize);
  onResize();
}

function onResize(){
  if(!renderer) return;
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if(composer){
    composer.setSize(window.innerWidth, window.innerHeight);
    if(bloomPass) bloomPass.setSize(window.innerWidth, window.innerHeight);
  }
}

/* ==================== CHUNK 5 — INPUT + RAYCAST + LOOP ==================== */
function zoneFromObject(obj){
  while(obj){ if(obj.userData && obj.userData.zone) return obj.userData.zone; obj = obj.parent; }
  return null;
}
function setNDC(x, y){
  ndc.x = (x/window.innerWidth)*2 - 1;
  ndc.y = -(y/window.innerHeight)*2 + 1;
}
function pickAt(x, y){
  setNDC(x, y); raycaster.setFromCamera(ndc, camera);
  var live = orbs.filter(function(o){ return o.alive; }).map(function(o){ return o.mesh; });
  var hitO = raycaster.intersectObjects(live, false);
  if(hitO.length) return { type: 'orb', idx: hitO[0].object.userData.idx };
  var hitI = raycaster.intersectObjects(islandPicks, true);
  if(hitI.length){ var z = zoneFromObject(hitI[0].object); if(z) return { type: 'zone', id: z }; }
  return null;
}
function collectOrb(idx){
  var o = orbs[idx]; if(!o || !o.alive) return;
  o.alive = false; o.mesh.visible = false; if(o.glow) o.glow.visible = false;
  S.orbs++; sfx.collect();
  addXP(15, 'ENERGY ORB');
  if(S.orbs === TOTAL_ORBS) unlock('orbs');
  checkFull(); updateHUD();
  drawRadar();
}

/* pointer / drag / zoom */
var ptr = { down: false, x: 0, y: 0, moved: 0, pid: null };
var pinch = { active: false, dist: 0 };
function bindInput(){
  var world = $('#world');
  world.addEventListener('pointerdown', function(e){
    if(!S.started) return;
    ptr.down = true; ptr.x = e.clientX; ptr.y = e.clientY; ptr.moved = 0; ptr.pid = e.pointerId;
    world.classList.add('dragging'); S.idle = 0;
    if(world.setPointerCapture){ try{ world.setPointerCapture(e.pointerId); }catch(_){} }
  });
  world.addEventListener('pointermove', function(e){
    if(!ptr.down) return;
    var dx = e.clientX - ptr.x, dy = e.clientY - ptr.y;
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.moved += Math.abs(dx) + Math.abs(dy); S.idle = 0;
    cam.tTheta -= dx*0.006;
    cam.tPhi = clamp(cam.tPhi - dy*0.006, PHI_MIN, PHI_MAX);
  });
  world.addEventListener('pointerup', function(e){
    if(!ptr.down) return;
    ptr.down = false; world.classList.remove('dragging');
    if(ptr.moved < 7){ // treat as click
      var hit = pickAt(e.clientX, e.clientY);
      if(hit){ if(hit.type === 'orb') collectOrb(hit.idx); else openZone(hit.id); dismissHint(); }
    }
  });
  world.addEventListener('pointerleave', function(){ ptr.down = false; world.classList.remove('dragging'); });

  world.addEventListener('wheel', function(e){
    if(!S.started) return;
    e.preventDefault();
    cam.tRadius = clamp(cam.tRadius + (e.deltaY > 0 ? 1.4 : -1.4), R_MIN, R_MAX); S.idle = 0;
  }, { passive: false });

  // touch pinch zoom
  world.addEventListener('touchmove', function(e){
    if(e.touches.length === 2){
      var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
      var d = Math.sqrt(dx*dx + dy*dy);
      if(pinch.active){ cam.tRadius = clamp(cam.tRadius - (d - pinch.dist)*0.03, R_MIN, R_MAX); }
      pinch.active = true; pinch.dist = d; S.idle = 0; e.preventDefault();
    }
  }, { passive: false });
  world.addEventListener('touchend', function(e){ if(e.touches.length < 2) pinch.active = false; });

  // hover highlight (desktop)
  world.addEventListener('pointermove', function(e){
    if(!S.started || ptr.down || e.pointerType === 'touch') return;
    var hit = pickAt(e.clientX, e.clientY);
    for(var id in islands) islands[id].label.classList.remove('hot');
    world.style.cursor = '';
    if(hit && hit.type === 'zone'){ islands[hit.id].label.classList.add('hot'); world.style.cursor = 'pointer'; }
    else if(hit && hit.type === 'orb'){ world.style.cursor = 'pointer'; }
  });
}

/* ==================== ZONE PANEL ==================== */
var panel = $('#panel');
function openZone(id){
  var z = ZONES[id];
  $('#pIcon').innerHTML = ICONS[id];
  $('#pSub').textContent = z.sub;
  $('#pName').textContent = z.name;
  $('#pTag').textContent = z.tag;
  $('#pBody').innerHTML = typeof z.body === 'function' ? z.body() : (z.body || '');
  panel.style.setProperty('--zc', z.color);
  panel.classList.add('open');
  sfx.open();

  // next-zone button
  var ix = ALL.indexOf(id), nx = ALL[(ix + 1) % ALL.length];
  var nb = $('#pNext');
  nb.textContent = 'NEXT → ' + ZONES[nx].name;
  nb.onclick = function(){ openZone(nx); };

  // animate Nexus stat bars
  var fills = $('#pBody').querySelectorAll('.sfill');
  if(fills.length){ requestAnimationFrame(function(){
    for(var i=0;i<fills.length;i++){ fills[i].style.width = (fills[i].getAttribute('data-w')||0) + '%'; }
  }); }

  // dock active state
  var dbs = $('#dock').children;
  for(var d=0; d<dbs.length; d++) dbs[d].classList.toggle('active', dbs[d].getAttribute('data-id') === id);

  // first-visit bookkeeping
  if(!S.visited[id]){
    S.visited[id] = true; S.nVisited++;
    islands[id].label.classList.add('visited');
    var btn = $('#dock').querySelector('[data-id="'+id+'"]'); if(btn) btn.classList.add('visited');
    addXP(20, 'ZONE DISCOVERED');
    if(S.nVisited === 1) unlock('first');
    if(id === 'nexus') unlock('soul');
    var allIslands = ORDER.every(function(z2){ return S.visited[z2]; });
    if(allIslands) unlock('carto');
    checkFull(); updateHUD(); drawRadar();
  }
}
function closePanel(){ if(panel.classList.contains('open')){ panel.classList.remove('open'); sfx.close(); } }

/* ==================== DOCK ==================== */
function buildDock(){
  var dock = $('#dock');
  ALL.forEach(function(id){
    var z = ZONES[id];
    var b = document.createElement('button');
    b.className = 'dbtn'; b.setAttribute('data-id', id); b.style.setProperty('--zc', z.color);
    b.innerHTML = ICONS[id] + '<span>' + z.dock + '</span><i class="dot"></i>';
    b.addEventListener('click', function(){ if(S.started){ openZone(id); dismissHint(); } });
    dock.appendChild(b);
  });
}

/* ==================== RADAR ==================== */
function drawRadar(){
  var cv = $('#radar'); if(!cv) return;
  var g = cv.getContext('2d'), W = cv.width, H = cv.height, cx = W/2, cy = H/2, R = W*0.42;
  g.clearRect(0, 0, W, H);
  // rings
  g.strokeStyle = 'rgba(148,166,255,.18)'; g.lineWidth = 1.5;
  [0.4, 0.7, 1].forEach(function(f){ g.beginPath(); g.arc(cx, cy, R*f, 0, TAU); g.stroke(); });
  g.beginPath(); g.moveTo(cx-R, cy); g.lineTo(cx+R, cy); g.moveTo(cx, cy-R); g.lineTo(cx, cy+R); g.stroke();
  var world2r = R/13;
  // camera heading sweep
  g.save(); g.strokeStyle = 'rgba(34,211,238,.55)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx, cy);
  g.lineTo(cx + Math.sin(cam.theta)*R, cy + Math.cos(cam.theta)*R); g.stroke(); g.restore();
  // orbs
  orbs.forEach(function(o){
    if(!o.alive) return;
    g.fillStyle = '#9fe8ff';
    g.beginPath(); g.arc(cx + o.base.x*world2r, cy + o.base.z*world2r, 2.4, 0, TAU); g.fill();
  });
  // islands
  for(var id in islands){
    var p = islands[id].group.position, vis = !!S.visited[id], z = ZONES[id];
    g.fillStyle = z.color; g.globalAlpha = vis ? 1 : 0.45;
    g.beginPath(); g.arc(cx + p.x*world2r, cy + p.z*world2r, id === 'nexus' ? 5 : 3.6, 0, TAU); g.fill();
    if(vis){ g.globalAlpha = 1; g.strokeStyle = '#34d399'; g.lineWidth = 1.4; g.stroke(); }
    g.globalAlpha = 1;
  }
}

/* ==================== RENDER LOOP ==================== */
var projV = null;
function project(obj, yOff){
  projV = projV || new THREE.Vector3();
  projV.set(0, yOff || 0, 0).applyMatrix4(obj.matrixWorld);
  projV.project(camera);
  return projV;
}
function tick(){
  requestAnimationFrame(tick);
  if(!renderer) return;
  clock += 0.016;
  S.idle += 0.016;

  // island bob + crystal spin
  for(var id in islands){
    var is = islands[id];
    is.group.position.y = is.baseY + Math.sin(clock*0.6 + is.phase)*0.35;
    if(is.crystal){ is.crystal.rotation.y += 0.01; is.crystal.rotation.x += 0.004; }
  }
  // orb float + pulse
  for(var i=0;i<orbs.length;i++){
    var o = orbs[i]; if(!o.alive) continue;
    var y = o.base.y + Math.sin(clock*1.3 + o.phase)*0.4;
    o.mesh.position.y = y;
    var pl = 1 + Math.sin(clock*3 + o.phase)*0.12; o.mesh.scale.setScalar(pl);
    if(o.glow){ o.glow.position.copy(o.mesh.position); o.glow.material.opacity = 0.6 + Math.sin(clock*3 + o.phase)*0.25; }
  }
  if(stars) stars.rotation.y += RM ? 0 : 0.0003;

  // gentle auto-rotate when idle and panel closed
  if(!RM && S.started && S.idle > 4 && !ptr.down) cam.tTheta += 0.0016;

  // ease camera toward targets
  cam.theta += (cam.tTheta - cam.theta)*0.1;
  cam.phi += (cam.tPhi - cam.phi)*0.1;
  cam.radius += (cam.tRadius - cam.radius)*0.1;
  camera.position.set(
    center.x + cam.radius*Math.sin(cam.phi)*Math.sin(cam.theta),
    center.y + cam.radius*Math.cos(cam.phi),
    center.z + cam.radius*Math.sin(cam.phi)*Math.cos(cam.theta)
  );
  camera.lookAt(center);

  if(composer) composer.render(); else renderer.render(scene, camera);

  // position HTML labels
  if(S.started){
    for(var lid in islands){
      var isl = islands[lid], v = project(isl.group, 2.6 + isl.group.position.y - isl.baseY);
      if(v.z > 1){ isl.label.style.opacity = 0; continue; }
      var sx = (v.x*0.5 + 0.5)*window.innerWidth, sy = (-v.y*0.5 + 0.5)*window.innerHeight;
      isl.label.style.transform = 'translate(-50%,-100%)';
      isl.label.style.left = sx + 'px'; isl.label.style.top = sy + 'px';
      isl.label.style.opacity = 1;
    }
  }
  drawRadar();
}

/* ==================== HINT / PLAYTIME / KONAMI ==================== */
var hintTimer = null;
function dismissHint(){ var h = $('#hint'); if(h) h.classList.add('off'); if(hintTimer){ clearTimeout(hintTimer); hintTimer = null; } }
var KONAMI = [38,38,40,40,37,39,37,39,66,65], kpos = 0;
function onKey(e){
  if(e.key === 'Escape'){ if(S.modal) closeModal(); else closePanel(); return; }
  var k = e.keyCode || e.which;
  if(k === KONAMI[kpos]){ kpos++; if(kpos === KONAMI.length){ kpos = 0; if(!S.ach.konami){ unlock('konami'); confetti(40); } } }
  else { kpos = (k === KONAMI[0]) ? 1 : 0; }
}

/* ==================== START / BOOT ==================== */
function startGame(){
  if(S.started) return;
  audio(); sfx.start();
  S.started = true;
  $('#title').classList.add('off');
  $('#hud').classList.add('on');
  $('#labels').style.visibility = 'visible';
  unlock('boot');
  setInterval(function(){ if(S.started && !S.full) S.playSec++; }, 1000);
  hintTimer = setTimeout(dismissHint, 6000);
  updateHUD();
}
function runLoader(){
  var fill = $('#tFill'), pctEl = $('#tPct'), btn = $('#startBtn'), p = 0;
  var iv = setInterval(function(){
    p = Math.min(100, p + 4 + Math.random()*7);
    fill.style.width = p + '%'; pctEl.textContent = Math.round(p) + '%';
    if(p >= 100){ clearInterval(iv); setTimeout(function(){ $('#tLoad').style.opacity = '.4'; btn.style.display = 'block'; }, 250); }
  }, 70);
}
function bindUI(){
  $('#startBtn').addEventListener('click', startGame);
  $('#btnQuests').addEventListener('click', openQuests);
  $('#btnAch').addEventListener('click', openAch);
  $('#btnHelp').addEventListener('click', openHelp);
  $('#btnSound').addEventListener('click', function(){
    S.sound = !S.sound;
    $('#sndOn').style.display = S.sound ? '' : 'none';
    $('#sndOff').style.display = S.sound ? 'none' : '';
    if(S.sound){ audio(); sfx.click(); }
  });
  $('#pClose').addEventListener('click', closePanel);
  $('#mClose').addEventListener('click', closeModal);
  $('#mback').addEventListener('click', function(e){ if(e.target === mback) closeModal(); });
  document.addEventListener('keydown', onKey);
}

function init(){
  if(!webglOK()){ var n = $('#no3d'); if(n) n.style.display = 'grid'; return; }
  buildWorld();
  buildDock();
  bindInput();
  bindUI();
  updateHUD();
  runLoader();
  tick();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();