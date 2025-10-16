const lista_de_produtos = [
  { id: 1, nome: "Ração Premium Dog", preco: 120.00, imagem: "IMAGES/img.jpg" },
  { id: 2, nome: "Mordedor para Cachorro", preco: 35.00, imagem: "IMAGES/img2.jpg.jpg" },
  { id: 3, nome: "Guia e Coleira", preco: 60.00, imagem: "IMAGES/img3.jpg.jpg" },
  { id: 4, nome: "Petisco Natural", preco: 25.00, imagem: "IMAGES/img4.jpg.jpg" },
  { id: 5, nome: "Cama Confort", preco: 150.00, imagem: "IMAGES/img5.jpg.jpg" },
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionar_ao_carrinho(produtoId) {
  const produto = lista_de_produtos.find(p => p.id === produtoId);
  if (!produto) return alert("Erro: Produto não encontrado!");
  const existente = carrinho.find(item => item.id === produtoId);
  if (existente) existente.quantidade += 1;
  else carrinho.push({ ...produto, quantidade: 1 });
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

function buscarProdutoLocal(filtroRaw = null) {
  const input = document.getElementById("searchInput");
  if (!input) return;
  const filtro = (filtroRaw !== null ? filtroRaw : input.value).toString().trim().toLowerCase();
  const secoes = document.querySelectorAll("section, .produtos-container, .categoria");
  secoes.forEach(secao => {
    const produtos = secao.querySelectorAll(".card");
    let temVisivel = false;
    produtos.forEach(produto => {
      const nome = (produto.querySelector("h3")?.innerText || "").toLowerCase();
      const corresponde = !filtro || nome.includes(filtro);
      produto.style.display = corresponde ? "" : "none";
      if (corresponde) temVisivel = true;
    });
    const titulo = secao.querySelector("h2, h3");
    secao.style.display = temVisivel ? "" : "none";
    if (titulo) titulo.style.display = temVisivel ? "" : "none";
  });
}

function buscarGlobal() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  const filtro = input.value.trim();
  const estaNaProdutos = /\/?produtos\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith("/produtos.html");
  if (filtro === "") {
    if (estaNaProdutos) {
      buscarProdutoLocal("");
      input.value = "";
    } else {
      window.location.href = "produtos.html";
    }
    return;
  }
  if (estaNaProdutos) {
    buscarProdutoLocal(filtro);
  } else {
    window.location.href = `produtos.html?q=${encodeURIComponent(filtro)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  if (input) input.addEventListener("keypress", e => { if (e.key === "Enter") { e.preventDefault(); buscarGlobal(); } });
  if (btn) btn.addEventListener("click", buscarGlobal);
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  const estaNaProdutos = /\/?produtos\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith("/produtos.html");
  if (q && input) {
    input.value = q;
    buscarProdutoLocal(q);
  } else if (estaNaProdutos) {
    buscarProdutoLocal("");
  }
});

(function(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-cards .nav-card').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });
})();
