//do data fetching here from prisma and send it as props in the client component
//do all data fetching first, see if it works =, then we will edit the component

import FriendsPage from "@/components/pages/dashboard/Friends";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getBalances, getFriendRequests, getFriendsDetails, getGroups } from "@/lib/utils/friendsUtils";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";



export default async function(){
    const session = await getServerSession(authOptions);
    //console.log("session retrieved", session);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }
    const friendDetails = await getFriendsDetails(session);
    const friendRequests = await getFriendRequests(session);
    const balances = await getBalances(session, friendDetails);
    

    //updating balance:
    const FriendDetailsWithBalances = friendDetails.map((friend) => {
        // Find the balance entry for the current friend
        const matchingBalance = balances.find((balance) => 
            balance &&
            (balance.payerId === friend.id || balance.payeeId === friend.id)
        );
    
        // Calculate the balance based on whether the friend is the payer or payee
        const balance = matchingBalance
            ? (matchingBalance.payerId === friend.id
                ? matchingBalance.amount // If friend is the payer, balance is posi
                : -matchingBalance.amount) // If friend is the payee, balance is negi
            : 0; // Default to 0 if no matching balance is found
    
        // Return the updated friend object
        return {
            ...friend,
            balance,
        };
    });
    
    console.log(FriendDetailsWithBalances);
    
    const updatedFriendDetails = await getGroups(session, FriendDetailsWithBalances);
    //console.log("balances retrieved", balances);
    console.log("updatedFriendDetails" , updatedFriendDetails);
    return(
        
        <div>
            <FriendsPage friends={updatedFriendDetails} friendRequests={friendRequests}/>
        </div>
    )
}

