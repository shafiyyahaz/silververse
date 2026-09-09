(() => {
  'use strict';
  const notes = [261.63,293.66,329.63,349.23,392,440,493.88,523.25];
  const names = ['C','D','E','F','G','A','B','C²'];
  const box = document.getElementById('keys');
  const read = document.getElementById('readout');
  let count = 0;
  let ac = null;

  function getAudio(){
    if(!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    if(ac.state === 'suspended') ac.resume();
    return ac;
  }
  function mark(){
    try {
      const s = JSON.parse(localStorage.getItem('sv2State') || '{}');
      s.activities = (+s.activities || 0) + 1;
      s.ach = Array.isArray(s.ach) ? s.ach : [];
      if(!s.ach.includes('melody')) s.ach.push('melody');
      localStorage.setItem('sv2State', JSON.stringify(s));
    } catch(e) {}
  }
  function play(freq, button){
    try {
      const ctx = getAudio();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.58);
      button.classList.add('playing');
      setTimeout(() => button.classList.remove('playing'), 180);
      count++; read.textContent = `${count} note${count === 1 ? '' : 's'} played`;
      mark();
    } catch(e) {
      read.textContent = 'Audio tidak tersedia di browser ini';
    }
  }
  notes.forEach((freq,i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'note-key';
    b.textContent = names[i];
    b.style.height = `${90+i*5}px`;
    b.addEventListener('click', () => play(freq,b));
    b.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(freq,b); } });
    box.appendChild(b);
  });
  box.style.display='flex'; box.style.alignItems='flex-end'; box.style.justifyContent='center'; box.style.flexWrap='wrap'; box.style.gap='8px';
})();
