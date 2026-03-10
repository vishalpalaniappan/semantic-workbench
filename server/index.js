import express from "express";
import path from "node:path";
import http from "node:http";
import handleWSConnection from "./websocket.js";
import { server as WebSocketServer } from "websocket";

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
server.listen(PORT);

//Create a new websocket server on the same port as the http connection
const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    handleWSConnection(request);
});

