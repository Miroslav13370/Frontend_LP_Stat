"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import {
  useGetTikTokUserByIdQuery,
  useGetTikTokUserStatisticsQuery,
} from "@/src/api/tikTok/user.api";

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

export default function TikTokAccountPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: account, isLoading: isAccountLoading } =
    useGetTikTokUserByIdQuery(id);

  const { data: statistics, isLoading: isStatisticsLoading } =
    useGetTikTokUserStatisticsQuery({
      id,
      startDate: getCurrentMonthStart(),
      endDate: getCurrentMonthEnd(),
    });

  const isLoading = isAccountLoading || isStatisticsLoading;

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
            Загружаем TikTok аккаунт...
          </p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Аккаунт не найден
      </div>
    );
  }

  const bestVideo = statistics?.bestVideo;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm text-pink-400">TikTok аккаунт</p>
          <h1 className="mt-1 text-3xl font-bold">
            Аккаунт успешно авторизован
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Ниже данные аккаунта, статистика и ключ для передачи модератору.
          </p>
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
                {account.tiktok_display_name ?? "Без имени"}
              </h2>
              <p className="mt-1 text-pink-300">
                @{account.tiktok_username ?? "unknown"}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-zinc-400">Общие просмотры за месяц</p>
              <p className="mt-2 text-3xl font-bold">
                {formatNumber(statistics?.totalViews)}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">OpenId ключ</p>

              <div className="mt-3 flex flex-col gap-3 md:flex-row">
                <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                  <p className="truncate">{account.tiktok_open_id}</p>
                </div>

                <button
                  type="button"
                  onClick={copyOpenId}
                  className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium transition hover:bg-pink-600"
                >
                  Скопировать
                </button>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Этот ключ можно передать модератору, чтобы он добавил аккаунт в
                свой список.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
              <h2 className="text-xl font-bold">Лучшее видео за месяц</h2>

              {bestVideo ? (
                <div className="mt-5 grid gap-5 md:grid-cols-[160px_1fr]">
                  <div className="relative h-56 overflow-hidden rounded-2xl bg-white/5">
                    <Image
                      src={bestVideo.cover_image_url}
                      alt={bestVideo.title || "Лучшее видео"}
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {bestVideo.title || "Без названия"}
                    </h3>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-400">
                      {bestVideo.video_description || "Описание отсутствует"}
                    </p>

                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <p className="text-sm text-emerald-300">Просмотры</p>
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
                      Открыть видео
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-400">
                  За текущий месяц видео не найдено.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
