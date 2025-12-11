import React, { useState, useEffect } from 'react';
import DataSet from '../components/DataSet/DataSet';
import AddForm from '../components/Forms/AddForm';
import DeleteButton from '../components/DataSet/DeleteButton';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);
    // console.log(posts);

    const handleAdd = (newPost) => {
        const tempId = Date.now();
        setPosts(prev => [...prev, { ...newPost, id: tempId }]);

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(actualPost => {
                setPosts(prev => prev.map(p => p.id === tempId ? actualPost : p));
            });
    };

    const handleDelete = (ids) => {

        setPosts(prev => prev.filter(post => !ids.includes(post.id)));

        Promise.all(
            ids.map(id =>
                fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                    method: 'DELETE',
                })
            )
        );
    };

    const handleUpdate = (updatedPost) => {
        setPosts(prev => prev.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));

        fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedPost),
            headers: {
                'Content-type': 'application/json',
            },
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page">
            <h1>Posts</h1>
            <div className="controls">
                <AddForm
                    headers={['id', 'userId', 'title', 'body']}
                    onSubmit={handleAdd}
                />
                <DeleteButton
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                />
            </div>
            <DataSet
                objects={posts}
                names={0}
                onUpdate={handleUpdate}
                onSelectionChange={setSelectedIds}
            />
        </div>
    );
}

export default Posts;