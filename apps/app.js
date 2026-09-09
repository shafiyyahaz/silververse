const WORLDS=[
{id:"melody",name:"Melody World",icon:"🎵",desc:"Play tiny melodies and sounds.",cat:"play",path:"apps/xylophone/"},
{id:"focus",name:"Focus World",icon:"🎯",desc:"A calm workspace for focused sessions.",cat:"focus",path:"apps/focusflow/"},
{id:"mood",name:"Mood World",icon:"🌙",desc:"Journal your moods and save little moments.",cat:"calm",path:"apps/lunara/"},
{id:"dream",name:"Dream World",icon:"✨",desc:"Turn colors and ideas into dreamy creations.",cat:"dream",path:"apps/colorlab/"},
{id:"pixel",name:"Pixel World",icon:"🎨",desc:"Create your own little pixel-art universe.",cat:"create",path:"apps/pixel-studio/"},
{id:"stellar",name:"Stellar World",icon:"⭐",desc:"Explore a glowing star universe.",cat:"play",path:"apps/stellar/"},
{id:"rain",name:"Rain World",icon:"🌧️",desc:"A peaceful ambient rain space.",cat:"calm",path:"apps/rainroom/"},
{id:"neko",name:"Neko World",icon:"🐱",desc:"A tiny playful cat companion.",cat:"play",path:"apps/neko-desktop/"}
];
const ideas=["Make something tiny that makes you smile.","Write one sentence about your day.","Try a new color combination.","Create a 5-second melody.","Finish one small task today.","Open a world you haven't visited yet.","Take a quiet minute and breathe."];
const surprises={
melody:["Play a melody you've never tried.","Make a 10-second sound loop.","Try a completely random rhythm."],
focus:["Do one tiny task for 5 minutes.","Clear one distraction before starting.","Pick your most important task."],
mood:["Write three words for your current mood.","Save one good moment from today.","Give yourself a gentle check-in."],
dream:["Imagine a place made entirely of light.","Build a color palette for a dream.","Name a world you'd love to visit."],
pixel:["Draw a tiny star.","Make a pixel cat.","Create a 5×5 mystery icon."],
stellar:["Find your favorite star pattern.","Imagine a planet with two moons.","Give a new constellation a name."],
rain:["Listen quietly for one minute.","Imagine rain outside a cozy window.","Let the background play while you relax."],
neko:["Give Neko a little visit.","Make a tiny cat-themed creation.","See what your companion is doing."]
};
const ACH=[
["first","First Melody","Enter Melody World"],
["traveler","World Traveler","Open 4 different Worlds"],
["moodkeeper","Mood Keeper","Try Mood World"],
["focusmaster","Focus Master","Start a Focus session"],
["stargazer","Stargazer","Open Stellar World"],
["dreamer","Dreamer","Visit Dream World"],
["pixelmaker","Pixel Maker","Visit Pixel World"],
["rainy","Rainy Soul","Visit Rain World"],
["neko","Neko Friend","Visit Neko World"],
["complete","Universe Complete","Open all 8 Worlds"]
];
const $=id=>document.getElementById(id);
let state=JSON.parse(localStorage.getItem("sv2State")||"{}");
state.visits=Number(state.visits||0)+1; state.opened=Array.isArray(state.opened)?state.opened:[]; state.ach=Array.isArray(state.ach)?state.ach:[]; state.theme=state.theme||"cosmic"; state.sound=state.sound!==false;
localStorage.setItem("sv2State",JSON.stringify(state));
function save(){localStorage.setItem("sv2State",JSON.stringify(state));}
function beep(freq=520,dur=.055){if(!state.sound)return;try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.035,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+dur)}catch(e){}}
function unlock(id){if(!state.ach.includes(id)){state.ach.push(id);save();toast("🏆 Achievement unlocked!");beep(760,.1)}}
function checkAch(id){ if(id==="melody")unlock("first"); if(id==="focus")unlock("focusmaster"); if(id==="mood")unlock("moodkeeper"); if(id==="stellar")unlock("stargazer"); if(id==="dream")unlock("dreamer"); if(id==="pixel")unlock("pixelmaker"); if(id==="rain")unlock("rainy"); if(id==="neko")unlock("neko"); if(state.opened.length>=4)unlock("traveler"); if(state.opened.length===8)unlock("complete"); }
function enter(w){beep(640); if(!state.opened.includes(w.id))state.opened.push(w.id);checkAch(w.id);save();$("teleport").classList.add("show");setTimeout(()=>location.href=w.path,420)}
function render(){const q=$("search").value.toLowerCase().trim(),cat=$("filter").value;const list=WORLDS.filter(w=>(cat==="all"||w.cat===cat)&&(w.name+" "+w.desc).toLowerCase().includes(q));$("grid").innerHTML=list.map(w=>`<article class="card" data-id="${w.id}" tabindex="0"><div class="card-top"><span class="icon">${w.icon}</span><span class="world-no">WORLD ${String(WORLDS.indexOf(w)+1).padStart(2,"0")}</span></div><h3>${w.name}</h3><p>${w.desc}</p><div class="card-foot"><button class="surprise-mini" data-surprise="${w.id}">🎲 Surprise</button><span class="badge">ENTER →</span></div></article>`).join("")||`<div class="empty">No world found ✦</div>`;document.querySelectorAll(".card").forEach(c=>{c.onclick=e=>{if(e.target.closest("button"))return;enter(WORLDS.find(w=>w.id===c.dataset.id))};c.onkeydown=e=>{if(e.key==="Enter")enter(WORLDS.find(w=>w.id===c.dataset.id))}});document.querySelectorAll("[data-surprise]").forEach(b=>b.onclick=e=>{e.stopPropagation();surprise(b.dataset.surprise)});}
function surprise(id){const arr=surprises[id],text=arr[Math.floor(Math.random()*arr.length)];beep(580);toast(`${WORLDS.find(w=>w.id===id).icon} ${text}`)}
function toast(msg){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.append(t)}t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2600)}
function openModal(html){$("modalContent").innerHTML=html;$("modal").classList.add("show");$("modal").setAttribute("aria-hidden","false")}
function closeModal(){$("modal").classList.remove("show");$("modal").setAttribute("aria-hidden","true")}
function profile(){openModal(`<div class="modal-kicker">YOUR PROFILE</div><h2>Stargazer ✦</h2><div class="profile-grid"><div><b>${state.visits}</b><span>Visits</span></div><div><b>${state.opened.length}/8</b><span>Worlds</span></div><div><b>${state.ach.length}</b><span>Achievements</span></div></div><h3>Journey</h3><p class="muted">${state.opened.length===8?"You've explored the whole universe! 🌌":"Keep exploring — every World leaves a little mark on your journey."}</p>`)}
function achievements(){openModal(`<div class="modal-kicker">ACHIEVEMENTS</div><h2>${state.ach.length}/${ACH.length} unlocked</h2><div class="ach-list">${ACH.map(a=>`<div class="ach ${state.ach.includes(a[0])?"unlocked":""}"><span>${state.ach.includes(a[0])?"🏆":"🔒"}</span><div><b>${a[1]}</b><small>${a[2]}</small></div></div>`).join("")}</div>`)}
function themes(){openModal(`<div class="modal-kicker">THEME STUDIO</div><h2>Choose your atmosphere</h2><div class="themes">${[["cosmic","🌌","Cosmic Blue"],["aurora","🌈","Aurora"],["moonlight","🌙","Moonlight"],["nebula","💜","Nebula"]].map(t=>`<button class="theme-card ${state.theme===t[0]?"active":""}" data-theme="${t[0]}"><span>${t[1]}</span><b>${t[2]}</b></button>`).join("")}</div>`);document.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{state.theme=b.dataset.theme;applyTheme();save();beep(700);themes();})}
function applyTheme(){document.body.dataset.theme=state.theme;$("sound").textContent=state.sound?"🔊":"🔇"}
function update(){ $("visits").textContent=state.visits;$("worlds").textContent=state.opened.length;$("achievements").textContent=state.ach.length;$("moments").textContent=JSON.parse(localStorage.getItem("lunaraEntries")||"[]").length}
$("search").oninput=render;$("filter").onchange=render;$("surprise").onclick=()=>enter(WORLDS[Math.floor(Math.random()*WORLDS.length)]);$("newIdea").onclick=()=>{$("idea").textContent=ideas[Math.floor(Math.random()*ideas.length)];beep()};$("profile").onclick=profile;$("achievementBtn").onclick=achievements;$("theme").onclick=themes;$("sound").onclick=()=>{state.sound=!state.sound;save();applyTheme();beep()};$("modal").onclick=e=>{if(e.target.id==="modal"||e.target.dataset.close!==undefined)closeModal()};
function clock(){ $("clock").textContent=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}
applyTheme();update();render();clock();setInterval(clock,1000);
