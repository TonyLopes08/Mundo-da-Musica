// Tom atualmente selecionado
let tomAtual = 'C';

// Lista dos tons disponíveis
const TONS_DISPONIVEIS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'];

// Mapeia função → classe CSS da tag
const CLASSE_FUNCAO = {
  'Tônica': 'tag-tonica',
  'Subdominante': 'tag-subdominante',
  'Dominante': 'tag-dominante'
};

// Mapeia qualidade → classe CSS da tag
const CLASSE_QUALIDADE = {
  'maior': 'tag-maior',
  'menor': 'tag-menor',
  'diminuto': 'tag-diminuto'
};

// Renderiza os botões de tom no topo
function renderizarSeletorTom() {
  const container = document.querySelector('#seletor-tom');
  if (!container) return;

  container.innerHTML = TONS_DISPONIVEIS.map(tom => `
    <button class="tom-btn ${tom === tomAtual ? 'ativo' : ''}" data-tom="${tom}">
      ${tom}
    </button>
  `).join('');
}

// Configura o clique nos botões de tom
function configurarSeletorTom() {
  const botoes = document.querySelectorAll('.tom-btn');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      tomAtual = botao.dataset.tom;

      botoes.forEach(b => {
        b.classList.toggle('ativo', b === botao);
      });

      atualizarCards();
    });
  });
}

// Renderiza os 7 cards do campo harmônico
function atualizarCards() {
  const container = document.querySelector('#cards-campo');
  if (!container) return;

  const acordes = calcularCampoHarmonico(tomAtual);
  if (!acordes) {
    container.innerHTML = '<p>Tom não suportado.</p>';
    return;
  }

  container.innerHTML = acordes.map(acorde => `
    <div class="acorde-campo" data-acorde="${acorde.nome}">
      <p class="campo-grau">${acorde.grau}</p>
      <h3 class="campo-nome">${acorde.nome}</h3>
      <div class="campo-tags">
        <span class="tag ${CLASSE_FUNCAO[acorde.funcao]}">${acorde.funcao}</span>
        <span class="tag ${CLASSE_QUALIDADE[acorde.qualidade]}">${acorde.qualidade}</span>
      </div>
    </div>
  `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderizarSeletorTom();
  configurarSeletorTom();
  atualizarCards();
});