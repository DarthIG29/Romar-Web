const selectionList = document.getElementById('selectionList');
const selectionTotal = document.getElementById('selectionTotal');
const quoteStatus = document.getElementById('quoteStatus');
const sendQuoteBtn = document.getElementById('sendQuote');

const serviceForm = document.getElementById('serviceForm');
const serviceStatus = document.getElementById('serviceStatus');

const cart = new Map();

function formatCurrency(value) {
  return `$${value.toLocaleString('es-EC', { minimumFractionDigits: 0 })}`;
}

function renderSelection() {
  selectionList.innerHTML = '';
  if (cart.size === 0) {
    selectionList.innerHTML = '<li class="selection__empty">Aún no agregas equipos.</li>';
    selectionTotal.textContent = '$0';
    return;
  }

  let total = 0;
  cart.forEach(({ quantity, price }, name) => {
    total += quantity * price;
    const item = document.createElement('li');
    item.className = 'selection__item';
    item.innerHTML = `
      <span>${name} × ${quantity}</span>
      <button class="btn btn--ghost btn--small" data-name="${name}">Quitar</button>
    `;
    selectionList.appendChild(item);
  });

  selectionTotal.textContent = formatCurrency(total);
}

function handleAdd(event) {
  const card = event.target.closest('.product');
  if (!card) return;
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price, 10);
  const current = cart.get(name) || { quantity: 0, price };
  cart.set(name, { quantity: current.quantity + 1, price });
  renderSelection();
  quoteStatus.textContent = '';
}

function handleRemove(event) {
  if (!event.target.matches('.btn--small')) return;
  const name = event.target.dataset.name;
  if (cart.has(name)) {
    cart.delete(name);
    renderSelection();
  }
}

function handleQuote() {
  if (cart.size === 0) {
    quoteStatus.textContent = 'Agrega al menos un equipo para cotizar.';
    quoteStatus.style.color = '#fcd34d';
    return;
  }
  quoteStatus.textContent = '¡Recibimos tu lista! Te contactaremos en minutos.';
  quoteStatus.style.color = '#34d399';
}

function handleServiceSubmit(event) {
  event.preventDefault();
  serviceStatus.textContent = 'Enviando solicitud...';
  serviceStatus.style.color = '#fcd34d';

  setTimeout(() => {
    serviceStatus.textContent = 'Agendado. Un técnico confirmará tu hora por teléfono.';
    serviceStatus.style.color = '#34d399';
    serviceForm.reset();
  }, 600);
}

document.querySelectorAll('.add-btn').forEach((button) => {
  button.addEventListener('click', handleAdd);
});

selectionList.addEventListener('click', handleRemove);
sendQuoteBtn.addEventListener('click', handleQuote);
serviceForm.addEventListener('submit', handleServiceSubmit);

renderSelection();
