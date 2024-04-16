const body = document.querySelector("body");
const slider = document.querySelector("#slider");
const container = slider.querySelector(".slides");
const btnPrev = slider.querySelector(".slider-prev");
const btnNext = slider.querySelector(".slider-next");
const slides = slider.querySelectorAll(".slide");
const dots = slider.querySelector(".slider-dots");
const threshold = 200;
const slidesLength = slides.length;
let index = 0;
let isDrag = true;

// Clone first slide and last slide
const cloneFirst = slides[0].cloneNode(true);
const cloneLast = slides[slidesLength - 1].cloneNode(true);
container.appendChild(cloneFirst);
container.insertBefore(cloneLast, slides[0]);

let posInitial,
  posFinal,
  posX1 = 0,
  posY = 0,
  posX2 = 0;

function next() {
  loadSlide(++index);
}

function previous() {
  loadSlide(--index);
}

function dragStart(e) {
  posInitial = container.offsetLeft;
  counter = 0;

  if (e.type === "touchstart") {
    dragging = false;
    posX1 = e.touches[0].clientX;
    posY = e.touches[0].clientY;
  } else {
    e.preventDefault();
    dragging = true;
    posX1 = e.clientX;
    posY = e.clientY;
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", dragAction);
  }
}

let counter = 0;
let dragging = false;

function dragAction(e) {
  counter++;
  if (counter <= 4) return;

  const { clientX, clientY } = e.type === "touchmove" ? e.touches[0] : e;
  if (!dragging && Math.abs(clientY - posY) > Math.abs(clientX - posX1)) {
    return;
  }
  container.classList.add("dragging");
  dragging = true;
  posX2 = posX1 - clientX;
  posX1 = clientX;
  container.style.left = `${container.offsetLeft - posX2}px`;
}

function dragEnd(e) {
  e.preventDefault();
  counter = 0;
  posFinal = container.offsetLeft;
  if (posFinal - posInitial < -threshold) {
    loadSlide(++index, "drag");
  } else if (posFinal - posInitial > threshold) {
    loadSlide(--index, "drag");
  } else {
    container.style.left = `${posInitial}px`;
  }
  container.classList.remove("dragging");
  document.removeEventListener("mouseup", dragEnd);
  document.removeEventListener("mousemove", dragAction);
}

body.style.backgroundImage = `url(./img/slide-1.jpg)`;
function loadSlide(newIndex, action) {
  container.classList.add("shifting");
  if (!isDrag) return;

  if (!action) posInitial = container.offsetLeft;

  index = newIndex;
  let i = index;

  if (i >= 4) i = 1;
  if (i < 0) i = 3;

  container.style.left = `${(index + 1) * -100}%`;
  body.style.backgroundImage = `url(./img/slide-${i + 1}.jpg)`;
  isDrag = false;
}

function checkIndex() {
  container.classList.remove("shifting");
  index = (index + slidesLength) % slidesLength;
  container.style.left = `${(index + 1) * -100}%`;
  isDrag = true;
  checkDots();
}

function dotActiveSlide(index) {
  if (index < 0 || index >= slidesLength) {
    console.error("Invalid index.");
    return;
  }
  loadSlide(index);
}

function checkDots() {
  if (!dots) return;
  slider.querySelectorAll("span").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

if (dots) {
  for (let i = 0; i < slidesLength; i++) {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => {
      dotActiveSlide(i);
      checkDots();
    });
    dots.appendChild(dot);
  }
  checkDots();
}

// Event listener
container.addEventListener("mousedown", dragStart);
container.addEventListener("touchstart", dragStart, { passive: true });
container.addEventListener("touchend", dragEnd);
container.addEventListener("touchmove", dragAction);
btnPrev.addEventListener("click", previous);
btnNext.addEventListener("click", next);
container.addEventListener("transitionend", checkIndex);
