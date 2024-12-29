import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ExpensesPage from "@/components/pages/dashboard/Expenses";
import { PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function getExpenses(session : Session){
    const userId = parseInt(session.user.id || "0");
    //console.log(session);
    //console.log("userId: " + userId);
    if(userId === 0) return redirect("/api/auth/signin");

    try{
        const expenses = await prisma.expense.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId, // Check if the user is a participant
                    },
                },
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

// export async function getSettlementDetails(session: Session){
//     const userId = parseInt(session.user.id || "0");
//     //console.log(session);
//     //console.log("userId: " + userId);
//     if(userId === 0) return redirect("/api/auth/signin");

//     try{
//         const credits = await prisma.settlement.findMany({
//             where: {
//                 payeeId: userId
//             }
//         })
//     } catch(error){
//         console.error("Error fetching settlement details:", error);
//         throw new Error("Failed to fetch settlement details");
//     }

//     try{
//         const debts = await prisma.settlement.findMany({
//             where: {
//                 payerId: userId
//             }
//         })
//     } catch(error){
//         console.error("Error fetching settlement details:", error);
//         throw new Error("Failed to fetch settlement details");
//     }

    
// }
export default async function(){

    const session = await getServerSession(authOptions);
    //console.log("session retrieved", session);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }

    const expenseDetails = await getExpenses(session);

    return(
        <div>
            <ExpensesPage expenses={expenseDetails}/>
        </div>
    )
}