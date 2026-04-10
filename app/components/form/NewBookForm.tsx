"use client"
import { useState, useEffect, useRef } from "react";
import { addBook, type bookData } from "@/app/lib/database";
import { isbnSearch } from "@/app/actions";

import Icon from '@mdi/react';
import { mdiCamera, mdiPlus } from '@mdi/js';

import { BarcodeDetector } from "barcode-detector/ponyfill";

import { useRouter } from "next/navigation";

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
    const [coverArt, setCoverArt] = useState<string | null>(null);

    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const openAddBookModal = () => setIsAddBookOpen(true);
    const closeAddBookModal = () => setIsAddBookOpen(false);

    const [isSelectAdditionMethodOpen, setIsSelectAdditionMethodOpen] = useState(false);
    const openSelectAdditionMethodModal = () => setIsSelectAdditionMethodOpen(true);
    const closeSelectAdditionMethodModal = () => setIsSelectAdditionMethodOpen(false);

    const [isManualISBNOpen, setIsManualISBNOpen] = useState(false);
    const openManualISBNModal = () => setIsManualISBNOpen(true);
    const closeManualISBNModal = () => setIsManualISBNOpen(false);

    const [isBarcodeSearchOpen, setIsBarcodeSearchOpen] = useState(false);
    const openBarcodeSearch = () => setIsBarcodeSearchOpen(true);
    const closeBarcodeSearch = () => setIsBarcodeSearchOpen(false);

    const [isLoadingOpen, setIsLoadingOpen] = useState(false);
    const openLoading = () => setIsLoadingOpen(true);
    const closeLoading = () => setIsLoadingOpen(false);

    const [isbnQuery, setIsbnQuery] = useState("");

    const router = useRouter();

    async function addBookSubmit(e: React.FormEvent) {
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
            originalLanguage: originalLanguage,
            coverArt: coverArt,
            location: bookLocation
        } as bookData

        await addBook(data);

        console.log("Added a book!");

        closeAddBookModal();

        router.refresh();
    }

    async function isbnSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        closeManualISBNModal();
        openLoading();
        const res = await isbnSearch(isbnQuery);
        setTitle(res.title);
        setAuthor(res.author);
        setIsbn(isbnQuery);
        setPageCount(res.pages);
        setPubDate(res.publishDate);
        setCoverArt(res.coverArt);
        console.log(res);
        closeLoading();
        openAddBookModal();
    }

    async function barcodeSearchSubmit(isbn: string) {
        closeBarcodeSearch();
        openLoading();

        const res = await isbnSearch(isbn);
        setTitle(res.title);
        setAuthor(res.author);
        setIsbn(isbnQuery);
        setPageCount(res.pages);
        setPubDate(res.publishDate);
        setCoverArt(res.coverArt);
        setIsbn(isbn);

        closeLoading();
        openAddBookModal();
    }

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isBarcodeSearchOpen) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => {t.stop()});
            }
            
            const video = videoRef.current;
            if (video) {
                video.srcObject = null;
            }
            
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return
        };

        // Initialize barcode detector
        console.log("Initializing barcode detector!");
        const barcodeDetector = new BarcodeDetector({
            formats: ["ean_13"]
        })
        
        const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        intervalRef.current = setInterval(async () => {
            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length) {
                console.log(barcodes[0].rawValue);
                barcodeSearchSubmit(barcodes[0].rawValue);
            }
            console.log("scanning...");
        }, 100);
        
        // Draw camera frames to canvas
        let animationFrameId: number;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: { ideal: "environment" } }, 
                    audio: false 
                })
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (err) {
                console.error("Camera access denied:", err);
            }
        };

        const renderFrame = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            animationFrameId = requestAnimationFrame(renderFrame);
        };

        startCamera();
        renderFrame();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isBarcodeSearchOpen]);

    
    return (
        <>
            <button className="add" onClick={() => openSelectAdditionMethodModal()}>
                <Icon path={mdiPlus} size={1.5} />
            </button>
            <button className="add camera" onClick={() => openBarcodeSearch()}>
                <Icon path={mdiCamera} size={1} />
            </button>
            {isLoadingOpen && (
                <>
                    <div className="backdrop"></div>
                    <div className="modal settings">
                        <h2>Loading...</h2>
                    </div>
                </>
            )}
            {isBarcodeSearchOpen && (
                <>
                    <div className="backdrop" onClick={() => {closeBarcodeSearch()}}></div>
                    <div className="modal settings">
                        <h2>Barcode Search</h2>
                        <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
                        <canvas
                            ref={canvasRef}
                            width={640}
                            height={480}
                        ></canvas>
                    </div>
                </>
            )}
            {isSelectAdditionMethodOpen && (
                <>
                    <div className="backdrop" onClick={() => {closeSelectAdditionMethodModal()}}></div>
                    <div className="modal settings">
                        <h2>Book Addition Method</h2>
                        <button onClick={() => {closeSelectAdditionMethodModal(); openAddBookModal()}}>Manual Info Entry</button>
                        <button onClick={() => {closeSelectAdditionMethodModal(); openManualISBNModal()}}>Manual ISBN Search</button>
                        <button onClick={() => {closeSelectAdditionMethodModal(); openBarcodeSearch()}}>ISBN Barcode Search</button>
                    </div>
                </>
            )}
            {isManualISBNOpen && (
                <>
                    <div className="backdrop" onClick={() => {closeManualISBNModal()}}></div>
                    <div className="modal settings">
                        <h2>Manual ISBN Search</h2>
                        <form onSubmit={isbnSearchSubmit}>
                            <p>ISBN</p>
                            <input value={isbnQuery} onChange={(e) => {setIsbnQuery(e.target.value)}} type="text" id="isbnQuery" name="isbnQuery" placeholder="ISBN" />
                            <button type="submit" className="spaced">Search</button>
                        </form>
                    </div>
                </>
            )}
            {isAddBookOpen && (
                <>
                    <div className="backdrop" onClick={() => closeAddBookModal()}></div>
                    <div className="modal settings">
                        <h2>Add Book</h2>
                        <form onSubmit={addBookSubmit}>
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
                            <button type="submit" className="spaced">Add Book</button>
                        </form>
                    </div>
                </>
            )}

        </>
    )
}
