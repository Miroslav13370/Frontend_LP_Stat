import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import { PublicLayout } from "@/src/app/PublicLayout";
import InstagramConnectPage from "./InstagramConnectPage";

export const metadata: Metadata = {
  title: "Instagram Report Access",
  description:
    "Invite-only New People editor access for Instagram report workflows. New People does not collect Instagram passwords.",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return (
    <PublicLayout>
      <InstagramConnectPage />
    </PublicLayout>
  );
}
