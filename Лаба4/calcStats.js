let calcStats = function (catsInfo) {
    let countries = [];
    for (let i = 0; i < (catsInfo.length); i++) {
        if (!("country" in catsInfo[i])) {
            throw new Error("Neccessary data field is absent!");
        }
        let repeat = false;
        for (let j = 0; j < (countries.length); j++) {
            if (catsInfo[i].country == countries[j].name) {
                repeat = true;
                countries[j].number += 1;
                break;
            }
        }
        if (!repeat) {
            countries[countries.length] = {
                name: catsInfo[i].country,
                number: 1,
            }
        }
    }
    return countries;
}

module.exports = calcStats;
