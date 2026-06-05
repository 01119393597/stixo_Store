
const text3 = "✨Single Sticker✨";
const typingElement3 = document.getElementById("typingsingle");
let index3 = 0;
let speed3 = 90; // كل ما الرقم يقل الكتابة تبقى أسرع

function typeEffect() {
  if (index3 < text3.length) {
    typingElement3.innerHTML += text3.charAt(index3);
    index3++;
    setTimeout(typeEffect, speed3);
  }
}
let uper = document.getElementById("up");
window.onscroll = function () {
  if (window.scrollY >= 600) {
    uper.style.display = "block";
  } else {
    uper.style.display = "none";
  }
};
uper.onclick = function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
};

window.onload = typeEffect;
function increase(btn) {
  let number = btn.parentElement.querySelector(".qty-number");
  number.innerText = parseInt(number.innerText) + 1;
}

function decrease(btn) {
  let number = btn.parentElement.querySelector(".qty-number");
  let current = parseInt(number.innerText);
  if (current > 1) {
    number.innerText = current - 1;
  }
}

function addToCart(btn, name, price) {
  let quantity = btn.parentElement.querySelector(".qty-number").innerText;
  alert("تم إضافة " + quantity + " من " + name + " إلى السلة 🛒");
}

let menuBtn = document.querySelector(".menu-btn");
let dropdownMenu = document.querySelector(".dropdoen-menu");
let droplinks = document.querySelectorAll(".dropdoen-menu a");

menuBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});
droplinks.forEach((link) => {
  link.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
  });
});