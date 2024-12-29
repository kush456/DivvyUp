import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();
export async function POST(req: Request){
    const { recieverId, senderId} = await req.json(); 
    //console.log("req id : " , recieverId);

    if (!senderId || !recieverId) {
        return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
    }

    try {
        //console.log("trying");
        // Find the receiver by email
        const receiver = await prisma.user.findUnique({
            where: { id: recieverId },
        });
        const sender = await prisma.user.findUnique({
            where: { id: senderId },
        });

        if (!receiver || !sender) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if a friendship already exists
        const existingFriendship = await prisma.friend.findUnique({
            where: { userId_friendId: { userId: senderId, friendId: receiver.id } },
        });

        if (existingFriendship) {
            return NextResponse.json({ error: "Already friends" }, { status: 400 });
        }

        // Create a new friend 
        await prisma.friend.createMany({
            data: [
                { userId : senderId, friendId : recieverId }, 
            ],
        });

        return NextResponse.json({ message: "Friendship made successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PATCH(req: Request){
    const {recieverId, senderId} = await req.json(); 
    // console.log("req id : " , recieverId);

    
    const data = await prisma.friendRequest.findUnique({
        where: { id: recieverId }
    })
    
    if (!senderId || !recieverId) {
        return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
    }
    try{
        await prisma.friendRequest.update({
            where: { senderId_receiverId: { senderId: senderId, receiverId: recieverId } },
            data: { status: 'accepted' },
        }) 
        return NextResponse.json({ message: "Friendship made successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}