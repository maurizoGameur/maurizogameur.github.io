// site.js — MaurizoGameur (LIVE auto + switch scènes + suggestions)
const CHANNEL = "maurizogameur";

function uptimeUrl(channel){
  return "https://api.allorigins.win/raw?url=" +
    encodeURIComponent("https://decapi.me/twitch/uptime/" + channel);
}

async function isChannelLive(channel){
  const res = await fetch(uptimeUrl(channel), { cache: "no-store" });
  const txt = (await res.text()).trim().toLowerCase();
  return !txt.includes("offline");
}

function setMode(isLive){
  document.documentElement.classList.toggle("is-live", isLive);
  document.documentElement.classList.toggle("is-off", !isLive);

  const dot = document.querySelector("[data-live-dot]");
  const label = document.querySelector("[data-live-label]");
  const liveBtn = document.querySelector("[data-live-btn]");
  const twitchBtn = document.querySelector("[data-twitch-btn]");

  const brbScene = document.getElementById("brbScene");
  const liveScene = document.getElementById("liveScene");

  // header dot + texte
  if(dot){
    dot.classList.toggle("live", isLive);
    dot.classList.toggle("off", !isLive);
  }
  if(label){
    label.textContent = isLive ? "EN DIRECT" : "OFFLINE";
  }

  // boutons
  if(liveBtn) liveBtn.style.display = isLive ? "inline-flex" : "none";
  if(twitchBtn) twitchBtn.style.display = isLive ? "none" : "inline-flex";

  // ✅ switch scènes
  if(brbScene) brbScene.style.display = isLive ? "none" : "block";
  if(liveScene) liveScene.style.display = isLive ? "block" : "none";
}

async function checkMyLive(){
  try{
    const live = await isChannelLive(CHANNEL);
    setMode(live);
  }catch(e){
    console.log("checkMyLive error:", e);
    // si l’API bug: on reste OFF (safe)
    setMode(false);
  }
}

function setSuggestedCard(el, live){
  el.classList.toggle("isLive", live);
  el.classList.toggle("isOff", !live);

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

// GO
checkMyLive();
checkSuggested();
setInterval(checkMyLive, 60000);
setInterval(checkSuggested, 90000);
