import Image from "next/image";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
    const session = await getServerSession();
    if (!session) redirect("/login");

  return (
      <h1>Hello world!</h1>
  );
}
