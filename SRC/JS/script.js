const lista_de_produtos = [
  { id: 1, nome: "Ração Premium Dog", preco: 120.00, imagem: "IMAGES/img.jpg" },
  { id: 2, nome: "Mordedor para Cachorro", preco: 35.00, imagem: "IMAGES/img2.jpg.jpg" },
  { id: 3, nome: "Guia e Coleira", preco: 60.00, imagem: "IMAGES/img3.jpg.jpg" },
  { id: 4, nome: "Petisco Natural", preco: 25.00, imagem: "IMAGES/img4.jpg.jpg" },
  { id: 5, nome: "Cama Confort", preco: 150.00, imagem: "IMAGES/img5.jpg.jpg" },
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// 🛒 Adicionar ao carrinho
function adicionar_ao_carrinho(produtoId) {
  const produto = lista_de_produtos.find(p => p.id === produtoId);
  if (!produto) return alert("Erro: Produto não encontrado!");

  const existente = carrinho.find(item => item.id === produtoId);
  if (existente) existente.quantidade += 1;
  else carrinho.push({ ...produto, quantidade: 1 });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

// 🔍 Filtragem local (na página de produtos)
function buscarProdutoLocal(filtroRaw = null) {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const filtro = (filtroRaw !== null ? filtroRaw : input.value)
    .toString()
    .trim()
    .toLowerCase();

  const produtos = document.querySelectorAll(".produtos-container .card, .card");

  produtos.forEach(produto => {
    const nome = (produto.querySelector("h3")?.innerText || "").toLowerCase();
    produto.style.display = filtro && !nome.includes(filtro) ? "none" : "";
  });
}

// 🌎 Pesquisa global — redireciona para produtos.html?q=busca
function buscarGlobal() {
  const input = document.getElementById("searchInput");
  const filtro = input?.value.trim();
  if (!filtro) return;

  if (window.location.pathname.includes("produtos.html")) {
    buscarProdutoLocal(filtro);
  } else {
    window.location.href = `produtos.html?q=${encodeURIComponent(filtro)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  if (input) input.addEventListener("keypress", e => { if (e.key === "Enter") buscarGlobal(); });
  if (btn) btn.addEventListener("click", buscarGlobal);

  // Quando abrir produtos.html?q=alguma_coisa, aplicar filtro automaticamente
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q && input) {
    input.value = q;
    buscarProdutoLocal(q);
  }
});
