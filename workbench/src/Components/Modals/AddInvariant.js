import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter, setSelectedInvariant} from "../../Store/appSlice";
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
    const {engine} = useDalEngine();
    const [chosenInvariant, setChosenInvariant] = useState("");
    const [invariantTypeInstance, setInvariantTypeInstance] = useState([]);
    const [propertyDivs, setPropertyDivs] = useState(null);

    const dispatch = useDispatch();

    const selectedParticipant = useSelectedParticipant();

    const invariantTypes = useInvariantTypes();

    useEffect(() => {
        if (engine) {
            setChosenInvariant(Object.keys(engine.invariant_types)[0] || "");
        }
    }, [engine]);

    useEffect(() => {
        if (!chosenInvariant) return;
        const instance = new engine.invariant_types[chosenInvariant]();

        const nameDiv = <>
            <div className="value-name-label"> <span>Name:</span></div>
            <div className="value-name-input"><input type="text" ></input></div>
        </>;
        const optionDivs = Object.keys(instance.properties).map((key) => (
            <>
                <div className="value-name-label">
                    <span>{instance.properties[key].label}:</span>
                </div>
                <div className="value-name-input" key={key} >
                    <input type="text" ></input>
                </div>
            </>
        ));
        const submitButton = <div className="invariant-name-submit">
            <button type="submit">Add Invariant</button>
        </div>;

        setPropertyDivs([nameDiv, ...optionDivs, submitButton]);
        setInvariantTypeInstance(instance);
    }, [chosenInvariant, engine]);


    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const _invariant = engine.createInvariant({name: Date.now().toString()});
        // TODO: get values from input fields and set them to the invariant
        // instance and use function to assign invariant type.
        _invariant.invariantType = invariantTypeInstance;
        selectedParticipant.addInvariant(_invariant);
        dispatch(setSelectedInvariant(_invariant.name));
        dispatch(incrementCounter());
        close();
    }, [engine, chosenInvariant, invariantTypeInstance, selectedParticipant, dispatch, close]);

    return (
        <form className="add-value-modal" onSubmit={handleSubmit}>
            <div className="value-name-label">
                <span>Invariants:</span>
            </div>
            <div className="value-name-input">
                <select
                    value={chosenInvariant}
                    onChange={(e) => setChosenInvariant(e.target.value)}>
                    {Object.keys(invariantTypes).map((invariant) => (
                        <option key={invariant} value={invariant}>
                            {invariant}
                        </option>
                    ))}
                </select>
            </div>
            {
                invariantTypeInstance && propertyDivs
            }
        </form>
    );
}
