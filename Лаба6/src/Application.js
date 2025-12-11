import React, { useState, useEffect, useMemo } from "react";
import BookCard from "./BookCard.jsx";
import fetchData from "./fetchBooksData.js";
import fetchImages from "./fetchBooksImages.js";
import Search from "./Searcher.jsx";

export default function Application() {

    const [booksData, setBooksData] = useState([]);
    const [booksImages, setBooksImages] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [sortOrder, setSortOrder] = useState("inc");

    useEffect(() => {
        async function loadBooks() {
            const data = await fetchData();
            setBooksData(data);
        }
        loadBooks();
    }, []);

    useEffect(() => {
        if (booksData.length === 0) return;
        async function loadImages() {
            const images = await fetchImages(booksData);
            setBooksImages(images);
        }
        loadImages();
    }, [booksData]);

    const filteredAndSortedBooks = useMemo(() => {
        return booksData
            .map((book, index) => ({ ...book, imageBLOB: booksImages[index] }))
            .filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (Array.isArray(book.authors) ? book.authors.join(", ") : book.authors)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                let valueA = a[sortBy];
                let valueB = b[sortBy];
                if (Array.isArray(valueA)) valueA = valueA.join(", ");
                if (Array.isArray(valueB)) valueB = valueB.join(", ");
                valueA = typeof valueA === "string" ? valueA.toLowerCase() : "";
                valueB = typeof valueB === "string" ? valueB.toLowerCase() : "";
                if (valueA < valueB) return sortOrder === "inc" ? -1 : 1;
                if (valueA > valueB) return sortOrder === "inc" ? 1 : -1;
                return 0;
            });
    }, [booksData, booksImages, searchQuery, sortBy, sortOrder]);

    return (
        <div>

            <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {filteredAndSortedBooks.map((book, index) => (
                    <BookCard
                        key={index}
                        title={book.title}
                        authors={Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                        imageBLOB={book.imageBLOB}
                    />
                ))}
            </div>
        </div>
    );
}