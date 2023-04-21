//youtube link: https://www.youtube.com/shorts/GAKG39aWuYg

#include <Arduino_JSON.h>
#include <ArduinoJson.h>

int ledPin = 12;
int buttonPin = 4;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  // read the button state
  int buttonState = digitalRead(buttonPin);
  
  if (buttonState == LOW) {
    Serial.println("{\"buttonPressed\": true}");
    delay(500); // debounce the button press
  }

  // toggle the LED based on the activation state received from the serial port
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    JSONVar data = JSON.parse(input);
    if (bool(data["active"])) {
      digitalWrite(ledPin, HIGH);
    } else {
      digitalWrite(ledPin, LOW);
    }
  }
}
