"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full justify-center items-center flex flex-col">
      <div className="space-y-4 text-left px-4">
        <h1 className="text-5xl font-bold text-primary">AI Powered CMS</h1>
        <p className="text-muted-foreground max-w-xl mt-2">
          Generate random prompts, polish your content with AI, and manage your
          images all in one place.
        </p>
        <Button onClick={handleGetStarted}>Get Started</Button>
      </div>
    </div>
  );
}
