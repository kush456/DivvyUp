"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import AppBar from "./AppBar";

type Group = {
  id: string;
  name: string;
  members: number;
  totalExpenses: number;
  image: string;
};

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Apartment 7",
      members: 3,
      totalExpenses: 12,
      image: "/images/apartment.jpg",
    },
    {
      id: "2",
      name: "Spring Break '22",
      members: 5,
      totalExpenses: 0,
      image: "/images/spring-break.jpg",
    },
    {
      id: "3",
      name: "Road Trip",
      members: 2,
      totalExpenses: 120,
      image: "/images/road-trip.jpg",
    },
  ]);

  const router = useRouter();
  const { data: session } = useSession();

  console.log(session);
  // useEffect(() => {
  //   if (!session) {
  //     signIn();
  //   }
  // });

  if (!session) {
    return null;
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppBar />

      {/* Dashboard Content */}
      <main className="flex-1 container mx-auto px-4 py-6 min-w-[320px] max-w-6xl">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, {session.user?.name || "User"}!
        </h2>
        <p className="text-gray-600 mt-2">Your groups</p>

        {/* Group List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {groups.map((group) => (
            <Card key={group.id} className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-600">
                    {group.members} members · ${group.totalExpenses.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Group */}
        <div className="mt-6">
            <Button >New Group</Button>
        </div>
      </main>
    </div>
  );
}
