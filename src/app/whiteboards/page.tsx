import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-black text-[40px] font-bold">Whiteboards</h1>
          <div className="text-[#696969] text-[20px]">
            Create a whiteboard for you
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative flex items-center justify-center">
            <Image
              className="absolute right-3"
              src="/Search.svg"
              width={20}
              height={18}
              alt=""
            />
            <input
              className="h-[40px] w-[215px] rounded-full placeholder-gray-900 pl-4"
              type="text"
              placeholder="Search"
              style={{ textAlign: "left" }}
            />
          </div>
          <select className="h-[40px] w-[156px] rounded-full ml-4 pl-4">
            <option value="" disabled selected>
              Last Modified
            </option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <select className="h-[40px] w-[106px] rounded-full ml-4 pl-4">
            <option value="" disabled selected>
              All Files
            </option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <div className="relative ml-4">
            <Image
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              src="/plus.svg"
              width={20}
              height={20}
              alt=""
            />
            <button className="h-[40px] w-[155px] rounded-full bg-white text-gray-900 pl-8">
              Create Folder
            </button>
          </div>
        </div>
      </div>
      <div className="relative pt-8">
        <a href="/whiteboard" className="relative inline-block">
          <Image
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
            width={22}
            height={22}
            src="/Plus circle.svg"
            alt=""
          />
          <button className="h-[65px] w-[240px] bg-white rounded-2xl font-bold pl-4">
            New Whiteboard
          </button>
        </a>
      </div>
    </div>
  );
};

export default Page;
