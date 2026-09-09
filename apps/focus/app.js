(() => {
  'use strict';
  const DEFAULT = 25 * 60;
  let left = DEFAULT;
  let endAt = 0;
  let running = false;
  let raf = 0;
  let sessions = Number(localStorage.getItem('focusSessions') || 0);
  const timerEl = document.getElementById('timer');
  const msgEl = document.getElementById('msg');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');

  function draw(){
    const sec = Math.max(0, Math.ceil(left));
    timerEl.textContent = `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    msgEl.textContent = `${sessions} focus session${sessions === 1 ? '' : 's'}${running ? ' · sedang berjalan' : ''}`;
    startBtn.textContent = running ? '▶ Running…' : '▶ Start';
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
  }
  function mark(){
    try {
      const s = JSON.parse(localStorage.getItem('sv2State') || '{}');
      s.activities = (+s.activities || 0) + 1;
      s.ach = Array.isArray(s.ach) ? s.ach : [];
      if(!s.ach.includes('focus')) s.ach.push('focus');
      localStorage.setItem('sv2State', JSON.stringify(s));
    } catch(e) {}
  }
  function tick(){
    if(!running) return;
    left = Math.max(0, (endAt - Date.now()) / 1000);
    draw();
    if(left <= 0){
      running = false;
      sessions++;
      localStorage.setItem('focusSessions', String(sessions));
      draw();
      alert('✨ Focus session selesai!');
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  function start(){
    if(running) return;
    if(left <= 0) left = DEFAULT;
    endAt = Date.now() + left * 1000;
    running = true;
    mark();
    draw();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }
  function pause(){
    if(!running) return;
    left = Math.max(0, (endAt - Date.now()) / 1000);
    running = false;
    cancelAnimationFrame(raf);
    draw();
  }
  function reset(){
    running = false;
    cancelAnimationFrame(raf);
    left = DEFAULT;
    draw();
  }
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);
  draw();
})();
