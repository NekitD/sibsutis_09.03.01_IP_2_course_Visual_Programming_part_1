/**
 * @jest-environment jsdom
 */
import App from './Application.js';
import React from 'react';
import { render, screen } from '@testing-library/react';

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
    'age': 41,
    'University': "TSU",
}

let objects = [obj1, obj2, obj3];
let properties = ['name', 'age', 'University'];


test('Work with properties names', () => {
    render(<App data={objects} properties={properties} />);

    properties.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
    });

    objects.forEach(obj => {
        expect(screen.getByText(obj.name)).toBeInTheDocument();
        expect(screen.getByText(obj.age.toString())).toBeInTheDocument();
    });
});

test('Work without properties names', () => {
    render(<App data={objects} />);
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
});