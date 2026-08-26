// v8.14 – Ein-Blick-Tabelle, Entscheidungsbewertung und geführte PRO-Eingabe
function ensureEffectiveComparisonTable(){
  if($('effectiveComparisonTable'))return;
  const card=$('effectiveSummary')?.closest('.card');if(!card)return;
  const wrap=document.createElement('div');wrap.id='effectiveComparisonTable';wrap.className='comparison-table-wrap';wrap.innerHTML=`<div class="comparison-table-title">Vergleich im Überblick</div><div class="comparison-job-legend"><span><b>A</b> <span id="tableLegendA">Job A</span></span><span><b>B</b> <span id="tableLegendB">Job B</span></span></div><div class="comparison-table-frame"><table class="comparison-table compact"><colgroup><col class="metric-col"><col class="value-col"><col class="value-col"><col class="diff-col"></colgroup><thead><tr><th>Wert</th><th>A</th><th>B</th><th>Δ</th></tr></thead><tbody id="effectiveTableBody"></tbody></table></div><div class="comparison-table-note">Δ = Job B minus Job A · Kosten: weniger ist besser</div>`;$('effectiveSummary').before(wrap);
}
function ensureDecisionCard(){if($('decisionCard'))return;const summary=$('effectiveSummary');if(!summary)return;const d=document.createElement('div');d.id='decisionCard';d.className='decision-card';d.innerHTML='<div class="decision-eyebrow">WasBinIchWert-Bewertung</div><div id="decisionTitle" class="decision-title"></div><div id="decisionGrid" class="decision-grid"></div><div id="decisionText" class="decision-text"></div>';summary.before(d)}
function improveProUx(){
  ['A','B'].forEach(w=>{
    const root=$('special'+w)?.closest('details.advanced');if(!root||root.dataset.ux==='1')return;root.dataset.ux='1';
    const mainGrid=root.querySelector(':scope > .grid2');if(!mainGrid)return;
    const groups=[
      ['⏱ Zeit & Arbeitsmodell',['days'+w,'vac'+w,'home'+w,'ot'+w]],
      ['🚗 Arbeitsweg',['km'+w,'min'+w,'kmCost'+w]],
      ['💶 Sonderzahlungen',['special'+w,'specialMonth'+w]],
      ['🎁 Benefits',['benefit_ticket'+w,'benefit_meal'+w,'benefit_bike'+w,'benefit_pension'+w,'benefit_car'+w,'benefit_other'+w]],
      ['🧾 Reale Kosten & Ersparnisse',['parking'+w,'food'+w,'childcare'+w,'homeSaving'+w]]
    ];
    const box=document.createElement('div');box.className='pro-groups';root.appendChild(box);
    groups.forEach(([title,ids],idx)=>{const els=ids.map(id=>$(id)?.closest('div')).filter(Boolean);if(!els.length)return;const sec=document.createElement('details');sec.className='pro-section';if(idx===0)sec.open=true;sec.innerHTML=`<summary>${title}<span>›</span></summary><div class="pro-section-grid grid2"></div>`;const grid=sec.querySelector('.pro-section-grid');els.forEach(el=>grid.appendChild(el));box.appendChild(sec)});
    [...mainGrid.children].forEach(el=>{if(!el.querySelector?.('input,select')&&el.textContent.trim())el.remove()});
    if(!mainGrid.querySelector('input,select'))mainGrid.remove();
    const hint=document.createElement('div');hint.className='pro-ux-hint';hint.textContent='Nur relevante Bereiche öffnen und ausfüllen. Nicht benötigte Werte können auf 0 bleiben.';root.querySelector('summary').after(hint);
  });
}
ensureEffectiveComparisonTable();ensureDecisionCard();improveProUx();
const baseCompareHandler=$('calcCompare').onclick;
$('calcCompare').onclick=()=>{
  if(typeof baseCompareHandler==='function')baseCompareHandler();
  const a=job('A'),b=job('B'),na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B';ensureEffectiveComparisonTable();ensureDecisionCard();$('tableLegendA').textContent=na;$('tableLegendB').textContent=nb;
  const dm=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${eur(Math.abs(d),0)}`},dm2=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${eur(Math.abs(d),2)}`},dh=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${nf(Math.abs(d),0)}h`};const row=(label,title,av,bv,diff,kind='neutral')=>`<tr class="${kind}"><td title="${title}">${label}</td><td>${av}</td><td>${bv}</td><td>${diff}</td></tr>`;
  $('effectiveTableBody').innerHTML=[row('Netto/Mon.','Monatsnetto',eur(a.n,0),eur(b.n,0),dm(b.n,a.n),'income'),row('Netto/Std.','Netto-Stundenwert',eur(a.nh),eur(b.nh),dm2(b.nh,a.nh),'income'),row('Eff. €/Std.','Effektiver Netto-Stundenwert',eur(a.effectiveNetHour),eur(b.effectiveNetHour),dm2(b.effectiveNetHour,a.effectiveNetHour),'highlight'),row('Zeit/Jahr','Tatsächlich gebundene Zeit pro Jahr',`${nf(a.effectiveHours,0)}h`,`${nf(b.effectiveHours,0)}h`,dh(b.effectiveHours,a.effectiveHours),'cost'),row('Pendeln','Pendelkosten pro Jahr',eur(a.commuteCost,0),eur(b.commuteCost,0),dm(b.commuteCost,a.commuteCost),'cost'),row('Zus. Kosten','Weitere reale Kosten pro Jahr',eur(a.extraCosts,0),eur(b.extraCosts,0),dm(b.extraCosts,a.extraCosts),'cost'),row('Bonus netto','Sonderzahlung netto',eur(a.special.net,0),eur(b.special.net,0),dm(b.special.net,a.special.net),'income'),row('Benefits','Benefits gesamt pro Jahr',eur(a.benefits.annual,0),eur(b.benefits.annual,0),dm(b.benefits.annual,a.benefits.annual),'income'),row('HO-Erspar.','Homeoffice-Ersparnis pro Jahr',eur(a.homeSavings,0),eur(b.homeSavings,0),dm(b.homeSavings,a.homeSavings),'income'),row('Eff. Jahr','Effektiver Jahreswert',eur(a.effectiveAnnualNet,0),eur(b.effectiveAnnualNet,0),dm(b.effectiveAnnualNet,a.effectiveAnnualNet),'highlight')].join('');
  const winner=b.effectiveNetHour>a.effectiveNetHour?nb:na,loser=winner===nb?na:nb,yearDiff=b.effectiveAnnualNet-a.effectiveAnnualNet,timeDiff=b.effectiveHours-a.effectiveHours,hourDiff=b.effectiveNetHour-a.effectiveNetHour,netDiff=b.n-a.n,winnerIsB=winner===nb,moneyAdv=winnerIsB?yearDiff:-yearDiff,timeAdv=winnerIsB?-timeDiff:timeDiff,hourAdv=Math.abs(hourDiff);$('decisionTitle').textContent=`${winner} liegt insgesamt vorn`;$('decisionGrid').innerHTML=`<div><span>Eff. Vorteil</span><strong>+${eur(hourAdv)}</strong><small>je gebundener Std.</small></div><div><span>Jahreswert</span><strong>${moneyAdv>=0?'+':'−'}${eur(Math.abs(moneyAdv),0)}</strong><small>gegenüber ${loser}</small></div><div><span>Zeit</span><strong>${timeAdv>=0?'−':'+'}${nf(Math.abs(timeAdv),0)} h</strong><small>${timeAdv>=0?'weniger':'mehr'} gebunden/Jahr</small></div>`;
  let msg=`Unter den eingegebenen Faktoren liefert ${winner} den höheren Gegenwert pro tatsächlich gebundener Stunde.`;if(moneyAdv>100&&timeAdv>5)msg+=' Gleichzeitig bietet der Job einen höheren effektiven Jahreswert und benötigt weniger Zeit.';else if(moneyAdv< -100&&timeAdv>5)msg+=' Dafür ist der effektive Jahreswert niedriger – du tauschst also Einkommen gegen mehr freie Zeit.';else if(moneyAdv>100&&timeAdv< -5)msg+=' Dafür bindet er mehr Zeit – der finanzielle Vorteil wird also mit zusätzlichem Zeitaufwand erkauft.';if(Math.abs(netDiff)>50){const monthlyWinner=netDiff>0?nb:na;if(monthlyWinner!==winner)msg+=` Auffällig: ${monthlyWinner} hat zwar das höhere Monatsnetto, gewinnt aber nicht beim effektiven Jobwert.`}$('decisionText').textContent=msg;
};
