import React from "react";

export default function Searcher(props) {
    return <div>
        <input
            type="text"
            placeholder="Введите название города..."
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
    </div>
}