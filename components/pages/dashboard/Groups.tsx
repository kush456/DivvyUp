"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import AppBar from "@/components/pages/AppBar";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
//import { Group } from "@prisma/client";

type Member = {
  name: string;
  id: number;
  createdAt: Date;
  email: string;
  password: string;
  updatedAt: Date;
};

type Group = {
  name: string;
  id: number;
  createdAt: Date;
  members: Member[]; // Added members to the Group type
  balances: Balance[];
};

type Balance = {
  id: number;
  groupId: number;
  userId: number;
  balance: number;
}

type GroupPageProps = {
  groups: Group[]; 
};

export default function GroupsPage({groups} : GroupPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();
  //const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  console.log("groups: ", groups);
  //console.log("balance: ", balance);
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppBar />

      <main className="flex-1 container mx-auto px-4 py-6 min-w-[320px] max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Groups</h1>
        <p className="text-gray-600 mb-4">
          Manage your groups and shared expenses on DivvyUp
        </p>

        {/* Search Input */}
        <Input
          placeholder="Search for a group"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 bg-slate-200"
        />

        {/* Groups List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Groups</h2>
          <div className="space-y-4">
            {filteredGroups.map((group, balance) => (
              <Card
                key={group.id}
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => router.push(`groups/${group.id}`)} // Navigate to dynamic route
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                        {(group.name) ? group.name[0].toUpperCase() : 'NA'}
                    </div>
                  </Avatar>
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-gray-600">
                      Members: {(group.members.length > 0) ? group.members.length : 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Balance: {(group.balances.
                        filter(balance => balance.userId === parseInt(session.data?.user.id || "0")).
                        map(balance => balance.balance)) || 0
                        }
                    </p>
                  </div>
                </div>
                <Button variant="destructive">Leave</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Groups Button */}
        <div className="mt-8 text-center">
          <Button className="px-6 py-2" onClick={() => {router.push('./groups/addGroups')}}> 
            Add Group
          </Button>
        </div>

        {/* Group Details Dialog
        {selectedGroup && (
          <GroupDetailsDialog
            group={selectedGroup}
            isOpen={!!selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )} */}
      </main>
    </div>
  );
}
