import React from "react";

function SelectOption({
  activeButton,
  handleButtonClick,
  handleSelectChange,
}: {
  activeButton: string;
  handleButtonClick: (button: string) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <select
        className={`h-[40px] w-[141px] rounded-full pl-4 ${
          activeButton === "assignment"
            ? "bg-[#5D233C] text-white"
            : "bg-white hover:bg-gray-100"
        }`}
        onClick={() => handleButtonClick("assignment")}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Assignments
        </option>
        <option value="topic-wise">Topic Wise Assessment</option>
        <option value="exam-form">Exam Form</option>
      </select>
    </div>
  );
}

export default SelectOption;
