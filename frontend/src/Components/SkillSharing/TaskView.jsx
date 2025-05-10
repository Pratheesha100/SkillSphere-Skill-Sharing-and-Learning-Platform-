import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

function TaskView() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User is not authenticated.");
        return;
      }

      try {
        const response = await axios.get(`/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleCopyLink = () => {
    const taskUrl = `${window.location.origin}/tasks/${taskId}`;
    navigator.clipboard.writeText(taskUrl).then(() => {
      alert("Task link copied to clipboard!");
      navigate("/posts");
    }).catch((err) => {
      console.error("Failed to copy task link:", err);
    });
  };

  const handleShareAsPicture = async () => {
    const taskElement = document.getElementById('task-details');
    if (!taskElement) {
      console.error('Task details element not found.');
      return;
    }

    try {
      const canvas = await html2canvas(taskElement);
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]).then(() => {
            alert('Task details copied as an image to clipboard!');
            navigate('/posts');
          }).catch((err) => {
            console.error('Failed to copy image to clipboard:', err);
          });
        }
      });
    } catch (error) {
      console.error('Error capturing task details as an image:', error);
    }
  };

  const handleShareAsPost = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const postData = {
        title: `Task: ${task.title}`,
        content: `Task Description: ${task.description}\n\nTopics: ${task.topics.join(', ')}\n\nResources:\n${task.resources.join('\n')}\n\nStart Date: ${new Date(task.startDate).toLocaleString()}\nEnd Date: ${new Date(task.endDate).toLocaleString()}`,
        category: 'Education'
      };

      await axios.post('http://localhost:8080/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Task shared as post successfully!");
      navigate("/posts");
    } catch (error) {
      console.error("Error sharing task as post:", error);
      alert("Failed to share task as post. Please try again.");
    }
  };

  if (!task) {
    return <div>Loading task details...</div>;
  }

  return (
    <div id="task-details" className="max-w-2xl mx-auto px-6 py-8 bg-white rounded-2xl shadow-2xl border border-gray-100 mt-10">
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900 flex items-center gap-3">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">{task.title}</span>
      </h1>
      <p className="text-gray-600 mb-6 text-lg leading-relaxed border-b pb-4">{task.description}</p>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
          <span className="material-icons text-blue-400">local_offer</span> Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {task.topics && task.topics.map((topic, index) => (
            <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-blue-200">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
          <span className="material-icons text-green-400">link</span> Resources
        </h4>
        <ul className="list-disc list-inside space-y-1">
          {task.resources && task.resources.map((resource, index) => (
            <li key={index} className="text-sm text-gray-700 hover:text-blue-600 transition-colors cursor-pointer underline underline-offset-2">{resource}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
        <div className="flex items-center gap-1">
          <span className="material-icons text-yellow-500">event</span>
          <span>Start: {new Date(task.startDate).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-red-400">event_busy</span>
          <span>End: {new Date(task.endDate).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition-transform duration-200 font-semibold"
        >
          <span className="material-icons">share</span> Share Task
        </button>

        <button
          onClick={handleShareAsPicture}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-transform duration-200 font-semibold"
        >
          <span className="material-icons">image</span> Share as Picture
        </button>

        <button
          onClick={handleShareAsPost}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg shadow hover:scale-105 hover:from-purple-500 hover:to-purple-700 transition-transform duration-200 font-semibold"
        >
          <span className="material-icons">post_add</span> Share as Post
        </button>
      </div>
    </div>
  );
}

export default TaskView;
