import minimizeDebts, { calculateGroupBalances } from "@/lib/minimizeDebts";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req : Request){
    const {totalAmount, description, participants, splitType, groupId} = await req.json();

    //console.log("payload recieved: ", {totalAmount, description, participants, splitType, groupId});
    try{
        //console.log("hi");
        //if a group expense
        if (groupId && groupId!==0) {
            console.log("inside if loop");
            // Fetch existing group balances for the group
            const existingBalances = await prisma.groupBalance.findMany({
              where: { groupId },
            });
            console.log("existing group balances ", existingBalances);

            // Convert existing balances to a map for the function
            const balanceMap: Record<number, number> = {};
            existingBalances.forEach((b) => {
              balanceMap[b.userId] = b.balance;
            });
          
            // Calculate updated balances
            const groupBalances = calculateGroupBalances(
              {
                totalAmount,
                description,
                participants,
                splitType,
                groupId,
              },
              balanceMap
            );
            
            //console.log("group balances ", groupBalances);
            // Update the database using upsert
            await Promise.all(
                groupBalances.map(async (balance) => {
                    await prisma.groupBalance.upsert({
                        where: {
                            groupId_userId: { // Use the compound unique key (groupId and userId)
                                groupId,
                                userId: balance.userId,
                            },
                        },
                        update: {
                            balance: { increment: balance.amount }, // Increment the balance by the calculated amount
                        },
                        create: {
                            groupId,
                            userId: balance.userId,
                            balance: balance.amount, // Set the initial balance for a new record
                        },
                    });
                })
            );

            // Call minimizeDebts for group balances
            const groupSettlements = minimizeDebts(groupBalances);

            // Update the group settlements in the database
            await Promise.all(
                groupSettlements.map(async (settlement) => {
                    const existingGroupSettlement = await prisma.groupSettlement.findFirst({
                        where: {
                            payerId: settlement.payerId,
                            payeeId: settlement.payeeId,
                            groupId,
                        },
                    });

                if (existingGroupSettlement) {
                    // Update the existing group settlement
                    const updatedAmount = existingGroupSettlement.amount + settlement.amount;

                    if (updatedAmount < 0) {
                        // Swap payer and payee if the amount becomes negative
                        await prisma.groupSettlement.update({
                            where: { id: existingGroupSettlement.id },
                            data: {
                            payerId: settlement.payeeId,
                            payeeId: settlement.payerId,
                            amount: Math.abs(updatedAmount),
                            },
                        });
                    } else {
                        // Otherwise, update the amount
                        await prisma.groupSettlement.update({
                            where: { id: existingGroupSettlement.id },
                            data: { amount: updatedAmount },
                        });
                    }
                } else {
                    // Create a new group settlement if none exists
                    await prisma.groupSettlement.create({
                        data: {
                            groupId,
                            payerId: settlement.payerId,
                            payeeId: settlement.payeeId,
                            amount: settlement.amount,
                        },
                    });
                }

                // Reflect this settlement in the overall `settlements` table
                const existingSettlement = await prisma.settlement.findFirst({
                    where: {
                    payerId: settlement.payerId,
                    payeeId: settlement.payeeId,
                    },
                });

                if (existingSettlement) {
                    const updatedAmount = existingSettlement.amount + settlement.amount;

                    if (updatedAmount < 0) {
                        // Swap payer and payee if the amount becomes negative
                        await prisma.settlement.update({
                            where: { id: existingSettlement.id },
                            data: {
                            payerId: settlement.payeeId,
                            payeeId: settlement.payerId,
                            amount: Math.abs(updatedAmount),
                            },
                        });
                    } else {
                        await prisma.settlement.update({
                            where: { id: existingSettlement.id },
                            data: { amount: updatedAmount },
                        });
                    }
                } else {
                    const reverseSettlement = await prisma.settlement.findFirst({
                        where: {
                            payerId: settlement.payeeId,
                            payeeId: settlement.payerId,
                        },
                    });

                    if (reverseSettlement) {
                        const updatedAmount = reverseSettlement.amount - settlement.amount;

                        if (updatedAmount < 0) {
                            // Swap payer and payee
                            await prisma.settlement.update({
                            where: { id: reverseSettlement.id },
                            data: {
                                payerId: settlement.payerId,
                                payeeId: settlement.payeeId,
                                amount: Math.abs(updatedAmount),
                            },
                            });
                        } else {
                            await prisma.settlement.update({
                            where: { id: reverseSettlement.id },
                            data: { amount: updatedAmount },
                            });
                        }
                    } else {
                        // Create a new settlement
                        await prisma.settlement.create({
                            data: {
                            payerId: settlement.payerId,
                            payeeId: settlement.payeeId,
                            amount: settlement.amount,
                            },
                        });
                    }
                }
                })
            );

                    
        }
        //console.log("reached here");
        const expense = await prisma.expense.create({
            data : {
                totalAmount,
                description,
                participants : {
                    create: participants.map((participant: any) => ({
                        userId: (participant.id) ? parseInt(participant.id, 10) : parseInt(participant.userId, 10),
                        paidAmount: participant.paidAmount,
                        weight: participant.weight,
                      })),
                },
                splitType,
                groupId,
            }
        });
        //console.log("finished ");

        if(!groupId || groupId === 0){
            // Fetch updated balances and minimize debts
            const allParticipants = await prisma.participant.findMany({
                where: { expenseId: expense.id },
                include: { user: true },
            });

            //console.log('participants ', allParticipants);

            //normalize the weights
            const totalWeight = allParticipants.reduce((sum, p) => sum + p.weight,0); 

            const balances = allParticipants.map((p) => ({
                userId: p.userId,
                amount: p.paidAmount - ((expense.totalAmount * p.weight)/totalWeight),
            }));

            //console.log("balances ", balances);

            const settlements = minimizeDebts(balances);

            // Handle settlement creation or update with swapping logic
            const settlementRecords = await Promise.all(
                settlements.map(async (settlement) => {
                const existingSettlement = await prisma.settlement.findFirst({
                    where: {
                        payerId: settlement.payerId,
                        payeeId: settlement.payeeId,
                    },
                });
        
                if (existingSettlement) {
                    // Update existing settlement
                    const updatedAmount = existingSettlement.amount + settlement.amount;
        
                    if (updatedAmount < 0) {
                        // If the amount becomes negative, swap payer and payee and set positive amount
                        return prisma.settlement.update({
                            where: { id: existingSettlement.id },
                            data: {
                            payerId: settlement.payeeId,
                            payeeId: settlement.payerId,
                            amount: Math.abs(updatedAmount),
                            },
                        });
                    } else {
                        // Otherwise, just update the amount
                        return prisma.settlement.update({
                            where: { id: existingSettlement.id },
                            data: { amount: updatedAmount },
                        });
                    }
                } else {
                    // Check for reverse settlement
                    const reverseSettlement = await prisma.settlement.findFirst({
                        where: {
                            payerId: settlement.payeeId,
                            payeeId: settlement.payerId,
                        },
                    });
        
                    if (reverseSettlement) {
                        const updatedAmount = reverseSettlement.amount - settlement.amount;
            
                        if (updatedAmount < 0) {
                            // Swap payer and payee and set positive amount
                            return prisma.settlement.update({
                                where: { id: reverseSettlement.id },
                                    data: {
                                        payerId: settlement.payerId,
                                        payeeId: settlement.payeeId,
                                        amount: Math.abs(updatedAmount),
                                    },
                                });
                        } else {
                            // Otherwise, just update the amount
                            return prisma.settlement.update({
                                where: { id: reverseSettlement.id },
                                data: { amount: updatedAmount },
                            });
                        }
                    } else {
                    // Create a new settlement if no existing or reverse settlement found
                    return prisma.settlement.create({
                        data: {
                        payerId: settlement.payerId,
                        payeeId: settlement.payeeId,
                        amount: settlement.amount,
                        },
                    });
                    }
                }
                })
            );
            //console.log("settlements ", settlementRecords);
        }

        return NextResponse.json({ message: "Expense recorded successfully" }, { status: 201 });
    } catch (error){
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
//Now try this code, make a group add expenses, make new individual ones