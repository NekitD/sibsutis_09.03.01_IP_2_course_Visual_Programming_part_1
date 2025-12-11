let getData = require('./getDataFromAPI.js');

let getStatus = async function () {
    let data = await getData.getDataFromAPI();
    let categories = {

    };
    for (let i = 0; i < data.length; i++) {
        let c = data[i].category;
        if (data[i].category in categories) {
            categories[data[i].category] += 1;
        } else {
            categories[data[i].category] = 1;
        }

    }
    return categories;
}

module.exports = { getStatus };