"use client";

import { useAuth } from "@/src/hooks/auth/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";

type AuthFormValues = {
  login: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const { authMutate } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuthFormValues>({
    mode: "onChange",
  });

  const onSubmit = (data: AuthFormValues) => {
    authMutate({ login: data.login, password: data.password }, isLogin);
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/20 text-2xl">
              ✦
            </div>

            <h1 className="text-3xl font-bold">
              {isLogin ? "Вход в аккаунт" : "Создать аккаунт"}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              {isLogin
                ? "Войдите, чтобы продолжить работу"
                : "Зарегистрируйтесь, чтобы начать"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Логин</label>

              <input
                type="text"
                placeholder="Введите логин"
                {...register("login", {
                  required: "Введите логин",
                })}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-pink-500"
              />

              {errors.login && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.login.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Пароль</label>

              <input
                type="password"
                placeholder="Введите пароль"
                {...register("password", {
                  required: "Введите пароль",
                  minLength: {
                    value: 6,
                    message: "Минимум 6 символов",
                  },
                })}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-pink-500"
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Повторите пароль
                </label>

                <input
                  type="password"
                  placeholder="Повторите пароль"
                  {...register("confirmPassword", {
                    required: "Повторите пароль",
                    validate: (value) =>
                      value === watch("password") || "Пароли не совпадают",
                  })}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-pink-500"
                />

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-pink-500 px-4 py-3 font-medium text-white transition hover:bg-pink-600"
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-pink-400 transition hover:text-pink-300"
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
