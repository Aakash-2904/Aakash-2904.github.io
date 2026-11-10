// ===== GLOBAL.JS — Cursor (image-based), Ocean BG, Neural Particles, Page Transitions =====

// ---- CUSTOM AVATAR CURSOR (uses the actual avatar image) ----
(function() {
  // Create cursor using the actual avatar photo, circular clipped
  const cursorEl = document.createElement('div');
  cursorEl.id = 'cursor-avatar';
  cursorEl.style.cssText = `
    position:fixed; top:0; left:0; width:58px; height:58px;
    pointer-events:none; z-index:99999;
    transform:translate(-50%,-50%);
    will-change:transform;
    transition: filter 0.2s;
  `;
  cursorEl.innerHTML = `
    <div style="width:58px;height:58px;border-radius:50%;overflow:hidden;
      border:2px solid rgba(0,229,255,0.8);
      box-shadow:0 0 18px rgba(0,229,255,0.7), 0 0 40px rgba(0,229,255,0.3);
      background:#0a1a2e;">
      <img src="avatar.png" style="width:100%;height:100%;object-fit:cover;object-position:center top;transform:scale(1.15) translateY(8%);" draggable="false"/>
    </div>
  `;
  document.body.appendChild(cursorEl);

  const trail = document.createElement('div');
  trail.id = 'cursor-trail';
  trail.style.cssText = `
    position:fixed;top:0;left:0;width:20px;height:20px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,229,255,0.5),transparent);
    pointer-events:none;z-index:99998;transform:translate(-50%,-50%);
    transition:left 0.15s ease,top 0.15s ease;opacity:0.6;
  `;
  document.body.appendChild(trail);

  // Particle trail on move
  const particles = [];
  let lastParticleTime = 0;

  let mx = -200, my = -200;
  let trailX = -200, trailY = -200;
  let lastMx = -200;
  let tiltAngle = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;

    // Spawn tiny glow particles
    const now = Date.now();
    if (now - lastParticleTime > 40) {
      lastParticleTime = now;
      const p = document.createElement('div');
      const size = 4 + Math.random() * 5;
      p.style.cssText = `
        position:fixed;left:${mx}px;top:${my}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(0,229,255,${0.3 + Math.random()*0.4});
        pointer-events:none;z-index:99997;
        transform:translate(-50%,-50%);
        transition:opacity 0.5s,transform 0.5s;
        box-shadow:0 0 6px rgba(0,229,255,0.6);
      `;
      document.body.appendChild(p);
      particles.push(p);
      requestAnimationFrame(() => {
        p.style.opacity = '0';
        p.style.transform = `translate(${-50 + (Math.random()-0.5)*30}%,${-50 + (Math.random()-0.5)*30 - 15}%) scale(0.3)`;
      });
      setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 550);
    }
  });

  function animateCursor() {
    const dx = mx - lastMx;
    const targetTilt = Math.max(-18, Math.min(18, dx * 0.5));
    tiltAngle += (targetTilt - tiltAngle) * 0.15;

    cursorEl.style.left = mx + 'px';
    cursorEl.style.top = my + 'px';
    cursorEl.style.transform = `translate(-50%,-50%) rotate(${tiltAngle}deg) scale(${Math.abs(dx) > 8 ? 1.08 : 1})`;

    trailX += (mx - trailX) * 0.1;
    trailY += (my - trailY) * 0.1;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';

    lastMx = mx;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow on hover
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a,button,.glass-card,.btn-glow,.filter-btn')) {
      cursorEl.style.filter = 'drop-shadow(0 0 16px rgba(0,229,255,1)) brightness(1.15)';
      cursorEl.querySelector('div').style.borderColor = 'rgba(0,229,255,1)';
      cursorEl.querySelector('div').style.boxShadow = '0 0 28px rgba(0,229,255,1), 0 0 60px rgba(0,229,255,0.5)';
      cursorEl.style.width = '70px'; cursorEl.style.height = '70px';
      cursorEl.querySelector('div').style.width = '70px'; cursorEl.querySelector('div').style.height = '70px';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a,button,.glass-card,.btn-glow,.filter-btn')) {
      cursorEl.style.filter = '';
      cursorEl.querySelector('div').style.borderColor = 'rgba(0,229,255,0.8)';
      cursorEl.querySelector('div').style.boxShadow = '0 0 18px rgba(0,229,255,0.7), 0 0 40px rgba(0,229,255,0.3)';
      cursorEl.style.width = '58px'; cursorEl.style.height = '58px';
      cursorEl.querySelector('div').style.width = '58px'; cursorEl.querySelector('div').style.height = '58px';
    }
  });
})();

// ---- ANIMATED OCEAN BACKGROUND ----
(function() {
  const container = document.createElement('div');
  container.id = 'ocean-bg';
  container.style.cssText = 'position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;';
  const canvas = document.createElement('canvas');
  canvas.id = 'ocean-canvas';
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  container.appendChild(canvas);
  document.body.insertBefore(container, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  function drawOcean() {
    ctx.clearRect(0, 0, W, H);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
    sky.addColorStop(0, '#010610');
    sky.addColorStop(0.4, '#03122a');
    sky.addColorStop(0.7, '#051e3e');
    sky.addColorStop(1, '#082d52');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.62);

    // Sun glow
    const sunX = W * 0.3, sunY = H * 0.38;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.4);
    sunGlow.addColorStop(0, 'rgba(255,200,80,0.18)'); sunGlow.addColorStop(0.2, 'rgba(255,120,40,0.07)');
    sunGlow.addColorStop(0.5, 'rgba(0,100,200,0.04)'); sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow; ctx.fillRect(0, 0, W, H * 0.65);

    const sunDisc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 48);
    sunDisc.addColorStop(0, 'rgba(255,235,130,0.95)'); sunDisc.addColorStop(0.5, 'rgba(255,170,60,0.65)');
    sunDisc.addColorStop(1, 'transparent');
    ctx.fillStyle = sunDisc; ctx.beginPath(); ctx.arc(sunX, sunY, 48, 0, Math.PI*2); ctx.fill();

    // Stars
    if (!window._stars) {
      window._stars = Array.from({length:130}, () => ({
        x:Math.random(), y:Math.random()*0.55,
        r:Math.random()*1.6+0.3, blink:Math.random()*Math.PI*2
      }));
    }
    window._stars.forEach(s => {
      const alpha = 0.3 + 0.5 * Math.sin(t * 0.7 + s.blink);
      ctx.fillStyle = `rgba(200,220,255,${alpha})`;
      ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2); ctx.fill();
    });

    // Ocean
    const water = ctx.createLinearGradient(0, H*0.58, 0, H);
    water.addColorStop(0, '#0a3060'); water.addColorStop(0.3, '#061e42');
    water.addColorStop(0.6, '#041530'); water.addColorStop(1, '#020c1e');
    ctx.fillStyle = water; ctx.fillRect(0, H*0.58, W, H*0.42);

    // Sun reflection on water
    ctx.save();
    const reflH = H * 0.38;
    for (let row = 0; row < 30; row++) {
      const ry = H * 0.62 + row * (H * 0.38 / 30);
      const spread = 20 + row * 3.5;
      const shimmer = Math.sin(t * 3 + row * 0.4) * 8;
      const alpha = Math.max(0, 0.25 - row * 0.008);
      ctx.fillStyle = `rgba(255,${180 - row*2},${50 + row},${alpha})`;
      ctx.beginPath();
      ctx.ellipse(sunX + shimmer, ry, spread, 3, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    // Cyan AI glow (right)
    const aiGlow = ctx.createRadialGradient(W*0.82, H*0.5, 0, W*0.82, H*0.5, W*0.5);
    aiGlow.addColorStop(0, 'rgba(0,180,255,0.05)'); aiGlow.addColorStop(0.5, 'rgba(100,0,255,0.025)');
    aiGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = aiGlow; ctx.fillRect(0, 0, W, H);

    // Waves
    const waveLayers = [
      {y:H*0.615, amp:8,  freq:0.006, speed:0.8,  alpha:0.55, color:'#1a5080'},
      {y:H*0.64,  amp:12, freq:0.008, speed:1.1,  alpha:0.45, color:'#1e6090'},
      {y:H*0.67,  amp:10, freq:0.005, speed:0.6,  alpha:0.5,  color:'#0f3a60'},
      {y:H*0.71,  amp:7,  freq:0.009, speed:1.4,  alpha:0.4,  color:'#0a2a48'},
      {y:H*0.76,  amp:14, freq:0.004, speed:0.5,  alpha:0.5,  color:'#081e38'},
    ];
    waveLayers.forEach(layer => {
      ctx.beginPath(); ctx.moveTo(0, layer.y);
      for (let x = 0; x <= W; x += 4) {
        const y = layer.y + Math.sin(x*layer.freq + t*layer.speed)*layer.amp
                          + Math.sin(x*layer.freq*1.7 + t*layer.speed*0.7+1)*(layer.amp*0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle = layer.color; ctx.globalAlpha = layer.alpha; ctx.fill(); ctx.globalAlpha = 1;
    });

    // Wave crests
    [0.615, 0.64, 0.68].forEach((yr, i) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = H*yr + Math.sin(x*0.007+t*(0.8+i*0.3))*9 + Math.sin(x*0.013+t*0.5+i)*4;
        if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = `rgba(100,180,255,${0.14-i*0.03})`; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Birds
    if (!window._birds) {
      window._birds = Array.from({length:8}, () => ({
        x:Math.random()*W, y:H*0.22+Math.random()*H*0.18,
        speed:0.25+Math.random()*0.5, size:4+Math.random()*4, bob:Math.random()*Math.PI*2
      }));
    }
    window._birds.forEach(bird => {
      bird.x += bird.speed*0.5;
      if (bird.x > W+30) bird.x = -30;
      const by = bird.y + Math.sin(t*1.5+bird.bob)*3;
      ctx.save(); ctx.translate(bird.x, by);
      ctx.strokeStyle='rgba(160,190,230,0.7)'; ctx.lineWidth=1.5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-bird.size,0); ctx.quadraticCurveTo(0,-bird.size*0.6,bird.size,0); ctx.stroke();
      ctx.restore();
    });

    // Mountain silhouette
    const mountGrad = ctx.createLinearGradient(W*0.55, H*0.3, W*0.55, H*0.65);
    mountGrad.addColorStop(0,'#0a1a2e'); mountGrad.addColorStop(1,'#040f1e');
    ctx.fillStyle = mountGrad;
    ctx.beginPath(); ctx.moveTo(W*0.55, H*0.65);
    ctx.lineTo(W*0.62, H*0.42); ctx.lineTo(W*0.72, H*0.55);
    ctx.lineTo(W*0.78, H*0.38); ctx.lineTo(W*0.88, H*0.52);
    ctx.lineTo(W*0.95, H*0.44); ctx.lineTo(W, H*0.5); ctx.lineTo(W, H*0.65);
    ctx.closePath(); ctx.fill();

    // Tree silhouette
    ctx.fillStyle = '#050e1c';
    ctx.beginPath(); ctx.moveTo(W*0.6, H*0.65);
    for (let x = W*0.6; x <= W; x += 8) {
      const tH = 16 + Math.sin(x*0.05)*9 + Math.sin(x*0.13+1)*5;
      ctx.lineTo(x, H*0.65-tH); ctx.lineTo(x+4, H*0.65-tH+5);
    }
    ctx.lineTo(W, H*0.65); ctx.closePath(); ctx.fill();

    // Foreground beach
    const beach = ctx.createLinearGradient(0, H*0.82, 0, H);
    beach.addColorStop(0,'#0d2035'); beach.addColorStop(1,'#060f1c');
    ctx.fillStyle = beach; ctx.fillRect(0, H*0.85, W, H*0.15);
    const wetRefl = ctx.createLinearGradient(0, H*0.83, 0, H*0.87);
    wetRefl.addColorStop(0,'rgba(0,120,200,0.14)'); wetRefl.addColorStop(1,'transparent');
    ctx.fillStyle = wetRefl; ctx.fillRect(0, H*0.83, W, H*0.05);

    t += 0.008;
  }
  function animate() { drawOcean(); requestAnimationFrame(animate); }
  animate();
})();

// ---- NEURAL NETWORK PARTICLES ----
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.3;';
  document.body.insertBefore(canvas, document.body.children[1] || null);
  const ctx = canvas.getContext('2d');
  let W, H;
  const N = 55; let nodes = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', () => { resize(); initNodes(); }); resize();

  function initNodes() {
    nodes = Array.from({length:N}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*0.28, vy:(Math.random()-0.5)*0.28,
      r:Math.random()*2+1, pulse:Math.random()*Math.PI*2
    }));
  }
  initNodes();

  function draw() {
    ctx.clearRect(0,0,W,H);
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy; n.pulse+=0.02;
      if(n.x<0||n.x>W) n.vx*=-1; if(n.y<0||n.y>H) n.vy*=-1;
    });
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) {
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<160) {
        ctx.strokeStyle=`rgba(0,200,255,${(1-d/160)*0.4})`; ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
      }
    }
    nodes.forEach(n => {
      ctx.fillStyle=`rgba(0,229,255,${0.5+0.4*Math.sin(n.pulse)})`;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---- V2: readability scrim above the animated background ----
(function() {
  const s = document.createElement('div');
  s.id = 'v2-scrim';
  document.body.insertBefore(s, document.body.children[2] || null);
})();

// ---- SCANLINE ----
(function() {
  const sl = document.createElement('div');
  sl.className = 'scanline-overlay'; document.body.appendChild(sl);
})();

// ---- PAGE TRANSITION ----
(function() {
  const ov = document.createElement('div');
  ov.id = 'page-transition';
  ov.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:1.2rem"><div id="pt-avatar" style="width:70px;height:70px;border-radius:50%;overflow:hidden;border:2px solid rgba(0,229,255,0.8);box-shadow:0 0 20px rgba(0,229,255,0.8);"><img src="avatar.png" style="width:100%;height:100%;object-fit:cover;object-position:center top;transform:scale(1.15) translateY(8%);"/></div><span class="pt-text">LOADING...</span></div>';
  document.body.appendChild(ov);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const msgs = ['LOADING MODULE','NAVIGATING','RENDERING','SYNCING AI'];
      ov.querySelector('.pt-text').textContent = msgs[Math.floor(Math.random()*msgs.length)] + '...';
      ov.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 500);
    });
  });
  window.addEventListener('pageshow', () => ov.classList.remove('active'));
})();

// ---- SCROLL REVEAL ----
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ---- SKILL BAR ANIMATION ----
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill[data-width]').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.width; }, 200);
        });
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.skills-section').forEach(el => obs.observe(el));
})();
