#include <Adafruit_NeoPixel.h>

enum commands {
  SET_CURRENT_LOOP,
  SET_BRIGHTNESS,
  GET_STATE
};

enum loops {
  OFF,
  RAINBOW,
  FUNLOOP,
  WILD,
  TEST_LOOP
};

#define PIN 6
#define NUMPIXELS 18
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRBW + NEO_KHZ800);

int brightness = 100;
loops currentLoop = RAINBOW;
bool shouldForceTerminateLoop = false;

void setup() {
  Serial.begin(9600);
  pixels.begin();
  pixels.clear();
  pixels.setBrightness(brightness);
}

void loop() {

       Serial.println("current loop");
     Serial.println(currentLoop);

  if(currentLoop == !OFF) {
   rainbowLoop();
   funLoop();
    testLoop();
  }
  doChecks();


}

void testLoop () {
  while (currentLoop == TEST_LOOP) {
      for(int i=0; i < NUMPIXELS; i++) {
        pixels.setPixelColor(i, pixels.Color(0, 150, 0));
        pixels.show();

        doChecks();
        if(shouldTerminateLoop()) {
          loopHasTerminated();
          return;
        }

      delay(50);
    }
    pixels.clear();
  }
}

void setBrightness(int value){
  brightness = value;
  pixels.setBrightness(brightness);
}

void funLoop () {
    while(currentLoop == FUNLOOP){
      Serial.println("FUNLOOP");
      doChecks();
    }
}

void rainbowLoop () {
  while (currentLoop == RAINBOW) {
    uint16_t i, j;
    for(j=0; j<256; j++) {
      for(i=0; i<pixels.numPixels(); i++) {
        pixels.setPixelColor(i, Wheel((i+j) & 255));

        doChecks();
        if(shouldTerminateLoop()) {
            loopHasTerminated();
          return;
        }
      }
      pixels.show();
      delay(700);
    }
  }
}

void doChecks() {

  handleSerial();
}

bool shouldTerminateLoop () {
  return shouldForceTerminateLoop;
}

void loopHasTerminated () {
  pixels.clear();
  pixels.show();
  shouldForceTerminateLoop = false;
}


void changeLoop (loops newLoop) {
  shouldForceTerminateLoop = true;
  currentLoop = newLoop;
}


uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return pixels.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return pixels.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

void sendState() {
  Serial.println(
    "@DATA=data:state|currentLoop:" + String(currentLoop) +
    "|brightness:"  + String(brightness));
}


void handleSerial() {
  int command;
  String value;

  if (Serial.available() > 0) {
    String buffer = Serial.readString();
    int delemiter = buffer.indexOf(':');
    command = buffer.substring(0, delemiter).toInt();
    value = buffer.substring(delemiter + 1, buffer.length());

    Serial.println(command);

    switch (command) {
      case GET_STATE:
        sendState();
      break;

      case SET_CURRENT_LOOP:
        Serial.println("SET_LOOP\n");
        changeLoop(loops (value.toInt()));
        sendState();
        break;

      case SET_BRIGHTNESS:
      setBrightness(value.toInt());
      sendState();
      break;
    };
  }
}
