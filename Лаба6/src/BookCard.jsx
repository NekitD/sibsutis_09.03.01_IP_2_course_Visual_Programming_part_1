import React from 'react';

let BookCard = function (props) {
    return (
        <div className="BookCard" style={{ width: "300px", height: "500px" }}>
            <img src={props.imageBLOB} alt={props.title} style={{ width: "80%", height: "60%", paddingLeft: "10%" }} className="BookCardImage"></img>
            <div style={{ fontSize: "18px", paddingTop: "15%" }} className="BookCardTitle">{props.title}</div>
            <div style={{ fontSize: "14px", paddingTop: "3%", color: "rgb(151, 150, 150)" }} className="BookCardAuthor" >{props.authors}</div>
        </div>
    );
}

export default BookCard;