// app/api/friends/send-request/route.ts (in App Directory)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { senderId, receiverEmail } = await req.json(); // Use await for the body in App Directory

  if (!senderId || !receiverEmail) {
    return NextResponse.json({ error: "Missing senderId or receiverEmail" }, { status: 400 });
  }

  try {
    // Find the receiver by email
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if a friend request or friendship already exists
    const existingRequest = await prisma.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId: receiver.id } },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
    }

    const existingFriendship = await prisma.friend.findUnique({
      where: { userId_friendId: { userId: senderId, friendId: receiver.id } },
    });

    if (existingFriendship) {
      return NextResponse.json({ error: "Already friends" }, { status: 400 });
    }

    // Create a new friend request
    await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: receiver.id,
      },
    });

    return NextResponse.json({ message: "Friend request sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
