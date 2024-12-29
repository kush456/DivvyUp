//do data fetching here from prisma and send it as props in the client component
//do all data fetching first, see if it works =, then we will edit the component

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FriendsPage from "@/components/pages/dashboard/Friends";
import { PrismaClient } from "@prisma/client";

import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";


//now fetch data by directly using prisma cz that is the flow na
//then pass that data from here back to the client cz that is the flow

const client = new PrismaClient();

//better fetching
export async function getFriendsDetails(session : Session){
    
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");
    try{
        // Retrieve all friends of the logged-in user
        const friends = await client.friend.findMany({
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

        console.log("friends" , friendDetails);
        return friendDetails;
    } catch(error){
        console.error("Error fetching friends:", error);
        throw new Error("Failed to fetch friends");
    }
}

async function getFriendRequests(session : Session){

    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    
    try{
        // Retrieve all friend requests of the logged-in user
        const friendRequests = await client.friendRequest.findMany({
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

        console.log("requests", friendRequestDetails);
        return friendRequestDetails;
    } catch(error){
        console.error("Error fetching requests:", error);
        throw new Error("Failed to fetch requests");
    }
}
export default async function(){
    const session = await getServerSession(authOptions);
    //console.log("session retrieved", session);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }
    const friendDetails = await getFriendsDetails(session);
    const friendRequests = await getFriendRequests(session);
    
    return(
        
        <div>
            <FriendsPage friends={friendDetails} friendRequests={friendRequests}/>
        </div>
    )
}

