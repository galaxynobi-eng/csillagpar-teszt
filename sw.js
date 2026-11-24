// Csillagkör – offline gyorsítótár. Új kiadásnál a VER számot növelni kell.
const VER="csillagkor-v2";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png",
  "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname==="script.google.com")return;
  // Az oldal mindig a hálózatról jön, ha van net (így a frissítések azonnal látszanak), különben a tárból.
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put("./index.html",c));return res}).catch(()=>caches.match("./index.html")));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&(u.origin===location.origin||/jsdelivr|gstatic|googleapis/.test(u.hostname))){const c=res.clone();caches.open(VER).then(x=>x.put(r,c))}return res})));
});
