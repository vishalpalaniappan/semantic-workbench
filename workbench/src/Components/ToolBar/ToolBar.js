import React, {useContext, useEffect, useState} from "react";

import {
    Cursor,
    NodePlus,
    Square,
    Trash
} from "react-bootstrap-icons";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import "./ToolBar.scss";

ToolBar.propTypes = {
};

/**
 * Toolbar Component
 * @return {JSX.Element}
 */
export function ToolBar () {
    const [selectedTool, setSelectedTool] = useState("select");

    const publish = useLayoutEventPublisher();

    const selectTool = (tool) => {
        setSelectedTool(tool);
        publish({
            type: "tool:selected",
            payload: tool,
            source: "tool-bar",
        });
    };

    return (
        <div className="toolbarWrapper">
            <div className="toolbarContainer">
                <Cursor
                    onClick={(e) => selectTool("select")}
                    style={{color: selectedTool === "select" ? "white": "grey"}}
                    title="Select"
                    className="icon"
                />
                <Square
                    onClick={(e) => selectTool("drop")}
                    style={{color: selectedTool === "drop" ? "white": "grey"}}
                    title="Add Node"
                    className="icon"
                />
                <Trash
                    onClick={(e) => selectTool("delete")}
                    style={{color: selectedTool === "delete" ? "white": "grey"}}
                    title="Delete Node"
                    className="icon"
                />
            </div>
            <div className="toolbarContainer bottom">

            </div>

        </div>
    );
}
