"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/admin");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          placeholder="Masukkan password admin"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
