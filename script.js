//////// fakeStoreApi:
const API_URL = 'https://fakestoreapi.com/products'; 

async function carregarDados() {
    const response = await fetch(API_URL);
    const produtos = await response.json();

    atualizarCards(produtos);
    preencherTabela(produtos);
    gerarGraficos(produtos);
}

function atualizarCards(produtos) {
    const totalVendas = produtos.reduce((soma, p) => soma + p.price, 0);
    const totalProdutos = produtos.length;
    const categorias = [...new Set(produtos.map(p => p.category))];
    const crescimento = Math.floor(Math.random() * 30 + 1); // Simulado

    document.querySelector('.card:nth-child(1) .valor').textContent = `R$ ${totalVendas.toFixed(2)}`;
    document.querySelector('.card:nth-child(2) .valor').textContent = `${Math.floor(totalProdutos * 0.8)}`; // Simula clientes
    document.querySelector('.card:nth-child(3) .valor').textContent = totalProdutos;
    document.querySelector('.card:nth-child(4) .valor').textContent = `${crescimento}%`;
}

function preencherTabela(produtos) {
    const tbody = document.querySelector('#tabela-dados tbody');
    tbody.innerHTML = '';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.title}</td>
            <td>${produto.category}</td>
            <td>${Math.floor(Math.random() * 50 + 1)}</td>
            <td>R$ ${produto.price.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function gerarGraficos(produtos) {
    const categorias = {};
    produtos.forEach(produto => {
        if (!categorias[produto.category]) {
            categorias[produto.category] = {
                quantidade: 0,
                valor: 0
            };
        }
        categorias[produto.category].quantidade += 1;
        categorias[produto.category].valor += produto.price;
    });

    const nomesCategorias = Object.keys(categorias);
    const qtdPorCategoria = Object.values(categorias).map(c => c.quantidade);
    const valorPorCategoria = Object.values(categorias).map(c => c.valor.toFixed(2));


const ctxVendas = document.getElementById('grafico-vendas').getContext('2d');
new Chart(ctxVendas, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Vendas (R$)',
            data: [1200, 1900, 3000, 2500, 2200, 2800],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Vendas Mensais'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctxCategorias = document.getElementById('grafico-categorias').getContext('2d');
new Chart(ctxCategorias, {
    type: 'pie',
    data: {
        labels: ['Eletrônicos', 'Roupas', 'Livros', 'Alimentos'],
        datasets: [{
            label: 'Categorias',
            data: [30, 25, 15, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Distribuição por Categoria'
            }
        }
    }
});

}

carregarDados();

///// crud back4app

const APPLICATION_ID = ZujUTFo4cU8jrCNFASuMTINhRZer2PuZFdkgGnLg;
const REST_API_KEY = XD80er4Mqg4I1MGh1rXYmR7nqcaUDcN7QFEc2SJ8;

const headersBack4App = {
  "X-Parse-Application-Id": APPLICATION_ID,
  "X-Parse-REST-API-Key": REST_API_KEY,
  "Content-Type": "application/json"
};

const urlBaseBack4App = "https://parseapi.back4app.com/classes/Produto";