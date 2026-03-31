import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Geo, Pencil, Plus, PlusSquare, Trash} from "react-bootstrap-icons";
import {useModalManager} from "ui-layout-manager-dev";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";
import {AddParticipant} from "../Modals/AddParticipant";
import {Invariant} from "./Invariant/Invariant";

import "./NodeInfo.scss";

NodeInfo.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * NodeInfo Info component.
 * @return {JSX.Element}
 */
export function NodeInfo ({close}) {
    const {engine} = useDalEngine();
    const {selectedBehavior} = useContext(WorkspaceContext);
    const [participants, setParticipants] = useState([]);
    const [participant, setParticipant] = useState(null);
    const {openModal} = useModalManager();

    // Add particients modal updates the participants list when a
    // participant is added and emits this event, so we listen
    // and update.
    useLayoutEventSubscription("participants:update", (event) => {
        if (selectedBehavior) {
            updateParticipants(event.payload);
        }
    }, [engine, participants, setParticipants, selectedBehavior]);

    // When the selected behavior changes, it updates the participants.
    useEffect(() => {
        if (engine && selectedBehavior) {
            updateParticipants();
        }
    }, [selectedBehavior, engine]);

    // Open the modal to add a participant.
    const addParticipant = useCallback(() => {
        if (selectedBehavior) {
            openModal({
                title: "Add Participant",
                render: ({close}) => {
                    return <AddParticipant close={close} />;
                },
            });
        }
    }, [engine, selectedBehavior]);

    // Delete the currently selected participant.
    const deleteParticipant = useCallback(() => {
        if (engine && selectedBehavior && participant) {
            const behavior = engine.getNode(selectedBehavior).getBehavior();
            behavior.removeParticipant(participant);
            updateParticipants();
        }
    }, [engine, selectedBehavior, participant]);

    /**
     * Given the selected behavior, it sets the participants and
     * selects the last participant in the list.
     * If a participant name is provided, it selects that participant.
     * If there are no participants, it sets the selected participant to null.
     */
    const updateParticipants = useCallback((participantName) => {
        if (selectedBehavior) {
            const behavior = engine.getNode(selectedBehavior).getBehavior();
            const _participants = behavior.getParticipants();
            setParticipants([..._participants]);
            if (_participants.length > 0 && participantName) {
                setParticipant(participantName);
            } else if (_participants.length > 0) {
                setParticipant(_participants[_participants.length - 1].getName());
            } else {
                setParticipant(null);
            }
        }
    }, [engine, participants, setParticipants, selectedBehavior]);

    return (
        <>
            {
                selectedBehavior ?
                    <div className="nodeInfoContainer">
                        <div className="nodeInfoTitle">Behavior</div>

                        <div className="behaviorInfo">
                            <span className="behaviorLabel">
                                <Pencil style={{marginRight: "3px"}} />
                                {selectedBehavior}
                            </span>
                        </div>

                        <div className="nodeInfoTitle">Participants</div>

                        <div className="participantInfo">
                            <div className="participantsRow">
                                <select id="car-select" className="selectParticipants"
                                    value={participant}
                                    disabled={participants.length === 0 || !participant}
                                    onChange={(e) => setParticipant(e.target.value)}>
                                    {(participants && participants.length > 0) &&
                                        participants.map((participant, index) => (
                                            <option key={index}>{participant.getName()}</option>
                                        ))}
                                    {(participants.length === 0 || !participant) &&
                                        <option>Add a participant...</option>
                                    }
                                </select>
                                <PlusSquare title={"Add Participant"}
                                    onClick={addParticipant}
                                    className="icon"/>
                                <Trash title={"Delete Participant"}
                                    onClick={deleteParticipant}
                                    className="icon"/>
                            </div>
                            <div className="participantsContent">
                                <div className="addInvariantPlaceholder">
                                    <Plus title={"Add Invariant"} className="icon"/>
                                Add Invariant
                                </div>
                            </div>
                        </div>
                    </div>:
                    <span className="noSelect">No Node Selected</span>
            }
        </>
    );
}
