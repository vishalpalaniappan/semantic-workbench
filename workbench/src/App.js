import React, {useMemo} from "react";

import {LayoutManager} from "ui-layout-manager-dev";

import layout from "./layout.json";
import GlobalProviders from "./Providers/GlobalProviders";

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
        BehaviorInfo: () =>
            import("./Components/BehaviorInfo/BehaviorInfo").then((m) => ({
                default: m.default || m.BehaviorInfo,
            })),
    }), []);

    return (
        <GlobalProviders>
            <div className="app-container">
                <LayoutManager registry={registry} ldf={layout}/>
            </div>
        </GlobalProviders>
    );
}
