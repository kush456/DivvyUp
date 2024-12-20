"use client"
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export default function(){

    return(
        <div>
            <Button onClick={() => signIn()} variant="secondary" size="lg" className="w-full md:w-auto">
                Log In
            </Button>
        </div>
    )
}