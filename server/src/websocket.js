import { readdir } from "node:fs/promises";
import path from "node:path";
import loadDir from "./loadDir.js";
import { TerminalSession } from "./terminal.js";

const handleWSConnection = async function (request) {
    // TODO: can rewrite this to accept only the requests from allowed origin
    const ws = request.accept(null, request.origin);

    const terminal = new TerminalSession();

    const onTerminalData = (data) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "terminal_output", data }));
        }
    };

    const onTerminalExit = (exit) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "terminal_exit", data: exit }));
        }
    };

    const onTerminalStart = () => {
        ws.send(JSON.stringify({ type: "terminal_started" }));
    };

    const onTerminalStop = () => {
        ws.send(JSON.stringify({ type: "terminal_stopped" }));
    };

    terminal.on("data", onTerminalData);
    terminal.on("exit", onTerminalExit);
    terminal.on("start", onTerminalStart);
    terminal.on("stop", onTerminalStop);
    terminal.start();

    ws.on("message", function (data) {
        var msg = JSON.parse(data["utf8Data"]);

        if (!("type" in msg)) {
            msg.data = "Missing type";
            ws.send(JSON.stringify(msg));
            return;
        }

        switch (msg["type"]) {
            case "workspaces": {
                const workspacePath = path.join(process.cwd(), "workspace");
                loadDir(workspacePath, workspacePath)
                    .then((folders) => {
                        msg.data = folders;
                        ws.send(JSON.stringify(msg));
                    })
                    .catch((err) => {
                        ws.send(JSON.stringify({ type: "error", data: err.message }));
                    });
                break;
            }
            case "terminal_input": {
                terminal.write(msg.data);
                break;
            }
            case "terminal_resize": {
                terminal.resize(msg.cols, msg.rows);
                break;
            }
            case "terminal_start": {
                terminal.start();
                break;
            }
            case "terminal_stop": {
                terminal.stop();
                break;
            }
            case "terminal_restart": {
                terminal.restart();
                break;
            }
            default: {
                ws.send(data["utf8Data"]);
                break;
            }
        }
    });

    ws.on("close", () => {
        terminal.stop();
        terminal.off("data", onTerminalData);
        terminal.off("exit", onTerminalExit);
        terminal.off("start", onTerminalStart);
        terminal.off("stop", onTerminalStop);
    });
};

export default handleWSConnection;
