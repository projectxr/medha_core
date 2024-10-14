"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import EnterClassroomArea from "@/components/EnterClassroomArea";
import Image from "next/image";
import MyAppsArea from "@/components/MyAppsArea";
import ChatHistoryArea from "@/components/ChatHistoryArea";
import MedhaTextArea from "@/components/MedhaTextArea";

function Chatbot() {
  const [questionsHistory, setQuestionsHistory] = useState([
    "What is Medha?",
    "What is Nostavia?",
  ]);
  const [qna, setQna] = useState([
    { question: "What is Medha?", answer: "Medha is an AI Chatbot" },
  ]);
  const [activeButton, setActiveButton] = useState("chat"); // State to manage active button

  const router = useRouter(); // Initialize useRouter

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType); // Set active button

    if (buttonType === "chat") {
      router.push("/chat"); // Navigate to chat page
    } else if (buttonType === "notebook") {
      router.push("/notebook"); // Navigate to notebook page
    }
  };

  return (
    <div>
      <div className="p-10 ">
        {/* Greeting Section */}
        <div className="flex justify-between gap-x-[62px]">
          <div className="space-y-1 mb-12 pl-2">
            <div className="text-[40px] font-bold">AI Chatbot</div>
            <div className="text-[20px] text-gray-500">
              Chat with AI Chatbot for needs
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <div>
              <button
                className={`rounded-3xl w-[91px] h-[41px] ${
                  activeButton === "chat"
                    ? "bg-[#C00F0C] text-white"
                    : "bg-white"
                }`}
                onClick={() => handleButtonClick("chat")}
              >
                Chat
              </button>
            </div>
            <div>
              <button
                className={`rounded-3xl w-[138px] h-[41px] ${
                  activeButton === "notebook"
                    ? "bg-[#C00F0C] text-white"
                    : "bg-white"
                }`}
                onClick={() => handleButtonClick("notebook")}
              >
                Notebook
              </button>
            </div>
          </div>
        </div>

        <div className="relative pt-4 pl-2">
          <a href="/whiteboard">
            <Image
              className="absolute left-8 bottom-6 "
              width={22}
              height={22}
              src="/Plus circle.svg"
              alt=""
            />

            <button className="h-[65px] w-[240px] bg-white rounded-2xl font-bold">
              New Notebook
            </button>
          </a>
        </div>

        <div className=" text-[20px] text-gray-500 pt-16">
          All Notebooks
          <div className="flex gap-6">
            <div className="relative pt-16 pl-4">
              <a href="/whiteboard">
                <Image
                  className="absolute left-8 bottom-6 "
                  width={22}
                  height={22}
                  src="/Book.svg"
                  alt=""
                />

                <button className="h-[65px] w-[240px] bg-white rounded-2xl font-bold">
                  Notebook 1
                </button>
              </a>
            </div>
            <div className="relative pt-16 pl-10">
              <a href="/whiteboard">
                <Image
                  className="absolute left-16 bottom-6 "
                  width={22}
                  height={22}
                  src="/Book.svg"
                  alt=""
                />

                <button className=" h-[65px] w-[240px] bg-white rounded-2xl font-bold">
                  Notebook 2
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
