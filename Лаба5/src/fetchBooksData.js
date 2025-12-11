import React, { useEffect, useState } from 'react';
import BookCard from "./BookCard.jsx";


export default function fetchData() {

    let [bookCards, bookState] = useState([]);

    useEffect(() => {
        async function getBooks() {
            const promise = fetch('https://fakeapi.extendsclass.com/books');
            const respond = await promise;
            const booksData = await respond.json();
            bookState(booksData);
        }
        getBooks();
    }, []);
    return bookCards;
}