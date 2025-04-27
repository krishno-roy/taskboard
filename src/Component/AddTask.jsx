import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AddTask = ({ fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState("");

  const handleAddTask = async () => {
    if (!title || !date) {
      alert("Please fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        { title, priority, date, status: "Task", user_id: "YOUR_USER_ID" },
      ]); // Added user_id for each user

    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setTitle("");
      setPriority("Medium");
      setDate("");
      fetchTasks();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter task title..."
          className="flex-1 border rounded px-4 py-3 text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border rounded px-4 py-3 text-lg p"
        >
          <option value="High"> High</option>
          <option value="Medium"> Medium</option>
          <option value="Low"> Low</option>
        </select>
        <input
          type="date"
          className="border rounded px-4 py-3 text-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 text-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTask;
