document.addEventListener("DOMContentLoaded", () => {
  const cart = {};
  const cartItemContainer = document.getElementById('cartItem');
  const totalAmountElement = document.getElementById('total');
  let totalAmount = 0;

  document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
          const card = button.closest('.contentBx');
          const name = button.getAttribute('data-name');
          const price = parseFloat(button.getAttribute('data-price'));
          const quantityInput = card.querySelector('.quantity');
          const quantity = parseInt(quantityInput.value);

          if (cart[name]) {
              cart[name].quantity += quantity;
              cart[name].totalPrice += price * quantity;
          } else {
              cart[name] = {
                  price: price,
                  quantity: quantity,
                  totalPrice: price * quantity
              };
          }

          totalAmount += price * quantity;
          updateCart();
      });
  });

  function updateCart() {
      cartItemContainer.innerHTML = '';
      Object.keys(cart).forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `
              <p>${item} - ₹${cart[item].price} x ${cart[item].quantity} = ₹${cart[item].totalPrice}</p>
          `;
          cartItemContainer.appendChild(cartItem);
      });

      totalAmountElement.innerText = `₹${totalAmount}`;
  }
});
