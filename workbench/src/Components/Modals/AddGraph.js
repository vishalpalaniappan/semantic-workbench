import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setSelectedGraph} from "../../Store/appSlice";

import "./AddValue.scss";

AddGraph.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add AddGraph modal body component.
 * @param {props} props
 * @param {function} props.close - Function to close the modal,
 * provided by the modal manager.
 * @return {JSX.Element}
 */
export function AddGraph ({close}) {
    const {engine} = useDalEngine();

    const dispatch = useDispatch();

    const inputRef = useRef(null);

    const [graph, setGraph] = useState("");
    const [error, setError] = useState(null);

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
        try {
            engine.graphs.getGraph(graph);
            setError(`Graph with name "${graph}" already exists.`);
        } catch (UnknownGraph) {
            engine.createGraph(graph);
            dispatch(setSelectedGraph(graph));
            close();
        }
    }, [engine, graph, close, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event) => (event.key === "Escape") && close();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close]);

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
            {error && <div className="value-error">{error}</div>}
        </div>
    );
}
