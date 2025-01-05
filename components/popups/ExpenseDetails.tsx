"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ExpenseSettlement, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import axios from "axios";

type ExpenseDetailsDialogProps = {
  expense: {
    id: number;
    description: string;
    totalAmount: number;
    createdAt: Date;
    group?: string | undefined;
    participants: {
      userId: number;
      name: string;
      amount: number;
      weight: number;
    }[];
  };
  settlementDetails: {
    id: number;
    groupId: number | null;
    createdAt: Date;
    amount: number;
    payerId: number;
    payeeId: number;
    expenseId: number;
    payer?: User;
    payee?: User;
    status: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
};


export default function ExpenseDetailsDialog({ expense, settlementDetails, isOpen, onClose }: ExpenseDetailsDialogProps) {
  console.log("settlement details : ", settlementDetails);
  const totalWeight = expense.participants.reduce((sum, p) => sum + p.weight,0);
  const session = useSession();
  const userId = session.data?.user.id || "0";

  const handleSettle = async(settlement : ExpenseSettlement) => {
    try {
      const res = await axios.post("/api/settlements", settlement);
      //do something here
    } catch (error) {
      console.error("error settling expenses: ", error);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense.description}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            <strong>Date:</strong> {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(expense.createdAt))}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Group:</strong> {expense.group || "No Group"}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Total Amount:</strong> {expense.totalAmount.toFixed(2)}
          </p>
          <div>
            <strong>Participants:</strong>
            <ul className="mt-2 space-y-2">
              {expense.participants.map((participant) => (
                <li key={participant.userId} className="flex items-center gap-2">
                  <Avatar>
                    <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                      {participant.name[0].toUpperCase()}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-sm text-gray-500">
                      Paid: {participant.amount.toFixed(2)} | Weight: {participant.weight} | Balance : {(participant.amount - (participant.weight*expense.totalAmount)/(totalWeight)).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Settlements: </strong>
            <ul className="mt-2 space-y-2">
              {settlementDetails.map((settlement) => (
                <li key={settlement.id} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">{settlement.payer?.name} owes {settlement.payee?.name}</p>
                    <p className="text-sm text-gray-500">
                      Amount: {settlement.amount.toFixed(2)} | Status: {!(settlement.groupId) && settlement.status}
                    </p>
                  </div>
                  <div>
                    {!settlement.groupId && settlement.payeeId === parseInt(userId, 10) && settlement.status === 'unsettled' &&
                      <Button variant="secondary" onClick={() => handleSettle(settlement)}>Settle</Button>
                    }
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
