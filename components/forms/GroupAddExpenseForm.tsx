"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Participant {
  userId: string;
  name: string;
  paidAmount: number;
  weight: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
}

interface AddExpenseFormProps {
  groupId: number;
  members: Member[];
}

export default function GroupAddExpenseForm({ groupId, members }: AddExpenseFormProps) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "unequal">("equal");
  const router = useRouter();

  // Add a participant from the group members list
  const addParticipant = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member && !participants.find((p) => p.userId === member.id)) {
      setParticipants([
        ...participants,
        { userId: member.id, name: member.name, paidAmount: 0, weight: 1 },
      ]);
    }
  };

  // Handle participant updates
  const updateParticipant = (
    id: string,
    field: keyof Participant,
    value: string | number
  ) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === id ? { ...p, [field]: value } : p))
    );
  };

  // Handle split type change
  const handleSplitChange = (value: "equal" | "unequal") => {
    setSplitType(value);
    if (value === "equal") {
        const weight = 1 / participants.length;
        setParticipants((prev) =>
            prev.map((p) => ({ ...p, weight }))
        );
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.userId !== id));
  };

  // Submit form
  const handleSubmit = async () => {
    if (participants.length === 0) {
      alert("Add at least one participant.");
      return;
    }

    const payload = {
      totalAmount,
      description,
      participants,
      splitType,
      groupId,
    };

    try {
      const res = await axios.post("/api/expenses", payload);
      console.log("Expense added successfully:", res.data);
      router.push(`/dashboard/groups/${groupId}`);
    } catch (error: any) {
      console.error("Error creating expense:", error.response?.data || error.message);
    }
  };

  return (
    <form className="space-y-4">
      {/* Total Amount */}
      <div>
        <Label htmlFor="totalAmount">Total Amount</Label>
        <Input
          id="totalAmount"
          type="number"
          value={totalAmount || ""}
          onChange={(e) =>
            setTotalAmount(e.target.value === "" ? 0 : parseFloat(e.target.value))
          }
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Split Type */}
      <div className="pb-10">
        <Label htmlFor="splitType">Split Type</Label>
        <Select
        onValueChange={(value: "equal" | "unequal") =>
            handleSplitChange(value)
        }
        >
        <SelectTrigger>
            <SelectValue placeholder="Select Split Type" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="equal">Equal</SelectItem>
            <SelectItem value="unequal">Unequal</SelectItem>
        </SelectContent>
        </Select>
      </div>

      {/* Add Participants */}
      <div>
        <h3 className="text-lg font-bold">Add Participants</h3>
        <Select onValueChange={addParticipant}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participant List */}
      <div className="space-y-2 mt-4">
        {participants.map((participant) => (
          <div key={participant.userId} className="flex gap-4 items-center">
            <span>{participant.name}</span>
            <Input
              placeholder="Paid Amount"
              type="number"
              value={participant.paidAmount}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                updateParticipant(participant.userId, "paidAmount", value);
              }}
            />
            {participant.paidAmount.toString() === "" && (
                <p className="text-red-500 text-sm">Paid amount cannot be empty</p>
            )}
            
            {/* Weight Input (Only for Unequal Split) */}
            {splitType === "unequal" && (
                <>
                    <Input
                        placeholder="Weight"
                        type="number"
                        value={participant.weight}
                        onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            updateParticipant(participant.userId, "weight", value);
                        }}
                        className={participant.weight.toString() === "" ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {participant.weight.toString() === "" && (
                        <p className="text-red-500 text-sm">Weight cannot be empty</p>
                    )}
                </>
            )}
            <Button
              variant="destructive"
              type="button"
              onClick={() => removeParticipant(participant.userId)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={handleSubmit}>
          Add Expense
        </Button>
      </div>
    </form>
  );
}
