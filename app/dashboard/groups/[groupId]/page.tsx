import GroupDetailsPage from "@/components/pages/Group/GroupDetails";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getGroupDetails, getGroupExpenses } from "@/lib/utils/groupUtils";
import { getExpenseSettlementDetails } from "@/lib/utils/expenseUtils";




type Params = Promise<{ groupId: string }>;


export default async function GroupDetailHandler({ params }: { params: Params }){
    const { groupId } = await params;
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }
    const IdOfGroup = parseInt(groupId, 10);
    const groupDetails = await getGroupDetails(IdOfGroup, session);
    const expenses = await getGroupExpenses(IdOfGroup, session);
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
