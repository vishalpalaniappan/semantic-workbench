import React, {useContext, useEffect, useMemo, useRef, useState} from "react";

import {DALEngine} from "dal-engine-core-js-lib-dev";
import PropTypes from "prop-types";
import useWebSocket, {ReadyState} from "react-use-websocket";

import DalEngineContext from "./DalEngineContext";
import ServerContext from "./ServerContext";
import WorkspaceContext from "./WorkspaceContext";

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
    const sendJsonMessageRef = useRef(null);

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

    useEffect(() => {
        sendJsonMessageRef.current = sendJsonMessage;
    }, [sendJsonMessage]);


    // Called when connection is opened.
    const connectionOpen = () => {
        sendJsonMessage({
            "type": "workspaces",
        });
    };

    // Sets the message history
    // eslint-disable-next-line no-unused-vars
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
        [ReadyState.OPEN]: "Connected",
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

    const engine = useMemo(() => {
        const e = new DALEngine({});
        e.save = () => {
            const serialized = e.serialize();
            sendJsonMessageRef.current({
                type: "save-engine",
                payload: {
                    "data": serialized,
                    "fileName": "engine.dal",
                },
            });
        };
        return e;
    }, []);

    return (
        // eslint-disable-next-line max-len
        <WorkspaceContext.Provider value={workspace}>
            <DalEngineContext.Provider value={{engine}}>
                <ServerContext.Provider value={{sendJsonMessage, setTermWriter, connectionStatus}}>
                    {children}
                </ServerContext.Provider>
            </DalEngineContext.Provider>
        </WorkspaceContext.Provider>
    );
};

export const useDalEngine = function () {
    const context = useContext(DalEngineContext);
    if (!context) {
        throw new Error("useDalEngine must be used within a GlobalProvider");
    }
    return context;
};

export const useWorkspace = function () {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspace must be used within a GlobalProvider");
    }
    return context;
};

export default GlobalProviders;
