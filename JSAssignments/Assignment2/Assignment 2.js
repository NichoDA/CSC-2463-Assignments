//create pallet and brush color variables
let brushColor = [0, 0, 0];
let colors = [[255, 0, 0], [255, 165, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [165, 42, 42], [255, 255, 255], [0, 0, 0]];

//set the canvas and button to cleaer canvas,
//made background color lightgray to see white when drawn.
function setup(){
    createCanvas(displayWidth, displayHeight);
    background ('lightgray');

    button = createButton('Clear Canvas');
    button.position(20, 500);
    button.mousePressed(clearCanvas);
}

//function that draws the line when mouse is pressed.
function draw() {

    //create the palette
    createColorPalette();
    
    strokeWeight(6);
    stroke(brushColor);
    
    
    //when mouse is ressed draw
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY);
      }
    }


  //this creates the color pallet
  function createColorPalette() {
    for (let i = 0; i < colors.length; i++) {
        strokeWeight(4);
        stroke('white');
        fill(colors[i]);
        rect(5, 10 + (i * 43), 40, 40);
    }
  }
  
  //this changes the color of the brush to whatever color is selected on the pallet.
  function mouseClicked() {
    for (let i = 0; i < colors.length; i++) {
      if (mouseX > 5 && mouseX < 45 && mouseY > 10 + (i * 43) && mouseY < 50 + (i * 43)) {
        brushColor = colors[i];
      }
    }
  }

  //when the clearCanvas button is pressed this fills the entire cavas
  // with lightgray, except for where the color pallet is.
  function clearCanvas(){
    noStroke();
    fill('lightgray');
    square(0, 0, 10000);
  }

  