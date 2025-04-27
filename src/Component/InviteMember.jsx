import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const InviteMember = ({ projectId, fetchMembers }) => {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    // Check if user exists by email
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
    if (users.length === 0) {
      alert("User not found!");
      return;
    }

    const user = users[0];

    // Add member
    const { error } = await supabase.from("project_members").insert([
      {
        project_id: projectId,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      fetchMembers();
      setEmail("");
      alert("Member invited successfully!");
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="email"
        className="border p-2 rounded w-full"
        placeholder="Invite by Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleInvite}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Invite Member
      </button>
    </div>
  );
};

export default InviteMember;
