import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import TaskBoard from "../components/TaskBoard";
import AddTask from "../components/AddTask";
import InviteMember from "../components/InviteMember";

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectId, setProjectId] = useState("your_project_id"); // Replace with actual project id

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [projectId]);

  // Fetch tasks from database
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data);
    }
  };

  // Fetch members of a project
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("project_members")
      .select("user_id")
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching members:", error.message);
    } else {
      setMembers(data);
    }
  };

  // Handle task update (status change or task modification)
  const handleDropTask = async (taskId, status) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error.message);
    } else {
      fetchTasks();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Board</h1>

      {/* Invite Member Component */}
      <InviteMember projectId={projectId} fetchMembers={fetchMembers} />

      <div className="flex gap-6">
        {/* Add Task Component */}
        <AddTask fetchTasks={fetchTasks} />

        {/* Task Board */}
        <TaskBoard tasks={tasks} onDropTask={handleDropTask} />
      </div>
    </div>
  );
};

export default MainPage;
