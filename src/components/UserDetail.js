import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [editUser, setEditUser] = useState({ username: '', email: '', password: '', roles: '' });
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !currentUser) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUser(response.data);
                setEditUser({
                    username: response.data.username,
                    email: response.data.email,
                    password: '',
                    roles: response.data.roles
                });
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                if (error.response?.status === 403) {
                    alert('You do not have permission to view this user.');
                    navigate('/login');
                }
            });
    }, [id, token, navigate]);

    const handleChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/users/${id}`, editUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUser(response.data);
                alert('User updated successfully!');
            })
            .catch(() => alert('Failed to update user'));
    };

    if (!token || !currentUser) {
        return <div style={styles.message}>Please login to view this page.</div>;
    }

    if (!user) return <div style={styles.message}>Loading...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>User Detail</h2>
            <div style={styles.card}>
                <p style={styles.info}><strong>ID:</strong> {user.id}</p>
                <p style={styles.info}><strong>Username:</strong> {user.username}</p>
                <p style={styles.info}><strong>Email:</strong> {user.email}</p>
                <p style={styles.info}><strong>Roles:</strong> {user.roles}</p>
            </div>

            {currentUser.roles === 'ADMIN' && (
                <>
                    <h3 style={styles.subtitle}>Update User</h3>
                    <form onSubmit={handleUpdate} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                name="username"
                                value={editUser.username}
                                onChange={handleChange}
                                placeholder="Username"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                value={editUser.email}
                                onChange={handleChange}
                                placeholder="Email"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                value={editUser.password}
                                onChange={handleChange}
                                placeholder="New Password (optional)"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                name="roles"
                                value={editUser.roles}
                                onChange={handleChange}
                                placeholder="Roles (ROLE_USER or ROLE_ADMIN)"
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>Update</button>
                    </form>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '28px',
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: '30px',
        marginBottom: '20px',
        color: '#333',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        color: '#555',
        fontSize: '18px',
        marginTop: '50px',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    info: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

styles.input[':focus'] = {
    borderColor: '#007bff',
};

styles.button[':hover'] = {
    backgroundColor: '#0056b3',
};

export default UserDetail;