import AddExpenseForm from "@/components/forms/AddExpenseForm";
import { getFriendsDetails } from "../../friends/page";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function AddExpensePage() {
  const session = await getServerSession(authOptions);
  if(!session || !session.user){
          console.log("session not found ", session);
          return redirect("/api/auth/signin");
      }
  const friendDetails = await getFriendsDetails(session);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add an Expense</h1>
      <AddExpenseForm friends={friendDetails}/>
    </div>
  );
}
