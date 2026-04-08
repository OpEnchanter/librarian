export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
    const session = await getServerSession();
    if (!session) redirect("/login");

  return (
      <>
          <div className="navbar">
            <div className="user">U</div>
          </div>
          <div className="spacer"></div>
          <div className="content">
            {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((x) => (
                  <BookCard key={x}>{x}</BookCard>
            ))}
          </div>
      </>
  );
}

import BookCard from "./BookCard";