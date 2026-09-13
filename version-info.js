// Zentrale Versions- und Release-Informationen für WasBinIchWert.
(function initVersionInfo(){
  const APP_VERSION='8.46';
  const RELEASE_NAME='Stabile Beta';
  const RELEASE_DATE='13.09.2026';
  const more=document.getElementById('tab-mehr');
  if(!more||document.getElementById('versionInfo'))return;

  const style=document.createElement('style');
  style.textContent=`
    .version-card{border-color:#cfe0ff;background:#f7faff}
    .version-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .version-head h3{margin-bottom:5px}.version-number{flex:0 0 auto;border-radius:999px;background:#e8efff;color:var(--blue);padding:6px 10px;font-size:11px;font-weight:850}
    .version-meta{color:var(--muted);font-size:11px;line-height:1.4}.version-card details{margin-top:13px;border-top:1px solid #dce7fa;padding-top:12px}
    .version-card summary{cursor:pointer;color:var(--blue);font-size:12px;font-weight:800}.version-card ul{margin:10px 0 0;padding-left:18px;color:#4e5d78;font-size:11.5px;line-height:1.55}
  `;
  document.head.appendChild(style);

  const card=document.createElement('div');
  card.id='versionInfo';
  card.className='card version-card';
  card.innerHTML=`
    <div class="version-head">
      <div><h3>App-Version</h3><div class="version-meta">${RELEASE_NAME} · ${RELEASE_DATE}</div></div>
      <span class="version-number">v${APP_VERSION}</span>
    </div>
    <details>
      <summary>Was ist neu?</summary>
      <ul>
        <li>Erweiterte Berechnungs- und Eingabeprüfungen</li>
        <li>Automatische Tests für Desktop, iPhone und Android</li>
        <li>Visuelle Vergleichstests für die drei Kernrechner</li>
        <li>Vollständige Offline- und Modulprüfung</li>
      </ul>
    </details>`;
  more.appendChild(card);
})();
