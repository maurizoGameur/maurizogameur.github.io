// site.js — MaurizoGameur (LIVE auto + partenaires)

const CHANNEL = "maurizogameur";

function uptimeUrl(channel){
  return "https://api.allorigins.win/raw?url=" +
    encodeURIComponent("https://decapi.me/twitch/uptime/" + channel);
}

async function isChannelLive(channel){
  const url = uptimeUrl(channel) + "&_=" + Date.now(); // anti-cache
  const res = await fetch(url, { cache: "no-store" });
  const txt = (await res.text()).trim().toLowerCase();
  return !txt.includes("offline");
}

/* ===== MON STREAM ===== */

function setMode(isLive){
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

  const dot = document.querySelector("[data-live-dot]");
  const label = document.querySelector("[data-live-label]");
  const liveBtn = document.querySelector("[data-live-btn]");
  const twitchBtn = document.querySelector("[data-twitch-btn]");
  const offlineArea = document.querySelector("[data-offline-area]");
  const liveArea = document.querySelector("[data-live-area]");

  if(dot){
    dot.classList.toggle("live", isLive);
    dot.classList.toggle("off", !isLive);
  }
  if(label){
    label.textContent = isLive ? "EN DIRECT" : "OFFLINE";
  }
  if(liveBtn) liveBtn.style.display = isLive ? "inline-flex" : "none";
  if(twitchBtn) twitchBtn.style.display = isLive ? "none" : "inline-flex";

  if(offlineArea) offlineArea.style.display = isLive ? "none" : "block";
  if(liveArea) liveArea.style.display = isLive ? "block" : "none";
}

async function checkMyLive(){
  try{
    const live = await isChannelLive(CHANNEL);
    setMode(live);
  }catch(e){
    console.log("MyLive error:", e);
    setMode(false);
  }
}

/* ===== PARTENAIRES ===== */

function setSuggestedCard(el, live){
  el.classList.toggle("is-live", live);

  const dot = el.querySelector(".pDot");
  const text = el.querySelector(".pText");

  if(dot){
    dot.classList.toggle("live", live);
    dot.classList.toggle("off", !live);
  }
  if(text){
    text.textContent = live ? "LIVE" : "OFF";
  }
}

async function checkSuggested(){
  const cards = document.querySelectorAll("[data-suggest][data-channel]");

  for(const el of cards){
    const ch = el.getAttribute("data-channel");
    try{
      const live = await isChannelLive(ch);
      setSuggestedCard(el, live);
    }catch(e){
      setSuggestedCard(el, false);
    }
  }
}

/* ===== GO ===== */

checkMyLive();
checkSuggested();
setInterval(checkMyLive, 60000);
setInterval(checkSuggested, 60000);
