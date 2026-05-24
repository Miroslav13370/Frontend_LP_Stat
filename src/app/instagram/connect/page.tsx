import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import InstagramConnectPage from "./InstagramConnectPage";

export const metadata: Metadata = {
  title: "Добавление аккаунта",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <InstagramConnectPage />;
}
