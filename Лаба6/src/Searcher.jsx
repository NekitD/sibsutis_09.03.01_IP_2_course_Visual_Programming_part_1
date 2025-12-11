import React from "react";

export default function Searcher(props) {
    return <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
            type="text"
            placeholder="Поиск по названию или автору..."
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <select value={props.sortBy} onChange={(e) => props.setSortBy(e.target.value)}>
            <option value="title">Название</option>
            <option value="authors">Автор</option>
        </select>
        <select value={props.sortOrder} onChange={(e) => props.setSortOrder(e.target.value)}>
            <option value="inc">По возрастанию</option>
            <option value="dec">По убыванию</option>
        </select>
    </div>

}