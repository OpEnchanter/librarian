"use client";
import { onboardUser } from "@/app/onboarding/actions";
import { useState, useEffect } from "react";

export default function OnboardingForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (username === "" || password === "") {
            setError("Invalid username or password!");
            return;
        }
        console.log("[Onboarding] Creating user!");
        const res = await onboardUser(username, password);
        console.log(res);
        if (res) {
            window.location.href = "/login";
        }
    }

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Error changed!");
        if (!error) return;
        const t = setTimeout(() => setError(null), 2000);
        return () => clearTimeout(t);
    }, [error]);

    return (
        <>
            <div className="modal auth">
                <form onSubmit={onSubmit}>
                    <h1>Welcome!</h1>
                    <p>It looks like you've just set up the app, create a user below to get started!</p>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Username..." />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password..." type="password" />
                    <button type="submit">Lets go!</button>
                </form>
            </div>
            <div className={ error ? "warning active" : "warning" }>{error}</div>
        </>
    )
}
