import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {useDalEngine} from "../../../Providers/GlobalProviders";

import "./AddBehavior.scss";

AddBehavior.propTypes = {
    close: PropTypes.func.isRequired,
};

/**
 * Add Behavior modal body component.
 * @return {JSX.Element}
 */
export function AddBehavior ({close}) {
    const {engine} = useDalEngine();
    const [behavior, setBehavior] = useState("");

    const publish = useLayoutEventPublisher();

    useEffect(() => {

    }, [engine]);

    const submit = () => {
        if (behavior.trim() === "") {
            return;
        }
        publish({
            type: "add:behavior",
            payload: behavior,
            source: "add-behavior-modal",
        });
        close();
    };

    return (
        <div className="add-behavior-modal">
            <div className="behavior-name-label">
                <span>Behavior Name:</span>
            </div>
            <div className="behavior-name-input">
                <input
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}/>
                <div className="behavior-name-submit">
                    <button onClick={submit}>Add Behavior</button>
                </div>
            </div>
        </div>
    );
}
