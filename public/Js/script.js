const slides = document.querySelectorAll(".page-section .home-image");

const nextImageDelay = 3000;
let currentCounter = 0;

slides[currentCounter].style.opacity = 1;

setInterval(nextImage, nextImageDelay);

function nextImage() {
    slides[currentCounter].style.zIndex = -2;
    const tempCounter = currentCounter;
  setTimeout(() => {
    slides[tempCounter].style.opacity = 1;
  }, 1000);

  currentCounter = (currentCounter + 1) % slides.length;
  slides[currentCounter].style.opacity = 0;
  slides[currentCounter].style.opacity = -1;
}
