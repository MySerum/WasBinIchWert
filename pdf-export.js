// v8.24 – PDF-Bericht PRO: rechte Ausrichtung für Werte und Kopfzeile
function addPdfExportUi(){if($('pdfExportBtn'))return;const result=$('compareResult');if(!result)return;const wrap=document.createElement('div');wrap.className='pdf-export-card';wrap.innerHTML=`<div><strong>PDF-Bericht <span class="pro-badge">PRO</span></strong><small>Jobvergleich als echte PDF-Datei speichern oder teilen.</small></div><button type="button" id="pdfExportBtn">PDF-Bericht erstellen</button>`;result.appendChild(wrap);$('pdfExportBtn').onclick=createPdfReport}
function safePdfText(v){return String(v??'').replace(/−/g,'-').replace(/–/g,'-').replace(/…/g,'...').replace(/✓/g,'').trim()}
function wrapPdfText(text,font,size,maxWidth){const words=safePdfText(text).split(/\s+/),lines=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(font.widthOfTextAtSize(test,size)<=maxWidth)line=test;else{if(line)lines.push(line);line=w}}if(line)lines.push(line);return lines}
async function createPdfReport(){
  const btn=$('pdfExportBtn');const old=btn.textContent;btn.disabled=true;btn.textContent='PDF wird erstellt ...';
  try{
    const {PDFDocument,StandardFonts,rgb}=await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm');
    const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
    const navy=rgb(13/255,27/255,42/255),gold=rgb(212/255,167/255,44/255),green=rgb(21/255,153/255,71/255),muted=rgb(.40,.45,.54),line=rgb(.88,.91,.94),soft=rgb(.95,.98,.96);
    const a=job('A'),b=job('B'),na=$('nameA').value||'Job A',nb=$('nameB').value||'Job B',winner=b.effectiveNetHour>a.effectiveNetHour?nb:na;
    const diff=(bv,av,d=0)=>{const x=bv-av;return `${x>=0?'+':'-'}${eur(Math.abs(x),d)}`};
    const rows=[['Monatsbrutto',eur(a.g,0),eur(b.g,0),diff(b.g,a.g)],['Monatsnetto',eur(a.n,0),eur(b.n,0),diff(b.n,a.n)],['Wochenstunden',`${nf(a.h,1)} h`,`${nf(b.h,1)} h`,`${b.h-a.h>=0?'+':'-'}${nf(Math.abs(b.h-a.h),1)} h`],['Urlaub/Jahr',`${nf(a.vacation,0)} Tage`,`${nf(b.vacation,0)} Tage`,`${b.vacation-a.vacation>=0?'+':'-'}${nf(Math.abs(b.vacation-a.vacation),0)}`],['Netto/Stunde',eur(a.nh),eur(b.nh),diff(b.nh,a.nh,2)],['Gebundene Zeit/Jahr',`${nf(a.effectiveHours,0)} h`,`${nf(b.effectiveHours,0)} h`,`${b.effectiveHours-a.effectiveHours>=0?'+':'-'}${nf(Math.abs(b.effectiveHours-a.effectiveHours),0)} h`],['Pendelkosten/Jahr',eur(a.commuteCost,0),eur(b.commuteCost,0),diff(b.commuteCost,a.commuteCost)],['Weitere Kosten/Jahr',eur(a.extraCosts,0),eur(b.extraCosts,0),diff(b.extraCosts,a.extraCosts)],['Sonderzahlung netto',eur(a.special.net,0),eur(b.special.net,0),diff(b.special.net,a.special.net)],['Benefits/Jahr',eur(a.benefits.annual,0),eur(b.benefits.annual,0),diff(b.benefits.annual,a.benefits.annual)],['Homeoffice-Ersparnis',eur(a.homeSavings,0),eur(b.homeSavings,0),diff(b.homeSavings,a.homeSavings)],['Effektiver Jahreswert',eur(a.effectiveAnnualNet,0),eur(b.effectiveAnnualNet,0),diff(b.effectiveAnnualNet,a.effectiveAnnualNet)],['Effektiv netto/Stunde',eur(a.effectiveNetHour),eur(b.effectiveNetHour),diff(b.effectiveNetHour,a.effectiveNetHour,2)]];
    let page=pdf.addPage([595.28,841.89]),{width,height}=page.getSize(),y=height-46;const left=42,right=width-42;
    const text=(t,x,yy,size=10,f=font,c=navy)=>page.drawText(safePdfText(t),{x,y:yy,size,font:f,color:c});
    const textRight=(t,xRight,yy,size=10,f=font,c=navy)=>{const s=safePdfText(t);text(s,xRight-f.widthOfTextAtSize(s,size),yy,size,f,c)};
    const rule=(yy,c=line,w=1)=>page.drawLine({start:{x:left,y:yy},end:{x:right,y:yy},thickness:w,color:c});
    text('WasBin',left,y,22,bold,navy);const w1=bold.widthOfTextAtSize('WasBin',22);text('Ich',left+w1,y,22,bold,gold);const w2=bold.widthOfTextAtSize('Ich',22);text('Wert',left+w1+w2,y,22,bold,navy);text('Deine Zeit ist mehr wert.',left,y-17,9,font,navy);
    textRight('Jobvergleich - PRO',right,y,9,bold,muted);textRight(new Intl.DateTimeFormat('de-DE').format(new Date()),right,y-14,8,font,muted);
    rule(y-27,gold,2);y-=58;
    text('Jobvergleich',left,y,18,bold,navy);y-=20;text(`${na} vs. ${nb}`,left,y,10,font,muted);y-=28;
    page.drawRectangle({x:left,y:y-58,width:right-left,height:58,borderColor:rgb(.74,.89,.78),borderWidth:1,color:soft});text('WasBinIchWert-Bewertung',left+12,y-16,8,bold,green);text(`${winner} liegt insgesamt vorn`,left+12,y-36,14,bold,navy);y-=74;
    const c0=left,c1=left+178,c2=left+295,c3=left+412,c4=right;const rowH=24;
    page.drawRectangle({x:left,y:y-rowH,width:right-left,height:rowH,color:rgb(.965,.975,.99)});
    text('Kennzahl',c0+4,y-16,8,bold,muted);textRight(na,c2-6,y-16,8,bold,muted);textRight(nb,c3-6,y-16,8,bold,muted);textRight('Delta',c4-4,y-16,8,bold,muted);y-=rowH;
    for(let i=0;i<rows.length;i++){
      if(y<150){page=pdf.addPage([595.28,841.89]);({width,height}=page.getSize());y=height-46;text('WasBinIchWert - Jobvergleich',left,y,12,bold,navy);y-=24}
      if(i>=11)page.drawRectangle({x:left,y:y-rowH,width:right-left,height:rowH,color:soft});
      const f=i>=11?bold:font;const r=rows[i];text(r[0],c0+4,y-16,8,f,navy);textRight(r[1],c2-6,y-16,8,f,navy);textRight(r[2],c3-6,y-16,8,f,navy);textRight(r[3],c4-4,y-16,8,f,navy);rule(y-rowH);y-=rowH;
    }
    y-=18;text('Einordnung',left,y,12,bold,navy);y-=18;const decision=$('decisionText')?.textContent||`${winner} erreicht unter den eingegebenen Faktoren den höheren effektiven Netto-Stundenwert.`;for(const l of wrapPdfText(decision,font,9,right-left)){text(l,left,y,9,font,navy);y-=13}
    y-=10;rule(y);y-=15;for(const l of wrapPdfText('Die Berechnung dient der persoenlichen Orientierung. Steuer- und Sozialversicherungswerte koennen durch individuelle Besonderheiten abweichen. Keine Steuer-, Rechts- oder Finanzberatung.',font,7.5,right-left)){text(l,left,y,7.5,font,muted);y-=10}
    const bytes=await pdf.save(),blob=new Blob([bytes],{type:'application/pdf'}),fileName=`WasBinIchWert_${safePdfText(na).replace(/[^A-Za-z0-9_-]+/g,'_')}_vs_${safePdfText(nb).replace(/[^A-Za-z0-9_-]+/g,'_')}.pdf`,file=new File([blob],fileName,{type:'application/pdf'});
    if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'WasBinIchWert Jobvergleich',text:`${na} vs. ${nb}`})}
    else{const url=URL.createObjectURL(blob),aEl=document.createElement('a');aEl.href=url;aEl.download=fileName;document.body.appendChild(aEl);aEl.click();aEl.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  }catch(e){console.error(e);alert('Die PDF konnte nicht erstellt werden. Bitte erneut versuchen.')}
  finally{btn.disabled=false;btn.textContent=old}
}
addPdfExportUi();
