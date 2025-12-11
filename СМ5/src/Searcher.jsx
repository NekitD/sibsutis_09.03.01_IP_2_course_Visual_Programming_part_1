import React from "react";

export default function Searcher(props) {
    return (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <input
                type="text"
                placeholder="Поиск по body..."
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                style={{ padding: "8px", width: "250px", marginRight: "10px" }}
            />
            <select value={props.sortBy} onChange={(e) => props.setSortBy(e.target.value)}>
                <option value="name">name</option>
                <option value="postId">postId</option>
            </select>
        </div>
    );
}