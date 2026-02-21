import React, {useEffect, useState} from "react";

import GlobalProviders from "./Providers/GlobalProviders";
import {Viewer} from "./Viewer/Viewer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

/**
 * Renders the application.
 *
 * @return {JSX.Element}
 */
export function App () {
    return (
        <GlobalProviders>
            <div className="vw-100 vh-100">
                <Viewer />
            </div>
        </GlobalProviders>
    );
}
