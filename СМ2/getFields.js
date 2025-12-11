let getFields = function(objs, fields){
    let fields_values = [];
    let counter = 0;
     for (let i = 0; i < (objs.length); i++) {
        for(let j = 0; j < fields.length; j++){
            if (!(fields[j] in objs[i])) {
                throw new Error("Neccessary data field is absent!");
                }
            
            fields_values[counter] = objs[i][fields[j]];
            counter++;
            }
        }
        return fields_values;
}

module.exports = getFields;