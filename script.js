//////// fakeStoreApi:
// configurações das apis
const API_URL = 'https://fakestoreapi.com/products'; 

const APPLICATION_ID = "ZujUTFo4cU8jrCNFASuMTINhRZer2PuZFdkgGnLg";
const REST_API_KEY = "XD80er4Mqg4I1MGh1rXYmR7nqcaUDcN7QFEc2SJ8";

const headersBack4App = {
  "X-Parse-Application-Id": APPLICATION_ID,
  "X-Parse-REST-API-Key": REST_API_KEY,
  "Content-Type": "application/json"
};

const urlBaseBack4App = "https://parseapi.back4app.com/classes/Produto";

//elementos do dom
// Adicionei verificações para garantir que os elementos são encontrados
const formProduto = document.getElementById('form-produto');
const inputId = document.getElementById('input-id');
const inputNome = document.getElementById('input-nome');
const inputCategoria = document.getElementById('input-categoria');
const inputPreco = document.getElementById('input-preco');
const btnCancelar = document.getElementById('btn-cancelar');
const tbodyBack4App = document.querySelector('#tabela-back4app tbody'); 

// Variáveis globais para as instâncias dos gráficos
let graficoVendasInstance = null;
let graficoCategoriasInstance = null;

//função para imortar dados do fakestoreapi para b4p
async function importarProdutosFakeStore() {
  const response = await fetch(API_URL);
  const produtos = await response.json();

  for (const produto of produtos) {
    const novoProduto = {
      nome: produto.title,
      categoria: produto.category,
      preco: produto.price
    };
    await criarProdutoBack4App(novoProduto, false); 
  }

  alert('Produtos importados com sucesso!');
  listarProdutosBack4App();
  carregarDashboardComBack4App();
}

//função carregar dados do dashboard
async function carregarDashboardComBack4App() {
  try {
    const res = await fetch(urlBaseBack4App, { headers: headersBack4App });
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }
    const data = await res.json();
    const produtos = data.results;

    atualizarCards(produtos);
    preencherTabela(produtos);
    gerarGraficos(produtos); 
  } catch (error) {
    console.error("Erro ao carregar dados do Back4App para o dashboard:", error);
    alert("Erro ao carregar dados do dashboard. Verifique o console para mais detalhes.");
  }
}

//função atualizar cards
function atualizarCards(produtos) {
  const totalVendas = produtos.reduce((soma, p) => soma + p.preco, 0);
  const totalProdutos = produtos.length;
  const totalClientes = Math.floor(totalProdutos * 0.8); 
  const crescimento = Math.floor(Math.random() * 30 + 1);

  document.querySelector('.card:nth-child(1) .valor').textContent = `R$ ${totalVendas.toFixed(2)}`;
  document.querySelector('.card:nth-child(2) .valor').textContent = `${totalClientes}`;
  document.querySelector('.card:nth-child(3) .valor').textContent = totalProdutos;
  document.querySelector('.card:nth-child(4) .valor').textContent = `${crescimento}%`;
}

//tabela de dados do dashboard
function preencherTabela(produtos) {
  const tbody = document.querySelector('#tabela-dados tbody');
  if (!tbody) {
    console.error("Elemento '#tabela-dados tbody' não encontrado.");
    return;
  }
  tbody.innerHTML = '';

  produtos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.objectId || 'N/A'}</td>
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
    if (!categorias[produto.categoria]) {
      categorias[produto.categoria] = { quantidade: 0, valor: 0 };
    }
    categorias[produto.categoria].quantidade += 1;
    categorias[produto.categoria].valor += produto.preco;
  });

  const nomesCategorias = Object.keys(categorias);
  const qtdPorCategoria = Object.values(categorias).map(c => c.quantidade);

  const ctxVendas = document.getElementById('grafico-vendas');
  if (ctxVendas) {
    if (graficoVendasInstance) {
      graficoVendasInstance.destroy();
    }
    graficoVendasInstance = new Chart(ctxVendas.getContext('2d'), {
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
          legend: { position: 'top' },
          title: { display: true, text: 'Vendas Mensais' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  } else {
    console.warn("Elemento 'grafico-vendas' não encontrado para renderizar o gráfico.");
  }

  const ctxCategorias = document.getElementById('grafico-categorias');
  if (ctxCategorias) {
    if (graficoCategoriasInstance) {
      graficoCategoriasInstance.destroy();
    }
    graficoCategoriasInstance = new Chart(ctxCategorias.getContext('2d'), {
      type: 'pie',
      data: {
        labels: nomesCategorias,
        datasets: [{
          label: 'Categorias',
          data: qtdPorCategoria,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(200, 100, 50, 0.6)',
            'rgba(100, 200, 50, 0.6)'
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Distribuição por Categoria' }
        }
      }
    });
  } else {
    console.warn("Elemento 'grafico-categorias' não encontrado para renderizar o gráfico.");
  }
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
  try {
    const res = await fetch(urlBaseBack4App, { headers: headersBack4App });
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }
    const data = await res.json();

    if (!tbodyBack4App) {
      console.error("Elemento '#tabela-back4app tbody' não encontrado para listar produtos.");
      return;
    }
    tbodyBack4App.innerHTML = '';
    data.results.forEach(prod => {
      const tr = document.createElement('tr');
      // Usando encodeURIComponent para nome e categoria para evitar problemas com aspas
      // E parseFloat para preco para garantir que seja um número
      const encodedNome = encodeURIComponent(prod.nome);
      const encodedCategoria = encodeURIComponent(prod.categoria);
      const precoNumerico = parseFloat(prod.preco);

      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.categoria}</td>
        <td>R$ ${precoNumerico.toFixed(2)}</td>
        <td>
          <button onclick="editarProduto('${prod.objectId}', '${encodedNome}', '${encodedCategoria}', ${precoNumerico})">Editar</button>
          <button onclick="deletarProduto('${prod.objectId}')">Excluir</button>
        </td>
      `;
      tbodyBack4App.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao listar produtos do Back4App:", error);
    alert("Erro ao listar produtos. Verifique o console para mais detalhes.");
  }
}

async function criarProdutoBack4App(produto, showAlert = true) {
  try {
    const res = await fetch(urlBaseBack4App, {
      method: "POST",
      headers: headersBack4App,
      body: JSON.stringify(produto)
    });
    const data = await res.json();
    if (data.objectId) {
      if (showAlert) alert('Produto criado com sucesso!');
    } else {
      if (showAlert) alert('Erro ao criar produto.');
      console.error("Erro ao criar produto:", data);
    }
  } catch (error) {
    if (showAlert) alert('Erro de rede ao criar produto.');
    console.error("Erro de rede ao criar produto:", error);
  }
}

async function atualizarProdutoBack4App(id, produto) {
  try {
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
      console.error("Erro ao atualizar produto:", data);
    }
  } catch (error) {
    alert('Erro de rede ao atualizar produto.');
    console.error("Erro de rede ao atualizar produto:", error);
  }
}

async function deletarProduto(id) {
  if (confirm('Deseja realmente deletar este produto?')) {
    try {
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
        console.error("Erro ao deletar produto. Status:", res.status);
      }
    } catch (error) {
      alert('Erro de rede ao deletar produto.');
      console.error("Erro de rede ao deletar produto:", error);
    }
  }
}

// Função editarProduto com decodeURIComponent
function editarProduto(id, nomeEncoded, categoriaEncoded, preco) {
  // Decodifica os valores que foram codificados antes de serem passados
  const nome = decodeURIComponent(nomeEncoded);
  const categoria = decodeURIComponent(categoriaEncoded);

  // Atribui os valores decodificados aos campos do formulário
  if (inputId) inputId.value = id;
  if (inputNome) inputNome.value = nome;
  if (inputCategoria) inputCategoria.value = categoria;
  // Garante que o preço seja um número válido
  if (inputPreco) inputPreco.value = parseFloat(preco) || 0; 
  
  if (btnCancelar) btnCancelar.style.display = 'inline-block';

  // Opcional: Rola para a seção do formulário para facilitar a edição
  document.getElementById('crud').scrollIntoView({ behavior: 'smooth' });
}

// inicializações
document.addEventListener('DOMContentLoaded', () => {
  // Verificações iniciais para garantir que os elementos do formulário existem
  if (!formProduto || !inputId || !inputNome || !inputCategoria || !inputPreco || !btnCancelar || !tbodyBack4App) {
    console.error("Um ou mais elementos do DOM necessários para o formulário ou tabela não foram encontrados. Verifique os IDs no HTML.");
    // Não prossegue com a inicialização se elementos críticos estiverem faltando
    return; 
  }

  listarProdutosBack4App();
  carregarDashboardComBack4App();
  // importarProdutosFakeStore(); 
});