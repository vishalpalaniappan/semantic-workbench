import React, {useEffect, useState} from "react";

import {BehavioralGraphBuilder} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/DalEngineProvider";

import "./BehavioralControlGraph.scss";

BehavioralControlGraph.propTypes = {
};

/**
 * Behavioral Control Graph Creator
 * @return {JSX.Element}
 */
export function BehavioralControlGraph () {
    const [activeTool, setActiveTool] = useState();

    const engine = useDalEngine();

    useEffect(() => {
        console.log(engine);
    }, [engine]);

    useLayoutEventSubscription("tool:selected", (event) => {
        setActiveTool(event.payload);
    });

    return (
        <div className="flow-wrapper">
            <BehavioralGraphBuilder activeTool={activeTool} />
        </div>
    );
}
