// WasBinIchWert v8.30 – Teilzeitvergleich, Stufe 2
(function initPartTimeComparison(){
  if(document.getElementById('tab-teilzeit')) return;

  const main=document.querySelector('main');
  const more=document.getElementById('tab-mehr');
  const nav=document.querySelector('nav');
  if(!main||!more||!nav) return;

  const style=document.createElement('style');
  style.textContent=`
    .parttime-hero{border:2px solid #9bd7ae;background:#f2fbf5;border-radius:20px;padding:18px 14px;margin:16px 0;text-align:center}
    .parttime-hero.effective{border-color:#d9c9fa;background:#fcfaff}
    .parttime-hero .eyebrow{font-size:11px;font-weight:800;color:#39724b;text-transform:uppercase;letter-spacing:.04em}
    .parttime-hero.effective .eyebrow{color:#7e22ce}
    .parttime-hero .big{font-size:31px;line-height:1.08;font-weight:850;color:var(--green);margin:7px 0 4px;font-variant-numeric:tabular-nums}
    .parttime-hero.effective .big{color:#7e22ce}
    .parttime-hero .sub{font-size:12px;color:var(--muted);line-height:1.45}
    .parttime-kpis{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}
    .parttime-kpi{border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px 9px;text-align:center}
    .parttime-kpi span{display:block;font-size:10px;color:var(--muted);line-height:1.3}
    .parttime-kpi strong{display:block;font-size:18px;color:var(--navy);margin-top:5px;font-variant-numeric:tabular-nums}
    .parttime-copy{font-size:12px;line-height:1.5;color:#40506a}
    #parttimeSync{width:100%;border:1px solid #d8deea;background:#f3f6fb;color:var(--navy);border-radius:11px;padding:10px 12px;font-size:12px;font-weight:800;margin-top:12px}
    .pt-pro{margin-top:16px;padding-top:15px;border-top:1px solid var(--line)}
    .pt-pro>summary{cursor:pointer;font-weight:800;color:var(--blue);list-style:none;line-height:1.4}
    .pt-pro-note{font-size:11px;color:#69748b;line-height:1.45;margin:9px 0 4px}
    nav{grid-template-columns:repeat(5,1fr)}
    @media(max-width:400px){nav{font-size:9.5px}.parttime-kpi strong{font-size:16px}.parttime-hero .big{font-size:28px}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.id='tab-teilzeit';
  section.className='hidden';
  section.innerHTML=`
    <h2 class="section-title">Teilzeit vergleichen</h2>
    <div class="section-sub">Was kostet dich weniger Arbeitszeit – und wie viel freie Zeit gewinnst du?</div>
    <div class="info"><b>Stufe 2:</b> Neben dem proportionalen Teilzeit-Brutto kannst du jetzt auch Arbeitsweg, Homeoffice und reale Jobkosten berücksichtigen. Deine Angaben aus „Meine Daten“ gelten automatisch für die Netto-Berechnung.</div>

    <div class="card">
      <h3>Ausgangsmodell</h3>
      <label>Bruttogehalt pro Monat</label>
      <div class="field big"><input id="ptGross" type="number" value="4200" min="0" step="50"><span class="suffix">€</span></div>
      <div class="grid2">
        <div><label>Wochenstunden aktuell</label><div class="field"><input id="ptHoursNow" type="number" value="40" min="1" step="0.5"><span class="suffix">Std.</span></div></div>
        <div><label>Arbeitstage aktuell</label><div class="field"><input id="ptDaysNow" type="number" value="5" min="1" max="7" step="1"><span class="suffix">Tage</span></div></div>
      </div>
      <button id="parttimeSync" type="button">Werte aus Rechner übernehmen</button>
    </div>

    <div class="card">
      <h3>Gewünschtes Teilzeitmodell</h3>
      <div class="grid2">
        <div><label>Wochenstunden neu</label><div class="field"><input id="ptHoursNew" type="number" value="32" min="1" step="0.5"><span class="suffix">Std.</span></div></div>
        <div><label>Arbeitstage neu</label><div class="field"><input id="ptDaysNew" type="number" value="4" min="1" max="7" step="1"><span class="suffix">Tage</span></div></div>
      </div>
      <div class="info" id="ptPreview"></div>

      <details class="pt-pro">
        <summary>Effektiven Teilzeitwert berücksichtigen <span class="pro-badge">PRO</span></summary>
        <div class="pt-pro-note">Damit berechnen wir zusätzlich die tatsächlich gewonnene Zeit und die Veränderung deiner arbeitsbedingten Kosten.</div>
        <div class="grid2">
          <div><label>Urlaubstage aktuell/Jahr</label><div class="field"><input id="ptVacation" type="number" value="30" min="0" step="1"><span class="suffix">Tage</span></div></div>
          <div><label>Kosten je km</label><div class="field"><input id="ptKmCost" type="number" value="0.30" min="0" step="0.01"><span class="suffix">€</span></div></div>
          <div><label>Homeoffice aktuell</label><div class="field"><input id="ptHomeNow" type="number" value="0" min="0" step="0.5"><span class="suffix">Tage</span></div></div>
          <div><label>Homeoffice neu</label><div class="field"><input id="ptHomeNew" type="number" value="0" min="0" step="0.5"><span class="suffix">Tage</span></div></div>
          <div><label>Arbeitsweg einfach</label><div class="field"><input id="ptKm" type="number" value="0" min="0" step="1"><span class="suffix">km</span></div></div>
          <div><label>Fahrtzeit einfach</label><div class="field"><input id="ptMinutes" type="number" value="0" min="0" step="1"><span class="suffix">Min.</span></div></div>
          <div><label>Parkkosten pro Bürotag</label><div class="field"><input id="ptParking" type="number" value="0" min="0" step="0.5"><span class="suffix">€</span></div></div>
          <div><label>Verpflegung extra/Bürotag</label><div class="field"><input id="ptFood" type="number" value="0" min="0" step="0.5"><span class="suffix">€</span></div></div>
          <div><label>Kinderbetreuung pro Bürotag</label><div class="field"><input id="ptChildcare" type="number" value="0" min="0" step="0.5"><span class="suffix">€</span></div></div>
          <div><label>Homeoffice-Ersparnis/Tag</label><div class="field"><input id="ptHomeSaving" type="number" value="0" min="0" step="0.5"><span class="suffix">€</span></div></div>
        </div>
      </details>
    </div>

    <button class="primary" id="calcParttime">Teilzeit vergleichen →</button>

    <div id="parttimeResult" class="hidden">
      <div class="parttime-hero">
        <div class="eyebrow">Preis deiner zusätzlichen Vertrags-Freizeit</div>
        <div class="big" id="ptCostFreeHour"></div>
        <div class="sub" id="ptHeroSub"></div>
      </div>

      <div class="parttime-kpis">
        <div class="parttime-kpi"><span>Netto weniger / Monat</span><strong id="ptNetLossMonth"></strong></div>
        <div class="parttime-kpi"><span>Freie Zeit mehr / Monat</span><strong id="ptFreeMonth"></strong></div>
        <div class="parttime-kpi"><span>Netto weniger / Jahr</span><strong id="ptNetLossYear"></strong></div>
        <div class="parttime-kpi"><span>Vertrags-Freizeit mehr / Jahr</span><strong id="ptFreeYear"></strong></div>
      </div>

      <div class="card">
        <div class="rows">
          <div class="row"><span>Aktuelles Monatsbrutto</span><strong id="ptGrossNowOut"></strong></div>
          <div class="row"><span>Teilzeit-Monatsbrutto</span><strong id="ptGrossNewOut"></strong></div>
          <div class="row"><span>Aktuelles Monatsnetto</span><strong id="ptNetNowOut"></strong></div>
          <div class="row"><span>Teilzeit-Monatsnetto</span><strong id="ptNetNewOut"></strong></div>
          <div class="row"><span>Netto-Stundenwert aktuell</span><strong id="ptHourNowOut"></strong></div>
          <div class="row"><span>Netto-Stundenwert Teilzeit</span><strong id="ptHourNewOut"></strong></div>
          <div class="row"><span>Zusätzliche freie Tage/Jahr</span><strong id="ptFreeDaysOut"></strong></div>
        </div>
      </div>

      <div class="parttime-hero effective">
        <div class="eyebrow">Effektiver Preis deiner Freizeit <span class="pro-badge">PRO</span></div>
        <div class="big" id="ptEffectiveCostHour"></div>
        <div class="sub">inkl. Urlaub, gesparter Pendelzeit und veränderter Jobkosten</div>
      </div>

      <div class="card">
        <h3>Effektiver Teilzeitwert <span class="pro-badge">PRO</span></h3>
        <div class="rows">
          <div class="row"><span>Tatsächlich gewonnene Zeit/Jahr</span><strong id="ptActualFreeYear"></strong></div>
          <div class="row"><span>Davon gesparte Pendelzeit</span><strong id="ptCommuteTimeSaved"></strong></div>
          <div class="row"><span>Weniger Fahrtkosten/Jahr</span><strong id="ptCommuteCostSaved"></strong></div>
          <div class="row"><span>Weitere Jobkosten-Ersparnis/Jahr</span><strong id="ptOtherCostSaved"></strong></div>
          <div class="row"><span>Homeoffice-Effekt/Jahr</span><strong id="ptHomeSavingDiff"></strong></div>
          <div class="row"><span>Effektive Nettoeinbuße/Monat</span><strong id="ptEffectiveLossMonth"></strong></div>
        </div>
      </div>
      <div class="summary parttime-copy" id="ptEffectiveSummary"></div>
      <div class="summary parttime-copy" id="ptSummary"></div>
    </div>
  `;
  main.insertBefore(section,more);

  const btn=document.createElement('button');
  btn.dataset.tab='teilzeit';
  btn.innerHTML='<b>◷</b>Teilzeit';
  nav.insertBefore(btn,nav.lastElementChild);

  const settingsHint=document.querySelector('.settings-head > div > div[style*="font-size:11px"]');
  if(settingsHint) settingsHint.textContent='Gilt automatisch für Rechner, Vergleich, Wunschgehalt und Teilzeit.';

  const tabs=['rechner','vergleich','wunsch','teilzeit','mehr'];
  document.querySelectorAll('nav button').forEach(navBtn=>{
    navBtn.onclick=()=>{
      document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
      navBtn.classList.add('active');
      tabs.forEach(t=>document.getElementById('tab-'+t)?.classList.toggle('hidden',t!==navBtn.dataset.tab));
      scrollTo(0,0);
    };
  });

  const val=id=>Math.max(0,+document.getElementById(id).value||0);
  const signedMoney=(n,d=0)=>(n>=0?'+ ':'− ')+eur(Math.abs(n),d);
  const updatePreview=()=>{
    const g=val('ptGross'),hNow=val('ptHoursNow'),hNew=val('ptHoursNew');
    const projected=hNow?g*hNew/hNow:0;
    document.getElementById('ptPreview').textContent=hNow?`Bei proportionaler Kürzung entspricht das etwa ${eur(projected,0)} brutto pro Monat.`:'Bitte aktuelle Wochenstunden eingeben.';
  };

  ['ptGross','ptHoursNow','ptHoursNew'].forEach(id=>document.getElementById(id)?.addEventListener('input',updatePreview));

  document.getElementById('parttimeSync').onclick=()=>{
    const sourceGross=typeof monthGross==='function'?monthGross():+(document.getElementById('salary')?.value||0);
    const sourceHours=+(document.getElementById('hours')?.value||0);
    if(sourceGross>0) document.getElementById('ptGross').value=Math.round(sourceGross*100)/100;
    if(sourceHours>0) document.getElementById('ptHoursNow').value=sourceHours;
    updatePreview();
  };

  document.getElementById('calcParttime').onclick=()=>{
    const gNow=val('ptGross'),hNow=val('ptHoursNow'),hNew=val('ptHoursNew');
    const dNow=Math.max(1,val('ptDaysNow')||5),dNew=Math.max(1,val('ptDaysNew')||dNow);
    const result=document.getElementById('parttimeResult');
    const summary=document.getElementById('ptSummary');

    if(!gNow||!hNow||!hNew){
      result.classList.remove('hidden');
      summary.textContent='⚠️ Bitte Bruttogehalt sowie aktuelle und gewünschte Wochenstunden vollständig eingeben.';
      return;
    }
    if(hNew>=hNow){
      result.classList.remove('hidden');
      summary.textContent='⚠️ Für den Teilzeitvergleich müssen die gewünschten Wochenstunden unter den aktuellen Wochenstunden liegen.';
      return;
    }
    if(dNew>dNow){
      result.classList.remove('hidden');
      summary.textContent='⚠️ Die Zahl der neuen Arbeitstage sollte für diesen Teilzeitvergleich nicht über den aktuellen Arbeitstagen liegen.';
      return;
    }

    const gNew=gNow*(hNew/hNow);
    const nNow=calcNet(gNow),nNew=calcNet(gNew);
    const netLossMonth=nNow-nNew,netLossYear=netLossMonth*12;
    const freeWeek=hNow-hNew,freeMonth=freeWeek*52/12,freeYear=freeWeek*52;
    const costPerFreeHour=freeMonth?netLossMonth/freeMonth:0;
    const mhNow=hNow*52/12,mhNew=hNew*52/12;
    const hourNow=mhNow?nNow/mhNow:0,hourNew=mhNew?nNew/mhNew:0;
    const freeDaysYear=Math.max(0,dNow-dNew)*52;

    document.getElementById('ptCostFreeHour').textContent=eur(costPerFreeHour);
    document.getElementById('ptHeroSub').textContent=`für jede zusätzlich gewonnene Vertragsstunde bei ${nf(freeWeek,1)} Std. weniger pro Woche`;
    document.getElementById('ptNetLossMonth').textContent='− '+eur(Math.max(0,netLossMonth),0);
    document.getElementById('ptFreeMonth').textContent='+ '+nf(freeMonth,1)+' Std.';
    document.getElementById('ptNetLossYear').textContent='− '+eur(Math.max(0,netLossYear),0);
    document.getElementById('ptFreeYear').textContent='+ '+nf(freeYear,0)+' Std.';
    document.getElementById('ptGrossNowOut').textContent=eur(gNow,0);
    document.getElementById('ptGrossNewOut').textContent=eur(gNew,0);
    document.getElementById('ptNetNowOut').textContent=eur(nNow,0);
    document.getElementById('ptNetNewOut').textContent=eur(nNew,0);
    document.getElementById('ptHourNowOut').textContent=eur(hourNow);
    document.getElementById('ptHourNewOut').textContent=eur(hourNew);
    document.getElementById('ptFreeDaysOut').textContent=freeDaysYear?'+ '+nf(freeDaysYear,0)+' Tage':'–';

    // Stufe 2: effektiver Teilzeitwert
    const vacationDays=val('ptVacation');
    const vacationWeeks=Math.min(52,vacationDays/dNow);
    const workingWeeks=Math.max(0,52-vacationWeeks);
    const homeNow=Math.min(dNow,val('ptHomeNow'));
    const homeNew=Math.min(dNew,val('ptHomeNew'));
    const officeNow=Math.max(0,dNow-homeNow);
    const officeNew=Math.max(0,dNew-homeNew);
    const commuteDaysNow=officeNow*workingWeeks;
    const commuteDaysNew=officeNew*workingWeeks;
    const commuteDayDiff=commuteDaysNow-commuteDaysNew;
    const km=val('ptKm'),minutes=val('ptMinutes'),kmCost=val('ptKmCost');
    const parking=val('ptParking'),food=val('ptFood'),childcare=val('ptChildcare'),homeSaving=val('ptHomeSaving');
    const commuteHoursNow=minutes*2*commuteDaysNow/60;
    const commuteHoursNew=minutes*2*commuteDaysNew/60;
    const commuteTimeSaved=commuteHoursNow-commuteHoursNew;
    const commuteCostNow=km*2*commuteDaysNow*kmCost;
    const commuteCostNew=km*2*commuteDaysNew*kmCost;
    const commuteCostSaved=commuteCostNow-commuteCostNew;
    const otherCostNow=(parking+food+childcare)*commuteDaysNow;
    const otherCostNew=(parking+food+childcare)*commuteDaysNew;
    const otherCostSaved=otherCostNow-otherCostNew;
    const homeSaveNow=homeNow*workingWeeks*homeSaving;
    const homeSaveNew=homeNew*workingWeeks*homeSaving;
    const homeSavingDiff=homeSaveNew-homeSaveNow;
    const actualWorkTimeSaved=freeWeek*workingWeeks;
    const actualFreeYear=Math.max(0,actualWorkTimeSaved+commuteTimeSaved);
    const effectiveAnnualNow=nNow*12-commuteCostNow-otherCostNow+homeSaveNow;
    const effectiveAnnualNew=nNew*12-commuteCostNew-otherCostNew+homeSaveNew;
    const effectiveLossYear=effectiveAnnualNow-effectiveAnnualNew;
    const effectiveLossMonth=effectiveLossYear/12;
    const effectiveCostHour=actualFreeYear?effectiveLossYear/actualFreeYear:0;

    document.getElementById('ptActualFreeYear').textContent='+ '+nf(actualFreeYear,0)+' Std.';
    document.getElementById('ptCommuteTimeSaved').textContent=(commuteTimeSaved>=0?'+ ':'− ')+nf(Math.abs(commuteTimeSaved),1)+' Std.';
    document.getElementById('ptCommuteCostSaved').textContent=signedMoney(commuteCostSaved,0);
    document.getElementById('ptOtherCostSaved').textContent=signedMoney(otherCostSaved,0);
    document.getElementById('ptHomeSavingDiff').textContent=signedMoney(homeSavingDiff,0);
    document.getElementById('ptEffectiveLossMonth').textContent=effectiveLossMonth>=0?'− '+eur(effectiveLossMonth,0):'+ '+eur(Math.abs(effectiveLossMonth),0);
    document.getElementById('ptEffectiveCostHour').textContent=effectiveCostHour>=0?eur(effectiveCostHour):'− '+eur(Math.abs(effectiveCostHour));

    const effectBits=[];
    if(commuteTimeSaved>0.05) effectBits.push(`${nf(commuteTimeSaved,0)} Std. weniger Pendelzeit`);
    if(commuteCostSaved>0.5) effectBits.push(`${eur(commuteCostSaved,0)} weniger Fahrtkosten`);
    if(otherCostSaved>0.5) effectBits.push(`${eur(otherCostSaved,0)} weniger weitere Jobkosten`);
    if(Math.abs(homeSavingDiff)>0.5) effectBits.push(`${signedMoney(homeSavingDiff,0)} Homeoffice-Effekt`);
    const effectiveSummary=document.getElementById('ptEffectiveSummary');
    if(effectiveLossYear>=0){
      effectiveSummary.textContent=`💎 Effektiv sinkt dein verfügbares Netto nach den berücksichtigten Jobkosten um rund ${eur(effectiveLossMonth,0)} pro Monat. Dafür gewinnst du während der tatsächlichen Arbeitswochen inklusive eingesparter Pendelzeit etwa ${nf(actualFreeYear,0)} Stunden pro Jahr. Eine effektiv gewonnene freie Stunde kostet dich damit rund ${eur(effectiveCostHour)}.${effectBits.length?' Größte Effekte: '+effectBits.join(' · ')+'.':''}`;
    }else{
      effectiveSummary.textContent=`💎 In dieser Konstellation gleichen die eingesparten Jobkosten den Nettoverlust rechnerisch vollständig aus. Du hast rund ${eur(Math.abs(effectiveLossMonth),0)} pro Monat mehr zur Verfügung und gewinnst gleichzeitig etwa ${nf(actualFreeYear,0)} Stunden Zeit pro Jahr.${effectBits.length?' Effekte: '+effectBits.join(' · ')+'.':''}`;
    }

    const dayText=freeDaysYear?` Wenn du zugleich von ${nf(dNow,0)} auf ${nf(dNew,0)} Arbeitstage pro Woche wechselst, entstehen auf Vertragsebene rechnerisch ${nf(freeDaysYear,0)} zusätzliche arbeitsfreie Tage pro Jahr.`:'';
    summary.textContent=`💡 ${nf(hNow,1)} → ${nf(hNew,1)} Wochenstunden kosten dich nach der aktuellen 2026er Netto-Berechnung rund ${eur(netLossMonth,0)} netto pro Monat. Auf Vertragsebene entsprechen ${nf(freeWeek,1)} Stunden weniger pro Woche rund ${nf(freeMonth,1)} Stunden pro Monat bzw. ${nf(freeYear,0)} Stunden pro Jahr. Eine zusätzliche Vertrags-Freistunde kostet damit ungefähr ${eur(costPerFreeHour)}.${dayText}`;
    result.classList.remove('hidden');
  };

  updatePreview();
})();
