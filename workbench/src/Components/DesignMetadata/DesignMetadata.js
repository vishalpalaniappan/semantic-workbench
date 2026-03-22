import React, {useContext, useEffect, useRef, useState} from "react";

import {FileBrowser} from "sample-ui-component-library";

import ServerContext from "../../Providers/ServerContext";

import "./DesignMetadata.scss";

DesignMetadata.propTypes = {
};

/**
 * Component to display the design metadata.
 * @return {JSX.Element}
 */
export function DesignMetadata () {
    const {workspace} = useContext(ServerContext);

    const fileBrowserRef = useRef();

    const [dirTree, setDirTree] = useState([]);

    useEffect(() => {
        if (workspace) {
            fileBrowserRef.current.addFileTree(workspace);
        }
    }, [workspace]);


    const onSelectFile = (selectedFile) => {
        console.log("Selected file", selectedFile);
    };

    return (
        <div className="filebrowser-container">
            <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile}/>
        </div>
    );
}
