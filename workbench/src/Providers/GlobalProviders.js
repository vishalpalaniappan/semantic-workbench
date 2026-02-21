import React, {useEffect, useState} from "react";

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
    // Connect and setup auto reconnect
    const socketUrl = "ws://localhost:3002";
    const {
        // sendMessage,
        sendJsonMessage,
        lastMessage,
        // lastJsonMessage,
        readyState,
        // getWebSocket,
    } = useWebSocket(socketUrl, {
        onOpen: () => connectionOpen(),
        shouldReconnect: (closeEvent) => true,
    });


    // Called when connection is opened.
    const connectionOpen = () => {
        console.log("CONNECTION OPENED");
        sendJsonMessage("I have connected");
    };

    // Sets the message history
    const [messageHistory, setMessageHistory] = useState([]);
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);


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

    return (
        <ServerContext.Provider value={{sendJsonMessage}}>
            {children}
        </ServerContext.Provider>
    );
};

export default GlobalProviders;
