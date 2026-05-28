// RSVP Form Interactivity Engine for Shaxriyor & Maryam Invitation

document.addEventListener('DOMContentLoaded', () => {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');
  const rsvpSuccess = document.getElementById('rsvp-success');

  // Radio button cards interaction (styled labels act as cards)
  const attendanceOptions = document.querySelectorAll('.rsvp-radio-card input[type="radio"]');
  attendanceOptions.forEach(radio => {
    radio.addEventListener('change', function() {
      // Remove active class from all card wrappers
      document.querySelectorAll('.rsvp-radio-card').forEach(card => {
        card.classList.remove('selected');
      });
      // Add active class to the parent card wrapper of the checked radio
      if (this.checked) {
        this.closest('.rsvp-radio-card').classList.add('selected');
      }
    });
  });

  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent standard page reload

    const nameInput = document.getElementById('guest-name');
    const attendanceVal = document.querySelector('input[name="attendance"]:checked');

    // 1. Basic validation
    if (!nameInput || nameInput.value.trim() === '') {
      nameInput.classList.add('error');
      nameInput.focus();
      // Shake animation
      nameInput.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        nameInput.style.animation = '';
      }, 500);
      return;
    } else {
      nameInput.classList.remove('error');
    }

    if (!attendanceVal) {
      const optionsContainer = document.querySelector('.rsvp-options');
      if (optionsContainer) {
        optionsContainer.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          optionsContainer.style.animation = '';
        }, 500);
      }
      return;
    }

    // 2. Play elegant loading transition
    rsvpSubmitBtn.disabled = true;
    const btnText = rsvpSubmitBtn.querySelector('.btn-text');
    const btnLoader = rsvpSubmitBtn.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
      btnText.style.opacity = '0';
      btnLoader.style.display = 'block';
      btnLoader.style.opacity = '1';
    }

    // 3. Send response to Telegram Bot & backup to LocalStorage
    const guestResponse = {
      name: nameInput.value.trim(),
      attending: attendanceVal.value,
      timestamp: new Date().toISOString()
    };
    
    // Backup locally in localStorage immediately
    try {
      let allResponses = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      allResponses.push(guestResponse);
      localStorage.setItem('wedding_rsvps', JSON.stringify(allResponses));
    } catch (e) {
      console.warn("LocalStorage backup failed:", e);
    }

    // Telegram Bot Configuration
    const telegramToken = '8907297992:AAFJzz-Dbxn8ejiG_qzAEBNkXKQhKD-8ksE';
    const chatIds = ['1636188712', '5574632287'];
    
    const isUzbek = document.documentElement.lang === 'uz';
    const langLabel = isUzbek ? '🇺🇿 Узбекский (uz.html)' : '🇷🇺 Русский (ru.html)';
    const attendanceText = attendanceVal.value === 'yes' 
      ? '✅ <b>Придет / Придут</b>' 
      : '❌ <b>Не сможет / Не смогут</b>';

    const messageText = `🔔 <b>Новый ответ RSVP!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Имя и Фамилия:</b> ${nameInput.value.trim()}
❓ <b>Присутствие:</b> ${attendanceText}
🌐 <b>Язык сайта:</b> ${langLabel}
📅 <b>Время ответа:</b> ${new Date().toLocaleString('ru-RU')}
━━━━━━━━━━━━━━━━━━`;

    // Define success transition helper
    function showSuccessUI() {
      if (rsvpForm && rsvpSuccess) {
        rsvpForm.style.opacity = '0';
        rsvpForm.style.transform = 'translateY(-20px)';
        rsvpForm.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
          rsvpForm.style.display = 'none';
          rsvpSuccess.style.display = 'block';
          
          setTimeout(() => {
            rsvpSuccess.style.opacity = '1';
            rsvpSuccess.style.transform = 'translateY(0)';
            
            const checkPath = rsvpSuccess.querySelector('.checkmark-path');
            if (checkPath) {
              checkPath.style.strokeDashoffset = '0';
            }
          }, 50);
        }, 600);
      }
    }

    // Measure request timing to avoid flashing loaders
    const startTime = Date.now();

    // Map each Chat ID to a fetch Promise
    const requests = chatIds.map(id => {
      return fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: id,
          text: messageText,
          parse_mode: 'HTML'
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Telegram server returned non-ok status for chat ${id}`);
        }
        return response.json();
      });
    });

    // Execute all transmissions in parallel
    Promise.all(requests)
    .then(results => {
      console.log("RSVP sent to all Telegram recipients successfully:", results);
    })
    .catch(error => {
      console.error("One or more Telegram transmissions failed, backed up in LocalStorage:", error);
    })
    .finally(() => {
      // Enforce a minimum loader duration of 800ms for visual premium feedback
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);
      
      setTimeout(showSuccessUI, remainingTime);
    });
  });
});
