import minimizeDebts from "@/lib/minimizeDebts";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req : Request){
    const {totalAmount, description, participants, splitType} = await req.json();

    try{
        const expense = await prisma.expense.create({
            data : {
                totalAmount,
                description,
                participants : {
                    create: participants.map((participant: any) => ({
                        userId: parseInt(participant.id, 10),
                        paidAmount: participant.paidAmount,
                        weight: participant.weight,
                      })),
                },
                splitType
            }
        });

        // Fetch updated balances and minimize debts
        const allParticipants = await prisma.participant.findMany({
            where: { expenseId: expense.id },
            include: { user: true },
        });

        console.log('participants ', allParticipants);

        //normalize the weights
        const totalWeight = allParticipants.reduce((sum, p) => sum + p.weight,0); 

        const balances = allParticipants.map((p) => ({
            userId: p.userId,
            amount: p.paidAmount - ((expense.totalAmount * p.weight)/totalWeight),
        }));

        console.log("balances ", balances);

        const settlements = minimizeDebts(balances);

        //now save the settlement to the db
        const settlementRecords = await Promise.all(
            settlements.map((settlement) =>
                prisma.settlement.create({
                    data: {
                        payerId: settlement.payerId,
                        payeeId: settlement.payeeId,
                        amount: settlement.amount,
                    },
                })
            )
        );

        console.log("settlements ", settlementRecords);

        return NextResponse.json({ expense, settlements: settlementRecords }, { status: 201 });              
    } catch (error){
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}