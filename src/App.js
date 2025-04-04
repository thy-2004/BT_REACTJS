import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import { useEffect } from 'react';

function App() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        if (!token && !user) {
            navigate('/login');
        }
    }, [token, user, navigate]);

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.navLinks}>
                    <Link to="/register" style={styles.link}>Register</Link>
                    <Link to="/login" style={styles.link}>Login</Link>
                    {token && user && (
                        <>
                            <Link to="/users" style={styles.link}>User List</Link>
                            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                        </>
                    )}
                </div>
            </nav>
            <div style={styles.content}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/user/:id" element={<UserDetail />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        flexDirection: 'column',
    },
    navbar: {
        backgroundColor: '#007bff',
        padding: '15px 30px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    content: {
        flex: 1,
        paddingTop: '80px', // Để lại khoảng trống cho navbar cố định
        paddingBottom: '40px',
    },
};

// Thêm hiệu ứng hover
styles.link[':hover'] = {
    backgroundColor: '#0056b3',
};

styles.logoutButton[':hover'] = {
    backgroundColor: '#c82333',
};

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}