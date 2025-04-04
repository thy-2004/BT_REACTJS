import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !currentUser) {
            navigate('/login');
            return;
        }

        if (currentUser.roles === 'ADMIN') {
            fetchUsers();
        }
    }, [token, navigate]);

    const fetchUsers = () => {
        axios.get('http://localhost:8080/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setUsers(response.data))
            .catch(() => alert('You are not authorized'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:8080/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    alert('User deleted successfully!');
                    fetchUsers();
                })
                .catch(() => alert('Failed to delete user'));
        }
    };

    if (!token || !currentUser) {
        return <div style={styles.message}>Please login to view this page.</div>;
    }

    if (currentUser.roles !== 'ADMIN') {
        return <div style={styles.message}>You need ADMIN role to view this page.</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>User List</h2>
            <ul style={styles.list}>
                {users.map(user => (
                    <li key={user.id} style={styles.listItem}>
                        <Link to={`/user/${user.id}`} style={styles.link}>{user.username}</Link>
                        <button onClick={() => handleDelete(user.id)} style={styles.deleteButton}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px',
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        color: '#555',
        fontSize: '18px',
        marginTop: '50px',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '16px',
    },
    deleteButton: {
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

styles.listItem[':hover'] = {
    transform: 'translateY(-2px)',
};

styles.link[':hover'] = {
    textDecoration: 'underline',
};

styles.deleteButton[':hover'] = {
    backgroundColor: '#c82333',
};

export default UserList;