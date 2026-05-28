import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import Terms from "./Terms";

export const metadata: Metadata = {
  title: "Terms",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <Terms />;
}
