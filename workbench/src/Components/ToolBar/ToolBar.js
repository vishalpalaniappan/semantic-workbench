import React, {useCallback} from "react";

import {Crosshair, Easel, Floppy, PlusSquare} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setStatusMsg} from "../../Store/appSlice";
import {setDesignMode, setMappingMode} from "../../Store/appSlice";
import {AddBehavior} from "../Modals/AddBehavior";

import "./ToolBar.scss";

/**
 * Toolbar Component
 * @return {JSX.Element}
 */
export function ToolBar () {
    const {openModal} = useModalManager();
    const {engine} = useDalEngine();
    const dispatch = useDispatch();

    const saveGraph = useCallback(() => {
        if (engine) {
            engine.save();
            dispatch(setStatusMsg("Saving design..."));
        }
    }, [engine]);

    const addBehavior = () => {
        openModal({
            title: "Add Behavior",
            render: ({close}) => {
                return <AddBehavior close={close} />;
            },
        });
    };

    return (
        <div className="toolbarWrapper">
            <div className="toolbarContainer">
                <PlusSquare
                    onClick={(e) => addBehavior()}
                    title="Add Behavior"
                    className="icon"
                />
            </div>
            <div className="toolbarContainer bottom">
                <Easel
                    onClick={(e) => dispatch(setDesignMode())}
                    title="Design Mode"
                    className="icon"
                />
                <Crosshair
                    onClick={(e) => dispatch(setMappingMode())}
                    title="Mapping Mode"
                    className="icon"
                />
                <Floppy
                    onClick={(e) => saveGraph()}
                    title="Save Graph"
                    className="icon"
                />
            </div>
        </div>
    );
}
