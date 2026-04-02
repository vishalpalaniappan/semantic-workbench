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
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [engine]);

    const handleSubmit = useCallback(() => {
        if (participant.trim() === "") {
            setError("Participant name must not be empty.");
            return;
        }
        try {
            const participantInstance = engine.createParticipant({
                name: participant, description: description,
            });
            selectedBehavior.addParticipant(participantInstance);
            dispatch(setSelectedParticipant(participant));
            close();
        } catch (ParticipantAlreadyExistsError) {
            setError(`Participant with name "${participant}" already exists.`);
        }
    }, [engine, description, participant, close, selectedBehavior, dispatch]);

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
    }, [close, handleSubmit, participant]);

    return (
        <div className="add-value-modal">
            <div className="value-name-label">
                <span>Participant Name:</span>
            </div>
            <div className="value-name-input">
                <input ref={inputRef}
                    value={participant}
                    onChange={(e) => setParticipant(e.target.value)}></input>
            </div>
            <div className="value-name-label">
                <span>Description:</span>
            </div>
            <div className="value-name-input">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="invariant-name-submit">
                <button type="button" onClick={handleSubmit}>Add Participant</button>
            </div>
            {error && (
                <div style={{float: "right"}} className="value-error">
                    {error}
                </div>
            )}
        </div>
    );
}
