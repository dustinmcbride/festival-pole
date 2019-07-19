
void setup() {
  Serial.begin(9600);
}

enum commands {
  SET_RUN_LOOP,
  SET_CURRENT_LOOP,
  SET_BRIGHTNESS,
};

enum loops {
  RAINBOW,
  FUNLOOP,
  WILD
};


loops currentLoop = RAINBOW;
bool runLoop = true;
float brightness = 1.0;

void loop() {

  rainbowLoop();
  funLoop();
  doChecks();
  endOfLoop();

}

void funLoop () {
  if (currentLoop == FUNLOOP) {
    while(runLoop){
      // Serial.write("funloop");
      doChecks();
    }
  }

}

void rainbowLoop () {
if (currentLoop == RAINBOW) {
    while(runLoop){
      //Serial.write("rainbow");
      doChecks();
    }
  }
}

void doChecks() {
  handleSerial();
}

bool shouldBreak () {
}

void endOfLoop() {
  runLoop = true;
}


void handleSerial() {

  int command;
  String value;

  if (Serial.available() > 0) {
    String buffer = Serial.readString();
    int delemiter = buffer.indexOf(':');
    command = buffer.substring(0, delemiter).toInt();
    value = buffer.substring(delemiter + 1, buffer.length());
  }

  switch (command) {
    case SET_RUN_LOOP:
     Serial.println("SET_ON\n");
     Serial.println(runLoop);
     runLoop = value.toInt();
     Serial.println(runLoop);
     break;

    case SET_CURRENT_LOOP:
     Serial.println("currentLoop:");
     Serial.println(currentLoop);
     Serial.println("SET_LOOP\n");
     currentLoop = loops (value.toInt());
     Serial.println("currentLoop:");
     Serial.println(currentLoop);
     break;

    case SET_BRIGHTNESS:
     Serial.println("SET_BRIGHTNESS\n");
     brightness = value.toFloat();
     break;
};


}
