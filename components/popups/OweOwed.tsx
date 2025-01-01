// ./popups/OweOwed.tsx
//this is not a popup but here you can have the left section to reuse for both the expenses and groups page
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

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

export default function OweOwedDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Balances</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* You Owe Section */}
          <div>
            <h3 className="text-lg font-bold">You owe</h3>
            <div className="mt-4 space-y-4">
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
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* You Are Owed Section */}
          <div>
            <h3 className="text-lg font-bold">You are owed</h3>
            <div className="mt-4 space-y-4">
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
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
