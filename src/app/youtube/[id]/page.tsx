import Link from "next/link";
import { notFound } from "next/navigation";

type YouTubeUser = {
  id: string;
  google_sub: string;
  youtube_channel_id: string;
  youtube_title: string | null;
  youtube_description: string | null;
  youtube_custom_url: string | null;
  youtube_thumbnail_url: string | null;
  isAuthorContent: boolean;
  planTarget: number;
  moderatorId: string | null;
  created_at: string;
  updated_at: string;
};

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function getYouTubeUser(id: string): Promise<YouTubeUser | null> {
  const response = await fetch(`${serverUrl}/api/youtube-user/by-id/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function YouTubePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getYouTubeUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070A13] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← На главную
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={user.youtube_thumbnail_url || "/uploads/no-user-image.jpg"}
              alt={user.youtube_title || "YouTube channel"}
              className="h-28 w-28 rounded-full object-cover"
            />

            <div>
              <p className="mb-2 text-sm text-red-400">
                YouTube аккаунт подключён
              </p>

              <h1 className="text-3xl font-bold">
                {user.youtube_title || "Без названия"}
              </h1>

              {user.youtube_custom_url && (
                <p className="mt-2 text-white/50">{user.youtube_custom_url}</p>
              )}

              <p className="mt-2 text-sm text-white/40">
                Channel ID: {user.youtube_channel_id}
              </p>
            </div>
          </div>

          {user.youtube_description && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="mb-2 text-lg font-semibold">Описание канала</h2>

              <p className="whitespace-pre-line text-sm leading-6 text-white/60">
                {user.youtube_description}
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-white/50">Тип контента</p>

              <p className="mt-2 text-xl font-bold">
                {user.isAuthorContent ? "Авторский" : "Не авторский"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-white/50">План</p>

              <p className="mt-2 text-xl font-bold">{user.planTarget}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-white/50">Модератор</p>

              <p className="mt-2 text-xl font-bold">
                {user.moderatorId ? "Назначен" : "Не назначен"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
