import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const info = {
  homework: {
    title: "Create Homework",
    description: "Create Homework",
  },
  // Add other types here as needed
};

type AIToolCardProps = {
  type: keyof typeof info;
};

function AIToolCard({ type }: AIToolCardProps) {
  const router = useRouter();
  const cardInfo = info[type];

  return (
    <div className="rounded-xl bg-white w-[30%] p-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center">
          <Image
            src="/create_lesson_icon.svg"
            alt="AI"
            width={50}
            height={50}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-bold text-xl">{cardInfo.title}</div>
          <div className="text-gray-400">{cardInfo.title}</div>
        </div>
      </div>
      <div className="mt-4">{cardInfo.description}</div>
      <button
        className="mt-4 p-2 bg-[#C00F0C] rounded-lg w-1/2 text-white"
        onClick={() => {
          router.push(`/${type}/topic`);
        }}
      >
        Create
      </button>
    </div>
  );
}

export default AIToolCard;
