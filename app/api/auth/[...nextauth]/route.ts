import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyUser, getUser } from "@/app/lib/database";

type userData = {
    username: string,
    password: string,
    id: number
}

async function verify(username: string, password: string) {
    if (await verifyUser(username, password)) {
        const user = await getUser(username) as userData;
        return { id: user.id.toString(), username }
    }
    return null;
}

process.env.NEXTAUTH_URL ||= "https://yersinia-pestis.tailce381.ts.net/";
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

                const user = verify(username, password);
                return user;
            }
        })
    ],
    session: { strategy: "jwt" }
});

export { handler as GET, handler as POST }
