// library imports
// types imports
import type {NextAuthConfig, Session, User} from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type {UserType} from "@/types/user";
import {AdapterUser} from "next-auth/adapters";
import {JWT} from "next-auth/jwt";

const URL = process.env.NEXT_PUBLIC_BASE_URL

declare module "next-auth" {
    interface User extends UserType {}
}

declare module "next-auth/adapters" {
    interface AdapterUser extends UserType {}
}

declare module "next-auth/jwt" {
    interface JWT extends UserType {}
}

const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            authorize: async (credentials) => {
                try {
                    const response = await fetch(`${URL}/auth/signin`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ email: credentials.email, password: credentials.password })
                    })

                    if (!response.ok) {
                        throw new Error("An error occured while fetching")
                    }

                    const data = await response.json()
                    return data
                } catch (error) {
                    console.error("Error during authentication", error);
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            // Add the user properties to the token after signing in
            if (user) {
                token.email = user.email;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            // Create a user object with token properties
            // Add the user object to the session
            session.user = {
                accessToken: token.accessToken,
                email: token.email ? token.email : "", // Ensure email is not undefined
            };

            return session;
        },
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);