import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { supabase } from "../utils/supabaseClient";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaRegStickyNote,
  FaPlus,
} from "react-icons/fa";

const statuses = ["Task", "In Progress", "Review", "Done"];

const TaskBoard = ({ tasks, fetchTasks }) => {
  const [showTrash, setShowTrash] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [description, setDescription] = useState("");
  const [activeDescriptionTask, setActiveDescriptionTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const taskNote = tasks.find((task) => task.id === isEditing)?.description;
      setDescription(taskNote || "");
    }
  }, [isEditing, tasks]);

  const handleAddDescription = async (taskId) => {
    if (!description.trim()) {
      alert("Description cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ description: description })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating description:", error.message);
    } else {
      setDescription("");
      setIsEditing(null);
      fetchTasks();
    }
  };

  const handleDeleteDescription = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this description?")) {
      const { error } = await supabase
        .from("tasks")
        .update({ description: null })
        .eq("id", taskId);

      if (error) {
        console.error("Error deleting description:", error.message);
      } else {
        fetchTasks();
      }
    }
  };

  const toggleDescriptionInput = (taskId) => {
    if (activeDescriptionTask === taskId) {
      setActiveDescriptionTask(null);
      setIsEditing(null);
    } else {
      setActiveDescriptionTask(taskId);
      setIsEditing(taskId);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", draggedTask.id);

    if (error) {
      console.error("Error updating task status:", error.message);
    } else {
      fetchTasks();
    }

    setDraggedTask(null);
  };

  // Restore task from trash
  const handleRestoreTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_deleted: false })
      .eq("id", taskId);

    if (error) {
      console.error("Error restoring task:", error.message);
    } else {
      fetchTasks();
    }
  };

  // Permanently delete task
  const handlePermanentDelete = async (taskId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this task?")
    ) {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        console.error("Error deleting task:", error.message);
      } else {
        fetchTasks();
      }
    }
  };

  return (
    <div className="p-4">
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

      {showTrash ? (
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
                      <p className="text-sm text-gray-600 mb-2">
                        Status: {task.status}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          Description: {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => handleRestoreTask(task.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <FaPlus size={12} /> Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(task.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <FaTrash size={12} /> Delete
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div
              key={status}
              className="bg-gray-100 p-4 rounded-lg shadow min-h-[400px] flex flex-col"
              onDragOver={(e) => handleDragOver(e, status)}
              onDrop={(e) => handleDrop(e, status)}
            >
              <h2 className="text-2xl font-bold text-center mb-4">{status}</h2>
              <div className="flex-1 space-y-4">
                {tasks
                  .filter((task) => task.status === status && !task.is_deleted)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow w-full"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <TaskCard task={task} fetchTasks={fetchTasks} />

                      {/* Description section */}
                      <div className="mt-2">
                        {activeDescriptionTask === task.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full p-2 border rounded text-sm h-24 resize-none"
                              placeholder="Enter description..."
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddDescription(task.id)}
                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded text-sm"
                              >
                                <FaSave size={12} /> Save
                              </button>
                              <button
                                onClick={() => {
                                  setActiveDescriptionTask(null);
                                  setIsEditing(null);
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                              {task.description && (
                                <button
                                  onClick={() =>
                                    handleDeleteDescription(task.id)
                                  }
                                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded text-sm"
                                >
                                  <FaTrash size={12} /> Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {task.description ? (
                                <>
                                  <FaRegStickyNote className="text-blue-500" />
                                  <span className="text-sm text-gray-700 line-clamp-1">
                                    {task.description}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  No description
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => toggleDescriptionInput(task.id)}
                              className="text-blue-500 hover:text-blue-700"
                              title={
                                task.description
                                  ? "Edit description"
                                  : "Add description"
                              }
                            >
                              {task.description ? (
                                <FaEdit size={14} />
                              ) : (
                                <FaPlus size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
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
