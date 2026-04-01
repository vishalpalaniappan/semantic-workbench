import React, {useCallback, useContext, useEffect, useState} from "react";

import {PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";
import {setSelectedGraph} from "../../Store/appSlice";
import {useGraphs, useSelectedGraph} from "../../Store/useAppSelection";
import {AddGraph} from "../Modals/AddGraph";

import "./GraphMenuBar.scss";

/**
 * Graph Menu Bar Component
 * @return {JSX.Element}
 */
export function GraphMenuBar () {
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();
    const dispatch = useDispatch();
    const {setSelectedBehavior} = useContext(WorkspaceContext);

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
    }, [engine, selectedGraph, dispatch]);

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
            </div>
        </div>
    );
}
