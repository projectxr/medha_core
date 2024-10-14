"use client";
import React, { useState } from "react";
import Image from "next/image";

interface SelectableOptionsProps {
  heading: string;
  options: string[];
  iconSrc?: string;
  initialSelected?: string;
  onSelectionChange?: (selected: string) => void;
}

const SelectableOptions: React.FC<SelectableOptionsProps> = ({
  heading,
  options,
  iconSrc = "/outcome.svg",
  initialSelected,
  onSelectionChange,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    initialSelected || options[0]
  );

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onSelectionChange) {
      onSelectionChange(option);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white p-6 rounded-2xl w-full h-auto">
        <div className="flex flex-row gap-4 mb-4 items-center">
          {iconSrc && (
            <div className="relative w-5 h-5">
              <Image
                src={iconSrc}
                alt={`${heading} icon`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          <div>{heading}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {options.map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded-xl ${
                selectedOption === option
                  ? "bg-[#1F4467] text-white"
                  : "bg-gray-100 border border-[#1F4467]"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectableOptions;
