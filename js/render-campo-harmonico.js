// Tom atualmente selecionado
let tomAtual = 'C';

// Lista de IDs de acordes que existem no dicionário
let acordesDoDicionario = [];

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

// Carrega os acordes do dicionário pra saber quais existem
async function carregarAcordesDoDicionario() {
  try {
    const resposta = await fetch('dados/acordes.json');
    const dados = await resposta.json();
    acordesDoDicionario = dados.acordes.map(a => a.nome);
  } catch (erro) {
    console.error('Erro ao carregar dicionário:', erro);
  }
}

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

// Configura o clique nos cards pra tocar o acorde
function configurarAudioCampo() {
  const cards = document.querySelectorAll('.acorde-campo');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const posicao = parseInt(card.dataset.posicao);
      const qualidade = card.dataset.qualidade;

      const notas = calcularNotasAcorde(tomAtual, posicao, qualidade);
      if (notas) {
        tocarNotas(notas, 4);
        card.classList.add('ativo-audio');
        setTimeout(() => card.classList.remove('ativo-audio'), 300);
      }
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

  container.innerHTML = acordes.map((acorde, i) => {
    // Verifica se esse acorde existe no dicionário (pelo nome)
    const existeNoDicionario = acordesDoDicionario.includes(acorde.nome);

    // Botão "ver no dicionário" só aparece se existir
    const botaoDicionario = existeNoDicionario
      ? `<a href="acordes.html?acorde=${encodeURIComponent(acorde.nome)}"
            class="btn-dicionario"
            title="Ver no dicionário"
            onclick="event.stopPropagation()">🔍</a>`
      : '';

    return `
      <div class="acorde-campo"
           data-acorde="${acorde.nome}"
           data-posicao="${i}"
           data-qualidade="${acorde.qualidade}">
        ${botaoDicionario}
        <p class="campo-grau">${acorde.grau}</p>
        <h3 class="campo-nome">${acorde.nome}</h3>
        <div class="campo-tags">
          <span class="tag ${CLASSE_FUNCAO[acorde.funcao]}">${acorde.funcao}</span>
          <span class="tag ${CLASSE_QUALIDADE[acorde.qualidade]}">${acorde.qualidade}</span>
        </div>
      </div>
    `;
  }).join('');

  configurarAudioCampo();
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await carregarAcordesDoDicionario();
  renderizarSeletorTom();
  configurarSeletorTom();
  atualizarCards();
});