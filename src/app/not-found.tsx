import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/15 text-3xl font-bold text-red-300">
          404
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Страница не найдена
        </h1>

        <p className="mt-4 text-slate-400">
          Такой страницы не существует или она была удалена.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            На главную
          </Link>
        </div>
      </section>
    </div>
  );
}
