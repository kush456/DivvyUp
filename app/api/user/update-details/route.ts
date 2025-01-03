import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  // Validate input
  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }

  try {
    // Check if the email is already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== parseInt(session.user.id, 10)) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
    }

    // Update user details
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id, 10) },
      data: { name, email },
    });

    return NextResponse.json({
      message: "User details updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user details." }, { status: 500 });
  }
}
