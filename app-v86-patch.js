
// v8.6 – Reale Jobkosten und Homeoffice-Ersparnis
function addRealCostsUi(){
  ['A','B'].forEach(which=>{
    if($('parkingDay'+which))return;
    const anchor=$('benefit_ticket'+which)?.closest('.grid2')?.parentElement;
    if(!anchor)return;
    const box=document.createElement('div');
    box.style.gridColumn='1 / -1';
    box.innerHTML=`<div style="font-weight:700;margin:14px 0 2px">Weitere reale Kosten & Ersparnisse</div>
      <div style="font-size:11px;color:#7a8498;margin-bottom:8px">Nur zusätzliche Kosten bzw. echte Ersparnisse durch diesen Job eintragen.</div>
      <div class="grid2">
        <div><label>Parkkosten pro Bürotag</label><div class="field"><input id="parkingDay${which}" type="number" value="0" min="0" step="0.50"><span class="suffix">€</span></div></div>
        <div><label>Zusätzliche Verpflegung pro Bürotag</label><div class="field"><input id="mealCostDay${which}" type="number" value="0" min="0" step="0.50"><span class="suffix">€</span></div></div>
        <div><label>Zusätzliche Kinderbetreuung/Monat</label><div class="field"><input id="childcareMonth${which}" type="number" value="0" min="0" step="10"><span class="suffix">€</span></div></div>
        <div><label>Homeoffice-Ersparnis pro Tag</label><div class="field"><input id="homeSavingDay${which}" type="number" value="0" min="0" step="0.50"><span class="suffix">€</span></div></div>
      </div>`;
    anchor.after(box);
  });
  const rows=$('benefitYearB')?.closest('.rows');
  if(rows&&!$('realCostsYearA')){
    const mk=(label,id)=>{const d=document.createElement('div');d.className='row';d.innerHTML=`<span>${label}</span><strong id="${id}"></strong>`;return d};
    $('benefitYearB').closest('.row').after(
      mk('Weitere Kosten/Jahr Job A','realCostsYearA'),
      mk('Weitere Kosten/Jahr Job B','realCostsYearB'),
      mk('Homeoffice-Ersparnis/Jahr Job A','homeSavingYearA'),
      mk('Homeoffice-Ersparnis/Jahr Job B','homeSavingYearB')
    );
  }
}
addRealCostsUi();

function realCostValues(which,workingWeeks,officeDays,homeDays){
  const officeDaysYear=officeDays*workingWeeks;
  const homeDaysYear=homeDays*workingWeeks;
  const parkingDay=Math.max(0,+($('parkingDay'+which)?.value||0));
  const mealCostDay=Math.max(0,+($('mealCostDay'+which)?.value||0));
  const childcareMonth=Math.max(0,+($('childcareMonth'+which)?.value||0));
  const homeSavingDay=Math.max(0,+($('homeSavingDay'+which)?.value||0));
  const parkingAnnual=parkingDay*officeDaysYear;
  const mealAnnual=mealCostDay*officeDaysYear;
  const childcareAnnual=childcareMonth*12;
  const homeSavingAnnual=homeSavingDay*homeDaysYear;
  const costsAnnual=parkingAnnual+mealAnnual+childcareAnnual;
  return {parkingAnnual,mealAnnual,childcareAnnual,homeSavingAnnual,costsAnnual};
}

function jobV86(which){
  const g=compareGross('gross'+which,which==='A'?aMode:bMode),h=+$('hours'+which).value||0,mh=h*52/12,n=calcNet(g);
  const workDays=Math.max(1,+$('days'+which).value||5),vacation=Math.max(0,+$('vac'+which).value||0);
  const home=Math.max(0,Math.min(workDays,+$('home'+which).value||0)),officeDays=Math.max(0,workDays-home);
  const overtime=Math.max(0,+$('ot'+which).value||0),oneWayKm=Math.max(0,+$('km'+which).value||0),oneWayMin=Math.max(0,+$('min'+which).value||0),kmCost=Math.max(0,+$('kmCost'+which).value||0);
  const specialGross=Math.max(0,+$('special'+which).value||0),specialMonth=+$('specialMonth'+which)?.value||12;
  const special=calcSpecialPayment(g,specialGross,specialMonth),benefits=benefitValues(which);
  const workingWeeks=Math.max(0,52-vacation/workDays),actualWorkHours=h*workingWeeks,overtimeHours=overtime*workingWeeks,commuteDays=officeDays*workingWeeks;
  const commuteHours=oneWayMin*2*commuteDays/60,commuteCost=oneWayKm*2*commuteDays*kmCost,effectiveHours=actualWorkHours+overtimeHours+commuteHours;
  const realCosts=realCostValues(which,workingWeeks,officeDays,home);
  const annualNetWithSpecial=n*12+special.net;
  const effectiveAnnualNet=Math.max(0,annualNetWithSpecial+benefits.annual+realCosts.homeSavingAnnual-commuteCost-realCosts.costsAnnual);
  const effectiveNetHour=effectiveHours?effectiveAnnualNet/effectiveHours:0;
  return {g,h,mh,n,nh:mh?n/mh:0,special,benefits,annualBenefits:benefits.annual,effectiveHours,commuteCost,realCosts,effectiveNetHour};
}

$('calcCompare').onclick=()=>{
  const a=jobV86('A'),b=jobV86('B'),na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B';
  $('resNameA').textContent=na;$('resNameB').textContent=nb;$('cHourA').textContent=eur(a.nh);$('cHourB').textContent=eur(b.nh);
  $('boxA').classList.remove('winner');$('boxB').classList.remove('winner');if(a.nh>b.nh)$('boxA').classList.add('winner');else if(b.nh>a.nh)$('boxB').classList.add('winner');
  const dg=b.g-a.g,dn=b.n-a.n,dh=b.mh-a.mh,dv=b.nh-a.nh;
  $('cDiffGross').textContent=(dg>=0?'+ ':'− ')+eur(Math.abs(dg));$('cDiffNet').textContent=(dn>=0?'+ ':'− ')+eur(Math.abs(dn));
  $('cDiffHours').textContent=(dh>=0?'+ ':'− ')+nf(Math.abs(dh))+' Std.';$('cDiffHour').textContent=(dv>=0?'+ ':'− ')+eur(Math.abs(dv));
  $('compareSummary').textContent=dn>0&&dv<0?`⚠️ ${nb} bringt mehr Netto im Monat, aber dein Netto-Stundenwert sinkt.`:dv>0?`✅ ${nb} hat den höheren Netto-Stundenwert.`:`✅ ${na} hat den höheren Netto-Stundenwert.`;
  $('effNameA').textContent=na;$('effNameB').textContent=nb;$('effHourA').textContent=eur(a.effectiveNetHour);$('effHourB').textContent=eur(b.effectiveNetHour);
  $('effTimeA').textContent=nf(a.effectiveHours,1)+' Std.';$('effTimeB').textContent=nf(b.effectiveHours,1)+' Std.';
  $('commuteCostA').textContent=eur(a.commuteCost,0);$('commuteCostB').textContent=eur(b.commuteCost,0);
  $('specialNetA').textContent=eur(a.special.net,0);$('specialNetB').textContent=eur(b.special.net,0);
  $('benefitYearA').textContent=eur(a.annualBenefits,0);$('benefitYearB').textContent=eur(b.annualBenefits,0);
  if($('realCostsYearA'))$('realCostsYearA').textContent=eur(a.realCosts.costsAnnual,0);
  if($('realCostsYearB'))$('realCostsYearB').textContent=eur(b.realCosts.costsAnnual,0);
  if($('homeSavingYearA'))$('homeSavingYearA').textContent=eur(a.realCosts.homeSavingAnnual,0);
  if($('homeSavingYearB'))$('homeSavingYearB').textContent=eur(b.realCosts.homeSavingAnnual,0);
  const ed=b.effectiveNetHour-a.effectiveNetHour;$('effDiff').textContent=(ed>=0?'+ ':'− ')+eur(Math.abs(ed));
  $('effBoxA').classList.remove('winner');$('effBoxB').classList.remove('winner');if(a.effectiveNetHour>b.effectiveNetHour)$('effBoxA').classList.add('winner');else if(b.effectiveNetHour>a.effectiveNetHour)$('effBoxB').classList.add('winner');
  const effWinner=b.effectiveNetHour>a.effectiveNetHour?nb:na;
  $('effectiveSummary').textContent=`💎 ${effWinner} hat unter Einbeziehung von Urlaub, Homeoffice, Pendelzeit, Pendelkosten, weiteren realen Kosten, Homeoffice-Ersparnissen, Überstunden, Sonderzahlungen und Benefits den höheren effektiven Jobwert – um ${eur(Math.abs(ed))} netto je tatsächlich gebundener Stunde.`;
  $('compareResult').classList.remove('hidden');
};
