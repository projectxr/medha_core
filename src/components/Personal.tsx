"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelection } from "../context/SelectionContext";
import { useUser } from "@/context/UserContext";
import { classDataValues } from "@/context/class_data";
interface ChapterObject {
  [chapterName: string]: string[];
}

interface SubjectObject {
  [subjectName: string]: ChapterObject[];
}

interface ClassData {
  [className: string]: SubjectObject;
}

function Personal() {
  const {clientName}= useUser()
  const { language, setLanguage, classNumber, setClassNumber, subject, setSubject, setDataContext } = useSelection();
  
  const [classData, setClassData] = useState<any>({});
  const [selectedClass, setSelectedClass] = useState<string>(classNumber || "");
  const [selectedSubject, setSelectedSubject] = useState<string>(subject || "");

  // const [userName, setUserName] = useState<string>("Your Name"); // State for user's name

  // Fetch user data on component mount
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5217/api/v1/client/name", {
  //         method: "GET",
  //         credentials: "include" // Include cookies with the request (important for auth)
  //       });
        
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user data");
  //       }

  //       const data = await response.json();
  //       setUserName(data.name); // Update the userName state with the fetched name
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // Fetch class data on component mount
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        
        const data = classDataValues;
        setClassData(data);
        setDataContext(data['6']['Science'])
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    
    fetchClassData();
  }, []);

  // Handle class selection change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    setSelectedSubject(""); // Reset subject when class changes
    setClassNumber(selectedClass); // Update the context with the selected class
  };

  // Handle subject selection change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);
    setSubject(selectedSubject); // Update the context with the selected subject
    setDataContext(classData[selectedClass][selectedSubject])
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

  return (
    <div className="p-2 sm:p-4">
      <div className="flex items-center justify-end gap-1 xs:gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-full h-[40px] pl-4"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            {/* Add more language options as needed */}
          </select>

          {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="rounded-full h-[40px] pl-4"
          >
            <option value="" disabled>Select Class</option>
            {Object.keys(classData).map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>

          {/* Subject Selector */}
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="rounded-full h-[40px] pl-4"
            disabled={!selectedClass}
          >
            <option value="" disabled>Select Subject</option>
            {Object.keys(classData[selectedClass] || {}).map((subjectOption) => (
              <option key={subjectOption} value={subjectOption}>
                {subjectOption}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block w-[1px] h-[30px] bg-[#B3B4B9]"></div>

        {/* User Information */}
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0">
            <Image
              width={32}
              height={32}
              src="/Screenshot_2024-08-17_at_8.13.58_AM-removebg-preview 3.png"
              alt="User Avatar"
              className="w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8"
            />
          </div>
          <div className="flex flex-col justify-center pl-1 xs:pl-2 min-w-0 max-w-[100px] xs:max-w-[120px] sm:max-w-none">
            <div className="text-black text-xs xs:text-sm sm:text-base font-bold truncate">{clientName}</div>
            <div className="text-[10px] xs:text-xs sm:text-sm text-gray-800 truncate">Admin/Teacher</div>
          </div>
        </div>

        <div className="hidden xs:flex flex-col justify-center pl-1 xs:pl-2 min-w-0 max-w-[80px] xs:max-w-[100px] sm:max-w-none">
          <div className="text-black text-[10px] xs:text-xs sm:text-sm font-semibold truncate">Institute</div>
          <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 truncate">Department</div>
        </div>
      </div>
    </div>
  );
}

export default Personal;
