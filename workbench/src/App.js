import React, {useEffect, useMemo, useState} from "react";

import {LayoutManager} from "ui-layout-manager-dev";

import layout from "./layout.json";
import GlobalProviders from "./Providers/GlobalProviders";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

/**
 * Renders the application.
 *
 * @return {JSX.Element}
 */
export function App () {
    const registry = useMemo(() => ({
        EditorVSCode: () =>
            import("./Components/FlowDiagram/FlowDiagram").then((m) => ({
                default: m.default || m.FlowDiagram,
            })),
        Stack: () =>
            import("./Components/FlowDiagram/FlowDiagram").then((m) => ({
                default: m.default || m.FlowDiagram,
            })),
        Flow: () =>
            import("./Components/FlowDiagram/FlowDiagram").then((m) => ({
                default: m.default || m.FlowDiagram,
            })),
    }), []);

    return (
        <GlobalProviders>
            <div className="vw-100 vh-100">
                <LayoutManager registry={registry} ldf={layout}/>
            </div>
        </GlobalProviders>
    );
}
