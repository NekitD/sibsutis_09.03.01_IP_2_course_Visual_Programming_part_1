import React, { useState, useEffect } from "react";
import "./DataGrid.css";
import Body from "./Body.jsx";
import Header from "./Header.jsx";
// import Object from "./Body.jsx";

export default function DataGrid(props) {
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
        <div className="DataGrid">
            {renderHeader()}

            {isExpanded && (
                <div className="Body">
                    <Body data={props.body} />
                </div>
            )}

        </div>);
}