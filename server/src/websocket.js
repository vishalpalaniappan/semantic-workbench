import {WSMessageHandler} from "./websocketHandlers.js";

const handleWSConnection = async function (request) {
    // TODO: can rewrite this to accept only the requests from allowed origin
    const ws = request.accept(null, request.origin);
   
    const handler = new WSMessageHandler(ws);

    ws.on('message', (data) => {
        handler.handleMessage(JSON.parse(data["utf8Data"]));
    });
};

export default handleWSConnection;
