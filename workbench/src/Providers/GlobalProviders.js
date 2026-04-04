import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import useWebSocket, {ReadyState} from "react-use-websocket";

import {setActiveTab, setLastSaved} from "../Store/appSlice";
import {setStatusMsg} from "../Store/appSlice";
import engine from "./DalEngine";
import DalEngineContext from "./DalEngineContext";
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
    const sendJsonMessageRef = useRef(null);
    const engineRef = useRef(null);

    const dispatch = useDispatch();

    // Connect and setup auto reconnect
    const socketUrl = "ws://localhost:3002";
    const {sendJsonMessage, lastMessage, lastJsonMessage, readyState} = useWebSocket(socketUrl, {
        onOpen: () => connectionOpen(),
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        sendJsonMessageRef.current = sendJsonMessage;
    }, [sendJsonMessage]);

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

    // Set the connection state and log to console
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Connected",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    const setTermWriter = (fn) => {
        termWriteRef.current = fn;
    };

    const saveEngine = useCallback(() => {
        const currentEngine = engineRef.current;
        if (!currentEngine) return;
        for (const file of currentEngine.getFiles()) {
            file.content = file.updatedContent;
        }
        const serialized = currentEngine.serialize();
        sendJsonMessageRef.current({
            type: "save_engine",
            payload: {
                "data": serialized,
                "fileName": "engine.dal",
            },
        });
    }, []);

    useEffect(() => {
        engineRef.current = engine;
        engine.save = saveEngine;
    }, [engine, saveEngine]);

    useEffect(() => {
        if (workspace) {
            const file = workspace.find((file) => {
                return file.name === "engine.dal";
            });
            if (file) {
                engine.deserialize(file.content);
                const files = engine.getFiles();
                if (files.length > 0) {
                    dispatch(setActiveTab(files[0].uid));
                }
            }
        }
    }, [workspace, engine]);

    return (
        // eslint-disable-next-line max-len
        <DalEngineContext.Provider value={{engine}}>
            <ServerContext.Provider value={{sendJsonMessage, setTermWriter, connectionStatus}}>
                {children}
            </ServerContext.Provider>
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
