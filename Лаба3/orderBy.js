let firstBy = require('thenby');
let orderBy = function (array, properties) {
    let new_array = array;
    for (let i = 0; i < array.length; i++) {
        if (!("name" in array[i]) || !("age" in array[i])) {
            throw new Error("One of neccessary data fields is absent!");
        }
        new_array[i] = array[i];
    }
    new_array.sort(firstBy(properties[0]).thenBy(properties[1]));
    return new_array;
}

module.exports = orderBy;
