import DashboardPage from "@/components/pages/DashboardPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getGroupDetails } from "../groups/[groupId]/page";
import { getGroupsDetails } from "../groups/page";
import { getExpenses, getSettlementDetails } from "../expenses/page";
import { getFriendsDetails } from "../friends/page";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function(){

    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        //console.log("dashboard");
        return redirect("/api/auth/signin");
    }

    const groups = await getGroupsDetails(session);
    //console.log(groups);
    const expenses = await getExpenses(session);
    //console.log(expenses);
    const friends = await getFriendsDetails(session);
    const settlements = await getSettlementDetails(session);

    return(
        <div>
            <DashboardPage groups={groups} expenses={expenses} friends={friends} settlements={settlements}/>
        </div>
    )
}