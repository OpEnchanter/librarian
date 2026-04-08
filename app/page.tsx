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
            {["a", "b", "c", "c", "c", "c", "C"].map((x) => (
                  <div className="book-card" key={x}>{x}</div>
            ))}
          </div>
      </>
  );
}
