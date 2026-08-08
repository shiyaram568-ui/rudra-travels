/* ============================================
   RUDRA TRAVELS — Navbar Logic
   Sticky scroll behavior + mobile menu
   ============================================ */

(function() {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const SCROLL_THRESHOLD = 80;

  // ── Sticky Navbar on Scroll ──
  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.remove('navbar--transparent');
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.add('navbar--transparent');
    }

    // Update active nav link based on scroll position
    updateActiveLink();
  }

  // ── Active Link Tracking ──
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('navbar__link--active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('navbar__link--active');
          }
        });
      }
    });
  }

  // ── Mobile Menu Toggle ──
  function toggleMobileMenu() {
    hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ── Event Listeners ──
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Initial state
  handleScroll();

})();
