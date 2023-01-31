//class for all sprite objects that will be animated
class Character {
  //the paremeter for each sprite generated is the spritesheet.
  constructor(spritesheet) {
    //load animation, the position, and which direction the sprite is facing.
    this.animation = loadAnimation(spritesheet, {frameSize: [80, 80], frames: 6});
    this.x = 0;
    this.y = 0;
    this.flipped = false;
  }
  
  //this will initialize each character at a random location on the screen one time per instance.
  display() {
    if (!this.initialized) {
      this.x = random(0, 800);
      this.y = random(0, 400);
      this.initialized = true;
    }
    
    //when the character is moving to the left, the scale function will flip the character to face the left.
    push();
    if (this.flipped) {
      scale(-1, 1);
      animation(this.animation, -this.x, this.y);
    } else {
      animation(this.animation, this.x, this.y);
    }
    pop();    
  }
}

//make an array for all sprite objects that will be generated through the Character class.
//set keyIsPressed to false by default.
let characters = [];
let keyIsPressed = false;

//create canvas and initialize any characters.
function setup() {
  createCanvas(800, 400);
  characters.push(new Character('Eskimo.png'));
  characters.push(new Character('Ninja.png'));
  characters.push(new Character('Eskimo.png'));
}

//draw out each character in the array list of characters.
function draw() {
  clear();
  characters.forEach(c => { c.display() });

  //if the key is pressed, move the characters x postion by 5 pixels to left or right.
  //if left key is pressed, change flip value to true to flipp character.
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      characters.forEach(c => {
        c.x -= 5;
        c.flipped = true;
      });
    } else if (keyCode === RIGHT_ARROW) {
      characters.forEach(c => {
        c.x += 5;
        c.flipped = false;
      });
    }
  }
}

//if the userer is pressing on a key, change the default value of keyIsPressed to true, 
//so that in the draw function it will update its position.
function keyPressed() {
  keyIsPressed = true;
}

function keyReleased() {
  keyIsPressed = false;
}





