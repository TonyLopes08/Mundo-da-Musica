# 🎵 Mundo da Música

Site educativo sobre música, feito com HTML, CSS e JavaScript puro.

A ideia é ensinar teoria musical, instrumentos e cifras de forma simples, com
ferramentas interativas que o usuário pode usar enquanto estuda.

## ✨ O que tem no site

- **Instrumentos:** apresentação do contrabaixo, guitarra, bateria e violão.
- **Teoria musical:** notas, escala maior, acordes e compasso.
- **Cifras:** o que é uma cifra, como ler acordes e uma progressão de exemplo.
- **Dicionário de acordes interativo:** 10 acordes com diagrama do braço do violão
  em SVG, filtros por tipo e dificuldade, e áudio tocado em tempo real ao clicar.

## 🎸 Diferenciais

- **Diagrama SVG dinâmico** do braço do violão, gerado a partir dos dados.
- **Áudio em tempo real** com Web Audio API — sem arquivos de som.
- **Conteúdo separado em JSON** — fácil de expandir sem tocar no HTML.
- **Sem frameworks, sem dependências.** Só HTML, CSS e JS.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (Flexbox, Grid, responsivo)
- JavaScript (ES6+, async/await, Web Audio API, SVG dinâmico)
- JSON para conteúdo
- Git + GitHub para versionamento

## 📁 Estrutura
.
├── index.html # Página inicial
├── instrumentos.html # Instrumentos musicais
├── teoria.html # Teoria musical
├── cifra.html # Cifras
├── acordes.html # Dicionário de acordes (interativo)
├── css/
│ └── style.css # Estilos
├── js/
│ ├── audio.js # Web Audio API
│ ├── render-instrumentos.js
│ ├── render-teoria.js
│ ├── render-cifras.js
│ └── render-acordes.js
└── dados/
├── instrumentos.json
├── teoria.json
├── cifras.json
└── acordes.json
