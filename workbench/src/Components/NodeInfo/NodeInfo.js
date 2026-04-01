import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Pencil, PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setSelectedParticipant} from "../../Store/appSlice";
import {useSelectedBehavior, useSelectedParticipant} from "../../Store/useAppSelection";
import {useParticipants} from "../../Store/useAppSelection";
import {AddInvariant} from "../Modals/AddInvariant";
import {AddParticipant} from "../Modals/AddParticipant";
import {Invariant} from "./Invariant/Invariant";

import "./NodeInfo.scss";

NodeInfo.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * NodeInfo component.
 *
 * @return {JSX.Element}
 */
export function NodeInfo ({close}) {
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();
    const dispatch = useDispatch();

    const participants = useParticipants();
    const selectedBehavior = useSelectedBehavior();
    const participant = useSelectedParticipant();

    const addInvariant = useCallback(() => {
        participant && openModal({
            title: "Add Invariant",
            render: ({close}) => {return <AddInvariant close={close} />;},
        });
    }, [engine, selectedBehavior, participant]);

    const addParticipant = useCallback(() => {
        selectedBehavior && openModal({
            title: "Add Participant",
            render: ({close}) => {return <AddParticipant close={close} />;},
        });
    }, [engine, selectedBehavior]);

    const deleteParticipant = useCallback(() => {
        if (engine && selectedBehavior && participant) {
            selectedBehavior.removeParticipant(participant);
            updateParticipants();
        }
    }, [engine, selectedBehavior, participant]);

    const editParticipant = useCallback(() => {
        // TODO: Implement edit participant functionality here.
    }, [engine, selectedBehavior, participant]);

    const updateParticipants = useCallback((participantName) => {
        if (!participants) return;
        if (participants.length > 0 && participantName) {
            dispatch(setSelectedParticipant(participantName));
        } else if (participants.length > 0) {
            const lastParticipantName = participants[participants.length - 1].getName();
            dispatch(setSelectedParticipant(lastParticipantName));
        } else {
            dispatch(setSelectedParticipant(null));
        }
    }, [engine, participants]);

    return (
        <>
            {
                selectedBehavior ?
                    <div className="nodeInfoContainer">

                        <div className="nodeInfoTitle">Participants</div>

                        <div className="participantInfo">
                            <div className="participantsRow">

                                <PlusSquare title={"Add Participant"}
                                    onClick={addParticipant}
                                    style={{marginRight: "8px", marginLeft: "0px"}}
                                    className="icon"/>

                                <select id="car-select" className="selectParticipants"
                                    value={participant?.getName()}
                                    disabled={!participants || participants.length === 0}
                                    onChange={(e) => dispatch(
                                        setSelectedParticipant(e.target.value)
                                    )}>
                                    {(participants && participants.length > 0) &&
                                        participants.map((participant, index) => (
                                            <option key={index}>{participant.getName()}</option>
                                        ))}
                                    {(!participants || participants.length === 0 || !participant) &&
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
                                {/* {
                                    invariants &&
                                    invariants.map((invariant, index) => (
                                        <Invariant key={index} invariant={invariant.name} />
                                    ))
                                } */}

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
