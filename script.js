// ===== script.js (komplett) =====
// Bakgrundsanimation: enkla flytande partiklar i neon
const canvas = document.getElementById('bg-canvas');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

let w = 0, h = 0, particles = [];

function resize() {
  if (!canvas) return;
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
window.addEventListener('resize', resize, {passive:true});
resize();

// skapa partiklar
function initParticles(count = Math.round((w*h)/90000)) {
  particles = [];
  for (let i=0;i<count;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 0.6 + Math.random()*1.8,
      vx: (Math.random()-0.5)*0.3,
      vy: (Math.random()-0.5)*0.3,
      hue: 170 + Math.random()*120
    });
  }
}
initParticles();

// animera
let t=0;
function draw() {
  if (!ctx) return;
  ctx.clearRect(0,0,w,h);
  t += 0.01;
  // svag gradient
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0, 'rgba(10,12,20,0.07)');
  g.addColorStop(1, 'rgba(2,6,12,0.07)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // partiklar
  for (let p of particles){
    p.x += p.vx + Math.sin(t + p.hue)*0.12;
    p.y += p.vy + Math.cos(t + p.hue)*0.12;
    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, 0.08)`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();

    // glow
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue},95%,60%,0.015)`;
    ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// Anpassa antal partiklar efter storlek
let lastArea = w*h;
setInterval(() => {
  if (!canvas) return;
  const area = innerWidth*innerHeight;
  if (Math.abs(area - lastArea) > 200000) {
    lastArea = area;
    initParticles();
  }
}, 1000);

// Enkel "console"-logik (för index.html)
const consoleEl = document.getElementById('console');
if (consoleEl) {
  const lines = [
    'TAUBZ perimeter online...',
    'Scanning ports: 22,80,443,8080',
    'No critical vulnerabilities found (demo mode).',
    'User sessions: 0',
    'Hint: Use the Login button to continue.'
  ];
  let idx = 0;
  setInterval(() => {
    const line = document.createElement('div');
    line.className = 'line';
    line.textContent = lines[idx % lines.length];
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    idx++;
    if (consoleEl.children.length > 12) consoleEl.removeChild(consoleEl.firstChild);
  }, 1800);
}

// Login form: klientvalidering + demo flow (ingen serverkoppling)
const form = document.getElementById('login-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = form.username.value.trim();
    const p = form.password.value;
    if (!u || !p) {
      flashError('Fyll i användarnamn & lösenord.');
      return;
    }
    // Demo: avvisa inloggning men visa "succees" overlay
    showModal(`Försök logga in som ${u}... (frontend-demo)`);
  });
}

// Demo-knapp (fyller demo-credentials)
const demoBtn = document.getElementById('demo-btn');
if (demoBtn) {
  demoBtn.addEventListener('click', () => {
    const uEl = document.getElementById('username');
    const pEl = document.getElementById('password');
    if (uEl && pEl) {
      uEl.value = 'taubz-demo';
      pEl.value = 'demo1234';
      showModal('Demo-uppgifter ifyllda. Klicka Logga in (slarvigt simulerad).');
    }
  });
}

// Gör en kort overlay/modal
function showModal(msg) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = 0;
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.zIndex = 9999;

  const box = document.createElement('div');
  box.style.background = 'linear-gradient(180deg, rgba(6,12,20,0.98), rgba(2,6,12,0.95))';
  box.style.padding = '22px';
  box.style.borderRadius = '12px';
  box.style.border = '1px solid rgba(25,243,255,0.06)';
  box.style.maxWidth = '420px';
  box.style.textAlign = 'center';
  box.style.color = 'var(--neon-cyan)';
  box.style.fontFamily = 'Share Tech Mono, monospace';

  const p = document.createElement('div');
  p.textContent = msg;
  p.style.marginBottom = '14px';

  const ok = document.createElement('button');
  ok.textContent = 'Ok';
  ok.className = 'btn primary';
  ok.onclick = () => document.body.removeChild(overlay);

  box.appendChild(p);
  box.appendChild(ok);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// Enkel fel-flash (i login-card)
function flashError(text) {
  const loginCard = document.querySelector('.login-card');
  if (!loginCard) return alert(text);
  const el = document.createElement('div');
  el.textContent = text;
  el.style.background = 'linear-gradient(90deg, rgba(255,43,215,0.08), rgba(25,243,255,0.06))';
  el.style.border = '1px solid rgba(255,43,215,0.12)';
  el.style.color = '#ff9fdc';
  el.style.padding = '8px 12px';
  el.style.borderRadius = '8px';
  el.style.marginBottom = '12px';
  el.style.fontSize = '13px';
  loginCard.insertBefore(el, loginCard.firstChild);
  setTimeout(()=> el.style.opacity = '0', 2200);
  setTimeout(()=> el.remove(), 2600);
}
