#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

#include "credentials.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

char id[] = CLIENT_ID;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "192.168.1.75";
const int  port     = 1883;
const char topic[]  = "homerun/atoll_update";

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
    mqttClient.println("\"");
    mqttClient.println("}");
    mqttClient.endMessage();
  }
  
  delayMicroseconds(500);
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
}
