let API = require('./calcStatsFromAPI.js');
let load = require('./loadData.js');

let cat1 = {
    breed: "bb",
    country: "Germany",
    origin: "idk",
    coat: "red",
    pattern: "angry",
}

let cat2 = {
    breed: "ee",
    country: "England",
    origin: "lmao",
    coat: "grey",
    pattern: "angry",
}

let cat3 = {
    breed: "op",
    country: "Germany",
    origin: "lol",
    coat: "white",
    pattern: "peaceful",
}

let cat4 = {
    breed: "we",
    country: "Poland",
    origin: "badas",
    coat: "black",
    pattern: "fearful",
}

let Ger = {
    name: "Germany",
    number: 2,
}

let Eng = {
    name: "England",
    number: 1,
}

let Pol = {
    name: "Poland",
    number: 1,
}

let mockCats = [cat1, cat2, cat3, cat4];
let countries = [Ger, Eng, Pol];

test("API test", async () => {
    jest.spyOn(load, 'loadData').mockResolvedValue(mockCats);
    result = await API.calcStatsFromAPI();
    expect(result).toStrictEqual(countries);
    expect(load.loadData).toHaveBeenCalledTimes(1);
});
