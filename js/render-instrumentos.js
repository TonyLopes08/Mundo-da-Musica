// Carrega o JSON de instrumentos e renderiza na página
async function renderizarInstrumentos() {
  try {
    // 1. Busca o JSON
    const resposta = await fetch('dados/instrumentos.json');
    const instrumentos = await resposta.json();

    // 2. Pega o container no HTML
    const lista = document.querySelector('#lista-instrumentos');
    if (!lista) return; // se não existe nessa página, sai

    // 3. Monta o HTML de cada instrumento
    lista.innerHTML = instrumentos.map(item => `
      <li>
        <p class="lista-item">${item.nome}</p>
        <p>${item.descricao}</p>
        <img src="${item.imagem}" width="150" height="100" alt="${item.alt}">
      </li>
    `).join('');

  } catch (erro) {
    console.error('Erro ao carregar instrumentos:', erro);
  }
}

// Roda quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', renderizarInstrumentos);