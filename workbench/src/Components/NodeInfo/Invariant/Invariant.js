import React, {useCallback, useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Pencil, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";

import {useDalEngine} from "../../../Providers/GlobalProviders";
import {incrementCounter} from "../../../Store/appSlice";
import {setSelectedInvariant} from "../../../Store/appSlice";
import {useSelectedInvariant, useSelectedParticipant} from "../../../Store/useAppSelection";

import "./Invariant.scss";

Invariant.propTypes = {
    invariant: PropTypes.object.isRequired,
};

/**
 * Invariant Info component.
 * @return {JSX.Element}
 */
export function Invariant ({invariant}) {
    const {engine} = useDalEngine();
    const dispatch = useDispatch();

    const selectedParticipant = useSelectedParticipant();
    const selectedInvariant = useSelectedInvariant();

    const deleteInvariant = useCallback((e) => {
        e.stopPropagation();
        if (engine && invariant && selectedParticipant) {
            selectedParticipant.removeInvariant(invariant);
            dispatch(incrementCounter());
        }
    }, [engine, invariant, selectedParticipant]);

    const selectParticipant = useCallback((e) => {
        e.stopPropagation();
        if (invariant) {
            dispatch(setSelectedInvariant(invariant.getName()));
        }
    }, [invariant, dispatch]);

    return (
        <div className={`participantCard ${selectedInvariant === invariant ? "selected" : ""}`}
            onClick={selectParticipant}>
            <span>{invariant.getName()}</span>
            <div className="icons">
                <Trash title={"Delete Invariant"} onClick={deleteInvariant} className="icon"/>
            </div>
        </div>
    );
}
