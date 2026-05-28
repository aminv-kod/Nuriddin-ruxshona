// JavaScript Animation Engine for Shaxriyor & Maryam Invitation

document.addEventListener('DOMContentLoaded', () => {
  // Initialize IntersectionObserver for Scroll-Reveal
  initScrollReveal();

  // Initialize Parallax Scroll Effects
  initParallax();

  // Initialize Text Draw (Letter by Letter fading)
  initTextDraw();

  // Initialize Hover Ripple effects on interactive buttons
  initButtonRipples();

  // Initialize Persistent Background Particles & Spark Mouse Trail
  initBackgroundParticles();

  // Initialize 3D Card Tilt perspective physics
  initCard3DTilt();

  // Initialize Footer Dropdown Social Menu
  initFooterMenu();
});

/**
 * Scroll Reveal Engine
 * Uses IntersectionObserver to trigger animations when elements come into view
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const goldLines = document.querySelectorAll('.gold-line');

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust trigger offset slightly above the fold
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Custom actions for specific items
        if (entry.target.classList.contains('gold-line')) {
          entry.target.classList.add('visible');
        }
        
        // Stop observing once animated in
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
  goldLines.forEach(line => revealObserver.observe(line));
}

/**
 * Subtle Parallax Zoom Effect on main hero banner
 */
function initParallax() {
  const parallaxBanner = document.querySelector('.hero-banner');
  const parallaxBg = document.querySelector('.hero-bg');

  if (!parallaxBanner || !parallaxBg) return;

  window.addEventListener('scroll', () => {
    const scrollOffset = window.pageYOffset;
    const bannerHeight = parallaxBanner.offsetHeight;

    if (scrollOffset <= bannerHeight) {
      // Scale and shift the background image slightly based on scroll depth
      const translateVal = scrollOffset * 0.15;
      const scaleVal = 1 + (scrollOffset * 0.0003);
      parallaxBg.style.transform = `translate3d(0, ${translateVal}px, 0) scale(${scaleVal})`;
      
      // Fade out the hero content text as we scroll down
      const heroContent = parallaxBanner.querySelector('.hero-content');
      if (heroContent) {
        const opacityVal = 1 - (scrollOffset / (bannerHeight * 0.7));
        heroContent.style.opacity = Math.max(0, opacityVal);
        heroContent.style.transform = `translate3d(0, ${scrollOffset * 0.3}px, 0)`;
      }
    }
  });
}

/**
 * Letter-by-letter typing / fade-in effect for main romantic quotes
 */
function initTextDraw() {
  const animatedTexts = document.querySelectorAll('.draw-text');
  
  animatedTexts.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    
    // Wrap each character in a span with a staggered animation delay
    const charArray = text.split('');
    charArray.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      span.style.transform = 'translateY(10px)';
      span.style.transitionDelay = `${index * 0.03}s`;
      
      // Preserve spaces correctly
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      }
      
      el.appendChild(span);
    });
    
    // Trigger typing effect when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = el.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
  });
}

/**
 * Creates organic-looking golden ripples on premium button clicks and hovers
 */
function initButtonRipples() {
  const premiumButtons = document.querySelectorAll('.btn-premium');

  premiumButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
      const parentOffset = this.getBoundingClientRect(),
            relX = e.clientX - parentOffset.left,
            relY = e.clientY - parentOffset.top;
      
      const glow = this.querySelector('.btn-glow') || document.createElement('span');
      glow.className = 'btn-glow';
      glow.style.top = relY + 'px';
      glow.style.left = relX + 'px';
      
      if (!this.querySelector('.btn-glow')) {
        this.appendChild(glow);
      }
    });

    btn.addEventListener('mouseleave', function(e) {
      const glow = this.querySelector('.btn-glow');
      if (glow) {
        glow.remove();
      }
    });
  });
}

/**
 * Persistent Background Gold Particles & Interactive Mouse Spark Trail
 */
function initBackgroundParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Track resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle list
  const particles = [];
  const maxParticles = 80;

  // Mouse interaction metrics
  const mouse = { x: null, y: null, radius: 100 };
  const sparkles = []; // Spark mouse trail list

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Spawn mouse sparkles dynamically on movement (increased size & density)
    if (Math.random() < 0.85) { 
      sparkles.push(new Sparkle(mouse.x, mouse.y));
    }
    if (Math.random() < 0.4) { 
      sparkles.push(new Sparkle(mouse.x, mouse.y));
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch screen support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      if (Math.random() < 0.8) {
        sparkles.push(new Sparkle(mouse.x, mouse.y));
      }
      if (Math.random() < 0.35) {
        sparkles.push(new Sparkle(mouse.x, mouse.y));
      }
    }
  });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class representing floating gold dust
  class Particle {
    constructor() {
      this.reset();
      // Distribute initial particles vertically across screen
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.5 + 0.5; // Fine sizes
      this.speedY = -(Math.random() * 0.6 + 0.2); // Slow upward float
      this.speedX = Math.random() * 0.4 - 0.2; // Gentle horizontal drift
      this.alpha = Math.random() * 0.4 + 0.2; // Opacity
      this.fadeSpeed = Math.random() * 0.001 + 0.0005;
      this.glowBlur = Math.random() * 8 + 4;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Repel from mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Gently push away
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      this.alpha -= this.fadeSpeed;

      // Reset when off-screen or faded
      if (this.y < -20 || this.x < -20 || this.x > width + 20 || this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.glowBlur;
      ctx.shadowColor = '#C5A880'; // Soft antique gold glow
      ctx.fillStyle = '#A38A67'; // Soft bronze-gold dust
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Sparkle Class representing interactive cursor trail sparks
  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 6.5 + 3.0; // Larger star sparkles (3.0px to 9.5px)
      this.speedX = Math.random() * 3 - 1.5; // Wider horizontal dispersion
      this.speedY = Math.random() * 3 - 1.5; // Wider vertical dispersion
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012; // Slower fade for a more majestic trail
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = Math.random() * 0.12 - 0.06; // Elegant spinning speed
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.y += 0.04; // Gentle gravity pull
      this.alpha -= this.decay;
      this.angle += this.spinSpeed;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = Math.random() * 15 + 8; // Larger glow radius
      ctx.shadowColor = '#C5A880'; // Soft antique gold glow
      ctx.fillStyle = '#B0926A'; // Antique gold star body
      
      // Draw a cute star-like spark (4-pointed polygon)
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -this.size);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, -this.size * 0.25);
        ctx.rotate(Math.PI / 4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize background particle array
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw background dust
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Update & draw interactive sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].update();
      if (sparkles[i].alpha <= 0) {
        sparkles.splice(i, 1);
      } else {
        sparkles[i].draw();
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
}

/**
 * 3D Hover Tilt Physics
 * Creates premium 3D perspective tilt on poetry boxes, timers, location, and RSVP cards
 */
function initCard3DTilt() {
  const tiltCards = document.querySelectorAll('.poetry-box, .location-card, .rsvp-card-container, .timer-card, .premium-photo-frame');

  // Skip on touch-only mobile devices to preserve responsive scroll fidelity
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  tiltCards.forEach(card => {
    if (card.parentElement) {
      card.parentElement.style.perspective = '1000px';
    }
    
    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const rotateX = ((y / height) - 0.5) * -12; // max tilt 12deg
      const rotateY = ((x / width) - 0.5) * 12;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      card.style.boxShadow = '0 25px 50px rgba(212, 175, 55, 0.2), 0 10px 20px rgba(0, 0, 0, 0.4)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.boxShadow = '';
    });
  });
}

/**
 * Footer Dropdown Social Menu Controller
 * Handles toggling the phone numbers card with seamless focus and blur events
 */
function initFooterMenu() {
  const phoneBtn = document.getElementById('phone-menu-btn');
  const phoneDropdown = document.getElementById('phone-dropdown');
  
  if (phoneBtn && phoneDropdown) {
    phoneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      phoneDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking anywhere else
    document.addEventListener('click', () => {
      phoneDropdown.classList.remove('active');
    });
  }
}

