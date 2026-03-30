import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {useDalEngine} from "../../../Providers/GlobalProviders";

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
    const [behavior, setBehavior] = useState("");
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
        if (behavior.trim() === "") {
            setError("Behavior name must not be empty.");
            return;
        }
        // If behavior already exists, show error.
        // Otherwise, add behavior and close modal.
        try {
            engine.getNode(behavior);
            setError(`Behavior with name "${behavior}" already exists.`);
        } catch (BehaviorNotFoundError) {
            engine.addNode(behavior, []);
            publish({
                type: "engine:update",
                source: "add-behavior-modal",
            });
            close();
        }
    }, [engine, behavior, publish, close]);

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
