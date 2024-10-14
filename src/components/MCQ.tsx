import React, { useState, useEffect } from "react";

interface Question {
  Question: string;
  Options: string[];
  Answer: string;
}

interface AssessmentProps {
  data: Question[];
}

const Assessment: React.FC<AssessmentProps> = ({ data }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleQuestionClick = (index: number) => {
    if (activeQuestionIndex === index) {
      // Collapse the question if it's already open
      setActiveQuestionIndex(null);
      setShowAnswer(false);
    } else {
      // Expand the new question
      setActiveQuestionIndex(index);
      setShowAnswer(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div className="bg-white bg-opacity-60 p-6 rounded-2xl flex flex-col h-[410px] overflow-scroll">
      {/* <button className=" bg-red=500" onClick={debug}>
        {" "}
        Debug{" "}
      </button> */}
      <h2 className="text-lg font-bold mb-4">Assessment</h2>

      {data.map((q, index) => (
        <div
          key={index}
          className={`bg-white p-4 rounded-lg shadow-md mb-4 border-2 ${
            activeQuestionIndex === index
              ? "border-[#1F4467]"
              : "border-transparent"
          }`}
        >
          <button
            className="bg-[#1F4467] text-white rounded-full h-[27px] w-[124px] mb-2 text-center text-[12px]"
            onClick={() => handleQuestionClick(index)}
          >
            Question {index + 1}
          </button>
          {activeQuestionIndex === index && (
            <div>
              <span className="font-bold">Question: </span>
              <span className="mb-4">{q.Question}</span>
              <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                {q.Options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <button className="w-full max-h-fit min-h-[35px] text-left pl-4 bg-gray-300 rounded-lg">
                      {option}
                    </button>
                  </div>
                ))}
                <button
                  className="bg-[#1F4467] text-white rounded-full text-[12px] h-[27px] w-[124px] col-span-2"
                  onClick={handleShowAnswer}
                >
                  Show Answer
                </button>
                {showAnswer && (
                  <p className="mt-4 text-green-600 font-bold col-span-2">
                    Correct Answer: {q.Answer}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Assessment;
