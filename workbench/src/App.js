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
        Flow: () =>
            import("./Components/FlowDiagram/FlowDiagram").then((m) => ({
                default: m.default || m.FlowDiagram,
            })),
        EditorContainer: () =>
            import("./Components/EditorContainer/EditorContainer").then((m) => ({
                default: m.default || m.EditorContainer,
            })),
        DesignMetadata: () =>
            import("./Components/DesignMetadata/DesignMetadata").then((m) => ({
                default: m.default || m.DesignMetadata,
            })),
        PtyTerminal: () =>
            import("./Components/PtyTerminal/PtyTerminal").then((m) => ({
                default: m.default || m.PtyTerminal,
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
