// WasBinIchWert v8.43 – Safari-kompatibler pdf-lib Loader
(function initPdfLibLoader(){
  if(window.loadPdfLib)return;
  const SRC='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
  let pending=null;
  window.WIW_PDFLIB_SRC=SRC;
  window.loadPdfLib=function(){
    if(window.PDFLib?.PDFDocument)return Promise.resolve(window.PDFLib);
    if(pending)return pending;
    pending=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=SRC;
      script.async=true;
      script.crossOrigin='anonymous';
      script.dataset.wiwPdflib='1';
      script.onload=()=>window.PDFLib?.PDFDocument?resolve(window.PDFLib):reject(new Error('PDF-Modul wurde geladen, konnte aber nicht initialisiert werden.'));
      script.onerror=()=>reject(new Error('PDF-Modul konnte nicht geladen werden.'));
      document.head.appendChild(script);
    }).catch(err=>{pending=null;document.querySelector('script[data-wiw-pdflib]')?.remove();throw err});
    return pending;
  };
})();
