#include <Adafruit_NeoPixel.h>

enum commands {
  SET_CURRENT_LOOP,
  SET_BRIGHTNESS,
  GET_STATE
};

enum loops {
  OFF,
  RAINBOW,
  TEST_LOOP,
  BASIC_FLUTTER,
  POWER_TRANSFER
};

#define PIN_ZERO 5
#define PIN_ONE 6
#define PIN_TWO 10
#define PIN_THREE 11
#define NUMPIXELS 18

Adafruit_NeoPixel strip_0 = Adafruit_NeoPixel(NUMPIXELS, PIN_ZERO, NEO_GRBW + NEO_KHZ800);
Adafruit_NeoPixel strip_1 = Adafruit_NeoPixel(NUMPIXELS, PIN_ONE, NEO_GRBW + NEO_KHZ800);
Adafruit_NeoPixel strip_2 = Adafruit_NeoPixel(NUMPIXELS, PIN_TWO, NEO_GRBW + NEO_KHZ800);
Adafruit_NeoPixel strip_3 = Adafruit_NeoPixel(NUMPIXELS, PIN_THREE, NEO_GRBW + NEO_KHZ800);


Adafruit_NeoPixel strips[4] = {strip_0, strip_1, strip_2, strip_3};


int brightness = 100;
loops currentLoop = RAINBOW;
bool shouldForceTerminateLoop = false;

void setup() {
  Serial.begin(9600);
  strip_0.begin();
  strip_1.begin();
  strip_2.begin();
  strip_3.begin();

  strip_0.clear();
  strip_1.clear();
  strip_2.clear();
  strip_3.clear();

  strip_0.setBrightness(brightness);
  strip_1.setBrightness(brightness);
  strip_2.setBrightness(brightness);
  strip_3.setBrightness(brightness);
}

void loop() {

  if(currentLoop != OFF) {
    rainbowLoop();
    testLoop();
    basicFlutter();
  }

  doChecks();
}

void setAllPixelColor(int pixel, uint32_t color) {
    for(int i=0; i<4; i++) {
    strips[i].setPixelColor(pixel, color);
  }
}

void showAllStrips () {
  for(int i=0; i<4; i++) {
    strips[i].show();
  }
}

void clearAll () {
  for(int i=0; i<4; i++) {
    strips[i].clear();
  }
}

void setBrightness(int value){
  brightness = value;
    for(int i=0; i<4; i++) {
    strips[i].setBrightness(brightness);
  }
}

bool shouldTerminateLoop () {
  return shouldForceTerminateLoop;
}

void loopHasTerminated () {
  strip_0.clear();
  strip_0.show();
  shouldForceTerminateLoop = false;
}

void changeLoop (loops newLoop) {
  shouldForceTerminateLoop = true;
  currentLoop = newLoop;
}

// ------------------ Loops -----------------------

// void savanaLoop() {
//   for
// }


void basicFlutter() {
  while (currentLoop == BASIC_FLUTTER) {
    for (int i=1; i < 80; i++) {
      for(int j=0; j<NUMPIXELS; j++) {
        setAllPixelColor(j, strip_0.Color(155,115,0));
      }
      showAllStrips();
      delay(40);
      for(int j=0; j<NUMPIXELS; j++) {
        setAllPixelColor(j,strip_0.Color(0,0,0));
      }
      showAllStrips();
      delay(27);
    }
  }
}

void testLoop () {
  setBrightness(100);
  while (currentLoop == TEST_LOOP) {
      for(int i=0; i < NUMPIXELS; i++) {
        uint32_t color = strip_0.Color(108, 0, 179);

        clearAll();
        showAllStrips ();
        delay(300);

        strip_0.fill(color);
        strip_1.fill(color);
        strip_2.fill(color);
        strip_3.fill(color);
        showAllStrips ();

        doChecks();
        if(shouldTerminateLoop()) {
          loopHasTerminated();
          return;
        }

      delay(300);
    }
  }
}

void rainbowLoop () {
  while (currentLoop == RAINBOW) {
    uint16_t i, j;
    for(j=0; j<256; j++) {
      for(i=0; i < NUMPIXELS; i++) {
        setAllPixelColor(i, Wheel((i+j) & 255));

        doChecks();
        if(shouldTerminateLoop()) {
            loopHasTerminated();
          return;
        }
      }
      showAllStrips();
      delay(700);
    }
  }
}

void doChecks() {

  handleSerial();
}

uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip_0.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip_0.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip_0.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
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
