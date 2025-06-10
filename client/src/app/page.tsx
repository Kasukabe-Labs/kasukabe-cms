"use client";

import { Button } from "@/components/ui/button";
import UIShowcaseCard from "@/components/UIschowcaseCard";
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
    <div className="min-h-screen w-full justify-center items-center flex flex-col mt-24">
      <div className="space-y-4 text-left px-4 ">
        <h1 className="text-6xl font-bold">AI Powered CMS</h1>
        <p className="text-muted-foreground max-w-2xl mt-6 text-lg leading-relaxed">
          Generate random prompts, polish your content with AI, and manage your
          images all in one place with our intelligent content management
          system.
        </p>
        <div className="pt-4">
          <Button
            onClick={handleGetStarted}
            className="px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Prompting
          </Button>
        </div>
      </div>
      <div className="mt-12 w-full">
        <UIShowcaseCard />
      </div>
    </div>
  );
}
