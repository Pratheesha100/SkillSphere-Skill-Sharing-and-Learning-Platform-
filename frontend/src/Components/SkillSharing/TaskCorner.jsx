import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper to ensure seconds in datetime-local string
function ensureSeconds(dateTimeLocalStr) {
  if (!dateTimeLocalStr) return '';
  // If already has seconds, return as is
  if (dateTimeLocalStr.length === 19) return dateTimeLocalStr;
  // If input is like '2025-05-10T09:00', add ':00'
  if (dateTimeLocalStr.length === 16) return dateTimeLocalStr + ':00';
  return dateTimeLocalStr; // fallback
}

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("User is not authenticated or userId is missing.");
        return;
      }

      try {
        const response = await axios.get(`/api/tasks/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setTasks([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Fallback to an empty array in case of error
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    // Ensure topics and resources are arrays
    const formattedTask = {
        ...newTask,
        topics: Array.isArray(newTask.topics) ? newTask.topics : newTask.topics.split(",").map((t) => t.trim()),
        resources: Array.isArray(newTask.resources) ? newTask.resources : newTask.resources.split(",").map((r) => r.trim()),
    };

    try {
        const response = await axios.post(
            "/api/tasks",
            formattedTask,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setTasks([...tasks, response.data]);
        setNewTask({
            title: "",
            description: "",
            topics: [],
            resources: [],
            startDate: "",
            endDate: "",
        });
    } catch (error) {
        console.error("Error creating task:", error);
    }
};

const handleUpdateTask = async (taskId, updatedTask) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const response = await axios.put(
            `/api/tasks/${taskId}`,
            updatedTask,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setTasks(tasks.map((task) => (task.id === taskId ? response.data : task)));
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        await axios.delete(`/api/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

  // Handles both create and edit input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask({ ...editingTask, [name]: value });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  // Handles topics/resources as comma-separated input
  const handleArrayInputChange = (e, field) => {
    const value = e.target.value;
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value });
    } else {
      setNewTask({ ...newTask, [field]: value });
    }
  };

  // Helper to display array fields as comma-separated string in input
  const arrayToString = (arr) => Array.isArray(arr) ? arr.join(', ') : (arr || '');

  // Helper to convert backend ISO string to input value (without seconds)
  const toInputDateTime = (isoString) => {
    if (!isoString) return '';
    // Remove seconds for display in input
    return isoString.slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Task Corner
            </span>
          </h1>
          <p className="text-gray-600">Manage and organize your learning tasks</p>
        </div>
        
        {/* Create/Edit Task Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="material-icons text-blue-500">add_task</span>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">title</span>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">description</span>
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">local_offer</span>
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingTask ? arrayToString(editingTask.topics) : arrayToString(newTask.topics)}
                  onChange={(e) => handleArrayInputChange(e, 'topics')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">link</span>
                  Resources (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingTask ? arrayToString(editingTask.resources) : arrayToString(newTask.resources)}
                  onChange={(e) => handleArrayInputChange(e, 'resources')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">event</span>
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={editingTask ? toInputDateTime(editingTask.startDate) : toInputDateTime(newTask.startDate)}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-sm">event_busy</span>
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={editingTask ? toInputDateTime(editingTask.endDate) : toInputDateTime(newTask.endDate)}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              {editingTask && (
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <span className="material-icons">close</span>
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span className="material-icons">{editingTask ? 'save' : 'add'}</span>
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{task.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2">
                  <span className="material-icons text-blue-400 text-sm">local_offer</span>
                  Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task.topics && task.topics.map((topic, index) => (
                    <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-blue-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2">
                  <span className="material-icons text-green-400 text-sm">link</span>
                  Resources
                </h4>
                <ul className="space-y-1">
                  {task.resources && task.resources.map((resource, index) => (
                    <li key={index} className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer underline underline-offset-2">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-yellow-500 text-sm">event</span>
                  <span>{new Date(task.startDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-icons text-red-400 text-sm">event_busy</span>
                  <span>{new Date(task.endDate).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingTask(task)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-medium flex items-center gap-1 shadow-sm hover:shadow-md"
                >
                  <span className="material-icons text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium flex items-center gap-1 shadow-sm hover:shadow-md"
                >
                  <span className="material-icons text-sm">delete</span>
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium flex items-center gap-1 shadow-sm hover:shadow-md"
                >
                  <span className="material-icons text-sm">visibility</span>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCorner;
