const canvas=document.getElementById("sky");
const ctx=canvas.getContext("2d");
let W=0,H=0;
let speed=1,mode="CALM",warpTimer=0;
const stars=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),z:Math.random(),size:.6+Math.random()*1.8,tw:Math.random()*6.28}));

function resize(){
  const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;
  W=r.width;H=r.height;canvas.width=W*d;canvas.height=H*d;ctx.setTransform(d,0,0,d,0,0);
}
addEventListener("resize",resize); resize();

function draw(t){
  ctx.clearRect(0,0,W,H);
  // Deep-space haze
  const g=ctx.createRadialGradient(W*.52,H*.48,0,W*.52,H*.48,Math.max(W,H)*.7);
  g.addColorStop(0,"rgba(100,130,255,.08)");g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  for(const s of stars){
    s.y += .00035*s.z*speed;
    if(s.y>1.03)s.y=-.03;
    const tw=.55+.45*Math.sin(t*.0015+s.tw);
    const px=s.x*W,py=s.y*H;
    const r=s.size*(.55+s.z)*tw;
    ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(220,235,255,${.45+.35*s.z*tw})`;ctx.fill();
    if(speed>2){
      ctx.strokeStyle=`rgba(140,180,255,${.12*s.z})`;
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-10*s.z*speed);ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function update(){
 document.getElementById("speed").textContent=speed.toFixed(1)+"×";
 document.getElementById("mode").textContent=mode;
}
document.getElementById("warp").onclick=()=>{window.svActivity?.("stellar");
 speed=4.8;mode="WARP";warpTimer=performance.now()+2200;update();
 setTimeout(()=>{speed=1;mode="CALM";update()},2200);
};
document.getElementById("calm").onclick=()=>{speed=1;mode="CALM";update()};
document.getElementById("reset").onclick=()=>{speed=1;mode="CALM";stars.forEach(s=>{s.x=Math.random();s.y=Math.random()});update()};
document.getElementById("count").textContent=stars.length;
update();
