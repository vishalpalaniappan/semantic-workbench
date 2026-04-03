import React, {useCallback, useEffect, useRef} from "react";

import {Floppy, PlusSquare, Trash} from "react-bootstrap-icons";
import {FileBrowser} from "sample-ui-component-library";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useWorkspace} from "../../Providers/GlobalProviders";
import {useDalEngine} from "../../Providers/GlobalProviders";
import {useEngineFiles} from "../../Store/useAppSelection";
import {AddFile} from "../Modals/AddFile";

import "./FileSelector.scss";

FileSelector.propTypes = {
};

/**
 * Component to select files from the workspace.
 * @return {JSX.Element}
 */
export function FileSelector () {
    const {workspace} = useWorkspace();
    const {engine} = useDalEngine();
    const files = useEngineFiles();
    const {openModal} = useModalManager();

    const fileBrowserRef = useRef();
    const publish = useLayoutEventPublisher();

    useEffect(() => {
        if (workspace) {
            console.log(workspace);
            fileBrowserRef.current.addFileTree(workspace);
        }
    }, [workspace]);

    useEffect(() => {
        if (files && files.length > 0) {
            /**
             * TODO: This is temporary because I haven't made
             * the libraries match, I will fix this soon. The 
             * engine saves path as key and doesn't have some
             * necessary keys.
             */
            for (const file of files) {
                file["uid"] = file.name;
                file["path"] = file.key;
                file["type"] = "file";
            }
            fileBrowserRef.current.addFileTree(files);
        }
    }, [files]);

    const onSelectFile = (node) => {
        publish({
            type: "file:selected",
            payload: node,
            source: "file-tree",
        });
    };

    const createFile = useCallback(() => {
        openModal({
            title: "Add File",
            render: ({close}) => {return <AddFile close={close} />;},
        });
    }, []);

    return (
        <div className="filebrowser-container">
            <div className="browser-container">
                <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile}/>
            </div>
            <div className="menu">
                <Floppy className="icon"/>
                <PlusSquare onClick={createFile} className="icon"/>
                <Trash className="icon"/>
            </div>
        </div>
    );
}
