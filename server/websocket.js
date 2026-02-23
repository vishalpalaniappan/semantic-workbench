import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM doesn't set these by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the workspaces in the server
 * @returns {Array}
 */
async function getWorkspaces() {
    const workspacePath = path.join(__dirname, "workspace");
    const entries = await readdir(workspacePath, { withFileTypes: true });
    const folders = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    return folders; 
}

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
                getWorkspaces().then((folders) => {
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

