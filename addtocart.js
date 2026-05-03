document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = 'indibuy_cart';
  let cart = loadCartFromStorage();
  const cartItemContainer = document.getElementById('cartItem');
  const totalAmountElement = document.getElementById('total');

  /**
   * Load cart from localStorage
   */
  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return {};
    }
  }

  /**
   * Save cart to localStorage
   */
  function saveCartToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Update cart display
   */
  function updateCart() {
    cartItemContainer.innerHTML = '';
    let totalAmount = 0;

    Object.keys(cart).forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      const itemTotal = cart[item].totalPrice;
      totalAmount += itemTotal;
      
      cartItem.innerHTML = `
        <p>${item} - ₹${cart[item].price.toFixed(2)} x ${cart[item].quantity} = ₹${itemTotal.toFixed(2)}</p>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item}')">Remove</button>
      `;
      cartItemContainer.appendChild(cartItem);
    });

    totalAmountElement.innerText = `₹${totalAmount.toFixed(2)}`;
    saveCartToStorage();
  }

  /**
   * Add item to cart
   */
  window.addToCart = function(name, price, quantity) {
    const qty = parseInt(quantity) || 1;
    
    if (qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (cart[name]) {
      cart[name].quantity += qty;
      cart[name].totalPrice += price * qty;
    } else {
      cart[name] = {
        price: price,
        quantity: qty,
        totalPrice: price * qty
      };
    }

    updateCart();
    alert(`${name} added to cart!`);
  };

  /**
   * Remove item from cart
   */
  window.removeFromCart = function(name) {
    if (cart[name]) {
      delete cart[name];
      updateCart();
      alert(`${name} removed from cart!`);
    }
  };

  /**
   * Clear entire cart
   */
  window.clearCart = function() {
    if (confirm('Are you sure you want to clear the cart?')) {
      cart = {};
      updateCart();
    }
  };

  /**
   * Get cart total
   */
  window.getCartTotal = function() {
    return Object.values(cart).reduce((sum, item) => sum + item.totalPrice, 0);
  };

  /**
   * Get cart items count
   */
  window.getCartItemsCount = function() {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  // Attach event listeners to add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.contentBx');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      const quantityInput = card ? card.querySelector('.quantity') : null;
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      addToCart(name, price, quantity);
    });
  });

  // Initial cart display
  updateCart();
});
