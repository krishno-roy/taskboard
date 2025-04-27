import React, { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";
import AddTask from "./Component/AddTask";
import TaskBoard from "./Component/TaskBoard";

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        🛠️ Kanban Board
      </h1>
      <AddTask fetchTasks={fetchTasks} />
      <TaskBoard tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
}

export default App;
