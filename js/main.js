document.addEventListener('DOMContentLoaded', function () {
  // Carousel
  const carousel = document.querySelector('.carousel');
  const list = document.querySelectorAll('.carousel .list .item');
  const dots = document.querySelectorAll('.dots li');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  const TOTAL_ITEMS = list.length;
  let active = 0;
  let zIndex = 2;

  // Progress Bar and Cards
  const cardsContainer = document.querySelector('.cards');
  const cards = document.querySelectorAll('.card');
  const aboutSection = document.querySelector('#about');
  const progressBar = document.getElementById('progress-bar');

  // Initialize Carousel
  const initializeCarousel = () => {
    // Set initial active item
    list[active].classList.add('active');
    dots[active].classList.add('active');

    // Event listeners for next/prev buttons
    nextBtn.onclick = () => {
      const newValue = active + 1 > TOTAL_ITEMS - 1 ? 0 : active + 1;
      setItemActive(newValue, 'next');
    };

    prevBtn.onclick = () => {
      const newValue = active - 1 < 0 ? TOTAL_ITEMS - 1 : active - 1;
      setItemActive(newValue, 'prev');
    };

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setItemActive(index);
      });
    });
  };

  // Set Active Item in Carousel
  const setItemActive = (newValue, type) => {
    if (newValue === active) return;

    // Remove active class from old item and dot
    list[active].classList.remove('active');
    dots[active].classList.remove('active');

    // Update active index
    active = newValue;

    // Add active class to new item and dot
    list[active].classList.add('active');
    dots[active].classList.add('active');

    // Update zIndex
    zIndex = zIndex >= 150 ? 2 : zIndex + 1;
    list[active].style.zIndex = zIndex;

    // Apply transform effect
    carousel.style.setProperty(
      '--transform',
      type === 'next' ? '300px' : '-300px'
    );
    carousel.classList.add('effect');

    // Remove effect after animation
    setTimeout(() => {
      carousel.classList.remove('effect');
    }, 1500);

    // Reset auto-run timer
    resetAutoRun();
  };

  // Auto-run Carousel
  let autoRunTimer;
  const resetAutoRun = () => {
    clearTimeout(autoRunTimer);
    autoRunTimer = setTimeout(() => {
      nextBtn.click();
    }, 5000);
  };

  const initializeCards = () => {
    cardsContainer.style.setProperty('--cards-count', cards.length);
    cardsContainer.style.setProperty(
      '--card-height',
      `${cards[0].clientHeight}px`
    );

    // Add padding to cards
    Array.from(cards).forEach((card, index) => {
      const offsetTop = 20 + index * 20;
      card.style.paddingTop = `${offsetTop}px`;

      if (index === cards.length - 1) return;

      const nextCard = cards[index + 1];
      const cardInner = card.querySelector('.card-inner');
      const toScale = 1 - (cards.length - 1 - index) * 0.1;

      // Observe next card for intersection
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting, intersectionRatio }) => {
            if (isIntersecting) {
              const percentageY = intersectionRatio;

              cardInner.style.transform = `scale(${valueAtPercentage({
                from: 1,
                to: toScale,
                percentage: percentageY,
              })})`;
              cardInner.style.filter = `brightness(${valueAtPercentage({
                from: 1,
                to: 0.6,
                percentage: percentageY,
              })})`;

              changeBackground(index);
              updateProgressBar(index);
            }
          });
        },
        { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
      );

      observer.observe(nextCard);
    });
  };

  // Helper Functions
  const valueAtPercentage = ({ from, to, percentage }) => {
    return from + (to - from) * percentage;
  };

  const changeBackground = (index) => {
    aboutSection.className = '';
    aboutSection.classList.add(`about-bg-${index + 1}`);
  };

  const updateProgressBar = (index) => {
    const progressPercentage = ((index + 1) / cards.length) * 100;
    progressBar.style.height = `${progressPercentage}%`;
  };

  initializeCarousel();
  window.addEventListener('resize', () => {
    initializeCards();
  });
  resetAutoRun();
});
