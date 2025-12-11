import React, { useState, useEffect } from "react";
import "./DataGrid.css";
import Body from "./Body.jsx";
import Header from "./Header.jsx";

export default function Object(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const renderHeader = () => {
        return (
            <div
                className="header-clickable"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Header header={props.header} />
            </div>
        );
    };
    return (
        <div className="Object">
            {renderHeader()}

            {isExpanded && (
                <div className="Body">
                    {props.body && <Body data={props.body} />}
                </div>
            )}

        </div>);

}