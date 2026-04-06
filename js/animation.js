// =============================================
//  XINITY — animations.js  [UPGRADED v2]
//  Particles · 3D Tilt · Magnetic Buttons
//  Parallax · Scroll Reveal · Custom Cursor
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 1. SCROLL REVEAL — IntersectionObserver
    // ─────────────────────────────────────────
    const revealTargets = document.querySelectorAll(
      '.animate-fade-up, .animate-slide-left, .animate-slide-right, ' +
      '.animate-scale, .animate-blur, .animate-skew, .animate-flip'
    );
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  
    // Stagger grid children
    document.querySelectorAll('.about-cards, .perks-grid, .events-grid').forEach(grid => {
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.mini-card, .perk-card, .event-card').forEach((child, i) => {
            child.classList.add('animate-flip');
            setTimeout(() => child.classList.add('in-view'), i * 90);
          });
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.1 }).observe(grid);
    });
  
    // ─────────────────────────────────────────
    // 2. PARTICLE SYSTEM (canvas)
    // ─────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
  
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    const PARTICLE_COUNT = 55;
    const particles = [];
  
    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedY = -(Math.random() * 0.5 + 0.15);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        // Colour: mix of accent green and accent purple
        this.color = Math.random() > 0.6 ? '125,249,194' : '91,110,255';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity += this.fadeDir * 0.003;
        if (this.opacity > 0.65) this.fadeDir = -1;
        if (this.opacity < 0.05) this.fadeDir = 1;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }
  
    // Connection lines between close particles
    function drawConnections() {
      const maxDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(125,249,194,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
  
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  
    // ─────────────────────────────────────────
    // 3. CUSTOM CURSOR
    // ─────────────────────────────────────────
    const dot  = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
  
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  
    // Smooth ring lag
    (function lagRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lagRing);
    })();
  
    // Expand on interactive elements
    document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .event-card, .perk-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'rgba(125,249,194,0.7)';
        dot.style.width  = '12px';
        dot.style.height = '12px';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(125,249,194,0.45)';
        dot.style.width  = '8px';
        dot.style.height = '8px';
      });
    });
  
    // ─────────────────────────────────────────
    // 4. 3D TILT CARDS
    // ─────────────────────────────────────────
    document.querySelectorAll('.mini-card, .perk-card, .event-card, .form-card').forEach(card => {
      card.classList.add('tilt-card');
  
      // Add shine overlay
      const shine = document.createElement('div');
      shine.className = 'tilt-shine';
      card.style.position = card.style.position || 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(shine);
  
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -10;
        const rotY = ((x - cx) / cx) * 10;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        shine.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        shine.style.setProperty('--my', `${(y / rect.height) * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  
    // ─────────────────────────────────────────
    // 5. MAGNETIC BUTTONS
    // ─────────────────────────────────────────
    document.querySelectorAll('.btn-primary, .btn-nav').forEach(btn => {
      btn.classList.add('btn-magnetic');
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  
    // ─────────────────────────────────────────
    // 6. PARALLAX LAYERS (hero elements)
    // ─────────────────────────────────────────
    const glows = document.querySelectorAll('.glow-1, .glow-2');
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      glows.forEach((g, i) => {
        const factor = i === 0 ? 0.25 : -0.15;
        g.style.transform = `translateY(${sy * factor}px)`;
      });
    });
  
    // ─────────────────────────────────────────
    // 7. FLOATING 3D ICONS in hero
    // ─────────────────────────────────────────
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const iconData = [
        { emoji:'🚀', style:'accent-icon', anim:'anim-a', dur:'7s',  del:'0s',   top:'18%', right:'8%' },
        { emoji:'⚡', style:'glass',       anim:'anim-b', dur:'8.5s',del:'-2s',  top:'55%', right:'4%' },
        { emoji:'💡', style:'purple-icon', anim:'anim-c', dur:'6s',  del:'-1.5s',top:'30%', right:'22%' },
        { emoji:'🌐', style:'glass',       anim:'anim-d', dur:'9s',  del:'-3s',  top:'72%', right:'16%' },
        { emoji:'🏆', style:'warm-icon',   anim:'anim-a', dur:'7.5s',del:'-4s',  top:'14%', right:'30%' },
        { emoji:'💻', style:'accent-icon', anim:'anim-c', dur:'6.5s',del:'-0.5s',top:'80%', right:'28%' },
      ];
  
      iconData.forEach(d => {
        const el = document.createElement('div');
        el.className = `float-icon ${d.style} ${d.anim}`;
        el.textContent = d.emoji;
        el.style.cssText = `
          --dur:${d.dur}; --del:${d.del};
          top:${d.top}; right:${d.right};
          position:absolute; z-index:1;
        `;
        heroSection.querySelector('.hero-bg').appendChild(el);
      });
    }
  
    // ─────────────────────────────────────────
    // 8. MORPHING BLOBS
    // ─────────────────────────────────────────
    const blob1 = document.createElement('div');
    blob1.className = 'morph-blob morph-blob-1';
    blob1.style.cssText = 'top:-80px; right:-60px;';
    const blob2 = document.createElement('div');
    blob2.className = 'morph-blob morph-blob-2';
    blob2.style.cssText = 'bottom:80px; left:-40px;';
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) { heroBg.appendChild(blob1); heroBg.appendChild(blob2); }
  
    // ─────────────────────────────────────────
    // 9. GLOW BORDER on cards
    // ─────────────────────────────────────────
    document.querySelectorAll('.mini-card, .perk-card').forEach(c => c.classList.add('glow-border'));
  
    // ─────────────────────────────────────────
    // 10. SCAN LINE
    // ─────────────────────────────────────────
    const scanOverlay = document.createElement('div');
    scanOverlay.className = 'scanline-overlay';
    document.body.appendChild(scanOverlay);
  
    // ─────────────────────────────────────────
    // 11. GLITCH EFFECT on hero title
    // ─────────────────────────────────────────
    const accentSpan = document.querySelector('.hero-title .accent');
    if (accentSpan) {
      const text = accentSpan.textContent;
      accentSpan.classList.add('glitch-wrap');
      accentSpan.setAttribute('data-text', text);
    }
  
    // ─────────────────────────────────────────
    // 12. MOUSE-REACTIVE GLOW TRAIL (hero)
    // ─────────────────────────────────────────
    const trailGlow = document.createElement('div');
    trailGlow.style.cssText = `
      position:fixed; width:350px; height:350px; border-radius:50%;
      background:radial-gradient(circle, rgba(125,249,194,0.045), transparent 70%);
      pointer-events:none; z-index:2; transform:translate(-50%,-50%);
      transition:left .18s ease, top .18s ease;
    `;
    document.body.appendChild(trailGlow);
    document.addEventListener('mousemove', e => {
      trailGlow.style.left = e.clientX + 'px';
      trailGlow.style.top  = e.clientY + 'px';
    });
  
    // ─────────────────────────────────────────
    // 13. PAGE FADE IN
    // ─────────────────────────────────────────
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    }));
  
  });