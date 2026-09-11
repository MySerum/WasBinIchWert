// WasBinIchWert v8.35 – Gehaltsverhandlungs-Modus
(function initSalaryNegotiation(){
  const more=document.getElementById('tab-mehr'),main=document.querySelector('main'),nav=document.querySelector('nav');
  if(!more||!main||!nav||document.getElementById('tab-verhandlung'))return;

  const style=document.createElement('style');
  style.textContent=`
    .neg-entry{border:1px solid #f0d9a1;background:#fffaf0}.neg-entry p{font-size:12px;line-height:1.5;color:#6f5a2f;margin:0 0 12px}
    .neg-hero{border:2px solid #efd18a;background:#fffaf0;border-radius:20px;padding:18px 14px;text-align:center;margin:16px 0}.neg-hero .eyebrow{font-size:11px;font-weight:800;color:#8a6414;text-transform:uppercase}.neg-hero .big{font-size:32px;font-weight:850;color:#8a6414;margin:7px 0 4px;font-variant-numeric:tabular-nums}.neg-hero .sub{font-size:12px;color:var(--muted);line-height:1.45}
    .neg-scenarios{display:grid;gap:8px}.neg-head,.neg-row{display:grid;grid-template-columns:52px 1fr 1fr 1fr;gap:7px;align-items:center}.neg-head{font-size:9px;font-weight:800;color:#6d7587;text-transform:uppercase;padding:0 4px}.neg-row{border:1px solid var(--line);border-radius:12px;padding:10px 8px;background:#fff;font-size:11px}.neg-row.selected{border:2px solid #efd18a;background:#fffaf0}.neg-row strong{text-align:right;font-variant-numeric:tabular-nums}.neg-rate{font-weight:850;color:#8a6414}.neg-summary{border:1px solid #f0d9a1;background:#fffaf0;border-radius:16px;padding:15px 16px;font-size:13px;line-height:1.55;color:#5f4b22}.neg-summary b{color:#8a6414}.neg-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.neg-secondary{border:1px solid #d8deea;background:#f3f6fb;color:var(--navy);border-radius:11px;padding:10px 12px;font-size:12px;font-weight:800}.neg-note{font-size:11px;line-height:1.5;color:#69748b;margin-top:10px}
    @media(max-width:390px){.neg-head,.neg-row{grid-template-columns:44px 1fr 1fr 1fr;gap:5px}.neg-row{font-size:10px;padding:9px 6px}}
  `;
  document.head.appendChild(style);

  const entry=document.createElement('div');
  entry.className='card neg-entry';
  entry.innerHTML='<h3>🗣️ Gehaltsverhandlung <span class="pro-badge">PRO</span></h3><p>Simuliere Gehaltserhöhungen und finde heraus, welche Bruttoforderung du für dein gewünschtes Netto brauchst.</p><button class="primary" id="openNegotiation">Verhandlung vorbereiten →</button>';
  const salaryEntry=document.querySelector('.salary-entry');
  if(salaryEntry)salaryEntry.after(entry);else more.querySelector('.section-title')?.after(entry);

  const section=document.createElement('section');
  section.id='tab-verhandlung';section.className='hidden';
  section.innerHTML=`
    <div class="result-top"><div><h2 class="section-title">Gehaltsverhandlung <span class="pro-badge">PRO</span></h2><div class="section-sub">Was bringt eine Erhöhung wirklich – und was musst du fordern?</div></div><button class="result-back" id="negBack">← Zurück</button></div>
    <div class="info"><b>Entscheidungshilfe:</b> Die Netto-Werte werden mit deinen Angaben aus „Meine Daten“ und den aktuellen 2026er Berechnungsregeln ermittelt.</div>
    <div class="card"><h3>Deine Ausgangslage</h3><label>Aktuelles Bruttogehalt pro Monat</label><div class="field big"><input id="negGross" type="number" value="4200" min="0" step="50"><span class="suffix">€</span></div><div class="grid2"><div><label>Wochenstunden</label><div class="field"><input id="negHours" type="number" value="40" min="1" step="0.5"><span class="suffix">Std.</span></div></div><div><label>Gewünschtes Netto-Plus/Monat</label><div class="field"><input id="negNetPlus" type="number" value="250" min="0" step="25"><span class="suffix">€</span></div></div><div><label>Eigene Bruttoforderung/Monat</label><div class="field"><input id="negAsk" type="number" value="0" min="0" step="50"><span class="suffix">€</span></div></div><div><label>Verhandlungsziel</label><div class="field"><select id="negGoal"><option value="net">Gewünschtes Netto erreichen</option><option value="ask">Eigene Bruttoforderung prüfen</option></select></div></div></div><div class="neg-actions"><button class="neg-secondary" id="negSync">Aus Rechner übernehmen</button><button class="primary" id="negCalc">Verhandlung berechnen</button></div></div>
    <div id="negResult" class="hidden">
      <div class="neg-hero"><div class="eyebrow">Rechnerische Bruttoforderung</div><div class="big" id="negRequiredGross"></div><div class="sub" id="negRequiredSub"></div></div>
      <div class="overview-kpis"><div class="overview-kpi"><span>Aktuelles Netto</span><strong id="negCurrentNet"></strong></div><div class="overview-kpi"><span>Ziel-Netto</span><strong id="negTargetNet"></strong></div><div class="overview-kpi"><span>Erhöhung brutto</span><strong id="negGrossPct"></strong></div><div class="overview-kpi"><span>Netto-Plus / Jahr</span><strong id="negYearPlus"></strong></div></div>
      <div class="card"><h3>Was bringen typische Erhöhungen?</h3><div class="neg-head"><span>Plus</span><span style="text-align:right">Brutto</span><span style="text-align:right">Netto +</span><span style="text-align:right">Netto/Std.</span></div><div class="neg-scenarios" id="negScenarios"></div></div>
      <div class="card"><h3>Deine Forderung</h3><div class="rows"><div class="row"><span>Aktuelles Monatsbrutto</span><strong id="negCurGrossOut"></strong></div><div class="row"><span>Forderung Monatsbrutto</span><strong id="negAskOut"></strong></div><div class="row"><span>Forderung Jahresbrutto</span><strong id="negAskYear"></strong></div><div class="row"><span>Netto bei Forderung</span><strong id="negAskNet"></strong></div><div class="row"><span>Netto-Plus / Monat</span><strong id="negAskNetPlus"></strong></div><div class="row"><span>Netto-Stundenwert vorher</span><strong id="negHourBefore"></strong></div><div class="row"><span>Netto-Stundenwert nachher</span><strong id="negHourAfter"></strong></div></div></div>
      <div class="neg-summary" id="negSummary"></div><div class="neg-note">Hinweis: Das Ergebnis ist eine rechnerische Orientierung. Tarifbindung, Bonusbestandteile, Sachleistungen, individuelle Arbeitgeberbudgets und zukünftige Steueränderungen sind nicht automatisch berücksichtigt.</div>
    </div>`;
  main.insertBefore(section,more);

  const findGrossForNet=target=>{let lo=0,hi=30000;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(calcNet(mid)<target)lo=mid;else hi=mid}return hi;};
  const round50=n=>Math.ceil(n/50)*50;
  const open=()=>{document.querySelectorAll('main > section[id^="tab-"]').forEach(x=>x.classList.add('hidden'));section.classList.remove('hidden');const g=typeof monthGross==='function'?monthGross():0,h=+($('hours')?.value||0);if(g>0)$('negGross').value=Math.round(g*100)/100;if(h>0)$('negHours').value=h;scrollTo(0,0)};
  const back=()=>{section.classList.add('hidden');more.classList.remove('hidden');nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='mehr'));scrollTo(0,0)};
  $('openNegotiation').onclick=open;$('negBack').onclick=back;$('negSync').onclick=()=>{const g=typeof monthGross==='function'?monthGross():0,h=+($('hours')?.value||0);if(g>0)$('negGross').value=Math.round(g*100)/100;if(h>0)$('negHours').value=h;};

  $('negCalc').onclick=()=>{
    const gross=Math.max(0,+$('negGross').value||0),hours=Math.max(0,+$('negHours').value||0),wantedPlus=Math.max(0,+$('negNetPlus').value||0),goal=$('negGoal').value;
    if(!gross||!hours)return;
    const currentNet=calcNet(gross),mh=hours*52/12,currentHour=currentNet/mh,targetNet=currentNet+wantedPlus,requiredRaw=findGrossForNet(targetNet),required=round50(requiredRaw),ownAsk=Math.max(0,+$('negAsk').value||0);
    let ask=goal==='ask'&&ownAsk>0?ownAsk:required;if(ask<gross)ask=gross;
    const askNet=calcNet(ask),askNetPlus=askNet-currentNet,askHour=askNet/mh,grossPct=(ask/gross-1)*100;
    $('negRequiredGross').textContent=eur(required,0);$('negRequiredSub').textContent=`für ungefähr ${eur(wantedPlus,0)} mehr Netto pro Monat`;$('negCurrentNet').textContent=eur(currentNet,0);$('negTargetNet').textContent=eur(targetNet,0);$('negGrossPct').textContent=(required/gross-1>=0?'+ ':'− ')+nf(Math.abs((required/gross-1)*100),1)+' %';$('negYearPlus').textContent='+ '+eur(wantedPlus*12,0);
    $('negCurGrossOut').textContent=eur(gross,0);$('negAskOut').textContent=eur(ask,0);$('negAskYear').textContent=eur(ask*12,0);$('negAskNet').textContent=eur(askNet,0);$('negAskNetPlus').textContent=(askNetPlus>=0?'+ ':'− ')+eur(Math.abs(askNetPlus),0);$('negHourBefore').textContent=eur(currentHour);$('negHourAfter').textContent=eur(askHour);
    const rates=[2,5,7.5,10];const scenarios=$('negScenarios');scenarios.innerHTML=rates.map(r=>{const g=gross*(1+r/100),n=calcNet(g),plus=n-currentNet,hour=n/mh,selected=Math.abs(g-ask)<30;return `<div class="neg-row${selected?' selected':''}"><span class="neg-rate">+${nf(r,1)}%</span><strong>${eur(g,0)}</strong><strong>+ ${eur(plus,0)}</strong><strong>${eur(hour)}</strong></div>`}).join('');
    const requiredPct=(required/gross-1)*100,roundAsk=round50(ask),anchor=round50(Math.max(roundAsk,ask*1.02));
    $('negSummary').innerHTML=`<b>WasBinIchWert-Einschätzung</b><br>Für dein gewünschtes Plus von <b>${eur(wantedPlus,0)} netto im Monat</b> brauchst du rechnerisch etwa <b>${eur(required,0)} brutto</b>. Das entspricht rund <b>+ ${nf(requiredPct,1)} %</b> gegenüber deinem aktuellen Gehalt. ${goal==='ask'&&ownAsk>0?`Deine eingegebene Forderung von <b>${eur(ask,0)}</b> bringt voraussichtlich etwa <b>${eur(askNetPlus,0)} netto mehr pro Monat</b>. `:''}Als runde Zielgröße liegt <b>${eur(roundAsk,0)}</b> nahe; für Verhandlungsspielraum könntest du rechnerisch mit etwa <b>${eur(anchor,0)}</b> einsteigen.`;
    $('negResult').classList.remove('hidden');
    try{localStorage.setItem('wasbinichwert-negotiation-v1',JSON.stringify({gross,hours,wantedPlus,required,ask,askNet,askNetPlus,grossPct,currentNet,currentHour,askHour}))}catch{}
  };
  nav.addEventListener('click',()=>section.classList.add('hidden'),true);
})();