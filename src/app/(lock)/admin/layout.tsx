import { ReactNode } from "react";
import { cookies } from "next/headers";
import { Moderator } from "@/src/api/moderator/moderator.apiType";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};
const LayoutLockPage = async ({ children }: Props) => {
  const cookieStore = await cookies();

  const response = await fetch(`${process.env.SERVER_URL}/api/moderator`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const moderator = (await response.json()) as Moderator;

  if (!moderator.isAdmin) redirect("/");

  return <div>{children}</div>;
};

export default LayoutLockPage;
