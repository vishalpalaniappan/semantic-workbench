import React, {useCallback, useEffect, useRef, useState} from "react";

import {Diagram2, Gear, Keyboard} from "react-bootstrap-icons";

import {DesignMetadata} from "../../Components/DesignMetadata/DesignMetadata";

import "./SideContainer.scss";

/**
 * Renders the side menu and accordion containers.
 * @return {JSX.Element}
 */
export function SideContainer () {
    const [activeMenu, setActiveMenu] = useState(1);

    const accordion = useRef();
    const handle = useRef();
    const downValueX = useRef();

    const SIDE_MENU_WIDTH = 50;
    const ACCORDION_WIDTH = 200;
    const MIN_EDITOR_WIDTH = 400;
    const MIN_ACCORDION_WIDTH = 200;

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        handle.current.classList.add("handle-active");
        downValueX.current = e.clientX;
    };

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.clientX - downValueX.current;
        const newWidth = accordion.current.getBoundingClientRect().width + delta;
        const MAX_ACCORDION_WIDTH = document.body.clientWidth - SIDE_MENU_WIDTH - MIN_EDITOR_WIDTH;
        if (newWidth > MIN_ACCORDION_WIDTH && newWidth < MAX_ACCORDION_WIDTH) {
            accordion.current.style.width = newWidth + "px";
            downValueX.current = e.clientX;
        }
    }, []);

    const handleMouseUp = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handle.current.classList.remove("handle-active");
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const getActiveMenuComponent = () => {
        if (activeMenu === 1) {
            return <DesignMetadata />;
        } else if (activeMenu === 2) {
        } else if (activeMenu === 3) {
        }
    };

    return (
        <div className="side-container d-flex flex-row">
            <div className="menu d-flex flex-column" style={{width: SIDE_MENU_WIDTH+"px"}}>
                <div className="d-flex flex-column align-items-center">
                    <Diagram2 className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(1);}}
                        style={{color: activeMenu == 1 ? "white": "grey"}}/>
                </div>
                <div className="mt-auto d-flex flex-column align-items-center">
                    <Keyboard className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(3);}}
                        style={{color: activeMenu == 3 ? "white": "grey"}}/>
                    <Gear className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(2);}}
                        style={{color: activeMenu == 2 ? "white": "grey"}}/>
                </div>
            </div>
            <div className="accordion" ref={accordion} style={{width: ACCORDION_WIDTH+"px"}}>
                {getActiveMenuComponent()}
            </div>
            <div className="handle" ref={handle} onMouseDown={handleMouseDown}></div>
        </div>
    );
}
