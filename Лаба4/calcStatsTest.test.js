let calcStats = require('./calcStats.js');

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

let fcat = {
    breed: "we",
    origin: "badas",
    coat: "black",
    pattern: "fearful",
}

let cats = [cat1, cat2, cat3, cat4];
let fcats = [cat1, cat2, cat3, cat4, fcat];

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

let countries = [Ger, Eng, Pol];

test('calcStatsTest', () => { expect(calcStats(cats)).toStrictEqual(countries) });
test('calcWrongStatsTest', () => { expect(() => calcStats(fcats)).toThrow(Error) });