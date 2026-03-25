import React, {useMemo} from "react";

import {LayoutManager} from "ui-layout-manager-dev";

import layout from "./layout.json";
import GlobalProviders from "./Providers/GlobalProviders";
import { DalEngineProvider } from "./Providers/DalEngineProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

/**
 * Renders the application.
 *
 * @return {JSX.Element}
 */
export function App () {
    const registry = useMemo(() => ({
        BehavioralControlGraph: () =>
            import("./Components/BehavioralControlGraph/BehavioralControlGraph").then((m) => ({
                default: m.default || m.BehavioralControlGraph,
            })),
        EditorContainer: () =>
            import("./Components/EditorContainer/EditorContainer").then((m) => ({
                default: m.default || m.EditorContainer,
            })),
        FileSelector: () =>
            import("./Components/FileSelector/FileSelector").then((m) => ({
                default: m.default || m.FileSelector,
            })),
        PtyTerminal: () =>
            import("./Components/PtyTerminal/PtyTerminal").then((m) => ({
                default: m.default || m.PtyTerminal,
            })),
        ToolBar: () =>
            import("./Components/ToolBar/ToolBar").then((m) => ({
                default: m.default || m.ToolBar,
            })),
        StatusBar: () =>
            import("./Components/StatusBar/StatusBar").then((m) => ({
                default: m.default || m.StatusBar,
            })),
    }), []);

    return (
        <DalEngineProvider>
            <GlobalProviders>
                <div className="vw-100 vh-100">
                    <LayoutManager registry={registry} ldf={layout}/>
                </div>
            </GlobalProviders>
        </DalEngineProvider>
    );
}
