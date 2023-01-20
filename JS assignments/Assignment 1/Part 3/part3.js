function setup(){
    createCanvas(400,200);
}

function draw(){
    background (0);
   
    noStroke();
    fill(255, 80, 71);
    square(210, 15, 160, 100, 100, 0, 0);

    noStroke();
    fill('white');
    ellipse(250, 95, 50, 50);
    ellipse(328, 95, 50, 50);

    noStroke();
    fill('royalblue');
    ellipse(250, 95, 30, 30);
    ellipse(328, 95, 30, 30);

    noStroke();
    fill('yellow');
    arc(90, 100, 160, 160, 267.8, 699.8);
    
}