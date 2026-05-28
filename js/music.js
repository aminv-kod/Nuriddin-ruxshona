/**
 * Premium Background Music Engine with Autoplay & Session State Persistence
 * Specifically designed for Shaxriyor & Maryam Multilingual Wedding Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Determine language for localized UI labels
  const isUzbek = document.documentElement.lang === 'uz';
  const labelText = isUzbek ? 'Musiqa' : 'Музыка';

  // Create Audio Element
  const audio = document.createElement('audio');
  audio.id = 'bg-audio';
  audio.preload = 'auto';
  // Enable native looping since we play from the very beginning (0s)
  audio.loop = true;

  // High quality local copy of "Maher Zain - For The Rest Of My Life"
  const localSrc = 'assets/For-the-rest-of-my-life.mp3';

  // Set local source
  audio.src = localSrc;

  // Graceful error handler in case of load issues
  audio.addEventListener('error', (e) => {
    console.error('Failed to load local background music. Please verify the file is in place.', e);
  });

  document.body.appendChild(audio);

  // Create Music Widget DOM Structure
  const widget = document.createElement('div');
  widget.className = 'music-widget';
  widget.id = 'music-widget';
  widget.innerHTML = `
    <div class="music-equalizer" id="music-equalizer">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <span class="music-text">${labelText}</span>
    <button class="music-btn" id="music-btn" aria-label="Toggle Background Music">
      <!-- Pause Icon (Default Visible since we try to play) -->
      <svg id="music-icon-pause" viewBox="0 0 24 24" style="display: block;">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
      <!-- Play Icon -->
      <svg id="music-icon-play" viewBox="0 0 24 24" style="display: none;">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  `;
  document.body.appendChild(widget);

  // DOM Elements References
  const playIcon = document.getElementById('music-icon-play');
  const pauseIcon = document.getElementById('music-icon-pause');
  
  // Track state
  let isMutedByGuest = localStorage.getItem('musicPaused') === 'true';

  // Sync UI state with starting preference
  if (isMutedByGuest) {
    widget.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  } else {
    widget.classList.add('playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }

  // Play audio function
  function playAudio() {
    if (isMutedByGuest) return;

    audio.play().then(() => {
      widget.classList.add('playing');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }).catch(error => {
      console.log('Autoplay prevented. Audio will start on user interaction.', error);
    });
  }

  // Pause audio function
  function pauseAudio() {
    audio.pause();
    widget.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }

  // Autoplay Trigger Logic (compliant with modern autoplay restrictions)
  // Attempt autoplay immediately
  if (!isMutedByGuest) {
    playAudio();
  }

  // Setup interaction listeners to unlock audio context as soon as guest interacts with the screen
  const unlockEvents = ['click', 'scroll', 'touchstart', 'keydown'];
  
  function handleUnlock() {
    if (!isMutedByGuest && audio.paused) {
      playAudio();
    }
    // Remove listeners once unlocked
    unlockEvents.forEach(evt => {
      document.removeEventListener(evt, handleUnlock);
    });
  }

  // Register interaction listeners if not muted
  if (!isMutedByGuest) {
    unlockEvents.forEach(evt => {
      document.addEventListener(evt, handleUnlock, { passive: true });
    });
  }

  // Toggle button event handler
  widget.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (audio.paused) {
      isMutedByGuest = false;
      localStorage.setItem('musicPaused', 'false');
      playAudio();
    } else {
      isMutedByGuest = true;
      localStorage.setItem('musicPaused', 'true');
      pauseAudio();
    }
  });
});
