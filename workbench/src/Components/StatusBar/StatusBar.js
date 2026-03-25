import React, {useContext, useEffect, useState} from "react";

import {CircleFill} from "react-bootstrap-icons";

import ServerContext from "../../Providers/ServerContext";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar () {
    const {connectionStatus} = useContext(ServerContext);

    const [connectionColor, setConnectionColor] = useState({color:"green"});

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
            </div>
            <div className="status-right">
                <CircleFill
                    className="connectionColor"
                    style={connectionColor} />{connectionStatus}
            </div>
        </div>
    );
}
