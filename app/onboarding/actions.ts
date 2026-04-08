"use server"
import { addUser } from "@/app/lib/database";

export async function onboardUser(username: string, password: string) {
    await console.log("[Library] New user added!")
    if (username !== null && password !== null) {
        addUser(username.toString(), password.toString(), 1);
        return true;
    }
    return false;
}