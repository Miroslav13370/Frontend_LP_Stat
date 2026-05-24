"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

type FormMode = "register" | "login";

export default function InstagramConnectPage() {
  const router = useRouter();

  const [mode, setMode] = useState<FormMode>("register");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegisterMode = mode === "register";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const endpoint = isRegisterMode
      ? "/api/instagram-auth/register-with-account"
      : "/api/instagram-auth/login";

    const body = isRegisterMode
      ? {
          login,
          password,
          username,
          accountUrl,
          avatarUrl: avatarUrl || undefined,
        }
      : {
          login,
          password,
        };

    try {
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      router.push("/instagram/reports");
    } catch {
      setError(
        isRegisterMode
          ? "Не удалось подключить Instagram аккаунт. Проверьте данные."
          : "Не удалось войти. Проверьте логин и пароль.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14142f] px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-white/60 hover:text-white">
          ← На главную
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-medium text-[#ff4fa3]">
            Instagram Reports
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {isRegisterMode
              ? "Подключите Instagram аккаунт"
              : "Войдите в аккаунт монтажёра"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {isRegisterMode
              ? "Создайте доступ монтажёра и укажите Instagram аккаунт, по которому будете еженедельно отправлять статистику на проверку."
              : "Введите логин и пароль, чтобы перейти к своим Instagram отчётам."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={
                isRegisterMode
                  ? "rounded-xl bg-[#ff4fa3] px-4 py-3 text-sm font-bold text-white"
                  : "rounded-xl px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              }
            >
              Подключить
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={
                !isRegisterMode
                  ? "rounded-xl bg-[#ff4fa3] px-4 py-3 text-sm font-bold text-white"
                  : "rounded-xl px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              }
            >
              Войти
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">Логин</label>

              <input
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="editor_login"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Пароль</label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Минимум 6 символов"
              />
            </div>

            {isRegisterMode && (
              <>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Instagram username
                  </label>

                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="example_account"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Ссылка на аккаунт
                  </label>

                  <input
                    type="url"
                    value={accountUrl}
                    onChange={(event) => setAccountUrl(event.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="https://www.instagram.com/example_account"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Ссылка на аватарку
                  </label>

                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Необязательно"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-linear-to-r from-[#ff4fa3] to-[#8b7cff] px-6 py-4 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? isRegisterMode
                  ? "Подключаем..."
                  : "Входим..."
                : isRegisterMode
                  ? "Подключить Instagram"
                  : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
