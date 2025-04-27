import React from "react";
import TaskCard from "./TaskCard";

const TaskBoard = ({ tasks, title, onDropTask }) => {
  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    onDropTask(taskId, title.toLowerCase());
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className="w-full bg-white rounded shadow p-4 min-h-[300px]"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
          >
            <TaskCard task={task} />
          </div>
        ))
      ) : (
        <p className="text-gray-400">No tasks</p>
      )}
    </div>
  );
};

export default TaskBoard;
