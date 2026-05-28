"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import {
  useGetAdminModeratorStatisticsQuery,
  useGetMyModeratorStatisticsQuery,
} from "@/src/api/statistics/statistics.api";

import type { PlatformType } from "@/src/api/statistics/statistics.type.api";

import {
  useGetAllNotConnectQuery,
  useUpdateAuthorContentMutation,
} from "@/src/api/tikTok/user.api";

import {
  useGetAllYouTubeNotConnectQuery,
  useUpdateYouTubeAuthorContentMutation,
} from "@/src/api/youtube/youtubeUser.api";

import { useModeratorAccounts } from "@/src/hooks/moderator/useModeratorAccounts";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

type ModeratorPageProps =
  | {
      mode: "self";

      moderatorId?: never;
    }
  | {
      mode: "admin";

      moderatorId: string;
    };

type ReportStatus = "DRAFT" | "PENDING" | "VERIFIED" | "REJECTED";

type ReportPeriodType = "CUSTOM" | "WEEK" | "MONTH" | "ALL_TIME";

type InstagramAccountInfo = {
  id: string;

  username: string;

  accountUrl: string;

  avatarUrl?: string | null;

  moderatorId?: string | null;
};

type InstagramMetricsPendingReport = {
  id: string;

  instagramAccountId: string;

  periodType: ReportPeriodType;

  weekStartDate?: string | null;

  weekEndDate?: string | null;

  startDate?: string | null;

  endDate?: string | null;

  currentTotalViews: number;

  currentTotalLikes: number;

  currentVideosCount: number;

  viewsDelta: number;

  likesDelta: number;

  videosDelta: number;

  status: ReportStatus;

  createdAt: string;

  instagramAccount: InstagramAccountInfo;
};

type InstagramViralVideo = {
  url: string;

  views: number;

  likes: number;

  publishedAt: string;

  title?: string;
};

type InstagramViralPendingReport = {
  id: string;

  instagramAccountId: string;

  periodType: ReportPeriodType;

  weekStartDate?: string | null;

  weekEndDate?: string | null;

  startDate?: string | null;

  endDate?: string | null;

  videosCount: number;

  videos: InstagramViralVideo[];

  status: ReportStatus;

  createdAt: string;

  instagramAccount: InstagramAccountInfo;
};

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("ru-RU");

const money = (value?: number) =>
  (value ?? 0).toLocaleString("ru-RU", {
    style: "currency",

    currency: "RUB",

    maximumFractionDigits: 0,
  });

const getDateValue = (date: Date) => date.toISOString().split("T")[0];

const getCurrentMonthStart = () => {
  const now = new Date();

  return getDateValue(new Date(now.getFullYear(), now.getMonth(), 1));
};

const getCurrentMonthEnd = () => {
  const now = new Date();

  return getDateValue(new Date(now.getFullYear(), now.getMonth() + 1, 1));
};

const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

const getDaysDiff = (startDate: string, endDate: string) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return 0;

  const start = new Date(`${startDate}T00:00:00`).getTime();

  const end = new Date(`${endDate}T00:00:00`).getTime();

  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const getPlatformLabel = (platform: PlatformType) => {
  if (platform === "youtube") return "YouTube";

  if (platform === "instagram") return "Instagram";

  return "TikTok";
};

const getPeriodLabel = (report: {
  periodType: ReportPeriodType;

  weekStartDate?: string | null;

  weekEndDate?: string | null;

  startDate?: string | null;

  endDate?: string | null;
}) => {
  if (report.periodType === "ALL_TIME") return "За всё время";

  if (report.periodType === "WEEK") {
    return `${report.weekStartDate?.slice(0, 10) ?? "—"} — ${
      report.weekEndDate?.slice(0, 10) ?? "—"
    }`;
  }

  return `${report.startDate?.slice(0, 10) ?? "—"} — ${
    report.endDate?.slice(0, 10) ?? "—"
  }`;
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

const getVideoPublicUrl = (video: {
  platform: PlatformType;

  id: string;

  username?: string | null;

  share_url?: string | null;
}) => {
  if (video.platform === "youtube") {
    return `https://www.youtube.com/watch?v=${video.id}`;
  }

  if (video.platform === "instagram") {
    return video.share_url ?? null;
  }

  if (video.share_url) return video.share_url;

  return video.username
    ? `https://www.tiktok.com/@${video.username}/video/${video.id}`
    : null;
};

function PlatformBadge({ platform }: { platform: PlatformType }) {
  const className =
    platform === "youtube"
      ? "inline-flex rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-300"
      : platform === "instagram"
        ? "inline-flex rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-300"
        : "inline-flex rounded-full bg-pink-500/10 px-2 py-1 text-xs text-pink-300";

  return <span className={className}>{getPlatformLabel(platform)}</span>;
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span
      className={`${className} inline-block animate-spin rounded-full border-2 border-white/20 border-t-white`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
  );
}

function LoadingBlock() {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-pink-500" />

      <p className="mt-4 text-sm text-zinc-400">Загружаем статистику...</p>
    </div>
  );
}

export default function ModeratorPage({
  mode,

  moderatorId,
}: ModeratorPageProps) {
  const router = useRouter();

  const [draftStartDate, setDraftStartDate] = useState(getCurrentMonthStart());

  const [draftEndDate, setDraftEndDate] = useState(getCurrentMonthEnd());

  const [appliedDates, setAppliedDates] = useState({
    startDate: getCurrentMonthStart(),

    endDate: getCurrentMonthEnd(),

    forceRefresh: false,

    requestKey: 0,
  });

  const [isManageOpen, setIsManageOpen] = useState(false);

  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>("tiktok");

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [confirmOpenId, setConfirmOpenId] = useState("");

  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);

  const [instagramUsername, setInstagramUsername] = useState("");

  const [isInstagramConnecting, setIsInstagramConnecting] = useState(false);

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const [instagramMetricsReports, setInstagramMetricsReports] = useState<
    InstagramMetricsPendingReport[]
  >([]);

  const [instagramViralReports, setInstagramViralReports] = useState<
    InstagramViralPendingReport[]
  >([]);

  const [isInstagramReportsLoading, setIsInstagramReportsLoading] =
    useState(false);

  const [instagramActionId, setInstagramActionId] = useState<string | null>(
    null,
  );

  const { connectAccount, disconnectAccount, isConnecting, isDisconnecting } =
    useModeratorAccounts();

  const [updateTikTokAuthorContent, { isLoading: isUpdatingTikTokAuthor }] =
    useUpdateAuthorContentMutation();

  const [updateYouTubeAuthorContent, { isLoading: isUpdatingYouTubeAuthor }] =
    useUpdateYouTubeAuthorContentMutation();

  const myStatisticsQuery = useGetMyModeratorStatisticsQuery(appliedDates, {
    skip: mode !== "self",
  });

  const adminStatisticsQuery = useGetAdminModeratorStatisticsQuery(
    {
      id: moderatorId ?? "",

      periodType: "custom",

      startDate: appliedDates.startDate,

      endDate: appliedDates.endDate,

      forceRefresh: appliedDates.forceRefresh,

      requestKey: appliedDates.requestKey,
    },

    {
      skip: mode !== "admin" || !moderatorId,
    },
  );

  const activeStatisticsQuery =
    mode === "admin" ? adminStatisticsQuery : myStatisticsQuery;

  const { data, isLoading, isFetching, error } = activeStatisticsQuery;

  const {
    data: freeTikTokAccounts = [],

    isLoading: isFreeTikTokAccountsLoading,

    refetch: refetchFreeTikTokAccounts,
  } = useGetAllNotConnectQuery(undefined, {
    skip: !isManageOpen,
  });

  const {
    data: freeYouTubeAccounts = [],

    isLoading: isFreeYouTubeAccountsLoading,

    refetch: refetchFreeYouTubeAccounts,
  } = useGetAllYouTubeNotConnectQuery(undefined, {
    skip: !isManageOpen,
  });

  const filterInstagramReportsByModerator = <
    T extends {
      instagramAccount: {
        moderatorId?: string | null;
      };
    },
  >(
    reports: T[],
  ) => {
    if (mode !== "admin" || !moderatorId) return reports;

    return reports.filter(
      (report) =>
        !report.instagramAccount.moderatorId ||
        report.instagramAccount.moderatorId === moderatorId,
    );
  };

  const loadInstagramPendingReports = async (
    signal?: AbortSignal,

    options?: { silent?: boolean },
  ) => {
    try {
      if (!options?.silent) {
        setIsInstagramReportsLoading(true);
      }

      const metricsEndpoint =
        mode === "admin"
          ? `${serverUrl}/api/instagram-report/admin/metrics/pending`
          : `${serverUrl}/api/instagram-report/metrics/pending`;

      const viralEndpoint =
        mode === "admin"
          ? `${serverUrl}/api/instagram-report/admin/viral-videos/pending`
          : `${serverUrl}/api/instagram-report/viral-videos/pending`;

      const [metricsResponse, viralResponse] = await Promise.all([
        fetch(metricsEndpoint, {
          credentials: "include",

          signal,
        }),

        fetch(viralEndpoint, {
          credentials: "include",

          signal,
        }),
      ]);

      if (!metricsResponse.ok || !viralResponse.ok) {
        throw new Error();
      }

      const metricsReports =
        (await metricsResponse.json()) as InstagramMetricsPendingReport[];

      const viralReports =
        (await viralResponse.json()) as InstagramViralPendingReport[];

      setInstagramMetricsReports(
        filterInstagramReportsByModerator(metricsReports),
      );

      setInstagramViralReports(filterInstagramReportsByModerator(viralReports));
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      toast.error("Не удалось загрузить Instagram отчёты.");
    } finally {
      if (!options?.silent) {
        setIsInstagramReportsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      void loadInstagramPendingReports(controller.signal);
    }, 0);

    return () => {
      controller.abort();

      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, moderatorId]);

  const daysDiff = useMemo(
    () => getDaysDiff(draftStartDate, draftEndDate),

    [draftStartDate, draftEndDate],
  );

  const isInvalidDateRange =
    !isValidDate(draftStartDate) ||
    !isValidDate(draftEndDate) ||
    daysDiff <= 0 ||
    daysDiff > 31;

  const freeSocialAccounts = useMemo(() => {
    if (selectedPlatform === "tiktok") {
      return freeTikTokAccounts.map((account) => ({
        id: account.id,

        platform: "tiktok" as const,

        username: account.tiktok_username,

        displayName: account.tiktok_display_name,

        openId: account.tiktok_open_id,
      }));
    }

    if (selectedPlatform === "youtube") {
      return freeYouTubeAccounts.map((account) => ({
        id: account.id,

        platform: "youtube" as const,

        username: account.youtube_custom_url,

        displayName: account.youtube_title,

        openId: account.youtube_channel_id,
      }));
    }

    return [];
  }, [selectedPlatform, freeTikTokAccounts, freeYouTubeAccounts]);

  const selectedAccount = freeSocialAccounts.find(
    (account) => account.id === selectedAccountId,
  );

  const accountForDelete = data?.accounts.find(
    (account) => account.id === deleteAccountId,
  );

  const summary = data?.summary;

  const bonuses = summary
    ? [
        { title: "Премия за план", value: summary.planBonus },

        { title: "Топ видео за неделю", value: summary.weeklyTopVideosBonus },

        { title: "Топ видео за месяц", value: summary.monthlyTopVideosBonus },

        { title: "Всего премий", value: summary.bonusesTotal },
      ]
    : [];

  const refreshStatistics = () => {
    setAppliedDates((prev) => ({
      ...prev,

      forceRefresh: true,

      requestKey: prev.requestKey + 1,
    }));
  };

  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);

      const response = await fetch(`${serverUrl}/api/auth/logout`, {
        method: "POST",

        credentials: "include",
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const serverMessage =
          errorPayload && typeof errorPayload.message === "string"
            ? errorPayload.message
            : "Не удалось добавить Instagram аккаунт.";

        throw new Error(serverMessage);
      }

      toast.success("Вы вышли из аккаунта.");

      router.push("/auth");
    } catch {
      toast.error("Не удалось выйти из аккаунта.");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const handleApplyDates = () => {
    if (isInvalidDateRange) {
      toast.error("Проверьте даты. Диапазон должен быть от 1 до 31 дня.");

      return;
    }

    setAppliedDates((prev) => ({
      startDate: draftStartDate,

      endDate: draftEndDate,

      forceRefresh: true,

      requestKey: prev.requestKey + 1,
    }));
  };

  const handleConnectInstagramAccounts = async () => {
    if (!instagramUsername.trim()) {
      toast.error("Введите никнейм Instagram");

      return;
    }

    try {
      setIsInstagramConnecting(true);

      const response = await fetch(
        `${serverUrl}/api/instagram-account/by-moderator`,

        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: instagramUsername.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Instagram аккаунт добавлен.");

      setInstagramUsername("");

      refreshStatistics();

      await loadInstagramPendingReports(undefined, { silent: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось добавить Instagram аккаунт.",
      );
    } finally {
      setIsInstagramConnecting(false);
    }
  };

  const handleConnectAccount = async () => {
    if (selectedPlatform === "instagram") {
      await handleConnectInstagramAccounts();

      return;
    }

    if (!data?.moderator.id) return;

    if (!selectedAccount) {
      toast.error("Выберите аккаунт");

      return;
    }

    if (confirmOpenId.trim() !== selectedAccount.openId) {
      toast.error(
        selectedAccount.platform === "youtube"
          ? "Channel ID указан неверно"
          : "OpenId ключ указан неверно",
      );

      return;
    }

    const success = await connectAccount(
      selectedAccount.platform,

      data.moderator.id,

      selectedAccount.id,

      mode === "admin",
    );

    if (!success) return;

    setSelectedAccountId("");

    setConfirmOpenId("");

    refreshStatistics();

    await refetchFreeTikTokAccounts();

    await refetchFreeYouTubeAccounts();
  };

  const handleDisconnectAccount = async () => {
    if (!deleteAccountId || !accountForDelete) return;

    if (accountForDelete.platform === "instagram") {
      try {
        const response = await fetch(
          `${serverUrl}/api/instagram-account/${deleteAccountId}/disconnect`,

          {
            method: "PATCH",

            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error();
        }

        toast.success("Instagram аккаунт отвязан от модератора.");

        setDeleteAccountId(null);

        refreshStatistics();

        return;
      } catch {
        toast.error("Не удалось отвязать Instagram аккаунт.");

        return;
      }
    }

    const success = await disconnectAccount(
      accountForDelete.platform,

      deleteAccountId,

      mode === "admin" ? data?.moderator.id : undefined,
    );

    if (!success) return;

    setDeleteAccountId(null);

    refreshStatistics();

    if (isManageOpen) {
      await refetchFreeTikTokAccounts();

      await refetchFreeYouTubeAccounts();
    }
  };

  const handleToggleAuthorContent = async (
    accountId: string,

    platform: PlatformType,

    currentValue: boolean,
  ) => {
    try {
      if (platform === "tiktok") {
        await updateTikTokAuthorContent({
          tiktokUserId: accountId,

          isAuthorContent: !currentValue,
        }).unwrap();
      }

      if (platform === "youtube") {
        await updateYouTubeAuthorContent({
          youtubeUserId: accountId,

          isAuthorContent: !currentValue,
        }).unwrap();
      }

      if (platform === "instagram") {
        const response = await fetch(
          `${serverUrl}/api/instagram-account/${accountId}/author-content`,

          {
            method: "PATCH",

            credentials: "include",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              isAuthorContent: !currentValue,
            }),
          },
        );

        if (!response.ok) {
          throw new Error();
        }
      }

      toast.success(
        !currentValue
          ? "Аккаунт отмечен как авторский"
          : "Аккаунт отмечен как не авторский",
      );

      refreshStatistics();
    } catch {
      toast.error("Не удалось изменить тип контента");
    }
  };

  const handleVerifyInstagramReport = async (
    reportType: "metrics" | "viral-videos",

    reportId: string,
  ) => {
    try {
      setInstagramActionId(reportId);

      const endpoint =
        mode === "admin"
          ? `${serverUrl}/api/instagram-report/admin/${reportType}/${reportId}/verify`
          : `${serverUrl}/api/instagram-report/${reportType}/${reportId}/verify`;

      const response = await fetch(endpoint, {
        method: "POST",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success(
        reportType === "metrics"
          ? "Отчёт по статистике подтверждён."
          : "Отчёт по видео 1000+ подтверждён.",
      );

      await loadInstagramPendingReports(undefined, { silent: true });

      refreshStatistics();
    } catch {
      toast.error("Не удалось подтвердить отчёт.");
    } finally {
      setInstagramActionId(null);
    }
  };

  const handleRejectInstagramReport = async (
    reportType: "metrics" | "viral-videos",

    reportId: string,
  ) => {
    const rejectReason = window.prompt("Причина отклонения отчёта");

    if (!rejectReason) return;

    try {
      setInstagramActionId(reportId);

      const endpoint =
        mode === "admin"
          ? `${serverUrl}/api/instagram-report/admin/${reportType}/${reportId}/reject`
          : `${serverUrl}/api/instagram-report/${reportType}/${reportId}/reject`;

      const response = await fetch(endpoint, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          rejectReason,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Instagram отчёт отклонён.");

      await loadInstagramPendingReports(undefined, { silent: true });
    } catch {
      toast.error("Не удалось отклонить отчёт.");
    } finally {
      setInstagramActionId(null);
    }
  };

  const isFreeAccountsLoading =
    isFreeTikTokAccountsLoading || isFreeYouTubeAccountsLoading;

  const isUpdatingAuthorContent =
    isUpdatingTikTokAuthor || isUpdatingYouTubeAuthor;

  const isPageDisabled =
    isFetching ||
    isLogoutLoading ||
    isUpdatingAuthorContent ||
    isConnecting ||
    isDisconnecting ||
    isInstagramConnecting ||
    Boolean(instagramActionId);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-pink-400">
              {mode === "admin"
                ? "Админ-панель модератора"
                : "Панель модератора"}
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {mode === "admin"
                ? `Управление модератором ${data?.moderator.login ?? ""}`
                : "Статистика и премии"}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              {mode === "admin"
                ? "Просмотр статистики и управление аккаунтами выбранного модератора."
                : "Расчёт просмотров, выполнения плана и итоговой суммы модератора."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
              >
                На главную
              </Link>

              <button
                type="button"
                disabled={isLogoutLoading}
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLogoutLoading && <Spinner />}

                {isLogoutLoading ? "Выходим..." : "Выйти"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900 p-4 md:flex-row md:items-end">
            <div>
              <label className="mb-2 block text-xs text-zinc-400">
                Начало периода
              </label>

              <input
                type="date"
                value={draftStartDate}
                disabled={isPageDisabled}
                onChange={(event) => setDraftStartDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-zinc-400">
                Конец периода
              </label>

              <input
                type="date"
                value={draftEndDate}
                disabled={isPageDisabled}
                onChange={(event) => setDraftEndDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              disabled={isInvalidDateRange || isFetching}
              onClick={handleApplyDates}
              className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-2 text-sm font-medium transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetching && <Spinner />}

              {isFetching ? "Обновление..." : "Обновить статистику"}
            </button>

            <button
              type="button"
              disabled={isPageDisabled}
              onClick={() => setIsManageOpen(true)}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Управление аккаунтами
            </button>
          </div>
        </div>

        {isInvalidDateRange && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Диапазон должен быть больше 0 дней и не больше 31 дня. Даты должны
            быть заполнены полностью.
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Не удалось загрузить статистику.
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Instagram отчёты на проверку
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Теперь отдельно подтверждаются общая статистика и список видео
                1000+.
              </p>
            </div>

            <button
              type="button"
              disabled={isInstagramReportsLoading}
              onClick={() => loadInstagramPendingReports()}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isInstagramReportsLoading ? "Загрузка..." : "Обновить"}
            </button>
          </div>

          {isInstagramReportsLoading && (
            <div className="mt-5 flex items-center gap-3 text-sm text-zinc-400">
              <Spinner />
              Загружаем Instagram отчёты...
            </div>
          )}

          {!isInstagramReportsLoading && (
            <div className="mt-5 space-y-8">
              <div>
                <h3 className="text-lg font-bold">Общая статистика</h3>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {instagramMetricsReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <PlatformBadge platform="instagram" />

                          <a
                            href={report.instagramAccount.accountUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block font-bold text-pink-300 hover:underline"
                          >
                            @{report.instagramAccount.username}
                          </a>

                          <p className="mt-1 text-xs text-zinc-500">
                            {getPeriodLabel(report)}
                          </p>
                        </div>

                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                          На проверке
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white/5 p-3">
                          <p className="text-xs text-zinc-500">Просмотры</p>
                          <p className="mt-1 font-bold">
                            {formatNumber(report.currentTotalViews)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Δ {formatNumber(report.viewsDelta)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/5 p-3">
                          <p className="text-xs text-zinc-500">Лайки</p>
                          <p className="mt-1 font-bold">
                            {formatNumber(report.currentTotalLikes)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Δ {formatNumber(report.likesDelta)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/5 p-3">
                          <p className="text-xs text-zinc-500">Видео</p>
                          <p className="mt-1 font-bold">
                            {formatNumber(report.currentVideosCount)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Δ {formatNumber(report.videosDelta)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={instagramActionId === report.id}
                          onClick={() =>
                            handleVerifyInstagramReport("metrics", report.id)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {instagramActionId === report.id && <Spinner />}
                          Подтвердить
                        </button>

                        <button
                          type="button"
                          disabled={instagramActionId === report.id}
                          onClick={() =>
                            handleRejectInstagramReport("metrics", report.id)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}

                  {!instagramMetricsReports.length && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-zinc-400 lg:col-span-2">
                      Отчётов по общей статистике пока нет.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">Видео больше 1000+</h3>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {instagramViralReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <PlatformBadge platform="instagram" />

                          <a
                            href={report.instagramAccount.accountUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block font-bold text-pink-300 hover:underline"
                          >
                            @{report.instagramAccount.username}
                          </a>

                          <p className="mt-1 text-xs text-zinc-500">
                            {getPeriodLabel(report)}
                          </p>
                        </div>

                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                          На проверке
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-white/5 p-3">
                        <p className="text-xs text-zinc-500">
                          Количество видео 1000+
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {formatNumber(report.videosCount)}
                        </p>
                      </div>

                      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                        {report.videos.map((video) => (
                          <a
                            key={video.url}
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl bg-white/5 p-3 text-sm text-pink-300 hover:bg-white/10 hover:underline"
                          >
                            <span className="block break-all">{video.url}</span>

                            <span className="mt-2 block text-xs text-zinc-400">
                              {formatNumber(video.views)} просмотров ·{" "}
                              {formatNumber(video.likes)} лайков ·{" "}
                              {video.publishedAt.slice(0, 10)}
                            </span>

                            {video.title && (
                              <span className="mt-1 block text-xs text-zinc-500">
                                {video.title}
                              </span>
                            )}
                          </a>
                        ))}

                        {!report.videos.length && (
                          <p className="text-sm text-zinc-500">
                            Видео не добавлены.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={instagramActionId === report.id}
                          onClick={() =>
                            handleVerifyInstagramReport(
                              "viral-videos",
                              report.id,
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {instagramActionId === report.id && <Spinner />}
                          Подтвердить
                        </button>

                        <button
                          type="button"
                          disabled={instagramActionId === report.id}
                          onClick={() =>
                            handleRejectInstagramReport(
                              "viral-videos",
                              report.id,
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}

                  {!instagramViralReports.length && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-zinc-400 lg:col-span-2">
                      Отчётов по видео 1000+ пока нет.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            <LoadingBlock />
          </>
        )}

        {summary && data && (
          <div className={isFetching ? "opacity-60 transition" : "transition"}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-zinc-400">Оклад модератора</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {money(summary.salary)}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-zinc-400">Общие просмотры</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {formatNumber(summary.totalViews)}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-zinc-400">Всего премий</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {money(summary.bonusesTotal)}
                </h2>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-sm text-red-300">Де-премия</p>
                <h2 className="mt-2 text-3xl font-bold text-red-300">
                  {money(summary.dePremium)}
                </h2>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-sm text-emerald-300">Итого заработает</p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-300">
                  {money(summary.curatorTotal)}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {bonuses.map((bonus) => (
                <div
                  key={bonus.title}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
                >
                  <p className="text-sm text-zinc-400">{bonus.title}</p>
                  <h3 className="mt-2 text-2xl font-bold">
                    {money(bonus.value)}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-4 md:p-5">
              <h2 className="text-xl font-bold">Аккаунты соцсетей</h2>
              <p className="mt-1 text-sm text-zinc-400">
                TikTok, YouTube и Instagram аккаунты, просмотры и выполнение
                плана.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-xs xl:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="px-3 py-3 font-medium">Аккаунт</th>
                      <th className="px-3 py-3 font-medium">Платформа</th>
                      <th className="px-3 py-3 font-medium">Авторский</th>
                      <th className="px-3 py-3 font-medium">Видео</th>
                      <th className="px-3 py-3 font-medium">Лайки</th>
                      <th className="px-3 py-3 font-medium">Просмотры</th>
                      <th className="px-3 py-3 font-medium">Видео от 1к</th>
                      <th className="px-3 py-3 font-medium">План</th>
                      <th className="px-3 py-3 font-medium">Премия</th>
                      <th className="px-3 py-3 font-medium">Де-премия</th>
                      <th className="px-3 py-3 font-medium">Статус</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.accounts.map((account) => {
                      const publicUrl = getAccountPublicUrl(account);

                      return (
                        <tr
                          key={`${account.platform}-${account.id}`}
                          className="border-b border-white/5"
                        >
                          <td className="px-3 py-4">
                            {publicUrl ? (
                              <a
                                href={publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-pink-300 hover:underline"
                              >
                                {account.username ??
                                  account.displayName ??
                                  "Без username"}
                              </a>
                            ) : (
                              <p className="font-medium text-pink-300">
                                {account.username ?? "Без username"}
                              </p>
                            )}

                            <p className="text-xs text-zinc-500">
                              {account.displayName ?? "Без имени"}
                            </p>

                            {account.error && (
                              <p className="mt-1 text-xs text-red-300">
                                Ошибка получения статистики
                              </p>
                            )}
                          </td>

                          <td className="px-3 py-4">
                            <PlatformBadge platform={account.platform} />
                          </td>

                          <td className="px-3 py-4">
                            {account.isAuthorContent ? "Да" : "Нет"}
                          </td>

                          <td className="px-3 py-4">
                            {formatNumber(account.videosCount)}
                          </td>

                          <td className="px-3 py-4">
                            {formatNumber(account.likesCount)}
                          </td>

                          <td className="px-3 py-4">
                            {formatNumber(account.viewsCount)}
                          </td>

                          <td className="px-3 py-4">
                            {formatNumber(account.videosFrom1kCount)}
                          </td>

                          <td className="px-3 py-4">{account.plan.label}</td>

                          <td className="px-3 py-4">
                            {money(account.plan.plan)}
                          </td>

                          <td className="px-3 py-4 text-red-300">
                            {money(account.dePremium)}
                          </td>

                          <td className="px-3 py-4">
                            <span
                              className={
                                account.plan.isCompleted
                                  ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
                                  : "rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300"
                              }
                            >
                              {account.plan.isCompleted
                                ? "Выполнен"
                                : "Не выполнен"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {!data.accounts.length && (
                  <p className="py-6 text-sm text-zinc-400">
                    Аккаунтов пока нет.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <h2 className="text-xl font-bold">Топ видео по неделям</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Лучшее видео каждой недели и премия 0.02 ₽ за просмотр.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {data.weeklyTopVideos.map((item) => {
                    const videoUrl = getVideoPublicUrl(item.video);

                    return (
                      <a
                        key={`${item.week}-${item.video.platform}-${item.video.id}`}
                        href={videoUrl ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-pink-500/40 hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-pink-400">
                            {item.week} неделя · {item.label}
                          </p>

                          <PlatformBadge platform={item.video.platform} />
                        </div>

                        <h3 className="mt-2 line-clamp-2 font-semibold">
                          {item.video.title || item.video.video_description}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">
                          {item.video.username ?? "Без username"}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-zinc-500">Просмотры</p>
                            <p className="font-bold">
                              {formatNumber(item.video.view_count)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Премия</p>
                            <p className="font-bold text-emerald-300">
                              {money(item.bonus)}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}

                  {!data.weeklyTopVideos.length && (
                    <p className="text-sm text-zinc-400">
                      За этот период топ-видео нет.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <h2 className="text-xl font-bold">Топ видео за период</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Все видео от 100 000 просмотров и премия 0.02 ₽ за просмотр.
                </p>

                <div className="mt-5 space-y-3">
                  {data.monthlyTopVideos.map((video, index) => {
                    const videoUrl = getVideoPublicUrl(video);

                    return (
                      <a
                        key={`${video.platform}-${video.id}`}
                        href={videoUrl ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-pink-500/40 hover:bg-white/10"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 font-bold text-pink-300">
                            {index + 1}
                          </div>

                          <div>
                            <div className="mb-2">
                              <PlatformBadge platform={video.platform} />
                            </div>

                            <h3 className="line-clamp-2 font-semibold">
                              {video.title || video.video_description}
                            </h3>

                            <p className="mt-1 text-sm text-zinc-400">
                              {video.username ?? "Без username"}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-bold">
                            {formatNumber(video.view_count)}
                          </p>
                          <p className="text-sm text-emerald-300">
                            {money(video.bonus)}
                          </p>
                        </div>
                      </a>
                    );
                  })}

                  {!data.monthlyTopVideos.length && (
                    <p className="text-sm text-zinc-400">
                      За этот период топ-видео нет.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-linear-to-r from-pink-500/20 to-purple-500/20 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-zinc-300">Итог модератора</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {money(summary.curatorTotal)}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-zinc-300">
                    Общая сумма просмотров
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {formatNumber(summary.totalViews)}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-zinc-300">Аккаунтов в работе</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {data.accounts.length}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isManageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Управление аккаунтами</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Добавьте TikTok, YouTube или Instagram аккаунт, отвяжите
                  текущий или измените тип контента.
                </p>
              </div>

              <button
                type="button"
                disabled={isPageDisabled}
                onClick={() => setIsManageOpen(false)}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-bold">Добавить аккаунт</h3>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["tiktok", "youtube", "instagram"] as PlatformType[]).map(
                    (platform) => (
                      <button
                        key={platform}
                        type="button"
                        disabled={isPageDisabled}
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setSelectedAccountId("");
                          setConfirmOpenId("");
                          setInstagramUsername("");
                        }}
                        className={
                          selectedPlatform === platform
                            ? platform === "youtube"
                              ? "rounded-xl bg-red-500 px-4 py-3 text-sm font-medium"
                              : platform === "instagram"
                                ? "rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium"
                                : "rounded-xl bg-pink-500 px-4 py-3 text-sm font-medium"
                            : "rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10"
                        }
                      >
                        {getPlatformLabel(platform)}
                      </button>
                    ),
                  )}
                </div>

                {selectedPlatform === "instagram" ? (
                  <>
                    <input
                      value={instagramUsername}
                      disabled={isPageDisabled}
                      onChange={(event) =>
                        setInstagramUsername(event.target.value)
                      }
                      placeholder="Никнейм Instagram (@username или ссылка)"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <p className="text-xs text-zinc-500">
                      Один Instagram аккаунт на модератора. Чтобы добавить другой,
                      сначала отвяжите текущий.
                    </p>
                  </>
                ) : (
                  <>
                    <select
                      value={selectedAccountId}
                      disabled={isPageDisabled || isFreeAccountsLoading}
                      onChange={(event) => {
                        setSelectedAccountId(event.target.value);
                        setConfirmOpenId("");
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">
                        {isFreeAccountsLoading
                          ? "Загрузка аккаунтов..."
                          : `Выберите ${getPlatformLabel(
                              selectedPlatform,
                            )} аккаунт`}
                      </option>

                      {freeSocialAccounts.map((account) => (
                        <option
                          key={`${account.platform}-${account.id}`}
                          value={account.id}
                        >
                          {getPlatformLabel(account.platform)} —{" "}
                          {account.username ?? "Без username"} —{" "}
                          {account.displayName ?? "Без имени"}
                        </option>
                      ))}
                    </select>

                    <input
                      value={confirmOpenId}
                      disabled={isPageDisabled}
                      onChange={(event) => setConfirmOpenId(event.target.value)}
                      placeholder={
                        selectedPlatform === "youtube"
                          ? "Channel ID от владельца YouTube канала"
                          : "OpenId ключ от владельца TikTok аккаунта"
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </>
                )}

                <button
                  type="button"
                  disabled={
                    isPageDisabled ||
                    (selectedPlatform === "instagram"
                      ? !instagramUsername
                      : !selectedAccountId)
                  }
                  onClick={handleConnectAccount}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {(isConnecting || isInstagramConnecting) && <Spinner />}
                  {isConnecting || isInstagramConnecting
                    ? "Добавляем..."
                    : "Добавить аккаунт"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-bold">Аккаунты модератора</h3>

              <div className="mt-4 space-y-3">
                {data?.accounts.map((account) => {
                  const publicUrl = getAccountPublicUrl(account);

                  return (
                    <div
                      key={`${account.platform}-${account.id}`}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="mb-2">
                          <PlatformBadge platform={account.platform} />
                        </div>

                        {publicUrl ? (
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-pink-300 hover:underline"
                          >
                            @{account.username ?? account.displayName}
                          </a>
                        ) : (
                          <p className="font-medium text-pink-300">
                            @{account.username ?? "Без username"}
                          </p>
                        )}

                        <p className="truncate text-sm text-zinc-400">
                          {account.displayName ?? "Без имени"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Сейчас:{" "}
                          {account.isAuthorContent
                            ? "авторский контент"
                            : "не авторский контент"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={isPageDisabled}
                          onClick={() =>
                            handleToggleAuthorContent(
                              account.id,
                              account.platform,
                              account.isAuthorContent,
                            )
                          }
                          className={
                            account.isAuthorContent
                              ? "rounded-lg bg-zinc-500/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              : "rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          }
                        >
                          {account.isAuthorContent
                            ? "Сделать не авторским"
                            : "Сделать авторским"}
                        </button>

                        <button
                          type="button"
                          disabled={isPageDisabled}
                          onClick={() => setDeleteAccountId(account.id)}
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Отвязать
                        </button>
                      </div>
                    </div>
                  );
                })}

                {!data?.accounts.length && (
                  <p className="text-sm text-zinc-400">
                    У модератора пока нет аккаунтов.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteAccountId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
            <h2 className="text-2xl font-bold">Отвязать аккаунт?</h2>

            <p className="mt-3 text-sm text-zinc-400">
              Вы точно подтверждаете отвязку{" "}
              {accountForDelete
                ? getPlatformLabel(accountForDelete.platform)
                : ""}{" "}
              аккаунта{" "}
              <span className="text-pink-300">
                @{accountForDelete?.username ?? "Без username"}
              </span>{" "}
              от модератора?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isPageDisabled}
                onClick={() => setDeleteAccountId(null)}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Отмена
              </button>

              <button
                type="button"
                disabled={isPageDisabled}
                onClick={handleDisconnectAccount}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDisconnecting && <Spinner />}
                {isDisconnecting ? "Отвязываем..." : "Отвязать"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFetching && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-sm text-white shadow-2xl">
          <Spinner className="h-5 w-5" />
          Обновляем статистику...
        </div>
      )}
    </div>
  );
}
