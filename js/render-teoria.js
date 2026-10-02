// Carrega o JSON de teoria e renderiza as seções
async function renderizarTeoria() {
  try {
    const resposta = await fetch('dados/teoria.json');
    const dados = await resposta.json();

    const container = document.querySelector('#conteudo-teoria');
    if (!container) return;

    container.innerHTML = dados.secoes.map(secao => {
      // Monta o HTML de cada seção
      let html = `
        <div class="topico">
          <h2 class="titulo">${secao.titulo}</h2>
          <p>${secao.conteudo}</p>
      `;

      // Se tiver tabela, adiciona
      if (secao.tabela) {
        html += `
          <div class="rolagem">
            <table>
              <tr>${secao.tabela.cabecalho.map(c => `<th>${c}</th>`).join('')}</tr>
              ${secao.tabela.linhas.map(linha =>
                `<tr>${linha.map(celula => `<td>${celula}</td>`).join('')}</tr>`
              ).join('')}
            </table>
          </div>
        `;
      }

      // Se tiver lista, adiciona
      if (secao.lista) {
        html += `
          <ul>
            ${secao.lista.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      }

      // Se tiver conteúdo final (depois da lista), adiciona
      if (secao.conteudoFinal) {
        html += `<p>${secao.conteudoFinal}</p>`;
      }

      html += `</div>`;
      return html;
    }).join('');

  } catch (erro) {
    console.error('Erro ao carregar teoria:', erro);
  }
}

document.addEventListener('DOMContentLoaded', renderizarTeoria);