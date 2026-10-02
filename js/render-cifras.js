async function renderizarCifras() {
  try {
    const resposta = await fetch('dados/cifras.json');
    const dados = await resposta.json();

    const container = document.querySelector('#conteudo-cifras');
    if (!container) return;

    container.innerHTML = dados.secoes.map(secao => {
      let html = `
        <div class="topico">
          <h2 class="titulo">${secao.titulo}</h2>
      `;

      // Texto principal
      if (secao.conteudo) {
        html += `<p>${secao.conteudo}</p>`;
      }

      // Se a ordem for "texto-antes" (padrão), a tabela vem depois do texto
      const tabelaAntes = secao.ordem === 'tabela-antes';

      // Tabela (antes ou depois do texto final)
      const tabelaHTML = secao.tabela ? `
        <div class="rolagem">
          <table>
            <tr>${secao.tabela.cabecalho.map(c => `<th>${c}</th>`).join('')}</tr>
            ${secao.tabela.linhas.map(linha =>
              `<tr>${linha.map(celula => `<td>${celula}</td>`).join('')}</tr>`
            ).join('')}
          </table>
        </div>
      ` : '';

      if (tabelaAntes) html += tabelaHTML;

      // Progressão de exemplo (o <pre>)
      if (secao.progressao) {
        html += `<pre class="cifra-exemplo">${secao.progressao}</pre>`;
      }

      if (!tabelaAntes) html += tabelaHTML;

      html += `</div>`;
      return html;
    }).join('');

  } catch (erro) {
    console.error('Erro ao carregar cifras:', erro);
  }
}

document.addEventListener('DOMContentLoaded', renderizarCifras);  