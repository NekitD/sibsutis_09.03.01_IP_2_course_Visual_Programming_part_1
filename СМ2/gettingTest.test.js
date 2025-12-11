let getting = require('./getFields.js');

let obj1 = {
    field: 28,
};

let obj2 = {
    field: 13,
};

let obj3 = {
    field: 15,
};

let obj4 = {
    field: 31,
};


let falseObj1 = {
    name: "Nikita",
};

let falseObj2 = {
};

let trueMas = [obj1, obj2, obj3, obj4];
let falseMas1 = [obj1, obj2, falseObj1];
let falseMas2 = [obj1, obj2, falseObj2];
let falseMas3 = [obj1, falseObj1, falseObj2];
let fields = ["field"];

let fields_val_mas = [28, 13, 15, 31];

test('Normal work', () => { expect(getting(trueMas, fields)).toStrictEqual(fields_val_mas) });
test('Wrong field', () => { expect(() => getting(falseMas1, fields)).toThrow(Error) });
test('No field', () => { expect(() => getting(falseMas2, fields)).toThrow(Error) });
test('Both wrong', () => { expect(() => getting(falseMas3, fields)).toThrow(Error) });