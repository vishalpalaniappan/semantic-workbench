import React, {useState} from "react";

import {BehavioralGraphBuilder} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import "./FlowDiagram.scss";

FlowDiagram.propTypes = {
};

/**
 * Behavioral Control Graph Creator
 * @return {JSX.Element}
 */
export function FlowDiagram () {
    const [activeTool, setActiveTool] = useState();

    useLayoutEventSubscription("tool:selected", (event) => {
        setActiveTool(event.payload);
    });

    return (
        <div className="flow-wrapper">
            <BehavioralGraphBuilder activeTool={activeTool} />
        </div>
    );
}
