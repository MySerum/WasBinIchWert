// WasBinIchWert v8.29 – Teilzeitvergleich, Stufe 1
(function initPartTimeComparison(){
  if(document.getElementById('tab-teilzeit')) return;

  const main=document.querySelector('main');
  const more=document.getElementById('tab-mehr');
  const nav=document.querySelector('nav');
  if(!main||!more||!nav) return;

  const style=document.createElement('style');
  style.textContent=`
    .parttime-hero{border:2px solid #9bd7ae;background:#f2fbf5;border-radius:20px;padding:18px 14px;margin:16px 0;text-align:center}
    .parttime-hero .eyebrow{font-size:11px;font-weight:800;color:#39724b;text-transform:uppercase;letter-spacing:.04em}
    .parttime-hero .big{font-size:31px;line-height:1.08;font-weight:850;color:var(--green);margin:7px 0 4px;font-variant-numeric:tabular-nums}
    .parttime-hero .sub{font-size:12px;color:var(--muted);line-height:1.45}
    .parttime-kpis{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}
    .parttime-kpi{border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px 9px;text-align:center}
    .parttime-kpi span{display:block;font-size:10px;color:var(--muted);line-height:1.3}
    .parttime-kpi strong{display:block;font-size:18px;color:var(--navy);margin-top:5px;font-variant-numeric:tabular-nums}
    .parttime-copy{font-size:12px;line-height:1.5;color:#40506a}
    #parttimeSync{width:100%;border:1px solid #d8deea;background:#f3f6fb;color:var(--navy);border-radius:11px;padding:10px 12px;font-size:12px;font-weight:800;margin-top:12px}
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
    <div class="info"><b>Stufe 1:</b> Das Teilzeit-Brutto wird proportional zu den Wochenstunden berechnet. Deine Angaben aus „Meine Daten“ werden automatisch für die Netto-Berechnung verwendet.</div>

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
    </div>

    <button class="primary" id="calcParttime">Teilzeit vergleichen →</button>

    <div id="parttimeResult" class="hidden">
      <div class="parttime-hero">
        <div class="eyebrow">Preis deiner zusätzlichen Freizeit</div>
        <div class="big" id="ptCostFreeHour"></div>
        <div class="sub" id="ptHeroSub"></div>
      </div>

      <div class="parttime-kpis">
        <div class="parttime-kpi"><span>Netto weniger / Monat</span><strong id="ptNetLossMonth"></strong></div>
        <div class="parttime-kpi"><span>Freie Zeit mehr / Monat</span><strong id="ptFreeMonth"></strong></div>
        <div class="parttime-kpi"><span>Netto weniger / Jahr</span><strong id="ptNetLossYear"></strong></div>
        <div class="parttime-kpi"><span>Freie Zeit mehr / Jahr</span><strong id="ptFreeYear"></strong></div>
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

    const gNew=gNow*(hNew/hNow);
    const nNow=calcNet(gNow),nNew=calcNet(gNew);
    const netLossMonth=Math.max(0,nNow-nNew),netLossYear=netLossMonth*12;
    const freeWeek=hNow-hNew,freeMonth=freeWeek*52/12,freeYear=freeWeek*52;
    const costPerFreeHour=freeMonth?netLossMonth/freeMonth:0;
    const mhNow=hNow*52/12,mhNew=hNew*52/12;
    const hourNow=mhNow?nNow/mhNow:0,hourNew=mhNew?nNew/mhNew:0;
    const freeDaysYear=Math.max(0,dNow-dNew)*52;

    document.getElementById('ptCostFreeHour').textContent=eur(costPerFreeHour);
    document.getElementById('ptHeroSub').textContent=`für jede zusätzlich gewonnene freie Stunde bei ${nf(freeWeek,1)} Std. weniger pro Woche`;
    document.getElementById('ptNetLossMonth').textContent='− '+eur(netLossMonth,0);
    document.getElementById('ptFreeMonth').textContent='+ '+nf(freeMonth,1)+' Std.';
    document.getElementById('ptNetLossYear').textContent='− '+eur(netLossYear,0);
    document.getElementById('ptFreeYear').textContent='+ '+nf(freeYear,0)+' Std.';
    document.getElementById('ptGrossNowOut').textContent=eur(gNow,0);
    document.getElementById('ptGrossNewOut').textContent=eur(gNew,0);
    document.getElementById('ptNetNowOut').textContent=eur(nNow,0);
    document.getElementById('ptNetNewOut').textContent=eur(nNew,0);
    document.getElementById('ptHourNowOut').textContent=eur(hourNow);
    document.getElementById('ptHourNewOut').textContent=eur(hourNew);
    document.getElementById('ptFreeDaysOut').textContent=freeDaysYear?'+ '+nf(freeDaysYear,0)+' Tage':'–';

    const dayText=freeDaysYear?` Wenn du zugleich von ${nf(dNow,0)} auf ${nf(dNew,0)} Arbeitstage pro Woche wechselst, entstehen rechnerisch ${nf(freeDaysYear,0)} zusätzliche arbeitsfreie Tage pro Jahr.`:'';
    summary.textContent=`💡 ${nf(hNow,1)} → ${nf(hNew,1)} Wochenstunden kosten dich nach der aktuellen 2026er Netto-Berechnung rund ${eur(netLossMonth,0)} netto pro Monat. Dafür gewinnst du etwa ${nf(freeMonth,1)} Stunden freie Zeit pro Monat bzw. ${nf(freeYear,0)} Stunden pro Jahr. Eine zusätzliche freie Stunde kostet dich damit ungefähr ${eur(costPerFreeHour)}.${dayText}`;
    result.classList.remove('hidden');
  };

  updatePreview();
})();
