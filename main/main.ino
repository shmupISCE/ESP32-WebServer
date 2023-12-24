#include <WiFi.h>
#include <ESPAsyncWebSrv.h>
#include <SPIFFS.h>


const char *ssid = "Srdjan";
const char *password = "milkic123";
AsyncWebServer server(80);


void setup()
{
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Route to handle the Hello request
  server.on("/send-hello", HTTP_POST, [](AsyncWebServerRequest *request) {
    Serial.println("Received Hello from the web page");

    // Respond to the web page
    AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "Hello received successfully!");
    response->addHeader("Access-Control-Allow-Origin", "*");
    response->addHeader("Content-Type", "text/plain");
    request->send(response);
  });

  // Serve the HTML file
  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");

  // Start server
  server.begin();
}

void loop() {}