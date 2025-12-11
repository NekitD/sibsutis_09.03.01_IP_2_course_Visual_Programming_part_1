import React from "react";

export default function Body(props) {
    return (
        <div className="body_content">
            {props.data.map((elem, index) => (
                <div key={index} className="Element">
                    {elem}
                </div>
            ))}
        </div>);
}