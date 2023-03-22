let spriteSheet;
let walkingAnimation;

let sounds = new Tone.Players({
  "Squish": "assets/Squish.wav",
}).toDestination();

let spriteSheetFilenames = ["Bug.png"];
let spriteSheets = [];
let animations = [];

let synth = new Tone.PolySynth().toDestination();
let dSynth = new Tone.PolySynth().toDestination();

const Startmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
},[ 'C4', 'D4', 'E4', 'F4','G4', 'A4', 'B4', 'C5']).start("0:0"); 

const Playingmelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, ['E5', 'D5', 'C5', null, 'D5', 'E5', 'E5', 'E5', null]).start("0:0");

const GameOvermelody = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, [ 'C5', 'B4', 'A4', 'G4','F4', 'E4', 'D4', 'C4']).start("0:0");




const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};


let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 30, state: GameState.Start, targetSprite: 0};

function preload() {
  Tone.start();
  for(let i=0; i < spriteSheetFilenames.length; i++) {
    spriteSheets[i] = loadImage("assets/" + spriteSheetFilenames[i]);
  }
  Tone.Transport.start();
}

function setup() {
  Tone.start();
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  reset();

}

function reset() {
  Tone.start();
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,30);

  animations = [];
  for(let i=0; i < game.totalSprites; i++) {
    animations[i] = new WalkingAnimation(random(spriteSheets),32,32,random(100,300),random(100,300),4,random(0.5,1),30,random([0,1]));
  }
}

function draw() {
  Tone.start();
  switch(game.state) {
    case GameState.Playing:
      background(220);

      for(let i=0; i < animations.length; i++) {
        animations[i].draw();
      }

      if (game.score == animations.length){
        game.state = GameState.GameOver;
      }
       
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300,40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
        game.state = GameState.GameOver;
      break;

    case GameState.GameOver:
      game.maxScore = max(game.score,game.maxScore);
      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!",200,200);
      textSize(35);
      text("Score: " + game.score,200,270);
      text("Max Score: " + game.maxScore,200,320);
      break;

    case GameState.Start:
      background(0);
      fill(255);
      textSize(45);
      textAlign(CENTER);
      text("Bug Squish Game",200,200);
      textSize(30);
      text("Press Any Key to Start",200,300);
      break;
  }

  if (game.state === GameState.Start) {
    Playingmelody.stop();
    GameOvermelody.stop();

  } else if (game.state === GameState.Playing) {
    if (!Playingmelody.isPlaying) {
      Playingmelody.start();
    }
    Startmelody.stop(); 
    GameOvermelody.stop();

  } else if (game.state === GameState.GameOver) {
    if (!GameOvermelody.isPlaying) {
      GameOvermelody.start();
    }
    Playingmelody.stop();
    Startmelody.stop();
  }
}


function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mousePressed() {
  switch(game.state) {
    case GameState.Playing:
      for (let i=0; i < animations.length; i++) {
        let contains = animations[i].contains(mouseX,mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            if (animations[i].spritesheet === spriteSheets[game.targetSprite])
              game.score += 1;
              sounds.player("Squish").start();
          }
        }
      }
      break;
    // case GameState.GameOver:
    //   reset();
    //   game.state = GameState.Playing;
    //   break;
  }
  
}

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.vertical = vertical;
  }

  draw() {



    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;
    push();
    translate(this.dx,this.dy);
    if (this.vertical) {
      if (this.moving > 0) 
        rotate(180);
    } 
    else{
      rotate(90)
      if(this.moving < 0)
        rotate(180);
    }
 

    //rect(-26,-35,50,70);

    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) {
      this.currentFrame++;
    }


  // as the score increases increase the speed
    if (this.vertical) {
      if (game.score == 0){
        this.dy += this.moving*this.speed;
        this.move(this.dy,this.sw / 4,height - this.sw / 4);
      }
      else{
        this.speed += game.score/2000;
        this.dy += this.moving*this.speed;
        this.move(this.dy,this.sw / 4,height - this.sw / 4);
      }
    }
    else {
      if (game.score == 0){
        this.dx += this.moving*this.speed;
        this.move(this.dx,this.sw / 4,width - this.sw / 4);
      }
      else{
        this.speed += game.score/2000;
        this.dx += this.moving*this.speed;
        this.move(this.dx,this.sw / 4,width - this.sw / 4);
      }
    }

    
  }

  move(position,lowerBounds,upperBounds) {
    if (position > upperBounds) {
      this.moveLeft();
    } else if (position < lowerBounds) {
      this.moveRight();
    }
  }

  moveRight() {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  keyPressed(right, left) {
    if (keyCode === right) {
      
      this.currentFrame = 1;
    } else if (keyCode === left) {

      this.currentFrame = 1;
    }
  }

  keyReleased(right,left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }

  contains(x,y) {
    //rect(-26,-35,50,70);
    let insideX = x >= this.dx - 26 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  stop() {
    this.moving = 0;
    this.u = 4;
    this.u = 5;
    
  }
}