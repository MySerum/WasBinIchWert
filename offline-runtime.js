// WasBinIchWert v8.44 – echte Offline-Bereitschaft mit lokalen Vendor-Bundles
(function initOfflineRuntime(){
  const more=document.getElementById('tab-mehr');
  if(!more||document.getElementById('offlineStatusCard'))return;

  const TAX='./vendor/lohnsteuerrechner.js';
  const PDFLIB=window.WIW_PDFLIB_SRC||'./vendor/pdf-lib.min.js';
  const SHELL=['./','./index.html','./styles.css','./app.js',TAX,PDFLIB];
  const style=document.createElement('style');
  style.textContent=`
    .offline-card{border:1px solid #cfe7d7;background:#f7fcf8}.offline-card p{font-size:12px;line-height:1.5;color:#56627a;margin:0 0 12px}.offline-state{display:grid;gap:7px;margin:10px 0}.offline-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;border-top:1px solid #e5eee8;padding-top:8px;font-size:12px}.offline-row:first-child{border-top:0;padding-top:0}.offline-ok{color:#167a3c;font-weight:850}.offline-warn{color:#9a6815;font-weight:850}.offline-bad{color:#a32929;font-weight:850}.offline-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.offline-secondary{border:1px solid #d8deea;background:#fff;color:var(--navy);border-radius:11px;padding:10px 11px;font-size:12px;font-weight:800}@media(max-width:380px){.offline-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const card=document.createElement('div');
  card.id='offlineStatusCard';card.className='card offline-card';
  card.innerHTML=`<h3>📴 Offline-Bereitschaft</h3><p>Steuerengine und PDF-Erstellung sind jetzt Bestandteil der App und benötigen keine externe CDN-Verbindung mehr.</p><div class="offline-state"><div class="offline-row"><span>Verbindung</span><strong id="offConnection"></strong></div><div class="offline-row"><span>Service Worker</span><strong id="offWorker"></strong></div><div class="offline-row"><span>App-Dateien</span><strong id="offShell"></strong></div><div class="offline-row"><span>Steuerberechnung 2026</span><strong id="offTax"></strong></div><div class="offline-row"><span>PDF-Modul</span><strong id="offPdf"></strong></div></div><div class="offline-actions"><button class="primary" id="offPrepare">Offline vorbereiten</button><button class="offline-secondary" id="offRefresh">Status prüfen</button></div><div id="offNote" class="salary-note" style="margin-top:10px"></div>`;
  const pro=document.getElementById('proAccessCard'),help=document.querySelector('.onboarding-help-card');
  if(pro)pro.after(card);else if(help)help.after(card);else more.prepend(card);

  const abs=u=>new URL(u,location.href).href;
  function setState(id,text,kind){const e=document.getElementById(id);if(!e)return;e.textContent=text;e.className=kind==='ok'?'offline-ok':kind==='bad'?'offline-bad':'offline-warn'}
  async function has(u){try{return !!((await caches.match(abs(u)))||(await caches.match(u)))}catch{return false}}
  async function status(){
    setState('offConnection',navigator.onLine?'Online':'Offline',navigator.onLine?'ok':'warn');
    const worker=!!navigator.serviceWorker?.controller;
    setState('offWorker',worker?'aktiv':'noch nicht aktiv',worker?'ok':'warn');
    const checks=await Promise.all(SHELL.map(has)),shell=checks.every(Boolean),tax=await has(TAX),pdf=await has(PDFLIB);
    setState('offShell',shell?'vollständig':'unvollständig',shell?'ok':'warn');
    setState('offTax',tax?'lokal gespeichert':'fehlt',tax?'ok':'bad');
    setState('offPdf',pdf?'lokal gespeichert':'fehlt',pdf?'ok':'bad');
    const note=document.getElementById('offNote');
    if(worker&&shell&&tax&&pdf){
      note.textContent=navigator.onLine?'✓ Vollständig offline bereit. Verbindung trennen, App komplett schließen und erneut öffnen.':'✓ Offline-Modus aktiv. Rechner und PDF-Modul stehen lokal zur Verfügung.';
    }else if(!worker){
      note.textContent='Die aktuelle Seite wird noch nicht vom neuen Service Worker gesteuert. App einmal komplett schließen und neu öffnen.';
    }else{
      note.textContent='Noch nicht vollständig vorbereitet. Solange du online bist, „Offline vorbereiten“ ausführen.';
    }
  }
  async function prepare(){
    const b=document.getElementById('offPrepare'),old=b.textContent;b.disabled=true;b.textContent='Wird vorbereitet …';
    const note=document.getElementById('offNote');
    try{
      if(navigator.serviceWorker)await navigator.serviceWorker.ready;
      if(navigator.onLine){
        for(const u of SHELL){try{await fetch(abs(u),{cache:'reload'})}catch{}}
      }
      await new Promise(r=>setTimeout(r,250));
      await status();
    }catch(e){note.textContent='Offline-Vorbereitung konnte nicht abgeschlossen werden. App einmal online neu öffnen und erneut versuchen.'}
    finally{b.disabled=false;b.textContent=old}
  }
  document.getElementById('offPrepare').onclick=prepare;
  document.getElementById('offRefresh').onclick=status;
  window.addEventListener('online',status);window.addEventListener('offline',status);
  navigator.serviceWorker?.addEventListener('controllerchange',()=>setTimeout(status,100));
  setTimeout(status,150);
})();
