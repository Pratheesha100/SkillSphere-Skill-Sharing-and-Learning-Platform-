import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GroupView.css';

const GroupView = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

        const fetchGroups = async () => {
            try {
                setLoading(true);
                setError(null);
                
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch all groups where the user is admin (created by user)
            const response = await axios.get('http://localhost:8080/api/user-groups', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // Filter groups where the current user is the admin
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.userId;
            const adminGroups = (response.data || []).filter(group => group.admin?.userId === userId);
            setGroups(adminGroups);
        } catch (err) {
            console.error('Error fetching groups:', err);
            let errorMessage = 'Failed to fetch groups';
            
            if (err.response) {
                if (err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
                errorMessage = err.response.data?.error || err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = 'No response from server. Please check if the server is running.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = () => {
        navigate('/create-group');
    };

    const handleAddMember = (groupId) => {
        navigate(`/groups/${groupId}/add-member`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading groups...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">{error}</div>
                <button onClick={fetchGroups} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="group-view-container">
            <div className="group-view-header">
                <h2>Groups You Created</h2>
                <button onClick={handleCreateGroup} className="create-group-btn">
                    Create New Group
                </button>
            </div>
            
                {groups.length === 0 ? (
                    <div className="no-groups">
                    <p>You haven't created any groups yet.</p>
                    <button onClick={handleCreateGroup} className="create-group-btn">
                        Create First Group
                        </button>
                    </div>
                ) : (
                <div className="groups-list">
                    {groups.map((group) => (
                        <div key={group.groupId} className="group-card">
                            <h3>{group.groupName}</h3>
                                <button 
                                className="add-member-btn"
                                onClick={() => handleAddMember(group.groupId)}
                                        >
                                Add Member
                                        </button>
                        </div>
                    ))}
                </div>
                )}
        </div>
    );
};

export default GroupView; 