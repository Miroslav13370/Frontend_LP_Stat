"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetTikTokUserByIdQuery,
  useGetTikTokUserStatisticsQuery,
} from "@/src/api/tikTok/user.api";

type PeriodType = "week" | "month" | "custom";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("ru-RU");

const getDateValue = (date: Date) => date.toISOString().split("T")[0];

const getCurrentMonthStart = () => {
  const now = new Date();
  return getDateValue(new Date(now.getFullYear(), now.getMonth(), 1));
};

const getCurrentMonthEnd = () => {
  const now = new Date();
  return getDateValue(new Date(now.getFullYear(), now.getMonth() + 1, 1));
};

const getLastWeekStart = () => {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 7);

  return getDateValue(start);
};

const getToday = () => getDateValue(new Date());

export default function TikTokAccountPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [customStartDate, setCustomStartDate] = useState(
    getCurrentMonthStart(),
  );
  const [customEndDate, setCustomEndDate] = useState(getToday());

  const period = useMemo(() => {
    if (periodType === "week") {
      return {
        startDate: getLastWeekStart(),
        endDate: getToday(),
      };
    }

    if (periodType === "month") {
      return {
        startDate: getCurrentMonthStart(),
        endDate: getCurrentMonthEnd(),
      };
    }

    return {
      startDate: customStartDate,
      endDate: customEndDate,
    };
  }, [periodType, customStartDate, customEndDate]);

  const { data: account, isLoading: isAccountLoading } =
    useGetTikTokUserByIdQuery(id);

  const { data: statistics, isLoading: isStatisticsLoading } =
    useGetTikTokUserStatisticsQuery({
      id,
      startDate: period.startDate,
      endDate: period.endDate,
    });

  const isLoading = isAccountLoading || isStatisticsLoading;

  const statsAccount = statistics?.account;
  const videos = statistics?.videos ?? [];

  const totalViews = statsAccount?.viewsCount ?? 0;
  const totalLikes = statsAccount?.likesCount ?? 0;
  const videosCount = statsAccount?.videosCount ?? 0;
  const bestVideo = statsAccount?.bestVideo ?? videos[0] ?? null;

  const copyOpenId = async () => {
    if (!account?.tiktok_open_id) return;

    await navigator.clipboard.writeText(account.tiktok_open_id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-pink-500" />

          <p className="mt-4 text-sm text-zinc-400">
            Loading TikTok account...
          </p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Account not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm text-pink-400">TikTok account</p>

          <h1 className="mt-1 text-3xl font-bold">
            TikTok account connected successfully
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Account profile, statistics, and OpenId key are shown below.
          </p>

          <a
            href={`${serverUrl}/api/auth/tiktok`}
            className="mt-5 inline-flex rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium transition hover:bg-pink-600"
          >
            Connect another TikTok account
          </a>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-zinc-400">Statistics period</p>

              <p className="mt-1 text-lg font-semibold">
                {period.startDate} — {period.endDate}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPeriodType("week")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  periodType === "week"
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-zinc-300 hover:bg-white/15"
                }`}
              >
                Week
              </button>

              <button
                type="button"
                onClick={() => setPeriodType("month")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  periodType === "month"
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-zinc-300 hover:bg-white/15"
                }`}
              >
                Month
              </button>

              <button
                type="button"
                onClick={() => setPeriodType("custom")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  periodType === "custom"
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-zinc-300 hover:bg-white/15"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {periodType === "custom" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(event) => setCustomStartDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              />

              <input
                type="date"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-pink-500/30">
              <Image
                src={
                  account.tiktok_avatar_url || "https://placehold.co/300x300"
                }
                alt={account.tiktok_display_name || "TikTok avatar"}
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold">
                {account.tiktok_display_name ?? "No name"}
              </h2>

              <p className="mt-1 text-pink-300">
                @{account.tiktok_username ?? "unknown"}
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-zinc-400">Views</p>

                <p className="mt-2 text-3xl font-bold">
                  {formatNumber(totalViews)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-zinc-400">Likes</p>

                <p className="mt-2 text-3xl font-bold">
                  {formatNumber(totalLikes)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-zinc-400">Videos</p>

                <p className="mt-2 text-3xl font-bold">
                  {formatNumber(videosCount)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">OpenId key</p>

              <div className="mt-3 flex flex-col gap-3 md:flex-row">
                <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                  <p className="truncate">{account.tiktok_open_id}</p>
                </div>

                <button
                  type="button"
                  onClick={copyOpenId}
                  className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium transition hover:bg-pink-600"
                >
                  Copy
                </button>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                This key can be passed to a moderator to attach the account.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
              <h2 className="text-xl font-bold">
                Best video for selected period
              </h2>

              {bestVideo ? (
                <div className="mt-5 grid gap-5 md:grid-cols-[160px_1fr]">
                  <div className="relative h-56 overflow-hidden rounded-2xl bg-white/5">
                    <Image
                      src={bestVideo.cover_image_url}
                      alt={bestVideo.title || "Best video"}
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {bestVideo.title || "Untitled"}
                    </h3>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-400">
                      {bestVideo.video_description || "No description"}
                    </p>

                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <p className="text-sm text-emerald-300">Views</p>

                      <p className="mt-1 text-3xl font-bold text-emerald-300">
                        {formatNumber(bestVideo.view_count)}
                      </p>
                    </div>

                    <a
                      href={bestVideo.share_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      Open video
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-400">
                  No videos found for the selected period.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
