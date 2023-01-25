

let sprite_sheet;
let EskimoAni;
let Eskimo;

function preload() {
  sprite_sheet = loadSpriteSheet('Eskimo.png', 80, 80, 4);
  EskimoAni = loadAnimation(sprite_sheet);
}

function setup() {
  createCanvas(400, 400);
  Eskimo = createSprite(200, 200, 80, 80);
  Eskimo.addAnimation("EskimoAni", EskimoAni);
}

function draw() {
  clear();
  drawSprites();
}
