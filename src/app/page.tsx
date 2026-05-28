import type { Metadata } from "next";

import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "New People",
  },
  description:
    "New People is a social account analytics and moderator operations platform for authorized TikTok, YouTube, and Instagram report workflows.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
