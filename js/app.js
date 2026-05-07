/* ===== PORTFOLIO JS ===== */
(function(){
  'use strict';

  // === CUSTOM CURSOR ===
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let cx = 0, cy = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    if (!cursor.classList.contains('active')) {
      cursor.classList.add('active'); dot.classList.add('active');
    }
  });

  (function animateCursor() {
    cx += (dx - cx) * 0.12; cy += (dy - cy) * 0.12;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // Magnetic + hover effect
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      el.style.transform = '';
    });
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width/2;
      const my = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${mx*0.15}px,${my*0.15}px)`;
    });
  });

  // === NAV ===
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // === TEXT SCRAMBLE ===
  class Scramble {
    constructor(el) {
      this.el = el;
      this.text = el.textContent;
      this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
      this.done = false;
    }
    run() {
      if (this.done) return;
      this.done = true;
      let iter = 0;
      const iv = setInterval(() => {
        this.el.textContent = this.text.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (i < iter) return this.text[i];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        }).join('');
        if (iter >= this.text.length) clearInterval(iv);
        iter += 1/2;
      }, 30);
    }
  }

  // === SCROLL REVEAL ===
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger siblings
        const parent = el.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal-up,.reveal-text')) : [];
        const idx = siblings.indexOf(el);
        const delay = idx >= 0 ? idx * 100 : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-text,.reveal-up').forEach(el => revealObserver.observe(el));

  // Hero name scramble
  const nameObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = document.querySelectorAll('.hero__name-line');
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('visible');
            new Scramble(line).run();
          }, i * 300);
        });
        nameObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nameObserver.observe(document.getElementById('heroName'));

  // === COUNTER ANIMATION ===
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = () => {
          current += Math.ceil(target / 40);
          if (current >= target) { el.textContent = target; return; }
          el.textContent = current;
          requestAnimationFrame(step);
        };
        step();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // === 3D TILT ===
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  // === PROJECT HORIZONTAL SCROLL NAV ===
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');

  if (track && prevBtn && nextBtn) {
    const scrollAmt = 440;
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  }

  // === SMOOTH ANCHOR SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // === PARALLAX ON HERO ORBS ===
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const orbs = document.querySelectorAll('.hero__orb');
    orbs.forEach((orb, i) => {
      const speed = 0.1 + i * 0.05;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  });

})();
