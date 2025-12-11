import React, { useState, useEffect } from "react";
import "./DataSet.css";

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export default function DataSet(props) {
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState("");

    // useEffect(() => {
    //     if (props.onSelectionChange) {
    //         const selectedIds = props.objects
    //             .filter((_, index) => selectedRows.has(index))
    //             .map(obj => obj.id);
    //         props.onSelectionChange(selectedIds);
    //     }
    // }, [selectedRows, props.objects, props.onSelectionChange]);

    useEffect(() => {
        if (props.onSelectionChange) {
            const selectedIds = Array.from(selectedRows).map(index =>
                props.objects[index].id
            );
            props.onSelectionChange(selectedIds);
        }
    }, [selectedRows, props.objects, props.onSelectionChange]);

    let headers = [];
    if (props.names && props.names.length > 0) {
        headers = props.names.map(name => ({
            key: name,
            label: name.split('.').pop(),
            isNested: name.includes('.')
        }));
    } else if (props.objects && props.objects.length > 0) {
        headers = Object.keys(props.objects[0]).map(key => ({
            key,
            label: key,
            isNested: false
        }));
    }

    const prepareData = () => {
        return props.objects.map(obj => {
            const newObj = { ...obj };
            headers.forEach(header => {
                if (!(header.key in newObj)) {
                    newObj[header.key] = header.isNested
                        ? getNestedValue(obj, header.key) || '-'
                        : '-';
                }
            });
            return newObj;
        });
    };

    const objectsWithDefaults = prepareData();

    const handleRowSelection = (index_tr, event) => {
        if (event.ctrlKey || event.metaKey) {
            setSelectedRows(prev => {
                const newSelection = new Set(prev);
                newSelection.has(index_tr) ? newSelection.delete(index_tr) : newSelection.add(index_tr);
                return newSelection;
            });
        } else {
            setSelectedRows(prev =>
                prev.size === 1 && prev.has(index_tr) ? new Set() : new Set([index_tr])
            );
        }
    };

    const handleCellDoubleClick = (rowIndex, headerKey) => {
        const originalObject = props.objects[rowIndex];
        let value;

        if (headerKey.includes('.')) {
            const keys = headerKey.split('.');
            value = originalObject[keys[0]][keys[1]];
        } else {
            value = originalObject[headerKey];
        }

        setEditingCell([rowIndex, headerKey]);
        setEditValue(value);
    };

    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleEditBlur = () => {
        if (editingCell && props.onUpdate) {
            const [rowIndex, headerKey] = editingCell;
            const originalObject = props.objects[rowIndex];

            if (headerKey.includes('.')) {
                const keys = headerKey.split('.');
                const updatedObject = {
                    ...originalObject,
                    [keys[0]]: {
                        ...originalObject[keys[0]],
                        [keys[1]]: editValue
                    }
                };
                props.onUpdate(updatedObject);
            } else {
                const updatedObject = {
                    ...originalObject,
                    [headerKey]: editValue
                };
                props.onUpdate(updatedObject);
            }
        }
        setEditingCell(null);
    };

    // const handleEditBlur = () => {
    //     if (editingCell && props.onUpdate) {
    //         const [rowIndex, headerKey] = editingCell;
    //         const originalObject = props.objects[rowIndex];

    //         const updatedPartial = {
    //             id: originalObject.id,
    //             [headerKey]: editValue
    //         };

    //         props.onUpdate(updatedPartial);
    //     }
    //     setEditingCell(null);
    // };

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
                                {header.label}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {objectsWithDefaults.map((object, index_tr) => (
                        <tr key={`row-${index_tr}`}
                            className={selectedRows.has(index_tr) ? 'selected-row' : ''}
                            onClick={(e) => handleRowSelection(index_tr, e)}>
                            <td className="selection-indicator"></td>
                            {headers.map((header, index_td) => (
                                <td
                                    className="cell"
                                    key={`cell-${index_tr}-${index_td}`}
                                    onDoubleClick={() => handleCellDoubleClick(index_tr, header.key)}
                                >
                                    {editingCell && editingCell[0] === index_tr && editingCell[1] === header.key ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={handleEditChange}
                                            onBlur={handleEditBlur}
                                            autoFocus
                                        />
                                    ) : (
                                        object[header.key]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}