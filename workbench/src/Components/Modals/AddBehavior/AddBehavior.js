import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";

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

    useEffect(() => {

    }, [engine]);

    return (
        <div className="add-behavior-modal">
            <h2 onClick={close}>Add Behavior</h2>
        </div>
    );
}
