"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import AppBar from "./AppBar";


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
  members: Member[];
  balances: Balance[];
};

type Balance = {
  id: number;
  groupId: number;
  userId: number;
  balance: number;
}

type Expenses = {
  id: number;
  description: string;
  totalAmount: number;
  createdAt: Date;
  group: string | undefined;
  participants: {
      userId: number;
      name: string;
      amount: number;
      weight: number;
  }[];
}
type Friend = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  groups: never[];
}

type User = {
  name: string;
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
type Settlement = {
  id: number;
  groupId: number | null;
  createdAt: Date;
  amount: number;
  payerId: number;
  payeeId: number;
  payer?: User;
  payee?: User;
}
type Settlements = {
  credits : Settlement[];
  debts : Settlement[];
}

type DashboardProps = {
  groups: Group[],
  expenses: Expenses[],
  friends: Friend[],
  settlements: Settlements,
}
export default function DashboardPage({groups, settlements, friends, expenses}: DashboardProps) {


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

        {/* Groups Section */}
        <section className="mt-6">
          <Button variant="link" className="text-xl font-semibold text-gray-700 p-0" onClick={() => router.push("./groups")}>Your Groups {'>'}</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {groups.slice(-3).reverse().map((group) => (
              <Card key={group.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-600">
                      {group.members.length} Members
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button className="mt-4" onClick={() => router.push("./groups/addGroups")}>
            Add New Group
          </Button>
        </section>

        {/* Expenses Section */}
        <section className="mt-8">
          <Button variant="link" className="text-xl font-semibold text-gray-700 p-0" onClick={() => router.push("./expenses")}>Recent Expenses {'>'}</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {expenses.slice(-3).reverse().map((expense) => (
              <Card key={expense.id} className="p-4">
                <h4 className="text-lg font-semibold">{expense.description}</h4>
                <p className="text-sm text-gray-600">
                  Total: ₹{expense.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Created At:{" "}
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(expense.createdAt)
                  )}
                </p>
              </Card>
            ))}
          </div>
          <Button className="mt-4" onClick={() => router.push("./expenses/addExpenses")}>
            Add New Expense
          </Button>
        </section>

        {/* Friends Section */}
        <section className="mt-8">
          <Button variant="link" className="text-xl font-semibold text-gray-700 p-0" onClick={() => router.push("./friends")}>Your Friends {'>'}</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {friends.slice(-3).reverse().map((friend) => (
              <Card key={friend.id} className="p-4 flex items-center">
                <Avatar>
                  <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                    {friend.name.toString()[0].toUpperCase()}
                  </div>
                </Avatar>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="text-sm text-gray-600">{friend.email}</p>
                </div>
              </Card>
            ))}
          </div>
          <Button className="mt-4" onClick={() => router.push("./friends")}>
            Add New Friends
          </Button>
        </section>

        {/* Settlements Section */}
        <section className="mt-8">
          <div className="text-xl font-semibold text-gray-700 p-0" >Your Settlements </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-gray-800">Credits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {settlements.credits.slice(-3).reverse().map((credit) => (
                  <Card key={credit.id} className="p-4">
                    <p className="text-sm text-gray-600">
                      Payer: {credit.payer?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: {credit.amount.toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Debts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {settlements.debts.slice(-3).reverse().map((debt) => (
                  <Card key={debt.id} className="p-4">
                    <p className="text-sm text-gray-600">
                      Payee: {debt.payee?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: {debt.amount.toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
