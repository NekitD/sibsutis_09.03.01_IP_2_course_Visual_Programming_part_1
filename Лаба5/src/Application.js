import React from "react";
import BookCard from "./BookCard.jsx";
import fetchData from "./fetchBooksData.js";
import fetchImages from "./fetchBooksImages.js";

export default function Application() {
    const booksData = fetchData();
    const booksImages = fetchImages();

    if (booksData.length === 0 || booksImages.length === 0) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {booksData.map((book, index) => (
                <BookCard
                    key={index}
                    title={book.title}
                    authors={Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                    imageBLOB={booksImages[index]}
                />
            ))}
        </div>
    );
}