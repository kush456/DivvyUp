import GroupsPage from "@/components/pages/dashboard/Groups";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";


const prisma = new PrismaClient();

export async function getGroupsDetails(session: Session){
    const userId = parseInt(session.user.id || "0");
    //console.log("group mai session ", session);
    //console.log("userId: " + userId);
    if(userId === 0){
        //console.log("group error");
        return redirect("/api/auth/signin");
    } 
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
                balances: true
            }     
        });
        
        return groups;
        
    }catch(error){
        console.error("Error fetching groups details:", error);
        throw new Error("Failed to fetch groups details");
    }
        
}

export async function getGroupBalance(session: Session){
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");
    try{
        
        const balance = await prisma.groupBalance.findMany({
            where: {
                userId
            },
            include: {
                group: true,
            }
        })
         
        return balance;
    } catch(error){
        console.error("Error fetching group balance :", error);
        throw new Error("Failed to fetch group balance");
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
    const balance = await getGroupBalance(session);
    return(
        <GroupsPage groups={groups} />
    )
}