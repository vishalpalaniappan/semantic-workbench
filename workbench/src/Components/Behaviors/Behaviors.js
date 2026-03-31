import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Geo, Plus, PlusSquare, Trash} from "react-bootstrap-icons";

import {useDalEngine} from "../../Providers/GlobalProviders";
import WorkspaceContext from "../../Providers/WorkspaceContext";

import "./Behaviors.scss";

Behaviors.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Behaviors Info component.
 * @return {JSX.Element}
 */
export function Behaviors ({close}) {
    const {engine} = useDalEngine();
    const {selectedBehavior} = useContext(WorkspaceContext);


    const addBehavior = () => {

    };

    const deleteBehavior = () => {

    };

    return (
        <div className="behaviorsContainer">
            <div className="behaviorsRow">
                <select className="selectBehaviors"></select>
                <PlusSquare title={"Add Behavior"} onClick={addBehavior} className="icon"/>
                <Trash title={"Delete Behavior"} onClick={deleteBehavior} className="icon"/>
                <Geo title={"Behavior Mapping"} className="icon"/>
            </div>
            <div className="behaviorsContent">

                <div className="participantCard">
                    Librarian
                </div>
                <div className="participantCard selected">
                    Book
                </div>

                <div className="addBehaviorPlaceholder">
                    <Plus title={"Add Behavior"} className="icon"/>
                    Add Participant
                </div>
            </div>
        </div>
    );
}
