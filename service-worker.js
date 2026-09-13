// v8.45 – UI-Harmonisierung einschließlich Offline-Aktionsbuttons; aktualisiert den bestehenden v845-Cache.
const CACHE='wasbinichwert-pages-v845';
const LOCAL=['./','./index.html','./styles.css','./app.js','./comparison-table.js','./pdf-lib-loader.js','./pdf-export.js','./brand-runtime.js','./parttime.js','./salary-growth-fix.js','./salary-negotiation.js','./result-export.js','./onboarding.js','./pro-access.js','./offline-runtime.js','./ui-consistency.js','./vendor/lohnsteuerrechner.js','./vendor/pdf-lib.min.js','./brand-mark.svg','./manifest.webmanifest','./icon.svg'];
const MODULES=['./app.js','./comparison-table.js','./pdf-lib-loader.js','./pdf-export.js','./brand-runtime.js','./parttime.js','./salary-growth-fix.js','./salary-negotiation.js','./result-export.js','./onboarding.js','./pro-access.js','./offline-runtime.js','./ui-consistency.js'];
const REMOTE_TAX='https://cdn.jsdelivr.net/npm/lohnsteuerrechner/+esm';
const LOCAL_TAX='./vendor/lohnsteuerrechner.js';

self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(LOCAL);
  self.skipWaiting();
})()));

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);
  await self.clients.claim();
})()));

async function getLocal(c,path){
  try{
    const r=await fetch(path,{cache:'no-store'});
    if(r&&r.ok){await c.put(path,r.clone());return r}
    throw new Error('network');
  }catch{
    return await c.match(path);
  }
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;

  if(url.pathname.endsWith('/app.js')){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE),parts=[];
      for(const path of MODULES){
        const r=await getLocal(c,path);
        if(!r)throw new Error('Missing cached module: '+path);
        let text=await r.text();
        if(path==='./app.js')text=text.replace(REMOTE_TAX,LOCAL_TAX);
        parts.push(text);
      }
      return new Response(parts.join('\n'),{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}});
    })());
    return;
  }

  if(LOCAL.some(p=>new URL(p,self.location.href).pathname===url.pathname)){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE),hit=await c.match(e.request)||await c.match(url.href);
      if(hit)return hit;
      try{const r=await fetch(e.request);if(r&&r.ok)await c.put(e.request,r.clone());return r}
      catch{return await c.match('./index.html')}
    })());
    return;
  }

  e.respondWith((async()=>{
    const c=await caches.open(CACHE),hit=await c.match(e.request);
    if(hit)return hit;
    try{const r=await fetch(e.request);if(r&&r.ok)await c.put(e.request,r.clone());return r}
    catch{return await c.match('./index.html')}
  })());
});
