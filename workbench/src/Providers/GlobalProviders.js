import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

import {DALEngine} from "dal-engine-core-js-lib-dev";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {incrementCounter, setActiveTab} from "../Store/appSlice";
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

    const dispatch = useDispatch();
    const publish = useLayoutEventPublisher();

    // Connect and setup auto reconnect
    const socketUrl = "ws://localhost:3002";
    const {
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(socketUrl, {
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
                // TODO: Move files to redux store to trigger updates in editor
                // and other components. This is using the counter to
                // indicate that the files have been saved.
                dispatch(incrementCounter());
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

    const saveEngine = useCallback(() => {
        for (const file of engine.getFiles()) {
            file.content = file.updatedContent;
        }
        const serialized = engine.serialize();
        sendJsonMessageRef.current({
            type: "save_engine",
            payload: {
                "data": serialized,
                "fileName": "engine.dal",
            },
        });
    }, [engine]);

    const engine = useMemo(() => {
        const e = new DALEngine({
            name: "default",
            description: "Default engine",
        });
        e.save = saveEngine;
        return e;
    }, [engine, saveEngine]);

    useEffect(() => {
        if (workspace) {
            const file = workspace.find((file) => {
                return file.name === "engine.dal";
            });
            if (file) {
                engine.deserialize(file.content);
                if (engine.getFiles().length > 0) {
                    dispatch(setActiveTab(engine.getFiles()[0].uid));
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
