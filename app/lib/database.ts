"use server"
import { Database } from "bun:sqlite";
import { NextResponse } from "next/server";
import { SQL } from "bun";

let config = await Bun.file("config.json").json();
if (!config.database) {
    config.database = {
        user: "librarian",
        password: "undefined",
        name: "librarian"
    }
}
let sql = new SQL(`postgres://${config.database.user}:${config.database.password}@localhost:5432/${config.database.name}`);

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

const dbColumns = {
    title: "TEXT",
    author: "TEXT",
    isbn: "TEXT",
    translator: "TEXT",
    location: "TEXT",
    pubDate: "TEXT",
    pageCount: "TEXT",
    genre: "TEXT",
    format: "TEXT",
    originalLanguage: "TEXT",
    coverArt: "TEXT"
} as Record<string, string>;

async function initDB() {
    await sql`CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
        username TEXT, 
        password TEXT, 
        permission INTEGER
    )`
    await sql`CREATE TABLE IF NOT EXISTS books (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
        title TEXT, 
        author TEXT, 
        isbn TEXT, 
        translator TEXT,
        location TEXT, 
        pubDate TEXT, 
        pageCount INTEGER, 
        genre TEXT, 
        format TEXT, 
        originalLanguage TEXT, 
        coverArt TEXT
    )`;

    for (const column of Object.keys(dbColumns)) {
        if (!(await hasColumn("books", column))) {
            const columnName = sql(column);
            const columnType = sql.unsafe(dbColumns[column] as string);
            await sql`ALTER TABLE books ADD COLUMN ${columnName} ${columnType}`;
        }
    }

    console.log("[Library] init");
}

initDB();

export async function hasColumn(table: string, column: string) {
    const [row] = await sql`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
                AND table_name = ${table}
                AND column_name = ${column}
        ) AS exists
    ` as Array<{ exists: boolean }>
    return row.exists;
}

export async function getUserCount() {
    const res = await sql`SELECT COUNT(*) AS total FROM users`;
    return Number(res[0].total);
}

export async function getLargestUserID() {
    
    const res = await sql`SELECT MAX(id) AS id FROM users`;
    return Number(res[0].id);
}

export async function addUser(username: string, password: string, permission: number) {
    
    let maxUid = await getLargestUserID();
    let permissionNumber = permission;
    if (maxUid === null) {
        permissionNumber = 2
        maxUid = 0
    }
    await sql`INSERT INTO users (username, password, permission) VALUES (${username}, ${await Bun.password.hash(password)}, ${permissionNumber})`;
}

export async function getUser(username: string) {
    const [userData] = await sql`SELECT * FROM users WHERE username = ${username}`;
    return userData;
}

export async function verifyUser(username: string, password: string): Promise<boolean> {
    const [user] = await sql`SELECT * FROM users WHERE username = ${username}` as Array<userData>;
    if (user === null) {
        return false;
    }
    const auth = await Bun.password.verify(password, user?.password);
    return auth;
}

export async function deleteBook(id: number): Promise<boolean> {
    await sql`DELETE FROM books WHERE id = ${id}`
    return true;
}

export async function updateBook(bookId: number, updatedData: Partial<bookData>): Promise<boolean> {
    const values = Object.values(updatedData);
    await sql`UPDATE books SET ${sql(updatedData)} WHERE id = ${bookId}`;
    return true;
}
export async function getLargestBookID() {
    
    const largestBookId = await sql`SELECT MAX(id) FROM books`;
    return (largestBookId as dbQuery)["MAX(id)"];
}

export async function addBook(data: bookData) {
    await sql`INSERT INTO books (title, author, isbn, translator, pubDate, pageCount, genre, format, originalLanguage, coverArt, location) VALUES (${data.title}, ${data.author}, ${data.isbn}, ${data.translator}, ${data.pubDate}, ${data.pageCount}, ${data.genre}, ${data.format}, ${data.originalLanguage}, ${data.coverArt}, ${data.location})`;
}

export async function getBooks() {
    const books = sql`SELECT * FROM books`;
    return books;
}
