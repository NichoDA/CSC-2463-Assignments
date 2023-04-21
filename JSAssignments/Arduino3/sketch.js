let port;
let writer, reader;
let sensorData = {};
const encoder = new TextEncoder();
const decoder = new TextDecoder();

let activationState = { active: false };
let backgroundColor = (220, 220, 220); 

function setup() {
  createCanvas(400, 400);

  if ("serial" in navigator) {
    // The Web Serial API is supported.
    let button = createButton("connect");
    button.position(0,0);
    button.mousePressed(connect);

    // add event listener for left mouse button click
    canvas.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        // toggle the LED on/off on left mouse button click
        activationState.active = !activationState.active;
        serialWrite(activationState);
      }
    });
  }
}


function draw() {
  background(backgroundColor);

  if (reader) {
    serialRead();
  }
}

function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
  }
}

async function serialRead() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    console.log(value);
    try {
      const data = JSON.parse(value.trim());
      sensorData = Object.assign({}, sensorData, data);

      if (sensorData.buttonPressed === true) {
        // toggle the background color between default and red on button press
        if (backgroundColor === (220, 220, 220)) {
          backgroundColor = [random(255), random(255), random(255)];
        } else {
          backgroundColor = [random(255), random(255), random(255)];
        }
        sensorData.buttonPressed = false; // reset the button state
      }
    } catch (error) {
      console.error(error);
    }
  }
}



async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
  
  writer.write(encoder.encode('{"event":"button_press"}\n'));
}

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
