// Tom atualmente selecionado
let tomAtual = 'C';

// Lista de IDs de acordes que existem no dicionário
let acordesDoDicionario = [];

// Lista de progressões carregadas do JSON
let progressoesCarregadas = [];

// Timer da progressão atual (pra poder cancelar se clicar em outra)
let timerProgressao = null;

// Lista dos tons disponíveis
const TONS_DISPONIVEIS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'];

// Tempo de cada acorde na progressão (em milissegundos)
const TEMPO_POR_ACORDE = 1500;

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

// Carrega os acordes do dicionário
async function carregarAcordesDoDicionario() {
  try {
    const resposta = await fetch('dados/acordes.json');
    const dados = await resposta.json();
    acordesDoDicionario = dados.acordes.map(a => a.nome);
  } catch (erro) {
    console.error('Erro ao carregar dicionário:', erro);
  }
}

// Carrega as progressões do JSON
async function carregarProgressoes() {
  try {
    const resposta = await fetch('dados/progressoes.json');
    const dados = await resposta.json();
    progressoesCarregadas = dados.progressoes;
  } catch (erro) {
    console.error('Erro ao carregar progressões:', erro);
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
      renderizarProgressoes(); // atualiza as progressões pro novo tom
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
    const existeNoDicionario = acordesDoDicionario.includes(acorde.nome);

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

// Renderiza os cards de progressões
function renderizarProgressoes() {
  const container = document.querySelector('#lista-progressoes');
  if (!container) return;

  const acordes = calcularCampoHarmonico(tomAtual);
  if (!acordes) return;

  container.innerHTML = progressoesCarregadas.map(prog => {
    // Monta a sequência de acordes dessa progressão no tom atual
    const sequencia = prog.graus.map(g => acordes[g].nome).join(' → ');

    return `
      <div class="progressao-card">
        <div class="progressao-header">
          <h3 class="progressao-nome">${prog.nome}</h3>
          <button class="btn-tocar" data-id="${prog.id}" title="Tocar progressão">
            ▶
          </button>
        </div>
        <p class="progressao-apelido">${prog.apelido}</p>
        <p class="progressao-sequencia">Em ${tomAtual}: ${sequencia}</p>
        <ul class="progressao-exemplos">
          ${prog.exemplos.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');

  configurarBotoesTocar();
}

// Configura o clique nos botões de tocar progressão
function configurarBotoesTocar() {
  const botoes = document.querySelectorAll('.btn-tocar');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.dataset.id;
      const prog = progressoesCarregadas.find(p => p.id === id);
      if (prog) tocarProgressao(prog);
    });
  });
}

// Toca uma progressão em sequência, acendendo os cards em sincronia
function tocarProgressao(prog) {
  // Cancela qualquer progressão que esteja tocando
  if (timerProgressao) {
    clearTimeout(timerProgressao);
    timerProgressao = null;
  }

  // Apaga o destaque de todos os cards
  document.querySelectorAll('.acorde-campo').forEach(card => {
    card.classList.remove('tocando');
  });

  const acordes = calcularCampoHarmonico(tomAtual);
  if (!acordes) return;

  prog.graus.forEach((grau, i) => {
    setTimeout(() => {
      // Acende o card correspondente
      const card = document.querySelector(`.acorde-campo[data-posicao="${grau}"]`);
      if (card) {
        card.classList.add('tocando');
        setTimeout(() => card.classList.remove('tocando'), TEMPO_POR_ACORDE * 0.8);
      }

      // Toca o acorde
      const acorde = acordes[grau];
      const notas = calcularNotasAcorde(tomAtual, grau, acorde.qualidade);
      if (notas) tocarNotas(notas, 4);
    }, i * TEMPO_POR_ACORDE);
  });

  // Guarda o timer do último acorde pra poder cancelar
  timerProgressao = setTimeout(() => {
    timerProgressao = null;
  }, prog.graus.length * TEMPO_POR_ACORDE);
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await carregarAcordesDoDicionario();
  await carregarProgressoes();
  renderizarSeletorTom();
  configurarSeletorTom();
  atualizarCards();
  renderizarProgressoes();
});