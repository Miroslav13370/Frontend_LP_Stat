"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

type ReportPeriodType = "CUSTOM" | "WEEK" | "MONTH" | "ALL_TIME";
type ReportStatus = "DRAFT" | "PENDING" | "VERIFIED" | "REJECTED";

type InstagramEditor = {
  id: string;
  login: string;
  connectKey: string;
};

type InstagramAccount = {
  id: string;
  username: string;
  accountUrl: string;
  avatarUrl?: string | null;
};

type InstagramMetricsReport = {
  id: string;
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
  rejectReason?: string | null;
  createdAt: string;
};

type ViralVideo = {
  url: string;
  views: number;
  likes: number;
  publishedAt: string;
  title?: string;
};

type ViralVideoFormItem = {
  url: string;
  views: string;
  likes: string;
  publishedAt: string;
  title: string;
};

type InstagramViralVideosReport = {
  id: string;
  periodType: ReportPeriodType;
  weekStartDate?: string | null;
  weekEndDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  videosCount: number;
  videos: ViralVideo[];
  status: ReportStatus;
  rejectReason?: string | null;
  createdAt: string;
};

type ApiErrorResponse = {
  message?: string | string[];
  reason?: string;
  error?: string;
};

const getCurrentWeekRange = () => {
  const date = new Date();
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    weekStartDate: monday.toISOString().slice(0, 10),
    weekEndDate: sunday.toISOString().slice(0, 10),
  };
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const getErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = (await response.json()) as ApiErrorResponse;

    if (data.reason) return data.reason;
    if (Array.isArray(data.message)) return data.message.join(", ");
    if (data.message) return data.message;
    if (data.error) return data.error;

    return fallback;
  } catch {
    return fallback;
  }
};

const getStatusLabel = (status: ReportStatus) => {
  if (status === "VERIFIED") return "Подтверждён";
  if (status === "REJECTED") return "Отклонён";
  if (status === "DRAFT") return "Черновик";

  return "На проверке";
};

const getStatusClassName = (status: ReportStatus) => {
  if (status === "VERIFIED") {
    return "rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300";
  }

  if (status === "REJECTED") {
    return "rounded-full bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300";
  }

  if (status === "DRAFT") {
    return "rounded-full bg-zinc-500/10 px-4 py-2 text-sm font-bold text-zinc-300";
  }

  return "rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300";
};

const getPeriodLabel = (report: {
  periodType: ReportPeriodType;
  weekStartDate?: string | null;
  weekEndDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}) => {
  if (report.periodType === "ALL_TIME") return "Отчёт за всё время";

  if (report.periodType === "WEEK") {
    return `${report.weekStartDate?.slice(0, 10) ?? "—"} — ${
      report.weekEndDate?.slice(0, 10) ?? "—"
    }`;
  }

  return `${report.startDate?.slice(0, 10) ?? "—"} — ${
    report.endDate?.slice(0, 10) ?? "—"
  }`;
};

export default function InstagramReportsPage() {
  const router = useRouter();

  const [editor, setEditor] = useState<InstagramEditor | null>(null);
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [metricsReports, setMetricsReports] = useState<
    InstagramMetricsReport[]
  >([]);
  const [viralReports, setViralReports] = useState<
    InstagramViralVideosReport[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isReportsLoading, setIsReportsLoading] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSubmittingMetrics, setIsSubmittingMetrics] = useState(false);
  const [isSubmittingViral, setIsSubmittingViral] = useState(false);
  const [isDeletingReportId, setIsDeletingReportId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newAccountUrl, setNewAccountUrl] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const [editingMetricsReportId, setEditingMetricsReportId] = useState<
    string | null
  >(null);
  const [editingViralReportId, setEditingViralReportId] = useState<
    string | null
  >(null);

  const weekRange = getCurrentWeekRange();
  const monthRange = getCurrentMonthRange();

  const [metricsPeriodType, setMetricsPeriodType] =
    useState<ReportPeriodType>("WEEK");
  const [metricsWeekStartDate, setMetricsWeekStartDate] = useState(
    weekRange.weekStartDate,
  );
  const [metricsWeekEndDate, setMetricsWeekEndDate] = useState(
    weekRange.weekEndDate,
  );
  const [metricsStartDate, setMetricsStartDate] = useState("");
  const [metricsEndDate, setMetricsEndDate] = useState("");

  const [currentTotalViews, setCurrentTotalViews] = useState("");
  const [currentTotalLikes, setCurrentTotalLikes] = useState("");
  const [currentVideosCount, setCurrentVideosCount] = useState("");

  const [viralPeriodType, setViralPeriodType] =
    useState<ReportPeriodType>("MONTH");
  const [viralStartDate, setViralStartDate] = useState(monthRange.startDate);
  const [viralEndDate, setViralEndDate] = useState(monthRange.endDate);
  const [viralVideos, setViralVideos] = useState<ViralVideoFormItem[]>([]);

  const selectedAccount = useMemo(() => {
    return accounts.find((account) => account.id === selectedAccountId) ?? null;
  }, [accounts, selectedAccountId]);

  const resetMetricsForm = () => {
    const range = getCurrentWeekRange();

    setEditingMetricsReportId(null);
    setMetricsPeriodType("WEEK");
    setMetricsWeekStartDate(range.weekStartDate);
    setMetricsWeekEndDate(range.weekEndDate);
    setMetricsStartDate("");
    setMetricsEndDate("");
    setCurrentTotalViews("");
    setCurrentTotalLikes("");
    setCurrentVideosCount("");
  };

  const resetViralForm = () => {
    const range = getCurrentMonthRange();

    setEditingViralReportId(null);
    setViralPeriodType("MONTH");
    setViralStartDate(range.startDate);
    setViralEndDate(range.endDate);
    setViralVideos([]);
  };

  const loadReports = async (accountId: string) => {
    if (!accountId) {
      setMetricsReports([]);
      setViralReports([]);
      return;
    }

    setIsReportsLoading(true);

    try {
      const [metricsResponse, viralResponse] = await Promise.all([
        fetch(
          `${serverUrl}/api/instagram-report/metrics/my?instagramAccountId=${accountId}`,
          { credentials: "include" },
        ),
        fetch(
          `${serverUrl}/api/instagram-report/viral-videos/my?instagramAccountId=${accountId}`,
          { credentials: "include" },
        ),
      ]);

      if (!metricsResponse.ok) {
        throw new Error(
          await getErrorMessage(
            metricsResponse,
            "Не удалось загрузить отчёты по статистике.",
          ),
        );
      }

      if (!viralResponse.ok) {
        throw new Error(
          await getErrorMessage(
            viralResponse,
            "Не удалось загрузить отчёты по видео.",
          ),
        );
      }

      setMetricsReports(
        (await metricsResponse.json()) as InstagramMetricsReport[],
      );
      setViralReports(
        (await viralResponse.json()) as InstagramViralVideosReport[],
      );
    } finally {
      setIsReportsLoading(false);
    }
  };

  const loadPage = async (accountId?: string) => {
    const [meResponse, accountsResponse] = await Promise.all([
      fetch(`${serverUrl}/api/instagram-auth/me`, {
        credentials: "include",
      }),
      fetch(`${serverUrl}/api/instagram-account/my`, {
        credentials: "include",
      }),
    ]);

    if (meResponse.status === 401 || accountsResponse.status === 401) {
      router.push("/instagram/connect");
      return;
    }

    if (!meResponse.ok || !accountsResponse.ok) {
      throw new Error("Load failed");
    }

    const editorData = (await meResponse.json()) as InstagramEditor;
    const accountsData = (await accountsResponse.json()) as InstagramAccount[];
    const nextAccountId = accountId || accountsData[0]?.id || "";

    setEditor(editorData);
    setAccounts(accountsData);
    setSelectedAccountId(nextAccountId);

    await loadReports(nextAccountId);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialPage = async () => {
      try {
        setIsLoading(true);
        await loadPage();

        if (!isMounted) return;
      } catch {
        if (!isMounted) return;
        setError("Не удалось загрузить Instagram кабинет.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadInitialPage();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeAccount = async (accountId: string) => {
    setSelectedAccountId(accountId);
    setError("");
    resetMetricsForm();
    resetViralForm();

    try {
      await loadReports(accountId);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось загрузить отчёты выбранного аккаунта.",
      );
    }
  };

  const handleCopyConnectKey = async () => {
    if (!editor?.connectKey) return;
    await navigator.clipboard.writeText(editor.connectKey);
  };

  const handleLogout = async () => {
    await fetch(`${serverUrl}/api/instagram-auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
  };

  const handleAddAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAddingAccount(true);
    setError("");

    try {
      const response = await fetch(`${serverUrl}/api/instagram-account`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername.replace("@", "").trim(),
          accountUrl: newAccountUrl.trim(),
          avatarUrl: newAvatarUrl.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Не удалось добавить аккаунт."),
        );
      }

      const createdAccount = (await response.json()) as InstagramAccount;

      setNewUsername("");
      setNewAccountUrl("");
      setNewAvatarUrl("");

      await loadPage(createdAccount.id);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось добавить Instagram аккаунт.",
      );
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleSubmitMetrics = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAccount) return;

    setIsSubmittingMetrics(true);
    setError("");

    const body = {
      ...(editingMetricsReportId
        ? {}
        : { instagramAccountId: selectedAccount.id }),

      periodType: metricsPeriodType,

      weekStartDate:
        metricsPeriodType === "WEEK" ? metricsWeekStartDate : undefined,
      weekEndDate:
        metricsPeriodType === "WEEK" ? metricsWeekEndDate : undefined,

      startDate: metricsPeriodType === "CUSTOM" ? metricsStartDate : undefined,
      endDate: metricsPeriodType === "CUSTOM" ? metricsEndDate : undefined,

      currentTotalViews: Number(currentTotalViews),
      currentTotalLikes: Number(currentTotalLikes),
      currentVideosCount: Number(currentVideosCount),
    };

    try {
      const response = await fetch(
        editingMetricsReportId
          ? `${serverUrl}/api/instagram-report/metrics/${editingMetricsReportId}`
          : `${serverUrl}/api/instagram-report/metrics`,
        {
          method: editingMetricsReportId ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Не удалось сохранить отчёт."),
        );
      }

      resetMetricsForm();
      await loadReports(selectedAccount.id);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось сохранить отчёт.",
      );
    } finally {
      setIsSubmittingMetrics(false);
    }
  };

  const handleSubmitViral = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAccount) return;

    setIsSubmittingViral(true);
    setError("");

    const videos = viralVideos
      .filter((video) => video.url.trim())
      .map((video) => ({
        url: video.url.trim(),
        views: Number(video.views || 1000),
        likes: Number(video.likes || 0),
        publishedAt: video.publishedAt,
        title: video.title.trim() || undefined,
      }));

    const body = {
      ...(editingViralReportId
        ? {}
        : { instagramAccountId: selectedAccount.id }),

      periodType: viralPeriodType,

      startDate:
        viralPeriodType === "MONTH" || viralPeriodType === "CUSTOM"
          ? viralStartDate
          : undefined,
      endDate:
        viralPeriodType === "MONTH" || viralPeriodType === "CUSTOM"
          ? viralEndDate
          : undefined,

      videos,
    };

    try {
      const response = await fetch(
        editingViralReportId
          ? `${serverUrl}/api/instagram-report/viral-videos/${editingViralReportId}`
          : `${serverUrl}/api/instagram-report/viral-videos`,
        {
          method: editingViralReportId ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Не удалось сохранить видео 1000+."),
        );
      }

      resetViralForm();
      await loadReports(selectedAccount.id);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось сохранить видео 1000+.",
      );
    } finally {
      setIsSubmittingViral(false);
    }
  };

  const handleEditMetricsReport = (report: InstagramMetricsReport) => {
    setEditingMetricsReportId(report.id);
    setMetricsPeriodType(report.periodType);
    setMetricsWeekStartDate(report.weekStartDate?.slice(0, 10) ?? "");
    setMetricsWeekEndDate(report.weekEndDate?.slice(0, 10) ?? "");
    setMetricsStartDate(report.startDate?.slice(0, 10) ?? "");
    setMetricsEndDate(report.endDate?.slice(0, 10) ?? "");
    setCurrentTotalViews(String(report.currentTotalViews));
    setCurrentTotalLikes(String(report.currentTotalLikes));
    setCurrentVideosCount(String(report.currentVideosCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditViralReport = (report: InstagramViralVideosReport) => {
    setEditingViralReportId(report.id);
    setViralPeriodType(report.periodType);
    setViralStartDate(report.startDate?.slice(0, 10) ?? "");
    setViralEndDate(report.endDate?.slice(0, 10) ?? "");
    setViralVideos(
      report.videos.map((video) => ({
        url: video.url,
        views: String(video.views),
        likes: String(video.likes),
        publishedAt: video.publishedAt.slice(0, 10),
        title: video.title ?? "",
      })),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReport = async (
    reportType: "metrics" | "viral-videos",
    reportId: string,
  ) => {
    const isConfirmed = window.confirm("Удалить этот отчёт?");
    if (!isConfirmed) return;

    setIsDeletingReportId(reportId);
    setError("");

    try {
      const response = await fetch(
        `${serverUrl}/api/instagram-report/${reportType}/${reportId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Не удалось удалить отчёт."),
        );
      }

      if (selectedAccountId) {
        await loadReports(selectedAccountId);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось удалить отчёт.",
      );
    } finally {
      setIsDeletingReportId(null);
    }
  };

  const addViralVideo = () => {
    setViralVideos((prev) => [
      ...prev,
      {
        url: "",
        views: "1000",
        likes: "0",
        publishedAt: "",
        title: "",
      },
    ]);
  };

  const updateViralVideo = (
    index: number,
    field: keyof ViralVideoFormItem,
    value: string,
  ) => {
    setViralVideos((prev) =>
      prev.map((video, videoIndex) =>
        videoIndex === index ? { ...video, [field]: value } : video,
      ),
    );
  };

  const removeViralVideo = (index: number) => {
    setViralVideos((prev) =>
      prev.filter((_, videoIndex) => videoIndex !== index),
    );
  };

  return (
    <main className="min-h-screen bg-[#14142f] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← На главную
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            Выйти
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-sm font-medium text-[#ff4fa3]">
                Instagram Cabinet
              </p>

              <h1 className="mt-2 text-3xl font-black">Кабинет монтажёра</h1>

              <p className="mt-3 text-sm leading-6 text-white/60">
                Отдельно отправляйте общую статистику и видео 1000+ на проверку
                модератору.
              </p>

              <div className="mt-6 rounded-2xl border border-[#ff4fa3]/20 bg-[#ff4fa3]/10 p-4">
                <p className="text-sm text-white/55">Ключ монтажёра</p>

                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-xl bg-black/30 px-3 py-2 text-sm text-[#ffb7dc]">
                    {editor?.connectKey ?? "Загрузка..."}
                  </code>

                  <button
                    type="button"
                    disabled={!editor?.connectKey}
                    onClick={handleCopyConnectKey}
                    className="rounded-xl bg-[#ff4fa3] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#ff2f93] disabled:opacity-50"
                  >
                    Копировать
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm text-white/70">
                  Активный Instagram аккаунт
                </label>

                <select
                  value={selectedAccountId}
                  disabled={isLoading || accounts.length === 0}
                  onChange={(event) => handleChangeAccount(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                >
                  {accounts.length === 0 ? (
                    <option value="">Аккаунтов пока нет</option>
                  ) : (
                    accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        @{account.username}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <h2 className="text-xl font-black">Добавить аккаунт</h2>

              <form onSubmit={handleAddAccount} className="mt-5 space-y-4">
                <input
                  required
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="username без @"
                />

                <input
                  required
                  type="url"
                  value={newAccountUrl}
                  onChange={(event) => setNewAccountUrl(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="https://instagram.com/username"
                />

                <input
                  type="url"
                  value={newAvatarUrl}
                  onChange={(event) => setNewAvatarUrl(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="Ссылка на аватарку, необязательно"
                />

                <button
                  disabled={isAddingAccount}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15 disabled:opacity-60"
                >
                  {isAddingAccount ? "Добавляем..." : "Добавить аккаунт"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <h2 className="text-xl font-black">
                {editingMetricsReportId
                  ? "Редактировать общую статистику"
                  : "Отчёт по общей статистике"}
              </h2>

              <form onSubmit={handleSubmitMetrics} className="mt-5 space-y-4">
                <select
                  value={metricsPeriodType}
                  onChange={(event) => {
                    const value = event.target.value as ReportPeriodType;
                    const range = getCurrentWeekRange();

                    setMetricsPeriodType(value);

                    if (value === "WEEK") {
                      setMetricsWeekStartDate(range.weekStartDate);
                      setMetricsWeekEndDate(range.weekEndDate);
                    } else {
                      setMetricsWeekStartDate("");
                      setMetricsWeekEndDate("");
                    }

                    if (value !== "CUSTOM") {
                      setMetricsStartDate("");
                      setMetricsEndDate("");
                    }
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                >
                  <option value="WEEK">Текущая неделя автоматически</option>
                  <option value="CUSTOM">Конкретный промежуток дат</option>
                  <option value="ALL_TIME">Перерасчёт за всё время</option>
                </select>

                {metricsPeriodType === "WEEK" && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                    Неделя: {metricsWeekStartDate} — {metricsWeekEndDate}
                  </div>
                )}

                {metricsPeriodType === "CUSTOM" && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      required
                      value={metricsStartDate}
                      onChange={(event) =>
                        setMetricsStartDate(event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                    />

                    <input
                      type="date"
                      required
                      value={metricsEndDate}
                      onChange={(event) =>
                        setMetricsEndDate(event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                    />
                  </div>
                )}

                <input
                  type="number"
                  required
                  min={0}
                  value={currentTotalViews}
                  onChange={(event) => setCurrentTotalViews(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="Общие просмотры"
                />

                <input
                  type="number"
                  required
                  min={0}
                  value={currentTotalLikes}
                  onChange={(event) => setCurrentTotalLikes(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="Общие лайки"
                />

                <input
                  type="number"
                  required
                  min={0}
                  value={currentVideosCount}
                  onChange={(event) =>
                    setCurrentVideosCount(event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                  placeholder="Количество видео"
                />

                {editingMetricsReportId && (
                  <button
                    type="button"
                    onClick={resetMetricsForm}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-bold text-white"
                  >
                    Отмена редактирования
                  </button>
                )}

                <button
                  disabled={isSubmittingMetrics || !selectedAccount}
                  className="w-full rounded-2xl bg-linear-to-r from-[#ff4fa3] to-[#8b7cff] px-6 py-4 font-bold text-white transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {isSubmittingMetrics
                    ? "Сохраняем..."
                    : "Отправить статистику на проверку"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black">
                  {editingViralReportId
                    ? "Редактировать видео 1000+"
                    : "Видео больше 1000 просмотров"}
                </h2>

                <button
                  type="button"
                  onClick={addViralVideo}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15"
                >
                  + Видео
                </button>
              </div>

              <form onSubmit={handleSubmitViral} className="mt-5 space-y-4">
                <select
                  value={viralPeriodType}
                  onChange={(event) => {
                    const value = event.target.value as ReportPeriodType;
                    const range = getCurrentMonthRange();

                    setViralPeriodType(value);

                    if (value === "MONTH") {
                      setViralStartDate(range.startDate);
                      setViralEndDate(range.endDate);
                    }

                    if (value === "ALL_TIME") {
                      setViralStartDate("");
                      setViralEndDate("");
                    }
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                >
                  <option value="MONTH">Текущий месяц автоматически</option>
                  <option value="CUSTOM">Конкретный промежуток дат</option>
                  <option value="ALL_TIME">За всё время</option>
                </select>

                {(viralPeriodType === "MONTH" ||
                  viralPeriodType === "CUSTOM") && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      required
                      value={viralStartDate}
                      disabled={viralPeriodType === "MONTH"}
                      onChange={(event) =>
                        setViralStartDate(event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3] disabled:opacity-60"
                    />

                    <input
                      type="date"
                      required
                      value={viralEndDate}
                      disabled={viralPeriodType === "MONTH"}
                      onChange={(event) => setViralEndDate(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3] disabled:opacity-60"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {viralVideos.map((video, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-[#14142f] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold">Видео #{index + 1}</p>

                        <button
                          type="button"
                          onClick={() => removeViralVideo(index)}
                          className="rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-200 hover:bg-red-500/10"
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="url"
                          required
                          value={video.url}
                          onChange={(event) =>
                            updateViralVideo(index, "url", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                          placeholder="Ссылка на видео"
                        />

                        <input
                          type="number"
                          min={1000}
                          required
                          value={video.views}
                          onChange={(event) =>
                            updateViralVideo(index, "views", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                          placeholder="Просмотры"
                        />

                        <input
                          type="number"
                          min={0}
                          required
                          value={video.likes}
                          onChange={(event) =>
                            updateViralVideo(index, "likes", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                          placeholder="Лайки"
                        />

                        <input
                          type="date"
                          required
                          value={video.publishedAt}
                          onChange={(event) =>
                            updateViralVideo(
                              index,
                              "publishedAt",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                        />

                        <input
                          value={video.title}
                          onChange={(event) =>
                            updateViralVideo(index, "title", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ff4fa3]"
                          placeholder="Название / пометка, необязательно"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {editingViralReportId && (
                  <button
                    type="button"
                    onClick={resetViralForm}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-bold text-white"
                  >
                    Отмена редактирования
                  </button>
                )}

                <button
                  disabled={isSubmittingViral || !selectedAccount}
                  className="w-full rounded-2xl bg-linear-to-r from-[#ff4fa3] to-[#8b7cff] px-6 py-4 font-bold text-white transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {isSubmittingViral
                    ? "Сохраняем..."
                    : "Отправить видео 1000+ на проверку"}
                </button>
              </form>
            </section>
          </div>

          <section className="space-y-6">
            {(isLoading || isReportsLoading) && (
              <div className="rounded-3xl border border-white/10 bg-white/6 p-6 text-white/60">
                Загрузка...
              </div>
            )}

            {!isLoading && !isReportsLoading && (
              <>
                <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
                  <h2 className="text-2xl font-black">
                    Отчёты по общей статистике
                  </h2>

                  <div className="mt-6 space-y-4">
                    {metricsReports.map((report, index) => {
                      const canEdit = index === 0;

                      return (
                        <div
                          key={report.id}
                          className="rounded-3xl border border-white/10 bg-black/20 p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-white/45">
                                {getPeriodLabel(report)}
                              </p>

                              <h3 className="mt-1 text-xl font-bold">
                                {report.currentTotalViews.toLocaleString(
                                  "ru-RU",
                                )}{" "}
                                просмотров
                              </h3>
                            </div>

                            <div className={getStatusClassName(report.status)}>
                              {getStatusLabel(report.status)}
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-sm text-white/45">
                                Прирост просмотров
                              </p>
                              <p className="mt-2 text-2xl font-black">
                                {report.viewsDelta.toLocaleString("ru-RU")}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-sm text-white/45">
                                Прирост лайков
                              </p>
                              <p className="mt-2 text-2xl font-black">
                                {report.likesDelta.toLocaleString("ru-RU")}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-sm text-white/45">
                                Прирост видео
                              </p>
                              <p className="mt-2 text-2xl font-black">
                                {report.videosDelta.toLocaleString("ru-RU")}
                              </p>
                            </div>
                          </div>

                          {report.rejectReason && (
                            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                              {report.rejectReason}
                            </div>
                          )}

                          {canEdit && (
                            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={() => handleEditMetricsReport(report)}
                                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                              >
                                Редактировать
                              </button>

                              <button
                                type="button"
                                disabled={isDeletingReportId === report.id}
                                onClick={() =>
                                  handleDeleteReport("metrics", report.id)
                                }
                                className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                              >
                                {isDeletingReportId === report.id
                                  ? "Удаляем..."
                                  : "Удалить"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!metricsReports.length && (
                      <div className="rounded-3xl border border-white/10 bg-black/20 p-10 text-center text-white/50">
                        Отчётов по статистике пока нет
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
                  <h2 className="text-2xl font-black">Отчёты по видео 1000+</h2>

                  <div className="mt-6 space-y-4">
                    {viralReports.map((report, index) => {
                      const canEdit = index === 0;

                      return (
                        <div
                          key={report.id}
                          className="rounded-3xl border border-white/10 bg-black/20 p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-white/45">
                                {getPeriodLabel(report)}
                              </p>

                              <h3 className="mt-1 text-xl font-bold">
                                {report.videosCount.toLocaleString("ru-RU")}{" "}
                                видео 1000+
                              </h3>
                            </div>

                            <div className={getStatusClassName(report.status)}>
                              {getStatusLabel(report.status)}
                            </div>
                          </div>

                          {!!report.videos.length && (
                            <div className="mt-5 space-y-2">
                              {report.videos.map((video) => (
                                <a
                                  key={video.url}
                                  href={video.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block break-all rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#ff4fa3]"
                                >
                                  {video.url} —{" "}
                                  {video.views.toLocaleString("ru-RU")}{" "}
                                  просмотров /{" "}
                                  {video.likes.toLocaleString("ru-RU")} лайков
                                </a>
                              ))}
                            </div>
                          )}

                          {report.rejectReason && (
                            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                              {report.rejectReason}
                            </div>
                          )}

                          {canEdit && (
                            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={() => handleEditViralReport(report)}
                                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                              >
                                Редактировать
                              </button>

                              <button
                                type="button"
                                disabled={isDeletingReportId === report.id}
                                onClick={() =>
                                  handleDeleteReport("viral-videos", report.id)
                                }
                                className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                              >
                                {isDeletingReportId === report.id
                                  ? "Удаляем..."
                                  : "Удалить"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!viralReports.length && (
                      <div className="rounded-3xl border border-white/10 bg-black/20 p-10 text-center text-white/50">
                        Отчётов по видео пока нет
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
