"use client"
import { useState } from "react";
import { addBook, type bookData } from "@/app/lib/database";

export default function NewBook() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [translator, setTranslator] = useState("");
    const [pubDate, setPubDate] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [bookLocation, setLocation] = useState("");
    const [genre, setGenre] = useState("");
    const [format, setFormat] = useState("");
    const [originalLanguage, setOriginalLanguage] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const data: bookData = {
            title: title,
            author: author,
            isbn: isbn,
            translator: translator,
            pubDate: pubDate,
            pageCount: pageCount,
            genre: genre,
            format: format,
            originalLanguage: originalLanguage
        } as bookData

        await addBook(data);

        console.log("Added a book!");

        closeModal();
    }

    return (
        <>
            <button className="add" onClick={() => openModal()}>+</button>
            {isOpen && (
                <>
                    <div className="backdrop" onClick={() => closeModal()}></div>
                    <div className="modal settings">
                        <h2>Add Book</h2>
                        <form onSubmit={onSubmit}>
                            <div className="scrollable">
                                <h3>General Info</h3>
                                <p>ISBN</p>
                                <input value={isbn} onChange={(e) => setIsbn(e.target.value)} type="text" id="isbn" name="isbn" placeholder="ISBN"/>
                                <p>Title</p>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="title" name="title" placeholder="Title"/>
                                <p>Author</p>
                                <input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" id="author" name="author" placeholder="Author"/>
                                <p>Translator / editor</p>
                                <input value={translator} onChange={(e) => setTranslator(e.target.value)} type="text" id="translator" name="translator" placeholder="Translator / editor"/>
                                <p>Publication Date</p>
                                <input value={pubDate} onChange={(e) => setPubDate(e.target.value)} type="date" id="pubDate" name="pubDate" placeholder="Publication Date"/>
                                <p>Pages</p>
                                <input value={pageCount} onChange={(e) => setPageCount(e.target.value)} type="number" id="pageCount" name="pageCount" placeholder="Page Count"/>
                                <h3>Logistics</h3>
                                <p>Location (shelf, room, Audible, Kindle, etc.)</p>
                                <input value={bookLocation} onChange={(e) => setLocation(e.target.value)} type="text" id="bookLocation" name="bookLocation" placeholder="Location (shelf, room, etc.)"/>
                                <h3>About</h3>
                                <p>Genre</p>
                                <input value={genre} onChange={(e) => setGenre(e.target.value)} type="text" id="pubDate" name="pubDate" placeholder="Genre"/>
                                <p>Format</p>
                                <select value={format} onChange={(e) => setFormat(e.target.value)} id="format" name="format">
                                    <option>Hardcover</option>
                                    <option>Paperback</option>
                                    <option>E-Book</option>
                                    <option>Audiobook</option>
                                </select>
                                <p>Original Language</p>
                                <input value={originalLanguage} onChange={(e) => setOriginalLanguage(e.target.value)} type="text" id="originalLanguage" name="originalLanguage" placeholder="Original Language"/>
                            </div>
                            <button type="submit">Add Book</button>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}
