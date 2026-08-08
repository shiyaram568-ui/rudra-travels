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

  // ── Console Branding ──
  console.log(
    '%c🚗 RUDRA TRAVELS %c Premium Outstation Cab Service ',
    'background: #1B4D3E; color: #F5A623; padding: 8px 12px; font-size: 14px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #F5A623; color: #1B4D3E; padding: 8px 12px; font-size: 14px; font-weight: bold; border-radius: 0 4px 4px 0;'
  );

})();
