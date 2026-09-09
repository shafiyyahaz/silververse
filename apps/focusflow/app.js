let left = 1500;
let timerId = null;
let sessions = +(localStorage.getItem('focusSessions') || 0);
const timerEl = document.getElementById('timer');
const msgEl = document.getElementById('msg');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function draw(){
  timerEl.textContent = `${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;
  msgEl.textContent = `${sessions} focus sessions`;
}

function markActivity(){
  const s = JSON.parse(localStorage.getItem('sv2State') || '{}');
  s.activities = (+s.activities || 0) + 1;
  s.ach = Array.isArray(s.ach) ? s.ach : [];
  if(!s.ach.includes('focus')) s.ach.push('focus');
  localStorage.setItem('sv2State', JSON.stringify(s));
}

function startFocus(){
  if(timerId !== null) return;
  markActivity();
  timerId = setInterval(() => {
    left--;
    draw();
    if(left <= 0){
      pauseFocus();
      sessions++;
      localStorage.setItem('focusSessions', sessions);
      draw();
      alert('Focus session selesai ✦');
    }
  }, 1000);
}

function pauseFocus(){
  if(timerId !== null) clearInterval(timerId);
  timerId = null;
}

function resetFocus(){
  pauseFocus();
  left = 1500;
  draw();
}

startBtn.addEventListener('click', startFocus);
pauseBtn.addEventListener('click', pauseFocus);
resetBtn.addEventListener('click', resetFocus);
draw();
