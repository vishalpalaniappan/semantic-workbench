import React, {useContext, useEffect, useRef, useState} from "react";

import {CircleFill} from "react-bootstrap-icons";

import ServerContext from "../../Providers/ServerContext";
import {useStatusMsg} from "../../Store/useAppSelection";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

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

    useEffect(() => {
        setMessage(statusMsg);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setMessage("");
        }, 3000);
    }, [statusMsg]);

    useEffect(() => {
        if (connectionStatus) {
            if (connectionStatus === "Connected") {
                setConnectionColor({color: "green"});
            } else if (connectionStatus === "Connecting") {
                setConnectionColor({color: "yellow"});
            } else if (connectionStatus === "Closed") {
                setConnectionColor({color: "red"});
            } else if (connectionStatus === "Closing") {
                setConnectionColor({color: "red"});
            } else if (connectionStatus === "Uninstantiated") {
                setConnectionColor({color: "red"});
            }
        }
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
