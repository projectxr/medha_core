"use client";

import React, { Suspense, useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ChatHistoryArea from "@/components/ChatHistoryArea";
import MedhaTextArea from "@/components/MedhaTextArea";
import TopicWiseForm from "@/components/TopicwiseForm";
import ExamForm from "@/components/ExamForm";
import AudioPlayer from "@/components/AudioPlayer";
import axios from "axios";
import { io, Socket } from 'socket.io-client';
import { useSelection } from "@/context/SelectionContext";


// Remove duplicate polyfills
if (typeof window !== "undefined") {
  require("core-js/stable");
  require("regenerator-runtime/runtime");
}

function Chatbot() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [questionsHistory, setQuestionsHistory] = useState([
    "What is Medha?",
    "Summarize NCEF?",
  ]);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Medha! Ask me anything!",
      sender: "ai",
      isCode: false
    },
  ]);
  const [activeButton, setActiveButton] = useState("chat");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [newText, setNewText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);

  const [chatBackend, setChatBackend] = useState('medha')
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inputText, setInputText] = useState('');
  const [selectedType, setSelectedType] = useState<any>('chat');
  const [isConnected, setIsConnected] = useState(false);
  const [isDone, setIsDone] = useState(false)

  const { language, classNumber, subject } = useSelection();
  
  const router = useRouter();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
    listening,
  } = useSpeechRecognition();

  const updateMessages = useCallback((content: string) => {
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage.message.endsWith(content)) {
        return prevMessages;
      }
      return [
        ...prevMessages.slice(0, -1),
        { ...lastMessage, message: lastMessage.message + content }
      ];
    });
  }, []);
  

  useEffect(() => {
    const newSocket = io('https://medha.cograd.in', {
      path: '/socket.io'
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO Connected');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO Disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (data: { message: string }) => {
      console.error('Socket.IO Error:', data);
      setError(data.message);
    });

    newSocket.on('response', async (data: any) => {
      if (data.content === '[DONE]') {
        setIsDone(true)
        setMessages(prevMessages => {
          let prevMessagesCopy = [...prevMessages]
          const isCode = prevMessagesCopy[prevMessagesCopy.length - 1].message.includes("```");
          prevMessagesCopy[prevMessagesCopy.length - 1].isCode = isCode;
          speakTextWithFemaleVoice(prevMessagesCopy[prevMessagesCopy.length - 1].message);
          return prevMessagesCopy
        });
      } else if  (data.content === '[START]') {
        const aiMessage = {
          message: "",
          sender: "ai",
          direction: "incoming",
          isCode: false
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setLoading(false);
      } else {
        updateMessages(data.content)
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!listening) {
      handleSend(null, transcript);
    }
  }, [listening]);

  useEffect(() => {
    setNewText(transcript);
  }, [transcript]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: any, message: string) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setSrc(null);
    if (!message) setNewText(newTextin => {message = newTextin 
      return newTextin });
    if (!message) return;
    setNewText("");
    resetTranscript();

    const newMessage = { message, direction: "outgoing", sender: "user", language, classNumber, subject };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setQuestionsHistory((prevHistory) => [...prevHistory, message]);
    setTyping(true);

    const maxRetries = 3;
    let retries = 0;

    const makeRequest = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://medha-cograd.azurewebsites.net/text_query/?query=${message}&language=${language}&class_num=${classNumber}&subject=${subject}`;
        const response = await axios.post(apiUrl);
        // query: encodeURIComponent(message),
        // language,
        // class_num: classNumber,
        // subject,
        {
          timeout: 30000;
        } // Set timeout to 30 seconds
        console.log(response);

        let text: string;
        if (typeof response.data === "string") {
          text = response.data;
        } else if (typeof response.data.text === "string") {
          text = response.data.text;
        } else {
          throw new Error("Unexpected response format");
        }

        const isCode = text.includes("```");
        const aiMessage = {
          message: text,
          sender: "ai",
          direction: "incoming",
          isCode,
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setTyping(false);
        setLoading(false);
        setError(null);

        await speakTextWithFemaleVoice(text);

        if (text.toLowerCase().includes("mcq")) {
          setActiveButton("assignment");
          setSelectedOption("topic-wise");
        } else {
          setActiveButton("chat");
        }
      } catch (error) {
        console.error("Error getting response:", error);
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying... Attempt ${retries} of ${maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff
          await makeRequest();
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message:
                "Sorry, there was an error processing your request. Please try again later.",
              sender: "ai",
              direction: "incoming",
              isCode: false
            },
          ]);
          setError(
            `Error: ${error instanceof Error ? error.message : String(error)}`
          );
          setLoading(false);
          setTyping(false);
        }
      }
    };
    
    
    if(chatBackend === 'sumedha'){
        await makeRequest();
    } else if(chatBackend === 'medha') {
      if (socket) {
        setLoading(true);
        socket.emit('request', { ...newMessage, type: 'chat', });
      } else {
        console.error('Socket is not connected');
        setError('Socket is not connected');
      }
    }
  };

  const speakTextWithFemaleVoice = async (text: string) => {
    try {
      const response = await axios.post(
        "https://voicebot-server.onrender.com/generate-speech",
        {
          text,
        }
      );
      if (response.data && response.data.audioUrl) {
        setSrc(response.data.audioUrl);
        setAiSpeaking(true);
      } else {
        throw new Error("Audio URL not found in response");
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      setError(
        `Error generating speech: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const stopSpeaking = () => {
    setSrc(null);
    setAiSpeaking(false);
  };

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  // const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  //   setLanguage(e.target.value);
  // const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  //   setClassNumber(e.target.value);
  // const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  //   setSubject(e.target.value);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(e, newText);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" max-w-7xl mx-auto container">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-x-[62px] mb-6 sm:mb-12 sticky">
          <div className="space-y-1 mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-bold">
              AI Chatbot
            </h1>
            <p className="text-base sm:text-lg lg:text-[20px] text-gray-500">
              Chat with AI Chatbot for needs
            </p>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <div className="flex justify-start sm:justify-end gap-2">
              <button
                className={`rounded-full w-[91px] h-[40px] text-sm sm:text-base transition-colors duration-200 ${
                  chatBackend === "medha"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setChatBackend('medha')}
              >
                Medha
              </button>
              <button
                className={`rounded-full w-[138px] h-[40px] text-sm sm:text-base transition-colors duration-200 ${
                  chatBackend === "sumedha"
                    ? "bg-[#5D233C] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setChatBackend('sumedha')}
              >
                Sumedha
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 mt-6 ">
          <div className="lg:w-1/3 sm:w-1/3 md:w-1/2 lg:h-full min-h-[410px] mb-4 lg:mb-0">
            {selectedOption === "topic-wise" ? (
              <TopicWiseForm />
            ) : selectedOption === "exam-form" ? (
              <ExamForm />
            ) : (
              <ChatHistoryArea questions={questionsHistory} />
            )}
          </div>
          <div className="lg:w-full sm:w-1/3 md:w-1/2 lg:h-full">
            <MedhaTextArea
              messages={messages}
              onSubmit={(e: FormEvent<HTMLFormElement>) => handleSend(e, newText)}
              loading={loading}
              newText={newText}
              setNewText={setNewText}
              startListening={startListening}
              stopSpeaking={stopSpeaking}
              setIsDone={setIsDone}
              listening={listening} 
              isDone={isDone} />
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {src && <AudioPlayer audioUrl={src} />}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default Chatbot;
