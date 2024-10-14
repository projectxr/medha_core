"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamic import of Excalidraw with SSR disabled
const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw), { ssr: false });

const ExcalidrawWrapper: React.FC = () => {
  const elements = [
    {
      id: "rect-1",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 186.47265625,
      height: 141.9765625,
      angle: 0,
      strokeColor: "#000000",
      backgroundColor: "#ffffff",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      strokeSharpness: "sharp",
      seed: 1968408242,
      version: 1,
      versionNonce: 1234567890,
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
    },
  ];

  return (
    <div style={{ height: "500px", width: "500px" }}>
      {Excalidraw && (
        <Excalidraw
          initialData={{
            // elements,
            appState: {
              viewBackgroundColor: "#ffffff",
            },
          }}
        />
      )}
    </div>
  );
};

export default ExcalidrawWrapper;
