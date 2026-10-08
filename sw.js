/* Basic offline shell for HTTPS-hosted ZhuRi. Plash behavior varies by version. */
const CACHE='zhuri-shell-0.1.0';
const CORE=['./','./index.html','./src/style.css','./src/adaptive.css','./src/app.js','./manifest.webmanifest','./assets/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('zhuri-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>response.ok?response:Promise.reject(new Error('offline'))).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
