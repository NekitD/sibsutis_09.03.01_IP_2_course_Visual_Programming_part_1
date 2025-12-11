let getDataFromAPI = async function () {
    let data = [];
    let promise = fetch("https://dummyjson.com/products.");
    let response = await promise;
    let json = await response.json();
    if (response.ok) {
        for (let i = 0; i < json.length; i++) {
            data[data.length] = json[i];
        }
    } else {
        throw Error("HTTP ERROR: " + response.status);
    }
    return data;
}

module.exports = { getDataFromAPI }