import React, {useContext, useEffect, useRef, useState} from "react";

import {CircleFill} from "react-bootstrap-icons";

import ServerContext from "../../Providers/ServerContext";
import {useStatusMsg} from "../../Store/useAppSelection";

import "./StatusBar.scss";

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar () {
    const {connectionStatus} = useContext(ServerContext);
    const timeoutRef = useRef(null);

    const [connectionColor, setConnectionColor] = useState({color: "green"});
    const [message, setMessage] = useState("");
    const statusMsg = useStatusMsg();

    const STATUS_MSG_TIMEOUT = 3000;

    const connectionColorMap = {
        Connected: "green",
        Connecting: "yellow",
        Closed: "red",
        Closing: "red",
        Uninstantiated: "red",
    };

    useEffect(() => {
        setMessage(statusMsg);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setMessage("");
        }, STATUS_MSG_TIMEOUT);
    }, [statusMsg]);

    useEffect(() => {
        setConnectionColor({color: connectionColorMap[connectionStatus] || "red"});
    }, [connectionStatus]);

    return (
        <div className="status-bar">
            <div className="status-left">
                {message}
            </div>
            <div className="status-right">
                <CircleFill
                    className="connectionColor"
                    style={connectionColor} />{connectionStatus}
            </div>
        </div>
    );
}
