import React, {useCallback, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {addInvariantThunk} from "../../Store/appThunk";
import {useInvariantTypes} from "../../Store/useAppSelection";
import {useSelectedParticipant} from "../../Store/useAppSelection";

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
    const dispatch = useDispatch();
    const selectedParticipant = useSelectedParticipant();
    const invariantTypes = useInvariantTypes();

    const [chosenInvariant, setChosenInvariant] = useState("");
    const [invariantTypeInstance, setInvariantTypeInstance] = useState(null);
    const [propertyDivs, setPropertyDivs] = useState(null);
    const [invariantName, setInvariantName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (invariantTypes) {
            setChosenInvariant(Object.keys(invariantTypes)[0] || "");
        }
    }, [invariantTypes]);

    const [propertyInputs, setPropertyInputs] = useState({});

    const handlePropertyChange = (id, value) => {
        setPropertyInputs((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        if (!chosenInvariant) return;
        const instance = new invariantTypes[chosenInvariant]();

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
    }, [chosenInvariant, handleSubmit, propertyInputs, description, invariantName]);

    const handleSubmit = useCallback(() => {
        try {
            dispatch(addInvariantThunk({
                name: invariantName,
                description: description,
                invariantType: invariantTypeInstance,
                invariantTypeProps: propertyInputs,
            }));
            close();
        } catch (err) {
            setError(err.message);
        }
    }, [description, invariantName, invariantTypeInstance, propertyInputs, dispatch, close]);

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
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        e.stopPropagation();
                        setChosenInvariant(e.target.value);
                    }}
                >
                    {Object.keys(invariantTypes).map((invariant) => (
                        <option key={invariant} value={invariant}>
                            {new invariantTypes[invariant]().label}
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
