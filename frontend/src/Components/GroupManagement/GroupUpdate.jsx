import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupUpdate.css';

function GroupUpdate() {
    const { groupId, userId } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        groupName: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch group details');
                }

                const data = await response.json();
                setGroup(data);
                setFormData({
                    groupName: data.groupName,
                    description: data.description
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [groupId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update group');
            }

            navigate(`/groups/${userId}`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading group details...</div>;
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
        <div className="update-group-container">
            <div className="update-group-header">
                <h2>Update Group Details</h2>
                <button 
                    className="back-btn"
                    onClick={() => navigate(`/groups/${userId}`)}
                >
                    ← Back to Groups
                </button>
            </div>

            <form className="update-group-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input
                        type="text"
                        id="groupName"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="update-btn">
                        Update Group
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => navigate(`/groups/${userId}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GroupUpdate; 