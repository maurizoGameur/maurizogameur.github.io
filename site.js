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
// ================================
// 🔴 LIVE/OFF pour streamers suggérés
// ================================
function uptimeUrlFor(channel){
  return "https://api.allorigins.win/raw?url=" +
    encodeURIComponent("https://decapi.me/twitch/uptime/" + channel);
}

async function checkOneSuggested(el){
  const channel = el.getAttribute("data-channel");
  if(!channel) return;

  const pill = el.querySelector("[data-pill]");
  try{
    const res = await fetch(uptimeUrlFor(channel), { cache: "no-store" });
    const txt = (await res.text()).trim().toLowerCase();
    const isLive = !txt.includes("offline");

    el.classList.toggle("isLive", isLive);
    el.classList.toggle("isOff", !isLive);

    if(pill) pill.textContent = isLive ? "LIVE" : "OFF";
  }catch(e){
    // si erreur, on laisse OFF (sans casser)
    el.classList.add("isOff");
    el.classList.remove("isLive");
    if(pill) pill.textContent = "OFF";
  }
}

async function updateSuggested(){
  const items = document.querySelectorAll("[data-suggest]");
  for(const el of items){
    await checkOneSuggested(el);
  }
}

// Lance + refresh
updateSuggested();
setInterval(updateSuggested, 60000);

.scene{ width:100%; }

.offlineBox{
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  padding:16px;
  text-align:center;
}

.offlineTitle{
  font-weight:1000;
  font-size:20px;
  margin-bottom:8px;
}

.offlineSub{
  color: var(--mut);
  font-weight:800;
  margin-bottom:14px;
}

.offlineImg{
  width:100%;
  max-height:360px;
  object-fit:cover;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
}

/* petit effet BRB */
#brbScene .offlineBox{
  box-shadow: 0 0 40px rgba(255,209,102,.15);
  border-color: rgba(255,209,102,.25);
}