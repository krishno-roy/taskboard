import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { AiTwotoneDelete } from "react-icons/ai";

const TaskCard = ({ task, fetchTasks }) => {
  const [priority, setPriority] = useState(task.priority);
  const [date, setDate] = useState(task.date);

  const handleDelete = async () => {
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);

    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      fetchTasks();
    }
  };

  const handleUpdate = async (field, value) => {
    const { error } = await supabase
      .from("tasks")
      .update({ [field]: value })
      .eq("id", task.id);

    if (error) {
      console.error(`Error updating ${field}:`, error.message);
    } else {
      fetchTasks();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-400 text-black";
      case "Low":
        return "bg-blue-400 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-move relative">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
      >
        <AiTwotoneDelete />
      </button>

      {/* Task Title */}
      <h3 className="text-lg font-semibold mb-3">{task.title}</h3>

      {/* Priority & Date Same Line */}
      <div className="flex items-center justify-between gap-2">
        {/* Priority Dropdown */}
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            handleUpdate("priority", e.target.value);
          }}
          className={`px-3 py-1 rounded ${getPriorityColor(
            priority
          )} text-sm cursor-pointer`}
        >
          <option value="High"> High</option>
          <option value="Medium"> Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Date Input */}
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleUpdate("date", e.target.value);
          }}
          className="border rounded px-3 py-1 text-gray-600 text-sm cursor-pointer"
        />
      </div>
    </div>
  );
};

export default TaskCard;
