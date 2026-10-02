// Configuração visual do diagrama
const DIAGRAMA = {
  largura: 120,
  altura: 150,
  margemX: 15,
  margemY: 25,
  numCasas: 4,
  numCordas: 6,
  raioBolinha: 9
};

// Desenha o SVG de um acorde
function desenharDiagrama(acorde) {
  const { largura, altura, margemX, margemY, numCasas, numCordas, raioBolinha } = DIAGRAMA;

  const larguraUtil = largura - margemX * 2;
  const alturaUtil = altura - margemY * 2;
  const espacoCordas = larguraUtil / (numCordas - 1);
  const espacoCasas = alturaUtil / numCasas;

  // Mapeia estado de cada corda (6 = mais grave, 1 = mais aguda)
  const estados = [
    acorde.corda6, acorde.corda5, acorde.corda4,
    acorde.corda3, acorde.corda2, acorde.corda1
  ];

  let svg = `<svg viewBox="0 0 ${largura} ${altura}" class="diagrama" xmlns="http://www.w3.org/2000/svg">`;

  // 1. Símbolos acima (X, O ou vazio)
  estados.forEach((estado, i) => {
    const x = margemX + i * espacoCordas;
    const y = margemY - 10;
    let simbolo = '';
    if (estado === 'muda') simbolo = 'X';
    else if (estado === 'solta') simbolo = 'O';
    if (simbolo) {
      svg += `<text x="${x}" y="${y}" text-anchor="middle" class="simbolo">${simbolo}</text>`;
    }
  });

  // 2. Linhas verticais (cordas)
  for (let i = 0; i < numCordas; i++) {
    const x = margemX + i * espacoCordas;
    svg += `<line x1="${x}" y1="${margemY}" x2="${x}" y2="${margemY + alturaUtil}" class="corda" />`;
  }

  // 3. Linhas horizontais (casas)
  for (let i = 0; i <= numCasas; i++) {
    const y = margemY + i * espacoCasas;
    const grossura = i === 0 ? 3 : 1; // pestana (linha de cima) mais grossa
    svg += `<line x1="${margemX}" y1="${y}" x2="${margemX + larguraUtil}" y2="${y}" class="casa" stroke-width="${grossura}" />`;
  }

  // 4. Bolinhas dos dedos
  acorde.dedos.forEach(dedo => {
    const indiceCorda = 6 - dedo.corda;
    const x = margemX + indiceCorda * espacoCordas;
    const y = margemY + (dedo.casa - 0.5) * espacoCasas;

    svg += `<circle cx="${x}" cy="${y}" r="${raioBolinha}" class="bolinha" />`;
    svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" class="numero-dedo">${dedo.dedo}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

// Estado atual dos filtros
const filtrosAtivos = {
  tipo: 'todos',
  dificuldade: 'todos'
};

// Aplica os filtros: esconde cards que não batem
function aplicarFiltros() {
  const cards = document.querySelectorAll('.acorde-card');

  cards.forEach(card => {
    const tipo = card.dataset.tipo;
    const dificuldade = card.dataset.dificuldade;

    const passaTipo =
      filtrosAtivos.tipo === 'todos' || filtrosAtivos.tipo === tipo;
    const passaDificuldade =
      filtrosAtivos.dificuldade === 'todos' || filtrosAtivos.dificuldade === dificuldade;

    if (passaTipo && passaDificuldade) {
      card.classList.remove('oculto');
    } else {
      card.classList.add('oculto');
    }
  });
}

// Configura os cliques dos botões de filtro
function configurarFiltros() {
  const botoes = document.querySelectorAll('.filtro-btn');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const grupo = botao.dataset.filtro;
      const valor = botao.dataset.valor;

      filtrosAtivos[grupo] = valor;

      document.querySelectorAll(`.filtro-btn[data-filtro="${grupo}"]`).forEach(b => {
        b.classList.toggle('ativo', b === botao);
      });

      aplicarFiltros();
    });
  });
}

// Configura o clique nos cards pra tocar o acorde
function configurarAudio(acordes) {
  const cards = document.querySelectorAll('.acorde-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const acorde = acordes.find(a => a.id === id);
      if (acorde) {
        tocarAcorde(acorde);
        // Feedback visual
        card.classList.add('ativo-audio');
        setTimeout(() => card.classList.remove('ativo-audio'), 300);
      }
    });
  });
}

async function renderizarAcordes() {
  try {
    const resposta = await fetch('dados/acordes.json');
    const dados = await resposta.json();

    const container = document.querySelector('#lista-acordes');
    if (!container) return;

    container.innerHTML = dados.acordes.map(acorde => `
      <div class="acorde-card" data-tipo="${acorde.tipo}" data-dificuldade="${acorde.dificuldade}" data-id="${acorde.id}">
        <h3 class="acorde-nome">${acorde.nome}</h3>
        <p class="acorde-completo">${acorde.nomeCompleto}</p>
        ${desenharDiagrama(acorde)}
        <p class="acorde-meta">
          <span class="tag tag-${acorde.tipo}">${acorde.tipo}</span>
          <span class="tag tag-${acorde.dificuldade}">${acorde.dificuldade}</span>
        </p>
      </div>
    `).join('');

    configurarFiltros();
    configurarAudio(dados.acordes);

  } catch (erro) {
    console.error('Erro ao carregar acordes:', erro);
  }
}

document.addEventListener('DOMContentLoaded', renderizarAcordes);