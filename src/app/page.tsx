"use client";
import Image from "next/image";
import EnterClassroomArea from "@/components/EnterClassroomArea";
import MyAppsArea from "@/components/MyAppsArea";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectOption from "@/components/homepage/SelectOption";
import TopicWiseForm from "@/components/TopicwiseForm";
import ExamForm from "@/components/ExamForm";

export default function Home() {
  const { clientName } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedOption, setSelectedOption] = useState<string>("assignment");
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");

  //   if (!token) {
  //     // Redirect to login if token is missing
  //     router.push("/login");
  //   } else {
  //     // Allow page to load after the token check is done
  //     setLoading(false);
  //   }
  // }, [router]);

  if (loading) {
    return null; // or a loading spinner if you'd like
  }

  return (
    <div>
      {/* Greeting Section */}
      {/* Greeting Section */}
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between mb-12">
          <div className="space-y-1">
            <div className="text-[40px] font-bold">
              Good Morning {clientName?.split(" ")[0]}!
            </div>
            <div className="text-[20px] text-gray-500">
              Let&apos;s make this day productive
            </div>
          </div>
          {/* <SelectOption
            activeButton={selectedOption}
            handleButtonClick={() => {}}
            handleSelectChange={handleSelectChange}
          /> */}
        </div>

        {/* Main Content Section */}
        <div className="flex space-x-5">
          <div className="w-3/5">
            <MyAppsArea />
          </div>
          <div className="w-2/5">
            {selectedOption === "topic-wise" ? (
              <TopicWiseForm />
            ) : selectedOption === "exam-form" ? (
              <ExamForm />
            ) : (
              <EnterClassroomArea />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
