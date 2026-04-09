"use client"
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Error changed!");
        if (!error) return;
        const t = setTimeout(() => setError(null), 2000);
        return () => clearTimeout(t);
    }, [error]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        if (!res?.ok) {
            setError("Invalid username or password");
            return
        }
        
        window.location.assign("/");
    }

    return (
        <>
            <div className="modal auth">
                <form onSubmit={onSubmit}>
                    <h1>Welcome back!</h1>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Username..." />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password..." type="password"></input>
                    <button type="submit">Login!</button>
                </form>
            </div>
            <div className={ error ? "warning active" : "warning" }>{error}</div>
        </>
    )
}
