let slider;
let slider2;

const brick = new Tone.NoiseSynth({
  "volume": -10,
  "envelope": {
    "attack": 0.001,
    "decay": 0.1,
    "sustain": 0,
    "release": 0.1
  }
});

const filter = new Tone.Filter({
  "type": "lowpass",
  "frequency": 1000,
  "rolloff": -12,
  "Q": 1,
  "gain": 0
});

const delay = new Tone.FeedbackDelay({
  delayTime: 0.25,
  feedback: 0.5,
  wet: 0.5
});

const reverb = new Tone.JCReverb(0.4);

const synthEffects = new Tone.Gain(); // create separate effects chain for synth
synthEffects.connect(delay);
delay.connect(reverb);
reverb.toDestination();

brick.connect(Tone.Destination);

const osc = new Tone.OmniOscillator("C#4", "pwm").start();

const ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.5,
  decay: 0.6,
  sustain: 0.3,
  release: 0.2
});

let notes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5'
};

const synth = new Tone.DuoSynth();
synth.connect(synthEffects);

function setup() {
  createCanvas(400, 400);
  
  // create and connect brick sound button
  const brickButton = document.querySelector("#brick-button");
  brickButton.addEventListener("click", () => {
    brick.triggerAttackRelease("8n");
  });

  // create and connect sliders
  slider = new Nexus.Slider("#slider", {
    'size': [200, 20],
    'min': 0.1,
    'max': 0.9,
    'step': 0.1
  });
  slider2 = new Nexus.Slider("#slider2", {
    'size': [200, 20],
    'min': -12,
    'max': 12,
    'step': 1
  });

  slider.on('change', (v) =>  {
    reverb.roomSize.value = v;
  }); 

  slider2.on('change', (v) => {
    synth.volume.value = v; // adjust synth volume
  });
}


function keyPressed() {
  let whatNote = notes[key];
  synth.harmonicity.value = 0.3;
  synth.triggerAttackRelease(whatNote, "8n");
}
