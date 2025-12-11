import React from 'react';
import Component from "./Component.jsx";

export default function Application() {
    const head = "Frutis🍎🍌🍊";
    const content = ["Apple🍎", "Banana🍌", "Orange🍊"];
    return (
        <Component header={head} body={content} />
    );
}