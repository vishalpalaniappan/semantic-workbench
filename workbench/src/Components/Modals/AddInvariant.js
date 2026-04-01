import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

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
    const {selectedBehavior, selectedParticipant} = useContext(WorkspaceContext);
    const {engine} = useDalEngine();
    const [invariants, setInvariants] = useState([]);
    const [selectedInvariant, setSelectedInvariant] = useState("");
    const [invariantInstance, setInvariantInstance] = useState([]);
    const [propertyDivs, setPropertyDivs] = useState(null);

    const publish = useLayoutEventPublisher();

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
            const instance = new engine.invariant_types[selectedInvariant]();

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
            setInvariantInstance(instance);
        }
    }, [selectedInvariant, engine]);

    useEffect(() => {
        if (selectedParticipant) {
            console.log(selectedParticipant);
        }
    }, [selectedParticipant]);


    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const _invariant = engine.createInvariant({name: Date.now().toString()});
        selectedParticipant.addInvariant(_invariant);
        publish({
            type: "invariants:update",
            source: "add-behavior-modal",
        });
        close();
    }, [engine, selectedInvariant, invariantInstance]);

    return (
        <form className="add-value-modal" onSubmit={handleSubmit}>
            <div className="value-name-label">
                <span>Invariants:</span>
            </div>
            <div className="value-name-input">
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
        </form>
    );
}
