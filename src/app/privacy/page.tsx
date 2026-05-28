import type { Metadata } from "next";

import Privacy from "./Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for New People, including TikTok OAuth, YouTube OAuth, Instagram report workflows, analytics processing, cookies, retention, revocation, and data deletion.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
