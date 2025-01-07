"use client";

import { signOut, useSession } from "next-auth/react";

export default function SignOutButton() {
  const { data: session } = useSession();

  if (!session) return null; // Don't show the button if the user is not signed in

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
