// site.js — MaurizoGameur (LIVE auto + header + banner)
const CHANNEL = "maurizogameur";

// decapi uptime: "offline" si OFF
const UPTIME_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://decapi.me/twitch/uptime/" + CHANNEL);

function setMode(isLive){

  // Classes globales
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

  // Dot + label topbar
  const dot = document.querySelector("[data-live-dot]");
  const label = document.querySelector("[data-live-label]");
  const liveBtn = document.querySelector("[data-live-btn]");
  const twitchBtn = document.querySelector("[data-twitch-btn]");
  const bannerTag = document.querySelector("[data-banner-tag]");

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

  if(twitchBtn){
    twitchBtn.style.display = isLive ? "none" : "inline-flex";
  }

  // 🔥 Banner OFF / ON
  if(bannerTag){
    bannerTag.textContent = isLive ? "🔴 Stream ON" : "🟠 Stream OFF";
  }
}

async function checkLive(){
  try{
    const res = await fetch(UPTIME_URL, { cache: "no-store" });
    const txt = (await res.text()).trim().toLowerCase();
    const isLive = !txt.includes("offline");
    setMode(isLive);
  }catch(e){
    setMode(false);
  }
}

checkLive();
setInterval(checkLive, 60000);
