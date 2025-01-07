"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppBar from "../AppBar";
import axios from "axios";
import SignOutButton from "@/components/Buttons/SignOutButton";

export default function UserDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const res = await axios.put("/api/user/update-details", formData);

      if (res.status === 200) {
        setLoading(false);
        alert("Details updated successfully!");
        await signOut({ redirect: false }); // Sign out the user without immediate redirection
        router.push("/auth/signin"); // Redirect to the sign-in page
      }
    } catch (error) {
        setLoading(false);
        console.error("Error updating details:", error);
        alert("An error occurred while updating details. Please try again.");
        router.refresh(); // Reload the current page
    }
  };

  if (!session) {
    return <p className="text-center">You need to be logged in to access this page.</p>;
  }

  return (
    <div>
        <AppBar />
        <div className="flex flex-col items-center mt-8 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">User Details</h1>

                <div className="w-full max-w-md space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                    {loading ? "Updating..." : "Update Details"}
                    </button>
                </div>
                <div className="mt-2">
                  <SignOutButton/>
                </div>
                

            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    </div>
  );
}
