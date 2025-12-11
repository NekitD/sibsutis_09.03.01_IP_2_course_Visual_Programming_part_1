import React from "react";
import Object from "./Object.jsx"

export default function Body(props) {
    return (
        <div className="body_content">
            {props.data.map((elem, index) => (
                <div key={index} className="Element">
                    {elem && <Object header={elem.header} body={elem.body} />}
                </div>
            ))}
        </div>);
}