import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import { PublicLayout } from "@/src/app/PublicLayout";
import InstagramConnectPage from "./InstagramConnectPage";

export const metadata: Metadata = {
  title: "Instagram Account Connection",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return (
    <PublicLayout>
      <InstagramConnectPage />
    </PublicLayout>
  );
}
