let loadData = async function () {
    let cats = [];
    let promise = fetch("https://catfact.ninja/breeds");
    let response = await promise;
    let page;
    if (response.ok) {
        page = await response.json();
    } else {
        throw Error("HTTP ERROR: " + response.status);
    }
    do {
        for (let i = 0; i < page.data.length; i++) {
            cats[cats.length] = page.data[i];
        }
        promise = fetch(page.next_page_url);
        response = await promise;
        if (response.ok) {
            page = await response.json();
        } else {
            throw Error("HTTP ERROR: " + response.status);
        }
    } while (page.next_page_url != null);
    return cats;

}

module.exports = { loadData };