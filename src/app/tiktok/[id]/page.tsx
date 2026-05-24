import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import TikTokAccountPage from "./tikTokpage";

export const metadata: Metadata = {
  title: "Страница аккаунта",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <TikTokAccountPage />;
}
