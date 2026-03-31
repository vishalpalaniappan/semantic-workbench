import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Geo, Pencil, Plus, PlusSquare, Trash} from "react-bootstrap-icons";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

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

    const addParticipant = () => {

    };

    const deleteParticipant = () => {

    };

    return (
        <div className="participantsContainer">
            <div className="participantsRow">
                <select className="selectParticipants">
                    <option>Book</option>
                </select>
                <PlusSquare title={"Add Participant"} onClick={addParticipant} className="icon"/>
                <Trash title={"Delete Participant"} onClick={deleteParticipant} className="icon"/>
                <Geo title={"Participant Mapping"} className="icon"/>
            </div>
            <div className="participantsContent">

                <div className="participantCard">
                    <span>Min String Length</span>
                    <Pencil title={"Edit Participant"} className="icon"/>
                </div>
                <div className="participantCard selected">
                    <span>Max Size</span>
                    <Pencil title={"Edit Participant"} className="icon"/>
                </div>
                <div className="addParticipantPlaceholder">
                    <Plus title={"Add Participant"} className="icon"/>
                    Add Invariant
                </div>
            </div>
        </div>
    );
}
