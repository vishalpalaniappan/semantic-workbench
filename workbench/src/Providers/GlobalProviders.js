import React, {useContext, useEffect, useMemo, useRef, useState} from "react";

import {DALEngine} from "dal-engine-core-js-lib-dev";
import PropTypes from "prop-types";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

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
    const [mapping, setMapping] = useState(new Map());
    const termWriteRef = useRef(null);
    const sendJsonMessageRef = useRef(null);

    const publish = useLayoutEventPublisher();

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

    // eslint-disable-next-line no-unused-vars
    const [messageHistory, setMessageHistory] = useState([]);
    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            processMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);

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


    const processMessage = (msg) => {
        switch (msg.type) {
            case "workspaces":
                setWorkspace(msg.data);
                loadEngineFromWorkspace(msg.data);
                getMappingForWorkspace(msg.data);
                break;
            case "terminal_output":
                termWriteRef.current?.(msg.data);
                break;
            case "design_save_successful":
                publish({
                    type: "status:set",
                    payload: "Design saved successfully!",
                    source: "websocket-handler",
                });
                break;
            case "design_save_failed":
                publish({
                    type: "status:set",
                    payload: "Failed to save design.",
                    source: "websocket-handler",
                });
                break;
            case "get_mapping":
                updateMapping(msg.payload.filePath, msg.data);
                break;
            case "error":
                console.log("Received error:", msg);
                break;
            default:
                break;
        }
    };

    /**
     * Terminal writer function that can be set by the terminal component
     * and called by the websocket handler when terminal output is received.
     *
     * TODO: Revisit terminal functions to improve all this.
     * @param {function} fn
     */
    const setTermWriter = (fn) => {
        termWriteRef.current = fn;
    };

    /**
     * Create the engine and add a save method that can be
     * used by application to save engine to workspace.
     */
    const engine = useMemo(() => {
        const e = new DALEngine({
            name: "default",
            description: "Default engine",
        });
        e.save = () => {
            const serialized = e.serialize();
            sendJsonMessageRef.current({
                type: "save_engine",
                payload: {
                    "data": serialized,
                    "fileName": "engine.dal",
                },
            });
        };
        return e;
    }, []);


    /**
     * Given a workspace, get the mapping for each python file by
     * asking the server to run the instrumented in parser_stream mode.
     * @param {Object} workspace Workspace object.
     */
    const getMappingForWorkspace = (workspace) => {
        const pyFiles = workspace.filter((file) => file.name.endsWith(".py"));
        pyFiles.forEach((file) => {
            sendJsonMessageRef.current({
                type: "get_mapping",
                payload: {
                    filePath: file.path,
                },
            });
        });
    };

    /**
     * Update workspace with provided mapping.
     * @param {String} filePath Path of the file to update.
     * @param {Object} map The new mapping value to set.
     */
    const updateMapping = (filePath, map) => {
        setMapping((prev) => {
            const next = new Map(prev);
            next.set(filePath, map);
            return next;
        });
    };

    /**
     * Load the engine from the workspace if an engine.dal file is present.
     * @param {Object} workspace Workspace object.
     */
    const loadEngineFromWorkspace = (workspace) => {
        const file = workspace.find((file)=>file.name === "engine.dal");
        if (file) {
            engine.deserialize(file.content);
        }
    };

    return (
        // eslint-disable-next-line max-len
        <WorkspaceContext.Provider value={{workspace, mapping}}>
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
