"use client";
import React from "react";
import CreationArea from "@/components/CreationArea";
import AIToolsSteps from "@/components/AIToolsSteps";
import HomeworkOutline from "@/components/HomeworkOutline";

function PPTOutline() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Greeting Section */}
      <div className="space-y-1 mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-4 sm:mb-0">
          PPT Creation
        </div>
        <AIToolsSteps page="outline" type="ppt" />
      </div>
      <div>
        <HomeworkOutline />
      </div>
    </div>
  );
}

export default PPTOutline;
