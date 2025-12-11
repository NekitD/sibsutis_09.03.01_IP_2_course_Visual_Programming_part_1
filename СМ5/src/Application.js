import React, { useState, useEffect, useMemo } from "react";
import Object from "./Object.jsx";
import fetchData from "./fetchData.js";
import Search from "./Searcher.jsx";

export default function Application() {
    const [Data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        async function loadData() {
            const data = await fetchData();
            setData(data);
        }
        loadData();
    }, []);

    const filteredAndSortedData = useMemo(() => {
        return Data
            .filter(obj => obj.body.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                let valueA = sortBy === 'postId' ? a.postId : a.name;
                let valueB = sortBy === 'postId' ? b.postId : b.name;

                if (typeof valueA === "string") valueA = valueA.toLowerCase();
                if (typeof valueB === "string") valueB = valueB.toLowerCase();

                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
                return 0;
            });
    }, [Data, searchQuery, sortBy]);

    return (
        <div>
            <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {filteredAndSortedData.map((obj, index) => (
                    <Object
                        key={index}
                        postId={obj.postId}
                        id={obj.id}
                        name={obj.name}
                        email={obj.email}
                        body={obj.body}
                    />
                ))}
            </div>
        </div>
    );
}