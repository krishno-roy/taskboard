import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { supabase } from "../utils/supabaseClient";
import { FaTrash } from "react-icons/fa"; // Trash icon

const statuses = ["Task", "In Progress", "Review", "Done"];

const TaskBoard = ({ tasks, fetchTasks }) => {
  const [showTrash, setShowTrash] = useState(false); // Trash view toggle

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Failed to update task:", error.message);
    } else {
      fetchTasks();
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleRestoreTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_deleted: false })
      .eq("id", taskId);

    if (error) {
      console.error("Failed to restore task:", error.message);
    } else {
      fetchTasks();
    }
  };

  const handlePermanentDelete = async (taskId) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Failed to permanently delete task:", error.message);
    } else {
      fetchTasks();
    }
  };

  return (
    <div className="p-4">
      {/* Header with Trash Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Board</h1>

        <button
          onClick={() => setShowTrash(!showTrash)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <FaTrash className="text-lg" />
          {showTrash ? "Back to Tasks" : "View Trash"}
        </button>
      </div>

      {/* Task Columns */}
      {showTrash ? (
        // Trash view
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow min-h-[400px] flex flex-col col-span-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-red-500">
              Trash
            </h2>
            <div className="flex flex-wrap gap-4">
              {tasks.filter((task) => task.is_deleted).length > 0 ? (
                tasks
                  .filter((task) => task.is_deleted)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow w-full md:w-[300px] flex flex-col"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {task.title}
                      </h3>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => handleRestoreTask(task.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(task.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  No tasks in Trash.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Normal Board view
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div
              key={status}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-gray-100 p-4 rounded-lg shadow min-h-[400px] flex flex-col"
            >
              <h2 className="text-2xl font-bold text-center mb-4">{status}</h2>
              <div className="flex-1 space-y-4">
                {tasks
                  .filter((task) => task.status === status && !task.is_deleted)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <TaskCard task={task} fetchTasks={fetchTasks} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
