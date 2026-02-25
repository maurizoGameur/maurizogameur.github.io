// site.js — MaurizoGameur (LIVE auto + header effects)
const CHANNEL = "maurizogameur";

// decapi uptime: "offline" si OFF
const UPTIME_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://decapi.me/twitch/uptime/" + CHANNEL);

function setMode(isLive){
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

  const dot = document.querySelector("[data-live-dot]");
  const label = document.querySelector("[data-live-label]");
  const liveBtn = document.querySelector("[data-live-btn]");

  if(dot){
    dot.classList.toggle("live", isLive);
    dot.classList.toggle("off", !isLive);
  }
  if(label){
    label.textContent = isLive ? "EN DIRECT" : "OFFLINE";
  }
  if(liveBtn){
    liveBtn.style.display = isLive ? "inline-flex" : "none";
  }
}

async function checkLive(){
  try{
    const res = await fetch(UPTIME_URL, { cache: "no-store" });
    const txt = (await res.text()).trim().toLowerCase();
    const isLive = !txt.includes("offline");
    setMode(isLive);
  }catch(e){
    // si erreur réseau, on ne casse pas le site
    console.log("checkLive error:", e);
  }
}

checkLive();
setInterval(checkLive, 60000);
