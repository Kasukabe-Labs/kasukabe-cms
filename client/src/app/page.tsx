"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const authHandler = async () => {
    try {
      router.push(`http://localhost:8000/api/auth/google`);
    } catch (error) {
      console.error("Error during authentication:", error);
      throw new Error("Authentication failed");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Welcome to Kasukabe CMS</h1>
      <button
        onClick={authHandler}
        className="bg-blue-600 textwhite px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        login with google
      </button>
    </div>
  );
}
