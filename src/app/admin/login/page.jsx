import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/features/AdminLoginForm";
import { getCurrentSession } from "@/lib/session";

export default async function AdminLoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage dispatch challans.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
