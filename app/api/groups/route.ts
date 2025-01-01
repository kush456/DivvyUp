import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();
export async function POST(req : Request){
    try {
        const {groupName, members} = await req.json();
        //console.log(groupName, members);
        
        if (!groupName || !members || members.length === 0) {
            return NextResponse.json(
              { error: 'Group name and members are required' },
              { status: 400 }
            );
        }

        //ye error tha, agli baar types of id ko consistent rkhna
        const memberIds = members.map((member: { id: string }) => ({ id: parseInt(member.id) }));
        const newGroup = await prisma.group.create({
            data : {
                name: groupName,
                members: {
                    connect : memberIds
                }
            }
        });

        return NextResponse.json(newGroup, { status: 201 });
        //console.log(newGroup);
        
    } catch (error){
        console.error('Error creating group:', error);
        return NextResponse.json(
        { error: 'Failed to create group' },
        { status: 500 }
        );
    }

}