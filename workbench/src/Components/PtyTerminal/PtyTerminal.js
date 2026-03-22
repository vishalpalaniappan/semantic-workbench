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
    const {sendJsonMessage, setTermWriter} = useContext(ServerContext);

    const containerRef = useRef(null);
    const termRef = useRef(null);
    const fitRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            convertEol: true,
            fontSize: 14,
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(containerRef.current);

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
    }, []);

    return (
        <div className="terminal-wrapper">
            <div
                ref={containerRef}
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
