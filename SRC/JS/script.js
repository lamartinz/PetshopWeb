const isProdutosPage = () => {
  const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return p === 'produtos.html';
};

window.adicionar_ao_carrinho_card = function (botao) {
  const card = botao.closest('.card');
  if (!card) return;
  const nome = (card.querySelector('h3')?.innerText || '').trim();
  const precoTxt = (card.querySelector('p')?.innerText || '').trim();
  const imagem = card.querySelector('img')?.getAttribute('src') || '';
  const preco = Number(precoTxt.replace(/[^0-9,\.]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
  const id = 'dom-' + nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const existente = carrinho.find(i => i.id === id);
  if (existente) existente.quantidade += 1;
  else carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert('Produto adicionado ao carrinho!');
};

function buscarProduto() {
  if (!isProdutosPage()) return;
  const input = document.getElementById('searchInput');
  const filtro = (input?.value || '').trim().toLowerCase();
  const containers = document.querySelectorAll('.produtos-container');
  containers.forEach(container => {
    let ok = false;
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
      const nome = (card.querySelector('h3')?.innerText || '').toLowerCase();
      const match = !filtro || nome.includes(filtro);
      card.style.display = match ? '' : 'none';
      if (match) ok = true;
    });
    container.style.display = ok ? '' : 'none';
    const titulo = container.previousElementSibling;
    if (titulo && titulo.classList.contains('h3-prod')) titulo.style.display = ok ? '' : 'none';
  });
}

(function () {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.card button');
    if (btn && !btn.getAttribute('onclick')) window.adicionar_ao_carrinho_card(btn);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-cards .nav-card').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path) a.classList.add('active');
    });

    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');

    function buscarGlobal() {
      const filtro = (input?.value || '').trim();
      if (isProdutosPage()) {
        buscarProduto();
      } else {
        if (filtro) {
          window.location.href = `produtos.html?q=${encodeURIComponent(filtro)}`;
        } else {
          window.location.href = `produtos.html`;
        }
      }
    }

    if (input) input.addEventListener('keypress', e => { if (e.key === 'Enter') buscarGlobal(); });
    if (btn) btn.addEventListener('click', buscarGlobal);

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (isProdutosPage() && input) {
      if (q) {
        input.value = q;
      }
      buscarProduto();
    }
  });
})();

function isCarrinhoPage() {
  const p = (location.pathname.split('/').pop() || '').toLowerCase();
  return p === 'carrinho.html';
}
function nf(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0); }
function getCart() { try { return JSON.parse(localStorage.getItem('carrinho')) || [] } catch (e) { return [] } }
function setCart(c) { localStorage.setItem('carrinho', JSON.stringify(c)) }
function cartSubtotal(item) { return (item.preco || 0) * (item.quantidade || 0) }
function renderCart() {
  if (!isCarrinhoPage()) return;
  const listEl = document.getElementById('cart-list');
  const emptyEl = document.getElementById('cart-empty');
  const areaEl = document.getElementById('cart-area');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();
  if (!cart.length) {
    if (listEl) listEl.innerHTML = '';
    if (totalEl) totalEl.textContent = nf(0);
    if (emptyEl) emptyEl.hidden = false;
    if (areaEl) areaEl.hidden = true;
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(it => {
    const sub = cartSubtotal(it); total += sub;
    html += `
      <div class="cart-item" data-id="${it.id}">
        <img src="${it.imagem || ''}" alt="">
        <div class="item-name">${it.nome || ''}</div>
        <div class="item-price">${nf(it.preco || 0)}</div>
        <div class="qty">
          <button data-act="dec">−</button>
          <span>${it.quantidade || 1}</span>
          <button data-act="inc">+</button>
        </div>
        <div class="item-sub">${nf(sub)}</div>
        <button class="remove-btn" data-act="rm">Remover</button>
      </div>`;
  });
  if (listEl) listEl.innerHTML = html;
  if (totalEl) totalEl.textContent = nf(total);
  if (emptyEl) emptyEl.hidden = true;
  if (areaEl) areaEl.hidden = false;
}
document.addEventListener('click', e => {
  const itemEl = e.target.closest('.cart-item');
  if (!itemEl) return;
  const id = itemEl.getAttribute('data-id');
  if (!id) return;
  const act = e.target.getAttribute('data-act');
  if (!act) return;
  let cart = getCart();
  const idx = cart.findIndex(x => x.id === id);
  if (idx < 0) return;
  if (act === 'inc') { cart[idx].quantidade += 1 }
  if (act === 'dec') { cart[idx].quantidade = Math.max(1, (cart[idx].quantidade || 1) - 1) }
  if (act === 'rm') { cart.splice(idx, 1) }
  setCart(cart); renderCart();
});
document.addEventListener('DOMContentLoaded', () => {
  if (isCarrinhoPage()) {
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) btnClear.addEventListener('click', () => { setCart([]); renderCart() });
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) btnCheckout.addEventListener('click', () => { alert('Pedido encaminhado!') });
    renderCart();
  }
});

(function () {
  const isCheckout = () => (location.pathname.split('/').pop() || '').toLowerCase() === 'checkout.html';
  const isSuccess = () => (location.pathname.split('/').pop() || '').toLowerCase() === 'sucesso.html';
  const nf = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const getCart = () => { try { return JSON.parse(localStorage.getItem('carrinho')) || [] } catch (e) { return [] } };
  const setLS = (k, v) => localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  const getLS = (k, def = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch (e) { return def } };

  document.addEventListener('DOMContentLoaded', () => {
    if (isCheckout()) {
      if (!getCart().length) { window.location.href = 'carrinho.html'; return; }

      const savedFrete = getLS('checkout_frete', '19.9');
      const savedPay = getLS('checkout_pay', 'pix');
      const freteInputs = document.querySelectorAll('input[name="frete"]');
      const payInputs = document.querySelectorAll('input[name="pay"]');
      freteInputs.forEach(r => { if (r.value === String(savedFrete)) r.checked = true; });
      payInputs.forEach(r => { if (r.value === savedPay) r.checked = true; });

      document.getElementById('btn-cupom')?.addEventListener('click', () => document.getElementById('cupom')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
      document.getElementById('cupom')?.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const input = e.currentTarget; const code = (input.value || '').trim().toUpperCase();
        if (!code) return;
        const subEl = document.getElementById('sum-sub'); const freteEl = document.getElementById('sum-frete'); const totalEl = document.getElementById('sum-total');
        let sub = Number((subEl?.textContent || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        if (code === 'AUMIGO10') { sub = sub * 0.9; alert('Cupom aplicado: 10% de desconto!'); input.value = ''; }
        else { alert('Cupom inválido.'); }
        const fre = Number((freteEl?.textContent || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        if (subEl) subEl.textContent = nf(sub);
        if (totalEl) totalEl.textContent = nf(sub + fre);
      });

      document.querySelectorAll('input[name="frete"]').forEach(r => {
        r.addEventListener('change', () => { setLS('checkout_frete', r.value); });
      });
      document.querySelectorAll('input[name="pay"]').forEach(r => {
        r.addEventListener('change', () => { setLS('checkout_pay', r.value); });
      });

      const btnFinalizar = document.getElementById('btn-finalizar');
      if (btnFinalizar) {
        let locked = false;
        btnFinalizar.addEventListener('click', () => {
          if (locked) return;
          locked = true;
          setTimeout(() => locked = false, 1500);
        });
      }
    }

    if (isSuccess()) {
      try {
        const p = JSON.parse(localStorage.getItem('ultimo_pedido') || 'null');
        if (p && p.total) {}
      } catch (e) {}
    }
  });
})();

(function () {
  function initPromoCarousel() {
    const wrap = document.getElementById('promoCarousel');
    if (!wrap) return;
    const track = wrap.querySelector('.carousel-track');
    const slides = Array.from(wrap.querySelectorAll('.slide'));
    const prev = wrap.querySelector('.prev');
    const next = wrap.querySelector('.next');
    const dots = Array.from(wrap.querySelectorAll('.dot'));
    let idx = 0, timer = null, interval = 5000;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
      restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => go(idx + 1), interval);
    }

    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));

    go(0);
  }

  document.addEventListener('DOMContentLoaded', initPromoCarousel);
})();
