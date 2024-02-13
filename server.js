const { SerialPort } = require("serialport");
const { Server } = require("socket.io");
const http = require("http");

const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//membuat koneksi dengan socket io
io.on("connection", (socket) => {
  console.log("socket terhubung");
  socket.on("disconnect", () => {
    console.log("disconnected..");
  });
});

//setup port arduino
const port = new SerialPort({ path: "COM8", baudRate: 9600 });

let dataBuffer = "";

//menarik data suhu dari arduino
port.on("data", (data) => {
  const receivedData = data.toString().trim();
  for (let char of receivedData) {
    dataBuffer += char;
    if (char === '}') {
      try {
        io.emit("arduinoData", { data: JSON.parse(dataBuffer) });
        dataBuffer = "";
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

server.listen(3000, () => {
  console.log("server on");
});
