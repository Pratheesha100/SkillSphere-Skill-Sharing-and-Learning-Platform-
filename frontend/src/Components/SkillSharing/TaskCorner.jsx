import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskCorner() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    topics: [],
    resources: [],
    startDate: '',
    endDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/user/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/tasks?userId=${userId}`, newTask);
      setNewTask({
        title: '',
        description: '',
        topics: [],
        resources: [],
        startDate: '',
        endDate: ''
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/tasks/${editingTask.id}`, editingTask);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask({ ...editingTask, [name]: value });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim());
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value });
    } else {
      setNewTask({ ...newTask, [field]: value });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Task Corner</h1>
      
      {/* Create/Edit Task Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editingTask ? editingTask.title : newTask.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editingTask ? editingTask.description : newTask.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma-separated)</label>
              <input
                type="text"
                value={editingTask ? editingTask.topics.join(', ') : newTask.topics.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'topics')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resources (comma-separated)</label>
              <input
                type="text"
                value={editingTask ? editingTask.resources.join(', ') : newTask.resources.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'resources')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={editingTask ? editingTask.startDate : newTask.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={editingTask ? editingTask.endDate : newTask.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            {editingTask && (
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-4">{task.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-1">Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {task.topics.map((topic, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-1">Resources:</h4>
              <ul className="list-disc list-inside">
                {task.resources.map((resource, index) => (
                  <li key={index} className="text-sm text-gray-600">{resource}</li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              <p>Start: {new Date(task.startDate).toLocaleString()}</p>
              <p>End: {new Date(task.endDate).toLocaleString()}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(task)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskCorner;