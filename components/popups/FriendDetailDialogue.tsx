"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

type FriendDetailsDialogProps = {
  friend: {
    id: string;
    name: string;
    email: string;
    balance: number;
    avatar: string;
    groups: string[];
  };
  isOpen: boolean;
  onClose: () => void;
};

export default function FriendDetailsDialog({
  friend,
  isOpen,
  onClose,
}: FriendDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{friend.name}</DialogTitle>
          <DialogDescription>{friend.email}</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-16 h-16">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </Avatar>

          <p className="text-gray-600">
            Balance: <strong>${friend.balance.toFixed(2)}</strong>
          </p>

          <div>
            <p className="text-gray-600">Groups with {friend.name}:</p>
            <ul className="list-disc pl-5">
              {friend.groups.length > 0 ? (
                friend.groups.map((group) => <li key={group}>{group}</li>)
              ) : (
                <li>No shared groups</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => alert("Friend removed!")}
          >
            Remove Friend
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
