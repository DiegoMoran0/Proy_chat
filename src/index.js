const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const WebSocketServer = require("websocket").server;

app.set("puerto", 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

const connections = [];

wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    connections.push(connection);

    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);
        connections.forEach(conn => {
            conn.sendUTF("Usuario: " + message.utf8Data);
        });
    });

    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconectó");
        const index = connections.indexOf(connection);
        if (index !== -1) {
            connections.splice(index, 1);
        }
    });
});

server.listen(app.get("puerto"), () => {
    console.log("Servidor iniciado en el puerto: " + app.get("puerto"));
});

