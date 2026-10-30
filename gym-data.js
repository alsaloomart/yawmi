// برنامج النادي: 3 نسخ لجسم كامل بالأجهزة (مبتدئ-متوسط)، 3 مجموعات × 10-12، راحة 60-75 ث
const GYM_DEFAULT={
A:[{ar:'دفع الصدر بالجهاز',en:'Chest Press Machine',m:'صدر',rest:75,tip:'ظهرك ملزّق بالمسند، وادفع بدون ما تقفل الكوع.',alt:{ar:'ضغط دمبل على بنش',en:'Dumbbell Bench Press'}},
 {ar:'سحب أرضي بالكيبل',en:'Seated Cable Row',m:'ظهر',rest:75,tip:'صدرك مرفوع، اسحب لبطنك وقرّب لوحي الكتف.',alt:{ar:'سحب بالجهاز',en:'Seated Row Machine'}},
 {ar:'دفع الأرجل',en:'Leg Press',m:'أرجل',rest:75,tip:'رجولك بعرض الكتف، انزل لين الركبة 90 درجة ولا تقفلها فوق.',alt:{ar:'سكوات بالسميث',en:'Smith Machine Squat'}},
 {ar:'ضغط أكتاف بالجهاز',en:'Shoulder Press Machine',m:'أكتاف',rest:60,tip:'المقبض عند مستوى الذقن، وادفع فوق بهدوء.',alt:{ar:'ضغط دمبل جالس',en:'Seated Dumbbell Press'}}],
B:[{ar:'دفع صدر مائل بالجهاز',en:'Incline Chest Press Machine',m:'صدر',rest:75,tip:'نزّل ببطء ثانيتين، ولا ترفع كتوفك.',alt:{ar:'ضغط دمبل مائل',en:'Incline Dumbbell Press'}},
 {ar:'سحب أمامي',en:'Lat Pulldown',m:'ظهر',rest:75,tip:'اسحب البار لأعلى صدرك، لا ترجع بجسمك لورا كثير.',alt:{ar:'عقلة بالمساعدة',en:'Assisted Pull-up Machine'}},
 {ar:'ثني الأرجل جالس',en:'Seated Leg Curl',m:'أرجل',rest:60,tip:'خلّ الحركة كاملة وارجع ببطء.',alt:{ar:'ثني الأرجل منبطح',en:'Lying Leg Curl'}},
 {ar:'جهاز البطن',en:'Ab Crunch Machine',m:'بطن',rest:60,tip:'شد بطنك وانفخ وأنت نازل، لا تسحب برقبتك.',alt:{ar:'كرنش على الأرض',en:'Floor Crunch'}}],
C:[{ar:'فراشة الصدر',en:'Pec Deck (Fly Machine)',m:'صدر',rest:60,tip:'الكوع منثني شوي، وضمّ قدامك بهدوء.',alt:{ar:'تفتيح بالكيبل',en:'Cable Chest Fly'}},
 {ar:'سحب بالجهاز بقبضة ضيقة',en:'Seated Row Machine (close grip)',m:'ظهر',rest:75,tip:'ثبّت صدرك على المسند واسحب بالكوع.',alt:{ar:'سحب دمبل بيد وحدة',en:'One-arm Dumbbell Row'}},
 {ar:'مد الأرجل',en:'Leg Extension',m:'أرجل',rest:60,tip:'ارفع لين تستقيم الرجل وثبّت ثانية فوق.',alt:{ar:'دفع الأرجل',en:'Leg Press'}},
 {ar:'رفرفة جانبي بالجهاز',en:'Lateral Raise Machine',m:'أكتاف',rest:60,tip:'وزن خفيف، ارفع لمستوى الكتف بس.',alt:{ar:'رفرفة دمبل جانبي',en:'Dumbbell Lateral Raise'}}]};
const GYM_SETS=3,GYM_REPS='10-12',SET_SEC=40,WARM=3,COOL=2,SWITCH=60;
// تقدير المدة: إحماء + لكل تمرين (3 مجموعات × 40ث + راحتين + دقيقة تنقّل) + تهدئة
function gymMinutes(v){return Math.round(WARM+COOL+v.reduce((a,e)=>a+(GYM_SETS*SET_SEC+(GYM_SETS-1)*e.rest+SWITCH)/60,0))}
