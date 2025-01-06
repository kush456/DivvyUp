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

interface Participant {
  id: string;
  name: string;
  paidAmount: number;
  weight: number;
}

interface Friend {
    id: number ;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    groups: never[];//will eventually have to change this when we make groups
}

interface AddExpenseFormProps {
  friends: Friend[];
}

export default function AddExpenseForm({friends} : AddExpenseFormProps){
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [splitType, setSplitType] = useState<"equal" | "unequal">("equal");
    const [groupId, selectedGroupId] = useState<number>(0);
    const {data : session} = useSession();
    const router = useRouter();

    // also add the user to the friends list, he can add himself too in this
    const user = session?.user;

    // convert the id of the friends to string
    const convertedFriends = friends.map((friend) => ({
        ...friend,
        id: friend.id.toString(),
    }));

    if(user) {
        convertedFriends.push({
            id: user.id.toString(),
            name: user.name || "",
            email: user.email || "",
            avatar: user.image || "/images/default-avatar.jpg",
            balance: 0, //fix or remove these
            groups: [], //same as above
        });
    }

    
    // Add a participant from the friends list
    const addParticipant = (friendId: string) => {
        const friend = convertedFriends.find((f) => f.id === friendId);
        if (friend && !participants.find((p) => p.id === friend.id)) {
        setParticipants([
            ...participants,
            { id: friend.id, name: friend.name, paidAmount: 0, weight: 1 },
        ]);
        }
    };

    // Handle participant field updates
    const updateParticipant = (
        id: string,
        field: keyof Participant,
        value: string | number
    ) => {
        setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
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
        setParticipants((prev) => prev.filter((p) => p.id !== id));
    };

    // Submit form
    const handleSubmit = async () => {
        // Validation
        if (participants.length === 0) {
            alert("Add at least one participant.");
            return;
        }

        
        // Data preparation
        const payload = {
            totalAmount,
            description,
            participants,
            splitType,
            groupId: selectedGroupId || 0,
        };

        try {
            const res = await axios.post("/api/expenses", payload);
            console.log("Expense added successfully: ", res.data);

            if(res) {
                if(groupId && groupId !== 0){
                    router.push(`./group/${groupId}`);
                } else{
                    router.push("./");
                }
                
            }
        } catch (error : any){
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
                <SelectValue placeholder="Select a Friend" />
            </SelectTrigger>
            <SelectContent>
                {convertedFriends.map((friend) => (
                <SelectItem key={friend.id} value={friend.id} >
                    {friend.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        {/* Participant List */}
        <div className="space-y-2 mt-4 ml-20">
            {participants.map((participant) => (
            <div key={participant.id} className="flex gap-4 items-center">
                <span>{participant.name}</span>
                {/* Paid Amount Input */}
                <Input
                    placeholder="Paid Amount"
                    type="number"
                    value={participant.paidAmount}
                    onChange={(e) => {
                        const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                        updateParticipant(participant.id, "paidAmount", value);
                    }}
                    className={participant.paidAmount.toString() === "" ? "border-red-500 focus:ring-red-500" : ""}
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
                                updateParticipant(participant.id, "weight", value);
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
                    onClick={() => removeParticipant(participant.id)}
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
};

