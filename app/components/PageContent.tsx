"use client"
import { type bookData } from "@/app/lib/database";

export default function PageContent({ books }: { books: bookData[] }) {
    console.log("Books: " + books);
    if (books === undefined) books = [];
    return (
        <div className="content">
            {books.map((b: bookData) => (
                <BookCard bookIsbn={b.isbn} bookName={b.title} key={b.id}>{b.title}</BookCard>
            ))}
        </div>
    )
}
import BookCard from "@/app/components/BookCard";
