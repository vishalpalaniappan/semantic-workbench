import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setSelectedParticipant} from "../../Store/appSlice";
import {useSelectedBehavior} from "../../Store/useAppSelection";

import "./AddValue.scss";

AddParticipant.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add Participant modal body component.
 * @return {JSX.Element}
 */
export function AddParticipant ({close}) {
    const {engine} = useDalEngine();

    const selectedBehavior= useSelectedBehavior();
    const dispatch = useDispatch();

    const [participant, setParticipant] = useState("");
    const [error, setError] = useState(null);

    const inputRef = useRef(null);

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
            dispatch(setSelectedParticipant(participant));
            close();
        } catch (ParticipantAlreadyExistsError) {
            setError(`Participant with name "${participant}" already exists.`);
        }
    }, [engine, participant, close, selectedBehavior, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event) => (event.key === "Escape") && close();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close]);

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
