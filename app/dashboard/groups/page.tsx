import GroupsPage from "@/components/pages/dashboard/Groups";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getGroupBalance, getGroupsDetails } from "@/lib/utils/groupUtils";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";







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