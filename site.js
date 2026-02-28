// site.js — MaurizoGameur (LIVE auto + suggested streamers)
const CHANNEL = "maurizogameur";

function uptimeUrl(channel){
  return "https://api.allorigins.win/raw?url=" +
    encodeURIComponent("https://decapi.me/twitch/uptime/" + channel);
}

function setMode(isLive){
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

  const dot = document.querySelector("[data-live-dot]");
  const label = document.querySelector("[data-live-label]");
  const liveBtn = document.querySelector("[data-live-btn]");
  const twitchBtn = document.querySelector("[data-twitch-btn]");
  const bannerTag = document.querySelector("[data-banner-tag]");

  // Dot + texte topbar
  if(dot){
    dot.classList.toggle("live", isLive);
    dot.classList.toggle("off", !isLive);
  }
  if(label){
    label.textContent = isLive ? "EN DIRECT" : "OFFLINE";
  }

  // Boutons LIVE / Twitch
  if(liveBtn){
    liveBtn.style.display = isLive ? "inline-flex" : "none";
  }
  if(twitchBtn){
    twitchBtn.style.display = isLive ? "none" : "inline-flex";
  }

  // 🟠/🔴 sur la bannière
  if(bannerTag){
    bannerTag.textContent = isLive ? "🔴 Stream ON" : "🟠 Stream OFF";
  }
}

async function isChannelLive(channel){
  const res = await fetch(uptimeUrl(channel), { cache: "no-store" });
  const txt = (await res.text()).trim().toLowerCase();
  return !txt.includes("offline");
}

async function checkMyLive(){
  try{
    const live = await isChannelLive(CHANNEL);
    setMode(live);
  }catch(e){
    console.log("checkMyLive error:", e);
  }
}

function setSuggestedCard(el, live){
  const dot = el.querySelector(".pDot");
  const text = el.querySelector(".pText");
  if(!dot || !text) return;

  dot.classList.toggle("live", live);
  dot.classList.toggle("off", !live);
  text.textContent = live ? "LIVE" : "OFF";
}

async function checkSuggested(){
  const cards = [...document.querySelectorAll("[data-suggest][data-channel]")];
  if(!cards.length) return;

  await Promise.all(cards.map(async (el) => {
    const ch = el.getAttribute("data-channel");
    try{
      const live = await isChannelLive(ch);
      setSuggestedCard(el, live);
    }catch(e){
      setSuggestedCard(el, false);
    }
  }));
}

// ✅ start
checkMyLive();
checkSuggested();
setInterval(checkMyLive, 60000);
setInterval(checkSuggested, 90000);