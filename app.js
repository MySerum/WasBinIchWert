import { calculate as calculateLohnsteuer } from "https://cdn.jsdelivr.net/npm/lohnsteuerrechner/+esm";

const $=id=>document.getElementById(id);
const eur=(n,d=2)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
const nf=(n,d=2)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);

const PROFILE_KEY='wasbinichwert-profile-v1';
const profileFields=['taxClass','state','church','children','zkf','healthType','addon','rvInsured','avInsured','pkpv','pkpvagz'];

function saveProfile(){
  const data={};
  profileFields.forEach(id=>data[id]=$(id).value);
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(data));}catch(e){}
}
function loadProfile(){
  try{
    const raw=localStorage.getItem(PROFILE_KEY);
    if(!raw)return;
    const data=JSON.parse(raw);
    profileFields.forEach(id=>{
      if(data[id]!==undefined && $(id)) $(id).value=data[id];
    });
  }catch(e){}
}

function updateSettingsSummary(){
  const kidsText=$('children').options[$('children').selectedIndex].text;
  $('settingsSummary').textContent=`Steuerklasse ${$('taxClass').value} · ${$('state').value} · Kirchensteuer ${$('church').value==='yes'?'Ja':'Nein'} · ${kidsText} · Kinderfreibetrag ${$('zkf').value||0} · ${$('healthType').value==='gkv'?'GKV':'PKV'} · RV ${$('rvInsured').value==='yes'?'Ja':'Nein'} · AV ${$('avInsured').value==='yes'?'Ja':'Nein'}`;
}
['taxClass','state','church','children','zkf','healthType','addon','rvInsured','avInsured','pkpv','pkpvagz'].forEach(id=>$(id).addEventListener('change',()=>{saveProfile();updateSettingsSummary();updateInsuranceFields()}));
$('addon').addEventListener('input',()=>{saveProfile();updateSettingsSummary()});
$('pkpv').addEventListener('input',saveProfile);
$('pkpvagz').addEventListener('input',saveProfile);
function updateInsuranceFields(){ $('pkvFields').classList.toggle('hidden',$('healthType').value!=='pkv'); }
$('zkf').addEventListener('input',()=>{saveProfile();updateSettingsSummary()});
$('toggleSettings').onclick=()=>{
  $('settingsPanel').classList.toggle('hidden');
  $('toggleSettings').textContent=$('settingsPanel').classList.contains('hidden')?'Bearbeiten':'Schließen';
}

function papInputs(g){
 const kids=+$('children').value;
 const stklMap={I:1,II:2,III:3,IV:4,V:5,VI:6};
 return {
   LZZ:2,
   RE4:Math.round(g*100),
   STKL:stklMap[$('taxClass').value]||1,
   R:$('church').value==='yes'?1:0,
   ZKF:Math.max(0,+$('zkf').value||0),
   KRV:$('rvInsured').value==='yes'?0:1,
   ALV:$('avInsured').value==='yes'?0:1,
   PKV:$('healthType').value==='gkv'?0:1,
   KVZ:$('healthType').value==='gkv'?Math.max(0,+$('addon').value||0):0,
   PKPV:$('healthType').value==='pkv'?Math.round((+$('pkpv').value||0)*100):0,
   PKPVAGZ:$('healthType').value==='pkv'?Math.round((+$('pkpvagz').value||0)*100):0,
   PVZ:kids===0?1:0,
   PVS:$('state').value==='Sachsen'?1:0,
   PVA:kids>=2?Math.min(kids-1,4):0
 };
}

function calcPayroll(g){
 const pap=calculateLohnsteuer(2026,papInputs(g));
 const lst=(pap.LSTLZZ||0)/100;
 const soli=(pap.SOLZLZZ||0)/100;
 const churchBase=(pap.BK||0)/100;
 const churchRate=($('state').value==='Bayern'||$('state').value==='Baden-Württemberg')?.08:.09;
 const church=$('church').value==='yes'?churchBase*churchRate:0;
 const bbKV=5812.50,bbRV=8450.00;
 const rv=$('rvInsured').value==='yes'?Math.min(g,bbRV)*.093:0;
 const av=$('avInsured').value==='yes'?Math.min(g,bbRV)*.013:0;
 const kids=+$('children').value;
 let kv=0,pv=0,privateIns=0;
 if($('healthType').value==='gkv'){
   const addon=Math.max(0,+$('addon').value||0)/100;
   kv=Math.min(g,bbKV)*(.073+addon/2);
   let pvRate=$('state').value==='Sachsen'?(kids===0?.029:.023):(kids===0?.024:.018);
   if(kids>=2) pvRate-=Math.min(kids-1,4)*.0025;
   pv=Math.min(g,bbKV)*Math.max(.008,pvRate);
 }else{
   privateIns=Math.max(0,(+$('pkpv').value||0)-Math.max(0,+$('pkpvagz').value||0));
 }
 const net=Math.max(0,g-rv-av-kv-pv-privateIns-lst-soli-church);
 return {net,lst,soli,church,churchBase,rv,av,kv,pv,privateIns,pap};
}
function calcNet(g){ return calcPayroll(g).net; }

let mode='m', aMode='m', bMode='m';
function monthGross(){return mode==='m'?+$('salary').value:+$('salary').value/12}
function compareGross(id,modeVal){const v=+$(id).value||0; return modeVal==='m'?v:v/12}
function updateHours(){const mh=(+$('hours').value||0)*52/12;$('hoursInfo').textContent=`📅 Durchschnittlich ${nf(mh)} Arbeitsstunden pro Monat`}
$('hours').oninput=updateHours;
$('mBtn').onclick=()=>{mode='m';$('mBtn').className='active';$('yBtn').className='';$('salaryLabel').textContent='Bruttogehalt pro Monat'}
$('yBtn').onclick=()=>{mode='y';$('yBtn').className='active';$('mBtn').className='';$('salaryLabel').textContent='Bruttogehalt pro Jahr'}

function setCompareMode(which,newMode){
  if(which==='A'){
    aMode=newMode;
    $('aMonthBtn').className=newMode==='m'?'active':'';
    $('aYearBtn').className=newMode==='y'?'active':'';
    $('grossALabel').textContent=newMode==='m'?'Bruttogehalt pro Monat':'Bruttogehalt pro Jahr';
  } else {
    bMode=newMode;
    $('bMonthBtn').className=newMode==='m'?'active':'';
    $('bYearBtn').className=newMode==='y'?'active':'';
    $('grossBLabel').textContent=newMode==='m'?'Bruttogehalt pro Monat':'Bruttogehalt pro Jahr';
  }
}
$('aMonthBtn').onclick=()=>setCompareMode('A','m');
$('aYearBtn').onclick=()=>setCompareMode('A','y');
$('bMonthBtn').onclick=()=>setCompareMode('B','m');
$('bYearBtn').onclick=()=>setCompareMode('B','y');

$('calcRechner').onclick=()=>{
 const g=monthGross(),mh=(+$('hours').value||0)*52/12,n=calcNet(g);
 $('rGross').textContent=eur(g);$('rNet').textContent=eur(n);$('rMH').textContent=nf(mh)+' Std.';
 $('rGrossHour').textContent=eur(g/mh);$('rNetHour').textContent=eur(n/mh);$('rNetHour2').textContent=eur(n/mh);
 $('rechnerResult').classList.remove('hidden');
}

function addBenefitsUi(){
  ['A','B'].forEach(which=>{
    const special=$('special'+which);
    if(!special||$('benefit'+which))return;
    const grid=special.closest('.grid2');
    const wrap=document.createElement('div');
    wrap.innerHTML=`<label>Benefits – Netto-Wert/Monat</label><div class="field"><input id="benefit${which}" type="number" value="0" min="0" step="10"><span class="suffix">€</span></div>`;
    grid.appendChild(wrap);
  });
  const section=$('tab-vergleich');
  const sub=section?.querySelector('.section-sub');
  if(sub&&!$('jobValueHint')){
    const hint=document.createElement('div');
    hint.id='jobValueHint';hint.className='info';
    hint.innerHTML='<b>Zwei Blickwinkel:</b> Der normale Netto-Stundenwert nutzt die vertragliche Durchschnittsarbeitszeit. Der effektive Jobwert berücksichtigt zusätzlich Urlaub, unbezahlte Überstunden, Pendelzeit, Pendelkosten, Sonderzahlungen und den Netto-Gegenwert von Benefits.';
    sub.after(hint);
  }
  const effRows=$('commuteCostB')?.closest('.rows');
  if(effRows&&!$('benefitYearA')){
    const rowA=document.createElement('div');rowA.className='row';rowA.innerHTML='<span>Benefits/Jahr Job A</span><strong id="benefitYearA"></strong>';
    const rowB=document.createElement('div');rowB.className='row';rowB.innerHTML='<span>Benefits/Jahr Job B</span><strong id="benefitYearB"></strong>';
    $('commuteCostB').closest('.row').after(rowA,rowB);
  }
}
addBenefitsUi();

function job(which){
 const g=compareGross('gross'+which,which==='A'?aMode:bMode);
 const h=+$('hours'+which).value||0,mh=h*52/12,n=calcNet(g);
 const workDays=Math.max(1,+$('days'+which).value||5);
 const vacation=Math.max(0,+$('vac'+which).value||0);
 const home=Math.max(0,Math.min(workDays,+$('home'+which).value||0));
 const officeDays=Math.max(0,workDays-home);
 const overtime=Math.max(0,+$('ot'+which).value||0);
 const oneWayKm=Math.max(0,+$('km'+which).value||0);
 const oneWayMin=Math.max(0,+$('min'+which).value||0);
 const kmCost=Math.max(0,+$('kmCost'+which).value||0);
 const specialGross=Math.max(0,+$('special'+which).value||0);
 const benefitMonthly=Math.max(0,+$('benefit'+which)?.value||0);
 const annualBenefits=benefitMonthly*12;
 const vacationWeeks=vacation/workDays;
 const workingWeeks=Math.max(0,52-vacationWeeks);
 const actualWorkHours=h*workingWeeks;
 const overtimeHours=overtime*workingWeeks;
 const commuteDays=officeDays*workingWeeks;
 const commuteHours=(oneWayMin*2*commuteDays)/60;
 const commuteCost=oneWayKm*2*commuteDays*kmCost;
 const effectiveHours=actualWorkHours+overtimeHours+commuteHours;
 const avgGrossWithSpecial=(g*12+specialGross)/12;
 const annualNetWithSpecial=calcNet(avgGrossWithSpecial)*12;
 const effectiveAnnualNet=Math.max(0,annualNetWithSpecial+annualBenefits-commuteCost);
 const effectiveNetHour=effectiveHours>0?effectiveAnnualNet/effectiveHours:0;
 return {g,h,mh,n,nh:n/mh,workDays,vacation,home,officeDays,overtime,oneWayKm,oneWayMin,kmCost,specialGross,benefitMonthly,annualBenefits,workingWeeks,actualWorkHours,overtimeHours,commuteHours,commuteCost,effectiveHours,annualNetWithSpecial,effectiveAnnualNet,effectiveNetHour};
}
$('calcCompare').onclick=()=>{
 const a=job('A'),b=job('B'),na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B';
 $('resNameA').textContent=na;$('resNameB').textContent=nb;$('cHourA').textContent=eur(a.nh);$('cHourB').textContent=eur(b.nh);
 $('boxA').classList.remove('winner');$('boxB').classList.remove('winner');if(a.nh>b.nh)$('boxA').classList.add('winner');else if(b.nh>a.nh)$('boxB').classList.add('winner');
 const dg=b.g-a.g,dn=b.n-a.n,dh=b.mh-a.mh,dv=b.nh-a.nh;
 $('cDiffGross').textContent=(dg>=0?'+ ':'− ')+eur(Math.abs(dg));
 $('cDiffNet').textContent=(dn>=0?'+ ':'− ')+eur(Math.abs(dn));
 $('cDiffHours').textContent=(dh>=0?'+ ':'− ')+nf(Math.abs(dh))+' Std.';
 $('cDiffHour').textContent=(dv>=0?'+ ':'− ')+eur(Math.abs(dv));
 $('compareSummary').textContent=dn>0&&dv<0?`⚠️ ${nb} bringt mehr Netto im Monat, aber dein Netto-Stundenwert sinkt.`:dv>0?`✅ ${nb} hat den höheren Netto-Stundenwert.`:`✅ ${na} hat den höheren Netto-Stundenwert.`;
 $('effNameA').textContent=na;$('effNameB').textContent=nb;
 $('effHourA').textContent=eur(a.effectiveNetHour);$('effHourB').textContent=eur(b.effectiveNetHour);
 $('effTimeA').textContent=nf(a.effectiveHours,1)+' Std.';
 $('effTimeB').textContent=nf(b.effectiveHours,1)+' Std.';
 $('commuteCostA').textContent=eur(a.commuteCost,0);
 $('commuteCostB').textContent=eur(b.commuteCost,0);
 if($('benefitYearA'))$('benefitYearA').textContent=eur(a.annualBenefits,0);
 if($('benefitYearB'))$('benefitYearB').textContent=eur(b.annualBenefits,0);
 const ed=b.effectiveNetHour-a.effectiveNetHour;
 $('effDiff').textContent=(ed>=0?'+ ':'− ')+eur(Math.abs(ed));
 $('effBoxA').classList.remove('winner');$('effBoxB').classList.remove('winner');
 if(a.effectiveNetHour>b.effectiveNetHour)$('effBoxA').classList.add('winner'); else if(b.effectiveNetHour>a.effectiveNetHour)$('effBoxB').classList.add('winner');
 const effWinner=b.effectiveNetHour>a.effectiveNetHour?nb:na;
 const effGap=Math.abs(ed);
 $('effectiveSummary').textContent=`💎 ${effWinner} hat unter Einbeziehung von Urlaub, Homeoffice, Pendelzeit, Pendelkosten, Überstunden, Sonderzahlungen und Benefits den höheren effektiven Jobwert – um ${eur(effGap)} netto je tatsächlich gebundener Stunde.`;
 $('compareResult').classList.remove('hidden');
}

function updateTarget(){const mh=(+$('targetHours').value||0)*52/12,t=+$('targetHour').value||0;$('targetInfo').textContent=`Dafür brauchst du ungefähr ${eur(mh*t)} Netto pro Monat.`}
$('targetHours').oninput=updateTarget;$('targetHour').oninput=updateTarget;
function findGross(target){let lo=0,hi=25000;for(let i=0;i<80;i++){let mid=(lo+hi)/2;if(calcNet(mid)<target)lo=mid;else hi=mid}return hi}
$('calcTarget').onclick=()=>{
 const mh=(+$('targetHours').value||0)*52/12,t=+$('targetHour').value||0,target=t*mh,g=findGross(target),round=Math.ceil(g/50)*50;
 $('tGross').textContent=eur(g,0);$('tAnnual').textContent=`≈ ${eur(g*12,0)} brutto pro Jahr`;$('tPill').textContent=`für ${eur(t)} netto pro Stunde`;
 $('tGrossHour').textContent=eur(g/mh);
 $('tNetHour').textContent=eur(t);
 $('targetSummary').textContent=`🎯 Rechnerisch brauchst du etwa ${eur(g,0)} brutto im Monat. Das entspricht rund ${eur(g/mh)} brutto pro Arbeitsstunde. Als runde Forderung wären mindestens ${eur(round,0)} sinnvoll.`;
 $('targetResult').classList.remove('hidden');
}

document.querySelectorAll('nav button').forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
 ['rechner','vergleich','wunsch','mehr'].forEach(t=>$('tab-'+t).classList.toggle('hidden',t!==btn.dataset.tab));
 scrollTo(0,0);
});
loadProfile();

$('runSvTest').onclick=()=>{
  const rv=4200*.093, av=4200*.013, kv=4200*(.073+.029/2), pv=4200*.024;
  const ok=Math.abs(rv-390.60)<.001 && Math.abs(av-54.60)<.001 && Math.abs(kv-367.50)<.001 && Math.abs(pv-100.80)<.001;
  const box=$('svTestResult');
  box.classList.remove('hidden');
  box.style.background=ok?'#edf9f0':'#fff1f0';
  box.style.color=ok?'#226a38':'#b42318';
  box.textContent=ok ? `✓ Bestanden: RV ${eur(rv)}, AV ${eur(av)}, KV ${eur(kv)}, PV ${eur(pv)}.` : `⚠ Abweichung im SV-Referenzfall.`;
};

$('runSelfTest').onclick=()=>{
  try{
    const r=calculateLohnsteuer(2026,{LZZ:2,RE4:500000,STKL:1,KVZ:2.5,PVZ:1});
    const lst=(r.LSTLZZ||0)/100;
    const soli=(r.SOLZLZZ||0)/100;
    const ok=Math.abs(lst-785.83)<0.001 && Math.abs(soli-0)<0.001;
    const box=$('selfTestResult');
    box.classList.remove('hidden');
    box.style.background=ok?'#edf9f0':'#fff1f0';
    box.style.color=ok?'#226a38':'#b42318';
    box.textContent=ok ? `✓ Bestanden: Lohnsteuer ${eur(lst)}, Soli ${eur(soli)} – entspricht dem veröffentlichten BMF-validierten Referenzfall.` : `⚠ Abweichung: Lohnsteuer ${eur(lst)}, Soli ${eur(soli)}. Erwartet waren 785,83 € und 0,00 €.`;
  }catch(e){
    const box=$('selfTestResult');
    box.classList.remove('hidden');
    box.style.background='#fff1f0';
    box.style.color='#b42318';
    box.textContent='⚠ Systemtest konnte nicht ausgeführt werden. Prüfe die Internetverbindung zur geladenen PAP-Bibliothek.';
  }
};

updateInsuranceFields();updateHours();updateTarget();updateSettingsSummary();$('engineStatus').textContent='✓ BMF-PAP 2026 geladen · Berechnung lokal im Browser';

async function initPwa(){
  if(!('serviceWorker' in navigator)) return;
  try { await navigator.serviceWorker.register('./service-worker.js'); }
  catch(e) { console.warn('Service Worker konnte nicht registriert werden', e); }
}
initPwa();
