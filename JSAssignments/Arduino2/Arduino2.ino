//youtube link:  https://www.youtube.com/shorts/XG8TicvpSsk


#define LED_1_PIN 11
#define LED_2_PIN 10
#define POTENTIOMETER_PIN 2

int random_led_val_1;
int potentiometer_value = 0;
bool leds_on = true;
unsigned long start_time;

void setup()
{

  pinMode(LED_1_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);


  random_led_val_1 = random(0, 100);
  analogWrite(LED_1_PIN, random_led_val_1);
  analogWrite(LED_2_PIN, 0);

  Serial.begin(9600);
  // Record the start time
  start_time = millis();
}

void loop()
{
  while (leds_on == true){
    potentiometer_value = analogRead(POTENTIOMETER_PIN);
  
    int brightness = potentiometer_value / 4;
  
    analogWrite(LED_2_PIN, brightness);
    
    if (brightness == potentiometer_value) {
        unsigned long end_time = millis();
        // Blink both LEDs 3 times
        for (int i = 0; i < 3; i++) {
          digitalWrite(LED_1_PIN, HIGH);
          digitalWrite(LED_2_PIN, HIGH);
          delay(200);
          digitalWrite(LED_1_PIN, LOW);
          digitalWrite(LED_2_PIN, LOW);
          delay(200);
        }
        // Turn off both LEDs
        analogWrite(LED_1_PIN, 0);
        analogWrite(LED_2_PIN, 0);
        leds_on = false;
        unsigned long elapsed_time = end_time - start_time;
        Serial.print("Elapsed Time: ");
        Serial.print(elapsed_time / 1000);
        Serial.println(" seconds");
        
      }
  delay(200);
  }  
}
