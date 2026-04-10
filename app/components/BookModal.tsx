"use client"

import { useState } from "react"
import { bookData } from "@/app/lib/database";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";

export function BookModal(
    { book, modalOpen, setModalOpen }: 
    { 
        book: bookData, 
        modalOpen: boolean, 
        setModalOpen: (modalOpen: boolean) => void
    }) {

    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [isbn, setIsbn] = useState(book.isbn);
    const [translator, setTranslator] = useState(book.translator);
    const [pubDate, setPubDate] = useState(book.pubDate);
    const [pageCount, setPageCount] = useState(book.pageCount);
    const [bookLocation, setLocation] = useState(book.location);
    const [genre, setGenre] = useState(book.genre);
    const [format, setFormat] = useState(book.format);
    const [originalLanguage, setOriginalLanguage] = useState(book.originalLanguage);
    const [coverArt, setCoverArt] = useState<string | null>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setModalOpen(false);
    }

    return (
        <>
            {modalOpen && (
                <>
                    <div className="backdrop" onClick={() => {setModalOpen(false)}}></div>
                    <div className="modal settings">
                        <h2>{book.title}</h2>
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
                                <input value={pageCount} onChange={(e) => setPageCount(parseInt(e.target.value))} type="number" id="pageCount" name="pageCount" placeholder="Page Count"/>
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
                            <div className="horizontal">
                                <button type="submit" className="spaced">Save</button>
                                <button className="delete"><Icon path={mdiDelete} size="16px"></Icon></button>
                            </div>
                            
                        </form>
                    </div>
                </>
            )}
        </>
    )
}