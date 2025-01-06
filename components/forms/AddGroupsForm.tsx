"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SelectContent } from "@radix-ui/react-select";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
}

interface Friend {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface AddGroupFormProps {
  friends: Friend[];
}

export default function AddGroupForm({ friends }: AddGroupFormProps) {
  const [groupName, setGroupName] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  // Add current user to the friends list
  const user = session?.user;

  const convertedFriends = friends.map((friend) => ({
    ...friend,
    id: friend.id.toString(),
  }));

  if (user) {
    convertedFriends.push({
      id: user.id.toString(),
      name: user.name || "You",
      email: user.email || "",
      avatar: user.image || "/images/default-avatar.jpg",
    });
  }

  // Add a member to the group
  const addMember = (friendId: string) => {
    const friend = convertedFriends.find((f) => f.id === friendId);
    if (friend && !members.find((m) => m.id === friend.id)) {
      setMembers([...members, { id: friend.id, name: friend.name }]);
    }
  };

  // Remove a member from the group
  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Submit form
  const handleSubmit = async () => {
    // Validation
    if (!groupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    if (members.length === 0) {
      alert("Add at least one member to the group.");
      return;
    }

    // Prepare data
    const payload = {
      groupName,
      members,
    };

    try {
      const res = await axios.post("/api/groups", payload);
      console.log("Group added successfully: ", res.data);

      if (res) {
        router.push("./");
      }
    } catch (error: any) {
      console.error("Error adding group:", error.response?.data || error.message);
    }
  };

  return (
    <form className="space-y-4">
      {/* Group Name */}
      <div>
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </div>

      {/* Add Members */}
      <div>
        <h3 className="text-lg font-bold">Add Members</h3>
        <Select onValueChange={addMember}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Friend" />
          </SelectTrigger>
          <SelectContent>
            {convertedFriends.map((friend) => (
              <SelectItem key={friend.id} value={friend.id}>
                {friend.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Member List */}
      <div className="space-y-2 mt-4 flex flex-col items-center">
        {members.map((member) => (
          <div key={member.id} className="flex gap-4 items-center">
            <span>{member.name}</span>
            <Button
              variant="secondary"
              type="button"
              onClick={() => removeMember(member.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={handleSubmit}>
          Add Group
        </Button>
      </div>
    </form>
  );
}
