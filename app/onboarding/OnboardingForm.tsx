"use client";
import { onboardUser } from "./actions";
import { useState } from "react";

export default function OnboardingForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("[Onboarding] Creating user!");
        const res = await onboardUser(username, password);
        console.log(res);
        if (res) {
            window.location.href = "/login";
        }
    }

    return (
        <div className="modal auth">
            <form onSubmit={onSubmit}>
                <h1>Welcome!</h1>
                <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Username..." />
                <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password..." type="password" />
                <button type="submit">Sign up!</button>
            </form>
        </div>
    )
}