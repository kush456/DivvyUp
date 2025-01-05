import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GroupDetailsPage from "@/components/pages/Group/GroupDetails";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { getExpenseSettlementDetails } from "../../expenses/page";


const prisma = new PrismaClient();

export async function getGroupDetails(groupId: number, session: Session){
    // Fetch group details
    const groupDetails = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          expenses: {
            include: {
              participants: {
                include : {
                  user: true,
                }
              }
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

export async function getGroupExpenses(groupId: number, session : Session){
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");

    try{
        const expenses = await prisma.expense.findMany({
            where: {
              groupId,
            },
            include: {
                participants: {
                    include: {
                        user: true, // Fetch user details for participants
                    },
                },
                group: true, // Include group details if necessary
            },
        });

        const expenseDetails = expenses.map((expense) => {
            
            return {
                id: expense.id,
                description: expense.description,
                totalAmount: expense.totalAmount,
                createdAt: expense.createdAt,
                group: expense.group?.name,
                participants: expense.participants.map((participant) => {
                    return {
                        userId: participant.userId,
                        name: participant.user?.name,
                        amount : participant.paidAmount,
                        weight : participant.weight
                    };
                }),
            };
        })

        return expenseDetails;
    } catch(error){
        console.error("Error fetching expenses:", error);
        throw new Error("Failed to fetch expenses");
    }
}

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
