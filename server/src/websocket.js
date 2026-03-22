import { readdir } from "node:fs/promises";
import path from "node:path";
import loadDir from "./loadDir.js";
import { TerminalSession } from "./terminal.js";

const handleWSConnection = async function(request) {
    // TODO: can rewrite this to accept only the requests from allowed origin
    const ws = request.accept(null, request.origin);

    const terminal = new TerminalSession();

    const onData = (data) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "output", data }));
        }
    };

    const onExit = (exit) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "exit", data: exit }));
        }
    };

    const onStart = () => {
        ws.send(JSON.stringify({ type: "started" }));
    };

    const onStop = () => {
        ws.send(JSON.stringify({ type: "stopped" }));
    };

    terminal.on("data", onData);
    terminal.on("exit", onExit);
    terminal.on("start", onStart);
    terminal.on("stop", onStop);

    terminal.start();

    ws.on('message', function (data) {
        var msg = JSON.parse(data['utf8Data']);

        if (!("type" in msg)) {
            msg.data = "Missing type";
            ws.send(JSON.stringify(msg));
            return;
        }

        switch (msg["type"]) {
            case "workspaces":
                const workspacePath = path.join(process.cwd(), 'workspace');
                loadDir(workspacePath, workspacePath).then((folders) => {
                    msg.data = folders;
                    ws.send(JSON.stringify(msg));
                });
                break;
            case "terminal_input":
                terminal.write(msg.data);
                break;
            case "terminal_resize":
                terminal.resize(msg.cols, msg.rows);
                break;
            case "terminal_start":
                terminal.start();
                break;
            case "terminal_stop":
                terminal.stop();
                break;
            case "terminal_restart":
                terminal.restart();
                break;
            default:
                ws.send(data['utf8Data']);
                break;
        }
    });

    ws.on("close", () => {
        terminal.stop();
        terminal.off("data", onData);
        terminal.off("exit", onExit);
        terminal.off("start", onStart);
        terminal.off("stop", onStop);
    });
}

export default handleWSConnection;

