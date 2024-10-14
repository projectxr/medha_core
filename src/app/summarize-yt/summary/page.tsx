import React from "react";
import AIToolsSteps from "@/components/AIToolsSteps";
import CreationArea from "@/components/CreationArea";

function Summary() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Greeting Section */}
      <div className="space-y-1 mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-4 sm:mb-0">
          Summarize Youtube Video
        </div>
        <AIToolsSteps page="Summary" type="yt" />
      </div>

      <div className="bg-white bg-opacity-60 p-8 rounded-3xl h-[100%] flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="summary" className="text-sm font-semibold">
              Summary:
            </label>
            <textarea
              id="summary"
              className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="questions" className="text-sm font-semibold">
              Questions you might be asking:
            </label>
            <textarea
              id="questions"
              className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
