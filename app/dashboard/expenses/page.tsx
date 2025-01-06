import ExpensesPage from "@/components/pages/dashboard/Expenses";
import { authOptions } from "@/lib/configs/auth/authOptions";
import { getExpenses, getExpenseSettlementDetails, getSettlementDetails } from "@/lib/utils/expenseUtils";
import { Expense, ExpenseSettlement, PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";



export default async function(){

    const session = await getServerSession(authOptions);
    //console.log("session retrieved", session);
    if(!session || !session.user){
        console.log("session not found ", session);
        return redirect("/api/auth/signin");
    }

    const expenseDetails = await getExpenses(session);
    const balanceDetails = await getSettlementDetails(session);
    const expenseSettlementDetails = await getExpenseSettlementDetails(session, expenseDetails);

    //console.log("set exp are : ", expenseSettlementDetails);
    return(
        <div>
            <ExpensesPage expenses={expenseDetails} balances={balanceDetails} expenseSettlementDetails = {expenseSettlementDetails}/>
        </div>
    )
}