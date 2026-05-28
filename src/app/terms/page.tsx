import type { Metadata } from "next";

import Terms from "./Terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for New People, including authorized use, TikTok Login Kit, YouTube API, Instagram report workflows, moderator responsibilities, and prohibited activities.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  return <Terms />;
}
