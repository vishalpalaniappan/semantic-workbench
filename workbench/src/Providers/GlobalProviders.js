import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import useWebSocket, {ReadyState} from "react-use-websocket";

import {setActiveTab, setLastSaved} from "../Store/appSlice";
import {setStatusMsg} from "../Store/appSlice";
import engine from "./DalEngine";
import DalEngineContext from "./DalEngineContext";
import ServerContext from "./ServerContext";
import TerminalContext from "./TerminalContext";

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
    const engineRef = useRef(null);

    const dispatch = useDispatch();

    // Connect to websocketand setup auto reconnect
    const socketUrl = "ws://localhost:3002";
    const {sendJsonMessage, lastMessage, lastJsonMessage, readyState} = useWebSocket(socketUrl, {
        onOpen: () => sendJsonMessage({"type": "workspaces"}),
        shouldReconnect: (closeEvent) => true,
    });

    // Sets the message history and processes received message.
    const [messageHistory, setMessageHistory] = useState([]);
    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            processMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    // Process the received message
    const processMessage = (msg) => {
        switch (msg.type) {
            case "workspaces":
                setWorkspace(msg.data);
                break;
            case "terminal_output":
                termWriteRef.current?.(msg.data);
                break;
            case "design_save_successful":
                dispatch(setLastSaved(new Date().toISOString()));
                dispatch(setStatusMsg("Design saved successfully!"));
                break;
            case "design_save_failed":
                dispatch(setStatusMsg("Failed to save design."));
                break;
            default:
                break;
        }
    };

    // Set the connection state
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Connected",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    // Used to allow msg handler to write to terminal.
    const setTermWriter = (fn) => {
        termWriteRef.current = fn;
    };

    // Called to save the engine to the server.
    const saveEngine = useCallback(() => {
        if (!engineRef.current) return;
        engineRef.current.getFiles().forEach((file) => file.content = file.updatedContent);
        sendJsonMessage({
            type: "save_engine",
            payload: {
                "data": engineRef.current.serialize(),
                "fileName": "engine.dal",
            },
        });
    }, [sendJsonMessage]);

    // When the workspace is first loaded, find the engine and deserialize it.
    useEffect(() => {
        if (!workspace) return;

        const file = workspace.find((file) => file.name === "engine.dal");
        if (!file) return;

        engine.deserialize(file.content);
        const files = engine.getFiles();
        if (files.length > 0) {
            dispatch(setActiveTab(files[0].uid));
        }
    }, [workspace, engine]);

    // Set the engine ref and save fn for use in msg handler and other contexts.
    useEffect(() => {
        engineRef.current = engine;
        engine.save = saveEngine;
    }, [engine, saveEngine]);

    return (
        // eslint-disable-next-line max-len
        <DalEngineContext.Provider value={{engine}}>
            <TerminalContext.Provider value={{setTermWriter}}>
                <ServerContext.Provider value={{sendJsonMessage, messageHistory, connectionStatus}}>
                    {children}
                </ServerContext.Provider>
            </TerminalContext.Provider>
        </DalEngineContext.Provider>
    );
};

export const useDalEngine = function () {
    const context = useContext(DalEngineContext);
    if (!context) {
        throw new Error("useDalEngine must be used within a GlobalProvider");
    }
    return context;
};

export default GlobalProviders;
