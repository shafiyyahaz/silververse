(()=>{const map={xylophone:["🎵","Melody World"],focusflow:["🎯","Focus World"],lunara:["🌙","Mood World"],colorlab:["✨","Dream World"],"pixel-studio":["🎨","Pixel World"],stellar:["⭐","Stellar World"],rainroom:["🌧️","Rain World"],"neko-desktop":["🐱","Neko World"]};
const key=location.pathname.split("/").filter(Boolean).slice(-2,-1)[0]||"";
const info=map[key]||["✦","Silververse World"];
const b=document.createElement("div");b.className="sv-worldbar";b.innerHTML=`<a href="../../" title="Back to Silververse">✦</a><span class="sv-name">${info[0]} ${info[1]}</span><button id="svSurprise">🎲 Surprise</button>`;document.body.append(b);
const s=document.createElement("div");s.className="sv-stars";document.body.append(s);
const KEY="silververse2";
function state(){let x=JSON.parse(localStorage.getItem(KEY)||"null")||{};x.opened=Array.isArray(x.opened)?x.opened:[];x.achievements=Array.isArray(x.achievements)?x.achievements:[];x.activities=Number(x.activities||0);x.favorites=x.favorites||{};return x}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function activity(type){let x=state();x.activities++;x.favorites[key]=(x.favorites[key]||0)+1;if(!x.opened.includes(key))x.opened.push(key);
if(!x.achievements.includes("first"))x.achievements.push("first");
if(type==="melody"&&!x.achievements.includes("melody"))x.achievements.push("melody");
if(type==="mood"&&!x.achievements.includes("mood"))x.achievements.push("mood");
if(x.opened.length===8&&!x.achievements.includes("explorer"))x.achievements.push("explorer");
save(x)}
window.svActivity=activity;
document.getElementById("svSurprise").onclick=()=>{activity("visit");const ideas=["Try something unexpected ✨","Make a tiny creation.","Take a one-minute reset.","Explore a feature you haven't used.","Create a little moment worth saving."];let x=document.querySelector(".sv-toast");if(!x){x=document.createElement("div");x.className="sv-toast";x.style.cssText="position:fixed;left:50%;bottom:75px;transform:translateX(-50%);z-index:30;padding:12px 16px;border-radius:14px;background:#101a2df0;border:1px solid #ffffff18;color:inherit;backdrop-filter:blur(12px)";document.body.append(x)}x.textContent=`${info[0]} ${ideas[Math.floor(Math.random()*ideas.length)]}`;clearTimeout(window.svt);window.svt=setTimeout(()=>x.remove(),2300);try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=560;g.gain.value=.03;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.06)}catch(e){}}})()
