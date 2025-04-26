import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SimulateLogin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserSelect = (event) => {
        const userId = event.target.value;
        setSelectedUserId(userId);
    };

    const handleLogin = () => {
        if (!selectedUserId) {
            setError('Please select a user');
            return;
        }
        // Store the selected user ID in localStorage for persistence
        localStorage.setItem('currentUserId', selectedUserId);
        // Navigate to Home page with user ID
        navigate(`/home/${selectedUserId}`);
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Simulate Login (Development Mode)</h2>
            <div className="mb-4">
                <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a User
                </label>
                <select
                    id="userSelect"
                    value={selectedUserId}
                    onChange={handleUserSelect}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.userId} value={user.userId}>
                            {user.name} ({user.username})
                        </option>
                    ))}
                </select>
            </div>
            {selectedUserId && (
                <div className="text-sm text-gray-600 mb-4">
                    Selected User ID: {selectedUserId}
                </div>
            )}
            <button
                onClick={handleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
                Login
            </button>
        </div>
    );
};

export default SimulateLogin; 