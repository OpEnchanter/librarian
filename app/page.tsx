export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getBooks, type bookData } from "@/app/lib/database";

export default async function Home() {
    const session = await getServerSession();
    if (!session) redirect("/login");

    const books = await getBooks();
    console.log(books);

  return (
      <>
          <NewBookForm></NewBookForm>
          <div className="navbar">
            <div className="user">U</div>
          </div>
          <div className="spacer"></div>
          <PageContent books={books as bookData[]}></PageContent>
      </>
  );
}

import PageContent from "@/app/components/PageContent";
import NewBookForm from "@/app/components/form/NewBookForm"
