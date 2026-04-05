import { TerminalSession } from "./terminal.js";
import saveFile from "./saveFile.js";
import path from "node:path";
import loadDir from "./loadDir.js"

export class  WSMessageHandler {
    constructor(ws) {
        this.ws = ws;

        this.terminal = new TerminalSession();
        this.terminal.on("data", this.onTerminalData);
        this.terminal.on("exit", this.onTerminalExit);
        this.terminal.on("start", this.onTerminalStart);
        this.terminal.on("stop", this.onTerminalStop);
        this.terminal.start();

        this.ws.on("close", () => {
            this.terminal.stop();
            this.terminal.off("data", this.onTerminalData);
            this.terminal.off("exit", this.onTerminalExit);
            this.terminal.off("start", this.onTerminalStart);
            this.terminal.off("stop", this.onTerminalStop);
        });

        this.handlers = {
            workspaces: this.workspaces.bind(this),
            save_engine: this.saveEngine.bind(this),
            terminal_input: this.onTerminalInput.bind(this),
            terminal_resize: this.onTerminalResize.bind(this)
        };
    }

    handleMessage(message) {
        try {
            const handler = this.handlers[message.type];

            if (!handler) {
                console.warn('Unknown message type:', message.type);
                return;
            }

            handler(message);
        } catch (err) {
            console.error('Failed to process message:', err);
        }
    }

    workspaces = (msg) => {
        const workspacePath = path.join(process.cwd(), "workspace");
        loadDir(workspacePath, workspacePath)
            .then((folders) => {
                msg.data = folders;
                this.ws.send(JSON.stringify(msg));
        })
        .catch((err) => {
            this.ws.send(JSON.stringify({ type: "error", data: err.message }));
        });
    }

    saveEngine = (msg) => {
        saveFile(msg.payload.fileName, "workspace", msg.payload.data).then((serializedEngine) => {
            this.ws.send(JSON.stringify({ type: "design_save_successful", data: serializedEngine }));
        }).catch((err) => {
            this.ws.send(JSON.stringify({ type: "design_save_failed" }));
        });
    }

    onTerminalData = (data) => {
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify({ type: "terminal_output", data }));
        }
    }

    onTerminalExit = (exit) => {
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify({ type: "terminal_exit", data: exit }));
        }
    }

    onTerminalStart = () => {
        this.ws.send(JSON.stringify({ type: "terminal_started" }));
    }

    onTerminalStop = () => {
        this.ws.send(JSON.stringify({ type: "terminal_stopped" }));
    }

    onTerminalResize = (msg) => {
        this.terminal.resize(msg.cols, msg.rows);
    }

    onTerminalInput = (msg) => {
        this.terminal.write(msg.data);
    }
}