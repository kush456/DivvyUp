import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
      const expenseSettlement = await req.json();
      console.log("hi ", expenseSettlement);

      if(!expenseSettlement.groupId){
        // Update expenseSettlement status to "settled"
        await prisma.expenseSettlement.update({
            where: { id: expenseSettlement.id },
            data: { status: "settled" },
        });
    
        // Update the overall Settlement
        const settlement = await prisma.settlement.findFirst({
            where: {
                payerId: expenseSettlement.payerId,
                payeeId: expenseSettlement.payeeId,
            },
        });
    
        if (settlement) {
            const newAmount = settlement.amount - expenseSettlement.amount;
    
            if (newAmount == 0) {
                // Remove the settlement if fully settled
                await prisma.settlement.delete({
                    where: { id: settlement.id },
                });
                } else if(newAmount < 0){
                    //swap and update
                    await prisma.settlement.update({
                        where: { id: settlement.id },
                        data: {
                            payerId: expenseSettlement.payeeId,
                            payeeId: expenseSettlement.payerId,
                            amount: Math.abs(newAmount)
                        }
                    })
                } else {
                    // Update the remaining amount
                    await prisma.settlement.update({
                        where: { id: settlement.id },
                        data: { amount: newAmount },
                    });
            } 
        } else {
            //rev find and add
            const settlement = await prisma.settlement.findFirst({
                where: {
                    payerId: expenseSettlement.payeeId,
                    payeeId: expenseSettlement.payerId,
                },
            });
            if(settlement) {
                const newAmount = settlement.amount + expenseSettlement.amount;
                await prisma.settlement.update({
                    where: { id: settlement.id },
                    data: { amount: newAmount },
                });
            }

        }
      }
      

    //   //handling group cases:
    //   if((expenseSettlement.groupId) && expenseSettlement.groupId !== 0){
    //     //updating group settlemet
    //     const settlement = await prisma.groupSettlement.findFirst({
    //         where: {
    //             payerId: expenseSettlement.payerId,
    //             payeeId: expenseSettlement.payeeId,
    //         },
    //     });
      
    //     if (settlement) {
    //         const newAmount = settlement.amount - expenseSettlement.amount;
      
    //         if (newAmount <= 0) {
    //           // Remove the settlement if fully settled
    //           await prisma.groupSettlement.delete({
    //             where: { id: settlement.id },
    //           });
    //         } else {
    //           // Update the remaining amount
    //           await prisma.groupSettlement.update({
    //             where: { id: settlement.id },
    //             data: { amount: newAmount },
    //           });
    //         }
    //     }

    //     //updating group balances 
    //     const groupBalancePayee = await prisma.groupBalance.findFirst({
    //         where: {
    //             userId: expenseSettlement.payeeId,
    //             groupId: expenseSettlement.groupId,
    //         },
    //     });
    //     const groupBalancePayer = await prisma.groupBalance.findFirst({
    //         where: {
    //             userId: expenseSettlement.payerId,
    //             groupId: expenseSettlement.groupId,
    //         },
    //     });

    //     //for payee
    //     if (groupBalancePayee) {
    //         const newAmount = groupBalancePayee.balance - expenseSettlement.amount;
      
    //         // Update the remaining amount
    //         await prisma.groupBalance.update({
    //             where: {
    //                 groupId_userId : {
    //                     groupId: expenseSettlement.groupId,
    //                     userId: expenseSettlement.payeeId,
    //                 },
    //             },
    //             data: { balance: newAmount },
    //         });
    //     }

    //     //for payer
    //     if (groupBalancePayer) {
    //         const newAmount = groupBalancePayer.balance + expenseSettlement.amount;
      
    //         // Update the remaining amount
    //         await prisma.groupBalance.update({
    //             where: {
    //                 groupId_userId: {
    //                     groupId: expenseSettlement.groupId,
    //                     userId: expenseSettlement.payerId,
    //                 }, 
    //             },
    //             data: { balance: newAmount },
    //         });
    //     }

    //   }

      return NextResponse.json({ message: "Settlement updated successfully" });
    } catch (error) {
      console.error("Error updating settlement:", error);
      return NextResponse.json({ error: "Failed to update settlement" }, { status: 500 });
    }
  }