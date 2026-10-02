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
  // 1. Cria/reutiliza o AudioContext
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const agora = audioContext.currentTime;
  const duracao = 1.5; // segundos

  // 2. Monta a lista de estados das cordas
  const estados = [
    acorde.corda6, acorde.corda5, acorde.corda4,
    acorde.corda3, acorde.corda2, acorde.corda1
  ];

  // 3. Pra cada corda, se não for "muda", toca
  estados.forEach((estado, i) => {
    const numeroCorda = 6 - i; // i=0 → corda 6, i=5 → corda 1

    // Corda muda: não toca
    if (estado === 'muda') return;

    // Descobre a frequência
    let frequencia;
    if (estado === 'solta') {
      frequencia = CORDA_SOLTA[numeroCorda];
    } else {
      // estado é um número (casa)
      frequencia = CORDA_SOLTA[numeroCorda] * Math.pow(SEMITOM, estado);
    }

    // 4. Cria o oscilador
    const oscilador = audioContext.createOscillator();
    oscilador.type = 'triangle'; // som mais suave que "sine" ou "sawtooth"
    oscilador.frequency.value = frequencia;

    // 5. Cria o controle de volume (envelope)
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0, agora);
    gain.gain.linearRampToValueAtTime(0.15, agora + 0.02); // ataque
    gain.gain.exponentialRampToValueAtTime(0.001, agora + duracao); // decay

    // 6. Conecta: oscilador → gain → saída
    oscilador.connect(gain);
    gain.connect(audioContext.destination);

    // 7. Toca e para
    oscilador.start(agora);
    oscilador.stop(agora + duracao);
  });
}