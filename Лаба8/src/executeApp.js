import React from 'react';
import App from "./Application.js";

let obj1 = {
    'name': "Nikita",
    'age': 20,
    'University': "SibSUTIS",
}

let obj2 = {
    'name': "Anton",
    'age': 19,
    'University': "NSTU",
}

let obj3 = {
    'name': "Evgeniy",
    'age': 18,
    'University': "TSU",
}

let obj4 = {
    'name': "Maria",
    'age': 19,
    'University': "NSU",
}

let obj5 = {
    'name': "Katerina",
    'University': "SibSUTIS",
}

let objects = [obj1, obj2, obj3, obj4, obj5];
let properties = ['name', 'age', 'University'];

export default function executor() {
    return (
        <App data={objects} properties={properties} />
    );
}