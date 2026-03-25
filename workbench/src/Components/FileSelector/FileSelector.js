import React, {useContext, useEffect, useRef} from "react";

import {FileBrowser} from "sample-ui-component-library";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";

import {useWorkspace} from "../../Providers/GlobalProviders";

import "./FileSelector.scss";

FileSelector.propTypes = {
};

/**
 * Component to select files from the workspace.
 * @return {JSX.Element}
 */
export function FileSelector () {
    const workspace = useWorkspace();

    const fileBrowserRef = useRef();
    const publish = useLayoutEventPublisher();

    useEffect(() => {
        if (workspace) {
            fileBrowserRef.current.addFileTree(workspace);
        }
    }, [workspace]);

    const onSelectFile = (node) => {
        publish({
            type: "file:selected",
            payload: node,
            source: "file-tree",
        });
    };

    return (
        <div className="filebrowser-container">
            <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile}/>
        </div>
    );
}
