import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Tasklist from "./Tasklist";
import { BASE_URL } from "../constants/constants";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("calendar"); 
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      await axios.post(`${BASE_URL}/tasks/add`, {
        ...formData,
        userId,
      });
      setMessage("Task added successfully!");
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
      fetchTasks();
    } catch (error) {
      setMessage("Failed to add task. Try again.");
      console.error("Error adding task:", error);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const calendarEvents = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.dueDate), 
    end: new Date(task.dueDate),
  }));

  return (
    <div className="p-4">
      <div className="flex justify-end gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            showForm ? "bg-red-500" : "bg-blue-500"
          } text-white`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add a Task"}
        </button>

        <button
          className={`px-4 py-2 rounded ${
            viewMode === "list" ? "bg-green-500" : "bg-purple-500"
          } text-white`}
          onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
        >
          {viewMode === "list" ? "Switch to Calendar" : "Switch to List"}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-700 text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {message && (
        <p className="text-center text-lg font-semibold text-green-600">
          {message}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-4 rounded shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
            className="block w-full p-2 mb-2 border"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full p-2 mb-2 border"
          ></textarea>
          <input
            type="date"
            name="dueDate"
            required
            value={formData.dueDate}
            onChange={handleChange}
            className="block w-full p-2 mb-2 border"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full p-2 mb-2 border"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="block w-full p-2 mb-2 border"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}

      {viewMode === "list" && <Tasklist tasks={tasks} setTasks={setTasks} />}

      {viewMode === "calendar" && (
        <div className="bg-white p-4 rounded shadow-lg mt-4">
          <h2 className="text-2xl font-bold mb-4">Task Calendar</h2>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskManager;
