import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import InstagramReportsPage from "./InstagramReportsPage";

export const metadata: Metadata = {
  title: "Instagram Reports",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <InstagramReportsPage />;
}
