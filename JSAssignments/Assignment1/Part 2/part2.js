function setup(){
    createCanvas(400,400);
    background ('none');
}

function draw(){
    background(255);
    
    noStroke();
    fill(255,0,0,63);
    ellipse(120, 100, 150, 150);
    
    fill(0, 255, 0, 63);
    ellipse(170, 185, 150, 150);

    fill(0, 0, 255, 63);
    ellipse(75, 185, 150, 150);
}