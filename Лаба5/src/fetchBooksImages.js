import { useEffect, useState } from "react";
import fetchData from "./fetchBooksData.js";

export default function fetchImages() {
    const booksData = fetchData();
    const [bookImages, setBookImages] = useState([]);

    useEffect(() => {
        if (!booksData || booksData.length === 0) return;
        const images = [];
        async function getBooks() {
            for (let i = 0; i < booksData.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 500));

                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${booksData[i].isbn}`);
                const data = await response.json();
                const imageUrl = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150";

                images.push(imageUrl);
                setBookImages([...images]);

            }
        }
        getBooks();
    }, [booksData]);

    return bookImages;
}