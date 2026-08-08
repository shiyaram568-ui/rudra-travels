// Navboost Engagement Trap - Interactive Fare Calculator
document.addEventListener('DOMContentLoaded', () => {
  const distanceInput = document.getElementById('calc-distance');
  const typeInput = document.getElementById('calc-type');
  const nightChargeInput = document.getElementById('calc-night');
  const sightseeingInput = document.getElementById('calc-sightseeing');
  const outputElem = document.getElementById('calc-total');

  const BASE_RATE = { sedan: 12, suv: 16 };
  const MIN_DIST = 250;
  const DRIVER_ALLOWANCE = { sedan: 300, suv: 400 };

  function calculateInteractiveFare() {
    let dist = parseInt(distanceInput.value) || MIN_DIST;
    
    // Update the display text
    const distDisplay = document.getElementById('calc-dist-display');
    if (distDisplay) distDisplay.textContent = dist;

    if (dist < MIN_DIST) dist = MIN_DIST; // Apply minimum distance rule

    const type = typeInput.value;
    const baseFare = dist * BASE_RATE[type];
    const driverCharge = DRIVER_ALLOWANCE[type];

    let total = baseFare + driverCharge;

    if (nightChargeInput.checked) {
      total += 250; // Night driving allowance
    }
    if (sightseeingInput.checked) {
      total += 500; // Local sightseeing charge
    }

    // Add 5% GST
    const finalTotal = Math.round(total * 1.05);

    // Animate the number counting up
    animateValue(outputElem, 0, finalTotal, 500);
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = '₹ ' + Math.floor(progress * (end - start) + start).toLocaleString('en-IN');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Attach event listeners
  [distanceInput, typeInput, nightChargeInput, sightseeingInput].forEach(el => {
    if (el) el.addEventListener('input', calculateInteractiveFare);
  });

  // Initial calculation
  if(distanceInput) {
    calculateInteractiveFare();
  }
});
