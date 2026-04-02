import React, {useCallback, useEffect} from "react";

import {InfoCircle, PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter, setSelectedBehavior, setSelectedGraph} from "../../Store/appSlice";
import {useGraphs, useSelectedGraph} from "../../Store/useAppSelection";
import {AddGraph} from "../Modals/AddGraph";
import {ShowInfo} from "../Modals/ShowInfo";

import "./GraphMenuBar.scss";

/**
 * Graph Menu Bar Component
 * @return {JSX.Element}
 */
export function GraphMenuBar () {
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();

    const dispatch = useDispatch();
    const graphs = useGraphs();
    const selectedGraph = useSelectedGraph();

    useEffect(() => {
        if (engine) {
            dispatch(setSelectedGraph(engine.graphs.getActiveGraph().name));
        }
    }, [engine, dispatch]);

    const addgraph = () => {
        openModal({
            title: "Add Graph",
            render: ({close}) => {
                return <AddGraph close={close} />;
            },
        });
    };

    const selectGraph = (graphName) => {
        engine.selectGraph(graphName);
        dispatch(setSelectedGraph(graphName));
        dispatch(setSelectedBehavior(null));
    };

    const deleteGraph = useCallback(() => {
        if (!selectedGraph) return;
        engine.removeGraph(selectedGraph.name);
        dispatch(setSelectedGraph(engine.graphs.getActiveGraph().name));
        dispatch(setSelectedBehavior(null));
        dispatch(incrementCounter());
    }, [engine, selectedGraph, dispatch]);

    const showInfo = useCallback(() => {
        openModal({
            title: "Graph Info",
            args: {
                selected: engine.graph,
            },
            render: ({close, args}) => {
                return <ShowInfo close={close} args={args} />;
            },
        });
    }, [engine]);

    return (
        <div className="graphMenuBar">
            <div className="leftMenu"></div>
            <div className="rightMenu">
                <label>Selected Graph:</label>
                <select value={selectedGraph?.name} onChange={(e) => selectGraph(e.target.value)}>
                    {graphs.map((graph) => (
                        <option key={graph} value={graph}>
                            {graph}
                        </option>
                    ))}
                </select>
                <PlusSquare title={"Add Graph"} onClick={addgraph} className="icon"/>
                <Trash title={"Delete Graph"} onClick={deleteGraph} className="icon"/>
                <InfoCircle title={"Graph Info"} onClick={showInfo} className="icon"/>
            </div>
        </div>
    );
}
