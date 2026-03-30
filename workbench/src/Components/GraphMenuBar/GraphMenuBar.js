import React, {useCallback, useEffect, useState} from "react";

import {PlusSquare, Trash} from "react-bootstrap-icons";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {AddGraph} from "../Modals/AddBehavior/AddGraph";

import "./GraphMenuBar.scss";

/**
 * Graph Menu Bar Component
 * @return {JSX.Element}
 */
export function GraphMenuBar () {
    const {openModal} = useModalManager();

    const publish = useLayoutEventPublisher();
    const {engine} = useDalEngine();

    const [graphs, setGraphs] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState("");


    useEffect(() => {
        if (engine) {
            setGraphs(engine.graphs.getGraphNames());
            setSelectedGraph(engine.graphs.getActiveGraph().name);
        }
    }, [engine]);

    const addgraph = () => {
        openModal({
            title: "Add Graph",
            render: ({close}) => {
                return <AddGraph close={close} />;
            },
        });
    };

    useLayoutEventSubscription("add:graph", (event) => {
        setGraphs(engine.graphs.getGraphNames());
        setSelectedGraph(engine.graphs.getActiveGraph().name);
        publish({type: "engine:update"});
    }, [engine]);

    const selectGraph = (graphName) => {
        engine.selectGraph(graphName);
        setSelectedGraph(engine.graphs.getActiveGraph().name);
        publish({type: "engine:update"});
    };

    const deleteGraph = useCallback(() => {
        if (!selectedGraph) return;
        engine.removeGraph(selectedGraph);
        setGraphs(engine.graphs.getGraphNames());
        setSelectedGraph(engine.graphs.getActiveGraph().name);
        publish({type: "engine:update"});
    }, [engine, selectedGraph, publish]);

    return (
        <div className="graphMenuBar">
            <div className="leftMenu"></div>
            <div className="rightMenu">
                <label>Selected Graph:</label>
                <select value={selectedGraph} onChange={(e) => selectGraph(e.target.value)}>
                    {graphs.map((graph) => (
                        <option key={graph} value={graph}>
                            {graph}
                        </option>
                    ))}
                </select>
                <PlusSquare onClick={addgraph} className="icon"/>
                <Trash onClick={deleteGraph} className="icon"/>
            </div>
        </div>
    );
}
