const APPS = [
  ["Silver Xylophone","🎹","Play tiny melodies.","play","apps/xylophone/"],
  ["Lunara","🌙","Mood Journal & moments.","calm","apps/lunara/"],
  ["FocusFlow","⏱️","A focused workspace.","focus","apps/focusflow/"],
  ["Pixel Studio","🎨","Create pixel art.","create","apps/pixel-studio/"],
  ["Stellar","⭐","Explore a star universe.","play","apps/stellar/"],
  ["Rainroom","🌧️","Ambient peaceful space.","calm","apps/rainroom/"],
  ["ColorLab","🌈","Create beautiful gradients.","create","apps/colorlab/"],
  ["Neko Desktop","🐱","A tiny playful companion.","play","apps/neko-desktop/"]
];

const ideas = [
  "Make something tiny that makes you smile.",
  "Write one sentence about your day.",
  "Try a new color combination.",
  "Create a 5-second melody.",
  "Finish one small task today."
];

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const grid = document.getElementById("grid");
const surpriseBtn = document.getElementById("surprise");
const newIdeaBtn = document.getElementById("newIdea");
const themeBtn = document.getElementById("theme");
const clockEl = document.getElementById("clock");
const visitsEl = document.getElementById("visits");
const momentsEl = document.getElementById("moments");
const focusEl = document.getElementById("focus");
const ideaEl = document.getElementById("idea");

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;

  const visibleApps = APPS.filter(app =>
    (category === "all" || app[3] === category) &&
    app[0].toLowerCase().includes(query)
  );

  grid.innerHTML = visibleApps.map(app => `
    <a class="card" href="${app[4]}">
      <span class="icon">${app[1]}</span>
      <h3>${app[0]}</h3>
      <p>${app[2]}</p>
      <span class="badge">ENTER WORLD →</span>
    </a>
  `).join("");

  if (!visibleApps.length) {
    grid.innerHTML = `<div class="empty">No world found ✦</div>`;
  }
}

function launchRandomWorld() {
  const randomIndex = Math.floor(Math.random() * APPS.length);
  const selectedWorld = APPS[randomIndex];

  surpriseBtn.disabled = true;
  surpriseBtn.textContent = `🚀 Launching ${selectedWorld[0]}...`;

  // Small delay makes the random-world action visible before navigation.
  setTimeout(() => {
    window.location.href = selectedWorld[4];
  }, 350);
}

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
surpriseBtn.addEventListener("click", launchRandomWorld);

newIdeaBtn.addEventListener("click", () => {
  ideaEl.textContent = ideas[Math.floor(Math.random() * ideas.length)];
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "svTheme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

if (localStorage.getItem("svTheme") === "light") {
  document.body.classList.add("light");
}

let visits = Number(localStorage.getItem("svVisits") || 0) + 1;
localStorage.setItem("svVisits", visits);
visitsEl.textContent = visits;

momentsEl.textContent = JSON.parse(
  localStorage.getItem("lunaraEntries") || "[]"
).length;

focusEl.textContent = localStorage.getItem("focusSessions") || 0;

function updateClock() {
  clockEl.textContent = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);
render();
