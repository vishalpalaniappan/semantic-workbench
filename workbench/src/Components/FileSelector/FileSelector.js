import React, {useCallback, useEffect, useRef} from "react";

import {Floppy, PlusSquare, Trash} from "react-bootstrap-icons";
import {useDispatch} from "react-redux";
import {FileBrowser} from "sample-ui-component-library";
import {useLayoutEventPublisher} from "ui-layout-manager-dev";
import {useModalManager} from "ui-layout-manager-dev";

import {useDalEngine} from "../../Providers/GlobalProviders";
import {incrementCounter} from "../../Store/appSlice";
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
    const {engine} = useDalEngine();
    const {openModal} = useModalManager();
    const [selectedFile, setSelectedFile] = React.useState(null);

    const files = useEngineFiles();
    const dispatch = useDispatch();
    const fileBrowserRef = useRef();
    const publish = useLayoutEventPublisher();

    useEffect(() => {
        if (files) {
            /**
             * TODO: This is temporary because I haven't made
             * the libraries match, I will fix this soon. The
             * engine saves path as key and doesn't have some
             * necessary keys
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
        setSelectedFile(node);
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

    const deleteFile = useCallback(() => {
        if (selectedFile) {
            try {
                engine.removeFile(selectedFile.path);
                dispatch(incrementCounter());
            } catch (err) {
                console.error(err);
            }
        }
    }, [engine, selectedFile, dispatch]);

    return (
        <div className="filebrowser-container">
            <div className="browser-container">
                <FileBrowser ref={fileBrowserRef} onSelectFile={onSelectFile}/>
            </div>
            <div className="menu">
                <Floppy className="icon"/>
                <PlusSquare onClick={createFile} className="icon"/>
                <Trash onClick={deleteFile} className="icon"/>
            </div>
        </div>
    );
}
