const DATA = {
  worlds: [
    {id:"melody",name:"Melody World",icon:"♫",desc:"Create tiny melodies and discover musical moods."},
    {id:"focus",name:"Focus World",icon:"◉",desc:"A calm space for concentration and study sessions."},
    {id:"mood",name:"Mood World",icon:"☾",desc:"Choose a feeling and keep your inner weather balanced."},
    {id:"dream",name:"Dream World",icon:"✦",desc:"Slow down, imagine, and collect dreamy prompts."}
  ],
  surprises:{
    melody:["Try a 3-note melody.","Make a melody that sounds like rain.","Play only three notes and repeat the pattern."],
    focus:["Take one 10-minute focus sprint.","Put your phone away and start one tiny task.","Write the single most important thing to finish."],
    mood:["Name one thing you are grateful for.","Take three slow breaths and notice the room.","Choose a word for how you feel right now."],
    dream:["Imagine a city above the clouds.","Write one sentence about a moonlit library.","Invent a tiny planet with one unusual rule."]
  },
  themes:[
    {id:"cosmic",name:"Cosmic Blue",bg:"#050b1c",accent:"#78aaff",accent2:"#b28cff"},
    {id:"aurora",name:"Aurora",bg:"#061514",accent:"#68e0c2",accent2:"#8ea2ff"},
    {id:"moonlight",name:"Moonlight",bg:"#0c0b18",accent:"#c4c7ff",accent2:"#8da5ff"},
    {id:"nebula",name:"Nebula",bg:"#150719",accent:"#f09cff",accent2:"#78aaff"}
  ]
};

const state = JSON.parse(localStorage.getItem("silververseState") || '{"visits":0,"worlds":[],"achievements":[],"theme":"cosmic","sound":true}');
state.visits++;
localStorage.setItem("silververseState",JSON.stringify(state));

const app=document.getElementById("app"), nav=document.getElementById("worldNav"), toastEl=document.getElementById("toast");
const teleport=document.getElementById("teleport"), modalBackdrop=document.getElementById("modalBackdrop"), modal=document.getElementById("modal");
let currentWorld=null;

const achievements = {
  first:{title:"First Melody",desc:"Open Melody World for the first time.",icon:"♫"},
  traveler:{title:"World Traveler",desc:"Open all four worlds.",icon:"✦"},
  mood:{title:"Mood Keeper",desc:"Use Surprise Me in Mood World.",icon:"☾"},
  focus:{title:"Focus Master",desc:"Use Surprise Me in Focus World.",icon:"◉"}
};

function save(){localStorage.setItem("silververseState",JSON.stringify(state))}
function sound(){
  if(!state.sound)return;
  try{
    const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();
    o.frequency.value=520;o.type="sine";g.gain.setValueAtTime(.035,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.09);
    o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.09);
  }catch(e){}
}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),1800)}
function unlock(id){
  if(!state.achievements.includes(id)){state.achievements.push(id);save();toast("Achievement unlocked: "+achievements[id].title)}
}
function surprise(id){
  sound(); const list=DATA.surprises[id], text=list[Math.floor(Math.random()*list.length)];
  document.getElementById("surpriseText").textContent=text;
  if(id==="mood")unlock("mood"); if(id==="focus")unlock("focus");
  toast("Surprise Me ✦");
}
function buildNav(){
  nav.innerHTML=DATA.worlds.map(w=>`<button class="nav-world" data-world="${w.id}">${w.icon} ${w.name.replace(" World","")}</button>`).join("");
  nav.querySelectorAll("button").forEach(b=>b.onclick=()=>go(b.dataset.world));
}
function go(id,instant=false){
  if(id===currentWorld)return;
  sound();
  const render=()=>{currentWorld=id; if(!state.worlds.includes(id)){state.worlds.push(id);save()} if(id==="melody")unlock("first"); renderWorld(id); updateNav()};
  if(instant){render();return}
  teleport.classList.add("show");setTimeout(render,280);setTimeout(()=>teleport.classList.remove("show"),700);
}
function updateNav(){nav.querySelectorAll(".nav-world").forEach(b=>b.classList.toggle("active",b.dataset.world===currentWorld))}
function renderHome(){
  currentWorld=null; updateNav();
  app.innerHTML=`
  <section class="hero">
    <div>
      <div class="eyebrow">A little universe of you</div>
      <h1>Welcome to <span>Silververse.</span></h1>
      <p class="lead">A tiny interactive universe where music, focus, mood and imagination live together. Pick a World, then use <b>Surprise Me</b> whenever you want a fresh direction.</p>
      <div class="world-toolbar"><button class="primary" id="randomWorld">✦ Surprise Me</button><button class="ghost" id="openProfile">◉ View Profile</button></div>
    </div>
    <div class="hero-card">
      <div class="eyebrow">Your journey</div>
      <div class="stat"><span>Visits</span><b>${state.visits}</b></div>
      <div class="stat"><span>Worlds opened</span><b>${state.worlds.length}/4</b></div>
      <div class="stat"><span>Achievements</span><b>${state.achievements.length}/${Object.keys(achievements).length}</b></div>
      <div class="stat"><span>Theme</span><b>${DATA.themes.find(t=>t.id===state.theme).name}</b></div>
    </div>
  </section>
  <div class="section-title"><div><h2>Choose your World</h2><p>Every World has its own Surprise Me button.</p></div></div>
  <section class="world-grid">${DATA.worlds.map(w=>`
    <article class="world-card" data-open="${w.id}">
      <div class="world-icon">${w.icon}</div><h3>${w.name}</h3><p>${w.desc}</p>
      <button class="surprise" data-surprise="${w.id}">✦ Surprise Me</button>
    </article>`).join("")}</section>`;
  document.querySelectorAll("[data-open]").forEach(x=>x.onclick=e=>{if(e.target.closest(".surprise"))return;go(x.dataset.open)});
  document.querySelectorAll("[data-surprise]").forEach(x=>x.onclick=e=>{e.stopPropagation();go(x.dataset.surprise);setTimeout(()=>surprise(x.dataset.surprise),380)});
  document.getElementById("randomWorld").onclick=()=>go(DATA.worlds[Math.floor(Math.random()*DATA.worlds.length)].id);
  document.getElementById("openProfile").onclick=openProfile;
}
function renderWorld(id){
  const w=DATA.worlds.find(x=>x.id===id);
  const details={
    melody:["Tune the moment","A tiny playground for patterns, rhythm and musical ideas.","♩  ♪  ♫","Melody spark","3-note challenge","Rhythm loop"],
    focus:["Lock in","Turn one small task into a calm, focused session.","10:00","Focus sprint","Distraction shield","Tiny next step"],
    mood:["Check the weather","A gentle space to notice your mood without judging it.","☾ ✦","Mood check-in","Gratitude spark","Breathing pause"],
    dream:["Enter the dreamscape","Let your imagination wander with tiny prompts and impossible places.","✧","Dream prompt","World builder","Night note"]
  }[id];
  app.innerHTML=`
  <section class="world-view">
    <div class="world-head">
      <div><div class="eyebrow">${w.icon} ${w.name}</div><h1>${details[0]}</h1><p class="lead">${details[1]}</p></div>
      <button class="primary" id="worldSurprise">✦ Surprise Me</button>
    </div>
    <div class="feature-panel">
      <div class="eyebrow">Your random spark</div>
      <h2 id="surpriseText">${details[2]}</h2>
      <p>Press Surprise Me whenever you want the World to choose a new direction for you.</p>
      <div class="meter"><i style="width:${Math.min(100,state.visits*7)}%"></i></div>
      <div class="mini-grid">${details.slice(3).map((x,i)=>`<div class="mini"><b>${["01","02","03"][i]} · ${x}</b><span>${id==="focus"?"Keep it simple and start small.":id==="melody"?"Experiment without worrying about perfection.":id==="mood"?"Notice, name and move gently.":"Follow the idea wherever it leads."}</span></div>`).join("")}</div>
    </div>
    <div class="world-toolbar"><button class="ghost" id="homeBack">← Back to dashboard</button><button class="ghost" id="themeInline">◈ Theme Studio</button></div>
  </section>`;
  document.getElementById("worldSurprise").onclick=()=>surprise(id);
  document.getElementById("homeBack").onclick=()=>{sound();renderHome()};
  document.getElementById("themeInline").onclick=openThemes;
}
function openModal(html){modal.innerHTML=html;modalBackdrop.classList.add("open")}
function closeModal(){modalBackdrop.classList.remove("open")}
function openThemes(){
  sound();openModal(`<div class="modal-head"><h2>Theme Studio</h2><button class="close" id="close">×</button></div><p style="color:var(--muted)">Pick the atmosphere for your Silververse.</p><div class="theme-grid">${DATA.themes.map(t=>`<button class="theme-option" data-theme="${t.id}"><strong>${t.name}</strong><span>${t.bg} · ${t.accent}</span></button>`).join("")}</div>`);
  modal.querySelector("#close").onclick=closeModal;
  modal.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{applyTheme(b.dataset.theme);closeModal()});
}
function openProfile(){
  sound();const all=Object.keys(achievements);
  openModal(`<div class="modal-head"><h2>Your Profile</h2><button class="close" id="close">×</button></div>
    <div class="profile-top">
      <div class="profile-stat"><b>${state.visits}</b><span>Total visits</span></div>
      <div class="profile-stat"><b>${state.worlds.length}/4</b><span>Worlds explored</span></div>
    </div>
    <h3 style="font-family:'Space Grotesk';margin-top:24px">Achievements</h3>
    ${all.map(id=>{const a=achievements[id],ok=state.achievements.includes(id);return `<div class="achievement ${ok?"":"locked"}"><div class="badge">${a.icon}</div><div><b>${a.title}</b><div style="color:var(--muted);font-size:11px">${a.desc}</div></div></div>`}).join("")}`);
  modal.querySelector("#close").onclick=closeModal;
}
function applyTheme(id){
  const t=DATA.themes.find(x=>x.id===id);if(!t)return;
  state.theme=id;save();document.documentElement.style.setProperty("--bg",t.bg);document.documentElement.style.setProperty("--accent",t.accent);document.documentElement.style.setProperty("--accent2",t.accent2);
  document.body.style.background=`radial-gradient(circle at 50% -10%, ${t.accent}33 0, ${t.bg} 42%, #030711 100%)`;toast("Theme changed to "+t.name);
}
modalBackdrop.onclick=e=>{if(e.target===modalBackdrop)closeModal()};
document.getElementById("profileBtn").onclick=openProfile;
document.getElementById("themeBtn").onclick=openThemes;
document.getElementById("homeBtn").onclick=()=>{sound();renderHome()};
document.getElementById("soundDot").onclick=()=>{state.sound=!state.sound;save();toast(state.sound?"Sound effects on":"Sound effects off")};
buildNav();applyTheme(state.theme);renderHome();
