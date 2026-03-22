import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import useWebSocket, {ReadyState} from "react-use-websocket";

import ServerContext from "./ServerContext";

GlobalProviders.propTypes = {
    children: PropTypes.node,
};

/**
 * Provides all contexts consumed by the application.
 * @param {JSX} children
 * @return {JSX}
 */
function GlobalProviders ({children}) {
    const [workspace, setWorkspace] = useState();
    const termWriteRef = useRef(null);

    // Connect and setup auto reconnect
    const socketUrl = "ws://localhost:3002";
    const {
        // sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        // getWebSocket,
    } = useWebSocket(socketUrl, {
        onOpen: () => connectionOpen(),
        shouldReconnect: (closeEvent) => true,
    });


    // Called when connection is opened.
    const connectionOpen = () => {
        sendJsonMessage({
            "type": "workspaces",
        });
    };

    // Sets the message history
    const [messageHistory, setMessageHistory] = useState([]);
    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            processMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);


    const processMessage = (msg) => {
        switch (msg.type) {
            case "workspaces":
                setWorkspace(msg.data);
                break;
            case "terminal_output":
                termWriteRef.current?.(msg.data);
                break;
            default:
                break;
        }
    };


    // Set the connection state and log to console
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    useEffect(() => {
        console.log("Websocket state:", connectionStatus);
    }, [readyState]);


    const setTermWriter = (fn) => {
        termWriteRef.current = fn;
    };

    return (
        <ServerContext.Provider value={{sendJsonMessage, setTermWriter, workspace}}>
            {children}
        </ServerContext.Provider>
    );
};

export default GlobalProviders;
