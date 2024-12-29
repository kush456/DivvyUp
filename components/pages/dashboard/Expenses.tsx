"use client";


import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AppBar from "../AppBar";
import { Button } from "@/components/ui/button";
import OweOwedDialog from "@/components/popups/OweOwed";
import ExpenseDetailsDialog from "@/components/popups/ExpenseDetails";



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
};

type ExpensePageProps = {
    expenses: Expenses[];
}

const dummyBalances = {
    youOwe: [
      { id: 1, name: "Josh Miller", avatar: "/avatar1.png", amount: "$10.00" },
      { id: 2, name: "Sam Davis", avatar: "/avatar2.png", amount: "$20.00" },
      { id: 3, name: "Emma Stone", avatar: "/avatar3.png", amount: "$15.00" },
    ],
    youAreOwed: [
      { id: 1, name: "Liam Brown", avatar: "/avatar4.png", amount: "$30.00" },
      { id: 2, name: "Sophia Green", avatar: "/avatar5.png", amount: "$25.00" },
      { id: 3, name: "Olivia Black", avatar: "/avatar6.png", amount: "$50.00" },
    ],
};

export default function ExpensesPage({expenses} : ExpensePageProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isBalancesDialogOpen, setIsBalancesDialogOpen] = useState(false);
    const [isExpensesDialogOpen, setIsExpensesDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);

    const handleExpenseClick = (expense: Expenses) => {
        setSelectedExpense(expense);
        setIsExpensesDialogOpen(true);
    };
    

    const filteredExpenses = expenses.filter((expense) =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="container mx-auto mt-8 px-4">
            <div className="flex flex-wrap gap-4 justify-between">
            {/* Left Section */}
            <div className="hidden md:block flex-1 min-w-[280px] max-w-[300px]">
                <div className="mb-6">
                <h3 className="text-lg font-bold">You owe</h3>
                <div className="space-y-4">
                    {dummyBalances.youOwe.map((person) => (
                    <div key={person.id} className="flex items-center space-x-4">
                        <Avatar>
                        <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-10 h-10 rounded-full"
                        />
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium">@{person.name}</p>
                        <p className="text-sm text-gray-500">{person.amount}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
                <div>
                <h3 className="text-lg font-bold">You are owed</h3>
                <div className="space-y-4">
                    {dummyBalances.youAreOwed.map((person) => (
                    <div key={person.id} className="flex items-center space-x-4">
                        <Avatar>
                        <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-10 h-10 rounded-full"
                        />
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium">@{person.name}</p>
                        <p className="text-sm text-gray-500">{person.amount}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 min-w-[280px]">
                <div className="mb-6">
                <h2 className="text-2xl font-bold">Expenses</h2>
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
                                {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(expense.createdAt))}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm font-medium">{expense.totalAmount}</p>
                    </div>
                ))}
                </div>
                {/* Balances Button (Visible on small screens) */}
                <div className="mt-6 md:hidden">
                    <Button onClick={() => setIsBalancesDialogOpen(true)}>Balances</Button>
                </div>
            </div>
            </div>
        </div>
            <OweOwedDialog isOpen={isBalancesDialogOpen} onClose={() => setIsBalancesDialogOpen(false)} />
            {selectedExpense && (
                <ExpenseDetailsDialog
                expense={selectedExpense}
                isOpen={isExpensesDialogOpen}
                onClose={() => setIsExpensesDialogOpen(false)}
                />
            )}
        </div>
    );
}
