import React, { useState } from "react";
import "./DataSet.css";

export default function DataSet(props) {
    const [selectedRows, setSelectedRows] = useState(new Set());
    let headers = [];
    if ((props.names) && (props.names.length > 0)) {
        headers = props.names;
    } else if ((props.objects) && (props.objects.length > 0)) {
        headers = Object.keys(props.objects[0]);
    }

    for (let i = 0; i < props.objects.length; i++) {
        for (let j = 0; j < headers.length; j++) {
            if (!(headers[j] in props.objects[i])) {
                props.objects[i][headers[j]] = '-';
            }
        }
    }


    const handleRowSelection = (index_tr, event) => {
        if (event.ctrlKey || event.metaKey) {
            setSelectedRows(prev => {
                const newSelection = new Set(prev);
                newSelection.has(index_tr) ? newSelection.delete(index_tr) : newSelection.add(index_tr);
                return newSelection;
            });
        } else {
            setSelectedRows(prev => prev.has(index_tr) ? new Set() : new Set([index_tr]));
        }
    };

    if (!headers.length) {
        return <div>Ошибка, отсутствуют данные</div>;
    }
    return (
        <div>
            <table className="Table">
                <thead>
                    <tr className="headers">
                        <td className="selection-indicator"></td>
                        {headers.map((header, index) => (
                            <td className="header" key={`header-${index}`}>
                                {header}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.objects.map((object, index_tr) => (
                        <tr key={`row-${index_tr}`}
                            className={selectedRows.has(index_tr) ? 'selected-row' : ''}
                            onClick={(e) => handleRowSelection(index_tr, e)}>
                            <td className="selection-indicator"></td>
                            {headers.map((header, index_td) => (
                                <td className="cell" key={`cell-${index_tr}-${index_td}`}>
                                    {object[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>);
}