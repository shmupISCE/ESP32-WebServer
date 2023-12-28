#include <WiFi.h>
#include <ESPAsyncWebSrv.h>
#include <SPIFFS.h>


const char *ssid = "Srdjan";
const char *password = "milkic123";
AsyncWebServer server(80);

String direction;

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Define CORS headers
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");

  // Define server routes
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "Hello, ESP32!");
  });

  server.on("/control", HTTP_GET, [](AsyncWebServerRequest *request){
    if (request->hasParam("direction")) {
      direction = request->getParam("direction")->value();
      Serial.println("Received Direction: " + direction);
      request->send(200, "text/plain", "Received Direction: " + direction);
    } else {
      Serial.println("Error: Missing direction parameter");
      request->send(400, "text/plain", "Missing direction parameter");
    }
  });

  // Generic error handling
  server.onNotFound([](AsyncWebServerRequest *request){
    Serial.println("Error: Page not found");
    request->send(404, "text/plain", "Not Found");
  });

  // Start server
  server.begin();

  pinMode(23, OUTPUT);
  pinMode(22, OUTPUT);
}


void loop() {
  if (direction == "move_forward") {
    digitalWrite(23, HIGH);
    digitalWrite(22, LOW);

  } else if (direction == "move_backward") {
    digitalWrite(23, LOW);
    digitalWrite(22, HIGH);
    
  } else if (direction == "stop") {
    digitalWrite(23, LOW);
    digitalWrite(22, LOW);

  delay(10); // Add a small delay to avoid excessive loop execution
  direction = "";
}
}

