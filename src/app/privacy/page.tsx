import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import Privacy from "./Privacy";

export const metadata: Metadata = {
  title: "Privacy Page",
  ...NO_INDEX_PAGE,
};

export default function PrivacyPage() {
  return <Privacy />;
}
