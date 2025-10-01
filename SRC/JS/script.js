const lista_de_produtos = [
    {
        id: 1,
        nome: "Ração Premium Dog",
        preco: 120.00,
        imagem: "img1.jpg" 
    },

    {
        id: 2,
        nome: "Mordedor para Cachorro",
        preco: 35.00,
        imagem: "img2.jpg"
    },
    
    {
        id: 3,
        nome: "Guia e Coleira",
        preco: 60.00,
        imagem: "img3.jpg"
    },

    {
        id: 4,
        nome: "Petisco Natural",
        preco: 25.00,
        imagem: "img4.jpg"
    },

    {
        id: 5,
        nome: "Cama Confort",
        preco: 150.00,
        imagem: "img5.png"
    }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionar_ao_carrinho(produtoId){
    const produto = lista_de_produtos.find(p => p.id === produtoId);
    
    if(produto){
        let item_existe = carrinho.find(item => item.id === produtoId); 
        
        if(item_existe){
            item_existe.quantidade += 1;
        } 
        else{
            carrinho.push({ ...produto, quantidade: 1 });
        }
        
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        alert("Produto adicionado ao carrinho!");   
    } 
    else {
        alert("Erro: Produto não encontrado!");
    }
}