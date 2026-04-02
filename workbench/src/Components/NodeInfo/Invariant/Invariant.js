import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Pencil, Trash} from "react-bootstrap-icons";

import {useDalEngine} from "../../../Providers/GlobalProviders";
import {useSelectedParticipant} from "../../../Store/useAppSelection";
import { incrementCounter } from "../../../Store/appSlice";

import { useDispatch } from "react-redux";

import "./Invariant.scss";

Invariant.propTypes = {
    invariant: PropTypes.string,
};

/**
 * Invariant Info component.
 * @return {JSX.Element}
 */
export function Invariant ({invariant}) {
    const {engine} = useDalEngine();
    const dispatch = useDispatch();

    const participant = useSelectedParticipant();

    const deleteInvariant = useCallback(() => {
        if (engine && invariant && participant) {
            participant.removeInvariant(invariant);
            dispatch(incrementCounter());
        }
    }, [engine, invariant, participant]);

    return (
        <div className="participantCard">
            <span>{invariant.getName()}</span>
            <div className="icons">
                <Trash title={"Delete Invariant"} onClick={deleteInvariant} className="icon"/>
            </div>
        </div>
    );
}
