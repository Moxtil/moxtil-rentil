import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5 overflow-hidden relative">
      <div className="absolute inset-0  animate-gradient-x blur-3xl opacity-40"></div>
      <div className="absolute inset-0 animate-gradient-y blur-3xl opacity-30"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-br from-gray-500 via-gray-700 to-black bg-clip-text text-transparent">
          Create Your Account!{" "}
        </h1>

        <SignUp forceRedirectUrl="/browse" signInUrl="/sign-in" />
      </div>
    </main>
  );
}
