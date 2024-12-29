import DashboardPage from "@/components/pages/DashboardPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function(){

    const session = await getServerSession();
        if(!session || !session.user){
            return redirect("/api/auth/signin");
        }
    return(
        <div>
            <DashboardPage />
        </div>
    )
}