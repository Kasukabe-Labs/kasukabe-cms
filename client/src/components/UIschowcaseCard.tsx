import Image from "next/image";
import React from "react";

export default function UIShowcaseCard() {
  // Sample images - replace with your actual image paths
  const showcaseImages = [
    { src: "/imgs/ui01.png", alt: "Design 1" },
    { src: "/imgs/ui02.png", alt: "Design 2" },
    { src: "/imgs/ui03.png", alt: "Design 3" },
    { src: "/imgs/ui04.png", alt: "Design 4" },
    { src: "/imgs/ui05.png", alt: "Design 5" },
    { src: "/imgs/ui06.png", alt: "Design 6" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Showcase Grid */}
      <div className="w-full justify-center items-center">
        <p className="text-muted-foreground px-3 text-center mb-6 ">
          Designs generated using our prompt engine
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseImages.map((image, index) => (
          <div
            key={index}
            className="group relative rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full h-64">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 transition-colors duration-300" />
            </div>

            {/* Optional: Add a subtle bottom section */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Design {index + 1}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
