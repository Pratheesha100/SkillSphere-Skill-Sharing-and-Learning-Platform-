import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GroupView.css';

function GroupView() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const fetchGroups = async () => {
            if (!userId) {
                setError('User ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8080/api/groups/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch groups');
                }

                const data = await response.json();
                setGroups(data);
            } catch (err) {
                setError(err.message || 'Failed to load groups');
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    const handleCreateGroup = () => {
        if (!userId) {
            setError('User ID is required to create a group');
            return;
        }
        navigate(`/create-group/${userId}`);
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/groups/${groupId}?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Delete group error response:', errorData);
                throw new Error(errorData.error || `Failed to delete group (Status: ${response.status})`);
            }

            setGroups(prevGroups => prevGroups.filter(group => group.groupId !== groupId));
        } catch (err) {
            console.error('Error in handleDeleteGroup:', err);
            setError(err.message);
        }
    };

    const handleAddMembers = (groupId) => {
        if (!userId) {
            setError('User ID is required to add members');
            return;
        }
        navigate(`/groups/${groupId}/add-members/${userId}`);
    };

    const handleUpdateGroup = (groupId) => {
        if (!userId) {
            setError('User ID is required to update group');
            return;
        }
        navigate(`/update-group/${groupId}/${userId}`);
    };

    if (!userId) {
        return <div className="error">Error: User ID is required</div>;
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading your groups...</div>
            </div>
        );
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
        <div className="group-view">
            <div className="group-header">
                <h1>My Groups</h1>
                <button className="create-group-btn" onClick={handleCreateGroup}>
                    Create New Group
                </button>
            </div>
            
            <div className="groups-container">
                {groups.length === 0 ? (
                    <div className="no-groups">
                        <p>You are not a member of any groups yet.</p>
                        <button className="create-group-btn" onClick={handleCreateGroup}>
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group.groupId} className="group-card">
                            <h2>{group.groupName}</h2>
                            <p className="group-description">{group.description}</p>
                            <div className="group-meta">
                                <span className="admin-info">
                                    Admin: {group.admin?.name || 'Unknown Admin'}
                                </span>
                                <span className="members-count">
                                    Members: {group.members?.length || 0}
                                </span>
                                <span className="created-date">
                                    Created: {new Date(group.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="group-actions">
                                <button 
                                    onClick={() => navigate(`/groups/${group.groupId}/${userId}`)}
                                    className="view-group-btn"
                                >
                                    View Group
                                </button>
                                {group.admin && group.admin.userId === parseInt(userId) && (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateGroup(group.groupId)}
                                            className="update-group-btn"
                                        >
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => handleAddMembers(group.groupId)}
                                            className="add-members-btn"
                                        >
                                            Add Members
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteGroup(group.groupId)}
                                            className="delete-group-btn"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default GroupView; 