 
    // --------------------------------------------------------------
    //   SPLIT PAGES + HOME SWIPER + BOTTOM NAV + CART (FULL)
    // --------------------------------------------------------------

    // --- PRODUCT DATABASE ---
    const products = [
      { id:1, name:"Chicken Biryani", desc:"Hyderabadi biryani, raita", price:299, cat:"featured", icon:"🍛", stock:40 },
      { id:2, name:"Margherita Pizza", desc:"Wood-fired, mozzarella", price:249, cat:"featured", icon:"🍕", stock:35 },
      { id:3, name:"Grilled Burger", desc:"Angus patty, cheese", price:199, cat:"featured", icon:"🍔", stock:30 },
      { id:4, name:"Gulab Jamun", desc:"3 pcs, sweet syrup", price:89, cat:"featured", icon:"🍨", stock:50 },
      { id:5, name:"Masala Dosa", desc:"Crispy, chutney & sambar", price:129, cat:"food", icon:"🥞", stock:45 },
      { id:6, name:"Paneer Butter Masala", desc:"Creamy curry", price:229, cat:"food", icon:"🧀", stock:30 },
      { id:7, name:"Hakka Noodles", desc:"Stir-fried veg", price:159, cat:"food", icon:"🍜", stock:38 },
      { id:8, name:"Chicken 65", desc:"Spicy, Chennai style", price:189, cat:"food", icon:"🍗", stock:42 },
      { id:9, name:"Cold Coffee", desc:"Frappé, ice cream", price:119, cat:"beverage", icon:"☕", stock:25 },
      { id:10, name:"Mango Lassi", desc:"Sweet yogurt drink", price:89, cat:"beverage", icon:"🥛", stock:40 },
      { id:11, name:"Chocolate Brownie", desc:"Warm, walnut", price:139, cat:"beverage", icon:"🍫", stock:30 },
      { id:12, name:"Masala Chai", desc:"Ginger tea", price:29, cat:"beverage", icon:"🫖", stock:80 }
    ];

    const servicesArr = [
      { id:1, name:"Catering Service", desc:"Weddings & corporate", icon:"🥂" },
      { id:2, name:"Chef at Home", desc:"Private dinner", icon:"👨‍🍳" },
      { id:3, name:"Bulk Orders", desc:"Office lunches", icon:"📦" },
      { id:4, name:"Food Workshop", desc:"Learn cooking", icon:"📚" },
      { id:5, name:"Dietary Meals", desc:"Keto, vegan", icon:"🥗" },
      { id:6, name:"Restaurant Consulting", desc:"Menu optimization", icon:"📊" }
    ];

    // --- CART ---
    let cart = [];
    function loadCart() {
      const saved = localStorage.getItem('zomatoSwiperCart');
      if (saved) cart = JSON.parse(saved);
      updateCartUI();
    }
    function saveCart() {
      localStorage.setItem('zomatoSwiperCart', JSON.stringify(cart));
      updateCartUI();
    }

    function addToCart(pid) {
      const prod = products.find(p=>p.id===pid);
      if (!prod) return;
      if (prod.stock<=0) { showNotif('❌ Sold out!'); return; }
      const exist = cart.find(i=>i.id===pid);
      if (exist) exist.quantity++;
      else cart.push({...prod, quantity:1});
      prod.stock--;
      saveCart();
      showNotif(`✨ ${prod.name} added`);
      renderAllGrids(); 
      initSwiper(); // re-init swiper to update stock labels
    }

    function removeFromCart(pid) {
      const item = cart.find(i=>i.id===pid);
      if (!item) return;
      const prod = products.find(p=>p.id===pid);
      if (prod) prod.stock += item.quantity;
      cart = cart.filter(i=>i.id!==pid);
      saveCart();
      renderAllGrids();
      initSwiper();
    }

    function updateCartUI() {
      const count = cart.reduce((s,i)=>s+i.quantity,0);
      document.getElementById('cartCount').innerText = count;
      const cartDiv = document.getElementById('cartItems');
      const totalDiv = document.getElementById('cartTotal');
      if (!cartDiv) return;
      if (cart.length===0) {
        cartDiv.innerHTML = '<div style="text-align:center; padding:2rem;">🛒 Empty cart</div>';
        totalDiv.innerText = 'Total: ₹0';
      } else {
        let html='', total=0;
        cart.forEach(item => {
          total += item.price * item.quantity;
          html += `<div style="display:flex; align-items:center; gap:0.8rem; padding:0.8rem; background:#f9f9f9; border-radius:12px; margin-bottom:0.8rem;">
            <div style="font-size:2rem;">${item.icon}</div>
            <div style="flex:1;"><strong>${item.name}</strong><br>₹${item.price} x${item.quantity}</div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; font-size:1.5rem; color:#ff4444;">&times;</button>
          </div>`;
        });
        cartDiv.innerHTML = html;
        totalDiv.innerText = `Total: ₹${total}`;
      }
    }

    // --- RENDER ALL GRIDS (order page, services, etc) ---
    function renderAllGrids() {
      // food grid
      const foodGrid = document.getElementById('food-grid');
      if (foodGrid) {
        foodGrid.innerHTML = products.filter(p=>p.cat==='food').map(p=>`
          <div class="product-card">
            <div class="product-img">${p.icon}</div>
            <div class="product-info">
              <h4>${p.name}</h4>
              <p style="color:#666;">${p.desc}</p>
              <div style="display:flex; justify-content:space-between;">
                <span class="product-price">₹${p.price}</span>
                <span style="color:${p.stock>0?'green':'red'};">${p.stock>0?p.stock+' left':'Out'}</span>
              </div>
              <button class="product-btn" onclick="addToCart(${p.id})" ${p.stock===0?'disabled style="opacity:0.5;"':''}>${p.stock>0?'🛒 Add':'❌ Out'}</button>
            </div>
          </div>`).join('');
      }
      // beverage grid
      const bevGrid = document.getElementById('beverage-grid');
      if (bevGrid) {
        bevGrid.innerHTML = products.filter(p=>p.cat==='beverage').map(p=>`
          <div class="product-card">
            <div class="product-img">${p.icon}</div>
            <div class="product-info">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
              <span class="product-price">₹${p.price}</span>
              <button class="product-btn" onclick="addToCart(${p.id})" ${p.stock===0?'disabled':''}>Add</button>
            </div>
          </div>`).join('');
      }
      // services
      const servGrid = document.getElementById('services-grid-container');
      if (servGrid) {
        servGrid.innerHTML = servicesArr.map(s=>`
          <div class="service-card">
            <div class="service-icon">${s.icon}</div>
            <h4>${s.name}</h4>
            <p style="margin:1rem 0;">${s.desc}</p>
            <button class="btn" onclick="showNotif('📞 Inquiry sent')">Inquire</button>
          </div>`).join('');
      }
    }

    // --- HOME PAGE SWIPER (trending / featured) ---
    function initSwiper() {
      const swiperWrapper = document.getElementById('swiperWrapper');
      if (!swiperWrapper) return;
      
      const featured = products.filter(p => p.cat === 'featured');
      let slidesHtml = '';
      featured.forEach(p => {
        slidesHtml += `
          <div class="swiper-slide">
            <div class="swiper-product-card">
              <div class="swiper-img">${p.icon}</div>
              <div class="swiper-info">
                <h4>${p.name}</h4>
                <p style="color:#666; font-size:0.9rem;">${p.desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="swiper-price">₹${p.price}</span>
                  <span style="color:${p.stock>0?'#2e7d32':'#ff4444'}; font-size:0.8rem;">${p.stock>0?p.stock+' left':'Out'}</span>
                </div>
                <button class="swiper-btn" onclick="addToCart(${p.id})" ${p.stock===0?'disabled style="opacity:0.5;"':''}>
                  ${p.stock>0?'🛒 Add to Cart':'❌ Sold Out'}
                </button>
              </div>
            </div>
          </div>`;
      });
      swiperWrapper.innerHTML = slidesHtml;

      // Initialize Swiper
      new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }

    // --- SEARCH (order page) ---
    function handleSearchKeyUp(e) {
      const q = e.target.value.trim();
      if (q.length>=2) performOrderSearch(q);
      else document.getElementById('orderSearchResults')?.classList.remove('active');
    }
    function performOrderSearch(query) {
      if (!query) query = document.getElementById('orderSearchInput')?.value.trim() || '';
      if (query.length<2) { showNotif('🔍 Type at least 2 chars'); return; }
      const results = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()));
      const resDiv = document.getElementById('orderSearchResults');
      if (!resDiv) return;
      if (results.length===0) {
        resDiv.innerHTML = '<div style="padding:20px;text-align:center;">🍽️ No dishes found</div>';
        resDiv.classList.add('active'); return;
      }
      let html = '';
      results.slice(0,5).forEach(p => {
        html += `<div class="result-item" onclick="selectOrderProduct(${p.id})" style="display:flex; padding:12px; border-bottom:1px solid #eee; cursor:pointer;">
          <div style="font-size:30px; margin-right:15px;">${p.icon}</div>
          <div><strong>${p.name}</strong><br>₹${p.price}<br><span style="color:${p.stock>0?'green':'red'};">${p.stock>0?'In stock':'Out'}</span></div>
        </div>`;
      });
      resDiv.innerHTML = html;
      resDiv.classList.add('active');
    }
    function selectOrderProduct(pid) {
      addToCart(pid);
      document.getElementById('orderSearchResults')?.classList.remove('active');
      document.getElementById('cartSidebar')?.classList.add('active');
    }

    // --- CUSTOM MEAL ---
    function submitMealRequest() {
      const name = document.getElementById('mealName')?.value;
      if (!name) { showNotif('⚠️ Please fill name'); return; }
      showNotif('✅ Custom meal request sent!');
    }
    function scrollToCustom() {
      document.getElementById('custom-meal-block')?.scrollIntoView({behavior:'smooth'});
    }

    // --- PAGE SWITCHING ---
    function switchPage(pageId) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
      document.getElementById(pageId).classList.add('active-page');
      
      document.querySelectorAll('.nav-desk-link').forEach(l => l.classList.remove('active-nav'));
      let deskLink = document.querySelector(`.nav-desk-link[data-page="${pageId}"]`);
      if (deskLink) deskLink.classList.add('active-nav');

      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active-bottom'));
      let bottomBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
      if (bottomBtn) bottomBtn.classList.add('active-bottom');

      // re-init swiper when home page becomes active
      if (pageId === 'home-page') setTimeout(() => initSwiper(), 50);
    }

    // --- NOTIFICATION ---
    function showNotif(msg) {
  const n = document.getElementById('globalNotification');
  n.textContent = msg;
  n.classList.add('show');

  setTimeout(() => {
    n.classList.remove('show');
  }, 1000); // 1000ms = 1 second
}


    // --- EVENT LISTENERS ---
    window.onload = function() {
      renderAllGrids();
      loadCart();
      initSwiper();

      document.querySelectorAll('.nav-desk-link').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          switchPage(this.dataset.page);
        });
      });

      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
          switchPage(this.dataset.page);
        });
      });

      document.getElementById('cartIcon').addEventListener('click', ()=>{
        document.getElementById('cartSidebar').classList.add('active');
      });
      document.getElementById('closeCart').addEventListener('click', ()=>{
        document.getElementById('cartSidebar').classList.remove('active');
      });

      const searchBtn = document.querySelector('.search-btn');
      if (searchBtn) searchBtn.addEventListener('click', ()=> performOrderSearch() );

      switchPage('home-page');
    };

    // expose globally
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.switchPage = switchPage;
    window.submitMealRequest = submitMealRequest;
    window.scrollToCustom = scrollToCustom;
    window.showNotif = showNotif;
    window.handleSearchKeyUp = handleSearchKeyUp;
    window.performOrderSearch = performOrderSearch;
    window.selectOrderProduct = selectOrderProduct;
 
