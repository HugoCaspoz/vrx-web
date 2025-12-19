import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.username === "admin" && credentials?.password === "vrx2025") {
                    return { id: "1", name: "Admin User", email: "admin@vrx.com" };
                }
                return null;
            },
        }),
    ],
})
