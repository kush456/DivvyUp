"use client";

import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AppBar from "../AppBar";
import { Button } from "@/components/ui/button";
import OweOwedDialog from "@/components/popups/OweOwed";
import ExpenseDetailsDialog from "@/components/popups/ExpenseDetails";
import { useRouter } from "next/navigation";
import { GroupBalance, Participant, Settlement, User } from "@prisma/client";
import { useSession } from "next-auth/react";

type Members = {
  name: string;
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
type Expenses = {
  id: number;
  description: string;
  totalAmount: number;
  splitType: string;
  createdAt: Date;
  participants: Participant[];
}
type GroupSettlement = {
  id: number;
  amount: number;
  payerId: number;
  payeeId: number;
  groupId: number;
  createdAt: Date;
  payer?: User;
  payee?: User;
}
type Group = {
  id : number;
  name: String;
  createdAt: Date;
  members : Members[];
  expenses: Expenses[];
  settlements: Settlement[];
  balances: GroupBalance[];
  groupSettlements: GroupSettlement[];
}
type GroupDetailsProps = {
  group : Group | null;
}
export default function GroupDetailsPage({group} : GroupDetailsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpensesDialogOpen, setIsExpensesDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);
  const router = useRouter();
  const session = useSession();

  const IdOfUser = session.data?.user.id;
  const userId = (IdOfUser) ? parseInt(IdOfUser, 10) : 0;

  const credits = group?.groupSettlements.filter((settlement) => settlement.payeeId === userId);
  const debts = group?.groupSettlements.filter((settlement) => settlement.payerId === userId);

  if (!group) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Group not found</div>;
  }

  const handleExpenseClick = (expense: Expenses) => {
    setSelectedExpense(expense);
    setIsExpensesDialogOpen(true);
  };

  const filteredExpenses = group.expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="container mx-auto mt-8 px-4">
        {/* Group Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{group.name}</h1>
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          {/* Left Section: Balances */}
          <div className="hidden md:block flex-1 min-w-[280px] max-w-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-bold">You owe</h3>
              <div className="space-y-4">
                {debts?.map((debt) => (
                  <div key={debt.id} className="flex items-center space-x-4">
                    <Avatar>
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                        {debt.payee?.name.toString()[0].toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{debt.payee?.name}</p>
                      <p className="text-sm text-gray-500">{debt.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">You are owed</h3>
              <div className="space-y-4">
                {credits?.map((credit) => (
                  <div key={credit.id} className="flex items-center space-x-4">
                    <Avatar>
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                        {credit.payer?.name.toString()[0].toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{credit.payer?.name}</p>
                      <p className="text-sm text-gray-500">{credit.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Expenses */}
          <div className="flex-1 min-w-[280px]">
            <div className="mb-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <Button onClick={() => router.push(`../expenses/addExpenses/${group.id}`)}>Add Expense</Button>
              </div>
              <Input
                type="text"
                placeholder="Search expenses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-4 w-full"
              />
            </div>
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg"
                  onClick={() => handleExpenseClick(expense)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15.75a6 6 0 1 0 7.5 0M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(expense.createdAt))}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{expense.totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Group Members Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold">Group Members</h3>
          <div className="space-y-4 mt-4">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center space-x-4">
                <Avatar>
                  <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                    {member.name[0].toUpperCase()}
                  </div>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
