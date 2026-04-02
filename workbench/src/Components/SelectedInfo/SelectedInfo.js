import React, {useContext, useEffect, useRef, useState} from "react";

import {InfoCircle} from "react-bootstrap-icons";

// eslint-disable-next-line max-len
import {useSelectedBehavior, useSelectedInvariant, useSelectedParticipant} from "../../Store/useAppSelection";

import "./SelectedInfo.scss";

SelectedInfo.propTypes = {
};

/**
 * SelectedInfo component.
 * @return {JSX.Element}
 */
export function SelectedInfo () {
    const selectedBehavior = useSelectedBehavior();
    const selectedInvariant = useSelectedInvariant();
    const selectedParticipant = useSelectedParticipant();

    return (
        <>
            {selectedBehavior &&
                <div className="selectedInfoContainer">
                    <div className="selectedInfoTitle">Selected Info</div>
                    <div className="selectedInfoContent">
                        {selectedBehavior &&
                            <div className="infoRow">
                                <div className="labelRow">
                                    <span className="labelName">
                                        Behavior:
                                    </span>
                                    <span className="labelValue">
                                        {selectedBehavior.getName()}
                                    </span>
                                </div>
                                <div className="icon">
                                    <InfoCircle />
                                </div>
                            </div>
                        }
                        {selectedParticipant &&
                            <div className="infoRow">
                                <div className="labelRow">
                                    <span className="labelName">
                                        Participant:
                                    </span>
                                    <span className="labelValue">
                                        {selectedParticipant.getName()}
                                    </span>
                                </div>
                                <div className="icon">
                                    <InfoCircle />
                                </div>
                            </div>
                        }
                        {selectedInvariant &&
                            <div className="infoRow">
                                <div className="labelRow">
                                    <span className="labelName">
                                        Invariant:
                                    </span>
                                    <span className="labelValue">
                                        {selectedInvariant.getName()}
                                    </span>
                                </div>
                                <div className="icon">
                                    <InfoCircle />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    );
}
