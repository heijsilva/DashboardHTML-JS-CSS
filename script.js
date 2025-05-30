//////// fakeStoreApi:
// configurações das apis
const API_URL = 'https://fakestoreapi.com/products'; 

const APPLICATION_ID = ZujUTFo4cU8jrCNFASuMTINhRZer2PuZFdkgGnLg;
const REST_API_KEY = XD80er4Mqg4I1MGh1rXYmR7nqcaUDcN7QFEc2SJ8;

const headersBack4App = {
  "X-Parse-Application-Id": APPLICATION_ID,
  "X-Parse-REST-API-Key": REST_API_KEY,
  "Content-Type": "application/json"
};

const urlBaseBack4App = "https://parseapi.back4app.com/classes/Produto";

//elementos do dom
const formProduto = document.getElementById('form-produto');
const inputId = document.getElementById('produto-id');
const inputNome = document.getElementById('nome-produto');
const inputCategoria = document.getElementById('categoria-produto');
const inputPreco = document.getElementById('preco-produto');
const btnCancelar = document.getElementById('btn-cancelar');
const tbodyBack4App = document.querySelector('#tabela-back4app tbody');

//função atualizar dados do dashboard
async function carregarDashboardComBack4App() {
  const res = await fetch(urlBaseBack4App, { headers: headersBack4App });
  const data = await res.json();
  const produtos = data.results;

  atualizarCards(produtos);
  preencherTabela(produtos);
  gerarGraficos(produtos);
}

//função atualizar cards
function atualizarCards(produtos) {
  const totalVendas = produtos.reduce((soma, p) => soma + p.preco, 0);
  const totalProdutos = produtos.length;
  const crescimento = Math.floor(Math.random() * 30 + 1);
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  document.querySelector('.card:nth-child(1) .valor').textContent = `R$ ${totalVendas.toFixed(2)}`;
  document.querySelector('.card:nth-child(2) .valor').textContent = `${Math.floor(totalProdutos * 0.8)}`;
  document.querySelector('.card:nth-child(3) .valor').textContent = totalProdutos;
  document.querySelector('.card:nth-child(4) .valor').textContent = `${crescimento}%`;
}

//tabela
function preencherTabela(produtos) {
  const tbody = document.querySelector('#tabela-dados tbody');
  tbody.innerHTML = '';

  produtos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.objectId}</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${Math.floor(Math.random() * 50 + 1)}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

//graficos
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
// formulario de cadastro
formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const produto = {
    nome: inputNome.value,
    categoria: inputCategoria.value,
    preco: parseFloat(inputPreco.value)
  };

  if (inputId.value) {
    await atualizarProdutoBack4App(inputId.value, produto);
  } else {
    await criarProdutoBack4App(produto);
  }

  formProduto.reset();
  inputId.value = '';
  btnCancelar.style.display = 'none';

  listarProdutosBack4App();
  carregarDashboardComBack4App();
});

btnCancelar.addEventListener('click', () => {
  formProduto.reset();
  inputId.value = '';
  btnCancelar.style.display = 'none';
});

//crud
async function listarProdutosBack4App() {
  const res = await fetch(urlBaseBack4App, { headers: headersBack4App });
  const data = await res.json();

  tbodyBack4App.innerHTML = '';
  data.results.forEach(prod => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${prod.nome}</td>
      <td>${prod.categoria}</td>
      <td>R$ ${prod.preco.toFixed(2)}</td>
      <td>
        <button onclick="editarProduto('${prod.objectId}', '${prod.nome}', '${prod.categoria}', ${prod.preco})">Editar</button>
        <button onclick="deletarProduto('${prod.objectId}')">Excluir</button>
      </td>
    `;
    tbodyBack4App.appendChild(tr);
  });
}

async function criarProdutoBack4App(produto) {
  const res = await fetch(urlBaseBack4App, {
    method: "POST",
    headers: headersBack4App,
    body: JSON.stringify(produto)
  });
  const data = await res.json();
  if (data.objectId) {
    alert('Produto criado com sucesso!');
  } else {
    alert('Erro ao criar produto.');
  }
}

async function atualizarProdutoBack4App(id, produto) {
  const res = await fetch(`${urlBaseBack4App}/${id}`, {
    method: "PUT",
    headers: headersBack4App,
    body: JSON.stringify(produto)
  });
  const data = await res.json();
  if (data.updatedAt) {
    alert('Produto atualizado com sucesso!');
  } else {
    alert('Erro ao atualizar produto.');
  }
}

async function deletarProduto(id) {
  if (confirm('Deseja realmente deletar este produto?')) {
    const res = await fetch(`${urlBaseBack4App}/${id}`, {
      method: "DELETE",
      headers: headersBack4App,
    });
    if (res.status === 200) {
      alert('Produto deletado!');
      listarProdutosBack4App();
      carregarDashboardComBack4App();
    } else {
      alert('Erro ao deletar produto.');
    }
  }
}

function editarProduto(id, nome, categoria, preco) {
  inputId.value = id;
  inputNome.value = nome;
  inputCategoria.value = categoria;
  inputPreco.value = preco;
  btnCancelar.style.display = 'inline-block';
}

// inicializações
listarProdutosBack4App();
carregarDashboardComBack4App();


