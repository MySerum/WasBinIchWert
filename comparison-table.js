// v8.10 – Kompakte Ein-Blick-Tabelle für den effektiven Jobwert
function ensureEffectiveComparisonTable(){
  if($('effectiveComparisonTable'))return;
  const card=$('effectiveSummary')?.closest('.card');
  if(!card)return;
  const wrap=document.createElement('div');
  wrap.id='effectiveComparisonTable';
  wrap.className='comparison-table-wrap';
  wrap.innerHTML=`
    <div class="comparison-table-title">Vergleich im Überblick</div>
    <div class="comparison-job-legend"><span><b>A</b> <span id="tableLegendA">Job A</span></span><span><b>B</b> <span id="tableLegendB">Job B</span></span></div>
    <div class="comparison-table-frame">
      <table class="comparison-table compact">
        <colgroup><col class="metric-col"><col class="value-col"><col class="value-col"><col class="diff-col"></colgroup>
        <thead><tr><th>Wert</th><th>A</th><th>B</th><th>Δ</th></tr></thead>
        <tbody id="effectiveTableBody"></tbody>
      </table>
    </div>
    <div class="comparison-table-note">Δ = Job B minus Job A · Kosten: weniger ist besser</div>`;
  $('effectiveSummary').before(wrap);
}
ensureEffectiveComparisonTable();

const baseCompareHandler=$('calcCompare').onclick;
$('calcCompare').onclick=()=>{
  if(typeof baseCompareHandler==='function')baseCompareHandler();
  const a=job('A'),b=job('B');
  const na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B';
  ensureEffectiveComparisonTable();
  $('tableLegendA').textContent=na;
  $('tableLegendB').textContent=nb;

  const dm=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${eur(Math.abs(d),0)}`};
  const dm2=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${eur(Math.abs(d),2)}`};
  const dh=(bv,av)=>{const d=bv-av;return `${d>=0?'+':'−'}${nf(Math.abs(d),0)}h`};
  const row=(label,title,av,bv,diff,kind='neutral')=>`<tr class="${kind}"><td title="${title}">${label}</td><td>${av}</td><td>${bv}</td><td>${diff}</td></tr>`;

  $('effectiveTableBody').innerHTML=[
    row('Netto/Mon.','Monatsnetto',eur(a.n,0),eur(b.n,0),dm(b.n,a.n),'income'),
    row('Netto/Std.','Netto-Stundenwert',eur(a.nh),eur(b.nh),dm2(b.nh,a.nh),'income'),
    row('Eff. €/Std.','Effektiver Netto-Stundenwert',eur(a.effectiveNetHour),eur(b.effectiveNetHour),dm2(b.effectiveNetHour,a.effectiveNetHour),'highlight'),
    row('Zeit/Jahr','Tatsächlich gebundene Zeit pro Jahr',`${nf(a.effectiveHours,0)}h`,`${nf(b.effectiveHours,0)}h`,dh(b.effectiveHours,a.effectiveHours),'cost'),
    row('Pendeln','Pendelkosten pro Jahr',eur(a.commuteCost,0),eur(b.commuteCost,0),dm(b.commuteCost,a.commuteCost),'cost'),
    row('Zus. Kosten','Weitere reale Kosten pro Jahr',eur(a.extraCosts,0),eur(b.extraCosts,0),dm(b.extraCosts,a.extraCosts),'cost'),
    row('Bonus netto','Sonderzahlung netto',eur(a.special.net,0),eur(b.special.net,0),dm(b.special.net,a.special.net),'income'),
    row('Benefits','Benefits gesamt pro Jahr',eur(a.benefits.annual,0),eur(b.benefits.annual,0),dm(b.benefits.annual,a.benefits.annual),'income'),
    row('HO-Erspar.','Homeoffice-Ersparnis pro Jahr',eur(a.homeSavings,0),eur(b.homeSavings,0),dm(b.homeSavings,a.homeSavings),'income'),
    row('Eff. Jahr','Effektiver Jahreswert',eur(a.effectiveAnnualNet,0),eur(b.effectiveAnnualNet,0),dm(b.effectiveAnnualNet,a.effectiveAnnualNet),'highlight')
  ].join('');
};
