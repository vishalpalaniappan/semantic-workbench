import React, {useContext} from "react";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar () {
    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                </div>
                <div className="status-right">
                </div>
            </div>
        </div>
    );
}
