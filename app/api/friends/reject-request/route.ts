import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function PATCH(req: Request){
    const {recieverId, senderId} = await req.json(); 
    console.log("req in reject is ", req.json());
    console.log("recieverId ", recieverId);
    
    // const data = await prisma.friendRequest.findUnique({
    //     where: { receiverId: recieverId }
    // })

    // if(!data){
    //     return NextResponse.json({ message: "Request not found" }, { status: 404 });
    // }
    try{
        await prisma.friendRequest.update({
            where: { senderId_receiverId: { senderId: senderId, receiverId: recieverId } },
            data: { status: 'rejected' },
        }) 
        return NextResponse.json({ message: "Friendrequest declined" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}