let websocket;

function enviarTexto(event) {
    event.preventDefault();
    event.stopPropagation();
    const nombre = document.getElementById('nombre').value.trim();
    const color = document.getElementById('color').value.trim();
    const texto = document.getElementById('texto').value.trim();
    if (nombre && texto && color) {
        const mensaje = { nombre, color, texto };
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
    document.getElementById("mensajes").innerHTML = "";

    setTimeout(function() {
        wsConnect();
    }, 2000);
}

function onMessage(evt) {
    const mensajes = document.getElementById("mensajes");
    const mensaje = JSON.parse(evt.data);
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.innerHTML = `<span style="color:${mensaje.color}">${mensaje.nombre}</span>: ${mensaje.texto}`;
    mensajes.appendChild(nuevoMensaje);
    mensajes.scrollTop = mensajes.scrollHeight; // Auto scroll to bottom
}

function onError(evt) {
    console.log("Error: " + evt);
}

function doSend(mensaje) {
    websocket.send(mensaje);
}

window.addEventListener("load", init, false);
