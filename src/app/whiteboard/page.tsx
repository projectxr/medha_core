"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";

// Dynamic import with proper type
const Excalidraw = dynamic<React.ComponentProps<typeof import("@excalidraw/excalidraw").Excalidraw>>(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

const ExcalidrawWrapper: React.FC = () => {
  const onMount = useCallback((api: ExcalidrawImperativeAPI) => {
    // You can use the api here if needed
    console.log("Excalidraw mounted", api);
  }, []);

  const initialElements: ExcalidrawElement[] = [
    {
      type: "rectangle",
      version: 1,
      versionNonce: 361174001,
      isDeleted: false,
      id: "oDVXy8D6rom3H1-LLH2-f",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      angle: 0,
      x: 100,
      y: 100,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      width: 200,
      height: 100,
      seed: 1968410350,
      groupIds: [],
      roundness: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    } as any,
  ];

  const initialData: { elements: ExcalidrawElement[]; appState: Partial<AppState> } = {
    elements: initialElements,
    appState: { 
      viewBackgroundColor: "#ffffff",
      currentItemFontFamily: 1,
    },
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        // ref={onMount}
        initialData={initialData}
      />
    </div>
  );
};

export default ExcalidrawWrapper;