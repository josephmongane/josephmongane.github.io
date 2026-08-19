// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Image carousels
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
});

function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const dotsWrap = root.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  const isAuto = root.hasAttribute('data-autoplay');
  const autoInterval = parseInt(root.getAttribute('data-autoplay'), 10) || 3000;
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    // Autoplay cards use plain (non-interactive) dots so they can sit inside a link.
    const dot = document.createElement(isAuto ? 'span' : 'button');
    dot.className = 'carousel-dot';
    if (!isAuto) {
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
    }
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

  if (isAuto && slides.length > 1) {
    const start = () => { timer = setInterval(() => goTo(index + 1), autoInterval); };
    const stop = () => clearInterval(timer);
    start();
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  update();
}
