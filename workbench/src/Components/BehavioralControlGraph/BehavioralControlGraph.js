import React, {useCallback, useEffect, useRef, useState} from "react";

import {useDispatch} from "react-redux";
import {BehavioralGraphBuilder} from "sample-ui-component-library";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setSelectedBehavior} from "../../Store/appSlice";
import {selectBehaviorThunk} from "../../Store/appThunk";
import {useSelectedGraph} from "../../Store/useAppSelection";
import {useSelectedBehavior} from "../../Store/useAppSelection";

import "./BehavioralControlGraph.scss";

BehavioralControlGraph.propTypes = {
};

/**
 * Behavioral Control Graph Creator
 * @return {JSX.Element}
 */
export function BehavioralControlGraph () {
    const {engine} = useDalEngine();

    const dispatch = useDispatch();
    const selectedGraph = useSelectedGraph();
    const selectedBehavior = useSelectedBehavior();

    const graphRef = useRef(null);

    const [activeTool] = useState();

    useEffect(() => {
        if (engine) {
            graphRef.current.updateEngine(engine);
        }
    }, [selectedGraph, selectedBehavior, engine]);

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
        dispatch(setSelectedBehavior(null));
    }, [engine, graphRef, dispatch]);

    const deleteTransition = useCallback((edge) => {
        const fromNode = engine.getNode(edge.from);
        fromNode.removeGoToBehavior(edge.to);
        graphRef.current.updateEngine(engine);
        dispatch(setSelectedBehavior(null));
    }, [engine, graphRef, dispatch]);

    const selectBehavior = useCallback((id) => {
        try {
            dispatch(selectBehaviorThunk(id));
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, engine]);

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
