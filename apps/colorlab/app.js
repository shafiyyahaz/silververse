const a = document.getElementById('a');
const b = document.getElementById('b');
const preview = document.getElementById('preview');
const code = document.getElementById('code');

function upd(){
  preview.style.background = `linear-gradient(135deg, ${a.value}, ${b.value})`;
  code.textContent = `${a.value}  →  ${b.value}`;
  let s = JSON.parse(localStorage.getItem('sv2State') || '{}');
  s.activities = (+s.activities || 0) + 1;
  s.ach = Array.isArray(s.ach) ? s.ach : [];
  if(!s.ach.includes('dream')) s.ach.push('dream');
  localStorage.setItem('sv2State', JSON.stringify(s));
}

a.addEventListener('input', upd);
b.addEventListener('input', upd);
upd();
