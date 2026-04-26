// arduino uno and AD8232 setup 
// electrode pads stuck to plant for signal, 2 leaves and one grounding stem 
int ecgPin = A0;
int baseline = 330;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  int centered = raw - baseline;
  // int value = analogRead(ecgPin);
  Serial.println(centered);
  delay(1000);
}
