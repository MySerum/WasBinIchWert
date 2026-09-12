// WasBinIchWert v8.45 – konsistente Höhen für Aktionsbuttons und Formfelder
(function initUiConsistency(){
  if(document.getElementById('wiwUiConsistencyStyles'))return;
  const style=document.createElement('style');
  style.id='wiwUiConsistencyStyles';
  style.textContent=`
    /* Aktionspaare: beide Buttons immer exakt gleich hoch. */
    .result-export-actions,.salary-actions,.neg-actions{align-items:stretch}
    .result-export-actions>button,.salary-actions>button,.neg-actions>button{
      box-sizing:border-box;
      height:56px;
      min-height:56px;
      margin:0!important;
      padding:0 14px!important;
      display:flex;
      align-items:center;
      justify-content:center;
      line-height:1.2;
    }

    /* Gehaltsentwicklung / Verhandlung: Input und Select identische Feldhöhe. */
    #tab-gehalt .field,#tab-verhandlung .field{
      min-height:48px;
    }
    #tab-gehalt .field>input,#tab-gehalt .field>select,
    #tab-verhandlung .field>input,#tab-verhandlung .field>select{
      box-sizing:border-box;
      height:48px;
      min-height:48px;
      padding-top:0!important;
      padding-bottom:0!important;
      line-height:normal;
    }

    /* Safari rendert Selects teils mit abweichender intrinsischer Mindesthöhe. */
    #tab-gehalt select,#tab-verhandlung select{
      max-height:48px;
    }

    @media(max-width:390px){
      .result-export-actions>button,.salary-actions>button,.neg-actions>button{
        height:54px;
        min-height:54px;
      }
    }
  `;
  document.head.appendChild(style);
})();
