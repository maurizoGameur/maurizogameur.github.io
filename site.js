// ===============================
// MaurizoGameur - Live + BRB Mode
// ===============================

const CHANNEL = "maurizogameur";

// Twitch uptime via decapi
const UPTIME_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://decapi.me/twitch/uptime/" + CHANNEL);

// ===============================
// BRB STATE
// ===============================

const KEY_BRB = "mz_site_brb";
let brb = localStorage.getItem(KEY_BRB) === "1";

function setBRB(on){
  brb = !!on;
  localStorage.setItem(KEY_BRB, brb ? "1" : "0");
  applyScenes();
}

// 🔥 Touche B = toggle BRB
document.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase() === "b"){
    setBRB(!brb);
  }
});

// ===============================
// SCENE SWITCH
// ===============================

function applyScenes(){
  const isLive = document.documentElement.classList.contains("is-live");

  const offlineScene = document.getElementById("offlineScene");
  const liveScene = document.getElementById("liveScene");
  const brbScene = document.getElementById("brbScene");

  if(brb){
    if(offlineScene) offlineScene.style.display = "none";
    if(liveScene) liveScene.style.display = "none";
    if(brbScene) brbScene.style.display = "block";
    return;
  }

  if(brbScene) brbScene.style.display = "none";
  if(offlineScene) offlineScene.style.display = isLive ? "none" : "block";
  if(liveScene) liveScene.style.display = isLive ? "block" : "none";
}

// ===============================
// LIVE CHECK
// ===============================

function setMode(isLive){
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

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

  if(bannerTag){
    bannerTag.textContent = isLive ? "🔴 Stream ON" : "🟠 Stream OFF";
  }

  applyScenes();
}

async function checkLive(){
  try{
    const res = await fetch(UPTIME_URL, { cache: "no-store" });
    const txt = (await res.text()).trim().toLowerCase();
    const isLive = !txt.includes("offline");
    setMode(isLive);
  }catch(e){
    console.log("Live check error:", e);
  }
}

checkLive();
setInterval(checkLive, 60000);