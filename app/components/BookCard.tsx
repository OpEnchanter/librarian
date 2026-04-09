"use client"

import type { ReactNode } from "react";

export default function BookCard({ bookIsbn, bookName, children }: { bookIsbn: string, bookName: string, children: React.ReactNode }) {
    return (
        <div className="book-card" style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/${bookIsbn}-M.jpg)` }}></div>
    )
}
