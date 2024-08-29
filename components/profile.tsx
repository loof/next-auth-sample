"use client";

// library imports
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Profile() {
    const router = useRouter();
    const pathname = usePathname();

    const { data: session } = useSession();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        if (session?.user?.accessToken) {
            console.log(session)
            // fetch user profile if access token is available
            getUserProfile(session.user.accessToken);
        } else {
            // Redirect to `/login` if no access token or no session
            router.push("/auth/login?next=" + pathname);
        }
    }, []);

    const getUserProfile = (token: string) => {
        setLoadingProfile(true);
        console.log(token)
    };

    return (
        <>
            {" "}
            {loadingProfile ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p>User Profile</p>
                    <p>Name: {session?.user?.name}</p>
                    <p>Email: {session?.user?.email}</p>
                </div>
            )}
        </>
    );
}