import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
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
