import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import AdminPage from "./AdminPage";

export const metadata: Metadata = {
  title: "Страница администратора",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <AdminPage />;
}
