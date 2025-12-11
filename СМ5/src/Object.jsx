import React from 'react';

let Object = function (props) {
    return (
        <div className="Object" style={{ width: "300px", height: "300px" }}>
            <div style={{ fontSize: "14px", paddingTop: "3%" }} className="postId" ><strong>postId: </strong>{props.postId}</div>
            <div style={{ fontSize: "14px", paddingTop: "3%" }} className="id" ><strong>id: </strong>{props.id}</div>
            <div style={{ fontSize: "14px", paddingTop: "3%" }} className="name" ><strong>name: </strong>{props.name}</div>
            <div style={{ fontSize: "14px", paddingTop: "3%" }} className="email" ><strong>email: </strong>{props.email}</div>
            <div style={{ fontSize: "14px", paddingTop: "3%" }} className="body" ><strong>body: </strong>{props.body}</div>
        </div>
    );
}

export default Object;