import { readdir } from "node:fs/promises";
import path from "node:path";
import loadDir from "./loadDir.js";

const handleWSConnection = async function(request) {
    // TODO: can rewrite this to accept only the requests from allowed origin
    const wsConn = request.accept(null, request.origin);

    wsConn.on('message', function (data) {
        var msg = JSON.parse(data['utf8Data']);

        if (!("type" in msg)) {
            msg.data = "Missing type";
            wsConn.send(JSON.stringify(msg));
            return;
        }

        switch (msg["type"]) {
            case "workspaces":
                const workspacePath = path.join(process.cwd(), 'workspace');
                loadDir(workspacePath, workspacePath).then((folders) => {
                    msg.data = folders;
                    wsConn.send(JSON.stringify(msg));
                });
                break;
            default:
                wsConn.send(data['utf8Data']);
                break;
        }
    });
}

export default handleWSConnection;

