"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import FriendDetailsDialog from "@/components/popups/FriendDetailDialogue";
import AppBar from "@/components/pages/AppBar";
import AddFriendDialog from "@/components/popups/AddFriendDialog";
import axios from "axios";
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/friends";
import { useSession } from "next-auth/react";


type Friend = {
  id: number;
  name: string;
  email: string;
  balance: number;
  avatar: string;
  groups: string[];
};

type FriendRequest = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

type FriendsPageProps = {
    friends: Friend[];
    friendRequests: FriendRequest[];
};

async function handleAccept(recieverId : number | null, senderId : number | null){
    //first add the friend(both ways)
    //then a request that updates the status of that friend request, further deletes it then
    console.log("recieverId on client side " + recieverId);
    await acceptFriendRequest(recieverId, senderId);
}

async function handleReject(recieverId : number | null, senderId : number | null){
    //in this case update status to rejected
    //further delete the entry from the database
    await rejectFriendRequest(recieverId, senderId);
}

export default function FriendsPage({ friends, friendRequests }: FriendsPageProps) {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const {data : session, status} = useSession();

    const recieverId = status === "authenticated" && session?.user?.id
        ? parseInt(session.user.id) // Convert to integer
        : null;

    const filteredFriends = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <AppBar />

            <main className="flex-1 container mx-auto px-4 py-6 min-w-[320px] max-w-6xl ">
                <h1 className="text-2xl font-bold mb-4">Friends</h1>
                <p className="text-gray-600 mb-4">
                    Split bills with friends and groups on DivvyUp
                </p>

                {/* Search Input */}
                <Input
                    placeholder="Search for a friend"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-6 bg-slate-200"
                />

                {/* Friend Requests */}
                {friendRequests.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Friend requests</h2>
                        <div className="space-y-4">
                            {friendRequests.map((friend) => (
                            <Card key={friend.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-12 h-12">
                                        <img
                                        src={friend.avatar}
                                        alt={friend.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{friend.name}</p>
                                        <p className="text-sm text-gray-600">{friend.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Button variant="default" onClick={() => handleAccept(recieverId, friend.id)}>Accept</Button>
                                    <Button variant="outline" onClick={() => handleReject(recieverId, friend.id)}>Reject</Button>
                                </div>
                                
                            </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Friends List */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Friends</h2>
                    <div className="space-y-4">
                    {filteredFriends.map((friend) => (
                        <Card
                        key={friend.id}
                        className="p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => setSelectedFriend(friend)}
                        >
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                            <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            </Avatar>
                            <div>
                            <p className="font-medium">{friend.name}</p>
                            <p className="text-sm text-gray-600">
                                Owes you ${friend.balance.toFixed(2)}
                            </p>
                            </div>
                        </div>
                        <Button variant="destructive">Remove</Button>
                        </Card>
                    ))}
                    </div>
                </div>

                {/* Add Friends Button */}
                <div className="mt-8 text-center">
                    <Button className="px-6 py-2" onClick={() => setIsAddFriendDialogOpen(true)}>Add Friends</Button>
                    <AddFriendDialog
                        isOpen={isAddFriendDialogOpen}
                        onClose={() => setIsAddFriendDialogOpen(false)}
                    />
                </div>

                {/* Friend Details Dialog */}
                {selectedFriend && (
                    <FriendDetailsDialog
                    friend={{...selectedFriend, id : selectedFriend.id.toString()}}
                    isOpen={!!selectedFriend}
                    onClose={() => setSelectedFriend(null)}
                    />
                )}
            </main>
        </div>
    );
}
