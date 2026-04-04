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
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [isAtomic, setIsAtomic] = useState(false);
    const [isDesignFork, setIsDesignFork] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [engine]);

    const handleSubmit = useCallback(() => {
        if (behavior.trim() === "") {
            setError("Behavior name must not be empty.");
            return;
        }
        try {
            engine.addNode(behavior, description, [], isAtomic, isDesignFork);
            dispatch(setSelectedBehavior(behavior));
            close();
        } catch (err) {
            setError(err.toString());
        }
    }, [engine, behavior, description, close, isAtomic, isDesignFork, dispatch]);

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
    }, [close, behavior, handleSubmit]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Behavior Name:</span>
            </div>
            <div className="value-name-input">
                <input ref={inputRef}
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}></input>
            </div>
            <div className="value-name-label">
                <span>Description:</span>
            </div>
            <div className="value-name-input">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="value-name-input">
                <div className="check-box">
                    <input type="checkbox"
                        checked={isAtomic}
                        onChange={(e) => setIsAtomic(e.target.checked)} />
                    <span style={{color: "#acacac", paddingLeft: "2px"}}>Is Atomic?</span>
                </div>
            </div>
            <div className="value-name-input">
                <div className="check-box">
                    <input type="checkbox"
                        checked={isDesignFork}
                        onChange={(e) => setIsDesignFork(e.target.checked)} />
                    <span style={{color: "#acacac", paddingLeft: "2px"}}>Is Design Fork?</span>
                </div>
            </div>
            <div className="invariant-name-submit">
                <button type="button" onClick={handleSubmit}>Add Behavior</button>
            </div>
            {error && (
                <div style={{float: "right"}} className="value-error">
                    {error}
                </div>
            )}
        </div>
    );
}
