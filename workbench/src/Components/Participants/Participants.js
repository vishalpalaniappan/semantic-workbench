import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Geo, Pencil, Plus, PlusSquare, Trash} from "react-bootstrap-icons";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";
import {Invariant} from "./Invariant/Invariant";

import "./Participants.scss";

Participants.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Participants Info component.
 * @return {JSX.Element}
 */
export function Participants ({close}) {
    const {engine} = useDalEngine();
    const {selectedBehavior} = useContext(WorkspaceContext);

    useEffect(() => {
        if (selectedBehavior) {}
    }, [selectedBehavior]);

    const getParticipants = useCallback(() => {
        if (selectedBehavior) {
            return engine.getNode(selectedBehavior).getBehavior().participants;
        }
        return [];
    }, [selectedBehavior, engine]);

    const addParticipant = useCallback(() => {
        if (selectedBehavior) {
            const node = engine.getNode(selectedBehavior);
            node.getBehavior().addParticipant("test");
        }
    }, [engine, selectedBehavior]);

    const deleteParticipant = () => {

    };

    return (
        <div className="participantsContainer">
            <div className="participantsRow">
                <select className="selectParticipants">
                    {getParticipants().map((participant, index) => (
                        <option key={index}>{participant.name}</option>
                    ))}
                </select>
                <PlusSquare title={"Add Participant"} onClick={addParticipant} className="icon"/>
                <Trash title={"Delete Participant"} onClick={deleteParticipant} className="icon"/>
                <Geo title={"Participant Mapping"} className="icon"/>
            </div>
            <div className="participantsContent">
                <Invariant invariant={"Min String Length"}/>
                <Invariant invariant={"Max Size"}/>
                <div className="addInvariantPlaceholder">
                    <Plus title={"Add Invariant"} className="icon"/>
                    Add Invariant
                </div>
            </div>
        </div>
    );
}
