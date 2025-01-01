import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddGroupForm from "@/components/forms/AddGroupsForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getFriendsDetails } from "../../friends/page";

export default async function(){
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
            console.log("session not found ", session);
            return redirect("/api/auth/signin");
        }
    const friendDetails = await getFriendsDetails(session);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add a Group</h1>
            <AddGroupForm friends={friendDetails}/>
        </div>
    )
}