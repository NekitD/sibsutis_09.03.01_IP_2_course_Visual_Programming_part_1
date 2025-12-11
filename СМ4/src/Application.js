import React from "react";
import Person from "./Person.jsx";

const people = [{
    "id": 1,
    "fullName": "John Andrews",
    "name": {
        "firstName": "John",
        "lastName": "Andrews"
    },
    "address": {
        "line": "6 Highcross Road",
        "town": "Upper Norton",
        "county": "Northshire",
        "country": "England"
    },
    "email": "john@example.com"
}, {
    "id": 2,
    "fullName": "Peter Munro",
    "name": {
        "firstName": "Peter",
        "lastName": "Munro"
    },
    "address": {
        "line": "16 The Harbor",
        "town": "Newport",
        "county": "Gwent",
        "country": "Wales"
    },
    "email": "peter@example.com"
}, {
    "id": 3,
    "fullName": "Dave Mallon",
    "name": {
        "firstName": "Dave",
        "lastName": "Mallon"
    },
    "address": {
        "line": "5 The Villas",
        "town": "Stourbridge",
        "county": "Devon",
        "country": "England"
    },
    "email": "dave@example.com"
},]

export default function Application() {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {people.map((person, id) => (
                <Person
                    id={id}
                    fullName={person.fullName}
                    firstName={person.name.firstName}
                    lastName={person.name.lastName}
                    line={person.address.line}
                    town={person.address.town}
                    county={person.address.county}
                    country={person.address.country}
                    email={person.email}
                />
            ))}
        </div>
    );
}