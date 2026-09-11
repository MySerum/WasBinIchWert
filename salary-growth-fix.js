// v8.34 – Fix für die grafische Gehaltsentwicklung
(function(){
  const btn=document.getElementById('sgCalc');
  if(!btn) return;

  function renderSalaryGrowthBars(){
    const box=document.getElementById('sgBars');
    if(!box) return;

    const start=Math.max(0,+document.getElementById('sgGross')?.value||0);
    const hours=Math.max(0,+document.getElementById('sgHours')?.value||0);
    const rate=Math.max(0,+document.getElementById('sgRate')?.value||0)/100;
    const years=Math.max(1,+document.getElementById('sgYears')?.value||5);
    const first=Math.max(0,+document.getElementById('sgFirstRaise')?.value||0);
    if(!start||!hours||typeof calcNet!=='function') return;

    const mh=hours*52/12;
    let gross=start;
    const values=[{label:'Heute',hour:calcNet(start)/mh}];

    for(let y=1;y<=years;y++){
      if(y===1&&first>0) gross+=first;
      if(rate>0) gross*=1+rate;
      values.push({label:'Jahr '+y,hour:calcNet(gross)/mh});
    }

    const max=Math.max(...values.map(v=>v.hour),0);
    box.innerHTML=values.map(v=>{
      const width=max>0?Math.max(4,Math.min(100,v.hour/max*100)):4;
      return `<div class="salary-bar"><b>${v.label}</b><div class="salary-track"><div class="salary-fill" style="width:${width.toFixed(2)}%"></div></div><strong>${eur(v.hour)}</strong></div>`;
    }).join('');
  }

  btn.addEventListener('click',()=>queueMicrotask(renderSalaryGrowthBars));
})();