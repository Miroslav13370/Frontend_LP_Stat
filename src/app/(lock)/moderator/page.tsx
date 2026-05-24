import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import ModeratorPage from "./ModeratorPage";

export const metadata: Metadata = {
  title: "Страница модератора",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <ModeratorPage mode="self" />;
}
