// se encarga de enviar el texto
function enviarTexto(event) {
    event.preventDefault();
    event.stopPropagation();
    var campo = event.target.texto;

    // limpia el campo de texto
    doSend(campo.value);
    campo.value = "";
}

function init() {
    wsConnect();
}

function wsConnect() {
    websocket = new WebSocket("ws://localhost:3000");

    websocket.onopen = function(evt) {
        onOpen(evt);
    }
    websocket.onclose = function(evt) {
        onClose(evt);
    }
    websocket.onmessage = function(evt) {
        onMessage(evt);
    }
    websocket.onerror = function(evt) {
        onError(evt);
    }
}

function onOpen(evt) {
    document.getElementById("enviar").disabled = false;
    doSend("Saludos del cliente websocket");
}

function onClose(evt) {
    document.getElementById("enviar").disabled = true;
    document.getElementById("mensajes").innerHTML = "";

    setTimeout(function() {
        wsConnect();
    }, 2000);
}

function onMessage(evt) {
    var area = document.getElementById("mensaje");
    area.value += "\n" + evt.data;
    area.scrollTop = area.scrollHeight; // Auto scroll to bottom
}

function onError(evt) {
    console.log("Error: " + evt);
}

function doSend(mensaje) {
    websocket.send(mensaje);
}

window.addEventListener("load", init, false);
