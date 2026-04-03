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
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [engine]);

    const handleSubmit = useCallback((event) => {
        if (graph.trim() === "") {
            setError("Graph name must not be empty.");
            return;
        }
        try {
            engine.graphs.getGraph(graph);
            setError(`Graph with name "${graph}" already exists.`);
        } catch (err) {
            engine.createGraph(graph, description);
            dispatch(setSelectedGraph(graph));
            close();
        }
    }, [description, engine, graph, close, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close();
            } else if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close, graph]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Graph Name:</span>
            </div>
            <div className="value-name-input">
                <input ref={inputRef}
                    value={graph}
                    onChange={(e) => setGraph(e.target.value)}></input>
            </div>
            <div className="value-name-label">
                <span>Description:</span>
            </div>
            <div className="value-name-input">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="invariant-name-submit">
                <button type="button" onClick={handleSubmit}>Add Graph</button>
            </div>
            {error && (
                <div style={{float: "right"}} className="value-error">
                    {error}
                </div>
            )}
        </div>
    );
}
