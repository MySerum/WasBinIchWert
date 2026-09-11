// WasBinIchWert v8.38 – zentrale Ergebnisansicht: PDF-Zeilenlayout korrigiert
(function initResultExport(){
  const dashboard=document.getElementById('tab-ergebnis');
  if(!dashboard||document.getElementById('resultExportCard'))return;

  const style=document.createElement('style');
  style.textContent=`
    .result-export-card{border:1px solid #cfe0ff;background:#f7faff;margin-top:16px}
    .result-export-card p{font-size:12px;line-height:1.5;color:#56627a;margin:0 0 12px}
    .result-export-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
    .result-export-secondary{border:1px solid #d8deea;background:#fff;color:var(--navy);border-radius:11px;padding:11px 10px;font-size:12px;font-weight:800}
    @media(max-width:380px){.result-export-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const card=document.createElement('div');
  card.id='resultExportCard';
  card.className='card result-export-card';
  card.innerHTML=`<h3>💾 Speichern & Teilen <span class="pro-badge">PRO</span></h3><p>Erstelle eine kompakte Ergebnis-PDF oder teile die wichtigsten Kennzahlen als Text. Persönliche Steuer- und Versicherungsdetails werden dabei nicht ausgegeben.</p><div class="result-export-actions"><button class="primary" id="resultPdfBtn">PDF-Bericht erstellen</button><button class="result-export-secondary" id="resultShareBtn">Ergebnis teilen</button></div><div id="resultExportStatus" class="salary-note" style="margin-top:10px"></div>`;
  const refresh=document.getElementById('ovRefresh');
  if(refresh)refresh.after(card);else dashboard.appendChild(card);

  const isReady=id=>{const e=document.getElementById(id);return !!(e&&!e.classList.contains('hidden'))};
  // pdf-lib StandardFonts.Helvetica nutzt WinAnsi. Zeichen wie Pfeile oder Emojis
  // führen sonst beim drawText zu einem Fehler. Deshalb PDF-Texte bewusst normalisieren.
  const safe=v=>String(v??'')
    .replace(/→/g,'->').replace(/←/g,'<-').replace(/↔/g,'<->')
    .replace(/[−–—]/g,'-').replace(/…/g,'...').replace(/✓/g,'')
    .replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/•/g,'-')
    .replace(/\u00a0/g,' ').replace(/[\u2000-\u200f\u2028-\u202f\u2060\ufeff]/g,' ')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu,'')
    .trim();
  const dateStamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
  const downloadBlob=(blob,name)=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)};
  const mobileShare=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

  function collect(){
    const g=Math.max(0,typeof monthGross==='function'?monthGross():0),h=Math.max(0,+($('hours')?.value||0)),mh=h*52/12,n=calcNet(g),nh=mh?n/mh:0;
    const data={date:new Intl.DateTimeFormat('de-DE').format(new Date()),current:{gross:g,net:n,hours:h,monthHours:mh,grossHour:mh?g/mh:0,netHour:nh}};

    if(isReady('parttimeResult')&&$('ptGross')&&$('ptHoursNow')&&$('ptHoursNew')){
      const pg=Math.max(0,+$('ptGross').value||0),hn=Math.max(0,+$('ptHoursNow').value||0),hz=Math.max(0,+$('ptHoursNew').value||0);
      if(pg&&hn&&hz>0&&hz<hn){const gn=pg*hz/hn,nn=calcNet(gn),loss=calcNet(pg)-nn,freeYear=(hn-hz)*52,cost=loss/((hn-hz)*52/12);data.parttime={from:hn,to:hz,gross:gn,net:nn,lossMonth:loss,freeYear,costHour:cost};}
    }

    if(isReady('compareResult')&&typeof job==='function'){
      try{const a=job('A'),b=job('B'),na=$('nameA')?.value||'Job A',nb=$('nameB')?.value||'Job B',winner=b.effectiveNetHour>a.effectiveNetHour?nb:na;data.compare={na,nb,aHour:a.effectiveNetHour,bHour:b.effectiveNetHour,winner,diff:Math.abs(b.effectiveNetHour-a.effectiveNetHour)};}catch{}
    }

    if(isReady('targetResult')&&$('targetHours')&&$('targetHour')){
      const th=Math.max(0,+$('targetHours').value||0),t=Math.max(0,+$('targetHour').value||0);if(th&&t){const target=t*th*52/12,tg=findGross(target);data.target={hours:th,netHour:t,grossMonth:tg,grossYear:tg*12};}
    }

    try{const x=JSON.parse(localStorage.getItem('wasbinichwert-salary-growth-v1')||'null');if(x&&Number.isFinite(+x.endHour))data.growth=x;}catch{}
    try{const x=JSON.parse(localStorage.getItem('wasbinichwert-negotiation-v1')||'null');if(x&&Number.isFinite(+x.ask))data.negotiation=x;}catch{}
    return data;
  }

  function shareText(d){
    const parts=[`WasBinIchWert – Dein Job auf einen Blick`,`Stand: ${d.date}`,`Aktuell: ${eur(d.current.gross,0)} brutto · ${eur(d.current.net,0)} netto · ${nf(d.current.hours,1)} Std./Woche · ${eur(d.current.netHour)} netto/Std.`];
    if(d.parttime)parts.push(`Teilzeit ${nf(d.parttime.from,1)} → ${nf(d.parttime.to,1)} Std.: ${eur(d.parttime.net,0)} netto/Monat · ${eur(d.parttime.lossMonth,0)} weniger · ${nf(d.parttime.freeYear,0)} Std. mehr Freizeit/Jahr · ${eur(d.parttime.costHour)} je freier Stunde.`);
    if(d.compare)parts.push(`Jobvergleich: ${d.compare.winner} hat den höheren effektiven Jobwert (${eur(d.compare.diff)}/Std. Vorsprung).`);
    if(d.target)parts.push(`Wunschgehalt: Für ${eur(d.target.netHour)} netto/Std. bei ${nf(d.target.hours,1)} Std./Woche etwa ${eur(d.target.grossMonth,0)} brutto/Monat.`);
    if(d.growth)parts.push(`Gehaltsentwicklung: Netto-Stundenwert am Ende ${eur(+d.growth.endHour)}; zusätzliches Netto im Zeitraum ${eur(+d.growth.extra,0)}.`);
    if(d.negotiation)parts.push(`Gehaltsverhandlung: Forderung ${eur(+d.negotiation.ask,0)} brutto/Monat · voraussichtlich ${eur(+d.negotiation.askNetPlus,0)} netto mehr/Monat.`);
    parts.push('Modellrechnung zur persönlichen Orientierung – keine Steuer-, Rechts- oder Finanzberatung.');
    return parts.join('\n\n');
  }

  async function shareResult(){
    const d=collect(),text=shareText(d),status=$('resultExportStatus');
    try{
      if(navigator.share){await navigator.share({title:'WasBinIchWert – Dein Job auf einen Blick',text});status.textContent='✓ Teilen-Menü geöffnet.';}
      else if(navigator.clipboard){await navigator.clipboard.writeText(text);status.textContent='✓ Ergebnistext in die Zwischenablage kopiert.';}
      else{status.textContent='Teilen wird von diesem Browser nicht unterstützt.';}
    }catch(e){if(e?.name!=='AbortError')status.textContent='Teilen konnte nicht gestartet werden.';}
  }

  async function createResultPdf(){
    const btn=$('resultPdfBtn'),status=$('resultExportStatus'),old=btn.textContent;btn.disabled=true;btn.textContent='PDF wird erstellt …';status.textContent='';
    try{
      const d=collect();
      const {PDFDocument,StandardFonts,rgb}=await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm');
      const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
      const navy=rgb(13/255,27/255,42/255),gold=rgb(212/255,167/255,44/255),green=rgb(21/255,153/255,71/255),muted=rgb(.40,.45,.54),line=rgb(.90,.92,.95),soft=rgb(.95,.98,.96),purple=rgb(.49,.13,.81);
      let page=pdf.addPage([595.28,841.89]),{width,height}=page.getSize(),y=height-46;const left=42,right=width-42,maxW=right-left;
      const draw=(t,x,yy,size=9,f=font,c=navy)=>page.drawText(safe(t),{x,y:yy,size,font:f,color:c});
      const rightText=(t,xr,yy,size=9,f=font,c=navy)=>{const s=safe(t);draw(s,xr-f.widthOfTextAtSize(s,size),yy,size,f,c)};
      const rule=(yy,c=line,w=1)=>page.drawLine({start:{x:left,y:yy},end:{x:right,y:yy},thickness:w,color:c});
      const wrap=(t,size=9,max=maxW)=>{const words=safe(t).split(/\s+/),out=[];let l='';for(const w of words){const q=l?l+' '+w:w;if(font.widthOfTextAtSize(q,size)<=max)l=q;else{if(l)out.push(l);l=w}}if(l)out.push(l);return out};
      const newPage=()=>{page=pdf.addPage([595.28,841.89]);({width,height}=page.getSize());y=height-46;draw('WasBinIchWert - Dein Job auf einen Blick',left,y,10,bold,navy);y-=22;};
      const ensure=(need=60)=>{if(y-need<45)newPage();};
      const section=(title,rows,color=navy)=>{
        const rowH=26,titleGap=22,lineOffset=12;
        ensure(38+rows.length*rowH);
        draw(title,left,y,12,bold,color);
        y-=titleGap;
        for(const [k,v] of rows){
          draw(k,left,y,8,font,muted);
          rightText(v,right,y,9,bold,navy);
          rule(y-lineOffset);
          y-=rowH;
        }
        y-=6;
      };

      draw('WasBin',left,y,22,bold,navy);const w1=bold.widthOfTextAtSize('WasBin',22);draw('Ich',left+w1,y,22,bold,gold);const w2=bold.widthOfTextAtSize('Ich',22);draw('Wert',left+w1+w2,y,22,bold,navy);draw('Deine Zeit ist mehr wert.',left,y-17,9,font,navy);rightText('Ergebnisbericht - PRO',right,y,9,bold,muted);rightText(d.date,right,y-14,8,font,muted);rule(y-27,gold,2);y-=58;

      page.drawRectangle({x:left,y:y-64,width:maxW,height:64,borderColor:rgb(.74,.89,.78),borderWidth:1,color:soft});draw('DEIN AKTUELLER NETTO-STUNDENWERT',left+12,y-17,8,bold,green);draw(eur(d.current.netHour),left+12,y-43,22,bold,green);rightText(`${eur(d.current.net,0)} netto / Monat`,right-12,y-28,10,bold,navy);rightText(`${nf(d.current.hours,1)} Std. / Woche`,right-12,y-44,9,font,muted);y-=82;

      section('Aktuelles Modell',[['Brutto / Monat',eur(d.current.gross,0)],['Netto / Monat',eur(d.current.net,0)],['Brutto / Stunde',eur(d.current.grossHour)],['Netto / Stunde',eur(d.current.netHour)],['Durchschnitt Stunden / Monat',nf(d.current.monthHours,1)+' Std.']]);
      if(d.parttime)section('Teilzeit',[['Modell',`${nf(d.parttime.from,1)} -> ${nf(d.parttime.to,1)} Std.`],['Teilzeit-Netto / Monat',eur(d.parttime.net,0)],['Netto weniger / Monat','- '+eur(d.parttime.lossMonth,0)],['Mehr Freizeit / Jahr','+ '+nf(d.parttime.freeYear,0)+' Std.'],['Preis je freier Stunde',eur(d.parttime.costHour)]],purple);
      if(d.compare)section('Jobvergleich',[['Job A',`${d.compare.na}: ${eur(d.compare.aHour)}/Std.`],['Job B',`${d.compare.nb}: ${eur(d.compare.bHour)}/Std.`],['Hoeherer effektiver Jobwert',d.compare.winner],['Vorsprung',eur(d.compare.diff)+'/Std.']],purple);
      if(d.target)section('Wunschgehalt',[['Ziel Netto / Stunde',eur(d.target.netHour)],['Wochenstunden',nf(d.target.hours,1)+' Std.'],['Benoetigtes Monatsbrutto',eur(d.target.grossMonth,0)],['Benoetigtes Jahresbrutto',eur(d.target.grossYear,0)]],purple);
      if(d.growth)section('Gehaltsentwicklung',[['Zeitraum',nf(+d.growth.years,0)+' Jahre'],['End-Brutto / Monat',eur(+d.growth.endGross,0)],['End-Netto / Monat',eur(+d.growth.endNet,0)],['Netto-Stundenwert am Ende',eur(+d.growth.endHour)],['Zusaetzliches Netto gesamt',eur(+d.growth.extra,0)]],purple);
      if(d.negotiation)section('Gehaltsverhandlung',[['Aktuelles Brutto / Monat',eur(+d.negotiation.gross,0)],['Rechnerische Forderung',eur(+d.negotiation.ask,0)],['Netto bei Forderung',eur(+d.negotiation.askNet,0)],['Netto-Plus / Monat','+ '+eur(+d.negotiation.askNetPlus,0)],['Netto-Stundenwert nachher',eur(+d.negotiation.askHour)]],gold);

      const assessment=shareText(d).split('\n\n').slice(2,-1).join(' '),assessmentLines=wrap(assessment,8.5),notice='Dieser Bericht enthaelt bewusst keine Angaben zu Steuerklasse, Kindern, Krankenversicherung oder anderen persoenlichen Steuer- und Versicherungsmerkmalen. Die Berechnung dient der persoenlichen Orientierung und ersetzt keine Steuer-, Rechts- oder Finanzberatung.',noticeLines=wrap(notice,7.3);
      ensure(36+assessmentLines.length*12+20);draw('WasBinIchWert-Bewertung',left,y,12,bold,purple);y-=18;for(const l of assessmentLines){if(y<55)newPage();draw(l,left,y,8.5,font,navy);y-=12}y-=8;ensure(25+noticeLines.length*10);rule(y);y-=14;for(const l of noticeLines){if(y<50)newPage();draw(l,left,y,7.3,font,muted);y-=10}

      const bytes=await pdf.save(),blob=new Blob([bytes],{type:'application/pdf'}),fileName=`WasBinIchWert_Ergebnis_${dateStamp()}.pdf`;
      if(typeof File!=='undefined'){
        const file=new File([blob],fileName,{type:'application/pdf'});
        if(mobileShare()&&navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'WasBinIchWert – Ergebnisbericht',text:'Dein Job auf einen Blick'});status.textContent='✓ PDF erstellt.';return;}catch(e){if(e?.name==='AbortError'){status.textContent='';return;}}}
      }
      downloadBlob(blob,fileName);status.textContent='✓ PDF erstellt.';
    }catch(e){console.error('Result PDF export failed:',e);status.textContent=`Die PDF konnte nicht erstellt werden${e?.message?' ('+safe(e.message).slice(0,90)+')':''}. Bitte erneut versuchen.`;}
    finally{btn.disabled=false;btn.textContent=old;}
  }

  $('resultShareBtn').onclick=shareResult;
  $('resultPdfBtn').onclick=createResultPdf;
})();