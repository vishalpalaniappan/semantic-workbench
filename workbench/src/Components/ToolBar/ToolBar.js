import React, {useCallback, useState} from "react";

import {
    Cursor,
    Floppy,
    PlusSquare,
    Trash
} from "react-bootstrap-icons";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {AddBehavior} from "../Modals/AddBehavior/AddBehavior";

import "./ToolBar.scss";

ToolBar.propTypes = {
};

/**
 * Toolbar Component
 * @return {JSX.Element}
 */
export function ToolBar () {
    const [selectedTool, setSelectedTool] = useState("select");

    const {openModal} = useModalManager();

    const publish = useLayoutEventPublisher();
    const {engine} = useDalEngine();

    const saveGraph = useCallback(() => {
        if (engine) {
            engine.save();
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
                    title="Add Node"
                    className="icon"
                />
            </div>
            <div className="toolbarContainer bottom">
                <Floppy
                    onClick={(e) => saveGraph()}
                    title="Save Graph"
                    className="icon"
                />
            </div>

        </div>
    );
}
