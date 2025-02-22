import Link from "next/link";
import GoogleAuthButton from "../../_components/auth/GoogleAuthButton";
import SeparatorLine from "@/app/(application)/_components/UI/SeparatorLine";
import BasicAuthSignUp from "../../_components/auth/BasicAuthSignUp";
import Image from "next/image";

export function generateMetadata() {
  return {
    title: "WorkFlow | Signup",
    description: "WorkFlow Signup Page",
  };
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-[60%] flex flex-col justify-center items-center px-6 md:px-12 bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-4xl font-medium mb-3 text-center">Welcome to WorkFlow</h1>
          <p className="text-base md:text-lg mb-8 text-center">Get started - it&apos;s free. No Credit card needed.</p>
          <GoogleAuthButton text="Continue with Google" type="login" className="w-full border border-gray-200 rounded-sm py-2 hover:bg-gray-100 flex items-center justify-center space-x-1" />
          <SeparatorLine text="Or" />
          <BasicAuthSignUp />

          <p className="mt-10 text-sm text-center">
            By proceeding, you agree to the{" "}
            <Link href={"/terms-of-service"} className="text-blue-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={"/privacy-policy"} className="text-blue-600">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-2 text-sm text-center">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block w-[40%] relative">
        <Image src="/welcome.avif" alt="Welcome" fill className="object-cover" />
      </div>
    </div>
  );
}
