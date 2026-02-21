import React from "react";

import {FlowDiagram} from "../Components/FlowDiagram/FlowDiagram";
import {SideContainer} from "./SideContainer/SideContainer";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

/**
 * Renders the Design Generator.
 * @return {JSX.Element}
 */
export function Viewer () {
    return (
        <div className="viewer-container">
            <div className="menu-container"></div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainer/>
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <FlowDiagram />
                </div>
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
