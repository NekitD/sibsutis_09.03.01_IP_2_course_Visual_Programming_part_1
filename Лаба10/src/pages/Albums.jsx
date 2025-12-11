import React, { useState, useEffect } from 'react';
import DataSet from '../components/DataSet/DataSet';
import AddForm from '../components/Forms/AddForm';
import DeleteButton from '../components/DataSet/DeleteButton';

function Albums() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/albums')
            .then(res => res.json())
            .then(data => {
                setAlbums(data);
                setLoading(false);
            });
    }, []);
    // console.log(albums);

    const handleAdd = (newAlbum) => {
        const tempId = Date.now();
        setAlbums(prev => [...prev, { ...newAlbum, id: tempId }]);

        fetch('https://jsonplaceholder.typicode.com/albums', {
            method: 'POST',
            body: JSON.stringify(newAlbum),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(actualAlbum => {
                setAlbums(prev => prev.map(p => p.id === tempId ? actualAlbum : p));
            });
    };

    const handleDelete = (ids) => {

        setAlbums(prev => prev.filter(album => !ids.includes(album.id)));

        Promise.all(
            ids.map(id =>
                fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
                    method: 'DELETE',
                })
            )
        );
    };

    const handleUpdate = (updatedAlbum) => {
        setAlbums(prev => prev.map(album =>
            album.id === updatedAlbum.id ? updatedAlbum : album
        ));

        fetch(`https://jsonplaceholder.typicode.com/albums/${updatedAlbum.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedAlbum),
            headers: {
                'Content-type': 'application/json',
            },
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page">
            <h1>Albums</h1>
            <div className="controls">
                <AddForm
                    headers={['id', 'userId', 'title']}
                    onSubmit={handleAdd}
                />
                <DeleteButton
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                />
            </div>
            <DataSet
                objects={albums}
                names={0}
                onUpdate={handleUpdate}
                onSelectionChange={setSelectedIds}
            />
        </div>
    );
}

export default Albums;