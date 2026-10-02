// Tom atualmente selecionado
let tomAtual = 'C';

// Lista dos tons disponíveis (mesma do campo-harmonico.js)
const TONS_DISPONIVEIS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'];

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

      // Atualiza visual: só o botão clicado fica ativo
      botoes.forEach(b => {
        b.classList.toggle('ativo', b === botao);
      });

      // No 3.2.2 isso vai atualizar os cards:
      atualizarCards();
    });
  });
}

// Placeholder — no 3.2.2 vamos implementar
function atualizarCards() {
  console.log('Tom selecionado:', tomAtual);
  // Aqui vai entrar a lógica de calcular e renderizar os 7 acordes
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderizarSeletorTom();
  configurarSeletorTom();
});