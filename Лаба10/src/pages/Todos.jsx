import React, { useState, useEffect } from 'react';
import DataSet from '../components/DataSet/DataSet';
import AddForm from '../components/Forms/AddForm';
import DeleteButton from '../components/DataSet/DeleteButton';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(data => {
                setTodos(data);
                setLoading(false);
            });
    }, []);
    // console.log(todos);

    const handleAdd = (newTodo) => {
        const tempId = Date.now();
        setTodos(prev => [...prev, { ...newTodo, id: tempId }]);

        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(actualTodo => {
                setTodos(prev => prev.map(p => p.id === tempId ? actualTodo : p));
            });
    };

    const handleDelete = (ids) => {

        setTodos(prev => prev.filter(todo => !ids.includes(todo.id)));

        Promise.all(
            ids.map(id =>
                fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                    method: 'DELETE',
                })
            )
        );
    };

    const handleUpdate = (updatedTodo) => {
        setTodos(prev => prev.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        ));

        fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedTodo),
            headers: {
                'Content-type': 'application/json',
            },
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page">
            <h1>Todos</h1>
            <div className="controls">
                <AddForm
                    headers={['id', 'userId', 'title', 'completed']}
                    onSubmit={handleAdd}
                />
                <DeleteButton
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                />
            </div>
            <DataSet
                objects={todos}
                names={0}
                onUpdate={handleUpdate}
                onSelectionChange={setSelectedIds}
            />
        </div>
    );
}

export default Todos;