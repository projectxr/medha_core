import React, { useState } from "react";

interface SubjectiveQuestion {
  Question: string;
  Answer: string;
}

interface SubjectiveProps {
  data: SubjectiveQuestion[];
}

const Subjective: React.FC<SubjectiveProps> = ({ data }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleQuestionClick = (index: number) => {
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
      setShowAnswer(false);
    } else {
      setActiveQuestionIndex(index);
      setShowAnswer(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [index]: value }));
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  const debug = () => {
    console.log("data", data);
  };

  return (
    <div className="bg-white bg-opacity-60 p-4 sm:p-6 rounded-2xl flex flex-col h-[410px] overflow-auto">
      <h2 className="text-[18px] sm:text-lg font-bold mb-4">
        Subjective Assessment
      </h2>
      {data.map((q, index) => (
        <div
          key={index}
          className={`bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 border-2 ${
            activeQuestionIndex === index
              ? "border-[#1F4467]"
              : "border-transparent"
          }`}
        >
          <button
            className="bg-[#1F4467] text-white rounded-full h-[27px] w-[91px] sm:w-[124px] mb-2 text-center text-[12px] sm:text-[14px]"
            onClick={() => handleQuestionClick(index)}
          >
            Question {index + 1}
          </button>
          {activeQuestionIndex === index && (
            <div>
              <span className="font-bold">Question: </span>
              <span className="mb-4">{q.Question}</span>
              <div className="mt-4">
                <textarea
                  className="w-full h-[80px] sm:h-[100px] p-2 border rounded-lg mb-4"
                  placeholder="Write your answer here..."
                  value={answers[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                <button
                  className="bg-[#1F4467] text-white rounded-full text-[12px] h-[27px] w-[91px] sm:w-[124px]"
                  onClick={handleShowAnswer}
                >
                  Show Answer
                </button>
                {showAnswer && (
                  <p className="mt-4 text-green-600 font-bold">
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

export default Subjective;
