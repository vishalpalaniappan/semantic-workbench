import React, {useEffect, useState} from "react";

import Editor from "@monaco-editor/react";
import PropTypes from "prop-types";

ShowInfo.propTypes = {
    close: PropTypes.func.isRequired,
    args: PropTypes.object.isRequired,
};

/**
 * Show Info modal body component.
 * @return {JSX.Element}
 */
export function ShowInfo ({close, args}) {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (args && args.selected) {
            setContent(JSON.stringify(args.selected, null, 2));
        }
    }, [args]);

    const handleEditorMount = (editor, monaco) => {
        requestAnimationFrame(() => {
            editor.trigger("editor", "editor.foldLevel2");
        });
    };

    useEffect(() => {
        const handleKeyDown = (event) => (event.key === "Escape") && close();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close]);

    return (
        <div style={{width: "800px", height: "600px"}}>
            <Editor
                defaultLanguage="json"
                defaultValue=""
                value={content}
                theme="vs-dark"
                readOnly={true}
                onMount={handleEditorMount}
                options={{
                    minimap: {enabled: false},
                    lineNumbers: "off",
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                }}
            />
        </div>
    );
}
