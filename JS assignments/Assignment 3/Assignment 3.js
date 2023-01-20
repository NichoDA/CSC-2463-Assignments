function setup(){
  createCanvas(displayWidth, displayHeight);
  background ('lightgray');

}

function draw() {
  
  strokeWeight(6);
  stroke(0,0,0);
  
  if (mouseIsPressed) {
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
