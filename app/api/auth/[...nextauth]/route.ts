import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


async function verifyUser(username: string, password: string) {
    if (username === "user" && password === "abcd") {
        return { id: "1", username, name: "Testing User" }
    }
    return null;
}

process.env.NEXTAUTH_URL ||= "http://localhost:3000";
process.env.NEXTAUTH_SECRET ||= "09ade16d9e0c4ba17bd049be5a5bc6c3aeb700f592df114c8ffa5c353ba36de2";

const handler = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const username = credentials?.username;
                const password = credentials?.password;

                if (!username || !password) return null;

                const user = verifyUser(username, password);
                return user;
            }
        })
    ],
    session: { strategy: "jwt" }
});

export { handler as GET, handler as POST }
