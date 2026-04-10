"use client"

import { useState, type ReactNode } from "react";
import { bookData } from "@/app/lib/database";

import { BookModal } from "./BookModal";

export default function BookCard({ book, children }: { book: bookData, children: React.ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {setModalOpen(true)};
    const closeModal = () => {setModalOpen(false)};
    return (
        <>
            <div className="book-card" style={{ backgroundImage: `url(${book.coverArt})` }} onClick={() => {openModal()}}>
                {book.coverArt ? "" : book.title}
            </div>

            <BookModal book={book} modalOpen={modalOpen} setModalOpen={(modalOpen: boolean) => {setModalOpen(modalOpen)}} />
        </>
    )
}
