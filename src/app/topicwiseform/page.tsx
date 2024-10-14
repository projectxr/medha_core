"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelection } from "@/context/SelectionContext";
import Assessment from "@/components/MCQ";
import Subjective from "@/components/Subjective";

interface ChapterObject {
  [chapterName: string]: string[];
}

interface SubjectObject {
  [subjectName: string]: ChapterObject[];
}

interface ClassData {
  [className: string]: SubjectObject;
}

export default function TopicWiseForm() {
  const { classNumber, subject } = useSelection();
  const [classData, setClassData] = useState<ClassData>({});
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [totalQuestion, setTotalQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]); // Ensure data is an array
  const [showAssessment, setShowAssessment] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // State variable to track submission

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async (): Promise<void> => {
    try {
      const response = await fetch("https://game.simplem.in/api/class-data");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ClassData = await response.json();
      setClassData(data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !classNumber ||
      !subject ||
      !selectedChapter ||
      !selectedTopic ||
      !selectedLevel ||
      !selectedType ||
      !totalQuestion
    ) {
      alert("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    const payload = {
      class: classNumber,
      subject: subject,
      chapter: selectedChapter,
      topic: selectedTopic,
      type: selectedType,
      level: selectedLevel,
      totalQuestion: totalQuestion,
    };

    try {
      const response = await fetch(
        "https://game.simplem.in/api/submit-topic-wise-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      if (
        Array.isArray(responseData.content) &&
        responseData.content.length > 0
      ) {
        setData(responseData.content); // Ensure we're setting data as an array
        setShowAssessment(true);
        setIsSubmitted(true); // Set submitted state to true
      } else {
        console.error("Unexpected response structure:", responseData);
        setData([]); // Clear data if the response is not in expected format
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChapters = (): JSX.Element[] | null => {
    if (!classNumber || !subject) return null;
    const subjects = classData[classNumber];
    const subjectData = subjects?.[subject];
    if (!subjectData) return null;

    return subjectData.map((chapterObject) => {
      const chapterName = Object.keys(chapterObject)?.[0];
      return (
        <option key={chapterName} value={chapterName}>
          {chapterName}
        </option>
      );
    });
  };

  const renderTopics = (): JSX.Element[] | null => {
    if (!classNumber || !subject || !selectedChapter) return null;

    const subjects = classData[classNumber];
    const subjectData = subjects?.[subject];
    const chapterObject = subjectData?.find(
      (chapterObj) => Object.keys(chapterObj)?.[0] === selectedChapter
    );
    const topics = chapterObject?.[selectedChapter];
    if (!Array.isArray(topics)) return null;

    return topics.map((topic, index) => (
      <option key={index} value={topic}>
        {topic}
      </option>
    ));
  };

  return (
    <div className="flex w-full min-h-screen p-6 gap-6">
      {/* Left side - Configure Assessment */}
      <div className="w-1/3 bg-[#F3F4F8] p-6 rounded-xl">
        <p className="mb-4 font-bold">Create Topic Wise Assessment</p>
        <div className="bg-white bg-opacity-60 p-6 min-h-[410px] rounded-2xl flex flex-col pt-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <select
                className="h-[31px] w-full rounded-full pl-4"
                value={selectedChapter}
                onChange={(e) => handleChange(e, setSelectedChapter)}
                disabled={isSubmitted} // Disable if submitted
              >
                <option value="" disabled>
                  Select Chapter
                </option>
                {renderChapters()}
              </select>
              <select
                className="h-[31px] w-full rounded-full pl-4"
                value={selectedTopic}
                onChange={(e) => handleChange(e, setSelectedTopic)}
                disabled={isSubmitted} // Disable if submitted
              >
                <option value="" disabled>
                  Select Topic
                </option>
                {renderTopics()}
              </select>
              <select
                className="h-[31px] w-full rounded-full pl-4"
                value={selectedLevel}
                onChange={(e) => handleChange(e, setSelectedLevel)}
                disabled={isSubmitted} // Disable if submitted
              >
                <option value="" disabled>
                  Select Hardness Level
                </option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                className="h-[31px] w-full rounded-full pl-4"
                value={selectedType}
                onChange={(e) => handleChange(e, setSelectedType)}
                disabled={isSubmitted} // Disable if submitted
              >
                <option value="" disabled>
                  Select Question Type
                </option>
                <option value="Subjective">Subjective</option>
                <option value="Objective">Objective</option>
                <option value="Reading">Reading</option>
              </select>
              <select
                className="h-[31px] w-full rounded-full pl-4"
                value={totalQuestion}
                onChange={(e) => handleChange(e, setTotalQuestion)}
                disabled={isSubmitted} // Disable if submitted
              >
                <option value="" disabled>
                  Select Total No of Questions
                </option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-12 w-24 bg-[#5D233C] text-white rounded-full"
              disabled={
                !selectedTopic ||
                !selectedType ||
                !selectedLevel ||
                isLoading ||
                isSubmitted // Disable if submitted
              }
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Assessment Content */}
      <div className="w-2/3 bg-[#F3F4F8] p-6 rounded-xl">
        <div className="bg-white bg-opacity-60 p-6 rounded-2xl min-h-[410px]">
          {isSubmitted &&
            data.length > 0 && // Ensure data is an array before mapping
            (selectedType === "Objective" ? (
              <Assessment data={data} />
            ) : selectedType === "Subjective" ? (
              <Subjective data={data} />
            ) : (
              <p>Unknown question type</p>
            ))}
        </div>
      </div>
    </div>
  );
}
