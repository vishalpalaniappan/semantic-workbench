import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Geo, Pencil, Plus, PlusSquare, Trash} from "react-bootstrap-icons";
import {useModalManager} from "ui-layout-manager-dev";
import {useLayoutEventSubscription} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";
import {AddInvariant} from "../Modals/AddInvariant";
import {AddParticipant} from "../Modals/AddParticipant";
import {Invariant} from "./Invariant/Invariant";

import "./NodeInfo.scss";

NodeInfo.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * NodeInfo Info component.
 *
 * TODO: The layout of this component will be entirely redone with
 * components from the library with UI/UX in mind.
 * I am not working to settle on a style that I will keep,
 * it will change when I dedicate time to improving the
 * component library with UI/UX in mind.
 *
 * @return {JSX.Element}
 */
export function NodeInfo ({close}) {
    const {engine} = useDalEngine();
    const {selectedBehavior, selectedParticipant, setSelectedParticipant} = useContext(WorkspaceContext);
    const [participants, setParticipants] = useState([]);
    const [participant, setParticipant] = useState(null);
    const [invariants, setInvariants] = useState([]);
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

    const editParticipant = useCallback(() => {
        // TODO: Implement edit participant functionality here.
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


    useEffect(() => {
        if (participants && participant) {
            const p = participants.find((p) => p.getName() === participant);
            setSelectedParticipant(p);
            setInvariants([...p.getInvariants()]);
        }
    }, [participant, participants, setSelectedParticipant]);


    /**
     * Adds an invariant to current participant.
     */
    const addInvariant = useCallback(() => {
        openModal({
            title: "Add Invariant",
            render: ({close}) => {
                return <AddInvariant close={close} />;
            },
        });
    }, [engine, selectedBehavior, participant]);

    useLayoutEventSubscription("invariants:update", (event) => {
        if (selectedParticipant) {
            setInvariants([...selectedParticipant.getInvariants()]);
        }
    }, [engine, selectedParticipant]);


    return (
        <>
            {
                selectedBehavior ?
                    <div className="nodeInfoContainer">
                        <div className="nodeInfoTitle">Behavior</div>

                        <div className="behaviorInfo">
                            <span className="behaviorLabel">
                                <Pencil style={{marginRight: "5px", color: "grey"}} />
                                {selectedBehavior}
                            </span>
                        </div>

                        <div className="nodeInfoTitle">Participants</div>

                        <div className="participantInfo">
                            <div className="participantsRow">

                                <PlusSquare title={"Add Participant"}
                                    onClick={addParticipant}
                                    style={{marginRight: "8px", marginLeft: "0px"}}
                                    className="icon"/>

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
                                <Pencil title={"Edit Participant"}
                                    onClick={editParticipant}
                                    className="icon"/>
                                <Trash title={"Delete Participant"}
                                    onClick={deleteParticipant}
                                    className="icon"/>

                            </div>

                            <div className="participantsContent">
                                {
                                    selectedParticipant &&
                                    selectedParticipant.getInvariants().map((invariant, index) => (
                                        <Invariant key={index} invariant={invariant.name} />
                                    ))
                                }

                            </div>

                            <div className="participantBottomMenu">
                                <span className="addInvariant" onClick={addInvariant}>
                                    + Add Invariant
                                </span>
                            </div>

                        </div>
                    </div>:
                    <span className="noSelect">No Node Selected</span>
            }
        </>
    );
}
