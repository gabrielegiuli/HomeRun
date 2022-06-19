#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

#include "credentials.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "mqtt://raspberrypi.local";
const int  port     = 1883;
const char topic[]  = "homerun/general";

void setup() {

  Serial.begin(9600);
  delay(500);

  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);

  while(WiFi.begin(ssid, pass) != WL_CONNECTED) {
    Serial.print(".");
    delay(5000);  
  }

  Serial.println();
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  while(!mqttClient.connect(broker, port)) {
    Serial.print(".");
    delay(5000);  
  }

  mqttClient.onMessage(onMqttMessage);
  mqttClient.subscribe(topic);

  Serial.println();
  Serial.println("Connected to MQTT broker");
  Serial.println();
  
}

void loop() {
  mqttClient.poll();
  delayMicroseconds(500);
}

void onMqttMessage(int messageSize) {

  Serial.print(mqttClient.messageTopic());
  Serial.print("[");
  Serial.print(messageSize);
  Serial.print("]: ");

  while(mqttClient.available()) {
    Serial.print((char)mqttClient.read());  
  }

  Serial.println();
}
