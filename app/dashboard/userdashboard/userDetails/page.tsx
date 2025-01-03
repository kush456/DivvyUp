import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserDetailsPage from "@/components/pages/dashboard/UserDetails";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function(){
    
    return(
        <div>
            <UserDetailsPage/>
        </div>
    )
}