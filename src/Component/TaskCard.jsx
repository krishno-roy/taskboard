import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AiTwotoneDelete, AiOutlineRollback } from "react-icons/ai";
import { AiOutlineMessage } from "react-icons/ai";

const TaskCard = ({ task, fetchTasks }) => {
  const [priority, setPriority] = useState(task.priority);
  const [date, setDate] = useState(task.date);
  const [title, setTitle] = useState(task.title);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("task_id", task.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert([{ task_id: task.id, text: commentText }]);

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setCommentText("");
      fetchComments();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_deleted: true })
      .eq("id", task.id);

    if (error) {
      console.error("Error moving task to trash:", error.message);
    } else {
      fetchTasks();
    }
  };

  const handleRestore = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_deleted: false })
      .eq("id", task.id);

    if (error) {
      console.error("Error restoring task:", error.message);
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

  const handleSaveTitle = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", task.id);

    if (error) {
      console.error("Error updating title:", error.message);
    } else {
      setIsEditing(false);
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
      <div className="flex justify-between">
        {task.is_deleted ? (
          <button
            onClick={handleRestore}
            className="text-green-600 hover:text-green-800 text-xl"
          >
            <AiOutlineRollback />
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-xl"
          >
            <AiTwotoneDelete />
          </button>
        )}

        {!task.is_deleted && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-600 hover:text-blue-800 text-xl"
          >
            <AiOutlineMessage />
          </button>
        )}
      </div>

      {/* Task Title */}
      {isEditing ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveTitle}
            className="bg-blue-500 text-white py-1 px-3 rounded-lg"
          >
            Save
          </button>
        </div>
      ) : (
        <h3
          className="text-lg font-semibold mb-3 mt-2 cursor-pointer hover:text-blue-600"
          onClick={() => setIsEditing(true)}
        >
          {task.title}
        </h3>
      )}

      {/* Priority & Date */}
      {!task.is_deleted && (
        <>
          <div className="flex items-center justify-between gap-2">
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
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

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

          {/* Status Update */}
          <div className="mt-3 flex gap-2 flex-wrap">
            {["In Progress", "Review", "Done"].map((status) => (
              <button
                key={status}
                onClick={() => handleUpdate("status", status)}
                className={`px-4 py-2 rounded-md text-white font-semibold text-sm ${
                  task.status === status
                    ? status === "Done"
                      ? "bg-green-600 hover:bg-green-700"
                      : status === "In Progress"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Comments Section */}
      {showComments && !task.is_deleted && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Comments:</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-2 rounded shadow text-sm"
                >
                  {comment.text}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* Add New Comment */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
