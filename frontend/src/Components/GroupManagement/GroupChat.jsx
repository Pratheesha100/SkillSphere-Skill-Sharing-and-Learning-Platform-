import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../config/axios';
import { FaUserCircle, FaCheckDouble, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

const GroupChat = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groups/${groupId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`/api/groups/${groupId}/messages`, newMessage);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editedContent.trim()) return;

    try {
      await axios.put(`/api/groups/${groupId}/messages/${messageId}`, editedContent);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, content: editedContent } : msg
      );
      setMessages(updatedMessages);
      setEditingMessage(null);
      setEditedContent('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/messages/${messageId}`);
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Group Chat</h1>
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-xl" />
            <span className="text-sm">{messages.length} messages</span>
          </div>
        </div>
      </div>

      <div className="chat-box flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderType === 'USER' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.senderType === 'USER' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-gray-800'
              }`}
              style={{ animation: 'fadeIn 0.3s ease-in' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {msg.senderName}
                  {msg.senderType === 'USER' && (
                    <FaCheckDouble className="ml-2 text-white" />
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {formatMessageTimestamp(msg.sentAt)}
                </span>
              </div>
              
              {editingMessage === msg.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 p-2 rounded bg-white text-gray-800"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditMessage(msg.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessage(null);
                      setEditedContent('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-base">
                  {msg.content}
                </div>
              )}

              {msg.senderType === 'USER' && !editingMessage && (
                <div className="flex items-center justify-end mt-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingMessage(msg.id);
                      setEditedContent(msg.content);
                    }}
                    className="text-sm text-blue-200 hover:text-blue-100"
                  >
                    <FaEdit className="inline" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="text-sm text-red-200 hover:text-red-100"
                  >
                    <FaTrash className="inline" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input p-6 bg-white border-t-2 border-gray-200 flex items-center gap-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-4 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button 
          onClick={handleSendMessage} 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;

// Add custom scrollbar styles
const customScrollbar = {
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
};
