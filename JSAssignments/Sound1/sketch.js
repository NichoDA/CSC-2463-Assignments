let sounds = new Tone.Players({
  "Coin": "sounds/coin.wav",
  "Jump": "sounds/jump.wav",
  "Game Over": "sounds/gameOver.wav",
  "Upgrade": "sounds/upgrade.ogg",
  "Success": "sounds/success.wav"
}).toDestination();

let pitchShift = new Tone.PitchShift(0);
let volume = new Tone.Gain(6);
sounds.chain(pitchShift, volume, Tone.Destination);

let soundNames = ["Coin", "Upgrade", "Success", "Jump", "Game Over"];
let buttons = [];

let pSlider;
let vSlider;

function setup() {
  createCanvas(400, 400);

  soundNames.forEach((word, index) => {
    buttons[index] = createButton(word);
    buttons[index].position(index, index*50);
    buttons[index].mousePressed(() => buttonSound(word))
  })

  pSlider = createSlider(-12, 12, 0, 1);
  pSlider.mouseReleased(() => {
    pitchShift.pitch = pSlider.value();
  })

  vSlider = createSlider(0, 12, 6, 1);
  vSlider.mouseReleased(() => {
    volume.gain.value = (vSlider.value());
  })
}

function draw() {
  background(220, 120, 180);
  fill (225);
  text('Press the buttons for sound', 5, 300);
  textSize(16);
  text("Pitch", 5, 370);
  text("Volume", 140, 370);
  text("-                       +", 8, 390)
  text(" -                      +", 140, 390)
}

function buttonSound(whichSound) {
  sounds.player(whichSound).start();
}
