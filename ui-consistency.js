// WasBinIchWert v8.45 – UI-Harmonisierung
(function initUiConsistency(){
  if(document.getElementById('wiwUiConsistencyStyles'))return;
  const style=document.createElement('style');
  style.id='wiwUiConsistencyStyles';
  style.textContent=`
    /* Aktionspaare: beide Buttons immer exakt gleich hoch. */
    .result-export-actions,.salary-actions,.neg-actions,.offline-actions{
      align-items:stretch;
    }
    .result-export-actions>button,.salary-actions>button,.neg-actions>button,.offline-actions>button{
      box-sizing:border-box;
      height:56px;
      min-height:56px;
      margin:0!important;
      padding:0 14px!important;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      line-height:1.2;
    }

    /* Gehaltsentwicklung / Verhandlung: identische Außen- und Innenhöhen. */
    #tab-gehalt .field,#tab-verhandlung .field{
      height:48px;
      min-height:48px;
    }
    #tab-gehalt .field>input,#tab-gehalt .field>select,
    #tab-verhandlung .field>input,#tab-verhandlung .field>select{
      box-sizing:border-box;
      height:46px;
      min-height:0;
      margin:0!important;
      padding-top:0!important;
      padding-bottom:0!important;
      font:inherit;
      font-size:16px;
      line-height:normal;
    }

    /* Einheitliche Dropdown-Optik ohne browserabhängige Innenabstände. */
    #tab-gehalt .field>select,#tab-verhandlung .field>select{
      max-height:46px;
      appearance:none;
      -webkit-appearance:none;
      background-color:transparent;
      background-image:
        linear-gradient(45deg,transparent 50%,#68728a 50%),
        linear-gradient(135deg,#68728a 50%,transparent 50%);
      background-position:
        calc(100% - 15px) calc(50% + 1px),
        calc(100% - 10px) calc(50% + 1px);
      background-size:5px 5px,5px 5px;
      background-repeat:no-repeat;
      padding-right:28px!important;
      cursor:pointer;
    }

    /* Ein- und zweizeilige Labels enden auf derselben Grundlinie. */
    @media(min-width:401px){
      #tab-gehalt .grid2>div>label,
      #tab-verhandlung .grid2>div>label{
        min-height:34px;
        display:flex;
        align-items:flex-end;
      }
    }

    /* Abstand zwischen letzter Eingabezeile und unteren Aktionen. */
    .salary-actions,.neg-actions{
      margin-top:16px;
    }

    @media(max-width:390px){
      .result-export-actions>button,.salary-actions>button,.neg-actions>button,.offline-actions>button{
        height:54px;
        min-height:54px;
      }
    }
  `;
  document.head.appendChild(style);
})();
