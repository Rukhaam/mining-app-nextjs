import AdminDashboard from "@/components/features/AdminDashboard";
import { logoutAction } from "@/actions/auth.action";
import { requireAdminSession } from "@/lib/session";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Admin
            </p>
            <h1 className="text-lg font-bold text-slate-900">
              Dispatch Dashboard
            </h1>
          </div>
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              {session.username}
            </span>
            <button
              type="submit"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <AdminDashboard />
    </>
  );
}
