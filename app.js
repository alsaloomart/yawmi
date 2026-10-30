// ===== التحيات: عدّلها هنا بس (حسب أوقات الصلاة الفعلية) =====
const GREETINGS={
  fajr:   {main:'صباحك نور',  sub:'بداية هادية'},      // الفجر ← الظهر
  dhuhr:  {main:'نص اليوم',   sub:'خذ نفس'},           // الظهر ← العصر
  asr:    {main:'عصرك هادي',  sub:'باقي القليل'},      // العصر ← المغرب
  maghrib:{main:'مساك خير',   sub:'خلّ الباقي بهدوء'}, // المغرب ← العشاء
  isha:   {main:'ليلة هادية', sub:'بكرة فرصة جديدة'}   // العشاء ← الفجر
};
// ===== الموقع وأوقات الصلاة (adhan-js، أم القرى) =====
const CITIES=[['الرياض',24.7136,46.6753],['بريدة',26.3260,43.9750],['عنيزة',26.0840,43.9940],['جدة',21.4858,39.1925],['مكة',21.3891,39.8579],['المدينة',24.5247,39.5692],['الدمام',26.4207,50.0888],['الخبر',26.2172,50.1971],['الأحساء',25.3833,49.5867],['تبوك',28.3838,36.5550],['أبها',18.2164,42.5053],['حائل',27.5114,41.6900],['الطائف',21.2703,40.4158],['جازان',16.8892,42.5511],['نجران',17.4924,44.1277],['الجوف',29.9697,40.2064]];
let LOC={city:'الرياض',lat:24.7136,lng:46.6753,def:true};
function nearCity(lat,lng){let best=null,bd=1e9;for(const c of CITIES){const d=Math.hypot((c[1]-lat)*111,(c[2]-lng)*111*Math.cos(lat*Math.PI/180));if(d<bd){bd=d;best=c}}return bd<45?best[0]:'موقعك'}
function locate(){if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(p=>{const{latitude:a,longitude:o}=p.coords;LOC={city:nearCity(a,o),lat:a,lng:o};render()},()=>{},{timeout:8000,maximumAge:36e5})}
const PNAMES={fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
function ptimes(d=new Date()){const c=new adhan.Coordinates(LOC.lat,LOC.lng),p=adhan.CalculationMethod.UmmAlQura();return new adhan.PrayerTimes(c,d,p)}
function prayerState(now=new Date()){const t=ptimes(now),tm=ptimes(new Date(now.getTime()+864e5));const keys=['fajr','sunrise','dhuhr','asr','maghrib','isha'];
 let next=keys.find(k=>t[k]>now),nextAt=next?t[next]:tm.fajr;if(!next)next='fajr';
 const five=['fajr','dhuhr','asr','maghrib','isha'];let cur=five.filter(k=>t[k]<=now).pop()||'isha';
 return{t,keys,next,nextAt,cur,list:keys.map(k=>[k,PNAMES[k],t[k]])}}
const hijri=d=>{const f=o=>new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',o).formatToParts(d).find(x=>x.type===Object.keys(o)[0]).value;return{d:f({day:'numeric'}),m:f({month:'long'}),y:f({year:'numeric'}).replace(/\D/g,'')}};
const hm=d=>{let h=d.getHours()%12||12;return`${String(h).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`};
const cdTxt=ms=>{const s=Math.max(0,Math.floor(ms/1000));return`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
const hrs=d=>d.getHours()+d.getMinutes()/60;
// حدود الفترات: بعد الفجر = الفجر→الشروق+20د، الضحى = →الظهر، بعد الظهر = →العصر، بعد العصر = →المغرب، الليل = المغرب→فجر بكرة
function segs(){const t=ptimes();const f=hrs(t.fajr);return[[f,hrs(t.sunrise)+1/3],[hrs(t.sunrise)+1/3,hrs(t.dhuhr)],[hrs(t.dhuhr),hrs(t.asr)],[hrs(t.asr),hrs(t.maghrib)],[hrs(t.maghrib),f+24]]}
function greeting(){return GREETINGS[prayerState().cur]}
const NF=new Intl.NumberFormat('en');const n=x=>NF.format(x);
const DL='ar-SA-u-nu-latn-ca-gregory';
const I={...BRAND_ICONS,
location:'<path d="M20 4L4 11l7 2 2 7z"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',home:'<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/><path d="M7.5 12h2.5l1.5-2.5 2 4.5 1.5-2h1.5"/>',
dumb:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
drop:'<path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/>',pill:'<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l5 7"/>',
scale:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9.5a4 4 0 0 1 6 0l-3 2.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',
book:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
mosque:'<path d="M12 3c-3 2.5-5 4.3-5 7h10c0-2.7-2-4.5-5-7zM5 21V12h14v9M10 21v-4a2 2 0 0 1 4 0v4M3 21h18"/>',
sunrise:'<path d="M5 17a7 7 0 0 1 14 0M3 20h18M12 4v4M9.5 6.5L12 4l2.5 2.5"/>',sunset:'<path d="M5 17a7 7 0 0 1 14 0M3 20h18M12 3v5M9.5 5.5L12 8l2.5-2.5"/>',
trash:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',later:'<path d="M5 12a7 7 0 1 0 2-5"/><path d="M4.5 4v4h4M12 8.5V12l2.5 1.5"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>'};
const ic=(k,c='ico')=>`<span class="${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${I[k]||''}</svg></span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dk=(d=new Date())=>{const z=new Date(d);z.setMinutes(z.getMinutes()-z.getTimezoneOffset());return z.toISOString().slice(0,10)};
const addD=(k,x)=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()+x);return dk(d)};
const T=dk();
const PERIODS=[['fajr','بعد الفجر','sunrise',[3,9]],['duha','الضحى','sun',[9,12]],['dhuhr','بعد الظهر','mosque',[12,15]],['asr','بعد العصر','sunset',[15,18]],['night','الليل','moon',[18,27]]];
const periodOf=t=>{if(!t)return'duha';const[a,b]=t.split(':');const S_=segs();let h=+a+ +b/60;if(h<S_[0][0])h+=24;const i=S_.findIndex(([x,y])=>h>=x&&h<y);return PERIODS[i<0?1:i][0]};
function energy(){const sl=S.sleep[T],y=addD(T,-1),ex=S.workouts.filter(w=>w.d===T||w.d===y).reduce((a,b)=>a+b.min,0);const v=Math.round(Math.min(1,(sl?sl.h:5)/8)*55+Math.min(1,water()/S.waterGoal)*20+Math.min(1,ex/45)*25);return{v}}
let EDIT=false;const DEF=['gym','rings','timeline','streak','energy','projects','week','next'];
function dash(){const d=S.dash=S.dash||{order:[...DEF],hidden:[],pinned:[]};DEF.forEach(k=>{if(!d.order.includes(k))d.order.push(k)});d.order=d.order.filter(k=>DEF.includes(k));return d}
function burst(x,y){navigator.vibrate&&navigator.vibrate(12);if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=document.createElement('div');b.className='burst';b.style.left=x+'px';b.style.top=y+'px';b.innerHTML='<i></i>'.repeat(8);document.body.appendChild(b);setTimeout(()=>b.remove(),900)}
const dueTxt=d=>{const x=Math.round((new Date(d+'T12:00')-new Date(T+'T12:00'))/864e5);return x<0?'متأخر':x===0?'اليوم':x===1?'بكرة':`بعد ${n(x)} أيام`};
const STAGES=['عرض سعر','دفعة أولى','تنفيذ','تعديلات','تسليم','الدفعة الأخيرة'];
const HABITS=[['fajr','الفجر','p'],['dhuhr','الظهر','p'],['asr','العصر','p'],['maghrib','المغرب','p'],['isha','العشاء','p'],['wird','الورد','h','book'],['adhkar','أذكار الصباح والمساء','h','pen'],['read','القراءة (20 دقيقة)','h','book']];
function hist(days){const s=[];for(let i=1;i<=days;i++)s.push(addD(T,-i));return s}
function seed(){let id=1;const tk=(t,time,pr,date=T)=>({id:id++,title:t,time,pr,date,done:false});
return{v:3,water:{[T]:4},waterGoal:8,
sleep:{[T]:{h:6.5,from:'23:45',to:'06:15'},[addD(T,-1)]:{h:7,from:'23:30',to:'06:30'}},
weight:[{d:addD(T,-14),kg:82.4},{d:addD(T,-7),kg:81.9},{d:addD(T,-1),kg:81.5}],
meds:[{id:1,name:'فيتامين د 50,000',when:'بعد الغدا'},{id:2,name:'أوميغا 3',when:'بعد الفطور'},{id:3,name:'مغنيسيوم',when:'قبل النوم'}],medLog:{[T]:[2]},
tasks:[tk('مراجعة الإيميلات والرد على العملاء','06:30',2),tk('تصوير منتجات «مقهى الريحان» (مثال)','10:00',3),tk('تسليم شعار «مؤسسة نخلة» (مثال)','13:30',3),tk('تحويل صور جلسة أمس','16:30',2),tk('ترتيب ملفات الأرشيف','21:00',1),tk('شراء بطاريات للفلاش','17:30',1,addD(T,1))],
workoutPlan:{0:'صدر وكتف',1:'كارديو 30 د',2:'ظهر',3:'راحة',4:'أرجل',5:'مشي خفيف',6:'راحة'},
workouts:[{d:addD(T,-1),type:'ظهر',min:45},{d:addD(T,-3),type:'صدر وكتف',min:50}],
habits:Object.fromEntries(HABITS.map(([k],i)=>[k,hist(i%3===0?12:i%3===1?5:3).concat(i<3?[T]:[])])),
projects:[{id:1,client:'مقهى الريحان (عميل تجريبي)',title:'هوية بصرية كاملة',amount:12000,stage:2,due:addD(T,6)},{id:2,client:'مؤسسة نخلة (عميل تجريبي)',title:'تصميم شعار',amount:4500,stage:4,due:addD(T,1)},{id:3,client:'متجر سدرة (عميل تجريبي)',title:'تصوير منتجات 40 صورة',amount:6000,stage:0,due:addD(T,14)},{id:4,client:'شركة مدى (عميل تجريبي)',title:'بوستات سوشال شهرية',amount:3500,stage:3,due:addD(T,3)}],nid:100}}
let S=JSON.parse(localStorage.getItem('yawmi')||'null')||seed();if(S.v<3)S=seed();
const save=()=>{localStorage.setItem('yawmi',JSON.stringify(S));render()};
const toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('on'),1800)};
const TABS=[['home','يومك','home'],['tasks','المهام','list'],['health','الصحة','heart'],['gym','التمارين','dumb'],['ibada','العبادات','mosque'],['work','المشاريع','folio']];
let tab=(location.hash.slice(1))||'home';if(!TABS.some(t=>t[0]==tab)&&tab!=='settings'&&tab!=='session')tab='home';
const todayTasks=()=>S.tasks.filter(t=>t.date<=T&&!t.deleted);
const fmtTime=t=>{if(!t)return'';let[h,m]=t.split(':').map(Number);const am=h<12;h=h%12||12;return`${h}:${String(m).padStart(2,'0')} ${am?'ص':'م'}`};
const tasksWord=c=>c===0?'ما عندك مهام':c===1?'عندك مهمة وحدة':c===2?'عندك مهمتين':`عندك ${n(c)} ${c<=10?'مهام':'مهمة'}`;
function taskRow(t,full){return`<div class="card ${t.done?'done':''}"><div class="row"><button class="chk ${t.done?'on':''}" data-a="toggle" data-id="${t.id}" aria-label="خلصت">${t.done?ic('check',''):''}</button>
<div class="sp"><div class="t">${esc(t.title)}</div><div class="meta"><i class="pr p${t.pr}"></i>${['','عادية','متوسطة','مهمة'][t.pr]}${t.time?` · ${fmtTime(t.time)}`:''}${t.date<T?' · متأخرة':t.date>T?' · بكرة':''}</div></div></div>
${full&&!t.done?`<div class="acts"><button class="btn s" data-a="toggle" data-id="${t.id}">خلصت ✓</button><button class="btn s l" data-a="later" data-id="${t.id}">أجّلها لبكرة</button><button class="btn s l" data-a="del" data-id="${t.id}">شيلها</button></div>`:''}</div>`}
const water=()=>S.water[T]||0;
function streak(k){const set=new Set(S.habits[k]||[]);let d=set.has(T)?T:addD(T,-1),c=0;while(set.has(d)){c++;d=addD(d,-1)}return c}
const DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const PLAN_DEFAULT={0:{type:'strong',v:'A'},1:{type:'light'},2:{type:'strong',v:'B'},3:{type:'light'},4:{type:'strong',v:'C'},5:{type:'rest'},6:{type:'rest'}};
function ensure(){S.gym=S.gym||JSON.parse(JSON.stringify(GYM_DEFAULT));S.gymPlan=S.gymPlan||JSON.parse(JSON.stringify(PLAN_DEFAULT));S.lastW=S.lastW||{};S.walk=S.walk||{};S.light=S.light||{};
S.tas=S.tas||{d:0,target:33,count:0,total:{}};S.adhP=S.adhP||{};for(const k in S.adhP)if(!k.endsWith(ADHKAR_VER))delete S.adhP[k];
if(!S.habits.witr){S.habits.witr=hist(6);S.habits.sn_fajr=[T];S.habits.sn_dhuhrb=[T];S.habits.sn_dhuhra=[T]}
S.ch=S.ch||{fajr:{start:addD(T,-11)},quran:{mode:'juz',done:Object.fromEntries([...Array(11)].map((_,i)=>[i,addD(T,i-11)])),count:1,archive:[]}}}
const dayPlan=i=>S.gymPlan[i]||{type:'rest'};
const planTitle=p=>p.type==='strong'?`مشي 45 د + نادي ${p.v}`:p.type==='light'?'مشي 5000 خطوة':'راحة';
function todayGymHTML(full){const p=dayPlan(new Date().getDay());
if(p.type==='rest')return`<div class="glass"><div class="sub">تمرين اليوم</div><div class="t" style="margin-top:4px;font-size:17px">يوم راحة 🌙</div><div class="meta">جسمك يبني نفسه اليوم، نام زين واشرب موية</div></div>`;
if(p.type==='light'){const on=!!S.light[T];return`<div class="glass"><div class="sub">تمرين اليوم · يوم خفيف</div><div class="row" style="margin-top:8px"><button class="chk ${on?'on':''}" data-a="light">${on?ic('check',''):''}</button><div class="sp t">مشي 5000 خطوة</div></div><div class="meta" style="margin-top:6px">شيّكها بنفسك من تطبيق الخطوات</div></div>`}
const ex=S.gym[p.v],w=S.walk[T]||{},run=w.start&&!w.done,el=run?Math.floor((Date.now()-w.start)/1000):0;
return`<div class="glass" ${full?'':'data-go="gym"'}><div class="sub">تمرين اليوم</div><div class="t" style="margin-top:4px;font-size:17px">مشي 45 د + نادي ${p.v} · ${n(ex.length)} تمارين · ${n(gymMinutes(ex))} د</div>
<div class="walk"><button class="chk ${w.done?'on':''}" data-a="walkdone">${w.done?ic('check',''):''}</button><span class="sp">المشي 45 د</span>${w.done?'<span class="chip">تم ✓</span>':run?`<b class="wt" data-up="${w.start}">${cdTxt(el*1000)}</b><button class="btn s l" data-a="walkstop">وقّف</button>`:`<button class="btn s l" data-a="walkstart">ابدأ المؤقت</button>`}</div>
<div class="row" style="margin-top:10px"><span class="meta sp">${ex.map(e=>e.m).join(' · ')}</span><button class="btn g s" data-a="startsess" data-v="${p.v}">${S.sess&&S.sess.d===T?'كمّل التمرين':'ابدأ التمرين'}</button></div></div>`}
// ===== التشجيع =====
// العبارات من copy/cheers.json (نص الكاتب بدون تعديل). الإيموجي الأخير يُستخرج ويتحرّك لحاله
let CHEERS={};const LAST={};
fetch('copy/cheers.json').then(r=>r.json()).then(j=>CHEERS=j).catch(()=>{});
const NEUTRAL_PRAYER=['تقبّل الله منك 🤲','جعله الله نورًا لك ✨','الله يكتب أجرك 🤲'];
function pool(cat){if(cat==='prayer')return(CHEERS.fajr||[]).filter(x=>NEUTRAL_PRAYER.includes(x));if(cat.startsWith('streak.'))return(CHEERS.streak||{})[cat.slice(7)]||[];return CHEERS[cat]||[]}
function splitEmoji(t){const m=t.match(/\s*((?:\p{Extended_Pictographic}|\p{Emoji_Presentation})(?:[\uFE0F\u200D]|\p{Extended_Pictographic})*)\s*$/u);return m?{text:t.slice(0,m.index),emoji:m[1]}:{text:t,emoji:''}}
function cheer(cat,big){navigator.vibrate&&navigator.vibrate(big?[20,60,20]:12);const L=pool(cat);if(!L.length)return;let i=Math.floor(Math.random()*L.length);if(L.length>1&&i===LAST[cat])i=(i+1+Math.floor(Math.random()*(L.length-1)))%L.length;LAST[cat]=i;const c=splitEmoji(L[i]);
document.querySelectorAll('.cheer').forEach(e=>e.remove());const el=document.createElement('div');el.className='cheer';el.innerHTML=`<span class="ce">${c.emoji}</span><span>${esc(c.text)}</span>`;document.body.appendChild(el);setTimeout(()=>el.remove(),2600);
if(big&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const w=document.createElement('div');w.className='scatter';for(let k=0;k<14;k++){const s=document.createElement('span');s.textContent=c.emoji||'✨';s.style.left=(8+Math.random()*84)+'%';s.style.animationDelay=(Math.random()*.5)+'s';w.appendChild(s)}document.body.appendChild(w);setTimeout(()=>w.remove(),2600)}}
function checkMilestone(k){const st=streak(k);if([5,14,30,100].includes(st))setTimeout(()=>cheer('streak.'+st,st>=30),1400)}
const habitCat=k=>k==='fajr'?'fajr':['dhuhr','asr','maghrib','isha'].includes(k)?'prayer':k.startsWith('sn_')||k==='witr'?'sunan_witr':k==='wird'?'hizb_done':k==='adhkar'?'adhkar':'task_done';
// ===== شبكة التحديات (مكوّن مشترك) =====
function challengeGrid(c){const done=c.total.filter?0:0;const cnt=[...Array(c.total)].filter((_,i)=>c.isDone(i)).length,pct=cnt/c.total,R=26,C=2*Math.PI*R;
return`<div class="glass chg"><div class="row"><div class="ringwrap"><svg width="64" height="64" viewBox="-32 -32 64 64"><circle r="${R}" fill="none" stroke="#F2C230" stroke-opacity=".16" stroke-width="6"/><circle class="ring" r="${R}" stroke="#F2C230" stroke-width="6" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-pct)}"/></svg><div class="ringc"><b style="font-size:14px">${n(Math.round(pct*100))}%</b></div></div>
<div class="sp"><div class="t" style="font-size:16px">${c.title.split(" · ").map((x,i)=>i?`<div style="font-size:14px;color:var(--gold);white-space:nowrap">${x}</div>`:x).join("")}</div><div class="meta">${c.sub}</div><div class="meta">أطول سلسلة: <b style="color:var(--gold)">${n(c.longest)}</b> ${c.longest===2?'يومين':'أيام'}</div></div>${c.extra||''}</div>
${c.complete?`<div class="khdone"><b>${c.completeText}</b><span>${c.completeSub||''}</span>${c.completeBtn||''}</div>`:''}
<div class="cgrid" style="grid-template-columns:repeat(${c.cols},1fr)">${[...Array(c.total)].map((_,i)=>`<button class="cq ${c.isDone(i)?'on':''} ${c.cur===i?'cur':''} ${c.locked&&c.locked(i)?'lk':''}" data-a="${c.act}" data-i="${i}"><b>${n(i+1)}</b>${c.label?`<small>${c.label}</small>`:''}</button>`).join('')}</div></div>`}
function longestRun(dates){const d=[...new Set(dates)].sort();let best=0,cur=0,prev=null;for(const x of d){cur=prev&&addD(prev,1)===x?cur+1:1;best=Math.max(best,cur);prev=x}return best}
function fajrChallenge(){const st=S.ch.fajr.start,set=new Set(S.habits.fajr||[]),day=Math.min(30,Math.round((new Date(T+'T12:00')-new Date(st+'T12:00'))/864e5)+1),cnt=[...Array(30)].filter((_,i)=>set.has(addD(st,i))).length;
return challengeGrid({title:'تحدي الفجر · 30 يوم',sub:`يوم ${n(day)} من 30 · صليت ${n(cnt)}`,total:30,cols:6,act:'chfajr',cur:day-1,isDone:i=>set.has(addD(st,i)),locked:i=>addD(st,i)>T,longest:longestRun([...set].filter(x=>x>=st)),complete:cnt>=30,completeText:'30 يوم فجر، ما شاء الله',completeBtn:`<button class="btn s g" data-a="chfajrnew">ابدأ تحدي جديد</button>`})}
function quranChallenge(){const q=S.ch.quran,tot=q.mode==='juz'?30:60,lab=q.mode==='juz'?'جزء':'حزب',done=i=>!!q.done[i],cnt=Object.keys(q.done).length,cur=[...Array(tot).keys()].find(i=>!done(i));
return challengeGrid({title:`الحزب القرآني · ${q.mode==='juz'?'الجزء':'الحزب'} ${n(Math.min(tot,(cur??tot-1)+1))} من ${n(tot)}`,sub:`ختمت ${n(q.count)} ${q.count===1?'ختمة':'ختمات'} قبل · ورد يومي: ${q.mode==='juz'?'جزء':'حزب'}`,total:tot,cols:q.mode==='juz'?6:10,act:'qtog',cur,isDone:done,label:lab,longest:longestRun(Object.values(q.done)),
 extra:`<button class="btn s l" data-a="qmode">${q.mode==='juz'?'حزب/يوم':'جزء/يوم'}</button>`,complete:cnt>=tot,completeText:'ختمة مباركة 🤍',completeSub:`هذي ختمتك رقم ${n(q.count+1)}`,completeBtn:`<button class="btn s g" data-a="qnew">ابدأ ختمة جديدة</button>`})}
const SUNAN=[['sn_fajr','قبل الفجر',2,'fajr'],['sn_dhuhrb','قبل الظهر',4,'dhuhr'],['sn_dhuhra','بعد الظهر',2,'dhuhr'],['sn_maghrib','بعد المغرب',2,'maghrib'],['sn_isha','بعد العشاء',2,'isha'],['witr','الوتر',0,'isha']];
const has=(k,d=T)=>(S.habits[k]||[]).includes(d);
function sunanHTML(){const rk=SUNAN.filter(s=>s[2]&&has(s[0])).reduce((a,s)=>a+s[2],0),ws=streak('witr');
return`<div class="glass"><div class="row"><div class="sp"><div class="t" style="font-size:16px">السنن الرواتب والوتر</div><div class="meta">${n(rk)} من 12 ركعة · سلسلة الوتر <b style="color:var(--gold)">${n(ws)}</b> ${ws===2?'يومين':'أيام'}</div></div><div class="big" style="font-size:26px">${n(rk)}<span class="unit">/12</span></div></div><div class="bar"><i style="width:${rk/12*100}%"></i></div>
${SUNAN.map(([k,l,r])=>`<div class="ctask"><button class="chk ${has(k)?'on':''}" data-a="habit" data-k="${k}">${has(k)?ic('check',''):''}</button><div class="sp t">${l}</div><span class="tm">${r?n(r)+' ركعات'.replace('2 ركعات','ركعتين'):'ركعة أو أكثر'}</span></div>`).join('')}</div>`}
function adhMode(){const c=prayerState().cur;return['asr','maghrib','isha'].includes(c)?'evening':'morning'}
const IB={
today(){const row=([k,l])=>{const on=has(k),s=streak(k);return`<div class="card"><div class="row"><button class="chk ${on?'on':''}" data-a="habit" data-k="${k}">${on?ic('check',''):''}</button><div class="sp t">${l}</div><span class="streak">🔥 <b>${n(s)}</b> ${s===1?'يوم':s===2?'يومين':'أيام'}</span></div></div>`};
const done=HABITS.filter(h=>has(h[0])).length;
return`<p class="sub" style="margin-top:12px">سويت ${n(done)} من ${n(HABITS.length)} اليوم، الله يتقبّل</p><div class="bar"><i style="width:${done/HABITS.length*100}%"></i></div><h2>الصلوات الخمس</h2>${HABITS.filter(h=>h[2]==='p').map(row).join('')}<h2>تحدي الفجر</h2>${fajrChallenge()}<h2>السنن</h2>${sunanHTML()}<h2>الورد والعادات</h2>${HABITS.filter(h=>h[2]==='h').map(row).join('')}`},
adhkar(){const m=window._am||adhMode(),list=ADHKAR.filter(x=>x.type===0||x.type===(m==='morning'?1:2)),key=T+m+ADHKAR_VER,P=S.adhP[key]&&S.adhP[key].i<=list.length?S.adhP[key]:{i:0,left:list[0].count},fin=P.i>=list.length,x=list[Math.min(P.i,list.length-1)];
return`<div class="seg" style="margin-top:10px">${[['morning','أذكار الصباح'],['evening','أذكار المساء']].map(([k,l])=>`<button class="${m===k?'on':''}" data-a="am" data-v="${k}">${l}</button>`).join('')}</div>
<div class="row" style="margin:12px 4px 6px"><span class="sub sp">${fin?'خلصت':`${n(P.i+1)} من ${n(list.length)}`}</span><span class="sub">${m==='morning'?'تطلع لحالها بعد الفجر':'تطلع لحالها بعد العصر'}</span></div><div class="bar"><i style="width:${(fin?1:P.i/list.length)*100}%"></i></div>
${fin?`<div class="glass" style="margin-top:12px;text-align:center"><div style="font-size:34px">🌿</div><div class="t" style="font-size:18px">خلصت ${m==='morning'?'أذكار الصباح':'أذكار المساء'}</div><button class="btn s l" style="margin-top:10px" data-a="adhreset">ابدأ من جديد</button></div>`:
`<button class="glass dhikr" data-a="dtap"><div class="dtext">${esc(x.text)}</div>${x.count?`<div class="dcount"><b>${n(P.left)}</b><span>من ${n(x.count)} · اضغط للعد</span></div>`:`<div class="dcount"><b>${n(P.up||0)}</b><span>اضغط للعد</span></div>`}</button>${x.src?`<div class="srcw">${esc(x.src)}</div>`:''}
<div class="row" style="gap:8px"><button class="btn s l" data-a="dprev">السابق</button><span class="sp"></span><button class="btn s l" data-a="dskip">التالي</button></div>`}
<p class="credit">الآيات: Tanzil.net</p>`},
tasbeeh(){const t=S.tas,DH=['سبحان الله','الحمد لله','الله أكبر','لا إله إلا الله','أستغفر الله','اللهم صلّ على محمد'],R=118,C=2*Math.PI*R,p=Math.min(1,t.count/t.target);
return`<div class="dpick">${DH.map((d,i)=>`<button class="chip ${t.d===i?'on':''}" data-a="tsd" data-v="${i}">${d}</button>`).join('')}</div>
<button class="tbtn" data-a="tstap" aria-label="سبّح"><svg width="260" height="260" viewBox="-130 -130 260 260"><circle r="${R}" fill="none" stroke="#F2C230" stroke-opacity=".14" stroke-width="10"/><circle r="${R}" fill="none" stroke="#F2C230" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}" transform="rotate(-90)" style="transition:stroke-dashoffset .25s"/></svg>
<span class="tin"><b>${n(t.count)}</b><span>${DH[t.d]}</span><small>من ${n(t.target)}</small></span></button>
<div class="row" style="justify-content:center;gap:6px">${[33,100].map(v=>`<button class="btn s ${t.target===v?'g':'l'}" data-a="tst" data-v="${v}">${n(v)}</button>`).join('')}<button class="btn s ${![33,100].includes(t.target)?'g':'l'}" data-a="tstc">مخصص</button><button class="btn s l" data-a="tsr">تصفير</button></div>
<p class="sub" style="text-align:center;margin-top:14px">مجموع تسبيحك اليوم: <b style="color:var(--gold)">${n(t.total[T]||0)}</b></p>`},
khatma(){return`<div style="margin-top:12px">${quranChallenge()}</div><p class="safety">الورد اليومي مربوط بعادة «الورد»: أول ما تشيّك جزء اليوم تنشيّك العادة</p>`}};
function infoSheet(html){const s=document.getElementById('sheet');s.innerHTML=`<div class="in">${html}<button class="btn l w" data-close>إغلاق</button></div>`;s.classList.remove('hidden');s.querySelector('[data-close]').onclick=()=>s.classList.add('hidden');s.onclick=e=>{if(e.target===s)s.classList.add('hidden')}}
function prayerSheetHTML(){const ps=prayerState(),now=new Date(),cur=ps.cur,rel=SUNAN.filter(x=>x[3]===cur);
return`<div class="row"><h2 class="sp" style="margin:0">أوقات الصلاة</h2><span class="city">${ic('location')}${esc(LOC.city)} · أم القرى</span></div>
<div class="pnext"><span class="sub">القادمة</span><span class="nm">${PNAMES[ps.next]}</span><span class="tm">${hm(ps.nextAt)}</span><span class="cd">خلال <b data-cd="${ps.nextAt.getTime()}">${cdTxt(ps.nextAt-now)}</b></span></div>
<div class="prow">${ps.list.map(([k,l,d])=>`<div class="${k===ps.next?'nx':''} ${k===cur?'cu':''}">${l}<b>${hm(d)}</b>${k===cur?'<i>الحين</i>':k===ps.next?'<i>القادمة</i>':''}${SUNAN.some(x=>x[3]===k&&x[2])?`<span class="sun">${SUNAN.filter(x=>x[3]===k&&x[2]).map(x=>`<s class="${has(x[0])?'on':''}"></s>`).join('')}</span>`:''}</div>`).join('')}</div>
<div class="glass" style="margin:4px 0 0"><div class="sub" style="font-size:12px">الحين: وقت ${PNAMES[cur]}</div><div class="row" style="margin-top:6px"><div class="sp t">صليت ${PNAMES[cur]}؟</div>${has(cur)?'<span class="chip">تم ✓ تقبّل الله</span>':`<button class="btn g s" data-a="habit" data-k="${cur}">إيه، صليت</button>`}</div>
${rel.map(([k,l,r])=>`<div class="ctask"><button class="chk ${has(k)?'on':''}" data-a="habit" data-k="${k}">${has(k)?ic('check',''):''}</button><div class="sp t">${r?'سنة ':''}${l}</div><span class="tm">${r?(r===2?'ركعتين':n(r)+' ركعات'):''}</span></div>`).join('')}</div>`}

const V={
home(){const tt=todayTasks(),done=tt.filter(t=>t.done).length,open=tt.length-done,pct=tt.length?done/tt.length:0,sl=S.sleep[T],w=water(),
exm=S.workouts.filter(x=>x.d===T).reduce((a,b)=>a+b.min,0),now=new Date(),nh=now.getHours()+now.getMinutes()/60,ps=prayerState(now),SG=segs(),
pr=['fajr','dhuhr','asr','maghrib','isha'],prDone=pr.filter(k=>(S.habits[k]||[]).includes(T)).length,st=Math.min(...pr.map(streak)),
act=S.projects.filter(p=>p.stage<6),rem=act.reduce((a,p)=>a+(p.stage>=1?p.amount/2:p.amount),0),paid=act.reduce((a,p)=>a+(p.stage>=1?p.amount/2:0),0),
near=act.filter(p=>p.due).sort((a,b)=>a.due.localeCompare(b.due))[0],
segH=nh<SG[0][0]?nh+24:nh,seg=SG.findIndex(([s,e])=>segH>=s&&segH<e),pos=seg<0?0:(seg+(segH-SG[seg][0])/(SG[seg][1]-SG[seg][0]))/5*100,
wk=[...Array(7)].map((_,i)=>{const d=addD(T,i-6);return{d,v:HABITS.filter(h=>(S.habits[h[0]]||[]).includes(d)).length}}),en=energy();
const ring=(r,sw,p,c)=>{const C=2*Math.PI*r;return`<circle r="${r}" fill="none" stroke="${c}" stroke-opacity=".16" stroke-width="${sw}"/><circle class="ring" r="${r}" stroke="${c}" stroke-width="${sw}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-Math.min(1,p))}"/>`};
const nextT=tt.filter(t=>!t.done).sort((a,b)=>(a.time||'').localeCompare(b.time||'')).slice(0,4);
const C={
gym:['تمرين اليوم',todayGymHTML().replace(/^<div class="glass"[^>]*>/,'').replace(/<\/div>$/,'')],
rings:['الإنجاز والحلقات',`<div class="hero"><div class="ringwrap"><svg width="150" height="150" viewBox="-75 -75 150 150">${ring(66,12,pct,'#F2C230')}${ring(48,9,w/S.waterGoal,'#5AC8FA')}${ring(35,9,(sl?sl.h:0)/8,'#A78BFA')}${ring(22,9,exm/30,'#7DDB8B')}</svg></div>
<div class="legend"><div><div class="big"><span data-count="${Math.round(pct*100)}">0</span><span class="unit">%</span></div><div class="sub" style="font-size:13px">خلصت ${n(done)} من ${n(tt.length)} مهام</div></div>
<div class="lg"><i style="background:#5AC8FA"></i>الموية<b><span data-count="${w}">0</span><small> من ${n(S.waterGoal)}</small></b></div>
<div class="lg"><i style="background:#A78BFA"></i>النوم<b>${sl?n(sl.h):'—'}<small> ساعة</small></b></div>
<div class="lg"><i style="background:#7DDB8B"></i>التمرين<b><span data-count="${exm}">0</span><small> من 30 د</small></b></div></div></div>`],
timeline:['يومك على الساعة',`<div class="row"><span class="sub sp">يومك على الساعة</span><span class="pill">${PERIODS[Math.max(0,seg)][1]}</span></div>
<div class="tl">${PERIODS.map((p,i)=>`<i class="${i<seg?'past':i===seg?'cur':''}" style="flex:1"></i>`).join('')}<span class="now" style="right:${pos}%">الحين</span></div>
<div class="tll">${PERIODS.map(([k,l])=>{const c=tt.filter(t=>periodOf(t.time)===k&&!t.done).length;return`<span style="flex:1"><b>${n(c)}</b>${l}</span>`}).join('')}</div>`],
prayer:['الصلاة الجاية',`<div class="pw"><div class="pmain"><div class="city">${ic('location')}${esc(LOC.city)}</div><div class="pname">${PNAMES[ps.next]}</div><div class="ptime">${hm(ps.nextAt)}</div><div class="pcd">خلال <b data-cd="${ps.nextAt.getTime()}">${cdTxt(ps.nextAt-now)}</b></div>
${(S.habits[ps.cur]||[]).includes(T)?`<span class="chip">صليت ${PNAMES[ps.cur]} ✓</span>`:`<button class="btn g s" data-a="habit" data-k="${ps.cur}">صليت ${PNAMES[ps.cur]}</button>`}</div>
<div class="plist">${ps.list.map(([k,l,d])=>`<div class="${k===ps.next?'on':''}"><span>${l}</span><b>${hm(d)}</b></div>`).join('')}</div></div>`],
streak:['سلسلة الصلاة',`<div class="row"><div class="sp"><div class="sub" style="font-size:13px">سلسلة الصلاة</div><div class="big" style="margin-top:4px"><span data-count="${st}">0</span><span class="unit"> ${st===1?'يوم':st===2?'يومين':'أيام'} متتالية</span></div></div><div style="text-align:left"><div class="dots">${pr.map(k=>`<i class="${(S.habits[k]||[]).includes(T)?'on':''}"></i>`).join('')}</div><div class="meta" style="justify-content:flex-end">صليت ${n(prDone)} من 5 اليوم</div></div></div>
<div class="badges">${[1,5,14,30,100].map(m=>`<span class="badge ${st>=m?'on':''}"><b>${n(m)}</b>${m===1?'يوم':'يوم'}</span>`).join('')}</div><div class="meta" style="font-size:11px">${st<100?`باقي ${n([1,5,14,30,100].find(m=>m>st)-st)} أيام على الشارة الجاية — بالتشجيع مو بالتأنيب`:'وصلت 100 يوم، الله يثبتك'}</div>`],
energy:['طاقتك اليوم',`<div class="row"><div class="ringwrap"><svg width="78" height="78" viewBox="-39 -39 78 78">${ring(32,8,en.v/100,'#F2C230')}</svg><div class="ringc"><b class="big" style="font-size:22px" data-count="${en.v}">0</b></div></div><div class="sp"><div class="sub" style="font-size:13px">طاقتك اليوم (تقدير)</div><div class="t" style="margin-top:3px">${en.v>=70?'جاهز، يومك يتحمّل شغل ثقيل':en.v>=45?'متوسطة، خفّف الجهد شوي':'ارتاح اليوم وخذها بهدوء'}</div><div class="meta" style="font-size:11px">من نومك وموية اليوم وتمرين آخر يومين</div></div></div>`],
projects:['العملاء والدفعات',`<div class="row"><span class="sub sp">العملاء والدفعات</span>${ic('folio')}</div><div class="kvs">
<div class="kv">شغالة<b data-count="${act.length}">0</b></div><div class="kv">أقرب تسليم<b style="font-size:15px;font-family:TSans">${near?esc(near.title):'—'}</b><span>${near?dueTxt(near.due):''}</span></div></div>
<div class="pay"><div class="kv">استلمت<b><span data-count="${paid}">0</span> <span class="sar">ر.س</span></b></div><div class="kv">متبقي لك<b style="color:var(--gold)"><span data-count="${rem}">0</span> <span class="sar">ر.س</span></b></div></div><div class="bar"><i style="width:${paid+rem?paid/(paid+rem)*100:0}%"></i></div>`],
week:['التزامك هالأسبوع',`<div class="row"><span class="sub sp">التزامك هالأسبوع</span><span class="pill">عبادات وعادات</span></div><div class="bars">${wk.map(x=>`<div><i class="${x.d===T?'today':''}" style="height:4%" data-h="${Math.max(6,x.v/HABITS.length*100)}%"></i><span>${new Date(x.d+'T12:00').toLocaleDateString(DL,{weekday:'short'}).replace('ال','').slice(0,3)}</span></div>`).join('')}</div>`],
next:['الجاي اليوم',`<div class="row"><span class="sub sp">الجاي اليوم</span><button class="btn s l" data-go="tasks">كل المهام</button></div><div style="margin-top:4px">${nextT.map(t=>`<div class="ctask"><button class="chk" data-a="toggle" data-id="${t.id}" aria-label="خلصت"></button><div class="sp t">${esc(t.title)}</div><i class="pr p${t.pr}"></i><span class="tm">${fmtTime(t.time)}</span></div>`).join('')||'<div class="empty">خلصت كل شي، كفو!</div>'}</div>`]};
const D=dash(),ids=[...D.pinned.filter(k=>D.order.includes(k)),...D.order.filter(k=>!D.pinned.includes(k))].filter(k=>C[k]&&(EDIT||!D.hidden.includes(k)));
return`${(()=>{const g=greeting(),hj=hijri(now);
return`<div class="greet"><b>${g.main}</b><span>${g.sub}</span></div>
<div class="toprow"><div class="glass tc"><small>اليوم</small><b>${now.toLocaleDateString(DL,{weekday:'long'})}</b><span>${open?tasksWord(open).replace('عندك ',''):'ما عندك مهام'}</span></div>
<div class="glass tc"><small>التاريخ</small><b>${n(now.getDate())} ${now.toLocaleDateString(DL,{month:'long'})}</b><span>${hj.d} ${hj.m}</span></div>
<div class="glass tc tp" data-a="psheet"><small>الصلاة القادمة</small><b>${PNAMES[ps.next]} <em>${hm(ps.nextAt)}</em></b><span>خلال <i data-cd="${ps.nextAt.getTime()}">${cdTxt(ps.nextAt-now)}</i></span></div></div>`})()}<form class="quick" data-f="quick"><input name="t" placeholder="وش بتسوي اليوم؟" autocomplete="off"><button class="btn g" aria-label="ضيف">${ic('plus')}</button></form>
<div class="row" style="margin:10px 2px 8px"><span class="sub sp">${EDIT?'رتّب لوحتك: ثبّت، حرّك، أو خبّي':'لوحتك'}</span><button class="btn s ${EDIT?'g':'l'}" data-a="edit">${EDIT?'تم':'عدّل اللوحة'}</button></div>
${ids.map((k,i)=>{const hid=D.hidden.includes(k),pin=D.pinned.includes(k);return`<div class="glass ${k==="prayer"?"navy":""} ${EDIT?'editing':''} ${hid?'hid':''}">${EDIT?`<div class="etools"><b class="sp">${C[k][0]}${pin?' · مثبّتة':''}${hid?' · مخفية':''}</b><button class="btn s l" data-a="mv" data-k="${k}" data-v="-1" aria-label="فوق">↑</button><button class="btn s l" data-a="mv" data-k="${k}" data-v="1" aria-label="تحت">↓</button><button class="btn s ${pin?'g':'l'}" data-a="pin" data-k="${k}">${pin?'فك':'ثبّت'}</button><button class="btn s l" data-a="hide" data-k="${k}">${hid?'أظهر':'خبّي'}</button></div>`:''}${C[k][1]}</div>`}).join('')}`},
tasks(){const tt=todayTasks().sort((a,b)=>a.done-b.done||b.pr-a.pr),up=S.tasks.filter(t=>t.date>T&&!t.deleted);
return`<div class="row"><h1 class="sp">المهام</h1><button class="btn g" data-a="newTask">${ic('plus')}</button></div><p class="sub">خلصت ${n(tt.filter(t=>t.done).length)} من ${n(tt.length)} اليوم</p>
<button class="btn w" style="margin:14px 0 4px" data-a="newTask">ضيف مهمة</button><h2>اليوم</h2>${tt.map(t=>taskRow(t,1)).join('')||'<div class="empty">ما فيه شي، استانس</div>'}<h2>بعدين</h2>${up.map(t=>taskRow(t,1)).join('')||'<div class="empty">ما فيه مهام جاية</div>'}`},
health(){const w=water(),taken=S.medLog[T]||[],sl=S.sleep[T],lw=S.weight[S.weight.length-1],pw=S.weight[S.weight.length-2];
return`<h1>الصحة</h1><p class="sub">انتبه لنفسك يا فهد</p><h2>الموية</h2><div class="card"><div class="row"><div class="sp big">${n(w)}<span class="unit"> من ${n(S.waterGoal)} أكواب</span></div><button class="btn s l" data-a="uncup">−</button><button class="btn s g" data-a="cup">+ كوب</button></div>
<div class="cups">${Array.from({length:Math.max(S.waterGoal,w)},(_,i)=>`<button class="cup ${i<w?'on':''}" data-a="setcup" data-v="${i+1}" aria-label="كوب ${i+1}"></button>`).join('')}</div><p class="sub">${w>=S.waterGoal?'كفو! خلصت هدفك 💧':`باقي لك ${n(S.waterGoal-w)} أكواب`}</p></div>
<h2>النوم</h2><div class="card"><div class="row">${ic('moon')}<div class="sp"><div class="big">${sl?n(sl.h):'—'}<span class="unit"> ساعات الليلة</span></div><div class="meta">${sl?`نمت ${fmtTime(sl.from)} وصحيت ${fmtTime(sl.to)}`:'ما سجلت'}</div></div><button class="btn s" data-a="sleep">سجّل</button></div></div>
<h2>الوزن</h2><div class="card"><div class="row">${ic('scale')}<div class="sp"><div class="big">${lw?n(lw.kg):'—'}<span class="unit"> كجم</span></div><div class="meta">${pw?`${lw.kg<=pw.kg?'نزلت':'زدت'} ${n(Math.abs(+(lw.kg-pw.kg).toFixed(1)))} كجم عن آخر مرة`:''}</div></div><button class="btn s" data-a="weight">سجّل وزن</button></div>
<div class="meta" style="margin-top:10px;flex-wrap:wrap">${S.weight.slice(-5).map(x=>`<span class="chip">${new Date(x.d+'T12:00').toLocaleDateString(DL,{day:'numeric',month:'short'})}: ${n(x.kg)}</span>`).join('')}</div></div>
<h2>الأدوية والفيتامينات</h2>${S.meds.map(m=>{const on=taken.includes(m.id);return`<div class="card ${on?'done':''}"><div class="row"><button class="chk ${on?'on':''}" data-a="med" data-id="${m.id}">${on?ic('check',''):''}</button><div class="sp"><div class="t">${esc(m.name)}</div><div class="meta">${ic('pill')}${esc(m.when)}</div></div><button class="btn s l" data-a="delmed" data-id="${m.id}" aria-label="شيل">${ic('trash')}</button></div></div>`}).join('')}<button class="btn l w" data-a="newmed">ضيف دوا أو فيتامين</button>`},
gym(){const td=new Date().getDay(),D=dayPlan(td),wk=S.workouts.filter(w=>w.d>addD(T,-7));
return`<h1>التمارين</h1><p class="sub">قوي وخفيف بالتناوب · الجمعة والسبت راحة</p>
${todayGymHTML(true)}
<div class="grid2"><div class="card"><div class="sub">هالأسبوع</div><div class="big">${n(wk.length)}<span class="unit"> تمارين</span></div></div><div class="card"><div class="sub">المدة</div><div class="big">${n(wk.reduce((a,b)=>a+b.min,0))}<span class="unit"> دقيقة</span></div></div></div>
<h2>جدولك الأسبوعي</h2>${[0,1,2,3,4,5,6].map(i=>{const p=dayPlan(i);return`<div class="card wday ${i===td?'today':''}"><div class="row"><b class="dn">${DAYS[i]}</b><div class="sp"><div class="t">${planTitle(p)}</div><div class="meta">${p.type==='strong'?`${n(S.gym[p.v].length)} تمارين · ${n(45+gymMinutes(S.gym[p.v]))} د تقريباً`:p.type==='light'?'تشيّكها بنفسك، ما نعدّ خطوات':'جسمك يبني نفسه اليوم'}</div></div><button class="btn s l" data-a="editday" data-d="${i}">عدّل</button></div></div>`}).join('')}
<h2>نسخ النادي</h2><div class="seg">${['A','B','C'].map(v=>`<button class="${(window._gv||'A')===v?'on':''}" data-a="gv" data-v="${v}">نسخة ${v}</button>`).join('')}</div>
<div class="card" style="margin-top:10px"><div class="meta">إحماء ${n(WARM)} د · ${n(GYM_SETS)} مجموعات × ${GYM_REPS} · راحة 60-75 ث · تهدئة ${n(COOL)} د · المدة التقديرية <b style="color:var(--gold)">${n(gymMinutes(S.gym[window._gv||'A']))} د</b></div></div>
${S.gym[window._gv||'A'].map((e,i)=>`<div class="card"><div class="row"><span class="exn">${n(i+1)}</span><div class="sp"><div class="t">${esc(e.ar)}</div><div class="meta" dir="ltr" style="justify-content:flex-end">${esc(e.en)}</div></div><span class="chip">${esc(e.m)}</span></div>
<div class="meta" style="margin-top:8px">${n(GYM_SETS)} × ${GYM_REPS} · راحة ${n(e.rest)} ث${S.lastW[e.en]?` · آخر وزن ${n(S.lastW[e.en])} كجم`:''}</div><div class="tip">${esc(e.tip)}</div>
<div class="acts"><span class="meta sp">البديل: ${esc(e.alt.ar)} (${esc(e.alt.en)})</span><button class="btn s l" data-a="swapex" data-v="${window._gv||'A'}" data-i="${i}">بدّل بالبديل</button></div></div>`).join('')}
<p class="safety">ابدأ بأوزان خفيفة واستشر مدرب النادي إذا عندك إصابة</p>`},
session(){const ss=S.sess;if(!ss)return`<h1>ما فيه تمرين شغّال</h1><button class="btn g w" data-go="gym">رجوع للتمارين</button>`;const ex=S.gym[ss.v],tot=ex.length+2,step=ss.i+1;
let body;
if(ss.i<0)body=`<div class="sbig">إحماء</div><div class="sen">Warm-up · ${n(WARM)} min</div><p class="tip" style="font-size:15px">دراجة أو تريدميل خفيف ${n(WARM)} دقايق، وحرّك الكتوف والوركين.</p>`;
else if(ss.i>=ex.length)body=`<div class="sbig">تهدئة</div><div class="sen">Cool-down · ${n(COOL)} min</div><p class="tip" style="font-size:15px">إطالة خفيفة للصدر والظهر والأرجل، وتنفّس بهدوء.</p>`;
else{const e=ex[ss.i],sets=ss.sets[ss.i]||0,resting=ss.restUntil>Date.now();
body=`<div class="smus">${esc(e.m)}</div><div class="sbig">${esc(e.ar)}</div><div class="sen" dir="ltr">${esc(e.en)}</div>
<div class="sgoal">${n(GYM_SETS)} مجموعات × ${GYM_REPS} عدّة</div>
<div class="setdots">${[...Array(GYM_SETS)].map((_,k)=>`<button class="setb ${k<sets?'on':''}" data-a="set" data-k="${k}">${k<sets?ic('check',''):`مجموعة ${n(k+1)}`}</button>`).join('')}</div>
${resting?`<div class="rest">راحة <b data-rest="${ss.restUntil}">${cdTxt(ss.restUntil-Date.now()).replace(/^0:/,'')}</b><button class="btn s l" data-a="skiprest">تخطّى</button></div>`:''}
<div class="wrow2"><label class="sub">الوزن (كجم)</label><button class="btn s l" data-a="w" data-v="-2.5">−</button><b class="wv">${n(ss.w[ss.i]??S.lastW[e.en]??0)}</b><button class="btn s l" data-a="w" data-v="2.5">+</button></div>
<div class="tip">${esc(e.tip)}</div><div class="meta" style="margin-top:6px">الجهاز مشغول؟ ${esc(e.alt.ar)} (${esc(e.alt.en)})</div>`}
return`<div class="row"><span class="sub sp">نادي ${ss.v} · خطوة ${n(step)} من ${n(tot)}</span><button class="btn s l" data-a="endsess">إنهاء</button></div><div class="bar"><i style="width:${step/tot*100}%"></i></div>
<div class="glass sess">${body}</div><div class="row" style="gap:8px">${ss.i>-1?`<button class="btn l" data-a="prev">السابق</button>`:''}<button class="btn g sp" data-a="next">${ss.i>=ex.length?'خلصت التمرين ✓':'التالي'}</button></div>
<p class="safety">ابدأ بأوزان خفيفة واستشر مدرب النادي إذا عندك إصابة</p>`},
ibada(){const sub=window._ib||'today';
const segs=`<div class="seg">${[['today','اليوم'],['adhkar','الأذكار'],['tasbeeh','تسبيح'],['khatma','ختمة']].map(([k,l])=>`<button class="${sub===k?'on':''}" data-a="ib" data-v="${k}">${l}</button>`).join('')}</div>`;
return`<h1>العبادات والعادات</h1>${segs}${IB[sub]()}`},
settings(){return`<h1>الإعدادات</h1><p class="sub">كل البيانات محفوظة على جوالك بس (localStorage)</p><div class="card" style="margin-top:14px"><div class="t">البيانات الحالية تجريبية</div><p class="sub" style="margin:6px 0 12px">العملاء والمهام أمثلة وهمية للعرض. تقدر ترجعها أو تبدأ من الصفر.</p><button class="btn w" data-a="reset">رجّع البيانات التجريبية</button><button class="btn l w" style="margin-top:8px" data-a="wipe">ابدأ من الصفر</button></div><div class="card"><div class="t">قريباً (يحتاج تطبيق آيفون أصلي)</div><p class="sub" style="margin-top:6px;line-height:1.8">• ودجت للشاشة الرئيسية وشاشة القفل<br>• Live Activities وDynamic Island<br>• مزامنة تلقائية مع Apple Health للموية والنوم والتمارين</p></div><div class="card"><div class="t">هدف الموية</div><div class="row" style="margin-top:8px"><button class="btn s l" data-a="goal" data-v="-1">−</button><div class="sp big" style="text-align:center">${n(S.waterGoal)}</div><button class="btn s l" data-a="goal" data-v="1">+</button></div></div>`}};
let ANIM=true;function animate(){const v=document.getElementById('view'),go=()=>{v.querySelectorAll('.ring').forEach(r=>r.style.strokeDashoffset=r.dataset.off);v.querySelectorAll('[data-h]').forEach(b=>b.style.height=b.dataset.h);v.querySelectorAll('[data-count]').forEach(e=>{const to=+e.dataset.count;if(!ANIM||matchMedia('(prefers-reduced-motion: reduce)').matches){e.textContent=n(to);return}const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1200),ez=1-Math.pow(1-k,3);e.textContent=n(Math.round(to*ez));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})};if(ANIM)requestAnimationFrame(()=>requestAnimationFrame(go));else{v.querySelectorAll('.ring,[data-h]').forEach(e=>e.style.transition='none');go()}ANIM=false}
function render(){ensure();document.getElementById('view').innerHTML=V[tab]();document.getElementById('tabs').innerHTML=TABS.map(([k,l,i])=>`<button class="tab ${k===tab?'on':''}" data-go="${k}">${ic(i)}${l}</button>`).join('');
document.querySelector('.demo').style.display=S.demo===false?'none':'';animate()}
function go(k){EDIT=false;tab=k;ANIM=true;location.hash=k;render();scrollTo(0,0)}
function sheet(title,fields,onOk){const s=document.getElementById('sheet');s.innerHTML=`<form class="in"><h2 style="margin:0 4px 4px">${title}</h2>${fields}<div class="row"><button class="btn g sp">حفظ</button><button type="button" class="btn l" data-close>إلغاء</button></div></form>`;s.classList.remove('hidden');
const f=s.querySelector('form');setTimeout(()=>f.querySelector('input')?.focus(),50);f.onsubmit=e=>{e.preventDefault();if(onOk(Object.fromEntries(new FormData(f)))!==false){s.classList.add('hidden');save()}};s.querySelector('[data-close]').onclick=()=>s.classList.add('hidden');s.onclick=e=>{if(e.target===s)s.classList.add('hidden')}}
const find=id=>S.tasks.find(t=>t.id==id);
const A={toggle(d){const t=find(d.id);t.done=!t.done;if(t.done)cheer(todayTasks().every(x=>x.done)?'day_done':'task_done')},later(d){find(d.id).date=addD(T,1);toast('تأجلت لبكرة')},del(d){S.tasks=S.tasks.filter(t=>t.id!=d.id);toast('انشالت')},
newTask(){sheet('ضيف مهمة',`<input name="title" required placeholder="وش المهمة؟"><div class="grid2"><input name="time" type="time" lang="en"><select name="pr"><option value="3">مهمة</option><option value="2" selected>متوسطة</option><option value="1">عادية</option></select></div><select name="date"><option value="${T}">اليوم</option><option value="${addD(T,1)}">بكرة</option></select>`,v=>{S.tasks.push({id:S.nid++,title:v.title,time:v.time,pr:+v.pr,date:v.date,done:false});toast('تضافت')});return 1},
cup(){S.water[T]=water()+1;toast('بالعافية 💧')},uncup(){S.water[T]=Math.max(0,water()-1)},setcup(d){S.water[T]=water()==d.v?d.v-1:+d.v},
sleep(){sheet('سجّل نومك',`<label class="sub">نمت الساعة</label><input name="from" type="time" value="23:30"><label class="sub">صحيت الساعة</label><input name="to" type="time" value="06:00">`,v=>{const[a,b]=[v.from,v.to].map(x=>{const[h,m]=x.split(':');return+h*60+ +m});let m=b-a;if(m<0)m+=1440;S.sleep[T]={from:v.from,to:v.to,h:+(m/60).toFixed(1)}});return 1},
weight(){sheet('سجّل وزنك',`<input name="kg" type="number" step="0.1" inputmode="decimal" required placeholder="كجم" value="${S.weight.at(-1)?.kg||''}">`,v=>{S.weight=S.weight.filter(x=>x.d!==T);S.weight.push({d:T,kg:+v.kg});toast('تسجّل')});return 1},
med(d){const l=S.medLog[T]=S.medLog[T]||[];const i=l.indexOf(+d.id);i<0?l.push(+d.id):l.splice(i,1)},delmed(d){S.meds=S.meds.filter(m=>m.id!=d.id)},
newmed(){sheet('ضيف دوا أو فيتامين',`<input name="name" required placeholder="الاسم"><input name="when" placeholder="متى؟ مثل: بعد الفطور">`,v=>{S.meds.push({id:S.nid++,name:v.name,when:v.when||'يومي'})});return 1},
logw(){sheet('سجّل تمرين',`<input name="type" required value="${esc(S.workoutPlan[new Date().getDay()])}" placeholder="نوع التمرين"><label class="sub">المدة (دقائق)</label><input name="min" type="number" inputmode="numeric" required value="45" min="1">`,v=>{S.workouts.push({d:T,type:v.type,min:+v.min});toast('الله يعطيك العافية 💪')});return 1},
plan(d){sheet('تمرين يوم '+['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][d.d],`<input name="p" value="${esc(S.workoutPlan[d.d])}">`,v=>{S.workoutPlan[d.d]=v.p||'راحة'});return 1},
habit(d){const l=S.habits[d.k]=S.habits[d.k]||[];const i=l.indexOf(T);if(i<0){l.push(T);cheer(habitCat(d.k));checkMilestone(d.k)}else l.splice(i,1);const sh=document.getElementById('sheet');if(!sh.classList.contains('hidden')&&sh.querySelector('.prow'))setTimeout(()=>{sh.querySelector('.in').innerHTML=prayerSheetHTML()+'<button class="btn l w" onclick="document.getElementById(\'sheet\').classList.add(\'hidden\')">إغلاق</button>'},0)},
stage(d){const p=S.projects.find(p=>p.id==d.id);p.stage=Math.max(0,Math.min(6,p.stage+ +d.v));if(p.stage===6)toast('مبروك! خلص المشروع 🎉')},delproj(d){if(confirm('أكيد تبي تشيل المشروع؟'))S.projects=S.projects.filter(p=>p.id!=d.id)},
newproj(){sheet('مشروع جديد',`<input name="client" required placeholder="اسم العميل"><input name="title" required placeholder="وش المشروع؟"><input name="amount" type="number" inputmode="numeric" placeholder="المبلغ (ر.س)">`,v=>{S.projects.unshift({id:S.nid++,client:v.client,title:v.title,amount:+v.amount||0,stage:0,due:addD(T,14)})});return 1},
psheet(){infoSheet(prayerSheetHTML());return 1},
light(){S.light[T]=!S.light[T];if(S.light[T]){S.workouts.push({d:T,type:'مشي 5000 خطوة',min:40});cheer('walk_done')}else S.workouts=S.workouts.filter(w=>!(w.d===T&&w.type==='مشي 5000 خطوة'))},
walkstart(){S.walk[T]={start:Date.now()}},walkstop(){const w=S.walk[T];w.min=Math.max(1,Math.round((Date.now()-w.start)/6e4));w.done=true;S.workouts.push({d:T,type:'مشي',min:w.min});cheer('walk_done')},
walkdone(){const w=S.walk[T]=S.walk[T]||{};if(w.done){w.done=false;S.workouts=S.workouts.filter(x=>!(x.d===T&&x.type==='مشي'))}else{w.done=true;w.min=w.start?Math.max(1,Math.round((Date.now()-w.start)/6e4)):45;S.workouts.push({d:T,type:'مشي',min:w.min});cheer('walk_done')}},
startsess(d){if(!S.sess||S.sess.d!==T||S.sess.v!==d.v)S.sess={d:T,v:d.v,i:-1,sets:{},w:{},start:Date.now(),restUntil:0};go('session');return 1},
set(d){const ss=S.sess,e=S.gym[ss.v][ss.i],k=+d.k,c=ss.sets[ss.i]||0;if(k<c){ss.sets[ss.i]=k;return}ss.sets[ss.i]=k+1;ss.w[ss.i]=ss.w[ss.i]??S.lastW[e.en]??0;S.lastW[e.en]=ss.w[ss.i];
 if(k+1<GYM_SETS){ss.restUntil=Date.now()+e.rest*1000;navigator.vibrate&&navigator.vibrate(10)}else{ss.restUntil=0;navigator.vibrate&&navigator.vibrate([15,40,15])}},
skiprest(){S.sess.restUntil=0},w(d){const ss=S.sess,e=S.gym[ss.v][ss.i];ss.w[ss.i]=Math.max(0,+(((ss.w[ss.i]??S.lastW[e.en]??0)+ +d.v).toFixed(1)));S.lastW[e.en]=ss.w[ss.i]},
next(){const ss=S.sess,L=S.gym[ss.v].length;ss.restUntil=0;if(ss.i>=L){const min=Math.max(1,Math.round((Date.now()-ss.start)/6e4));S.workouts.push({d:T,type:'نادي '+ss.v,min});S.sess=null;cheer('gym_done');tab='gym';location.hash='gym'}else ss.i++;scrollTo(0,0)},
prev(){S.sess.i=Math.max(-1,S.sess.i-1);S.sess.restUntil=0},endsess(){if(confirm('تنهي التمرين؟ بيتسجّل اللي سويته.')){const ss=S.sess,min=Math.max(1,Math.round((Date.now()-ss.start)/6e4));if(Object.keys(ss.sets).length)S.workouts.push({d:T,type:'نادي '+ss.v,min});S.sess=null;tab='gym';location.hash='gym'}},
gv(d){window._gv=d.v},swapex(d){const e=S.gym[d.v][d.i],a=e.alt;S.gym[d.v][d.i]={...e,ar:a.ar,en:a.en,alt:{ar:e.ar,en:e.en}};toast('تبدّل التمرين')},
editday(d){const p=dayPlan(d.d);sheet('خطة يوم '+DAYS[d.d],`<select name="t"><option value="strong" ${p.type==='strong'?'selected':''}>قوي: مشي 45 د + نادي</option><option value="light" ${p.type==='light'?'selected':''}>خفيف: مشي 5000 خطوة</option><option value="rest" ${p.type==='rest'?'selected':''}>راحة</option></select><select name="v">${['A','B','C'].map(v=>`<option ${p.v===v?'selected':''}>${v}</option>`).join('')}</select><label class="sub">بدّله مع يوم:</label><select name="sw"><option value="">—</option>${DAYS.map((x,i)=>i==d.d?'':`<option value="${i}">${x}</option>`).join('')}</select>`,v=>{if(v.sw!==''){const o=S.gymPlan[v.sw];S.gymPlan[v.sw]=S.gymPlan[d.d];S.gymPlan[d.d]=o}else S.gymPlan[d.d]=v.t==='strong'?{type:'strong',v:v.v}:{type:v.t}});return 1},
ib(d){window._ib=d.v},am(d){window._am=d.v},
dtap(){const m=window._am||adhMode(),list=ADHKAR.filter(x=>x.type===0||x.type===(m==='morning'?1:2)),key=T+m+ADHKAR_VER,P=S.adhP[key]=S.adhP[key]&&S.adhP[key].i<=list.length?S.adhP[key]:{i:0,left:list[0].count};navigator.vibrate&&navigator.vibrate(6);if(!list[P.i].count){P.up=(P.up||0)+1;return}P.left--;if(P.left<=0){P.i++;if(P.i>=list.length){if(!has('adhkar'))(S.habits.adhkar=S.habits.adhkar||[]).push(T);cheer('adhkar')}else P.left=list[P.i].count}},
dskip(){const m=window._am||adhMode(),list=ADHKAR.filter(x=>x.type===0||x.type===(m==='morning'?1:2)),key=T+m+ADHKAR_VER,P=S.adhP[key]=S.adhP[key]&&S.adhP[key].i<=list.length?S.adhP[key]:{i:0,left:list[0].count};P.i=Math.min(list.length,P.i+1);P.up=0;if(P.i<list.length)P.left=list[P.i].count},
dprev(){const m=window._am||adhMode(),list=ADHKAR.filter(x=>x.type===0||x.type===(m==='morning'?1:2)),key=T+m+ADHKAR_VER,P=S.adhP[key]=S.adhP[key]&&S.adhP[key].i<=list.length?S.adhP[key]:{i:0,left:list[0].count};P.i=Math.max(0,P.i-1);P.up=0;P.left=list[P.i].count},
adhreset(){delete S.adhP[T+(window._am||adhMode())+ADHKAR_VER]},
tsd(d){S.tas.d=+d.v;S.tas.count=0},tst(d){S.tas.target=+d.v;S.tas.count=0},tsr(){S.tas.count=0},
tstc(){sheet('عدد مخصص',`<input name="n" type="number" inputmode="numeric" min="1" value="${S.tas.target}">`,v=>{S.tas.target=Math.max(1,+v.n||33);S.tas.count=0});return 1},
tstap(){const t=S.tas;t.count++;t.total[T]=(t.total[T]||0)+1;if(t.count===t.target){navigator.vibrate&&navigator.vibrate([20,50,20]);cheer('adhkar')}else navigator.vibrate&&navigator.vibrate(5)},
chfajr(d){const day=addD(S.ch.fajr.start,+d.i);if(day>T)return 1;const l=S.habits.fajr=S.habits.fajr||[],i=l.indexOf(day);if(i<0){l.push(day);const st=S.ch.fajr.start,c=[...Array(30)].filter((_,j)=>l.includes(addD(st,j))).length;c>=30?cheer('streak.30',true):cheer('fajr')}else l.splice(i,1)},
chfajrnew(){S.ch.fajr.start=T},
qtog(d){const q=S.ch.quran,i=+d.i;if(q.done[i])delete q.done[i];else{q.done[i]=T;if(!has('wird'))(S.habits.wird=S.habits.wird||[]).push(T);const tot=q.mode==='juz'?30:60;Object.keys(q.done).length>=tot?cheer('khatma_done',true):cheer('hizb_done')}},
qmode(){const q=S.ch.quran,nd={};if(q.mode==='juz'){for(const k in q.done){nd[2*k]=q.done[k];nd[2*k+1]=q.done[k]}q.mode='hizb'}else{for(let j=0;j<30;j++)if(q.done[2*j]&&q.done[2*j+1])nd[j]=q.done[2*j+1];q.mode='juz'}q.done=nd;toast(q.mode==='juz'?'صار وردك جزء باليوم':'صار وردك حزب باليوم')},
qnew(){const q=S.ch.quran;q.archive.push({mode:q.mode,done:q.done,end:T});q.count++;q.done={}},
edit(){EDIT=!EDIT;render();return 1},mv(d){const o=dash().order,i=o.indexOf(d.k),j=i+ +d.v;if(j>=0&&j<o.length){[o[i],o[j]]=[o[j],o[i]]}},
pin(d){const p=dash().pinned,i=p.indexOf(d.k);i<0?p.push(d.k):p.splice(i,1)},hide(d){const h=dash().hidden,i=h.indexOf(d.k);i<0?h.push(d.k):h.splice(i,1)},
filt(d){window._f=+d.v;render();return 1},goal(d){S.waterGoal=Math.max(1,S.waterGoal+ +d.v)},
reset(){if(confirm('ترجّع البيانات التجريبية؟ بيروح اللي سجلته.')){S=seed();toast('رجعت البيانات التجريبية')}},
wipe(){if(confirm('تمسح كل شي وتبدأ من الصفر؟')){const s=seed();S={...s,demo:false,tasks:[],projects:[],weight:[],meds:[],water:{},sleep:{},workouts:[],medLog:{},habits:{}};toast('بدينا من الصفر')}}};
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a){e.stopPropagation();const was=a.classList.contains('on');if(['toggle','habit','med','stage'].includes(a.dataset.a)&&!was&&!(a.dataset.v==-1))burst(e.clientX,e.clientY);if(!A[a.dataset.a](a.dataset))save();return}const g=e.target.closest('[data-go]');if(g&&!EDIT)go(g.dataset.go)});
document.addEventListener('submit',e=>{if(e.target.dataset.f==='quick'){e.preventDefault();const v=e.target.t.value.trim();if(!v)return;const h=new Date();S.tasks.push({id:S.nid++,title:v,time:`${String(h.getHours()).padStart(2,'0')}:${String(h.getMinutes()).padStart(2,'0')}`,pr:2,date:T,done:false});save();toast('تضافت ✓')}});
document.querySelector('.top .row').insertAdjacentHTML('beforeend',`<button class="btn s l" style="margin-inline-start:8px;padding:6px" data-go="settings" aria-label="الإعدادات">${ic('gear')}</button>`);
document.querySelector('.top .demo').onclick=()=>go('settings');
setInterval(()=>{if(tab==='home'&&!EDIT&&document.getElementById('sheet').classList.contains('hidden')&&document.activeElement.tagName!=='INPUT')render()},30000);
setInterval(()=>{document.querySelectorAll('[data-up]').forEach(e=>e.textContent=cdTxt(Date.now()-+e.dataset.up));document.querySelectorAll('[data-rest]').forEach(e=>{const ms=+e.dataset.rest-Date.now();if(ms<=0){navigator.vibrate&&navigator.vibrate([15,40,15]);S.sess&&(S.sess.restUntil=0);render()}else e.textContent=cdTxt(ms).replace(/^0:/,'')});document.querySelectorAll('[data-cd]').forEach(e=>{const ms=+e.dataset.cd-Date.now();if(ms<=0&&tab==='home'&&!EDIT)render();else e.textContent=cdTxt(ms)})},1000);
render();locate();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js',{scope:'./'});
