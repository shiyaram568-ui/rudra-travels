/* ============================================
   RUDRA TRAVELS — App Orchestrator
   Initializes all modules and Lucide icons
   ============================================ */

(function() {
  'use strict';

  // ── Initialize Lucide Icons ──
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  // ── Theme Toggle Logic (Dark Mode) ──
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (typeof lucide !== 'undefined') lucide.createIcons({ nameAttr: 'data-lucide' });
    }
  }

  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark'); // System preference
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Fallback for hero background image ──
  // If the hero image fails to load, the gradient bg is already there
  const heroBgImage = document.getElementById('hero-bg-image');
  if (heroBgImage) {
    heroBgImage.addEventListener('error', function() {
      this.style.display = 'none';
    });
  }

  // ── Route card click → scroll to booking ──
  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', function() {
      // Extract route info from the card
      const routeText = this.querySelector('.route-card__route');
      if (routeText) {
        const parts = routeText.textContent.split('→').map(s => s.trim());
        if (parts.length === 2) {
          const pickupInput = document.getElementById('pickup-city');
          const dropInput = document.getElementById('drop-city');
          if (pickupInput && dropInput) {
            pickupInput.value = parts[0];
            dropInput.value = parts[1];
          }
        }
      }

      // Scroll to booking bar
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        window.scrollTo({
          top: bookingSection.offsetTop - navHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── "Book This Vehicle" buttons → set vehicle type ──
  const fleetSedan = document.getElementById('fleet-sedan');
  const fleetSuv = document.getElementById('fleet-suv');
  const vehicleSelect = document.getElementById('vehicle-type');

  if (fleetSedan) {
    const sedanBtn = fleetSedan.querySelector('.btn');
    if (sedanBtn) {
      sedanBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (vehicleSelect) vehicleSelect.value = '5-seater';
        scrollToBooking();
      });
    }
  }

  if (fleetSuv) {
    const suvBtn = fleetSuv.querySelector('.btn');
    if (suvBtn) {
      suvBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (vehicleSelect) vehicleSelect.value = '7-seater';
        scrollToBooking();
      });
    }
  }

  function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      window.scrollTo({
        top: bookingSection.offsetTop - navHeight - 20,
        behavior: 'smooth'
      });
      // Focus on first empty input
      setTimeout(() => {
        const pickup = document.getElementById('pickup-city');
        if (pickup && !pickup.value) pickup.focus();
      }, 600);
    }
  }

  // ── Initialize Testimonials Swiper ──
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      }
    });
  }

  // Chat Widget Logic removed - Direct link to WA used instead.
  // ── Console Branding ──
  console.log(
    '%c🚗 RUDRA TRAVELS %c Premium Outstation Cab Service ',
    'background: #1B4D3E; color: #F5A623; padding: 8px 12px; font-size: 14px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #F5A623; color: #1B4D3E; padding: 8px 12px; font-size: 14px; font-weight: bold; border-radius: 0 4px 4px 0;'
  );

})();

  // ── AI Voice Pop-up Logic (Fixed: shows only ONCE per session) ──
  const voicePopup = document.getElementById('voice-popup');
  const voiceAudio = document.getElementById('ai-voiceover');
  const closeBtn = document.getElementById('voice-popup-close');
  const overlay = document.getElementById('voice-popup-close-overlay');

  if (voicePopup) {
    const showPopup = () => {
      if (!voicePopup.classList.contains('is-visible') && !sessionStorage.getItem('popup_dismissed')) {
        voicePopup.classList.add('is-visible');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (voiceAudio) {
          let playPromise = voiceAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn('Auto-play blocked by browser.', error);
            });
          }
        }
      }
    };

    const closePopup = () => {
      voicePopup.classList.remove('is-visible');
      sessionStorage.setItem('popup_dismissed', 'true');
      if (voiceAudio) {
        voiceAudio.pause();
        voiceAudio.currentTime = 0;
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (overlay) overlay.addEventListener('click', closePopup);

    // Show ONCE only after 15 seconds (no repeat)
    if (!sessionStorage.getItem('popup_dismissed')) {
      setTimeout(showPopup, 15000);
    }
  }
