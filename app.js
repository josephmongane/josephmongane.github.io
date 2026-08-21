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
  let perView = 1;        // slides visible at once
  let positions = slides.length;  // distinct scroll positions, stepping one slide at a time
  let timer = null;

  // How many slides are visible comes from CSS (--per-view) so it can vary by breakpoint.
  function readPerView() {
    const declared = parseInt(getComputedStyle(root).getPropertyValue('--per-view'), 10);
    return declared > 0 ? declared : 1;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < positions; i++) {
      // Autoplay cards use plain (non-interactive) dots so they can sit inside a link.
      const dot = document.createElement(isAuto ? 'span' : 'button');
      dot.className = 'carousel-dot';
      if (!isAuto) {
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
      }
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    track.style.transform = `translateX(-${index * (100 / perView)}%)`;
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + positions) % positions;
    update();
  }

  // Re-run whenever the visible count could have changed.
  function layout() {
    perView = readPerView();
    positions = Math.max(1, slides.length - perView + 1);
    if (index > positions - 1) index = positions - 1;
    if (!dotsWrap || dotsWrap.children.length !== positions) buildDots();
    update();
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

  layout();
  window.addEventListener('resize', layout);

  if (isAuto && positions > 1) {
    const start = () => { timer = setInterval(() => goTo(index + 1), autoInterval); };
    const stop = () => clearInterval(timer);
    start();
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }
}
