// Countdown Timer Engine for Shaxriyor & Maryam Invitation
// Event Date: July 5, 2026, 18:00:00

document.addEventListener('DOMContentLoaded', () => {
  // Set the target date: July 5, 2026, 18:00:00
  const targetDate = new Date('2026-07-05T18:00:00+05:00').getTime();

  // Cache DOM elements
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');
  const timerContainer = document.getElementById('timer-container');
  const finishedMessage = document.getElementById('timer-finished');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  let lastVals = { days: -1, hours: -1, minutes: -1, seconds: -1 };

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // If countdown is finished
    if (distance < 0) {
      clearInterval(timerInterval);
      if (timerContainer) timerContainer.style.display = 'none';
      if (finishedMessage) {
        finishedMessage.style.display = 'block';
        finishedMessage.classList.add('active');
      }
      return;
    }

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update with animations only when numbers change
    updateCard(daysEl, days, 'days');
    updateCard(hoursEl, hours, 'hours');
    updateCard(minutesEl, minutes, 'minutes');
    updateCard(secondsEl, seconds, 'seconds');
  }

  function updateCard(element, newVal, key) {
    // Format to 2 digits (e.g. 05 instead of 5)
    const formattedVal = newVal < 10 ? '0' + newVal : newVal;
    
    // Only animate and update if value has changed
    if (lastVals[key] !== newVal) {
      lastVals[key] = newVal;

      // Select internal digit nodes
      const numberNode = element.querySelector('.timer-number');
      if (numberNode) {
        // Add a smooth flip/fade CSS transition class
        numberNode.classList.add('updating');
        
        setTimeout(() => {
          numberNode.textContent = formattedVal;
          numberNode.classList.remove('updating');
          numberNode.classList.add('updated');
          
          setTimeout(() => {
            numberNode.classList.remove('updated');
          }, 300);
        }, 150);
      } else {
        element.textContent = formattedVal;
      }
    }
  }

  // Run immediately, then every second
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
});
