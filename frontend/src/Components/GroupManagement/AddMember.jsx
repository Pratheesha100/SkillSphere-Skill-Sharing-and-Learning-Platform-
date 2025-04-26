import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddMember.css';

function AddMember() {
    const { groupId, userId } = useParams();
    const [group, setGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch group details
                const groupResponse = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!groupResponse.ok) {
                    throw new Error('Failed to fetch group details');
                }

                const groupData = await groupResponse.json();
                setGroup(groupData);

                // Fetch all users
                const usersResponse = await fetch('http://localhost:8080/api/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users');
                }

                const usersData = await usersResponse.json();
                setAllUsers(usersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [groupId]);

    const handleAddMember = async (userIdToAdd) => {
        if (!userIdToAdd) {
            setError('Invalid user ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/groups/${groupId}/members?userId=${userIdToAdd}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add member');
            }

            // Refresh group data
            const updatedGroupResponse = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!updatedGroupResponse.ok) {
                throw new Error('Failed to fetch updated group data');
            }

            const updatedGroupData = await updatedGroupResponse.json();
            setGroup(updatedGroupData);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveMember = async (userIdToRemove) => {
        if (!userIdToRemove) {
            setError('Invalid user ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/groups/${groupId}/members?userId=${userIdToRemove}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove member');
            }

            // Refresh group data
            const updatedGroupResponse = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!updatedGroupResponse.ok) {
                throw new Error('Failed to fetch updated group data');
            }

            const updatedGroupData = await updatedGroupResponse.json();
            setGroup(updatedGroupData);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredUsers = allUsers.filter(user => {
        if (!group?.members) return true;
        const isNotMember = !group.members.some(member => member.userId === user.userId);
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        return isNotMember && matchesSearch;
    });

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">Error: {error}</div>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="add-member-container">
            <div className="add-member-header">
                <h2>Manage Group Members</h2>
                <button 
                    className="back-btn"
                    onClick={() => navigate(`/groups/${userId}`)}
                >
                    ← Back to Groups
                </button>
            </div>

            <div className="group-info">
                <h3>{group?.groupName}</h3>
                <p className="description">{group?.description}</p>
            </div>

            <div className="members-section">
                <h3>Current Members</h3>
                <div className="current-members">
                    {group?.members?.map(member => (
                        <div key={member.userId} className="member-card">
                            <span className="member-name">{member.name}</span>
                            <span className="member-username">@{member.username}</span>
                            {member.userId !== group.admin?.userId && (
                                <button 
                                    className="remove-btn"
                                    onClick={() => handleRemoveMember(member.userId)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="add-members-section">
                <h3>Add New Members</h3>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="available-users">
                    {filteredUsers.map(user => (
                        <div key={user.userId} className="user-card">
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-username">@{user.username}</span>
                            </div>
                            <button 
                                className="add-btn"
                                onClick={() => handleAddMember(user.userId)}
                            >
                                Add to Group
                            </button>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="no-users">
                            No users found matching your search
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddMember; 