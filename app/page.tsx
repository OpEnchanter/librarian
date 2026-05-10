export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import HomeContents from "@/app/components/HomeContents";
import { bookData, getBooks } from "./lib/database";

export default async function Home() {
    const session = await getServerSession();
    if (!session) redirect("/login");
    
    const books: bookData[] = await getBooks();

  return (
      <HomeContents books={books}></HomeContents>
  );
}