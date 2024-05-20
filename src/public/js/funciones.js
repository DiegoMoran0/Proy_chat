let websocket;
const userColors = {};

function enviarTexto(event) {
    event.preventDefault();
    event.stopPropagation();
    const nombre = document.getElementById('nombre').value.trim();
    const texto = document.getElementById('texto').value.trim();
    if (nombre && texto) {
        const mensaje = { nombre, texto };
        doSend(JSON.stringify(mensaje));
        document.getElementById('texto').value = "";
    }
}

function init() {
    wsConnect();
}

function wsConnect() {
    websocket = new WebSocket("ws://localhost:3000");

    websocket.onopen = function(evt) {
        onOpen(evt);
    };
    websocket.onclose = function(evt) {
        onClose(evt);
    };
    websocket.onmessage = function(evt) {
        onMessage(evt);
    };
    websocket.onerror = function(evt) {
        onError(evt);
    };
}

function onOpen(evt) {
    document.getElementById("enviar").disabled = false;
}

function onClose(evt) {
    document.getElementById("enviar").disabled = true;
    document.getElementById("mensaje").value = "";

    setTimeout(function() {
        wsConnect();
    }, 2000);
}

function getColorForUser(nombre) {
    if (!userColors[nombre]) {
        userColors[nombre] = `hsl(${Math.random() * 360}, 100%, 75%)`;
    }
    return userColors[nombre];
}

function onMessage(evt) {
    const area = document.getElementById("mensaje");
    const mensaje = JSON.parse(evt.data);
    const color = getColorForUser(mensaje.nombre);
    area.value += `${mensaje.nombre}: ${mensaje.texto}\n`;
    area.innerHTML += `<span style="color:${color}">${mensaje.nombre}</span>: ${mensaje.texto}<br>`;
    area.scrollTop = area.scrollHeight; // Auto scroll to bottom
}

function onError(evt) {
    console.log("Error: " + evt);
}

function doSend(mensaje) {
    websocket.send(mensaje);
}

window.addEventListener("load", init, false);
