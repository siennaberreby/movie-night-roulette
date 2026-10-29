// Movie Night Roulette: ESP32 TTGO, USB serial at 115200.
const int JOY_X=39, JOY_Y=32, JOY_SW=33, POT=13, BUTTON=2, LED=15;
unsigned long changed=0, lastSend=0, presses=0;
bool lastRaw=false, pressed=false;
float smoothPot=0;
void setup(){
 Serial.begin(115200);
 pinMode(JOY_X,INPUT); pinMode(JOY_Y,INPUT); pinMode(POT,INPUT);
 pinMode(BUTTON,INPUT_PULLUP); pinMode(JOY_SW,INPUT_PULLUP);
 pinMode(LED,OUTPUT); digitalWrite(LED,LOW);
 analogReadResolution(12);
 analogSetPinAttenuation(POT,ADC_11db);
 analogSetPinAttenuation(JOY_X,ADC_11db);
 analogSetPinAttenuation(JOY_Y,ADC_11db);
 smoothPot=analogRead(POT);
}
void loop(){
 unsigned long now=millis();
 bool raw=digitalRead(BUTTON)==LOW || digitalRead(JOY_SW)==LOW;
 if(raw!=lastRaw){lastRaw=raw;changed=now;}
 if(now-changed>=35 && raw!=pressed){pressed=raw;if(pressed)presses++;}
 digitalWrite(LED,pressed?HIGH:LOW);
 smoothPot+=0.12f*(analogRead(POT)-smoothPot);
 if(now-lastSend>=40){
  lastSend=now;
  Serial.printf("MNR,%d,%d,%d,%d,%lu\n",analogRead(JOY_X),analogRead(JOY_Y),(int)smoothPot,pressed?1:0,presses);
 }
 delay(2);
}
