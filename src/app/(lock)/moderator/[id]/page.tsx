import ModeratorPage from "../ModeratorPage";

import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";

export const metadata: Metadata = {
  title: "Moderator Management",
  ...NO_INDEX_PAGE,
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminModeratorPage({ params }: PageProps) {
  const { id } = await params;

  return <ModeratorPage mode="admin" moderatorId={id} />;
}
