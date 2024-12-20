import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const AppBar = () => {
    const router = useRouter();
    return(
        <div>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                    <div className="flex items-center gap-2 ml-4">
                        <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6 text-primary"
                        >
                        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
                        </svg>
                        <h2 className="text-lg font-bold">DivvyUp</h2>
                    </div>

                    <nav className="flex items-center space-x-1 ">
                        <Button variant="link" onClick={()=>{router.push("/dashboard/userdashboard")}}>Dashboard</Button>
                        <Button variant="link" onClick={()=>{router.push("/dashboard/groups")}}>Groups</Button>
                        <Button variant="link" onClick={()=>{router.push("/dashboard/expenses")}}>Expenses</Button>
                        <Button variant="link" onClick={()=>{router.push("/dashboard/friends")}}>My Friends</Button>
                        <Button variant="ghost" style={{ padding: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </Button>
                        <Button variant="ghost" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </Button>
                    </nav>
                </div>
            </header>
            {/* App Bar
            <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-700">DivvyUp</h1>
                <nav className="flex items-center space-x-6">
                <Button variant="link" >
                    Dashboard
                </Button>
                <Button variant="link" >
                    New Expense
                </Button>
                <Button variant="link" >
                    Groups
                </Button>
                <Avatar>
                    <AvatarImage src="/images/default-user.jpg" alt="User Avatar" />
                </Avatar>
                </nav>
            </div>
            </header> */}
        </div>
    )
}

export default AppBar;