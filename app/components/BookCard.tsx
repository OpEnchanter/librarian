"use client"

import type { ReactNode } from "react";

export default function BookCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="book-card">{children}</div>
    )
}