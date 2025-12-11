let orderBy = require('./orderBy.js');

let person1 = {
    name: "Nikita",
    age: 19,
};

let person2 = {
    name: "Maksim",
    age: 20,
};

let person3 = {
    name: "Alexey",
    age: 18,
};

let person4 = {
    name: "Katya",
    age: 19,
};

let person5 = {
    name: "Maksim",
    age: 18,
};

let nameless = {
    age: 18,
};

let ageless = {
    name: "Mikhail",
};

let people = [person1, person2, person3, person4, person5];
let nlpeople = [person1, nameless];
let alpeople = [person1, ageless];
let sorted = [person3, person4, person5, person2, person1];
let properties = ["name", "age"];

test('Normal work', () => { expect(orderBy(people, properties)).toStrictEqual(sorted) });
test('No name', () => { expect(() => orderBy(nlpeople, properties)).toThrow(Error) });
test('No age', () => { expect(() => orderBy(alpeople, properties)).toThrow(Error) });
