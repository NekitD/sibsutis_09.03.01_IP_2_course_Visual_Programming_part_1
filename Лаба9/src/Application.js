import React, { useState, useEffect, useOptimistic } from "react";
import DataSet from "./DataSet";
import AddCommentForm from "./AddCommentForm";
import DeleteButton from "./DeleteButton";

export default function Application() {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optimisticComments, addOptimisticComment] = useOptimistic(
        comments,
        (state, action) => {
            switch (action.type) {
                case 'add':
                    return [...state, action.comment];
                case 'delete':
                    return state.filter(comment => !action.ids.includes(comment.id));
                case 'update':
                    return state.map(comment =>
                        comment.id === action.comment.id ? action.comment : comment
                    );
                default:
                    return state;
            }
        }
    );
    const [selectedCommentIds, setSelectedCommentIds] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then(response => {
                if (!response.ok) throw new Error('NETWORK ERROR');
                return response.json();
            })
            .then(data => {
                setComments(data.slice(0, 50));
                setLoading(false);
                console.log(data);
            });
    }, []);
    if (loading) return <div>Загрузка...</div>;

    const handleAddComment = (newComment) => {
        console.log('Adding comment:', newComment);
        const tempId = Date.now();
        const commentWithId = {
            ...newComment,
            id: tempId,
            postId: 1
        };
        setComments(prev => [...prev, commentWithId]);

        fetch('https://jsonplaceholder.typicode.com/comments', {
            method: 'POST',
            body: JSON.stringify(commentWithId),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add comment');
                return response.json();
            })
            .then(actualComment => {
                setComments(prev => prev.map(comment =>
                    comment.id === tempId ? actualComment : comment
                ));
            });
    };

    const handleDeleteComments = (selectedIds) => {
        addOptimisticComment({ type: 'delete', ids: selectedIds });

        Promise.all(
            selectedIds.map(id =>
                fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
                    method: 'DELETE',
                })
            )
        )
            .then(responses => {
                const allOk = responses.every(response => response.ok);
                if (!allOk) throw new Error('Failed to delete some comments');
                setComments(prev => prev.filter(comment => !selectedIds.includes(comment.id)));
            })
    };

    const handleUpdateComment = (updatedComment) => {
        addOptimisticComment({ type: 'update', comment: updatedComment });

        fetch(`https://jsonplaceholder.typicode.com/comments/${updatedComment.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedComment),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update comment');
                return response.json();
            })
            .then(actualComment => {
                setComments(prev => prev.map(comment =>
                    comment.id === updatedComment.id ? actualComment : comment
                ));
            });
    };

    return (
        <div className="App">
            <div className="controls">
                <AddCommentForm onAdd={handleAddComment} />
                <DeleteButton
                    onDelete={handleDeleteComments}
                    selectedIds={selectedCommentIds}
                />
            </div>
            <DataSet
                objects={optimisticComments}
                onUpdate={handleUpdateComment}
                onSelectionChange={setSelectedCommentIds}
            />
        </div>
    );
}