import fetchData from "./fetchBooksData.js";

export default async function fetchImages(booksData) {
    if (!booksData || booksData.length === 0) return [];

    const images = await Promise.all(
        booksData.map(async (book) => {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
            const data = await response.json();
            return data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150";
        })
    );

    return images;
}