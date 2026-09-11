// WasBinIchWert v8.39 – Onboarding & Einführung
(function initOnboarding(){
  const more=document.getElementById('tab-mehr');
  if(!more||document.getElementById('wbiwOnboarding'))return;

  const STORAGE_KEY='wasbinichwert-onboarding-v1';
  const style=document.createElement('style');
  style.textContent=`
    .onboarding-entry{border:1px solid #cfe0ff;background:#f7faff}
    .onboarding-entry p{font-size:12px;line-height:1.5;color:#56627a;margin:0 0 12px}
    .onboarding-overlay{position:fixed;inset:0;z-index:9999;background:rgba(13,27,42,.56);display:flex;align-items:flex-end;justify-content:center;padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom));backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
    .onboarding-overlay.hidden{display:none}
    .onboarding-sheet{width:min(100%,520px);max-height:min(760px,calc(100dvh - 32px));overflow:auto;background:#fff;border-radius:26px;padding:20px 18px 18px;box-shadow:0 24px 70px rgba(13,27,42,.28)}
    .onboarding-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
    .onboarding-brand{display:flex;align-items:center;gap:9px;font-size:18px;font-weight:850;color:var(--navy)}
    .onboarding-brand img{width:34px;height:34px;object-fit:contain}
    .onboarding-skip{border:0;background:transparent;color:#6c768b;font-size:12px;font-weight:750;padding:8px}
    .onboarding-slide{display:none;min-height:360px}
    .onboarding-slide.active{display:block}
    .onboarding-eyebrow{font-size:11px;font-weight:850;letter-spacing:.05em;text-transform:uppercase;color:#8a6414;margin:6px 0 7px}
    .onboarding-slide h2{font-size:27px;line-height:1.12;margin:0 0 10px;color:var(--navy)}
    .onboarding-slide>p{font-size:14px;line-height:1.55;color:#58647b;margin:0 0 16px}
    .onboarding-hero{border:1px solid #efd18a;background:#fffaf0;border-radius:18px;padding:15px 16px;margin:14px 0}
    .onboarding-hero strong{display:block;color:#8a6414;font-size:16px;margin-bottom:5px}
    .onboarding-hero span{font-size:12px;line-height:1.5;color:#665735}
    .onboarding-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}
    .onboarding-tile{border:1px solid var(--line);border-radius:15px;padding:13px 12px;background:#fff}
    .onboarding-tile b{display:block;font-size:13px;color:var(--navy);margin-bottom:5px}
    .onboarding-tile span{display:block;font-size:11px;line-height:1.4;color:#677187}
    .onboarding-step{display:grid;grid-template-columns:32px 1fr;gap:11px;align-items:start;padding:11px 0;border-bottom:1px solid var(--line)}
    .onboarding-step:last-child{border-bottom:0}
    .onboarding-num{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#eef4ff;color:var(--blue);font-weight:850;font-size:12px}
    .onboarding-step b{display:block;font-size:13px;color:var(--navy);margin-bottom:3px}
    .onboarding-step span{font-size:11px;line-height:1.45;color:#68738a}
    .onboarding-local{display:flex;gap:9px;align-items:flex-start;border:1px solid #cde6d4;background:#f2fbf5;border-radius:14px;padding:12px 13px;margin-top:14px;font-size:11px;line-height:1.45;color:#39724b}
    .onboarding-local b{display:block;margin-bottom:2px}
    .onboarding-progress{display:flex;justify-content:center;gap:6px;margin:15px 0 13px}
    .onboarding-dot{width:7px;height:7px;border-radius:50%;background:#d7dce5;transition:.2s}
    .onboarding-dot.active{width:22px;border-radius:999px;background:#D4A72C}
    .onboarding-actions{display:grid;grid-template-columns:92px 1fr;gap:9px}
    .onboarding-back{border:1px solid #d8deea;background:#f3f6fb;color:var(--navy);border-radius:12px;padding:12px 10px;font-size:13px;font-weight:800}
    .onboarding-next{border:0;background:var(--blue);color:#fff;border-radius:12px;padding:12px 13px;font-size:13px;font-weight:850}
    @media(min-width:700px){.onboarding-overlay{align-items:center}.onboarding-sheet{padding:23px 22px 20px}.onboarding-slide{min-height:350px}}
    @media(max-width:370px){.onboarding-grid{grid-template-columns:1fr}.onboarding-slide h2{font-size:24px}.onboarding-slide{min-height:395px}}
  `;
  document.head.appendChild(style);

  const entry=document.createElement('div');
  entry.className='card onboarding-entry';
  entry.innerHTML='<h3>❓ Einführung & Hilfe</h3><p>Noch einmal ansehen, wie Rechner, Vergleich, Wunschgehalt, Teilzeit und PRO-Funktionen zusammenspielen.</p><button class="primary" id="openOnboarding">Einführung starten →</button>';
  more.appendChild(entry);

  const overlay=document.createElement('div');
  overlay.id='wbiwOnboarding';
  overlay.className='onboarding-overlay hidden';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Einführung in WasBinIchWert');
  overlay.innerHTML=`
    <div class="onboarding-sheet">
      <div class="onboarding-top">
        <div class="onboarding-brand"><img src="./brand-mark.svg" alt=""><span>WasBin<span style="color:#D4A72C">Ich</span>Wert</span></div>
        <button class="onboarding-skip" id="onboardingSkip" type="button">Überspringen</button>
      </div>

      <div class="onboarding-slide active" data-slide="0">
        <div class="onboarding-eyebrow">Willkommen</div>
        <h2>Deine Zeit ist mehr wert.</h2>
        <p>WasBinIchWert zeigt dir nicht nur, was du verdienst. Die App macht sichtbar, <b>was deine Arbeitszeit für dich tatsächlich wert ist</b>.</p>
        <div class="onboarding-hero"><strong>Eine Zahl allein reicht nicht.</strong><span>Gehalt, Arbeitszeit, Pendeln, Urlaub, Homeoffice und freie Zeit können gemeinsam betrachtet werden – damit Entscheidungen vergleichbar werden.</span></div>
        <div class="onboarding-grid"><div class="onboarding-tile"><b>💶 Geld</b><span>Brutto, Netto und echter Stundenwert.</span></div><div class="onboarding-tile"><b>⏱️ Zeit</b><span>Arbeitszeit, Pendeln und gewonnene Freizeit.</span></div></div>
      </div>

      <div class="onboarding-slide" data-slide="1">
        <div class="onboarding-eyebrow">Einmal einrichten</div>
        <h2>„Meine Daten“ gelten überall.</h2>
        <p>Trage deine steuerlichen und sozialversicherungsrelevanten Eckdaten einmal ein. Danach nutzt WasBinIchWert sie automatisch für die verschiedenen Berechnungen.</p>
        <div class="onboarding-step"><div class="onboarding-num">1</div><div><b>Meine Daten prüfen</b><span>Steuerklasse, Bundesland, Kirchensteuer, Krankenversicherung und weitere Eckdaten.</span></div></div>
        <div class="onboarding-step"><div class="onboarding-num">2</div><div><b>Gehalt & Arbeitszeit eingeben</b><span>Damit erhältst du deinen persönlichen Netto-Stundenwert als Ausgangspunkt.</span></div></div>
        <div class="onboarding-local"><span>🔒</span><div><b>Auf deinem Gerät gespeichert</b>Deine Eingaben werden lokal im Browser bzw. in der installierten PWA gespeichert.</div></div>
      </div>

      <div class="onboarding-slide" data-slide="2">
        <div class="onboarding-eyebrow">Die Kernfunktionen</div>
        <h2>Vier Wege zu einer besseren Entscheidung.</h2>
        <div class="onboarding-grid">
          <div class="onboarding-tile"><b>▣ Rechner</b><span>Was ist deine Arbeitsstunde netto wert?</span></div>
          <div class="onboarding-tile"><b>⚖ Vergleich</b><span>Welcher Job ist für Geld und Zeit wirklich besser?</span></div>
          <div class="onboarding-tile"><b>🎯 Wunschgehalt</b><span>Welches Brutto brauchst du für deinen Ziel-Stundenwert?</span></div>
          <div class="onboarding-tile"><b>◷ Teilzeit</b><span>Was kostet weniger Arbeit – und wie viel Freizeit gewinnst du?</span></div>
        </div>
        <div class="onboarding-hero"><strong>Dein Job auf einen Blick</strong><span>Unter „Mehr“ führt die zentrale Ergebnisansicht deine bereits berechneten Szenarien zusammen.</span></div>
      </div>

      <div class="onboarding-slide" data-slide="3">
        <div class="onboarding-eyebrow">Mehr Tiefe mit PRO</div>
        <h2>Wenn du genauer entscheiden willst.</h2>
        <p>PRO erweitert die einfache Gehaltsrechnung um die Faktoren, die im Alltag oft den eigentlichen Unterschied machen.</p>
        <div class="onboarding-grid">
          <div class="onboarding-tile"><b>💎 Effektiver Jobwert</b><span>Pendeln, Urlaub, Homeoffice, Kosten, Benefits und mehr.</span></div>
          <div class="onboarding-tile"><b>📈 Gehaltsentwicklung</b><span>Brutto, Netto und Stundenwert über mehrere Jahre modellieren.</span></div>
          <div class="onboarding-tile"><b>🗣️ Verhandlung</b><span>Bruttoforderung und gewünschtes Netto-Plus vorbereiten.</span></div>
          <div class="onboarding-tile"><b>📄 PDF & Teilen</b><span>Ergebnisse speichern und kompakt weitergeben.</span></div>
        </div>
        <div class="onboarding-local"><span>✓</span><div><b>Aktuelle Testphase</b>Zurzeit bleiben alle Funktionen zum Testen freigeschaltet. Eine spätere PRO-Freischaltung ist noch nicht aktiv.</div></div>
      </div>

      <div class="onboarding-progress" aria-hidden="true"><span class="onboarding-dot active"></span><span class="onboarding-dot"></span><span class="onboarding-dot"></span><span class="onboarding-dot"></span></div>
      <div class="onboarding-actions"><button class="onboarding-back" id="onboardingBack" type="button">Zurück</button><button class="onboarding-next" id="onboardingNext" type="button">Weiter →</button></div>
    </div>`;
  document.body.appendChild(overlay);

  const slides=[...overlay.querySelectorAll('.onboarding-slide')];
  const dots=[...overlay.querySelectorAll('.onboarding-dot')];
  const back=overlay.querySelector('#onboardingBack');
  const next=overlay.querySelector('#onboardingNext');
  const skip=overlay.querySelector('#onboardingSkip');
  let current=0;

  function render(){
    slides.forEach((el,i)=>el.classList.toggle('active',i===current));
    dots.forEach((el,i)=>el.classList.toggle('active',i===current));
    back.style.visibility=current===0?'hidden':'visible';
    next.textContent=current===slides.length-1?'Meine Daten prüfen →':'Weiter →';
    overlay.querySelector('.onboarding-sheet').scrollTop=0;
  }

  function openTour(){
    current=0;render();overlay.classList.remove('hidden');document.body.style.overflow='hidden';setTimeout(()=>next.focus(),30);
  }

  function finish(goToSettings=false){
    try{localStorage.setItem(STORAGE_KEY,'done')}catch{}
    overlay.classList.add('hidden');document.body.style.overflow='';
    if(goToSettings){
      const navBtn=document.querySelector('nav button[data-tab="rechner"]');
      navBtn?.click();
      const panel=document.getElementById('settingsPanel'),toggle=document.getElementById('toggleSettings');
      if(panel?.classList.contains('hidden'))toggle?.click();
      document.querySelector('.settings-head')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  back.onclick=()=>{if(current>0){current--;render();}};
  next.onclick=()=>{if(current<slides.length-1){current++;render();}else finish(true);};
  skip.onclick=()=>finish(false);
  document.getElementById('openOnboarding').onclick=openTour;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.classList.contains('hidden'))finish(false);});

  render();
  let seen=false;try{seen=localStorage.getItem(STORAGE_KEY)==='done'}catch{}
  if(!seen)setTimeout(openTour,350);
})();