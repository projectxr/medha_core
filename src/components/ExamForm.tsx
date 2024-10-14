import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "../context/SelectionContext"; // Import the context

interface ChapterObject {
  [chapterName: string]: string[];
}

interface SubjectObject {
  [subjectName: string]: ChapterObject[];
}

interface ClassData {
  [className: string]: SubjectObject;
}

export default function ExamForm() {
  const router = useRouter();
  const { classNumber, subject, language } = useSelection(); // Destructure the class, subject, and language from context
  const [classData, setClassData] = useState<ClassData>({});
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    totalQuestions: "",
    trueFalse: "",
    mcq: "",
    fillInTheBlanks: "",
    short: "",
    long: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
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

  const handleMultipleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setter(selectedOptions);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      class: classNumber, // Use the class selected in Personal
      subject: subject, // Use the subject selected in Personal
      language: language, // Use the language selected in Personal
      chapters: selectedChapters,
      topics: selectedTopics,
      ...formData, // Include the form data (totalQuestions, mcq, etc.)
    };

    try {
      const response = await fetch(
        "https://game.simplem.in/api/submit-exam-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Form submitted successfully. Response:", responseData);

      // router.push("/response-exam");
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

    return subjectData.map((chapterObject, index) => {
      const chapterName = Object.keys(chapterObject)[0];
      return (
        <option key={chapterName} value={chapterName}>
          {chapterName}
        </option>
      );
    });
  };

  const renderTopics = (): JSX.Element[] | null => {
    if (!classNumber || !subject || selectedChapters.length === 0) return null;

    const topicsSet = new Set<string>();

    selectedChapters.forEach((chapter) => {
      const subjects = classData[classNumber];
      const subjectData = subjects?.[subject];
      const chapterObject = subjectData?.find(
        (chapterObj) => Object.keys(chapterObj)[0] === chapter
      );
      if (chapterObject) {
        const topics = chapterObject[chapter];
        topics.forEach((topic: string) => topicsSet.add(topic));
      }
    });

    return Array.from(topicsSet).map((topic, index) => (
      <option key={index} value={topic}>
        {topic}
      </option>
    ));
  };

  return (
    <div className="bg-white bg-opacity-60 p-6 rounded-2xl min-h-[410px] flex flex-col pt-4 flex-grow overflow-scroll ">
      <p className="mb-4 font-bold">Create Exam Form</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            value={selectedChapters[0] || ""} // Use first selected chapter or empty string
            onChange={(e) => setSelectedChapters([e.target.value])} // Set selected chapter as an array with one value
          >
            <option value="" disabled>
              Select Chapter
            </option>
            {renderChapters()}
          </select>
          <select
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            value={selectedTopics}
            onChange={(e) => handleMultipleChange(e, setSelectedTopics)}
          >
            <option value="" disabled>
              Select Topic
            </option>
            {renderTopics()}
          </select>
          <select
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Total Questions
            </option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </select>
          <input
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            type="number"
            name="trueFalse"
            value={formData.trueFalse}
            onChange={handleInputChange}
            placeholder="True/False Questions"
            min="0"
          />
          <input
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            type="number"
            name="mcq"
            value={formData.mcq}
            onChange={handleInputChange}
            placeholder="MCQ Questions"
            min="0"
          />
          <input
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            type="number"
            name="fillInTheBlanks"
            value={formData.fillInTheBlanks}
            onChange={handleInputChange}
            placeholder="Fill in the Blanks"
            min="0"
          />
          <input
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            type="number"
            name="short"
            value={formData.short}
            onChange={handleInputChange}
            placeholder="Short Questions"
            min="0"
          />
          <input
            className="h-[31px] w-full rounded-full pl-4 text-xs sm:text-sm"
            type="number"
            name="long"
            value={formData.long}
            onChange={handleInputChange}
            placeholder="Long Questions"
            min="0"
          />
        </div>
        <div className="flex space-x-4 justify-center sm:justify-start">
          <button
            type="submit"
            className="h-[40px] sm:h-12 w-[107px] sm:w-24 bg-[#5D233C] text-white rounded-full text-xs sm:text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
