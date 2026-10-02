// ============================================================
// NOTAS CROMÁTICAS
// ============================================================

// Nomes com sustenido (índice 0 a 11)
const CROMATICA_SUSTENIDO = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Nomes com bemol (índice 0 a 11)
const CROMATICA_BEMOL = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
];

// ============================================================
// TONS SUPORTADOS
// ============================================================

// Cada tom tem: índice cromático e preferência de notação
const TONS = {
  'C':  { indice: 0,  notacao: 'natural' },
  'G':  { indice: 7,  notacao: 'sustenido' },
  'D':  { indice: 2,  notacao: 'sustenido' },
  'A':  { indice: 9,  notacao: 'sustenido' },
  'E':  { indice: 4,  notacao: 'sustenido' },
  'F':  { indice: 5,  notacao: 'bemol' },
  'Bb': { indice: 10, notacao: 'bemol' }
};

// ============================================================
// INTERVALOS DA ESCALA MAIOR
// ============================================================

const INTERVALOS_MAIOR = [0, 2, 4, 5, 7, 9, 11];

// ============================================================
// PADRÃO DO CAMPO HARMÔNICO MAIOR
// ============================================================

// Grau, sufixo do acorde, qualidade, função harmônica
const GRAUS = [
  { grau: 'I',    sufixo: '',    qualidade: 'maior',     funcao: 'Tônica' },
  { grau: 'ii',   sufixo: 'm',   qualidade: 'menor',     funcao: 'Subdominante' },
  { grau: 'iii',  sufixo: 'm',   qualidade: 'menor',     funcao: 'Tônica' },
  { grau: 'IV',   sufixo: '',    qualidade: 'maior',     funcao: 'Subdominante' },
  { grau: 'V',    sufixo: '',    qualidade: 'maior',     funcao: 'Dominante' },
  { grau: 'vi',   sufixo: 'm',   qualidade: 'menor',     funcao: 'Tônica' },
  { grau: 'vii°', sufixo: 'dim', qualidade: 'diminuto',  funcao: 'Dominante' }
];

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

// Recebe o nome de um tom (ex: "C", "G", "Bb")
// Retorna um array com os 7 acordes do campo harmônico
function calcularCampoHarmonico(tom) {
  const info = TONS[tom];
  if (!info) return null;

  // Escolhe a tabela cromática correta
  let tabela;
  if (info.notacao === 'bemol') {
    tabela = CROMATICA_BEMOL;
  } else {
    tabela = CROMATICA_SUSTENIDO;
  }

  // Calcula as 7 notas da escala maior
  const escala = INTERVALOS_MAIOR.map(intervalo => {
    const indice = (info.indice + intervalo) % 12;
    return tabela[indice];
  });

  // Monta os 7 acordes do campo harmônico
  return GRAUS.map((g, i) => ({
    grau: g.grau,
    nota: escala[i],
    nome: escala[i] + g.sufixo,
    qualidade: g.qualidade,
    funcao: g.funcao
  }));
}