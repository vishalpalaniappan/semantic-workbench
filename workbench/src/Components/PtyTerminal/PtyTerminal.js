import React, {useContext, useEffect, useRef} from "react";

import {FitAddon} from "@xterm/addon-fit";
import {Terminal} from "xterm";

import ServerContext from "../../Providers/ServerContext";

import "xterm/css/xterm.css";
import "./PtyTerminal.scss";

Terminal.propTypes = {
};

/**
 * Terminal component.
 * @return {JSX.Element}
 */
export function PtyTerminal () {
    const {sendJsonMessage, setTermWriter, connectionStatus} = useContext(ServerContext);

    // TODO: This component needs a lot of work, I had to disable strict mode
    // for this to work. I will revisit this and make it more robust.

    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || connectionStatus !== "Connected") return;

        const term = new Terminal({
            theme: {
                background: "#1e1e1e",
                foreground: "#cccccc",
                cursor: "#aeafad",
                selectionBackground: "#264f78",

                black: "#000000",
                red: "#cd3131",
                green: "#0dbc79",
                yellow: "#e5e510",
                blue: "#2472c8",
                magenta: "#bc3fbc",
                cyan: "#11a8cd",
                white: "#e5e5e5",

                brightBlack: "#666666",
                brightRed: "#f14c4c",
                brightGreen: "#23d18b",
                brightYellow: "#f5f543",
                brightBlue: "#3b8eea",
                brightMagenta: "#d670d6",
                brightCyan: "#29b8db",
                brightWhite: "#ffffff",
            },
            fontFamily: "Cascadia Code, Consolas, monospace",
            cursorBlink: true,
            convertEol: true,
            fontSize: 14,
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(containerRef.current);

        sendJsonMessage({
            type: "terminal_input",
            data: "clear\n",
        });

        termRef.current = term;
        fitRef.current = fitAddon;

        fitAddon.fit();

        setTermWriter((data) => {
            term.write(data);
        });

        const disposable = term.onData((data) => {
            sendJsonMessage({
                type: "terminal_input",
                data: data,
            });
        });

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                fitAddon.fit();
            });
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            term.dispose();
            disposable.dispose();
            termRef.current = null;
            fitRef.current = null;
        };
    }, [connectionStatus]);

    return (
        <div className="terminal-wrapper">
            <div
                ref={containerRef}
                className="terminal-container"
                style={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    minHeight: 0,
                }}
            />
        </div>
    );
}
