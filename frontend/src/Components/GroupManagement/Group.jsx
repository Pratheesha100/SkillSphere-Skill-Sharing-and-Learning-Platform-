import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBox from './ChatBox';
import './Group.css';

const Group = ({ group, onDelete, onUpdate, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(group.name);
    const [editedDescription, setEditedDescription] = useState(group.description);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = async () => {
        try {
            await onUpdate(group.id, {
                name: editedName,
                description: editedDescription
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            try {
                await onDelete(group.id);
            } catch (error) {
                console.error('Error deleting group:', error);
            }
        }
    };

    const handleViewDetails = () => {
        navigate(`/groups/${group.id}`);
    };

    return (
        <div className="group-card">
            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Group Name"
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Group Description"
                    />
                    <div className="button-group">
                        <button onClick={handleUpdate} className="save-button">Save</button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <div className="button-group">
                        <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                        <button onClick={handleDelete} className="delete-button">Delete</button>
                        <button onClick={handleViewDetails} className="view-button">View Details</button>
                        <button onClick={() => setIsChatOpen(true)} className="chat-button">Chat</button>
                    </div>
                </>
            )}
            {isChatOpen && (
                <ChatBox
                    groupId={group.id}
                    userId={currentUser.id}
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default Group; 