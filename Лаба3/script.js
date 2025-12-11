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

let people = [person1, person2, person3, person4, person5];
let properties = ["name", "age"];

import { orderBy } from `./orderBy.js`;

let sorted = orderBy(people, properties);

console.log(people);
console.log(sorted);
