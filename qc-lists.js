/* =====================================================================
   IPQC FORM LISTS  -  BACKUP COPY ONLY.

   The Inspector and Colour lists are now kept in the "Lists" tab of the
   QC Submissions Inbox (Google Sheet). Edit them THERE: every form loads
   that tab when it opens, and new colours typed by inspectors are added
   to it automatically.

   This file is used only by a form that has never been online yet.
   You do not need to edit it.
   ===================================================================== */
window.QC_LISTS = {

  inspectors: [
    "DAHAMAN",
    "IQBAL",
    "RASHID",
    "REZA",
  ],

  colours: [
    "Apple Green",
    "Beige",
    "Black",
    "Blue",
    "Dim Grey",
    "Em Silver",
    "GI",
    "Grey",
    "Green",
    "Lt Beige",
    "Lt Grey",
    "Lavender",
    "Matt Red",
    "Matt Yellow",
    "Matt Grey",
    "Mini Black",
    "Mx Grey",
    "Orange",
    "Pink",
    "Red",
    "Rod Grey",
    "Sg Beige",
    "Sky Blue",
    "Sand Black",
    "Sage Green",
    "Silver",
    "White",
    "Yellow",
  ],

};

/* =====================================================================
   QC TABLET time tracker (offline-capable). Records inspector form time to
   the QC Tablet Time Log sheet. Each form OPEN is a round. Works offline:
   time is saved on the tablet and sent when WiFi returns. Skips supervisor
   verification (URL has verify=). Never affects the form.
   ===================================================================== */
(function(){try{
  if(/[?#][^#]*verify=/i.test(location.href)) return;
  var U="https://script.google.com/macros/s/AKfycbxqGkEZ321LYUcdswRfLceJ39XRPgoarOoY5zsxKPrsZzHsyEG_ytmwt3nZkKFYzz7c/exec";
  var KEY="qcTabletName",QK="qcQueue",device="";
  try{device=(localStorage.getItem(KEY)||"").trim();}catch(e){}
  if(!device){var en="";try{en=(window.prompt("One-time setup. Enter this tablet's name (e.g. TAB-IPQC-2):")||"").trim();}catch(e){}if(!en)return;device=en.slice(0,60);try{localStorage.setItem(KEY,device);}catch(e){}}
  var SID=Math.random().toString(36).slice(2)+"-"+Date.now();
  function desc(){try{if(typeof descriptionValue==="function")return String(descriptionValue()||"");}catch(e){}try{if(window.descriptionValue)return String(window.descriptionValue()||"");}catch(e){}return (document.title||"form").trim();}
  function tag(){try{var el=document.getElementById("macTag");return el?String(el.value||"").trim():"";}catch(e){return "";}}
  function post(p){return fetch(U,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain"},body:JSON.stringify(p)});}
  function queue(p){try{var q=JSON.parse(localStorage.getItem(QK)||"[]");q.push(p);localStorage.setItem(QK,JSON.stringify(q.slice(-1000)));}catch(e){}}
  function flush(){try{var q=JSON.parse(localStorage.getItem(QK)||"[]");if(!q.length)return;localStorage.setItem(QK,"[]");q.forEach(function(p){post(p).catch(function(){queue(p);});});}catch(e){}}
  function dispatch(p){ if(navigator.onLine===false){queue(p);return;} try{ if(navigator.sendBeacon){ if(!navigator.sendBeacon(U,JSON.stringify(p))) queue(p); } else post(p).catch(function(){queue(p);}); }catch(e){queue(p);} }
  function send(ms){dispatch({device:device,desc:desc(),tag:tag(),ms:ms,sid:SID,t:Date.now()});}
  flush(); window.addEventListener("online",flush);
  var a=0,lt=Date.now(),vis=!document.hidden;
  function tk(){var n=Date.now();if(vis)a+=Math.min(n-lt,120000);lt=n;}
  function fl(){tk();if(a>0){send(a);a=0;}}
  setInterval(function(){tk();if(a>=60000)fl();},20000);
  document.addEventListener("visibilitychange",function(){tk();vis=!document.hidden;if(!vis)fl();});
  window.addEventListener("pagehide",fl);window.addEventListener("beforeunload",fl);
}catch(e){}})();
