import React, {useContext, useLayoutEffect, useRef} from "react";

import {FitAddon} from "@xterm/addon-fit";
import {Terminal} from "xterm";

import ServerContext from "../../Providers/ServerContext";
import TerminalContext from "../../Providers/TerminalContext";

import "xterm/css/xterm.css";
import "./PtyTerminal.scss";


/**
 * Terminal component.
 * @return {JSX.Element}
 */
export function PtyTerminal () {
    const {sendJsonMessage, connectionStatus} = useContext(ServerContext);
    const {setTermWriter} = useContext(TerminalContext);

    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitRef = useRef(null);

    useLayoutEffect(() => {
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

        setTermWriter((data) => {
            term.write(data);
        });

        const disposable = term.onData((data) => {
            sendJsonMessage({
                type: "terminal_input",
                data: data,
            });
        });

        let resizeTimer;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                fitAddon.fit();
                sendJsonMessage({
                    type: "terminal_resize",
                    cols: term.cols,
                    rows: term.rows,
                });
            }, 10);
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            setTermWriter(null);
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
