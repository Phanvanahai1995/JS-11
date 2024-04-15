const carousel = document.querySelector(".carousel");
const btnEls = document.querySelectorAll(".container i");
const dotContainer = document.querySelector(".dots");
const firstSlideWidth = document.querySelector(".slide").offsetWidth;
const carouselChildrens = [...carousel.children];
let slides = document.querySelectorAll(".slide");
let index = 0;

// Functions create dot
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

// Active dot[0]
const dots = document.querySelectorAll(".dots__dot");
dots[0].classList.add("dots__dot--active");

// Clone Slide first and last
const firstSlide = slides[0].cloneNode(true);
const lastSlide = slides[slides.length - 1].cloneNode(true);

firstSlide.id = "first-clone";
lastSlide.id = "last-clone";

carousel.append(firstSlide);
carousel.prepend(lastSlide);

let isDrag = false,
  starX,
  startScrollLeft,
  activeDot = false,
  x;

const startDrag = (e) => {
  if (e.which === 1) {
    isDrag = true;
    activeDot = false;
    carousel.classList.add("dragging");
    starX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
    dots[index].classList.add("dots__dot--active");
  }
};

const dragging = (e) => {
  e.stopPropagation();
  if (!isDrag) return;
  activeDot = true;

  carousel.scrollLeft = startScrollLeft - (e.pageX - starX);

  x = e.pageX;
  dots[index].classList.add("dots__dot--active");
};

const stopDrag = () => {
  isDrag = false;
  carousel.classList.remove("dragging");

  if (activeDot && x < starX) {
    index++;
    if (index > dots.length - 1) index = 0;
    removeActiveDot();
    dots[index].classList.add("dots__dot--active");
  } else if (activeDot && x > starX) {
    index--;
    if (index < 0) index = dots.length - 1;
    removeActiveDot();
    dots[index].classList.add("dots__dot--active");
  }
};

const infinityScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  } else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
};

// Function remove active dot
const removeActiveDot = function () {
  dots.forEach((dot) => {
    dot.classList.remove("dots__dot--active");
  });
};

// Carousel Event
carousel.addEventListener("mousedown", startDrag);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", stopDrag);
carousel.addEventListener("scroll", infinityScroll);

// Btn loop event
btnEls.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // e.stopPropagation();
    carousel.scrollLeft += btn.classList.contains("fa-chevron-left")
      ? -firstSlideWidth
      : firstSlideWidth;

    removeActiveDot();
    if (btn.classList.contains("fa-chevron-right")) {
      index++;
      if (index > dots.length - 1) index = 0;
      dots[index].classList.add("dots__dot--active");
    } else {
      index--;
      if (index < 0) index = dots.length - 1;
      dots[index].classList.add("dots__dot--active");
    }
  });
});

btnEls.forEach((btn) => {
  btn.addEventListener("mouseup", (e) => e.stopPropagation());
});

// Dots Event

dots.forEach((dot, i) => {
  dot.addEventListener("click", function () {
    removeActiveDot();
    carousel.scrollLeft = carousel.offsetWidth * (i + 1);
    index = i;
    this.classList.add("dots__dot--active");
  });
});
