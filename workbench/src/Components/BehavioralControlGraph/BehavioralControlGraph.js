import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import {BehavioralGraphBuilder} from "sample-ui-component-library";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

import "./BehavioralControlGraph.scss";

BehavioralControlGraph.propTypes = {
};

/**
 * Behavioral Control Graph Creator
 * @return {JSX.Element}
 */
export function BehavioralControlGraph () {
    const [activeTool, setActiveTool] = useState();
    const {setSelectedBehavior} = useContext(WorkspaceContext);
    const graphRef = useRef(null);

    const {engine} = useDalEngine();

    useEffect(() => {
        if (engine) {
            graphRef.current.updateEngine(engine);
        }
    }, [engine]);

    useLayoutEventSubscription("tool:selected", (event) => {
        setActiveTool(event.payload);
    });

    useLayoutEventSubscription("engine:update", (event) => {
        if (graphRef.current) {
            graphRef.current.updateEngine(engine);
        }
    }, [engine]);

    const connectBehaviors = useCallback((from, to) => {
        if (!to) return;
        try {
            engine.getNode(from.id).addGoToBehavior(to.id);
            graphRef.current.updateEngine(engine);
        } catch (TransitionAlreadyExistsError) {
            console.error(`The transition from ${from.id} to ${to.id} already exists.`);
        }
    }, [graphRef, engine]);

    const deleteBehavior = useCallback((node) => {
        engine.removeNode(node.id);
        graphRef.current.updateEngine(engine);
        setSelectedBehavior(null);
    }, [engine, graphRef, setSelectedBehavior]);

    const deleteTransition = useCallback((edge) => {
        const fromNode = engine.getNode(edge.from);
        fromNode.removeGoToBehavior(edge.to);
        graphRef.current.updateEngine(engine);
        setSelectedBehavior(null);
    }, [engine, graphRef, setSelectedBehavior]);

    const selectBehavior = useCallback((id) => {
        setSelectedBehavior(id ? engine.getNode(id).getBehavior() : null);
    }, [setSelectedBehavior]);

    return (
        <div className="flow-wrapper">
            <BehavioralGraphBuilder
                ref={graphRef}
                connectBehaviors={connectBehaviors}
                deleteBehavior={deleteBehavior}
                deleteTransition={deleteTransition}
                activeTool={activeTool}
                selectBehavior={selectBehavior} />
        </div>
    );
}
