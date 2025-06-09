/* eslint-disable */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Wand2, Upload, Copy } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  _id: string;
  rawPrompt: string;
  polishedPrompt?: string;
  type: "random" | "user";
  createdAt: string;
}

interface Image {
  url: string;
  cloudinary_id: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [rawPrompt, setRawPrompt] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const backendUrl = "https://kasukabe-cms-prod.onrender.com";

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${backendUrl}${url}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const generateRandomPrompt = async () => {
    setIsGenerating(true);
    try {
      const data = await apiCall("/api/prompt/random", { method: "POST" });
      setPrompts((prev) => [data.data, ...prev]);
      toast.success("Random prompt generated successfully!");
    } catch (error) {
      toast.error("Failed to generate random prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const polishPrompt = async () => {
    if (!rawPrompt.trim()) {
      toast.error("Please enter a prompt to polish");
      return;
    }

    setIsPolishing(true);
    try {
      const data = await apiCall("/api/prompt/polish", {
        method: "POST",
        body: JSON.stringify({ rawPrompt }),
      });
      setPrompts((prev) => [data.data, ...prev]);
      setRawPrompt("");
      toast.success("Prompt polished successfully!");
    } catch (error) {
      toast.error("Failed to polish prompt");
    } finally {
      setIsPolishing(false);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImages((prev) => [data.image, ...prev]);
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Text copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center flex-col mt-20">
      <h2 className="text-4xl font-bold">Dashboard</h2>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Actions */}
          <div className="space-y-6">
            {/* Random Prompt Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Random Prompt
                </CardTitle>
                <CardDescription>
                  Get instant creative inspiration with AI-generated prompts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateRandomPrompt}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Random Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prompt Polisher */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Polish Your Prompt
                </CardTitle>
                <CardDescription>
                  Transform your raw ideas into polished, professional content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="raw-prompt">Your Raw Prompt</Label>
                  <Textarea
                    id="raw-prompt"
                    placeholder="Enter your raw prompt here..."
                    value={rawPrompt}
                    onChange={(e) => setRawPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={polishPrompt}
                  disabled={isPolishing || !rawPrompt.trim()}
                  className="w-full"
                >
                  {isPolishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Polishing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Polish Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Upload and store your images securely in the cloud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Select Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
                <Button
                  onClick={uploadImage}
                  disabled={isUploading || !selectedFile}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Recent Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Prompts</CardTitle>
                <CardDescription>
                  Your latest generated and polished prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prompts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No prompts yet. Generate or polish a prompt to get started!
                  </p>
                ) : (
                  prompts.slice(0, 5).map((prompt) => (
                    <div
                      key={prompt._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {prompt.type === "random" ? "Generated" : "Polished"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              prompt.polishedPrompt || prompt.rawPrompt
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-bold">Raw Prompt:</p>
                          <p className="text-sm ">{prompt.rawPrompt}</p>
                        </div>
                        {prompt.polishedPrompt && (
                          <div>
                            <p className="text-sm font-bold">
                              Polished Prompt:
                            </p>
                            <p className="text-sm">{prompt.polishedPrompt}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Images */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Images</CardTitle>
                <CardDescription>Your latest uploaded images</CardDescription>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No images yet. Upload an image to get started!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(0, 6).map((image) => (
                      <div key={image.cloudinary_id} className="aspect-square">
                        <img
                          src={image.url}
                          alt="Uploaded"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
