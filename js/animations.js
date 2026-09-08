/**
 * animations.js
 * – Particle/network canvas background
 * – Cursor glow (desktop only)
 * – Scroll reveal (IntersectionObserver)
 * – Scroll progress bar
 * – Magnetic button effect
 * – Active nav link highlight
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── SCROLL PROGRESS BAR ── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', function () {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── CANVAS BACKGROUND ── */
  function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let rafId;
    let w, h;

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function buildNodes() {
      nodes = [];
      const count = Math.max(20, Math.floor(w / 85));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x:  Math.random() * w,
          y:  Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r:  Math.random() * 1.8 + 0.8,
        });
      }
    }

    function getAccent() {
      return document.documentElement.getAttribute('data-theme') === 'light'
        ? '74,110,245'
        : '99,130,255';
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const ac = getAccent();

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (0.055 * (1 - dist / 120)).toFixed(3);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${ac},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ac},0.28)`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      buildNodes();
      if (!prefersReduced) draw();
    }

    window.addEventListener('resize', function () {
      cancelAnimationFrame(rafId);
      resize();
      buildNodes();
      if (!prefersReduced) draw();
    }, { passive: true });

    start();
  }

  /* ── CURSOR GLOW ── */
  function initCursorGlow() {
    if (prefersReduced) return;
    // Only on real pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let mx = -400, my = -400;
    let cx = -400, cy = -400;
    let rafGlow;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function step() {
      // Smooth follow
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      rafGlow = requestAnimationFrame(step);
    }
    step();

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      glow.style.opacity = '1';
    });
  }

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal-up, .reveal-right');
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── MAGNETIC BUTTONS ── */
  function initMagnetic() {
    if (prefersReduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const btns = document.querySelectorAll('.magnetic');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          const id = entry.target.getAttribute('id');
          const active = document.querySelector(`.nav-link[href="#${id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initCanvas();
    initCursorGlow();
    initScrollReveal();
    initMagnetic();
    initActiveNav();
  });
})();
