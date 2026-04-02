import React, {useCallback, useState} from "react";

import {Crosshair, Floppy, PencilSquare, PlusSquare} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {setDesignMode, setMappingMode} from "../../Store/appSlice";
import {AddBehavior} from "../Modals/AddBehavior";

import "./ToolBar.scss";

/**
 * Toolbar Component
 * @return {JSX.Element}
 */
export function ToolBar () {
    const [selectedTool, setSelectedTool] = useState("select");

    const {openModal} = useModalManager();

    const dispatch = useDispatch();

    const publish = useLayoutEventPublisher();
    const {engine} = useDalEngine();

    const saveGraph = useCallback(() => {
        if (engine) {
            engine.save();
            publish({
                type: "status:set",
                payload: "Saving design...",
                source: "tool-bar",
            });
        }
    }, [engine]);

    const selectTool = (tool) => {
        setSelectedTool(tool);
        publish({
            type: "tool:selected",
            payload: tool,
            source: "tool-bar",
        });
    };


    const addBehavior = () => {
        const {id, closeModal} = openModal({
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
                <PencilSquare
                    onClick={() => dispatch(setDesignMode())}
                    title="Design Mode"
                    className="icon"
                />
                <Crosshair
                    onClick={() => dispatch(setMappingMode())}
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
