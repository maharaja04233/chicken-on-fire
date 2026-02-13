// ===============================
// LOAD CART FROM LOCALSTORAGE
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// CATEGORY FILTER
// ===============================
const buttons = document.querySelectorAll(".menu-categories button");
const cards = document.querySelectorAll(".menu-card");

buttons.forEach(button => {

  button.addEventListener("click", () => {

    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;

    cards.forEach(card => {

      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }

    });

  });

});


// ===============================
// SEARCH FUNCTION
// ===============================
const searchInput = document.getElementById("searchInput");

if(searchInput){

  searchInput.addEventListener("keyup", function(){

    let value = this.value.toLowerCase();

    document.querySelectorAll(".menu-card").forEach(card=>{

      let name = card.querySelector("h3").innerText.toLowerCase();

      if(name.includes(value)){
        card.style.display = "block";
      }else{
        card.style.display = "none";
      }

    });

  });

}


// ===============================
// ADD TO CART
// ===============================
document.querySelectorAll(".add-cart").forEach(button=>{

  button.addEventListener("click", ()=>{

    let name = button.dataset.name;
    let price = parseInt(button.dataset.price);

    let existingItem = cart.find(item => item.name === name);

    if(existingItem){

      existingItem.qty += 1;

    }else{

      cart.push({
        name: name,
        price: price,
        image:image,
        qty: 1,

      });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast(name + " added to cart 🛒");

    button.innerHTML = "✔ Added";
    button.style.background = "green";

    setTimeout(()=>{
      button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add';
      button.style.background = "";
    },1000);

  });

});


// ===============================
// UPDATE CART COUNT
// ===============================
function updateCartCount(){

  let totalQty = 0;

  cart.forEach(item=>{
    totalQty += item.qty;
  });

  let desktopCount = document.getElementById("cart-count");
  let mobileCount = document.getElementById("mobile-cart-count");

  if(desktopCount) desktopCount.innerText = totalQty;
  if(mobileCount) mobileCount.innerText = totalQty;

}


// ===============================
// TOAST MESSAGE
// ===============================
function showToast(message){

  let toast = document.createElement("div");

  toast.innerText = message;

  toast.style.position = "fixed";
  toast.style.bottom = "80px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#ff5722";
  toast.style.color = "#fff";
  toast.style.padding = "12px 25px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "9999";
  toast.style.fontWeight = "bold";

  document.body.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  },2000);

}


// ===============================
// LOAD CART COUNT ON PAGE LOAD
// ===============================
updateCartCount();


/* CATEGORY FILTER */
const categories = document.querySelectorAll(".category-card");
const cards = document.querySelectorAll(".menu-card");

categories.forEach(category => {

  category.addEventListener("click", () => {

    categories.forEach(c => c.classList.remove("active"));
    category.classList.add("active");

    const value = category.dataset.category;

    cards.forEach(card => {

      if(value === "all" || card.dataset.category === value){
        card.style.display="block";
      }
      else{
        card.style.display="none";
      }

    });

  });

});


/* TOUCH MOVE + DRAG SCROLL */
const slider = document.getElementById("categoryScroll");

let isDown = false;
let startX;
let scrollLeft;


// mouse drag
slider.addEventListener("mousedown", (e)=>{
  isDown = true;
  slider.style.cursor="grabbing";
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", ()=>{
  isDown = false;
  slider.style.cursor="grab";
});

slider.addEventListener("mouseup", ()=>{
  isDown = false;
  slider.style.cursor="grab";
});

slider.addEventListener("mousemove", (e)=>{
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});


// touch move mobile
slider.addEventListener("touchstart", (e)=>{
  startX = e.touches[0].pageX;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("touchmove", (e)=>{
  const x = e.touches[0].pageX;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});
