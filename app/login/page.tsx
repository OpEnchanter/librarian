
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUserCount } from "@/app/lib/database";

export default async function Login() {

    const session = await getServerSession();
    if (session) redirect("/");

    const numUsers = await getUserCount();
    if (numUsers === 0) redirect("/onboarding");

    return <LoginForm />;
}

import LoginForm from "@/app/components/form/LoginForm";
