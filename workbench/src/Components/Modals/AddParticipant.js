import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

import "./AddValue.scss";

AddParticipant.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add Participant modal body component.
 * @return {JSX.Element}
 */
export function AddParticipant ({close}) {
    const {selectedBehavior} = useContext(WorkspaceContext);
    const {engine} = useDalEngine();
    const [participant, setParticipant] = useState("");
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
        if (participant.trim() === "") {
            setError("Participant name must not be empty.");
            return;
        }
        try {
            const participantInstance = engine.createParticipant({name: participant});
            selectedBehavior.addParticipant(participantInstance);
            publish({
                type: "participants:update",
                payload: participant,
                source: "add-participant-modal",
            });
            close();
        } catch (ParticipantAlreadyExistsError) {
            setError(`Participant with name "${participant}" already exists.`);
        }
    }, [engine, participant, publish, close]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Participant Name:</span>
            </div>
            <form className="value-name-input" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    value={participant}
                    onChange={(e) => setParticipant(e.target.value)}/>
                <div className="value-name-submit">
                    <button type="submit">Add Participant</button>
                </div>
            </form>
            {error && <div className="value-error">{error}</div>}
        </div>
    );
}
