import React from 'react';

let Person = function (props) {
    return (
        <div className="Person" style={{ width: "300px", height: "500px" }}>
            <div className="id"><strong>id:</strong> {props.id}</div>
            <div className="FullName" ><strong>Full name:</strong> {props.fullName}</div>
            <div className="Name" >
                <div><strong>Name:</strong></div>
                <div style={{ paddingLeft: "15%", paddingTop: "10%" }} className="FirstName" ><strong>First name:</strong> {props.firstName}</div>
                <div style={{ paddingLeft: "15%", paddingBottom: "10%" }} className="LastName" ><strong>Last name:</strong> {props.lastName}</div>
            </div>
            <div className="Address" >
                <div><strong></strong>Address:</div>
                <div style={{ paddingLeft: "15%", paddingTop: "10%" }} className="Line" ><strong>Line:</strong> {props.line}</div>
                <div style={{ paddingLeft: "15%" }} className="Town" ><strong>Town:</strong> {props.town}</div>
                <div style={{ paddingLeft: "15%" }} className="County" ><strong>County:</strong> {props.county}</div>
                <div style={{ paddingLeft: "15%", paddingBottom: "10%" }} className="Country" ><strong>Country:</strong> {props.country}</div>
            </div>
            <div className="Email" ><strong>email:</strong> {props.email}</div>
        </div>
    );
}

export default Person;