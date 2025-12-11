export default async function fetchData() {
    const response = await fetch("https://fakeapi.extendsclass.com/books");
    return response.json();
}