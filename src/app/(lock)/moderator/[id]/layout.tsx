// app/moderator/[id]/layout.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Profile = {
  id: string;
  login: string;
  isAdmin: boolean;
};

async function getServerProfile() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.SERVER_URL}/api/moderator`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<Profile>;
}

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AdminModeratorLayout({ children }: LayoutProps) {
  const profile = await getServerProfile();

  if (!profile?.isAdmin) {
    redirect("/");
  }

  return children;
}
