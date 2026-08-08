/* ============================================
   RUDRA TRAVELS — Booking & Pricing Engine
   Client-side fare calculator + WhatsApp redirect
   ============================================ */

(function() {
  'use strict';

  // ══════════════════════════════════════
  // ROUTE DISTANCE DATABASE (KM)
  // Pre-configured popular routes
  // ══════════════════════════════════════
  const ROUTE_DISTANCES = {
    'delhi-manali': 540,
    'delhi-jaipur': 280,
    'delhi-agra': 230,
    'delhi-shimla': 350,
    'delhi-rishikesh': 250,
    'delhi-haridwar': 230,
    'delhi-chandigarh': 250,
    'delhi-mussoorie': 290,
    'delhi-nainital': 310,
    'delhi-dehradun': 260,
    'delhi-mathura': 180,
    'delhi-varanasi': 820,
    'delhi-amritsar': 450,
    'delhi-lucknow': 555,
    'delhi-udaipur': 660,
    'delhi-jodhpur': 590,
    'delhi-jaisalmer': 780,
    'delhi-ajmer': 400,
    'delhi-pushkar': 410,
    'delhi-mount abu': 760,
    'delhi-kasol': 520,
    'delhi-dharamshala': 475,
    'delhi-mcleod ganj': 480,
    'delhi-leh': 1010,
    'delhi-srinagar': 810,
    'jaipur-udaipur': 395,
    'jaipur-agra': 240,
    'jaipur-jodhpur': 335,
    'jaipur-ajmer': 135,
    'jaipur-pushkar': 145,
    'jaipur-jaisalmer': 560,
    'jaipur-mount abu': 500,
    'jaipur-delhi': 280,
    'agra-delhi': 230,
    'agra-jaipur': 240,
    'agra-mathura': 58,
    'agra-varanasi': 605,
    'agra-lucknow': 335,
    'chandigarh-manali': 310,
    'chandigarh-shimla': 115,
    'chandigarh-delhi': 250,
    'chandigarh-dharamshala': 240,
    'lucknow-varanasi': 310,
    'lucknow-agra': 335,
    'lucknow-delhi': 555,
  };

  // ══════════════════════════════════════
  // PRICING CONFIGURATION
  // ══════════════════════════════════════
  const PRICING = {
    '5-seater': {
      label: '5-Seater Sedan',
      ratePerKm: 9,
      minKmPerDay: 250,
      driverAllowancePerDay: 300,
      nightCharge: 200,
      gstPercent: 5,
    },
    '7-seater': {
      label: '7-Seater SUV',
      ratePerKm: 12,
      minKmPerDay: 250,
      driverAllowancePerDay: 400,
      nightCharge: 250,
      gstPercent: 5,
    }
  };

  // WhatsApp number
  const WHATSAPP_NUMBER = '917380694705';

  // ══════════════════════════════════════
  // PRICING ENGINE (runs in browser)
  // ══════════════════════════════════════
  function calculateFare(distanceKm, vehicleType) {
    const config = PRICING[vehicleType];
    if (!config) return null;

    // For a simple one-way trip: 1 day
    const tripDays = 1;
    const actualKm = distanceKm;

    // Minimum KM rule
    const minKmTotal = tripDays * config.minKmPerDay;
    const billableKm = Math.max(actualKm, minKmTotal);

    // Base fare
    const baseFare = billableKm * config.ratePerKm;

    // Driver allowance
    const driverAllowance = tripDays * config.driverAllowancePerDay;

    // Sub-total
    const subTotal = baseFare + driverAllowance;

    // GST
    const gstAmount = Math.round(subTotal * (config.gstPercent / 100));

    // Total
    const totalFare = Math.round(subTotal + gstAmount);

    return {
      distanceKm: actualKm,
      billableKm: billableKm,
      ratePerKm: config.ratePerKm,
      baseFare: Math.round(baseFare),
      driverAllowance: Math.round(driverAllowance),
      gstAmount: gstAmount,
      totalFare: totalFare,
      vehicleLabel: config.label,
    };
  }

  // ══════════════════════════════════════
  // ROUTE LOOKUP
  // ══════════════════════════════════════
  function getRouteKey(from, to) {
    return (from.trim().toLowerCase() + '-' + to.trim().toLowerCase());
  }

  function lookupDistance(from, to) {
    const key = getRouteKey(from, to);
    if (ROUTE_DISTANCES[key]) return ROUTE_DISTANCES[key];

    // Try reverse
    const reverseKey = getRouteKey(to, from);
    if (ROUTE_DISTANCES[reverseKey]) return ROUTE_DISTANCES[reverseKey];

    return null;
  }

  // ══════════════════════════════════════
  // FORMAT CURRENCY
  // ══════════════════════════════════════
  function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN');
  }

  // ══════════════════════════════════════
  // FORM HANDLING
  // ══════════════════════════════════════
  const bookingForm = document.getElementById('booking-form');
  const fareEstimate = document.getElementById('fare-estimate');
  const whatsappBtn = document.getElementById('whatsapp-book-btn');

  // Set min date to today
  const pickupDateInput = document.getElementById('pickup-date');
  if (pickupDateInput) {
    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.setAttribute('min', today);
    pickupDateInput.value = today;
  }

  // Store last calculation for WhatsApp
  let lastCalculation = null;
  let lastFormData = null;

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const pickupCity = document.getElementById('pickup-city').value.trim();
      const dropCity = document.getElementById('drop-city').value.trim();
      const pickupDate = document.getElementById('pickup-date').value;
      const vehicleType = document.getElementById('vehicle-type').value;

      // Validate
      let isValid = true;
      if (!pickupCity) { markError('pickup-city'); isValid = false; }
      if (!dropCity)   { markError('drop-city');   isValid = false; }
      if (!pickupDate) { markError('pickup-date'); isValid = false; }

      if (!isValid) return;

      // Clear errors
      clearErrors();

      // Lookup distance
      const distance = lookupDistance(pickupCity, dropCity);

      if (!distance) {
        // If route not in database, show a message and redirect to WhatsApp
        alert(
          `Route "${pickupCity} → ${dropCity}" is not in our quick-estimate database.\n\n` +
          `Don't worry! Click OK and we'll redirect you to WhatsApp where our team will ` +
          `give you an exact quote within minutes.`
        );
        
        const msg = `Hi RUDRA TRAVELS! 🚗\n\n` +
                    `I want to book an outstation cab:\n` +
                    `📍 From: ${pickupCity}\n` +
                    `📍 To: ${dropCity}\n` +
                    `📅 Date: ${pickupDate}\n` +
                    `🚗 Vehicle: ${PRICING[vehicleType].label}\n\n` +
                    `Please share the fare estimate. Thank you!`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        return;
      }

      // Calculate fare
      const result = calculateFare(distance, vehicleType);
      lastCalculation = result;
      lastFormData = { pickupCity, dropCity, pickupDate, vehicleType };

      // Display result
      displayFareEstimate(result, pickupCity, dropCity);
    });
  }

  function displayFareEstimate(result, from, to) {
    document.getElementById('est-route').textContent = `${from} → ${to}`;
    document.getElementById('est-distance').textContent = `${result.distanceKm} km (Billable: ${result.billableKm} km)`;
    document.getElementById('est-base-fare').textContent = `${formatINR(result.baseFare)} (${result.billableKm} km × ₹${result.ratePerKm})`;
    document.getElementById('est-driver').textContent = formatINR(result.driverAllowance);
    document.getElementById('est-gst').textContent = formatINR(result.gstAmount);
    document.getElementById('est-vehicle').textContent = result.vehicleLabel;
    document.getElementById('est-total').textContent = formatINR(result.totalFare);

    fareEstimate.classList.add('is-visible');

    // Smooth scroll to fare estimate
    fareEstimate.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ══════════════════════════════════════
  // WHATSAPP REDIRECT (with pre-filled data)
  // ══════════════════════════════════════
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
      e.preventDefault();

      if (!lastCalculation || !lastFormData) {
        // Fallback: generic WhatsApp message
        const msg = `Hi RUDRA TRAVELS! 🚗\nI want to book an outstation cab. Please share details.`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        return;
      }

      const { pickupCity, dropCity, pickupDate } = lastFormData;
      const r = lastCalculation;

      const msg = `Hi RUDRA TRAVELS! 🚗\n\n` +
                  `I want to book an outstation cab:\n\n` +
                  `📍 Route: ${pickupCity} → ${dropCity}\n` +
                  `📅 Date: ${pickupDate}\n` +
                  `🚗 Vehicle: ${r.vehicleLabel}\n` +
                  `📏 Distance: ${r.distanceKm} km\n\n` +
                  `💰 Fare Breakdown:\n` +
                  `   Base Fare: ${formatINR(r.baseFare)}\n` +
                  `   Driver Allowance: ${formatINR(r.driverAllowance)}\n` +
                  `   GST (5%): ${formatINR(r.gstAmount)}\n` +
                  `   ─────────────────\n` +
                  `   Total: ${formatINR(r.totalFare)}\n\n` +
                  `Please confirm my booking. Thank you! 🙏`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ══════════════════════════════════════
  // LEAD FORM (Contact Section)
  // ══════════════════════════════════════
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('lead-name').value.trim();
      const phone = document.getElementById('lead-phone').value.trim();
      const pickup = document.getElementById('lead-pickup').value.trim();
      const destination = document.getElementById('lead-destination').value.trim();

      if (!name || !phone) {
        if (!name) markError('lead-name');
        if (!phone) markError('lead-phone');
        return;
      }

      // Send to WhatsApp as a lead (since no backend)
      const msg = `🔔 New Booking Inquiry!\n\n` +
                  `👤 Name: ${name}\n` +
                  `📞 Phone: ${phone}\n` +
                  `📍 From: ${pickup || 'Not specified'}\n` +
                  `📍 To: ${destination || 'Not specified'}\n\n` +
                  `Please call me back to discuss. Thank you!`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

      // Show success
      const btn = document.getElementById('lead-submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Sent to WhatsApp!';
      btn.style.background = 'var(--color-success)';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        leadForm.reset();
      }, 3000);
    });
  }

  // ══════════════════════════════════════
  // FORM VALIDATION HELPERS
  // ══════════════════════════════════════
  function markError(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add('form-input--error');
      input.parentElement.classList.add('shake');

      // Remove after animation
      setTimeout(() => {
        input.parentElement.classList.remove('shake');
      }, 500);

      // Remove error on input
      input.addEventListener('input', function handler() {
        input.classList.remove('form-input--error');
        input.removeEventListener('input', handler);
      });
    }
  }

  function clearErrors() {
    document.querySelectorAll('.form-input--error').forEach(el => {
      el.classList.remove('form-input--error');
    });
  }

  // ══════════════════════════════════════
  // CONTACT WHATSAPP BUTTONS
  // ══════════════════════════════════════
  const contactWhatsappBtn = document.getElementById('contact-whatsapp-btn');
  if (contactWhatsappBtn) {
    contactWhatsappBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const msg = `Hi RUDRA TRAVELS! 🚗\nI'm interested in booking an outstation cab. Please share details.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  const footerWhatsappBtn = document.getElementById('footer-whatsapp-btn');
  if (footerWhatsappBtn) {
    footerWhatsappBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const msg = `Hi RUDRA TRAVELS! 🚗\nI want to know more about your outstation cab services.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ══════════════════════════════════════
  // GLOBAL WHATSAPP REDIRECT FOR "BOOK NOW" BUTTONS
  // ══════════════════════════════════════
  // This intercepts all buttons pointing to "#booking" and sends them directly to WhatsApp.
  document.querySelectorAll('a[href="#booking"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      let msg = `Hi RUDRA TRAVELS! 🚗\nI want to book an outstation cab. Please share details.`;
      
      // If clicked from a fleet card, include the vehicle name
      const card = this.closest('.card');
      if (card) {
        const vehicleTitle = card.querySelector('.card__title').innerText;
        msg = `Hi RUDRA TRAVELS! 🚗\nI want to book the ${vehicleTitle} for an outstation trip.`;
      }
      
      // If clicked from footer routes, include the route
      if (this.classList.contains('footer__link')) {
        const route = this.innerText;
        msg = `Hi RUDRA TRAVELS! 🚗\nI want to book a cab for the ${route} route.`;
      }
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

})();
