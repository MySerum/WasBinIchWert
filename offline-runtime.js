// WasBinIchWert v8.42 – Offline-Härtung: Status & Cache-Diagnose
(function initOfflineRuntime(){
  const more=document.getElementById('tab-mehr');
  if(!more||document.getElementById('offlineStatusCard'))return;

  const PAP='https://cdn.jsdelivr.net/npm/lohnsteuerrechner/+esm';
  const PDFLIB='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm';
  const style=document.createElement('style');
  style.textContent=`
    .offline-card{border:1px solid #cfe7d7;background:#f7fcf8}.offline-card p{font-size:12px;line-height:1.5;color:#56627a;margin:0 0 12px}.offline-state{display:grid;gap:7px;margin:10px 0}.offline-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;border-top:1px solid #e5eee8;padding-top:8px;font-size:12px}.offline-row:first-child{border-top:0;padding-top:0}.offline-ok{color:#167a3c;font-weight:850}.offline-warn{color:#9a6815;font-weight:850}.offline-bad{color:#a32929;font-weight:850}.offline-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.offline-secondary{border:1px solid #d8deea;background:#fff;color:var(--navy);border-radius:11px;padding:10px 11px;font-size:12px;font-weight:800}@media(max-width:380px){.offline-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const card=document.createElement('div');
  card.id='offlineStatusCard';card.className='card offline-card';
  card.innerHTML=`<h3>📴 Offline-Bereitschaft</h3><p>WasBinIchWert speichert die App und die benötigten Rechenmodule im Gerätespeicher. Damit bleiben die wichtigsten Funktionen auch ohne Verbindung verfügbar.</p><div class="offline-state"><div class="offline-row"><span>Verbindung</span><strong id="offConnection"></strong></div><div class="offline-row"><span>Steuerberechnung 2026</span><strong id="offTax"></strong></div><div class="offline-row"><span>PDF-Modul</span><strong id="offPdf"></strong></div></div><div class="offline-actions"><button class="primary" id="offPrepare">Offline vorbereiten</button><button class="offline-secondary" id="offRefresh">Status prüfen</button></div><div id="offNote" class="salary-note" style="margin-top:10px"></div>`;
  const pro=document.getElementById('proAccessCard'),help=document.querySelector('.onboarding-help-card');
  if(pro)pro.after(card);else if(help)help.after(card);else more.prepend(card);

  function setState(id,text,kind){const e=document.getElementById(id);if(!e)return;e.textContent=text;e.className=kind==='ok'?'offline-ok':kind==='bad'?'offline-bad':'offline-warn'}
  async function status(){
    setState('offConnection',navigator.onLine?'Online':'Offline',navigator.onLine?'ok':'warn');
    let tax=false,pdf=false;
    try{tax=!!(await caches.match(PAP));pdf=!!(await caches.match(PDFLIB))}catch{}
    setState('offTax',tax?'gespeichert':'noch nicht',tax?'ok':'warn');
    setState('offPdf',pdf?'gespeichert':'noch nicht',pdf?'ok':'warn');
    const note=document.getElementById('offNote');
    if(!navigator.onLine&&tax)note.textContent='✓ Offline-Modus aktiv. Rechner und bereits lokal gespeicherte App-Funktionen stehen zur Verfügung.';
    else if(tax&&pdf)note.textContent='✓ Für den Offline-Test vorbereitet. Du kannst die Verbindung trennen und die PWA neu öffnen.';
    else note.textContent='Für einen zuverlässigen Offline-Test einmal „Offline vorbereiten“ ausführen, solange eine Internetverbindung besteht.';
  }
  async function prepare(){
    const b=document.getElementById('offPrepare'),old=b.textContent;b.disabled=true;b.textContent='Wird vorbereitet …';
    try{
      if(!navigator.onLine)throw new Error('offline');
      await Promise.all([fetch(PAP,{mode:'cors'}),fetch(PDFLIB,{mode:'cors'})]);
      await status();
    }catch{document.getElementById('offNote').textContent='Offline-Vorbereitung benötigt kurz eine Internetverbindung.'}
    finally{b.disabled=false;b.textContent=old}
  }
  document.getElementById('offPrepare').onclick=prepare;
  document.getElementById('offRefresh').onclick=status;
  window.addEventListener('online',status);window.addEventListener('offline',status);
  setTimeout(status,100);
})();