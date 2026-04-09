"use server"
import { Database } from "bun:sqlite";
import { NextResponse } from "next/server";

const db = new Database("library.sqlite");
let init = false;

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
    id: number,
    title: string,
    author: string,
    isbn: string,
    translator: string,
    pubDate: string,
    pageCount: number,
    genre: string,
    format: string,
    originalLanguage: string
}

function initDB() {
    if (!init) {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username STRING, password STRING, permission INTEGER)")
        db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title STRING, author STRING, isbn STRING, translator STRING, pubDate STRING, pageCount INTEGER, genre STRING, format STRING, originalLanguage STRING)")
        console.log("[Library] init");
        init = true;
    }
}

initDB();

export async function getUserCount() {
    const numUsers = db.query("SELECT COUNT(*) FROM users").get();
    return (numUsers as dbQuery)["COUNT(*)"];
}

export async function getLargestUserID() {
    const largestUid = db.query("SELECT MAX(id) FROM users").get();
    return (largestUid as dbQuery)["MAX(id)"];
}

export async function addUser(username: string, password: string, permission: number) {
    let maxUid = await getLargestUserID();
    let permissionNumber = permission;
    if (maxUid === null) {
        permissionNumber = 2
        maxUid = 0
    }
    db.run(
        `INSERT INTO users (id, username, password, permission) VALUES (?, ?, ?, ?)`, 
        [maxUid+1, username, await Bun.password.hash(password), permissionNumber]);
}

export async function getUser(username: string) {
    const userData = db.query("SELECT * FROM users WHERE username = ?").get(username);
    return userData;
}

export async function verifyUser(username: string, password: string): Promise<boolean> {
    const user = db.query(`SELECT * FROM users WHERE username = ?`).get(username) as userData;
    if (user === null) {
        return false;
    }
    const auth = await Bun.password.verify(password, user?.password);
    return auth;
}

export async function getLargestBookID() {
    const largestBookId = db.query("SELECT MAX(id) FROM books").get();
    return (largestBookId as dbQuery)["MAX(id)"];
}

export async function addBook(data: bookData) {
    let id = await getLargestBookID();
    if (id === null) id = -1;
    id++;

    db.run(
        "INSERT INTO books (id, title, author, isbn, translator, pubDate, pageCount, genre, format, originalLanguage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [id, data.title, data.author, data.isbn, data.translator, data.pubDate, data.pageCount, data.genre, data.format, data.originalLanguage]
    );
}

export async function getBooks() {
    const books = db.query("SELECT * FROM books").all();
    return books;
}
