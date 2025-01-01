"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import AppBar from "@/components/pages/AppBar";
import { redirect, useRouter } from "next/navigation";
import { Group } from "@prisma/client";

//better way to get type directly from schema
type GroupPageProps = {
    groups: Group[];
}

export default function GroupsPage({groups} : GroupPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  //const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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
            {filteredGroups.map((group) => (
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
                      Members: "NA"
                    </p>
                    <p className="text-sm text-gray-600">
                      Balance: "NA"
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
