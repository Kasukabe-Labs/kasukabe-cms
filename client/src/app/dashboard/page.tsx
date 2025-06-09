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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Wand2, Upload, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  _id: string;
  rawPrompt: string;
  polishedPrompt?: string;
  componentType: string;
  type: "random" | "user";
  createdAt: string;
}

interface Image {
  url: string;
  cloudinary_id: string;
  createdAt: string;
}

const componentOptions = [
  { value: "landing-page", label: "Landing Page" },
  { value: "dashboard", label: "Dashboard" },
  { value: "features-section", label: "Features Section" },
  { value: "pricing-page", label: "Pricing Page" },
  { value: "contact-form", label: "Contact Form" },
  { value: "navigation", label: "Navigation" },
  { value: "hero-section", label: "Hero Section" },
  { value: "card-layout", label: "Card Layout" },
  { value: "login-signup", label: "Login/Signup" },
  { value: "footer", label: "Footer" },
];

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [rawPrompt, setRawPrompt] = useState("");
  const [selectedComponentType, setSelectedComponentType] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
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
    if (!selectedComponentType) {
      toast.error("Please select a component type first");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await apiCall("/api/prompt/random", {
        method: "POST",
        body: JSON.stringify({ componentType: selectedComponentType }),
      });
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

    if (!selectedComponentType) {
      toast.error("Please select a component type first");
      return;
    }

    setIsPolishing(true);
    try {
      const data = await apiCall("/api/prompt/polish", {
        method: "POST",
        body: JSON.stringify({
          rawPrompt,
          componentType: selectedComponentType,
        }),
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

  const deletePrompt = async (promptId: string) => {
    setDeletingPromptId(promptId);
    try {
      await apiCall(`/api/prompt/${promptId}`, {
        method: "DELETE",
      });
      setPrompts((prev) => prev.filter((prompt) => prompt._id !== promptId));
      toast.success("Prompt deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete prompt");
    } finally {
      setDeletingPromptId(null);
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
            {/* Component Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select UI Component Type</CardTitle>
                <CardDescription>
                  Choose what type of UI component you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedComponentType}
                  onValueChange={setSelectedComponentType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a component type" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Random Prompt Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Random Prompt
                </CardTitle>
                <CardDescription>
                  Get instant creative inspiration with AI-generated prompts for
                  your selected component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateRandomPrompt}
                  disabled={isGenerating || !selectedComponentType}
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
                  for your selected component
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
                  disabled={
                    isPolishing || !rawPrompt.trim() || !selectedComponentType
                  }
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {prompt.type === "random"
                              ? "Generated"
                              : "Polished"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {componentOptions.find(
                              (opt) => opt.value === prompt.componentType
                            )?.label || prompt.componentType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deletePrompt(prompt._id)}
                            disabled={deletingPromptId === prompt._id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingPromptId === prompt._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
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
