"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { sendFriendRequest } from "@/lib/friends";
import { useSession } from "next-auth/react";

type AddFriendDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddFriendDialog({ isOpen, onClose }: AddFriendDialogProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const {data : session, status} = useSession();

    console.log("session: ", session);
    const senderId = status === "authenticated" && session?.user?.id
        ? parseInt(session.user.id) // Convert to integer
        : null;
    const handleSendRequest = async () => {
        if (!email.trim()) {
        setMessage("Please enter a valid email.");
        return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
        //api post request, where i need to send the email of reciever and id of sender
            await sendFriendRequest(senderId, email);

            setMessage("Friend request sent successfully!");
            setEmail(""); // Clear the input field
        } catch (error) {
            setMessage("Failed to send friend request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
            <DialogDescription>
                Enter the email of the user you want to send a friend request to.
            </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
            <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
            />
            {message && (
                <p
                className={`text-sm ${
                    message.startsWith("Friend request sent")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {message}
                </p>
            )}
            </div>
            <DialogFooter>
            <Button
                onClick={handleSendRequest}
                disabled={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
