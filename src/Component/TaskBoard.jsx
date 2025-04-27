import React from "react";
import TaskCard from "./TaskCard";
import { supabase } from "../utils/supabaseClient";

const statuses = ["Task", "In Progress", "Review", "Done"];

const TaskBoard = ({ tasks, fetchTasks }) => {
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

  return (
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
              .filter((task) => task.status === status)
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
  );
};

export default TaskBoard;
