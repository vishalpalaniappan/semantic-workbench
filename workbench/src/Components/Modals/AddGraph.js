import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";

import "./AddValue.scss";

AddGraph.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add AddGraph modal body component.
 * @return {JSX.Element}
 */
export function AddGraph ({close}) {
    const {engine} = useDalEngine();
    const [graph, setGraph] = useState("");
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const publish = useLayoutEventPublisher();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [engine]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (graph.trim() === "") {
            setError("Graph name must not be empty.");
            return;
        }
        // If graph already exists, show error.
        try {
            engine.graphs.getGraph(graph);
            setError(`Graph with name "${graph}" already exists.`);
        } catch (UnknownGraph) {
            engine.createGraph(graph);
            engine.selectGraph(graph);
            publish({type: "add:graph", source: "add-graph-modal"});
            publish({type: "engine:update", source: "add-graph-modal"});
            close();
        }
    }, [engine, graph, publish, close]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Graph Name:</span>
            </div>
            <form className="value-name-input" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    value={graph}
                    onChange={(e) => setGraph(e.target.value)}/>
                <div className="value-name-submit">
                    <button type="submit">Add Graph</button>
                </div>
            </form>
            {error &&
                <div className="value-error">{error}</div>
            }
        </div>
    );
}
