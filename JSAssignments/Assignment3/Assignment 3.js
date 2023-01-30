function setup() {
    createCanvas(800, 400);
    EskimoAnimation = loadAnimation('Eskimo.png', {frameSize: [80, 80], frames: 6}); 
  }
  
  function draw() {
    clear();
    animation(EskimoAnimation, 200, 200)
}



