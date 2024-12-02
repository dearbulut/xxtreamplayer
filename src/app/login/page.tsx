import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="text-right mt-4 text-sm">
          <Link href="/register" className="hover:underline">
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
