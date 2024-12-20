document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const navItems = document.querySelectorAll('.slider-nav-item');
  let currentSlide = 0;

  function updateNav(activeIndex) {
    const totalNavItems = navItems.length;

    const firstActiveIndex = (activeIndex + 1) % totalNavItems;
    const secondActiveIndex = (activeIndex + 2) % totalNavItems;

    navItems.forEach((item, index) => {
      if (index === firstActiveIndex || index === secondActiveIndex) {
        item.classList.add('active');
        item.classList.remove('hidden');
      } else {
        item.classList.remove('active');
        item.classList.add('hidden');
      }
    });
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');

    updateNav(currentSlide);
  }

  updateNav(currentSlide);
  slides[currentSlide].classList.add('active');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'));
      goToSlide(index);
    });
  });

  console.log(navItems);
});
