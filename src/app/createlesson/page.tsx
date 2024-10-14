'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import CreationArea from "@/components/CreationArea";
import AIToolsSteps from "@/components/AIToolsSteps";
import { Socket, io } from "socket.io-client";
import { useSelection } from "@/context/SelectionContext";
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function LessonCreation() {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lessonPlanMd, setLessonPlanMd] = useState("");
  const [loading, setLoading] = useState(false);
  const {  subject, classNumber, language } = useSelection();
  const [selectedTopic, setSelectedTopic] = useState("");

  const previewRef = useRef(null);

  const exportToPdf = async () => {
    setLoading(true)
    if (!previewRef.current) return;

    const previewElement = previewRef.current?.querySelector('.md-editor-preview-wrapper');
    console.log(previewElement)
    if (!previewElement) return;

    try {
      const canvas = await html2canvas(previewElement);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('lesson-plan.pdf');
      setLoading(false)
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };


  const updateMessages = useCallback((content: string) => {
    setLessonPlanMd(prevLessonPlanMd => {
      if (prevLessonPlanMd.endsWith(content)) {
        return prevLessonPlanMd;
      }
      return prevLessonPlanMd + content;
    });
  }, []);
  
  useEffect(() => {
    const newSocket = io('https://medha.cograd.in', {
      path: '/socket.io'
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO Connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO Disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (data: { message: string }) => {
      console.error('Socket.IO Error:', data);
    });

    newSocket.on('response', async (data: any) => {
      if  (data.content === '[START]') {
        const aiMessage = {
          message: "",
          sender: "ai",
          direction: "incoming",
          isCode: false
        };
        setLoading(false);
      } else {
        updateMessages(data.content)
      }
    });

    

    setSocket(newSocket);

    return () => {
      setLessonPlanMd("")
      newSocket.disconnect();
    };
  }, []);


  const requestLessonPlan = () => {
    if (socket) {
      setLoading(true);
      socket.emit('request', { subject, selectedTopic, classNumber, language, type: 'lesson_plan', });
    } else {
      console.error('Socket is not connected');
    }
  }

  return (
   lessonPlanMd.length === 0 ?( <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Greeting Section */}
      <div className="space-y-1 mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-4 sm:mb-0">
          Create Lesson
        </div>
        <AIToolsSteps page="topic" type="lesson" />
      </div>
      <div>
        <CreationArea page="lesson" setSelectedTopic={setSelectedTopic} requestLessonPlan={requestLessonPlan}  />
      </div>
    </div>): <><div className="space-y-1 mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-4 sm:mb-0">
          Update Lesson and Download
        </div>
        <AIToolsSteps page="download" type="lesson" />
      </div>
      <div ref={previewRef}>
          <MdEditor
            modelValue={lessonPlanMd}
            preview={true}
            onChange={setLessonPlanMd}
            previewTheme="github"
            style={{ height: '100%' }}
            language="en-US"
          />
      </div>
      <button
          className="text-white bg-[#5D233C] p-4 mt-6 rounded-full px-6"
          onClick={() => exportToPdf()}
          disabled={loading}
        >
          {loading? "Generating PDF" : "Download Lesson Plan"}
        </button>
        </>
  );
}

export default LessonCreation;
