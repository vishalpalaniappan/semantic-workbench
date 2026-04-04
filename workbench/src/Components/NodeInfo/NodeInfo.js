import React, {useCallback} from "react";

import {PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter, setSelectedParticipant} from "../../Store/appSlice";
import {useSelectedBehavior, useSelectedParticipant} from "../../Store/useAppSelection";
import {useInvariants, useParticipants} from "../../Store/useAppSelection";
import {AddInvariant} from "../Modals/AddInvariant";
import {AddParticipant} from "../Modals/AddParticipant";
import {Invariant} from "./Invariant/Invariant";

import "./NodeInfo.scss";

/**
 * NodeInfo component.
 *
 * @return {JSX.Element}
 */
export function NodeInfo ({}) {
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();

    const dispatch = useDispatch();
    const invariants = useInvariants();
    const participants = useParticipants();
    const selectedParticipant = useSelectedParticipant();
    const selectedBehavior = useSelectedBehavior();

    const addInvariant = useCallback(() => {
        selectedParticipant && openModal({
            title: "Add Invariant",
            render: ({close}) => {return <AddInvariant close={close} />;},
        });
    }, [engine, selectedBehavior, selectedParticipant]);

    const addParticipant = useCallback(() => {
        selectedBehavior && openModal({
            title: "Add Participant",
            render: ({close}) => {return <AddParticipant close={close} />;},
        });
    }, [engine, selectedBehavior]);

    const deleteParticipant = useCallback(() => {
        if (engine && selectedBehavior && selectedParticipant) {
            selectedBehavior.removeParticipant(selectedParticipant);
            const p = participants;
            dispatch(setSelectedParticipant(p.length > 0? p[0].getName() : null));
            dispatch(incrementCounter());
        }
    }, [engine, selectedBehavior, selectedParticipant, participants, dispatch]);

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
                                    value={selectedParticipant?.getName()}
                                    disabled={!participants || participants.length === 0}
                                    onChange={(e) => dispatch(
                                        setSelectedParticipant(e.target.value)
                                    )}>
                                    {(participants && participants.length > 0) &&
                                        participants.map((participant, index) => (
                                            <option key={index}>{participant.getName()}</option>
                                        ))}
                                    {(!participants || participants.length === 0) &&
                                        <option>Add a participant...</option>
                                    }
                                </select>
                                <Trash title={"Delete Participant"}
                                    onClick={deleteParticipant}
                                    className="icon"/>

                            </div>

                            <div className="participantsContent">
                                {
                                    invariants &&
                                    invariants.map((invariant, index) => (
                                        <Invariant key={index} invariant={invariant} />
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
