import React, { useState, useEffect } from 'react';
import DataSet from '../components/DataSet/UseDataSet';
import UserForm from '../components/Forms/UserForm';
import DeleteButton from '../components/DataSet/UseDeleteButton';
import './Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    const mainData = users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website
    }));

    const companyData = users.map(user => ({
        id: user.id,
        name: user.company.name,
        catchPhrase: user.company.catchPhrase,
        bs: user.company.bs
    }));

    const addressData = users.map(user => ({
        id: user.id,
        street: user.address.street,
        suite: user.address.suite,
        city: user.address.city,
        zipcode: user.address.zipcode
    }));

    const geoData = users.map(user => ({
        id: user.id,
        lat: user.address.geo.lat,
        lng: user.address.geo.lng
    }));

    const handleAdd = (newUser) => {
        const tempId = Date.now();
        const userToAdd = {
            ...newUser,
            id: tempId,
            company: {
                name: newUser.companyName,
                catchPhrase: newUser.catchPhrase,
                bs: newUser.bs
            },
            address: {
                street: newUser.street,
                suite: newUser.suite,
                city: newUser.city,
                zipcode: newUser.zipcode,
                geo: {
                    lat: newUser.lat,
                    lng: newUser.lng
                }
            }
        };

        setUsers(prev => [...prev, userToAdd]);

        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify(userToAdd),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(actualUser => {
                setUsers(prev => prev.map(p => p.id === tempId ? actualUser : p));
            });
    };

    const handleDelete = (ids) => {
        setUsers(prev => prev.filter(user => !ids.includes(user.id)));
        setSelectedIds([]);

        Promise.all(
            ids.map(id =>
                fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
                    method: 'DELETE',
                })
            )
        );
    };

    // const handleRowSelect = (id) => {
    //     setSelectedIds(prev =>
    //         prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    //     );
    // };

    const handleRowSelect = (ids) => {
        setSelectedIds(ids);
    };


    const handleUpdate = (updatedPartial) => {
        setUsers(prev => prev.map(user => {
            if (user.id === updatedPartial.id) {
                if ('name' in updatedPartial && 'username' in updatedPartial) {
                    return { ...user, ...updatedPartial };
                }
                else if ('catchPhrase' in updatedPartial || 'bs' in updatedPartial || 'name' in updatedPartial) {
                    return {
                        ...user,
                        company: {
                            ...user.company,
                            ...updatedPartial
                        }
                    };
                }
                else if ('street' in updatedPartial) {
                    return {
                        ...user,
                        address: {
                            ...user.address,
                            ...updatedPartial
                        }
                    };
                }
                else if ('lat' in updatedPartial) {
                    return {
                        ...user,
                        address: {
                            ...user.address,
                            geo: {
                                ...user.address.geo,
                                ...updatedPartial
                            }
                        }
                    };
                }
            }
            return user;
        }));



        const fullUser = users.find(u => u.id === updatedPartial.id);
        if (fullUser) {
            fetch(`https://jsonplaceholder.typicode.com/users/${updatedPartial.id}`, {
                method: 'PATCH',
                body: JSON.stringify(fullUser),
                headers: {
                    'Content-type': 'application/json',
                },
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page">
            <h1>Users</h1>
            <div className="controls">
                <UserForm onSubmit={handleAdd} />
                <DeleteButton
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                />
            </div>
            <div className='tables-container'>
                <DataSet
                    objects={mainData}
                    names={['id', 'name', 'username', 'email', 'phone', 'website']}
                    onSelectionChange={handleRowSelect}
                    selectedIds={selectedIds}
                    onUpdate={handleUpdate}
                />

                <DataSet
                    objects={companyData}
                    names={['name', 'catchPhrase', 'bs']}
                    selectedIds={selectedIds}
                    onRowSelect={handleRowSelect}
                    onUpdate={handleUpdate}
                />

                <DataSet
                    objects={addressData}
                    names={['street', 'suite', 'city', 'zipcode']}
                    selectedIds={selectedIds}
                    onRowSelect={handleRowSelect}
                    onUpdate={handleUpdate}
                />

                <DataSet
                    objects={geoData}
                    names={['lat', 'lng']}
                    selectedIds={selectedIds}
                    onRowSelect={handleRowSelect}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    );
}

export default Users;