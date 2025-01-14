import AddExpenseForm from "@/components/forms/AddExpenseForm";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getFriendsDetails } from "@/lib/utils/friendsUtils";


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
