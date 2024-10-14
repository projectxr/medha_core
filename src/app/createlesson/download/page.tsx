"use client";
import React, {useState, useRef} from "react";
import CreationArea from "@/components/CreationArea";
import AIToolsSteps from "@/components/AIToolsSteps";
import HomeworkOutline from "@/components/HomeworkOutline";


const mdStr = `#`;

function LessonOutline() {
  const [markdown, setMarkdown] = useState(mdStr)
  const [loading, setLoading] = useState(false)
  
  
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Greeting Section */}
      
    </div>
  );
}

export default LessonOutline;
