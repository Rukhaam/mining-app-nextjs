"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth.action";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-semibold text-slate-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
