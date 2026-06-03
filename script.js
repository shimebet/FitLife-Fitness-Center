
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('subscribeEmail').value.trim();
      localStorage.setItem('fitlifeSubscriber', email);
      document.getElementById('subscribeMessage').textContent = 'Thank you for subscribing!';
      subscribeForm.reset();
    });
  }

  const getCart = () => JSON.parse(localStorage.getItem('fitlifeCart') || '[]');
  const saveCart = (cart) => localStorage.setItem('fitlifeCart', JSON.stringify(cart));
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const cart = getCart();
      cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
      saveCart(cart);
      alert('Item added.');
    });
  });

  const modal = document.getElementById('cartModal');
  const list = document.getElementById('cartItems');
  const total = document.getElementById('cartTotal');
  function renderCart() {
    if (!list || !total) return;
    const cart = getCart();
    list.innerHTML = cart.length ? cart.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('') : '<li>Your cart is empty.</li>';
    total.textContent = `Total: $${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`;
  }
  const viewCart = document.getElementById('viewCart');
  if (viewCart && modal) viewCart.addEventListener('click', () => { renderCart(); modal.classList.add('show'); });
  const closeModal = document.querySelector('.close-modal');
  if (closeModal && modal) closeModal.addEventListener('click', () => modal.classList.remove('show'));
  const clearCart = document.getElementById('clearCart');
  if (clearCart) clearCart.addEventListener('click', () => { saveCart([]); renderCart(); document.getElementById('cartMessage').textContent = 'Cart cleared.'; });
  const processOrder = document.getElementById('processOrder');
  if (processOrder) processOrder.addEventListener('click', () => { saveCart([]); renderCart(); alert('Thank you for your order.'); });

  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const request = { name: customerName.value, email: customerEmail.value, type: requestType.value, message: message.value };
      sessionStorage.setItem('fitlifeFeedback', JSON.stringify(request));
      feedbackMessage.textContent = 'Thank you. Your feedback/custom order request was saved for this session.';
      feedbackForm.reset();
    });
  }

  const membershipForm = document.getElementById('membershipForm');
  if (membershipForm) {
    membershipForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const request = { name: memberName.value, email: memberEmail.value, plan: plan.value, goals: goals.value };
      sessionStorage.setItem('fitlifeMembershipInterest', JSON.stringify(request));
      membershipMessage.textContent = 'Thank you. Your membership interest form was saved for this session.';
      membershipForm.reset();
    });
  }
});
