"use client";
import React from "react";
import { usePathname } from "next/navigation";
import stepsConfig from "./tools/stepsData.json";


interface AIToolsStepsProps {
  page: string;
  type?: "homework" | "ppt" | "lesson" | "yt"; // keeping "ppt" here as the shorthand for pptcreation
}

interface Step {
  id: number;
  label: string;
  value: string; // value should correspond to the path fragment
}

const StepItem: React.FC<{ step: Step; isActive: boolean }> = ({
  step,
  isActive,
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm ${
        isActive ? "bg-blue-800 text-white" : "bg-white text-blue-800"
      }`}
    >
      {step.id}
    </div>
    <span className="text-xs mt-1">{step.label}</span>
  </div>
);

const Connector: React.FC = () => (
  <div className="w-8 h-0.5 bg-gray-300 mx-2 mb-4" />
);

const AIToolsSteps: React.FC<AIToolsStepsProps> = ({
  page,
  type, // Default type remains homework
}) => {
  const pathname = usePathname();

  // Extract the second-to-last and last part of the path for more precise matching
  const pathParts = pathname.split("/").filter(Boolean);
  const currentSection = (pathParts[pathParts.length - 1] || "").toLowerCase();
  const parentSection = (pathParts[pathParts.length - 2] || "").toLowerCase();

  // Handle case where type might not exist in stepsConfig
  const steps = stepsConfig[type!]?.steps || [];

  const renderSteps = () => {
    return steps.map((step: Step, index: number) => (
      <React.Fragment key={step.id}>
        <StepItem
          step={step}
          // Use .toLowerCase() for case-insensitive comparison
          isActive={
            currentSection === step.value.toLowerCase() ||
            page.toLowerCase() === step.value.toLowerCase() ||
            parentSection === step.value.toLowerCase()
          }
        />
        {index < steps.length - 1 && <Connector />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
      <span className="mr-4 font-bold text-lg">Steps:</span>
      <div className="flex items-center">{renderSteps()}</div>
    </div>
  );
};

export default AIToolsSteps;
