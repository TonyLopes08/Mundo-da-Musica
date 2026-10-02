# 🎵 Mundo da Música

Site educativo sobre música, feito com HTML, CSS e JavaScript puro.

O projeto reúne conteúdo para quem está começando a aprender música — instrumentos, teoria, cifras — e oferece um dicionário de acordes interativo com diagramas do braço do violão e áudio gerado em tempo real.

---

## ✨ Funcionalidades

- **Instrumentos:** apresentação de contrabaixo, guitarra, bateria e violão, com imagem e descrição do papel de cada um.
- **Teoria musical:** notas, escala maior, acordes (tríades) e compasso, com tabelas de apoio.
- **Cifras:** introdução ao conceito de cifra, tabela de acordes e exemplo de progressão.
- **Dicionário de acordes (interativo):**
  - Diagrama do braço do violão desenhado em SVG
  - Filtros por tipo (maior/menor) e dificuldade (iniciante/intermediário)
  - Áudio do acorde gerado em tempo real com Web Audio API

---

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** com Flexbox e Grid, responsivo
- **JavaScript** puro (sem frameworks)
  - Renderização dinâmica de conteúdo
  - SVG gerado programaticamente
  - Web Audio API para síntese de som
- **JSON** como fonte de dados (conteúdo separado da estrutura)

---

## 🚀 Como rodar localmente

O projeto precisa de um servidor local porque usa fetch() para carregar os JSONs. Abrir o index.html direto no navegador não funciona (erro de CORS).

### Requisitos

- Python 3 (para rodar o servidor)
- Navegador moderno (Chrome, Firefox, Edge)

### Passos

1. Clone o repositório:

   git clone https://github.com/TonyLopes08/Mundo-da-Musica.git
   cd Mundo-da-Musica

2. Inicie um servidor local:

   python -m http.server 8080

3. Abra no navegador:

   http://localhost:8080

4. Para parar o servidor: Ctrl + C

Nota: em alguns Windows, a porta 8000 está reservada pelo sistema. Use a 8080.

---

## 📁 Estrutura do projeto

Mundo-da-Musica/
├── index.html                 # Página inicial
├── instrumentos.html          # Lista de instrumentos
├── teoria.html                # Teoria musical
├── cifra.html                 # Cifras
├── acordes.html               # Dicionário de acordes (interativo)
├── css/
│   └── style.css              # Estilo único do site
├── js/
│   ├── render-instrumentos.js # Renderiza instrumentos a partir do JSON
│   ├── render-teoria.js       # Renderiza teoria a partir do JSON
│   ├── render-cifras.js       # Renderiza cifras a partir do JSON
│   ├── render-acordes.js      # Renderiza acordes + diagrama SVG + filtros
│   └── audio.js               # Síntese de som com Web Audio API
└── dados/
    ├── instrumentos.json      # Dados dos instrumentos
    ├── teoria.json            # Dados da teoria
    ├── cifras.json            # Dados das cifras
    └── acordes.json           # Dados dos acordes

---

## 🎯 Como adicionar conteúdo

Graças à arquitetura com JSON, adicionar conteúdo é simples:

- **Novo instrumento:** adicione um objeto em dados/instrumentos.json
- **Nova seção de teoria:** adicione um objeto em dados/teoria.json
- **Novo acorde:** adicione um objeto em dados/acordes.json com as posições dos dedos
- **Nova cifra:** adicione um objeto em dados/cifras.json

O JS renderiza tudo automaticamente. Não precisa tocar no HTML.

---

## 🗺️ Próximos passos

- [ ] Calculadora de campo harmônico (escolher tom, ver acordes que combinam)
- [ ] Progressões famosas com reprodução (I-V-vi-IV, ii-V-I)
- [ ] Mais acordes no dicionário (sétimas, suspensos, com nona)
- [ ] Biblioteca de cifras com busca e transposição de tom
- [ ] Metrônomo e afinação de referência
- [ ] Modo de progresso: marcar lições estudadas

---

## 👤 Autor

**Tony Lopes**
- GitHub: [@TonyLopes08](https://github.com/TonyLopes08)

---

## 📄 Licença

Este projeto é de uso educacional. Sinta-se livre para estudar, adaptar e usar como referência.