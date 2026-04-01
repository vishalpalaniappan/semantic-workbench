import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

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
    const {selectedBehavior} = useContext(WorkspaceContext);
    const {engine} = useDalEngine();
    const [invariants, setInvariants] = useState([]);
    const [selectedInvariant, setSelectedInvariant] = useState("");
    const [invariantInstance, setInvariantInstance] = useState([]);
    const [propertyDivs, setPropertyDivs] = useState(null);

    useEffect(() => {
        if (engine) {
            const invList = Object.keys(engine.invariant_types);
            setInvariants(invList);
            setSelectedInvariant(invList[0] || "");
            console.log(engine.invariant_types);
        }
    }, [engine]);

    useEffect(() => {
        if (selectedInvariant) {
            console.log(`Selected invariant: ${selectedInvariant}`);
            const instance = new engine.invariant_types[selectedInvariant]();
            setInvariantInstance(instance);

            const keys = Object.keys(instance.properties);
            const divs = keys.map((key) => (
                <>
                    <div className="value-name-label">
                        <span>{instance.properties[key].label}:</span>
                    </div>
                    <div className="value-name-input" key={key} >
                        <input type="text" ></input>
                    </div>
                </>
            ));

            const button = <div className="invariant-name-submit">
                <button type="submit">Add Behavior</button>
            </div>;
            setPropertyDivs([...divs, button]);
        }
    }, [selectedInvariant, engine]);


    const handleSubmit = useCallback((event) => {
        event.preventDefault();
    });

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Invariants:</span>
            </div>
            <div className="value-name-input" onSubmit={handleSubmit}>
                <select
                    value={selectedInvariant}
                    onChange={(e) => setSelectedInvariant(e.target.value)}>
                    {invariants.map((invariant) => (
                        <option key={invariant} value={invariant}>
                            {invariant}
                        </option>
                    ))}
                </select>
            </div>
            {
                invariantInstance && propertyDivs
            }
        </div>
    );
}
