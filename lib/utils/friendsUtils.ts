//now fetch data by directly using prisma cz that is the flow na
//then pass that data from here back to the client cz that is the flow

import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

type FriendDetails = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    groups: never[];
}
//better fetching
export async function getFriendsDetails(session : Session){
    
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");
    try{
        // Retrieve all friends of the logged-in user
        const friends = await prisma.friend.findMany({
            where: {
                OR: [
                    { userId: userId },  // User is the one requesting the friendship
                    { friendId: userId }, // User is the friend of another user
                ],
            },
            include: {
                user: true,  // Include the user details (e.g., the friend)
                friend: true, // Include the friend details (e.g., the user)
            },
        });

        // Map over the friends to return their details
        const friendDetails = friends.map((friend) => {
            // Determine which user is the friend and which is the requester
            const friendUser = friend.user.id === userId ? friend.friend : friend.user;
            return {
                id: friendUser.id,
                name: friendUser.name,
                email: friendUser.email,
                avatar: "/images/default-avatar.jpg", // Placeholder avatar
                balance: 0, // Placeholder balance
                groups: [], // Placeholder groups
                
            };
        });

        //console.log("friends" , friendDetails);
        return friendDetails;
    } catch(error){
        console.error("Error fetching friends:", error);
        throw new Error("Failed to fetch friends");
    }
}

export async function getBalances(session: Session, friendDetails: FriendDetails[]){
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");
    try{
        const balances = await Promise.all(friendDetails.map(async (friend) => {
            return await prisma.settlement.findFirst({
                where: {
                    OR : [
                        {payeeId: userId, payerId : friend.id},
                        {payeeId: friend.id, payerId: userId}
                    ]
                }
            })
        }));
        return balances;
    } catch(error) {
        console.error("Error fetching balances:", error);
        throw new Error("Failed to fetch balances");
    }
}

export async function getGroups(session: Session, friendDetails: FriendDetails[]) {
    const userId = parseInt(session.user.id || "0");
    if (userId === 0) return redirect("/api/auth/signin");

    try {
        // Fetch all groups where the user is a member
        const userGroups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                members: true, // Include group members for further filtering
            },
        });

        // Filter and assign common groups for each friend
        const updatedFriendDetails = friendDetails.map((friend) => {
            // Find groups where the friend is also a member
            const commonGroups = userGroups.filter((group) =>
                group.members.some((member) => member.id === friend.id)
            );

            // Extract group names
            const groupNames = commonGroups.map((group) => group.name);

            // Update the friend's groups
            return {
                ...friend,
                groups: groupNames, // Add common group names
            };
        });

        return updatedFriendDetails;
    } catch (error) {
        console.error("Error fetching groups:", error);
        throw new Error("Failed to fetch groups");
    }
}

export async function getFriendRequests(session : Session){

    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    
    try{
        // Retrieve all friend requests of the logged-in user
        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId,
                status: "pending"
            },
            include: {
                sender: true, 
                receiver: true,  
            }
        });

        // Map over the friendrequests to return their details
        const friendRequestDetails = friendRequests.map((request) => {
            const sender = request.sender;
            return {
                id: sender.id,
                name: sender.name,
                email: sender.email,
                avatar: "/images/default-avatar.jpg",
            };
        });

        //console.log("requests", friendRequestDetails);
        return friendRequestDetails;
    } catch(error){
        console.error("Error fetching requests:", error);
        throw new Error("Failed to fetch requests");
    }
}