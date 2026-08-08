/* ============================================
   RUDRA TRAVELS — Scroll Animations
   IntersectionObserver-based reveal animations
   ============================================ */

(function() {
  'use strict';

  // ── Scroll-triggered fade-in animations ──
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once visible, stop observing (animate only once)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // ── Counter Animation for Stats ──
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // ~60fps
      let current = 0;

      function updateCounter() {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString('en-IN');
          return;
        }
        counter.textContent = Math.floor(current).toLocaleString('en-IN');
        requestAnimationFrame(updateCounter);
      }

      updateCounter();
    });
  }

  // ── Smooth Scroll for Anchor Links ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navHeight = document.getElementById('navbar').offsetHeight;
          const targetPosition = targetEl.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ── Initialize ──
  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initSmoothScroll();
  });

  // Also run on load for elements already in viewport
  window.addEventListener('load', function() {
    // Small delay to ensure everything is rendered
    setTimeout(initScrollAnimations, 100);
  });

})();
