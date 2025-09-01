// API Docs Masterclass - Interactive JavaScript

// Initialize highlight.js when DOM is ready
document.addEventListener('DOMContentLoaded', (event) => {
  // Apply syntax highlighting
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
  
  // Add typing effect to hero text
  typeWriter();
  
  // Add smooth scrolling
  initSmoothScrolling();
  
  // Add copy-to-clipboard for code blocks
  addCopyButtons();
  
  // Add interactive particle effect
  createParticles();
  
  // Add active nav highlighting
  highlightActiveNav();
  
  // Add keyboard shortcuts
  initKeyboardShortcuts();
  
  // Add theme toggle (if needed)
  initThemeToggle();
  
  // Add loading animation removal
  removeLoadingScreen();
});

// Typing effect for hero text
function typeWriter() {
  const elements = document.querySelectorAll('.typewriter');
  elements.forEach((element) => {
    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    let index = 0;
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, 50);
      }
    }
    
    type();
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add copy buttons to code blocks
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach((block) => {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = '📋 Copy';
    button.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 3rem;
      background: rgba(0, 255, 65, 0.2);
      color: #00ff41;
      border: 1px solid #00ff41;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s ease;
      z-index: 10;
    `;
    
    button.addEventListener('click', async () => {
      const code = block.querySelector('code') || block;
      const text = code.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        button.innerHTML = '✅ Copied!';
        button.style.background = 'rgba(0, 255, 65, 0.4)';
        
        setTimeout(() => {
          button.innerHTML = '📋 Copy';
          button.style.background = 'rgba(0, 255, 65, 0.2)';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.innerHTML = '❌ Error';
      }
    });
    
    block.style.position = 'relative';
    block.appendChild(button);
  });
}

// Create floating particles effect
function createParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = ['#00ff41', '#00d9ff', '#bd00ff'][Math.floor(Math.random() * 3)];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = (100 - distance) / 1000;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Highlight active navigation
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href').includes(currentPage)) {
      link.style.color = '#00ff41';
      link.style.borderColor = '#00ff41';
      link.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.5)';
    }
  });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search (placeholder)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      alert('Search functionality coming soon!');
    }
    
    // Escape to close any modals
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

// Theme toggle (future feature)
function initThemeToggle() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
}

// Remove loading screen
function removeLoadingScreen() {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 300);
    }, 500);
  }
}

// Close all modals
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// API request simulator (for demos)
function simulateAPIRequest(endpoint) {
  const output = document.getElementById('api-output');
  if (!output) return;
  
  output.innerHTML = '<span class="loading"></span> Loading...';
  
  setTimeout(() => {
    const responses = {
      '/weather/current': {
        location: 'London',
        temperature: 15.5,
        conditions: 'Partly cloudy'
      },
      '/weather/forecast': {
        days: [
          { date: '2025-01-02', high: 16, low: 10 },
          { date: '2025-01-03', high: 14, low: 8 }
        ]
      }
    };
    
    output.innerHTML = `<pre><code class="language-json">${JSON.stringify(responses[endpoint] || {error: 'Not found'}, null, 2)}</code></pre>`;
    hljs.highlightElement(output.querySelector('code'));
  }, 1000);
}

// Matrix rain effect for fun
function matrixRain() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-2';
  canvas.style.opacity = '0.1';
  
  document.body.appendChild(canvas);
  
  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const matrixArray = matrix.split("");
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  for(let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
  
  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for(let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  setInterval(drawMatrix, 35);
}

// Initialize matrix effect on special pages
if (window.location.pathname.includes('concepts')) {
  matrixRain();
}

// Console Easter egg
console.log('%c🚀 API Docs Masterclass', 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%cWelcome to the dev console! 🎉', 'color: #00d9ff; font-size: 14px;');
console.log('%cBuilt with ❤️ and lots of ☕', 'color: #bd00ff; font-size: 12px;');

// Export functions for use in other scripts
window.APIDocs = {
  typeWriter,
  simulateAPIRequest,
  createParticles,
  matrixRain
};