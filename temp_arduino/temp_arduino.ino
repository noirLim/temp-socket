#include <DHT.h> //library DHT
#include <ArduinoJson.h>
#define DHTPIN 2 //pin DATA konek ke pin 2 Arduino
#define DHTTYPE DHT11 //tipe sensor DHT11

DHT dht(DHTPIN, DHTTYPE); //set sensor + koneksi pin


float humi, temp;//deklarasi variabel 

void setup()
{
  Serial.begin(9600); //baud 9600
}

void loop(){
  JsonDocument doc;
  String jsonString;
  humi = dht.readHumidity();//baca kelembaban
  temp = dht.readTemperature();//baca suhu
  
  if (isnan(humi) || isnan(temp)) { //jika tidak ada hasil
    doc["status"] = 0;
  }
  else{
    doc["suhu"] = temp;
    doc["humi"] = humi;
    doc["status"] = 1;
  }
  //konversikan json ke string
  serializeJson(doc, Serial);
  Serial.println();

  // doc.clear();

  delay(300);   
}    