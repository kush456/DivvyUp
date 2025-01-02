"use client";

import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AppBar from "../AppBar";
import { Button } from "@/components/ui/button";
import OweOwedDialog from "@/components/popups/OweOwed";
import ExpenseDetailsDialog from "@/components/popups/ExpenseDetails";
import { useRouter } from "next/navigation";

// Dummy data
const dummyGroupName = "Family Group";
const dummyExpenses = [
  {
    id: 1,
    description: "Lunch at the restaurant",
    totalAmount: 100,
    createdAt: new Date(),
    participants: [
      { userId: 1, name: "Alice", amount: 50, weight: 1 },
      { userId: 2, name: "Bob", amount: 50, weight: 1 },
    ],
  },
  {
    id: 2,
    description: "Movie tickets",
    totalAmount: 60,
    createdAt: new Date(),
    participants: [
      { userId: 1, name: "Alice", amount: 30, weight: 1 },
      { userId: 3, name: "Charlie", amount: 30, weight: 1 },
    ],
  },
];

const dummyBalances = {
  credits: [
    { id: 1, amount: 50, payerId: 1, payeeId: 2, payer: { name: "Alice" }, payee: { name: "Bob" } },
    { id: 2, amount: 30, payerId: 1, payeeId: 3, payer: { name: "Alice" }, payee: { name: "Charlie" } },
  ],
  debts: [
    { id: 3, amount: 50, payerId: 2, payeeId: 1, payer: { name: "Bob" }, payee: { name: "Alice" } },
    { id: 4, amount: 30, payerId: 3, payeeId: 1, payer: { name: "Charlie" }, payee: { name: "Alice" } },
  ],
};

const dummyGroupMembers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

//dummy groupId for now
const groupId = 4;

export default function GroupDetailsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isBalancesDialogOpen, setIsBalancesDialogOpen] = useState(false);
  const [isExpensesDialogOpen, setIsExpensesDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<typeof dummyExpenses[0] | null>(null);
  const router = useRouter();

  const handleExpenseClick = (expense: typeof dummyExpenses[0]) => {
    setSelectedExpense(expense);
    setIsExpensesDialogOpen(true);
  };

  const filteredExpenses = dummyExpenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="container mx-auto mt-8 px-4">
        {/* Group Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{dummyGroupName}</h1>
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          {/* Left Section: Balances */}
          <div className="hidden md:block flex-1 min-w-[280px] max-w-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-bold">You owe</h3>
              <div className="space-y-4">
                {dummyBalances.debts.map((debt) => (
                  <div key={debt.id} className="flex items-center space-x-4">
                    <Avatar>
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                        {debt.payee?.name[0].toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{debt.payee?.name || "NA"}</p>
                      <p className="text-sm text-gray-500">{debt.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">You are owed</h3>
              <div className="space-y-4">
                {dummyBalances.credits.map((credit) => (
                  <div key={credit.id} className="flex items-center space-x-4">
                    <Avatar>
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                        {credit.payer?.name[0].toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{credit.payer?.name || "NA"}</p>
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
                <Button onClick={() => router.push(`../expenses/addExpenses/${groupId}`)}>Add Expense</Button>
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
            {dummyGroupMembers.map((member) => (
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
    
      {/* <OweOwedDialog isOpen={isBalancesDialogOpen} onClose={() => setIsBalancesDialogOpen(false)} />
      {selectedExpense && (
        <ExpenseDetailsDialog
          expense={selectedExpense}
          isOpen={isExpensesDialogOpen}
          onClose={() => setIsExpensesDialogOpen(false)}
        />
      )} */}
    </div>
  );
}
