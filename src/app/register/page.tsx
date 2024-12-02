import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <RegisterForm />
        <div className="text-right mt-4 text-sm">
          <Link href="/login" className="hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
