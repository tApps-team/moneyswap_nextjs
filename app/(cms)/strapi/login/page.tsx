import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/cms/ui/auth/login-form";

export const metadata: Metadata = { title: "Вход" };

export default function CmsLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      {/* useSearchParams внутри формы требует границы Suspense */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
