"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatHistoryArea from "@/components/ChatHistoryArea";
import TopicWiseForm from "@/components/TopicwiseForm";
import ExamForm from "@/components/ExamForm";
import Assessment from "@/components/MCQ"; // Import the MCQSection component

function ChatbotWithMCQ() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedData = searchParams?.get("data") as string;
  const [decodedData, setDecodedData] = useState<any>([]);
  const [questionsHistory, setQuestionsHistory] = useState([
    "What is Medha?",
    "What is Nostavia?",
  ]);
  const [selectedOption, setSelectedOption] = useState("");
  const [qna, setQna] = useState<{ question: string; answer: string }[]>([]);
  const [initialResponse, setInitialResponse] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState("chat");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (encodedData) {
        const parsedData = JSON.parse(decodeURIComponent(encodedData));
        console.log("Decoded Data:", parsedData);
        if (Array.isArray(parsedData.content)) {
          setDecodedData(parsedData.content);
        } else {
          console.error("Decoded data is not an array");
          setError("Data format is invalid. Expected an array.");
        }
      } else {
        console.log("No data found in URL parameters");
        setError("No data found.");
      }
    } catch (error) {
      console.error("Error decoding or parsing data:", error);
      setError("Error decoding or parsing data.");
    }
  }, [encodedData]);

  useEffect(() => {
    fetchInitialMessage();
  }, []);

  const fetchInitialMessage = async () => {
    try {
      const response = await fetch("/api/voiceflow", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const initialMessage =
        data[1]?.payload?.message || "Hello! How can I assist you today?";
      setInitialResponse(initialMessage);
    } catch (error) {
      console.error("Error fetching initial message:", error);
      setError(
        `Error fetching initial message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleButtonClick = (buttonType: string): void => {
    setActiveButton(buttonType);

    if (buttonType === "chat") {
      router.push("/chat");
    } else if (buttonType === "notebook") {
      router.push("/notebook");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleMCQSubmit = async (selectedOption: string) => {
    setQna((prevQna) => [...prevQna, { question: selectedOption, answer: "" }]);
    setQuestionsHistory((prevHistory) => [...prevHistory, selectedOption]);

    try {
      setLoading(true);
      const response = await sendTextToVoiceflow(selectedOption);
      setLoading(false);
      setQna((prevQna) => {
        const newQna = [...prevQna];
        newQna[newQna.length - 1].answer = response;
        return newQna;
      });
      setError(null);
    } catch (error) {
      console.error("Error getting response:", error);
      setQna((prevQna) => {
        const newQna = [...prevQna];
        newQna[newQna.length - 1].answer =
          "Sorry, there was an error processing your request.";
        return newQna;
      });
      setError(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  async function sendTextToVoiceflow(text: string): Promise<string> {
    try {
      const response = await fetch("/api/voiceflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return (
        responseData[1]?.payload?.message || "Sorry, I didn't understand that."
      );
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("NetworkError")
      ) {
        console.error("Network error occurred:", error);
        throw new Error(
          "Network error: Please check your internet connection."
        );
      } else {
        console.error("Error in sendTextToVoiceflow:", error);
        throw error;
      }
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-x-[20px] md:gap-x-[62px] mb-12">
          <div className="space-y-1">
            <div className="text-[30px] md:text-[40px] font-bold">AI Chatbot</div>
            <div className="text-[16px] md:text-[20px] text-gray-500">
              Chat with AI Chatbot for needs
            </div>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <div className="flex justify-start sm:justify-end gap-2">
              <button
                className={`bg-white rounded-full w-[91px] h-[40px] ${
                  activeButton === "learn"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handleButtonClick("learn")}
              >
                Learn
              </button>
              <button
                className={`bg-white rounded-full w-[91px] h-[40px] ${
                  activeButton === "teach"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handleButtonClick("teach")}
              >
                Teach
              </button>
              <button
                className={`rounded-full w-[91px] h-[40px] text-sm sm:text-base transition-colors duration-200 ${
                  activeButton === "chat"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handleButtonClick("chat")}
              >
                Chat
              </button>
              <button
                className={`rounded-full w-[138px] h-[40px] text-sm sm:text-base transition-colors duration-200 ${
                  activeButton === "notebook"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handleButtonClick("notebook")}
              >
                Notebook
              </button>
            </div>
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
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="col-span-1 h-full">
          {selectedOption === "topic-wise" ? (
            <TopicWiseForm />
          ) : selectedOption === "exam-form" ? (
            <ExamForm />
          ) : (
            <ChatHistoryArea questions={questionsHistory} />
          )}
        </div>
        <div className="col-span-2">
          {Array.isArray(decodedData) ? (
            <Assessment data={decodedData} />
          ) : (
            <div className="text-red-500">Invalid or no data found.</div>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </Suspense>
  );

  
  
}

export default ChatbotWithMCQ;
