"use client"

import type { ReactNode } from "react";

export default function BookCard({ bookIsbn, bookName, coverArtUrl, children }: { bookIsbn: string, bookName: string, coverArtUrl: string , children: React.ReactNode }) {
    console.log(coverArtUrl);
    return (
        <div className="book-card" style={{ backgroundImage: `url(${coverArtUrl})` }}>{coverArtUrl ? "" : bookName}</div>
    )
}
