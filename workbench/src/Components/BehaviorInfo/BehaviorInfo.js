import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

import "./BehaviorInfo.scss";

BehaviorInfo.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Behavior Info component.
 * @return {JSX.Element}
 */
export function BehaviorInfo ({close}) {
    const {engine} = useDalEngine();
    const {selectedBehavior} = useContext(WorkspaceContext);

    const [node, setNode] = useState();

    useEffect(() => {
        if (selectedBehavior) {
            console.log("Behavior selected:", selectedBehavior);
            const selectedNode = engine.getNode(selectedBehavior);
            setNode(selectedNode);
        } else {
            setNode(null);
        }
    }, [engine, selectedBehavior]);

    return (
        <div className="behavior-info-container">
            {node && <span>
                <div>Selected Behavior:</div>
                <div>{node.getBehavior().name}</div>
            </span>}
        </div>
    );
}
