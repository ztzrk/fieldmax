"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function RenterDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Renter Dashboard</h1>
                <Button onClick={logout} variant="outline">
                    Logout
                </Button>
            </div>
            <div className="mt-8">
                <p>
                    Welcome,{" "}
                    <span className="font-semibold">{user?.fullName}</span>!
                </p>
                <p>From here, you can manage your venues and fields.</p>
            </div>
        </div>
    );
}
