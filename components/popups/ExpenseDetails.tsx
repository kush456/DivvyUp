"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

type ExpenseDetailsDialogProps = {
  expense: {
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
  isOpen: boolean;
  onClose: () => void;
};

export default function ExpenseDetailsDialog({ expense, isOpen, onClose }: ExpenseDetailsDialogProps) {
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
                      Paid: {participant.amount.toFixed(2)} | Weight: {participant.weight}
                    </p>
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
