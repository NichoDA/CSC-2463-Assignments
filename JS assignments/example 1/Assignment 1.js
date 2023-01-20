function setup(){
    createCanvas(1600,1600);
}

function draw(){
    if(mouseIsPressed){
        fill(0);
    } else{
        fill(225);
    }
    ellipse(mouseX,mouseY,80,80);
    background(0)
}