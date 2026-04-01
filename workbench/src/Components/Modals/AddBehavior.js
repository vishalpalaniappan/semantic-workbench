import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setSelectedBehavior} from "../../Store/appSlice";

import "./AddValue.scss";

AddBehavior.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add Behavior modal body component.
 * @return {JSX.Element}
 */
export function AddBehavior ({close}) {
    const {engine} = useDalEngine();

    const dispatch = useDispatch();

    const [behavior, setBehavior] = useState("");
    const [error, setError] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [engine]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (behavior.trim() === "") {
            setError("Behavior name must not be empty.");
            return;
        }
        try {
            engine.getNode(behavior);
            setError(`Behavior with name "${behavior}" already exists.`);
        } catch (BehaviorNotFoundError) {
            engine.addNode(behavior, []);
            dispatch(setSelectedBehavior(behavior));
            close();
        }
    }, [engine, behavior, close, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event) => (event.key === "Escape") && close();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Behavior Name:</span>
            </div>
            <form className="value-name-input" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}/>
                <div className="value-name-submit">
                    <button type="submit">Add Behavior</button>
                </div>
            </form>
            {error &&
                <div className="value-error">{error}</div>
            }
        </div>
    );
}
