export default async function fetchData() {
    const response = await fetch("https://jsonplaceholder.typicode.com/comments");
    return response.json();
}