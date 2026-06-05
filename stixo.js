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

// /*offer*/
// let index = 0;
// const slider = document.getElementById("slider");

// function showSlide(){
//     slider.style.transform = `translateX(${index * 100}%)`;
// }

// function next(){
//     if(index > -2){
//         index--;
//         showSlide();
//     }
// }

// function prev(){
//     if(index < 0){
//         index++;
//         showSlide();
//     }
// }
var swiper = new Swiper(".offersSwiper", {
  slidesPerView: 1, // عرض واحد بس
  spaceBetween: 40, // لا مسافة بين الشرائح
  loop: true, // لو عايز السلايدر يدور
  centeredSlides: false, // مهم جداً: ما يكونش مركزي
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
/*custom*/

const canvas = new fabric.Canvas("canvas");

// رفع وعرض أكثر من صورة على الكانفاس
const upload = document.getElementById("upload");
upload.addEventListener("change", function (e) {
  const files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (event) {
      fabric.Image.fromURL(event.target.result, function (img) {
        img.set({
          left: 50 + i * 30,
          top: 50 + i * 30,
        });
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(files[i]);
  }
});

// إضافة نصوص على الكانفاس
document.getElementById("addText").onclick = function () {
  const text = new fabric.IText("Your Text", {
    left: 100,
    top: 100,
    fill: "black",
    fontSize: 30,
  });
  canvas.add(text);
  canvas.renderAll();
};

// تحديث السعر حسب الكمية
const qty = document.getElementById("qty");
const price = document.getElementById("price");
qty.addEventListener("input", function () {
  price.innerText = qty.value * 35;
});

// تغيير شكل الكانفاس
const shape = document.getElementById("shape");
shape.addEventListener("change", function () {
  if (this.value === "circle") {
    canvas.clipPath = new fabric.Circle({ radius: 170, top: 0, left: 0 });
  } else if (this.value === "rounded") {
    canvas.clipPath = new fabric.Rect({ rx: 40, ry: 40, width: 350, height: 350 });
  } else {
    canvas.clipPath = null;
  }
  canvas.renderAll();
});

// إرسال كل صورة على حدة على واتساب
document.getElementById("sendWhatsapp").onclick = async function () {
  const phone = "201119393597";
  const imageUrls = [];

  const objects = canvas.getObjects("image"); // كل الصور على الكانفاس
  if (objects.length === 0) {
    alert("اضف صور أولاً");
    return;
  }

  try {
    // رفع كل صورة بشكل منفصل
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      // نحول كل صورة مستقلة إلى DataURL
      const tempCanvas = new fabric.StaticCanvas(null, { width: obj.width, height: obj.height });
      const clone = fabric.util.object.clone(obj);
      clone.left = 0;
      clone.top = 0;
      tempCanvas.add(clone);
      const dataURL = tempCanvas.toDataURL({ format: "png", quality: 0.9 });

      const formData = new FormData();
      formData.append("file", dataURL);
      formData.append("upload_preset", "client_uploads"); // ضع إعدادك هنا

      const response = await fetch("https://api.cloudinary.com/v1_1/dr5yxlcm7/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) imageUrls.push(data.secure_url);
    }

    // تجهيز الرسالة مع كل الروابط
    let messageText = "طلب جديد من الموقع 👇\n\nالكمية: " + qty.value + "\n\n";
    imageUrls.forEach((url, idx) => {
      messageText += `صورة ${idx + 1}:\n${url}\n\n`;
    });

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء رفع الصور");
  }
};
