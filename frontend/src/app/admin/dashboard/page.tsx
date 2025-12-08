"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <ConfirmationDialog
                    trigger={<Button variant="destructive">Logout</Button>}
                    title="Logout Confirmation"
                    description="You are about to log out. Are you sure you want to proceed?"
                    onConfirm={logout}
                />
            </div>
            <div className="mt-8">
                <p>
                    Welcome,{" "}
                    <span className="font-semibold">
                        {user?.fullName || "Admin"}
                    </span>
                    !
                </p>
            </div>
        </div>
    );
}
