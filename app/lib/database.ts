"use server"
import { Database } from "bun:sqlite";
import { NextResponse } from "next/server";

const db = new Database("library.sqlite");

type dbQuery = {
    "COUNT(*)": number,
    "MAX(id)": number
}

type userData = {
    username: string,
    password: string,
    id: number
}

function initDB() {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username STRING, password STRING, permission INTEGER)")
    db.run("CREATE TABLE IF NOT EXISTS books (isbn INTEGER PRIMARY KEY, name STRING, publication_date STRING, cover_art STRING, current_page INTEGER, finished BOOLEAN, value FLOAT)")
    console.log("[Library] init", {
        pid: process.pid,
        cwd: process.cwd(),
        time: new Date().toISOString(),
  });
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

export async function GET() {
    return NextResponse.json({ status: "DB Loaded" });
}