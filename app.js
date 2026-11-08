/* ══════════════════════════════════════
   PARTICLES BACKGROUND
══════════════════════════════════════ */
(function(){
  var cv=document.getElementById('canvas'),ctx=cv.getContext('2d');
  var W,H,P=[];
  function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
  rs(); addEventListener('resize',rs);
  var C=['rgba(244,167,195,','rgba(201,144,106,','rgba(212,175,55,','rgba(255,214,231,','rgba(255,255,255,'];
  function Pt(){this.reset(true);}
  Pt.prototype.reset=function(i){
    this.x=Math.random()*W; this.y=i?Math.random()*H:H+10;
    this.r=Math.random()*1.8+.4; this.a=0; this.ta=Math.random()*.6+.1;
    this.vx=(Math.random()-.5)*.3; this.vy=-(Math.random()*.4+.1);
    this.c=C[Math.floor(Math.random()*C.length)];
    this.life=0; this.ml=Math.random()*300+150;
    this.tw=Math.random()*Math.PI*2; this.ts=Math.random()*.04+.01;
  };
  Pt.prototype.update=function(){
    this.x+=this.vx; this.y+=this.vy; this.tw+=this.ts; this.life++;
    if(this.life<40) this.a=(this.life/40)*this.ta;
    else if(this.life>this.ml-40) this.a=((this.ml-this.life)/40)*this.ta;
    else this.a=this.ta*(.7+.3*Math.sin(this.tw));
    if(this.life>=this.ml) this.reset(false);
  };
  Pt.prototype.draw=function(){
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=this.c+this.a+')'; ctx.fill();
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r*2.5,0,Math.PI*2);
    ctx.fillStyle=this.c+(this.a*.2)+')'; ctx.fill();
  };
  for(var i=0;i<120;i++) P.push(new Pt());
  function loop(){ctx.clearRect(0,0,W,H);P.forEach(function(p){p.update();p.draw();});requestAnimationFrame(loop);}
  loop();
})();

/* ══════════════════════════════════════
   AMBIENT ORBS
══════════════════════════════════════ */
(function(){
  var orbs=[
    {l:'12%',t:'18%',w:'38vw',c:'rgba(92,10,46,.2)',d:14,dx:35,dy:22},
    {l:'78%',t:'68%',w:'32vw',c:'rgba(10,22,40,.22)',d:18,dx:-28,dy:32},
    {l:'52%',t:'42%',w:'28vw',c:'rgba(201,144,106,.07)',d:11,dx:22,dy:-22},
    {l:'82%',t:'12%',w:'26vw',c:'rgba(244,167,195,.08)',d:16,dx:-32,dy:28}
  ];
  var wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
  orbs.forEach(function(o,i){
    var el=document.createElement('div'), id='ob'+i, st=document.createElement('style');
    el.style.cssText='position:absolute;left:'+o.l+';top:'+o.t+';width:'+o.w+';height:'+o.w+
      ';transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,'+o.c+' 0%,transparent 70%);filter:blur(60px);animation:'+id+' '+o.d+'s ease-in-out infinite;';
    st.textContent='@keyframes '+id+
      '{0%,100%{transform:translate(-50%,-50%) scale(1)}'+
      '50%{transform:translate(calc(-50% + '+o.dx+'px),calc(-50% + '+o.dy+'px)) scale(1.15)}}';
    document.head.appendChild(st);
    wrap.appendChild(el);
  });
  document.body.insertBefore(wrap,document.body.firstChild);
})();

/* ══════════════════════════════════════
   AUTO-START — no login, no intro
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){
  initPetals();
  initReveal();
  // Force-reveal all sections after 600ms as fallback
  setTimeout(function(){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('on'); });
  }, 600);
});

/* ══════════════════════════════════════
   PETALS
══════════════════════════════════════ */
function initPetals(){
  var c = document.getElementById('petals');
  var em = ['\uD83C\uDF38','\uD83C\uDF39','\uD83C\uDF3A','\uD83C\uDF37','\uD83D\uDC90'];
  var cl = ['rgba(244,167,195,.6)','rgba(201,144,106,.5)','rgba(255,182,193,.55)','rgba(212,175,55,.4)'];
  function mk(){
    var p=document.createElement('div'); p.className='petal';
    var s=Math.random()*18+10, l=Math.random()*110-5, d=Math.random()*14+8, dl=Math.random()*8;
    p.style.cssText='left:'+l+'%;font-size:'+s+'px;line-height:1;animation-duration:'+d+'s;animation-delay:'+dl+'s;';
    if(Math.random()>.4){
      p.textContent=em[Math.floor(Math.random()*em.length)];
      p.style.background='transparent';
    } else {
      p.style.width=s+'px'; p.style.height=s+'px';
      p.style.background=cl[Math.floor(Math.random()*cl.length)];
    }
    c.appendChild(p);
    setTimeout(function(){ p.remove(); },(d+dl)*1000+500);
  }
  setInterval(mk,750);
  for(var i=0;i<12;i++) setTimeout(mk, i*120);
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initReveal(){
  if(!window.IntersectionObserver){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('on'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('on'); obs.unobserve(e.target); }
    });
  },{threshold:.08, rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
}

/* ══════════════════════════════════════
   CURSOR HEARTS
══════════════════════════════════════ */
document.addEventListener('click', spawnH);
document.addEventListener('touchend',function(e){
  var t=e.changedTouches[0];
  spawnH({clientX:t.clientX, clientY:t.clientY});
});
function spawnH(e){
  var hm=['\u2764\uFE0F','\uD83D\uDC96','\uD83D\uDC97','\uD83D\uDC95','\uD83D\uDC9E','\uD83D\uDC93','\uD83D\uDC9D','\uD83C\uDF39','\uD83C\uDF38'];
  var n=5+Math.floor(Math.random()*5);
  for(var i=0;i<n;i++)(function(i){
    setTimeout(function(){
      var el=document.createElement('div'); el.className='ch';
      el.textContent=hm[Math.floor(Math.random()*hm.length)];
      el.style.setProperty('--tx',(Math.random()-.5)*180+'px');
      el.style.setProperty('--ty',-(Math.random()*130+40)+'px');
      el.style.left=(e.clientX-10)+'px';
      el.style.top=(e.clientY-10)+'px';
      el.style.fontSize=(13+Math.random()*15)+'px';
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); },1300);
    },i*55);
  })(i);
}

/* ══════════════════════════════════════
   MUSIC PLAYER
══════════════════════════════════════ */
var mpOn = false;
function toggleM(){
  var aud = document.getElementById('audio');
  var mb  = document.getElementById('mb');
  if(mpOn){ aud.pause(); mb.classList.remove('play'); }
  else     { aud.play().catch(function(){}); mb.classList.add('play'); }
  mpOn = !mpOn;
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
function openModal(){
  document.getElementById('modal').classList.add('on');
  document.body.style.overflow='hidden';
  setTimeout(function(){ spawnH({clientX:innerWidth/2, clientY:innerHeight/2}); },350);
}
function closeModal(){
  document.getElementById('modal').classList.remove('on');
  document.body.style.overflow='';
}

/* ══════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════ */
function openLB(src){
  document.getElementById('lb-img').src=src;
  document.getElementById('lightbox').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeLB(){
  document.getElementById('lightbox').classList.remove('on');
  document.body.style.overflow='';
}

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){ closeModal(); closeLB(); }
});

/* ══════════════════════════════════════
   COUNTDOWN — 9 November
══════════════════════════════════════ */
var prev={};
function pad(n){ return String(n).padStart(2,'0'); }
function setNum(id,v){
  var el=document.getElementById(id), s=pad(v);
  if(prev[id]!==s){
    el.style.transform='rotateX(90deg)';
    setTimeout(function(){ el.textContent=s; el.style.transform=''; },150);
    prev[id]=s;
  }
}
function tickCD(){
  var now=new Date();
  var t=new Date(now.getFullYear(),10,9,0,0,0); // Nov=month 10
  if(t<=now) t.setFullYear(now.getFullYear()+1);
  var df=t-now;
  if(df<=0){
    document.getElementById('cd-grid').style.display='none';
    document.getElementById('bday-msg').style.display='block';
    return;
  }
  setNum('cd-d', Math.floor(df/86400000));
  setNum('cd-h', Math.floor((df%86400000)/3600000));
  setNum('cd-m', Math.floor((df%3600000)/60000));
  setNum('cd-s', Math.floor((df%60000)/1000));
}
tickCD();
setInterval(tickCD,1000);
