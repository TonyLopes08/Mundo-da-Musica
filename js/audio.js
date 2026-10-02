// Contexto do Web Audio (criado sob demanda pra evitar aviso do navegador)
let audioContext = null;

// Frequências das cordas soltas (afinação padrão, 6ª a 1ª)
const CORDA_SOLTA = {
  6: 82.41,   // E2
  5: 110.00,  // A2
  4: 146.83,  // D3
  3: 196.00,  // G3
  2: 246.94,  // B3
  1: 329.63   // E4
};

// Multiplicador de semitom
const SEMITOM = Math.pow(2, 1 / 12);

// Toca um acorde
function tocarAcorde(acorde) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const agora = audioContext.currentTime;
  const duracao = 1.5;

  const estados = [
    acorde.corda6, acorde.corda5, acorde.corda4,
    acorde.corda3, acorde.corda2, acorde.corda1
  ];

  estados.forEach((estado, i) => {
    const numeroCorda = 6 - i;

    if (estado === 'muda') return;

    let frequencia;
    if (estado === 'solta') {
      frequencia = CORDA_SOLTA[numeroCorda];
    } else {
      frequencia = CORDA_SOLTA[numeroCorda] * Math.pow(SEMITOM, estado);
    }

    const oscilador = audioContext.createOscillator();
    oscilador.type = 'triangle';
    oscilador.frequency.value = frequencia;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0, agora);
    gain.gain.linearRampToValueAtTime(0.15, agora + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + duracao);

    oscilador.connect(gain);
    gain.connect(audioContext.destination);

    oscilador.start(agora);
    oscilador.stop(agora + duracao);
  });
}

// Toca um acorde a partir de notas calculadas (campo harmônico)
function tocarNotas(indicesNotas, oitavaBase = 4) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const agora = audioContext.currentTime;
  const duracao = 1.5;

  const frequenciaBase = 261.63 * Math.pow(2, oitavaBase - 4);

  indicesNotas.forEach(indice => {
    const frequencia = frequenciaBase * Math.pow(SEMITOM, indice);

    const oscilador = audioContext.createOscillator();
    oscilador.type = 'triangle';
    oscilador.frequency.value = frequencia;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0, agora);
    gain.gain.linearRampToValueAtTime(0.12, agora + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + duracao);

    oscilador.connect(gain);
    gain.connect(audioContext.destination);

    oscilador.start(agora);
    oscilador.stop(agora + duracao);
  });
}

// Calcula as notas de um acorde a partir de grau + tom
function calcularNotasAcorde(tomBase, posicaoNaEscala, qualidade) {
  const info = TONS[tomBase];
  if (!info) return null;

  const indiceTonica = (info.indice + INTERVALOS_MAIOR[posicaoNaEscala]) % 12;

  const INTERVALOS_ACORDE = {
    'maior': [0, 4, 7],
    'menor': [0, 3, 7],
    'diminuto': [0, 3, 6]
  };

  const intervalos = INTERVALOS_ACORDE[qualidade];
  if (!intervalos) return null;

  return intervalos.map(i => (indiceTonica + i) % 12);
}