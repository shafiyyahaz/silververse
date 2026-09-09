(() => {
  'use strict';
  const notes = [261.63,293.66,329.63,349.23,392,440,493.88,523.25];
  const names = ['C','D','E','F','G','A','B','C²'];
  const box = document.getElementById('keys');
  const read = document.getElementById('readout');
  const seq = document.getElementById('sequence');
  const recordBtn = document.getElementById('record');
  const stopBtn = document.getElementById('stop');
  const clearBtn = document.getElementById('clear');
  const recordState = document.getElementById('recordState');
  let count = 0, recording = false, melody = [], ac = null;

  function getAudio(){
    if(!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    return ac.resume().then(() => ac);
  }
  function mark(){
    try{
      const s=JSON.parse(localStorage.getItem('sv2State')||'{}');
      s.activities=(+s.activities||0)+1;
      s.ach=Array.isArray(s.ach)?s.ach:[];
      if(!s.ach.includes('melody')) s.ach.push('melody');
      localStorage.setItem('sv2State',JSON.stringify(s));
    }catch(e){}
  }
  function renderSequence(){
    seq.innerHTML = melody.length ? melody.map((n,i)=>`<span class="seq-note" title="${names[n.i]}">${names[n.i]}</span>`).join('') : '<span class="empty">Belum ada nada — tekan tombol di atas ✦</span>';
  }
  async function play(freq, button, idx){
    try{
      const ctx=await getAudio();
      const now=ctx.currentTime, osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(freq,now);
      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.exponentialRampToValueAtTime(0.22,now+0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.5);
      osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now+0.53);
      button.classList.add('playing'); setTimeout(()=>button.classList.remove('playing'),180);
      count++; read.textContent=`${count} note${count===1?'':'s'} played`;
      if(recording){ melody.push({i:idx,t:Date.now()}); renderSequence(); }
      mark();
    }catch(e){ read.textContent='Klik tombol lagi untuk mengaktifkan audio ✦'; }
  }
  notes.forEach((freq,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='note-key'; b.textContent=names[i]; b.style.height=`${90+i*5}px`;
    b.addEventListener('pointerdown',()=>play(freq,b,i));
    b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play(freq,b,i)}});
    box.appendChild(b);
  });
  recordBtn.addEventListener('click',async()=>{await getAudio(); melody=[];recording=true;recordBtn.disabled=true;stopBtn.disabled=false;recordState.textContent='● Recording…';renderSequence();});
  stopBtn.addEventListener('click',()=>{recording=false;recordBtn.disabled=false;stopBtn.disabled=true;recordState.textContent=melody.length?`${melody.length} notes captured`:'Nothing recorded';renderSequence();});
  clearBtn.addEventListener('click',()=>{melody=[];recording=false;recordBtn.disabled=false;stopBtn.disabled=true;recordState.textContent='Ready';renderSequence();});
  box.style.display='flex'; box.style.alignItems='flex-end'; box.style.justifyContent='center'; box.style.flexWrap='wrap'; box.style.gap='8px';
  renderSequence();
})();