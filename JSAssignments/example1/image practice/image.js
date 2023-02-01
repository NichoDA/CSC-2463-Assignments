let thisImg;
let x = 200;
let y = 200;
let r = 0;
let startTime = 15;
let timeRemaining = 15;
let score = 0;
let topScore = 0;
let previousScore = [];

function preload(){
    thisImg = loadImage("assets/img.png");
}

function setup(){
    createCanvas(400, 400);
    imageMode(CENTER);
    angleMode(DEGREES);
}

function draw(){
    background ('lightgray');

    
    textFont('Arial');
    textSize(25);
    
    push();
    translate(x,y);
    rotate(r);
    r += 5;
    scale(-0.25,0.25); 
    image(thisImg,0,0);
    pop();

    text("Time: " + ceil(timeRemaining), 280, 50);
    timeRemaining -= deltaTime/1000;

    if (timeRemaining < 0){
        timeRemaining = startTime;
        topScore = max(topScore, score);
        previousScore.push(score);
        score = 0;
    }

    text("Score: " + score, 40,50);
    text("Top Score: " + topScore, 130, height-20);

    let scoreY = 50;

    for(let i =0; i < previousScore.length ; i++){
        text(previousScore[i], 40, scoreY+30)
        scoreY += 30
    }

    KeyTyped();
}

function KeyTyped(){
    if (key == ' '){
        print('space!');
        if(r>350 || r< 10){
            score += 10;
        }
    }
} 
