const express = require('express');
const path = require('path')
const http = require('http');
const handleWSConnection = require('./websocket.js');
const webSocketServer = require('websocket').server;

/*
    1. Create express server
    2. Route / to index.html in the public folder
    3. Create Websocket server on same port
    4. Send request for websocket connection to websocket connection handler.
*/


//Port on which the http and websocket connections are established
const PORT = 3002;

const app = express();

app.use((req, res, next) => {
    next()
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public') + '/index.html')
});


//Create the HTTP server
const server = http.createServer(app);

//Listen on the specified port
server.listen(PORT);

//Create a new websocket server on the same port as the http connection
const wsServer = new webSocketServer({
    httpServer: server
});

//When websocket connection request is received, send it to the handleWSConnection function
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    handleWSConnection(request);
});

