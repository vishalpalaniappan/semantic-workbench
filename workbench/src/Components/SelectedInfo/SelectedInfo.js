import React, {useContext, useEffect, useRef, useState} from "react";

import {InfoCircle} from "react-bootstrap-icons";
import {useModalManager} from "ui-layout-manager-dev";

// eslint-disable-next-line max-len
import {useSelectedBehavior, useSelectedInvariant, useSelectedParticipant} from "../../Store/useAppSelection";
import {ShowInfo} from "../Modals/ShowInfo";

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

    const {openModal} = useModalManager();

    const showInfo = ({type, value}) => {
        openModal({
            title: `Selected ${type} Info`,
            args: {
                "selected": value,
                "type": type,
            },
            render: ({close, args}) => {
                return <ShowInfo close={close} args={args} />;
            },
        });
    };

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
                                <div className="icon"
                                    onClick={(e) => showInfo(
                                        {type: "Behavior", value: selectedBehavior}
                                    )}>
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
                                <div className="icon"
                                    onClick={(e) => showInfo(
                                        {type: "Participant", value: selectedParticipant}
                                    )}>
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
                                <div className="icon"
                                    onClick={(e) => showInfo(
                                        {type: "Invariant", value: selectedInvariant}
                                    )}>
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
