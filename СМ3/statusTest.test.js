let getData = require('./getDataFromAPI.js');
let getStatus = require('./getStatus.js');

let product1 = {
    category: "good",
}

let product2 = {
    category: "ok",
}

let product3 = {
    category: "soso",
}

let product4 = {
    category: "bad",
}

let product5 = {
    category: "bad",
}

let data = [product1, product2, product3, product4, product5];

let status = {
    good: 1,
    ok: 1,
    soso: 1,
    bad: 2,
}

jest.spyOn(getData, 'getDataFromAPI').mockResolvedValue(data);

test("Status test", async () => {
    result = await getStatus.getStatus();
    expect(result).toStrictEqual(status);
});
