import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const InviteMember = ({ projectId, fetchMembers }) => {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (!email) {
      alert("Please enter an email!");
      return;
    }

    // Step 1: Find user by email
    const { data: user, error } = await supabase
      .from("users") // Supabase public.user table access
      .select("id")
      .eq("email", email)
      .single();

    if (error || !user) {
      alert("User not found!");
      console.error(error?.message);
      return;
    }

    // Step 2: Add to project_members table
    const { error: insertError } = await supabase
      .from("project_members")
      .insert([{ project_id: projectId, user_id: user.id }]);

    if (insertError) {
      alert("Error inviting member!");
      console.error(insertError.message);
    } else {
      alert("Member invited successfully!");
      setEmail("");
      fetchMembers();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="email"
        placeholder="User Email"
        className="border p-3 rounded w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleInvite}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Invite
      </button>
    </div>
  );
};

export default InviteMember;
