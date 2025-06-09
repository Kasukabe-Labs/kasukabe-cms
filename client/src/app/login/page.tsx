"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

const url = process.env.SERVER_URL;

export default function LoginPage() {
  const handleGoogleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    window.location.href = url!;
  };

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your Kasukabe CMS dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={"outline"}
            onClick={handleGoogleLogin}
            className="w-full"
            size="lg"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
