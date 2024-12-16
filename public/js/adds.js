document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('image-carousel');
    const track = carousel.querySelector('.carousel-track');
    const images = carousel.querySelectorAll('.carousel-image');
    const totalImages = images.length;
  
    let currentIndex = 0;
  
        const firstImageClone = images[0].cloneNode(true);
    track.appendChild(firstImageClone);
  
    function moveCarousel() {
      currentIndex++;
  
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
      track.style.transition = 'transform 0.5s ease-in-out';
  
            if (currentIndex === totalImages) {
        setTimeout(() => {
                    track.style.transition = 'none';
          currentIndex = 0;
          track.style.transform = `translateX(0%)`;
        }, 500);       }
    }
  
        setInterval(moveCarousel, 2000);
  });