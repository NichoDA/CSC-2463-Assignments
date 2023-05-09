let spriteSheet;
let connectButton;
let port;
let writer, reader;
let joySwitch;
let button;
let red, green, blue;
let sensorData = {};

let lastButtonPress = 0;
const debounceDelay = 500;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

let activationState = { active: false };

const gravity = 1.5;
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}
let scrollOffset = 0;
Tone.start();

let sounds = new Tone.Players({
  "Hurt": "assets/hurt.wav",
  "Jump": "assets/Swing.mp3",
  "Walk": "assets/grass.wav",
}).toDestination();


let synth = new Tone.PolySynth({
  oscillator: {
    type: "square"
  }
}).toDestination().chain(new Tone.BitCrusher(4));

let dSynth = new Tone.PolySynth({
  oscillator: {
    type: "square"
  }
}).toDestination().chain(new Tone.BitCrusher(4));

const Startmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
},[ 'E4', 'D4', 'E4', 'F4', 'G4', 'F4', 'E4', 'D4', 'C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4', 'B4']).start("0:0"); 

const Playingmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, [null,null,'E4', 'E4', 'G4', null, 'E4', 'D4', 'C4', 'D4', 'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'F#4', 'G4', 'E4', 'D4', 'D4', 'E4', 'G4', 'A4', 'B4', 'A4']).start("0:0");

const YouLostmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, [ 'E4', 'F4', 'G4', null, 'C4', 'E4', 'G4', 'C5', null, 'G4', 'F4', 'E4', 'D4', 'C4']).start("0:0");

const YouWinmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays  
}, ['E5', 'G5', 'B5', null, 'C5', 'E5', 'G5', 'C6', null, 'G5', 'E5', 'C5', 'A4', 'G4']).start("0:0");

const GameState = {
  Start: "Start",
  Playing: "Playing",
  YouLost: "YouLost",
  YouWin: "YouWin"
};


let game = { score: 0, maxScore: 0, maxTime: 50, elapsedTime: 0, lives: 3, immunityTimer: 0, walkSoundTimer: 0, state: GameState.Start};

function preload() {
  Tone.start();
  backgroundImage = loadImage("assets/Menubg.png");
  backgroundImage.resize(400, 400);
  groundImage = loadImage("assets/ground.PNG");
  bgPlaying = loadImage("assets/backgroundPlaying.png");
  spriteSheet = loadImage("assets/character.png");
  gameOver = loadImage("assets/gameover.png");
  youWin = loadImage("assets/youwin.jpg");
  flagPole = loadImage("assets/flagpole.png");
  enemies = loadImage("assets/Enemy.png")
  heart = loadImage("assets/heart.png")
  Tone.Transport.start();
}

function setup() {
  Tone.start();
  imageMode(CENTER);
  angleMode(DEGREES);
  if ("serial" in navigator) {
    // The Web Serial API is supported
    connectButton = createButton("connect");
    connectButton.position(10, 10);
    connectButton.mousePressed(connect);
  }
  game.character = new Character(spriteSheet,80,80,100,562,8);
  game.background = new Background({x:0, y:0, image: bgPlaying});
  game.flagpole = new flag({x: 6700, y: 500, image: flagPole});
  game.enemies = [new Enemy({ x: 2400, y: 550, image: enemies}),
    new Enemy({x: 3500, y: 437, image: enemies}),
    new Enemy({x: 4650, y: 157, image: enemies}),
    new Enemy({x: 6500, y: 550, image: enemies}),];
  game.platforms =  [new Platform({x: -10, y: 650, image: groundImage}),
    new Platform({x: 195, y: 650, image: groundImage}),
    new Platform({x: 340, y: 437, image: groundImage}), // High platform over small gap
    new Platform({x: 495, y: 650, image: groundImage}),
    new Platform({x: 605, y: 650, image: groundImage}),
    new Platform({x: 810, y: 650, image: groundImage}),
    new Platform({x: 1015, y: 650, image: groundImage}),
    new Platform({x: 1220, y: 650, image: groundImage}),
    new Platform({x: 1410, y: 447, image: groundImage}), // High platform over big gab
    new Platform({x: 1630, y: 327, image: groundImage}), // extra high platform over big gap
    new Platform({x: 2040, y: 650, image: groundImage}),
    new Platform({x: 2245, y: 650, image: groundImage}),
    new Platform({x: 2450, y: 650, image: groundImage}),// possible enemy
    new Platform({x: 2655, y: 650, image: groundImage}),
    new Platform({x: 2860, y: 650, image: groundImage}),
    new Platform({x: 3000, y: 457, image: groundImage}), // high platform
    new Platform({x: 3300, y: 242, image: groundImage}), // higher platform 
    new Platform({x: 3505, y: 242, image: groundImage}), // higher platform cont 
    new Platform({x: 3295, y: 597, image: groundImage}), // lower elevated optional platform
    new Platform({x: 3600, y: 537, image: groundImage}), // middle elevagted optional with enemey poss
    new Platform({x: 4090, y: 650, image: groundImage}),
    new Platform({x: 4295, y: 650, image: groundImage}),
    new Platform({x: 4515, y: 447, image: groundImage}), // mid level plat
    new Platform({x: 4775, y: 257, image: groundImage}), // high level plat
    new Platform({x: 4775, y: 597, image: groundImage}), // low level plat
    new Platform({x: 5020, y: 447, image: groundImage}), // mid level plat
    new Platform({x: 5320, y: 650, image: groundImage}),
    new Platform({x: 5525, y: 650, image: groundImage}),
    new Platform({x: 5730, y: 650, image: groundImage}),
    new Platform({x: 5935, y: 650, image: groundImage}),
    new Platform({x: 6140, y: 650, image: groundImage}),
    new Platform({x: 6345, y: 650, image: groundImage}),
    new Platform({x: 6550, y: 650, image: groundImage}),
    new Platform({x: 6755, y: 650, image: groundImage}),
    new Platform({x: 6960, y: 650, image: groundImage}),
    new Platform({x: 7165, y: 650, image: groundImage}),
    new Platform({x: 7370, y: 650, image: groundImage}),
    new Platform({x: 7575, y: 650, image: groundImage}),
    new Platform({x: 7780, y: 650, image: groundImage}),
    new Platform({x: 7985, y: 650, image: groundImage}),
  ];
  reset();
}

function reset() {
  Tone.start();
  game.elapsedTime = 0;
  game.lives = 3;
  game.score = 0;
  scrollOffset = 0;
  game.character = new Character(spriteSheet,80,80,100,562,8);
  game.background = new Background({x:0, y:0, image: bgPlaying});
  game.flagpole = new flag({x: 6700, y: 500, image: flagPole});
  game.enemies = [new Enemy({ x: 2400, y: 550, image: enemies}),
    new Enemy({x: 3500, y: 437, image: enemies}),
    new Enemy({x: 4650, y: 157, image: enemies}),
    new Enemy({x: 6500, y: 550, image: enemies}),];
  game.platforms =  [new Platform({x: -10, y: 650, image: groundImage}),
    new Platform({x: 195, y: 650, image: groundImage}),
    new Platform({x: 340, y: 437, image: groundImage}), // High platform over small gap
    new Platform({x: 495, y: 650, image: groundImage}),
    new Platform({x: 605, y: 650, image: groundImage}),
    new Platform({x: 810, y: 650, image: groundImage}),
    new Platform({x: 1015, y: 650, image: groundImage}),
    new Platform({x: 1220, y: 650, image: groundImage}),
    new Platform({x: 1410, y: 447, image: groundImage}), // High platform over big gab
    new Platform({x: 1630, y: 327, image: groundImage}), // extra high platform over big gap
    new Platform({x: 2040, y: 650, image: groundImage}),
    new Platform({x: 2245, y: 650, image: groundImage}),
    new Platform({x: 2450, y: 650, image: groundImage}),// possible enemy
    new Platform({x: 2655, y: 650, image: groundImage}),
    new Platform({x: 2860, y: 650, image: groundImage}),
    new Platform({x: 3000, y: 457, image: groundImage}), // high platform
    new Platform({x: 3300, y: 242, image: groundImage}), // higher platform 
    new Platform({x: 3505, y: 242, image: groundImage}), // higher platform cont 
    new Platform({x: 3295, y: 597, image: groundImage}), // lower elevated optional platform
    new Platform({x: 3600, y: 537, image: groundImage}), // middle elevagted optional with enemey poss
    new Platform({x: 4090, y: 650, image: groundImage}),
    new Platform({x: 4295, y: 650, image: groundImage}),
    new Platform({x: 4515, y: 447, image: groundImage}), // mid level plat
    new Platform({x: 4775, y: 257, image: groundImage}), // high level plat
    new Platform({x: 4775, y: 597, image: groundImage}), // low level plat
    new Platform({x: 5020, y: 447, image: groundImage}), // mid level plat
    new Platform({x: 5320, y: 650, image: groundImage}),
    new Platform({x: 5525, y: 650, image: groundImage}),
    new Platform({x: 5730, y: 650, image: groundImage}),
    new Platform({x: 5935, y: 650, image: groundImage}),
    new Platform({x: 6140, y: 650, image: groundImage}),
    new Platform({x: 6345, y: 650, image: groundImage}),
    new Platform({x: 6550, y: 650, image: groundImage}),
    new Platform({x: 6755, y: 650, image: groundImage}),
    new Platform({x: 6960, y: 650, image: groundImage}),
    new Platform({x: 7165, y: 650, image: groundImage}),
    new Platform({x: 7370, y: 650, image: groundImage}),
    new Platform({x: 7575, y: 650, image: groundImage}),
    new Platform({x: 7780, y: 650, image: groundImage}),
    new Platform({x: 7985, y: 650, image: groundImage}),
  ];
}


function draw() {
  Tone.start();

  if (reader) {
    serialRead();
  }
  if (writer) {
    writer.write(encoder.encode(red + "," + green +  "," + joySwitch + "\n"))
  }

  joySwitch = sensorData.Switch;

  if (joySwitch == 0 && (millis() - lastButtonPress) > debounceDelay) {
    lastButtonPress = millis(); 
    game.character.velocity.y -= 27;
    sounds.player("Jump").start(); 
  }

  xVal = sensorData.Xaxis;
  yVal = sensorData.Yaxis;


 console.log("Switch: " + joySwitch + "Xval: " + xVal + "Yval: " + yVal);

  switch(game.state) {
    case GameState.Playing:  
      connectButton.hide();
      createCanvas(innerWidth-100, 650); 
      background("blue");

      game.background.draw();
      game.flagpole.draw();
      game.platforms.forEach(platform =>{
        platform.draw();
      });
      game.enemies.forEach(enemy =>{
        enemy.update();
      });
      game.character.update();

      if (game.immunityTimer > 0){
        game.immunityTimer--;
      }
      
      if (game.walkSoundTimer > 0){
        game.walkSoundTimer--;
      }

      for (let i = 0; i < game.lives; i ++){
        image(heart, 50 + i * 60, 50);
      }

      if ((keys.right.pressed || xVal >= 150) && game.character.position.x < 420){
        game.character.velocity.x = game.character.speed;
        game.character.xDirection = 1;
        game.character.moving =1;
      }
      else if (((keys.left.pressed || xVal <= 105) && game.character.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && game.character.position.x > 0)){
        game.character.velocity.x = -game.character.speed;
        game.character.xDirection = -1;
        game.character.moving = 1;
      }
      else{
        game.character.velocity.x = 0;

        if (keys.right.pressed || xVal >= 150){
          scrollOffset += game.character.speed;
          game.background.position.x -= game.character.speed * .60;
          game.flagpole.position.x -= game.character.speed;
          game.platforms.forEach(platform =>{
            platform.position.x -= game.character.speed;
          });
          game.enemies.forEach(enemy =>{
            enemy.position.x -= game.character.speed;
          });
          game.character.xDirection = 1;
          game.character.moving = 1; 
        }

        else if ((keys.left.pressed || xVal <= 105) && scrollOffset > 0){
          scrollOffset -= game.character.speed;
          game.background.position.x += game.character.speed * .60;
          game.flagpole.position.x += game.character.speed;
          game.platforms.forEach(platform =>{
            platform.position.x += game.character.speed;
          });
          game.enemies.forEach(enemy =>{
            enemy.position.x += game.character.speed;
          });
          game.character.xDirection = -1;  
          game.character.moving = 1;
        }
        else{
          game.character.currentFrame = 0 ; 
        }
      }



      game.platforms.forEach(platform =>{
        if (game.character.position.y + game.character.height <= platform.position.y
          && game.character.position.y + game.character.height + game.character.velocity.y >= platform.position.y 
          && game.character.position.x + game.character.width >= platform.position.x 
          && game.character.position.x <= platform.position.x + platform.width){
          game.character.velocity.y = 0; 
          if (game.walkSoundTimer === 0 && (keys.left.pressed || keys.right.pressed ||  xVal >= 150||xVal <= 105 )) { 
            game.walkSoundTimer = 15;
            sounds.player("Walk").start();
          }
        }
      });

      game.enemies.forEach(enemy => {
        if (game.character.position.x + game.character.width >= enemy.position.x + 98 &&
            game.character.position.x <= enemy.position.x + enemy.width &&
            game.character.position.y + game.character.height >= enemy.position.y &&
            game.character.position.y <= enemy.position.y + enemy.height) {
              if (game.immunityTimer === 0) { 
                game.lives -= 1;
                game.immunityTimer = 60;
                sounds.player("Hurt").start();
              }
        }
      });      

      fill('black');
      textSize(35);
      let currentTime = game.maxTime - game.elapsedTime;
      text("Time left: " + ceil(currentTime), innerWidth-200, 40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime <= 30 && currentTime >= 20 ){
        serialWrite(new String("HIGH"));
      }
      else{
        serialWrite(new String("LOW"));
      }

    
      if (currentTime <= 0){
        game.state = GameState.YouLost;
      }

      if (game.character.position.y > innerHeight){
        game.score = round((scrollOffset * 10));
        game.state = GameState.YouLost;
      }

      if (scrollOffset > 6500){
        game.score = round((10 * currentTime) + (scrollOffset * 10) + (game.lives * 100));
        game.state = GameState.YouWin;
      } 

      if (game.lives === 0){
        game.score = round((scrollOffset * 10));
        game.state = GameState.YouLost;
      }

      if (game.score > game.maxScore){
        game.maxScore = game.score
      }
      break;

    case GameState.YouLost:
      createCanvas(600, 600); 
      background('#269471');
      image(gameOver, 300, 200);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      textSize(18);
      text("Press any key to return to menu", 300, 470);
      textSize(35);
      text("High Score: " + game.maxScore,300,440);
      break;

    case GameState.YouWin:
      createCanvas(600, 600); 
      image(youWin, 300, 300);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("You Won!",300,200);
      textSize(18);
      text("Press any key to return to menu", 300, 350);
      textSize(35);
      text("Score: " + game.score,300,270);
      text("High Score: " + game.maxScore,300,320);
      break;

    case GameState.Start:
      connectButton.show();
      createCanvas(600, 600); 
      image(backgroundImage, 0, 0);
      fill('white');
      textSize(45);
      textAlign(CENTER);
      text("Ghost Runner",300,200);
      textSize(35);
      text("High Score: " + game.maxScore,300,250);
      textSize(30);
      text("Press Any Key to Start",300,300);
      break;
  }

  if (game.state === GameState.Start) {
    if (!Startmelody.isPlaying) {
      Startmelody.start();
    }
    Playingmelody.stop();
    YouLostmelody.stop();
    YouWinmelody.stop();

  } else if (game.state === GameState.Playing) {
    if (!Playingmelody.isPlaying) {
      Playingmelody.start();
    }
    Startmelody.stop(); 
    YouLostmelody.stop();
    YouWinmelody.stop();

  } else if (game.state === GameState.YouLost) {
    if (!YouLostmelody.isPlaying) {
      YouLostmelody.start();
    }
    Playingmelody.stop();
    Startmelody.stop();
    YouWinmelody.stop();  
  }

 else if (game.state === GameState.YouWin) {
    if (!YouWinmelody.isPlaying) {
      YouWinmelody.start();
    }
    Playingmelody.stop();
    Startmelody.stop();
    YouLostmelody.stop();
  }
}

function serialWrite(str) {
  if (writer) {
    writer.write(encoder.encode(str + "\n"));
  }
}

async function serialRead() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
   //  console.log(value);
    sensorData = JSON.parse(value);
  }
 }

 async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });
 
  writer = port.writable.getWriter();
 
  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
 }
 

function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.YouLost:
      game.state = GameState.Start;
      reset();
      break;
    case GameState.YouWin:
      game.state = GameState.Start;
      reset();
      break;
  }
}

addEventListener('keydown', ({keyCode}) =>{
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break; 
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 87:
      if ((millis() - lastButtonPress) > debounceDelay){
        lastButtonPress = millis(); 
        game.character.velocity.y -= 27;
        sounds.player("Jump").start();
        break;
      }
  }
})

addEventListener('keyup', ({keyCode}) =>{
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      game.character.moving = 0;
      game.character.currentFrame = 1;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      game.character.moving = 0;
      game.character.currentFrame = 1; 
      break;
    case 87:
      game.character.velocity.y = 0;
      break;
  }
})


class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }
 
  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }
 
  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
 }

 class Character {
  constructor(spritesheet, width, height, x, y, animationLength, offsetX = 0, offsetY = 0){
    this.moving = 0;
    this.spritesheet = spritesheet;
    this.position = {
      x,
      y
    }
    this.speed = 7.5;
    this.velocity = {
      x: 0,
      y: 5
    } 
    this.width = width;
    this.height = height;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.position.x, this.position.y);
    scale(this.xDirection, 1);
    image(this.spritesheet, 0, 0, this.width, this.height, this.u * this.width + this.offsetX, this.v * this.height + this.offsetY, this.width, this.height);
    pop();

    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }
  }

  update () {
    this.draw()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y +this.height + this.velocity.y <= innerHeight){
      this. velocity.y += gravity;
    }
  }
}

class Platform{
  constructor ({x, y, image}){
    this.position = {
      x,
      y
    }

    this.image = image;

    this.width = 157;
    this.height = image.height;

  }

  draw(){
    image(this.image, this.position.x + 35, this.position.y - 22 );
  }
}

class Enemy {
  constructor({ x, y, image }) {
    this.counter = 0;
    this.position = {
      x,
      y
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;

    this.direction = 1; 
    this.speed = 2; 
  }

  draw() {
    push(); // Save the current drawing state
    if (this.direction === -1) {
      // Flip the image horizontally when moving to the left
      translate(this.position.x + this.width, this.position.y);
      scale(-1, 1);
      image(this.image, 0, 0);
    } else {
      image(this.image, this.position.x, this.position.y);
    }
    pop(); 
  }

  update() {
    this.draw()
    this.position.x += this.direction * this.speed;
    this.counter += this.speed;

    if (this.counter >= 400){
      this.direction *= -1;
      this.counter = 0;
      this.position.x += this.direction * this.width * 0.8;
    }
  }
}


class Background{
  constructor ({x, y, image}){
    this.position = {
      x,
      y
    }
    this.image = image;

    this.width = innerHeight;
    this.height = image.height;
  }

  draw(){
    image(this.image, this.position.x, this.position.y);
  }
}

class flag{
  constructor ({x, y, image}){
    this.position = {
      x,
      y
    }
    this.image = image;

    this.width = innerHeight;
    this.height = image.height;
  }

  draw(){
    image(this.image, this.position.x, this.position.y);
  }
}