"use server"
import { Database } from "bun:sqlite";
import { NextResponse } from "next/server";

let db: Database | null = null;

type dbQuery = {
    "COUNT(*)": number,
    "MAX(id)": number
}

type userData = {
    username: string,
    password: string,
    id: number
}

export type bookData = {
    id?: number,
    title: string,
    author: string,
    isbn: string,
    translator: string,
    pubDate: string,
    pageCount: number,
    genre: string,
    format: string,
    originalLanguage: string,
    coverArt: string,
    location: string
}

async function initDB() {
    if (!db) {
        db = new Database("library.sqlite")
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username STRING, 
            password STRING, 
            permission INTEGER
        )`)
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title STRING, 
            author STRING, 
            isbn STRING, 
            translator STRING,
            location STRING, 
            pubDate STRING, 
            pageCount INTEGER, 
            genre STRING, 
            format STRING, 
            originalLanguage STRING, 
            coverArt STRING
        )`);

        const dbColumns = {
            title: "STRING",
            author: "STRING",
            isbn: "STRING",
            translator: "STRING",
            location: "STRING",
            pubDate: "STRING",
            pageCount: "STRING",
            genre: "STRING",
            format: "STRING",
            originalLanguage: "STRING",
            coverArt: "STRING"
        } as Record<string, string>;

        for (const column of Object.keys(dbColumns)) {
            if (!(await hasColumn("books", column))) {
                db.run(`ALTER TABLE books ADD COLUMN ${column} ${dbColumns[column] as string}`.trim());
            }
        }

        console.log("[Library] init");
    }
}

initDB();

export async function hasColumn(table: string, column: string) {
    if (!db) return false;
    const columns = db.query(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    return columns.some(c => c.name === column);
}

export async function getUserCount() {
    if (!db) return 0;
    const numUsers = db.query("SELECT COUNT(*) FROM users").get();
    return (numUsers as dbQuery)["COUNT(*)"];
}

export async function getLargestUserID() {
    if (!db) return;
    const largestUid = db.query("SELECT MAX(id) FROM users").get();
    return (largestUid as dbQuery)["MAX(id)"];
}

export async function addUser(username: string, password: string, permission: number) {
    if (!db) return;
    let maxUid = await getLargestUserID();
    let permissionNumber = permission;
    if (maxUid === null) {
        permissionNumber = 2
        maxUid = 0
    }
    db.run(
        `INSERT INTO users (username, password, permission) VALUES (?, ?, ?)`, 
        [username, await Bun.password.hash(password), permissionNumber]);
}

export async function getUser(username: string) {
    if (!db) return;
    const userData = db.query("SELECT * FROM users WHERE username = ?").get(username);
    return userData;
}

export async function verifyUser(username: string, password: string): Promise<boolean> {
    if (!db) return false;
    const user = db.query(`SELECT * FROM users WHERE username = ?`).get(username) as userData;
    if (user === null) {
        return false;
    }
    const auth = await Bun.password.verify(password, user?.password);
    return auth;
}

export async function getLargestBookID() {
    if (!db) return;
    const largestBookId = db.query("SELECT MAX(id) FROM books").get();
    return (largestBookId as dbQuery)["MAX(id)"];
}

export async function addBook(data: bookData) {
    if (!db) return;
    db.run(
        "INSERT INTO books (title, author, isbn, translator, pubDate, pageCount, genre, format, originalLanguage, coverArt, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [data.title, data.author, data.isbn, data.translator, data.pubDate, data.pageCount, data.genre, data.format, data.originalLanguage, data.coverArt, data.location]
    );
}

export async function getBooks() {
    if (!db) return;
    const books = db.query("SELECT * FROM books").all();
    return books;
}
