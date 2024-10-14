"use client";
import React from "react";
import Image from "next/image";
import AIToolCard from "@/components/AIToolCard";

const Page = () => {
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-8">
        {/* Left section with title and description */}
        <div>
          <h1 className="text-black text-[40px] font-bold">AI Tools</h1>
          <p className="text-[20px] text-[#696969]">
            A small description of AI Tools
          </p>
        </div>
        {/* Right section with search bar and dropdown */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Image
              className="absolute left-3"
              src="/Search.svg"
              width={20}
              height={18}
              alt="Search Icon"
            />
            <input
              className="h-[40px] w-[215px] rounded-full pl-10 placeholder-gray-900"
              type="text"
              placeholder="Search"
              style={{ textAlign: "left" }}
            />
          </div>
          {/* Dropdown */}
          <select className="h-[40px] w-[156px] rounded-full pl-4 cursor-pointer">
            <option value="" disabled selected>
              Most Popular
            </option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
      </div>
      {/* AIToolCards */}
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {[...Array(1)].map((_, index) => (
          <AIToolCard key={index} type="homework" />
        ))}
      </div>
    </div>
  );
};

export default Page;
