import React, { useState } from "react";
import Header from "./Header.jsx"
import Body from "./Body.jsx"
import "./Comp.css";

export default function Component(props) {
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
        <div className="Component">
            {renderHeader()}

            {isExpanded && (
                <div className="Body">
                    <Body data={props.body} />
                </div>
            )}

        </div>);
}