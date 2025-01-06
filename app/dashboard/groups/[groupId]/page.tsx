import GroupDetailsPage from "@/components/pages/Group/GroupDetails";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getGroupDetails, getGroupExpenses } from "@/lib/utils/groupUtils";
import { getExpenseSettlementDetails } from "@/lib/utils/expenseUtils";






export default async function({ params }: { params: { groupId: string } }){
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }
    const groupId = parseInt(params.groupId, 10) ;
    const groupDetails = await getGroupDetails(groupId, session);
    const expenses = await getGroupExpenses(groupId, session);
    const groupExpenseSettlementDetails = await getExpenseSettlementDetails(session, expenses);

    if (!groupDetails || !groupDetails.id) {
      console.error("Group details or ID is missing.");
      return redirect("/dashboard/groups"); // Redirect to a 404 page if the group doesn't exist
    }

    //console.log("group id is ", groupDetails.id);
    const convertedGroupDetails = {
      ...groupDetails,
      //id: groupDetails?.id || 0,
      expenseSettlementDetails: groupExpenseSettlementDetails ,
    } 

    //console.log("hi :", expenses);
    //console.log("converted :", convertedGroupDetails);
    //console.log(groupId);
    return(
        <GroupDetailsPage group={convertedGroupDetails}/>
    )
}
