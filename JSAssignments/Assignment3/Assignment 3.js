
//create variables for spritesheets and array for all class objects
let spriteSheet1;
let spriteSheet2;

let walkingAnimations = [];

//this function just gets a random number 
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//preload the spritesheets
function preload() {
  spriteSheet1 = loadImage("Eskimo.png");
  spriteSheet2 = loadImage("Bug.png");
}

//setup canvas and create 3 objects in WalkingAnimation class and push them into an array
function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  walkingAnimations.push(new WalkingAnimation(spriteSheet1,80,80,getRandomNumber(0,400),getRandomNumber(0,400),9));
  walkingAnimations.push(new WalkingAnimation(spriteSheet1,80,80,getRandomNumber(0,400),getRandomNumber(0,400),9));
  walkingAnimations.push(new WalkingAnimation(spriteSheet2,32,32,getRandomNumber(0,400),getRandomNumber(0,400),9));
}

//draw all objects in array
function draw() {
  background(220);
  
  for (let i = 0; i < walkingAnimations.length; i++) {
    walkingAnimations[i].draw();
    walkingAnimations[i].checkBounds();
  }
}

//functions for when key is pressed and not pressed which effects the position of all objects.
function keyPressed() {
  for (let i = 0; i < walkingAnimations.length; i++) {
    walkingAnimations[i].keyPressed(RIGHT_ARROW, LEFT_ARROW);
  }
}

function keyReleased() {
  for (let i = 0; i < walkingAnimations.length; i++) {
    walkingAnimations[i].keyReleased(RIGHT_ARROW, LEFT_ARROW);
  }
}

// WalkingAnimation class that takes spritesheet, size, position, and animation length as parameters.
class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  //draw out the animation from the spritesheet.
  draw() {
    //this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx, this.dy);
    scale(this.xDirection, 1);

    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u * this.sw + this.offsetX, this.v * this.sh + this.offsetY, this.sw, this.sh);
    pop();
    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }

    this.dx += this.moving;
    this.checkBounds();
  }

  //move object to the left and right, if moving left, this.moving one changes the scale to -1
  keyPressed(right, left) {
    if (keyCode === right) {
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    } else if (keyCode === left) {
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
  }

  //if the key is released, object will stop moving.
  keyReleased(right, left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }


// if sprite moves off canvas it will appear on the opposite side of the canvas
  checkBounds() {
    if (this.dx > width) {
      this.dx = 0;
    } else if (this.dx < 0) {
      this.dx = width;
    }
  }
}

