"use client";


import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AppBar from "../AppBar";
import { Button } from "@/components/ui/button";
import OweOwedDialog from "@/components/popups/OweOwed";
import ExpenseDetailsDialog from "@/components/popups/ExpenseDetails";
import { useRouter } from "next/navigation";
import { ExpenseSettlement } from "@prisma/client";



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

type User = {
    name: string;
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

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

type BalanceDetails = {
    credits : Settlement[];
    debts : Settlement[];
}
type ExpenseProps = {
    expenses: Expenses[];
    balances: BalanceDetails;
    expenseSettlementDetails: ExpenseSettlement[];
};



export default function ExpensesPage({expenses, balances, expenseSettlementDetails} : ExpenseProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isBalancesDialogOpen, setIsBalancesDialogOpen] = useState(false);
    const [isExpensesDialogOpen, setIsExpensesDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);
    const [selectedSettlements, setSelectedSettlements] = useState<ExpenseSettlement[]>([]);
    const router = useRouter();

    const handleExpenseClick = (expense: Expenses) => {
        setSelectedExpense(expense);
        // Filter settlements for the selected expense
        const filteredSettlements = expenseSettlementDetails.filter(
            (settlement) => settlement.expenseId === expense.id
        );
        setSelectedSettlements(filteredSettlements);
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
                    {balances.debts.map((debt) => (
                    <div key={debt.id} className="flex items-center space-x-4">
                        <Avatar>
                            <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                                {(debt.payee) ? debt.payee.name[0].toUpperCase() : 'NA'}
                            </div>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{(debt.payee) ? debt.payee.name : "NA"}</p>
                            <p className="text-sm text-gray-500">{debt.amount.toFixed(2)}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
                <div>
                <h3 className="text-lg font-bold">You are owed</h3>
                <div className="space-y-4">
                    {balances.credits.map((credit) => (
                    <div key={credit.id} className="flex items-center space-x-4">
                        <Avatar>
                            <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                                {(credit.payer) ? credit.payer.name[0].toUpperCase() : 'NA'}
                            </div>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{(credit.payer) ? credit.payer.name : 'NA'}</p>
                            <p className="text-sm text-gray-500">{credit.amount.toFixed(2)}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 min-w-[280px]">
                <div className="mb-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Expenses</h2>
                        <Button onClick={() => {router.push('./expenses/addExpenses')}}>
                            Add Expense
                        </Button>
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
                settlementDetails={selectedSettlements}
                isOpen={isExpensesDialogOpen}
                onClose={() => setIsExpensesDialogOpen(false)}
                />
            )}
        </div>
    );
}
