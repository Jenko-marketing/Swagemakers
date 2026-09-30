"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-brand-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          defaultValue="admin@swagemakers.com.ar"
          className="mt-1 w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-gray-700">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          defaultValue="swage2026"
          className="mt-1 w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
      <p className="text-center text-xs text-brand-gray-500">
        Demo precargada — usuario y contraseña ya completados.
      </p>
    </form>
  );
}
