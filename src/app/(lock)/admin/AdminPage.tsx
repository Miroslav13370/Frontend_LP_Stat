"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  useGetAdminModeratorsStatisticsQuery,
  useGetAdminTikTokUsersStatisticsQuery,
} from "@/src/api/statistics/statistics.api";

import type {
  GetAdminStatisticsParams,
  ModeratorStatisticsAccount,
  PlatformType,
} from "@/src/api/statistics/statistics.type.api";

import { useDeleteModeratorMutation } from "@/src/api/moderator/moderator.api";

import {
  useDeleteTikTokUserMutation,
  useUpdateTikTokUserModeratorMutation,
} from "@/src/api/tikTok/user.api";

import {
  useDeleteYouTubeUserMutation,
  useUpdateYouTubeUserModeratorMutation,
} from "@/src/api/youtube/youtubeUser.api";

type PeriodType = "day" | "month" | "all" | "custom";

type ConfirmAction = null | {
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<void>;
};

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

const defaultAvatar = serverUrl
  ? `${serverUrl}/uploads/no-user-image.jpg`
  : "/uploads/no-user-image.jpg";

const formatViews = (views: number) => views.toLocaleString("ru-RU");

const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

const getPlatformLabel = (platform: PlatformType) => {
  if (platform === "youtube") return "YouTube";
  if (platform === "instagram") return "Instagram";
  return "TikTok";
};

const getAccountPublicUrl = (account: {
  platform: PlatformType;
  username: string | null;
  openId: string;
}) => {
  if (account.platform === "youtube") {
    return `https://www.youtube.com/channel/${account.openId}`;
  }

  if (account.platform === "instagram") {
    return account.username
      ? `https://www.instagram.com/${account.username.replace("@", "")}`
      : null;
  }

  return account.username
    ? `https://www.tiktok.com/@${account.username}`
    : null;
};

const getPeriodLabel = (
  periodType: PeriodType,
  dateFrom: string,
  dateTo: string,
) => {
  if (periodType === "day") return "День";
  if (periodType === "month") return "Месяц";
  if (periodType === "all") return "Всё время";

  return `${dateFrom || "..."} — ${dateTo || "..."}`;
};

const getPeriodParams = (
  periodType: PeriodType,
  dateFrom: string,
  dateTo: string,
): GetAdminStatisticsParams => {
  if (periodType === "custom") {
    return {
      periodType,
      startDate: dateFrom,
      endDate: dateTo,
    };
  }

  return {
    periodType,
  };
};

function PlatformBadge({ platform }: { platform: PlatformType }) {
  return (
    <span
      className={
        platform === "youtube"
          ? "inline-flex rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-300"
          : platform === "instagram"
            ? "inline-flex rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-300"
            : "inline-flex rounded-full bg-pink-500/10 px-2 py-1 text-xs text-pink-300"
      }
    >
      {getPlatformLabel(platform)}
    </span>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span
      className={`${className} inline-block animate-spin rounded-full border-2 border-white/20 border-t-white`}
    />
  );
}

function AvatarImage({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  const imageSrc = src || defaultAvatar;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      onError={(event) => {
        if (!event.currentTarget.src.includes("no-user-image.jpg")) {
          event.currentTarget.src = defaultAvatar;
        }
      }}
      className="h-11 w-11 shrink-0 rounded-full object-cover"
    />
  );
}

export default function AdminPage() {
  const [accountSearch, setAccountSearch] = useState("");
  const [moderatorSearch, setModeratorSearch] = useState("");

  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [appliedParams, setAppliedParams] = useState<GetAdminStatisticsParams>({
    periodType: "month",
    forceRefresh: false,
    requestKey: 0,
  });

  const [appliedPeriodLabel, setAppliedPeriodLabel] = useState("Месяц");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isInstagramActionLoading, setIsInstagramActionLoading] =
    useState(false);

  const [pendingModeratorChanges, setPendingModeratorChanges] = useState<
    Record<string, string>
  >({});

  const periodLabel = getPeriodLabel(periodType, dateFrom, dateTo);

  const {
    data: socialAccountsData,
    isFetching: isSocialAccountsFetching,
    isError: isSocialAccountsError,
  } = useGetAdminTikTokUsersStatisticsQuery(appliedParams);

  const {
    data: moderatorsData,
    isFetching: isModeratorsFetching,
    isError: isModeratorsError,
  } = useGetAdminModeratorsStatisticsQuery(appliedParams);

  const [deleteModerator, { isLoading: isDeletingModerator }] =
    useDeleteModeratorMutation();

  const [deleteTikTokUser, { isLoading: isDeletingTikTokUser }] =
    useDeleteTikTokUserMutation();

  const [deleteYouTubeUser, { isLoading: isDeletingYouTubeUser }] =
    useDeleteYouTubeUserMutation();

  const [updateTikTokUserModerator, { isLoading: isUpdatingTikTokModerator }] =
    useUpdateTikTokUserModeratorMutation();

  const [
    updateYouTubeUserModerator,
    { isLoading: isUpdatingYouTubeModerator },
  ] = useUpdateYouTubeUserModeratorMutation();

  const accounts = useMemo(() => {
    return socialAccountsData?.accounts ?? [];
  }, [socialAccountsData?.accounts]);

  const moderators = useMemo(() => {
    return moderatorsData?.moderators ?? [];
  }, [moderatorsData?.moderators]);

  const tikTokAccountsCount = useMemo(() => {
    return accounts.filter((account) => account.platform === "tiktok").length;
  }, [accounts]);

  const youTubeAccountsCount = useMemo(() => {
    return accounts.filter((account) => account.platform === "youtube").length;
  }, [accounts]);

  const instagramAccountsCount = useMemo(() => {
    return accounts.filter((account) => account.platform === "instagram")
      .length;
  }, [accounts]);

  const isStatsLoading = isSocialAccountsFetching || isModeratorsFetching;

  const isActionLoading =
    isDeletingModerator ||
    isDeletingTikTokUser ||
    isDeletingYouTubeUser ||
    isUpdatingTikTokModerator ||
    isUpdatingYouTubeModerator ||
    isInstagramActionLoading;

  const isLoading = isStatsLoading || isActionLoading;

  const isCustomPeriodInvalid =
    periodType === "custom" && (!isValidDate(dateFrom) || !isValidDate(dateTo));

  const isCustomPeriodWrongRange =
    periodType === "custom" &&
    isValidDate(dateFrom) &&
    isValidDate(dateTo) &&
    new Date(dateFrom) > new Date(dateTo);

  const canUpdateStatistics =
    !isStatsLoading && !isCustomPeriodInvalid && !isCustomPeriodWrongRange;

  const refreshStatistics = () => {
    setAppliedParams((prev) => ({
      ...prev,
      forceRefresh: true,
      requestKey: (prev.requestKey ?? 0) + 1,
    }));
  };

  const handleUpdateStatistics = () => {
    if (!canUpdateStatistics) return;

    setActionError(null);

    const params = getPeriodParams(periodType, dateFrom, dateTo);

    setAppliedParams((prev) => ({
      ...params,
      forceRefresh: true,
      requestKey: (prev.requestKey ?? 0) + 1,
    }));

    setAppliedPeriodLabel(periodLabel);
  };

  const filteredAccounts = useMemo(() => {
    return [...accounts]
      .filter((account) => {
        const search = accountSearch.toLowerCase();

        return (
          (account.username ?? "").toLowerCase().includes(search) ||
          (account.displayName ?? "").toLowerCase().includes(search) ||
          (account.openId ?? "").toLowerCase().includes(search) ||
          account.platform.toLowerCase().includes(search) ||
          (account.editor?.login ?? "").toLowerCase().includes(search) ||
          (account.moderator?.login ?? "").toLowerCase().includes(search)
        );
      })
      .sort((a, b) => b.viewsCount - a.viewsCount);
  }, [accounts, accountSearch]);

  const filteredModerators = useMemo(() => {
    return [...moderators]
      .filter((moderator) =>
        moderator.login.toLowerCase().includes(moderatorSearch.toLowerCase()),
      )
      .sort((a, b) => b.summary.totalViews - a.summary.totalViews);
  }, [moderators, moderatorSearch]);

  const updateInstagramModeratorByAccount = async (
    accountId: string,
    moderatorId: string | null,
  ) => {
    setIsInstagramActionLoading(true);

    try {
      const response = await fetch(
        `${serverUrl}/api/instagram-account/${accountId}/moderator`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moderatorId }),
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось изменить модератора Instagram аккаунта");
      }
    } finally {
      setIsInstagramActionLoading(false);
    }
  };

  const updateInstagramModeratorByEditor = async (
    editorId: string,
    moderatorId: string | null,
  ) => {
    setIsInstagramActionLoading(true);

    try {
      const response = await fetch(
        `${serverUrl}/api/instagram-account/editor/${editorId}/moderator`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moderatorId }),
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось изменить модератора монтажёра");
      }
    } finally {
      setIsInstagramActionLoading(false);
    }
  };

  const deleteInstagramAccount = async (accountId: string) => {
    setIsInstagramActionLoading(true);

    try {
      const response = await fetch(
        `${serverUrl}/api/instagram-account/${accountId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось удалить Instagram аккаунт");
      }
    } finally {
      setIsInstagramActionLoading(false);
    }
  };

  const handleBindModerator = (
    account: ModeratorStatisticsAccount,
    moderatorId: string,
  ) => {
    const accountKey = `${account.platform}-${account.id}`;
    const editorId = account.editor?.id;

    const nextModeratorLogin =
      moderators.find((moderator) => moderator.id === moderatorId)?.login ??
      "без модератора";

    setPendingModeratorChanges((prev) => ({
      ...prev,
      [accountKey]: moderatorId,
    }));

    setConfirmAction({
      title:
        account.platform === "instagram" && editorId
          ? "Изменить модератора у всех аккаунтов монтажёра?"
          : "Изменить модератора?",
      description:
        account.platform === "instagram" && editorId
          ? `У всех Instagram аккаунтов монтажёра ${account.editor?.login} будет установлен модератор: ${nextModeratorLogin}.`
          : moderatorId
            ? `${getPlatformLabel(account.platform)} аккаунт будет привязан к модератору: ${nextModeratorLogin}.`
            : `${getPlatformLabel(account.platform)} аккаунт будет без модератора.`,
      confirmText: "Изменить",
      onConfirm: async () => {
        if (account.platform === "tiktok") {
          await updateTikTokUserModerator({
            tiktokUserId: account.id,
            moderatorId: moderatorId || null,
          }).unwrap();
        }

        if (account.platform === "youtube") {
          await updateYouTubeUserModerator({
            youtubeUserId: account.id,
            moderatorId: moderatorId || null,
          }).unwrap();
        }

        if (account.platform === "instagram") {
          if (editorId) {
            await updateInstagramModeratorByEditor(
              editorId,
              moderatorId || null,
            );
          } else {
            await updateInstagramModeratorByAccount(
              account.id,
              moderatorId || null,
            );
          }
        }

        setPendingModeratorChanges({});
        refreshStatistics();
      },
    });
  };

  const handleDeleteAccount = (account: ModeratorStatisticsAccount) => {
    setConfirmAction({
      title: `Удалить ${getPlatformLabel(account.platform)} аккаунт?`,
      description: `Это действие удалит ${getPlatformLabel(
        account.platform,
      )} аккаунт из базы.`,
      confirmText: "Удалить",
      onConfirm: async () => {
        if (account.platform === "tiktok") {
          await deleteTikTokUser(account.id).unwrap();
        }

        if (account.platform === "youtube") {
          await deleteYouTubeUser(account.id).unwrap();
        }

        if (account.platform === "instagram") {
          await deleteInstagramAccount(account.id);
        }

        refreshStatistics();
      },
    });
  };

  const handleDeleteModerator = (moderatorId: string) => {
    setConfirmAction({
      title: "Удалить модератора?",
      description:
        "Модератор будет удалён, а у связанных аккаунтов moderatorId станет null.",
      confirmText: "Удалить",
      onConfirm: async () => {
        await deleteModerator(moderatorId).unwrap();
        refreshStatistics();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm text-slate-400">Админ-панель</p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Управление аккаунтами соцсетей
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                Здесь можно смотреть TikTok, YouTube и Instagram аккаунты,
                менять модераторов и удалять аккаунты.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 md:max-w-md">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-400">
                  Промежуток статистики
                </span>

                <span className="text-right text-sm font-medium">
                  {periodLabel}
                </span>
              </div>

              <select
                value={periodType}
                disabled={isLoading}
                onChange={(event) =>
                  setPeriodType(event.target.value as PeriodType)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="day">День</option>
                <option value="month">Месяц</option>
                <option value="all">Всё время</option>
                <option value="custom">Произвольный промежуток</option>
              </select>

              {periodType === "custom" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    value={dateFrom}
                    disabled={isLoading}
                    onChange={(event) => setDateFrom(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <input
                    type="date"
                    value={dateTo}
                    disabled={isLoading}
                    onChange={(event) => setDateTo(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              )}

              {isCustomPeriodInvalid && (
                <p className="mt-3 text-xs text-yellow-300">
                  Выбери обе даты в правильном формате.
                </p>
              )}

              {isCustomPeriodWrongRange && (
                <p className="mt-3 text-xs text-red-300">
                  Дата от не может быть позже даты до.
                </p>
              )}

              <button
                disabled={!canUpdateStatistics}
                onClick={handleUpdateStatistics}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStatsLoading && <Spinner />}
                {isStatsLoading ? "Обновляем..." : "Обновить статистику"}
              </button>
            </div>
          </div>
        </section>

        {(isSocialAccountsError || isModeratorsError || actionError) && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {actionError || "Не удалось загрузить статистику."}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Всего аккаунтов</p>
            <p className="mt-2 text-3xl font-bold">
              {socialAccountsData?.summary.accountsCount ?? 0}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">TikTok</p>
            <p className="mt-2 text-3xl font-bold">{tikTokAccountsCount}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">YouTube</p>
            <p className="mt-2 text-3xl font-bold">{youTubeAccountsCount}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Instagram</p>
            <p className="mt-2 text-3xl font-bold">{instagramAccountsCount}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-400">
              Просмотры: {appliedPeriodLabel}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatViews(socialAccountsData?.summary.totalViews ?? 0)}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Аккаунты соцсетей</h2>

              <p className="text-sm text-slate-400">
                Данные загружены за период: {appliedPeriodLabel}
              </p>
            </div>

            <input
              value={accountSearch}
              disabled={isLoading}
              onChange={(event) => setAccountSearch(event.target.value)}
              placeholder="Поиск по аккаунтам..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 md:w-80"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-xs xl:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-3 py-3 font-medium">Аккаунт</th>
                  <th className="px-3 py-3 font-medium">Платформа</th>
                  <th className="px-3 py-3 font-medium">Видео</th>
                  <th className="px-3 py-3 font-medium">1000+</th>
                  <th className="px-3 py-3 font-medium">Лайки</th>
                  <th className="px-3 py-3 font-medium">Просмотры</th>
                  <th className="px-3 py-3 font-medium">Монтажёр</th>
                  <th className="px-3 py-3 font-medium">Модератор</th>
                  <th className="px-3 py-3 font-medium">Статус</th>
                  <th className="px-3 py-3 font-medium">Действия</th>
                </tr>
              </thead>

              <tbody>
                {isSocialAccountsFetching ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Spinner className="h-5 w-5" />
                        Загружаем аккаунты...
                      </div>
                    </td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      Нет данных.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const accountKey = `${account.platform}-${account.id}`;
                    const publicUrl = getAccountPublicUrl(account);

                    const selectedModeratorId =
                      pendingModeratorChanges[accountKey] ??
                      account.moderatorId ??
                      "";

                    return (
                      <tr
                        key={accountKey}
                        className="border-b border-white/5 text-slate-200"
                      >
                        <td className="px-3 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <AvatarImage
                              src={account.avatarUrl}
                              alt={account.displayName ?? "Social account"}
                            />

                            <div className="min-w-0">
                              {publicUrl ? (
                                <a
                                  href={publicUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block truncate font-medium text-blue-300 hover:underline"
                                >
                                  {account.displayName ??
                                    account.username ??
                                    "Без имени"}
                                </a>
                              ) : (
                                <p className="truncate font-medium">
                                  {account.displayName ?? "Без имени"}
                                </p>
                              )}

                              <p className="truncate text-xs text-slate-400">
                                {account.username ?? account.openId}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <PlatformBadge platform={account.platform} />
                        </td>

                        <td className="px-3 py-4">{account.videosCount}</td>

                        <td className="px-3 py-4">
                          {formatViews(account.videosFrom1kCount ?? 0)}
                        </td>

                        <td className="px-3 py-4">
                          {formatViews(account.likesCount)}
                        </td>

                        <td className="px-3 py-4 font-semibold text-white">
                          {formatViews(account.viewsCount)}
                        </td>

                        <td className="px-3 py-4">
                          {account.platform === "instagram" ? (
                            <span className="block truncate rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                              {account.editor?.login ?? "Не найден"}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Не требуется
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <select
                            value={selectedModeratorId}
                            disabled={isLoading}
                            onChange={(event) =>
                              handleBindModerator(account, event.target.value)
                            }
                            className="w-full min-w-[160px] rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="">Без модератора</option>

                            {moderators.map((moderator) => (
                              <option key={moderator.id} value={moderator.id}>
                                {moderator.login}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={
                              account.error
                                ? "rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300"
                                : "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
                            }
                          >
                            {account.error ? "Ошибка" : "Ок"}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <button
                            disabled={isLoading}
                            onClick={() => handleDeleteAccount(account)}
                            className="rounded-xl bg-red-500/15 px-3 py-2 text-xs text-red-300 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Модераторы</h2>

              <p className="text-sm text-slate-400">
                Данные загружены за период: {appliedPeriodLabel}
              </p>
            </div>

            <input
              value={moderatorSearch}
              disabled={isLoading}
              onChange={(event) => setModeratorSearch(event.target.value)}
              placeholder="Поиск модератора..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 md:w-80"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs xl:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-4 py-3 font-medium">Логин</th>
                  <th className="px-4 py-3 font-medium">Аккаунтов</th>
                  <th className="px-4 py-3 font-medium">Общие просмотры</th>
                  <th className="px-4 py-3 font-medium">Промежуток</th>
                  <th className="px-4 py-3 font-medium">Действия</th>
                </tr>
              </thead>

              <tbody>
                {isModeratorsFetching ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Spinner className="h-5 w-5" />
                        Загружаем модераторов...
                      </div>
                    </td>
                  </tr>
                ) : filteredModerators.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      Нет данных.
                    </td>
                  </tr>
                ) : (
                  filteredModerators.map((moderator) => (
                    <tr
                      key={moderator.id}
                      className="border-b border-white/5 text-slate-200"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/moderator/${moderator.id}`}
                          className="font-medium text-blue-300 hover:text-blue-200 hover:underline"
                        >
                          {moderator.login}
                        </Link>
                      </td>

                      <td className="px-4 py-4">{moderator.accountsCount}</td>

                      <td className="px-4 py-4 font-semibold">
                        {formatViews(moderator.summary.totalViews)}
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {appliedPeriodLabel}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          disabled={isLoading}
                          onClick={() => handleDeleteModerator(moderator.id)}
                          className="rounded-xl bg-red-500/15 px-4 py-2 text-sm text-red-300 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <div className="mb-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-xl font-bold text-red-300">
                !
              </div>

              <h3 className="text-xl font-semibold">{confirmAction.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {confirmAction.description}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                disabled={isLoading}
                onClick={() => {
                  setPendingModeratorChanges({});
                  setConfirmAction(null);
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Отмена
              </button>

              <button
                disabled={isLoading}
                onClick={async () => {
                  setActionError(null);

                  try {
                    await confirmAction.onConfirm();
                    setConfirmAction(null);
                  } catch {
                    setPendingModeratorChanges({});
                    setActionError("Не удалось выполнить действие");
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isActionLoading && <Spinner />}
                {isActionLoading ? "Выполняем..." : confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {isStatsLoading && (
        <div className="fixed bottom-6 right-4 z-40 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-white shadow-2xl sm:right-6">
          <Spinner className="h-5 w-5" />
          Обновляем статистику...
        </div>
      )}
    </div>
  );
}
