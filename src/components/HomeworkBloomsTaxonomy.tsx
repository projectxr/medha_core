import React from "react";
import Image from "next/image";
import SelectableOptions from "./SelectableOptions"; // Assuming this component already exists

const HomeworkBloomsTaxonomy: React.FC = () => {
  // Defining the options arrays for the headings
  const bloomsTaxonomyOptions = [
    "Remembering",
    "Understanding",
    "Applying",
    "Analyzing",
    "Evaluating",
    "Creating",
  ];

  const difficultyOptions = ["Easy", "Medium", "Hard"];

  const questionTypeOptions = ["MCQ", "True/False", "Short Answer"];

  const gradingOptions = ["1", "2", "3", "4", "5"];

  return (
    <div>
      <div className="bg-white bg-opacity-60 p-8 rounded-3xl h-[100%] flex flex-col gap-6">
        <div className="flex flex-col mb-4">
          <div className="text-lg font-bold">Choose Bloom's Taxonomy</div>
          <div className="text-xs text-gray-500">
            Select which type of question to include in your homework
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 rounded-2xl w-full h-auto">
          {/* Bloom's Taxonomy Section */}
          <SelectableOptions
            heading="Bloom's Taxonomy"
            options={bloomsTaxonomyOptions}
          />

          {/* Difficulty Level Section */}
          <SelectableOptions heading="Difficulty" options={difficultyOptions} />

          {/* Type of Question Section */}
          <SelectableOptions
            heading="Type of Question"
            options={questionTypeOptions}
          />

          {/* Grading Section */}
          <SelectableOptions heading="Grading" options={gradingOptions} />
        </div>

        {/* Generate Questions Button */}
        <div className="flex justify-start">
          <button className="text-white bg-[#5D233C] p-4 rounded-full px-6 hover:bg-[#7a2d51]">
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeworkBloomsTaxonomy;
