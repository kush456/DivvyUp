import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import GroupAddExpenseForm from "@/components/forms/GroupAddExpenseForm";

const prisma = new PrismaClient();

interface AddExpensePageProps {
  params: Promise<{ groupId: string }>; // Extract groupId from URL
}

export async function getGroupMembers(groupId: number) {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }
  
    return group.members;
  }

export default async function AddExpensePage(props: AddExpensePageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log("Session not found:", session);
    return redirect("/api/auth/signin");
  }

  const groupId = parseInt(params.groupId, 10);

  try {
    const groupMembers = await getGroupMembers(groupId);

    const convertedMembers = groupMembers.map((member) => ({
        ...member,
        id: member.id.toString(), // Convert `id` to string
    }));

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add an Expense</h1>
        <GroupAddExpenseForm groupId={groupId} members={convertedMembers} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return redirect("/dashboard"); // Redirect if group is invalid
  }
}
