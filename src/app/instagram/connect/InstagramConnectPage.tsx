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
          ? "Could not create the Instagram report account. Check the details and try again."
          : "Could not sign in. Check the login and password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="px-4 pb-12 pt-28 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-white/60 hover:text-white">
          Back to New People
        </Link>

        <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-medium text-[#ff4fa3]">
            Instagram Reports
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {isRegisterMode
              ? "Create an Instagram report account"
              : "Sign in to an editor account"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {isRegisterMode
              ? "Register editor access and the Instagram account that will submit metrics for moderator review."
              : "Enter your login and password to open your Instagram reports."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-[8px] border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={
                isRegisterMode
                  ? "rounded-[8px] bg-[#ff4fa3] px-4 py-3 text-sm font-bold text-white"
                  : "rounded-[8px] px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              }
            >
              Register
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
                  ? "rounded-[8px] bg-[#ff4fa3] px-4 py-3 text-sm font-bold text-white"
                  : "rounded-[8px] px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              }
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">Login</label>

              <input
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="editor_login"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="At least 6 characters"
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
                    className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="example_account"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Account URL
                  </label>

                  <input
                    type="url"
                    value={accountUrl}
                    onChange={(event) => setAccountUrl(event.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="https://www.instagram.com/example_account"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Avatar URL
                  </label>

                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-[#ff4fa3] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Optional"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-[8px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-[8px] bg-[#ff4fa3] px-6 py-4 font-bold text-white transition hover:bg-[#ff2f93] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? isRegisterMode
                  ? "Creating..."
                  : "Signing in..."
                : isRegisterMode
                  ? "Create Instagram report account"
                  : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
