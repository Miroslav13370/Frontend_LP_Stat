import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Главная страница",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <HomePage />;
}
