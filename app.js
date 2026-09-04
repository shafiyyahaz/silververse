const APPS=[
{name:"Silver Xylophone",icon:"🎹",desc:"Play, record, and create tiny melodies.",accent:"#60a5fa",url:"apps/xylophone/"},
{name:"Lunara",icon:"🌙",desc:"A calm little space for moon notes and moods.",accent:"#a78bfa",url:"apps/lunara/",
{name:"FocusFlow",icon:"◷",desc:"A focused workspace for study and tasks.",accent:"#38bdf8",soon:true},
{name:"Pixel Studio",icon:"▦",desc:"A tiny pixel-art canvas in your browser.",accent:"#22d3ee",soon:true},
{name:"Stellar",icon:"✦",desc:"Explore a miniature interactive universe.",accent:"#818cf8",soon:true},
{name:"Rainroom",icon:"☂",desc:"Ambient rain and a peaceful focus timer.",accent:"#67e8f9",soon:true},
{name:"ColorLab",icon:"◈",desc:"Create palettes, gradients, and color ideas.",accent:"#5eead4",soon:true},
{name:"Neko Desktop",icon:"🐱",desc:"A tiny playful desktop companion.",accent:"#93c5fd",soon:true}
];
const apps=document.querySelector("#apps");
function render(q=""){apps.innerHTML="";APPS.filter(a=>a.name.toLowerCase().includes(q.toLowerCase())).forEach(a=>{const el=document.createElement(a.soon?"div":"a");el.className="app-card";el.style.setProperty("--accent",a.accent);if(!a.soon)el.href=a.url;el.innerHTML=`<span class="badge">${a.soon?"COMING SOON":"OPEN"}</span><div><div class="app-icon">${a.icon}</div><h3>${a.name}</h3><p>${a.desc}</p></div><div class="open">${a.soon?"IN DEVELOPMENT":"ENTER WORLD →"}</div>`;apps.appendChild(el)})}
render();document.querySelector("#search").addEventListener("input",e=>render(e.target.value));
function tick(){const d=new Date();document.querySelector("#clock").textContent=d.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});const h=d.getHours();document.querySelector("#greeting").textContent=h<11?"Good morning, explorer":h<18?"Good afternoon, explorer":"Good evening, explorer"}tick();setInterval(tick,1000);
const visited=Number(localStorage.getItem("silververse-visited")||0);document.querySelector("#visited").textContent=visited;
document.querySelector("#theme").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("silververse-theme",document.body.classList.contains("light")?"light":"dark");document.querySelector("#theme").textContent=document.body.classList.contains("light")?"☀":"☾"};if(localStorage.getItem("silververse-theme")==="light"){document.body.classList.add("light");document.querySelector("#theme").textContent="☀"}
