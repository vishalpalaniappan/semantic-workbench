import React, {useCallback, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter, setSelectedInvariant} from "../../Store/appSlice";
import {useInvariantTypes} from "../../Store/useAppSelection";
import {useSelectedParticipant} from "../../Store/useAppSelection";
import {saveInvariantPropValues} from "./helper";

import "./AddValue.scss";

AddInvariant.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add Invariant modal body component.
 * @param {props} props
 * @param {function} props.close - Function to close the modal,
 * provided by the modal manager.
 * @return {JSX.Element}
 */
export function AddInvariant ({close}) {
    const {engine} = useDalEngine();

    const dispatch = useDispatch();
    const selectedParticipant = useSelectedParticipant();
    const invariantTypes = useInvariantTypes();

    const [chosenInvariant, setChosenInvariant] = useState("");
    const [invariantTypeInstance, setInvariantTypeInstance] = useState([]);
    const [propertyDivs, setPropertyDivs] = useState(null);
    const [invariantName, setInvariantName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (engine) {
            setChosenInvariant(Object.keys(engine.invariant_types)[0] || "");
        }
    }, [engine]);

    const [propertyInputs, setPropertyInputs] = useState({});

    const handlePropertyChange = (id, value) => {
        setPropertyInputs((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        if (!chosenInvariant) return;
        const instance = new engine.invariant_types[chosenInvariant]();

        const nameDiv = (
            <>
                <div className="value-name-label">
                    {" "}
                    <span>Name:</span>
                </div>
                <div className="value-name-input">
                    <input
                        value={invariantName}
                        onChange={(e) => setInvariantName(e.target.value)}
                    ></input>
                </div>
                <div className="value-name-label">
                    <span>Description:</span>
                </div>
                <div className="value-name-input">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
            </>
        );
        const optionDivs = Object.keys(instance.properties).map((key) => (
            <>
                <div className="value-name-label" key={key + "-label"}>
                    <span>{instance.properties[key].label}:</span>
                </div>
                <div className="value-name-input" key={key + "-input"}>
                    <input
                        value={propertyInputs[key] || ""}
                        onChange={(e) => handlePropertyChange(key, e.target.value)}></input>
                </div>
            </>
        ));
        const submitButton = (
            <div className="invariant-name-submit">
                <button onClick={handleSubmit}>Add Invariant</button>
            </div>
        );

        setPropertyDivs([nameDiv, ...optionDivs, submitButton]);
        setInvariantTypeInstance(instance);
    }, [chosenInvariant, handleSubmit, engine, propertyInputs, description, invariantName]);

    const handleSubmit = useCallback(() => {
        if (invariantName.trim() === "") {
            setError("Invariant name must not be empty.");
            return;
        }

        let _invariant;
        try {
            _invariant = engine.createInvariant({
                name: invariantName,
                description: description,
            });
            _invariant.invariantType = invariantTypeInstance;
            saveInvariantPropValues(_invariant, propertyInputs);
            selectedParticipant.addInvariant(_invariant);
        } catch (err) {
            setError(err.message);
            return;
        }
        dispatch(setSelectedInvariant(_invariant.name));
        dispatch(incrementCounter());
        close();
    },
    [
        description,
        engine,
        invariantName,
        invariantTypeInstance,
        selectedParticipant,
        propertyInputs,
        dispatch,
        close,
    ]
    );

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
    }, [close, handleSubmit]);

    return (
        <div className="add-value-modal" >
            <div className="value-name-label">
                <span>Invariants:</span>
            </div>
            <div className="value-name-input">
                <select
                    value={chosenInvariant}
                    onChange={(e) => setChosenInvariant(e.target.value)}
                >
                    {Object.keys(invariantTypes).map((invariant) => (
                        <option key={invariant} value={invariant}>
                            {invariant}
                        </option>
                    ))}
                </select>
            </div>
            {invariantTypeInstance && propertyDivs}
            {error && (
                <div style={{float: "right"}} className="value-error">
                    {error}
                </div>
            )}
        </div>
    );
}
