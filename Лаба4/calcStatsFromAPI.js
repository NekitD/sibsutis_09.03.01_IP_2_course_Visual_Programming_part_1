let calc = require('./calcStats.js');
let load = require('./loadData.js');

let calcStatsFromAPI = async function () {
    let data = await load.loadData();
    return calc(data);
}

module.exports = { calcStatsFromAPI };