document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.carousel-btn-prev');
    const nextButton = document.querySelector('.carousel-btn-next');
    
    const products = document.querySelectorAll('.carousel .product-card');
    const totalProducts = products.length;
    let currentIndex = 0;

    function updateCarouselPosition() {
      const offset = -currentIndex * 100;        carousel.style.transform = `translateX(${offset}%)`;
    }

        prevButton.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalProducts - 1;        }
      updateCarouselPosition();
    });

        nextButton.addEventListener('click', function() {
      if (currentIndex < totalProducts - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;        }
      updateCarouselPosition();
    });

        updateCarouselPosition();
  });