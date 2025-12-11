import React from "react";
import DataSet from "./DataSet";

export default function Application({ data, properties }) {

    return (
        <div className="App">
            <DataSet
                objects={data}
                names={properties}
            />
        </div>
    );
}