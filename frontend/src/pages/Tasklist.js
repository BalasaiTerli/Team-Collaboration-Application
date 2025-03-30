import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

const TaskList = ({ tasks, setTasks}) => {
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    priority: "",
  });

  const handleEditClick = (task) => {
    setEditTask(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      status: task.status,
      priority: task.priority,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (taskId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/tasks/${taskId}`,
        formData
      );
      const updatedTask = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );

      setEditTask(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 const handleDelete = async (taskId) => {
   if (!window.confirm("Are you sure you want to delete this task?")) return;

   try {
     await axios.delete(`${BASE_URL}/tasks/${taskId}`);
     setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
   } catch (error) {
     console.error("Error deleting task:", error);
   }
 };

 return (
   <div className="mt-6">
     <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
       Task List
     </h2>

     {tasks.length === 0 ? (
       <p className="text-center text-gray-500 text-lg">Task list is empty.</p>
     ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {tasks.map((task) => (
           <div
             key={task._id}
             className="p-5 border rounded-xl shadow-lg bg-white hover:shadow-xl transition duration-300 relative"
           >
             {editTask === task._id ? (
               <div className="space-y-2">
                 <input
                   type="text"
                   name="title"
                   value={formData.title}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   placeholder="Title"
                 />
                 <textarea
                   name="description"
                   value={formData.description}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                   placeholder="Description"
                 />
                 <input
                   type="date"
                   name="dueDate"
                   value={formData.dueDate}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                 />
                 <select
                   name="status"
                   value={formData.status}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                 >
                   <option value="pending">Pending</option>
                   <option value="in-progress">In Progress</option>
                   <option value="completed">Completed</option>
                 </select>
                 <select
                   name="priority"
                   value={formData.priority}
                   onChange={handleChange}
                   className="w-full p-2 border rounded"
                 >
                   <option value="low">Low</option>
                   <option value="medium">Medium</option>
                   <option value="high">High</option>
                 </select>
                 <div className="flex justify-between">
                   <button
                     onClick={() => handleUpdate(task._id)}
                     className="bg-blue-500 text-white px-4 py-2 rounded"
                   >
                     Save
                   </button>
                   <button
                     onClick={() => setEditTask(null)}
                     className="bg-gray-500 text-white px-4 py-2 rounded"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             ) : (
               <>
                 <h3 className="text-xl font-semibold text-blue-600">
                   {task.title}
                 </h3>
                 <p className="text-gray-600 mt-1">{task.description}</p>

                 <div className="mt-3 text-sm space-y-2">
                   <p>
                     <span className="font-semibold">Due Date:</span>{" "}
                     {new Date(task.dueDate).toLocaleDateString()}
                   </p>
                   <p className="flex items-center gap-2">
                     <span className="font-semibold">Status:</span>
                     <span
                       className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                         task.status === "completed"
                           ? "bg-green-500"
                           : task.status === "in-progress"
                           ? "bg-yellow-500"
                           : "bg-red-500"
                       }`}
                     >
                       {task.status}
                     </span>
                   </p>
                   <p className="flex items-center gap-2">
                     <span className="font-semibold">Priority:</span>
                     <span
                       className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                         task.priority === "high"
                           ? "bg-red-500"
                           : task.priority === "medium"
                           ? "bg-yellow-500"
                           : "bg-green-500"
                       }`}
                     >
                       {task.priority}
                     </span>
                   </p>
                 </div>

                 <div className="absolute top-2 right-2 flex gap-2">
                   <button
                     onClick={() => handleEditClick(task)}
                     className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => handleDelete(task._id)}
                     className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                   >
                     Delete
                   </button>
                 </div>
               </>
             )}
           </div>
         ))}
       </div>
     )}
   </div>
 );
};

export default TaskList;
