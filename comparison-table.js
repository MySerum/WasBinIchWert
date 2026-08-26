// v8.9 – Übersichtliche Tabelle für den effektiven Jobwert
function ensureEffectiveComparisonTable(){
  if($('effectiveComparisonTable'))return;
  const card=$('effectiveSummary')?.closest('.card');
  if(!card)return;
  const wrap=document.createElement('div');
  wrap.id='effectiveComparisonTable';
  wrap.className='comparison-table-wrap';
  wrap.innerHTML=`
    <div class="comparison-table-title">Vergleich im Überblick</div>
    <div class="comparison-table-scroll">
      <table class="comparison-table">
        <thead><tr><th>Kennzahl</th><th id="tableHeadA">Job A</th><th id="tableHeadB">Job B</th><th>Differenz</th></tr></thead>
        <tbody id="effectiveTableBody"></tbody>
      </table>
    </div>`;
  const summary=$('effectiveSummary');
  summary.before(wrap);
}
ensureEffectiveComparisonTable();

const baseCompareHandler=$('calcCompare').onclick;
$('calcCompare').onclick=()=>{
  if(typeof baseCompareHandler==='function')baseCompareHandler();
  const a=job('A'),b=job('B');
  const na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B';
  ensureEffectiveComparisonTable();
  $('tableHeadA').textContent=na;
  $('tableHeadB').textContent=nb;

  const diffMoney=(bv,av)=>{const d=bv-av;return `${d>=0?'+ ':'− '}${eur(Math.abs(d),0)}`};
  const diffMoney2=(bv,av)=>{const d=bv-av;return `${d>=0?'+ ':'− '}${eur(Math.abs(d),2)}`};
  const diffHours=(bv,av)=>{const d=bv-av;return `${d>=0?'+ ':'− '}${nf(Math.abs(d),1)} Std.`};
  const row=(label,av,bv,diff,kind='neutral')=>`<tr class="${kind}"><td>${label}</td><td>${av}</td><td>${bv}</td><td>${diff}</td></tr>`;

  const rows=[
    row('Monatsnetto',eur(a.n,0),eur(b.n,0),diffMoney(b.n,a.n),'income'),
    row('Netto-Stundenwert',eur(a.nh),eur(b.nh),diffMoney2(b.nh,a.nh),'income'),
    row('Effektiver Netto-Stundenwert',eur(a.effectiveNetHour),eur(b.effectiveNetHour),diffMoney2(b.effectiveNetHour,a.effectiveNetHour),'highlight'),
    row('Gebundene Zeit/Jahr',`${nf(a.effectiveHours,1)} Std.`,`${nf(b.effectiveHours,1)} Std.`,diffHours(b.effectiveHours,a.effectiveHours),'cost'),
    row('Pendelkosten/Jahr',eur(a.commuteCost,0),eur(b.commuteCost,0),diffMoney(b.commuteCost,a.commuteCost),'cost'),
    row('Weitere Kosten/Jahr',eur(a.extraCosts,0),eur(b.extraCosts,0),diffMoney(b.extraCosts,a.extraCosts),'cost'),
    row('Sonderzahlung netto',eur(a.special.net,0),eur(b.special.net,0),diffMoney(b.special.net,a.special.net),'income'),
    row('Benefits/Jahr',eur(a.benefits.annual,0),eur(b.benefits.annual,0),diffMoney(b.benefits.annual,a.benefits.annual),'income'),
    row('Homeoffice-Ersparnis/Jahr',eur(a.homeSavings,0),eur(b.homeSavings,0),diffMoney(b.homeSavings,a.homeSavings),'income'),
    row('Effektiver Jahreswert',eur(a.effectiveAnnualNet,0),eur(b.effectiveAnnualNet,0),diffMoney(b.effectiveAnnualNet,a.effectiveAnnualNet),'highlight')
  ];
  $('effectiveTableBody').innerHTML=rows.join('');
};
