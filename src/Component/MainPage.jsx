// MainPage.jsx
const fetchMembers = async (projectId) => {
  const { data, error } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching members:", error.message);
    return [];
  }
  return data;
};
