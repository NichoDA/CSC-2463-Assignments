let initTone = true;
let isMousePressed = false;

// Set up Tone
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);

let noise = new Tone.Noise('brown').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 0.1
}).connect(gain);

let noiseFilter = new Tone.Filter(5000, "lowpass").connect(noiseEnv);
noise.connect(noiseFilter);

let osc1 = new Tone.Oscillator(150, 'sine').start();
let osc1Env = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 0.1
}).connect(pan);
osc1.connect(osc1Env);

let osc2 = new Tone.Oscillator(250, 'sine').start();
let osc2Env = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 0.1
}).connect(pan);
osc2.connect(osc2Env);

let img;

function preload() {
  img = createImg('assets/probe.png');
  img.position(0,0);
  img.hide();
}

function setup() {
  createCanvas(400, 500); 
}

function draw() {
  background(220);

  if ((frameCount % 60) === 0) {
    osc1.frequency.rampTo(random(100, 300), 0.1);
    osc2.frequency.rampTo(random(500, 700), 0.1);
  }

  if (isMousePressed) {
    noiseEnv.triggerAttack();
    osc1Env.triggerAttack();
    osc2Env.triggerAttack();
  } else {
    noiseEnv.triggerRelease();
    osc1Env.triggerRelease();
    osc2Env.triggerRelease();
  }

  text('Click and hold to display UFO with sound effect', 80, 100);
}

function mousePressed() {
  console.log('pressed');
  isMousePressed = true;
  img.position(width/2 - img.width/2, height/2 - img.height/2);
  img.show();
}

function mouseReleased() { 
  console.log('released');
  isMousePressed = false;
  img.hide();
}
