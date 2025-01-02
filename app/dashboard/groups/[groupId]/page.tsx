import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GroupDetailsPage from "@/components/pages/Group/GroupDetails";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";


const prisma = new PrismaClient();

export async function getGroupDetails(groupId: number, session: Session){
    // Fetch group details
    const groupDetails = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          expenses: {
            include: {
              participants: true,
            },
          },
          balances: true,
          settlements: true,
          groupSettlements: {
            include : {
                payer: true,
                payee: true,
            }
          },
        },
    });

    return groupDetails;
}
export default async function({ params }: { params: { groupId: string } }){
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }
    const groupId = parseInt(params.groupId, 10);
    const groupDetails = await getGroupDetails(groupId, session);
    const expenses = groupDetails?.expenses
    //console.log(groupId);
    return(
        <GroupDetailsPage group={groupDetails}/>
    )
}