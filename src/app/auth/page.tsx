import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/src/constants/seo.constants";
import AuthPage from "./authPage";

export const metadata: Metadata = {
  title: "Moderator Authorization",
  ...NO_INDEX_PAGE,
};

export default function Page() {
  return <AuthPage />;
}
