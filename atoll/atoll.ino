#include <ArduinoJson.h>
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

#include "credentials.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "192.168.1.75";
const int  port     = 1883;
const char topic[]  = "homerun/ATOLL001";
const char id[]     = "ATOLL001";

unsigned long int previousMillis = 0;
unsigned long int currentMillis = 0;

void setup() {

  Serial.begin(9600);
  while(!Serial) {
    delay(1);  
  }

  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);

  while(WiFi.begin(ssid, pass) != WL_CONNECTED) {
    Serial.print(".");
    delay(5000);  
  }

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  while(!mqttClient.connect(broker, port)) {
    Serial.print(".");
    delay(5000);  
  }

  mqttClient.onMessage(onMqttMessage);
  mqttClient.subscribe(topic);

  Serial.println("Connected to MQTT broker");
  Serial.println();

  for (int i = 1; i <= 13; i++) {
    pinMode(i, OUTPUT);  
  }
  
}

void loop() {
  mqttClient.poll();

  currentMillis = millis();
  
  if (currentMillis - previousMillis > 5000) {
    previousMillis = millis();

    mqttClient.beginMessage("homerun/atoll_update");
    mqttClient.println("{");
    mqttClient.print("  \"name\": \"");
    mqttClient.print(id);
    mqttClient.println("\",");
    printOutputs();
    mqttClient.println("}");
    mqttClient.endMessage();
  }
  
  delayMicroseconds(500);
}

void printOutputs() {
  mqttClient.println("\"outputs\": {");
  for(int i = 1; i <= 13; i++) {
    mqttClient.print("\"");
    mqttClient.print(i);
    mqttClient.print("\": \"");
    mqttClient.print(digitalRead(i));  
    if (i != 13) {
      mqttClient.println("\",");
    } else {
      mqttClient.println("\"");
    }
  }
  mqttClient.println("}");
}

void onMqttMessage(int messageSize) {

  Serial.print(mqttClient.messageTopic());
  Serial.print("[");
  Serial.print(messageSize);
  Serial.print("]: ");

  String incomingData = "";

  while(mqttClient.available()) {
    incomingData += (char)mqttClient.read();  
  }

  Serial.println(incomingData);

  DynamicJsonDocument doc(1024);
  deserializeJson(doc, incomingData);
  JsonObject obj = doc.as<JsonObject>();

  int portId = obj["outputId"];
  int state = obj["state"];

  digitalWrite(portId, state);
  
}
