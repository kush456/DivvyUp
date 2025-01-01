import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GroupsPage from "@/components/pages/dashboard/Groups";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";


const prisma = new PrismaClient();

export async function getGroupsDetails(session: Session){
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");
    try{
        
        const groups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                members: true,
                //yaha expenses bhi fetch krna later
            }     
        });
        
        return groups;
        
    }catch(error){
        console.error("Error fetching groups details:", error);
        throw new Error("Failed to fetch groups details");
    }
        
}


export default async function(){
    const session = await getServerSession(authOptions);
    //console.log("session retrieved", session);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }

    const groups = await getGroupsDetails(session);
    return(
        <GroupsPage groups={groups}/>
    )
}