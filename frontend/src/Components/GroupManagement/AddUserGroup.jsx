import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddUserGroup() {
    const { groupId } = useParams();
    const [allUsers, setAllUsers] = useState([]);
    const [group, setGroup] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                // Fetch group details first
                const groupRes = await fetch(`http://localhost:8080/api/user-groups/${groupId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!groupRes.ok) throw new Error('Failed to fetch group details');
                setGroup(await groupRes.json());

                // Fetch all registered users
                const usersRes = await fetch('http://localhost:8080/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!usersRes.ok) throw new Error('Failed to fetch users');
                setAllUsers(await usersRes.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId, navigate]);

    const handleAddMember = async (userIdToAdd) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:8080/api/user-groups/${groupId}/add-member/${userIdToAdd}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to add member');
            // Refresh group data
            const groupRes = await fetch(`http://localhost:8080/api/user-groups/${groupId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setGroup(await groupRes.json());
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!group) return <div>Group not found</div>;

    // Filter users not already in group
    const availableUsers = allUsers.filter(
        u => !group.members.some(m => m.userId === u.userId)
    );

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add Members to {group.groupName}</h2>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '1rem', width: '100%' }}
            />
            <ul>
                {availableUsers
                    .filter(u =>
                        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(u => (
                        <li key={u.userId} style={{ marginBottom: '1rem' }}>
                            {u.name} (@{u.username})
                            <button
                                style={{ marginLeft: '1rem' }}
                                onClick={() => handleAddMember(u.userId)}
                            >
                                Add
                            </button>
                        </li>
                    ))}
            </ul>
            {availableUsers.length === 0 && <div>No users available to add.</div>}
        </div>
    );
}

export default AddUserGroup; 