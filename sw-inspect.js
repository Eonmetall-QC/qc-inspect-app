/* IPQC Inspect service worker - offline + auto-caches any form opened or listed.
   New forms need NO change here: they are cached when first opened, or in the
   background after the hub lists them. */
var CACHE='ipqc-inspect-v3';
var CORE=['QC_Inspect_Hub.html','index.html','qc-lists.js','manifest-inspect.webmanifest',
          'ipqc-inspect-192.png','ipqc-inspect-512.png','ipqc-inspect-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){});}));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){return k===CACHE?null:caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('message',function(e){
  var d=e.data||{};
  if(d.type==='cacheForms'&&d.files&&d.files.length){
    caches.open(CACHE).then(function(c){ d.files.forEach(function(f){ c.add(f).catch(function(){}); }); });
  }
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url;try{url=new URL(e.request.url);}catch(err){return;}
  if(url.origin!==self.location.origin)return;
  e.respondWith(caches.match(e.request).then(function(hit){
    var net=fetch(e.request).then(function(resp){
      if(resp&&resp.ok){var cp=resp.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
      return resp;
    }).catch(function(){return hit;});
    return hit||net;
  }));
});