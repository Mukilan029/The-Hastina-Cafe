/* ============================================================
   The Hastina Cafe — Main Script
============================================================ */

/* ===== READING PROGRESS BAR ===== */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});

/* ===== CUSTOM CURSOR ===== */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .menu-card, .feature-card, .stat-panel').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ===== STICKY NAV ===== */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== STARFIELD CANVAS ===== */
(function() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random(),
        delta: (Math.random() - 0.5) * 0.01,
        speed: Math.random() * 0.04 + 0.01
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      s.y -= s.speed;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247,240,227,${Math.max(0.05, Math.min(1, s.alpha))})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    createStars();
    draw();
  });

  resize();
  createStars();
  draw();
})();

/* ===== SVG STRING LIGHTS ANIMATION ===== */
(function() {
  const lights = document.querySelectorAll('.bulb');
  lights.forEach((bulb, i) => {
    const delay = i * 0.18;
    bulb.style.animationDelay = delay + 's';
  });
})();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ===== MENU TAB FILTER ===== */
const tabBtns = document.querySelectorAll('.tab-btn');
const menuItems = document.querySelectorAll('.menu-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const filter = btn.dataset.filter;
    menuItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ===== BACK TO TOP ===== */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SMOOTH SCROLL NAV OFFSET ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== AMBIANCE STRING LIGHTS (CANVAS) ===== */
(function() {
  const canvas = document.getElementById('ambiance-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const ROPES = 3;
  const BULBS_PER_ROPE = 14;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawLights() {
    ctx.clearRect(0, 0, W, H);
    const ropeSpacing = H / (ROPES + 1);

    for (let r = 0; r < ROPES; r++) {
      const y0 = ropeSpacing * (r + 1);
      const amplitude = 18 + r * 6;
      const freq = (Math.PI * 2) / W * BULBS_PER_ROPE * 0.5;
      const t = Date.now() * 0.0006;

      // Draw rope
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(196,136,43,0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 2) {
        const sag = Math.sin(x * 0.0025) * amplitude * 0.5;
        const wave = Math.sin(x * freq + t + r) * 3;
        const y = y0 + sag + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw bulbs
      for (let b = 0; b < BULBS_PER_ROPE; b++) {
        const x = (b / (BULBS_PER_ROPE - 1)) * W;
        const sag = Math.sin(x * 0.0025) * amplitude * 0.5;
        const wave = Math.sin(x * freq + t + r) * 3;
        const y = y0 + sag + wave + 8;
        const flicker = 0.75 + 0.25 * Math.sin(t * 3.7 + b * 0.9 + r * 2.1);
        const alpha = Math.max(0.5, Math.min(1, flicker));

        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 14);
        grad.addColorStop(0, `rgba(239,201,122,${alpha * 0.6})`);
        grad.addColorStop(0.4, `rgba(196,136,43,${alpha * 0.25})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bulb body
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,201,122,${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(drawLights);
  }

  resize();
  window.addEventListener('resize', resize);
  drawLights();
})();
